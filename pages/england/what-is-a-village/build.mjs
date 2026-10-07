// What is a "village" (and a city, a town, a hamlet, a parish and a built-up area) for the purposes of the
// August 2026 NPPF: who defines each word, what the Framework does with it, how decision-makers draw the
// line between a village and a hamlet, the statistical classifications that are sometimes cited as evidence,
// and Claverdon as a worked example. Companion to the "What is a settlement" page.
//   node pages/england/what-is-a-village/build.mjs   (writes into main-site; needs ../sources for the
//   judgments, the Core Strategy, the neighbourhood plan and the South Warwickshire Local Plan it quotes)
// Every quotation is checked against its source text when the page is built; the build fails on a mismatch.
import fs from 'node:fs';
import path from 'node:path';
import { OPEN, SITE, resolveRef } from '../../../paths.mjs';
import { caseById, check, esc, page, quote } from '../../_shared/policy-weight.mjs';

const SITE_PATH = 'research/england/what-is-a-village/';
const URL = 'https://planningdistilled.org/' + SITE_PATH;
const DECISION_PAGES = '/research/england/nppf-navigator/decisions/';
const SETTLEMENT_PAGE = '/research/england/what-is-a-settlement/';
const SERVICE_VILLAGE = '/research/england/sustainable-location/service-village/';
const SUSTAINABLE = '/research/england/sustainable-location/';
const CLAVERDON = '/research/settlement/claverdon/';
const NPPF_MD = 'https://github.com/planningdistilled/research/blob/main/data/open-sources/nppf/NPPF-August-2026.md';
const RETRIEVED = '7 October 2026';
const OGL = 'open:guidance-ogl/';

// ---- Sources checked at build time ----
const WOOD = 'sources:guidance/wood-v-ssclg-2015-ewca-civ-195.txt';
const BRAINTREE = 'sources:guidance/braintree-dc-v-ssclg-2018-ewca-civ-610.txt';
const LGA_1972 = `${OGL}legislation-lga-1972-s245.txt`;
const CITIES = `${OGL}govuk-list-of-cities.txt`;
const CITY_2022 = `${OGL}govuk-city-status-platinum-jubilee-2022.txt`;
const CIVIC_HONOURS = `${OGL}cabinet-office-civic-honours-entry-guidelines-2021.txt`;
const DEFRA_RUC = `${OGL}defra-defining-rural-areas.txt`;
const ONS_RUC = `${OGL}ons-2021-rural-urban-classification.txt`;
const ONS_BUA = `${OGL}ons-2011-census-characteristics-of-built-up-areas.txt`;
const SWLP = 'sources:stratford-dc/public-note/swlp-reg19-july2026.txt';

const md = (anchor) => `${NPPF_MD}#${anchor}`;
const nppf = (text, code, anchor) => quote('nppf', text, `NPPF, August 2026, <a href="${md(anchor)}">${esc(code)}</a>`);
const placeOf = (c) => c.title.replace(/\s*\([^)]*\)\s*$/, '').split(',').slice(-1)[0].trim();
const AP = (id, para) => {
  const c = caseById.get(id);
  if (!c) throw new Error('case not in index: ' + id);
  return `<a href="${DECISION_PAGES}${encodeURIComponent(id)}.html">${esc(placeOf(c))}, appeal ${esc(c.appeal_ref || id)}</a>, ¶${para}`;
};
const pins = (id) => 'pins:' + caseById.get(id).appeal_ref;
const dl = (id, text, para) => quote(pins(id), text, AP(id, para));
const say = (id, text) => { check(pins(id), text); return `"${esc(text)}"`; };

// Facts proved from the held texts before they are stated.
const nppfText = fs.readFileSync(path.join(OPEN, 'nppf', 'NPPF-August-2026.txt'), 'utf8').replace(/\s+/g, ' ');
const count = (re) => (nppfText.match(re) || []).length;
const nVillage = count(/\bvillages?\b/gi);
const nHamlet = count(/\bhamlets?\b/gi);
const nTown = count(/\btowns?\b/gi);
const nTownCentre = count(/\btown centres?\b/gi);
const nCity = count(/\bcit(y|ies)\b/gi);
const nSettlement = count(/settlement/gi); // includes "settlement28", the footnote marker glued to the word in S5(1)(j)(i)
if (nHamlet !== 1) throw new Error(`the Framework now uses "hamlet" ${nHamlet} times: revise the page`);
if (/\bvillage:/i.test(nppfText) || /\bhamlet:/i.test(nppfText) || /\btown:/i.test(nppfText)) throw new Error('the Framework glossary now defines village, hamlet or town: revise the page');
// The list of cities: count the English entries.
const citiesText = fs.readFileSync(resolveRef(CITIES), 'utf8');
const englandBlock = citiesText.split(/^England$/m)[1]?.split(/^(?:Northern Ireland|Scotland|Wales)$/m)[0] ?? '';
const nCities = englandBlock.split('\n').map((s) => s.trim()).filter(Boolean).length;
if (nCities < 50 || nCities > 60) throw new Error(`unexpected number of English cities parsed from the list: ${nCities}`);

