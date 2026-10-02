// Route map: a flow chart of the Framework's decision routes, with the route taken by the
// current answers highlighted. Built with DOM calls (no innerHTML), like the rest of the UI.
import type { Answers, Evaluation } from '../../engine/types';

const NS = 'http://www.w3.org/2000/svg';

function s<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, ...kids: (SVGElement | string)[]): SVGElementTagNameMap[K] {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  for (const c of kids) el.append(typeof c === 'string' ? document.createTextNode(c) : c);
  return el;
}

interface Box { id: string; x: number; y: number; w: number; h: number; title: string; lines?: string[]; kind?: 'q' | 'route' | 'test' | 'approve' | 'refuse' }
interface Edge { from: string; to: string; d: string; label?: string; lx?: number; ly?: number; anchor?: 'start' | 'middle' | 'end' }

// Five route columns: centres 84, 232, 380, 528, 676; width 136.
const col = (i: number) => 16 + i * 148;

const BOXES: Box[] = [
  { id: 'site', x: 280, y: 16, w: 200, h: 44, title: 'The site and the proposal', kind: 'q' },
  { id: 'gbq', x: 280, y: 88, w: 200, h: 44, title: 'In the Green Belt?', lines: ['includes washed-over villages'], kind: 'q' },
  { id: 'gb7', x: 58, y: 176, w: 200, h: 52, title: 'A GB7 category met?', lines: ['GB7(1); grey belt (g)(iii) needs TR3'], kind: 'q' },
  { id: 'settle', x: 380, y: 176, w: 200, h: 52, title: 'Within a settlement?', lines: ['S3; washed-over villages are not'], kind: 'q' },
  { id: 's5cat', x: 502, y: 252, w: 200, h: 48, title: 'An S5(1) category met?', lines: ['e.g. (c) reuse, (j) unmet need'], kind: 'q' },
  { id: 'r-gb6', x: col(0), y: 332, w: 136, h: 48, title: 'Inappropriate', lines: ['GB6'], kind: 'route' },
  { id: 'r-s55', x: col(1), y: 332, w: 136, h: 48, title: 'Not inappropriate', lines: ['S5(5)'], kind: 'route' },
  { id: 'r-s4', x: col(2), y: 332, w: 136, h: 48, title: 'Within settlement', lines: ['S4'], kind: 'route' },
  { id: 'r-s51', x: col(3), y: 332, w: 136, h: 48, title: 'S5(1) category', lines: ['S5(1)'], kind: 'route' },
  { id: 'r-s534', x: col(4), y: 332, w: 136, h: 48, title: 'No category', lines: ['S5(3) isolated / S5(4)'], kind: 'route' },
  { id: 'tr3', x: 28, y: 428, w: 166, h: 72, title: 'Location (TR3)', lines: ['genuine choice of modes,', 'judged on the actual route'], kind: 'test' },
  { id: 'heritage', x: 206, y: 428, w: 166, h: 72, title: 'Heritage (HE5, HE6)', lines: ['harm weighed against public', 'benefits; result carried to balance'], kind: 'test' },
  { id: 'triggers', x: 384, y: 428, w: 166, h: 72, title: '"Should be refused"', lines: ['DP3(3) design, TR6(4), flood…', 'unless clear justification'], kind: 'test' },
  { id: 'benefits', x: 562, y: 428, w: 166, h: 72, title: 'Benefits', lines: ['housing, economy,', 'supply position'], kind: 'test' },
  { id: 'b-vsc', x: col(0), y: 548, w: 136, h: 60, title: 'Very special', lines: ['circumstances?', 'GB6(2)'], kind: 'q' },
  { id: 'b-bal', x: col(1), y: 548, w: 432, h: 60, title: 'Benefits substantially outweighed by adverse effects?', lines: ['S4(1), S5(1), S5(5). A failed "should be refused" policy', 'makes this likely (S4(2)(c), S5(2)).'], kind: 'q' },
  { id: 'b-exc', x: col(4), y: 548, w: 136, h: 60, title: 'HO11 met, or', lines: ['exceptional', 'circumstances? S5(4)'], kind: 'q' },
  { id: 'p-vsc-app', x: col(0), y: 648, w: 64, h: 28, title: 'Approve', kind: 'approve' },
  { id: 'p-vsc-ref', x: col(0) + 72, y: 648, w: 64, h: 28, title: 'Refuse', kind: 'refuse' },
  { id: 'p-bal-ref', x: 272, y: 648, w: 100, h: 28, title: 'Refuse', kind: 'refuse' },
  { id: 'p-bal-app', x: 388, y: 648, w: 100, h: 28, title: 'Approve', kind: 'approve' },
  { id: 'p-exc-app', x: col(4), y: 648, w: 64, h: 28, title: 'Approve', kind: 'approve' },
  { id: 'p-exc-ref', x: col(4) + 72, y: 648, w: 64, h: 28, title: 'Refuse', kind: 'refuse' },
];

