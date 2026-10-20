import sys, re, html
rows=[]
for f in sys.argv[1:]:
    t=open(f,encoding='utf-8',errors='replace').read()
    for m in re.finditer(r'<li class="searchresult">(.*?)</li>', t, re.S):
        b=m.group(1)
        kv=re.search(r'keyVal=([A-Z0-9_]+)', b); kv=kv.group(1) if kv else ''
        desc=re.search(r"<div class=\"summaryLinkTextClamp\">(.*?)</div>", b, re.S); desc=html.unescape(re.sub(r'\s+',' ',desc.group(1))) if desc else ''
        addr=re.search(r'<p class="address">\s*(.*?)\s*</p>', b, re.S); addr=html.unescape(re.sub(r'\s+',' ',addr.group(1))) if addr else ''
        meta=re.search(r'<p class="metaInfo">\s*(.*?)\s*</p>', b, re.S); meta=html.unescape(re.sub(r'\s+',' ',meta.group(1))) if meta else ''
        ref=re.search(r'Ref\. No:\s*([^|<]+)', meta); ref=ref.group(1).strip() if ref else ''
        status=re.search(r'Status:\s*([^|<]+)', meta); status=status.group(1).strip() if status else ''
        rows.append((ref,kv,status,addr,desc))
seen=set()
for r in rows:
    if r[1] in seen: continue
    seen.add(r[1]); print('\t'.join(r))
