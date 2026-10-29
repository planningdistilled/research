#!/usr/bin/env python3
"""Four-error scoring support for the council sweep (October 2026).

Subcommands (all paths come from paths.py; run with `python3 -I`):

  inventory  List every non-Stratford officer report in the sweep that is a housing
             proposal decided or reported on or after 17 August 2026 and is not already
             in the hand-scored table of 99, with a reason for every exclusion.
  screen     Mechanical text signals for every included report (grep counts): TR3,
             Connectivity Tool, Annex B, Green Belt, 2024/2026 Framework markers, the
             "very limited weight" template, design-harm and location-finding words.
  excerpt    Print the keyed passages of one report with PDF page numbers, for reading.
  check      Verify a scored TSV: every quotation in a note (text inside double quotes)
             is a whitespace-collapsed substring of the report text, every page
             reference points at a page containing that quotation, and every
             `not-mentioned` TR3 code has a grep count of 0.

The sweep text files are downloaded data: this script only reads them.
"""
import argparse
import csv
import glob
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from paths import DECISIONS, SOURCES  # noqa: E402

LOGDIR = os.path.join(DECISIONS, 'harvest-log', 'council')
SWEEP = os.path.join(SOURCES, 'council', 'sweep')
ANALYSIS = os.path.join(DECISIONS, 'analysis')
HAND = os.path.join(ANALYSIS, 'other-councils-four-errors-2026-10.tsv')
START = '2026-08-17'

COUNCIL = {
    'babergh-mid-suffolk': 'Babergh and Mid Suffolk', 'basildon': 'Basildon', 'bathnes': 'Bath and North East Somerset',
    'bromsgrove': 'Bromsgrove', 'cheshire-east': 'Cheshire East', 'chorley': 'Chorley', 'cotswold': 'Cotswold',
    'dacorum': 'Dacorum', 'east-devon': 'East Devon', 'elmbridge': 'Elmbridge', 'hertsmere': 'Hertsmere',
    'horsham': 'Horsham', 'lichfield': 'Lichfield', 'maidstone': 'Maidstone', 'maldon': 'Maldon',
    'malvern-hills': 'Malvern Hills', 'mid-sussex': 'Mid Sussex', 'north-herts': 'North Hertfordshire',
    'redditch': 'Redditch', 'reigate-banstead': 'Reigate and Banstead', 'sefton': 'Sefton', 'solihull': 'Solihull',
    'stratford': 'Stratford-on-Avon', 'three-rivers': 'Three Rivers', 'tonbridge-malling': 'Tonbridge and Malling',
    'uttlesford': 'Uttlesford', 'warwick': 'Warwick', 'worcester': 'Worcester City', 'wychavon': 'Wychavon',
}

PROCEDURAL = re.compile(r"\b(householder|section 73|s\.?73\b|variation of (?:a )?condition|removal of (?:a )?condition|removal or variation|minor material amendment|"
                        r"non[- ]material|details of condition|discharge of|approval of details|submission of details|details pursuant|details submitted|"
                        r"prior approval|prior notification|certificate of lawful|lawful development|lawfulness|listed building consent|"
                        r"tree preservation|tpo\b|works to trees?|prune|crown|fell(?:ing)?\b|advertisement|reserved matters|approval of reserved|"
                        r"hmo\b|house in multiple|house of multiple|multiple occupation|children's home|care home|c2\b|gypsy|traveller|travelling showpeople|"
                        r"rural workers?|agricultural workers?|farm ?workers?|temporary (?:dwelling|accommodation|mobile home|caravan|living)|"
                        r"ancillary|annexe?\b|granny|home (?:office|gym|working|studio)|summer ?house|garden room|outbuilding|"
                        r"holiday|glamping|camping|caravan site|touring|lodges?\b|seasonal workers|winter storage|"
                        r"screening opinion|eia\b|technical details consent|technical consent|\btdc\b|bin store|decking|solar panel|condensers|treehouse|smoking shelter|orangery|dormer|porch|conservatory|"
                        r"to storage use|beauty salon|day nursery|medical centre|convenience store|motor vehicle|kennel|back to (?:one|a) single|associated with the existing dwelling|habitable (?:room|space))", re.I)
