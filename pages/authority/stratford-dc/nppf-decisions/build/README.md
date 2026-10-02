# Build and sources for the Stratford NPPF decisions note

The note "Stratford planning decisions under the 2026 NPPF: how consistent are they?", published at
https://planningdistilled.org/research/authority/stratford-dc/nppf-2026-decisions/.

## Inputs (in this folder)
- `note.md` — the master text of the note.
- `quotes.json` + `locs.txt` — every quotation used, with its verified page (p.) or paragraph (¶) location.
- `cases.py` + `newcases.json` — build the 22 case summaries from the verified quotations.
- `why.py` — the "Why this is cited" note for each case.
- `template.html` + `glossary.py` — render the web page.
- `build.py` — the multi-page site (published page + 22 `case-*.html` sub-pages), written into this folder.
- `build-single.py [out]` — one self-contained file with the case summaries as inline panels (for sharing as a download).
- `standalone.py [out dir]` — wraps the built `index.html` as a full document; defaults to the main-site folder.
- `verify.py` / `sweep.py` / `loccheck.py` — quote and location checks.
- `_paths.py` — where the sources live (from the repo's `paths.py`).

## Sources
- Council officer reports, decision notices, committee minutes and the reports pack for the 10 Stratford decisions (`stratford-*.txt`), the Core Strategy 2016 (`cs.txt`) and the South Warwickshire Green Belt Exceptional Circumstances Topic Paper (`gbtp.txt`): text extracts in the **private** `planningdistilled/sources` repo, `stratford-dc/public-note/` (council copyright, not republished here). The PDFs are in `stratford-dc/`.
- NPPF August 2026: `data/open-sources/nppf/NPPF-August-2026.txt`.
- The 12 appeal decision letters: `data/open-sources/pins-corpus/<ref>.txt`.
- Decision metadata and source URLs: `data/decisions/index/cases.json`.

## Reproduce
```
cd pages/authority/stratford-dc/nppf-decisions/build
python3 sweep.py note.md      # every quoted fragment against the sources — expect 130/130
python3 loccheck.py note.md   # every cited page/paragraph number — expect 0 problems
python3 verify.py quotes.json # each quotation entry and its location — expect all ok
python3 cases.py              # regenerates newcases.json from quotes.json + locs.txt
python3 build.py              # index.html + case-*.html here
python3 standalone.py         # index.html -> <main-site>/research/authority/stratford-dc/nppf-2026-decisions/
```
Then copy the `case-*.html` files beside it, run `python3 site/seo.py` on the exported folder, and `node site/finish.mjs` (see `site/README.md`). The checks need the private sources checkout beside this repo (or `PD_SOURCES`). Regenerate any `.txt` with `pdftotext -layout`, or macOS Vision OCR for scanned reports.
