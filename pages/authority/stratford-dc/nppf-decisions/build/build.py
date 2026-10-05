"""Build a standalone public HTML page from the exported doc Markdown (main.md + case*.md)."""
import html, json, re, glob, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from glossary import TERMS
from why import WHY

HERE = os.path.dirname(os.path.abspath(__file__))
TABS = json.load(open(os.path.join(HERE, 'newcases.json')))
SEC_IDS = {'3034': 's1', '5120': 's2', '7673': 's3', '9403': 's4', '12479': 's5', '14853': 's6', '16483': 's7', '18139': 's8'}
SEC_NAMES = {1: 'DP3(3) as a "should be refused" policy', 2: 'Heritage harm at Forest Farm', 3: 'The reason given for discounting CS.8', 4: 'Location shortcuts in the Green Belt',
             5: 'Walking routes and stations', 6: 'Reports written under the 2024 Framework'}
CHIPS = [('Inconsistent', 'bad'), ('Hard to reconcile', 'orange'), ('Reasoning gap', 'amber'), ('Differs in method', 'amber'), ('No inconsistency found', 'good')]

# --- case references -> anchors
cases = []
for i, t in enumerate(TABS):
    md_path = os.path.join(HERE, f'case{i:02d}.md')
    md = t['md']
    ref = t['cid'].split('-', 1)[1] if t['cid'].startswith('PINS-') else None
    lpa = re.search(r'\*\*\[?(\d{2}/\d{5}/[A-Z]+)', md)
    fname = f'case-{ref}.html' if ref else 'case-' + lpa.group(1).replace('/', '-') + '.html'
    cases.append({'i': i, 'name': t['name'], 'cid': t['cid'], 'md': md, 'anchor': f'case-{i:02d}', 'file': fname, 'ref': ref, 'lpa': lpa.group(1) if lpa else None,
                  'secs': [int(x) for x in re.findall(r'(\d)\. ', md.split('**Cited in:**', 1)[1].split('\n', 1)[0])] if '**Cited in:**' in md else []})
REF2A = {}
for c in cases:
    if c['ref']: REF2A[c['ref']] = c['file']
    if c['lpa']: REF2A[c['lpa']] = c['file']
PORTAL = 'https://appeal-planning-decision.service.gov.uk/comment-planning-appeal/appeals/'
MODE = {'main': True}


def inline(s, link_refs=True):
    s = html.escape(s, quote=False)
    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', lambda m: f'<a href="{fix_href(m.group(2))}"{ext(m.group(2))}>{m.group(1)}</a>', s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<em>\1</em>', s)
    if link_refs:
        # link bare case references not already inside a link
        def rep(m):
            a = REF2A.get(m.group(0))
            return f'<a class="ref" href="{a}">{m.group(0)}</a>' if a and MODE['main'] else m.group(0)
        parts = re.split(r'(<a [^>]*>.*?</a>)', s)
        s = ''.join(p if p.startswith('<a ') else re.sub(r'\b(?:\d{2}/\d{5}/[A-Z]{3}|60\d{5})\b', rep, p) for p in parts)
    return s


def fix_href(h):
    if MODE['main'] and h.startswith(PORTAL) and h[len(PORTAL):] in REF2A:
        return REF2A[h[len(PORTAL):]]
    m = re.match(r'#md8wsx8pw49\.(\d+)', h)
    return '#' + SEC_IDS.get(m.group(1), 'top') if m else h


def ext(h):
    if MODE['main'] and h.startswith(PORTAL) and h[len(PORTAL):] in REF2A:
        return ''
    return ' target="_blank" rel="noopener"' if h.startswith('http') else ''


def cell(c):
    for label, cls in CHIPS:
        if c.startswith(label):
            rest = c[len(label):].lstrip('. ').strip()
            return f'<td class="t-{cls}"><span class="chip c-{cls}">{html.escape(label)}</span> {inline(rest)}</td>'
    return f'<td>{inline(c)}</td>'


