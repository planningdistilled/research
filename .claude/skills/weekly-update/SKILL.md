---
name: weekly-update
description: Bring the NPPF 2026 decisions database up to date. Harvests new Planning Inspectorate appeal decisions, distils the queue into case files (with parallel agents for big queues), adds consistency-review rows and Navigator example candidates, rebuilds the index, then rebuilds and checks the pages. Use when asked to update, refresh or extend the decisions database, run the weekly harvest, or "add the new decisions".
---

# Weekly update of the decisions database

Work from the repo root. Read `data/decisions/DISTILLATION-GUIDE.md` before distilling anything; it is the coding manual. Everything below assumes it.

## 1. Where things stand

```bash
uv run tools/harvest.py status
```

Note the newest decision date, the queue length and anything stale. Also check `DISTILLATION-GUIDE.md` §7, the "Re-run schedule" table, for dated items now due: council committees, the end of challenge windows, recovered appeals. Then check the watch list in `data/decisions/analysis/patterns.md`.

## 2. Harvest

```bash
uv run tools/harvest.py all        # sweep every postcode area, fetch new letters, index, queue, build
```

- New letter text lands in `data/open-sources/pins-corpus/<ref>.txt`.
- The queue (planning-type letters that cite the 2026 Framework and have no case file) is written to `data/decisions/harvest-log/slices/queue-<date>.tsv`.
- If fetches fail, run `uv run tools/harvest.py fetch --retry-failed`.
- To leave a letter out on purpose, run `uv run tools/harvest.py skip REF --reason "..."`.

Council decisions are a separate pass. Use the Stratford-on-Avon JSON API and the per-council routes in §7, then record the pass with `uv run tools/harvest.py record --source lpa:<name> --newest <date> --note "..."`. Council PDFs go to `../sources/council/` (private) and are cited as `sources:council/<file>`. Never put them in this repo.

## 3. Distil the queue

**Up to about 30 letters:** distil them yourself.

**More than 30:** split the queue into batches of about 30 and run one agent per batch, in parallel. Give each agent:
- its slice of the queue (refs);
- the instruction to read `data/decisions/README.md`, `DISTILLATION-GUIDE.md` and `harvest-log/BRIEF.md` first;
- **its own scratch directory** for helper scripts. Agents sharing one overwrite each other's checkers;
- the rule to grep `data/decisions/cases/` for the ref before writing, to avoid duplicates;
- the outputs listed below, written under `data/decisions/analysis/appeals-review/incoming-<date>/`:
  - `batch-N.tsv`: the refs it processed;
  - `batch-N-skips.tsv`: ref and reason, for letters with no Framework-based reasoning (enforcement ground (f) only, prior approval with the Framework not determinative, and so on);
  - `batch-N-issue-K.tsv` for K = 1..6: consistency-review rows in the same columns as `issue-K.tsv` (`case_id date place_lpa outcome verdict reason para quote`). The verdicts and the six issues are defined at the top of `analysis/appeals-consistency-review.md`. The `quote` must be verbatim from the letter;
  - `batch-N-examples.md`: candidate examples for the Navigator. Each names the node file and point, the case and paragraph, a verbatim quote, and whether it strengthens or contradicts what the node says.

Each case file follows the schema. It uses `local_copy: open:pins-corpus/<ref>.txt` and quotes with decision-letter paragraph numbers, and sets `verification` honestly.

## 4. Check and merge

```bash
uv run tools/harvest.py build     # normalise + build_index; fix every WARN for new files
```

Then:
1. **Machine-check every new quotation** against the letter text: each case-file quote and each issue-TSV quote. Normalise whitespace, curly quotes and dashes, and allow for hyphenated line breaks. `pages/authority/stratford-dc/nppf-decisions/build/verify.py` is a working pattern. Fix or drop anything that doesn't match.
2. **Merge the rows.** Append `batch-*-issue-K.tsv` rows to `analysis/appeals-review/issue-K.tsv`.
3. **Update the review.** Recount and update `analysis/appeals-consistency-review.md`: the summary table, the dates and the counts.
4. **Act on the Navigator examples.** Review `batch-*-examples.md`. A contradiction of a graph node is a finding: raise it with the user before changing the graph.
5. **Update the analysis notes.** Update `analysis/patterns.md` (the watch list) and `analysis/reference-cases.md` if a new case is a better reference.

## 5. Rebuild and check the pages

```bash
cd pages/england/nppf-navigator && npm test && npm run build && cd -
node pages/england/sustainable-location/service-village/build.mjs     # dist/ only; fails if new decisions match the tier search and have no row in the register (classify them, add rows)
python3 tools/check_public.py
```

`method-page.mjs` throws if the issue-1 breakdown assumptions stop holding. If it does, revise the page wording; never silence the check.

## 6. Commit and offer to publish

- Commit `research` (the pre-commit gate runs). Commit council PDFs in `../sources` separately.
- Report to the user:
  - cases added (by decision maker);
  - the newest decision date;
  - skips;
  - any new patterns or contradictions of the Navigator graph.
- Then offer `/publish-site`. Publishing is the user's call.
