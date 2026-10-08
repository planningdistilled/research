# Stratford-on-Avon: undecided housing applications and the errors the reports are likely to repeat

Note of 8 October 2026. It takes every housing application still open on the Stratford-on-Avon District Council (SDC) register and asks which of them are likely to attract the same departures from the August 2026 National Planning Policy Framework (NPPF) that the Stratford note (`pages/authority/stratford-dc/nppf-decisions/build/note.md`) found in decisions made between 17 August and 2 October 2026. Not legal advice.

The list is `stratford-pending-watchlist.tsv` beside this file: 133 live housing applications, pulled from `https://apps.stratford.gov.uk/EplanningV2/API/` on 8 October 2026 with the same filters as `tools/stratford_supply.py`, less the ten that are at appeal or are not homes (traveller pitches, care homes). Each row carries the register status, the parish, the village and its Core Strategy tier (CS.15 ¶5.1.10), whether the site is in the West Midlands Green Belt (Core Strategy ¶4.1.3: everything north of Stratford-upon-Avon, the A46 and the A439, with Alcester, Henley-in-Arden and Studley inset), whether the village is washed over, the home count read from the description, and the dates.

## The six errors, in one line each

1. **DP3(3) never applied.** A design conflict is weighed, not treated as a "should be refused" trigger.
2. **Heritage harm folded into the S4 balance** instead of being weighed on its own terms under HE6(3) and (4).
3. **CS.8 discounted** as "materially inconsistent" without saying which part conflicts.
4. **S4 and S5(1)(j) applied in washed-over villages** that Annex B excludes from "settlement", and a built-up area boundary (BUAB) used as the GB7(1)(g)(iii) test.
5. **Location decided by village tier**, not by the route: TR3(1)(a) treated as not engaged for small schemes, TR3(1)(b) read as a locational test, no Connectivity Tool, carriageway walking accepted.
6. **2024-Framework reasoning carried into 2026 decisions**, and the whole of CS.15, CS.16 and AS.10 given "very limited weight" because of the supply shortfall.

## A. Reports already written, decision not yet issued

These eight are the certain cases. The report exists, so the reasoning can be read now; the decision notice has not been issued, so the clock for any challenge has not started. Every report-stage document here was downloaded from the register on 8 October 2026 and is filed in the private sources repo (`sources:council/…`, text in `sources:stratford-dc/public-note/…`).

