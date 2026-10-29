// Four errors in officer reports under the 2026 NPPF: 243 reports from 27 councils, scored with the
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
// The council sweep of 19 to 20 October 2026, scored 28 to 29 October with the same rubric (the third table).
const W = tsv('other-councils-four-errors-sweep-2026-10.tsv');
if (S.length !== 44) throw new Error(`expected 44 Stratford rows, found ${S.length}`);
if (O.length !== 99) throw new Error(`expected 99 other-council rows, found ${O.length}`);
if (W.length !== 144) throw new Error(`expected 144 sweep rows, found ${W.length}`);
if (W.some((r) => r.scored_in !== 'sweep-2026-10')) throw new Error('every sweep row should be scored_in sweep-2026-10');
const OW = [...O, ...W];
const dup = OW.map((r) => `${r.council} ${r.ref}`).filter((k, i, a) => a.indexOf(k) !== i);
if (dup.length) throw new Error('a report is scored twice: ' + dup.join(', '));

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
function officer(o, sweep = false) {
  const s = o.toLowerCase();
  if (sweep) {
    // The sweep table writes the outcome as the decision, with the officer's recommendation in brackets where it differs.
    if (/against the officer recommendation to (permit|grant|approv)/.test(s)) return 'grant';
    if (/recommend\w* (to )?refus|recommendation to refus|minded to refuse|^refus/.test(s)) return 'refuse';
    if (/^approv|^grant|^permit|^recommended (approval|grant)|^approval recommended|^withdrawn/.test(s)) return 'grant';
    throw new Error('cannot read the officer recommendation from the sweep outcome: ' + o);
  }
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
  st.dp33.grant = dpErr.filter((r) => officer(r.outcome, r.scored_in === 'sweep-2026-10') === 'grant').length;
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
  // TR3 where a sustainable-location decision is made (every row scored on the tier column): applied in terms
  // (a limb of TR3(1) run with facts, or GB7(1)(g)(iii) answered in TR3's words), and in substance (the
  // location decided on the route and the transport choice). Green Belt sites are shown separately because
  // GB7(1)(g)(iii) asks the question whatever the scale.
  const isGB = (r) => ['yes', 'part'].includes(code(r.green_belt));
  const loc = (sel) => {
    const rs = scored('tier').filter(sel);
    const applied = rs.filter((r) => code(r.tr3) === 'assessed').length;
    return { n: rs.length, applied, notApplied: rs.length - applied, route: rs.filter((r) => code(r.tier) === 'ok').length };
  };
  st.loc = loc(() => true);
  st.loc.gb = loc(isGB);
  st.loc.other = loc((r) => !isGB(r));
  return st;
}
const s = stats(S);
const o = stats(O);
const w = stats(W);
const all = stats(OW);
const councils = [...new Set(O.map((r) => r.council))].sort();
const perCouncil = councils.map((c) => ({ council: c, ...stats(O.filter((r) => r.council === c)) }));
const sweepCouncils = [...new Set(W.map((r) => r.council))].sort();
const allCouncils = [...new Set(OW.map((r) => r.council))].sort();
const newCouncils = sweepCouncils.filter((c) => !councils.includes(c));
const perCouncilAll = allCouncils.map((c) => ({ council: c, ...stats(OW.filter((r) => r.council === c)) }));
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
const warwick = perCouncilAll.find((c) => c.council === 'Warwick');
expect(warwick && warwick.tier.error >= 2, 'Warwick has at least two tier errors');
const noTierError = perCouncilAll.filter((c) => c.tier.n >= 2 && c.tier.error === 0).map((c) => c.council);
const tierErrorCouncils = perCouncilAll.filter((c) => c.tier.error > 0).map((c) => `${c.council} (${c.tier.error} of ${c.tier.n})`);
const joinAnd = (xs) => xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
const bromsgrove = perCouncilAll.find((c) => c.council === 'Bromsgrove');
expect(bromsgrove && bromsgrove.tier.error === 1, `Bromsgrove has one tier error (now ${bromsgrove && bromsgrove.tier.error})`);
const templateCouncils = perCouncilAll.filter((c) => c.template > 0).map((c) => `${c.council}${c.template > 1 ? ` (${c.template})` : ''}`);
const toolCouncils = perCouncilAll.filter((c) => c.tool.yes > 0).map((c) => `${c.council} (${c.tool.yes})`);
const toolCouncilsHand = perCouncil.filter((c) => c.tool.yes > 0).map((c) => `${c.council} (${c.tool.yes})`);
const unconvertedOther = O.filter((r) => ['2024', '2024-unconverted'].includes(code(r.framework)));
expect(s.tr3.big.n === 8 && s.tr3.big.nm === 5 && s.tr3.big.cited === 1, `the Stratford six-plus-home TR3 rows are 5 not mentioned, 1 cited only of 8 (now ${s.tr3.big.nm}/${s.tr3.big.cited}/${s.tr3.big.n})`);
expect(pct(s.loc.applied, s.loc.n) < pct(o.loc.applied, o.loc.n) && pct(s.loc.applied, s.loc.n) < pct(all.loc.applied, all.loc.n), 'Stratford applies TR3 to fewer of its location decisions than the other councils');
expect(2 * pct(s.loc.route, s.loc.n) < pct(all.loc.route, all.loc.n), 'the other councils decide the location on the route more than twice as often as Stratford');
expect(pct(s.loc.gb.applied, s.loc.gb.n) < pct(all.loc.gb.applied, all.loc.gb.n), 'Stratford applies TR3 to fewer of its Green Belt location decisions');
expect(unconvertedOther.length === 3, `three unconverted 2024 reports elsewhere (now ${unconvertedOther.length})`);
const washedOverOther = O.filter((r) => code(r.washed_over) === 'yes').length;
const washedOverAll = OW.filter((r) => code(r.washed_over) === 'yes').length;
// Facts the enlarged-set prose states.
expect(newCouncils.length === 5 && allCouncils.length === 27, `five new councils, 27 in all (now ${newCouncils.length}, ${allCouncils.length})`);
expect(pct(s.tier.error, s.tier.n) > 2 * pct(all.tier.error, all.tier.n), 'Stratford makes the tier error more than twice as often as the enlarged set');
expect(pct(s.annexb.error, s.annexb.n) > 2 * pct(all.annexb.error, all.annexb.n), 'Stratford makes the Annex B error more than twice as often as the enlarged set');
expect(s.template / s.n > 3 * (all.template / all.n), 'the template paragraph is at least three times as common at Stratford as in the enlarged set');
expect(s.dp33.grant > all.dp33.grant, 'Stratford alone has more grant-after-conflict reports than the 27 councils together');
expect(w.dp33.refuse > w.dp33.grant, 'most sweep DP3(3) errors are refusals');
const sweepGB = W.filter((r) => code(r.green_belt) === 'yes');
const sweepTemplateCouncils = [...new Set(W.filter((r) => code(r.template_weight) === 'yes').map((r) => r.council))].sort();
const sweepToolCouncils = [...new Set(W.filter((r) => code(r.connectivity_tool) === 'yes').map((r) => r.council))].sort();
const sweepUnconverted = W.filter((r) => ['2024', '2024-unconverted'].includes(code(r.framework)));
const sweepAnnexBErrors = W.filter((r) => code(r.annexb) === 'error');
const sweepTierErrors = W.filter((r) => code(r.tier) === 'error');
const sweepGrantErrors = W.filter((r) => code(r.dp33) === 'error' && officer(r.outcome, true) === 'grant');

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
  // The council sweep (sources:council/sweep/<council>/<ref>/)
  oddington: 'sources:council/sweep/cotswold/26-02330-PLP/CASE OFFICER DELEGATED REPORT-26_02330_PLP-CASE_OFFICER_DELEGATED_REPORT-2414622.txt',
  ryarsh: 'sources:council/sweep/tonbridge-malling/26-00914-FL/OFFICER REPORT-26_00914_FL-OFFICER_REPORT-1897258.txt',
  longMelford: 'sources:council/sweep/babergh-mid-suffolk/DC-26-01548/OFFICER DELEGATED REPORT-DC_26_01548-OFFICER_DELEGATED_REPORT-9176492.txt',
  brockhampton: 'sources:council/sweep/cotswold/25-03306-FUL/CASE OFFICER DELEGATED REPORT-25_03306_FUL-CASE_OFFICER_DELEGATED_REPORT-2398989.txt',
  salisbury: 'sources:council/sweep/tonbridge-malling/26-01263-FL/DELEGATED REPORT-26_01263_FL-DELEGATED_REPORT-1898281.txt',
  hobsMoat: 'sources:council/sweep/solihull/PL-2026-01160-PPFL/DELEGATED REPORT-PL_2026_01160_PPFL-DELEGATED_REPORT-2522719.txt',
  peartree: 'sources:council/sweep/solihull/PL-2024-01597-PPFL/LPA REPORT-PL_2024_01597_PPFL-LPA_REPORT-2521309.txt',
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
    `error ${all.tier.error}, partial ${all.tier.partial}, ok ${all.tier.ok} of ${all.tier.n}<br>error ${pct(all.tier.error, all.tier.n)}%; error or partial ${pct(all.tier.notRun, all.tier.n)}%`,
    `A Stratford habit, shared by ${joinAnd(tierErrorCouncils)}. Bromsgrove's one is a three-page notice with no report behind it. ${noTierError.length} councils with two or more location reports have no tier error at all.`],
  ['TR3 not applied where a sustainable-location decision is made', `${s.loc.notApplied} of ${s.loc.n} location decisions<br>${pct(s.loc.notApplied, s.loc.n)}%; location decided on the route in ${s.loc.route} (${pct(s.loc.route, s.loc.n)}%)<br>Green Belt sites: TR3 applied in ${s.loc.gb.applied} of ${s.loc.gb.n}`,
    `${all.loc.notApplied} of ${all.loc.n} location decisions<br>${pct(all.loc.notApplied, all.loc.n)}%; location decided on the route in ${all.loc.route} (${pct(all.loc.route, all.loc.n)}%)<br>Green Belt sites: TR3 applied in ${all.loc.gb.applied} of ${all.loc.gb.n}`,
    `The measure for the complaint's second head: where a report has to decide whether the location is sustainable, does it apply TR3? Naming the policy is uncommon everywhere, but the other councils decide the location on the route in ${pct(all.loc.route, all.loc.n)}% of those reports against Stratford's ${pct(s.loc.route, s.loc.n)}%, and apply TR3 in terms on ${pct(all.loc.gb.applied, all.loc.gb.n)}% of Green Belt sites, where GB7(1)(g)(iii) asks for it, against Stratford's ${pct(s.loc.gb.applied, s.loc.gb.n)}%.`],
  ['TR3 not run, raw count of all reports', `not mentioned ${s.tr3.nm}, cited only ${s.tr3.cited}, dodged ${s.tr3.dodged}, assessed ${s.tr3.assessed} of ${s.tr3.n}<br>not run ${pct(s.tr3.notRun, s.tr3.n)}%`,
    `not mentioned ${all.tr3.nm}, cited only ${all.tr3.cited}, dodged ${all.tr3.dodged}, assessed ${all.tr3.assessed} of ${all.tr3.n}<br>not run ${pct(all.tr3.notRun, all.tr3.n)}%`,
    'Common everywhere and not a fair measure on its own: it counts small schemes and reports written to the 2024 Framework. The row above is the measure used; the size split is below.'],
  ['Connectivity Tool used', `${s.tool.yes} of ${s.n}`, `${all.tool.yes} of ${all.n}${all.tool.indirect ? `, plus ${all.tool.indirect} indirect` : ''}<br>${toolCouncils.join(', ')}`,
    'Absent almost everywhere. Where it appears it is one team\'s template.'],
  ['Annex B and the Green Belt route', `error ${s.annexb.error} of ${s.annexb.n} Green Belt or hamlet cases<br>${pct(s.annexb.error, s.annexb.n)}%`,
    `error ${all.annexb.error} of ${all.annexb.n}<br>${pct(all.annexb.error, all.annexb.n)}%`,
    'Stratford and Warwick apply S4 or S5(1)(j) in washed-over villages. Elsewhere most of the errors are belt-and-braces runs of S5 before S5(5) is applied; only Basildon and North Hertfordshire change the route.'],
  ['DP3(3) not asked after a design conflict', `error ${s.dp33.error} of ${s.dp33.n}<br>${pct(s.dp33.error, s.dp33.n)}%; ${s.dp33.grant} of the errors recommend grant`,
    `error ${all.dp33.error} of ${all.dp33.n}<br>${pct(all.dp33.error, all.dp33.n)}%; ${all.dp33.grant} of the errors recommend grant`,
    'The clearest Stratford outlier, partly a composition effect: other officers rarely find a design conflict and then recommend approval.'],
  ['2024 Framework applied without conversion', `${s.unconverted} of ${s.n}`, `${all.unconverted} of ${all.n}`,
    `Rare at Stratford and in the hand-read set; the sweep found ${sweepUnconverted.length} more, most of them notices issued on 2024 or 2025 committee resolutions once a legal agreement was signed. The same defect as Stratford\'s Checketts Abattoir.`],
  ['Template paragraph cutting the hierarchy policies to very limited weight', `${s.template} of ${s.n}<br>${pct(s.template, s.n)}%`, `${all.template} of ${all.n}<br>${pct(all.template, all.n)}%<br>${templateCouncils.join(', ')}`,
    `A Stratford peculiarity in form. The other ${templateCouncils.length} councils cut hierarchy policies on five-year-supply or age grounds, the 2024 logic that Annex A(2) also does not allow.`],
];
const compareTable = `<div class="table-wrap"><table><thead><tr><th>Error</th><th>Stratford (${s.n} reports)</th><th>${allCouncils.length} other councils (${all.n} reports)</th><th>Reading</th></tr></thead><tbody>
${compareRows.map(([a, b, c, d]) => `<tr><th scope="row">${a}</th><td>${b}</td><td>${c}</td><td>${d}</td></tr>`).join('\n')}
</tbody></table></div>`;

