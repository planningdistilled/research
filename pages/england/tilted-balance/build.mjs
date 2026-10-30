// "Is there still a tilted balance?" The December 2024 paragraph 11(d) tilt, what a housing shortfall switched
// on, and what the same shortfall does under the August 2026 Framework: a grid of 22 situations by location,
// scale and type, with and without a shortfall, under both Frameworks; the "physically well-related" gate that
// now does the work the tilt used to do; and who still uses the words (commentators, one inspector, councils).
//   node pages/england/tilted-balance/build.mjs   (writes into main-site; needs ../sources for the commentary
//   and the council reports it quotes and counts)
// Every quotation is checked against its source text when the page is built, and the paragraph number of every
// letter quotation is proved from the letter; the build fails on a mismatch. The counts (letters, council
// reports, guidance summaries) are computed from the files, not typed.
import fs from 'node:fs';
import path from 'node:path';
import { GUIDANCE, SITE, SOURCES } from '../../../paths.mjs';
import { caseById, check, esc, page, quote } from '../../_shared/policy-weight.mjs';
import { corpusRefs, letterText, paragraphOf } from '../../_shared/letters.mjs';

const SITE_PATH = 'research/england/tilted-balance/';
const URL = 'https://planningdistilled.org/' + SITE_PATH;
const DECISION_PAGES = '/research/england/nppf-navigator/decisions/';
const PRESUMPTION = '/research/england/substantially-outweighed/';
const VSC = '/research/england/very-special-circumstances/';
const SETTLEMENT = '/research/england/what-is-a-settlement/';
const SUSTAINABLE = '/research/england/sustainable-location/';
const PINS_APPEALS = 'https://appeal-planning-decision.service.gov.uk/comment-planning-appeal/appeals/';
const GOVUK_NPPF = 'https://www.gov.uk/guidance/national-planning-policy-framework';
const NPPF_MD = 'https://github.com/planningdistilled/research/blob/main/data/open-sources/nppf/NPPF-August-2026.md';
const NPPF_2024_PDF = 'https://assets.publishing.service.gov.uk/media/675abd214cbda57cacd3476e/NPPF-December-2024.pdf';
const RETRIEVED = '30 October 2026';

// ---- Sources checked at build time ----
const NPPF_2024 = 'open:nppf/NPPF-December-2024.txt';
const GOV_RESPONSE = 'open:guidance-ogl/mhclg-nppf-consultation-government-response.txt';
const HWGPNFY = 'sources:guidance/hwgpnfy-s20e1-youtube.txt';
const LANDMARK = 'sources:guidance/landmark-nppf-2026-webinar-initial-look-slides.txt';
const COLWELL = 'sources:guidance/mid-sussex-colwell-farm-appellant-nppf-2026-id32.txt';
const PLANORAKS = 'sources:guidance/planoraks-nppf2026-welcome-to-the-future.txt';
const EDWIN_COE = 'sources:guidance/edwin-coe-nppf-2026-what-has-changed.txt';
const MICHELMORES = 'sources:guidance/michelmores-national-planning-policy-framework-2026.txt';
const AGORA = 'sources:guidance/agora-architects-nppf-2026-residential.txt';
const PG_VS = 'sources:guidance/planninggeek-nppf-2024-vs-2026.txt';
const PG_PRESUMPTION = 'sources:guidance/planninggeek-presumption-sustainable-development.txt';
const EDGARS = 'sources:guidance/edgars-draft-nppf-rural-development.txt';
const COUNCIL = 'sources:council/other-councils-2026-10/txt/';
const BASILDON = COUNCIL + 'moderngov/basildon--25-01657.txt';
const DACORUM = COUNCIL + 'held-b/dacorum-25-01880-MOA-report.txt';
const ELMBRIDGE = COUNCIL + 'moderngov/elmbridge--2025-3373.txt';
const MALVERN = COUNCIL + 'south-worcs/M-26-01143-PIP__delegated_report_M2601143PIP.txt';
const NORTH_HERTS = COUNCIL + 'held-b/northherts-25-02064-OP-update.txt';

const md = (anchor) => `${NPPF_MD}#${anchor}`;
const nppf = (text, code, anchor) => quote('nppf', text, `NPPF, August 2026, <a href="${md(anchor)}">${esc(code)}</a>`);
const nppf24 = (text, where) => quote(NPPF_2024, text, `NPPF, December 2024, <a href="${NPPF_2024_PDF}">${esc(where)}</a>`);
const PLACE = { 'PINS-6007924': 'Old Sarum', 'PINS-6001260': 'Lydiard Millicent', 'PINS-6010187': 'The Haven' };
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
/** A short inline reference to a decision page: "Castle Bytham 6007403". */
const ref = (id) => { const c = caseById.get(id); if (!c) throw new Error('case not in index: ' + id); return `<a href="${DECISION_PAGES}${encodeURIComponent(id)}.html">${esc(placeOf(c))} ${esc(refOf(id))}</a>`; };
const fmtLong = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const num = (x) => x.toLocaleString('en-GB');

// ---- The Framework texts: prove the premises ----
const text26 = fs.readFileSync(path.join(GUIDANCE, '..', 'open-sources', 'nppf', 'NPPF-August-2026.txt'), 'utf8').replace(/\s+/g, ' ');
const text24 = fs.readFileSync(path.join(GUIDANCE, '..', 'open-sources', 'nppf', 'NPPF-December-2024.txt'), 'utf8').replace(/\s+/g, ' ');
for (const [name, t] of [["2024", text24], ["2026", text26]]) {
  if (/tilted balance/i.test(t)) throw new Error(`the ${name} Framework contains "tilted balance": revise the short answer`);
  if (/edge of settlement/i.test(t)) throw new Error(`the ${name} Framework contains "edge of settlement": revise the gate section`);
}
const nOutOfDate26 = (text26.match(/out[- ]of[- ]date/gi) || []).length;
if (nOutOfDate26 !== 1) throw new Error(`"out of date" appears ${nOutOfDate26} times in the 2026 Framework, not once: revise the short answer`);
if (/significantly and demonstrably/i.test(text26)) throw new Error('the 2026 Framework contains "significantly and demonstrably"');

// ---- Letters ----
const refs = corpusRefs();
const flat = (r) => letterText(r).replace(/\s+/g, ' ');
const lettersUsingPhrase = refs.filter((r) => /tilted balance/i.test(flat(r)));
const lettersWellRelated = refs.filter((r) => /physically well.related/i.test(flat(r)));
if (!lettersUsingPhrase.includes('6007348')) throw new Error('Bevercotes 6007348 no longer uses "tilted balance": revise the term section');
// S5(1)(j) findings in the database, and how many of the failures turned on "well-related".
const jFindings = [];
for (const c of caseById.values()) for (const p of c.policy_findings || []) if (/^S5\(1\)\(j\)/.test(String(p.policy))) jFindings.push({ c, p });
const jCases = new Set(jFindings.map((f) => f.c.case_id));
const jFailCases = new Set(jFindings.filter((f) => f.p.finding === 'fail').map((f) => f.c.case_id));
const jFailWellRelated = new Set(jFindings.filter((f) => f.p.finding === 'fail' && (/well.related/i.test(f.p.note || '') || /\(i\)$/.test(String(f.p.policy)))).map((f) => f.c.case_id));
const jPassCases = new Set(jFindings.filter((f) => ['pass', 'accord'].includes(f.p.finding)).map((f) => f.c.case_id));
if (jFailCases.size < 15) throw new Error(`only ${jFailCases.size} S5(1)(j) failures in the database: check the policy code pattern`);

// ---- Council officer reports in the sweep ----
const councilDir = path.join(SOURCES, 'council');
function walk(dir, out = []) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.txt')) out.push(p); } return out; }
const reports = walk(councilDir);
const reportText = (p) => fs.readFileSync(p, 'utf8').replace(/\s+/g, ' ');
const reportsUsingPhrase = reports.filter((p) => /tilted balance/i.test(reportText(p)));
const reportsNewFramework = reportsUsingPhrase.filter((p) => /Policy S5\b|S5\s*\(1\)|Policy S4\b/.test(reportText(p)));
for (const must of [BASILDON, DACORUM, ELMBRIDGE, MALVERN, NORTH_HERTS]) {
  const file = path.join(SOURCES, must.slice('sources:'.length));
  if (!reportsNewFramework.includes(file)) throw new Error(`${must} is no longer among the new-Framework reports using the phrase`);
}

