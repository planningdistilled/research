# Harvest log: national-lpas (council committee decisions outside the Midlands, 17 Aug to 23 Sep 2026)

Agent: national-lpas. Run: 23 Sep 2026. Result: **22 case files written, 0 enriched.** All are committee decisions with the officer report read and outcomes confirmed from minutes or decision lists.

## Method that worked

1. **Bulk scan of modern.gov.** For each council base URL I fetched `mgCalendarMonthView.aspx?M=8|9&Y=2026&GL=1`, kept meetings dated 17 Aug to 23 Sep whose titles matched planning, development or applications, then scraped each `ieListDocuments.aspx` page for `documents/sNNN/*.pdf` and `documents/gNNN/*.pdf?T=n` links (printed minutes, decisions, reports packs, supplementary agendas). I downloaded everything and ran pdftotext, then grepped for `GB7|GB6|GB8|S5\(|grey belt|S4\(`. This surfaces NPPF-2026-heavy reports in minutes. Scripts are in the scratchpad (`mgscan.py`, `mgdocs.py`, `dl.py`) and are easy to re-run for October.
2. **Printed minutes (g-docs) are the key to outcomes.** The `?T=1` suffix defeated my first regex, so fetch g-docs separately. Several councils publish Sept minutes within days: Basildon, Maldon, Chorley, North Herts, Test Valley, TMBC, Rotherham, Gateshead, Dorset, BCP, Cornwall, East Devon, Cheshire East, Dacorum, BathNES, Sefton, Elmbridge, Three Rivers. Kirklees and North Herts publish "Decisions" sheets.
3. Web search was nearly useless for committee decisions. It surfaced only the LGA/Commons Library briefings and one mention of the Sevenoaks Broke Hill report.

## Council coverage

Scanned OK (planning meetings in window): Guildford, Elmbridge, Runnymede, Three Rivers, Dacorum, Welwyn Hatfield (local plan panel only), East Herts, Thurrock, Cheshire East, Trafford, Bury, Leeds, Sheffield, Gedling, BathNES, Basingstoke, Tunbridge Wells, Sefton, Kirklees, Rushcliffe, Sevenoaks (cds.sevenoaks.gov.uk), Waverley (modgov.), Epping (rds.), Brentwood (brentwood.moderngov.co.uk), Basildon (basildonmeetings.info), Wigan, Broxtowe, Test Valley, Wirral, Woking, Winchester, Maidstone, TMBC, Gravesham, Medway, North Herts, Stevenage, Rotherham, Rochdale, Oldham, West Lancs, Chorley, Blackburn, York, Gateshead, North Tyneside, Durham, Bristol, Dorset, BCP, East Devon, Cornwall, Cambridge, Dover, Cheltenham, Ipswich, Maldon.

**Blocked (403 Cloudflare on *.moderngov.co.uk):** Tandridge, St Albans, Buckinghamshire, Mid Sussex, Uttlesford, Bradford, Calderdale, Horsham, Hertsmere, RBWM, Reigate & Banstead, Babergh/Mid Suffolk, Sevenoaks (the moderngov.co.uk mirror; cds. works). WebFetch was not tried on these; that is worth a follow-up pass.
**No host found / timeouts:** Mole Valley, Epsom & Ewell, Stockport, Broxbourne, Castle Point, Bolton, North Yorkshire, South Glos, Cheshire West, Hart, Wokingham, Bracknell, Dartford, Rochford, Chelmsford, Braintree, Colchester, Harlow, Watford, Luton, Central Beds, Wakefield, Barnsley, Doncaster, Salford, Tameside, Warrington, Halton, Knowsley, St Helens, South Ribble, Preston, Fylde, Sunderland, Northumberland, N Somerset, Wiltshire, Huntingdonshire, East Cambs, Bedford, MK, S Cambs, Norfolk districts, Ashford, Canterbury, Folkestone, Thanet, Tewkesbury, Stroud, East Suffolk, Tendring. Most use Idox/other CMS or a different modern.gov hostname.

## Cases written (22)

Green Belt: threerivers-25-2168-OUT (overturned), threerivers-26-0520-FUL, dacorum-25-01880-MOA (appeal-stance vote), sefton-DC-2026-00141, bathnes-25-04952-EOUT, bathnes-26-00259-FUL, cheshireeast-25-2053-FUL, elmbridge-2025-1444, tmbc-25-01976-PA, basildon-25-00575-OUT (overturned), basildon-25-01188-OUT (overturned), basildon-25-01190-OUT (overturned), basildon-24-01047-OUT, chorley-25-01052-FULMAJ (overturned).
Non-Green Belt S5/S4: cheshireeast-26-0640-FUL, maldon-26-00066-OUTM, maldon-26-00018-FULM, eastdevon-26-0534-MOUT, northherts-25-02064-OP, maidstone-26-501191-FULL (overturned), bathnes-25-04961-FUL (overturned, S4), bathnes-25-03592-FUL (S4/L3/Connectivity Tool).

