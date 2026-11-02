// Castle Farm, Studley (25/00989/FUL): a Stratford-on-Avon officer report that follows the August 2026 NPPF,
// test by test, in the order the report takes them. The exemplar against which the four recurring errors in
// the Stratford table are measured.
//   node pages/authority/stratford-dc/castle-farm-report/build.mjs   (writes into main-site; needs ../sources)
// Every quotation is checked against the report text, with its page, when the page is built; the build fails on
// a mismatch, and it fails if the claim that this is the only clean report in the Stratford table stops holding.
import fs from 'node:fs';
import path from 'node:path';
import { DECISIONS, SITE } from '../../../../paths.mjs';
import { check, esc, page, quote } from '../../../_shared/policy-weight.mjs';

const SITE_PATH = 'research/authority/stratford-dc/castle-farm-report/';
const URL = 'https://planningdistilled.org/' + SITE_PATH;
const REPORT = 'sources:council/sweep/stratford/25-00989-FUL/report-Officer Report.txt';
const NOTICE = 'sources:council/sweep/stratford/25-00989-FUL/notice-Decision Letter.txt';
const NOTE = '/research/authority/stratford-dc/nppf-2026-decisions/';
const COMPARED = '/research/authority/officer-reports-compared/';
const DP3_PAGE = '/research/england/dp3-design/';
const SUSTAINABLE = '/research/england/sustainable-location/';
const SETTLEMENT = '/research/england/what-is-a-settlement/';
const VSC = '/research/england/very-special-circumstances/';
const PRESUMPTION = '/research/england/substantially-outweighed/';
const GITHUB = 'https://github.com/planningdistilled/research/blob/main/data/decisions/analysis/';
const TOOL = 'https://www.gov.uk/guidance/connectivity-tool';