// ---- Guidance corpus ----
const corpusDir = path.join(GUIDANCE, 'corpus');
const corpusFiles = fs.readdirSync(corpusDir).filter((f) => f.endsWith('.md'));
const corpusTilted = corpusFiles.filter((f) => /tilted/i.test(fs.readFileSync(path.join(corpusDir, f), 'utf8')));

// ---- The grid ----
// Each row is one situation; each cell says whether the Framework itself gives the proposal a presumption in
// favour (a tick) or not (blank). Columns: shortfall 2024, shortfall 2026, no shortfall 2024, no shortfall 2026.
// "Shortfall" means the council cannot show a five-year supply of deliverable housing sites with the buffer, or
// its Housing Delivery Test result is below 75%: footnote 8 in 2024, S5(1)(j) and Annex D(12)(c) in 2026.
// Y: tick, with the basis as a tooltip. N: blank, with the reason as a tooltip.
const Y = (why) => ({ tick: true, why });
const N = (why) => ({ tick: false, why });
const TILT = Y('Tilted balance, ¶11(d), switched on by footnote 8');
const PLAN = N('Plan decides, ¶11(c) and ¶12');
const S4 = Y('S4: approve unless substantially outweighed');
const S54 = N('S5(4): exceptional circumstances');
const VSC24 = N('Inappropriate development, very special circumstances, ¶153; footnote 7 disapplies the tilt');
const VSC26 = N('Inappropriate development, very special circumstances, GB6(2)');
const GRID = [
  { group: 'Outside the Green Belt' },
  { s: 'Within a settlement boundary, 2 homes infill', r: '2024 ¶11(c), ¶11(d) · 2026 S4', c: [TILT, S4, PLAN, S4] },
  { s: 'Within a settlement boundary, 20 market homes on an unallocated plot', r: '2024 ¶11(c), ¶11(d) · 2026 S4', c: [TILT, S4, PLAN, S4] },
  { s: 'Outside a settlement but physically well-related to it, 2 homes on a field', r: '2024 ¶11(d), fn 8 · 2026 S5(1)(j)(i), S5(4)', c: [TILT, Y('S5(1)(j)(i): unmet need, well-related, in scale'), PLAN, S54] },
  { s: 'Outside a settlement but physically well-related to it, 20 market homes with policy-compliant affordable housing', r: '2024 ¶11(d), fn 8 · 2026 S5(1)(j)(i), S5(4)', c: [TILT, Y('S5(1)(j)(i): unmet need, well-related, in scale'), PLAN, S54] },
  { s: 'Adjoining a settlement, rural exception site, affordable-led', r: '2024 ¶82 · 2026 S5(1)(f), HO10', c: [TILT, Y('S5(1)(f) with HO10'), Y('¶82: councils "should support opportunities to bring forward rural exception sites"'), Y('S5(1)(f) with HO10')] },
  { s: 'Outside a settlement, site allocated in the plan', r: '2024 ¶11(c) · 2026 S5(1)(i)', c: [TILT, Y('S5(1)(i)'), Y('¶11(c): accords with an up-to-date plan, approve without delay'), Y('S5(1)(i)')] },
  { s: 'Outside a settlement, within walking distance of a well-connected station', r: '2024 ¶11(d) · 2026 S5(1)(h)', c: [TILT, Y('S5(1)(h)'), PLAN, Y('S5(1)(h)')] },
  { s: 'Hamlet or group of houses, 2 homes limited infilling', r: '2024 ¶11(d) · 2026 S5(1)(e)', c: [TILT, Y('S5(1)(e)'), PLAN, Y('S5(1)(e)')] },
  { s: 'Open countryside, 20 homes not well-related to any settlement', r: '2024 ¶11(d) · 2026 S5(4)', c: [TILT, S54, PLAN, S54] },
  { s: 'Open countryside, redundant farmyard (previously developed land) redeveloped for homes', r: '2024 ¶11(d) · 2026 S5(1)(d)', c: [TILT, Y('S5(1)(d)'), PLAN, Y('S5(1)(d)')] },
  { s: 'Open countryside, one isolated home', fn: 1, r: '2024 ¶84 · 2026 S5(3), HO11', c: [N('¶11(d) applied in form, but ¶84 says avoid isolated homes unless an exception applies'), N('S5(3): only under HO11'), N('¶84'), N('S5(3): only under HO11')] },
  { group: 'In the Green Belt' },
  { s: 'Edge of a settlement, grey belt land in a sustainable location, 20 homes', fn: 2, r: '2024 ¶155, fn 56, ¶156 · 2026 GB7(1)(g), fn 41, GB8, S5(5)', c: [Y('¶155 met, so not inappropriate; then ¶11(d). Golden Rules ¶156'), Y('GB7(1)(g) met; then S5(5). Golden Rules GB8'), N('¶155(b) needs a demonstrable unmet need; without it, very special circumstances'), N('GB7(1)(g)(ii) needs an evidenced unmet need; without it, GB6(2)')] },
  { s: 'Edge of a settlement, grey belt land in a sustainable location, 2 homes', r: '2024 ¶155, fn 56 · 2026 GB7(1)(g), fn 41, S5(5)', c: [Y('¶155 met; then ¶11(d). Not major, so no Golden Rules'), Y('GB7(1)(g) met; then S5(5). Not major, so no GB8'), N('¶155(b) needs a demonstrable unmet need'), N('GB7(1)(g)(ii) needs an evidenced unmet need')] },
  { s: 'Edge of a settlement, not grey belt, any market housing', r: '2024 ¶153, fn 7 · 2026 GB6(2)', c: [VSC24, VSC26, VSC24, VSC26] },
  { s: 'Edge of a settlement, rural exception site', r: '2024 ¶154(f), ¶82 · 2026 GB7(1)(d), S5(5)', c: [Y('¶154(f) not inappropriate; then ¶11(d)'), Y('GB7(1)(d); then S5(5)'), Y('¶154(f) not inappropriate; ¶82 support'), Y('GB7(1)(d); then S5(5)')] },
  { s: 'Edge of a settlement, not grey belt, within walking distance of a well-connected station', r: '2024 ¶153 · 2026 GB7(1)(h), S5(5)', c: [VSC24, Y('GB7(1)(h); then S5(5)'), VSC24, Y('GB7(1)(h); then S5(5)')] },
  { s: 'Previously developed land, no substantial harm to openness', r: '2024 ¶154(g) · 2026 GB7(1)(e), S5(5)', c: [Y('¶154(g) not inappropriate; then ¶11(d)'), Y('GB7(1)(e); then S5(5)'), N('¶154(g) not inappropriate; plan decides'), Y('GB7(1)(e); then S5(5)')] },
  { s: 'Open Green Belt away from any settlement, grey belt land, 20 homes', fn: 3, r: '2024 ¶155(c) · 2026 GB7(1)(g)(iii), TR3', c: [N('¶155(c) needs a sustainable location, rarely met away from a settlement'), N('GB7(1)(g)(iii) needs a sustainable location under TR3'), N('¶155(b) and (c) both unmet'), N('GB7(1)(g)(ii) and (iii) both unmet')] },
  { s: 'Open Green Belt, one isolated home', r: '2024 ¶153, ¶84 · 2026 GB6(2), HO11', c: [N('Inappropriate, ¶153; ¶84'), N('Inappropriate, GB6(2); HO11'), N('Inappropriate, ¶153; ¶84'), N('Inappropriate, GB6(2); HO11')] },
  { s: 'Village washed over by the Green Belt, 2 homes limited infilling', r: '2024 ¶154(e) · 2026 GB7(1)(c), S5(5)', c: [Y('¶154(e) not inappropriate; then ¶11(d)'), Y('GB7(1)(c); then S5(5)'), N('¶154(e) not inappropriate; plan decides'), Y('GB7(1)(c); then S5(5)')] },
  { s: 'Village washed over by the Green Belt, 2 homes not limited infilling, grey belt land', fn: 4, r: '2024 ¶155, fn 56 · 2026 GB7(1)(g), fn 41, S5(5)', c: [Y('¶155 met; then ¶11(d)'), Y('GB7(1)(g) met; then S5(5)'), N('¶155(b) needs a demonstrable unmet need'), N('GB7(1)(g)(ii) needs an evidenced unmet need')] },
  { s: 'Village washed over by the Green Belt, 2 or 20 homes not limited infilling, not grey belt', r: '2024 ¶153 · 2026 GB6(2)', c: [VSC24, VSC26, VSC24, VSC26] },
];
const TICK = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const cell = (x) => x.tick
  ? `<td class="c"><span class="yes" title="${esc(x.why)}">${TICK}<span class="sr">Presumption in favour: ${esc(x.why)}</span></span></td>`
  : `<td class="c"><span class="no" title="${esc(x.why)}"><span class="sr">No presumption in favour: ${esc(x.why)}</span></span></td>`;