// ---- Where the Framework uses "village" ----
const VILLAGE_USES = [
  { code: 'Annex B, "Settlement"', anchor: 'AnnexB-settlement', q: 'Includes cities, towns, villages and other predominantly built-up areas', role: 'A village is a settlement by nature, unless it is a washed-over Green Belt village. The definition also excludes "hamlets and scattered groups of houses", the Framework\'s only use of "hamlet".' },
  { code: 'HO6(1)(b)', anchor: 'HO6-1-b', q: 'enable villages to grow and thrive, especially where this will support local services', role: 'Plan-making: allocate sites in villages.' },
  { code: 'GB4(1)(b)', anchor: 'GB4-1-b', q: 'Include villages within the Green Belt where it is necessary to restrict development because of the important contribution the open character of the village makes to the openness of the Green Belt', role: 'Plan-making: when a village should be washed over, and then "should not be identified as ‘settlements’".' },
  { code: 'GB4(1)(c)', anchor: 'GB4-1-c', q: 'such as conservation area designation where the character of a village needs to be protected for other reasons', role: 'Plan-making: protect village character by other means, not by Green Belt.' },
  { code: 'GB7(1)(c)', anchor: 'GB7-1-c', q: 'Limited infilling in villages lying within the Green Belt', role: 'Decision: the category for small-scale housing in a washed-over village. Whether a place is a "village" decides whether it is available.' },
  { code: 'Annex E, ¶3', anchor: 'AnnexE-3', q: 'Villages should not be considered large built-up areas.', role: 'Green Belt purpose (a), checking sprawl: a village is not a large built-up area.' },
  { code: 'Annex E, ¶4', anchor: 'AnnexE-4', q: 'This purpose relates to the merging of towns, not villages.', role: 'Green Belt purpose (b): the gap between two villages is not a gap between towns.' },
  { code: 'Annex E, ¶5', anchor: 'AnnexE-5', q: 'This purpose relates to historic towns, not villages.', role: 'Green Belt purpose (d): the setting of a village, however historic, is not protected by this purpose. Applied at Burnett (below).' },
];
for (const u of VILLAGE_USES) check('nppf', u.q);
check('nppf', 'References to town centres or centres apply to city centres, town centres, district centres and local centres as defined in the development plan');
check('nppf', 'Settlements do not include hamlets and scattered groups of houses located outside predominantly built-up areas, unless specifically defined as a settlement in the development plan.');

