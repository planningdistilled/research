// "Very special circumstances" under the August 2026 NPPF: the GB6(2) test, where it came from, the method
// inspectors are trained to follow, when it is used (only after a proposal fails every GB7 category), what
// has and has not counted since 17 August 2026, and a register of every decision in the database and every
// decision letter in the corpus that used the words.
//   node pages/england/very-special-circumstances/build.mjs   (writes into main-site; needs ../sources for
//   the council reports and the commentary it quotes)
// Every quotation is checked against its source text when the page is built, and the paragraph number of
// every letter quotation is proved from the letter; the build fails on a mismatch. It also fails if a letter
// in the corpus uses the phrase and has no register row.
import fs from 'node:fs';
import path from 'node:path';
import { DECISIONS, SITE } from '../../../paths.mjs';
import { caseById, check, esc, page, quote } from '../../_shared/policy-weight.mjs';
import { corpusRefs, letterMatches, letterText, paragraphOf } from '../../_shared/letters.mjs';

const SITE_PATH = 'research/england/very-special-circumstances/';
const URL = 'https://planningdistilled.org/' + SITE_PATH;
const DECISION_PAGES = '/research/england/nppf-navigator/decisions/';
const PRESUMPTION = '/research/england/substantially-outweighed/';
const SETTLEMENT = '/research/england/what-is-a-settlement/';
const SUSTAINABLE = '/research/england/sustainable-location/';
const ROUTE = '/research/england/nppf-navigator/route/';
const PINS_APPEALS = 'https://appeal-planning-decision.service.gov.uk/comment-planning-appeal/appeals/';
const GOVUK_NPPF = 'https://www.gov.uk/guidance/national-planning-policy-framework';
const GOVUK_CH13 = 'https://www.gov.uk/guidance/national-planning-policy-framework-13-protecting-green-belt-land';
const NPPF_MD = 'https://github.com/planningdistilled/research/blob/main/data/open-sources/nppf/NPPF-August-2026.md';
const ITM_MD = 'https://github.com/planningdistilled/research/blob/main/data/open-sources/pins-training-manual/chapters/24-green-belts.md';
const RETRIEVED = '8 October 2026';

// ---- Sources checked at build time ----
const NPPF_2024 = 'open:nppf/NPPF-December-2024.txt';
const ITM_GB = 'open:pins-training-manual/chapters/24-green-belts.md';
const LIVEDIN = 'sources:guidance/livedin-nppf-2026-policy-test-engine-strings.txt';
const CORNERSTONE = 'sources:guidance/cornerstone-revised-nppf-rules-based-planning.txt';
const FREETHS = 'sources:guidance/freeths-consultation-to-publication-what-changed.txt';
const PG_NUTFIELD = 'sources:guidance/planninggeek-south-nutfield-grey-belt-gb7.txt';

const md = (anchor) => `${NPPF_MD}#${anchor}`;
const nppf = (text, code, anchor) => quote('nppf', text, `NPPF, August 2026, <a href="${md(anchor)}">${esc(code)}</a>`);
const itm = (text, para) => quote(ITM_GB, text, `Inspector Training Manual, <a href="${ITM_MD}">chapter 24, Green Belts</a> (17 September 2026 edition), ¶${para}`);
/** The place from a case title: the last comma-separated part, with any trailing parenthesis removed first. */
const PLACE = { 'PINS-6006637': 'Hatton Station', 'PINS-6010253': 'Langley', 'PINS-6008723': 'Lydiate', 'PINS-6008688': 'Lingfield', 'PINS-6009281': 'Chalfont St Peter', 'PINS-6011889': 'Chalfont St Giles', 'PINS-6012481': 'Well Hill', 'PINS-6011489': 'Hemel Hempstead', 'PINS-6008062': 'Mill Bank', 'PINS-6010709': 'Nazeing', 'PINS-6010313': 'Newchapel' };
const placeOf = (c) => PLACE[c.case_id] || c.title.replace(/\s*\([^)]*\)\s*$/, '').split(',').slice(-1)[0].trim();
const refOf = (id) => (caseById.get(id)?.appeal_ref || id.replace(/^PINS-/, ''));
/** "Place, appeal 6010313, ¶38", linking to the decision page, or to the appeals service for a letter not yet distilled. */
const AP = (id, para) => {
  const c = caseById.get(id);
  const ref = refOf(id);
  const link = c ? `<a href="${DECISION_PAGES}${encodeURIComponent(id)}.html">${esc(placeOf(c))}, appeal ${esc(ref)}</a>` : `appeal <a href="${PINS_APPEALS}${esc(ref)}">${esc(ref)}</a>`;
  return para ? `${link}, ¶${para}` : link;
};
/** A checked quotation from a decision letter, with its paragraph number proved from the letter text. */
function dl(id, text, para) {
  const ref = refOf(id);
  check('pins:' + ref, text);
  const found = paragraphOf(ref, text);
  if (found !== para) throw new Error(`${ref}: "${text.slice(0, 50)}…" is in ¶${found}, not ¶${para}`);
  return quote('pins:' + ref, text, AP(id, para));
}
/** A checked quotation from a Stratford-on-Avon officer report held as text in the private sources checkout. */
/** "Shrewley, W/26/0134", linking to the decision page. */
const councilLink = (id) => { const c = caseById.get(id); return `<a href="${DECISION_PAGES}${encodeURIComponent(id)}.html">${esc(placeOf(c))}, ${esc(c.lpa_ref || id)}</a>`; };
const report = (id, text, where) => quote('case:' + id, text, `${councilLink(id)}, officer report, ${esc(where)}`);
// Quotations from case files, for council decisions whose reports are PDFs not read by the shared checker.
const caseText = (id) => fs.readFileSync(path.join(DECISIONS, 'cases', `${id}.md`), 'utf8').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ');
const inCase = (id, text) => caseText(id).includes(text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' '));
const fromCase = (id, text, where) => {
  if (!inCase(id, text)) throw new Error(`${id}: case file does not contain "${text}"`);
  return `<blockquote><p>${esc(text)}</p><cite>${councilLink(id)}, ${esc(where)}; as recorded in the case file</cite></blockquote>`;
};

// ---- The Framework text ----
const GB6_2 = 'Inappropriate development is, by definition, harmful to the Green Belt and should not be approved except in very special circumstances. Such circumstances will not exist unless the potential harm to the Green Belt by reason of inappropriateness and any other harm resulting from the proposed development, is clearly outweighed by other considerations. In making this assessment, substantial weight should be given to the harm to the Green Belt which would be caused, including harm to its openness.';
const GB6_3 = 'In the case of proposals for renewable and low carbon energy development, very special circumstances may include the wider environmental benefits associated with increased production of energy from renewable sources.';
const GB7_1 = 'The following categories of development are not inappropriate in the Green Belt, and therefore should not be regarded as harmful to the Green Belt or be required to demonstrate very special circumstances:';
const S5_5 = 'This policy does not apply to development proposals in the Green Belt or on land designated as Local Green Space, which should instead be determined in accordance with policies HC8, GB6, GB7 and/or GB8 (as appropriate). However, where development would not be inappropriate in these locations (through the application of policies HC8 and GB7), proposals should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework, and applying paragraph 2 of this policy.';
const NPPF24_153 = 'Inappropriate development is, by definition, harmful to the Green Belt and should not be approved except in very special circumstances. ‘Very special circumstances’ will not exist unless the potential harm to the Green Belt by reason of inappropriateness, and any other harm resulting from the proposal, is clearly outweighed by other considerations.';
// The phrase appears three times in the Framework, all in chapter 13. Prove it.
const nppfText = fs.readFileSync(path.join(DECISIONS, '..', 'open-sources', 'nppf', 'NPPF-August-2026.txt'), 'utf8').replace(/\s+/g, ' ');
const nVsc = (nppfText.match(/very special circumstances/gi) || []).length;
if (nVsc !== 3) throw new Error(`"very special circumstances" now appears ${nVsc} times in the Framework: revise the page`);
// "Clearly outweigh" elsewhere in the Framework (HC7, N6): the words, not the test.
const nClearly = (nppfText.match(/clearly outweigh/gi) || []).length;

