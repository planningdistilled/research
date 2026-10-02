// Generates the Navigator "Method & cross-references" static sub-page from live data.
// Reads the decisions-DB watermark, the built manifest and graph, and computes the
// case breakdowns straight from index/cases.json, so every number on the page is
// machine-sourced. Run after `npm run build`:
//   node build/method-page.mjs [out dir]
// Writes to the planningdistilled/main-site Pages repo by default (same target root as export:pages).
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { loadGuidance, methodSupportSection, guidanceSummarySection, writeSourcesPage, addAnchors } from './guidance-xref.mjs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DECISIONS as DB, GUIDANCE, SITE } from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const NAV = join(HERE, '..');
const OUT = process.argv[2] || join(SITE, 'research', 'england', 'nppf-navigator', 'method-and-cross-references');

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const state = readJson(join(DB, 'harvest-log', 'state.json'));
const manifest = readJson(join(NAV, 'dist', 'data', 'manifest.json'));
const cases = readJson(join(DB, 'index', 'cases.json'));
const graphFile = readdirSync(join(NAV, 'dist', 'data')).find((f) => f.startsWith('graph-'));
const graph = readJson(join(NAV, 'dist', 'data', graphFile));

// ---- computed counts, all from source ----
const tally = (key) => cases.reduce((m, c) => ((m[c[key] ?? '(none)'] = (m[c[key] ?? '(none)'] || 0) + 1), m), {});
const byFw = tally('nppf_applied');
const byDm = manifest.dataset.byDecisionMaker;
const nodeCount = graph.nodes.length;
const quoteCount = Object.keys(graph.quotes).length;
const gbDate = (s) => (s ? new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—');
const asOf = gbDate(new Date().toISOString());
const d = manifest.dataset;

// ---- inconsistencies data, computed from the per-case review tables
//      analysis/appeals-review/issue-1..6.tsv (every quote machine-checked against the letters;
//      see analysis/appeals-consistency-review.md). ----
const REVIEW = join(DB, 'analysis', 'appeals-review');
const readTsv = (i) => readFileSync(join(REVIEW, `issue-${i}.tsv`), 'utf8').split('\n').slice(1).filter(Boolean)
  .map((l) => { const c = l.split('\t'); return { id: c[0], date: c[1], place: c[2], outcome: c[3], verdict: c[4], reason: c[5] ?? '', quote: c[7] ?? '' }; });
const review = [1, 2, 3, 4, 5, 6].map(readTsv);
const reviewQuotes = review.flat().filter((r) => r.quote.trim()).length;
const isAllowed = (r) => /^(allowed|part|approved|granted|split)/i.test(r.outcome);
const isBorderline = (r) => /borderline|\(b\)/i.test(r.reason);
const pct = (a, b) => `${a} (${Math.round((100 * a) / b)}%)`;
const ref7 = (id) => (id.match(/\d{7}$/) || [id])[0];
const placeName = (r) => r.place.split(',')[0].trim();
const issueRow = (label, i) => {
  const rows = review[i - 1];
  const cor = rows.filter((r) => r.verdict === 'correct');
  const dif = rows.filter((r) => r.verdict === 'differs');
  const arises = cor.length + dif.length;
  return [label, arises, pct(cor.length, arises), `${dif.length} (${dif.filter(isBorderline).length})`, dif.filter(isAllowed).length];
};
const i1 = review[0];
const i1dif = i1.filter((r) => r.verdict === 'differs');
const i1kind = (k) => i1dif.filter((r) => r.reason.split(':')[0].trim().toLowerCase() === k);
const dp3 = {
  arises: i1.filter((r) => r.verdict === 'correct' || r.verdict === 'differs').length,
  correct: i1.filter((r) => r.verdict === 'correct').length,
  weight: i1kind('weight'), plan: i1kind('plan-led'), w2024: i1kind('2024'), substance: i1kind('allowed'),
};
dp3.sameRoute = dp3.weight.length + dp3.plan.length;
const allDismissed = (rs) => rs.every((r) => !isAllowed(r));
const substanceList = dp3.substance.slice().sort((a, b) => a.date.localeCompare(b.date))
  .map((r) => `${placeName(r)} ${ref7(r.id)}${isBorderline(r) ? ' <span class="q">(borderline)</span>' : ''}`).join(', ');
const i6 = review[5];
const i6n = (v) => i6.filter((r) => r.verdict === v).length;
const i6arises = i6n('correct') + i6n('differs-slip (immaterial)') + i6n('differs-2024');
const issues = [
  issueRow('1. DP3(3) design as a "should be refused" policy', 1),
  issueRow('2. Heritage harm method (HE6, HE4, HE7)', 2),
  issueRow('3. Weight given to plan policies (Annex A(2))', 3),
  issueRow('4. Location shortcuts in the Green Belt', 4),
  issueRow('5. Walking routes, stations, access (TR3)', 5),
  ['6. Which Framework is applied (Annex A(1))', i6arises,
    `${pct(i6n('correct'), i6arises)} <span class="q">+${i6n('differs-slip (immaterial)')} immaterial 2024 wording</span>`,
    `${i6n('differs-2024')} applied 2024`, i6.filter((r) => r.verdict === 'differs-2024' && isAllowed(r)).length],
];
if (!allDismissed(dp3.weight) || !allDismissed(dp3.plan) || !dp3.substance.every(isAllowed)) throw new Error('issue-1 breakdown assumptions no longer hold; revise the table wording');
// Issue 1 is broken out: issue-1.tsv marks every letter that does not name DP3(3) as "differs",
// but one that finds the design harm and dismisses has done what the policy directs. The headline
// row counts those as consistent; the sub-rows show each part.
dp3.consistent = dp3.correct + dp3.sameRoute;
dp3.realDif = [...dp3.w2024, ...dp3.substance];
if (dp3.consistent + dp3.realDif.length !== dp3.arises) throw new Error('issue-1 has a "differs" reason outside weight / plan-led / 2024 / allowed; revise the breakdown');
const difCell = (rs) => `${rs.length} (${rs.filter(isBorderline).length})`;
issues[0] = [issues[0][0], dp3.arises, pct(dp3.consistent, dp3.arises), difCell(dp3.realDif), dp3.realDif.filter(isAllowed).length];
const issue1Sub = [
  ['named DP3(3) and asked the clear-justification question', dp3.correct, '', ''],
  ['found the design harm and dismissed without naming DP3(3)', dp3.sameRoute, '', ''],
  ['used 2024 design wording', '', difCell(dp3.w2024), dp3.w2024.filter(isAllowed).length],
  ['found a design conflict, never asked for clear justification', '', difCell(dp3.substance), dp3.substance.filter(isAllowed).length],
];
const issueTr = (r) => `<tr><td>${r[0]}</td><td class="n">${r[1]}</td><td class="n">${r[2]}</td><td class="n">${r[3]}</td><td class="n">${r[4]}</td></tr>`;
const subTr = (r) => `<tr class="sub"><td>${r[0]}</td><td class="n"></td><td class="n">${r[1]}</td><td class="n">${r[2]}</td><td class="n">${r[3]}</td></tr>`;
const issueRows = [issueTr(issues[0]), ...issue1Sub.map(subTr), ...issues.slice(1).map(issueTr)];
const sdc = [
  ['1. DP3(3) as a "should be refused" policy', 'Reasoning gap', 'Inconsistent', 'Alcester refused on a flood trigger; Snitterfield (granted) found "significant harm to the character of the area" but cited DP3(3) only for weight, never asking whether there was clear justification. Inspectors (Kings Langley, Hook-a-Gate, Ware) treat a DP3 design conflict as engaging DP3(3) and refuse.'],
  ['2. Heritage harm at Forest Farm', 'Hard to reconcile', 'Differs in method', 'Forest Farm found HE6 and 1990 Act conflict then granted in the S4 balance; Ilmington weighed the harm and refused. Inspectors (Hunmanby, Bagnall, Smarden) weigh heritage harm on its own terms.'],
  ['3. Reason given for discounting CS.8', 'Reasoning gap', 'Differs in method', 'Three reports declared CS.8 "materially inconsistent" without saying which part conflicts, then relied on CS.8 anyway. Annex A(2) reduces weight only for the conflicting part.'],
  ['4. Location shortcuts in the Green Belt', 'Reasoning gap', 'Differs in method', 'Tanworth ran the S5(1)(j) "well-related to a settlement" test on a washed-over village; Earlswood passed GB7(1)(g)(iii) on a boundary line. S5 does not decide Green Belt cases (S5(5)); Annex B excludes washed-over villages from "settlement".'],
  ['5. Walking routes and stations', 'Reasoning gap', 'Differs in method', 'None of the reports uses the Connectivity Tool or tests the actual route; both lean on Local Service Village status as proof of sustainability. Inspectors decide on the route: a 350 m station did not save Hatton, a named service village did not save Findon.'],
  ['6. Reports written under the 2024 Framework', 'Reasoning gap', 'Differs in method', 'Coverwell Farm applied the 2024 Framework on 17 August; Kineton and Oxhill kept the 2024 balance. Annex A(1): the 2026 policies apply from the day of publication.'],
];

const NOTE_URL = 'https://planningdistilled.org/research/authority/stratford-dc/nppf-2026-decisions/';
const NAV_URL = 'https://planningdistilled.org/research/england/nppf-navigator/';
const PAGE_URL = 'https://planningdistilled.org/research/england/nppf-navigator/method-and-cross-references/';
const SOURCES_URL = PAGE_URL + 'sources/';
const guidance = loadGuidance(GUIDANCE);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const row = (cells) => `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`;

const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Navigator Method & Cross-references</title>
<meta name="description" content="How the NPPF 2026 Navigator was built, the dataset counts, external sources our notes have been checked against, and a summary of the inconsistencies the research has found.">
<link rel="canonical" href="${PAGE_URL}">
<link rel="license" href="https://creativecommons.org/licenses/by/4.0/">
<meta property="og:title" content="NPPF Navigator — Method & cross-references">
<meta property="og:description" content="How the tool was built, the case counts, external cross-checks, and the inconsistencies found across ${cases.length} decisions.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{--ground:#eef2f1;--surface:#fff;--surface-2:#f6f8f8;--ink:#17212b;--muted:#5a6672;--line:#d5dddd;--accent:#2b5c88;--accent-soft:#e3ecf4;--ok:#2d7549;--no:#a3382a;--serif:"Source Serif 4",Georgia,serif;--sans:"Public Sans",-apple-system,"Segoe UI",system-ui,sans-serif;--mono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){color-scheme:dark;--ground:#10161b;--surface:#18212a;--surface-2:#1d2731;--ink:#e3e9ee;--muted:#9aa6b2;--line:#2c3945;--accent:#86b0db;--accent-soft:#1f3244;--ok:#6cc08f;--no:#e0786a}}
:root[data-theme="dark"]{color-scheme:dark;--ground:#10161b;--surface:#18212a;--surface-2:#1d2731;--ink:#e3e9ee;--muted:#9aa6b2;--line:#2c3945;--accent:#86b0db;--accent-soft:#1f3244;--ok:#6cc08f;--no:#e0786a}
*{box-sizing:border-box}
body{background:var(--ground);color:var(--ink);font:17px/1.6 var(--sans);margin:0;padding:0 16px 56px}
.wrap{max-width:820px;margin:0 auto}
header{padding:40px 0 8px;border-bottom:1px solid var(--line);margin-bottom:8px}
.eyebrow{font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)}
.back{font-size:14px;color:var(--accent);text-decoration:none;font-weight:600}
.back:hover{text-decoration:underline}
h1{font:600 clamp(26px,5vw,38px)/1.15 var(--serif);margin:10px 0 10px;text-wrap:balance}
.dek{color:var(--muted);max-width:64ch;margin:0}
h2{font:600 22px/1.25 var(--serif);margin:36px 0 10px;color:var(--accent)}
h3{font:600 16px/1.3 var(--sans);margin:22px 0 6px}
h4{font:600 15px/1.3 var(--sans);margin:18px 0 6px;color:var(--accent)}
p{margin:0 0 12px}
a{color:var(--accent)}
ul{margin:0 0 12px;padding-left:20px}li{margin:4px 0}
.banner{background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:8px;padding:12px 16px;margin:18px 0;font-size:15px}
.banner strong{color:var(--ink)}
.tw{overflow-x:auto;margin:14px 0}
table{border-collapse:collapse;width:100%;font-size:14.5px;min-width:520px}
caption{caption-side:top;text-align:left;color:var(--muted);font-size:13px;margin-bottom:6px}
th,td{border:1px solid var(--line);padding:8px 10px;text-align:left;vertical-align:top}
th{background:var(--surface-2);font-weight:600}
tbody tr:nth-child(even){background:var(--surface-2)}
tbody tr.sub{background:none;color:var(--muted);font-size:13.5px}
tr.sub td:first-child{padding-left:26px}
td.n{font-variant-numeric:tabular-nums;font-family:var(--mono);font-size:13.5px;white-space:nowrap}
.q{color:var(--muted);font-size:12.5px}
.tag{display:inline-block;font-size:12px;font-weight:600;border-radius:4px;padding:1px 7px;background:var(--accent-soft);color:var(--accent);white-space:nowrap}
.ok{color:var(--ok);font-weight:700}.no{color:var(--no);font-weight:700}
.stat{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:16px 0}
.stat div{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:12px 14px}
.stat b{display:block;font:600 24px/1.1 var(--serif);font-variant-numeric:tabular-nums}
.stat span{font-size:13px;color:var(--muted)}
footer{margin-top:40px;padding-top:16px;border-top:1px solid var(--line);color:var(--muted);font-size:13.5px}
code{font-family:var(--mono);font-size:13px}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

</style>
</head>
<body>
<div class="wrap">
<header>
  <div class="eyebrow"><a href="/" style="color:inherit;text-decoration:none">Planning Distilled</a> &rsaquo; <a href="/research/" style="color:inherit;text-decoration:none">Research</a> &rsaquo; <a href="/research/england/" style="color:inherit;text-decoration:none">England</a> &rsaquo; <a href="${NAV_URL}" style="color:inherit;text-decoration:none">NPPF 2026 Navigator</a> &rsaquo; Method</div>
  <h1>Method &amp; cross-references</h1>
  <p class="dek">How the Navigator was built, the decisions behind it, the external sources its notes have been checked against, and a summary of the inconsistencies the research has found. Counts as of ${asOf}.</p>
  <p style="margin-top:12px"><a class="back" href="${NAV_URL}">&larr; Back to the NPPF 2026 Navigator</a></p>
</header>
<main>
<p class="banner"><strong>Not legal advice.</strong> A research aid to reading the August 2026 Framework and recent decisions. Prepared by Planning Distilled. It does not replace the development plan, the full Framework, the decision letters or professional advice.</p>

<h2>1. How the Navigator was built</h2>
<p>The Navigator is a <strong>typed decision graph</strong>, authored in TypeScript and compiled to a single <code>graph.json</code>. Each node carries the verbatim policy text, the facts or planning judgements the step needs, and a query into the decisions database. A small <strong>pure evaluation engine</strong> derives the visible route, the next question, the triggers and harms, and an indicative outcome from the answers entered — it makes no judgement silently; where the Framework leaves a question to the decision-maker, the tool asks it and shows how others have answered.</p>
<ul>
  <li><strong>Every policy quotation is verified against the published NPPF (August 2026) text at build time.</strong> The build fails if any quote cannot be found. This build: <strong>${nodeCount} nodes</strong> and <strong>${quoteCount} quotations verified</strong>.</li>
  <li><strong>Neutral, inspector-style register.</strong> Contested readings are shown both ways. Nothing application-specific is in the graph — it is the Framework, not a case for any one site.</li>
  <li><strong>Case matching</strong> is by canonicalised policy code against the database below, grouped by finding, with a selection-bias note. Counts show how a test has been applied, never the odds of an outcome.</li>
</ul>

<div class="stat">
  <div><b>${cases.length}</b><span>decisions in the database</span></div>
  <div><b>${byFw['2026-08'] ?? 0}</b><span>apply the 2026 Framework</span></div>
  <div><b>${state.sources['pins-new'].corpusLetters}</b><span>decision letters in the corpus</span></div>
  <div><b>${nodeCount} / ${quoteCount}</b><span>graph nodes / verified quotes</span></div>
</div>

<div class="tw">
<table>
<caption>The decisions database (source: <code>index/cases.json</code>, <code>harvest-log/state.json</code>, built <code>manifest.json</code>).</caption>
<thead><tr><th>Measure</th><th>Count</th><th>Source</th></tr></thead>
<tbody>
${row(['Decisions read and summarised', `<span class="n">${cases.length}</span>`, 'cases.json'])}
${row(['&nbsp;&nbsp;by inspectors', `<span class="n">${byDm['inspector'] ?? 0}</span>`, 'cases.json'])}
${row(['&nbsp;&nbsp;by the Secretary of State', `<span class="n">${byDm['secretary-of-state'] ?? 0}</span>`, 'cases.json'])}
${row(['&nbsp;&nbsp;by councils (committee + delegated)', `<span class="n">${(byDm['lpa-committee'] ?? 0) + (byDm['lpa-delegated'] ?? 0)}</span>`, 'cases.json'])}
${row(['Applying the 2026 Framework', `<span class="n">${byFw['2026-08'] ?? 0}</span>`, 'nppf_applied = 2026-08'])}
${row(['Transitional (2024 Framework)', `<span class="n">${byFw['2024-12 (transitional)'] ?? 0}</span>`, 'nppf_applied = 2024-12'])}
${row(['No Framework version cited', `<span class="n">${byFw['not-cited'] ?? 0}</span>`, 'nppf_applied = not-cited'])}
${row(['Decision letters in the corpus', `<span class="n">${state.sources['pins-new'].corpusLetters}</span>`, 'state.json'])}
${row(['Awaiting distillation into the database', `<span class="n">${state.sources['pins-new'].queued}</span>`, 'state.json'])}
${row(['Newest decision', `<span class="n">${gbDate(d.newestDecisionDate)}</span>`, 'state.json'])}
${row(['Last harvest of new decisions', `<span class="n">${gbDate(d.lastHarvest)}</span>`, 'manifest.json'])}
</tbody>
</table>
</div>

<h2 id="guidance">2. External cross-references</h2>
<p>Independent sources our notes have been checked against, and the outcome.</p>
${methodSupportSection(guidance.length, SOURCES_URL)}

${guidanceSummarySection(guidance, SOURCES_URL)}

<h2>3. Inconsistencies found</h2>
<p>Two strands of work. The first tests <strong>every appeal decision in the database</strong> against the Framework. The second compares <strong>Stratford-on-Avon District Council's own decisions</strong> — both against each other and against appeal decisions.</p>

<h3>Across all appeal decisions</h3>
<p>Every appeal in the database &mdash; <strong>${(byDm['inspector'] ?? 0)} Planning Inspectorate and ${byDm['secretary-of-state'] ?? 0} Secretary of State decisions</strong> &mdash; was tested against six issues drawn from the Stratford note. All ${reviewQuotes} quotations in the per-case tables were machine-checked against the letters, and all matched. "Differs" mostly means a different <em>route</em> to the same result; it changes the outcome only where the appeal was allowed. Issue 1 is broken out: a letter that finds the design harm and dismisses has done what DP3(3) directs (<em>"should be refused"</em>) whether or not it names the policy, so it counts as consistent and is shown on its own line. Full detail: <a href="${NOTE_URL}" target="_blank" rel="noopener">the Council-decisions review page</a>.</p>
<div class="tw">
<table>
<caption>Source: <code>analysis/appeals-consistency-review.md</code> and <code>appeals-review/issue-1..6.tsv</code>.</caption>
<thead><tr><th>Issue</th><th class="n">Arises</th><th class="n">Consistent with the test</th><th class="n">Differs (borderline)</th><th class="n">Differs &amp; allowed</th></tr></thead>
<tbody>
${issueRows.join('\n')}
</tbody>
</table>
</div>
<p class="q">Borderline cases are marked where the required step is missing but the result would plainly be the same (e.g. Lydiard Millicent 6001260 on TR3, issue 5).</p>

<h4>Issue 1 — DP3(3), broken down</h4>
<p>DP3(3) makes a proposal <em>"should be refused"</em> if, without clear justification, it conflicts with any one of three things:</p>
<ul>
<li><strong>DP3(1) context</strong> — the history, character and features of the site and its setting, and integration with its surroundings.</li>
<li><strong>The relevant DP3(2) principles</strong> — (a) liveability, (b) climate, (c) nature and green infrastructure (tree cover), (d) movement, (e) built form, (f) public space, (g) identity and local character.</li>
<li><strong>An explicit design standard in the development plan</strong> — a Village Design Statement, design guide, code or masterplan; DP3(3) gives <em>substantial weight</em> to compliance (the clearest dataset example is 6010826).</li>
</ul>
<p>Of the <strong>${dp3.arises}</strong> appeals where design harm arose, <strong>${pct(dp3.consistent, dp3.arises)}</strong> are consistent with DP3(3): ${dp3.correct} name it and ask the clear-justification question, and ${dp3.sameRoute} find the design harm and dismiss by another route. The full split is below. Only the last two rows change an outcome; the middle two reach the result DP3(3) directs and are not errors.</p>
<div class="tw">
<table>
<caption>Source: <code>analysis/appeals-consistency-review.md</code>, issue 1.</caption>
<thead><tr><th>How DP3(3) was handled</th><th class="n">Appeals</th><th>Outcome</th></tr></thead>
<tbody>
<tr><td>Named DP3(3) and asked the clear-justification question</td><td class="n">${dp3.correct}</td><td>the test applied as written</td></tr>
<tr><td>Same result, DP3(3) not named &mdash; weighed the design harm as ordinary harm</td><td class="n">${dp3.weight.length}</td><td>all dismissed</td></tr>
<tr><td>Same result, DP3(3) not named &mdash; dismissed on the local plan (s38(6))</td><td class="n">${dp3.plan.length}</td><td>all dismissed</td></tr>
<tr><td>Differed &mdash; used 2024 design wording</td><td class="n">${dp3.w2024.length}</td><td>${dp3.w2024.filter(isAllowed).length} allowed</td></tr>
<tr><td>Differed in substance &mdash; conflict found, clear justification never asked</td><td class="n">${dp3.substance.length}</td><td>all allowed: ${substanceList}</td></tr>
<tr><td><strong>Total</strong></td><td class="n"><strong>${dp3.arises}</strong></td><td><strong>${i1dif.filter(isAllowed).length} allowed where it differed</strong></td></tr>
</tbody>
</table>
</div>
<p>What <strong>"clear justification"</strong> means is unsettled; inspectors read it two ways, and no Secretary of State or court decision has settled which is right:</p>
<ul>
<li><strong>Necessity</strong> — the conflict is justified only if it is unavoidable to deliver the development (Polegate 6008314 &para;43; at a hearing, Bilsborrow 6007133 &para;59 refused on this reading).</li>
<li><strong>Level balance</strong> — the conflict is justified if the benefits outweigh the harm (Didcot 6009340 &para;22; at a hearing, Aston Clinton 6008253 &para;86 allowed on this reading).</li>
</ul>
<p class="q">Either reading is stricter than the S4/S5 "substantially outweighed" test, which favours approval. The Navigator now takes this in two steps &mdash; a checklist of what the scheme conflicts with, then the clear-justification call &mdash; mirroring this breakdown.</p>

<h3>Stratford-on-Avon District Council's own decisions</h3>
<p>The Stratford note works through <strong>six issues</strong>, each looked at two ways: whether the Council is consistent <em>with itself</em>, and whether it matches how inspectors decide the same question. The sharpest contrast is on walking routes: <strong>Alcester <span class="ok">&#10003;</span></strong> treated a policy failure as a "should be refused" trigger and refused, while <strong>Snitterfield <span class="no">&#10007;</span></strong> found character harm but granted without asking whether there was clear justification.</p>
<div class="tw">
<table>
<caption>Source: <code>pages/authority/stratford-dc/nppf-decisions/build/note.md</code>.</caption>
<thead><tr><th>Issue</th><th>Within the Council</th><th>vs appeal decisions</th><th>What is at stake</th></tr></thead>
<tbody>
${sdc.map((r) => `<tr><td>${r[0]}</td><td><span class="tag">${r[1]}</span></td><td><span class="tag">${r[2]}</span></td><td>${r[3]}</td></tr>`).join('\n')}
</tbody>
</table>
</div>
<p><strong>What the labels mean.</strong> <em>Inconsistent</em>: comparable facts, opposite answers to the same Framework question. <em>Hard to reconcile</em>: the conclusion does not follow from the decision's own findings. <em>Reasoning gap</em>: a required step is missing or the stated reason is wrong (the result may still be defensible). <em>Differs in method</em>: the Council applies a different test from the one inspectors apply &mdash; refusals reasoned this way risk being overturned at appeal; grants are open to challenge.</p>

</main>
<footer>Prepared by Planning Distilled. Quotations are to published planning decisions, with paragraph references to the officer report or decision letter. Generated from the live dataset on ${asOf}. Not legal advice.
<p class="licence">&copy; Planning Distilled. Text, data and images on this page are released under the <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 licence</a>: share and adapt them freely, with credit to Planning Distilled. Quotations from decision letters, plans and the Framework remain the copyright of their publishers. Source and data: <a href="https://github.com/planningdistilled/research">github.com/planningdistilled/research</a>.</p>
</footer>
</div>
</body>
</html>
`;

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'index.html'), addAnchors(html));
const srcLen = writeSourcesPage(guidance, { outDir: join(OUT, 'sources'), css: html.match(/<style>[\s\S]*?<\/style>/)[0], navUrl: NAV_URL, methodUrl: PAGE_URL, pageUrl: SOURCES_URL, asOf });
console.log(`method-and-cross-references/sources/index.html written (${(srcLen / 1024).toFixed(1)} KB, ${guidance.length} sources)`);
console.log(`method-and-cross-references/index.html written (${(html.length / 1024).toFixed(1)} KB)`);
console.log(`  cases ${cases.length}; 2026 ${byFw['2026-08']}; transitional ${byFw['2024-12 (transitional)']}; not-cited ${byFw['not-cited']}`);
console.log(`  corpus ${state.sources['pins-new'].corpusLetters}; queued ${state.sources['pins-new'].queued}; nodes ${nodeCount}; quotes ${quoteCount}`);
