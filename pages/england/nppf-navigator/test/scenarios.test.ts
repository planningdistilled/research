import { graph } from '../graph';
import { evaluate } from '../src/engine/evaluate';
import { validate } from '../src/engine/validate';
import type { Answers } from '../src/engine/types';
import { eq, ok, t } from './harness';

const route = (a: Answers) => evaluate(graph, a).facts.route;

const tr3Poor: Answers = {
  tr3Footway: ['narrow', 'oneSide', 'notStepFree'], tr3Lit: 'unlit', tr3Speed: ['20-30', '40'], tr3SpeedEvidence: 39.9, tr3Services: '800to2k', tr3Bus: 'minimal', tr3Rail: 'limited', tr3Tool: 'low',
};
const tr3Good: Answers = {
  tr3Footway: ['continuous'], tr3Lit: 'lit', tr3Speed: ['20-30'], tr3SpeedEvidence: 'none', tr3Services: 'under800', tr3Bus: 'frequent', tr3Rail: 'none', tr3Tool: 'high',
};

// 1. Washed-over village, grey belt, but not a sustainable location: inappropriate, no VSC.
const gbFail: Answers = {
  gb: 'washed-over', washedOverSettlementAck: true, devType: 'market-housing', units: 5, largeSite: 'no', heritage: ['lb2', 'ca'],
  supply: 'below5', constraints: ['treesHedges', 'access'], gb7cat: 'g', gb7gPlanAck: true, greyBelt: [], greyBeltUndermine: 'no', unmetNeedAck: true,
  ...tr3Poor, tr3: 'fail', he5: 'yes', heHarmFactors: ['setting-minor'], heEffect: 'harm-low', heBenefits: ['housing-small'], he64: 'outweighed', n21d: 'lost', dp32c: 'no', tr64: 'acceptable', dp3Conflicts: [], dp3: 'none',
  character: 'moderate', devPlan: 'limited', homesAck: true, otherBenefits: [], routeAck: true, gbHarmAck: true, vsc: 'not-shown',
};

t('graph validates', () => eq(validate(graph), []));

t('1. GB7(1)(g)(iii) fails: inappropriate, GB6(2), refuse', () => {
  const ev = evaluate(graph, gbFail);
  eq(ev.next, null, 'complete');
  eq(ev.facts.route, 'GB6(2)');
  eq(ev.outcome?.id, 'vsc-no');
  ok(ev.findings.some((f) => f.kind === 'fail' && f.policy === 'GB7(1)(g)(iii)'), 'limb (iii) fail recorded');
  ok(ev.findings.some((f) => f.kind === 'harm' && f.policy === 'GB6(2)'), 'Green Belt harm recorded');
  ok(!ev.path.some((s) => s.node.id === 'hdt'), 'HDT not asked when supply is below five years');
});

t('2. All GB7(1)(g) limbs pass, substantial character harm: S5(5), approve', () => {
  const a: Answers = { ...gbFail, heritage: [], ...tr3Good, tr3: 'pass', constraints: [], character: 'substantial', balance: 'not-outweighed' };
  delete a.vsc;
  delete a.gbHarmAck;
  const ev = evaluate(graph, a);
  eq(ev.facts.route, 'S5(5)');
  eq(ev.next, null);
  eq(ev.outcome?.id, 'bal-approve');
  ok(ev.path.some((s) => s.node.id === 'balancePlain'), 'plain balance used (no triggers)');
});

const heritageWithin: Answers = {
  gb: 'no', settlementLoc: 'within', devType: 'market-housing', units: 1, largeSite: 'no', heritage: ['lb2', 'ca'], supply: '5plus', hdt: '75plus',
  constraints: [], he5: 'yes', heHarmFactors: ['setting-minor'], heEffect: 'harm-low', heBenefits: ['housing-small'], he64: 'not-outweighed', dp3Conflicts: [], dp3: 'none', character: 'limited', devPlan: 'none', homesAck: true,
  otherBenefits: [], routeAck: true,
};