const rows = GRID.map((r) => r.group
  ? `<tr class="group"><td colspan="6">${esc(r.group)}</td></tr>`
  : `<tr><td class="s"><span class="what">${esc(r.s)}${r.fn ? `<sup><a href="#gfn${r.fn}">${r.fn}</a></sup>` : ''}</span><span class="refs">${esc(r.r)}</span></td>${cell(r.c[0])}${cell(r.c[1])}<td class="gap"></td>${cell(r.c[2])}${cell(r.c[3])}</tr>`).join('\n');
const nRows = GRID.filter((r) => !r.group).length;
const nShortfallChanges = GRID.filter((r) => !r.group && r.c[0].tick !== r.c[2].tick).length;
const nShortfallChanges26 = GRID.filter((r) => !r.group && r.c[1].tick !== r.c[3].tick).length;
const nSame26 = GRID.filter((r) => !r.group && r.c[1].tick === r.c[3].tick).length;

// The premises of the grid, proved against the two texts.
check(NPPF_2024, 'approving development proposals that accord with an up-to-date development plan without delay');
check(NPPF_2024, 'where there are no relevant development plan policies, or the policies which are most important for determining the application are out-of-date');
check(NPPF_2024, 'should support opportunities to bring forward rural exception sites that will provide affordable housing to meet identified local needs');
check(NPPF_2024, 'Planning policies and decisions should avoid the development of isolated homes in the countryside unless one or more of the following circumstances apply');
check(NPPF_2024, 'There is a demonstrable unmet need for the type of development proposed');
check(NPPF_2024, 'The development would be in a sustainable location, with particular reference to paragraphs 110 and 115 of this Framework');
check(NPPF_2024, 'Where applicable the development proposed meets the ‘Golden Rules’ requirements set out in paragraphs 156-157 below');
check(NPPF_2024, 'limited infilling in villages');
check(NPPF_2024, 'limited affordable housing for local community needs under policies set out in the development plan (including policies for rural exception sites)');
check(NPPF_2024, 'Inappropriate development is, by definition, harmful to the Green Belt and should not be approved except in very special circumstances');
check(NPPF_2024, 'the application of policies in this Framework that protect areas or assets of particular importance7 provides a strong reason for refusing the development proposed');
check('nppf', 'Development proposals within settlements should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects');
check('nppf', 'Development proposals which do not fall within one of the categories set out in this policy should only be approved in exceptional circumstances');
check('nppf', 'Development proposals comprising isolated homes, which are those lying outside settlements or groups of houses, should not be approved other than in accordance with policy HO11');
check('nppf', 'Limited infilling in villages lying within the Green Belt');
check('nppf', 'Limited affordable housing for local community needs under policies set out in this Framework or the development plan (for instance, on a rural exception site)');
check('nppf', 'The redevelopment of previously developed land (including a material change of use to residential or mixed-use including residential), which would not cause substantial harm to the openness of the Green Belt');
check('nppf', 'Where delivery falls below 75% of the requirement over the previous three years, an evidenced unmet need for housing is deemed to exist for the purpose of applying');
check('nppf', 'policy S5(1)(j) in this Framework. This is in addition to the requirements for an action plan and 20% buffer');
check('nppf', 'Adjoin or be physically well-related to a settlement');
check('nppf', 'For the purpose of this Framework they also exclude villages which lie within and are defined as part of the Green Belt in the development plan');

// ---- The page ----
const extraCss = `<style>
.rule p+p{margin-top:2px}
.grid-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;background:var(--surface);border:1px solid var(--line);border-radius:8px}
table.tilt{border-collapse:collapse;width:100%;min-width:720px;font-size:14.5px}
table.tilt th,table.tilt td{text-align:left;vertical-align:top;padding:9px 12px;border-bottom:1px solid var(--line)}
table.tilt thead th{position:sticky;top:0;background:var(--surface);z-index:2}
table.tilt th.top{text-align:center;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink);border-bottom:1px solid var(--muted);padding-bottom:5px}
table.tilt th.yr{text-align:center;font-weight:500;color:var(--muted);font-size:12.5px;width:80px;border-bottom:2px solid var(--muted)}
table.tilt th.sit{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);border-bottom:2px solid var(--muted)}
table.tilt th.gap,table.tilt td.gap{width:16px;border-bottom:none;background:var(--ground);padding:0}
table.tilt tr.group td{background:var(--surface-2);font:600 16px/1.3 var(--serif);padding-block:8px;border-bottom:1px solid var(--muted)}
table.tilt td.s{min-width:0}table.tilt td.s .what{font-weight:600;font-size:14px}table.tilt td.s .refs{display:block;font-size:12px;color:var(--muted);margin-top:2px}
table.tilt td.s sup a{text-decoration:none;color:var(--accent);font-weight:600}
table.tilt td.c{text-align:center;width:80px}table.tilt td.c span.yes,table.tilt td.c span.no{display:inline-grid;place-items:center;width:26px;height:26px;border-radius:5px}
table.tilt td.c .yes{background:var(--ok-soft);color:var(--ok)}table.tilt td.c .no{color:var(--line)}
table.tilt tbody tr:last-child td{border-bottom:none}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.legend{display:flex;flex-wrap:wrap;gap:10px 22px;font-size:14px;color:var(--muted);align-items:center}.legend .k{display:inline-flex;align-items:center;gap:8px}.legend .box{width:22px;height:22px;border-radius:4px;border:1px solid var(--line);background:var(--surface);display:inline-grid;place-items:center}.legend .box.yes{background:var(--ok-soft);color:var(--ok);border-color:transparent}
.gfn{font-size:14px;color:var(--muted);display:grid;gap:6px;max-width:72ch}.gfn p{margin:0}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}.two>div{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:16px 18px;display:grid;gap:8px;min-width:0}.two h3{font:600 16px/1.3 var(--sans)}.two ul{margin:0;padding-left:18px;display:grid;gap:6px}.two li{font-size:14.5px}
section>ul{margin:0;padding-left:20px;display:grid;gap:8px;max-width:72ch}section>ul>li{font-size:15.5px}
.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}table.plain{border-collapse:collapse;width:100%;font-size:14px;min-width:640px}table.plain th,table.plain td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--line)}table.plain th{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}.stat{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:14px 16px}.stat .n{font:600 30px/1 var(--serif);color:var(--accent);font-variant-numeric:tabular-nums}.stat .l{font-size:13.5px;margin-top:6px}
h3{font:600 17px/1.35 var(--sans);margin-top:8px}
</style>`;

