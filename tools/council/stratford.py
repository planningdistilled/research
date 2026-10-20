"""Stratford-on-Avon: the council's open JSON planning API (no login, no cookies, no bot wall so far).

How the API is used here (base_url in the register is the API root, .../EplanningV2/API/v1/):
  Search?DateDecIssuedFrom=D&dateDecIssuedTo=D   decisions issued on day D. Rows carry no decision date and the
                                                 search returns at most 500 rows, so sweep asks one day at a time.
  PlanningApplication/{id}                       the record: decision text, importantDates, folderId.
  Documents/Folder/{folderId}/Category/{catId}   the files in one document category ([] when the category is empty).
  Document/{docId}/Request (POST, empty body)    asks the council's store to stage the file, then
  Document/{docId}/Download (GET)                returns JSON: status NotRequested | Processing | Available and,
                                                 once Available, a fileLocation URL for the PDF itself.
The record names case officers, agents and applicants; nothing from those fields is stored.
"""
import datetime as dt
import json
import os
import time

from council import common as c

KIND = 'stratford'
CAP = 500                      # rows the search returns at most
CATEGORIES = (('report', 'c3e21d4b-df12-cdcc-c4b6-08d025d0f088'),    # REPORTS: the delegated or committee report
              ('notice', 'c30e3fa7-9f46-cf53-5678-08d025d0f9aa'))    # DECISIONS: the decision notice
POLL_EVERY = 3                 # seconds between Download polls
POLL_FOR = 60                  # give up on one document after this long


def api(http, council, path):
    """GET one API path and return the decoded JSON. HTML instead of JSON means a wall or an outage."""
    url = council['base_url'] + path
    code, text = http.get(url, headers=('Accept: application/json',))
    if text.lstrip().startswith('<'):
        if c.BLOCK_RE.search(text):
            raise c.Blocked(url)
        raise RuntimeError(f'HTML instead of JSON (HTTP {code}) for {path}')
    if code != 200:
        raise RuntimeError(f'HTTP {code} for {path}')
    return json.loads(text)


def dates(rec):
    return rec.get('importantDates') or {}


def sweep(http, council, since, until):
    """One Search call a day. Search rows: reference, status (the decision text), address, proposal, link, id."""
    items, day = [], since
    while day <= until:
        iso = day.isoformat()
        rows = api(http, council, f'Search?DateDecIssuedFrom={iso}&dateDecIssuedTo={iso}')
        if len(rows) >= CAP:
            raise RuntimeError(f'{iso}: {len(rows)} decisions in one day hits the search cap of {CAP}; cannot split further')
        for r in rows:
            if not r.get('reference') or not r.get('id'):
                continue
            items.append(c.item(council['slug'], 'application', r['reference'].strip(), iso,
                                outcome=(r.get('status') or '').strip(),
                                address=(r.get('address') or '').strip(),
                                proposal=(r.get('proposal') or '').strip(),
                                url=r.get('link') or council['base_url'] + 'PlanningApplication/' + r['id'],
                                extra={'id': r['id']}))
        day += dt.timedelta(days=1)
    return items


def fetch(http, council, it, outdir):
    """Refresh the item from its record, then download the REPORTS and DECISIONS files.

    Returns [] when neither category has a file yet (a delegated report is published a few days after the notice).
    """
    rec = api(http, council, 'PlanningApplication/' + it['extra']['id'])
    it['outcome'] = (rec.get('decision') or rec.get('status') or it.get('outcome') or '').strip()
    it['date'] = c.uk_date(dates(rec).get('dateDecisionIssued')) or it['date']
    # The record has no delegated/committee flag. importantDates.committeeDate is filled only for items that went
    # to the Planning Committee, so that is the level signal; blank means decided under delegated powers.
    it['level'] = 'committee' if dates(rec).get('committeeDate') else 'delegated'
    folder = rec.get('folderId')
    if not folder:
        raise RuntimeError(f'{it["ref"]}: record has no folderId')
    it['extra']['folderId'] = folder
    files, used = [], set()
    for kind, cat in CATEGORIES:
        for doc in api(http, council, f'Documents/Folder/{folder}/Category/{cat}'):
            doc_id = doc.get('documentId')
            if not doc_id:
                continue
            label = (doc.get('description') or '').strip() or doc_id[:8]
            name = c.safe_name(f'{kind}-{label}.pdf')
            if name in used:                              # two files with the same label (a re-issued notice)
                name = c.safe_name(f'{kind}-{label}-{doc_id[:8]}.pdf')
            used.add(name)
            path = os.path.join(outdir, name)
            if os.path.exists(path) and not c.is_pdf(path):   # a half-written or non-PDF leftover: fetch again
                os.remove(path)
            if not os.path.exists(path):
                download(http, council, doc_id, path)
            files.append({'file': name, 'url': council['base_url'] + f'Document/{doc_id}/Download', 'kind': kind})
    return files


def download(http, council, doc_id, path):
    """Request the file, poll Download until it is Available, then save the PDF from fileLocation."""
    base = council['base_url'] + f'Document/{doc_id}/'
    # The council's server answers a bodiless POST with 411 unless the zero length is stated.
    code, text = http.post_json(base + 'Request', headers=('Content-Length: 0',))
    if code != 200:
        raise RuntimeError(f'document {doc_id}: Request returned HTTP {code}')
    deadline = time.monotonic() + POLL_FOR
    while True:
        meta = api(http, council, f'Document/{doc_id}/Download')
        if meta.get('status') == 'Available' and meta.get('fileLocation'):
            break
        if time.monotonic() > deadline:
            raise RuntimeError(f'document {doc_id}: still {meta.get("status") or "unknown"} after {POLL_FOR}s')
        time.sleep(POLL_EVERY)
    code, ctype, size = http.download(meta['fileLocation'], path)
    if code != 200 or not c.is_pdf(path):
        if os.path.exists(path):
            os.remove(path)
        raise RuntimeError(f'document {doc_id}: HTTP {code}, {size} bytes, not a PDF ({ctype})')
