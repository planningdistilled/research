# Harvest log — appeals-greenbelt

Agent: appeals-greenbelt (plus 6 forked sub-workers reading batches of letters). Date: 2026-09-23.
Slice: PINS appeal decisions dated 17 Aug 2026 or later on Green Belt land (GB6, GB7 (a)–(h), GB8, VSC, grey belt, openness), all development types.

## Result

- **94 case files written** (`harvested_by: appeals-greenbelt`), all `verification: letter-read`. No existing files needed enriching; none of these decisions were in `cases/` when the pass started.
  - 88 are new-style PINS cases (`PINS-600xxxx`), found through the PINS "comment on a planning appeal" decided-appeals search (below).
  - 6 are old-style ACP enforcement appeals, found via Planning Geek and an ACP ref scan:
    - `APP-P0119-C-26-3378284` (Mangotsfield caravans, allowed, grey belt)
    - `APP-P0119-C-26-3378286` (Pilning traveller pitches, part-allowed, transitional)
    - `APP-B1550-C-25-3372995` (Rayleigh containers, dismissed)
    - `APP-T2350-C-25-3374492` (Langho agricultural building, dismissed)
    - `APP-G2245-C-26-3377906` (West Kingsdown traveller pitch, temporary permission, grey belt)
    - `APP-A2335-C-26-3378663` (Halton caravan storage, dismissed)
- Outcomes: 24 allowed, 69 dismissed, 1 part-allowed.
- Grey belt: 29 accepted, 2 rejected, the rest not argued or n/a.
- By type: about 34 householder cases; 30+ small housing, replacement-dwelling or PIP cases; 3 major housing (Thundersley 58, Hurst Green 132, Hatton 28 affordable); plus solar (Keynsham 28 ha), equestrian, agricultural, commercial, telecoms, traveller and caravan enforcement.
- 5 are marked `nppf_applied: "2024-12 (transitional)"`: 6007316, 6008668, 6008286, 6010859 and 3378286. Each is dated 17 Aug 2026 but reasoned under the 2024 Framework.
- The cheat-sheet §6/§6a decisions all now have case files: Branford Wells 6010313, Chedworth 6009966, Hurst Green 6004144, Thundersley 6007184, Heald Green 6005877 and Pinfield House 6008404. For Branford Wells, the file cites the operator's pasted copy and flags the unreconciled DL ¶9 (GB7(1)(b) met) vs ¶14 (inappropriate).
- **Croxley Green 6004972 is NOT decided.** The PINS case page on 23 Sep 2026 says "Awaiting decision"; the inquiry started 27 Aug 2026.
- PDFs are in `data/open-sources/pins-letters/<case-id>.pdf` (PINS, Secretary of State and Crown decisions) or `../sources/council/<case-id>.pdf` (council documents, private repo), with `-costs.pdf` where a costs decision was issued. Costs PDFs exist for 6009068, 6011231, 6011301, 6009185, 6011103, 6007334, 6008688, 6009645, 3378284 and 3372995, plus the costs decisions in 6004144 and 6006286.

## Sources and method

### 1. PINS "Comment on a planning appeal" decided-appeals search. This worked, and it is the main source.

- `https://appeal-planning-decision.service.gov.uk/comment-planning-appeal/decided-appeals?search=<X>` lists every decided **new-style** (600xxxx) appeal whose site postcode starts with `<X>`.
  - It needs a cookie jar: `curl -c cj -b cj`. Without it you get a 500.
  - A **single letter** works as a prefix (A…Z), so 26 requests list every decided new-style appeal in England: 7,944 rows back to Aug 2024.
  - Rows give the ref, address, decision date, appeal type and outcome.
