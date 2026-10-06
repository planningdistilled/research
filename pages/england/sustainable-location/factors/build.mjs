// "What decides a sustainable location": the factors used in every decision in the database where the
// sustainability of the location was assessed, grouped into classes and counted. A sub-page of the
// sustainable location page. Every figure is computed from data/decisions/analysis/location-factors
// (register.tsv, codes.tsv; codebook.md is the method), and the build stops if a sentence no longer holds.
//   python3 tools/location_factors.py     (first: checks the register against the decision texts)
//   node pages/england/sustainable-location/factors/build.mjs   (writes into main-site)
import fs from 'node:fs';
import path from 'node:path';
import { SITE } from '../../../../paths.mjs';
import { esc, page } from '../../../_shared/policy-weight.mjs';
import { ASSESSED, CLASSES, FACTORS, FACTORS_PAGE, TOTALS as T, holds, stat } from './register.mjs';

const SITE_PATH = FACTORS_PAGE.slice(1);
const PARENT = '/research/england/sustainable-location/';
const ORIGIN = 'https://planningdistilled.org';
const REPO = 'https://github.com/planningdistilled/research/blob/main/data/decisions/analysis/location-factors/';

const num = (x) => x.toLocaleString('en-GB');
const pct = (a, b) => Math.round((100 * a) / b) + '%';
const day = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const isAppeal = (r) => !r.c.decision_maker.startsWith('lpa-');
// "Hatton Station, appeal 6006637" / "Snitterfield, 26/00617/PIP". Case titles end with the place, sometimes
// followed by a bracketed or dashed description, which is dropped.
const place = (c) => c.title.replace(/\s*\([^()]*\)/g, '').replace(/\s*\([^()]*\)/g, '').split(/\s+[–—-]\s+/)[0].split(',').slice(-1)[0].trim();
const link = (r) => `<a href="/research/england/nppf-navigator/decisions/${encodeURIComponent(r.id)}.html">${esc(place(r.c))}, ${isAppeal(r) ? 'appeal ' + esc(r.c.appeal_ref || r.id) : esc(r.c.lpa_ref || r.id)}</a>`;
const FINDING = { pass: 'Sustainable', fail: 'Not sustainable', mixed: 'Mixed', unclear: 'No finding' };
const SIGN = { '+': '+', '-': '−', '=': '=' };

const S = Object.fromEntries([...CLASSES, ...FACTORS].map((x) => [x.code, stat(x.code)]));
const label = Object.fromEntries([...CLASSES, ...FACTORS].map((x) => [x.code, x.label]));
const classesByFindings = [...CLASSES].sort((a, b) => S[b.code].findings - S[a.code].findings);
const classesByReach = [...CLASSES].sort((a, b) => S[b.code].n - S[a.code].n);
const factorsByReach = [...FACTORS].sort((a, b) => S[b.code].n - S[a.code].n);
if (FACTORS.some((f) => !S[f.code].n)) throw new Error('a factor in codes.tsv is used by no decision: remove it or revise the page');

// ---- Sentences the page makes, each tied to the register ----
const A = S.A, B = S.B, D = S.D, F = S.F, H = S.H, I = S.I, J = S.J, K = S.K;
holds(classesByFindings[0].code === 'A' && A.findings > 2 * S[classesByFindings[1].code].findings, 'the walking route has more than twice the findings of any other class');
holds(CLASSES.every((c) => c.code === 'A' || S[c.code].decisive.length < A.decisive.length), 'the walking route is decisive more often than any other class');
holds(factorsByReach[0].code === 'A1' && factorsByReach[1].code === 'B1' && factorsByReach[2].code === 'A3', 'footway, distance and lighting are the three most-used factors');
holds(Math.abs(S.B1.plus - S.B1.minus) <= 5, 'distance cuts evenly');
holds(S.B1.decisive.length < S.A1.decisive.length / 2, 'distance is decisive less than half as often as footway presence');
holds(classesByReach[0].code === 'D' && D.plus > D.minus, 'buses are raised in more decisions than any other class and count for more often than against');
holds(S.D3.fail >= 0.8 * S.D3.n && S.D3.plus === 0, 'missing bus evidence almost always goes with a finding that the location is not sustainable');
holds(F.decisive.length < 0.1 * F.n && I.decisive.length < 0.15 * I.n, 'cycling and the settlement hierarchy are raised often and rarely decisive');
holds(H.mixed > T.mixed / 2 && H.plus > 3 * H.minus, 'scale and nature appears in most mixed findings and mostly counts for the location');
holds(S.G3.plus === 0 && S.G4.plus === 0, 'electric vehicles and home working never counted in favour');
holds(S.J4.aside > S.J4.n / 2, 'comparator decisions were set aside more often than not');
holds(S.J1.decisive.length > S.J1.n / 2, 'the Connectivity Tool was among the decisive factors in most decisions that cite it');
holds(K.plus > 0.6 * K.findings, 'mitigation mostly counted for the location');
holds(S.A10.plus === 0 && S.A12.plus === 0, 'usability for all users and narrow lanes never counted in favour');

