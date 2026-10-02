import type { Graph, Pred } from '../src/engine/types';
import { quotes } from './policies';
import { core } from './nodes/core';
import { greenbelt, greenbeltAfterTr3 } from './nodes/greenbelt';
import { countryside } from './nodes/countryside';
import { tr3 } from './nodes/tr3';
import { heritage } from './nodes/heritage';
import { triggers } from './nodes/triggers';
import { benefits } from './nodes/benefits';
import { balance } from './nodes/balance';

const inGB: Pred = { in: ['gb', ['yes', 'washed-over']] };
const passed = (fact: string, value: string, cat: string, catFact: string): Pred => ({ all: [{ eq: [catFact, cat] }, { eq: [fact, value] }] });

const gbCategoryMet: Pred = {
  any: [
    passed('gb7b', 'pass', 'b', 'gb7cat'),
    passed('gb7c', 'pass', 'c', 'gb7cat'),
    passed('gb7d', 'pass', 'd', 'gb7cat'),
    passed('gb7e', 'pass', 'e', 'gb7cat'),
    passed('gb7h', 'pass', 'h', 'gb7cat'),
    {
      all: [
        { eq: ['gb7cat', 'g'] },
        { not: { any: [{ has: ['greyBelt', 'a'] }, { has: ['greyBelt', 'b'] }, { has: ['greyBelt', 'd'] }] } },
        { eq: ['greyBeltUndermine', 'no'] },
        { eq: ['unmetNeed', true] },
        { eq: ['tr3', 'pass'] },
        { any: [{ ne: ['major', true] }, { eq: ['gb8', 'pass'] }] },
      ],
    },
  ],
};

const heritageUnjustified: Pred = { any: [{ hasFinding: { kind: 'fail', policy: 'HE6(4)' } }, { hasFinding: { kind: 'fail', policy: 'HE5(1)' } }] };

const s5Met: Pred = { any: ['c', 'd', 'e', 'f', 'h', 'i', 'j'].map((c) => passed(`s5${c}`, 'pass', c, 's5cat')) };

