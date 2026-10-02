# corpus-rest-1: harvest log

Agent: corpus-rest-1 (Wave 2 corpus slice). Date: 2026-09-23.
Work list: `harvest-log/slices/rest-1.tsv`, 119 PINS decisions dated 17 Aug to 23 Sep 2026. These are the heritage, design, living-conditions, density and highways letters, plus letters with no code, that did not fall into the GB or principle slices.

## Method
- Each letter was read in full from `data/open-sources/pins-corpus/<ref>.txt`, using a helper that strips page furniture and condition schedules. No PDFs were downloaded. `local_copy` points to the corpus .txt, and `sources` gives the published-document UUID from `docs.map`.
- The list was split four ways: part A (rows 1-40, done directly), and forks B (41-80), C (81-119) and D (the last 11 of part A after a session-limit stop). That makes three sub-agents in total.
- Before writing, every Appeal ref in each letter was grepped against `cases/`, not just the slice ref, together with the site name. Several letters in this slice are "Appeal B" of a pair whose "Appeal A" had already been harvested by sos-and-other or corpus-rest-2. Those were not duplicated: the existing file was enriched with tags and HE6 notes and is recorded below as "covered by sibling".
- Conventions:
  - `nppf_applied` takes one of four values: `2026-08`, `2024-12 (transitional)` (old Framework applied, usually silently, on 17 Aug), `unstated` (cites "the Framework" with no version), or `none-cited`.
  - Plan-only decisions use `determinative_policies: ['s38(6)']`. GPDO eligibility appeals use the GPDO limb.
  - Tier 2 is tagged `tier-2`.
- The index builder (`uv run tools/build_index.py`) runs clean: 771 cases, no WARN lines.

## Counts
- 119 of 119 refs are accounted for.
- 113 new case files: 38 tier 1 and 75 tier 2. Across all 119 table rows, including the sibling-covered ones, the split is 41 tier 1 and 78 tier 2.
- 6 refs covered by sibling files from the same letter (6004392, 6005229, 6005981, 6006023, 6006260, 6006808). The siblings are PINS-6004393, PINS-6005225, PINS-6005980, PINS-6006027, PINS-6006259 and PINS-6006806. PINS-6005225, PINS-6004393, PINS-6005980 and PINS-6006027 were enriched with HE6 grading and benefit notes and tags.
- Other enrichment: PINS-6008667 (corpus-rest-2) was cross-linked with PINS-6008803 (same site and inspector, same day).
- Unusable letters: none. PINS-6005792 is a procedural dismissal (invalid ownership certificate) and was recorded as tier 2.
- PINS-6003318 (Appeal A) and PINS-6003486 (sos-and-other, Appeal B conditions) are separate appeals decided in one letter. Both files stand and are cross-linked via `related`.

## Data-quality notes on the slice index
The `nppf2026_codes` column often picks up local-plan or London Plan policy numbers as Framework codes. Examples:
- HC1 on 6004392 (London Plan)
- HC2 on 6009026 (Sefton)
- DM2/DM10 on 6007869 (Elmbridge)
- DM8/DM9 on 6010301 (Newark)
- HE3/HE2 on 6010986 (NDP)
- S1 on 6010972 (London Plan)
- DM1 on 6010616 (Taunton Deane)

The `cites_2026_fw` flag is also unreliable. 6004676 was flagged Y only because "framework of an appropriate assessment" appears in it. Several flagged letters (6003318, 6005881, 6006868, 6006948, 6006986) actually apply the December 2024 Framework. Other slices probably have the same problems.

