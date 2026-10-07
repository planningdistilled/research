// Shared builder for the "which local plan policies keep their weight" pages.
// Every quotation is checked against its source text at build time; the build fails on a mismatch.
import fs from 'node:fs';
import path from 'node:path';
import { DECISIONS, NPPF_TXT, OPEN, SOURCES, resolveRef } from '../../paths.mjs';
import { addAnchors, ANCHOR_CSS } from './anchors.mjs';
import { addPlanLinks } from './plan-links.mjs';

const CASES = JSON.parse(fs.readFileSync(path.join(DECISIONS, 'index', 'cases.json'), 'utf8'));
export const caseById = new Map(CASES.map((c) => [c.case_id, c]));
const DECISION_PAGES = '/research/england/nppf-navigator/decisions/';

// Source texts that quotations are checked against.
const TEXTS = {
  nppf: NPPF_TXT,
  cs: path.join(SOURCES, 'stratford-dc', 'public-note', 'cs.txt'),
  np: path.join(SOURCES, 'stratford-dc', 'claverdon', 'Claverdon-Neighbourhood-Plan.txt'),
};
const reportPath = (id) => path.join(SOURCES, 'stratford-dc', 'public-note', `${id}-report.txt`);
/** True when the officer report text for a case is held (scanned reports are OCR'd into sources). */
export const hasReport = (id) => fs.existsSync(reportPath(id));

const norm = (s) => s
  .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-')
  .replace(/-\s*\n\s*/g, '-').replace(/\s+/g, ' ').toLowerCase()
  // footnote markers run into words in the PDF text ("adopted66"); drop letter-attached digits on both sides
  .replace(/([a-z])\d{1,3}\b/g, '$1').trim();
const cache = new Map();
function text(src) {
  if (!cache.has(src)) {
    const file = src.startsWith('case:') ? reportPath(src.slice(5)) : src.startsWith('pins:') ? path.join(OPEN, 'pins-corpus', src.slice(5) + '.txt') : /^(open|sources):/.test(src) ? resolveRef(src) : TEXTS[src];
    if (!file || !fs.existsSync(file)) throw new Error(`source text missing for ${src}: ${file}`);
    const raw = fs.readFileSync(file, 'utf8');
    // pdftotext separates pages with form feeds; the OCR tool writes "=== PAGE n ===" before each page.
    const pages = /^\s*=== PAGE \d+ ===/.test(raw) ? raw.split(/=== PAGE \d+ ===/).slice(1) : raw.split('\f');
    cache.set(src, { flat: norm(raw), pages: pages.map(norm) });
  }
  return cache.get(src);
}
const problems = [];
/** Throws (at the end of the build) unless `q` appears verbatim in `src`; checks the page too when given. */
export function check(src, q, page) {
  const t = text(src);
  const n = norm(q).replace(/^[.,;:]+|[.,;:]+$/g, '');
  if (!t.flat.includes(n)) { problems.push(`${src}: not found: "${q}"`); return; }
  if (page && !(t.pages[page - 1] || '').includes(n)) {
    const found = t.pages.findIndex((p) => p.includes(n)) + 1;
    problems.push(`${src}: "${q.slice(0, 60)}…" is on p.${found}, not p.${page}`);
  }
}
/** Case ids (from `ids`) whose report contains `re`, limited to decisions under the August 2026 Framework. */
export function reportsMatching(ids, re) {
  return ids.filter((id) => {
    const c = caseById.get(id);
    if (!c) throw new Error('case not in index: ' + id);
    if (c.nppf_applied !== '2026-08') return false;
    return re.test(text('case:' + id).flat);
  });
}
export function assertClean() {
  if (problems.length) {
    console.error(problems.map((p) => '✗ ' + p).join('\n'));
    throw new Error(`${problems.length} quotation problem(s)`);
  }
}

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** A decision reference with a link to its summary page: "Snitterfield, 26/00617/PIP". */
export function caseLink(id) {
  const c = caseById.get(id);
  if (!c) throw new Error('case not in index: ' + id);
  const place = c.title.split(',').slice(-1)[0].trim();
  return `<a href="${DECISION_PAGES}${encodeURIComponent(id)}.html">${esc(place)}, ${esc(c.lpa_ref || id)}</a>`;
}

/** An appeal decision reference with a link: "Aston Clinton, appeal 6008253". */
export function appealLink(id) {
  const c = caseById.get(id);
  if (!c) throw new Error('case not in index: ' + id);
  const place = c.title.split(',').slice(-1)[0].replace(/\(.*\)/, '').trim();
  return `<a href="${DECISION_PAGES}${encodeURIComponent(id)}.html">${esc(place)}, appeal ${esc(c.appeal_ref || id)}</a>`;
}

/** A checked quotation block. `src` is nppf | cs | np | case:<id> | pins:<ref> | open:<path> | sources:<path>; `cite` is the visible attribution (HTML). */
export function quote(src, q, cite, page) {
  check(src, q, page);
  return `<blockquote><p>${esc(q)}</p><cite>${cite}</cite></blockquote>`;
}

const STATUS = {
  consistent: ['ok', 'Keeps its weight'],
  partly: ['part', 'Mostly keeps its weight'],
  contested: ['part', 'Contested'],
  conflict: ['no', 'Likely very limited weight'],
};

