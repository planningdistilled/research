// Do other councils make the four Stratford errors? Officer reports from 22 other councils, scored with the
// same rubric as the 44 Stratford-on-Avon reports, and what the comparison does to the Stratford findings.
//   node pages/authority/officer-reports-compared/build.mjs   (writes into main-site; needs ../sources for
//   the council report texts it quotes)
// Every number on the page is computed from the two tables in data/decisions/analysis
// (stratford-officer-reports-four-errors.tsv and other-councils-four-errors-2026-10.tsv). Every quotation is
// checked against the source text, with its page, when the page is built; the build fails on a mismatch, and
// it fails if a count the prose depends on stops holding.
import fs from 'node:fs';
import path from 'node:path';
import { DECISIONS, SITE } from '../../../paths.mjs';
import { appealLink, caseLink, check, esc, page, quote } from '../../_shared/policy-weight.mjs';
import { paragraphOf } from '../../_shared/letters.mjs';

const SITE_PATH = 'research/authority/officer-reports-compared/';
const URL = 'https://planningdistilled.org/' + SITE_PATH;
const STRATFORD = '/research/authority/stratford-dc/nppf-2026-decisions/';
const DP3 = '/research/england/dp3-design/';
const SUSTAINABLE = '/research/england/sustainable-location/';
const SERVICE_VILLAGE = '/research/england/sustainable-location/service-village/';
const SETTLEMENT = '/research/england/what-is-a-settlement/';
const VSC = '/research/england/very-special-circumstances/';
const PRESUMPTION = '/research/england/substantially-outweighed/';
const GITHUB = 'https://github.com/planningdistilled/research/blob/main/data/decisions/analysis/';
const GOVUK_TOOL = 'https://www.gov.uk/guidance/connectivity-tool';
const ANALYSIS = path.join(DECISIONS, 'analysis');

