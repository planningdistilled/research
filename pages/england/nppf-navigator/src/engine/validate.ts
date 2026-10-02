import type { Graph, Pred, Scalar } from './types';

/** Structural checks on the graph. Returns a list of problems (empty when valid). */
export function validate(g: Graph): string[] {
  const errs: string[] = [];
  const ids = new Set<string>();
  const sections = new Set(g.sections.map((s) => s.id));
  // fact -> allowed values (undefined = free-form, e.g. number)
  const facts = new Map<string, Set<Scalar> | undefined>();

  for (const n of g.nodes) {
    if (ids.has(n.id)) errs.push(`duplicate node id ${n.id}`);
    ids.add(n.id);
    if (!sections.has(n.section)) errs.push(`${n.id}: unknown section ${n.section}`);
    const values =
      n.input.type === 'single' || n.input.type === 'multi' ? new Set(n.input.options.map((o) => o.value)) : n.input.type === 'ack' ? new Set<Scalar>([true]) : undefined;
    const prev = facts.get(n.fact);
    if (prev && values) values.forEach((v) => prev.add(v));
    else facts.set(n.fact, values);
  }
  for (const d of g.derived) {
    const prev = facts.get(d.fact);
    if (typeof d.value === 'object') facts.set(d.fact, undefined);
    else if (!facts.has(d.fact)) facts.set(d.fact, new Set([d.value]));
    else prev?.add(d.value);
  }

  const checkQuote = (where: string, q: string) => {
    if (!g.quotes[q]) errs.push(`${where}: unknown quote ${q}`);
  };
  const checkValue = (where: string, fact: string, v: Scalar): void => {
    if (!facts.has(fact)) {
      errs.push(`${where}: unknown fact ${fact}`);
      return;
    }
    const allowed = facts.get(fact);
    if (allowed && !allowed.has(v)) errs.push(`${where}: ${fact} never takes value ${JSON.stringify(v)}`);
  };
  const walk = (where: string, p: Pred): void => {
    if (p === true) return;
    if ('eq' in p) return void checkValue(where, p.eq[0], p.eq[1]);
    if ('ne' in p) return void checkValue(where, p.ne[0], p.ne[1]);
    if ('in' in p) return p.in[1].forEach((v) => checkValue(where, p.in[0], v));
    if ('has' in p) return void checkValue(where, p.has[0], p.has[1]);
    if ('gte' in p) return void (facts.has(p.gte[0]) || errs.push(`${where}: unknown fact ${p.gte[0]}`));
    if ('lt' in p) return void (facts.has(p.lt[0]) || errs.push(`${where}: unknown fact ${p.lt[0]}`));
    if ('answered' in p) return void (facts.has(p.answered) || errs.push(`${where}: unknown fact ${p.answered}`));
    if ('hasFinding' in p) return;
    if ('not' in p) return walk(where, p.not);
    if ('all' in p) return p.all.forEach((x) => walk(where, x));
    if ('any' in p) return p.any.forEach((x) => walk(where, x));
  };

  for (const n of g.nodes) {
    if (n.kind === 'judgement') {
      if (!n.method) errs.push(`${n.id}: judgement node has no method`);
      else {
        const opts = n.input.type === 'single' || n.input.type === 'multi' ? new Set(n.input.options.map((o) => o.value)) : new Set<Scalar>();
        if (!n.method.steps.length) errs.push(`${n.id}: method has no steps`);
        for (const pt of n.method.pointers) if (!opts.has(pt.option)) errs.push(`${n.id}: method pointer for unknown option ${JSON.stringify(pt.option)}`);
        if (!n.method.pointers.length) errs.push(`${n.id}: method has no pointers`);
      }
    } else if (n.method) errs.push(`${n.id}: method on a ${n.kind} node`);
    n.quotes?.forEach((q) => checkQuote(n.id, q));
    if (n.suggest && !facts.has(n.suggest.fact)) errs.push(`${n.id}: suggest references unknown fact ${n.suggest.fact}`);
    n.notices?.forEach((no, i) => no.when && walk(`${n.id}.notices[${i}]`, no.when));
    if (n.when) walk(`${n.id}.when`, n.when);
    if (n.input.type === 'single' || n.input.type === 'multi') {
      for (const o of n.input.options) {
        if (o.when) walk(`${n.id}.option(${o.value})`, o.when);
        o.effects?.forEach((f) => f.quotes?.forEach((q) => checkQuote(`${n.id}.option(${o.value})`, q)));
      }
    }
    n.effects?.forEach((e, i) => {
      if (e.when) walk(`${n.id}.effects[${i}]`, e.when);
      e.finding.quotes?.forEach((q) => checkQuote(`${n.id}.effects[${i}]`, q));
    });
  }
  g.derived.forEach((d) => walk(`derived ${d.fact}`, d.when));
  for (const o of g.outcomes) {
    walk(`outcome ${o.id}`, o.when);
    o.quotes.forEach((q) => checkQuote(`outcome ${o.id}`, q));
  }
  return errs;
}
