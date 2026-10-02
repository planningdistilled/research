import { h, clear } from './h';
import { casesPanel } from './views/cases';
import { routeMap } from './views/routemap';
import * as store from './state';
import { loadAll, type Manifest } from '../data/shards';
import type { CaseIdx } from '../data/match';
import { evaluate } from '../engine/evaluate';
import { describe, test as testPred } from '../engine/predicate';
import type { Answers, Evaluation, Finding, Graph, GraphNode, Scalar, Value, Weight } from '../engine/types';

interface UI {
  manifest: Manifest;
  graph: Graph;
  index: CaseIdx[];
  answers: Answers;
  editing: string | null; // node id being changed
  focus: number | null; // outcome reason index shown in the side panel
  panel: 'none' | 'about' | 'io' | 'map';
  earlier: Answers | null; // answers saved against an earlier graph version
  renaming: string | null; // id of the saved set being renamed
}

const root = document.getElementById('app')!;
let ui: UI;

const KIND: Record<GraphNode['kind'], string> = { question: 'Question', judgement: 'Planning judgement', info: 'Framework note' };
const WEIGHT_ORDER: Weight[] = ['substantial', 'considerable', 'significant', 'moderate', 'limited', 'very-limited'];
const VERDICT: Record<string, string> = { refuse: 'Refuse', approve: 'Approve', balanced: 'Finely balanced' };

// ---------- helpers

function labelFn(g: Graph) {
  const titles = new Map<string, { title: string; values: Map<Scalar, string> }>();
  for (const n of g.nodes) {
    const values = new Map<Scalar, string>('options' in n.input ? n.input.options.map((o) => [o.value, o.label] as [Scalar, string]) : []);
    const prev = titles.get(n.fact);
    if (prev) values.forEach((v, k) => prev.values.set(k, v));
    else titles.set(n.fact, { title: n.title, values });
  }
  const derived: Record<string, string> = { major: 'major development', unmetNeed: 'unmet need', outside: 'outside a settlement', designated: 'a designated heritage asset', route: 'the route' };
  return (fact: string, value?: Scalar) => {
    const t = titles.get(fact);
    if (!t) return value === true ? derived[fact] ?? fact : `${derived[fact] ?? fact} is ${value}`;
    return value === undefined ? t.title : `${t.title}: ${t.values.get(value) ?? value}`;
  };
}

function quoteBlock(g: Graph, id: string) {
  const q = g.quotes[id];
  if (!q) return null;
  return h('blockquote', { class: 'fw' }, h('div', { class: 'fw-head' }, h('span', { class: 'code' }, q.code), q.title), h('p', null, q.text.replace(/ ¦ /g, ' ')));
}

function answerText(n: GraphNode, v: Value | undefined): string {
  if (v === undefined || v === null) return '';
  const inp = n.input;
  if (inp.type === 'ack') return 'Noted';
  if (inp.type === 'number') return inp.skip && v === inp.skip.value ? inp.skip.label : `${v} ${inp.unit ?? ''}`.trim();
  const vals = Array.isArray(v) ? v : [v];
  if (!vals.length) return 'None';
  return vals.map((x) => inp.options.find((o) => o.value === x)?.label ?? String(x)).join('; ');
}

function persist() {
  store.save(ui.manifest.graph.hash, ui.answers);
}

function setAnswer(fact: string, value: Value) {
  ui.answers = { ...ui.answers, [fact]: value };
  ui.focus = null;
  if (ui.editing) {
    // Reviewing: move on to the next answered step, so earlier changes can be checked one by one.
    const path = evaluate(ui.graph, ui.answers).path;
    const at = path.findIndex((s) => s.node.id === ui.editing);
    ui.editing = at >= 0 ? path[at + 1]?.node.id ?? null : null;
  }
  persist();
  render(true);
}

/** Open an earlier step for review. */
function goTo(nodeId: string | null) {
  ui.editing = nodeId;
  ui.focus = null;
  ui.panel = 'none';
  render(true);
}

function navBar(ev: Evaluation, current: GraphNode | null): HTMLElement {
  const path = ev.path;
  const at = current && ui.editing ? path.findIndex((s) => s.node.id === current.id) : path.length;
  const prev = at > 0 ? path[at - 1] : null;
  const next = ui.editing && at >= 0 && at < path.length ? path[at + 1] ?? null : null;
  return h(
    'div',
    { class: 'nav' },
    prev ? h('button', { type: 'button', class: 'secondary', onclick: () => goTo(prev.node.id) }, '← Back') : h('span'),
    ui.editing
      ? h(
          'span',
          { class: 'nav-right' },
          next ? h('button', { type: 'button', class: 'secondary', onclick: () => goTo(next.node.id) }, 'Keep answer, next →') : null,
          h('button', { type: 'button', class: 'link', onclick: () => goTo(null) }, ev.next ? 'Back to the current question' : 'Back to the result'),
        )
      : null,
  );
}

