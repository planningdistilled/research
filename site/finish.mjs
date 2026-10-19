// The last step of every publish to planningdistilled.org. Run it after any page build or hand edit in
// the main-site checkout, before committing there:
//
//   node site/finish.mjs               write metadata, sitemap.xml, llms.txt, llms-full.txt
//   node site/finish.mjs --indexnow    after the push is live: tell IndexNow (Bing and others)
//                                               which pages are new or changed today
//   node site/finish.mjs --site <dir>  a checkout somewhere other than the default
//
// The page builds own each page's <title>, description, canonical link and licence line. This pass adds
// what search engines and AI crawlers read on top of that, the same way on every page, between
// <!-- pd:meta --> markers: Open Graph and Twitter card tags, the share image, the favicon, snippet and
// text-and-data-mining permissions, schema.org JSON-LD (Article, Dataset, WebApplication,
// BreadcrumbList) and the Cloudflare Web Analytics beacon. It is idempotent. A page's modified date only moves when
// its content, ignoring this block, differs from the last commit, so sitemap.xml carries honest <lastmod>
// values.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE as DEFAULT_SITE } from '../paths.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, dflt) => (args.includes(name) ? args[args.indexOf(name) + 1] : dflt);
const SITE = resolve(opt('--site', DEFAULT_SITE));
const ORIGIN = 'https://planningdistilled.org';
const NAME = 'Planning Distilled';
const LICENCE = 'https://creativecommons.org/licenses/by/4.0/';
const IMAGE = { url: `${ORIGIN}/assets/og.png`, width: 1200, height: 630, alt: 'Planning Distilled: planning decisions under the 2026 NPPF, distilled' };
const TODAY = new Date().toISOString().slice(0, 10);
const NAV = '/research/england/nppf-navigator/';

// Cloudflare Web Analytics. The beacon counts page views, referrers, countries and Core Web Vitals. It sets
// no cookie and stores nothing on the visitor's device, so the site needs no consent banner. Custom events
// are not supported; the Google Analytics tag that used to be written here is gone with its click listener.
// The token is not a secret (it is in every page's source); the snippet is from dash.cloudflare.com → Web
// Analytics. The DNS records are not proxied through Cloudflare, so the snippet has to be on the page.
const CF_TOKEN = '4358578f0ad044988d44e0e01c5811a6';
const ANALYTICS_TAG = `<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${CF_TOKEN}"}'></script>`;

// Section landing pages (lists of links); every other page is an article unless named below.
const COLLECTIONS = new Set(['/research/', '/research/england/', '/research/authority/', '/research/settlement/', '/research/authority/stratford-dc/', '/research/settlement/claverdon/']);
const SKIP = new Set(['404.html']); // served with a 404 status: no metadata, not in the sitemap
// A page that only redirects to its new address (left by a build when a page moves): no metadata, not in the sitemap.
const isRedirect = (rel) => /<meta http-equiv="refresh"/.test(readFileSync(join(SITE, rel), 'utf8').slice(0, 2000));

const git = (...a) => execFileSync('git', ['-C', SITE, ...a], { encoding: 'utf8', maxBuffer: 256 << 20 });
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const BLOCK = /<!-- pd:meta -->[\s\S]*?<!-- \/pd:meta -->\n?/;
// The nav is inserted as "\n" + block (no trailing newline), so this strips exactly what was inserted.
const NAV_BLOCK = /\n<!-- pd:nav -->[\s\S]*?<!-- \/pd:nav -->/;
// Page furniture written by this pass (the meta block and the site navigation) is ignored when deciding
// whether a page's content changed, so a navigation change does not move every page's modified date.
const core = (html) => html.replace(BLOCK, '').replace(NAV_BLOCK, '');

