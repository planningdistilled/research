# NPPF August 2026 — decisions database

A store of planning decisions made under the **National Planning Policy Framework published 17 August 2026** (in force for all decisions from that date). Each decision is distilled to its key facts, the policies that decided it, and how each policy was found. The aim is a searchable body of reference cases: "show me decisions where GB7(1)(g)(iii) failed on walking-route quality", or "where a small housing scheme outside a settlement passed S5(1)(e)".

Not limited to Stratford-on-Avon. **Appeal and Secretary of State decisions carry the most weight**; council decisions show how officers and members are reading the new Framework.

## Layout

| Path | What |
| --- | --- |
| `cases/<case-id>.md` | One file per decision. YAML frontmatter (schema below) + short narrative. |
| `data/open-sources/pins-letters/<case-id>.pdf` (PINS, Secretary of State and Crown decisions) or `../sources/council/<case-id>.pdf` (council documents, private repo) | The decision letter / notice / officer report, where downloadable. |
| `harvest-log/<source>.md` | What each harvesting pass searched, what it found, dead ends, leads not yet followed. |
| `index/` | **Generated** by `tools/build_index.py`: policy → cases index, case table, tag and dev-plan indexes, `cases.json`. Do not hand-edit. |
| `index/stats.md` | Generated outcome rates by decision maker, dev type, site context, grey belt, Framework applied and policy finding. |
| `DISTILLATION-GUIDE.md` | Operating manual: triage, reading order, decision graphs, extraction checklists, coding rules, traps, sourcing recipes, re-run schedule, schema v2 proposals. |
| `analysis/patterns.md` | Executive synthesis: the 25 main propositions on how the 2026 Framework is applied, inspector v council divergence, watch list. |
| `analysis/reference-cases.md` | Hand-picked best 2–6 cases per NPPF test, split into supports-refusal / supports-approval. |
| `analysis/green-belt.md` | GB6–GB8 and S5(5): grey belt, limb (iii) route facts, station route, VSC, Golden Rules. |
| `analysis/principle-and-balance.md` | S3–S6, S5(1) categories, S5(4), triggers, TR3 outside the Green Belt, housing weight, paperwork failures. |
| `analysis/heritage-design-environment.md` | HE4–HE10, DP3(3), L2/L3, flood, highways, landscape, BNG and habitats. |
| `analysis/transition-and-decision-makers.md` | The Framework switch, Annex A ¶2 plan weight, supply, inspectors v councils, SDC practice, pending SoS and court items. |
| `analysis/settlement-hierarchy-and-service-centres.md` | Why local hierarchy labels ("service centre", Local Service Village) carry no standalone NPPF weight; they feed only development-plan accordance, the Annex B settlement/S4-S5 route and TR3. |
| `analysis/location-factors/` | Which factors each decision used to decide whether a location is sustainable, and which way each cut: `register.tsv` (one row per decision), `codes.tsv` (the classes and factor codes) and `codebook.md` (rules, method, limits). Checked by `tools/location_factors.py`; published as the "factors in decisions" sub-page of the sustainable location page. |
| `analysis/ANALYST-BRIEF.md` | Brief shared by the analysis agents. |
| `tools/build_index.py` | Rebuilds `index/` from case frontmatter and prints WARN lines. |
| `tools/normalise.py` | Normalises `nppf_applied` values in case frontmatter (idempotent); run before `build_index.py`. |
| `tools/harvest.py` | **Harvest pipeline** (sweep → fetch → index → queue → build → status). Records watermarks in `harvest-log/state.json` and one line per run in `harvest-log/runs.jsonl`. See *Harvest runbook* below. |
| `tools/pinscorpus.py`, `tools/index_pins_corpus.py`, `tools/scan_acp.py`, `tools/sweep_pins_decided.py` | Shared corpus helpers; full corpus-index rebuild; old-style ACP range scan; legacy sweep (now calls `harvest.py sweep`). |
| `nppf-2026-policy-codes.md` | The Framework's policy codes (the 2026 NPPF has no paragraph numbers). |

## Harvest runbook

Weekly, from `data/decisions/`:

```bash
uv run tools/harvest.py status      # how stale is each source?
uv run tools/harvest.py all         # sweep all postcode areas, fetch new letters, index, queue, rebuild, status
```

