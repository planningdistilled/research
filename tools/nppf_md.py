#!/usr/bin/env python3
"""Markdown edition of the National Planning Policy Framework (August 2026), built from the committed text extract.

The Framework's canonical copies live in data/open-sources/nppf/: the PDF (what GOV.UK serves), the
`pdftotext -layout` text beside it (what every quotation check greps), and the files this tool writes:

  NPPF-August-2026.md              the Markdown edition: headings, policy anchors, footnotes, tables, glossary
  NPPF-August-2026.structure.json  where every chapter, policy, paragraph and limb sits (page, md line, txt line)
  README.md                        the folder summary: provenance, structure map, extraction caveats, consumers

Body text is verbatim: the only changes are joining wrapped lines, replacing the footnote markers that
pdftotext fuses to words ("otherwise1" becomes "otherwise[^1]"), dropping page furniture, and the Markdown
structure itself. `check` proves it: every text line round-trips into the Markdown, and every quotation the
site already verifies against the text is also found in the Markdown.

Run:
  uv run tools/nppf_md.py build            write the three files (idempotent)
  uv run tools/nppf_md.py check            validate the committed files (exit 1 on any failure)
  uv run tools/nppf_md.py codes [--write]  policy-code list; --write refreshes data/decisions/nppf-2026-policy-codes.md
  uv run tools/nppf_md.py locate S5(1)(j)  print where a code or limb is, with its text
"""
import argparse
import datetime as dt
import glob
import hashlib
import html as htmllib
import json
import os
import re
import subprocess
import sys
import unicodedata

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from paths import DECISIONS, GUIDANCE, NPPF_MD, NPPF_PDF, NPPF_TXT, OPEN, ROOT  # noqa: E402

NPPF_DIR = os.path.dirname(NPPF_TXT)
STRUCT_PATH = os.path.join(NPPF_DIR, 'NPPF-August-2026.structure.json')
README_PATH = os.path.join(NPPF_DIR, 'README.md')
CODES_PATH = os.path.join(DECISIONS, 'nppf-2026-policy-codes.md')
OGL = os.path.join(OPEN, 'guidance-ogl')

SOURCE_URL = 'https://www.gov.uk/guidance/national-planning-policy-framework'
ASSET_URL = 'https://assets.publishing.service.gov.uk/media/6a8334c03bd75b81e2329ac4/National_Planning_Policy_Framework.pdf'
ASSET_ID = '6a8334c03bd75b81e2329ac4'
EXTRACTED_WITH = 'pdftotext 26.04.0 (poppler), -layout'

PAGES = 130          # PDF pages
BODY_FIRST = 4       # 0-based index of the first body page (printed page 3)
GROUPS = ('Plan-making policies', 'National decision-making policies')
SUBHEADINGS = {
    'Using the Framework', 'Other policy and guidance', 'Purpose of the planning system',
    'The plan-making framework', 'Preparing plans', 'Examining Plans',
    'Preparing planning proposals', 'Determining development proposals', 'Other routes to consent',
    'For the purposes of decision-making', 'For the purposes of plan-making', 'Planning freedoms',
    'The standard method', 'Five year housing land supply', 'Five year supply of traveller sites',
    'The Housing Delivery Test', 'Key:', 'Notes to table 3:',
}
WMS = ('Written Ministerial Statements and other planning policy', 'documents which have been incorporated or superseded')
SUBHEADING_RE = re.compile(r'^(Step \d: .+|Purpose [A-E] – .+|Table \d: .+)$')
CAPS_RE = re.compile(r'^[A-Z][A-Z\- ]{3,}$')
ROMANS = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii']
POLICY_RE = re.compile(r'^([A-Z]{1,2}\d{1,2}): (.+)$')
PARA_RE = re.compile(r'^(\d{1,2})\. (.*)$')
LETTER_RE = re.compile(r'^([a-z])\. (.*)$')
ROMAN_RE = re.compile(r'^(i{1,3}|iv|vi{0,3}|ix|x|xi{0,2})\. (.*)$')
BULLET_RE = re.compile(r'^•\s+(.*)$')
FN_DEF_RE = re.compile(r'^(\d{1,3})(?=\s|[A-Za-z‘\'"(])')
PAGE_NO_RE = re.compile(r'^\s{20,}(\d{1,3})\s*$')
END_PUNCT = ('.', ';', ':', '?', '!', ')')
# Footnote markers that pdftotext did not fuse to a letter: 'spaced' = the number sits after a space ("do so 12."),
# 'digits' = after other digits ("Regulation 1568" is Regulation 15 + footnote 68). Any other marker must be 'fused'.
MARKER_EXCEPTIONS = {12: 'spaced', 46: 'spaced', 68: 'digits', 73: 'spaced', 75: 'digits'}
# Wording in the GOV.UK HTML that differs from the PDF. PDF text is authoritative; these are reported, never merged.
# Each pair is (GOV.UK wording, PDF wording); both sides of a comparison are mapped to the PDF wording first.
KNOWN_HTML_DIFFS = [
    ('5 year', 'five year'),                                              # GOV.UK writes "5 years" in some places (Annex A para 3, Annex D para 8, footnotes 72 and 75) and "five years" in others
    ('chapter 2 and chapter 3 set out', 'chapters 2 and 3 set out'),     # Introduction para 5
    ('yes: exception test is not required', '✓ exception test is not required'),   # Annex F table 3 key
    ('no: development should be refused', 'x development should be refused'),
    ('†† in flood zone 3b', '* in flood zone 3b'),                        # Annex F note to table 3
    ('2,500 metres2 gross floorspace', '2,500m2 gross floorspace'),      # TC4(1)
    (' (relating to land around well-connected stations) only apply', ' only apply'),   # Annex B "reasonable walking distance": the HTML repeats the parenthetical
    (' of the national planning policy framework, is', ', is'),          # objective boxes: the HTML inserts the title
    (' of the national planning policy framework is', ' is'),
]
LINK_TEXT_RE = re.compile(r'\s*\([^()]* - gov\.uk\)')   # the PDF prints hyperlink text such as "(Connectivity Tool - GOV.UK)"; the HTML links instead
HTML_ONLY = [   # page chrome on every GOV.UK chapter page, not in the PDF
    r'^this (is annex [a-f] of|is chapter \d+ of|chapter \d+ of|is the introduction to) the national planning policy framework',
    r'^this is annex [a-f]\.?$',
    r'^continue to (chapter|annex) ',
]
# Footnotes whose GOV.UK wording differs beyond link text and URLs (the PDF prints link text and URLs; the HTML links instead)
FOOTNOTE_WORDING_DIFFS = {4, 48, 49}


# ----------------------------------------------------------------------------------------------------------------
# Normalisation (mirrors tools/corpus_quotes.py so results are comparable)

def norm(s):
    s = unicodedata.normalize('NFKC', s).replace('\u00ad', '').replace('\u200b', '')
    for a, b in [('“', '"'), ('”', '"'), ('‘', "'"), ('’', "'"), ('–', '-'), ('—', '-'), ('…', '...'), (' ', ' ')]:
        s = s.replace(a, b)
    s = re.sub(r'-\s*\n\s*', '-', s)
    return re.sub(r'\s+', ' ', s).strip().lower()


MD_FURNITURE = [
    (re.compile(r'<a id="[^"]*"></a>'), ''),
    (re.compile(r'<!--.*?-->', re.S), ' '),
    (re.compile(r'<br>'), ' '),
    (re.compile(r'(?m)^\[\^\d+\]:\s*'), ''),
    (re.compile(r'\s*\[\^\d+\]'), ''),
    (re.compile(r'\s*\[footnote \d+\]'), ''),
    (re.compile(r'\*\*'), ''),
    (re.compile(r'^\s*>\s?', re.M), ''),
    (re.compile(r'^#+\s*', re.M), ''),
    (re.compile(r'^\s*\|?\s*(?:---\s*\|)+\s*-*\s*$', re.M), ' '),
    (re.compile(r'\|'), ' '),
]


def canon(n):
    """Normalised text with the known GOV.UK wording differences mapped to the PDF wording, for comparing the two."""
    n = LINK_TEXT_RE.sub('', n)
    for a, b in KNOWN_HTML_DIFFS:
        n = n.replace(a, b)
    return n


def strip_md(s):
    for rx, rep in MD_FURNITURE:
        s = rx.sub(rep, s)
    return s


def norm_md(s):
    return norm(strip_md(s))


def unmark(s):
    """Drop footnote digits fused to a word ("settlement28" -> "settlement"); applied to both sides of a quotation check."""
    return re.sub(r'(?<=[a-z)\'"%])\d{1,3}(?=[\s.,;:)]|$)', '', s)


def found(q, hay):
    """A quotation is found when it, or each of its ' … ' / ' ¦ ' / '...' / '[...]' parts (3+ words), is in hay."""
    nq = unmark(norm(q))
    if nq in hay:
        return True
    parts = [p.strip(' .,;:') for p in re.split(r'\s*(?:\.\.\.|¦|\[[^\]]*\])\s*', nq) if len(p.strip(' .,;:').split()) >= 3]
    return bool(parts) and all(p in hay for p in parts)


# ----------------------------------------------------------------------------------------------------------------
# Parsing

class Block:
    def __init__(self, kind, text='', **kw):
        self.kind = kind
        self.paras = [text] if text is not None else []   # paragraphs of text (most blocks have one)
        self.lines = []        # txt line numbers (1-based) that fed this block
        self.page = None       # printed page where the block starts
        self.__dict__.update(kw)

    @property
    def text(self):
        return self.paras[0] if self.paras else ''

    def add(self, piece, new_para=False):
        if new_para or not self.paras:
            self.paras.append(piece)
            return
        cur = self.paras[-1]
        self.paras[-1] = join(cur, piece)


def join(a, b):
    """Join two wrapped lines: a space, except after a compound hyphen, after a URL fragment, or before bare punctuation."""
    if not a:
        return b
    if not b:
        return a
    last = a.split()[-1]
    if a.endswith('-') and len(a) > 1 and a[-2].isalpha():
        return a + b
    if last.startswith('http') and not b[:1].isupper():
        return a + b
    if re.match(r'^[.,;:)]+$', b):
        return a + b
    return a + ' ' + b


