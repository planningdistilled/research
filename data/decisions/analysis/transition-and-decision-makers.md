# Transition, decision-makers and housing supply under the August 2026 NPPF

Analyst: analyst-transition-lpa. Date: 23 Sep 2026. Inputs: 792 case files (index/cases.json), the 1,087-letter PINS corpus (open:pins-corpus, regex-scanned and hand-checked), the harvest-log OBSERVED PATTERNS sections, and the NPPF text (open:nppf/NPPF-August-2026.pdf).

**Code mapping used here:** Transitional(1), (2) and (3) are Annex A ¶1, ¶2 and ¶3. Annex A ¶1: the policies apply "from the day of its publication". Annex A ¶2: policies that are "materially inconsistent" get "very limited weight", and other policies "should not be given reduced weight simply because they were adopted prior to" the Framework. Annex A ¶3: where there is a five-year supply and an HDT result above 75%, a local housing need figure higher than the plan requirement is not evidence of unmet need for five years after adoption.

**Caveat on the statistics.** Appeals are refusals under test, and the council harvest over-sampled notable schemes and skipped householder approvals. So the permit rates of 31% for inspectors, 70% for committees and 63% for delegated decisions (index/stats.md) measure selection, not leniency. The finding-level comparisons in §2.5 are the fairer measure.

---

## 1. Headline propositions

### A. The switch of Framework

**T1. The switch was handled by assertion at first. Consulting the parties became the norm only in September.** Strong.
- Counts come from a regex over all 1,087 PINS letters, looking for a switch paragraph that names 17 Aug 2026. Treat them as ±5%.

| Decision date | Letters | Parties consulted | "No material change", not consulted | Noted only | No dated switch paragraph |
|---|---|---|---|---|---|
| 17 Aug | 65 | 0 | 1 | 0 | 64 (98%) |
| 18–31 Aug | 258 | 20 (8%) | 60 (23%) | 29 | 142 (55%) |
| 1–11 Sep | 382 | 106 (28%) | 88 (23%) | 55 | 124 |
| 12–23 Sep | 382 | 160 (42%) | 44 (12%) | 33 | 124 |

- The case tags agree: `parties-consulted-on-2026-framework` 263, `transitional-no-consultation` 191.
- Best statement of the no-consultation position, from PINS-6008701: "While the new Framework included substantial changes from the previous version, the effect of the provisions most relevant to this appeal was not altered significantly … no party's interests have been prejudiced."
- Other examples of the same position: CROWN-2026-0000003 SoR ¶9 and PINS-6008083.
- No PINS procedural note was found (sos-and-other §4).
- Counter-example: inspectors who say plainly that 2024-based arguments are dead, e.g. PINS-6005119 ¶18: "Some of these relate to … paragraph 11(d) of the previous version of the Framework. Clearly such arguments are no longer of relevance."

**T2. A letter dated 17 Aug 2026 is 2024 authority in substance. Do not cite it as 2026 authority unless its text shows otherwise.** Strong.
- 64 of 65 corpus letters dated 17 Aug have no switch paragraph.
- 31 of the 42 cases coded `2024-12 (transitional)` are dated 17 Aug. They apply 11(d), 2024 ¶¶212–215, "great weight" and "less than substantial".
- Examples: PINS-6007179 (3.9 years), PINS-6007771, PINS-6009745 (2.54 years), PINS-6007316, PINS-6005881 and APP-P0119-C-26-3378286.
- Council notices dated the same day did the same: bromsgrove-26-00744-FUL and stratford-25-01271-FUL.

**T3. A small group of later decisions applied the 2024 text outright. These are the live challenge candidates.**
- Six weeks runs from the decision date for s288 and for planning judicial review (CPR 54.5(5)). The "Last day" column is that date.
- Most slips are probably immaterial, because the 2024 and 2026 tests are close. The biggest is PINS-6002759: 140 homes allowed under 11(d) the day after the switch.

| Case | Date | Decision-maker / outcome | What was applied | Last day |
|---|---|---|---|---|
| PINS-6002759, Burton Green, Warwick (140 homes) | 18 Aug | Inspector, allowed | "Framework Paragraph 11d … would not significantly and demonstrably outweigh" (DL ¶28); no mention of the 2026 Framework | 29 Sep |
| SOS-EN010151, Beacon Fen DCO | 21 Aug | SoS DESNZ, granted | Treats the NPPF as a draft still "under consultation"; applies 2024 ¶215 (DL ¶4.3, ¶4.54) | 2 Oct |
| PINS-6009270, Great Henny (Braintree) | 24 Aug | Inspector, dismissed | 2024 ¶¶11(c)/(d), 212 and 215, "less than substantial" | 5 Oct |
| wychavon-W-25-01931-OUT (59 homes) | 25 Aug | Committee (March resolution), approved | Issued with no re-assessment; conditions cite the superseded SWDP | 6 Oct |
| stratford-26-01764-PIP (Kineton) and stratford-26-01393-FUL (Oxhill) | 25 Aug | SDC delegated, approved | 11(d) report plus a one-paragraph "Procedural Issue" note | 6 Oct |
| PINS-6011502, Bradford advert (no case file) | 28 Aug | Inspector, dismissed | Footnote to "NPPF (December 2024), paragraph 141" | 9 Oct |
| PINS-6007837, Walkeringham traveller site | 1 Sep | Inspector (hearing), allowed | 2024 ¶116; the new Framework is not mentioned | 13 Oct |
| PINS-6010844, Gray's Inn Road | 4 Sep | Inspector, dismissed | Re-issue under s56(2) of a 17 Aug letter; 2024 ¶¶212/215 | 16 Oct |
| PINS-6003168, Merton householder (no case file) | 9 Sep | Inspector, dismissed | 2024 ¶215, "less than substantial" | 21 Oct |
| PINS-6007519, Mytchett nursery | 9 Sep | Inspector, dismissed | Calls the Framework "published on 12 December 2024" the "updated national policy context" (DL ¶3). Recoded, see Corrections | 21 Oct |
| SOS-EN020032, Morgan and Morecambe DCO | 14 Sep | SoS DESNZ, granted | Knowingly keeps the 2024 references: "the version in effect during the Examination" (DL ¶4.2) | Planning Act s118 (6 weeks) |