| Application | Place and scale | Stage | What the report does |
| --- | --- | --- | --- |
| 26/00410/FUL | Ravenstone, Well Lane, Tanworth-in-Arden: 3 houses replacing 1, washed-over Category 4 village, Green Belt | Committee 7 Oct 2026: **granted**; notice not yet issued (register 8 Oct: "Pending Decision", decision "Permission with Conditions") | Errors 4, 5 and 6 together. Runs S4 for the two plots inside the BUAB and S5(1)(j) for the third (report pp.8–9) in a village Annex B excludes. Gives CS.15, CS.16 and AS.10 "very limited weight" because of the 2.21-year supply (p.10). Passes GB7(1)(g)(iii) on the footing that "the development would not generate a significant amount of movement" so TR3(1)(a) falls away, accepts walking in the Well Lane carriageway as "a clearly established pattern", and counts the bus stop under "TR3(b)" (pp.13–14). The Update Sheet replaced the bus with "the existing train service", Wood End and Danzey Green stations "approximately 1 mile" away, still "in respect of TR3(b)", and did not test either as a "well-connected station" under GB7(1)(h). The conclusion calls the village "a Category 4 Local Service Village and therefore a sustainable location" (p.26). The objection raising GB7(1)(g)(iii) and TR3 was summarised in one line. |
| 25/02712/OUT | Land north of Mill Street, Harbury: up to 38 homes, Category 1 village, outside the Green Belt, site mostly outside the BUAB | Committee 7 Oct 2026: **grant subject to s106** | Errors 5 and 6; the S5(1)(j) route is the right one here, but the location is decided by tier and a list of facilities. "This village is defined as a Category 1 Local Service Village … the highest in the hierarchy of LSVs in matters of sustainability" (p.12); bus stops 310–320 m away; the 665 bus runs "every 2 hours" (p.27). No Connectivity Tool. Residents' "Poor connectivity and public transport concerns" are recorded (p.4) but the route is never assessed. The same template paragraph as Ravenstone gives CS.15, CS.16 and AS.10 "very limited weight" (p.10), and the conclusion repeats it: "As these policies are not consistent with the NPPF, I afford this conflict very limited weight" (p.35). DP3 is not mentioned. |
| 25/00346/OUT and 25/00347/FUL | Home Farm, off the A423, Southam: up to 217 homes and the crossing to serve them, Main Rural Centre edge, outside the Green Belt | Outline: committee 26 Aug 2026, **grant subject to s106**. Crossing: deferred 26 Aug, back on 23 Sep 2026; register shows both "Pending Decision" | Error 6 in its clearest form. The 26 August outline report is a 2024-Framework report: it lists "National Planning Policy Framework 2024, updated 2025" (p.2) and runs the paragraph 11(d) tilted balance (pp.11, 32). A two-page Update Sheet note converts it: "Previous NPPF 2024 paragraph 11(d) has now been superseded and does not apply", S4 and S5 apply, and "Officers have reviewed the revised NPPF and are satisfied that it does not affect the substantive matters of the application". The 23 September report for the crossing is a 2026 report using the same template: CS.15, CS.16 and AS.10 "very limited weight" (p.13), Southam "one of the largest and most sustainable settlements in the District (as a MRC)" so "a sustainable location" (p.31), no TR3, no Connectivity Tool. |
| 25/01649/FUL | Land at Alcester Road, Stratford-upon-Avon: 65 affordable homes | Committee 29 Jul 2026, **grant subject to s106**; still "Pending Decision" | A 2024-Framework report: "The lack of a 5-year housing land supply triggers NPPF paragraph 11(d)" (p.32) and the "most important policies … out of date" test. No 2026 note anywhere on the file. The notice, when issued, will be a 2026-Framework decision on reasoning the 2026 Framework replaced. The outcome may well be the same; the route has never been stated. |
| 24/01820/FUL | Kingston Fields Farm, Lighthorne Heath: 35 homes | Committee 5 Feb 2025, resolved to grant; awaiting s106 | Same position as Alcester Road, with a report twenty months old. |
| 25/00831/FUL | Southam police station: 21 supported-housing units | Committee 19 Nov 2025, resolved to grant; awaiting s106 | Same. |
| 25/00787/FUL | Ladbroke Road, Bishops Itchington: 6 houses | Committee 25 Mar 2026, resolved to grant; awaiting s106 | Same. |

Two things follow. First, the "very limited weight" paragraph is a template: the same wording appears in the Ravenstone, Harbury and Home Farm reports, written by three different case officers, so every report built on the template will carry error 6 until the template changes. Second, the four pre-2026 resolutions will become 2026-Framework decisions when the s106 is signed, unless officers re-report them; the Home Farm Update Sheet shows the Council knows how to do that in two pages and chose not to for the others.

The 7 October Update Sheet also records that the supply figure in future reports is 2.43 years (base date 31 March 2026, published 30 September 2026), "with no material effect on the planning balance".

## B. Green Belt, washed-over villages: errors 4 and 5 are near certain

Every one of these is in a village that Annex B excludes from "settlement" (Tanworth-in-Arden, Earlswood, Wood End, Claverdon, Snitterfield, Wootton Wawen, Bearley, Wilmcote, Mappleborough Green, Aston Cantlow, Great Alne, Lapworth, Norton Lindsey). On the pattern of Tanworth 26/00918, Tithe Barn Lane 26/01458, Malthouse Lane 26/01542 and now Ravenstone, the report will run S4 or S5(1)(j) first, pass GB7(1)(g)(iii) on the BUAB or the village's tier, and treat TR3(1)(a) as not engaged. Ordered by scale; target dates are the register's revised target where one is set.

