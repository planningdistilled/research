// Kington Lane Decision Route: builds the page, its evidence register and one list page per decisions box.
//
//   node pages/settlement/claverdon/kington-lane-decision-route/build.mjs            # into main-site
//   node pages/settlement/claverdon/kington-lane-decision-route/build.mjs --check    # verify only, write nothing
//
// Every quotation is checked before anything is written:
//   - each entry in evidence.mjs must appear in the text of the document and page it cites
//     (application documents are read from the private sources checkout, the Framework and appeal letters from data/open-sources);
//   - each <q data-q="id"> in page.html must be a run of words from that entry.
// The answer sets in answers.mjs are run through the Navigator engine and must end on the outcome they declare.
// Counts in the boxes come from data/decisions/index/cases.json; summaries from the case files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DECISIONS, SITE, hasSources, resolveRef } from '../../../../paths.mjs';
import { addAnchors, ANCHOR_CSS } from '../../../_shared/anchors.mjs';
import { addPlanLinks } from '../../../_shared/plan-links.mjs';
import { APPLICATION, DOCS, TOPICS, QUOTES } from './evidence.mjs';
import { ANSWER_SETS } from './answers.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CHECK = process.argv.includes('--check');
const SITE_PATH = 'research/settlement/claverdon/kington-lane-decision-route/';
const URL = 'https://planningdistilled.org/' + SITE_PATH;
const OUT = path.join(SITE, SITE_PATH);
const DECISION_PAGES = 'https://planningdistilled.org/research/england/nppf-navigator/decisions/';
const TITLE = 'Kington Lane Decision Route';
const DESCRIPTION = 'A step-by-step assessment of planning application 26/01831/FUL (10 homes at Greenfingers Nurseries, Kington Lane, Claverdon) against the August 2026 NPPF: the previously developed land and grey belt routes through GB7, the TR3 location test, the Golden Rules, the policies that say development should be refused, the decisions behind each step, and answers to load into the NPPF 2026 Navigator.';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unesc = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;|&lsquo;/g, "'").replace(/&ldquo;|&rdquo;/g, '"').replace(/&ndash;|&mdash;/g, '-').replace(/&nbsp;/g, ' ');
// Compare text, not typography: quote marks, dashes, ligatures, line-wrap hyphens and white space are levelled.
const norm = (s) => s.normalize('NFKC').replace(/[‘’‛′`]/g, "'").replace(/[“”]/g, '"').replace(/[‐-―]/g, '-')
  .replace(/­/g, '').replace(/\s+/g, ' ').replace(/(\w)- (?=\w)/g, '$1-').trim();

// ---------- evidence: every quotation against its source ----------
const textCache = new Map();
function docPages(doc) {
  if (textCache.has(doc.key)) return textCache.get(doc.key);
  const file = resolveRef(doc.ref);
  if (!fs.existsSync(file)) { textCache.set(doc.key, null); return null; }
  const raw = fs.readFileSync(file, 'utf8');
  let pages;
  if (/^=== PAGE \d+ ===$/m.test(raw)) {
    pages = new Map();
    const parts = raw.split(/^=== PAGE (\d+) ===$/m);
    for (let i = 1; i < parts.length; i += 2) pages.set(Number(parts[i]), parts[i + 1]);
  } else if (raw.includes('\f')) {
    pages = new Map(raw.split('\f').map((t, i) => [i + 1, t]));
  } else pages = new Map([[0, raw]]);
  const out = { pages, whole: norm(raw.replace(/^=== PAGE \d+ ===$/gm, ' ').replace(/\f/g, ' ')) };
  textCache.set(doc.key, out);
  return out;
}

const docByKey = new Map(DOCS.map((d) => [d.key, d]));
const quoteById = new Map();
const problems = [];
let skipped = 0;
for (const q of QUOTES) {
  if (quoteById.has(q.id)) problems.push(`duplicate quote id ${q.id}`);
  quoteById.set(q.id, q);
  const doc = docByKey.get(q.doc);
  if (!doc) { problems.push(`${q.id}: unknown document ${q.doc}`); continue; }
  if (!TOPICS.some((t) => t.key === q.topic)) problems.push(`${q.id}: unknown topic ${q.topic}`);
  if (doc.ref.startsWith('sources:') && !hasSources()) { skipped++; continue; }
  const text = docPages(doc);
  if (!text) { problems.push(`${q.id}: source text missing for ${doc.key} (${doc.ref})`); continue; }
  const want = norm(q.text);
  if (q.page != null && text.pages.size > 1) {
    // A quotation may run over a page break: accept the cited page joined to the next.
    const here = norm((text.pages.get(q.page) || '') + ' ' + (text.pages.get(q.page + 1) || ''));
    if (!here.includes(want)) problems.push(`${q.id}: not found on p.${q.page} of ${doc.key}${text.whole.includes(want) ? ' (it is elsewhere in the document)' : ''}`);
  } else if (!text.whole.includes(want)) problems.push(`${q.id}: not found in ${doc.key}`);
}

// ---------- the decisions database ----------
const cases = JSON.parse(fs.readFileSync(path.join(DECISIONS, 'index', 'cases.json'), 'utf8'));
const byCaseId = new Map(cases.map((c) => [c.case_id, c]));
const newest = cases.map((c) => c.decision_date || '').sort().at(-1);
const summaryOf = (c) => {
  const t = fs.readFileSync(path.join(DECISIONS, 'cases', c.case_id + '.md'), 'utf8');
  return (t.match(/## Summary\n([\s\S]*?)\n## /) || [])[1]?.trim() || '';
};
const fw26 = (c) => c.nppf_applied === '2026-08';
const housing = (c) => (c.dev_type || []).some((x) => x.startsWith('housing')) || c.units > 0;
const has = (c, p, fs_) => (c.policy_findings || []).some((f) => f.policy.startsWith(p) && (!fs_ || fs_.includes(f.finding)));
const tag = (c, t) => (c.tags || []).includes(t);
const byId = (ids) => ids.map((i) => byCaseId.get(i) || (() => { throw new Error('missing case ' + i); })());
const refusedLike = (c) => ['dismissed', 'refused'].includes(c.outcome);

// Each box: a proposition and the decisions that concur. `other` (optional) is the list that went the other way.
const gbHousing = cases.filter((c) => c.green_belt && fw26(c) && housing(c));
const pdlOpennessFail = byId(['PINS-6011972', 'PINS-6007030', 'PINS-6007316', 'tmbc-25-01976-PA', 'cheshireeast-25-2053-FUL']);
const pdlOpennessPass = cases.filter((c) => c.green_belt && housing(c) && has(c, 'GB7(1)(e)', ['pass']));
const BOXES = [
  {
    key: 'pdl-not-met', where: 'pdl',
    title: 'Not previously developed land',
    claim: 'Decisions that found land was not previously developed land as Annex B defines it, because it was last occupied by agricultural buildings or because only part of the site qualified. Inspectors have required the whole site to be previously developed land before GB7(1)(e) applies.',
    notes: /GB7\(1\)\(e\)|AnnexB:PDL/,
    concur: byId(['PINS-6011330', 'PINS-6009281', 'PINS-6012481', 'PINS-6009919', 'PINS-6009691', 'PINS-6009303', 'PINS-6008723', 'bromsgrove-25-01429-FUL', 'stratford-26-01447-FUL']),
    label: 'found the land, or part of it, was not previously developed land',
  },
  {
    key: 'pdl-openness', where: 'openness',
    title: 'Housing on previously developed land: openness',
    claim: 'Green Belt housing decisions that accepted the land as previously developed and then asked whether the redevelopment would cause substantial harm to openness, the test in GB7(1)(e). Those that found substantial harm are listed first.',
    notes: /GB7\(1\)\(e\)/,
    concur: pdlOpennessFail,
    other: pdlOpennessPass,
    label: 'found substantial harm to openness, so GB7(1)(e) was not met',
    otherLabel: 'found the harm fell short of substantial; most were a single replacement home',
  },
  {
    key: 'gb7g-iii-fail', where: 'location',
    title: 'Failing the location limb makes it inappropriate',
    claim: 'Decisions that found the site failed GB7(1)(g)(iii), the sustainable-location limb. Every one treated the scheme as inappropriate development, including those where the land was accepted as grey belt.',
    notes: /GB7\(1\)\(g\)|AnnexB:grey-belt|GB6\(2\)/,
    concur: cases.filter((c) => has(c, 'GB7(1)(g)(iii)', ['fail'])),
    other: cases.filter((c) => housing(c) && has(c, 'GB7(1)(g)(iii)', ['pass'])),
    label: 'failed (g)(iii) and were treated as inappropriate',
    otherLabel: 'housing decisions passed the limb',
  },
  {
    key: 'rural-road-location', where: 'location',
    title: 'Rural roads without footways',
    claim: 'Decisions under the August 2026 Framework on sites reached by rural roads without footways or lighting that found the location unsustainable or harmful. Most are outside the Green Belt, where the same TR3 test applies.',
    notes: /TR3|GB7\(1\)\(g\)\(iii\)/,
    concur: cases.filter((c) => fw26(c) && tag(c, 'rural-lane-no-footway') && (has(c, 'GB7(1)(g)(iii)', ['fail']) || has(c, 'TR3', ['fail', 'harm', 'conflict']))),
    label: 'under the August 2026 Framework found the location unsustainable or harmful',
  },
  {
    key: 'golden-rules', where: 'gb8',
    title: 'The Golden Rules on major schemes',
    claim: 'Decisions on major Green Belt housing that tested the Golden Rules in GB8. Those that found a rule was not met are listed first.',
    notes: /GB8|GB7\(1\)\(g\)\(iv\)/,
    concur: cases.filter((c) => has(c, 'GB8', ['fail']) || has(c, 'GB7(1)(g)(iv)', ['fail'])),
    other: cases.filter((c) => has(c, 'GB8', ['pass', 'benefit']) || has(c, 'GB7(1)(g)(iv)', ['pass'])),
    label: 'found the Golden Rules were not met',
    otherLabel: 'found them met',
  },
  {
    key: 'highway-safety', where: 'triggers',
    title: 'TR6(4): unacceptable impact on highway safety',
    claim: 'Decisions under the August 2026 Framework that found an unacceptable impact on highway safety, or a severe impact on the network, under TR6(4), which says such proposals "should be refused".',
    notes: /TR6/,
    concur: cases.filter((c) => fw26(c) && has(c, 'TR6(4)', ['fail'])),
    label: 'failed TR6(4), and all were refused or dismissed',
  },
  {
    key: 'flooded-access', where: 'triggers',
    title: 'Flood risk on the access route',
    claim: 'Appeal decisions under the August 2026 Framework where the buildings were clear of flooding but the only access was not, or where safe access and escape in a flood was not shown. Each was dismissed.',
    notes: /^F[4-7]/,
    concur: byId(['PINS-6010729', 'PINS-6011079', 'PINS-6010951', 'PINS-6009718', 'PINS-6004952']),
    label: 'were dismissed where safe access in a flood was not shown',
  },
  {
    key: 'vsc-housing', where: 'vsc',
    title: 'Very special circumstances for housing',
    claim: 'Green Belt housing decisions under the August 2026 Framework that found the scheme inappropriate and then asked whether very special circumstances existed under GB6(2).',
    notes: /GB6\(2\)|HO7/,
    concur: gbHousing.filter((c) => tag(c, 'vsc-not-shown')),
    other: gbHousing.filter((c) => tag(c, 'vsc-shown')),
    label: 'did not show very special circumstances',
    otherLabel: 'did',
  },
];

// Guard the claims the boxes make about outcomes.
for (const k of ['highway-safety', 'flooded-access']) {
  const odd = BOXES.find((x) => x.key === k).concur.filter((c) => !refusedLike(c));
  if (odd.length) problems.push(`${k}: not all refused or dismissed: ${odd.map((c) => c.case_id)}`);
}
for (const c of BOXES.find((x) => x.key === 'gb7g-iii-fail').concur) {
  if (!refusedLike(c) && !has(c, 'GB6(2)')) problems.push('gb7g-iii-fail: ' + c.case_id + ' not treated as inappropriate');
}
for (const c of pdlOpennessFail) if (!has(c, 'GB7(1)(e)', ['fail'])) problems.push('pdl-openness: ' + c.case_id + ' has no GB7(1)(e) fail finding');
{
  const single = pdlOpennessPass.filter((c) => c.units === 1).length;
  if (single * 2 <= pdlOpennessPass.length) problems.push('pdl-openness: "most were a single replacement home" no longer holds');
}

// ---------- the answer sets, through the Navigator engine ----------
let engineChecked = false;
try {
  const { loadTs } = await import('../../../england/nppf-navigator/build/lib.mjs');
  const { graph } = await loadTs('graph/index.ts');
  const { evaluate, prune } = await loadTs('src/engine/evaluate.ts');
  for (const s of ANSWER_SETS) {
    const ev = evaluate(graph, s.answers);
    const dropped = Object.keys(s.answers).filter((k) => !(k in prune(graph, s.answers)));
    if (dropped.length) problems.push(`answers ${s.key}: off-route answers ${dropped.join(', ')}`);
    if (ev.next) problems.push(`answers ${s.key}: incomplete, next question is ${ev.next.id}`);
    if (ev.facts.route !== s.expect.route) problems.push(`answers ${s.key}: route ${ev.facts.route}, expected ${s.expect.route}`);
    if (ev.outcome?.id !== s.expect.outcome) problems.push(`answers ${s.key}: outcome ${ev.outcome?.id}, expected ${s.expect.outcome}`);
    s.result = { route: ev.facts.route, verdict: ev.outcome?.verdict, title: ev.outcome?.title, findings: ev.findings.map(({ kind, policy, text, weight }) => ({ kind, policy, text, weight })) };
  }
  engineChecked = true;
} catch (e) {
  if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e;
  console.warn('! Navigator engine not available (run npm ci in pages/england/nppf-navigator): answer sets not checked');
}

// ---------- the page ----------
const LICENCE = '&copy; Planning Distilled. Text, data and images on this page are released under the <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 licence</a>: share and adapt them freely, with credit to Planning Distilled. Quotations from application documents, consultation responses, decision letters, plans and the Framework remain the copyright of their publishers. Source and data: <a href="https://github.com/planningdistilled/research">github.com/planningdistilled/research</a>.';
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Public+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap">';
const head = (title, description, url) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<link rel="license" href="https://creativecommons.org/licenses/by/4.0/">
`;
const MAKER = { inspector: 'Appeal', 'secretary-of-state': 'Secretary of State', 'lpa-committee': 'Council committee', 'lpa-delegated': 'Council (delegated)' };
const OUTCOME = { dismissed: 'Dismissed', refused: 'Refused', allowed: 'Allowed', approved: 'Approved', split: 'Split', 'part-allowed': 'Part allowed' };
const fmtDate = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const clean = (n) => String(n).replace(/^mapped\s*[-:]\s*/i, '');
const where = (q) => [q.page != null ? `p.${q.page}` : '', q.para || ''].filter(Boolean).join(', ');
const citeLabel = (q) => [docByKey.get(q.doc).short, where(q)].filter(Boolean).join(', ');

let page = fs.readFileSync(path.join(HERE, 'page.html'), 'utf8');
const used = new Set();
// <q data-q="id">words from the quotation</q>  ->  the words, in quotation marks, with a link to the register entry.
page = page.replace(/<q data-q="([^"]+)"( data-nocite)?>([\s\S]*?)<\/q>/g, (m, id, nocite, inner) => {
  const q = quoteById.get(id);
  if (!q) { problems.push(`page.html: unknown quote id ${id}`); return m; }
  used.add(id);
  const shown = norm(unesc(inner.replace(/<[^>]+>/g, '')));
  // An ellipsis in the page text stands for words left out: each run must appear, in order.
  let from = 0;
  const source = norm(q.text);
  for (const run of shown.split(/\s*(?:…|\.\.\.)\s*/).filter(Boolean)) {
    const at = source.indexOf(run, from);
    if (at < 0) { problems.push(`page.html: text shown for ${id} is not in the register entry: "${run.slice(0, 70)}"`); break; }
    from = at + run.length;
  }
  return `<q>${inner}</q>${nocite ? '' : ` <a class="cite" href="evidence/#q-${esc(id)}">${esc(citeLabel(q))}</a>`}`;
});
// <blockquote class="ev" data-q="id"></blockquote>  ->  the whole entry, with its citation.
page = page.replace(/<blockquote class="ev" data-q="([^"]+)"><\/blockquote>/g, (m, id) => {
  const q = quoteById.get(id);
  if (!q) { problems.push(`page.html: unknown quote id ${id}`); return m; }
  used.add(id);
  return `<blockquote class="fw"><p>${esc(q.show || q.text)}</p><cite><a href="evidence/#q-${esc(id)}">${esc(docByKey.get(q.doc).title)}${where(q) ? ', ' + esc(where(q)) : ''}</a></cite></blockquote>`;
});
// A plain link into the register must point at an entry that exists.
for (const m of page.matchAll(/href="evidence\/#q-([^"]+)"/g)) {
  if (!quoteById.has(m[1])) problems.push(`page.html: link to unknown register entry ${m[1]}`);
  used.add(m[1]);
}
const box = (b) => `<aside class="tally">
  <p class="tally-title">${esc(b.title)}</p>
  <p class="tally-count"><strong>${b.concur.length}</strong> ${esc(b.label)}</p>
  ${b.other ? `<p class="tally-other"><strong>${b.other.length}</strong> ${esc(b.otherLabel)}</p>` : ''}
  <a class="tally-link" href="cases/${b.key}.html">See the ${b.concur.length + (b.other ? b.other.length : 0)} decisions</a>
</aside>`;
for (const w of [...new Set(BOXES.map((b) => b.where))]) {
  const re = new RegExp(`(<!-- boxes:${w} -->)[\\s\\S]*?(<!-- /boxes -->)`);
  if (!re.test(page)) { problems.push('page.html: marker missing: boxes:' + w); continue; }
  page = page.replace(re, `$1\n<div class="tallies">\n${BOXES.filter((b) => b.where === w).map(box).join('\n')}\n</div>\n$2`);
}
for (const s of ANSWER_SETS) {
  const re = new RegExp(`(<!-- answers:${s.key} -->)[\\s\\S]*?(<!-- /answers -->)`);
  if (!re.test(page)) { problems.push('page.html: marker missing: answers:' + s.key); continue; }
  page = page.replace(re, `$1<pre class="answers-json" id="answers-${s.key}" tabindex="0">${esc(JSON.stringify(s.answers, null, 1))}</pre>$2`);
}
page = page.replace(/<!-- count:cases -->/g, cases.length.toLocaleString('en-GB')).replace(/<!-- date:newest -->/g, fmtDate(newest)).replace(/<!-- count:quotes -->/g, String(QUOTES.length)).replace(/<!-- count:docs -->/g, String(DOCS.filter((d) => d.group !== 'reference').length));

