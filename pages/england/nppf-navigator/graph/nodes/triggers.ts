import type { GraphNode } from '../../src/engine/types';

const c = (v: string) => ({ has: ['constraints', v] }) as const;

// National decision-making policies that say development "should be refused" (the S4(2)(c)/S5(2) triggers),
// and the harms that feed the balance.
export const triggers: GraphNode[] = [
  {
    id: 'f7',
    kind: 'judgement',
    section: 'triggers',
    fact: 'f7',
    when: c('flood'),
    whyShown: 'You said the location is known to be at risk from flooding.',
    title: 'F7(2): flood risk from any source',
    prompt: 'Has the applicant demonstrated all five matters (a) to (e) in F7(2)?',
    quotes: ['F7(2)'],
    help: [
      'F7(2) covers any form of flooding, including surface water and groundwater, now or in the future.',
      'The sequential test (F5) applies separately in areas at risk. F5 is worded "should not be located"; the "should be refused" wording is in F6(1)(a) and F7(2). Inspectors treat failure of either as decisive.',
    ],
    method: {
      question: 'In a location at risk of flooding from any source, has the applicant shown all five matters in F7(2): safe layout, safety for the lifetime of the development, managed residual risk with safe access and escape, resilience, and no increase in risk elsewhere?',
      steps: [
        'Confirm the location is at risk from any form of flooding, now or in the future. The strategic flood risk assessment and the Flood Map for Planning are the evidential basis for the sequential test (F5(3)); unevidenced site level readings did not displace them at 6007423 ¶6.',
        'Check there is a site-specific flood risk assessment where F4 requires one (all proposals in Flood Zones 2, 3a and 3b, and the listed cases in Flood Zone 1). Without one the five matters cannot be assessed; this applied even to permission in principle (6009098 ¶12).',
        'Deal separately with the sequential test (F5) and, in Flood Zones 2 and 3, with compatibility and the exception test (F6 and Annex F, table 3). Note any exemption in F5(2): homes outside the flood zone did not qualify where the access and escape route was at risk, and the absence of an Environment Agency objection did not establish an exemption (6004952 ¶8–9). A failure there counts against the proposal in its own right, whatever the answer here.',
        'Take (a) to (e) in turn: the most vulnerable parts in the lowest-risk areas of the site; safe for its lifetime given its users; residual risk safely managed, with safe access and escape routes in an agreed emergency plan where appropriate; flood resistant and resilient; no increase in risk elsewhere. All five must be shown.',
        'Test access and escape along the whole route, not only the buildings. Dry buildings reached across Flood Zones 2 and 3 failed without a robust formal emergency plan (6010729 ¶19).',
      ],
      pointers: [
        {
          option: 'demonstrated',
          factors: [
            'Built development, access and escape routes all outside the area at risk, now and in the future',
            'Floor levels and layout keep the most vulnerable uses in the lowest-risk part of the site',
            'Safe, dry access and escape, or an agreed emergency plan',
            'Drainage evidence shows no increase in run-off or displaced flood water elsewhere',
          ],
        },
        {
          option: 'not-demonstrated',
          factors: [
            'No site-specific flood risk assessment (6009098 ¶12)',
            'Access or escape route crosses Flood Zone 2 or 3 with no robust emergency plan (6010729 ¶19)',
            'Single-storey living with no refuge and no details of safe access or escape (6007423 ¶13)',
            'Reliance on flood warnings and good management alone (6010729 ¶18–19)',
            'No evidence on run-off or displaced water elsewhere',
          ],
        },
      ],
      evidence: [
        'Strategic flood risk assessment and Flood Map for Planning extracts, including surface water',
        'The site-specific flood risk assessment (F4)',
        'Site levels, floor levels and levels along the access and escape route',
        'Any emergency plan, and the Environment Agency and lead local flood authority responses',
        'The drainage strategy',
      ],
      closeCall: 'Refusal is the default: the proposal "should be refused unless" all five matters are met, and (e) must be "demonstrated". If any one is unevidenced, answer "No, or not evidenced".',
    },
    input: {
      type: 'single',
      options: [
        { value: 'demonstrated', label: 'Yes: all five are demonstrated' },
        { value: 'not-demonstrated', label: 'No, or not evidenced' },
      ],
    },
    effects: [{ when: { eq: ['f7', 'not-demonstrated'] }, finding: { kind: 'trigger', policy: 'F7(2)', text: 'In a location known to be at risk of flooding, F7(2)(a) to (e) are not demonstrated, so the proposal "should be refused".' } }],
    cases: { policies: ['F7', 'F5'], groupBy: 'finding' },
  },
  {
    id: 'n4major',
    kind: 'judgement',
    section: 'triggers',
    fact: 'n4major',
    when: c('protectedLandscape'),
    title: 'N4(2): major development in a Protected Landscape',
    prompt: 'Is this "major development" for the purposes of N4, judged on its nature, scale and setting and whether it could significantly harm the purposes for which the area is designated (footnote 59)?',
    quotes: ['N4(1)', 'N4(2)'],
    method: {
      question: 'Is this major development in the Protected Landscape, judged on its nature, scale and setting, and if so, are there exceptional circumstances and is it shown to be in the public interest?',
      steps: [
        'Decide whether it is major development under footnote 59. It is a matter for the decision-maker, taking into account the nature, scale and setting of the proposal and whether it could have a significant adverse impact on the statutory purposes of the area. The general Annex B definition (10 or more homes, or 0.5 hectares) does not apply to this policy.',
        'If it is not major, answer "No". Its effect is still assessed under N4(1), with substantial weight on conserving and enhancing natural beauty (6008569 ¶27).',
        'If it is major, assess the three matters N4(2) lists: (a) the need for the development and the effect of permitting or refusing it on the local economy; (b) the cost of, and scope for, developing outside the Protected Landscape or meeting the need another way; (c) any detrimental effect on the environment, the landscape and recreational opportunities, and how far it could be moderated.',
        'Decide whether those matters amount to exceptional circumstances, and separately whether it has been demonstrated that the development is in the public interest. Both are needed.',
        'If it is approved exceptionally, N4(3) expects steps to mitigate adverse impacts on special qualities and statutory purposes, including tranquillity and dark skies.',
      ],
      pointers: [
        {
          option: 'no',
          factors: [
            'Limited nature and scale, with little likely impact on the purposes of designation (6006581 ¶12)',
            'Reads as part of an existing settlement rather than open landscape',
            'Replaces or reuses existing built form',
          ],
        },
        {
          option: 'yes-exceptional',
          factors: [
            'A need that cannot be met outside the Protected Landscape or in another way, with evidence of the search',
            'National considerations, such as mineral supply, or a clear effect of refusal on the local economy',
            'Harm to the environment, landscape and recreation that is limited or can be moderated',
            'Public interest demonstrated by evidence, not assumed',
          ],
        },
        {
          option: 'yes',
          factors: [
            'The need could be met outside the Protected Landscape, or alternatives were not assessed',
            'The need is general, such as district housing supply, and not tied to this location',
            'Significant harm to landscape or recreation that cannot be moderated',
          ],
        },
      ],
      evidence: [
        'Landscape and visual impact assessment',
        'The Protected Landscape management plan and its special qualities',
        'Evidence of need and of alternative sites outside the designation',
        'The response of the National Landscape or National Park body',
      ],
      closeCall: 'For major development, refusal is the default: exceptional circumstances and the public interest must both be shown. On whether it is major, a real prospect of significant adverse impact on the statutory purposes points strongly towards "Yes".',
    },
    input: {
      type: 'single',
      options: [
        { value: 'no', label: 'No' },
        { value: 'yes-exceptional', label: 'Yes, but there are exceptional circumstances and it is in the public interest' },
        { value: 'yes', label: 'Yes, without exceptional circumstances' },
      ],
    },
    effects: [
      { when: { eq: ['n4major', 'yes'] }, finding: { kind: 'trigger', policy: 'N4(2)', text: 'Major development in a Protected Landscape without exceptional circumstances "should be refused" (N4(2)).' } },
    ],
    cases: { policies: ['N4'], groupBy: 'finding' },
  },
  {
    id: 'n4harm',
    kind: 'judgement',
    section: 'triggers',
    fact: 'n4harm',
    when: { any: [c('protectedLandscape'), c('protectedLandscapeSetting')] },
    title: 'N4: harm to a Protected Landscape',
    prompt: 'Would the proposal harm the natural beauty or special qualities of the Protected Landscape?',
    quotes: ['N4(1)', 'N4(4)'],
    method: {
      question: 'Would the proposal harm the natural beauty, statutory purposes or special qualities of the Protected Landscape, from within it or from its setting?',
      steps: [
        'Identify the special qualities that apply here, from the management plan or landscape character assessment: for example tranquillity, dark skies, settlement pattern, historic routes and views to key features.',
        'Establish whether the site is within the Protected Landscape or in its setting. Within it, development should be limited in scale and extent and located and designed to avoid harm (N4(1)). In the setting, it should be located and designed to avoid or minimise adverse impacts (N4(4)).',
        'Assess the effect on each quality, including lighting at night, domestic paraphernalia and traffic, and whether the site is seen from within the designation (6010756 ¶11, ¶13).',
        'Ask whether design, landscaping or conditions would avoid the harm. A condition controlling light from glazing was enough at 6009677 ¶15.',
        'Any harm carries substantial weight (N4(1)). The statutory duty to seek to further the purpose of conserving and enhancing natural beauty also applies (footnote 2; 6010756 ¶6).',
      ],
      pointers: [
        {
          option: 'no',
          factors: [
            'Scale and design appropriate to the surrounding area, with no over-development (6009997 ¶26)',
            'Replaces existing built form without extending it',
            'Not seen from public places within the designation',
            'Lighting and activity comparable with the existing use',
          ],
        },
        {
          option: 'yes',
          factors: [
            'A dwelling and domestic paraphernalia where no development exists, even if modest (6007130 ¶11)',
            'New light spill that erodes dark skies (6010756 ¶11)',
            'Reduces views to a key feature of the designation (6006900 ¶10)',
            'Consolidates a scattered pattern of development (6006900 ¶11)',
            'Permanently replaces pastoral landscape with residential form (6006581 ¶21)',
          ],
        },
      ],
      evidence: [
        'The management plan and its statement of special qualities',
        'Landscape and visual impact assessment, with viewpoints from within the designation',
        'Lighting and glazing details',
        'The response of the National Landscape or National Park body',
      ],
      closeCall: 'N4(1) asks for harm to be avoided, and N4(4) for adverse impacts to be avoided or minimised. If harm to a special quality remains after mitigation, answer "Yes"; how much harm goes to the balance, not to whether it exists.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'no', label: 'No' },
        { value: 'yes', label: 'Yes' },
      ],
    },
    effects: [{ when: { eq: ['n4harm', 'yes'] }, finding: { kind: 'harm', policy: 'N4', weight: 'substantial', text: 'Harm to a Protected Landscape, whose natural beauty carries substantial weight (N4(1)).' } }],
    cases: { policies: ['N4'], groupBy: 'finding', context: ['national-landscape', 'national-park'] },
  },
  {
    id: 'n62',
    kind: 'judgement',
    section: 'triggers',
    fact: 'n62',
    when: c('irreplaceable'),
    title: 'N6(2): irreplaceable habitats',
    prompt: 'Would the proposal cause loss or deterioration of irreplaceable habitat and, if so, are there wholly exceptional reasons and a suitable compensation strategy?',
    quotes: ['N6(2)'],
    help: ['An unassessed mature tree may be veteran. If no one has assessed it, the question cannot be answered on the evidence.'],
    method: {
      question: 'Would the proposal cause any loss or deterioration of an irreplaceable habitat and, if so, are there wholly exceptional reasons and a suitable compensation strategy?',
      steps: [
        'Identify any irreplaceable habitat on or near the site: ancient woodland, ancient or veteran trees, and the other habitats in the Annex B definition. A veteran tree is one of exceptional value because of its age, size and condition, so a mature tree needs assessing.',
        'The policy applies whatever the site\'s status in nature conservation terms. The habitat does not need to be designated.',
        'Assess loss and deterioration separately. Deterioration covers effects on roots, soils and ecological communities, not only felling: a no-dig driveway through ancient woodland was not shown to avoid harm (6008528 ¶25).',
        'If there is loss or deterioration, ask whether the reasons are wholly exceptional. Footnote 62 gives infrastructure projects as the example, where the public benefit would clearly outweigh the loss. The convenience of a separate access was not enough (6008528 ¶29).',
        'Then ask whether a suitable compensation strategy exists. Both limbs are needed.',
      ],
      pointers: [
        {
          option: 'no-loss',
          factors: [
            'No irreplaceable habitat on or near the site, on an up-to-date survey',
            'Buildings, access and services kept outside root protection areas and woodland buffers (a 30 m buffer at 6007184 ¶93)',
            'Arboricultural and ecological evidence covers the long-term effects of use next to the habitat',
          ],
        },
        {
          option: 'justified',
          factors: [
            'Infrastructure or similar development whose public benefit clearly outweighs the loss (footnote 62)',
            'No less harmful alternative, shown by evidence',
            'A compensation strategy that is specific and secured',
          ],
        },
        {
          option: 'unjustified',
          factors: [
            'Veteran status of an affected tree not assessed',
            'Reasons are private benefit or convenience (6008528 ¶29)',
            'Alternatives that avoid the habitat not explored (6008528 ¶28)',
            'No arboricultural or ecological evidence on deterioration (6008528 ¶30; 6006496 ¶12)',
          ],
        },
      ],
      evidence: [
        'Arboricultural survey identifying any ancient or veteran trees',
        'Ancient woodland mapping and the relevant standing advice',
        'Ecological assessment of deterioration during construction and use',
        'Any compensation strategy',
      ],
      closeCall: 'Refusal is the default: the proposal "should be refused, unless" there are wholly exceptional reasons and a suitable compensation strategy. If the habitat or the extent of deterioration has not been assessed, the loss cannot be shown to be justified.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'no-loss', label: 'No loss or deterioration' },
        { value: 'justified', label: 'Loss, with wholly exceptional reasons and compensation' },
        { value: 'unjustified', label: 'Loss without that justification, or not assessed' },
      ],
    },
    effects: [{ when: { eq: ['n62', 'unjustified'] }, finding: { kind: 'trigger', policy: 'N6(2)', text: 'Loss or deterioration of irreplaceable habitat without wholly exceptional reasons "should be refused" (N6(2)).' } }],
    cases: { policies: ['N6'], groupBy: 'finding' },
  },
  {
    id: 'n22',
    kind: 'judgement',
    section: 'triggers',
    fact: 'n22',
    when: c('biodiversity'),
    title: 'N2(2): significant harm to biodiversity',
    prompt: 'Can any significant harm to biodiversity be avoided, adequately mitigated or, as a last resort, compensated for, on the evidence submitted?',
    quotes: ['N2(2)'],
    help: [
      'Missing or out-of-season protected-species surveys cannot usually be left to a condition (Circular 06/2005 ¶99): e.g. 6012481, 6008404, 6010616 (nesting-bird survey "outside of the optimal period").',
    ],
    method: {
      question: 'On the evidence, can any significant harm to biodiversity be avoided, adequately mitigated or, as a last resort, compensated for?',
      steps: [
        'Check the ecological evidence is complete: a preliminary appraisal and every further survey it recommends, done in the right season and covering the scheme as now proposed (6008404 ¶30).',
        'If surveys are missing, do not leave them to a condition. Inspectors apply Circular 06/2005 ¶99: the presence of protected species and the effect on them should be established before permission, with conditions only in exceptional circumstances (6012481 ¶29).',
        'Identify the species and habitats affected and whether the harm would be significant.',
        'Apply the N2(2) hierarchy in order: avoid (including by locating on an alternative site with less harmful impacts), then mitigate adequately, then, as a last resort, compensate.',
        'Where a protected species licence would be needed, consider whether it is likely to be granted (6008404 ¶29).',
      ],
      pointers: [
        {
          option: 'yes',
          factors: [
            'Surveys complete, current and in season',
            'Mitigation specific to the species found, and securable by condition or obligation',
            'Any licence needed is likely to be granted (6008404 ¶29)',
            'Compensation used only after avoidance and mitigation',
          ],
        },
        {
          option: 'no',
          factors: [
            'Harm to a species or habitat that the proposed measures do not address',
            'Compensation relied on where the harm could have been avoided',
            'Mitigation that cannot be secured',
          ],
        },
        {
          option: 'not-evidenced',
          factors: [
            'Further surveys recommended by the appraisal not done (6012481 ¶28)',
            'Ponds within 500 m and no great crested newt survey (6012481 ¶26)',
            'Surveys cover different trees from those identified as needing survey (6010701 ¶20–22)',
            'The scheme changed after the surveys (6008404 ¶30)',
            'Surveys outside the optimal season (6010616 ¶6)',
          ],
        },
      ],
      evidence: [
        'Preliminary ecological appraisal and all recommended species surveys',
        'Survey dates against the optimal survey season',
        'Mitigation and compensation proposals, and how they are secured',
        'The council ecologist\'s response',
      ],
      closeCall: 'Inspectors take a precautionary approach. Where the evidence does not establish the effect on protected species, significant harm cannot be ruled out and N2(2) is treated as failed (6012481 ¶30; 6008404 ¶50).',
    },
    input: {
      type: 'single',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'not-evidenced', label: 'Cannot tell: surveys missing, out of date or out of season' },
      ],
    },
    effects: [
      { when: { eq: ['n22', 'no'] }, finding: { kind: 'trigger', policy: 'N2(2)', text: 'Significant harm to biodiversity that cannot be avoided, mitigated or compensated for: the proposal "should be refused" (N2(2)).' } },
      {
        when: { eq: ['n22', 'not-evidenced'] },
        finding: { kind: 'trigger', policy: 'N2(2)', text: 'Without adequate surveys, significant harm to biodiversity cannot be ruled out, and the gap cannot be filled by condition.' },
      },
    ],
    cases: { policies: ['N2', 'N6'], groupBy: 'finding' },
  },
  {
    id: 'n21d',
    kind: 'judgement',
    section: 'triggers',
    fact: 'n21d',
    when: c('treesHedges'),
    title: 'N2(1)(d): established trees and hedgerows',
    prompt: 'Would established trees or hedgerows of visual, historic or nature-conservation value be lost, including any cleared for visibility splays, where retaining them was possible?',
    quotes: ['N2(1)(d)'],
    help: [
      'Splays can remove far more than the tree report assumes. At 6007807 (¶9–11) the arboricultural assessment ignored the splays; replanting "would take years to mature".',
      'Hedgerow in the highway lost to splays had "amenity value as part of the landscape character" even where biodiversity could be offset (6006819 ¶22).',
      'Counter-example: a replacement hawthorn hedge longer than the length lost was accepted (6007231).',
    ],
    method: {
      question: 'Would established trees or hedgerows of visual, historic or nature conservation value be lost where keeping them was possible, and is any unavoidable loss adequately replaced?',
      steps: [
        'Identify the trees and hedgerows of value: visual, historic or nature conservation. They do not need to be protected to count (6006819 ¶22).',
        'Add up all the loss the scheme needs, including visibility splays, access widening, services and works in root protection areas. Tree reports can leave out the splays (6007807 ¶9–10).',
        'Ask whether keeping them was possible: another layout, access position or splay arrangement. N2(1)(d) asks for features to be conserved and enhanced "where possible".',
        'If loss is unavoidable, judge the replacement: species, size, position, length and time to mature, and whether it is secured.',
      ],
      pointers: [
        {
          option: 'retained',
          factors: [
            'The arboricultural assessment covers splays and services and shows the features kept',
            'Root protection areas respected, with a tree protection plan',
            'Splays achievable without cutting back the hedge or trees',
          ],
        },
        {
          option: 'justified',
          factors: [
            'No workable layout or access that keeps the feature',
            'Replacement hedge longer than the length lost, secured by condition (6007231 ¶18)',
            'Heavy-standard replacement trees in the same group with a broadly similar effect (6010226 ¶13–14)',
          ],
        },
        {
          option: 'lost',
          factors: [
            'Splays remove roadside trees the reports did not assess (6007807 ¶9–10)',
            'Hedgerow within the highway permanently lost (6006819 ¶22)',
            'Replanting would take years to give a similar effect (6007807 ¶11)',
            'Alternative layouts or access points not considered',
          ],
        },
      ],
      evidence: [
        'Arboricultural impact assessment and tree protection plan, including the splays',
        'Access drawing with splays overlaid on tree and hedge positions',
        'Landscaping and replacement planting details',
        'Hedgerow survey where a hedge is affected',
      ],
      closeCall: 'If the evidence does not cover the splays or other works, the loss has not been shown to be unavoidable. Treat it as unassessed.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'retained', label: 'No: they are retained' },
        { value: 'justified', label: 'Some loss, unavoidable and adequately replaced' },
        { value: 'lost', label: 'Yes: avoidable or unassessed loss' },
      ],
    },
    effects: [{ when: { eq: ['n21d', 'lost'] }, finding: { kind: 'harm', policy: 'N2(1)(d)', text: 'Loss of established trees or hedgerows of value where retention was possible (N2(1)(d)).' } }],
    cases: { policies: ['N2', 'DP3'], groupBy: 'finding', label: 'Tree and hedgerow findings' },
  },
  {
    id: 'dp32c',
    kind: 'judgement',
    section: 'triggers',
    fact: 'dp32c',
    when: c('treesHedges'),
    title: 'DP3(2)(c): tree cover',
    prompt: 'Would the proposal reduce tree cover, rather than maintain and enhance it, without clear justification?',
    quotes: ['DP3(2)(c)', 'DP3(3)'],
    help: ['A conflict with DP3(2) principles without clear justification engages DP3(3) ("should be refused"). At 6005325 (¶23, ¶30–31) loss of a prominent tree did exactly that, and the benefits of one home were "substantially outweighed".'],
    method: {
      question: 'Would the proposal reduce tree cover rather than maintain and enhance it and, if so, is there a clear justification?',
      steps: [
        'Compare tree cover before and after: trees felled, trees put at risk by works in root protection areas, and new planting with its long-term maintenance (N3(1)(c)).',
        'Consider what the trees contribute to the site and its setting. A tree preservation order is a strong sign of value (6005325 ¶21–22).',
        'If cover would fall, decide whether there is a clear justification. The Framework does not define it. At 6008314 ¶43 the tree loss was justified because it was necessary to deliver the development; at 6009340 ¶22 the benefits outweighing the harm were enough. Say which reading you apply.',
        'Answer the justification question on its own terms, not through the S4/S5 test. Without clear justification DP3(3) says the proposal "should be refused" (6005325 ¶30–31).',
      ],
      pointers: [
        {
          option: 'no',
          factors: [
            'All trees of value kept and protected',
            'Replacement planting gives equal or greater cover, with long-term maintenance secured',
            'Only low-quality or unsuitable trees lost',
          ],
        },
        {
          option: 'yes',
          factors: [
            'Total loss of a protected tree, significantly harming the character of the area (6005325 ¶21–23)',
            'The layout could keep the tree but does not',
            'Works in root protection areas with no evidence the tree would survive',
            'The only justification offered is that the scheme delivers homes',
          ],
        },
      ],
      evidence: [
        'Arboricultural impact assessment, tree protection plan and any tree preservation order',
        'Landscaping plan with planting sizes and maintenance',
        'The design and access statement: why the loss is needed',
      ],
      closeCall: 'If cover would fall and the justification is only that the benefits are not substantially outweighed, the question has not been answered. Make the clear-justification finding on a stated reading, or treat it as not shown.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'no', label: 'No' },
        { value: 'yes', label: 'Yes' },
      ],
    },
    effects: [{ when: { eq: ['dp32c', 'yes'] }, finding: { kind: 'trigger', policy: 'DP3(3)', text: 'Loss of tree cover conflicts with DP3(2)(c) without clear justification, so DP3(3) says the proposal "should be refused".' } }],
    cases: { policies: ['DP3'], tags: ['dp3-refuse-trigger'], groupBy: 'finding' },
  },
  {
    id: 'tr64',
    kind: 'judgement',
    section: 'triggers',
    fact: 'tr64',
    when: c('access'),
    title: 'TR6(4): highway safety',
    prompt: 'After mitigation, would the access have an unacceptable impact on highway safety or a severe impact on the network? Can the visibility splays be delivered on land within the site or the highway?',
    quotes: ['TR6(4)'],
    help: [
      'The safety limb stands alone: an impact need not be "severe" to be unacceptable (6006819 ¶20).',
      'Splays that depend on third-party land or unassessed hedge removal have failed (6009997 ¶14–15, 6012481 ¶37).',
      'An absence of recorded injury collisions is "not a reliable indicator" on its own (6009573 ¶23).',
    ],
    method: {
      question: 'Taking account of mitigation, would the proposal have an unacceptable impact on highway safety or a severe adverse impact on the network, and can a safe access be delivered?',
      steps: [
        'Treat the two limbs separately. Safety is judged against "unacceptable"; capacity and congestion, including cumulative impacts, against "severe". An impact need not be severe to be unacceptable on safety (6006819 ¶20).',
        'Check the access: visibility splays for actual speeds, width, and position relative to junctions. Confirm the splays fall on land the applicant controls or on the highway (6009997 ¶14; 6006496 ¶22).',
        'Do not defer an undeliverable splay to a condition. Where third-party land may be needed, such a condition was held neither reasonable nor enforceable (6006496 ¶23).',
        'Consider all users, including pedestrians and cyclists, and the construction phase as well as occupation (TR6(4)).',
        'Take account of mitigation and wider network improvements, as TR6(4) requires. Read the highway authority\'s response against site-specific evidence; recorded collision data alone is not a reliable indicator (6009573 ¶23).',
      ],
      pointers: [
        {
          option: 'acceptable',
          factors: [
            'Splays to the standard for recorded speeds, within the site or highway',
            'Highway authority has no objection on the technical evidence (this answers TR6(4) and TR3(1)(c), not the sustainable-location test in TR3(1)(a) or GB7(1)(g)(iii))',
            'Parking pressure causes inconvenience but no unsafe parking or obstruction (6006811 ¶14)',
          ],
        },
        {
          option: 'not-demonstrated',
          factors: [
            'Splays cross third-party land or depend on a neighbour\'s boundary (6009997 ¶14)',
            'Visibility depends on hedge works that have not been assessed (6012481 ¶37)',
            'Splay requirement left to a condition that could not be met (6006496 ¶23)',
            'No speed survey or transport evidence where one is needed',
          ],
        },
        {
          option: 'unacceptable',
          factors: [
            'Views for emerging drivers substantially compromised (6009997 ¶14–15)',
            'Substandard access used by pedestrians or cyclists (6006819 ¶20)',
            'Narrow access close to a junction, with poor visibility (6012481 ¶37)',
            'Improves a substandard access, but not to a safe standard: "the fact that a proposal would improve an existing arrangement does not necessarily demonstrate that the resulting arrangement would be safe and suitable" (6009517 ¶8)',
          ],
        },
      ],
      evidence: [
        'Access drawing with splays and land ownership',
        'Speed survey, and a transport statement or assessment where TR6(1) requires one',
        'The highway authority\'s response',
        'Collision data, read with its limits',
      ],
      closeCall: 'If the safety of the access depends on land or works not shown to be deliverable, the impact has not been shown to be acceptable. Inconvenience, such as parking pressure, is not in itself a safety impact.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'acceptable', label: 'Acceptable: safe access, splays deliverable' },
        { value: 'not-demonstrated', label: 'Not demonstrated: splays depend on third-party land or unassessed works' },
        { value: 'unacceptable', label: 'Unacceptable impact on highway safety' },
      ],
    },
    effects: [
      { when: { eq: ['tr64', 'unacceptable'] }, finding: { kind: 'trigger', policy: 'TR6(4)', text: 'An unacceptable impact on highway safety: the proposal "should be refused" (TR6(4)).' } },
      { when: { eq: ['tr64', 'not-demonstrated'] }, finding: { kind: 'trigger', policy: 'TR6(4)', text: 'A safe access is not shown to be deliverable, so an unacceptable impact on highway safety cannot be ruled out (TR6(4)).' } },
    ],
    cases: { policies: ['TR6(4)'], groupBy: 'finding' },
  },
  {
    id: 'dp3Conflicts',
    kind: 'question',
    section: 'triggers',
    fact: 'dp3Conflicts',
    title: 'DP3(3): what does the scheme conflict with?',
    prompt: 'Which of these does the proposal conflict with? Select all that apply. Leave all unticked if it responds well to its context and complies with the design policies — the next step then asks, for any conflict, whether there is a clear justification.',
    quotes: ['DP3(1)', 'DP3(3)'],
    help: [
      'DP3(3) gives national "should be refused" force to a conflict, without clear justification, with DP3(1) (context), the relevant DP3(2) principles, or an explicit design standard in the development plan. Substantial weight is given to compliance with relevant development-plan design policies.',
      'Tree-cover loss is picked up separately at the DP3(2)(c) step, so it is not repeated here. Design harm that falls short of a conflict is weighed under landscape and character instead.',
      '"Explicit design standards" includes a Village Design Statement, design guide, code or masterplan adopted through a development-plan policy (the clearest dataset example is 6010826).',
    ],
    input: {
      type: 'multi',
      options: [
        { value: 'context', label: 'DP3(1) context — does not respond to the history, character and features of the site and its setting, or fails to integrate with and enhance its surroundings', help: 'Plot pattern, building line, scale, materials, or the rural/settlement edge (e.g. backland in a frontage street, 6011803 ¶20; urbanising a rural edge). The reach of DP3(1) is contested. Some inspectors apply it to harm to countryside character at the settlement edge (6008785 ¶39); one inquiry held that it "relates to matters such as on-site scale, layout, landscaping and appearance rather than to the effect of a proposal on the landscape character and visual attributes of the countryside", which falls under N2 (6008238 ¶124).' },
        { value: 'standards', label: 'An explicit design standard in the development plan — a Village Design Statement, design guide, code or masterplan', help: 'DP3(3) gives substantial weight to compliance with these (6010826).' },
        { value: 'liveability', label: 'DP3(2)(a) Liveability — mix, tenures, social interaction, robustness', help: 'An over-concentration of houses in multiple occupation harmed the balance and mix of housing, and the DP3 conflict decided S4 (6009669 ¶13, ¶22).' },
        { value: 'climate', label: 'DP3(2)(b) Climate — layout, orientation, massing, materials; overheating and net zero' },
        { value: 'nature', label: 'DP3(2)(c) Nature — green infrastructure and habitats (tree cover is the separate DP3(2)(c) step above)' },
        { value: 'movement', label: 'DP3(2)(d) Movement — walking, wheeling, cycling and public-transport connections', help: 'Car dependence has been held a conflict: "walking, wheeling, cycling and public transport is not prioritised through the introduction of a car dependent development. There is no clear justification for the conflict" (6007677 ¶27, one home; then S5(2)).' },
        { value: 'builtform', label: 'DP3(2)(e) Built form — streets, spaces, density and the pattern of buildings' },
        { value: 'publicspace', label: 'DP3(2)(f) Public space — safe, secure, inclusive, accessible spaces' },
        { value: 'identity', label: 'DP3(2)(g) Identity — attractive, distinctive, characterful development and local character' },
      ],
    },
  },
  {
    id: 'dp3',
    kind: 'judgement',
    section: 'triggers',
    fact: 'dp3',
    suggest: { fact: 'dp3Lean', extra: { none: 'Your answers show no conflict — record any lesser design harm under landscape and character', conflict: 'Your answers show a conflict — the only question here is whether it is clearly justified' } },
    notes: { fact: 'dp3Notes', label: 'Other material considerations (optional)', placeholder: 'e.g. which reading of "clear justification" you apply, and why the conflict is or is not necessary…' },
    title: 'DP3(3): is the conflict clearly justified?',
    prompt: 'For any conflict identified above, is there a clear justification — or is there no conflict at all? Answer this on its own terms; it is stricter than the S4/S5 "substantially outweighed" test.',
    quotes: ['DP3(1)', 'DP3(3)'],
    help: [
      'In a review of 157 appeals with design harm, 53 named DP3(3) and applied it, and about 20 made the clear-justification finding in so many words (e.g. 6008167 ¶21, 6006720 ¶34). It has beaten substantial housing weight (6008167 ¶21).',
      'Most other inspectors dismissed on the design harm without naming DP3(3), which reaches the result the policy points to. The error to avoid is the reverse: allowing a scheme with a design conflict after running only the S4/S5 "substantially outweighed" test, without asking whether there is clear justification (e.g. 6011253 ¶26; a council report did the same, stratford-26-00617-PIP).',
      'This step is not where a plan policy that conflicts with the Framework is handled: whether a development-plan policy keeps full weight, or is materially inconsistent with the Framework and reduced to very limited weight, is tested separately at the development-plan step (Annex A(2)) — and a conflict with a policy that has lost weight there carries correspondingly less force here. Neighbourhood-plan protection is dealt with under S6.',
    ],
    method: {
      question: 'For the conflict(s) identified, is there a clear justification — necessity, or a level benefit-harm balance?',
      steps: [
        'You identified the conflict(s) at the previous step. If there are none, answer "No conflict"; any lesser design harm is weighed under landscape and character.',
        'For a conflict, ask whether there is a clear justification. The Framework does not define the term, and inspectors read it two ways: necessity (the harm is unavoidable to deliver the development, 6008314 ¶43; 6007133 ¶59, hearing) or a level balance (the benefits outweigh the harm, 6009340 ¶22; 6008253 ¶86, hearing). Say which reading you apply.',
        'Answer on its own terms. It is a stricter question than the S4/S5 test: finding that the benefits are not "substantially outweighed" does not answer it.',
        'If there is no clear justification, the proposal "should be refused" and, under S4(2)(c)/S5(2), the benefits are likely to be substantially outweighed.',
      ],
      pointers: [
        { option: 'none', factors: ['Layout, scale, materials and plot pattern follow the surrounding context', 'Accords with the local design code, guide or Village Design Statement', 'Tree cover and green infrastructure kept or enhanced'] },
        { option: 'justified', factors: ['The conflict is necessary to deliver the development (necessity reading, 6008314 ¶43)', 'The benefits outweigh the harm on a level balance (Didcot 6009340 ¶22) — still stricter than the S4/S5 test'] },
        {
          option: 'not-justified',
          factors: [
            'Breaks the prevailing plot, building line or density pattern (6011803 ¶20)',
            'Urbanises a rural edge or introduces a suburban form',
            'Fails an explicit local standard or Village Design Statement',
            'Loss of a prominent tree without replacement (6005325 ¶23)',
            'The only justification offered is that the scheme delivers homes',
          ],
        },
      ],
      evidence: ['The development plan design policies, and any design guide, code or masterplan', 'Site and street-scene plans, elevations and a context analysis', 'The applicant\'s design and access statement: does it explain why the conflict is necessary?'],
      closeCall: 'If there is a real conflict and the justification is only that the benefits are not substantially outweighed, the question has not been answered. Either make the clear-justification finding explicitly, on a stated reading, or treat it as not shown.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'none', label: 'No conflict' },
        { value: 'justified', label: 'Conflict, but clearly justified (state the reading)' },
        { value: 'not-justified', label: 'Conflict without clear justification' },
      ],
    },
    effects: [
      { when: { eq: ['dp3', 'not-justified'] }, finding: { kind: 'trigger', policy: 'DP3(3)', text: 'Conflicts with DP3(1) or (2), or with explicit local design standards, without clear justification: DP3(3) says it "should be refused".' } },
      { when: { eq: ['dp3', 'justified'] }, finding: { kind: 'note', policy: 'DP3(3)', text: 'There is a design conflict, but it has a clear justification, so DP3(3) is not engaged.' } },
    ],
    cases: { policies: ['DP3(3)', 'DP3(1)'], groupBy: 'finding' },
    contested: {
      summary: 'What counts as a "clear justification"? The Framework does not define it, and inspectors have read it two ways.',
      readings: [
        {
          label: 'Necessity',
          summary: 'The conflict is justified only if it is needed to deliver the development: "there would be clear justification for the conflict with Framework Policy DP3" because the tree loss "would be necessary as part of the appeal development" (6008314 ¶43). Applied to refuse at a hearing: "I do not find the specific and significant harm to the character and appearance of the countryside to be necessary to achieve the substantial public benefits" (6007133 ¶59).',
        },
        {
          label: 'Level balance',
          summary: 'The conflict is justified if the benefits outweigh the harm: "There would, therefore, be clear justification for the harm that would arise, as is required by Policy DP3.3" (6009340 ¶22). At a hearing, "the substantial benefits are sufficient to provide clear justification for the conflict with Policy DP3", which caused limited harm (6008253 ¶86). The same reading has refused: substantial weight to two homes and significant weight to affordable housing "do not amount to the clear justification required by Policy DP3(3) to depart from explicit accessibility standards" (6005590 ¶46). Still stricter than the S4/S5 "substantially outweighed" test.',
        },
      ],
    },
  },
  {
    id: 'character',
    kind: 'judgement',
    section: 'triggers',
    fact: 'character',
    title: 'Landscape and character',
    prompt: 'How much harm would there be to landscape character and to the character and appearance of the area?',
    quotes: ['N2(1)(a)', 'DP3(1)'],
    method: {
      question: 'How much harm would the proposal do to landscape character and to the character and appearance of the area, and how much weight should that harm carry?',
      steps: [
        'Describe the existing character: the landscape type in any landscape character assessment, the settlement pattern, what the site contributes, and where it is seen from. N2(1)(a) asks for landscape character and the natural beauty of the countryside to be considered.',
        'Describe the change: loss of openness, urbanising features, domestic paraphernalia, lighting, and loss of trees or hedges. Separate the effect on character from the effect on particular views.',
        'Grade the harm by its extent, how widely it is seen, and how long it lasts. Lasting harm has been given substantial weight (6009852 ¶15); temporary development can still cause considerable harm (6007601 ¶22).',
        'Allow for mitigation that is secured and effective, such as landscaping that integrates the development (N2(1)(d)). New planting that takes years to mature gives less relief (6007807 ¶11).',
        'Keep this separate from DP3(3). Here the question is how much weight the harm carries in the balance. Whether a conflict with DP3(1) without clear justification means the proposal "should be refused" is the DP3(3) question, asked at the design node.',
      ],
      pointers: [
        {
          option: 'none',
          factors: ['Follows the established pattern and scale of development', 'The site contributes little to the wider landscape', 'Features of value kept, and the change is barely seen from public places'],
        },
        {
          option: 'limited',
          factors: ['Localised, and not in itself uncharacteristic of the area (6006496 ¶20)', 'Seen from few public viewpoints', 'Features of value kept'],
        },
        {
          option: 'moderate',
          factors: ['Localised loss of trees and vegetation not fully mitigated by replanting (6008314 ¶104)', 'A noticeable change to a street or lane within an already developed context'],
        },
        {
          option: 'significant',
          factors: [
            'Fails to reflect the established pattern of development, and is prominent (6010701 ¶12)',
            'Urbanises a historic lane or routeway (6005903 ¶23)',
            'Total loss of a protected tree that shapes the character of the area (6005325 ¶21–22)',
          ],
        },
        {
          option: 'substantial',
          factors: [
            'Permanently replaces open countryside with residential form and paraphernalia (6006581 ¶21–22)',
            'Lasting harm to character, given substantial weight at 6009852 ¶15',
            'Harm to a landscape valued in its own right, such as a Protected Landscape or its setting',
          ],
        },
      ],
      evidence: [
        'Landscape character assessment, and any design guide or code',
        'Landscape and visual impact assessment, or photographs from public viewpoints',
        'Views on the approaches, at gateways and from the settlement edge',
        'Landscaping scheme and how it is secured',
      ],
      closeCall: 'The Framework sets no scale for this harm. Choose the grade from extent, prominence and permanence, and give reasons. Do not reduce the grade because of the benefits; they are weighed later in the balance.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'none', label: 'None' },
        { value: 'limited', label: 'Limited' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'significant', label: 'Significant' },
        { value: 'substantial', label: 'Substantial' },
      ],
    },
    effects: (['limited', 'moderate', 'significant', 'substantial'] as const).map((w) => ({
      when: { eq: ['character', w] } as const,
      finding: { kind: 'harm' as const, policy: 'N2(1)(a)', weight: w, text: `Harm to landscape character and the character of the area, given ${w} weight.` },
    })),
    cases: { policies: ['N2', 'DP3'], tags: ['landscape-harm'], groupBy: 'outcome' },
  },
  {
    id: 's6',
    kind: 'judgement',
    section: 'triggers',
    fact: 's6',
    when: c('neighbourhoodPlan'),
    title: 'S6: neighbourhood plan',
    prompt: 'Was the neighbourhood plan made five years or less before the decision, does it allocate sites to meet its housing requirement, and does the proposal conflict with it?',
    quotes: ['S6(1)'],
    help: [
      'S6 applies to every proposal that provides housing, whatever the housing land supply position. A shortfall does not switch it off.',
      '"Made" means formally brought into force by the council after examination and referendum. S6(1)(a) counts five years from when the plan "became part of the development plan". Inspectors have counted from the date the plan was made (6007104 ¶29: made 23 June 2021, decided 24 August 2026, so S6(1)(a) failed). Under Annex B a plan is part of the development plan from its referendum, so the clock may start slightly earlier. No decision in the dataset has turned on the difference.',
      'The five years are measured to the date of the decision, not the application. A plan can drop out of S6 while an application or appeal is pending.',
      'Allocations still count while they are being delivered slowly, unless there is evidence they cannot be delivered (6007431 ¶21–23).',
      'Outside S6, a neighbourhood plan is still part of the development plan. Its policies keep their weight unless they are materially inconsistent with the Framework (Annex A(2), which includes policies in made neighbourhood plans). They are then ordinary conflicts in the balance, not an S6 trigger.',
    ],
    method: {
      question: 'Does the housing proposal conflict with a neighbourhood plan that became part of the development plan five years or less before the decision and that allocates sites to meet its identified housing requirement?',
      steps: [
        'Confirm the proposal involves the provision of housing. S6 applies whatever the housing land supply position.',
        'Find when the plan became part of the development plan, and count five years to the date of the decision (6007104 ¶29).',
        'Check the plan contains allocations to meet its identified housing requirement (see HO2). Compare the allocations with the requirement the plan identifies (6007104 ¶30). An appellant\'s challenge to the basis of an examined requirement did not succeed at 6007431 ¶22.',
        'Treat allocations that are coming forward slowly as still counting, unless there is evidence they cannot be delivered (6007431 ¶23).',
        'Name the neighbourhood plan policy the proposal conflicts with, such as a settlement boundary or allocation policy. If all three conditions are met, S6(1) says the benefits are likely to be substantially outweighed by the adverse effects.',
      ],
      pointers: [
        {
          option: 'engaged',
          factors: [
            'Plan became part of the development plan within five years of the decision date',
            'Allocations meet or exceed the plan\'s identified requirement (6007104 ¶30)',
            'Site outside the allocations and in conflict with a named plan policy (6007431 ¶21–23)',
          ],
        },
        {
          option: 'not-engaged',
          factors: [
            'Plan more than five years old at the date of decision (6007104 ¶29)',
            'No housing allocations, or allocations short of the plan\'s requirement',
            'Evidence that the allocations cannot be delivered',
            'No conflict with any neighbourhood plan policy',
          ],
        },
      ],
      evidence: [
        'The date the plan was made, and its referendum date',
        'The plan\'s housing requirement and allocation policies',
        'Evidence on delivery of the allocations',
        'The plan policy the proposal is said to conflict with',
      ],
      closeCall: 'S6 says the benefits are "likely" to be substantially outweighed. That sets the expected outcome of the balance, not an automatic refusal. Near the five-year mark, check the dates exactly, as the decision date is what counts.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'engaged', label: 'Yes to all three' },
        { value: 'not-engaged', label: 'No: older than five years, no allocations, or no conflict' },
      ],
    },
    effects: [{ when: { eq: ['s6', 'engaged'] }, finding: { kind: 'trigger', policy: 'S6(1)', text: 'Conflicts with a recent neighbourhood plan that allocates for its housing requirement: the benefits are likely to be substantially outweighed (S6(1)).' } }],
    cases: { policies: ['S6'], groupBy: 'finding' },
  },
  {
    id: 'devPlan',
    kind: 'judgement',
    section: 'triggers',
    fact: 'devPlan',
    title: 'Development plan',
    prompt: 'Does the proposal conflict with development plan policies that are not materially inconsistent with the Framework?',
    quotes: ['AnnexA(2)'],
    help: [
      'Only policies (or parts of policies) that are materially inconsistent with the national decision-making policies drop to very limited weight. Others should not lose weight simply because of their age.',
      'Locational policies that restrict housing outside settlement boundaries have commonly been held inconsistent with S5(1)(j) or GB7. Heritage, design and landscape policies have more often been held consistent (e.g. 6006475 ¶66, 6007541 ¶4), though practice varies.',
    ],
    method: {
      question: 'Which development plan policies does the proposal conflict with, and has each of them, or the part engaged, kept its weight under Annex A(2)?',
      steps: [
        'Start with the development plan. The decision must be made in accordance with it unless material considerations indicate otherwise (section 38(6)). Name each policy the proposal conflicts with.',
        'For each policy, identify the part engaged and ask whether that part is materially inconsistent with a specific national decision-making policy. Name that policy: for example, a restriction on development outside settlement boundaries against S5 (6001260 ¶28), or plan policies that bar limited infilling outside settlements, which S5 supports (6008773 ¶27).',
        'Give very limited weight only to the inconsistent part. The rest of the policy, and related policies that are consistent, keep their weight (6005809 ¶76). Policies examined and adopted or made against this Framework are the exception and are not reduced.',
        'Do not reduce the weight of a consistent policy because of its age. Annex A(2) gives no basis for reducing it because of under-delivery or the lack of a five-year supply either; that is the 2024 "out-of-date" route (seen at 6008785 ¶38 and 6007466 ¶25).',
        'Weigh what remains. Conflict with policies that keep their weight is conflict with the starting point for the decision.',
      ],
      pointers: [
        { option: 'none', factors: ['The proposal accords with the plan read as a whole', 'Any departures are minor and resolved by condition'] },
        {
          option: 'limited',
          factors: [
            'The conflict is only with the part of a policy that is materially inconsistent with the Framework (6001260 ¶28)',
            'The conflict with a consistent policy is minor in its effect on this site',
          ],
        },
        {
          option: 'significant',
          factors: [
            'Conflict with design, heritage or landscape policies held consistent with the Framework (6008359 ¶23; 6007541 ¶4)',
            'Conflict with parts of the spatial strategy that are not inconsistent (6005809 ¶76)',
            'Conflict with a plan examined and adopted or made against this Framework',
          ],
        },
      ],
      evidence: [
        'The development plan policies cited, and the part of each that is engaged',
        'The Framework policy each is said to be inconsistent with',
        'Adoption dates, and whether any plan was examined against this Framework',
        'Recent appeal decisions on the same policies',
      ],
      closeCall: 'The default is that a policy keeps its weight. It drops to very limited weight only where a specific part is shown to be materially inconsistent with a specific national decision-making policy. A general claim that the plan is old or out of date does not do that.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'none', label: 'No conflict' },
        { value: 'limited', label: 'Some conflict: limited weight' },
        { value: 'significant', label: 'Clear conflict with policies that keep their weight' },
      ],
    },
    effects: [
      { when: { eq: ['devPlan', 'limited'] }, finding: { kind: 'harm', policy: 's38(6)', weight: 'limited', text: 'Conflict with development plan policies, given limited weight.' } },
      { when: { eq: ['devPlan', 'significant'] }, finding: { kind: 'harm', policy: 's38(6)', weight: 'significant', text: 'Conflict with development plan policies that are not materially inconsistent with the Framework (Annex A(2)); the plan is the starting point (s38(6)).' } },
    ],
    cases: { policies: ['Transitional(2)', 'AnnexA(2)'], groupBy: 'finding' },
    contested: {
      summary: 'Which local policies are "materially inconsistent", and can a consistent policy still lose weight? Inspectors have applied Annex A(2) in three ways, and not always with the very limited weight it prescribes. Across the 96 appeal letters to 30 Sep 2026 that weigh a plan policy against the Framework, spatial restrictions (settlement boundaries, countryside restraint) were cut in 30 of 45 letters, 16 for a named conflict with S4/S5 and 13 for housing supply; heritage, design, amenity and access policies kept their weight in 38 of 39.',
      readings: [
        {
          label: 'Part by part: only the inconsistent part loses weight',
          summary: 'At 6005809 ¶76 the "restrictive elements" of two spatial policies were materially inconsistent with the Framework, while three related policies kept great weight (the inspector gave the restrictive parts limited, not very limited, weight). At 6001260 ¶28 only the aspects restricting development outside settlement boundaries were given very limited weight, and the conflict still counted.',
          cases: { policies: ['Transitional(2)'], tags: ['materially-inconsistent-very-limited-weight'] },
        },
        {
          label: 'Held consistent: full weight',
          summary: 'Design, heritage and landscape policies are commonly held consistent and keep full weight (6008359 ¶23, 6007541 ¶4, 6006475 ¶66).',
          cases: { policies: ['Transitional(2)'], tags: ['plan-led'] },
        },
        {
          label: 'Consistent, but reduced for housing supply',
          summary: 'The spatial strategy is found consistent, then given moderate weight "considering the lack of a 5-year housing land supply" (6008785 ¶38), or because it is "not delivering a sufficient supply of homes" (6007466 ¶25). The same route helped a hearing appeal succeed: "given that the housing land supply shortfall is substantial, I give conflict with the relevant policies limited weight" (6008253 ¶39). Annex A(2) gives no basis for this: its only ground for reduced weight is material inconsistency. The reduction follows the 2024 "out-of-date" approach. Conversely, one inspector found spatial policies materially inconsistent with S5 but gave the conflict "only moderate weight" rather than very limited (6007352 ¶25).',
        },
      ],
    },
  },
];
