"""Adapter for the "Planning Register" portal product: plan.<council>.gov.uk (Wychavon, Malvern Hills,
Worcester) and *.planning-register.co.uk (West Northamptonshire).

Flow (what worked on 18-19 October 2026):
  GET  /Search/Advanced                       anti-forgery token (hidden field + cookie) and the form's field list
  POST /Search/SiteResults  (or /Search/Results on the newer build) with the whole form, dates dd/mm/yyyy
  GET  /Search/Results                        page 1 (10 rows a page; one past the last page is a 404)
  GET  /Search/ResultsPage/<n>?module=PLA     pages 2+, needs X-Requested-With: XMLHttpRequest
  GET  /Planning/Display/<ref>                summary tables (<td>Label</td><td>Value</td>) and documents in
                                              data-disabled-link="/Document/Download?...&fileName=<name>"
The newer build shows a disclaimer first; POST /Disclaimer/Accept?returnUrl=%2F with an empty body clears it.
"""
import datetime as dt
import html
import os
import re
import urllib.parse

from . import common as c

KIND = 'planning_register'
PAGE_CAP = 60                      # pages of 10; beyond this the date range is split in two
WANT_RE = re.compile(r'delegated.?report|committee.?report|officer.?report|decision.?notice|\bupdates?\b|addendum', re.I)
ROW_RE = re.compile(r'<tr[^>]*>(.*?)</tr>', re.S)
CELL_RE = re.compile(r'<td[^>]*>(.*?)</td>', re.S)
MOBILE_RE = re.compile(r'<span class="mobileheading">.*?</span>', re.S)
ACCEPTED = set()                   # hosts whose disclaimer this process has already accepted


def _base(council):
    return council['base_url'].rstrip('/')


def _accept(http, url):
    """The *.planning-register.co.uk build wants its disclaimer accepted (an empty POST) before documents."""
    scheme, _, host = url.split('/', 3)[:3]
    if host not in ACCEPTED:
        ACCEPTED.add(host)
        http.post_json(f'{scheme}//{host}/Disclaimer/Accept?returnUrl=%2F')


def _get(http, url, headers=()):
    """GET that treats any 4xx/5xx as an error and accepts the disclaimer page if one appears."""
    if 'planning-register.co.uk' in url:
        _accept(http, url)
    code, text = http.get(url, headers=headers)
    if code >= 400:
        raise RuntimeError(f'HTTP {code} for {url}')
    if re.search(r'action="[^"]*/Disclaimer/Accept', text):
        ACCEPTED.discard(url.split('/', 3)[2])
        _accept(http, url)
        code, text = http.get(url, headers=headers)
    return text


def _form_fields(page):
    """Names of the inputs and selects in the advanced search form, in page order, without duplicates."""
    i = page.find('AdvancedSearch')
    start = page.rfind('<form', 0, i)
    end = page.find('</form>', i)
    form = page[start:end]
    names = []
    for m in re.finditer(r'<(?:input|select)[^>]*\sname="([^"]+)"', form):
        if m[1] not in names:
            names.append(m[1])
    action = re.search(r'<form[^>]*action="([^"]+)"', form)
    return names, (action[1] if action else '/Search/SiteResults')


def _search(http, base, since, until):
    """Submit the advanced search for decisions issued in [since, until]; the results live in the session."""
    page = _get(http, base + '/Search/Advanced')
    tok = re.search(r'name="__RequestVerificationToken"[^>]*value="([^"]+)"', page)
    if not tok:
        raise RuntimeError('no anti-forgery token on /Search/Advanced')
    names, action = _form_fields(page)
    date_from = 'DateIssuedFrom' if 'DateIssuedFrom' in names else 'DateDeterminedFrom'
    date_to = date_from.replace('From', 'To')
    if date_from not in names:
        raise RuntimeError('advanced search form has no decision-date field')
    values = {'__RequestVerificationToken': tok[1], 'AdvancedSearch': 'True', 'SearchPlanning': 'true',
              date_from: since.strftime('%d/%m/%Y'), date_to: until.strftime('%d/%m/%Y')}
    data = [(n, values.get(n, 'false' if n.startswith(('Search', 'Exclude', 'Outstanding')) else '')) for n in names]
    code, _ = http.post(base + action, data, headers=['Referer: ' + base + '/Search/Advanced'], follow=False)
    if code not in (200, 302):
        raise RuntimeError(f'search POST returned {code}')


