import type { GraphNode, Method } from '../../src/engine/types';

const outside = { eq: ['outside', true] } as const;
const cat = (c: string) => ({ all: [outside, { eq: ['s5cat', c] }] }) as const;
const judge = (id: string, c: string, title: string, prompt: string, quote: string, policy: string, passText: string, failText: string, extra: Partial<GraphNode> = {}): GraphNode => ({
  id,
  kind: 'judgement',
  section: 'countryside',
  fact: id,
  when: cat(c),
  title,
  prompt,
  quotes: [quote],
  input: {
    type: 'single',
    options: [
      { value: 'pass', label: 'Yes' },
      { value: 'fail', label: 'No' },
    ],
  },
  effects: [
    { when: { eq: [id, 'pass'] }, finding: { kind: 'pass', policy, text: passText } },
    { when: { eq: [id, 'fail'] }, finding: { kind: 'fail', policy, text: failText } },
  ],
  cases: { policies: [policy], groupBy: 'finding' },
  ...extra,
});

// How to decide, per S5(1) category (keyed by s5cat value), plus S5(3) and HO11.
const methods: Record<'c' | 'd' | 'e' | 'f' | 'h' | 'i' | 'j' | 'isolated' | 'ho11', Method> = {
  c: {
    question: 'Is there a lawful, permanent and substantial building, and does the scheme stay within its size and, for a replacement, its use?',
    steps: [
      'Identify the existing building and its lawful use. Check it is of permanent and substantial construction (a masonry building qualified at 6011648 ¶16) and lawful in planning terms (a permission, a lawful development certificate or immunity).',
      'Say which limb applies: reuse, extension or alteration of the building, or its replacement. Reuse is not limited to particular new uses (6008848 ¶14).',
      'For an extension or alteration, measure the increase against the building as it existed on the Framework\'s publication date (footnote 25), not the original building. Earlier extensions form part of that baseline (6011648 ¶16).',
      'For a replacement, check it is for the same use and not disproportionately larger than the building it replaces. A house replacing a stable is a different use (6009409 ¶18).',
      'Judge proportion on footprint, floor area, height, width and depth together. A large plot does not make a larger building proportionate (6011045 ¶25).',
      'If the scheme creates a new home outside any settlement or group of houses, inspectors have still applied S5(3) and HO11 (6008115 ¶26, 6009718 ¶61). At 6005652 (c) appeared satisfied (¶30), but the home was isolated (¶31) and failed HO11 (¶33).',
    ],
    pointers: [
      {
        option: 'pass',
        factors: [
          'A masonry or framed building in lawful use',
          'Conversion within the existing shell, with no extension (6008848 ¶15)',
          'Extension modest against the building as it stood on 17 August 2026 (6011648 ¶16)',
          'Replacement for the same use, of similar footprint, floor area and height',
        ],
      },
      {
        option: 'fail',
        factors: [
          'No lawful building: unauthorised, or only permitted and not built',
          'A temporary or lightweight structure',
          'Replacement for a different use, such as a stable or barn replaced by a house (6009409 ¶18, 6010348 ¶27)',
          'Replacement over twice the footprint and larger in every dimension (6011045 ¶25)',
        ],
      },
    ],
    evidence: [
      'Planning history, lawful development certificate or evidence of immunity',
      'Measured survey of the existing building as at 17 August 2026: footprint, floor area, volume and height',
      'Structural survey for a conversion',
      'Proposed plans with like-for-like figures',
    ],
    closeCall: 'The Framework sets no percentage for "disproportionate". Compare like with like against the footnote 25 baseline and say which measures drive the finding. If lawfulness or permanent construction is not shown, answer No.',
  },
  d: {
    question: 'Does the whole site meet the Annex B definition of previously developed land?',
    steps: [
      'Map the site against lawful permanent structures, fixed surface infrastructure and their curtilage.',
      'Apply the Annex B exclusions: land last occupied by agricultural or forestry buildings; land with provision for restoration; residential gardens, parks, recreation grounds and allotments in built-up areas; and land where the remains have blended into the landscape.',
      'The garden exclusion applies only in built-up areas. A garden outside a built-up area has been held to be previously developed land (6011217 ¶17). One letter read the exclusion as covering residential garden land generally (6005162 ¶13).',
      'Check the whole site qualifies. S5(1)(d) has been held not to cover the partial redevelopment of previously developed land (6006950 ¶30, 6009409 ¶18).',
      'Note that Annex B says it "should not be assumed that the whole of the curtilage should be developed". The extent of built development is weighed in the balance.',
      'If the scheme creates a new home outside any settlement or group of houses, inspectors have still applied S5(3) and HO11 (6008115 ¶26, 6009718 ¶61).',
    ],
    pointers: [
      {
        option: 'pass',
        factors: [
          'Lawful buildings or hardstanding across the site',
          'Residential curtilage outside a built-up area (6011217 ¶17)',
          'Material change of use of lawfully developed land to residential, such as lifting a holiday-occupancy restriction on a converted building (6009619 ¶15)',
        ],
      },
      {
        option: 'fail',
        factors: [
          'Agricultural or forestry buildings, or land last occupied by them',
          'Buildings or hardstanding on only part of the site, with open land in the rest (6009409 ¶18)',
          'Below-ground remains that have blended into the landscape (6006950 ¶30)',
          'Unauthorised structures or hardstanding',
          'A restoration condition on a minerals, landfill or energy site',
        ],
      },
    ],
    evidence: [
      'Site plan marking each structure and area of hardstanding',
      'Planning history and lawful status of each structure',
      'Aerial photographs over time',
      'Any restoration condition or obligation',
    ],
    closeCall: 'The definition is a set of facts, not a balance. If a material part of the site falls outside it, answer No and consider the other categories or S5(4).',
  },
  e: {
    question: 'Would the site sit within an existing group of houses, filling a limited gap, rather than extending the group?',
    steps: [
      'Identify the group of houses on the ground. It need not be a settlement: a group in a hamlet can qualify (6009593 ¶13, ¶16).',
      'Count houses that exist now. Consented but unbuilt houses have been disregarded (6008264 ¶9).',
      'Check the site is within the group: built development on both sides, or enclosed by the group. A plot with houses on one side only, or at the end of a row, extends the group (6008739 ¶9, 6010442 ¶20).',
      'Check the infilling is limited: compare the plot and the number of homes with the plots around it (6009593 ¶15).',
      'Do not add a "well-related to a settlement" test; it appears only in S5(1)(h) and (j) (6009593 ¶16). The location is still tested under TR3 and weighed in the balance (6009593 ¶19).',
    ],
    pointers: [
      {
        option: 'pass',
        factors: [
          'Houses on both sides fronting the same road (6009593 ¶15)',
          'Plot size and frontage like the neighbours\'',
          'One or two homes in a single gap',
        ],
      },
      {
        option: 'fail',
        factors: [
          'Houses on one side only, open countryside on the others (6008264 ¶10)',
          'At the end of a row, with the nearest other house across the road (6008739 ¶8)',
          'Adjacent to a house but extending the group rather than within it (6010442 ¶20)',
          'The group depends on consented, unbuilt houses (6008264 ¶9)',
        ],
      },
    ],
    evidence: [
      'Location plan showing every building around the site and its use',
      'Photographs of the frontage and the gap',
      'Plot sizes and frontages of the neighbouring houses',
    ],
    closeCall: 'The Framework does not define "limited" or "group". Inspectors read both on physical form as it exists. If the site extends the group rather than fills it, answer No.',
  },
  f: {
    question: 'Is the proposal made under a Community Right to Build Order or Neighbourhood Development Order, or does it meet every HO10 requirement for an exception site?',
    steps: [
      'If it relies on an Order, identify the Order and check the proposal is what it provides for. Otherwise go to HO10.',
      'Check the land is not already allocated for housing and lies outside a settlement (HO10(1)).',
      'Identify the type: a rural exception site providing affordable housing for identified local needs, evidenced by a local housing needs survey or secondary data no more than five years old (HO10(1)(a)); or community-led development as Annex B defines it (HO10(1)(b)).',
      'Unless the development plan says otherwise, check HO10(2): the site adjoins or is physically well-related to a settlement; built development is no more than one hectare or 5% of the size of the existing settlement, whichever is greater; and it includes affordable housing, with market homes only where essential to deliver the affordable units without grant funding.',
      'For a rural exception site, check the affordable housing is secured in perpetuity for current residents or people with a family or employment connection (Annex B).',
    ],
    pointers: [
      {
        option: 'pass',
        factors: [
          'A housing needs survey under five years old showing a local need the mix matches',
          'Adjoins the edge of a village',
          'Within the one hectare or 5% limit',
          'An obligation securing affordable tenure in perpetuity with a local connection',
          'For community-led schemes: a not-for-profit body, democratically controlled by its members, that will own, manage or steward the homes',
        ],
      },
      {
        option: 'fail',
        factors: [
          'No local needs evidence, or evidence more than five years old',
          'Market homes beyond what is shown essential for delivery',
          'Built development over the size limit with no plan provision',
          'Detached from any settlement',
          'A primarily commercial scheme described as community-led',
        ],
      },
    ],
    evidence: [
      'The local housing needs survey or secondary data, with its date',
      'Viability appraisal if market homes are proposed',
      'Draft planning obligation',
      'The size of the existing settlement, for the 5% test',
    ],
    closeCall: 'HO10 sets requirements, not factors to balance. If one is not shown, answer No; the benefits can still be weighed under S5(4).',
  },
  h: {
    question: 'Does the site meet all four limbs of S5(1)(h): walking distance to a well-connected station, a physical relationship to it or its settlement, a scale infrastructure can take, and no prejudice to long-term plans?',
    steps: [
      'Test the station against Annex B: within a top 80 Travel to Work Area by GVA, and served throughout the daytime on the normal weekday timetable by at least four trains or trams an hour overall, or two an hour in one direction (or with a reasonable prospect of that). A station below that frequency failed the same definition at 6006637 ¶18.',
      'Measure the walking distance on the actual route: around 800 metres, or around 10 minutes\' walk where topography, route quality or physical barriers would prevent or discourage walking 800 metres (Annex B).',
      'If only part of the site is within that distance, apply S5(1)(h) only to that part (Annex B).',
      'Judge whether the site is physically well-related to the station or to the settlement the station is in, and whether existing or proposed infrastructure can accommodate its scale.',
      'Check for any proposal for long-term comprehensive development in the same location that the scheme could prejudice.',
    ],
    pointers: [
      {
        option: 'pass',
        factors: [
          'Timetable evidence meeting the Annex B frequency',
          'A walking route to the station of 800 metres or less, usable by all',
          'Adjoins the station or the built edge of its settlement',
          'Layout leaves room for any planned wider scheme',
        ],
      },
      {
        option: 'fail',
        factors: [
          'Fewer than four trains an hour overall and fewer than two in any one direction (6006637 ¶18)',
          'Station outside a top 80 Travel to Work Area',
          'Route over 800 metres, or one that discourages walking',
          'Would block access to, or fragment, land identified for long-term comprehensive development',
        ],
      },
    ],
    evidence: [
      'The current weekday timetable, and any committed service upgrade',
      'The Travel to Work Area and its GVA ranking',
      'A walking route plan with distances and route conditions',
      'Development plan and emerging proposals for the area',
    ],
    closeCall: 'Each limb must be met. If the station definition or walking distance is not shown on the evidence, answer No.',
  },
  i: {
    question: 'Is the site allocated in the development plan for the development proposed?',
    steps: [
      'Identify the allocation policy and the policies map. Check the site boundary against the allocated area.',
      'Check whether the land is already a settlement: Annex B includes land allocated for development that will form part of the built-up area once complete. If so, S4 applies, not S5.',
      'Check the use: S5(1)(i) covers land allocated "for that purpose".',
      'Check the allocation is in the development plan: an adopted local plan or a made neighbourhood plan. An allocation in an emerging plan is not yet part of it.',
      'Note any conflict with the allocation\'s site-specific requirements (capacity, access, design). It is weighed in the balance, not here.',
    ],
    pointers: [
      { option: 'pass', factors: ['Site within the allocation boundary on the adopted policies map', 'Use and scale in line with the allocation policy'] },
      {
        option: 'fail',
        factors: ['Site wholly or partly outside the allocated area', 'A different use from the allocation, such as housing on an employment allocation', 'An allocation in an emerging plan only'],
      },
    ],
    evidence: ['The adopted policies map and allocation policy', 'Any development brief or masterplan for the allocation'],
    closeCall: 'This is a matter of fact from the plan. Land outside the allocated area is not within S5(1)(i) and needs another category.',
  },
  j: {
    question: 'Is the site physically well-related to an existing settlement, and can existing or proposed infrastructure accommodate its scale?',
    steps: [
      'Identify the existing settlement using the Annex B definition. Hamlets and scattered groups of houses are not settlements unless the plan defines them, and villages washed over by the Green Belt are excluded (6009593 ¶13).',
      'Judge the physical relationship on the ground: adjacency to the built edge, gaps, intervening fields, roads or ridges, and how the site sits against the settlement\'s form. Inspectors differ. Some take physical connectivity only (6006893 ¶69) and do not require adjacency to the main built form or a continuous footway (6001260 ¶24); others read settlement form and separation strictly (6009838 ¶15, 6012985 ¶9). Some also read in character and setting (6007133 ¶40 and 6008253 ¶80, both after hearings) or access to services (6007158 ¶44, 6007352 ¶27).',
      'Apply footnote 28: if the site is beyond the outer edge of an allocated site not yet fully developed, ask whether it would be in a suitable location if that allocation did not proceed.',
      'Check the scale against existing or proposed infrastructure (schools, health, utilities, highways), including improvements the scheme secures.',
      'Answer TR3 separately on the walking route and transport choice, and carry any TR3 conflict into the S5(1) balance as a Framework conflict (as at 6009593 ¶19). Passing this limb does not answer TR3; and if you read accessibility into this limb, TR3 still needs its own answer.',
    ],
    pointers: [
      {
        option: 'pass',
        factors: [
          'Adjoins established housing (6001260 ¶25)',
          'Across a road from the built edge, where the road reads as "a soft connection" rather than a hard boundary (6008238 ¶22, inquiry)',
          'Contained by existing development and consistent with the settlement\'s form',
          'A scale that local schools, health services and utilities can absorb',
        ],
      },
      {
        option: 'fail',
        factors: [
          'Separated from the settlement by gaps, open land or a hill (6012985 ¶9)',
          'Its own access onto a lane away from the settlement, with gaps to nearby houses (6009838 ¶15)',
          'Near only a hamlet or scattered houses that are not a settlement (6009593 ¶13)',
          'Agreed to be an isolated home (6010187 ¶30)',
          'Beyond an unbuilt allocation, and unsuitable if it did not proceed (footnote 28)',
        ],
      },
    ],
    evidence: [
      'A plan of the site against the built edge and any plan settlement boundary',
      'Site visit notes and photographs of the edge',
      'Responses from infrastructure providers (education, health, water, highways)',
      'The five-year supply and Housing Delivery Test figures',
    ],
    closeCall: 'State which reading of "physically well-related" you apply; inspectors are divided. On the physical reading, character, design and access have their own policies, so a site can pass here and still fail those (6008785 ¶37, ¶39). On a wider reading, the limb also asks "how the proposal itself would relate to the surrounding character" (6007133 ¶40, hearing); a site very close to the village failed it on limited harm to character and the village\'s setting, then passed S5(4) (6008253 ¶80, ¶85, hearing). The proviso "unless the nature of the development would make this inappropriate" has also been used to reach character and highway harm (6010422 ¶42).',
  },
  isolated: {
    question: 'Would the homes lie outside any settlement and outside any group of houses?',
    steps: [
      'Apply the S5(3) definition: isolated homes are "those lying outside settlements or groups of houses". The test is where the homes sit, not the distance to services.',
      'Identify any group of houses around the site. Count houses, not barns or stables (6008115 ¶27).',
      'Ask whether the site is within that group or only close to it. A site close to, rather than within, a group has been held isolated (6009718 ¶60), and so has a group of one other house (6009042 ¶20).',
      'Apply the Framework test rather than a local plan that treats all land outside a boundary as isolated (6011431 ¶7, ¶8).',
    ],
    pointers: [
      {
        option: 'no',
        factors: [
          'Houses on both sides of, or around, the site',
          'Within a hamlet or cluster of houses, even one that is not a settlement',
          'Next to a mix of homes and other buildings in use (6011431 ¶8)',
          'Adjoining the built edge of a settlement',
        ],
      },
      {
        option: 'yes',
        factors: [
          'Only farm buildings, barns or stables nearby (6008115 ¶27)',
          'Close to but not within a group of houses (6009718 ¶60)',
          'One other house only (6009042 ¶20)',
          'Separated from the nearest houses by a lane or open land',
        ],
      },
    ],
    evidence: ['A location plan showing each building around the site and its use', 'Aerial photographs', 'Site visit notes on how the site relates to nearby houses'],
    closeCall: 'The Framework defines the term, so apply its words. Some inspectors also use the older court reading, "physically separated or remote from a settlement" (6008115 ¶27); say which you apply. At the edge of a group, the question is whether the site is within it or beyond it.',
  },
  ho11: {
    question: 'Does the proposal fully meet one of the five HO11(1) circumstances?',
    steps: [
      'Identify which circumstance the applicant relies on. Each has its own test, and one must be met in full.',
      '(a) Rural worker: is there an essential need for a worker to live permanently at or near the place of work? Inspectors test the enterprise\'s needs and whether alarms, CCTV or automation could meet them instead (6010187 ¶17); a detailed appraisal has carried it (6006151 ¶8).',
      '(b) Enabling development: does it meet HE4, securing the future conservation of a heritage asset with conservation benefits that outweigh the departure from policy?',
      '(c) Reuse: is the building redundant or disused, and would the scheme enhance its immediate setting? Both are needed (6008115 ¶28). For a vacant or underused listed building, take account of any harm under HE6.',
      '(d) Subdivision of an existing residential building. (e) Exceptional design: truly outstanding, helping to raise rural design standards generally, significantly enhancing its immediate setting and sensitive to the defining characteristics of the area.',
    ],
    pointers: [
      {
        option: 'pass',
        factors: [
          'An appraisal showing the enterprise needs a worker on site most of the time (6006151 ¶8)',
          'A building shown to be disused, and a scheme that improves its setting',
          'Subdivision within an existing house',
          'Enabling development shown under HE4 to secure a heritage asset\'s future',
        ],
      },
      {
        option: 'fail',
        factors: [
          'No evidence why alarms, CCTV or other measures could not meet the need (6010187 ¶17)',
          'Building in use, for example for storage (6008115 ¶28)',
          'A holiday let not shown to be disused or redundant (6008634 ¶10)',
          'A conversion that gives a rural yard an overtly domestic character (6008115 ¶29)',
          'A new house of ordinary design',
          'Exceptional design claimed for a scheme "transplanting" a design built elsewhere, not reviewed by a design panel, or hidden rather than "seen, to some extent, in its surrounding context" (6010934 ¶18, ¶23, ¶28)',
        ],
      },
    ],
    evidence: [
      'Functional and financial appraisal of the rural enterprise',
      'Evidence of the building\'s current use and any marketing',
      'Structural survey and conversion plans',
      'Setting and landscape plans',
      'Independent design review, if exceptional design is claimed',
    ],
    closeCall: 'S5(3) says isolated homes should not be approved other than under HO11. A housing shortfall does not bring an isolated home within S5(1)(j) (6010187 ¶30). If the evidence for the chosen circumstance is not shown, answer No.',
  },
};

