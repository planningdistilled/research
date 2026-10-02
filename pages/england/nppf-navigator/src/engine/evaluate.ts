import { test } from './predicate';
import type { Answers, Evaluation, Facts, Finding, Graph, GraphNode, PathStep, Value } from './types';

function derive(g: Graph, facts: Facts, findings: Finding[]): Facts {
  const out: Facts = {};
  for (const r of g.derived) {
    if (r.fact in out) continue; // first matching rule wins
    const view = { ...facts, ...out };
    if (test(r.when, view, findings)) {
      out[r.fact] = typeof r.value === 'object' ? (view[r.value.from] ?? null) : r.value;
    }
  }
  return out;
}

function optionFindings(node: GraphNode, answer: Value): Finding[] {
  if (node.input.type !== 'single' && node.input.type !== 'multi') return [];
  const chosen = Array.isArray(answer) ? answer : [answer];
  return node.input.options.filter((o) => chosen.includes(o.value as never)).flatMap((o) => o.effects ?? []);
}

/**
 * Walk the ordered node list. A node is on the path when its guard holds given the facts established by the
 * answered nodes before it. The walk stops at the first on-path node without an answer. Answers belonging to
 * nodes that are now off-path are ignored (and reported as stale), so changing an earlier answer re-routes cleanly.
 */
export function evaluate(g: Graph, answers: Answers): Evaluation {
  const facts: Facts = {};
  const findings: Finding[] = [];
  const path: PathStep[] = [];
  const onPath = new Set<string>();
  let next: GraphNode | null = null;

  for (const node of g.nodes) {
    const view = { ...facts, ...derive(g, facts, findings) };
    if (node.when && !test(node.when, view, findings)) continue;
    let answer = answers[node.fact];
    // Auto-resolve a single-choice question when only one option is currently available: there is no real choice
    // to make, so skip the screen and take that option. Judgements are always left to the user.
    let auto = false;
    if ((answer === undefined || answer === null) && node.kind === 'question' && node.input.type === 'single') {
      const available = node.input.options.filter((o) => !o.when || test(o.when, view, findings));
      if (available.length === 1) {
        answer = available[0].value;
        auto = true;
      }
    }
    if (answer === undefined || answer === null) {
      next = node;
      break;
    }
    facts[node.fact] = answer;
    onPath.add(node.fact);
    if (node.notes) onPath.add(node.notes.fact); // a free-text note belongs to this on-path node, not stale
    const found: Finding[] = [...optionFindings(node, answer)];
    const after = { ...facts, ...derive(g, facts, findings) };
    for (const e of node.effects ?? []) {
      if (!e.when || test(e.when, after, [...findings, ...found])) found.push(e.finding);
    }
    findings.push(...found);
    path.push({ node, answer, findings: found, ...(auto ? { auto: true } : {}) });
  }

  const all = { ...facts, ...derive(g, facts, findings) };
  const outcome = next ? null : (g.outcomes.find((o) => test(o.when, all, findings)) ?? null);
  const stale = Object.keys(answers).filter((k) => !onPath.has(k) && answers[k] !== undefined);
  return { facts: all, path, next, findings, outcome, stale };
}

/** Remove answers for nodes that are off-path, e.g. before export. */
export function prune(g: Graph, answers: Answers): Answers {
  const ev = evaluate(g, answers);
  const keep = new Set(ev.path.map((s) => s.node.fact));
  return Object.fromEntries(Object.entries(answers).filter(([k]) => keep.has(k)));
}