// ---- Sections ----
const short = `<section id="in-short"><div class="rule"><h2>In short</h2><ul>
<li>We went through every decision in the database where the sustainability of the location was assessed and recorded the factors the decision-maker used: <b>${num(T.assessed)} decisions</b>, ${num(T.appeals)} of them appeals and ${num(T.council)} council decisions, made between ${day(T.first)} and ${day(T.last)}.</li>
<li>They use <b>${FACTORS.length} factors</b>, which fall into <b>${CLASSES.length} classes</b>. Counting each factor once per decision gives <b>${num(T.findings)} factor findings</b>, about ${Math.round(T.findings / T.assessed)} a decision: ${num(T.plus)} counted for the location, ${num(T.minus)} against, and ${num(T.aside)} were raised but set aside or neutral.</li>
<li><b>The walking route is what most often decides.</b> It was among the decisive factors in ${num(A.decisive.length)} of the ${num(T.assessed)} decisions. Whether there is a footway (${num(S.A1.n)} decisions) and whether the route is lit (${num(S.A3.n)}) are two of the three most-used factors.</li>
<li><b>Distance cuts evenly.</b> It came up in ${num(S.B1.n)} decisions, counting for the location in ${num(S.B1.plus)} and against it in ${num(S.B1.minus)}.</li>
<li><b>Cycling and the settlement hierarchy are often raised and rarely decide.</b> Cycling was a factor in ${num(F.n)} decisions and decisive in ${num(F.decisive.length)}; the hierarchy and plan position in ${num(I.n)} and decisive in ${num(I.decisive.length)}.</li>
</ul><p class="note">This is a sub-page of <a href="${PARENT}">How to assess a sustainable location under the 2026 NPPF</a>, which sets out the test in policy TR3 of the National Planning Policy Framework (NPPF) and the guidance on it. The counts come from our notes on each decision; <a href="#method">the method and its limits</a> are below.</p></div></section>`;

const scope = `<section id="scope"><h2>What was counted</h2>
<p>We screened ${num(T.screened)} decisions: every one in the <a href="/research/england/nppf-navigator/decisions/">decisions database</a> with a finding on TR3 or on the policies that refer to it, a main issue about location or accessibility, or repeated wording about car dependence or access to services.</p>
<ul>
<li><b>${num(T.assessed)}</b> assess the location with at least one stated factor. These are the base for every count on this page.</li>
<li><b>${num(T.bare)}</b> only assert or concede the point, for example by listing a "sustainable location" among the benefits with no reasons.</li>
<li><b>${num(T.notEngaged)}</b> turned out not to be about accessibility: for example "location" meant a town-centre sequential test, or TR3 was cited only for highway safety.</li>
</ul>
<p>Of the ${num(T.assessed)}, ${num(T.pass)} found the location sustainable, ${num(T.fail)} found it not sustainable, and ${num(T.mixed)} were mixed: shortcomings were found but tolerated, or the site passed one policy limb and failed another. ${num(T.unclear)} reached no finding. ${num(T.fw2026)} applied the August 2026 Framework. ${num(T.fw2024)} were decided after it took effect but used the wording of the December 2024 Framework, which TR3 carries forward, and ${num(T.assessed - T.fw2026 - T.fw2024)} cite neither.</p>
</section>`;

