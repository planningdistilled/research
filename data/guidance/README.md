# Public guidance on applying the August 2026 NPPF: research corpus

**Snapshot date: 2 October 2026.** Everything here reflects what was public and retrievable on that day. The National Planning Policy Framework (NPPF) was published on 17 August 2026, so the corpus covers its first six weeks plus the consultation period before it (December 2025 to March 2026). Expect it to date quickly: the Planning Advisory Service (PAS) roadshows, the promised Planning Practice Guidance (PPG) updates and the first court rulings on the new tests were all still to come.

## What the corpus is

A collection of 330 sources that tell someone how to read or apply the August 2026 NPPF, or that comment on it. One Markdown file per source sits in [`corpus/`](corpus/). Each file has:

- front matter: slug, title, URL, publisher, publisher type, date, audience, whether it is training or briefing material (`is_training`), whether it is about the December 2025 draft rather than the final text (`about_draft`), where the local copy is, and how it was verified;
- a plain-English summary;
- "What it tells officers/decision-makers to do";
- "Positions against our propositions": a stance (agrees, qualifies, disagrees, silent, not applicable) on each of our nine propositions, with a verbatim quote and its location;
- "Leads": things worth following up.

Local copies of the source text (`.txt`, plus the original `.html` or `.pdf` where it could be saved) are in `data/open-sources/guidance-ogl/` (MHCLG and Planning Inspectorate pages) and the private sources repo's `guidance/` (other publishers), named by slug. The Framework itself (PDF, text and Markdown edition) is the canonical copy in `data/open-sources/nppf/`, cited as `open:nppf/…`, not a `guidance-ogl/` copy.

The propositions the corpus is coded against come from our own analysis of appeal and council decisions in [`../nppf-2026-decisions/analysis/patterns.md`](../nppf-2026-decisions/analysis/patterns.md) and [`settlement-hierarchy-and-service-centres.md`](../nppf-2026-decisions/analysis/settlement-hierarchy-and-service-centres.md):

| ID | Proposition (short form) |
| --- | --- |
| SH1 | Local settlement-hierarchy tiers ("service village", "Key Service Centre" and so on) carry no standalone NPPF weight. |
| SH2 | A village washed over by the Green Belt is not an NPPF "settlement" under Annex B, so the route is the Green Belt one, not S4. |
| TR | On TR3 and GB7(1)(g)(iii), the quality of the walking route decides, not distance. Walking in the carriageway is the most reliable fail fact. |
| S5 | Outside settlements the S5(1) category is the whole case; S5(4) is almost always fatal; S5(1)(j) "physically well-related" has competing readings. |
| SUP | A housing land supply shortfall opens the gate but never decides the case. (Revised 2 Oct 2026: "rarely decides the case on its own"; see Aston Clinton 6008253.) |
| GB | Grey belt is usually won at a village edge; once inappropriate, supply has never produced very special circumstances (VSC) at appeal; passing GB7 is not approval. |
| A2 | Annex A paragraph 2 cuts only the offending clause; heritage, design, access and spatial-preference policies keep full weight. (Revised 2 Oct 2026: spatial restrictions usually lose weight where the scheme meets an S5(1) category; heritage, design, amenity and access keep it. See `patterns.md` item 9.) |
| DIV | On the same tests, councils pass what inspectors fail. |
| METH | Our method: Planning Inspectorate (PINS) and Secretary of State decision letters are the main evidence of how the Framework is applied; we code each finding and derive outcome rates and decision routes. |

The comparison with our method is in [`analysis/guidance-vs-our-method.md`](analysis/guidance-vs-our-method.md).

## How it was built

1. **Discovery: eight sweeps by source type.** Separate agents searched for (1) official material (Ministry of Housing, Communities and Local Government (MHCLG), PINS, Parliament); (2) local planning authority (LPA) training and member briefings; (3) barristers' chambers; (4) law firms; (5) planning consultancies; (6) campaign groups and sector bodies; (7) press and independent commentary; (8) targeted searches on our specific tests (Annex B settlement, S5(1)(j), TR3, GB7, Annex A). Several sweeps ran out of the session's shared web-search budget (200 calls) after 15 to 30 queries each, which is the main reason for the gaps listed below.
2. **Batch reading.** Each source was fetched (curl first, then WebFetch, then the Internet Archive or a reader proxy where blocked), saved locally, converted to text and read in full. Readers wrote the corpus file and coded a stance for every proposition the source touches, with a verbatim quote.
3. **Adversarial verification of every disagreement or qualification.** Every stance coded "disagrees" or "qualifies" (about 211 codings) went to a second agent told to try to knock it down: check the quote was verbatim against the local text (with `grep -F`, allowing for line breaks), read it in context, and decide whether the source really takes a position against us on the same test under the final August 2026 text. Only 21 held. About 190 were recoded, mostly to "silent" (the source only restates policy, or is about the December 2025 draft, or is about a different test such as the station "reasonable walking distance") and some to "agrees". One quote (CPRE consultation summary) turned out not to be verbatim and was corrected. The verifiers edited the "Positions" bullets in the corpus files, so the files show the post-verification coding.

Three cautions about the coding:

- "Agrees" mostly means a source restates the Framework in a way consistent with our reading. Very few sources looked at decisions, so agreement is usually agreement with the policy text, not with our empirical findings.
- Many sources are the Framework itself or MHCLG documents. They are coded because they set the baseline, not because they are independent support.
- A few sources are duplicates (Cornerstone web and PDF versions; Burges Salmon and its Local Government Lawyer republication; two Livedin pages; two listings of the same Landmark webinar). They are counted separately in the tables.

## Counts

### By publisher type and verification status

| Publisher type | Sources | Local text | WebFetch only | Not retrieved | Training or briefing |
| --- | --- | --- | --- | --- | --- |
| Consultancy (incl. architects, rural agents, data firms) | 70 | 60 | 5 | 5 | 0 |
| Government (MHCLG, Parliament, Historic England, PAS pages) | 57 | 54 | 0 | 3 | 8 |
| Barristers' chambers | 35 | 24 | 11 | 0 | 3 |
| Law firm | 35 | 31 | 0 | 4 | 0 |
| Independent (bloggers, tools, podcasts) | 33 | 33 | 0 | 0 | 0 |
| Press | 30 | 18 | 0 | 12 | 1 |
| Campaign | 21 | 13 | 8 | 0 | 0 |
| Sector body (LGA, NALC, SLCC, HBF, NFU, CCN, CIHT) | 18 | 17 | 0 | 1 | 1 |
| Local planning authority | 12 | 11 | 0 | 1 | 10 |
| Training body (PAS, RTPI, SLCC, Planning Jungle, MBL) | 10 | 7 | 0 | 3 | 9 |
| Planning Inspectorate | 9 | 9 | 0 | 0 | 5 |
| **Total** | **330** | **277** | **24** | **29** | **37** |

"Local text" means the source text is saved in `data/open-sources/guidance-ogl/` (MHCLG and Planning Inspectorate pages) and the private sources repo's `guidance/` (other publishers) and quotes were machine-checked against it. "WebFetch only" means the site blocked direct download; the text was read through WebFetch and quotes were checked against that rendering, not a saved copy. "Not retrieved" means nothing was read and no stance was coded.

93 sources are about the December 2025 draft, not the final text. 37 are training or briefing material (`is_training: true`).

### Stances after verification (number of sources)

| Proposition | Agrees | Qualifies | Disagrees | Silent or not applicable |
| --- | --- | --- | --- | --- |
| SH1 | 17 | 0 | 0 | 1 |
| SH2 | 17 | 1 | 0 | 9 |
| TR | 21 | 3 | 0 | 29 |
| S5 | 60 | 9 | 0 | 18 |
| SUP | 53 | 4 | 0 | 14 |
| GB | 54 | 2 | 0 | 12 |
| A2 | 28 | 10 | 3 | 33 |
| DIV | 4 | 2 | 0 | 13 |
| METH | 33 | 4 | 0 | 10 |

