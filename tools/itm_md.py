# /// script
# requires-python = ">=3.11"
# dependencies = ["pymupdf>=1.24"]
# ///
"""The Planning Inspectorate's Inspector Training Manual (ITM), 17 September 2026 edition, and PINS Note
04/2026 (the NPPF 2026 briefing): Markdown editions, a chapter index, NPPF chunk files and a glossary that
maps each recurring NPPF term or phrase to where it occurs in the Framework and in the manual.

Reads the four consolidated PDFs and the note from the private sources checkout (`sources:pins/`) and writes
to `data/open-sources/pins-training-manual/` (and `data/open-sources/nppf/chunks/`). Every output file says
which PDF and page it came from.

    uv run tools/itm_md.py build        manual-full.md, chapters/, pins-note-04-2026.md, INDEX.md, structure.json, README.md
    uv run tools/itm_md.py nppf-chunks  data/open-sources/nppf/chunks/: one file per NPPF chapter, policy and annex
    uv run tools/itm_md.py mine         print recurring NPPF phrases, candidates for glossary/terms.txt
    uv run tools/itm_md.py glossary     glossary/GLOSSARY.md and glossary/terms/*.md from glossary/terms.txt
    uv run tools/itm_md.py all          build, nppf-chunks, glossary

Text comes from the PDFs' own text layer via PyMuPDF. The diagonal "Valid only on 17 September 2026" watermark
is a rotated text line on every page and is dropped by direction; running footers ("Version N | Inspector
Training Manual | Chapter | Page x of y") are dropped by position and pattern. Body text is otherwise
verbatim, with wrapped lines rejoined. `<!-- PartN p.M -->` marks the start of PDF page M of Part N.
"""
import argparse
import collections
import difflib
import json
import os
import re
import sys
from typing import NamedTuple

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from paths import OPEN, SOURCES  # noqa: E402

EDITION = '17 September 2026'
SRC_DIR = os.path.join(SOURCES, 'pins')
PART_FILES = {p: f'Consolidated Inspector Training Manual 17 September 2026_Part{p}.pdf' for p in (1, 2, 3, 4)}
NOTE_FILE = 'PN 04.2026 NPPF 2026.pdf'
OUT = os.path.join(OPEN, 'pins-training-manual')
NPPF_DIR = os.path.join(OPEN, 'nppf')
NPPF_MD = os.path.join(NPPF_DIR, 'NPPF-August-2026.md')
NPPF_STRUCTURE = os.path.join(NPPF_DIR, 'NPPF-August-2026.structure.json')
NPPF_CHUNKS = os.path.join(NPPF_DIR, 'chunks')
NPPF_PDF_OFFSET = 2  # printed page N of the Framework is PDF page N + 2

# Every chapter of the consolidated PDF: number, title, [(part, first page, last page)], note. Numbers follow the
# PDF bookmarks (00-54, 37a-37i); the Index page lists the chapters in the same order. Gaps: 20 (the procedural
# "Enforcement" chapter is not in the consolidated PDF; its slot holds a second copy of 21) and 37f.
CHAPTERS = [
    ('000', 'Index and how to use the manual', [(1, 1, 5)], ''),
    ('00', 'Role of the Inspector', [(1, 6, 23)], ''),
    ('01', 'Approach to Decision Making', [(1, 24, 119)], ''),
    ('02', 'Site Visits', [(1, 120, 138)], ''),
    ('03', 'Hearings', [(1, 139, 183)], ''),
    ('04', 'Inquiries', [(1, 184, 269)], ''),
    ('05', 'Written Representations Part 1', [(1, 270, 282)], ''),
    ('06', 'Complaints and How to Avoid Them', [(1, 283, 291)], ''),
    ('07', 'High Court Challenges', [(1, 292, 301)], ''),
    ('08', 'Advertisement Appeals', [(1, 302, 330)], ''),
    ('09', 'Air Quality', [(1, 331, 388)], ''),
    ('10', 'Appeals against Conditions', [(1, 389, 438)], ''),
    ('11', 'Character and Appearance', [(1, 439, 443)], ''),
    ('12', 'Common Land and Town and Village Greens', [(1, 444, 486)], ''),
    ('13', 'Community Infrastructure Levy (CIL): Examination of a Charging Schedule', [(1, 487, 531)], ''),
    ('14', 'Compulsory Purchase and other Orders', [(1, 532, 571)], ''),
    ('15', 'Conditions', [(1, 572, 627)], ''),
    ('16', 'Costs Awards', [(1, 628, 658)], ''),
    ('17', 'Design', [(1, 659, 675)], ''),
    ('18', 'Environmental Impact Assessment', [(1, 676, 702)], ''),
    ('19', 'Environmental Permitting', [(1, 703, 758)], ''),
    ('21', 'Enforcement Case Law', [(1, 759, 911)],
     'Part 1 pages 912-1064 are a byte-identical second copy of this chapter and are not extracted. '
     'The procedural "Enforcement" chapter listed on the Index page (chapter 20) is not in the consolidated PDF.'),
    ('22', 'Flood Risk', [(1, 1065, 1093)], ''),
    ('23', 'GPDO and Prior Approval Appeals', [(1, 1094, 1104), (2, 1, 80)], 'Spans the end of Part 1 and the start of Part 2.'),
    ('24', 'Green Belts', [(2, 81, 109)], ''),
    ('25', 'Gypsy, Traveller and Travelling Showpeople Casework', [(2, 110, 194)], ''),
    ('26', 'Hedgerow Casework', [(2, 195, 211)], ''),
    ('27', 'High Hedge Casework', [(2, 212, 240)], ''),
    ('28', 'Highways and Transport (Appeals Casework)', [(2, 241, 254)], ''),
    ('29', 'Historic Environment', [(2, 255, 326)], ''),
    ('30', 'Householder, Advertisement and Minor Commercial Appeals', [(2, 327, 337)], ''),
    ('31', 'Housing', [(2, 338, 414)], ''),
    ('32', 'Housing Compulsory Purchase Orders', [(2, 415, 444)], ''),
    ('33', 'Human Rights and Equality', [(2, 445, 515)], ''),
    ('34', 'Landscape and Visual Impact Assessment', [(2, 516, 543)], ''),
    ('35', 'Listed Building Enforcement', [(2, 544, 576)], ''),
    ('36', 'Local Plan Examinations (plans submitted before 25 January 2019)', [(2, 577, 815)],
     'No longer updated; written for the 2012 Framework.'),
    ('37a', 'Local Plan Examinations (NPPF 2024): Introduction', [(2, 816, 818)], ''),
    ('37b', 'Local Plan Examinations (NPPF 2024): Plan Preparation', [(2, 819, 832)], ''),
    ('37c', 'Local Plan Examinations (NPPF 2024): Role of the Inspector in Examination', [(2, 833, 915)], ''),
    ('37d', 'Local Plan Examinations (NPPF 2024): Sustainability Appraisal, Habitats Regulations Assessment, '
            'Climate Change, Air Quality and Flood Risk', [(2, 916, 937), (3, 1, 6)], 'Spans the end of Part 2 and the start of Part 3.'),
    ('37e', 'Local Plan Examinations (NPPF 2024): Public Sector Equality Duty', [(3, 7, 13)], ''),
    ('37g', 'Local Plan Examinations (NPPF 2024): Housing', [(3, 14, 80)], ''),
    ('37h', 'Local Plan Examinations (NPPF 2024): Economic Development', [(3, 81, 94)], ''),
    ('37i', 'Local Plan Examinations (NPPF 2024): Retail and Main Town Centre Uses', [(3, 95, 103)], ''),
    ('38', 'Major Hazard Installations', [(3, 104, 314)], ''),
    ('39', 'Minerals', [(3, 315, 345)], ''),
    ('40', 'Mobile Telecommunications', [(3, 346, 360)], ''),
    ('41', 'Natural Environment', [(3, 361, 516)], ''),
    ('42', 'Necessary Wayleaves', [(3, 517, 536)], ''),
    ('43', 'Noise', [(3, 537, 599)], ''),
    ('44', 'Permission in Principle', [(3, 600, 613)], ''),
    ('45', 'Planning Obligations', [(3, 614, 656)], ''),
    ('46', 'Public Rights of Way', [(3, 657, 832)], ''),
    ('47', 'Purchase Notices', [(3, 833, 847)], ''),
    ('48', 'Retail and Town Centre Developments', [(3, 848, 858)], ''),
    ('49', 'Rural Issues', [(3, 859, 866)], ''),
    ('50', 'Secretary of State Casework', [(3, 867, 887)], ''),
    ('51', 'Transport Orders', [(3, 888, 897), (4, 1, 72)], 'Spans the end of Part 3 and the start of Part 4.'),
    ('52', 'Tree Casework', [(4, 73, 103)], ''),
    ('53', 'Unconventional Hydrocarbons', [(4, 104, 118)], ''),
    ('54', 'Waste Planning', [(4, 119, 166)], ''),
]