// ---------- decision list pages ----------
const STYLE = fs.readFileSync(path.join(HERE, 'list.css'), 'utf8');
const crumbs = (tail) => `<nav class="back" aria-label="Breadcrumb"><a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/settlement/">Settlements</a> › <a href="/research/settlement/claverdon/">Claverdon</a> › ${tail}</nav>`;
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
const newestFirst = (l) => [...l].sort((x, y) => (y.decision_date || '').localeCompare(x.decision_date || ''));
function listPage(b) {
  const title = `${b.title}: decisions behind the Kington Lane route`;
  return `${head(title, `${b.claim} ${b.concur.length + (b.other?.length || 0)} decisions from the Planning Distilled decisions database, with their findings and summaries, cited on the Kington Lane Decision Route page for 26/01831/FUL, Claverdon.`, URL + 'cases/' + b.key + '.html')}${FONTS}
<style>${STYLE}</style></head><body><main>
${crumbs(`<a href="../index.html#${b.where}">Kington Lane Decision Route</a> › ${esc(b.title)}`)}
<header><p class="eyebrow">Decisions behind the Kington Lane route</p><h1>${esc(b.title)}</h1><p class="dek">${esc(b.claim)}</p>
<p class="fine">From the Planning Distilled decisions database: ${cases.length.toLocaleString('en-GB')} decisions, the newest dated ${esc(fmtDate(newest))}. Newest first.</p></header>
<section class="group"><h2>${b.concur.length} ${esc(b.label)}</h2>
${newestFirst(b.concur).map((c) => caseCard(c, b.notes)).join('\n')}
</section>
${b.other ? `<section class="group"><h2>${b.other.length} ${esc(b.otherLabel)}</h2>\n${newestFirst(b.other).map((c) => caseCard(c, b.notes)).join('\n')}\n</section>` : ''}
<footer><p>Summaries and finding notes are from the Planning Distilled decisions database. Each links to the full summary with its sources. Not legal advice.</p><p class="licence">${LICENCE}</p></footer>
</main></body></html>
`;
}