// ---------- inputs

function inputFor(n: GraphNode, ev: Evaluation): HTMLElement {
  const current = ui.answers[n.fact];
  const inp = n.input;
  if (inp.type === 'single') {
    const opts = inp.options.filter((o) => !o.when || evaluateOption(o.when, ev));
    return h(
      'div',
      { class: 'choices', role: 'group', 'aria-label': n.title },
      opts.map((o) =>
        h(
          'button',
          { type: 'button', class: `choice${current === o.value ? ' chosen' : ''}`, 'aria-pressed': String(current === o.value), onclick: () => setAnswer(n.fact, o.value) },
          h('span', { class: 'choice-label' }, o.label),
          o.help ? h('span', { class: 'choice-help' }, o.help) : null,
        ),
      ),
    );
  }
  if (inp.type === 'multi') {
    const chosen = new Set(Array.isArray(current) ? current : []);
    const opts = inp.options.filter((o) => !o.when || evaluateOption(o.when, ev));
    const form = h('form', { class: 'multi' });
    opts.forEach((o, i) => {
      const id = `${n.id}-${i}`;
      form.append(
        h('label', { class: 'check', for: id }, h('input', { type: 'checkbox', id, value: String(o.value), checked: chosen.has(o.value as string) }), h('span', null, o.label)),
      );
    });
    form.append(h('div', { class: 'actions' }, h('button', { type: 'submit', class: 'primary' }, 'Continue')));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const vals = [...form.querySelectorAll<HTMLInputElement>('input:checked')].map((x) => x.value);
      setAnswer(n.fact, vals);
    });
    return form;
  }
  if (inp.type === 'number') {
    const id = `${n.id}-num`;
    const field = h('input', { type: 'number', id, min: inp.min, max: inp.max, step: inp.step ?? 1, value: typeof current === 'number' ? current : '', inputmode: 'numeric', required: true });
    const form = h(
      'form',
      { class: 'number' },
      h('label', { for: id, class: 'sr' }, n.title),
      field,
      inp.unit ? h('span', { class: 'unit' }, inp.unit) : null,
      h('button', { type: 'submit', class: 'primary' }, 'Continue'),
      inp.skip ? h('button', { type: 'button', class: `secondary${current === inp.skip.value ? ' chosen' : ''}`, onclick: () => setAnswer(n.fact, inp.skip!.value) }, inp.skip.label) : null,
    );
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = Number(field.value);
      if (Number.isFinite(v)) setAnswer(n.fact, v);
    });
    return form;
  }
  return h('div', { class: 'actions' }, h('button', { type: 'button', class: 'primary', onclick: () => setAnswer(n.fact, true) }, 'Continue'));
}

// Option guards are evaluated against the facts established so far.
function evaluateOption(p: NonNullable<GraphNode['when']>, ev: Evaluation) {
  return testPred(p, ev.facts, ev.findings);
}

// ---------- views

const KIND_NOTE: Partial<Record<GraphNode['kind'], string>> = {
  question: 'A fact: look it up or measure it.',
  judgement: 'A planning judgement: the Framework leaves this to the decision-maker. Work through "How to decide", then choose.',
};

function methodBlock(n: GraphNode): HTMLElement {
  const m = n.method!;
  const label = (v: unknown) => ('options' in n.input ? n.input.options.find((o) => o.value === v)?.label : undefined) ?? String(v);
  return h(
    'details',
    { class: 'method', open: true },
    h('summary', null, 'How to decide'),
    h('p', { class: 'method-q' }, m.question),
    h('ol', { class: 'method-steps' }, m.steps.map((x) => h('li', null, x))),
    h(
      'div',
      { class: 'method-pointers' },
      m.pointers.map((pt) => h('div', { class: 'pointer' }, h('h4', null, 'Points towards: ', h('span', null, label(pt.option))), h('ul', null, pt.factors.map((f) => h('li', null, f))))),
    ),
    m.evidence?.length ? h('div', { class: 'method-evidence' }, h('h4', null, 'Evidence to have in front of you'), h('ul', null, m.evidence.map((x) => h('li', null, x)))) : null,
    m.closeCall ? h('p', { class: 'method-close' }, h('strong', null, 'If it is close: '), m.closeCall) : null,
  );
}

