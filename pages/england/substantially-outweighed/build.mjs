// "Substantially outweighed": the presumption in favour of development under the August 2026 NPPF. Where
// the words appear (S1, S4, S5(1), S5(4), S5(5), S6), what replaced the 2024 "significantly and
// demonstrably" tilted balance, how the "should be refused" triggers work, the reversed form in S5(4), the
// join with the Green Belt, the drafting traps, and a register of every decision in the database with a
// finding under S4, S5 or S6.
//   node pages/england/substantially-outweighed/build.mjs   (writes into main-site; needs ../sources for
//   the commentary it quotes)
// Every quotation is checked against its source text when the page is built, and the paragraph number of
// every letter quotation is proved from the letter; the build fails on a mismatch.
import fs from 'node:fs';
import path from 'node:path';
import { OPEN, SITE } from '../../../paths.mjs';
import { caseById, check, esc, page, quote } from '../../_shared/policy-weight.mjs';
import { corpusRefs, letterText, paragraphOf } from '../../_shared/letters.mjs';

const SITE_PATH = 'research/england/substantially-outweighed/';
const URL = 'https://planningdistilled.org/' + SITE_PATH;
const DECISION_PAGES = '/research/england/nppf-navigator/decisions/';
const VSC = '/research/england/very-special-circumstances/';
const SETTLEMENT = '/research/england/what-is-a-settlement/';
const DP3 = '/research/england/dp3-design/';
const SUSTAINABLE = '/research/england/sustainable-location/';
const ROUTE = '/research/england/nppf-navigator/route/';
const PINS_APPEALS = 'https://appeal-planning-decision.service.gov.uk/comment-planning-appeal/appeals/';
const GOVUK_NPPF = 'https://www.gov.uk/guidance/national-planning-policy-framework';
const GOVUK_CH4 = 'https://www.gov.uk/guidance/national-planning-policy-framework-4-achieving-sustainable-development';
const NPPF_MD = 'https://github.com/planningdistilled/research/blob/main/data/open-sources/nppf/NPPF-August-2026.md';
const RETRIEVED = '8 October 2026';

// ---- Sources checked at build time ----
const NPPF_2024 = 'open:nppf/NPPF-December-2024.txt';
const DRAFT_2025 = 'open:guidance-ogl/mhclg-draft-nppf-december-2025.txt';
const GOV_RESPONSE = 'open:guidance-ogl/mhclg-nppf-consultation-government-response.txt';
const PINS_NOTE = 'open:pins-training-manual/pins-note-04-2026.md';
const CORNERSTONE = 'sources:guidance/cornerstone-revised-nppf-rules-based-planning.txt';
const PLANORAKS = 'sources:guidance/planoraks-nppf2026-welcome-to-the-future.txt';
const URBANIST = 'sources:guidance/urbanist-architecture-nppf-2026-in-practice.txt';
const THRINGS = 'sources:guidance/thrings-nppf-2026-sme-developers.txt';
const PG_PRESUMPTION = 'sources:guidance/planninggeek-presumption-sustainable-development.txt';

const md = (anchor) => `${NPPF_MD}#${anchor}`;
const nppf = (text, code, anchor) => quote('nppf', text, `NPPF, August 2026, <a href="${md(anchor)}">${esc(code)}</a>`);
const PLACE = { 'PINS-6006637': 'Hatton Station', 'PINS-6010253': 'Langley', 'PINS-6008723': 'Lydiate', 'PINS-6008688': 'Lingfield', 'PINS-6010313': 'Newchapel' };
const placeOf = (c) => PLACE[c.case_id] || c.title.replace(/\s*\([^)]*\)\s*$/, '').split(',').slice(-1)[0].trim();
const refOf = (id) => (caseById.get(id)?.appeal_ref || id.replace(/^PINS-/, ''));
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

