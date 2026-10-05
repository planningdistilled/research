// DP3 (design) under the August 2026 NPPF: what it says, how it enters decisions, and what the decisions show.
//   node pages/england/dp3-design/build.mjs   (writes into main-site)
import fs from 'node:fs';
import path from 'node:path';
import { SITE } from '../../../paths.mjs';
import { appealLink, caseById, caseLink, check, esc, page, quote } from '../../_shared/policy-weight.mjs';

const SITE_PATH = 'research/england/dp3-design/';
const URL = 'https://planningdistilled.org/' + SITE_PATH;
const NPPF = (code) => `NPPF, ${code}`;
const AP = (id, para) => `${appealLink(id)}, ¶${para}`;
const pins = (id) => 'pins:' + caseById.get(id).appeal_ref;

// ---- The figures, from the decisions database ----
const all = [...caseById.values()];
const fw26 = all.filter((c) => c.nppf_applied === '2026-08');
const dp = (c) => (c.policy_findings || []).filter((f) => /^DP3/.test(f.policy));
const lost = (c) => ['dismissed', 'refused'].includes(c.outcome);
const addressed = fw26.filter((c) => dp(c).length);
const dp33 = addressed.filter((c) => dp(c).some((f) => f.policy.startsWith('DP3(3)')));
const failed = addressed.filter((c) => dp(c).some((f) => f.finding === 'fail'));
const weighedOnly = addressed.filter((c) => !dp(c).some((f) => f.finding === 'fail') && dp(c).some((f) => ['harm', 'conflict'].includes(f.finding)));
const noConflict = addressed.filter((c) => dp(c).every((f) => ['pass', 'accord', 'neutral', 'benefit', 'not-engaged'].includes(f.finding)));
const JUSTIFIED = ['PINS-6008253', 'PINS-6008314', 'PINS-6009340'];
for (const id of JUSTIFIED) {
  if (!dp(caseById.get(id)).length) throw new Error('no DP3 finding recorded for ' + id);
  if (lost(caseById.get(id))) throw new Error(id + ' was not allowed: update "all three allowed"');
}
if (failed.some((c) => !lost(c))) throw new Error('a DP3 failure was allowed: update the wording "every one"');
const split = (arr) => ({ lost: arr.filter(lost).length, won: arr.filter((c) => !lost(c)).length });
const byMaker = (arr) => ({ appeals: arr.filter((c) => c.decision_maker === 'inspector' || c.decision_maker === 'secretary-of-state').length });
const newest = all.map((c) => c.decision_date || '').sort().at(-1);
const fmt = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const link = (c) => (c.case_id.startsWith('PINS-') ? appealLink(c.case_id) : caseLink(c.case_id));
const sorted = (arr) => [...arr].sort((a, b) => (b.decision_date || '').localeCompare(a.decision_date || ''));
const details = (label, arr) => `<details><summary>${esc(label)} (${arr.length})</summary><ul class="cases">${sorted(arr).map((c) => `<li>${link(c)} <span class="out ${lost(c) ? 'no' : 'ok'}">${esc(c.outcome)}</span></li>`).join('')}</ul></details>`;

const stat = (n, label, sub) => `<div class="stat"><p class="n">${n}</p><p class="l">${label}</p>${sub ? `<p class="s">${sub}</p>` : ''}</div>`;

// ---- Sections ----
const says = `<section id="text"><h2>What DP3 says</h2>
${quote('nppf', 'Development proposals should respond to their context (the history, character and features of their site and its setting), so that they integrate with and enhance their surroundings', NPPF('DP3(1)'))}
<p>DP3(2) adds seven principles to reflect "as appropriate": liveability, climate, nature (including "maintaining and enhancing tree cover"), movement, built form, public space and identity. Then the operative paragraph:</p>
${quote('nppf', 'Development proposals should be refused if, without clear justification, they conflict with paragraph 1 of this policy or relevant aspects of the principles in paragraph 2, or with any explicit design standards set out in the development plan (including those in locally-specific policies, guides, codes or masterplans). Substantial weight should be given to compliance with relevant development plan policies when assessing the design quality of proposals.', NPPF('DP3(3)'))}
<p>So DP3(3) can be failed in three ways: a conflict with context (DP3(1)), a conflict with a relevant principle (DP3(2)), or a conflict with an explicit design standard in the development plan, such as a design code, village design statement or space standard. In each case the question is whether there is "clear justification".</p>
</section>`;
check('nppf', 'maintaining and enhancing tree cover');