## LEADS NOT FOLLOWED (priority order)

Committee decisions made but not yet distilled:
- **Basildon 24/00294/OUT**, Land rear of 311 Pound Lane, Bowers Gifford, 30 homes, 50% affordable. Officers found grey belt and a sustainable location within Plotlands H19. On 9 Sep members were minded to refuse (4-3) but deferred for Neighbourhood Development Order information. Final decision is pending. Report: basildonmeetings.info/documents/s159221.
- **Basildon 25/01451/OUT** (420 homes, Laindon Road, Billericay) and **25/00917/OUT** (325 homes, Barn Hall, Wickford). Minded to refuse on 29 Jul; refusal wording citing GB6/GB7/GB8 of the 2026 NPPF adopted 19 Aug. Reports s158858 and s158860.
- **Cheshire East 25/4333/OUT**, Church Lawton, 48 homes, grey belt per officers (Kidsgrove gap). DEFERRED on 9 Sep for access levels. Report s136033.
- **Cheshire East Strategic Planning Board 16 Sep**: 25/1573/FUL and 25/2071/FUL (residential). Minutes not out. Reports s136261 and s136263.
- **Dorset Western & Southern 10 Sep**: an application granted CONTRARY to the officer's refusal recommendation because economic and community benefits outweighed harm to a conservation area and listed building (HE6 balance). Minutes g6518. The application ref still needs extracting.
- **Tunbridge Wells 25/00826/FULL**, Hawkhurst Station Business Park (High Weald NL, E2). Deferred 19 Aug after members were told that refusal reasons based on the NPPF 2024 were unsound. TW 16 Sep: 26/00094/FULL Spratsbrook, minutes not out.
- **Test Valley 26/01458/PIPN** (NAPC 17 Sep) and **26/01409/FULLN**. Minutes not out.
- **Maldon**: 25/00421/FULM Rosedale, Great Braxted (9 Sep); 25/00607/OUTM Seagers, Great Totham and 26/00138/OUTM Latchingdon (special DPC 22 Sep); 26/00372/FUL Walnut Tree Cottage (23 Sep). All S5(1)(j) candidates with no minutes yet.
- **Woking 26/0300** Three Js Nursery (15 Sep extraordinary). GB content, minutes not out.
- **Dorset PPIP/2026/03481**, Honeybun Meadow, Hazelbury Bryan (22 Sep).
- **Cornwall**: PA26-04139 Parc Garland, The Lizard; PA26-04461 Ludgvan; PA25-09090 Dobwalls (Strategic 20 Aug). Minutes are out and contain refusals (grep "refus"), so these are worth distilling for S5.
- **Oldham 23 Sep**: FUL-355686-26 Land off Failsworth Road, GB references (meeting tonight).
- **Winchester 25/01050/FUL**, Glebe Farm Solar (23 Sep).
- **Runnymede RU26/0430**, Woburn Arms (23 Sep, tonight).
- **Sevenoaks**: Former Broke Hill Golf Club, Halstead, 660 homes (DMC 24 Sep, per web search). Also DMC 3 Sep; not inspected.
- **Sefton DC/2024/02165**, Land North of Formby Industrial Estate. Refused 16 Sep against the officer recommendation on traffic safety, public transport and town-centre impact (TR3/TC4). Allocated employment site. Report s138339. Worth a case.
- **Kirklees 2026/90840** HMO, refused against the officer recommendation 10 Sep. Low NPPF interest.
- **Elmbridge SAPS 9 Sep**: 2025/0554 and 2025/0748 (GB references). Minutes not out.
- **Leeds Strategic Planning Panel 1 Sep**: officer paper on the new NPPF, useful for local reading of S5 and villages (s284827). Also Blackburn (s35262), Gateshead (s50232) and Tunbridge Wells (s84875) NPPF briefing papers.

Appeal refs seen (for the appeals agents):
- **6005664**, Spratts Farm (Maldon), decided 18 Aug 2026; supply disputed at 3.6 vs 4.04 years.
- **6014396**, Chorley non-determination appeal (Moor Road, Croston), written reps.
- **APP/H2265/W/24/3347410**, Wrotham Water Farm (pre-2026). Source of "London is the large built-up area" for TMBC.
- **APP/P1940/W/25/3370028**, Little Green Farm, Chorleywood (pre-2026, curtilage PDL).
- Three Rivers **Croxley Green** (6004972) inquiry, and Dacorum **Land East of Tring** inquiry from 10 Nov 2026.
- Tonbridge & Malling: land east of Kiln Barn Road / west of Hermitage Lane, Aylesford, **called in by SoS** (reported 19 Aug).
- East Devon: BESS Hazelhurst, Raymonds Hill appeal dismissed (fire safety). Date not stated.

## OBSERVED PATTERNS

