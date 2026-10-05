"""Add search metadata (title, description, canonical, Open Graph) to the <head> of the exported pages. Idempotent.

Usage: python3 seo.py <root containing station-road-on-foot/ and stratford-nppf-decisions/>
"""
import html, os, re, sys

# Where each exported folder lives on GitHub Pages.
BASES = {
    'stratford-nppf-decisions': 'https://planningdistilled.org/research/authority/stratford-dc/nppf-2026-decisions/',
    'station-road-on-foot': 'https://planningdistilled.org/research/settlement/claverdon/station-road-on-foot/',
}
PAGES = {
    'stratford-nppf-decisions/index.html': (
        'Stratford planning decisions under the 2026 NPPF: how consistent are they?',
        "How Stratford-on-Avon District Council's planning decisions since the August 2026 NPPF compare with each other and with Planning Inspectorate appeal decisions: DP3(3), heritage harm, Core Strategy CS.8, Green Belt villages and walking routes. Verified quotations and case summaries."),
    'station-road-on-foot/index.html': (
        'Station Road on Foot: Claverdon footway survey for 26/01470/FUL',
        'Route survey of Station Road, Claverdon, for planning application 26/01470/FUL: measured footway widths, video of the walk to Claverdon station, the Connectivity Tool score, and appeal decisions on sustainable location under the August 2026 NPPF.'),
}


def page_meta(rel, text):
    if rel in PAGES:
        return PAGES[rel]
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', text, re.S)
    name = re.sub('<[^>]+>', '', h1.group(1)).strip() if h1 else 'Appeal'
    if rel.startswith('stratford-nppf-decisions/'):
        ref = re.search(r'case-([\w-]+)\.html', rel).group(1)
        kind = f'appeal {ref}' if ref.isdigit() else 'Stratford-on-Avon decision ' + ref.replace('-', '/', 2)
        return (f'{name}: {kind}, case summary',
                f'Summary of {kind} ({name}) under the August 2026 NPPF, with verified quotations and paragraph or page references, cited in the note on Stratford planning decisions.')
    ref = re.search(r'case-(\d+)\.html', rel).group(1)
    return (f'{name}: appeal {ref} on sustainable location',
            f'Summary of appeal decision {ref} ({name}) under the August 2026 NPPF: what the inspector found about the walking route and sustainable location, with paragraph references, read against Station Road, Claverdon.')


LICENCE = ('<div class="licence" style="max-width:820px;margin:28px auto 0;padding:0 16px 24px;font:13px/1.55 -apple-system,\'Segoe UI\',system-ui,sans-serif;color:#59635d">'
           '&copy; Planning Distilled. Text, data and images on this page are released under the <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 licence</a>: share and adapt them freely, with credit to Planning Distilled. Quotations from decision letters, plans and the Framework remain the copyright of their publishers. Source and data: <a href="https://github.com/planningdistilled/research">github.com/planningdistilled/research</a>.</div>')


# Breadcrumb trails, so every exported page says where it sits on the site.
CRUMBS = {
    'station-road-on-foot': [('Planning Distilled', '/'), ('Research', '/research/'), ('Settlements', '/research/settlement/'),
                             ('Claverdon', '/research/settlement/claverdon/'), ('Station Road on Foot', '/research/settlement/claverdon/station-road-on-foot/')],
    'stratford-nppf-decisions': [('Planning Distilled', '/'), ('Research', '/research/'), ('Local planning authorities', '/research/authority/'),
                                 ('Stratford-on-Avon', '/research/authority/stratford-dc/'), ('Decisions under the 2026 NPPF', '/research/authority/stratford-dc/nppf-2026-decisions/')],
}


def crumbs(folder, page, text):
    trail = CRUMBS[folder]
    if page == 'index.html':
        links, current = trail[:-1], trail[-1][0]
    else:
        h1 = re.search(r'<h1[^>]*>(.*?)</h1>', text, re.S)
        links, current = trail, (re.sub('<[^>]+>', '', h1.group(1)).strip() if h1 else page)
    parts = [f'<a href="{href}" style="color:inherit">{html.escape(name)}</a>' for name, href in links] + [html.escape(current)]
    return ('<!-- crumbs --><nav aria-label="Breadcrumb" style="max-width:820px;margin:0 auto;padding:12px 16px 0;'
            "font:12.5px/1.5 -apple-system,'Segoe UI',system-ui,sans-serif;opacity:.75\">" + ' › '.join(parts) + '</nav><!-- /crumbs -->')