- `sweep` lists every decided new-style appeal (600xxxx) per postcode area into `harvest-log/pins-decided.jsonl` (decisions on or after 17 Aug 2026 only).
- `fetch` downloads each new decision letter, extracts its text with `pdftotext -layout` into `data/open-sources/pins-corpus/<ref>.txt`, and appends `docs.map`. Failures (e.g. scanned PDFs) go to `harvest-log/fetch-failures.json` and are retried up to three times (`--retry-failed` to force).
- `index` refreshes `harvest-log/pins-corpus-index.tsv` for new or changed letters only.
- `queue` writes `harvest-log/slices/queue-<date>.tsv`: letters that cite the 2026 Framework, are planning-type (householder and advertisement appeals are triaged out; `--all-types` to include them) and have no case file yet. Distil these into `cases/` following `DISTILLATION-GUIDE.md`, then run `build`. Letters you decide not to distil: `harvest.py skip REF ... --reason "..."`, so they leave the queue.
- `build` runs `normalise.py` and `build_index.py` and refreshes the `cases` block of `state.json`.
- Old-style ACP refs: `harvest.py acp LO HI OUT.jsonl` (wraps `scan_acp.py`; records the highest ref scanned).
- Council sources are bespoke per authority (§7 of the guide). After a manual pass, stamp the watermark: `harvest.py record --source lpa:<slug> --newest YYYY-MM-DD --note "..."`.

`state.json` is committed, so the date of the last sweep and the newest decision indexed travel with the repo.

Rebuild the index after adding cases: `python3 tools/normalise.py && uv run tools/build_index.py` (needs `uv`; the script declares its PyYAML dependency inline). `index/stats.md` gives outcome rates by policy finding, dev type and decision maker.

## Case id

- Appeals: `APP-<LPA code>-<type>-<yy>-<number>` from the appeal reference, e.g. `APP/M3645/W/26/6010313` → `APP-M3645-W-26-6010313`. If only the new-style 7-digit PINS case number is known, use `PINS-6010313`.
- Council decisions: `<LPA short slug>-<ref with / → ->`, e.g. SDC `26/01470/FUL` → `stratford-26-01470-FUL`.
- Secretary of State (called-in / recovered): `SOS-<appeal ref as above>`.
- One decision per file. If an application was refused and then decided on appeal, make two files and cross-link them with `related:`.

**Before writing a case, check `cases/` for an existing file on the same decision** (grep the appeal ref, LPA ref and site name). If one exists, enrich it rather than duplicating.

## Frontmatter schema

```yaml
---
case_id: APP-M3645-W-26-6010313
title: Branford Wells, Newchapel            # short site name
authority: Tandridge                        # LPA name
region: South East
decision_maker: inspector                   # inspector | secretary-of-state | court | lpa-committee | lpa-delegated
appeal_ref: APP/M3645/W/26/6010313          # null if none
lpa_ref: 2025/1234                          # null if unknown
decision_date: 2026-09-04                   # ISO date
outcome: dismissed                          # allowed | dismissed | part-allowed | approved | refused | split
procedure: written-representations          # written-representations | hearing | inquiry | householder | committee | delegated
inspector: J Smith                          # or case officer / committee name; null if unknown
development: Conversion of barns to 5 dwellings
dev_type: [housing-minor, conversion]       # vocabulary below
units: 5                                    # dwellings, null if n/a
site_context: [green-belt, rural-lane, listed-building-setting]   # vocabulary below
green_belt: true
grey_belt: accepted                         # accepted | rejected | not-argued | n/a
housing_land_supply_years: 1.97             # as found/agreed in the decision; null if not stated
hdt_percent: null
nppf_applied: 2026-08                       # 2026-08 | "2024-12 (transitional)" | not-cited  (run tools/normalise.py); detail in nppf_applied_note
development_plan: [Tandridge Local Plan Part 2 2014 DP10, DP13]
determinative_policies: [GB6(2), GB7(1)(g)(iii), TR3]   # the NPPF policies that decided the outcome
policy_findings:                            # one entry per NPPF / plan policy the decision-maker made a finding on
  - policy: GB7(1)(g)(i)
    finding: pass                           # pass | fail | harm | benefit | neutral | conflict | accord | not-engaged
    weight: null                            # substantial | significant | great | considerable | moderate | limited | very-limited | null
    note: grey belt — does not strongly contribute to (a), (b) or (d)
  - policy: GB7(1)(g)(iii)
    finding: fail
    weight: null
    note: rural lane, no footways/lighting, car dependent; no genuine choice of transport modes
  - policy: HE6
    finding: harm
    weight: considerable
    note: moderate harm to setting of Grade II farmhouse
key_facts:                                  # the facts that moved the decision, each one line, concrete, with numbers
  - 40 mph lane, no footway or lighting between site and nearest services
  - Council supply 1.97 years
main_issues: [grey belt, sustainable location, heritage, VSC balance]
tags: [sustainable-location-fail, small-scheme, open-market]
weight_of_authority: high                   # high (SoS / inspector inquiry+hearing) | high (inspector WR) | medium (committee) | low (delegated)
related: []                                 # other case_ids (e.g. the LPA refusal this appeal overturned)
sources:
  - https://acp.planninginspectorate.gov.uk/ViewDocument.aspx?fileid=...
local_copy: open:pins-letters/APP-M3645-W-26-6010313.pdf   # null if not downloaded. Prefix open: = data/open-sources/ (OGL: PINS, SoS, Crown),
                                                          # sources: = the private sources repo (council documents), e.g. sources:council/<case-id>-report.pdf;
                                                          # PINS letter text: open:pins-corpus/<ref>.txt
verification: letter-read                   # letter-read | report-read | notice-read | secondary-only
harvested_by: appeals-greenbelt
harvested_on: 2026-09-23
---
```

