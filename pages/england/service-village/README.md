# "Service Village Does Not Mean Sustainable" page

A general explainer of why a settlement-hierarchy tier ("service village", "Local Service Village", "Key Service Centre") does not make a site a sustainable location under the August 2026 NPPF, with the appeal decisions that rule it out and Claverdon (26/01470/FUL) as a worked example. Published as a claude.ai artifact and at https://planningdistilled.org/research/england/service-village/.

## Inputs

- `template.html` — the hand-written main page (content only; the artifact skeleton wraps it at publish time).
- `data/decisions/analysis/appeals-review/settlement-tier-usage.tsv` — the verified register: one row per decision that uses a tier label (170), with the label, classification code (A–F, or X for excluded search matches), paragraph, tier quotation, influence line, and for A, B and D rows the route quotation. Every quotation was machine-checked against the decision letter (174 of 174 matched). **All quotations on the generated pages come from this file; none are typed into the build.**
- `data/decisions/index/cases.json` — case metadata (title, authority, date, outcome, portal links).

## Build

```
node build.mjs                                   # dist/index.html + dist/case-<ref>.html, for the artifact
node build.mjs --pages [--out <dir>] [--base <url>]  # full HTML documents with canonical links, for the site
```

`build.mjs` injects into the template: a headline bullet in the executive summary, section 5 ("What a full sweep of 170 decisions found", with counts computed from the TSV, the A2 and C lists, and a collapsible index of all 170), links from the section-4 case cards to their sub-pages, and a sources sentence in the footer. Every appeal the main page cites links to a sub-page first; the Planning Inspectorate appeals-service link sits on that sub-page. Decisions cited on the page that are not in the tier register (Hatton Station, Halsall, Copthorne, Newchapel, Beare Green, Kingswood, Tarleton, Trewarmett) get a route-decision sub-page built from the case file: its Summary section, the TR3 and GB7(1)(g)(iii) findings, route facts, and the "What made the difference" section. Register sub-pages carry the case-file Summary and location finding too. It then writes one sub-page per register row: eyebrow (code and meaning), place, meta line, the tier label used, the verified quotation with paragraph, a "Why this is cited" block built from the register's influence line and the code meaning (false positives are labelled as such), and source links (PINS appeals service for numeric refs; the council portal for council decisions). The build fails if an anchor in the template is missing or the TSV does not have 170 rows of 14 fields (the last two, added 1 Oct 2026, are the verified route paragraph and route quotation for every A, B and D row; "(none)" means the decision has no route sentence).

Codes (re-lettered 1 Oct 2026, final): A the shorthand applied wrongly (tier treated as the answer, no route sentence); B tier acknowledged, location decided against on the route; C tier cited in support beside route or transport evidence; D tier counted against the site; E descriptive only; F set aside as unusual (location finding imported from an adjoining recent, undelivered permission; Henfield 6007104, A on the decision text); X excluded search matches (wording about services, no tier referenced), shown on the page as "Excluded", not lettered. Secondary column: B on a D row means the route was decisive too; A on the F row means it would be A on the decision text. The banner figure (appeals allowed on code A) and the headline sentences are computed from the TSV, so a recoding changes the page.

## Publishing

Artifact: publish `dist/index.html` to https://claude.ai/artifact/QDHws22eKsToCvHkyFQoAx with every `dist/case-*.html` as a supporting file (omit `icon` on a redeploy). Website: run the `--pages` build (defaults: base https://planningdistilled.org/research/england/service-village/, out `<main-site>/research/england/service-village`), run `node site/finish.mjs` from the repo root (metadata, `sitemap.xml`, `llms.txt`; see `site/README.md`), then commit and push `main-site`. Each sub-page links to the full decision note under `nppf-navigator/decisions/` where the decision is in the database.
