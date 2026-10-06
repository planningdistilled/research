#!/usr/bin/env python3
"""Count the homes Stratford-on-Avon has approved since its last five-year supply calculation, and the homes
in applications still pending, from the council's planning register.

Usage: uv run tools/stratford_supply.py [--to YYYY-MM-DD] [--save-raw FILE | --from-raw FILE]
  - Reads analysis/stratford-housing-supply/baseline.json (the council's calculation: base date, supply, requirement)
    and overrides.tsv (hand-checked home counts where the description cannot be parsed).
  - Fetches every decision issued after the base date, every appeal decided after it and every active
    application of a type that can create homes, from https://apps.stratford.gov.uk/EplanningV2/API/.
  - Writes approved.tsv, pending.tsv and summary.md beside them.
  - Polite: about 4 calls a second (the API allows 10). --save-raw / --from-raw keep the pull for offline rebuilds.
Home counts are read from the proposal description, so every row is an estimate; rows marked `auto` have not
been checked by hand. Read README.md in the data folder before quoting a number.
"""
import argparse, csv, json, os, re, sys, time, urllib.parse, urllib.request
from datetime import date, datetime, timedelta

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from paths import DECISIONS  # noqa: E402

OUT = os.path.join(DECISIONS, 'analysis', 'stratford-housing-supply')
API = 'https://apps.stratford.gov.uk/EplanningV2/API/v1/'
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
DELAY = 0.25
CAP = 500  # the search returns at most this many rows

# Reference suffix -> route. Anything else (householder certificates, trees, listed building consent) creates no homes.
ROUTES = {'FUL': 'full', 'OUT': 'outline', 'PIP': 'pip', 'REM': 'reserved-matters', 'TDC': 'technical-details'}
APPROVED = re.compile(r'^(Permission with|Planning Permission with No|Permission in Principle Granted|Outline Planning Permission'
                      r' Permitted|Change of Use PA Grant|Approval of Reserved Matters|Prior Approval (Approved|Granted|not Required)'
                      r'|Technical Details Consent)', re.I)
PENDING_TYPES = re.compile(r'Dwell|Residential|Flats|^Outline Application$|^Full Application$|Permission in Principle|Technical Details', re.I)