const enters = `<section id="routes"><h2>How DP3 enters the decision</h2>
<p>DP3 applies to all development, wherever it is. What changes is the balance a design conflict feeds into. Inside settlements and outside them, a failed "should be refused" policy makes refusal the expected outcome:</p>
${quote('nppf', 'Fail to comply with one of the national decision-making policies which state that development proposals should be refused in specific circumstances.', NPPF('S4(2)(c), for development within settlements'))}
${quote('nppf', 'In applying this policy, the circumstances in which the benefits of approving development proposals are likely to be substantially outweighed by adverse effects include, but are not restricted to, situations where the development proposal would fail to comply with one of the national decision-making policies which state that development proposals should be refused in specific circumstances.', NPPF('S5(2), for development outside settlements, and through S5(5) for Green Belt development found not inappropriate'))}
<div class="table-wrap"><table><thead><tr><th>Where</th><th>The balance</th><th>What failing DP3(3) does</th></tr></thead><tbody>
<tr><td>Within a settlement</td><td>Approve unless benefits substantially outweighed (S4)</td><td>Benefits likely substantially outweighed (S4(2)(c))</td></tr>
<tr><td>Outside settlements</td><td>Approve S5(1) categories unless substantially outweighed</td><td>Benefits likely substantially outweighed (S5(2))</td></tr>
<tr><td>Green Belt, not inappropriate</td><td>Approve unless substantially outweighed (S5(5))</td><td>The same, "applying paragraph 2" (S5(2))</td></tr>
<tr><td>Green Belt, inappropriate</td><td>Very special circumstances must clearly outweigh the harm (GB6(2))</td><td>Adds to "any other harm", and is a reason for refusal in its own right</td></tr>
</tbody></table></div>
<p>In the approve-unless balances, DP3(3) turns the starting point round: design harm stops being one adverse effect weighed against the benefits and becomes a likely reason for refusal.</p>
</section>`;
check('nppf', 'applying paragraph 2 of this policy');

const fig = `<section id="figures"><h2>What the decisions show</h2>
<p>From the ${fw26.length.toLocaleString('en-GB')} decisions in the <a href="/research/england/nppf-navigator/decisions/">decisions database</a> made under the August 2026 Framework, to ${esc(fmt(newest))}.</p>
<div class="stats">
${stat(addressed.length, 'decisions addressed DP3', `${byMaker(addressed).appeals} appeals, ${addressed.length - byMaker(addressed).appeals} council decisions`)}
${stat(dp33.length, 'applied DP3(3) by name', '')}
${stat(failed.length, 'found DP3 failed', `every one refused or dismissed`)}
${stat(JUSTIFIED.length, 'found "clear justification"', 'all three allowed')}
</div>
${details('Decisions that found DP3 failed', failed)}
${details('Decisions that found a design conflict but weighed it as harm, without treating DP3(3) as failed', weighedOnly)}
${details('Decisions that found no conflict with DP3', noConflict)}
<p>Where DP3 was failed, the scheme was refused or dismissed every time. Where the decision-maker found a design conflict but only weighed it as harm, ${split(weighedOnly).won} of ${weighedOnly.length} schemes were still allowed or approved. Where there was no conflict, ${split(noConflict).won} of ${noConflict.length} were allowed or approved.</p>
</section>`;

const readings = `<section id="justification"><h2>"Clear justification": two readings</h2>
<p>The Framework does not define the phrase. Inspectors have read it in two ways.</p>
<h3>Is the harm necessary?</h3>
${quote(pins('PINS-6007133'), 'I do not find the specific and significant harm to the character and appearance of the countryside to be necessary to achieve the substantial public benefits', AP('PINS-6007133', 59))}
${quote(pins('PINS-6008314'), 'while the loss of trees and vegetation at the site is certainly regrettable, I am satisfied that it would be necessary as part of the appeal development such that there would be clear justification for the conflict with Framework Policy DP3', AP('PINS-6008314', 43))}
<h3>Do the benefits outweigh it?</h3>
${quote(pins('PINS-6009340'), 'the substantial weight I ascribe to the benefits of the scheme, in respect of de-carbonisation and energy security, would outweigh the minor and localised harm I have identified in respect of the character and appearance of the area. There would, therefore, be clear justification for the harm that would arise', AP('PINS-6009340', 22))}
${quote(pins('PINS-6008167'), 'I conclude that the benefits of the scheme would not outweigh the harm that would be caused to the character and appearance of the area, in particular because there is no clear justification for the conflict with paragraph 1 of Policy DP3.', AP('PINS-6008167', 21))}
<p>Under the first reading, benefits that could be had without the harm are not a justification. Under the second, the phrase works much like an ordinary balance. A decision should say which reading it applies.</p>
</section>`;

