# Legacy fetch scripts (18 October 2026)

The shell and Python snippets used to pull the 49 officer reports scored in
`data/decisions/analysis/other-councils-four-errors-2026-10.tsv` (sets `fetch-warwick-bromsgrove`,
`fetch-southworcs` and `fetch-moderngov`). Kept for provenance: they show the exact portal calls that
worked that day. `tools/council_sweep.py` and the adapters one level up supersede them; do not extend these.

- `idox/`: Idox Public Access advanced search (`_csrf` token, `date(applicationDecisionStart/End)`), 100-row
  pages, the three detail tabs, document download in the same cookie jar.
- `south-worcs/`: the South Worcestershire portal (`/Search/Advanced` anti-forgery token, `/Search/SiteResults`,
  `/Search/ResultsPage/N?module=PLA` with `X-Requested-With`), `/Planning/Display/<ref>` and its
  `data-disabled-link` documents. `SWEEP_WORK` sets the working folder (was the session scratchpad).
- `moderngov/`: `mgCalendarMonthView.aspx` → `ieListDocuments.aspx` → `documents/sNNN` reports and
  `documents/gNNN` printed minutes; `triage.sh` counts the policy codes in a text extract; `pg.sh` prints
  matches with PDF page numbers.

The scoring row writers from the same session are not kept: their output is the TSV above.
