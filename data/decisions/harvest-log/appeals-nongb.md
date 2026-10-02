# Harvest log — appeals-nongb

Agent: appeals-nongb (non-Green Belt appeal decisions, 17 Aug 2026 onward). Session date 2026-09-23.
Result: **117 case files** carry `harvested_by: appeals-nongb`: 91 tier 1 and 26 tier 2; 31 allowed, 85 dismissed, 1 part-allowed. That covers the whole of slices/nongb-A.tsv (6007220 and 6007477 are covered by joint-letter files PINS-6007221 and PINS-6007474), 45 earlier PINS cases from my own scan, Planning Geek cases, and 5 old-style ACP decisions. Several were written by helper sub-agents I forked, following the same instructions and checks. Where a file was already written by another agent I enriched it: 6003718, 6010035 and 6010401.

## Sources and methods (what worked)
1. **Planning Geek** WordPress API (`/wp-json/wp/v2/posts?after=2026-08-15&per_page=100`). Every post links the decision PDF under `/wp-content/uploads/2026/0[89]/`. This gave Whitchurch 6006893, Spring Gardens 6009593, Findon 6006900, Cople 6011253, Ivinghoe 6007136, Ugley 6008264, Twelve Acre 6008895, Drayton 6005108 and Beckington 3375062.
2. **PINS comment-on-an-appeal service**: `https://appeal-planning-decision.service.gov.uk/comment-planning-appeal/appeals/<7-digit>` shows the outcome, decision date, type, site, LPA, application ref and the `/published-document/<uuid>` PDF. I enumerated refs 6000000–6012700 before being told to stop. It rate-limits (HTTP 429) at roughly 10+ requests/second, so use 3 threads with a 0.5 s delay and back off 60 s on 429. My partial index is kept as `pins-decided-index.tsv` (marked superseded). The coordinator/sos-and-other corpus (`pins-corpus-index.tsv`, 1,084 decisions) replaces it. appeals-greenbelt found a better route: `/comment-planning-appeal/decided-appeals?search=<postcode letter>` with a cookie jar.
3. **ACP (old-style 33xxxxx refs)**: `https://acp.planninginspectorate.gov.uk/ViewCase.aspx?caseid=<7-digit>` works for old-style refs with a browser User-Agent. It gives the decision date, outcome, procedure and `ViewDocument.aspx?fileid=` links. It does NOT work for 600xxxx refs ("No case found"). It is slow, about 75–100 case pages a minute across 4 processes of 10 threads. Scanned 3345000–3345690, 3350000–3356815, 3360000–3365308, 3368500–3374119 and 3377518–3379193, about 14,650 case pages. Post-17-Aug decisions found in those ranges are mostly enforcement or LDC; the Planning (W) ones are listed under leads below.
4. **Richborough appeals database** (`richborough.co.uk/appeal-decisions/`) lists major housing appeal decisions with PDFs. It confirmed that the big post-August schemes (Southminster 6005664, Harlestone Rd 6004385, Storrington 6005400, Westwood Heath 6002759, Selston 6008160) are new-style and in the corpus.
5. Web search found the headline cases: Property Week on Southminster (6005664), and Planning Resource on the 249 homes, which is 6005809. planningresource.co.uk and propertyweek.com return 403 or a Cloudflare page to fetch and curl, so read only their search snippets.

## Dead ends
- Planning Resource and Property Week full text: 403 or a JS challenge.
- The Maldon Civica document portal (cdp.maldon.gov.uk) is JS-only. It wasn't needed, because Southminster is in the PINS corpus.
- An ACP `ViewDocument` fileid given in a search result (65299169) turned out to be an unrelated March 2026 Rugby decision. Search-engine titles for ACP PDFs are unreliable.
- The ACP scan cannot be filtered by date or type before fetching, so a full sweep of 3340000–3381000 takes hours.