- The case page `.../comment-planning-appeal/appeals/<n>` gives the appellant, LPA, application number and procedure, plus `/published-document/<uuid>` links to the decision and costs PDFs. These are direct downloads, no JS or auth.
- Of the 7,944 rows, 1,084 are dated 17 Aug 2026 or later (as of 23 Sep): 658 Planning, 308 Householder, 77 adverts, 31 LBC, 5 enforcement.
  - I downloaded and pdftotext'd 1,001 of them (all but adverts).
  - I kept the 94 that mention "Green Belt" 3+ times, dropped 2 PINS test records ("Lakshmi satti", 6002834 and 6015634), and sent the other 92 for distillation; 88 were written.
  - 4 turned out not to be Green Belt cases and were skipped (see LEADS).
- The whole working set (post.json, txt, pdf, pages) is in the scratchpad `.../scratchpad/gbh/` and was shared with appeals-nongb by message.
- **Limits:**
  - (a) Only new-style refs. Old-style ACP refs (3xxxxxx, mostly enforcement, LDC and older S78 inquiries) are not in this service.
  - (b) The search is by postcode, so a site recorded without a postcode would be missed. I found no example.
  - (c) Portal lag: decisions issued on 23 Sep may not yet be listed.
- Completeness check: Landmark Chambers' "Green Belt appeal allowed with full award of costs" (Rosconn, Hockley Heath, 6005246) turned out to be dated 17 Jul 2026, i.e. pre-Framework. That is consistent with the portal list being complete for the new-style stream.

### 2. ACP (acp.planninginspectorate.gov.uk). Partly worked.

- `ViewCase.aspx?caseid=<7-digit>` works for **old-style** refs without JS. It gives Site Address, Case Type, LPA, Decision Date, outcome and `ViewDocument.aspx?fileid=` links.
- For new-style 600xxxx refs it returns "No case found"; use the portal above.
- There is no usable search without JS postbacks, so I scanned ref ranges with `gbh/acp.py`.
  - The server is slow: about 1–2 requests/s even at 12 parallel.
  - Ranges scanned: 3352000–3352130, 3367500–3367630, 3370000–3370900 and 3374000–3378991. That is about 3,850 existing cases, 78 of them decided on or after 17 Aug 2026.
  - All 78 decision PDFs were downloaded to `gbh/acpdl/` and grepped. GB-relevant: 3378284, 3378286, 3372995/3375598, 3374492, 3377906 and 3378663 (all written).
  - Skipped as having no GB merits finding: 3378406 Stockley Park, Hillingdon (GB car park enforcement quashed on legal grounds, no ground (a)); 3378147 Silsden, Bradford (ground (a) withdrawn; costs against the appellant noted the benefits "were never going to provide very special circumstances").
  - Density is high (about 60% of refs exist), but few are decided after 17 Aug.
- The other ACP decided-after-17-Aug hits are non-GB and listed under LEADS.

### 3. Planning Geek. Useful for old-style refs and council leads.

- WordPress REST API: `https://www.planninggeek.co.uk/wp-json/wp/v2/posts?after=2026-08-17T00:00:00&per_page=100&_fields=date,link,title,content` returned 172 posts. Decision letters are hosted at `/wp-content/uploads/2026/09/...pdf`.
- Every new-style ref in these posts was already in the portal list.
- The old-style GB refs not on the portal were 3378284 (grey-belt caravan enforcement) and 3372995/3375598 (Rayleigh containers). Both written.

### 4. Web searches. Mostly dead ends for post-17-Aug material.

- Queries tried:
  - "grey belt" appeal allowed September 2026 inspector homes
  - "GB7" "grey belt" appeal decision 2026 inspector "National Planning Policy Framework"
  - planning resource grey belt appeal inquiry decision September 2026
  - Urbanist Architecture grey belt appeal decisions September 2026 update
  - "Secretary of State" decision Green Belt "grey belt" September 2026 recovered
  - "well-connected station" appeal inspector GB7 2026
  - "Golden Rules" appeal decision inspector "GB8" 2026
  - linkedin "grey belt" appeal allowed "new NPPF" September 2026
  - Green Belt solar/BESS appeal September 2026
  - Landmark/Kings/No5 grey belt appeal 2026
  - "inquiry" "Green Belt" appeal allowed homes "September 2026"
