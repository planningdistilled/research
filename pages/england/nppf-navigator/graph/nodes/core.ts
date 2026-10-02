import type { GraphNode } from '../../src/engine/types';

// The opening questions: where the site is, what is proposed, and the facts every route depends on.
export const core: GraphNode[] = [
  {
    id: 'gb',
    kind: 'question',
    section: 'core',
    fact: 'gb',
    title: 'Green Belt',
    prompt: 'Is the site in the Green Belt?',
    quotes: ['S5(5)', 'GB6(1)'],
    input: {
      type: 'single',
      options: [
        { value: 'no', label: 'No' },
        {
          value: 'yes',
          label: 'Yes, open Green Belt',
          help: 'Outside any village, or on the edge of a town or village that is inset from (excluded from) the Green Belt.',
        },
        {
          value: 'washed-over',
          label: 'Yes, in or on the edge of a village washed over by the Green Belt',
          help: 'The village itself lies within the Green Belt on the development plan policies map.',
        },
      ],
    },
    help: [
      'In the Green Belt, policies S4 and S5 do not apply: the route is GB6, GB7 and GB8 (S5(5)).',
      'Grey belt is still Green Belt, so answer Yes. Grey belt is not a designation or a line on the policies map. It is a label for Green Belt land that meets the Annex B definition: previously developed land, or land that does not strongly contribute to purposes (a), (b) or (d). Being grey belt does not take the site out of the Green Belt. It only opens a route to being "not inappropriate" under GB7(1)(g), which this tool tests later.',
      'A council\'s Green Belt assessment may identify areas of grey belt (Annex E). That is evidence for the judgement, not a finding that binds a decision on a particular site.',
      'Local Green Space (HC8) is decided consistently with Green Belt policy. This version of the tool does not cover it.',
    ],
  },
  {
    id: 'washedOverSettlement',
    kind: 'info',
    section: 'core',
    fact: 'washedOverSettlementAck',
    when: { eq: ['gb', 'washed-over'] },
    whyShown: 'The site is in a village washed over by the Green Belt.',
    title: 'A washed-over village is not a "settlement"',
    prompt:
      'Annex B excludes villages that lie within, and are defined as part of, the Green Belt from the Framework\'s definition of "settlement". S4 (within settlements) cannot apply, and S5(5) sends the proposal to GB6 to GB8 in any event. Village facilities still matter under TR3, but as facts about the location, not as a settlement category.',
    quotes: ['AnnexB:settlement', 'S5(5)'],
    input: { type: 'ack' },
    contested: {
      summary:
        'Some council reports have treated a washed-over village as a settlement: asking whether a site is "well-related to an existing settlement" (an S5(1)(j) test), or treating a site within the village boundary as a sustainable location without examining the route. Appeals have now gone both ways. One applied the exclusion squarely: villages defined as part of the Green Belt "are not settlements for the purposes of the Framework, and consequently Policy S4 is not engaged" (6009919 ¶49). Another ran S4 for a Green Belt site inside a village\'s defined settlement boundary, leaving the Green Belt question undecided because the appeal failed on heritage (6010097 ¶15, ¶20).',
      readings: [
        {
          label: 'Annex B: not a settlement',
          summary: 'The Framework definition applies "for the purpose of this Framework". S4 is not engaged, and the proposal is decided under GB6 and GB7 (6009919 ¶49). The location question is answered under GB7(1)(g)(iii) and TR3 on the facts of the route.',
          cases: { policies: ['AnnexB:settlement'] },
        },
        {
          label: 'Treated as a settlement in practice',
          summary: 'Council reports that ran settlement-based tests for washed-over villages, and one appeal that applied S4 to a Green Belt site within a village\'s defined settlement boundary: "As the proposal is within a settlement, it benefits from the in-principle support provided by policies S3 and S4 of the Framework" (6010097 ¶15).',
          cases: { policies: ['GB7(1)(g)', 'S5(1)(j)'], tags: ['washed-over-village-as-settlement', 'buab-equals-sustainable'] },
        },
      ],
    },
  },
  {
    id: 'settlementLoc',
    kind: 'question',
    section: 'core',
    fact: 'settlementLoc',
    when: { eq: ['gb', 'no'] },
    whyShown: 'The site is outside the Green Belt, so S3 decides whether S4 or S5 applies.',
    title: 'Settlement',
    prompt: 'Is the site within a settlement, as the Framework defines it?',
    quotes: ['S3(1)', 'AnnexB:settlement', 'S3(2)'],
    input: {
      type: 'single',
      options: [
        { value: 'within', label: 'Within a settlement', help: 'Inside a settlement boundary (or equivalent) in the development plan, or within a predominantly built-up area.' },
        { value: 'outside', label: 'Outside any settlement' },
        {
          value: 'partly',
          label: 'Partly within, partly outside',
          help: 'S3(2): apply S4 to the part inside the settlement and S5 to the part outside, then reach an overall view on the whole proposal. The split can fall within one site: the part bordered by dwellings on three sides read as within the settlement, a paddock as outside (6011227 ¶25–26). This tool runs the outside-settlement route for the part outside and records that S4 governs the part inside; the final balance asks for the overall view.',
        },
      ],
    },
    help: [
      'Settlements include land allocated or with permission that will form part of the built-up area.',
      'Hamlets and scattered groups of houses outside predominantly built-up areas are not settlements unless the development plan defines them as such.',
    ],
    effects: [
      {
        when: { eq: ['settlementLoc', 'partly'] },
        finding: {
          kind: 'note',
          policy: 'S3(2)',
          text: 'The site is partly within and partly outside a settlement: S4 applies to the part inside and S5 to the part outside, before an overall view is reached on the whole proposal (S3(2)).',
          quotes: ['S3(2)'],
        },
      },
    ],
    cases: { policies: ['AnnexB:settlement', 'S3'], label: 'Decisions on what counts as a settlement' },
  },
  {
    id: 'devType',
    kind: 'question',
    section: 'core',
    fact: 'devType',
    title: 'Proposal',
    prompt: 'What is proposed?',
    help: ['This version covers residential development. Other development types (commercial, telecoms, householder and so on) are outside its scope.'],
    input: {
      type: 'single',
      options: [
        { value: 'market-housing', label: 'New-build housing on a greenfield or undeveloped site' },
        { value: 'affordable-local', label: 'Affordable housing for local needs (rural exception site or similar)' },
        { value: 'reuse-replacement', label: 'Reuse, conversion, extension or replacement of an existing building for housing' },
        { value: 'pdl', label: 'Housing on previously developed land', help: 'Annex B definition: excludes land last occupied by agricultural buildings, and gardens in built-up areas.' },
      ],
    },
    quotes: ['AnnexB:PDL'],
  },
  {
    id: 'units',
    kind: 'question',
    section: 'core',
    fact: 'units',
    title: 'Number of homes',
    prompt: 'How many homes (net)?',
    input: { type: 'number', min: 1, max: 5000, unit: 'homes', step: 1 },
    help: ['For a permission in principle with a range, use the upper end: inspectors assess the maximum (e.g. appeal 6003055, ¶9).'],
  },
  {
    id: 'largeSite',
    kind: 'question',
    section: 'core',
    fact: 'largeSite',
    when: { lt: ['units', 10] },
    whyShown: 'Fewer than 10 homes, so site area decides whether this is major development.',
    title: 'Site area',
    prompt: 'Is the site 0.5 hectares or more?',
    quotes: ['AnnexB:major-development'],
    input: { type: 'single', options: [{ value: 'no', label: 'No, under 0.5 ha' }, { value: 'yes', label: 'Yes, 0.5 ha or more' }] },
  },
  {
    id: 'heritage',
    kind: 'question',
    section: 'core',
    fact: 'heritage',
    title: 'Heritage assets',
    prompt: 'Which heritage assets could the proposal affect, including through development in their setting? Select all that apply, or none.',
    quotes: ['AnnexB:setting', 'AnnexB:heritage-asset', 'HE5(1)'],
    help: [
      'Setting is "the surroundings in which a heritage asset is experienced". It is not limited to views: inspectors have found harm through lost historic and functional relationships without intervisibility (e.g. 6006475 ¶14, ¶32; 6007136 ¶21).',
    ],
    input: {
      type: 'multi',
      options: [
        { value: 'lb2', label: 'Grade II listed building' },
        { value: 'lbHigh', label: 'Grade I or II* listed building' },
        { value: 'ca', label: 'Conservation area' },
        { value: 'rpg', label: 'Registered park or garden' },
        { value: 'sm', label: 'Scheduled monument, or other asset of the highest significance' },
        {
          value: 'ndha',
          label: 'Non-designated heritage asset (identified by the council: e.g. on a local heritage list, in a neighbourhood plan or the Historic Environment Record, or during the decision; such as an unregistered historic park)',
          help: 'A heritage asset is "a building, monument, site, place, area or landscape" with heritage interest that merits consideration, including assets "identified by the local planning authority (including local listing)" (Annex B). Not every council keeps a local heritage list, so assets can also be identified through a neighbourhood plan, the Historic Environment Record or the decision itself. A protected view is not a heritage asset: it may be part of an asset\'s setting, or show a landscape that is itself an asset.',
        },
      ],
    },
  },
  {
    id: 'supply',
    kind: 'question',
    section: 'core',
    fact: 'supply',
    title: 'Housing land supply',
    prompt: 'Can the local planning authority demonstrate a five-year supply of deliverable housing sites (with the relevant buffer)?',
    quotes: ['GB7-fn41', 'S5(1)(j)'],
    input: {
      type: 'single',
      options: [
        { value: 'below5', label: 'No, below five years' },
        { value: '5plus', label: 'Yes, five years or more' },
        { value: 'unknown', label: 'Not known' },
      ],
    },
  },
  {
    id: 'hdt',
    kind: 'question',
    section: 'core',
    fact: 'hdt',
    when: { ne: ['supply', 'below5'] },
    whyShown: 'Supply is not below five years, so the Housing Delivery Test decides whether unmet need exists.',
    title: 'Housing Delivery Test',
    prompt: 'Was the most recent Housing Delivery Test result below 75%?',
    quotes: ['GB7-fn41'],
    input: {
      type: 'single',
      options: [
        { value: 'below75', label: 'Yes, below 75%' },
        { value: '75plus', label: 'No, 75% or more' },
        { value: 'unknown', label: 'Not known' },
      ],
    },
  },
  {
    id: 'constraints',
    kind: 'question',
    section: 'core',
    fact: 'constraints',
    title: 'Site constraints',
    prompt: 'Which of these apply? Select all that apply, or none. Each one opens the policies that govern it.',
    input: {
      type: 'multi',
      options: [
        { value: 'flood', label: 'Known risk from any form of flooding (river, sea, surface water, groundwater), now or in the future' },
        { value: 'protectedLandscape', label: 'Within a National Park, National Landscape or the Broads' },
        { value: 'protectedLandscapeSetting', label: 'Within the setting of a Protected Landscape' },
        { value: 'irreplaceable', label: 'Ancient woodland, or ancient or veteran trees, affected' },
        { value: 'biodiversity', label: 'Habitats or protected species that could be significantly harmed' },
        { value: 'treesHedges', label: 'Established trees or hedgerows lost or cut back (including for visibility splays)' },
        { value: 'access', label: 'New or altered vehicular access onto a public road' },
        { value: 'station', label: 'A railway station within about 800 m walk' },
        {
          value: 'neighbourhoodPlan',
          label: 'A neighbourhood plan covers the site (made, or approved at referendum)',
          help: '"Made" means the council has formally brought the plan into force after it passed an independent examination and a local referendum (PM17). A plan approved at referendum is already part of the development plan, unless the council decides not to make it (Annex B, "Development plan"). A draft plan that has not reached referendum is not part of the development plan.',
        },
      ],
    },
  },
];
