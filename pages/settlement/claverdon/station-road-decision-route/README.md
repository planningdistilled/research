# Station Road Decision Route

Why the Green Belt policies (GB6 and GB7), not S5, decide planning application 26/01470/FUL at Land North of Station Road, Claverdon, under the August 2026 NPPF; where the scheme fails the TR3 sustainable-location test; boxes counting the decisions that agree, each linking to a list of those decisions; and a set of answers to paste into the NPPF 2026 Navigator.

Published at https://planningdistilled.org/research/settlement/claverdon/station-road-decision-route/, with a claude.ai copy at https://claude.ai/artifact/C1cQBWyDqhyTPS9ajYF6NG.

This folder is the master copy:

- `page.html`: the page source, written as an artifact fragment (no doctype or head). The `<!-- boxes:… --><!-- /boxes -->` markers are left empty; the build fills them.
- `list.css`: styles for the decision-list pages.
- `build.mjs`: counts each box from `data/decisions/index/cases.json`, takes summaries from the case files, and writes `index.html` plus `cases/<box>.html`. The box definitions and the guards on "all refused or dismissed" claims are at the top.

```bash
node pages/settlement/claverdon/station-road-decision-route/build.mjs             # into main-site
node pages/settlement/claverdon/station-road-decision-route/build.mjs --artifact  # into dist/ for the artifact
node site/finish.mjs
```

Rebuild after the decisions database grows (`uv run tools/harvest.py build`), then republish both copies. To republish the artifact, publish `dist/index.html` with the `cases/*.html` files from `dist/`.

The answer set in the page must load cleanly into the Navigator: every key must be a node fact and every value a valid option (the Navigator's `sanitise` drops anything else, including notes fields).

Neighbourhood Plan references link to the Parish Council's copy of the made plan (December 2019), with `#page=N` (PDF pages match the printed page numbers): https://claverdon-pc.gov.uk/wp-content/uploads/2024/09/Claverdon-Neighbourhood-Plan.pdf. A verification copy, with its text extract, is at `sources:stratford-dc/claverdon/Claverdon-Neighbourhood-Plan.pdf`.
