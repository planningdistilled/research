# Planning Distilled: research

The data, tools and page sources behind [planningdistilled.org](https://planningdistilled.org/): open research on planning decisions in England under the August 2026 National Planning Policy Framework (NPPF).

- **Decisions database**: a structured note on every planning appeal and council decision we have found made under the August 2026 NPPF, with the policies applied and how each was found.
- **Guidance corpus**: summaries of the published commentary on the new Framework (law firms, consultancies, MHCLG, the Planning Inspectorate and others), with machine-checked quotations.
- **NPPF 2026 Navigator**: an interactive decision-route tool through the Framework, linked to the decisions.
- The pages built from them.

Licensed [CC BY 4.0](LICENSE): credit "Planning Distilled". The documents in `data/open-sources/` are Crown copyright under the Open Government Licence; see [NOTICE.md](NOTICE.md).

## Layout

```
data/
  decisions/        one Markdown case file per decision (cases/), generated index (index/),
                    analysis notes and review registers (analysis/), harvest watermarks and logs (harvest-log/)
                    DISTILLATION-GUIDE.md is the manual for adding decisions; README.md is the schema
  guidance/         corpus/*.md (one summary per source), quotes-check.json, analysis/
  open-sources/     OGL documents the tools read and the notes cite
    nppf/           the Framework (Aug 2026, Dec 2024) and its text
    pins-corpus/    full text of every Planning Inspectorate decision letter harvested (<ref>.txt)
    pins-letters/   decision letter PDFs (PINS, Secretary of State, Crown development)
    guidance-ogl/   MHCLG and Planning Inspectorate pages from the guidance corpus
tools/              Python: harvest, index, normalise, quote checks, OCR (macOS), check_public.py
pages/              one folder per published page, mirroring the site's paths
  england/nppf-navigator/
  england/service-village/
  authority/stratford-dc/nppf-decisions/
  settlement/claverdon/station-road-on-foot/
site/               finish.mjs (site-wide metadata, sitemap, llms.txt, IndexNow), seo.py, publish checklist
paths.mjs, paths.py where everything is; the only place paths are resolved
```

Case files and corpus summaries refer to documents as `open:<path>` (in `data/open-sources/`) or `sources:<path>` (in the private sources repo: council reports and copies of third-party articles, kept for verification but not ours to republish). Each case also carries public source URLs.

## Working with it

Three sibling checkouts:

```
planningdistilled/
  research/    this repo
  main-site/   the built site (GitHub Pages); override with PD_SITE
  sources/     private third-party copies; override with PD_SOURCES (optional)
```

Everything except the guidance quote check and the Stratford note checks works without `sources/`.

```bash
uv run tools/harvest.py status          # what has been harvested and what is queued
uv run tools/harvest.py all             # weekly: sweep, fetch, index, queue, build
uv run tools/build_index.py             # rebuild data/decisions/index after editing cases
uv run tools/corpus_quotes.py           # re-check guidance quotations (needs sources/)

cd pages/england/nppf-navigator
npm ci && npm test && npm run build     # builds dist/, verifies every NPPF quotation against the PDF
npm run export:pages                    # writes into main-site
node build/method-page.mjs

node site/finish.mjs                    # last step of every publish; see site/README.md
```

Needs Node 20+, Python 3.11+ with [uv](https://docs.astral.sh/uv/), and `pdftotext` (poppler).

Working with Claude Code: `CLAUDE.md` has the rules and commands, `.claude/skills/` the multi-step workflows (`/weekly-update`, `/publish-site`, `/add-guidance-source`), and a SessionStart hook checks the setup.

Before committing, `python3 tools/check_public.py` (run automatically with `git config core.hooksPath .githooks`) checks that nothing personal, oversized or non-OGL is about to be published.