t('3. HE6(4) not outweighed is carried into the S4 balance, not an automatic refusal', () => {
  const ev = evaluate(graph, heritageWithin);
  eq(ev.facts.route, 'S4');
  eq(ev.next?.id, 'balancePlain', 'the balance is still asked after HE6(4) fails');
  ok(!ev.path.some((s) => s.node.id === 'balanceTriggered'), 'HE6(4) is not a "should be refused" trigger');
  const refused = evaluate(graph, { ...heritageWithin, balance: 'outweighed' });
  eq(refused.outcome?.id, 'bal-refuse-heritage');
  eq(refused.outcome?.verdict, 'refuse');
  const granted = evaluate(graph, { ...heritageWithin, balance: 'not-outweighed' });
  eq(granted.outcome?.id, 'bal-approve-heritage', 'a grant flags the unjustified heritage harm');
});

t('3b. HE5 assessment inadequate: harm cannot be ruled out, carried into the balance', () => {
  const a: Answers = { ...heritageWithin, he5: 'no' };
  delete a.heEffect;
  delete a.he64;
  const ev = evaluate(graph, a);
  eq(ev.next?.id, 'balancePlain');
  ok(ev.findings.some((f) => f.kind === 'harm' && f.policy === 'HE5(1)'), 'unassessed heritage effect weighed as harm');
  eq(evaluate(graph, { ...a, balance: 'outweighed' }).outcome?.id, 'bal-refuse-heritage');
});

const countryside: Answers = {
  gb: 'no', settlementLoc: 'outside', devType: 'market-housing', units: 9, largeSite: 'no', heritage: [], supply: 'below5', constraints: [],
  s5cat: 'j', s5j: 'pass', tr3Engaged: 'yes', ...tr3Good, tr3: 'pass', dp3Conflicts: [], dp3: 'none', character: 'limited', devPlan: 'none', homesAck: true, otherBenefits: ['economic'],
  routeAck: true, balance: 'not-outweighed',
};

t('4. Outside settlements, S5(1)(j) met, no triggers: approve', () => {
  const ev = evaluate(graph, countryside);
  eq(ev.facts.route, 'S5(1)');
  eq(ev.outcome?.id, 'bal-approve');
});

t('5. Outside settlements, no category, not isolated: S5(4)', () => {
  const a: Answers = { ...countryside, s5cat: 'none', isolated: 'no', exceptional: 'no' };
  delete a.s5j;
  delete a.balance;
  const ev = evaluate(graph, a);
  eq(ev.facts.route, 'S5(4)');
  eq(ev.outcome?.id, 'exc-no');
});

t('6. F7(2) not demonstrated: triggered balance, refuse', () => {
  const a: Answers = { ...countryside, constraints: ['flood'], f7: 'not-demonstrated', balance: 'outweighed' };
  const ev = evaluate(graph, a);
  ok(ev.path.some((s) => s.node.id === 'balanceTriggered'), 'triggered balance node used');
  eq(ev.outcome?.id, 'bal-refuse-trigger');
});

t('7. Changing an early answer re-routes and reports stale answers', () => {
  const a: Answers = { ...gbFail, gb: 'no', settlementLoc: 'within' };
  const ev = evaluate(graph, a);
  eq(route(a), 'S4');
  eq(ev.next?.id, 'balancePlain', 'the new route needs its own final judgement');
  ok(ev.stale.includes('gb7cat') && ev.stale.includes('vsc'), 'Green Belt answers are stale');
  ok(!ev.path.some((s) => s.node.section === 'greenbelt'), 'no Green Belt nodes on the path');
});

t('8. Major development brings in the Golden Rules', () => {
  const a: Answers = { ...gbFail, units: 12 };
  delete a.largeSite;
  const ev = evaluate(graph, a);
  ok(ev.path.some((s) => s.node.id === 'tr3'), 'reached TR3');
  eq(ev.next?.id, 'gb8', 'GB8 asked before heritage');
});

t('9. Partly within a settlement: S3(2) note, outside route, overall-view step', () => {
  const a: Answers = { ...countryside, settlementLoc: 'partly' };
  delete a.balance;
  const ev = evaluate(graph, a);
  eq(ev.facts.route, 'S5(1)');
  ok(ev.findings.some((f) => f.kind === 'note' && f.policy === 'S3(2)'), 'S3(2) recorded');
  eq(ev.next?.id, 's32Overall', 'overall-view step asked before the balance');
  const done = evaluate(graph, { ...a, s32Ack: true, balance: 'not-outweighed' });
  eq(done.outcome?.id, 'bal-approve');
});

t('10. Connectivity Tool not run records an evidence gap', () => {
  const ev = evaluate(graph, { ...countryside, tr3Tool: 'notRun' });
  ok(ev.findings.some((f) => f.kind === 'note' && f.policy === 'TR3(2)'), 'TR3(2) gap recorded');
  eq(ev.outcome?.id, 'bal-approve');
});