const short = `<section id="short"><h2>The short answer</h2>
<div class="rule">
<p><strong>No, not as a rule, but yes in two places.</strong> "Tilted balance" was never a phrase in either Framework. It was the profession's name for paragraph 11(d) of the December 2024 text, which told decision-makers to grant permission where the most important plan policies were out of date, unless the harms "significantly and demonstrably" outweighed the benefits. Footnote 8 deemed those policies out of date wherever a council could not show a five-year supply of deliverable housing sites, or its Housing Delivery Test result was below 75%. A housing shortfall therefore suspended the plan's settlement and countryside policies for every housing proposal in the district.</p>
<p>The August 2026 Framework has no "out of date" test and no paragraph 11(d). The words "out of date" appear once, in HO2(5), about neighbourhood housing figures. Decisions inside a <a href="${SETTLEMENT}">settlement</a> go through S4 and outside one through S5, whether supply is healthy or not. The same shortfall now does one thing: it is the standard example of an "evidenced unmet need" in S5(1)(j), and in GB7(1)(g)(ii) for grey belt land. That gives a presumption in favour only where the site is physically well-related to a settlement, or is grey belt land in a sustainable location. Everywhere else the shortfall changes nothing about the starting point.</p>
<p>So the honest description is a tilted balance confined to edge land, rather than one across the district. The grid below shows where. The <a href="${PRESUMPTION}">companion page</a> covers the balance itself, "substantially outweighed", and every decision so far with a finding under S4, S5 or S6.</p>
</div></section>`;

const meant = `<section id="meant"><h2>What a shortfall switched on in 2024</h2>
<p>Six provisions in the December 2024 Framework turned on the same two facts. The council could not demonstrate a five-year supply with the right buffer, or its Housing Delivery Test result was below 75%.</p>
${nppf24('This includes, for applications involving the provision of housing, situations where: the local planning authority cannot demonstrate a five year supply of deliverable housing sites (with the appropriate buffer as set out in paragraph 78); or where the Housing Delivery Test indicates that the delivery of housing was substantially below (less than 75% of) the housing requirement over the previous three years.', 'footnote 8')}
<ul>
<li><strong>Paragraph 11(d) and footnote 8.</strong> The shortfall deemed the most important policies out of date, so permission was to be granted unless a footnote 7 protection gave a strong reason to refuse, or the harms would "significantly and demonstrably outweigh the benefits". This overrode the plan's settlement hierarchy and countryside policies for housing.</li>
<li><strong>Paragraph 11(d)(ii) and footnote 9.</strong> Once tilted, the balance had to have "particular regard to key policies for directing development to sustainable locations, making effective use of land, securing well-designed places and providing affordable homes". That steer only operated when the shortfall had tilted the balance.</li>
<li><strong>Paragraph 14.</strong> The neighbourhood plan shield applied only "where the presumption (at paragraph 11d) applies", so the shortfall was what brought it into play.</li>
<li><strong>Paragraphs 78 to 80.</strong> Delivery below 95% required an action plan, below 85% added a 20% buffer, and below 75% triggered footnote 8.</li>
<li><strong>Paragraph 155(b) and footnote 56.</strong> Grey belt development needed "a demonstrable unmet need", defined as the same shortfall. A shortfall also unlocked grey belt housing.</li>
<li><strong>Paragraphs 232 and 233.</strong> A council with a supply and a Housing Delivery Test above 75% was not out of date just because standard method need exceeded its requirement, for five years from adoption, and an examined Annual Position Statement could fix its supply figure for a year.</li>
</ul>
<p>In 2026 the first three have gone. The buffer ladder survives in Annex D paragraphs 8 to 13 with the same thresholds, except that below 75% now deems an unmet need for S5(1)(j) rather than switching on a presumption. The grey belt test survives in GB7(1)(g) with the same definition in footnote 41. Paragraph 232 survives as Annex A paragraph 3, recast so that a higher standard method figure "should not be considered as evidence of unmet need". The Annual Position Statement has no equivalent.</p>
${nppf('Where delivery falls below 75% of the requirement over the previous three years, an evidenced unmet need for housing is deemed to exist for the purpose of applying', 'Annex D, ¶12(c), which continues "policy S5(1)(j) in this Framework" after a printed page break', 'AnnexD-12-c')}
</section>`;
check(NPPF_2024, 'having particular regard to key policies for directing development to sustainable locations, making effective use of land, securing well-designed places and providing affordable homes');
check(NPPF_2024, 'In situations where the presumption (at paragraph 11d) applies to applications involving the provision of housing');
check('nppf', 'this should not be considered as evidence of unmet need, for a period of five years from the date of the plan’s adoption');

const grid = `<section id="grid"><h2>Where a shortfall gives a presumption in favour: ${nRows} situations</h2>
<p>A tick means the Framework itself gives the proposal a presumption in favour of approval in that situation: in 2024 the paragraph 11(d) tilt, an accord with an up-to-date plan under 11(c), or paragraph 82's support for rural exception sites; in 2026 policy S4, a category on the S5(1) list, or a GB7(1) category that S5(5) then treats like an S5 proposal. No tick means the plan decides, the Framework presumes against (S5(4) "exceptional circumstances", paragraph 84 or HO11 on isolated homes), or the land is Green Belt where <a href="${VSC}">very special circumstances</a> are needed. Hover or focus a cell for the basis.</p>
<div class="legend"><span class="k"><span class="box yes">${TICK}</span> Presumption in favour</span><span class="k"><span class="box"></span> No presumption in favour</span></div>
<div class="grid-wrap"><table class="tilt">
<thead>
<tr><th class="sit" rowspan="2" scope="col">Situation</th><th class="top" colspan="2" scope="colgroup">Shortfall</th><th class="gap" rowspan="2" aria-hidden="true"></th><th class="top" colspan="2" scope="colgroup">No shortfall</th></tr>
<tr><th class="yr" scope="col">2024</th><th class="yr" scope="col">2026</th><th class="yr" scope="col">2024</th><th class="yr" scope="col">2026</th></tr>
</thead>
<tbody>
${rows}
</tbody></table></div>
<div class="gfn">
<p id="gfn1"><sup>1</sup> In 2024 the tilted balance formally applied to an isolated home where there was a shortfall, but paragraph 84 told decision-makers to avoid isolated homes unless one of its exceptions applied, so the Framework's own direction was against. In 2026 S5(3) sends an isolated home to HO11 and S5(1)(j) is closed to it: at ${ref('PINS-6010187')}, with a one-year supply, being agreed to be isolated meant the site was not well-related.</p>
<p id="gfn2"><sup>2</sup> The Golden Rules apply to major housing on grey belt land in both versions: paragraphs 156 and 157, then GB8.</p>
<p id="gfn3"><sup>3</sup> Both versions require a sustainable location for grey belt housing, under paragraphs 110 and 115 in 2024 and under TR3 in 2026. Land away from any settlement will rarely pass, so no tick is shown. A shortfall still makes the attempt possible in both.</p>
<p id="gfn4"><sup>4</sup> A washed-over village is not a settlement under the 2026 Annex B definition, so S5(1)(j) is not the route. The route is GB7(1)(g): grey belt land, an unmet need and a sustainable location under TR3, which a village with services can pass. GB7(1)(g) has no "well-related" limb.</p>
</div>
<p>Read across the shortfall columns and the two Frameworks agree in most rows. Read down the 2024 columns and the shortfall is a switch: it changes ${nShortfallChanges} of the ${nRows} rows. Read down the 2026 columns and it changes ${nShortfallChanges26}: the two well-related rows outside the Green Belt and the three grey belt rows. In the other ${nSame26} rows the two 2026 columns are identical, because the situation has its own S5(1) or GB7(1) category, or none at all. The 2024 "no shortfall" column is blank wherever the answer depends on the local plan, so a council with a permissive edge-of-settlement policy would read some of those cells as ticks.</p>
</section>`;

