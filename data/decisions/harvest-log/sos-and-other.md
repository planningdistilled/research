# Harvest log: sos-and-other (SoS, non-housing appeals, courts, guidance)

Agent: sos-and-other. Run 23 Sep 2026. Slice: decisions from 17 Aug 2026 onward covering:
- Secretary of State called-in and recovered decisions, and NSIPs where they engage the 2026 NPPF;
- non-housing appeals;
- court judgments;
- ministerial or PINS guidance.

**Result: 172 cases written, 0 enriched:** 55 in the first pass, 3 listed-building cases in the second pass, 113 in Wave 2 slice rest-0, and SOS-EN010151 (Beacon Fen, transitional) added last.
- 1 Secretary of State DCO (SOS-EN020032)
- 1 Crown development (CROWN-2026-0000003)
- 56 PINS appeals

Candidates already in the store were skipped rather than enriched, e.g. PINS-6005916 (BANES solar) and PINS-6009185 (Liverpool lattice mast). Several of the 53 were written by three forked sub-agents; all are marked `harvested_by: sos-and-other`, and each letter was read in full.

## Key discovery: bulk access to every new-style PINS decision

The PINS "Comment on a planning appeal" service (appeal-planning-decision.service.gov.uk) lists **decided appeals by postcode area**.
- It needs a session cookie: GET `/comment-planning-appeal/appeals?search=<AREA>` first, then `/comment-planning-appeal/decided-appeals?search=<AREA>`.
- Area-level searches work (e.g. `HA`, `B`, `CV`); place names do not.
- Each appeal page, `/comment-planning-appeal/appeals/<ref>`, links the decision PDF at `/published-document/<uuid>`. No login is needed.
- Coverage: new-style 7-digit refs (600xxxx) only. Old-style APP/.../3xxxxxx cases are ACP-only.

What was built from it:

| Output | Path |
| --- | --- |
| Sweep script (106 English postcode areas, about 3 minutes) | `tools/sweep_pins_decided.py` |
| All decisions dated 17 Aug–23 Sep 2026 (**1,084**) | `harvest-log/pins-decided-since-2026-08-17.json` |
| Full text of all 1,084 letters (pdftotext -layout), plus `docs.map` (ref → document uuid) | `data/open-sources/pins-corpus/<ref>.txt` |
| Index: ref, date, type, decision, LPA, 2026 policy codes cited, flags, description | `harvest-log/pins-corpus-index.tsv`, built by `tools/index_pins_corpus.py` |

- The PDFs themselves (178 MB) were **not** copied into the repo. Only the PDFs for written cases are in `data/open-sources/pins-letters/` (PINS letters) and `../sources/council/` (council documents, private repo). Re-fetch the others with the document uuid from `docs.map`.
- By type: Planning 658, Householder 308, Commercial advertisement 77, Planning listed building and conservation area 31, Advertisement 5, Enforcement 4, CAS 1.
- By outcome: dismissed 705, allowed 365, part-allowed 9.
- The coordinator, appeals-greenbelt and appeals-nongb were told about the corpus by message.

Rough regex counts of how the 1,084 letters handle the switch (approximate):
- about 298 record that parties were invited to comment on the 2026 Framework;
- about 114 say it made "no fundamental/material change";
- 78 cite 2024 paragraph numbers or "December 2024";
- 124 do not mention the Framework at all (mostly householder cases).

## 1. Secretary of State decisions

- **gov.uk collection** "Planning applications: called-in decisions and recovered appeals". Read through the content API (`/api/content/government/collections/...`). Last updated 30 Jul 2026. **No called-in or recovered decision has been issued since 17 Aug 2026.** The latest are:
  - Ebbsfleet United called-in decision, 30 Jul 2026;
  - Truman Brewery recovered appeal, 29 Jul;
  - Snarlton Farm, Melksham, 28 Jul;
  - Epilepsy Society, Chalfont St Peter, 29 Jun.
  
  I cross-checked with the gov.uk search API (MHCLG, document type `correspondence`, newest first, to 23 Sep): no new "Recovered appeal:" or "Called-in decision:" items.