t('11. GB7 category auto-resolves to (g) when grey belt is the only available route', () => {
  // Open Green Belt + market housing: (b)/(c)/(d)/(e)/(h) are all filtered out, leaving only GB7(1)(g).
  const a: Answers = { gb: 'yes', devType: 'market-housing', units: 5, largeSite: 'no', heritage: [], supply: 'below5', constraints: [] };
  const ev = evaluate(graph, a);
  const step = ev.path.find((s) => s.node.id === 'gb7cat');
  ok(step?.auto === true && step?.answer === 'g', 'gb7cat auto-resolved to g without asking');
  eq(ev.next?.id, 'gb7gPlan', 'proceeds straight into the grey belt route');
});

t('11b. GB7 category is still asked when a specific category also applies', () => {
  // Washed-over village + market housing: (c) limited infilling is available alongside (g), so it is a real choice.
  const a: Answers = { gb: 'washed-over', washedOverSettlementAck: true, devType: 'market-housing', units: 5, largeSite: 'no', heritage: [], supply: 'below5', constraints: [] };
  const ev = evaluate(graph, a);
  eq(ev.next?.id, 'gb7cat', 'the category question is shown');
  ok(!ev.path.some((s) => s.node.id === 'gb7cat'), 'and not auto-resolved');
});

t('12. TR3 provisional reading leans to fail on a poor route, pass on a good one', () => {
  const failLean = evaluate(graph, gbFail).facts.tr3Lean; // tr3Poor: narrow footway + 40 mph
  eq(failLean, 'fail', 'poor route points to not sustainable');
  const passLean = evaluate(graph, { ...gbFail, ...tr3Good }).facts.tr3Lean;
  eq(passLean, 'pass', 'continuous lit route with a frequent bus points to sustainable');
});

t('13. Outside the Green Belt, TR3(1)(a) not engaged skips the location judgement and records a limited weight', () => {
  const ev = evaluate(graph, { ...countryside, tr3Engaged: 'no' });
  ok(!ev.path.some((s) => s.node.id === 'tr3'), 'the sustainable-location judgement is not asked');
  ok(ev.findings.some((f) => f.kind === 'harm' && f.policy === 'TR3(1)(a)' && f.weight === 'limited'), 'car-reliance recorded as a limited weight');
  const mod = evaluate(graph, { ...countryside, tr3Engaged: 'no-moderate' });
  ok(!mod.path.some((s) => s.node.id === 'tr3'), 'not engaged but weightier: the location judgement is still not asked');
  ok(mod.findings.some((f) => f.kind === 'harm' && f.policy === 'TR3(1)(a)' && f.weight === 'moderate'), 'car-reliance recorded as a moderate weight');
});

t('14. HE5(2) provisional degree of harm follows the ticked indicators', () => {
  const lean = (factors: string[]) => evaluate(graph, { ...heritageWithin, heHarmFactors: factors }).facts.heEffectLean;
  eq(lean(['key-element']), 'substantial', 'a key element seriously affected is substantial harm (HE5(2))');
  eq(lean(['setting-minor']), 'harm-low');
  eq(lean(['total-loss']), 'total-loss');
  eq(lean(['reveal']), 'positive');
  eq(lean([]), 'none', 'nothing ticked leans to no effect');
});

t('15. DP3(3): a ticked conflict without clear justification triggers "should be refused"', () => {
  eq(evaluate(graph, { ...countryside, dp3Conflicts: ['standards'] }).facts.dp3Lean, 'conflict', 'ticking a conflict route leans to conflict');
  eq(evaluate(graph, { ...countryside, dp3Conflicts: [] }).facts.dp3Lean, 'none', 'nothing ticked leans to no conflict');
  const trig = evaluate(graph, { ...countryside, dp3Conflicts: ['context', 'standards'], dp3: 'not-justified' });
  ok(trig.findings.some((f) => f.kind === 'trigger' && f.policy === 'DP3(3)'), 'no clear justification triggers DP3(3)');
  const ok2 = evaluate(graph, { ...countryside, dp3Conflicts: ['context'], dp3: 'justified' });
  ok(!ok2.findings.some((f) => f.kind === 'trigger' && f.policy === 'DP3(3)'), 'a clearly justified conflict is not a trigger');
});
