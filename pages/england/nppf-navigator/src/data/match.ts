import { codeMatches } from './codes';
import type { CaseQuery, Facts } from '../engine/types';

/** One row of the always-loaded match index (compact keys; see build/build-data.mjs). */
export interface CaseIdx {
  i: string; // case id
  t: string; // title
  a: string; // authority
  r: string; // region
  dm: string; // I | SoS | C | D | Ct
  d: string; // decision date
  o: string; // outcome
  ref: string | null;
  dt: string[];
  u: number | null;
  sc: string[];
  gb: 0 | 1;
  gy: string;
  hls: number | null;
  fw: string; // 26 | 24t | nc
  v: string; // L | R | N
  tg: string[];
  f: [string, string, string | null][]; // [code, finding, weight]
  det: string[];
  ns: number;
  bs: number;
}

export interface Match {
  c: CaseIdx;
  row: number; // index into c.f of the matched finding
  score: number;
}

export interface Group {
  key: string;
  label: string;
  matches: Match[];
}

const PERMITTED = new Set(['allowed', 'approved', 'part-allowed', 'split']);
const FINDING_LABEL: Record<string, string> = {
  pass: 'Test met',
  fail: 'Test failed',
  harm: 'Harm found',
  benefit: 'Benefit found',
  conflict: 'Conflict found',
  accord: 'Accords',
  neutral: 'Neutral',
  'not-engaged': 'Not engaged',
};
const FINDING_ORDER = ['fail', 'pass', 'harm', 'conflict', 'benefit', 'accord', 'neutral', 'not-engaged'];

function similarity(c: CaseIdx, q: CaseQuery, facts: Facts): number {
  let s = 0;
  if (c.fw === '26') s += 3;
  if (c.v === 'L') s += 1;
  if (c.dm === 'I' || c.dm === 'SoS') s += 1;
  const inGB = facts.gb === 'yes' || facts.gb === 'washed-over';
  if (facts.gb !== undefined && !!c.gb === inGB) s += 2;
  if (facts.gb === 'washed-over' && c.sc.includes('washed-over-village')) s += 2;
  for (const x of q.context ?? []) if (c.sc.includes(x)) s += 1;
  const heritage = Array.isArray(facts.heritage) ? facts.heritage : [];
  if ((heritage.includes('lb2') || heritage.includes('lbHigh')) && c.sc.includes('listed-building-setting')) s += 1;
  if (heritage.includes('ca') && c.sc.includes('conservation-area')) s += 1;
  if (facts.devType && c.dt.some((d) => d.startsWith('housing') || d === 'self-build' || d === 'PIP')) s += 1;
  const units = typeof facts.units === 'number' ? facts.units : null;
  if (units !== null && c.u !== null && (units < 10) === (c.u < 10)) s += 1;
  if (facts.supply === 'below5' && c.hls !== null && c.hls < 5) s += 1;
  if (c.det.some((d) => q.policies.some((p) => codeMatches(d, p)))) s += 1;
  return s;
}

/** Cases with a finding on the queried policies, ranked by similarity to the user's facts, then recency. */
export function findCases(index: CaseIdx[], q: CaseQuery, facts: Facts): Group[] {
  const matches: Match[] = [];
  for (const c of index) {
    if (q.tags?.length && !q.tags.some((t) => c.tg.includes(t))) continue;
    const row = c.f.findIndex(([code, finding]) => q.policies.some((p) => codeMatches(code, p)) && (!q.findings || q.findings.includes(finding)));
    if (row < 0) continue;
    matches.push({ c, row, score: similarity(c, q, facts) });
  }
  matches.sort((a, b) => b.score - a.score || (a.c.d < b.c.d ? 1 : -1));

  if (q.groupBy === 'outcome') {
    const yes = matches.filter((m) => PERMITTED.has(m.c.o));
    const no = matches.filter((m) => !PERMITTED.has(m.c.o));
    return [
      { key: 'refused', label: 'Dismissed or refused', matches: no },
      { key: 'permitted', label: 'Allowed or approved', matches: yes },
    ].filter((g) => g.matches.length);
  }
  if (q.groupBy === 'finding') {
    const by = new Map<string, Match[]>();
    for (const m of matches) {
      const k = m.c.f[m.row][1];
      by.set(k, [...(by.get(k) ?? []), m]);
    }
    return [...by.entries()]
      .sort((a, b) => FINDING_ORDER.indexOf(a[0]) - FINDING_ORDER.indexOf(b[0]))
      .map(([key, ms]) => ({ key, label: FINDING_LABEL[key] ?? key, matches: ms }));
  }
  return matches.length ? [{ key: 'all', label: 'Decisions', matches }] : [];
}
