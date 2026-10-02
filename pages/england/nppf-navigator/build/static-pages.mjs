// Static, crawlable copies of what the Navigator otherwise only shows through JavaScript:
//   <target>/decisions/index.html          every decision in the database, newest first
//   <target>/decisions/<case_id>.html      one page per decision note (+ <case_id>.md, the same note as Markdown)
//   <target>/decisions/decisions.json|csv  the whole database as one download
//   <target>/route/index.html|.md          the decision route in full (graph.md)
//
// Search engines and AI crawlers do not run the app, so without these pages the decision notes and the
// route are invisible to them. Nothing is typed here: every word comes from index/cases.json, the case
// files and graph.md. Internal fields (local paths, harvest bookkeeping, analyst notes) are left out.
//
// Called by export-pages.mjs; or: node build/static-pages.mjs <target dir> [canonical URL]
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { PKG, DECISIONS as DB } from './lib.mjs';

const LICENCE =
  '&copy; Planning Distilled. Text, data and images on this page are released under the <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 licence</a>: share and adapt them freely, with credit to Planning Distilled. Quotations from decision letters, plans and the Framework remain the copyright of their publishers.';
const LICENCE_MD =
  '© Planning Distilled. Released under the Creative Commons Attribution 4.0 licence (https://creativecommons.org/licenses/by/4.0/): share and adapt freely, with credit to Planning Distilled. Quotations from decision letters, plans and the Framework remain the copyright of their publishers.';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const gbDate = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return isNaN(d) ? String(iso ?? '') : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
};
/** Cut at a word boundary, for meta descriptions. */
export const clip = (s, n = 155) => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  if (t.length <= n) return t;
  return `${t.slice(0, n + 1).replace(/\s+\S*$/, '').replace(/[,;:]$/, '')}…`;
};
const slug = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const DM = {
  inspector: 'Planning Inspector',
  'secretary-of-state': 'Secretary of State',
  'lpa-committee': 'Council planning committee',
  'lpa-delegated': 'Council officer (delegated)',
};
const FW = {
  '2026-08': 'August 2026 NPPF',
  '2024-12 (transitional)': 'December 2024 NPPF (transitional)',
  'not-cited': 'No Framework version cited',
};
const READ = { 'letter-read': 'the decision letter', 'report-read': 'the officer report', 'notice-read': 'the decision notice' };
const GOOD = /^(allowed|approved|granted|part-allowed)/i;

// ---------- a small Markdown renderer: headings, tables, block quotes, (nested) bullets, bold, emphasis, code
function inline(s, link) {
  let t = esc(s);
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?![*\w])/g, '$1<em>$2</em>');
  t = t.replace(/(^|[\s(])_([^_\s][^_]*?)_(?=[\s.,;:)]|$)/g, '$1<em>$2</em>');
  return link ? link(t) : t;
}
export function markdown(src, { shift = 0, link = null, ids = false } = {}) {
  const lines = src.replace(/\r/g, '').split('\n');
  const out = [];
  const used = new Set();
  const isBlock = (l) => /^(#{1,4} |\||>|\s*- )/.test(l);
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    const h = l.match(/^(#{1,4}) (.*)$/);
    if (h) {
      const lv = Math.min(6, h[1].length + shift);
      const text = inline(h[2], link);
      let id = '';
      if (ids) {
        let s = slug(text) || 'section';
        while (used.has(s)) s += '-2';
        used.add(s);
        id = ` id="${s}"`;
      }
      out.push(`<h${lv}${id}>${text}</h${lv}>`);
      i++;
    } else if (l.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++].replace(/^\|\s*|\s*\|\s*$/g, '').split(/\s*\|\s*/));
      const [head, , ...body] = rows;
      out.push(`<div class="tw"><table><thead><tr>${head.map((c) => `<th>${inline(c, link)}</th>`).join('')}</tr></thead><tbody>\n${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c, link)}</td>`).join('')}</tr>`).join('\n')}\n</tbody></table></div>`);
    } else if (l.startsWith('>')) {
      const paras = [[]];
      while (i < lines.length && lines[i].startsWith('>')) {
        const t = lines[i++].replace(/^>\s?/, '');
        if (t.trim()) paras[paras.length - 1].push(t);
        else paras.push([]);
      }
      out.push(`<blockquote>${paras.filter((p) => p.length).map((p) => `<p>${inline(p.join(' '), link)}</p>`).join('')}</blockquote>`);
    } else if (/^\s*- /.test(l)) {
      const items = []; // [text, [nested…]]
      while (i < lines.length && /^\s*- /.test(lines[i])) {
        const nested = /^\s+- /.test(lines[i]) && items.length;
        const t = lines[i++].replace(/^\s*- /, '');
        if (nested) items[items.length - 1][1].push(t);
        else items.push([t, []]);
      }
      out.push(`<ul>${items.map(([t, sub]) => `<li>${inline(t, link)}${sub.length ? `<ul>${sub.map((s) => `<li>${inline(s, link)}</li>`).join('')}</ul>` : ''}</li>`).join('\n')}</ul>`);
    } else {
      const para = [];
      while (i < lines.length && lines[i].trim() && !isBlock(lines[i])) para.push(lines[i++]);
      out.push(`<p>${inline(para.join(' '), link)}</p>`);
    }
  }
  return out.join('\n');
}

