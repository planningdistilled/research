// Claverdon Neighbourhood Plan under the 2026 NPPF: which policies keep their weight.
//   node pages/settlement/claverdon/neighbourhood-plan-weight/build.mjs   (writes into main-site; needs ../sources)
import fs from 'node:fs';
import path from 'node:path';
import { SITE } from '../../../../paths.mjs';
import { card, caseLink, check, page, quote } from '../../../_shared/policy-weight.mjs';

const SITE_PATH = 'research/settlement/claverdon/neighbourhood-plan-weight/';
const URL = 'https://planningdistilled.org/' + SITE_PATH;
const NP_URL = 'https://claverdon-pc.gov.uk/wp-content/uploads/2024/09/Claverdon-Neighbourhood-Plan.pdf';
const NP = (policy, p) => `<a href="${NP_URL}#page=${p}">Claverdon Neighbourhood Plan, ${policy} (p.${p})</a>`;
const NPPF = (code) => `NPPF, ${code}`;
const SDCq = (id, p) => `${caseLink(id)}, officer report p.${p}`;
const q = quote;

const rule = `<section id="rule"><h2>The rule: consistency, not age</h2>
<div class="rule">
${q('nppf', 'Development plan policies (or parts of those policies) which are materially inconsistent with national decision-making policies in this Framework should be given very limited weight. The only exception to this is where they have been examined and adopted or made against this Framework. Other development plan policies should not be given reduced weight simply because they were adopted prior to the publication of this Framework.', NPPF('Annex A(2)'))}
${q('nppf', 'Including policies in made neighbourhood plans.', NPPF('Annex A, footnote 67, on "Other development plan policies"'))}
<p>The Claverdon Neighbourhood Plan was made in December 2019. Its age does not reduce its weight. Each policy, or part of a policy, keeps its weight unless it is materially inconsistent with the Framework's national decision-making policies.</p>
<p>The plan's age matters in one place only. S6 gives extra protection to recent neighbourhood plans:</p>
${q('nppf', 'For development proposals involving the provision of housing, the benefits of approving development are likely to be substantially outweighed by the adverse effects where a proposal would conflict with a neighbourhood plan, provided the following apply:', NPPF('S6(1)'))}
<p>The conditions are that the plan was made five years or less before the decision, and that it allocates sites to meet its housing requirement. Claverdon's plan was made more than five years ago and allocates no sites, so S6 does not apply. That removes the extra protection only. The plan remains part of the development plan, and its consistent policies keep their full weight.</p>
<p>Stratford-on-Avon District Council has not yet rated the Claverdon plan against the new Framework. Where it has rated similar policies in other villages' plans, its words are quoted below. For the Council's view of its own Core Strategy, see <a href="/research/authority/stratford-dc/core-strategy-weight/">which Core Strategy policies keep their weight</a>.</p>
</div></section>`;

