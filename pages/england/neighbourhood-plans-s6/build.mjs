// S6 of the August 2026 NPPF: the one job it does for neighbourhood plans, the two conditions it turns on, what a
// plan keeps when S6 does not apply (Annex A(2) and footnote 67), how inspectors have applied it, and how
// Stratford-on-Avon District Council's officer reports have applied it.
//   node pages/england/neighbourhood-plans-s6/build.mjs   (writes into main-site; needs ../sources)
// Every count on the page is computed from data/decisions/analysis/stratford-officer-reports-ndp-s6.tsv, the
// 59-row four-errors table and the decisions database. Every quotation is checked against its source text at
// build time: report quotations against the page given, letter quotations against the paragraph given. The
// build fails on a mismatch or when a counted claim stops holding.
import fs from 'node:fs';
import path from 'node:path';
import { DECISIONS, OPEN, SITE, SOURCES } from '../../../paths.mjs';
import { appealLink, caseById, check, esc, page, quote } from '../../_shared/policy-weight.mjs';
import { paragraphOf } from '../../_shared/letters.mjs';

const SITE_PATH = 'research/england/neighbourhood-plans-s6/';
const URL = 'https://planningdistilled.org/' + SITE_PATH;
const DECISION_PAGES = '/research/england/nppf-navigator/decisions/';
const OUTWEIGHED = '/research/england/substantially-outweighed/';
const TILTED = '/research/england/tilted-balance/';
const CORE = '/research/authority/stratford-dc/core-strategy-weight/';
const CLAVERDON_NP = '/research/settlement/claverdon/neighbourhood-plan-weight/';
const COMPARED = '/research/authority/officer-reports-compared/';
const STRATFORD = '/research/authority/stratford-dc/nppf-2026-decisions/';
const NPPF_MD = 'https://github.com/planningdistilled/research/blob/main/data/open-sources/nppf/NPPF-August-2026.md';
const GITHUB = 'https://github.com/planningdistilled/research/blob/main/data/decisions/analysis/';
const GOVUK_NPPF = 'https://www.gov.uk/guidance/national-planning-policy-framework';
const NPPF_2024 = 'open:nppf/NPPF-December-2024.txt';
const IPPS_NOV = 'sources:stratford-dc/cabinet-2026-11-02/appendix1-revised-ipps.txt';
const IPPS_JUNE = 'sources:stratford-dc/swlp-evidence/SDC-Interim-Policy-Position-Statement-2026-06-01.txt';

const md = (anchor) => `${NPPF_MD}#${anchor}`;
const nppf = (text, code, anchor) => quote('nppf', text, `NPPF, August 2026, <a href="${md(anchor)}">${esc(code)}</a>`);
const expect = (ok, msg) => { if (!ok) throw new Error('the page says: ' + msg); };

// ---- Tables ----
function tsv(file) {
  const raw = fs.readFileSync(path.join(DECISIONS, 'analysis', file), 'utf8').replace(/\r/g, '');
  const rows = [];
  let row = [], field = '', q = false, i = 0;
  while (i < raw.length) {
    const ch = raw[i];
    if (q) {
      if (ch === '"' && raw[i + 1] === '"') { field += '"'; i += 2; continue; }
      if (ch === '"') { q = false; i++; continue; }
      field += ch; i++; continue;
    }
    if (ch === '"' && field === '') { q = true; i++; continue; }
    if (ch === '\t') { row.push(field); field = ''; i++; continue; }
    if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
    field += ch; i++;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.length > 1 || r[0] !== '');
  return body.map((r) => Object.fromEntries(head.map((h, k) => [h, (r[k] ?? '').trim()])));
}
const FOUR = tsv('stratford-officer-reports-four-errors.tsv');
const S6 = tsv('stratford-officer-reports-ndp-s6.tsv');
expect(FOUR.length === 59, `59 Stratford reports were scored (table has ${FOUR.length})`);
const fourByRef = new Map(FOUR.map((r) => [r.ref, r]));
for (const r of S6) if (!fourByRef.has(r.ref)) throw new Error(`${r.ref} is in the S6 table but not in the four-errors table`);
const seen = new Set();
for (const r of S6) { if (seen.has(r.ref)) throw new Error('duplicate row ' + r.ref); seen.add(r.ref); }