// ---------- shared stylesheet (the Method page's tokens)
const CSS = `:root{--ground:#eef2f1;--surface:#fff;--surface-2:#f6f8f8;--ink:#17212b;--muted:#5a6672;--line:#d5dddd;--accent:#2b5c88;--accent-soft:#e3ecf4;--ok:#2d7549;--no:#a3382a;--serif:"Source Serif 4",Georgia,serif;--sans:"Public Sans",-apple-system,"Segoe UI",system-ui,sans-serif;--mono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){color-scheme:dark;--ground:#10161b;--surface:#18212a;--surface-2:#1d2731;--ink:#e3e9ee;--muted:#9aa6b2;--line:#2c3945;--accent:#86b0db;--accent-soft:#1f3244;--ok:#6cc08f;--no:#e0786a}}
:root[data-theme="dark"]{color-scheme:dark;--ground:#10161b;--surface:#18212a;--surface-2:#1d2731;--ink:#e3e9ee;--muted:#9aa6b2;--line:#2c3945;--accent:#86b0db;--accent-soft:#1f3244;--ok:#6cc08f;--no:#e0786a}
*{box-sizing:border-box}
body{background:var(--ground);color:var(--ink);font:17px/1.6 var(--sans);margin:0;padding:0 16px 56px}
.wrap{max-width:820px;margin:0 auto}
.wrap.wide{max-width:1100px}
header{padding:40px 0 8px;border-bottom:1px solid var(--line);margin-bottom:8px}
.eyebrow{font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)}
.eyebrow a{color:inherit;text-decoration:none}
.eyebrow a:hover{text-decoration:underline}
h1{font:600 clamp(26px,5vw,38px)/1.15 var(--serif);margin:10px 0 10px;text-wrap:balance}
.dek{color:var(--muted);max-width:64ch;margin:0 0 10px}
h2{font:600 22px/1.25 var(--serif);margin:34px 0 10px;color:var(--accent)}
h3{font:600 17px/1.3 var(--sans);margin:24px 0 6px}
h4{font:600 15px/1.3 var(--sans);margin:18px 0 6px}
p{margin:0 0 12px}
a{color:var(--accent)}
ul{margin:0 0 12px;padding-left:20px}li{margin:4px 0}
blockquote{margin:0 0 12px;font:400 16px/1.5 var(--serif);background:var(--surface);border-left:4px solid var(--accent);border-radius:6px;padding:12px 15px}
blockquote p:last-child{margin:0}
.cmeta{font-family:var(--mono);font-size:12.5px;color:var(--muted);display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;margin:8px 0 10px}
.badge{display:inline-block;font:600 12px/1.5 var(--sans);border-radius:4px;padding:1px 8px;background:var(--surface);border:1px solid var(--line);color:var(--no);white-space:nowrap}
.badge.ok{color:var(--ok)}
dl.facts{display:grid;grid-template-columns:minmax(120px,max-content) 1fr;gap:6px 16px;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:14px 16px;margin:18px 0;font-size:15px}
dl.facts dt{color:var(--muted)}dl.facts dd{margin:0}
@media (max-width:520px){dl.facts{grid-template-columns:1fr;gap:0}dl.facts dd{margin-bottom:8px}}
.tw{overflow-x:auto;margin:14px 0}
table{border-collapse:collapse;width:100%;font-size:14.5px}
th,td{border:1px solid var(--line);padding:7px 10px;text-align:left;vertical-align:top}
th{background:var(--surface-2);font-weight:600}
tbody tr:nth-child(even){background:var(--surface-2)}
td.n{font-variant-numeric:tabular-nums;white-space:nowrap}
code{font-family:var(--mono);font-size:13px}
.note{background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;margin:18px 0;font-size:15px}
footer{margin-top:40px;padding-top:16px;border-top:1px solid var(--line);color:var(--muted);font-size:13.5px}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
`;
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=IBM+Plex+Mono:wght@400;500&display=swap">`;