1. **Members are overturning Green Belt approvals at grey belt limb (i), not limb (iii).** In the overturns — threerivers-25-2168-OUT, basildon-25-00575-OUT, basildon-25-01188-OUT, basildon-25-01190-OUT — members re-graded purpose (a) from moderate to strong, or held the land not grey belt. That pushes schemes into VSC, where member discretion is widest, even at supplies of 1.2 to 2.05 years with 50% affordable housing. Refusals rest on openness and purposes, not location.
2. **Officers read limb (iii) generously where footways exist.** Passes include a 900 m walk to a bus stop with a town centre 2.1 km away (basildon-25-00575-OUT); a 25-minute walk to town (bathnes-25-04952-EOUT); a town centre 2 km away with a local parade near (tmbc-25-01976-PA); and village services and a station within 500 m on lit 20 mph footways (chorley-25-01052-FULMAJ). No committee report found a site failing limb (iii). The rural-lane fails are all appeal decisions.
3. **The Connectivity Tool is starting to appear**, as a supporting number rather than a test. Scores and bands cited: 80–82 "very high" (bathnes-25-03592-FUL); 59–62% "below average" but accepted (cheshireeast-25-2053-FUL); LA Band B (cheshireeast-26-0640-FUL); DfT rating B "well connected" (bathnes-25-04952-EOUT). Maldon members asked for the score and were told sustainability was "established through appeals" (maldon-26-00066-OUTM).
4. **Strategic Green Belt studies are being disaggregated.** Officers assess "at site level" against parcels rated strong or significant (bathnes-25-04952-EOUT, cheshireeast-25-2053-FUL, basildon-25-01188-OUT). When a site is most of the parcel, the parcel rating sticks.
5. **"Large built-up area" is doing heavy lifting.** Villages never count (chorley-25-01052-FULMAJ, bathnes-26-00259-FUL). TMBC treats London as the relevant large built-up area for outer Metropolitan Green Belt sites (tmbc-25-01976-PA), which removes purpose (a) at town edges.
6. **Golden Rules as a trap for small majors and C2.** An 11-home market scheme fails GB8 and then VSC (basildon-24-01047-OUT). A care home fails GB8 but wins on VSC, with grey belt status counted as a VSC factor (cheshireeast-25-2053-FUL).
7. **S5(1)(j) is working as intended outside the Green Belt.** Any shortfall, even 4.1 years, engages it (maldon-26-00066-OUTM, maldon-26-00018-FULM). "Physically well-related" is read as adjoining built development without a gap (cheshireeast-26-0640-FUL, northherts-25-02064-OP, eastdevon-26-0534-MOUT). Open countryside loss is called an "inevitable consequence" of the shortfall.
8. **Neighbourhood plans older than five years give no S6 shield.** They are weighed as ordinary conflicts (eastdevon-26-0534-MOUT; northherts-25-02064-OP, where S6 is not even discussed).
9. **HC4 and E2 "substantial weight" uplifts are being used.** Schools, community and recreation benefits moved from limited to substantial weight (dacorum-25-01880-MOA). Elmbridge still gave community sport only "significant" weight (elmbridge-2025-1444). E2 gives substantial weight to business investment (threerivers-26-0520-FUL).
10. **GB7(1)(h) station route: early readings are contested.** Three Rivers officers stretched "around 800m" to 1,100 m and members rejected it (threerivers-25-2168-OUT). Dacorum applied it only to the part of the site within 800 m and flagged that L3's 45 dph minimum then applies, with L3(4) "should be refused" able to defeat the S5(5) presumption (dacorum-25-01880-MOA).
11. **Transition handling is formulaic.** Most councils tabled one-page addenda saying the new NPPF "does not materially alter" recommendations (Basildon, Three Rivers, Cheshire East, TMBC, Chorley). TMBC endorsed an applicant-drafted comparison table that misapplied S5 to a Green Belt site (tmbc-25-01976-PA). North Herts mapped the old paragraphs 110/115 to TR6 only, dropping TR3 (northherts-25-02064-OP).
12. **The 2026 Consultation Direction is shaping resolutions.** BathNES uses "delegate to refuse, subject to SoS referral" when members overturn approvals on majors (bathnes-25-04961-FUL), and officers flag the referral before votes (bathnes-25-04952-EOUT).
13. **Highway-safety refusals are being headed off.** Counsel and officers repeatedly told members that only "severe" impacts justify refusal under TR6 (basildon-25-00575-OUT, threerivers-26-0520-FUL). Members moved to Green Belt or spatial-strategy reasons instead (chorley-25-01052-FULMAJ, where the spatial-strategy-only reason is weak once GB7 is met).

## Biggest gaps

- Surrey, Hertfordshire and Kent councils on *.moderngov.co.uk (Tandridge, St Albans, Reigate, Mid Sussex, Horsham, Hertsmere, Bucks, RBWM) are Cloudflare-blocked to curl. Try WebFetch or the councils' Idox "decided" lists.
- Many September meetings have no minutes yet. Re-run the scan in a week to pick up outcomes for the leads above.
- Yorkshire and Greater Manchester Green Belt authorities (Stockport, Bolton, Calderdale, Bradford, Wakefield, Leeds plans panels) were not reached.
