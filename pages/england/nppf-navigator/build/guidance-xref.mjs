// Section 2 of the method page (external cross-references) and the "Published guidance: all sources" page.
// Data: data/guidance — corpus/*.md (frontmatter, summary), the README source table (stances
// after the adversarial check) and quotes-check.json (every quotation machine-checked against the saved
// text by tools/corpus_quotes.py). Only quotations that matched are published; summaries containing a
// quotation that did not match are held back. Quotations hand-written below were checked the same way.

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const unq = (s) => String(s ?? '').trim().replace(/^["']|["']$/g, '');
const ext = (url, text) => `<a href="${esc(url)}" target="_blank" rel="noopener">${text}</a>`;

const TYPES = [
  ['government', 'Government and Parliament'], ['pins', 'Planning Inspectorate'], ['lpa', 'Councils'],
  ['training-body', 'Training bodies'], ['sector-body', 'Sector bodies'], ['chambers', "Barristers' chambers"],
  ['law-firm', 'Law firms'], ['consultancy', 'Planning consultancies'], ['independent', 'Independent writers and tools'],
  ['press', 'Trade and local press'], ['campaign', 'Campaign groups'],
];
const PROP_NAMES = {
  SH1: 'Settlement-hierarchy tiers carry no weight of their own', SH2: 'Washed-over Green Belt villages are not Annex B settlements',
  TR: 'Walking-route quality decides, not distance', S5: 'Outside settlements the S5(1) category is the whole case',
  SUP: 'Supply opens the gate but rarely decides', GB: 'Grey belt is not approval', A2: 'Annex A ¶2 and the weight of plan policies',
  DIV: 'Councils pass what inspectors fail', METH: 'Decision letters as evidence of how the Framework is applied',
};
const STANCE = { agr: 'agrees', qual: 'qualifies', DIS: 'disagrees' };
// Summary sentences that describe our retrieval or coding process rather than the source.
const INTERNAL = /\bbatch\b|reader proxy|r\.jina|WebFetch|direct fetch|Internet Archive|local copy|this corpus|use that file|\bcoded\b(?! policies)|\bcoding\b|could not be (read|coded)|not retrieved|our coded|returned (4\d\d|403|429)|HTTP \d{3}|Wayback|was retrieved|retrieved (from|through|via)|rate-limited|\bsnapshot\b|search listing|the brief\b|returns? 403|\bretrieved (page|text)\b|does not occur/i;
// Unchecked claims that a source is silent on something are left out of public summaries.
const SILENCE = /\b(no guidance|says nothing|contains no|gives no|does not (mention|cover|address|discuss|explain)|is silent|nothing (on|about))\b/i;

/** The review's snapshot date: the latest retrieved_on in the corpus (ISO and long form). */
export function snapshotOf(sources) {
  const iso = sources.map((s) => s.retrieved).filter(Boolean).sort().pop();
  if (!iso) throw new Error('guidance: no retrieved_on dates in the corpus');
  return { iso, long: new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) };
}

export function loadGuidance(root) {
  const dir = root;
  const checks = JSON.parse(readFileSync(join(dir, 'quotes-check.json'), 'utf8'));
  const stances = {};
  for (const l of readFileSync(join(dir, 'README.md'), 'utf8').split('\n')) {
    const m = l.match(/^\| `([^`]+)` \|/);
    if (!m) continue;
    const cells = l.split('|');
    stances[m[1]] = cells[cells.length - 2].split(/[,;]/).map((t) => t.trim().match(/^([A-Z0-9]+) (agr|qual|DIS)$/)).filter(Boolean).map((x) => [x[1], x[2]]);
  }
  const sources = readdirSync(join(dir, 'corpus')).filter((f) => f.endsWith('.md')).map((f) => {
    const slug = f.slice(0, -3);
    const lines = readFileSync(join(dir, 'corpus', f), 'utf8').split('\n');
    const end = lines.indexOf('---', 1);
    const fm = {};
    for (const l of lines.slice(1, end)) { const i = l.indexOf(':'); if (i > 0) fm[l.slice(0, i).trim()] = unq(l.slice(i + 1)); }
    const body = lines.slice(end + 1).join('\n');
    const chk = checks[slug] ?? { summary: [], positions: [] };
    let summary = (body.match(/## Summary\n([\s\S]*?)\n## /)?.[1] ?? '').trim();
    const summaryOk = chk.summary.every(([, ok]) => ok);
    if (fm.verification === 'not-retrieved') summary = ''; // only search-listing guesses exist for these
    summary = summaryOk ? summary.split(/(?<=[.!?])\s+(?=[A-Z(])/).filter((s) => !INTERNAL.test(s) && !SILENCE.test(s)).join(' ') : '';
    const st = stances[slug] ?? [];
    const quotes = {};
    for (const p of chk.positions) {
      const code = { agrees: 'agr', qualifies: 'qual', disagrees: 'DIS' }[p.stance];
      if (!st.some(([pr, s]) => pr === p.prop && s === code)) continue; // stance recoded on checking
      for (const [q, ok] of p.quotes) if (ok && q.split(/\s+/).length >= 5 && !(quotes[p.prop] ?? []).includes(q)) (quotes[p.prop] ??= []).push(q);
    }
    return {
      slug, title: fm.title || slug, url: fm.url || '', publisher: fm.publisher || '', type: (fm.publisher_type || '').split(' ')[0],
      date: /^\d{4}-\d{2}-\d{2}$/.test(fm.date) ? fm.date : '', audience: fm.audience || '', draft: fm.about_draft === 'true',
      training: fm.is_training === 'true', verification: fm.verification || '', retrieved: /^\d{4}-\d{2}-\d{2}$/.test(fm.retrieved_on) ? fm.retrieved_on : '', summary, summaryHeld: !summaryOk, stances: st, quotes,
    };
  });
  const unknown = sources.filter((s) => !TYPES.some(([k]) => k === s.type));
  if (unknown.length) throw new Error(`guidance: unknown publisher_type for ${unknown.map((s) => s.slug).join(', ')}`);
  return sources;
}

// 2.1 — sources that themselves use decisions as evidence, or back doing so.
export function methodSupportSection(n, sourcesUrl) {
  const rows = [
    ['GapSense analysis, published by The Intermediary (13 July 2026)', 'https://theintermediary.co.uk/2026/07/grey-belt-is-changing-green-belt-appeals-but-not-in-the-way-many-expected/', 'Same method',
      'Coded 726 Planning Inspectorate decision letters that mention grey belt (December 2024 Framework) against a fixed frame and derived outcome rates: "Planning policy has to be understood at the level of individual decisions, not ministerial announcements." Like us, it finds that location decides grey belt appeals.',
      'Warns that outcome rates reflect which cases reach appeal: "stronger cases reach inquiry in the first place." We now say our route rates are associations across many appeals, not forecasts for one.'],
    ['Planning Geek — "Presumption in favour of sustainable development" and appeal write-ups', 'https://www.planninggeek.co.uk/policy/presumption-in-favour-of-sustainable-development/', 'Consistent',
      'Reads individual decisions under the August 2026 Framework almost daily. Every write-up we compared agrees with our coding. Its Aston Clinton note ("It is an individual appeal decision on its own evidence") caught our stale S5(4) count, now corrected.',
      'The presumption page slightly overstates how decisive a housing shortfall is (it only opens S5(1)(j); about 40% of (j) passes are allowed), and omits "up-to-date" from the S3(1)(c) route.'],
    ['Burges Salmon — "The New NPPF: One Month On" (17 September 2026)', 'https://www.burges-salmon.com/articles/102o1g3/the-new-nppf-one-month-on/', 'Same evidence base',
      'A law-firm note built on the first month of appeal decisions: "we are now seeing appeal decisions published which refer to the new NPPF and grapple with its policies."',
      'Five hand-picked cases, no counts. Its 6005108 report (spatial-policy conflict reduced to moderate weight because of S5(1)(j)) is one of our Annex A cut cases.'],
    ['High Court, R (Old Chiswick Protection Society) v LB Hounslow [2026] EWHC 2278 (Admin), reported by Landmark Chambers', 'https://www.landmarkchambers.co.uk/news-and-cases/cases/planning-permission-quashed-by-high-court-for-unlawful-inconsistency-in-decision-making', 'Legal basis',
      'Permission quashed because the officer report did not engage with an inspector\'s earlier findings. The court: "It benefits no one for officers to give advice or convey judgments, particularly as to material considerations, that they know to have been rejected by a planning inspector."',
      'Concerns a previous decision on the same site, not counts across many sites. Appeal decisions are material, not binding precedent.'],
    ['Planning Inspectorate — "Is your appeal decision written in the stars?" (19 August 2026) and casework database', 'https://planninginspectorate.blog.gov.uk/2026/08/19/is-your-appeal-decision-written-in-the-stars/', 'Benchmark',
      'Official allowed rates for 2025/26 section 78 appeals: 31% overall, 30% by written representations, 53% at hearings, 72% at inquiries. Our inspector permit rate under the August 2026 Framework is about 32%.',
      'PINS explains "why headline rates of allowed appeals don’t tell the full story" and warns that small samples per inspector or area can show 100% either way. We show denominators and flag small samples.'],
    ['Ministry of Housing, Communities and Local Government — December 2025 consultation', 'https://assets.publishing.service.gov.uk/media/697b6bc6aacd0dc9777b4fd2/December_2025_NPPF_Consultation.pdf', 'Government practice',
      'The government itself uses appeal outcomes as evidence of how policy is working: "Since the current Framework was updated in December 2024, an unprecedented 80% of major residential appeals located on grey belt land have been approved".',
      'A headline rate with no discussion of selection, the caveat GapSense and PINS raise.'],
    ['Urbanist Architecture — grey belt appeal digests (updated March 2026)', 'https://urbanistarchitecture.co.uk/grey-belt-planning-and-appeal-decisions/', 'Same evidence base',
      'Reads grey belt appeals for lessons and finds "inspectors are applying the Grey Belt policy with growing consistency". Same conclusions as ours on grey belt not being approval and on route safety deciding.',
      'Written under the December 2024 Framework. It proposes a distance threshold to a bus stop that we do not adopt: every failure it cites is a route-quality failure.'],
    ['Livedin — "NPPF 2026 policy test"', 'https://livedin.co.uk/nppf-2026/policy-test', 'Comparator',
      'A rules engine built from the 2026 policy text, the nearest public comparator to the Navigator. It checks its readings against appeals: "no decision has had to decide the point, because a supply shortfall was present in every appeal read".',
      'Agrees with us on washed-over villages and S5; disagrees on Annex A ¶2, where our recount now largely agrees with it on spatial policies.'],
  ];
  return `<h3>2.1 Sources that support reading decisions as evidence</h3>
<p>Few published sources look at decisions at all; most read the policy text. These are the ones that do, or that back doing so. They are the strongest outside support for the Navigator's method, and each comes with the caveat it raises.</p>
<div class="tw"><table>
<thead><tr><th>Source</th><th>Relation</th><th>What it does and how it supports the method</th><th>Caveat or watch-point</th></tr></thead>
<tbody>
${rows.map(([t, u, r, what, cav]) => `<tr><td>${ext(u, esc(t))}</td><td><span class="tag">${esc(r)}</span></td><td>${esc(what)}</td><td>${esc(cav)}</td></tr>`).join('\n')}
</tbody></table></div>
<p>All quotations above were checked word for word against saved copies of the sources. All ${n} sources reviewed are on the <a href="${sourcesUrl}">published guidance sources page</a>.</p>`;
}

// 2.2 — summary of the whole review, linking to the sources page.
export function guidanceSummarySection(sources, sourcesUrl) {
  const n = sources.length;
  const count = (f) => sources.filter(f).length;
  const read = count((s) => s.verification === 'local-text');
  const web = count((s) => s.verification === 'webfetch-only');
  const notRead = count((s) => s.verification === 'not-retrieved');
  const tally = {};
  for (const s of sources) for (const [p, st] of s.stances) { tally[p] ??= { agr: 0, qual: 0, DIS: 0 }; tally[p][st]++; }
  const PROPS = [
    ['SH1', 'A local settlement-hierarchy tier ("Local Service Village", "Key Service Centre") carries no weight of its own under the Framework.', 'Supported.'],
    ['SH2', 'A village washed over by the Green Belt is not a "settlement" under Annex B, whatever its local tier.', 'Supported. One wording point taken: Green Belt land goes down the GB6–GB8 route; S5 applies only through S5(5).'],
    ['TR', 'On TR3 and GB7(1)(g)(iii) the quality of the walking route decides, not distance.', 'Supported.'],
    ['S5', 'Outside settlements the S5(1) category is the whole case; S5(4) is almost always fatal.', '<strong>Count corrected</strong>: 37 fail / 3 pass at appeal, adding Aston Clinton (6008253).'],
    ['SUP', 'A housing land supply shortfall opens the gate but rarely decides the case on its own.', '<strong>Softened</strong> from "never decides" after Aston Clinton.'],
    ['GB', 'Grey belt is usually won at a village edge; passing GB7 is not approval.', 'Supported.'],
    ['A2', 'Annex A ¶2 cuts only the inconsistent part of a plan policy.', '<strong>Finding changed</strong>: spatial restrictions usually lose weight; heritage, design and access keep it (see below).'],
    ['DIV', 'On the same tests, councils pass what inspectors fail.', 'Little tested by anyone else.'],
    ['METH', 'Decision letters are the main evidence of how the Framework is applied.', 'Supported, with a caveat on reading outcome rates (see 2.1).'],
  ];
  const propRows = PROPS.map(([id, text, result]) => {
    const t = tally[id] ?? { agr: 0, qual: 0, DIS: 0 };
    return `<tr><td><code>${id}</code></td><td>${esc(text)}</td><td class="n">${t.agr}</td><td class="n">${t.qual}</td><td class="n">${t.DIS}</td><td>${result}</td></tr>`;
  }).join('\n');

  return `<h3>2.2 Review of published guidance (snapshot ${snapshotOf(sources).long})</h3>
<p>We collected the public guidance on applying the August 2026 Framework: government and Planning Inspectorate material, council committee reports and member briefings, barristers' chambers, law firms, planning consultancies, sector and campaign bodies, the trade press and independent writers. Each source was saved, read in full and coded against the nine propositions the Navigator rests on. Every claimed disagreement or qualification was then given to a second reviewer told to knock it down: check the quotation word for word against the saved text, read the context, and recode it if it did not hold.</p>
<div class="stat">
<div><b>${n}</b><span>sources found</span></div>
<div><b>${read + web}</b><span>read in full (${read} checked against a saved copy)</span></div>
<div><b>${count((s) => s.training)}</b><span>training or briefing material</span></div>
<div><b>${count((s) => s.draft)}</b><span>about the December 2025 draft</span></div>
</div>
<p class="banner"><strong>Every source, with links, summaries and checked quotations:</strong> <a href="${sourcesUrl}">Published guidance on the August 2026 NPPF: all ${n} sources</a> (also as CSV and JSON).</p>
<p><strong>Result.</strong> Published guidance broadly supports the propositions. About 211 disagreements or qualifications were coded at first reading; 21 survived the check, and only 3 are outright disagreements, all on Annex A ¶2. Almost all the guidance reads the policy text rather than decisions, so "agrees" usually means agreement with the text, not with our counts. ${notRead} sources were found but could not be read (paywalls or blocked downloads); they are listed but not coded.</p>
<div class="tw"><table>
<caption>Sources taking a position on each proposition, after the check. Sources silent on a proposition are not counted.</caption>
<thead><tr><th></th><th>Proposition</th><th>Agrees</th><th>Qualifies</th><th>Disagrees</th><th>What we did</th></tr></thead>
<tbody>
${propRows}
</tbody></table></div>

<h4>Where the review changed our analysis</h4>
<ul>
<li><strong>Annex A ¶2 (changed).</strong> Two Landmark Chambers silks expect the S4/S5 approach to make settlement-based restraint policies materially inconsistent: it is "likely to override all other settlement-based constraint policies" (Reed KC); plans are likely to be inconsistent on "the S4/S5 approach to acceptability in principle" (Warren KC). Livedin agrees: "Most restrictive rural housing policies adopted under earlier editions sit here." We recounted all 96 appeal letters that weigh a plan policy against the Framework. Spatial restrictions (settlement boundaries, countryside restraint) were cut in 30 of 45 letters: 16 for a named conflict with S4/S5, and 13 because housing supply was short, the 2024 "out of date" reasoning carried over. Heritage, design, amenity and access policies kept their weight in 38 of 39. The silks are right about spatial restrictions; the heritage and design half of our finding stands.</li>
<li><strong>S5(4) and supply (corrected).</strong> Aston Clinton (6008253, hearing, 66 homes) passed S5(4) on a substantial supply shortfall, 25% affordable housing and the council's own emerging allocation. Our headline count had not caught up with the case file. It is now 37 fail / 3 pass at appeal, and the supply proposition says "rarely", not "never".</li>
<li><strong>Reading outcome rates (caveat added).</strong> See 2.1: outcome rates reflect which cases reach appeal and by which procedure.</li>
<li><strong>Still open.</strong> Whether need for one type of housing (affordable, older people's) can open S5(1)(j) where five-year supply is met (Cornerstone; Garvey KC); the permissive "adjoining is enough" reading of "physically well-related" argued at the Colwell Farm inquiry (decision awaited); and HO12 giving traveller sites locational flexibility within GB7.</li>
</ul>

<h4>Common misreadings found in published guidance</h4>
<ul>
<li>Treating the Annex B "around 800 metres" reasonable walking distance as a test for all walking access. It applies only to the station policies (S5(1)(h), L3, GB7(1)(h)), not to TR3 or GB7(1)(g)(iii).</li>
<li>Quoting the December 2025 draft as if final: the draft Annex A said "in any way inconsistent", the draft settlement definition had no Green Belt village exclusion, and the draft S5(1)(j) said "well related" without "physically".</li>
<li>Reading the S5(5) "tilt in favour" after GB7 as approval. It is a presumption that the S5(2) "should be refused" policies can still defeat.</li>
</ul>

<h4>How councils are training officers and members</h4>
<ul>
<li><strong>National support is thin.</strong> The Chief Planner's August 2026 newsletter says only: "I would encourage authorities to familiarise themselves with the new Framework." Planning Practice Guidance had not been re-keyed to the 2026 policy codes by 2 October. The Planning Advisory Service events we could verify covered the draft; autumn events on the final text are announced but we have not seen their material. Freedom of information releases show the Inspector Training Manual was updated about eight weeks after the December 2024 Framework ("Consolidated Inspector Training Manual on 10 February 2025"); we found no 2026 version in the public domain.</li>
<li><strong>Council briefings teach the draft.</strong> Of the 12 council documents found, only two were written after 17 August 2026. Every council briefing on Annex A that we found used the draft's whole-policy reading: King's Lynn and West Norfolk, policies "in any way inconsistent"; Gedling, inconsistent policies "will be considered out of date and be accorded little weight". The final text says "policies (or parts of those policies) which are materially inconsistent". Inspectors cut clauses; Stratford-on-Avon District Council, in our database, cut whole heritage (CS.8) and access (CS.26) policies.</li>
<li><strong>Settlements and supply.</strong> None of the council or parish training we found explains Annex B or the washed-over village exclusion. A parish handout says development "within settlement boundaries permitted in most circumstances" (Battle Town Council, on the draft). A September 2026 full-council report still frames supply in 2024 terms: "Not meeting the five-year supply means national planning policy takes precedence over local policy" (North East Lincolnshire).</li>
<li><strong>One council applying the final tests.</strong> Three Rivers' inquiry note treats route and topography, not the 800 metre line, as deciding reasonable walking distance, and runs the S5(5) balance with S5(2) after GB7: the approach inspectors take.</li>
</ul>

<h4>Others analysing decisions</h4>
<p>See 2.1. We found no one else counting findings test by test under the August 2026 text, or comparing councils with inspectors on the same tests.</p>`;
}

// The sources page: every source, grouped by publisher type, with a text and proposition filter.
export function writeSourcesPage(sources, { outDir, css, navUrl, methodUrl, pageUrl, asOf }) {
  const snap = snapshotOf(sources);
  const n = sources.length;
  const VER = { 'local-text': 'read; saved copy', 'webfetch-only': 'read online', 'not-retrieved': 'found, not read' };
  const card = (s) => {
    const tags = [s.draft && '<span class="tag">draft</span>', s.training && '<span class="tag">training</span>'].filter(Boolean).join(' ');
    const meta = [esc(s.publisher), s.date, VER[s.verification] ?? esc(s.verification)].filter(Boolean).join(' · ');
    const st = s.stances.length
      ? `<ul class="stances">${s.stances.map(([p, x]) => `<li><span class="st st-${x}">${STANCE[x]}</span> <code>${p}</code> ${esc(PROP_NAMES[p] ?? '')}${(s.quotes[p] ?? []).slice(0, 2).map((q) => `<blockquote>&ldquo;${esc(q)}&rdquo;</blockquote>`).join('')}</li>`).join('')}</ul>`
      : '';
    const summary = s.verification === 'not-retrieved' ? '<p class="q">Not read: the page is behind a paywall or blocks automated retrieval. Listed for completeness; no stance coded.</p>' : s.summary ? `<p>${esc(s.summary)}</p>` : (s.summaryHeld ? '<p class="q">Summary held back until its quotations are re-checked.</p>' : '');
    const props = s.stances.map(([p]) => p).join(' ');
    return `<article class="srcc" id="${esc(s.slug)}" data-p="${props}"><h4>${s.url ? ext(s.url, esc(s.title)) : esc(s.title)} ${tags}</h4><p class="q">${meta}</p>${summary}${st}</article>`;
  };
  const groups = TYPES.map(([key, label]) => {
    const rows = sources.filter((s) => s.type === key).sort((a, b) => a.publisher.localeCompare(b.publisher) || a.title.localeCompare(b.title));
    return `<section class="grp"><h2 id="${key}">${esc(label)} <span class="q">(${rows.length})</span></h2>\n${rows.map(card).join('\n')}</section>`;
  }).join('\n');
  const toc = TYPES.map(([k, l]) => `<a href="#${k}">${esc(l)}</a> <span class="q">${sources.filter((s) => s.type === k).length}</span>`).join(' · ');

  const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Published Guidance Sources</title>
<meta name="description" content="All ${n} published sources on applying the August 2026 NPPF reviewed for the NPPF 2026 Navigator: government, Planning Inspectorate, councils, chambers, law firms, consultancies, press and campaign groups, with summaries, stances and checked quotations.">
<link rel="canonical" href="${pageUrl}">
<link rel="license" href="https://creativecommons.org/licenses/by/4.0/">
<meta property="og:title" content="Published guidance on the August 2026 NPPF: all ${n} sources">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=IBM+Plex+Mono:wght@400;500&display=swap">
${css.replace('</style>', `.toc{font-size:14px;line-height:1.9}
.filter{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:16px 0;position:sticky;top:0;background:var(--ground);padding:10px 0;z-index:1}
.filter input{flex:1 1 16em;min-width:0;border:1px solid var(--line);border-radius:6px;background:var(--surface);color:var(--ink);padding:9px 11px;font:inherit;font-size:15px}
.filter select{max-width:100%;border:1px solid var(--line);border-radius:6px;background:var(--surface);color:var(--ink);padding:8px;font:inherit;font-size:14px}
.srcc{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:14px 16px;margin:10px 0;font-size:15px;overflow-wrap:anywhere}
.srcc h4{margin:0 0 4px;font:600 16px/1.35 var(--sans);color:var(--ink)}
.srcc p{margin:6px 0}
.stances{list-style:none;padding:0;margin:8px 0 0}
.stances li{margin:6px 0}
.st{font-size:12px;font-weight:700;border-radius:4px;padding:1px 7px}
.st-agr{background:color-mix(in srgb,var(--ok) 15%,transparent);color:var(--ok)}
.st-qual{background:var(--accent-soft);color:var(--accent)}
.st-DIS{background:color-mix(in srgb,var(--no) 15%,transparent);color:var(--no)}
blockquote{margin:6px 0;padding:6px 10px;border-left:3px solid var(--line);font:400 14.5px/1.5 var(--serif);color:var(--ink)}
.grp h2{scroll-margin-top:70px}
</style>`)}
</head>
<body>
<div class="wrap">
<header>
  <div class="eyebrow"><a href="/" style="color:inherit;text-decoration:none">Planning Distilled</a> &rsaquo; <a href="/research/" style="color:inherit;text-decoration:none">Research</a> &rsaquo; <a href="/research/england/" style="color:inherit;text-decoration:none">England</a> &rsaquo; <a href="${navUrl}" style="color:inherit;text-decoration:none">NPPF 2026 Navigator</a> &rsaquo; <a href="${methodUrl}" style="color:inherit;text-decoration:none">Method</a> &rsaquo; Sources</div>
  <h1>Published guidance on the August 2026 NPPF: all ${n} sources</h1>
  <p class="dek">Every source reviewed for the Navigator's cross-references, snapshot ${snap.long}: who published it, what it says, and where it stands on the nine propositions the Navigator rests on.</p>
  <p style="margin-top:12px"><a class="back" href="${methodUrl}">&larr; Back to Method &amp; cross-references</a></p>
</header>
<main>
<p class="banner"><strong>How to read this page.</strong> Links go to the publisher; some pages have since moved or sit behind paywalls. "Draft" marks material about the December 2025 consultation draft, not the published Framework. Stances are after an adversarial check of every disagreement and qualification; most sources are silent on most propositions. Quotations are shown only where they matched a saved copy of the source word for word. Summaries are ours. What the review found, and what it changed, is in <a href="${methodUrl}#guidance">section 2 of the method page</a>. Download: <a href="sources.csv">CSV</a> · <a href="sources.json">JSON</a>.</p>
<p class="toc">${toc}</p>
<div class="filter"><input id="f" type="search" placeholder="Filter by publisher, title or topic" aria-label="Filter sources"><select id="p" aria-label="Filter by proposition"><option value="">Any proposition</option>${Object.entries(PROP_NAMES).map(([k, v]) => `<option value="${k}">${k}: ${esc(v)}</option>`).join('')}</select><span class="q" id="c" aria-live="polite">${n} shown</span></div>
${groups}
</main>
<footer>Prepared by Planning Distilled. Summaries are ours; quotations are from the publishers' pages and documents as saved on or before ${snap.long}. Generated ${asOf}. Not legal advice.
<p class="licence">&copy; Planning Distilled. Text and data on this page are released under the <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 licence</a>: share and adapt them freely, with credit to Planning Distilled. Quotations remain the copyright of their publishers. Source and data: <a href="https://github.com/planningdistilled/research">github.com/planningdistilled/research</a>.</p>
</footer>
</div>
<script>
(function () {
  var f = document.getElementById('f'), p = document.getElementById('p'), c = document.getElementById('c');
  var cards = [].slice.call(document.querySelectorAll('.srcc')), groups = [].slice.call(document.querySelectorAll('.grp'));
  function run() {
    var t = f.value.trim().toLowerCase(), q = p.value, k = 0;
    cards.forEach(function (e) {
      var ok = (!t || (e.__t || (e.__t = e.textContent.toLowerCase())).indexOf(t) >= 0) && (!q || e.getAttribute('data-p').split(' ').indexOf(q) >= 0);
      e.hidden = !ok; if (ok) k++;
    });
    groups.forEach(function (g) { g.hidden = !g.querySelector('.srcc:not([hidden])'); });
    c.textContent = k + ' shown';
  }
  f.addEventListener('input', run); p.addEventListener('change', run);
})();
</script>
</body>
</html>
`;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), addAnchors(html));
  const pub = sources.map((s) => ({ title: s.title, url: s.url, publisher: s.publisher, publisher_type: s.type, date: s.date || null, audience: s.audience, about_draft: s.draft, training_or_briefing: s.training, retrieval: VER[s.verification] ?? s.verification, stances: Object.fromEntries(s.stances.map(([p, x]) => [p, STANCE[x]])), summary: s.summary || null }));
  writeFileSync(join(outDir, 'sources.json'), JSON.stringify({ snapshot: snap.iso, licence: 'CC BY 4.0, Planning Distilled', propositions: PROP_NAMES, sources: pub }, null, 1));
  const csvq = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const head = ['title', 'url', 'publisher', 'publisher_type', 'date', 'about_draft', 'training_or_briefing', 'retrieval', ...Object.keys(PROP_NAMES)];
  writeFileSync(join(outDir, 'sources.csv'), [head.join(','), ...pub.map((s) => [s.title, s.url, s.publisher, s.publisher_type, s.date, s.about_draft, s.training_or_briefing, s.retrieval, ...Object.keys(PROP_NAMES).map((k) => s.stances[k] ?? '')].map(csvq).join(','))].join('\n') + '\n');
  return html.length;
}