## Coverage table
| ref | tier | outcome | determinative codes | file / harvester |
|---|---|---|---|---|
| 6000405 | 2 | allowed | 's38(6)' | PINS-6000405 (corpus-rest-1) |
| 6002703 | 1 | dismissed | HE6(4), HE6(1), HE6(3) | PINS-6002703 (corpus-rest-1) |
| 6002960 | 2 | dismissed | CO1, DP3(1) | PINS-6002960 (corpus-rest-1) |
| 6003318 | 1 | dismissed | HE6(4), HE4(2) | PINS-6003318 (corpus-rest-1) |
| 6003496 | 2 | allowed | 's38(6)' | PINS-6003496 (corpus-rest-1) |
| 6004392 | 1 | dismissed | HE6(3), HE6(4) | covered by sibling PINS-6004393 (corpus-rest-2) |
| 6004495 | 2 | dismissed | 'GPDO Sch2 Pt6 Class A(a)' | PINS-6004495 (corpus-rest-1) |
| 6004605 | 1 | dismissed | HE6(4), HE6(1), HE6(3), HE4(2) | PINS-6004605 (corpus-rest-1) |
| 6004676 | 2 | allowed | 's38(6)' | PINS-6004676 (corpus-rest-1) |
| 6005081 | 2 | allowed | DM6, N4 | PINS-6005081 (corpus-rest-1) |
| 6005229 | 2 | dismissed | HE6(1), HE4(2), HE6(4) | covered by sibling PINS-6005225 (sos-and-other) |
| 6005528 | 1 | dismissed | 's38(6)', TR3 | PINS-6005528 (corpus-rest-1) |
| 6005792 | 2 | dismissed | 'TCPA s65(5), s327A(2)' | PINS-6005792 (corpus-rest-1) |
| 6005881 | 1 | dismissed | HE6(4), S3 | PINS-6005881 (corpus-rest-1) |
| 6005981 | 1 | dismissed | HE4(2), HE6(1), HE6(3), HE6(4) | covered by sibling PINS-6005980 (sos-and-other) |
| 6006023 | 1 | dismissed | HE6(1), HE6(3), HE6(4) | covered by sibling PINS-6006027 (corpus-rest-2) |
| 6006078 | 1 | dismissed | S5(1)(a), DP3(1) | PINS-6006078 (corpus-rest-1) |
| 6006240 | 1 | allowed | HE6(4), CC2(2), HE4(2) | PINS-6006240 (sos-and-other) |
| 6006260 | 2 | dismissed | HE6(1), HE4(2), HE6(4) | covered by sibling PINS-6006259 (sos-and-other) |
| 6006352 | 2 | allowed | TR6 | PINS-6006352 (corpus-rest-1) |
| 6006600 | 2 | dismissed | 'GPDO Sch2 Pt1 Class A.1(d)', 'GPDO Sch2 Pt1 Class A.1(k)' | PINS-6006600 (corpus-rest-1) |
| 6006744 | 2 | dismissed | DP3(1) | PINS-6006744 (corpus-rest-1) |
| 6006808 | 2 | allowed | DM6 | covered by sibling PINS-6006806 (sos-and-other) |
| 6006868 | 1 | dismissed | HE6(4), HE4(2) | PINS-6006868 (corpus-rest-1) |
| 6006948 | 1 | dismissed | HE6(4), HE8, P5 | PINS-6006948 (corpus-rest-1) |
| 6006986 | 2 | dismissed | 's38(6)', P3(2)(a) | PINS-6006986 (corpus-rest-1) |
| 6007122 | 2 | allowed | 's38(6)' | PINS-6007122 (corpus-rest-1) |
| 6007161 | 1 | dismissed | S4(1), L2(1)(d)(i), L2(1)(d)(ii), DP3(1) | PINS-6007161 (corpus-rest-1) |
| 6007200 | 2 | dismissed | P5, CO1, HC4 | PINS-6007200 (corpus-rest-1) |
| 6007266 | 1 | dismissed | HE6(1), HE6(3), HE6(4), HE4(2) | PINS-6007266 (corpus-rest-1) |
| 6007315 | 2 | dismissed | 's38(6)' | PINS-6007315 (corpus-rest-1) |
| 6007396 | 2 | part-allowed | DM6 | PINS-6007396 (corpus-rest-1) |
| 6007456 | 2 | dismissed | 'GPDO Sch2 Pt3 Q.2(1)(e)', P3(2)(a) | PINS-6007456 (corpus-rest-1) |
| 6007476 | 1 | dismissed | HE7(2), N4 | PINS-6007476 (corpus-rest-1) |
| 6007519 | 2 | dismissed | 's38(6)' | PINS-6007519 (corpus-rest-1) |
| 6007562 | 2 | allowed | HE4, HE6 | PINS-6007562 (corpus-rest-1) |
| 6007651 | 1 | allowed | 's38(6)', DM5 | PINS-6007651 (corpus-rest-1) |
| 6007678 | 2 | allowed | 'GPDO Sch2 Pt3 para W(11)' | PINS-6007678 (corpus-rest-1) |
| 6007762 | 1 | dismissed | HE6(1), HE6(4), HE7(2), HE9(1) | PINS-6007762 (corpus-rest-1) |
| 6007796 | 2 | allowed | 's38(6)' | PINS-6007796 (corpus-rest-1) |
| 6007869 | 2 | allowed | L2(1)(d)(ii) | PINS-6007869 (corpus-rest-1) |
| 6007932 | 1 | dismissed | DP3(1), N3, S4(1) | PINS-6007932 (corpus-rest-1) |
| 6008038 | 2 | dismissed | TC3 | PINS-6008038 (corpus-rest-1) |
| 6008065 | 2 | dismissed | 's38(6)', Islington DMP H2 | PINS-6008065 (corpus-rest-1) |
| 6008189 | 2 | allowed | 's38(6)', Barnet LP HOU05 | PINS-6008189 (corpus-rest-1) |
| 6008242 | 2 | dismissed | P3 | PINS-6008242 (corpus-rest-1) |
| 6008277 | 2 | dismissed | L2(1)(d)(ii) | PINS-6008277 (corpus-rest-1) |
| 6008337 | 1 | dismissed | S4(1), L2(1)(d)(i), L2(1)(d)(ii), CC3(1)(d), DP3(2)(b) | PINS-6008337 (corpus-rest-1) |
| 6008437 | 2 | allowed | 'AnnexB:settlement', DM6 | PINS-6008437 (corpus-rest-1) |
| 6008465 | 2 | dismissed | N6 | PINS-6008465 (corpus-rest-1) |
| 6008490 | 1 | dismissed | HE6(1), HE6(3), HE6(4), HE4(2) | PINS-6008490 (corpus-rest-1) |
| 6008495 | 2 | allowed | HE6 | PINS-6008495 (corpus-rest-1) |
| 6008540 | 2 | allowed | DM6 | PINS-6008540 (corpus-rest-1) |
| 6008563 | 2 | dismissed | 's38(6)', Tower Hamlets LP D.DH8 | PINS-6008563 (corpus-rest-1) |
| 6008639 | 2 | allowed | HE6, HE9 | PINS-6008639 (corpus-rest-1) |
| 6008689 | 2 | allowed | DM6 | PINS-6008689 (corpus-rest-1) |
| 6008724 | 1 | dismissed | HE7(2) | PINS-6008724 (corpus-rest-1) |
| 6008744 | 2 | dismissed | 's38(6)', North Norfolk LP ENV8, North Norfolk LP ENV7 | PINS-6008744 (corpus-rest-1) |
| 6008803 | 1 | dismissed | N2, 'Habitats Regs 2017 (EPS)', L2(1)(d)(iii) | PINS-6008803 (corpus-rest-1) |
| 6008885 | 2 | dismissed | 's38(6)', Brent LP DMP1 | PINS-6008885 (corpus-rest-1) |
| 6008922 | 2 | allowed | HC7 | PINS-6008922 (corpus-rest-1) |
| 6009026 | 2 | dismissed | 's38(6)', Bootle AAP BAAP18 | PINS-6009026 (corpus-rest-1) |
| 6009069 | 2 | allowed | P5 | PINS-6009069 (corpus-rest-1) |
| 6009103 | 1 | dismissed | HE6(1), HE6(3), HE6(4), E1 | PINS-6009103 (corpus-rest-1) |
| 6009129 | 2 | allowed | GPDO Sch2 Pt3 Class Q.1(g), GPDO Sch2 Pt3 Class Q.2(1)(e) | PINS-6009129 (corpus-rest-1) |
| 6009147 | 2 | allowed | TR2 | PINS-6009147 (corpus-rest-1) |
| 6009184 | 1 | dismissed | 's38(6)', KLWN LP LP02 | PINS-6009184 (corpus-rest-1) |
| 6009208 | 1 | dismissed | L2(1)(d)(i), DP3(1) | PINS-6009208 (corpus-rest-1) |
| 6009278 | 2 | dismissed | 's38(6)', Bristol SADMP DM30 | PINS-6009278 (corpus-rest-1) |
| 6009367 | 1 | allowed | S5(1)(c), S5(1) | PINS-6009367 (corpus-rest-1) |
| 6009413 | 2 | dismissed | P3 | PINS-6009413 (corpus-rest-1) |
| 6009469 | 2 | allowed | P5 | PINS-6009469 (corpus-rest-1) |
| 6009545 | 1 | dismissed | HE6(4), S4(1), DP3(1) | PINS-6009545 (corpus-rest-1) |
| 6009573 | 1 | allowed | TR6 | PINS-6009573 (corpus-rest-1) |
| 6009605 | 2 | dismissed | P3(2)(a) | PINS-6009605 (corpus-rest-1) |
| 6009653 | 1 | dismissed | NPPF2024 para 11(d), Rother CS OSS4, Rother CS SRM2 | PINS-6009653 (corpus-rest-1) |
| 6009681 | 2 | allowed | 's38(6)', Redbridge LP LP26, Redbridge LP LP28 | PINS-6009681 (corpus-rest-1) |
| 6009739 | 2 | allowed | GPDO Sch2 Pt3 Class Q.1(p), GPDO Sch2 Pt3 Class Q.2(1)(a) | PINS-6009739 (corpus-rest-1) |
| 6009771 | 2 | allowed | NPPF2024 para 11(d), Havering LP Policy 8(iii) | PINS-6009771 (corpus-rest-1) |
| 6009776 | 1 | dismissed | HE6(4), HE7(2) | PINS-6009776 (corpus-rest-1) |
| 6009905 | 2 | allowed | HO7 | PINS-6009905 (corpus-rest-1) |
| 6009970 | 2 | dismissed | P3(2)(a) | PINS-6009970 (corpus-rest-1) |
| 6009978 | 2 | allowed | 's38(6)' | PINS-6009978 (corpus-rest-1) |
| 6010086 | 2 | allowed | 's38(6)' | PINS-6010086 (corpus-rest-1) |
| 6010150 | 2 | allowed | TR4 | PINS-6010150 (corpus-rest-1) |
| 6010180 | 1 | dismissed | HE6(4), HE4(2), TR4 | PINS-6010180 (corpus-rest-1) |
| 6010226 | 2 | allowed | N3, N2 | PINS-6010226 (corpus-rest-1) |
| 6010301 | 1 | dismissed | HE6(4), S3 | PINS-6010301 (corpus-rest-1) |
| 6010352 | 1 | dismissed | HE6(4), CO1, TR4 | PINS-6010352 (corpus-rest-1) |
| 6010396 | 1 | dismissed | HE6(4) | PINS-6010396 (corpus-rest-1) |
| 6010428 | 2 | dismissed | 's38(6)' | PINS-6010428 (corpus-rest-1) |
| 6010457 | 2 | dismissed | TR4 | PINS-6010457 (corpus-rest-1) |
| 6010507 | 2 | dismissed | 's38(6)' | PINS-6010507 (corpus-rest-1) |
| 6010549 | 2 | allowed | 's38(6)' | PINS-6010549 (corpus-rest-1) |
| 6010616 | 1 | dismissed | N2, S5(1)(j), HO7 | PINS-6010616 (corpus-rest-1) |
| 6010644 | 2 | allowed | 's38(6)' | PINS-6010644 (corpus-rest-1) |
| 6010708 | 2 | allowed | 's38(6)', DM6 | PINS-6010708 (corpus-rest-1) |
| 6010764 | 1 | allowed | N2 | PINS-6010764 (corpus-rest-1) |
| 6010807 | 2 | dismissed | DP3(1) | PINS-6010807 (corpus-rest-1) |
| 6010825 | 1 | dismissed | HE6(4), HE6(1), HE6(3), HE4(2) | PINS-6010825 (corpus-rest-1) |
| 6010839 | 2 | allowed | 's38(6)' | PINS-6010839 (corpus-rest-1) |
| 6010851 | 1 | allowed | S3 | PINS-6010851 (corpus-rest-1) |
| 6010890 | 2 | allowed | 's38(6)' | PINS-6010890 (corpus-rest-1) |
| 6010912 | 2 | allowed | DP3(1), TR6 | PINS-6010912 (corpus-rest-1) |
| 6010972 | 2 | allowed | 's38(6)' | PINS-6010972 (corpus-rest-1) |
| 6010986 | 1 | dismissed | TR3 | PINS-6010986 (corpus-rest-1) |
| 6011027 | 2 | dismissed | DP3(1) | PINS-6011027 (corpus-rest-1) |
| 6011059 | 2 | dismissed | TR6(4) | PINS-6011059 (corpus-rest-1) |
| 6011100 | 2 | dismissed | TR6(4) | PINS-6011100 (corpus-rest-1) |
| 6011274 | 2 | allowed | DM6 | PINS-6011274 (corpus-rest-1) |
| 6011388 | 2 | allowed | 's38(6)' | PINS-6011388 (corpus-rest-1) |
| 6011467 | 2 | dismissed | P3(2) | PINS-6011467 (corpus-rest-1) |
| 6011524 | 2 | dismissed | P3 | PINS-6011524 (corpus-rest-1) |
| 6011661 | 2 | dismissed | 's38(6)' | PINS-6011661 (corpus-rest-1) |
| 6011807 | 1 | dismissed | HE6(4), HE6(1), HE4(1) | PINS-6011807 (corpus-rest-1) |
| 6012017 | 2 | split | 's38(6)' | PINS-6012017 (corpus-rest-1) |
| 6012154 | 2 | allowed | 'GPDO Sch2 Pt3 Class Q.1(j)', 'GPDO Sch2 Pt3 Class Q.1(p)' | PINS-6012154 (corpus-rest-1) |
| 6012411 | 2 | dismissed | 'GPDO Sch2 Pt3 Class Q.1(j)' | PINS-6012411 (corpus-rest-1) |
| 6012915 | 1 | dismissed | HE6(4), HE6(1), HE6(3) | PINS-6012915 (corpus-rest-1) |