SUFFIX = re.compile(r"/(?:HP|HSE|FUH|HOU|HH|PD56M|PA\d*|TDC\d*|VAR|TPO\w*|TNCA|LBC|ADV|CLE|CLP|CLEUD|LDC\w*|DIS|COND|NMA|RM|RES|RD|SUB|PNEXT|GPDQ|GPDE|GPDO|TCON|DOC|DISC|CPO|S73|VOC)$", re.I)
INTERNAL = re.compile(r"extension|alteration|to (?:the )?(?:existing |main )?(?:dwelling|house|bungalow|property)|of (?:the )?existing (?:dwelling|house|bungalow)|existing (?:dwelling|house)house|re-?roof|recladding|rendering", re.I)
NEW_HOMES = re.compile(r"(?:erection|erect|construction|construct|build(?:ing)?|conversion|convert|change of use|development|redevelopment|"
                       r"outline|permission in principle|replacement|replace|subdivision|sub-division|subdivide|creation|create|formation|form|provision|provide|"
                       r"siting|proposed|new|demolition)[^|]{0,160}?"
                       r"(?:dwellings?\b|dwelling ?houses?\b|(?<!summer )(?<!green)(?<!ware)(?<!boat)(?<!wendy)(?<!hen )(?<!glass)(?<!club)(?<!bath)(?<!play)(?<!pump)(?<!gate)(?<!wash)(?<!out)(?<!field)(?<!coach)(?<!chicken )houses?\b(?!hold)|"
                       r"homes?\b(?! (?:office|gym|working|studio|improvement|extension))|residential (?:units?|development|accommodation|scheme|use|studio|flats?|apartments?|dwellings?|property|properties)|"
                       r"flats?\b|apartments?\b|maisonettes?\b|bungalows?\b|\bc3\b|self[- ]?build|custom[- ]?build|live[- ]?work|cottages?\b)", re.I)
N_HOMES = re.compile(r"\b\d{1,4}\s*(?:no\.?|x)?\s*(?:new\s+|additional\s+|affordable\s+|market\s+|residential\s+|detached\s+|semi[- ]detached\s+|terraced\s+)*"
                     r"(?:dwellings?|dwelling ?houses?|homes?|houses?|residential units?|units?|flats?|apartments?|bungalows?|maisonettes?|cottages?)\b", re.I)
HOMES = [
    (re.compile(r"\b(\d{1,3})\s*(?:no\.?|x)?\s*(?:new\s+|additional\s+|residential\s+|affordable\s+|detached\s+|semi[- ]detached\s+|terraced\s+)*"
                r"(?:dwellings?|dwellinghouses?|homes?|houses?|residential units?|units?|flats?|apartments?|bungalows?|maisonettes?)", re.I), None),
    (re.compile(r"\b(one|a|single|1)\s+(?:new\s+|additional\s+|detached\s+|replacement\s+)*(?:dwelling|dwellinghouse|house|home|bungalow|self[- ]build|annexe?)\b", re.I), 1),
    (re.compile(r"\b(two|pair of|2)\s+(?:new\s+|additional\s+|detached\s+|semi[- ]detached\s+)*(?:dwellings?|houses?|homes?|bungalows?)\b", re.I), 2),
    (re.compile(r"\b(three|3)\s+(?:new\s+)*(?:dwellings?|houses?|homes?|bungalows?)\b", re.I), 3),
    (re.compile(r"\b(four|4)\s+(?:new\s+)*(?:dwellings?|houses?|homes?|bungalows?)\b", re.I), 4),
    (re.compile(r"\b(five|5)\s+(?:new\s+)*(?:dwellings?|houses?|homes?|bungalows?)\b", re.I), 5),
    (re.compile(r"\bup to (\d{1,4})\b", re.I), None),
]

