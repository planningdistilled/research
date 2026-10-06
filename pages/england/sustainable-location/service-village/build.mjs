// Builds the "Service Village Does Not Mean Sustainable" page and one sub-page per decision in the verified
// settlement-tier register. Every quotation, paragraph number, code and influence line is read straight
// from data/decisions/analysis/appeals-review/settlement-tier-usage.tsv; nothing is typed by hand here.
//
//   node build.mjs                      -> dist/index.html + dist/case-<ref>.html (artifact: content-only files)
//   node build.mjs --pages [--out <dir>] [--base <url>]   (out defaults to <main-site>/research/england/sustainable-location/service-village)
//                                       -> full HTML documents with canonical links, for GitHub Pages;
//                                          with the default out, a redirect is left at every former address
//                                          (research/england/service-village/, where the page lived until 6 Oct 2026)
//
// template.html is the live page as published (content only, no publish skeleton). The build injects the
// sweep findings into it at fixed anchors and fails loudly if an anchor is missing.
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DECISIONS as DB, OPEN, SITE } from '../../../../paths.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TSV = join(DB, 'analysis', 'appeals-review', 'settlement-tier-usage.tsv');
const CASES = join(DB, 'index', 'cases.json');
const TEMPLATE = join(HERE, 'template.html');

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : dflt;
};
const PAGES = args.includes('--pages');
const SITE_DIR = 'research/england/sustainable-location/service-village';
const FORMER_DIR = 'research/england/service-village'; // the page's address until 6 Oct 2026; redirects are left there
const OUT = resolve(opt('--out', PAGES ? join(SITE, SITE_DIR) : join(HERE, 'dist')));
const BASE = opt('--base', `https://planningdistilled.org/${SITE_DIR}/`);
const PINS = 'https://appeal-planning-decision.service.gov.uk/comment-planning-appeal/appeals/';
const NOTES = 'https://planningdistilled.org/research/england/nppf-navigator/decisions/';

// ---------- data
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unq = (f) => (f.length >= 2 && f.startsWith('"') && f.endsWith('"') ? f.slice(1, -1).replace(/""/g, '"') : f);

const lines = readFileSync(TSV, 'utf8').split(/\r?\n/).filter((l) => l.trim());
if (lines[0].split('\t').length !== 14) throw new Error('unexpected TSV header');
const rows = lines.slice(1).map((l, i) => {
  const f = l.split('\t');
  if (f.length !== 14) throw new Error(`row ${i + 2}: ${f.length} fields`);
  const [ref, place, authority, date, outcome, labels, primary, secondary, para, quote, influence, source, routePara, routeQuote] = f.map(unq);
  return { ref, place, authority, date, outcome, labels, primary, secondary, para, quote, influence, source, routePara, routeQuote };
});

const cases = JSON.parse(readFileSync(CASES, 'utf8'));
const byAppeal = new Map();
const byId = new Map();
for (const c of cases) {
  if (c.appeal_ref) byAppeal.set(String(c.appeal_ref), c);
  byId.set(c.case_id, c);
}
const byRef = new Map(rows.map((r) => [r.ref, r]));
if (byRef.size !== rows.length) throw new Error('duplicate ref in the register');