FOOTER_RE = re.compile(r'Inspector Training Manual\s*[|\-–]|^ITM\s*\||^Version\s+\d+\s*$|^Page\s+\d+(\s+of\s+\d+)?\s*$|^\d{1,4}\s*$', re.I)
HEADER_RE = re.compile(r'Inspector Training Manual\s*\|')
LIST_RE = re.compile(r'^(\d{1,3}\.|\(\d{1,3}\)|\(?[a-z]\)|\(?[ivxl]{1,5}\)|[ivxl]{1,5}\.|[•●▪■◦○\-–]|[A-Z]\.)(\s|$)')
BULLET_RE = re.compile(r'^[•●▪■◦○]\s*')
FOOTNOTE_RE = re.compile(r'^\d{1,3} \S')
CONTENTS_RE = re.compile(r'\.{4,}\s*\d*\s*$')
ANNEX_RE = re.compile(r'^(annex|appendix)\b', re.I)
VERSION_RE = re.compile(r'\bVersion\s+(\d+)\b')
EDITION_RE = re.compile(r'(not yet )?updated to reflect (the )?(.*?)\s*$', re.I)
CHANGES_RE = re.compile(r'^(changes highlighted in yellow|new in this version|new this version|what.s new)', re.I)
MAX_FILE_WORDS = 7000  # a section larger than this is split again on its own sub-headings


class Line(NamedTuple):
    y0: float
    y1: float
    x0: float
    x1: float
    text: str
    size: float
    bold: bool
    base: float  # baseline: what fragments of one printed line share, whatever their font


class Block(NamedTuple):
    kind: str   # title | h2 | h3 | p | bullet | fn
    text: str
    part: int
    page: int


# ---------------------------------------------------------------------------------------------------------------
# PDF -> blocks


def page_lines(page):
    """Upright text lines of a page in reading order, less the watermark, running header and footer.
    Returns (lines, meta) where meta has the footer's version number if seen."""
    h = page.rect.height
    out, meta = [], {}
    for b in page.get_text('dict')['blocks']:
        if b.get('type') != 0:
            continue
        for ln in b['lines']:
            if abs(ln['dir'][1]) > 0.01:
                continue  # the rotated "Valid only on ..." watermark
            spans = [s for s in ln['spans'] if s['text'].strip()]
            if not spans:
                continue
            text = re.sub(r'\s+', ' ', ''.join(s['text'] for s in ln['spans'])).strip()
            x0, y0, x1, y1 = ln['bbox']
            m = VERSION_RE.search(text)
            if m and y0 > h * 0.85:
                meta.setdefault('version', m.group(1))
            if HEADER_RE.search(text) or (y0 > h * 0.85 and FOOTER_RE.search(text)):
                continue
            size = max(s['size'] for s in spans)
            bold = all(('bold' in s['font'].lower()) or (s['flags'] & 16) for s in spans)
            out.append(Line(y0, y1, x0, x1, text, size, bold, spans[0]['origin'][1]))
    out.sort(key=lambda ln: (ln.base, ln.x0))
    return out, meta


def is_marker(text):
    return bool(LIST_RE.fullmatch(text) or (LIST_RE.match(text) and len(text) <= 5))


def merge_rows(lines):
    """Join fragments that share a baseline (a paragraph number or bullet with its text, table cells with ' | ')."""
    groups = []
    for ln in lines:  # sorted by baseline
        if groups and abs(ln.base - groups[-1][0].base) <= 2.0:
            groups[-1].append(ln)
        else:
            groups.append([ln])
    rows = []
    for g in groups:
        g.sort(key=lambda ln: ln.x0)
        row = g[0]
        for ln in g[1:]:
            gap = ln.x0 - row.x1
            marker = is_marker(row.text)
            sep = ' ' if marker or gap <= 25 else ' | '
            row = row._replace(text=row.text + sep + ln.text, x1=max(row.x1, ln.x1), y0=min(row.y0, ln.y0), y1=max(row.y1, ln.y1),
                               x0=row.x0, bold=ln.bold if marker else (row.bold and ln.bold), size=ln.size if marker else max(row.size, ln.size))
        rows.append(row)
    return rows


def paragraphs(rows):
    paras, cur, last = [], None, None
    for r in rows:
        new = cur is None
        if not new:
            dy = r.base - last.base
            if dy > 1.7 * max(r.size, last.size):
                new = True
            elif LIST_RE.match(r.text):
                new = True
            elif r.bold != last.bold or abs(r.size - last.size) > 1.0:
                new = True
            elif r.x0 < last.x0 - 12:
                new = True
            elif r.size <= 9.5 and FOOTNOTE_RE.match(r.text):
                new = True  # one footnote definition per paragraph
            elif CONTENTS_RE.search(r.text) or CONTENTS_RE.search(last.text):
                new = True  # one contents entry per paragraph
        if new:
            cur = [r]
            paras.append(cur)
        else:
            cur.append(r)
        last = r
    return paras


def join_rows(rows):
    text = ''
    for r in rows:
        if not text:
            text = r.text
        elif text.endswith('-') and r.text[:1].isalpha():
            text += r.text  # a word broken at the line end
        else:
            text += ' ' + r.text
    return text


def render(rows, page_height, part, page):
    text = join_rows(rows)
    size = max(r.size for r in rows)
    bold = all(r.bold for r in rows)
    short = len(text) < 160 and not LIST_RE.match(text) and '....' not in text and not text.endswith('.')
    if bold and size >= 18 and len(text) < 200:
        return Block('title', text, part, page)
    if bold and size >= 13.5 and short:
        return Block('h2', text, part, page)
    if bold and size >= 10.5 and short and len(text) < 120:
        return Block('h3', text, part, page)
    if BULLET_RE.match(text):
        return Block('bullet', BULLET_RE.sub('', text), part, page)
    m = re.match(r'^(\d{1,3}) (\S.*)', text)
    if m and size <= 9.5 and rows[0].y0 > page_height * 0.6:
        return Block('fn', f'[^{m.group(1)}]: {m.group(2)}', part, page)
    return Block('p', text, part, page)


