/* NPPF 2026 Map client. Plain script, no dependencies. Data is embedded by build.mjs. */
(() => {
  'use strict';
  const D = JSON.parse(document.getElementById('data').textContent);
  const N = new Map(D.nodes.map((n) => [n.id, n]));
  const ORDER = new Map(D.nodes.map((n, i) => [n.id, i]));
  const byCode = new Map();
  for (const n of D.nodes) if (n.code) byCode.set(n.code.toUpperCase(), n.id);
  const OUT = new Map(), IN = new Map();
  for (const r of D.refs) {
    if (!OUT.has(r.from)) OUT.set(r.from, []); OUT.get(r.from).push(r);
    if (!IN.has(r.to)) IN.set(r.to, []); IN.get(r.to).push(r);
  }
  const USES = new Map(); // nodeId -> [termId]
  for (const [t, users] of Object.entries(D.termUses)) for (const u of users) { if (!USES.has(u)) USES.set(u, []); USES.get(u).push(t); }
  const KINDS = { chapter: 'Chapter', annex: 'Annex', policy: 'Policy', para: 'Paragraph', letter: 'Limb', roman: 'Sub-limb', term: 'Glossary term' };

  // ---------------------------------------------------------------- helpers
  const $ = (id) => document.getElementById(id);
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'html') el.innerHTML = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat()) if (c !== null && c !== undefined && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
    return el;
  }
  const NS = 'http://www.w3.org/2000/svg';
  function s(tag, attrs, ...kids) {
    const el = document.createElementNS(NS, tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k.startsWith('on')) el.addEventListener(k.slice(2), v); else el.setAttribute(k, String(v));
    }
    for (const c of kids.flat()) if (c !== null && c !== undefined && c !== false) el.append(typeof c === 'string' ? document.createTextNode(c) : c);
    return el;
  }
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const trunc = (t, n) => (t.length <= n ? t : t.slice(0, n).replace(/\s+\S*$/, '') + '…');
  const label = (n) => n.kind === 'chapter' || n.kind === 'annex' ? n.heading : n.kind === 'policy' ? n.title : n.kind === 'term' ? n.title : n.text;
  const short = (n) => (n.kind === 'chapter' || n.kind === 'annex') ? n.heading.replace(/^\d+\.\s*/, '') : n.kind === 'policy' ? n.title : n.kind === 'term' ? n.title : trunc(n.text, 72);
  const codeOf = (n) => n.kind === 'chapter' ? (n.heading.match(/^\d+/) ? `Ch. ${n.heading.match(/^\d+/)[0]}` : n.code) : n.kind === 'annex' ? n.heading.replace(/:.*$/, '') : n.kind === 'term' ? 'Annex B' : String(n.code).replace(/^Intro-(\d+)/, 'Intro ¶$1').replace(/^Annex([A-F])-(\d+)/, 'Annex $1 ¶$2');
  const ancestors = (id) => { const out = []; let p = N.get(id)?.parent; while (p) { out.unshift(p); p = N.get(p).parent; } return out; };
  const descendants = (id) => { const out = []; const walk = (x) => { for (const c of N.get(x).children) { out.push(c); walk(c); } }; walk(id); return out; };
  const topOf = (id) => { let n = N.get(id); while (n && !['policy', 'chapter', 'annex', 'term'].includes(n.kind)) n = N.get(n.parent); return n; };
  const containerOf = (id) => { let n = N.get(id); while (n && !['policy', 'chapter', 'annex', 'term'].includes(n.kind)) n = N.get(n.parent); return n; };
  const chapterOf = (id) => { let n = N.get(id); while (n && n.kind !== 'chapter' && n.kind !== 'annex') n = N.get(n.parent); return n; };
  const go = (id) => { location.hash = '#' + id; };
  const hashOf = (id) => '#' + id;
  const bySeq = (a, b) => (ORDER.get(a) ?? 1e9) - (ORDER.get(b) ?? 1e9);

  // ---------------------------------------------------------------- quick nav
  const ROMAN = /^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)$/;
  function resolveCode(q) {
    // Returns { id, exact, asked } or null. Accepts S5(1)(j), S5 1 j, s5-1-j, S5.1.j, GB7(1)(g)(iii).
    const m = q.trim().match(/^([A-Za-z]{1,2})\s*[-.(\s]*\s*(\d{1,2})(.*)$/);
    if (!m) return null;
    const prefix = m[1].toUpperCase();
    const toks = (m[3].match(/\d+|[A-Za-z]+/g) || []).map((t) => t.toLowerCase());
    if (!byCode.has(`${prefix}${m[2]}`)) return null;
    let id = byCode.get(`${prefix}${m[2]}`);
    const asked = [`${prefix}${m[2]}`];
    let exact = true;
    for (let i = 0; i < toks.length && i < 3; i++) {
      const t = toks[i];
      const seg = i === 0 ? (/^\d+$/.test(t) ? t : null) : i === 1 ? (/^[a-z]$/.test(t) || /^[a-z]{1,2}$/.test(t) ? t : null) : (ROMAN.test(t) ? t : null);
      if (!seg) { exact = false; break; }
      const next = `${id}-${seg}`;
      asked.push(seg);
      if (N.has(next)) id = next; else { exact = false; break; }
    }
    return { id, exact, asked: asked.join('-') };
  }
  function search(q) {
    q = q.trim();
    const out = { goto: [], refs: [], anc: [], text: [], asked: null };
    if (!q) return out;
    const lower = q.toLowerCase();
    // Chapter / annex / annex term
    const ch = q.match(/^ch(?:apter)?\s*\.?\s*(\d{1,2})$/i);
    if (ch && N.has(`ch${ch[1]}`)) out.goto.push({ id: `ch${ch[1]}` });
    const an = q.match(/^annex\s*([a-f])\b\s*(.*)$/i);
    if (an) {
      const A = `Annex${an[1].toUpperCase()}`;
      const rest = an[2].trim().toLowerCase();
      if (rest && A === 'AnnexB') {
        for (const n of D.nodes) if (n.kind === 'term' && n.title.toLowerCase().includes(rest)) out.goto.push({ id: n.id });
      } else if (rest && /^\d+$/.test(rest) && N.has(`${A}-${rest}`)) out.goto.push({ id: `${A}-${rest}` });
      else if (N.has(A)) out.goto.push({ id: A });
    }
    // Code
    const code = resolveCode(q);
    if (code) {
      out.goto.unshift({ id: code.id, note: code.exact ? null : `nearest to ${code.asked}` });
      out.asked = code.id;
      const target = code.id;
      const set = new Set([target, ...descendants(target)]);
      for (const r of D.refs) if (set.has(r.to)) out.refs.push({ id: r.from, to: r.to });
      for (const a of ancestors(target)) for (const r of IN.get(a) || []) out.anc.push({ id: r.from, to: a });
      out.refs.sort((a, b) => bySeq(a.id, b.id)); out.anc.sort((a, b) => bySeq(a.id, b.id));
    }
    // Words: glossary titles, policy titles, then text.
    if (!code && !ch && !an && lower.length >= 2) {
      for (const n of D.nodes) if (n.kind === 'term' && n.title.toLowerCase().includes(lower)) out.goto.push({ id: n.id });
      for (const n of D.nodes) if (n.kind === 'policy' && n.title.toLowerCase().includes(lower)) out.goto.push({ id: n.id });
      for (const n of D.nodes) if ((n.kind === 'chapter' || n.kind === 'annex') && n.heading.toLowerCase().includes(lower)) out.goto.push({ id: n.id });
    }
    if (lower.length >= 3) {
      const re = new RegExp(`(^|[^a-z])${lower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
      const seen = new Set([...out.goto, ...out.refs, ...out.anc].map((x) => x.id));
      for (const n of D.nodes) if (n.kind !== 'chapter' && n.kind !== 'annex' && re.test(n.text) && !seen.has(n.id)) out.text.push({ id: n.id });
    }
    return out;
  }
  const input = $('q'), results = $('q-results'), form = document.querySelector('.quicknav');
  let active = -1, rows = [];
  function row(item, via) {
    const n = N.get(item.id);
    const r = h('div', { class: 'row', role: 'option', 'aria-selected': 'false', onclick: () => { close(); go(item.id); } },
      h('span', { class: 'c' }, codeOf(n)),
      h('span', { class: 't' }, via ? h('span', { class: 'via' }, via + ' ') : null, item.note ? h('span', { class: 'via' }, `(${item.note}) `) : null, short(n)));
    rows.push(r);
    return r;
  }
  function showResults(q) {
    const res = search(q);
    results.replaceChildren(); rows = []; active = -1;
    const any = res.goto.length || res.refs.length || res.anc.length || res.text.length;
    if (!q.trim()) { results.hidden = true; input.setAttribute('aria-expanded', 'false'); return; }
    if (!any) results.append(h('p', { class: 'empty' }, `Nothing found for "${q}". Try a code such as S5(1)(j), GB7 1 g iii, Annex B settlement, or a word.`));
    if (res.goto.length) { results.append(h('h4', null, 'Go to')); for (const g of res.goto.slice(0, 12)) results.append(row(g)); }
    if (res.refs.length) {
      results.append(h('h4', null, `Referred to (${res.refs.length})`));
      for (const r of res.refs.slice(0, 40)) results.append(row(r, r.to !== res.asked ? `→ ${N.get(r.to).code}` : ''));
    }
    if (res.anc.length) {
      results.append(h('h4', null, `Refers to the policy or paragraph it sits in (${res.anc.length})`));
      for (const r of res.anc.slice(0, 40)) results.append(row(r, `→ ${N.get(r.to).code || codeOf(N.get(r.to))}`));
    }
    if (res.text.length) {
      results.append(h('h4', null, `Text containing "${q.trim()}" (${res.text.length})`));
      for (const r of res.text.slice(0, 60)) results.append(row(r));
      if (res.text.length > 60) results.append(h('p', { class: 'empty' }, `${res.text.length - 60} more not shown.`));
    }
    results.hidden = false; input.setAttribute('aria-expanded', 'true');
  }
  function close() { results.hidden = true; input.setAttribute('aria-expanded', 'false'); active = -1; }
  function setActive(i) {
    rows.forEach((r) => r.setAttribute('aria-selected', 'false'));
    active = Math.max(-1, Math.min(rows.length - 1, i));
    if (active >= 0) { rows[active].setAttribute('aria-selected', 'true'); rows[active].scrollIntoView({ block: 'nearest' }); }
  }
  input.addEventListener('input', () => showResults(input.value));
  input.addEventListener('focus', () => { if (input.value.trim()) showResults(input.value); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (results.hidden) showResults(input.value); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Escape') close();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (active >= 0 && rows[active]) { rows[active].click(); return; }
    const res = search(input.value);
    const first = res.goto[0] || res.refs[0] || res.text[0];
    if (first) { close(); go(first.id); } else showResults(input.value);
  });
  document.addEventListener('click', (e) => { if (!form.contains(e.target)) close(); });

  // ---------------------------------------------------------------- the decision route (as in the Navigator)
  const col = (i) => 16 + i * 148;
  const BOXES = [
    { id: 'site', x: 280, y: 16, w: 200, h: 44, title: 'The site and the proposal', kind: 'q', to: 'S3' },
    { id: 'gbq', x: 280, y: 88, w: 200, h: 44, title: 'In the Green Belt?', lines: ['includes washed-over villages'], kind: 'q', to: 'GB6' },
    { id: 'gb7', x: 58, y: 176, w: 200, h: 52, title: 'A GB7 category met?', lines: ['GB7(1); grey belt (g)(iii) needs TR3'], kind: 'q', to: 'GB7-1' },
    { id: 'settle', x: 380, y: 176, w: 200, h: 52, title: 'Within a settlement?', lines: ['S3; washed-over villages are not'], kind: 'q', to: 'AnnexB-settlement' },
    { id: 's5cat', x: 502, y: 252, w: 200, h: 48, title: 'An S5(1) category met?', lines: ['e.g. (c) reuse, (j) unmet need'], kind: 'q', to: 'S5-1' },
    { id: 'r-gb6', x: col(0), y: 332, w: 136, h: 48, title: 'Inappropriate', lines: ['GB6'], kind: 'route', to: 'GB6' },
    { id: 'r-s55', x: col(1), y: 332, w: 136, h: 48, title: 'Not inappropriate', lines: ['S5(5)'], kind: 'route', to: 'S5-5' },
    { id: 'r-s4', x: col(2), y: 332, w: 136, h: 48, title: 'Within settlement', lines: ['S4'], kind: 'route', to: 'S4' },
    { id: 'r-s51', x: col(3), y: 332, w: 136, h: 48, title: 'S5(1) category', lines: ['S5(1)'], kind: 'route', to: 'S5-1' },
    { id: 'r-s534', x: col(4), y: 332, w: 136, h: 48, title: 'No category', lines: ['S5(3) isolated / S5(4)'], kind: 'route', to: 'S5-4' },
    { id: 'tr3', x: 28, y: 428, w: 166, h: 72, title: 'Location (TR3)', lines: ['genuine choice of modes,', 'judged on the actual route'], kind: 'test', to: 'TR3' },
    { id: 'heritage', x: 206, y: 428, w: 166, h: 72, title: 'Heritage (HE5, HE6)', lines: ['harm weighed against public', 'benefits; result carried to balance'], kind: 'test', to: 'HE5' },
    { id: 'triggers', x: 384, y: 428, w: 166, h: 72, title: '"Should be refused"', lines: ['DP3(3) design, TR6(4), flood…', 'unless clear justification'], kind: 'test', to: 'S5-2' },
    { id: 'benefits', x: 562, y: 428, w: 166, h: 72, title: 'Benefits', lines: ['housing, economy,', 'supply position'], kind: 'test', to: 'HO7' },
    { id: 'b-vsc', x: col(0), y: 548, w: 136, h: 60, title: 'Very special', lines: ['circumstances?', 'GB6(2)'], kind: 'q', to: 'GB6-2' },
    { id: 'b-bal', x: col(1), y: 548, w: 432, h: 60, title: 'Benefits substantially outweighed by adverse effects?', lines: ['S4(1), S5(1), S5(5). A failed "should be refused" policy', 'makes this likely (S4(2)(c), S5(2)).'], kind: 'q', to: 'S4-1' },
    { id: 'b-exc', x: col(4), y: 548, w: 136, h: 60, title: 'HO11 met, or', lines: ['exceptional', 'circumstances? S5(4)'], kind: 'q', to: 'HO11' },
    { id: 'p-vsc-app', x: col(0), y: 648, w: 64, h: 28, title: 'Approve', kind: 'approve' },
    { id: 'p-vsc-ref', x: col(0) + 72, y: 648, w: 64, h: 28, title: 'Refuse', kind: 'refuse' },
    { id: 'p-bal-ref', x: 272, y: 648, w: 100, h: 28, title: 'Refuse', kind: 'refuse' },
    { id: 'p-bal-app', x: 388, y: 648, w: 100, h: 28, title: 'Approve', kind: 'approve' },
    { id: 'p-exc-app', x: col(4), y: 648, w: 64, h: 28, title: 'Approve', kind: 'approve' },
    { id: 'p-exc-ref', x: col(4) + 72, y: 648, w: 64, h: 28, title: 'Refuse', kind: 'refuse' },
  ];
  const EDGES = [
    { d: 'M380 60 V88' },
    { d: 'M380 132 V152 H158 V176', label: 'Yes', lx: 268, ly: 147 },
    { d: 'M380 132 V152 H480 V176', label: 'No', lx: 430, ly: 147 },
    { d: 'M158 228 V304 H84 V332', label: 'No', lx: 90, ly: 299, anchor: 'start' },
    { d: 'M158 228 V304 H232 V332', label: 'Yes', lx: 226, ly: 299, anchor: 'end' },
    { d: 'M430 228 V304 H380 V332', label: 'Yes', lx: 386, ly: 299, anchor: 'start' },
    { d: 'M530 228 V240 H602 V252', label: 'No or partly', lx: 612, ly: 245, anchor: 'start' },
    { d: 'M580 300 V316 H528 V332', label: 'Yes', lx: 534, ly: 312, anchor: 'end' },
    { d: 'M624 300 V316 H676 V332', label: 'No', lx: 670, ly: 312, anchor: 'start' },
    ...[84, 232, 380, 528, 676].map((x) => ({ d: `M${x} 380 V400` })),
    { d: 'M84 512 V548' }, { d: 'M380 512 V548' }, { d: 'M676 512 V548' },
    { d: 'M48 608 V648', label: 'Shown', lx: 52, ly: 634, anchor: 'start' },
    { d: 'M120 608 V648', label: 'Not', lx: 124, ly: 634, anchor: 'start' },
    { d: 'M322 608 V648', label: 'Yes', lx: 328, ly: 634, anchor: 'start' },
    { d: 'M438 608 V648', label: 'No', lx: 444, ly: 634, anchor: 'start' },
    { d: 'M640 608 V648', label: 'Yes', lx: 644, ly: 634, anchor: 'start' },
    { d: 'M712 608 V648', label: 'No', lx: 716, ly: 634, anchor: 'start' },
  ];
  function defs() {
    const mk = (id, cls) => s('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerUnits: 'userSpaceOnUse', markerWidth: 8, markerHeight: 8, orient: 'auto-start-reverse' }, s('path', { d: 'M0 0 L10 5 L0 10 z', class: cls }));
    return s('defs', {}, mk('m-head', 'head'), mk('m-head-intra', 'head intra'), mk('m-head-hot', 'head hot'));
  }
  function routeMap() {
    const svg = s('svg', { viewBox: '0 0 760 690', role: 'img', 'aria-label': 'Flow chart of the decision routes: Green Belt or not, then within a settlement or not, give five routes; every route runs the location, heritage, "should be refused" and benefits tests; each route ends in its own balance and outcome.' });
    svg.append(defs());
    svg.append(s('rect', { x: 16, y: 400, width: 728, height: 112, rx: 10, class: 'rm-band' }), s('text', { x: 28, y: 418, class: 'rm-band-label' }, 'Tested on every route (they feed the balance below)'));
    for (const e of EDGES) {
      svg.append(s('path', { d: e.d, class: 'edge', 'marker-end': 'url(#m-head)' }));
      if (e.label) svg.append(s('text', { x: e.lx, y: e.ly, 'text-anchor': e.anchor || 'middle', class: 'elabel' }, e.label));
    }
    for (const b of BOXES) {
      const link = b.to && N.has(b.to);
      const g = s('g', { class: `rm-box k-${b.kind}${link ? ' link' : ''}`, tabindex: link ? 0 : null, role: link ? 'link' : null, 'aria-label': link ? `${b.title}: open ${N.get(b.to).code || b.to}` : null });
      if (link) { g.addEventListener('click', () => go(b.to)); g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(b.to); } }); }
      g.append(s('rect', { x: b.x, y: b.y, width: b.w, height: b.h, rx: b.kind === 'approve' || b.kind === 'refuse' ? 14 : 6 }));
      const lines = b.lines || [], lh = 14, top = b.y + b.h / 2 - (lines.length * lh) / 2 + 4;
      g.append(s('text', { x: b.x + b.w / 2, y: lines.length ? top : b.y + b.h / 2 + 4.5, 'text-anchor': 'middle', class: 'rm-title' }, b.title));
      lines.forEach((l, i) => g.append(s('text', { x: b.x + b.w / 2, y: top + (i + 1) * lh, 'text-anchor': 'middle', class: 'rm-sub' }, l)));
      svg.append(g);
    }
    return svg;
  }

  // ---------------------------------------------------------------- generic node box
  function nodeBox(n, x, y, w, hgt, opts = {}) {
    const cls = ['nd', n.kind, opts.ghost ? 'ghost' : '', opts.sel ? 'sel' : '', n.flags?.includes('refuse') ? 'flag-refuse' : '', opts.link !== false ? 'link' : ''].filter(Boolean).join(' ');
    const g = s('g', { class: cls, 'data-id': n.id, tabindex: 0, role: 'link', 'aria-label': `${codeOf(n)}: ${short(n)}` });
    g.addEventListener('click', () => go(n.id));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(n.id); } });
    g.append(s('rect', { x, y, width: w, height: hgt, rx: 6 }));
    const code = codeOf(n), avail = Math.floor((w - 16) / 6.1);
    if (hgt >= 34) {
      g.append(s('text', { x: x + 8, y: y + 14, class: 'c' }, code));
      g.append(s('text', { x: x + 8, y: y + 28, class: 't' }, trunc(short(n), avail)));
      if (hgt >= 48) g.append(s('text', { x: x + 8, y: y + 41, class: 't2' }, trunc(n.kind === 'policy' ? trunc(n.children.map((c) => N.get(c).code).join(' '), 40) : '', avail)));
    } else {
      g.append(s('text', { x: x + 8, y: y + 15, class: 'c' }, code + ' '), s('text', { x: x + 8 + code.length * 7 + 6, y: y + 15, class: 't' }, trunc(short(n), avail - code.length - 1)));
    }
    return g;
  }
  const bez = (x1, y1, x2, y2) => `M${x1} ${y1} C${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;
  // Generated graphs draw at their natural size and scroll sideways, so labels stay legible.
  const natural = (svg, width, height) => { svg.setAttribute('width', width); svg.setAttribute('height', height); svg.setAttribute('class', 'natural'); return svg; };

  // ---------------------------------------------------------------- chapter graph (hub layout)
  function chapterGraph(ch, sel) {
    const centre = ch.children.map((c) => N.get(c)).filter((n) => n.kind !== 'term');
    const centreIds = new Set(centre.map((n) => n.id));
    const aggOut = new Map(), aggIn = new Map(), intra = [];
    for (const c of centre) {
      const own = [c.id, ...descendants(c.id)];
      for (const id of own) for (const r of OUT.get(id) || []) {
        const t = topOf(r.to) || N.get(r.to); if (!t) continue;
        if (centreIds.has(t.id)) { if (t.id !== c.id && !intra.some((e) => e.a === c.id && e.b === t.id)) intra.push({ a: c.id, b: t.id }); }
        else { if (!aggOut.has(c.id)) aggOut.set(c.id, new Set()); aggOut.get(c.id).add(t.id); }
      }
      for (const id of own) for (const r of IN.get(id) || []) {
        const f = topOf(r.from) || N.get(r.from); if (!f) continue;
        if (!centreIds.has(f.id)) { if (!aggIn.has(c.id)) aggIn.set(c.id, new Set()); aggIn.get(c.id).add(f.id); }
      }
    }
    const inGhosts = [...new Set([...aggIn.values()].flatMap((x) => [...x]))].sort(bySeq);
    const outGhosts = [...new Set([...aggOut.values()].flatMap((x) => [...x]))].sort(bySeq);
    const W = 208, GW = 156, H = 48, GH = 34, gap = 14, ggap = 8;
    const rowsC = centre.length, rowsL = inGhosts.length, rowsR = outGhosts.length;
    const height = Math.max(rowsC * (H + gap), rowsL * (GH + ggap), rowsR * (GH + ggap), 120) + 60;
    const xL = 16, xC = xL + GW + 84, xR = xC + W + 84, width = xR + GW + 16;
    const svg = natural(s('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': `${ch.heading}: its policies, the policies they refer to, and the policies that refer to them.` }), width, height);
    svg.append(defs());
    const yC = (i) => 40 + i * (H + gap) + Math.max(0, (height - 60 - rowsC * (H + gap)) / 2);
    const yL = (i) => 40 + i * (GH + ggap) + Math.max(0, (height - 60 - rowsL * (GH + ggap)) / 2);
    const yR = (i) => 40 + i * (GH + ggap) + Math.max(0, (height - 60 - rowsR * (GH + ggap)) / 2);
    const posC = new Map(centre.map((n, i) => [n.id, yC(i)])), posL = new Map(inGhosts.map((id, i) => [id, yL(i)])), posR = new Map(outGhosts.map((id, i) => [id, yR(i)]));
    svg.append(s('text', { x: xL, y: 22, class: 'col-label' }, rowsL ? 'Referred to from' : ''), s('text', { x: xC, y: 22, class: 'col-label' }, `${ch.kind === 'annex' ? 'Paragraphs' : 'Policies'} in ${ch.kind === 'annex' ? ch.heading.replace(/:.*$/, '') : 'chapter ' + ch.heading.match(/^\d+/)[0]}`), s('text', { x: xR, y: 22, class: 'col-label' }, rowsR ? 'Refers to' : ''));
    const edges = [];
    for (const [c, set] of aggIn) for (const f of set) edges.push({ path: s('path', { d: bez(xL + GW, posL.get(f) + GH / 2, xC, posC.get(c) + H / 2), class: 'edge', 'marker-end': 'url(#m-head)' }), ends: [f, c] });
    for (const [c, set] of aggOut) for (const t of set) edges.push({ path: s('path', { d: bez(xC + W, posC.get(c) + H / 2, xR, posR.get(t) + GH / 2), class: 'edge', 'marker-end': 'url(#m-head)' }), ends: [c, t] });
    for (const e of intra) {
      const y1 = posC.get(e.a) + H / 2 - 6, y2 = posC.get(e.b) + H / 2 + 6, bulge = 44 + Math.min(40, Math.abs(y2 - y1) / 8);
      edges.push({ path: s('path', { d: `M${xC + W} ${y1} C${xC + W + bulge} ${y1}, ${xC + W + bulge} ${y2}, ${xC + W} ${y2}`, class: 'edge intra', 'marker-end': 'url(#m-head-intra)' }), ends: [e.a, e.b] });
    }
    for (const e of edges) svg.append(e.path);
    const boxes = [];
    inGhosts.forEach((id) => boxes.push(nodeBox(N.get(id), xL, posL.get(id), GW, GH, { ghost: true })));
    centre.forEach((n) => boxes.push(nodeBox(n, xC, posC.get(n.id), W, H, { sel: n.id === sel })));
    outGhosts.forEach((id) => boxes.push(nodeBox(N.get(id), xR, posR.get(id), GW, GH, { ghost: true })));
    for (const b of boxes) {
      svg.append(b);
      const id = b.getAttribute('data-id');
      b.addEventListener('mouseenter', () => edges.forEach((e) => e.path.classList.toggle('hot', e.ends.includes(id)) || e.path.classList.toggle('dim', !e.ends.includes(id))));
      b.addEventListener('mouseleave', () => edges.forEach((e) => { e.path.classList.remove('hot'); e.path.classList.remove('dim'); }));
    }
    return { svg, counts: { intra: intra.length, out: outGhosts.length, in: inGhosts.length } };
  }

  // ---------------------------------------------------------------- policy / annex tree
  function treeGraph(root, sel) {
    const W = 200, H = 36, X0 = 16, DX = 222, ROW = 42;
    // Incoming references (to the root or any descendant) are counted here and listed in the text column and the
    // chapter graph below; the tree itself only shows what this policy refers to, so it starts at the left edge.
    const all = [root.id, ...descendants(root.id)];
    const inSet = new Set();
    for (const id of all) for (const r of IN.get(id) || []) { const f = topOf(r.from) || N.get(r.from); if (f && f.id !== root.id) inSet.add(f.id); }
    const inGhosts = [];
    const GW = 164, GH = 34;
    const xTree = X0;
    // Layout the tree.
    let row = 0, maxDepth = 0;
    const pos = new Map();
    const place = (id, depth) => {
      const n = N.get(id);
      maxDepth = Math.max(maxDepth, depth);
      const kids = n.children.filter((c) => N.get(c).kind !== 'term');
      if (!kids.length) { pos.set(id, { x: xTree + depth * DX, y: 30 + row * ROW, depth }); row++; return; }
      for (const k of kids) place(k, depth + 1);
      const ys = kids.map((k) => pos.get(k).y);
      pos.set(id, { x: xTree + depth * DX, y: (Math.min(...ys) + Math.max(...ys)) / 2, depth });
    };
    place(root.id, 0);
    // Outgoing ghosts, one column past the deepest node, placed beside the referring node where possible.
    const outs = [];
    for (const id of all) for (const r of OUT.get(id) || []) if (!all.includes(r.to)) outs.push({ from: id, to: r.to });
    const xOut = xTree + (maxDepth + 1) * DX;
    const outPos = new Map();
    const used = [];
    for (const o of outs.sort((a, b) => pos.get(a.from).y - pos.get(b.from).y)) {
      if (outPos.has(o.to)) continue;
      let y = pos.get(o.from).y;
      while (used.some((u) => Math.abs(u - y) < GH + 6)) y += GH + 6;
      used.push(y); outPos.set(o.to, y);
    }
    const height = Math.max(30 + row * ROW, ...[...outPos.values()].map((y) => y + GH + 16), 140);
    const width = xOut + (outPos.size ? GW : 0) + 16;
    const svg = natural(s('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': `${root.code || root.heading}: its paragraphs and limbs as a tree, with the policies it refers to and the policies that refer to it.` }), width, height);
    svg.append(defs());
    const edges = [];
    for (const [id, p] of pos) {
      const n = N.get(id);
      if (n.parent && pos.has(n.parent)) {
        const pp = pos.get(n.parent);
        edges.push({ path: s('path', { d: bez(pp.x + W, pp.y, p.x, p.y), class: 'edge intra' }), ends: [id, n.parent] });
      }
    }
    for (const o of outs) edges.push({ path: s('path', { d: bez(pos.get(o.from).x + W, pos.get(o.from).y + 4, xOut, outPos.get(o.to) + GH / 2), class: 'edge', 'marker-end': 'url(#m-head)' }), ends: [o.from, o.to] });
    const yIn = (i) => 30 + i * (GH + 8) + Math.max(0, (height - 40 - inGhosts.length * (GH + 8)) / 2);
    inGhosts.forEach((id, i) => edges.push({ path: s('path', { d: bez(X0 + GW, yIn(i) + GH / 2, xTree, pos.get(root.id).y), class: 'edge', 'marker-end': 'url(#m-head)' }), ends: [id, root.id] }));
    for (const e of edges) svg.append(e.path);
    if (inGhosts.length) svg.append(s('text', { x: X0, y: 16, class: 'col-label' }, 'Referred to from'));
    if (outPos.size) svg.append(s('text', { x: xOut, y: 16, class: 'col-label' }, 'Refers to'));
    const boxes = [];
    for (const [id, p] of pos) boxes.push(nodeBox(N.get(id), p.x, p.y - H / 2, W, H, { sel: id === sel }));
    for (const [to, y] of outPos) boxes.push(nodeBox(N.get(to), xOut, y, GW, GH, { ghost: true }));
    inGhosts.forEach((id, i) => boxes.push(nodeBox(N.get(id), X0, yIn(i), GW, GH, { ghost: true })));
    for (const b of boxes) {
      svg.append(b);
      const id = b.getAttribute('data-id');
      b.addEventListener('mouseenter', () => edges.forEach((e) => { const on = e.ends.includes(id); e.path.classList.toggle('hot', on && e.path.classList.contains('edge') && !e.path.classList.contains('intra')); e.path.classList.toggle('dim', !on); }));
      b.addEventListener('mouseleave', () => edges.forEach((e) => { e.path.classList.remove('hot'); e.path.classList.remove('dim'); }));
    }
    return { svg, counts: { nodes: pos.size, out: outPos.size, in: inSet.size } };
  }
  // Scroll a graph sideways so the selected box is in view.
  function revealSelected(wrap) {
    const sel = wrap.querySelector('.nd.sel rect');
    if (!sel) return;
    const x = +sel.getAttribute('x');
    if (x + 40 > wrap.clientWidth) wrap.scrollLeft = Math.max(0, x - 60);
  }

  // ---------------------------------------------------------------- glossary term: where it is used
  function termGraph(term) {
    const users = (D.termUses[term.id] || []).slice();
    const byTop = new Map();
    for (const u of users) { const t = topOf(u); if (!t) continue; if (!byTop.has(t.id)) byTop.set(t.id, []); byTop.get(t.id).push(u); }
    const tops = [...byTop.keys()].sort(bySeq);
    const GW = 190, GH = 34, W = 240, H = 48, X0 = 16;
    const cols = tops.length > 14 ? 2 : 1, perCol = Math.ceil(tops.length / cols);
    const height = Math.max(perCol * (GH + 8) + 40, 160);
    const xT = X0, xG = X0 + W + 110, width = xG + cols * (GW + 24) + 8;
    const svg = natural(s('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': `Where the Framework uses the term "${term.title}".` }), width, height);
    svg.append(defs());
    const yT = height / 2 - H / 2;
    svg.append(s('text', { x: xG, y: 16, class: 'col-label' }, tops.length ? `Used in (${users.length} places)` : 'Not used by name outside the glossary'));
    tops.forEach((id, i) => {
      const c = Math.floor(i / perCol), r = i % perCol, x = xG + c * (GW + 24), y = 30 + r * (GH + 8);
      svg.append(s('path', { d: bez(xT + W, yT + H / 2, x, y + GH / 2), class: 'edge', 'marker-end': 'url(#m-head)' }));
      svg.append(nodeBox(N.get(id), x, y, GW, GH, { ghost: true }));
    });
    svg.append(nodeBox(term, xT, yT, W, H, { sel: true, link: false }));
    return { svg, counts: { tops: tops.length, uses: users.length } };
  }

  // ---------------------------------------------------------------- the text column
  const FORM = {
    page: /^<!-- p\.(\d+) -->$/, chapter: /^## <a id="([^"]+)"><\/a>(.*)$/, group: /^### (.*)$/, policy: /^#### <a id="([A-Z]+\d+)"><\/a>([A-Z]+\d+): (.*)$/,
    objective: /^> (.*)$/, para: /^(\d+)\. <a id="([^"]+)"><\/a>(.*)$/, letter: /^ {3}([a-z]+)\. <a id="([^"]+)"><\/a>(.*)$/, roman: /^ {6}([ivx]+)\. <a id="([^"]+)"><\/a>(.*)$/,
    bullet: /^\s*[-•] (.*)$/, table: /^\|(.*)\|\s*$/, term: /^<a id="(AnnexB-[^"]+)"><\/a>\*\*([^*]+?):?\*\*:? ?(.*)$/, bold: /^\*\*([^*]+)\*\*$/,
  };
  const inlineHtml = (t, fns) => esc(t.replace(/<a id="[^"]*"><\/a>/g, '')).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[\^(\d+)\]/g, (_, n) => { fns.add(n); return `<sup><a href="#fn-${n}" title="${esc(D.footnotes[n] || '')}">${n}</a></sup>`; });
  function rangeOf(c) {
    // Body line range [start, end) rendered for a container node.
    const start = c.line;
    let end = D.body.length;
    for (let i = start + 1; i < D.body.length; i++) {
      const l = D.body[i];
      if (c.kind === 'policy' && (FORM.policy.test(l) || FORM.group.test(l) || FORM.chapter.test(l))) { end = i; break; }
      if ((c.kind === 'chapter' || c.kind === 'annex') && FORM.chapter.test(l)) { end = i; break; }
      if (c.kind === 'term' && (FORM.term.test(l) || FORM.chapter.test(l) || FORM.page.test(l))) { end = i; break; }
    }
    return [start, end];
  }
  function renderLines(start, end, sel, ancSet) {
    const out = [], fns = new Set();
    let table = null, listOpen = false;
    const closeList = () => { if (listOpen) { out.push('</ul>'); listOpen = false; } };
    const closeTable = () => { if (table) { out.push(table.join('') + '</table>'); table = null; } };
    for (let i = start; i < end; i++) {
      const l = D.body[i];
      let m;
      if (/^\s*$/.test(l)) continue;
      if ((m = l.match(FORM.page))) { closeList(); closeTable(); out.push(`<span class="pg">p. ${m[1]}</span>`); continue; }
      if ((m = l.match(FORM.table))) {
        closeList();
        const cells = m[1].split('|').map((c) => c.trim());
        if (cells.every((c) => /^-+$/.test(c))) continue;
        if (!table) { table = ['<table>', `<tr>${cells.map((c) => `<th>${inlineHtml(c, fns)}</th>`).join('')}</tr>`]; }
        else table.push(`<tr>${cells.map((c) => `<td>${inlineHtml(c, fns)}</td>`).join('')}</tr>`);
        continue;
      }
      closeTable();
      if ((m = l.match(FORM.chapter))) { closeList(); if (i !== start) out.push(`<h3 id="t-${esc(m[1])}">${inlineHtml(m[2], fns)}</h3>`); continue; }
      if ((m = l.match(FORM.policy))) { closeList(); out.push(`<h3 id="t-${esc(m[1])}" class="${sel === m[1] ? 'sel' : ''}"><span class="c">${esc(m[2])}</span>${inlineHtml(m[3], fns)}</h3>`); continue; }
      if ((m = l.match(FORM.group))) { closeList(); out.push(`<h4>${inlineHtml(m[1], fns)}</h4>`); continue; }
      if ((m = l.match(FORM.objective))) { closeList(); out.push(`<p class="obj">${inlineHtml(m[1], fns)}</p>`); continue; }
      if ((m = l.match(FORM.term))) { closeList(); out.push(`<p class="term${sel === m[1] ? ' sel' : ''}" id="t-${esc(m[1])}"><b>${inlineHtml(m[2].replace(/:$/, ''), fns)}:</b> ${inlineHtml(m[3], fns)}</p>`); continue; }
      const item = l.match(FORM.para) ? [0, ...l.match(FORM.para).slice(1)] : l.match(FORM.letter) ? [1, ...l.match(FORM.letter).slice(1)] : l.match(FORM.roman) ? [2, ...l.match(FORM.roman).slice(1)] : null;
      if (item) {
        closeList();
        const [d, marker, anchor, text] = item;
        const cls = ['it', `d${d}`, sel === anchor ? 'sel' : ancSet.has(anchor) ? 'sel-anc' : ''].filter(Boolean).join(' ');
        out.push(`<div class="${cls}" id="t-${esc(anchor)}"><span class="m"><a href="#${esc(anchor)}" title="Open ${esc(N.get(anchor)?.code || anchor)}">${esc(marker)}.</a></span><span>${inlineHtml(text, fns)}</span></div>`);
        continue;
      }
      if ((m = l.match(FORM.bullet))) { if (!listOpen) { out.push('<ul class="bul">'); listOpen = true; } out.push(`<li>${inlineHtml(m[1], fns)}</li>`); continue; }
      closeList();
      if ((m = l.match(FORM.bold))) { out.push(`<h4>${inlineHtml(m[1], fns)}</h4>`); continue; }
      out.push(`<p class="plain">${inlineHtml(l.trim(), fns)}</p>`);
    }
    closeList(); closeTable();
    const fnList = [...fns].sort((a, b) => a - b);
    if (fnList.length) out.push(`<ol class="fns" start="${fnList[0]}">${fnList.map((n, i) => `<li id="fn-${n}" value="${n}">${esc(D.footnotes[n] || '')}</li>`).join('')}</ol>`);
    return out.join('\n');
  }
  function xrefList(title, items, fmt) {
    if (!items.length) return null;
    const ul = h('ul');
    const show = items.slice(0, 30);
    for (const it of show) ul.append(fmt(it));
    const sec = h('div', { class: 'xref' }, h('h3', null, `${title} (${items.length})`), ul);
    if (items.length > show.length) sec.append(h('p', { class: 'more fine' }, `${items.length - show.length} more; use the quick-nav box for the full list.`));
    return sec;
  }
  const refRow = (fromId, toId, viaLabel) => {
    const n = N.get(fromId);
    return h('li', null, h('a', { class: 'c', href: hashOf(fromId) }, codeOf(n)), h('span', { class: 'snip' }, viaLabel ? h('span', { class: 'via' }, viaLabel + ' ') : null, short(n)));
  };
  function renderText(sel) {
    const text = $('text');
    text.replaceChildren();
    const n = N.get(sel);
    const container = containerOf(sel);
    const chapter = chapterOf(sel);
    const anc = new Set(ancestors(sel));
    const where = h('p', { class: 'where' }, h('span', null, KINDS[n.kind]), n.page ? h('span', null, `printed page ${n.page}`) : null, chapter && chapter.id !== n.id ? h('a', { href: hashOf(chapter.id) }, chapter.heading) : null);
    const head = h('h2', { class: 'ct' }, n.kind === 'policy' || n.kind === 'para' || n.kind === 'letter' || n.kind === 'roman' ? h('span', { class: 'c' }, n.code) : null, n.kind === 'chapter' || n.kind === 'annex' ? n.heading : n.kind === 'policy' || n.kind === 'term' ? n.title : (container?.title || container?.heading || ''));
    text.append(where, head);
    if (n.flags?.length) text.append(h('div', { class: 'flags' }, n.flags.map((f) => h('span', { class: `flag ${f}` }, f === 'refuse' ? '"should be refused" wording' : f === 'balance' ? '"substantially outweigh" balance' : 'very special circumstances'))));
    const [start, end] = rangeOf(container);
    const fw = h('div', { class: 'fw', html: renderLines(start, end, sel, anc) });
    text.append(fw);
    // Cross-references for the selection (and its descendants).
    const own = [sel, ...descendants(sel)];
    const outs = own.flatMap((id) => (OUT.get(id) || []).map((r) => ({ from: id, to: r.to }))).filter((r, i, a) => a.findIndex((x) => x.to === r.to) === i).sort((a, b) => bySeq(a.to, b.to));
    const ins = own.flatMap((id) => (IN.get(id) || []).map((r) => ({ from: r.from, to: id }))).filter((r, i, a) => a.findIndex((x) => x.from === r.from) === i).sort((a, b) => bySeq(a.from, b.from));
    const ancRefs = ancestors(sel).flatMap((a) => (IN.get(a) || []).map((r) => ({ from: r.from, to: a }))).sort((a, b) => bySeq(a.from, b.from));
    const uses = [...new Set(own.flatMap((id) => USES.get(id) || []))].sort(bySeq);
    const refsTo = xrefList('Refers to', outs, (r) => refRow(r.to, r.from, own.length > 1 && r.from !== sel ? `from ${N.get(r.from).code}:` : ''));
    const refdBy = xrefList('Referred to by', ins, (r) => refRow(r.from, r.to, r.to !== sel ? `→ ${N.get(r.to).code}:` : ''));
    const ancBy = n.kind === 'para' || n.kind === 'letter' || n.kind === 'roman' ? xrefList('Refers to the policy or paragraph this sits in', ancRefs, (r) => refRow(r.from, r.to, `→ ${N.get(r.to).code}:`)) : null;
    const usesL = xrefList('Glossary terms used here', uses, (t) => h('li', null, h('a', { class: 'c', href: hashOf(t) }, 'Annex B'), h('span', { class: 'snip' }, N.get(t).title)));
    const usedIn = n.kind === 'term' ? xrefList('Used in', (D.termUses[n.id] || []).slice().sort(bySeq), (id) => refRow(id, n.id, '')) : null;
    for (const x of [refsTo, refdBy, ancBy, usedIn, usesL]) if (x) text.append(x);
    text.append(h('p', { class: 'links' },
      h('a', { href: `${D.links.md}#${encodeURIComponent(n.id)}`, target: '_blank', rel: 'noopener' }, 'This passage in the Markdown edition'),
      n.page ? h('a', { href: `${D.links.pdf}#page=${n.page + D.pdfOffset}`, target: '_blank', rel: 'noopener' }, `PDF page ${n.page + D.pdfOffset}`) : null,
      h('a', { href: D.links.govuk, target: '_blank', rel: 'noopener' }, 'GOV.UK')));
    // Scroll the selection into view inside the column.
    const target = fw.querySelector(`#t-${CSS.escape(sel)}`);
    if (target) {
      const colEl = $('text-col');
      const top = target.getBoundingClientRect().top - fw.getBoundingClientRect().top;
      colEl.scrollTo({ top: Math.max(0, top + fw.offsetTop - 80), behavior: 'auto' });
    } else $('text-col').scrollTo({ top: 0 });
  }

  // ---------------------------------------------------------------- views
  function crumbs(ids) {
    const ol = $('crumbs');
    ol.replaceChildren();
    const items = [{ id: 'overview', label: 'Overview' }, ...ids.map((id) => { const n = N.get(id); return { id, label: n.kind === 'term' ? n.title : n.kind === 'chapter' || n.kind === 'annex' ? n.heading : codeOf(n) }; })];
    items.forEach((it, i) => ol.append(h('li', null, i === items.length - 1 ? h('span', { class: 'here' }, it.label) : h('a', { href: hashOf(it.id) }, it.label))));
  }
  function overview(message) {
    const g = $('graph'); g.replaceChildren();
    crumbs([]);
    if (message) g.append(h('p', { class: 'notice' }, message));
    const fig = h('figure', { class: 'card' }, h('h2', null, 'The decision route'), h('p', { class: 'sub' }, 'How a development proposal is routed through the Framework\'s decision-making policies. Click any box to open the policy behind it.'),
      h('div', { class: 'svgwrap' }, routeMap()),
      h('figcaption', null, 'Two questions, Green Belt or not and within a settlement or not, give five routes. Every route runs the same tests and ends in its own balance. The same diagram, with your own answers highlighted, is in the ', h('a', { href: D.links.navigator }, 'NPPF 2026 Navigator'), '.'));
    g.append(fig);
    const grid = h('section', { class: 'card' }, h('h2', null, 'The whole Framework'), h('p', { class: 'sub' }, `20 chapters and 6 annexes. Open a chapter to see its policies and their cross-references as a graph; open a policy to see its paragraphs and limbs as a tree. Chips outlined in red contain "should be refused" wording.`));
    const groups = h('div', { class: 'groups' });
    for (const grp of D.groups) {
      const sec = h('div', { class: 'group' }, grp.title ? h('h3', null, grp.title) : null);
      const cards = h('div', { class: 'chapters' });
      for (const pid of grp.parts) {
        const ch = N.get(pid); if (!ch) continue;
        const pols = ch.children.map((c) => N.get(c)).filter((c) => c.kind === 'policy');
        const card = h('a', { class: 'chap', href: hashOf(ch.id) }, h('span', { class: 'n' }, ch.kind === 'annex' ? ch.heading.replace(/:.*$/, '') : `Chapter ${ch.heading.match(/^\d+/)[0]}`), h('span', { class: 'ttl' }, ch.heading.replace(/^\d+\.\s*/, '').replace(/^Annex [A-F]:\s*/, '')));
        if (pols.length) {
          const chips = h('div', { class: 'chips' });
          for (const p of pols) chips.append(h('a', { class: `chip${[p.id, ...descendants(p.id)].some((d) => N.get(d).flags?.includes('refuse')) ? ' refuse' : ''}`, href: hashOf(p.id), title: p.title, onclick: (e) => { e.stopPropagation(); } }, p.code));
          card.append(chips);
        } else if (ch.kind === 'annex') card.append(h('span', { class: 'fine' }, ch.id === 'AnnexB' ? `${ch.children.length} defined terms` : `${ch.children.length} paragraphs`));
        else card.append(h('span', { class: 'fine' }, `${ch.children.length} paragraphs`));
        cards.append(card);
      }
      sec.append(cards); groups.append(sec);
    }
    grid.append(groups);
    g.append(grid);
    // Text column: the Framework's own Introduction.
    if (N.has('ch1')) renderText('ch1');
  }
  function chapterView(ch) {
    const g = $('graph'); g.replaceChildren();
    crumbs([ch.id]);
    const pols = ch.children.map((c) => N.get(c));
    if (ch.id === 'AnnexB') {
      const card = h('section', { class: 'card' }, h('h2', null, ch.heading), h('p', { class: 'sub' }, `${pols.length} defined terms. Open a term to see where the Framework uses it.`));
      const chips = h('div', { class: 'chips' });
      for (const t of pols) chips.append(h('a', { class: 'chip', href: hashOf(t.id) }, t.title));
      card.append(chips); g.append(card);
    } else if (!pols.length) {
      const ins = (IN.get(ch.id) || []).length;
      g.append(h('section', { class: 'card' }, h('h2', null, ch.heading), h('p', { class: 'sub' }, `This annex is a table with notes rather than numbered paragraphs, so it has no tree. Read it in the column to the right. ${ins ? `${ins} ${ins === 1 ? 'place refers' : 'places refer'} to it; see "Referred to by" below the text.` : ''}`)));
    } else {
      const { svg, counts } = chapterGraph(ch, null);
      g.append(h('figure', { class: 'card' }, h('h2', null, ch.heading), h('p', { class: 'sub' }, `${pols.length} ${ch.kind === 'annex' ? 'paragraphs' : 'policies'}; ${counts.intra} cross-references within the ${ch.kind === 'annex' ? 'annex' : 'chapter'}, ${counts.out} ${ch.kind === 'annex' ? 'policies or annexes' : 'policies or annexes'} referred to, ${counts.in} referring in. Click a box to open it; hover to trace its references.`),
        h('div', { class: 'svgwrap' }, svg),
        h('div', { class: 'legend' }, h('span', { class: 'l-policy' }, 'policy'), h('span', { class: 'l-ghost' }, 'elsewhere in the Framework'), h('span', { class: 'l-refuse' }, 'contains "should be refused"'))));
    }
    renderText(ch.id);
  }
  function policyView(root, sel) {
    const g = $('graph'); g.replaceChildren();
    const ch = chapterOf(sel);
    crumbs([ch.id, ...(root.id !== ch.id ? [root.id] : []), ...(sel !== root.id ? [sel] : [])]);
    const { svg, counts } = treeGraph(root, sel);
    const n = N.get(sel);
    const wrap = h('div', { class: 'svgwrap' }, svg);
    g.append(h('figure', { class: 'card' }, h('h2', null, h('span', { class: 'code' }, root.code || ''), ' ', root.title || root.heading), h('p', { class: 'sub' }, `${counts.nodes - 1} paragraphs and limbs; refers to ${counts.out} other ${counts.out === 1 ? 'place' : 'places'}; referred to from ${counts.in} (listed under the text, and in the chapter graph below). ${sel !== root.id ? `${n.code} is highlighted; its text is marked in the column to the right.` : 'Click a paragraph or limb to highlight it and read it in the column to the right.'}`),
      wrap,
      h('div', { class: 'legend' }, h('span', { class: 'l-sel' }, 'selected'), h('span', { class: 'l-ghost' }, 'elsewhere in the Framework'), h('span', { class: 'l-refuse' }, 'contains "should be refused"'))));
    revealSelected(wrap);
    // Sub-graph: the chapter this policy sits in, with the policy highlighted.
    if (ch && ch.id !== root.id && ch.id !== 'AnnexB') {
      const cg = chapterGraph(ch, root.id);
      g.append(h('figure', { class: 'card' }, h('h2', null, h('a', { href: hashOf(ch.id) }, ch.heading)), h('p', { class: 'sub' }, `Where ${root.code} sits among the chapter's policies and their cross-references.`), h('div', { class: 'svgwrap' }, cg.svg)));
    }
    renderText(sel);
  }
  function termView(t) {
    const g = $('graph'); g.replaceChildren();
    crumbs(['AnnexB', t.id]);
    const { svg, counts } = termGraph(t);
    g.append(h('figure', { class: 'card' }, h('h2', null, t.title), h('p', { class: 'sub' }, counts.uses ? `Used by name in ${counts.uses} ${counts.uses === 1 ? 'place' : 'places'} across ${counts.tops} ${counts.tops === 1 ? 'policy or annex' : 'policies and annexes'}. Whole-word matches of the term as written; the Framework also uses some terms in other forms.` : 'The glossary defines this term, but the Framework does not use it by name elsewhere (whole-word match of the term as written).'),
      h('div', { class: 'svgwrap' }, svg)));
    renderText(t.id);
  }
  function route() {
    const id = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (!id || id === 'overview') return overview();
    const n = N.get(id);
    if (!n) return overview(`Nothing in the Framework is anchored at "${id}". Use the quick-nav box above.`);
    if (n.kind === 'chapter' || n.kind === 'annex') return chapterView(n);
    if (n.kind === 'term') return termView(n);
    const root = containerOf(id);
    if (root.kind === 'chapter' || root.kind === 'annex') {
      // Introduction paragraphs and annex paragraphs: tree of the chapter/annex with the selection highlighted.
      const g = $('graph'); g.replaceChildren();
      crumbs([root.id, id]);
      const { svg } = treeGraph(root, id);
      const wrap = h('div', { class: 'svgwrap' }, svg);
      g.append(h('figure', { class: 'card' }, h('h2', null, root.heading), h('p', { class: 'sub' }, `${codeOf(n)} is highlighted; its text is marked in the column to the right.`), wrap));
      revealSelected(wrap);
      renderText(id);
      return;
    }
    policyView(root, id);
  }
  window.addEventListener('hashchange', route);
  route();
  // ?q=S5(1)(j) pre-fills the quick-nav box and shows its results (shareable, and testable without a browser session).
  const preset = new URLSearchParams(location.search).get('q');
  if (preset) { input.value = preset; showResults(preset); }
})();