const survives = `<section id="survives"><h2>What is not materially different, and what is</h2>
<div class="two">
<div><h3>Not materially different</h3><ul>
<li><strong>Grey belt housing.</strong> Paragraph 155 and GB7(1)(g) run the same four limbs, and footnotes 56 and 41 define the unmet need identically. "Demonstrable" became "evidenced".</li>
<li><strong>Ordinary Green Belt.</strong> A shortfall does not unlock land that is not grey belt. Footnote 7 in 2024, S5(5) with GB6 in 2026.</li>
<li><strong>The buffer ladder.</strong> 5% by default, 20% below 85%, an action plan below 95%, and 20% where an adopted requirement is 80% or less of standard method need. Paragraphs 78 and 79, then Annex D paragraphs 9 and 12.</li>
<li><strong>What supply is measured against.</strong> The adopted requirement, switching to standard method need once it is over five years old. Footnote 39, then Annex D paragraph 8.</li>
<li><strong>The definition of "deliverable".</strong> Unchanged apart from adding pitches and plots.</li>
<li><strong>Recently adopted plans.</strong> Supply plus a Housing Delivery Test above 75% protects a plan from a higher standard method figure for five years. Paragraph 232, then Annex A paragraph 3.</li>
<li><strong>Recent neighbourhood plans with allocations.</strong> The same two conditions in paragraph 14 and S6, and the same outcome in a shortfall case.</li>
<li><strong>Isolated homes and traveller sites.</strong> A shortfall never helped an isolated home, and a lack of a five-year supply of traveller sites is an unmet need in both.</li>
</ul></div>
<div><h3>Gone or significantly different</h3><ul>
<li><strong>The override.</strong> Footnote 8 and paragraph 11(d) no longer exist. Nothing is deemed out of date; the plan is not suspended.</li>
<li><strong>Inside settlements.</strong> S4 approves development within a settlement regardless of supply, so the shortfall adds nothing there.</li>
<li><strong>Sites not well-related to a settlement.</strong> In 2024 they entered the tilted balance. In 2026 S5(1)(j)(i) shuts them out and they fall to S5(4).</li>
<li><strong>The balance test.</strong> "Significantly and demonstrably outweigh", with footnote 9's steer to the key policies, becomes "substantially outweighed", the same test every S5 proposal gets.</li>
<li><strong>Weight of plan policies.</strong> Paragraph 232's reduced weight for out-of-date policies is gone. Annex A paragraph 2 sets weight by consistency with the Framework, so a shortfall council's settlement boundaries keep full weight.</li>
<li><strong>The neighbourhood plan shield.</strong> Paragraph 14 operated only when the shortfall tilted the balance. S6 operates for every housing proposal that conflicts with a qualifying plan.</li>
<li><strong>Below 75% on the Housing Delivery Test.</strong> It made "the presumption apply" under paragraph 79(c). Annex D paragraph 12(c) deems an unmet need for S5(1)(j), which still has to pass the proximity and scale limbs.</li>
<li><strong>Scope and the Annual Position Statement.</strong> Footnote 8 was housing only. S5(1)(j) is "not limited to" housing, with E2(2) on business land. Paragraph 233 has no equivalent.</li>
</ul></div>
</div>
${nppf('Development plan policies (or parts of those policies) which are materially inconsistent with national decision-making policies in this Framework should be given very limited weight. The only exception to this is where they have been examined and adopted or made against this Framework. Other development plan policies should not be given reduced weight simply because they were adopted prior to the publication of this Framework.', 'Annex A, ¶2', 'AnnexA-2')}
</section>`;
check('nppf', 'Development which would address an evidenced unmet need (including, but not limited to, development proposals involving the provision of housing where the local planning authority cannot demonstrate a five year supply of deliverable housing sites or scores below 75% in the most recent Housing Delivery Test');

const gate = `<section id="gate"><h2>"Physically well-related" is the gate</h2>
<p>Where the 2026 shortfall still tilts, S5(1)(j)(i) decides whether a site gets through. The site must be "physically well-related to an existing settlement" and of a scale the infrastructure can take. That is not the same as being at the edge of a settlement, a phrase neither Framework uses. HO10(2)(a) says an exception site should "adjoin or be physically well-related to a settlement", so the Framework treats the two as different things, and footnote 28 to S5(1)(j) contemplates a site separated from the built-up area by an unbuilt allocation. The term is undefined. The inspector at ${ref('PINS-6007924')} said so before finding a site beside a park and ride, with a footway into the settlement, well-related.</p>
${dl('PINS-6007924', 'The term ‘physically well related’ is not defined within the Framework.', 11)}
<div class="stats">
<div class="stat"><div class="n">${num(jCases.size)}</div><div class="l">decisions in the database with an S5(1)(j) finding</div></div>
<div class="stat"><div class="n">${num(jFailCases.size)}</div><div class="l">in which S5(1)(j) failed</div></div>
<div class="stat"><div class="n">${num(jFailWellRelated.size)}</div><div class="l">of those failed on "well-related" or limb (i)</div></div>
<div class="stat"><div class="n">${num(lettersWellRelated.length)}</div><div class="l">decision letters that use the phrase</div></div>
</div>
<p>Inspectors are reading the limb four ways, and the readings decide cases. Adjoining the settlement edge is strong evidence under the first two and no evidence under the last two.</p>
<div class="table-wrap"><table class="plain"><thead><tr><th>Reading</th><th>Decisions</th><th>What it looks like</th></tr></thead><tbody>
<tr><td>Physical connectivity, not landscape or visual terms</td><td>${ref('PINS-6006893')}, ${ref('PINS-6001260')}</td><td>Whitchurch passed the limb on connectivity while losing on landscape. Lydiard Millicent passed with 43 m of carriageway walking and no footway, because the policy does not require a site "to adjoin the principal built form".</td></tr>
<tr><td>Settlement form and contiguity</td><td>${ref('PINS-6004691')}, ${ref('PINS-6007403')}, ${ref('PINS-6009838')}, ${ref('PINS-6012985')}</td><td>Cliffe Woods failed from a site "set away from the defined edge" across a road. Castle Bytham failed from a site adjoining the boundary that spilled over a hedged ridge. Bolney failed on its own access to a remote lane.</td></tr>
<tr><td>Access to services read in</td><td>${ref('PINS-6006900')}, ${ref('PINS-6010442')}, ${ref('PINS-6008434')}, ${ref('PINS-6011150')}</td><td>Findon failed one dwelling "irrespective of the precise distance" because services were not reachable on foot, by cycle or by bus. Roche failed 280 m from the settlement across a four-lane bypass.</td></tr>
<tr><td>Character and setting read in</td><td>${ref('PINS-6007403')}</td><td>Castle Bytham tied the limb to the "attractive rural setting" of the village and its conservation area.</td></tr>
</tbody></table></div>
${dl('PINS-6006893', 'In physical connectivity, rather than landscape and visual terms, it would be sufficiently well related to the existing settlement and it would be of a scale that could be accommodated taking account the existing and proposed availability of infrastructure.', 69)}
${dl('PINS-6001260', 'I do not read Policy S5 of the Framework as requiring a site to adjoin the principal built form of a particular settlement or to be served by a continuous segregated footway. Rather, the policy requires an assessment of whether a site is physically well-related to an existing settlement.', 24)}
${dl('PINS-6004691', 'However, as described, the appeal proposal is set away from the defined edge of Cliffe Woods which is visually contained to the other side of Merryboys Road. The development would visually appear away from the settlement and as part of the countryside with an access from Perry Hill, a distinctly rural road. The development would therefore not appear physically well-related to Cliffe Woods and as such would not meet paragraph 1(j)(i) of Policy S5.', 15)}
${dl('PINS-6006900', 'Nevertheless, the site is not in a location that is reasonably accessible by foot, cycle or public transport to services and facilities required for day-to-day living, and future residents would likely be highly reliant on private cars for most journeys, irrespective of the precise distance. In this context the proposed development would not be physically well related to the settlement of Findon.', 17)}
<p>Two more points fix the limb's reach. It belongs only to S5(1)(h) and (j). At ${ref('PINS-6009593')} the inspector held that limited infilling under S5(1)(e) carries no well-related requirement at all. And it is closed to isolated homes, whatever the supply position.</p>
${dl('PINS-6009593', 'Policy S5 does not require that proposals for redevelopment of PDL and/or limited infilling within groups of houses are physically well-related to a settlement, since that requirement only appears within parts 1h and 1j, with no indication that it is to be applied to the other forms of development listed.', 16)}
${dl('PINS-6010187', 'The Council is only able to demonstrate a 1 year housing land supply. The development would therefore contribute towards an evidenced unmet need. However, this alone is insufficient to garner support from policy S5 paragraph 1.j. of the Framework, as the development must be physically well-related to an existing settlement. As it is common ground that the dwelling would be isolated, this criterion is not met.', 30)}
<p>Grey belt land has no such limb. GB7(1)(g)(iii) asks instead for a sustainable location under TR3, which is covered on the <a href="${SUSTAINABLE}">sustainable location</a> page and in the Green Belt tables on the <a href="${VSC}">very special circumstances</a> page.</p>
</section>`;
check('nppf', 'Be physically well-related to an existing settlement');
check('nppf', 'Where a development proposal is located outside a settlement, and separated from the existing built-up area by virtue of being beyond the outside edge of an allocated site that has yet to be fully developed');