// ---- The decisions that drew the line ----
// group: ground (decided on the facts), plan (decided by a plan definition), town (village or town)
const REGISTER = [
  { id: 'PINS-6011150', group: 'ground', place: 'Chavel, Shropshire', para: '11', q: 'Chavel consists of a ribbon of houses, a restaurant, a hot food takeaway and a petrol filling station with a convenience store, to the southern side of the A458, and a more sporadic cluster of dwellings to the northern side. Due to the modest area covered by development and the prevailing sense of openness between the buildings with views of the surrounding countryside, I found that Chavel did not comprise a predominantly built-up area and therefore does not constitute a settlement for the purposes of my assessment.', note: 'Facilities do not make a village. The test applied was the area covered by buildings and the openness between them.' },
  { id: 'PINS-6010911', group: 'ground', place: 'West Willoughby, South Kesteven', para: '29', q: 'West Willoughby comprises 15 houses and no other facilities, accordingly I do not find it can be considered a predominantly built-up area', note: 'Fifteen houses and nothing else: a hamlet.' },
  { id: 'PINS-6009030', group: 'ground', place: 'Towan Cross, Cornwall', para: '10', q: 'It is notable that there are road signs at either end of the settlement which provide an impression of entering and exiting a village as one passes through along the primary road. I note that the glossary of the Framework sets out that the definition of a settlement does not include hamlets or scattered groups of houses. However, it seems to me that the clusters of development form a settlement that is akin to a small village with definable boundaries and is not a straggle of dwellings.', note: 'Several clusters with gaps between them, read together as one small village: the road signs, the definable boundaries and the absence of a "straggle".' },
  { id: 'PINS-6007179', group: 'ground', place: 'Dunmere, near Bodmin, Cornwall', para: '4', q: 'due to the small number of dwellings within the grouping, interspersed with verdant undeveloped areas and the lack of a recognisable centre or wider settlement form, I find that the character of the grouping of buildings is more akin to a low-density straggle of development', note: 'Decided under the December 2024 Framework and the Cornwall Local Plan\'s own test, but the factors are the ones the 2026 decisions use: number of dwellings, gaps, a centre, a form.' },
  { id: 'PINS-6010709', group: 'ground', place: 'Nazeing, Epping Forest', para: '9', q: 'I have not been directed to definitions within the Framework or LP, however, the Oxford English Dictionary definitions of both ‘village’ and ‘community’ refer to some aspect of people living, or having a group of houses.', note: 'With no definition to apply, the inspector used the dictionary and the view "from the ground": dispersed houses near an industrial estate were not "a discernible group of closely associated residential buildings, which would be expected within a village". The letter cites Wood v Secretary of State.' },
  { id: 'PINS-6010411', group: 'ground', place: 'Caldy, Wirral', para: '8', q: 'Both parties are in agreement that Caldy is a village and that the development would be limited in scale. They disagree, however, over whether the site is part of the village and whether it represents infilling.', note: 'The second question in a Green Belt village: not "is this a village?" but "is the site part of it?". A ribbon along the road "appears distinctly separate to the village" (¶9), so GB7(1)(c) was not met.' },
  { id: 'PINS-6010951', group: 'ground', place: 'Clavering, Uttlesford', para: '21', q: 'Clavering does not have a defined settlement boundary therefore consideration of whether the site falls within the built area of the village is a matter of planning judgement.', note: 'A "larger village" in the plan\'s hierarchy with no boundary drawn: the edge of the village is a judgement on the ground.' },
  { id: 'PINS-6008987', group: 'plan', place: 'Hamerton, Huntingdonshire', para: '6', q: 'The built-up area of a settlement is defined in the LP supporting text as a distinct group of buildings that includes 30 or more homes. The existing development adjacent to the site equates to approximately 24 homes.', note: 'A plan that sets a number. Hamerton fell below it for the plan\'s policy, though the inspector still treated it as a settlement for the Framework (¶29).' },
  { id: 'PINS-6006832', group: 'plan', place: 'Marazanvose, St Allen, Cornwall', para: '26', q: 'The supporting text to this policy (paragraph 168) refers to smaller hamlets and villages which have a form and shape and clearly defined boundaries and where infilling is allowed as settlements. It specifically excludes villages or hamlets that comprises a low density straggle of dwellings.', note: 'Cornwall\'s test: form, shape and definable boundaries, not a straggle. Used in at least six Cornwall appeals in the corpus.' },
  { id: 'PINS-6010498', group: 'plan', place: 'Higher Bal, St Agnes, Cornwall', para: '14', q: 'I am satisfied that Higher Bal constitutes a settlement for the purposes of the LP. Indeed, it does have a form and shape around a crossroads and is not just a low-density straggle of dwellings.', note: 'A place can pass the plan\'s own test and still be a hamlet for the Framework: at ¶22 the same inspector applied S5, not S4, because "the definition of a settlement does not include hamlets".' },
  { id: 'PINS-6009407', group: 'plan', place: 'Spurstow, Cheshire East', para: '8', q: 'Spurstow is not one of those defined infill villages. Therefore, in accordance with paragraph 4 of PG10, the proposal should not be considered as limited infilling in villages.', note: 'A plan that lists its "infill villages" by name. A place not on the list does not get the plan\'s infill policy.' },
  { id: 'PINS-6009255', group: 'plan', place: 'Charley, North West Leicestershire', para: '6', q: 'Given the appeal site’s location amongst a small group of dwellings with no services or facilities, the site aligns with the definition of a hamlet which sits at the bottom of the settlement hierarchy.', note: 'A hierarchy that has a "hamlet" tier at the bottom, and a Framework that then says hamlets are not settlements (¶8).' },
  { id: 'PINS-6005916', group: 'town', place: 'Burnett, Bath and North East Somerset', para: '14', q: 'Whilst the historic character of Burnett is recognised, it has not been factored into this assessment, as it is a village rather than a town, given its modest scale and the absence of everyday services and facilities therein.', note: 'Village or town matters in the Green Belt: Annex E says purpose (d) "relates to historic towns, not villages". Burnett\'s historic character counted for nothing under that purpose, and the land was grey belt.' },
  { id: 'PINS-6010198', group: 'town', place: 'Heronsgate, Three Rivers', para: '12', q: 'The prevailing impression of the area is as a verdant and very low-density residential neighbourhood. It does not have the attributes of a built-up area including a lack of street lighting, pedestrian footways or any apparent or well-defined building lines.', note: 'What "built-up" means on the ground: lighting, footways, building lines, density. A washed-over village can be a village without being a built-up area.' },
];
const groups = {
  ground: 'Decided on the ground',
  plan: 'Decided by the plan\'s own definition',
  town: 'Village or town, village or built-up area',
};
for (const r of REGISTER) check(pins(r.id), r.q);

const num = (x) => x.toLocaleString('en-GB');
const fmt = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// ---- The page ----
const short = `<section id="short"><h2>The short answer</h2>
<div class="rule">
<p><strong>Nothing in English law or national policy defines a village.</strong> The August 2026 National Planning Policy Framework (NPPF) uses the word ${nVillage} times and defines it nowhere. The Court of Appeal said the same of the 2012 Framework: no definition of a village, no minimum number of dwellings, no minimum population. Whether a group of houses is a village, and where it ends, is "a matter of fact and planning judgment for the decision-maker".</p>
<p><strong>"City" and "town" are different kinds of word.</strong> City status is an honour granted by the Crown by letters patent, with no criteria. A parish can make itself a "town" by passing a resolution. Neither status changes anything in a planning decision. The Framework's own uses of "town" are almost all about town centres.</p>
<p><strong>For a planning decision, three things settle it,</strong> in this order: what the development plan says (a boundary, a named list, a numerical threshold, or a hierarchy tier), the situation on the ground where the plan is silent or out of step with it, and the Framework's Annex B, which takes hamlets and washed-over Green Belt villages out of "settlement" whatever they are called locally. <a href="${SETTLEMENT_PAGE}">What is a settlement</a> covers that last step.</p>
</div></section>`;