- Also on the SDC side: 26/01514/FUL, Fenny Compton, notice 18 Aug, report cites NPPF 2024. There is no case file (stratford-lpa LEADS). JR window closes 29 Sep.

**T4. Old wording keeps leaking into letters that purport to apply the 2026 Framework, including letters where the parties were consulted.** Strong as a pattern; usually immaterial.
- **"Significantly and demonstrably outweigh"** appears as the operative conclusion in 15 letters dated after 17 Aug:
  - allowed: 6007104 (DL ¶48), 6005328, 6005108 (DL ¶145, inquiry), 6010973 (DL ¶47), 6011694;
  - dismissed: 6002168 (DL ¶191, inquiry), 6004344, 6011471, 6005653, 6007466, 6007431 (alongside S6), 6009042, 6010260, 6010619;
  - 6005664 ¶59 applies it knowingly, as "the old test", on the basis that the scheme passes either way.
- **"Less than substantial"** appears in 51 corpus letters and **"great weight"** in 44. Some are quotes of council reasons, but many are the inspector's own words: 6003168, 6005881, 6009270, 6007478 ("moderate to high level of 'less than substantial' harm as set out in the Framework"), 6005051.
- SDC has the same slip: stratford-26-01399-PIP says "I attribute great weight … as required by the NPPF".
- **2024 ¶11(d) and the "tilted balance"** survive mainly as arguments that the letter rejects: 6005325 ¶25, 6007861 ¶30, 6007348 ¶42, 6007423 ¶23.
- **Why it rarely matters.** The S3–S5 test "substantially outweighed" is at least as demanding as the 2024 formula. It also now applies whatever the supply position. A dismissal that uses the 2024 words has therefore not prejudiced the appellant. The two allowals that used the 2024 wording still re-ran the S5(1) category step — 6007104 (¶21–23, S5(1)(j)) and 6010973 (¶13–22, S5(1)(e)) — so the wording is an immaterial slip, not a missing step. Genuine 2024-wording slips appear only in dismissals, where they do not prejudice the appellant (e.g. 6011471 ¶138). And some apparent slips are not slips at all: 6009443 quotes local policy CLP 1, and 6007423 ¶23 describes an earlier appeal decided under the previous Framework.
- **Mis-citations:**
  - "Annex B" cited for Annex A (6010471 ¶35);
  - S5 cited as "S3 Part 4" (6011694);
  - "Annex E" used correctly for "villages are not large built-up areas" (6011103 ¶12);
  - council reports: GB1 for the GB purposes (bromsgrove-26-00845-PIP), N5(4) for the setting of Protected Landscapes (malvern-M-25-01235-RM), HE5 labelled as covering NDHAs (worcester-26-00541-FUL), "S5(2)" meaning S4(2)(c) (stratford-26-01906-PIP), "HR11" meaning HO11 (maidstone-26-501191-FULL).

**T5. Annex A ¶2 (Transitional(2)) is being applied to the offending part of a policy, not the whole policy.** Strong.
- **Loses:** a restriction that stops what S5(1)(e)/(j) or GB7 now allow.
- **Keeps its weight:**
  - design, heritage, landscape, access and amenity policies (38 of 39 kept);
  - a spatial hierarchy that directs growth to sustainable places, but mostly where the scheme meets no S5(1) category anyway.
- **Inspectors apply it to parts of policies:**
  - 6001260 cut "aspects of Core Policies 2 and 19 which restrict development outside defined settlement boundaries";
  - 6011516 cut DMTC2 B(i)/(ii) but kept B(iii);
  - 6005809 cut the "restrictive parts" of CP3/CP4.
- **Counts** (recounted 2 Oct 2026 over the 96 letters that weigh a plan policy against the Framework; `appeals-review/issue-3-a2-recode.tsv`): spatial policies cut in 30 of 45 letters (16 for a named S4/S5 conflict, 13 for supply, 1 unexplained) and kept in 15; Green Belt policies 4 clause cuts, 8 kept, 1 wholesale; heritage, design, amenity and access 38 kept, 1 cut. This supersedes the earlier estimate of about 13 cut and 17 kept.
- **Best "kept" quote**, 6011217 (South Derbyshire, allowed on other grounds): "Policies H1, SDT1, BNE5 and DP1 are not materially inconsistent with national decision-making policies of the Framework in that they seek to direct development to sustainable locations and support only certain forms of development in rural areas."
- **Heritage and design policies:** "There is no substantive basis to regard them as materially inconsistent with national policy, and they therefore attract full weight" (6007541 ¶3–4, Wandsworth LP1–LP5).
- **Weight still reduced for under-delivery.** Several inspectors say Annex A ¶2 forbids a reduction simply for age, then reduce spatial-strategy weight to "moderate" because the plan is not delivering. This is 2024-style out-of-date reasoning surviving:
  - Cornwall: 6005328 ¶22, 6007431 ¶20, 6007466 ¶25;
  - Shropshire: 6011150 ¶33;
  - Staffordshire Moorlands: 6011103 ¶32;
  - Rother: 6005903 ¶32, "very little weight".

