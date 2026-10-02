"""Shared helpers for the PINS new-service decision corpus.

Used by harvest.py (incremental) and index_pins_corpus.py (full rebuild).
Stdlib only.
"""
import collections
import csv
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from paths import DECISIONS as DB, PINS_CORPUS as CORPUS, ROOT  # noqa: E402,F401

LOG = f"{DB}/harvest-log"
DOCS_MAP = f"{CORPUS}/docs.map"
INDEX_TSV = f"{LOG}/pins-corpus-index.tsv"
DECIDED_JSONL = f"{LOG}/pins-decided.jsonl"
LEGACY_DECIDED_JSON = f"{LOG}/pins-decided-since-2026-08-17.json"

INDEX_COLS = ['ref', 'date', 'type', 'decision', 'lpa', 'nppf2026_codes',
              'cites_2026_fw', 'cites_old_fw_paras', 'description']

# Canonical NPPF 2026 policy-code pattern (also used by the navigator build).
CODE_RE = re.compile(
    r'\b(S[1-6]|GB[1-8]|TR[1-8]|HE(?:10|[1-9])|HO(?:1[0-3]|[1-9])|E[1-4]|TC[1-4]|CO[12]|W[1-4]'
    r'|M[1-6]|L[1-3]|DP[1-4]|HC[1-8]|P[1-6]|F[1-9]|N[1-6]|DM(?:10|[1-9]))'
    r'(\(\d+\)(?:\([a-z]\))?(?:\([ivx]+\))?)?(?=[\s,.;:)\]]|$)')

FW26_RE = re.compile(r'(2026 (edition of the )?(National Planning Policy )?Framework|Framework \(2026\)'
                     r'|August 2026|NPPF 2026|2026 NPPF|new Framework|revised Framework published)')
OLD_FW_RE = re.compile(r'December 2024|paragraph \d{2,3} of the (Framework|NPPF)')


def load_decided():
    """ref -> decided-list row. Reads the JSONL store, falling back to the legacy JSON."""
    rows = {}
    if os.path.exists(LEGACY_DECIDED_JSON):
        for r in json.load(open(LEGACY_DECIDED_JSON)):
            rows[r['ref']] = r
    if os.path.exists(DECIDED_JSONL):
        for line in open(DECIDED_JSONL):
            line = line.strip()
            if line:
                r = json.loads(line)
                rows[r['ref']] = r
    return rows


def save_decided(rows):
    tmp = DECIDED_JSONL + '.tmp'
    with open(tmp, 'w') as o:
        for r in sorted(rows.values(), key=lambda r: (r.get('date', ''), r['ref'])):
            o.write(json.dumps(r, sort_keys=True) + '\n')
    os.replace(tmp, DECIDED_JSONL)


def load_docs_map():
    m = {}
    if os.path.exists(DOCS_MAP):
        for line in open(DOCS_MAP):
            parts = line.split()
            if len(parts) >= 2:
                m[parts[0]] = parts[1]
    return m


def parse_letter(ref, text, meta):
    """One pins-corpus-index row for a letter's text."""
    flat = re.sub(r'\s+', ' ', text)
    m = re.search(r'development proposed is (.*?)(?:\.\s*(?:•|Decision\b|\d+\.\s)|•)', flat)
    desc = (m.group(1) if m else '')[:220]
    m = re.search(r'against the decision of (?:the )?(.*?)(?:\.|,| to )', flat)
    lpa = (m.group(1) if m else '')[:60]
    codes = collections.Counter(x.group(1) + (x.group(2) or '') for x in CODE_RE.finditer(flat))
    codes = [c for c, n in codes.most_common()
             if not re.fullmatch(r'(E1|L1|L2|L3|P1|N1|M1|S1|F1|W1)', c) or n > 1][:15]
    r = meta or {}
    return [ref, r.get('date', ''), r.get('type', ''), r.get('decision', ''), lpa, ' '.join(codes),
            'Y' if FW26_RE.search(flat) else '', 'Y' if OLD_FW_RE.search(flat) else '',
            desc.replace('\t', ' ')]


def read_index():
    if not os.path.exists(INDEX_TSV):
        return {}
    with open(INDEX_TSV) as f:
        return {r['ref']: r for r in csv.DictReader(f, delimiter='\t')}


def write_index(rows):
    """rows: iterable of lists in INDEX_COLS order."""
    tmp = INDEX_TSV + '.tmp'
    with open(tmp, 'w') as o:
        o.write('\t'.join(INDEX_COLS) + '\n')
        for r in sorted(rows, key=lambda r: r[0]):
            o.write('\t'.join(r) + '\n')
    os.replace(tmp, INDEX_TSV)


def corpus_refs():
    return sorted(f[:-4] for f in os.listdir(CORPUS) if f.endswith('.txt'))
