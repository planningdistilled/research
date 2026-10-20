"""modern.gov committee pages: list planning-committee meetings and download their reports and minutes.

Council row: base_url = the democracy site root (e.g. https://democracy.example.gov.uk); committee_re = a regex
for the committee's name as the calendar titles it (case-insensitive; blank = planning / development management
or control / regulatory). Items are meetings (kind 'meeting'), one per calendar entry, ref 'meeting-<date>-<MId>'.

Pages used (all public, no login):
    mgCalendarMonthView.aspx?M=<m>&Y=<y>&GL=1    one month; links ieListDocuments.aspx?CId=..&MId=.. with a
                                                 title attribute "Meeting of <name>, dd/mm/yyyy <time>"
    ieListDocuments.aspx?CId=..&MId=..           agenda items (table rows keyed by class mgItemNumberCell) with
                                                 documents/sNNN/<name>.pdf links; header documents/gNNN/..pdf?T=n
                                                 (T=0 frontsheet, T=10 reports pack, T=11 printed minutes, which
                                                 appear weeks later) and documents/bNNN/..?T=9 (addendum pack)
Many *.moderngov.co.uk hosts sit behind Cloudflare and answer 403 "Just a moment"; Http raises Blocked for those.
"""
import datetime as dt
import html
import os
import re
import urllib.parse

from . import common as c

KIND = 'moderngov'
DEFAULT_COMMITTEE_RE = r'planning|development (management|control)|regulatory'
CAL_LINK = re.compile(r'<a\b[^>]*href="(ieListDocuments\.aspx\?CId=(\d+)&(?:amp;)?MId=(\d+))"[^>]*>(.*?)</a>', re.S | re.I)
TITLE_ATTR = re.compile(r'title="([^"]*)"')
DOC_LINK = re.compile(r'<a\b[^>]*href="((?:[^"]*?/)?documents/([sgb])(\d+)/([^"]*?\.pdf)(?:\?T=(\d+))?)"[^>]*>(.*?)</a>',
                      re.S | re.I)
ITEM_CELL = re.compile(r'<td\s+class="mgItemNumberCell"\s*>(.*?)</td>', re.S)
ITEM_TITLE = re.compile(r'<p\s+class="mgAiTitleTxt"\s*>(.*?)</p>', re.S)
APP_REF = re.compile(r'\b\d{2}/\d{4,5}/\w+|\b[A-Z]{1,5}/\d{2}/\d{4,5}|(?<![\d/])\b\d{2}/\d{4,5}\b(?!/\d)')  # not a dd/mm/yyyy date
OTHER_WORDS = re.compile(r'^(index|minutes)\b|declaration|interests|apologies|frontsheet|front sheet|agenda reports pack|'
                         r'public participation|enforcement|terms of reference|procedure|attendance|urgent business|'
                         r'appeals? (update|monitoring|performance|decisions)|performance|work programme|'
                         r'chair(man)?\'?s? announcements', re.I)
# A sheet that corrects several reports at once (not an officer report about one application that says "update")
SHEET_WORDS = re.compile(r'update sheet|committee update|update report|updates? (to|for) (the )?(committee|agenda)|'
                         r'addendum|addenda|late (papers?|items?|representations?|list)|supplementary', re.I)
REPORT_WORDS = re.compile(r'application|report|appeal|enforcement notice|tree preservation|\btpo\b|listed building', re.I)
MINUTES_WORDS = re.compile(r'minutes|decisions?', re.I)
SKIP_WORDS = re.compile(r'^\s*(cancelled|postponed)\b', re.I)


def _clean(s):
    """Link text or title attribute -> plain text (modern.gov escapes spaces as &#32; and drops a 'PDF 77 KB' span)."""
    s = re.sub(r'<span\s+class="mgFileSize"[^>]*>.*?</span>', ' ', s or '', flags=re.S)
    return c.strip_tags(html.unescape(s))


def _meeting_title_date(a_tag, inner):
    """Prefer the title attribute ('Meeting of X, 07/10/2026 7.00 p.m.'); fall back to the link text."""
    m = TITLE_ATTR.search(a_tag)
    text = _clean(m[1] if m else inner)
    text = re.sub(r'^meeting of\s+', '', text, flags=re.I)
    md = re.search(r'(\d{1,2}/\d{1,2}/\d{4})', text)
    if md:
        return text[:md.start()].rstrip(' ,'), c.uk_date(md[1])
    md = re.search(r'(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+,?\s+\d{4})', text)  # "Wednesday, 7th October, 2026 7.00 pm"
    if md:
        name = re.sub(r',?\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*,?\s*$', '', text[:md.start()], flags=re.I)
        return name.rstrip(' ,'), c.uk_date(md[1].replace(',', ''))
    return text, ''


def _months(since, until):
    y, m = since.year, since.month
    while (y, m) <= (until.year, until.month):
        yield y, m
        y, m = (y + 1, 1) if m == 12 else (y, m + 1)


def sweep(http, council, since, until):
    base = council['base_url'].rstrip('/')
    want = re.compile(council.get('committee_re') or DEFAULT_COMMITTEE_RE, re.I)
    seen, out = set(), []
    for y, m in _months(since, until):
        code, page = http.get(f'{base}/mgCalendarMonthView.aspx?M={m}&Y={y}&GL=1')
        if c.BLOCK_RE.search(page) and 'mgCalendar' not in page:
            raise c.Blocked(f'{base} calendar {y}-{m:02d}')
        if code != 200:
            raise RuntimeError(f'calendar {y}-{m:02d} returned HTTP {code}')
        for a_tag, href, cid, mid, inner in ((mm[0], *mm.groups()) for mm in CAL_LINK.finditer(page)):
            if mid in seen:
                continue
            title, date = _meeting_title_date(a_tag, inner)
            if not date or not want.search(title) or SKIP_WORDS.search(title):
                continue
            if not (since.isoformat() <= date <= until.isoformat()):
                continue
            seen.add(mid)
            out.append(c.item(council['slug'], 'meeting', f'meeting-{date}-{mid}', date, level='committee',
                              address=title, url=f'{base}/ieListDocuments.aspx?CId={cid}&MId={mid}',
                              extra={'CId': cid, 'MId': mid}))
    return out