## LEADS NOT FOLLOWED
- **Linked advert or planning appeals not harvested separately:**
  - 6002961 (advert, in PINS-6002960)
  - 6006951 (in PINS-6006948)
  - 6007199 (in PINS-6007200)
  - 6007794 (in PINS-6007796)
  - 6004604 (planning Appeal A, in PINS-6004605)
  - 6010183 (Market Street, Huddersfield hub, linked to PINS-6010180)
- **Cited earlier decisions:**
  - 6001588 (246 Havant Road, Portsmouth HMO, dismissed; contrast with PINS-6004676)
  - 6003065/6003067 (Southfield Road, Middlesbrough street hub, allowed)
  - 6006595 (Filebase House, Washington)
  - APP/E5900/W/25/3376318
  - APP/L5240/W/21/3285401 (Croydon street hub, cited in the Bath and Reading hub letters)
- **Costs decisions referenced but not harvested:** 6004495, 6004676, 6005528, 6010549, 6010839, 6010972, 6010986, 6011524.

## OBSERVED PATTERNS
- **How HE6 harm is described after "less than substantial" was dropped.** Four vocabularies coexist:
  - Legacy "less than substantial" (LTS): PINS-6002703, PINS-6010180, PINS-6010396, PINS-6007762, plus every 17-Aug transitional letter.
  - Free-text grades: "a modest degree of harm" (PINS-6004393), "moderate harm" (PINS-6005225, PINS-6006027), "at a low level" (PINS-6004605, PINS-6007266, PINS-6010825, PINS-6009545), "towards the lower end of harm", pinned to the PPG's "extent of harm ... clearly articulated" (PINS-6005980), "at the lower level" (PINS-6010352).
  - A bare "not substantial" (PINS-6012915).
  - No grade at all (PINS-6011807).
  Nearly all letters, including those still using LTS, adopt HE6(3) "considerable importance and weight". The cleanest also state HE6(1) "substantial weight to conservation", quoting its "irrespective of whether ... positive effect, harm, substantial harm" clause (PINS-6005980, PINS-6010825, PINS-6012915). PINS-6007266 applies the "the more important the asset, the greater the weight" limb for Grade I.
