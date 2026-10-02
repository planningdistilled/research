"""Check every cited page (p.N) or paragraph (¶N, ¶N.N.N) in a Markdown file against the source.

Usage: python3 loccheck.py note.md
Each quotation followed by a location is matched to its verified entry in quotes.json. Where
the same wording is quoted from more than one source, the entry whose application or appeal
reference appears on the same line is used. A quotation joined with … that spans more than one
entry is checked segment by segment.
"""
import re, json, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from verify import norm, load, locate

Q = json.load(open(os.path.join(HERE, 'quotes.json')))
md = open(sys.argv[1]).read()


def src_ref(src):
    """reference as written in the note: sdc:stratford-26-01906-PIP-report -> 26/01906/PIP, pins:6008785 -> 6008785"""
    kind, _, name = src.partition(':')
    m = re.match(r'stratford-(\d\d)-(\d{5})-([A-Z]+)', name)
    if m: return '/'.join(m.groups())
    return name if kind == 'pins' else None


def pick(cands, line):
    on_line = [x for x in cands if src_ref(x['src']) and src_ref(x['src']) in line]
    return (on_line or cands)[0]


def loc_of(x, seg):
    kind = x['src'].split(':')[0]
    return locate(load(x['src']), seg, kind)


bad = n = 0
for l in md.split('\n'):
    for m in re.finditer(r'"([^"\n]+)"[^"\n]{0,25}?\((p\.\d+|¶\d+(?:\.\d+)*)', l):
        frag, ref = m.group(1), m.group(2)
        segs = [norm(s) for s in re.split(r'\s*…\s*', frag) if len(s.strip()) > 3]
        cands = [x for x in Q if all(s in norm(x['q']) for s in segs)]
        if cands:
            locs = {loc_of(pick(cands, l), segs[0])}
        else:
            # joined quotation: each segment must have its own entry, all at the cited location
            per = [[x for x in Q if s in norm(x['q'])] for s in segs]
            if not all(per):
                print('? no verified-quote entry for:', frag[:70], ref); bad += 1; continue
            locs = {loc_of(pick(c, l), s) for c, s in zip(per, segs)}
        n += 1
        if locs != {ref}:
            bad += 1; print(f'✗ {ref} but source says {"/".join(sorted(locs))}: {frag[:70]}')
print(f'{n} located quotes checked, {bad} problems')
