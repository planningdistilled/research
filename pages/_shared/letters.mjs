// Helpers for quoting Planning Inspectorate decision letters held in data/open-sources/pins-corpus/<ref>.txt.
// Letters number their paragraphs "NN. " at the start of a line, so a quotation can be located and its
// paragraph number proved rather than typed.
import fs from 'node:fs';
import path from 'node:path';
import { OPEN } from '../../paths.mjs';

const CORPUS = path.join(OPEN, 'pins-corpus');
const cache = new Map();

const norm = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/-\s*\n\s*/g, '-').replace(/\s+/g, ' ').toLowerCase().trim();

/** The raw text of a letter, or null when it is not in the corpus. */
export function letterText(ref) {
  const file = path.join(CORPUS, `${ref}.txt`);
  if (!fs.existsSync(file)) return null;
  if (!cache.has(ref)) cache.set(ref, fs.readFileSync(file, 'utf8'));
  return cache.get(ref);
}

/** Every letter reference in the corpus. */
export const corpusRefs = () => fs.readdirSync(CORPUS).filter((f) => f.endsWith('.txt')).map((f) => f.slice(0, -4));

/**
 * The number of the paragraph that contains `q` in letter `ref`, or null when the quotation is not found.
 * The search ignores case, whitespace and curly quotes, like the shared quotation checker.
 */
export function paragraphOf(ref, q) {
  const raw = letterText(ref);
  if (raw == null) throw new Error(`letter ${ref} is not in the corpus`);
  // Map each character of the normalised text back to its offset in the raw text.
  const map = [];
  let out = '';
  let pendingSpace = false;
  for (let i = 0; i < raw.length; i++) {
    let ch = raw[i];
    if (ch === '‘' || ch === '’') ch = "'";
    else if (ch === '“' || ch === '”') ch = '"';
    else if (ch === '–' || ch === '—') ch = '-';
    if (/\s/.test(ch)) { pendingSpace = out.length > 0; continue; }
    if (pendingSpace) {
      // a hyphen at a line end joins the halves of a word
      if (!(out.endsWith('-') && raw.slice(0, i).match(/-\s*\n\s*$/))) { out += ' '; map.push(i); }
      pendingSpace = false;
    }
    out += ch.toLowerCase(); map.push(i);
  }
  const n = norm(q).replace(/^[.,;:]+|[.,;:]+$/g, '');
  let at = out.indexOf(n);
  if (at < 0) {
    // Footnote markers run into words in the PDF text ("courts1"): allow up to three digits after any word.
    const re = new RegExp(n.split(' ').map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\d{0,3}').join(' '));
    const m = re.exec(out);
    if (!m) return null;
    at = m.index;
  }
  const rawAt = map[at];
  let para = null;
  for (const m of raw.matchAll(/^[ \t]{0,6}(\d{1,3})\.[ \t]/gm)) {
    if (m.index > rawAt) break;
    para = Number(m[1]);
  }
  return para;
}

/** True when the letter's text matches `re` (whitespace collapsed). */
export function letterMatches(ref, re) {
  const raw = letterText(ref);
  return raw != null && re.test(raw.replace(/\s+/g, ' '));
}
