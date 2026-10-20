"""Idox Public Access adapter (Warwick, Bromsgrove/Redditch, Lichfield and most English councils).

Sweep: advanced search by decision date (`date(applicationDecisionStart/End)`), 100 rows a page.
Fetch: the summary tab gives the decision and issue date, the details tab the decision level, the
documents tab the files; downloads use the same cookie session as the search.
"""
import datetime as dt
import os
import re
import urllib.parse

from . import common as c

KIND = 'idox'
PAGE_CAP = 50                      # pages of 100 before we assume the portal is truncating and split the range
ROW_RE = re.compile(r'<li class="searchresult">(.*?)</li>', re.S)
FIELD_RE = re.compile(r'<tr[^>]*>\s*<th[^>]*>(.*?)</th>\s*<td[^>]*>(.*?)</td>', re.S)
# Kinds of document worth keeping, judged on the description; first hit wins.
WANT = [
    ('update', re.compile(r'\bupdate\b|addend|late (item|list|rep)|supplement', re.I)),
    ('report', re.compile(r'report|del\.? ?rep|agenda', re.I)),
    ('notice', re.compile(r'notice|letter|refus|permission|permitted|grant|approv|consent|decision|'
                          r'\b(REFULZ|ACFULZ|ACHHFZ|OTD)\b', re.I)),
]
# Descriptions that name the council's own document outright.
STRONG = re.compile(r"officer'?s? report|delegated( officer)? (report|decision)|del\.? ?rep|committe\w* report|"
                    r'planning (committe\w* )?report|report to (planning )?committee|case officer report|reports? pack|'
                    r'^report(-|$)|decision notice|notice of decision|decision letter|refusal notice|requisite notice|'
                    r'update (report|sheet)|urgent update|addendum|late (item|list|representation)|supplementary (report|sheet)', re.I)
# Descriptions that are probably a decision ("Decision", "Ful decision", "Planning permission - grant", "ACFULZ ...").
WEAK = re.compile(r'\bdecision\b|\bnotice\b|permission|permitted|\bgrant(ed)?\b|refus|approv|consent (granted|refused)|'
                  r'\b(REFULZ|ACFULZ|ACHHFZ|OTD)\b', re.I)
# ... unless the description says it is something else (applicants' material, photos, appeal letters).
NOT_OURS = re.compile(r'photo|committee decisions|summary of decisions|appeal decision|approved (plans?|drawings?|documents?)|'
                      r'survey|ecolog|arboricultur|drainage|structural|flood|viability|\btree|noise|transport|heritage|'
                      r'design and access|planning statement|statement|hs2 report|environmental|geotechn|energy|\bbat\b|'
                      r'health and safety|consultant|assessment|appraisal|plan(s)?\b|drawing|elevation|layout|site notice|'
                      r'press notice|notice of (intent|entry)|certificate', re.I)
# Document types that are unambiguous on their own (used when the description is bland, e.g. "DC0001").
DECISION_TYPE = re.compile(r"^(decision( notice| letter)?s?|notice of decision|officer'?s? report|delegated( officer)? "
                           r"(report|decision)|committee report|planning report|report to (planning )?committee|del\.? ?rep|"
                           r"update (sheet|report)|late items?)$", re.I)
SKIP_EXT = re.compile(r'\.(xlsx?|docx?|jpe?g|png|gif|zip|msg|dwg|csv)$', re.I)


def _base(council):
    return council['base_url'].rstrip('/')


def _page(http, url):
    code, text = http.get(url)
    if code in (403, 429) or (c.BLOCK_RE.search(text) and 'online-applications' not in text):
        raise c.Blocked(url)
    if code != 200:
        raise RuntimeError(f'HTTP {code} for {url}')
    return text


def _fields(text):
    """The <th>label</th><td>value</td> rows of the summary/details tables -> {label: value}."""
    return {c.strip_tags(k): c.strip_tags(v) for k, v in FIELD_RE.findall(text)}


def _date(s):
    """Idox prints 'Wed 07 Oct 2026'; drop the weekday for uk_date."""
    return c.uk_date(re.sub(r'^[A-Za-z]{3,9},?\s+(?=\d)', '', (s or '').strip()))


def _uk(d):
    return d.strftime('%d/%m/%Y')


# ---------- sweep ----------