function page({ title, description, canonical, crumb, body, wide = false, extraHead = '' }) {
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<link rel="license" href="https://creativecommons.org/licenses/by/4.0/">
${extraHead}${FONTS}
<link rel="stylesheet" href="../static.css">
</head>
<body>
<div class="wrap${wide ? ' wide' : ''}">
<header>
  <div class="eyebrow"><a href="/">Planning Distilled</a> &rsaquo; <a href="/research/">Research</a> &rsaquo; <a href="/research/england/">England</a> &rsaquo; ${crumb}</div>
${body}
</div>
</body>
</html>
`;
}

// ---------- decisions
/** The public part of a case record: no local paths, harvest bookkeeping or analyst notes. */
function publicRecord(c, body, url) {
  return {
    case_id: c.case_id,
    url,
    title: c.title,
    authority: c.authority,
    region: c.region,
    decision_maker: c.decision_maker,
    appeal_ref: c.appeal_ref,
    lpa_ref: c.lpa_ref,
    decision_date: c.decision_date,
    outcome: c.outcome,
    procedure: c.procedure,
    inspector: c.inspector,
    development: c.development,
    dev_type: c.dev_type ?? [],
    units: c.units,
    site_context: c.site_context ?? [],
    green_belt: c.green_belt,
    grey_belt: c.grey_belt,
    housing_land_supply_years: c.housing_land_supply_years,
    hdt_percent: c.hdt_percent,
    nppf_applied: c.nppf_applied,
    development_plan: c.development_plan ?? [],
    determinative_policies: c.determinative_policies ?? [],
    policy_findings: c.policy_findings ?? [],
    key_facts: c.key_facts ?? [],
    main_issues: c.main_issues ?? [],
    tags: c.tags ?? [],
    related: c.related ?? [],
    sources: (c.sources ?? []).filter((s) => /^https?:\/\//.test(s)),
    summarised_from: c.verification,
    note_markdown: body,
  };
}

const refLabel = (c) => (c.appeal_ref ? `appeal ${c.appeal_ref}` : c.lpa_ref ? `application ${c.lpa_ref}` : c.case_id);
const sourceLabel = (u) => {
  if (u.includes('/published-document/')) return 'Decision letter (Planning Inspectorate)';
  if (u.includes('appeal-planning-decision.service.gov.uk')) return 'Appeal on the Planning Inspectorate appeals service';
  if (u.includes('acp.planninginspectorate.gov.uk')) return 'Appeal on the Planning Inspectorate casework portal';
  return new URL(u).hostname.replace(/^www\./, '');
};

function decisionPage(r, base, ids) {
  const link = (t) =>
    t.replace(/\b(?:[A-Za-z]+-[A-Za-z0-9._-]+|6\d{6})\b/g, (m) => {
      const id = ids.has(m) ? m : /^6\d{6}$/.test(m) && ids.has(`PINS-${m}`) ? `PINS-${m}` : null;
      return id && id !== r.case_id ? `<a href="${id}.html">${m}</a>` : m;
    });
  const sections = Object.fromEntries([...r.note_markdown.matchAll(/^## (.+)\n([\s\S]*?)(?=^## |$(?![\r\n]))/gm)].map((m) => [m[1].trim(), m[2].trim()]));
  const facts = [
    ['Decision', `${esc(r.outcome)}, ${esc(gbDate(r.decision_date))}`],
    ['Decided by', `${esc(DM[r.decision_maker] ?? r.decision_maker)}${r.inspector ? `: ${esc(r.inspector)}` : ''}`],
    ['Authority', `${esc(r.authority)}${r.region ? ` (${esc(r.region)})` : ''}`],
    r.appeal_ref && ['Appeal reference', esc(r.appeal_ref)],
    r.lpa_ref && ['Application reference', esc(r.lpa_ref)],
    r.procedure && ['Procedure', esc(r.procedure.replace(/-/g, ' '))],
    r.development && ['Development', esc(r.development)],
    r.units != null && ['Homes', esc(r.units)],
    r.site_context.length && ['Site context', esc(r.site_context.join(', ').replace(/-/g, ' '))],
    ['Green Belt', r.green_belt ? `Yes${r.grey_belt && r.grey_belt !== 'n/a' ? ` (grey belt ${esc(r.grey_belt.replace(/-/g, ' '))})` : ''}` : 'No'],
    r.housing_land_supply_years != null && ['Housing land supply', `${esc(r.housing_land_supply_years)} years`],
    r.hdt_percent != null && ['Housing Delivery Test', `${esc(r.hdt_percent)}%`],
    ['Framework applied', esc(FW[r.nppf_applied] ?? r.nppf_applied)],
    r.determinative_policies.length && ['Determinative policies', esc(r.determinative_policies.join(', '))],
    r.development_plan.length && ['Development plan policies', esc(r.development_plan.join(', '))],
    r.main_issues.length && ['Main issues', esc(r.main_issues.join('; '))],
  ].filter(Boolean);
  const title = `${r.title}: ${refLabel(r)} ${r.outcome}`;
  const description = clip(`${r.outcome[0].toUpperCase()}${r.outcome.slice(1)} ${gbDate(r.decision_date)} (${r.authority}). ${sections.Summary ?? r.development ?? ''}`.replace(/\*\*/g, ''), 160);
  const body = `  <h1>${esc(r.title)}</h1>
  <div class="cmeta"><span>${esc(refLabel(r))}</span><span>&middot;</span><span>${esc(r.authority)}</span><span>&middot;</span><span>${esc(gbDate(r.decision_date))}</span><span class="badge${GOOD.test(r.outcome) ? ' ok' : ''}">${esc(r.outcome)}</span></div>
</header>
<main>
<dl class="facts">
${facts.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('\n')}
</dl>
${markdown(r.note_markdown, { link })}
${r.policy_findings.length ? `<h2>Policy findings</h2>
<p class="dek">Policy codes are those of the National Planning Policy Framework (August 2026) unless a development plan is named.</p>
<div class="tw"><table><thead><tr><th>Policy</th><th>Finding</th><th>Weight</th><th>Note</th></tr></thead><tbody>
${r.policy_findings.map((p) => `<tr><td class="n">${esc(p.policy)}</td><td>${esc(p.finding)}</td><td>${esc(p.weight ?? '')}</td><td>${esc(p.note ?? '')}</td></tr>`).join('\n')}
</tbody></table></div>` : ''}
${r.key_facts.length ? `<h2>Key facts</h2>\n<ul>${r.key_facts.map((k) => `<li>${link(esc(k))}</li>`).join('\n')}</ul>` : ''}
${r.related.length ? `<h2>Related decisions</h2>\n<ul>${r.related.map((id) => `<li>${ids.has(id) ? `<a href="${esc(id)}.html">${esc(id)}</a>` : esc(id)}</li>`).join('')}</ul>` : ''}
<h2>Sources</h2>
${r.sources.length ? `<ul>${r.sources.map((u) => `<li><a href="${esc(u)}" rel="noopener">${esc(sourceLabel(u))}</a></li>`).join('\n')}</ul>` : '<p>No public link on file.</p>'}
<p class="note">This note is one of the decisions behind the <a href="../">NPPF 2026 Navigator</a>, which shows how each Framework test has been applied across <a href="./">all the decisions in the database</a>. Also available as <a href="${esc(r.case_id)}.md">Markdown</a>.</p>
</main>
<footer>A summary of a public planning decision, written from ${READ[r.summarised_from] ?? 'the decision'}. Read the decision itself before relying on it. Not legal advice. Prepared by Planning Distilled.
<p class="licence">${LICENCE}</p>
</footer>`;
  return page({
    title,
    description,
    canonical: `${base}decisions/${r.case_id}.html`,
    crumb: '<a href="../">NPPF 2026 Navigator</a> &rsaquo; <a href="./">Decisions</a>',
    body,
    extraHead: `<link rel="alternate" type="text/markdown" href="${esc(r.case_id)}.md">\n`,
  });
}

function decisionMarkdown(r) {
  const li = (k, v) => (v == null || v === '' || (Array.isArray(v) && !v.length) ? null : `- **${k}:** ${Array.isArray(v) ? v.join(', ') : v}`);
  return [
    `# ${r.title}`,
    '',
    [
      li('Decision', `${r.outcome}, ${gbDate(r.decision_date)}`),
      li('Decided by', `${DM[r.decision_maker] ?? r.decision_maker}${r.inspector ? `: ${r.inspector}` : ''}`),
      li('Authority', `${r.authority}${r.region ? ` (${r.region})` : ''}`),
      li('Appeal reference', r.appeal_ref),
      li('Application reference', r.lpa_ref),
      li('Procedure', r.procedure),
      li('Development', r.development),
      li('Homes', r.units),
      li('Site context', r.site_context),
      li('Green Belt', r.green_belt ? `yes${r.grey_belt && r.grey_belt !== 'n/a' ? ` (grey belt ${r.grey_belt})` : ''}` : 'no'),
      li('Housing land supply (years)', r.housing_land_supply_years),
      li('Housing Delivery Test (%)', r.hdt_percent),
      li('Framework applied', FW[r.nppf_applied] ?? r.nppf_applied),
      li('Determinative policies', r.determinative_policies),
      li('Development plan policies', r.development_plan),
      li('Main issues', r.main_issues),
      li('Tags', r.tags),
    ].filter(Boolean).join('\n'),
    '',
    r.note_markdown,
    '',
    r.policy_findings.length ? `## Policy findings\n${r.policy_findings.map((p) => `- **${p.policy}: ${p.finding}${p.weight ? ` (${p.weight} weight)` : ''}.** ${p.note ?? ''}`).join('\n')}\n` : '',
    r.key_facts.length ? `## Key facts\n${r.key_facts.map((k) => `- ${k}`).join('\n')}\n` : '',
    r.sources.length ? `## Sources\n${r.sources.map((u) => `- ${u}`).join('\n')}\n` : '',
    '---',
    `Source: ${r.url}`,
    `A summary of a public planning decision, written from ${READ[r.summarised_from] ?? 'the decision'}. Not legal advice. ${LICENCE_MD}`,
    '',
  ].filter((x) => x !== '').join('\n\n').replace(/\n{3,}/g, '\n\n');
}

