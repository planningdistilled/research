// Assessing a sustainable location under the August 2026 NPPF: the test (TR3), the Connectivity Tool,
// the guidance still awaited, and the training and guidance published before it. Writes two pages:
// the summary and a sources/ sub-page listing every document relied on. The figures on what decisions
// have turned on come from the location-factors register (factors/register.mjs; factors/build.mjs builds its page).
//   node pages/england/sustainable-location/build.mjs   (writes into main-site; needs ../sources to check quotations)
import fs from 'node:fs';
import path from 'node:path';
import { OPEN, SITE, resolveRef } from '../../../paths.mjs';
import { caseById, check, esc, page, quote } from '../../_shared/policy-weight.mjs';
import { CLASSES, FACTORS, FACTORS_PAGE, TOTALS, holds, stat } from './factors/register.mjs';

const SITE_PATH = 'research/england/sustainable-location/';
const PAGE = '/' + SITE_PATH;
const SOURCES_PAGE = PAGE + 'sources/';
const ORIGIN = 'https://planningdistilled.org';
const REPO = 'https://github.com/planningdistilled/research/blob/main/data/open-sources/';
const RETRIEVED = '6 October 2026';
const OGL = 'guidance-ogl/';

// ---- Every document the two pages rely on. `ref` is the copy quotations are checked against. ----
// group: framework | tool | awaited | training | earlier
const SRC = [
  { id: 'nppf-2026', group: 'framework', kind: 'National policy', title: 'National Planning Policy Framework, August 2026', publisher: 'Ministry of Housing, Communities and Local Government (MHCLG)', date: '17 August 2026',
    url: 'https://www.gov.uk/guidance/national-planning-policy-framework', ref: 'open:nppf/NPPF-August-2026.txt',
    used: 'Policy TR3 (the test for a sustainable location), GB7(1)(g)(iii), HC5, and the Annex B definitions of "connectivity" and "reasonable walking distance".' },
  { id: 'nppf-2024', group: 'framework', kind: 'National policy (superseded)', title: 'National Planning Policy Framework, December 2024', publisher: 'MHCLG', date: 'December 2024',
    url: 'https://www.gov.uk/guidance/national-planning-policy-framework', ref: 'open:nppf/NPPF-December-2024.txt',
    used: 'Paragraph 110, to show that the wording of TR3(1)(a) is carried forward from the previous Framework.' },
  { id: 'connectivity-tool', group: 'tool', kind: 'Official tool', title: 'Connectivity Tool', publisher: 'Department for Transport (DfT)', date: 'First published 26 June 2025; last updated 3 July 2026',
    url: 'https://www.gov.uk/guidance/connectivity-tool', ref: `open:${OGL}dft-connectivity-tool.txt`,
    used: 'What the tool is, who can use the full version, and that Connectivity Tool Lite is open to anyone.' },
  { id: 'connectivity-scores', group: 'tool', kind: 'Official guidance', title: 'Interpreting connectivity scores', publisher: 'DfT', date: 'Linked from the GOV.UK page on 3 July 2026',
    url: 'https://connectivity-tool-lite.dft.gov.uk/help/interpreting-connectivity-scores', ref: `open:${OGL}dft-connectivity-tool-interpreting-scores.txt`,
    used: 'How scores are calculated, why 50 is not "average", the Connectivity Matrix, the worked example, and what the score does not measure.' },
  { id: 'connectivity-applying', group: 'tool', kind: 'Official guidance', title: 'Applying the Connectivity Tool', publisher: 'DfT', date: 'Undated help page',
    url: 'https://connectivity-tool-lite.dft.gov.uk/help/applying-connectivity-tool', ref: `open:${OGL}dft-connectivity-tool-applying.txt`,
    used: 'The tool\'s purpose in plan-making and decision-taking, that driving scores should not be the basis of decisions, and that route quality is not measured.' },
  { id: 'government-response', group: 'awaited', kind: 'Government statement', title: 'National Planning Policy Framework consultation: government response', publisher: 'MHCLG', date: 'August 2026',
    url: 'https://assets.publishing.service.gov.uk/media/6a82fcec3bd75b81e2329a89/National_Planning_Policy_Framework_consultation_-_government_response.pdf', ref: `open:${OGL}mhclg-nppf-consultation-government-response.txt`,
    used: 'The commitment to revise the transport planning practice guidance, and the clarification that other evidence can be used alongside the Connectivity Tool.' },
  { id: 'ppg-transport', group: 'awaited', kind: 'Planning practice guidance', title: 'Travel Plans, Transport Assessments and Statements', publisher: 'MHCLG', date: 'Published 6 March 2014; every paragraph carries the revision date 6 March 2014',
    url: 'https://www.gov.uk/guidance/travel-plans-transport-assessments-and-statements', ref: `open:${OGL}mhclg-ppg-travel-plans-transport-assessments.txt`,
    used: 'To confirm that the transport guidance had not been revised when retrieved.' },
  { id: 'tps-article', group: 'awaited', kind: 'Commentary', title: 'The new NPPF: at last a coherent national policy architecture for integrating land use, transport and placemaking', publisher: 'Local Transport Today; written by the Transport Planning Society\'s policy lead for development and land use', date: '8 September 2026',
    url: 'https://www.transportxtra.com/publications/local-transport-today/comment/81695/the-new-nppf-at-last-a-coherent-national-policy-architecture-for-integrating-land-use-transport-and-placemaking', ref: 'sources:guidance/tps-ltt-new-nppf-coherent-architecture.txt',
    used: 'That the revised transport guidance was still awaited on 8 September 2026 and is being prepared by the DfT with MHCLG.' },
  { id: 'pins-webinar', group: 'training', kind: 'Training', title: 'Planning Inspectorate webinars: Webinar 6, "What is meant by a sustainable location?"', publisher: 'Planning Inspectorate (PINS)', date: 'Webinar held 4 June 2025; page last updated 9 July 2026',
    url: 'https://www.gov.uk/guidance/planning-inspectorate-webinars', ref: `open:${OGL}pins-webinars.txt`,
    used: 'The date, title and description of the webinar, and the links to the recording and the slides.' },
  { id: 'pins-slides', group: 'training', kind: 'Training', title: 'Sustainable locations: transport considerations in the light of the revised Framework (webinar slides, 27 pages)', publisher: 'PINS', date: 'June 2025',
    url: 'https://assets.publishing.service.gov.uk/media/68428d2cfa0289a17a3e87cd/Sustainable_locations_-_webinar_01_05_25.pdf', ref: `open:${OGL}pins-webinar-sustainable-locations-slides.txt`,
    used: 'The distances, the route-quality points, the questions to ask and the conclusion quoted on the summary page.' },
  { id: 'itm-foi', group: 'training', kind: 'Freedom of Information release', title: 'Request for Inspector Training Manual and Model Planning Conditions, England', publisher: 'WhatDoTheyKnow; reply from PINS', date: 'Request of 25 January 2024',
    url: 'https://www.whatdotheyknow.com/request/request_for_inspector_training_m', ref: 'sources:guidance/b4-wdtk-request-inspector-training-manual-model-conditions.txt',
    used: 'That the Inspector Training Manual is released on request and is described by PINS as not being Government policy or guidance. We do not hold the Manual itself.' },
  { id: 'ate-advice', group: 'earlier', kind: 'Official advice', title: 'Standing Advice Note: Active travel and sustainable development', publisher: 'Active Travel England (ATE)', date: 'June 2024',
    url: 'https://assets.publishing.service.gov.uk/media/667ace3fc7f64e234208ffb5/ate-travel-sustainable-development.pdf', ref: `open:${OGL}ate-standing-advice-sustainable-development.txt`,
    used: 'The 800 metre and 400 metre criteria, and the instruction to measure along routes rather than in straight lines.' },
  { id: 'ate-toolkit', group: 'earlier', kind: 'Official tool', title: 'Active Travel England: planning application assessment toolkit', publisher: 'ATE', date: 'Published 1 June 2023; updated 3 July 2023',
    url: 'https://www.gov.uk/government/publications/active-travel-england-planning-application-assessment-toolkit', ref: `open:${OGL}ate-planning-application-assessment-toolkit.txt`,
    used: 'What the toolkit is for and its dates. The toolkit itself is a spreadsheet; we have not reviewed its contents.' },
  { id: 'manual-for-streets', group: 'earlier', kind: 'Official guidance', title: 'Manual for Streets', publisher: 'Department for Transport, and Communities and Local Government', date: '29 March 2007',
    url: 'https://www.gov.uk/government/publications/manual-for-streets', ref: 'sources:guidance/dft-manual-for-streets-2007.txt', dateRef: `open:${OGL}dft-manual-for-streets-page.txt`,
    used: 'Paragraph 4.4.1, which describes the 800 metre "walkable neighbourhood".' },
  { id: 'sustrans', group: 'earlier', kind: 'Research report', title: 'Walkable neighbourhoods: building in the right places to reduce car dependency', publisher: 'Sustrans', date: '16 May 2022',
    url: 'https://www.sustrans.org.uk/media/10606/walkable-neighbourhoods-text-only-report.docx', ref: 'sources:guidance/sustrans-walkable-neighbourhoods.txt',
    used: 'Its recommended distances and its finding on how councils measure access to services when allocating sites.' },
  { id: 'ciht-walking', group: 'earlier', kind: 'Professional guidance', title: 'Planning for Walking', publisher: 'Chartered Institution of Highways and Transportation (CIHT)', date: 'April 2015',
    url: 'https://www.ciht.org.uk/media/4465/planning_for_walking_-_long_-_april_2015.pdf', ref: 'sources:guidance/ciht-planning-for-walking-2015.txt',
    used: 'Its figure for how many short journeys are walked. It refers to the earlier "Providing for Journeys on Foot" (2000), which we do not hold.' },
  { id: 'wokingham', group: 'earlier', kind: 'Council evidence', title: 'Settlement hierarchy assessment', publisher: 'Wokingham Borough Council', date: 'September 2024',
    url: 'https://www.wokingham.gov.uk/sites/wokingham/files/2024-09/Settlement%20hierarchy%20assessment%20September%202024.pdf', ref: 'sources:guidance/wokingham-settlement-hierarchy-assessment-sept-2024.txt',
    used: 'An example of how a council places settlements in tiers by auditing services, facilities and public transport.' },
];
const byId = new Map(SRC.map((s) => [s.id, s]));
for (const s of SRC) if (!fs.existsSync(resolveRef(s.ref))) throw new Error(`held copy missing for ${s.id}: ${s.ref}`);
const ref = (id) => { if (!byId.has(id)) throw new Error('unknown source ' + id); return byId.get(id).ref; };
/** A link to the published document, and "[source]" to its entry on the sources page. */
const doc = (id, label) => `<a href="${esc(byId.get(id).url)}">${label}</a>`;
const cite = (id, where) => `${where} <a href="${SOURCES_PAGE}#${id}">[source]</a>`;
const q = (id, text, where) => quote(ref(id), text, cite(id, where));
const ck = (id, text) => check(ref(id), text);