// ---- The register ----
// Every decision letter in the corpus that uses the phrase, and every case in the database with a GB6 finding.
// group:
//   found     very special circumstances found (inappropriate development approved)
//   split     officers found them; members did not
//   notfound  inappropriate development, very special circumstances not shown
//   notreq    not inappropriate development, so the test was not reached (compact list; no quotation)
// For a letter, `q` is the sentence that decided it and `para` its paragraph; the build proves both.
const REGISTER = [
  // ---- found ----
  { id: 'PINS-6010078', group: 'found', para: 14, q: 'I therefore attach greater than substantial weight to the other considerations, such that the very special circumstances needed to justify the proposals have been demonstrated.', note: 'A small kitchen extension to a hotel. The appeal planning officer found a clear business need, "very limited" openness harm and that "it is purely ambiguity that has led to the conclusion on inappropriate development" (¶14); the inspector adopted the report and allowed the appeal (¶15). One of only two appeal decisions under the 2026 Framework to find very special circumstances.' },
  { id: 'PINS-6010859', group: 'found', para: 14, q: 'Such considerations would clearly outweigh the harm identified to the Green Belt so as to amount to the ‘very special circumstances’ necessary to justify the proposal.', note: 'A detached domestic garage, conceded to be inappropriate. An extant 2020 permission for a smaller garage was a real fallback that would be no more harmful (considerable weight, ¶10), and the larger garage would take parking off open land (significant weight, ¶12). Decided on 17 August 2026, the Framework\'s first day.' },
  { id: 'SOS-EN020032', group: 'found', note: 'The Secretary of State\'s decision on the Morgan and Morecambe offshore wind transmission assets, a Development Consent Order decided under the December 2024 text. The letter found that "the very special circumstances, in terms of the significant increase in production of renewable energy, now clearly outweigh the harm to the Green Belt and any other harm" (¶7.16), reversing the examining authority. GB6(3) carries the same renewable-energy provision into the 2026 Framework.' },
  { id: 'warwick-W-26-0134', group: 'found', note: 'A permanent rural worker\'s dwelling at an equine rehabilitation yard. Warwick District Council held that a new dwelling is not a GB7 category, so it is inappropriate, and treated the essential need under HO11(1)(a), verified by an independent consultant, as very special circumstances.', fq: 'if there is a genuine, well demonstrated need for a worker to be present on site at most times of the day and night, then this should represent very special circumstances', where: 'officer report, Green Belt section' },
  { id: 'warwick-W-25-0302', group: 'found', note: 'The same council template: a three-bedroom rural worker\'s house replacing a temporary log cabin at an equestrian enterprise, inappropriate development justified by the essential need.' },
  { id: 'lichfield-26-00849-FUL', group: 'found', note: 'A permanent rural worker\'s house replacing a mobile home at an equestrian yard.', fq: 'the established and continuing essential need for a rural worker to live on the site, together with the replacement and removal of the existing temporary accommodation and the proposed occupancy restriction, are considered to amount to very special circumstances', where: 'officer report, Principle' },
  { id: 'bromsgrove-25-01429-FUL', group: 'found', note: 'A new house in place of a barn with Class Q consent and some stables. It failed GB7(1)(b), (e) and (g)(iii), so it was inappropriate. The Class Q fallback, combined with a net reduction in built volume, was held to be very special circumstances.', fq: '125.4 cubic metres less volume and 19.1 square metres less footprint', where: 'delegated report' },
  { id: 'bromsgrove-26-00434-FUL', group: 'found', note: 'A replacement self-build house about 21% larger in floor area than the bungalow it replaces, so "materially larger" under GB7(1)(b). Very special circumstances were found in a larger-home extension prior approval, which would give a bigger building than the proposal, together with a child\'s medical needs.' },
  { id: 'cheshireeast-25-2053-FUL', group: 'found', note: 'A 68-bed care home on the enclosed site of a burnt-out nursing home. Officers found grey belt and a sustainable location, but treated the care home as housing, so the Golden Rules applied and no affordable housing meant GB7(1)(g)(iv) failed. Very special circumstances were then found in the specialist housing need (significant weight), the site\'s previously developed character and employment.', fq: 'It is what might be considered to be a very good example of a grey belt site', where: 'officer report, ¶11.4' },
  { id: 'elmbridge-2025-1444', group: 'found', note: 'A replacement clubhouse for a junior football club, more than three times the footprint of the five structures it replaces. Officers held it failed the "impact on openness is minimised" condition in GB7(1)(f)(iv), so it was inappropriate, and found very special circumstances in the community sports need and the consolidation of buildings. The committee approved.' },
  { id: 'stratford-26-01447-FUL', group: 'found', note: 'A retrospective farm shop on an egg farm. The officer went through every GB7(1) category and found none applied. The very special circumstances accepted were that the farm can lawfully sell its eggs direct to the public only at the holding, and that the shop brings about a fifth of its income. The report\'s conclusion says the need "would outweigh the harm", without the word "clearly".', rq: 'The proposed development is therefore considered to be inappropriate in the Green Belt, which is harmful to the Green Belt and should not be approved except in very special circumstances', where: 'p.6' },
  // ---- officers found, members did not ----
  { id: 'basildon-25-01188-OUT', group: 'split', note: '71 homes, half affordable, on the edge of Wickford. Officers accepted the site was not grey belt (it makes a strong contribution to purpose (a)) but recommended approval on very special circumstances: a 2.05-year supply, 36 affordable homes and biodiversity net gain well above 10%. Members disagreed 4 to 2. The non-determination appeal is pending.', fq: 'Having regard to the acute housing need within the Borough, the significant affordable housing provision … officers conclude that Very Special Circumstances exist', where: 'officer report, ¶1.1.6' },
  { id: 'basildon-25-01190-OUT', group: 'split', note: 'Up to 56 homes, half affordable, at Crays Hill. Officers found very special circumstances in a supply of about two years, 28 affordable homes, bus enhancements and a speed-limit reduction. Members refused on purpose (b): the site is a substantial part of a gap of about 2.3 km between towns.', fq: 'Very Special Circumstances exist and … clearly outweigh the identified Green Belt harm', where: 'officer report, ¶1.5' },
  // ---- not found: appeals ----
  { id: 'PINS-6010313', group: 'notfound', para: 38, q: 'I give modest weight to the provision of additional dwellings and social and economic benefits, and limited weight to the fallback position. However, the other considerations would not clearly outweigh the harm to the Green Belt by reason of inappropriateness and other harm. Consequently, the very special circumstances necessary to justify the proposed development do not exist.', note: 'Five barn conversions in Tandridge, at a 1.97-year supply. The homes got "moderate" weight at ¶33 and "modest" at ¶38; a Class Q fallback got limited weight because it "would cause less harm overall" (¶35).' },
  { id: 'PINS-6009966', group: 'notfound', para: 45, q: 'While the identified housing benefits carry substantial weight and the economic benefits carry moderate weight, they are insufficient to clearly outweigh the Green Belt, openness, sustainability and character harms.', note: 'Up to five homes at South Nutfield, grey belt conceded, failed on the sustainable-location limb. Substantial weight to the homes was not enough.' },
  { id: 'PINS-6006637', group: 'notfound', para: 60, q: 'The scheme’s benefits would, in cumulative terms, be substantial. However, such benefits would not clearly outweigh the substantial harm identified to the Green Belt (including harm derived from loss of openness), as well as limited harm in a character and appearance sense, so as to amount to the very special circumstances necessary to justify the development.', note: '28 affordable homes by Hatton station, after a hearing, at a 1.96-year supply. "Very significant weight" to the housing benefit (¶57) and considerable weight to the economic benefits (¶58) did not clearly outweigh. The strongest housing case to fail so far.' },
  { id: 'PINS-6012481', group: 'notfound', para: 52, q: 'The very special circumstances necessary to justify the development therefore do not exist.', note: 'Up to six homes by the M25 at 2.96 years. The letter cuts the housing benefit for the location: "the lack of realistic alternatives to travel by car moderates the benefit arising from additional housing in this particular location" (¶42).' },
  { id: 'PINS-6011736', group: 'notfound', para: 18, q: 'The very special circumstances necessary to justify the development therefore do not exist.', note: 'Seven houses at Copthorne at a 2.17-year supply: substantial weight to the homes, but "Overall, the benefits would be moderate in this case" once scale was taken into account (¶16).' },
  { id: 'PINS-6011972', group: 'notfound', para: 18, q: 'The very special circumstances necessary to justify the development therefore do not exist.', note: 'Eight houses at Newchapel at 1.92 years, by the same inspector in the same words as Copthorne: moderate benefit overall (¶16).' },
  { id: 'PINS-6009281', group: 'notfound', para: 26, q: 'Accordingly, the harm to the Green Belt is not clearly outweighed by the other considerations identified and therefore the very special circumstances necessary to justify the development do not exist.', note: 'Four homes at Chalfont St Peter at 1.98 years: the housing benefit "is only of moderate significance being for only 4 dwellings" (¶24).' },
  { id: 'PINS-6007428', group: 'notfound', para: 27, q: 'Taken together, I attach moderate weight to those considerations. However, they do not clearly outweigh the harm by reason of inappropriateness, the harm to openness and the other harm identified. Consequently, the very special circumstances necessary to justify the development do not exist.', note: 'One to three homes at Halsall. The letter then records that S5(5) "is not engaged" for inappropriate development (¶28).' },
  { id: 'PINS-6008688', group: 'notfound', para: 38, q: 'Taking all matters into account, I find that the other considerations advanced in favour of the proposal do not clearly outweigh the harm to the Green Belt by reason of inappropriateness and the significant harm to openness that I have identified. Consequently, the very special circumstances necessary to justify development in the Green Belt do not exist.', note: 'One home at Lingfield at 1.92 years. Moderate weight to the dwelling, because the unmet need "has already been taken into account" under GB7 and one home makes a limited contribution (¶34).' },
  { id: 'PINS-6005495', group: 'notfound', para: 37, q: 'The other considerations also do not clearly outweigh the Green Belt harm and the other harms I have identified. Consequently, the very special circumstances necessary to justify the development do not exist.', note: 'Six homes by conversion and one new build at Kingsley, with substantial weight to the homes (¶36). The same paragraph runs the S5 "substantially outweighed" test and the GB6(2) test one after the other, and the proposal fails both.' },
  { id: 'PINS-6010253', group: 'notfound', para: 35, q: 'I find that the benefits, whilst they would be significant, would not clearly outweigh the totality of this harm. Consequently, the VSC necessary to justify the proposal do not exist in this case.', note: 'Permission in principle for one home at Langley, with significant weight to the dwelling at a supply of 3.3 to 3.8 years (¶32). The avoidance of highway harm "does not amount to a benefit" (¶34).' },
  { id: 'PINS-6008723', group: 'notfound', para: 31, q: 'I give moderate weight to the provision of additional dwellings. However, the other considerations would not clearly outweigh the harm to the Green Belt by reason of inappropriateness and other harm. Consequently, the very special circumstances necessary to justify the proposed development do not exist.', note: 'Up to four bungalows at Lydiate. The absence of technical objections "would be a neutral matter" (¶29).' },
  { id: 'PINS-6012115', group: 'notfound', para: 25, q: 'The other considerations in this case, as detailed above, do not have sufficient cumulative weight to clearly outweigh the harm to the Green Belt and any other harm. As such, the very special circumstances necessary to justify this development do not exist.', note: 'A static caravan let as a home on garden land. The letter adds: "For this reason, policy S5 of the Framework is not engaged" (¶25).' },
  { id: 'PINS-6011889', group: 'notfound', para: 23, q: 'However, the limited benefits that would accrue from the provision of one dwelling and the modest benefits from Biodiversity Net Gain are consequently not considerations that clearly outweigh the harm arising from inappropriateness and other harm. The VSCs required to justify the proposal do not, therefore, exist.', note: 'A stable converted to a one-bedroom home in the Chilterns National Landscape. Substantial weight to a home under HO7, but the benefit of one dwelling was "limited".' },
  { id: 'PINS-6006224', group: 'notfound', para: 33, q: 'Those I have identified would not attract sufficient weight to clearly outweigh the totality of the harm and subsequent development plan conflict. The proposal would therefore fail to accord with Policies GB6 and GB7 of the Framework. Consequently, the very special circumstances necessary to justify the proposed development do not exist.', note: 'Up to four units at Ware Park, with substantial weight to the homes (¶32) and a note that "a series of ‘ordinary’ factors are capable of generating" very special circumstances (¶31).' },
  { id: 'PINS-6007668', group: 'notfound', para: 48, q: 'Consequently, the very special circumstances necessary to justify inappropriate development in the Green Belt do not exist.', note: 'A self-build dwelling on a ruin near Newcastle-under-Lyme, three times the footprint of the brick building it replaced. One dwelling\'s benefits "would, taken together, be modest" (¶47).' },
  { id: 'PINS-6010260', group: 'notfound', para: 31, q: 'Taken together, the adverse impacts of granting permission in principle would significantly and demonstrably outweigh the benefits of the proposal.', note: 'One or two houses at Albrighton. The letter gives Green Belt harm substantial weight under GB6 (¶30) but concludes in the December 2024 "significantly and demonstrably" formula, without saying in terms that very special circumstances do not exist.' },
  { id: 'PINS-6005976', group: 'notfound', para: 35, q: 'Consequently, the very special circumstances necessary to justify the development do not exist.' },
  { id: 'PINS-6008062', group: 'notfound', para: 29, q: 'Taken together, I conclude that the considerations advanced in support of the proposal do not clearly outweigh the harm to the Green Belt and the other harm that I have identified and, therefore, the very special circumstances required to justify a grant of planning permission have not been demonstrated.', note: 'A rural worker\'s dwelling claimed on essential need, without objective evidence of it. Compare the three council approvals above, where the need was verified.' },
  { id: 'PINS-6003001', group: 'notfound', para: 41, q: 'In the circumstances the very special circumstances necessary to outweigh the harm resulting from inappropriate development within the Green Belt along with the additional harm described not been demonstrated.' },
  { id: 'PINS-6007030', group: 'notfound', para: 18, q: 'Whilst the proposed replacement dwelling would lead to improved accommodation and likely have limited short term economic benefits; these do not amount to a very special circumstance.' },
  { id: 'PINS-6010213', group: 'notfound', para: 34, q: 'Having regard to the other considerations set out above and the limited weight that I attach to the ecological benefits, the harm would not clearly be outweighed. The very special circumstances necessary to justify the development do not exist.' },
  { id: 'PINS-6009919', group: 'notfound', para: 46, q: 'The other considerations above do not clearly outweigh the harm arising from inappropriateness and other harm. The very special circumstances required to justify the proposal do not, therefore, exist.', note: 'A covered pool and annexe in a washed-over village. The same letter holds that such a village is not a settlement, so S4 is not engaged, and that for inappropriate development "Policy S5 does not apply to it either" (¶49).' },
  { id: 'PINS-6010411', group: 'notfound', para: 21, q: 'Other considerations do not clearly outweigh the harm to the Green Belt. Therefore, there are no very special circumstances that apply.' },
  { id: 'PINS-6010709', group: 'notfound', para: 35, q: 'The benefits as presented to me are worthy of positive weight, which would be substantial overall. Against this, I must give the harm to the Green Belt by way of inappropriateness substantial weight as per policy GB6 of the Framework. I have found that the proposal causes moderate harm to the openness of the Green Belt, and this is also afforded substantial weight as per Policy GB6 of the Framework. Consequently, the other considerations in relation to the proposal do not clearly outweigh the harm that I have identified.', note: 'Retrospective storage of up to 120 vehicles for a truck-repair business: benefits "substantial overall", still not clearly outweighing.' },
  { id: 'PINS-6005433', group: 'notfound', para: 37, q: 'The other considerations in relation to the proposal do not clearly outweigh the harm that I have identified. Consequently, the very special circumstances necessary to justify the development do not exist.' },
  { id: 'PINS-6008745', group: 'notfound', para: 23, q: 'There are no other considerations to clearly outweigh the harm I have identified. Consequently, the very special circumstances necessary to justify the development do not exist and the proposal would fail to accord with the Green Belt aims set out in Policy M12 of the LP and the Framework.' },
  { id: 'PINS-6011489', group: 'notfound', para: 18, q: 'Consequently, the very special circumstances necessary to justify the development do not exist.', note: 'An outdoor wellbeing use with a prefabricated consultation unit: the use passed GB7(1)(f)(iii), the building failed (f)(iv). Little weight to the therapeutic benefit against substantial, significant and moderate harms.' },
  { id: 'PINS-6007369', group: 'notfound', para: 23, q: 'I conclude that the other considerations in this case, are not sufficient to comprise the very special circumstances necessary to justify the approval of this proposal.' },
  { id: 'PINS-6008087', group: 'notfound', para: 25, q: 'overall, the differences between the permitted dwelling and that proposed would have a neutral effect which does not go far enough to amount to the very special circumstances necessary to overcome the identified harm.', note: 'Extensions to a house in Over Peover. The differences from the enforcement-compliant house "would have a neutral effect which does not go far enough".' },
  { id: 'PINS-6009068', group: 'notfound', para: 46, q: 'They do not individually or cumulatively cross the high threshold of clearly outweighing the harm to the Green Belt and to openness or the ‘other’ harm to the character and appearance of the CA.' },
  { id: 'PINS-6005088', group: 'notfound', para: 27, q: 'Taking all matters put to me into account, the substantial weight to be given to Green Belt harm and any other harm is not clearly outweighed by other considerations, either individually or cumulatively, sufficient to demonstrate very special circumstances.' },
  { id: 'PINS-6010292', group: 'notfound', para: 25, q: 'In this case, on the evidence available to me, there appear to be no such other considerations of any significant weight. It follows that the harm to the green belt is not outweighed.' },
  { id: 'PINS-6009260', group: 'notfound', para: 30, q: 'The other considerations put forward in favour of the proposal only carry limited weight and, as such, do not clearly outweigh the harm identified; accordingly the very special circumstances needed to justify the development do not exist.' },
  { id: 'PINS-6008528', group: 'notfound', para: 40, q: 'The limited benefits identified do not clearly outweigh those harms and very special circumstances do not exist.', note: 'The letter also holds that S5 "does not displace the specific Green Belt provisions of policy GB7" (¶8).' },
  { id: 'PINS-6012591', group: 'notfound', para: 19, q: 'Accordingly, the other considerations indicated above do not clearly outweigh the harm to the Green Belt and the other harms that I have found, and the very special circumstances needed to justify the development therefore do not exist.' },
  { id: 'PINS-6011691', group: 'notfound', para: 21, q: 'Therefore, they do not outweigh the harm to the Green Belt that I have identified, and very special circumstances do not exist.' },
  { id: 'PINS-6009962', group: 'notfound', para: 25, q: 'Consequently, the VSC circumstances to justify the scheme do not therefore exist.' },
  { id: 'PINS-6010714', group: 'notfound', para: 25, q: 'Therefore, they do not represent the very special circumstances required.' },
  { id: 'PINS-6010567', group: 'notfound', para: 22, q: 'Therefore, very special circumstances have not been demonstrated.' },
  { id: 'PINS-6007316', group: 'notfound', para: 26, q: 'This would be contrary to the Framework referred to above, unless very special circumstances (VSC) have been demonstrated.', note: 'Dated 17 August 2026 and decided on the December 2024 text.' },
  { id: 'PINS-6008286', group: 'notfound', para: 15, q: 'As such, the very special circumstances necessary to justify the proposed development do not exist.', note: 'Dated 17 August 2026 and decided on the December 2024 text.' },
  { id: 'PINS-6003507', group: 'notfound', para: 24, q: 'Consequently, the very special circumstances necessary to justify the development do not exist.' },
  { id: 'PINS-6005497', group: 'notfound', para: 37, q: 'Consequently, the very special circumstances necessary to justify the development do not exist.', note: 'Appeal B at Kingsley, decided with 6005495.' },
  { id: 'PINS-6005603', group: 'notfound', para: 26, q: 'As such, the very special circumstances necessary to justify the appeal scheme do not exist.' },
  { id: 'PINS-6008579', group: 'notfound', para: 29, q: 'Consequently, the very special circumstances which are necessary to justify the development do not exist.' },
  { id: 'PINS-6008659', group: 'notfound', para: 28, q: 'Therefore, the very special circumstances necessary to justify the development do not exist.' },
  { id: 'PINS-6008866', group: 'notfound', para: 38, q: 'The very special circumstances required to justify the development therefore do not exist.' },
  { id: 'PINS-6010165', group: 'notfound', para: 21, q: 'As such, the very special circumstances necessary to justify this development do not exist.' },
  { id: 'PINS-6010236', group: 'notfound', para: 16, q: 'Consequently, the very special circumstances necessary to justify the proposed development do not exist.' },
  { id: 'PINS-6010273', group: 'notfound', para: 22, q: 'Consequently, the very special circumstances necessary to justify the development do not exist.' },
  { id: 'PINS-6010525', group: 'notfound', para: 15, q: 'Therefore, the very special circumstances necessary to justify the proposed development do not exist.' },
  { id: 'PINS-6011065', group: 'notfound', para: 18, q: 'Consequently, the very special circumstances necessary to justify the development do not exist.' },
  { id: 'PINS-6011106', group: 'notfound', para: 16, q: 'The very special circumstances necessary to justify the development therefore do not exist.' },
  { id: 'PINS-6011330', group: 'notfound', para: 24, q: 'Consequently, the very special circumstances necessary to justify the development do not exist.' },
  { id: 'PINS-6011692', group: 'notfound', para: 15, q: 'Very special circumstances do not therefore exist to justify the proposed development.' },
  { id: 'PINS-6012008', group: 'notfound', para: 28, q: 'Consequently, the very special circumstances necessary to justify the development do not exist.' },
  { id: 'PINS-6012026', group: 'notfound', para: 17, q: 'The very special circumstances required by Framework policy GB6 and WLP policy WS1 therefore do not exist in this case.' },
  { id: 'PINS-6012106', group: 'notfound', para: 20, q: 'Consequently, the very special circumstances necessary to justify the proposal do not exist.' },
  { id: 'PINS-6012188', group: 'notfound', para: 40, q: 'Therefore, the very special circumstances required to justify the proposed development do not exist and it conflicts with LP Policy GN1 and the Framework.' },
  { id: 'APP-T2350-C-25-3374492', group: 'notfound', note: 'An enforcement appeal against a timber building and a CCTV pole on a smallholding. The rural-economy arguments got limited weight because no agricultural enterprise was shown (¶28); "very special circumstances have not been demonstrated" (¶30). The letter is held as a PDF, not in the text corpus.' },
  { id: 'APP-A2335-C-26-3378663', group: 'notfound', note: 'An enforcement appeal at Halton after a hearing: "development that has never been lawful … is not capable of rendering land PDL" (¶30), so GB7(1)(e) failed. The letter is held as a PDF, not in the text corpus.' },
  // letters in the corpus not yet distilled into the database
  { id: 'PINS-6006716', group: 'notfound', para: 23, q: 'Consequently, the very special circumstances necessary to justify the proposed development do not exist.', place: 'Spellbrook, East Hertfordshire', dev: 'single-storey rear extension' },
  { id: 'PINS-6011601', group: 'notfound', para: 23, q: 'Consequently, the very special circumstances necessary to justify the proposal have not been demonstrated.', place: 'Stoneleigh, Warwick', dev: 'engineering operations, balustrade, fencing and a timber gazebo' },
  { id: 'PINS-6012627', group: 'notfound', para: 22, q: 'Consequently, the very special circumstances necessary to justify the development do not exist.', place: 'Corbridge, Northumberland', dev: 'rear extension, decking, veranda, rooflights and solar panels' },
  // ---- not found: councils ----
  { id: 'stratford-26-01614-FUL', group: 'notfound', note: 'A two-storey extension in Earlswood taking the house from about 374 m³ to about 970 m³. A permitted development fallback was weighed and given limited weight.', rq: 'Taken individually and cumulatively, these considerations are not considered sufficient to clearly outweigh the harm to the Green Belt by reason of inappropriateness and the identified harm to openness', where: 'p.9' },
  { id: 'stratford-26-01310-FUL', group: 'notfound', note: 'A detached garage in a front garden at Tanworth-in-Arden, held not to be an "extension or alteration" under GB7(1)(b). No weighing factors were put forward.' },
  { id: 'wychavon-W-26-01639-PIP', group: 'notfound', note: 'Permission in principle for one to five homes on paddock land at Astwood Bank.', fq: 'Taken together, the benefits would not clearly outweigh the identified Green Belt harm and the additional harm arising from the proposal\'s unsustainable location. Very special circumstances have not been demonstrated', where: 'delegated report, Green Belt conclusion' },
  { id: 'basildon-24-01047-OUT', group: 'notfound', note: '11 market homes with no affordable housing, so the Golden Rules failed. Members gave the homes "limited" benefit, "further diminished by the absence of any affordable housing".' },
  { id: 'basildon-25-00575-OUT', group: 'notfound', note: 'Members regraded the site\'s contribution to purpose (a) from moderate to strong, against the council\'s own study, and found no very special circumstances.' },
  { id: 'threerivers-25-2168-OUT', group: 'notfound', note: 'Up to 70 homes, half affordable, at a 1.2-year supply. Officers recommended approval as grey belt and under the station route; members held the site was not grey belt and that 1,100 m is not "around 800m", and found no very special circumstances despite substantial weight to the housing. The appeal is pending.' },
  { id: 'dacorum-25-01880-MOA', group: 'notfound', note: 'Not a fresh determination: the committee decided to keep defending its Green Belt reason for refusing 1,400 homes east of Tring at the forthcoming inquiry, even though officers found three benefits rising to substantial weight under HC4. Members declined to find that very special circumstances now exist.' },
  // ---- not inappropriate, so the test was not reached ----
  ...['PINS-6004899', 'PINS-6005162', 'PINS-6005649', 'PINS-6005877', 'PINS-6005916', 'PINS-6006496', 'PINS-6006497', 'PINS-6007121', 'PINS-6007163', 'PINS-6007184', 'PINS-6007219', 'PINS-6007287', 'PINS-6007335', 'PINS-6007484', 'PINS-6008404', 'PINS-6008668', 'PINS-6009189', 'PINS-6009621', 'PINS-6009645', 'PINS-6010198', 'PINS-6010471', 'PINS-6010578', 'PINS-6010603', 'PINS-6010746', 'PINS-6011103', 'PINS-6011520', 'PINS-6012303', 'PINS-6012763', 'PINS-6005150', 'PINS-6014250', 'PINS-6004144', 'PINS-6006003', 'PINS-6007334', 'PINS-6007338', 'PINS-6007340', 'PINS-6008122', 'PINS-6009720', 'PINS-6009849', 'PINS-6010459', 'PINS-6011301', 'PINS-6012043'].map((id) => ({ id, group: 'notreq' })),
];
// Letters that use the words in another sense, and cases where the Green Belt question was left undecided.
const EXEMPT = {
  '6006961': 'the site is not in the Green Belt; the letter says the Framework "does not require very special circumstances to be demonstrated for development on non-Green Belt land"',
  '6009185': 'a prior approval appeal for a telecoms mast: the inspector did not assess inappropriateness or apply the test',
  '6008465': 'permission in principle at Oxenhope, dismissed on other grounds: "it is unnecessary for me to reach a definitive conclusion on whether the proposal is inappropriate development"',
  '6010097': 'Bledlow Ridge, dismissed on heritage: the council did not allege Green Belt harm and the question was not decided',
};
const NOT_REQUIRED_RE = /not (?:be )?(?:required|necessary|need)[^.]{0,120}very special|no (?:need|requirement) (?:for me )?to (?:consider|assess)[^.]{0,120}very special|not (?:therefore )?reliant on very special|should not (?:therefore )?be regarded as harmful|or (?:be )?required to demonstrate very special|do not need to (?:consider|be demonstrated)|would not (?:be|constitute|amount to) inappropriate|would be not inappropriate|is not inappropriate development|not inappropriate development in the Green Belt|have not assessed whether the proposal would be inappropriate|not harmful to the Green Belt/i;