def _rows(text):
    out = []
    for body in ROW_RE.findall(text):
        kv = re.search(r'keyVal=([A-Za-z0-9_]+)', body)
        if not kv:
            continue
        meta = c.strip_tags((re.search(r'<p class="metaInfo">(.*?)</p>', body, re.S) or [None, ''])[1])
        # metaInfo reads "Ref. No: X | Received: ... | Validated: ... | Status: Y"; some skins use a middle dot.
        end = r'\s*(?=\||·|Received:|Validated:|Status:|$)'
        ref = re.search(r'Ref\. No:\s*(.*?)' + end, meta)
        status = re.search(r'Status:\s*(.*?)' + end, meta)
        out.append({'keyVal': kv[1], 'ref': ref[1].strip() if ref else kv[1],
                    'status': status[1].strip() if status else '',
                    'address': c.strip_tags((re.search(r'<p class="address">(.*?)</p>', body, re.S) or [None, ''])[1]),
                    'proposal': c.strip_tags((re.search(r'<div class="summaryLinkTextClamp">(.*?)</div>', body, re.S)
                                              or [None, ''])[1])})
    return out


def _search(http, base, since, until):
    """One advanced search. -> ('ok', rows) | ('short', rows) | ('too_many', None) | ('one', detail page html)."""
    form = _page(http, f'{base}/search.do?action=advanced')
    tok = re.search(r'name="_csrf"\s+value="([^"]+)"', form) or re.search(r'value="([^"]+)"\s+name="_csrf"', form)
    data = [('searchType', 'Application'), ('searchCriteria.caseStatus', ''),
            ('date(applicationDecisionStart)', _uk(since)), ('date(applicationDecisionEnd)', _uk(until))]
    if tok:
        data.insert(0, ('_csrf', tok[1]))
    code, first = http.post(f'{base}/advancedSearchResults.do?action=firstPage', data)
    if code in (403, 429):
        raise c.Blocked(base)
    if re.search(r'too many results', first, re.I):
        return 'too_many', None
    if re.search(r'no results found', first, re.I):
        return 'ok', []
    if 'class="searchresult"' not in first and 'keyVal=' in first and 'activeTab=' in first:
        return 'one', first          # Idox jumps straight to the detail page when exactly one application matches
    rows, seen, total = [], set(), None
    for n in range(1, PAGE_CAP + 1):
        text = _page(http, f'{base}/pagedSearchResults.do?action=page&searchCriteria.page={n}'
                           f'&searchCriteria.resultsPerPage=100')
        m = re.search(r'Showing\s+[\d,]+-[\d,]+\s*</strong>\s*of\s*([\d,]+)', text)
        if m and total is None:
            total = int(m[1].replace(',', ''))
        got = _rows(text)
        new = [r for r in got if r['keyVal'] not in seen]
        seen.update(r['keyVal'] for r in new)
        rows += new
        # Past the last page Idox repeats the last page rather than returning nothing, hence the two extra stops.
        if not new or len(got) < 100 or (total is not None and len(rows) >= total):
            break
    if total is not None and len(rows) < total:
        return 'short', rows           # the portal stopped paging before the stated total: caller splits the range
    return 'ok', rows


def _item_from_detail(council, base, text):
    f = _fields(text)
    kv = re.search(r'keyVal=([A-Za-z0-9_]+)', text)
    if not kv or not f.get('Reference'):
        return None
    return c.item(council['slug'], 'application', f['Reference'], _date(f.get('Decision Issued Date')),
                  outcome=f.get('Decision', ''), address=f.get('Address', ''), proposal=f.get('Proposal', ''),
                  url=f'{base}/applicationDetails.do?activeTab=summary&keyVal={kv[1]}', extra={'keyVal': kv[1]})


def sweep(http, council, since, until):
    """Applications with a decision issued in [since, until]. Dates are the range end until fetch fills the real one."""
    base = _base(council)
    seen, items = set(), []

    def run(a, b):
        kind, rows = _search(http, base, a, b)
        if kind in ('too_many', 'short'):
            if a == b:
                raise RuntimeError(f'{council["slug"]}: portal will not list every decision on {a} ({kind})')
            mid = a + (b - a) // 2
            run(a, mid)
            run(mid + dt.timedelta(days=1), b)
            return
        if kind == 'one':
            it = _item_from_detail(council, base, rows)
            if it and it['extra']['keyVal'] not in seen:
                seen.add(it['extra']['keyVal'])
                it['date'] = it['date'] or b.isoformat()
                items.append(it)
            return
        for r in rows:
            if r['keyVal'] in seen:
                continue
            seen.add(r['keyVal'])
            # The list gives no decision date, so use the end of the range it was found in; fetch overwrites it.
            items.append(c.item(council['slug'], 'application', r['ref'], b.isoformat(), address=r['address'],
                                proposal=r['proposal'],
                                url=f'{base}/applicationDetails.do?activeTab=summary&keyVal={r["keyVal"]}',
                                extra={'keyVal': r['keyVal'], 'status': r['status'], 'dateIsRangeEnd': True}))

    run(since, until)
    return items


# ---------- fetch ----------

