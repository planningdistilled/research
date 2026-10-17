// NPPF 2026 Map: a standalone page that maps the whole National Planning Policy Framework (August 2026):
// the decision route (as in the Navigator's route map), every chapter and annex as a sub-graph of its policies
// and their cross-references, every policy as a tree of its paragraphs and limbs, a context column with the
// verbatim text of whatever is selected, and a quick-nav box that resolves "S5(1)(j)", "S5 1 j" or a word and
// lists every place it is referenced.
//   node pages/england/nppf-map/build.mjs        (writes main-site/research/england/nppf-map/index.html)
// Everything shown is generated from the canonical Markdown edition and its structure sidecar
// (data/open-sources/nppf/). Every paragraph, limb, heading and glossary entry is checked verbatim against the
// committed text extract (NPPF-August-2026.txt, the quotation oracle); the build fails on a mismatch. Cross-
// references are extracted from the Framework's own words ("policy TR5", "policies HC8, GB6, GB7 and/or GB8",
// "paragraph 2 of this policy", "(HC7)", "Annex B") and every target is checked to exist.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NPPF_MD, NPPF_TXT, OPEN, SITE } from '../../../paths.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE_PATH = 'research/england/nppf-map/';
const URL = 'https://planningdistilled.org/' + SITE_PATH;
const OUT = path.join(SITE, SITE_PATH, 'index.html');
const STRUCTURE = path.join(OPEN, 'nppf', 'NPPF-August-2026.structure.json');
const GITHUB_MD = 'https://github.com/planningdistilled/research/blob/main/data/open-sources/nppf/NPPF-August-2026.md';
const GOVUK = 'https://www.gov.uk/guidance/national-planning-policy-framework';
const PDF = 'https://assets.publishing.service.gov.uk/media/6a8334c03bd75b81e2329ac4/National_Planning_Policy_Framework.pdf';
const NAVIGATOR = '/research/england/nppf-navigator/';
const BUILT = new Date().toISOString().slice(0, 10);

const md = fs.readFileSync(NPPF_MD, 'utf8');
const txt = fs.readFileSync(NPPF_TXT, 'utf8');
const structure = JSON.parse(fs.readFileSync(STRUCTURE, 'utf8'));
const lines = md.split('\n');

// ---------------------------------------------------------------------------------------------------------
// 1. The body: from the first chapter heading to the Footnotes heading. Footnotes are parsed separately.
// ---------------------------------------------------------------------------------------------------------
const firstBody = lines.findIndex((l) => /^## <a id="ch1"><\/a>/.test(l));
const footIdx = lines.findIndex((l) => l === '## Footnotes');
if (firstBody < 0 || footIdx < 0) throw new Error('could not find the body of the Markdown edition');
const body = lines.slice(firstBody, footIdx); // body[i] is md line (firstBody + i + 1)
const footnotes = {};
for (const l of lines.slice(footIdx)) {
  const m = l.match(/^\[\^(\d+)\]: (.*)$/);
  if (m) footnotes[m[1]] = m[2].trim();
}
if (Object.keys(footnotes).length !== structure.footnotes && Object.keys(footnotes).length !== Object.keys(structure.footnotes).length) {
  throw new Error(`footnotes: parsed ${Object.keys(footnotes).length}, structure has ${Object.keys(structure.footnotes).length}`);
}

// Every body line must be one of the known forms (the generator guarantees this; we re-check so the client
// renderer never meets a line it cannot place).
const FORMS = [
  ['blank', /^\s*$/],
  ['page', /^<!-- p\.(\d+) -->$/],
  ['chapter', /^## <a id="(ch\d+|Annex[A-F])"><\/a>(.*)$/],
  ['group', /^### (.*)$/],
  ['policy', /^#### <a id="([A-Z]+\d+)"><\/a>([A-Z]+\d+): (.*)$/],
  ['objective', /^> (.*)$/],
  ['para', /^(\d+)\. <a id="([^"]+)"><\/a>(.*)$/],
  ['letter', /^ {3}([a-z]+)\. <a id="([^"]+)"><\/a>(.*)$/],
  ['roman', /^ {6}([ivx]+)\. <a id="([^"]+)"><\/a>(.*)$/],
  ['bullet', /^\s*[-•] (.*)$/],
  ['table', /^\|(.*)\|\s*$/],
  ['term', /^<a id="(AnnexB-[^"]+)"><\/a>\*\*([^*]+?):?\*\*:? ?(.*)$/],
  ['bold', /^\*\*[^*]+\*\*$/],
  // Annex D's formula and Annex F's table notes: plain lines, rendered as paragraphs.
  ['plain', /^\S.*$|^ {3}\S.*$/],
];
const kindOf = (l) => FORMS.find(([, re]) => re.test(l))?.[0];
body.forEach((l, i) => {
  if (!kindOf(l)) throw new Error(`unknown line form at md line ${firstBody + i + 1}: ${l.slice(0, 80)}`);
});

