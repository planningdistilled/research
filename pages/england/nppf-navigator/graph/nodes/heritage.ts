import type { GraphNode } from '../../src/engine/types';

const designated = { eq: ['designated', true] } as const;
const harmLevels = ['harm-low', 'harm-moderate', 'harm-high'];

// HE4 to HE7. The HE6(4) balance is run on its own terms before the overall balance, and its result is carried into
// that balance. HE5 and HE6(4) are not "should be refused" policies (only HE6(5) is), so neither ends the decision on its own.
export const heritage: GraphNode[] = [
  {
    id: 'he5',
    kind: 'judgement',
    section: 'heritage',
    fact: 'he5',
    when: { any: [designated, { has: ['heritage', 'ndha'] }] },
    whyShown: 'You selected one or more heritage assets.',
    title: 'HE5: is the heritage assessment adequate?',
    prompt:
      'Does the evidence identify the significance of each asset (including the contribution of its setting) and the effect of the proposal on it, well enough for the decision-maker to be satisfied it is accurate?',
    quotes: ['HE5(1)', 'HE5(4)', 'HE5(3)'],
    help: [
      'HE5(3): it is the effect on significance, not the scale of the development, that matters.',
      'Where the applicant accepts harm but disputes its degree, specialist conservation advice is the usual way to satisfy HE5(4).',
      'Inspectors have dismissed appeals where the assessment of significance was missing or inadequate (HE5(1) fail: 3 decisions in the dataset). They carried the gap into the heritage balance rather than refusing on HE5 alone: "I am unable to determine whether the proposal would result in the loss of any historic fabric", then the public benefits were weighed against the harm (6006330 ¶16, ¶23).',
      'HE5 is an assessment requirement, not a policy that says development "should be refused". A failed assessment means harm cannot be ruled out; it counts against the proposal in the balance, and the burden of filling the gap is on the applicant.',
    ],
    method: {
      question: 'Is there enough evidence to say what each affected asset\'s significance is, what its setting contributes, and how the proposal would affect it?',
      steps: [
        'List every heritage asset the proposal could affect, directly or through its setting. Check the historic environment record and the conservation area appraisal, not only the applicant\'s list.',
        'For each asset, check that the assessment says what its significance is and what the setting contributes to it. HE5(1) asks for detail proportionate to the asset\'s importance.',
        'Check that it then states the likely effect on that significance under one of the four HE5(2) outcomes, and gives a degree where it finds harm.',
        'Test the conclusions against the plans and the site, as HE5(4) requires. Do they match what would actually be built and seen?',
        'Decide whether any gap can be filled from other sources, such as the council\'s conservation officer or Historic England. If it cannot, the effect cannot be properly assessed.',
      ],
      pointers: [
        { option: 'yes', factors: ['Each affected asset is identified, with its significance and setting described', 'The effect on significance is stated with a degree of harm', 'The plans and visualisations match the assessment\'s description of the scheme'] },
        { option: 'remediable', factors: ['An asset or setting relationship is missing, but specialist advice on file covers it', 'The applicant accepts harm and the dispute is only about its degree', 'The missing detail is proportionate and can be supplied by the conservation officer'] },
        {
          option: 'no',
          factors: [
            'No assessment of setting has been submitted (6009772 ¶6)',
            'No evidence on whether historic fabric to be removed is modern (6006330 ¶16)',
            'The statement does not describe the asset\'s age, design or features, and the drawings are only indicative (6003001 ¶28)',
            'No specialist advice is available to fill the gap',
          ],
        },
      ],
      evidence: ['The heritage statement or impact assessment', 'The historic environment record entry and list description', 'Conservation area appraisal and any Historic England or conservation officer advice', 'Plans, sections and visualisations showing the asset and the proposal together'],
      closeCall: 'The burden is on the applicant to supply the assessment. If the decision-maker cannot be satisfied that the effect on significance is accurately assessed, and no other source fills the gap, answer "No". The unassessed effect is then carried into the balance as harm that cannot be ruled out.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'remediable', label: 'Gaps, but the decision-maker can fill them (e.g. with specialist conservation advice)' },
        {
          value: 'no',
          label: 'No: the effect on significance cannot be properly assessed',
          effects: [
            { kind: 'fail', policy: 'HE5(1)', text: 'The effect on the significance of the heritage assets has not been properly assessed (HE5(1), HE5(4)).' },
            {
              kind: 'harm',
              policy: 'HE5(1)',
              weight: 'significant',
              text: 'Harm to the heritage assets cannot be ruled out on the evidence; the burden is on the applicant, so the gap counts against the proposal in the balance (e.g. 6006330 ¶16, ¶23).',
            },
          ],
        },
      ],
    },
    cases: { policies: ['HE5'], groupBy: 'finding' },
  },
  {
    id: 'heHarmFactors',
    kind: 'question',
    section: 'heritage',
    fact: 'heHarmFactors',
    when: { all: [designated, { ne: ['he5', 'no'] }] },
    whyShown: 'A designated asset is affected and its assessment is adequate, so the degree of effect on significance must be identified (HE5(2)).',
    title: 'HE5(2): what would the effect be?',
    prompt: 'Which of these describe the effect on the significance of the asset? Select all that apply — the next step suggests a degree from your answers, for you to confirm.',
    quotes: ['HE5(2)', 'AnnexB:setting'],
    help: [
      'Judge the effect on significance, not the scale of the development (HE5(3)). Setting is read historically and functionally, not only visually (6007136 ¶21).',
      '"Substantial harm" is reached only where a key element of significance is seriously affected (HE5(2)); below that, harm sits on a scale. "Less than substantial harm" is a 2024 term and is not used in the 2026 Framework.',
    ],
    input: {
      type: 'multi',
      options: [
        { value: 'reveal', label: 'Positive: removes a harmful later addition, or reveals or restores a lost feature', help: 'An enhancement to significance, not harm.' },
        { value: 'no-link', label: 'No historic, functional or visual link; the site makes no contribution to the asset’s significance' },
        { value: 'setting-minor', label: 'A minor part of the setting; the proposal is subordinate, glimpsed or peripheral, leaving the main significance legible' },
        { value: 'setting-dominate', label: 'The development would dominate a key element of the setting, or erode the rural or open context in which the asset is experienced', help: '6007054 ¶13–14.' },
        { value: 'functional-link', label: 'Removes a historic functional link — for example a farmhouse losing its adjoining farmland', help: '6006475 ¶32.' },
        { value: 'key-element', label: 'Seriously affects a key element of significance — for example the legibility of a principal historic elevation', help: 'This is the threshold for substantial harm (6006506 ¶16).' },
        { value: 'main-feature', label: 'Removes the main feature from which the asset draws its significance' },
        { value: 'total-loss', label: 'Demolition, or removal of every element that gives the asset significance' },
      ],
    },
  },
  {
    id: 'heEffect',
    kind: 'judgement',
    section: 'heritage',
    fact: 'heEffect',
    when: { all: [designated, { ne: ['he5', 'no'] }] },
    suggest: { fact: 'heEffectLean' },
    notes: { fact: 'heEffectNotes', label: 'Other affected assets and material notes (optional)', placeholder: 'e.g. other assets affected and their degree of harm; conservation officer or Historic England advice…' },
    title: 'HE5(2): effect on the designated asset',
    prompt: 'Confirm the degree of effect on the significance of the asset. If several are affected, answer for the most harmed.',
    quotes: ['HE5(2)', 'AnnexB:setting'],
    help: [
      'The Framework no longer uses "less than substantial harm". It asks for the degree of harm to be identified; "substantial harm" means seriously affecting a key element of significance.',
      'Setting is read functionally and historically, not only visually. For example, a farmhouse "would become an historic farmhouse without adjoining farmland" (6006475 ¶32); "impact on setting is not limited to intervisibility" (6007136 ¶21).',
      'Across the dataset, inspectors dismissed 124 of 134 appeals in which they found harm to a designated asset. Where they found no harm, 52 of 81 were permitted.',
    ],
    method: {
      question: 'Would the proposal enhance, leave unchanged, harm or destroy the significance of the asset, and if it harms it, how seriously?',
      steps: [
        'Start from the asset\'s significance and what its setting contributes, as identified under HE5(1). Name the elements of significance that matter most.',
        'Identify how the proposal would affect each element: through work to the asset itself or through development in its setting. Setting includes historic and functional links, not only views.',
        'Decide which HE5(2) outcome applies: positive, no effect, harm, or total loss. Judge the effect on significance, not the scale of the development (HE5(3)).',
        'If there is harm, ask whether it would "seriously affect a key element of the asset\'s significance". If so, it is substantial harm. If not, place it on the scale from very low to high.',
        'If several assets are affected, answer for the most harmed and record the others in your own notes.',
      ],
      pointers: [
        { option: 'positive', factors: ['Removes a harmful later addition or intrusion', 'Reveals or restores a lost feature of significance', 'Secures a use that allows the asset\'s repair'] },
        { option: 'none', factors: ['The site makes no contribution to the asset\'s significance', 'No historic, functional or visual link between site and asset'] },
        { option: 'harm-low', factors: ['The site is a minor part of the setting and the proposal is subordinate within it', 'Glimpsed or peripheral change that leaves the main elements of significance legible'] },
        { option: 'harm-moderate', factors: ['A minor part of the setting, but the building would dominate a key element (6007054 ¶13–14)', 'Erodes the rural or open context in which the asset is experienced'] },
        { option: 'harm-high', factors: ['Removes the historic functional link, for example a farmhouse losing its adjoining farmland (6006475 ¶32)', 'Considerably diminishes the open surroundings in which the asset is appreciated'] },
        { option: 'substantial', factors: ['Seriously affects a key element, such as the legibility of a principal historic elevation (6006506 ¶16)', 'Loss of the main feature from which the asset draws its significance'] },
        { option: 'total-loss', factors: ['Demolition of the asset', 'Removal of every element that gives it significance'] },
      ],
      evidence: ['The HE5 assessment of significance and setting', 'Historic maps showing the asset\'s historic relationship with the site', 'Views to, from and across the asset, and visualisations of the scheme', 'Conservation officer or Historic England advice on the degree of harm'],
      closeCall: '"Less than substantial harm" and "great weight" are 2024 terms and are not the 2026 test. Name the degree of harm: where the appellant called the harm "less-than-substantial", the inspector, "utilising the terminology of the 2026 version of the Framework", found it high (6003226 ¶22). Call it substantial only if a key element of significance is seriously affected; otherwise choose the level on the scale that the evidence supports.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'positive', label: 'Positive: significance enhanced or better revealed' },
        { value: 'none', label: 'No effect' },
        { value: 'harm-low', label: 'Harm: very low to low' },
        { value: 'harm-moderate', label: 'Harm: moderate' },
        { value: 'harm-high', label: 'Harm: high, short of substantial' },
        { value: 'substantial', label: 'Substantial harm: a key element of significance seriously affected' },
        { value: 'total-loss', label: 'Total loss of significance' },
      ],
    },
    effects: [
      {
        when: { in: ['heEffect', harmLevels] },
        finding: {
          kind: 'harm',
          policy: 'HE6(3)',
          weight: 'considerable',
          text: 'Harm to the significance of a designated heritage asset. Any harm is "a matter of considerable importance and weight" (HE6(3)), with substantial weight given to the asset\'s conservation (HE6(1)).',
          quotes: ['HE6(1)', 'HE6(3)'],
        },
      },
      { when: { in: ['heEffect', ['substantial', 'total-loss']] }, finding: { kind: 'harm', policy: 'HE6(5)', weight: 'considerable', text: 'Substantial harm to, or total loss of, the significance of a designated heritage asset.' } },
      { when: { eq: ['heEffect', 'none'] }, finding: { kind: 'note', policy: 'HE5(2)', text: 'No effect on the significance of the designated heritage assets.' } },
      { when: { eq: ['heEffect', 'positive'] }, finding: { kind: 'benefit', policy: 'HE5(2)', text: 'A positive effect on the significance of a designated heritage asset.' } },
    ],
    cases: { policies: ['HE6'], groupBy: 'outcome', context: ['listed-building-setting', 'conservation-area'], label: 'Heritage decisions by outcome' },
  },
  {
    id: 'heBenefits',
    kind: 'question',
    section: 'heritage',
    fact: 'heBenefits',
    when: { all: [designated, { in: ['heEffect', harmLevels] }] },
    whyShown: 'There is harm to a designated asset, so the public benefits are weighed against it (HE6(4)).',
    title: 'HE6(4): public benefits in the balance',
    prompt: 'Which public benefits weigh on the other side of this balance, and at what level? Tick the rows that fit. A benefit that is not secured or not evidenced carries no weight.',
    quotes: ['HE6(4)'],
    help: [
      'Only public benefits count; private benefits such as extra living space are excluded (6011314 ¶39).',
      'Reduce the weight of any benefit that is not secured, could be delivered elsewhere without the harm, or could be achieved with less harm (6007466 ¶23). Where a benefit is claimed but not demonstrated — for example the application does not address more recent survey findings, conditions or standards — give it no weight and tick the "not demonstrated" row.',
      'HE6(4) names two important public benefits: securing the long-term reuse of a vacant or underused listed building, and enabling energy efficiency or low carbon heating.',
      'These are the same public benefits weighed in the overall balance later; here they inform only the HE6(4) heritage balance. Weigh each one once. For each benefit, tick the single row that best fits its level.',
    ],
    input: {
      type: 'multi',
      options: [
        { value: 'housing-larger', label: 'Housing — a larger scheme where housing supply is short', help: 'Significant weight: HO7 weight rises with the number of homes and the certainty of delivery, and a supply shortfall adds to it.' },
        { value: 'housing-small', label: 'Housing — one or a few homes', help: 'Usually limited weight, even with a supply shortfall. Two appeals in the dataset have allowed 1–9 homes against more than very low heritage harm (6007704, 6010459).' },
        { value: 'affordable-secured', label: 'Affordable housing — secured by obligation', help: 'Significant weight when secured by a planning obligation.' },
        { value: 'affordable-unsecured', label: 'Affordable housing — offered but not secured', help: 'Little or no weight until it is secured.' },
        { value: 'reuse', label: 'Long-term reuse of a vacant or underused listed building — secured', help: 'An important public benefit named in HE6(4). The building must be genuinely vacant or underused, and the reuse secured. Its weight falls where the harmful scheme is not needed to deliver it: an extant, less harmful consent already secured the reuse (6006903 ¶22), or the conversion was not shown to be "the only way to secure the long-term reuse" (6006266 ¶23).' },
        { value: 'energy', label: 'Energy efficiency or low-carbon heating — beyond the regulatory minimum', help: 'An important public benefit named in HE6(4). Measures that only meet Building Regulations are neutral. The gain must be evidenced against the existing building, and it is discounted if it could be achieved with less harm (6003226 ¶27; 6009847 ¶16).' },
        { value: 'economic-ongoing', label: 'Economic — ongoing: permanent jobs or sustained local activity', help: 'More than construction alone, but needs evidence of the jobs or activity claimed.' },
        { value: 'economic-short', label: 'Economic — short-term only: construction spend and jobs during the build', help: 'Usually limited weight: temporary (E2). Modest for one or a few homes.' },
        { value: 'env-bng', label: 'Biodiversity net gain beyond the statutory 10% — secured', help: 'The mandatory 10% is neutral, not a benefit; only the surplus counts, once (N2). Do not offset it against any biodiversity harm found separately.' },
        { value: 'env-greenspace', label: 'Publicly accessible green space — secured', help: 'Weight depends on the quantity, quality and public access actually secured.' },
        { value: 'env-not-demonstrated', label: 'Environmental benefit claimed but not demonstrated', help: 'e.g. no updated ecological survey, or the application does not address more recent findings, conditions or standards. Give it no weight.' },
        { value: 'other', label: 'Other public benefit (describe it in the notes at the next step)', help: 'Anything else of genuine public value. Exclude private benefits such as extra living space.' },
      ],
    },
  },
  {
    id: 'he64',
    kind: 'judgement',
    section: 'heritage',
    fact: 'he64',
    when: { all: [designated, { in: ['heEffect', harmLevels] }] },
    notes: { fact: 'he64Notes', label: 'Other material considerations (optional)', placeholder: 'e.g. how each benefit is secured, any less-harmful alternative, the asset’s grade…' },
    notices: [
      {
        when: { eq: ['unmetNeed', true] },
        text: 'A housing land supply shortfall (or a Housing Delivery Test result below 75%) is recorded. It adds weight to housing benefits here — but in the dataset it has not rescued a small scheme against more than very low harm (6009545: one home at a 3.68-year supply still failed; 6007054: moderate harm, one home). Weigh the shortfall against the degree of harm and the number of homes.',
      },
    ],
    title: 'HE6(4): harm against public benefits',
    prompt:
      'Giving the harm considerable importance and weight, and substantial weight to the asset\'s conservation, do the public benefits of the proposal outweigh it, with a clear and convincing justification?',
    quotes: ['HE6(4)', 'HE6(1)', 'HE6(3)', 'HE4(2)'],
    help: [
      'Only public benefits count: private benefits such as extra living space are excluded (e.g. 6011314 ¶39, 6004673 ¶37).',
      'Benefits discounted in decisions: unsecured benefits, those achievable with less harm, and those that could be delivered elsewhere (6007466 ¶23).',
      'Small housing schemes have lost this balance on "low" harm despite supply shortfalls (6009545: 1 home, 3.68 years; 6007054: moderate harm, 1 home, 2.98 years). At 6010097 ¶14 one home was given substantial weight and still did not outweigh harm that was "modest in extent".',
      'An informal public benefit that is not secured carries reduced weight: community use "on an informal ad-hoc basis" got modest weight (6001939 ¶14).',
      'Minor harm has been outweighed by larger schemes with a shortfall (3375062: 20 homes; 6005664: 110 homes).',
      'Two appeals in the dataset allow 1 to 9 homes against harm above "very low": "limited" harm to a listed pub, outweighed mainly by reuse of a building empty for over three years (6007704 ¶36–40, hearing); and conservation-area harm "at the lower end of the scale", outweighed by 5 to 7 homes at 2.89 years\' supply (6010459 ¶18–19, permission in principle). Otherwise small schemes have lost on "low" harm.',
    ],
    method: {
      question: 'With considerable importance and weight given to the harm, and substantial weight to the asset\'s conservation, do the public benefits outweigh the harm?',
      steps: [
        'Put the harm on one side of the balance. HE6(3) makes any harm "a matter of considerable importance and weight". HE6(1) gives substantial weight to the asset\'s conservation, and more for a more important asset.',
        'List the public benefits and give each a weight. Leave out private benefits, such as more living space. HE6(4) names two important public benefits: securing the long-term reuse of a vacant or underused listed building, and enabling energy efficiency and low carbon heating.',
        'Reduce the weight of benefits that are not secured, that could be delivered elsewhere without the harm, or that could be achieved with less harm (6007466 ¶23).',
        'Weigh the two sides. This is an ordinary balance with the harm side weighted heavily, not the S4/S5 "substantially outweighed" test. Run it on its own, before the overall balance (6007221 ¶40, ¶51).',
        'If the benefits do not outweigh the harm, there is no clear and convincing justification under HE4(2). Carry the finding into the overall balance (S4, S5(1), S5(5) or GB6(2)) as harm of considerable importance and weight. HE6(4) is not a "should be refused" policy, so it does not engage S4(2)(c) or S5(2) on its own. For a listed building\'s setting, section 66 of the 1990 Act also requires special regard to the desirability of preserving it.',
      ],
      pointers: [
        {
          option: 'outweighed',
          factors: [
            'The harm is very low',
            'A larger housing scheme where supply is short',
            'A secured reuse of a vacant listed building, or secured energy efficiency or low carbon heating',
            'Benefits that can only be delivered on this site',
            'Works that secure the asset\'s own long-term survival: rebuilding a listed wall for "long-term structural stability" was "a meaningful public heritage benefit" that outweighed limited harm (6010276 ¶33–34)',
          ],
        },
        {
          option: 'not-outweighed',
          factors: [
            'One or a few homes against low or moderate harm, even with a supply shortfall',
            'Benefits that are private, such as extra living space (6011314 ¶39)',
            'Benefits "not specific to this site" that could be achieved elsewhere (6007466 ¶23)',
            'A highly graded asset, where the weight given to conservation is greater (6006475 ¶59)',
          ],
        },
      ],
      evidence: ['The degree of harm found at HE5(2)', 'The asset\'s grade or designation', 'A list of benefits, showing which are public and how each is secured', 'Any alternative, less harmful scheme or site'],
      closeCall: 'The benefits must actually outweigh harm that carries considerable importance and weight. If they only balance it, there is no clear and convincing justification. A failure here is not the end of the decision, but in the dataset all 44 appeals that failed this balance were then dismissed in the overall balance (e.g. 6007221 ¶40, then ¶51).',
    },
    input: {
      type: 'single',
      options: [
        { value: 'outweighed', label: 'Yes: the public benefits outweigh the harm' },
        { value: 'not-outweighed', label: 'No: the harm is not outweighed' },
      ],
    },
    effects: [
      { when: { eq: ['he64', 'outweighed'] }, finding: { kind: 'pass', policy: 'HE6(4)', text: 'The heritage harm is outweighed by the public benefits (HE6(4)).' } },
      { when: { eq: ['he64', 'not-outweighed'] }, finding: { kind: 'fail', policy: 'HE6(4)', text: 'The heritage harm is not outweighed by the public benefits (HE6(4)); there is no clear and convincing justification (HE4(2)).' } },
    ],
    cases: { policies: ['HE6(4)'], groupBy: 'finding', context: ['listed-building-setting', 'conservation-area'], label: 'HE6(4) balance findings' },
    contested: {
      summary: 'Should HE6(4) be run as its own balance, or folded into the overall S4/S5 balance?',
      readings: [
        {
          label: 'Run separately, then carried into the overall balance',
          summary: 'The usual appeal sequence: HE6(4) first (6007221 ¶40), then the overall balance, where the unjustified harm has led inspectors to find the benefits substantially outweighed (6007221 ¶51; 6006475 ¶59, ¶68; SDC at Ilmington, stratford-26-01399-PIP). The failure is weighed there; it is not a "should be refused" trigger.',
          cases: { policies: ['HE6(4)'], tags: ['heritage-harm-decisive'] },
        },
        {
          label: 'Folded into one balance',
          summary: 'Heritage harm treated as one input to the overall balance with no separate HE6(4) exercise (SDC at Long Marston, stratford-26-01906-PIP, granted).',
          cases: { policies: ['HE6'], tags: ['no-he6-4-balance', 'heritage-harm-outweighed'] },
        },
      ],
    },
  },
  {
    id: 'he65',
    kind: 'judgement',
    section: 'heritage',
    fact: 'he65',
    when: { all: [designated, { in: ['heEffect', ['substantial', 'total-loss']] }] },
    title: 'HE6(5): substantial harm or total loss',
    prompt: 'Is the harm necessary to achieve substantial public benefits that outweigh it, or do all four conditions (a) to (d) apply?',
    quotes: ['HE6(5)'],
    method: {
      question: 'Is the substantial harm or total loss necessary to achieve substantial public benefits that outweigh it, or do all four conditions in HE6(5)(a) to (d) apply?',
      steps: [
        'Start from the refusal: HE6(5) says consent should be refused unless one of the two routes is shown. The applicant must demonstrate it.',
        'Route 1: identify the public benefits and ask whether they are substantial. Then ask whether the harm is necessary to deliver them, or whether they could be achieved with less harm or elsewhere. Then ask whether they outweigh the harm or loss.',
        'Route 2: check each condition. (a) the asset prevents all reasonable uses of the site; (b) marketing has found no suitable use in the medium term; (c) grant funding or charitable or public ownership is not possible; (d) bringing the asset back into use outweighs the harm or loss. All four must apply.',
        'Apply HE6(6): substantial harm to grade II listed buildings or grade II registered parks and gardens should be exceptional, and to assets of the highest significance (such as scheduled monuments, grade I and II* buildings) wholly exceptional.',
      ],
      pointers: [
        { option: 'met', factors: ['Evidenced, secured benefits of substantial scale that only this scheme can deliver', 'Documented marketing over the medium term with no viable use found', 'Evidence that grant funding and not-for-profit ownership have been explored and are not possible'] },
        {
          option: 'not-met',
          factors: [
            'The scheme would not give rise to substantial public benefits (6006506 ¶20)',
            'A less harmful design would deliver the same benefits',
            'Conditions (a) to (d) are not applicable (6006506 ¶20)',
            'No marketing evidence, or marketing that was short or at an unrealistic price',
          ],
        },
      ],
      evidence: ['The degree of harm found at HE5(2) and the asset\'s grade', 'Evidence of the public benefits and how they are secured', 'Marketing, viability and funding evidence for the asset', 'Any options appraisal showing less harmful alternatives'],
      closeCall: 'The policy starts from refusal and the burden is on the applicant. If either route is not clearly demonstrated, answer "No".',
    },
    input: {
      type: 'single',
      options: [
        { value: 'met', label: 'Yes' },
        { value: 'not-met', label: 'No' },
      ],
    },
    effects: [
      { when: { eq: ['he65', 'met'] }, finding: { kind: 'pass', policy: 'HE6(5)', text: 'The substantial harm is necessary to achieve substantial public benefits that outweigh it (HE6(5)).' } },
      { when: { eq: ['he65', 'not-met'] }, finding: { kind: 'trigger', policy: 'HE6(5)', text: 'Substantial harm without the justification HE6(5) requires: consent "should be refused".' } },
    ],
    cases: { policies: ['HE6(5)'], groupBy: 'finding' },
  },
  {
    id: 'he7',
    kind: 'judgement',
    section: 'heritage',
    fact: 'he7',
    when: { all: [{ has: ['heritage', 'ndha'] }, { ne: ['he5', 'no'] }] },
    title: 'HE7(2): non-designated heritage asset',
    prompt: 'Having regard to the scale of any harm and the asset\'s significance, is any harm to the non-designated asset outweighed by the benefits?',
    quotes: ['HE7(2)'],
    help: ['This is a balanced judgement, not the HE6 test. Limited harm to a non-designated asset is routinely outweighed (e.g. 6007184); total loss of one was not outweighed by one replacement home (6007188).'],
    method: {
      question: 'Taking the scale of any harm and the significance of the non-designated asset together, do the benefits of the proposal outweigh the harm?',
      steps: [
        'Confirm the asset is non-designated and that its significance is described. An archaeological asset of equivalent significance to a scheduled monument is treated as designated (footnote 64).',
        'Decide whether there is any harm to its significance, and its scale, from limited harm through to total loss.',
        'List the benefits of the proposal and give each a weight. Unlike HE6(4), HE7(2) refers to "the benefits of the proposal", not only public benefits.',
        'Make the balanced judgement. HE7(2) does not give the harm considerable importance and weight as HE6 does; it asks you to have regard to the scale of harm and the asset\'s significance.',
        'For substantial harm or total loss, apply HE7(3): the proposal should only be supported where the harm or loss is outweighed by the benefits.',
      ],
      pointers: [
        { option: 'no-harm', factors: ['The proposal does not touch the asset or the features that give it interest', 'The asset\'s setting makes little contribution to its significance'] },
        { option: 'outweighed', factors: ['Limited harm to an asset of modest significance (6007184 ¶101)', 'Benefits of some scale, such as several homes or a secured reuse'] },
        { option: 'not-outweighed', factors: ['Total loss of the asset (6007188 ¶15)', 'Benefits limited to one home or a replacement building', 'An asset of high local significance, for example one on a local list with a clear historic role'] },
      ],
      evidence: ['The HE5 assessment and any local list entry', 'The degree of harm or extent of loss', 'The benefits and how they are secured'],
      closeCall: 'This is a level balance: neither side starts with extra weight. Where harm and benefits are close, the scale of harm and the asset\'s significance decide it. For substantial harm or total loss, HE7(3) supports the proposal only where the benefits outweigh it.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'no-harm', label: 'No harm' },
        { value: 'outweighed', label: 'Harm, outweighed by the benefits' },
        { value: 'not-outweighed', label: 'Harm, not outweighed' },
      ],
    },
    effects: [
      { when: { eq: ['he7', 'outweighed'] }, finding: { kind: 'harm', policy: 'HE7(2)', weight: 'limited', text: 'Harm to a non-designated heritage asset, outweighed in the balanced judgement (HE7(2)).' } },
      { when: { eq: ['he7', 'not-outweighed'] }, finding: { kind: 'harm', policy: 'HE7(2)', weight: 'significant', text: 'Harm to a non-designated heritage asset that the benefits do not outweigh (HE7(2)).' } },
    ],
    cases: { policies: ['HE7'], groupBy: 'finding' },
  },
];