// Give every h2–h4 an id (kept if already set) and a "#" link, so any heading can be linked to.
// Headings that are themselves links (source titles on the sources page) are left alone.
export function addAnchors(html) {
  const used = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const slug = (t) => {
    let s = t.replace(/<[^>]+>/g, '').replace(/\([^)]*\)/g, '').replace(/&[a-z]+;|&#\d+;/g, ' ').replace(/^\s*\d+(\.\d+)*\.?\s+/, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60).replace(/-$/, '') || 'section';
    let u = s, i = 2;
    while (used.has(u)) u = `${s}-${i++}`;
    used.add(u);
    return u;
  };
  const css = `.anchor{margin-left:.35em;color:var(--muted);text-decoration:none;font-weight:400;opacity:0}
h2:hover>.anchor,h3:hover>.anchor,h4:hover>.anchor,.anchor:focus-visible{opacity:1}
@media (hover:none){.anchor{opacity:.45}}
h2[id],h3[id],h4[id]{scroll-margin-top:16px}
h2:target,h3:target,h4:target{background:var(--accent-soft);border-radius:4px}
</style>`;
  return html.replace('</style>', css).replace(/<(h[234])((?:\s[^>]*)?)>([\s\S]*?)<\/\1>/g, (all, tag, attrs, inner) => {
    if (/<a\s/.test(inner)) return all;
    const m = attrs.match(/\sid="([^"]+)"/);
    const id = m ? m[1] : slug(inner);
    return `<${tag}${m ? attrs : `${attrs} id="${id}"`}>${inner}<a class="anchor" href="#${id}" aria-label="Link to this section">#</a></${tag}>`;
  });
}