const NOT_YET_DISTILLED = {
  'PINS-6006716': { outcome: 'dismissed', date: '25 September 2026' },
  'PINS-6011601': { outcome: 'dismissed', date: '28 September 2026' },
  'PINS-6012627': { outcome: 'dismissed', date: '29th September 2026' },
};
for (const [id, v] of Object.entries(NOT_YET_DISTILLED)) {
  if (caseById.has(id)) throw new Error(`${id} is now in the database: drop it from NOT_YET_DISTILLED and let the case supply its facts`);
  check('pins:' + id.slice(5), `Decision date: ${v.date}`);
  check('pins:' + id.slice(5), `The appeal is ${v.outcome}`);
}

// ---- Check the register ----
const registerProblems = [];
const seen = new Set();
for (const r of REGISTER) {
  if (seen.has(r.id)) throw new Error('duplicate register row: ' + r.id);
  seen.add(r.id);
  const c = caseById.get(r.id);
  if (!c && !NOT_YET_DISTILLED[r.id]) throw new Error('not in the database and not listed as undistilled: ' + r.id);
  if (r.id.startsWith('PINS-')) {
    const ref = r.id.slice(5);
    if (letterText(ref) == null) throw new Error('letter not in the corpus: ' + ref);
    if (r.q) {
      check('pins:' + ref, r.q);
      const found = paragraphOf(ref, r.q);
      if (found !== r.para) registerProblems.push(`${ref}: register quotation is in ¶${found}, not ¶${r.para}: "${r.q.slice(0, 60)}"`);
    } else if (r.group === 'notreq') {
      if (!letterMatches(ref, NOT_REQUIRED_RE)) throw new Error(`${ref}: listed as not inappropriate but the letter does not say so in a recognised form`);
    } else throw new Error('letter row without a quotation: ' + r.id);
    if (r.group === 'notreq' && c) {
      const gb6 = (c.policy_findings || []).filter((p) => String(p.policy).startsWith('GB6'));
      if (gb6.some((p) => ['pass', 'fail', 'harm'].includes(p.finding))) throw new Error(`${r.id}: listed as not inappropriate but the case records a GB6 finding of ${gb6.map((p) => p.finding).join('/')}`);
    }
    if (r.group === 'notfound' && c) {
      const gb6 = (c.policy_findings || []).filter((p) => String(p.policy).startsWith('GB6'));
      if (gb6.some((p) => p.finding === 'pass')) throw new Error(`${r.id}: listed as not found but the case records GB6 pass`);
    }
    if (r.group === 'found' && c && !(c.policy_findings || []).some((p) => String(p.policy).startsWith('GB6') && p.finding === 'pass')) throw new Error(`${r.id}: listed as found but the case does not record GB6(2) pass`);
  } else {
    if (r.fq && !inCase(r.id, r.fq)) throw new Error(`${r.id}: case file does not contain "${r.fq}"`);
    if (r.rq) check('case:' + r.id, r.rq);
    const gb6 = (c.policy_findings || []).filter((p) => String(p.policy).startsWith('GB6'));
    const want = r.group === 'found' ? ['pass'] : ['fail', 'harm'];
    if (r.id !== 'SOS-EN020032' && !gb6.some((p) => want.includes(p.finding))) throw new Error(`${r.id}: group "${r.group}" but the case records GB6 ${gb6.map((p) => p.finding).join('/') || 'nothing'}`);
  }
}
if (registerProblems.length) throw new Error(registerProblems.join('\n'));
// Every letter in the corpus that uses the phrase must have a row (or a stated exemption), so the register stays complete after a harvest.
const inRegister = new Set(REGISTER.map((r) => r.id.replace(/^PINS-/, '')));
const missing = [];
let lettersUsing = 0;
for (const ref of corpusRefs()) {
  if (!/very special circumstances/i.test(letterText(ref).replace(/\s+/g, ' '))) continue;
  lettersUsing++;
  if (!inRegister.has(ref) && !EXEMPT[ref]) missing.push(ref);
}
if (missing.length) throw new Error(`letters use "very special circumstances" but have no register row (read each and add a row, or exempt it with a reason): ${missing.join(' ')}`);
// Every case in the database with a GB6 finding must have a row, or an exemption.
const noRow = [];
for (const c of caseById.values()) {
  const gb6 = (c.policy_findings || []).filter((p) => String(p.policy).startsWith('GB6'));
  if (!gb6.length) continue;
  const ref = (c.appeal_ref || '').replace(/^.*?(\d{7})$/, '$1');
  if (!seen.has(c.case_id) && !EXEMPT[ref]) noRow.push(`${c.case_id} (${gb6.map((p) => p.finding).join('/')})`);
}
if (noRow.length) throw new Error('cases record a GB6 finding but have no register row: ' + noRow.join(', '));