// ---- Dates and facts stated on the sources page, each checked against the held copy ----
ck('connectivity-tool', '26 June 2025');
ck('connectivity-tool', '3 July 2026');
ck('connectivity-tool', 'Added link to updated guidance on interpreting connectivity scores.');
ck('ppg-transport', '6 March 2014');
ck('ppg-transport', 'Revision date: 06 03 2014');
ck('tps-article', '08 September 2026');
ck('tps-article', 'Policy Lead for Development and Land Use at the Transport Planning Society');
ck('pins-webinar', 'Webinar 6 - What is meant by a sustainable location?');
ck('pins-webinar', 'Date: Wednesday, 04 June 2025');
ck('pins-webinar', '9 July 2026');
ck('pins-slides', 'Transport considerations in the light of the revised Framework');
ck('ate-advice', 'Published: June 2024');
ck('ate-toolkit', '1 June 2023');
ck('ate-toolkit', '3 July 2023');
ck('ate-toolkit', 'MS Excel Spreadsheet');
check(byId.get('manual-for-streets').dateRef, '29 March 2007');
ck('sustrans', 'Date of publication: 16 May 2022');
ck('ciht-walking', 'Published April 2015');
ck('ciht-walking', 'Providing for journeys on foot');
ck('wokingham', 'September 2024');
ck('government-response', 'August 2026');
ck('manual-for-streets', 'and Communities and Local Government.');
// The PPG had no mention of the 2026 approach when retrieved.
const ppgText = fs.readFileSync(resolveRef(ref('ppg-transport')), 'utf8');
if (/vision-led|connectivity tool/i.test(ppgText) || /Revision date: (?!06 03 2014)/.test(ppgText)) throw new Error('the transport PPG has changed: revise the "Guidance still to come" section');