- Results were dominated by Planning Geek (already covered) and pre-Aug commentary:
  - Urbanist Architecture's roundup was last updated March 2026.
  - Burges Salmon, Edwin Coe, Lexology and Searchland pieces are pre-Aug.
  - The Beaconsfield/Holtspur 120-home redetermination was March 2026.
  - ACP fileids 65363107 and 65200848 are Feb/Mar 2026.
- Landmark Chambers news list: only one GB appeal item, 6005246, dated 17 Jul (pre-Framework).
- Not tried for lack of time: Planning Resource (paywalled), Town Legal, Cornerstone, No5, Kings, Shoosmiths, Lichfields blogs, LinkedIn direct.
- Given the portal gives the full new-style stream, these would mainly add commentary and old-style inquiry decisions.

## LEADS NOT FOLLOWED

**Green Belt, undecided or not appeals (re-check later):**
- Croxley Green, Land north of Little Green Lane, WD3 3SP. Appeal 6004972, Three Rivers 24/2073/OUT, c.600 homes, inquiry from 27 Aug 2026. **Awaiting decision** at 23 Sep.
- Albrighton, Patshull Road, Shropshire. Appeal 6007402, 800 homes, **recovered by the SoS** on 16 Sep 2026; the inquiry continues with the inspector reporting.
- Hawkwell (Rochford). Appeal 6008332; inquiry **adjourned on opening day** (16 Sep) over ownership notification.
- Keynsham, Parcel 0014 Charlton Road, B&NES 25/04952/EOUT, up to 200 homes. Committee resolved to approve 5–4 on 2 Sep 2026 (grey belt plus Golden Rules). Officer report: https://www.planninggeek.co.uk/wp-content/uploads/2026/09/25_04952_EOUT-—-Parcel-0014-Charlton-Road-Keynsham-—-Planning-Committee-Report.pdf (a council-decision lead).
- Wilmslow, Cumber Lane 25/1573/FUL (125 homes) and Dean Row Road 25/2071/FUL (168 homes), Cheshire East SPB, 16 Sep 2026. Safeguarded land; reports on Planning Geek. Council lead.
- Chalfont St Peter, Epilepsy Society, 975 homes. SoS allowed PL/22/2898/OA; an s288 challenge was launched (Planning Geek 26 Aug). The SoS decision date is probably pre-Aug; for the sos-and-other agent to confirm.
- Potters Bar s62A application, 293 homes (Planning Geek 28 Aug). Pending.
- Council approvals cited in letters:
  - Nyahlands Farm, Tandridge LPA 2025/499 (cited in 6011736).
  - Holly Farm, Plex Lane, Halsall, West Lancs, approved with a secured footway link (cited in 6007428; date and ref not given).
- The 6010471 Poynton letter mentions "Waterloo Road" and "The Cherries" appeals (unnamed refs).
- Pilning 6004905 (25 Jun 2026, dismissed, traveller need findings adopted in 3378286). Pre-Framework, so excluded.
- **ACP old-style scan incomplete.** Not scanned: 3352130–3367500, 3367630–3370000, 3370900–3374000 and 3379000 upward. Old-style S78 appeals lodged in 2024–25 (e.g. inquiries) and further GB enforcement ground (a) decisions will be in these ranges. Run `python3 gbh/acp.py <lo> <hi>` then `gbh/acpdl.sh` from the scratchpad. Expect about 1 id/s.

