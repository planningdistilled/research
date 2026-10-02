// Every path the Node tools need, resolved in one place.
//   ROOT     this repository
//   DATA     ROOT/data (decisions database, guidance corpus, open sources)
//   OPEN     ROOT/data/open-sources (OGL documents hosted here)
//   SOURCES  the private planningdistilled/sources checkout ($PD_SOURCES, default ROOT/../sources)
//   SITE     the planningdistilled/main-site checkout ($PD_SITE, default ROOT/../main-site)
// Data files refer to documents as `open:<path>` or `sources:<path>`; resolveRef() expands them.
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = dirname(fileURLToPath(import.meta.url));
export const DATA = join(ROOT, 'data');
export const DECISIONS = join(DATA, 'decisions');
export const GUIDANCE = join(DATA, 'guidance');
export const OPEN = join(DATA, 'open-sources');
export const SOURCES = resolve(process.env.PD_SOURCES || join(ROOT, '..', 'sources'));
export const SITE = resolve(process.env.PD_SITE || join(ROOT, '..', 'main-site'));
export const NPPF_PDF = join(OPEN, 'nppf', 'NPPF-August-2026.pdf');

export const hasSources = () => existsSync(SOURCES);

/** `open:x` -> OPEN/x, `sources:x` -> SOURCES/x; anything else is returned unchanged. */
export function resolveRef(ref) {
  if (!ref) return ref;
  if (ref.startsWith('open:')) return join(OPEN, ref.slice(5));
  if (ref.startsWith('sources:')) return join(SOURCES, ref.slice(8));
  return ref;
}