const cell = (c) => `${c.error}/${c.partial ?? ''}${c.partial !== undefined ? '/' : ''}${c.ok}`;
const councilTable = `<div class="table-wrap"><table class="councils"><thead><tr><th>Council</th><th>Reports</th><th>Tier<br><small>error / partial / ok</small></th><th>TR3<br><small>not mentioned / cited only / dodged / assessed</small></th><th>Tool</th><th>Annex B<br><small>error / ok</small></th><th>DP3(3)<br><small>error / ok</small></th><th>2024 unconverted</th><th>Template</th></tr></thead><tbody>
${[...perCouncilAll, { council: 'Stratford-on-Avon', ...s, bold: true }].map((c) => {
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


// ---- The two charts: a dumbbell of the five rates, and a per-council strip ----
// Positioned by percentage in HTML so the labels stay readable at phone width.
const rate = (c, k, n) => ({ v: pct(c[k], c[n] ?? c.n), num: c[k], den: c[n] ?? c.n });
const dumbbellRows = [
  ['Settlement tier used as the location test', ['tier', 'error', 'n']],
  ['Tier used, counting "partial" (a tier finding with one route fact beside it)', ['tier', 'notRun', 'n']],
  ['TR3 not applied where a sustainable-location decision is made', ['loc', 'notApplied', 'n']],
  ['Green Belt route: S4 or S5(1)(j) applied in a washed-over village or hamlet', ['annexb', 'error', 'n']],
  ['DP3(3) not asked after a found design conflict', ['dp33', 'error', 'n']],
].map(([label, [grp, k, n]]) => ({ label, s: rate(s[grp], k, n), o: rate(all[grp], k, n) }));
const axis = `<div class="db-axis" aria-hidden="true">${[0, 25, 50, 75, 100].map((x) => `<span style="left:${x}%">${x}%</span>`).join('')}</div>`;
const dumbbell = `<figure class="chart" aria-label="Rate of each error at Stratford against the other councils">
<div class="db-head"><span></span>${axis}<span class="db-vals"><span class="o">others</span><span class="s">Stratford</span></span></div>
${dumbbellRows.map(({ label, s: a, o: b }) => {
  const lo = Math.min(a.v, b.v), hi = Math.max(a.v, b.v);
  return `<div class="db-row"><div class="db-label">${esc(label)}</div><div class="db-track"><span class="db-link" style="left:${lo}%;width:${hi - lo}%"></span><span class="db-dot o" style="left:${b.v}%" title="Other councils: ${b.num} of ${b.den} reports where the question arises"></span><span class="db-dot s" style="left:${a.v}%" title="Stratford-on-Avon: ${a.num} of ${a.den} reports where the question arises"></span></div><div class="db-vals"><span class="o">${b.v}%<small>${b.num}/${b.den}</small></span><span class="s">${a.v}%<small>${a.num}/${a.den}</small></span></div></div>`;
}).join('\n')}
<figcaption>Rate of each error among the reports where the question arises. <span class="key o">${allCouncils.length} other councils, ${all.n} reports</span> <span class="key s">Stratford-on-Avon, ${s.n} reports</span>. The line is the gap.</figcaption>
</figure>`;

/** One ranked lollipop per error: each council with at least one error, by rate, with the zero-error councils named below. */
function ranked(label, grp, k) {
  const all = [...perCouncilAll, { council: 'Stratford-on-Avon', ...s, sdc: true }].filter((c) => c[grp].n > 0)
    .map((c) => ({ council: c.council, sdc: c.sdc, n: c[grp].n, num: c[grp][k], v: pct(c[grp][k], c[grp].n) }));
  const hit = all.filter((c) => c.num > 0).sort((a, b) => b.v - a.v || b.n - a.n);
  const none = all.filter((c) => c.num === 0).sort((a, b) => b.n - a.n);
  return `<div class="lp"><h4>${esc(label)}</h4>