SIGNALS = {
    'tr3': re.compile(r"\bTR3\b"),
    'tr3_limb_a': re.compile(r"TR3\s*\(?\s*(?:1\s*\)?\s*\(?\s*)?a\s*\)|TR3\(1\)\(a\)|TR3\s*\(a\)|TR3\s*1\s*\(a\)"),
    'tool': re.compile(r"connectivity (?:tool|score)", re.I),
    'annexb': re.compile(r"\bAnnex\s*B\b"),
    'annex2': re.compile(r"\bAnnex\s*2\b"),
    'green_belt': re.compile(r"\bGreen Belt\b", re.I),
    'washed': re.compile(r"washed[- ]over", re.I),
    'gb7': re.compile(r"\bGB\s?7\b"),
    'gb6': re.compile(r"\bGB\s?6\b"),
    's4': re.compile(r"\bS4\b"),
    's5': re.compile(r"\bS5\b"),
    's5_5': re.compile(r"S5\s*\(5\)|S5\(5\)|paragraph 5 of (?:policy )?S5", re.I),
    's5_1j': re.compile(r"S5\s*\(1\)\s*\(j\)|S5\(j\)|S5\s*1\s*\(j\)|S5\s*\(1\)\s*j\b", re.I),
    'dp3': re.compile(r"\bDP3\b"),
    'dp3_3': re.compile(r"DP3\s*\(3\)|DP3\(3\)|paragraph 3 of (?:policy )?DP3|DP3\s*\(?3\)?", re.I),
    'clear_just': re.compile(r"clear justification", re.I),
    'para11d': re.compile(r"paragraph 11\s*\(?d\)?|para\.? 11\s*\(?d\)?|11\(d\)|tilted balance|significantly and demonstrably", re.I),
    'ndmp': re.compile(r"national development management polic|\bNDMP", re.I),
    'nppf2026': re.compile(r"(?:NPPF|Framework)[^.\n]{0,40}(?:August )?2026|2026[^.\n]{0,20}(?:NPPF|Framework)", re.I),
    'nppf2024': re.compile(r"(?:NPPF|Framework)[^.\n]{0,40}(?:December )?2024|2024[^.\n]{0,20}(?:NPPF|Framework)", re.I),
    'vlw': re.compile(r"very limited weight", re.I),
    'mat_incons': re.compile(r"materially inconsistent", re.I),
    'five_year': re.compile(r"five[- ]year (?:housing land )?supply|5[- ]?year (?:housing land )?supply|5YHLS|HLS\b", re.I),
    'sust_loc': re.compile(r"sustainable location|accessible location|locational sustainab|sustainably located|sustainable settlement", re.I),
    'tier': re.compile(r"settlement hierarchy|category [1-5]\b|tier\b|service village|service centre|local service|key service|"
                       r"rural service|sustainable village|larger village|smaller village|settlement boundary|village envelope|"
                       r"development boundary|built[- ]up area boundary|BUAB", re.I),
    'route': re.compile(r"footway|footpath|pavement|street ?light|bus stop|bus service|railway station|train station|"
                        r"walking distance|\b\d{2,4}\s?m(?:etres)?\b|\d+(?:\.\d+)?\s?(?:km|miles?)\b|speed limit|\d0\s?mph", re.I),
    'design_harm': re.compile(r"(?:harm|detriment|adverse (?:impact|effect))[^.]{0,80}(?:character|appearance|design|street ?scene|"
                              r"landscape|visual|setting|form)|(?:character|appearance|design|street ?scene|landscape|visual)[^.]{0,80}"
                              r"(?:harm|detriment|conflict)|contrary to[^.]{0,60}(?:design|character)|conflict with[^.]{0,80}(?:design|character)", re.I),
    'refuse': re.compile(r"recommend(?:ation|ed)?\s*:?\s*(?:that (?:planning )?permission be )?(?:refus|REFUS)", re.I),
    'grant': re.compile(r"recommend(?:ation|ed)?\s*:?\s*(?:that (?:planning )?permission be )?(?:grant|GRANT|approv|APPROV|permit|PERMIT)", re.I),
}