def page_blocks(doc, part, page_no):
    page = doc[page_no - 1]
    lines, meta = page_lines(page)
    blocks = [render(p, page.rect.height, part, page_no) for p in paragraphs(merge_rows(lines))]
    return blocks, meta


def block_md(b):
    if b.kind == 'title':
        return f'**{b.text}**'
    if b.kind == 'h2':
        return f'## {b.text}'
    if b.kind == 'h3':
        return f'### {b.text}'
    if b.kind == 'bullet':
        return f'- {b.text}'
    return b.text


# ---------------------------------------------------------------------------------------------------------------
# helpers


def slug(s, n=60):
    s = re.sub(r'[’\'"]', '', s.lower())
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s[:n].rstrip('-')


def norm(s):
    return re.sub(r'[^a-z0-9]+', '', s.lower())


def similar(a, b):
    a, b = norm(a), norm(b)
    if not a or not b:
        return False
    if a in b or b in a:
        return True
    return difflib.SequenceMatcher(None, a, b).ratio() > 0.8


def words(text):
    return len(text.split())


def pdf_ref(part, page):
    return f'sources:pins/{PART_FILES[part]}#page={page}'


def pdf_link(from_dir, part, page, name=None):
    rel = os.path.relpath(os.path.join(SRC_DIR, name or PART_FILES[part]), from_dir).replace(' ', '%20')
    return f'{rel}#page={page}'


def pages_label(spans):
    return '; '.join(f'Part {p} pp. {a}-{b}' if a != b else f'Part {p} p. {a}' for p, a, b in spans)


def frontmatter(d):
    out = ['---']
    for k, v in d.items():
        if isinstance(v, list):
            if not v:
                out.append(f'{k}: []')
            else:
                out.append(f'{k}:')
                out.extend(f'  - {json.dumps(x, ensure_ascii=False) if not isinstance(x, str) else quote(x)}' for x in v)
        else:
            out.append(f'{k}: {quote(v) if isinstance(v, str) else json.dumps(v)}')
    out.append('---')
    return '\n'.join(out) + '\n\n'


def quote(s):
    return json.dumps(s, ensure_ascii=False) if re.search(r'[:#\[\]{}&*!|>\'"%@`]|^\s|\s$', s) or s == '' else s


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)


# ---------------------------------------------------------------------------------------------------------------
# build


def chapter_pages(spans):
    for part, a, b in spans:
        for p in range(a, b + 1):
            yield part, p


def read_chapter(docs, tocs, num, title, spans):
    """Extract a chapter: returns dict with blocks (with page markers), cover metadata and bookmark list."""
    blocks, pages, meta = [], [], {}
    first = True
    for part, p in chapter_pages(spans):
        pb, m = page_blocks(docs[part], part, p)
        if 'version' in m and 'version' not in meta:
            meta['version'] = m['version']
        if first:
            for b in pb:
                em = EDITION_RE.search(b.text)
                if em and 'nppf_edition' not in meta:
                    ed = re.sub(r'\s*\|.*$|✅|\bYes\b', '', em.group(3)).strip(' .')
                    meta['nppf_edition'] = ('not yet updated to reflect ' if em.group(1) else '') + ed
                    meta['nppf_edition_line'] = b.text
                if CHANGES_RE.match(b.text) and ('changes' not in meta or b.text.lower().startswith('changes')):
                    if 'changes' not in meta or not meta['changes'].lower().startswith('changes'):
                        meta['changes'] = b.text
            titles = [b.text for b in pb if b.kind == 'title']
            if titles:
                meta['cover_title'] = ' '.join(titles)
            # the cover's banner lines ("Updated to reflect ...", "What's new") are not section headings
            pb = [b._replace(kind='p', text=f'**{b.text}**') if b.kind in ('h2', 'h3') else b for b in pb]
            first = False
        pages.append((part, p, pb))
    # level-2 bookmarks inside the chapter's pages
    marks = []
    for part, a, b in spans:
        for lvl, t, pg in tocs[part]:
            if lvl == 2 and a <= pg <= b and not similar(t, title):
                marks.append((part, pg, t.strip()))
    return {'num': num, 'title': title, 'spans': spans, 'pages': pages, 'meta': meta, 'marks': marks}


def split_sections(ch):
    """Decide section boundaries: bookmarks if the chapter has them, else its own headings.
    Returns a list of sections: {'title', 'blocks': [(part, page, block)], 'annex': bool, 'synthetic': bool}."""
    flat = []  # (part, page, block, first_on_page)
    for part, p, pb in ch['pages']:
        for i, b in enumerate(pb):
            flat.append((part, p, b, i == 0))
    bounds = {}  # index in flat -> (title, synthetic heading needed)
    if ch['marks']:
        for part, pg, t in ch['marks']:
            cands = [i for i, (pp, p, b, _) in enumerate(flat) if pp == part and pg <= p <= pg + 1 and b.kind in ('h2', 'h3', 'title', 'p')]
            hit = next((i for i in cands if flat[i][2].kind != 'p' and similar(flat[i][2].text, t)), None)
            if hit is None:
                hit = next((i for i in cands if similar(flat[i][2].text, t)), None)
            if hit is None:
                hit = next((i for i, (pp, p, b, f) in enumerate(flat) if pp == part and p == pg), None)
                if hit is None:
                    continue
                bounds.setdefault(hit, (t, True))
            else:
                bounds.setdefault(hit, (t, False))
    else:
        n_pages = sum(b - a + 1 for _, a, b in ch['spans'])
        for kind in ('h2', 'h3'):
            idx = [i for i, (_, _, b, _) in enumerate(flat) if b.kind == kind]
            if len(idx) >= 2 or (idx and n_pages <= 12):
                for i in idx:
                    bounds[i] = (flat[i][2].text, False)
                break
            if n_pages <= 12:
                break
    sections = []
    cur = {'title': 'Front matter and contents', 'blocks': [], 'annex': False, 'synthetic': False, 'front': True}
    for i, (part, p, b, _) in enumerate(flat):
        if i in bounds:
            t, synthetic = bounds[i]
            if cur['blocks'] or not sections:
                sections.append(cur)
            cur = {'title': t, 'blocks': [], 'annex': bool(ANNEX_RE.match(t)), 'synthetic': synthetic, 'front': False}
        cur['blocks'].append((part, p, b))
    sections.append(cur)
    # drop an empty front section; merge heading-only sections into the next one
    sections = [s for s in sections if s['blocks']]
    merged = []
    for s in sections:
        if merged and len(merged[-1]['blocks']) <= 1 and not merged[-1]['annex'] and not s['annex']:
            prev = merged.pop()
            s['blocks'] = prev['blocks'] + s['blocks']
            if prev['front']:
                s['front'] = True
        merged.append(s)
    # split sections that are too big on their own sub-headings
    out = []
    for s in merged:
        if sum(words(b.text) for _, _, b in s['blocks']) <= MAX_FILE_WORDS:
            out.append(s)
            continue
        parts, cur = [], {**s, 'blocks': []}
        for part, p, b in s['blocks']:
            if cur['blocks'] and b.kind in ('h2', 'h3') and sum(words(x.text) for _, _, x in cur['blocks']) > MAX_FILE_WORDS * 0.5:
                parts.append(cur)
                cur = {**s, 'blocks': [], 'title': f"{s['title']}: {b.text}", 'synthetic': False}
            cur['blocks'].append((part, p, b))
        parts.append(cur)
        out.extend(parts)
    return out


