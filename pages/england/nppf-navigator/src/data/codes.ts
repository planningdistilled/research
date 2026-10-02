// Canonical NPPF 2026 policy codes. Mirrors CODE_RE in tools/pinscorpus.py,
// extended with the Annex/Transitional forms used in case frontmatter (nppf-2026-policy-codes.md).

const HEAD =
  /^(AnnexB:[a-z-]+|Annex[A-F](?:\(\d+\))?|Transitional\(\d\)|(?:S[1-6]|GB[1-8]|TR[1-8]|HE(?:10|[1-9])|HO(?:1[0-3]|[1-9])|E[1-4]|TC[1-4]|CO[12]|CC[1-9]|PM[1-9]|W[1-4]|M[1-6]|L[1-3]|DP[1-4]|HC[1-8]|P[1-6]|F[1-9]|N[1-6]|DM(?:10|[1-9]))(?:\(\d+\))?(?:\([a-z]\))?(?:\([ivx]+\))?)/;

// Known miscodings (DISTILLATION-GUIDE / policy-codes table).
const FIX: [RegExp, string][] = [
  [/^H0?7\b/, 'HO7'],
  [/^T3\b/, 'TR3'],
  [/^([A-Z]{1,2}\d{1,2})[:.](\d+)/, '$1($2)'], // HE6:4, HE6.1
  [/^AnnexB:(PDL|previously-developed-land)$/i, 'AnnexB:PDL'],
  [/^Annex ([A-F])\b/, 'Annex$1'],
];

/** Canonical code, or null when the string is not an NPPF 2026 code (e.g. a local-plan policy). */
export function canonical(raw: string): string | null {
  let s = raw.trim().replace(/\s+/g, ' ');
  for (const [re, to] of FIX) s = s.replace(re, to);
  s = s.replace(/^(\S+)\s*\(([^)]*\s[^)]*)\)$/, '$1'); // "HE6 (Grade II* church)" -> "HE6"
  if (s.startsWith('AnnexB:PDL')) return 'AnnexB:PDL';
  const m = s.match(HEAD);
  return m ? m[1] : null;
}

// Hierarchical matching lives with the engine so graph predicates and case queries agree.
export { codeMatches } from '../engine/predicate';
