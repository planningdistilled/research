import type { GraphNode } from '../../src/engine/types';

const inGB = { in: ['gb', ['yes', 'washed-over']] } as const;
const cat = (c: string) => ({ all: [inGB, { eq: ['gb7cat', c] }] }) as const;
// Grey belt (g)(i) is now a multi-select of purposes (a), (b), (d). The land is grey belt when none is ticked.
const anyGreyBeltPurpose = { any: [{ has: ['greyBelt', 'a'] }, { has: ['greyBelt', 'b'] }, { has: ['greyBelt', 'd'] }] } as const;
const isGreyBelt = { not: anyGreyBeltPurpose } as const;
const passFail = (passLabel: string, failLabel: string) => ({
  type: 'single' as const,
  options: [
    { value: 'pass', label: passLabel },
    { value: 'fail', label: failLabel },
  ],
});

// GB6 and GB7: is the development inappropriate? Categories are offered according to the proposal type.
export const greenbelt: GraphNode[] = [
  {
    id: 'gb7cat',
    kind: 'question',
    section: 'greenbelt',
    fact: 'gb7cat',
    when: inGB,
    whyShown: 'The site is in the Green Belt: GB6(1) makes development inappropriate unless it falls in a GB7 category.',
    title: 'GB7 category',
    prompt: 'Which GB7 category does the proposal rely on to be "not inappropriate"?',
    quotes: ['GB6(1)', 'GB7(1)'],
    help: [
      'Choose the category the application relies on. If it argues more than one, run the tool again for each.',
      'Categories that cannot apply to the proposal type you chose are not offered.',
      'Each category is a separate test in the steps that follow. The last option, GB7(1)(g), is the residual route: choose it when the scheme relies on grey belt or when none of the specific categories fit. If it is not grey belt, or another part of (g) fails, the proposal is inappropriate development, approvable only in very special circumstances where the harm is clearly outweighed (GB6(2)) — and the tool records the reason.',
    ],
    input: {
      type: 'single',
      options: [
        { value: 'b', label: 'GB7(1)(b): reuse, extension, alteration or replacement of an existing building', when: { eq: ['devType', 'reuse-replacement'] } },
        { value: 'c', label: 'GB7(1)(c): limited infilling in a village lying within the Green Belt', when: { eq: ['gb', 'washed-over'] } },
        { value: 'd', label: 'GB7(1)(d): limited affordable housing for local community needs', when: { eq: ['devType', 'affordable-local'] } },
        { value: 'e', label: 'GB7(1)(e): redevelopment of previously developed land', when: { in: ['devType', ['pdl', 'reuse-replacement']] } },
        { value: 'h', label: 'GB7(1)(h): land around a well-connected station', when: { has: ['constraints', 'station'] } },
        {
          value: 'g',
          label: 'GB7(1)(g): grey belt — or none of the categories above apply',
          help: 'This is the residual route. Choose it if the scheme relies on grey belt, or if none of the categories above fit. The next steps test it in four parts: (i) is it grey belt, and would it not fundamentally undermine the Green Belt; (ii) is there an evidenced unmet need; (iii) is it a sustainable location (TR3); and (iv) for major development, the Golden Rules (GB8). If it is not grey belt, or any part fails, the tool records why and treats the proposal as inappropriate development (GB6).',
        },
      ],
    },
    cases: { policies: ['GB7(1)'], context: ['green-belt'], groupBy: 'finding', label: 'GB7 category findings' },
  },
  {
    id: 'gb7gPlan',
    kind: 'info',
    section: 'greenbelt',
    fact: 'gb7gPlanAck',
    when: cat('g'),
    whyShown: 'You are relying on GB7(1)(g), which is tested in four parts.',
    title: 'GB7(1)(g): how this is tested',
    prompt: 'Grey belt development is "not inappropriate" only if all four parts are met. The next steps take them in turn.',
    quotes: ['GB7(1)', 'GB6(2)'],
    help: [
      '(i) Grey belt. The land must meet the Annex B grey belt definition — it must not strongly contribute to Green Belt purposes (a), (b) or (d) — and the development must not fundamentally undermine the purposes of the remaining Green Belt.',
      '(ii) Unmet need. There must be an evidenced unmet need. For housing, footnote 41 makes this a five-year-supply or Housing Delivery Test question.',
      '(iii) Sustainable location. The site must be a sustainable location, with particular reference to policy TR3.',
      '(iv) Golden Rules. Major development must also comply with GB8.',
      'If any part is not met, GB7(1)(g) does not apply and the proposal is inappropriate development — approvable only in very special circumstances, where the harm is clearly outweighed (GB6(2)).',
    ],
    input: { type: 'ack' },
  },
  {
    id: 'gb7b',
    kind: 'judgement',
    section: 'greenbelt',
    fact: 'gb7b',
    when: cat('b'),
    title: 'GB7(1)(b): existing building',
    prompt:
      'Is the existing building of permanent and substantial construction and lawful, and would any extension or alteration avoid a disproportionate increase over the original building (or a replacement be for the same use and not materially larger)?',
    quotes: ['GB7(1)(b)'],
    help: ['"Original building" means the building as it existed on 1 July 1948, or as originally built if later (footnote 40).'],
    method: {
      question: 'Is the existing building permanent, substantial and lawful, and is what is proposed within the size limit that applies to its type of work?',
      steps: [
        'Say which of the four the proposal is: reuse, extension, alteration or replacement. The size test differs between them.',
        'Check the existing building. It must be of permanent and substantial construction and lawful in planning terms. A temporary or unlawful structure does not qualify.',
        'For an extension or alteration, compare the building as it would be, with all previous additions, against the original building (footnote 40), not against the building as it stands now (6008745 ¶8, ¶10). Use floorspace, volume, footprint and external dimensions together; the test is not a percentage rule.',
        'For a replacement, ask whether it is for the same use and not materially larger than the building it replaces. Here the comparison is with the existing building.',
        'If every condition is met, the proposal is not inappropriate. Openness is not then assessed separately (6010603 ¶16).',
      ],
      pointers: [
        {
          option: 'pass',
          factors: [
            'A modest cumulative increase, with footprint and external dimensions little changed (about 39–42% floorspace was found not disproportionate, 6010603 ¶12–15)',
            'A replacement for the same use, of similar footprint, height and volume',
            'A reuse that needs no major rebuilding of the structure',
          ],
        },
        {
          option: 'fail',
          factors: [
            'Earlier extensions have already enlarged the original building substantially (about 93.5% by volume, plus 13% proposed, 6008745 ¶9)',
            'The proposal is modest on its own, but the cumulative total against the original is not',
            'A replacement for a different use, or noticeably larger in footprint, height or bulk',
            'The existing building is not lawful, or is not of permanent and substantial construction',
          ],
        },
      ],
      evidence: ['Plans or records of the original building (as at 1 July 1948, or as first built)', 'The planning history of every later extension', 'Floorspace and volume figures for original, existing and proposed, with the method used', 'For a replacement: the lawful use and size of the building being replaced'],
      closeCall: 'Where the figures are near the line, the decision turns on how the increase would appear in size and bulk against the original building. Record the comparison and the reasons; a percentage alone does not settle it.',
    },
    input: passFail('Yes: all conditions met', 'No: at least one condition is not met'),
    effects: [
      { when: { eq: ['gb7b', 'pass'] }, finding: { kind: 'pass', policy: 'GB7(1)(b)', text: 'Falls within GB7(1)(b), so it is not inappropriate development.' } },
      { when: { eq: ['gb7b', 'fail'] }, finding: { kind: 'fail', policy: 'GB7(1)(b)', text: 'Does not meet GB7(1)(b), so it is inappropriate development.' } },
    ],
    cases: { policies: ['GB7(1)(b)'], groupBy: 'finding' },
  },
  {
    id: 'gb7c',
    kind: 'judgement',
    section: 'greenbelt',
    fact: 'gb7c',
    when: cat('c'),
    title: 'GB7(1)(c): limited infilling in a village',
    prompt: 'Is the site in the village (as it exists on the ground), and is the proposal limited infilling?',
    quotes: ['GB7(1)(c)'],
    help: [
      'Whether a site is "in a village" is a matter of judgement on the ground; a settlement boundary in the plan is relevant but not decisive.',
      'Infilling usually means filling a small gap in an otherwise built-up frontage.',
    ],
    method: {
      question: 'Is the site within the village as it is on the ground, and would the proposal fill a small gap in existing development rather than extend it?',
      steps: [
        'Check the village is washed over by the Green Belt. A village inset from the Green Belt does not need this category.',
        'Decide whether the site is in the village, looking at the built form on the ground. A settlement boundary in the plan is relevant but not decisive.',
        'Decide whether the proposal is infilling: a gap enclosed by existing development, usually within a built-up frontage or group. Land that is open to the countryside on one or more sides is more likely to be an extension of the village.',
        'Decide whether it is limited, in the number and size of buildings compared with the gap and with the village. The Framework gives no number.',
        'There is no separate openness test in GB7(1)(c). If the proposal is limited infilling in the village, it is not inappropriate.',
      ],
      pointers: [
        {
          option: 'pass',
          factors: [
            'A plot between existing buildings on the same frontage, inside the built-up part of the village',
            'One or two dwellings of a size and plot pattern similar to their neighbours',
            'The site reads as part of the village, not as open land beside it',
          ],
        },
        {
          option: 'fail',
          factors: [
            'The site is at the edge of the village and remains visually connected to open countryside (under S5(1)(e), which uses similar words, inspectors have treated such sites as extensions, not infill: 6009618 ¶34–35)',
            'The site sits among scattered dwellings detached from the village',
            'The scale is more than the gap can take, or backland plots are added behind the frontage',
          ],
        },
      ],
      evidence: ['A plan of the gap and its neighbouring buildings, with frontage widths', 'Site photographs showing the boundaries on each side', 'The plan\'s settlement or village boundary, if any, and any local definition of infilling'],
      closeCall: 'Each element must be met: in the village, infilling, and limited. Few 2026 appeals analyse GB7(1)(c). One, on a non-residential scheme, applied the on-the-ground approach: where "there is not a discernible group of closely associated residential buildings, which would be expected within a village", the site was not in a village (6010709 ¶8–9), and a 1.3 hectare site was not limited infilling (¶10–11). Otherwise the judgement rests on the site facts and the earlier case law.',
    },
    input: passFail('Yes: limited infilling in the village', 'No'),
    effects: [
      { when: { eq: ['gb7c', 'pass'] }, finding: { kind: 'pass', policy: 'GB7(1)(c)', text: 'Limited infilling in a village within the Green Belt, so it is not inappropriate development.' } },
      { when: { eq: ['gb7c', 'fail'] }, finding: { kind: 'fail', policy: 'GB7(1)(c)', text: 'Not limited infilling in a village, so it is inappropriate development.' } },
    ],
    cases: { policies: ['GB7(1)(c)', 'S5(1)(e)'], groupBy: 'finding' },
  },
  {
    id: 'gb7d',
    kind: 'judgement',
    section: 'greenbelt',
    fact: 'gb7d',
    when: cat('d'),
    title: 'GB7(1)(d): limited affordable housing',
    prompt: 'Is the proposal limited affordable housing for local community needs under Framework or development plan policies (for instance a rural exception site)?',
    quotes: ['GB7(1)(d)'],
    method: {
      question: 'Is this a limited amount of affordable housing, meeting an evidenced local community need, brought forward under a Framework or development plan policy that provides for it?',
      steps: [
        'Name the policy relied on: for example HO10(1)(a) (rural exception sites) or a development plan exception-site policy. GB7(1)(d) needs such a policy basis.',
        'Check the need is local and evidenced. HO10(1)(a) asks for a local housing needs survey or secondary data no more than five years old.',
        'Check the homes are affordable housing as Annex B defines it, and that they would be secured for local people in perpetuity (the Annex B definition of rural exception sites).',
        'If market homes are included, check they are shown to be essential to deliver the affordable homes without grant funding (HO10(2)(c) and the Annex B definition).',
        'Decide whether the scheme is limited, in relation to the evidenced need and the size of the place. Unless the development plan says otherwise, HO10(2)(b) sets a size limit for exception sites.',
      ],
      pointers: [
        {
          option: 'pass',
          factors: [
            'A recent housing needs survey for the parish shows the number and type of homes proposed',
            'A planning obligation secures affordable tenure in perpetuity and a local connection',
            'The number of homes matches the identified need',
          ],
        },
        {
          option: 'fail',
          factors: [
            'The need evidence does not relate to the local community, or is more than five years old',
            'A large share of market homes with no viability evidence that they are needed to fund the affordable homes',
            'More homes than the local need, or beyond the HO10(2)(b) or plan size limit',
            'No mechanism to keep the homes affordable, or for local people',
          ],
        },
      ],
      evidence: ['The local housing needs survey or secondary data, with its date', 'The development plan exception-site policy, if any', 'The draft planning obligation (tenure, perpetuity, local connection)', 'Viability evidence for any market homes'],
      closeCall: 'The applicant must show the local need and the policy basis. If either is missing or out of date, the category is not met.',
    },
    input: passFail('Yes', 'No'),
    effects: [
      { when: { eq: ['gb7d', 'pass'] }, finding: { kind: 'pass', policy: 'GB7(1)(d)', text: 'Limited affordable housing for local community needs, so it is not inappropriate development.' } },
      { when: { eq: ['gb7d', 'fail'] }, finding: { kind: 'fail', policy: 'GB7(1)(d)', text: 'Does not meet GB7(1)(d), so it is inappropriate development.' } },
    ],
  },
  {
    id: 'gb7e',
    kind: 'judgement',
    section: 'greenbelt',
    fact: 'gb7e',
    when: cat('e'),
    title: 'GB7(1)(e): previously developed land',
    prompt: 'Is the land previously developed land as Annex B defines it, and would the redevelopment avoid substantial harm to the openness of the Green Belt?',
    quotes: ['GB7(1)(e)', 'AnnexB:PDL'],
    help: ['Annex B excludes land last occupied by agricultural or forestry buildings, and remains that have blended into the landscape.'],
    method: {
      question: 'Is the whole site previously developed land as Annex B defines it, is the proposal its redevelopment, and would it stop short of substantial harm to openness?',
      steps: [
        'Test the land against Annex B: lawfully developed, occupied by a permanent structure or fixed surface infrastructure, with its curtilage (not assuming the whole curtilage should be developed). Check each exclusion: agricultural or forestry buildings, land with restoration provision, land in built-up areas such as residential gardens, and remains that have blended into the landscape.',
        'Check the whole site. Where a necessary part, such as a garden, is not PDL (previously developed land), inspectors have held the category is not met (6011330 ¶9). A garden outside a built-up area can be PDL (6012162 ¶8–9); one in a built-up area is not (6011803 ¶19).',
        'Check it is redevelopment. A material change of use to residential is included. Extending a building that stays in place is not redevelopment (6008579 ¶12); consider it under GB7(1)(b).',
        'Assess openness in spatial and visual terms against what is there now: footprint, height, volume, spread across the site, and visibility.',
        'Ask only whether the harm to openness would be substantial. GB7(1)(e) has no purposes test and no "greater impact" test; the purposes test with "significant conflict" belongs to GB7(1)(f).',
      ],
      pointers: [
        {
          option: 'pass',
          factors: [
            'New building on existing hardstanding or the footprint of lawful buildings',
            'Similar or reduced volume and height compared with what is there; a larger building is not ruled out, as size "is not the test" under GB7(1)(e) (6010198 ¶14), and moderate harm to openness fell short of substantial (6007335 ¶8)',
            'A garden or curtilage outside a built-up area, with modest new built form (6012763 ¶10)',
          ],
        },
        {
          option: 'not-pdl',
          factors: [
            'Land last used for agricultural or forestry buildings, or open grazing land',
            'A residential garden inside a built-up area',
            'Part of the site needed for the scheme lies beyond the curtilage of the developed land (6011330 ¶7–9)',
            'Former structures that have blended into the landscape',
          ],
        },
        { option: 'openness', factors: ['Built form spreads over land that is open now', 'A large increase in height, volume or footprint over what exists', 'Development visible from public viewpoints across open land'] },
      ],
      evidence: ['Lawful use history: permissions, certificates of lawfulness, dated aerial photographs', 'A plan of existing structures, hardstanding and curtilage against the site boundary', 'Existing and proposed footprint, volume and height figures'],
      closeCall: 'Some harm to openness does not take a scheme out of GB7(1)(e); the harm must be substantial. One inspector called substantial harm "a high threshold" (6011330 ¶10). If part of the site is not PDL, answer that first.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'pass', label: 'Yes: PDL, and no substantial harm to openness' },
        { value: 'not-pdl', label: 'No: the land is not PDL' },
        { value: 'openness', label: 'No: substantial harm to openness' },
      ],
    },
    effects: [
      { when: { eq: ['gb7e', 'pass'] }, finding: { kind: 'pass', policy: 'GB7(1)(e)', text: 'Redevelopment of previously developed land without substantial harm to openness, so it is not inappropriate development.' } },
      { when: { eq: ['gb7e', 'not-pdl'] }, finding: { kind: 'fail', policy: 'AnnexB:PDL', text: 'The land is not previously developed land as defined in Annex B, so GB7(1)(e) does not apply and the proposal is inappropriate development (GB6).' } },
      { when: { eq: ['gb7e', 'openness'] }, finding: { kind: 'fail', policy: 'GB7(1)(e)', text: 'Redevelopment would cause substantial harm to openness, so it is inappropriate development.' } },
    ],
    cases: { policies: ['GB7(1)(e)', 'AnnexB:PDL'], groupBy: 'finding' },
  },
  {
    id: 'greyBelt',
    kind: 'judgement',
    section: 'greenbelt',
    fact: 'greyBelt',
    when: cat('g'),
    title: 'GB7(1)(g)(i): is it grey belt?',
    prompt: 'Judged on the ground, which of Green Belt purposes (a), (b) and (d) does the land strongly contribute to? Tick each that applies. Leave all unticked if it does not strongly contribute to any — that makes the land grey belt.',
    quotes: ['AnnexB:grey-belt', 'GB2(1)', 'AnnexE(3)', 'AnnexE(4)', 'AnnexE(5)'],
    help: [
      'This is a planning judgement about the site, not a check against a map. Grey belt is a label for Green Belt land that meets the Annex B definition, not a designation. A council\'s Green Belt assessment is evidence, but it does not settle the question.',
      'Only purposes (a), (b) and (d) count for grey belt. Purpose (c), encroachment on the countryside, and purpose (e), regeneration, do not — so they are not listed below.',
      'A strong contribution to any one of (a), (b) or (d) excludes the land from grey belt. Tick none and the land is grey belt; the next step then tests whether the development would fundamentally undermine the wider Green Belt.',
      'Annex E: villages are not "large built-up areas" for purpose (a); purpose (b) concerns towns merging, not villages; purpose (d) concerns historic towns, not villages. Inspectors apply Annex E directly on this point (e.g. 6011103 ¶12, 6007428 ¶10).',
    ],
    method: {
      question: 'Judged on the site itself, does it make a strong contribution to checking the sprawl of a large built-up area, to keeping towns apart, or to the setting and character of a historic town?',
      steps: [
        'Set aside purposes (c) and (e). Encroachment on the countryside does not decide grey belt status (6010471 ¶12).',
        'Purpose (a): is the site adjacent or near to a large built-up area? A village is not one (Annex E), unless it has in effect been absorbed into a larger conurbation (3378284 ¶36). A village that now forms "a continuous urban form" with a town, and that the Local Plan treats with it, has been held part of the same large built-up area (6008723 ¶14). If it is, apply the Annex E strong features: free of development, no physical feature nearby to contain development, and development would form an incongruous pattern such as a finger into the Green Belt.',
        'Purpose (b): does the site form a substantial part of a gap between towns (including cities), so that developing it would be likely to lose their visual separation? Gaps between villages do not count.',
        'Purpose (d): is the site part of the setting of a historic town, making a considerable contribution to its special character? Villages do not count.',
        'Assess the site, not the wider parcel. Use the council\'s Green Belt assessment as evidence, and check its rating against the site\'s own boundaries and containment (6010471 ¶15; followed where it matched the facts, 6009281 ¶15–16).',
        'If the contribution to any one of (a), (b) or (d) is strong, answer "Yes". Otherwise the land is grey belt.',
      ],
      pointers: [
        {
          option: 'a',
          factors: [
            'Tick (a) where the site is open land at the edge of a large built-up area (a town or city), open to further Green Belt with no containing feature, so development would push a finger of built form out (6009281 ¶15–16)',
            'Excluded (Annex E): a village is not a large built-up area, so a village edge does not count (6011103 ¶12, 6007428 ¶10)',
            'Leave unticked where the site is enclosed by development, roads or strong planting, or already contains development',
          ],
        },
        {
          option: 'b',
          factors: [
            'Tick (b) where the site is a substantial part of a narrow gap between two towns (or cities), so developing it would risk losing their visual separation',
            'Excluded: gaps between villages do not count',
          ],
        },
        {
          option: 'd',
          factors: [
            'Tick (d) where the site is part of the open setting of a historic town and makes a considerable contribution to its special character',
            'Excluded: villages do not count',
          ],
        },
      ],
      evidence: ['The council\'s Green Belt assessment, the parcel rating and the reasons for it', 'A plan showing the site against nearby towns, gaps and containing features', 'Site photographs from the boundaries and from public viewpoints'],
      closeCall: 'Annex E\'s strong category expects all of its listed features. Where one or more weakening features is present (containment, existing development, a small part of a gap), the contribution is more likely moderate, and moderate land is grey belt. Harm to countryside or openness is weighed elsewhere, not here.',
    },
    input: {
      type: 'multi',
      options: [
        { value: 'a', label: '(a) Checking the unrestricted sprawl of a large built-up area', help: 'Annex E: a village is not a large built-up area. This counts only at the edge of a genuine town or city.' },
        { value: 'b', label: '(b) Preventing neighbouring towns from merging into one another', help: 'Concerns towns and cities merging, not villages. A gap between villages does not count.' },
        { value: 'd', label: '(d) Preserving the setting and special character of historic towns', help: 'Concerns historic towns, not villages.' },
      ],
    },
    effects: [
      { when: isGreyBelt, finding: { kind: 'pass', policy: 'AnnexB:grey-belt', text: 'The land is grey belt: it does not strongly contribute to purposes (a), (b) or (d).' } },
      { when: anyGreyBeltPurpose, finding: { kind: 'fail', policy: 'AnnexB:grey-belt', text: 'The land strongly contributes to purpose (a), (b) or (d), so it is not grey belt: GB7(1)(g) cannot apply and the proposal is inappropriate development (GB6).' } },
    ],
    cases: { policies: ['AnnexB:grey-belt', 'GB7(1)(g)(i)'], groupBy: 'finding', label: 'Grey belt findings' },
  },
  {
    id: 'greyBeltUndermine',
    kind: 'judgement',
    section: 'greenbelt',
    fact: 'greyBeltUndermine',
    when: { all: [cat('g'), isGreyBelt] },
    whyShown: 'The land is grey belt (it does not strongly contribute to purposes (a), (b) or (d)), so the wider test — whether development would fundamentally undermine the remaining Green Belt — applies.',
    title: 'GB7(1)(g)(i): would it fundamentally undermine the Green Belt?',
    prompt: 'Would the development fundamentally undermine the purposes (taken together) of the remaining Green Belt across the area of the plan?',
    quotes: ['GB7(1)(g)(i)'],
    help: [
      'This is rarely met, so the answer is usually "No". Across the decisions reviewed, no scheme was found to fundamentally undermine the remaining Green Belt. A "Yes" needs a genuinely plan-wide effect, not just local harm to the site and its edges.',
      'The test is plan-wide and weighs all five Green Belt purposes together: (a) checking the unrestricted sprawl of large built-up areas; (b) preventing neighbouring towns merging into one another; (c) safeguarding the countryside from encroachment; (d) preserving the setting and special character of historic towns; and (e) assisting urban regeneration. It is wider than the grey belt question, which uses only (a), (b) and (d).',
      'Decisions on small village-edge schemes have usually found the effect limited (e.g. stratford-26-00617-PIP, stratford-26-00918-PIP).',
    ],
    method: {
      question: 'After this development, could the remaining Green Belt across the plan area still serve the five purposes, taken together?',
      steps: [
        'Identify the plan area and the extent of Green Belt within it.',
        'Consider all five purposes together, including (c) encroachment and (e) regeneration. This is wider than the grey belt question.',
        'Compare the size and position of the site with the remaining Green Belt in the plan area (6005916 ¶18).',
        'Ask whether the rest of the Green Belt could still serve its purposes "in a meaningful way" (6006497 ¶28, inquiry; 3378284 ¶41).',
      ],
      pointers: [
        { option: 'no', factors: ['The site is a very small fraction of the plan area\'s Green Belt (6005916 ¶18)', 'The effects are local to the site and its edges', 'The remaining Green Belt around the settlement stays continuous'] },
        { option: 'yes', factors: ['The site is a large share of a small or narrow Green Belt in the plan area', 'Development would break the continuity of the Green Belt, so that the land beyond could no longer serve its purposes'] },
      ],
      evidence: ['The Green Belt area of the plan, and a plan showing the site within it', 'The council\'s Green Belt assessment, for the role of surrounding land'],
      closeCall: 'The word is "fundamentally", and the scale is the whole plan area. Local harm to openness or countryside does not meet it on its own. In the decisions reviewed, no decision found that a scheme would fundamentally undermine the remaining Green Belt.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'no', label: 'No' },
        { value: 'yes', label: 'Yes' },
      ],
    },
    effects: [
      { when: { eq: ['greyBeltUndermine', 'no'] }, finding: { kind: 'pass', policy: 'GB7(1)(g)(i)', text: 'Uses grey belt land and would not fundamentally undermine the remaining Green Belt.' } },
      { when: { eq: ['greyBeltUndermine', 'yes'] }, finding: { kind: 'fail', policy: 'GB7(1)(g)(i)', text: 'Would fundamentally undermine the purposes of the remaining Green Belt, so GB7(1)(g) cannot apply and the proposal is inappropriate development (GB6).' } },
    ],
    cases: { policies: ['GB7(1)(g)(i)'], groupBy: 'finding' },
  },
  {
    id: 'unmetNeedCheck',
    kind: 'info',
    section: 'greenbelt',
    fact: 'unmetNeedAck',
    when: cat('g'),
    title: 'GB7(1)(g)(ii): evidenced unmet need',
    prompt:
      'For housing, footnote 41 makes this limb mechanical: there is unmet need if the authority lacks a five-year supply (with buffer) or its Housing Delivery Test result was below 75%. The finding follows from your earlier answers.',
    quotes: ['GB7(1)(g)(ii)', 'GB7-fn41'],
    input: { type: 'ack' },
    effects: [
      { when: { eq: ['unmetNeed', true] }, finding: { kind: 'pass', policy: 'GB7(1)(g)(ii)', text: 'There is an evidenced unmet need for housing (footnote 41).' } },
      { when: { ne: ['unmetNeed', true] }, finding: { kind: 'fail', policy: 'GB7(1)(g)(ii)', text: 'An evidenced unmet need is not shown on the supply and delivery answers given.' } },
    ],
    cases: { policies: ['GB7(1)(g)(ii)'], groupBy: 'finding' },
  },
  {
    id: 'gb7h',
    kind: 'judgement',
    section: 'greenbelt',
    fact: 'gb7h',
    when: cat('h'),
    title: 'GB7(1)(h): land around a well-connected station',
    prompt: 'Does the proposal meet every limb of GB7(1)(h), applying the Annex B definitions of "well-connected station" and "reasonable walking distance"?',
    quotes: ['GB7(1)(h)', 'AnnexB:well-connected-station', 'AnnexB:reasonable-walking-distance'],
    help: [
      'A well-connected station needs at least four trains an hour overall, or two an hour in one direction, through the daytime on a normal weekday, and must be within a top-80 Travel to Work Area by GVA.',
      'Only the part of a site within reasonable walking distance qualifies (Annex B).',
      'An hourly or two-hourly rural service does not qualify (e.g. 6006637 ¶18).',
    ],
    method: {
      question: 'Is the station well-connected as Annex B defines it, is the site within reasonable walking distance of it, and are the other four limbs of GB7(1)(h) met?',
      steps: [
        'Check the station. It must be in a top-80 Travel to Work Area by GVA (Gross Value Added) (footnote 72), and the normal weekday timetable must give at least four trains or trams an hour overall, or two an hour in one direction, throughout the daytime. A reasonable prospect of that service through planned upgrades or agreement with the operator also counts (Annex B).',
        'Measure the walking route, not the straight line. Around 800 metres, or around 10 minutes where topography, route quality or barriers would discourage walking that far. Only the part of the site within that distance can rely on this category (Annex B).',
        'Check the site is physically well-related to the station or to the settlement the station serves.',
        'Check the scale can be accommodated by existing or proposed infrastructure, and that it would not prejudice any proposals for long-term comprehensive development in the same location.',
        'If the proposal is major development, check it complies with GB8 (the Golden Rules). The tool asks the separate Golden Rules question only for GB7(1)(g), so judge it here.',
      ],
      pointers: [
        {
          option: 'pass',
          factors: [
            'Published timetable shows four or more services an hour, or two or more each way, through the weekday daytime',
            'A measured walking route of around 800 metres, on made footways',
            'The site adjoins the built-up area around the station',
            'Infrastructure providers confirm capacity, or improvements are secured',
          ],
        },
        {
          option: 'fail',
          factors: [
            'Fewer than four services an hour overall and fewer than two in each direction (6006637 ¶18)',
            'The walking route is well beyond 800 metres, even if pleasant (about twice the distance failed, 6004144 ¶29)',
            'The site is separated from the station and its settlement by open land or a barrier',
            'Development would cut across an emerging allocation or wider scheme for the same area',
          ],
        },
      ],
      evidence: ['The current weekday timetable for the station, both directions', 'The Travel to Work Area and its GVA ranking', 'A measured walking route plan from each part of the site to the station entrance', 'For major development: the affordable housing, infrastructure and green space offer (GB8)'],
      closeCall: 'Every limb must be met. The frequency test is a number: check it against the timetable. Agreement between the parties is not evidence of frequency, distance or relationship; record the figures (compare 3378284 ¶43 and 6006286 ¶21, where location limbs of GB7(1)(g) were accepted on agreement alone).',
    },
    input: passFail('Yes: every limb is met', 'No'),
    effects: [
      { when: { eq: ['gb7h', 'pass'] }, finding: { kind: 'pass', policy: 'GB7(1)(h)', text: 'Meets GB7(1)(h), so it is not inappropriate development.' } },
      { when: { eq: ['gb7h', 'fail'] }, finding: { kind: 'fail', policy: 'GB7(1)(h)', text: 'Does not meet GB7(1)(h): the station is not well-connected, or the site is not within reasonable walking distance, so the proposal is inappropriate development (GB6).' } },
    ],
    cases: { policies: ['GB7(1)(h)', 'S5(1)(h)'], groupBy: 'finding' },
  },
];