const passed = `<section id="passed"><h2>The three decisions that found clear justification</h2>
<div class="policies">
<article class="policy"><h3>${appealLink('PINS-6008253')}: 66 homes, allowed</h3>
${quote(pins('PINS-6008253'), 'Equally, I consider that the substantial benefits are sufficient to provide clear justification for the conflict with Policy DP3 of the Framework, which would only cause limited harm.', AP('PINS-6008253', 86))}
<p>Substantial benefits against harm the inspector called limited.</p></article>
<article class="policy"><h3>${appealLink('PINS-6008314')}: foodstore and care home, allowed</h3>
<p>The loss of trees and vegetation was accepted because it was necessary for the development (¶43, quoted above).</p></article>
<article class="policy"><h3>${appealLink('PINS-6009340')}: battery storage on a highway verge, allowed</h3>
<p>Substantial energy-security benefits (Framework W3) against "minor and localised harm" (¶22, quoted above).</p></article>
</div>
<p>In each, the harm was limited or minor and the benefits substantial, or the harm was unavoidable.</p>
</section>`;

const notEnough = `<section id="not-enough"><h2>Benefits that were not clear justification</h2>
<div class="policies">
<article class="policy"><h3>${appealLink('PINS-6005590')}: two flats, dismissed</h3>
${quote(pins('PINS-6005590'), 'Notwithstanding that I attach substantial weight to housing delivery and significant weight to the affordable housing contribution, collectively these benefits do not amount to the clear justification required by Policy DP3(3) to depart from explicit accessibility standards in the development plan.', AP('PINS-6005590', 46))}</article>
<article class="policy"><h3>${appealLink('PINS-6011062')}: retirement village, dismissed</h3>
${quote(pins('PINS-6011062'), 'While the benefits I outline above are significant, they do not in my view, provide clear justification to allow development that would harm the living conditions of the existing residents in the manner I have described.', AP('PINS-6011062', 44))}</article>
<article class="policy"><h3>${appealLink('PINS-6007927')}: rear extension, dismissed</h3>
${quote(pins('PINS-6007927'), 'they would represent a very limited increase on such benefits which could be achieved without causing harm', AP('PINS-6007927', 16))}</article>
<article class="policy"><h3>${appealLink('PINS-6010354')}: dwelling against a barn-conversion fallback, dismissed</h3>
<p>Avoiding the fallback was not a justification, because the fallback</p>
${quote(pins('PINS-6010354'), 'would be the less harmful scheme in terms of the requirements of Framework Policy DP3. As such, the policy gives a clear directive to dismiss the appeal.', AP('PINS-6010354', 32))}</article>
<article class="policy"><h3>${appealLink('PINS-6004873')}: shopfront, dismissed</h3>
${quote(pins('PINS-6004873'), 'those benefits would be modest and they do not, in my judgement, amount to clear justification for the development’s harm to the character and appearance of the host building and area', AP('PINS-6004873', 27))}</article>
</div></section>`;

const ways = `<section id="ways"><h2>The three ways DP3(3) is failed</h2>
<div class="policies">
<article class="policy"><h3>Context: DP3(1)</h3>
${quote(pins('PINS-6007677'), 'the proposal results in significant harm to the character and appearance of the area and would not respond to its context and would not integrate with or enhance the surroundings, thereby conflicting with paragraph 1 of Policy DP3.', AP('PINS-6007677', 27))}
<p>The same decision found a conflict with DP3(2)(d), because "walking, wheeling, cycling and public transport is not prioritised through the introduction of a car dependent development".</p></article>
<article class="policy"><h3>Principles: DP3(2), including tree cover</h3>
${quote(pins('PINS-6005325'), 'The evidence before me does not clearly justify departing from those key principles and, in those circumstances, Policy DP3 paragraph 3 states that development proposals should be refused.', AP('PINS-6005325', 30))}
<p>The principle breached there was "maintaining and enhancing tree cover", through the loss of one prominent tree (¶23).</p></article>
<article class="policy"><h3>Explicit design standards in the development plan</h3>
${quote(pins('PINS-6005590'), 'Accordingly, there is a clear conflict with the explicit design standards referred to in Policy DP3(3) of the Framework.', AP('PINS-6005590', 45))}
<p>Standards applied this way include London Plan accessibility policies (above) and the nationally described space standard adopted in a local plan (${appealLink('PINS-6009127')}).</p></article>
</div></section>`;
check(pins('PINS-6007677'), 'walking, wheeling, cycling and public transport is not prioritised through the introduction of a car dependent development');
check(pins('PINS-6005325'), 'maintaining and enhancing tree cover');