KEYED = {
    'location': re.compile(r"sustainable location|accessib|settlement hierarchy|category [1-5]\b|service village|service centre|"
                           r"\bTR3\b|connectivity|footway|bus stop|bus service|railway station|train station|walking distance|"
                           r"genuine choice|need to travel|private car|sustainable (?:transport|modes|travel)|locational", re.I),
    'route_gb': re.compile(r"\bS[345]\b|\bS5\s*\(|\bGB\s?[678]\b|grey belt|inappropriate development|very special circumstances|"
                           r"washed|within settlements|outside settlements|Annex\s*B|settlement\b.{0,40}(?:defin|purpose)", re.I),
    'design': re.compile(r"\bDP3\b|\bDP\s?3\b|clear justification|(?:harm|conflict|contrary|detriment)[^.]{0,80}(?:character|appearance|"
                         r"design|street ?scene|landscape|visual|form of development)|design (?:quality|code|guide|policy)|"
                         r"well[- ]designed|cul[- ]de[- ]sac|backland|tandem|overdevelopment|cramped|incongruous|out of keeping|overbearing|dominant|"
                         r"contrived|poor design|quality of design|design and layout", re.I),
    'conclusion': re.compile(r"recommend|refus|reason[s]? for|conclusion|planning balance|substantially outweigh|significantly and demonstrably|"
                             r"on balance|overall|very special circumstances|grant", re.I),
    'weight': re.compile(r"\bweight\b|out[- ]of[- ]date|materially inconsistent|Annex\s*A|five[- ]year|5[- ]?year|tilted|11\s*\(?d\)?|"
                         r"significantly and demonstrably|substantially outweigh|planning balance", re.I),
    'framework': re.compile(r"NPPF|National Planning Policy Framework|the Framework|2024|2026|NDMP|National Development Management", re.I),
}


def norm_ref(r):
    return re.sub(r'[^A-Z0-9]', '', (r or '').upper())


def council_of(slug):
    base = slug[:-10] if slug.endswith('-committee') else slug
    return COUNCIL.get(base, base), base


def read_text(path):
    try:
        with open(path, encoding='utf-8', errors='replace') as fh:
            return fh.read()
    except OSError:
        return ''


def pages_of(text):
    """Return list of page texts (pdftotext form feeds)."""
    return text.split('\f')


def collapse(s):
    return re.sub(r'\s+', ' ', s).strip()


def hand_refs():
    out = set()
    with open(HAND, encoding='utf-8') as fh:
        for r in csv.DictReader(fh, delimiter='\t'):
            out.add((r['council'], norm_ref(r['ref'])))
    return out


REF_IN_NAME = re.compile(r"((?:[A-Z]{1,4}[/_-])?\d{2}[/_-]\d{4,5}[/_-][A-Z]{2,6}|\d{2}[/_-]\d{5}(?:[/_-][A-Z]+)?|DC[/_-]\d{2}[/_-]\d{5}(?:[/_-][A-Z]+)?|"
                         r"PL[/_-]\d{4}[/_-]\d{5}[/_-][A-Z]+|[A-Z]{2}[/_-]\d{2}[/_-]\d{5}[/_-][A-Z]+|\d{2}[/_-]\d{4,5}[/_-]?(?:FUL|OUT|PIP|REM|FULL|F|O|RM|P|CU|MF|ROC|FL|DE)?)")


