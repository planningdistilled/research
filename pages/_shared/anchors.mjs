// Give every h2 and h3 in <main> a stable anchor and a visible "#" link, so any part of a page can be linked to.
// Existing ids are kept (sections and policy cards already carry them); headings without one get a slug of their text.

const slug = (s) => s.replace(/<span class="n">[^<]*<\/span>/g, '').replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'section';
const link = (id) => ` <a class="anchor" href="#${id}" aria-label="Link to this section">#</a>`;

export const ANCHOR_CSS = `
.anchor { margin-left: .3em; font-weight: 400; color: var(--muted); text-decoration: none; opacity: .45; }
.anchor:hover, .anchor:focus-visible { opacity: 1; color: var(--accent); }
[id] { scroll-margin-top: 12px; }
:target > h2, :target > h3, h2:target, h3:target, .policy:target, .reason:target, .policy-head:target { background: var(--accent-soft, #e3ecf4); border-radius: 4px; }
`;

export function addAnchors(html) {
  const start = html.indexOf('<main');
  if (start < 0) return html;
  const head = html.slice(0, start);
  let body = html.slice(start);
  // Headings inside a link (link cards) can't hold another link: set those blocks aside.
  const held = [];
  body = body.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, (m) => (/<h[23][\s>]/.test(m) ? `\u0000${held.push(m) - 1}\u0000` : m));
  const used = new Set([...body.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const unique = (base) => { let id = base, n = 2; while (used.has(id)) id = `${base}-${n++}`; used.add(id); return id; };

  // A heading that opens an element with an id links to that element.
  body = body.replace(/(<(section|article|div)\b[^>]*\sid="([^"]+)"[^>]*>\s*(?:<div class="policy-head">\s*)?)<(h2|h3)>([\s\S]*?)<\/\4>/g,
    (m, open, _tag, id, h, inner) => (inner.includes('class="anchor"') ? m : `${open}<${h}>${inner}${link(id)}</${h}>`));
  // Every other h2/h3 without an id gets one.
  body = body.replace(/<(h2|h3)((?:\s[^>]*)?)>([\s\S]*?)<\/\1>/g, (m, h, attrs, inner) => {
    if (inner.includes('class="anchor"')) return m;
    const has = attrs.match(/\sid="([^"]+)"/);
    if (has) return `<${h}${attrs}>${inner}${link(has[1])}</${h}>`;
    const id = unique(slug(inner));
    return `<${h}${attrs} id="${id}">${inner}${link(id)}</${h}>`;
  });
  body = body.replace(/\u0000(\d+)\u0000/g, (_, i) => held[+i]);
  return head + body;
}