class Part:
    def __init__(self, kind, num, title, page):
        self.kind, self.num, self.title, self.page = kind, num, title, page
        self.blocks = []
        self.key = f'ch{num}' if kind == 'chapter' else f'annex{num}'
        self.anchor = f'ch{num}' if kind == 'chapter' else f'Annex{num}'

    @property
    def heading(self):
        return f'{self.num}. {self.title}' if self.kind == 'chapter' else f'Annex {self.num}: {self.title}'


class ParseError(Exception):
    pass


def parse_contents(pages):
    """[(kind, num, title, printed page, [codes])] from the two Contents pages, plus the group names."""
    entries, groups = [], {}
    for p in pages:
        for raw in p.split('\n'):
            s = raw.strip()
            if not s or s == 'Contents' or s == 'Annexes':
                continue
            m = re.match(r'^(\d{1,2})\.\s+(.+?)\s*\.{3,}\s*(\d+)$', s) or re.match(r'^Annex ([A-F]):\s+(.+?)\s*\.{3,}\s*(\d+)$', s)
            if m:
                kind = 'chapter' if m.group(1).isdigit() else 'annex'
                num = int(m.group(1)) if kind == 'chapter' else m.group(1)
                title = m.group(2).strip()
                codes = []
                r = re.search(r'\s*\(([A-Z]{1,2})(\d+) - (\d+)\)$', title)
                if r:
                    codes = [f'{r.group(1)}{i}' for i in range(int(r.group(2)), int(r.group(3)) + 1)]
                    title = title[:r.start()]
                entries.append({'kind': kind, 'num': num, 'title': title, 'page': int(m.group(3)), 'codes': codes, 'group': None})
            else:
                groups[len(entries)] = s   # a group label precedes the entries it covers
    for i, g in groups.items():
        if i < len(entries):
            entries[i]['group'] = g
    return entries


def split_pages(txt):
    pages = txt.split('\f')
    if len(pages) == PAGES + 1 and not pages[-1].strip():
        pages.pop()   # a trailing form-feed ends the file
    if len(pages) != PAGES:
        raise ParseError(f'expected {PAGES} pages, found {len(pages)}')
    return pages


