// Graph and engine types. The graph is plain data (no functions) so it serialises to graph.json.

export type Scalar = string | number | boolean;
export type Value = Scalar | string[] | null;
/** User answers keyed by fact id. */
export type Answers = Record<string, Value>;
/** Answers plus derived facts. */
export type Facts = Record<string, Value>;

/** Guard predicates: a small JSON-logic subset, evaluated over facts and findings. */
export type Pred =
  | true
  | { readonly eq: readonly [string, Scalar] }
  | { readonly ne: readonly [string, Scalar] }
  | { readonly in: readonly [string, readonly Scalar[]] }
  | { readonly has: readonly [string, string] } // array fact contains value
  | { readonly gte: readonly [string, number] }
  | { readonly lt: readonly [string, number] }
  | { readonly answered: string }
  | { readonly hasFinding: { readonly kind?: FindingKind; readonly policy?: string } }
  | { readonly not: Pred }
  | { readonly all: readonly Pred[] }
  | { readonly any: readonly Pred[] };

export type FindingKind = 'route' | 'trigger' | 'harm' | 'benefit' | 'pass' | 'fail' | 'note';
export type Weight = 'substantial' | 'significant' | 'considerable' | 'moderate' | 'limited' | 'very-limited';

export interface Finding {
  kind: FindingKind;
  policy: string; // canonical code, e.g. "GB7(1)(g)(iii)"
  text: string; // one sentence, decision-letter register
  weight?: Weight;
  quotes?: string[]; // quote ids
  cases?: CaseQuery;
}

export interface Effect {
  when?: Pred;
  finding: Finding;
}

/** Which decisions to show, and how to group them. Codes match hierarchically (GB7(1)(g) matches GB7(1)(g)(iii)). */
export interface CaseQuery {
  policies: string[];
  findings?: string[]; // case finding values: pass fail harm benefit conflict accord neutral not-engaged
  tags?: string[]; // any-of
  context?: string[]; // site_context any-of (boosts ranking, does not filter)
  groupBy?: 'finding' | 'outcome';
  label?: string;
}

export interface Option {
  value: Scalar;
  label: string;
  help?: string;
  when?: Pred;
  effects?: Finding[];
}

export type Input =
  | { type: 'single'; options: Option[] }
  | { type: 'multi'; options: Option[] }
  | { type: 'number'; min?: number; max?: number; unit?: string; step?: number; skip?: { value: string; label: string } }
  | { type: 'ack' }; // info nodes: "Continue"

/** How to decide a planning judgement: the structured method shown with every judgement node. */
export interface Method {
  /** The single question the judgement comes down to, in plain words. */
  question: string;
  /** Ordered steps to work through before answering. */
  steps: string[];
  /** Factors that point towards each answer, keyed by option value. */
  pointers: { option: Scalar; factors: string[] }[];
  /** Evidence to have in front of you. */
  evidence?: string[];
  /** How to call it when it is close: the standard, where the burden lies. */
  closeCall?: string;
}

export interface Reading {
  label: string;
  summary: string;
  cases?: CaseQuery;
}

export interface GraphNode {
  id: string;
  kind: 'question' | 'judgement' | 'info';
  section: string; // module id, e.g. "core", "greenbelt"
  title: string;
  prompt: string;
  help?: string[]; // guidance points, shown collapsed
  quotes?: string[]; // quote ids shown with the node
  fact: string; // fact id the answer is stored under
  input: Input;
  when?: Pred;
  effects?: Effect[];
  cases?: CaseQuery;
  contested?: { summary: string; readings: Reading[] };
  method?: Method; // required for judgement nodes
  whyShown?: string; // plain-words gloss of `when`
  // A provisional reading derived from earlier answers, shown above the input for the user to confirm or override.
  // `fact` is a derived fact whose value is one of this node's option values (or a value in `extra`).
  suggest?: { fact: string; extra?: Record<string, string> };
  // A free-text box rendered on the same card, for the user to record other material considerations.
  // Its value is stored under `fact` and never affects routing; blank is allowed.
  notes?: { fact: string; label: string; placeholder?: string };
  // Conditional guidance shown on the card only when `when` holds (evaluated against the facts). A missing
  // `when` always shows. Presentational only — never affects routing.
  notices?: { when?: Pred; text: string }[];
}

export interface DerivedRule {
  fact: string;
  value: Scalar | { from: string };
  when: Pred;
  note?: string; // policy basis, shown in the UI
}

export type Verdict = 'refuse' | 'approve' | 'balanced';

export interface OutcomeRule {
  id: string;
  when: Pred;
  verdict: Verdict;
  title: string;
  test: string; // the test that decided it, in words
  quotes: string[];
}

export interface Quote {
  code: string;
  title: string;
  text: string; // verbatim, footnote markers removed
}

export interface Section {
  id: string;
  title: string;
}

export interface Graph {
  meta: { id: string; version: string; title: string; framework: string; frameworkDate: string };
  sections: Section[];
  quotes: Record<string, Quote>;
  derived: DerivedRule[];
  nodes: GraphNode[];
  outcomes: OutcomeRule[];
}

export interface PathStep {
  node: GraphNode;
  answer: Value | undefined;
  findings: Finding[];
  auto?: boolean; // resolved automatically (a single-choice question with only one available option), not answered by the user
}

export interface Evaluation {
  facts: Facts;
  path: PathStep[]; // answered on-path nodes, in order
  next: GraphNode | null; // first unanswered on-path node
  findings: Finding[];
  outcome: OutcomeRule | null; // only when next === null
  stale: string[]; // answered facts whose nodes are now off-path
}
