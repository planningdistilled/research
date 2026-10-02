// npm run build: validate the graph, verify quotes, build data shards, bundle the app, write dist/ and graph.md.
import { build } from 'esbuild';
import { rmSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { PKG, loadTs, sha } from './lib.mjs';
import { verifyQuotes } from './verify-quotes.mjs';
import { buildData } from './build-data.mjs';
import { graphMarkdown } from './graph-md.mjs';

const DIST = join(PKG, 'dist');
const LIMITS = { files: 255, totalBytes: 64 << 20, fileBytes: 16 << 20 };

const fail = (msg) => {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
};

const { graph, validate, describe, canonical } = await loadTs('build/entry.ts');

// 1. Graph structure and quotes.
const problems = validate(graph);
if (problems.length) fail(`graph invalid:\n  ${problems.join('\n  ')}`);
const bad = verifyQuotes(graph.quotes);
if (bad.length) fail(`quotes not found in the Framework text: ${bad.map((b) => b.id).join(', ')} (run node build/verify-quotes.mjs)`);
console.log(`✓ graph: ${graph.nodes.length} nodes, ${Object.keys(graph.quotes).length} quotes verified`);

const files = {};
const graphJson = JSON.stringify(graph);
const graphFile = `data/graph-${sha(graphJson).slice(0, 10)}.json`;
files[graphFile] = graphJson;
writeFileSync(join(PKG, 'graph.md'), graphMarkdown(graph, describe));

// 2. Case data.
const data = buildData(canonical);
Object.assign(files, data.files);
if (data.stats.unknownCodes.length) {
  const top = data.stats.unknownCodes.slice(0, 8).map(([c, n]) => `${c} ×${n}`).join('; ');
  console.log(`  note: ${data.stats.unknownCodes.length} non-NPPF finding codes kept as-is (local plan etc.), e.g. ${top}`);
}

// 3. App bundle.
const app = await build({
  entryPoints: [join(PKG, 'src/ui/app.ts')],
  bundle: true,
  format: 'esm',
  minify: true,
  target: 'es2020',
  write: false,
  logLevel: 'error',
});
files['app.js'] = app.outputFiles[0].text;
files['index.html'] = readFileSync(join(PKG, 'src/ui/index.html'), 'utf8');

const manifest = {
  version: 1,
  builtAt: new Date().toISOString(),
  graph: { file: graphFile, id: graph.meta.id, version: graph.meta.version, hash: sha(graphJson).slice(0, 10) },
  ...data.manifestPart,
};
files['data/manifest.json'] = JSON.stringify(manifest, null, 1);

// 4. Write and check limits.
rmSync(DIST, { recursive: true, force: true });
let total = 0;
const sizes = [];
for (const [p, content] of Object.entries(files)) {
  const full = join(DIST, p);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
  const bytes = Buffer.byteLength(content);
  total += bytes;
  sizes.push([p, bytes]);
  if (bytes > LIMITS.fileBytes) fail(`${p} is ${bytes} bytes, over the per-file limit`);
}
const n = Object.keys(files).length;
if (n > LIMITS.files) fail(`${n} files, over the ${LIMITS.files}-file limit`);
if (total > LIMITS.totalBytes) fail(`${total} bytes, over the per-version limit`);

const kb = (b) => `${(b / 1024).toFixed(0)} KB`;
const tier = (re) => sizes.filter(([p]) => re.test(p)).reduce((s, [, b]) => s + b, 0);
const cases = manifest.dataset.cases;
console.log(`✓ dist: ${n} files, ${kb(total)} (limits ${LIMITS.files} files, 64 MB)`);
console.log(`  index   ${kb(tier(/index-/))}  (${(tier(/index-/) / cases).toFixed(0)} B/case, always loaded)`);
console.log(`  notes   ${kb(tier(/notes-/))} in ${manifest.notes.length} shard(s)  (${(tier(/notes-/) / cases).toFixed(0)} B/case)`);
console.log(`  bodies  ${kb(tier(/bodies-/))} in ${manifest.bodies.length} shard(s)  (${(tier(/bodies-/) / cases).toFixed(0)} B/case)`);
console.log(`  app.js  ${kb(files['app.js'].length)}; graph ${kb(graphJson.length)}`);
const perCase = (tier(/index-|notes-|bodies-/) / cases);
console.log(`  headroom: about ${Math.floor((LIMITS.totalBytes - (total - tier(/index-|notes-|bodies-/))) / perCase).toLocaleString()} cases fit this artifact at the current size per case`);
console.log(`✓ graph.md written; dataset ${cases} cases, newest decision ${manifest.dataset.newestDecisionDate}`);
if (!existsSync(join(PKG, 'node_modules'))) console.log('  (run npm install first)');