// ---- Report texts: the sweep folder first, then the public-note folder ----
function reportRef(ref) {
  const dir = path.join(SOURCES, 'council', 'sweep', 'stratford', ref);
  if (fs.existsSync(dir)) {
    const fs1 = fs.readdirSync(dir).filter((f) => /^report-.*\.txt$/.test(f) && !/Update|Results|Addendum|S106|Notice/i.test(f)).sort();
    if (fs1.length) return `sources:council/sweep/stratford/${ref}/${fs1[0]}`;
  }
  const pn = path.join(SOURCES, 'stratford-dc', 'public-note');
  const fs2 = fs.readdirSync(pn).filter((f) => f.startsWith(`stratford-${ref}-report`) && f.endsWith('.txt')).sort();
  if (fs2.length) return `sources:stratford-dc/public-note/${fs2.at(-1)}`;
  throw new Error('no report text for ' + ref);
}
const rawText = (src) => fs.readFileSync(path.join(SOURCES, src.slice('sources:'.length)), 'utf8');
const NDP_RE = /neighbourhood (?:development )?plan|\bNDPs?\b/i;
const S6_RE = /\bS\s?6\b|\bDS6\b/;
const texts = new Map(FOUR.map((r) => [r.ref, reportRef(r.ref)]));
const mentions = FOUR.filter((r) => NDP_RE.test(rawText(texts.get(r.ref))));
// Every report that names S6 must have a row; every row's quotation must be on the page given.
for (const r of FOUR) {
  const t = rawText(texts.get(r.ref));
  if (S6_RE.test(t) && !seen.has(r.ref)) throw new Error(`${r.ref} names S6 but has no row in the S6 table`);
}
for (const r of S6) check(texts.get(r.ref), r.quote, Number(r.page));

// ---- The figures ----
const is = (...codes) => (r) => codes.includes(r.treatment);
const reach = S6.filter((r) => ['not-engaged', 'engaged', 'in-date'].includes(r.s6));
const cut = S6.filter(is('cut'));
const cutInc = S6.filter(is('cut-inconsistent'));
const applied = S6.filter(is('applied'));
const appliedEng = S6.filter(is('applied-engaged'));
const found = S6.filter(is('found-not-weighed'));
const old = S6.filter(is('cut-2024'));
const allCut = [...cut, ...cutInc];
const allApplied = [...applied, ...appliedEng];
expect(reach.length === allCut.length + allApplied.length + found.length, 'every report that reaches S6 is cut, applied or found-not-weighed');
expect(S6.length === reach.length + old.length, 'the table holds the reports that reach S6 and the 2024-style ones only');
const engagedRows = S6.filter((r) => r.s6 === 'engaged');
expect(engagedRows.length === 2 && engagedRows.every((r) => ['26-00290-FUL', '26-01906-PIP'].includes(r.ref)), 'S6 was found engaged at Upper Tysoe and Long Marston only');
expect(S6.find((r) => r.ref === '26-01399-PIP').s6 === 'in-date', 'Ilmington treated the plan as in date');
expect(found.length === 1 && found[0].ref === '26-01803-FUL', 'Oaks Holt is the one report that finds a conflict and neither cuts nor weighs it');
expect(cut.some((r) => r.ref === '26-01570-FUL'), 'Napton is among the reports that cut the plan after S6');
expect(applied.some((r) => r.ref === '26-01561-FUL') && appliedEng.some((r) => r.ref === '26-00290-FUL'), 'Little Kineton and Upper Tysoe are among the eight');
const standard = 'Consequently, NDMP S6 is not engaged. Accordingly, I afford NDP Polic';
const verbatim = cut.filter((r) => r.quote.startsWith(standard));
expect(verbatim.length >= 7, 'the standard two sentences appear word for word in at least seven reports');
const inconsistentSentence = 'Due to the fact that the NDMPs allow for certain types of development that is not covered in the';
const secondForm = cutInc.filter((r) => r.quote.startsWith(inconsistentSentence));
expect(secondForm.length === 2, 'the second form appears word for word at Harbury and Home Farm');
const grants = (rows) => rows.filter((r) => /^(approved|resolved|recommended-grant|recommend grant)/.test(fourByRef.get(r.ref).outcome));
const pct = (a, b) => Math.round((100 * a) / b);
const dates = S6.map((r) => fourByRef.get(r.ref).decided).filter((d) => /^\d{4}/.test(d)).sort();
const fmt = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const fmtMonth = (ym) => new Date(ym + '-15T12:00:00Z').toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const newest = FOUR.map((r) => r.decided).filter((d) => /^\d{4}/.test(d)).sort().at(-1);

