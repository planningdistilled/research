// Copy the built Navigator (dist/) into a static site folder, e.g. the GitHub Pages repo.
//
// Usage: node build/export-pages.mjs [target dir] [canonical URL]
// The target defaults to <main-site>/research/england/nppf-navigator (main-site from paths.mjs, $PD_SITE).
//
// dist/index.html is an artifact fragment (the artifact service adds the document skeleton),
// so this wraps it in a full document with search metadata. Data shards are content-hashed:
// shards in <target>/data that the new build no longer uses are removed. It then writes the static
// decision pages and the route in full (static-pages.mjs), which crawlers can read without running the app.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildStaticPages } from './static-pages.mjs';
import { SITE } from './lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const [target = join(SITE, 'research/england/nppf-navigator'), canonical = 'https://planningdistilled.org/research/england/nppf-navigator/'] = process.argv.slice(2);
if (!target) {
  console.error('usage: node build/export-pages.mjs <target dir> [canonical URL]');
  process.exit(1);
}

const title = 'NPPF 2026 Navigator';
const description =
  'An interactive decision route through the National Planning Policy Framework (August 2026): answer the facts and planning judgements a decision needs, see the verbatim policy text for each step, and compare with appeal and council decisions made under the new Framework. Not legal advice.';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const fragment = readFileSync(join(dist, 'index.html'), 'utf8');
const split = fragment.indexOf('<div id="app"');
if (split < 0) throw new Error('dist/index.html: no <div id="app"> to split head from body');
const head = fragment.slice(0, split).replace(/<title>[^<]*<\/title>\n?/, '');
const LOADING = '<div id="app"><p class="loading">';
if (!fragment.includes(LOADING)) throw new Error('dist/index.html: no loading placeholder in <div id="app">');
// A heading in the served HTML; the app replaces everything inside #app when it starts.
const body = fragment.slice(split).replace(LOADING, `<div id="app"><h1>${esc(title)}</h1><p class="loading">`);

// What the tool is, in the page itself: the app's own text only exists once its script has run.
const manifest = JSON.parse(readFileSync(join(dist, 'data', 'manifest.json'), 'utf8'));
const graph = JSON.parse(readFileSync(join(dist, manifest.graph.file), 'utf8'));
const d = manifest.dataset;
const sections = graph.sections.filter((s) => graph.nodes.some((n) => n.section === s.id)).map((s) => s.title);
const longDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const about = `<section class="about-tool" style="max-width:1100px;margin:36px auto 0;padding:20px 16px 0;border-top:1px solid var(--line,#d5dddd);font:15px/1.6 -apple-system,'Segoe UI',system-ui,sans-serif">
<h2 style="font-size:18px;margin:0 0 8px">About this tool</h2>
<p style="margin:0 0 10px;max-width:80ch">The NPPF 2026 Navigator is an interactive decision route through the ${esc(graph.meta.framework)}. It asks for the facts and planning judgements a decision on a housing proposal needs, shows the verbatim policy text at each step, adapts the next questions to the answers, and ends on an indicative determination with its reasons. Each reason is matched to decisions made since the Framework took effect on ${longDate(graph.meta.frameworkDate)}. Not legal advice.</p>
<p style="margin:0 0 10px;max-width:80ch">The route has ${graph.nodes.length} steps in ${sections.length} parts: ${sections.map(esc).join('; ')}. The database behind it holds ${d.cases} decisions (${d.byDecisionMaker.inspector} by Planning Inspectors, ${d.byDecisionMaker['secretary-of-state']} by the Secretary of State and ${d.byDecisionMaker['lpa-committee'] + d.byDecisionMaker['lpa-delegated']} by councils), the newest dated ${longDate(d.newestDecisionDate)}.</p>
<ul style="margin:0;padding-left:20px">
<li><a href="route/">The decision route in full</a>: every question, the answers offered, the guidance and the Framework text, as one page.</li>
<li><a href="decisions/">All ${d.cases} decisions</a>: a page for each decision note, and the whole database as a JSON or CSV download.</li>
<li><a href="method-and-cross-references/">Method &amp; cross-references</a>: how the tool was built and checked, and the inconsistencies found.</li>
</ul>
</section>`;

const page = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<link rel="license" href="https://creativecommons.org/licenses/by/4.0/">
${head.trim()}
</head>
<body>
<nav aria-label="Breadcrumb" style="max-width:1100px;margin:0 auto;padding:12px 16px 0;font:500 12px/1.4 ui-monospace,Menlo,monospace;letter-spacing:.05em;text-transform:uppercase;color:var(--muted,#59635d)"><a href="/" style="color:inherit;text-decoration:none">Planning Distilled</a> &rsaquo; <a href="/research/" style="color:inherit;text-decoration:none">Research</a> &rsaquo; <a href="/research/england/" style="color:inherit;text-decoration:none">England</a> &rsaquo; NPPF 2026 Navigator</nav>
${body.trim()}
${about}
<div class="licence" style="max-width:1100px;margin:28px auto 0;padding:0 16px 24px;font:13px/1.55 -apple-system,'Segoe UI',system-ui,sans-serif;color:var(--muted,#59635d)">&copy; Planning Distilled. Text, data and images on this page are released under the <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 licence</a>: share and adapt them freely, with credit to Planning Distilled. Quotations from decision letters, plans and the Framework remain the copyright of their publishers. Source and data: <a href="https://github.com/planningdistilled/research">github.com/planningdistilled/research</a>.</div>
</body>
</html>
`;

mkdirSync(join(target, 'data'), { recursive: true });
writeFileSync(join(target, 'index.html'), page);
copyFileSync(join(dist, 'app.js'), join(target, 'app.js'));

const shards = readdirSync(join(dist, 'data'));
for (const f of shards) copyFileSync(join(dist, 'data', f), join(target, 'data', f));
for (const f of readdirSync(join(target, 'data'))) {
  if (!shards.includes(f)) {
    rmSync(join(target, 'data', f));
    console.log('removed', `data/${f}`);
  }
}
if (!existsSync(join(target, 'data', 'manifest.json'))) throw new Error('export incomplete: no data/manifest.json');
console.log(`exported index.html, app.js and ${shards.length} data files to ${target}`);
buildStaticPages(target, canonical);