### B. Decision-makers compared

**T6. On the same tests, officers pass and inspectors fail.** Strong.
- S5(1)(j): councils passed it 13 of 13 times; inspectors passed it 26 of 56 times.
- GB7(1)(g)(iii): councils passed it 16 of 18 times; inspectors 16 of 26.
- The "should be refused" triggers are almost only an inspector tool. Inspector fail findings: DP3(3) 31, TR6(4) 27, L2(1)(d) 25, S4(2) 20, S5(2) 15. Councils have used a trigger twice: stratford-26-01376-FUL (F7 via S4(2)(c)) and wychavon-W-26-01322-OUT (DP3(3)).
- HE6(4) fail findings: inspectors 44 (the scheme lost every time); councils 3.
- Grey belt is the exception: members (not officers) produced 5 of the 7 "not grey belt" findings (Basildon ×2, Three Rivers, Dacorum; plus Basildon 25-01188, where officers agreed).

**T7. Members overturn officers by re-grading a matter of judgement, not by disputing facts. Those reasons stand on appeal only where the judgement is defensible on the ground.** Emerging (8 overturns; 4 tested on appeal).
- **Grounds members used:**
  - Grey belt purpose (a) re-graded to "strong": basildon-25-00575-OUT, -01188, -01190 and threerivers-25-2168-OUT. This moves the scheme into very special circumstances, where member discretion is widest, even at 1.2–2.05 years' supply with 50% affordable housing.
  - GB7(1)(h): "c1100m … did not meet the test of 'around 800m'" (threerivers).
  - TR6(4) "severe" against the highway authority's no objection (nuneaton-041303).
  - S5(1)(c) disproportionate replacement (maidstone-26-501191-FULL: 27 → 151 m²).
  - Height and massing under S4 (bathnes-25-04961-FUL).
  - Spatial strategy only, with no Green Belt reason (chorley-25-01052-FULMAJ). This is weak once GB7 is met.
- **On appeal:**
  - Upheld: PINS-6005903 (Rother, 41 homes). The inspector overrode supportive officers and consultees on National Landscape harm (DL ¶¶17, 40, 47). PINS-6010301 (17 Aug, 2024 Framework).
  - Reversed: PINS-6011103 (Biddulph Moor). The members' "large built-up area" view failed on the ground, but costs were refused because it was "a matter of judgement" (costs DL ¶7). PINS-6009167 (Filton HMO). The members' parking objection failed against the council's own transport officer.
- **Rule of thumb.** A member overturn built on a factual reading that is available on site (landscape, heritage, distance) survives. One built on a label that the Framework defines (village ≠ large built-up area, Annex E ¶3; "severe" against unrebutted modelling) is at risk, though costs are unlikely.

**T8. Fallbacks approve schemes at council level; inspectors make the appellant prove them.** Emerging.
- Councils approved in 7 of 8 fallback cases: wychavon-W-26-00329-FUL, bromsgrove-25-01429-FUL, bromsgrove-26-00434-FUL, wychavon-W-26-01828-PIP, stratford-26-01393-FUL, stratford-26-01558-FUL and cotswold-25-03800-FUL. Each applied the Mansell "real prospect" test generously.
- Inspectors allowed 11 of about 60 cases where a fallback was argued. 10 fallbacks were rejected, unproven or unreliable (tags `fallback-rejected`, `-not-evidenced`, `-not-proven`, `pd-fallback-not-reliable`).
- A Class Q fallback neutralises car dependence but moves the argument onto character (PINS-6010401).

### C. Housing supply

**T9. Supply opens the gate; it does not decide the case.** Strong.
- Inspector permit rates are flat across supply bands: under 2 years 3/18, 2–2.99 years 4/27, 3–3.99 years 5/33, 4–4.99 years 4/17.
- Waverley, at 1.28 years, lost all four appeals (6006517, 6006720, 6007130, 6006581).
- Any shortfall, even 4.61 years, makes fn41 / S5(1)(j) "evidenced unmet need" automatic for housing (6005664 ¶44: "such a marginal difference being unimportant").
- An HDT result below 75% opens the gate even where there is a five-year supply: 6008528 ¶10.
- A self-build shortfall can be unmet need at 5.5 years' supply: 6011872 ¶19, 22.
- What decides the case is location (TR3), a "should be refused" trigger or heritage.

**T10. "Substantial" HO7 weight is not automatic for small schemes. Inspectors are split almost evenly; councils are not.** Strong.
- For schemes of 1–9 homes, inspectors gave substantial weight 67 times and a lower word 69 times; councils gave substantial weight 9 of 11 times.
- Where HO7 weight was below substantial, inspectors allowed 2 of 53 appeals. Where it was substantial, 24 of 83.
- Scale discount at acute shortfall: "such provision is only of moderate significance being for only 4 dwellings" (6009281 ¶24, 1.98 years). "I afford substantial weight … I have also taken into account the scale … Overall, the benefits would be moderate" (6011972 ¶16, 1.92 years, HDT 38%). See also 6006286 (1.86 years, "relatively small number"), 6008688 ¶34, 6010313 and 6011736.
- Marginal shortfall: "little weight" at 4.61 years (6009618 ¶28).
- Mismatch with local need lowers the weight: 6010196 ¶31 (need is for smaller homes).
- Other side: "Although the proposal would deliver a single dwelling … significant shortage … substantial weight" (6009357 ¶14, 2.24 years). Also 6007431, 6010442, 6009588 and 6009917.

