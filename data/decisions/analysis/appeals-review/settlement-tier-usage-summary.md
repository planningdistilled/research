# Settlement-tier labels in decisions: how they were (and were not) used

Generated 1 Oct 2026 from the full dataset (every PINS letter in `open:pins-corpus/` and every case file in `cases/`). One row per decision; every quotation machine-checked against its source (whitespace-normalised substring match). Register: `settlement-tier-usage.tsv`.

## Method

Regex (case-insensitive) over the corpus letters, the case files and the SDC OCR reports:

```
service village|service centre|service center|local service|key service|rural service|settlement hierarchy|main rural centre|rural centre|local centre village|key settlement|category (1|2|3|4|one|two|three|four) (village|settlement)|tier (1|2|3|4|5|one|two|three|four|five) (village|settlement)|(primary|secondary|larger|smaller|service) (village|settlement)s?\b|sustainable (village|settlement)
```

Codes re-lettered 1 Oct 2026 (final scheme A–F plus excluded search matches); earlier schemes that day were A1/A2 with B–F, then A–H. Hits: 157 corpus letters, 54 case files (41 overlapping the letters), 0 genuine hits in the SDC OCR reports (the one loose match is "Category 10(a) of Schedule 2 of the EIA"). Deduplicated to **170 decisions** that mention a tier label at all, out of a scope of every decision in the dataset as it stood on 1 Oct 2026 (all 1,400 corpus letters and all 971 case files, commit 6b65579). 80 of the 170 mention services without referencing a tier (excluded, X in the register), so **90 decisions use a tier label in the hierarchy sense**; the great majority of decisions never mention one. Each decision was read at every matching passage and given one primary code:

- **A** the shorthand applied wrongly: tier treated as the answer on location, with no route sentence
- **B** tier acknowledged, location decided against on the route
- **C** tier cited in support of the scheme, beside route or transport evidence
- **D** used *against* the scheme (low tier / unlisted / outside the hierarchy)
- **E** descriptive or incidental
- **F** set aside as unusual: location finding imported from an adjoining recent, undelivered permission (Henfield 6007104; A on the decision text)
- **excluded** (X in the register): the regex matched generic wording such as “local services and facilities”, “key services”, “larger settlement” as plain description; no tier referenced

## Counts

| Code | Decisions |
|---|---|
| A the shorthand applied wrongly: tier treated as the answer, no route sentence | 4 |
| B tier acknowledged, location decided against on the route | 6 |
| C tier cited in support, beside route evidence | 14 |
| D used against | 43 |
| E descriptive | 22 |
| F set aside as unusual (Henfield; A on the decision text) | 1 |
| excluded: services mentioned, tier not referenced | 80 |
| **Total** | **170** |

Of the 90 decisions where a tier label genuinely figured (A–F), the single biggest use is **D: the tier counted against the site** (43). The label worked **for** a scheme in 19, and in **6** of those it was stated as the sustainability finding without route facts (code A), one of them an allowed appeal (Henfield 6007104). In **6** the inspector expressly noted the tier and decided the location against the site on the route (B).

## A — the shorthand applied wrongly (tier treated as the answer, no route sentence)

- **6007771** — Church View, Wilsthorpe Road, Braceborough (South Kesteven, 2026-08-17, dismissed); ¶20: “Braceborough is identified as a ‘smaller village’ within the LP Policy SP2 settlement hierarchy” — Tier treated as making the site "a sustainable location where small infill is supported in principle" with no route analysis; dismissed on other grounds. Route: none in the decision.
- **6010196** — Land at OS 7540 6621 Stourport Road, Great Witley (4 dwellings) (Malvern Hills, 2026-09-18, dismissed); ¶13: “Great Witley is identified in the development plan settlement hierarchy as a village” — Tier → "therefore reasonably accessible to the village’s services" with no route analysis; dismissed on other grounds. Route: none in the decision.
- **6007104** — Land adjacent to Cedar Cottage, Furners Lane, Henfield (Horsham, 2026-08-24, allowed); ¶10: “Henfield is a ‘tier 2 settlement’” — Tier 2 ("reasonable public transport services") plus a bare proximity statement ("close to High Street services, the primary school, and bus stops") is the whole location finding; no footway, lighting or frequency facts; allowed under S5(1)(j).
- **6008253** — Land East of College Road South, Aston Clinton (Buckinghamshire, 2026-09-24, allowed); ¶32: “Aston Clinton is defined within Policy S3 as a larger village which has reasonable access to facilities and services” — Location common ground on a Transport Assessment; off-site works, bus contribution and travel plan recorded in the decision. Moved to B 1 Oct 2026. Route: “I am content that the offsite highway works are necessary to enhance connectivity to local services and facilities” (¶42).
- **stratford-26-01458-FUL** — The Barn, Tithe Barn Lane, Earlswood (Hockley Heath) (Stratford-on-Avon, 2026-09-03, approved); (case file): “within the BUAB of an identified local service village, I am satisfied that the proposals would be in a sustainable location” — SHORTHAND: GB7(1)(g)(iii) passed in one sentence on LSV boundary with no TR3 route analysis; approved. Route: none in the decision.
- **stratford-26-01764-PIP** — Pittern Hill Riding School, Pittern Hill, Kineton (Stratford-on-Avon, 2026-08-25, approved); (case file): “Kineton is a Main Rural Centre; site outside the BUAB but within walking distance of services” — Main Rural Centre plus an asserted walking distance in a one-paragraph cross-check; approved. Route: none in the decision.

