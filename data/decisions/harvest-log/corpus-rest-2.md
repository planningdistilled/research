# Harvest log — corpus-rest-2

Agent: corpus-rest-2 (plus two forked sub-agents, which handled rows 41–80 and 81–119). Date: 2026-09-23.
Work list: `slices/rest-2.tsv`, 119 new-style PINS decisions (17 Aug–23 Sep 2026). These are heritage, design, amenity, highways, conditions, prior approval and some principle cases that fell outside the Green Belt and principle slices.

## Method
- Source: `data/open-sources/pins-corpus/<ref>.txt` (full letter text). PDF URL from `docs.map`. No PDFs downloaded; `local_copy` points to the corpus .txt.
- Before writing, I grepped each ref against `cases/`. None of the 119 already existed.
- Each letter was read in full, with conditions schedules stripped. Triage used the BRIEF tiers: 30 tier 1 and 88 tier 2.
- `uv run tools/build_index.py` was run at the end. There are no WARN lines for rest-2 files. Two "missing determinative_policies" warnings on Class Q files were fixed with mapped codes, noted in the files as mapped.
- Linked appeals (planning plus LBC or advert pairs) are recorded in one file under the ref in the slice. The companion refs are 6003398, 6004392, 6004675, 6006023, 6007216, 6007479, 6007968, 6008697, 6009242, 6010167, 6010461, 6010618, 6010810, 6010845 and 6013697.

## Counts
- 118 case files written (PINS-<ref>.md); 0 enriched; 1 skipped.
- Skipped: **6008247** (18 Manland Way, Harpenden). The appeal was declared invalid because the application lacked the BNG information required by DMPO Art 7(1A), so there is no merits decision.
- Outcomes: 55 allowed and 63 dismissed.
- `nppf_applied` values:
  - 95 × 2026-08
  - 6 × "2024-12 (transitional)": 6002759, 6007179, 6007771, 6007837, 6009745 and 6010844
  - The remainder: Framework not cited or version unstated (mostly GPDO prior approvals and amenity-only letters)
- The forks introduced some non-standard `nppf_applied` values that the coordinator may want to normalise: `none-cited`, `not cited`, `unstated`, `unclear` and `not-applicable`.