// A provisional reading derived from earlier answers, shown for the user to confirm or override.
function provisionalPanel(n: GraphNode, ev: Evaluation): HTMLElement | null {
  if (!n.suggest) return null;
  const val = ev.facts[n.suggest.fact];
  if (val === undefined || val === null) return null;
  const optLabel = 'options' in n.input ? n.input.options.find((o) => o.value === val)?.label : undefined;
  const label = optLabel ?? n.suggest.extra?.[String(val)] ?? String(val);
  const basis = ev.path.filter((s) => s.node.section === n.section && s.node.id !== n.id && s.node.input.type !== 'ack');
  return h(
    'section',
    { class: 'provisional' },
    h('h3', null, 'Provisional reading, from your answers'),
    h('p', { class: 'provisional-verdict' }, label),
    basis.length ? h('dl', { class: 'provisional-basis' }, basis.flatMap((s) => [h('dt', null, s.node.title), h('dd', null, answerText(s.node, s.answer))])) : null,
    h('p', { class: 'fine' }, 'This is your judgement, not the tool’s. Agree by choosing that answer below, or disagree and choose the other.'),
  );
}

// A free-text box for other material considerations, stored under n.notes.fact; never affects routing.
function notesBox(n: GraphNode): HTMLElement | null {
  if (!n.notes) return null;
  const id = `${n.id}-notes`;
  const cur = typeof ui.answers[n.notes.fact] === 'string' ? (ui.answers[n.notes.fact] as string) : '';
  const ta = h('textarea', { id, rows: '3', placeholder: n.notes.placeholder ?? '' }) as HTMLTextAreaElement;
  ta.value = cur;
  ta.addEventListener('change', () => setAnswer(n.notes!.fact, ta.value));
  return h('div', { class: 'notes-box' }, h('label', { for: id }, n.notes.label), ta);
}

function nodeCard(n: GraphNode, ev: Evaluation, changing: boolean): HTMLElement {
  const g = ui.graph;
  const section = g.sections.find((s) => s.id === n.section)?.title ?? '';
  const why = n.whyShown ?? (n.when ? `Shown because ${describe(n.when, labelFn(g))}.` : null);
  const card = h(
    'article',
    { class: `card node k-${n.kind}`, 'aria-live': 'polite' },
    h('div', { class: 'eyebrow' }, section, h('span', { class: 'sep' }, '·'), KIND[n.kind], changing ? h('span', { class: 'tag' }, 'Reviewing your answers') : null),
    h('h2', { tabindex: '-1', id: 'current' }, n.title),
    h('p', { class: 'prompt' }, n.prompt),
    KIND_NOTE[n.kind] ? h('p', { class: `kind-note kn-${n.kind}` }, KIND_NOTE[n.kind]) : null,
    (n.notices ?? []).filter((no) => !no.when || testPred(no.when, ev.facts, ev.findings)).map((no) => h('p', { class: 'notice' }, no.text)),
    n.method ? methodBlock(n) : null,
    provisionalPanel(n, ev),
    inputFor(n, ev),
    notesBox(n),
    n.help?.length ? h('details', { class: 'help', open: n.kind !== 'judgement' }, h('summary', null, n.kind === 'judgement' ? 'How decision-makers have approached this' : 'Guidance'), h('ul', null, n.help.map((x) => h('li', null, x)))) : null,
    why ? h('p', { class: 'why' }, why) : null,
    navBar(ev, n),
  );
  return card;
}

function nodeContext(n: GraphNode, ev: Evaluation): HTMLElement {
  const g = ui.graph;
  const col = h('div', { class: 'context' });
  if (n.quotes?.length) col.append(h('section', { class: 'quotes', 'aria-label': 'Framework text' }, h('h3', null, 'The Framework'), n.quotes.map((q) => quoteBlock(g, q))));
  if (n.contested) {
    col.append(
      h(
        'section',
        { class: 'contested' },
        h('h3', null, 'Contested in practice'),
        h('p', null, n.contested.summary),
        n.contested.readings.map((r) =>
          h('div', { class: 'reading' }, h('h4', null, r.label), h('p', null, r.summary), r.cases ? casesPanel(ui.manifest, ui.index, r.cases, ev.facts, 'Decisions taking this reading') : null),
        ),
      ),
    );
  }
  if (n.cases) col.append(casesPanel(ui.manifest, ui.index, n.cases, ev.facts));
  if (!col.childNodes.length) col.append(h('p', { class: 'muted' }, 'This question records a fact. The policy text and decisions appear with the questions that apply them.'));
  return col;
}