- **"A low level of harm does not equate to a low planning objection"** (inspector A James: PINS-6004605, PINS-6007266). The same inspector used the LTS variant on 17 Aug (PINS-6006868). This is the most quotable line for resisting "the harm is only minor" arguments.
- **Weight words drift.** Several letters give "substantial weight" or "great weight" to the harm itself rather than to conservation (PINS-6005225, PINS-6007762, PINS-6008490, PINS-6010352), or describe low harm as "considerable" or "significant" later in the same letter (PINS-6006948). PINS-6010396 imports the HE6(5) "substantial public benefits" test into an HE6(4) balance.
- **Public benefits against heritage harm: heritage wins almost every time in this slice.** The recurring discount is that benefits achievable in a less harmful way get limited weight. Examples include energy efficiency (PINS-6005225, PINS-6008490, PINS-6007762), a heat pump (PINS-6005980), a charity café's plant (PINS-6004393) and repair works (PINS-6007266). HE6(4) names energy efficiency as an "important public benefit", which is acknowledged but needs evidence and alternatives to have been explored. Other recurring points:
  - Private benefits count for nothing (PINS-6004605, PINS-6006868, PINS-6010825, PINS-6002703).
  - "Absence of harm is not a benefit" (PINS-6004605).
  - A heritage gain folded into a more harmful whole carries no weight (PINS-6005980).
  - Housing benefit loses to low-level harm even at 3.36 years (PINS-6005881, transitional) and 3.68 years (PINS-6009545), where low harm was said to *substantially* outweigh under S4 without explanation.
  - The only heritage allowals in the slice are no-harm findings (PINS-6008495, PINS-6008639) or a positive energy-efficiency balance (PINS-6006240, solar panels).
