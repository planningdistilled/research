# Harvest log: midlands-lpas

Agent: midlands-lpas. Date: 2026-09-23. Slice: council decisions from 17 Aug 2026 onward by the LPAs around Stratford-on-Avon.

## Result

27 case files written in total (0 enriched): 23 in pass 1 and 4 in follow-up pass 2 (see the end of this log). Every one is dated 17 Aug 2026 or later.

| Council | Cases | Route |
| --- | --- | --- |
| Bromsgrove | 26-00845-PIP, 26-00744-FUL, 25-00751-FUL, 25-01429-FUL, 26-00434-FUL | Idox public access (the notices embed the officer report) |
| Wychavon | W-26-01322-OUT, W-25-01931-OUT, W-26-01639-PIP, W-26-01874-PIP, W-26-01828-PIP, W-26-00329-FUL, W-26-01447-FUL | plan.wychavon.gov.uk (delegated reports) |
| Malvern Hills | M-25-01044-FUL, M-25-01235-RM, M-26-00885-FUL (committee); M-26-01131-FUL, M-26-01162-PIP (delegated) | moderngov + plan.malvernhills.gov.uk |
| Cotswold | 25-03800-FUL, 26-01098-FUL (committee 9 Sep) | meetings.cotswold.gov.uk |
| Nuneaton & Bedworth | 041303 (committee 1 Sep, **overturned officer rec**) | Jadu meetings pages |
| Worcester | 26-00541-FUL (committee 17 Sep) | committee.worcester.gov.uk + plan.worcester.gov.uk |
| Lichfield | 26-00855-OUT, 26-00849-FUL (delegated) | Idox public access |

Source PDFs are in `data/open-sources/pins-letters/<case-id>-report.pdf` (PINS, Secretary of State and Crown decisions) or `../sources/council/<case-id>-report.pdf` (council documents, private repo) / `-notice.pdf`, plus the committee minutes and update sheets for Malvern, Cotswold and NBBC.

## Sources searched and method

### modern.gov (working hosts)
- Bromsgrove `moderngovwebpublic.bromsgrove.gov.uk` (Planning Cttee CId 108). 3 Sep: Brockhill solar, Perryfields RM, Victoria Ground ADV. **Minutes not yet published**, so these are leads.
- Redditch `moderngovwebpublic.redditchbc.gov.uk` (CId 112). 10 Sep: only 26/00824/S73 (Claybrook Business Park). Minutes are published; low value, not written.
- Malvern Hills `moderngov.malvernhills.gov.uk`: Northern (413) 2 Sep; Southern (414) 26 Aug. The 23 Sep page is empty (meeting tonight).
- Worcester `committee.worcester.gov.uk` (130). 17 Sep. Minutes not yet published; outcomes taken from the plan.worcester portal.
- Cotswold `meetings.cotswold.gov.uk` (1162). 9 Sep; draft minutes are published.
- Cherwell `modgov.cherwell.gov.uk` (117). 3 Sep page empty (probably cancelled). 16 Sep was only a Crown development consultation response (MOD Bicester Site A). 24 Sep is tomorrow (agenda only).
- Lichfield `democracy.lichfielddc.gov.uk` (135). The 7 Sep meeting covered only constitution changes (National Scheme of Delegation).
- Solihull `democracy.solihull.gov.uk` (251). 9 Sep: five children's care-home changes of use (C3 to C2) and three householders, plus 17 New Street PPOL. **Minutes not yet published.** The pack includes a useful "PLANNING POLICIES NNPF SLP equivalent" table mapping 2026 codes to the Solihull Local Plan (e.g. "GB8 The Golden Rules: No equivalent").
- Coventry `edemocracy.coventry.gov.uk` (147). Needs `--http1.1` and a long timeout. 17 Sep: Farren Rd, 3 Bodmin Rd FULM, TPO, householder. Minutes not yet published; urban; not written.

### Other committee systems
- North Warwickshire (Jadu `northwarks.gov.uk/meetings/meeting/<id>/planning-and-development-board`; ids 983 to 987 = Jul to Nov 2026). The 7 Sep Board pack was read; minutes are not out (next meeting 5 Oct).
- Nuneaton & Bedworth (Jadu `nuneatonandbedworth.gov.uk/meetings/meeting/816`). 1 Sep minutes are out. 22 Sep was cancelled.