| Application | Place | Homes | Target | Why it matters |
| --- | --- | --- | --- | --- |
| 24/02382/FUL | Land adjacent to 141 Earlswood Common, Earlswood | 11 (local affordable housing needs scheme) | 17 Jul 2026, overdue | Largest washed-over village scheme. An exception site still has to pass GB7 and TR3; Earlswood is the village with the Ardencroft/Malthouse Lane contradiction. |
| 26/01831/FUL | Greenfingers, Kington Lane, Claverdon | 10 | 23 Oct 2026 | Already taken through the Framework step by step on the Kington Lane Decision Route page; compare the report with it when it appears. |
| 26/01097/PIP | Land at School Lane, Bearley | up to 9 | 6 Jul 2026, overdue | Sister site Oaktree Close (26/01098/PIP) was refused and is at appeal; whichever way School Lane goes, consistency with that refusal is the test. |
| 26/01748/PIP | Holly Tree Cottage, Snitterfield Road, Bearley | up to 9 | 2 Oct 2026, overdue | Third Bearley PIP for nine homes. |
| 26/00583/PIP | Field Farm, Pennyford Lane, Wootton Wawen | 1 to 9 | 4 May 2026, overdue | Open land off a lane outside the BUAB. |
| 26/01120/FUL | Scrap yard, Birmingham Road, Bearley | 8 | 12 Oct 2026 | Previously developed land, so GB7(1)(f) or (g); the (g)(iii) route question is the same. |
| 26/01394/PIP | Park Farm, Aspley Heath Lane, Tanworth-in-Arden | up to 6 (5 net) | 2 Nov 2026 | Tanworth again, outside the BUAB. |
| 26/01470/FUL | Land north of Station Road, Claverdon | 5 | 19 Oct 2026 | The Station Road on Foot and Station Road Decision Route pages already set out the route evidence the report should engage with. |
| 26/01717/FUL | The Paddock, Poolhead Lane, Tanworth-in-Arden | 3 (replacing a 3-pitch traveller site) | 3 Sep 2026, overdue | Fallback-use reasoning likely, as at Ravenstone. |
| 26/01686/PIP | Broadmead Barns, Forshaw Heath Road, Earlswood | up to 2 | 6 Nov 2026 | |
| 26/02031/FUL | Bayberry Meadows, Small Lane, Earlswood | subdivision, +1 | 20 Oct 2026 | Inside the BUAB: the Malthouse Lane pattern (L2(1)(d), S4) is the risk. |
| 26/02325/PIP | Elmhurst Farm, Wawensmere Road, Wootton Wawen | 2 | 16 Oct 2026 | |
| 26/00404/FUL | Former telephone exchange, Vicarage Hill, Tanworth-in-Arden | 1 | 14 Aug 2026, overdue | Village centre, inside the BUAB: S4 will be applied unless Annex B is read. |
| 26/02116/FUL | Whitegates, 60 Earlswood Common, Earlswood | replacement | 19 Oct 2026 | GB7(1)(d) case; location should not arise, but the BUAB reasoning may. |
| 25/03083/PIP | Land off Forshaw Heath Lane, Earlswood | 1 | 9 Mar 2026, overdue | |
| 26/01980/PIP | Ladbrook Hall, West Penn Lane, Tanworth-in-Arden | 1 | 6 Oct 2026, overdue | |
| 26/02296/FUL | Haye House, Haye Lane, Mappleborough Green | 1 (outbuilding conversion) | 9 Nov 2026 | |
| 26/01178/FUL | Lark Rise, Station Road, Wilmcote | 1 (retrospective) | 29 Oct 2026 | |

## C. Green Belt, outside any village boundary: the GB7(1)(g)(iii) route test

Here S4 cannot arise and S5(1)(j) should not, so the risk is narrower: limb (iii) passed on proximity to a town or on tier, and TR3 run without the Connectivity Tool. For the two large schemes TR3(1)(a) is plainly engaged, so "not a significant amount of movement" is not available.

