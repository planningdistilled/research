import sys, re, html
for f in sys.argv[1:]:
    t = open(f, encoding='utf-8', errors='replace').read()
    t = html.unescape(re.sub(r'<[^>]+>', ' ', t)).replace('\xa0', ' ')
    t = re.sub(r'\s+', ' ', t)
    def g(p):
        m = re.search(p, t); return m.group(1).strip() if m else ''
    print('\t'.join([f.split('/')[-2],
        g(r'Decision ([A-Za-z ]+?) Decision Date'), g(r'Decision Date (\d\d/\d\d/\d{4})'),
        g(r'Expected Decision Level ([A-Za-z]+)'), g(r'Committee Date \(if applicable\) (\d\d/\d\d/\d{4})'),
        g(r'Parish ([A-Za-z &\'-]+?) Ward'), g(r'Ward ([A-Za-z &\'-]+?) (?:Case|Applicant|Agent|Important|Further|Summary)'),
        g(r'Case Officer ([A-Za-z \'-]+?) Parish')]))