function decisionsIndex(records, base, dataset) {
  const n = records.length;
  const appeals = records.filter((r) => r.decision_maker === 'inspector' || r.decision_maker === 'secretary-of-state').length;
  const title = `Planning decisions under the August 2026 NPPF: ${n} decision notes`;
  const description = `${n} planning decisions made in England since the August 2026 National Planning Policy Framework took effect, each read and summarised with the policy findings, quotations and paragraph references. Free to reuse (CC BY 4.0).`;
  const body = `  <h1>Decisions under the August 2026 NPPF</h1>
  <p class="dek">${n} planning decisions made in England since the August 2026 National Planning Policy Framework (NPPF) took effect: ${appeals} appeal decisions by Planning Inspectors and the Secretary of State, and ${n - appeals} decisions by councils. Each has been read and summarised, with the finding on every Framework policy the decision turned on. Newest decision: ${esc(gbDate(dataset.newestDecisionDate))}.</p>
</header>
<main>
<p class="note">These are the decisions behind the <a href="../">NPPF 2026 Navigator</a>, which matches them to each step of the Framework's decision route (<a href="../route/">the route in full</a>). How they were collected and checked is set out in <a href="../method-and-cross-references/">Method &amp; cross-references</a>. The whole database can be downloaded as <a href="decisions.json">JSON</a> or <a href="decisions.csv">CSV</a> and reused under CC BY 4.0.</p>
<div class="tw"><table>
<thead><tr><th>Decided</th><th>Site</th><th>Authority</th><th>Decided by</th><th>Outcome</th></tr></thead>
<tbody>
${records.map((r) => `<tr><td class="n">${esc(r.decision_date)}</td><td><a href="${esc(r.case_id)}.html">${esc(r.title)}</a></td><td>${esc(r.authority)}</td><td>${esc(DM[r.decision_maker] ?? r.decision_maker)}</td><td>${esc(r.outcome)}</td></tr>`).join('\n')}
</tbody>
</table></div>
</main>
<footer>Summaries of public planning decisions, written from the decision letters, officer reports and decision notices. Read the decision itself before relying on a summary. Not legal advice. Prepared by Planning Distilled.
<p class="licence">${LICENCE}</p>
</footer>`;
  return page({ title, description, canonical: `${base}decisions/`, crumb: '<a href="../">NPPF 2026 Navigator</a> &rsaquo; Decisions', body, wide: true });
}