const EDGES: Edge[] = [
  { from: 'site', to: 'gbq', d: 'M380 60 V88' },
  { from: 'gbq', to: 'gb7', d: 'M380 132 V152 H158 V176', label: 'Yes', lx: 268, ly: 147, anchor: 'middle' },
  { from: 'gbq', to: 'settle', d: 'M380 132 V152 H480 V176', label: 'No', lx: 430, ly: 147, anchor: 'middle' },
  { from: 'gb7', to: 'r-gb6', d: 'M158 228 V304 H84 V332', label: 'No', lx: 90, ly: 299, anchor: 'start' },
  { from: 'gb7', to: 'r-s55', d: 'M158 228 V304 H232 V332', label: 'Yes', lx: 226, ly: 299, anchor: 'end' },
  { from: 'settle', to: 'r-s4', d: 'M430 228 V304 H380 V332', label: 'Yes', lx: 386, ly: 299, anchor: 'start' },
  { from: 'settle', to: 's5cat', d: 'M530 228 V240 H602 V252', label: 'No or partly', lx: 612, ly: 245, anchor: 'start' },
  { from: 's5cat', to: 'r-s51', d: 'M580 300 V316 H528 V332', label: 'Yes', lx: 534, ly: 312, anchor: 'end' },
  { from: 's5cat', to: 'r-s534', d: 'M624 300 V316 H676 V332', label: 'No', lx: 670, ly: 312, anchor: 'start' },
  ...[84, 232, 380, 528, 676].map((x, i) => ({ from: ['r-gb6', 'r-s55', 'r-s4', 'r-s51', 'r-s534'][i], to: 'band', d: `M${x} 380 V400` })),
  { from: 'band', to: 'b-vsc', d: 'M84 512 V548' },
  { from: 'band', to: 'b-bal', d: 'M380 512 V548' },
  { from: 'band', to: 'b-exc', d: 'M676 512 V548' },
  { from: 'b-vsc', to: 'p-vsc-app', d: 'M48 608 V648', label: 'Shown', lx: 52, ly: 634, anchor: 'start' },
  { from: 'b-vsc', to: 'p-vsc-ref', d: 'M120 608 V648', label: 'Not', lx: 124, ly: 634, anchor: 'start' },
  { from: 'b-bal', to: 'p-bal-ref', d: 'M322 608 V648', label: 'Yes', lx: 328, ly: 634, anchor: 'start' },
  { from: 'b-bal', to: 'p-bal-app', d: 'M438 608 V648', label: 'No', lx: 444, ly: 634, anchor: 'start' },
  { from: 'b-exc', to: 'p-exc-app', d: 'M640 608 V648', label: 'Yes', lx: 644, ly: 634, anchor: 'start' },
  { from: 'b-exc', to: 'p-exc-ref', d: 'M712 608 V648', label: 'No', lx: 716, ly: 634, anchor: 'start' },
];

const ROUTE_BOX: Record<string, string> = { 'GB6(2)': 'r-gb6', 'S5(5)': 'r-s55', S4: 'r-s4', 'S5(1)': 'r-s51', 'S5(3)': 'r-s534', 'S5(4)': 'r-s534' };
const BALANCE_BOX: Record<string, string> = { 'r-gb6': 'b-vsc', 'r-s55': 'b-bal', 'r-s4': 'b-bal', 'r-s51': 'b-bal', 'r-s534': 'b-exc' };
const OUTCOME_PILL: Record<string, string> = {
  'vsc-yes': 'p-vsc-app', 'vsc-no': 'p-vsc-ref',
  'bal-approve': 'p-bal-app', 'bal-refuse': 'p-bal-ref', 'bal-refuse-trigger': 'p-bal-ref',
  'bal-approve-heritage': 'p-bal-app', 'bal-refuse-heritage': 'p-bal-ref',
  'exc-yes': 'p-exc-app', 'exc-no': 'p-exc-ref', ho11: 'p-exc-ref',
};

