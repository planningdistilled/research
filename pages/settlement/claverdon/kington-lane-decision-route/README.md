# Kington Lane Decision Route

A step-by-step assessment of planning application 26/01831/FUL (ten homes at Greenfingers Nurseries, Kington Lane, Claverdon) against the August 2026 NPPF, following the questions the NPPF 2026 Navigator asks: the previously developed land route (GB7(1)(e)), the grey belt route (GB7(1)(g)), the TR3 location test, the Golden Rules (GB8), the policies that say development should be refused, and very special circumstances. Evidence as at 6 October 2026.

Published at https://planningdistilled.org/research/settlement/claverdon/kington-lane-decision-route/, with:

- `evidence/`: the evidence register, every quotation with its document, date and page (`evidence/evidence.json` is the same as data);
- `cases/<box>.html`: one list of decisions for each tally box on the page;
- `answers.json`: the two Navigator answer sets and the result each reaches.

This folder is the master copy:

- `page.html`: the page source, an artifact-style fragment (no doctype or head). Quotations are written `<q data-q="id">words</q>`; a whole register entry is placed with `<blockquote class="ev" data-q="id"></blockquote>`. Add `data-nocite` to leave out the citation link. The `<!-- boxes:… -->` and `<!-- answers:… -->` markers are left empty; the build fills them.
- `evidence.mjs`: the documents and the quotations. Each quotation names its document and PDF page.
- `answers.mjs`: the Navigator answer sets, with the route and outcome each must reach.
- `build.mjs`: checks, then writes the pages. `list.css` styles the list and register pages.

```bash
node pages/settlement/claverdon/kington-lane-decision-route/build.mjs --check   # verify only
node pages/settlement/claverdon/kington-lane-decision-route/build.mjs           # into main-site
node site/finish.mjs
```

## What the build checks

1. Every quotation in `evidence.mjs` appears in the text of the document and page it cites. Application documents and consultation responses are read from the private sources checkout (`sources:stratford-dc/claverdon/26-01831-FUL/`, text extracts of the council's planning file); the Framework and appeal letters from `data/open-sources/`. Without the sources checkout those entries are skipped with a warning, so publish only from a machine that has it.
2. Every `<q data-q>` on the page is a run of words from its register entry (an ellipsis may stand for words left out).
3. Each answer set, run through the Navigator engine, is complete, has no off-route answers, and ends on its declared route and outcome. This needs `npm ci` in `pages/england/nppf-navigator`.
4. The outcome claims in the tally boxes still hold (for example that every decision in the highway safety list was refused or dismissed).

A failed check stops the build.

## Keeping it current

The application is live. When the file changes (a reply to the Highway Authority, amended plans, an officer's report, a decision):

- add text extracts of the new documents to the sources repo and entries to `evidence.mjs`;
- revise `page.html` and, where a judgement changes, `answers.mjs`;
- change the "as at" date in the page header and `APPLICATION.checked`.

Rebuild after the decisions database grows (`uv run tools/harvest.py build`): the box counts move.

The application documents are not republished: they belong to their authors and are on the council's planning file. Residents' comments are not quoted and their authors are not named. Scanned documents were read with `tools/ocr_pdf.py`; one register entry (the tree schedule row for T20) was read by eye from the page image and says so.
