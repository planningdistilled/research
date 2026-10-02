# NPPF 2026 Navigator

An interactive decision-route tool for the National Planning Policy Framework (August 2026). It asks for the facts and planning judgements a decision needs, shows the verbatim policy text for each step, adapts the next questions to the answers, and ends on an indicative determination with its reasons. Each reason is linked to matching decisions from `data/decisions/`. Not legal advice.

## Build

```bash
npm install          # esbuild + typescript only
npm test             # engine, matcher and scenario tests
npm run typecheck
npm run build        # -> dist/ and graph.md
npm run serve        # http://localhost:8123
```

`npm run build`:
- validates the graph (unknown facts, option values, quote ids);
- **verifies every quotation** against `pdftotext -layout data/open-sources/nppf/NPPF-August-2026.pdf`, failing on any mismatch (`node build/verify-quotes.mjs` shows where);
- writes `graph.md` (the reviewable graph);
- builds the case data from `data/decisions/index/cases.json`, the case bodies and `harvest-log/state.json`;
- bundles the app and prints a size report against the artifact limits.

Refresh the data with the harvest pipeline first (`uv run tools/harvest.py all`, then distil the queue), then rebuild.

## Publishing

The master copy is the artifact https://claude.ai/artifact/1hsNJfQuu5sFDq22XkZuBA: republish `dist/index.html` with every `dist/` file (shard names are content-hashed, so null out names that have gone).

It is also served on GitHub Pages at https://planningdistilled.org/research/england/nppf-navigator/ (repo `planningdistilled/main-site`, checked out beside this repo). After `npm run build`, run `npm run export:pages`: it writes a full HTML document with search metadata into `../../../../planningdistilled/main-site/research/england/nppf-navigator/`, copies `app.js` and `data/`, and removes shards the build no longer uses. It also writes the static copies that search engines and AI crawlers can read without running the app (`build/static-pages.mjs`): `decisions/` (a page and a Markdown file for every decision note, an index, `decisions.json` and `decisions.csv`) and `route/` (`graph.md` as a page). Internal fields (local paths, harvest bookkeeping, analyst notes) are left out of those. `node build/method-page.mjs` regenerates the Method & cross-references sub-page there. Then run `node site/finish.mjs` from the repo root (metadata, `sitemap.xml`, `llms.txt`; see `site/README.md`) and commit and push that repo.

## Layout

| Path | What |
| --- | --- |
| `graph/policies.ts` | Verbatim Framework extracts. `…` marks an omission; `¦` marks a page break with nothing omitted. |
| `graph/nodes/*.ts` | The decision graph, one module per section: core, Green Belt, countryside (S5), TR3, heritage, triggers, benefits, balance. |
| `graph/index.ts` | Derived facts (major development, unmet need, route), node order and outcome rules. |
| `graph.md` | Generated review copy of the graph. Do not edit. |
| `src/engine/` | Pure engine: predicate language, `evaluate()`, validator. No DOM. |
| `src/data/` | Code canonicalisation, case matching and ranking, manifest and shard loading (IndexedDB cache). |
| `src/ui/` | Vanilla TypeScript UI and `index.html` (styles and shell). |
| `build/` | Build, quote verifier, data sharding, test runner. |

## How the graph works

Nodes are asked in order, each only when its `when` predicate holds on the facts established so far. Predicates are data (`eq`, `ne`, `in`, `has`, `gte`, `lt`, `answered`, `hasFinding`, `not`, `all`, `any`), so `graph.json` holds no code. Changing an early answer re-routes; answers on nodes that fall off the route are kept but ignored.

Planning judgements are always the user's: a `judgement` node shows the policy text, guidance from decisions, contested readings, and decisions split by finding.

Answers record findings: route, trigger (a "should be refused" policy failed), fail, harm, benefit, pass. The first matching outcome rule gives the verdict:
1. An isolated home that fails HO11 (S5(3)).
2. Otherwise, the route's own test: the GB6(2) very special circumstances test, the S5(4) exceptional circumstances test, or the S4/S5(1)/S5(5) "substantially outweighed" balance. That balance is asked in its S4(2)(c)/S5(2) form when a trigger has been found ("likely" to be substantially outweighed, not automatic).

Heritage is weighed, not a gate: a failed HE6(4) balance, or an assessment too poor to rule out harm (HE5), is carried into the route's balance as harm of considerable importance and weight. Neither is a "should be refused" policy; only HE6(5) (substantial harm) is. The outcome names the unjustified heritage harm either way (`bal-refuse-heritage`, `bal-approve-heritage`). A site partly inside a settlement records S3(2) and asks for the overall view before the balance.

To extend the tool, add a module under `graph/nodes/`, add its quotes to `policies.ts`, and add a scenario to `test/scenarios.test.ts`. No engine change is needed.

## Data and growth

`dist/data/manifest.json` lists a content-hashed match index (always loaded, about 600 B per case) and lazily loaded notes and body shards (≤ 900 KB each), cached in IndexedDB by hash. The build fails before exceeding the artifact limits (255 files, 64 MB per version, 16 MB per file). The size report prints the remaining headroom (about 16,500 cases at current sizes). Past that, set `baseUrl` in the manifest to host shards elsewhere, or split the index by policy family.