const words = `<section id="words"><h2>The words, and who owns them</h2>
<div class="policies">
<article class="policy" id="city"><div class="policy-head"><h3>City</h3><span class="pill part">Crown honour</span></div>
<p>City status is granted by the monarch, on ministers' advice, by letters patent. It is usually awarded through a competition tied to a royal anniversary. The Cabinet Office's entry guidelines for the 2022 round said so plainly:</p>
${quote(CIVIC_HONOURS, 'Although there are no specific criteria for city status or Lord Mayor or Provost status', 'Cabinet Office, Platinum Jubilee Civic Honours Competition: entry guidelines, June 2021, ¶4')}
<p>and that "The decisions made by Her Majesty, on Ministerial advice, will be final." Eight places won in 2022, three of them in England (Colchester, Doncaster and Milton Keynes); the announcement said that "‘Letters Patent’ will now be prepared which will confer each of the awards formally". There is no population threshold and a cathedral is neither needed nor enough. The government keeps a <a href="https://www.gov.uk/government/publications/list-of-cities/list-of-cities-html">list of cities</a>; it names ${nCities} in England. The Local Government Act 1972 preserves the prerogative: section 245(10) makes the town-status provisions subject to any royal grant "granting the status of a city or royal borough". City status has no planning consequence. A city is a settlement under Annex B because it is a predominantly built-up area, not because of its title.</p>
${check(CIVIC_HONOURS, 'The decisions made by Her Majesty, on Ministerial advice, will be final.') ?? ''}${check(CITY_2022, 'will now be prepared which will confer each of the awards formally') ?? ''}${check(CITY_2022, 'Colchester, England') ?? ''}${check(CITY_2022, 'Doncaster, England') ?? ''}${check(CITY_2022, 'Milton Keynes, England') ?? ''}${check(LGA_1972, 'granting the status of a city or royal borough') ?? ''}
</article>
<article class="policy" id="town"><div class="policy-head"><h3>Town</h3><span class="pill part">Local choice</span></div>
<p>There is no legal test for a town. Many are historic boroughs or market towns with charters. Under section 245(6) of the Local Government Act 1972, the council of any parish not grouped with another "may resolve that the parish" "shall have the status of a town", whereupon the council "shall bear the name of the council of the town" and its chair and vice-chair are "entitled to the style of town mayor and deputy town mayor". Section 245(9) lets the council resolve the status away again. That is a naming choice, and it carries no planning status: a parish council that calls itself a town council does not make its parish a town for any policy.</p>
${check(LGA_1972, 'may resolve that the parish') ?? ''}${check(LGA_1972, 'shall have the status of a town') ?? ''}${check(LGA_1972, 'shall bear the name of the council of the town') ?? ''}${check(LGA_1972, 'entitled to the style of town mayor and deputy town mayor') ?? ''}${check(LGA_1972, 'may resolve that the parish') ?? ''}
<p>The Framework uses "town" ${nTown} times, ${nTownCentre} of them in "town centre", a term Annex B does define by reference to the policies map: "References to town centres or centres apply to city centres, town centres, district centres and local centres as defined in the development plan". The other uses that matter are in Annex E, where two of the Green Belt purposes are confined to towns: the merging purpose "relates to the merging of towns, not villages", and the historic-setting purpose "relates to historic towns, not villages". There, village or town is a planning judgement on the ground: see Burnett in the register.</p>
</article>
<article class="policy" id="village"><div class="policy-head"><h3>Village</h3><span class="pill no">Undefined</span></div>
<p>No statute defines a village and the Framework does not either. In Braintree District Council v Secretary of State, the Court of Appeal considered the 2012 Framework's policy on isolated homes in the countryside and said:</p>
${quote(BRAINTREE, 'The NPPF contains no definitions of a “community”, a “settlement”, or a “village”. There is no specified minimum number of dwellings, or population.', 'Braintree District Council v Secretary of State for Communities and Local Government [2018] EWCA Civ 610, Lindblom LJ, ¶32')}
${quote(BRAINTREE, 'Whether, in a particular case, a group of dwellings constitutes a settlement, or a “village”, for the purposes of the policy will again be a matter of fact and planning judgment for the decision-maker', 'The same, ¶32')}
<p>Three years earlier, in Wood v Secretary of State, the same court dealt with "limited infilling in villages" in the Green Belt, the policy that is now GB7(1)(c), and recorded as common ground:</p>
${quote(WOOD, 'whether or not a proposed development constituted limited infilling in a village for the purpose of paragraph 89 was a question of planning judgment for the inspector and the inspector\'s answer to that question would depend upon his assessment of the position on the ground', 'Wood v Secretary of State for Communities and Local Government [2015] EWCA Civ 195, Sullivan LJ, ¶12')}
${quote(WOOD, 'while a village boundary as defined in a Local Plan would be a relevant consideration, it would not necessarily be determinative, particularly in circumstances where the boundary as defined did not accord with the inspector\'s assessment of the extent of the village on the ground', 'The same, ¶12')}
<p>The inspector's decision was quashed because he had treated the plan's village boundary as the village. The 2026 Framework changes one part of this picture. Annex B now defines "settlement" and says it "Includes cities, towns, villages and other predominantly built-up areas", so a village is a settlement by nature. But "village" itself is still undefined, and the two carve-outs (hamlets, and villages washed over by the Green Belt) make the village-or-hamlet question the live one. Braintree had said a settlement "would not necessarily exclude a hamlet or a cluster of dwellings"; the 2026 definition now excludes exactly that unless the plan names it.</p>
${check(BRAINTREE, 'would not necessarily exclude a hamlet or a cluster of dwellings') ?? ''}
</article>
<article class="policy" id="hamlet"><div class="policy-head"><h3>Hamlet</h3><span class="pill no">Undefined; excluded</span></div>
<p>The Framework uses "hamlet" once, in the settlement definition:</p>
${nppf('Settlements do not include hamlets and scattered groups of houses located outside predominantly built-up areas, unless specifically defined as a settlement in the development plan.', 'Annex B, "Settlement"', 'AnnexB-settlement')}
<p>It does not say what a hamlet is. Local plans sometimes do: Cornwall's test is "a form and shape and clearly defined boundaries" as against "a low density straggle of dwellings"; Huntingdonshire's built-up area is "a distinct group of buildings that includes 30 or more homes"; North West Leicestershire puts "hamlet" at the bottom of its hierarchy. The Office for National Statistics' 2011 classification had a "Rural: Hamlets and Isolated Dwellings" category. The decisions below show what inspectors have counted: the number of houses, whether there is any facility, whether the buildings read as one place with a centre and a shape, and how much open land sits between them. A hamlet is still a "group of houses" for S5(1)(e), limited infilling, and S5(3), isolated homes.</p>
</article>
<article class="policy" id="parish"><div class="policy-head"><h3>Parish</h3><span class="pill part">Administrative unit</span></div>
<p>A civil parish is a unit of local government, not a settlement. It usually contains a village and the countryside, farms and hamlets around it, and its name is often the village's. The two should not be confused in a planning argument: a site "in Claverdon parish" may be two miles from Claverdon village. The Claverdon Neighbourhood Plan describes its own area that way:</p>
${quote('np', 'The church is the centre of The Village with the hamlets of Yarningale, Kington, Lye Green, and Gannaway close by.', 'Claverdon Neighbourhood Plan, made December 2019, ¶2.2')}
<p>A neighbourhood plan's area is normally the parish, and such a plan can draw the village's boundary within it; Claverdon's draws a "Village Boundary" in Policy H1.</p>
</article>
<article class="policy" id="built-up"><div class="policy-head"><h3>Built-up area</h3><span class="pill part">Two meanings</span></div>
<p>The Framework's test for a settlement by nature is a "predominantly built-up area", which it does not define. The decisions treat it as a judgement about density, continuity and street character: at Heronsgate a washed-over village of detached houses was "not built-up in character" because it lacked "street lighting, pedestrian footways or any apparent or well-defined building lines"; at Chavel a roadside group with a shop, a restaurant and a petrol station was not predominantly built-up because of "the prevailing sense of openness between the buildings".</p>
<p>The Office for National Statistics (ONS) has a separate, mapped meaning. Its Built-up Areas are drawn by an automated method from the Census:</p>
${quote(ONS_BUA, 'Built-up areas are defined as land which is ‘irreversibly urban in character’, meaning that they are characteristic of a village, town or city. They include areas of built-up land with a minimum of 20 hectares (200,000m2). Any areas with less than 200 metres between them are linked to become a single built-up area.', 'ONS, 2011 Census: Characteristics of Built-up Areas, 28 June 2013')}
<p>A 20-hectare minimum means many real villages have no ONS built-up area at all. The dataset is evidence of extent, not a planning definition, and no decision in our corpus has used it to decide whether a place is a settlement.</p>
</article>
<article class="policy" id="settlement"><div class="policy-head"><h3>Settlement</h3><span class="pill ok">Defined in Annex B</span></div>
<p>The one word the Framework does define, and the one the S4 and S5 presumptions turn on. A village is a settlement unless it is washed over by the Green Belt; a hamlet is not unless the plan names it; a council's hierarchy tier is not the test. The full definition, every policy that uses it, and the ${num(41)} decisions that have applied it are on <a href="${SETTLEMENT_PAGE}">What is a settlement under the 2026 NPPF</a>.</p>
</article>
</div></section>`;