### Body (after the frontmatter)

```markdown
## Summary
Two to four sentences: what was proposed, what was decided, the one or two reasons.

## Issues and findings
For each main issue: the finding, the policy it was made under, and a short verbatim quote with the decision paragraph number, e.g.
- **Sustainable location — GB7(1)(g)(iii) / TR3: FAIL.** "future occupiers would be heavily reliant on private vehicles" (DL ¶18).

## Planning balance
Which balance was run (GB6(2) VSC "clearly outweighed"; S5(5)/S3 "substantially outweighed"; HE6 harm vs public benefits; s38(6) plan-led) and what went on each side, with weights.

## What made the difference
One paragraph: the decisive facts, and what would have had to be different for the other outcome. This is the most useful part for later reuse.

## Transferable points
Bullets of propositions this decision supports (with ¶ refs), phrased so they can be quoted in a later representation.
```

### Controlled vocabularies (extend if needed, but prefer these)

- **dev_type:** householder, housing-minor (1–9), housing-major (10+), housing-strategic (500+), self-build, replacement-dwelling, conversion, PIP (permission in principle), rural-exception, affordable-led, specialist-housing (care/retirement), travellers, commercial, employment, retail, leisure, agricultural, equestrian, renewable-solar, renewable-wind, battery-storage, telecoms, minerals-waste, infrastructure, change-of-use, listed-building-consent, advertisement, enforcement, other.
- **site_context:** green-belt, washed-over-village, settlement-edge, inside-settlement, open-countryside, isolated, national-landscape (AONB), national-park, conservation-area, listed-building-setting, flood-zone-2, flood-zone-3, SSSI, ancient-woodland, TPO, local-green-space, valued-landscape, PDL, agricultural-land-BMV, rural-lane, near-station.
- **tags:** free text, kebab-case, but reuse existing tags (`grep -h "^tags:" cases/*.md | sort | uniq -c`).

## Rules for harvesters

1. **Only decisions dated 17 August 2026 or later.** If the decision-maker expressly applied the December 2024 Framework (e.g. an appeal where parties weren't consulted on the new one), still record it but set `nppf_applied: "2024-12 (transitional)"` and tag `transitional` — these show how the switch was handled.
2. **Read the primary document** where you can (decision letter, officer report, decision notice). Set `verification` honestly. A case built from a blog summary is `secondary-only` and says so.
3. **Cite paragraph numbers** of the decision letter / report for every quote.
4. **Policy codes** use the 2026 Framework's codes (`nppf-2026-policy-codes.md`). If a decision cites a paragraph of the 2024 Framework, record the 2024 paragraph in the note and map to the 2026 code if obvious (see the mapping at the end of `nppf-2026-policy-codes.md`).
5. **Don't invent facts.** Null is fine. "Not stated in the letter" is fine.
6. Download PDFs to `data/open-sources/pins-letters/` (PINS letters) and `../sources/council/` (council documents, private repo) named `<case-id>.pdf` (council reports may be `<case-id>-report.pdf`, `<case-id>-notice.pdf`).