Note: of the five (after Aston Clinton 6008253 moved to B on 1 Oct 2026, because its location was agreed on a Transport Assessment and the decision records secured off-site works), the one allowed appeal, Henfield, was moved to the set-aside code (now F) on 1 Oct 2026 (location finding imported from the adjoining 191-home permission; see the site-context note), two appeals (Braceborough, Great Witley) were **dismissed** on other grounds with the tier accepted on location, and the two SDC decisions (Earlswood, Kineton) were approved. Pitstone 6010848 was moved to the route-evidence code (now B) on 1 Oct 2026 because ¶20 is a route analysis. Recoding and the reasoning are in `../service-village-page-adversarial-review.md`.

## B — tier acknowledged, location decided against on the route

- **6006722** — Land off Drake Street, Welland (Malvern Hills, 2026-09-28, dismissed); ¶11: “The village is a Category 1 settlement, with a range of services and public transport connections” — Category 1 acknowledged, but site outside the boundary and bus "very limited"; label did not carry the location. Route: “I crossed the 30mph carriageway and walked along the unlit footpath (on the opposite side of the street) to the village centre” (¶12).
- **6006900** — Land at Rogers Lane, Findon (South Downs National Park Authority, 2026-09-18, dismissed); ¶15: “The nearest settlement to the appeal site is Findon which is a service village” — Service village expressly noted and set aside: unlit unpaved lane and A24 crossing = car reliance "irrespective of the precise distance" (¶17). Route: “accessing Findon on foot or by bike from the appeal site would involve going along an unlit, unpaved narrow lane before crossing the Findon Bypass (A24)” (¶15).
- **6009745** — Pine Lodge, Chilworth Drove, Chilworth (Test Valley, 2026-08-17, dismissed); ¶7: “which is designated as a Key Service Centre containing a range of facilities and services” — Key Service Centre 500 m away acknowledged; unlit single-track lanes with no footway made occupiers "almost wholly dependent upon the car". Route: “They have no street lighting, and in the main, no footpath.” (¶14).
- **6009838** — Land on north side of Lodge Lane, Bolney (Mid Sussex, 2026-09-16, dismissed); ¶9: “Bolney is identified as a medium sized village providing essential services” — Medium village with services acknowledged; S5(1)(j) "physically well-related" failed on form/gaps. Route: “Lodge Lane has no separate footways or streetlights and for the most part is subject to the national speed limit. This would deter future occupants of the development from walking along this route to access facilities in Bolney.” (¶19).
- **6011231** — Gravel Farm, 250 Gravel Lane, Banks (West Lancashire, 2026-09-15, allowed); ¶9: “is identified in the LP as a ‘Key Sustainable Village.’” — Key Sustainable Village 1 km away acknowledged; continuous pavement but "limited access to local services" still a harm; allowed via another route. Route: “the distance to the nearest services and facilities in Banks would mean that future occupiers of the proposed dwelling would be largely reliant on the private car to meet their day-to-day needs” (¶14).
- **APP-G2245-C-26-3377906** — Land south east of Oaklands, St Clere Hill Road, West Kingsdown (Sevenoaks, 2026-09-08, allowed); (case file): “narrow lanes, service village, station 3+ miles” — Service village noted; remoteness would fail general housing; allowed only via HO12 flexibility for traveller sites. Route: “the site cannot be considered as sustainable in terms of public transport provision” (DL ¶18).

## C — tier cited in support, with route or transport evidence

B and C are the two outcomes when an inspector looks at both the tier and the route: in B the tier was acknowledged, the route evidence went against the site, and the route decided it; in C the route evidence supported the location, so the tier was cited beside it. A is different in kind: the tier was treated as the answer and there is no route sentence.

- **6006497** — Land at Mount Avenue, Chaldon (Caterham edge) (Tandridge, 2026-09-25, allowed); ¶44: “several Category 2 settlements as defined in the TDCS including Woldingham (56)” — Connectivity scores of Category 2 settlements used as comparators to find the site sustainable; route and transport also assessed; allowed. Route: “certain facilities are within a comfortable walk or cycle and although just over the 800m range at 850m, I am satisfied that future occupants would have a genuine choice of whether to walk or cycle to them” (¶35).
- **6007184** — Land south of Daws Heath Road, Thundersley (Castle Point, 2026-09-14, allowed); ¶95: “Thundersley is identified to be one of the most sustainable settlements in the” — Tier ("most sustainable settlements") cited with agreed high accessibility; allowed. Route: “There are a range of day-to-day facilities within walking and cycling distance of the appeal site, accessible via the existing pedestrian / cycle network. Bus stops from which services to and from Southend-on-Sea, Hadleigh and Rayleigh, as well as facilities in Thundersley, are within walking distance of the site.” (¶38).
- **6010973** — Cedars Farm, Broadwas (Malvern Hills, 2026-09-11, allowed); ¶9: “Broadwas is defined, in Annex B, as a Category 2 settlement as it has at” — Category 2 (two key services, daily bus) supported the location and the bus was tested as a genuine alternative; allowed. Route: “the public house, school, recreation field, and bus stops are all within walking distance of the appeal site and there is a doctor's surgery within cycling distance, even if this would only be suitable for competent and confident cyclists” (¶17).
- **6011103** — Land between Rudyard Road and Hot Lane, Biddulph Moor (Staffordshire Moorlands, 2026-09-07, allowed); ¶13: “Biddulph Moor is identified as a larger village, under SMLP Policy SS8” — Larger-village tier ("most sustainable settlements in the rural areas") plus a walked route (footpaths, lighting, one short gap) and buses; allowed. Route: “Routes to these from the appeal site would be along Rudyard Road and Hot Lane, which have footpaths and street lighting, except for a stretch along Hot Lane, which I saw had no footpath.” (¶19).
- **APP-E3335-W-25-3375062** — Land at Great Dunns Close, Beckington (Somerset, 2026-09-18, allowed); (case file): “A primary village with walkable shop, school, GP and frequent buses” — Primary-village tier with walkable services and frequent buses; allowed with costs. Route: “Beckington has facilities which enables residents to avoid many day to day excursions by car” (DL ¶26).
- **cheshireeast-25-2053-FUL** — Land of the former Knowle House, Sagars Road, Handforth (care home) (Cheshire East, 2026-08-19, approved); (case file): “The site is clearly within an area that has walkable access to key services” — Route evidence (pavements, lighting, Connectivity Tool) not the tier; approved. Route: “Sagars Road from the west side of the site entrance has pavements and street lighting. The site is clearly within an area that has walkable access to key services” (report ¶10.56).
- **maldon-26-00066-OUTM** — Land rear of 6-108 Mell Road, Tollesbury (Maldon, 2026-09-02, approved); (case file): “edge of 'larger village', development on two sides, no gap” — Larger-village edge, well related, with Connectivity Tool; approved on casting vote. Route: “acknowledge that there would be an element of reliance on private motor vehicle trips which cannot be fully addressed” (report ¶5.2.21).
- **malvern-M-26-01162-PIP** — Land at OS 8339 4949, Upton Road, Callow End (5-9 dwellings PIP) (Malvern Hills, 2026-09-14, refused); (case file): “Callow End is a Category 1 village with services and public transport within walking and cycling distance” — Category 1 accepted for accessibility ("would arguably have a choice"); refused on S5(1)(e). Route: “The location in terms of its sustainability is essentially well place for most key services and facilities provided in Callow End” (report, Location).
- **stratford-25-00346-OUT** — Home Farm, Land off A423, Southam (Stratford-on-Avon, 2026-08-26, approved); (case file): “adjoins Main Rural Centre Southam; well related and of a scale Southam can accommodate” — Main Rural Centre adjacency carried S5(1)(j) well-related/scale; approved (217 homes). Route: “A very small part of the site is within the Built Up Area Boundary for Southam – namely the proposed cycle / footway that feeds into Stowe Drive only” (update sheet p.10).
- **westnorthants-WNS-2022-0673-MAF** — Land off Beech Lane, Kislingbury (58 dwellings) (West Northamptonshire, 2026-09-08, refused); (case file): “adjoins Kislingbury (Secondary Service Village A) with a school, shop, pubs and a regular bus to Northampton” — Secondary Service Village with services and bus accepted for S5(1)(j); refused on a stack of harms. Route: “notwithstanding its location beyond the settlement boundary, the site occupies a sustainable location for residential development” (report ¶8.48).