const uses = `<section id="uses"><h2>What the Framework does with "village"</h2>
<p>Every use of the word in the August 2026 Framework, with what turns on it.</p>
<div class="table-wrap"><table><thead><tr><th>Where</th><th>Text</th><th>What turns on "village"</th></tr></thead><tbody>
${VILLAGE_USES.map((u) => `<tr><td><a href="${md(u.anchor)}"><span class="code">${esc(u.code)}</span></a></td><td><q>${esc(u.q)}</q></td><td>${u.role}</td></tr>`).join('\n')}
</tbody></table></div>
<p>So the word does real work in three places: the Annex B definition (a village is in, a hamlet is out), GB7(1)(c) (limited infilling is available in a village, not in a hamlet or a scattered group), and Annex E (two Green Belt purposes protect towns, not villages). Everywhere else it is descriptive.</p>
</section>
<section id="load-bearing"><h2>Is "village" a load-bearing distinction?</h2>
<p>Yes, in those three places, and in each the weight falls on a word the Framework never defines. By way of scale: the August 2026 Framework uses "settlement" ${nSettlement} times, "village" ${nVillage} times and "hamlet" once.</p>
<ul>
<li><strong>Annex B, the settlement definition.</strong> A village is a settlement by nature; a hamlet or scattered group is not unless the plan names it. So village-or-hamlet decides whether the S4 presumption applies at all, and whether a site can be "physically well-related to an existing settlement" under S5(1)(j)(i). Chavel, West Willoughby, Higher Bal and Marton all turned on this.</li>
<li><strong>GB7(1)(c), limited infilling in villages lying within the Green Belt.</strong> In the Green Belt the word cuts the other way. A washed-over village loses S4 under Annex B but gains this category; a hamlet in the Green Belt gets neither. Caldy and Nazeing turned on whether the site was part of a village.</li>
<li><strong>Annex E, the Green Belt purposes.</strong> Purpose (a) is about large built-up areas, which "Villages should not be considered"; purposes (b) and (d) relate to towns, "not villages". Whether a place is a village or a town therefore feeds the grey belt test, as at Burnett, where a village's historic character counted for nothing under purpose (d).</li>
</ul>
<p>The other uses, in HO6 and GB4, are plan-making instructions and carry no weight in a decision.</p>
<p>So the distinction is load-bearing, but the load is carried by planning judgment rather than by any rule. The Framework gives no threshold of houses, population or facilities, and the Court of Appeal has said twice that the question is one of fact and judgment on the ground, with a plan boundary relevant but not decisive. In practice the line is drawn by whichever of three things is available: the plan's own definition, the inspector's reading of the place, and then the Annex B carve-outs. That is why "is it a village?" has become the live argument in small rural appeals, in place of the "is it isolated?" argument that Braintree settled under the previous Framework.</p>
</section>`;