## Coverage table
| ref | tier | outcome | determinative codes | nppf_applied |
|---|---|---|---|---|
| 6002006 | 1 | allowed | P3, N4 | 2026-08 |
| 6002759 | 1 | allowed | S3 | 2024-12 (transitional) |
| 6002971 | 2 | dismissed | DM6 | 2026-08 |
| 6003400 | 2 | allowed | HE5(2)(b) | unstated |
| 6003539 | 2 | allowed | F5, CC3, P3 | 2026-08 |
| 6004393 | 1 | dismissed | HE6(3), HE6(4) | 2026-08 |
| 6004528 | 2 | dismissed | TR4(1)(d) | not cited |
| 6004673 | 1 | dismissed | HE6(1), HE6(3), HE6(4) | 2026-08 |
| 6005051 | 1 | dismissed | HE6(3), HE6(4), TR6(4) | 2026-08 |
| 6005123 | 2 | dismissed | P3 | not cited |
| 6005312 | 2 | dismissed | DM6 | 2026-08 |
| 6005744 | 2 | dismissed | P3(2)(a) | not cited (GPDO prior approval) |
| 6005849 | 2 | dismissed | P3(2)(a) | unstated |
| 6005963 | 2 | allowed | P3 | 2026-08 |
| 6005999 | 2 | dismissed | HE6(1), HE6(4) | 2026-08 |
| 6006027 | 1 | dismissed | HE6(1), HE6(3), HE6(4) | 2026-08 |
| 6006162 | 1 | dismissed | HE4(2), HE6(1), HE6(3), HE6(4) | 2026-08 |
| 6006244 | 2 | allowed | HO9 | 2026-08 |
| 6006329 | 2 | dismissed | HE7(2), TR4(1)(c)(i) | unstated |
| 6006409 | 2 | dismissed | P3(2)(b) | unstated |
| 6006636 | 2 | dismissed | HO9 | not cited |
| 6006805 | 2 | allowed | N6, P3 | 2026-08 |
| 6006811 | 2 | allowed | P3(2), TR6(4) | 2026-08 |
| 6006920 | 2 | allowed | DP3 | not cited |
| 6006957 | 2 | allowed | DP3, P3 | 2026-08 |
| 6007094 | 2 | allowed | HE9, HE7 | 2026-08 |
| 6007128 | 1 | dismissed | S4(1), L2(1)(d)(i), L2(1)(d)(ii), N6(1)(a)(i) | 2026-08 |
| 6007179 | 1 | dismissed | S3, TR3 | 2024-12 (transitional) |
| 6007217 | 2 | allowed | HE9, TR4(1)(c) | 2026-08 |
| 6007305 | 2 | dismissed | P3(2)(a) | not cited |
| 6007355 | 1 | dismissed | HE6(1), HE6(3), HE6(4), DP3(5) | 2026-08 |
| 6007422 | 2 | allowed | P3, P4 | 2026-08 |
| 6007465 | 2 | allowed | DM6 | 2026-08 |
| 6007478 | 1 | dismissed | HE6(3), HE6(4) | 2026-08 |
| 6007521 | 2 | allowed | DM6, TR6(4), TR4(1)(c) | 2026-08 |
| 6007566 | 2 | allowed | TR4(1)(c)(i) | 2026-08 |
| 6007657 | 2 | allowed | DM6 | not cited (GPDO prior approval) |
| 6007680 | 2 | dismissed | DP3, P3(2)(b), TR6(4) | 2026-08 |
| 6007771 | 1 | dismissed | S3, DP3(3) | 2024-12 (transitional) |
| 6007837 | 2 | allowed | TR6(4) | 2024-12 (transitional) |
| 6007883 | 2 | dismissed | S4(1) | 2026-08 |
| 6007971 | 2 | allowed | HE5(2)(b) | 2026-08 |
| 6008050 | 2 | dismissed | Lewes LP CP11, Lewes LPP2 DM25 | none-cited |
| 6008170 | 1 | allowed | N2(3), N2(1)(f), DM6(1) | 2026-08 |
| 6008197 | 2 | allowed | DM6(2)(c), DM6(1)(c) | 2026-08 |
| 6008247 | skipped | invalid | — | — |
| 6008290 | 2 | allowed | HE5(2)(b) | 2026-08 |
| 6008361 | 2 | allowed | Enfield DMD5 | 2026-08 |
| 6008438 | 2 | dismissed | P3(2)(a), S4(1) | 2026-08 |
| 6008475 | 1 | dismissed | HE6(1), HE6(4) | 2026-08 |
| 6008491 | 2 | allowed | P3, DP3 | 2026-08 |
| 6008532 | 2 | allowed | HE7(1), HE9 | 2026-08 |
| 6008542 | 2 | allowed | Castle Point LP H2 | none-cited |
| 6008594 | 2 | allowed | Tameside UDP C1 | 2026-08 |
| 6008667 | 1 | dismissed | L2(1)(d)(iii), DP3 | 2026-08 |
| 6008701 | 2 | allowed | HE9, TR4 | 2026-08 |
| 6008736 | 2 | dismissed | Vale LP CP46 | 2026-08 |
| 6008784 | 1 | dismissed | HE6(1), HE6(3), HE6(4), S4(1) | 2026-08 |
| 6008872 | 2 | allowed | HO1(2)(f), Havering LP Policy 6 | 2026-08 |
| 6008903 | 2 | allowed | DM6(2)(c), DM6(1) | 2026-08 |
| 6008924 | 2 | allowed | GPDO Sch2 Pt3 Class MA.2(2)(f) | none-cited |
| 6009059 | 2 | dismissed | DP3(3), Havering LP Policy 8 | unclear |
| 6009081 | 2 | allowed | HE5(2)(b) | 2026-08 |
| 6009118 | 2 | dismissed | Brentwood LP BE14, P3(2)(b) | 2026-08 |
| 6009132 | 1 | allowed | HO9(1)(b) | 2026-08 |
| 6009149 | 2 | dismissed | Bournemouth CS41, BNG statutory condition | 2026-08 |
| 6009193 | 2 | dismissed | GPDO Class MA.2(2)(d), P4 | 2026-08 |
| 6009241 | 2 | allowed | TR6(4), TR4(1)(c) | 2026-08 |
| 6009279 | 2 | allowed | KLWN LP LP21, KLWN LP LP18 | 2026-08 |
| 6009405 | 2 | allowed | HE9, HE6, DM7 | 2026-08 |
| 6009448 | 2 | allowed | DM6(1), West Berkshire LPR SP6 | 2026-08 |
| 6009473 | 2 | allowed | GPDO Class MA.2(2)(d), P3(1), P3(2)(a) | 2026-08 |
| 6009558 | 2 | allowed | Gosport LP LP10 | 2026-08 |
| 6009578 | 2 | dismissed | Chesterfield LP CLP14, P3(2)(a) | 2026-08 |
| 6009620 | 2 | dismissed | Eastbourne CS D10a, EBP UHT1 | none-cited |
| 6009660 | 2 | allowed | TR6(4) | 2026-08 |
| 6009688 | 1 | dismissed | TR4(1)(a), TR4(1)(c)(i), Barnet LP CDH01 | 2026-08 |
| 6009745 | 1 | dismissed | NPPF2024 para 11(d)(ii), Test Valley RLP COM2, TR3 | 2024-12 (transitional) |
| 6009772 | 1 | dismissed | HE6(3), HE6(4), HE4, DP3 | 2026-08 |
| 6009850 | 2 | dismissed | GPDO Class Q.1(i)(ii), GPDO Class Q.1(i)(vi) | not-applicable |
| 6009933 | 2 | dismissed | DP3 | 2026-08 |
| 6009972 | 2 | dismissed | P3(2)(a) | 2026-08 |
| 6010036 | 2 | allowed | HE7(2) | 2026-08 |
| 6010095 | 2 | dismissed | P3(2)(b) | 2026-08 |
| 6010163 | 2 | dismissed | F4, P3(2)(a) | 2026-08 |
| 6010191 | 1 | dismissed | S4(1), P3(2)(b), DP3(2)(a) | 2026-08 |
| 6010238 | 1 | dismissed | HE6(4), HE9 | 2026-08 |
| 6010311 | 2 | allowed | HE9 | 2026-08 |
| 6010375 | 2 | dismissed | P3(2)(b) | 2026-08 |
| 6010409 | 2 | dismissed | DM9 | 2026-08 |
| 6010430 | 2 | dismissed | TR6(4) | 2026-08 |
| 6010460 | 2 | allowed | TR4(1)(c), TR6(4) | 2026-08 |
| 6010523 | 2 | allowed | DP3 | 2026-08 |
| 6010552 | 2 | dismissed | HO9, L2(1)(d)(ii) | 2026-08 |
| 6010617 | 1 | dismissed | DP3, TR4(1)(c)(iii) | 2026-08 |
| 6010649 | 2 | dismissed | P3(2)(a) | 2026-08 |
| 6010756 | 1 | dismissed | N4 | 2026-08 |
| 6010772 | 2 | dismissed | N2 | 2026-08 |
| 6010808 | 2 | allowed | DM6 | 2026-08 |
| 6010828 | 2 | dismissed | HO9, P3 | 2026-08 |
| 6010844 | 1 | dismissed | HE6(4), P5 | 2024-12 (transitional) |
| 6010861 | 1 | allowed | HO7(1), HO9(1) | 2026-08 |
| 6010896 | 2 | allowed | P3(2)(b) | 2026-08 |
| 6010929 | 2 | allowed | HO9 | 2026-08 |
| 6010975 | 2 | dismissed | DM9 | 2026-08 |
| 6010993 | 2 | dismissed | P3 | 2026-08 |
| 6011040 | 1 | allowed | S4(1), HO7(1), L2(1)(d) | 2026-08 |
| 6011071 | 1 | dismissed | HE6(4), HE7(2) | 2026-08 |
| 6011206 | 2 | dismissed | DP3 | 2026-08 |
| 6011347 | 2 | allowed | DP3 | 2026-08 |
| 6011401 | 2 | dismissed | P3(2)(b), TR4(1)(e) | 2026-08 |
| 6011471 | 1 | dismissed | HE6(4), P3(2)(b), TR6(4) | 2026-08 |
| 6011598 | 2 | allowed | DM6 | 2026-08 |
| 6011719 | 2 | dismissed | DM9 | 2026-08 |
| 6011886 | 2 | allowed | N4(1) | 2026-08 |
| 6012021 | 2 | allowed | TR4(1)(e) | 2026-08 |
| 6012239 | 2 | allowed | P3(2)(a) | 2026-08 |
| 6012437 | 2 | allowed | P3 | 2026-08 |
| 6013695 | 1 | dismissed | HE6(1), HE6(4), CO1 | 2026-08 |