"Silent" here counts only sources with an explicit silent or not-applicable bullet for that proposition; sources that never mention it are not counted. The table has 38 qualifying and 3 disagreeing codings. 21 of the 41 were confirmed as genuine positions by the adversarial check and are listed in the analysis file. The other 20 are softer readings: the verifier downgraded a claimed disagreement to "qualifies" (for example a lobby group's prediction, or loose shorthand that leans against us) without finding a real contrary reading of the same test.

## Not retrieved and gaps

**Sources found but not read (29).** Mostly paywalls or Cloudflare blocks on direct download and WebFetch:

- Trade press: *Planning* (planningresource.co.uk: the 600-home and 249-home S5(1)(j) appeal reports, the S4 presumption piece, the Compass appeal database), *The Planner* (75% of major grey belt appeals approved; nature; plan-led concerns; CPRE warning), Estates Gazette (two pieces), RIBA Journal, Practical Law, The Lawyer (Shoosmiths).
- Official: House of Commons Library briefing CBP-10964 and its landing page; the Broads Authority committee report.
- Training bodies: Royal Town Planning Institute (RTPI) masterclass calendar and the South West and West Midlands regional event pages; the PAS page on the new plan-making system; RTPI briefing for parliamentarians.
- Others: Legal 500 syndications (Mills & Reeve, Thrings, Hugh James), two Stantec pieces and a Barton Willmore piece, Marrons, Tetlow King.

**Read but thin.** Several chambers webinars (Kings Chambers, 39 Essex Chambers, No5 podcasts) were captured only as event pages or show notes; no recordings or transcripts were coded. The one podcast transcribed (Have We Got Planning News For You, S20 E1) is unedited auto-captions.

**Gaps in coverage.**

- **PINS inspector training.** The Inspector Training Manual (ITM) updated for the 2026 Framework is not public. Freedom of Information (FOI) releases show PINS issued an updated ITM about eight weeks after the December 2024 Framework (February 2025), so a 2026 version is likely due around mid-October 2026. No FOI request for it was found.
- **PAS training on the final text.** The only PAS NPPF events archived are the January to February 2026 roadshows on the draft. The October 2026 roadshows and the November "development inside and outside settlement boundaries" deep dive appear only in search snippets and could not be verified.
- **Council training after 17 August.** Only about 11 council documents were found (the sweep ran out of search budget). Almost all are on the draft. No post-publication planning committee "NPPF update" item from a rural district was found, and nothing from Stratford-on-Avon, Warwick or Rugby.
- **Planning Officers Society.** No note on the 2026 Framework surfaced.
- **Written ministerial statement.** None was found for 17 or 18 August 2026 (Parliament was probably in recess); the Minister's letter of 17 August may be the only ministerial statement.
- **Updated PPG.** As of 2 October the Green Belt, housing supply, rural housing, historic environment and transport PPG pages had not been updated; the government promised settlement-identification, transport and design guidance.
- **Search budget.** Each discovery agent's leads list records searches it planned but could not run. Those leads are collected in the analysis file under "Gaps and next searches".

## Source table

Stance abbreviations: agr = agrees, qual = qualifies, DIS = disagrees. "silent" means no agree/qualify/disagree coding; "not read" means not retrieved. "Draft" means the source is about the December 2025 draft. Sorted by publisher type, then slug.

| Slug | Publisher | Type | Date | Audience | Training? | Draft? | Verification | Stances (after verification) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `civic-voice-nppf-consultation-response` | Civic Voice | campaign | 2026-02-13 | Ministry of Housing, Communities and Local Government (MHCLG); civic s |  | draft | local-text | S5 agr |
| `community-planning-alliance-news` | Community Planning Alliance | campaign | unknown (items dated 12 Jan 20 | local campaign groups, MPs, the public |  |  | local-text | silent |
| `cpre-beds-green-belt-grey-belt` | CPRE Bedfordshire | campaign | 2026-03-06 | public, CPRE supporters |  | draft | local-text | GB agr |
| `cpre-herts-guidance-how-to-respond-nppf` | CPRE Hertfordshire | campaign | 2024-09-17 | public, CPRE supporters |  | draft | local-text | silent |
| `cpre-herts-response-draft-nppf` | CPRE Hertfordshire | campaign | 2026-02-26 | public, CPRE supporters |  | draft | local-text | silent |
| `cpre-kent-grey-belt-policy-countryside` | CPRE Kent | campaign | 2026-04-24 | public, CPRE supporters |  |  | local-text | GB agr; METH agr |
| `cpre-nppf-brownfield-affordable-homes` | CPRE, the countryside charity | campaign | 2023-12-19 | public, supporters, government |  |  | webfetch-only | silent |
| `cpre-nppf-mapping-collective-response` | CPRE, the countryside charity | campaign | 2026-05-13 | public, supporters, government |  | draft | webfetch-only | GB agr |
| `cpre-oxon-proposed-planning-reforms` | CPRE Oxfordshire | campaign | 2026-03-10 | public, CPRE supporters |  | draft | local-text | silent |
| `cpre-responds-summer-2026-nppf` | CPRE, the countryside charity | campaign | 2026-08-17 | public, supporters, government |  |  | webfetch-only | silent |
| `cpre-response-draft-revised-nppf` | CPRE, the countryside charity | campaign | 2025-12-16 | public, supporters, government |  | draft | webfetch-only | GB agr |
| `cpre-summary-nppf-consultation-response` | CPRE, the countryside charity | campaign | 2026-03-12 | public, supporters, government |  | draft | webfetch-only | GB agr; METH agr |
| `cpre-valued-landscapes-warning` | CPRE, the countryside charity | campaign | 2026-06-24 | public, supporters, government |  | draft | webfetch-only | METH agr |
| `dorset-cpre-respond-nppf-consultation` | Dorset CPRE | campaign | 2026-03-03 | public, CPRE supporters |  | draft | local-text | SUP qual |
| `foe-whats-in-new-nppf` | Friends of the Earth | campaign | 2025-11-26 | community campaigners and objectors |  |  | local-text | silent |
| `justspace-nppf-consultation-response` | Just Space | campaign | 2026-03-10 | Ministry of Housing, Communities and Local Government (MHCLG) consulta |  | draft | local-text | silent |
| `lgbc-cpre-green-belt-now-grey-belt` | London Green Belt Council / CPRE | campaign | 2026-04 | public, government, campaigners |  |  | local-text | GB agr; METH agr |
| `rural-roar-green-not-grey` | Rural ROAR (Effingham Parish Council-led campaign) | campaign | 2026-08-26 | parish councils, public, press |  |  | local-text | GB agr; METH agr |
| `tcpa-nppf-hooks-progressive-outcomes-vision` | Town and Country Planning Association (TCPA) | campaign | 2026-08-19 | planners, local authorities, communities |  |  | local-text | TR agr |
| `tcpa-response-proposed-nppf-reforms` | Town and Country Planning Association (TCPA) | campaign | 2025-12-16 | planners, press |  | draft | webfetch-only | silent |
| `wildlife-trusts-response-nppf` | The Wildlife Trusts | campaign | 2018 (inferred; linked PDF dat | government, public |  | draft | webfetch-only | silent |
| `39-essex-new-nppf-webinar-aug-2026` | 39 Essex Chambers | chambers | 2026-08-25 | planning practitioners, including local authority lawyers and officers |  |  | local-text | silent |
| `cornerstone-hgh-draft-nppf-roundtable` | Cornerstone Barristers / hgh Consulting | chambers | 2026-03-02 | development industry |  | draft | local-text | S5 agr |
| `cornerstone-planning-day-2026` | Cornerstone Barristers | chambers | 2026-11-23 | planning specialists, solicitors, consultants, policymakers, local aut |  |  | local-text | METH agr |
| `cornerstone-revised-nppf-rules-based-planning` | Cornerstone Barristers | chambers | 2026-08-19 | planning practitioners (developers, local authorities, consultants) |  |  | local-text | S5 agr; S5 qual; GB agr; A2 agr |
| `cornerstone-revised-nppf-rules-based-planning-web` | Cornerstone Barristers | chambers | 2026-08-20 | planning practitioners (developers, local authorities, consultants) |  |  | local-text | S5 agr; S5 qual; GB agr; A2 agr; A2 qual |
| `cornerstone-unpacking-new-nppf-draft` | Cornerstone Barristers | chambers | 2025-12-16 | planning practitioners |  | draft | local-text | S5 agr |
| `ftb-annual-planning-forum-2026-nppf-special` | Francis Taylor Building (FTB) | chambers | 2026-10-01 | professional and lay clients of chambers (planning practitioners, deve |  |  | local-text | silent |
| `ftb-breakfast-briefing-rules-based-nppf` | Francis Taylor Building (FTB) | chambers | 2026-10-08 | professional clients (planning practitioners, local authority and deve |  |  | webfetch-only | silent |
| `ftb-rhimes-115-homes-basingstoke-appeal` | Francis Taylor Building | chambers | 2026-09-18 | planning practitioners, local planning authorities, prospective client |  |  | webfetch-only | SUP agr |
| `kings-chambers-planning-law-update-sep-2026` | Kings Chambers | chambers | 2026-09-18 | planning practitioners (developers, consultants, local planning author |  |  | webfetch-only | silent |
| `kings-chambers-recording-new-nppf-first-session` | Kings Chambers | chambers | 2026-08-19 | planning practitioners (developers, consultants, local planning author |  |  | webfetch-only | silent |
| `kings-chambers-recording-new-nppf-second-session` | Kings Chambers | chambers | 2026-08-19 | planning practitioners (developers, consultants, local planning author |  |  | webfetch-only | silent |
| `kings-chambers-webinar-new-nppf` | Kings Chambers | chambers | 2026-08-19 | planning practitioners (developers, consultants, local planning author |  |  | webfetch-only | silent |
| `kings-chambers-webinar-new-nppf-second-session` | Kings Chambers | chambers | 2026-08-19 | planning practitioners (developers, consultants, local planning author |  |  | webfetch-only | silent |
| `landmark-appeal-s5-ho13-aston-clinton` | Landmark Chambers | chambers | 2026-09-24 | developers, planning lawyers, consultants |  |  | local-text | S5 agr; S5 qual; SUP qual |
| `landmark-clean-energy-nppf-webinar` | Landmark Chambers (with Town Legal and Third Revolution Proj | chambers | 2026-09-21 | energy developers, local authorities, advisers, high-energy users (fre |  |  | local-text | silent |
| `landmark-exploring-new-nppf-draft-webinar` | Landmark Chambers | chambers | 2026-01-12 | planning practitioners, developers, local authorities (CPD webinar) |  | draft | local-text | silent |
| `landmark-government-publishes-nppf-2026` | Landmark Chambers | chambers | 2026-08-17 | planning practitioners, developers, local authorities |  |  | local-text | silent |
| `landmark-green-belt-appeal-full-costs` | Landmark Chambers | chambers | 2026-09-07 | developers, planning lawyers |  |  | local-text | silent |
| `landmark-land-use-conference-2026` | Landmark Chambers | chambers | 2026-10-14 | built-environment lawyers and professionals; limited free places for l |  |  | local-text | silent |
| `landmark-lpdf-exploring-new-nppf-draft-slides` | Landmark Chambers / LPDF | chambers | 2026-01-12 | planning practitioners, developers, local authorities |  | draft | local-text | S5 agr |
| `landmark-nppf-2026-initial-look-webinar` | Landmark Chambers | chambers | 2026-09-03 | planning practitioners, including local planning authority (LPA) offic | yes |  | local-text | silent |
| `landmark-nppf-2026-webinar-initial-look-page` | Landmark Chambers | chambers | 2026-09-04 | Planning lawyers, consultants, local planning authority (LPA) officers |  |  | local-text | silent |
| `landmark-nppf-2026-webinar-initial-look-slides` | Landmark Chambers | chambers | 2026-09-03 | Planning lawyers, consultants, local planning authority (LPA) officers |  |  | local-text | S5 agr; GB agr; A2 agr; A2 qual; DIV agr |
| `landmark-old-chiswick-quashed-inconsistency` | Landmark Chambers | chambers | 2026-09-14 | planning lawyers, local planning authorities, objectors |  |  | local-text | METH agr |
| `landmark-placemaking-resource` | Landmark Chambers | chambers | 2026-09-28 | developers, local planning authorities, advisers |  |  | local-text | silent |
| `landmark-placemaking-slides` | Landmark Chambers | chambers | 2026-09-24 | developers, local planning authorities, advisers (free CPD webinar) |  |  | local-text | S5 agr; SUP agr; A2 DIS; METH agr |
| `landmark-placemaking-webinar-event` | Landmark Chambers | chambers | 2026-09-24 | developers, local planning authorities, other stakeholders (free, 1.5  |  |  | local-text | silent |
| `lgl-39-essex-planning-week-mar-2026` | Local Government Lawyer (39 Essex Chambers event) | chambers | 2026-03-03 | local authority lawyers and planning practitioners |  | draft | local-text | silent |
| `lgl-cornerstone-roundtable-plan-making` | Local Government Lawyer (Cornerstone event) | chambers | 2026-02-09 | local authority lawyers and officers | yes | draft | local-text | silent |
| `lgl-landmark-nppf-2026-initial-look-webinar` | Local Government Lawyer / Landmark Chambers | chambers | 2026-09-03 | local government lawyers, planning practitioners | yes |  | local-text | silent |
| `no5-bristol-planning-seminar-2026` | No5 Barristers' Chambers | chambers | 2026-09-21 | planning practitioners, developers and local authorities |  |  | webfetch-only | silent |
| `no5-podcast-ep57-nppf-flashpoints-veteran-trees` | No5 Barristers' Chambers | chambers | 2026-03-03 | planning practitioners, developers, arboriculturists |  | draft | webfetch-only | silent |
| `no5-podcast-ep58-nppf-consultation-older-peoples-housing` | No5 Barristers' Chambers | chambers | 2026-03-05 | planning practitioners and the retirement-housing sector |  | draft | webfetch-only | silent |
| `no5-podcast-ep60-nppf-flashpoint-transport` | No5 Barristers' Chambers | chambers | 2026-03-09 | planning practitioners, developers, transport consultants |  | draft | webfetch-only | silent |
| `acorn-rpc-new-nppf-draft` | Acorn Rural Property Consultants | consultancy | 2026-01-06 | rural clients, farmers |  | draft | webfetch-only | silent |
| `agora-architects-nppf-2026-residential` | AGORA Architects | consultancy | 2026-08 | homeowners, landowners and developers (countryside and design-led home |  |  | local-text | S5 agr; SUP agr |
| `aurora-nppf-2026-heritage-changes` | Aurora Heritage Planning | consultancy | 2026-08-17 | applicants, developers, architects, heritage professionals |  |  | local-text | silent |
| `barton-willmore-navigating-draft-nppf` | Barton Willmore, now Stantec | consultancy | unknown | developers, landowners, clients |  | draft | not-retrieved | not read |
| `bidwells-draft-nppf-unpacked` | Bidwells | consultancy | unknown | developers, promoters, landowners |  | draft | local-text | silent |
| `bidwells-nppf-december-2025-landowners` | Bidwells | consultancy | 2025-12 (undated page; written | landowners |  | draft | local-text | silent |
| `boyer-commentary-draft-nppf` | Boyer | consultancy | 2024-08-02 | developers, landowners, clients |  | draft | local-text | silent |
| `boyer-nppf-august-2026` | Boyer | consultancy | 2026-08-17 | developers, landowners, clients |  |  | local-text | SUP agr |
| `brookbanks-nppf-2026-review` | Brookbanks | consultancy | 2026-08-19 | developers, promoters, landowners and local authorities |  |  | webfetch-only | SH2 agr; S5 agr; METH agr |
| `ceres-property-nppf-2026-key-changes` | Ceres Property | consultancy | 2026-08-17 | landowners, developers and property clients |  |  | webfetch-only | TR agr; A2 agr |
| `dha-new-nppf-2026-has-arrived` | DHA Planning | consultancy | 2026-08-17 | developers, landowners, local authorities, communities |  |  | local-text | silent |
| `dudley-peverill-nppf-2026-farms-estates` | Dudley Peverill | consultancy | 2026-08-17 | farmers, estates, rural landowners |  |  | local-text | S5 agr; GB agr; A2 agr; A2 qual; METH agr |
| `eddisons-20-percent-hls-buffer` | Eddisons (BTG Eddisons) | consultancy | 2026-07-22 | landowners and developers |  |  | local-text | SUP agr |
| `edgars-draft-nppf-rural-development` | Edgars | consultancy | 2026-01-23 | rural landowners, farmers, rural businesses |  | draft | local-text | S5 agr |
| `heal-nppf-2026-isolated-home-countryside` | HEAL Planning | consultancy | 2026-09-14 | landowners, self-builders |  |  | local-text | S5 agr |
| `heal-nppf-2026-overall-summary` | HEAL Planning | consultancy | 2026-09-03 | homeowners, landowners, self-builders, small developers |  |  | local-text | S5 agr |
| `heal-planning-nppf-2026-railway-stations` | HEAL Planning | consultancy | 2026-09-14 | landowners, applicants |  |  | webfetch-only | silent |
| `hem-architects-nppf-new-opportunities` | HEM Architects | consultancy | 2026-09-02 | homeowners and landowners (self-build, Passivhaus clients) |  |  | local-text | S5 agr; GB agr |
| `iceni-construction-traffic` | Iceni Projects | consultancy | 2026-09-15 | clients and developers |  |  | local-text | silent |
| `iceni-quiet-demise-dm-policies` | Iceni Projects | consultancy | 2026-08-25 | clients, landowners and developers |  |  | local-text | A2 qual |
| `iceni-retail-wants-to-grow` | Iceni Projects | consultancy | 2026-09-01 | retailers, developers, investors |  |  | local-text | silent |
| `landtech-2026-nppf-unlocks-development-opportunity` | LandTech | consultancy | unknown (after 17 August 2026) | developers, land promoters |  |  | local-text | SH2 agr |
| `lichfields-healthcare-draft-nppf` | Lichfields | consultancy | 2026-02-04 | healthcare providers, developers, local planning authorities |  | draft | local-text | silent |
| `lichfields-next-station-stop` | Lichfields | consultancy | 2026-08-17 | developers, promoters, planning professionals |  |  | local-text | silent |
| `lichfields-spatial-development-strategies` | Lichfields | consultancy | 2026-09-02 (page date; URL pat | strategic plan-makers, developers, promoters |  |  | local-text | silent |
| `lichfields-ten-year-local-plan-periods` | Lichfields | consultancy | 2026-08-27 | plan-makers, developers, examining inspectors |  |  | local-text | silent |
| `lichfields-town-centres-draft-nppf` | Lichfields | consultancy | 2026-02-06 | retail and town-centre developers, local planning authorities |  | draft | local-text | S5 agr |
| `logical-planning-nppf-2026-explained` | Logical Planning | consultancy | 2026-08 (linked guide last rev | landowners, developers, land promoters |  |  | local-text | TR qual; SUP agr; GB agr; METH agr |
| `lsh-nppf-update-10-major-changes` | Lambert Smith Hampton | consultancy | 2026-02-04 | planners, developers, landowners |  | draft | local-text | silent |
| `marrons-planner-responds-new-nppf` | Marrons | consultancy | unknown | developers, landowners |  | draft | not-retrieved | not read |
| `ml-traffic-sustainable-transport-consultants-2026` | ML Traffic Engineers | consultancy | 2026-06-10 | architects, planners, developers, legal teams and councils |  |  | local-text | TR agr |
| `newsteer-nppf-briefing-note-aug-26` | Newsteer | consultancy | 2026-08-17 | Developer and investor clients |  |  | local-text | TR agr; S5 agr |
| `pegasus-draft-nppf-perspective` | Pegasus Group | consultancy | 2025-12-16 | clients and the development industry |  | draft | local-text | silent |
| `pegasus-five-changes-landscape` | Pegasus Group | consultancy | 2026-09-01 | clients and developers; landscape practitioners |  |  | local-text | silent |
| `pegasus-green-belt-grey-belt` | Pegasus Group | consultancy | 2026-08-18 | developers, promoters, local planning authorities |  |  | local-text | SUP agr; GB agr |
| `pegasus-pragmatic-viability` | Pegasus Group | consultancy | 2026-08-19 | clients, developers and local authorities |  |  | local-text | silent |
| `pegasus-pro-development-pivot` | Pegasus Group | consultancy | 2026-08-18 | clients, landowners and developers |  |  | local-text | SH2 agr; GB agr |
| `pegasus-renewables-policy-void` | Pegasus Group | consultancy | 2026-08-17 | energy developers, landowners and investors |  |  | local-text | silent |
| `pegasus-transport-planning-nppf` | Pegasus Group | consultancy | 2026-08-25 | clients and developers (promoter-side consultancy) |  |  | local-text | TR agr |
| `perfect-scale-5yhls-buffer-july-2026` | Perfect Scale | consultancy | 2026-05-19 (updated 2026-06-26 | developers and applicants (small London sites) |  |  | local-text | SUP agr; METH agr |
| `pfandco-grey-belt-site-check-2026` | PF & Co (Site Intelligence) | consultancy | 2026-05-01 | developers, landowners |  |  | local-text | GB agr; METH agr |
| `pfandco-nppf-august-2026-what-changed` | PF & Co (Site Intelligence) | consultancy | 2026-08-26 | planning practitioners, developers |  |  | local-text | SH1 agr; SH2 agr; S5 agr; SUP agr; GB agr; A2 agr |
| `planning-by-design-new-nppf-2026-major-changes` | Planning by Design | consultancy | 2026-08-18 | homeowners, landowners and small developers |  |  | local-text | S5 agr; SUP agr; A2 agr |
| `savills-ambition-and-caution-draft-nppf` | Savills | consultancy | 2026-04-09 | developers, investors, plan-makers |  | draft | local-text | silent |
| `savills-initial-thoughts-new-nppf` | Savills | consultancy | 2026-08-17 | developers, landowners, investors, press |  |  | local-text | GB agr |
| `savills-new-language-in-planning-2026` | Savills | consultancy | 2026-01-23 | developers, landowners, general property audience |  | draft | local-text | silent |
| `savills-nppf-viability-reform` | Savills | consultancy | 2026-01-15 | developers, viability practitioners, plan-makers |  | draft | local-text | silent |
| `savills-rewriting-the-planning-rulebook` | Savills | consultancy | 2026-02-11 | property industry, developers |  | draft | local-text | silent |
| `silverback-nppf-august-2026` | Silverback Planning Solutions | consultancy | 2026-08-17 (approx.; written a | homeowners, landowners, developers, communities |  |  | local-text | SUP agr |
| `squires-neighbourhood-planning-2026` | Squires Planning | consultancy | 2025-12-17 | parish councils, neighbourhood plan groups, developers |  | draft | local-text | SUP agr |
| `stantec-new-nppf-progress-pitfalls` | Stantec | consultancy | unknown | developers, landowners, clients |  | draft | not-retrieved | not read |
| `stantec-planning-reform-2026-insights` | Stantec | consultancy | unknown | developers, landowners, clients |  | draft | not-retrieved | not read |
| `struttandparker-2026-nppf-first-impressions` | Strutt & Parker | consultancy | 2026-08-24 | rural landowners, estates, developers |  |  | local-text | S5 agr |
| `struttandparker-7-key-changes-rural-landowners` | Strutt & Parker | consultancy | 2026-06-26 | rural landowners, estates, farming businesses |  | draft | local-text | SUP agr |
| `struttandparker-nppf-residential-viability` | Strutt & Parker | consultancy | 2026-08-28 | developers, landowners, promoters, LPAs |  |  | local-text | silent |
| `struttandparker-rural-affordable-homes` | Strutt & Parker | consultancy | 2026-09-18 | developers, landowners, registered providers, councils |  |  | local-text | silent |
| `studio-bark-nppf-rural-housing` | Studio Bark | consultancy | 2026-08 | rural homeowners, self-builders, landowners |  |  | local-text | TR qual; S5 agr; SUP agr; A2 qual; METH agr |
| `tetlow-king-cross-subsidy-rural-exception` | Tetlow King Planning | consultancy | unknown | developers, registered providers |  |  | not-retrieved | not read |
| `turley-green-belt-grey-belt` | Turley | consultancy | 2026-01-09 | developers, promoters, plan-makers |  | draft | local-text | GB agr |
| `turley-housing-growth-plan-making` | Turley | consultancy | 2025-12-22 | developers, promoters, plan-makers |  | draft | local-text | S5 agr |
| `turley-nppf-2026-heritage` | Turley | consultancy | 2026-08-21 | applicants, decision-makers, heritage consultants |  |  | local-text | GB agr; A2 agr |
| `tyler-parkes-august-2026-nppf-what-has-changed` | Tyler-Parkes | consultancy | 2026-08-19 | landowners, developers |  |  | local-text | silent |
| `urbanist-architecture-nppf-2026-in-practice` | Urbanist Architecture | consultancy | 2026-08-18 | applicants, developers, landowners and local planning authorities |  |  | local-text | SH2 agr; TR agr; S5 agr; SUP agr; GB agr; A2 agr; DIV qual; METH agr |
| `urbanist-architecture-nppf-2026-pending-applications` | Urbanist Architecture | consultancy | 2026-08-26 | applicants with undetermined applications and their consultants |  |  | local-text | GB agr; A2 agr |
| `urbanist-green-belt-rules-nppf` | Urbanist Architecture | consultancy | 2025-01-30 (last modified 2026 | developers, landowners, general public |  |  | local-text | silent |
| `urbanist-grey-belt-appeal-decisions` | Urbanist Architecture | consultancy | 2025-06-10 (last modified 2026 | landowners, developers, applicants |  |  | local-text | SUP agr; GB agr; METH agr |
| `urbanist-sustainable-location-grey-belt` | Urbanist Architecture | consultancy | 2025-10-28 (last modified 2026 | developers, landowners, planning consultants |  |  | local-text | TR agr; TR qual; SUP agr; GB agr; DIV qual; METH agr |
| `vailwilliams-nppf-2026-planning-reforms` | Vail Williams | consultancy | 2026-08-18 | developers, landowners, investors |  |  | webfetch-only | silent |
| `waypoint-planning-nppf-rural-landowners` | Waypoint Planning (Wilson Wraight LLP) | consultancy | 2026-09-03 | rural landowners, farmers, estates, businesses |  |  | local-text | silent |
| `wotton-donoghue-new-2026-nppf` | Wotton Donoghue Architects | consultancy | 2026-08-20 | clients (homeowners, small developers) |  |  | local-text | silent |
| `b0-mhclg-nppf-annex-a-implementation` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, inspectors, applicants, plan-makers |  |  | local-text | A2 agr |
| `b0-mhclg-nppf-annex-b-glossary` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | everyone (local planning authorities, applicants, inspectors, public) |  |  | local-text | SH1 agr; SH2 agr; TR agr |
| `b0-mhclg-nppf-annex-c-information-requirements` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | applicants, local planning authorities |  |  | local-text | silent |
| `b0-mhclg-nppf-annex-f-flood-risk` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, applicants, decision-makers |  |  | local-text | silent |
| `b0-mhclg-nppf-ch1-introduction` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | everyone (local planning authorities, applicants, inspectors, plan-makers) |  |  | local-text | silent |
| `b0-mhclg-nppf-ch10-clean-energy-water` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, applicants, decision-makers, plan-makers |  |  | local-text | silent |
| `b0-mhclg-nppf-ch11-minerals` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | minerals planning authorities, applicants, decision-makers |  |  | local-text | silent |
| `b0-mhclg-nppf-ch12-effective-use-of-land` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, applicants, decision-makers, plan-makers |  |  | local-text | silent |
| `b0-mhclg-nppf-ch13-green-belt` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, inspectors, applicants, plan-makers |  |  | local-text | SH2 agr; GB agr |
| `b0-mhclg-nppf-ch15-sustainable-transport` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, highway authorities, inspectors, applicant |  |  | local-text | TR agr |
| `b0-mhclg-nppf-ch16-healthy-communities` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, applicants, decision-makers, plan-makers |  |  | local-text | silent |
| `b0-mhclg-nppf-ch17-pollution` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, applicants, decision-makers |  |  | local-text | silent |
| `b0-mhclg-nppf-ch18-flood-risk` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, applicants, decision-makers, plan-makers |  |  | local-text | silent |
| `b0-mhclg-nppf-ch19-natural-environment` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, applicants, decision-makers, plan-makers |  |  | local-text | silent |
| `b0-mhclg-nppf-ch2-plan-making` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | plan-making authorities, examiners, neighbourhood planning groups |  |  | local-text | silent |
| `b0-mhclg-nppf-ch4-sustainable-development` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, inspectors, applicants, plan-makers |  |  | local-text | SH1 agr; SH2 agr; S5 agr; SUP agr; GB agr |
| `b0-mhclg-nppf-ch5-climate-change` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, applicants, decision-makers, plan-makers |  |  | local-text | silent |
| `b0-mhclg-nppf-ch7-economy` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, applicants, decision-makers, plan-makers |  |  | local-text | silent |
| `b0-mhclg-nppf-ch8-town-centres` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, applicants, decision-makers, plan-makers |  |  | local-text | silent |
| `b0-mhclg-nppf-ch9-communications` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (HTML version of th | local planning authorities, telecommunications operators, decision-makers |  |  | local-text | silent |
| `b0-mhclg-nppf-guidance-page` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-08-17 (last updated 2026- | everyone (local planning authorities, applicants, inspectors, public) |  |  | local-text | silent |
| `b0-mhclg-nppf-pdf-2026-08-17` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-08-17 | everyone (local planning authorities, applicants, inspectors, public) |  |  | local-text | SH1 agr; SH2 agr; SH2 qual; S5 agr; SUP agr; GB agr; A2 agr |
| `b0-mhclg-nppf-pdf-2026-09-29` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 (asset linked from  | everyone (local planning authorities, applicants, inspectors, public) |  |  | local-text | silent |
| `b4-pas-2026-events` | Planning Advisory Service (Local Government Association) | government | 2026-09 | local planning authority officers and councillors | yes | draft | local-text | silent |
| `b4-pas-new-plan-making-system-what-we-know` | Planning Advisory Service (Local Government Association) | government | 2025-08 | local planning authority plan-making officers | yes |  | local-text | silent |
| `hansard-grey-belt-land-debate-2026-02-23` | UK Parliament Hansard | government | 2026-02-23 | Members of Parliament, public |  | draft | local-text | silent |
| `hcl-cbp-10964-landing-page` | House of Commons Library | government | 2026-07-15 | Members of Parliament and staff; public |  | draft | not-retrieved | not read |
| `hcl-cbp-10964-nppf-briefing` | House of Commons Library | government | 2026-07-15 | Members of Parliament and staff; widely used by councillors and office |  | draft | not-retrieved | not read |
| `historic-england-gpa3-setting-heritage-assets` | Historic England | government | 2017-12 | local planning authorities, applicants, heritage consultants |  |  | local-text | silent |
| `historic-england-response-nppf-reforms-feb26` | Historic England | government | 2026-02-27 | Ministry of Housing, Communities and Local Government (MHCLG) |  | draft | local-text | S5 agr; DIV agr |
| `mhclg-chief-planner-letter-25-aug-2026` | MHCLG Chief Planner (Joanna Averley) | government | 2026-08-25 | Chief Planning Officers | yes |  | local-text | silent |
| `mhclg-chief-planner-newsletter-aug-2026` | MHCLG Chief Planner (Joanna Averley) | government | 2026-08-18 | Chief Planning Officers of local planning authorities (LPAs) | yes |  | local-text | silent |
| `mhclg-chief-planner-newsletter-jun-2026` | MHCLG Chief Planner (Joanna Averley) | government | 2026-06-04 | Chief Planning Officers | yes | draft | local-text | silent |
| `mhclg-chief-planner-newsletter-mar-2026` | MHCLG Chief Planner (Joanna Averley) | government | 2026-03-27 | Chief Planning Officers | yes | draft | local-text | silent |
| `mhclg-creating-clear-rules-based-planning-system` | MHCLG (Ministry of Housing, Communities and Local Government | government | 2026-08-17 | Local planning authorities, developers, the public |  |  | local-text | silent |
| `mhclg-design-placemaking-ppg-consultation` | MHCLG (Ministry of Housing, Communities and Local Government | government | 2026-01-21 | everyone (consultees) |  | draft | local-text | silent |
| `mhclg-draft-nppf-december-2025` | MHCLG (Ministry of Housing, Communities and Local Government | government | 2025-12-16 | everyone (draft national policy for consultation) |  | draft | local-text | SH1 agr; S5 agr; SUP agr |
| `mhclg-hdt-measurement-rule-book` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-08-17 | LPA plan-making and monitoring officers, decision-makers |  |  | local-text | SUP agr |
| `mhclg-letters-to-chief-planning-officers-index` | MHCLG | government | 2026-08-27 | Chief Planning Officers; public | yes |  | local-text | silent |
| `mhclg-nppf-annex-d-housing-calculations` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 | local planning authorities, applicants, decision-makers |  |  | local-text | SUP agr |
| `mhclg-nppf-annex-e-green-belt-assessments` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 | local planning authorities, plan-makers, decision-makers |  |  | local-text | GB agr |
| `mhclg-nppf-ch14-design` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 | local planning authorities, applicants, decision-makers |  |  | local-text | A2 agr |
| `mhclg-nppf-ch20-historic-environment` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 | local planning authorities, applicants, decision-makers |  |  | local-text | A2 agr |
| `mhclg-nppf-ch3-decision-making` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 | local planning authorities, applicants, decision-makers |  |  | local-text | silent |
| `mhclg-nppf-ch6-housing-supply` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-29 | local planning authorities, applicants, decision-makers |  |  | local-text | silent |
| `mhclg-nppf-consultation-december-2025` | MHCLG (Ministry of Housing, Communities and Local Government | government | 2025-12-16 | everyone (consultees: LPAs, developers, public) |  | draft | local-text | SH1 agr; S5 agr; SUP agr; METH agr |
| `mhclg-nppf-consultation-government-response` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-08-17 | local planning authorities, developers, consultees, public |  |  | local-text | SH2 agr; TR agr; A2 agr; DIV agr |
| `mhclg-nppf-consultation-outcome-page` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-08-17 | public, consultees, local planning authorities |  |  | local-text | A2 agr |
| `mhclg-nppf-proposed-reforms-consultation-dec-2025` | MHCLG (Ministry of Housing, Communities and Local Government | government | 2025-12-16 | Local planning authorities, developers, statutory bodies, the public |  | draft | local-text | SH1 agr; S5 agr; SUP agr; GB agr; METH agr |
| `mhclg-planning-policy-traveller-sites` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-08-27 | LPA officers, decision-makers, traveller communities |  |  | local-text | silent |
| `mhclg-ppg-collection` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-09-23 | LPA officers, applicants, inspectors, public |  |  | local-text | silent |
| `mhclg-ppg-green-belt` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2025-02-27 | LPA officers, plan-makers, applicants, inspectors |  |  | local-text | GB agr |
| `mhclg-psed-assessment-nppf-changes` | Ministry of Housing, Communities and Local Government (MHCLG | government | 2026-08-17 | ministers and decision-makers in MHCLG; public; local planning authori |  |  | local-text | TR agr; S5 agr; METH agr |
| `mhclg-rules-based-planning-letter` | MHCLG (Matthew Pennycook MP) | government | 2026-08-17 | local authority leaders and metro mayors (copied to chief executives) |  |  | local-text | silent |
| `mhclg-rules-based-planning-letter-page` | MHCLG (Matthew Pennycook MP, Minister of State for Housing a | government | 2026-08-17 | local authority leaders, mayors, local authority chief executives |  |  | local-text | silent |
| `parliament-wms-planning-reform-next-phase-2025-12-16` | UK Parliament (via TheyWorkForYou) | government | 2025-12-16 | Parliament, LPAs, public |  | draft | local-text | silent |
| `pas-further-information-new-plan-making-system` | Planning Advisory Service | government | unknown | LPA (local planning authority) officers | yes |  | not-retrieved | not read |
| `asdf-problems-and-issues-2026-nppf` | A Social Democratic Future (blog) | independent | 2026-05-28 | policy community, general public |  | draft | local-text | SH1 agr; S5 agr |
| `designing-buildings-understanding-nppf-2026-changes` | Designing Buildings Wiki (article by the Chartered Institute | independent | 2026-09-01 (originally on the  | construction industry |  |  | local-text | silent |
| `gillian-jamieson-nppf-consultation-response` | Gillian Jamieson (Substack) | independent | 2026-03 (update 16 March 2026) | general public |  | draft | local-text | silent |
| `github-uk-planning-skills-issue-62` | SeagullTwo/uk-planning-skills (GitHub) | independent | 2026-09-20 | developers and users of AI planning-analysis skills |  |  | local-text | GB agr |
| `hwgpnfy-apple-podcasts-listing` | Apple Podcasts | independent | listing as of 2026-10-02 (late | planning professionals |  |  | local-text | silent |
| `hwgpnfy-s20e1-youtube` | Have We Got Planning News For You (podcast; barristers from  | independent | 2026-08-18 | planning professionals (barristers, consultants, council officers) |  |  | local-text | SH1 agr; SH2 agr; S5 agr; SUP agr |
| `livedin-nppf-2026-policy-test` | Livedin | independent | unknown (live tool, retrieved  | landowners, self-builders, architects, developers |  |  | local-text | SH2 agr; S5 agr; SUP agr; GB agr; A2 qual; METH agr |
| `livedin-nppf-2026-terminology` | Livedin | independent | 2026-08-21 (last reviewed) | landowners, self-builders, architects |  |  | local-text | SH2 agr; S5 agr; A2 DIS |
| `logical-planning-nppf-2026-policy-codes-explained` | Logical Planning | independent | 2026-08-18 (last reviewed) | landowners, land promoters, planning consultants |  |  | local-text | silent |
| `planning-gateway-nppf-2026-what-changed-17-august` | UK Planning Gateway (Submit A Plan Ltd) | independent | 2026-09-28 (last update) | planning consultants, architects, architectural technologists, develop |  |  | local-text | TR agr; SUP agr; A2 agr |
| `planninggeek-albrighton-appeal` | Planning Geek (Ian Walmsley) | independent | 2026-09-18 | practitioners, public |  |  | local-text | GB agr |
| `planninggeek-aston-clinton-appeal-settlement-test` | Planning Geek (Ian Walmsley) | independent | 2026-09-27 | planning practitioners, applicants |  |  | local-text | S5 qual; A2 qual; METH agr |
| `planninggeek-build-outside-settlement-boundary` | Planning Geek (Ian Walmsley) | independent | 2026-09-25 | landowners, applicants and small developers |  |  | local-text | SH2 agr; S5 agr; SUP agr; GB agr |
| `planninggeek-croxley-green-appeal` | Planning Geek (Ian Walmsley) | independent | 2026-08-31 | practitioners, public |  |  | local-text | GB agr; METH agr |
| `planninggeek-east-devon-holiday-home` | Planning Geek (Ian Walmsley) | independent | 2026-09-30 | practitioners, applicants, public |  |  | local-text | SH1 agr; S5 agr; SUP agr |
| `planninggeek-grey-belt-caravan-enforcement` | Planning Geek (Ian Walmsley) | independent | 2026-09-06 | practitioners, applicants, public |  |  | local-text | SUP agr; GB agr |
| `planninggeek-heald-green-grey-belt` | Planning Geek (Ian Walmsley) | independent | 2026-09-13 | applicants, agents, public |  |  | local-text | TR agr; SUP agr; GB agr; A2 agr |
| `planninggeek-horsham-nppf-s5-infill` | Planning Geek (Ian Walmsley) | independent | 2026-09-11 | practitioners, applicants, public |  |  | local-text | S5 agr |
| `planninggeek-hurst-green-grey-belt-odour` | Planning Geek (Ian Walmsley) | independent | 2026-09-21 | applicants, agents, public |  |  | local-text | SUP agr; GB agr |
| `planninggeek-keynsham-grey-belt` | Planning Geek (Ian Walmsley) | independent | 2026-09-04 | planning practitioners, applicants, general readers |  |  | local-text | GB agr |
| `planninggeek-kirklees-grey-belt-house` | Planning Geek (Ian Walmsley) | independent | 2026-09-30 | planning practitioners, applicants, general readers |  |  | local-text | SUP agr; GB agr |
| `planninggeek-nppf-2024-vs-2026` | Planning Geek (Ian Walmsley) | independent | unknown (after 17 Aug 2026) | applicants, agents, planning practitioners |  |  | local-text | SH2 agr; S5 agr; SUP agr; GB agr; A2 agr; METH agr |
| `planninggeek-nppf-timeline` | Planning Geek | independent | 2026-08-25 | practitioners, public |  |  | local-text | METH agr |
| `planninggeek-presumption-sustainable-development` | Planning Geek | independent | 2026-09-17 | applicants, agents, public |  |  | local-text | SH1 agr; SH2 agr; S5 agr; SUP agr; GB agr |
| `planninggeek-revised-nppf-2026` | Planning Geek (Ian Walmsley) | independent | 2026-08-17 | practitioners, applicants, officers, public |  |  | local-text | SH1 agr; TR agr; SUP agr; GB agr; A2 agr |
| `planninggeek-sevenoaks-grey-belt-appeal` | Planning Geek (Ian Walmsley) | independent | 2026-09-29 | practitioners, applicants, public |  |  | local-text | GB agr; GB qual |
| `planninggeek-south-nutfield-grey-belt-gb7` | Planning Geek (Ian Walmsley) | independent | 2026-09-21 | applicants, agents, public |  |  | local-text | TR agr; SUP agr; GB agr |
| `planninggeek-tandridge-grey-belt` | Planning Geek (Ian Walmsley) | independent | 2026-09-07 | planning practitioners, applicants, general readers |  |  | local-text | TR agr; SUP agr; GB agr |
| `planninggeek-thundersley-grey-belt` | Planning Geek (Ian Walmsley) | independent | 2026-09-15 | planning practitioners, applicants, general readers |  |  | local-text | SUP agr; GB agr |
| `planninggeek-whitchurch-housing-appeal` | Planning Geek (Ian Walmsley) | independent | 2026-09-19 | applicants, agents, public |  |  | local-text | S5 agr; SUP agr |
| `planninggeek-wychavon-green-belt-appeal` | Planning Geek (Ian Walmsley) | independent | 2026-09-18 | applicants, agents, public |  |  | local-text | GB agr |
| `planoraks-basics-19-how-many-appeals-win` | #planoraks (Zack Simons KC, Landmark Chambers) | independent | 2024-06-05 (inferred from the  | planning professionals, developers, clients |  |  | local-text | METH qual |
| `planoraks-nppf2026-welcome-to-the-future` | #planoraks (Zack Simons KC, Landmark Chambers) | independent | 2026-08-18 | planning professionals, lawyers, developers, local planning authority  |  |  | local-text | S5 agr; SUP agr |
| `anthony-collins-nppf-key-changes` | Anthony Collins Solicitors | law-firm | 2026-08-18 | clients, including local government and developers |  |  | local-text | silent |
| `browne-jacobson-nppf-2026-consultation-response` | Browne Jacobson | law-firm | 2026-03-12 | government (consultation response); clients |  | draft | local-text | S5 agr |
| `browne-jacobson-nppf-2026-data-centres-response` | Browne Jacobson | law-firm | 2026-03-12 | government (consultation response); data centre developers |  | draft | local-text | silent |
| `browne-jacobson-nppf-2026-published-lawyers-comment` | Browne Jacobson | law-firm | 2026-08-17 | public sector (councils) and private sector clients; press |  |  | local-text | silent |
| `burges-salmon-aug-2026-nppf-key-departures` | Burges Salmon (Adam Richards, Sarah Sutherland, Daniel Whitt | law-firm | 2026-08-21 | developers, landowners, infrastructure promoters and local authorities |  |  | local-text | SH1 agr; S5 agr; A2 agr |
| `burges-salmon-new-nppf-one-month-on` | Burges Salmon | law-firm | 2026-09-17 | developers, landowners and their advisers |  |  | local-text | S5 agr; A2 qual; METH agr |
| `clyde-co-uk-real-estate-horizon-2026` | Clyde & Co | law-firm | 2026-01-14 | real-estate clients |  | draft | local-text | silent |
| `edwin-coe-nppf-2026-what-has-changed` | Edwin Coe | law-firm | 2026-08-26 (approximate, from  | developers, landowners, local authorities, planning professionals |  |  | local-text | SUP agr; METH agr |
| `freeths-consultation-to-publication-what-changed` | Freeths | law-firm | 2026-09-01 | developers, landowners and their advisers |  |  | local-text | S5 agr; SUP agr; GB qual |
| `freeths-draft-nppf-consultation-whats-new` | Freeths | law-firm | 2026-02-11 | developers, landowners and their advisers |  | draft | local-text | S5 agr; SUP agr |
| `fsp-law-new-nppf-2026` | Field Seymour Parkes LLP | law-firm | 2026-09-02 | developers, landowners and property investors |  |  | local-text | silent |
| `irwin-mitchell-decoding-nppf-consultation-draft` | Irwin Mitchell | law-firm | 2026-01-30 | developers, landowners, practitioners |  | draft | local-text | S5 agr |
| `irwin-mitchell-planning-reform-living-sector` | Irwin Mitchell | law-firm | 2026-08-12 | investors and developers (build-to-rent, student and residential) |  | draft | local-text | silent |
| `legal500-hugh-james-new-nppf-what-you-need-to-know` | Legal 500 (syndicated Hugh James article) | law-firm | unknown | clients |  |  | not-retrieved | not read |
| `legal500-mills-reeve-new-nppf-key-takeaways` | Legal 500 (Mills & Reeve) | law-firm | 2026-09-03 | clients |  |  | not-retrieved | not read |
| `legal500-thrings-nppf-2026-sme-developers` | Legal 500 (syndicated Thrings article) | law-firm | unknown | developers |  |  | not-retrieved | not read |
| `michelmores-national-planning-policy-framework-2026` | Michelmores | law-firm | 2026-08-20 | developers, landowners and their advisers |  |  | local-text | SUP agr |
| `mills-reeve-later-living-revised-nppf` | Mills & Reeve | law-firm | 2026-02-02 | developers (later-living / retirement housing sector) |  | draft | local-text | S5 agr |
| `mondaq-hugh-james-new-nppf-what-you-need-to-know` | Mondaq (Hugh James) | law-firm | 2026-09-07 | anyone involved in the planning system (developers, landowners, counci |  |  | local-text | SH1 agr; A2 agr; METH agr |
| `pinsent-masons-nppf-boost-housing-renewables-water` | Pinsent Masons (Out-Law) | law-firm | 2026-08-21 | developers, infrastructure promoters and their advisers |  |  | local-text | SUP agr |
| `pinsent-masons-nppf-practical-guide-webinar` | Pinsent Masons | law-firm | 2026-10-05 | developers, local authorities, landowners, investors and planning prof |  |  | local-text | silent |
| `sharpe-pritchard-nppf-2026-key-planning-reforms` | Sharpe Pritchard | law-firm | 2026-08-20 | local planning authorities and developers |  |  | local-text | SH2 agr; S5 agr; SUP agr; A2 agr |
| `simonicity-developing-near-stations` | Simon Ricketts (Simonicity) | law-firm | 2026-09-05 | planning lawyers, developers and planning practitioners |  |  | local-text | silent |
| `simonicity-evidenced-unmet-need` | Simon Ricketts (Simonicity) | law-firm | 2026-09-20 | planning lawyers, developers and planning practitioners |  |  | local-text | S5 agr; SUP agr |
| `simonicity-framework-good-work` | Simon Ricketts (Simonicity) | law-firm | 2025-12-19 | planning lawyers, developers and planning practitioners |  | draft | local-text | silent |
| `simonicity-grey-belt-tests-tested` | Simon Ricketts (Simonicity) | law-firm | 2026-02-07 | planning lawyers, developers and planning practitioners |  | draft | local-text | GB agr |
| `simonicity-mark-up-final-nppf-vs-draft` | Simon Ricketts (Simonicity blog; partner, Town Legal LLP; pe | law-firm | 2026-08-17 | planning lawyers and practitioners |  |  | local-text | silent |
| `simonicity-nppf-category` | Simon Ricketts (Simonicity) | law-firm | unknown | planning lawyers, developers and planning practitioners |  |  | local-text | silent |
| `simonicity-old-wine-heritage` | Simon Ricketts (Simonicity) | law-firm | 2026-09-27 | planning lawyers, developers and planning practitioners |  |  | local-text | A2 agr |
| `simonicity-problem-draft-london-plan` | Simon Ricketts (Simonicity) | law-firm | 2026-09-13 | planning lawyers, developers and planning practitioners |  |  | local-text | silent |
| `simonicity-push-the-button` | Simon Ricketts (Simonicity) | law-firm | 2026-08-31 | planning lawyers, developers and planning practitioners |  |  | local-text | S5 agr; GB agr |
| `the-lawyer-shoosmiths-nppf-2026-beyond-housing` | The Lawyer (Shoosmiths briefing) | law-firm | unknown | practitioners, developers |  |  | not-retrieved | not read |
| `thrings-nppf-2026-sme-developers` | Thrings LLP | law-firm | 2026-08-20 | small and medium-sized enterprise (SME) developers |  |  | local-text | SUP agr; GB agr |
| `townlegal-transport-led-placemaking` | Town Legal | law-firm | 2026-05-13 | developers, combined authorities, local authorities, investors (Northe |  | draft | local-text | silent |
| `walker-morris-nppf-2026-at-a-glance` | Walker Morris | law-firm | 2026-09-24 | developers, investors, landowners |  |  | local-text | S5 agr |
| `broads-authority-committee-nppf-consultation-bng` | Broads Authority | lpa | 2026-02-13 | Planning committee members | yes | draft | not-retrieved | not read |
| `ehdc-cabinet-local-plan-update-may-2026` | East Hampshire District Council | lpa | 2026-05-28 | councillors (Cabinet) | yes | draft | local-text | silent |
| `gedling-portfolio-holder-report-nppf-2026` | Gedling Borough Council | lpa | 2026-02-27 | council members (Portfolio Holder for Growth and Regeneration) | yes | draft | local-text | silent |
| `kings-lynn-nppf-update-presentation-2026` | Borough Council of King's Lynn and West Norfolk | lpa | 2026-02-10 | council members (Local Plan Task Group) | yes | draft | local-text | silent |
| `lancaster-cabinet-report-nppf-feb-2026` | Lancaster City Council | lpa | 2026-02-19 | council members (Council Business Committee) | yes | draft | local-text | silent |
| `mid-sussex-colwell-farm-appellant-nppf-2026-id32` | Mid Sussex District Council inquiry library (author SLR Cons | lpa | 2026-09-03 | Inspector |  |  | local-text | TR agr; S5 agr; S5 qual; SUP qual; A2 DIS |
| `nelincs-cabinet-local-plan-sep-2026` | North East Lincolnshire Council (copy hosted by Planning Gee | lpa | 2026-09-16 | councillors (Cabinet, then Full Council on 24 September 2026) | yes |  | local-text | SUP agr |
| `new-forest-npa-pc-507-26-nppf-consultation` | New Forest National Park Authority | lpa | 2026-02-17 | Planning committee members | yes | draft | local-text | silent |
| `south-oxfordshire-nppf-consultation-response` | South Oxfordshire District Council | lpa | 2026-03-10 | MHCLG (consultation response); shows officers' reading |  | draft | local-text | SH1 agr; TR agr; S5 agr; METH agr |
| `st-albans-ppc-briefing-draft-nppf-2026-01` | St Albans City and District Council | lpa | 2026-01-19 | council members (Planning Policy Committee) | yes | draft | local-text | silent |
| `three-rivers-lpa-response-nppf-2026-oxhey-lane` | Three Rivers District Council | lpa | 2026-08-28 | Inspector / Secretary of State (inquiry document ID37) | yes |  | local-text | TR agr; GB agr |
| `york-pplpag-planning-reform-scoping-jun-2026` | City of York Council | lpa | 2026-06-09 | councillors (member advisory group) | yes | draft | local-text | silent |
| `b4-pins-govuk-organisation-page` | Planning Inspectorate | pins | 2026-10-01 | public, appellants, local planning authorities |  |  | local-text | silent |
| `b4-wdtk-copy-of-latest-inspector-training-manual` | WhatDoTheyKnow / Planning Inspectorate | pins | 2019-02-21 | public (Freedom of Information requester); describes material for plan | yes |  | local-text | silent |
| `b4-wdtk-inspector-training-manual-5` | WhatDoTheyKnow / Planning Inspectorate | pins | 2025-02-11 | public (Freedom of Information requester); describes material for plan | yes |  | local-text | silent |
| `b4-wdtk-most-up-to-date-inspector-training-manual` | WhatDoTheyKnow / Planning Inspectorate | pins | 2025-04-29 | public (Freedom of Information requester); describes material for plan | yes |  | local-text | silent |
| `b4-wdtk-request-inspector-training-manual-model-conditions` | WhatDoTheyKnow / Planning Inspectorate | pins | 2024-01-26 | public (Freedom of Information requester); describes material for plan | yes |  | local-text | silent |
| `pins-ai-in-casework-evidence` | Planning Inspectorate | pins | 2026-09-29 | appellants, agents, LPA officers, interested parties | yes |  | local-text | silent |
| `pins-appeals-procedural-guide-apr-2026` | Planning Inspectorate | pins | 2026-07-16 | appellants, agents, LPAs, interested people |  |  | local-text | METH agr |
| `pins-blog-appeal-decision-written-in-the-stars` | Planning Inspectorate (Claire Sherratt, Inspector Profession | pins | 2026-08-19 | appellants, agents, LPAs, public |  |  | local-text | METH qual |
| `pins-casework-database` | Planning Inspectorate | pins | 2026-10-01 | researchers, public, LPAs, appellants |  |  | local-text | METH qual |
| `eg-another-new-nppf-legal-comment` | Estates Gazette | press | 2026-09-05 | planning professionals, developers and property investors (trade press |  |  | not-retrieved | not read |
| `eg-default-yes-homes-around-stations` | Estates Gazette | press | 2026-08-17 | planning professionals, developers and property investors (trade press |  |  | not-retrieved | not read |
| `farmers-guide-rural-sector-responds-relaxed-planning` | Farmers Guide | press | 2026-08-18 | farmers, rural businesses |  |  | local-text | silent |
| `fwi-new-planning-framework-farmers-rural-businesses` | Farmers Weekly | press | 2026-04-15 | farmers, rural landowners and businesses |  | draft | local-text | SH1 agr; S5 qual; A2 qual |
| `guildford-dragon-rural-roar-effingham-pc` | The Guildford Dragon (opinion piece by Cllr Paula Moss, vice | press | 2026-09-11 | public, parish councils, MPs |  |  | local-text | GB agr; METH agr |
| `housingtoday-hbf-permissions-lowest-record` | Housing Today | press | 2026-08-17 | housing professionals, housebuilders |  |  | local-text | silent |
| `housingtoday-rayner-default-yes-stations` | Housing Today (Daniel Gayne) | press | 2026-08-17 | housing professionals, developers |  |  | local-text | A2 agr |
| `intermediary-grey-belt-changing-green-belt-appeals` | The Intermediary (GapSense analysis, Martin Alderson) | press | 2026-07-13 | developers, lenders, agents, public |  |  | local-text | SUP agr; GB agr; METH agr; METH qual |
| `lexisnexis-2026-revisions-nppf-published` | LexisNexis | press | 2026-08-17 | lawyers (including local government lawyers) |  |  | local-text | silent |
| `lgc-latest-nppf-changes` | LGC (Local Government Chronicle) | press | 2026-08-17 | Council officers and members |  |  | local-text | silent |
| `lgl-august-2026-nppf-changes-from-draft` | Local Government Lawyer (article by Burges Salmon — Adam Ric | press | 2026-09-09 | local authority lawyers and planning practitioners |  |  | local-text | SH1 agr; S5 agr; A2 agr |
| `lgl-default-yes-homes-near-stations` | Local Government Lawyer | press | 2026-08-17 | local authority lawyers and officers |  |  | local-text | S5 qual |
| `lgl-government-traveller-sites-reports-wrong` | Local Government Lawyer | press | 2026-08-19 | local authority lawyers and officers |  |  | local-text | silent |
| `lgl-landmark-nppf-2026-event-listing` | Local Government Lawyer | press | 2026-09-03 | local authority in-house lawyers | yes |  | local-text | silent |
| `lgl-revised-nppf-clarifies-roles-of-plans` | Local Government Lawyer | press | 2026-08-20 | local authority lawyers and officers |  |  | local-text | silent |
| `lgl-revised-nppf-registered-providers` | Local Government Lawyer (Catherine Kennedy and Jacob McGrath | press | 2026-09-03 (from page metadata | registered providers, housing lawyers, local authority housing teams |  |  | local-text | A2 agr |
| `lgl-royal-borough-challenge-mol-grey-belt` | Local Government Lawyer | press | 2026-09-03 | local authority lawyers and officers |  |  | local-text | DIV agr |
| `planner-75pc-major-grey-belt-appeals-approved` | The Planner (Royal Town Planning Institute, RTPI) | press | 2026-04-07 | planning professionals, developers and property investors (trade press |  |  | not-retrieved | not read |
| `planner-nature-and-planning-nppf-far-enough` | The Planner (Royal Town Planning Institute, RTPI) | press | 2026-09-15 | planning professionals, developers and property investors (trade press |  |  | not-retrieved | not read |
| `planner-nppf-changes-welcome-plan-led-concerns` | The Planner (Royal Town Planning Institute, RTPI) | press | 2026-03-17 | planning professionals, developers and property investors (trade press |  | draft | not-retrieved | not read |
| `planning-600-home-countryside-appeal-unmet-need` | Planning (planningresource.co.uk) | press | unknown | planning professionals, developers and property investors (trade press |  |  | not-retrieved | not read |
| `planning-compass-appeal-database` | Planning (planningresource.co.uk) | press | unknown | planning professionals, developers and property investors (trade press |  |  | not-retrieved | not read |
| `planning-presumption-within-settlements` | Planning (planningresource.co.uk) | press | unknown | planning professionals, developers and property investors (trade press |  | draft | not-retrieved | not read |
| `planning-resource-inspector-allows-249-homes-unmet-need` | Planning Resource | press | unknown | planning professionals |  |  | not-retrieved | not read |
| `practical-law-nppf-august-2026-published` | Practical Law (Thomson Reuters) | press | unknown | lawyers |  |  | not-retrieved | not read |
| `propertyweek-reuk-welcomes-revised-nppf` | Property Week | press | 2026-08-21 | commercial property industry |  |  | local-text | silent |
| `propertyweek-revised-nppf-emphasis-on-national` | Property Week (Tim Clark) | press | 2026-08-26 | property and planning professionals, developers |  |  | local-text | S5 qual; METH agr |
| `ribaj-nppf-2026-what-architects-need-to-know` | RIBA Journal | press | unknown | architects |  |  | not-retrieved | not read |
| `room-106-planning-podcast-listnotes` | Planning magazine / Listen Notes | press | listing as of 2026-10-02 (Ep21 | planning professionals |  |  | local-text | silent |
| `theplanner-cpre-nppf-warning` | The Planner (CPRE quoted) | press | 2026-07-23 | planning professionals |  | draft | not-retrieved | not read |
| `b4-lga-nppf-august-2026-changes-briefing` | Local Government Association | sector-body | 2026-08 | councillors, council officers and parliamentarians | yes |  | local-text | TR agr; S5 agr; SUP agr; A2 agr |
| `ccn-councils-warn-new-planning-rules` | County Councils Network (CCN) | sector-body | 2026-03-17 | government, councils, media |  | draft | local-text | silent |
| `ciht-nppf-2026-consultation-response` | Chartered Institution of Highways & Transportation (CIHT) | sector-body | 2026-03 | MHCLG consultation team; transport and planning professionals |  | draft | local-text | TR agr; SUP qual |
| `hbf-hyndburn-rep-12` | Home Builders Federation (via Hyndburn Borough Council) | sector-body | 2026-04-30 | local plan inspector, Hyndburn Borough Council planning policy |  | draft | local-text | silent |
| `hbf-response-government-publishes-nppf` | Home Builders Federation (HBF) | sector-body | 2026-08-17 | public, press, housebuilders |  |  | local-text | silent |
| `ihbc-ccn-responds-new-nppf` | Institute of Historic Building Conservation (IHBC) NewsBlogs | sector-body | 2026-08-28 | heritage professionals, conservation officers |  |  | local-text | S5 qual |
| `nalc-broadly-supports-updated-nppf` | National Association of Local Councils (NALC) | sector-body | 2026-03-09 | parish and town councils, government |  | draft | local-text | silent |
| `nalc-finalises-nppf-consultation-response` | National Association of Local Councils (NALC) | sector-body | 2026-02-27 | parish and town councils |  | draft | local-text | silent |
| `nalc-requesting-planning-applications` | National Association of Local Councils (NALC) | sector-body | unknown | parish and town councils |  |  | local-text | silent |
| `nfb-updated-nppf-homes-near-transport-hubs` | National Federation of Builders (NFB) | sector-body | 2026-08-17 | SME builders and developers (NFB members), press |  |  | local-text | silent |
| `nfu-nppf-consultation-announced` | National Farmers' Union (NFU) | sector-body | 2026-03-13 | farmers (NFU members), press |  | draft | local-text | S5 agr |
| `nfu-nppf-consultation-concerns` | National Farmers' Union (NFU) | sector-body | 2024-09-23 | farmers (NFU members) |  | draft | local-text | silent |
| `nfu-nppf-refresh-food-production` | National Farmers' Union (NFU) | sector-body | 2026-08-20 | farmers (NFU members), press |  |  | local-text | silent |
| `rsn-nppf-could-boost-rural-housing` | Rural Services Network | sector-body | 2018 (inferred; Wayback snapsh | rural councils, landowners |  | draft | local-text | silent |
| `rsn-spotlight-rural-housing-jan-2026` | Rural Services Network / Rural Housing Alliance | sector-body | 2026-01 | rural councils and rural housing providers (Rural Services Network mem |  | draft | local-text | silent |
| `rtpi-briefing-parliamentarians-nppf` | Royal Town Planning Institute (RTPI) | sector-body | unknown | parliamentarians |  | draft | not-retrieved | not read |
| `slcc-nppf-expected-over-summer` | Society of Local Council Clerks (SLCC) | sector-body | unknown (spring 2026) | local council clerks |  | draft | local-text | silent |
| `slcc-response-to-nppf-consultation` | Society of Local Council Clerks (SLCC) | sector-body | 2026-03-10 | government; local council clerks |  | draft | local-text | S5 agr |
| `b6-pas-local-plan-training` | Planning Advisory Service / Local Government Association | training-body | 2025 (archived 5 Aug 2025) | LPA officers, councillors | yes |  | local-text | silent |
| `b6-pas-welcome-planning-advisory-service` | Planning Advisory Service / Local Government Association | training-body | 2026-09 | LPA officers, councillors | yes |  | local-text | silent |
| `battle-tc-how-planning-system-is-changing-handout` | Battle Town Council (training handout; trainer not named) | training-body | 2026-02-24 | town and parish councillors and clerks (Sussex) | yes | draft | local-text | SUP agr; A2 qual |
| `mbl-nppf-2026-complete-overhaul-webinar` | MBL Seminars | training-body | 2026-10-13 | lawyers and planning professionals, including local authority staff (p | yes |  | local-text | silent |
| `planning-jungle-nppf-august-2026-update` | Planning Jungle | training-body | 2026-08-18 | Local planning authority (LPA) development-management officers and oth | yes |  | local-text | silent |
| `rtpi-cpd-masterclass-calendar` | Royal Town Planning Institute (RTPI) | training-body | 2026 | chartered planners, including LPA officers | yes |  | not-retrieved | not read |
| `rtpi-south-west-events-cpd` | RTPI South West | training-body | 2026 | planners and LPA officers in south-west England | yes |  | not-retrieved | not read |
| `rtpi-west-midlands-events` | RTPI West Midlands (Royal Town Planning Institute) | training-body | 2026 | Planning professionals in the West Midlands, including local planning  |  |  | not-retrieved | not read |
| `slcc-new-nppf` | Society of Local Council Clerks (SLCC) | training-body | 2026-08 | town and parish council clerks and councillors | yes |  | local-text | S5 agr |
| `worcscalc-new-nppf-what-councils-need-to-know` | Worcestershire County Association of Local Councils (event r | training-body | 2026-09 | town and parish councillors and clerks | yes |  | local-text | silent |