| Application | Place | Homes | Target | Note |
| --- | --- | --- | --- | --- |
| 26/02084/OUT | Land to the south of Henley-in-Arden | up to 265 | 18 Nov 2026 | Largest Green Belt application in the district. Grey belt and the GB8 golden rules, plus a full TR3(1)(a) assessment; Henley's station is the obvious "well-connected station" question under GB7(1)(h). |
| 26/01623/FUL | Land on the south-west side of Node Hill, Studley | 106 | 25 Sep 2026, overdue | Studley is inset; the site is outside it, in Sambourne parish. |
| 26/02415/PIP | Poplar Industrial Estate, Redditch Road, Studley | up to 9 | 27 Oct 2026 | |
| 26/00616/PIP | Land off Watery Lane, Ullenhall | up to 9 | 6 Apr 2026, overdue | Ullenhall has no BUAB; an isolated-homes question (S5(3) does not apply in the Green Belt, so HO11 through GB7). |
| 26/01305/FUL and 26/01303/FUL | Warings Green Farm, Hockley Heath | 8 new, plus 3 barn conversions | 30 Oct 2026 | Listed barns, so HE6 as well (error 2). |
| 26/02356/PIP | Arden Hill Farm, Birmingham Road, Pathlow | 5 | 20 Oct 2026 | |
| 26/00890/OUT | Land at Brickyard Lane, Studley | up to 4 | 30 Sep 2026, overdue | |
| 26/01776/OUT | Land at Gorcott Hill, Beoley | 2 | 11 Sep 2026, overdue | |
| 26/01505/FUL | Land adjacent to The Why Not, The Ridgeway, Astwood Bank | 2 | 14 Oct 2026 | A nine-home appeal nearby was refused and a five-home PIP followed; see the Astwood Bank case files. |

## D. Outside the Green Belt: village tier as the location test, and the template weight paragraph

Here S5(1)(j) is the right route, so the risks are errors 5 and 6: location found from the village's tier and a facilities list (Harbury, Pillerton Priors 26/01894, Ladbroke 26/01660), TR3(1)(a) dodged for small schemes, no Connectivity Tool, and CS.15, CS.16 and AS.10 given "very limited weight" wholesale rather than part by part under Annex A(2).

**Large outline schemes at Category 1 villages and Main Rural Centres.** TR3(1)(a) is engaged on any view, so the question is whether the report assesses the route and uses the Connectivity Tool, and whether it applies DP3(3) where a design conflict is found. Combined, these add up to about 3,400 homes outside Long Marston Airfield.

| Village (tier) | Applications | Homes |
| --- | --- | --- |
| Bishops Itchington (Cat 1) | 25/02821/OUT, 26/01122/OUT, 25/02974/OUT, 25/00829/OUT | 230, 200, 150, 83 |
| Harbury (Cat 1) | 25/02812/OUT, 26/01624/OUT (and 25/02712 above) | 150, 145 |
| Long Itchington (Cat 1) | 26/01398/OUT, 26/00557/OUT, 26/01718/OUT | 100, 86, 80 |
| Shipston-on-Stour (MRC) | 25/01863/OUT, 25/03144/OUT, 25/01521/OUT, 25/01810/OUT, 25/01843/OUT, 24/00303/OUT | 120, 110, 102, 100, 90, 34 |
| Wellesbourne (MRC) | 26/00792/OUT, 25/02935/OUT, 25/02377/OUT, 25/03158/OUT | 270, 100, 67, 40 |
| Bidford-on-Avon (MRC) | 25/00415/OUT, 25/03157/OUT | 110, 90 |
| Stockton (Cat 2) | 25/00823/OUT | 75 |
| Kineton (MRC) | 25/02665/OUT | 50 |
| Welford-on-Avon (Cat 2) | 25/02145/OUT | 39 |
| Tysoe (Cat 2) | 25/00737/FUL | 31 |
| Hampton Lucy (Cat 4) | 26/01372/OUT, 26/02046/OUT | 32, 30 |
| Moreton Morrell (Cat 4) | 26/01909/OUT | 23 |
| Gaydon (Cat 4) | 26/00149/OUT | 21 |