// ---- The two tables ----
function tsv(file) {
  const text = fs.readFileSync(path.join(ANALYSIS, file), 'utf8');
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
const S = tsv('stratford-officer-reports-four-errors.tsv').map((r) => ({ council: 'Stratford-on-Avon', ...r }));
const O = tsv('other-councils-four-errors-2026-10.tsv');
if (S.length !== 44) throw new Error(`expected 44 Stratford rows, found ${S.length}`);
if (O.length !== 99) throw new Error(`expected 99 other-council rows, found ${O.length}`);

/** The code at the front of a cell ("error", "not-mentioned", "2024+note"); notes after a colon, semicolon or bracket are ignored. */
const code = (v) => (v || '').trim().split(/[\s;:(]/)[0].toLowerCase();
/** The largest number of homes a row proposes: "up to 5" is 5, "1-5" is 5, "0 (access works for 217)" is 0. */
function homesOf(h) {
  const pre = h.split('(')[0];
  let m = pre.match(/\d+/g);
  if (!m) m = h.match(/\d+/g);
  return m ? Math.max(...m.map(Number)) : null;
}
/** What the officer recommended, read from the outcome cell: "grant" or "refuse". Member overturns follow the recommendation, not the vote. */
function officer(o) {
  const s = o.toLowerCase();
  if (/against the officer recommendation to grant|recommendation to grant|recommended-grant|recommend grant|recommendation grant|resolved-to-grant|with a view to approval|delegate to permit|^approved|^granted|^permit|^grant|minded to grant|recommendation delegated|against the officer recommendation\b(?!.*refus)/.test(s)) return 'grant';
  if (/^refused|recommend(ed)?[- ]refuse|minded to refuse/.test(s)) return 'refuse';
  throw new Error('cannot read the officer recommendation from: ' + o);
}
const pct = (n, d) => (d ? Math.round((100 * n) / d) : 0);
const num = (n) => n.toLocaleString('en-GB');

function stats(rows) {
  const count = (k, v) => rows.filter((r) => code(r[k]) === v).length;
  const scored = (k) => rows.filter((r) => code(r[k]) !== 'na');
  const st = {
    n: rows.length,
    committee: rows.filter((r) => code(r.type) === 'committee').length,
    greenBelt: rows.filter((r) => code(r.green_belt) === 'yes' || code(r.green_belt) === 'part').length,
    tier: { error: count('tier', 'error'), partial: count('tier', 'partial'), ok: count('tier', 'ok'), n: scored('tier').length },
    tr3: { nm: count('tr3', 'not-mentioned'), cited: count('tr3', 'cited-only'), dodged: count('tr3', 'dodged'), assessed: count('tr3', 'assessed'), n: scored('tr3').length },
    tool: { yes: count('connectivity_tool', 'yes'), indirect: count('connectivity_tool', 'indirect') },
    annexb: { error: count('annexb', 'error'), ok: count('annexb', 'ok'), n: scored('annexb').length },
    dp33: { error: count('dp33', 'error'), ok: count('dp33', 'ok'), n: scored('dp33').length },
    unconverted: rows.filter((r) => ['2024', '2024-unconverted'].includes(code(r.framework))).length,
    mixed: count('framework', 'mixed'),
    converted: count('framework', '2024+note'),
    template: count('template_weight', 'yes'),
  };
  st.tier.notRun = st.tier.error + st.tier.partial;
  st.tr3.notRun = st.tr3.nm + st.tr3.cited + st.tr3.dodged;
  // DP3(3) errors by what the officer recommended.
  const dpErr = rows.filter((r) => code(r.dp33) === 'error');
  st.dp33.grant = dpErr.filter((r) => officer(r.outcome) === 'grant').length;
  st.dp33.refuse = dpErr.length - st.dp33.grant;
  // TR3 by scheme size: six homes or more, against five or fewer.
  const tr3Rows = scored('tr3');
  const size = (sel) => {
    const rs = tr3Rows.filter(sel);
    const c = (v) => rs.filter((r) => code(r.tr3) === v).length;
    return { n: rs.length, nm: c('not-mentioned'), cited: c('cited-only'), dodged: c('dodged'), assessed: c('assessed'), notRun: c('not-mentioned') + c('cited-only') + c('dodged') };
  };
  st.tr3.big = size((r) => (homesOf(r.homes) ?? 0) >= 6);
  st.tr3.small = size((r) => (homesOf(r.homes) ?? 0) < 6);
  return st;
}
const s = stats(S);
const o = stats(O);
const councils = [...new Set(O.map((r) => r.council))].sort();
const perCouncil = councils.map((c) => ({ council: c, ...stats(O.filter((r) => r.council === c)) }));
const sets = ['held-a', 'held-b', 'fetch-warwick-bromsgrove', 'fetch-southworcs', 'fetch-moderngov'];
if (new Set(O.map((r) => r.scored_in)).size !== sets.length || O.some((r) => !sets.includes(r.scored_in))) throw new Error('the scored_in sets have changed');

// ---- Facts the prose states; the build stops if the tables move away from them ----
const expect = (cond, msg) => { if (!cond) throw new Error('the page says: ' + msg); };
expect(councils.length === 22, `22 other councils (now ${councils.length})`);
expect(s.tool.yes === 0, `no Stratford report uses the Connectivity Tool (now ${s.tool.yes})`);
expect(s.dp33.grant === 15 && s.dp33.refuse === 3, `Stratford DP3(3) errors split 15 grant / 3 refuse (now ${s.dp33.grant}/${s.dp33.refuse})`);
const grantErrRefs = O.filter((r) => code(r.dp33) === 'error' && officer(r.outcome) === 'grant').map((r) => r.ref).sort().join(' ');
expect(grantErrRefs === '2025/3373 25/01742/MOA M/26/00885/FUL', `the three other-council grant-after-conflict reports are Leigh Sinton, Moore Place and Polehanger (now ${grantErrRefs})`);
expect(o.dp33.grant === 3 && o.dp33.refuse === 5, `other DP3(3) errors split 3 grant / 5 refuse (now ${o.dp33.grant}/${o.dp33.refuse})`);
expect(pct(s.tier.error, s.tier.n) > 2 * pct(o.tier.error, o.tier.n), 'Stratford makes the tier error more than twice as often');
expect(pct(s.annexb.error, s.annexb.n) > 2 * pct(o.annexb.error, o.annexb.n), 'Stratford makes the Annex B error more than twice as often');
expect(s.template / s.n > 4 * (o.template / o.n), 'the template paragraph is at least four times as common at Stratford');
const warwick = perCouncil.find((c) => c.council === 'Warwick');
expect(warwick && warwick.tier.error >= 2, 'Warwick has at least two tier errors');
const noTierError = perCouncil.filter((c) => c.tier.n >= 2 && c.tier.error === 0).map((c) => c.council);
const tierErrorCouncils = perCouncil.filter((c) => c.tier.error > 0).map((c) => `${c.council} (${c.tier.error} of ${c.tier.n})`);
const joinAnd = (xs) => xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
const bromsgrove = perCouncil.find((c) => c.council === 'Bromsgrove');
expect(bromsgrove && bromsgrove.tier.error === 1, `Bromsgrove has one tier error (now ${bromsgrove && bromsgrove.tier.error})`);
const templateCouncils = perCouncil.filter((c) => c.template > 0).map((c) => `${c.council}${c.template > 1 ? ` (${c.template})` : ''}`);
const toolCouncils = perCouncil.filter((c) => c.tool.yes > 0).map((c) => `${c.council} (${c.tool.yes})`);
const unconvertedOther = O.filter((r) => ['2024', '2024-unconverted'].includes(code(r.framework)));
expect(s.tr3.big.n === 8 && s.tr3.big.nm === 5 && s.tr3.big.cited === 1, `the Stratford six-plus-home TR3 rows are 5 not mentioned, 1 cited only of 8 (now ${s.tr3.big.nm}/${s.tr3.big.cited}/${s.tr3.big.n})`);
expect(unconvertedOther.length === 3, `three unconverted 2024 reports elsewhere (now ${unconvertedOther.length})`);
const washedOverOther = O.filter((r) => code(r.washed_over) === 'yes').length;

// ---- Quotation sources ----
// Text extracts of the other councils' reports live in the private sources checkout beside the PDFs.
const T = (set, file) => `sources:council/other-councils-2026-10/txt/${set}/${file}`;
const SRC = {
  beoley: T('warwick-bromsgrove', '26-00889-PIP-notice.txt'),
  dodford: T('held-a', 'bromsgrove-25-01429-FUL-notice.txt'),
  fairfield: T('warwick-bromsgrove', '26-01037-PIP-notice.txt'),
  chesham: T('moderngov', 'dacorum--chesham-update.txt'),
  moorePlace: T('moderngov', 'elmbridge--2025-3373.txt'),
  hersham: T('moderngov', 'elmbridge--2026-0036.txt'),
  newEnd: T('held-a', 'wychavon-W-26-01639-PIP-report.txt'),
  offenham: T('south-worcs', 'W-26-01940-PIP__delegated_report_W2601940PIP.txt'),
  shavington: T('held-a', 'cheshireeast-26-0640-FUL-report.txt'),
  bath: T('held-b', 'bathnes-2026-09-02-committee-reports.txt'),
  honeybourne: T('south-worcs', 'W-25-02384-FUL__delegated_report_W2502384FUL.txt'),
  bollington: T('moderngov', 'cheshireeast--25-4697.txt'),
  polehanger: T('moderngov', 'dacorum--polehanger-report.txt'),
  worcester: T('held-a', 'worcester-26-00541-FUL-report.txt'),
  townHill: T('moderngov', 'tmbc--25-00767.txt'),
  pinvin: T('held-a', 'wychavon-W-26-00329-FUL-report.txt'),
  hallow: T('south-worcs', 'M-26-01143-PIP__delegated_report_M2601143PIP.txt'),
  nortonLindsey: T('warwick-bromsgrove', 'W-26-0066-report.txt'),
  pirton: T('held-b', 'northherts-25-02064-OP-report.txt'),
  pirtonUpdate: T('held-b', 'northherts-25-02064-OP-update.txt'),
  newPound: T('moderngov', 'northherts--26-00262.txt'),
  poundLane: T('moderngov', 'basildon--24-00294-sep.txt'),
  tredington: 'sources:stratford-dc/public-note/stratford-25-02906-FUL-report.txt',
  govResponse: 'open:guidance-ogl/mhclg-nppf-consultation-government-response.txt',
};
/** An inline checked quotation. */
const q = (src, text, pg) => { check(src, text, pg); return `"${esc(text)}"`; };
/** A checked quotation from a decision letter, with its paragraph number proved from the letter. */
function letter(ref, text, para, note, place) {
  const found = paragraphOf(ref, text);
  if (found !== para) throw new Error(`${ref}: quotation is in ¶${found}, not ¶${para}: "${text.slice(0, 60)}"`);
  const link = place ? `<a href="/research/england/nppf-navigator/decisions/PINS-${ref}.html">${esc(place)}, appeal ${ref}</a>` : appealLink('PINS-' + ref);
  return quote('pins:' + ref, text, `${link} ¶${para}${note ? `, ${note}` : ''}`);
}
const report = (council, ref, pg) => `${esc(council)}, ${esc(ref)}, officer report p.${pg}`;

// ---- The comparison table ----
const compareRows = [
  ['Tier used as the location test', `error ${s.tier.error}, partial ${s.tier.partial}, ok ${s.tier.ok} of ${s.tier.n}<br>error ${pct(s.tier.error, s.tier.n)}%; error or partial ${pct(s.tier.notRun, s.tier.n)}%`,
    `error ${o.tier.error}, partial ${o.tier.partial}, ok ${o.tier.ok} of ${o.tier.n}<br>error ${pct(o.tier.error, o.tier.n)}%; error or partial ${pct(o.tier.notRun, o.tier.n)}%`,
    `A Stratford habit, shared by ${joinAnd(tierErrorCouncils)}. Bromsgrove's one is a three-page notice with no report behind it. ${noTierError.length} councils with two or more location reports have no tier error at all.`],
  ['TR3 not assessed', `not mentioned ${s.tr3.nm}, cited only ${s.tr3.cited}, dodged ${s.tr3.dodged}, assessed ${s.tr3.assessed} of ${s.tr3.n}<br>not run ${pct(s.tr3.notRun, s.tr3.n)}%`,
    `not mentioned ${o.tr3.nm}, cited only ${o.tr3.cited}, dodged ${o.tr3.dodged}, assessed ${o.tr3.assessed} of ${o.tr3.n}<br>not run ${pct(o.tr3.notRun, o.tr3.n)}%`,
    'Common everywhere. Stratford is worse but not an outlier, and the count needs splitting by scheme size (below).'],
  ['Connectivity Tool used', `${s.tool.yes} of ${s.n}`, `${o.tool.yes} of ${o.n}${o.tool.indirect ? `, plus ${o.tool.indirect} indirect` : ''}<br>${toolCouncils.join(', ')}`,
    'Absent almost everywhere. Where it appears it is one team\'s template.'],
  ['Annex B and the Green Belt route', `error ${s.annexb.error} of ${s.annexb.n} Green Belt or hamlet cases<br>${pct(s.annexb.error, s.annexb.n)}%`,
    `error ${o.annexb.error} of ${o.annexb.n}<br>${pct(o.annexb.error, o.annexb.n)}%`,
    'Stratford and Warwick apply S4 or S5(1)(j) in washed-over villages. Elsewhere most of the errors are belt-and-braces runs of S5 before S5(5) is applied; only Basildon and North Hertfordshire change the route.'],
  ['DP3(3) not asked after a design conflict', `error ${s.dp33.error} of ${s.dp33.n}<br>${pct(s.dp33.error, s.dp33.n)}%; ${s.dp33.grant} of the errors recommend grant`,
    `error ${o.dp33.error} of ${o.dp33.n}<br>${pct(o.dp33.error, o.dp33.n)}%; ${o.dp33.grant} of the errors recommend grant`,
    'The clearest Stratford outlier, partly a composition effect: other officers rarely find a design conflict and then recommend approval.'],
  ['2024 Framework applied without conversion', `${s.unconverted} of ${s.n}`, `${o.unconverted} of ${o.n}`,
    'Rare everywhere. The late Warwick and Wychavon notices on old reports are the same defect as Stratford\'s Checketts Abattoir.'],
  ['Template paragraph cutting the hierarchy policies to very limited weight', `${s.template} of ${s.n}<br>${pct(s.template, s.n)}%`, `${o.template} of ${o.n}<br>${pct(o.template, o.n)}%<br>${templateCouncils.join(', ')}`,
    'A Stratford peculiarity in form. The other six cut hierarchy policies on five-year-supply or age grounds, the 2024 logic that Annex A(2) also does not allow.'],
];
const compareTable = `<div class="table-wrap"><table><thead><tr><th>Error</th><th>Stratford (${s.n} reports)</th><th>22 other councils (${o.n} reports)</th><th>Reading</th></tr></thead><tbody>
${compareRows.map(([a, b, c, d]) => `<tr><th scope="row">${a}</th><td>${b}</td><td>${c}</td><td>${d}</td></tr>`).join('\n')}
</tbody></table></div>`;

const cell = (c) => `${c.error}/${c.partial ?? ''}${c.partial !== undefined ? '/' : ''}${c.ok}`;
const councilTable = `<div class="table-wrap"><table class="councils"><thead><tr><th>Council</th><th>Reports</th><th>Tier<br><small>error / partial / ok</small></th><th>TR3<br><small>not mentioned / cited only / dodged / assessed</small></th><th>Tool</th><th>Annex B<br><small>error / ok</small></th><th>DP3(3)<br><small>error / ok</small></th><th>2024 unconverted</th><th>Template</th></tr></thead><tbody>
${[...perCouncil, { council: 'Stratford-on-Avon', ...s, bold: true }].map((c) => {
  const w = (x) => (c.bold ? `<strong>${x}</strong>` : x);
  return `<tr${c.bold ? ' class="sdc"' : ''}><th scope="row">${w(esc(c.council))}</th><td>${w(c.n)}</td><td>${w(cell(c.tier))}</td><td>${w(`${c.tr3.nm}/${c.tr3.cited}/${c.tr3.dodged}/${c.tr3.assessed}`)}</td><td>${w(c.tool.yes)}</td><td>${w(`${c.annexb.error}/${c.annexb.ok}`)}</td><td>${w(`${c.dp33.error}/${c.dp33.ok}`)}</td><td>${w(c.unconverted)}</td><td>${w(c.template)}</td></tr>`;
}).join('\n')}
</tbody></table></div>`;

const tr3SplitTable = `<div class="table-wrap"><table><thead><tr><th>Scheme size</th><th>Stratford</th><th>Other councils</th></tr></thead><tbody>
<tr><th scope="row">Six homes or more</th><td>not run ${s.tr3.big.notRun} of ${s.tr3.big.n} (${pct(s.tr3.big.notRun, s.tr3.big.n)}%); assessed ${s.tr3.big.assessed}</td><td>not run ${o.tr3.big.notRun} of ${o.tr3.big.n} (${pct(o.tr3.big.notRun, o.tr3.big.n)}%); assessed ${o.tr3.big.assessed}</td></tr>
<tr><th scope="row">Five homes or fewer, or no new homes</th><td>not run ${s.tr3.small.notRun} of ${s.tr3.small.n} (${pct(s.tr3.small.notRun, s.tr3.small.n)}%); assessed ${s.tr3.small.assessed}</td><td>not run ${o.tr3.small.notRun} of ${o.tr3.small.n} (${pct(o.tr3.small.notRun, o.tr3.small.n)}%); assessed ${o.tr3.small.assessed}</td></tr>
</tbody></table></div>`;

const dp3SplitTable = `<div class="table-wrap"><table><thead><tr><th>DP3(3) not asked after a found conflict</th><th>Stratford</th><th>Other councils</th></tr></thead><tbody>
<tr><th scope="row">Officer recommended grant</th><td>${s.dp33.grant}</td><td>${o.dp33.grant}</td></tr>
<tr><th scope="row">Officer recommended refusal</th><td>${s.dp33.refuse}</td><td>${o.dp33.refuse}</td></tr>
</tbody></table></div>`;

// ---- The page ----
const short = `<section id="in-short"><div class="rule"><h2>In short</h2><ul>
<li>The <a href="${STRATFORD}">Stratford note</a> found four recurring errors in Stratford-on-Avon District Council's officer reports under the National Planning Policy Framework (NPPF) of 17 August 2026. We scored ${o.n} reports from ${councils.length} other councils with the same rubric to see whether the errors are Stratford's or everyone's.</li>
<li><strong>They are mostly Stratford's.</strong> Scored the same way, the other councils rest a location finding on a village's tier a third as often (${pct(o.tier.error, o.tier.n)}% against ${pct(s.tier.error, s.tier.n)}%), take the wrong route in Green Belt villages less than half as often (${pct(o.annexb.error, o.annexb.n)}% against ${pct(s.annexb.error, s.annexb.n)}%), and recommend approval after an unaddressed design conflict in ${o.dp33.grant} reports against Stratford's ${s.dp33.grant}. The paragraph that cuts the settlement hierarchy policies to very limited weight wholesale appears in ${pct(s.template, s.n)}% of Stratford reports and ${pct(o.template, o.n)}% of the others.</li>
<li><strong>One council repeats the pattern.</strong> Warwick District Council, which shares Stratford's Green Belt and plan structure, makes the tier error in ${warwick.tier.error} of its ${warwick.tier.n} location reports and applies S4 in a washed-over village at Norton Lindsey. Wychavon, Elmbridge and Dacorum, on comparable sites, do not, and Bromsgrove's one tier error in ${bromsgrove.tier.n} location reports is a short notice with no report behind it.</li>
<li><strong>Two of the Stratford counts were too hard</strong> and are re-presented here. TR3 "not mentioned" counts small schemes that officers and inspectors alike treat as below the policy's threshold; split by size, the difference between Stratford and the rest is in schemes of six homes or more. DP3(3) "not asked" on a refusal is a formal slip that cannot change the outcome; the finding that matters is the ${s.dp33.grant} Stratford recommendations to grant after a found design conflict, against ${o.dp33.grant} across ${councils.length} councils.</li>
<li><strong>One absence is shared.</strong> No Stratford report uses the Connectivity Tool. Nor do ${o.n - o.tool.yes} of the ${o.n} reports elsewhere.</li>
</ul></div></section>`;

const errors = `<section id="errors"><h2>The four errors</h2>
<p>The Stratford note scored every officer report held for a decision made, or a committee item published, from 17 August 2026 against four errors. The same rubric, with the same codes, was applied to the other councils' reports. Each error is a step the Framework asks for and the report leaves out.</p>
<ol>
<li><strong>A village's tier used as the location test.</strong> The report treats the village's place in the settlement hierarchy, or a list of its facilities, as showing that the location is sustainable, instead of assessing the route and the transport choice. The Framework's test is in TR3(1)(a): development that ${q('nppf', 'could generate a significant amount of movement')} should be in a location that will ${q('nppf', 'limit the need to travel, particularly by private car, and offer a genuine choice of transport modes for residents and users')}. <a href="${SERVICE_VILLAGE}">Service village does not mean sustainable</a> sets out how inspectors apply it.</li>
<li><strong>TR3 not assessed.</strong> The report does not run the limbs of TR3(1), and does not use the evidence TR3(2) asks for: ${q('nppf', 'The Connectivity Tool (Connectivity Tool - GOV.UK) should be used alongside other relevant quantitative or qualitative evidence in assessing the connectivity of particular locations proposed for development')}. <a href="${SUSTAINABLE}">How to assess a sustainable location</a> explains the test and the Tool.</li>
<li><strong>Annex B and the Green Belt route.</strong> Annex B's definition of a settlement says settlements ${q('nppf', 'do not include hamlets and scattered groups of houses located outside predominantly built-up areas')} and ${q('nppf', 'also exclude villages which lie within and are defined as part of the Green Belt in the development plan')}. S5(5) says S5 ${q('nppf', 'does not apply to development proposals in the Green Belt')}. The error is applying S4 or S5(1)(j) in a washed-over village or a hamlet, or using a built-up area boundary or a tier as the GB7(1)(g)(iii) test. See <a href="${SETTLEMENT}">What is a "settlement"?</a></li>
<li><strong>DP3(3) not asked.</strong> A design or character conflict is found and weighed in the balance, but the DP3(3) question is not asked: proposals ${q('nppf', 'should be refused if, without clear justification, they conflict with paragraph 1 of this policy or relevant aspects of the principles in paragraph 2')}. S4(2)(c) and S5(2) make a failure under such a policy a case where the benefits are ${q('nppf', 'likely to be substantially outweighed')}. See <a href="${DP3}">DP3: the design policy</a>.</li>
</ol>
<p>Two further columns record whether the report applied the 2024 Framework without conversion after 17 August 2026, which Annex A(1) does not allow (the 2026 policies ${q('nppf', 'must be taken into account in decision-making from the day of its publication')}), and whether it carries a template paragraph giving the plan's settlement hierarchy policies very limited weight wholesale, where Annex A(2) cuts weight only from policies ${q('nppf', '(or parts of those policies) which are materially inconsistent with national decision-making policies')}.</p>
<p>Codes: <code>error</code>; <code>partial</code> for a tier finding with some route fact beside it; <code>cited-only</code> and <code>dodged</code> for TR3 named but not run; <code>ok</code>; <code>na</code> where the question does not arise. Rates below are among the reports where the question arises. The <a href="${GITHUB}other-councils-four-errors-2026-10.tsv">table of the ${o.n} other-council reports</a> and the <a href="${GITHUB}stratford-officer-reports-four-errors.tsv">Stratford table</a> carry a page reference and a verbatim quotation for every adverse code, and every "not mentioned" is a text search with no hits.</p>
</section>`;

const compare = `<section id="comparison"><h2>The comparison</h2>
${compareTable}
<p>The two tables were scored with one written rubric. The Stratford reports are mostly delegated reports on one to seven homes in villages; the other councils' reports are a mix of delegated reports and committee reports on larger schemes, which matters for TR3 and DP3(3) and is taken up below. Rates for the other councils are also pulled down by their urban reports, where the tier, Annex B and route questions do not arise and are coded <code>na</code> on both sides.</p>
</section>`;

const byCouncil = `<section id="by-council"><h2>Council by council</h2>
<p>Counts exclude <code>na</code> rows. Small counts are small: ${perCouncil.filter((c) => c.n <= 2).length} of the ${councils.length} councils are represented by one or two reports, because that is what their committees decided in the period.</p>
${councilTable}
</section>`;

const best = `<section id="best"><h2>What the best reports elsewhere do</h2>
<h3>The Green Belt route stated and followed</h3>
<p>Bromsgrove's delegated template quotes the S3 split and then says that ${q(SRC.beoley, 'S5 does not apply to development proposals in the Green Belt and that these proposals should be determined in accordance with NDMP GB6 and GB7', 2)}, runs GB7(1)(a) to (g) as a list, and in the Green Belt conclusion applies the S5(5) balance in terms. Dacorum's update report on Chesham Road, Berkhamsted, puts it in one line:</p>
${quote(SRC.chesham, 'Policy S5 does not provide an alternative route for approval. S5(5) provides that S5 does not apply to development proposals in the Green Belt', report('Dacorum', '24/02868/MOA', 7), 7)}
<p>Elmbridge's report on the former Moore Place golf course at Esher sets up the same route, ${q(SRC.moorePlace, 'policy S5(5) of the NPPF is of relevance', 23)}, runs GB7(1)(g)(i) to (iv), and returns to S5(5) and S5(2) at the balance. Compare Stratford at Butts Lane, Tanworth-in-Arden, where the S5(1)(j) test for a site ${q('case:stratford-26-00918-PIP', 'well-related to an existing settlement', 9)} is run in a village washed over by the Green Belt before S5(5) is reached (${caseLink('stratford-26-00918-PIP')}, p.9).</p>
<h3>GB7(1)(g)(iii) answered with the route, in TR3's words</h3>
<p>At Beoley, 270 metres outside the village envelope, the Bromsgrove officer gives the footway side, the speed limit, the lighting and the distance to each facility, notes ${q(SRC.beoley, 'there is a not a continuous footway to the identified facilities. There is no street lighting for much of the route', 4)}, cites an appeal on the movement threshold, and concludes:</p>
${quote(SRC.beoley, 'the site is not considered to offer a genuine choice of transport modes for future residents who are likely to be reliant', report('Bromsgrove', '26/00889/PIP', 4), 4)}
<p>At Dodford the same council says ${q(SRC.dodford, 'Criteria iii requires that the development would be in a sustainable location having regard to policy TR3 of the 2026 Framework', 4)}, finds a bus ${q(SRC.dodford, 'one bus in each direction to/from Bromsgrove on a Tuesday and Friday only', 4)}, and holds that ${q(SRC.dodford, 'the site does not lie within a sustainable location', 4)}, so the scheme is inappropriate and needs <a href="${VSC}">very special circumstances</a>. Stratford's counterpart at Tithe Barn Lane, Earlswood, passes the same limb because the dwelling is inside the built-up area boundary of a Category 3 Local Service Village, with no route assessed (${caseLink('stratford-26-01458-FUL')}, p.9).</p>
<h3>The Connectivity Tool in an ordinary delegated report</h3>
<p>Wychavon's officers quote TR3(1)(a) in full and give the score. At New End, Astwood Bank: ${q(SRC.newEnd, 'Policy TR3 Paragraph 2 of the NPPF requires local planning authorities to use the GOV.UK Connectivity Tool', 6)}, and ${q(SRC.newEnd, 'The application site has a Connectivity Score of 23', 6)}. At Offenham: ${q(SRC.offenham, 'The application site has an overall connectivity score of approximately 37', 7)}, then the footway, the speed limit and a bus every two hours, with the Category 1 label as context and the conclusion that ${q(SRC.offenham, 'connectivity could be better, on this occasion the proposal is considered to be acceptable', 8)}. Cheshire East at Shavington: ${q(SRC.shavington, 'the site is rated at Local Authority Band B', 11)}. Bath and North East Somerset at the former Bath Press: ${q(SRC.bath, "a Department for Transport connectivity score of 80-82, categorised as 'very high' nationally", 116)}. ${o.tool.yes} reports in ${o.n} is not many, but it shows the Tool fits in a delegated report.</p>
<h3>DP3(3) quoted as a refusal rule</h3>
<p>Wychavon's template says it by page number:</p>
${quote(SRC.honeybourne, 'NPPF page 67 is clear that development proposals should be refused, if, without clear justification, they conflict with Paragraph 1 of Policy DP3', report('Wychavon', 'W/25/02384/FUL', 5), 5)}
<p>Elmbridge at Hersham finds that ${q(SRC.hersham, 'the proposal is considered to have an adverse effect on the character of the area and so conflicts with national decision-making policy DP3', 60)}, quotes DP3(3), and says that under S4 ${q(SRC.hersham, 'it is necessary to consider whether the benefits of approving development are likely to be substantially outweighed by adverse effects', 61)}: the trigger Stratford's reports leave out. Cheshire East at Bollington asks the S4(2)(c) question in terms: ${q(SRC.bollington, 'There is no conflict with any of the national decision-making policies which state that development proposals should be refused in specific circumstances', 12)}. Stratford's one report that names DP3(3), Snitterfield, uses it only as a source of weight:</p>
${quote('case:stratford-26-00617-PIP', 'In light of NDMP DP3 (3), I afford this harm substantial weight.', `${caseLink('stratford-26-00617-PIP')}, officer report p.15`, 15)}
<h3>Annex A(2) applied policy by policy</h3>
<p>Dacorum at Polehanger declines to cut a saved policy because it ${q(SRC.polehanger, 'is not considered to be so materially inconsistent with the NPPF to the extent it should be afforded very limited weight', 61)}. Worcester City: ${q(SRC.worcester, 'No such material inconsistency has been identified in respect of the policies relied upon', 8)}. Tonbridge and Malling at Town Hill, West Malling, ties its cut to a part of a policy: ${q(SRC.townHill, 'Policy CP14 attracts reduced weight insofar as it seeks to apply a restrictive approach to development outside settlements', 6)}. Stratford's template gives CS.15, CS.16 and AS.10 very limited weight in a paragraph that does not say which part of which policy conflicts; see <a href="/research/authority/stratford-dc/core-strategy-weight/">which Core Strategy policies keep their weight</a>.</p>
<h3>The Annex B settlement test applied to a cluster</h3>
<p>Wychavon at Pinvin quotes the definition and concludes that the site ${q(SRC.pinvin, 'is not considered within a settlement as defined within the NPPF. Therefore, in this case the proposal needs to be assessed against Policy S5', 6)}. Malvern Hills at Shoulton Lane, Hallow: ${q(SRC.hallow, 'The fact that the site is associated with an existing residential cluster does not, in itself, mean that it forms part of the settlement', 6)}. Every South Worcestershire officer facing a cluster with no boundary held it not to be a settlement and ran S5. Stratford at Ardens Grafton held a hamlet with no boundary to be a settlement so that S4 applied.</p>
</section>`;

const repeat = `<section id="repeat"><h2>Where other councils repeat Stratford</h2>
<p><strong>Warwick</strong> is Stratford's twin. At Norton Lindsey the committee report says ${q(SRC.nortonLindsey, 'The site is washed over by Green Belt and is located within the Infill Village', 1)} boundary, then opens the principle section with ${q(SRC.nortonLindsey, 'Policy S4 states that development proposals within settlements should be approved unless', 3)} the benefits are substantially outweighed. It never mentions S5(5) or the Annex B definition, and it passes GB7(1)(g)(iii) in one sentence:</p>
${quote(SRC.nortonLindsey, 'The application site is located within the settlement boundary of Norton Lindsey, which includes a number of facilities for day to day living and therefore the proposal is considered to be in compliance with Policy TR3 of the Framework', report('Warwick', 'W/26/0066', 5), 5)}
<p>No footway, distance, bus or cycling fact appears anywhere in the report. Warwick's own Local Plan has a policy numbered TR3, on parking, so every Warwick report mentions "TR3" while the Framework policy goes unreasoned. Cubbington W/25/1088 was issued on 7 October 2026 on a report written to the 2024 Framework in April, with no re-anchoring.</p>
<p><strong>North Hertfordshire</strong> at Pirton (50 homes, granted) is the tier shorthand at scale: the site adjoins a ${q(SRC.pirton, 'Category A village', 8)} and ${q(SRC.pirton, 'The development is considered a logical extension of the village', 28)}, with no bus stop distance, frequency, footway or walking distance in the report, and the conversion update maps the 2024 paragraphs ${q(SRC.pirtonUpdate, 'Paragraphs 110, 115, 116', 3)} to TR6 alone, dropping TR3. At New Pound Farm, Hitchin, a Green Belt plot is supported because ${q(SRC.newPound, 'the provision of a dwelling on a windfall site outside of a settlement would be supported by Policy S4 (j. i.) of the NPPF', 6)}, which is S5(1)(j) under the wrong name on a site where neither applies.</p>
<p><strong>Basildon</strong> at Pound Lane opens with ${q(SRC.poundLane, 'The principle of development within settlements is set out in policy S4 of the NPPF', 22)} for a washed-over Plotlands site, although GB7(1)(g) is then run in full.</p>
<p><strong>Malvern Hills</strong> assesses routes candidly and then approves against its own finding. At Brookfield, Shoulton Lane, the officer records the Highway Authority's view that ${q(SRC.hallow, 'the site occupies an inherently unsustainable location', 2)}, finds that ${q(SRC.hallow, 'The application site has no established public footpath directly serving it and is not provided with street lighting', 7)}, and grants permission in principle on ${q(SRC.hallow, 'a reasonable case that it constitutes previously developed land', 12)}. The rubric scores that <code>ok</code> on the tier column because it tests method, not result; a column for "approved against the officer's own route finding" would catch it.</p>
</section>`;

const audit = `<section id="audit"><h2>What the comparison does to the Stratford findings</h2>
<h3>Readings that hold</h3>
<ul>
<li><strong>Annex B and washed-over villages.</strong> The government's response to the consultation on the Framework says the definition was amended ${q(SRC.govResponse, 'to address how the definition applies to villages within the Green Belt', 34)}. No officer outside Stratford and Warwick applied S4 in a washed-over village. The sample is thin, because washed-over villages are rare outside the two districts (${washedOverOther} rows elsewhere), but the reading stands.</li>
<li><strong>S5(5) and the Green Belt route.</strong> Bromsgrove, Dacorum, Elmbridge, Three Rivers and Bath and North East Somerset reports all state it.</li>
<li><strong>DP3(3) as a "should be refused" policy.</strong> Wychavon, Elmbridge, Cheshire East and Tonbridge and Malling officers quote or paraphrase it as one; so do the inspectors on the <a href="${DP3}">DP3 page</a>.</li>
<li><strong>Annex A(1), no transition.</strong> Every council in the sample converted or re-anchored its reports. The three unconverted notices elsewhere (${unconvertedOther.map((r) => `${esc(r.council)} ${esc(r.ref)}`).join(', ')}) are the same defect the Stratford table records four times.</li>
<li><strong>Annex A(2) cuts parts, not policies.</strong> The government's response says the wording was changed ${q(SRC.govResponse, 'to address concerns that entire policies could be given limited weight based on partial inconsistency', 136)}. The template paragraph remains a real point, though the other reading, that S5(1)(j) displaces settlement-based restraint policies wholesale, has reputable support and the paragraph is defensible as a position.</li>
</ul>
<h3>Counts that were too hard</h3>
<p><strong>TR3 "not mentioned" includes small schemes.</strong> Officers and inspectors both treat a single dwelling or a handful of homes as below the TR3(1)(a) threshold. Bromsgrove at Fairfield: ${q(SRC.fairfield, 'The development would not generate significant amounts of movement being one dwelling. The site is therefore considered sustainable', 3)}. Inspectors say the same for small schemes and the opposite for larger ones:</p>
${letter('6005162', 'Having examined the proposal, as a single dwelling, I do not consider that it would result in a significant amount of movement, given its location at the edge of the village of Burnham.', 23, 'one self-build home')}
${letter('6009593', 'In this case, however, the development would not generate a significant amount of movement, given its small scale and the relatively short travel distances to a suitable range of services and facilities.', 19)}
${letter('6006637', 'An indicative forecast for vehicle trip generation has been prepared, with the proposed 28 dwellings expected to generate around 12 vehicle movements in the morning peak hour, nine in the evening peak hour, and around 112 movements per day overall.', 28, 'TR3 applied and the appeal dismissed', 'Hatton Station')}
<p>Split by scheme size, the picture is this (the count of homes is the largest number the application proposes; reports creating no new homes sit in the second row):</p>
${tr3SplitTable}
<p>For five homes or fewer the two rates are close (${pct(s.tr3.small.notRun, s.tr3.small.n)}% against ${pct(o.tr3.small.notRun, o.tr3.small.n)}%), and the threshold point explains much of both. For six homes or more, where the threshold is not in doubt, Stratford's rate is ${pct(s.tr3.big.notRun, s.tr3.big.n)}% against ${pct(o.tr3.big.notRun, o.tr3.big.n)}%: Home Farm, Southam (217 homes), Alcester Road (65), Checketts Abattoir (7), the Pillerton Hersey showpeople site (7 plots) and Kineton (6) do not mention the policy, Harbury (38) names it without running it, and Stockton (75) names it and answers a different question. The Stratford table's <code>dodged</code> code for Ravenstone, three homes, labels a mainstream position as an evasion: ${q('case:stratford-26-00410-FUL', 'In respect of NDMP TR3(a), the development would not generate a significant amount of movement', 13)} is the view inspectors take of schemes that size. It should read "threshold not met".</p>
<p><strong>DP3(3) "not asked" on a refusal is formal.</strong> Where the design conflict is itself a refusal reason, the missing step could not change the outcome. Split by what the officer recommended:</p>
${dp3SplitTable}
<p>The finding that survives is the first row. Stratford officers recommended approval after a found design conflict, without asking whether it was clearly justified, in ${s.dp33.grant} reports; across ${councils.length} other councils the count is ${o.dp33.grant} (Malvern Hills at Leigh Sinton, Elmbridge at Moore Place and Dacorum at Polehanger). Part of that gap is composition: other officers more often find no conflict, or refuse. Two readings also need stating. The Stratford table treats a conflict with a landscape or character policy as a DP3 conflict; Elmbridge and Dacorum treat it as harm to weigh under N2, and either reading is arguable. And a weighing can itself be a clear-justification finding where the harm is slight; the cases where the omission could change the result are those where the harm was found significant and the scheme was still recommended, as at Snitterfield, Ladbroke and Pillerton Priors.</p>
<p><strong>The Connectivity Tool is a shared absence.</strong> The other councils used it in ${o.tool.yes} of ${o.n} reports, all from ${toolCouncils.length} councils' templates. "Used in none of the 44" is a fair fact about Stratford, but not a Stratford fault. TR3(2) is one input to the location judgement, not a gate.</p>
<p><strong><code>partial</code> is a wide band.</strong> It covers Tredington, where the only transport fact is that occupants ${q(SRC.tredington, 'would have access to a local bus service allowing residents to travel to nearby settlements', 11)}, and Town Hill, West Malling, with ${q(SRC.townHill, 'bus stops located immediately adjacent to the site, West Malling High Street approximately 700m away, and West Malling railway station around 1.4km distant', 12)}. Most of Stratford's ${s.tier.partial} are the first kind; most of the other councils' ${o.tier.partial} are the second.</p>
<p><strong>The tier code measures drafting, not the inspectors' rule.</strong> Inspectors have <a href="${SERVICE_VILLAGE}">cited a tier inside an allowed location finding</a>, always alongside a daily bus, lit footways or an urban setting. The reports coded <code>error</code> give no route fact at all, which is what the code should be read as: tier or facilities list as the whole location finding.</p>
<h3>One finding is strengthened</h3>
<p>Approvals recommended after a found design conflict with no clear-justification question: ${s.dp33.grant} at Stratford, ${o.dp33.grant} across ${councils.length} councils. Snitterfield, Ladbroke, Pillerton Priors and Stockton have no counterpart elsewhere except Leigh Sinton and Moore Place.</p>
</section>`;

const SET_NAMES = {
  'held-a': ['Held, Midlands', 'Every officer report or reasoned decision notice already held for Wychavon, Malvern Hills, Worcester, Bromsgrove, Warwick, Lichfield, West Northamptonshire, Nuneaton and Bedworth and Cheshire East (decisions 17 August to 23 September 2026)'],
  'held-b': ['Held, south and north', 'Every committee report already held for Basildon, Bath and North East Somerset, Chorley, Cotswold, Dacorum, East Devon, Elmbridge, Maidstone, Maldon, North Hertfordshire, Sefton, Three Rivers and Tonbridge and Malling'],
  'fetch-warwick-bromsgrove': ['Fetched: Warwick and Bromsgrove', 'Every housing-type decision on the two councils\' planning portals issued 1 September to 17 October 2026'],
  'fetch-southworcs': ['Fetched: South Worcestershire', 'Housing-type decisions issued by Wychavon, Malvern Hills and Worcester City 20 September to 17 October 2026'],
  'fetch-moderngov': ['Fetched: committee agendas', 'Every housing or Green Belt item on the planning committee agendas of Basildon, Elmbridge, North Hertfordshire, Dacorum, Chorley, Cheshire East, Tonbridge and Malling and Bath and North East Somerset, 24 September to 17 October 2026'],
};
const method = `<section id="method"><h2>Method and limits</h2>
<p>The reports were chosen as sets, not as examples, so that the comparison is not a selection of the best or worst reports elsewhere.</p>
<div class="table-wrap"><table><thead><tr><th>Set</th><th>Reports</th><th>How chosen</th></tr></thead><tbody>
${sets.map((k) => `<tr><th scope="row">${esc(SET_NAMES[k][0])}</th><td>${O.filter((r) => r.scored_in === k).length}</td><td>${esc(SET_NAMES[k][1])}</td></tr>`).join('\n')}
</tbody></table></div>
<p>${o.n} scored reports from ${councils.length} councils: ${o.committee} committee and ${o.n - o.committee} delegated, ${o.greenBelt} on Green Belt sites. Stratford: ${s.n} reports, ${s.committee} committee and ${s.n - s.committee} delegated, ${s.greenBelt} Green Belt. The closest analogues to Stratford are Warwick and Bromsgrove (the same Green Belt arc, villages washed over by the Green Belt, delegated reports) and the South Worcestershire councils (a Category 1 to 3 village hierarchy, no Green Belt).</p>
<ul>
<li><strong>The rubric tests method, not result.</strong> A report that assesses the route and then approves against its own finding scores <code>ok</code>. A report that reaches the right answer by the wrong route scores <code>error</code>.</li>
<li><strong>Committee reports are larger schemes.</strong> Design is often reserved and location argued from a transport assessment, which lowers the other councils' TR3 and DP3(3) error rates. The fair comparators for Stratford's delegated habit are Warwick, Bromsgrove and South Worcestershire: Warwick repeats the pattern, Bromsgrove and Wychavon do not.</li>
<li><strong>Washed-over villages are rare in the sample</strong> outside Stratford and Warwick, so the Annex B comparison rests on few cases.</li>
<li><strong>The template-weight comparison is partly a supply artefact.</strong> The South Worcestershire councils claimed a five-year supply until October 2026 and give the hierarchy full weight; the councils that cut weight are short of supply.</li>
<li><strong>Outcomes are missing</strong> for the Elmbridge and Dacorum October committees, whose minutes were not published when the reports were scored, and three Warwick and Bromsgrove files had no notice or no report.</li>
<li><strong>Checking.</strong> Each set was scored by a separate pass with the shared rubric, and each pass checked its own quotations against the text extracted from the PDF. Every quotation on this page is checked again, with its page number, when the page is built, and every count on the page is computed from the two tables when it is built.</li>
</ul>
</section>`;

const extraCss = `<style>.table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:8px;background:var(--surface)}table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;vertical-align:top;padding:8px 10px;border-top:1px solid var(--line)}thead th{border-top:0;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);background:var(--surface-2)}tbody th{font-weight:600}thead th small{display:block;font-weight:400;letter-spacing:0;text-transform:none}table.councils td,table.councils th{white-space:nowrap}tr.sdc{background:var(--accent-soft)}
section>ol,section>ul,.rule ul{margin:0;padding-left:20px;display:grid;gap:8px;max-width:72ch}section>ol>li,section>ul>li,.rule li{font-size:15.5px}h3{font:600 17px/1.35 var(--sans);margin-top:8px}code{font:500 .9em var(--mono);color:var(--accent)}</style>`;

const html = page({
  title: 'Officer Reports Compared Across Councils',
  description: `Do other councils make the four errors found in Stratford-on-Avon's officer reports under the August 2026 NPPF? ${o.n} reports from ${councils.length} councils scored with the same rubric: the tier error ${pct(o.tier.error, o.tier.n)}% against ${pct(s.tier.error, s.tier.n)}%, the Green Belt route error ${pct(o.annexb.error, o.annexb.n)}% against ${pct(s.annexb.error, s.annexb.n)}%, approval recommended after an unaddressed design conflict ${o.dp33.grant} times against ${s.dp33.grant}. Warwick repeats the pattern; Bromsgrove and Wychavon do not. Every quotation checked.`,
  url: URL,
  breadcrumb: `<a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/authority/">Local planning authorities</a> › Officer reports compared`,
  h1: 'Do other councils make Stratford\'s four errors? Officer reports from 22 councils under the 2026 NPPF',
  dek: `The <a href="${STRATFORD}">Stratford note</a> found four recurring errors in Stratford-on-Avon District Council's officer reports. This page scores ${o.n} reports from ${councils.length} other councils the same way, shows what the better reports do instead, and says which of the Stratford counts were too hard.`,
  body: extraCss + short + errors + compare + byCouncil + best + repeat + audit + method,
  sources: [
    `The two scoring tables, with a page reference and quotation for every adverse code: <a href="${GITHUB}stratford-officer-reports-four-errors.tsv">Stratford</a> (${s.n} reports, note of 13 October 2026) and <a href="${GITHUB}other-councils-four-errors-2026-10.tsv">other councils</a> (${o.n} reports, note of 18 October 2026, with the <a href="${GITHUB}other-councils-four-errors-2026-10.md">analysis note</a>).`,
    'Officer reports, update sheets, decision notices and minutes: the councils\' planning portals and committee pages, listed by URL in the other-councils table. The reports are council copyright and are held, with text extracts, in the private sources checkout; they are quoted here briefly.',
    `National Planning Policy Framework, August 2026 (Crown copyright, Open Government Licence): policies S4, S5, TR3, DP3 and GB7, Annex A and Annex B. <a href="${GOVUK_TOOL}">Connectivity Tool</a>, GOV.UK.`,
    'Government response to the consultation on the National Planning Policy Framework, August 2026 (Crown copyright), printed pages 30 and 132 (PDF pages 34 and 136).',
    `Planning Inspectorate decision letters 6005162, 6009593 and 6006637, from the <a href="/research/england/nppf-navigator/decisions/">decisions database</a>.`,
  ],
  credit: 'Planning Distilled.',
});

const out = path.join(SITE, SITE_PATH);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`wrote ${path.join(out, 'index.html')}: ${s.n} Stratford + ${o.n} other rows, ${councils.length} councils`);
console.log(`tier error ${pct(s.tier.error, s.tier.n)}% v ${pct(o.tier.error, o.tier.n)}%; annexb ${pct(s.annexb.error, s.annexb.n)}% v ${pct(o.annexb.error, o.annexb.n)}%; dp33 grant ${s.dp33.grant} v ${o.dp33.grant}; TR3 big not run ${s.tr3.big.notRun}/${s.tr3.big.n} v ${o.tr3.big.notRun}/${o.tr3.big.n}; small ${s.tr3.small.notRun}/${s.tr3.small.n} v ${o.tr3.small.notRun}/${o.tr3.small.n}`);