const line = `<section id="line"><h2>How the line between a village and a hamlet gets drawn</h2>
<p>Three sources of answer, used in this order.</p>
<ol>
<li><strong>The development plan.</strong> Annex B lets the plan define a settlement by a boundary, "equivalent terms" or criteria, and lets it name a hamlet as a settlement "specifically". So the first question is what the plan has done: drawn a line (a Built-Up Area Boundary, a Village Boundary, a Limit to Development), listed the places that count (Cheshire East's "infill villages"), set a threshold (Huntingdonshire's 30 homes), or written a test (Cornwall's "form and shape and clearly defined boundaries"). A hierarchy tier is evidence that the plan treats the place as a settlement, not a definition of a village; see <a href="${SERVICE_VILLAGE}">Service Village Does Not Mean Sustainable</a> for what a tier does and does not do.</li>
<li><strong>The ground.</strong> Where the plan is silent, or its line does not match what is there, the decision-maker judges the place as it is. Wood v Secretary of State says the plan's boundary is relevant but "not necessarily determinative"; Braintree says the question is one of "fact and planning judgment". The factors the 2026 decisions have used are the number of houses, whether there is any shop, school, pub or bus, whether the buildings read as one place with a centre, a form and "definable boundaries", how much open land lies between them, and (for the edge of a village) whether a site is within the built form or beyond it. Facilities on their own do not make a village (Chavel); a dictionary was used where nothing else was available (Nazeing).</li>
<li><strong>Annex B.</strong> Whatever the plan or the ground says, the Framework's definition then applies "for the purpose of this Framework": a hamlet is not a settlement unless the plan has specifically defined it as one (Higher Bal passed the plan's test and still went to S5), and a village washed over by the Green Belt is not a settlement at all.</li>
</ol>
<h3>Statistics are evidence, not policy</h3>
<p>Two official classifications are sometimes cited. The Rural-Urban Classification, produced by the ONS with Defra, is built on a population threshold:</p>
${quote(DEFRA_RUC, 'Urban areas are determined as settlements with populations of 10,000 or more, based on the 2021 Census. Rural areas are everywhere else and will include rural towns, villages, hamlets, isolated dwellings and open countryside.', 'Defra, Defining rural areas, GOV.UK, updated 14 March 2025')}
<p>The 2021 version splits rural areas only into "Larger rural settlement" and "Smaller rural settlement"; the 2011 version had "Rural: Village" and "Rural: Hamlets and Isolated Dwellings" categories, which Defra says "are equivalent to smaller rural settlements in the 2021 classification". Neither binds a decision. At Ware, an appellant argued that the site's Connectivity Tool score was in the 90th percentile for the "Rural hamlets and isolated dwellings" class; the inspector replied that "whether or not a development proposal would be in a sustainable location is a matter of planning judgement and the Connectivity Tool only forms part of this assessment" (${AP('PINS-6006224', 11)}). The ONS Built-up Areas dataset, described above, maps contiguous built land to a 20-hectare minimum and is likewise evidence of extent at most.</p>
${check(DEFRA_RUC, 'Rural villages, hamlets and isolated dwellings are equivalent to smaller rural settlements in the 2021 classification') ?? ''}${check(DEFRA_RUC, 'Rural: Hamlets and Isolated Dwellings') ?? ''}${check(DEFRA_RUC, 'Rural: Village') ?? ''}${check(ONS_RUC, 'Smaller rural settlement') ?? ''}${check(ONS_RUC, 'Larger rural settlement') ?? ''}${check(pins('PINS-6006224'), 'whether or not a development proposal would be in a sustainable location is a matter of planning judgement and the Connectivity Tool only forms part of this assessment') ?? ''}${check(pins('PINS-6006224'), 'Rural hamlets and isolated dwellings') ?? ''}
</section>`;