Hampton Lucy is the one to watch among these: a Category 4 village with two outline schemes of 30-odd homes each, the kind of place where "Category 4 … therefore a sustainable location" has already been written (Pillerton Priors, Tanworth).

**Small schemes at lower-tier villages**, where the Ravenstone and Pillerton Priors reasoning (tier plus "not a significant amount of movement") is most likely: 26/01642/FUL Kineton Road, Pillerton Priors (9; same village as the refused 26/01894/PIP, so the report has to explain any different answer); 26/02137/PIP Alderminster (up to 9); 26/00446/PIP Goose Lane, Lower Quinton (up to 9); 26/00802/FUL former school, Butlers Marston (9; no tier); 26/00449/FUL Hogwood Farm, Oxhill (10, pig farm redevelopment); 26/01956/OUT Oak View, Oxhill (4); 26/00359/OUT Hornton Masonry, Edgehill (up to 15; no tier); 26/00800/FUL Lawyers Field, Upper Quinton (4); 25/02906/FUL Fosse Close, Tredington (4); 25/02798/FUL Rookery Lane, Ettington (4); 26/00416/FUL Kingston Holt Farm, Lighthorne (3); 26/01039/FUL Blundells Croft, Welford-on-Avon (3); 26/01674/PIP Elm Leys, Welford-on-Avon (2); 26/01529/PIP Little Compton (2).

**Heritage conversions** where errors 2 and 3 (HE6 and CS.8) are the risk: 23/01948/FUL The Grange, Southam (grade II listed, 11 flats); 25/02540/FUL Our Lady's Convent, Southam (6); 26/01367/FUL Wellesbourne Hall coach house; 25/00320/FUL Leasowe Farm, Whichford (3); 26/02038/FUL Magpie House, Honington; 26/02155/FUL former school, Wormleighton; and Warings Green Farm above.

## E. What is not on the list

Sites inside Stratford-upon-Avon's own boundary or on its edge outside the Green Belt (West Shottery 580, Bridgetown 265, Bordon Hill 89, the rugby club 23, Long Marston Airfield) are S4 or S5 cases where the tier and Annex B questions do not arise. The template weight paragraph will still appear in them.

## Timing

- Planning Committee: 21 October, 4 November, 18 November 2026. The 21 October agenda was not published at 8 October; it appears about a week before, and the deadline to register to speak is 2 pm on the day before.
- The at-appeal cases excluded here: 26/01098/PIP Oaktree Close, Bearley; 26/01427/PIP Rushbrook Lane, Tanworth-in-Arden; 26/01252/PIP Barley Fields, Long Marston; 25/03113/FUL Seggs Lane, Alcester; 25/00799/FUL Fir Tree Farm, Bascote Heath. Their decisions will show how inspectors treat SDC's reasoning on the same questions.
- Re-run: `tools/stratford_supply.py` refreshes the register pull; the classification columns in the TSV were added by hand from the Core Strategy lists and should be re-checked for any new parish.

## Sources

- SDC planning register API, 8 October 2026 (status, decision, parish, dates, document folders).
- Committee reports, update sheets and results for 7 October, 23 September, 26 August and 29 July 2026, and the results sheets for 25 March 2026, 19 November 2025 and 5 February 2025: `sources:council/stratford-*.pdf`, OCR text in `sources:stratford-dc/public-note/`.
- Core Strategy 2011–2031 ¶4.1.3 (Green Belt extent) and ¶5.1.10 (village categories): `sources:stratford-dc/public-note/cs.txt`.
- South Warwickshire Local Plan, Regulation 19, July 2026, policy DS part D (washed-over villages with boundaries), and the Green Belt Exceptional Circumstances Topic Paper ¶170 and ¶176: `sources:stratford-dc/public-note/`.
- NPPF August 2026: `open:nppf/NPPF-August-2026.txt`.
