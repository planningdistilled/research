// Stratford Core Strategy under the 2026 NPPF: which policies keep their weight.
//   node pages/authority/stratford-dc/core-strategy-weight/build.mjs   (writes into main-site; needs ../sources)
import fs from 'node:fs';
import path from 'node:path';
import { SITE } from '../../../../paths.mjs';
import { card, caseById, caseLink, check, esc, hasReport, page, quote, reportsMatching } from '../../../_shared/policy-weight.mjs';

const SITE_PATH = 'research/authority/stratford-dc/core-strategy-weight/';
const URL = 'https://planningdistilled.org/' + SITE_PATH;
const CS_URL = 'https://www.stratford.gov.uk/planning-building/core-strategy.cfm';

// Every Stratford officer report in the decisions database decided under the August 2026 Framework.
const SDC = [...caseById.values()].filter((c) => c.case_id.startsWith('stratford-') && c.nppf_applied === '2026-08').map((c) => c.case_id).filter(hasReport);
const fs_ = (ids) => ids.length;
const list = (ids) => ids.map(caseLink).join(', ');
const also = (label, ids) => `<p class="also">${esc(label)} ${fs_(ids)} report${ids.length === 1 ? '' : 's'}: ${list(ids)}.</p>`;
const NPPF = (code) => `NPPF, ${code}`;
const CS = (p) => `<a href="${CS_URL}">Core Strategy</a>, ${p}`;
const SDCq = (id, p) => `${caseLink(id)}, officer report p.${p}`;

const cs2 = reportsMatching(SDC, /policy cs\.2 and spd parts d[^.]{0,40}(considered to be|are) materially consistent/);
const cs4 = reportsMatching(SDC, /cs\.4 of the core strategy (and [^.]{0,60})?(is|are) materially consistent/);
const cs6 = reportsMatching(SDC, /cs\.6 of the core strategy (and [^.]{0,60})?(is|are) (considered to be )?materially consistent/);
const cs9 = reportsMatching(SDC, /policy cs\.9[^.]{0,40} (is|are) materially consistent with ndmp l\b/);
const cs8 = reportsMatching(SDC, /cs\.8 (of the cs )?(and [a-z0-9. ]{0,30})?(is|are) materially inconsistent|cs\.8 does not align/);
const cs10no = reportsMatching(SDC, /policy cs\.10 (and policy h3 of the ndp )?is materially inconsistent/);
const loc = reportsMatching(SDC, /policies cs\.15(, cs\.16| and cs\.16)?(, cs\.20)?( and as\.? ?10)? (very limited weight|.{0,160}?materially inconsistent)/);
const cs26 = reportsMatching(SDC, /policy cs\.26 is materially inconsistent/);

const rule = `<section id="rule"><h2>The rule: consistency, not age</h2>
<div class="rule">
${quote('nppf', 'Development plan policies (or parts of those policies) which are materially inconsistent with national decision-making policies in this Framework should be given very limited weight. The only exception to this is where they have been examined and adopted or made against this Framework. Other development plan policies should not be given reduced weight simply because they were adopted prior to the publication of this Framework.', NPPF('Annex A(2)'))}
<p>The Stratford-on-Avon Core Strategy was adopted in July 2016, long before the August 2026 Framework. Its age alone does not reduce its weight. What matters is whether each policy, or the part of it in play, is materially inconsistent with the Framework's national decision-making policies. Annex A(2) works policy by policy, and part by part.</p>
<p>Since 17 August 2026 the Council's own officer reports have said, policy by policy, which Core Strategy policies they consider consistent. This page collects those statements from the ${SDC.length} Stratford reports in the <a href="/research/england/nppf-navigator/decisions/">decisions database</a> that apply the new Framework.</p>
</div></section>`;