// S5: outside settlements, only listed categories should be approved (S5(1)); otherwise S5(3) or S5(4).
export const countryside: GraphNode[] = [
  {
    id: 's5cat',
    kind: 'question',
    section: 'countryside',
    fact: 's5cat',
    when: outside,
    whyShown: 'The site is outside a settlement and outside the Green Belt, so S5 applies.',
    title: 'S5(1) category',
    prompt: 'Which S5(1) category does the proposal rely on?',
    quotes: ['S5(1)'],
    help: ['Choose the category the application relies on. Categories that cannot apply to the proposal type or your earlier answers are not offered.'],
    input: {
      type: 'single',
      options: [
        { value: 'c', label: 'S5(1)(c): reuse, extension, alteration or replacement of an existing building', when: { eq: ['devType', 'reuse-replacement'] } },
        { value: 'd', label: 'S5(1)(d): redevelopment of previously developed land', when: { in: ['devType', ['pdl', 'reuse-replacement']] } },
        { value: 'e', label: 'S5(1)(e): limited infilling within a group of houses' },
        { value: 'f', label: 'S5(1)(f): an exception site (HO10), or a Community Right to Build or Neighbourhood Development Order', when: { eq: ['devType', 'affordable-local'] } },
        { value: 'h', label: 'S5(1)(h): land around a well-connected station', when: { has: ['constraints', 'station'] } },
        { value: 'i', label: 'S5(1)(i): land allocated for this purpose in the development plan' },
        { value: 'j', label: 'S5(1)(j): evidenced unmet need, physically well-related to an existing settlement', when: { eq: ['unmetNeed', true] } },
        { value: 'none', label: 'None of these' },
      ],
    },
    cases: { policies: ['S5(1)'], groupBy: 'finding' },
  },
  judge('s5c', 'c', 'S5(1)(c): existing building', 'Is the existing building permanent, substantial and lawful, with no disproportionate increase in size over the existing building (or a replacement for the same use, not disproportionately larger)?', 'S5(1)(c)', 'S5(1)(c)', 'Falls within S5(1)(c).', 'Does not meet S5(1)(c).', {
    help: ['Unlike GB7(1)(b), S5(1)(c) compares with the existing building as it stood on the Framework\'s publication date (footnote 25).'],
    method: methods.c,
  }),
  judge('s5d', 'd', 'S5(1)(d): previously developed land', 'Is the land previously developed land as Annex B defines it?', 'S5(1)(d)', 'S5(1)(d)', 'Redevelopment of previously developed land under S5(1)(d).', 'The land is not previously developed land, so S5(1)(d) does not apply.', {
    quotes: ['S5(1)(d)', 'AnnexB:PDL'],
    method: methods.d,
  }),
  judge('s5e', 'e', 'S5(1)(e): limited infilling', 'Is the proposal limited infilling within an existing group of houses?', 'S5(1)(e)', 'S5(1)(e)', 'Limited infilling within a group of houses under S5(1)(e).', 'Not limited infilling within a group of houses.', {
    help: ['Decisions have accepted a gap between two houses fronting the same road (6009593 ¶15), but rejected a plot with houses on one side only, which "would extend built form beyond the existing edge of the hamlet rather than being within it" (6008739 ¶9).'],
    method: methods.e,
  }),
  judge('s5f', 'f', 'S5(1)(f): exception site', 'Is the proposal an exception site under HO10, or brought forward under a Community Right to Build Order or Neighbourhood Development Order?', 'S5(1)(f)', 'S5(1)(f)', 'An exception site under S5(1)(f).', 'Does not meet S5(1)(f).', { method: methods.f }),
  judge('s5h', 'h', 'S5(1)(h): well-connected station', 'Does the site meet every limb of S5(1)(h), applying the Annex B definitions?', 'S5(1)(h)', 'S5(1)(h)', 'Within reasonable walking distance of a well-connected station under S5(1)(h).', 'Does not meet S5(1)(h).', {
    quotes: ['S5(1)(h)', 'AnnexB:well-connected-station', 'AnnexB:reasonable-walking-distance'],
    method: methods.h,
  }),
  judge('s5i', 'i', 'S5(1)(i): allocated land', 'Is the land allocated for this purpose in the development plan?', 'S5(1)(i)', 'S5(1)(i)', 'Allocated land under S5(1)(i).', 'The land is not allocated for this purpose.', { method: methods.i }),
  judge('s5j', 'j', 'S5(1)(j): unmet need', 'Is the site physically well-related to an existing settlement, and of a scale that existing or proposed infrastructure can accommodate?', 'S5(1)(j)', 'S5(1)(j)', 'Addresses an evidenced unmet need and is physically well-related to an existing settlement under S5(1)(j).', 'Not physically well-related to an existing settlement, or of a scale infrastructure cannot accommodate.', {
    help: [
      '"Existing settlement" takes the Annex B definition, which excludes villages washed over by the Green Belt.',
      'The unmet need limb is met on your supply answers.',
    ],
    cases: { policies: ['S5(1)(j)'], groupBy: 'finding', context: ['settlement-edge'] },
    method: methods.j,
  }),
  {
    id: 'isolated',
    kind: 'judgement',
    section: 'countryside',
    fact: 'isolated',
    when: { all: [outside, { ne: ['s5pass', true] }] },
    whyShown: 'No S5(1) category is met.',
    title: 'S5(3): isolated homes',
    method: methods.isolated,
    prompt: 'Would the homes be isolated: outside settlements or groups of houses?',
    quotes: ['S5(3)'],
    input: {
      type: 'single',
      options: [
        { value: 'no', label: 'No: they would be by a group of houses or on a settlement edge' },
        { value: 'yes', label: 'Yes: isolated' },
      ],
    },
    cases: { policies: ['S5(3)', 'HO11'], groupBy: 'finding' },
  },
  {
    id: 'ho11',
    kind: 'judgement',
    section: 'countryside',
    fact: 'ho11',
    when: { all: [outside, { eq: ['isolated', 'yes'] }] },
    title: 'HO11: isolated homes',
    method: methods.ho11,
    prompt: 'Does the proposal meet one of the circumstances in policy HO11 for isolated homes?',
    quotes: ['S5(3)'],
    input: {
      type: 'single',
      options: [
        { value: 'pass', label: 'Yes' },
        { value: 'fail', label: 'No' },
      ],
    },
    effects: [
      { when: { eq: ['ho11', 'pass'] }, finding: { kind: 'pass', policy: 'HO11', text: 'An isolated home justified under HO11.' } },
      { when: { eq: ['ho11', 'fail'] }, finding: { kind: 'fail', policy: 'S5(3)', text: 'An isolated home that does not meet HO11: S5(3) says it should not be approved.' } },
    ],
    cases: { policies: ['HO11', 'S5(3)'], groupBy: 'finding' },
  },
];