// ---- Which new-Framework reports use the phrase, and how ----
// Every file among reportsNewFramework must match exactly one entry; the same document held twice (sweep and
// other-councils folders, or a report and its agenda pack) shares one `doc`. The build fails on an unmatched file,
// so a new sweep hit forces a reading before the counts change.
const SWEEP = 'sources:council/sweep/';
const TM_00079 = SWEEP + 'tonbridge-malling/26-00079-FL/DELEGATED REPORT-26_00079_FL-DELEGATED_REPORT-1882865.txt';
const MALDON_00607 = SWEEP + 'maldon-committee/meeting-2026-09-22-4906/5-25_00607_OUTM Land 100M East Of 53 Seagers Great Totham.txt';
const REPORTS = [
  { re: /dacorum.*25.01880/i, cls: 'past', doc: 'Dacorum, Land east of Tring 25/01880/MOA (committee update, 10 September 2026)' },
  { re: /northherts-25-02064|25\.02064\.OP|SUPPLEMENTARY DOCUMENTS/i, cls: 'past', doc: 'North Hertfordshire, Hambridge Way, Pirton 25/02064/OP (committee update, 3 September 2026)' },
  { re: /24.02889/i, cls: 'past', doc: 'North Hertfordshire, Roundwood, Graveley 24/02889/FP (committee report, 1 October 2026)' },
  { re: /elmbridge/i, cls: 'past', doc: 'Elmbridge, Former Moore Place Golf Course, Esher 2025/3373 (committee report, 13 October 2026)' },
  { re: /W-26-00476-PIP/i, cls: 'past', doc: 'Wychavon, W/26/00476/PIP (delegated report recalling an earlier permission)' },
  { re: /east-devon-committee\/meeting-2026-09-22/i, cls: 'past', doc: 'East Devon, Housing Delivery Test and five-year land supply report (22 September 2026)' },
  { re: /26_1143_PIP/i, cls: 'past', doc: 'East Devon, Clyst Valley 26/1143/PIP (committee report of 1 September 2026, appending a 2024 appeal decision that used the term)' },
  { re: /M-26-01143-PIP/i, cls: 'notengaged', doc: 'Malvern Hills, Brookfield, Hallow M/26/01143/PIP (delegated, 26 August 2026)' },
  { re: /M-26-00854-FUL/i, cls: 'notengaged', doc: 'Malvern Hills, M/26/00854/FUL (delegated, September 2026)' },
  { re: /cotswold\/26-02006/i, cls: 'thirdparty', doc: 'Cotswold 26/02006/PLP' },
  { re: /cotswold\/26-01075/i, cls: 'thirdparty', doc: 'Cotswold 26/01075/PLP' },
  { re: /cotswold\/26-02138/i, cls: 'thirdparty', doc: 'Cotswold 26/02138/PLP' },
  { re: /26-00079-FL/i, cls: 'newterm', doc: 'Tonbridge and Malling, Former Grimbles, Crouch TM/26/00079/FL (delegated)' },
  { re: /26-00913-FL/i, cls: 'newterm', doc: 'Tonbridge and Malling, Carlton House, Tonbridge TM/26/00913/FL (delegated, October 2026)' },
  { re: /maidstone\/26-502025/i, cls: 'newterm', doc: 'Maidstone, Pebble Court Farm, Borden 26/502025/FULL (delegated, October 2026)' },
  { re: /basildon/i, cls: 'oldapplied', doc: 'Basildon, Knights, Basildon 25/01657/FULL (committee, 7 October 2026)' },
  { re: /26_00267_OUTM/i, cls: 'oldapplied', doc: 'Maldon, Catchpole Lane, Great Totham 26/00267/OUTM (committee, 15 October 2026)' },
  { re: /26.00066.OUTM/i, cls: 'oldapplied', doc: 'Maldon, Mell Road, Tollesbury 26/00066/OUTM (committee, 2 September 2026)' },
  { re: /25_00607_OUTM/i, cls: 'oldapplied', doc: 'Maldon, Seagers, Great Totham 25/00607/OUTM (committee, 22 September 2026)' },
];
const byClass = { past: new Set(), notengaged: new Set(), thirdparty: new Set(), newterm: new Set(), oldapplied: new Set() };
const docsNew = new Set();
for (const file of reportsNewFramework) {
  const rel = path.relative(councilDir, file);
  const hits = REPORTS.filter((r) => r.re.test(rel));
  if (hits.length !== 1) throw new Error(`${rel}: matches ${hits.length} register entries; read it and add or fix a row`);
  byClass[hits[0].cls].add(hits[0].doc); docsNew.add(hits[0].doc);
}
const councilsNew = new Set([...docsNew].map((d) => d.split(',')[0].replace(/ \d.*$/, '')));
check(TM_00079, 'TM/26/00079/FL Location: Former Grimbles Long Mill Lane Crouch');
check(MALDON_00607, '25/00607/OUTM');
check(MALDON_00607, 'the tilted balance for the requirements of policies S3 (presumption in favour of sustainable development) and S5 of the NPPF S5 (1) J i');
check(SWEEP + 'maldon-committee/meeting-2026-10-15-4910/6-26_00267_OUTM - Land Adjacent Pump House Catchpole Lane Great Totham Essex.txt', 'The tilted balance is therefore applied as policy S2 is currently out of date and not in accordance with the requirements of the NPPF');
check(SWEEP + 'maldon-committee/meeting-2026-09-02-4710/214-26_00066_OUTM - Land Rear of 6 to 108 Mell Road, Tollesbury, Essex.txt', 'the lack of a 5YHLS dictates that the tilted balance must be applied');
check(SWEEP + 'maidstone/26-502025-FULL/Delegated Report-26_502025_FULL--7013369.txt', 'a tilted balance in favour of supporting the proposals is engaged');
check(SWEEP + 'tonbridge-malling/26-00913-FL/DELEGATED REPORT-26_00913_FL-DELEGATED_REPORT-1896587.txt', 'The remainder of this assessment will be determined in the context of the tilted balance and the presumption in favour of sustainable development. As per Policies S3 and S4');
check(SWEEP + 'malvern-hills/M-26-00854-FUL/delegated report_M2600854FUL.txt', 'the tilted balance under paragraph 11(d) of the NPPF is not engaged');

