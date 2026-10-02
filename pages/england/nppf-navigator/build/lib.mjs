import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { NPPF_PDF } from '../../../../paths.mjs';

export const HERE = dirname(fileURLToPath(import.meta.url));
export const PKG = resolve(HERE, '..');
export const TMP = join(PKG, '.build');
export { ROOT as REPO, DECISIONS, GUIDANCE, SITE, NPPF_PDF } from '../../../../paths.mjs';

/** Bundle a TS module to ESM in .build/ and import it. */
export async function loadTs(entry) {
  mkdirSync(TMP, { recursive: true });
  const out = join(TMP, entry.replace(/[\\/]/g, '_').replace(/\.ts$/, '.mjs'));
  await build({ entryPoints: [join(PKG, entry)], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' });
  return import(pathToFileURL(out).href + '?t=' + Date.now());
}

export const sha = (buf) => createHash('sha256').update(buf).digest('hex');

/** NPPF text, extracted once and cached by PDF mtime. */
export function nppfText() {
  mkdirSync(TMP, { recursive: true });
  const cache = join(TMP, 'nppf.txt');
  if (!existsSync(cache) || statSync(cache).mtimeMs < statSync(NPPF_PDF).mtimeMs) {
    writeFileSync(cache, execFileSync('pdftotext', ['-layout', NPPF_PDF, '-'], { maxBuffer: 64 << 20 }));
  }
  return readFileSync(cache, 'utf8');
}

/**
 * Normalise for comparison: straight quotes, no footnote markers glued to words ("building25" → "building"),
 * no page furniture, hyphenated line-breaks joined, whitespace collapsed.
 */
export function normalise(t, { source = false } = {}) {
  let s = t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/–|—/g, '-').replace(/ /g, ' ');
  if (source) {
    s = s
      .split('\n')
      .filter((l) => !/^\s*\d{1,3}\s*$/.test(l)) // bare page numbers
      .join('\n')
      .replace(/([a-z%)'])(\d{1,3})(?=[\s.,;:)]|$)/gm, '$1'); // footnote refs
  }
  return s.replace(/\s+/g, ' ').replace(/(\w)- (\w)/g, '$1-$2').trim();
}