## C (other: tier cited in support without a clear route finding)

- **6007272** — 46 North Trade Road, Battle (Rother, 2026-09-17, dismissed); ¶36: “Battle is one of the larger settlements in the district’s hierarchy” — Location accepted on tier "as a matter of principle"; dismissed on other grounds. Route: “services and facilities, including schools, are located close by and could likely be reached by sustainable transport modes” (¶47).
- **6011093** — Land adjacent to 7 & 8 Slade Close, Etwall (South Derbyshire, 2026-09-23, allowed); ¶26: “in this sustainable settlement location” — "Sustainable settlement" status used to add weight to 10 homes; allowed. Route: “The main parties agree that the appeal site lies within the settlement boundary of Etwall, that the site occupies a sustainable location” (¶6).

## D — tier counted against the scheme

- **6001260** — Paddock land adjoining 39a Stone Lane, Lydiard Millicent (Wiltshire, 2026-09-14, allowed); ¶4: “Core Policy 1 of the Wiltshire Core Strategy (WCS) establishes the settlement hierarchy” — Site outside hierarchy settlements = plan conflict; conflict given very limited weight (Annex A(2)) and scheme allowed on S5(1)(j); location decided on route, not tier.
- **6004144** — Land south of Warren Lane, Hurst Green (Tandridge, 2026-09-17, dismissed); ¶18: “identified as a category 1 settlement and acknowledged by the Council to be a large built up area” — Category 1 status used to characterise Oxted as a large built-up area for grey-belt purpose (a): counted against the site.
- **6005108** — Land west of Little Smiths Farm, Drayton (Vale of White Horse, 2026-09-11, allowed); ¶62: “Identifies Drayton as a ‘Larger Village’ within the settlement hierarchy” — Larger Village tier limits unallocated development to local needs: conflict found, but outweighed; 249-home allowed on S5(1)(j).
- **6005150** — Stables opposite Manor House, Headley Common Road, Headley (Mole Valley, 2026-09-09, dismissed); ¶14: “identifies Headley as a Tier 5 settlement” — Tier 5 = poor services, "unsuitable for development"; tier counted squarely against the location.
- **6005528** — Former Gardens to Knells House, The Knells, Carlisle (Cumberland, 2026-08-27, dismissed); ¶14: “to the larger settlements of Carlisle, Brampton and Longtown” — Policy criterion needs services in the village or good access to larger settlements; none in the settlement: against.
- **6005652** — Cud Hill House barn, Upton Hill, Upton St Leonards (Stroud, 2026-09-29, dismissed); ¶8: “set out the settlement hierarchy for the district” — Hierarchy policy (CP2/CP3) conflict plus unlit, unpaved route to the bus: location decided on the route.
- **6005809** — Land north of Spring Hill, Kingston Bagpuize with Southmoor (Vale of White Horse, 2026-09-14, allowed); ¶13: “KBS is a ‘Larger Village’” — Larger Village tier framed the spatial-strategy conflict; restrictive parts found materially inconsistent and given limited weight; allowed.
- **6005970** — Land south of Litcham Road, Mileham (Breckland, 2026-09-10, allowed); ¶6: “The Council’s spatial strategy is based on a settlement hierarchy defined in Policy GEN03” — Hierarchy (settlements categorised by services) and distance to larger settlements counted against; allowed on balance.
- **6006289** — Land north of Lyndale, Twitty Fee, Danbury (Chelmsford, 2026-09-15, dismissed); ¶6: “around Key Service Settlements (KSCs) outside the Green Belt” — Site "a significant distance" from the KSC: hierarchy counted against.
- **6006388** — Hall Farm, Copt Oak Road, Copt Oak (North West Leicestershire, 2026-08-25, dismissed); ¶6: “Policy S2 of the LP sets out the Council’s settlement hierarchy” — Reuse acceptable only "in accordance with the Settlement Hierarchy"; remote site failed.
- **6007158** — Brishing Court Farm, Brishing Lane, Boughton Monchelsea (Maidstone, 2026-09-28, dismissed); ¶22: “then rural service centres, then larger villages or even smaller ones” — Sequential hierarchy; site beyond any boundary, lowest tier: against.
- **6007431** — Land east of Lower Clicker Close, Clicker, Menheniot (Cornwall, 2026-09-10, dismissed); ¶15: “within or adjoining smaller settlements” — Policy 3 support for smaller settlements not met (not rounding off): against.
- **6007668** — Upper Farm, Shut Lane Head, Newcastle-under-Lyme (Newcastle-under-Lyme, 2026-09-29, dismissed); ¶10: “Next there are identified ‘Rural Centres’” — Site not in a Rural Centre; cited allowed appeals at Rural Centres distinguished: hierarchy against.
- **6007772** — The Lamb Inn, Lambs Green, Rusper (coach house, two units) (Horsham, 2026-09-24, allowed); ¶7: “is not identified within the settlement hierarchy in Policy 3” — Unlisted = countryside; conflict noted, conversion allowed anyway.
- **6008693** — The Pigs, Leesthorpe Road, Pickwell (Melton, 2026-09-24, dismissed); ¶7: “then sequentially to smaller service centres and rural hubs” — Sequential hierarchy; rural windfall site; against.
- **6008742** — Land adjacent Everglade Farm, Mount Pleasant Lane, Lymington (New Forest National Park Authority, 2026-09-07, dismissed); ¶12: “the Defined Villages are considered to be the most sustainable settlements in the NFNP” — Site outside the Defined Villages (the sustainable tier): against.
- **6008762** — Land north west of Holly Tree Cottage, Howlett End, Wimbish (Uttlesford, 2026-09-28, dismissed); ¶8: “lists Wimbish as a smaller village” — Smaller-village infill policy; site not shown to be within the boundary; against.
- **6008773** — Land adjoining The Ridings, Singleborough (Buckinghamshire, 2026-09-29, dismissed); ¶9: “Singleborough is not listed within Table 2 and is therefore not where development is directed towards” — Unlisted in the hierarchy; the Settlement Hierarchy Assessment scoring was discussed but could not rescue it.
- **6008848** — Beech Grove, Brock Road, Great Eccleston (barn to live/work) (Wyre, 2026-09-15, dismissed); ¶12: “LP Policy SP1 establishes the settlement hierarchy for the borough” — Outside defined settlements, development strictly limited: against.
- **6008987** — Land south of 2 Leighton Road, Hamerton (Huntingdonshire, 2026-09-29, dismissed); ¶11: “for the smaller settlements in the district, Policy LP 9 recognises this” — Smaller-settlement tier (restrictive policy) plus two-buses-a-day: against, route decisive.
- **6009106** — Land at Tuttle Farm, Lock Road, North Cotes (East Lindsey, 2026-09-30, dismissed); ¶8: “in accordance with the settlement hierarchy” — Site outside the settlement: conflict with SP1/SP2.
- **6009184** — Peterstone Lodge, Burnham Road, Burnham Overy Town (King's Lynn and West Norfolk, 2026-08-17, dismissed); ¶5: “categorises each of these settlements as Tier 6: Smaller Villages” — Tier 6 (very limited services); LP02 restrictive: against.
- **6009367** — Carlow House Barn, Woodman Lane, Cowan Bridge (Lancaster, 2026-09-03, allowed); ¶9: “a location that is not identified for housing growth within the settlement hierarchy” — Conflict with SP2/DM4 noted; allowed anyway.
- **6009409** — Godolphin House Stables, Broughton Lane, Leire (Harborough, 2026-09-17, dismissed); ¶7: “in accordance with the settlement hierarchy, and development in the countryside will be strictly controlled” — Hierarchy conflict; and ¶8: services exist in Leire but the route is unsafe, so walking not realistic.
- **6009588** — Land south of 47 Necton Road (Ashbridge House), Little Dunham (Breckland, 2026-09-15, dismissed); ¶7: “the district has a defined settlement hierarchy” — Housing outside boundaries restricted: against.
- **6009691** — Land off Shire Lane, Hurst Green (self-build PIP) (Ribble Valley, 2026-09-24, dismissed); ¶7: “directs them first to the strategic sites and Principal and Tier 1 settlements” — Site not a Principal/Tier 1 settlement: against.
- **6009718** — Vyners Estate, Mill Lane, Tidmarsh (West Berkshire, 2026-09-04, dismissed); ¶7: “The appeal site is not located within a settlement identified in the settlement hierarchy” — Unlisted; and the route failed (¶17 per green-belt.md).
- **6009844** — 17 Brook Lane, Brookville (King's Lynn and West Norfolk, 2026-09-24, dismissed); ¶8: “as within Tier 6 of the Settlement Hierarchy” — Tier 6, beyond boundary: LP02 against.
- **6009849** — Adj Grassmere, Horseman Side, Navestock (self-build dwelling in garden) (Brentwood, 2026-09-28, allowed); ¶18: “the appeal site does not fall within any of the identified settlements within the hierarchy” — Unlisted and remote lanes: conflict found; self-build allowed anyway.
- **6009990** — Land south of Park Farm, Whalley, Wiswell (Ribble Valley, 2026-09-25, dismissed); ¶5: “directs them first to the strategic sites, Principal and Tier 1 settlements” — Not a Principal/Tier 1 settlement: against.
- **6010260** — Land east of Old Shackerley Lane, Albrighton (Shropshire, 2026-09-11, dismissed); ¶22: “seek to direct development to the larger settlements of the area” — Site outside identified settlements: against.
- **6010301** — Land east of Hockerton Road, Upton (Newark and Sherwood, 2026-08-17, dismissed); ¶8: “The Council’s spatial strategy is based upon the settlement hierarchy in Spatial” — Hierarchy focuses development where services most accessible; site outside: against.
- **6010354** — Three Acres Farm, The Common, South Creake (King's Lynn and West Norfolk, 2026-09-16, dismissed); ¶9: “a rural village in Tier 5 of the Settlement Hierarchy” — Tier 5, outside boundary: LP02 against.
- **6010422** — 40 Millers Lane, Harpley (self-build dwelling) (King's Lynn and West Norfolk, 2026-09-29, dismissed); ¶10: “Harpley is defined as a tier 5 rural village under Policy LP01” — Tier 5 policy against; sustainable modes limited despite short driving distances to larger villages.
- **6010642** — Land adjacent 10 Wren Avenue, Sproston, Crewe (PIP one self-build dwelling) (Cheshire West and Chester, 2026-09-28, dismissed); ¶9: “sets out the settlement hierarchy for the district” — Not in tiers 1–3; countryside: against.
- **6010834** — Land adjacent to Arcady, Coryates (Dorset, 2026-09-18, dismissed); ¶9: “the majority of new housing is expected to be accommodated within the larger settlements” — Site not in a Defined Development Boundary: against.
- **6010911** — Beechwood House, Willoughby Road, West Willoughby (South Kesteven, 2026-09-25, dismissed); ¶12: “West Willoughby is not listed within the settlement hierarchy” — Unlisted: against.
- **6011045** — Beech Dene, Kelsick, Abbeytown (Cumberland, 2026-09-01, dismissed); ¶20: “concentrated within the towns and villages identified in the” — Outside hierarchy settlements: against.
- **6011217** — Four Winds, The Common, Melbourne (South Derbyshire, 2026-09-23, allowed); ¶9: “Whilst Melbourne is identified as a Key Service Village, the appeal site lies outside” — Key Service Village acknowledged but site outside its boundary: plan conflict found; allowed on other grounds.
- **6011227** — Land west of The Charters, Greatford Road, Uffington (Stamford) (South Kesteven, 2026-09-25, dismissed); ¶20: “Uffington is categorised as a Smaller Village which is the fourth tier of the” — Fourth-tier policy framework; dismissed.
- **6011585** — Wayside Farm, Lower Road, Hough-on-the-Hill (three dwellings, outline) (South Kesteven, 2026-09-24, dismissed); ¶22: “Hough-on-the-Hill falls within Smaller Villages” — Fourth-tier policy framework; dismissed.
- **6012304** — Land at Hillberry, Dalefords Lane, Marton, Winsford (Cheshire West and Chester, 2026-09-28, dismissed); ¶6: “the hierarchy lists a number of key service centres, which includes the nearby” — Site outside any defined settlement, near KSCs: against.
- **wychavon-W-26-01828-PIP** — Cedar Wood, Seaford Lane, Naunton Beauchamp (1 self-build dwelling PIP) (Wychavon, 2026-09-14, approved); (case file): “Naunton Beauchamp is not in the settlement hierarchy (no key services)” — Absence from hierarchy and no key services counted against sustainability; approved on extant PIP/self-build.

## E — descriptive or incidental

- **6002168** — Mytax Farm, Bourbles Lane, Preesall (sand and gravel quarry) (Lancashire County Council, 2026-08-26, dismissed); ¶36: “all of which are at the top of the Wyre Local Plan settlement hierarchy” — Quarry appeal; hierarchy described to locate the market towns; no bearing on decision.
- **6003588** — The Barn, Bull Lane, Tiptree (Colchester, 2026-08-17, allowed); ¶12: “It recognises Tiptree as a sustainable settlement” — Plan policy described (SP3 hierarchy treats Tiptree as sustainable); site in countryside; label not the operative reason.
- **6007348** — Home Farm, Main Road, Bevercotes (Bassetlaw, 2026-09-16, dismissed); ¶36: “do not share the same characteristics in terms of settlement hierarchy” — Used only to distinguish a cited appeal.
- **6008318** — Mollen Farm, Edgarley Road, Glastonbury (Class E commercial units) (Somerset, 2026-09-21, allowed); ¶7: “in the Primary Villages identified in Core Policy 1” — Rural-economy policy framework; commercial units; incidental.
- **6008437** — Chy Trygh, Towan Cross, Mount Hawke (Cornwall, 2026-09-21, allowed); ¶4: “in reasonable proximity to a larger village or town” — Policy 3 definition of a settlement; descriptive.
- **6008548** — Land at Polden View, Maunsel Road, North Newton (Somerset, 2026-09-21, allowed); ¶8: “North Newton is identified as a Tier 4 settlement in the Sedgemoor Local Plan” — Tier 4 sets which policy applies (T4 supports some housing); location decided on S5(1)(j); allowed.
- **6008723** — Land to the rear of Abbey Gardens, Southport Road, Lydiate (Sefton, 2026-09-23, dismissed); ¶13: “identified in the development plan as a Rural Service Centre rather than a town” — Used only to distinguish a cited appeal in the grey-belt analysis.
- **6008883** — 15 Brethergate, Westwoodside, North Lincolnshire DN9 2AU (North Lincolnshire Council, 30 September 2026, allowed); ¶15: “should take into account levels of local service provision” — CS1 rural-settlement criterion; site within development limit; incidental.
- **6009030** — Somerville, Mingoose Vale, Towan Cross, Truro (affordable PIP) (Cornwall, 2026-09-30, dismissed); ¶10: “within reasonable proximity to larger settlements such as Mount Hawke and St Agnes” — Settlement-definition reasoning; not a tier.
- **6009101** — Long Barn, 46 Market Square, Witney (West Oxfordshire, 2026-09-02, dismissed); ¶18: “an additional dwelling in a main service centre would accord with” — Tier accordance acknowledged; dismissed on heritage. Duplicate letter of 6009103.
- **6009103** — Long Barn, 46 Market Square, Witney (West Oxfordshire, 2026-09-02, dismissed); ¶18: “an additional dwelling in a main service centre would accord with” — Tier accordance acknowledged; dismissed on heritage.
- **6009357** — Annexe at 8 Longridge Road, Hurst Green (Ribble Valley, 2026-09-22, allowed); ¶5: “The appeal site is situated in a Tier 2 Village” — Tier sets the applicable policy test (DMG2); annexe allowed.
- **6009474** — Sussex Topiary, Naldretts Lane, Rudgwick (Horsham, 2026-09-18, dismissed); ¶11: “in accordance with the settlement hierarchy, whilst maintaining the existing” — Strategy described; decided on character.
- **6009818** — Land at Mill Road, Whitfield (West Northamptonshire, 2026-09-02, dismissed); ¶14: “Policy SS1 which relates to the settlement hierarchy” — Agricultural building; SS1 found not relevant.
- **6010166** — Nectar Haze, Bounds Cross, Pyworthy (Torridge, 2026-09-01, dismissed); ¶4: “in accordance with the settlement hierarchy, to achieve an” — Strategy described.
- **6010393** — Mulberry House, Middle Street, East Lambrook (Somerset, 2026-09-21, dismissed); ¶6: “rural settlements should include two or more key services” — SS2 two-key-services criterion met (pub, church); decided on other matters.
- **6011037** — Marton House, 31 West Street, Padiham (Burnley, 2026-09-24, dismissed); ¶16: “The proposal would deliver a new dwelling within a Key Service Centre” — Plan-accordance point acknowledged; dismissed on heritage.
- **6011301** — Land at Doctors Hill, Bournheath (Bromsgrove, 2026-09-10, allowed); ¶22: “Policy BDP2 sets out the settlement hierarchy of the plan area” — Hierarchy described; location decided on route and an on-demand bus; allowed.
- **6014952** — Higher Collybeer Farm, Spreyton (B8 storage units) (West Devon, 2026-09-23, allowed); ¶6: “the Council’s settlement hierarchy which seeks to focus new employment towards” — Employment hierarchy; storage units; incidental.
- **maidstone-26-501191-FULL** — Mobile home at Wierton Hill Farm, Boughton Monchelsea (Maidstone, 2026-08-20, refused); (case file): “1.6 km from Boughton Monchelsea (smaller village)” — Descriptive distance; refused.
- **stratford-26-00918-PIP** — Land off Butts Lane, Tanworth-in-Arden (Stratford-on-Avon, 2026-09-11, approved); (case file): “a Category 4 village washed over by the West Midlands Green Belt” — Category 4 (lowest) noted; GB7(1)(g)(iii) passed on the officer’s own route view ("villagers cope"); approved.
- **stratford-26-01376-FUL** — 30 Hadrians Walk, Alcester (Stratford-on-Avon, 2026-09-17, refused); (case file): “Site inside the BUAB of Alcester (Main Rural Centre)” — Descriptive; refused on flood risk.

## Stratford-on-Avon decisions

### In the 2026 dataset

- **stratford-25-00346-OUT** — Home Farm, Land off A423, Southam (Stratford-on-Avon, 2026-08-26, approved); (case file): “adjoins Main Rural Centre Southam; well related and of a scale Southam can accommodate” — Main Rural Centre adjacency carried S5(1)(j) well-related/scale; approved (217 homes).
- **stratford-26-00918-PIP** — Land off Butts Lane, Tanworth-in-Arden (Stratford-on-Avon, 2026-09-11, approved); (case file): “a Category 4 village washed over by the West Midlands Green Belt” — Category 4 (lowest) noted; GB7(1)(g)(iii) passed on the officer’s own route view ("villagers cope"); approved.
- **stratford-26-01376-FUL** — 30 Hadrians Walk, Alcester (Stratford-on-Avon, 2026-09-17, refused); (case file): “Site inside the BUAB of Alcester (Main Rural Centre)” — Descriptive; refused on flood risk.
- **stratford-26-01458-FUL** — The Barn, Tithe Barn Lane, Earlswood (Hockley Heath) (Stratford-on-Avon, 2026-09-03, approved); (case file): “within the BUAB of an identified local service village, I am satisfied that the proposals would be in a sustainable location” — SHORTHAND: GB7(1)(g)(iii) passed in one sentence on LSV boundary with no TR3 route analysis; approved.
- **stratford-26-01764-PIP** — Pittern Hill Riding School, Pittern Hill, Kineton (Stratford-on-Avon, 2026-08-25, approved); (case file): “Kineton is a Main Rural Centre; site outside the BUAB but within walking distance of services” — Main Rural Centre plus an asserted walking distance in a one-paragraph cross-check; approved.

### Pre-2026 (from a private note on SDC decisions on Claverdon sustainability (not published); decided under the 2023/2024 Framework, not TR3)

| Application | Site | Date | Outcome | Code | Verified quote | Influence |
|---|---|---|---|---|---|---|
| 22/01896/FUL | Claverdon Hall Farm, Lye Green | 2022-10-26 | granted (fallback) | C | an unsustainable location | Claverdon LSV status not relied on: officer found "an unsustainable location … principally reliant on the motor vehicle"; granted only on Class Q fallback. |
| 22/03139/FUL | Land S of Breach Lane, Claverdon | 2023-07-19 | granted | A | category 3 Local Service Village which has a shop, school, pubs and doctors | Tier + listed services + "suitable walking routes" used to find the site well related (rural exception). |
| 25/03084/PIP | Land off Breach Lane, Claverdon | 2026-03-11 | granted | A | the category 3 Local Service Village benefits from a shop, school, pub and doctors | Tier + services, with a PROW/pavement route, used to pass old §155(c). |
| 26/00892/PIP | Land off Station Road, Claverdon | 2026-06-12 | refused (other grounds) | A | not considered to significantly detract from the overall sustainability of the location | No footway/lighting on the site side accepted as "not uncommon in a rural context"; location passed; refused on access and landscape. |

Pattern: three of the four Claverdon decisions reasoned from “Category 3 Local Service Village with a shop, school, pub(s) and surgery” to a sustainable location; the one that did not (Claverdon Hall Farm, 22/01896/FUL) found the same village’s hinterland “an unsustainable location”. Across SDC’s 2026 decisions the clearest shorthand is Earlswood (26/01458/FUL), where GB7(1)(g)(iii) was passed in one sentence on the Local Service Village boundary with no route analysis.

## Where a tier label might have been expected but was absent

Several route-decided dismissals carry no tier label at all even though the settlement is a named service village/centre in its plan: Hatton Station 6006637, Halsall 6007428, East Grinstead 6008688, South Nutfield 6009966, Wood Street 6009645, Roche 6010442, Newborough 6010986. Inspectors there went straight to TR3 route evidence without invoking the hierarchy — consistent with the C pattern.

## Excluded — services mentioned, tier not referenced (kept for auditability)

- 6002759 — Land south of Westwood Heath Road, Burton Green (allowed): "local services" generic (infrastructure pressure); no tier.
- 6003718 — The New Inn, Main Road, Totton (allowed): generic.
- 6004809 — 1029 Oxford Road, Tilehurst, Reading (dismissed): generic.
- 6005194 — 35 Denmark Road, Poole (9 flats, outline) (dismissed): generic.
- 6005325 — 61 Brackley Square, Woodford Green (dismissed): generic.
- 6005903 — Land north of Bishops Lane, west of Willow Bank, Robertsbridge (dismissed): generic; dismissed on National Landscape.
- 6005916 — Parcel 1643 Middle Piece Lane, Burnett (solar farm) (allowed): plain description (Bath).
- 6006054 — 393 Burnley Road, Holme Chapel, Cliviger (dismissed): generic.
- 6006128 — Land at Former Ashfield Works, Westgate, Otley (allowed): generic.
- 6006224 — Land near Fanshawes, Ware Park, Ware (dismissed): "key services" is accessibility-policy wording, not a tier; decided on route.
- 6006330 — Elm Cottage, Further Ford End, Clavering (curtilage listed, LBC) (dismissed): generic.
- 6006475 — Land between Copper Lodge and The Cloth Hall, Water Lane, Smarden (dismissed): generic.
- 6006517 — Site I, The Mill, Catteshall Road, Godalming (dismissed): generic.
- 6006629 — Land opposite the Full Quart, Bristol Road (A370), Hewish, Puxton (dismissed): generic.
- 6006819 — Land South of The Street, Furneux Pelham (dismissed): generic.
- 6006985 — 39 Chalkwell Esplanade, Westcliff-on-Sea (dismissed): generic.
- 6007334 — Hillcrest, Chalton, Luton (PIP 1-9 dwellings) (dismissed): generic.
- 6007416 — Land adjacent to Red Lane, Rosudgeon (dismissed): generic.
- 6007474 — Plots 13 and 5, Leys Lane, Winterton (dismissed): generic; neutral.
- 6007477 — Plots 13 and 5, Leys Lane, Winterton (dismissed): duplicate letter of 6007474; generic.
- 6007619 — Eden Grove, 17-51 London Road, Staines-upon-Thames (s73 parking reduction) (allowed): generic.
- 6007620 — Eden Grove, 15-51 London Road, Staines-upon-Thames (parking conditions, Appeal B) (allowed): duplicate of 6007619; generic.
- 6007705 — Forge Garage, Church Road, Churchill (allowed): generic.
- 6007807 — Zoar Cottage, 15 Passage Hill, Mylor Bridge (dismissed): generic.
- 6007836 — 65A Richmond Wood Road, Bournemouth (8-person HMO) (dismissed): generic.
- 6008115 — The Barn (opposite Lansdowne House), Fordingbridge (dismissed): no tier; route decided (lane without pavements).
- 6008238 — Land North of A507, West of A10, Buntingford (allowed): condition wording.
- 6008264 — Land west of The Cottage, Snakes Lane, Ugley Green (allowed): plain description; route (buses) assessed; allowed.
- 6008314 — Land off Eastbourne Road, Polegate (Aldi foodstore and care home) (allowed): retail "service centres"; not a tier.
- 6008410 — Myrtle Mount, 14 Elm Grove, Hartlepool (dismissed): generic.
- 6008646 — 52 Hugh Road, Coventry (dismissed): generic.
- 6008688 — Land adjacent to Farm View Cottage (Frith Manor), Lingfield Road, East Grinstead (dismissed): no tier; route decided.
- 6008707 — 1 Gould Road, Feltham (dismissed): generic.
- 6008739 — Orchard View, Gallows Green Road, Great Easton (dismissed): policy wording; no tier.
- 6008791 — Land west of Old Hall, Watton Road, Colney (dismissed): generic.
- 6008840 — 10 Goodminns Estate, Sedgeford (dismissed): generic.
- 6008864 — Land adjacent to 33A Chelford Road, Somerford (PIP, Jodrell Bank WHS) (dismissed): policy wording.
- 6009076 — 74-76 Coombe Road, New Malden (dismissed): generic.
- 6009098 — White House Farm, Main Street, Ealand (dismissed): no tier (development limit).
- 6009127 — 286 Great North Road, Woodlands, Doncaster (dismissed): generic.
- 6009167 — 27 Gloucester Road North, Filton (7 C4 HMOs above retained Class E unit) (allowed): generic.
- 6009193 — 44 South Street, Romford (dismissed): road description.
- 6009207 — 46 The Beck, Elford, Tamworth (new dwelling in side garden) (dismissed): generic.
- 6009303 — Land adjacent to 50 Middleton Way, Fen Drayton (dismissed): generic; location decided on route/(j).
- 6009407 — Two Oaks, Whitchurch Road (A49), Spurstow (dismissed): plain; route (no footway, A49) decided.
- 6009442 — 36 St Kildas Road, Harrow (allowed): generic.
- 6009486 — Homestead, Liverpool Road, Tarleton (allowed): care home; services capacity.
- 6009545 — Land at 38 Ackerman Street, Eaton Socon, St Neots (dismissed): generic.
- 6009593 — Land east of Spring Gardens, Washington (allowed): generic.
- 6009645 — Grandview House, 94 Broad Street, Wood Street (Guildford) (dismissed): no tier; route assessed.
- 6009737 — 12 Hyde Park Terrace, Leeds (9-bed HMO to 6 flats) (dismissed): generic.
- 6009739 — Priors Court Farm, Rudge Lane, Beckington (allowed): generic.
- 6009966 — Chedworth, Coopers Hill Road, South Nutfield (dismissed): no tier; route decided.
- 6009985 — Plot 1, F I M Renewable Energy Farm, Mill Lane, Kirtlington (dismissed): no tier; car-dependence on route.
- 6010090 — Idson Farm, Idson Lane, Stogursey (dismissed): generic.
- 6010097 — Pound Scots, Chinnor Road, Bledlow Ridge (self-build dwelling in listed building's garden) (dismissed): generic.
- 6010238 — 225 Faversham Road, Kennington, Ashford (dismissed): generic.
- 6010253 — Land adjacent Langley Cricket Club, Cock Hall Lane, Langley, Macclesfield (PIP one dwelling) (dismissed): policy wording.
- 6010397 — 41a Liverpool Road, Birkdale, Southport (allowed): generic.
- 6010430 — Regency House, 65 New Bridge Street, Leicester (dismissed): generic.
- 6010440 — Land South West Of Chalets Percy Wood Golf Club And Country Retreat, Coast (allowed): generic (holiday chalets).
- 6010442 — Land west of Pits Mingle Bungalow, Tregoss Moor, Roche (dismissed): no tier; route (A391 roundabout) decided.
- 6010471 — Land south of Coppice Road, Higher Poynton (allowed): services capacity.
- 6010739 — St Barnabas Church, St Barnabas Close, Hereford (church to 52-bed care home) (allowed): generic.
- 6010836 — 19 St Michaels Road, Newquay (dismissed): generic.
- 6010851 — 12 Belfairs Drive, Chadwell Heath (allowed): generic.
- 6010861 — 59 Luncies Road, Basildon (allowed): generic.
- 6010934 — Land off Pickworth Road, Great Casterton (HO11(e) earth-sheltered house) (dismissed): plain.
- 6010946 — 38 Highfield Road, Nottingham (dismissed): generic.
- 6010986 — Hillcott, Duffield Lane, Newborough (dismissed): no tier; route decided.
- 6011079 — Moonshine Meadow, Cuckfield Road, Ansty (dismissed): generic.
- 6011235 — 132 Cock Bank, Turves (barn to self-build bungalow) (dismissed): generic.
- 6011253 — Land adjacent 8 Bedford Road, Cople (allowed): generic.
- 6011431 — Land adjacent to Waterloo Court Health and Wellbeing Hub, Waterloo Cross, Uffculme (dismissed): plain.
- 6011694 — Honeysuckle Bottom Sawmill, East Horsley (allowed): no tier; location found unsuitable; allowed on fallback.
- 6011872 — Land adjacent to 16 Mill Road, Fen Drayton (dismissed): generic.
- 6012151 — Outside 118 Mile End Road, Tower Hamlets (BT Street Hub replacing InLink) (allowed): street hub; duplicate of 6012153.
- 6012153 — Outside 118 Mile End Road, Tower Hamlets (BT Street Hub replacing InLink) (allowed): street hub.
- 6012437 — 131-133 St Helens Street, Ipswich (allowed): generic.
- 6012481 — Well Hill Nursery, Fountain Farm, Firmingers Road, Orpington (dismissed): generic.

## Verification

174 quotations checked against source files (170 register rows + 4 pre-2026 SDC rows); **174 matched**, 0 unverified. Duplicate letters in the corpus (6007474/6007477, 6009101/6009103, 6012151/6012153, 6007619/6007620) are kept as separate rows and flagged in the influence column.

## Recoded 1 Oct 2026

- **6010848** — Land off Cheddington Road, Pitstone (Buckinghamshire, 2026-09-18, dismissed); ¶17: “Pitstone is identified as a larger village within the settlement hierarchy and is” — Tier recited as "a relatively sustainable location" (¶17), then a route analysis at ¶20 (footways, street lighting, gentle topography, regular buses) found accordance with TR3 (¶21); dismissed on other grounds (unexecuted SAC obligation). (shorthand code → route-evidence code; A → B in the reworked letters) Route: “The surrounding area also benefits from extensive footway provision, street lighting and relatively gentle topography, making active travel a realistic option for future occupiers.” (¶20).

## Search gaps

The regex did not match "principal settlement", "main settlement", "market town", a plan-defined "Rural Settlement" (6009632), "identified in the development plan as a village" (6007484 Tarleton, allowed under GB7(1)(g)(iii) on the deleted 2024 rural-allowance sentence quoted as current) or a bare "Tier 4". A spot check of allowed letters found no further code A case, but the register should be read as "every decision matching the search", not every tier reference.