## Quirks
- **6010844:** s56(2) re-issue (4 Sep) of a 17 Aug decision. It still applies the 2024 Framework (¶¶212, 215).
- **6012437:** the published PDF has the appellant's final comments appended after the decision.
- **6012239:** the corpus index tag "HO9" is Bradford Core Strategy HO9, not the NPPF policy.
- **6006957:** decided on the recommendation of an Appeal Planning Officer.
- **Tier-2 files where the letter never cites the Framework:** a nearest-fit 2026 code is recorded in `determinative_policies` so that the index builds. Each policy note says "Framework not cited" or "mapped". Treat these codes as harvester mapping, not Inspector findings.

## LEADS NOT FOLLOWED
- **Camden BT hub concurrent appeals** (same Inspector as 6010844): outside 297 Pentonville Road and outside the Standard Hotel. Comparators cited: 6003955, 6003956, 6003952, 6003954, 6003065, 6003067, 6002191, "600233" (sic).
- **Older Camden hub and kiosk appeals** cited in 6007217: APP/X5210/W/20/3253878, APP/X5210/Z/20/3253540, APP/X5210/W/22/3297273, APP/X5210/W/22/3297276.
- **Class Q:**
  - 6007456: linked Class Q appeal at Brookfields Farm, Hankelow; four dwellings in the barn next door.
  - Cited comparators: PP/H4505/W/25/3363090, PP/J1869/W/25/3364410, APP/Z2505/W/25/3367067 (Friths Farm), APP/Y3940/W/24/3352918, APP/M2840/W/25/3362279, APP/M2840/W/25/3367852, APP/Q3115/W/25/3366845.