class Parser:
    def __init__(self, txt, glossary_terms=None):
        self.txt = txt
        self.glossary_terms = glossary_terms
        self.report = {'markers': [], 'page_joins': [], 'text_paras': [], 'wrapped_headings': [], 'warnings': []}
        self.table_lines = set()     # txt line numbers parsed as table rows (coverage is checked per column segment)
        self.table_segments = {}     # txt line number -> the column texts the parser cut from it
        self.furniture_lines = set() # page numbers, contents, repeated table headers
        self.footnotes = {}          # n -> {'paras': [...], 'page': printed, 'lines': [...]}
        self.defused = {}            # txt line number -> body line after marker replacement
        self.marker_pages = {}       # n -> printed page where the marker was found
        self.front = []              # paragraphs of the cover and copyright pages
        self.parts = []

    # ---- stage 1 and 2: pages, furniture, footnotes
    def run(self):
        pages = split_pages(self.txt)
        line_no = 1
        offsets = []
        for p in pages:
            offsets.append(line_no)
            line_no += p.count('\n')
        self.page_offsets = offsets
        self.contents = parse_contents(pages[2:4])
        self.expected_codes = [c for e in self.contents for c in e['codes']]
        for i in (2, 3):
            for k in range(pages[i].count('\n')):
                self.furniture_lines.add(offsets[i] + k)
        self.front = self.parse_front(pages[0], offsets[0]) + self.parse_front(pages[1], offsets[1])
        self.body = []   # list of (printed page, txt line number, text) with None entries marking page starts
        fn_next = 1
        for idx in range(BODY_FIRST, PAGES):
            printed = idx - 1
            lines = pages[idx].split('\n')
            base = offsets[idx]
            while lines and not lines[-1].strip():
                lines.pop()
            m = PAGE_NO_RE.match(lines[-1]) if lines else None
            if not m or int(m.group(1)) != printed:
                raise ParseError(f'page {printed}: no page number line (got {lines[-1]!r})')
            self.furniture_lines.add(base + len(lines) - 1)
            lines.pop()
            start = None
            for i, l in enumerate(lines):
                fm = FN_DEF_RE.match(l)
                if fm and int(fm.group(1)) == fn_next:
                    start = i
                    break
            body = lines if start is None else lines[:start]
            fnl = [] if start is None else lines[start:]
            defs = []
            for k, l in enumerate(fnl):
                fm = FN_DEF_RE.match(l)
                if fm and int(fm.group(1)) == fn_next:
                    defs.append([fn_next, [l[fm.end():].strip()], [base + start + k]])
                    fn_next += 1
                elif l.strip():
                    defs[-1][1].append(l)
                    defs[-1][2].append(base + start + k)
            for n, ls, lns in defs:
                self.footnotes[n] = {'paras': self.join_footnote(ls), 'page': printed, 'lines': lns}
            body = self.defuse(body, [d[0] for d in defs], printed, base)
            self.body.append((printed, None, None))
            for k, l in enumerate(body):
                self.body.append((printed, base + k, l))
                self.defused[base + k] = l
        if self.report['warnings']:
            raise ParseError('footnote markers: ' + ' | '.join(self.report['warnings']))
        self.parse_body()
        return self

    @staticmethod
    def join_footnote(ls):
        """Footnote lines to paragraphs; footnote 29 carries an i./ii. list, kept as separate paragraphs."""
        paras = []
        for l in ls:
            s = l.strip()
            if re.match(r'^(i|ii|iii|iv)\.\s+', s):
                paras.append(re.sub(r'^(i|ii|iii|iv)\.\s+', lambda m: m.group(1) + '. ', s))
            elif not paras:
                paras.append(s)
            else:
                paras[-1] = join(paras[-1], s)
        return paras

    def defuse(self, body, numbers, printed, base):
        body = list(body)
        for n in numbers:
            rules = [('fused', rf'(?<=[a-z\)’\'”"%\]])({n})(?=[\s.,;:)\]]|$)'),
                     ('spaced', rf'(?<= )({n})(?=[\s.,;:)\]]|$)'),
                     ('digits', rf'(?<=\d)({n})(?=[\s.,;:)\]]|$)')]
            hits, rule = [], None
            for rule, pat in rules:
                hits = [(i, m) for i, l in enumerate(body) for m in re.finditer(pat, l)]
                if hits:
                    break
            if len(hits) != 1:
                self.report['warnings'].append(f'footnote marker {n} on page {printed}: {len(hits)} candidate(s) {[(base + i, body[i].strip()[:60]) for i, _ in hits]}')
                continue
            if MARKER_EXCEPTIONS.get(n, 'fused') != rule:
                self.report['warnings'].append(f'footnote marker {n} on page {printed} resolved by rule {rule!r}, pinned as {MARKER_EXCEPTIONS.get(n, "fused")!r}')
            i, m = hits[0]
            l = body[i]
            body[i] = l[:m.start(1)] + f'[^{n}]' + l[m.end(1):]
            ctx = l[max(0, m.start(1) - 30):m.end(1) + 10].strip()
            self.report['markers'].append({'n': n, 'page': printed, 'line': base + i, 'context': ctx, 'rule': rule})
            self.marker_pages[n] = printed
        return body

    def parse_front(self, page, base):
        paras, cur, lines = [], [], []
        for k, l in enumerate(page.split('\n')):
            s = l.strip()
            if s:
                cur.append(s)
                lines.append(base + k)
            elif cur:
                paras.append(('  \n'.join(cur), lines))   # two trailing spaces: a hard line break in Markdown
                cur, lines = [], []
        if cur:
            paras.append(('  \n'.join(cur), lines))
        return paras

    # ---- stages 4 and 5: classification and block assembly
    def parse_body(self):
        self.part = None
        self.block = None
        self.gap = False
        self.top = False
        self.mode = None
        self.table = None
        self.para_next = 1
        self.letter_next = None
        self.letter_indent = 0
        self.roman_next = None
        self.item = None            # the open letter/roman item (for the trailing-colon rule)
        self.title_open = None      # policy block whose title may wrap
        self.heading_wrap = None    # (part, contents title) while a chapter title wraps
        self.chapter_next = 1
        self.pending_page = None
        it = iter(self.body)
        for printed, ln, raw in it:
            if ln is None:
                self.top = True
                self.gap = False
                self.pending_page = printed
                continue
            self.line(printed, ln, raw)
            self.top = False
        self.close_table()

    def start_part(self, kind, num, title, printed, ln):
        self.close_table()
        self.part = Part(kind, num, title, printed)
        self.parts.append(self.part)
        self.block = None
        self.para_next = 1
        self.letter_next = self.roman_next = None
        self.item = None
        self.mode = 'glossary' if (kind == 'annex' and num == 'B') else None
        self.last_heading_ln = ln

    def push(self, block, ln, printed):
        block.lines.append(ln)
        block.page = printed
        if self.pending_page is not None:
            block.page_start = self.pending_page
            self.pending_page = None
        self.part.blocks.append(block)
        self.block = block
        self.gap = False
        return block

    def contents_entry(self, kind, num):
        for e in self.contents:
            if e['kind'] == kind and e['num'] == num:
                return e
        return None

    def line(self, printed, ln, raw):
        s = raw.rstrip()
        if not s.strip():
            self.gap = True
            if self.mode in ('tableC', 'tableE', 'tableF1', 'tableF3'):
                self.table_gap = True
            return
        indent = len(s) - len(s.lstrip())
        t = s.strip()
        top = self.top

        # heading continuation (wrapped chapter / annex / policy titles)
        if self.heading_wrap:
            part, want = self.heading_wrap
            part.title = join(part.title, t)
            self.heading_wrap = None
            if norm(part.title) != norm(want):
                raise ParseError(f'line {ln}: wrapped heading {part.title!r} != contents {want!r}')
            self.report['wrapped_headings'].append(part.heading)
            self.furniture_lines.discard(ln)
            part.blocks[0].lines.append(ln) if part.blocks else None
            return
        if self.title_open is not None and indent == 0 and not self.gap and not PARA_RE.match(t) and not POLICY_RE.match(t) and t not in GROUPS:
            self.title_open.title = join(self.title_open.title, t)
            self.title_open.lines.append(ln)
            self.report['wrapped_headings'].append(f'{self.title_open.code}: {self.title_open.title}')
            self.title_open = None
            return
        self.title_open = None

        # table modes consume their lines; they hand back the line that ends the table
        if self.mode in ('tableC', 'tableE', 'tableF1', 'tableF3'):
            if self.table_line(printed, ln, s, indent, t):
                return

        # chapter / annex headings
        m = re.match(r'^(\d{1,2})\. (.+)$', t)
        if indent == 0 and m and int(m.group(1)) == self.chapter_next and top:
            e = self.contents_entry('chapter', self.chapter_next)
            if e and norm(e['title']).startswith(norm(m.group(2))):
                self.start_part('chapter', self.chapter_next, m.group(2), printed, ln)
                self.chapter_next += 1
                self.push(Block('heading'), ln, printed)
                if norm(e['title']) != norm(m.group(2)):
                    self.heading_wrap = (self.part, e['title'])
                return
        m = re.match(r'^Annex ([A-F]): (.+)$', t)
        if indent == 0 and m and top:
            e = self.contents_entry('annex', m.group(1))
            if e and norm(e['title']).startswith(norm(m.group(2))):
                self.start_part('annex', m.group(1), m.group(2), printed, ln)
                self.push(Block('heading'), ln, printed)
                if norm(e['title']) != norm(m.group(2)):
                    self.heading_wrap = (self.part, e['title'])
                if m.group(1) == 'C':
                    self.mode = 'tableC_wait'
                return
        if self.part is None:
            raise ParseError(f'line {ln}: text before the first chapter heading: {t[:60]!r}')

        # table starts
        if self.mode == 'tableC_wait' and indent == 0 and t.startswith('Policy theme'):
            self.open_table('tableC', s, ln, printed)
            return
        if indent == 0 and re.match(r'^Contribution\s+Illustrative [Ff]eatures$', t):
            self.open_table('tableE', s, ln, printed)
            return
        if indent == 0 and re.match(r'^Flood Zone\s+Definition$', t):
            self.open_table('tableF1', s, ln, printed)
            return
        if indent == 0 and t.startswith('Flood ') and 'Flood Risk Vulnerability Classification' in t:
            self.open_table('tableF3', s, ln, printed)
            return

        # group and sub-headings
        if indent == 0 and t in GROUPS:
            self.push(Block('group', t), ln, printed)
            self.item = None
            return
        if indent == 0 and (t in SUBHEADINGS or SUBHEADING_RE.match(t) or t == WMS[0]):
            b = self.push(Block('subheading', t), ln, printed)
            if t == WMS[0]:
                b.wms = True
            self.item = None
            return
        if indent == 0 and self.block is not None and getattr(self.block, 'wms', False) and t == WMS[1]:
            self.block.add(t)
            self.block.lines.append(ln)
            self.block.wms = False
            return
        if indent == 0 and CAPS_RE.match(t) and self.part.kind == 'annex' and self.part.num == 'F':
            self.push(Block('caps', t), ln, printed)
            return

        # policy headings
        m = POLICY_RE.match(t)
        if indent == 0 and m and self.mode != 'glossary' and m.group(1) in self.expected_codes:
            b = self.push(Block('policy', None, code=m.group(1), title=m.group(2)), ln, printed)
            self.para_next = 1
            self.letter_next = self.roman_next = None
            self.item = None
            self.title_open = b
            return

        # boxed chapter objective: lines indented by exactly one space straight after the chapter heading
        if indent == 1 and self.block is not None and self.block.kind in ('heading', 'objective'):
            if self.block.kind == 'objective':
                self.block.add(t)
                self.block.lines.append(ln)
            else:
                self.push(Block('objective', t), ln, printed)
            return

        # numbered paragraphs
        m = PARA_RE.match(t)
        if indent == 0 and m and self.mode != 'glossary':
            n = int(m.group(1))
            if n == self.para_next:
                b = self.push(Block('para', m.group(2), num=n), ln, printed)
                self.para_next += 1
                self.letter_next = 'a'
                self.letter_indent = None
                self.roman_next = None
                self.item = None
                return
            if not top:
                raise ParseError(f'line {ln}: paragraph {n} but expected {self.para_next} ({t[:50]!r})')

        # letter and roman items
        lm, rm = LETTER_RE.match(t), ROMAN_RE.match(t)
        if lm or rm:
            tok = (lm or rm).group(1)
            body = (lm or rm).group(2)
            is_roman = tok in ROMANS
            is_letter = len(tok) == 1
            want_roman = bool(rm) and is_roman and self.roman_next is not None and tok == self.roman_next
            want_letter = is_letter and self.letter_next is not None and tok == self.letter_next
            if want_roman and want_letter:
                parent_colon = self.item is not None and self.item.text.rstrip().endswith(':')
                deeper = self.letter_indent is not None and indent > self.letter_indent
                want_letter = not (deeper or parent_colon or (top and indent == 0 and self.item is not None and self.item.kind == 'roman'))
                want_roman = not want_letter
            if want_roman:
                b = self.push(Block('roman', body, label=tok), ln, printed)
                self.roman_next = ROMANS[ROMANS.index(tok) + 1]
                self.item = b
                return
            if want_letter:
                b = self.push(Block('letter', body, label=tok), ln, printed)
                self.letter_next = chr(ord(tok) + 1)
                self.letter_indent = indent
                self.roman_next = 'i'
                self.item = b
                return
            raise ParseError(f'line {ln}: item {tok!r} (expected letter {self.letter_next!r}, roman {self.roman_next!r}) {t[:50]!r}')

        # bullets
        m = BULLET_RE.match(t)
        if m:
            self.push(Block('bullet', m.group(1)), ln, printed)
            return

        # glossary entries
        if self.mode == 'glossary' and indent == 0:
            term = self.glossary_term(t)
            if term:
                b = self.push(Block('term', t[len(term) + 1:].strip(), term=re.sub(r'\[\^\d+\]', '', term), term_raw=term), ln, printed)
                self.letter_next = 'a'
                self.letter_indent = 0
                self.roman_next = None
                self.item = None
                return

        # everything else: continuation of the open block, a further paragraph of it, or a plain text paragraph
        if self.block is not None and self.block.kind not in ('heading', 'group', 'subheading', 'caps'):
            prev = self.block.paras[-1] if self.block.paras else ''
            if top:
                cont = indent > 0 or not prev.rstrip().endswith(END_PUNCT) or t[:1].islower()
                self.report['page_joins'].append({'line': ln, 'page': printed, 'joined': cont, 'text': t[:60]})
                if cont:
                    self.block.add(t)
                    self.block.lines.append(ln)
                    return
            elif not self.gap:
                self.block.add(t)
                self.block.lines.append(ln)
                return
            elif indent > 0 or self.mode == 'glossary':
                self.block.add(t, new_para=True)
                self.block.lines.append(ln)
                return
        b = self.push(Block('text', t), ln, printed)
        self.report['text_paras'].append({'line': ln, 'page': printed, 'text': t[:70]})

    def glossary_term(self, t):
        plain = re.sub(r'\[\^\d+\]', '', t)
        if self.glossary_terms:
            for term in self.glossary_terms:
                if plain.startswith(term + ':') and (len(plain) == len(term) + 1 or plain[len(term) + 1] == ' '):
                    i = t.find(':')
                    return t[:i]
            return None
        m = re.match(r'^([A-Z][^:]{1,118}):(?: |$)', plain)
        return m.group(1) if m and (self.gap or self.top or self.block is None or self.block.kind == 'heading') else None

    # ---- tables
    def open_table(self, mode, header, ln, printed):
        self.close_table()
        self.mode = mode
        self.table_gap = False
        self.furniture_lines.add(ln)
        if mode == 'tableC':
            self.table = {'kind': mode, 'rows': [], 'header': ['Policy theme', 'National decision-making policy', 'Information requirement (where applicable under the policies listed)'], 'cols': None, 'hdr_lines': 1, 'lines': [ln], 'page': printed}
            self.table['cols'] = (header.index('National'), header.index('Information'))
        elif mode == 'tableE':
            self.table = {'kind': mode, 'rows': [], 'header': re.split(r'\s{2,}', header.strip()), 'cols': (header.index('Illustrative'),), 'lines': [ln], 'page': printed}
        elif mode == 'tableF1':
            self.table = {'kind': mode, 'rows': [], 'header': ['Flood Zone', 'Definition'], 'cols': (header.index('Definition'),), 'lines': [ln], 'page': printed}
        elif mode == 'tableF3':
            self.table = {'kind': mode, 'rows': [], 'header': None, 'starts': None, 'hdr': [], 'caption': 'Flood Risk Vulnerability Classification', 'lines': [ln], 'page': printed}
        self.table_block = self.push(Block('table', None, table=self.table), ln, printed)

    def close_table(self):
        if self.table is not None:
            t = self.table
            if t['kind'] == 'tableC' and len(t['rows']) != 18:
                raise ParseError(f'Annex C table: {len(t["rows"])} rows, expected 18')
            if t['kind'] == 'tableE' and len(t['rows']) != 3:
                raise ParseError(f'Annex E table on page {t["page"]}: {len(t["rows"])} rows, expected 3')
            if t['kind'] == 'tableF1' and len(t['rows']) != 4:
                raise ParseError(f'Annex F table 1: {len(t["rows"])} rows, expected 4')
            if t['kind'] == 'tableF3':
                self.finish_f3(t)
        self.table = None
        if self.mode in ('tableC', 'tableE', 'tableF1', 'tableF3'):
            self.mode = None

    def table_line(self, printed, ln, s, indent, t):
        """Returns True when the line was consumed by the open table."""
        tb = self.table
        kind = tb['kind']
        if self.top and indent == 0 and (re.match(r'^Annex [A-F]: ', t) or re.match(r'^\d{1,2}\. [A-Z]', t) and not tb['rows']):
            self.close_table()
            return False
        if kind == 'tableC':
            if t.startswith('Policy theme') and 'National decision-' in t:
                tb['cols'] = (s.index('National'), s.index('Information'))
                tb['hdr_lines'] = 2
                self.furniture_lines.add(ln)
                return True
            if tb['hdr_lines'] in (1, 2) and t.startswith('making policy'):
                tb['hdr_lines'] = 0
                self.furniture_lines.add(ln)
                return True
            c2, c3 = (word_start(s, c) for c in tb['cols'])
            a, b, c = s[:c2].strip(), s[c2:c3].strip(), s[c3:].strip()
            self.table_lines.add(ln)
            self.table_segments[ln] = [a, b, c]
            tb['lines'].append(ln)
            if POLICY_RE.match(b):
                tb['rows'].append([a, b, [c] if c else []])
                return True
            row = tb['rows'][-1]
            if a:
                row[0] = join(row[0], a)
            if b:
                row[1] = join(row[1], b)
            if c:
                if c.startswith('•'):
                    row[2].append(c)
                elif row[2]:
                    row[2][-1] = join(row[2][-1], c)
                else:
                    row[2].append(c)
            return True
        if kind == 'tableE':
            if re.match(r'^Contribution\s+Illustrative [Ff]eatures$', t):
                tb['cols'] = (s.index('Illustrative'),)
                self.furniture_lines.add(ln)
                return True
            c2 = tb['cols'][0]
            a, b = s[:c2].strip(), s[c2:].strip()
            if a and a not in ('Strong', 'Moderate', 'Weak or', 'None'):
                self.close_table()
                return False
            self.table_lines.add(ln)
            self.table_segments[ln] = [a, b]
            tb['lines'].append(ln)
            if a in ('Strong', 'Moderate', 'Weak or'):
                tb['rows'].append([a, [b] if b else []])
                return True
            row = tb['rows'][-1]
            if a == 'None':
                row[0] = join(row[0], a)
            if b:
                if b.startswith('•'):
                    row[1].append(b)
                elif row[1]:
                    row[1][-1] = join(row[1][-1], b)
                else:
                    row[1].append(b)
            return True
        if kind == 'tableF1':
            c2 = tb['cols'][0]
            a, b = s[:c2].strip(), s[c2:].strip()
            if a and not a.startswith('Zone') and b:
                self.close_table()
                return False
            self.table_lines.add(ln)
            self.table_segments[ln] = [a, b]
            tb['lines'].append(ln)
            if a.startswith('Zone'):
                tb['rows'].append([a, [b] if b else []])
                self.table_gap = False
                return True
            row = tb['rows'][-1]
            if a:
                row[0] = join(row[0], a)
            if b:
                if b.startswith('•') or self.table_gap:
                    row[1].append(b)
                elif row[1]:
                    row[1][-1] = join(row[1][-1], b)
                else:
                    row[1].append(b)
            self.table_gap = False
            return True
        if kind == 'tableF3':
            if t == 'zones':
                self.furniture_lines.add(ln)
                return True
            if tb['starts'] is None:
                words = [(m.start(), m.group(0)) for m in re.finditer(r'\S+', s)]
                if words and words[0][1] in ('Essential', 'Highly'):
                    tb['hdr'].append([w for _, w in words])
                    tb['starts'] = [p for p, _ in words]
                    self.furniture_lines.add(ln)
                    return True
            if tb['starts'] is not None and not tb['rows'] and not t.startswith('Zone') and indent > 0 and len(tb['hdr']) == 1:
                words = [(m.start(), m.group(0)) for m in re.finditer(r'\S+', s)]
                tb['hdr'].append([w for _, w in words])
                tb['starts'] = [p for p, _ in words]   # the second header line is the better anchor
                self.furniture_lines.add(ln)
                return True
            if t == 'Key:':
                self.close_table()
                return False
            self.table_lines.add(ln)
            tb['lines'].append(ln)
            toks = [(m.start(), m.group(0)) for m in re.finditer(r'\S+(?: \S+)*', s)]
            self.table_segments[ln] = [w for _, w in toks]
            first = tb['starts'][0]
            if t.startswith('Zone'):
                tb['rows'].append([''] + [''] * len(tb['starts']))
            row = tb['rows'][-1]
            for pos, tok in toks:
                if pos < first - 2:
                    row[0] = join(row[0], tok)
                    continue
                centre = pos + len(tok) / 2
                k = min(range(len(tb['starts'])), key=lambda i: abs(tb['starts'][i] + 5 - centre))
                row[k + 1] = join(row[k + 1], tok)
            return True
        return False

    def finish_f3(self, t):
        names = [' '.join(x) for x in zip(*t['hdr'])] if len(t['hdr']) == 2 else t['hdr'][0]
        t['header'] = ['Flood zones'] + names
        expect = [
            ['Zone 1', '✓', '✓', '✓', '✓', '✓'],
            ['Zone 2', '✓', 'Exception test required', '✓', '✓', '✓'],
            ['Zone 3a †', 'Exception test required †', 'X', 'Exception test required', '✓', '✓'],
            ['Zone 3b *', 'Exception test required *', 'X', 'X', 'X', '✓*'],
        ]
        if t['rows'] != expect:
            raise ParseError(f'Annex F table 3 grid differs from the pinned literal: {t["rows"]}')


