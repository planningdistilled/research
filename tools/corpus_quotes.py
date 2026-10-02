"""Extract and machine-check every quotation in the guidance corpus files.

For each corpus/<slug>.md, finds quoted strings (four words or more) in the Summary and in the
"Positions against our propositions" bullets, and checks each against the saved local text
(whitespace, quote marks, dashes and ligatures normalised). Writes quotes-check.json:
{slug: {"summary": [[quote, ok]], "positions": [{"prop", "stance", "quotes": [[quote, ok]]}]}}.
Run from the repo root: uv run tools/corpus_quotes.py (needs the private sources checkout)
"""
import glob, json, os, re, sys, unicodedata

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from paths import GUIDANCE, has_sources, resolve_ref, SOURCES  # noqa: E402
PROPS = ['SH1', 'SH2', 'TR', 'S5', 'SUP', 'GB', 'A2', 'DIV', 'METH']

def norm(s):
    s = unicodedata.normalize('NFKC', s)
    s = s.replace('­', '')
    for a, b in [('“', '"'), ('”', '"'), ('‘', "'"), ('’', "'"), ('–', '-'), ('—', '-'), ('…', '...'), (' ', ' ')]:
        s = s.replace(a, b)
    s = re.sub(r'-\s*\n\s*', '-', s)
    return re.sub(r'\s+', ' ', s).strip().lower()

QUOTE = re.compile(r'"([^"\n]*?)"|“([^”\n]*?)”')

def quotes(text):
    out = []
    for m in QUOTE.finditer(text):
        q = (m.group(1) or m.group(2)).strip()
        if len(q.split()) >= 4: out.append(q)
    return out

def found(q, hay):
    nq = norm(q)
    if nq in hay: return True
    parts = [p.strip(' .,;:') for p in re.split(r'\s*(?:\.\.\.|\[[^\]]*\])\s*', nq) if len(p.strip(' .,;:').split()) >= 3]
    return bool(parts) and all(p in hay for p in parts)

def frontmatter(lines):
    end = lines.index('---', 1); fm = {}
    for l in lines[1:end]:
        if ':' in l: k, v = l.split(':', 1); fm[k.strip()] = v.strip().strip('"\'')
    return fm, end

if not has_sources():
    sys.exit(f'private sources not found at {SOURCES} (set PD_SOURCES); quotes from non-OGL publishers cannot be checked without them')

res = {}
for p in sorted(glob.glob(os.path.join(GUIDANCE, 'corpus/*.md'))):
    slug = os.path.basename(p)[:-3]
    lines = open(p).read().split('\n'); fm, end = frontmatter(lines); body = '\n'.join(lines[end + 1:])
    txt = fm.get('local_text') or (fm.get('local_copy') if fm.get('local_copy', '').endswith('.txt') else '')
    hay = norm(open(resolve_ref(txt), errors='ignore').read()) if txt and os.path.isfile(resolve_ref(txt)) else ''
    if not hay and fm.get('local_copy', '').endswith(('.html', '.htm')) and os.path.isfile(resolve_ref(fm['local_copy'])):
        hay = norm(re.sub(r'<[^>]+>', ' ', open(resolve_ref(fm['local_copy']), errors='ignore').read()))
    summ = re.search(r'## Summary\n(.*?)\n## ', body, re.S)
    pos = re.search(r'## Positions[^\n]*\n(.*?)(\n## |\Z)', body, re.S)
    r = {'has_text': bool(hay), 'summary': [[q, found(q, hay)] for q in quotes(summ.group(1) if summ else '')], 'positions': []}
    for b in re.split(r'\n(?=- )', pos.group(1).strip() if pos else ''):
        m = re.match(r'-\s*\**\s*(SH1|SH2|TR|S5|SUP|GB|A2|DIV|METH)\b[^a-zA-Z]*\(?\s*(agrees|qualifies|disagrees)', b)
        if not m: continue
        r['positions'].append({'prop': m.group(1), 'stance': m.group(2), 'quotes': [[q, found(q, hay)] for q in quotes(b)]})
    res[slug] = r
json.dump(res, open(os.path.join(GUIDANCE, 'quotes-check.json'), 'w'), indent=1, ensure_ascii=False)
allq = [q for r in res.values() for q in r['summary'] + [x for p in r['positions'] for x in p['quotes']]]
print(f"sources {len(res)}; with local text {sum(r['has_text'] for r in res.values())}; quotes {len(allq)}; verified {sum(ok for _, ok in allq)}")
print('positions parsed', sum(len(r['positions']) for r in res.values()))
print('summaries with an unverified quote', sum(any(not ok for _, ok in r['summary']) for r in res.values()))