- **Children's homes:**
  - 6000705: 113 Pretoria Road, Romford; need not shown.
  - Oadby Policy 11 split: APP/L2440/W/24/3355109 and APP/L2440/W/24/3336468.
  - Cited in 6011401: APP/X1735/W/25/3367889, APP/P4605/W/25/3371002, APP/A1530/W/25/3374737.
- **Other refs cited in letters:**
  - 6012438: 15 Stanfield Road, Bournemouth; LDC appeal.
  - Enfield: APP/Q5300/W/25/3360248 (9 The Spinney HMO) and APP/Q5300/W/24/3345524 (26 Beech Hill).
  - APP/V1260/W/24/3357398: Bournemouth HMO roof works.
  - APP/P1425/W/20/3253947: 92 Allington Road, Newick.
  - APP/D1780/W/22/3299729 and H/22/3299730: Bargate Street.
  - APP/D1590/W/18/3208223: Stirling Avenue.
  - Bromley outlook appeals: APP/G5180/W/25/3359027 and APP/G5180/W/24/3357689.
  - APP/D0840/W/20/3247124: Dunmere, Bodmin.
  - APP/D0840/W/24/3351090: Prow Park, the original permission.
- **Separate costs decisions not harvested:** 6002759, 6002971, 6003539, 6005123, 6006805, 6007305, 6007680, 6007971, 6008170, 6008784, 6008872, 6008903, 6008924, 6009149, 6009448, 6010409, 6010649, 6011886.

