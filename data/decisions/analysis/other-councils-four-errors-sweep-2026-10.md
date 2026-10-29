# The council sweep scored against the four Stratford errors

Note of 29 October 2026. The 18 October note `other-councils-four-errors-2026-10.md` scored 99 officer reports from 22 other councils against the four errors found in Stratford-on-Avon District Council's reports under the National Planning Policy Framework (NPPF) of 17 August 2026. This note scores the reports fetched by the council sweep of 19 to 20 October 2026 (`tools/council_sweep.py`) with the same rubric, now written out in `four-errors-rubric.md`, and reports what the enlarged set does to the comparison. Not legal advice.

The table is `other-councils-four-errors-sweep-2026-10.tsv` (144 rows, the same columns as the other two tables, `scored_in` = `sweep-2026-10`). Every adverse code carries a PDF page and a verbatim quotation checked by machine against the `pdftotext` extract (`tools/four_errors_sweep.py check`); every "not mentioned" is a text search for TR3 with no hits. The reports are in the private sources checkout at `sources:council/sweep/<council>/<ref>/`.

## 1. What was scored

The sweep listed 1095 officer-report files from the councils it could reach (Stratford excluded). The inventory `other-councils-sweep-inventory-2026-10.tsv` records every one with the reason each excluded file was left out, and `other-councils-sweep-overrides.tsv` holds the four hand exclusions. 145 were scored:

| Excluded because | Files |
| --- | --- |
| not in scope: householder, procedural, ancillary, HMO/C2, traveller, rural worker or tourism proposal | 535 |
| committee file without an application reference in its name (pack or list) | 159 |
| not housing: no new dwelling in the proposal | 157 |
| already in the hand-scored 99 | 79 |
| text extract under 1,500 characters (scan or stub) | 10 |
| duplicate of the same report (smaller file); scored under the other row | 7 |
| not housing: garage conversion to an office | 1 |
| not housing: householder works | 1 |
| not housing: reconfiguration of an already subdivided house, no new unit | 1 |

Housing means new homes, conversions, subdivisions and replacements. Householder works, prior approvals (including Class MA and Class Q), section 73 variations, approvals of details, certificates of lawfulness, listed building consent alone, HMOs, care homes, traveller sites, rural workers' dwellings, holiday accommodation and technical details consents were left out, as were committee files with no application reference in their name (plans, presentations and appeal lists) and text extracts under 1,500 characters. Where a report appeared twice (a committee pack and an enclosure), the larger file was scored.

| Council | Reports scored |
| --- | --- |
| Babergh and Mid Suffolk | 18 |
| Cheshire East | 2 |
| Cotswold | 19 |
| East Devon | 12 |
| Hertsmere | 6 |
| Lichfield | 7 |
| Maidstone | 20 |
| Malvern Hills | 6 |
| Sefton | 9 |
| Solihull | 8 |
| Swale | 6 |
| Three Rivers | 1 |
| Tonbridge and Malling | 18 |
| Uttlesford | 6 |
| Warwick | 1 |
| Worcester City | 4 |
| Wychavon | 1 |

144 reports from 17 councils: 27 committee and 117 delegated, 20 on Green Belt sites. Five councils are new to the comparison: Babergh and Mid Suffolk, Hertsmere, Solihull, Swale (whose reports share the Mid Kent portal with Maidstone and were re-attributed by hand) and Uttlesford. Sefton's reports cite no Framework policy at all and are coded `unclear` on the framework column.

## 2. The comparison

Rates are among the reports where the question arises (`na` rows excluded). The officer's recommendation decides the grant/refuse split.

| Error | Stratford (44) | Hand-scored 22 councils (99) | Council sweep 17 councils (144) | All other councils, 27 (243) |
| --- | --- | --- | --- | --- |
| Tier used as the location test (error) | 6 of 25 (24%) | 5 of 71 (7%) | 4 of 51 (8%) | 9 of 122 (7%) |
| Tier, counting partial | 18 of 25 (72%) | 23 of 71 (32%) | 9 of 51 (18%) | 32 of 122 (26%) |
| TR3 not run (not mentioned, cited only, dodged) | 21 of 27 (78%) | 50 of 81 (62%) | 113 of 134 (84%) | 163 of 215 (76%) |
| TR3 not run, six homes or more | 6 of 8 (75%) | 21 of 40 (52%) | 23 of 30 (77%) | 44 of 70 (63%) |
| Connectivity Tool used | 0 of 44 | 8 of 99 | 3 of 144 | 11 of 243 |
| Green Belt route (S4 or S5 where it does not apply) | 6 of 17 (35%) | 7 of 50 (14%) | 2 of 61 (3%) | 9 of 111 (8%) |
| DP3(3) not asked after a found conflict | 18 of 41 (44%) | 8 of 96 (8%) | 27 of 137 (20%) | 35 of 233 (15%) |
| of which the officer recommended grant | 15 | 3 | 7 | 10 |
| 2024 Framework applied without conversion | 4 of 44 | 3 of 99 | 23 of 144 | 26 of 243 |
| Template paragraph cutting plan policies wholesale | 19 of 44 (43%) | 6 of 99 (6%) | 18 of 144 (12%) | 24 of 243 (10%) |