const regRows = (g) => REGISTER.filter((r) => r.group === g).map((r) => {
  const c = caseById.get(r.id);
  return `<article class="policy"><div class="policy-head"><h3>${esc(r.place)}</h3><span class="pill ${['allowed', 'approved'].includes(c.outcome) ? 'ok' : 'no'}">${esc(c.outcome)}</span></div>
<p class="also">Appeal <a href="${DECISION_PAGES}${encodeURIComponent(r.id)}.html">${esc(c.appeal_ref)}</a>, ${esc(fmt(c.decision_date))}, ¶${esc(r.para)}${c.nppf_applied !== '2026-08' ? ' (decided under the December 2024 Framework)' : ''}</p>
<blockquote><p>${esc(r.q)}</p></blockquote>
<p>${r.note}</p></article>`;
}).join('\n');
const register = `<section id="register"><h2>The decisions that drew the line</h2>
<p>${REGISTER.length} decisions from our corpus in which an inspector had to say whether a place was a village, a hamlet, a town or a built-up area, and what they looked at. Quotations are checked against the decision letters when this page is built. The <a href="${SETTLEMENT_PAGE}#register">settlement page</a> lists the fuller set of decisions on whether a place is a settlement.</p>
${Object.entries(groups).map(([g, title]) => `<h3 id="reg-${g}">${esc(title)}</h3><div class="policies">${regRows(g)}</div>`).join('\n')}
</section>`;

const claverdon = `<section id="claverdon"><h2>A worked example: Claverdon</h2>
<p>One parish, one village, four hamlets, and three plans that describe them differently.</p>
<ul>
<li><strong>The parish.</strong> Claverdon parish, the neighbourhood plan area, has "The Village" at its centre "with the hamlets of Yarningale, Kington, Lye Green, and Gannaway close by" (Neighbourhood Plan ¶2.2). A site at Lye Green is in Claverdon parish and is not in Claverdon village.</li>
<li><strong>The Core Strategy (2016).</strong> Stratford-on-Avon's Policy CS.15 ranks the District's places: the main town, eight Main Rural Centres, then Local Service Villages in four categories, with housing in the villages "within their Built-Up Area Boundaries (where defined) or otherwise within their physical confines". Claverdon is a Category 3 Local Service Village. The plan expects boundaries for Green Belt villages to come from a neighbourhood plan: ${quote('cs', 'Built-Up Area Boundaries will be defined either in the Site Allocations Development Plan Document or via a Neighbourhood Development Plan for those Local Service Villages that lie within the Green Belt in order to identify where limited infilling might be appropriate.', 'Stratford-on-Avon Core Strategy 2011–2031, ¶4.1.7')} Its community-led exception, Part G, applies "whether Stratford-upon-Avon, Main Rural Centre, Local Service Village or other village or hamlet": the plan itself uses "village" and "hamlet" as different things without defining either.</li>
<li><strong>The Neighbourhood Plan (2019).</strong> Draws the line the Core Strategy asked for: ${quote('np', 'Limited infill housing development will be supported within the Village Boundary defined on Figure 2 subject to Core Strategy Policy CS10 and Green Belt Policy.', 'Claverdon Neighbourhood Plan, Policy H1')} and records that "the Green Belt, which washes over the village" constrains everything else (¶4.8). So today Claverdon is a village with a boundary and a tier, and under Annex B it is not a settlement, because it is washed over.</li>
<li><strong>The South Warwickshire Local Plan (Regulation 19, July 2026).</strong> Proposes a different hierarchy in Policy DS.8: Main Urban Areas, Main Service Centres, Local Service Centres and, for the washed-over villages, a fourth tier: ${quote(SWLP, 'Rural Service Centres are those villages partly or wholly washed over by the Green Belt or Cotswolds National Landscape. Within the built-up area boundaries of the following settlements as shown on the Policies Map, development will be restricted to limited infilling.', 'South Warwickshire Local Plan, Publication version, July 2026, Policy DS.8 D')} Claverdon is not in that tier. It is listed as a Local Service Centre under DS.8 C, and Policy DS.13 A proposes to inset the "Built-up areas of villages" at Bubbenhall, Claverdon, Hatton Station, Snitterfield, Tanworth-in-Arden and Wilmcote from the Green Belt. If the plan is adopted as drafted, Claverdon's built-up area becomes an Annex B settlement and S4 applies inside its boundary; Earlswood, Wootton Wawen and the other Rural Service Centres stay washed over and outside the definition.</li>
</ul>
${check(SWLP, 'Local Service Centres') ?? ''}${check(SWLP, 'Built-up areas of villages') ?? ''}${check(SWLP, 'Snitterfield') ?? ''}${check(SWLP, 'Tanworth-in-Arden') ?? ''}${check(SWLP, 'Wootton Wawen') ?? ''}${check(SWLP, 'Earlswood') ?? ''}${check('cs', 'within their Built-Up Area Boundaries (where defined) or otherwise within their physical confines') ?? ''}${check('cs', 'whether Stratford-upon-Avon, Main Rural Centre, Local Service Village or other village or hamlet') ?? ''}${check('np', 'the Green Belt, which washes over the village') ?? ''}
<p>The practical questions for any village, in a plan review, are therefore: is the place named in the current and emerging hierarchy, and in which tier; where exactly is its boundary, or what criteria define its extent; and is it washed over or inset. All three are settled at plan examination, which is where the line is actually drawn. More on Claverdon's own decisions is on the <a href="${CLAVERDON}">Claverdon pages</a>.</p>
</section>`;

