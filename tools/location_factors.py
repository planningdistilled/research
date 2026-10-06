"""Check and tally the location-factors register.

data/decisions/analysis/location-factors/register.tsv records, for every decision where the
sustainability of the location came up, which factors the decision-maker used and which way each cut
(codebook.md beside it defines the codes). This tool:

1. validates the register (columns, codes, signs, case ids, decisive within factors);
2. checks every coded factor against the text of the decision (the decision letter in pins-corpus, or
   the council report, notice or minutes in the private sources checkout): the text must contain
   wording for that factor. This catches a factor coded against the wrong decision or one the document
   never mentions; it does not prove which way the factor cut;
3. prints the tallies the sustainable location pages publish.

Run from the repo root: python3 tools/location_factors.py [--list] (needs pdftotext and, for council
decisions, the private sources checkout). Exits 1 on any structural error or unsupported factor.
"""
import collections, csv, glob, json, os, re, subprocess, sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from paths import DECISIONS, PINS_CORPUS, SOURCES, has_sources, resolve_ref  # noqa: E402

DIR = os.path.join(DECISIONS, 'analysis', 'location-factors')
REGISTER = os.path.join(DIR, 'register.tsv')
COLUMNS = ['case_id', 'engaged', 'finding', 'factors', 'decisive', 'other', 'note']
TOKEN = re.compile(r'^([A-K]\d{1,2})([+=-])$')

CODES_FILE = os.path.join(DIR, 'codes.tsv')
# codes.tsv is the one list of classes (single letter) and factor codes: code, label, and for a factor
# the wording (a regular expression) the decision text must contain. The page builders read it too.
with open(CODES_FILE, newline='') as _fh:
    _codes = list(csv.DictReader(_fh, delimiter='\t', quoting=csv.QUOTE_NONE))
CLASSES = {r['code']: r['label'] for r in _codes if len(r['code']) == 1}
CODES = {r['code']: (r['label'], r['wording']) for r in _codes if len(r['code']) > 1}
order = lambda code: (code[0], int(code[1:]))  # noqa: E731


def load():
    """Rows of the register as dicts, with `f` {code: sign} and `dec` [codes]. Raises on a malformed file."""
    with open(REGISTER, newline='') as fh:
        rows = list(csv.DictReader(fh, delimiter='\t', quoting=csv.QUOTE_NONE))
    if not rows or list(rows[0].keys()) != COLUMNS:
        raise SystemExit('register.tsv: unexpected header')
    for r in rows:
        r['f'] = dict(TOKEN.match(t).groups() if TOKEN.match(t) else (t, '?') for t in r['factors'].split(',') if t)
        r['dec'] = [t[:-1] for t in r['decisive'].split(',') if t]
    return rows


def pdf_text(path):
    try:
        return subprocess.run(['pdftotext', '-layout', path, '-'], capture_output=True, text=True, timeout=120).stdout
    except (OSError, subprocess.SubprocessError):
        return ''


def source_text(case):
    """All the text we hold for a decision: the PINS letter, or every council document saved under its id."""
    parts = []
    m = re.search(r'(\d{7})$', case['case_id'])
    if m and os.path.isfile(os.path.join(PINS_CORPUS, m.group(1) + '.txt')):
        parts.append(open(os.path.join(PINS_CORPUS, m.group(1) + '.txt'), errors='ignore').read())
    files = set()
    lc = resolve_ref(case.get('local_copy') or '')
    if lc and os.path.isfile(lc):
        files.add(lc)
    if not m or not parts:
        files.update(glob.glob(os.path.join(SOURCES, 'council', case['case_id'] + '-*')))
        # committee papers and minutes are saved once per meeting: <council>-<date>-minutes.pdf
        files.update(glob.glob(os.path.join(SOURCES, 'council', case['case_id'].split('-')[0] + '-20??-??-??-*')))
        files.update(glob.glob(os.path.join(SOURCES, 'stratford-dc', 'public-note', case['case_id'] + '-*.txt')))
    for f in sorted(files):
        parts.append(pdf_text(f) if f.lower().endswith('.pdf') else open(f, errors='ignore').read() if f.lower().endswith('.txt') else '')
    return re.sub(r'\s+', ' ', ' '.join(parts)).lower()


