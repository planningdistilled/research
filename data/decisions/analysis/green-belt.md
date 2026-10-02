# Green Belt under the August 2026 NPPF: GB6, GB7, GB8 and S5(5) in practice

Analyst: analyst-greenbelt, 23 Sep 2026. Dataset: 136 cases with `green_belt: true` or a GB finding (105 inspector, 1 SoS, 17 committee, 13 delegated), 17 Aug–23 Sep 2026. Primary letter text was read for every appeal cited as a lead authority; quotes below were checked against `data/open-sources/pins-corpus/<ref>.txt` (or the saved PDF for `APP-*` refs). Council cases were read from case files (report-read). Framework text checked against `data/open-sources/nppf/NPPF-August-2026.pdf` (GB6/GB7/GB8 pp.61–64, TR3 p.69, Annex B, Annex E pp.121–123).

**Two corrections to earlier notes:**
- **Villages are not "large built-up areas" under the Framework itself.** Annex E ¶3 says "Villages should not be considered large built-up areas", and Annex E ¶4 says purpose (b) "relates to the merging of towns, not villages". Letters cite this as "Annex E" (6011103 ¶12, 6007428 ¶10) or "PPG, as reflected in Annex E" (3378284 ¶36). Cite Annex E, not the PPG.
- **Reasonable walking distance has a part-site rule.** Annex B says that where only part of a site falls within reasonable walking distance, GB7(1)(h) applies only to that part. Dacorum applied this rule (dacorum-25-01880-MOA).

**Selection bias.** Appeals are council refusals. The council cases are mostly approvals that harvesters could reach (Stratford, Basildon, BathNES, Bromsgrove, Lichfield and others). So comparing inspector and council pass rates overstates how differently they read the tests. The comparisons below pair like facts with like facts rather than relying on raw rates.

---

## 1. Headline propositions

**P1. Limb (iii) decides small Green Belt housing cases, and the walking route decides limb (iii), not the distance. (Strong.)**
- **Counts.** On housing, inspectors passed limb (iii) 11 times and failed it 9. Councils passed it 15 times and failed it 2 (index count, `GB7(1)(g)(iii)` findings on housing dev_types).
- **Every contested inspector fail had some or all of these:** no footway or a broken one, no lighting, pedestrians sharing the carriageway, 40–60 mph traffic, and public transport that was thin or unevidenced. The fails are 6010313, 6009966, 6011736, 6007428, 6008528, 6012481 and 6006637. 6008688 failed with a lit but narrow footway beside a busy road ("finely balanced").
- **Every contested pass had a continuous footway for most of the route**, or a short, benign gap in one, plus an evidenced bus service (including on-demand services). The passes are 6010471, 6011103, 6009645, 6011301 and 6005877.
- **Best quote**, Halsall 6007428 ¶14–15: "the issue is whether future occupants would have realistic and safe opportunities to reach the pedestrian network, public transport and nearby services and facilities without relying principally on the private car … The presence of street lighting along parts of Plex Lane does not overcome the absence of dedicated pedestrian provision."
- **Counter-example:** 6011301 Bournheath passed on 30 mph lit roads with only "stretches of footpath", saved by a county on-demand bus (¶11, 14–16).

**P2. Having to walk in the carriageway on the everyday route is the most reliable fail fact. Lighting does not cure it. Distance does not excuse it. (Strong.)**
- **Supporting cases:**
  - 6007428 ¶15–16: "Although the distance involved is relatively short, the quality and safety of the route materially limit its usefulness". The road was 60 mph.
  - 6011736 ¶4: "a section where pedestrians would need to walk in the road and, even though the route is straight, this would not be attractive … Particularly in hours of darkness, for children and those with mobility issues".
  - 6009966 ¶21: "pedestrians and cyclists would be required to share the carriageway … for much of the journey".
  - 6006637 ¶21–24: a 350 m walk to a station on an unlit road with slim verges and a bridge.
  - Also 6010313 ¶14, 6008528 ¶11 and 6012481 ¶15.
- **Counter-examples,** where the gap was benign:
  - 6011103 ¶19: "a stretch … of a modest distance, the road was relatively flat and straight with good visibility", in a village otherwise footwayed and lit.
  - 6009645 ¶11: a private drive serving "a very limited number of dwellings".
  - Councils go further. Tanworth (stratford-26-00918-PIP) accepted short unfooted sections in the historic village core because "Villagers appear to cope with this existing situation without any great trouble". (Snitterfield, stratford-26-00617-PIP, is not an example: its report first accepted 100 m in a 30 mph carriageway because "existing houses on Jago Green also have to make the same journey", but the committee Update Report corrected this, as the proposed Park Lane footpath puts the whole route on made footpath.)
  - **Inspector answer to the "residents already walk it" argument** (Hatton 6006637 ¶26): "at least some journeys arise out of necessity rather than choice … the recorded levels of activity do not demonstrate that the route is universally perceived as safe."

**P3. Small scale does not rescue a failing location. TR3 is "read as a whole", and 1–9 homes count as "significant movement … in this context". (Strong: 6 supporting, 0 contrary on limb (iii).)**
- 6010313 ¶13 (5 homes: "a significant amount of movement in this context"). 6011301 ¶10 (up to 5 homes at Bournheath, and this was a pass). 6007428 ¶14 (1–3 homes: "noticeable in the context of this lightly developed rural location"). 6006637 ¶29 (28 homes, about 112 movements a day).
- 6009966 ¶27: five homes do "not engage criterion (a) … to the same degree … Nevertheless, Policy TR3 must be read as a whole".
- 6003001 ¶7: even one dwelling "not in a sustainable location".
- **Contrast.** Where the scheme is already not inappropriate through another GB7 category, a single dwelling's car dependence becomes only a weight: limited in 6004344 ¶21–25, moderate in 6011231, which was allowed.

**P4. Public transport has to be evidenced (frequency, hours, destinations, reliability). An hourly bus does not rescue a hostile walking route. An on-demand bus can tip a borderline case if it is shown to work. (Emerging.)**
- **Unevidenced services failed:**
  - hail-and-ride (6009966 ¶22: "limited evidence … concerning the frequency, hours of operation, all destinations served, or reliability");
  - demand-responsive transport with "no certainty" (6006637 ¶16);
  - a bus "not shown to stop nearby" (6008528 ¶11).
