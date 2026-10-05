// Station Road Decision Route: builds the page and one list page per "decisions that concur" box.
//
//   node pages/settlement/claverdon/station-road-decision-route/build.mjs            # into main-site
//   node pages/settlement/claverdon/station-road-decision-route/build.mjs --artifact # into ./dist for the claude.ai copy
//
// Counts come from data/decisions/index/cases.json; summaries from the case files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DECISIONS, SITE } from '../../../../paths.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT = process.argv.includes('--artifact');
const SITE_PATH = 'research/settlement/claverdon/station-road-decision-route/';
const URL = 'https://planningdistilled.org/' + SITE_PATH;
const OUT = ARTIFACT ? path.join(HERE, 'dist') : path.join(SITE, SITE_PATH);
const DECISION_PAGES = 'https://planningdistilled.org/research/england/nppf-navigator/decisions/';
const TITLE = 'Station Road Decision Route';
const DESCRIPTION = 'Why the Green Belt policies GB6 and GB7, not S5, decide planning application 26/01470/FUL at Land North of Station Road, Claverdon, under the August 2026 NPPF; where the scheme fails the TR3 sustainable-location test; the decisions that agree; and a set of answers to load into the NPPF 2026 Navigator.';

const cases = JSON.parse(fs.readFileSync(path.join(DECISIONS, 'index', 'cases.json'), 'utf8'));
const byCaseId = new Map(cases.map((c) => [c.case_id, c]));
const newest = cases.map((c) => c.decision_date || '').sort().at(-1);