const term = `<section id="term"><h2>Who still says "tilted balance"</h2>
<p>The words survive in conversation and in advocacy. The decision-makers have stopped using them. Of the ${num(corpusTilted.length)} summaries in the <a href="/research/england/nppf-navigator/method-and-cross-references/sources/">guidance corpus</a> that mention a tilt, most use the phrase to say what has gone.</p>
<ul>
<li>${quote(EDWIN_COE, 'Perhaps the most significant change is the removal of the long-established paragraph 11(d) tilted balance.', 'Edwin Coe, <a href="https://insights.edwincoe.com/post/102nrk9/the-national-planning-policy-framework-2026-what-has-changed-and-why-it-matters">The National Planning Policy Framework 2026: What Has Changed and Why It Matters</a>, August 2026')}</li>
<li>${quote(MICHELMORES, 'The paragraph 11 presumption and tilted balance have been replaced by new national decision-making policies s4 (development within settlements) and s5 (development outside settlements).', 'Michelmores, <a href="https://www.michelmores.com/planning-law-insight/the-national-planning-policy-framework-2026/">The National Planning Policy Framework 2026</a>, 20 August 2026')}</li>
<li>${quote(AGORA, 'Housing-land supply remains a live question in plan-making and decision-taking, but the former "tilted balance" tests of the old Paragraph 11(d) belong to the previous Framework.', 'AGORA Architects, <a href="https://www.agoraarchitects.co.uk/insights/nppf-2026-planning-policy-guide">NPPF 2026: What the New Planning Policies Mean for Residential Development</a>, August 2026')}</li>
<li>${quote(PG_PRESUMPTION, 'A shortage of housing land and poor housing delivery can still be very powerful, but they now operate principally as evidence of unmet need within the new policy structure rather than switching on the old paragraph 11(d) balance.', 'Planning Geek, <a href="https://www.planninggeek.co.uk/policy/presumption-in-favour-of-sustainable-development/">Presumption in favour of sustainable development</a>, 17 September 2026')}</li>
</ul>
<p>A few keep the words as shorthand for the new S5 balance. None argues that the old mechanism survives; the appellant's document below is the strongest claim, and it is advocacy.</p>
<ul>
<li>A barrister on the <a href="https://www.youtube.com/watch?v=pYn_vaX7HUw">Have We Got Planning News For You</a> podcast on 18 August 2026 said a sub five-year supply or a sub 75% Housing Delivery Test result "will trigger" what he called "the new tilted balance", adding that it "isn't the only way to get through". The source is the automatic transcript.</li>
<li>Zack Simons KC, on the day the Framework was published, wrote that "the new tilted balance is likely to be failed if" a proposal fails a "should be refused" policy.</li>
<li>Landmark Chambers' webinar slides of 3 September 2026 summarise GB7 as ${quote(LANDMARK, 'If not inappropriate then tilt in favour of approval', 'Landmark Chambers, <a href="https://www.landmarkchambers.co.uk/web-content/uploads/PDFs-documents-and-other-resources/Resources/NPPF-2026-webinar-An-Initial-Look.pdf">NPPF 2026 webinar: An Initial Look</a>, slide 16')}</li>
<li>SLR Consulting, for Miller Homes at the Colwell Farm inquiry in Mid Sussex, argued on 3 September 2026 that the new test is stronger than the old one: ${quote(COLWELL, 'S5 maintains the ‘tilted balance’ previously found at NPPF24 11d(ii), but with substantial rather than significant weight placed in favour of development – a materially stronger weighting in favour of development than the previous NPPF24 11d(ii) tilted balance.', 'SLR Consulting for Miller Homes, <a href="https://www.midsussex.gov.uk/media/gjkluaml/id32-appellant-letter-to-inspector-on-nppf-2026.pdf">Appellant\'s response on the NPPF 2026</a>, Colwell Farm inquiry document ID32, ¶2.23')}</li>
</ul>
<p>The Ministry itself uses "tilt" for the 2026 presumption, as a description rather than a test. Its response to the consultation records that respondents objected to "substantially outweigh" as the basis "for disapplying the ‘tilt’ in favour of development", and says that an allocation "can be a reason for disapplying the positive tilt in favour of development within settlements".</p>
${quote(GOV_RESPONSE, 'It has also been clarified that the allocation or safeguarding of buildings, as well as land, can be a reason for disapplying the positive tilt in favour of development within settlements.', 'MHCLG, <a href="https://assets.publishing.service.gov.uk/media/6a82fcec3bd75b81e2329a89/National_Planning_Policy_Framework_consultation_-_government_response.pdf">Proposed reforms to the National Planning Policy Framework: government response</a>, August 2026')}
<h3>Inspectors</h3>
<p>${lettersUsingPhrase.length === 1 ? 'One letter' : num(lettersUsingPhrase.length) + ' letters'} in the ${num(refs.length)} decision letters held ${lettersUsingPhrase.length === 1 ? 'uses' : 'use'} the phrase, and only to describe what happened under the previous Framework.</p>
${dl('PINS-6007348', 'The Council noted in their planning officer report that they were unable to demonstrate a five-year housing land supply and therefore, the ‘tilted balance’ found at paragraph 11(d) ii, as it was in the previous Framework, was engaged.', 42)}
<h3>Councils</h3>
<p>The <a href="/research/authority/officer-reports-compared/">council sweep</a> holds ${num(reports.length)} officer report texts. ${num(reportsUsingPhrase.length)} use the phrase, and ${num(reportsNewFramework.length)} of those also cite the 2026 policies. Allowing for the same report held twice, that is ${num(docsNew.size)} documents from ${num(councilsNew.size)} councils. They fall into five groups.</p>
<ul>
<li><strong>${num(byClass.past.size)} recount the 2024 mechanism as history</strong>, or as the basis of an earlier permission: ${esc([...byClass.past].join('; '))}.</li>
<li><strong>${num(byClass.notengaged.size)} say the tilt is not engaged</strong> because supply is healthy, both from Malvern Hills. One still reasons through paragraph 11(d) and paragraph 14 of the old text to get there.</li>
<li><strong>${num(byClass.thirdparty.size)} use the phrase only when summarising objectors</strong> or a parish council, all from Cotswold.</li>
<li><strong>${num(byClass.newterm.size)} use "tilted balance" as a name for the S4 or S5 presumption</strong>, with 2026 reasoning: ${esc([...byClass.newterm].join('; '))}.</li>
<li><strong>${num(byClass.oldapplied.size)} apply the 2024 mechanism after it had gone</strong>: ${esc([...byClass.oldapplied].join('; '))}.</li>
</ul>
${quote(DACORUM, 'The 2026 NPPF adopts a different approach to the tilted balance. The national decision-making policies no longer apply the previous test of whether the policies most important for determining an application are out-of-date. Instead, Policies S3–S5 establish the national policy approach to the principle of development according to its location.', `Dacorum Borough Council, <a href="${DECISION_PAGES}dacorum-25-01880-MOA.html">Land east of Tring, 25/01880/MOA</a>, update report to committee following publication of the 2026 NPPF, ¶3.3`)}
${quote(ELMBRIDGE, 'Following updates to the NPPF in August 2026, Footnote 7 removed and the so called ‘tilted balance’ have been removed. The proposal has been considered under the current version of the NPPF and the relevant national decision-making policies within it.', 'Elmbridge Borough Council, Former Moore Place Golf Course, Esher, 2025/3373, committee report, ¶819')}
${quote(MALVERN, 'The Authority can demonstrate approximately 5.48 years of deliverable housing land supply, housing delivery has exceeded the identified requirement, and the identified supply of approximately 21,357 dwellings exceeds the plan requirement by approximately 2,505 dwellings. On that basis, the tilted balance is not engaged.', 'Malvern Hills District Council, Brookfield, Shoulton Lane, Hallow, M/26/01143/PIP, delegated report, 26 August 2026')}
<p>The fourth group is harmless shorthand. Tonbridge and Malling's two delegated reports say the assessment "will be determined in the context of the tilted balance" and then apply S3 and S4 correctly.</p>
${quote(TM_00079, 'The remainder of the assessment will be determined in the context of the tilted balance and the presumption in favour of sustainable development. As per Policies S3 and S4, development proposals within settlements should be approved unless the benefits of doing so would be substantially outweighed by any adverse effects', 'Tonbridge and Malling Borough Council, Former Grimbles, Long Mill Lane, Crouch, TM/26/00079/FL, delegated report, ¶5.5')}
<p>The fifth group is the one that matters. Maldon District Council's committee reports of 2 September, 22 September and 15 October 2026 each find that the council cannot show a five-year supply and conclude that a plan policy is "out of date" and the tilted balance "applied", then run S5(1)(j)(i) and S3 as the new form of the same thing. Basildon Borough Council's report of 7 October 2026 for 19 houses at Knights, Basildon, cites S3, S4 and S5 and then engages paragraph 11.</p>
${quote(MALDON_00607, 'The tilted balance is therefore applied as policy S2 is currently out of date and not in accordance with the requirements of the NPPF.', 'Maldon District Council, Land 100m east of 53 Seagers, Great Totham, 25/00607/OUTM, report to committee, 22 September 2026')}
${quote(BASILDON, 'The Council has published a 2.05 housing land supply position, and as the Council cannot currently demonstrate a five-year housing land supply the “Tilted Balance” of NPPF paragraph 11 is engaged, and this weighs significantly in favour of approving applications for new housing.', 'Basildon Borough Council, Knights, Basildon, 25/01657/FULL, report to Planning Committee, 7 October 2026, ¶1.5')}
<p>In Basildon the site is within a settlement, so S4 would have given the same starting point without it. In Maldon the sites are outside settlements and the reasoning does more work: "out of date" is a 2024 concept, and under Annex A paragraph 2 the question is whether the settlement boundary policy is materially inconsistent with the Framework, not whether supply has fallen. The outcome under S5(1)(j) may well be the same. The route is not. These are the carry-overs the <a href="/research/authority/officer-reports-compared/">four errors</a> page scores across councils.</p>
</section>`;
check(HWGPNFY, 'will trigger');
check(HWGPNFY, 'the new tilted balance');
check(HWGPNFY, "isn't the only way to get through");
check(PLANORAKS, 'the new tilted balance is likely to be failed if');
check(GOV_RESPONSE, 'for disapplying the ‘tilt’ in favour of development');
check(COLWELL, 'growth at the edge of settlements should be permitted unless the new tilted balance is not satisfied');
check(PG_VS, 'That route was commonly called the tilted balance.');
check(EDGARS, 'the replacement of the familiar “tilted balance” with a more permanent, location based presumption in favour of sustainable development');
check(BASILDON, 'Report to: Planning Committee 7 October 2026 PLANNING APPLICATION 25/01657/FULL');
check(BASILDON, 'CONSTRUCTION OF 19 HOUSES');
check(ELMBRIDGE, 'Former Moore Place Golf Course Portsmouth Road Esher');
check(MALVERN, 'Decision date: 26 August 2026');
check(DACORUM, 'LAND EAST OF TRING: 25/01880/MOA');
check(NORTH_HERTS, '25/02064/OP – Hambridge Way, Pirton');