// ---------- the sweep. The page says every decision in the dataset was searched, so the build repeats the search
// and fails if a decision that matches it has no row in the register. White space is collapsed first: a phrase
// such as "settlement hierarchy" often wraps across a line in the letter text.
const TIER_SEARCH = /service village|service centre|service center|local service|key service|rural service|settlement hierarchy|main rural centre|rural centre|local centre village|key settlement|category (1|2|3|4|one|two|three|four) (village|settlement)|tier (1|2|3|4|5|one|two|three|four|five) (village|settlement)|(primary|secondary|larger|smaller|service) (village|settlement)s?\b|sustainable (village|settlement)/i;
const CORPUS = join(OPEN, 'pins-corpus');
const flat = (p) => readFileSync(p, 'utf8').replace(/\s+/g, ' ');
const letters = readdirSync(CORPUS).filter((f) => f.endsWith('.txt'));
const matched = new Set();
for (const f of letters) if (TIER_SEARCH.test(flat(join(CORPUS, f)))) matched.add(f.slice(0, -4));
for (const c of cases) if (TIER_SEARCH.test(flat(join(DB, c._file)))) matched.add(/^\d{7}$/.test(String(c.appeal_ref ?? '')) ? String(c.appeal_ref) : c.case_id);
const unswept = [...matched].filter((ref) => !byRef.has(ref)).sort();
if (unswept.length) {
  throw new Error(`the tier search matches ${unswept.length} decision(s) with no row in the register: ${unswept.join(' ')}.\n` +
    'Read each matching passage, classify it and add a row to settlement-tier-usage.tsv (method and codes: appeals-review/settlement-tier-usage-summary.md).');
}
// Every quotation in the register must be in its source: the decision letter, or the case file for council decisions.
const normQ = (t) => t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
let quotesChecked = 0;
const quoteProblems = [];
for (const r of rows) {
  const text = normQ(readFileSync(r.source.startsWith('pins-corpus/') ? join(OPEN, r.source) : join(DB, r.source), 'utf8'));
  for (const q of [r.quote, r.routeQuote]) {
    if (!q || q === '(none)') continue;
    quotesChecked++;
    if (!text.includes(normQ(q))) quoteProblems.push(`${r.ref}: not in ${r.source}: "${q.slice(0, 80)}"`);
  }
}
if (quoteProblems.length) throw new Error(`${quoteProblems.length} register quotation(s) not found in their source:\n${quoteProblems.join('\n')}`);
// The dataset the sweep covers, stated on the page: computed, so it cannot drift from the other pages.
const num = (n) => n.toLocaleString('en-GB');
const sweptAt = new Date(`${cases.map((c) => c.harvested_on || '').sort().at(-1)}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const SWEPT = { cases: num(cases.length), letters: num(letters.length), at: sweptAt };
// The full decision note, published with the Navigator, for any decision in the database.
const noteLink = (caseId) => (byId.has(caseId) ? `<a href="${NOTES}${esc(caseId)}.html">full decision note</a>` : `case file <code>cases/${esc(caseId)}.md</code>`);

const CODE_SHORT = {
  A: 'The shorthand applied wrongly: tier treated as the answer, no route sentence',
  B: 'Tier acknowledged, location decided against on the route',
  C: 'Tier cited in support, beside route or transport evidence',
  D: 'Tier counted against the site',
  E: 'Descriptive only',
  F: 'Set aside: location finding imported from an adjoining recent permission',
  X: 'Search match excluded: services mentioned, tier not referenced',
};
const CODE_LONG = {
  A: 'a case where the tier was treated as the answer on location and the decision contains no route sentence, the shorthand this piece is about',
  B: 'a case where the tier was acknowledged but the route evidence went against the site and decided the location',
  C: 'a case where the tier was cited in support of the scheme beside route or transport evidence',
  D: 'a case where the tier counted against the site',
  E: 'a descriptive mention that played no part in the reasoning',
  F: 'an unusual case set aside from the count: the location finding was imported from an adjoining recent, undelivered permission rather than made on the tier',
  X: 'a decision that mentions services, not a settlement tier; excluded from the lettered groups',
};
const effCode = (r) => r.primary;

const gbDate = (iso) => {
  const d = new Date(iso + 'T00:00:00Z');
  return isNaN(d) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
};
const isGood = (o) => /^(allowed|approved|granted)/i.test(o);
// Cut at a word boundary, for meta descriptions.
const clip = (s, n) => {
  const t = String(s).replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : `${t.slice(0, n + 1).replace(/\s+\S*$/, '').replace(/[,;:]$/, '')}…`;
};

function meta(r) {
  const numeric = /^\d{7}$/.test(r.ref);
  const c = numeric ? byAppeal.get(r.ref) : byId.get(r.ref);
  const caseId = c?.case_id ?? (numeric ? `PINS-${r.ref}` : r.ref);
  const council = !numeric && !/^APP-/.test(r.ref);
  let portal = null;
  let portalLabel = '';
  if (numeric) {
    portal = PINS + r.ref;
    portalLabel = 'Decision on the Planning Inspectorate appeals service';
  } else {
    portal = (c?.sources ?? []).find((s) => /^https?:\/\//.test(s)) ?? null;
    portalLabel = council ? 'Application on the council planning portal' : 'Decision on the Planning Inspectorate casework portal';
  }
  return { caseId, portal, portalLabel, council, lpaRef: c?.lpa_ref ?? null };
}

// ---------- shared style (the live page's, plus the rules the generated parts need)
const template = readFileSync(TEMPLATE, 'utf8');
const styleMatch = template.match(/<style>[\s\S]*?<\/style>/);
if (!styleMatch) throw new Error('template has no <style>');
const fontsMatch = template.match(/<link rel="preconnect"[\s\S]*?display=swap">/);
if (!fontsMatch) throw new Error('template has no font links');
const EXTRA_CSS = `<style>
.banner{margin:18px 0 8px;padding:18px 20px 16px;border:2px solid var(--ink,#1a231f);border-radius:12px;background:var(--surface,#fff)}
.banner-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 18px}
@media (max-width:560px){.banner-stats{grid-template-columns:1fr}}
.stat{display:grid;gap:3px;padding:10px 12px;border-radius:10px}
.stat.hero{background:var(--accent-soft,#e2ede7);outline:2px solid var(--accent,#2f6a4f)}
.stat.hero .n{color:var(--accent,#2f6a4f);font-size:clamp(44px,9vw,62px)}
.stat.hero .l{color:var(--accent-ink,#173a2c);font-weight:700;font-size:15px}
.stat .n{font:700 clamp(34px,7vw,48px)/1 var(--serif);letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.stat .l{font:600 14px/1.3 var(--sans)}
.stat small{display:block;font:400 12.5px/1.35 var(--sans);color:var(--muted)}
.banner-line{margin:14px 0 0;padding-top:12px;border-top:1px solid var(--line,#d7dcd4);font:700 clamp(17px,3vw,21px)/1.35 var(--serif)}
.back{display:inline-block;margin:30px 0 4px;font:600 13.5px var(--sans);color:var(--accent);text-decoration:none}
.back:hover{text-decoration:underline}
.cmeta{font-family:var(--mono);font-size:12.5px;color:var(--muted);display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;margin:8px 0 20px}
.badge.ok{background:var(--accent-soft);color:var(--accent-ink)}
:root:not([data-theme="light"]) .badge.ok,:root[data-theme="dark"] .badge.ok{color:var(--accent)}
.kv{display:grid;gap:16px}
.kv h3{font:600 12px/1.3 var(--mono);text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin:0 0 5px}
.kv p{margin:0}
.kv blockquote{margin:0;font:400 16px/1.5 var(--serif);background:var(--surface-2);border-radius:6px;padding:12px 15px}
.cwhy{background:var(--accent-soft);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px}
.cwhy.fp{background:var(--gold-soft);border-left-color:var(--gold)}
.src code{font-family:var(--mono);font-size:12.5px}
.more{display:grid;gap:8px;margin-top:12px}
.more-row{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;align-items:baseline;border-top:1px solid var(--line);padding-top:8px;font-size:14.5px}
.more-row .ref{white-space:nowrap}
@media (max-width:460px){.more-row{grid-template-columns:1fr}}
.answer{border-left:4px solid var(--accent);background:var(--accent-soft);border-radius:8px;padding:14px 18px;margin:14px 0}
.answer p{margin:0;font-size:16px}
.sub{font:600 15px/1.3 var(--sans);margin:18px 0 2px}
details.expand{border:1px solid var(--line);border-radius:8px;background:var(--surface);margin:14px 0 0}
details.expand>summary{cursor:pointer;font:600 14.5px/1.3 var(--sans);color:var(--accent);padding:12px 16px;list-style:none}
details.expand>summary::-webkit-details-marker{display:none}
details.expand>summary::before{content:"\\25B8\\00a0\\00a0";font-size:12px}
details.expand[open]>summary::before{content:"\\25BE\\00a0\\00a0"}
details.expand .body{padding:0 16px 14px}
details.expand .body h3{font:600 13px/1.3 var(--mono);text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin:16px 0 6px}
.idx-group{margin-top:14px}
.crumb{font:500 12.5px/1.4 var(--mono);letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin:18px 0 -24px}
.crumb a{color:var(--muted);text-decoration:none}
.crumb a:hover{text-decoration:underline}
</style>`;

// ---------- case-file text (summary and the "what made the difference" section) for any decision we hold
const CASES_DIR = join(DB, 'cases');
function caseBody(caseId) {
  const p = join(CASES_DIR, `${caseId}.md`);
  let md;
  try { md = readFileSync(p, 'utf8'); } catch { return null; }
  const body = md.split(/^---$/m).slice(2).join('---');
  const section = (h) => {
    const m = body.match(new RegExp(`^## ${h}\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\r\\n]))`, 'm'));
    return m ? m[1].trim() : '';
  };
  return { summary: section('Summary'), difference: section('What made the difference') };
}
const mdInline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/“|”/g, '&quot;');
const mdBlock = (s) => s.split(/\n\s*\n/).map((p) => (p.trim().startsWith('- ') ? `<ul>${p.split(/\n/).map((l) => `<li>${mdInline(l.replace(/^- /, ''))}</li>`).join('')}</ul>` : `<p>${mdInline(p)}</p>`)).join('\n');
const locFindings = (c) => (c?.policy_findings ?? []).filter((pf) => /^TR3/.test(String(pf.policy)) || /g\)\(iii\)/.test(String(pf.policy)));
function locationBlock(c) {
  const lf = locFindings(c);
  if (!lf.length) return '';
  return `  <div><h3>The location finding</h3><ul>${lf.map((pf) => `<li><strong>${esc(pf.policy)}: ${esc(pf.finding)}.</strong> ${esc(pf.note ?? '')}</li>`).join('')}</ul></div>\n`;
}
// Decisions the page cites that are not in the tier register: a sub-page from the case file, so the reader meets our summary before the appeals service.
const EXTRA_REFS = new Set();
function routePage(ref) {
  const c = byAppeal.get(ref);
  if (!c) throw new Error(`no case file for ${ref}`);
  const body = caseBody(c.case_id) ?? { summary: '', difference: '' };
  const title = `${c.title} · ${ref}`;
  const desc = `${c.outcome[0].toUpperCase()}${c.outcome.slice(1)} ${gbDate(c.decision_date)}: ${clip(body.summary || c.development || '', 170)}`;
  const facts = (c.key_facts ?? []).filter((k) => /footway|footpath|pavement|unlit|light|mph|speed|bus|train|station|walk|cycl|Connectivity|crossing|verge|carriageway/i.test(String(k)));
  return `<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${fontsMatch[0]}
${styleMatch[0]}
${EXTRA_CSS}
<div class="wrap">
<a class="back" href="index.html">&larr; Service Village Does Not Mean Sustainable</a>
<p class="eyebrow">Route decision &middot; no settlement tier cited</p>
<h1>${esc(c.title)}</h1>
<div class="cmeta"><span class="ref">${esc(ref)}</span><span>&middot;</span><span>${esc(c.authority)}</span><span>&middot;</span><span>${esc(gbDate(c.decision_date))}</span><span class="badge${isGood(c.outcome) ? ' ok' : ''}">${esc(c.outcome)}</span>${c.units ? `<span>&middot;</span><span>${esc(c.units)} dwellings</span>` : ''}${c.green_belt ? '<span>&middot;</span><span>Green Belt</span>' : ''}</div>
<div class="kv">
${body.summary ? `  <div><h3>Summary</h3>${mdBlock(body.summary)}</div>\n` : ''}${locationBlock(c)}${facts.length ? `  <div><h3>Route facts recorded</h3><ul>${facts.map((k) => `<li>${esc(k)}</li>`).join('')}</ul></div>\n` : ''}${body.difference ? `  <div class="cwhy"><h3>What made the difference</h3>${mdBlock(body.difference)}</div>\n` : ''}  <div class="src"><h3>Sources</h3><p><a href="${PINS}${esc(ref)}" target="_blank" rel="noopener">Decision on the Planning Inspectorate appeals service</a> &middot; ${noteLink(c.case_id)}</p></div>
</div>
<div class="disclaimer">A summary of a public appeal decision from the research dataset behind this page, written from the decision letter. Quotations are checked against the letter. Not legal advice. &copy; Planning Distilled. Text, data and images on this page are released under the <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 licence</a>: share and adapt them freely, with credit to Planning Distilled. Quotations from decision letters, plans and the Framework remain the copyright of their publishers. Source and data: <a href="https://github.com/planningdistilled/research">github.com/planningdistilled/research</a>.</div>
</div>
`;
}

// ---------- case pages
function casePage(r) {
  const m = meta(r);
  const code = effCode(r);
  const fp = code === 'X';
  const paraShown = r.para && r.para !== '(case file)' ? ` <span class="ref">${esc(r.para)}</span>` : r.para === '(case file)' ? ' <span class="fine">(from the case file)</span>' : '';
  const why = fp
    ? `This decision was picked up by the search on the words above, which refer to services, not to a settlement tier. ${esc(r.influence)}`
    : `${esc(r.influence)} In the register this counts as ${esc(CODE_LONG[code] ?? CODE_LONG[r.primary])}${r.secondary === 'B' ? ' (and the route was decisive too)' : ''}.`;
  const sources = [
    m.portal ? `<a href="${esc(m.portal)}" target="_blank" rel="noopener">${esc(m.portalLabel)}</a>` : m.council ? 'Decided by the council; no appeal' : 'No portal link on file',
    noteLink(m.caseId),
    r.source ? `${/^cases\//.test(r.source) ? 'quoted from' : 'letter'} <code>${esc(r.source)}</code>` : '',
  ]
    .filter(Boolean)
    .join(' · ');
  const title = `${r.place} · ${r.ref}`;
  const desc = `${CODE_SHORT[code] ?? CODE_SHORT[r.primary]}: ${r.place}, ${r.authority}, ${r.outcome} ${gbDate(r.date)}.`;
  return `<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${fontsMatch[0]}
${styleMatch[0]}
${EXTRA_CSS}
<div class="wrap">
<a class="back" href="index.html">&larr; Service Village Does Not Mean Sustainable</a>
<p class="eyebrow">${esc(code)} &middot; ${esc(CODE_SHORT[code] ?? CODE_SHORT[r.primary])}</p>
<h1>${esc(r.place)}</h1>
<div class="cmeta"><span class="ref">${esc(r.ref)}</span><span>&middot;</span><span>${esc(r.authority)}</span><span>&middot;</span><span>${esc(gbDate(r.date))}</span><span class="badge${isGood(r.outcome) ? ' ok' : ''}">${esc(r.outcome)}</span>${m.lpaRef ? `<span>&middot;</span><span>${esc(m.lpaRef)}</span>` : ''}</div>
<div class="kv">
  <div><h3>Tier label used</h3><p>${esc(r.labels)}</p></div>
  <div><h3>The tier sentence${paraShown}</h3>${r.quote ? `<blockquote>&ldquo;${esc(r.quote)}&rdquo;</blockquote>` : '<p class="fine">No quotation recorded.</p>'}</div>
${r.routeQuote ? `  <div><h3>The route sentence${r.routePara && r.routePara !== '—' ? ` <span class="ref">${esc(r.routePara)}</span>` : ''}</h3>${r.routeQuote === '(none)' ? '<p class="fine">There is none. The decision says nothing about the walk, the footway, lighting or the bus service.</p>' : `<blockquote>&ldquo;${esc(r.routeQuote)}&rdquo;</blockquote>`}</div>
` : ''}
${(() => { const c = byAppeal.get(r.ref) ?? byId.get(r.ref); const b = c ? caseBody(c.case_id) : null; return `${b?.summary ? `  <div><h3>Summary</h3>${mdBlock(b.summary)}</div>\n` : ''}${c ? locationBlock(c) : ''}`; })()}  <div class="cwhy${fp ? ' fp' : ''}"><h3>Why this is cited</h3><p>${why}</p></div>
  <div class="src"><h3>Sources</h3><p>${sources}</p></div>
</div>
<div class="disclaimer">One entry in a register of ${rows.length} decisions that matched the search for a settlement-tier label, each read at every matching passage and classified by how the label influenced the decision. The quotation was checked against the source named above. Not legal advice. &copy; Planning Distilled. Text, data and images on this page are released under the <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 licence</a>: share and adapt them freely, with credit to Planning Distilled. Quotations from decision letters, plans and the Framework remain the copyright of their publishers. Source and data: <a href="https://github.com/planningdistilled/research">github.com/planningdistilled/research</a>.</div>
</div>
`;
}

// ---------- main-page content
const refLink = (ref) => `<a class="ref" href="case-${esc(ref)}.html">${esc(ref)}</a>`;
const rowLine = (r) => `<div class="more-row">${refLink(r.ref)}<span>${esc(r.place)}, ${esc(r.authority)} (${esc(gbDate(r.date))}) &mdash; <strong>${esc(r.outcome)}</strong>${r.influence ? `. ${esc(r.influence)}` : ''}</span></div>`;
const quoteLine = (r) => `<div class="more-row">${refLink(r.ref)}<span><strong>${esc(placeName(r))}</strong>, ${esc(r.authority)} (${esc(gbDate(r.date))}) &mdash; <strong>${esc(r.outcome)}</strong>.<br>Tier: &ldquo;${esc(r.quote)}&rdquo;${r.para && r.para !== '(case file)' ? ` <span class="ref">${esc(r.para)}</span>` : ''}<br>Route: ${r.routeQuote === '(none)' ? '<em>none in the decision</em>' : `&ldquo;${esc(r.routeQuote)}&rdquo;${r.routePara ? ` <span class="ref">${esc(r.routePara)}</span>` : ''}`}</span></div>`;
const shortLine = (r) => `<div class="more-row">${refLink(r.ref)}<span>${esc(r.place)}, ${esc(r.authority)} (${esc(gbDate(r.date))}) &mdash; ${esc(r.outcome)}</span></div>`;

const counts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, X: 0 };
for (const r of rows) counts[r.primary] = (counts[r.primary] ?? 0) + 1;
const groups = Object.fromEntries(['A', 'B', 'C', 'D', 'E', 'F', 'X'].map((k) => [k, rows.filter((r) => effCode(r) === k)]));
const order = ['A', 'B', 'C', 'D', 'E', 'F'];
const pinsLink = (ref, text = ref) => `<a class="ref" href="${PINS}${ref}" target="_blank" rel="noopener">${text}</a>`;

// The headline figure: code A appeals (inspector decisions, numeric refs) that were allowed.
const isAppeal = (r) => /^\d{7}$/.test(r.ref) || /^APP-/.test(r.ref);
const a2Appeals = groups.A.filter(isAppeal);
const a2AppealsAllowed = a2Appeals.filter((r) => isGood(r.outcome));
const a2AppealsOther = a2Appeals.filter((r) => !isGood(r.outcome));
const a2Council = groups.A.filter((r) => !isAppeal(r));
const setAside = groups.F;
const placeName = (r) => r.place.split(',').pop().trim().replace(/\s*\(.*\)$/, '');
const listRefs = (rs) => rs.map((r) => `${refLink(r.ref)} ${esc(placeName(r))}`).join(', ');
const words = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const nWord = (n) => words[n] ?? String(n);
// B rows plus the three D rows named in the sweep section: sites beside a favourably tiered settlement that failed on the route.
const besideTier = [...groups.B, ...['6006289', '6009691', '6012304'].map((ref) => {
  const r = byRef.get(ref);
  if (!r || r.primary !== 'D' || r.secondary !== 'B') throw new Error(`${ref} is no longer coded D with B: revise the "Three more sites" sentence`);
  return r;
})];
if (counts.D <= 2 * (counts.A + counts.C + counts.F)) throw new Error('D is no longer more than twice A + C + F: revise "more than twice"');
const headline = `<strong>${a2AppealsAllowed.length ? `${nWord(a2AppealsAllowed.length)[0].toUpperCase()}${nWord(a2AppealsAllowed.length).slice(1)} appeal${a2AppealsAllowed.length === 1 ? '' : 's'} in the dataset ${a2AppealsAllowed.length === 1 ? 'was' : 'were'} allowed on the tier plus a bare proximity statement, with no route facts` : 'No appeal in the dataset was allowed on the tier alone'}</strong>${a2AppealsAllowed.length ? ` (${listRefs(a2AppealsAllowed)}). ${a2AppealsAllowed.length === 1 ? 'There' : 'In each'}, the inspector recorded reasonable public transport for the village.` : '.'} In every allowed case the tier sat beside route evidence: a daily or better bus, lit footways or an urban setting. Where the route was poor, the label did not save the site.`;

const sweepSection = `<section>
  <h2>What a sweep of every decision found</h2>
  <p>The sweep covered <strong>every decision in the dataset</strong> as it stood on ${SWEPT.at} &mdash; all ${SWEPT.cases} case files and all ${SWEPT.letters} appeal letters in the corpus. Only <strong>${rows.length}</strong> mention a settlement-tier label at all, and in <strong>${counts.X}</strong> of those the deliberately broad search matched wording about services (&ldquo;local services&rdquo; and the like) with no settlement tier referenced; those are excluded, leaving <strong>${rows.length - counts.X}</strong> that use a tier in the hierarchy sense, grouped A to F below. The great majority of decisions never mention a tier and decide location without reference to the hierarchy.</p>
  <p class="lede">Every decision letter and case file in the dataset was searched for any settlement-tier label (&ldquo;service village&rdquo;, &ldquo;Local Service Village&rdquo;, &ldquo;Key Service Centre&rdquo;, &ldquo;Category 1&ndash;4&rdquo;, &ldquo;tier 2 settlement&rdquo; and the like). That found <strong>${rows.length} decisions</strong>, each read at every matching passage and classified by how, if at all, the label influenced the result. Every quotation here and on the sub-pages is taken verbatim from that register and is checked against its source each time the page is built: ${quotesChecked} of ${quotesChecked} matched. Council-decision quotations are verified against the case file, because officer reports are not in the letter corpus.</p>
  <div class="answer"><p>${headline}</p></div>
  <div class="tablewrap">
  <table class="route">
    <thead><tr><th>How the tier was used</th><th>Decisions</th></tr></thead>
    <tbody>
      <tr><td><strong>A &mdash; the shorthand applied wrongly</strong>: tier treated as the answer, no route sentence</td><td><strong>${counts.A}</strong></td></tr>
      <tr><td>B &mdash; tier acknowledged, location decided <em>against</em> on the route</td><td>${counts.B}</td></tr>
      <tr><td>C &mdash; tier cited in support, beside route or transport evidence</td><td>${counts.C}</td></tr>
      <tr><td>D &mdash; tier counted <em>against</em> the site (low tier, unlisted, outside the hierarchy)</td><td>${counts.D}</td></tr>
      <tr><td>E &mdash; descriptive only</td><td>${counts.E}</td></tr>
      <tr><td>F &mdash; set aside: location finding imported from an adjoining recent permission</td><td>${counts.F}</td></tr>
      <tr><td class="fine">Excluded: search matched wording about services, no tier referenced</td><td class="fine">${counts.X}</td></tr>
    </tbody>
  </table>
  </div>
  <h3 class="sub">A &mdash; the shorthand applied wrongly: the tier treated as the answer, with no route sentence</h3>
  <p class="fine">The shorthand this piece is about. ${a2AppealsAllowed.length ? `${nWord(a2AppealsAllowed.length)[0].toUpperCase()}${nWord(a2AppealsAllowed.length).slice(1)} appeal${a2AppealsAllowed.length === 1 ? ' was' : 's were'} allowed on it (${listRefs(a2AppealsAllowed)}); ` : ''}${a2AppealsOther.length ? `${a2AppealsAllowed.length ? nWord(a2AppealsOther.length) : nWord(a2AppealsOther.length)[0].toUpperCase() + nWord(a2AppealsOther.length).slice(1)} appeal${a2AppealsOther.length === 1 ? ' was' : 's were'} dismissed on other grounds with the tier accepted on location; ` : ''}the ${a2Council.length === 1 ? 'other approval is' : 'other approvals are'} the Council&rsquo;s.</p>
  <div class="more">${groups.A.map(quoteLine).join('\n')}</div>
  <p class="lede" style="margin-top:22px">B and C are the two outcomes when an inspector looks at both the tier and the route. In <strong>B</strong> the inspector acknowledged the tier, the route evidence went against the site, and the route decided it. In <strong>C</strong> the route evidence supported the location, so the tier was cited beside it. Each entry below quotes the tier sentence and the route sentence from the same decision.</p>
  <h3 class="sub">B &mdash; the tier acknowledged, the location decided against on the route</h3>
  <div class="more">${groups.B.map(quoteLine).join('\n')}</div>
  <p class="fine">Three more sites a short walk from a Key Service Centre or a Tier 2 village failed the route test in the same way but sit in D, because the plan treated the site as outside the settlement: ${refLink('6006289')} Danbury, ${refLink('6009691')} Hurst Green, ${refLink('6012304')} Marton. With them, ${nWord(besideTier.length)} sites beside a favourably tiered settlement failed on the route; ${nWord(besideTier.filter((r) => !isGood(r.outcome)).length)} were dismissed and ${nWord(besideTier.filter((r) => isGood(r.outcome)).length)} ${besideTier.filter((r) => isGood(r.outcome)).length === 1 ? 'was' : 'were'} allowed on other grounds.</p>
  <h3 class="sub">C &mdash; the tier cited in support, beside route evidence</h3>
  <div class="more">${groups.C.map(quoteLine).join('\n')}</div>
  <h3 class="sub">And the tier is used against sites far more often than for them</h3>
  <p>${counts.D} decisions cite a low tier, an unlisted village or a site outside the hierarchy against the proposal &mdash; more than twice the ${counts.A + counts.C + counts.F} that cite a tier in its favour. Many route-decided dismissals carry no tier label at all even where the village is a named service centre; the inspectors went straight to TR3: ${refLink('6006637')} Hatton Station, ${refLink('6007428')} Halsall, ${refLink('6008688')} East Grinstead, ${refLink('6009966')} South Nutfield.</p>
  <p>Before the 2026 Framework, three of four Council decisions on Claverdon reasoned &ldquo;Category 3 Local Service Village with a shop, school, pub and surgery, so sustainable&rdquo;; the fourth, 22/01896/FUL, called the same hinterland &ldquo;an unsustainable location&rdquo;.</p>
  <details class="expand">
    <summary>All ${rows.length} decisions, grouped by how the tier was used</summary>
    <div class="body">
${order
  .filter((k) => groups[k].length)
  .map((k) => `      <div class="idx-group"><h3>${esc(k)} &middot; ${esc(CODE_SHORT[k])} (${groups[k].length})</h3><div class="more">${groups[k].map(shortLine).join('\n')}</div></div>`)
  .join('\n')}
      <details class="expand" style="margin-top:16px"><summary>Excluded &middot; ${groups.X.length} search matches on wording about services (&ldquo;local services&rdquo; and the like), with no settlement tier referenced</summary><div class="body"><div class="more">${groups.X.map(shortLine).join('\n')}</div></div></details>
    </div>
  </details>
</section>

`;

function mainPage() {
  let html = template;
  const must = (needle) => {
    if (!html.includes(needle)) throw new Error(`anchor not found: ${needle.slice(0, 70)}`);
  };
  // 0. the headline banner, straight under the page header
  const hdr = '</header>';
  must(hdr);
  const banner = `
<section class="banner" role="region" aria-label="Headline finding">
  <div class="banner-stats">
    <div class="stat"><span class="n">${SWEPT.cases}</span><span class="l">decisions in the dataset swept<small>and all ${SWEPT.letters} appeal letters, as at ${SWEPT.at}</small></span></div>
    <div class="stat"><span class="n">${rows.length - counts.X}</span><span class="l">mention a settlement-tier hierarchy<small>${rows.length} matched the search; ${counts.X} mention services only</small></span></div>
    <div class="stat hero"><span class="n">${a2AppealsAllowed.length}</span><span class="l">allowed by an inspector on the tier alone<small>${counts.C} cite the tier in support beside route evidence</small></span></div>
  </div>
  <p class="banner-line">The tier still gets cited, but on its own it has never carried a site with a poor route. In every allowed case the inspector also had a bus service, lit footways or an urban setting to point to.</p>
</section>`;
  html = html.replace(hdr, hdr + banner);
  // 1. headline into the lede of the "Inspectors decide on the route" section
  const lede = 'A named service village, a Category 1 village, or a station close by, did not save them.</p>';
  must(lede);
  html = html.replace(
    lede,
    `A named service village, a Category 1 village, or a station close by, did not save them. A sweep of every decision in the dataset, below, found that only ${rows.length} mention a settlement-tier label (${rows.length - counts.X} in the hierarchy sense). ${headline}</p>`,
  );
  // 2. the sweep section, before the Claverdon worked example
  const cla = '<section>\n  <h2>Claverdon, 26/01470/FUL</h2>';
  must(cla);
  html = html.replace(cla, sweepSection + cla);
  // 3. case-card refs ("6006900 · South Downs") and the "also dismissed" refs: sub-page where one exists, else the appeals service
  html = html.replace(/<span class="ref">(\d{7}) · ([^<]*)<\/span>/g, (_m, ref, rest) =>
    byRef.has(ref) || byAppeal.has(ref) ? (byAppeal.has(ref) && !byRef.has(ref) && EXTRA_REFS.add(ref), `<a class="ref" href="case-${ref}.html">${ref} · ${rest}</a>`) : pinsLink(ref, `${ref} · ${rest}`),
  );
  html = html.replace(/<span class="ref">(\d{7})<\/span>/g, (_m, ref) => (byRef.has(ref) ? refLink(ref) : byAppeal.has(ref) ? (EXTRA_REFS.add(ref), refLink(ref)) : pinsLink(ref)));
  // hand-written sub-page links in the template to decisions outside the register
  for (const m of html.matchAll(/href="case-(\d{7})\.html"/g)) if (!byRef.has(m[1]) && byAppeal.has(m[1])) EXTRA_REFS.add(m[1]);
  // 4. footer sources
  const ft = '6008253, 6007484, 6000903, 6006722.\n</footer>';
  must(ft);
  html = html.replace(
    ft,
    `6008253, 6007484, 6000903, 6006722. The register of ${rows.length} decisions using a settlement-tier label (the sweep section and its sub-pages) is <code>data/decisions/analysis/appeals-review/settlement-tier-usage.tsv</code>, with ${quotesChecked} of ${quotesChecked} quotations checked against the decision letters; council-decision quotations are verified against the case file.\n</footer>`,
  );
  // 5. the extra rules, after the live stylesheet
  html = html.replace('</style>', '</style>\n' + EXTRA_CSS);
  return html;
}

// ---------- GitHub Pages wrapper
const SITE_CRUMB = '<a href="/">Planning Distilled</a> &rsaquo; <a href="/research/">Research</a> &rsaquo; <a href="/research/england/">England</a> &rsaquo; <a href="/research/england/sustainable-location/">Sustainable location</a>';
function wrap(content, canonical, sub = false) {
  if (!PAGES) return content;
  const crumb = `<nav class="crumb" aria-label="Breadcrumb">${SITE_CRUMB}${sub ? ' &rsaquo; <a href="index.html">Service Village Does Not Mean Sustainable</a>' : ''}</nav>`;
  content = content.replace('<div class="wrap">', `<div class="wrap">\n${crumb}`);
  const cut = content.lastIndexOf('</style>') + '</style>'.length;
  if (cut < '</style>'.length) throw new Error('no </style> to split on');
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${esc(canonical)}">
<link rel="license" href="https://creativecommons.org/licenses/by/4.0/">
${content.slice(0, cut)}
</head>
<body>
${content.slice(cut)}
</body>
</html>
`;
}

// ---------- write
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'index.html'), wrap(mainPage(), BASE));
for (const r of rows) writeFileSync(join(OUT, `case-${r.ref}.html`), wrap(casePage(r), `${BASE}case-${r.ref}.html`, true));
for (const ref of ['6006637', '6007428']) if (!byRef.has(ref)) EXTRA_REFS.add(ref);
for (const ref of EXTRA_REFS) writeFileSync(join(OUT, `case-${ref}.html`), wrap(routePage(ref), `${BASE}case-${ref}.html`, true));
console.log(`route pages for decisions outside the register: ${[...EXTRA_REFS].sort().join(' ')}`);

// ---------- redirects from the former address (GitHub Pages has no server redirects, so each old URL keeps a stub page)
const stub = (url) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Moved: Service Village Does Not Mean Sustainable</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${esc(url)}">
<meta http-equiv="refresh" content="0; url=${esc(url)}">
<script>location.replace(${JSON.stringify(url)} + location.hash);</script>
</head>
<body>
<p>This page has moved to <a href="${esc(url)}">${esc(url)}</a>.</p>
</body>
</html>
`;
if (PAGES && OUT === resolve(join(SITE, SITE_DIR))) {
  const former = join(SITE, FORMER_DIR);
  const now = new Set(readdirSync(OUT).filter((f) => f.endsWith('.html')));
  // Only pages that existed at the former address get a redirect: the files already in that folder. Pages added
  // since the move never had the old address. A former page with no successor goes to the main page.
  const old = existsSync(former) ? readdirSync(former).filter((f) => f.endsWith('.html')) : [];
  if (!old.length) console.warn(`! no pages at the former address ${former}: no redirects written`);
  for (const f of old) writeFileSync(join(former, f), stub(BASE + (now.has(f) && f !== 'index.html' ? f : '')));
  console.log(`redirects -> ${former}: ${old.length} stubs`);
}

const n = readdirSync(OUT).filter((f) => f.startsWith('case-')).length;
console.log(`${PAGES ? 'pages' : 'artifact'} build -> ${OUT}: index.html + ${n} case pages`);
console.log(`counts: A ${counts.A} B ${counts.B} C ${counts.C} D ${counts.D} E ${counts.E} F ${counts.F} excluded ${counts.X} = ${rows.length}`);
