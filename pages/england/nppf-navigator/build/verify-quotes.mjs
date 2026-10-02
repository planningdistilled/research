// Every quote in graph/policies.ts must appear verbatim in the NPPF text. " … " separates segments that
// must appear in order (used across footnote blocks and page breaks).
import { nppfText, normalise } from './lib.mjs';

export function verifyQuotes(quotes) {
  const src = normalise(nppfText(), { source: true });
  const failures = [];
  for (const [id, q] of Object.entries(quotes)) {
    let from = 0;
    let first = true;
    for (const seg of q.text.split(/ … | ¦ /).map((s) => normalise(s))) {
      const at = src.indexOf(seg, from);
      // Later segments must follow closely (a footnote block or a skipped limb, not another policy).
      if (at < 0 || (!first && at - from > 2500)) {
        failures.push({ id, seg, near: nearest(src, seg) });
        break;
      }
      from = at + seg.length;
      first = false;
    }
  }
  return failures;
}

// Longest prefix of the segment that does appear, to show where the mismatch starts.
function nearest(src, seg) {
  let lo = 0, hi = seg.length;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (src.includes(seg.slice(0, mid))) lo = mid;
    else hi = mid - 1;
  }
  const at = src.indexOf(seg.slice(0, lo));
  return { matched: seg.slice(0, lo).slice(-60), expected: seg.slice(lo, lo + 60), found: src.slice(at + lo, at + lo + 60) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { loadTs } = await import('./lib.mjs');
  const { quotes } = await loadTs('graph/policies.ts');
  const f = verifyQuotes(quotes);
  for (const x of f) console.log(`✗ ${x.id}\n   …${x.near.matched}⟦ expected: ${x.near.expected}\n   found:    ${x.near.found}`);
  console.log(`${Object.keys(quotes).length - f.length}/${Object.keys(quotes).length} quotes verified`);
  process.exit(f.length ? 1 : 0);
}