def p_len(page):
    return page.count('\n') + 1


def word_start(s, c):
    """Column cut c, moved back to the start of the word it would otherwise split."""
    if c < len(s) and s[c] != ' ' and c > 0 and s[c - 1] != ' ':
        while c > 0 and s[c - 1] != ' ':
            c -= 1
    return c


# ----------------------------------------------------------------------------------------------------------------
# GOV.UK HTML (cross-check oracle)

def html_parts():
    """{part key: path} for every GOV.UK chapter/annex page held in guidance-ogl."""
    out = {}
    for p in glob.glob(os.path.join(OGL, '*mhclg-nppf-ch*.html')) + glob.glob(os.path.join(OGL, '*mhclg-nppf-annex-*.html')):
        b = os.path.basename(p)
        m = re.search(r'mhclg-nppf-ch(\d+)-', b) or re.search(r'mhclg-nppf-annex-([a-f])-', b)
        if m:
            key = f'ch{int(m.group(1))}' if m.group(1).isdigit() else f'annex{m.group(1).upper()}'
            out[key] = p
    return out


def govspeak(h):
    """The main content of a GOV.UK page (the govspeak div), by tag depth."""
    i = h.find('<div class="govspeak">')
    if i < 0:
        return ''
    depth = 0
    for m in re.finditer(r'<(/?)div\b[^>]*>', h[i:]):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return h[i:i + m.end()]
    return h[i:]


def tag_text(frag):
    frag = re.sub(r'<li[^>]*>', ' • ', frag)
    frag = re.sub(r'<br\s*/?>', ' ', frag)
    return ' '.join(htmllib.unescape(re.sub(r'<[^>]+>', '', frag)).replace('\u21a9', '').split())


def parse_html(path):
    h = open(path, encoding='utf-8').read()
    g = govspeak(h)
    out = {'headings': [], 'paras': [], 'footnotes': {}, 'tables': [], 'objective': None}
    for m in re.finditer(r'<h([23])[^>]*?(?:id="([^"]*)")?[^>]*>(.*?)</h\1>', g, re.S):
        out['headings'].append((int(m.group(1)), m.group(2), tag_text(m.group(3))))
    notice = re.search(r'<div[^>]*class="application-notice[^"]*"[^>]*>(.*?)</div>', g, re.S)
    if notice:
        out['objective'] = tag_text(notice.group(1))
    g2 = g if not notice else g.replace(notice.group(0), '')
    g3 = re.sub(r'<table[^>]*>.*?</table>', '', g2, flags=re.S)
    for m in re.finditer(r'<p(?:\s+id="footnote(\d+)")?[^>]*>(.*?)</p>|<li[^>]*>(.*?)</li>', g3, re.S):
        if m.group(3) is not None:
            txt = '• ' + tag_text(m.group(3))
            out['paras'].append(txt)
            continue
        txt = tag_text(m.group(2))
        if m.group(1):
            txt = re.sub(r'^\d+\.\s*', '', txt).replace('\u21a9', '').strip()
            out['footnotes'][int(m.group(1))] = txt
        elif txt and not txt.startswith('Return to the'):
            out['paras'].append(txt)
    for tm in re.finditer(r'<table[^>]*>(.*?)</table>', g2, re.S):
        rows = []
        for rm in re.finditer(r'<tr[^>]*>(.*?)</tr>', tm.group(1), re.S):
            rows.append([tag_text(c) for c in re.findall(r'<t[hd][^>]*>(.*?)</t[hd]>', rm.group(1), re.S)])
        out['tables'].append(rows)
    return out


def glossary_terms_from_html(path):
    g = govspeak(open(path, encoding='utf-8').read())
    terms = []
    for m in re.finditer(r'<p><strong>(.*?)</strong>', g, re.S):
        t = tag_text(m.group(1))
        t = re.sub(r'\s*\[footnote \d+\]', '', t)
        if t.endswith(':'):
            terms.append(t[:-1])
    return terms


# ----------------------------------------------------------------------------------------------------------------
# Rendering

def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')


def cell(paras):
    """Table cell: paragraphs joined with <br>, bullets kept as '• ' items."""
    return '<br>'.join(p.replace('|', '\\|') for p in paras)