// ---- Figures from the decisions database and the decision-letter corpus ----
const fw26 = [...caseById.values()].filter((c) => c.nppf_applied === '2026-08');
const tr3 = fw26.filter((c) => (c.policy_findings || []).some((f) => /^TR3/.test(f.policy)));
const corpusDir = path.join(OPEN, 'pins-corpus');
const letters = fs.readdirSync(corpusDir).filter((f) => f.endsWith('.txt')).map((f) => fs.readFileSync(path.join(corpusDir, f), 'utf8').replace(/\s+/g, ' '));
const mention = (re) => letters.filter((t) => re.test(t)).length;
const n = { letters: letters.length, phrase: mention(/sustainable location/i), tool: mention(/connectivity tool/i), mfs: mention(/manual for streets/i), jof: mention(/journeys on foot/i) };
const num = (x) => x.toLocaleString('en-GB');

// ---- What decisions have turned on, from the location-factors register ----
const N = num(TOTALS.assessed);
const [walk, bus, near, footway, lighting, dist, benchmark, scale, tier, score] = ['A', 'D', 'B', 'A1', 'A3', 'B1', 'B2', 'H1', 'I1', 'J1'].map(stat);
const factorsLink = (anchor, label = 'factors in decisions') => `<a href="${FACTORS_PAGE}${anchor ? '#' + anchor : ''}">[${label}]</a>`;
holds(CLASSES.every((c) => c.code === 'A' || stat(c.code).decisive.length < walk.decisive.length), 'the walking route is decisive more often than any other class');
holds(Math.abs(dist.plus - dist.minus) <= 5, 'distance counted for the location about as often as against it');
holds(footway.n > 4 * score.n && lighting.n > 4 * score.n, 'footway and lighting are factors far more often than a Connectivity Tool score');
holds(score.decisive.length > score.n / 2, 'where a score was cited it was usually among the decisive factors');
holds(benchmark.n < dist.n / 4, 'a distance benchmark was applied in a small share of the decisions that weighed distance');
holds(scale.plus > 0 && scale.minus > 0 && scale.aside > 0, 'decisions differ on scale');
holds(tier.decisive.length < tier.n / 4, 'a settlement tier is rarely decisive');

// ---- Summary page ----
const short = `<section id="in-short"><div class="rule"><h2>In short</h2><ul>
<li>We have not found a single manual that explains how to assess a sustainable location under the August 2026 National Planning Policy Framework (NPPF). The assessment is put together from the sources below.</li>
<li><b>The test</b> is in policy TR3 of the Framework: a sustainable location limits the need to travel and offers a genuine choice of transport modes.</li>
<li><b>The official measure</b> is the Department for Transport (DfT) Connectivity Tool, which the Framework says should be used alongside other evidence. Its own guidance says it does not give a final judgement.</li>
<li><b>Revised national guidance on transport is promised</b> but had not been published when this page was last checked (${RETRIEVED}).</li>
<li><b>The most direct training material</b> is a Planning Inspectorate (PINS) webinar of June 2025, "What is meant by a sustainable location?". It was written for the December 2024 Framework, whose wording TR3 carries forward.</li>
<li><b>In decisions, the walking route is what most often decides.</b> In the ${N} decisions since August 2026 that assess a location, the quality of the walking route was among the decisive factors in ${num(walk.decisive.length)}. Distance counted for the location about as often as against it (${num(dist.plus)} decisions to ${num(dist.minus)}). The count is on the sub-page <a href="${FACTORS_PAGE}">What decides a sustainable location</a>.</li>
</ul><p class="note">Every document relied on is listed, with its date and what it was used for, on the <a href="${SOURCES_PAGE}">sources page</a>. Two more sub-pages look at decisions: <a href="${FACTORS_PAGE}">What decides a sustainable location</a> counts every factor decision-makers have used, and <a href="${PAGE}service-village/">Service Village Does Not Mean Sustainable</a> looks at how they have treated a settlement's tier in a council's settlement hierarchy.</p></div></section>`;