def _rows(page):
    """(ref, address, proposal, status) for each result row; the ref comes from the Display link."""
    out = []
    for row in ROW_RE.findall(page):
        m = re.search(r'href="/Planning/Display/([^"]+)"', row)
        if not m:
            continue
        cells = [c.strip_tags(MOBILE_RE.sub('', x)) for x in CELL_RE.findall(row)]
        if len(cells) < 3:
            continue
        out.append((html.unescape(urllib.parse.unquote(m[1])), cells[1], cells[2], cells[-1] if len(cells) > 3 else ''))
    return out


def sweep(http, council, since, until):
    base = _base(council)
    _search(http, base, since, until)
    seen, items = set(), []
    for n in range(1, PAGE_CAP + 2):
        if n == 1:
            page = _get(http, base + '/Search/Results')
        else:
            code, page = http.get(f'{base}/Search/ResultsPage/{n}?module=PLA',
                                  headers=['X-Requested-With: XMLHttpRequest', 'Referer: ' + base + '/Search/Results'])
            if code == 404:              # one past the last page
                break
            if code >= 400:
                raise RuntimeError(f'HTTP {code} on results page {n}')
        rows = _rows(page)
        if not rows:
            break
        if n > PAGE_CAP:
            # Too many for one search: split the range and search each half afresh.
            if since == until:
                raise RuntimeError(f'more than {PAGE_CAP * 10} decisions on {since}')
            mid = since + (until - since) // 2
            return sweep(http, council, since, mid) + sweep(http, council, mid + dt.timedelta(days=1), until)
        for ref, address, proposal, status in rows:
            if ref in seen:
                continue
            seen.add(ref)
            # The listing carries no decision date; fetch() replaces this range-end placeholder.
            items.append(c.item(council['slug'], 'application', ref, until.isoformat(), outcome=status,
                                address=address, proposal=proposal, url=f'{base}/Planning/Display/{ref}',
                                extra={'dateSource': 'sweep range end'}))
    return items


def _field(page, label):
    m = re.search(r'<td[^>]*>\s*' + re.escape(label) + r'\s*</td>\s*<td[^>]*>(.*?)</td>', page, re.S)
    return c.strip_tags(m[1]) if m else ''


def _doc_links(page):
    """[(url path, file name)] for every document link on the Display page."""
    out = []
    for raw in re.findall(r'(?:data-disabled-link|href)="([^"]*fileName=[^"]*)"', page):
        link = html.unescape(raw)
        name = urllib.parse.unquote(urllib.parse.parse_qs(urllib.parse.urlsplit(link).query).get('fileName', [''])[0])
        if name and (link, name) not in out:
            out.append((link, name))
    return out


def _kind(name):
    low = name.lower()
    if 'notice' in low:
        return 'notice'
    if 'update' in low or 'addendum' in low:
        return 'update'
    return 'report' if 'report' in low else 'other'


def fetch(http, council, item, outdir):
    base = _base(council)
    url = item['url'] or f'{base}/Planning/Display/{item["ref"]}'
    page = _get(http, url)
    item['outcome'] = _field(page, 'Decision') or _field(page, 'Status') or item.get('outcome', '')
    date = ''
    for label in ('Decision Date', 'Decision Issued Date', 'Date Determined', 'Determination Date'):
        date = c.uk_date(_field(page, label))
        if date:
            break
    if date:
        item['date'] = date
        item['extra'].pop('dateSource', None)
    level = _field(page, 'Expected Decision Level').lower()
    committee_date = c.uk_date(_field(page, 'Committee Date (if applicable)') or _field(page, 'Committee Date'))
    item['level'] = 'committee' if 'committee' in level or committee_date else 'delegated' if 'delegated' in level else ''
    item['extra'].update({k: v for k, v in (('parish', _field(page, 'Parish')), ('ward', _field(page, 'Ward')),
                                            ('applicationType', _field(page, 'Application Type')),
                                            ('committeeDate', committee_date)) if v})
    files = []
    for link, name in _doc_links(page):
        if not WANT_RE.search(name) or 'isPlan=True' in link:   # drawings are flagged isPlan
            continue
        fname = c.safe_name(name)
        if not fname.lower().endswith('.pdf'):
            fname += '.pdf'
        path = os.path.join(outdir, fname)
        full = link if link.startswith('http') else base + link
        if not os.path.exists(path):
            http.download(full, path, headers=['Referer: ' + url])
            if os.path.exists(path) and not c.is_pdf(path):
                os.remove(path)          # an HTML error or disclaimer page, not the document
                continue
        if os.path.exists(path):
            files.append({'file': fname, 'url': full, 'kind': _kind(name)})
    return files