const consistent = `<section id="consistent"><h2>Policies the Council's own reports treat as consistent</h2>
<div class="policies">
${card({ code: 'CS.2', name: 'Climate Change and Sustainable Construction', status: 'consistent', body: `
${quote('cs', 'Proposals for development will be required to demonstrate that, dependent on their scale, use and location, measures are included that mitigate and adapt to the impacts of climate change.', CS('Policy CS.2(A)'))}
${quote('case:stratford-26-01614-FUL', 'Policy CS.2 and SPD Parts D, Q and V support this stance and are therefore considered to be materially consistent with the NPPF.', SDCq('stratford-26-01614-FUL', 5), 5)}
${also('Held materially consistent in', cs2)}` })}
${card({ code: 'CS.4', name: 'Water Environment and Flood Risk', status: 'consistent', body: `
${quote('cs', "All development proposals will take into account, dependent on their scale, use and location, the predicted impact of climate change on the District's water environment.", CS('Policy CS.4'))}
${quote('case:stratford-26-01660-OUT', 'Water Environment and Flood Risk Policy CS.4 of the Core Strategy is materially consistent with the NPPF because it seeks to direct development away from areas at highest risk of flooding, ensure that flood risk is properly assessed, and require suitable drainage measures to avoid increasing flood risk elsewhere.', SDCq('stratford-26-01660-OUT', 8), 8)}
${also('Held materially consistent in', cs4)}` })}
${card({ code: 'CS.5', name: 'Landscape', status: 'consistent', body: `
${quote('cs', 'The landscape character and quality of the District will be maintained by ensuring that development takes place in a manner that minimises and mitigates its impact and, where possible, incorporates measures to enhance the landscape.', CS('Policy CS.5'))}
${quote('case:stratford-26-01141-FUL', 'When evaluating the requirements of the NPPF in respect to conserving, enhancing, protecting and achieving well designed places, I am satisfied that Core Strategy Policies, in this case CS.5, CS.9 and CS.12, are materially consistent with the requirements of the NPPF.', SDCq('stratford-26-01141-FUL', 9), 9)}
<p>Other reports rely on CS.5 against a scheme without reducing its weight. At Ladbroke the officer identified "Policy conflicts with CS.5 and CS.9 of the Core Strategy in respect of character and landscape harm" and gave that harm significant weight (${caseLink('stratford-26-01660-OUT')}, p.12). At Pillerton Priors a scheme "would not accord with NDMPs DP3 and N2 and Policies CS.5 and CS.9 of the Core Strategy" (${caseLink('stratford-26-01894-PIP')}, p.12).</p>` })}
${card({ code: 'CS.6', name: 'Natural Environment', status: 'consistent', body: `
${quote('cs', 'Development will be expected to contribute towards a resilient ecological network throughout the District that supports ecosystems and provides ecological security for wildlife, people, the economy and tourism.', CS('Policy CS.6'))}
${quote('case:stratford-26-01894-PIP', 'Accordingly, I consider that Policy CS.6 of the Core Strategy is materially consistent with the relevant biodiversity and ecological protection requirements of the Framework.', SDCq('stratford-26-01894-PIP', 15), 15)}
${also('Held materially consistent in', cs6)}` })}
${card({ code: 'CS.9', name: 'Design and Distinctiveness', status: 'consistent', body: `
${quote('cs', 'All forms of development will improve the quality of the public realm and enhance the sense of place, reflecting the character and distinctiveness of the locality.', CS('Policy CS.9(A)'))}
${quote('case:stratford-26-01614-FUL', 'I am satisfied that Policy CS.9 of the Core Strategy is consistent with both L2(d) and DP3.', SDCq('stratford-26-01614-FUL', 4), 4)}
<p>On design, see also the Hill, Warwick Road report quoted under CS.5 (${caseLink('stratford-26-01141-FUL')}, p.9). On residential amenity, most reports use a standard sentence: CS.9 "is materially consistent with NDMP L2".</p>
${also('Held materially consistent with L2 (amenity) in', cs9)}` })}
${card({ code: 'CS.12', name: 'Special Landscape Areas', status: 'consistent', body: `
${quote('cs', 'The high landscape quality of the Special Landscape Areas, including their associated historic and cultural features, will be protected by resisting development proposals that would have a harmful effect on their distinctive character and appearance', CS('Policy CS.12'))}
<p>Held materially consistent, with CS.5 and CS.9, in the Hill, Warwick Road report (${caseLink('stratford-26-01141-FUL')}, p.9). At Tanworth-in-Arden the officer found harm that "conflicts with Core Strategy Policies CS.5, CS.9 and CS.12 and NDP Policy BE1" and weighed it against the scheme (${caseLink('stratford-26-00918-PIP')}, p.20).</p>` })}
</div></section>`;
check('case:stratford-26-01660-OUT', 'Policy conflicts with CS.5 and CS.9 of the Core Strategy in respect of character and landscape harm', 12);
check('case:stratford-26-01894-PIP', 'would not accord with NDMPs DP3 and N2 and Policies CS.5 and CS.9 of the Core Strategy', 12);
check('case:stratford-26-00918-PIP', 'conflicts with Core Strategy Policies CS.5, CS.9 and CS.12 and NDP Policy BE1', 20);
check('case:stratford-26-01141-FUL', 'CS.5, CS.9 and CS.12, are materially consistent', 9);

