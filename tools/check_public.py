#!/usr/bin/env python3
"""Gate for this public repository: fails if anything that must not be published is about to be.

Checks every file git would commit (tracked + untracked, not ignored):
- personal identifiers (patterns in IDENTITY below) and local absolute paths;
- files over 25 MB;
- documents under data/open-sources/ outside the folders that hold Crown copyright (OGL) material.

Run: python3 tools/check_public.py   (also run by the pre-commit hook: git config core.hooksPath .githooks)
"""
import os
import re
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
MAX_BYTES = 25 * 2**20
# Folders of data/open-sources/ that may hold third-party documents: Crown copyright under the OGL only.
OGL_DIRS = {'nppf', 'pins-corpus', 'pins-letters', 'guidance-ogl', 'pins-training-manual'}
# Personal identifiers that must never appear (kept as fragments so this file does not match itself).
IDENTITY = re.compile('|'.join([
    'mulli' + 'neux', 'dan' + 'mux', 'old butch' + 'ers', 'lye green ro' + 'ad', r'cv35\s?8' + 'll',
    r'/Us' + r'ers/', r'\bDan' + r"(?:'s)?\b(?! (?:Charles|Hewett))",
]), re.I)
TEXT_EXT = ('.md', '.py', '.mjs', '.js', '.ts', '.json', '.jsonl', '.tsv', '.csv', '.html', '.txt', '.yaml', '.yml', '.toml', '.map', '')


def files():
    out = subprocess.run(['git', '-C', ROOT, 'ls-files', '-co', '--exclude-standard', '-z'], capture_output=True, check=True).stdout
    return [f for f in out.decode().split('\0') if f]


def main():
    problems = []
    for rel in files():
        path = os.path.join(ROOT, rel)
        if not os.path.isfile(path):
            continue
        if os.path.getsize(path) > MAX_BYTES:
            problems.append(f'{rel}: over 25 MB')
        parts = rel.split('/')
        if parts[:2] == ['data', 'open-sources'] and (len(parts) < 4 or parts[2] not in OGL_DIRS):
            problems.append(f'{rel}: not in an OGL folder of data/open-sources ({", ".join(sorted(OGL_DIRS))})')
        # Decision letters and guidance copies are third-party text: names in them are not ours to police.
        if rel.startswith('data/open-sources/') or not rel.endswith(TEXT_EXT) or rel.endswith('package-lock.json'):
            continue
        try:
            text = open(path, encoding='utf-8').read()
        except UnicodeDecodeError:
            continue
        for n, line in enumerate(text.split('\n'), 1):
            m = IDENTITY.search(line)
            if m and rel != 'tools/check_public.py':
                problems.append(f'{rel}:{n}: "{m.group(0)}"')
    for p in problems:
        print(p)
    print(f'check_public: {len(problems)} problem(s)')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