const csvCell = (v) => {
  const s = Array.isArray(v) ? v.join('; ') : v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const CSV_COLS = ['case_id', 'title', 'authority', 'region', 'decision_maker', 'appeal_ref', 'lpa_ref', 'decision_date', 'outcome', 'procedure', 'development', 'dev_type', 'units', 'site_context', 'green_belt', 'grey_belt', 'housing_land_supply_years', 'nppf_applied', 'determinative_policies', 'main_issues', 'tags', 'url'];

// ---------- the route in full
function routePages(base, ids) {
  const src = readFileSync(join(PKG, 'graph.md'), 'utf8');
  const counts = src.match(/(\d+) nodes, (\d+) verbatim quotes/);
  if (!counts) throw new Error('graph.md: no node and quote counts on the second line');
  const intro = `Every question the NPPF 2026 Navigator asks, in order, with the condition under which it is asked, the answers it offers, the guidance drawn from decisions and the Framework text it rests on: ${counts[1]} steps and ${counts[2]} verbatim quotations from the National Planning Policy Framework (August 2026), each checked against the published text.`;
  const rest = src.split('\n').slice(3).join('\n'); // drop the review-copy title and build note
  const mdOut = `# The NPPF 2026 decision route in full\n\n${intro}\n\n${rest.trim()}\n\n---\n\nSource: ${base}route/\nNot legal advice. ${LICENCE_MD}\n`;
  const link = (t) => t.replace(/\b6\d{6}\b/g, (m) => (ids.has(`PINS-${m}`) ? `<a href="../decisions/PINS-${m}.html">${m}</a>` : m));
  const content = markdown(rest, { link, ids: true });
  const toc = [...content.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)].map((m) => `<li><a href="#${m[1]}">${m[2]}</a></li>`).join('');
  const body = `  <h1>The NPPF 2026 decision route in full</h1>
  <p class="dek">${esc(intro)}</p>
</header>
<main>
<p class="note">This is the static text of the <a href="../">NPPF 2026 Navigator</a>. The Navigator asks only the questions that apply to the answers given so far and shows the matching <a href="../decisions/">decisions</a> at each step. Also available as <a href="index.md">Markdown</a>.</p>
<ul>${toc}</ul>
${content}
</main>
<footer>A research aid to reading the August 2026 Framework. It does not replace the development plan, the full Framework, the decision letters or professional advice. Not legal advice. Prepared by Planning Distilled.
<p class="licence">${LICENCE}</p>
</footer>`;
  const html = page({
    title: 'The NPPF 2026 decision route in full: every question, test and policy text',
    description: 'Every question the NPPF 2026 Navigator asks, with the guidance drawn from decisions and the verbatim Framework text: the August 2026 NPPF decision route as one page.',
    canonical: `${base}route/`,
    crumb: '<a href="../">NPPF 2026 Navigator</a> &rsaquo; The route in full',
    body,
    extraHead: '<link rel="alternate" type="text/markdown" href="index.md">\n',
  });
  return { html, md: mdOut };
}

