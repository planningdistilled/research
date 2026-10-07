"""Every path the Python tools need, resolved in one place (mirrors paths.mjs).

ROOT     this repository
DATA     ROOT/data (decisions database, guidance corpus, open sources)
OPEN     ROOT/data/open-sources (OGL documents hosted here)
SOURCES  the private planningdistilled/sources checkout ($PD_SOURCES, default ROOT/../sources)
SITE     the planningdistilled/main-site checkout ($PD_SITE, default ROOT/../main-site)

Data files refer to documents as `open:<path>` or `sources:<path>`; resolve_ref() expands them.
Tools import it with: sys.path.insert(0, <repo root>); from paths import ...
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, 'data')
DECISIONS = os.path.join(DATA, 'decisions')
GUIDANCE = os.path.join(DATA, 'guidance')
OPEN = os.path.join(DATA, 'open-sources')
SOURCES = os.path.abspath(os.environ.get('PD_SOURCES') or os.path.join(ROOT, '..', 'sources'))
SITE = os.path.abspath(os.environ.get('PD_SITE') or os.path.join(ROOT, '..', 'main-site'))
PINS_CORPUS = os.path.join(OPEN, 'pins-corpus')
NPPF_PDF = os.path.join(OPEN, 'nppf', 'NPPF-August-2026.pdf')
NPPF_TXT = os.path.join(OPEN, 'nppf', 'NPPF-August-2026.txt')
NPPF_MD = os.path.join(OPEN, 'nppf', 'NPPF-August-2026.md')


def has_sources():
    return os.path.isdir(SOURCES)


def resolve_ref(ref):
    """`open:x` -> OPEN/x, `sources:x` -> SOURCES/x; anything else unchanged."""
    if not ref:
        return ref
    if ref.startswith('open:'):
        return os.path.join(OPEN, ref[5:])
    if ref.startswith('sources:'):
        return os.path.join(SOURCES, ref[8:])
    return ref