// ---- Numbers ----
const num = (x) => x.toLocaleString('en-GB');
const all = [...caseById.values()];
const fw26 = all.filter((c) => c.nppf_applied === '2026-08');
const lettersTotal = corpusRefs().length;
const asAt = all.map((c) => c.decision_date).sort().slice(-1)[0];
const fmt = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const HOUSING_TYPES = new Set(['housing-minor', 'housing-major', 'housing-strategic', 'self-build', 'replacement-dwelling', 'conversion', 'PIP', 'rural-exception', 'affordable-led', 'specialist-housing', 'travellers']);
const isHousing = (r) => { const c = caseById.get(r.id); return c ? (c.dev_type || []).some((t) => HOUSING_TYPES.has(t)) : false; };
const isAppeal = (r) => r.id.startsWith('PINS-') || r.id.startsWith('APP-');
const rows = (g) => REGISTER.filter((r) => r.group === g);
const N = {
  found: rows('found').length,
  foundAppeal: rows('found').filter(isAppeal).length,
  foundCouncil: rows('found').filter((r) => !isAppeal(r) && r.id !== 'SOS-EN020032').length,
  notfound: rows('notfound').length,
  notfoundAppeal: rows('notfound').filter(isAppeal).length,
  notfoundCouncil: rows('notfound').filter((r) => !isAppeal(r)).length,
  housingAppealTried: rows('notfound').filter((r) => isAppeal(r) && isHousing(r)).length + rows('found').filter((r) => isAppeal(r) && isHousing(r)).length,
  housingAppealFound: rows('found').filter((r) => isAppeal(r) && isHousing(r)).length,
  notreq: rows('notreq').length,
  split: rows('split').length,
};
if (N.foundAppeal !== 2) throw new Error(`the page says two appeal decisions found very special circumstances; the register now has ${N.foundAppeal}`);
if (N.housingAppealFound !== 0) throw new Error(`the page says no housing appeal has found very special circumstances; the register now has ${N.housingAppealFound}`);

