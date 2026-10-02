import type { Facts, Finding, Pred, Scalar } from './types';

// An empty multi-select ("none of these") is a valid answer.
function isAnswered(v: unknown): boolean {
  return v !== undefined && v !== null;
}

/** Policy code match: a finding on "GB7(1)(g)(iii)" matches a query for "GB7(1)(g)" or "GB7". */
export function codeMatches(code: string, query: string): boolean {
  return code === query || code.startsWith(query + '(') || code.startsWith(query + ':');
}

export function test(p: Pred, facts: Facts, findings: Finding[] = []): boolean {
  if (p === true) return true;
  if ('eq' in p) return facts[p.eq[0]] === p.eq[1];
  if ('ne' in p) return facts[p.ne[0]] !== p.ne[1];
  if ('in' in p) return p.in[1].includes(facts[p.in[0]] as Scalar);
  if ('has' in p) {
    const v = facts[p.has[0]];
    return Array.isArray(v) && v.includes(p.has[1]);
  }
  if ('gte' in p) return typeof facts[p.gte[0]] === 'number' && (facts[p.gte[0]] as number) >= p.gte[1];
  if ('lt' in p) return typeof facts[p.lt[0]] === 'number' && (facts[p.lt[0]] as number) < p.lt[1];
  if ('answered' in p) return isAnswered(facts[p.answered]);
  if ('hasFinding' in p) {
    const q = p.hasFinding;
    return findings.some((f) => (!q.kind || f.kind === q.kind) && (!q.policy || codeMatches(f.policy, q.policy)));
  }
  if ('not' in p) return !test(p.not, facts, findings);
  if ('all' in p) return p.all.every((x) => test(x, facts, findings));
  if ('any' in p) return p.any.some((x) => test(x, facts, findings));
  throw new Error('unknown predicate ' + JSON.stringify(p));
}

/** Plain-words rendering, for "why is this question shown". */
export function describe(p: Pred, label: (fact: string, value?: Scalar) => string): string {
  if (p === true) return 'always';
  if ('eq' in p) return label(p.eq[0], p.eq[1]);
  if ('ne' in p) return `not ${label(p.ne[0], p.ne[1])}`;
  if ('in' in p) return p.in[1].map((v) => label(p.in[0], v)).join(' or ');
  if ('has' in p) return label(p.has[0], p.has[1]);
  if ('gte' in p) return `${label(p.gte[0])} ≥ ${p.gte[1]}`;
  if ('lt' in p) return `${label(p.lt[0])} < ${p.lt[1]}`;
  if ('answered' in p) return `${label(p.answered)} answered`;
  if ('hasFinding' in p) return `a ${p.hasFinding.kind ?? ''} finding${p.hasFinding.policy ? ' under ' + p.hasFinding.policy : ''}`;
  if ('not' in p) return `not (${describe(p.not, label)})`;
  // Wrap compound children so nesting reads unambiguously, e.g. "A, and (B; or C)".
  const sub = (x: Pred) => {
    const d = describe(x, label);
    const compound = x !== true && ('all' in x || 'any' in x || ('in' in x && x.in[1].length > 1));
    return compound ? `(${d})` : d;
  };
  if ('all' in p) return p.all.map(sub).join(', and ');
  if ('any' in p) return p.any.map(sub).join('; or ');
  return '';
}