// ---- Inspectors and other councils: the S6 findings in the decisions database ----
const all = [...caseById.values()];
const s6Cases = all.filter((c) => (c.policy_findings || []).some((f) => /^S6/.test(String(f.policy))));
const s6Find = (c) => (c.policy_findings || []).filter((f) => /^S6/.test(String(f.policy)));
const inspectors = s6Cases.filter((c) => c.decision_maker === 'inspector');
const councils = s6Cases.filter((c) => c.decision_maker !== 'inspector');
const byFinding = (rows) => { const n = {}; for (const c of rows) for (const f of s6Find(c)) n[f.finding] = (n[f.finding] || 0) + 1; return n; };
const insp = byFinding(inspectors);
expect((insp.fail || 0) === 2, 'two inspectors found S6 failed (Menheniot and Sheepy Parva)');
const refOf = (id) => (caseById.get(id)?.appeal_ref || id.replace(/^PINS-/, ''));
const AP = (id, para) => `${appealLink(id)}, ¶${para}`;
/** A checked quotation from a decision letter, with its paragraph number proved from the letter text. */
function dl(id, text, para) {
  const ref = refOf(id);
  check('pins:' + ref, text);
  const found = paragraphOf(ref, text);
  if (found !== para) throw new Error(`${ref}: "${text.slice(0, 50)}…" is in ¶${found}, not ¶${para}`);
  return quote('pins:' + ref, text, AP(id, para));
}
const lost = (c) => ['dismissed', 'refused'].includes(c.outcome);
const who = (c) => ({ inspector: 'Appeal', 'secretary-of-state': 'SoS', 'lpa-committee': 'Committee', 'lpa-delegated': 'Delegated', court: 'Court' })[c.decision_maker] || c.decision_maker;
const placeOf = (c) => c.title.replace(/\s*\([^)]*\)\s*$/, '').split(',').slice(-1)[0].trim();
const fmtShort = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const FIND = { pass: 'ok', accord: 'ok', benefit: 'ok', fail: 'no', conflict: 'no', harm: 'no', 'not-engaged': 'part', neutral: 'part' };
const registerRows = [...s6Cases].sort((a, b) => (a.decision_date < b.decision_date ? 1 : -1)).map((c) => {
  const ref = c.decision_maker === 'inspector' ? (c.appeal_ref || '').replace(/^.*?(\d{7})$/, '$1') : (c.lpa_ref || c.case_id);
  const f = s6Find(c).map((p) => `<span class="f"><span class="code">${esc(p.policy)}</span> <span class="pill ${FIND[p.finding] || 'part'}">${esc(p.finding)}</span></span>`).join(' ');
  const notes = s6Find(c).map((p) => p.note).filter(Boolean).map((n) => esc(n)).join(' · ');
  return `<tr><td><a href="${DECISION_PAGES}${encodeURIComponent(c.case_id)}.html">${esc(placeOf(c))}</a><br><small>${esc(who(c))} ${esc(ref)}, ${esc(fmtShort(c.decision_date))}</small></td><td><span class="pill ${lost(c) ? 'no' : 'ok'}">${esc(c.outcome)}</span></td><td>${f}</td><td class="n">${notes}</td></tr>`;
}).join('\n');

// ---- Stratford links: a decision page where the database has one, the reference otherwise ----
const refText = (ref) => ref.replace(/-/g, '/');
const link = (ref) => (caseById.has('stratford-' + ref) ? `<a href="${DECISION_PAGES}${encodeURIComponent('stratford-' + ref)}.html">${esc(refText(ref))}</a>` : `<span class="ref">${esc(refText(ref))}</span>`);
const rowLink = (r) => `${esc(r.place)}, ${link(r.ref)}`;
/** A short quotation in running text, checked like any other. */
const inline = (src, q, pg) => { check(src, q, pg); return `"${esc(q)}"`; };
const outcomeOf = (r) => { const o = fourByRef.get(r.ref).outcome; return /^(approved|resolved|recommended-grant|recommend grant)/.test(o) ? 'grant' : /refused/.test(o) ? 'refused' : 'other'; };
const names = (rows) => rows.map((r) => `${esc(r.place)} (${link(r.ref)})`).join(', ');

// ---- The June statement does not have the November sentence ----
const juneText = rawText(IPPS_JUNE);
expect(!/irrelevant/i.test(juneText) && !/\bS6\b/.test(juneText), 'the June 2026 statement neither names S6 nor says a failing plan is not irrelevant');

// ============================================================ The page ============================================================
const short = `<section id="short"><h2>The short answer</h2>
<div class="rule">
<p><strong>S6 does one thing.</strong> Where a housing proposal conflicts with a neighbourhood plan that was made in the last five years and allocates sites to meet its housing requirement, the benefits of approving it "are likely to be substantially outweighed by the adverse effects". The presumption in favour of development starts tilted against the scheme.</p>
<p><strong>When S6 does not apply, that tilt is not there. Nothing else changes.</strong> The plan is still part of the development plan under section 38(6). Each of its policies keeps the weight Annex A(2) gives it: full weight unless the policy, or a part of it, is materially inconsistent with a national decision-making policy. Annex A(2) says in terms that a policy is not to be given less weight because it is older than the Framework, and its footnote says this covers made neighbourhood plans.</p>
<p><strong>So "S6 is not engaged, therefore the plan's housing policy gets very limited weight" is a non sequitur.</strong> The first half is a finding about the tilt. The second half needs a finding about consistency, policy by policy, that the first half does not supply. Inspectors keep the two apart. ${allCut.length} of the ${reach.length} Stratford-on-Avon officer reports that reach S6 do not.</p>
</div></section>`;