## Coordination incidents
- Before the Wave 2 slices existed, my sub-agents wrote refs that were later sliced to corpus-nongb-b (6010023, 6010557, 6010682, 6010826, 6010834, 6010973, 6011079, 6011150, 6011217, 6011373, 6011421, 6011458, 6011498). corpus-nongb-b agreed to keep my versions.
- During nongb-A there were write races with corpus-nongb-b, whose list overlapped nongb-A. My versions are now on disk for 6007807, 6007856, 6007871, 6009032 and 6009198 (their text for these was lost; frontmatter survives in an earlier `index/cases.json`). Their version is on disk for 6009181. They wrote 6007793, 6007861, 6007941, 6008022, 6008115, 6008154, 6008160, 6008167, 6008359, 6008634, 6008643, 6008646, 6008707, 6008739, 6008742, 6008785, 6008881, 6008944, 6008977, 6009042, 6009097, 6009127 and 6009211 from nongb-A.

## LEADS NOT FOLLOWED
- Old-style ACP Planning (W) decided after 17 Aug and not yet written:
  - APP/Y9507/W/25/3362380, Windmill Down Farm, Hambledon (SDNP soil-recycling s73). Dismissed 10 Sep. Letter read (fileid 66059047); waste/commercial, so a lead for sos-and-other. The inspector found "no aspect of the revised Framework that materially alters my assessment" (DL ¶2).
  - 3355074, The Lodge, Kingsbury Road, Brent. Dismissed 21 Aug. No PDF on ACP yet.
  - 3378215, Land east of New Barn Farm Lane, Blendworth (SDNP, hearing). Dismissed 25 Aug. No PDF on ACP yet.
  - 3378441, Land south of Woodville Road, Overseal (South Derbyshire, hearing). The page shows a 3 Sep date but "Not yet decided"; recheck.
  - Raunds costs decision (fileid 66108615) read; covered within APP-M2840-W-25-3366989.
- ACP ranges NOT scanned: 3340000–3345000, 3345690–3350000, 3356815–3360000, 3365308–3368500, 3374119–3377518 and 3379193–3381000+. Scanner: scratchpad `scan_acp.py` (see method 3).
- Planning Geek items outside my slice: Slough enforcement 3376201 (sos-and-other), Albury Dairy s73 6005081, Beckington Class Q, Ruislip bingo (town centre), Wagtails Farm rural worker (no PDF on PG).
- From midlands-lpas: the Cherwell Appeals Progress Report (Sept 2026) mentions dismissals at Foxden Way, Great Bourton (5 self-build bungalows); Mole End, Great Bourton (PIP 8–9 homes dismissed for under-density against 30 dph, despite a shortfall); and 73 High Street, Kidlington. Refs are not given; find them in the corpus by site.
- Green Belt leads passed on (now mostly covered by appeals-greenbelt): 6004144, 6004344, 6005150, 6006286, 6012481, 6012188, 6003507.