- **DP3(3) "should be refused" is not being used as a trump, and S4(2)(c) was not invoked in any of the 119 letters.**
  - Design refusals either run through the S4(1) "substantially outweighed" balance, as in PINS-6007161, where L2(1)(d)(i)/(ii) and DP3(1) outweighed HO7 substantial weight at 2.55 years (also PINS-6008337, PINS-6009545).
  - Or they stay plan-led, with DP3 paraphrased or cited generically (PINS-6006744, PINS-6006078, PINS-6010807).
  - DP3(1)'s "innovation or change" clause was used positively once (PINS-6010912).
- **L2(1)(d) (garden, backland and airspace development) is the most active new design test.**
  - Its street-scene and living-standards limbs work as refusal criteria (PINS-6007161, PINS-6008337, PINS-6008277, PINS-6009208).
  - It also displaces restrictive local garden-land policy: Enfield DMD7 got "little weight" in PINS-6008803, while the flatted variant failed the same day (PINS-6008667).
  - L2 substantial weight is often withheld or forgotten for one-unit schemes (PINS-6006986, PINS-6008277, PINS-6000405).
- **Housing weight for one to six homes is inconsistent.** Weights given include "moderate" (PINS-6005528, PINS-6009367), "limited" (PINS-6006986), "very limited" (PINS-6010986) and HO7 "substantial" (PINS-6007161, PINS-6008337, PINS-6009545, PINS-6010616). PINS-6005528 decided six homes in "a small settlement" under local HO 2 "consistent with the Framework", with no S4 or S5 analysis.
- **S5 outside settlements, beyond housing.** PINS-6006078 applied the S5(1) proviso to an *agricultural* barn (an S5(1)(a) use), counting "absence of demonstrated need" as an adverse effect that substantially outweighed modest benefits.
- **Non-application of the 2026 Framework: why.**
  - **Old Framework used on 17 August.** Letters dated that day that were presumably drafted before publication applied the December 2024 Framework verbatim without comment (paras 11(d), 212-215, "great weight", LTS): PINS-6003318, PINS-6005881, PINS-6006868, PINS-6006948, PINS-6006986, PINS-6009653, PINS-6009771, PINS-6008540, PINS-6010851, PINS-6010301.
  - **No Framework needed.** About 15 letters cite no Framework at all. These are GPDO eligibility appeals (PINS-6004495, PINS-6006600, the Class Q letters), invalid applications (PINS-6005792), and purely plan-led HMO, amenity and conditions appeals (PINS-6000405, PINS-6004676, PINS-6008563).
  - **Parties rarely consulted.** "No fundamental or material change" is the dominant reason for not re-consulting (about half of letters). Parties were consulted in roughly a quarter.
  - **Template slips.** PINS-6007519 says the Framework was "published on 12 December 2024", and PINS-6009069 says 16 August 2026.