/** One policy card. */
export function card({ code, name, status, body }) {
  const [cls, label] = STATUS[status];
  return `<article class="policy" id="${esc(code.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">
  <div class="policy-head"><h3><span class="code">${esc(code)}</span> ${esc(name)}</h3><span class="pill ${cls}">${label}</span></div>
  ${body}
</article>`;
}

const LICENCE = '&copy; Planning Distilled. Text, data and images on this page are released under the <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 licence</a>: share and adapt them freely, with credit to Planning Distilled. Quotations from decision letters, plans and the Framework remain the copyright of their publishers. Source and data: <a href="https://github.com/planningdistilled/research">github.com/planningdistilled/research</a>.';

const CSS = `
:root{--ground:#eef2f1;--surface:#fff;--surface-2:#f6f8f8;--ink:#17212b;--muted:#5a6672;--line:#d5dddd;--accent:#2b5c88;--accent-soft:#e3ecf4;--ok:#2d7549;--ok-soft:#e3f1e8;--part:#94680f;--part-soft:#f6eedb;--no:#a3382a;--no-soft:#f7e6e3;--quote:#f4f6f2;--serif:"Source Serif 4",Georgia,serif;--sans:"Public Sans",-apple-system,"Segoe UI",system-ui,sans-serif;--mono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){color-scheme:dark;--ground:#10161b;--surface:#18212a;--surface-2:#1d2731;--ink:#e3e9ee;--muted:#9aa6b2;--line:#2c3945;--accent:#86b0db;--accent-soft:#1f3244;--ok:#6cc08f;--ok-soft:#1b3326;--part:#d9a94a;--part-soft:#3a2f17;--no:#e0786a;--no-soft:#3a211e;--quote:#1c2620}}
:root[data-theme="dark"]{color-scheme:dark;--ground:#10161b;--surface:#18212a;--surface-2:#1d2731;--ink:#e3e9ee;--muted:#9aa6b2;--line:#2c3945;--accent:#86b0db;--accent-soft:#1f3244;--ok:#6cc08f;--ok-soft:#1b3326;--part:#d9a94a;--part-soft:#3a2f17;--no:#e0786a;--no-soft:#3a211e;--quote:#1c2620}
*{box-sizing:border-box}body{margin:0;background:var(--ground);color:var(--ink);font:16px/1.6 var(--sans);padding-inline:16px;padding-block:0 56px}
main{max-width:780px;margin:0 auto;display:grid;gap:36px}h1,h2,h3{margin:0;text-wrap:balance}p{margin:0}a{color:var(--accent);text-underline-offset:3px}:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
header{padding-block:32px 0;display:grid;gap:10px}.eyebrow{font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)}.eyebrow a{color:inherit}
h1{font:600 clamp(26px,4.6vw,36px)/1.15 var(--serif);letter-spacing:-.01em}.dek{color:var(--muted);max-width:64ch}
section{display:grid;gap:14px}h2{font:600 23px/1.25 var(--serif)}section>p{max-width:68ch}
.rule{background:var(--surface);border:1px solid var(--line);border-top:4px solid var(--accent);border-radius:8px;padding:20px;display:grid;gap:12px}
blockquote{margin:0;background:var(--quote);border-left:3px solid var(--accent);border-radius:4px;padding:10px 14px;display:grid;gap:4px}blockquote p{font:400 16px/1.55 var(--serif)}blockquote cite{font-style:normal;font-size:12.5px;color:var(--muted)}
.policies{display:grid;gap:14px}.policy{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:18px;display:grid;gap:10px;min-width:0}
.policy-head{display:flex;flex-wrap:wrap;gap:8px 12px;justify-content:space-between;align-items:baseline}.policy h3{font:600 18px/1.3 var(--sans)}
.code{font:500 .85em var(--mono);color:var(--accent)}.pill{font-size:12px;font-weight:600;border-radius:3px;padding:1px 8px;white-space:nowrap}
.pill.ok{background:var(--ok-soft);color:var(--ok)}.pill.part{background:var(--part-soft);color:var(--part)}.pill.no{background:var(--no-soft);color:var(--no)}
.policy p,.policy li{font-size:15px;max-width:68ch}.policy ul{margin:0;padding-left:20px;display:grid;gap:4px}.also{font-size:13.5px;color:var(--muted)}
.note{font-size:14.5px;color:var(--muted)}footer{font-size:13px;color:var(--muted);display:grid;gap:8px;border-top:1px solid var(--line);padding-top:16px}footer ul{margin:0;padding-left:18px}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}${ANCHOR_CSS}`;

export function page({ title, description, url, breadcrumb, h1, dek, body, sources, credit }) {
  assertClean();
  return addAnchors(addPlanLinks(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<link rel="license" href="https://creativecommons.org/licenses/by/4.0/">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=Public+Sans:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap">
<style>${CSS}</style>
</head>
<body><main>
<header><nav class="eyebrow" aria-label="Breadcrumb">${breadcrumb}</nav><h1>${esc(h1)}</h1><p class="dek">${dek}</p></header>
${body}
<footer><p>Sources</p><ul>${sources.map((s) => `<li>${s}</li>`).join('')}</ul>
<p>${credit} Every quotation on this page is checked against the source text when the page is built. Built ${esc(fmtDate(new Date().toISOString().slice(0, 10)))}. Not legal advice.</p>
<p class="licence">${LICENCE}</p></footer>
</main></body></html>
`));
}