**T11. Self-build counts only when it is secured.** Strong.
- A self-build shortfall is a real benefit or unmet need where evidenced: 6006950 ¶41–42 (121 plots, secured by UU); 6011253.
- It gets no extra weight where it is unsecured: 6010848 ¶29–33, 6010260, 6008739, 6009303 and 6011872 (a UU requiring only one year's marketing). 20 cases carry the tag `self-build-unsecured`.
- It also loses the BNG exemption (6006289).

### D. Higher authority

**T12. As at 23 Sep there is no SoS or court authority on the 2026 Framework.** Strong (sos-and-other §1, §3).
- No called-in or recovered appeal has been decided since 17 Aug.
- Both SoS DCO letters kept to the 2024 text (T3).
- No judgment construes the 2026 NPPF; the first s288 windows close from 29 Sep.
- Inspector letters are the whole body of authority. Weight them accordingly: inquiry and hearing letters (e.g. 6006637, 6005108, 6005664, 6002168) above written representations; decisions by appeal planning officers (31 cases) lowest.

---

## 2. Fact thresholds

### 2.1 Transition-handling facts to record

| Fact | Consequence | Cases |
|---|---|---|
| Letter dated 17 Aug | Presume 2024 reasoning | T2 list |
| "Parties invited to comment" | 2026 applied deliberately; strongest citation value | 6005903 ¶2, 6011103 ¶4, 6005328 ¶9 |
| "No material or fundamental change", no consultation | 2026 applied with a reduced evidential base; watch for 2024 wording | 6008701, 6008083, CROWN-2026-0000003 |
| 2024 ¶ numbers with no 2026 marker, after 17 Aug | Potential challenge; code as transitional | T3 table |
| "Significantly and demonstrably" in the conclusion | Drafting slip; check whether the S4/S5 category step was done | T4 |
| Council update sheet saying the NPPF "does not affect the substantive matters" | No re-running of S4/S5 categories | stratford-24-03145-FUL, basildon-25-00575-OUT, chorley-25-01052-FULMAJ, malvern-M-25-01044-FUL |

### 2.2 Transitional(2): which local policies were cut to very limited weight, and which survived

| Cut: materially inconsistent, very limited or limited weight | Survived: consistent, full, significant or moderate weight |
|---|---|
| Wiltshire CP2/CP19, "restrict … outside settlement boundaries" (6001260 ¶28) | South Derbyshire H1, SDT1, BNE5, DP1: "direct development to sustainable locations" (6011217) |
| Hinckley & Bosworth DM4 countryside (6004496 ¶22) | South Cambridgeshire S/2, S/7, H/5, TI/2: significant weight (6009303 ¶23, 6011872 ¶27) |
| Cheltenham JCS SD10 (6008569 ¶28) | Shropshire CS1/CS5/CS16, "consistent with TR3" (6008804 ¶15); moderate weight for supply (6011150 ¶33) |
| Torridge ST07, no infill outside Rural Settlements (6009632 ¶24) | Bassetlaw ST1/ST2 substantial weight; but ST28 cut (6006950 ¶53–57) |
| Vale CP3/CP4 restrictive parts: limited (6005809 ¶74–76); CP8/CP4a kept "great weight" | Cornwall spatial policies consistent but moderate for under-delivery (6005328, 6007431, 6007466) |
| New Forest DM20 (6008115 ¶21) | New Forest landscape and design policies (6008115 ¶22) |
| Cheshire East PG3/PG6, which pre-date grey belt (6005877 ¶12, 6010471 ¶35) | Sedgemoor D9, significant weight (6008548) |
| NE Derbyshire SS10 GB PDL (6011330 ¶5); SS9 extensions limited (6011648) | Warwick TR1 safe access; landscape policies (6006637 ¶40, ¶52) |
| Sevenoaks ADMP GB3 "materially harm" test (6012162) | Wandsworth LP1–LP5 heritage and height, full weight (6007541 ¶3–4) |
| Mole Valley EN1 local openness add-on (6005150 ¶10–11) | West Oxfordshire heritage, design, amenity (6009103 ¶36); Dorset ENV2/ENV10 (6007314 ¶26) |
| Wyre SP4 conversion-use hierarchy (6008848 ¶16) | Sefton/Formby NH12, NH15, EQ2, NP WS6 (6008359 ¶23); Lewisham (6010822 ¶54) |
| Hillingdon DMTC4 and DMTC2 B(i)/(ii), Class E frontages (6011516 ¶8–9) | Medway character policies; BNE25 cut only for its locational role (6004691) |

**Pattern.** A policy is cut where it forbids a category that S5(1) or GB7 now permits: countryside, boundary, conversion-hierarchy and pre-grey-belt Green Belt policies. It survives where it states a spatial preference or a quality standard.

**Who won.** In the recount, 13 of the 30 letters that cut a spatial policy were allowed (8 of the 16 cut for a named S4/S5 conflict), against 1 of the 15 that kept it. The cut tracks the S5 result rather than causing it: where the scheme meets an S5(1) category the restriction is cut, and where it meets none the restriction is kept in the context of the appeal. Earlier sample: 6 of about 13 allowed (6001260, 6005877, 6009632, 6010471, 6012162 and 6005809). Losing a restrictive policy rarely rescues a scheme that fails TR3, a trigger policy or heritage (6005150, 6008569, 6008848, 6011516).

### 2.3 Supply, weight and outcome (cases stating a supply figure)

| Supply | Inspector: permitted / n | Inspector HO7 weight (permitted/n) | Council: permitted / n | Council HO7 weight |
|---|---|---|---|---|
| < 2 years | 3/18 | substantial 1/7; significant 1/2; moderate 0/5 | 0/2 (Dacorum 1.18, Three Rivers 1.2, both member refusals) | substantial |
| 2–2.99 | 4/27 | substantial 3/15; moderate 0/5; limited 0/3 | 15/22 (SDC 2.21 ×11; Basildon 2.05 ×4 refused) | substantial 10/11 |
| 3–3.99 | 5/33 | substantial 4/21; limited 0/4 | 5/6 | substantial |
| 4–4.99 | 4/17 | substantial 3/9; limited 0/2 ("little" at 4.61) | 2/4 | substantial |
| ≥ 5 | 0/5 | moderate or limited only; (j) closed unless HDT < 75% or other evidenced need | Wychavon: (j) "not applicable" | — |

HDT figures recorded:
- Castle Point 11% (6007184, allowed);
- Tandridge 38% (6004144, 6011972, 6011736, all dismissed);
- Rother 35% (6005903, 6008634);
- New Forest 48%; Cheltenham 56%; Lewisham 65%; Vale 192%; Cheshire East 213–262%; Wychavon 133%.

A low HDT adds weight rhetorically but has never been decisive on its own.

### 2.4 Did anyone scale "substantial" weight by the number of homes?

| Approach | Cases |
|---|---|
| Substantial in principle, tempered by scale to moderate | 6009281 ¶24 (4 homes, 1.98 years); 6011972 ¶16 and 6011736 ¶16 (Tandridge); 6006286 ¶28; 6010313 ¶33/38; 6008688 ¶34 |
| Lower weight because the homes do not meet the evidenced type of need | 6010196 ¶31; 6009618 ¶28/40; 6010946; 6011088 |
| Limited weight for a PIP range ("only one might be built") | 6011431 ¶23 |
| Substantial even for one home, following HO7's text | 6009357 ¶14; 6007431; 6010442; 6009588; 6009917; 6007054; 6006900; 6008337; all SDC reports |
| Large schemes: substantial, sometimes on top of HO8 affordable | 6005664 (110 homes, "5YHLS is a national requirement"); 6005108; 6007184; 6004144 |

### 2.5 Officer and inspector findings on the same test

| Test | Inspectors | Councils | What tips it at appeal |
|---|---|---|---|
| S5(1)(j) | 26 pass / 30 fail | 13 pass / 0 fail | "Physically well-related": separating fields, lanes, 400–700 m across fields, severance (corpus-nongb-b §2) |
| GB7(1)(g)(iii) / TR3 | 16 / 10 | 16 / 2 | Unfooted, unlit 30–60 mph route; bus timetable not evidenced (6006637 ¶21–24; 6009966 ¶21–22; 6010313 ¶14) |
| Grey belt (Annex B) | 23 / 2 | 7 / 5 | Members re-grade purpose (a); inspectors read the site, not the parcel |
| DP3(3), TR6(4), L2(1)(d) as S4(2)/S5(2) triggers | about 83 fail findings | 2 | Local design-policy conflict "should be refused" (6011803 ¶20; 6010701 ¶34) |
| HE6(4) | 44 fail (0 permitted) | 3 fail; SDC also granted despite "highly detrimental" harm (stratford-26-01906-PIP) | Less-harmful alternative; private benefit excluded |
| S6 | Applied where the NDP is ≤ 5 years old with deliverable allocations (6007431) | Mostly "not engaged"; SDC misreads (§7) | Date the plan was made + allocations limb |

---

## 3. Test sequences as actually applied

**Which Framework?**
1. Is the decision dated 17 Aug 2026 or later? If not, the 2024 Framework applies.
2. Does the letter recite the 17 Aug publication? If not, check for 2024 ¶ numbers. If they are there, it is transitional or 2024-applied (T3).
3. Were the parties consulted? If yes, the 2026 Framework was applied deliberately. If no, look for "no material change" and 2024 wording (T4).

**Plan weight: Annex A ¶2 (Transitional(2)).**
1. For each policy relied on, ask what the Framework now permits that the policy forbids, clause by clause.
2. If a clause forbids an S5(1) or GB7 category, give that clause very limited weight.
3. If the policy is a spatial preference or a quality standard, give it full weight. Inspectors then sometimes cut the weight to "moderate" for under-delivery. This is the divergence in T5.
4. Where the policy was examined against the 2026 Framework, the Annex A ¶2 exception applies. No case yet.

**Supply.**
1. Find the 5YHLS figure and the HDT result. Under 5 years or HDT under 75%: fn41 / S5(1)(j) unmet need is established.
2. Five years or more with HDT over 75%: Annex A ¶3 excludes only the argument that local housing need exceeds the plan requirement, for five years after adoption. Other evidenced need, such as self-build or affordable (6011872), remains available.
3. Wychavon overstates this: "none of the types of development set out within policy S5 are applicable" (wychavon-W-26-01322-OUT).
4. Then the HO7 weight word: substantial, or a lower word for scale or type (T10).
5. Then the decisive tests: TR3, the triggers, heritage.

**Where councils diverge from inspectors:**
- they run S5(1)(j) or GB7 and then the balance, skipping the S4(2)/S5(2) trigger check;
- they fold heritage harm into the S4 balance rather than running HE6(4) first;
- they cut whole plan policies rather than clauses;
- they treat any shortfall as substantial weight for any scale;
- they accept fallbacks on assertion.

**Member overturns:** officers find grey belt (GB7), so the scheme falls into the S5(5) balance. Members re-grade purpose (a), which moves it to GB6(2) very special circumstances, where "clearly outweighed" is not met.

---

## 4. Reference-case shortlist

1. **PINS-6006637**, Hatton Station, Warwick (hearing, 23 Sep). Route quality beats proximity. 350 m to a station on an unlit, unfooted road is not a genuine choice of modes. Also: "absence of recorded collisions … caution"; TR1 access survives Annex A.
2. **PINS-6011217**, South Derbyshire. Spatial-hierarchy policies are "not materially inconsistent".
3. **PINS-6007541**, Wandsworth. Heritage and height policies keep full weight; the appellant's Annex A argument is rejected.
4. **PINS-6001260**, Wiltshire. Only the restrictive "aspects" of settlement-boundary policies are cut.
5. **PINS-6011803**, Kings Langley. A washed-over area is not a built-up area, so S5 applies. A backland breach of local design policy triggers DP3(3) / S5(2) and defeats substantial housing weight.
6. **PINS-6009281** (Bucks, 1.98 years) and **PINS-6011972** (Tandridge). HO7 is tempered by scale to moderate.
7. **PINS-6009357**, Ribble Valley. The counterpoint: substantial weight for a single home.
8. **PINS-6008528**, Mole Valley. HDT under 75% satisfies fn41 despite a five-year supply.
9. **PINS-6005903**, Rother (41 homes, 3.04 years, HDT 35%). A member-style refusal is upheld on National Landscape harm against officer advice; DP3(3) is used as a refusal policy.
10. **PINS-6011103**, Biddulph Moor, and its costs decision. A members' overturn on purpose (a) fails, but costs are refused because it is a judgement.
11. **PINS-6005108**, Drayton (inquiry). Consulted on the new Framework, but concludes in the 2024 formula (DL ¶145). An example of T4.
12. **PINS-6002759**, Burton Green (18 Aug). 11(d) applied after the switch; the challenge window closes 29 Sep.
13. **PINS-6007431**, Menheniot. S6 applied to an NDP under five years old whose allocations are unbuilt but deliverable.
14. **PINS-6005119 ¶18.** 2024 ¶11(d) arguments are "no longer of relevance".
15. **SOS-EN020032.** The SoS knowingly kept the 2024 NPPF (DL ¶4.2).
16. **basildon-25-00575-OUT** and **threerivers-25-2168-OUT**. Templates for member overturns, including the GB7(1)(h) "around 800m" reading.
17. **wychavon-W-26-01322-OUT.** Supply met, so S5(4) exceptional circumstances; DP3(3) encroachment refusal; S5(1)(j) held unavailable.

---

## 5. Distillation notes (for a future agent reading a new decision)

**Always record:**
- the decision date;
- the switch paragraph, verbatim with its ¶, and whether the parties were consulted;
- any 2024 ¶ numbers or phrases: "significantly and demonstrably", "less than substantial", "great weight", 11(d), "tilted balance";
- for each plan policy, the Annex A ¶2 finding: cut, kept, or kept but reduced for supply, with the clause affected;
- the 5YHLS figure, the HDT figure, whose figure it is, and its date;
- the exact HO7 weight word, any scale or need-type qualifier, and the units;
- whether self-build is secured;
- for council decisions: the officer recommendation, the vote, the members' reasons verbatim and any update-sheet wording.

**Fields and tags:**
- `nppf_applied: "2024-12 (transitional)"` whenever the 2024 text is operative, even without an express statement;
- tags `parties-consulted-on-2026-framework` or `transitional-no-consultation`;
- `old-wording-slip` or `old-balance-wording`;
- `overturned-officer-rec` for council decisions, and on the later appeal file;
- `materially-inconsistent-very-limited-weight` versus a new tag `plan-policy-consistent-full-weight`.

**Traps:**
- Letters dated 17 Aug.
- Consulted letters that still conclude in 2024 wording.
- Supply-based weight reduction presented as an Annex A point (it is not).
- "Annex B" cited for Annex A.
- Council "S5(2)" meaning S4(2)(c).
- The SDC IPPS treated as if it were policy.
- An NDP's five-year clock is measured to the decision date, not to the IPPS date (Ilmington).
- The pins-corpus-index code column picks up local plan numbers.

**Proposed schema changes (not applied):**
1. Add a `framework_switch: consulted | not-consulted-no-change | noted | silent | pre-switch`.
2. Add `annex_a_findings: [{policy, clause, result: cut|kept|reduced-supply, weight}]`, instead of burying these in notes under a local plan code.
3. Add `officer_recommendation: approve | refuse | none` and `vote:` for council decisions.
4. Add `challenge_deadline:`.
5. Add `ho7_weight_basis: scale | need-type | supply | text`.
6. Normalise Annex A codes: the stats mix `AnnexA(2)`, `Annex A` and `Transitional(2)` for the same rule. Pick `Transitional(2)`.

---

## 6. Gaps and open questions

- **No SoS, court or s62A decision yet** (§8). Re-harvest after 29 Sep, when the first s288 windows close.
- **Old-style ACP (3xxxxxx) inquiry letters after 17 Aug are not in the corpus.** The large housing inquiries are therefore under-represented.
- **Member overturns.** Only 4 have been tested on appeal. The Basildon trio, Three Rivers, Chorley (6014396) and Nuneaton appeals will test T7.
- **Washed-over villages.** Annex B excludes them from "settlement". Can an edge-of-village site then be "physically well-related to an existing settlement" under S5(1)(j)(i)? No inspector has ruled; SDC assumes yes.
- **SDC HDT 2025 result.** The Minister's 17 Aug letter says 2025 HDT results "will be used for the purposes of decision making", but SDC declined to report it.
- **Annex A ¶2 exception** for plans examined against the 2026 Framework: none yet.
- **Annex A ¶3:** no appeal has yet ruled on it expressly. Watch Wychavon and Malvern (SWDPR, adopted March 2026).
- **HO7 scale split (T10).** This needs a PINS steer or a court ruling.

---

## 7. Stratford-on-Avon practice (for the live objections)

Based on the 21 `stratford-*` cases and harvest-log/stratford-lpa.md, compared with inspectors applying the same tests. No SDC appeal decision was issued between 17 Aug and 23 Sep.

| Test | How SDC officers apply it | How inspectors apply the same test | Use in objections |
|---|---|---|---|
| **Switch of Framework** | Update sheet: "does not affect the substantive matters" (stratford-24-03145-FUL, -25-00346-OUT). "Procedural Issue" paragraph: balance "remains generally consistent" (-26-01764-PIP, -26-01393-FUL). Notices of 17–18 Aug under 2024 (-25-01271-FUL; 26/01514). No re-consultation. | 42% of September letters consulted the parties. Most re-ran the S4/S5 category step rather than asserting it. | Insist the report runs the S5(1) category and S5(2) trigger steps, not "generally consistent". The JR window for the 25 Aug approvals closes 6 Oct. |
| **Transitional(2)** | A stock paragraph cuts CS.15, CS.16 and AS.10 whole, plus CS.10 (housing), CS.20, CS.26 (no "severe" test), CS.8 heritage ("HE5 new criteria") and NDP H1/H3/HLU1/HE5/BE7. CS.10 is kept for householders (-26-01310-FUL). CS.8 is still cited in refusals (-26-01399-PIP). | Only the restrictive clause is cut. Spatial hierarchies are kept (6011217, 6009303, 6008804). Heritage and design policies keep full weight (6007541, 6009103, 6008359). Access policy TR1 is kept (6006637 ¶40). | The strongest point. CS.8 and NDP heritage and design policies are not "materially inconsistent", and CS.26 access requirements survive like Warwick TR1. Cite 6007541 ¶3–4 and 6006637 ¶40. |
| **5YHLS** | 2.21 years at 31 Mar 2025 in every report. It is treated as automatic S5(1)(j) and GB7(1)(g)(ii) need. HDT not reported (Welford update sheet). | Same gate; supply is automatic unmet need (6005664 ¶44). | Do not contest the gate. Fight the weight word and the location. |
| **HO7 weight** | "Substantial" for 1–9 homes. Southam was raised from "significant" to "substantial" on the update sheet. The one dissent: Ilmington, "significant" but "modest" in the heritage balance. | Split 67 / 69 for 1–9 homes. Scale-tempered moderate even below 2 years' supply (6009281 ¶24, 6011972 ¶16). Lower where the homes do not match the needed type (6010196 ¶31). | Ask for moderate weight for 1–9 open-market homes, citing 6009281 and 6011972. Point to SHMA mismatch (large homes). |
| **GB7(1)(g)(iii) / TR3** | Passed where villagers "cope" with unfooted sections (Tanworth, -26-00918-PIP). Snitterfield (-26-00617-PIP) is not an example of accepting carriageway walking: the committee Update Report corrected the report, as the proposed Park Lane footpath puts the whole route on made footpath. Passed on BUAB location alone with no TR3 analysis (Earlswood, -26-01458-FUL). Mitigated by "the car trip is 5–10 minutes". No Connectivity Tool used. | Fails on unlit or unfooted routes at 30–60 mph (6010313 ¶14, 6009966 ¶21). A station 350 m away fails on route safety: "cannot reasonably be regarded as providing a safe route for all users" (6006637 ¶24). A short gap is tolerated only if flat, straight and with good visibility (6011103 ¶19). "Short car journeys" are rejected (6011431 ¶16–17). | Map every unfooted and unlit metre, the speed limit, and the bus timetable. Hatton 6006637 is the closest analogue (Warwick, same rail line, hearing). |
| **"Settlement" and washed-over villages** | Snitterfield, Tanworth and Earlswood are treated as "settlements"; S5(1)(j) is run first, then S5(5) and GB7. Priors Hardwick is treated inconsistently (-26-01211-FUL vs -26-00898-FUL). | Annex B excludes washed-over villages. A washed-over road is not a built-up area, so S5 applies (6011803 ¶18). | Where the village is washed over, S4 is not available, and S5(1)(j)(i) adjacency to a "settlement" is open to challenge (§6). |
| **"Should be refused" triggers** | Used once: F7 via S4(2)(c) (Alcester, -26-01376-FUL). DP3(3) is cited for weight but not as an S5(2) trigger (Snitterfield: substantial-weight character harm, still granted). An L2(1)(d) failure is not run as an S4(2)(a)(ii) trigger (26/01894/PIP recommendation, 23 Sep). | Main refusal route: DP3(3) 31 fail findings; backland breach of local design policy leads to refusal whatever the housing weight (6011803 ¶20). L2(1)(d) is a trigger (6010701 ¶34, 6010619 ¶58–59). | Frame character harm as a breach of a local design policy, then DP3(3), then S5(2)/S4(2)(c). Frame garden plots under L2(1)(d) and S4(2)(a)(ii). |
| **Heritage** | Method decides the result. HE6(4) run first gave a refusal (Ilmington -26-01399-PIP; Quinton -26-00922-FUL; Trinity -26-01387-LBC). Harm folded into S4 gave a grant despite "highly detrimental" harm to a Grade II setting (Long Marston -26-01906-PIP). | HE6(4) is run as a free-standing balance before S4. 44 fails, 0 permitted. Private benefit excluded; less-harmful-alternative filter (6007221, 6004605). | Demand a separate HE6(4) balance with HE6(1) substantial weight to conservation and s66. Cite Ilmington against Long Marston for inconsistency. |
| **S6 / NDPs** | S6 not engaged for NDPs made more than 5 years ago or without allocations: correct for Snitterfield 2018, Welford 2017, Tanworth 2022. But Southam (made 2023, with allocations) was treated as out of date via the IPPS, and Ilmington (made July 2021) was treated as "in date" on 28 Aug 2026, although more than 5 years had passed. | S6 applies where the NDP is ≤ 5 years old and its allocations are unbuilt but deliverable (6007431). A plan more than 5 years old gets no shield (6007104, 6010848). | Check the made date against the decision date. S6(1)(b) asks whether the NDP *contains* allocations, not whether the IPPS calls them out of date. |
| **Grey belt** | Stock paragraph: "a village, some distance from large built-up areas and towns". Also applied to an Ecosite paddock and to a site where a 2019 appeal found significant character harm. | Agrees that villages are not large built-up areas (Annex E ¶3; 6011103). Members elsewhere fight purpose (a) (Basildon). | Purpose (a) is a weak ground. Use "fundamentally undermine" (c)/(e) and limb (iii). |
| **Fallback and PIP** | Class Q fallback carried Oxhill. An extant permission plus S5(1)(d) garden-as-PDL with "no restrictions relating to scale" carried Moreton Morrell (3.4× replacement). PIP detail is deferred to the TDC stage; mitigation is written into the description (Bordon Hill crossing). | Fallback needs evidence (T8). S5(1)(c) is measured against the building as at 17 Aug 2026 (fn25; 6011648). Members at Maidstone rejected garden-as-PDL for an oversized replacement. | Challenge the realism of any fallback and the use of S5(1)(d) to bypass (c). |
| **Emerging SWLP / IPPS** | Reg 19 DS.8, DS.11 and DS.12 conflicts get very limited weight (DM4). Draft allocations are a "very limited but positive" factor. The IPPS (Cabinet 1 Jun 2026) supplies parish need and NDP status. | No inspector has yet ruled on SDC's IPPS. | The IPPS is not development plan and not Framework policy. Challenge its use for S6 dates and "need" figures. |

**Bottom line for SDC objections.** Officers are more generous than inspectors on the four points that decide appeals:
- plan weight (whole policies cut);
- HO7 weight at small scale;
- route quality under TR3 and GB7(1)(g)(iii);
- the "should be refused" triggers, including heritage run first.

An objection that reframes each harm as a trigger failure where the policy says "should be refused" (DP3(3), TR6(4), L2(1)(d), HE6(5) for substantial harm), and runs HE6(4) as its own weighing whose result carries into the balance (HE6(4) is not itself a trigger), with appeal authority, targets exactly where SDC's reasoning departs from the inspectorate.

---

## 8. Pending higher-authority decisions: dates to recheck

| Item | Route | Status at 23 Sep 2026 | Recheck |
|---|---|---|---|
| Albrighton, Patshull Road, Shropshire (800 homes, Green Belt) | Recovered s78; recovery direction 16 Sep | Inquiry closes 9 Oct; decision after the inspector's report, likely 2027 | gov.uk recovered-appeals collection; mid-Oct for inquiry close |
| Croxley Green, Three Rivers (PINS 6004972, about 600 homes, GB7(1)(g)) | s78 inquiry; watch for recovery | Opened 27 Aug; undecided | Monthly |
| MOD Bicester Site A (Cherwell 26/01833/CROWN) | Urgent Crown, MHCLG SoS | Representations closed 17 Sep; decision overdue | Now; case id SOS-PCU-RARE-C3105-3378843 |
| Maple House, Potters Bar (S62A/2026/0159, 293 homes) | s62A | Hearing; target 5 Nov 2026 | Early Nov |
| Laugherne Villa, Martley (S62A/2026/0157) | s62A | Representations to 15 Oct; target 10 Dec 2026 | Mid-Dec |
| Holocaust Memorial, Victoria Tower Gardens | Crown / SoS | Updated documents 20 Aug | Monthly |
| s288 challenges to the T3 letters | Court | Windows close 29 Sep (6002759) to 21 Oct (6003168, 6007519) | Find Case Law and Planning Geek, late Oct |
| "wychavon-high-court-challenge" and Chalfont St Peter (Epilepsy Society) | Court, on 2024-Framework decisions | Launched 22 Sep and 26 Aug | Nov |
| Member-overturn appeals: Basildon ×3, Three Rivers 25/2168, Chorley 6014396, NBBC 041303 | s78 | Pending | Test T7 as each lands |
| SDC committee 23 Sep: 25/00347/FUL (Home Farm crossing) and 26/01894/PIP (Pillerton Priors, L2(1)(d) fail not run as a trigger) | Committee | Decided tonight; minutes about 24–25 Sep | Next harvest |

---

## Corrections made

- **cases/PINS-6007519.md.** `nppf_applied` changed from `not-cited` to `"2024-12 (transitional)"`. Added `nppf_applied_note` and the tags `old-framework-applied-silently` and `transitional`.
  - Reason: DL ¶3 treats the December 2024 Framework as the "revised" / "updated national policy context" in a letter dated 9 Sep 2026. It never mentions the August 2026 Framework.
  - Index not rebuilt. Run tools/normalise.py and build_index.py.
