// Bundle every test/*.test.ts with the harness and run them in-process.
import { build } from 'esbuild';
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { PKG, TMP } from './lib.mjs';

mkdirSync(TMP, { recursive: true });
const files = readdirSync(join(PKG, 'test')).filter((f) => f.endsWith('.test.ts'));
const entry = join(TMP, 'tests-entry.ts');
writeFileSync(entry, files.map((f) => `import '../test/${f}';`).join('\n') + `\nexport { tests } from '../test/harness';\n`);
const out = join(TMP, 'tests.mjs');
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' });
const { tests } = await import(pathToFileURL(out).href + '?t=' + Date.now());

let failed = 0;
for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (e) {
    failed++;
    console.log(`✗ ${name}\n  ${String(e.message).replace(/\n/g, '\n  ')}`);
  }
}
console.log(`\n${tests.length - failed}/${tests.length} passed`);
process.exit(failed ? 1 : 0);