def guess_homes(s):
    s = s or ''
    for rx, fixed in HOMES:
        m = rx.search(s)
        if m:
            if fixed is not None:
                return str(fixed)
            try:
                return str(int(m.group(1)))
            except (ValueError, IndexError):
                continue
    return ''


def head_proposal(text):
    head = text[:4000]
    m = re.search(r"(?:Proposal|Proposed Development|Development|Description)\s*[:\-]?\s*(.{10,300}?)(?:\n\s*\n|\n[A-Z][a-z]+\s*:)", head, re.S)
    return collapse(m.group(1)) if m else ''


def is_housing(proposal, text, ref=''):
    p = collapse(proposal or '')
    hp = head_proposal(text)
    src = p if len(p) > 20 else (p + ' || ' + hp)
    if PROCEDURAL.search(src) or SUFFIX.search(ref or ''):
        return False, 'not in scope: householder, procedural, ancillary, HMO/C2, traveller, rural worker or tourism proposal'
    if N_HOMES.search(src):
        return True, ''
    for m in NEW_HOMES.finditer(src):
        if not INTERNAL.search(m.group(0)):
            return True, ''
    return False, 'not housing: no new dwelling in the proposal'


def cmd_inventory(a):
    hand = hand_refs()
    rows = []
    for f in sorted(glob.glob(os.path.join(LOGDIR, '*.jsonl'))):
        slug = os.path.basename(f)[:-6]
        council, base = council_of(slug)
        if base == 'stratford':
            continue
        committee = slug.endswith('-committee')
        for line in open(f, encoding='utf-8'):
            try:
                d = json.loads(line)
            except ValueError:
                continue
            reports = [x for x in d.get('fetched', []) if isinstance(x, dict) and x.get('kind') == 'report']
            if not reports:
                continue
            folder = os.path.join(SWEEP, slug, (d.get('ref') or '').replace('/', '-'))
            for x in reports:
                txt = x.get('txt') or ''
                path = os.path.join(folder, txt)
                if committee:
                    m = REF_IN_NAME.search(x.get('file') or '')
                    ref = m.group(1).replace('_', '/').replace('-', '/') if m else ''
                else:
                    ref = d.get('ref') or ''
                text = read_text(path)
                row = {'slug': slug, 'council': council, 'ref': ref, 'date': d.get('date') or '', 'level': 'committee' if committee else (d.get('level') or 'delegated'),
                       'outcome': d.get('outcome') or '', 'proposal': collapse(d.get('proposal') or '')[:200], 'address': collapse(d.get('address') or '')[:120],
                       'homes_guess': '', 'txt': os.path.relpath(path, SOURCES) if text else '', 'pages': str(len(pages_of(text))) if text else '0',
                       'chars': str(len(text)), 'included': 'no', 'reason': ''}
                if not text:
                    row['reason'] = 'no text extract'
                elif (d.get('date') or '') < START:
                    row['reason'] = 'before 17 Aug 2026'
                elif committee and not ref:
                    row['reason'] = 'committee file without an application reference in its name (pack or list)'
                elif (council, norm_ref(ref)) in hand or any(h[0] == council and norm_ref(ref) and h[1].endswith(norm_ref(ref)[-9:]) and len(norm_ref(ref)) >= 7 for h in hand):
                    row['reason'] = 'already in the hand-scored 99'
                elif len(text) < 1500:
                    row['reason'] = 'text extract under 1,500 characters (scan or stub)'
                else:
                    ok, why = is_housing(d.get('proposal') if not committee else head_proposal(text), text, ref)
                    if not ok:
                        row['reason'] = why
                    else:
                        row['included'] = 'yes'
                        row['homes_guess'] = guess_homes((d.get('proposal') or '') + ' ' + head_proposal(text))
                        if not row['proposal'] and committee:
                            row['proposal'] = head_proposal(text)[:200]
                rows.append(row)
    # overrides: analysis/other-councils-sweep-overrides.tsv (council, ref, included, reason)
    ov = {}
    ovp = os.path.join(ANALYSIS, 'other-councils-sweep-overrides.tsv')
    if os.path.exists(ovp):
        with open(ovp, encoding='utf-8') as fh:
            for o in csv.DictReader(fh, delimiter='\t'):
                ov[(o['council'], norm_ref(o['ref']))] = o
    best = {}
    for r in rows:
        if r['included'] != 'yes':
            continue
        key = (r['council'], norm_ref(r['ref']))
        if key in ov:
            r['included'] = ov[key]['included']
            r['reason'] = ov[key]['reason'] if ov[key]['included'] == 'no' else ''
            if r['included'] != 'yes':
                continue
        if key in best and int(best[key]['chars']) >= int(r['chars']):
            r['included'] = 'no'
            r['reason'] = 'duplicate of the same report (smaller file); scored under the other row'
        else:
            if key in best:
                best[key]['included'] = 'no'
                best[key]['reason'] = 'duplicate of the same report (smaller file); scored under the other row'
            best[key] = r
    cols = ['slug', 'council', 'ref', 'date', 'level', 'outcome', 'proposal', 'address', 'homes_guess', 'txt', 'pages', 'chars', 'included', 'reason']
    with open(a.out, 'w', encoding='utf-8', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=cols, delimiter='\t', lineterminator='\n')
        w.writeheader()
        w.writerows(rows)
    inc = [r for r in rows if r['included'] == 'yes']
    print(f'{len(rows)} reports listed, {len(inc)} included -> {a.out}')
    by = {}
    for r in rows:
        by.setdefault(r['reason'] or 'included', 0)
        by[r['reason'] or 'included'] += 1
    for k, v in sorted(by.items(), key=lambda kv: -kv[1]):
        print(f'  {v:5d}  {k}')