const text = `<section id="text"><h2>What S6 says</h2>
${nppf('For development proposals involving the provision of housing, the benefits of approving development are likely to be substantially outweighed by the adverse effects where a proposal would conflict with a neighbourhood plan, provided the following apply:', 'S6(1)', 'S6-1')}
${nppf('The neighbourhood plan became part of the development plan five years or less before the date on which the decision is made; and', 'S6(1)(a)', 'S6-1-a')}
${nppf('The neighbourhood plan contains allocations to meet its identified housing requirement (see policy HO2).', 'S6(1)(b)', 'S6-1-b')}
<p>Three things follow from the words.</p>
<ul>
<li><strong>It is about housing proposals only.</strong> A commercial scheme, an extension or a change of use that conflicts with a neighbourhood plan is decided under the plan and the rest of the Framework; S6 says nothing about it.</li>
<li><strong>Both conditions must hold.</strong> A plan made six years ago with every site allocated fails (a). A plan made last year with no allocations fails (b). The requirement in (b) is the figure set for the neighbourhood area under <a href="${md('HO2-5')}">HO2(5)</a>, by the local plan or, where the local plan is out of date, as an indicative figure from the local planning authority.</li>
<li><strong>It is a statement about the balance, not about weight.</strong> S6 sits with S4 and S5 in the presumption chapter and uses their formula. It says what is "likely" to happen in the <a href="${OUTWEIGHED}">"substantially outweighed" balance</a> when a qualifying plan is in conflict. It does not say what weight any policy carries, and it does not say anything about plans that fail its conditions.</li>
</ul>
</section>`;

const origin = `<section id="origin"><h2>Where it came from</h2>
<p>S6 replaces paragraph 14 of the December 2024 Framework:</p>
${quote(NPPF_2024, 'In situations where the presumption (at paragraph 11d) applies to applications involving the provision of housing, the adverse impact of allowing development that conflicts with the neighbourhood plan is likely to significantly and demonstrably outweigh the benefits, provided the following apply:', 'NPPF, December 2024, ¶14')}
${quote(NPPF_2024, 'the neighbourhood plan contains policies and allocations to meet its identified housing requirement (see paragraphs 69-70).', 'NPPF, December 2024, ¶14(b)')}
<p>Three changes. Paragraph 14 bit only "in situations where the presumption applies", which under the 2024 Framework meant a plan that was out of date, usually through a housing supply shortfall; S6 attaches to the S4 and S5 balance, which applies to every proposal, so it bites whenever a housing scheme conflicts with a qualifying plan. The formula moved from "significantly and demonstrably outweigh" to "substantially outweighed", like the rest of the presumption (see <a href="${TILTED}">Is there still a tilted balance?</a>). And condition (b) asks for "allocations" where paragraph 14 asked for "policies and allocations".</p>
<p>The 2024 wording explains a habit that has outlived it. Under paragraph 14, whether a neighbourhood plan's housing policies were "up to date" and whether the paragraph protected them were close to the same question, because the paragraph was the thing that kept them up to date when the district's supply had failed. Stratford-on-Avon District Council's Interim Policy Position Statement of June 2026 read it exactly that way:</p>
${quote(IPPS_JUNE, 'Effectively this allows in certain circumstances any housing supply policies contained in Neighbourhood Plans to be treated as being up-to-date even though there is not an adequate land supply across the District as a whole. However, both criteria a) and b) need to be met.', 'Stratford-on-Avon District Council, Interim Policy Position Statement, June 2026, ¶5.3')}
<p>Under the 2026 Framework the two questions have come apart. S6 decides the tilt. Annex A(2) decides the weight, and age is not one of its tests.</p>
</section>`;

const weight = `<section id="weight"><h2>What S6 does not do</h2>
<p>The weight of a development plan policy under the 2026 Framework is set in one place:</p>
${nppf('Development plan policies (or parts of those policies) which are materially inconsistent with national decision-making policies in this Framework should be given very limited weight. The only exception to this is where they have been examined and adopted or made against this Framework. Other development plan policies should not be given reduced weight simply because they were adopted prior to the publication of this Framework.', 'Annex A(2)', 'AnnexA-2')}
${nppf('Including policies in made neighbourhood plans.', 'Annex A, footnote 67, on "Other development plan policies"', 'AnnexA-2')}
<p>So the decision-maker has two questions, and they are answered on different evidence.</p>
<div class="table-wrap"><table><thead><tr><th>Question</th><th>What it turns on</th><th>What the answer changes</th></tr></thead><tbody>
<tr><td><strong>Is S6 engaged?</strong></td><td>The date the plan was made, and whether it allocates sites to meet its HO2 requirement.</td><td>Whether the S4 or S5 balance starts tilted against a housing scheme that conflicts with the plan.</td></tr>
<tr><td><strong>What weight does each policy carry?</strong></td><td>Whether that policy, or a part of it, is materially inconsistent with a named national decision-making policy. Not its age.</td><td>How much a conflict with the policy counts as an adverse effect in the balance, and under section 38(6) whether the proposal accords with the plan.</td></tr>
</tbody></table></div>
<p>The four combinations are all possible. A recent plan with allocations can hold a boundary policy that is materially inconsistent with S5(1)(j), so the tilt applies to the conflict but the policy itself carries very limited weight. An old plan with no allocations can hold a design, landscape or self-build policy that is wholly consistent with the Framework; there is no tilt, and the policy carries full weight. What a decision cannot do is answer the second question with the first. A finding that S6 is not engaged says nothing about whether any policy contradicts the Framework.</p>
<p>The same point applies to the Core Strategy policies that reports cut for a supply shortfall; see <a href="${CORE}">which Core Strategy policies keep their weight</a>. For a plan-by-plan reading of one neighbourhood plan against Annex A(2), see <a href="${CLAVERDON_NP}">the Claverdon Neighbourhood Plan page</a>.</p>
</section>`;