function reasonGroups(ev: Evaluation) {
  const f = ev.findings.map((x, i) => ({ x, i }));
  const byWeight = (a: { x: Finding }, b: { x: Finding }) => WEIGHT_ORDER.indexOf(a.x.weight ?? ('very-limited' as Weight)) - WEIGHT_ORDER.indexOf(b.x.weight ?? ('very-limited' as Weight));
  return [
    { title: 'Route', items: f.filter((r) => r.x.kind === 'route') },
    { title: 'Decisive against', items: f.filter((r) => r.x.kind === 'trigger' || r.x.kind === 'fail') },
    { title: 'Harms weighed', items: f.filter((r) => r.x.kind === 'harm').sort(byWeight) },
    { title: 'Benefits weighed', items: f.filter((r) => r.x.kind === 'benefit').sort(byWeight) },
    { title: 'Tests met', items: f.filter((r) => r.x.kind === 'pass') },
    { title: 'Notes and evidence gaps', items: f.filter((r) => r.x.kind === 'note') },
  ].filter((grp) => grp.items.length);
}

function outcomeCard(ev: Evaluation): HTMLElement {
  const o = ev.outcome!;
  const g = ui.graph;
  const copy = h('button', { type: 'button', class: 'secondary' }, 'Copy as text');
  copy.addEventListener('click', () => copyText(summaryText(ev), copy));
  return h(
    'article',
    { class: `card outcome v-${o.verdict}` },
    h('div', { class: 'eyebrow' }, 'Indicative determination'),
    h('div', { class: 'verdict' }, h('span', { class: 'verdict-word' }, VERDICT[o.verdict]), h('h2', { tabindex: '-1', id: 'current' }, o.title.replace(/^(Refuse|Approve|Finely balanced):\s*/, ''))),
    h('p', { class: 'test' }, o.test),
    h('details', { class: 'help' }, h('summary', null, 'The test in the Framework'), o.quotes.map((q) => quoteBlock(g, q))),
    h(
      'div',
      { class: 'reasons' },
      reasonGroups(ev).map((grp) =>
        h(
          'section',
          null,
          h('h3', null, grp.title),
          h(
            'ol',
            { class: 'reason-list' },
            grp.items.map(({ x, i }) =>
              h(
                'li',
                { class: `reason r-${x.kind}${ui.focus === i ? ' focused' : ''}` },
                h('span', { class: 'code' }, x.policy),
                h('span', { class: 'reason-text' }, x.text),
                x.weight ? h('span', { class: 'weight' }, `${x.weight} weight`) : null,
                x.kind !== 'route' ? h('button', { type: 'button', class: 'link', onclick: () => ((ui.focus = i), render()) }, 'Decisions') : null,
              ),
            ),
          ),
        ),
      ),
    ),
    h('p', { class: 'disclaimer-inline' }, 'This is the result of the judgements you entered, run through the Framework\'s structure. It is not a prediction and not legal advice. Change any answer below to see how the route and result move.'),
    h('div', { class: 'actions' }, copy),
    navBar(ev, null),
  );
}

function outcomeContext(ev: Evaluation): HTMLElement {
  const col = h('div', { class: 'context' });
  const f = ui.focus !== null ? ev.findings[ui.focus] : null;
  if (!f) {
    col.append(h('section', { class: 'quotes' }, h('h3', null, 'Reasons and decisions'), h('p', null, 'Choose "Decisions" beside any reason to see decisions that made the same finding.')));
    const decisive = ev.findings.find((x) => x.kind === 'trigger' || x.kind === 'fail');
    const q = decisive ? decisive.cases ?? { policies: [decisive.policy], groupBy: 'finding' as const } : ev.outcome ? { policies: ev.outcome.quotes.map((id) => ui.graph.quotes[id]?.code).filter(Boolean) as string[], groupBy: 'outcome' as const } : null;
    if (q) col.append(casesPanel(ui.manifest, ui.index, q, ev.facts, decisive ? `Decisions on ${decisive.policy}` : 'Decisions on the deciding test'));
    return col;
  }
  if (f.quotes?.length) col.append(h('section', { class: 'quotes' }, h('h3', null, 'The Framework'), f.quotes.map((q) => quoteBlock(ui.graph, q))));
  else if (ui.graph.quotes[f.policy]) col.append(h('section', { class: 'quotes' }, h('h3', null, 'The Framework'), quoteBlock(ui.graph, f.policy)));
  col.append(casesPanel(ui.manifest, ui.index, f.cases ?? { policies: [f.policy], groupBy: 'finding' }, ev.facts, `Decisions on ${f.policy}`));
  return col;
}

