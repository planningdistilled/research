// Per-viewer progress in localStorage. Every access is guarded: the tool works with no storage at all.
import type { Answers, Graph } from '../engine/types';

const PREFIX = 'nppf-nav:';
const LAST = PREFIX + 'last';
const SETS = PREFIX + 'sets';

/** A named set of answers the viewer has saved, so they can keep and switch between several proposals. */
export interface SavedSet {
  id: string;
  name: string;
  answers: Answers;
  hash: string; // graph version the set was saved under
  savedAt: string;
}

export function listSets(): SavedSet[] {
  try {
    const raw = localStorage.getItem(SETS);
    const a = raw ? JSON.parse(raw) : [];
    return Array.isArray(a) ? (a as SavedSet[]) : [];
  } catch {
    return [];
  }
}

function writeSets(sets: SavedSet[]): SavedSet[] {
  try {
    localStorage.setItem(SETS, JSON.stringify(sets));
  } catch {
    /* ignore: the tool still works, the set just is not kept */
  }
  return sets;
}

export function saveSet(name: string, answers: Answers, hash: string): SavedSet[] {
  const id = 'set-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return writeSets([{ id, name: name.trim() || 'Untitled set', answers, hash, savedAt: new Date().toISOString() }, ...listSets()]);
}

export function deleteSet(id: string): SavedSet[] {
  return writeSets(listSets().filter((s) => s.id !== id));
}

/** Overwrite a saved set with the current answers, keeping its name and place in the list. */
export function updateSet(id: string, answers: Answers, hash: string): SavedSet[] {
  return writeSets(listSets().map((s) => (s.id === id ? { ...s, answers, hash, savedAt: new Date().toISOString() } : s)));
}

export function renameSet(id: string, name: string): SavedSet[] {
  return writeSets(listSets().map((s) => (s.id === id ? { ...s, name: name.trim() || s.name } : s)));
}

export function load(hash: string): Answers | null {
  try {
    const raw = localStorage.getItem(PREFIX + hash);
    return raw ? (JSON.parse(raw).answers as Answers) : null;
  } catch {
    return null;
  }
}

export function save(hash: string, answers: Answers) {
  try {
    localStorage.setItem(PREFIX + hash, JSON.stringify({ answers, updatedAt: new Date().toISOString() }));
    localStorage.setItem(LAST, hash);
  } catch {
    /* ignore */
  }
}

/** Answers saved against an earlier graph version, if any. */
export function previous(hash: string): Answers | null {
  try {
    const last = localStorage.getItem(LAST);
    if (!last || last === hash) return null;
    const raw = localStorage.getItem(PREFIX + last);
    return raw ? (JSON.parse(raw).answers as Answers) : null;
  } catch {
    return null;
  }
}

/** Keep only answers that still fit the current graph (known fact, allowed value). */
export function sanitise(g: Graph, answers: Answers): Answers {
  const out: Answers = {};
  for (const n of g.nodes) {
    const v = answers[n.fact];
    if (v === undefined || v === null) continue;
    const inp = n.input;
    if (inp.type === 'single' && inp.options.some((o) => o.value === v)) out[n.fact] = v;
    else if (inp.type === 'multi' && Array.isArray(v)) out[n.fact] = v.filter((x) => inp.options.some((o) => o.value === x));
    else if (inp.type === 'number' && (typeof v === 'number' || (inp.skip && v === inp.skip.value))) out[n.fact] = v;
    else if (inp.type === 'ack' && v === true) out[n.fact] = true;
  }
  return out;
}