// ---- The page ----
const short = `<section id="short"><h2>The short answer</h2>
<div class="rule">
<p><strong>"Very special circumstances" is the test for inappropriate development in the Green Belt, and nothing else.</strong> It lives in policy GB6(2) of the National Planning Policy Framework (NPPF) of 17 August 2026. It is reached only after a proposal has failed every category in GB7, the list of development that is <em>not</em> inappropriate. Development that passes GB7 never meets it; it goes instead to the "substantially outweighed" balance in S5(5).</p>
<p>The test is a balance with the scales pre-loaded. Harm to the Green Belt, by definition and to its openness, carries substantial weight. The applicant must show other considerations that <em>clearly</em> outweigh that harm and any other harm. The Inspectorate's training manual puts it as "not just marginally, but decisively". It is the opposite of the presumption that runs everywhere else, which approves unless adverse effects substantially outweigh the benefits.</p>
<p>Since the Framework took effect, ${N.foundAppeal} appeal decisions have found very special circumstances (a hotel kitchen and a garage) and ${N.notfoundAppeal} have not. No housing scheme has found them at appeal in ${N.housingAppealTried} attempts, at supplies as low as 1.9 years and with up to 28 affordable homes. Councils have found them ${N.foundCouncil} times, for rural workers, a care home, a farm shop, a sports clubhouse and two fallback cases.</p>
</div></section>`;