def cmd_screen(a):
    with open(a.inventory, encoding='utf-8') as fh:
        inv = [r for r in csv.DictReader(fh, delimiter='\t') if r['included'] == 'yes']
    out = []
    for r in inv:
        text = read_text(os.path.join(SOURCES, r['txt']))
        row = {k: r[k] for k in ('slug', 'council', 'ref', 'date', 'level', 'outcome', 'homes_guess', 'txt', 'pages')}
        for k, rx in SIGNALS.items():
            row[k] = str(len(rx.findall(text)))
        row['framework_guess'] = ('2026' if int(row['ndmp']) + int(row['tr3']) + int(row['s5']) + int(row['gb7']) + int(row['dp3']) > 0 else '') or ('2024' if int(row['para11d']) + int(row['nppf2024']) > 0 else 'unclear')
        if row['framework_guess'] == '2026' and (int(row['para11d']) > 0 or int(row['nppf2024']) > 0):
            row['framework_guess'] = 'mixed'
        out.append(row)
    cols = list(out[0].keys()) if out else []
    with open(a.out, 'w', encoding='utf-8', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=cols, delimiter='\t', lineterminator='\n')
        w.writeheader()
        w.writerows(out)
    print(f'{len(out)} rows -> {a.out}')


def cmd_excerpt(a):
    text = read_text(a.txt if os.path.isabs(a.txt) else os.path.join(SOURCES, a.txt))
    pages = pages_of(text)
    keys = a.keys.split(',') if a.keys else list(KEYED)
    print(f'# {a.txt}  ({len(pages)} pages, {len(text)} chars)')
    if a.head:
        print('## head (p.1)')
        print(collapse(pages[0][:a.head]))
    for key in keys:
        rx = KEYED[key]
        print(f'## {key}')
        seen = 0
        for pn, pg in enumerate(pages, 1):
            paras = [collapse(p) for p in re.split(r'\n\s*\n', pg) if p.strip()]
            for para in paras:
                if rx.search(para):
                    seen += 1
                    if seen > a.max:
                        break
                    print(f'(p.{pn}) {para[:a.width]}')
            if seen > a.max:
                print(f'... more than {a.max} passages')
                break