// ---- The Framework text: every place the words appear ----
const USES = [
  { code: 'S1(1)(a)(ii)', anchor: 'S1-1-a-ii', kind: 'Plan-making', form: 'reversed', q: 'Any adverse impacts of doing so would substantially outweigh the benefits, when assessed against the policies in this Framework taken as a whole.', role: 'When a plan may provide for less than its objectively assessed need. Not a decision-making test.' },
  { code: 'S4(1)', anchor: 'S4-1', kind: 'Decision', form: 'forward', q: 'Development proposals within settlements should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework.', role: 'The presumption inside a settlement. Any development, any use.' },
  { code: 'S4(2)', anchor: 'S4-2', kind: 'Decision', form: 'triggers', q: 'In applying policy S4, the circumstances in which the benefits of approving development are likely to be substantially outweighed by adverse effects include (but are not restricted to) situations where the development proposal would:', role: 'The list of what is "likely" to tip the S4 balance: substantial impact on allocations or safeguarded land, on open space (HC7), Local Green Space (HC8), biodiversity sites (N6), Protected Landscapes (N4) or residential curtilages (L2(1)(d)); loss of cemeteries or flood storage; or any "should be refused" policy.' },
  { code: 'S5(1)', anchor: 'S5-1', kind: 'Decision', form: 'forward', q: 'Only certain forms of development should be approved outside settlements, as set out in the following list. These should be approved, unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework:', role: 'The presumption outside a settlement, for the ten listed categories (a) to (j) only.' },
  { code: 'S5(2)', anchor: 'S5-2', kind: 'Decision', form: 'triggers', q: 'In applying this policy, the circumstances in which the benefits of approving development proposals are likely to be substantially outweighed by adverse effects include, but are not restricted to, situations where the development proposal would fail to comply with one of the national decision-making policies which state that development proposals should be refused in specific circumstances.', role: 'The S5 trigger: a "should be refused" policy.' },
  { code: 'S5(4)', anchor: 'S5-4', kind: 'Decision', form: 'reversed', q: 'Development proposals which do not fall within one of the categories set out in this policy should only be approved in exceptional circumstances, where the benefits of the proposal', q2: 'would substantially outweigh the adverse effects, including to the character of the countryside and in relation to promoting sustainable patterns of movement.', role: 'Outside every category: the burden reverses. The benefits must substantially outweigh the adverse effects, and the circumstances must be exceptional.' },
  { code: 'S5(5)', anchor: 'S5-5', kind: 'Decision', form: 'forward', q: 'However, where development would not be inappropriate in these locations (through the application of policies HC8 and GB7), proposals should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in this Framework, and applying paragraph 2 of this policy.', role: 'Green Belt and Local Green Space: the presumption returns for development that is not inappropriate. Inappropriate development gets the very special circumstances test instead.' },
  { code: 'S6(1)', anchor: 'S6-1', kind: 'Decision', form: 'triggers', q: 'For development proposals involving the provision of housing, the benefits of approving development are likely to be substantially outweighed by the adverse effects where a proposal would conflict with a neighbourhood plan, provided the following apply:', role: 'A housing scheme conflicting with a neighbourhood plan made within five years that has allocations to meet its requirement is "likely" to lose the balance.' },
];
// S5(4) straddles a printed page break with footnotes between its halves in the text extract, so it is checked in two parts.
for (const u of USES) { check('nppf', u.q); if (u.q2) check('nppf', u.q2); }
const nppfText = fs.readFileSync(path.join(OPEN, 'nppf', 'NPPF-August-2026.txt'), 'utf8').replace(/\s+/g, ' ');
const nUses = (nppfText.match(/substantially outweigh/gi) || []).length;
if (nUses !== USES.length) throw new Error(`"substantially outweigh" appears ${nUses} times in the Framework but the table lists ${USES.length}: revise the table`);
if (/significantly and demonstrably/i.test(nppfText)) throw new Error('the 2026 Framework contains "significantly and demonstrably": revise "Where it came from"');
// The "should be refused" policies that S4(2)(c) and S5(2) point at.
const nppfMd = fs.readFileSync(path.join(OPEN, 'nppf', 'NPPF-August-2026.md'), 'utf8');
const REFUSED = [...nppfMd.matchAll(/<a id="([A-Z]+\d+(?:-\d+)?(?:-[a-z]+)?)"><\/a>[^\n]*?should be refused/g)].map((m) => m[1]).filter((id) => !/^S[45]-/.test(id));
const refusedCodes = [...new Set(REFUSED.map((id) => id.replace(/-(\d+)/, '($1)').replace(/-([a-z]+)/, '($1)')))];
if (refusedCodes.length < 12) throw new Error('fewer "should be refused" policies than expected: ' + refusedCodes.join(' '));

// ---- Letters ----
const refs = corpusRefs();
const flat = (ref) => letterText(ref).replace(/\s+/g, ' ');
const usingPhrase = refs.filter((r) => /substantially outweigh/i.test(flat(r)));
const oldWording = refs.filter((r) => /significantly and demonstrably/i.test(flat(r)) && /Policy S[345]\b|S5\s*\(5\)|S5:5|Policy GB7/.test(flat(r)));
const byRef = new Map([...caseById.values()].filter((c) => c.appeal_ref).map((c) => [c.appeal_ref.replace(/^.*?(\d{7})$/, '$1'), c]));
const outcomes = (list) => { const n = { allowed: 0, dismissed: 0 }; for (const r of list) { const m = flat(r).match(/appeal is (allowed|dismissed)/i); if (m) n[m[1].toLowerCase()]++; } return n; };
const phraseOutcomes = outcomes(usingPhrase);
const sCodes = /^(S4|S5|S6)\b/;
const unclassified = usingPhrase.filter((r) => byRef.has(r) && !(byRef.get(r).policy_findings || []).some((p) => sCodes.test(String(p.policy))));
const undistilled = usingPhrase.filter((r) => !byRef.has(r));