function summaryText(ev: Evaluation): string {
  const o = ev.outcome!;
  const lines = [`${ui.graph.meta.title}: indicative determination`, `${o.title}`, o.test, ''];
  for (const grp of reasonGroups(ev)) {
    lines.push(grp.title.toUpperCase());
    for (const { x } of grp.items) lines.push(`- ${x.policy}: ${x.text}${x.weight ? ` (${x.weight} weight)` : ''}`);
    lines.push('');
  }
  lines.push('Answers given:');
  for (const s of ev.path) {
    if (s.node.input.type === 'ack') continue;
    lines.push(`- ${s.node.title}: ${answerText(s.node, s.answer)}`);
    const note = s.node.notes && typeof ui.answers[s.node.notes.fact] === 'string' ? (ui.answers[s.node.notes.fact] as string).trim() : '';
    if (note) lines.push(`  Note: ${note}`);
  }
  lines.push('', `Framework: ${ui.graph.meta.framework}. Dataset: ${ui.manifest.dataset.cases} decisions to ${ui.manifest.dataset.newestDecisionDate}. Not legal advice.`);
  return lines.join('\n');
}

function copyText(text: string, btn: HTMLButtonElement, fallback?: HTMLTextAreaElement) {
  const done = (msg: string) => {
    const was = btn.textContent;
    btn.textContent = msg;
    setTimeout(() => (btn.textContent = was), 1600);
  };
  navigator.clipboard?.writeText(text).then(
    () => done('Copied'),
    () => {
      if (fallback) {
        fallback.focus();
        fallback.select();
        done('Select and copy');
      } else done('Copy blocked');
    },
  ) ?? done('Copy blocked');
}

function rail(ev: Evaluation): HTMLElement {
  const g = ui.graph;
  const onPath = new Set(ev.path.map((s) => s.node.section));
  const current = ev.next?.section ?? (ev.outcome ? 'balance' : null);
  const currentIdx = g.sections.findIndex((s) => s.id === current);
  return h(
    'nav',
    { class: 'rail', 'aria-label': 'Progress' },
    h(
      'ol',
      null,
      g.sections.map((s, i) => {
        const state = s.id === current && !ev.outcome ? 'current' : onPath.has(s.id) || (ev.outcome && s.id === 'balance') ? 'done' : i < currentIdx || ev.outcome ? 'skipped' : 'upcoming';
        const first = ev.path.find((p) => p.node.section === s.id);
        const label = first && state === 'done' ? h('button', { type: 'button', class: 'step-link', title: `Review ${s.title}`, onclick: () => goTo(first.node.id) }, s.title) : h('span', null, s.title);
        return h('li', { class: `step ${state}`, 'aria-current': state === 'current' ? 'step' : undefined }, h('span', { class: 'dot' }), label);
      }),
    ),
  );
}

function answersList(ev: Evaluation): HTMLElement | null {
  const steps = ev.path.filter((s) => s.node.input.type !== 'ack');
  if (!steps.length) return null;
  const g = ui.graph;
  const bySection = g.sections.map((sec) => ({ sec, steps: steps.filter((s) => s.node.section === sec.id) })).filter((x) => x.steps.length);
  return h(
    'section',
    { class: 'answers', 'aria-label': 'Your answers' },
    h('h3', null, 'Your answers'),
    bySection.map(({ sec, steps }) =>
      h(
        'div',
        { class: 'answer-group' },
        h('h4', null, sec.title),
        h(
          'dl',
          null,
          steps.map((s) =>
            h(
              'div',
              { class: `answer${ui.editing === s.node.id ? ' editing' : ''}` },
              h('dt', null, s.node.title, s.node.kind === 'judgement' ? h('span', { class: 'jtag', title: 'Planning judgement' }, 'judgement') : null),
              h(
                'dd',
                null,
                answerText(s.node, s.answer),
                s.auto
                  ? h('span', { class: 'fine', title: 'The only option available, so it was selected automatically' }, 'only option')
                  : h('button', { type: 'button', class: 'link', onclick: () => goTo(s.node.id) }, 'Change'),
              ),
              s.node.notes && typeof ui.answers[s.node.notes.fact] === 'string' && (ui.answers[s.node.notes.fact] as string).trim()
                ? h('dd', { class: 'fine' }, `Note: ${(ui.answers[s.node.notes.fact] as string).trim()}`)
                : null,
            ),
          ),
        ),
      ),
    ),
  );
}