class Renderer:
    def __init__(self, parser, meta):
        self.p = parser
        self.meta = meta
        self.out = []
        self.anchors = {}     # anchor id -> md line (1-based)
        self.structure = []

    def emit(self, s=''):
        self.out.append(s)

    def page_comment(self, block):
        ps = getattr(block, 'page_start', None)
        if ps is not None:
            self.emit(f'<!-- p.{ps} -->')
            self.emit()

    def run(self):
        p, meta = self.p, self.meta
        self.emit('---')
        for k, v in meta.items():
            self.emit(f'{k}: {v}')
        self.emit('---')
        self.emit()
        self.emit('# National Planning Policy Framework')
        self.emit()
        self.emit('*Plan-making and national decision-making policies. August 2026.*')
        self.emit()
        self.emit('Markdown edition of the Framework, generated from the text of the published PDF. Policy codes and paragraphs carry anchors '
                  '(`#S5`, `#S5-1`, `#S5-1-j-i`; `#AnnexB-settlement` for glossary terms). `<!-- p.N -->` marks the start of printed page N. '
                  'Footnote markers are rendered as `[^N]` and collected at the end. The text is otherwise verbatim; see README.md for what was changed and how it is checked.')
        self.emit()
        self.emit('## Front matter')
        self.emit()
        for text, _ in p.front:
            self.emit(text)
            self.emit()
        self.emit('## Contents')
        self.emit()
        for e in p.contents:
            if e['group']:
                self.emit()
                self.emit(f'**{e["group"]}**')
                self.emit()
            part = next((x for x in p.parts if x.kind == e['kind'] and x.num == e['num']), None)
            codes = f' ({e["codes"][0]}–{e["codes"][-1]})' if e['codes'] else ''
            label = f'{e["num"]}. {e["title"]}' if e['kind'] == 'chapter' else f'Annex {e["num"]}: {e["title"]}'
            self.emit(f'- [{label}](#{part.anchor if part else slug(label)}){codes} (p. {e["page"]})')
        self.emit()
        self.emit('- [Footnotes](#footnotes)')
        self.emit()
        for part in p.parts:
            self.render_part(part)
        self.emit('## Footnotes')
        self.emit()
        for n in sorted(p.footnotes):
            fn = p.footnotes[n]
            self.emit(f'[^{n}]: {fn["paras"][0]}')
            for extra in fn['paras'][1:]:
                self.emit(f'    {extra}')
            self.emit()
        self.emit('---')
        self.emit()
        self.emit('Contains public sector information licensed under the Open Government Licence v3.0. © Crown copyright 2026.')
        self.emit()
        return '\n'.join(self.out)

    def render_part(self, part):
        p = self.p
        policy = None
        para = None
        letter = None
        for b in part.blocks:
            k = b.kind
            if k == 'heading':
                self.page_comment(b)
                self.anchors[part.anchor] = len(self.out) + 1
                self.emit(f'## <a id="{part.anchor}"></a>{part.heading}')
                self.emit()
                self.structure.append({'kind': part.kind, 'key': part.key, 'title': part.title, 'page': part.page, 'md_line': len(self.out) - 1, 'txt_line': b.lines[0], 'anchor': part.anchor})
                continue
            self.page_comment(b)
            if k == 'objective':
                self.emit(f'> {b.text}')
                self.emit()
            elif k == 'group':
                self.emit(f'### {b.text}')
                self.emit()
            elif k == 'subheading':
                self.emit(f'### {b.text}')
                self.emit()
            elif k == 'caps':
                self.emit(f'**{b.text}**')
                self.emit()
            elif k == 'policy':
                policy, para, letter = b.code, None, None
                self.anchors[b.code] = len(self.out) + 1
                self.emit(f'#### <a id="{b.code}"></a>{b.code}: {b.title}')
                self.emit()
                self.structure.append({'kind': 'policy', 'code': b.code, 'title': b.title, 'part': part.key, 'page': b.page, 'md_line': len(self.out) - 1, 'txt_line': b.lines[0], 'anchor': b.code})
            elif k == 'para':
                base = policy or ('Intro' if part.kind == 'chapter' and part.num == 1 else part.anchor)
                aid = f'{base}-{b.num}'
                para, letter = aid, None
                self.anchors[aid] = len(self.out) + 1
                self.emit(f'{b.num}. <a id="{aid}"></a>{b.paras[0]}')
                for extra in b.paras[1:]:
                    self.emit()
                    self.emit(f'   {extra}')
                self.emit()
                self.structure.append({'kind': 'para', 'code': f'{base}({b.num})' if policy else aid, 'part': part.key, 'page': b.page, 'md_line': len(self.out) - len(b.paras) * 2 + 1 if len(b.paras) > 1 else len(self.out) - 1, 'txt_line': b.lines[0], 'anchor': aid})
            elif k == 'letter':
                base = para or policy or part.anchor
                aid = f'{base}-{b.label}'
                letter = aid
                self.anchors[aid] = len(self.out) + 1
                self.emit(f'   {b.label}. <a id="{aid}"></a>{b.paras[0]}')
                for extra in b.paras[1:]:
                    self.emit()
                    self.emit(f'   {extra}')
                self.emit()
                self.structure.append({'kind': 'letter', 'code': aid.replace('-', '(', 1).replace('-', ')(') + ')' if policy else aid, 'part': part.key, 'page': b.page, 'md_line': len(self.out) - 1, 'txt_line': b.lines[0], 'anchor': aid})
            elif k == 'roman':
                base = letter or para or policy or part.anchor
                aid = f'{base}-{b.label}'
                self.anchors[aid] = len(self.out) + 1
                self.emit(f'      {b.label}. <a id="{aid}"></a>{b.paras[0]}')
                for extra in b.paras[1:]:
                    self.emit()
                    self.emit(f'      {extra}')
                self.emit()
                self.structure.append({'kind': 'roman', 'code': aid.replace('-', '(', 1).replace('-', ')(') + ')' if policy else aid, 'part': part.key, 'page': b.page, 'md_line': len(self.out) - 1, 'txt_line': b.lines[0], 'anchor': aid})
            elif k == 'bullet':
                ind = '   ' if para else ''
                self.emit(f'{ind}• {b.paras[0]}')
                for extra in b.paras[1:]:
                    self.emit()
                    self.emit(f'{ind}{extra}')
                self.emit()
            elif k == 'term':
                aid = f'AnnexB-{slug(b.term)}'
                self.anchors[aid] = len(self.out) + 1
                self.emit(f'<a id="{aid}"></a>**{b.term_raw}:** {b.paras[0]}'.rstrip())
                for extra in b.paras[1:]:
                    self.emit()
                    self.emit(extra)
                self.emit()
                self.structure.append({'kind': 'term', 'code': f'AnnexB:{slug(b.term)}', 'title': b.term, 'part': part.key, 'md_line': len(self.out) - 1, 'page': b.page, 'txt_line': b.lines[0], 'anchor': aid})
                para, letter = aid, None
            elif k == 'text':
                self.emit(b.paras[0])
                for extra in b.paras[1:]:
                    self.emit()
                    self.emit(extra)
                self.emit()
            elif k == 'table':
                self.render_table(b.table)
            else:
                raise ParseError(f'unknown block kind {k}')

    def render_table(self, t):
        if t['kind'] == 'tableF3':
            self.emit(t['caption'])
            self.emit()
        hdr = t['header']
        self.emit('| ' + ' | '.join(hdr) + ' |')
        self.emit('|' + ' --- |' * len(hdr))
        for row in t['rows']:
            cells = [cell(c) if isinstance(c, list) else c for c in row]
            self.emit('| ' + ' | '.join(cells) + ' |')
        self.emit()


# ----------------------------------------------------------------------------------------------------------------
# Build

def sha256(path):
    return hashlib.sha256(open(path, 'rb').read()).hexdigest()


def md5(path):
    return hashlib.md5(open(path, 'rb').read()).hexdigest()


def build_all(txt=None):
    txt = txt if txt is not None else open(NPPF_TXT, encoding='utf-8').read()
    parts = html_parts()
    terms = glossary_terms_from_html(parts['annexB']) if 'annexB' in parts else None
    parser = Parser(txt, terms).run()
    meta = {
        'title': 'National Planning Policy Framework (August 2026)',
        'source_url': SOURCE_URL,
        'asset_url': ASSET_URL,
        'asset_id': ASSET_ID,
        'pdf': os.path.basename(NPPF_PDF),
        'pdf_bytes': os.path.getsize(NPPF_PDF),
        'pdf_md5': md5(NPPF_PDF),
        'pdf_sha256': sha256(NPPF_PDF),
        'text': os.path.basename(NPPF_TXT),
        'text_sha256': sha256(NPPF_TXT),
        'extracted_with': EXTRACTED_WITH,
        'generated_by': 'tools/nppf_md.py build',
        'licence': 'Open Government Licence v3.0; Crown copyright 2026',
        'policy_codes': sum(1 for p in parser.parts for b in p.blocks if b.kind == 'policy'),
        'footnotes': len(parser.footnotes),
    }
    renderer = Renderer(parser, meta)
    md = renderer.run()
    return parser, renderer, md


def structure_json(parser, renderer):
    return {
        'generated_by': 'tools/nppf_md.py build',
        'source': os.path.basename(NPPF_TXT),
        'parts': [{'kind': p.kind, 'key': p.key, 'num': p.num, 'title': p.title, 'page': p.page, 'anchor': p.anchor,
                   'policies': [{'code': b.code, 'title': b.title, 'page': b.page} for b in p.blocks if b.kind == 'policy']} for p in parser.parts],
        'entries': renderer.structure,
        'footnotes': {n: {'page': fn['page'], 'marker_page': parser.marker_pages.get(n), 'txt_line': fn['lines'][0]} for n, fn in parser.footnotes.items()},
        'markers': parser.report['markers'],
        'page_joins': parser.report['page_joins'],
        'wrapped_headings': parser.report['wrapped_headings'],
    }