const summaryOf = (c) => {
  const t = fs.readFileSync(path.join(DECISIONS, 'cases', c.case_id + '.md'), 'utf8');
  return (t.match(/## Summary\n([\s\S]*?)\n## /) || [])[1]?.trim() || '';
};
const fw26 = (c) => c.nppf_applied === '2026-08';
const housing = (c) => (c.dev_type || []).some((x) => x.startsWith('housing')) || c.units > 0;
const has = (c, p, fs) => (c.policy_findings || []).some((f) => f.policy.startsWith(p) && (!fs || fs.includes(f.finding)));
const tag = (c, t) => (c.tags || []).includes(t);
const byId = (ids) => ids.map((i) => byCaseId.get(i) || (() => { throw new Error('missing case ' + i); })());

// Each box: a proposition and the decisions that concur. `notes` picks which finding notes each listing shows.
const gbHousing = cases.filter((c) => c.green_belt && fw26(c) && housing(c));
const smallHousing = cases.filter((c) => housing(c) && c.units && c.units <= 9 && fw26(c));
const BOXES = [
  {
    key: 's5-not-in-green-belt', where: 's5',
    title: 'S5 does not apply in the Green Belt',
    claim: 'Decisions that say in terms that S5 does not apply to Green Belt land, which is decided under GB6 and GB7 instead.',
    notes: /S5|AnnexB:settlement/,
    concur: byId(['PINS-6012115', 'PINS-6009720', 'PINS-6010112', 'PINS-6007668', 'PINS-6009919', 'PINS-6006224', 'PINS-6011889', 'PINS-6011736', 'PINS-6011972', 'PINS-6010260', 'PINS-6007030', 'PINS-6010165', 'PINS-6008539', 'stratford-26-01447-FUL', 'stratford-26-01614-FUL', 'wychavon-W-26-01639-PIP']),
    label: 'say S5 does not apply in the Green Belt',
  },
  {
    key: 'gb6-requires-gb7', where: 's5',
    title: 'GB6(1): no GB7 category, so inappropriate',
    claim: 'Green Belt decisions under the August 2026 Framework that found the proposal failed GB7 and so treated it as inappropriate development under GB6, to be approved only in very special circumstances. The few approvals were on very special circumstances, never by skipping GB7.',
    notes: /^GB[67]/,
    concur: cases.filter((c) => c.green_belt && fw26(c) && has(c, 'GB7', ['fail']) && has(c, 'GB6', ['fail', 'harm', 'pass'])),
    label: 'failed GB7 and were treated as inappropriate development',
  },
  {
    key: 'green-belt-route', where: 's5',
    title: 'Green Belt housing goes to GB6 and GB7',
    claim: 'Housing decisions on Green Belt land under the August 2026 Framework that were decided under GB6 and GB7.',
    notes: /^GB[67]/,
    concur: gbHousing.filter((c) => has(c, 'GB6') || has(c, 'GB7')),
    label: `of ${gbHousing.length} Green Belt housing decisions were decided under GB6 and GB7`,
  },
  {
    key: 'washed-over-not-settlement', where: 's5',
    title: 'A washed-over village is not a "settlement"',
    claim: 'Decisions that applied the Annex B exclusion of villages washed over by the Green Belt from the Framework\'s definition of "settlement".',
    notes: /AnnexB:settlement|S4|S5/,
    concur: byId(['PINS-6009919', 'stratford-26-01614-FUL']),
    label: 'applied the Annex B exclusion',
  },
  {
    key: 'gb7g-iii-fail', where: 'gb7g',
    title: 'Failing the location limb makes it inappropriate',
    claim: 'Decisions that found the site failed GB7(1)(g)(iii), the sustainable-location limb. Every one treated the scheme as inappropriate development, including those where the land was accepted as grey belt.',
    notes: /GB7\(1\)\(g\)|AnnexB:grey-belt|GB6\(2\)/,
    concur: cases.filter((c) => has(c, 'GB7(1)(g)(iii)', ['fail'])),
    label: 'failed (g)(iii) and were treated as inappropriate',
    extra: (s) => `${s.filter((c) => c.grey_belt === 'accepted').length} of them on land accepted as grey belt`,
  },
  {
    key: 'rural-road-location', where: 'tr3',
    title: 'Rural roads without footways',
    claim: 'Decisions under the August 2026 Framework on sites reached by rural roads without footways or lighting that found the location unsustainable or harmful. Most are outside the Green Belt, where the same TR3 test applies.',
    notes: /TR3|GB7\(1\)\(g\)\(iii\)/,
    concur: cases.filter((c) => fw26(c) && tag(c, 'rural-lane-no-footway') && (has(c, 'GB7(1)(g)(iii)', ['fail']) || has(c, 'TR3', ['fail', 'harm', 'conflict']))),
    label: 'under the August 2026 Framework found the location unsustainable or harmful',
  },
  {
    key: 'vsc-small-schemes', where: 'balance',
    title: 'Very special circumstances for small schemes',
    claim: 'Green Belt housing schemes of up to nine homes under the August 2026 Framework that did not show very special circumstances under GB6(2).',
    notes: /GB6\(2\)|HO7/,
    concur: gbHousing.filter((c) => c.units && c.units <= 9 && tag(c, 'vsc-not-shown')),
    label: 'did not show very special circumstances',
  },
  {
    key: 'heritage-small-schemes', where: 'balance',
    title: 'Heritage harm against a few homes',
    claim: 'Housing schemes of up to nine homes where the HE6(4) balance found the harm to a designated heritage asset not outweighed by the public benefits.',
    notes: /HE6/,
    concur: smallHousing.filter((c) => has(c, 'HE6(4)', ['fail'])),
    label: 'found the harm not outweighed, and all were refused or dismissed',
  },
  {
    key: 'dp3-3-refuse', where: 'balance',
    title: 'DP3(3) design conflict',
    claim: 'Decisions that found a design conflict without clear justification under DP3(3), which says such proposals "should be refused".',
    notes: /DP3/,
    concur: cases.filter((c) => fw26(c) && has(c, 'DP3(3)', ['fail'])),
    label: 'failed DP3(3), and all were refused or dismissed',
  },
];

// Guard the claims the boxes make about outcomes.
const refusedLike = (c) => ['dismissed', 'refused'].includes(c.outcome);
for (const k of ['heritage-small-schemes', 'dp3-3-refuse']) {
  const odd = BOXES.find((x) => x.key === k).concur.filter((c) => !refusedLike(c));
  if (odd.length) throw new Error(`${k}: not all refused or dismissed: ${odd.map((c) => c.case_id)}`);
}
for (const c of BOXES.find((x) => x.key === 'gb7g-iii-fail').concur) {
  if (!refusedLike(c) && !has(c, 'GB6(2)')) throw new Error('gb7g-iii-fail: ' + c.case_id + ' not treated as inappropriate');
}

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clean = (n) => String(n).replace(/^mapped\s*[-:]\s*/i, '');
const MAKER = { inspector: 'Appeal', 'secretary-of-state': 'Secretary of State', 'lpa-committee': 'Council committee', 'lpa-delegated': 'Council (delegated)' };
const OUTCOME = { dismissed: 'Dismissed', refused: 'Refused', allowed: 'Allowed', approved: 'Approved', split: 'Split', 'part-allowed': 'Part allowed' };
const fmtDate = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const LICENCE = '&copy; Planning Distilled. Text, data and images on this page are released under the <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 licence</a>: share and adapt them freely, with credit to Planning Distilled. Quotations from decision letters, plans and the Framework remain the copyright of their publishers. Source and data: <a href="https://github.com/planningdistilled/research">github.com/planningdistilled/research</a>.';
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Public+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap">';

// Site pages get a full document head; the artifact copy of the main page stays a fragment (the artifact adds its own skeleton).
const head = (title, description, url) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${ARTIFACT ? '' : `<link rel="canonical" href="${url}">\n`}<link rel="license" href="https://creativecommons.org/licenses/by/4.0/">
`;

function caseCard(c, noteRe) {
  const shown = (c.policy_findings || []).filter((f) => noteRe.test(f.policy) && f.note);
  const isAppeal = c.decision_maker === 'inspector' || c.decision_maker === 'secretary-of-state';
  const ref = c.appeal_ref ? `Appeal ${c.appeal_ref}` : c.lpa_ref || c.case_id;
  const sum = summaryOf(c);
  return `<article class="case" id="${esc(c.case_id)}">
  <div class="case-head"><h3>${esc(c.title)}</h3><span class="pill ${refusedLike(c) ? 'no' : 'ok'}">${esc(OUTCOME[c.outcome] || c.outcome)}</span></div>
  <p class="meta">${esc(isAppeal ? ref : c.lpa_ref || ref)} · ${esc(c.authority)} · ${esc(MAKER[c.decision_maker] || c.decision_maker)} · ${esc(fmtDate(c.decision_date))}${c.units ? ` · ${c.units} home${c.units > 1 ? 's' : ''}` : ''}</p>
  ${shown.length ? `<ul class="findings">${shown.map((f) => `<li><span class="code">${esc(f.policy)}</span> <span class="f">${esc(f.finding)}</span> ${esc(clean(f.note))}</li>`).join('')}</ul>` : ''}
  ${sum ? `<p class="sum">${esc(sum)}</p>` : ''}
  <p class="more"><a href="${DECISION_PAGES}${encodeURIComponent(c.case_id)}.html">Full summary and sources</a></p>
</article>`;
}

const STYLE = fs.readFileSync(path.join(HERE, 'list.css'), 'utf8');
function listPage(b) {
  const list = [...b.concur].sort((x, y) => (y.decision_date || '').localeCompare(x.decision_date || ''));
  const title = `${b.title}: decisions behind the Station Road route`;
  return `${head(title, `${b.claim} ${b.concur.length} decisions from the Planning Distilled decisions database, with their findings and summaries, cited on the Station Road Decision Route page for 26/01470/FUL, Claverdon.`, URL + 'cases/' + b.key + '.html')}${FONTS}
<style>${STYLE}</style></head><body><main>
<p class="back"><a href="../index.html#${b.where}">Back to Station Road Decision Route</a></p>
<header><p class="eyebrow">Decisions behind the Station Road route</p><h1>${esc(b.title)}</h1><p class="dek">${esc(b.claim)}</p>
<p class="fine">From the Planning Distilled decisions database: ${cases.length.toLocaleString('en-GB')} decisions, the newest dated ${esc(fmtDate(newest))}. Newest first.</p></header>
<section class="group"><h2>${b.concur.length} ${esc(b.label)}</h2>
${list.map((c) => caseCard(c, b.notes)).join('\n')}
</section>
<footer><p>Summaries and finding notes are from the Planning Distilled decisions database. Each links to the full summary with its sources. Not legal advice.</p><p class="licence">${LICENCE}</p></footer>
</main></body></html>
`;
}

function box(b) {
  const extra = b.extra ? `<p class="tally-extra">${esc(b.extra(b.concur))}</p>` : '';
  return `<aside class="tally">
  <p class="tally-title">${esc(b.title)}</p>
  <p class="tally-count"><strong>${b.concur.length}</strong> ${esc(b.label)}</p>
  ${extra}
  <a class="tally-link" href="cases/${b.key}.html">See the ${b.concur.length} decisions</a>
</aside>`;
}

let page = fs.readFileSync(path.join(HERE, 'page.html'), 'utf8');
for (const where of [...new Set(BOXES.map((b) => b.where))]) {
  const re = new RegExp(`(<!-- boxes:${where} -->)[\\s\\S]*?(<!-- /boxes -->)`);
  if (!re.test(page)) throw new Error('marker missing: ' + where);
  page = page.replace(re, `$1\n<div class="tallies">\n${BOXES.filter((b) => b.where === where).map(box).join('\n')}\n</div>\n$2`);
}
if (!ARTIFACT) {
  // page.html opens with its own <title>; replace it with the full head and close the head before <main>.
  const i = page.indexOf('<main>');
  const top = page.slice(0, i).replace(/<title>[\s\S]*?<\/title>\n?/, '');
  page = `${head(TITLE, DESCRIPTION, URL)}${top}</head>\n<body>\n${page.slice(i)}\n</body></html>\n`;
}

fs.mkdirSync(path.join(OUT, 'cases'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), page);
for (const b of BOXES) fs.writeFileSync(path.join(OUT, 'cases', b.key + '.html'), listPage(b));
for (const b of BOXES) console.log(`${b.key}: ${b.concur.length}`);
console.log(`✓ wrote ${BOXES.length + 1} pages to ${path.relative(process.cwd(), OUT) || '.'}`);
