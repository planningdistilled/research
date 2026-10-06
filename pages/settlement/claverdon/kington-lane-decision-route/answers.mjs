// Answer sets for the NPPF 2026 Navigator, one per route the application argues.
// build.mjs runs each through the Navigator engine: every answer must be on the route, the set must be complete,
// and it must end on the route and outcome declared in `expect`.

// The same facts feed both routes: the site, the walking route and the other national policies.
const site = {
  gb: 'yes',
  devType: 'pdl',
  units: 10,
  heritage: [],
  supply: 'below5',
  constraints: ['flood', 'irreplaceable', 'biodiversity', 'treesHedges', 'access', 'neighbourhoodPlan'],
};
const location = {
  tr3Footway: ['narrow', 'gaps'],
  tr3Lit: 'unlit',
  tr3Speed: ['20-30', '50plus'],
  tr3SpeedEvidence: 32.3,
  tr3Services: '800to2k',
  tr3Bus: 'minimal',
  tr3Rail: 'none',
  tr3Tool: 'notRun',
  tr3: 'fail',
};
const others = {
  f7: 'not-demonstrated',
  n62: 'no-loss',
  n22: 'yes',
  n21d: 'justified',
  dp32c: 'no',
  tr64: 'unacceptable',
  dp3Conflicts: ['movement'],
  dp3: 'not-justified',
  character: 'limited',
  s6: 'not-engaged',
  devPlan: 'limited',
  homesAck: true,
  otherBenefits: ['economic'],
  routeAck: true,
};

export const ANSWER_SETS = [
  {
    key: 'grey-belt',
    title: 'Grey belt route, GB7(1)(g)',
    expect: { route: 'GB6(2)', outcome: 'vsc-no' },
    answers: {
      ...site,
      gb7cat: 'g',
      gb7gPlanAck: true,
      greyBelt: [],
      greyBeltUndermine: 'no',
      unmetNeedAck: true,
      ...location,
      gb8: 'fail',
      ...others,
      gbHarmAck: true,
      vsc: 'not-shown',
    },
  },
  {
    key: 'pdl',
    title: "Previously developed land route, GB7(1)(e), on the applicant's case",
    expect: { route: 'S5(5)', outcome: 'bal-refuse-trigger' },
    answers: {
      ...site,
      gb7cat: 'e',
      gb7e: 'pass',
      ...location,
      ...others,
      balance: 'outweighed',
    },
  },
];