const HEAD = '<thead><tr><th>Factor</th><th class="n">Decisions</th><th class="n">For</th><th class="n">Against</th><th class="n">Set aside</th><th class="n">Decisive</th></tr></thead>';
const cells = (s) => `<td class="n">${num(s.n)}</td><td class="n">${num(s.plus)}</td><td class="n">${num(s.minus)}</td><td class="n">${num(s.aside)}</td><td class="n">${num(s.decisive.length)}</td>`;
const classes = `<section id="classes"><h2>The ${CLASSES.length} classes</h2>
<div class="table-wrap"><table>${HEAD.replace('Factor', 'Class')}<tbody>
${CLASSES.map((c) => `<tr><td><a href="#class-${c.code.toLowerCase()}">${esc(c.label)}</a><span class="sub">${num(S[c.code].findings)} findings from ${FACTORS.filter((f) => f.cls === c.code).length === 1 ? '1 factor' : FACTORS.filter((f) => f.cls === c.code).length + ' factors'}</span></td>${cells(S[c.code])}</tr>`).join('\n')}
</tbody></table></div>
<p class="note"><b>Decisions</b> is the number of the ${num(T.assessed)} in which a factor of that class came into play. <b>For</b>, <b>Against</b> and <b>Set aside</b> count the factor findings: the decision-maker treated the factor as supporting a sustainable location, as counting against it, or raised it and then rejected it, gave it little or no weight, or left it neutral. <b>Decisive</b> is the number of decisions in which a factor of that class was one of the one to three that settled the location finding.</p>
</section>`;

// Up to three decisions in which the factor was decisive: appeals first, then the most recent.
const examples = (code) => {
  const rows = [...S[code].decisive].sort((a, b) => isAppeal(b) - isAppeal(a) || b.c.decision_date.localeCompare(a.c.decision_date)).slice(0, 3);
  return rows.length ? `<span class="sub">Decisive in ${rows.map(link).join('; ')}${S[code].decisive.length > rows.length ? '; and others' : ''}</span>` : '';
};
const factors = `<section id="factors"><h2>Every factor</h2>
<p>Each factor is counted once for a decision in which it came into play. The decisions named under a factor are examples in which it was decisive; the <a href="#register">full register</a> lists the factors in every decision.</p>
${CLASSES.map((c) => `<h3 id="class-${c.code.toLowerCase()}">${esc(c.label)}</h3>
<div class="table-wrap"><table>${HEAD}<tbody>
${FACTORS.filter((f) => f.cls === c.code).sort((a, b) => S[b.code].n - S[a.code].n).map((f) => `<tr id="${f.code.toLowerCase()}"><td>${esc(f.label)}${examples(f.code)}</td>${cells(S[f.code])}</tr>`).join('\n')}
</tbody></table></div>`).join('\n')}
<p class="note">${num(T.unclassified)} one-off points fit no factor, for example an adjacent park and ride, or linked trips in a district centre. They are in the register's "other" column and are not counted here.</p>
</section>`;

const split = `<section id="pass-and-fail"><h2>What separates the findings</h2>
<p>The table shows, for each class, the share of decisions with each finding in which it came into play.</p>
<div class="table-wrap"><table><thead><tr><th>Class</th><th class="n">Sustainable (${num(T.pass)})</th><th class="n">Not sustainable (${num(T.fail)})</th><th class="n">Mixed (${num(T.mixed)})</th></tr></thead><tbody>
${CLASSES.map((c) => `<tr><td>${esc(c.label)}</td><td class="n">${pct(S[c.code].pass, T.pass)}</td><td class="n">${pct(S[c.code].fail, T.fail)}</td><td class="n">${pct(S[c.code].mixed, T.mixed)}</td></tr>`).join('\n')}
</tbody></table></div>
<p>A walking-route factor appears in ${num(A.fail)} of the ${num(T.fail)} decisions that found the location not sustainable, and in ${num(A.pass)} of the ${num(T.pass)} that found it sustainable. A finding that the location is sustainable is more often built on the bus service (${num(D.pass)} of ${num(T.pass)}) and on distance or proximity (${num(B.pass)}).</p>
</section>`;
holds(A.fail / T.fail > 0.8 && A.pass / T.pass < 0.55, 'a walking-route factor appears in most "not sustainable" findings and about half of "sustainable" ones');
holds(D.pass > B.pass && B.pass > A.pass, 'sustainable findings are more often built on buses and distance than on the walking route');