const weighed = `<section id="weighed"><h2>When design conflict is only weighed</h2>
<p>Some decisions find a design conflict but never ask whether it is clearly justified, and weigh it as one harm among others. Councils do this too. At Snitterfield, Stratford-on-Avon District Council found significant harm to character and wrote:</p>
${quote('case:stratford-26-00617-PIP', 'In light of NDMP DP3 (3), I afford this harm substantial weight.', `${caseLink('stratford-26-00617-PIP')}, officer report p.15`, 15)}
<p>The scheme was approved. DP3(3) goes further than weight: it says the proposal "should be refused" unless there is clear justification, which then engages S4(2)(c) or S5(2). A decision that weighs the conflict without asking that question has not applied the policy as written.</p>
</section>`;

const html = page({
  title: 'DP3 Design Policy Decisions',
  description: `How DP3, the August 2026 NPPF's design policy, is applied: what "should be refused if, without clear justification" means, how it enters the S4, S5 and Green Belt balances, and what ${addressed.length} decisions show: ${failed.length} found DP3 failed and every one was refused or dismissed; only ${JUSTIFIED.length} found clear justification.`,
  url: URL,
  breadcrumb: '<a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/england/">England</a> › DP3 design policy',
  h1: 'DP3: the design policy that says "should be refused"',
  dek: `The August 2026 Framework's design policy, how it enters each kind of decision, and what ${addressed.length} decisions made under it show.`,
  body: says + enters + fig + readings + passed + notEnough + ways + weighed,
  sources: [
    'National Planning Policy Framework, August 2026: DP3, S4(2)(c), S5(2), S5(5), GB6(2).',
    'Planning Inspectorate appeal decision letters, each linked above; the text of every letter is in the research repository.',
    `The <a href="/research/england/nppf-navigator/decisions/">decisions database</a> (figures recalculated at each build) and the <a href="/research/england/nppf-navigator/">NPPF 2026 Navigator</a>.`,
  ],
  credit: 'Prepared by Planning Distilled.',
});
const extraCss = `<style>.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}.stat{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:14px 16px}.stat .n{font:600 34px/1 var(--serif);color:var(--accent);font-variant-numeric:tabular-nums}.stat .l{font-weight:600;margin-top:4px}.stat .s{font-size:13px;color:var(--muted)}
details{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:10px 14px}summary{cursor:pointer;font-weight:600;color:var(--accent)}ul.cases{margin:10px 0 0;padding-left:18px;columns:2 280px;column-gap:24px;font-size:14px}ul.cases li{break-inside:avoid;margin-bottom:3px}
.out{font-size:11.5px;font-weight:600;border-radius:3px;padding:0 5px;text-transform:lowercase}.out.ok{background:var(--ok-soft);color:var(--ok)}.out.no{background:var(--no-soft);color:var(--no)}
.table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:8px;background:var(--surface)}table{border-collapse:collapse;width:100%;font-size:14.5px}th,td{text-align:left;vertical-align:top;padding:9px 12px;border-top:1px solid var(--line)}thead th{border-top:0;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);background:var(--surface-2)}
h3{font:600 17px/1.35 var(--sans)}</style>`;
const out = path.join(SITE, SITE_PATH);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html.replace('</head>', extraCss + '\n</head>'));
console.log(`✓ ${SITE_PATH}: addressed ${addressed.length}, DP3(3) ${dp33.length}, failed ${failed.length} (${JSON.stringify(split(failed))}), weighed only ${weighedOnly.length} (${JSON.stringify(split(weighedOnly))}), no conflict ${noConflict.length} (${JSON.stringify(split(noConflict))})`);