export const graph: Graph = {
  meta: {
    id: 'nppf-2026-navigator',
    version: '1',
    title: 'NPPF 2026 Navigator',
    framework: 'National Planning Policy Framework (August 2026)',
    frameworkDate: '2026-08-17',
  },
  sections: [
    { id: 'core', title: 'The site and the proposal' },
    { id: 'greenbelt', title: 'Green Belt' },
    { id: 'countryside', title: 'Outside settlements' },
    { id: 'location', title: 'Sustainable location' },
    { id: 'heritage', title: 'Heritage' },
    { id: 'triggers', title: 'Other national policies' },
    { id: 'benefits', title: 'Benefits' },
    { id: 'balance', title: 'The decision' },
  ],
  quotes,
  derived: [
    { fact: 'major', value: true, when: { any: [{ gte: ['units', 10] }, { eq: ['largeSite', 'yes'] }] }, note: 'Annex B: 10 or more homes, or a site of 0.5 ha or more.' },
    { fact: 'major', value: false, when: true },
    { fact: 'unmetNeed', value: true, when: { any: [{ eq: ['supply', 'below5'] }, { eq: ['hdt', 'below75'] }] }, note: 'GB7 footnote 41; S5(1)(j).' },
    { fact: 'unmetNeed', value: false, when: true },
    // Provisional TR3 reading from the route answers, shown at the sustainable-location judgement for the user to
    // confirm or override. Heuristic grounded in green-belt.md P1-P3; never decides on its own.
    {
      fact: 'tr3Lean',
      value: 'fail',
      when: {
        any: [
          { has: ['tr3Footway', 'gaps'] },
          { has: ['tr3Footway', 'none'] },
          { all: [{ has: ['tr3Footway', 'narrow'] }, { any: [{ has: ['tr3Speed', '40'] }, { has: ['tr3Speed', '50plus'] }] }] },
          { all: [{ in: ['tr3Bus', ['minimal', 'none']] }, { eq: ['tr3Services', 'over2k'] }, { ne: ['tr3Rail', 'wellConnected'] }] },
        ],
      },
      note: 'Provisional: the route answers point to car reliance.',
    },
    {
      fact: 'tr3Lean',
      value: 'pass',
      when: {
        all: [
          { has: ['tr3Footway', 'continuous'] },
          { not: { has: ['tr3Footway', 'gaps'] } },
          { not: { has: ['tr3Footway', 'none'] } },
          { not: { has: ['tr3Footway', 'narrow'] } },
          { eq: ['tr3Lit', 'lit'] },
          { not: { any: [{ has: ['tr3Speed', '40'] }, { has: ['tr3Speed', '50plus'] }] } },
          { any: [{ eq: ['tr3Bus', 'frequent'] }, { eq: ['tr3Rail', 'wellConnected'] }] },
          { ne: ['tr3Services', 'over2k'] },
        ],
      },
      note: 'Provisional: a continuous route with a genuine transport alternative.',
    },
    { fact: 'tr3Lean', value: 'balanced', when: true },
    // Provisional degree of harm from the ticked HE5(2) indicators, shown at the heEffect judgement to confirm or
    // override. Mapping follows HE5(2): substantial harm = a key element seriously affected. Most severe first.
    { fact: 'heEffectLean', value: 'total-loss', when: { has: ['heHarmFactors', 'total-loss'] } },
    { fact: 'heEffectLean', value: 'substantial', when: { any: [{ has: ['heHarmFactors', 'key-element'] }, { has: ['heHarmFactors', 'main-feature'] }] } },
    { fact: 'heEffectLean', value: 'harm-high', when: { has: ['heHarmFactors', 'functional-link'] } },
    { fact: 'heEffectLean', value: 'harm-moderate', when: { has: ['heHarmFactors', 'setting-dominate'] } },
    { fact: 'heEffectLean', value: 'harm-low', when: { has: ['heHarmFactors', 'setting-minor'] } },
    { fact: 'heEffectLean', value: 'positive', when: { has: ['heHarmFactors', 'reveal'] } },
    { fact: 'heEffectLean', value: 'none', when: true },
    // Provisional DP3(3) reading: is there a design conflict at all? Any ticked conflict route means yes; the
    // clear-justification call is left entirely to the user.
    {
      fact: 'dp3Lean',
      value: 'conflict',
      when: {
        any: ['context', 'standards', 'liveability', 'climate', 'nature', 'movement', 'builtform', 'publicspace', 'identity'].map((v) => ({ has: ['dp3Conflicts', v] }) as Pred),
      },
    },
    { fact: 'dp3Lean', value: 'none', when: true },
    { fact: 'outside', value: true, when: { all: [{ eq: ['gb', 'no'] }, { in: ['settlementLoc', ['outside', 'partly']] }] }, note: 'S3(1)(b), S3(2).' },
    { fact: 'outside', value: false, when: true },
    {
      fact: 'designated',
      value: true,
      when: { any: ['lb2', 'lbHigh', 'ca', 'rpg', 'sm'].map((v) => ({ has: ['heritage', v] }) as Pred) },
      note: 'Annex B: designated heritage assets.',
    },
    { fact: 'designated', value: false, when: true },
    { fact: 's5pass', value: true, when: s5Met },
    { fact: 's5pass', value: false, when: true },
    { fact: 'route', value: 'S5(5)', when: { all: [inGB, gbCategoryMet] }, note: 'GB7 category met: not inappropriate (S5(5)).' },
    { fact: 'route', value: 'GB6(2)', when: inGB, note: 'Inappropriate development (GB6).' },
    { fact: 'route', value: 'S4', when: { all: [{ eq: ['gb', 'no'] }, { eq: ['settlementLoc', 'within'] }] }, note: 'S3(1)(a).' },
    { fact: 'route', value: 'S5(1)', when: { all: [{ eq: ['outside', true] }, { eq: ['s5pass', true] }] }, note: 'S5(1).' },
    { fact: 'route', value: 'S5(3)', when: { all: [{ eq: ['outside', true] }, { eq: ['isolated', 'yes'] }] }, note: 'S5(3).' },
    { fact: 'route', value: 'S5(4)', when: { eq: ['outside', true] }, note: 'S5(4).' },
  ],
  nodes: [...core, ...greenbelt, ...countryside, ...tr3, ...greenbeltAfterTr3, ...heritage, ...triggers, ...benefits, ...balance],
  outcomes: [
    { id: 'ho11', when: { all: [{ eq: ['route', 'S5(3)'] }, { eq: ['ho11', 'fail'] }] }, verdict: 'refuse', title: 'Refuse: an isolated home outside HO11', test: 'Isolated homes should not be approved other than in accordance with HO11 (S5(3)).', quotes: ['S5(3)'] },
    { id: 'vsc-no', when: { eq: ['vsc', 'not-shown'] }, verdict: 'refuse', title: 'Refuse: inappropriate development, no very special circumstances', test: 'The harm to the Green Belt and any other harm are not clearly outweighed (GB6(2)).', quotes: ['GB6(2)'] },
    { id: 'vsc-yes', when: { eq: ['vsc', 'shown'] }, verdict: 'approve', title: 'Approve: very special circumstances', test: 'The harm to the Green Belt and any other harm are clearly outweighed by other considerations (GB6(2)).', quotes: ['GB6(2)'] },
    { id: 'vsc-fine', when: { eq: ['vsc', 'finely'] }, verdict: 'balanced', title: 'Finely balanced: very special circumstances', test: 'Turns on whether the Green Belt harm and other harm are clearly outweighed (GB6(2)).', quotes: ['GB6(2)'] },
    { id: 'exc-yes', when: { eq: ['exceptional', 'yes'] }, verdict: 'approve', title: 'Approve: exceptional circumstances', test: 'The benefits substantially outweigh the adverse effects (S5(4)).', quotes: ['S5(4)'] },
    { id: 'exc-no', when: { eq: ['exceptional', 'no'] }, verdict: 'refuse', title: 'Refuse: outside the S5(1) categories, no exceptional circumstances', test: 'The benefits do not substantially outweigh the adverse effects (S5(4)).', quotes: ['S5(4)'] },
    { id: 'exc-fine', when: { eq: ['exceptional', 'finely'] }, verdict: 'balanced', title: 'Finely balanced: exceptional circumstances', test: 'Turns on whether the benefits substantially outweigh the adverse effects (S5(4)).', quotes: ['S5(4)'] },
    {
      id: 'bal-refuse-trigger',
      when: { all: [{ eq: ['balance', 'outweighed'] }, { hasFinding: { kind: 'trigger' } }] },
      verdict: 'refuse',
      title: 'Refuse: fails a policy that says development "should be refused"',
      test: 'Failing a "should be refused" policy means the benefits are likely to be substantially outweighed (S4(2)(c), S5(2)), and they are.',
      quotes: ['S5(2)', 'S4(2)(c)'],
    },
    {
      id: 'bal-refuse-heritage',
      when: { all: [{ eq: ['balance', 'outweighed'] }, heritageUnjustified] },
      verdict: 'refuse',
      title: 'Refuse: unjustified heritage harm, benefits substantially outweighed',
      test: 'The heritage harm, of considerable importance and weight, has no clear and convincing justification (HE6(4), HE4(2)), and carried into the overall balance it substantially outweighs the benefits.',
      quotes: ['HE6(4)', 'HE6(3)', 'HE4(2)', 'S4(1)', 'S5(5)'],
    },
    {
      id: 'bal-approve-heritage',
      when: { all: [{ eq: ['balance', 'not-outweighed'] }, heritageUnjustified] },
      verdict: 'approve',
      title: 'Approve, although the heritage harm is not justified',
      test: 'The benefits are not substantially outweighed, but the heritage harm has no clear and convincing justification (HE4(2)) and was not outweighed by public benefits (HE6(4)). A grant on this basis must explain how harm of considerable importance and weight (HE6(3)), and the section 66 duty for a listed building\'s setting, were weighed; decisions that omit that step are the ones most open to challenge.',
      quotes: ['HE6(3)', 'HE6(4)', 'HE4(2)', 'S4(1)'],
    },
    { id: 'bal-refuse', when: { eq: ['balance', 'outweighed'] }, verdict: 'refuse', title: 'Refuse: benefits substantially outweighed', test: 'The benefits are substantially outweighed by the adverse effects, assessed against the national decision-making policies.', quotes: ['S4(1)', 'S5(1)', 'S5(5)'] },
    { id: 'bal-approve', when: { eq: ['balance', 'not-outweighed'] }, verdict: 'approve', title: 'Approve: benefits not substantially outweighed', test: 'The benefits are not substantially outweighed by the adverse effects.', quotes: ['S4(1)', 'S5(1)', 'S5(5)'] },
    { id: 'bal-fine', when: { eq: ['balance', 'finely'] }, verdict: 'balanced', title: 'Finely balanced', test: 'Turns on whether the benefits are substantially outweighed by the adverse effects.', quotes: ['S4(1)', 'S5(1)', 'S5(5)'] },
  ],
};