// ---------- the evidence register ----------
const EV_STYLE = `${STYLE}
.doc-table { border-collapse: collapse; width: 100%; font-size: 14px; background: var(--surface); }
.doc-table th, .doc-table td { text-align: left; vertical-align: top; padding: 8px 10px; border-top: 1px solid var(--line); }
.doc-table thead th { border-top: 0; font-size: 12px; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); background: var(--surface-2); }
.table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 8px; }
.entry { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 14px 16px; display: grid; gap: 6px; }
.entry blockquote { margin: 0; font: 400 16px/1.55 var(--serif); border-left: 3px solid var(--accent); padding-left: 12px; }
.entry .src { font-size: 13px; color: var(--muted); }
.entry .why { font-size: 14px; }
.entry:target { box-shadow: 0 0 0 2px var(--accent); }
.prose { display: grid; gap: 10px; max-width: 70ch; font-size: 15px; }
.toc { margin: 0; padding-left: 18px; display: grid; gap: 3px; font-size: 14.5px; }
`;
const GROUPS = [['applicant', 'Submitted by the applicant'], ['consultee', 'Consultation responses'], ['council', 'Council decisions on the site'], ['reference', 'Policy and appeal decisions']];
function evidencePage() {
  const portal = `<a href="${APPLICATION.portal}">the council's planning file for ${esc(APPLICATION.ref)}</a>`;
  const docRow = (d) => `<tr id="doc-${esc(d.key)}"><td>${esc(d.title)}</td><td>${esc(d.by)}</td><td>${esc(d.dated || '')}</td><td>${d.url ? `<a href="${esc(d.url)}">${esc(d.where)}</a>` : esc(d.where)}</td><td>${QUOTES.filter((q) => q.doc === d.key).length || ''}</td></tr>`;
  const entry = (q) => {
    const d = docByKey.get(q.doc);
    return `<article class="entry" id="q-${esc(q.id)}">
  <blockquote>${esc(q.show || q.text)}</blockquote>
  <p class="src"><a href="#doc-${esc(d.key)}">${esc(d.title)}</a>${d.dated ? ', ' + esc(d.dated) : ''}${where(q) ? ' · ' + esc(where(q)) : ''}${d.scanned ? ' · read from a scanned document' : ''}</p>
  ${q.note ? `<p class="why">${q.note}</p>` : ''}
</article>`;
  };
  return `${head('Kington Lane Decision Route: evidence register', `Every quotation relied on in the Kington Lane Decision Route for planning application 26/01831/FUL, Claverdon: ${QUOTES.length} passages from the application documents, the consultation responses, the council's earlier decisions on the site, the August 2026 NPPF and appeal decisions, each with its document, date and page.`, URL + 'evidence/')}${FONTS}
<style>${EV_STYLE}</style></head><body><main>
${crumbs('<a href="../">Kington Lane Decision Route</a> › Evidence register')}
<header><p class="eyebrow">Evidence behind the Kington Lane route</p><h1>Evidence register for 26/01831/FUL</h1>
<p class="dek">Every quotation used on the <a href="../">Kington Lane Decision Route</a> page, with the document it comes from, its date and its page. ${QUOTES.length} passages from ${DOCS.length} documents.</p>
<p class="fine">Compiled from the documents on the council's file on ${esc(APPLICATION.checked)}. Page numbers are the page of the PDF as published, not the number printed on the page.</p></header>
<section class="group"><h2>How to check a quotation</h2>
<div class="prose">
<p>The application documents and consultation responses are published by Stratford-on-Avon District Council on ${portal}. They are not reproduced here: they belong to their authors. Each entry below names the document as the council lists it and the date it was added, so it can be found on the file. Open the document there and go to the page given.</p>
<p>Each quotation was checked by program against the text of the document when this page was built. A quotation that did not match its cited page would have stopped the build. Several documents on the file are scanned images with no text layer. Those were read by optical character recognition and are marked. Residents' comments on the file are not quoted and their authors are not named.</p>
<p>The National Planning Policy Framework and appeal decision letters are Crown copyright and are linked directly.</p>
</div></section>
<section class="group"><h2>By subject</h2><ul class="toc">${TOPICS.map((t) => `<li><a href="#t-${t.key}">${esc(t.title)}</a> (${QUOTES.filter((q) => q.topic === t.key).length})</li>`).join('')}<li><a href="#documents">The documents</a></li></ul></section>
${TOPICS.map((t) => `<section class="group" id="t-${t.key}"><h2>${esc(t.title)}</h2>\n${QUOTES.filter((q) => q.topic === t.key).map(entry).join('\n')}\n</section>`).join('\n')}
<section class="group" id="documents"><h2>The documents</h2>
${GROUPS.map(([g, label]) => `<h3>${esc(label)}</h3>
<div class="table-wrap"><table class="doc-table"><thead><tr><th>Document</th><th>Author</th><th>Dated</th><th>Where to find it</th><th>Quoted</th></tr></thead><tbody>
${DOCS.filter((d) => d.group === g).map(docRow).join('\n')}
</tbody></table></div>`).join('\n')}
</section>
<footer><p>Prepared by a local resident. Not legal advice.</p><p class="licence">${LICENCE}</p></footer>
</main></body></html>
`;
}

// ---------- write ----------
const unused = QUOTES.filter((q) => !used.has(q.id) && !q.registerOnly).map((q) => q.id);
if (unused.length) console.warn(`! ${unused.length} register entries are not cited on the page: ${unused.join(', ')}`);
if (problems.length) {
  console.error(`✗ ${problems.length} problem${problems.length > 1 ? 's' : ''}:\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`✓ ${QUOTES.length - skipped} quotations match their sources${skipped ? ` (${skipped} not checked: the private sources checkout is absent)` : ''}; ${used.size} cited on the page${engineChecked ? `; ${ANSWER_SETS.length} answer sets reach their declared outcomes` : ''}`);
