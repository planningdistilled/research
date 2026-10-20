import sys, re, html
# usage: parse.py file1.html ... -> TSV ref, address, proposal, status
rows = {}
for f in sys.argv[1:]:
    t = open(f, encoding='utf-8', errors='replace').read()
    for m in re.finditer(r'<tr[^>]*>(.*?)</tr>', t, re.S):
        cells = re.findall(r'<td[^>]*>(.*?)</td>', m.group(1), re.S)
        if len(cells) < 4: continue
        cells = [re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', c))).strip() for c in cells]
        ref = cells[0]
        if re.match(r'^(W|M)?/?\d{2}/\d{5}/', ref) or re.match(r'^\d{2}/\d{5}/', ref):
            rows[ref] = cells[:4]
for r in rows.values():
    print('\t'.join(r))