def cmd_read(a):
    """Compact keyed excerpts for several inventory rows, for scoring."""
    with open(a.inventory, encoding='utf-8') as fh:
        inv = [r for r in csv.DictReader(fh, delimiter='\t') if r['included'] == 'yes']
    want = set(norm_ref(x) for x in a.refs.split(',')) if a.refs else None
    sel = [r for r in inv if (want is None or norm_ref(r['ref']) in want)]
    if a.start is not None:
        sel = sel[a.start:a.start + a.count]
    for r in sel:
        text = read_text(os.path.join(SOURCES, r['txt']))
        pages = pages_of(text)
        sig = {k: len(rx.findall(text)) for k, rx in SIGNALS.items()}
        print(f"\n##### {r['council']} | {r['ref']} | {r['level']} | {r['date']} | {r['outcome']} | homes~{r['homes_guess']} | {len(pages)}pp")
        print(f"# {r['address']} :: {r['proposal'][:160]}")
        print(f"# txt={r['txt']}")
        print('# signals: ' + ' '.join(f'{k}={v}' for k, v in sig.items() if v))
        print('## head (p.1): ' + collapse(pages[0][:a.head]))
        budget = a.cap
        for key in ('location', 'route_gb', 'design', 'weight', 'conclusion', 'framework'):
            rx = KEYED[key]
            out = []
            seen = set()
            for pn, pg in enumerate(pages, 1):
                for para in (collapse(p) for p in re.split(r'\n\s*\n', pg) if p.strip()):
                    if len(para) < 40 or not rx.search(para):
                        continue
                    k = para[:80]
                    if k in seen:
                        continue
                    seen.add(k)
                    out.append(f'(p.{pn}) {para[:a.width]}')
            if not out:
                continue
            chunk = '\n'.join(out)
            if key == 'framework':
                chunk = chunk[:min(len(chunk), 700)]
            if key == 'conclusion':
                chunk = chunk[-1400:]
            take = chunk[:max(600, budget)]
            budget -= len(take)
            print(f'## {key} ({len(out)} passages)\n{take}')
            if budget <= 0:
                print('## [cap reached]')
                break


QUOTE = re.compile(r'"([^"]*)"')
PAGE = re.compile(r'\(?p+\.\s*(\d+)(?:\s*(?:-|to|\u2013)\s*(\d+))?\)?')
TRANS = str.maketrans({'\u2018': "'", '\u2019': "'", '\u201c': '"', '\u201d': '"', '\u2013': '-', '\u2014': '-', '\u2011': '-', '\u2010': '-', '\u00a0': ' '})


def norm(s):
    """Normalise a string for quotation matching: straight quotes, plain hyphens, joined line-break hyphens, lower case."""
    s = collapse(s.translate(TRANS))
    s = re.sub(r'(\w)- (\w)', r'\1-\2', s)
    return s.lower()


def pieces(q):
    """Split a quotation on ellipses and bracketed insertions; return the verbatim pieces (12+ chars)."""
    q = q.replace('""', '"')
    parts = re.split(r'\s*(?:\.\.\.|\u2026)\s*|\[[^\]]*\]', q)
    return [p.strip() for p in parts if len(p.strip()) >= 12]


