// The location-factors register (data/decisions/analysis/location-factors), loaded and tallied once for the
// sustainable location pages. Every figure those pages give about factors in decisions comes from here.
// `tools/location_factors.py` checks the register against the decision texts; this module checks its shape.
import fs from 'node:fs';
import path from 'node:path';
import { DECISIONS } from '../../../../paths.mjs';
import { caseById } from '../../../_shared/policy-weight.mjs';

const DIR = path.join(DECISIONS, 'analysis', 'location-factors');
const tsv = (file) => {
  const [head, ...lines] = fs.readFileSync(path.join(DIR, file), 'utf8').split(/\r?\n/).filter((l) => l.trim());
  const cols = head.split('\t');
  return lines.map((l, i) => {
    const f = l.split('\t');
    if (f.length !== cols.length) throw new Error(`${file} row ${i + 2}: ${f.length} fields, expected ${cols.length}`);
    return Object.fromEntries(cols.map((c, j) => [c, f[j]]));
  });
};

const codeRows = tsv('codes.tsv');
/** [{ code: 'A', label }] in page order. */
export const CLASSES = codeRows.filter((r) => r.code.length === 1);
/** [{ code: 'A1', label, cls: 'A' }] in page order. */
export const FACTORS = codeRows.filter((r) => r.code.length > 1).map((r) => ({ code: r.code, label: r.label, cls: r.code[0] }));
const known = new Set(FACTORS.map((f) => f.code));

const TOKEN = /^([A-K]\d{1,2})([+=-])$/;
const parse = (cell, id) => cell.split(',').filter(Boolean).map((t) => {
  const m = t.match(TOKEN);
  if (!m || !known.has(m[1])) throw new Error(`register: ${id}: bad factor "${t}"`);
  return [m[1], m[2]];
});
/** Every screened decision: { id, engaged, finding, f: Map(code -> sign), dec: Set(code), other, note, c: case }. */
export const ROWS = tsv('register.tsv').map((r) => {
  const c = caseById.get(r.case_id);
  if (!c) throw new Error(`register: ${r.case_id} is not in the decisions index`);
  if (!['Y', 'B', 'N'].includes(r.engaged)) throw new Error(`register: ${r.case_id}: engaged "${r.engaged}"`);
  const f = new Map(parse(r.factors, r.case_id));
  const dec = new Set(parse(r.decisive, r.case_id).map(([code]) => code));
  for (const code of dec) if (!f.has(code)) throw new Error(`register: ${r.case_id}: decisive ${code} is not among its factors`);
  return { id: r.case_id, engaged: r.engaged, finding: r.finding, f, dec, other: r.other, note: r.note, c };
});
/** Decisions where the location was assessed with at least one stated factor: the base for every count. */
export const ASSESSED = ROWS.filter((r) => r.engaged === 'Y').sort((a, b) => a.c.decision_date.localeCompare(b.c.decision_date) || a.id.localeCompare(b.id));
export const BARE = ROWS.filter((r) => r.engaged === 'B');
export const NOT_ENGAGED = ROWS.filter((r) => r.engaged === 'N');

const tally = (has, signs, decisive) => {
  const rows = ASSESSED.filter(has);
  const s = { '+': 0, '-': 0, '=': 0 };
  for (const r of ASSESSED) for (const sign of signs(r)) s[sign]++;
  const by = (finding) => rows.filter((r) => r.finding === finding).length;
  return { rows, n: rows.length, plus: s['+'], minus: s['-'], aside: s['='], findings: s['+'] + s['-'] + s['='],
    decisive: ASSESSED.filter(decisive), pass: by('pass'), fail: by('fail'), mixed: by('mixed') };
};
/** code -> { rows, n, plus, minus, aside, findings, decisive: [rows], pass, fail, mixed } for a factor ('A1') or a class ('A'). */
export const stat = (code) => (code.length === 1
  ? tally((r) => [...r.f.keys()].some((k) => k[0] === code), (r) => [...r.f].filter(([k]) => k[0] === code).map(([, s]) => s), (r) => [...r.dec].some((k) => k[0] === code))
  : tally((r) => r.f.has(code), (r) => (r.f.has(code) ? [r.f.get(code)] : []), (r) => r.dec.has(code)));

const count = (rows, fn) => rows.filter(fn).length;
export const TOTALS = {
  screened: ROWS.length, assessed: ASSESSED.length, bare: BARE.length, notEngaged: NOT_ENGAGED.length,
  pass: count(ASSESSED, (r) => r.finding === 'pass'), fail: count(ASSESSED, (r) => r.finding === 'fail'),
  mixed: count(ASSESSED, (r) => r.finding === 'mixed'), unclear: count(ASSESSED, (r) => r.finding === 'unclear'),
  findings: ASSESSED.reduce((n, r) => n + r.f.size, 0),
  plus: ASSESSED.reduce((n, r) => n + count([...r.f.values()], (s) => s === '+'), 0),
  minus: ASSESSED.reduce((n, r) => n + count([...r.f.values()], (s) => s === '-'), 0),
  aside: ASSESSED.reduce((n, r) => n + count([...r.f.values()], (s) => s === '='), 0),
  unclassified: ASSESSED.reduce((n, r) => n + r.other.split(';').filter((o) => o.trim()).length, 0),
  appeals: count(ASSESSED, (r) => ['inspector', 'secretary-of-state'].includes(r.c.decision_maker)),
  council: count(ASSESSED, (r) => r.c.decision_maker.startsWith('lpa-')),
  fw2026: count(ASSESSED, (r) => r.c.nppf_applied === '2026-08'),
  fw2024: count(ASSESSED, (r) => /^2024-12/.test(r.c.nppf_applied)),
  first: ASSESSED[0].c.decision_date, last: ASSESSED[ASSESSED.length - 1].c.decision_date,
};
if (TOTALS.pass + TOTALS.fail + TOTALS.mixed + TOTALS.unclear !== TOTALS.assessed) throw new Error('register: a Y row has no finding');
if (TOTALS.appeals + TOTALS.council !== TOTALS.assessed) throw new Error('register: a decision-maker is neither an appeal nor a council');

/** Stops the build when a sentence on a page no longer matches the register: revise the wording, don't silence the check. */
export function holds(condition, sentence) {
  if (!condition) throw new Error(`the register no longer supports: "${sentence}"`);
}
export const FACTORS_PAGE = '/research/england/sustainable-location/factors/';