- **Thin services failed:** a twice-weekly bus (6006637 ¶15, and Bromsgrove's council case bromsgrove-25-01429-FUL); services with none on Sundays and modest frequency (6008688 ¶15).
- **An hourly 7-day bus plus demand-responsive transport, with a Connectivity Tool score of 52, still failed** because the walk was in the road (6011736 ¶5–7).
- **A timetabled service of six buses a day, Monday to Saturday, with none in the evening or on Sundays, failed** (6007668 ¶15, ¶19; the highway authority's no objection did not change it).
- **Contra, at inquiry: a bus about every two hours, with no commuter-time service, plus term-time school buses, passed** as a genuine choice for daytime local trips, the inspector accepting that commuting by public transport would be challenging (6006497 ¶37–40, ¶45; Connectivity Tool 52 read against the district's own bands, ¶42–44).
- **On-demand buses counted when evidenced:** an app bus photographed picking up outside the site (6011301 ¶14–16); a pre-bookable demand-responsive bus 7 days a week, where the council's eligibility point was unevidenced (6009645 ¶13).

**P5. The Connectivity Tool corroborates the finding. It does not decide it, and the same score can go either way. (Strong.)**
- **Same score, opposite results:**
  - 52 failed at Copthorne (6011736 ¶7);
  - 52 passed at Higher Poynton (6010471 ¶20: "above average" for "rural town and fringe").
- **Other scores:**
  - 43 passed, "90th percentile nationally" on the appellant's say-so (6011301 ¶17);
  - 25 failed (6008528 ¶12);
  - "poor" failed (6012481 ¶14);
  - 23 failed (council: wychavon-W-26-01639-PIP);
  - 59–62% passed (council: cheshireeast-25-2053-FUL);
  - rating B passed (council: bathnes-25-04952-EOUT).
- **Scores are read against their context** (6004144 ¶32, referring to TR3's "context of the area").
- **Leaving it out is noted but not fatal:** 6008688 ¶18 says "there is no objective connectivity score available to assist".
- No 2026 letter has yet said the score is misleading or mis-run. See Gaps.

**P6. A highway authority's no-objection does not settle limb (iii). Mitigation counts only if it is certain and secured. (Strong.)**
- **Highway authority no-objection:** 6006637 ¶28 (no objection on traffic, still a fail); 6009966 ¶43 (the county highway authority's view merely "reinforced" the finding). Council: wychavon-W-26-01874-PIP (non-GB) failed despite no county objection.
- **Mitigation rejected:**
  - travel vouchers, because "a financial incentive would not alter the features of the site" (6011736 ¶6);
  - a 30 mph extension with no highway-authority evidence, which "a Grampian condition would not be reasonable" to secure (6011736 ¶6);
  - signage, coloured surfacing and a 20 mph TRO (traffic regulation order) contribution, which were "relatively minor" and uncertain, pending s278 (6006637 ¶33–35);
  - a footway link with "no evidence … [it] could be provided" (6007428 ¶16), contrasted with the nearby Holly Farm scheme, where the footway link was secured (¶13).
- **Mitigation accepted by councils:** a secured crossing with dropped kerbs and tactile paving (sefton-DC-2026-00141); a footpath link written into the description of development (stratford-26-00617-PIP update).

**P7. The station route, GB7(1)(h), has never passed at appeal. Both Annex B tests are applied literally. (Strong on failure; no pass exists.)**
- **Well-connected station test:**
  - 6006637 ¶18: Hatton has "fewer than four trains per hour … fewer than two trains per hour in any one direction". This is the same Leamington–Stratford line as Claverdon.
  - Non-GB: wychavon-W-26-01874-PIP, where Broadway had under 2 trains an hour.
- **Distance test:**
  - 6004144 ¶29: "at twice the reasonable walking distance and time … would not meet the requirements of Framework Policy GB7(h)", even though the routes were "pleasant".
- **Officers and members disagree on the margin:** Three Rivers officers stretched "around 800m" to about 1,100 m on lit footways, and members rejected that (threerivers-25-2168-OUT).
- **Part-site rule:** Dacorum applied (h) only to the part of the site within 800 m, which then triggers the L3 minimum of 45 dph (dacorum-25-01880-MOA).
- **A near station is not enough.** A close station that is not well-connected, or is reached by an unsafe route, does not help limb (iii) either (6006637 ¶32).

**P8. Limb (ii) is automatic for housing when footnote 41 bites, including a Housing Delivery Test below 75% with a five-year supply. For every other use it needs type-specific evidence. (Strong.)**
- **Housing passes:**
  - on a supply shortfall: 6010313 ¶11, 6009966 ¶17, 6011103 ¶18, 6010471 ¶16, 3378284 ¶42;
  - on an HDT below 75% alone: 6008528 ¶10.
- **Housing fails:**
  - where the supply is now met (council: wychavon-W-26-01639-PIP, after the SWDPR, HDT 133%);
  - where no evidence was given (6003001 ¶7–8).
- **Non-housing fails:**
  - a householder "desire for a larger house" (6008745 ¶14; also 6009962 and 6005976, an annexe);
  - yoga studio (6012188 ¶15–16);
  - storage containers (6005433 ¶11);
  - containers where the need evidence was for warehousing, not "this type" (3372995 ¶31).
- **Non-housing passes:**
  - solar, on the Clean Power 2030 targets (6005916 ¶22);
  - a traveller site, on the GTAA (Gypsy and Traveller Accommodation Assessment) (3377906 ¶14–15);
  - council cases: padel, on third-party representations (bathnes-26-00259-FUL); SEND (special educational needs and disabilities) provision, on the applicant's evidence (bromsgrove-25-00751-FUL); a care home, on an undisputed bed-needs study (cheshireeast-25-2053-FUL).
- **No decision has tested "type" for market housing** (for example, large open-market homes against an affordable need). Footnote 41 is read as settling the question.

**P9. Grey belt: villages never count as large built-up areas, and purpose (a) is judged on the site, not the parcel. Containment decides it at town edges. (Strong.)**
- **Villages:**
  - 6011103 ¶12–16: Biddulph Moor is "a built-up area" but not a "large built-up area".
  - 6010471 ¶13: villages "should not be regarded as large built-up areas".
  - 6008688 ¶10.
  - Council cases: chorley-25-01052-FULMAJ, bathnes-26-00259-FUL, and SDC's stock paragraph ("a village, some distance from large built-up areas and towns").
- **Exception:** a village "subsumed within the wider Bristol conurbation" counts as part of a large built-up area (3378284 ¶36).
- **Site, not parcel:**
  - 6010471 ¶15: parcel PY21's "major contribution" was set aside, because assessment should "focus on the land subject to the proposal".
  - Also 6007184, 6007334 and 3378284 ¶38–40 (containment by planting and roads).
  - A council's draft study that matches the site's physical facts is followed: 6009281 ¶15–16.
- **Rejected:** only where an uncontained site abuts a town:
  - 6009281 ¶15–17 (open to Green Belt on three sides at Chalfont St Peter);
  - 6007316 (a ribbon edge; that letter applied the 2024 Framework).
- **Purpose (c) is irrelevant to grey belt status** (6010471 ¶12). It matters only for openness harm and for the "fundamentally undermine" test.
- **Footnote 7 has gone:** a National Landscape or ancient woodland no longer excludes land from grey belt; those constraints now bite through N4/N6 (3377906 ¶9–10). Three Rivers officers used the same point to dismiss heritage-based grey-belt objections.

**P10. The "would not fundamentally undermine … across the area of the plan" half of limb (i) has never failed. (Strong.)**
- Inspectors read it at plan scale:
  - 28 ha of solar is "a very small fraction" of a district that is about 70% Green Belt (6005916 ¶18);
  - the test is whether the rest of the Green Belt can still serve its purposes "in a meaningful way" (3378284 ¶41);
  - for 1 to 9 homes it is conceded or found in one line every time.
- Objectors should not spend effort on it.

**P11. Inspectors against councils, and officers against members: the harvesters' hypothesis is partly confirmed. (Emerging.)**
- **(a) Councils do pass limb (iii) on facts that inspectors fail.**
  - SDC passed unfooted village-core sections (Tanworth) and "inside the BUAB" with no route analysis (stratford-26-01458-FUL). Snitterfield was decided on a route that is on made footpath throughout once the proposed Park Lane link is built (Update Report correction).
  - The inspector analogues on route facts fail: 6007428, 6011736, 6009966.
  - The inspector's line on settlement boundaries runs the other way: "a more nuanced and site-specific assessment of sustainability rather than one based solely upon settlement boundaries" (6008688 ¶13).
  - Where councils refused on limb (iii) and the route lacked a footway, inspectors upheld them every time in this dataset. That covers Tandridge ×4 (6010313, 6009966, 6011736, 6008688), Mole Valley (6008528), West Lancashire (6007428), Sevenoaks (6012481) and Warwick (6006637).
  - Where location was disputed and the route had footways or an evidenced on-demand bus, inspectors found against the council on limb (iii): Cheshire East ×2 (6005877, 6010471), Bromsgrove (6011301) and Guildford (6009645, a non-determination appeal later dismissed on other grounds).
- **(b) Members overturn at limb (i) or (h), not limb (iii).**
  - Every Green Belt member overturn went through grey belt, the station route or spatial strategy:
    - Basildon 00575: purpose (a) regraded from moderate to strong against the council's own study;
    - Basildon 01188/01190: grey belt already conceded, VSC refused;
    - Three Rivers: purpose (a) regraded and 1,100 m held not "around 800m";
    - Chorley: spatial strategy only.
  - None went through limb (iii). At Three Rivers, members still listed "sustainable location" as a benefit.
- **(c) The only overturn tested at appeal was reversed.** Staffordshire Moorlands members treated Biddulph Moor as a large built-up area. The inspector held a village cannot be (6011103 ¶12–16), but refused costs because it "is a matter of judgement" (costs ¶7). Costs were also refused in 3378284 (grey belt status is a judgement "even for PDL").
- **Conclusion.** Regrading purpose (a) at a village edge will lose at appeal. At an uncontained town edge (6009281), or on purpose (b) where the site is a substantial part of a gap of about 2 km between towns (basildon-25-01190-OUT), it is defensible. Limb (iii) refusals on walking-route facts are the ones inspectors uphold.

**P12. Once a scheme is inappropriate, no Green Belt housing appeal has found VSC on supply grounds. Small schemes usually get only moderate weight for the homes. (Strong: 0 housing VSC passes at appeal in about 20 attempts.)**
- **Weights given to the homes:**
  - moderate or modest: 6010313 ¶33/38 (5 homes, 1.97 years), 6011736 ¶16 (7 homes, 2.17 years), 6009281 ¶24 (4 homes, 1.98 years), 6011972 ¶16 (8 homes, 1.92 years), 6007428 ¶25, 6008688 ¶34;
  - substantial and still refused: 6009966 ¶39, 45; 6005495;
  - limited: 6012481 ¶42. That letter adds that "the lack of realistic alternatives to travel by car moderates the benefit arising from additional housing in this particular location".
- **Where councils found VSC,** it came from essential rural-worker need, fallbacks or specialist care, not general housing supply. Officers found VSC at Basildon 01188/01190; members refused.

**P13. Passing GB7 turns on the S5(5) "substantially outweighed" tilt, but at appeal it is not an automatic approval. 17 of 34 non-householder appeals found not inappropriate were allowed or part-allowed. (Strong.)**
- **Losses come through S5(2) "should be refused" policies or specific harms:**
  - DP3(3) backland design (6011803 ¶20);
  - TR6/TR3(1)(c) highway safety (6009997, 6006761);
  - F5 flood sequential test (6006286);
  - habitats mitigation under N6 (6007334, 6009645);
  - L3 density (6007121);
  - N4 National Landscape (6007130);
  - HE6 heritage (6008539);
  - odour (6004144).
- **SDC's balance is looser.** At Snitterfield, "significant" character harm given substantial weight still did not "substantially outweigh" 5 homes (stratford-26-00617-PIP).
- **Failing GB7 switches S5(5) off entirely:** "the further balance applicable to development that is not inappropriate under Policy S5(5) is not engaged" (6007428 ¶28; also 6009966 ¶50).
- **S5(1)(j) cannot be used in the Green Belt:** "policy S5 … does not displace the specific Green Belt provisions of policy GB7" (6008528 ¶8).
- **Error to flag:** 6011694 applied S5 to a Green Belt sawmill site.

**P14. Golden Rules (GB8): the 10-home or 0.5 ha threshold decides whether they apply, and failing them makes the scheme inappropriate. (Emerging.)**
- **Met, given substantial weight:** 6007184 (50% affordable) and 6004144.
- **Failed:**
  - 11 open-market homes with no affordable housing, then VSC refused (basildon-24-01047-OUT);
  - GB8(1)(b), pedestrian highway improvements not identified or secured (6006637 ¶41–44);
  - a council treated a care home as housing, so GB8 failed, but still found VSC (cheshireeast-25-2053-FUL).
- **Threshold:** a touring pitch does not count towards the 10 units (3378284 ¶45).
- **Meeting GB8 cannot cure a limb (i) failure;** it becomes a VSC benefit only (basildon-25-01188-OUT).

**P15. Washed-over villages: Annex B excludes them from "settlement". One letter now applies that exclusion squarely; another does the opposite. (Emerging.)**
- 6009919 ¶49 (Fobbing, 29 Sep): villages "which lie within and are defined as part of the Green Belt, as is the case with Fobbing, are not settlements for the purposes of the Framework, and consequently Policy S4 is not engaged"; S5 does not apply either, so the case goes to GB7.
- Contra: 6010097 ¶15, ¶20 (Bledlow Ridge, 30 Sep) ran S4 for a Green Belt site inside the village's defined settlement boundary and left inappropriateness undecided. It was dismissed on heritage, so the route did not change the result.
- SDC treats washed-over villages as settlements: Snitterfield, Tanworth, Earlswood.
- 6011803 ¶18 (Toms Lane, washed over) reached S5 rather than S4 on the physical character of the area ("not one that places it into a built-up area"). It did not rely on the Annex B exclusion.
- For Green Belt housing this makes no difference to the outcome, because S5(5) sends the case to GB6–GB8 either way. It does matter where an officer runs S5(1)(j) or S4 first (stratford-26-00918-PIP ran S5(1)(j) "well-related to an existing settlement").

**P16. Householder cases: GB7(1)(b) is unchanged from 2024. (Strong.)**
- **Counts:** of 40 Green Belt householder cases, 31 were dismissed. GB7(1)(b) failed 27 times at appeal, all dismissed.
- **The (b) test:** it is cumulative against the original (1948) building (fn40), and openness is not a separate test once (b) passes (6010603).
- **The grey-belt route fails at limb (ii)** (6008745, 6009962, 6005976).
- **The garden-as-PDL route under GB7(1)(e) passes** where land outside a built-up area is curtilage and the harm is short of "substantial" (6012162, 6012043, 6012763: 3/3).
- **Limits of (e):** extending a retained building is not "redevelopment" (6008579); a garden inside a built-up area is not PDL (6011803 ¶19).

**P17. Fallbacks and rural workers. (Emerging.)**
- **Fallbacks carry VSC weight only when they are real and no less harmful:**
  - accepted: a Class Q fallback plus a volume cut (bromsgrove-25-01429-FUL); a larger-home prior approval plus a child's medical needs (bromsgrove-26-00434-FUL); an extant garage permission (6010859);
  - limited weight where the fallback is less harmful: 6010313 ¶35 ("the fallback scheme would cause less harm overall");
  - moderate weight where it could be built in addition to the scheme (6012106).
- **Rural workers' dwellings** are not a GB7 category, so they are inappropriate. HO11(1)(a) essential need, verified by an independent consultant, is then treated as VSC: warwick-W-26-0134 (Shrewley, Claverdon postal area), warwick-W-25-0302 and lichfield-26-00849-FUL. They fail without objective need data (6008062).

**P18. Transitional and drafting traps are common. Check the letter before citing it. (Strong.)**
- **Letters dated 17 Aug applied the 2024 Framework:** 6007316, 3378286, 6008668, 6008286 and 6010859.
- **Internal inconsistencies:**
  - 6010313 ¶9 passed GB7(1)(b) and then held the scheme inappropriate for failing (g) (¶14). The categories are alternatives, so rely on the (g)(iii) reasoning only.
  - 6008688 ¶12 says a failure to be PDL "would itself render the proposal inappropriate", which conflates (e) with (g).
  - 6009281 ¶16–17 imports purpose (c) "encroachment" into its purpose (a) reasoning.
- **Council citation errors:** Bromsgrove cited "GB1" for the purposes (bromsgrove-26-00845-PIP), and officers kept giving openness weight after finding a scheme not inappropriate (bromsgrove-25-00751-FUL).

---

## 2. Fact thresholds

### 2a. GB7(1)(g)(iii) / TR3: case matrix (housing unless stated)

"n/s" = not stated in the letter or report. CT = Connectivity Tool. Decision: I = inspector, C = committee, D = delegated.

| Case | Dec. | Units | Distance to services | Footway | Lighting | Speed / traffic | In carriageway? | Bus | Rail | CT | (iii) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 6010313 Newchapel ¶12–14 | I | 5 | "away from settlements, facilities" | none | none | 40 mph | yes | none nearby | — | — | **FAIL** |
| 6009966 S Nutfield ¶21–28 | I | ≤5 PIP | 800 m to edge + ~800 m to services | not continuous | none | 40 / 30 mph | "much of the journey" | hail-and-ride, unevidenced | — | — | **FAIL** |
| 6011736 Copthorne ¶4–7 | I | 7 | ~1 km / 15 min | partial | "mainly unlit" | 30–40 mph (was 50) | one section | hourly, 7 days, plus DRT | — | 52 | **FAIL** |
| 6008688 E Grinstead ¶14–18 | I | 1 | town and station 2 km | continuous but **narrow**, beside busy road | lit | busy | no | 2 routes, modest, none on Sunday | 2 km | none | **FAIL** ("finely balanced") |
| 6007428 Halsall ¶12–16 | I | 1–3 | "relatively short" to network | none by site | some | 60 mph, farm traffic | yes | via network | — | — | **FAIL** |
| 6008528 Beare Green ¶11–13 | I | 1 | "well separated" | none | none | A29 barrier | yes | not shown to stop | Holmwood, separated | 25 | **FAIL** |
| 6012481 Well Hill ¶13–16 | I | 6 | few services | none | none | n/s | yes | none accessible | — | "poor" | **FAIL** |
| 6006637 Hatton Stn ¶14–39 (hearing) | I | 28 | shop/pub 1.7–1.8 km, school 2.3 km | slim verges only | unlit | 653 vpd, 85th percentile ~30 mph | yes, incl. bridge | 1.1 km, twice weekly; DRT uncertain | 350 m, <2 tph each way, not step-free | — | **FAIL** |
| 6010471 Higher Poynton ¶17–20 | I | 7 | shops just over 1 mile; local plan thresholds met | continuous | lit | 30 mph | no | regular day and early evening | via bus | 52 | **PASS** |
| 6011103 Biddulph Moor ¶19–20 | I | ≤9 | village services | yes, except a short stretch | lit | n/s | short, "flat and straight … good visibility" | village stop | — | — | **PASS** |
| 6009645 Wood Street ¶9–14 | I | 1 | school 800 m, PO 1 km, more 1.6 km | continuous; **switches sides once (crossing)** | **unlit** | n/s | private drive only | DRT, 7 days, at drive end | — | — | **PASS** |
| 6011301 Bournheath ¶9–18 | I | ≤5 | 3 pubs and hall walkable; Fairfield via narrow roads | "stretches" | lit (30 mph roads) | 30 mph; NSL to Catshill | partly | Tue/Fri only, plus app on-demand bus | — | 43 | **PASS** |
| 6005877 Heald Green ¶20–21 | I | ≤6 | adjoins built-up area | "good pedestrian infrastructure" | n/s | n/s | no | yes | — | — | **PASS** |
| 6007334 Chalton ¶25–26 | I | ≤9 | small village range; part of Houghton Regis | lit footway | lit | n/s | no | stops | — | — | **PASS** |
| 6004144 Hurst Green ¶28–32 (hearing) | I | 132 | ≤1.7 km | "pleasant walking routes" | n/s | n/s | no | 430–530 m | ~2× reasonable walking distance | in context | **PASS** |
| 3377906 W Kingsdown (traveller) ¶16–19 | I | 1 | "somewhat remote"; station 3+ miles | narrow lanes | n/s | n/s | yes | n/s | — | — | PASS via HO12 flexibility; **"would not satisfy" for general housing** (¶19) |
| stratford-26-00617 Snitterfield | C | 5 | 0.5 mile / 15 min | report assumed 100 m in the carriageway, then footways; the committee Update Report corrected this: with the proposed Park Lane footpath the whole route is on made footpath | n/s | 30 mph | none (as corrected) | infrequent | — | — | PASS |
| stratford-26-00918 Tanworth | C | ≤9 | ~400 m | frontage, with short gaps in the core | n/s | village | short | limited | — | — | PASS |
| stratford-26-01458 Earlswood | D | 1 | "within BUAB" (no analysis) | — | — | — | — | — | — | — | PASS |
| sefton-DC-2026-00141 | C | 3 | bus stops and school "within walking distance" | none on site side; **crossing, dropped kerbs and tactile paving secured** | n/s | suburban | no | yes | — | — | PASS |
| bromsgrove-26-00845-PIP | D | ≤6 | 7 m outside a large settlement | both sides | lit | n/s | no | 60 m, regular | — | — | PASS |
| chorley-25-01052-FULMAJ | C (officers) | 58 | 0.3–0.5 km | consistent | lit | 20 mph | no | Mon–Sat | 0.5 km, hourly | — | PASS |
| threerivers-25-2168-OUT | C (officers) | 70 | GP not walkable (conceded) | lit | lit | 30 mph | no | hourly | Bushey 1.1 km | — | PASS (members doubted it) |
| cheshireeast-25-2053-FUL (C2) | C | 68 | 0.6–0.7 km | lit | lit | n/s | no | 0.7 km | 750 m | 59–62% | PASS |
| wychavon-W-26-01639-PIP | D | 5 | pub near; others further | narrow | mostly unlit | n/s | partly | infrequent | — | 23 | **FAIL** |
| bromsgrove-25-01429-FUL | D | 1 | school 180 m, nothing else | n/s | n/s | n/s | n/s | Tue/Fri only | — | — | **FAIL** (VSC via fallback) |
| *Non-GB cross-check:* wychavon-W-26-01874-PIP | D | 1 | — | **no footway, no crossing point** | none | **40 mph** | yes | stop <100 m, limited | <800 m but not well-connected | — | **FAIL** (TR3) |

### 2b. Summary of the facts that tip limb (iii)

| Fact | Passes when… | Fails when… | Cases |
|---|---|---|---|
| Distance | Not decisive on its own. Passes seen up to ~1.6 km (6009645), just over 1 mile (6010471) and 1.7 km for a large scheme (6004144). "No requirement that every service … within walking distance" (6004144 ¶28) | Fails seen at 350 m (6006637) and "relatively short" (6007428) where the route was bad | 6004144, 6006637, 6007428 |
| Footway presence | Continuous, or nearly so | None, or none for part of the everyday route | P1–P2 cases |
| Footway side / crossing | One change of side, crossed once, on an otherwise continuous route (6009645 ¶12). A new crossing secured by a council (sefton) | No crossing point on a 40 mph road (wychavon-01874, non-GB) | 6009645, sefton, wychavon-01874 |
| Footway width / quality | — | Narrow, beside a busy road, even though lit and continuous (6008688 ¶14) | 6008688 |
| Lighting | Unlit is tolerable where the footway is continuous (6009645) | Unlit plus no footway (every fail). Lighting does not cure a missing footway (6007428 ¶15) | 6009645, 6007428 |
| Speed | 30 mph or 20 mph on passes | 40 mph (6010313, 6009966), 60 mph (6007428), national speed limit (6011301, the Catshill leg) | — |
| Traffic volume | A private drive with low traffic (6009645 ¶11) | Low traffic (653 vpd, ~30 mph) still failed where the route was physically constrained (6006637 ¶20–24) | 6006637 |
| Existing pedestrian use | Councils: "existing residents do it" (Snitterfield, Tanworth) | Inspector: "necessity rather than choice" (6006637 ¶26) | — |
| Bus | Regular day and evening service (6010471); app or DRT on-demand service, evidenced (6011301, 6009645) | Twice weekly; unevidenced hail-and-ride; hourly but reached only by walking in the road (6011736) | P4 |
| Rail | Well-connected and within about 800 m (none yet at appeal) | <2 tph each way, reached by an unsafe route (6006637); ~1.6 km (6004144, for (h)) | P7 |
| Connectivity Tool | 43, 52 (with good routes) | 23, 25, "poor", 52 (with a bad route) | P5 |
| Scale | Irrelevant to the pass/fail line; 1 home can fail | 1–9 homes are "significant … in this context" | P3 |
| Nature of use | Car-based use that is inherent (SEND farm school, bromsgrove-25-00751-FUL; solar, 6005916 ¶23; travellers under HO12, 3377906) | — | TR3(1)(a) "unless the nature of the development would make this impractical" |
| Mitigation | Secured by condition or s106 and within the applicant's control | Vouchers; unsecured TRO or s278 works; a speed-limit extension without highway-authority evidence | P6 |

### 2c. Other thresholds

| Test | Pass | Fail | Cases |
|---|---|---|---|
| Grey belt, purpose (a) | Village edge (any); a town edge contained by roads, planting or development on 2–3 sides | Adjoins a town and is open to Green Belt on 3 sides; the site is 61% of a "strong" parcel | 6011103, 6010471, 3378284, 6007184 / 6009281, basildon-01188 |
| Grey belt, purpose (b) | "Small portion of a substantially larger gap" (sefton) | Site a "substantial component" of a gap of about 2.3 km between towns (basildon-01190) | — |
| Limb (ii), housing | Supply below 5 years (any figure: 0.91–4.0 seen); HDT below 75% | Supply met and HDT at or above 75%; no evidence | P8 |
| Limb (iv), major | 10+ homes or 0.5 ha+ | 9 statics plus a touring pitch is not major (3378284 ¶44–45) | — |
| GB7(1)(h) distance | ~800 m ("around"; officers said 1,100 m, members said no) | ~1,600 m (6004144) | P7 |
| GB7(1)(h) frequency | ≥4 tph overall or ≥2 tph in one direction (Tring 4–5 tph one way: dacorum) | Hourly (Hatton; Croston is hourly, so not well-connected: chorley) | — |
| Housing weight in VSC | "Substantial" (6009966, 6005495) | "Moderate" for 4–8 homes at 1.9–2.2 years (6010313, 6011736, 6009281, 6011972) | P12 |
| GB7(1)(b), householder | ~39–42% cumulative, set down and narrow (6010603) | ~93% plus 13% (6008745); most above 50% | P16 |

---

## 3. Test sequence as actually applied

```
Is the site in the Green Belt?  yes → S5 does not apply (S5(5)); S4/S5(1)(j) unavailable
   [trap: 6011694 applied S5; SDC runs S5(1)(j) "well-related to settlement" first on washed-over villages]
        │
Any GB7 category? Categories are ALTERNATIVES (one pass suffices; 6010313 ¶9/¶14 slip)
  (a) agriculture │ (b) reuse / extension / replacement (fn40 original building) │ (c) limited infilling in villages [one appeal, non-residential: 6010709]
  (d) limited affordable │ (e) PDL redevelopment, not substantial openness harm (gardens outside built-up areas = PDL)
  (f) listed forms, openness minimised │ (h) station: Annex B well-connected AND ~800 m (part-site rule)
  (g) grey belt, ALL of:
      (i)  grey belt?  (a) large built-up area [villages never, Annex E ¶3]; (b) towns only; (d) historic towns
           site-level, not parcel; containment; (c) NOT relevant  → then "fundamentally undermine" (never failed)
      (ii) fn41: no 5YHLS or HDT < 75% → automatic for housing; type-specific evidence for other uses
      (iii) sustainable location, "particular reference to TR3" (HO12 for travellers, fn42)
           significant movement "in context"? (1–9 homes: yes) → genuine choice of modes?
           route quality > distance; PT evidenced; CT corroborative; mitigation secured?
      (iv) major housing → GB8 (substantial weight to compliance; failure = inappropriate)
        │                                         │
   any category met                          none met
        │                                         │
 NOT INAPPROPRIATE                         INAPPROPRIATE → GB6(2) VSC
 S5(5): approve unless benefits            substantial weight to GB harm + openness + other harm,
 "substantially outweighed", applying      "clearly outweighed"? Housing supply has never carried it at
 S5(2) (refusal policies: DP3(3),          appeal; fallbacks, essential rural need and specialist care have
 TR6(4), F5/F7, N6, L3(4), HE6)            (councils). S5(5) balance "not engaged" (6007428 ¶28)
 [openness NOT weighed: 6011301 ¶18;
  trap: bromsgrove-25-00751 weighed it]
```

**Where decision-makers diverge or go wrong:**
- **Members:** re-run limb (i) by regrading purpose (a) at village or contained edges. That loses at appeal (6011103).
- **Officers (SDC):** skip the Annex B washed-over exclusion, treat a BUAB (built-up area boundary) as proof of sustainability, and give limited weight to carriageway walking.
- **Inspectors:** occasionally let a failed (g) override a passed (b) (6010313), import (c) into (a) (6009281), or conflate PDL with (g) (6008688 ¶12).

---

## 4. Reference-case shortlist

| # | Case | Why cite it |
|---|---|---|
| 1 | **PINS-6006637** Hatton Station (Warwick, hearing, 23 Sep) | Heaviest authority on limb (iii). Station 350 m but not well-connected; unlit, footway-less route fails despite low traffic; "necessity rather than choice" (¶26); TRO/s278 mitigation uncertain (¶34–35); GB8(1)(b) fail. Same rail line as Claverdon |
| 2 | **PINS-6010313** Newchapel (Tandridge) | 5 homes, 40 mph, no footway, unlit: fails; "significant … in this context" (¶13); moderate or modest housing weight at 1.97 years (¶33, 38); HE6 harm vs "relatively modest" benefits (¶23) |
| 3 | **PINS-6009966** South Nutfield (Tandridge) | "TR3 must be read as a whole" (¶27); shared carriageway at 40/30 mph (¶21); unevidenced bus (¶22); consistency with an earlier appeal (¶25); substantial housing weight still no VSC (¶45) |
| 4 | **PINS-6011736** Copthorne (Tandridge) | Hourly 7-day bus plus CT 52 still fails because part of the walk is in the road (¶4–7); vouchers and an unsecured 30 mph extension rejected (¶6) |
| 5 | **PINS-6007428** Halsall (West Lancs) | "realistic and safe opportunities" test (¶14); lighting does not cure a missing footway (¶15); an unsecured footway link is fatal (¶13, 16); S5(5) "not engaged" (¶28) |
| 6 | **PINS-6008688** East Grinstead (Tandridge) | Even a lit continuous footway fails if it is narrow and beside a busy road (¶14, 17); no CT noted (¶18); settlement boundaries are not a proxy (¶13) |
| 7 | **PINS-6009645** Wood Street (Guildford) | **The applicant's best case:** unlit footway that switches sides once, plus a 7-day DRT bus, passes (¶12–14) |
| 8 | **PINS-6011301** Bournheath (Bromsgrove) | Generous pass: on-demand app bus plus CT 43; 5 homes still "significant movement" (¶10) |
| 9 | **PINS-6010471** Higher Poynton (Cheshire East) | Site not parcel (¶15); purpose (c) irrelevant (¶12); continuous lit 30 mph footway plus CT 52 passes (¶18–20) |
| 10 | **PINS-6011103** Biddulph Moor (Staffs Moorlands) | Members' "large built-up area" overturn reversed: villages are not large built-up areas (¶12–16); short unfooted stretch acceptable when flat and visible (¶19); costs refused |
| 11 | **PINS-6004144** Hurst Green (Tandridge, hearing) | (h) fails at ~2× walking distance (¶29); not every service need be walkable (¶28); CT in context (¶32); GB7 pass then lost on odour |
| 12 | **APP-P0119-C-26-3378284** Mangotsfield (hearing) | Conurbation-absorbed village counts as a large built-up area (¶36); containment (¶38–40); "in a meaningful way" (¶41); major threshold (¶44–45) |
| 13 | **PINS-6007184** Thundersley (hearing) | Large-scheme template: contained parcel against a "strong" study rating; Golden Rules substantial weight; allowed |
| 14 | **PINS-6009281** Chalfont St Peter | The only 2026-Framework grey belt rejection: uncontained site at a town edge (¶15–17) |
| 15 | **PINS-6008528** Beare Green | HDT below 75% satisfies limb (ii) despite a five-year supply (¶10); CT 25 plus local evidence fails (¶12); S5 does not displace GB7 (¶8) |
| 16 | **PINS-6012481** Well Hill | Car dependence moderates housing weight (¶42) |
| 17 | **APP-G2245-C-26-3377906** West Kingsdown | Footnote 7 removal explained (¶9–10); would fail (iii) for general housing (¶19) |
| 18 | **PINS-6005916** Burnett solar | Non-housing limb (ii) on national targets (¶22); plan-wide "fundamentally undermine" (¶18) |
| 19 | stratford-26-00617-PIP / -00918-PIP | How SDC officers read limbs (i) and (iii) and the S5(5) balance; the Snitterfield "existing residents" and "short car trip" reasoning to rebut |
| 20 | threerivers-25-2168-OUT, basildon-25-00575-OUT | The members' overturn playbook (purpose (a) regrading; "around 800m"). Appeals are pending |

---

## 5. Distillation notes for future agents

**Capture for every limb (iii) finding:**
- walking distance to each named service, and the time;
- footway: none, partial, far side only, continuous, or narrow;
- lighting;
- speed limit and any speed survey;
- whether pedestrians share the carriageway, and for how long;
- crossings, including whether one is formal or secured;
- bus: operator, frequency, days, and evening/Sunday service;
- DRT: evidenced or not;
- station: tph, distance, whether step-free;
- the CT score and what it was compared with;
- the highway authority's stance;
- any mitigation, and whether it is secured;
- whether the inspector treated the scheme as "significant movement".

Quote the paragraph where the route is characterised.

**Capture for limb (i):**
- which purpose was disputed;
- whether a study parcel was cited, and whether the site was separated from it;
- the containment features;
- whether the settlement is a village or a large built-up area;
- whether purpose (c) was (wrongly) weighed.

**Capture for limb (ii):** the supply figure, the HDT figure, and for non-housing uses the evidence source.

**Capture for VSC:** the weight word given to the housing and the reason for moderating it (scale, car dependence, self-build not secured).

**Traps:**
- Letters dated 17 Aug may be 2024-based. Check paragraph citations.
- `GB7(1)(g)` without a limb is used for a whole-(g) pass.
- A (b) pass followed by an "inappropriate" conclusion (6010313).
- 2024 ¶155(c) mapped to `GB7(1)(g)(iii)` in transitional letters (6007316, 3378286).
- Councils citing GB1 for the purposes.
- Openness wrongly weighed after a not-inappropriate finding.
- "Annex E" cited: that is correct 2026 Framework text, not old guidance.

**Tags in use:** `sustainable-location-pass/fail`, `rural-lane-no-footway`, `connectivity-tool`, `grey-belt-accepted/rejected`, `village-not-large-built-up-area`, `golden-rules`, `station-route-h`, `s5-5-balance`, `vsc-not-shown`, `overturned-officer-rec`, `unmet-need-type-specific`.

**Proposed schema and tag improvements (not applied):**
1. An optional `location_facts:` block with the fields `walk_m`, `footway` (none|partial|far-side|continuous|narrow), `lit` (y/n/part), `speed_mph`, `carriageway_walking_m`, `crossing` (none|informal|secured), `bus_freq`, `drt` (none|claimed|evidenced), `rail_tph`, `rail_m`, `ct_score`, `hwa_objection`. This would make section 2a generatable.
2. `officer_recommendation:` (approve|refuse|none) and `member_vote:` on committee cases, replacing the free-text overturn tag.
3. Split `grey_belt` into `grey_belt_purpose_a/b/d:` (strong|moderate|weak|n/a), plus `parcel_rating:`.
4. `gb7_route:` (the category relied on), to stop (b)/(e)/(g) confusion.
5. Tag `footway-far-side`, `crossing-secured`, `drt-evidenced`, `existing-users-argument`.
6. Tag `letter-internal-inconsistency` for 6010313-type slips.
7. Record `housing_weight:` for the homes separately from HO7 finding rows.

---

## 6. Gaps and open questions

- **No GB7(1)(h) pass,** and no appeal ruling on whether ~1,100 m is "around 800m". Watch the Three Rivers appeal and the Dacorum/Tring inquiry (10 Nov).
- **GB7(1)(c) limited infilling in villages** has one appeal analysis, on B8 vehicle storage (6010709 ¶8–11: on-the-ground test, no discernible village; 1.3 ha is not limited infilling). None yet on housing. The Annex B washed-over exclusion is now applied squarely at 6009919 ¶49 (see P15), with 6010097 going the other way.
- **The member-overturn appeals are pending:** Basildon ×3, Three Rivers and Chorley (6014396). They will show whether regrading purpose (a) at a town edge survives.
- **No appeal with the exact Claverdon pattern:** a far-side footway reached by crossing an unlit 40 mph road, plus a station about 1.4 km away. The nearest are 6009645 (pass: one crossing, speed not stated), wychavon-W-26-01874 (council fail: 40 mph, no crossing) and pre-2026 Ravenshead and Wolvey.
- **Connectivity Tool semantics are unclear.** Is 43 really the "90th percentile nationally" (6011301)? What does "above average for rural town and fringe" mean? No letter explains the scale.
- **Limb (ii) "type"** has not been tested for market housing against an affordable-only need.
- **No SoS Green Belt housing decision yet;** Albrighton and Croxley Green are pending.
- **Harvest targets:** Tandridge, Guildford, Mole Valley and Sevenoaks written-reps letters from October (the Metropolitan Green Belt appeal volume); Warwick DC Green Belt PIPs (Hatton, Shrewley); SDC Green Belt refusals (none in the set: all SDC Green Belt housing cases are approvals).

---

## 7. Application to a Claverdon-type case

The facts: 5 open-market homes at the edge of a washed-over Category 3 village, on 40 mph Station Road. The footway is on the far side only and the road is unlit. The station, 1.4 km away, is an hourly request stop. SDC has a 2.21-year supply.

| Step | Likely finding | Cuts FOR the scheme | Cuts AGAINST |
|---|---|---|---|
| Route | Annex B: a washed-over village is not a settlement, so S5(5) applies and the case goes to GB6/GB7 | SDC officers treat such villages as settlements (00617, 00918); no effect in the Green Belt | 6008528 ¶8: S5(1)(j) is not available |
| GB7(1)(h) | **Fails twice:** hourly service is under 2 tph in each direction, and 1.4 km is ~1.75× the reasonable walking distance | — | 6006637 ¶18 (same line, same timetable problem); 6004144 ¶29 (2× distance) |
| (g)(i) grey belt | **Pass.** A village is not a large built-up area (Annex E ¶3); no towns in the gap | 6011103, 6010471, SDC stock paragraph | Do not argue this. Members regrading purpose (a) lost in 6011103. Purpose (c) is irrelevant (6010471 ¶12) |
| (g)(ii) | **Pass, automatically,** at 2.21 years | 6010313 ¶11, 6009966 ¶17 | — |
| (g)(iii) | **The battleground.** Every trip on foot needs a crossing of an unlit 40 mph road to a far-side footway | 6009645 (unlit footway, one crossing, DRT bus: pass); SDC's own 00617 and 00918; sefton (crossing secured) | 6010313 (5 homes, 40 mph, unlit); 6009966 (40 mph, "read as a whole"); 6011736 (hourly bus plus CT 52 still failed: route quality); 6006637 (unsafe route to a thin station; "necessity not choice"; highway authority no-objection irrelevant); 6008688 (narrow footway beside traffic fails); wychavon-01874 (40 mph, no crossing, unlit) |
| (g)(iv) | Not engaged (5 < 10) | — | No affordable housing is extracted, so the benefit is lower |
| If inappropriate: VSC | Almost certainly not shown | — | 0 housing VSC passes at appeal; 5 homes = "moderate" or "modest" (6010313 ¶33/38) or at most "substantial" and still refused (6009966 ¶45); car dependence moderates housing weight (6012481 ¶42) |
| If not inappropriate: S5(5) | SDC's reading (00617) approves even with substantial character harm | stratford-26-00617-PIP | The S5(2) routes lose appeals: HE6 heritage harm (6008539; 6010313 ¶23, where moderate setting harm beat "relatively modest" benefits), DP3(3) (6011803) |

**How the case turns.** Limb (iii) is the whole case.
- **The applicant's best authority is 6009645.** The distinctions:
  - 6009645's footway was continuous to the services after one crossing, and no speed was recorded;
  - it had a 7-day DRT stop at the drive end;
  - Station Road is 40 mph, and the objection is that the far-side footway narrows or ends on the station route.
- **The objector's best line** combines four authorities:
  - 6011736: part of the route is in the road or otherwise hostile, which beats an hourly service and a middling CT score;
  - 6006637: a thin station reached by an unsafe route gives no "genuine choice";
  - 6008688: narrow footways beside traffic are not attractive;
  - 6009966: TR3 is "read as a whole" for 5 homes.
- **Evidence to put in:**
  - a measured footway survey (width, continuity, where it ends on the station route);
  - a speed survey;
  - the timetable, showing under 2 tph and the request-stop status;
  - a Connectivity Tool run. Scores of 23–25 failed in 6008528 and wychavon-01639;
  - an answer to any "existing residents walk it" argument, using 6006637 ¶26.
- **Committee strategy.** Refuse on limb (iii) and TR3, not on grey belt. Inspectors have upheld every limb (iii) refusal in the 2026 set where the route lacked a usable footway, and they have reversed village "large built-up area" refusals.

---

## Corrections made

None. All the cases opened were coded consistently with their primary text. The internal inconsistencies in 6010313 and 6008688 are already flagged in their case files.