const test = `<section id="test"><h2>The test</h2>
<p>Policy GB6 is the Green Belt's control policy. Its second paragraph is the test:</p>
${nppf(GB6_2, 'GB6(2)', 'GB6-2')}
<p>Three things are packed into it. Inappropriate development is harmful <em>by definition</em>: no evidence of actual harm is needed, and none can be argued away. The harm carries substantial weight, including harm to openness. And the other considerations must <em>clearly</em> outweigh the total of the Green Belt harm and any other harm (to character, heritage, highway safety, the sustainability of the location, and so on). Only then do very special circumstances exist. They are the conclusion of the balance, not an ingredient in it.</p>
<p>The third paragraph names one consideration the Framework itself regards as capable of doing the job:</p>
${nppf(GB6_3, 'GB6(3)', 'GB6-3')}
<p>And GB7 opens by saying who never has to pass the test:</p>
${nppf(GB7_1, 'GB7(1)', 'GB7-1')}
<p>The words appear ${nVsc} times in the Framework, all in the Green Belt chapter. "Clearly outweigh" appears ${nClearly} times in all: the other uses (loss of open space under HC7, harm to Sites of Special Scientific Interest under N6) borrow the standard but are not called very special circumstances.</p>
<h3>Where it came from</h3>
<p>The test is the one part of the Green Belt chapter that the 2026 Framework did not rewrite. Paragraph 153 of the December 2024 Framework read:</p>
${quote(NPPF_2024, NPPF24_153, 'NPPF, December 2024, ¶153')}
<p>The 2026 text moves "substantial weight" from the front of the paragraph to the end, and drops the quotation marks. The grey belt category, the Golden Rules and the station route are new; the test that waits for anything that falls outside them is not. Cornerstone Barristers' note on the new Framework says GB6(2) "now states the familiar rules on development in the Green Belt: inappropriate development is by definition harmful; no approval unless the very special circumstances test is met; etc." The case law on what "very special" means, from <em>Wychavon</em> (2008) to <em>Sefton</em> (2021), therefore carries straight across. The <a href="${PRESUMPTION}">presumption</a>, by contrast, was rewritten from end to end.</p>
${check(CORNERSTONE, 'now states the familiar rules on development in the Green Belt: inappropriate development is by definition harmful; no approval unless the very special circumstances test is met; etc.') ?? ''}
</section>`;

const method = `<section id="method"><h2>How inspectors are trained to run it</h2>
<p>The Planning Inspectorate's Inspector Training Manual, in the edition of 17 September 2026 updated for the new Framework, sets a six-step order for Green Belt appeals: is the development inappropriate (and is the land grey belt); is there any other harm; if inappropriate, what other considerations are advanced and with what weight; do they clearly outweigh the harm (the "Green Belt balancing exercise"); if so, do very special circumstances exist; then the conclusion under section 38(6). The manual is training material, not policy, but it is what the letters below are following. Four of its instructions explain most of the results.</p>
<ol>
<li><strong>The bar is "clearly", and the manual reads that as "decisively".</strong> ${itm('If the other considerations do not clearly outweigh the totality of the harm, very special circumstances cannot exist (GB6 of NPPF) and the appeal should be dismissed.', 47)} ${itm('It is not sufficient for them to merely outweigh. In other words, for the appeal to succeed, the overall balance would have to favour the appellants’ case, not just marginally, but decisively.', 49)}</li>
<li><strong>The considerations are weighed one by one; none of them is "very special" on its own.</strong> ${itm('There is also no requirement for them to be ‘very special’ or to compare them to the harm identified by means of a mini-balance as you go through them.', 43)} The manual's list of things not to do ends with: do not "state that it is the very special circumstances that outweigh/don’t outweigh the harm (it is the other considerations)".</li>
<li><strong>An absence of harm counts for nothing.</strong> ${itm('An absence of harm or a reduced level of harm should be treated as such and should not be counted as positive considerations in support of the scheme.', 44)} The letters apply this constantly: no highway objection "does not amount to a benefit" (Langley, ¶34), no technical objections "would be a neutral matter" (Lydiate, ¶29).</li>
<li><strong>"Special" does not mean rare.</strong> Quoting the Court of Appeal in <em>Wychavon v SSCLG</em> [2008] EWCA Civ 692: ${itm('Rarity may of course contribute to the "special" quality of a particular factor, but it is not essential, as a matter of ordinary language or policy.', 50)} And: ${itm('The circumstances do not have to be unique, and the possibility that similar circumstances might arise elsewhere does not prevent a finding of very special circumstances in any particular case.', 51)} This is why a verified rural worker's need, which arises on many farms, can be very special circumstances on any one of them.</li>
</ol>
${check(ITM_GB, 'state that it is the very special circumstances that outweigh/don’t outweigh the harm (it is the other considerations)') ?? ''}
<p>The manual also notes a trap with heritage: a finding that heritage harm is outweighed by public benefits under HE6 "does not constitute a finding of ‘no harm’ (and thus a neutral factor) for Green Belt purposes"; the harm still sits on the Green Belt side of the scales (¶36).</p>
${check(ITM_GB, 'does not constitute a finding of ‘no harm’ (and thus a neutral factor) for Green Belt purposes') ?? ''}
</section>`;

const when = `<section id="when"><h2>When it is used, and when it is not</h2>
<p>The 2026 Framework sends every Green Belt proposal down one of two roads, and the fork is GB7. Policy S5(5) is the signpost:</p>
${nppf(S5_5, 'S5(5)', 'S5-5')}
<div class="fork" role="img" aria-label="Green Belt decision fork: GB7 category passed leads to the S5(5) balance, approve unless benefits substantially outweighed; no GB7 category leads to GB6(2), inappropriate development, approve only if other considerations clearly outweigh the harm">
<div class="fork-q">Does the proposal fall within a GB7(1) category?<br><small>reuse of buildings (b), limited infill in a village (c), previously developed land (e), grey belt with its four limbs (g), the station route (h), and the rest</small></div>
<div class="fork-arms">
<div class="fork-arm ok"><div class="fork-h">Yes: not inappropriate</div><p>No harm to the Green Belt is presumed and no very special circumstances are needed. S5(5) applies: approve unless the benefits are <em>substantially outweighed</em> by adverse effects, applying the S5(2) "should be refused" triggers.</p><p class="also"><a href="${PRESUMPTION}">The presumption page</a> covers this balance.</p></div>
<div class="fork-arm no"><div class="fork-h">No: inappropriate</div><p>Harmful by definition, substantial weight to the harm. GB6(2) applies: approve only if other considerations <em>clearly outweigh</em> the Green Belt harm and any other harm. S5 is not engaged at all.</p><p class="also">This page.</p></div>
</div></div>
<p>Inspectors state the first road in a sentence. At Daws Heath Road, 58 homes on grey belt that met the Golden Rules: ${dl('PINS-6007184', 'Consequently, there is no need to further consider harm to openness or very special circumstances.', 40)} At Bournheath, citing <em>Lee Valley</em>: ${dl('PINS-6011301', 'The courts have held that in this scenario, it is not necessary to consider its impact on the openness of the Green Belt, nor does the proposal need to demonstrate very special circumstances.', 18)}</p>
<p>And the second road closes S5 behind it. Once a scheme is inappropriate, the "substantially outweighed" balance is not available as a second chance: ${dl('PINS-6007428', 'However, as the proposal would be inappropriate development under Policy GB7, the further balance applicable to development that is not inappropriate under Policy S5(5) is not engaged.', 28)} ${dl('PINS-6012115', 'As such, the very special circumstances necessary to justify this development do not exist. This would be contrary to the Framework and CS Policy KS3. For this reason, policy S5 of the Framework is not engaged.', 25)} Nor can S5(1)(j), the unmet-need route, be used to get round GB7: ${dl('PINS-6008528', 'However, policy S5 is a general policy relating to development outside settlements and does not displace the specific Green Belt provisions of policy GB7 which apply to this site.', 8)}</p>
<p>Two consequences follow for anyone arguing a Green Belt case. First, the GB7 categories are where the effort goes: a scheme that can be brought within one of them, most often grey belt with the <a href="${SUSTAINABLE}">sustainable-location limb</a>, avoids the test altogether. Second, a village washed over by the Green Belt is <a href="${SETTLEMENT}">not a settlement</a> for the Framework, so S4 is not engaged either; the Fobbing letter sets out the whole route (¶49).</p>
<p>The <a href="${ROUTE}#route-inappropriate-development-in-the-green-belt-routegb6-info">Navigator's Green Belt route</a> asks the same questions step by step.</p>
</section>`;