const totals = `<section id="what-it-shows"><h2>What the totals show</h2>
<ul>
<li><b>The walking route dominates.</b> It has ${num(A.findings)} findings, more than twice any other class, and ${pct(A.minus, A.findings)} of them count against the location. It was decisive in ${num(A.decisive.length)} decisions; the next class, ${esc(label[[...CLASSES].sort((a, b) => S[b.code].decisive.length - S[a.code].decisive.length)[1].code].toLowerCase())}, in ${num([...CLASSES].map((c) => S[c.code].decisive.length).sort((a, b) => b - a)[1])}.</li>
<li><b>Footway and lighting lead.</b> Whether there is a footway was a factor in ${num(S.A1.n)} decisions and decisive in ${num(S.A1.decisive.length)}; street lighting in ${num(S.A3.n)} and decisive in ${num(S.A3.decisive.length)}. Neither is measured by the Connectivity Tool.</li>
<li><b>Distance cuts evenly</b> (${num(S.B1.plus)} for, ${num(S.B1.minus)} against) and was decisive in ${num(S.B1.decisive.length)} decisions, fewer than half as many as footway presence. A distance benchmark such as 800 metres was applied in ${num(S.B2.n)}.</li>
<li><b>Buses are raised in more decisions than anything else</b> (${num(D.n)}) and count for the location more often than against it (${num(D.plus)} to ${num(D.minus)}). The exception is evidence: where the decision-maker had no timetable or frequency evidence (${num(S.D3.n)} decisions), ${num(S.D3.fail)} found the location not sustainable.</li>
<li><b>Cycling and the settlement hierarchy are argued but rarely decide.</b> Cycling was decisive in ${num(F.decisive.length)} of the ${num(F.n)} decisions that weighed it. A settlement's tier in the council's hierarchy came up in ${num(S.I1.n)} and was decisive in ${num(S.I1.decisive.length)}; see <a href="${PARENT}service-village/">Service Village Does Not Mean Sustainable</a>.</li>
<li><b>Scale and the nature of the scheme are the usual route to a mixed finding.</b> They appear in ${num(H.mixed)} of the ${num(T.mixed)} mixed findings and count for the location ${num(H.plus)} times against ${num(H.minus)}. The scale of the scheme itself (${num(S.H1.n)} decisions) is less one-sided: ${num(S.H1.plus)} for, ${num(S.H1.minus)} against, ${num(S.H1.aside)} set aside.</li>
<li><b>Electric vehicles and home working did not help.</b> They were argued in ${num(S.G3.n + S.G4.n)} decisions and never counted for the location.</li>
<li><b>Usability for everyone only ever counts against.</b> Whether the route works for children, disabled people or older people, and in the dark or in winter, was a factor in ${num(S.A10.n)} decisions and never counted for the location.</li>
<li><b>Earlier decisions carry little.</b> Comparator appeals and permissions were raised in ${num(S.J4.n)} decisions and set aside in ${num(S.J4.aside)}.</li>
<li><b>The Connectivity Tool is cited in few decisions but matters when it is.</b> A score was a factor in ${num(S.J1.n)} decisions (${num(S.J1.plus)} for, ${num(S.J1.minus)} against) and among the decisive factors in ${num(S.J1.decisive.length)}.</li>
<li><b>Mitigation is offered in few decisions and usually helps.</b> New footways, crossings, bus contributions and the like came up in ${num(K.n)} decisions; ${num(K.plus)} of the ${num(K.findings)} findings counted for the location.</li>
</ul></section>`;

const method = `<section id="method"><h2>Method and limits</h2>
<p>Each decision's factors were coded from our case file for it, which is our note of the decision letter or council report, against a fixed <a href="${REPO}codebook.md">codebook</a>. Every coded factor was then checked against the text of the decision itself: the letter or report has to contain wording for that factor. The settlement-tier factor follows the separate, quote-checked register behind <a href="${PARENT}service-village/">Service Village Does Not Mean Sustainable</a>. The <a href="${REPO}register.tsv">register</a>, with one row per decision, is in the research repository.</p>
<ul>
<li><b>The counts are floors.</b> A factor our note left out is not counted, so a factor may have been used in more decisions than shown.</li>
<li><b>The text check is a check of presence.</b> It shows the decision mentions the factor. It does not prove which way the factor cut.</li>
<li><b>The split between for, against and set aside is approximate at the margin.</b> A shortcoming that was found and then tolerated can fairly be read as against or as set aside. The number of decisions in which a factor came into play is the firmer figure.</li>
<li><b>"Decisive" is our reading</b> of what settled the location finding, not a quotation from the decision.</li>
<li><b>Two factors are probably undercounted:</b> narrow or single-track lanes, and the Public Transport Accessibility Level (PTAL) used in London. Both were added after the first pass.</li>
<li><b>The location finding is not the outcome.</b> A scheme in a location found sustainable can still be refused on other grounds, and the reverse.</li>
</ul></section>`;