def md2html(md, heading_ids=None, shift=0):
    out, lines, i = [], md.split('\n'), 0
    hcount = {}
    while i < len(lines):
        l = lines[i]
        if not l.strip():
            i += 1; continue
        m = re.match(r'^(#{1,4})\s+(.*)', l)
        if m:
            lvl = min(len(m.group(1)) + shift, 6); text = m.group(2)
            hid = heading_ids(lvl, text) if heading_ids else None
            out.append(f'<h{lvl}{f" id={chr(34)}{hid}{chr(34)}" if hid else ""}>{inline(text, False)}</h{lvl}>'); i += 1; continue
        if l.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                rows.append([c.strip() for c in lines[i].strip().strip('|').split('|')]); i += 1
            head, body = rows[0], [r for r in rows[2:]]
            t = ['<div class="table"><table><thead><tr>' + ''.join(f'<th>{inline(h, False)}</th>' for h in head) + '</tr></thead><tbody>']
            for r in body: t.append('<tr>' + ''.join(cell(c) for c in r) + '</tr>')
            out.append(''.join(t) + '</tbody></table></div>'); continue
        if l.startswith('>'):
            q = []
            while i < len(lines) and lines[i].startswith('>'):
                q.append(lines[i][1:].strip()); i += 1
            paras = [p for p in '\n'.join(q).split('\n\n') if p.strip()]
            out.append('<blockquote>' + ''.join(f'<p>{inline(p.replace(chr(10), " "))}</p>' for p in paras) + '</blockquote>'); continue
        if re.match(r'^\s*[-*]\s+', l) or re.match(r'^\s*\d+\.\s+', l):
            items = []
            while i < len(lines) and (re.match(r'^\s*([-*]|\d+\.)\s+', lines[i]) or (lines[i].startswith('    ') and lines[i].strip())):
                items.append(lines[i]); i += 1
            out.append(render_list(items)); continue
        para = []
        while i < len(lines) and lines[i].strip() and not re.match(r'^(#|\||>|\s*[-*]\s|\s*\d+\.\s)', lines[i]):
            para.append(lines[i].strip()); i += 1
        out.append(f'<p>{inline(" ".join(para))}</p>')
    return '\n'.join(out)


def render_list(items):
    tag = 'ol' if re.match(r'^\s*\d+\.', items[0]) else 'ul'
    html_items, sub = [], []
    for it in items:
        if it.startswith('    ') or it.startswith('\t'):
            sub.append(it.strip()); continue
        if sub: html_items[-1] += render_list(sub); sub = []
        html_items.append(inline(re.sub(r'^\s*([-*]|\d+\.)\s+', '', it)))
    if sub: html_items[-1] += render_list(sub)
    return f'<{tag}>' + ''.join(f'<li>{x}</li>' for x in html_items) + f'</{tag}>'


# --- main document
main = open(os.path.join(HERE, 'note.md')).read()
main = re.sub(r'^Sep 28, 2026 · @\w+\s*$', '', main, flags=re.M)
main = main.replace('Every quotation has been checked against the source document.', 'Every quotation has been checked against the source document. Each cited decision has its own summary page, linked from the text and listed under [case summaries](#cases).')
sec_counter = iter(['s1', 's2', 's3', 's4', 's5', 's6'])


def main_ids(lvl, text):
    if lvl == 2 and re.match(r'\d\.', text): return next(sec_counter)
    if lvl == 2 and text == 'At a glance': return 'glance'
    if lvl == 2 and text == 'Sources': return 'sources'
    return None



