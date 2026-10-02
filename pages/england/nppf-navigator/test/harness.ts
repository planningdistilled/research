// Minimal test harness (no Node type dependencies): register with t(), run by build/test.mjs.
type Fn = () => void;
export const tests: { name: string; fn: Fn }[] = [];
export const t = (name: string, fn: Fn) => tests.push({ name, fn });

export function eq<T>(actual: T, expected: T, msg = '') {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a !== e) throw new Error(`${msg}\n  expected ${e}\n  actual   ${a}`);
}
export function ok(cond: unknown, msg = 'assertion failed') {
  if (!cond) throw new Error(msg);
}
