// What is a "settlement" under the August 2026 NPPF: the Annex B definition, where the Framework
// hangs rules on the word, what follows when a place is not one (a hamlet, or a village washed over by
// the Green Belt), whether a settlement-hierarchy tier makes any difference, and every decision in the
// database and the decision-letter corpus that has applied the definition.
//   node pages/england/what-is-a-settlement/build.mjs   (writes into main-site; needs ../sources for the
//   council reports and the third-party commentary it quotes)
// Every quotation is checked against its source text when the page is built; the build fails on a mismatch.
import fs from 'node:fs';
import path from 'node:path';
import { DECISIONS, OPEN, SITE } from '../../../paths.mjs';
import { caseById, caseLink, check, esc, page, quote } from '../../_shared/policy-weight.mjs';

const SITE_PATH = 'research/england/what-is-a-settlement/';
const URL = 'https://planningdistilled.org/' + SITE_PATH;
const DECISION_PAGES = '/research/england/nppf-navigator/decisions/';
const SERVICE_VILLAGE = '/research/england/sustainable-location/service-village/';
const SUSTAINABLE = '/research/england/sustainable-location/';
const ROUTE = '/research/england/nppf-navigator/route/';
const STRATFORD = '/research/authority/stratford-dc/nppf-2026-decisions/';
const PINS_APPEALS = 'https://appeal-planning-decision.service.gov.uk/comment-planning-appeal/appeals/';
const GOVUK_ANNEX_B = 'https://www.gov.uk/guidance/national-planning-policy-framework-annex-b-glossary';
const GOVUK_NPPF = 'https://www.gov.uk/guidance/national-planning-policy-framework';
const NPPF_MD = 'https://github.com/planningdistilled/research/blob/main/data/open-sources/nppf/NPPF-August-2026.md';
const RETRIEVED = '7 October 2026';

// ---- Sources checked at build time ----
const GOV_RESPONSE = 'open:guidance-ogl/mhclg-nppf-consultation-government-response.txt';
const DRAFT_2025 = 'open:guidance-ogl/mhclg-draft-nppf-december-2025.txt';
const NPPF_2024 = 'open:nppf/NPPF-December-2024.txt';
const HWGPNFY = 'sources:guidance/hwgpnfy-s20e1-youtube.txt';
const PLANNING_GEEK = 'sources:guidance/planninggeek-build-outside-settlement-boundary.txt';
const CORNERSTONE = 'sources:guidance/cornerstone-revised-nppf-rules-based-planning.txt';
const LGA = 'sources:guidance/b4-lga-nppf-august-2026-changes-briefing.txt';
const SODC = 'sources:guidance/south-oxfordshire-nppf-consultation-response.txt';
const LIVEDIN = 'sources:guidance/livedin-nppf-2026-terminology.txt';

const md = (anchor) => `${NPPF_MD}#${anchor}`;
const nppf = (text, code, anchor) => quote('nppf', text, `NPPF, August 2026, <a href="${md(anchor)}">${esc(code)}</a>`);
/** "Place, appeal 6009919, ¶49", linking to the decision page, or to the appeals service for a letter not yet distilled. */
// The definition straddles a printed page break in the text extract, so it is checked in two halves.
const ANNEX_B_1 = 'Settlement: Includes cities, towns, villages and other predominantly built-up areas, including land which is allocated or has permission for development which will form part of the built-up area once the development is complete. This includes areas defined as a settlement in the';
const ANNEX_B_2 = 'development plan (whether using defined settlement boundaries or equivalent terms, or criteria for identifying settlement extents where boundaries have yet to be defined). Settlements do not include hamlets and scattered groups of houses located outside predominantly built-up areas, unless specifically defined as a settlement in the development plan. For the purpose of this Framework they also exclude villages which lie within and are defined as part of the Green Belt in the development plan.';
function annexB() {
  check('nppf', ANNEX_B_1);
  check('nppf', ANNEX_B_2);
  return `<blockquote><p>${esc(ANNEX_B_1 + ' ' + ANNEX_B_2)}</p><cite>NPPF, August 2026, <a href="${md('AnnexB-settlement')}">Annex B, "Settlement"</a></cite></blockquote>`;
}
/** The place from a case title: the last comma-separated part, with any trailing parenthesis removed first. */
const placeOf = (c) => c.title.replace(/\s*\([^)]*\)\s*$/, '').split(',').slice(-1)[0].trim();
/** "Place, appeal 6009919, ¶49", linking to the decision page, or to the appeals service for a letter not yet distilled. */
const AP = (id, para) => {
  const c = caseById.get(id);
  if (!c) return `appeal <a href="${PINS_APPEALS}${id.slice(5)}">${esc(id.slice(5))}</a>, ¶${para}`;
  return `<a href="${DECISION_PAGES}${encodeURIComponent(id)}.html">${esc(placeOf(c))}, appeal ${esc(c.appeal_ref || id)}</a>, ¶${para}`;
};
const pins = (id) => 'pins:' + caseById.get(id).appeal_ref;
/** A checked quotation from a decision letter in the corpus. */
const dl = (id, text, para) => quote(pins(id), text, AP(id, para));
/** A checked quotation from a council officer report held in the private sources checkout. */
const report = (id, text, where) => quote('case:' + id, text, `${caseLink(id)}, officer report, ${where}`);

// The December 2024 Framework had no glossary entry for "settlement". Prove the negative before stating it.
const nppf2024 = fs.readFileSync(path.join(OPEN, 'nppf', 'NPPF-December-2024.txt'), 'utf8');
if (/^\s*Settlement:/m.test(nppf2024)) throw new Error('the December 2024 Framework text now has a "Settlement:" glossary entry: revise "What changed"');
// The December 2025 draft definition had no Green Belt sentence.
const draft = fs.readFileSync(path.join(OPEN, 'guidance-ogl', 'mhclg-draft-nppf-december-2025.txt'), 'utf8').replace(/\s+/g, ' ');
if (/defined as part of the Green Belt/i.test(draft)) throw new Error('the December 2025 draft text contains the Green Belt sentence: revise "What changed"');