// ---------------------------------------------------------------------------------------------------------
// 2. Nodes: one per structure entry (chapter, annex, policy, para, letter, roman, term), with verbatim text.
// ---------------------------------------------------------------------------------------------------------
const strip = (s) => s.replace(/<a id="[^"]*"><\/a>/g, '').replace(/\[\^\d+\]/g, '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
const fnIds = (s) => [...s.matchAll(/\[\^(\d+)\]/g)].map((m) => m[1]);

const nodes = [];
const byAnchor = new Map();
const byCode = new Map();
// Locate each entry by its anchor in the body (the sidecar's md_line counts from after the front matter).
const anchorLine = new Map();
body.forEach((l, i) => { for (const m of l.matchAll(/<a id="([^"]+)"><\/a>/g)) { if (anchorLine.has(m[1])) throw new Error(`duplicate anchor ${m[1]}`); anchorLine.set(m[1], i); } });
let currentChapter = null;
let currentPolicy = null;
for (const e of structure.entries) {
  if (!anchorLine.has(e.anchor)) throw new Error(`entry ${e.anchor} has no anchor in the body`);
  const i = anchorLine.get(e.anchor);
  const raw = body[i];
  const kind = kindOf(raw);
  const n = { id: e.anchor, kind: e.kind, code: e.code ?? e.key, title: e.title ?? null, page: e.page, line: i, part: e.part ?? null, parent: null, text: '', fn: fnIds(raw) };
  if (e.kind === 'chapter' || e.kind === 'annex') {
    if (kind !== 'chapter') throw new Error(`${e.anchor}: expected a chapter/annex heading, got ${kind}`);
    const m = raw.match(FORMS[2][1]);
    n.heading = strip(m[2]);
    // The boxed objective follows after a blank line.
    let j = i + 1;
    while (j < body.length && kindOf(body[j]) === 'blank') j++;
    if (j < body.length && kindOf(body[j]) === 'objective') n.text = strip(body[j].replace(/^> /, ''));
    currentChapter = n;
    currentPolicy = null;
  } else if (e.kind === 'policy') {
    if (kind !== 'policy') throw new Error(`${e.anchor}: expected a policy heading, got ${kind}`);
    const m = raw.match(FORMS[4][1]);
    if (m[1] !== e.code) throw new Error(`${e.anchor}: heading code ${m[1]} != ${e.code}`);
    n.text = strip(m[3]);
    n.parent = currentChapter.id;
    currentPolicy = n;
  } else if (e.kind === 'term') {
    if (kind !== 'term') throw new Error(`${e.anchor}: expected a glossary term, got ${kind}`);
    const m = raw.match(FORMS[11][1]);
    n.title = strip(m[2]).replace(/:$/, '');
    n.text = strip(m[3]);
    n.parent = currentChapter.id;
  } else {
    // para, letter, roman
    const want = { para: 'para', letter: 'letter', roman: 'roman' }[e.kind];
    if (kind !== want) throw new Error(`${e.anchor}: expected ${want}, got ${kind} (${raw.slice(0, 60)})`);
    const m = raw.match(FORMS[kind === 'para' ? 6 : kind === 'letter' ? 7 : 8][1]);
    if (m[2] !== e.anchor) throw new Error(`${e.anchor}: anchor in line is ${m[2]}`);
    n.marker = m[1];
    n.text = strip(m[3]);
    // Parent: the anchor with the last segment removed, if it exists; else the policy / chapter.
    const segs = e.anchor.split('-');
    const parentAnchor = segs.slice(0, -1).join('-');
    if (byAnchor.has(parentAnchor)) n.parent = parentAnchor;
    else if (kind === 'para' && currentPolicy) n.parent = currentPolicy.id;
    else n.parent = currentChapter.id;
  }
  nodes.push(n);
  byAnchor.set(n.id, n);
  if (n.code) byCode.set(n.code, n.id);
}
// Annex B defines "Previously developed land" with the code AnnexB:... ; the Navigator also uses AnnexB:PDL.
if (!byCode.has('AnnexB:PDL') && byAnchor.has('AnnexB-previously-developed-land')) byCode.set('AnnexB:PDL', 'AnnexB-previously-developed-land');

// Children lists, in document order.
for (const n of nodes) n.children = [];
for (const n of nodes) if (n.parent) byAnchor.get(n.parent).children.push(n.id);

// ---------------------------------------------------------------------------------------------------------
// 3. Verify every node's text against the quotation oracle (the committed pdftotext extract).
// ---------------------------------------------------------------------------------------------------------
function normalise(t, { source = false } = {}) {
  let s = t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/–|—/g, '-').replace(/ /g, ' ');
  if (source) {
    s = s.split('\n').filter((l) => !/^\s*\d{1,3}\s*$/.test(l)).join('\n')
      .replace(/([a-z%)'])(\d{1,3})(?=[\s.,;:)]|$)/gm, '$1');
  }
  return s.replace(/\s+/g, ' ').replace(/(\w)- (\w)/g, '$1-$2').trim();
}
const oracle = normalise(txt, { source: true });
// The text extract interleaves the footnote block and page furniture into paragraphs that run across a page
// break, so a paragraph is accepted when it is found whole, or in at most five pieces that occur in order with
// nothing but the interleaved block between them (each piece at least 20 characters, or the whole remainder).
function foundInOrder(q) {
  let pos = 0, rest = q, pieces = 0;
  while (rest.length) {
    if (++pieces > 5) return false;
    let lo = 0, hi = rest.length;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (oracle.indexOf(rest.slice(0, mid), pos) >= 0) lo = mid; else hi = mid - 1; }
    if (lo < Math.min(20, rest.length)) return false;
    const idx = oracle.indexOf(rest.slice(0, lo), pos);
    if (pieces > 1 && idx - pos > 2500) return false;
    pos = idx + lo;
    rest = rest.slice(lo).trim();
  }
  return true;
}
const misses = [];
for (const n of nodes) {
  for (const piece of [n.heading, n.title, n.text].filter(Boolean)) {
    // The same footnote-marker rule is applied to our text, so "250m2" compares as "250m" on both sides.
    const q = normalise(piece, { source: true });
    if (q.length < 3) continue;
    if (!oracle.includes(q) && !foundInOrder(q)) misses.push(`${n.id}: ${q.slice(0, 90)}`);
  }
}
if (misses.length) {
  console.error(misses.join('\n'));
  throw new Error(`${misses.length} texts not found in the NPPF text extract`);
}

// ---------------------------------------------------------------------------------------------------------
// 4. Cross-references, from the Framework's own words.
// ---------------------------------------------------------------------------------------------------------
const CODE = String.raw`(?:PM|DM|S|CC|HO|E|TC|CO|W|M|L|GB|DP|TR|HC|P|F|N|HE)\d{1,2}(?:\(\d+\))*(?:\([a-z]\))?(?:\([ivx]+\))?`;
const CODE_RE = new RegExp(`^${CODE}$`);
const toAnchor = (code) => code.replace(/\)\(/g, '-').replace(/[()]/g, (c) => (c === '(' ? '-' : ''));
const refs = []; // { from, to, how }
const unresolved = new Map();
function addRef(from, code, how) {
  const anchor = byCode.has(code) ? byCode.get(code) : byAnchor.has(toAnchor(code)) ? toAnchor(code) : null;
  if (!anchor) { unresolved.set(code, (unresolved.get(code) || 0) + 1); return; }
  if (anchor === from) return;
  if (!refs.some((r) => r.from === from && r.to === anchor)) refs.push({ from, to: anchor, how });
}
function expandRange(a, b) {
  const pa = a.match(/^([A-Z]+)(\d+)$/), pb = b.match(/^([A-Z]+)(\d+)$/);
  if (!pa || !pb || pa[1] !== pb[1]) return [a, b];
  const out = [];
  for (let k = +pa[2]; k <= +pb[2]; k++) out.push(`${pa[1]}${k}`);
  return out;
}
const CHAIN = new RegExp(String.raw`\b[Pp]olic(?:y|ies)\s+(${CODE}(?:(?:\s*,\s*|\s+and\/or\s+|\s+and\s+|\s+or\s+|\s+to\s+|\s*\/\s*)${CODE})*)`, 'g');
// "(HC7)", "(including TR3, TR4 and DP3(2)(d))"
const PAREN = new RegExp(String.raw`\((?:including\s+|see\s+)?(${CODE}(?:(?:,\s*|\s+and\s+|\s+or\s+|\s+and\/or\s+)${CODE})*)\)`, 'g');
const PARA_THIS = /\bparagraphs?\s+(\d+(?:\s*(?:,|and|or|to)\s*\d+)*)\s+of\s+this\s+policy/gi;
const PARA_OF = new RegExp(String.raw`\bparagraphs?\s+(\d+(?:\s*(?:,|and|or|to)\s*\d+)*)\s+of\s+[Pp]olicy\s+(${CODE})`, 'g');
const ANNEX = /\bAnnex\s+([A-F])\b/g;
const CHAPTER = /\b[Cc]hapter\s+(\d{1,2})\b/g;
function policyOf(n) {
  let p = n;
  while (p && p.kind !== 'policy') p = p.parent ? byAnchor.get(p.parent) : null;
  return p;
}
for (const n of nodes) {
  const t = n.text || '';
  for (const m of t.matchAll(CHAIN)) {
    const parts = m[1].split(/\s*,\s*|\s+and\/or\s+|\s+and\s+|\s+or\s+|\s*\/\s*/);
    // "GB6 to GB8" ranges
    const toParts = m[1].split(/\s+to\s+/);
    if (toParts.length === 2 && parts.length === 1) for (const c of expandRange(toParts[0].trim(), toParts[1].trim())) addRef(n.id, c, 'policy');
    else for (const c of parts.flatMap((p) => p.split(/\s+to\s+/).length === 2 ? expandRange(...p.split(/\s+to\s+/).map((x) => x.trim())) : [p.trim()])) if (CODE_RE.test(c)) addRef(n.id, c, 'policy');
  }
  for (const m of t.matchAll(PAREN)) for (const c of m[1].split(/,\s*|\s+and\/or\s+|\s+and\s+|\s+or\s+/)) if (CODE_RE.test(c)) addRef(n.id, c, 'bracket');
  const pol = policyOf(n);
  if (pol) for (const m of t.matchAll(PARA_THIS)) for (const d of m[1].match(/\d+/g)) addRef(n.id, `${pol.code}(${d})`, 'paragraph');
  for (const m of t.matchAll(PARA_OF)) for (const d of m[1].match(/\d+/g)) addRef(n.id, `${m[2]}(${d})`, 'paragraph');
  for (const m of t.matchAll(ANNEX)) if (byAnchor.has(`Annex${m[1]}`)) addRef(n.id, `Annex${m[1]}`, 'annex');
  for (const m of t.matchAll(CHAPTER)) if (byAnchor.has(`ch${m[1]}`)) addRef(n.id, `ch${m[1]}`, 'chapter');
}
// Resolve 'Annex' codes through anchors (addRef tries byCode then toAnchor; Annex anchors are plain).
if (unresolved.size) console.warn('unresolved references (dropped):', [...unresolved.entries()].map(([c, k]) => `${c}×${k}`).join(', '));

// Glossary usage: which nodes use a defined term (whole-word, case-insensitive). Shown as "uses the term".
const terms = nodes.filter((n) => n.kind === 'term');
const termUses = {}; // termAnchor -> [nodeId]
for (const t of terms) {
  const word = t.title.replace(/\s*\(.*\)\s*$/, '').trim();
  if (word.length < 4) continue;
  const re = new RegExp(`(^|[^A-Za-z-])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?(?=$|[^A-Za-z-])`, 'i');
  const users = nodes.filter((n) => n.kind !== 'term' && n.kind !== 'chapter' && n.kind !== 'annex' && re.test(n.text)).map((n) => n.id);
  if (users.length) termUses[t.id] = users;
}

// Flags.
for (const n of nodes) {
  const t = n.text.toLowerCase();
  n.flags = [];
  if (/should be refused|should not be approved|should not be permitted|should not be granted/.test(t)) n.flags.push('refuse');
  if (/substantially outweigh/.test(t)) n.flags.push('balance');
  if (/very special circumstances/.test(t)) n.flags.push('vsc');
}

// ---------------------------------------------------------------------------------------------------------
// 5. Contents groupings (from the Contents section) for the overview grid.
// ---------------------------------------------------------------------------------------------------------
const groups = [];
{
  const start = lines.indexOf('## Contents');
  let g = null;
  for (let i = start; i < firstBody; i++) {
    const l = lines[i];
    const h = l.match(/^\*\*(.+)\*\*$/);
    if (h) { g = { title: h[1], parts: [] }; groups.push(g); continue; }
    const m = l.match(/^- \[(.+?)\]\(#(ch\d+|Annex[A-F])\)/);
    if (m) {
      if (!g) { g = { title: '', parts: [] }; groups.push(g); }
      g.parts.push(m[2]);
    }
  }
}
// Put annexes in their own group.
const annexGroup = { title: 'Annexes', parts: [] };
for (const g of groups) { annexGroup.parts.push(...g.parts.filter((p) => p.startsWith('Annex'))); g.parts = g.parts.filter((p) => !p.startsWith('Annex')); }
groups.push(annexGroup);
const grouped = groups.filter((g) => g.parts.length);

// ---------------------------------------------------------------------------------------------------------
// 6. Emit.
// ---------------------------------------------------------------------------------------------------------
const data = {
  framework: 'National Planning Policy Framework (August 2026)',
  built: BUILT,
  links: { govuk: GOVUK, md: GITHUB_MD, pdf: PDF, navigator: NAVIGATOR },
  // Printed page p is PDF page p + 2 (cover and copyright pages are unnumbered).
  pdfOffset: 2,
  groups: grouped,
  body,
  nodes: nodes.map((n) => ({ id: n.id, kind: n.kind, code: n.code, title: n.title, heading: n.heading ?? null, page: n.page, line: n.line, parent: n.parent, children: n.children, text: n.text, fn: n.fn, flags: n.flags, marker: n.marker ?? null })),
  refs,
  termUses,
  footnotes,
};
const stats = {
  nodes: nodes.length,
  policies: nodes.filter((n) => n.kind === 'policy').length,
  paragraphs: nodes.filter((n) => n.kind === 'para').length,
  limbs: nodes.filter((n) => n.kind === 'letter' || n.kind === 'roman').length,
  terms: terms.length,
  refs: refs.length,
  refNodes: new Set(refs.map((r) => r.from)).size,
  refTargets: new Set(refs.map((r) => r.to)).size,
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Keep the embedded JSON valid and inert inside <script>: "</" and "<!--" are escaped with JSON escapes.
const json = JSON.stringify(data).replace(/<\//g, '<\\/').replace(/<!--/g, '<\\u0021--');
const css = fs.readFileSync(path.join(HERE, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(HERE, 'client.js'), 'utf8');
if (/<\/script/i.test(js)) throw new Error('client.js contains "</script"');
const description = `A map of the whole National Planning Policy Framework (August 2026): the decision route, every chapter and annex as a graph of its policies and their cross-references, every policy as a tree of its paragraphs and limbs, the verbatim text beside whatever you select, and a quick-nav box that finds a code such as S5(1)(j) and every place the Framework refers to it. ${stats.policies} policies, ${stats.paragraphs} paragraphs, ${stats.limbs} limbs, ${stats.terms} glossary terms, ${stats.refs} cross-references.`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>NPPF 2026 Map</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${URL}">
<link rel="license" href="https://creativecommons.org/licenses/by/4.0/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap">
<style>
${css}
</style>
</head>
<body>
<a class="skip" href="#text-col">Skip to the Framework text</a>
<div id="app">
<header class="top">
  <div class="brand">
    <p class="kicker"><a href="/">Planning Distilled</a> · England</p>
    <h1>NPPF 2026 Map</h1>
    <p class="lede">The whole National Planning Policy Framework (August 2026) as a map: the decision route, each chapter as a graph of its policies and the policies they point to, each policy as a tree of paragraphs and limbs, and the Framework's words beside whatever you select. Type a code such as <span class="code">S5(1)(j)</span> or <span class="code">S5 1 j</span>, or a word such as <span class="code">wheeling</span>, to jump to it and see every place the Framework refers to it.</p>
  </div>
</header>
<form class="quicknav" role="search" autocomplete="off" aria-label="Quick navigation">
  <label for="q" class="sr">Find a policy, paragraph, limb, glossary term or word</label>
  <input id="q" type="search" placeholder="S5(1)(j) · GB7 1 g iii · Annex B settlement · wheeling" spellcheck="false" aria-controls="q-results" aria-expanded="false" aria-autocomplete="list" role="combobox">
  <button type="submit" class="primary">Go</button>
  <div id="q-results" class="results" role="listbox" hidden></div>
</form>
<p class="banner" role="note"><strong>Not legal advice.</strong> An aid to reading the Framework. The text in the right-hand column is the Framework's own, checked word for word against the published text when this page was built; the graphs are drawn from the Framework's own cross-references.</p>
<nav class="crumbs" aria-label="Where you are"><ol id="crumbs"></ol></nav>
<main class="grid">
  <section class="graph-col" aria-label="Map"><div id="graph"></div></section>
  <aside class="text-col" id="text-col" aria-label="Framework text"><div id="text"></div></aside>
</main>
<footer class="foot">
<p>Sources</p>
<ul>
<li>National Planning Policy Framework, August 2026: <a href="${GOVUK}">GOV.UK</a>; <a href="${PDF}">the published PDF</a>; our <a href="${GITHUB_MD}">canonical Markdown edition</a> with the anchors this page links to, and its structure sidecar, in the research repository (<code>data/open-sources/nppf/</code>). Crown copyright, Open Government Licence v3.0.</li>
<li>The decision-route diagram follows the one in the <a href="${NAVIGATOR}">NPPF 2026 Navigator</a>; the chapter and policy graphs are generated from the Framework's own cross-references (${stats.refs} references from ${stats.refNodes} paragraphs, limbs and headings to ${stats.refTargets} targets).</li>
</ul>
<p>Prepared by Planning Distilled. Every heading, paragraph, limb and glossary entry on this page was checked against the published text when the page was built. Built ${BUILT}. Not legal advice.</p>
<p class="licence">&copy; Planning Distilled. Text, data and images on this page are released under the <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 licence</a>: share and adapt them freely, with credit to Planning Distilled. Quotations from the Framework remain Crown copyright under the Open Government Licence. Source and data: github.com/planningdistilled/research</p>
</footer>
</div>
<script id="data" type="application/json">${json}</script>
<script>
${js}
</script>
</body></html>
`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`wrote ${path.relative(process.cwd(), OUT)} (${(html.length / 1024).toFixed(0)} KB)`);
console.log(stats);
if (process.argv.includes('--refs')) {
  for (const r of refs) console.log(`${r.from} -> ${r.to} (${r.how})`);
}