const inspectorsHtml = `<section id="inspectors"><h2>How inspectors apply it</h2>
<p>The decisions database records ${s6Cases.length} decisions with a finding under S6, ${inspectors.length} of them appeal decisions. The inspectors check the two conditions, say which way the tilt runs, and then weigh the plan's policies on their own terms.</p>
<h3>Both conditions met: the tilt applies</h3>
${dl('PINS-6007431', 'Consequently, there is no reason for me to conclude that the Neighbourhood Plan does not continue to make provision for the local housing requirement that was identified at the time it was made, less than five years ago. I therefore give substantial weight to the conflict with Policy 1 of the Neighbourhood Plan.', 23)}
<p>Menheniot: plan made April 2022, allocations not yet built but deliverable, appeal dismissed. The inspector weighed the conflict and then applied S6 to the balance.</p>
<h3>A condition fails: no tilt, the policy still applies</h3>
${dl('PINS-6007104', 'Since the HNP became part of the development plan more than five years from the date of my decision, the test at Framework policy S6(a) is not met.', 29)}
${dl('PINS-6007104', 'The HNP policies and allocations has made provision for more than the 270 dwellings, thereby exceeding the HNP’s requirement. Therefore, the test at Framework policy S6(b) is met.', 30)}
<p>Henfield: each limb is tested on its own facts. The inspector then reduced the weight of the conflict with the plan's Policy 1 for a stated reason, that the plan's requirement figure was no longer reliable after a change in circumstances, not because S6(a) had failed.</p>
${dl('PINS-6008238', 'I emphasise, however, that the NP was adopted in 2017 and therefore it is more than five years old. Therefore, national decision-making policy S6 of the Framework is not applicable in this case.', 27)}
<p>Buntingford: the conflict with the plan's Policy HD1 had been found in the sentence before. S6 not applying removed the tilt and nothing else.</p>
${dl('PINS-6010848', 'Meanwhile, Policy S6 of the Framework does not weigh against the proposal due to the age of the Neighbourhood Plan.', 33)}
<p>Pitstone: the effect of a failed condition stated in one line. S6 "does not weigh against the proposal"; the plan's policies are weighed elsewhere in the letter.</p>
<h3>One letter reads it backwards</h3>
${dl('PINS-6008693', 'Where neighbourhood plans have formed part of the development plan within five years of a decision and allocate housing requirements, Policy S6 of the Framework weighs in favour of the benefits of housing proposals over any conflict with that plan.', 23)}
<p>Pickwell: S6 tilts against a conflicting housing scheme, not in its favour. The letter then limits the weight of the plan's policies "in outweighing the housing benefits" because the plan is more than five years old, which is the age-for-weight substitution this page is about. The appeal was dismissed on other grounds.</p>
<details><summary>Every decision in the database with an S6 finding (${s6Cases.length})</summary>
<div class="table-wrap"><table><thead><tr><th>Decision</th><th>Outcome</th><th>Finding</th><th>Note, as recorded in the case file</th></tr></thead><tbody>
${registerRows}
</tbody></table></div></details>
</section>`;