WORDS = {'a': 1, 'an': 1, 'one': 1, 'single': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7,
         'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12}
# Words allowed between the number and the noun ("3 x detached self-build dwellings").
ADJ = (r'(?:(?:new|detached|semi-detached|terraced|self|custom|build|and|self/custom|self-build|custom-build|self-build/custom|local|needs?|'
       r'affordable|residential|infill|single|two|storey|single-storey|two-storey|bed|bedroom|bedroomed|open|market|replacement|'
       r'independent|additional|family|private|flood-resilient|agricultural|rural|workers?|older|persons?|self-contained|'
       r'one-bedroom|(?:\d|one|two|three|four|five|six)[- ]?bed(?:room)?|\(?use class c3\)?|c3|x|no\.?|nos\.?)[ ,/]+){0,6}')
NOUN = r'(?P<noun>dwelling\s?houses?|dwellings?|houses?|homes?|bungalows?|apartments?|flats?|units?)'
# Not "a home office", "2no. flat rooflights" or "0.19 ha".
COUNT = re.compile(r'(?<!\w)(?<!\d\.)(?P<n>\d[\d,]*|' + '|'.join(WORDS) + r')\s*\.?\s*(?:no\.?|nos\.?|x)?\s*(?P<adj>' + ADJ + r')'
                   + NOUN + r'\b(?![\s-]*(?:roof|office|working|gym))', re.I)
# A count after one of these restates an earlier permission or a subset, not homes this application adds.
CUT = re.compile(r'pursuant to|in lieu of|approved under|as approved|revision to approval|resubmission of|previously approved|'
                 r'following outline|granted under', re.I)
SUBSET = re.compile(r'(includ\w*|of which)\W+(up to\W+)?$', re.I)
GOVERNED = re.compile(r'((erection|construction|creation|provision|development) of|to|into|form|as|for|provide|create|and)\W+$', re.I)
CONVERTS = re.compile(r'conver|change of use|sub-?divi|redevelop', re.I)
HOUSEHOLDER = re.compile(r'extension|porch|dormer|annex|ancillary|outbuilding|garden room|incidental|loft conversion|garage conversion', re.I)
SINGLE = re.compile(r'((erection|construction) of (a |an |new |the )*(self[- ]build |custom[- ]build |detached |replacement )*'
                    r'|(to|into|form|as)\s+(?:(?:a|an|one|single|new|residential|independent|private|self-contained|local|needs?|use|'
                    r'class|c3|\(c3\)|full|permanent|separate|detached)\W+)*'
                    r'|self[- ](and custom[- ])?build |self and custom build )(dwelling\s?house|dwelling|bungalow|house)\b(?!\s+(a|an|the)\b)', re.I)
REPLACEMENT = re.compile(r'replacement (self[- ]?build |detached )*(dwelling|house|farmhouse|bungalow)|'
                         r'demolition of (the |an |a )?(existing )?(dwelling\s?house|dwelling|house|bungalow|farmhouse)\b', re.I)
SUBDIVIDES = re.compile(r'sub-?divi\w+ (of|to form|to create)', re.I)
# Listed with no homes so the exclusion is visible. Holiday lets and ancillary uses are dropped silently.
NOT_HOUSING = [(re.compile(r'gypsy|traveller|travelling showpe', re.I), 'traveller pitches, not counted'),
               (re.compile(r'\d+[- ]bed(room)?,? care home|(erection|construction) of an? [\w\s-]{0,30}care home', re.I),
                'care home (C2), not counted')]
HOLIDAY = re.compile(r'holiday (let|accommodation|unit|home)s?\b(?!.*\bto\b)', re.I)


def get(path, **params):
    url = API + path + ('?' + urllib.parse.urlencode({k: v for k, v in params.items() if v is not None}) if params else '')
    for attempt in range(5):
        time.sleep(DELAY)
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode('utf8'))
        except Exception as e:  # noqa: BLE001
            print(f'  retry {attempt + 1}: {url} ({e})', file=sys.stderr)
            time.sleep(5 * (attempt + 1))
    sys.exit(f'failed: {url}')


def fetch_decided(start, end):
    """Every decision issued start..end, one day at a time so each row has its decision date."""
    rows, d = [], start
    while d <= end:
        day = get('Search', DateDecIssuedFrom=d.isoformat(), dateDecIssuedTo=d.isoformat())
        if len(day) >= CAP:
            sys.exit(f'{d}: {len(day)} decisions in one day hits the search cap; cannot split further')
        for x in day:
            x['_decided'] = d.isoformat()
        rows += day
        d += timedelta(days=1)
    return rows


def fetch_appeals(start, end):
    rows = get('Search', dateAppealDecisionFrom=start.isoformat(), dateAppealDecisionTo=end.isoformat())
    if len(rows) >= CAP:
        sys.exit('appeal search hit the cap; split the date range')
    allowed = [x for x in rows if 'allowed' in (x.get('appealStatus') or '').lower()]
    for x in allowed:
        det = (get('PlanningApplication/' + x['id']).get('appealDetails') or {})
        x['_decided'] = uk_date(det.get('appealDecisionDate'))
        x['_appeal_ref'] = det.get('appealReference') or ''
    return allowed


def fetch_pending(end):
    types = [t for t in get('Search/Advanced/Filters')['applicationTypes'] if PENDING_TYPES.search(t['name'])]
    rows = {}
    for t in types:
        got = get('Search', appType=t['id'], activeOnly='true')
        if len(got) >= CAP:  # split by the date received, a year at a time
            got = []
            for y in range(1995, end.year + 1):
                part = get('Search', appType=t['id'], activeOnly='true', dateAppReceivedFrom=f'{y}-01-01', dateAppReceivedTo=f'{y}-12-31')
                if len(part) >= CAP:
                    sys.exit(f'{t["name"]} {y}: active applications hit the search cap')
                got += part
        for x in got:
            rows[x['id']] = x
    return list(rows.values())


def uk_date(s):
    try:
        return datetime.strptime(s, '%d/%m/%Y').date().isoformat()
    except (TypeError, ValueError):
        return ''


def route_of(ref):
    suffix = ref.rsplit('/', 1)[-1].upper()
    return 'prior-approval' if suffix.startswith('COU') else ROUTES.get(suffix)