// ---- The register, from the database ----
const groupOf = (code) => {
  if (code.startsWith('S4')) return 'S4';
  if (code.startsWith('S5(1)')) return 'S5(1)';
  if (code.startsWith('S5(2)')) return 'S5(2)';
  if (code.startsWith('S5(4)')) return 'S5(4)';
  if (code.startsWith('S5(5)')) return 'S5(5)';
  if (code.startsWith('S5')) return 'S5';
  if (code.startsWith('S6')) return 'S6';
  return null;
};
const GROUPS = {
  'S4': { title: 'S4: within a settlement', blurb: 'Approve unless the benefits are substantially outweighed. Rows under S4(2) are the trigger limbs.' },
  'S5(1)': { title: 'S5(1): outside a settlement, within a category', blurb: 'The same tilt, for proposals in one of the ten categories. The finding on each limb is shown; (j) is the unmet-need route and (e) limited infilling.' },
  'S5(2)': { title: 'S5(2): a "should be refused" policy failed', blurb: 'The trigger that is "likely" to tip the S5(1) and S5(5) balances.' },
  'S5(4)': { title: 'S5(4): outside every category, "exceptional circumstances"', blurb: 'The reversed test. The benefits must substantially outweigh the adverse effects.' },
  'S5(5)': { title: 'S5(5): Green Belt, not inappropriate', blurb: 'The presumption restored for development that passes GB7, applying the S5(2) trigger.' },
  'S5': { title: 'S5 without a limb stated', blurb: 'Letters that applied S5 as a whole.' },
  'S6': { title: 'S6: a recent neighbourhood plan with allocations', blurb: 'Housing in conflict with such a plan is "likely" to lose the balance. Most rows record that the plan was too old or had no allocations, so S6 was not engaged.' },
};
const register = {};
for (const g of Object.keys(GROUPS)) register[g] = new Map();
let findings = 0;
for (const c of caseById.values()) {
  for (const p of c.policy_findings || []) {
    const g = groupOf(String(p.policy));
    if (!g) continue;
    findings++;
    if (!register[g].has(c.case_id)) register[g].set(c.case_id, []);
    register[g].get(c.case_id).push(p);
  }
}
const casesInRegister = new Set(Object.values(register).flatMap((m) => [...m.keys()]));
const fmt = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const fmtLong = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const num = (x) => x.toLocaleString('en-GB');
const FIND = { pass: 'ok', accord: 'ok', benefit: 'ok', fail: 'no', conflict: 'no', harm: 'no', 'not-engaged': 'part', neutral: 'part' };
const who = (c) => ({ inspector: 'Appeal', 'secretary-of-state': 'SoS', 'lpa-committee': 'Committee', 'lpa-delegated': 'Delegated', court: 'Court' })[c.decision_maker] || c.decision_maker;
function table(g) {
  const rows = [...register[g].entries()].map(([id, ps]) => ({ c: caseById.get(id), ps })).sort((a, b) => (a.c.decision_date < b.c.decision_date ? 1 : -1));
  const counts = {};
  for (const { c } of rows) counts[c.outcome] = (counts[c.outcome] || 0) + 1;
  const tr = rows.map(({ c, ps }) => {
    const ref = c.decision_maker === 'inspector' ? (c.appeal_ref || '').replace(/^.*?(\d{7})$/, '$1') : (c.lpa_ref || c.case_id);
    const f = ps.map((p) => `<span class="f"><span class="code">${esc(p.policy)}</span> <span class="pill ${FIND[p.finding] || 'part'}">${esc(p.finding)}</span></span>`).join(' ');
    const notes = ps.map((p) => p.note).filter(Boolean).map((n) => esc(n)).join(' · ');
    return `<tr><td><a href="${DECISION_PAGES}${encodeURIComponent(c.case_id)}.html">${esc(placeOf(c))}</a><br><small>${esc(who(c))} ${esc(ref)}, ${esc(fmt(c.decision_date))}</small></td><td><span class="pill ${['allowed', 'approved'].includes(c.outcome) ? 'ok' : 'no'}">${esc(c.outcome)}</span></td><td>${f}</td><td class="n">${notes}</td></tr>`;
  }).join('\n');
  const summary = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v} ${k}`).join(', ');
  return `<h3 id="reg-${g.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">${esc(GROUPS[g].title)} <span class="count">${rows.length} decisions: ${esc(summary)}</span></h3>