const napton = S6.find((r) => r.ref === '26-01570-FUL');
const naptonSrc = texts.get('26-01570-FUL');
const stratford = `<section id="stratford"><h2>How Stratford-on-Avon's officer reports apply it</h2>
<p>We have scored every officer report on a housing-type decision issued by Stratford-on-Avon District Council under the August 2026 Framework, ${FOUR.length} reports from 17 August to ${esc(fmt(newest))}, for <a href="${COMPARED}">four recurring errors</a>. The same reports were read again for the neighbourhood plan. ${mentions.length} of the ${FOUR.length} mention one. ${reach.length} are housing reports in which the officer sets out S6, decides whether its conditions are met and has to say what that means for the plan. Four more apply the December 2024 paragraph 14.</p>
<div class="stats">
<div class="stat"><div class="n">${reach.length}</div><div class="l">reports reach S6 with a housing policy of the plan in play</div></div>
<div class="stat"><div class="n">${allCut.length}</div><div class="l">cut the plan's housing policies to "very limited weight" after finding S6 not engaged (${cut.length} for that reason or as "out of date", ${cutInc.length} as "materially inconsistent" wholesale)</div></div>
<div class="stat"><div class="n">${allApplied.length}</div><div class="l">apply the plan at the weight Annex A(2) gives it (${applied.length} after finding S6 not engaged, ${appliedEng.length} after finding it engaged or the plan in date)</div></div>
<div class="stat"><div class="n">${found.length}</div><div class="l">find a conflict with the plan and then neither cut nor weigh it</div></div>
</div>
<h3>The standard sentence</h3>
<p>${verbatim.length} of the ${cut.length} reports in the first group use the same two sentences, with only the policy number changed. From the committee report on Ravenstone, Tanworth-in-Arden:</p>
${quote(texts.get('26-00410-FUL'), 'Consequently, NDMP S6 is not engaged. Accordingly, I afford NDP Policy H1 very limited weight in the determination of this application.', `Ravenstone, Tanworth-in-Arden, ${link('26-00410-FUL')}, committee report p.7`, 7)}
<p>The first sentence is right: the Tanworth-in-Arden plan was made in December 2022 and the Council holds that its allocations do not meet the area's requirement, so S6(1)(b) fails. The second does not follow from it. "Accordingly" is doing the work that a finding of material inconsistency should do, and no such finding is made. The others in this group are ${names(cut.filter((r) => r.ref !== '26-00410-FUL'))}.</p>
<p>A second form names the Annex A(2) test and then applies it to every housing policy in the plan at once. From the committee report on Harbury:</p>
${quote(texts.get('25-02712-OUT'), 'Due to the fact that the NDMPs allow for certain types of development that is not covered in the NDP and is therefore considered to be materially inconsistent, I afford the housing policies in the NDP very limited weight in the determination of this application.', `Harbury, ${link('25-02712-OUT')}, committee report p.11`, 11)}
<p>Annex A(2) cuts "policies (or parts of those policies)" that are materially inconsistent with a national decision-making policy. That the Framework allows some development a plan policy would not is a reason to cut the part of the policy that forbids it, for the sites the Framework reaches, not every housing policy in the plan. The others in this group are ${names(cutInc.filter((r) => r.ref !== '25-02712-OUT'))}.</p>
<h3>What the cut costs: Napton-on-the-Hill</h3>
<p>Most of the time the cut changes nothing, because the scheme was going to be approved or refused on the Core Strategy or the Green Belt. The delegated report on a self-build home at New Street, Napton-on-the-Hill (${link('26-01570-FUL')}, approved ${esc(fmt(fourByRef.get('26-01570-FUL').decided))}) shows what it costs when it does matter. Page 6 finds that the plan's self-build policy has criteria ${inline(naptonSrc, 'including encouraging the use of the existing network of public footpaths', 6)} and that ${inline(naptonSrc, 'I have not found that the proposal demonstrates compliance with this part of the policy', 6)}. The next paragraph:</p>
${quote(naptonSrc, napton.quote, `Napton-on-the-Hill, ${link('26-01570-FUL')}, delegated report p.6`, 6)}
<p>The plan was made in July 2021, so S6(1)(a) fails. Nothing in the report says which part of Policy 3 contradicts which national policy; a criterion about footpaths contradicts none. The planning balance on page 10 lists the Core Strategy conflicts and then says ${inline(naptonSrc, 'I have not identified any other forms of harm arising from the proposals', 10)}. The conflict with the plan was found and never weighed. The result would likely have been the same, but the parish's policy was not applied.</p>
<h3>The reports that keep the two questions apart</h3>
<p>Eight reports do it as the Framework reads. At Little Kineton the officer finds S6 not engaged (the Kineton plan was made in 2016), then weighs the conflicts with the plan's design and landscape policies and carries them into the refusal:</p>
${quote(texts.get('26-01561-FUL'), 'The proposal does not accord with the Policy requirements for housing as prescribed by Stratford-on-Avon District Core Strategy or the Kineton Neighbourhood Development Plan.', `Little Kineton, ${link('26-01561-FUL')}, delegated report p.18`, 18)}
<p>At Upper Tysoe the officer finds S6 engaged, the Tysoe plan being made in February 2022 with allocations the Council accepts, and resolves a conflict between the plan and the older Core Strategy in the plan's favour:</p>
${quote(texts.get('26-00290-FUL'), 'I therefore consider that NDMP S6 is engaged.', `Upper Tysoe, ${link('26-00290-FUL')}, committee report p.12`, 12)}
<p>The other six are ${names([...applied.filter((r) => r.ref !== '26-01561-FUL'), ...appliedEng.filter((r) => r.ref !== '26-00290-FUL')])}. In most of them the scheme complied with the plan, so applying it cost nothing; Little Kineton is the one report that finds a plan conflict, keeps it at weight and carries it to a refusal. Ilmington reaches the right weight by the wrong route: it calls the plan "in date" as made in July 2021, but the decision is dated 28 August 2026, so condition (a) had lapsed by six weeks.</p>
<h3>The Council's own position</h3>
<p>The revised Interim Policy Position Statement that went to Cabinet on 2 November 2026 works through all 32 made plans against the two conditions: 21 fail on age, 6 are recent but allocate no housing, 2 are recent with allocations that fall short of the Council's requirement figure, and 3 pass, Long Marston, Quinton and Tysoe. It then says what the reports do not:</p>
${quote(IPPS_NOV, 'Equally, where an NDP does not meet the tests of Policy S6, this does not mean that all or any of the NDP policies become irrelevant to the decision. Rather, it would be a matter for the decision maker to balance the benefits and harm and reach a conclusion in the context of each individual application.', 'Stratford-on-Avon District Council, revised Interim Policy Position Statement, Appendix 1 to the Cabinet report of 2 November 2026, ¶5.13')}
${quote(IPPS_NOV, 'The absence of the particular protection provided by national policy does not make an NDP irrelevant. Conversely, meeting the tests does not automatically require every conflicting proposal to be refused. A clear explanation of these distinctions is necessary in officer reports and communications with parish and town councils.', 'The same, ¶8.8')}
<p>The June 2026 statement had no equivalent sentence. The same paragraph 5.13 goes on to say that a settlement boundary in a plan "is likely to be given very limited weight", which is the Core Strategy reasoning carried into the plans, but the principle is stated: failing S6 does not make a plan's policies irrelevant.</p>
<h3>The ${S6.length} reports</h3>
<p>Every report that reaches S6, and the four that apply the 2024 paragraph 14, with the sentence that decides the plan's weight and its page. The table is <a href="${GITHUB}stratford-officer-reports-ndp-s6.tsv">published in the research repository</a>; every quotation is checked against the report text on the page given when this page is built. The remaining ${FOUR.length - S6.length} reports are householder, commercial, listed building and other cases in which no housing policy of a plan was in play, or no plan is mentioned; none of them names S6.</p>
${stratfordTable()}
</section>`;