def count_homes(proposal, route):
    """(gross, net, note) read from the description. A guess: overrides.tsv corrects it where it is wrong."""
    text = ' '.join(proposal.split())
    for pat, why in NOT_HOUSING:
        if pat.search(text):
            return 0, 0, why
    if HOLIDAY.search(text):
        return 0, 0, ''
    live = CUT.split(text)[0]
    found = []
    for m in COUNT.finditer(live):
        raw, noun, before = m.group('n').lower(), m.group('noun').lower(), live[:m.start()]
        if SUBSET.search(before):
            continue
        if noun.startswith('unit') and route != 'prior-approval' and 'residential' not in m.group('adj').lower():
            continue
        if re.search(r'(mobile|holiday|park|care|nursing|public|guest|club|green|glass|farm)\W*$', before, re.I):
            continue
        n = WORDS.get(raw) or int(raw.replace(',', ''))
        if re.match(r'[\s-]*(bed|storey)', m.group('adj'), re.I):
            raw, n = 'one', 1  # "a three bedroom dwelling", "two storey dwelling": the number describes one home
        if raw in ('a', 'an', 'one', 'single') and not GOVERNED.search(before) and 'self' not in m.group(0).lower():
            continue  # "extension to a detached dwelling" describes the site, not the proposal
        if raw in ('a', 'an') and re.search(r'\bto\W+$', before, re.I) and not CONVERTS.search(live):
            continue
        found.append(n)
    if found:
        ranged = re.search(r'minimum|maximum|\d\s*(-|to)\s*\d', live, re.I)
        gross = max(found) if ranged else sum(found)
    elif SINGLE.search(live) and not (HOUSEHOLDER.search(live) and not CONVERTS.search(live)):
        gross = 1
    elif route in ('pip', 'prior-approval') and re.search(r'dwelling|house|residential|bungalow', live, re.I):
        gross = 1
    else:
        gross = 0
    net = gross
    m = re.search(r'\(net (\d+)\)', text, re.I)
    if m:
        net = int(m.group(1))
    elif gross and (REPLACEMENT.search(live) or SUBDIVIDES.search(live)):
        net = gross - 1
    elif not gross and REPLACEMENT.search(live) and not HOUSEHOLDER.search(live):
        gross, net = 1, 0
    note = 'refers to an earlier permission: check for double counting' if gross and CUT.search(text) and route != 'reserved-matters' else ''
    return gross, net, note


def category(route, gross):
    """Annex B 'deliverable': (a) counts until the permission expires; (b) needs clear evidence of delivery in five years."""
    if route in ('full', 'prior-approval', 'technical-details') or (route == 'outline' and gross < 10):
        return 'a'
    return 'b' if route in ('outline', 'pip') else '-'


def place_of(address):
    """The address without its postcode."""
    return re.sub(r'\s*\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b\s*$', '', ' '.join((address or '').split())).strip(' ,')


def load_overrides():
    path = os.path.join(OUT, 'overrides.tsv')
    out = {}
    if os.path.exists(path):
        with open(path, encoding='utf-8', newline='') as f:
            for r in csv.DictReader(f, delimiter='\t'):
                out[r['reference']] = r
    return out


def build_row(x, overrides, used):
    ref = x['reference']
    route = route_of(ref)
    if not route:
        return None
    gross, net, note = count_homes(x.get('proposal') or '', route)
    basis = 'auto'
    counted = 'yes'
    o = overrides.get(ref)
    if o:
        used.add(ref)
        gross, net, note, basis = int(o['homes_gross']), int(o['homes_net']), o.get('note') or '', 'override'
        counted = (o.get('counted') or 'yes').strip().lower()
    if route == 'reserved-matters':
        counted, net = 'no', 0  # detail for homes already permitted in outline
        note = note or 'reserved matters: homes already permitted in outline'
    if not gross and not note:
        return None
    return {'reference': ref, 'route': route, 'homes_gross': gross, 'homes_net': net, 'counted': counted,
            'category': category(route, gross), 'basis': basis, 'note': note, 'place': place_of(x.get('address')),
            'proposal': ' '.join((x.get('proposal') or '').split())[:240], 'link': x.get('link') or ''}