<p class="note">${esc(GROUPS[g].blurb)}</p>
<div class="table-wrap"><table><thead><tr><th>Decision</th><th>Outcome</th><th>Finding</th><th>Note, as recorded in the case file</th></tr></thead><tbody>
${tr}
</tbody></table></div>`;
}
const all = [...caseById.values()];
const fw26 = all.filter((c) => c.nppf_applied === '2026-08');
const asAt = all.map((c) => c.decision_date).sort().slice(-1)[0];
const n = (g) => register[g].size;
const nOut = (g, outs) => [...register[g].keys()].filter((id) => outs.includes(caseById.get(id).outcome)).length;
const nFind = (g, finding, outs) => [...register[g].entries()].filter(([id, ps]) => ps.some((p) => p.finding === finding) && (!outs || outs.includes(caseById.get(id).outcome))).length;
const s4pass = nFind('S4', 'pass'); const s4passWon = nFind('S4', 'pass', ['allowed', 'approved']);
const s55pass = nFind('S5(5)', 'pass'); const s55passWon = nFind('S5(5)', 'pass', ['allowed', 'approved']);
const s54pass = nFind('S5(4)', 'pass'); const s54fail = nFind('S5(4)', 'fail');

// ---- The page ----
const short = `<section id="short"><h2>The short answer</h2>
<div class="rule">
<p><strong>"Substantially outweighed" is the 2026 Framework's presumption in favour of development.</strong> Inside a settlement (policy S4) and, outside one, for the ten listed categories of development (S5(1)), a proposal "should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies". It replaces the December 2024 "tilted balance", whose formula was "significantly and demonstrably outweigh". It applies to every proposal, not only when a plan is out of date, and it is measured against the Framework's own decision-making policies, not the local plan.</p>
<p>The same words carry a different burden in S5(4). Outside every S5 category, a proposal should be approved "only in exceptional circumstances, where the benefits of the proposal would substantially outweigh the adverse effects". The tilt reverses. And in the Green Belt, S5(5) restores the forward tilt for development that passes GB7, while inappropriate development goes to the <a href="${VSC}">very special circumstances</a> test instead.</p>
<p>What tips the forward balance is a list, not a mood: the "should be refused" policies named in S4(2) and S5(2), and the specific harms S4(2) lists. In the decisions so far, a proposal that passes the balance is almost always allowed (${s4passWon} of ${s4pass} S4 passes, ${s55passWon} of ${s55pass} S5(5) passes), and a proposal that fails it does so through one of those triggers.</p>
</div></section>`;

const uses = `<section id="uses"><h2>Where the words appear</h2>
<p>"Substantially outweigh" appears ${nUses} times in the National Planning Policy Framework (NPPF) of 17 August 2026, all but one in chapter 4, <a href="${GOVUK_CH4}">Achieving sustainable development</a>. The table lists each, the direction of the tilt, and what the policy does. Each code links to the text in our <a href="${NPPF_MD}">Markdown edition</a>.</p>
<div class="table-wrap"><table><thead><tr><th>Policy</th><th>Tilt</th><th>Text and role</th></tr></thead><tbody>
${USES.map((u) => `<tr><td><a href="${md(u.anchor)}"><span class="code">${esc(u.code)}</span></a><br><small>${esc(u.kind)}</small></td><td><span class="pill ${u.form === 'forward' ? 'ok' : u.form === 'reversed' ? 'no' : 'part'}">${esc(u.form)}</span></td><td><q>${esc(u.q + (u.q2 ? ' ' + u.q2 : ''))}</q>${esc(u.role)}</td></tr>`).join('\n')}
</tbody></table></div>
<p>Read the three forms apart.</p>
<ol>
<li><strong>Forward (S4(1), S5(1), S5(5)).</strong> Approve unless. The decision-maker must find adverse effects that substantially outweigh the benefits before refusing, and must find them "against the national decision-making policies in this Framework". A conflict with a local plan policy that has no national counterpart is not, on its own, an adverse effect for this purpose. At South Woodford an undersized bedroom breached a local standard, but: ${dl('PINS-6010195', 'Whilst I have found that the appeal scheme would not provide adequate internal space for the future occupiers of room 2, this in itself does not represent specific conflict against the national decision-making policies in the Framework.', 26)}</li>
<li><strong>Triggers (S4(2), S5(2), S6(1)).</strong> Not tests in themselves, but statements of when the forward balance is "likely" to be lost. They point at the ${refusedCodes.length} national decision-making policies that say "should be refused" (${refusedCodes.map((c) => `<span class="code">${esc(c)}</span>`).join(', ')}) and, under S4, at a short list of specific harms. The list is open: ${dl('PINS-6007054', 'The Framework sets out the circumstances in which the benefits of approving development are likely to be substantially outweighed by adverse effects, which include but are not restricted to the situations listed in Policy S4(2). Although none of the situations listed in the policy apply to the proposal, I am nonetheless required to consider whether the benefits of the proposal would be substantially outweighed by the harm I have identified to the significance of a heritage asset.', 22)}</li>
<li><strong>Reversed (S5(4)).</strong> Refuse unless. Outside every category the proposal must show exceptional circumstances and benefits that substantially outweigh the adverse effects, "including to the character of the countryside and in relation to promoting sustainable patterns of movement". The words sound like the Green Belt test, and are sometimes confused with it, but the bar is lower: "substantially" rather than "clearly", with no instruction to give the harm substantial weight.</li>
</ol>
</section>`;

const origin = `<section id="origin"><h2>Where it came from</h2>
<p>The December 2024 Framework had one presumption, in paragraph 11, and for decisions it switched on only where there were no relevant plan policies or the most important ones were out of date. Its formula was:</p>
${quote(NPPF_2024, 'any adverse impacts of doing so would significantly and demonstrably outweigh the benefits, when assessed against the policies in this Framework taken as a whole', 'NPPF, December 2024, ¶11(d)(ii)')}
<p>The December 2025 consultation draft replaced that with the S3 to S6 structure and the words "substantially outweighed", and the final text kept them. The government's response to the consultation records the objection and the answer:</p>
${quote(GOV_RESPONSE, 'respondents suggested that the need for adverse effects to substantially outweigh harm (as a basis for disapplying the ‘tilt’ in favour of development) would reduce the control local areas would have on the development that comes forward', 'MHCLG, NPPF consultation: government response, August 2026, response to Questions 36 to 38')}
${quote(GOV_RESPONSE, 'The new presumption in favour of sustainable development is framed in simpler terms than its predecessor, and in combination with policies S4 and S5 is designed to give more direction about the suitability of development in different types of location.', 'MHCLG, NPPF consultation: government response, August 2026, response to Questions 36 to 38')}
${check(DRAFT_2025, 'would be substantially outweighed by any adverse effects') ?? ''}
<p>The Planning Inspectorate's briefing to inspectors on the new Framework describes the change in one sentence:</p>
${quote(PINS_NOTE, 'It also revises the “presumption in favour of sustainable development” to be “a permanent presumption in favour of suitably located development” and applies for all proposals within and outside of settlements.', 'Planning Inspectorate, PINS Note 04/2026, ¶5')}
<p>Three things changed at once. The presumption is permanent: it no longer waits for a plan to be out of date or a five-year supply to fail. Its yardstick is the Framework's own decision-making policies, not "the policies in this Framework taken as a whole". And its scope depends on where the site is: everything inside a <a href="${SETTLEMENT}">settlement</a>, only the listed categories outside one. Housing need did not disappear; it moved. Planning Geek's explainer puts it this way: "A shortage of housing land and poor housing delivery can still be very powerful, but they now operate principally as evidence of unmet need within the new policy structure rather than switching on the old paragraph 11(d) balance."</p>
${check(PG_PRESUMPTION, 'A shortage of housing land and poor housing delivery can still be very powerful, but they now operate principally as evidence of unmet need within the new policy structure rather than switching on the old paragraph 11(d) balance.') ?? ''}
<p>Whether "substantially" sets a different bar from "significantly and demonstrably" is an open question. Urbanist Architecture's guide lists it as one of two unresolved points: "The second is whether “substantially outweigh” creates a different threshold from the NPPF 2024 wording, “significantly and demonstrably outweigh”." No court has construed the new words. The decisions below treat them as a high bar for refusal in the forward form and a high bar for approval in the reversed one, which is what the structure implies. Cornerstone Barristers' summary of the whole scheme: development in a category "is to be approved unless its benefits would be “substantially outweighed” by the adverse effects", and otherwise "a reverse presumption applies - development outside of settlements will not be permitted save in “exceptional circumstances”, where benefits of the proposal “substantially outweigh” the adverse effects (S5(4))". Zack Simons KC, on day one: "The flip-side: if you’re outside those particular categories, you get refused permission absent exceptional circumstances where your benefits substantially outweigh your adverse effects."</p>
${check(URBANIST, 'The second is whether “substantially outweigh” creates a different threshold from the NPPF 2024 wording, “significantly and demonstrably outweigh”.') ?? ''}${check(CORNERSTONE, 'is to be approved unless its benefits would be “substantially outweighed” by the adverse effects') ?? ''}${check(CORNERSTONE, 'a reverse presumption applies - development outside of settlements will not be permitted save in “exceptional circumstances”, where benefits of the proposal “substantially outweigh” the adverse effects (S5(4))') ?? ''}${check(PLANORAKS, 'The flip-side: if you’re outside those particular categories, you get refused permission absent exceptional circumstances where your benefits substantially outweigh your adverse effects.') ?? ''}
</section>`;

const practice = `<section id="practice"><h2>How the balance is run</h2>
<h3>Forward: approve unless</h3>
<p>The clean S4 case reads like Westwoodside, a house in a side garden inside a settlement boundary: ${dl('PINS-6008883', 'The only relevant circumstance in this case, would relate to Policy L2(1)(d)) regarding development within residential curtilages but the proposal satisfies the three requirements of part d. The benefits of approving this proposal would not therefore be substantially outweighed by adverse effects. It should therefore be approved.', 17)} Or Poole, with a supply of 2.1 years described as "an acute deficit": ${dl('PINS-6005913', 'Having examined the relevant decision-making policies in the framework outlined in Policy S4(2), I find that the proposal would accord with these requirements. Therefore, the benefits of approving the proposal would not be substantially outweighed by any adverse effects.', 27)} At Knowle the inspector allowed a garden plot with the balance stated as a pair of findings: ${dl('PINS-6011148', 'There are substantial benefits of the proposal, and I have not concluded that there would be any substantial adverse effects when assessed against the national decision-making policies in the Framework.', 24)}</p>
<p>Where the forward balance is lost, it is nearly always through a trigger. Design is the commonest: policy DP3(3) says a proposal that conflicts with DP3(1) "without clear justification" should be refused, and that failure is an S4(2)(c) or S5(2) trigger (see <a href="${DP3}">the DP3 page</a>). At Newquay, after finding a DP3 conflict "with no clear overriding justification": ${dl('PINS-6010836', 'Moreover, in view of the particular substantial adverse effects identified, I find in this instance the benefits of the proposal would be substantially outweighed by the adverse effects, when assessed against the national decision-making policies in the Framework.', 35)} At Ware, substantial housing weight at 3.55 years was not enough: ${dl('PINS-6008167', 'Consequently, I am satisfied when having regard to paragraph 2.c. of Policy S4 of the Framework that the benefits of the scheme would be substantially outweighed by the adverse effects.', 21)} Heritage harm under HE6, highway safety under TR6(4), the loss of open space under HC7 and flood risk under F5 to F7 are the other frequent triggers in the register.</p>
<h3>Reversed: refuse unless</h3>
<p>S5(4) has been passed ${s54pass} times and failed ${s54fail} times in the database. Morchard Bishop is the template for a failure: ${dl('PINS-6012985', 'Part 4 of S5 says that proposals that do not fall into such categories should only be approved in exceptional circumstances. The benefits of a proposal must substantially outweigh the adverse effects including promoting sustainable patterns of movement. I attach substantial weight to the harm identified in respect of patterns of movement.', 18)} Substantial weight to the homes under HO7 (¶19) did not get there: ${dl('PINS-6012985', 'When assessed against the policies in the Framework, taken as a whole, the benefits of the proposal do not substantially outweigh the adverse effects. Therefore, this conflict means that permission in principle should not be granted.', 22)} Aston Clinton, after a hearing, is the leading pass: 66 homes with 25% affordable in a district with a substantial shortfall, on a site covered by an emerging allocation. ${dl('PINS-6008253', 'In my view therefore taken together the substantial benefits of the proposal would substantially outweigh the moderate weight I have applied to the adverse effects to the character of the countryside.', 85)} Cople is the small-scheme pass: ${dl('PINS-6011253', 'Overall, when assessed against the national decision-making policies in the Framework, the benefits of the proposal would substantially outweigh the adverse effects.', 27)}</p>
<h3>Green Belt: S5(5)</h3>
<p>A proposal that passes GB7 is not inappropriate, and S5(5) gives it the forward tilt with the S5(2) trigger. Burnham, a self-build house on grey belt: ${dl('PINS-6005162', 'I have found that the proposal would not be inappropriate development in the GB having been assessed against Policies GB6 and GB7 of the Framework. As the proposal would comply with Policies N6, HE5 and HE6 of the Framework, applying paragraph 2 of Policy S5, I find that the presumption in favour of sustainable development would not be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in the Framework.', 45)} It is not an automatic approval: at Fobbing five houses behind the frontage passed GB7 and still lost on character under DP3(1): ${dl('PINS-6008679', 'Drawing the above matters together, I have identified unacceptable harm to the character of the area contrary to the development plan and Policy DP3(1) of the Framework. I conclude that the benefits of the appeal proposal would be substantially outweighed by this harm.', 46)}</p>
<p>A proposal that fails GB7 never reaches S5(5). The two tests can sit in one paragraph, as at Kingsley, where a new-build dwelling fell outside every S5 category and was also inappropriate in the Green Belt: ${dl('PINS-6005495', 'When assessed against the national decision-making policies in the Framework, the benefits of the proposal would clearly be substantially outweighed by the adverse effects I have identified. The other considerations also do not clearly outweigh the Green Belt harm and the other harms I have identified.', 37)} The <a href="${VSC}">very special circumstances page</a> follows that road.</p>
<h3>S6: the neighbourhood plan shield</h3>
<p>S6 makes a housing scheme's conflict with a neighbourhood plan "likely" to lose the balance, but only if the plan was made within five years and contains allocations to meet its requirement. Both limbs are checked. At Menheniot the plan was made in April 2022 with allocations not yet built: ${dl('PINS-6007431', 'Consequently, there is no reason for me to conclude that the Neighbourhood Plan does not continue to make provision for the local housing requirement that was identified at the time it was made, less than five years ago. I therefore give substantial weight to the conflict with Policy 1 of the Neighbourhood Plan.', 23)} At Henfield the plan was five years and two months old on the decision date: ${dl('PINS-6007104', 'Since the HNP became part of the development plan more than five years from the date of my decision, the test at Framework policy S6(a) is not met.', 29)} Most of the register's S6 rows record a plan that was too old or had no allocations, so the shield did not apply.</p>
</section>`;

const traps = `<section id="traps"><h2>Drafting traps</h2>
<ul>
<li><strong>The 2024 formula survives in 2026 letters.</strong> ${oldWording.length} letters in the corpus conclude in "significantly and demonstrably" while citing S3 to S5 or GB7: ${oldWording.map((r) => (byRef.has(r) ? `<a href="${DECISION_PAGES}${encodeURIComponent(byRef.get(r).case_id)}.html">${r}</a>` : `<a href="${PINS_APPEALS}${r}">${r}</a>`)).join(', ')}. Newtown, South Staffordshire, does both in consecutive paragraphs: ${dl('PINS-6010537', 'Consequently, the harm from the conflict with the development plan would not significantly and demonstrably outweigh the benefits that would arise from the development, when assessed against the policies in the Framework as a whole.', 47)} ${dl('PINS-6010537', 'For these reasons, the development would comply with Policy S5:5 of the Framework which advises that, where development would not be inappropriate in Green Belt locations, proposals should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects, when assessed against the national decision-making policies in the Framework.', 48)} South Godstone applies S5(5) and then states the old test and the old consequence: ${dl('PINS-6004344', 'Weighing things up the adverse effects of granting permission would significantly and demonstrably outweigh the benefits, when assessed against the decision-making policies in the Framework taken as a whole (in accordance with Policy S5). For these reasons, the presumption in favour of sustainable development is not a material consideration in this case.', 31)} Under the 2026 text the presumption is permanent; it is applied and lost, not switched off.</li>
<li><strong>S4 run for a Green Belt village.</strong> A village washed over by the Green Belt is not a settlement under Annex B, so S4 is not engaged; see the <a href="${SETTLEMENT}">settlement page</a>. Fobbing applies the exclusion; Bledlow Ridge ran S4 for a Green Belt site inside a village boundary and left the Green Belt question undecided.</li>
<li><strong>The S5(5) balance stated the wrong way round.</strong> A Stratford-on-Avon refusal at Malthouse Lane, Earlswood, set out S5(5) correctly and then concluded that the benefits would not be substantially outweighed, while refusing. The register notes it.</li>
<li><strong>S5(2) used to skip S5(4), and S5 applied in the Green Belt.</strong> At Hesketh Bank a trigger under S5(2) was used to avoid the reversed test; at East Horsley S5(4) was cited as "Part 4 of Policy S3" and run on a Green Belt site without S5(5). Neither should be cited as authority.</li>
</ul>
</section>`;

const registerHtml = `<section id="register"><h2>The decisions</h2>
<p>The register lists every decision in our database (${num(all.length)} decisions, ${num(fw26.length)} under the August 2026 Framework) with a recorded finding under S4, S5 or S6: ${num(casesInRegister.size)} decisions and ${num(findings)} findings. The finding and note for each are as recorded in the case file, which was written from the decision letter or officer report; the note gives the letter paragraphs. Separately, ${num(usingPhrase.length)} of the ${num(refs.length)} decision letters in our corpus use the words "substantially outweigh"; of those with a clear result, ${num(phraseOutcomes.allowed)} were allowed and ${num(phraseOutcomes.dismissed)} dismissed. ${num(undistilled.length)} of them have not yet been distilled into the database, and ${num(unclassified.length)} are in the database without an S4, S5 or S6 finding because the decision turned on another policy. Dataset as at ${fmtLong(asAt)}.</p>
<div class="stats">
${['S4', 'S5(1)', 'S5(4)', 'S5(5)', 'S6'].map((g) => `<div class="stat"><div class="n">${n(g)}</div><div class="l">${esc(g)}: ${nOut(g, ['allowed', 'approved'])} allowed or approved, ${nOut(g, ['dismissed', 'refused'])} dismissed or refused</div></div>`).join('\n')}
</div>
${['S4', 'S5(1)', 'S5(2)', 'S5(4)', 'S5(5)', 'S5', 'S6'].map(table).join('\n')}
</section>`;

const extraCss = `<style>.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}.stat{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:14px 16px}.stat .n{font:600 30px/1 var(--serif);color:var(--accent);font-variant-numeric:tabular-nums}.stat .l{font-size:13.5px;margin-top:6px}
section>ol,section>ul{margin:0;padding-left:20px;display:grid;gap:8px;max-width:72ch}section>ol>li,section>ul>li{font-size:15.5px}section>ol blockquote,section>ul blockquote{margin-top:6px;margin-bottom:6px}h3{font:600 17px/1.35 var(--sans);margin-top:8px}h3 .count{font-weight:400;color:var(--muted);font-size:14px}
.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}table{border-collapse:collapse;width:100%;font-size:14px;min-width:640px}th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--line)}th{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}td q{display:block;color:var(--muted);font:400 13px/1.45 var(--serif);margin-bottom:4px}td small{color:var(--muted)}td.n{font-size:13px;color:var(--muted);max-width:40ch}
.f{display:inline-block;white-space:nowrap;margin:0 6px 4px 0}</style>`;

const SOURCES = [
  `National Planning Policy Framework, August 2026: <a href="${GOVUK_NPPF}">GOV.UK</a>; <a href="${GOVUK_CH4}">chapter 4, Achieving sustainable development</a>; our <a href="${NPPF_MD}">Markdown edition</a>. Policies S1, S3 to S6, and the "should be refused" policies ${refusedCodes.join(', ')}.`,
  'National Planning Policy Framework, December 2024, ¶11 and ¶14 (UK Government Web Archive copy: <a href="https://webarchive.nationalarchives.gov.uk/ukgwa/20250225172715id_/https://assets.publishing.service.gov.uk/media/67aafe8f3b41f783cca46251/NPPF_December_2024.pdf">PDF</a>).',
  'MHCLG, <a href="https://assets.publishing.service.gov.uk/media/697b71c52ff8d10a830d5d4a/Draft_NPPF_December_2025.pdf">National Planning Policy Framework: draft text for consultation</a>, December 2025, policies S4 and S5.',
  'MHCLG, <a href="https://assets.publishing.service.gov.uk/media/6a82fcec3bd75b81e2329a89/National_Planning_Policy_Framework_consultation_-_government_response.pdf">Proposed reforms to the National Planning Policy Framework: government response</a>, August 2026, Questions 36 to 38.',
  'Planning Inspectorate, PINS Note 04/2026, NPPF 2026, ¶5.',
  'Cornerstone Barristers, <a href="https://cornerstonebarristers.com/wp-content/uploads/2026/08/The-revised-NPPF-navigating-the-new-rules-based-planning-system.pdf">The revised NPPF: navigating the new "rules-based planning system"</a>, 19 August 2026.',
  'Zack Simons KC, <a href="https://www.planoraks.com/posts-1/nppf2026-welcome-to-the-future">#NPPF2026: Welcome to the Future!</a>, #planoraks, 18 August 2026.',
  'Urbanist Architecture, <a href="https://urbanistarchitecture.co.uk/nppf-2026/">NPPF 2026: What England\'s New Planning Rules Mean in Practice</a>, 18 August 2026.',
  'Thrings, <a href="https://www.thrings.com/blog/nppf-2026-sme-developers">NPPF 2026: What it means for SME developers</a>, 20 August 2026 ("a default yes for your proposed project" inside settlements).',
  'Planning Geek, <a href="https://www.planninggeek.co.uk/policy/presumption-in-favour-of-sustainable-development/">Presumption in favour of sustainable development</a>, 17 September 2026.',
  `Decision letters: the Planning Inspectorate <a href="https://appeal-planning-decision.service.gov.uk/">appeals service</a>; every letter quoted is held in the research repository under <code>data/open-sources/pins-corpus/</code>. Council reports are linked from each decision's page.`,
  `The <a href="${DECISION_PAGES}">decisions database</a> and the analysis note <code>data/decisions/analysis/principle-and-balance.md</code> in the research repository.`,
  `Companion pages: <a href="${VSC}">"Very special circumstances" under the 2026 NPPF</a>, on the Green Belt test; <a href="${SETTLEMENT}">What is a settlement</a>, on the S4 and S5 fork; <a href="${DP3}">DP3</a>, on the commonest trigger; and <a href="${SUSTAINABLE}">how a sustainable location is assessed</a>. The <a href="${ROUTE}#the-balance-substantially-outweighed-balanceplain-judgement">Navigator's balance step</a> runs the test interactively.`,
];
check(THRINGS, 'a default yes for your proposed project');