def add_crumbs(folder, page, text):
    text = re.sub(r'\n?<!-- crumbs -->.*?<!-- /crumbs -->\n?', '', text, flags=re.S)
    body = re.search(r'<body[^>]*>\s*(<a class="skip"[^>]*>.*?</a>\s*)?', text, re.S)
    if body:
        at = body.end()
    else:
        # Fragments with no <body>: put the trail after the last style block before the page heading.
        h1 = text.find('<h1')
        if h1 < 0:
            return text
        last = text.rfind('</style>', 0, h1)
        at = last + len('</style>') if last >= 0 else h1
    return text[:at] + '\n' + crumbs(folder, page, text) + '\n' + text[at:]


PLANS = [
    (r'\b(?:Stratford-on-Avon (?:District )?)?Core Strategy\b', 'https://www.stratford.gov.uk/planning-building/core-strategy.cfm'),
    (r'\b(?:Claverdon )?Neighbourhood Plan\b', 'https://claverdon-pc.gov.uk/wp-content/uploads/2024/09/Claverdon-Neighbourhood-Plan.pdf'),
]


def link_plans(text, plans):
    """Link the first plain mention of each plan (outside tags, links, quotations, scripts and styles) to the document."""
    start = max(text.find('<body'), 0)
    for pattern, url in plans:
        if url in text:
            continue
        spans = [m.span() for r in (r'<a\b.*?</a>', r'<blockquote\b.*?</blockquote>', r'<script\b.*?</script>', r'<style\b.*?</style>', r'<title>.*?</title>', r'<[^>]+>')
                 for m in re.finditer(r, text, re.S)]
        for m in re.finditer(pattern, text[start:]):
            i, j = m.start() + start, m.end() + start
            if not any(a < j and i < b for a, b in spans):
                text = text[:i] + f'<a href="{url}">{m.group(0)}</a>' + text[j:]
                break
    return text


def apply(root):
    extra = [f'{d}/{f}' for d in ('station-road-on-foot', 'stratford-nppf-decisions') for f in sorted(os.listdir(os.path.join(root, d))) if f.startswith('case-')]
    for rel in list(PAGES) + extra:
        path = os.path.join(root, rel)
        text = open(path, encoding='utf-8').read()
        text = re.sub(r'<!-- seo -->.*?<!-- /seo -->\n?', '', text, flags=re.S)
        title, desc = page_meta(rel, text)
        folder, _, page = rel.partition('/')
        url = BASES[folder] + page.replace('index.html', '')
        block = ('<!-- seo -->\n'
                 f'<meta name="description" content="{html.escape(desc)}">\n'
                 f'<link rel="canonical" href="{url}">\n'
                 f'<meta property="og:type" content="article">\n<meta property="og:title" content="{html.escape(title)}">\n'
                 f'<meta property="og:description" content="{html.escape(desc)}">\n<meta property="og:url" content="{url}">\n'
                 '<link rel="license" href="https://creativecommons.org/licenses/by/4.0/">\n'
                 '<!-- /seo -->\n')
        # The exports are artifact copies: some are bare fragments (no doctype, charset or viewport), and
        # one carries its <title> in <body>, behind the artifact skeleton's own <head>. Search engines only
        # read the title, description and canonical link from <head>, so make each file a full document
        # and put the block straight after the charset declaration.
        if not text.lstrip().lower().startswith('<!doctype'):
            text = ('<!doctype html>\n<html lang="en-GB">\n<head>\n<meta charset="utf-8">\n'
                    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' + text.lstrip())
        text = re.sub(r'<title>[^<]*</title>\n?', '', text, count=1)
        charset = re.search(r'<meta charset[^>]*>\n?', text)
        if not charset:
            raise SystemExit(f'{rel}: no <meta charset> to anchor the metadata on')
        text = text[:charset.end()] + ('' if charset.group(0).endswith('\n') else '\n') + block + f'<title>{html.escape(title)}</title>\n' + text[charset.end():]
        if 'class="licence"' not in text:
            text = text.replace('</body>', LICENCE + '\n</body>', 1) if '</body>' in text else text.rstrip('\n') + '\n' + LICENCE + '\n'
        text = add_crumbs(folder, page, text)
        text = link_plans(text, PLANS[:1] if folder == 'stratford-nppf-decisions' else PLANS)
        open(path, 'w', encoding='utf-8').write(text)
        print('ok', rel)


if __name__ == '__main__':
    apply(sys.argv[1])