// ---- The Stratford table: is this the only report clean on every test it engages? ----
function tsv(file) {
  const text = fs.readFileSync(path.join(DECISIONS, 'analysis', file), 'utf8');
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') quoted = false; else cell += ch;
    } else if (ch === '"' && cell === '') quoted = true;
    else if (ch === '\t') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (ch !== '\r') cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.length > 1);
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}
const code = (v) => (v || '').trim().split(/[\s;:(]/)[0].toLowerCase();
const S = tsv('stratford-officer-reports-four-errors.tsv');
const clean = S.filter((r) => code(r.tier) === 'ok' && code(r.tr3) === 'assessed' && code(r.annexb) === 'ok' && code(r.dp33) === 'ok' && code(r.template_weight) === 'no');
if (clean.length !== 1 || clean[0].ref !== '25-00989-FUL') throw new Error('the page says Castle Farm is the only Stratford report clean on all four tests with no template paragraph; the table now says: ' + clean.map((r) => r.ref).join(', '));
const row = clean[0];
const noTemplate = S.filter((r) => code(r.template_weight) === 'no').length;
const dp33Ok = S.filter((r) => code(r.dp33) === 'ok').length;
const tr3Assessed = S.filter((r) => code(r.tr3) === 'assessed').length;
const tierOk = S.filter((r) => code(r.tier) === 'ok').length;
if (code(row.connectivity_tool) !== 'no') throw new Error('the page says the Connectivity Tool is not used');

/** An inline checked quotation from the report. */
const q = (text, pg) => { check(REPORT, text, pg); return `"${esc(text)}"`; };
/** A block quotation from the report with its page. */
const R = (text, pg) => quote(REPORT, text, `Officer report, p.${pg}`, pg);
/** A block quotation from the Framework. */
const N = (text, cite) => quote('nppf', text, `NPPF, ${cite}`);

const intro = `<section id="why"><div class="rule">
<p>Castle Farm is a model farm of 1880 east of Studley: curtilage listed with the Grade II listed farmhouse, in the West Midlands Green Belt, in open countryside and in the Arden Special Landscape Area. The application was to convert the farm buildings to 13 homes. The delegated report, by case officer Chris Hill, recommended refusal on seven grounds and the notice was issued on 30 October 2026, the same day as the matching listed building consent was refused.</p>
<p>It is on this site because of how it decides, not what it decides. The <a href="${NOTE}">Stratford note</a> scores every Council officer report since 17 August 2026 against four recurring departures from the August 2026 Framework: a village's tier in the settlement hierarchy used as the test of a sustainable location; TR3 not applied; S4 or S5 applied in a Green Belt village that the Framework's Annex B does not treat as a settlement; and a design conflict weighed away without asking whether it was clearly justified. Of the ${S.length} reports in <a href="${GITHUB}stratford-officer-reports-four-errors.tsv">the table</a>, this is the only one that engages all four tests and passes them, and that does so without the standard paragraph cutting the Core Strategy's location policies to very limited weight wholesale. It is also the first Stratford report to apply DP3(3) and the S5(2) trigger in terms.</p>
<p>What follows is the report's own order of tests, with the question each step asks, the Framework policy it turns on, and the report's answer in its words. Page numbers are to the <a href="https://apps.stratford.gov.uk/EplanningV2/API/v1/Document/a241bb9b-525d-ca40-c296-08df367f2a8c/Download">report PDF</a>. A reader who wants a template for a rural conversion in the Green Belt can read the steps as a checklist.</p>
</div></section>`;

const step = (n, title, policy, body) => `<li id="step-${n}"><div class="step-head"><h3>${esc(title)}</h3><span class="policy">${esc(policy)}</span></div>${body}</li>`;

const steps = `<section id="order"><h2>The order of the tests</h2>
<ol class="steps">
${step(1, 'Which Framework, and what the plan is worth', 'Annex A(1), Annex A(2)', `
<p>The report starts with the statutory test and then says which Framework applies and what that does to the development plan. It states the transition in terms, rather than carrying the 2024 presumption forward.</p>
${R('The NPPF was replaced in August 2026. Its policies are material from the day of publication (Annex A, paragraph 1).', 8)}
${R('The presumption in paragraph 11(d) of the December 2024 Framework no longer exists. It has been replaced by policies S3 to S5. Policy S5 does not apply in the Green Belt. Proposals there are determined under policies GB6 to GB8 and, where development is not inappropriate, should be approved unless the benefits would be substantially outweighed by the adverse effects (S5(5)).', 8)}
<p>The Council's Interim Policy Position Statement, written under the old Framework, is kept only for what it still does: ${q('so its references to paragraph 11(d) no longer apply. Its assessment of which Core Strategy policies are out of date for housing remains relevant to weight', 8)}. The five-year supply figure is stated and the benefit of homes is given the weight HO7 requires. Nothing in the balance later depends on a tilted balance that no longer exists.</p>`)}
${step(2, 'Which plan policy applies, and which parts of it keep their weight', 'Annex A(2); AS.10(d); GB7(1)(b), L2(1)(b), HO11(1)(c), HE4, DP3', `
<p>The site is placed first: ${q('The site lies outside any settlement and Policy AS.10 applies. The only route for new dwellings of this kind under AS.10 is criterion (d).', 8)} The report then takes AS.10(d) limb by limb and asks of each limb whether it is materially inconsistent with a national decision-making policy. That is what Annex A(2) requires, and it is the opposite of the wholesale cut found in ${S.length - noTemplate} of the ${S.length} Stratford reports.</p>
${N('Development plan policies (or parts of those policies) which are materially inconsistent with national decision-making policies in this Framework should be given very limited weight. The only exception to this is where they have been examined and adopted or made against this Framework. Other development plan policies should not be given reduced weight simply because they were adopted prior to the publication of this Framework.', 'Annex A(2)')}
<p>The limb confining conversion to redundant or disused buildings goes, because GB7(1)(b) and L2(1)(b) do not have it:</p>
${R('In so far as AS.10(d) limits conversion to buildings that are redundant or disused, it is materially inconsistent with national policy, and I give that conflict very limited weight.', 9)}
<p>The "only viable use" limb goes for the same reason, against HO11(1)(c) and GB7(1)(b). The limb that survives is named and given full weight:</p>
${R('The requirement that the building is capable of conversion in a manner appropriate to its character and setting is consistent with policies HE4 and DP3 and carries full weight.', 9)}
<p>The report does the same later for CS.26, cutting only the part that sets a stricter highways test than TR6(4): ${q('In so far as Policy CS.26 sets a stricter test than TR6(4), it is materially inconsistent with national policy and I give that part very limited weight (Annex A, paragraph 2).', 16)}</p>`)}
${step(3, 'Is the site isolated?', 'S5(3), HO11', `
<p>Before asking whether the location is sustainable, the report asks the prior question the Framework puts first for homes in the countryside, and answers it on the facts of the ground rather than on a boundary or a tier.</p>
${N('Development proposals comprising isolated homes, which are those lying outside settlements or groups of houses, should not be approved other than in accordance with policy HO11.', 'S5(3)')}
${R('The buildings adjoin Castle Farmhouse and lie about 100m from a small group of dwellings, so the site is not isolated in the sense of NPPF policies S5(3) and HO11. The concern is its accessibility.', 9)}
<p>Because the site is in the Green Belt, S5 itself is disapplied by S5(5) and the question whether anything nearby is a <a href="${SETTLEMENT}">settlement as Annex B defines it</a> never has to be decided. The report takes the Green Belt route at step 6 instead. That is the right order, and it is the order that the Annex B error in other Stratford reports gets wrong.</p>`)}
${step(4, 'Is the location sustainable? TR3 applied to the facts', 'TR3(1)(a); GB7(1)(g)(iii)', `
<p>This is the test most Stratford reports replace with the village's tier. Here the question is answered with the applicant's own trip figures, the absence of public transport and the character of the road, and TR3(1)(a) is named as the policy being applied, with its threshold judged in context.</p>
${N('Development proposals which could generate a significant amount of movement, in the context of the area within which they would be situated, should be in locations that are sustainable (or which can be made so, taking into account planned improvements, including any provided for as part of the development itself). This means the location should limit the need to travel, particularly by private car, and offer a genuine choice of transport modes for residents and users, unless the nature of the development would make this impractical;', 'TR3(1)(a)')}
${R('The site is not served by public transport, and future occupiers of 13 dwellings would rely on private cars for almost all journeys.', 9)}
${R('Thirteen homes would add regular daily trips for work, education, shopping and services throughout the year, almost all of them by car, along a private drive and a narrow rural lane. In the context of a farmstead in open countryside, that is a significant amount of movement for the purposes of TR3(1)(a).', 9)}
<p>The conflict is then given a weight, and the reason for the weight is stated: ${q('The IPPS treats the spatial strategy in CS.15, and Policy CS.16 in so far as it provides for insufficient homes, as out of date given the housing shortfall, so I give this conflict moderate weight.', 9)} The same finding is reused at step 6 to answer GB7(1)(g)(iii). See <a href="${SUSTAINABLE}">what decides a sustainable location</a> for how inspectors run the same test.</p>`)}
${step(5, 'The emerging plan', 'DM4', `
<p>The South Warwickshire Local Plan is placed by its stage, with the reason given, before any of its policies is used: ${q('Under NPPF policy DM4, the weight given to emerging policies depends on the stage of preparation, the extent of unresolved objections and their consistency with the Framework. I give the emerging policies very limited weight.', 10)} Each later section names the emerging policy that points the same way and repeats that it carries very limited weight, so the reader can see that nothing turns on it.</p>`)}
${step(6, 'Green Belt: is the development inappropriate?', 'GB6(1); GB7(1)(b), GB7(1)(e), GB7(1)(f), GB7(1)(g); GB8', `
<p>The report runs GB7 category by category and splits the proposal into its two parts, the reuse of the buildings and the change of use of the land around them, because the Framework treats them differently.</p>
${N('Development in the Green Belt is inappropriate unless it falls within one of the categories in policy GB7.', 'GB6(1)')}
<p>The buildings first. The report notices what changed in 2026 and does not import the old openness test into GB7(1)(b): ${q('Unlike the previous Framework, this category no longer carries a separate test of preserving openness.', 10)} It finds that ${q('The buildings are nonetheless of permanent and substantial construction, and their reuse falls within GB7(1)(b).', 10)}</p>
<p>The land next. The yards and surrounding land would become 13 gardens, 36 parking spaces and a bin store. That is a material change of use of land, which GB7(1)(f) allows only ${q('where its impact on openness is minimised and there is no significant conflict with the Green Belt purposes', 10)}:</p>
${R('They would extend domestic activity into the countryside, in significant conflict with the purpose of safeguarding the countryside from encroachment (GB2(1)(c)). The impact on openness has not been minimised, although the harm to openness would be limited.', 11)}
<p>Then the categories that do not apply are closed off, with the grey belt question answered through TR3 and the Golden Rules rather than left open:</p>
${R('Even if the site were grey belt land, the development would not be in a sustainable location with reference to policy TR3', 11)}
${N('The development would be in a sustainable location, with particular reference to policy TR3 of this Framework', 'GB7(1)(g)(iii)')}
${R('The reuse of the buildings is not inappropriate, but the change of use of the land is. I conclude that the proposal is inappropriate development in the Green Belt.', 11)}
<p>Whether <a href="${VSC}">very special circumstances</a> exist is left for the balance, where it belongs.</p>`)}
${step(7, 'Heritage: significance, harm, justification, benefits', 's.16(2) and s.66(1); CS.8; HE4, HE5, HE6', `
<p>The heritage section runs in the Framework's order. First the statutory duty and its weight. Then whether the buildings are listed at all, decided against Historic England's advice note and the case law: ${q('I agree that the buildings form part of the listed building.', 12)} Then significance, set out from the submitted assessment and the Conservation Officer's response. Then the quality of the applicant's assessment, measured against HE5:</p>
${R('The scheme has not been informed by an accurate understanding of the significance of the asset. It does not meet HE5(1), and I cannot be satisfied that the submitted assessment accurately reflects the effects of the proposal (HE5(4)).', 12)}
<p>Then the degree of harm, placed on HE5(2)(c)'s definition of substantial harm: ${q('I therefore place the harm below substantial, but at a high degree, consistent with the Conservation Officer\'s assessment.', 13)} Then the HE4 questions, whether harm has been avoided or minimised and whether it is justified:</p>
${N('Any harm to, or loss of, the significance of a designated heritage asset (including from development within its setting) should have a clear and convincing justification in accordance with the policies in this chapter.', 'HE4(2)')}
${R('There is no clear and convincing justification for the harm (HE4(2)).', 13)}
<p>Only then the public benefits, each named with the policy that gives it weight (HO7 for the homes, HE6(4) and L2(1)(b) for the reuse of an underused listed building), and the weighing under HE6:</p>
${R('Taken together, these benefits do not outweigh the high degree of harm to designated heritage assets, to which I give considerable importance and weight.', 13)}`)}
${step(8, 'Design and character: the DP3(3) question asked', 'DP3(1), DP3(3); CS.5, CS.9, CS.12, CS.20; SPD Part G', `
<p>This is the step that no other Stratford report takes. The report states DP3(3) accurately, as a rule of refusal with a condition attached, finds the conflict, and then asks the condition's question.</p>
${N('Development proposals should be refused if, without clear justification, they conflict with paragraph 1 of this policy or relevant aspects of the principles in paragraph 2, or with any explicit design standards set out in the development plan (including those in locally-specific policies, guides, codes or masterplans). Substantial weight should be given to compliance with relevant development plan policies when assessing the design quality of proposals.', 'DP3(3)')}
${R('Under DP3(3), development should be refused if it conflicts with those principles without clear justification, and substantial weight is given to compliance with development plan design policies.', 14)}
${R('I conclude that the proposal conflicts with Policies CS.5, CS.9, CS.12 and CS.20, Part G of the Development Requirements SPD and NPPF policy DP3, and there is no clear justification for that conflict.', 14)}
<p>The explicit design standards in the plan are identified too: the Development Requirements SPD's rules that farm courtyards should not be subdivided and that openings should be kept to a minimum, both of which the scheme runs counter to. The finding is carried to the balance as a DP3(3) conflict, not folded into a general weight. See <a href="${DP3_PAGE}">DP3: the design policy</a>.</p>`)}
${step(9, 'Housing mix, affordable housing and the Golden Rules', 'HO8(1), HO8(4); GB8(1)(a)(i), GB8(1)(c), GB8(2), GB8(3); CS.18, CS.19', `
<p>The report works out that the scheme is major development in the Green Belt, so GB8 applies and the HO8(4) discount for vacant buildings does not. The uplift is applied as the guidance says: ${q('The CS.18 requirement of 35% therefore becomes 50%. The scheme offers five of 13 homes, well short of that level.', 15)} The green-space rule is checked. The viability escape is checked against its three gateways and found closed: ${q('A viability case can only be made in the circumstances in GB8(3). The site is not previously developed land, not a strategic site and not a type of development outside the plan viability evidence, so none applies, and no viability assessment has been submitted.', 15)}</p>
${N('In considering applications for major development involving the provision of housing on land released from the Green Belt through plan preparation or review, or on sites in the Green Belt subject to a planning application, substantial weight should be given to the importance of complying with the Golden Rules.', 'GB8(2)')}`)}
${step(10, 'The remaining topics, each with its own policy and test', 'CS.25; TR6(4); L2; N2 and Circular 06/2005; F8; CC2(2)', `
<p>Open space, highways, neighbouring amenity, ecology, drainage and climate measures follow, in that order, each with the plan policy, the Framework policy, the test and a finding. Two of them show the same discipline as the big tests. On protected species the report refuses to leave the survey to a condition, citing the circular: ${q('Surveys should only be left to conditions in exceptional circumstances.', 17)} On drainage, with the Lead Local Flood Authority objecting and no strategy submitted: ${q('For a major development of 13 dwellings, where the existing drainage arrangements are reported to cause flooding on neighbouring land, this is not a matter that can be left to a condition.', 18)}</p>`)}
${step(11, 'The planning balance, in two stages', 'GB6(2) very special circumstances; then S5(5) and S5(2) for completeness', `
<p>The balance lists every harm with its weight and the policy that sets the weight, then every benefit the same way, with care not to count the reuse of the buildings twice: ${q('It is the same benefit as the long-term reuse of an underused listed building under HE6(4), and I do not count it twice.', 19)} The very special circumstances test is answered first, because the development is inappropriate. Then, in case that finding is wrong, the report runs the test that would apply if it were not, and uses S5(2) as the Framework writes it:</p>
${N('In applying this policy, the circumstances in which the benefits of approving development proposals are likely to be substantially outweighed by adverse effects include, but are not restricted to, situations where the development proposal would fail to comply with one of the national decision-making policies which state that development proposals should be refused in specific circumstances.', 'S5(2)')}
${R('These benefits do not clearly outweigh the harm to the Green Belt and the other harm identified. Very special circumstances do not exist. For completeness, had the development not been inappropriate, policy S5(5) would require approval unless the benefits were substantially outweighed by the adverse effects. Applying S5(2), the proposal conflicts with policy DP3(3), a national decision-making policy which states that development should be refused in these circumstances, and the heritage harm lacks the clear and convincing justification required by HE 4(2). The benefits would be substantially outweighed.', 19)}
<p>The two refusal rules found earlier, DP3(3) at step 8 and HE4(2) at step 7, are what trigger S5(2). That is the structure the <a href="${PRESUMPTION}">"substantially outweighed"</a> page describes from the appeal decisions. The report closes on section 38(6): ${q('The proposal conflicts with the Development Plan when read as a whole and with the national decision-making policies of the NPPF. There are no material considerations that indicate a decision otherwise.', 19)}</p>`)}
${step(12, 'Reasons for refusal and what could be overcome', 'DM3', `
<p>Seven reasons follow, each tied to the plan policies and the Framework policies it rests on; reason 3 is the location reason, in TR3's terms: ${(() => { check(NOTICE, 'The proposal would result in 13 dwellings in a location where future occupiers would be reliant on the private car.'); return '"The proposal would result in 13 dwellings in a location where future occupiers would be reliant on the private car."'; })()} The notes record that the Council wrote to the applicant on 6 August 2026 ${q('setting out its concerns and the fundamental nature of the objections, and invited the applicant to withdraw the applications and seek further pre-application advice on an alternative scheme', 21)}, and they separate the reasons that go to the scheme from the two that a planning obligation or a drainage strategy could cure: ${q('the Local Planning Authority recognises that reason 6 could be overcome by a completed planning obligation securing policy-compliant affordable housing and public open space', 22)}.</p>`)}
</ol>
</section>`;

const errors = `<section id="four"><h2>The four errors, and what this report does instead</h2>
<div class="table-wrap"><table><thead><tr><th>Error in the Stratford table</th><th>What Castle Farm does</th><th>Where</th></tr></thead><tbody>
<tr><th scope="row">The village's tier used as the test of a sustainable location</th><td>No tier is mentioned. The site is placed as open countryside under AS.10 and the location is decided on the absence of public transport, the trip figures and the lane.</td><td>Step 4, p.8 to 9</td></tr>
<tr><th scope="row">TR3 not applied</th><td>TR3(1)(a) is named, its threshold judged in context, the conflict found and weighted; the same finding answers GB7(1)(g)(iii).</td><td>Steps 4 and 6, p.9 and 11</td></tr>
<tr><th scope="row">S4 or S5 applied in a Green Belt village that Annex B does not treat as a settlement</th><td>S5 is disapplied at the outset because the site is in the Green Belt, and GB6 to GB8 are run in full. The isolation question under S5(3) is answered on the ground.</td><td>Steps 1, 3 and 6, p.8 to 11</td></tr>
<tr><th scope="row">A design conflict weighed away without the DP3(3) question</th><td>DP3(3) is stated as a refusal rule, the conflict found, the clear-justification question asked and answered, and the conflict carried into the balance through S5(2).</td><td>Steps 8 and 11, p.14 and 19</td></tr>
<tr><th scope="row">The template paragraph cutting CS.15, CS.16 and AS.10 to very limited weight wholesale</th><td>Absent. Annex A(2) is applied limb by limb to AS.10(d) and part by part to CS.26, with the surviving limb given full weight.</td><td>Step 2, p.9 and 16</td></tr>
</tbody></table></div>
<p>Across the ${S.length} Stratford reports in the table, ${tierOk} decide the location on the route rather than the tier, ${tr3Assessed} apply TR3, ${dp33Ok} are clear of the DP3(3) error and ${noTemplate} have no template paragraph. Castle Farm is the only report in all four groups at once. The counts and the other reports are in the <a href="${NOTE}">Stratford note</a>, and the same four tests across 27 other councils are on the <a href="${COMPARED}">comparison page</a>.</p>
</section>`;

const limits = `<section id="limits"><h2>Where a reader might press</h2>
<ul>
<li><strong>It is a refusal.</strong> The method was not tested by a scheme the officer wanted to approve. The Stratford reports that show the four errors are mostly recommendations to grant, where a tier finding or a weighed-away design conflict changes the result. A report that ran these tests in this order and then recommended approval would be the stronger exemplar.</li>
<li><strong>The TR3 conflict is discounted by reference to the plan.</strong> The report gives the TR3(1)(a) conflict moderate weight because the Interim Policy Position Statement treats CS.15 and CS.16 as out of date. TR3 is a national decision-making policy; a conflict with it does not depend on the weight of the plan's distribution policies, and a reader may ask why the discount applies to it.</li>
<li><strong>The Connectivity Tool is not used.</strong> TR3(2) expects it to be used alongside other evidence. The location finding here rests on the applicant's transport appraisal and the facts of the site, which is one acceptable input; no Stratford report has used the Tool, and few elsewhere do (<a href="${TOOL}">gov.uk</a>; see the <a href="${COMPARED}#best">comparison page</a>).</li>
<li><strong>The "only viable use" limb.</strong> The report gives that part of AS.10(d) very limited weight, then uses the weakness of the marketing evidence in the heritage balance. That is consistent, since HE6(4)'s benefit is the long-term reuse of the building and the evidence goes to whether this degree of change is needed to secure it, but it shows how a cut limb can still do work.</li>
<li><strong>Small slips.</strong> The GB7(1)(f) sub-limb is misnumbered once and GB8 is misprinted as "GB&amp;" in two places in the text extract; neither affects the reasoning.</li>
</ul>
</section>`;

const extraCss = `<style>
ol.steps{list-style:none;counter-reset:step;margin:0;padding:0;display:grid;gap:18px;max-width:none}
ol.steps>li{counter-increment:step;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:16px 18px 6px;position:relative}
ol.steps>li>.step-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px;margin-bottom:6px}
ol.steps>li>.step-head h3{margin:0;font:600 17px/1.35 var(--sans)}
ol.steps>li>.step-head h3::before{content:counter(step) ". ";color:var(--accent);font-family:var(--mono);font-weight:500}
ol.steps .policy{font:500 12.5px/1.4 var(--mono);color:var(--accent);background:var(--accent-soft);border-radius:4px;padding:2px 8px}
ol.steps p{font-size:15.5px}
ol.steps blockquote{margin:8px 0 12px}
.table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:8px;background:var(--surface);margin:0 0 14px}
table{border-collapse:collapse;width:100%;font-size:14.5px}th,td{text-align:left;vertical-align:top;padding:8px 10px;border-top:1px solid var(--line)}
thead th{border-top:0;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);background:var(--surface-2)}tbody th{font-weight:600}
section>ul{margin:0;padding-left:20px;display:grid;gap:8px;max-width:72ch}section>ul>li{font-size:15.5px}
h3{font:600 17px/1.35 var(--sans)}
</style>`;

const html = page({
  title: 'Castle Farm: an officer report in the Framework\'s order',
  description: 'The Stratford-on-Avon delegated report on Castle Farm, Studley (25/00989/FUL, refused 30 October 2026), read as an exemplar under the August 2026 NPPF: the order of the tests from Annex A(2) through S5(3), TR3(1)(a), GB6 to GB8, HE4 to HE6 and DP3(3) to the S5(2) balance, with the report\'s words at each step. The only Stratford report clean on all four recurring errors. Every quotation page-checked.',
  url: URL,
  breadcrumb: '<a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/authority/">Local planning authorities</a> › <a href="/research/authority/stratford-dc/">Stratford-on-Avon</a> › Castle Farm report',
  h1: 'Castle Farm, Studley: an officer report that takes the tests in the Framework\'s order',
  dek: 'A delegated report of 30 October 2026 on 13 homes in listed farm buildings in the Green Belt, refused. Twelve steps, from which Framework applies to the S5(2) balance, each with the question, the policy and the report\'s answer.',
  body: extraCss + intro + steps + errors + limits,
  sources: [
    'Stratford-on-Avon District Council, delegated officer report on 25/00989/FUL and 25/00990/LBC, Castle Farm, Studley (case officer Chris Hill, signed 26 October 2026), and the decision notice of 30 October 2026; both from the Council\'s planning register. Page references are to the report PDF.',
    'National Planning Policy Framework, August 2026: Annex A(1) and (2), S5(2), S5(3), S5(5), TR3(1)(a), TR3(2), GB6(1), GB7(1)(b), (e), (f) and (g), GB8, HE4(2), HE5, HE6(4), DP3(3), HO7, HO11(1)(c), L2(1)(b), DM3, DM4.',
    `The Stratford table of ${S.length} officer reports scored against the four errors: <a href="${GITHUB}stratford-officer-reports-four-errors.tsv">stratford-officer-reports-four-errors.tsv</a>, with the <a href="${GITHUB}stratford-officer-reports-four-errors.md">analysis note</a> and the <a href="${GITHUB}four-errors-rubric.md">rubric</a>.`,
    `See also the <a href="${NOTE}">note on Stratford decisions under the 2026 NPPF</a>, the <a href="${COMPARED}">comparison across 27 other councils</a>, and the England pages on <a href="${SUSTAINABLE}">sustainable location</a>, <a href="${DP3_PAGE}">DP3</a>, <a href="${VSC}">very special circumstances</a> and <a href="${PRESUMPTION}">"substantially outweighed"</a>.`,
  ],
  credit: 'Prepared by a local resident.',
});
const out = path.join(SITE, SITE_PATH);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`✓ ${SITE_PATH}: ${S.length} Stratford rows; tier ok ${tierOk}, TR3 assessed ${tr3Assessed}, DP3(3) ok ${dp33Ok}, no template ${noTemplate}`);