${hit.map((c) => `<div class="lp-row${c.sdc ? ' s' : ''}"><div class="lp-name">${esc(c.council)}</div><div class="lp-track"><span class="lp-bar" style="width:${c.v}%"></span><span class="db-dot${c.sdc ? ' s' : ' o'}${c.n === 1 ? ' one' : ''}" style="left:${c.v}%" title="${esc(c.council)}: ${c.num} of ${c.n}"></span></div><div class="lp-val">${c.v}%<small>${c.num}/${c.n}</small></div></div>`).join('\n')}
<p class="lp-none"><strong>No error, ${none.length} councils:</strong> ${none.map((c) => `${esc(c.council)} (${c.n})`).join(', ')}.</p></div>`;
}
const strips = `<figure class="chart" aria-label="Each council's rate for two of the errors, ranked">
<div class="db-head lp-head"><span></span>${axis}<span></span></div>
${ranked('Tier used as the location test', 'tier', 'error')}
${ranked('DP3(3) not asked after a found design conflict', 'dp33', 'error')}
<figcaption>Every council with at least one report where the question arises, ranked by its rate; the bracket is the number of its reports scored. <span class="key o">other councils</span> <span class="key s">Stratford-on-Avon</span>. A hollow dot with a dotted ring is a council with a single scored report. The Green Belt route is not ranked this way: outside Stratford and Warwick the sample holds ${washedOverAll - 2} washed-over case${washedOverAll - 2 === 1 ? '' : 's'}.</figcaption>
</figure>`;

// ---- The page ----
const short = `<section id="in-short"><div class="rule"><h2>In short</h2><ul>
<li>The <a href="${STRATFORD}">Stratford note</a> found four recurring errors in Stratford-on-Avon District Council's officer reports under the National Planning Policy Framework (NPPF) of 17 August 2026. We scored ${all.n} reports from ${allCouncils.length} other councils with the same rubric (${o.n} read in full from ${councils.length} councils, then ${w.n} from a sweep of ${sweepCouncils.length} councils' registers) to see whether the errors are Stratford's or everyone's.</li>
<li><strong>They are mostly Stratford's.</strong> Scored the same way, the other councils rest a location finding on a village's tier in ${pct(all.tier.error, all.tier.n)}% of their location reports against Stratford's ${pct(s.tier.error, s.tier.n)}%, take the wrong route in Green Belt villages in ${pct(all.annexb.error, all.annexb.n)}% against ${pct(s.annexb.error, s.annexb.n)}%, and recommend approval after an unaddressed design conflict in ${all.dp33.grant} reports between them against Stratford's ${s.dp33.grant}. The paragraph that cuts the settlement hierarchy policies to very limited weight wholesale appears in ${pct(s.template, s.n)}% of Stratford reports and ${pct(all.template, all.n)}% of the others.</li>
<li><strong>One council repeats the pattern.</strong> Warwick District Council, which shares Stratford's Green Belt and plan structure, makes the tier error in ${warwick.tier.error} of its ${warwick.tier.n} location reports and applies S4 in a washed-over village at Norton Lindsey. Wychavon, Elmbridge and Dacorum, on comparable sites, do not, and Bromsgrove's one tier error in ${bromsgrove.tier.n} location reports is a short notice with no report behind it.</li>
<li><strong>Two of the Stratford counts are re-presented.</strong> A text search for "TR3" counts small schemes that officers and inspectors often treat as below the TR3(1)(a) threshold, and reports written to the 2024 Framework that could not name the policy. The measure used here instead asks, of every report that has to decide whether the location is sustainable, whether it applies TR3. Stratford applies it in ${s.loc.applied} of ${s.loc.n} such reports (${pct(s.loc.applied, s.loc.n)}%) against ${pct(all.loc.applied, all.loc.n)}% across the ${allCouncils.length} other councils, and decides the location on the route, with facts, in ${pct(s.loc.route, s.loc.n)}% against ${pct(all.loc.route, all.loc.n)}%. On Green Belt sites, where GB7(1)(g)(iii) asks the question ${q('nppf', 'with particular reference to policy TR3')} whatever the scale, Stratford applies TR3 in ${s.loc.gb.applied} of ${s.loc.gb.n} against ${all.loc.gb.applied} of ${all.loc.gb.n}. DP3(3) "not asked" on a refusal is a formal slip that cannot change the outcome; the finding that matters is the ${s.dp33.grant} Stratford recommendations to grant after a found design conflict, against ${o.dp33.grant} across ${councils.length} councils.</li>
<li><strong>One absence is shared.</strong> No Stratford report uses the Connectivity Tool. Nor do ${all.n - all.tool.yes} of the ${all.n} reports elsewhere.</li>
<li><strong>The reports read in full say the same on their own.</strong> Among the ${o.n} reports from ${councils.length} councils read cover to cover, the tier error runs at ${pct(o.tier.error, o.tier.n)}%, the Green Belt route error at ${pct(o.annexb.error, o.annexb.n)}%, the wholesale weight cut at ${pct(o.template, o.n)}%, and approval after an unaddressed design conflict ${o.dp33.grant} times. The <a href="#sweep">sweep set</a> of ${w.n} reports, read through keyed passages, gives ${pct(w.tier.error, w.tier.n)}%, ${pct(w.annexb.error, w.annexb.n)}%, ${pct(w.template, w.n)}% and ${w.dp33.grant}.</li>
</ul></div></section>`;

const errors = `<section id="errors"><h2>The four errors</h2>
<p>The Stratford note scored every officer report held for a decision made, or a committee item published, from 17 August 2026 against four errors. The same rubric, with the same codes, was applied to the other councils' reports. Each error is a step the Framework asks for and the report leaves out.</p>
<ol>
<li><strong>A village's tier used as the location test.</strong> The report treats the village's place in the settlement hierarchy, or a list of its facilities, as showing that the location is sustainable, instead of assessing the route and the transport choice. The Framework's test is in TR3(1)(a): development that ${q('nppf', 'could generate a significant amount of movement')} should be in a location that will ${q('nppf', 'limit the need to travel, particularly by private car, and offer a genuine choice of transport modes for residents and users')}. <a href="${SERVICE_VILLAGE}">Service village does not mean sustainable</a> sets out how inspectors apply it.</li>
<li><strong>TR3 not assessed.</strong> The report does not run the limbs of TR3(1), and does not use the evidence TR3(2) asks for: ${q('nppf', 'The Connectivity Tool (Connectivity Tool - GOV.UK) should be used alongside other relevant quantitative or qualitative evidence in assessing the connectivity of particular locations proposed for development')}. The question arises wherever the report has to decide whether the location is sustainable: for a Green Belt site taken through GB7(1)(g), whose limb (iii) asks whether ${q('nppf', 'The development would be in a sustainable location, with particular reference to policy TR3 of this Framework')}, whatever the scale; for a site outside a settlement, where S5(1)(j) asks whether it is ${q('nppf', 'physically well-related to an existing settlement')} and S5(4) weighs the effect ${q('nppf', 'in relation to promoting sustainable patterns of movement')}; and for any proposal that ${q('nppf', 'could generate a significant amount of movement, in the context of the area within which they would be situated')}, which inspectors have found at one to five homes in a village or an open rural setting. <a href="${SUSTAINABLE}">How to assess a sustainable location</a> explains the test and the Tool.</li>
<li><strong>Annex B and the Green Belt route.</strong> Annex B's definition of a settlement says settlements ${q('nppf', 'do not include hamlets and scattered groups of houses located outside predominantly built-up areas')} and ${q('nppf', 'also exclude villages which lie within and are defined as part of the Green Belt in the development plan')}. S5(5) says S5 ${q('nppf', 'does not apply to development proposals in the Green Belt')}. The error is applying S4 or S5(1)(j) in a washed-over village or a hamlet, or using a built-up area boundary or a tier as the GB7(1)(g)(iii) test. See <a href="${SETTLEMENT}">What is a "settlement"?</a></li>
<li><strong>DP3(3) not asked.</strong> A design or character conflict is found and weighed in the balance, but the DP3(3) question is not asked: proposals ${q('nppf', 'should be refused if, without clear justification, they conflict with paragraph 1 of this policy or relevant aspects of the principles in paragraph 2')}. S4(2)(c) and S5(2) make a failure under such a policy a case where the benefits are ${q('nppf', 'likely to be substantially outweighed')}. See <a href="${DP3}">DP3: the design policy</a>.</li>
</ol>
<p>Two further columns record whether the report applied the 2024 Framework without conversion after 17 August 2026, which Annex A(1) does not allow (the 2026 policies ${q('nppf', 'must be taken into account in decision-making from the day of its publication')}), and whether it carries a template paragraph giving the plan's settlement hierarchy policies very limited weight wholesale, where Annex A(2) cuts weight only from policies ${q('nppf', '(or parts of those policies) which are materially inconsistent with national decision-making policies')}.</p>
<p>Codes: <code>error</code>; <code>partial</code> for a tier finding with some route fact beside it; <code>cited-only</code> and <code>dodged</code> for TR3 named but not run; <code>ok</code>; <code>na</code> where the question does not arise. Rates below are among the reports where the question arises. The <a href="${GITHUB}other-councils-four-errors-2026-10.tsv">table of the ${o.n} hand-read other-council reports</a>, the <a href="${GITHUB}other-councils-four-errors-sweep-2026-10.tsv">sweep table</a> of ${w.n} and the <a href="${GITHUB}stratford-officer-reports-four-errors.tsv">Stratford table</a> carry a page reference and a verbatim quotation for every adverse code, and every "not mentioned" is a text search with no hits.</p>
</section>`;

const compare = `<section id="comparison"><h2>The comparison</h2>
${dumbbell}
${compareTable}
<p>The three tables were scored with one written rubric; ${o.n} of the other councils' reports were read in full and ${w.n} through keyed passages, as <a href="#sweep">the sweep section</a> explains. The Stratford reports are mostly delegated reports on one to seven homes in villages; the other councils' reports are a mix of delegated reports and committee reports on larger schemes, which matters for TR3 and DP3(3) and is taken up below. Rates for the other councils are also pulled down by their urban reports, where the tier, Annex B and route questions do not arise and are coded <code>na</code> on both sides.</p>
</section>`;

const byCouncil = `<section id="by-council"><h2>Council by council</h2>
${strips}
<p>Counts exclude <code>na</code> rows. Small counts are small: ${perCouncilAll.filter((c) => c.n <= 2).length} of the ${allCouncils.length} councils are represented by one or two reports, because that is what their committees decided in the period.</p>
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
<p>This section works from the ${o.n} reports from ${councils.length} councils that were read in full, where every passage could be checked; <a href="#sweep">the sweep section</a> runs the same checks on the enlarged set.</p>
<h3>Readings that hold</h3>
<ul>
<li><strong>Annex B and washed-over villages.</strong> The government's response to the consultation on the Framework says the definition was amended ${q(SRC.govResponse, 'to address how the definition applies to villages within the Green Belt', 34)}. No officer outside Stratford and Warwick applied S4 in a washed-over village. The sample is thin, because washed-over villages are rare outside the two districts (${washedOverOther} rows elsewhere), but the reading stands.</li>
<li><strong>S5(5) and the Green Belt route.</strong> Bromsgrove, Dacorum, Elmbridge, Three Rivers and Bath and North East Somerset reports all state it.</li>
<li><strong>DP3(3) as a "should be refused" policy.</strong> Wychavon, Elmbridge, Cheshire East and Tonbridge and Malling officers quote or paraphrase it as one; so do the inspectors on the <a href="${DP3}">DP3 page</a>.</li>
<li><strong>Annex A(1), no transition.</strong> Every council in the sample converted or re-anchored its reports. The three unconverted notices elsewhere (${unconvertedOther.map((r) => `${esc(r.council)} ${esc(r.ref)}`).join(', ')}) are the same defect the Stratford table records four times.</li>
<li><strong>Annex A(2) cuts parts, not policies.</strong> The government's response says the wording was changed ${q(SRC.govResponse, 'to address concerns that entire policies could be given limited weight based on partial inconsistency', 136)}. The template paragraph remains a real point, though the other reading, that S5(1)(j) displaces settlement-based restraint policies wholesale, has reputable support and the paragraph is defensible as a position.</li>
</ul>
<h3>Counts that were too hard</h3>
<p><strong>TR3 "not mentioned" includes small schemes, so the count is re-based.</strong> Officers and inspectors often treat a single dwelling or a handful of homes as below the TR3(1)(a) threshold. Bromsgrove at Fairfield: ${q(SRC.fairfield, 'The development would not generate significant amounts of movement being one dwelling. The site is therefore considered sustainable', 3)}. Inspectors say the same for small schemes and the opposite for larger ones:</p>
${letter('6005162', 'Having examined the proposal, as a single dwelling, I do not consider that it would result in a significant amount of movement, given its location at the edge of the village of Burnham.', 23, 'one self-build home')}
${letter('6009593', 'In this case, however, the development would not generate a significant amount of movement, given its small scale and the relatively short travel distances to a suitable range of services and facilities.', 19)}
${letter('6006637', 'An indicative forecast for vehicle trip generation has been prepared, with the proposed 28 dwellings expected to generate around 12 vehicle movements in the morning peak hour, nine in the evening peak hour, and around 112 movements per day overall.', 28, 'TR3 applied and the appeal dismissed', 'Hatton Station')}
<p>The threshold is set ${q('nppf', 'in the context of the area within which they would be situated')}, not by a number, and inspectors have found it met by very small schemes in villages and open country:</p>
${letter('6011301', 'set against the size of Bournheath up to 5 dwellings would be a significant amount of movement', 10, 'a Green Belt village with three pubs', 'Bournheath')}
${letter('6007428', 'that increase would be noticeable in the context of this lightly developed rural location', 14, 'one to three homes', 'Halsall')}
${letter('6009966', 'must be read as a whole', 27, 'up to five homes; TR3(1)(a) weakly engaged, the policy still breached', 'South Nutfield')}
<p>So "not mentioned" is a weak finding on its own, and the comparison above does not rest on it. It asks instead, of every report that has to decide whether the location is sustainable (every row scored on the tier column), whether TR3 is applied in terms, that is a limb of TR3(1) run with facts or GB7(1)(g)(iii) answered in its words, and whether the location is decided on the route: Stratford ${s.loc.applied} of ${s.loc.n} and ${s.loc.route} of ${s.loc.n}, the ${allCouncils.length} other councils ${all.loc.applied} of ${all.loc.n} and ${all.loc.route} of ${all.loc.n}. Split by scheme size, the raw count looks like this (the count of homes is the largest number the application proposes; reports creating no new homes sit in the second row):</p>
${tr3SplitTable}
<p>For five homes or fewer the two rates are close (${pct(s.tr3.small.notRun, s.tr3.small.n)}% against ${pct(o.tr3.small.notRun, o.tr3.small.n)}%), and the threshold point explains much of both. For six homes or more, where the threshold is not in doubt, Stratford's rate is ${pct(s.tr3.big.notRun, s.tr3.big.n)}% against ${pct(o.tr3.big.notRun, o.tr3.big.n)}%: Home Farm, Southam (217 homes), Alcester Road (65), Checketts Abattoir (7), the Pillerton Hersey showpeople site (7 plots) and Kineton (6) do not mention the policy, Harbury (38) names it without running it, and Stockton (75) names it and answers a different question. The Stratford table's <code>dodged</code> code for Ravenstone, three homes, labels as an evasion a position that is mainstream for a scheme of that size outside the Green Belt: ${q('case:stratford-26-00410-FUL', 'In respect of NDMP TR3(a), the development would not generate a significant amount of movement', 13)} is the view inspectors often take of schemes that size. Ravenstone is a grey belt case under GB7(1)(g), though, and limb (iii) asks whether the site is in a sustainable location with particular reference to TR3 however small the scheme. Saying the scheme is too small for TR3 does not answer that question; the report still has to assess the route and the transport choice.</p>
<p><strong>DP3(3) "not asked" on a refusal is formal.</strong> Where the design conflict is itself a refusal reason, the missing step could not change the outcome. Split by what the officer recommended:</p>
${dp3SplitTable}
<p>The finding that survives is the first row. Stratford officers recommended approval after a found design conflict, without asking whether it was clearly justified, in ${s.dp33.grant} reports; across ${councils.length} other councils the count is ${o.dp33.grant} (Malvern Hills at Leigh Sinton, Elmbridge at Moore Place and Dacorum at Polehanger). Part of that gap is composition: other officers more often find no conflict, or refuse. Two readings also need stating. The Stratford table treats a conflict with a landscape or character policy as a DP3 conflict; Elmbridge and Dacorum treat it as harm to weigh under N2, and either reading is arguable. And a weighing can itself be a clear-justification finding where the harm is slight; the cases where the omission could change the result are those where the harm was found significant and the scheme was still recommended, as at Snitterfield, Ladbroke and Pillerton Priors.</p>
<p><strong>The Connectivity Tool is a shared absence.</strong> The other councils used it in ${o.tool.yes} of ${o.n} hand-read reports, all from ${toolCouncilsHand.length} councils' templates. "Used in none of the 44" is a fair fact about Stratford, but not a Stratford fault. TR3(2) is one input to the location judgement, not a gate.</p>
<p><strong><code>partial</code> is a wide band.</strong> It covers Tredington, where the only transport fact is that occupants ${q(SRC.tredington, 'would have access to a local bus service allowing residents to travel to nearby settlements', 11)}, and Town Hill, West Malling, with ${q(SRC.townHill, 'bus stops located immediately adjacent to the site, West Malling High Street approximately 700m away, and West Malling railway station around 1.4km distant', 12)}. Most of Stratford's ${s.tier.partial} are the first kind; most of the other councils' ${o.tier.partial} are the second.</p>
<p><strong>The tier code measures drafting, not the inspectors' rule.</strong> Inspectors have <a href="${SERVICE_VILLAGE}">cited a tier inside an allowed location finding</a>, always alongside a daily bus, lit footways or an urban setting. The reports coded <code>error</code> give no route fact at all, which is what the code should be read as: tier or facilities list as the whole location finding.</p>
<h3>One finding is strengthened</h3>
<p>Approvals recommended after a found design conflict with no clear-justification question: ${s.dp33.grant} at Stratford, ${o.dp33.grant} across ${councils.length} councils. Snitterfield, Ladbroke, Pillerton Priors and Stockton have no counterpart elsewhere except Leigh Sinton and Moore Place.</p>
</section>`;

// ---- The enlarged set: the council sweep ----
const sweepCompareRows = [
  ['Tier used as the location test', (c) => `${c.tier.error} of ${c.tier.n} (${pct(c.tier.error, c.tier.n)}%)`],
  ['Tier used, counting "partial"', (c) => `${c.tier.notRun} of ${c.tier.n} (${pct(c.tier.notRun, c.tier.n)}%)`],
  ['TR3 not applied where a sustainable-location decision is made', (c) => `${c.loc.notApplied} of ${c.loc.n} (${pct(c.loc.notApplied, c.loc.n)}%)`],
  ['Location decided on the route, with facts, where a decision is made', (c) => `${c.loc.route} of ${c.loc.n} (${pct(c.loc.route, c.loc.n)}%)`],
  ['TR3 applied on Green Belt sites, where GB7(1)(g)(iii) asks for it', (c) => `${c.loc.gb.applied} of ${c.loc.gb.n} (${pct(c.loc.gb.applied, c.loc.gb.n)}%)`],
  ['TR3 not run, raw count of all reports', (c) => `${c.tr3.notRun} of ${c.tr3.n} (${pct(c.tr3.notRun, c.tr3.n)}%)`],
  ['of which six homes or more', (c) => `${c.tr3.big.notRun} of ${c.tr3.big.n} (${pct(c.tr3.big.notRun, c.tr3.big.n)}%)`],
  ['Connectivity Tool used', (c) => `${c.tool.yes} of ${c.n}`],
  ['Green Belt route: S4 or S5 run where it does not apply', (c) => `${c.annexb.error} of ${c.annexb.n} (${pct(c.annexb.error, c.annexb.n)}%)`],
  ['DP3(3) not asked after a found conflict', (c) => `${c.dp33.error} of ${c.dp33.n} (${pct(c.dp33.error, c.dp33.n)}%)`],
  ['of which the officer recommended grant', (c) => `${c.dp33.grant}`],
  ['2024 Framework applied without conversion', (c) => `${c.unconverted} of ${c.n}`],
  ['Template paragraph cutting plan policies wholesale', (c) => `${c.template} of ${c.n} (${pct(c.template, c.n)}%)`],
];
const sweepCompareTable = `<div class="table-wrap"><table><thead><tr><th>Error</th><th>Stratford (${s.n})</th><th>Hand-scored set, 22 councils (${o.n})</th><th>Council sweep, ${sweepCouncils.length} councils (${w.n})</th><th>All other councils, ${allCouncils.length} (${all.n})</th></tr></thead><tbody>
${sweepCompareRows.map(([a, f]) => `<tr><th scope="row">${a}</th><td class="sdc">${f(s)}</td><td>${f(o)}</td><td>${f(w)}</td><td>${f(all)}</td></tr>`).join('\n')}
</tbody></table></div>`;
const sweepCouncilTable = `<div class="table-wrap"><table class="councils"><thead><tr><th>Council</th><th>Reports</th><th>Tier<br><small>error / partial / ok</small></th><th>TR3<br><small>not mentioned / cited only / dodged / assessed</small></th><th>Tool</th><th>Annex B<br><small>error / ok</small></th><th>DP3(3)<br><small>error / ok</small></th><th>2024 unconverted</th><th>Template</th></tr></thead><tbody>
${[...perCouncilAll, { council: 'Stratford-on-Avon', ...s, bold: true }].map((c) => {
  const x = (v) => (c.bold ? `<strong>${v}</strong>` : v);
  return `<tr${c.bold ? ' class="sdc"' : ''}><th scope="row">${x(esc(c.council))}</th><td>${x(c.n)}</td><td>${x(cell(c.tier))}</td><td>${x(`${c.tr3.nm}/${c.tr3.cited}/${c.tr3.dodged}/${c.tr3.assessed}`)}</td><td>${x(c.tool.yes)}</td><td>${x(`${c.annexb.error}/${c.annexb.ok}`)}</td><td>${x(`${c.dp33.error}/${c.dp33.ok}`)}</td><td>${x(c.unconverted)}</td><td>${x(c.template)}</td></tr>`;
}).join('\n')}
</tbody></table></div>`;
const refList = (rows) => rows.map((r) => `${esc(r.council)} ${esc(r.ref)}`).join(', ');
const sweep = `<section id="sweep"><h2>The enlarged set: ${w.n} more reports from the council sweep</h2>
<p>On 19 and 20 October 2026 a sweep of ${num(48)} councils' planning registers and committee pages fetched every officer report it could reach for decisions and committee items from 17 August 2026; ${sweepCouncils.length} of them had a housing report in the period that was not already scored. Of the ${num(1095)} reports listed, ${num(W.length)} were housing proposals not already in the hand-scored table (new homes, conversions and replacements; not householder works, prior approvals, section 73 variations, traveller sites or rural workers' dwellings), and all ${num(W.length)} were scored on 28 and 29 October 2026 with the rubric below. The sweep adds ${newCouncils.length} councils (${joinAnd(newCouncils.map(esc))}) and takes the comparison to ${all.n} reports from ${allCouncils.length} councils. ${w.committee} of the sweep reports are committee reports and ${w.n - w.committee} delegated; ${sweepGB.length} are Green Belt sites.</p>
${sweepCompareTable}
<p>The enlarged set moves the headline figures a little and the conclusion not at all. On the four errors the complaint is about, Stratford's rates are ${pct(s.tier.error, s.tier.n)}% against ${pct(all.tier.error, all.tier.n)}% for the tier, ${pct(s.annexb.error, s.annexb.n)}% against ${pct(all.annexb.error, all.annexb.n)}% for the Green Belt route, ${pct(s.template, s.n)}% against ${pct(all.template, all.n)}% for the template paragraph, and ${s.dp33.grant} recommendations to grant after an unaddressed design conflict against ${all.dp33.grant} across the ${allCouncils.length} councils together. The sweep's own DP3(3) rate (${pct(w.dp33.error, w.dp33.n)}%) is higher than the hand-scored set's (${pct(o.dp33.error, o.dp33.n)}%) because ${w.dp33.refuse} of its ${w.dp33.error} errors are refusals where the design or landscape conflict was itself a refusal reason, and because the sweep applies the broad landscape-character reading set out in the rubric; the ${w.dp33.grant} that recommended grant (${refList(sweepGrantErrors)}) are the ones that could have changed an outcome.</p>
<p>What the sweep adds to the picture:</p>
<ul>
<li><strong>The tier error is a Cotswold habit too.</strong> ${sweepTierErrors.length} sweep reports rest a location finding on a village's tier or boundary with no route fact: ${refList(sweepTierErrors)}. Cotswold's Non-Principal Settlement label does the work at Upper Oddington (${q(SRC.oddington, 'The Local Plan examination process determined that Non-Principal Settlements constitute sustainable locations for small scale residential development even if they have limited facilities', 7)}) and Maidstone's hierarchy does it in the refusal direction at Langley Heath. The other ${sweepCouncils.length - 2} councils' location findings give a distance, a footway, a bus frequency or a station, as the Framework asks.</li>
<li><strong>The Green Belt route is mostly stated correctly.</strong> ${sweepAnnexBErrors.length} of ${w.annexb.n} sweep reports where the question arises run S5 on a Green Belt site (${refList(sweepAnnexBErrors)}), both beside a full GB7 assessment and without changing the result. Hertsmere, Solihull, Three Rivers and Tonbridge and Malling state S5(5) in terms, as in ${q(SRC.ryarsh, 'Policy S5 does not apply to the development as the site is located within the Green Belt', 2)}. No sweep report applies S4 in a washed-over village.</li>
<li><strong>The template paragraph has cousins.</strong> ${w.template} sweep reports (${pct(w.template, w.n)}%) cut a plan policy wholesale, in ${sweepTemplateCouncils.length} councils (${joinAnd(sweepTemplateCouncils.map(esc))}): Babergh says that ${q(SRC.longMelford, 'reduced weight is afforded to those policies relating to the spatial strategy and housing distribution', 6)} for its supply position, Cotswold says its hierarchy policies ${q(SRC.brockhampton, 'can currently only be given very limited weight', 8)}, and Tonbridge and Malling gives ${q(SRC.salisbury, 'no weight is given to development plan Policy CP14, as it is materially inconsistent with Policy S5 of the NPPF', 3)}. None reaches Stratford's ${pct(s.template, s.n)}%, and Solihull's cut of one policy, P7, for being ${q(SRC.hobsMoat, 'prescriptive on expected distances to local services and is therefore inconsistent with the Framework', 4)}, is the reasoned Annex A(2) judgement the rubric does not count.</li>
<li><strong>Unconverted 2024 reports are commoner than the hand-scored set suggested.</strong> ${sweepUnconverted.length} sweep reports (${pct(sweepUnconverted.length, w.n)}%) apply the 2024 Framework with no conversion, most of them committee resolutions from 2024 or 2025 issued as notices after 17 August 2026 once a legal agreement was signed: ${refList(sweepUnconverted.slice(0, 8))}${sweepUnconverted.length > 8 ? ` and ${sweepUnconverted.length - 8} more` : ''}. Stratford's ${s.unconverted} are the same defect.</li>
<li><strong>The Connectivity Tool stays rare.</strong> ${w.tool.yes} sweep reports use it (${joinAnd(sweepToolCouncils.map(esc))}), and Solihull sets it aside at Peartree Farm because ${q(SRC.peartree, 'it appears to contain outdated public transport information', 4)}. ${all.n - all.tool.yes} of ${all.n} reports from ${allCouncils.length} councils do not use it; nor does any Stratford report.</li>
</ul>
<p>The sweep table, with a page reference and a verbatim quotation for every adverse code, is <a href="${GITHUB}other-councils-four-errors-sweep-2026-10.tsv">other-councils-four-errors-sweep-2026-10.tsv</a>; the <a href="${GITHUB}other-councils-sweep-inventory-2026-10.tsv">inventory</a> lists every report the sweep fetched with the reason each excluded one was left out, and the <a href="${GITHUB}other-councils-four-errors-sweep-2026-10.md">analysis note</a> records how the set was read. The sweep reaches ${sweepCouncils.length} of the ${num(48)} councils it swept with a housing report in the period; registers behind a login or a bot wall, and councils that publish no delegated reports, are listed in the note.</p>
</section>`;

// ---- The rubric ----
const rubric = `<section id="rubric"><h2>The rubric</h2>
<p>Every report in the three tables is scored on the same columns with the same codes. This is the rubric in full; it is also published as <a href="${GITHUB}four-errors-rubric.md">four-errors-rubric.md</a>.</p>
<h3>Codes</h3>
<ul>
<li><strong>Tier used as the location test.</strong> <code>error</code>: the report's finding that the site is (or is not) a sustainable location rests on the village's tier in the settlement hierarchy, its development boundary, or a recital of its facilities, with no route fact. <code>partial</code>: a tier or boundary finding with at least one transport fact beside it (a bus stop distance, a footway remark, a frequency), however thin. <code>ok</code>: the location is decided on the route and the transport choice, with facts, whether or not a tier is mentioned and whatever the decision. <code>na</code>: no location finding is made or needed: householder works, listed building consent, replacement dwellings and reconstructions, conversions decided under a reuse category, employment, and sites inside a town or city.</li>
<li><strong>TR3 not assessed.</strong> <code>not-mentioned</code>: the text search for "TR3" finds nothing (a Local Plan policy that happens to be numbered TR3 does not count). <code>cited-only</code>: TR3 is named, listed or quoted but no limb of TR3(1) is applied to the site. <code>dodged</code>: TR3(1)(a) is said not to apply because the scheme is small, and nothing else is run. <code>assessed</code>: at least one limb of TR3(1) is applied to the site with facts, or GB7(1)(g)(iii) is answered in TR3's terms. <code>na</code>: as for the tier, except that a report inside a town is still scored because TR3 applies there. The split by scheme size (six homes or more, against five or fewer) is reported because officers and inspectors treat small schemes as below the TR3(1)(a) threshold. The headline figure is taken from the rows where a sustainable-location decision is made (every row scored on the tier column): the share in which TR3 is <code>assessed</code>, and the share in which the location is decided on the route (tier <code>ok</code>), with Green Belt sites shown separately because GB7(1)(g)(iii) asks the question whatever the scale.</li>
<li><strong>Connectivity Tool.</strong> <code>yes</code> where a score or band from the Tool is given; <code>indirect</code> where the applicant's score is relied on; <code>no</code> otherwise, including where the Tool is mentioned and set aside. It is one input to TR3(2), not a gate, and it is reported as a shared absence, not as an error.</li>
<li><strong>Annex B and the Green Belt route.</strong> The question arises for a Green Belt site, a hamlet or a cluster without a boundary, or a village whose status as a settlement the report has to decide. <code>error</code>: S4 or S5(1)(j) is applied in a village washed over by the Green Belt or in a hamlet, S5 is run on a Green Belt site that S5(5) sends to GB6 to GB8, or a boundary or a tier is used as the GB7(1)(g)(iii) test; a belt-and-braces run of S5 beside a full GB7 assessment still scores <code>error</code>, and the note says so. <code>ok</code>: the Green Belt route is taken through GB6 and GB7 with S5(5) stated or implied, or a cluster is tested against the Annex B definition and S5 applied. <code>na</code>: a site inside a defined boundary that is not Green Belt, a replacement dwelling, or a 2024 report that runs no S4 or S5 route. A separate column records whether Annex B is cited.</li>
<li><strong>DP3(3) not asked.</strong> The question arises for every proposal with design content. <code>error</code>: a conflict with DP3(1), a DP3(2) principle, a development plan design standard, or the character or landscape of the area is found and weighed in the balance, and the report does not ask whether it is clearly justified or run the S4(2)(c) or S5(2) trigger. <code>ok</code>: no such conflict is found, or the conflict is found and the DP3(3) test or the trigger is applied in terms (a refusal that quotes the test counts). <code>na</code>: the only harm is heritage harm under HE6, the consent is listed building consent, or there are no external works. Two readings are stated and applied the same way across the tables: a conflict with a landscape-character policy counts as a DP3 conflict (the broad reading; the narrow reading would weigh it under N2 instead), and an error on a refusal where the conflict is itself a refusal reason is a formal slip, so errors are also split by what the officer recommended. The finding that can change an outcome is a recommendation to grant after a found conflict with no clear-justification question.</li>
<li><strong>Framework.</strong> <code>2026</code>; <code>2024+note</code> where a 2024 report carries a conversion note or update; <code>mixed</code> where 2026 policies are applied beside 2024 paragraph numbers or the 2024 "tilted balance" wording; <code>2024-unconverted</code> where a decision made after 17 August 2026 rests on a 2024 report with no conversion, including notices issued after a legal agreement on an older resolution.</li>
<li><strong>Template paragraph.</strong> <code>yes</code> where the report cuts a settlement-hierarchy or countryside policy wholesale to limited, very limited or no weight on five-year-supply or age grounds, or as "materially inconsistent" without saying which part conflicts. <code>no</code> where Annex A(2) is quoted and applied to a named part of a policy with a reason, or no cut is made. The Stratford table's column is the template paragraph itself; the other tables record any wholesale cut.</li>
</ul>
<h3>Rules that apply to every row</h3>
<ul>
<li>Every <code>error</code>, <code>partial</code>, <code>cited-only</code> and <code>dodged</code> code carries a page number and a verbatim quotation from the officer report, and every quotation in the three tables is checked by machine against the text extracted from the PDF before the page is built; a quotation that does not match stops the build.</li>
<li>Every <code>not-mentioned</code> is a text search for "TR3" with no hits, checked the same way.</li>
<li>The rubric tests method, not result: a report that assesses the route and approves against its own finding scores <code>ok</code>; a report that reaches the right answer by the wrong route scores <code>error</code>.</li>
<li>Rates are given among the reports where the question arises; <code>na</code> rows are excluded from the denominator.</li>
<li>Committee reports and delegated reports are scored alike. A committee report written before 17 August 2026 is scored on what it says, and its framework code records whether it was converted before the decision.</li>
</ul>
<h3>How the sweep set was read</h3>
<p>The hand-scored set was read report by report in full. The sweep set was first screened by machine for the mechanical facts (the TR3 text search, the Connectivity Tool, Annex B, the Framework markers and the weight phrases), then each report was read through its keyed passages: the site description, every paragraph that bears on location and transport, on the S4, S5 and Green Belt route, on design and character, on weight, and the conclusion, with page numbers; where those passages left a judgement open, the report was searched again for the point. The codes that need judgement (tier, Annex B and DP3(3)) were given on that reading, and the quotations were taken from the collapsed text and checked back against the pages.</p>
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
<tr><th scope="row">Council sweep</th><td>${w.n}</td><td>Every housing report reached by the 19 and 20 October 2026 sweep of ${num(48)} councils' registers and committee pages for decisions and committee items from 17 August 2026 and not already in the sets above (${sweepCouncils.length} councils); read through keyed passages, see <a href="#sweep">the enlarged set</a></td></tr>
</tbody></table></div>
<p>${o.n} hand-read reports from ${councils.length} councils: ${o.committee} committee and ${o.n - o.committee} delegated, ${o.greenBelt} on Green Belt sites. Stratford: ${s.n} reports, ${s.committee} committee and ${s.n - s.committee} delegated, ${s.greenBelt} Green Belt. The closest analogues to Stratford are Warwick and Bromsgrove (the same Green Belt arc, villages washed over by the Green Belt, delegated reports) and the South Worcestershire councils (a Category 1 to 3 village hierarchy, no Green Belt).</p>
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
section>ol,section>ul,.rule ul{margin:0;padding-left:20px;display:grid;gap:8px;max-width:72ch}section>ol>li,section>ul>li,.rule li{font-size:15.5px}h3{font:600 17px/1.35 var(--sans);margin-top:8px}code{font:500 .9em var(--mono);color:var(--accent)}.chart{margin:0;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:16px 18px 12px;display:grid;gap:10px}.chart figcaption{font-size:13px;color:var(--muted);line-height:1.5;padding-top:4px;border-top:1px solid var(--line)}.key{white-space:nowrap}.key::before{content:"";display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;vertical-align:-1px;border:2px solid var(--accent);background:var(--surface)}.key.s::before{border-color:var(--no);background:var(--no)}.db-head,.db-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(200px,1.3fr) 104px;gap:0 14px;align-items:center}.db-head{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}.db-axis{position:relative;height:14px}.db-axis span{position:absolute;transform:translateX(-50%);white-space:nowrap}.db-axis span:first-child{transform:none}.db-axis span:last-child{transform:translateX(-100%)}.db-head .db-vals{display:flex;justify-content:space-between}.db-label{font-size:14px;line-height:1.35}.db-label small{display:block;font-size:12px;color:var(--muted)}.db-track{position:relative;height:30px;background:repeating-linear-gradient(to right,var(--line) 0 1px,transparent 1px 25%) 0 0/100% 100%;background-clip:content-box}.db-track::after{content:"";position:absolute;right:0;top:0;bottom:0;border-right:1px solid var(--line)}.db-link{position:absolute;top:50%;height:3px;margin-top:-1.5px;background:var(--line);border-radius:2px}.db-dot{position:absolute;top:50%;width:14px;height:14px;border-radius:50%;transform:translate(-50%,-50%);border:2.5px solid var(--accent);background:var(--surface)}.db-dot.s{border-color:var(--no);background:var(--no)}.db-vals{font:600 14px/1.2 var(--mono);display:grid;gap:3px}.db-vals small{font:400 11px var(--sans);color:var(--muted);margin-left:5px}.db-vals .o{color:var(--accent)}.db-vals .s{color:var(--no)}.lp{display:grid;gap:6px}.lp h4{font:600 14px/1.3 var(--sans);margin:6px 0 2px}.lp-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(200px,1.3fr) 104px;gap:0 14px;align-items:center}.lp-name{font-size:13.5px;color:var(--muted)}.lp-row.s .lp-name{color:var(--no);font-weight:600}.lp-track{position:relative;height:22px;background:repeating-linear-gradient(to right,var(--line) 0 1px,transparent 1px 25%) 0 0/100% 100%}.lp-track::after{content:"";position:absolute;right:0;top:0;bottom:0;border-right:1px solid var(--line)}.lp-bar{position:absolute;left:0;top:50%;height:3px;margin-top:-1.5px;background:var(--line)}.lp-row.s .lp-bar{background:var(--no-soft)}.lp-val{font:600 13px/1.2 var(--mono);color:var(--accent)}.lp-row.s .lp-val{color:var(--no)}.lp-val small{font:400 11px var(--sans);color:var(--muted);margin-left:5px}.db-dot.one{border-style:dotted}.lp-none{font-size:13px;color:var(--muted);line-height:1.5;max-width:none}@media (max-width:640px){.db-head,.db-row,.lp-row{grid-template-columns:minmax(0,1fr) 72px;gap:4px 10px}.db-head>span:first-child,.db-row .db-label,.lp-name{grid-column:1/-1}.lp-row .lp-name{font-size:13px}.chart{padding:12px 12px 10px}.db-vals{font-size:13px}.db-vals small{display:block;margin:0}.db-head .db-vals{display:grid;gap:2px}}</style>`;

const html = page({
  title: 'Four NPPF Errors Across 27 Councils',
  description: `Four recurring errors in officer reports under the August 2026 NPPF, first found at Stratford-on-Avon, tested across ${all.n} housing reports from ${allCouncils.length} councils on one published rubric: the tier error ${pct(all.tier.error, all.tier.n)}% against ${pct(s.tier.error, s.tier.n)}%, the Green Belt route error ${pct(all.annexb.error, all.annexb.n)}% against ${pct(s.annexb.error, s.annexb.n)}%, approval recommended after an unaddressed design conflict ${all.dp33.grant} times against ${s.dp33.grant}. Warwick repeats the pattern; Bromsgrove and Wychavon do not. Every quotation checked.`,
  url: URL,
  breadcrumb: `<a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/authority/">Local planning authorities</a> › Officer reports compared`,
  h1: `Four errors in officer reports under the 2026 NPPF: ${all.n} reports from ${allCouncils.length} councils scored`,
  dek: `The <a href="${STRATFORD}">Stratford note</a> found four recurring errors in Stratford-on-Avon District Council's officer reports: the settlement tier used as the sustainable-location test, S4 or S5 applied where the Green Belt policies govern, the DP3(3) question not asked after a design conflict, and plan policies cut wholesale for the housing shortfall. This page asks whether the errors are Stratford's or everyone's. It scores ${all.n} housing reports from ${allCouncils.length} councils on one published rubric (${o.n} read in full from ${councils.length} councils, then ${w.n} from a sweep of ${sweepCouncils.length} councils' registers), shows what the better reports do instead, and says which of the Stratford counts were too hard.`,
  body: extraCss + short + errors + compare + byCouncil + sweep + best + repeat + audit + rubric + method,
  sources: [
    `The three scoring tables, with a page reference and quotation for every adverse code: <a href="${GITHUB}stratford-officer-reports-four-errors.tsv">Stratford</a> (${s.n} reports, note of 13 October 2026), <a href="${GITHUB}other-councils-four-errors-2026-10.tsv">other councils, hand-scored</a> (${o.n} reports, note of 18 October 2026, with the <a href="${GITHUB}other-councils-four-errors-2026-10.md">analysis note</a>) and <a href="${GITHUB}other-councils-four-errors-sweep-2026-10.tsv">the council sweep</a> (${w.n} reports, scored 28 and 29 October 2026, with its <a href="${GITHUB}other-councils-four-errors-sweep-2026-10.md">analysis note</a>, <a href="${GITHUB}other-councils-sweep-inventory-2026-10.tsv">inventory</a> and the <a href="${GITHUB}four-errors-rubric.md">rubric</a>).`,
    'Officer reports, update sheets, decision notices and minutes: the councils\' planning portals and committee pages, listed by URL in the other-councils table. The reports are council copyright and are held, with text extracts, in the private sources checkout; they are quoted here briefly.',
    `National Planning Policy Framework, August 2026 (Crown copyright, Open Government Licence): policies S4, S5, TR3, DP3 and GB7, Annex A and Annex B. <a href="${GOVUK_TOOL}">Connectivity Tool</a>, GOV.UK.`,
    'Government response to the consultation on the National Planning Policy Framework, August 2026 (Crown copyright), printed pages 30 and 132 (PDF pages 34 and 136).',
    `Planning Inspectorate decision letters 6005162, 6009593, 6006637, 6011301, 6007428 and 6009966, from the <a href="/research/england/nppf-navigator/decisions/">decisions database</a>.`,
  ],
  credit: 'Planning Distilled.',
});

const out = path.join(SITE, SITE_PATH);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`wrote ${path.join(out, 'index.html')}: ${s.n} Stratford + ${o.n} other rows, ${councils.length} councils`);
console.log(`TR3 applied where a location decision is made ${s.loc.applied}/${s.loc.n} v ${all.loc.applied}/${all.loc.n}; route-based ${s.loc.route}/${s.loc.n} v ${all.loc.route}/${all.loc.n}; Green Belt ${s.loc.gb.applied}/${s.loc.gb.n} v ${all.loc.gb.applied}/${all.loc.gb.n}`);
console.log(`tier error ${pct(s.tier.error, s.tier.n)}% v ${pct(o.tier.error, o.tier.n)}%; annexb ${pct(s.annexb.error, s.annexb.n)}% v ${pct(o.annexb.error, o.annexb.n)}%; dp33 grant ${s.dp33.grant} v ${o.dp33.grant}; TR3 big not run ${s.tr3.big.notRun}/${s.tr3.big.n} v ${o.tr3.big.notRun}/${o.tr3.big.n}; small ${s.tr3.small.notRun}/${s.tr3.small.n} v ${o.tr3.small.notRun}/${o.tr3.small.n}`);