const test = `<section id="test"><h2>The test: policy TR3</h2>
<p>The Framework's national decision-making policy TR3, "Locating development in sustainable locations", says what a sustainable location is:</p>
${q('nppf-2026', 'Development proposals which could generate a significant amount of movement, in the context of the area within which they would be situated, should be in locations that are sustainable (or which can be made so, taking into account planned improvements, including any provided for as part of the development itself). This means the location should limit the need to travel, particularly by private car, and offer a genuine choice of transport modes for residents and users, unless the nature of the development would make this impractical', 'NPPF, TR3(1)(a)')}
<p>Three things follow from the wording:</p>
<ul>
<li>The test is aimed at proposals that "could generate a significant amount of movement", judged "in the context of the area".</li>
<li>A location can be sustainable now, or be made so by planned improvements, including ones the development itself provides.</li>
<li>There are two parts: limiting the need to travel, and a genuine choice of transport modes. TR3 sets no distances.</li>
</ul>
<p>For rural areas TR3 adds:</p>
${q('nppf-2026', 'In rural areas, opportunities to improve walking, wheeling, cycling and public transport and enhance the connectivity of an area should be taken where they exist and can be supported by the development proposed.', 'NPPF, TR3(1)(e)')}
<p>Other policies point back to TR3. For example, one of the conditions for development on grey belt land in the Green Belt is:</p>
${q('nppf-2026', 'The development would be in a sustainable location, with particular reference to policy TR3 of this Framework', 'NPPF, GB7(1)(g)(iii)')}
<p>The core wording is not new. The December 2024 Framework said:</p>
${q('nppf-2024', 'Significant development should be focused on locations which are or can be made sustainable, through limiting the need to travel and offering a genuine choice of transport modes.', 'NPPF December 2024, paragraph 110')}
<p>That is why training and guidance written before August 2026 is still useful, if read with care.</p>
</section>`;

const tool = `<section id="connectivity-tool"><h2>The official measure: the Connectivity Tool</h2>
<p>TR3 names one tool, and the Framework's glossary defines what it measures:</p>
${q('nppf-2026', 'The Connectivity Tool (Connectivity Tool - GOV.UK) should be used alongside other relevant quantitative or qualitative evidence in assessing the connectivity of particular locations proposed for development.', 'NPPF, TR3(2)')}
${q('nppf-2026', 'The degree to which a location provides access to jobs, services, and facilities by sustainable transport modes.', 'NPPF, Annex B, "Connectivity"')}
<p>The ${doc('connectivity-tool', 'Connectivity Tool')} is published by the DfT. The full version is for built environment professionals in the public or private sector. A limited version, <a href="https://connectivity-tool-lite.dft.gov.uk">Connectivity Tool Lite</a>, shows the scores and is open to anyone without registration.</p>
<h3>How to read a score</h3>
<p>The DfT's guidance, ${doc('connectivity-scores', 'Interpreting connectivity scores')}, is the nearest thing to a manual. Its main points:</p>
<ul>
<li>Each square on the map gets a score from 0 to 100, calculated "as a percentage relative to the highest-scoring square in England and Wales, which is 100".</li>
<li>The score is relative: "A score of 50 does not mean that a location has average connectivity."</li>
<li>Scores for different transport modes or destinations "should not be directly compared with each other".</li>
<li>A score is read against the Connectivity Matrix: tables of percentile thresholds for each transport mode and destination, by how urban or rural the place is.</li>
<li>Driving is left out of the overall score. The companion page, ${doc('connectivity-applying', 'Applying the Connectivity Tool')}, says driving scores "should not be used as the basis for making policies and decisions".</li>
</ul>
<p>The guidance gives a worked example. A site in a small town has an overall score of 57. Nationally that is in the bottom 30%. Compared with other "Rural town and fringe" areas it is in the top 20%. The same number reads as poorly connected or well connected depending on the comparison.</p>
<h3>What the score does not tell you</h3>
${q('connectivity-scores', 'The connectivity score does not give a final judgement on whether a location is suitable for development, investment or a transport intervention. It is one source of evidence.', 'DfT, Interpreting connectivity scores')}
${q('connectivity-applying', 'Connectivity Tool does not currently take into account the quality of walking, cycling or public transport routes. This includes aspects such as footway presence, footway width, surface type, and lighting.', 'DfT, Applying the Connectivity Tool, section 6')}
<p>The interpreting guidance also lists the cost of travel, service reliability and crowding, and the needs of different people as things the score does not measure. So a missing footway, an unlit lane or an unreliable bus has to be shown by other evidence. The government's response to the consultation on the Framework confirms that "both quantitative and qualitative evidence can be used in assessing and selecting sites, in addition to the Connectivity Tool" <a href="${SOURCES_PAGE}#government-response">[source]</a>.</p>
<p>In decisions, the things the score leaves out are the things most often relied on. In the ${N} decisions since August 2026 that assess a location, whether there is a footway was a factor in ${num(footway.n)} and street lighting in ${num(lighting.n)}. A Connectivity Tool score was a factor in ${num(score.n)}. Where a score was cited it usually mattered: it was among the decisive factors in ${num(score.decisive.length)} of them ${factorsLink('class-j')}.</p>
</section>`;
ck('connectivity-tool', 'The Connectivity Tool is available to built environment professionals in the public or private sector.');
ck('connectivity-tool', 'Connectivity Tool Lite is available to anyone without registration.');
ck('connectivity-scores', 'The Connectivity Tool gives each square a connectivity score from 0 to 100.');
ck('connectivity-scores', 'as a percentage relative to the highest-scoring square in England and Wales, which is 100');
ck('connectivity-scores', 'A score of 50 does not mean that a location has average connectivity.');
ck('connectivity-scores', 'should not be directly compared with each other');
ck('connectivity-scores', 'The Matrix shows percentile thresholds for different combinations of');
ck('connectivity-scores', 'Driving is not included in the overall connectivity score');
ck('connectivity-applying', 'should not be used as the basis for making policies and decisions');
ck('connectivity-scores', 'connectivity score of 57');
ck('connectivity-scores', 'in the bottom 30%');
ck('connectivity-scores', 'a score of 57 would put their site in the top 20% of “Rural town and fringe” Output Areas');
ck('connectivity-scores', 'the cost or affordability of travel');
ck('connectivity-scores', 'service reliability or crowding');
ck('connectivity-scores', 'the specific travel needs of different people or groups');
ck('government-response', 'both quantitative and qualitative evidence can be used in assessing and selecting sites, in addition to the Connectivity Tool');