const counted = `<section id="counted"><h2>What has counted, and what has not</h2>
<p>The register below holds every decision we have found that applied the test. Read together, they show a settled pattern.</p>
<h3>What has worked</h3>
<ul>
<li><strong>A real fallback that is no less harmful.</strong> Giles House Farm: an extant permission for a smaller garage, with the proposal "no more harmful than the fallback position" (¶10), plus parking taken off open land. Councils have accepted a Class Q consent plus a cut in volume (Dodford) and a larger-home prior approval (Hollywood). A fallback that would cause <em>less</em> harm gets limited weight (Branford Wells, ¶35), and a fallback that could be built as well as the scheme gets moderate weight (Chobham).</li>
<li><strong>A need that can only be met on the site.</strong> Rural workers' dwellings are not a GB7 category, so a new one is inappropriate; three councils have treated a verified HO11(1)(a) essential need as very special circumstances (Shrewley, Pinley Green, Shenstone). The same need without objective evidence failed at appeal (Mill Bank, Sowerby Bridge). The farm shop at Kings Coughton and the hotel kitchen at Illingworth were found on the same logic: the business need is tied to the place.</li>
<li><strong>Specialist need and community facilities.</strong> A care home on an enclosed, burnt-out site (Handforth) and a junior football clubhouse (East Molesey), both at committee.</li>
<li><strong>Renewable energy.</strong> GB6(3) says so in terms, and the Secretary of State applied it to offshore wind transmission assets in September 2026, under the 2024 text.</li>
</ul>
<h3>What has not: general housing need</h3>
<p>No housing appeal has found very special circumstances under the 2026 Framework. The homes get weight, often substantial weight under HO7, and then the weight is moderated for scale or location, and in every case it falls short of "clearly".</p>
<div class="table-wrap"><table><thead><tr><th>Decision</th><th>Homes</th><th>Supply</th><th>Weight to the homes</th></tr></thead><tbody>
<tr><td>${AP('PINS-6006637')}</td><td>28, all affordable</td><td>1.96 years</td><td>"very significant weight" to the housing benefit (¶57); benefits "in cumulative terms, be substantial" (¶60). Not clearly outweighing.</td></tr>
<tr><td>${AP('PINS-6009966')}</td><td>up to 5</td><td>significant shortfall</td><td>"substantial weight" (¶39). Not clearly outweighing (¶45).</td></tr>
<tr><td>${AP('PINS-6005495')}</td><td>6 (conversion) + 1</td><td>no five-year supply</td><td>"substantial weight to the provision of six new dwellings" (¶36).</td></tr>
<tr><td>${AP('PINS-6006224')}</td><td>up to 4</td><td>3.4 to 3.7 years</td><td>"substantial weight" (¶32).</td></tr>
<tr><td>${AP('PINS-6010253')}</td><td>1</td><td>3.3 to 3.8 years</td><td>"significant weight" (¶32).</td></tr>
<tr><td>${AP('PINS-6011736')}</td><td>7</td><td>2.17 years</td><td>substantial weight to the homes, but "Overall, the benefits would be moderate" (¶16).</td></tr>
<tr><td>${AP('PINS-6011972')}</td><td>8</td><td>1.92 years</td><td>as Copthorne: "moderate" overall (¶16).</td></tr>
<tr><td>${AP('PINS-6009281')}</td><td>4</td><td>1.98 years</td><td>"only of moderate significance being for only 4 dwellings" (¶24).</td></tr>
<tr><td>${AP('PINS-6010313')}</td><td>5</td><td>1.97 years</td><td>"moderate" (¶33), "modest" (¶38).</td></tr>
<tr><td>${AP('PINS-6008723')}</td><td>up to 4</td><td>not stated</td><td>"moderate weight" (¶31).</td></tr>
<tr><td>${AP('PINS-6008688')}</td><td>1</td><td>1.92 years</td><td>"moderate weight", the need having "already" counted under GB7 (¶34).</td></tr>
<tr><td>${AP('PINS-6007428')}</td><td>1 to 3</td><td>no five-year supply</td><td>"moderate weight" (¶25).</td></tr>
<tr><td>${AP('PINS-6012481')}</td><td>up to 6</td><td>2.96 years</td><td>effect on supply "small"; car dependence "moderates the benefit" (¶42).</td></tr>
<tr><td>${AP('PINS-6011889')}</td><td>1</td><td>no adequate supply</td><td>substantial weight under HO7, but the benefit of one dwelling "limited" (¶23).</td></tr>
<tr><td>${AP('PINS-6007668')}</td><td>1</td><td>not stated</td><td>benefits "modest" (¶47).</td></tr>
</tbody></table></div>
${check('pins:6006637', 'very significant weight is fairly attributable to the social benefits') ?? ''}${check('pins:6009966', 'I therefore attach substantial weight to this benefit') ?? ''}${check('pins:6005495', 'I give substantial weight to the provision of six new dwellings') ?? ''}${check('pins:6006224', 'should be attributed substantial weight') ?? ''}${check('pins:6010253', 'I attribute significant weight to this benefit as a consequence') ?? ''}${check('pins:6011736', 'Overall, the benefits would be moderate in this case') ?? ''}${check('pins:6011972', 'Overall, the benefits would be moderate in this case') ?? ''}${check('pins:6009281', 'only of moderate significance being for only 4 dwellings') ?? ''}${check('pins:6010313', 'Overall, I attribute moderate weight to these benefits') ?? ''}${check('pins:6010313', 'I give modest weight to the provision of additional dwellings') ?? ''}${check('pins:6008723', 'I give moderate weight to the provision of additional dwellings') ?? ''}${check('pins:6008688', 'I attach moderate weight to this benefit') ?? ''}${check('pins:6007428', 'I attach moderate weight to these benefits') ?? ''}${check('pins:6012481', 'the positive effect on housing land supply would be small') ?? ''}${check('pins:6012481', 'the lack of realistic alternatives to travel by car moderates the benefit arising from additional housing in this particular location') ?? ''}${check('pins:6011889', 'the limited benefits that would accrue from the provision of one dwelling') ?? ''}${check('pins:6007668', 'these benefits would, taken together, be modest') ?? ''}${check('pins:6010859', 'the proposal would be no more harmful than the fallback position') ?? ''}${check('pins:6010313', 'the fallback scheme would cause less harm overall') ?? ''}
<p>The reasoning is the same every time, and Hatton Station states it most fully: ${dl('PINS-6006637', 'The scheme’s benefits would, in cumulative terms, be substantial. However, such benefits would not clearly outweigh the substantial harm identified to the Green Belt (including harm derived from loss of openness), as well as limited harm in a character and appearance sense, so as to amount to the very special circumstances necessary to justify the development.', 60)}</p>
<p>Where officers have found very special circumstances for market and affordable housing, at Basildon twice, members have refused and the appeals are pending. Planning Geek's note on the South Nutfield decision puts the lesson in a heading: "Housing need was not enough to amount to very special circumstances". Livedin's explainer of the Green Belt route says the same from the other side: "Without one of those routes you would have to show very special circumstances, which is a high bar and rarely met."</p>
${check(PG_NUTFIELD, 'Housing need was not enough to amount to very special circumstances') ?? ''}${check(LIVEDIN, 'Without one of those routes you would have to show very special circumstances, which is a high bar and rarely met.') ?? ''}
<p>Two cautions about the dataset. Appeals are council refusals, so the pool is biased towards weaker schemes; the council approvals come from the authorities whose reports we could reach. And the test is young in this form: the first inquiry decisions on large Green Belt housing schemes refused on very special circumstances (Basildon, Three Rivers, Tring) have not yet been issued.</p>
</section>`;

// ---- The register rows ----
const pill = (outcome) => `<span class="pill ${['allowed', 'approved'].includes(outcome) ? 'ok' : 'no'}">${esc(outcome)}</span>`;
function rowFacts(r) {
  const c = caseById.get(r.id);
  if (c) {
    const ref = r.id.startsWith('PINS-') ? r.id.slice(5) : c.decision_maker === 'inspector' ? (c.appeal_ref ?? r.id) : (c.lpa_ref ?? r.id);
    const who = c.decision_maker === 'inspector' ? 'Appeal' : c.decision_maker === 'secretary-of-state' ? 'Secretary of State' : c.decision_maker === 'lpa-committee' ? 'Committee' : c.decision_maker === 'lpa-delegated' ? 'Delegated' : 'Decision';
    return { place: placeOf(c), dev: c.development, outcome: c.outcome, date: fmt(c.decision_date), who, ref, link: `<a href="${DECISION_PAGES}${encodeURIComponent(r.id)}.html">${esc(ref)}</a>`, authority: c.authority };
  }
  const u = NOT_YET_DISTILLED[r.id];
  const ref = r.id.slice(5);
  return { place: r.place, dev: r.dev, outcome: u.outcome, date: u.date, who: 'Appeal', ref, link: `<a href="${PINS_APPEALS}${esc(ref)}">${esc(ref)}</a>`, authority: '' };
}
function gb6Note(r) {
  const c = caseById.get(r.id);
  const f = (c?.policy_findings || []).find((p) => String(p.policy).startsWith('GB6') && p.note);
  return f ? `${esc(f.note.replace(/\s*\(DL [^)]*\)\s*$/, ''))}.` : '';
}
function card(r) {
  const f = rowFacts(r);
  const where = r.para ? `¶${r.para}` : '';
  const quoteHtml = r.q ? `<blockquote><p>${esc(r.q)}</p></blockquote>` : r.rq ? report(r.id, r.rq, r.where) : r.fq ? fromCase(r.id, r.fq, r.where) : '';
  const note = r.note ? r.note : gb6Note(r) ? `${gb6Note(r)} <span class="also">As recorded in the case file.</span>` : '';
  return `<article class="policy"><div class="policy-head"><h3>${esc(f.place)}</h3>${pill(f.outcome)}</div>
<p class="also">${esc(f.who)} ${f.link}${f.authority && f.who !== 'Appeal' ? `, ${esc(f.authority)}` : ''}, ${esc(f.date)}${where ? `, ${where}` : ''}. ${esc(f.dev || '')}</p>
${quoteHtml}
${note ? `<p>${note}</p>` : ''}</article>`;
}
const byDate = (a, b) => (rowFacts(b).date < rowFacts(a).date ? -1 : 1);
const cards = (list) => `<div class="policies">${list.map(card).join('\n')}</div>`;
const housingNotFound = rows('notfound').filter((r) => isAppeal(r) && isHousing(r));
const otherNotFound = rows('notfound').filter((r) => isAppeal(r) && !isHousing(r));
const councilNotFound = rows('notfound').filter((r) => !isAppeal(r));
const notreqList = rows('notreq').map((r) => { const f = rowFacts(r); return `<li>${esc(f.place)}, appeal ${f.link} (${esc(f.outcome)}): ${esc(f.dev || '')}</li>`; }).join('\n');