## Coverage table (ref | authority | tier | outcome | determinative codes)
| case | authority | tier | outcome | determinative |
| --- | --- | --- | --- | --- |
| APP-E3335-W-25-3375062 | Somerset | 1 | allowed | S5(1)(j), HE6(1), HE6(4), TR3 |
| APP-M2840-W-25-3364729 | North Northamptonshire | 2 | allowed | development-plan-only |
| APP-M2840-W-25-3366988 | North Northamptonshire | 2 | allowed | N6 |
| APP-M2840-W-25-3366989 | North Northamptonshire | 1 | allowed | N6, DM6 |
| APP-X3025-W-25-3370422 | Mansfield | 2 | allowed | DM6, TR4 |
| PINS-6001260 | Wiltshire | 1 | allowed | S5(1)(j), HO7, TR4 |
| PINS-6002880 | Cornwall | 2 | dismissed | N4, HE6, S4 |
| PINS-6003055 | Cornwall | 1 | dismissed | HE6(4), N4(1), S5(1), S4(2)(a)(ii) |
| PINS-6003588 | Colchester | 1 | allowed | development-plan-only |
| PINS-6003947 | Maidstone | 1 | dismissed | TR6(4) |
| PINS-6004062 | Crawley | 2 | dismissed | S4, CO1, DP3 |
| PINS-6004385 | West Northamptonshire | 1 | allowed | S3, S5(1)(j), HO7 |
| PINS-6004449 | Hastings | 2 | dismissed | TC2, S4(1) |
| PINS-6004494 | Durham | 2 | dismissed | S4, DP3(2)(a), DP3(3) |
| PINS-6004496 | Hinckley and Bosworth | 1 | dismissed | N2(1)(a), S3 |
| PINS-6004691 | Medway | 1 | dismissed | S5(1)(j)(i), S5(4), DP3(3), N2 |
| PINS-6004752 | Redcar and Cleveland | 1 | dismissed | N6, S4, HO7 |
| PINS-6004809 | Reading | 1 | dismissed | S4(1), DP3(3), DP3(1), P3, L2 |
| PINS-6004850 | Durham | 2 | dismissed | S4, DP3(2)(a), DP3(3) |
| PINS-6004909 | Cornwall | 1 | dismissed | HE8, HE4(2), HE6(1), HE6(4), S4(1) |
| PINS-6004929 | Lewisham | 1 | allowed | S3, S4, HO7, L2, L3, F5, F6, DM5 |
| PINS-6005108 | Vale of White Horse | 1 | allowed | S5(1)(j), AnnexD, HO7, HE6(4), N2 |
| PINS-6005119 | Cornwall | 1 | dismissed | N4(1), S5(1)(c), S5(1)(j) |
| PINS-6005194 | Bournemouth Christchurch and Poole | 1 | dismissed | N6(1)(a), HE6(4), HE4, DP3 |
| PINS-6005325 | Redbridge | 1 | dismissed | S4(2)(c), DP3(3), TR4 |
| PINS-6005328 | Cornwall | 1 | allowed | S5(1)(j), HO7, AnnexA(2) |
| PINS-6005653 | Maidstone | 1 | dismissed | S4(1), DP3, P5 |
| PINS-6005664 | Maldon | 1 | allowed | S3(1)(b), S5(1)(j), S5(1), HO7, HO1, N2, HE6, P3 |
| PINS-6005809 | Vale of White Horse | 1 | allowed | S5(1)(j), AnnexA(2), TR3(1)(a), HO7, HO8 |
| PINS-6005903 | Rother | 1 | dismissed | N4, N2(1), DP3(1), DP3(3), S5(1)(j), S5(2) |
| PINS-6005969 | County Durham | 2 | dismissed | S4, DP3(2)(a), DP3(3) |
| PINS-6005970 | Breckland | 1 | allowed | S3, S5(1)(j)(i), HO7, TR3 |
| PINS-6006049 | Tameside | 2 | dismissed | S4(1), DP3, P3 |
| PINS-6006053 | Buckinghamshire | 2 | part-allowed | DM6(2)(c) |
| PINS-6006054 | Burnley | 1 | dismissed | S4, HE6, HE4(2) |
| PINS-6006123 | Dover | 1 | dismissed | HO11, S5, TR3, E2, DP3 |
| PINS-6006128 | Leeds | 1 | allowed | S4, HO7, HO1, L2(1)(b) |
| PINS-6006144 | Bournemouth Christchurch and Poole | 1 | dismissed | S4, L2(1)(d)(i), L2(1)(d)(ii), N6(1)(a)(i) |
| PINS-6006151 | Shropshire | 1 | allowed | HO11(1)(a) |
| PINS-6006289 | Chelmsford | 1 | dismissed | S5(1), HE7(2), N2(1)(a), DM6 |
| PINS-6006305 | Calderdale | 2 | dismissed | TR4(1)(e), TR6(4), S4 |
| PINS-6006388 | North West Leicestershire | 1 | dismissed | S5, HO11(1)(c), TR3 |
| PINS-6006422 | East Riding of Yorkshire | 1 | allowed | S5(1)(a), HE6(4), CC2(2), W3(1)(a), P3, DM7(1), DM3(1)(e) |
| PINS-6006475 | Ashford | 1 | dismissed | S5(1)(j), HE4, HE6, HE9, DP3, N2 |
| PINS-6006517 | Waverley | 1 | dismissed | S4, DP3(3), F7(2), HO7 |
| PINS-6006581 | Waverley | 1 | dismissed | N4(1), N4(4), S5(1)(h), HO7 |
| PINS-6006617 | Exeter | 1 | dismissed | DM6 |
| PINS-6006629 | North Somerset | 1 | dismissed | F6, S5(2), S5(1)(g), AnnexF |
| PINS-6006644 | Worcester | 1 | dismissed | S4(1), S4(2)(c), S4(2)(a)(ii), DP3, TR6, L2(1)(d) |
| PINS-6006656 | Teignbridge | 2 | dismissed | N2(1)(f), S4, S3 |
| PINS-6006697 | Mole Valley | 1 | dismissed | S5(1)(a), HE4, HE6 |
| PINS-6006720 | Waverley | 1 | dismissed | S4(2)(c), DP3(1), DP3(3), P3(2)(a), N2(1)(a) |
| PINS-6006819 | East Hertfordshire | 1 | dismissed | S5(1)(j), DP3(3), TR6, HE6 |
| PINS-6006832 | Cornwall | 1 | dismissed | S5(1)(b), S5(4), S5(2), DP3, E4, TR3 |
| PINS-6006846 | South Tyneside | 1 | dismissed | S4(1), S4(2)(c), TR6(4), TR4(1)(c)(i) |
| PINS-6006893 | Basingstoke and Deane | 1 | dismissed | S5(1)(j), S5(2), N4(4), DP3(1), DP3(2), N2(1)(a), N2(1)(d) |
| PINS-6006900 | South Downs National Park Authority | 1 | dismissed | S5(4), N4, DP3, TR3 |
| PINS-6006950 | Bassetlaw | 1 | dismissed | S5(1)(j), S5(4), TR3, DP3(3), HO7 |
| PINS-6006985 | Southend-on-Sea | 1 | dismissed | DP3(3), S4(2) |
| PINS-6007054 | Guildford | 1 | dismissed | HE6(3), HE6(4), S4(1) |
| PINS-6007104 | Horsham | 1 | allowed | S5(1)(j), S6, HO3, AnnexA |
| PINS-6007136 | Buckinghamshire | 1 | dismissed | S4(1), HE6(1), HE6(4) |
| PINS-6007272 | Rother | 1 | dismissed | HO8, HO7, DP3(2)(a), DP3(3), S4 |
| PINS-6007319 | Croydon | 2 | allowed | S3(2) |
| PINS-6007323 | Cheshire East | 2 | dismissed | DP3, N2, S4 |
| PINS-6007348 | Bassetlaw | 1 | dismissed | S5(1)(e), TR3, S3 |
| PINS-6007373 | Barnet | 1 | allowed | S4, L2(1)(b) |
| PINS-6007391 | North Yorkshire | 1 | dismissed | HE4, HE6, HE7, HE9, S4(1) |
| PINS-6007403 | South Kesteven | 1 | dismissed | S5(1)(j)(i), S5(4), HE6 |
| PINS-6007416 | Cornwall | 1 | dismissed | S5(1)(j)(i), HE4, HE6(1), HE6(3), HE6(4) |
| PINS-6007423 | North Somerset | 1 | dismissed | F5, F6, S4 |
| PINS-6007431 | Cornwall | 1 | dismissed | S6(1), S5(1)(j), HO7 |
| PINS-6007451 | East Hertfordshire | 1 | allowed | S5(1)(d), S5(1)(j), HE6 |
| PINS-6007466 | Cornwall | 1 | dismissed | HE6(4), HE4, S5(1)(j), HO7 |
| PINS-6007474 | North Lincolnshire | 1 | dismissed | S5(1)(g), S5(3), S5(4), HO11 |
| PINS-6007494 | Islington | 2 | dismissed | TR4(1)(d), TR3(1)(c), L2 |
| PINS-6007526 | Epping Forest | 1 | dismissed | S4, L2(1)(d)(ii), DP3 |
| PINS-6007535 | North Yorkshire | 1 | dismissed | F5, S5(1)(d), DP3 |
| PINS-6007549 | Worthing | 2 | dismissed | S4, L2, DP3, P3 |
| PINS-6007589 | Dudley | 2 | allowed | development-plan-only |
| PINS-6007601 | Mole Valley | 1 | dismissed | HO11(1)(a), S5(3) |
| PINS-6007642 | North Yorkshire | 2 | dismissed | HE6, HE4, N4, S5(2) |
| PINS-6007715 | Islington | 2 | dismissed | HE4, HE6, S4 |
| PINS-6007776 | Burnley | 1 | dismissed | S4(1), HO9, P3 |
| PINS-6007807 | Cornwall | 1 | dismissed | S5(1)(d), N4 |
| PINS-6007856 | Gateshead | 2 | dismissed | S4(1), DP3(1) |
| PINS-6007871 | King's Lynn and West Norfolk | 1 | allowed | S4, L2(1)(b), DP3 |
| PINS-6008264 | Uttlesford | 1 | allowed | S5(1)(e), HO11, TR3 |
| PINS-6008434 | Wiltshire | 1 | dismissed | S5(1)(d), TR3, DP3(2)(d), N2, S3 |
| PINS-6008436 | Islington | 2 | dismissed | HE4, HE6, HE9, S4(1) |
| PINS-6008439 | Kensington and Chelsea | 2 | dismissed | HE6, DP3 |
| PINS-6008500 | Fenland | 1 | dismissed | F5, F5(2)(c), S5(1), S5(2), S5(4), DM6 |
| PINS-6008548 | Somerset | 1 | allowed | S5(1)(j), HO7 |
| PINS-6008555 | Elmbridge | 2 | dismissed | S4(1), L2(1)(d) |
| PINS-6008569 | Cheltenham | 1 | dismissed | S5(1)(j)(i), N4, N2 |
| PINS-6008895 | King's Lynn and West Norfolk | 1 | dismissed | HO11, S5(3) |
| PINS-6009032 | Horsham | 2 | dismissed | DP3(1), DP3(3), DP4, S4 |
| PINS-6009098 | North Lincolnshire | 1 | dismissed | F4, F7, S4 |
| PINS-6009197 | North Yorkshire | 2 | allowed | S3, S4 |
| PINS-6009198 | Camden | 2 | dismissed | HE6, HE9, L2(1)(d)(i), DP3, S4 |
| PINS-6009220 | Hinckley and Bosworth | 1 | dismissed | S6, S5, DP3 |
| PINS-6009593 | Horsham | 1 | allowed | S3, S5(1)(e), S5(1)(d), TR3, HO7 |
| PINS-6010021 | Burnley | 1 | allowed | development-plan-only |
| PINS-6010023 | Ipswich | 1 | dismissed | TR4, S4(1) |
| PINS-6010557 | Leicester | 1 | dismissed | S4(1), L2(1)(d)(ii) |
| PINS-6010682 | Fenland | 1 | dismissed | F5, S5(2), S5(1) |
| PINS-6010826 | West Northamptonshire | 1 | dismissed | S3, S5(1)(j), S5(2), DP3 |
| PINS-6010834 | Dorset | 1 | dismissed | S5(1)(j), S5(4), S3 |
| PINS-6010973 | Malvern Hills | 1 | allowed | S5(1)(e), S3, TR3, HO7 |
| PINS-6011079 | Mid Sussex | 1 | dismissed | S5(1)(g), S5(4), HO12, F7, F4, TR4 |
| PINS-6011150 | Shropshire | 1 | dismissed | S5(1)(j)(i), S5(4), AnnexB:settlement, DP3(3), TR3 |
| PINS-6011217 | South Derbyshire | 1 | allowed | S3, S5(1)(d), AnnexB:previously-developed-land, HO7 |
| PINS-6011253 | Bedford | 1 | allowed | S5(4), HO7, DP3, N2, TR3 |
| PINS-6011373 | Ashfield | 1 | dismissed | S4(1), S4(2)(c), DP3(1), DP3(3) |
| PINS-6011421 | High Peak | 1 | dismissed | L2(1)(d)(ii), DP3 |
| PINS-6011458 | Manchester | 1 | dismissed | S4(1), S4(2) |
| PINS-6011498 | Mole Valley | 1 | dismissed | DP3, DM6, S5(1), S5(2) |