**Non-Green-Belt (for appeals-nongb):**
- 6008465 Moorhouse Lane, Oxenhope (Bradford), PIP up to 9: dismissed on South Pennine Moors SPA. The inspector made no GB finding (DL ¶20).
- 6006697 Woodstock House, Ockley (Mole Valley), 15 Sep: agricultural barn, AGLV, listed setting; "countryside beyond the Green Belt".
- 6008667 and 6008803, 18 and 16–18 Beech Hill, Hadley Wood (Enfield), 14 Sep: L2(1)(d)/(iii) garden-land intensification. The site adjoins the GB but is not in it.
- ACP old-style decided after 17 Aug:
  - 3370422 Mansfield (S78, allowed 7 Sep)
  - 3367531 Ilfracombe (LB enforcement, 16 Sep)
  - 3370180 Redbridge (enforcement quashed, 17 Sep)
  - 3370472 Waltham Forest (LDC, 17 Sep)
  - 3370610 Birmingham (LDC, 8 Sep)
  - 3370976 Luton (enforcement upheld, 3 Sep)
  - Other old-style post-17-Aug ACP decisions with no GB content: 3374155 (Kingston Blount enforcement, planning permission granted, 18 Sep), 3374376, 3374392, 3374416, 3374566, 3374622, 3374627, 3374736, 3375062 (Beckington S78, allowed), 3375109, 3375301/3375302 (Hockley Heath enforcement), 3375927, 3376000, 3376041, 3376088, 3376196, 3376201, 3376241, 3376591, 3376621–3376634, 3376754–3376756, 3376770, 3376816, 3377066 (Wrenbury Station Yard S78, dismissed 17 Aug), 3377217 (Westminster S78), 3377419, 3377456/7, 3377470, 3377537, 3377648–3377651, 3377929, 3378115, 3378120, 3378144/5, 3378189, 3378215 (South Downs NP S78, dismissed 25 Aug), 3378304, 3378427–3378429, 3378456, 3378458, 3378510. Case pages: https://acp.planninginspectorate.gov.uk/ViewCase.aspx?caseid=<n>; the list is in scratchpad gbh/acp/scan_*.jsonl.
- Planning Geek old-style refs, mostly LDC/enforcement: 3328819 (Slough), 3376000, 3372335, 3373810, 3373400, 3375109, 3375539, 3373190, 3372706, 3374155, 3309621, 3363150, 3375062, 3360983, 3376770, 3369273, 3327579, 3367328/3367329, 3377419, 3360778, 3369676, 3378659/3378843 (Bicester Crown development), 3350263, 3346233, 3356927, 3365332, 3281724, 3374566, 3344278, 3353647, 3360248, 3378008.

## OBSERVED PATTERNS

- **Limb (iii), sustainable location, decides most grey belt housing appeals, and it is the walking route, not distance, that decides it.**
  - Fails: no footway, unlit, shared carriageway or 40–60 mph lane, with thin or unevidenced buses: 6010313, 6009966, 6011736, 6007428, 6008528, 6012481, 6005433. Hatton 6006637 failed even with a station 350 m away.
  - Passes: the site adjoins a built-up area with continuous (ideally lit) footways and a real bus service: 6005877, 6010471, 6011301, 6004144, 3378286. 6009645 passed with an unlit, side-switching footway plus a bookable bus.
  - A lit, continuous but narrow footway beside heavy traffic, with no Sunday buses, still failed as "finely balanced" (6008688).
- **Scale does not rescue a failing location.** "TR3 must be read as a whole" (6009966 ¶27), and 5 dwellings count as "significant movement … in this context" (6010313 ¶13). Hatton treated 28 homes (about 112 vehicle movements a day) as significant for the host area (6006637 ¶29).
- **The Connectivity Tool has arrived but only corroborates.** Scores were cited in 6012481 (poor, undisputed), 6008528 (25/100, fail), 6011301 (43/100, 90th percentile, pass), 6010471 (52, pass) and 6011736 (52, still failed on route quality). 6008688 records that no output was put in.
- **Limb (ii) unmet need is automatic for new dwellings where there is a supply shortfall. It is not automatic for anything else.**
  - Shortfall passes: 6010313, 6009966, 6011103, 3378284. An HDT result under 75% sufficed despite a five-year supply (6008528).
  - Fails: householder extensions, "wanting a bigger house" (6008745, 6009962); a family annexe (6005976); a leisure studio (6012188); storage (6005433); shipping containers where the need evidence was for warehousing (3372995); and where no shortfall evidence was supplied (6003001).