def section_md(blocks, title=None, synthetic=False):
    """Markdown body for a run of blocks, with a page marker at each page change."""
    out, last = [], None
    if synthetic and title:
        out.append(f'## {title}')
    for part, p, b in blocks:
        if (part, p) != last:
            out.append(f'<!-- Part{part} p.{p} -->')
            last = (part, p)
        out.append(block_md(b))
    return '\n\n'.join(out) + '\n'


def dedupe_markers(text):
    """Keep only the first of consecutive identical page markers (each section starts with its own)."""
    out, last = [], None
    for ln in text.split('\n'):
        if ln.startswith('<!-- Part') and ln.endswith('-->'):
            if ln == last:
                continue
            last = ln
        out.append(ln)
    return re.sub(r'\n{3,}', '\n\n', '\n'.join(out))


def section_spans(blocks):
    pages = sorted({(part, p) for part, p, _ in blocks})
    spans = []
    for part, p in pages:
        if spans and spans[-1][0] == part and spans[-1][2] >= p - 1:
            spans[-1][2] = p
        else:
            spans.append([part, p, p])
    return [tuple(s) for s in spans]


def policy_codes_in(text, codes):
    found = collections.Counter()
    for m in POLICY_RE.finditer(text):
        if m.group(1) in codes:
            found[m.group(1)] += 1
    return found


POLICY_RE = None


def load_nppf_codes():
    global POLICY_RE
    s = json.load(open(NPPF_STRUCTURE, encoding='utf-8'))
    codes = {e['code']: e['title'] for e in s['entries'] if e['kind'] == 'policy'}
    prefixes = sorted({re.match(r'[A-Z]+', c).group(0) for c in codes}, key=len, reverse=True)
    POLICY_RE = re.compile(r'\b((?:' + '|'.join(prefixes) + r')\d{1,2})\b')
    return codes