def main():
    rows = load()
    cases = {c['case_id']: c for c in json.load(open(os.path.join(DECISIONS, 'index', 'cases.json')))}
    errors, unsupported, unread = [], [], []
    seen = set()
    for r in rows:
        cid = r['case_id']
        if cid in seen: errors.append(f'{cid}: duplicate row')
        seen.add(cid)
        if cid not in cases: errors.append(f'{cid}: not in the decisions index'); continue
        if r['engaged'] not in ('Y', 'B', 'N'): errors.append(f'{cid}: engaged "{r["engaged"]}"')
        if r['engaged'] == 'N' and (r['factors'] or r['finding']): errors.append(f'{cid}: N row carries a finding or factors')
        if r['engaged'] != 'N' and r['finding'] not in ('pass', 'fail', 'mixed', 'unclear'): errors.append(f'{cid}: finding "{r["finding"]}"')
        if r['engaged'] == 'Y' and not r['f'] and not r['other']: errors.append(f'{cid}: Y row with no factor')
        for code, sign in r['f'].items():
            if code not in CODES or sign == '?': errors.append(f'{cid}: bad factor "{code}{sign}"')
        for t in r['decisive'].split(','):
            if t and t not in r['factors'].split(','): errors.append(f'{cid}: decisive {t} is not among its factors')
        if len(r['note'].split()) > 25: errors.append(f'{cid}: note over 25 words')
        if not r['f']: continue
        text = source_text(cases[cid])
        if len(text) < 500:
            unread.append(cid); continue
        for code in r['f']:
            if code in CODES and not re.search(CODES[code][1], text): unsupported.append(f'{cid}: {code} ({CODES[code][0]})')

    Y = [r for r in rows if r['engaged'] == 'Y']
    n = len(Y)
    count = collections.Counter(r['engaged'] for r in rows)
    print(f'register: {len(rows)} decisions screened; {count["Y"]} assessed with stated factors, {count["B"]} bare assertion or concession, {count["N"]} not about accessibility')
    print('findings:', dict(collections.Counter(r['finding'] for r in Y)))
    total = sum(len(r['f']) for r in Y)
    print(f'factor findings: {total} ({total / n:.1f} per decision); for {sum(s == "+" for r in Y for s in r["f"].values())}, '
          f'against {sum(s == "-" for r in Y for s in r["f"].values())}, set aside or neutral {sum(s == "=" for r in Y for s in r["f"].values())}')
    if '--list' in sys.argv:
        for cls, name in CLASSES.items():
            inc = [r for r in Y if any(c[0] == cls for c in r['f'])]
            print(f'\n{cls} {name}: {len(inc)} decisions; decisive in {sum(any(c[0] == cls for c in r["dec"]) for r in Y)}')
            for code in sorted((c for c in CODES if c[0] == cls), key=order):
                sg = collections.Counter(r['f'][code] for r in Y if code in r['f'])
                print(f'  {code:4} {CODES[code][0]:58} {sum(sg.values()):4}  +{sg["+"]:<4} -{sg["-"]:<4} ={sg["="]:<4} decisive {sum(code in r["dec"] for r in Y)}')
    checked = sum(len(r['f']) for r in rows if r['f'] and r['case_id'] not in unread)
    print(f'\nsource-text check: {checked - len(unsupported)} of {checked} coded factors have supporting wording in the decision text')
    if unread:
        print(f'no text held (scanned, or the private sources checkout is absent{"" if has_sources() else " - it is"}): {len(unread)}: ' + ', '.join(unread))
    for line in errors: print('ERROR', line)
    for line in unsupported: print('UNSUPPORTED', line)
    sys.exit(1 if errors or unsupported else 0)


if __name__ == '__main__':
    main()