function stratfordTable() {
  const LABEL = {
    cut: 'S6 not engaged, housing policy cut for that reason or as "out of date"',
    'cut-inconsistent': 'S6 not engaged, every housing policy cut as "materially inconsistent"',
    'found-not-weighed': 'S6 not engaged, conflict found, then neither cut nor weighed',
    applied: 'S6 not engaged, plan applied at its Annex A(2) weight',
    'applied-engaged': 'S6 engaged or the plan treated as in date, plan applied',
    'cut-2024': 'December 2024 paragraph 14 applied, plan "out of date"',
  };
  const S6LABEL = { 'not-engaged': 'not engaged', engaged: 'engaged', 'in-date': '"in date"', 'para-14': '¶14 (2024)', 'not-raised': 'not raised' };
  const order = ['cut', 'cut-inconsistent', 'found-not-weighed', 'applied', 'applied-engaged', 'cut-2024'];
  const byDate = (a, b) => String(fourByRef.get(a.ref).decided).localeCompare(String(fourByRef.get(b.ref).decided));
  const made = (ym) => fmtMonth(ym);
  const rows = order.flatMap((t) => {
    const group = S6.filter(is(t)).sort(byDate);
    return [`<tr class="group"><th colspan="5">${esc(LABEL[t])} (${group.length})</th></tr>`, ...group.map((r) => {
      const f = fourByRef.get(r.ref);
      const when = /^\d{4}/.test(f.decided) ? fmtShort(f.decided) : 'pending';
      return `<tr><td>${rowLink(r)}<br><small>${esc(f.type)}, ${esc(when)}, ${esc(outcomeOf(r))}, ${esc(f.homes)} home${/^1\b/.test(f.homes) ? '' : 's'}</small></td><td>${esc(r.plan)}<br><small>made ${esc(made(r.made))}</small></td><td>${esc(S6LABEL[r.s6])}</td><td><q>${esc(r.quote)}</q><small>p.${esc(r.page)}</small></td><td class="n">${esc(r.note)}</td></tr>`;
    })];
  }).join('\n');
  return `<div class="table-wrap"><table class="reports"><thead><tr><th>Report</th><th>Plan</th><th>S6</th><th>The words</th><th>Note</th></tr></thead><tbody>
${rows}
</tbody></table></div>`;
}

const fix = `<section id="fix"><h2>What a report should say</h2>
<ol>
<li><strong>Run S6 and say what it does.</strong> Give the date the plan was made and whether its allocations meet the HO2(5) requirement. If both conditions hold, the S4 or S5 balance starts tilted against a conflicting housing scheme. If either fails, it does not. Stop there: that is the whole of S6.</li>
<li><strong>Take each relevant plan policy on its own.</strong> Ask whether any part of it is materially inconsistent with a named national decision-making policy. A boundary policy that forbids what S5(1)(j) or GB7(1)(g) allows is inconsistent to that extent; a design, landscape, heritage, footpath or self-build criterion usually is not. Give very limited weight to the inconsistent part and full weight to the rest. Do not mention the plan's age.</li>
<li><strong>Carry the conflict into the balance.</strong> A conflict with a full-weight policy is an adverse effect under S4(1) or S5(1), and a departure from the development plan under section 38(6). Say so, and say what weight it gets.</li>
</ol>
<p>Two sentences would do it at Napton: "S6 is not engaged, because the plan was made in July 2021. Policy 3's footpath criterion is consistent with the Framework and carries full weight; the proposal does not meet it, and I weigh that conflict as a moderate adverse effect."</p>
</section>`;