def build(args):
    import pymupdf
    docs = {p: pymupdf.open(os.path.join(SRC_DIR, f)) for p, f in PART_FILES.items()}
    tocs = {p: d.get_toc() for p, d in docs.items()}
    codes = load_nppf_codes()
    chapters_dir = os.path.join(OUT, 'chapters')
    if os.path.isdir(chapters_dir):
        import shutil
        shutil.rmtree(chapters_dir)
    index_rows, structure, full = [], [], []
    for num, title, spans, note in CHAPTERS:
        ch = read_chapter(docs, tocs, num, title, spans)
        sections = split_sections(ch)
        cslug = f'{num}-{slug(title, 50)}'
        ch_file = os.path.join(chapters_dir, cslug + '.md')
        ch_dir = os.path.join(chapters_dir, cslug)
        all_text = ' '.join(b.text for _, _, pb in ch['pages'] for b in pb)
        cited = policy_codes_in(all_text, codes)
        meta = ch['meta']
        base_fm = {
            'source': 'Inspector Training Manual (Planning Inspectorate), consolidated edition of ' + EDITION,
            'chapter': num, 'chapter_title': title,
        }
        # sections and annexes
        sec_entries, body_parts, n_sec, n_ann = [], [], 0, 0
        for s in sections:
            sp = section_spans(s['blocks'])
            s_words = sum(words(b.text) for _, _, b in s['blocks'])
            if s['front']:
                body_parts.append(section_md(s['blocks']))
                sec_entries.append({'kind': 'front', 'title': s['title'], 'pages': sp, 'words': s_words})
                continue
            if s['annex']:
                n_ann += 1
                fname = f'annex-{n_ann:02d}-{slug(s["title"], 50)}.md'
            else:
                n_sec += 1
                fname = f'{n_sec:02d}-{slug(s["title"], 50)}.md'
            fpath = os.path.join(ch_dir, fname)
            fm = dict(base_fm)
            fm.update({
                'section': s['title'], 'kind': 'annex' if s['annex'] else 'section',
                'pdf': [pdf_ref(p, a) for p, a, b in sp],
                'pdf_pages': pages_label(sp),
                'pdf_link': [pdf_link(ch_dir, p, a) for p, a, b in sp],
                'chapter_file': f'../{cslug}.md',
                'nppf_edition': meta.get('nppf_edition', 'not stated'),
                'words': s_words,
            })
            write(fpath, frontmatter(fm) + f'# {num} {title}: {s["title"]}\n\n' + section_md(s['blocks'], s['title'], s['synthetic']))
            rel = f'{cslug}/{fname}'
            sec_entries.append({'kind': fm['kind'], 'title': s['title'], 'file': 'chapters/' + rel, 'pages': sp, 'words': s_words})
            if s['annex']:
                body_parts.append(f'<!-- Part{sp[0][0]} p.{sp[0][1]} -->\n\n> **{s["title"]}** ({pages_label(sp)}, {s_words:,} words) '
                                  f'is split out to [{rel}]({rel}).\n')
            else:
                body_parts.append(section_md(s['blocks'], s['title'], s['synthetic']))
        ch_words = sum(words(b.text) for _, _, pb in ch['pages'] for b in pb)
        fm = dict(base_fm)
        fm.update({
            'pdf': [pdf_ref(p, a) for p, a, b in spans],
            'pdf_pages': pages_label(spans),
            'pdf_link': [pdf_link(chapters_dir, p, a) for p, a, b in spans],
            'cover_title': meta.get('cover_title', ''),
            'nppf_edition': meta.get('nppf_edition', 'not stated'),
            'nppf_edition_line': meta.get('nppf_edition_line', ''),
            'last_change': meta.get('changes', ''),
            'version': meta.get('version', ''),
            'note': note,
            'words': ch_words,
            'sections': [e['file'] for e in sec_entries if e['kind'] == 'section'],
            'annexes': [e['file'] for e in sec_entries if e['kind'] == 'annex'],
            'nppf_policies_cited': [f'{c} ({n})' for c, n in cited.most_common()],
        })
        head = f'# {num} {title}\n\n'
        if sec_entries:
            head += 'Sections (annexes are in their own files):\n\n' + '\n'.join(
                f'- {"Annex: " if e["kind"] == "annex" else ""}[{e["title"]}]({e["file"][9:]}) ({pages_label(e["pages"])})'
                for e in sec_entries if e['kind'] != 'front') + '\n\n'
        write(ch_file, frontmatter(fm) + head + dedupe_markers('\n'.join(body_parts)))
        full.append(f'\n\n<!-- chapter {num} -->\n\n# {num} {title}\n\n' + dedupe_markers('\n'.join(
            section_md(s['blocks'], s['title'], s['synthetic']) if not s['front'] else section_md(s['blocks']) for s in sections)))
        n_pages = sum(b - a + 1 for _, a, b in spans)
        structure.append({'num': num, 'title': title, 'file': f'chapters/{cslug}.md', 'spans': spans, 'pages': n_pages, 'words': ch_words,
                          'version': meta.get('version', ''), 'nppf_edition': meta.get('nppf_edition', ''), 'last_change': meta.get('changes', ''),
                          'cover_title': meta.get('cover_title', ''), 'note': note, 'sections': sec_entries,
                          'nppf_policies_cited': dict(cited.most_common())})
        index_rows.append((num, title, cslug, spans, n_pages, ch_words, meta, len([e for e in sec_entries if e['kind'] == 'section']),
                           len([e for e in sec_entries if e['kind'] == 'annex']), cited, note))
        print(f'{num:>4} {title[:60]:60} {n_pages:4} pp {ch_words:7,} words  sec={len([e for e in sec_entries if e["kind"]=="section"]):3} '
              f'annex={len([e for e in sec_entries if e["kind"]=="annex"]):2}  v{meta.get("version","?"):>3}  {meta.get("nppf_edition","?")[:40]}')
    # the full manual
    fm = {
        'title': 'Inspector Training Manual, consolidated edition of ' + EDITION + ' (full text)',
        'source': 'The Planning Inspectorate, Inspector Training Manual, consolidated PDF in four parts',
        'pdf': [f'sources:pins/{f}' for f in PART_FILES.values()],
        'generated_by': 'tools/itm_md.py build',
        'chapters': len(CHAPTERS),
        'words': sum(r[5] for r in index_rows),
    }
    write(os.path.join(OUT, 'manual-full.md'), frontmatter(fm) + '# Inspector Training Manual (' + EDITION + ')\n\n'
          'Full text of every chapter, in Index order. `<!-- PartN p.M -->` marks the start of PDF page M of Part N. '
          'See INDEX.md for the chapter list and README.md for how this was made.\n' + ''.join(full))
    # the PINS note
    note_doc = pymupdf.open(os.path.join(SRC_DIR, NOTE_FILE))
    blocks = []
    for p in range(1, len(note_doc) + 1):
        pb, _ = page_blocks(note_doc, 0, p)
        blocks.extend((0, p, b) for b in pb)
    note_text = ' '.join(b.text for _, _, b in blocks)
    note_cited = policy_codes_in(note_text, codes)
    fm = {
        'title': 'PINS Note 04/2026: National Planning Policy Framework 2026',
        'source': 'The Planning Inspectorate, PINS Note 04/2026, issued 19 August 2026',
        'pdf': f'sources:pins/{NOTE_FILE}',
        'pdf_link': pdf_link(OUT, 0, 1, NOTE_FILE),
        'pages': len(note_doc),
        'words': words(note_text),
        'nppf_policies_cited': [f'{c} ({n})' for c, n in note_cited.most_common()],
    }
    note_md = section_md(blocks).replace('<!-- Part0 p.', '<!-- PINS Note p.')
    write(os.path.join(OUT, 'pins-note-04-2026.md'), frontmatter(fm) + '# PINS Note 04/2026: National Planning Policy Framework 2026\n\n' + note_md)
    json.dump({'generated_by': 'tools/itm_md.py build', 'edition': EDITION, 'parts': {p: {'file': f, 'pages': len(docs[p])} for p, f in PART_FILES.items()},
               'duplicate_pages': {'part': 1, 'pages': [912, 1064], 'same_as': [759, 911]},
               'chapters': structure, 'pins_note': {'file': 'pins-note-04-2026.md', 'pdf': f'sources:pins/{NOTE_FILE}', 'pages': len(note_doc),
                                                    'nppf_policies_cited': dict(note_cited.most_common())}},
              open(os.path.join(OUT, 'structure.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    write_index(index_rows, note_cited, len(note_doc))
    write_readme(index_rows)


def write_index(rows, note_cited, note_pages):
    out = ['# Inspector Training Manual (' + EDITION + '): index\n',
           'Start here. One row per chapter of the consolidated PDF; the chapter file holds the full chapter text except its '
           'annexes, which are in their own files under the chapter folder, as are the chapter\'s sections. Load a section file '
           'rather than a chapter when you can. Pages are PDF page numbers of the named Part, as in `sources:pins/<file>#page=N`.\n',
           '| No. | Chapter | Where | Pages | Words | NPPF edition reflected | Version | Sections | Annexes | NPPF policies cited |',
           '| --- | --- | --- | ---: | ---: | --- | --- | ---: | ---: | --- |']
    for num, title, cslug, spans, n_pages, n_words, meta, n_sec, n_ann, cited, note in rows:
        top = ', '.join(f'{c} ({n})' for c, n in cited.most_common(8))
        if len(cited) > 8:
            top += f', +{len(cited) - 8} more'
        out.append(f'| {num} | [{title}](chapters/{cslug}.md) | {pages_label(spans)} | {n_pages} | {n_words:,} | '
                   f'{meta.get("nppf_edition", "not stated")} | {meta.get("version", "")} | {n_sec} | {n_ann} | {top} |')
    out.append('')
    out.append('## Notes\n')
    for num, title, *_, note in rows:
        if note:
            out.append(f'- **{num} {title}.** {note}')
    out.append('- **PINS Note 04/2026** (NPPF 2026 briefing, ' + str(note_pages) + ' pages): [pins-note-04-2026.md](pins-note-04-2026.md). '
               'NPPF policies cited: ' + ', '.join(f'{c} ({n})' for c, n in note_cited.most_common()) + '.')
    out.append('- **Glossary**: [glossary/GLOSSARY.md](glossary/GLOSSARY.md) maps each recurring NPPF term and phrase to the Framework and to the manual.')
    out.append('- **Full text**: [manual-full.md](manual-full.md); machine-readable map: [structure.json](structure.json).')
    out.append('- **NPPF edition reflected** is what the chapter\'s own cover page says. Chapters still on the December 2024 '
               'Framework cite 2024 paragraph numbers, not 2026 policy codes.')
    write(os.path.join(OUT, 'INDEX.md'), '\n'.join(out) + '\n')


def write_readme(rows):
    text = f'''# Inspector Training Manual ({EDITION}): Markdown edition and index

The Planning Inspectorate's Inspector Training Manual (ITM) is internal training material for Inspectors: practical advice on
procedure and on each casework topic. It "does not constitute Government policy or guidance" and is "not the source of any
guidance" (Index page). This folder holds a Markdown edition of the consolidated {EDITION} edition, split so that an agent
can load one chapter, section or annex at a time, plus PINS Note 04/2026 (the Inspectorate's briefing on the August 2026 NPPF)
and a glossary that maps recurring NPPF terms to both documents.

## Files

- `INDEX.md`: the chapter list with pages, sizes, the NPPF edition each chapter reflects and the NPPF policy codes it cites. Start here.
- `chapters/<No>-<slug>.md`: one file per chapter, full text less its annexes.
- `chapters/<No>-<slug>/<NN>-<slug>.md`: the chapter's sections (from the PDF bookmarks where the chapter has them, else its own headings).
- `chapters/<No>-<slug>/annex-<NN>-<slug>.md`: the chapter's annexes and appendices (example decisions, templates, case law summaries), linked from the chapter file where they were.
- `manual-full.md`: everything in one file.
- `pins-note-04-2026.md`: PINS Note 04/2026.
- `glossary/GLOSSARY.md` and `glossary/terms/<term>.md`: the term index; `glossary/terms.txt` is the curated term list it is built from.
- `structure.json`: the same map for programs.
- NPPF chunk files (one per chapter, policy and annex of the Framework) are beside the canonical copy at `../nppf/chunks/`.

## Source and page references

The PDFs are in the private sources checkout as `sources:pins/<file>`:

| Part | File | Pages |
| --- | --- | ---: |
''' + '\n'.join(f'| {p} | `{f}` | |' for p, f in PART_FILES.items()) + f'''
| Note | `{NOTE_FILE}` | 12 |

Every file's front matter gives `pdf` (the `sources:` reference with `#page=`), `pdf_pages` and `pdf_link` (a relative link that
opens the PDF at the first page when the sources checkout is beside this repository). In the text, `<!-- PartN p.M -->` marks the
start of PDF page M of Part N, so any passage can be cited as "ITM <chapter>, Part N p. M".

## How it was made

`tools/itm_md.py build` reads the PDFs' own text layer with PyMuPDF (no OCR was needed: every page has text). It drops the
diagonal "Valid only on {EDITION}" watermark (a rotated text line on every page), the running footers and the page numbers,
rejoins wrapped lines, keeps numbered paragraphs and bullets as written, renders bold headings as Markdown headings by font size
and joins cells that share a line with ` | `. Tables therefore read row by row; diagrams and flowcharts are not captured. Yellow
highlighting (which the manual uses to mark recent changes) is not captured. Text is otherwise verbatim; nothing is summarised.

Chapter boundaries come from each chapter's cover page and the PDF bookmarks. Part 1 pages 912-1064 repeat the Enforcement Case
Law chapter and are skipped; the procedural "Enforcement" chapter on the Index page is not in the consolidated PDF.

## Copyright and reuse

The manual is Crown copyright, produced by the Planning Inspectorate, an executive agency of the Ministry of Housing, Communities
and Local Government. The Inspectorate's stated policy (Index page) is "to disclose the Inspector Training Manual if requested by
an external customer, but not to publish the material externally on a website"; this copy was obtained by such a request. Crown
copyright information released under the Freedom of Information Act 2000 is not automatically licensed for reuse: the Open
Government Licence applies only where the public authority has applied it, and section 19 of the Act and the Re-use of Public
Sector Information Regulations 2015 govern reuse of released information. This folder is published on the working assumption
that the Inspectorate's training material, like its other published guidance, is reusable under the OGL v3.0, pending
confirmation. If that assumption proves wrong the text will be withdrawn to the private sources checkout and only this index,
the glossary locations and short quotations will remain. PINS Note 04/2026 is treated the same way.
'''
    write(os.path.join(OUT, 'README.md'), text)


# ---------------------------------------------------------------------------------------------------------------
# NPPF chunks


def nppf_lines():
    return open(NPPF_MD, encoding='utf-8').read().split('\n')


def nppf_chunks(args):
    s = json.load(open(NPPF_STRUCTURE, encoding='utf-8'))
    lines = nppf_lines()
    anchor_line = {}
    for i, ln in enumerate(lines):
        for m in re.finditer(r'<a id="([^"]+)"></a>', ln):
            anchor_line.setdefault(m.group(1), i)
    fn_start = next(i for i, ln in enumerate(lines) if ln.startswith('## Footnotes'))
    footnotes = {}
    for ln in lines[fn_start:]:
        m = re.match(r'\[\^(\d+)\]: (.*)', ln)
        if m:
            footnotes[m.group(1)] = ln
    heads = [e for e in s['entries'] if e['kind'] in ('chapter', 'annex', 'policy')]
    for e in heads:
        e['line'] = anchor_line[e['anchor']]
    heads.sort(key=lambda e: e['line'])
    parts = {p['key']: p for p in s['parts']}
    if os.path.isdir(NPPF_CHUNKS):
        import shutil
        shutil.rmtree(NPPF_CHUNKS)
    index = ['# NPPF (August 2026) chunk files\n',
             'One file per chapter, policy and annex of the Framework, cut verbatim from the canonical Markdown edition '
             '`../NPPF-August-2026.md` (anchors and page markers kept, footnotes appended). A chapter file holds all of its policies; '
             'load a policy file when a chapter is more than you need. Generated by `tools/itm_md.py nppf-chunks`.\n']
    paras_by_part = collections.defaultdict(list)
    for e in s['entries']:
        if e['kind'] in ('para', 'letter', 'roman') and e.get('code'):
            paras_by_part[e['part']].append(e['code'])
    for i, e in enumerate(heads):
        start = e['line']
        if e['kind'] in ('chapter', 'annex'):
            nxt = next((h['line'] for h in heads[i + 1:] if h['kind'] in ('chapter', 'annex')), fn_start)
        else:
            nxt = heads[i + 1]['line'] if i + 1 < len(heads) else fn_start
        body = lines[start:nxt]
        while body and not body[-1].strip():
            body.pop()
        # bring the page marker that precedes the heading inside the chunk
        if start > 0 and lines[start - 1].startswith('<!-- p.'):
            body.insert(0, lines[start - 1])
        used = sorted({m for ln in body for m in re.findall(r'\[\^(\d+)\](?!:)', ln)}, key=int)
        if used:
            body += ['', '## Footnotes', ''] + [footnotes[n] for n in used if n in footnotes]
        if e['kind'] == 'policy':
            code = e['code']
            fname = f'policies/{code}.md'
            title = f'{code}: {e["title"]}'
            chapter = parts[e['part']]
        elif e['kind'] == 'chapter':
            code = e['key']
            fname = f'chapters/{code}-{slug(e["title"], 50)}.md'
            title = f'{parts[code]["num"]}. {e["title"]}'
            chapter = parts[code]
        else:
            code = e['key']
            fname = f'annexes/{code}-{slug(e["title"], 50)}.md'
            title = f'Annex {parts[code]["num"]}: {e["title"]}'
            chapter = parts[code]
        fm = {
            'source': 'National Planning Policy Framework (August 2026), canonical Markdown edition open:nppf/NPPF-August-2026.md',
            'kind': e['kind'], 'code': code, 'title': e['title'],
            'chapter': f'{chapter.get("num", "")}. {chapter["title"]}' if chapter['kind'] == 'chapter' else f'Annex {chapter["num"]}: {chapter["title"]}',
            'anchor': f'../../NPPF-August-2026.md#{e["anchor"]}',
            'printed_page': e['page'],
            'pdf': f'open:nppf/NPPF-August-2026.pdf#page={e["page"] + NPPF_PDF_OFFSET}',
            'pdf_link': f'../../NPPF-August-2026.pdf#page={e["page"] + NPPF_PDF_OFFSET}',
        }
        if e['kind'] == 'policy':
            fm['policies'] = [code]
            fm['paragraphs'] = [c for c in paras_by_part[e['part']] if c.startswith(code + '(') and c.count('(') == 1]
        else:
            fm['policies'] = [p['code'] for p in chapter.get('policies', [])]
        write(os.path.join(NPPF_CHUNKS, fname), frontmatter(fm) + '\n'.join(body) + '\n')
        if e['kind'] in ('chapter', 'annex'):
            index.append(f'- [{title}]({fname}) (p. {e["page"]})')
        else:
            index.append(f'  - [{title}]({fname}) (p. {e["page"]})')
    write(os.path.join(NPPF_CHUNKS, 'README.md'), '\n'.join(index) + '\n')
    print(f'{len(heads)} NPPF chunk files')


# ---------------------------------------------------------------------------------------------------------------
# glossary


STOP = set('the of and to in or for a an by that is are be as on with which this it its their from at not should will '
           'may where any such other than those these have has been can could would into also more all but if when there '
           'they them was were who whose what how one two three only both each per up out over under about through '
           'between within without including include includes set out'.split())


def nppf_body_text():
    """(line_no, text) for body lines of the NPPF Markdown, with anchors and markup stripped."""
    lines = nppf_lines()
    start = next(i for i, ln in enumerate(lines) if ln.startswith('## <a id="ch1"'))
    end = next(i for i, ln in enumerate(lines) if ln.startswith('## Footnotes'))
    out = []
    for i in range(start, end):
        t = lines[i]
        t = re.sub(r'<a id="[^"]+"></a>|<!--.*?-->|<br>|\[\^\d+\]:?|\*\*', '', t)
        t = re.sub(r'^\s*(#+|>|\||[a-z]\.|[ivx]+\.|\d+\.|-)\s*', '', t)
        t = re.sub(r'\s+', ' ', t).strip()
        if t:
            out.append((i, t))
    return out


def mine(args):
    text = ' '.join(t for _, t in nppf_body_text()).lower()
    toks = re.findall(r"[a-z][a-z'\-]+", text)
    counts = collections.Counter()
    for n in (2, 3, 4):
        for i in range(len(toks) - n + 1):
            g = toks[i:i + n]
            if g[0] in STOP or g[-1] in STOP:
                continue
            counts[' '.join(g)] += 1
    for g, c in counts.most_common(args.top):
        if c >= args.min:
            print(f'{c:4}  {g}')


def load_terms():
    """glossary/terms.txt: `term | variant | variant  # comment` per line, grouped under `## Group` headings."""
    path = os.path.join(OUT, 'glossary', 'terms.txt')
    groups, group = [], None
    for ln in open(path, encoding='utf-8'):
        if ln.startswith('## '):
            group = (ln[3:].strip(), [])
            groups.append(group)
            continue
        ln = ln.split('#', 1)[0].strip()
        if not ln:
            continue
        if ln.startswith('@'):
            group[1].extend(expand_directive(ln))
            continue
        variants = [v.strip() for v in ln.split('|') if v.strip()]
        group[1].append((variants[0], variants))
    # a term that appeared in an earlier group is skipped
    seen, out = set(), []
    for gname, terms in groups:
        kept = []
        for term, variants in terms:
            if slug(term, 50) in seen:
                continue
            seen.add(slug(term, 50))
            kept.append((term, variants))
        out.append((gname, kept))
    return out


def expand_directive(d):
    s = json.load(open(NPPF_STRUCTURE, encoding='utf-8'))
    if d == '@annexB':
        out = []
        for e in s['entries']:
            if e['kind'] != 'term':
                continue
            title = e['title']
            base = re.sub(r'\s*\(.*?\)', '', title).strip()
            variants = [v.strip() for v in base.split('/') if v.strip()]
            out.append((title, variants))
        return out
    if d == '@policies':
        return [(e['code'], [e['code']]) for e in s['entries'] if e['kind'] == 'policy']
    if d == '@chapters':
        return [(p['title'], [p['title']]) for p in s['parts'] if p['kind'] == 'chapter' and p['title'] != 'Introduction']
    raise SystemExit(f'unknown directive {d}')


def term_regex(variants):
    alts = []
    for v in variants:
        parts = [re.escape(w) for w in re.split(r'[\s\-]+', v.strip()) if w]
        alts.append(r'[\s\-]+'.join(parts))
    return re.compile(r'(?<![A-Za-z0-9])(?:' + '|'.join(alts) + r')(?:s|es)?(?![A-Za-z0-9])', re.I)


def nppf_locator():
    """Map a Markdown line number to (code, printed page) of the nearest preceding paragraph-level anchor."""
    s = json.load(open(NPPF_STRUCTURE, encoding='utf-8'))
    lines = nppf_lines()
    marks = []  # (line, code, page, part)
    page = 0
    for i, ln in enumerate(lines):
        m = re.match(r'<!-- p\.(\d+) -->', ln)
        if m:
            page = int(m.group(1))
        for a in re.findall(r'<a id="([^"]+)"></a>', ln):
            marks.append((i, a, page))
    entries = {e['anchor']: e for e in s['entries']}

    def code_of(anchor):
        e = entries.get(anchor)
        if not e:
            return anchor
        if e['kind'] in ('chapter', 'annex'):
            return e['title']
        if e['kind'] == 'term':
            return 'Annex B: ' + e['title']
        return e.get('code') or anchor
    import bisect
    idx = [m[0] for m in marks]

    def locate(line_no):
        k = bisect.bisect_right(idx, line_no) - 1
        if k < 0:
            return ('front matter', 0, '')
        ln, anchor, page = marks[k]
        e = entries.get(anchor, {})
        return (code_of(anchor), page, anchor, e.get('part', ''))
    return locate, s


def glossary(args):
    groups = load_terms()
    locate, s = nppf_locator()
    parts = {p['key']: p for p in s['parts']}
    body = nppf_body_text()
    # Annex B definitions
    lines = nppf_lines()
    defs = {}
    for e in s['entries']:
        if e['kind'] == 'term':
            i = next((k for k, ln in enumerate(lines) if f'id="{e["anchor"]}"' in ln), None)
            if i is not None:
                t = re.sub(r'<a id="[^"]+"></a>|\*\*', '', lines[i]).strip()
                defs[norm(e['title'])] = (t, e['anchor'], e['page'])
    structure = json.load(open(os.path.join(OUT, 'structure.json'), encoding='utf-8'))
    # manual text by chapter and page
    manual = []  # (chapter num, title, part, page, text)
    for ch in structure['chapters']:
        text = open(os.path.join(OUT, ch['file']), encoding='utf-8').read()
        # include annex files, which the chapter file only links to
        for e in ch['sections']:
            if e['kind'] == 'annex':
                text += '\n' + open(os.path.join(OUT, e['file']), encoding='utf-8').read()
        cur = None
        for ln in text.split('\n'):
            m = re.match(r'<!-- Part(\d) p\.(\d+) -->', ln)
            if m:
                cur = (int(m.group(1)), int(m.group(2)))
                continue
            if cur and ln.strip() and not ln.startswith('---') and not ln.startswith('<!--'):
                manual.append((ch['num'], ch['title'], cur[0], cur[1], ln))
    note_lines = []
    for ln in open(os.path.join(OUT, 'pins-note-04-2026.md'), encoding='utf-8').read().split('\n'):
        m = re.match(r'<!-- PINS Note p\.(\d+) -->', ln)
        if m:
            cur = int(m.group(1))
        elif ln.strip() and not ln.startswith('<!--'):
            note_lines.append((cur, ln))
    terms_dir = os.path.join(OUT, 'glossary', 'terms')
    if os.path.isdir(terms_dir):
        import shutil
        shutil.rmtree(terms_dir)
    table = ['# Glossary: recurring NPPF (August 2026) terms and phrases, located in the Framework and in the Inspector Training Manual\n',
             'Each row is a term or phrase from the Framework; the NPPF column lists the policies and paragraphs that use it (count in '
             'brackets), the manual column the chapters that use it. Every term has its own file under `terms/` with every occurrence, '
             'in context, with page references. Matching is literal (case-insensitive, plural and hyphen variants), so a term used by a '
             'different name is not found. Terms with an Annex B definition show it. Built by `tools/itm_md.py glossary` from `terms.txt`.\n']
    summary = []
    for gname, terms in groups:
        table.append(f'\n## {gname}\n')
        table.append('| Term | NPPF (policy or paragraph: count) | Manual (chapter: count) | PINS Note | Detail |')
        table.append('| --- | --- | --- | ---: | --- |')
        for term, variants in terms:
            rx = term_regex(variants)
            nppf_hits = []  # (code, page, anchor, part, text)
            for i, t in body:
                if rx.search(t):
                    code, page, anchor, part = locate(i)
                    nppf_hits.append((code, page, anchor, part, t))
            by_code = collections.Counter(h[0] for h in nppf_hits)
            by_chapter = collections.Counter(parts[h[3]]['title'] if h[3] in parts else h[3] for h in nppf_hits)
            man_hits = [(num, title, part, page, ln) for num, title, part, page, ln in manual if rx.search(ln)]
            by_ch = collections.OrderedDict()
            for num, title, part, page, ln in man_hits:
                by_ch.setdefault((num, title), []).append((part, page, ln))
            note_hits = [(p, ln) for p, ln in note_lines if rx.search(ln)]
            tslug = slug(term, 50)
            d = defs.get(norm(term))
            # term file
            out = frontmatter({
                'term': term, 'variants': variants[1:], 'group': gname,
                'annex_b_definition': bool(d),
                'nppf_occurrences': len(nppf_hits), 'manual_occurrences': len(man_hits), 'pins_note_occurrences': len(note_hits),
            })
            out += f'# {term}\n\n'
            if d:
                out += f'**Annex B definition** ([NPPF Annex B, p. {d[2]}](../../../nppf/NPPF-August-2026.md#{d[1]})): {d[0]}\n\n'
            out += f'## In the NPPF ({len(nppf_hits)} lines)\n\n'
            if by_chapter:
                out += 'By chapter: ' + ', '.join(f'{c} ({n})' for c, n in by_chapter.most_common()) + '\n\n'
            if by_code:
                out += 'By policy or paragraph: ' + ', '.join(f'{c} ({n})' for c, n in by_code.most_common()) + '\n\n'
            for code, page, anchor, part, t in nppf_hits[:args.max_nppf]:
                out += f'- [{code}](../../../nppf/NPPF-August-2026.md#{anchor}) (p. {page}): {snippet(t, rx)}\n'
            if len(nppf_hits) > args.max_nppf:
                out += f'- ... and {len(nppf_hits) - args.max_nppf} more\n'
            out += f'\n## In the Inspector Training Manual ({len(man_hits)} paragraphs in {len(by_ch)} chapters)\n\n'
            for (num, title), hits in by_ch.items():
                ch = next(c for c in structure['chapters'] if c['num'] == num)
                pages = sorted({(p, pg) for p, pg, _ in hits})
                out += f'### {num} {title} ({len(hits)})\n\n'
                out += 'Pages: ' + ', '.join(f'Part {p} p. {pg}' for p, pg in pages[:40]) + (' ...' if len(pages) > 40 else '') + '\n\n'
                out += f'File: [{ch["file"]}](../../{ch["file"]})\n\n'
                for p, pg, ln in hits[:args.max_manual]:
                    out += f'- Part {p} p. {pg}: {snippet(ln, rx)}\n'
                if len(hits) > args.max_manual:
                    out += f'- ... and {len(hits) - args.max_manual} more on the pages listed above\n'
                out += '\n'
            if note_hits:
                out += f'## In PINS Note 04/2026 ({len(note_hits)})\n\n'
                for p, ln in note_hits[:args.max_manual]:
                    out += f'- p. {p}: {snippet(ln, rx)}\n'
            write(os.path.join(terms_dir, tslug + '.md'), out)
            # table row
            nppf_cell = ', '.join(f'{c} ({n})' for c, n in by_code.most_common(8)) + (f', +{len(by_code) - 8} more' if len(by_code) > 8 else '')
            man_cell = ', '.join(f'{num} {short(title)} ({len(h)})' for (num, title), h in sorted(by_ch.items(), key=lambda kv: -len(kv[1]))[:6])
            if len(by_ch) > 6:
                man_cell += f', +{len(by_ch) - 6} more'
            table.append(f'| **{term}**{" (Annex B)" if d else ""} | {nppf_cell or "none"} | {man_cell or "none"} | {len(note_hits)} | [terms/{tslug}.md](terms/{tslug}.md) |')
            summary.append((gname, term, len(nppf_hits), len(man_hits), len(note_hits)))
    table.append('\n## Manual vocabulary not found in the 2026 Framework\n')
    table.append('Terms in the list above that occur in the manual (or the PINS note) but nowhere in the August 2026 Framework text. '
                 'Several are December 2024 Framework wording that the 2026 edition dropped or replaced; the manual chapters that '
                 'still use them may be ones not yet updated, or may be quoting case law or older decisions.\n')
    for g, t, a, b, c in summary:
        if a == 0 and (b or c):
            table.append(f'- **{t}** ({g}): manual {b}, PINS note {c}. [terms/{slug(t, 50)}.md](terms/{slug(t, 50)}.md)')
    table.append('\n## Framework vocabulary not found in the manual\n')
    table.append('Terms that occur in the August 2026 Framework but nowhere in the manual or the PINS note: new 2026 vocabulary the '
                 'training material has not yet absorbed, or terms the manual has no chapter for.\n')
    for g, t, a, b, c in summary:
        if a and not b and not c:
            table.append(f'- **{t}** ({g}): NPPF {a}. [terms/{slug(t, 50)}.md](terms/{slug(t, 50)}.md)')
    write(os.path.join(OUT, 'glossary', 'GLOSSARY.md'), '\n'.join(table) + '\n')
    print(f'{len(summary)} terms; {sum(1 for s in summary if s[2] == 0)} with no NPPF hit; {sum(1 for s in summary if s[3] == 0)} with no manual hit')
    for g, t, a, b, c in summary:
        if a == 0 or b == 0:
            print(f'  {g[:20]:20} {t[:50]:50} nppf={a} manual={b} note={c}')


def short(title, n=40):
    if len(title) <= n:
        return title
    cut = title[:n].rsplit(' ', 1)[0]
    return cut.rstrip(' :(,') + '...'


def snippet(text, rx, width=110):
    text = re.sub(r'<a id="[^"]+"></a>|\*\*', '', text)
    m = rx.search(text)
    if not m:
        return text[:width]
    a = max(0, m.start() - width // 2)
    b = min(len(text), m.end() + width // 2)
    s = ('...' if a > 0 else '') + text[a:b].strip() + ('...' if b < len(text) else '')
    return s.replace('|', '\\|')


# ---------------------------------------------------------------------------------------------------------------


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    sub.add_parser('build')
    sub.add_parser('nppf-chunks')
    m = sub.add_parser('mine')
    m.add_argument('--top', type=int, default=400)
    m.add_argument('--min', type=int, default=4)
    g = sub.add_parser('glossary')
    g.add_argument('--max-nppf', type=int, default=60)
    g.add_argument('--max-manual', type=int, default=12)
    a = sub.add_parser('all')
    a.add_argument('--max-nppf', type=int, default=60)
    a.add_argument('--max-manual', type=int, default=12)
    args = ap.parse_args()
    if args.cmd == 'build':
        build(args)
    elif args.cmd == 'nppf-chunks':
        nppf_chunks(args)
    elif args.cmd == 'mine':
        mine(args)
    elif args.cmd == 'glossary':
        glossary(args)
    else:
        build(args)
        nppf_chunks(args)
        glossary(args)


if __name__ == '__main__':
    main()