function aboutPanel(): HTMLElement {
  const d = ui.manifest.dataset;
  const dm = d.byDecisionMaker ?? {};
  const fmt = (s: string | null) => (s ? new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'not recorded');
  return h(
    'section',
    { class: 'card about' },
    h('div', { class: 'panel-head' }, h('h2', null, 'About this tool'), h('button', { type: 'button', class: 'link', onclick: () => ((ui.panel = 'none'), render()) }, 'Close')),
    h('p', null, `The tool follows the decision structure of the ${ui.graph.meta.framework}: which presumption applies (S3 to S6), the Green Belt tests (GB6 to GB8), the location test (TR3), heritage (HE4 to HE7), and the national policies that say development "should be refused". Every quotation is checked against the published text when the tool is built.`),
    h('p', null, 'Planning judgements stay with you. Where the Framework leaves a question to the decision-maker, the tool asks it, shows the policy text, and shows how decision-makers have answered it. It records your answer and follows the route that answer leads to.'),
    h('h3', null, 'The decisions'),
    h(
      'ul',
      null,
      h('li', null, `${d.cases} decisions made on or after 17 August 2026: ${dm['inspector'] ?? 0} by inspectors, ${dm['secretary-of-state'] ?? 0} by the Secretary of State, ${(dm['lpa-committee'] ?? 0) + (dm['lpa-delegated'] ?? 0)} by councils. ${d.framework2026} of them apply the 2026 Framework; the rest are labelled.`),
      h('li', null, `Newest decision: ${fmt(d.newestDecisionDate)}. Last harvest of new appeal decisions: ${fmt(d.lastHarvest)}.`),
      h('li', null, 'Each decision was read and summarised by hand from the decision letter (or, for councils, the officer report or notice). The finding shown for each policy is that summary, with the letter\'s paragraph references; follow the link to read the letter itself.'),
      h('li', null, 'Selection bias: appeals are mostly against refusals, and the council decisions collected are mostly approvals. Counts show how a test has been applied, not the odds of any outcome.'),
    ),
    h('h3', null, 'Method & cross-references'),
    h(
      'p',
      null,
      'How the tool was built, the dataset counts, the external sources our notes have been checked against, and a summary of the inconsistencies the research has found: ',
      h(
        'a',
        { href: 'https://planningdistilled.org/research/england/nppf-navigator/method-and-cross-references/', target: '_blank', rel: 'noopener' },
        'Method & cross-references',
      ),
      '.',
    ),
    h('h3', null, 'Not legal advice'),
    h('p', null, 'This is a research aid. It does not replace the development plan, the full Framework, the decision letters or professional advice, and it does not predict any decision.'),
    h('p', { class: 'fine' }, `Graph version ${ui.graph.meta.version} (${ui.manifest.graph.hash}); built ${fmt(ui.manifest.builtAt)}.`),
  );
}

