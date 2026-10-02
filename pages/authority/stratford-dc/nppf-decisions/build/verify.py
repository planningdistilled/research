"""Verify quotations against source texts and report page/paragraph.

Usage: python3 verify.py quotes.json
quotes.json: [{"id": "...", "src": "<key>", "q": "quoted text (… allowed)", "loc": "claimed page/para or null"}]
Source keys:
  sdc:<basename>   -> <sources>/stratford-dc/public-note/<basename>.txt (pdftotext with \f pages, or OCR with === PAGE n === markers)
  pins:<ref>       -> data/open-sources/pins-corpus/<ref>.txt (paragraph numbers found by nearest preceding 'N.' line)
  nppf             -> data/open-sources/nppf/NPPF-August-2026.txt
  cs               -> <sources>/stratford-dc/public-note/cs.txt (Core Strategy)
(paths from _paths.py)
"""
import json, re, sys, os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _paths import PINS, src as src_path  # noqa: E402


def norm(s):
    s = s.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"').replace('–', '-').replace('—', '-')
    s = s.replace(' ', ' ')
    s = re.sub(r'(\w)-\s*\n\s*(\w)', r'\1\2', s)  # hyphenated line breaks
    return re.sub(r'\s+', ' ', s).strip().lower()


def load(src):
    kind, _, name = src.partition(':')
    if kind == 'sdc':
        path = src_path(name + '.txt')
    elif kind == 'pins':
        path = os.path.join(PINS, name + '.txt')
    elif kind == 'nppf':
        path = src_path('nppf.txt')
    elif kind == 'cs':
        path = src_path('cs.txt')
    else:
        raise ValueError(src)
    return open(path, errors='ignore').read()


def pages(raw):
    """list of (page_no, text)."""
    if '=== PAGE ' in raw:
        parts = re.split(r'=== PAGE (\d+) ===', raw)
        return [(int(parts[i]), parts[i + 1]) for i in range(1, len(parts), 2)]
    return [(i + 1, p) for i, p in enumerate(raw.split('\f'))]


def find(raw, q, kind):
    segs = [norm(s) for s in re.split(r'\s*(?:…|\.\.\.)\s*', q) if s.strip()]
    full = norm(raw)
    pos = 0
    first = None
    for s in segs:
        # strip leading/trailing brackets like [its]
        s2 = re.sub(r'\[[^\]]*\]', '', s).strip()
        at = full.find(s2, pos)
        if at < 0:
            # try longest prefix for diagnostics
            lo, hi = 0, len(s2)
            while lo < hi:
                mid = (lo + hi + 1) // 2
                if full.find(s2[:mid], pos) >= 0: lo = mid
                else: hi = mid - 1
            return None, f'segment not found; matched up to: "{s2[:lo][-50:]}" | expected next: "{s2[lo:lo+50]}"'
        if first is None: first = at
        pos = at + len(s2)
    return first, None


def locate(raw, q, kind):
    if kind == 'pins':
        # paragraph number: find quote position in raw lines, then nearest preceding numbered paragraph
        lines = raw.split('\n')
        seg = norm(re.split(r'\s*(?:…|\.\.\.)\s*', q)[0])[:60]
        acc = ''
        idx = []
        for i, l in enumerate(lines):
            idx.append(len(acc)); acc += ' ' + l
        fulln = norm(acc)
        # approximate: search normalised seg within progressively
        para = None
        buf = ''
        for i, l in enumerate(lines):
            m = re.match(r'^\s{0,8}(\d{1,3})\.\s+\S', l)
            if m: para = int(m.group(1))
            buf += ' ' + l
            if seg in norm(buf):
                return f'¶{para}'
        return '?'
    if kind == 'cs':
        # Core Strategy paragraph number: nearest preceding 'N.N.N' line
        seg = norm(re.split(r'\s*(?:…|\.\.\.)\s*', q)[0])[:60]
        para = None
        buf = ''
        for l in raw.split('\n'):
            m = re.match(r'^\s{0,8}(\d+\.\d+\.\d+)\s+\S', l)
            if m: para, buf = m.group(1), ''
            buf += ' ' + l
            if seg in norm(buf):
                return f'¶{para}'
        return '?'
    for p, text in pages(raw):
        if norm(re.split(r'\s*(?:…|\.\.\.)\s*', q)[0])[:60] in norm(text):
            return f'p.{p}'
    return 'p.? (spans pages)'


def main():
    items = json.load(open(sys.argv[1]))
    bad = 0
    for it in items:
        kind = it['src'].split(':')[0]
        raw = load(it['src'])
        at, err = find(raw, it['q'], kind)
        if at is None:
            bad += 1
            print(f"✗ {it['id']} [{it['src']}] {err}")
            continue
        loc = locate(raw, it['q'], kind) if kind in ('sdc', 'pins', 'cs') else ''
        flag = '' if not it.get('loc') or it['loc'] == loc else f'   ← claimed {it["loc"]}'
        if flag: bad += 1
        print(f"✓ {it['id']} {loc}{flag}")
    print(f'\n{len(items) - bad}/{len(items)} ok')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