def _docs(page, base):
    """-> (header docs, [(item number, item title, docs)]). Each doc: dict(url, id, text, letter, t)."""
    def links(chunk):
        found = []
        for mm in DOC_LINK.finditer(chunk):
            href, letter, num, name, t, inner = mm.groups()
            # hrefs carry literal spaces ("Agenda frontsheet 7th-Oct-2026 ...pdf"), which curl rejects: percent-encode them
            url = urllib.parse.urljoin(base + '/', urllib.parse.quote(html.unescape(href), safe='/?=&%'))
            found.append({'url': url, 'id': f'{letter}{num}', 'text': _clean(inner) or urllib.parse.unquote(name),
                          'letter': letter, 't': t or ''})
        return found
    cells = list(ITEM_CELL.finditer(page))
    header = links(page[:cells[0].start()] if cells else page)
    items = []
    for i, cell in enumerate(cells):
        end = cells[i + 1].start() if i + 1 < len(cells) else len(page)
        body = page[cell.end():end]
        number = _clean(cell[1]).rstrip('.') or str(i + 1)
        tm = ITEM_TITLE.search(body)
        items.append((number, _clean(tm[1]) if tm else '', links(body)))
    return header, items


def _kind(doc, item_title=''):
    text, both = doc['text'], doc['text'] + ' ' + item_title
    if doc['letter'] == 'g':
        return 'minutes' if MINUTES_WORDS.search(text) else 'other'
    if doc['letter'] == 'b' or SHEET_WORDS.search(text):
        return 'update'
    if APP_REF.search(both):
        return 'report'        # named application: an officer report, enclosure or update report on it
    if OTHER_WORDS.search(both):
        return 'other'
    if re.search(r'\bupdates?\b', both, re.I):
        return 'update'
    return 'report' if REPORT_WORDS.search(both) else 'other'


def _save(http, doc, name, outdir, kind, files):
    """Download one PDF (skipping one already on disk), verify it, record it."""
    path = os.path.join(outdir, name)
    if not os.path.exists(path):
        http.download(doc['url'], path)
        if os.path.exists(path) and not c.is_pdf(path):
            with open(path, 'rb') as f:
                head = f.read(4096).decode('utf8', 'ignore')
            os.remove(path)
            if c.BLOCK_RE.search(head):
                raise c.Blocked(doc['url'])
            return
    if os.path.exists(path):
        files.append({'file': name, 'url': doc['url'], 'kind': kind})


def _name(prefix, doc, taken):
    name = c.safe_name(f'{prefix}-{re.sub(r"\.pdf$", "", doc["text"], flags=re.I)}', 100)
    if name in taken:
        name = c.safe_name(f'{name}-{doc["id"]}', 110)
    taken.add(name)
    return name + '.pdf'


def _page(http, council, item):
    code, page = http.get(item['url'])
    if c.BLOCK_RE.search(page) and 'mgAiTitleTxt' not in page and 'mgSectionTitle' not in page:
        raise c.Blocked(item['url'])
    if code != 200:
        raise RuntimeError(f'meeting page returned HTTP {code}')
    return page


def fetch(http, council, item, outdir):
    """Agenda-item reports, update sheets and any printed minutes already published. Safe to call again."""
    base = council['base_url'].rstrip('/')
    header, items = _docs(_page(http, council, item), base)
    files, taken, rows = [], set(), []
    for number, title, docs in items:
        names = []
        for doc in docs:
            kind = _kind(doc, title)
            name = _name(number or doc['id'], doc, taken)
            _save(http, doc, name, outdir, kind, files)
            names.append(name)
        rows.append((number, title, names))
    have_reports = any(f['kind'] == 'report' for f in files)
    for doc in header:
        kind = _kind(doc)
        if kind == 'other' and doc['t'] == '10' and not have_reports:
            kind = 'report'      # the council publishes only a combined reports pack; take that instead
        elif kind == 'other' and doc['t'] != '0':
            continue             # reports pack when we already have the reports; other packs
        _save(http, doc, _name(doc['id'], doc, taken), outdir, kind, files)
    with open(os.path.join(outdir, 'agenda.tsv'), 'w', encoding='utf8') as o:
        o.write('item\ttitle\tfiles\n')
        for number, title, names in rows:
            o.write(f'{number}\t{title}\t{";".join(names)}\n')
    return files


def refetch_minutes(http, council, item, outdir):
    """Later pass for the printed minutes (and decision lists), which modern.gov publishes weeks after the meeting.

    Downloads only header documents of kind 'minutes' that are not yet in outdir and returns just those as
    [{'file','url','kind'}], so the caller can append them to the item's fetched list and SOURCES.tsv.
    """
    base = council['base_url'].rstrip('/')
    header, _ = _docs(_page(http, council, item), base)
    files = []
    for doc in header:
        if _kind(doc) != 'minutes':
            continue
        name = _name(doc['id'], doc, set())
        if os.path.exists(os.path.join(outdir, name)):
            continue
        _save(http, doc, name, outdir, 'minutes', files)
    return files
