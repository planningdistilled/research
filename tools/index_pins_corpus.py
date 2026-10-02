"""Index the PINS new-service decision corpus (data/open-sources/pins-corpus/*.txt).
Writes harvest-log/pins-corpus-index.tsv: ref, date, type, decision, lpa, codes cited, 2026-Framework flag, description.

Full rebuild. For an incremental refresh use `harvest.py index`."""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import pinscorpus as pc  # noqa: E402

meta = pc.load_decided()
rows = [pc.parse_letter(ref, open(f"{pc.CORPUS}/{ref}.txt", errors='ignore').read(), meta.get(ref))
        for ref in pc.corpus_refs()]
pc.write_index(rows)
print(pc.INDEX_TSV, len(rows))