## OBSERVED PATTERNS
1. **Passing the S5(1) gateway is rarely the contest; the "substantially outweighed" balance is.** Several cases pass S5(1)(j) and still lose on National Landscape, heritage or design harm: Whitchurch PINS-6006893 (2.2–3.1 years), Smarden PINS-6006475 (3.16 years), Robertsbridge PINS-6005903 (3.04 years, HDT 35%), Haslemere PINS-6006581 (1.28 years, via S5(1)(h)), Rosudgeon PINS-6007416, Truthwall PINS-6003055 and PINS-6008569. The allowed ones are unconstrained, contained edge sites with buses or walkable services: Drayton PINS-6005108, Kingston Bagpuize PINS-6005809, Southminster PINS-6005664, Harlestone Rd PINS-6004385, Mileham PINS-6005970, Beckington APP-E3335-W-25-3375062 and Carnkie PINS-6005328.
2. **"Physically well-related" in S5(1)(j)(i) is read inconsistently.**
   - Physical connectivity only: Whitchurch ¶69.
   - Spatial, functional and visual: Kingston Bagpuize ¶56, by the same inspector.
   - Accessibility, where an unlit lane with no footway fails the limb: Findon PINS-6006900 ¶17, Coryates PINS-6010834, Gringley PINS-6006950.
   - Whether the place counts as a settlement under Annex B at all: Chavel PINS-6011150, Spring Gardens PINS-6009593 ¶13.
   - Character folded into the test: Cliffe Woods PINS-6004691, PINS-6007403.
   Expect this to be litigated.