const SOURCES_LIST = [
  `Ministry of Housing, Communities and Local Government (MHCLG), <a href="${GOVUK_NPPF}">National Planning Policy Framework</a>, 17 August 2026, and the <a href="${NPPF_2024_PDF}">December 2024 edition</a>. Both texts are held in the research repository under <code>data/open-sources/nppf/</code>; the <a href="${NPPF_MD}">Markdown edition</a> of the 2026 text is linked from each policy code.`,
  'MHCLG, <a href="https://assets.publishing.service.gov.uk/media/6a82fcec3bd75b81e2329a89/National_Planning_Policy_Framework_consultation_-_government_response.pdf">Proposed reforms to the National Planning Policy Framework: government response</a>, August 2026.',
  'Edwin Coe, <a href="https://insights.edwincoe.com/post/102nrk9/the-national-planning-policy-framework-2026-what-has-changed-and-why-it-matters">The National Planning Policy Framework 2026: What Has Changed and Why It Matters</a>, August 2026. Michelmores, <a href="https://www.michelmores.com/planning-law-insight/the-national-planning-policy-framework-2026/">The National Planning Policy Framework 2026</a>, 20 August 2026. AGORA Architects, <a href="https://www.agoraarchitects.co.uk/insights/nppf-2026-planning-policy-guide">NPPF 2026: What the New Planning Policies Mean for Residential Development</a>, August 2026. Edgars, <a href="https://www.edgarslimited.co.uk/2026/01/23/draft-nppf-consultation-rural-development/">Draft NPPF Consultation: Rural Development</a>, 23 January 2026.',
  'Planning Geek, <a href="https://www.planninggeek.co.uk/policy/presumption-in-favour-of-sustainable-development/">Presumption in favour of sustainable development</a>, 17 September 2026, and <a href="https://www.planninggeek.co.uk/policy/nppf-2024-vs-2026/">NPPF 2024 vs 2026</a>.',
  'Have We Got Planning News For You, <a href="https://www.youtube.com/watch?v=pYn_vaX7HUw">The New National Planning Policy Framework, August 2026 (S20 E1)</a>, 18 August 2026 (automatic transcript). Zack Simons KC, <a href="https://www.planoraks.com/posts-1/nppf2026-welcome-to-the-future">#NPPF2026: Welcome to the Future!</a>, #planoraks, 18 August 2026. Landmark Chambers, <a href="https://www.landmarkchambers.co.uk/web-content/uploads/PDFs-documents-and-other-resources/Resources/NPPF-2026-webinar-An-Initial-Look.pdf">NPPF 2026 webinar: An Initial Look</a>, slides, 3 September 2026.',
  'SLR Consulting for Miller Homes, <a href="https://www.midsussex.gov.uk/media/gjkluaml/id32-appellant-letter-to-inspector-on-nppf-2026.pdf">National Planning Policy Framework 2026: Appellant\'s Response</a>, Colwell Farm inquiry document ID32, Mid Sussex District Council, 3 September 2026.',
  `Council officer reports: Basildon Borough Council, Planning Committee 7 October 2026, 25/01657/FULL; Dacorum Borough Council, Development Management Committee update on 25/01880/MOA; Elmbridge Borough Council, Planning Committee, 2025/3373; Malvern Hills District Council, delegated report M/26/01143/PIP, 26 August 2026; North Hertfordshire Council, committee update on 25/02064/OP. All held as text in the private sources checkout and counted by <code>pages/england/tilted-balance/build.mjs</code>.`,
  `Decision letters: the Planning Inspectorate <a href="https://appeal-planning-decision.service.gov.uk/">appeals service</a>; every letter quoted is held in the research repository under <code>data/open-sources/pins-corpus/</code>, and every paragraph number is proved from the letter when the page is built.`,
  `The <a href="${DECISION_PAGES}">decisions database</a> and the analysis note <code>data/decisions/analysis/principle-and-balance.md</code> (§P3 and §2a, on "physically well-related") in the research repository.`,
  `Companion pages: <a href="${PRESUMPTION}">"Substantially outweighed"</a>, on the balance itself and its register of decisions; <a href="${VSC}">Very special circumstances</a>, on the Green Belt test; <a href="${SETTLEMENT}">What is a settlement</a>, on the S4 and S5 fork; and <a href="${SUSTAINABLE}">Assessing a sustainable location</a>, on TR3.`,
];

const asAt = [...caseById.values()].map((c) => c.decision_date).sort().slice(-1)[0];
const html = page({
  title: 'Is there still a tilted balance?',
  description: `What the December 2024 "tilted balance" was, what a housing land supply shortfall switched on, and what the same shortfall does under the August 2026 NPPF: a grid of ${nRows} situations by location, scale and type, with and without a shortfall, under both Frameworks; the "physically well-related" gate; and who still uses the words.`,
  url: URL,
  breadcrumb: '<a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/england/">England</a> › Tilted balance',
  h1: 'Is there still a tilted balance?',
  dek: `What a housing shortfall switched on under the December 2024 NPPF, what it does under the August 2026 Framework, and a grid of ${nRows} situations by location, scale and type showing where each gives a presumption in favour. Decisions to ${esc(fmtLong(asAt))}.`,
  body: extraCss + short + meant + grid + survives + gate + term,
  sources: SOURCES_LIST,
  credit: `Prepared by Planning Distilled. External sources were retrieved on ${RETRIEVED}.`,
});

const out = path.join(SITE, SITE_PATH);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`wrote ${path.join(out, 'index.html')}: ${nRows} grid rows; S5(1)(j) ${jCases.size} cases, ${jFailCases.size} fail (${jFailWellRelated.size} on well-related), ${jPassCases.size} pass; ${lettersWellRelated.length} letters use "physically well-related"; ${lettersUsingPhrase.length} of ${refs.length} letters use "tilted balance"; council reports ${reports.length} total, ${reportsUsingPhrase.length} use the phrase, ${reportsNewFramework.length} also cite S4/S5; ${corpusTilted.length} guidance summaries mention a tilt`);
