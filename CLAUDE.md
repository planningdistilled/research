# CLAUDE.md

Guidance for Claude Code sessions in this repository. Read `README.md` for the layout; this file covers how to work here.

## What this is

The research behind https://planningdistilled.org/: open research on planning decisions in England under the National Planning Policy Framework (NPPF) of 17 August 2026.

- `data/decisions/`: one Markdown case file per decision (971 to 30 Sep 2026). `README.md` there is the schema. `DISTILLATION-GUIDE.md` is the manual for adding a decision; read it before writing a case.
- `data/guidance/`: one summary per published commentary on the new Framework (315), with stances and machine-checked quotes.
- `data/open-sources/`: Crown copyright (Open Government Licence (OGL)) documents only. This holds the NPPF PDF and text, `pins-corpus/<ref>.txt` (the text of every new-style Planning Inspectorate (PINS) appeal decision letter we hold), decision PDFs, and MHCLG (Ministry of Housing, Communities and Local Government) and PINS pages.
- `tools/`: the Python tools: harvest, index, normalise, quote checks, OCR and the publication gate.
- `pages/<site path>/`: the source of each published page, mirroring the site's URLs.
- `site/`: `finish.mjs`, the last step of every publish, and `seo.py`.

## The three checkouts

```
planningdistilled/
  research/    this repo (public, CC BY 4.0)
  sources/     private: council reports, copies of third-party articles; read for verification only
  main-site/   public: the built site, served by GitHub Pages at planningdistilled.org
```

- All paths go through `paths.mjs` / `paths.py`. `PD_SITE` and `PD_SOURCES` override the sibling defaults. Never hardcode a path; import from these.
- GitHub Actions (`.github/workflows/check.yml`) runs on every push. It runs the public gate, compiles the Python tools, checks the decisions index is in sync with the case files, and runs the Navigator typecheck, tests and build (which verifies every NPPF quote). Keep it green: run `gh run list -R planningdistilled/research -L 1` after pushing.
- Data files cite documents with prefixes. `open:<path>` means `data/open-sources/<path>`. `sources:<path>` means the private sources repo. Use `resolveRef()` / `resolve_ref()` to turn them into paths.
- The SessionStart hook (`.claude/hooks/session-start.sh`) does three things:
  - turns on the commit gate;
  - checks the git identity and the sibling checkouts;
  - prints the harvest status.

  Read its output before starting.

## Hard rules

1. **Nothing personal, ever.** The site and these repos are anonymous.
   - Credit is "Planning Distilled". On Stratford and Claverdon pages it is "a local resident".
   - Never write the name of the person who runs the project, their address or email, or a local machine path into any file here.
   - Commits use the repo-local identity `Planning Distilled <noreply@planningdistilled.org>` (in research, sources and main-site).
   - `tools/check_public.py` runs as the pre-commit hook and blocks these. Never bypass it (`--no-verify`). If it fires, fix the file.
2. **Only OGL documents in this repo.** Council reports, local plans, law-firm and press articles, and campaign-group papers go in `../sources/` (private) and are cited as `sources:…`. Only PINS, Secretary of State, Crown development, NPPF, and MHCLG/PINS pages go in `data/open-sources/`. Quote other publishers briefly; never copy them wholesale.
3. **Verify before publishing.** Anything that goes on the site must be right; a wrong quote or claim is the worst outcome here.
   - Every quotation, paragraph or page reference, and descriptive claim is machine-checked against the source text. This includes "the report does not mention X": grep before asserting a negative.
   - Committee Update Reports (in the minutes) can correct officer reports. Check them.
   - Use `pdftotext -layout`, or `uv run tools/ocr_pdf.py` for scanned reports.
   - When a published note is corrected, fix the case files too.
4. **Licence on every page.** Every published page carries `<link rel="license" href="https://creativecommons.org/licenses/by/4.0/">` and the standard licence paragraph, ending "Source and data: github.com/planningdistilled/research". The builders add these; hand-written pages in main-site need them in the footer. `finish.mjs` fails a page with no title, description, canonical link or `<h1>`.
5. **The NPPF quotes in the Navigator must match the Framework.** `npm run build` verifies every quote against the PDF and fails on a mismatch. Don't work around it.
6. **Don't publish without being asked.** Pushing main-site is publishing. So is republishing an artifact or sending IndexNow pings. Build and verify freely, but confirm before pushing unless the request said to publish.

## Writing conventions