- **Highways and transport.**
  - TR6's "unacceptable impact on highway safety / severe" bar is cited by name to override parking-standard shortfalls (PINS-6006352) and to decide small highway refusals (PINS-6011100, PINS-6011059).
  - PINS-6009573 gave DMRB CD 143 visibility "very little weight" on a non-trunk road and held that an absence of recorded collisions is not reliable evidence of safety (relevant to Station Road-type footway arguments).
  - PINS-6005528 held that a 20-minute walk to a service village is not "good access" where there is no continuous lit footway.
- **BT Street Hubs (about eight letters) show a clear evidential line.** Heritage harm beats CO1 substantial weight every time in a heritage setting (PINS-6006948, PINS-6010180, PINS-6010352, PINS-6010396, PINS-6012915). Outside heritage settings, generic crime objections fail (PINS-6002960) but site-specific police data wins (PINS-6006948, PINS-6007200). CO1's own "minimise the visual impact" limb is used against the benefit it confers (PINS-6002960).
- **P3 and N4 as gap-fillers.** P3(2) was made the operative noise test where local policy did not fit (PINS-6011467) and imported into Class Q through GPDO para W(10)(b) (PINS-6007456). N4 substantial weight carried National Park cultural heritage into an NDHA refusal (PINS-6007476) and underpinned retained operating conditions (PINS-6005081).