// ---------- site navigation and section indexes
// The navigation bar is generated from the page scan and written into every page between
// <!-- pd:nav --> markers: a home link and one native <details> menu per section (no JavaScript), listing
// that section's pages with the current page marked. The three sections are the research collections; a
// page belongs to the section whose path prefixes its own. Pages nest under the nearest page above them.
// The section index pages carry a <!-- pd:index SCOPE --> block that is regenerated here with the same data,
// so a new page appears in the menus and on the index pages the moment it is built.
const SECTIONS = [
  { path: '/research/england/', label: 'England', long: 'England' },
  { path: '/research/authority/', label: 'Councils', long: 'Local planning authorities' },
  { path: '/research/settlement/', label: 'Settlements', long: 'Settlements' },
];
// Short menu labels. A page not listed here is labelled from its <h1>, shortened.
const LABELS = {
  '/research/england/nppf-navigator/': 'NPPF 2026 Navigator',
  '/research/england/nppf-navigator/route/': 'The decision route in full',
  '/research/england/nppf-navigator/decisions/': 'Decision notes',
  '/research/england/nppf-navigator/method-and-cross-references/': 'Method & cross-references',
  '/research/england/nppf-navigator/method-and-cross-references/sources/': 'Guidance sources',
  '/research/england/nppf-map/': 'NPPF 2026 Map',
  '/research/england/sustainable-location/': 'Assessing a sustainable location',
  '/research/england/sustainable-location/factors/': 'The factors in decisions',
  '/research/england/sustainable-location/service-village/': 'Service village does not mean sustainable',
  '/research/england/sustainable-location/sources/': 'Sources',
  '/research/england/what-is-a-settlement/': 'What is a "settlement"?',
  '/research/england/what-is-a-village/': 'What is a "village"?',
  '/research/england/very-special-circumstances/': 'Very special circumstances',
  '/research/england/substantially-outweighed/': '"Substantially outweighed"',
  '/research/england/dp3-design/': 'DP3: the design policy',
  '/research/authority/stratford-dc/': 'Stratford-on-Avon District',
  '/research/authority/stratford-dc/nppf-2026-decisions/': 'Decisions under the 2026 NPPF',
  '/research/authority/stratford-dc/core-strategy-weight/': 'Core Strategy: which policies keep their weight',
  '/research/authority/officer-reports-compared/': 'Four errors, 22 councils compared',
  '/research/settlement/claverdon/': 'Claverdon',
  '/research/settlement/claverdon/station-road-decision-route/': 'Station Road decision route',
  '/research/settlement/claverdon/kington-lane-decision-route/': 'Kington Lane decision route',
  '/research/settlement/claverdon/kington-lane-decision-route/evidence/': 'Evidence register',
  '/research/settlement/claverdon/station-road-on-foot/': 'Station Road on foot',
  '/research/settlement/claverdon/neighbourhood-plan-weight/': 'Neighbourhood Plan: which policies keep their weight',
};
// Menu and index order within a section; pages not listed follow, alphabetically by label.
const ORDER = [
  '/research/england/nppf-navigator/', '/research/england/nppf-navigator/route/', '/research/england/nppf-navigator/decisions/', '/research/england/nppf-navigator/method-and-cross-references/',
  '/research/england/nppf-map/',
  '/research/england/sustainable-location/', '/research/england/sustainable-location/factors/', '/research/england/sustainable-location/service-village/',
  '/research/england/what-is-a-settlement/', '/research/england/what-is-a-village/', '/research/england/very-special-circumstances/', '/research/england/substantially-outweighed/', '/research/england/dp3-design/',
  '/research/authority/stratford-dc/', '/research/authority/stratford-dc/nppf-2026-decisions/', '/research/authority/stratford-dc/core-strategy-weight/', '/research/authority/officer-reports-compared/',
  '/research/settlement/claverdon/', '/research/settlement/claverdon/station-road-decision-route/', '/research/settlement/claverdon/kington-lane-decision-route/', '/research/settlement/claverdon/station-road-on-foot/', '/research/settlement/claverdon/neighbourhood-plan-weight/',
];
const NAV_CSS = `.pdn{display:flex;flex-wrap:wrap;align-items:center;gap:2px 10px;position:relative;z-index:30;margin:0 auto 10px;padding:8px 0 6px;border-bottom:1px solid var(--line,#d5dddd);font:14px/1.4 -apple-system,"Segoe UI",system-ui,sans-serif;color:var(--ink,#17212b)}
.pdn.pdn-free{max-width:1100px;padding-inline:16px}
.pdn-brand{font-weight:600;color:inherit;text-decoration:none;margin-right:6px}
.pdn-brand:hover{text-decoration:underline}
.pdn details{position:static}
.pdn summary{list-style:none;cursor:pointer;padding:4px 9px;border-radius:6px;color:var(--accent,#2b5c88);font-weight:600;user-select:none}
.pdn summary::-webkit-details-marker{display:none}
.pdn summary::after{content:"";display:inline-block;width:6px;height:6px;margin:0 0 3px 6px;border:solid currentColor;border-width:0 1.5px 1.5px 0;transform:rotate(45deg);transition:transform .15s}
.pdn details[open] summary::after{transform:rotate(-135deg);margin-bottom:-1px}
.pdn details[open] summary,.pdn summary:hover{background:var(--accent-soft,#e3ecf4)}
.pdn summary:focus-visible{outline:2px solid var(--accent,#2b5c88);outline-offset:2px}
.pdn-panel{position:absolute;left:0;right:0;top:100%;margin-top:4px;background:var(--surface,#fff);border:1px solid var(--line,#d5dddd);border-radius:8px;box-shadow:0 12px 32px rgba(0,0,0,.14);padding:12px 16px;columns:2;column-gap:28px;max-width:720px}
.pdn-panel ul{list-style:none;margin:0;padding:0;break-inside:avoid}
.pdn-panel li{margin:0;padding:3px 0}
.pdn-panel ul ul{padding-left:14px;border-left:1px solid var(--line,#d5dddd);margin:2px 0 4px}
.pdn-panel a{color:var(--accent,#2b5c88);text-decoration:none}
.pdn-panel a:hover{text-decoration:underline}
.pdn-panel a[aria-current=page]{font-weight:700;color:var(--ink,#17212b)}
.pdn-panel a[aria-current=page]::before{content:"▸ ";color:var(--accent,#2b5c88)}
.pdn-about{margin-left:auto;color:var(--muted,#5a6672);text-decoration:none;font-size:13px}
.pdn-about:hover{text-decoration:underline}
@media(max-width:600px){.pdn{font-size:13px;gap:0 2px}.pdn summary{padding:4px 6px}.pdn-panel{columns:1;max-width:none}}
@media(prefers-color-scheme:dark){.pdn{--line:var(--line,#2c3945);color:var(--ink,#e3e9ee)}.pdn-panel{background:var(--surface,#18212a);box-shadow:0 12px 32px rgba(0,0,0,.5)}.pdn summary{color:var(--accent,#86b0db)}.pdn-panel a{color:var(--accent,#86b0db)}.pdn-panel a[aria-current=page]{color:var(--ink,#e3e9ee)}.pdn details[open] summary,.pdn summary:hover{background:var(--accent-soft,#1f3244)}}`;
const h1Of = (p) => {
  const m = p.bare.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  return m ? unesc(m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()) : short(p.title);
};
const labelOf = (p) => LABELS[p.path] ?? (() => { const t = h1Of(p).replace(/\s+under the (August )?2026 (NPPF|Framework)\b/i, '').replace(/:.*$/, ''); return t.length > 60 ? `${t.slice(0, 57).trim()}…` : t; })();
const orderKey = (p) => { const i = ORDER.indexOf(p.path); return [i < 0 ? ORDER.length : i, labelOf(p).toLowerCase()]; };
const bySectionOrder = (a, b) => { const [ia, la] = orderKey(a), [ib, lb] = orderKey(b); return ia - ib || (la < lb ? -1 : la > lb ? 1 : 0); };
// Pages that appear in menus and indexes: directory pages (index.html) inside a section, not the generated
// case and decision-note pages, which are files.
let navPages = []; // filled once the pages are scanned (below)
const parentOf = (p) => {
  let best = null;
  for (const q of navPages) if (q !== p && p.path.startsWith(q.path) && (!best || q.path.length > best.path.length)) best = q;
  return best;
};
const childrenOf = (parent, section) => navPages.filter((p) => (parent ? parentOf(p) === parent : p.path.startsWith(section.path) && !parentOf(p))).sort(bySectionOrder);
function menuList(parent, section, current) {
  const kids = childrenOf(parent, section);
  if (!kids.length) return '';
  return `<ul>${kids.map((k) => `<li><a href="${k.path}"${k.path === current ? ' aria-current="page"' : ''}>${esc(labelOf(k))}</a>${menuList(k, section, current)}</li>`).join('')}</ul>`;
}
function navBlock(p, free) {
  const menus = SECTIONS.map((s) => {
    const inSection = p.path.startsWith(s.path);
    return `<details name="pdn"${inSection ? ' class="pdn-here"' : ''}><summary>${esc(s.label)}</summary><div class="pdn-panel"><ul><li><a href="${s.path}"${p.path === s.path ? ' aria-current="page"' : ''}>${esc(s.long)}: all pages</a></li></ul>${menuList(null, s, p.path)}</div></details>`;
  }).join('');
  return `<!-- pd:nav -->\n<nav class="pdn${free ? ' pdn-free' : ''}" aria-label="Site"><a class="pdn-brand" href="/">Planning Distilled</a>${menus}<a class="pdn-about" href="/about/"${p.path === '/about/' ? ' aria-current="page"' : ''}>About</a></nav>\n<style>${NAV_CSS}</style>\n<!-- /pd:nav -->`;
}
function withNav(p) {
  const html = p.bare; // nav block already stripped
  const body = html.match(/<body[^>]*>/);
  // A few early case pages have no <head> or <body> tags: the bar goes in front of their first block.
  const first = body ? null : html.match(/<(?:nav|header|main|div class="wrap)/);
  if (!body && !first) return html;
  const at = body ? body.index + body[0].length : first.index;
  // Inside the page's own container when it opens straight after <body>, so the bar aligns with the content.
  const container = html.slice(at, at + 240).match(/^\s*(?:<a class="skip"[^>]*>[^<]*<\/a>\s*)?<div (?:class="wrap[^"]*"|id="app")>/);
  if (container) {
    const cut = at + container[0].length;
    return `${html.slice(0, cut)}\n${navBlock(p, false)}${html.slice(cut)}`;
  }
  // Otherwise above the page's content, at the width the page gives its main container.
  const width = html.slice(0, at).match(/(?:^|[\s;{}])(?:main|\.wrap|#app|\.page)\{[^}]*max-width:\s*(\d+)px/)?.[1];
  return `${html.slice(0, at)}\n${navBlock(p, true).replace('<nav class="pdn pdn-free"', `<nav class="pdn pdn-free"${width ? ` style="max-width:${width}px"` : ''}`)}${html.slice(at)}`;
}
const INDEX_BLOCK = /<!-- pd:index (all|england|authority|settlement) -->[\s\S]*?<!-- \/pd:index -->/;
function indexCards(section) {
  // Collection pages inside a section (e.g. a council or a village) are transparent: their children get cards.
  const top = childrenOf(null, section).flatMap((p) => (COLLECTIONS.has(p.path) ? childrenOf(p, section) : [p]));
  return top.map((p) => {
    const subs = childrenOf(p, section);
    return `  <a class="card" href="${p.path}">\n    <h3>${esc(h1Of(p))}</h3>\n    <p>${esc(p.description)}</p>\n  </a>\n${subs.map((s) => `  <p class="more"><a href="${s.path}">${esc(labelOf(s))}</a> — ${esc(s.description)}</p>\n`).join('')}`;
  }).join('');
}
function indexBlock(scope) {
  const sections = scope === 'all' ? SECTIONS : SECTIONS.filter((s) => s.path === `/research/${scope}/`);
  const body = sections.map((s) => `${scope === 'all' ? `<h2 class="section"><a href="${s.path}">${esc(s.long)}</a></h2>\n` : ''}${indexCards(s)}`).join('');
  return `<!-- pd:index ${scope} -->\n${body}<!-- /pd:index -->`;
}

// ---------- the pages
function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    if (f === '.git') continue;
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (f.endsWith('.html')) out.push(relative(SITE, p));
  }
  return out;
}
const urlPath = (rel) => `/${rel.replace(/(^|\/)index\.html$/, '$1')}`;

const pages = walk(SITE)
  .filter((rel) => !SKIP.has(rel) && !isRedirect(rel))
  .sort()
  .map((rel) => {
    const html = readFileSync(join(SITE, rel), 'utf8');
    const bare = core(html);
    const head = bare.includes('</head>') ? bare.slice(0, bare.indexOf('</head>')) : bare;
    const title = head.match(/<title>([\s\S]*?)<\/title>/);
    const desc = head.match(/<meta name="description" content="([^"]*)"/);
    const canon = head.match(/<link rel="canonical" href="([^"]*)"/);
    const path = urlPath(rel);
    const problems = [];
    if (!title) problems.push('no <title> in <head>');
    if (!desc) problems.push('no meta description in <head>');
    if (!canon) problems.push('no canonical link in <head>');
    else if (canon[1] !== ORIGIN + path) problems.push(`canonical is ${canon[1]}, expected ${ORIGIN + path}`);
    if (!/<h1[\s>]/.test(bare)) problems.push('no <h1>');
    return { rel, path, url: ORIGIN + path, html, bare, title: title ? unesc(title[1].trim()) : '', description: desc ? unesc(desc[1]) : '', problems };
  });
const bad = pages.filter((p) => p.problems.length);
if (bad.length) {
  console.error(bad.map((p) => `${p.rel}: ${p.problems.join('; ')}`).join('\n'));
  console.error(`\n✗ ${bad.length} page(s) need fixing in their build before the site is published`);
  process.exit(1);
}
const byPath = new Map(pages.map((p) => [p.path, p]));
navPages = pages.filter((p) => p.path.endsWith('/') && SECTIONS.some((s) => p.path.startsWith(s.path) && p.path !== s.path));

// ---------- dates, from git: published = first commit of the file, modified = last change to its content
const firstAdded = new Map();
const lastCommit = new Map();
{
  let date = '';
  for (const line of git('log', '--format=@%cs', '--name-only').split('\n')) {
    if (line.startsWith('@')) date = line.slice(1);
    else if (line) {
      if (!lastCommit.has(line)) lastCommit.set(line, date); // log runs newest first
      firstAdded.set(line, date);
    }
  }
}
const tracked = new Set(git('ls-tree', '-r', '--name-only', 'HEAD').split('\n').filter(Boolean));
function headVersions(rels) {
  const out = new Map();
  if (!rels.length) return out;
  const buf = execFileSync('git', ['-C', SITE, 'cat-file', '--batch'], { input: rels.map((r) => `HEAD:${r}`).join('\n') + '\n', maxBuffer: 1 << 30 });
  let at = 0;
  for (const rel of rels) {
    const nl = buf.indexOf(10, at);
    const size = Number(buf.toString('utf8', at, nl).split(' ')[2]);
    out.set(rel, buf.toString('utf8', nl + 1, nl + 1 + size));
    at = nl + 1 + size + 1;
  }
  return out;
}
const atHead = headVersions(pages.map((p) => p.rel).filter((r) => tracked.has(r)));
for (const p of pages) {
  const was = atHead.get(p.rel);
  p.published = firstAdded.get(p.rel) ?? TODAY;
  if (was === undefined || core(was) !== p.bare) p.modified = TODAY;
  else p.modified = was.match(/<meta property="article:modified_time" content="(\d{4}-\d\d-\d\d)"/)?.[1] ?? lastCommit.get(p.rel) ?? TODAY;
}

// ---------- structured data
const ORG = { '@type': 'Organization', '@id': `${ORIGIN}/#organisation`, name: NAME, url: `${ORIGIN}/` };
const short = (t) => t.replace(/\s+[—–-]\s+Planning Distilled$/, '');
function breadcrumb(p) {
  const parts = p.path.split('/').filter(Boolean);
  const trail = [{ name: NAME, url: `${ORIGIN}/` }];
  for (let i = 1; i <= parts.length; i++) {
    const last = i === parts.length;
    const path = `/${parts.slice(0, i).join('/')}${last && !p.path.endsWith('/') ? '' : '/'}`;
    const page = byPath.get(path);
    if (page) trail.push({ name: short(page.title), url: page.url });
  }
  return { '@type': 'BreadcrumbList', itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: t.url })) };
}
function decisionsDataset(p) {
  const records = JSON.parse(readFileSync(join(SITE, NAV.slice(1), 'decisions/decisions.json'), 'utf8'));
  const newest = records.reduce((m, r) => (r.decision_date > m ? r.decision_date : m), '');
  return {
    '@type': 'Dataset',
    name: `Planning decisions under the August 2026 NPPF (${records.length} decision notes)`,
    description: p.description,
    url: p.url,
    license: LICENCE,
    isAccessibleForFree: true,
    creator: ORG,
    publisher: ORG,
    inLanguage: 'en-GB',
    keywords: ['National Planning Policy Framework', 'NPPF 2026', 'planning appeal decisions', 'Planning Inspectorate', 'Green Belt', 'grey belt', 'sustainable location', 'England'],
    spatialCoverage: { '@type': 'Place', name: 'England' },
    temporalCoverage: `2026-08-17/${newest}`,
    datePublished: p.published,
    dateModified: p.modified,
    distribution: [
      { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${p.url}decisions.json` },
      { '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${p.url}decisions.csv` },
    ],
  };
}
function jsonLd(p) {
  const common = { name: p.title, description: p.description, url: p.url, inLanguage: 'en-GB', isAccessibleForFree: true, license: LICENCE };
  const graph = [];
  if (p.path === '/') {
    graph.push({ '@type': 'WebSite', '@id': `${ORIGIN}/#website`, ...common, name: NAME, alternateName: p.title, publisher: ORG }, { ...ORG, description: p.description });
  } else if (p.path === `${NAV}decisions/`) {
    graph.push(decisionsDataset(p), breadcrumb(p));
  } else if (p.path === NAV) {
    graph.push({ '@type': 'WebApplication', ...common, applicationCategory: 'ReferenceApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript', offers: { '@type': 'Offer', price: 0, priceCurrency: 'GBP' }, author: ORG, publisher: ORG, dateModified: p.modified, image: IMAGE.url }, breadcrumb(p));
  } else if (COLLECTIONS.has(p.path)) {
    graph.push({ '@type': 'CollectionPage', ...common, isPartOf: { '@id': `${ORIGIN}/#website` }, publisher: ORG, dateModified: p.modified }, breadcrumb(p));
  } else {
    const type = p.path === '/about/' ? 'AboutPage' : 'Article';
    graph.push({ '@type': type, ...common, headline: p.title.slice(0, 110), mainEntityOfPage: p.url, image: IMAGE.url, author: ORG, publisher: ORG, datePublished: p.published, dateModified: p.modified }, breadcrumb(p));
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

// ---------- the block
function block(p) {
  const has = (re) => re.test(p.bare);
  const article = p.path !== '/' && !COLLECTIONS.has(p.path) && p.path !== NAV;
  const lines = [
    '<!-- pd:meta -->',
    !has(/property="og:type"/) && `<meta property="og:type" content="${article ? 'article' : 'website'}">`,
    !has(/property="og:site_name"/) && `<meta property="og:site_name" content="${NAME}">`,
    !has(/property="og:title"/) && `<meta property="og:title" content="${esc(p.title)}">`,
    !has(/property="og:description"/) && `<meta property="og:description" content="${esc(p.description)}">`,
    !has(/property="og:url"/) && `<meta property="og:url" content="${p.url}">`,
    '<meta property="og:locale" content="en_GB">',
    `<meta property="og:image" content="${IMAGE.url}">`,
    `<meta property="og:image:width" content="${IMAGE.width}">`,
    `<meta property="og:image:height" content="${IMAGE.height}">`,
    `<meta property="og:image:alt" content="${esc(IMAGE.alt)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    article && `<meta property="article:published_time" content="${p.published}">`,
    `<meta property="article:modified_time" content="${p.modified}">`,
    '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">',
    '<meta name="tdm-reservation" content="0">',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    `<script type="application/ld+json">${jsonLd(p)}</script>`,
    ANALYTICS_TAG,
    '<!-- /pd:meta -->',
  ];
  return `${lines.filter(Boolean).join('\n')}\n`;
}

let written = 0;
for (const p of pages) {
  // Section index pages: regenerate the card list first, so the dates below see the real content.
  const idx = p.bare.match(INDEX_BLOCK);
  if (idx) {
    const regenerated = p.bare.replace(INDEX_BLOCK, indexBlock(idx[1]));
    if (regenerated !== p.bare) { p.bare = regenerated; p.modified = TODAY; }
  }
  const withBar = withNav(p);
  const at = withBar.indexOf('</title>');
  const cut = withBar.indexOf('\n', at) === at + '</title>'.length ? at + '</title>'.length + 1 : at + '</title>'.length;
  const next = `${withBar.slice(0, cut)}${cut === at + '</title>'.length ? '\n' : ''}${block(p)}${withBar.slice(cut)}`;
  if (next !== p.html) {
    writeFileSync(join(SITE, p.rel), next);
    written++;
  }
}

// ---------- sitemap.xml
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${esc(p.url)}</loc><lastmod>${p.modified}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(SITE, 'sitemap.xml'), sitemap);

// ---------- llms.txt and llms-full.txt
const home = byPath.get('/');
const landing = pages.filter((p) => p.path.endsWith('/') && p.path !== '/' && !COLLECTIONS.has(p.path)).sort((a, b) => (a.path === '/about/') - (b.path === '/about/'));
const route = join(SITE, NAV.slice(1), 'route/index.md');
const decisionsDir = join(SITE, NAV.slice(1), 'decisions');
const notes = existsSync(decisionsDir) ? readdirSync(decisionsDir).filter((f) => f.endsWith('.md')).sort() : [];
const reuse = `Everything on this site is free to reuse under the Creative Commons Attribution 4.0 licence (${LICENCE}), with credit to "Planning Distilled". That includes quoting, summarising, indexing, retrieval and training AI models. Quotations from decision letters, plans and the Framework remain the copyright of their publishers. The data, tools and page sources are at https://github.com/planningdistilled/research.`;
const llms = `# ${NAME}

> ${home.description}

${reuse}

The research is about England only. "NPPF" is the National Planning Policy Framework; the version in force took effect on 17 August 2026. Policy codes such as S5, GB7, TR3 and HE6 are that Framework's own. Nothing here is legal advice.

## Research

${landing.map((p) => `- [${short(p.title)}](${p.url}): ${p.description}`).join('\n')}

## Machine-readable copies

- [The NPPF 2026 decision route in full (Markdown)](${ORIGIN}${NAV}route/index.md): every question the Navigator asks, with the guidance and the verbatim Framework text
- [All decision notes (JSON)](${ORIGIN}${NAV}decisions/decisions.json): one record per decision, with the policy findings, key facts, sources and the full note
- [Decision index (CSV)](${ORIGIN}${NAV}decisions/decisions.csv): one row per decision
- Each decision note is also Markdown: ${ORIGIN}${NAV}decisions/<case_id>.md (${notes.length} notes; the case ids are in the JSON and CSV)
- [llms-full.txt](${ORIGIN}/llms-full.txt): the route and every decision note in one text file
- [sitemap.xml](${ORIGIN}/sitemap.xml): every page, with the date it last changed

## Sections

${[...COLLECTIONS].filter((c) => byPath.has(c)).map((c) => `- [${short(byPath.get(c).title)}](${ORIGIN}${c}): ${byPath.get(c).description}`).join('\n')}
`;
writeFileSync(join(SITE, 'llms.txt'), llms);
if (existsSync(route)) {
  const full = [`# ${NAME}: the NPPF 2026 decision route and every decision note\n\n> ${home.description}\n\n${reuse}\n\nSource: ${ORIGIN}/ (index: ${ORIGIN}/llms.txt). Not legal advice.`, readFileSync(route, 'utf8').trim(), ...notes.map((f) => readFileSync(join(decisionsDir, f), 'utf8').trim())];
  writeFileSync(join(SITE, 'llms-full.txt'), `${full.join('\n\n\n')}\n`);
}

const changed = pages.filter((p) => p.modified === TODAY);
console.log(`✓ ${pages.length} pages checked, ${written} written; sitemap.xml, llms.txt${existsSync(route) ? ', llms-full.txt' : ''} regenerated`);
console.log(`  ${changed.length} page(s) new or changed today`);

// ---------- IndexNow (after the push is live)
if (args.includes('--indexnow')) {
  const keyFile = readdirSync(SITE).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  if (!keyFile) throw new Error('no IndexNow key file at the site root');
  const key = readFileSync(join(SITE, keyFile), 'utf8').trim();
  if (!changed.length) console.log('  IndexNow: nothing changed today');
  for (let i = 0; i < changed.length; i += 10000) {
    const send = () =>
      fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: new URL(ORIGIN).host, key, keyLocation: `${ORIGIN}/${keyFile}`, urlList: changed.slice(i, i + 10000).map((p) => p.url) }),
      });
    let res = await send();
    // The first submission with a key the service has not fetched yet came back 403 (2 Oct 2026); the next was accepted.
    if (res.status === 403) {
      await new Promise((r) => setTimeout(r, 5000));
      res = await send();
    }
    console.log(`  IndexNow: ${Math.min(10000, changed.length - i)} URLs submitted, HTTP ${res.status}${res.ok ? '' : ' (not accepted)'}`);
  }
}