3. **Evidenced unmet need without a shortfall.** Kingston Bagpuize (PINS-6005809 ¶¶57–60) held that a "very marginal" compliant supply plus significant affordable need meets S5(1)(j), because the limb says "including, but not limited to". Drayton (PINS-6005108), in the same council three days earlier, found about 4.9 years on different evidence. A marginal shortfall is enough, and strong HDT results do not rebut it.
4. **S5(1)(e) infill is the reliable small-site route, and it doesn't need a shortfall or a nearby settlement.** It passed at Spring Gardens PINS-6009593 (¶16: the well-related test applies only to (h) and (j)) and at Broadwas PINS-6010973, even with a 5-year supply and a new plan. It failed where the plot adjoins houses on one side only (Ugley PINS-6008264 ¶10, where consented but unbuilt houses were ignored) or next to a single dwelling (Findon ¶26). It passed but lost on TR3 at PINS-6007348.
5. **Falling outside all S5(1) categories means S5(4)**, where the benefits must substantially outweigh the harm. It usually fails (Findon, Coryates, Chavel, Gringley, Cliffe Woods, Ansty PINS-6011079). It succeeded at Cople PINS-6011253, where there was no TR3 harm, a PIP 1–9 range and a self-build deficit.
6. **DP3(3) and S4(2)(c) / S5(2) are the standard refusal machinery.** DP3(1) conflict becomes a "should be refused" policy, which engages S4(2)(c) or S5(2). This happened in more than 20 cases, including Selston PINS-6011373, Brackley Sq PINS-6005325, PINS-6006720, PINS-6006985 and PINS-6004494. The same route runs through F5/F6/F7 (Wisbech PINS-6010682, PINS-6006629, PINS-6007423), TR6(4) (Boldon PINS-6006846), N6 (PINS-6004752, PINS-6006144) and N2(1)(a)/BNG. One inspector used S5(2) to skip the S5(4) balance altogether (PINS-6010682).
7. **Annex A(2) cuts countryside and settlement-boundary policies down to limited or very limited weight.** Examples: Kingston Bagpuize ¶76, Drayton ¶139 (moderate), Thornton PINS-6004496, Carnkie, Whitchurch ¶67. Character, design and heritage policies keep full weight (Smarden ¶66, Ugley ¶7: HO11-consistent countryside policy). Sub-area allocation policies can keep "great weight" (Kingston Bagpuize ¶76).
8. **HO7 "substantial weight" is applied unevenly.** It was given in full in most major schemes. It was reduced to significant (Beckington, Harlestone Rd, Medvale PINS-6005653, Henfield PINS-6007104), moderate (Thornton, Worcester PINS-6006644 at 2.37 years, Rosudgeon) or limited (single dwellings), often without naming HO7. The weight on housing benefit turns out to depend on the inspector more than the policy.
9. **Heritage.** HE6(1) substantial weight, scaled to the asset's grade, beats housing even at 3.1–3.9 years where Grade I, Grade II* or World Heritage Site assets are affected: Ivinghoe PINS-6007136, Smarden, St Day PINS-6004909, Rosudgeon, PINS-6007466. HE4 "clear and convincing justification" is run as a separate hurdle (Smarden ¶59). Harm through loss of a functional relationship without intervisibility counts (Smarden ¶¶14–20).
10. **Self-build and BNG are a new free-standing failure mode.** The exemption fails where self-build is not secured by a s106 or UU (Exeter PINS-6006617, Danbury PINS-6006289, Thornton PINS-6004496, where the undertaking bound the wrong land, and Coryates). Spring Gardens succeeded with a s106 BNG fallback. Inspectors split on whether self-build can be secured at PIP stage: no at Findon ¶20, yes at Cople ¶¶17–18.
11. **Transition handling falls into three groups.**
    - (a) Most inspectors invited written comments on the 2026 Framework, or reopened the hearing to do so (Smarden ¶3).
    - (b) A sizeable minority decided without consulting because the relevant policy was "not materially/substantially changed". Examples: Southminster PINS-6005664 (decided the day after publication), Beckington ¶3, Raunds APP-M2840-W-25-3366989 ¶5, Mansfield APP-X3025-W-25-3370422 ¶10, Hambledon 3362380, and N Teasdale's three letters.
    - (c) Letters issued on 17 Aug applied the 2024 Framework outright: Exeter PINS-6006617, Poole PINS-6005194, Tiptree PINS-6003588.
    - Old-style ACP decisions nearly all used route (b).
