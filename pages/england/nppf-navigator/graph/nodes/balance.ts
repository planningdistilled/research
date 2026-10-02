import type { GraphNode } from '../../src/engine/types';

const route = (r: string) => ({ eq: ['route', r] }) as const;
const triggered = { hasFinding: { kind: 'trigger' } } as const;

const routeInfo = (id: string, r: string, title: string, prompt: string, quotes: string[], text: string): GraphNode => ({
  id,
  kind: 'info',
  section: 'balance',
  fact: 'routeAck',
  when: route(r),
  title,
  prompt,
  quotes,
  input: { type: 'ack' },
  effects: [{ finding: { kind: 'route', policy: r, text } }],
});

const balanceOptions = {
  type: 'single' as const,
  options: [
    { value: 'outweighed', label: 'Yes: the benefits are substantially outweighed, so refuse' },
    { value: 'not-outweighed', label: 'No: the benefits are not substantially outweighed, so approve' },
    { value: 'finely', label: 'Too finely balanced to call' },
  ],
};

export const balance: GraphNode[] = [
  routeInfo('routeGB6', 'GB6(2)', 'Route: inappropriate development in the Green Belt', 'No GB7 category is met, so the proposal is inappropriate development. It can only be approved in very special circumstances.', ['GB6(1)', 'GB6(2)'],
    'Inappropriate development in the Green Belt, to be approved only in very special circumstances (GB6).'),
  routeInfo('routeS55', 'S5(5)', 'Route: not inappropriate, so the S5(5) balance applies', 'A GB7 category is met, so the proposal is not inappropriate. It should be approved unless the benefits are substantially outweighed by adverse effects, applying S5(2).', ['S5(5)', 'S5(2)'],
    'Not inappropriate development in the Green Belt: approve unless the benefits are substantially outweighed (S5(5)).'),
  routeInfo('routeS4', 'S4', 'Route: within a settlement, so S4 applies', 'Development within settlements should be approved unless the benefits are substantially outweighed by adverse effects.', ['S4(1)', 'S4(2)(c)'],
    'Within a settlement: approve unless the benefits are substantially outweighed (S4(1)).'),
  routeInfo('routeS51', 'S5(1)', 'Route: an S5(1) category outside settlements', 'The proposal falls in an S5(1) category. It should be approved unless the benefits are substantially outweighed by adverse effects.', ['S5(1)', 'S5(2)'],
    'Outside settlements, in an S5(1) category: approve unless the benefits are substantially outweighed (S5(1)).'),
  routeInfo('routeS53', 'S5(3)', 'Route: an isolated home', 'Isolated homes should not be approved other than in accordance with HO11.', ['S5(3)'],
    'An isolated home, decided under S5(3) and HO11.'),
  routeInfo('routeS54', 'S5(4)', 'Route: outside the S5(1) categories', 'The proposal is not in an S5(1) category, so it should be approved only in exceptional circumstances, where the benefits substantially outweigh the adverse effects.', ['S5(4)'],
    'Outside settlements and outside the S5(1) categories: approve only in exceptional circumstances (S5(4)).'),
  {
    id: 's32Overall',
    kind: 'info',
    section: 'balance',
    fact: 's32Ack',
    when: { all: [{ eq: ['gb', 'no'] }, { eq: ['settlementLoc', 'partly'] }] },
    title: 'S3(2): the part inside the settlement, and the overall view',
    prompt:
      'The route above is for the part of the site outside the settlement. The part inside is judged under S4: approve unless the benefits are substantially outweighed. Take both into account in the final balance, which is your overall view on the whole proposal.',
    quotes: ['S3(2)', 'S4(1)'],
    input: { type: 'ack' },
  },
  {
    id: 'gbHarm',
    kind: 'info',
    section: 'balance',
    fact: 'gbHarmAck',
    when: route('GB6(2)'),
    title: 'Harm to the Green Belt',
    prompt: 'Inappropriate development is harmful by definition. Substantial weight is given to that harm, including harm to openness.',
    quotes: ['GB6(2)'],
    input: { type: 'ack' },
    effects: [{ finding: { kind: 'harm', policy: 'GB6(2)', weight: 'substantial', text: 'Harm to the Green Belt by reason of inappropriateness, and to its openness, carries substantial weight (GB6(2)).' } }],
    cases: { policies: ['GB6(2)'], tags: ['vsc-not-shown', 'vsc-shown'], groupBy: 'outcome' },
  },
  {
    id: 'vsc',
    kind: 'judgement',
    section: 'balance',
    fact: 'vsc',
    when: route('GB6(2)'),
    title: 'GB6(2): very special circumstances',
    prompt: 'Is the harm to the Green Belt by reason of inappropriateness, and any other harm, clearly outweighed by other considerations? The findings so far are listed alongside.',
    quotes: ['GB6(2)'],
    help: [
      'A housing shortfall alone has rarely been enough. At 6010313, five homes at a 1.97-year supply got only modest weight in this balance (¶38).',
      'An absence of other harm is neutral. It does not count in favour (6010313 ¶36).',
      'Heritage harm counts as "any other harm". A failed HE6(4) balance adds harm of considerable importance and weight that is not outweighed even by the public benefits.',
    ],
    method: {
      question: 'Do the other considerations clearly outweigh the harm to the Green Belt, given substantial weight, plus any other harm?',
      steps: [
        'Polarity: this balance starts against the proposal. Put the harm on one side: harm by reason of inappropriateness and to openness, which GB6(2) says should be given substantial weight, plus every other harm found so far with its weight.',
        'On the other side, list the other considerations and give each a weight. Moderate the weight of housing where the scale is small or residents would depend on the car (6012481 ¶42).',
        'Treat an absence of harm on other matters as neutral, not as a benefit (6010313 ¶36).',
        'Give a fallback weight only if it is realistic and no less harmful than the proposal (6010313 ¶35).',
        'Ask whether the considerations clearly outweigh the harm. If they do not, very special circumstances do not exist.',
      ],
      pointers: [
        { option: 'shown', factors: ['An essential, evidenced need that cannot be met outside the Green Belt, such as a rural worker\'s dwelling', 'A realistic fallback that would be more harmful than the proposal', 'For renewable energy, the wider environmental benefits (GB6(3))', 'Little harm beyond inappropriateness'] },
        {
          option: 'not-shown',
          factors: [
            'The case rests on general housing supply; even substantial housing weight has not been enough (6009966 ¶45)',
            'A few homes given only modest weight at a low supply (6010313 ¶38)',
            'Other harm as well, such as to character, heritage or sustainable location',
            'A fallback that would cause less harm (6010313 ¶35)',
          ],
        },
      ],
      evidence: ['The list of harms found so far and their weights', 'The benefits, with evidence of need and how they are secured', 'Any fallback: its lawful status and how it compares in harm'],
      closeCall: 'The standard is "clearly outweighed", and it favours refusal. If the considerations only equal or narrowly exceed the harm, very special circumstances do not exist.',
    },
    input: {
      type: 'single',
      options: [
        { value: 'shown', label: 'Yes: clearly outweighed, so very special circumstances exist' },
        { value: 'not-shown', label: 'No: very special circumstances do not exist' },
        { value: 'finely', label: 'Too finely balanced to call' },
      ],
    },
    cases: { policies: ['GB6(2)'], tags: ['vsc-shown', 'vsc-not-shown'], groupBy: 'outcome', label: 'Very special circumstances' },
  },
  {
    id: 'balanceTriggered',
    kind: 'judgement',
    section: 'balance',
    fact: 'balance',
    when: { all: [{ in: ['route', ['S4', 'S5(1)', 'S5(5)', 'S5(3)']] }, { ne: ['ho11', 'fail'] }, triggered] },
    title: 'The balance, with a "should be refused" policy failed',
    prompt:
      'The proposal fails at least one national policy that says development "should be refused". S4(2)(c) and S5(2) say the benefits are then likely to be substantially outweighed. Is there anything that displaces that?',
    quotes: ['S5(2)', 'S4(2)(c)'],
    help: ['In the dataset, decisions that found a trigger policy failed were dismissals or refusals, with no counter-examples (e.g. 6008167, 6005325).'],
    method: {
      question: 'Is there anything about this case that displaces the Framework\'s indication that the benefits are likely to be substantially outweighed?',
      steps: [
        'Polarity: the S4(1), S5(1) and S5(5) balance favours approval, but a failed "should be refused" policy is a circumstance in which the benefits are "likely to be substantially outweighed" (S4(2)(c), S5(2)). The starting point now points to refusal.',
        'Confirm the failed policy and why it failed. Check that its own exceptions or justification tests (for example DP3(3) "clear justification") have been answered, not assumed.',
        'List the benefits and their weights, and the other harms and their weights.',
        '"Likely" is not automatic. Ask whether something specific to this case, beyond the ordinary benefits of the development, is strong enough to displace the indication.',
        'If nothing does, conclude that the benefits are substantially outweighed, as inspectors have done even where housing carried substantial weight (6008167 ¶21).',
      ],
      pointers: [
        { option: 'outweighed', factors: ['The only benefits are the ordinary ones of the scheme, such as homes and construction jobs', 'The harm behind the failed policy carries significant weight or more', 'Other harms add to the failed policy'] },
        { option: 'not-outweighed', factors: ['A benefit of exceptional scale or kind that only this scheme can deliver', 'The failure is marginal and the harm behind it is very limited'] },
        { option: 'finely', factors: ['A real doubt whether the triggering policy has actually failed: go back and resolve it first'] },
      ],
      evidence: ['The trigger finding and its reasons', 'The benefits and their weights', 'The other harms and their weights'],
      closeCall: 'The Framework says "likely", so the burden falls on whoever says the indication is displaced. In the dataset no decision that found a trigger policy failed went on to approve. If in doubt, answer "Yes".',
    },
    input: balanceOptions,
    cases: { policies: ['S5(2)', 'S4(2)(c)'], groupBy: 'outcome' },
  },
  {
    id: 'balancePlain',
    kind: 'judgement',
    section: 'balance',
    fact: 'balance',
    when: { all: [{ in: ['route', ['S4', 'S5(1)', 'S5(5)', 'S5(3)']] }, { ne: ['ho11', 'fail'] }, { not: triggered }] },
    title: 'The balance: substantially outweighed?',
    prompt: 'Weighing the adverse effects listed alongside against the benefits, are the benefits of approval substantially outweighed?',
    quotes: ['S4(1)', 'S5(1)', 'S5(5)'],
    help: [
      '"Substantially outweighed" is a strong tilt towards approval. In some council decisions, harm given substantial weight did not substantially outweigh substantial housing benefit (stratford-26-00617-PIP, stratford-26-01458-FUL) (but see DP3(3): that report did not ask whether there was clear justification).',
      'A failed HE6(4) balance is not a "should be refused" trigger, but it is weighed here as harm of considerable importance and weight with no clear and convincing justification (HE6(3), HE4(2)). Inspectors who found HE6(4) failed went on to find the benefits substantially outweighed (6007221 ¶40, ¶51).',
      'Inspectors have found substantial housing weight substantially outweighed by heritage harm (6009545) and by design conflict (6008167).',
    ],
    method: {
      question: 'Are the benefits of approval substantially outweighed by the adverse effects, assessed against the Framework\'s decision-making policies?',
      steps: [
        'Polarity: this balance favours approval. The proposal should be approved unless the adverse effects substantially outweigh the benefits (S4(1), S5(1), S5(5)).',
        'List the benefits with a weight for each, applying any weight the Framework sets (for example substantial weight to housing under HO7).',
        'List the adverse effects with a weight for each, including any failed HE6(4) balance (harm of considerable importance and weight, unjustified under HE4(2)), any unassessed heritage effect (HE5), or DP3 conflict carried forward.',
        'Check the S4(2) or S5(2) circumstances. The lists are not exhaustive, so harm outside it can still substantially outweigh the benefits (6007054 ¶22).',
        'Ask whether the adverse effects outweigh the benefits by a substantial margin, not just outweigh them.',
      ],
      pointers: [
        { option: 'outweighed', factors: ['Harm to a designated heritage asset against a small scheme (6009545 ¶23)', 'A design conflict with no clear justification (6008167 ¶21)', 'Several harms of significant weight against modest benefits'] },
        { option: 'not-outweighed', factors: ['Harms of limited or moderate weight against substantial housing weight', 'Harms only slightly greater than the benefits', 'The main harm is mitigated by condition or obligation'] },
      ],
      evidence: ['The list of findings so far, with weights', 'The housing land supply position', 'Any conditions or obligations that secure benefits or reduce harm'],
      closeCall: 'The standard is "substantially outweighed", and it favours approval. If the harms only equal or narrowly exceed the benefits, answer "No".',
    },
    input: balanceOptions,
    cases: { policies: ['S4(1)', 'S5(1)', 'S5(5)'], groupBy: 'outcome' },
  },
  {
    id: 'exceptional',
    kind: 'judgement',
    section: 'balance',
    fact: 'exceptional',
    when: route('S5(4)'),
    title: 'S5(4): exceptional circumstances',
    prompt: 'Would the benefits substantially outweigh the adverse effects, including to the character of the countryside and to sustainable patterns of movement?',
    quotes: ['S5(4)'],
    method: {
      question: 'Would the benefits substantially outweigh the adverse effects, including to the character of the countryside and to sustainable patterns of movement?',
      steps: [
        'Polarity: this balance is the reverse of S5(1). The proposal is outside every S5(1) category, so it should be approved only if the benefits substantially outweigh the adverse effects.',
        'List the adverse effects with a weight for each, including any heritage harm carried from HE6(4) or HE5. Always consider the two S5(4) names: harm to the character of the countryside, and to sustainable patterns of movement (use the TR3 finding).',
        'List the benefits with a weight for each. Substantial weight to housing under HO7 does not by itself meet the test (6010090 ¶19).',
        'Give a fallback weight only if it is realistic, and compare its harm with the proposal\'s (6010401 ¶21).',
        'Ask whether the benefits exceed the adverse effects by a substantial margin. Only then do exceptional circumstances exist.',
      ],
      pointers: [
        {
          option: 'yes',
          factors: [
            'A realistic fallback that would cause more harm than the proposal',
            'Benefits of an unusual kind or scale that only this site can deliver',
            'Little harm to countryside character and a sustainable location under TR3',
            'At a hearing, 66 homes with a substantial supply shortfall, 25% affordable housing and an emerging allocation covering the site substantially outweighed moderate harm to countryside character (6008253 ¶85)',
          ],
        },
        {
          option: 'no',
          factors: [
            'One or a few homes, even with substantial weight under HO7 (6010090 ¶19)',
            'Benefits of a high order that still fall short of substantially outweighing (6011079 ¶35)',
            'Limited benefits, and a fallback that would harm the countryside less than the scheme (6010401 ¶20–21)',
            'Residents would depend on the car',
          ],
        },
      ],
      evidence: ['The list of findings so far, with weights', 'The TR3 finding and the landscape and character finding', 'Any fallback and how its harm compares'],
      closeCall: 'The burden is on the benefits: they must substantially outweigh the harm. If the balance is even, or the benefits only narrowly exceed the harm, answer "No".',
    },
    input: {
      type: 'single',
      options: [
        { value: 'yes', label: 'Yes: exceptional circumstances' },
        { value: 'no', label: 'No' },
        { value: 'finely', label: 'Too finely balanced to call' },
      ],
    },
    cases: { policies: ['S5(4)'], groupBy: 'outcome' },
  },
];