- **Grey belt purpose (a) is read on the site, not the strategic parcel, and villages are not "large built-up areas".**
  - Villages: 6007184, 6011103, 6010471, 6005916.
  - Containment by roads, woodland or planting beats a council study's "strong" rating: 6007184, 6007334, 3378284.
  - But a village absorbed into a conurbation counts as part of the large built-up area (3378284 ¶36).
  - Grey belt was rejected only where an uncontained site abutted a large built-up area (6009281, 6007316).
- **Passing GB7 routinely moves the case into S5(5) "substantially outweighed", where it is then often lost.**
  - Lost on: odour (6004144), flood/sequential test (6006286), National Landscape (6007130), density L3 (6007121), SPA/newts (6009645, 6007334), design/noise (3372995, 6010520) and heritage (6008539).
  - S5(2) "refuse" policies (DP3(3) space standards, TR6(4) highway safety, N6 ancient woodland) decide cases even after a GB7 pass: 6005150, 6006761, 6006496.
  - Inspectors treat a GB7 failure as switching S5(5) off entirely (6007428 ¶28, 6009966 ¶50).
- **Golden Rules.**
  - Met, with substantial weight, in 6007184 (50% affordable) and 6004144.
  - The first GB8(1)(b) failure is Hatton 6006637: pedestrian highway improvements not identified or secured.
  - A touring pitch does not count toward the 10-unit major threshold (3378284 ¶45).
- **Station route (h).** Two letters used the "well-connected station" definition to rule it out:
  - 6006637: fewer than 4 trains an hour.
  - 6004144: the station is about twice the reasonable walking distance.
  - No (h) pass yet.
- **GB7(1)(e) is doing heavy lifting for small schemes.**
  - Gardens outside built-up areas are PDL (6012162, 6012043, 6012763).
  - Stables and equestrian buildings are PDL (6008668, 6009189).
  - Barns to houses (6004344), and oversized replacements that fail (b) can pass (e) (6008404, 6010292).
  - Limits: the whole site must be PDL (6011330, 6009281, 6010260); extending a retained building is not "redevelopment" (6008579); bulk increases fail (6010165, 6011972).
- **Householder GB7(1)(b) is unchanged from 2024.** It is cumulative against the original building, openness is not a separate test, and about 70%+ usually fails (6011692, 6012008, 6009260, 6010567, 6010525, 6012026, 6005603, 6008087, 6011106, 6010236, 6011065). About 40% passed (6010603).
- **Transition handling is loose.**
  - Many written-reps inspectors did not re-consult because the GB tests have "not materially changed" (tag `transitional-no-consultation`).
  - Five letters dated 17 Aug applied the 2024 Framework outright: 6007316, 6008668, 6008286, 6010859, 3378286.
  - Several use old wording: "great weight"/"less than substantial" heritage (6008659, 6007287), "significantly and demonstrably" (6010260, 6004344), and the 2024 (f) "does not conflict" (6003507).
  - Check paragraph citations before citing any letter dated 17–31 Aug as 2026 authority.
- **Removing footnote 7 changes grey belt for protected areas.** 3377906 ¶9–10: National Landscape and ancient woodland no longer exclude land from grey belt; those constraints bite through N4/N6 instead. For traveller sites, HO12 lets inspectors flex limb (iii), yet the same inspector said a remote-lane site "would not satisfy" GB7(1)(g)(iii) for general housing (3377906 ¶19). Unlawful development cannot create PDL (3378663 ¶30).
- **Local Green Belt policies written before grey belt get very limited weight, and GB7 is applied directly:** 6005877 ¶12, 6009966, 6010471, 3372995 ¶22. So are local "preserve openness" add-on tests: 6008866, 6010603, 6005150.
- **Costs.** Tandridge paid full costs at Hurst Green 6004144 despite winning on odour. Partial costs were awarded against the council in 6008688 and 6011231. Refused in 6011301, 6011103, 6007334, 6009645, 6006286, 3378284 and 3372995. 3378284 holds that grey belt status even for PDL is a judgment, so contesting it is not unreasonable.