const chip = (r, code) => `<span class="f${r.dec.has(code) ? ' d' : ''}" title="${esc(label[code])}${r.dec.has(code) ? ' (decisive)' : ''}">${code}${SIGN[r.f.get(code)]}</span>`;
const register = `<section id="register"><h2>The register</h2>
<details><summary>All ${num(T.assessed)} decisions, with the factors in each</summary>
<p class="note">Each factor is shown by its code and a sign: + for, − against, = set aside. Decisive factors are in bold. Hover over a code for its name. A is the walking route, B distance, C services, D buses, E rail, F cycling, G car reliance, H scale and nature, I hierarchy and plan, J evidence, K mitigation.</p>
<div class="table-wrap"><table class="reg"><thead><tr><th>Decision</th><th>Date</th><th>Outcome</th><th>Location</th><th>Factors</th></tr></thead><tbody>
${ASSESSED.map((r) => `<tr><td>${link(r)}</td><td class="d">${esc(r.c.decision_date)}</td><td>${esc(r.c.outcome)}</td><td>${FINDING[r.finding]}</td><td>${[...r.f.keys()].map((code) => chip(r, code)).join(' ')}</td></tr>`).join('\n')}
</tbody></table></div></details></section>`;

const css = `<style>section>ul,.rule ul{margin:0;padding-left:20px;display:grid;gap:6px;max-width:68ch}h3{font:600 17px/1.35 var(--sans);margin-top:8px}
.table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:8px;background:var(--surface)}table{border-collapse:collapse;width:100%;font-size:14.5px}th,td{text-align:left;vertical-align:top;padding:8px 12px;border-top:1px solid var(--line)}thead th{border-top:0;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);background:var(--surface-2)}
th.n,td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}td:first-child{min-width:200px}.sub{display:block;font-size:12.5px;color:var(--muted);margin-top:2px}
details{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:10px 14px;display:grid;gap:10px}summary{cursor:pointer;font-weight:600;color:var(--accent)}
table.reg{font-size:13.5px}table.reg td.d{white-space:nowrap}.f{font:500 12px var(--mono);color:var(--muted);white-space:nowrap}.f.d{font-weight:700;color:var(--ink)}</style>`;

const html = page({
  title: 'Sustainable Location: Factors in Decisions',
  description: `The factors inspectors and councils used to decide whether a location is sustainable in ${T.assessed} planning decisions made since the August 2026 NPPF: ${FACTORS.length} factors in ${CLASSES.length} classes, counted. The walking route was decisive in ${A.decisive.length}; footway presence and street lighting are among the most-used factors; distance cuts evenly.`,
  url: ORIGIN + FACTORS_PAGE,
  breadcrumb: `<a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/england/">England</a> › <a href="${PARENT}">Sustainable location</a> › Factors in decisions`,
  h1: `What decides a sustainable location: the factors in ${T.assessed} decisions`,
  dek: `Every factor inspectors and councils have used to decide whether a site is a sustainable location since the August 2026 Framework took effect, grouped into ${CLASSES.length} classes and counted.`,
  body: short + scope + classes + factors + split + totals + method + register,
  sources: [
    `The <a href="${REPO}register.tsv">location-factors register</a> and its <a href="${REPO}codebook.md">codebook</a> in the research repository.`,
    'The <a href="/research/england/nppf-navigator/decisions/">decisions database</a>: each decision named on this page links to our note on it, which links to the decision itself.',
    `<a href="${PARENT}">How to assess a sustainable location under the 2026 NPPF</a>, for the policy and the guidance.`,
  ],
  credit: 'Prepared by Planning Distilled. Figures are recalculated from the register each time the page is built.',
});

const out = path.join(SITE, SITE_PATH);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html.replace('</head>', css + '\n</head>'));
console.log(`✓ ${SITE_PATH}: ${T.assessed} decisions assessed (${T.screened} screened), ${FACTORS.length} factors in ${CLASSES.length} classes, ${T.findings} findings (+${T.plus} −${T.minus} =${T.aside}); walking route decisive in ${A.decisive.length}`);