- Plain English, neutral register, like an inspector's. Not legal advice; pages say so.
- Spell out every acronym on first use, as `ACRONYM (Expansion)`. Do this in replies to the user too.
- Cite decisions as place + ref + paragraph: "Hatton Station 6006637 ¶24".
- Use policy codes from `data/decisions/nppf-2026-policy-codes.md`, e.g. `GB7(1)(g)(iii)`, `TR3(1)(a)`, `S5(2)`. The 2024 → 2026 mapping is at the end of that file.
- "Settlement" has two meanings: a council's settlement hierarchy, and the narrower NPPF Annex B definition (which excludes villages washed over by the Green Belt).
  - Say a place has a *tier* in a *settlement hierarchy* (e.g. "Category 3 Local Service Village (CS.15)").
  - Say "not a *settlement* as the NPPF defines it (Annex B)".
  - Rules: `data/decisions/analysis/settlement-hierarchy-and-service-centres.md` §6.
- Draft notes as Markdown. Build HTML or PDF versions only when asked.

## Common tasks

There are skills for the multi-step ones: `/weekly-update`, `/publish-site`, `/add-guidance-source`.

```bash
# Harvest and the decisions database
uv run tools/harvest.py status        # watermarks, queue, what is stale
uv run tools/harvest.py all           # sweep, fetch, index, queue, build (weekly)
uv run tools/harvest.py build         # normalise + build_index after editing cases
uv run tools/build_index.py           # index only; fix every WARN for files you touched

# Guidance corpus
uv run tools/corpus_quotes.py         # re-check every corpus quotation (needs ../sources)

# Navigator (pages/england/nppf-navigator)
npm ci && npm test && npm run typecheck && npm run build
npm run export:pages                  # writes into main-site
node build/method-page.mjs            # Method & cross-references page (+ sources/ sub-page)

# Other pages
node pages/england/service-village/build.mjs --pages
# Stratford note: pages/authority/stratford-dc/nppf-decisions/build/README.md
# Station Road on Foot: pages/settlement/claverdon/station-road-on-foot/README.md

# Always last, then commit main-site
node site/finish.mjs                  # metadata, sitemap.xml, llms.txt; idempotent
node site/finish.mjs --indexnow       # only after the main-site push has deployed

# Before any commit here
python3 tools/check_public.py
```

Artifacts, the claude.ai copies (republish when the page changes):
- Navigator: https://claude.ai/artifact/1hsNJfQuu5sFDq22XkZuBA. Publish `dist/index.html` with every `dist/` file. Shard names are content-hashed, so null out the old names.
- Service village: https://claude.ai/artifact/QDHws22eKsToCvHkyFQoAx. Publish `dist/index.html` with every `dist/case-*.html`.
- Station Road on Foot: https://claude.ai/artifact/Q4GaKQGD7CFkRz9TxUV2D9. This one is the master copy, with no local source. Read it with the Artifact tool, edit, then republish. Strip the saved skeleton up to `<body>` first.
- Stratford note: https://claude.ai/artifact/Qvnk7tyjP1xQqRv31immB1. The source is `pages/authority/stratford-dc/nppf-decisions/build/`.

## Gotchas

- **Run parallel agents in separate folders.** When several agents distil cases in parallel, give each its own scratch subdirectory, or they overwrite each other's helper scripts. Before writing a case, each agent must grep `data/decisions/cases/` for the appeal ref to avoid duplicates.
- **Policy-code pattern lives in two places.** `pages/england/nppf-navigator/src/data/codes.ts` mirrors `CODE_RE` in `tools/pinscorpus.py` (the TypeScript one is extended with Annex and Transitional forms). Change both.
- **Method page numbers come from the review registers.** `method-page.mjs` computes them from `data/decisions/analysis/appeals-review/issue-1..6.tsv`. It throws if its assumptions about the issue-1 breakdown stop holding; revise the wording, don't silence the check.
- **Service-village row count is fixed.** `service-village/build.mjs` requires `settlement-tier-usage.tsv` to have exactly 170 rows of 14 fields.
- **`seo.py` won't update an existing licence line.** It adds the licence line only when a page lacks one. Fresh artifact exports get it; already-exported pages keep theirs.
- **`finish.mjs` must run after every build.** It rewrites the `<!-- pd:meta -->` block. Never hand-edit that block, `sitemap.xml` or `llms*.txt`.
- **Some council sites block fetching.** Many `*.moderngov.co.uk` sites sit behind Cloudflare and return 403. The working routes per council are in `DISTILLATION-GUIDE.md` §7.
- **Stratford-on-Avon has an open JSON API.** Its planning portal pages are JavaScript-only, but `https://apps.stratford.gov.uk/EplanningV2/API/` needs no auth (see §7).
- **Download Stratford documents in two steps.** POST `v1/Document/{id}/Request` with `--data ""` (it needs Content-Length: 0), then GET `v1/Document/{id}/Download`.
- **Use `/usr/bin/curl` in agent shells.** `curl` sometimes drops out of PATH.
- **Old-style appeal refs are slow to scan.** These are the 3xxxxxx refs, which include most inquiries, and they are only on the Appeals Casework Portal: `tools/scan_acp.py` manages about 100 pages a minute.
- **Don't bulk-rewrite paths with sed across code.** Use `paths.mjs` / `paths.py`, and make edits targeted.