def cmd_check(a):
    with open(a.tsv, encoding='utf-8') as fh:
        rows = list(csv.DictReader(fh, delimiter='\t'))
    problems = 0
    checked = 0
    for r in rows:
        txtrel = r.get('source_file', '')
        if not txtrel.startswith('sources:'):
            print(f'?? {r["council"]} {r["ref"]}: source_file is not a sources: path')
            problems += 1
            continue
        text = read_text(os.path.join(SOURCES, txtrel[8:]))
        if not text:
            print(f'?? {r["council"]} {r["ref"]}: no text at {txtrel}')
            problems += 1
            continue
        pages = [norm(p) for p in pages_of(text)]
        flat = norm(text)
        for col in ('tier_note', 'tr3_note', 'annexb_note', 'dp33_note', 'template_weight', 'washed_over', 'green_belt', 'framework', 'outcome', 'annexb_cited', 'connectivity_tool'):
            note = r.get(col, '') or ''
            for m in QUOTE.finditer(note):
                q = m.group(1)
                if len(q) < 12:
                    continue
                checked += 1
                for piece in pieces(q):
                    qc = norm(piece)
                    if qc not in flat:
                        print(f'!! {r["council"]} {r["ref"]} [{col}] quotation not found: "{piece[:80]}"')
                        problems += 1
                        continue
                    after = note[m.end():m.end() + 40]
                    pm = PAGE.search(after)
                    if pm:
                        lo = int(pm.group(1))
                        hi = int(pm.group(2) or pm.group(1))
                        hit = any(qc in pages[p - 1] for p in range(lo, hi + 1) if 0 < p <= len(pages))
                        hit = hit or any(qc in (pages[p - 1] + ' ' + pages[p]) for p in range(lo, hi + 1) if 0 < p < len(pages))
                        if not hit:
                            print(f'!! {r["council"]} {r["ref"]} [{col}] "{piece[:50]}" not on p.{pm.group(0)}')
                            problems += 1
        if r.get('tr3') == 'not-mentioned':
            n = len(SIGNALS['tr3'].findall(text))
            if n and not re.search(r"Local Plan's", r.get('tr3_note', '')):
                print(f'!! {r["council"]} {r["ref"]}: tr3=not-mentioned but TR3 appears {n} times')
                problems += 1
        if r.get('connectivity_tool') == 'no' and SIGNALS['tool'].search(text):
            print(f'!! {r["council"]} {r["ref"]}: connectivity_tool=no but the text mentions it')
            problems += 1
        for code_col in ('tier', 'tr3', 'annexb', 'dp33'):
            if r.get(code_col) in ('error', 'partial', 'cited-only', 'dodged') and not any(len(q) >= 12 for q in QUOTE.findall(r.get(code_col + '_note', ''))):
                print(f'!! {r["council"]} {r["ref"]}: {code_col}={r[code_col]} without a quotation')
                problems += 1
    print(f'{len(rows)} rows, {checked} quotations checked, {problems} problems')
    return 1 if problems else 0


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    i = sub.add_parser('inventory'); i.add_argument('--out', default=os.path.join(ANALYSIS, 'other-councils-sweep-inventory-2026-10.tsv'))
    s = sub.add_parser('screen'); s.add_argument('--inventory', default=os.path.join(ANALYSIS, 'other-councils-sweep-inventory-2026-10.tsv')); s.add_argument('--out', required=True)
    e = sub.add_parser('excerpt'); e.add_argument('txt'); e.add_argument('--keys', default=''); e.add_argument('--max', type=int, default=25); e.add_argument('--width', type=int, default=700); e.add_argument('--head', type=int, default=1200)
    c = sub.add_parser('check'); c.add_argument('tsv')
    rd = sub.add_parser('read'); rd.add_argument('--inventory', default=os.path.join(ANALYSIS, 'other-councils-sweep-inventory-2026-10.tsv')); rd.add_argument('--refs', default=''); rd.add_argument('--start', type=int, default=None); rd.add_argument('--count', type=int, default=4); rd.add_argument('--cap', type=int, default=7000); rd.add_argument('--width', type=int, default=650); rd.add_argument('--head', type=int, default=900)
    a = ap.parse_args()
    rc = {'inventory': cmd_inventory, 'screen': cmd_screen, 'excerpt': cmd_excerpt, 'check': cmd_check, 'read': cmd_read}[a.cmd](a)
    sys.exit(rc or 0)


if __name__ == '__main__':
    main()