// Placed after the TR3 module, because (iv) follows (iii).
export const greenbeltAfterTr3: GraphNode[] = [
  {
    id: 'gb8',
    kind: 'judgement',
    section: 'greenbelt',
    fact: 'gb8',
    when: { all: [cat('g'), { eq: ['major', true] }] },
    whyShown: 'Major housing development relying on GB7(1)(g) must comply with the Golden Rules.',
    title: 'GB7(1)(g)(iv): Golden Rules',
    prompt: 'Does the proposal comply with GB8: affordable housing at the required level, necessary infrastructure improvements, and new or improved green space accessible to the public?',
    quotes: ['GB7(1)(g)(iv)', 'GB8(1)', 'GB8(2)'],
    help: [
      'GB8 does not apply to every major scheme. Footnote 43 excludes traveller sites, land released from the Green Belt through a plan adopted before 12 December 2024, and development permitted before that date; for those, the Golden Rules are not a requirement.',
      'Where GB8 does apply and there is no development plan requirement, the default affordable level is 15 percentage points above the highest existing affordable requirement, capped at 50%; 50% where there is no existing requirement (GB8(1)(a)(ii)). Footnote 44 sets out the limited circumstances in which the cap does not apply.',
    ],
    method: {
      question: 'Would the proposal make all three Golden Rules contributions, secured, at the level GB8 requires?',
      steps: [
        'Confirm GB8 applies: major development involving housing (10 or more homes, or a site of 0.5 hectares or more; Annex B). Footnote 43 excludes traveller sites, land released through plans adopted before 12 December 2024, and sites permitted before that date.',
        'Affordable housing: find the level. Use the development plan requirement for Green Belt land (HO5(1)(a)(ii)) if there is one. If not, 15 percentage points above the highest existing requirement, capped at 50%, or 50% where there is no existing requirement (GB8(1)(a)(ii); footnote 44 sets out when the cap does not apply).',
        'Infrastructure: identify the local or national improvements the development makes necessary, and check they are secured, not just offered (GB8(1)(b); 6006637 ¶44).',
        'Green space: check for new or improved green space accessible to the public, within a short walk of new homes, which contributes positively to the landscape setting, supports nature recovery, and meets local standards or, where none exist, national ones (GB8(1)(c); 6004144 ¶34).',
        'If a shortfall is justified on viability, check it falls within one of the three GB8(3) circumstances, and that the scheme still makes the maximum possible contribution (GB8(4)).',
      ],
      pointers: [
        {
          option: 'pass',
          factors: [
            'A planning obligation secures affordable housing at or above the required percentage (50% was accepted, 6007184 ¶39)',
            'Highway, education and other improvements named and secured',
            'A parameter plan shows public green space on the open edges, with nature recovery secured by condition (6004144 ¶34)',
          ],
        },
        {
          option: 'fail',
          factors: [
            'Affordable housing below the required level, with no GB8(3) viability case',
            'Necessary highway or other improvements not identified, substantiated or secured (6006637 ¶44)',
            'No publicly accessible green space, or none within a short walk',
            'Contributions offered but with no signed obligation or condition to secure them',
          ],
        },
      ],
      evidence: ['The development plan affordable housing policies, and the highest existing requirement', 'The draft planning obligation and heads of terms', 'Infrastructure providers\' and the highway authority\'s requirements', 'The landscape and green space parameter plan', 'Any viability assessment, and which GB8(3) circumstance it relies on'],
      closeCall: 'All three contributions are required. Compliance carries substantial weight (GB8(2)). An improvement that is offered but not secured has been treated as not made (6006637 ¶44). Affordable housing significantly below the required level is acceptable only in exceptional cases, fully evidenced and justified (GB8(4)).',
    },
    input: passFail('Yes', 'No'),
    effects: [
      { when: { eq: ['gb8', 'pass'] }, finding: { kind: 'pass', policy: 'GB7(1)(g)(iv)', text: 'Complies with the Golden Rules (GB8), which carries substantial weight (GB8(2)).' } },
      { when: { eq: ['gb8', 'fail'] }, finding: { kind: 'fail', policy: 'GB7(1)(g)(iv)', text: 'Does not comply with the Golden Rules (GB8).' } },
    ],
    cases: { policies: ['GB8', 'GB7(1)(g)(iv)'], groupBy: 'finding' },
  },
];