### Planning portals (the most productive route)
- **South Worcestershire "plan.<council>.gov.uk"** (Wychavon, Malvern Hills, Worcester). `/Search/Advanced` takes an anti-forgery token; POST to `/Search/SiteResults`, then GET `/Search/Results` and page with `/Search/ResultsPage/N?module=PLA`. Fields include DateIssuedFrom/To, ApplicationType (OUT, PIP, FUL, RM, HYB) and **DateAppealDecisionFrom/To**. Documents are `Document/Download?...isPlan=False` links held in a `data-disabled-link` attribute. Delegated reports are named `delegated report_<ref>.pdf`. The scripts are in the scratchpad (`ml/swsearch.sh`, `ml/disp.sh`).
- **Idox**: Bromsgrove & Redditch `publicaccess.bromsgroveandredditch.gov.uk` and Lichfield `planning.lichfielddc.gov.uk`. The advanced search (with _csrf) supports `date(applicationDecisionStart/End)` plus a description keyword. Documents must be downloaded in the same cookie session. **Bromsgrove's decision notices contain the full officer report**, so the notice is the report.

## Dead ends
- `*.moderngov.co.uk` hosts (Rugby, Tamworth, West Northants): IIS 403 "Access is denied" for every user agent and for WebFetch.
- Warwick DC CMIS `estates8.warwickdc.gov.uk/cmis`: 503 all day. `planning.warwickdc.gov.uk` is unreachable. **No Warwick coverage.**
- Solihull Idox `publicaccess.solihull.gov.uk`: connection refused. Only the delegated list in the committee pack is available.
- Rugby: meetings are per-page on rugby.gov.uk (`/l/<id>`); the September pages were not found. The Rugby Idox is unreachable.
- Birmingham CMIS (`birmingham.cmis.uk.com`): reachable, but the committee navigation is awkward. Not pursued (low Green Belt yield).
- Walsall CMIS (`cmispublic.walsall.gov.uk`): 404 on guessed paths. Dudley: no host resolved. Not covered.
- Cherwell planning register: the Search/Advanced form ignores the date and type filters with my POST (different field names); only recent validations came back.
- DNS and TLS were flaky for several `.gov.uk` hosts (curl 000). Retrying with `--http1.1 -m 90` sometimes works.

## LEADS NOT FOLLOWED (committee items with no decision yet, or not processed)