const distance = `<section id="walking-distance"><h2>The one distance in the Framework</h2>
<p>The Framework's glossary defines a "reasonable walking distance", but only for named policies:</p>
${q('nppf-2026', 'For the purpose of policies S5, L3, GB7 (relating to land around well-connected stations), this should be considered to be around 800 metres, or around 10 minutes’ walk time if topography, route availability and quality or physical barriers would prevent or discourage walking from up to 800 metres away.', 'NPPF, Annex B, "Reasonable walking distance"')}
<p>The same definition gives around 400 metres, or five minutes, for policy HC5 on hot food takeaways. It is written for those policies. It is not a general test of a sustainable location, and TR3 does not use the term.</p>
<p>Decisions have not treated distance as a test on its own either. It was a factor in ${num(dist.n)} of the ${N} decisions since August 2026 that assess a location, counting for the location in ${num(dist.plus)} and against it in ${num(dist.minus)}. A benchmark such as 800 metres was applied in ${num(benchmark.n)}. Distance was among the decisive factors in ${num(dist.decisive.length)} decisions; whether the route has a footway was in ${num(footway.decisive.length)} ${factorsLink('class-b')}.</p>
</section>`;
ck('nppf-2026', 'For the purpose of policy HC5 (hot food takeaways) it should be considered to be around 400 metres, or around five minutes’ walk time');
const tr3Text = fs.readFileSync(resolveRef(ref('nppf-2026')), 'utf8').match(/TR3: Locating development in sustainable locations\n[\s\S]*?\nTR4: Street design/);
if (!tr3Text || /walking distance|\bmetres\b/i.test(tr3Text[0])) throw new Error('TR3 text not found, or it now sets a distance: revise "TR3 sets no distances"');

const awaited = `<section id="awaited"><h2>Guidance still to come</h2>
<p>National planning practice guidance sits beside the Framework and explains how to apply it. The government has said it will revise the guidance on transport:</p>
${q('government-response', 'the government will revise national planning practice guidance on transport to provide further information on the vision-led approach and to address points raised in consultation. This will include clarification on when the vision should be established and how authorities may set local thresholds for significant movement.', 'MHCLG, NPPF consultation: government response, August 2026')}
<p>The last point matters for TR3, which applies to proposals that could generate "a significant amount of movement". Until the guidance arrives, decisions differ on it. The size of the scheme, or the movement it would generate, was a factor in ${num(scale.n)} of the ${N} decisions since August 2026 that assess a location: it counted for the location in ${num(scale.plus)}, against it in ${num(scale.minus)}, and was raised and set aside in ${num(scale.aside)} ${factorsLink('class-h')}.</p>
<p>The revision had not appeared when we retrieved the guidance on ${RETRIEVED}. ${doc('ppg-transport', 'Travel Plans, Transport Assessments and Statements')} still carried the revision date 6 March 2014 on every paragraph, and did not mention the vision-led approach or the Connectivity Tool. On 8 September 2026 the Transport Planning Society's policy lead for development and land use called it the "still-awaited accompanying new Planning Practice Guidance on Transport", being prepared by the DfT with the Ministry of Housing, Communities and Local Government (MHCLG) <a href="${SOURCES_PAGE}#tps-article">[source]</a>.</p>
</section>`;
ck('tps-article', 'still-awaited accompanying new Planning Practice Guidance on Transport');
ck('tps-article', 'being prepared by the Department for Transport with MHCLG');