const extraCss = `<style>section>ol,section>ul{margin:0;padding-left:20px;display:grid;gap:10px;max-width:72ch}section>ol>li,section>ul>li{font-size:15.5px}section>ol blockquote,section>ul blockquote{margin-top:6px;margin-bottom:6px}h3{font:600 17px/1.35 var(--sans);margin-top:8px}
.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}table{border-collapse:collapse;width:100%;font-size:14px;min-width:640px}th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--line)}th{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}td q{display:block;font:400 13.5px/1.45 var(--serif)}
.policy h3{margin-top:0}.policy blockquote{margin-block:4px}</style>`;

const SOURCES = [
  `National Planning Policy Framework, August 2026: <a href="https://www.gov.uk/guidance/national-planning-policy-framework">GOV.UK</a>; our <a href="${NPPF_MD}">Markdown edition</a>. Annex B ("Settlement", "Town centre"), HO6, GB4, GB7, Annex E.`,
  'Braintree District Council v Secretary of State for Communities and Local Government [2018] EWCA Civ 610, 28 March 2018: <a href="https://caselaw.nationalarchives.gov.uk/ewca/civ/2018/610">The National Archives, Find Case Law</a>, ¶31 to 32.',
  'Wood v Secretary of State for Communities and Local Government and Gravesham Borough Council [2015] EWCA Civ 195, 9 February 2015: <a href="https://caselaw.nationalarchives.gov.uk/ewca/civ/2015/195">The National Archives, Find Case Law</a>, ¶12 and ¶29.',
  'Local Government Act 1972, <a href="https://www.legislation.gov.uk/ukpga/1972/70/section/245">section 245</a> (status of certain districts, parishes and communities), subsections (6), (9) and (10).',
  'Cabinet Office, <a href="https://www.gov.uk/government/publications/platinum-jubilee-civic-honours-competition">Platinum Jubilee Civic Honours Competition</a>, 8 June 2021, entry guidelines ¶4 and ¶6; and <a href="https://www.gov.uk/government/news/record-number-of-city-status-winners-announced-to-celebrate-platinum-jubilee">Record number of city status winners announced to celebrate Platinum Jubilee</a>, 20 May 2022.',
  'Ministry of Housing, Communities and Local Government, <a href="https://www.gov.uk/government/publications/list-of-cities/list-of-cities-html">List of cities</a>, 29 August 2022.',
  'Department for Environment, Food and Rural Affairs, <a href="https://www.gov.uk/government/statistics/defining-rural-areas">Defining rural areas</a>, updated 14 March 2025; Office for National Statistics, <a href="https://www.ons.gov.uk/methodology/geography/geographicalproducts/ruralurbanclassifications/2021ruralurbanclassification">2021 Rural Urban Classification</a>; and <a href="https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/characteristicsofbuiltupareas/2013-06-28">2011 Census: Characteristics of Built-up Areas</a>, 28 June 2013.',
  'Stratford-on-Avon District Core Strategy 2011–2031 (July 2016), Policy CS.15 and ¶4.1.7; Claverdon Neighbourhood Plan (made December 2019), ¶2.2, Policy H1 and ¶4.8; South Warwickshire Local Plan, Publication (Regulation 19) version, July 2026, Policies DS.8 and DS.13. Copies are held privately for verification.',
  `Decision letters: the Planning Inspectorate <a href="https://appeal-planning-decision.service.gov.uk/">appeals service</a>; every letter quoted is held in the research repository under <code>data/open-sources/pins-corpus/</code>, and each decision links to its page in the <a href="${DECISION_PAGES}">decisions database</a>.`,
  `Companion pages: <a href="${SETTLEMENT_PAGE}">What is a settlement under the 2026 NPPF</a>, <a href="${SERVICE_VILLAGE}">Service Village Does Not Mean Sustainable</a> and <a href="${SUSTAINABLE}">How to assess a sustainable location</a>.`,
];

const html = page({
  title: 'What Is a Village',
  description: `What "village", "town", "city", "hamlet", "parish" and "built-up area" mean for a planning decision under the August 2026 NPPF: who defines each word, what the Framework does with "village", how inspectors draw the line between a village and a hamlet (${REGISTER.length} decisions), the statistical classifications sometimes cited, and Claverdon as a worked example.`,
  url: URL,
  breadcrumb: '<a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/england/">England</a> › What is a village',
  h1: 'What is a "village" under the 2026 NPPF?',
  dek: `Who decides what is a city, a town, a village or a hamlet, what the Framework does with the words, how the line between a village and a hamlet is drawn in practice, and what it means for one village.`,
  body: extraCss + short + words + uses + line + register + claverdon,
  sources: SOURCES,
  credit: `Prepared by Planning Distilled. External sources were retrieved on ${RETRIEVED}.`,
});

const out = path.join(SITE, SITE_PATH);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`wrote ${path.join(out, 'index.html')}: ${REGISTER.length} decisions, "village" ${nVillage}x, "town" ${nTown}x (${nTownCentre} "town centre"), "city" ${nCity}x, "hamlet" ${nHamlet}x in the Framework; ${nCities} English cities`);