/** Which boxes the current answers have reached. */
function reached(ev: Evaluation, a: Answers): { on: Set<string>; failed: Set<string> } {
  const on = new Set<string>();
  const failed = new Set<string>();
  const sections = new Set(ev.path.map((p) => p.node.section));
  if (!ev.path.length) return { on, failed };
  on.add('site');
  if (a.gb !== undefined) on.add('gbq');
  const inGB = a.gb === 'yes' || a.gb === 'washed-over';
  if (inGB) on.add('gb7');
  if (a.gb === 'no') on.add('settle');
  if (a.gb === 'no' && (a.settlementLoc === 'outside' || a.settlementLoc === 'partly')) on.add('s5cat');
  const route = ev.facts.route as string | undefined;
  // Positive routes are settled as soon as they are derived. The fall-back routes (GB6, S5(3)/(4))
  // are only settled once the questions after the route tests have been reached.
  const later = ['heritage', 'triggers', 'benefits', 'balance'].some((x) => sections.has(x)) || !!ev.outcome;
  const routeReady = route === 'S5(5)' || route === 'S4' || route === 'S5(1)' || route === 'S5(3)' || later;
  const rb = route && routeReady ? ROUTE_BOX[route] : undefined;
  if (rb) on.add(rb);
  if (sections.has('location')) on.add('tr3');
  if (sections.has('heritage')) on.add('heritage');
  if (sections.has('triggers')) on.add('triggers');
  if (sections.has('benefits')) on.add('benefits');
  if (['tr3', 'heritage', 'triggers', 'benefits'].some((k) => on.has(k))) on.add('band');
  if (rb && (sections.has('balance') || ev.outcome)) on.add(BALANCE_BOX[rb]);
  const out = ev.outcome?.id;
  if (ev.findings.some((f) => f.kind === 'fail' && (f.policy === 'HE6(4)' || f.policy === 'HE5(1)'))) failed.add('heritage');
  const pill = out ? OUTCOME_PILL[out] : undefined;
  if (pill) on.add(pill);
  return { on, failed };
}

export function routeMap(ev: Evaluation, answers: Answers): SVGSVGElement {
  const { on, failed } = reached(ev, answers);
  const label = 'Flow chart of the decision routes: Green Belt or not, then within a settlement or not, give five routes; every route runs the location, heritage, "should be refused" and benefits tests; each route ends in its own balance and outcome.';
  const svg = s('svg', { viewBox: '0 0 760 690', role: 'img', 'aria-label': label, class: 'rm' });
  svg.append(
    s('defs', {},
      s('marker', { id: 'rm-arrow', viewBox: '0 0 10 10', refX: 9, refY: 5, markerUnits: 'userSpaceOnUse', markerWidth: 8, markerHeight: 8, orient: 'auto-start-reverse' }, s('path', { d: 'M0 0 L10 5 L0 10 z', class: 'rm-head' })),
      s('marker', { id: 'rm-arrow-on', viewBox: '0 0 10 10', refX: 9, refY: 5, markerUnits: 'userSpaceOnUse', markerWidth: 8, markerHeight: 8, orient: 'auto-start-reverse' }, s('path', { d: 'M0 0 L10 5 L0 10 z', class: 'rm-head on' })),
    ),
  );
  // The band of tests every route runs.
  svg.append(
    s('rect', { x: 16, y: 400, width: 728, height: 112, rx: 10, class: `rm-band${on.has('band') ? ' on' : ''}` }),
    s('text', { x: 28, y: 418, class: 'rm-band-label' }, 'Tested on every route (they feed the balance below)'),
  );
  for (const e of EDGES) {
    const lit = on.has(e.from) && on.has(e.to);
    svg.append(s('path', { d: e.d, class: `rm-edge${lit ? ' on' : ''}`, 'marker-end': `url(#${lit ? 'rm-arrow-on' : 'rm-arrow'})` }));
    if (e.label) svg.append(s('text', { x: e.lx!, y: e.ly!, 'text-anchor': e.anchor ?? 'middle', class: `rm-elabel${lit ? ' on' : ''}` }, e.label));
  }
  for (const b of BOXES) {
    const cls = ['rm-box', `k-${b.kind ?? 'q'}`, on.has(b.id) ? 'on' : '', failed.has(b.id) ? 'failed' : ''].filter(Boolean).join(' ');
    const g = s('g', { class: cls });
    g.append(s('rect', { x: b.x, y: b.y, width: b.w, height: b.h, rx: b.kind === 'approve' || b.kind === 'refuse' ? 14 : 6 }));
    const lines = b.lines ?? [];
    const lh = 14;
    const top = b.y + b.h / 2 - ((lines.length) * lh) / 2 + 4;
    g.append(s('text', { x: b.x + b.w / 2, y: lines.length ? top : b.y + b.h / 2 + 4.5, 'text-anchor': 'middle', class: 'rm-title' }, b.title));
    lines.forEach((l, i) => g.append(s('text', { x: b.x + b.w / 2, y: top + (i + 1) * lh, 'text-anchor': 'middle', class: 'rm-sub' }, l)));
    svg.append(g);
  }
  return svg;
}