const training = `<section id="training"><h2>Training: the Planning Inspectorate webinar</h2>
<p>On 4 June 2025 PINS held a public webinar, "What is meant by a sustainable location?", presented by a planning inspector. The ${doc('pins-webinar', 'PINS webinars page')} links to the <a href="https://www.youtube.com/watch?v=yTKYHTffS80">recording</a> and the ${doc('pins-slides', 'slides')}. PINS describes it this way:</p>
${q('pins-webinar', 'this webinar covered how the 2024 National Planning Policy Framework’s new vision-led approach to transport planning affects development proposals', 'PINS, webinars page, Webinar 6')}
<p>The slides are short notes, not policy. They give these working figures under the heading "What is a sustainable location?":</p>
<ul>
<li>Walking: "Services within a 10-minute walk: 800m".</li>
<li>Cycling: "the 20minute-ride (5km)".</li>
<li>Bus services: "Distances to stop – 400m".</li>
</ul>
<p>They do not treat the figures as the answer. Routes need to be convenient, clear and legible, and comfortable and safe: adequate footways, not traffic dominated, lit and well maintained. The slide on making the assessment asks for "Options – not circles on a map", and for qualitative information on the quality of routes and the realism of alternatives. The questions the slides suggest asking of each mode are:</p>
<ul>
<li>"Would it be possible?"</li>
<li>"Would it be a realistic choice on a regular basis?"</li>
<li>"Will it get people to where they need to go?"</li>
<li>"Could a child walk safely to school?"</li>
</ul>
<p>The conclusion is that there is no formula:</p>
${q('pins-slides', 'So - what is a sustainable location? It will be a matter of planning judgement', 'PINS, Sustainable locations webinar slides, "Conclusion"')}
<p>The slides add a warning: "Remember retrofitting sustainable transport is difficult – if not impossible".</p>
<p class="note">Read it with two cautions. The webinar predates the August 2026 Framework, so its paragraph numbers (109, 110, 115 to 117) are those of the December 2024 Framework, and it says nothing about the Connectivity Tool's place in TR3(2). And it is training, not policy.</p>
<h3>The Inspector Training Manual</h3>
<p>Inspectors also work from an internal Inspector Training Manual. We have not found it published, but PINS has released it in response to Freedom of Information requests. PINS says the Manual "does not constitute Government policy or guidance and does not seek to interpret Government policy" <a href="${SOURCES_PAGE}#itm-foi">[source]</a>. We do not hold a copy, so we cannot say what it advises on the location of development, or whether it has been updated for the August 2026 Framework.</p>
</section>`;
for (const s of ['Services within a 10-minute walk: 800m', 'Cycling – the 20minute-ride (5km)', 'Distances to stop – 400m', 'What is a sustainable location?',
  'Convenient – direct routes', 'Clear and legible – well signed', 'Comfortable and safe', 'Adequate footways', 'Not traffic dominated', 'Well maintained',
  'Options – not circles on a map', 'Quality of routes', 'Realism of alternatives', 'Would it be possible?', 'Would it be a realistic choice on a regular basis?',
  'Will it get people to where they need to go?', 'Could a child walk safely to school?', 'Remember retrofitting sustainable transport is difficult – if not impossible',
  'Paragraphs 109, 110,115 and 117']) ck('pins-slides', s);
if (/connectivity tool/i.test(fs.readFileSync(resolveRef(ref('pins-slides')), 'utf8'))) throw new Error('the webinar slides mention the Connectivity Tool: revise the caution');
ck('pins-webinar', 'Presented by Sheila Holden (Planning Inspector)');
ck('itm-foi', 'does not constitute Government policy or guidance and does not seek to interpret Government policy');
ck('itm-foi', 'Please find here attached the Inspector Training Manual (ITM), in three');

const row = (cells) => `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`;
const earlier = `<section id="earlier"><h2>Guidance published before the 2026 Framework</h2>
<p>None of these was written for TR3. They give distances and methods, and the first three agree with the PINS slides on the starting point: about 800 metres, or ten minutes, on foot to everyday services. Two of them add 400 metres to a bus stop.</p>
<div class="table-wrap"><table><thead><tr><th>Source</th><th>What it says</th></tr></thead><tbody>
${row([`${doc('ate-advice', 'Active Travel England (ATE), Standing Advice Note')}, June 2024`, 'A mix of local amenities within an 800 metre walking and wheeling distance, "using well-designed routes"; most buildings within 400 metres of a high-frequency bus stop or 800 metres of a rail, light rail or tram stop.'])}
${row([`${doc('manual-for-streets', 'Manual for Streets')}, 2007, paragraph 4.4.1`, 'A range of facilities "within 10 minutes’ (up to about 800 m) walking distance of residential areas". It adds: "this is not an upper limit".'])}
${row([`${doc('sustrans', 'Sustrans, Walkable neighbourhoods')}, 2022`, 'Recommends accessibility standards "based on 800m walking and wheeling distances to key services, and 400m to bus stops".'])}
${row([`${doc('ciht-walking', 'Chartered Institution of Highways and Transportation (CIHT), Planning for Walking')}, 2015`, '"Across Britain about 80 per cent of journeys shorter than 1 mile are made wholly on foot".'])}
</tbody></table></div>
<h3>Measure the route, not the straight line</h3>
<p>ATE's advice is specific about how to measure:</p>
${q('ate-advice', 'Trip lengths to key amenities should be derived from isochrone maps using an appropriate point within the application site, rather than straight-line distances from site boundaries or main access points.', 'ATE, Standing Advice Note, June 2024, paragraph 2.5')}
<p>ATE also publishes a ${doc('ate-toolkit', 'planning application assessment toolkit')}, a spreadsheet for gathering evidence on the walking, wheeling and cycling merits of a proposal. Sustrans surveyed how councils measure access to services when allocating sites. It found that "fewer than half of responding LPAs use a distance at or below 800m as the maximum acceptable distance for accessibility" (LPAs are local planning authorities), and that many measure in a straight line <a href="${SOURCES_PAGE}#sustrans">[source]</a>.</p>
<h3>Settlement hierarchies</h3>
<p>Councils also assess whole settlements, placing each in a tier of a settlement hierarchy by auditing its services, facilities and public transport. ${doc('wokingham', 'Wokingham Borough Council\'s assessment')} of September 2024 is an example of the method. It chose judgement over arithmetic:</p>
${q('wokingham', 'A scoring system has not been used, as it was considered that it could lead to an over-simplistic assessment.', 'Wokingham Borough Council, Settlement hierarchy assessment, September 2024, paragraph 4.13')}
<p>A tier describes the settlement, not the site. In the ${N} decisions since August 2026 that assess a location, the settlement's tier was a factor in ${num(tier.n)} and among the decisive factors in ${num(tier.decisive.length)} ${factorsLink('class-i')}. Our page <a href="${PAGE}service-village/">Service Village Does Not Mean Sustainable</a> sets out how decisions have treated the difference.</p>
</section>`;
ck('ate-advice', 'A mix of local amenities should be located within an 800m walking and wheeling distance (using well-designed routes) of all residential properties');
ck('ate-advice', 'Most buildings within the application site should be within 400m of a high-frequency bus stop or 800m of a rail/light station or tram stop');
ck('manual-for-streets', 'Walkable neighbourhoods are typically characterised by having a range of facilities within 10 minutes’ (up to about 800 m) walking distance of residential areas which residents may access comfortably on foot. However, this is not an upper limit');
ck('sustrans', 'LPAs should develop Supplementary Planning Documents that set accessibility standards based on 800m walking and wheeling distances to key services, and 400m to bus stops.');
ck('ciht-walking', 'Across Britain about 80 per cent of journeys shorter than 1 mile are made wholly on foot');
ck('ate-toolkit', 'Allows local planning authorities to gather evidence and assess the active travel merits for a development proposal.');
ck('sustrans', 'fewer than half of responding LPAs use a distance at or below 800m as the maximum acceptable distance for accessibility');
ck('sustrans', 'many LPAs also use an ‘as the crow flies’ approach to measuring 800m distances');
ck('wokingham', 'An overall qualitative judgement was made based on the analysis and the outputs from the audits.');