def write_tsv(name, cols, rows):
    with open(os.path.join(OUT, name), 'w', encoding='utf-8', newline='') as f:
        w = csv.writer(f, delimiter='\t', lineterminator='\n', quoting=csv.QUOTE_NONE, escapechar='\\')
        w.writerow(cols)
        for r in rows:
            w.writerow([str(r.get(c, '')).replace('\t', ' ') for c in cols])


def total(rows, **where):
    return sum(r['homes_net'] for r in rows if r['counted'] == 'yes' and all(r.get(k) == v for k, v in where.items()))


def n(v):
    return f'{v:,}'


def summary(base, approved, pending, end):
    req, supply = base['requirement_with_buffer'], base['supply_counted']
    appr = total(approved)
    appr_a, appr_b = total(approved, category='a'), total(approved, category='b')
    live = [r for r in pending if r['status'] in ('pending', 'pending-decision')]
    pend = total(live)
    held = [r for r in live if r['counted'] != 'yes' and r['homes_net']]
    appeal = sum(r['homes_net'] for r in pending if r['status'] == 'at-appeal')
    rm = sum(r['homes_gross'] for r in approved if r['route'] == 'reserved-matters')
    auto = sum(1 for r in approved + pending if r['basis'] == 'auto')
    L = [f'# Stratford-on-Avon housing supply: approvals and pending applications since {base["base_date"]}', '',
         f'Generated {date.today().isoformat()} by `tools/stratford_supply.py` from the council\'s planning register, covering decisions '
         f'issued {base["base_date"]} (exclusive) to {end.isoformat()}. Do not edit: change `baseline.json` or `overrides.tsv` and re-run. '
         'Method and caveats: `README.md`.', '',
         '## The council\'s calculation', '',
         '| | Homes |', '|---|---|',
         f'| Local housing need, a year | {n(base["annual_need"])} |',
         f'| Five-year requirement with {base["buffer_percent"]}% buffer | {n(req)} |',
         f'| Supply counted at {base["base_date"]} | {n(supply)} |',
         f'| Deficit | {n(supply - req)} |',
         f'| Years of supply | {base["years"]} |', '',
         f'## Approved since {base["base_date"]}', '',
         '| Route | Applications | Homes (net) |', '|---|---|---|']
    for label, where in [('Full permission', {'route': 'full', 'decided_by': 'council'}),
                         ('Prior approval', {'route': 'prior-approval', 'decided_by': 'council'}),
                         ('Outline permission', {'route': 'outline', 'decided_by': 'council'}),
                         ('Permission in principle', {'route': 'pip', 'decided_by': 'council'}),
                         ('Allowed on appeal', {'decided_by': 'appeal'})]:
        sel = [r for r in approved if r['counted'] == 'yes' and r['homes_net'] and all(r.get(k) == v for k, v in where.items())]
        L.append(f'| {label} | {len(sel)} | {n(sum(r["homes_net"] for r in sel))} |')
    L += [f'| **Total** | | **{n(appr)}** |', '',
          f'- Category (a), deliverable until the permission expires: {n(appr_a)}.',
          f'- Category (b), deliverable only with clear evidence of completions within five years: {n(appr_b)}.',
          f'- Reserved matters approved in the period cover {n(rm)} homes. They are not new homes and are not in the total.', '',
          '## Pending', '',
          '| Route | Applications | Homes (net) |', '|---|---|---|']
    for label, route in [('Outline and hybrid', 'outline'), ('Full', 'full'), ('Permission in principle', 'pip'), ('Prior approval', 'prior-approval')]:
        sel = [r for r in live if r['counted'] == 'yes' and r['homes_net'] and r['route'] == route]
        L.append(f'| {label} | {len(sel)} | {n(sum(r["homes_net"] for r in sel))} |')
    L += [f'| **Total** | | **{n(pend)}** |', '']
    for r in held:
        L.append(f'- Not in the total: {r["reference"]}, {n(r["homes_net"])} homes, {r["place"]} ({r["note"]}).')
    L += [f'- Refused or undetermined and now at appeal, not in the total: {n(appeal)} homes.', '',
          '## If everything pending were approved', '',
          '| | Homes |', '|---|---|',
          f'| Supply counted at {base["base_date"]} | {n(supply)} |',
          f'| Approved since | {n(appr)} |',
          f'| Pending | {n(pend)} |',
          f'| **Total** | **{n(supply + appr + pend)}** |',
          f'| Requirement with buffer | {n(req)} |',
          f'| Difference | {n(supply + appr + pend - req)} |', '',
          'This is a count of permissions, not a five-year supply figure. Only homes expected to be completed within five years count, '
          'homes completed since the base date have left the supply, and category (b) sites count only with clear evidence.', '',
          '## Largest pending applications', '',
          '| Reference | Place | Route | Homes |', '|---|---|---|---|']
    for r in sorted((r for r in live if r['counted'] == 'yes'), key=lambda r: -r['homes_net'])[:12]:
        L.append(f'| {r["reference"]} | {r["place"]} | {r["route"]} | {n(r["homes_net"])} |')
    L += ['', f'{auto} of the {len(approved) + len(pending)} rows carry a count read from the description and not checked by hand (`basis` = `auto`).', '']
    with open(os.path.join(OUT, 'summary.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(L))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--to', help='last decision date to include (default today)')
    ap.add_argument('--save-raw', help='save the register pull to this JSON file')
    ap.add_argument('--from-raw', help='rebuild from a saved pull instead of fetching')
    a = ap.parse_args()
    with open(os.path.join(OUT, 'baseline.json'), encoding='utf-8') as f:
        base = json.load(f)
    start = date.fromisoformat(base['base_date']) + timedelta(days=1)
    end = date.fromisoformat(a.to) if a.to else date.today()
    if a.from_raw:
        with open(a.from_raw, encoding='utf-8') as f:
            raw = json.load(f)
        end = date.fromisoformat(raw['to'])
    else:
        print(f'decisions issued {start} to {end} ...', file=sys.stderr)
        raw = {'to': end.isoformat(), 'decided': fetch_decided(start, end)}
        print('appeals ...', file=sys.stderr)
        raw['appeals'] = fetch_appeals(start, end)
        print('pending ...', file=sys.stderr)
        raw['pending'] = fetch_pending(end)
        if a.save_raw:
            with open(a.save_raw, 'w', encoding='utf-8') as f:
                json.dump(raw, f)
    overrides, used = load_overrides(), set()

    approved = []
    for x in raw['decided']:
        if APPROVED.match(x.get('status') or ''):
            r = build_row(x, overrides, used)
            if r:
                approved.append({**r, 'decided': x['_decided'], 'decided_by': 'council'})
    for x in raw['appeals']:
        r = build_row(x, overrides, used)
        if r:
            approved.append({**r, 'decided': x['_decided'], 'decided_by': 'appeal',
                             'note': '; '.join(p for p in (r['note'], 'appeal ' + x['_appeal_ref'] if x['_appeal_ref'] else '') if p)})
    approved.sort(key=lambda r: (r['decided'], r['reference']))

    pending = []
    for x in raw['pending']:
        status = x.get('status') or ''
        state = ('pending' if status == 'Pending Consideration' else 'pending-decision' if status == 'Pending Decision'
                 else 'at-appeal' if 'progress' in (x.get('appealStatus') or '').lower() else None)
        r = build_row(x, overrides, used) if state else None
        if r and r['route'] != 'reserved-matters':
            pending.append({**r, 'status': state, 'valid': uk_date(x.get('validDate'))})
    pending.sort(key=lambda r: (r['route'], r['reference']))

    write_tsv('approved.tsv', ['reference', 'decided', 'decided_by', 'route', 'homes_gross', 'homes_net', 'counted', 'category',
                               'basis', 'note', 'place', 'proposal', 'link'], approved)
    write_tsv('pending.tsv', ['reference', 'valid', 'status', 'route', 'homes_gross', 'homes_net', 'counted', 'basis', 'note',
                              'place', 'proposal', 'link'], pending)
    summary(base, approved, pending, end)
    for ref in sorted(set(overrides) - used):
        print(f'override not used (decided, withdrawn or out of range?): {ref}', file=sys.stderr)
    print(f'approved: {len(approved)} rows, {total(approved)} homes; pending: {len(pending)} rows, '
          f'{total([r for r in pending if r["status"] != "at-appeal"])} homes -> {OUT}')


if __name__ == '__main__':
    main()