// Quotations from case files (for council decisions whose reports are PDFs not read by the shared checker).
const caseText = (id) => fs.readFileSync(path.join(DECISIONS, 'cases', `${id}.md`), 'utf8').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ');
const fromCase = (id, text, where) => {
  if (!caseText(id).includes(text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"'))) throw new Error(`${id}: case file does not contain "${text}"`);
  return `<blockquote><p>${esc(text)}</p><cite>${caseLink(id)}, officer report, ${esc(where)}; as recorded in the case file</cite></blockquote>`;
};

// ---- Every use of "settlement" in the decision-making and plan-making policies ----
// Each row: the policy, what the word does there, and what follows when the place is not a settlement.
// `q` is checked against the Framework text.
const USES = [
  { code: 'S2(1)(a)', anchor: 'S2-1-a', kind: 'Plan-making', q: 'Settlements within the development plan area (applying the definition in the glossary at Annex B), whether existing or proposed, and their boundaries', role: 'Plans must identify settlements using the Annex B definition, and their boundaries.', not: 'A place the plan leaves out, or a village it keeps in the Green Belt, is not identified as a settlement.' },
  { code: 'S2(1)(c)', anchor: 'S2-1-c', kind: 'Plan-making', q: 'Designations and associated policies to safeguard gaps between settlements should be used only where they are necessary to maintain the separate identities of the settlements', role: 'Gap policies protect the separation of settlements.', not: 'A gap policy cannot be justified by the separate identity of a hamlet.' },
  { code: 'S3(1)(a) and (b)', anchor: 'S3-1', kind: 'Decision route', q: 'Policy S4 in this Framework should be applied when considering development proposals within settlements', role: 'The fork: S4 inside a settlement, S5 outside.', not: 'The proposal goes to S5. In the Green Belt, S5(5) sends it on to GB6 to GB8.' },
  { code: 'S3(2)', anchor: 'S3-2', kind: 'Decision route', q: 'Where a development proposal falls partly within and partly outside a settlement, policies S4 and S5 should be applied to the relevant parts', role: 'A site straddling the boundary is split.', not: 'Nothing to split: the whole site is outside.' },
  { code: 'S4(1)', anchor: 'S4-1', kind: 'Decision', q: 'Development proposals within settlements should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects', role: 'The general presumption in favour of development.', not: 'Not available. This is the rule that excluded places lose.' },
  { code: 'S5(1)', anchor: 'S5-1', kind: 'Decision', q: 'Only certain forms of development should be approved outside settlements', role: 'A closed list of ten categories.', not: 'This is the policy that applies instead, outside the Green Belt.' },
  { code: 'S5(1)(b)', anchor: 'S5-1-b', kind: 'Decision', q: 'Development for rural businesses and services, including tourism, where a location outside settlements is shown to be necessary', role: 'Rural business must show it needs to be outside.', not: 'The need test applies.' },
  { code: 'S5(1)(e)', anchor: 'S5-1-e', kind: 'Decision', q: 'Limited infilling within groups of houses', role: 'The category for hamlets and clusters that are not settlements.', not: 'This is the usual route for a hamlet: a gap within the group, not an extension of it.' },
  { code: 'S5(1)(h)(ii)', anchor: 'S5-1-h-ii', kind: 'Decision', q: 'Be physically well-related to the station or the settlement within which the station is located', role: 'Housing near a well-connected station.', not: 'The relationship is measured to the station or to its settlement.' },
  { code: 'S5(1)(i)', anchor: 'S5-1-i', kind: 'Decision', q: 'The development of land allocated for that purpose in the development plan (where this lies outside settlements)', role: 'Allocated land outside settlements.', not: 'An allocation still counts; and under Annex B, allocated land that will join the built-up area is itself part of the settlement.' },
  { code: 'S5(1)(j)(i)', anchor: 'S5-1-j-i', kind: 'Decision', q: 'Be physically well-related to an existing settlement', role: 'The unmet-need route, including where there is no five-year housing land supply.', not: 'Fails if the nearest built form is a hamlet or scattered group: it is not "an existing settlement" to be well-related to.' },
  { code: 'S5(3)', anchor: 'S5-3', kind: 'Decision', q: 'Development proposals comprising isolated homes, which are those lying outside settlements or groups of houses, should not be approved other than in accordance with policy HO11', role: 'Defines isolated homes by reference to settlements and groups of houses.', not: 'A home outside both is isolated and goes to HO11.' },
  { code: 'HO4(1)', anchor: 'HO4-1', kind: 'Plan-making', q: 'such as new settlements, new urban quarters or significant extensions to existing settlements', role: 'Strategic sites.', not: 'Descriptive only.' },
  { code: 'HO10(1) and (2)', anchor: 'HO10-1', kind: 'Decision', q: 'Development proposals for housing on land not already allocated for this purpose, and which are located outside settlements, should be supported where they are', role: 'Exception sites (rural exception and community-led) are outside settlements by definition, and HO10(2)(a) says they should "Adjoin or be physically well-related to a settlement"; HO10(2)(b) caps them at 5% of "the existing settlement".', not: 'An exception site next to a hamlet, or next to a washed-over village, has no settlement to adjoin or to measure 5% against.' },
  { code: 'HO12(1)(a)', anchor: 'HO12-1-a', kind: 'Decision', q: 'may also mean that locations not well-related to existing settlements may be appropriate', role: 'Traveller sites: the settlement relationship is relaxed.', not: 'Relaxed anyway.' },
  { code: 'E4(2)', anchor: 'E4-2', kind: 'Decision', q: 'Development proposals to meet business needs in rural areas may need to be located outside settlements, and in locations that are not well served by public transport', role: 'Rural business outside settlements.', not: 'Applies; the policy then asks for the location to be justified.' },
  { code: 'L2(1)(d)', anchor: 'L2-1-d', kind: 'Decision', q: 'Creating additional homes or floorspace within settlements by using the airspace above existing residential and commercial premises, or through sensitive redevelopment or additional development within existing plots', role: 'Airspace and plot development, and the residential-curtilage test that S4(2)(a)(ii) picks up.', not: 'Not engaged outside a settlement (one Stratford report applied it in a washed-over village: see the register).' },
  { code: 'L3(2)(a) and (b)', anchor: 'L3-2-a', kind: 'Decision', q: 'Within settlements, development proposals for residential and mixed-use development should contribute to an increase in the density of the area in which they are situated', role: 'The density duty applies within settlements. L3(2)(b) covers land "Outside settlements" and land that "will form part of a settlement (as defined in the glossary at Annex B)".', not: 'The "best use of a site\'s development potential" test in L3(2)(b) applies instead.' },
  { code: 'GB1(1)', anchor: 'GB1-1', kind: 'Plan-making', q: 'for example when planning for new settlements or major urban extensions', role: 'New Green Belts.', not: 'Descriptive only.' },
  { code: 'GB4(1)(b)', anchor: 'GB4-1-b', kind: 'Plan-making', q: 'Such villages should not be identified as ‘settlements’ for the purpose of the spatial strategy in the development plan', role: 'Villages kept in the Green Belt are not to be identified as settlements in the spatial strategy. This is the plan-making half of the Annex B exclusion.', not: 'The village is washed over and stays outside the settlement route until a plan insets it.' },
  { code: 'GB4(1)(g)', anchor: 'GB4-1-g', kind: 'Plan-making', q: 'safeguarded land is not allocated for development at the present time (and does not form part of settlements)', role: 'Safeguarded land is outside settlements.', not: 'Outside.' },
  { code: 'GB7(1)(c)', anchor: 'GB7-1-c', kind: 'Decision', q: 'Limited infilling in villages lying within the Green Belt', role: 'The Green Belt category written for washed-over villages. It uses "villages", not "settlements".', not: 'This is the route a washed-over village gets instead of S4: limited infilling that is not inappropriate development, then the S5(5) balance.' },
  { code: 'GB7(1)(h)(ii)', anchor: 'GB7-1-h-ii', kind: 'Decision', q: 'Be physically well-related to the station or the settlement within which the station is located', role: 'Green Belt housing near a well-connected station.', not: 'As S5(1)(h)(ii).' },
  { code: 'DP3(2)(d)', anchor: 'DP3-2-d', kind: 'Decision', q: 'provide good connections to the wider settlement (or those nearby)', role: 'Design: movement connections.', not: 'Connections to nearby settlements are still expected.' },
  { code: 'TR5(1)', anchor: 'TR5-1', kind: 'Decision', q: 'Development proposals for roadside facilities located outside settlements should', role: 'Roadside facilities.', not: 'Applies.' },
  { code: 'Annex B, "Out of centre"', anchor: 'AnnexB-out-of-centre', kind: 'Glossary', q: 'A location which is not in or on the edge of a centre but not necessarily outside the settlement', role: 'Town-centre tests.', not: 'Descriptive only.' },
  { code: 'Footnote 28', anchor: 'S5-1-j-i', kind: 'Decision', q: 'Where a development proposal is located outside a settlement, and separated from the existing built-up area by virtue of being beyond the outside edge of an allocated site that has yet to be fully developed', role: 'Sites beyond an undeveloped allocation.', not: 'Consider whether the location is suitable if the allocation does not proceed.' },
];
for (const u of USES) check('nppf', u.q);
// The Framework has no settlement hierarchy and no service-centre tier. Prove the negatives.
const nppfText = fs.readFileSync(path.join(OPEN, 'nppf', 'NPPF-August-2026.txt'), 'utf8').replace(/\s+/g, ' ');
for (const phrase of ['settlement hierarchy', 'service centre', 'service village', 'rural centre', 'washed over', 'washed-over', 'hamlet:']) {
  if (new RegExp(phrase, 'i').test(nppfText)) throw new Error(`the Framework now contains "${phrase}": revise the page`);
}
const uses = (nppfText.match(/settlement/gi) || []).length;

// ---- The register: every decision that applied the Annex B definition to decide whether a place is a settlement ----
// group: washed | hamlet | boundary | yes | contrary
//   washed    a village washed over by the Green Belt held not to be a settlement, or routed to GB7 on that footing
//   hamlet    a hamlet, cluster, ribbon or scattered group held not to be a settlement
//   boundary  the plan's settlement boundary taken as the Annex B settlement edge, site outside
//   yes       a place held to be a settlement although its status was questioned
//   contrary  a washed-over village treated as a settlement, or the exclusion not addressed
// Letter quotations are checked against the corpus; council quotations against the held report or the case file.
const REGISTER = [
  // washed over
  { id: 'PINS-6009919', group: 'washed', place: 'Fobbing, Thurrock', para: '49', q: 'The Glossary to the Framework states that villages which lie within and are defined as part of the Green Belt, as is the case with Fobbing, are not settlements for the purposes of the Framework, and consequently Policy S4 is not engaged. As the proposal is inappropriate development in the Green Belt, Policy S5 does not apply to it either. The proposal should therefore be determined in accordance with Policy GB7', note: 'The clearest statement in the corpus. A covered pool and annexe behind two houses in a washed-over village and conservation area; inappropriate development, no very special circumstances.' },
  { id: 'PINS-6011803', group: 'washed', place: 'Toms Lane, Kings Langley, Three Rivers', para: '18', q: 'The Council has expressed that it considers the site to be within the built-up area and therefore, that policy S4 of the Framework applies. I do accept that the site has strong connections to more built-up areas and its character is not dissimilar to a suburban environment. However, the site is designated in the Local Plan as being washed over by the Green Belt.', note: 'The council argued S4 for a suburban-looking road. The inspector held the washed-over designation and the semi-rural character took it out of a built-up area, and decided it under GB7 and the S5(5) balance.' },
  { id: 'PINS-6005162', group: 'washed', place: 'Burnham, Buckinghamshire', para: '7', q: 'In spatial policy terms the site lies just to the north of the defined settlement boundary of the village of Burnham. It therefore lies within a land use designation as open countryside, washed over by the Metropolitan GB.', note: 'Outside the boundary and in the Green Belt: GB6 and GB7 applied (¶44), not S4 or S5(1). Allowed as not inappropriate development.' },
  { id: 'PINS-6011601', group: 'washed', place: 'Stoneleigh, Warwick', para: '5', q: 'Quince Cottage is sited within Stoneleigh, defined in the Warwick District Local Plan 2011-2029 (LP) as a Limited Infill Village, which is washed over by the West Midlands Green Belt. Policy DS18 of the LP states that national planning policy will be applied to proposals within the Green Belt.', note: 'A village with a local plan tier ("Limited Infill Village"), decided under GB7 because it is washed over. The letter is in the corpus; the decision has not yet been distilled into the database.' },
  { id: 'stratford-26-01614-FUL', group: 'washed', place: 'Earlswood, Stratford-on-Avon', para: 'p.2', q: 'the application site is not considered to be within a settlement because it lies within the Green Belt', note: 'A council officer applying the exclusion in terms, in a Category 3 Local Service Village. S5 was set aside because it "does not apply to development proposals within the Green Belt", and the extension was assessed under GB6 and GB7.' },
  { id: 'PINS-6010198', group: 'washed', place: 'Heronsgate, Three Rivers', para: '12', q: 'I must also have regard to the character of the area which, although clearly exhibiting signs of development in the form of various detached and semi-detached homes, is not built-up in character.', note: 'A washed-over, very low-density village held not to be a built-up area, so a garden plot counted as previously developed land under GB7(1)(e). A different Annex B test (the garden exclusion from previously developed land), but the same reasoning about what "built-up" means in a washed-over village.' },
  // hamlets and scattered groups
  { id: 'PINS-6010911', group: 'hamlet', place: 'West Willoughby, South Kesteven', para: '29', q: 'West Willoughby comprises 15 houses and no other facilities, accordingly I do not find it can be considered a predominantly built-up area, or that the site is within a settlement and as a result policy S4 of the Framework does not apply.', note: 'Then at ¶30: with no five-year supply, S5(1)(j) still failed because "West Willoughby is not a settlement in the context of the Framework’s definition"; S5(1)(e) infilling within a group of houses applied instead. Dismissed on biodiversity net gain alone.' },
  { id: 'PINS-6010498', group: 'hamlet', place: 'Higher Bal, St Agnes, Cornwall', para: '22', q: 'I have found that the appeal site forms part of a settlement within the context of the LP. However, the glossary of the Framework makes it clear that the definition of a settlement does not include hamlets. The appellant has acknowledged within their statement of case that Higher Bal is a hamlet, and I agree with that assessment. As such, Policy S5 of the Framework is of relevance, rather than Policy S4.', note: 'The local plan treated the place as a settlement; the Framework did not. The national definition won the route.' },
  { id: 'PINS-6011150', group: 'hamlet', place: 'Chavel, Shropshire', para: '10', q: 'The definition of a settlement in the Framework includes cities, towns, villages and other predominantly built-up areas, but not hamlets and scattered groups of houses located outside predominantly built-up areas.', note: 'A roadside group with a petrol-station shop, restaurant and takeaway. Not a predominantly built-up area, so S5(1)(j) failed despite no five-year supply; seven to eight homes dismissed under S5(4).' },
  { id: 'PINS-6012304', group: 'hamlet', place: 'Marton, near Cuddington and Sandiway, Cheshire West', para: '29', q: 'The adjacent ribbon development is not defined as a settlement within the development plan and is no more than a scattered group of houses outside a predominantly built-up area. Consequently, this does not meet the Framework’s definition of a settlement.', note: 'With 1.6 years of supply, S5(1)(j)(i) still failed: the nearest defined settlement was about a kilometre away.' },
  { id: 'PINS-6009593', group: 'hamlet', place: 'Washington, Horsham', para: '13', q: 'As defined in the Framework, relevant settlements exclude hamlets and scattered groups of houses located outside predominantly built-up areas, where they are not specifically defined as a settlement in the development plan. The nearest settlements which would clearly fall within the Framework’s definition are all some distance away, and the site is not physically well-related to them.', note: 'S5(1)(j) closed; the appeal was allowed on another S5 category.' },
  { id: 'PINS-6000903', group: 'hamlet', place: 'Trewarmett, Tintagel, Cornwall', para: '5', q: 'Trewarmett is a hamlet and is not defined as a settlement in the development plan or the Framework. The site therefore lies outside of a defined settlement.', note: 'The earliest application of the definition in the corpus, eight days after the Framework took effect.' },
  { id: 'PINS-6010020', group: 'hamlet', place: 'Poundstock, Cornwall', para: '20', q: 'The site lies outside of a settlement, defined by the Framework as excluding scattered groups of houses located outside predominantly built-up areas. Consequently, Framework policy S5 is engaged.', note: 'S5(1)(e) then failed: a field gap in a loose group is not infilling.' },
  { id: 'PINS-6009632', group: 'hamlet', place: 'Holsworthy Beacon, Torridge', para: '13', q: 'Policy S4 applies within settlements, and policy S5 applies outside of them. Settlements do not include hamlets and scattered groups of houses located outside predominantly built-up areas. The pattern of development around the appeal site is somewhat sporadic and secluded, with fields opposite and behind the site.', note: 'The place also lacked the facilities to be a "Rural Settlement" under the local plan (¶5). Allowed under an S5 category.' },
  { id: 'PINS-6009255', group: 'hamlet', place: 'Charley, North West Leicestershire', para: '8', q: 'also confirms that the term ‘settlement’ does not include hamlets outside predominantly built-up areas', note: 'A hamlet at the bottom of the local settlement hierarchy (¶6). The garage conversion was allowed under S5(1)(c), re-use of an existing building.' },
  { id: 'PINS-6008739', group: 'hamlet', place: 'Great Easton, Uttlesford', para: '28', q: 'the appeal site is not physically well-related to an existing settlement as it is located at the end of a hamlet, and it is separated from the more built-up areas by open countryside', note: 'With 4.77 years of supply S5(1)(j) was engaged but failed; the end-of-row plot was not infilling within the group either (¶9).' },
  { id: 'PINS-6010166', group: 'hamlet', place: 'Pyworthy, Torridge', para: '15', q: 'Even though the appeal site is close to a few other houses, I have already found it is not well-related to an existing settlement. It therefore does not fall within category 1(j) or any other category in Framework Policy S5.', note: 'A few houses nearby are not a settlement for S5(1)(j).' },
  { id: 'PINS-6012985', group: 'hamlet', place: 'Morchard Bishop, Mid Devon', para: '9', q: 'While near a scattered group of dwellings that extends in a linear form away from the settlement, there are notable verdant gaps along this route', note: 'About 400 m from the village, but physically separated from it; not well-related (¶12).' },
  { id: 'PINS-6004780', group: 'hamlet', place: 'Hempnall Green, South Norfolk', para: '37', q: 'I have not been provided with a definition of a settlement in relation to the development plan. However, I note Annex B of the Framework specifically sets out settlements do not include hamlets and scattered groups of houses located outside predominantly built-up areas.', note: 'The Framework definition filled the gap where the plan had none. Self-build permission in principle allowed on other grounds.' },
  { id: 'PINS-6006832', group: 'hamlet', place: 'Marazanvose, St Allen, Cornwall', para: '26', q: 'Annex B of the Framework states that settlements do not include hamlets and scattered groups of houses located outside predominantly built-up areas, unless specifically defined as a settlement in the development plan.', note: 'Read alongside a Cornwall Local Plan passage that excludes "a low density straggle of dwellings" from infilling.' },
  { id: 'PINS-6008432', group: 'hamlet', place: 'Higher Trevellas, St Agnes, Cornwall', para: '13', q: 'Consequently, I find that this grouping of buildings is not a settlement for development plan purposes.', note: 'After quoting the Framework exclusion of hamlets and scattered groups (¶11).' },
  { id: 'PINS-6011423', group: 'hamlet', place: 'Beeston, Cheshire West', para: '20', q: 'Neither party has presented any evidence as to whether or not the appeal site is located within a settlement. Therefore, based on my on-site observations of the rural nature of the appeal site and its separation from any built-up areas, I find that the appeal site is not located within a settlement as defined within Annex B of the Framework. Consequently, I conclude that Policy S5 of the Framework is applicable.', note: 'The inspector decided the question unprompted, from the site visit. The letter is in the corpus; the decision has not yet been distilled into the database.' },
  { id: 'wychavon-W-26-00329-FUL', group: 'hamlet', place: 'Pinvin, Wychavon', para: 'Principle', q: 'as the site is mostly surrounded by open countryside and is clearly visually divorced from the main built development of Pinvin, it is not considered within a settlement as defined within the NPPF', note: 'A council applying the definition to a barn 700 m outside the village, among scattered dwellings.' },
  { id: 'wychavon-W-26-01322-OUT', group: 'hamlet', place: 'Drakes Broughton, Wychavon', para: 'Principle', q: 'physically the site is clearly separate from the village with it being located beyond the village\'s established northern building line … and so is not considered to be located within a predominantly built up area', note: 'A field next to a village boundary but beyond its building line is outside the Annex B settlement. Fifty homes refused under S5(4).' },
  // boundary applied
  { id: 'PINS-6008238', group: 'boundary', place: 'Buntingford, East Hertfordshire', para: '14', q: 'I have applied the definition of a settlement in Annex B of the Framework and taken the settlement of Buntingford to be that which is shown by way of a settlement boundary in the East Hertfordshire District Plan 2018 (LP).', note: 'Six hundred homes outside the boundary, allowed under S5.' },
  { id: 'PINS-6011301', group: 'boundary', place: 'Bournheath, Bromsgrove', para: '23', q: 'The glossary of the Framework offers a definition of settlement, which includes areas defined as such in the development plan and those using defined settlement boundaries. As such, I see no reason to disagree that the site is outside of the settlement by virtue of being outside of the boundary.', note: 'The plan boundary taken as the edge.' },
  { id: 'PINS-6010228', group: 'boundary', place: 'Claydon, Mid Suffolk', para: '8', q: 'Its definition of settlement includes predominantly built-up areas and areas defined as such in the development plan. The site adjoins houses but does not contain any buildings or structures. Given the boundaries on the Policies Map and the situation on the ground, the site is not within a settlement for the purposes of applying policies in the Framework.', note: 'Both limbs checked: the map and the ground.' },
  { id: 'PINS-6008569', group: 'boundary', place: 'Glenfall Way, Cheltenham', para: '9', q: 'As the site is outside the PUA, the proposed development would not be within a settlement as defined under the terms of the Framework. Accordingly, policy S5 of the Framework is applicable', note: 'The Principal Urban Area boundary taken as the settlement edge.' },
  { id: 'stratford-25-01765-FUL', group: 'boundary', place: 'Gaydon, Stratford-on-Avon', para: 'p.20', q: 'I have taken a precautionary approach and adopted the position that the site is located outside of a settlement in respect of the main built form of Gaydon Lighthorne Heath as currently exists.', note: 'The officer saw that Annex B counts allocated land that will join the built-up area, and could have treated the site as within the settlement, but applied S5 to be safe.' },
  // held to be a settlement
  { id: 'PINS-6010973', group: 'yes', place: 'Broadwas, Malvern Hills', para: '12', q: 'Even if I accept that the appeal site is not within a large built-up area, the Framework advises that the definition of settlements include areas defined as such in the development plan. Broadwas is defined as a settlement in the SWDPR 2026 and is, therefore, a settlement when considered against the definition in Annex B of the Framework.', note: 'A Category 2 settlement in the plan: the plan definition carried it. The site was still outside the boundary, in the countryside (¶9).' },
  { id: 'PINS-6008314', group: 'yes', place: 'Polegate, Wealden', para: '102', q: 'it is clear from the use of ‘includes’ that being within an area defined as settlement in the development plan is not a pre-requisite for being a settlement in the terms of the Framework', note: 'The definition is not exhaustive: a place can be a settlement on the ground without a plan boundary.' },
  { id: 'PINS-6009030', group: 'yes', place: 'Towan Cross, Cornwall', para: '10', q: 'it seems to me that the clusters of development form a settlement that is akin to a small village with definable boundaries and is not a straggle of dwellings', note: 'Several clusters with landscape gaps and village road signs, held to be a settlement under both the plan and the Framework. Dismissed on other grounds.' },
  { id: 'PINS-6008437', group: 'yes', place: 'Towan Cross, Cornwall', para: '13', q: 'The cluster of buildings in the immediate area of the appeal site, including the public house, could be considered to be a hamlet when considered in isolation. However, that cluster clearly forms part of a larger settlement with other clusters of buildings', note: 'The same place, same inspector, nine days earlier: "much more akin to a small village than a hamlet".' },
  { id: 'PINS-6009588', group: 'yes', place: 'Little Dunham, Breckland', para: '23', q: 'The term ‘settlement’ is defined as including villages. As such, I take Little Dunham to be a settlement for the purposes of the Framework. That said, and as I have described above, the appeal site is beyond the edge of the existing built form of the village. For that reason, I find the site to be outside of a settlement.', note: 'A village is a settlement because the definition says so; the site was outside its built form.' },
  { id: 'PINS-6010393', group: 'yes', place: 'East Lambrook, Somerset', para: '19', q: 'The site is well connected to existing built form, and given that it is part of an existing rear garden, it is likely that the site can be considered to form part of the settlement.', note: 'A rear garden at the edge of a small village taken as inside the settlement; S4 applied and the appeal still failed.' },
  { id: 'PINS-6008987', group: 'yes', place: 'Hamerton, Huntingdonshire', para: '29', q: 'settlement for the purposes of the Framework Glossary definition, and it also refers to it as a village in its Officer Report', note: 'The plan\'s own threshold for a built-up area was 30 homes and Hamerton had about 24 (¶6); the inspector nevertheless treated it as a settlement and the site as outside it.' },
  { id: 'PINS-6005108', group: 'yes', place: 'Drayton, Vale of White Horse', para: '137', q: 'Drayton falls within the definition of a settlement identified within Annex B and the site lies outside its built up area.', note: 'A Larger Village in the plan; 31 homes allowed under S5.' },
  { id: 'stratford-26-01687-FUL', group: 'yes', place: 'Stretton-on-Fosse, Stratford-on-Avon', para: 'p.4', q: 'Stretton-on-Fosse is predominantly built-up with a concentrated area of residential development that clearly has a physical confines which transitions from built form to open land.', note: 'A village with no Built-Up Area Boundary in the Core Strategy, held a settlement on the ground after the officer quoted the definition, including the Green Belt sentence; the village is not in the Green Belt, so it did not bite.' },
  // washed-over village treated as a settlement
  { id: 'PINS-6010097', group: 'contrary', place: 'Bledlow Ridge, Buckinghamshire', para: '15', q: 'As the proposal is within a settlement, it benefits from the in-principle support provided by policies S3 and S4 of the Framework.', note: 'A Green Belt site inside a defined settlement boundary, run through S4. The Green Belt question was left undecided because the appeal failed on heritage (¶20). Do not cite it as S4 authority for a Green Belt village.' },
  { id: 'stratford-26-01542-FUL', group: 'contrary', place: 'Earlswood, Stratford-on-Avon', para: 'p.3', q: 'The application site is within the BUAB of Earlswood as defined of page 8 of the Tanworth in Arden Neighbourhood Development Plan. I therefore find the site is an acceptable location for housing', note: 'Eight days after another officer applied the exclusion in the same village (above), this report applied S4 and L2(1)(d) and never mentioned Annex B.' },
  { id: 'stratford-26-00918-PIP', group: 'contrary', place: 'Tanworth-in-Arden, Stratford-on-Avon', para: 'TR3', q: 'The settlement of Tanworth-in-Arden contains a primary school, a church, village hall, public house/restaurant including post office, mechanic garage, dental clinic, bowls club, tennis club and recreation ground.', note: 'A Category 4 Local Service Village washed over by the Green Belt, called a settlement throughout; the report never asked the Annex B question. The route ran through GB7(1)(g), where the word does not matter, so the result did not turn on it.' },
];
const groups = {
  washed: { title: 'A village washed over by the Green Belt is not a settlement', n: 0 },
  hamlet: { title: 'A hamlet, cluster, ribbon or scattered group is not a settlement', n: 0 },
  boundary: { title: 'The plan boundary taken as the edge of the settlement', n: 0 },
  yes: { title: 'Held to be a settlement although the point was argued', n: 0 },
  contrary: { title: 'A washed-over village treated as a settlement, or the question not asked', n: 0 },
};
for (const r of REGISTER) {
  groups[r.group].n++;
  if (r.id.startsWith('PINS-') && !caseById.has(r.id)) {
    // letter in the corpus, not yet distilled: check against the corpus text directly
    check('pins:' + r.id.slice(5), r.q);
  } else if (r.id.startsWith('PINS-')) {
    check(pins(r.id), r.q);
  } else if (r.id.startsWith('wychavon-')) {
    if (!caseText(r.id).includes(r.q.replace(/[‘’]/g, "'").replace(/[“”]/g, '"'))) throw new Error(`${r.id}: case file does not contain "${r.q}"`);
  } else {
    check('case:' + r.id, r.q);
  }
}
// Every letter in the corpus that engages the definition must have a row, so the register stays complete after a harvest.
const corpusDir = path.join(OPEN, 'pins-corpus');
const ENGAGES = /(annex b|glossary)[^.]{0,200}\bsettlement|settlement[^.]{0,200}(annex b|glossary)|is not a settlement|not a settlement (?:in|for|as)|washed[- ]over|defined as part of the green belt|hamlets? (?:and|or) scattered groups?|scattered groups? of (?:houses|dwellings)|located at the end of a hamlet/i;
const EXEMPT = new Set([
  '6006672', // "colour washed over roughcast": a listed building description
  '6005108', // Annex B used for "deliverable", "affordable" and "windfall"; the settlement sentence is in the register (¶137)
  '6007179', // a hamlet near Bodmin held not a settlement under the local plan test; decided under the December 2024 Framework
  '6010442', // a cluster near Roche held not a settlement under the local plan (paragraph 1.68), not the Annex B definition
  '6006497', // "defined in Policy CSP 1" of the local plan: a category label, not the Annex B test
  '6008087', '6008532', '6010603', // washed-over villages in case-file site context only; the letters apply GB7 without discussing the definition
  '6007466', // "not a settlement" wording matched in a different sense
]);
const inRegister = new Set(REGISTER.map((r) => r.id.replace(/^PINS-/, '')));
const missing = [];
for (const f of fs.readdirSync(corpusDir)) {
  if (!f.endsWith('.txt')) continue;
  const ref = f.slice(0, -4);
  if (inRegister.has(ref) || EXEMPT.has(ref)) continue;
  const t = fs.readFileSync(path.join(corpusDir, f), 'utf8').replace(/\s+/g, ' ');
  if (ENGAGES.test(t)) missing.push(ref);
}
if (missing.length) throw new Error(`letters engage the settlement definition but have no register row (read each and add a row, or exempt it with a reason): ${missing.join(' ')}`);

const num = (x) => x.toLocaleString('en-GB');
const all = [...caseById.values()];
const fw26 = all.filter((c) => c.nppf_applied === '2026-08');
const letters = fs.readdirSync(corpusDir).filter((f) => f.endsWith('.txt')).length;
const asAt = all.map((c) => c.decision_date).sort().slice(-1)[0];
const fmt = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// ---- The page ----
const short = `<section id="short"><h2>The short answer</h2>
<div class="rule">
<p><strong>A settlement is what Annex B of the Framework says it is, and nothing else.</strong> It is a city, town, village or other predominantly built-up area, plus land allocated or permitted to join it, plus anything the development plan defines as a settlement. Two kinds of place are taken out: hamlets and scattered groups of houses (unless the plan names them), and villages that lie within and are defined as part of the Green Belt.</p>
<p>The word matters because the Framework's presumption in favour of development is split on it. Inside a settlement, policy S4 says approve unless the harm substantially outweighs the benefit. Outside, policy S5 allows only ten listed kinds of development. A place that is not a settlement never reaches S4, and cannot be the "existing settlement" that several S5 routes require a site to relate to.</p>
<p>A council's settlement hierarchy does not come into it. "Service village", "Local Service Village", "Key Service Centre" and the rest are local plan labels; the Framework does not use them. A tier bears on the question only through the plan's own definition of the place as a settlement, and the Green Belt exclusion overrides even that. <a href="#tier">Our judgement on tiers is below.</a></p>
</div></section>`;

const definition = `<section id="definition"><h2>The definition</h2>
<p>The glossary at <a href="${GOVUK_ANNEX_B}">Annex B</a> of the National Planning Policy Framework (NPPF) of 17 August 2026 reads:</p>
${annexB()}
<p>Read it as four limbs.</p>
<ol>
<li><strong>What is in by nature.</strong> Cities, towns, villages and "other predominantly built-up areas". The test is the built form on the ground. Land allocated or permitted for development that will become part of the built-up area is in from the day of the allocation or permission, not the day it is built.</li>
<li><strong>What is in by the plan.</strong> Anything the development plan defines as a settlement, whether by a drawn boundary, an "equivalent term" (a Built-Up Area Boundary, a Limit to Development, a Principal Urban Area) or criteria where no line has been drawn. The word "includes" means this limb adds to the first; it does not replace it. An inspector at Polegate put it plainly: ${dl('PINS-6008314', 'it is clear from the use of ‘includes’ that being within an area defined as settlement in the development plan is not a pre-requisite for being a settlement in the terms of the Framework', 102)}</li>
<li><strong>What is out by nature.</strong> Hamlets, and scattered groups of houses outside predominantly built-up areas. The plan can bring one back in by defining it as a settlement, but only "specifically".</li>
<li><strong>What is out by designation.</strong> Villages that "lie within and are defined as part of the Green Belt in the development plan", the villages planners call "washed over". This exclusion is absolute for the Framework's purposes: the plan cannot bring a washed-over village back in except by insetting it, which is a Green Belt boundary change under policy GB4. The sentence is scoped "for the purpose of this Framework": such a village is still a village, still a settlement in the plan's hierarchy, and still a village for GB7(1)(c), which allows "Limited infilling in villages lying within the Green Belt".</li>
</ol>
<p>Three words in the definition are not themselves defined: "village", "hamlet" and "predominantly built-up". The decisions below show inspectors deciding them on the ground: the number of houses, whether there are facilities, whether the buildings read as one place with "definable boundaries" or as "a straggle of dwellings", and whether the site is inside the built form or beyond its edge.</p>
</section>`;

const changed = `<section id="changed"><h2>Where the definition came from</h2>
<p>The December 2024 Framework had no definition of "settlement" at all. Its spatial policies turned on other words: isolated homes in the countryside, the "vitality of rural communities", and a Green Belt paragraph that said a village should be included in the Green Belt only where its open character matters to openness:</p>
${quote(NPPF_2024, 'If it is necessary to restrict development in a village primarily because of the important contribution which the open character of the village makes to the openness of the Green Belt, the village should be included in the Green Belt.', 'NPPF, December 2024, ¶150')}
<p>The December 2025 consultation draft introduced the S3 to S5 split and a definition of settlement that stopped at the hamlet sentence. It had no Green Belt sentence:</p>
${quote(DRAFT_2025, 'Settlements do not include hamlets and scattered groups of houses located outside predominantly built-up areas, unless specifically defined as a settlement in the development plan.', 'Draft NPPF for consultation, December 2025, Annex B, "Settlement"')}
<p>Under the draft, a washed-over village could have been an S4 settlement. The government's response to the consultation, published with the final Framework, records the change on the definition (Question 35):</p>
${quote(GOV_RESPONSE, 'Changes have been made to clarify the relationship with development plans where settlements have yet to be defined, and to address how the definition applies to villages within the Green Belt.', 'MHCLG, NPPF consultation: government response, August 2026, response to Question 35, p.30')}
<p>and the matching change to the plan-making policy (Question 132):</p>
${quote(GOV_RESPONSE, 'changes to policy GB4 to recognise that villages lying in the Green Belt should not be identified as settlements for the purpose of the spatial strategy in the development plan', 'MHCLG, NPPF consultation: government response, August 2026, response to Question 132, p.90')}
<p>The response also records that respondents wanted "greater certainty on specific issues, including the treatment of smaller settlements, the role of ‘gap’ policies and the relationship with the Green Belt", and that the government "will consider whether additional planning guidance would be helpful to assist the identification of settlements in plans". No such guidance had been published when this page was built.</p>
${check(GOV_RESPONSE, 'greater certainty on specific issues, including the treatment of smaller settlements, the role of ‘gap’ policies and the relationship with the Green Belt') ?? ''}${check(GOV_RESPONSE, 'will consider whether additional planning guidance would be helpful to assist the identification of settlements in plans') ?? ''}
<p>Commentators noticed the exclusion at once. On the podcast recorded the day after publication, Charles Banner KC said of the definition that "villages in the green belt are excluded from the definition" and, on GB4, that "it's only villages which are not classified as settlements for the purposes of the spatial strategy which should be included in the green belt, i.e. washed over with it". Planning Geek's explainer notes "a special qualification for villages which lie within and are defined as part of the Green Belt". Livedin's glossary puts the consequence in one line: "A village inside the Green Belt does not count, however built-up it looks." Cornerstone Barristers raised the open question the other way round: "The definition of settlement includes areas defined as a settlement in a development plan, but the definition is not exhaustive." Links are in the sources.</p>
${check(HWGPNFY, 'villages in the green belt are excluded from the definition') ?? ''}${check(HWGPNFY, "it's only villages which are not classified as settlements for the purposes of the spatial strategy which should be included in the green belt") ?? ''}${check(PLANNING_GEEK, 'a special qualification for villages which lie within and are defined as part of the Green Belt') ?? ''}${check(LIVEDIN, 'A village inside the Green Belt does not count, however built-up it looks.') ?? ''}${check(CORNERSTONE, 'The definition of settlement includes areas defined as a settlement in a development plan, but the definition is not exhaustive.') ?? ''}
</section>`;

const usesTable = `<section id="uses"><h2>Where the Framework hangs a rule on the word</h2>
<p>"Settlement" appears ${num(uses)} times in the August 2026 Framework. The table lists every policy that uses it, what the word does there, and what follows for a place that is not a settlement. Policies are cited by the Framework's own codes; each links to the text in our <a href="${NPPF_MD}">Markdown edition</a> of the Framework.</p>
<div class="table-wrap"><table><thead><tr><th>Policy</th><th>What the word does</th><th>If the place is not a settlement</th></tr></thead><tbody>
${USES.map((u) => `<tr><td><a href="${md(u.anchor)}"><span class="code">${esc(u.code)}</span></a><br><small>${esc(u.kind)}</small></td><td>${esc(u.role)}<br><q>${esc(u.q)}</q></td><td>${esc(u.not)}</td></tr>`).join('\n')}
</tbody></table></div>
<p>Two absences matter as much as the uses. The Framework never says "settlement hierarchy", "service centre", "service village" or "rural centre"; those are local plan terms. And the Green Belt chapter's own category for small-scale housing in villages, GB7(1)(c), says "villages", not "settlements", so it keeps working in a washed-over village after Annex B has taken the village out of S4.</p>
</section>`;

const consequences = `<section id="consequences"><h2>What follows when a place is not a settlement</h2>
<h3>A hamlet or scattered group, outside the Green Belt</h3>
<p>The proposal goes to S5. The categories that can still carry housing are limited infilling within groups of houses (S5(1)(e)), the re-use or replacement of an existing building (S5(1)(c)), previously developed land (S5(1)(d)), and an exception site (S5(1)(f)). The unmet-need route, S5(1)(j), is normally closed: it requires the site to be "physically well-related to an existing settlement", and the hamlet itself is not one. A home outside both a settlement and a group of houses is "isolated" under S5(3) and goes to HO11. The decisions show S5(1)(j) failing on exactly this point at West Willoughby, Chavel, Marton, Washington, Great Easton and Pyworthy, in several cases with the council unable to show a five-year housing land supply.</p>
${dl('PINS-6010911', 'Though the Council cannot currently demonstrate a five-year housing land supply, this requires development would be physically well related to an existing settlement. As set out above, West Willoughby is not a settlement in the context of the Framework’s definition.', 30)}
<h3>A village washed over by the Green Belt</h3>
<p>Here the word changes less than it seems to, because S5(5) sends every Green Belt proposal to GB6 to GB8 whether or not the site is in a settlement. What Annex B removes is the S4 presumption. The route is: is the proposal in a GB7 category (for a washed-over village, usually GB7(1)(b) extensions and replacements, GB7(1)(c) limited infilling in villages, GB7(1)(e) previously developed land, or GB7(1)(g) grey belt with its sustainable-location limb)? If yes, it is not inappropriate development and the S5(5) balance applies: approve unless the benefits are substantially outweighed. If no, it is inappropriate development and needs very special circumstances under GB6(2). The inspector at Fobbing set this out in one paragraph:</p>
${dl('PINS-6009919', 'The Glossary to the Framework states that villages which lie within and are defined as part of the Green Belt, as is the case with Fobbing, are not settlements for the purposes of the Framework, and consequently Policy S4 is not engaged. As the proposal is inappropriate development in the Green Belt, Policy S5 does not apply to it either. The proposal should therefore be determined in accordance with Policy GB7, with which I have found conflict.', 49)}
<p>A Stratford-on-Avon officer reached the same place for a house extension in Earlswood, a Category 3 Local Service Village washed over by the West Midlands Green Belt:</p>
${report('stratford-26-01614-FUL', 'the application site is not considered to be within a settlement because it lies within the Green Belt', 'p.2')}
<p>Three things still matter in a washed-over village. Its facilities count under TR3 and GB7(1)(g)(iii), as facts about whether occupiers can reach services without a car, not as a settlement category (see <a href="${SUSTAINABLE}">how a sustainable location is assessed</a>). Its built form decides whether a plot is "infilling" under GB7(1)(c) and whether a garden is "within a built-up area" for the previously-developed-land definition, as at Heronsgate. And its position in the plan's hierarchy still decides whether the proposal accords with the plan's spatial strategy, weighed under Annex A, which is a separate question from the Framework route.</p>
<p>The <a href="${ROUTE}#a-washed-over-village-is-not-a-settlement-washedoversettlement-info">Navigator's note on washed-over villages</a> gives the same route step by step.</p>
</section>`;

const tier = `<section id="tier"><h2>Does a service tier make a village a settlement?</h2>
<div class="rule">
<p><strong>Judgement: no, not of itself.</strong> A tier in a council's settlement hierarchy ("Category 3 Local Service Village", "Key Service Centre", "Limited Infill Village") is a plan-making label for distributing housing. It is not one of the four limbs of the Annex B definition. It bears on the question only indirectly, through the second limb: a plan that gives a place a tier usually also defines it as a settlement, with a boundary or an equivalent term, and that definition is what Annex B picks up. The tier is evidence that the plan treats the place as a settlement; it is not the test.</p>
</div>
<p>Four situations cover the cases we have seen.</p>
<ul>
<li><strong>A tiered village, inset from the Green Belt or outside it, with a plan boundary.</strong> It is a settlement under the second limb, and usually under the first too. Broadwas is the clean example: the inspector did not need to decide whether it was a large built-up area, because the plan had defined it: ${dl('PINS-6010973', 'Broadwas is defined as a settlement in the SWDPR 2026 and is, therefore, a settlement when considered against the definition in Annex B of the Framework.', 12)} The tier did the work only because the plan's definition came with it. The same follows for Pillerton Priors (Category 4 Local Service Village, S4 applied inside its boundary: ${caseLink('stratford-26-01894-PIP')}) and Drayton (a Larger Village: ${AP('PINS-6005108', 137)}).</li>
<li><strong>A tiered or named place with no plan boundary.</strong> The first limb decides it on the ground. Stretton-on-Fosse has no Built-Up Area Boundary in Stratford's Core Strategy, and the officer still found it a settlement on the ground: ${report('stratford-26-01687-FUL', 'predominantly built-up with a concentrated area of residential development that clearly has a physical confines which transitions from built form to open land', 'p.4')} At Holsworthy Beacon the inspector found the opposite: the place lacked the facilities to be a "Rural Settlement" in the local plan and the pattern of development was "somewhat sporadic and secluded" (${AP('PINS-6009632', 13)}).</li>
<li><strong>A place the plan calls a settlement but which is a hamlet.</strong> The third limb takes it out whatever the plan says, unless the plan has "specifically" defined it as a settlement. At Higher Bal the inspector accepted that the site "forms part of a settlement within the context of the LP" and then applied S5, not S4, because the Framework's definition "does not include hamlets" and the appellant had conceded the place was one (${AP('PINS-6010498', 22)}). A hamlet at the bottom of a hierarchy is still a hamlet (Charley: ${AP('PINS-6009255', 6)}).</li>
<li><strong>A tiered village washed over by the Green Belt.</strong> The fourth limb takes it out whatever its tier. This is the case that produces the apparent contradiction "it is in the settlement hierarchy but it is not a settlement", and both halves are true. Stoneleigh is a "Limited Infill Village" in Warwick's plan and was decided under GB7 because it is washed over (${AP('PINS-6011601', 5)}). In Stratford-on-Avon, Claverdon, Earlswood and Snitterfield are Category 3 Local Service Villages and Tanworth-in-Arden is Category 4, all washed over; one officer applied the exclusion in Earlswood, and other reports in the same villages did not ask the question (see the register, and the <a href="${SERVICE_VILLAGE}">Service Village Does Not Mean Sustainable</a> page, which follows what the tier does and does not do for the separate sustainable-location test).</li>
</ul>
<p>The reverse error is also worth naming. Annex B does not require a tier, a boundary or any facilities for a village to be a settlement: "The term ‘settlement’ is defined as including villages" was enough at Little Dunham (${AP('PINS-6009588', 23)}), and at Hamerton the inspector treated a village of about 24 homes as a settlement although the plan's own built-up-area threshold was 30 (${AP('PINS-6008987', 6)}). The line between a small village and a hamlet is drawn on the ground. Towan Cross, several clusters with gaps between them and village signs at each end, was held "akin to a small village with definable boundaries and is not a straggle of dwellings" (${AP('PINS-6009030', 10)}); West Willoughby, fifteen houses and no facilities, was not a predominantly built-up area (${AP('PINS-6010911', 29)}).</p>
<p>Two consultation responses show the gap that leaves. South Oxfordshire District Council objected that the national policy "provides no consideration of the size or sustainability of settlements", which is the point: size and services are for TR3 and for the plan's hierarchy, not for the Annex B gate. The Local Government Association's briefing on the Green Belt policy says "Villages (as opposed to hamlets) should not be considered Green Belt if they are identified as a settlement. These terms remain undefined."</p>
${check(SODC, 'provides no consideration of the size or sustainability of settlements') ?? ''}${check(LGA, 'Villages (as opposed to hamlets) should not be considered Green Belt if they are identified as a settlement. These terms remain undefined.') ?? ''}
</section>`;

// Letters in the corpus that have not yet been distilled into the database: outcome and date are proved from the letter.
const NOT_YET_DISTILLED = {
  'PINS-6011601': { outcome: 'dismissed', date: '28 September 2026' },
  'PINS-6011423': { outcome: 'dismissed', date: '2 October 2026' },
};
for (const [id, v] of Object.entries(NOT_YET_DISTILLED)) {
  if (caseById.has(id)) throw new Error(`${id} is now in the database: drop it from NOT_YET_DISTILLED`);
  check('pins:' + id.slice(5), `Decision date: ${v.date}`);
  check('pins:' + id.slice(5), `The appeal is ${v.outcome}`);
}
const regRows = (g) => REGISTER.filter((r) => r.group === g).map((r) => {
  const c = caseById.get(r.id);
  const ref = r.id.startsWith('PINS-') ? r.id.slice(5) : (c?.lpa_ref ?? r.id);
  const link = c ? `<a href="${DECISION_PAGES}${encodeURIComponent(r.id)}.html">${esc(ref)}</a>` : `<a href="${PINS_APPEALS}${esc(ref)}">${esc(ref)}</a>`;
  const outcome = c ? c.outcome : NOT_YET_DISTILLED[r.id].outcome;
  const date = c ? fmt(c.decision_date) : NOT_YET_DISTILLED[r.id].date;
  const who = r.id.startsWith('PINS-') ? 'Appeal' : 'Council';
  return `<article class="policy"><div class="policy-head"><h3>${esc(r.place)}</h3><span class="pill ${outcome === 'allowed' || outcome === 'approved' ? 'ok' : 'no'}">${esc(outcome)}</span></div>
<p class="also">${who} ${link}, ${esc(date)}, ${esc(r.para.startsWith('p.') || !/^\d/.test(r.para) ? r.para : '¶' + r.para)}</p>
<blockquote><p>${esc(r.q)}</p></blockquote>
<p>${r.note}</p></article>`;
}).join('\n');

const register = `<section id="register"><h2>The decisions</h2>
<p>Every decision in our database (${num(all.length)} decisions, ${num(fw26.length)} under the August 2026 Framework) and every decision letter in our corpus (${num(letters)} letters) was searched for the definition: references to Annex B or the glossary near "settlement", "not a settlement", "washed over", "defined as part of the Green Belt", and the hamlet and scattered-group wording. Each match was read and classified. ${REGISTER.length} decisions engage the definition; they are listed by what was decided, with the sentence that decided it. Quotations are checked against the decision letter, or against the officer report for council decisions, when this page is built. The build fails if a letter in the corpus matches the search and has no row here. Dataset as at ${fmt(asAt)}.</p>
<div class="stats">${Object.values(groups).map((g) => `<div class="stat"><div class="n">${g.n}</div><div class="l">${esc(g.title)}</div></div>`).join('')}</div>
${Object.entries(groups).map(([g, v]) => `<h3 id="reg-${g}">${esc(v.title)}</h3><div class="policies">${regRows(g)}</div>`).join('\n')}
<p class="note">Not listed: letters that use "Annex B" only for other glossary terms (deliverable sites, previously developed land, grey belt), two decisions that applied a local plan's own test for a settlement rather than the Framework's (Dunmere, Roche), and washed-over villages where the letter applied GB7 without discussing the definition. A fuller list of Stratford-on-Avon's own decisions in washed-over villages is on the <a href="${STRATFORD}">Stratford note</a>.</p>
</section>`;

const extraCss = `<style>.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}.stat{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:14px 16px}.stat .n{font:600 30px/1 var(--serif);color:var(--accent);font-variant-numeric:tabular-nums}.stat .l{font-size:13.5px;margin-top:6px}
section>ol,section>ul{margin:0;padding-left:20px;display:grid;gap:8px;max-width:72ch}section>ol>li,section>ul>li{font-size:15.5px}section>ol blockquote,section>ul blockquote{margin-top:6px}h3{font:600 17px/1.35 var(--sans);margin-top:8px}
.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}table{border-collapse:collapse;width:100%;font-size:14px;min-width:640px}th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--line)}th{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}td q{display:block;color:var(--muted);font:400 13px/1.45 var(--serif);margin-top:4px}td small{color:var(--muted)}
.policy h3{margin-top:0}</style>`;

const SOURCES = [
  `National Planning Policy Framework, August 2026: <a href="${GOVUK_NPPF}">GOV.UK</a>; <a href="${GOVUK_ANNEX_B}">Annex B: Glossary</a> (HTML, 29 September 2026); our <a href="${NPPF_MD}">Markdown edition</a>. Policies S2 to S5, HO4, HO10 to HO12, E4, L2, L3, GB1, GB4, GB7, DP3, TR5 and Annex B.`,
  'National Planning Policy Framework, December 2024, ¶150 (UK Government Web Archive copy: <a href="https://webarchive.nationalarchives.gov.uk/ukgwa/20250225172715id_/https://assets.publishing.service.gov.uk/media/67aafe8f3b41f783cca46251/NPPF_December_2024.pdf">PDF</a>).',
  'MHCLG, <a href="https://assets.publishing.service.gov.uk/media/697b71c52ff8d10a830d5d4a/Draft_NPPF_December_2025.pdf">National Planning Policy Framework: draft text for consultation</a>, December 2025, Annex B.',
  'MHCLG, <a href="https://assets.publishing.service.gov.uk/media/6a82fcec3bd75b81e2329a89/National_Planning_Policy_Framework_consultation_-_government_response.pdf">Proposed reforms to the National Planning Policy Framework: government response</a>, August 2026, Questions 35 and 132.',
  'Have We Got Planning News For You, <a href="https://www.youtube.com/watch?v=pYn_vaX7HUw">The New National Planning Policy Framework, August 2026 (S20 E1)</a>, 18 August 2026 (quoted from the auto-generated captions at 08:48, 09:50 and 50:17).',
  'Planning Geek, <a href="https://www.planninggeek.co.uk/policy/build-outside-a-settlement-boundary/">Build outside a settlement boundary? NPPF 2026</a>, 25 September 2026; and <a href="https://www.planninggeek.co.uk/policy/presumption-in-favour-of-sustainable-development/">Presumption in favour of sustainable development</a>, 17 September 2026.',
  'Livedin, <a href="https://livedin.co.uk/nppf-2026/terminology">NPPF 2026 terminology: the words a planning case turns on</a>, reviewed 21 August 2026.',
  'Cornerstone Barristers, <a href="https://cornerstonebarristers.com/the-revised-nppf-navigating-the-new-rules-based-planning-system/">The revised NPPF: navigating the new "rules-based planning system"</a>, 20 August 2026.',
  'Local Government Association, <a href="https://www.local.gov.uk/parliament/briefings-and-responses/changes-national-planning-policy-framework-nppf-and-other">Changes to the National Planning Policy Framework and other changes to the planning system: August 2026</a>.',
  'South Oxfordshire District Council, <a href="https://www.southandvale.gov.uk/app/uploads/sites/2/2026/03/South-Oxfordshire-NPPF-Consultation-Response.pdf">response to the NPPF consultation</a>, 10 March 2026, Questions 35 to 39.',
  'Freeths, <a href="https://www.freeths.co.uk/insights-events/legal-articles/2026/from-consultation-to-publication-what-has-changed-in-the-new-nppf/">From consultation to publication: what has changed in the new NPPF?</a>, 1 September 2026 (Annex B "excludes hamlets and scattered groups of houses").',
  'Studio Bark, <a href="https://studiobark.co.uk/resources/nppf-rural-housing-planning">2026 NPPF changes: a guide to rural housing planning</a>, August 2026 (on "groups of houses" and S5(1)(e)).',
  'Landmark Chambers, <a href="https://www.landmarkchambers.co.uk/news-and-cases/cases/new-appeal-decision-on-nppf-policies-s5-and-ho13">New appeal decision on NPPF policies S5 and HO13</a>, 24 September 2026, and Planning Geek, <a href="https://www.planninggeek.co.uk/2026/aston-clinton-appeal-settlement-test/">Aston Clinton appeal: 66 homes win despite failing NPPF test</a>, 27 September 2026 (the "physically well-related" limb of S5(1)(j), which this page does not cover).',
  'Zack Simons KC, <a href="https://www.planoraks.com/posts-1/nppf2026-welcome-to-the-future">#NPPF2026: Welcome to the Future!</a>, #planoraks, 18 August 2026, and Burges Salmon, <a href="https://www.burges-salmon.com/articles/102o1g3/the-new-nppf-one-month-on/">The new NPPF: one month on</a>, 17 September 2026 (general commentary on S4 and S5; neither discusses the definition).',
  `Decision letters: the Planning Inspectorate <a href="https://appeal-planning-decision.service.gov.uk/">appeals service</a>; every letter quoted is held in the research repository under <code>data/open-sources/pins-corpus/</code>. Council reports: Stratford-on-Avon District Council and Wychavon District Council planning portals, linked from each decision's page.`,
  `The <a href="${DECISION_PAGES}">decisions database</a>, the <a href="${SERVICE_VILLAGE}">settlement-tier register</a> and the analysis note <code>data/decisions/analysis/settlement-hierarchy-and-service-centres.md</code> in the research repository.`,
];

const html = page({
  title: 'What Is a Settlement',
  description: `What "settlement" means in the August 2026 NPPF: the Annex B definition and its four limbs, the ${USES.length} policies that hang a rule on the word, what follows for a hamlet or a village washed over by the Green Belt, whether a service-village tier makes any difference, and ${REGISTER.length} decisions that have applied the definition, each with the sentence that decided it.`,
  url: URL,
  breadcrumb: '<a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/england/">England</a> › What is a settlement',
  h1: 'What is a "settlement" under the 2026 NPPF?',
  dek: `The Annex B definition, where the Framework uses the word, what a place loses when it is not one, whether a service-village tier counts, and the ${REGISTER.length} decisions so far that have applied it.`,
  body: extraCss + short + definition + changed + usesTable + consequences + tier + register,
  sources: SOURCES,
  credit: `Prepared by Planning Distilled. External sources were retrieved on ${RETRIEVED}.`,
});

const out = path.join(SITE, SITE_PATH);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`wrote ${path.join(out, 'index.html')}: ${REGISTER.length} decisions in the register, ${USES.length} policy uses, ${uses} occurrences of "settlement" in the Framework`);