def _level(fields):
    keys = [k for k in fields if re.search(r'decision level|determination level|decided by|decision type', k, re.I)]
    keys.sort(key=lambda k: 0 if k.lower().startswith('actual') else 1)
    for k in keys:
        v = fields[k]
        if re.search(r'committee|commitee|member|panel|board|council\b', v, re.I):
            return 'committee', v
        if re.search(r'delegat|officer', v, re.I):
            return 'delegated', v
    return '', ''


def _cells(row, tag):
    """Cell texts in order; Idox writes empty cells as self-closing <td/> and <th/>, which must still count."""
    return [c.strip_tags(m[1]) for m in re.finditer(rf'<{tag}\b[^>]*?/>|<{tag}\b[^>]*>(.*?)</{tag}>', row, re.S)]


def _documents(text, base):
    """Rows of the documents table -> [(type, description, absolute url)]."""
    table = re.search(r'<table[^>]*id="Documents".*?</table>', text, re.S)
    if not table:
        return None
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', table[0], re.S)
    header = [h.lower() for h in _cells(rows[0], 'th')] if rows else []
    ti = next((i for i, h in enumerate(header) if 'type' in h), 2)
    di = next((i for i, h in enumerate(header) if 'description' in h), 4)
    out = []
    for r in rows[1:]:
        cells = _cells(r, 'td')
        href = re.search(r'href="([^"]*/files/[^"]+)"', r) or re.search(r'href="([^"]+\.pdf[^"]*)"', r, re.I)
        if not href or len(cells) <= max(ti, di):
            continue
        out.append((cells[ti], cells[di], urllib.parse.urljoin(base + '/', href[1].replace('&amp;', '&'))))
    return out


def desc_kind(desc):
    """Kind for a document description under the current rules, or None when it is not the council's own document."""
    if STRONG.search(desc) or (WEAK.search(desc) and not NOT_OURS.search(desc)):
        return next((kind for kind, rx in WANT if rx.search(desc)), 'other')
    return None


def _classify(doc_type, desc):
    kind = desc_kind(desc)
    if kind:
        return kind
    if DECISION_TYPE.search(doc_type.strip()) and not NOT_OURS.search(desc):
        return next((kind for kind, rx in WANT if rx.search(desc or doc_type)), 'other')
    return ''


def reclassify(file_name):
    """Kind for a file already on disk (name = description-originalname.pdf) under the current rules, or None when
    the current rules would not have downloaded it. Used by `council_sweep.py reclassify` after a rule change."""
    return desc_kind(re.sub(r'\.pdf$', '', file_name, flags=re.I))


def fetch(http, council, item, outdir):
    base, kv = _base(council), item['extra']['keyVal']
    summary = _fields(_page(http, f'{base}/applicationDetails.do?activeTab=summary&keyVal={kv}'))
    details = _fields(_page(http, f'{base}/applicationDetails.do?activeTab=details&keyVal={kv}'))
    if not summary.get('Reference') and not details:
        raise RuntimeError(f'no application detail for keyVal {kv}')
    item['outcome'] = details.get('Decision') or summary.get('Decision') or item['outcome']
    issued = _date(summary.get('Decision Issued Date') or details.get('Decision Issued Date'))
    if issued:
        item['date'] = issued
        item['extra'].pop('dateIsRangeEnd', None)
    item['level'], level_text = _level(details)
    if level_text:
        item['extra']['decisionLevel'] = level_text
    made = next((v for k, v in {**summary, **details}.items() if re.search(r'decision (made|date)', k, re.I)), '')
    if made:
        item['extra']['decision_made'] = _date(made) or made
    docs = _documents(_page(http, f'{base}/applicationDetails.do?activeTab=documents&keyVal={kv}'), base)
    if docs is None:
        raise RuntimeError(f'no documents table on the documents tab for {item["ref"]}')
    files = []
    for doc_type, desc, url in docs:
        kind = _classify(doc_type, desc)
        if not kind or SKIP_EXT.search(url.split('?')[0]):
            continue
        orig = urllib.parse.unquote(url.split('?')[0].rsplit('/', 1)[-1])
        name = c.safe_name(f'{desc or doc_type}-{orig}')
        name = re.sub(r'\.pdf$', '', name, flags=re.I) + '.pdf'
        path = os.path.join(outdir, name)
        if not c.is_pdf(path):
            code, _, _ = http.download(url, path)
            if code in (403, 429):
                raise c.Blocked(url)
            if not c.is_pdf(path):      # an HTML answer instead of the file: a wall, a login page or a dead link
                head = ''
                if os.path.exists(path):
                    with open(path, 'rb') as f:
                        head = f.read(4096).decode('utf8', 'ignore')
                    os.remove(path)
                if re.search(r'access denied|captcha|forbidden', head, re.I):
                    raise c.Blocked(url)
                continue
        files.append({'file': name, 'url': url, 'kind': kind})
    return files