- **Albrighton** (Patshull Road, Shropshire, up to 800 homes plus 80-bed care home plus secondary school; Boningale Developments). **Recovery direction 16 Sep 2026.** Reasons: important or novel issues, and significant Green Belt development. The inquiry closes 9 Oct 2026, then an inspector's report goes to the SoS. **Undecided.** Sources: planninggeek.co.uk/2026/albrighton-appeal/, Shropshire Council newsroom, Express & Star. Planning Geek also has "albrighton-previously-developed-land" (13 Sep).
- **NSIP / DCO decisions since 17 Aug:**
  - **Morgan and Morecambe OWF Transmission Assets (EN020032), 14 Sep 2026: WRITTEN as SOS-EN020032.** DESNZ SoS against an ExA recommendation to refuse. It expressly acknowledges the 17 Aug 2026 NPPF but keeps the 2024 references: "nothing contained within the updated NPPF publications which would lead her to reach a different decision" (DL ¶4.2). Green Belt VSC was found for two substations.
  - **Beacon Fen Energy Park (EN010151), 21 Aug 2026: WRITTEN as SOS-EN010151** (transitional, at the coordinator's request). The DL ¶4.3 calls the NPPF "A revised draft … published in February 2025, followed by a subsequent consultation which closed on 10 March 2026", four days after the 2026 NPPF took effect. DL ¶4.54 applies "NPPF paragraph 215" (2024).
- **Crown development (new s293D route): Grenfell Tower CROWN/2026/0000003, 25 Aug 2026: WRITTEN as CROWN-2026-0000003.** Decided by an appointed person under the 2026 NPPF, without re-consulting.
- **Section 62A** (applications made direct to PINS in designated LPAs): none decided since 17 Aug. Pending:
  - S62A/2026/0159 Maple House, Potters Bar: 293 homes, hearing, target 5 Nov 2026;
  - S62A/2026/0157 Laugherne Villa, Martley (Malvern Hills): target 10 Dec 2026.
- **Section 35 directions** (data centres at Dartford, Ampthill Road Bedford and Wapseys Wood) were issued before the period and are not decisions.

## 2. Non-housing appeals

All cases come from the PINS corpus. Selection: non-householder "Planning" appeals whose description did not mention dwellings, plus adverts and householders that cite 2026 codes. Delegated to three forks by category. Cases written:
- **Energy and minerals:**
  - 6003569 Fawley solar (National Landscape)
  - 6009340 / 6010164 / 6010987 micro battery storage
  - 6002168 Preesall sand and gravel (inquiry)
- **Telecoms:** 6003034, 6010382, 6009085 (transitional), 6003086, 6009866, 6012153, 6009864
- **Town centre and leisure:** 6011516 Ruislip bingo, 6010189 Norbury adult gaming centre, 6009871 Ilford TC3 sequential test
- **Community facilities and pubs (HC6):** 6008083, 6009938, 6011055, 6010035, 6010155, 6003718, 6010739, 6004977
- **Retail and employment:** 6008314 Polegate Aldi, 6010877, 6011101, 6011039
- **Hot food takeaways (HC5):** 6009647, 6010024, 6010883
- **Rural business (E4) and rural conversions:** 6000903, 6008804, 6009443, 6010729, 6014952, 6011256, 6006812, 6010542, 6009817, 6008601, 6008848, 6011209
- **Agricultural:** 6010763, 6010751
- **Advertisements:** 6009587, 6011428, 6010668, 6009003 (12 linked York appeals)
- **Householder:** 6011648, 6012221, 6013310, 6008813, 6012827
- **Enforcement:** none. The only four enforcement letters in the corpus (6006631/6006632 Laughton, 6006749/6006750 Basildon) were on grounds (f)/(g), or had ground (a) barred, and do not engage the Framework.

## 3. Courts

**No High Court or Court of Appeal judgment construing the August 2026 NPPF exists as at 23 Sep 2026.** This is expected: the 6-week s288 window means challenges to post-17 Aug decisions cannot have been heard yet.

Searched Find Case Law (`caselaw.nationalarchives.gov.uk/atom.xml?query=…&from_date=17/8/2026`) for "National Planning Policy Framework", "NPPF", "Planning Policy Framework", "planning permission", "section 288", "Green Belt", "grey belt" and "inspector appeal decision". Planning judgments found since 17 Aug, all on decisions made under the 2024 Framework or on non-NPPF issues:

| Judgment | Date | Subject | Framework engagement |
| --- | --- | --- | --- |
| R (Sam Smith) v South Kesteven [2026] EWHC 2435 (Admin) | 22 Sep | s70C declining to determine a Gypsy site | none on the 2026 NPPF |
| R (McQueen) v Mid Suffolk [2026] EWHC 2398 (Admin) | 18 Sep | neighbourhood plan boundary | none |
| R (Rodmersham PC) v Swale [2026] EWHC 2381 (Admin) | 16 Sep | 41 MW solar farm, late planning obligation | old Framework |
| R (Old Chiswick Protection Society) v Hounslow [2026] EWHC 2278 (Admin) | 14 Sep | heritage | applies 2024 NPPF ¶215 |
| R (Segrue) v Swindon [2026] EWHC 2080 (Admin) | 25 Aug | CIL | none |

Challenges launched (per Planning Geek) that are leads for later passes:
- "wychavon-high-court-challenge" (22 Sep);
- "chalfont-st-peter-green-belt-challenge" (26 Aug; the Epilepsy Society recovered appeal of 29 Jun, a 2024-Framework decision).

The `court` decision_maker value was therefore not needed and was not added.

## 4. Ministerial statements and PINS guidance

- **Minister of State for Housing and Planning (Matthew Pennycook), letter "Creating a clear, rules-based planning system", 17 Aug 2026** (gov.uk, published 18 Aug), to LA leaders and mayors:
  - The decision-making policies "will come into effect from today".
  - Changes after consultation: station "default yes" widened to the top 80 TTWAs by GVA (from 60); curtilage floorspace support; tailored minimum densities; parking flexibility for large retail redevelopment; a strategic-sites category (about 1,500 or more units); local standards; clearer telecoms support including for rail users; strengthened pub and facility safeguards; Protected Landscapes ("major development should be refused other than in exceptional cases").
  - The **2025 HDT results "will be used for the purposes of decision making"**.
  - Statutory consultee reforms: Gardens Trust and Theatres Trust removed as consultees; Sport England narrowed.
  - A companion stakeholder letter was published the same day.
- **No PINS procedural note on applying the new NPPF to live appeals was found** on gov.uk (PINS organisation feed to 23 Sep). Practice seen in the letters: roughly a quarter of inspectors invite comments on the 2026 Framework; others state it makes "no fundamental changes" to the issues and decide without re-consulting (see OBSERVED PATTERNS).
- Related publications, not decisions:
  - PPG collection "updated 23 Sep 2026" (the changes were not examined; a lead);
  - PINS "Use of artificial intelligence in casework evidence" (23 Sep);
  - Local Plan intervention letters: Southend, Tonbridge and Malling (4 Sep), West Northamptonshire (15 Sep);
  - Special Development Order for the Bedford entertainment resort (21 Sep).

## 5. Second pass (coordinator's slice allocation)

Slice: enforcement, "Planning listed building and conservation area" (LBCA), advertisements, commercial (CAS), and non-housing Planning appeals outside the GB and non-GB housing slices. Householder and advertisement appeals get statistics here rather than individual files, except where notable.

The corpus now holds **1,087** letters: 3 decisions issued on 23 Sep after my sweep were added (6011093, 6011283, 6011290). All three are housing or householder, so they belong to other slices. appeals-nongb's range scan (`harvest-log/pins-decided-index.tsv`) found no other ref missing from my sweep.

Code counts below come from a regex over the letter text. Short codes such as P1, P2, HC1 and DM1–DM10 also match local-plan and London Plan policy numbers (e.g. London Plan HC1, "DM2"), so treat those counts as upper bounds. The HE, DP, GB, S, L, CO and TR counts are reliable.

### 5a. LBCA appeals (31 letters): 3 case files written
- **Outcomes:** 24 dismissed, 7 allowed (23% allowed). All 31 mention the Framework.
- **Codes cited:** HE6 21, HE4 11, HE5 4, S3 4, S4 3, S5 3, HE9 2.
- **Written:**
  - **PINS-6006240** Sheldon, Devon, roof solar on a Grade II farmhouse, **allowed**. CC2(2) gave substantial weight to improving the energy efficiency of the existing building, which justified limited harm.
  - **PINS-6011314** Bosbury, Herefordshire, dismissed. CC2(2) was held not engaged by an efficient new extension. S5(1)(c) was passed, but the S5 balance was "substantially outweighed" on heritage plus DP3(3).
  - **PINS-6007221** Hunmanby, North Yorkshire, dismissed. It is a clean template of the new heritage sequence: HE5(2)(c) degree of harm ("low"), then HE6(1) substantial weight "irrespective" of the level of effect, then HE6(3) considerable weight, then HE6(4), then S4 with DP3(3).
- **Not written** (ordinary applications of HE6):
  - 6005229/6005225 Lamberhurst: moderate harm. It slips into "substantial weight I give to the harm" (¶17); HE6(1) attaches substantial weight to conservation, not to harm.
  - 6006260 Horsmonden; 6004605 Latchmore Bank; 6004673/6004675; 6005051 Westminster; 6005981 Bacon's Lane; 6006027; 6006059; 6006162; 6006330; 6006506; 6007266; 6007478; 6007642 (HE6 plus S5 plus N4); 6008490; 6010767; 6010825; 6004393 (kitchen extract, HE6(4)).
  - Allowed with no 2026 codes cited: 6006808, 6007971, 6008290, 6008495, 6008639, 6010310.
  - 6005497 is already in cases/ (appeals-greenbelt).
- **CAS (1):** 6012937 Nottingham shopfront, dismissed, HE1 only. Not notable.
- **Enforcement (4):** see §2. None engages ground (a) or the Framework.

### 5b. Householder appeals (308): statistics only
- **Outcomes:** 110 allowed, 6 allowed in part, 192 dismissed (38% allowed or part-allowed).
- **Framework mentions:** 244 of 308 mention it. 145 cite no 2026 policy code at all; they decide on the local plan, with the Framework as a generic "good design" reference.
- **Codes cited:** DP3 47, HE6 28, GB7 24, S4 24, GB6 18, L2 14, HE4 11, HE9 10, HE5 8, S3 8, S5 7, HE7 7, DM10 8 (PD-rights conditions). About 29 are Green Belt householders; those are appeals-greenbelt's.
- **Patterns:**
  - DP3 is the workhorse. DP3(3) "should be refused … without clear justification" is increasingly cited as the refusal hook, and some inspectors run the S4 "substantially outweighed" test even for householder extensions (6013310, 6011690, 6012259, 6013026, 6009698).
  - L2's new support for extra floorspace within residential curtilages is starting to appear. Three were allowed citing it: 6011690 Watford, 6012259 and 6013026 Basingstoke. It was held not engaged in 6009698, and in 6014215 the appeal was dismissed on outlook without a balance.
  - Under footnote 25, "existing building" means as at 17 Aug 2026 (6011648). This is the most notable householder point and has its own case file.
  - Heritage householders follow the 6007221 template.
- **Individual files already written** (first pass): 6011648, 6012221, 6013310, 6008813, 6012827.

### 5c. Advertisement appeals (82 = 77 commercial + 5): statistics only
- **Outcomes:** 37 allowed, 45 dismissed (45% allowed).
- **Framework mentions:** 74 of 82 mention it. 22 cite no 2026 code.
- **Codes cited:** HE6 25, CO1 12 and S4 12 (almost all BT Street Hub or InLink advert pairs), DP3 8, S3 8, HE4 6, TR4 5, TR6 4.
- **Patterns:**
  - The Advertisement Regulations confine the decision to amenity and public safety. Inspectors split on whether HE6's balancing limbs apply to advertisement consent: held inapplicable in 6009587 and 6011428; HE6(1) "substantial weight" applied in 6009003; HE policies treated as material to amenity in 6010668.
  - Several street-hub advert appeals were wrongly run through S3/S4 (6003086, 6009866).
  - One letter still footnotes the "National Planning Policy Framework (December 2024), paragraph 141" (6011502, 28 Aug).
  - Digital screens on street hubs are dismissed more often than static signs.
- **Individual files already written:** 6009587, 6011428, 6010668, 6009003.

### 5d. Letters that do not cite the 2026 Framework: which Framework they applied, and why

I classified all 1,084 letters in the first sweep by regex, then hand-checked the 2024-only set.

| Class | Letters | Meaning |
| --- | --- | --- |
| 2026 applied | 688 | 2026 codes or explicit "2026 Framework" |
| mixed | 82 | 2026 plus 2024 paragraph numbers; mostly quoting council reasons for refusal or older appeal decisions |
| generic | 170 | "the Framework" with no paragraph or code |
| none | 130 | no mention |
| 2024-only | 14 | 2024 paragraph numbers, no 2026 marker (hand-checked) |

(The coordinator's figure of about 110 comes from a different cut. Mine is 130 with no mention plus about 10 genuinely applying the 2024 text.)

**The 130 with no Framework mention (59 in Aug, 71 in Sep):**
- **45 prior approval / GPDO appeals** (Class Q, MA, AA, etc.; 18 allowed, 27 dismissed). The Framework is legally irrelevant beyond the prior-approval matters, so this is correct practice.
- **41 householder** (15 allowed, 25 dismissed, 1 part). Decided on local plan design and amenity policies alone.
- **31 other Planning appeals.** Mostly small conversions, HMOs, C2 children's homes, flats and small extensions in urban areas, decided on local plan living-conditions and design policies. Two are notable:
  - 6004446 (Ivybridge Aldi, allowed 23 Sep): a retail store decided without citing the Framework at all, despite TC3/TC4 being engaged;
  - 6008247 (St Albans, invalid).
- **7 advertisement, 5 conditions / s73, 1 enforcement** (6006632, notice quashed).

**The genuinely 2024-applied letters after 17 Aug** (hand-checked):
- **Dated 17 Aug**, probably drafted before publication:
  - 6003588 Colchester self-build (2024 ¶58 obligations tests);
  - 6005881 Luton ("great weight … less than substantial");
  - 6011369 Doncaster householder (¶57 conditions tests);
  - 6003318 and 6003486 Bassetlaw (only quoting condition reasons);
  - 6009085 Liverpool mast (2024 ¶¶119–122; case file marked transitional).
- **After 17 Aug, the 2024 text applied with no acknowledgement of the new Framework:**
  - **6003168** Merton householder, 9 Sep (2024 ¶215, "less than substantial");
  - **6009270** Braintree outbuilding, 24 Aug (¶215, and the appellant relied on ¶11(c)/(d));
  - **6011502** Bradford advert, 28 Aug (footnote to "NPPF (December 2024), paragraph 141");
  - **6007519** Surrey Heath nursery, 9 Sep, which says "A revised version of the National Planning Policy Framework (the Framework) was published on 12 December 2024 … I have made my determination against the updated national policy context". It treats the December 2024 Framework as the "updated" one three weeks after it was superseded.
  - These four are potential s288 vulnerabilities (failure to apply current policy), though probably immaterial on their facts.
- **False positives removed on hand-check:** 6006128, 6008739 and 6011736 do apply the 2026 Framework. 6008437 quotes a 2019-era condition but applies the Annex B settlement definition.

**Heritage terminology** (399 letters touching listed buildings or conservation areas):
- The 2024 label "less than substantial harm" still appears in 50 of them (list in scratch analysis). Some are quotes of council reasons, but many are the inspector's own finding: 6003168, 6005881, 6009270, 6010391 and several street-hub letters.
- The new HE6(1) "substantial weight to the asset's conservation" appears in 105 of them. The old "great weight" wording appears in 23.
- The shift to the 2026 wording is real but incomplete.

### 5e. Watching for Secretary of State decisions
Re-checked at the end of the session (23 Sep): MHCLG correspondence feed (latest 15 Sep, West Northamptonshire intervention) and the called-in/recovered collection (still last updated 30 Jul 2026). **Still no SoS called-in or recovered decision since 17 Aug.**

### 5f. Urgent Crown Development: MOD Bicester Site A (lead from midlands-lpas)
- **Status: pending, not written.** Application PCU/RARE/C3105/3378843 (Cherwell ref 26/01833/CROWN) by the Home Office, to be decided by the MHCLG Secretary of State under the Urgent Crown Development route (s293B+).
- **Proposal:** temporary change of use of the former defence storage site at Bicester Garrison to non-detained asylum accommodation for up to 1,256 people.
- **Timeline:** validated 2 Sep 2026; representations 7–17 Sep. Cherwell's committee noted its response on 16 Sep.
- As at 23 Sep the gov.uk page (/guidance/urgent-crown-development-application-mod-bicester-site-a) was last updated 4 Sep, with no decision. The Crown/Urgent Crown collection lists only Bicester and Manston (Feb 2026).
- **Not the same scheme as CROWN-2026-0000003** (Grenfell, PINS-led Crown route).
- **Follow-up:** the decision was expected within days of 17 Sep. It would be an SoS decision with case id SOS-PCU-RARE-C3105-3378843. Council assessment: https://modgov.cherwell.gov.uk/documents/s64298/2601833CROWN%20MOD%20Bicester%20Site%20A%20Committee%20Report%20Appendix%201.pdf

## PENDING SECRETARY OF STATE / CROWN DECISIONS (for follow-up agents)

None of these was decided as at 23 Sep 2026. Recheck the gov.uk "called-in decisions and recovered appeals" collection (content API, last updated 30 Jul 2026), the Crown Development collection, and the PINS s62A pages.

| Case | Route | Scheme | Status at 23 Sep 2026 | Where to check | Case id when written |
| --- | --- | --- | --- | --- | --- |
| **Albrighton**, Patshull Road, Shropshire | Recovered s78 appeal (recovery direction 16 Sep 2026; reasons: novel issues and significant GB development) | Up to 800 homes, 80-bed care home, secondary school, local centre (Boningale Developments) | Inquiry closes 9 Oct 2026, then inspector's report, then SoS; decision likely 2027 | gov.uk recovered-appeals collection; Shropshire newsroom; planninggeek.co.uk/2026/albrighton-appeal/ | SOS-APP-<LPA code>-W-<yy>-<ref> (take from the DL) |
| **Croxley Green**, Three Rivers (PINS 6004972) | s78 inquiry (inspector); not known to be recovered | c.600 homes, Green Belt, GB7(1)(g) | Inquiry opened 27 Aug 2026; undecided | appeal-planning-decision.service.gov.uk/comment-planning-appeal/appeals/6004972; Planning Geek croxley-green-appeal | PINS-6004972 (or SOS-... if recovered) |
| **Maple House, Potters Bar** (Hertsmere) | s62A application direct to PINS (SoS) | 293 homes plus 1,742 m² Class E; no affordable housing on viability; council objects on design | Hearing; target decision 5 Nov 2026 | gov.uk /guidance/section-62a-planning-application-s62a20260159-... | S62A-2026-0159 |
| **Laugherne Villa, Martley** (Malvern Hills) | s62A application | Workshop extension plus two Class E(g) buildings | Representations to 15 Oct; target 10 Dec 2026 | gov.uk /guidance/section-62a-planning-application-s62a20260157-... | S62A-2026-0157 |
| **MOD Bicester Site A** (Cherwell 26/01833/CROWN) | Urgent Crown Development, decided by MHCLG SoS | Home Office temporary asylum accommodation for up to 1,256 people | Representations closed 17 Sep; decision was due "within five working days"; not published at 23 Sep | gov.uk /guidance/urgent-crown-development-application-mod-bicester-site-a; Cherwell committee 16 Sep (appendix: modgov.cherwell.gov.uk/documents/s64298/...) | SOS-PCU-RARE-C3105-3378843 |
| **Holocaust Memorial**, Victoria Tower Gardens | Crown / SoS casework (handling arrangements Apr 2026) | Memorial and learning centre | Updated application documents 20 Aug 2026 | gov.uk /guidance/holocaust-memorial-and-learning-centre-updated-planning-application-documents | SOS-... |

Also watch for:
- s288 challenges to the first 2026-Framework decisions, from late Sep 2026 once the 6-week windows close;
- the Wychavon and Chalfont St Peter challenges reported by Planning Geek, which are 2024-Framework decisions.

## Sources and queries that worked

- gov.uk content and search APIs (`/api/content/...`, `/api/search.json?filter_organisations=...&filter_content_store_document_type=correspondence&order=-public_timestamp`). Far better than WebSearch for SoS casework.
- NSIP project pages (national-infrastructure-consenting.planninginspectorate.gov.uk/projects/ENxxxxxx): the decision letter links are in the HTML.
- find-crown-development.planninginspectorate.gov.uk: the documents list is scrapeable and PDFs download directly.
- Planning Geek WordPress REST API (`/wp-json/wp/v2/posts?slug=<slug>`) and `post-sitemap1.xml` with lastmod dates. Gives clean article text and links, including the new-service appeal link.
- ACP case pages (`ViewCase.aspx?caseid=NNNNNNN`) are curl-able and show decision date, outcome and fileids. There is no bulk listing.

## Dead ends

- WebSearch for "September 2026" solar, BESS or data-centre appeals returned mostly 2024–25 material.
- The PINS Casework Database (August 2026 xlsx) ends before the period.
- The new-service `decided-appeals` URL without the prior `appeals?search=` call returns "Sorry, there is a problem".
- Place-name searches return nothing.

## LEADS NOT FOLLOWED

- **Old-style ACP (3xxxxxx) decisions after 17 Aug.** These are not in the corpus, and inquiries in particular are missing. A sweep of ACP caseids is possible but slow. One checked: The George Baldock enforcement APP/X1925/C/26/3378008, decided 11 Aug 2026, so before the period.
- **SoS pending:**
  - Albrighton recovered appeal (decision likely 2027);
  - Croxley Green (6004972, inquiry opened 27 Aug), in case it is recovered;
  - Holocaust Memorial (updated application documents 20 Aug 2026).
- **DCO:** Beacon Fen EN010151 (above) as a possible transitional case. Other DCO decisions from 17 Aug to 23 Sep were not checked beyond gov.uk news (the gov.uk decision feed also showed offshore oil and gas field decisions, Jackdaw and Fotla, which are not TCPA/NPPF).
- **Telecoms street hubs and kiosks** (planning refs): 6010838 Denmark Hill (allowed), 6002960 Reading, 6003400 Newcastle, 6004062 Crawley, 6004449 Hastings, 6006948 BANES, 6007200, 6007360, 6007449, 6007598, 6007715, 6007793, 6007796, 6008154, 6008436, 6008701, 6009241 Liverpool, 6009681, 6009738 Elmbridge, 6009775, 6009776, 6010059, 6010150, 6010180 Kirklees, 6010352, 6010396 Kirklees, 6010433 York, 6010457 and 6010460 Middlesbrough, 6010617 Southampton, 6010808, 6010814, 6010818, 6010844, 6010846, 6010864, 6012915 BCP, 6013695 Exeter. Advert-only pairs: 6009256 York, 6010295 Manchester, 6011686.
- **Energy:** 6010226 Central Bedfordshire EV-charging electrical infrastructure (allowed; W3?).
- **Commercial, read but not written** (little engagement with the Framework): 6010972 Hackney youth club to bar (HC6 not cited), 6004446 Ivybridge Aldi, 6008318 Glastonbury Class E units, 6010644 Sunderland padel.
- **Commercial, screened only:** 6009147 Crawley B8 to B2, 6009413 Great Yarmouth B2 unit (DM4), 6008038 Lambeth HMO to short-term let (TC3), 6010223 Thurrock (E2/P3), 6006656 Teignbridge (E2), 6012542 London outdoor enclosure (E2/TC2), 6010430 Leicester MOT, 6011467 Coventry car wash, 6009069 Birmingham launderette.
- **Green Belt, for appeals-greenbelt:** 6006761 Epping B8 storage (GB7/E3/E4), 6006496 Reigate agricultural buildings (GB7), 6009680 Leeds sports netting (GB7/HE6), 6008989 Epping horses (GB7), 6010078 Calderdale kitchen extension (GB1), plus GB householder refs 6005603, 6008579, 6010603, 6012763.
- **Housing, for appeals-nongb:** 6007705 Churchill garage to 2 homes (HC6(2) excludes garages; 4.38 yrs supply).
- **Agricultural and equestrian (non-GB):** 6003496 Durham arena (allowed), 6010086 Durham livestock building (allowed), 6009974 Dover sheep barn (allowed), 6006078 Cornwall, 6011206 Herefordshire, 6004495 Stroud, 6006824 Wyre, 6010807 North Yorkshire, 6006151 Shropshire agricultural worker mobile home.
- **Rural and other:** 6010228 Mid Suffolk temporary storage (S5/F4/F7), 6008895 King's Lynn mobile home plus business unit (HO11), 6010090 Somerset HPC worker caravan (S5(4)), 6002971 Cornwall open storage.
- **Adverts:** 6005102 and 6008236 Manchester, 6008960 Birmingham LED, 6011801 Hart (HE6/DP3, allowed).
- **Householder:** 6011690 Watford, 6012259 and 6013026 Basingstoke (L2, allowed); 6014215 Windsor; 6009698 Folkestone (L2/L3 not engaged); 6010335 London (HE6(3)/(4)); 6011994 Elmbridge (DP3); 6012494 Horsham (S5/N6, allowed); 6013856 North Yorkshire (DP3 with S5(2)).
- **Planning Geek posts** (17 Aug–23 Sep) not processed for my slice: bexley-care-home-appeal, dunstable-care-home, wagtails-farm-rural-worker-home, rural-worker-dwelling-livery, exmoor-cabin-agricultural-tie, warwick-caravan-enforcement, grey-belt-caravan-enforcement, forest-house-redbridge-enforcement-appeal, farm-cabin-residential-use-enforcement, mobile-stable-skids-appeal, shipping-container-appeal-rayleigh, highway-impact-test, hawkwell-planning-inquiry, ivinghoe-appeal. Most are in the corpus under their 600xxxx refs.
- **Old-style YAML errors** in other agents' files (as of the last index run): PINS-6004496, 6004909, 6005119, 6006893, 6008264, 6011253, threerivers-26-0520-FUL. PINS-6010021 is missing determinative_policies.

## OBSERVED PATTERNS

1. **No SoS or court authority yet.** Five weeks in, there is no called-in or recovered SoS decision and no judgment construing the 2026 NPPF. The only SoS planning decisions (two DCOs) keep the 2024 NPPF (SOS-EN020032 DL ¶4.2) or overlook the new one entirely (Beacon Fen DL ¶4.3). For now, inspector letters are the whole body of authority.
2. **The switch is treated as low-impact.** A large minority of inspectors decide without re-consulting because the new Framework makes "no fundamental/material changes" on their issues: PINS-6010164, 6009864, 6002168, 6010542, 6010763, 6010751, 6009003, 6011428, 6008083, 6011039, 6009647, 6010024, CROWN-2026-0000003. Old wording keeps slipping through, e.g. "significantly and demonstrably outweighed" (6002168) and "significantly outweighed" (6011209). One letter dated 17 Aug still cites 2024 ¶¶119–122 (6009085).
3. **S4(2) and S5(2) work as refusal triggers.** A breach of a national policy that says a proposal "should be refused" (DP3(3), TR6(4), TC3(4), HC5) is being read as the S4(2)/S5(2) circumstance whose adverse effects "substantially outweigh". That defeats even substantial-weight benefits (E2, CO1): 6003086, 6009866, 6011101, 6009871, 6010024, 6011256, 6008848, 6011209, 6011648. TR6(4) is called "unambiguous" and defeated a minerals landbank shortfall (6002168 ¶102, ¶191).
4. **"Substantial weight" is now routine.** It is given to employment (E2(1)(a)), telecoms (CO1) and renewables (W3), however modest the scheme (6010877, 6011101, 6006812, 6008804, 6003086, 6009866, 6009340). This substantial weight rarely decides the case; the design, transport or evidence failing does. W3 is applied inconsistently to identical micro battery units: substantial weight at 6009340, little weight at 6010987, not cited at 6010164.
5. **S5(1)(b) "shown to be necessary" and TR3 are strict for rural tourism and business.** Glamping, wigwams and holiday lets fail without a location-specific case and on unlit, footway-less lanes with thin buses (6000903, 6008804, 6009443, 6010729). E4's recognition of poor public transport has rescued none of them. The exception is a use functionally tied to an adjacent business (6014952). The same route-quality facts drive the housing GB7(1)(g)(iii) failures.
6. **HC6 (pubs and community facilities).** The 12-month marketing yardstick is read strictly (6008083, 6003718) or as "evidential rather than determinative" (6011055, 6010035); 15 months with a pause passed (6009938). HC6(1)(c) (equivalent provision nearby) is the easy route (6010155, 6003718, 6010739).
7. **Annex A ¶2 is being used to discount out-of-date local policy.** It was used against pre-Class E frontage controls (6011516: "very limited weight") and over-restrictive rural conversion or extension policies (6008848, 6011648). It was not raised where it could have been (6009647). Spatial strategies consistent with TR3 kept full weight (6008804).
8. **Footnote 25 baseline.** For S5(1)(c), the "existing building" is the building as it stood on 17 Aug 2026, so earlier extensions drop out of the proportionality sum: 22.4% instead of 70.6% (6011648). This may be transferable to GB7(1)(c) arguments.
9. **The Annex B "settlement" definition widens S4.** Land outside a local development boundary but within a built-up area was treated as within a settlement, so S4 applied rather than S5 (6008314, Polegate Aldi).
10. **Evidence gaps decide many non-housing appeals**: missing acoustic, transport, heritage, air-quality or species evidence that inspectors will not leave to conditions (6011516, 6011101, 6011039, 6010883, 6004977). For telecoms, the CO2 alternative-sites evidence is decisive (won at 6010382 ¶20; lost at 6009085, 6003034, 6009866).
11. **Protected landscapes.** Small solar in a National Landscape was allowed under N4(1) once agreed not to be major development. The "further the purpose" duty was treated as weight, not a veto (6003569). Green Belt substations won VSC on the renewable need plus the absence of any non-Green Belt alternative (SOS-EN020032).
12. **Heritage in advert appeals is inconsistent.** Some inspectors hold HE6's balancing limbs inapplicable to advertisement consent (6009587, 6011428); others apply HE6's "substantial weight" (6009003) or treat HE policies as material to amenity (6010668).
13. **CC2(2) is emerging as a heritage-balance tipper, narrowly construed.** It gives substantial weight to energy-efficiency works on the existing listed building (roof solar allowed, PINS-6006240). It does not cover efficient new extensions (PINS-6011314 ¶36, PINS-6007221 ¶38).
14. **The 2026 heritage sequence is replacing "less than substantial".** Many letters now use HE5(2)(c) degree of harm, then HE6(1) substantial weight "irrespective" of effect, then HE6(3), then HE6(4) (PINS-6007221 ¶33-35). About 50 of the 399 heritage letters still use the old label, and 23 still say "great weight". Low harm now routinely defeats modest private benefits.
15. **A handful of post-17 Aug letters applied the 2024 text with no acknowledgement of the new Framework** (6003168, 6009270, 6011502, 6007519). The prior-approval and small-urban-scheme letters (130) simply do not engage the Framework.

## 6. Wave 2: slice rest-0 (119 refs)

Processed by three forks of sos-and-other, split 40/40/39. Every fork ran the grep-before-write check.

**Result: 113 case files written (22 tier 1, 91 tier 2). 6 refs not written:**
- **6002834 and 6015634 are unusable.** They are PINS test records ("Test address" / "System Test Borough Council"; 6015634 is an internal test appeal 6062115), not decisions. **Remove both from the corpus lists.**
- **6008486, 6008494, 6009101 and 6009569 are duplicates.** Each is the "Appeal A" half of a joint letter already written by corpus-rest-1 under its Appeal B ref (6008490, 6008495, 6009103 and 6009573 respectively). Linked A/B pairs are split across slices in several places. Other pairs cross-linked via `related:` rather than written twice: 6003318, 6005229, 6005981, 6006260, 6006808, 6007478 and 6004673. The advert halves 6007364, 6007445 and 6007600 are in no slice.

The index builder shows no WARN lines for these files. The only WARN left in the store is threerivers-26-0520-FUL.md (appeals-nongb's, not mine).

### Coverage table (ref | tier | outcome | determinative codes | harvested_by)

| ref | tier | outcome | determinative codes | harvested_by |
| --- | --- | --- | --- | --- |
| 6002628 | 2 | dismissed | GPDO Sch2 Pt3 Class MA | sos-and-other |
| 6002834 | — | — | not written (see notes) | — |
| 6003286 | 2 | dismissed | GPDO Sch2 Pt3 Class Q(b), GPDO Q.1(i) | sos-and-other |
| 6003486 | 2 | dismissed | DM6 | sos-and-other |
| 6003738 | 2 | allowed | London Plan D6 | sos-and-other |
| 6004446 | 2 | allowed | JLP DEV1 | sos-and-other |
| 6004592 | 1 | dismissed | S4, N3 | sos-and-other |
| 6004675 | 1 | dismissed | HE6(1), HE6(3), HE6(4) | sos-and-other |
| 6005067 | 2 | dismissed | HE6(1), HE6(4), DM6 | sos-and-other |
| 6005225 | 2 | dismissed | HE6(1), HE4(2), HE6(4) | sos-and-other |
| 6005461 | 1 | dismissed | TR4(1)(e), P3(2)(d) | sos-and-other |
| 6005788 | 2 | dismissed | HE6(4) | sos-and-other |
| 6005855 | 2 | dismissed | Wandsworth LP29 | sos-and-other |
| 6005980 | 1 | dismissed | HE4(2), HE6(1), HE6(3), HE6(4) | sos-and-other |
| 6006002 | 2 | allowed | DP3, P3 | sos-and-other |
| 6006059 | 1 | dismissed | HE6(1), HE6(4), HE4(2), CC2(2) | sos-and-other |
| 6006181 | 2 | allowed | Cornwall LP Policy 7, DM10 | sos-and-other |
| 6006259 | 2 | dismissed | HE6(1), HE4(2), HE6(4) | sos-and-other |
| 6006330 | 2 | dismissed | HE6(1), HE6(4), HE5(1) | sos-and-other |
| 6006506 | 1 | dismissed | HE6(1), HE6(5) | sos-and-other |
| 6006727 | 2 | dismissed | Waltham Forest LP Policy 53, Waltham Forest LP Policy 57 | sos-and-other |
| 6006806 | 2 | allowed | DM6 | sos-and-other |
| 6006824 | 2 | dismissed | GPDO Sch2 Pt6 Class A A.2 | sos-and-other |
| 6006932 | 2 | allowed | GPDO Sch2 Pt3 para W | sos-and-other |
| 6006959 | 1 | dismissed | F4(1) | sos-and-other |
| 6007096 | 2 | allowed | DM5, DM6 | sos-and-other |
| 6007154 | 2 | dismissed | St Albans LP Policy 69, St Albans LP Policy 70 | sos-and-other |
| 6007188 | 1 | dismissed | HE7(3) | sos-and-other |
| 6007231 | 2 | dismissed | Lichfield LPS Core Policy 5, Lichfield LPS ST1 | sos-and-other |
| 6007314 | 1 | dismissed | N4(1), N3, Transitional(2) | sos-and-other |
| 6007360 | 2 | dismissed | HE6(4), CO1 | sos-and-other |
| 6007449 | 2 | allowed | HE4 | sos-and-other |
| 6007475 | 2 | dismissed | Islington DMP H2 | sos-and-other |
| 6007479 | 2 | dismissed | HE6(4) | sos-and-other |
| 6007541 | 1 | dismissed | Transitional(2), L2(1)(d)(i), HE6(4) | sos-and-other |
| 6007598 | 2 | dismissed | HE6(4), CO1 | sos-and-other |
| 6007662 | 2 | dismissed | DP3 | sos-and-other |
| 6007717 | 2 | dismissed | GPDO Q.1(j) | sos-and-other |
| 6007779 | 1 | dismissed | S4, L2(1)(d)(i), HE6(4), N3 | sos-and-other |
| 6007846 | 2 | allowed | Westminster City Plan Policy 33 | sos-and-other |
| 6007907 | 2 | allowed | DM6 | sos-and-other |
| 6008014 | 2 | dismissed | GPDO Sch2 Pt2 Class B (Article 4), TCPA s336(1) | sos-and-other |
| 6008051 | 1 | dismissed | HE6, HE4(2), CO1 | sos-and-other |
| 6008171 | 2 | allowed | N2, DP3 | sos-and-other |
| 6008234 | 2 | dismissed | s38(6), DP3 | sos-and-other |
| 6008275 | 2 | dismissed | TCPA s91 (lapse of permission) | sos-and-other |
| 6008318 | 2 | allowed | s38(6), HE6 | sos-and-other |
| 6008362 | 2 | dismissed | s38(6) | sos-and-other |
| 6008441 | 2 | allowed | P3, DM6 | sos-and-other |
| 6008486 | — | — | not written (see notes) | — |
| 6008494 | — | — | not written (see notes) | — |
| 6008534 | 1 | dismissed | S4, L2, DP3, P3 | sos-and-other |
| 6008562 | 1 | dismissed | HE9, HE6(1), HE6(4), HE4(2) | sos-and-other |
| 6008624 | 2 | dismissed | TCPA s55(2)(a), TCPA s73A | sos-and-other |
| 6008669 | 1 | dismissed | HE6(1), HE6(4), HE4(2) | sos-and-other |
| 6008719 | 2 | allowed | s38(6) | sos-and-other |
| 6008738 | 2 | allowed | s38(6) | sos-and-other |
| 6008787 | 2 | dismissed | GPDO Sch2 Pt20 Class AA.2(1)(e) | sos-and-other |
| 6008878 | 2 | allowed | s38(6), DM10 | sos-and-other |
| 6008914 | 2 | allowed | s38(6) | sos-and-other |
| 6009022 | 1 | allowed | HO7, HE6, HE7(2) | sos-and-other |
| 6009062 | 2 | allowed | TR6, GPDO Sch2 Pt3 Class Q.2(1)(a),(f) | sos-and-other |
| 6009101 | — | — | not written (see notes) | — |
| 6009126 | 2 | dismissed | s38(6), P5 | sos-and-other |
| 6009133 | 2 | allowed | s38(6) | sos-and-other |
| 6009167 | 2 | allowed | s38(6) | sos-and-other |
| 6009207 | 2 | dismissed | s38(6), DP3, TR6 | sos-and-other |
| 6009270 | 1 | dismissed | s38(6), HE6(4) | sos-and-other |
| 6009328 | 2 | dismissed | GPDO Sch2 Pt3 Class MA.2(2)(d), P3 | sos-and-other |
| 6009412 | 2 | dismissed | GPDO Sch2 Pt3 Class MA | sos-and-other |
| 6009460 | 2 | allowed | s38(6), DP3 | sos-and-other |
| 6009498 | 2 | dismissed | P3(1), P3(2)(b), P3(2)(d), P3(2)(e), DP3(2)(a) | sos-and-other |
| 6009569 | — | — | not written (see notes) | — |
| 6009586 | 2 | dismissed | s38(6) | sos-and-other |
| 6009643 | 2 | dismissed | s38(6) | sos-and-other |
| 6009677 | 1 | allowed | DM6, N4, P3 | sos-and-other |
| 6009737 | 2 | dismissed | s38(6), TR6 | sos-and-other |
| 6009762 | 2 | allowed | HE9 | sos-and-other |
| 6009775 | 1 | dismissed | HE6(4), P5 | sos-and-other |
| 6009894 | 2 | allowed | GPDO Sch2 Pt3 Class Q.1(j) | sos-and-other |
| 6009942 | 2 | dismissed | TCPA Sch 7A (BNG) | sos-and-other |
| 6009974 | 2 | allowed | GPDO Sch 2 Pt 6 Class A | sos-and-other |
| 6010059 | 2 | dismissed | HE6(4), P5 | sos-and-other |
| 6010107 | 2 | dismissed | BDLP DMH5 | sos-and-other |
| 6010167 | 2 | dismissed | GPDO Sch 2 Pt 3 Class MA MA.2(2)(c), MA.2(2)(d) | sos-and-other |
| 6010196 | 1 | dismissed | L3(4), L3(2)(b), HO7 | sos-and-other |
| 6010271 | 2 | dismissed | DP3, S4 | sos-and-other |
| 6010315 | 2 | allowed | HE4, HE6 | sos-and-other |
| 6010378 | 2 | dismissed | F7 | sos-and-other |
| 6010426 | 2 | dismissed | TR6(4) | sos-and-other |
| 6010433 | 2 | dismissed | P5, TR6 | sos-and-other |
| 6010492 | 2 | allowed | Barnet Local Plan CDH01 | sos-and-other |
| 6010529 | 2 | dismissed | Haringey DPD DM16 | sos-and-other |
| 6010568 | 2 | dismissed | DP3 | sos-and-other |
| 6010623 | 2 | allowed | Liverpool LP H10 | sos-and-other |
| 6010672 | 2 | dismissed | Bradford CS DS1, Bradford CS TR2 | sos-and-other |
| 6010758 | 2 | dismissed | S4, DP3 | sos-and-other |
| 6010787 | 2 | allowed | TR8 | sos-and-other |
| 6010814 | 2 | allowed | HE6, S4 | sos-and-other |
| 6010832 | 2 | dismissed | Bexley LP DP11 | sos-and-other |
| 6010846 | 1 | dismissed | HE6(4), CO1, TR4 | sos-and-other |
| 6010865 | 2 | dismissed | HE6(4) | sos-and-other |
| 6010903 | 2 | allowed | Barnet LP CDH01 | sos-and-other |
| 6010944 | 2 | dismissed | S4, E2 | sos-and-other |
| 6010980 | 2 | dismissed | DP3 | sos-and-other |
| 6011023 | 2 | dismissed | Coventry HMO DPD HMO2 | sos-and-other |
| 6011052 | 2 | dismissed | DP3, Middlesbrough CS DC1 | sos-and-other |
| 6011095 | 2 | dismissed | Cherwell saved C8, DP3 | sos-and-other |
| 6011224 | 2 | allowed | L2(1)(ii) | sos-and-other |
| 6011381 | 2 | allowed | HO1, Newham LP H3, Newham LP H4 | sos-and-other |
| 6011432 | 2 | allowed | HO1, Newham LP H3 | sos-and-other |
| 6011472 | 2 | allowed | Bradford CS DS1 | sos-and-other |
| 6011645 | 2 | dismissed | DP3 | sos-and-other |
| 6011775 | 2 | dismissed | Habitats Regs reg 63(5) | sos-and-other |
| 6011901 | 2 | dismissed | Kingston CS DM8, Kingston CS DM10 | sos-and-other |
| 6012025 | 2 | dismissed | DP3 | sos-and-other |
| 6012252 | 2 | allowed | DP3, HE6 | sos-and-other |
| 6012775 | 1 | split | HE6, CC2(2) | sos-and-other |
| 6015634 | — | — | not written (see notes) | — |

### rest-0 observed patterns
- **Heritage letters follow the 2026 HE6 sequence, but old wording persists.** The sequence is HE6(1) substantial weight "irrespective" of the level of effect, then HE6(3), then HE6(4) (PINS-6004675, 6005980, 6006059, 6008562, 6008669). Several still say "less than substantial" or "great weight" while citing HE6 (PINS-6005067, 6007479, 6007541, 6007779). Two give "substantial weight" to the *harm* (PINS-6005225, 6006259).
  - One stringent outlier: substantial harm, and the HE6(5) refusal test, for a single-storey rear extension (PINS-6006506).
- **CC2(2) "substantial weight" to energy efficiency is conditional in practice.** It is cut to limited where the saving is unquantified or a less harmful alternative exists (PINS-6012775 uPVC windows; PINS-6008669; PINS-6008562; PINS-6006059: CC2(2) "does not disapply other parts of the Framework"). With PINS-6006240 (allowed) and PINS-6011314 (extension excluded), the reading is that CC2(2) wins only for real, quantified improvements to the existing building that cannot be achieved less harmfully.
- **L2 and L3 have teeth both ways.** L2 support for upward extensions, homes above shops or homes in gardens is "not unqualified" and carries its own street-scene and heritage criteria (PINS-6008534 ¶13, 6007541, 6007779). L3(4) "should be refused" defeated a low-density edge-of-village scheme with permission in principle, even without character harm (PINS-6010196).
- **The "materially inconsistent, so very limited weight" transitional argument (Transitional(2)) failed.** Local heritage, height, tree and habitat policies were held to track the Framework and kept full or significant weight (PINS-6007541, 6007314).
- **Much of this slice is decided plan-led under s38(6).** The Framework is cited in passing or not at all (HMOs, children's homes, prior approvals, minor amenity). Where the S4 balance is run, it is sometimes on trivial schemes (PINS-6010758 wall, 6010271 infill), and hybrid wording such as "substantially and demonstrably outweigh" appears (PINS-6010944).
- **Letters dated 17–24 Aug still applying the 2024 paragraph numbers:** PINS-6004592, 6005788, 6007154, 6003486, 6009126, 6009270, 6009775, 6010059, 6010426 and 6010623. These are tagged transitional.
- **Evidence gaps and missing obligations are fatal and not curable by condition:**
  - FRA in Flood Zone 3 (PINS-6006959);
  - tree root-protection feasibility (PINS-6004592, 6007779, 6007314);
  - fabric or window surveys (PINS-6006059, 6006330);
  - an expired bat survey;
  - no self-build obligation, so no BNG exemption (PINS-6009942);
  - no heathland mitigation, so habitats reg 63(5) applied (PINS-6011775).
- **BNG transition.** The 6 Aug 2026 regulations removed the self-build exemption and added a 0.2 ha small-site exemption (PINS-6009460 ¶13). Pre-6 Aug applications keep the old exemption (PINS-6008441 ¶22).
- **Low supply rarely rescued small housing schemes here.** Supplies of 1.3, 2.53 and 2.55 years were outweighed by tree, National Landscape, habitat or heritage harm (PINS-6004592, 6007314, 6007779).