Committee items where the outcome is not yet published, with the officer recommendation:
- **Bromsgrove 24/01341/FUL**, Brockhill Solar, land north of Brockhill Lane, Tardebigge (38.8 ha, 25 MW, Green Belt). Committee 3 Sep 2026; **rec: minded to grant** (BNG legal agreement). The report runs GB7(1)(g) for a solar farm: grey belt accepted; "evidenced unmet need" from CP30, EN-1 and the Worcestershire Energy Strategy; GB7(1)(g)(iii) and TR3 treated as having "little relevance" to a solar farm. W3 is read as raising the renewables benefit from significant to **substantial** weight. The update sheet (Conservation Officer, 26 Aug) redoes the heritage analysis under HE4 to HE7: lower-end less than substantial harm to Hewell Grange (I), the RPG (II*) and the CA; NDHA cottages under HE7(2). Portal status on 23 Sep: "Awaiting decision". Report: https://moderngovwebpublic.bromsgrove.gov.uk/documents/s68723/05%20-%20Committee%20Report%20Brockhill%20Lane.pdf ; update: .../documents/s68765/04%20-%20BDC%20Updates%203%20September%202026.pdf
- Bromsgrove 25/01337/REM Perryfields Road (101 affordable, phase 2C), 3 Sep. Rec approve. Low NPPF content.
- Bromsgrove 26/00417/ADV Victoria Ground (digital sign, heritage setting), 3 Sep. Rec refuse.
- Worcester 25/00439/FUL Bromyard Road (Aldi plus industrial hybrid; S4/TR3/DP3 reasoning), 17 Sep. Rec delegated approve subject to s106. Portal "Pending".
- Worcester 26/00105/FUL 56 Woodstock Road (8-bed HMO). Approved 18 Sep (portal). The appeal on the earlier 6-to-8-bed scheme (24/00959/FUL, PINS 6011840) was dismissed between 17 Aug and 23 Sep and is appended to the report. Not written (low priority).
- North Warwickshire 7 Sep Board: **PAP/2025/0490** Indurent Park / Tamworth Logistics Park, two employment units. Rec approve under S5; emerging allocation (DM4). **Drafting slip at ¶10.8**: "the benefits of the proposal are considered to be substantially outweighed by any adverse effects" (the test inverted). PAP/2025/0491 (outline, rec defer on highways). Also **2026/0560/OUT** Land east of Birmingham Road, Ansley, 150 dwellings (Bellway; "for information" report citing S5, TR3, DP3; supply 0.82 to 2.2 years per the applicant) and **2026/0558/FUL** Rectory Road, Arley, 43 dwellings, **Green Belt grey belt / GB7(1)(g) / GB8 50% affordable** ("for information"; determination to follow; watch for it). 2026/0295/FUL Hartshill Academy 3G pitch (HC7). Pack: https://www.northwarks.gov.uk/download/meetings/id/2481/
- Solihull 9 Sep: PL/2026/00716, 01232, 01314, 00918, 01193/PPFL (children's care homes; S4, HO9(b), TR3, DP3, L2(d); all rec approve) and PL/2025/02266/PPOL 17 New Street (rec approve). Minutes due with the 7 Oct pack.
- Solihull delegated list (Aug), Green Belt items with no report access: PL/2025/00153/PPFL Land off The Grove, Hampton in Arden (kennels to dwelling, approved 27 Aug); PL/2025/00341/PPFL The Barn, Knowle Road, Eastcote (retrospective dwelling, **refused 17 Aug**); PL/2026/01128/PPFL Blythe View Farm, Knowle (agricultural container, refused 27 Aug); PL/2026/00860/PPFL 34 Creynolds Lane, Cheswick Green (approved).
- Cherwell 24 Sep: 1 Heathcote Avenue, Banbury (two items); Spiceball Leisure Centre. Minor.
- Cherwell 16 Sep: 26/01833/CROWN MOD Bicester Garrison Site A. Council response to an **urgent Crown development** application decided by MHCLG (lead for sos-and-other).
- Coventry 17 Sep: PL/2025/0002239/FULM 3 Bodmin Road; PL/2026/0000674/FUL 249 Farren Road.
- Malvern Southern 23 Sep (tonight): agenda not harvested.
- Malvern M/26/00634/FUL The Hill Centre, Upton (3G pitch, approved 26 Aug) and M/25/00768/RM Lower Broadheath landscaping RM (approved 2 Sep). Low value, not written.
- Wychavon delegated, not written: W/26/00513/FUL Elm Tree Cottage, Hanbury (Green Belt replacement dwelling approved 4 Sep; GB7 "original building" wording; report in scratchpad); W/26/00626/RM Newland Road, Droitwich (50 dwellings RM); W/24/01768/FUL Locks View, Hartlebury (gypsy plots S73); W/26/01302/FUL Rashwood Lodge (temporary caravan, Green Belt).
- Malvern delegated, not written: M/25/00851/FUL Sunbrae, Lower Broadheath (bungalow replacing agricultural buildings in lieu of Class Q/R, approved 8 Sep); M/26/00854/FUL Stanhurst, Kempsey (subdivision); M/26/00970/FUL 22 Tanhouse Lane (refused).
- Bromsgrove delegated, not written: 24/00686/FUL The Bungalow, Old House Lane, Romsley (replacement dwelling, **refused 22 Sep**, Green Belt; notice not yet uploaded); 26/00654/FUL Home Farm, Wildmoor (replacement dwelling 17 Aug; policy list cites both NPPF 2024 and 2026); 26/00684/FUL 103 Hewell Road, Barnt Green (1 to 2 dwellings); 26/00840/CUPRIO Cobley Hill Farm (Class MA/Q-type prior approval refused).
- Lichfield: 26/00916/FUL New Buildings Farm, Croxall Road (replacement self-build, approved 21 Sep); 26/01031/SCREE Reindeer Road, Fazeley (140 dwellings screening, a future lead).
- **Appeal leads** (passed to appeals-nongb): PINS 6009042 (Old Rectory, Bredicot, Wychavon, dismissed); PINS 6011840 (56 Woodstock Road, Worcester, dismissed); Cherwell appeals report: Foxden Way, Great Bourton (5 bungalows, dismissed, unsustainable), Mole End, Great Bourton (PIP dismissed on density), 73 High Street, Kidlington (NDHA). Already on file: 6008404, 6010196, 6008601, 6010973, 6006644, 6010271.
- Referenced in reports, pre-17 Aug (context only): PINS 6001105 (Astwood Bank PIP, 27 Feb 2026, grey belt accepted but location fail); PINS 6004489 (9 Bromsgrove Rd, Romsley PIP, 15 Jun 2026); appeal 3356219 (Hollywood not a "large built-up area").
- Councils not reached at all: Warwick, Rugby, Tamworth, West Northamptonshire, Birmingham, Dudley, Walsall.

## OBSERVED PATTERNS

- **A five-year supply shuts the S5 door and moves the burden.** Where supply is met (South Worcestershire after the SWDPR's March 2026 adoption), officers treat S5(1)(j) as "not applicable" and go straight to S5(4) exceptional circumstances ("benefits … substantially outweigh"). They refuse even where TR3 is passed (wychavon-W-26-01322-OUT, wychavon-W-26-01874-PIP). Where supply is short (Bromsgrove 2.24 years, Lichfield 3.5 years), fn41 makes GB7(1)(g)(ii) automatic and the grey-belt route opens (bromsgrove-26-00845-PIP, lichfield-26-00855-OUT).
- **GB7(1)(g)(iii) is decided on route quality and bus frequency, not distance.** Passes: lit footways on both sides and a regular bus within 60 m (bromsgrove-26-00845-PIP); a walkable village with a bus within 500 m (lichfield-26-00855-OUT). Fails: narrow, mostly unlit routes, an infrequent bus and a Connectivity Tool score of 23 (wychavon-W-26-01639-PIP); a bus on two days a week (bromsgrove-25-01429-FUL). The same quality test is applied outside the Green Belt: a sunken, unlit lane makes 0.5 km facilities "theoretical" (malvern-M-26-01131-FUL). There is one important exception. Where the nature of the use needs a rural site (a SEND farm school), a car-based location passed (bromsgrove-25-00751-FUL, echoing TR3(1)(a) "unless the nature of the development would make this impractical").
- **The TR3(2) Connectivity Tool has started to appear in reports** as corroboration alongside qualitative evidence (wychavon-W-26-01639-PIP, score 23). Highway authority no-objection is repeatedly held not to settle locational sustainability (wychavon-W-26-01874-PIP, bromsgrove-25-00751-FUL is the reverse case).
- **Fallbacks are doing much of the approving.** Class Q or other PD fallbacks turned S5(4) and Green Belt very-special-circumstances failures into approvals: wychavon-W-26-00329-FUL (Class Q, S5), bromsgrove-25-01429-FUL (Class Q plus reduced volume = very special circumstances), bromsgrove-26-00434-FUL (larger-home prior approval), wychavon-W-26-01828-PIP (extant PIP). The Mansell "real prospect" test is applied generously: the landowner's intention to maximise value was enough.
- **Council Green Belt reviews are being applied parcel by parcel to decide grey belt**, and have reversed earlier refusals (lichfield-26-00855-OUT: refused in June 2025, approved in Sept 2026 after the 2026 review scored the parcel weak or none on (a), (b) and (d)). Prior Inspector findings are adopted wholesale on grey belt and "large built-up area" (wychavon-W-26-01639-PIP, bromsgrove-26-00845-PIP).
- **Transition handling is uneven and error-prone.** Methods seen: a same-day "code-mapping" update sheet declaring the assessment unchanged (malvern-M-25-01044-FUL, malvern-M-25-01235-RM); a report headed "NPPF Aug 2026" that reasons in 2024 paragraphs (malvern-M-26-00885-FUL, malvern-M-26-01131-FUL "¶11d / ¶14 not engaged"); a notice dated 17 Aug that applies the 2024 Framework throughout (bromsgrove-26-00744-FUL); and a March resolution issued on 25 Aug citing the superseded 2016 plan (wychavon-W-25-01931-OUT). Mis-citations: N5(4) for the setting of Protected Landscapes (malvern-M-25-01235-RM), GB1 for the Green Belt purposes (bromsgrove-26-00845-PIP), HE5 labelled as non-designated assets (worcester-26-00541-FUL), "Paragraph 78" (wychavon-W-26-01639-PIP), and NBBC reasons for approval citing the 2024 Framework (nuneaton-041303).
- **S5(5) is applied inconsistently in the Green Belt.** Some officers correctly disapply S5 and go to GB6/GB7, then apply S5(5)'s "substantially outweighed" default (wychavon-W-26-01639-PIP, lichfield-26-00855-OUT). Others cite S5(1)(j) as the principle for a Green Belt site (bromsgrove-26-00845-PIP), or give weight to openness harm after finding the scheme not inappropriate (bromsgrove-25-00751-FUL). Outside the Green Belt, one refusal ran a plain "outweigh" balance where an S5(1)(d) category was arguably met (malvern-M-26-01131-FUL).
- **S5(1)(e) "limited infilling within groups of houses" is tested physically**: houses on both sides pass (wychavon-W-26-01828-PIP); one house opposite does not make a group (wychavon-W-26-01874-PIP); the countryside side of a road is not infill even opposite a village (malvern-M-26-01162-PIP).
- **S5(1)(h)/GB7(1)(h) stations are a binary timetable test**: a heritage or low-frequency station within 800 m fails the Annex B "well-connected" definition (wychavon-W-26-01874-PIP).
- **Renewables: CC2(2) and W3 are read as lifting energy benefits to "substantial" weight**, and this carried a 6-5 approval in a National Landscape setting with heritage harm (malvern-M-25-01044-FUL; Bromsgrove Brockhill lead).
- **N4 "major development" is judged under fn59, not the DMPO**, so a DMPO-major supermarket in the Cotswolds NL was not "major" (cotswold-25-03800-FUL). S4(2)(a)(i) (loss of an allocation) is treated as a real test but met by evidence of surplus allocated supply (same case).
- **Members overturning officers on highways cite TR6(4) "severe"** against a no-objection from the highway authority (nuneaton-041303). It is the only overturn found in this slice. Split 6-5 votes in Malvern show members' unease with National Landscape-setting schemes.
- DP3(3) ("refused if, without clear justification…" plus "substantial weight to compliance with development plan design policies") is being used as a countryside-encroachment refusal reason (wychavon-W-26-01322-OUT).

## Biggest gaps
Warwick, Rugby, Tamworth, West Northants, Birmingham, Dudley and Walsall produced nothing (bot-blocked or unreachable). Committee minutes for Bromsgrove, Worcester, Solihull and North Warwickshire (Sept meetings) are not yet published. Re-run in mid-October for the Brockhill solar outcome, the Solihull care-home outcomes, the NWBC Indurent decision and the Arley grey-belt determination.

---

## FOLLOW-UP PASS 2: Warwick, Solihull, Rugby, West Northamptonshire (about 75 minutes)

Four more cases: `warwick-W-26-0134` (Forge Farm, Shrewley, Claverdon postcode: permanent rural worker's dwelling in the Green Belt, delegated approval 28 Aug), `warwick-W-25-0302` (Pinley Green rural worker's dwelling, delegated approval 21 Aug), `warwick-W-25-1768` (Burton Green village hall outdoor facilities, washed-over Green Belt, committee approval 15/16 Sep) and `westnorthants-WNS-2022-0673-MAF` (Kislingbury, 58 homes: S5(1)(j) met but refused on five harms; committee 3 Sep, notice 8 Sep).

### Routes that WORK (use these next time)
- **Warwick DC Idox: `https://planningdocuments.warwickdc.gov.uk/online-applications/`** (https only; http returns 403). The advanced search takes `date(applicationDecisionStart/End)`, `date(applicationCommitteeStart/End)`, `searchCriteria.caseType` (O, PIP, FUL, R) and `searchCriteria.developmentType` (Q01 large dwellings, Q13 minor dwellings). keyVals look like `_WARWI_DCAPR_99350`. Delegated reports are published as "Delegated Report"; committee items carry "Committee Report - Single Report", "Update Report" and **"Summary of Decisions"**. The Summary of Decisions PDF for 15/16 Sep uses a garbled font: the body text decodes by substitution, but refs and addresses use a second font and stay unreadable. Use the per-application status and decision fields instead. Scripts: scratchpad `ml/idox.sh`, `ml/idoxdocs.sh`, `ml/getdoc.sh`.
- **West Northamptonshire planning register: `https://wnc.planning-register.co.uk/`**. Accept the disclaimer first with a `POST /Disclaimer/Accept?returnUrl=%2F` (needs `--data ""`), then `/Planning/Display/<ref>` in the same cookie jar. It lists committee dates, decision status and `Document/Download?...` links (committee report and decision notice once issued). Script: `ml/wn.sh`, `ml/wnget.sh`.
- **opencouncil.network** meeting pages (e.g. `/meetings/161339`) give WNC committee agendas and outcome summaries. **They are AI-generated and unreliable**: Kislingbury is shown as "approved" in one place and "refused against an approval recommendation" in another. In fact the officer recommended refusal and the committee refused. Use only to find leads; always verify on wnc.planning-register.
- **Rugby meeting pages: `https://www.rugby.gov.uk/l/<id>`**. September ids: 62364574 = 2 Sep 2026 (**cancelled**), 62364577 = 30 Sep 2026 (agenda PDF linked). Other 2026–27 ids: 62364561 (3 Jun), 62364567 (1 Jul), 62364572 (5 Aug), 62364579 (4 Nov), 62364589 (2 Dec). Committee list page: `/l/6638692`.

### Routes that FAILED (do not retry)
- Warwick CMIS `estates8.warwickdc.gov.uk/cmis`: 503 all session. `planning.warwickdc.gov.uk`: no response. Web search found no Sept 2026 Warwick committee press coverage.
- West Northants modern.gov `westnorthants.moderngov.co.uk`: Cloudflare challenge (document PDF URLs redirect to mgMsg and then the challenge). Northampton Chronicle and Insider Media: Cloudflare 403 via curl and WebFetch.
- Solihull: `publicaccess.solihull.gov.uk` connection refused; 9 Sep minutes not yet on democracy.solihull.gov.uk (the 7 Oct pack will carry them); the modern.gov delegated-decisions page lists only executive decisions. Web search found nothing.
- Rugby: `rugby.moderngov.co.uk` IIS 403; Rugby Idox unreachable; the only September meeting was cancelled.

### New leads (outcome not yet issued, or not processed)
- **WNC Strategic Planning Committee 18 Aug 2026: S/2020/2163/MAO**, Halse Road, Brackley, up to 450 dwellings. Resolution to grant (awaiting s106; portal decision target 25 Sep). The opencouncil summary says WNC supply was 4.3 years and the "substantially outweighed" presumption was applied. Committee report at westnorthants.moderngov (blocked); an Inspector's appeal decision 3367158 is on the portal. Also reserved matters approved that day: Dallington Grange (169), Overstone Lane (35), Towcester Vale (128).
- **WNC 17 Sep 2026: 2026/1111/MAO** Welford Road, Creaton, up to 46 homes. Resolution to grant, officer recommendation followed (per opencouncil), outside village confines, justified by the supply shortfall; awaiting s106 (target 30 Oct). **2024/0284/MAO** Overstone Leys (20, SUE allocation). **2025/2549/FULL** Rathvilly Farm, Milton Malsor: an HO11(1)(e) exceptional-quality isolated dwelling, **approved**. Worth a case when the notice issues. **2025/2007/MAF** The Factory, Roe Road: refused **against officer recommendation** (per opencouncil, unverified).
- WNC 3 Sep: 2026/2081/FULL Tudor Court, Wootton, office refused against officer recommendation on parking/TR4(1)(e) (per opencouncil, unverified). 2026/1767/MAF Newbottle dog-exercise field approved.
- WNC 22 Sep Strategic: Claridges Barn, Kislingbury (inert waste recycling); Malabar Farm, Daventry RM (237).
- **Appeal lead**: land between Harlestone Road and York Way, Northampton, up to 100 homes. **Allowed on 7 Sep 2026** (press). Passed to the appeals agents.
- **Warwick W/25/1339** Oakley Wood Road, Bishops Tachbrook, outline for up to 160 dwellings. The applicant filed a "Planning Addendum - NPPF 2026" on 17 Sep; awaiting committee. **W/25/0728** Europa House, Warwick (discount foodstore) was withdrawn from the 15/16 Sep agenda for clarity on the sequential test. **W/26/0730/LB** (probable) was deferred so officers could explain "the application of the updated NPPF".
- **Rugby 30 Sep 2026**: R25/0855, workers' mobile home in the Green Belt (GB6/GB7 assessed; recommendation approve); R26/0414, ground-mounted solar.

### Extra observed patterns (pass 2)
- **Rural workers' dwellings in the Green Belt are treated as inappropriate, with HO11(1)(a) essential need accepted as the very special circumstances.** This is consistent across Warwick (warwick-W-26-0134, warwick-W-25-0302) and Lichfield (lichfield-26-00849-FUL). An independent rural consultant's verification is decisive, and the viability test has teeth (0.96 FTE initially failed).
- **Passing S5(1)(j) is not the end of the matter.** WNC accepted that Kislingbury met (j) and refused under the S5(1) balance, citing the HRA gap as an S5(2)-type refusal policy (westnorthants-WNS-2022-0673-MAF).
- **S6 is disapplied for neighbourhood plans more than five years old**, and plan-boundary conflict then gets "very limited weight" (westnorthants-WNS-2022-0673-MAF).
- **Warwick DC reports use a standard NPPF 2026 preamble applying Annex A** ("materially inconsistent … very limited weight"; warwick-W-25-1768). Warwick members have started deferring items so officers can explain the new Framework.