def cmd_build(args):
    parser, renderer, md = build_all()
    open(NPPF_MD, 'w', encoding='utf-8').write(md)
    json.dump(structure_json(parser, renderer), open(STRUCT_PATH, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    open(STRUCT_PATH, 'a').write('\n')
    results = run_checks(parser, renderer, md, strict=False)
    open(README_PATH, 'w', encoding='utf-8').write(readme(parser, renderer, md, results))
    fails = [r for r in results if not r['ok']]
    print(f'wrote {os.path.relpath(NPPF_MD, ROOT)} ({len(md.encode()) // 1024} KB), {os.path.relpath(STRUCT_PATH, ROOT)}, {os.path.relpath(README_PATH, ROOT)}')
    for r in results:
        print(('ok   ' if r['ok'] else 'FAIL ') + r['name'] + (': ' + r['detail'] if r['detail'] else ''))
    return 1 if fails else 0


# ----------------------------------------------------------------------------------------------------------------
# Checks

def md_body(md):
    """The Markdown without its YAML block."""
    m = re.match(r'^---\n.*?\n---\n', md, re.S)
    return md[m.end():] if m else md


def quote_sets():
    """Every NPPF quotation the site already verifies against the text: [(where, quote)]."""
    out = []
    qc = os.path.join(GUIDANCE, 'quotes-check.json')
    if os.path.exists(qc):
        for slug_, r in json.load(open(qc, encoding='utf-8')).items():
            if not re.match(r'^(b0-)?mhclg-nppf-(pdf|ch\d+|annex-[a-f])', slug_):
                continue
            for q, ok in r['summary'] + [x for p in r['positions'] for x in p['quotes']]:
                if ok:
                    out.append((f'guidance corpus {slug_}', q))
    pol = os.path.join(ROOT, 'pages', 'england', 'nppf-navigator', 'graph', 'policies.ts')
    if os.path.exists(pol):
        for m in re.finditer(r"text: '((?:[^'\\]|\\.)*)'", open(pol, encoding='utf-8').read()):
            out.append(('navigator graph/policies.ts', m.group(1).replace("\\'", "'")))
    sq = os.path.join(ROOT, 'pages', 'authority', 'stratford-dc', 'nppf-decisions', 'build', 'quotes.json')
    if os.path.exists(sq):
        for r in json.load(open(sq, encoding='utf-8')):
            if r.get('src') == 'nppf':
                out.append((f'stratford note {r.get("id")}', r['q']))
    files = ['pages/england/dp3-design/build.mjs', 'pages/authority/stratford-dc/core-strategy-weight/build.mjs',
             'pages/settlement/claverdon/neighbourhood-plan-weight/build.mjs', 'pages/england/sustainable-location/factors/build.mjs',
             'pages/england/sustainable-location/factors/register.mjs', 'pages/england/sustainable-location/build.mjs',
             'pages/settlement/claverdon/kington-lane-decision-route/evidence.mjs']
    for f in files:
        p = os.path.join(ROOT, f)
        if not os.path.exists(p):
            continue
        src = open(p, encoding='utf-8').read()
        for m in re.finditer(r"(?:quote|check)\('nppf',\s*'((?:[^'\\]|\\.)*)'", src):
            out.append((f, m.group(1).replace("\\'", "'")))
        for m in re.finditer(r"q\('nppf-2026',\s*'((?:[^'\\]|\\.)*)'", src):
            out.append((f, m.group(1).replace("\\'", "'")))
        for m in re.finditer(r"doc: 'nppf'[^\n]*?text: '((?:[^'\\]|\\.)*)'", src):
            out.append((f, m.group(1).replace("\\'", "'")))
    return out


def run_checks(parser, renderer, md, strict=True):
    """Every check as {'name', 'ok', 'detail', 'items'}; strict=False keeps going and records failures."""
    res = []
    body = md_body(md)
    hay = norm_md(body)
    txt_lines = parser.txt.split('\n')

    # (a) policy codes
    codes = [b.code for p in parser.parts for b in p.blocks if b.kind == 'policy']
    ok = codes == parser.expected_codes
    res.append({'name': f'(a) {len(codes)} policy headings match the Contents ranges in order', 'ok': ok, 'detail': '' if ok else f'missing {sorted(set(parser.expected_codes) - set(codes))}, extra {sorted(set(codes) - set(parser.expected_codes))}', 'items': []})
    pages_ok = []
    for p in parser.parts:
        e = parser.contents_entry(p.kind, p.num)
        if e and e['page'] != p.page:
            pages_ok.append(f'{p.heading}: p.{p.page} vs contents p.{e["page"]}')
    res.append({'name': 'chapter and annex headings sit on their Contents page', 'ok': not pages_ok, 'detail': '; '.join(pages_ok), 'items': pages_ok})

    # (b) round-trip coverage
    misses = []
    checked = 0
    for i, raw in enumerate(txt_lines, start=1):
        s = raw.replace('\f', '').strip()
        if not s or i in parser.furniture_lines:
            continue
        if i in parser.table_lines:
            segs = [x for x in parser.table_segments.get(i, re.split(r'\s{2,}', s)) if x.strip()]
        else:
            segs = [s]
        for seg in segs:
            seg = re.sub(r'^\d{1,3}(?=[A-Z\s])\s*', '', seg) if any(i in fn['lines'][:1] for fn in parser.footnotes.values()) else seg
            n = norm_md(defused_line(parser, i, seg))
            if not n:
                continue
            checked += 1
            if n not in hay:
                misses.append(f'{i}: {seg[:80]}')
    res.append({'name': f'(b) every text line is in the Markdown ({checked} lines/segments)', 'ok': not misses, 'detail': f'{len(misses)} missing' + (': ' + misses[0] if misses else ''), 'items': misses})

    # (c) existing quotations
    qmiss = []
    qs = quote_sets()
    hay_q = unmark(hay)
    for where, q in qs:
        if not found(q, hay_q):
            qmiss.append(f'{where}: {q[:90]}')
    res.append({'name': f'(c) {len(qs)} quotations the site verifies against the text are in the Markdown', 'ok': not qmiss, 'detail': f'{len(qmiss)} missing' + (': ' + qmiss[0] if qmiss else ''), 'items': qmiss})

    # (d) footnotes
    ns = sorted(parser.footnotes)
    probs = []
    if ns != list(range(1, len(ns) + 1)):
        probs.append(f'definitions not contiguous: {ns[:5]}...')
    markers = sorted(parser.marker_pages)
    if markers != ns:
        probs.append(f'markers {len(markers)} vs definitions {len(ns)}')
    for n in ns:
        if parser.marker_pages.get(n) != parser.footnotes[n]['page']:
            probs.append(f'fn {n}: marker on p.{parser.marker_pages.get(n)}, definition on p.{parser.footnotes[n]["page"]}')
    exc = {m['n']: m['rule'] for m in parser.report['markers'] if m['rule'] != 'fused'}
    if exc != MARKER_EXCEPTIONS:
        probs.append(f'marker exceptions used {exc} vs pinned {MARKER_EXCEPTIONS}')
    body_markers = sorted(int(x) for x in re.findall(r'\[\^(\d+)\]', re.sub(r'(?m)^\[\^\d+\]:.*$', '', body)))
    if body_markers != ns:
        probs.append(f'markers in the Markdown body {len(body_markers)} vs {len(ns)}')
    res.append({'name': f'(d) {len(ns)} footnotes: contiguous, one marker each, on the definition page', 'ok': not probs, 'detail': '; '.join(probs[:3]), 'items': probs})

    # (e) code list
    expected_list = code_list_lines(parser)
    diff = codes_diff(expected_list)
    res.append({'name': f'(e) data/decisions/nppf-2026-policy-codes.md lists all {len(expected_list)} codes with full titles', 'ok': not diff, 'detail': f'{len(diff)} difference(s)' + (': ' + diff[0] if diff else '') + ' (run: nppf_md.py codes --write)' if diff else '', 'items': diff})

    # (f) structure sanity
    sp = []
    objectives = sum(1 for p in parser.parts for b in p.blocks if b.kind == 'objective')
    if objectives != 19:
        sp.append(f'{objectives} objective boxes, expected 19')
    terms = [b for p in parser.parts for b in p.blocks if b.kind == 'term']
    if parser.glossary_terms is not None and len(terms) != len(parser.glossary_terms):
        got = {b.term for b in terms}
        sp.append(f'{len(terms)} glossary entries vs {len(parser.glossary_terms)} terms in the GOV.UK page; missing {sorted(set(parser.glossary_terms) - got)[:5]}')
    heur = Parser(parser.txt, None)
    try:
        heur.run()
        hterms = [b.term for p in heur.parts for b in p.blocks if b.kind == 'term']
        hterms = [re.sub(r'\[\^\d+\]', '', x) for x in hterms]
        if hterms != [b.term for b in terms]:
            sp.append(f'glossary heuristic without HTML finds {len(hterms)} entries vs {len(terms)} with the HTML term list')
    except ParseError as e:
        sp.append(f'glossary heuristic parse failed: {e}')
    if parser.meta_md5 != md5(NPPF_PDF) if hasattr(parser, 'meta_md5') else False:
        sp.append('pdf_md5 in the Markdown differs from the PDF on disk')
    m = re.search(r'^pdf_md5: (\w+)$', md, re.M)
    if m and m.group(1) != md5(NPPF_PDF):
        sp.append('pdf_md5 in the Markdown differs from the PDF on disk')
    tables = [b.table for p in parser.parts for b in p.blocks if b.kind == 'table']
    kinds = [t['kind'] for t in tables]
    if kinds != ['tableC', 'tableE', 'tableE', 'tableE', 'tableF1', 'tableF3']:
        sp.append(f'tables found: {kinds}')
    res.append({'name': '(f) structure: 19 objective boxes, glossary entries agree with GOV.UK, six tables, PDF hash', 'ok': not sp, 'detail': '; '.join(sp[:3]), 'items': sp})

    # (g) GOV.UK HTML cross-check
    res.extend(html_checks(parser, renderer, body))
    return res


def defused_line(parser, i, seg):
    """The text line as it reads after marker replacement, so norm_md strips the '[^n]' as it does in the Markdown."""
    d = parser.defused.get(i)
    if d is None or i in parser.table_lines:
        return seg
    return d.strip()


def fn_equiv(pdf, html):
    """Footnote texts agree once the PDF's printed link text and URLs are discounted (the HTML carries hyperlinks instead)."""
    def clean(s):
        s = canon(norm(s))
        s = re.sub(r'https?://\S+', '', s)
        s = s.replace(' - gov.uk', '').replace('()', '')
        for m in re.findall(r'\(([^()]+)\)', s):   # "(Town and Country Planning Act 1990)" printed after the same words
            if m in s.replace(f'({m})', ''):
                s = s.replace(f' ({m})', '')
        s = re.sub(r'\s*\|[^.,;)]*', '', s)
        return re.sub(r'\s+', ' ', s).strip(' .:,')
    a, b = clean(pdf), clean(html)
    return a == b or (b and b in a) or (a and a in b)


def html_checks(parser, renderer, body):
    res = []
    parts = html_parts()
    nbody = norm_md(body)
    nbody_h = canon(nbody)
    part_text = {}
    part_paras = {}
    md_lines = body.split('\n')
    # md text per part: between this part's heading line and the next
    offs = [(e['md_line'], e['key']) for e in renderer.structure if e['kind'] in ('chapter', 'annex')]
    yaml_len = len(renderer.out) - len(md_lines)
    fn_start = next(i for i, l in enumerate(renderer.out) if l == '## Footnotes')
    for k, (ln, key) in enumerate(offs):
        end = offs[k + 1][0] if k + 1 < len(offs) else fn_start + 1
        chunk = renderer.out[ln:end - 1]
        part_text[key] = norm_md('\n'.join(chunk))
        paras = []
        for l in chunk:
            n = norm_md(l)
            if n and not l.startswith(('#', '<!--', '|')) and len(n.split()) >= 4:
                paras.append((n, l))
        part_paras[key] = paras
    missing_html, missing_md, fn_diff, ctx_diff, title_diff = [], [], [], [], []
    covered = []
    for key, path in sorted(parts.items()):
        if key not in part_text:
            continue
        covered.append(key)
        h = parse_html(path)
        ptxt = part_text[key]
        for lvl, hid, text in h['headings']:
            m = POLICY_RE.match(text)
            if m:
                b = next((b for p in parser.parts for b in p.blocks if b.kind == 'policy' and b.code == m.group(1)), None)
                if b and norm(b.title) != norm(m.group(2)):
                    title_diff.append(f'{m.group(1)}: pdf {b.title!r} vs html {m.group(2)!r}')
        ptxt_h = canon(ptxt)
        if h['objective']:
            n = canon(norm(re.sub(r'\s*\[footnote \d+\]', '', h['objective'])))
            if n not in ptxt_h and not any(re.search(rx, n) for rx in HTML_ONLY):
                missing_html.append(f'{key} objective: {n[:80]}')
        for para in h['paras']:
            n = canon(norm(re.sub(r'\s*\[footnote \d+\]', '', para)))
            if len(n.split()) < 3:
                continue
            if n.startswith('• ') and n[2:] in ptxt_h:
                continue
            if n not in ptxt_h and n not in nbody_h and not any(re.search(rx, n) for rx in HTML_ONLY):
                missing_html.append(f'{key}: {n[:100]}')
            for m in re.finditer(r'\[footnote (\d+)\]', para):
                fnum = int(m.group(1))
                before = norm(para[:m.start()])[-25:]
                mm = re.search(rf'\[\^{fnum}\](?!:)', body)
                if mm:
                    line_start = body.rfind('\n', 0, mm.start()) + 1
                    mb = norm(strip_md(body[line_start:mm.start()]))[-25:]
                    if before.rstrip('. ,;:') and mb.rstrip('. ,;:') and before != mb:
                        ctx_diff.append(f'fn {fnum}: html …{before!r} vs md …{mb!r}')
        htxt = canon(norm(' '.join(re.sub(r'\s*\[footnote \d+\]', '', x) for x in h['paras'] + [x[2:] for x in h['paras'] if x.startswith('• ')] + ([h['objective']] if h['objective'] else []) + [c for t in h['tables'] for r in t for c in r])))
        for n, l in part_paras[key]:
            if canon(n) not in htxt and canon(re.sub(r'^\d{1,2}\. ', '', n)) not in htxt:   # GOV.UK lists M1(1) as a bullet without its number
                missing_md.append(f'{key}: {n[:100]}')
        for fnum, text in h['footnotes'].items():
            mine = parser.footnotes.get(fnum)
            if not mine:
                fn_diff.append(f'fn {fnum}: in html part {key} but not in the text')
            elif not fn_equiv(' '.join(mine['paras']), text) and fnum not in FOOTNOTE_WORDING_DIFFS:
                fn_diff.append(f'fn {fnum}: pdf {" ".join(mine["paras"])[:60]!r} vs html {text[:60]!r}')
            elif fn_equiv(' '.join(mine['paras']), text) and fnum in FOOTNOTE_WORDING_DIFFS:
                fn_diff.append(f'fn {fnum}: pinned as differing but now equivalent; remove it from FOOTNOTE_WORDING_DIFFS')
    res.append({'name': f'(g) GOV.UK HTML cross-check covers {len(covered)} of 26 parts', 'ok': len(covered) == 26, 'detail': 'missing ' + ', '.join(k for k in part_text if k not in parts) if len(covered) < 26 else '', 'items': [k for k in part_text if k not in parts]})
    res.append({'name': '(g) every GOV.UK paragraph is in the Markdown (known wording differences excepted)', 'ok': not missing_html, 'detail': f'{len(missing_html)} missing' + (': ' + missing_html[0] if missing_html else ''), 'items': missing_html})
    res.append({'name': '(g) every Markdown paragraph is in the GOV.UK page (known wording differences excepted)', 'ok': not missing_md, 'detail': f'{len(missing_md)} missing' + (': ' + missing_md[0] if missing_md else ''), 'items': missing_md})
    res.append({'name': '(g) policy titles agree with GOV.UK', 'ok': not title_diff, 'detail': '; '.join(title_diff[:2]), 'items': title_diff})
    res.append({'name': '(g) footnote texts agree with GOV.UK', 'ok': not fn_diff, 'detail': f'{len(fn_diff)} differ' + (': ' + fn_diff[0] if fn_diff else ''), 'items': fn_diff})
    res.append({'name': '(g) footnote markers sit after the same words as in GOV.UK', 'ok': not ctx_diff, 'detail': f'{len(ctx_diff)} differ' + (': ' + ctx_diff[0] if ctx_diff else ''), 'items': ctx_diff})
    return res


def cmd_check(args):
    if not os.path.exists(NPPF_MD):
        sys.exit(f'{NPPF_MD} missing: run build first')
    parser, renderer, md = build_all()
    committed = open(NPPF_MD, encoding='utf-8').read()
    results = run_checks(parser, renderer, md, strict=False)
    same = committed == md
    results.insert(0, {'name': 'committed Markdown is what build produces (run build and commit if not)', 'ok': same, 'detail': '', 'items': []})
    bad = 0
    for r in results:
        print(('ok   ' if r['ok'] else 'FAIL ') + r['name'] + (': ' + r['detail'] if r['detail'] else ''))
        if not r['ok']:
            bad += 1
            for it in r['items'][:args.show]:
                print('       ' + str(it))
    print(f'{len(results) - bad} of {len(results)} checks passed')
    return 1 if bad else 0


# ----------------------------------------------------------------------------------------------------------------
# Code list

def code_list_lines(parser):
    return [f'- {b.code}: {b.title}' for p in parser.parts for b in p.blocks if b.kind == 'policy']


def codes_block(text):
    """(start, end) line indexes of the bullet block in nppf-2026-policy-codes.md: from '- PM1:' to the line before '- Annex B ('."""
    lines = text.split('\n')
    start = next(i for i, l in enumerate(lines) if l.startswith('- PM1:'))
    end = next(i for i, l in enumerate(lines) if l.startswith('- Annex B ('))
    return lines, start, end


def codes_diff(expected):
    if not os.path.exists(CODES_PATH):
        return ['file missing']
    lines, s, e = codes_block(open(CODES_PATH, encoding='utf-8').read())
    have = [l for l in lines[s:e] if l.startswith('- ')]
    diff = []
    hv = {l.split(':')[0]: l for l in have}
    for l in expected:
        c = l.split(':')[0]
        if c not in hv:
            diff.append(f'missing {l}')
        elif norm(hv[c]) != norm(l):
            diff.append(f'title differs: {hv[c]} -> {l}')
    for c in hv:
        if c not in {l.split(':')[0] for l in expected}:
            diff.append(f'unknown code in file: {hv[c]}')
    return diff


def cmd_codes(args):
    parser, _, _ = build_all()
    expected = code_list_lines(parser)
    diff = codes_diff(expected)
    if args.write:
        text = open(CODES_PATH, encoding='utf-8').read()
        lines, s, e = codes_block(text)
        new = lines[:s] + expected + lines[e:]
        open(CODES_PATH, 'w', encoding='utf-8').write('\n'.join(new))
        print(f'wrote {len(expected)} codes to {os.path.relpath(CODES_PATH, ROOT)} ({len(diff)} change(s))')
        for d in diff:
            print('  ' + d)
    else:
        print('\n'.join(expected))
        if diff:
            print(f'\n{len(diff)} difference(s) from {os.path.relpath(CODES_PATH, ROOT)}:')
            for d in diff:
                print('  ' + d)
    return 0


# ----------------------------------------------------------------------------------------------------------------
# Locate

def cmd_locate(args):
    parser, renderer, md = build_all()
    want = args.code.strip()
    aid = re.sub(r'\)\(', '-', want).replace('(', '-').replace(')', '').replace(':', '-')
    ln = renderer.anchors.get(aid)
    if not ln:
        sys.exit(f'{want!r} not found (anchors look like S5, S5-1, S5-1-j-i, AnnexB-settlement)')
    lines = md.split('\n')
    print(f'{os.path.relpath(NPPF_MD, ROOT)}:{ln}  #{aid}')
    i = ln - 1
    while i < len(lines) and lines[i].strip():
        print(strip_md(lines[i]).rstrip())
        i += 1
    return 0


# ----------------------------------------------------------------------------------------------------------------
# README

def readme(parser, renderer, md, results):
    L = []
    w = L.append
    today = dt.date.today().isoformat()
    w('# The National Planning Policy Framework (NPPF): canonical copies')
    w('')
    w('This folder holds the Framework itself: the August 2026 edition (current) and the December 2024 edition it replaced. '
      'Every tool and page in this repository that quotes the Framework reads these files and no other copy. '
      'The documents are Crown copyright, reproduced under the Open Government Licence v3.0; the Markdown edition and this README are generated by `tools/nppf_md.py`.')
    w('')
    w('## What this folder holds')
    w('')
    w('| File | Bytes | SHA-256 | What it is |')
    w('| --- | --- | --- | --- |')
    for name, what in [
        ('NPPF-August-2026.pdf', f'The published PDF, GOV.UK asset `{ASSET_ID}` (the asset linked after the 29 September 2026 page update is byte-identical). 130 pages.'),
        ('NPPF-August-2026.txt', f'`{EXTRACTED_WITH}` extract of the PDF. What every quotation check greps.'),
        ('NPPF-August-2026.md', 'Markdown edition built from the text by `tools/nppf_md.py build`. Reading and analysis copy; verbatim apart from the changes listed below.'),
        ('NPPF-August-2026.structure.json', 'Where every chapter, policy, paragraph, limb and glossary term sits: printed page, Markdown line, text line, anchor.'),
        ('NPPF-December-2024.pdf', 'The previous Framework, kept for decisions that applied it.'),
        ('NPPF-December-2024.txt', 'Text extract of the December 2024 PDF.'),
    ]:
        p = os.path.join(NPPF_DIR, name)
        if os.path.exists(p):
            w(f'| `{name}` | {os.path.getsize(p):,} | `{sha256(p)[:16]}…` | {what} |')
    w('')
    w(f'Source page: {SOURCE_URL}. PDF asset: {ASSET_URL}. PDF MD5 `{md5(NPPF_PDF)}`.')
    w('')
    w('## How the Markdown edition was made')
    w('')
    w('The tool reads the committed text extract, not the PDF, so the result does not depend on the local poppler version. It:')
    w('')
    w('- splits the text into pages on the form-feed characters, drops the page numbers and the Contents pages (the Contents are regenerated with links), and keeps the cover and copyright pages verbatim;')
    w('- collects the footnote definitions from the foot of each page, rejoins the lines pdftotext split, and renders them as `[^N]` definitions in one section at the end;')
    w('- finds each footnote marker in the page body (pdftotext fuses them to the preceding word, as in "otherwise1") and replaces it with `[^N]`;')
    w('- classifies every remaining line as a chapter or annex heading, group heading, policy heading, boxed chapter objective, numbered paragraph, lettered or roman sub-item, bullet, glossary entry, table row or continuation, and fails on any line it cannot place;')
    w('- joins wrapped lines with a space (no space after a compound hyphen such as "plan-" / "making", or inside a broken URL), including across page breaks;')
    w('- rebuilds the Annex C, Annex E and Annex F tables from their column positions;')
    w('- adds anchors: `#S5` for a policy, `#S5-1` for its paragraph 1, `#S5-1-j-i` for limb (j)(i), `#Intro-3` for Introduction paragraph 3, `#AnnexA-2` for an annex paragraph, `#AnnexB-settlement` for a glossary term, `#ch4` / `#AnnexB` for a chapter or annex;')
    w('- marks the start of each printed page with `<!-- p.N -->` (invisible when rendered).')
    w('')
    w('Body text is otherwise verbatim. A quotation check that reads the Markdown instead of the text must strip: `<a id="…"></a>`, `<!-- … -->`, `<br>`, `[^N]` and `[^N]:`, `**`, a leading `> `, heading `#`s and table `|`s. `norm_md()` in the tool does exactly that.')
    w('')
    w('## Structure map')
    w('')
    w('Policy codes with printed page numbers. Anchors: `#S3` and so on.')
    w('')
    for p in parser.parts:
        w(f'- **[{p.heading}](NPPF-August-2026.md#{p.anchor})** (p. {p.page})')
        if p.kind == 'chapter':
            group, shown = None, None
            for b in p.blocks:
                if b.kind in ('group', 'subheading') and p.num != 1:
                    group = b.text
                elif b.kind == 'policy':
                    tag = f' — *{group}*' if group and group != shown else ''
                    shown = group if group else shown
                    w(f'  - [{b.code}](NPPF-August-2026.md#{b.code}): {b.title} (p. {b.page}){tag}')
        else:
            subs = [b.text for b in p.blocks if b.kind == 'subheading']
            if subs:
                w('  - ' + '; '.join(subs))
            if p.num == 'B':
                terms = [b for b in p.blocks if b.kind == 'term']
                w(f'  - {len(terms)} glossary terms, each with an anchor (`#AnnexB-grey-belt`, `#AnnexB-settlement`, …)')
    w(f'- **[Footnotes](NPPF-August-2026.md#footnotes)**: {len(parser.footnotes)}')
    w('')
    w('## What changed from December 2024')
    w('')
    w('The August 2026 Framework replaces the paragraph-numbered 2024 text with coded policies (S1–6, GB1–8 and so on), each split into plan-making and decision-making policies, and absorbs the separate Planning policy for traveller sites. '
      'The working mapping from 2024 paragraph numbers to 2026 codes is kept with the decisions database: `data/decisions/nppf-2026-policy-codes.md`, section "December 2024 → August 2026 mapping".')
    w('')
    w('## Extraction caveats')
    w('')
    rep = parser.report
    exc = [m for m in rep['markers'] if m['rule'] != 'fused']
    w(f'- {len(rep["markers"])} footnote markers were separated from the words pdftotext fused them to. {len(exc)} were not fused to a letter and are matched by pinned rules: ' + '; '.join(f'footnote {m["n"]} ("{m["context"]}", {m["rule"]})' for m in exc) + '.')
    w('- Footnote 22 is fused to its own definition in the text ("22In the context…"); footnote 29 contains an i./ii. list, kept as continuation lines; footnote 72 contains a URL that pdftotext broke across two lines without a hyphen, rejoined.')
    joins = [j for j in rep['page_joins'] if j['joined']]
    splits = [j for j in rep['page_joins'] if not j['joined']]
    w(f'- {len(joins)} page breaks fall inside a paragraph or list item and were rejoined (pages {", ".join(str(j["page"]) for j in joins)}). {len(splits)} page-top lines were read as new paragraphs.')
    if rep['wrapped_headings']:
        w('- Headings that wrap onto a second line in the PDF, rejoined: ' + '; '.join(rep['wrapped_headings']) + '.')
    w('- Tables (Annex C information requirements; the three Annex E contribution tables; Annex F tables 1 and 3) are rebuilt from their column positions and their row counts asserted; the Annex F table 3 grid is checked against a literal in the tool. Annex F table 2 is a set of headed lists in the PDF and is rendered as such.')
    w('- Glossary entry boundaries come from the GOV.UK Annex B page (bold terms); the text-only heuristic is checked against it.')
    w('- The GOV.UK HTML pages differ from the PDF in a few places; the PDF text is authoritative and these are reported, never merged: each chapter objective box inserts "of the National Planning Policy Framework" after "this chapter"; Annex A paragraph 3 reads "5 years" in the HTML and "five years" in the PDF; Annex D paragraph 1 has "this annex" against "This Annex".')
    w('')
    w('## How the tools consume these files')
    w('')
    w('| Reader | File | Use |')
    w('| --- | --- | --- |')
    w('| `pages/england/nppf-navigator/build/lib.mjs` (+ `verify-quotes.mjs`, run by `npm run build` and CI) | `.pdf` via `pdftotext -layout` | verifies every Navigator quotation |')
    w('| `pages/_shared/policy-weight.mjs` (dp3-design, core-strategy-weight, neighbourhood-plan-weight, sustainable-location factors) | `.txt` | quotation checks at build |')
    w('| `pages/authority/stratford-dc/nppf-decisions/build/verify.py` | `.txt` | quotation checks for the Stratford note |')
    w('| `pages/england/sustainable-location/build.mjs`, `pages/settlement/claverdon/kington-lane-decision-route/build.mjs` | `.txt` (as `open:nppf/NPPF-August-2026.txt`) | quotation checks and public source links |')
    w('| `tools/corpus_quotes.py` | `.txt` (via `local_text` in `data/guidance/corpus/b0-mhclg-nppf-pdf-2026-08-17.md`) | guidance-corpus quotation checks |')
    w('| people and analysis agents | `.md` + `.structure.json` | reading, navigation by anchor, locating a code or limb (`uv run tools/nppf_md.py locate S5(1)(j)`) |')
    w('')
    w('The analytical summary of what the Framework says, coded against the research propositions, is the guidance-corpus entry `data/guidance/corpus/b0-mhclg-nppf-pdf-2026-08-17.md`. The GOV.UK chapter pages (all 26 parts) are in `../guidance-ogl/` and are used only as a cross-check.')
    w('')
    w('Regenerate and check:')
    w('')
    w('```bash')
    w('uv run tools/nppf_md.py build    # rewrite the .md, .structure.json and this README')
    w('uv run tools/nppf_md.py check    # all checks below; exit 1 on failure (CI runs build, diff, check)')
    w('uv run tools/nppf_md.py codes    # policy-code list; --write refreshes data/decisions/nppf-2026-policy-codes.md')
    w('```')
    w('')
    w('## Last check')
    w('')
    w(f'Generated {today}.')
    w('')
    for r in results:
        w(f'- {"ok" if r["ok"] else "FAIL"}: {r["name"]}' + (f' ({r["detail"]})' if r['detail'] else ''))
    w('')
    return '\n'.join(L)


# ----------------------------------------------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    sub = ap.add_subparsers(dest='cmd', required=True)
    sub.add_parser('build', help='write the Markdown edition, structure sidecar and README')
    c = sub.add_parser('check', help='validate the committed files')
    c.add_argument('--show', type=int, default=10, help='how many failing items to list per check')
    k = sub.add_parser('codes', help='policy-code list')
    k.add_argument('--write', action='store_true', help='refresh the bullet block in data/decisions/nppf-2026-policy-codes.md')
    lo = sub.add_parser('locate', help='print where a code or limb is')
    lo.add_argument('code')
    args = ap.parse_args()
    try:
        return {'build': cmd_build, 'check': cmd_check, 'codes': cmd_codes, 'locate': cmd_locate}[args.cmd](args)
    except ParseError as e:
        print(f'parse error: {e}', file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main())
