#!/usr/bin/env python3
"""Normalise controlled-vocabulary values in cases/*.md frontmatter (idempotent).

nppf_applied -> 2026-08 | "2024-12 (transitional)" | not-cited
The original wording is kept as nppf_applied_note when it carried extra detail.
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from paths import DECISIONS  # noqa: E402

CASES = Path(DECISIONS) / "cases"
changed = 0
for p in CASES.glob("*.md"):
    t = p.read_text()
    m = re.search(r"^nppf_applied: *(.+)$", t, re.M)
    if not m:
        continue
    raw = m.group(1).strip().strip('"').strip("'")
    low = raw.lower()
    if low == "2026-08":
        continue
    if low.startswith("2024-12"):
        new, note = '"2024-12 (transitional)"', None if low == "2024-12 (transitional)" else raw
    elif low.startswith("2026-08"):
        new, note = "2026-08", raw
    else:
        new, note = "not-cited", None if low in ("none-cited", "not cited", "unstated", "unclear", "not-applicable", "not-cited") else raw
    line = f"nppf_applied: {new}"
    if note:
        line += "\nnppf_applied_note: '" + note.replace("'", "''") + "'"
    t2 = t[:m.start()] + line + t[m.end():]
    if t2 != t:
        p.write_text(t2)
        changed += 1
print(f"normalised {changed} files")