Council by council, sweep rows only (`na` excluded from denominators):

| Council | n | tier err/partial/ok | TR3 nm/cited/dodged/assessed | Tool | Annex B err/ok | DP3(3) err/ok (grant) | 2024 unconverted | template |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Babergh and Mid Suffolk | 18 | 0/0/4 | 2/13/0/2 | 0 | 0/8 | 2/14 (0) | 1 | 5 |
| Cheshire East | 2 | 0/0/1 | 1/0/0/1 | 1 | 0/1 | 0/2 (0) | 1 | 0 |
| Cotswold | 19 | 3/1/2 | 9/8/0/1 | 0 | 0/13 | 6/13 (2) | 1 | 4 |
| East Devon | 12 | 0/1/8 | 10/1/0/1 | 0 | 0/5 | 5/6 (2) | 5 | 2 |
| Hertsmere | 6 | 0/0/1 | 4/0/0/2 | 1 | 0/3 | 0/6 (0) | 0 | 0 |
| Lichfield | 7 | 0/0/1 | 5/0/0/0 | 0 | 0/1 | 0/7 (0) | 1 | 0 |
| Maidstone | 20 | 1/0/8 | 3/14/0/1 | 0 | 1/10 | 5/15 (1) | 1 | 0 |
| Malvern Hills | 6 | 0/0/4 | 4/0/0/1 | 0 | 0/2 | 1/5 (0) | 3 | 0 |
| Sefton | 9 | 0/0/0 | 7/0/0/0 | 0 | 0/0 | 0/7 (0) | 0 | 0 |
| Solihull | 8 | 0/1/4 | 2/0/0/6 | 0 | 0/3 | 1/7 (1) | 2 | 0 |
| Swale | 6 | 0/0/1 | 5/1/0/0 | 0 | 0/2 | 3/3 (1) | 1 | 1 |
| Three Rivers | 1 | 0/0/0 | 0/0/0/0 | 0 | 0/1 | 0/0 (0) | 0 | 0 |
| Tonbridge and Malling | 18 | 0/1/4 | 9/3/0/6 | 1 | 1/9 | 1/17 (0) | 2 | 6 |
| Uttlesford | 6 | 0/1/4 | 6/0/0/0 | 0 | 0/1 | 1/5 (0) | 5 | 0 |
| Warwick | 1 | 0/0/0 | 1/0/0/0 | 0 | 0/0 | 0/0 (0) | 0 | 0 |
| Worcester City | 4 | 0/0/0 | 4/0/0/0 | 0 | 0/0 | 2/2 (0) | 0 | 0 |
| Wychavon | 1 | 0/0/0 | 1/0/0/0 | 0 | 0/0 | 0/1 (0) | 0 | 0 |
| **Stratford** | **44** | **6/12/7** | **13/7/1/6** | **0** | **6/11** | **18/23 (15)** | **4** | **19** |

## 3. What the enlarged set shows

