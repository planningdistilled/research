// Case data for the browser: an always-loaded match index plus lazily loaded, content-hashed shards.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { DECISIONS as DB, sha } from './lib.mjs';

const SHARD_BYTES = 900_000;

const DM = { inspector: 'I', 'secretary-of-state': 'SoS', 'lpa-committee': 'C', 'lpa-delegated': 'D', court: 'Ct' };
const FW = { '2026-08': '26', '2024-12 (transitional)': '24t', 'not-cited': 'nc' };
const VER = { 'letter-read': 'L', 'report-read': 'R', 'notice-read': 'N' };

function body(file) {
  const t = readFileSync(join(DB, file), 'utf8');
  const parts = t.split(/^---\s*$/m);
  return parts.length >= 3 ? parts.slice(2).join('---').trim() : '';
}

function shard(records, prefix, files) {
  const out = [];
  let cur = [], size = 0;
  const flush = () => {
    if (!cur.length) return;
    const json = JSON.stringify(Object.fromEntries(cur));
    const name = `${prefix}-${sha(json).slice(0, 10)}.json`;
    files[`data/${name}`] = json;
    out.push({ file: `data/${name}`, bytes: Buffer.byteLength(json), cases: cur.length });
    cur = [];
    size = 0;
  };
  const where = new Map();
  for (const [id, rec] of records) {
    const b = Buffer.byteLength(JSON.stringify(rec)) + id.length + 4;
    if (size + b > SHARD_BYTES) flush();
    where.set(id, out.length);
    cur.push([id, rec]);
    size += b;
  }
  flush();
  return { list: out, where };
}

/** Returns { files: {path: string}, manifestPart, stats }. `canonical` comes from src/data/codes.ts. */
export function buildData(canonical) {
  const cases = JSON.parse(readFileSync(join(DB, 'index/cases.json'), 'utf8'));
  const statePath = join(DB, 'harvest-log/state.json');
  const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : {};
  const files = {};
  const unknownCodes = new Map();

  const notes = [], bodies = [];
  for (const c of cases) {
    const letter = (c.sources || []).find((u) => u.includes('/published-document/')) || null;
    const page = (c.sources || []).find((u) => u.includes('/appeals/') || u.includes('ViewCase') || u.includes('Eplanning')) || null;
    notes.push([
      c.case_id,
      {
        dev: c.development,
        ins: c.inspector,
        proc: c.procedure,
        lpa: c.lpa_ref,
        kf: c.key_facts || [],
        mi: c.main_issues || [],
        n: c.policy_findings.map((p) => p.note || ''),
        raw: c.policy_findings.map((p) => p.policy),
        letter,
        page,
        dp: c.development_plan || [],
      },
    ]);
    bodies.push([c.case_id, body(c._file)]);
  }
  const N = shard(notes, 'notes', files);
  const B = shard(bodies, 'bodies', files);

  const index = cases.map((c) => ({
    i: c.case_id,
    t: c.title,
    a: c.authority,
    r: c.region,
    dm: DM[c.decision_maker] || c.decision_maker,
    d: c.decision_date,
    o: c.outcome,
    ref: c.appeal_ref || c.lpa_ref || null,
    dt: c.dev_type,
    u: c.units,
    sc: c.site_context,
    gb: c.green_belt ? 1 : 0,
    gy: c.grey_belt,
    hls: c.housing_land_supply_years,
    fw: FW[c.nppf_applied] || c.nppf_applied,
    v: VER[c.verification] || c.verification,
    tg: c.tags,
    f: c.policy_findings.map((p) => {
      const code = canonical(p.policy);
      if (!code) unknownCodes.set(p.policy, (unknownCodes.get(p.policy) || 0) + 1);
      return [code || p.policy, p.finding, p.weight || null];
    }),
    det: (c.determinative_policies || []).map((p) => canonical(p) || p),
    ns: N.where.get(c.case_id),
    bs: B.where.get(c.case_id),
  }));
  const indexJson = JSON.stringify(index);
  const indexName = `data/index-${sha(indexJson).slice(0, 10)}.json`;
  files[indexName] = indexJson;

  const pins = state.sources?.['pins-new'] || {};
  const dataset = {
    cases: cases.length,
    byDecisionMaker: state.cases?.byDecisionMaker,
    newestDecisionDate: state.cases?.newestDecisionDate || cases.reduce((m, c) => (c.decision_date > m ? c.decision_date : m), ''),
    lastHarvest: pins.lastSweepAt || null,
    lettersInCorpus: pins.corpusLetters || null,
    awaitingDistillation: pins.queued ?? null,
    framework2026: cases.filter((c) => c.nppf_applied === '2026-08').length,
  };
  return {
    files,
    manifestPart: { dataset, index: { file: indexName, bytes: Buffer.byteLength(indexJson), cases: cases.length }, notes: N.list, bodies: B.list, baseUrl: null },
    stats: { unknownCodes: [...unknownCodes.entries()].sort((a, b) => b[1] - a[1]) },
  };
}