const consistent = `<section id="consistent"><h2>Policies that keep their weight</h2>
<div class="policies">
${card({ code: 'BE1', name: 'Principles of Good Design', status: 'consistent', body: `
${q('np', 'All development proposals must demonstrate how the Village Design Statement (VDS), presented in Appendix 1, has been taken into account in the design.', NP('Policy BE1', 29))}
${q('nppf', 'Development proposals should be refused if, without clear justification, they conflict with paragraph 1 of this policy or relevant aspects of the principles in paragraph 2, or with any explicit design standards set out in the development plan (including those in locally-specific policies, guides, codes or masterplans).', NPPF('DP3(3)'))}
<p>The Framework does more than tolerate local design policies: DP3(3) builds them in. The Council has treated village design policies as consistent: at Snitterfield "both the Core Strategy and the Neighbourhood Development Plan Policies, and the policies contained therein, are materially consistent with the requirements of the NPPF" (${caseLink('stratford-26-00617-PIP')}, p.13), and at Tanworth-in-Arden it weighed a conflict with that plan's BE1 against the scheme (${caseLink('stratford-26-00918-PIP')}, p.20).</p>` })}
${card({ code: 'NE2', name: 'Flooding and Drainage', status: 'consistent', body: `
${q('np', 'Development proposals will be supported where they utilise sustainable drainage systems, including those that achieve landscape or biodiversity enhancement, and demonstrate they will not result in on-site or off-site flooding.', NP('Policy NE2', 24))}
${q('nppf', 'Development proposals should not present a risk from flooding to potential occupiers, users, or visitors, and should not increase flood risk elsewhere.', NPPF('F7(1)'))}
${q('case:stratford-26-00617-PIP', 'Flood Risk and Drainage Policy CS.4 of the Core Strategy and Policy IN2 of the Snitterfield NDP are materially consistent with the NPPF', SDCq('stratford-26-00617-PIP', 17), 17)}` })}
${card({ code: 'NE5', name: 'Conserving the Natural Environment', status: 'partly', body: `
${q('np', 'To be supported, development proposals must not harm biodiversity and must provide net gains for biodiversity unless it can be demonstrated this is not possible or is not viable.', NP('Policy NE5', 28))}
${q('nppf', 'Consider the environmental qualities of land proposed for development, including habitats, landscape character and the natural beauty of the countryside, and identify opportunities for those qualities to be conserved or enhanced (including through requirements for biodiversity net gain where these apply);', NPPF('N2(1)(a)'))}
<p>Net gain and new hedge and tree planting match the Framework (N2, N3 and DP3(2)(c)). "Must not harm biodiversity" is stricter than N2's wording, so that phrase may be read down. The Council has held village ecology policies consistent: at Snitterfield, "Policies NE1 and NE2 of the Snitterfield NDP are materially consistent with the relevant biodiversity and ecological protection requirements of the Framework" (${caseLink('stratford-26-00617-PIP')}, p.18).</p>` })}
${card({ code: 'NE4', name: 'Designated Local Green Space', status: 'consistent', body: `
${q('np', 'This Plan designates the following areas of Local Green Space as defined on Figure 4 where development will be ruled out other than in very special circumstances', NP('Policy NE4', 25))}
${q('nppf', 'Development proposals for land which has been designated as Local Green Space should be determined in a manner consistent with the relevant national decision-making policies for land in the Green Belt, excluding provisions relating to grey belt and previously developed land.', NPPF('HC8(1)'))}` })}
${card({ code: 'CSL1', name: 'Community Facilities', status: 'consistent', body: `
${q('np', 'The loss or partial loss of existing community facilities will be not be supported unless it can be demonstrated that the facility is no longer in active use and has no prospect of being brought back into use or is to be replaced by a new facility of at least an equivalent standard in no less convenient location for users.', NP('Policy CSL1', 31))}
${q('nppf', 'Development proposals should not result in the loss of key community facilities and public service infrastructure unless:', NPPF('HC6(1)'))}
<p>The tests match HC6(1)(a) and (b). HC6 adds a third route, where there is enough alternative provision locally, which CSL1 does not mention.</p>` })}
${card({ code: 'CSL2', name: 'Sports and Leisure Facilities', status: 'consistent', body: `
${q('np', 'Proposals resulting in loss of open space, sports and recreational buildings and land including playing fields will only be supported if it is demonstrated they are surplus to requirements or they will be replaced by equivalent or better provision in no less convenient location to users.', NP('Policy CSL2', 32))}
${q('nppf', 'Development proposals should not result in the loss of existing open space, sports and recreational buildings and land, including playing fields, other formal and informal play space and allotments, unless:', NPPF('HC7(1)'))}` })}
${card({ code: 'H2', name: 'Meeting Local Housing Needs', status: 'consistent', body: `
${q('np', 'Small-scale community-led housing schemes on sites beyond, but reasonably adjacent to, the defined Village Boundary of Claverdon or the part of the built-up area of Norton Lindsey within the Neighbourhood Area, will be supported where all the following criteria are satisfied', NP('Policy H2', 11))}
${q('nppf', 'A rural exception site (as defined in the glossary at Annex B) that will provide affordable housing to meet identified local needs – as evidenced through a local housing needs survey or secondary data which is no more than five years old; or', NPPF('HO10(1)(a)'))}` })}
${card({ code: 'H3', name: 'Use of Brownfield Land', status: 'consistent', body: `
${q('np', 'The redevelopment of brownfield land to create new housing will be supported subject to the following criteria', NP('Policy H3', 12))}
${q('nppf', 'The redevelopment of previously developed land (including a material change of use to residential or mixed-use including residential), which would not cause substantial harm to the openness of the Green Belt;', NPPF('GB7(1)(e)'))}
<p>H3 supports what the Framework supports, with criteria on compatibility, contamination, character and the Green Belt. Policies called H3 in other villages' plans (Tanworth-in-Arden, for example) are housing-boundary policies and are treated differently; Claverdon's is not.</p>` })}
${card({ code: 'E2 and E3', name: 'New Employment Opportunities; Home-Based Working', status: 'consistent', body: `
${q('np', 'The development of new local employment opportunities will be supported providing they:', NP('Policy E2', 16))}
${q('nppf', 'In applying policy E2, the sustainable growth of businesses in rural areas should be supported, including through:', NPPF('E4(1)'))}
<p>Both policies support rural business and home working, subject to amenity and Green Belt policy, as the Framework does.</p>` })}
${card({ code: 'E4 and E5', name: 'High Speed Broadband; Telecommunications', status: 'consistent', body: `
${q('np', 'New or enhanced telecommunications development will be supported subject to the following factors:', NP('Policy E5', 17))}
${q('nppf', 'In considering proposals for the expansion or upgrading of electronic telecommunications networks, substantial weight should be given to the benefits of maintaining or improving network coverage, capacity, reliability and resilience, including where significant improvements are required such as along rail corridors.', NPPF('CO1(1)'))}
<p>E5's factors (mast sharing, siting, emissions guidelines and interference) are the matters CO1(1)(a) to (d) list.</p>` })}
</div></section>`;

const lower = `<section id="contested"><h2>Policies open to challenge</h2>
<div class="policies">
${card({ code: 'BE2', name: 'Heritage Assets', status: 'contested', body: `
<p>Most of BE2 matches the Framework: it requires an assessment of harm to significance (HE5(1)), and it weighs harm against public benefits:</p>
${q('np', 'Proposals which lead to less than substantial harm to the significance of a designated heritage asset will be considered against the public benefits of the proposal including securing the optimum viable use of the heritage asset.', NP('Policy BE2', 30))}
${q('nppf', 'Where a development proposal would harm the significance of a designated heritage asset the effect on the asset and its significance should be weighed against any public benefits resulting from the proposal.', NPPF('HE6(4)'))}
<p>One sentence goes further than the Framework, which weighs harm against benefits (HE6(4)) and asks conservation-area proposals to "Retain and conserve" positive features "where possible" (HE9(1)(a)):</p>
${q('np', 'Development which fails to conserve or enhance the character or appearance of the Conservation Areas will not be supported.', NP('Policy BE2', 30))}
<p>The Council has also downgraded heritage policies in other villages' plans, on the ground that HE5 sets new assessment criteria:</p>
${q('case:stratford-26-01399-PIP', 'I consider that CS.8 and HA.1 are materially inconsistent with the NDMPs of the Framework.', SDCq('stratford-26-01399-PIP', 5), 5)}
<p>That reasoning does not hold for BE2's weighing sentence, which applies the same test as HE6(4) under an older label. The outright Conservation Area sentence is the part most at risk.</p>` })}
${card({ code: 'NE1', name: 'Valued Landscapes', status: 'contested', body: `
${q('np', 'Proposals that will have a significant adverse impact on the valued landscapes and views identified on Figure 3, where seen from locations to which the general public have free and unrestricted access, will not be supported.', NP('Policy NE1', 19))}
<p>The 2026 Framework has no express protection for "valued landscapes". Its nearest policies are N2(1)(a), which asks proposals to consider landscape character and conserve or enhance it, and DP3(1) on context. NE1's requirement to "demonstrate regard to landscape character" fits those. Its outright bar on significant adverse impacts could be read as stricter. The Council has not yet rated a valued-landscape policy against the new Framework.</p>` })}
${card({ code: 'H4', name: 'Use of Garden Land', status: 'partly', body: `
${q('np', 'Development on garden land within the defined Village Boundary, as defined on Figure 1, will only be supported if it can be demonstrated that proposals: a) Preserve or enhance the character of its surroundings; b) Will not introduce a form of development which is at odds with the existing settlement character or pattern;', NP('Policy H4', 13))}
${q('nppf', 'Creating additional homes or floorspace within settlements by using the airspace above existing residential and commercial premises, or through sensitive redevelopment or additional development within existing plots', NPPF('L2(1)(d)'))}
<p>H4's criteria on character, amenity and access echo L2(1)(d)(i) and (ii). But L2 gives such schemes substantial weight "within settlements", and Annex B excludes villages washed over by the Green Belt from "settlements", so how L2 applies in Claverdon is itself unsettled.</p>` })}
${card({ code: 'E1', name: 'Protecting and Enhancing Existing Employment Sites', status: 'contested', body: `
${q('np', 'Proposals for the change of use or redevelopment of land or premises identified for or currently in employment use will only be supported where:', NP('Policy E1', 14))}
<p>The Framework's decision-making policies support business growth (E2, E4) but contain no matching protection for existing employment land. E1 has not been tested.</p>` })}
${card({ code: 'NE3', name: 'Renewable Energy', status: 'partly', body: `
${q('np', 'Development proposals relating to the production of renewable energy will be supported where there are no significant adverse landscape or other visual impacts.', NP('Policy NE3', 24))}
${q('nppf', 'In considering proposals for renewable and low-carbon energy development and electricity network infrastructure, substantial weight should be given to:', NPPF('W3(1)'))}
<p>Both support renewable energy. The Framework weighs its benefits; NE3 makes support conditional on no significant landscape or visual harm, which a decision-maker may treat as a weighing rather than a bar.</p>` })}
</div></section>
<section id="conflict"><h2>Policies likely to get very limited weight</h2>
<div class="policies">
${card({ code: 'H1', name: 'Housing Development Strategy', status: 'conflict', body: `
${q('np', 'Proposals for new housing will not be supported outside the Village Boundary except development in accordance with Policy H2; or under the special circumstances set out in Paragraph 55 of the National Planning Policy Framework (2012), and subject to Green Belt policy.', NP('Policy H1', 8))}
<p>The Framework allows some housing outside settlements and, in the Green Belt, on grey belt land (S5(1)(j), GB7(1)(g)), so a blanket boundary restriction is likely to be held materially inconsistent. H1 also refers to the 2012 Framework. The Council has given village housing-boundary policies very limited weight in every report that rates them:</p>
${q('case:stratford-26-00617-PIP', 'Accordingly, I afford NDP Policy H1 very limited weight in the determination of this application.', SDCq('stratford-26-00617-PIP', 9), 9)}
${q('case:stratford-26-00918-PIP', 'Accordingly, I afford NDP Policy H3 very limited weight in the determination of this application.', SDCq('stratford-26-00918-PIP', 8), 8)}
<p>This matters less than it seems. In the Green Belt the test is GB6 and GB7, which apply directly. See the <a href="/research/settlement/claverdon/station-road-decision-route/">Station Road Decision Route</a>.</p>` })}
</div></section>`;

// Quotations in running text.
check('case:stratford-26-00617-PIP', 'both the Core Strategy and the Neighbourhood Development Plan Policies, and the policies contained therein, are materially consistent with the requirements of the NPPF', 13);
check('case:stratford-26-00617-PIP', 'Policies NE1 and NE2 of the Snitterfield NDP are materially consistent with the relevant biodiversity and ecological protection requirements of the Framework', 18);
check('case:stratford-26-00918-PIP', 'conflicts with Core Strategy Policies CS.5, CS.9 and CS.12 and NDP Policy BE1', 20);
check('nppf', 'Retain and conserve buildings and other features which make a positive contribution to the character or appearance of the conservation area where possible');
check('nppf', 'Creating additional homes or floorspace within settlements');
check('np', 'To be supported, development proposals must demonstrate regard to landscape character.');
check('nppf', 'For the purpose of this Framework they also exclude villages which lie within and are defined as part of the Green Belt in the development plan.');

const html = page({
  title: 'Claverdon Neighbourhood Plan and the 2026 NPPF',
  description: 'Which policies of the Claverdon Neighbourhood Plan (made December 2019) keep their weight under the August 2026 NPPF: design (BE1), flooding (NE2), ecology (NE5), Local Green Space, community facilities, local housing need and brownfield policies do; heritage (BE2) and valued landscapes (NE1) are open to challenge; the housing boundary (H1) is likely to get very limited weight.',
  url: URL,
  breadcrumb: '<a href="/">Planning Distilled</a> › <a href="/research/">Research</a> › <a href="/research/settlement/">Settlements</a> › <a href="/research/settlement/claverdon/">Claverdon</a>',
  h1: 'Which Claverdon Neighbourhood Plan policies keep their weight under the 2026 NPPF',
  dek: 'Each policy of the made plan against the August 2026 Framework. Policies that keep their weight come first; those open to challenge or likely to lose weight follow.',
  body: rule + consistent + lower,
  sources: [
    `<a href="${NP_URL}">Claverdon Neighbourhood Plan 2011–2031, made version, December 2019</a> (Claverdon Parish Council).`,
    'National Planning Policy Framework, August 2026: Annex A(2) and footnote 67, S6, DP3, F7, N2, HC6 to HC8, HO10, GB7, E4, CO1, W3, HE6, HE9, L2.',
    'Stratford-on-Avon District Council officer reports since 17 August 2026, each linked above; and the <a href="/research/authority/stratford-dc/core-strategy-weight/">Core Strategy policies page</a>.',
  ],
  credit: 'Prepared by a local resident.',
});
const out = path.join(SITE, SITE_PATH);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`✓ ${SITE_PATH}`);