const html = page({
  title: 'Substantially Outweighed',
  description: `What "substantially outweighed" means in the August 2026 NPPF: the ${nUses} places the words appear, the forward tilt in S4, S5(1) and S5(5), the reversed test in S5(4), the "should be refused" triggers, what replaced the 2024 tilted balance, the drafting traps, and a register of ${num(casesInRegister.size)} decisions with a finding under S4, S5 or S6.`,
  url: URL,
  breadcrumb: '<a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/england/">England</a> › Substantially outweighed',
  h1: '"Substantially outweighed": the presumption under the 2026 NPPF',
  dek: `Where the words appear, which way the tilt runs in each, what replaced "significantly and demonstrably", how the balance is lost, and every decision so far with a finding under S4, S5 or S6.`,
  body: extraCss + short + uses + origin + practice + traps + registerHtml,
  sources: SOURCES,
  credit: `Prepared by Planning Distilled. External sources were retrieved on ${RETRIEVED}.`,
});

const out = path.join(SITE, SITE_PATH);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`wrote ${path.join(out, 'index.html')}: ${casesInRegister.size} decisions, ${findings} findings in the register; ${usingPhrase.length} letters use the phrase (${phraseOutcomes.allowed} allowed, ${phraseOutcomes.dismissed} dismissed); ${oldWording.length} letters in the 2024 wording; ${refusedCodes.length} "should be refused" policies`);