# --- glossary pop-ups: first use of each term in each h2 section
GL = dict(TERMS)
GID = {t: 'g-' + re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-') for t, _ in TERMS}
TERM_RE = re.compile(r'(?<![\w.(])(' + '|'.join(re.escape(t) for t, _ in sorted(TERMS, key=lambda x: -len(x[0]))) + r')(?![\w(])')
SKIP = {'a', 'h1', 'h3', 'h4', 'blockquote', 'th', 'button', 'summary'}


def add_terms(h):
    out, stack, seen = [], [], set()
    for part in re.split(r'(<[^>]+>)', h):
        if part.startswith('<'):
            m = re.match(r'<(/?)(\w+)', part)
            if m:
                tag = m.group(2).lower()
                if tag == 'h2' and not m.group(1): seen = set()
                if m.group(1):
                    if tag in stack: stack = stack[:len(stack) - 1 - stack[::-1].index(tag)]
                elif tag in SKIP: stack.append(tag)
            out.append(part); continue
        if stack or not part.strip():
            out.append(part); continue
        def rep(m):
            t = m.group(1)
            if t in seen: return t
            seen.add(t)
            return f'<button type="button" class="term" aria-expanded="false" aria-controls="tip" data-term="{GID[t]}">{t}</button>'
        out.append(TERM_RE.sub(rep, part))
    return ''.join(out)


def glossary_html():
    rows = ''.join(f'<dt id="{GID[t]}">{html.escape(t)}</dt><dd>{html.escape(d)}</dd>' for t, d in sorted(TERMS, key=lambda x: x[0].lower()))
    return f'<h2 id="glossary">Glossary</h2><p>Plain-English summaries, not quotations. Read the Framework or the Core Strategy for the full wording.</p><dl class="glossary">{rows}</dl>'

body_main = add_terms(md2html(main, main_ids))

def colour_marks(hbody):
    hbody = hbody.replace('✓', '<span class="mk mk-ok"><span class="vh">Applied correctly: </span><span aria-hidden="true">✓</span></span>')
    hbody = hbody.replace('✗', '<span class="mk mk-no"><span class="vh">Applied incorrectly: </span><span aria-hidden="true">✗</span></span>')
    hbody = hbody.replace('<em>(incorrectly)</em>', '<span class="mk-no">(incorrectly)</span>')
    hbody = hbody.replace('<em>(correctly)</em>', '<span class="mk-ok">(correctly)</span>')
    return hbody


body_main = colour_marks(body_main)

# --- case summaries: one page per case, and an index on the main page
idx = []
for s in range(1, 7):
    links = ' · '.join(f'<a href="{c["file"]}">{html.escape(c["name"])}</a>' for c in cases if s in c['secs'])
    idx.append(f'<p><strong><a href="#s{s}">{s}. {SEC_NAMES[s]}</a>:</strong> {links}</p>')


def list_item(c):
    title = c['md'].split('\n', 1)[0][2:]
    line = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', c['md'].split('\n')[2]).replace('**', '')
    return (f'<li><a class="case-link" href="{c["file"]}"><span class="case-name">{html.escape(c["name"])}</span></a>'
            f'<span class="case-title">{html.escape(title)}</span><span class="case-line">{html.escape(line)}</span></li>')


group1 = '<ul class="case-list">' + ''.join(list_item(c) for c in cases if not c['cid'].startswith('PINS-')) + '</ul>'
group2 = '<ul class="case-list">' + ''.join(list_item(c) for c in cases if c['cid'].startswith('PINS-')) + '</ul>'

# case pages
tpl = open(os.path.join(HERE, 'template.html')).read()
STYLE = re.search(r'<style>.*?</style>', tpl, re.S).group(0)
FONTS = ''.join(re.findall(r'<link [^>]*>\n?', tpl))
MODE['main'] = False
for c in cases:
    md = c['md']
    md = re.sub(r'^\*\*Cited in:\*\* (.*)$', lambda m: '**Cited in:** ' + '; '.join(
        f'[{x.strip()}](index.html#s{x.strip()[0]})' for x in m.group(1).split(';')), md, flags=re.M)
    body = md2html(md)
    why = WHY.get(c['cid'])
    if why:
        callout = f'<div class="why"><strong>Why this is cited.</strong> {inline(why, False)}</div>'
        body = body.replace('<h2', callout + '<h2', 1) if '<h2' in body else body + callout
    title = c['md'].split('\n', 1)[0][2:]
    doc = ('<!doctype html>\n<html lang="en-GB">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
           f'<title>{html.escape(c["name"])}: case summary</title>\n{FONTS}{STYLE}\n'
           '<style>body{margin:0}.casepage{max-width:760px;margin:0 auto}.casepage h1{font:600 clamp(26px,4vw,36px)/1.2 var(--serif);margin:28px 0 12px}.why{background:var(--surface-2);border-left:4px solid var(--accent);border-radius:6px;padding:14px 16px;margin:20px 0}.why strong{color:var(--accent)}.back{display:inline-block;margin-top:24px;font-size:14px}</style>\n'
           '</head>\n<body>\n<div class="casepage">\n'
           '<a class="back" href="index.html#cases">← Stratford decisions under the 2026 NPPF</a>\n'
           f'<div class="eyebrow" style="margin-top:16px">Case summary</div>\n{body}\n'
           '<p class="note">Summarised for the note on Stratford decisions under the August 2026 NPPF. Not legal advice. <a href="index.html">Back to the note</a>.</p>\n'
           '</div>\n</body>\n</html>\n')
    open(os.path.join(HERE, c['file']), 'w').write(doc)
MODE['main'] = True
OLD = {c['anchor']: c['file'] for c in cases}

page = open(os.path.join(HERE, 'template.html')).read()
page = page.replace('%%OLDMAP%%', json.dumps(OLD)).replace('%%GJSON%%', json.dumps({GID[t]: [t, d] for t, d in TERMS})).replace('%%GLOSSARY%%', glossary_html()).replace('%%MAIN%%', body_main).replace('%%INDEX%%', '\n'.join(idx)).replace('%%SDC%%', group1).replace('%%APPEALS%%', group2)
open(os.path.join(HERE, 'index.html'), 'w').write(page)
print('cases', len(TABS), 'pages written')
print('bytes', len(page))