// ---------- write
export function buildStaticPages(target, base) {
  const cases = JSON.parse(readFileSync(join(DB, 'index/cases.json'), 'utf8'));
  const manifest = JSON.parse(readFileSync(join(PKG, 'dist/data/manifest.json'), 'utf8'));
  if (manifest.dataset.cases !== cases.length) throw new Error(`dist has ${manifest.dataset.cases} cases, cases.json has ${cases.length}: run npm run build first`);
  const ids = new Set(cases.map((c) => c.case_id));
  const noteBody = (c) => {
    const parts = readFileSync(join(DB, c._file), 'utf8').split(/^---\s*$/m);
    return parts.length >= 3 ? parts.slice(2).join('---').trim() : '';
  };
  const records = cases
    .map((c) => {
      if (!/^[A-Za-z0-9._-]+$/.test(c.case_id)) throw new Error(`case id not safe for a file name: ${c.case_id}`);
      return publicRecord(c, noteBody(c), `${base}decisions/${c.case_id}.html`);
    })
    .sort((a, b) => (a.decision_date < b.decision_date ? 1 : a.decision_date > b.decision_date ? -1 : a.case_id.localeCompare(b.case_id)));

  const dir = join(target, 'decisions');
  mkdirSync(dir, { recursive: true });
  mkdirSync(join(target, 'route'), { recursive: true });
  const keep = new Set(['index.html', 'decisions.json', 'decisions.csv']);
  for (const r of records) {
    writeFileSync(join(dir, `${r.case_id}.html`), decisionPage(r, base, ids));
    writeFileSync(join(dir, `${r.case_id}.md`), decisionMarkdown(r));
    keep.add(`${r.case_id}.html`).add(`${r.case_id}.md`);
  }
  writeFileSync(join(dir, 'index.html'), decisionsIndex(records, base, manifest.dataset));
  writeFileSync(join(dir, 'decisions.json'), `${JSON.stringify(records, null, 1)}\n`);
  writeFileSync(join(dir, 'decisions.csv'), `${[CSV_COLS.join(','), ...records.map((r) => CSV_COLS.map((k) => csvCell(r[k])).join(','))].join('\n')}\n`);
  for (const f of readdirSync(dir)) {
    if (!keep.has(f)) {
      rmSync(join(dir, f));
      console.log('removed', `decisions/${f}`);
    }
  }
  const route = routePages(base, ids);
  writeFileSync(join(target, 'route', 'index.html'), route.html);
  writeFileSync(join(target, 'route', 'index.md'), route.md);
  writeFileSync(join(target, 'static.css'), CSS);
  console.log(`static pages: ${records.length} decision notes (html + md), decisions index, json and csv, and the route in full`);
  return { decisions: records.length, dataset: manifest.dataset };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [target, base = 'https://planningdistilled.org/research/england/nppf-navigator/'] = process.argv.slice(2);
  if (!target) {
    console.error('usage: node build/static-pages.mjs <target dir> [canonical URL]');
    process.exit(1);
  }
  buildStaticPages(target, base);
}