const extraCss = `<style>.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}.stat{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:14px 16px}.stat .n{font:600 32px/1 var(--serif);color:var(--accent);font-variant-numeric:tabular-nums}.stat .l{font-size:13.5px;margin-top:6px}
section>ol,section>ul{margin:0;padding-left:20px;display:grid;gap:8px;max-width:72ch}section>ol>li,section>ul>li{font-size:15.5px}h3{font:600 17px/1.35 var(--sans);margin-top:8px}
details{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:10px 14px}summary{cursor:pointer;font-weight:600;color:var(--accent)}details .table-wrap{margin-top:10px}
.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}table{border-collapse:collapse;width:100%;font-size:14px;min-width:640px}th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--line)}thead th{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}td q{display:block;color:var(--muted);font:400 13px/1.45 var(--serif);margin-bottom:4px}td small{color:var(--muted)}td.n{font-size:13px;color:var(--muted);max-width:36ch}
table.reports{min-width:880px}table.reports td:first-child{min-width:18ch}table.reports td:nth-child(4){min-width:30ch}tr.group th{background:var(--surface-2);font-size:13px;letter-spacing:0;text-transform:none;color:var(--ink);padding-top:12px}
.f{display:inline-block;white-space:nowrap;margin:0 6px 4px 0}.ref{white-space:nowrap}</style>`;

const SOURCES_LIST = [
  `National Planning Policy Framework, August 2026: <a href="${GOVUK_NPPF}">GOV.UK</a>; our <a href="${NPPF_MD}">Markdown edition</a>. Policies S4(1), S5(1), S6, HO2(5), Annex A(2) and footnote 67.`,
  'National Planning Policy Framework, December 2024, ¶14 (UK Government Web Archive copy: <a href="https://webarchive.nationalarchives.gov.uk/ukgwa/20250225172715id_/https://assets.publishing.service.gov.uk/media/67aafe8f3b41f783cca46251/NPPF_December_2024.pdf">PDF</a>).',
  'Planning and Compulsory Purchase Act 2004, sections 38(5) and 38(6).',
  `Planning Inspectorate appeal decision letters, each linked above; the text of every letter is in the research repository under <code>data/open-sources/pins-corpus/</code>, and the paragraph number of each quotation is proved from the letter when the page is built.`,
  `Stratford-on-Avon District Council officer reports, from the Council's <a href="https://apps.stratford.gov.uk/eplanning/">planning register</a>; held with text extracts in the private sources checkout and quoted briefly. The scored set and its rubric: <a href="${GITHUB}stratford-officer-reports-four-errors.tsv">the 59-report table</a>, <a href="${GITHUB}four-errors-rubric.md">the rubric</a> and <a href="${GITHUB}stratford-officer-reports-ndp-s6.tsv">this page's table</a>.`,
  'Stratford-on-Avon District Council, Interim Policy Position Statement, June 2026 (¶5.2 to 5.3), and the revised statement at Appendix 1 to the Cabinet report of 2 November 2026 (¶5.7 to 5.13, 8.7 to 8.8).',
  `Companion pages: <a href="${OUTWEIGHED}">"Substantially outweighed"</a>, on the presumption S6 belongs to; <a href="${TILTED}">Is there still a tilted balance?</a>; <a href="${CORE}">Core Strategy: which policies keep their weight</a>, on the same Annex A(2) test; <a href="${CLAVERDON_NP}">the Claverdon Neighbourhood Plan under the 2026 NPPF</a>; <a href="${COMPARED}">Four errors, 27 councils compared</a>; and <a href="${STRATFORD}">Stratford-on-Avon decisions under the 2026 NPPF</a>.`,
];

const html = page({
  title: 'S6 Neighbourhood Plans',
  description: `What policy S6 of the August 2026 NPPF does for neighbourhood plans and what it does not: the tilt it adds for a plan made within five years with housing allocations, and the weight a plan keeps under Annex A(2) when S6 does not apply. How inspectors keep the two apart, and how ${allCut.length} of the ${reach.length} Stratford-on-Avon officer reports that reach S6 cut the plan's housing policies to "very limited weight" because S6 is not engaged.`,
  url: URL,
  breadcrumb: '<a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/england/">England</a> › S6: neighbourhood plans',
  h1: 'S6: what a neighbourhood plan\'s age changes, and what it does not',
  dek: `The one job S6 does, the two conditions it turns on, the weight a plan keeps when S6 does not apply, how inspectors read it, and how one council's reports read it.`,
  body: extraCss + short + text + origin + weight + inspectorsHtml + stratford + fix,
  sources: SOURCES_LIST,
  credit: 'Prepared by Planning Distilled.',
});

const out = path.join(SITE, SITE_PATH);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`✓ ${SITE_PATH}: ${FOUR.length} reports, ${mentions.length} mention a plan, ${reach.length} reach S6: ${allCut.length} cut (${cut.length} + ${cutInc.length}), ${allApplied.length} applied (${applied.length} + ${appliedEng.length}), ${found.length} found-not-weighed; ${old.length} under ¶14; ${verbatim.length} verbatim standard sentences; database S6 findings ${s6Cases.length} (${inspectors.length} appeals, ${JSON.stringify(insp)})`);