## OBSERVED PATTERNS
- **"Less than substantial" is being dropped, but not consistently.** Many Inspectors now grade heritage harm on a free scale inside a single "harm" category. The most explicit is 6007355: "harm (insofar as it relates to the categories of "harm" listed in the Framework) … minor". Other wordings:
  - "towards the lower end of harm", anchored on the PPG (PINS-6006162)
  - "a modest degree of harm" (PINS-6004393)
  - "a moderate degree of harm" (PINS-6006027, PINS-6013695)
  - "to a lower level within this category", naming no category (PINS-6004673)
  - "a low degree of harm" (PINS-6008784)
  - "at the lower level" (PINS-6011071)
  - Harm left ungraded (PINS-6005999, PINS-6008475, PINS-6010238)
- **Old wording persists even after consultation on the 2026 Framework:**
  - "lower end of less than substantial" (PINS-6005051)
  - "moderate to high level of 'less than substantial' harm as set out in the Framework" together with "great weight" (PINS-6007478). This is a misstatement of the 2026 text that could be challenged.
  - Conservation-area and NDHA harm still called "less than substantial" (PINS-6011471, PINS-6010036)
  - "great weight" in the conclusion despite describing the change (PINS-6010617)
- **Grading harm lower does not change the result.** Every graded finding, even "minor" or "lower end", is carried through HE6(3) as "considerable importance and weight". HE6(1) substantial weight to conservation is usually recited. In this slice no heritage-harm appeal was allowed on the HE6(4) balance where harm was actually found. Heritage allowances came from findings of no harm or a neutral effect under HE5(2)(b) (PINS-6003400, PINS-6007971, PINS-6008290, PINS-6009081, PINS-6007094, PINS-6007217).
- **The new HE6(4) public-benefit examples are acknowledged but have not yet helped any appellant.** Energy efficiency and low-carbon heating were each discounted:
  - Not shown to be the only way to get the benefit, e.g. secondary glazing or slim double glazing (PINS-6007478, PINS-6006162)
  - Not beyond Building Regulations compliance (PINS-6006027, which borrows the DP3(5) "outstanding design" test)
  - Given substantial weight in principle but minor at domestic scale (PINS-6007355: 67% carbon cut, still dismissed)
  - "Long-term reuse of an underused listed building" failed where the asset was already in optimum viable use, or the reuse was not secured by an obligation or phasing (PINS-6006027, PINS-6004673).