const decisions = `<section id="decisions"><h2>In decisions</h2>
<p>How inspectors and councils apply the test is the best evidence of what it requires in practice.</p>
<ul>
<li><a href="${FACTORS_PAGE}">What decides a sustainable location</a> counts the factors used in the ${N} decisions since August 2026 that assess a location: ${FACTORS.length} factors in ${CLASSES.length} classes. The quality of the walking route was among the decisive factors in ${num(walk.decisive.length)} of them, bus services in ${num(bus.decisive.length)}, and distance or proximity in ${num(near.decisive.length)}.</li>
<li><a href="${PAGE}service-village/">Service Village Does Not Mean Sustainable</a> sets out how decisions have treated a settlement's tier.</li>
<li>The <a href="/research/england/nppf-navigator/decisions/">decisions database</a> holds ${num(caseById.size)} decisions. Of those, ${num(fw26.length)} were made under the August 2026 Framework, and ${num(tr3.length)} of them record a finding on TR3.</li>
<li>Of the ${num(n.letters)} Planning Inspectorate decision letters in the research corpus, ${num(n.phrase)} use the phrase "sustainable location", ${num(n.tool)} mention the Connectivity Tool, ${num(n.mfs)} mention Manual for Streets and ${num(n.jof)} mention "Providing for Journeys on Foot".</li>
<li>The <a href="/research/england/nppf-navigator/">NPPF 2026 Navigator</a> shows where TR3 sits in the route a decision takes through the Framework.</li>
</ul>
<p class="note">Figures are recalculated each time the page is built. The corpus includes letters decided under earlier versions of the Framework. The factor counts come from our notes on each decision, checked against the decision texts; the <a href="${FACTORS_PAGE}#method">method and its limits</a> are on the sub-page.</p>
</section>`;

const css = `<style>section>ul,.rule ul{margin:0;padding-left:20px;display:grid;gap:6px;max-width:68ch}h3{font:600 17px/1.35 var(--sans);margin-top:6px}
.table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:8px;background:var(--surface)}table{border-collapse:collapse;width:100%;font-size:14.5px}th,td{text-align:left;vertical-align:top;padding:9px 12px;border-top:1px solid var(--line)}thead th{border-top:0;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);background:var(--surface-2)}td:first-child{min-width:130px;width:36%}
.pill.kind{background:var(--accent-soft);color:var(--accent)}.meta{font-size:13.5px;color:var(--muted)}.policy p.held{font-size:13.5px;color:var(--muted)}.policy h3 a{color:inherit}</style>`;

const crumbs = '<a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/england/">England</a> › ';
const summary = page({
  title: 'Assessing a Sustainable Location',
  description: 'How to assess a sustainable location under the August 2026 NPPF: the test in policy TR3, how to read the Connectivity Tool, the transport guidance still awaited, the Planning Inspectorate webinar on the question, and the 800 metre and 400 metre distances used in practice. Every source listed.',
  url: ORIGIN + PAGE,
  breadcrumb: crumbs + 'Sustainable location',
  h1: 'How to assess a sustainable location under the 2026 NPPF',
  dek: 'What the August 2026 Framework says a sustainable location is, the official tool for measuring it, the guidance still awaited, and the earlier training and guidance that remain useful.',
  body: short + test + tool + distance + awaited + training + earlier + decisions,
  sources: [
    `<a href="${SOURCES_PAGE}">Sources for this page</a>: all ${SRC.length} documents, with dates, links and what each was used for.`,
    'National Planning Policy Framework, August 2026: TR3, GB7(1)(g)(iii), HC5 and Annex B.',
    'The <a href="/research/england/nppf-navigator/decisions/">decisions database</a> and the decision-letter corpus in the research repository.',
    `The location-factors register behind <a href="${FACTORS_PAGE}">What decides a sustainable location</a>.`,
  ],
  credit: `Prepared by Planning Distilled. External sources were retrieved on ${RETRIEVED}.`,
});