function ioPanel(): HTMLElement {
  const hash = ui.manifest.graph.hash;
  const fmtDate = (s: string) => {
    try {
      return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  // ---- Named saved sets ----
  const sets = store.listSets();
  const nameInput = h('input', { type: 'text', id: 'set-name', placeholder: 'Name this set, e.g. Land at Station Road' }) as HTMLInputElement;
  const saveBtn = h('button', { type: 'button', class: 'primary' }, 'Save current answers');
  const hasAnswers = Object.keys(ui.answers).length > 0;
  if (!hasAnswers) saveBtn.setAttribute('disabled', 'true');
  saveBtn.addEventListener('click', () => {
    if (!hasAnswers) return;
    store.saveSet(nameInput.value, ui.answers, hash);
    ui.renaming = null;
    render();
  });
  const setRow = (s: store.SavedSet) => {
    if (ui.renaming === s.id) {
      const ri = h('input', { type: 'text', value: s.name }) as HTMLInputElement;
      const rsave = h('button', { type: 'button', class: 'secondary' }, 'Save name');
      rsave.addEventListener('click', () => ((store.renameSet(s.id, ri.value), (ui.renaming = null)), render()));
      const rcancel = h('button', { type: 'button', class: 'link' }, 'Cancel');
      rcancel.addEventListener('click', () => ((ui.renaming = null), render()));
      return h('li', { class: 'set-row' }, ri, h('span', { class: 'set-actions' }, rsave, rcancel));
    }
    const loadBtn = h('button', { type: 'button', class: 'secondary' }, 'Load');
    loadBtn.addEventListener('click', () => ((ui.answers = store.sanitise(ui.graph, s.answers)), (ui.panel = 'none'), (ui.editing = null), persist(), render(true)));
    const renameBtn = h('button', { type: 'button', class: 'link' }, 'Rename');
    renameBtn.addEventListener('click', () => ((ui.renaming = s.id), render()));
    const delBtn = h('button', { type: 'button', class: 'link' }, 'Delete');
    delBtn.addEventListener('click', () => ((store.deleteSet(s.id)), render()));
    return h(
      'li',
      { class: 'set-row' },
      h('span', { class: 'set-name' }, h('strong', null, s.name), h('span', { class: 'fine' }, `${s.hash !== hash ? ' · older version' : ''} · ${fmtDate(s.savedAt)}`)),
      h('span', { class: 'set-actions' }, loadBtn, renameBtn, delBtn),
    );
  };

  // ---- Copy / paste JSON ----
  const out = h('textarea', { id: 'io-out', class: 'mono', rows: 6, readonly: true }, JSON.stringify(ui.answers, null, 1)) as HTMLTextAreaElement;
  const copy = h('button', { type: 'button', class: 'secondary' }, 'Copy answers');
  copy.addEventListener('click', () => copyText(out.value, copy, out));
  const inp = h('textarea', { id: 'io-in', class: 'mono', rows: 6, placeholder: 'Paste a set of answers copied from this tool' }) as HTMLTextAreaElement;
  const msg = h('p', { class: 'fine', role: 'status' });
  const load = h('button', { type: 'button', class: 'primary' }, 'Load these answers');
  load.addEventListener('click', () => {
    try {
      const parsed = JSON.parse(inp.value);
      if (typeof parsed !== 'object' || !parsed || Array.isArray(parsed)) throw new Error('expected an object of answers');
      ui.answers = store.sanitise(ui.graph, parsed);
      ui.panel = 'none';
      persist();
      render(true);
    } catch (e) {
      msg.textContent = `Those answers could not be read: ${(e as Error).message}. Paste the full text copied from "Copy answers".`;
    }
  });

  return h(
    'section',
    { class: 'card io' },
    h('div', { class: 'panel-head' }, h('h2', null, 'Saved sets & sharing'), h('button', { type: 'button', class: 'link', onclick: () => ((ui.panel = 'none'), (ui.renaming = null), render()) }, 'Close')),
    h('p', null, 'Everything here is kept in this browser only. Save several named sets to compare proposals, and copy a set out or paste one in to keep it or pass it to someone else.'),
    h('h3', null, 'Your saved sets'),
    h('div', { class: 'save-row' }, nameInput, saveBtn),
    sets.length ? h('ul', { class: 'sets' }, sets.map(setRow)) : h('p', { class: 'fine' }, hasAnswers ? 'No saved sets yet. Name the current answers above to keep them.' : 'Answer some questions, then come back to name and save a set.'),
    h('h3', null, 'Copy, paste or share (JSON)'),
    h('p', { class: 'fine' }, 'Copy your current answers to keep a file or pass them on; paste a set in to load it, then name and save it above.'),
    h('label', { for: 'io-out' }, 'Your answers'),
    out,
    h('div', { class: 'actions' }, copy),
    h('label', { for: 'io-in' }, 'Load answers'),
    inp,
    h('div', { class: 'actions' }, load),
    msg,
  );
}

function mapPanel(ev: Evaluation): HTMLElement {
  const fig = h('figure', { class: 'rm-fig' });
  fig.append(
    routeMap(ev, ui.answers),
    h('figcaption', null, 'Which route a proposal takes depends on two questions: is it in the Green Belt, and is it within a settlement. Every route then runs the same tests, and each ends in its own balance. The route your answers have taken so far is highlighted. "Finely balanced" results are not shown.'),
  );
  return h(
    'section',
    { class: 'card about' },
    h('div', { class: 'panel-head' }, h('h2', null, 'Route map'), h('button', { type: 'button', class: 'link', onclick: () => ((ui.panel = 'none'), render()) }, 'Close')),
    fig,
  );
}

// ---------- page

function render(moveFocus = false) {
  const g = ui.graph;
  const ev = evaluate(g, ui.answers);
  const editingNode = ui.editing ? g.nodes.find((n) => n.id === ui.editing) ?? null : null;
  const d = ui.manifest.dataset;

  const header = h(
    'header',
    { class: 'top' },
    h('div', { class: 'brand' }, h('h1', null, g.meta.title), h('p', null, `Decision routes under the ${g.meta.framework}, with ${d.cases} decisions made since it took effect.`)),
    h(
      'div',
      { class: 'top-actions' },
      h('button', { type: 'button', class: 'secondary', 'aria-pressed': String(ui.panel === 'map'), onclick: () => ((ui.panel = ui.panel === 'map' ? 'none' : 'map'), render()) }, 'Route map'),
      h('button', { type: 'button', class: 'secondary', onclick: () => ((ui.panel = ui.panel === 'about' ? 'none' : 'about'), render()) }, 'About'),
      h('button', { type: 'button', class: 'secondary', onclick: () => ((ui.panel = ui.panel === 'io' ? 'none' : 'io'), (ui.renaming = null), render()) }, 'Saved sets'),
      Object.keys(ui.answers).length ? startAgain() : null,
    ),
  );
  const banner = h('p', { class: 'banner', role: 'note' }, h('strong', null, 'Not legal advice.'), ' An aid to reading the Framework and recent decisions. The planning judgements are yours; the tool shows the policy and how others have decided.');

  const notices: HTMLElement[] = [];
  if (ui.earlier && !Object.keys(ui.answers).length) {
    notices.push(
      h(
        'p',
        { class: 'notice' },
        'You have answers from an earlier version of this tool. ',
        h('button', { type: 'button', class: 'link', onclick: () => ((ui.answers = store.sanitise(g, ui.earlier!)), (ui.earlier = null), persist(), render()) }, 'Reapply the ones that still fit'),
      ),
    );
  }
  const stale = ev.stale.filter((k) => g.nodes.some((n) => n.fact === k && n.input.type !== 'ack'));
  if (stale.length) {
    notices.push(
      h(
        'p',
        { class: 'notice' },
        `${stale.length} earlier ${stale.length === 1 ? 'answer does' : 'answers do'} not apply on this route and ${stale.length === 1 ? 'is' : 'are'} ignored. `,
        h('button', { type: 'button', class: 'link', onclick: () => ((ui.answers = Object.fromEntries(Object.entries(ui.answers).filter(([k]) => !ev.stale.includes(k)))), persist(), render()) }, 'Clear them'),
      ),
    );
  }

  const focusNode = editingNode ?? ev.next;
  const main = h('main', { class: 'grid' });
  const flow = h('div', { class: 'flow' }, notices);
  if (ui.panel === 'about') flow.append(aboutPanel());
  if (ui.panel === 'io') flow.append(ioPanel());
  if (ui.panel === 'map') flow.append(mapPanel(ev));
  if (focusNode) flow.append(nodeCard(focusNode, ev, !!editingNode));
  else if (ev.outcome) flow.append(outcomeCard(ev));
  else flow.append(h('article', { class: 'card' }, h('h2', null, 'No route applies'), h('p', null, 'The answers given do not lead to a determination. Check the answers below.')));
  const list = answersList(ev);
  if (list) flow.append(list);
  main.append(flow, focusNode ? nodeContext(focusNode, ev) : outcomeContext(ev));

  clear(root);
  root.append(header, banner, rail(ev), main, h('footer', { class: 'foot' }, `${g.meta.framework}. Quotations verified against the published text at build time. Decisions dataset to ${d.newestDecisionDate}. Not legal advice.`));
  if (moveFocus) {
    const cur = document.getElementById('current');
    cur?.focus({ preventScroll: true });
    cur?.closest('.card')?.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}

function startAgain(): HTMLElement {
  const wrap = h('span', { class: 'confirm' });
  const ask = h('button', { type: 'button', class: 'secondary' }, 'Start again');
  ask.addEventListener('click', () => {
    wrap.replaceChildren(
      h('span', { class: 'fine' }, 'Clear all answers?'),
      h('button', { type: 'button', class: 'danger', onclick: () => ((ui.answers = {}), (ui.editing = null), (ui.focus = null), persist(), render(true)) }, 'Clear'),
      h('button', { type: 'button', class: 'link', onclick: () => render() }, 'Keep'),
    );
  });
  wrap.append(ask);
  return wrap;
}

async function main() {
  root.replaceChildren(h('p', { class: 'loading' }, 'Loading the Framework and decisions…'));
  try {
    const { manifest, graph, index } = await loadAll();
    const saved = store.load(manifest.graph.hash);
    ui = { manifest, graph, index, answers: saved ? store.sanitise(graph, saved) : {}, editing: null, focus: null, panel: 'none', earlier: saved ? null : store.previous(manifest.graph.hash), renaming: null };
    render();
  } catch (e) {
    root.replaceChildren(h('div', { class: 'card' }, h('h2', null, 'The tool could not load'), h('p', null, (e as Error).message), h('p', null, 'Reload the page to try again.')));
  }
}

void main();