- **Stratford stays an outlier on all four.** Against all 243 other-council reports, the tier error runs at 24% at Stratford and 7% elsewhere; the Green Belt route error at 35% and 8%; the wholesale weight cut at 43% and 10%; and approval recommended after an unaddressed design conflict 15 times at Stratford against 10 across the 27 councils together.
- **The tier error outside Stratford is a Cotswold habit.** 4 sweep reports rest a location finding on a tier or boundary with no route fact: Cotswold 26/02006/PLP (South Cerney (land south east of Merlins, Silver Street)), Cotswold 26/01577/FUL (South Cerney (land off Huxley Court)), Cotswold 26/02330/PLP (Upper Oddington (Braecroft)), Maidstone 26/502459/FULL (Langley Heath (land adjacent to The Oast, Horseshoes Lane)). Three are Cotswold's Non-Principal Settlement reasoning ("Non-Principal Settlements constitute sustainable locations for small scale residential development even if they have limited facilities", Upper Oddington p.7); one is Maidstone's hierarchy used in the refusal direction at Langley Heath. Every other council's location findings give a distance, a footway, a frequency or a station.
- **The Green Belt route is mostly right.** 2 of 61 sweep reports where the question arises run S5 on a Green Belt site (Maidstone 26/502713/PIP, Tonbridge and Malling 26/00049/FL), both beside a full GB7 assessment and without changing the result. Hertsmere, Solihull, Three Rivers and Tonbridge and Malling state S5(5) in terms. No sweep report applies S4 in a washed-over village; the only washed-over sites in the sweep are two Tonbridge and Malling infill cases decided under GB7(1)(c).
- **DP3(3).** The sweep's error rate (20%) is above the hand-scored set's (8%) because 20 of its 27 errors are refusals where the design or landscape conflict is itself a refusal reason, and because the broad landscape-character reading is applied throughout. The 7 grant-after-conflict reports are Cotswold 26/02006/PLP (South Cerney (land south east of Merlins, Silver Street)), Cotswold 26/02330/PLP (Upper Oddington (Braecroft)), East Devon 22/2781/MOUT (Seaton (land adjacent to Harepath Road)), East Devon 25/1788/MOUT (Seaton (land south of Harepath Hill)), Maidstone 25/504992/FULL (Staplehurst (land adjacent to Dane Mead Villas, George Street)), Swale 24/504121/HYBRID (Bobbing (land at Grove Farm, Bobbing Hill)), Solihull PL/2025/01502/PPOL (Tidbury Green (land west of Rumbush Lane)). Five of the seven are outline or permission-in-principle schemes where landscape harm was found and weighed; the two Cotswold permissions in principle acknowledge a conflict with the settlement pattern and grant anyway.
- **The template paragraph has cousins.** 18 sweep reports (12%) cut a plan policy wholesale: Babergh and Mid Suffolk (5), Cotswold (4), East Devon (2), Swale (1), Tonbridge and Malling (6). Babergh's delegated template reduces the weight of its spatial policies for the supply shortfall; Cotswold's gives DS3 and DS4 "very limited weight" as "materially inconsistent"; Tonbridge and Malling gives CP14 no weight or reduced weight on the same ground, or on age. Solihull's cut of P7 for being "prescriptive on expected distances" is a reasoned Annex A(2) judgement and is not counted.
- **Unconverted 2024 reports are commoner than the hand-scored set suggested.** 23 sweep reports (16%) rest a decision made after 17 August 2026 on a 2024 report with no conversion. Most are committee resolutions from 2024 or 2025 issued as notices after a legal agreement (East Devon, Uttlesford, Solihull, Malvern Hills, Tonbridge and Malling); a few are delegated reports written to the old Framework in August and September 2026 (Rockbeare, Tovil, Lichfield city centre, Sheerness). Tonbridge and Malling's supplementary reports of 19 August and its review report of 16 September are the model conversion.
- **The Connectivity Tool stays rare.** 3 sweep reports use it (Cheshire East at Church Lawton, Hertsmere at Shenley, Tonbridge and Malling at Trottiscliffe), and Solihull sets it aside at Peartree Farm as holding outdated bus data. 232 of 243 other-council reports do not use it.

## 4. Limits

- The sweep reaches 17 councils with a housing report in the period. Registers behind a login (North Hertfordshire, Horsham, Mid Sussex, Reigate and Banstead) or a bot wall (ten modern.gov sites, Rugby, Warwick's CMIS, Cheshire East's register), councils that publish no delegated reports (Basildon, Chorley) and councils with a notice only (Bromsgrove, Redditch) are under-represented or absent; see the council-sweep memory note and `harvest-log/council-register.tsv`.
- The sweep set was read through keyed passages, not cover to cover (`four-errors-rubric.md`, "How the sets were read"). Where the excerpts left a judgement open the report was searched again, and every adverse code was checked against the page; a reading error that leaves a quotation intact is still possible, and the inventory and table are published so that it can be found.
- The housing filter is a regular expression over the register's proposal text plus the report head, with four hand overrides. Proposals the register truncated may have been excluded; the inventory lists them.
- Sefton's reports cite the Local Plan only; Swale's and Worcester City's cite the Framework by name without a policy code in several reports. Those rows carry `unclear` or `2026 (named only)` on the framework column and are counted neither as unconverted nor as mixed.
- Outcomes for committee items are the recommendation where the minutes were not checked; the outcome column says so.

## 5. Files

- `other-councils-four-errors-sweep-2026-10.tsv`: the scored table (144 rows).
- `other-councils-sweep-inventory-2026-10.tsv`: every report file the sweep listed, with the reason each excluded one was left out.
- `other-councils-sweep-overrides.tsv`: hand exclusions applied by the inventory.
- `four-errors-rubric.md`: the rubric shared by the three tables.
- `tools/four_errors_sweep.py`: `inventory`, `screen`, `read`, `excerpt` and `check`.
- The page: `pages/authority/officer-reports-compared/build.mjs`, which computes every count from the three tables and checks every quotation at build time.