12. **Drafting slips are frequent.** Check before quoting:
    - 2024 "significantly and demonstrably outweigh" wording: Drayton ¶145, Clicker PINS-6007431, PINS-6005653, PINS-6007104, PINS-6007466, Carnkie.
    - The S4/S5 test inverted: Ivinghoe ¶35, Ipswich PINS-6010023, PINS-6004809, Kingston Bagpuize ¶84.
    - Wrong codes: "T3", "H07", "S05", "SD5", and S5(1)(j) mislabelled as (h).
    - "great weight" and "less than substantial" carried over into HE6 findings.
13. **Density (L3) and efficient use (L2) do not override context.** Whitchurch ¶51, Smarden ¶67 and Haslemere (the 35 dph station minimum was waived in a National Landscape). L2(1)(d) garden-plot criteria act as a gate on the "substantial weight" (Leicester PINS-6010557, Poole PINS-6006144). L2(1)(b) underused land earns substantial weight (Barnet car park PINS-6007373, Ivinghoe ¶34).
14. **Fallbacks and council inconsistency decide cases and costs.** Ugley PINS-6008264 was allowed on an extant three-dwelling fallback. At Beckington (full costs), the council had permitted a larger adjacent scheme. At Raunds (costs), the council withheld its own ecologist's favourable advice.