// ---- Sources sub-page ----
const GROUPS = [
  ['framework', 'The Framework', 'National policy. The August 2026 Framework is the one in force.'],
  ['tool', 'The Connectivity Tool', 'The tool named in TR3(2) and the Department for Transport\'s own guidance on using it.'],
  ['awaited', 'Guidance still to come', 'What the government has promised, the guidance as it stood, and a professional body\'s account of the position.'],
  ['training', 'Training', 'Planning Inspectorate (PINS) material for the December 2024 Framework. Training is not policy.'],
  ['earlier', 'Guidance published before the 2026 Framework', 'Official, professional and council documents that give distances or methods.'],
];
const held = (s) => (s.ref.startsWith('open:')
  ? `Copy held: <a href="${REPO}${esc(s.ref.slice(5))}">${esc(s.ref.slice(5))}</a> in the research repository (Crown copyright, Open Government Licence).`
  : 'Copy held privately for checking quotations; not ours to republish.');
const entry = (s) => `<article class="policy" id="${s.id}">
  <div class="policy-head"><h3><a href="${esc(s.url)}">${esc(s.title)}</a></h3><span class="pill kind">${esc(s.kind)}</span></div>
  <p class="meta">${esc(s.publisher)}. ${esc(s.date)}.</p>
  <p><b>Used for:</b> ${esc(s.used)}</p>
  <p class="held">${held(s)}</p>
</article>`;
const groups = GROUPS.map(([g, title, intro]) => {
  const items = SRC.filter((s) => s.group === g);
  if (!items.length) throw new Error('empty source group ' + g);
  return `<section id="${g}"><h2>${esc(title)}</h2><p>${esc(intro)}</p><div class="policies">${items.map(entry).join('\n')}</div></section>`;
}).join('\n');
if (SRC.some((s) => !GROUPS.some(([g]) => g === s.group))) throw new Error('a source has no group');
const notHeld = `<section id="not-held"><h2>Not held, so not relied on</h2>
<ul>
<li><b>The Inspector Training Manual.</b> Released by PINS on request; we hold only the correspondence about it.</li>
<li><b>"Providing for Journeys on Foot"</b> (Institution of Highways and Transportation, 2000). It is referred to in the 2015 guidance above. We do not hold a copy, so its figures are not given.</li>
<li><b>The Active Travel England toolkit spreadsheet.</b> We hold the page that publishes it and the advice note that explains its criteria, but have not reviewed the spreadsheet.</li>
<li><b>The revised transport planning practice guidance.</b> Not published when the sources were retrieved.</li>
</ul></section>`;
const sourcesPage = page({
  title: 'Sustainable Location: Sources',
  description: `The ${SRC.length} documents behind the Planning Distilled page on assessing a sustainable location under the August 2026 NPPF: the Framework, the Connectivity Tool guidance, the promised transport guidance, the Planning Inspectorate webinar, and earlier walking-distance guidance, each with its date, link and what it was used for.`,
  url: ORIGIN + SOURCES_PAGE,
  breadcrumb: `${crumbs}<a href="${PAGE}">Sustainable location</a> › Sources`,
  h1: 'Sustainable location: sources',
  dek: `Every document relied on by <a href="${PAGE}">How to assess a sustainable location under the 2026 NPPF</a>, with its publisher, date, what it was used for and where the checked copy is held. External sources were retrieved on ${RETRIEVED}.`,
  body: `<section id="how"><h2>How the sources are used</h2>
<p>Each quotation on the summary page is checked, when the page is built, against a saved copy of the document it comes from. So are the dates given here. Documents under Crown copyright are kept in the public research repository under the Open Government Licence. Copies of other publishers' documents are kept privately and quoted only briefly.</p>
<p>Abbreviations: NPPF is the National Planning Policy Framework; MHCLG is the Ministry of Housing, Communities and Local Government; DfT is the Department for Transport; PINS is the Planning Inspectorate.</p></section>
${groups}
${notHeld}`,
  sources: [`The summary page: <a href="${PAGE}">How to assess a sustainable location under the 2026 NPPF</a>.`],
  credit: 'Prepared by Planning Distilled.',
});

const out = path.join(SITE, SITE_PATH);
if (!fs.existsSync(path.join(out, 'factors', 'index.html'))) throw new Error('build the factors sub-page first: node pages/england/sustainable-location/factors/build.mjs');
fs.mkdirSync(path.join(out, 'sources'), { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), summary.replace('</head>', css + '\n</head>'));
fs.writeFileSync(path.join(out, 'sources', 'index.html'), sourcesPage.replace('</head>', css + '\n</head>'));
console.log(`✓ ${SITE_PATH} and sources/: ${SRC.length} sources; TR3 findings ${tr3.length}/${fw26.length}; corpus ${n.letters} letters (phrase ${n.phrase}, tool ${n.tool}, MfS ${n.mfs}, journeys on foot ${n.jof})`);
