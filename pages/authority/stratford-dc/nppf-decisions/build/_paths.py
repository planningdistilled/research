"""Paths for the Stratford note build, from the repo-wide paths.py.

SRC   council report texts, Core Strategy (cs.txt) and topic paper (gbtp.txt): private sources repo
NPPF  NPPF August 2026 text: data/open-sources/nppf
PINS  appeal letter texts: data/open-sources/pins-corpus
OUT   where the published copy goes: main-site/research/authority/stratford-dc/nppf-2026-decisions
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, *['..'] * 5)))
from paths import DECISIONS, NPPF_TXT as NPPF, PINS_CORPUS as PINS, SITE, SOURCES  # noqa: E402,F401

SRC = os.path.join(SOURCES, 'stratford-dc', 'public-note')
OUT = os.path.join(SITE, 'research', 'authority', 'stratford-dc', 'nppf-2026-decisions')
CASES_JSON = os.path.join(DECISIONS, 'index', 'cases.json')


def src(name):
    """A council/local-plan text; NPPF comes from the open sources."""
    if name == 'nppf.txt':
        return NPPF
    if not os.path.isdir(SRC):
        sys.exit(f'private sources not found at {SRC} (set PD_SOURCES)')
    return os.path.join(SRC, name)