if (CHECK) process.exit(0);

const i = page.indexOf('<main>');
const top = page.slice(0, i).replace(/<title>[\s\S]*?<\/title>\n?/, '');
page = `${head(TITLE, DESCRIPTION, URL)}${top}</head>\n<body>\n${page.slice(i)}\n</body></html>\n`;
page = addAnchors(addPlanLinks(page.replace('</style>', ANCHOR_CSS + '</style>')));
fs.mkdirSync(path.join(OUT, 'cases'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'evidence'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), page);
fs.writeFileSync(path.join(OUT, 'evidence', 'index.html'), evidencePage());
fs.writeFileSync(path.join(OUT, 'evidence', 'evidence.json'), JSON.stringify({
  application: APPLICATION,
  licence: 'Compilation CC BY 4.0, Planning Distilled. Quotations remain the copyright of their publishers.',
  documents: DOCS.map(({ key, title, by, dated, where: w, url, group, scanned }) => ({ key, title, by, dated, where: w, url, group, scanned: !!scanned })),
  quotations: QUOTES.map(({ id, topic, doc, page: p, para, text, show }) => ({ id, topic, document: doc, page: p ?? null, paragraph: para ?? null, text: show || text })),
}, null, 1) + '\n');
fs.writeFileSync(path.join(OUT, 'answers.json'), JSON.stringify(Object.fromEntries(ANSWER_SETS.map((s) => [s.key, { title: s.title, answers: s.answers, result: s.result }])), null, 1) + '\n');
for (const b of BOXES) fs.writeFileSync(path.join(OUT, 'cases', b.key + '.html'), listPage(b));
for (const b of BOXES) console.log(`${b.key}: ${b.concur.length}${b.other ? ' / ' + b.other.length : ''}`);
console.log(`✓ wrote ${BOXES.length + 2} pages to ${path.relative(process.cwd(), OUT) || '.'}`);
