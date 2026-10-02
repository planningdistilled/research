import { canonical, codeMatches } from '../src/data/codes';
import { findCases, type CaseIdx } from '../src/data/match';
import { eq, ok, t } from './harness';

t('canonical codes', () => {
  eq(canonical('HE6:4'), 'HE6(4)');
  eq(canonical('HE6.1'), 'HE6(1)');
  eq(canonical('HE6 (Grade II* Church of St Cuthbert)'), 'HE6');
  eq(canonical('AnnexB:grey-belt'), 'AnnexB:grey-belt');
  eq(canonical('Annex A(2)'), 'AnnexA(2)');
  eq(canonical('GB7(1)(g)(iii)'), 'GB7(1)(g)(iii)');
  eq(canonical('H07'), 'HO7');
  eq(canonical('LP5 (Redbridge LP)'), null);
});

t('hierarchical matching', () => {
  ok(codeMatches('GB7(1)(g)(iii)', 'GB7(1)(g)'));
  ok(codeMatches('F7(2)', 'F7'));
  ok(!codeMatches('GB7(1)(e)', 'GB7(1)(g)'));
  ok(!codeMatches('HE61', 'HE6'));
});

const mk = (i: string, fw: string, d: string, finding: string): CaseIdx => ({
  i, t: i, a: 'x', r: 'x', dm: 'I', d, o: finding === 'fail' ? 'dismissed' : 'allowed', ref: null, dt: ['housing-minor'], u: 5, sc: ['green-belt'], gb: 1, gy: 'accepted',
  hls: 2, fw, v: 'L', tg: [], f: [['GB7(1)(g)(iii)', finding, null]], det: [], ns: 0, bs: 0,
});

t('2026-Framework decisions rank first; grouping by finding', () => {
  const idx = [mk('old', '24t', '2026-09-20', 'fail'), mk('new', '26', '2026-08-20', 'fail'), mk('pass', '26', '2026-09-01', 'pass')];
  const groups = findCases(idx, { policies: ['GB7(1)(g)'], groupBy: 'finding' }, { gb: 'yes' });
  eq(groups.map((g) => g.key), ['fail', 'pass']);
  eq(groups[0].matches.map((m) => m.c.i), ['new', 'old']);
});