const register = `<section id="register"><h2>The decisions</h2>
<p>Every decision letter in our corpus (${num(lettersTotal)} letters) was searched for the phrase "very special circumstances", and every decision in our database (${num(all.length)} decisions, ${num(fw26.length)} under the August 2026 Framework) for a finding under GB6. ${num(lettersUsing)} letters use the phrase. Each was read and classified. ${N.found + N.notfound + N.split} decisions applied the test and are listed with the sentence that decided them; ${N.notreq} letters found the development not inappropriate and so never reached it. The quotation from each letter is checked against the letter, and its paragraph number is proved from the letter, when this page is built. The build fails if a letter in the corpus uses the phrase and has no row here. Dataset as at ${fmt(asAt)}.</p>
<div class="stats">
<div class="stat"><div class="n">${N.found}</div><div class="l">Found: ${N.foundAppeal} at appeal, 1 by the Secretary of State, ${N.foundCouncil} by councils</div></div>
<div class="stat"><div class="n">${N.split}</div><div class="l">Found by officers, refused by members</div></div>
<div class="stat"><div class="n">${N.notfound}</div><div class="l">Not found: ${N.notfoundAppeal} at appeal, ${N.notfoundCouncil} by councils</div></div>
<div class="stat"><div class="n">${N.notreq}</div><div class="l">Not inappropriate, so not required</div></div>
</div>
<h3 id="reg-found">Very special circumstances found</h3>
${cards(rows('found'))}
<h3 id="reg-split">Found by officers, not by members</h3>
${cards(rows('split'))}
<h3 id="reg-housing">Not found: housing</h3>
<p class="note">Appeals on new homes, conversions, replacement dwellings and residential caravans, newest first.</p>
${cards(housingNotFound.sort(byDate))}
<h3 id="reg-other">Not found: extensions, outbuildings and other uses</h3>
${cards(otherNotFound.sort(byDate))}
<h3 id="reg-council">Not found: council decisions</h3>
${cards(councilNotFound)}
<h3 id="reg-notreq">Not inappropriate, so the test was not reached</h3>
<p class="note">Letters that use the phrase only to record that the proposal falls within a GB7 category and so "should not be regarded as harmful to the Green Belt or be required to demonstrate very special circumstances". Several were still dismissed on other grounds.</p>
<ul class="compact">${notreqList}</ul>
<p class="note">Not listed: ${Object.entries(EXEMPT).map(([ref, why]) => `appeal <a href="${PINS_APPEALS}${ref}">${ref}</a> (${esc(why)})`).join('; ')}.</p>
</section>`;

const extraCss = `<style>.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}.stat{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:14px 16px}.stat .n{font:600 30px/1 var(--serif);color:var(--accent);font-variant-numeric:tabular-nums}.stat .l{font-size:13.5px;margin-top:6px}
section>ol,section>ul{margin:0;padding-left:20px;display:grid;gap:8px;max-width:72ch}section>ol>li,section>ul>li{font-size:15.5px}section>ol blockquote,section>ul blockquote{margin-top:6px;margin-bottom:6px}h3{font:600 17px/1.35 var(--sans);margin-top:8px}
.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}table{border-collapse:collapse;width:100%;font-size:14px;min-width:560px}th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--line)}th{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.policy h3{margin-top:0}.policy blockquote{margin-top:2px}ul.compact{padding-left:20px;margin:0;display:grid;gap:4px}ul.compact li{font-size:14px}
.fork{display:grid;gap:12px}.fork-q{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:14px 16px;font-weight:600;text-align:center}.fork-q small{display:block;font-weight:400;color:var(--muted);font-size:13px;margin-top:4px}
.fork-arms{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}.fork-arm{border:1px solid var(--line);border-radius:8px;padding:14px 16px;display:grid;gap:8px;background:var(--surface)}.fork-arm p{font-size:14.5px}.fork-h{font-weight:700;font-size:14px;letter-spacing:.02em}.fork-arm.ok{border-top:4px solid var(--ok)}.fork-arm.ok .fork-h{color:var(--ok)}.fork-arm.no{border-top:4px solid var(--no)}.fork-arm.no .fork-h{color:var(--no)}</style>`;

const SOURCES = [
  `National Planning Policy Framework, August 2026: <a href="${GOVUK_NPPF}">GOV.UK</a>; <a href="${GOVUK_CH13}">chapter 13, Protecting Green Belt land</a>; our <a href="${NPPF_MD}">Markdown edition</a>. Policies GB6, GB7, GB8 and S5(5).`,
  'National Planning Policy Framework, December 2024, ¶153 and ¶160 (UK Government Web Archive copy: <a href="https://webarchive.nationalarchives.gov.uk/ukgwa/20250225172715id_/https://assets.publishing.service.gov.uk/media/67aafe8f3b41f783cca46251/NPPF_December_2024.pdf">PDF</a>).',
  `Planning Inspectorate, Consolidated Inspector Training Manual, 17 September 2026, chapter 24 Green Belts (version 29, updated for the August 2026 Framework), ¶7, ¶36, ¶43 to ¶56; our <a href="${ITM_MD}">Markdown edition</a>. The manual is training material and "does not constitute Government policy or guidance".`,
  'Cornerstone Barristers, <a href="https://cornerstonebarristers.com/wp-content/uploads/2026/08/The-revised-NPPF-navigating-the-new-rules-based-planning-system.pdf">The revised NPPF: navigating the new "rules-based planning system"</a>, 19 August 2026.',
  'Planning Geek, <a href="https://www.planninggeek.co.uk/2026/south-nutfield-grey-belt-gb7/">South Nutfield grey belt: GB7 location test fails</a>, 21 September 2026; and <a href="https://www.planninggeek.co.uk/2026/tandridge-grey-belt/">Grey belt homes refused despite 1.97-year housing supply</a>, 7 September 2026.',
  'Livedin, <a href="https://livedin.co.uk/nppf-2026/policy-test">NPPF 2026 policy test</a> (Green Belt route text), retrieved 2 October 2026.',
  'Freeths, <a href="https://www.freeths.co.uk/insights-events/legal-articles/2026/from-consultation-to-publication-what-has-changed-in-the-new-nppf/">From consultation to publication: what has changed in the new NPPF?</a>, 1 September 2026 (where the GB7 tests are met, "planning permission should be granted without the need to demonstrate very special circumstances").',
  `Decision letters: the Planning Inspectorate <a href="https://appeal-planning-decision.service.gov.uk/">appeals service</a>; every letter quoted is held in the research repository under <code>data/open-sources/pins-corpus/</code>. The Secretary of State's decision on EN020032 is on the <a href="https://national-infrastructure-consenting.planninginspectorate.gov.uk/projects/EN020032">National Infrastructure Planning</a> site. Council reports are linked from each decision's page.`,
  `The <a href="${DECISION_PAGES}">decisions database</a> and the analysis note <code>data/decisions/analysis/green-belt.md</code> in the research repository.`,
  `Companion page: <a href="${PRESUMPTION}">"Substantially outweighed": the presumption under the 2026 NPPF</a>, on the balance that applies everywhere this test does not.`,
];
check(FREETHS, 'planning permission should be granted without the need to demonstrate very special circumstances');

const html = page({
  title: 'Very Special Circumstances',
  description: `What "very special circumstances" means in the August 2026 NPPF: the GB6(2) test, where it came from, how inspectors are trained to run it, when it applies (only after a proposal fails every GB7 category), what has and has not counted, and ${N.found + N.notfound + N.split} decisions that applied it, each with the sentence that decided it.`,
  url: URL,
  breadcrumb: '<a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/england/">England</a> › Very special circumstances',
  h1: '"Very special circumstances" under the 2026 NPPF',
  dek: `The Green Belt test in GB6(2): what it says, when it is reached, how inspectors run it, what has counted since 17 August 2026, and every decision so far that applied it.`,
  body: extraCss + short + test + method + when + counted + register,
  sources: SOURCES,
  credit: `Prepared by Planning Distilled. External sources were retrieved on ${RETRIEVED}.`,
});

const out = path.join(SITE, SITE_PATH);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`wrote ${path.join(out, 'index.html')}: ${REGISTER.length} register rows (${N.found} found, ${N.split} split, ${N.notfound} not found, ${N.notreq} not required); ${lettersUsing} letters use the phrase`);
