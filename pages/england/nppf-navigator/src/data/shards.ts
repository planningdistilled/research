// Manifest-driven data loading. Shards are content-hashed, so a cached copy is always current for its name.
import type { Graph } from '../engine/types';
import type { CaseIdx } from './match';

export interface ShardRef {
  file: string;
  bytes: number;
  cases: number;
}
export interface Manifest {
  version: number;
  builtAt: string;
  graph: { file: string; id: string; version: string; hash: string };
  dataset: {
    cases: number;
    byDecisionMaker?: Record<string, number>;
    newestDecisionDate: string;
    lastHarvest: string | null;
    lettersInCorpus: number | null;
    awaitingDistillation: number | null;
    framework2026: number;
  };
  index: ShardRef;
  notes: ShardRef[];
  bodies: ShardRef[];
  baseUrl: string | null;
}
export interface CaseNotes {
  dev: string;
  ins: string | null;
  proc: string;
  lpa: string | null;
  kf: string[];
  mi: string[];
  n: string[];
  raw: string[];
  letter: string | null;
  page: string | null;
  dp: string[];
}

// IndexedDB can stall in sandboxed frames: every access races a short timeout and falls back to the network.
function within<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([p, new Promise<T>((r) => setTimeout(() => r(fallback), ms))]);
}

let db: Promise<IDBDatabase | null> | null = null;
function openDb(): Promise<IDBDatabase | null> {
  if (!db) {
    db = new Promise((resolve) => {
      try {
        const req = indexedDB.open('nppf-navigator', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('shards');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
        req.onblocked = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
    db = within(db, 1500, null);
  }
  return db;
}

async function cached(file: string): Promise<unknown | undefined> {
  const d = await openDb();
  if (!d) return undefined;
  return within(new Promise((resolve) => {
    try {
      const r = d.transaction('shards').objectStore('shards').get(file);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => resolve(undefined);
    } catch {
      resolve(undefined);
    }
  }), 1000, undefined);
}

async function store(file: string, value: unknown) {
  const d = await openDb();
  if (!d) return;
  try {
    d.transaction('shards', 'readwrite').objectStore('shards').put(value, file);
  } catch {
    /* storage unavailable: fine, we refetch next time */
  }
}

let base = '';
const memory = new Map<string, Promise<unknown>>();

export function fetchJson<T>(file: string, cache = true): Promise<T> {
  if (!memory.has(file)) {
    memory.set(
      file,
      (async () => {
        if (cache) {
          const hit = await cached(file);
          if (hit !== undefined) return hit;
        }
        const res = await fetch(base + file);
        if (!res.ok) throw new Error(`Could not load ${file} (${res.status})`);
        const json = await res.json();
        if (cache) void store(file, json);
        return json;
      })(),
    );
  }
  return memory.get(file) as Promise<T>;
}

export async function loadAll(): Promise<{ manifest: Manifest; graph: Graph; index: CaseIdx[] }> {
  const manifest = await fetchJson<Manifest>('data/manifest.json', false);
  base = manifest.baseUrl ?? '';
  const [graph, index] = await Promise.all([fetchJson<Graph>(manifest.graph.file), fetchJson<CaseIdx[]>(manifest.index.file)]);
  return { manifest, graph, index };
}

export async function caseNotes(m: Manifest, c: CaseIdx): Promise<CaseNotes | undefined> {
  const shard = await fetchJson<Record<string, CaseNotes>>(m.notes[c.ns].file);
  return shard[c.i];
}

export async function caseBody(m: Manifest, c: CaseIdx): Promise<string> {
  const shard = await fetchJson<Record<string, string>>(m.bodies[c.bs].file);
  return shard[c.i] ?? '';
}