const disputed = `<section id="disputed"><h2>Where the Council's reports disagree, or are open to challenge</h2>
<div class="policies">
${card({ code: 'CS.8', name: 'Historic Environment', status: 'contested', body: `
<p>The Council's reports usually call CS.8 materially inconsistent, because the new Framework's HE5 sets out how effects on heritage assets should be assessed.</p>
${quote('case:stratford-26-00617-PIP', 'Considering that NDMP HE5 (Assessing effects on heritage assets) provides a new set of criteria for assessments of the potential effects on development proposals on the significance of heritage assets which is not required within CS.8 of the CS and BE7 of the NDP, I consider that CS.8 and BE7 are materially inconsistent with the NDMPs of the Framework.', SDCq('stratford-26-00617-PIP', 15), 15)}
<p>But the test CS.8 actually applies to less than substantial harm is the Framework's test:</p>
${quote('cs', 'Where a development proposal will lead to less than substantial harm to the significance of a designated heritage asset, this harm must be justified and weighed against the public benefits of the proposal, including securing its optimum viable use.', CS('Policy CS.8(B)'))}
${quote('nppf', 'Where a development proposal would harm the significance of a designated heritage asset the effect on the asset and its significance should be weighed against any public benefits resulting from the proposal.', NPPF('HE6(4)'))}
<p>Only the label ("less than substantial") is older. HE5 adds detail to how effects are assessed; it does not contradict CS.8's weighing. A report that gives CS.8 limited weight should say which words of it conflict with the Framework.</p>
${also('Held materially inconsistent, or not aligned, in', cs8)}` })}
${card({ code: 'CS.10', name: 'Green Belt', status: 'contested', body: `
${quote('cs', 'The purposes of the Green Belt will be upheld by resisting inappropriate development within it, except in cases where very special circumstances are justified in accordance with the provisions of national policy.', CS('Policy CS.10'))}
<p>Housing reports call CS.10 materially inconsistent because it predates grey belt and the Golden Rules (GB7, GB8). Other reports say it aligns:</p>
${quote('case:stratford-26-01614-FUL', 'These elements of GB6 and GB7 are considered to be materially consistent with policy CS.10 of the Core Strategy.', SDCq('stratford-26-01614-FUL', 3), 3)}
${also('Held materially inconsistent in', cs10no)}
<p>The difference rarely matters: the Framework's GB6 to GB8 apply directly either way.</p>` })}
${card({ code: 'CS.22', name: 'Economic Development', status: 'contested', body: `
${quote('case:stratford-25-01765-FUL', 'CS.22 is materially consistent with the requirements of the NPPF by being flexible to accommodate business needs not anticipated in the plan and therefore meeting the requirements of policy E2 (Meeting the Need for Business Land and Premises) in the NPPF.', SDCq('stratford-25-01765-FUL', 20), 20)}
${quote('case:stratford-25-01765-FUL', 'As CS.22 does not specifically plan for such development it needs to be considered as being not consistent in relation to these matters.', SDCq('stratford-25-01765-FUL', 20), 20)}
<p>"Such development" refers to the commercial development E2 gives substantial weight to, including proposals supporting the Industrial Strategy. The report holds CS.22 consistent in general and not consistent on that point.</p>` })}
${card({ code: 'CS.20 and AS.10', name: 'Existing Housing Stock; Countryside and Villages', status: 'contested', body: `
<p>These policies are split. Their amenity requirements are treated as consistent:</p>
${quote('case:stratford-26-01558-FUL', 'I am satisfied that Policy CS.9, AS.10 and CS.20 are materially consistent with NDMP L2 set out in the Framework', SDCq('stratford-26-01558-FUL', 9), 9)}
<p>Their restrictions on where development may go are treated as inconsistent (see below).</p>` })}
</div></section>`;

const conflict = `<section id="conflict"><h2>Policies the Council's reports treat as in conflict</h2>
<div class="policies">
${card({ code: 'CS.15, CS.16 and AS.10', name: 'Distribution of Development; Housing Development; Countryside and Villages (location restraint)', status: 'conflict', body: `
${quote('case:stratford-26-00617-PIP', 'On this basis, and having regard to the fact that the NDMPs in Chapter 4 of the NPPF allow for forms of development that would not be supported by Policies CS.15, CS.16 and AS.10 in principle, including where there is an evidenced unmet need, as highlighted in NDMP S5.1.j, I consider that these Core Strategy policies are materially inconsistent with the relevant NDMPs.', SDCq('stratford-26-00617-PIP', 8), 8)}
${also('Given very limited weight in', loc)}` })}
${card({ code: 'CS.26', name: 'Transport and Communications', status: 'conflict', body: `
${quote('case:stratford-26-00617-PIP', 'Policy CS.26 does not include the same express requirement to refuse development where severe adverse transport impacts would arise. I therefore consider that Policy CS.26 is materially inconsistent with the relevant requirements of the Framework and afford it very limited weight.', SDCq('stratford-26-00617-PIP', 17), 17)}
${also('Held materially inconsistent in', cs26)}
<p>This concerns highway impacts. Whether a location is sustainable is a separate question, answered by the Framework's TR3 directly.</p>` })}
</div></section>`;

const untested = `<section id="untested"><h2>Not yet rated</h2>
<p class="note">None of the reports in the database rates the remaining Core Strategy policies against the new Framework: CS.1, CS.3, CS.7, CS.11, CS.13, CS.14, CS.17 to CS.19, CS.21, CS.23 to CS.25, CS.27, and the area strategies AS.1 to AS.9 and AS.11. That is not a finding that they conflict. Under Annex A(2) they keep their weight unless shown to be materially inconsistent.</p></section>`;

const html = page({
  title: 'Stratford Core Strategy and the 2026 NPPF',
  description: "Which Stratford-on-Avon Core Strategy policies keep their weight under the August 2026 NPPF, policy by policy, in the Council's own words: CS.2, CS.4, CS.5, CS.6, CS.9 and CS.12 held consistent; CS.8, CS.10 and CS.22 disputed; CS.15, CS.16, AS.10 and CS.26 held inconsistent. Every quotation checked against the officer reports.",
  url: URL,
  breadcrumb: '<a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/authority/">Local planning authorities</a> › <a href="/research/authority/stratford-dc/">Stratford-on-Avon</a> › Core Strategy policies',
  h1: 'Which Stratford Core Strategy policies keep their weight under the 2026 NPPF',
  dek: "The Council's own officer reports since 17 August 2026, policy by policy. Policies they treat as consistent come first; disputed and conflicting policies follow.",
  body: rule + consistent + disputed + conflict + untested,
  sources: [
    `<a href="${CS_URL}">Stratford-on-Avon District Core Strategy 2011–2031</a> (adopted July 2016).`,
    'National Planning Policy Framework, August 2026: Annex A(2), HE6(4).',
    `Stratford-on-Avon District Council officer reports, 17 August to 2 October 2026 (${SDC.length} in the <a href="/research/england/nppf-navigator/decisions/">decisions database</a>; each linked above).`,
    'See also the <a href="/research/authority/stratford-dc/nppf-2026-decisions/">note on Stratford decisions under the 2026 NPPF</a> and the <a href="/research/settlement/claverdon/neighbourhood-plan-weight/">Claverdon Neighbourhood Plan policies</a>.',
  ],
  credit: 'Prepared by Planning Distilled.',
});
const out = path.join(SITE, SITE_PATH);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`✓ ${SITE_PATH}: CS.2 ${cs2.length}, CS.4 ${cs4.length}, CS.6 ${cs6.length}, CS.9 ${cs9.length}, CS.8 ${cs8.length}, CS.10 ${cs10no.length}, location ${loc.length}, CS.26 ${cs26.length}`);