- **The question "could a less harmful scheme deliver the same benefit?" is the recurring decisive filter under HE6(4).** Seen in PINS-6004393 (charity café plant), PINS-6006027, PINS-6007478, PINS-6006162, PINS-6010238 (NHS dentistry) and PINS-6008475. Private amenity is consistently excluded from public benefits (PINS-6004673, PINS-6005999, PINS-6007355, PINS-6008784).
- **DP3(3) "should be refused" is almost never used as a stand-alone trump in 2026-applied letters.** Design refusals run through local plan policies, with DP3 cited for consistency. The clearest "should be refused" reasoning is under the 2024 ¶139 in PINS-6007771, a transitional letter. PINS-6009059 has the phrase as a closing principle only. DP3(5) (substantial weight for innovative or sustainable design) is read as conditional on fitting the "overall form and layout" (PINS-6007355).
- **S4 and L2(1)(d) in urban intensification.** PINS-6007128 is the best example: HO7 substantial weight and a 2.55-year supply, yet the scheme was "substantially outweighed". The Inspector used L2(1)(d)(i) (street scene) and (ii) (living standards) as adverse-effect tests within S4, plus N6(1)(a)(i) for unsecured habitats mitigation. PINS-6008667 treated L2's footprint and 50% curtilage limits as a gate: breaching them made L2 substantial weight "not available". PINS-6011040 stacked S4, HO7 and L2(1)(d) and allowed. Several S4-type conclusions still use "significantly and demonstrably" (PINS-6008438, PINS-6011471, PINS-6009059).
- **The transition was handled unevenly:**
  - About half the letters consulted the parties.
  - Most of the rest said the changes were immaterial. Only PINS-6012021 said the relevant text had materially changed.
  - Six letters dated 17 Aug–4 Sep applied the 2024 Framework outright, including ¶11(d) tilted balances: PINS-6002759 (140 homes allowed, 18 Aug), PINS-6007179 (3.9 years, 17 Aug), PINS-6007771 (4.07 years, 17 Aug), PINS-6009745 (2.54 years), PINS-6007837 (1 Sep, ¶116) and the re-issued PINS-6010844.
  - GPDO prior-approval letters mostly ignore the Framework, except where W(10)(b) imports P3 (PINS-6007422, PINS-6009473).
- **P3 is being read as a technical noise and daylight standard.**
  - PINS-6002006: SOAEL/LOAEL; a condition requiring inaudibility over-reaches P3.
  - PINS-6005849: external amenity noise 58 dB over the 55 dB guideline was decisive despite good internal mitigation.
  - PINS-6009473: P3's "preexisting conditions" wording pulls railway noise into Class MA.
  - Absence of any acoustic evidence was fatal in PINS-6006409 and PINS-6007680.
  - P4 agent-of-change was applied both ways (PINS-6005849 pub, PINS-6007422 farm).
- **TR6(4) and TR4.** Parking stress on its own is not a safety harm: "Inconvenience in finding a parking space does not, in itself, amount to harm" (PINS-6006811). The same line appears in PINS-6009660 and PINS-6007566. TR4(1)(a) walking-first priority decided PINS-6009688. Fallback permissions carry heavy weight on trip comparisons (PINS-6007521, substantial weight).
- **DM6 is used actively to strip or trim conditions.** Examples:
  - Removal of PD rights refused (PINS-6006920, PINS-6007465, PINS-6008197, PINS-6008903)
  - Zebra-crossing condition deleted (PINS-6007521)
  - Tailpiece clauses removed (PINS-6002006)
  - Simultaneous-construction mechanism refused, consistent with L2(2) though L2(2) is not cited (PINS-6007094)
  - Car-free Grampian condition upheld without a s106 (PINS-6005312)
- **Children's homes (HO9/HO7) are inconsistent, and need evidence decides them.**
  - Allowed where the Council's own Sufficiency Assessment showed need (PINS-6006244) or where HO7 substantial weight was applied (PINS-6010861).
  - Dismissed where Borough-specific need was absent (PINS-6006636), or the provision was given no weight (PINS-6011401).
- **Street hubs turn on the baseline and setting.** Allowed where a like-for-like replacement sits in a cluttered commercial street (PINS-6003400, PINS-6007217, PINS-6008701, PINS-6009241, PINS-6010460, PINS-6010808). Dismissed where the setting is verdant, uncluttered or listed (PINS-6009772, PINS-6010617, PINS-6010844, PINS-6013695). In PINS-6013695 the CO1 and HE6(1) substantial weights were weighed against each other, and the siting-minimisation limb of CO1 decided it.
