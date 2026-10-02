import type { GraphNode } from '../../src/engine/types';

export const benefits: GraphNode[] = [
  {
    id: 'homes',
    kind: 'info',
    section: 'benefits',
    fact: 'homesAck',
    title: 'HO7(1): the benefit of new homes',
    prompt: 'Substantial weight is given to providing homes that contribute to evidenced accommodation needs.',
    quotes: ['HO7(1)'],
    help: [
      'The weight for very small numbers is not settled. Some decisions have tempered it: five homes were given moderate weight, and only modest weight in the very special circumstances balance (6010313 ¶33, ¶38); three homes moderate weight (6011585 ¶17); one home limited weight (6010642 ¶26). Others give one home the full substantial weight under HO7 (6010097 ¶11; one secured self-build home at 6010020 ¶23).',
    ],
    input: { type: 'ack' },
    effects: [{ finding: { kind: 'benefit', policy: 'HO7(1)', weight: 'substantial', text: 'New homes towards evidenced needs attract substantial weight (HO7(1)).' } }],
    cases: { policies: ['HO7'], groupBy: 'outcome', label: 'Weight given to housing' },
  },
  {
    id: 'otherBenefits',
    kind: 'question',
    section: 'benefits',
    fact: 'otherBenefits',
    title: 'Other benefits',
    help: ['At inquiry, affordable homes, homes for older people and custom self-build were each given substantial weight under HO7, as separate benefits (6008238 ¶139). Record a higher weight in your own reasons where the evidence supports it.'],
    prompt: 'Which other benefits does the proposal secure? Select all that apply, or none. Weights shown are typical of decisions, not fixed.',
    input: {
      type: 'multi',
      options: [
        { value: 'affordable', label: 'Affordable housing, secured by obligation', effects: [{ kind: 'benefit', policy: 'HO7', weight: 'significant', text: 'Affordable housing, secured.' }] },
        { value: 'selfBuild', label: 'Self-build or custom housing, secured by obligation', effects: [{ kind: 'benefit', policy: 'HO7', weight: 'significant', text: 'Self-build or custom housebuilding, secured.' }] },
        { value: 'economic', label: 'Construction jobs and local spending', effects: [{ kind: 'benefit', policy: 'E2', weight: 'limited', text: 'Short-term economic benefits of construction and occupation.' }] },
        { value: 'bng', label: 'Biodiversity gain beyond the statutory 10%', effects: [{ kind: 'benefit', policy: 'N2', weight: 'limited', text: 'Biodiversity gain beyond the statutory requirement.' }] },
        { value: 'energy', label: 'Energy performance clearly beyond Building Regulations', effects: [{ kind: 'benefit', policy: 'CC2', weight: 'limited', text: 'Energy performance beyond the regulatory minimum.' }] },
      ],
    },
  },
];
