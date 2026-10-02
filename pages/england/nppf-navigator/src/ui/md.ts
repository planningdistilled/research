import { h } from './h';

// Minimal Markdown for case summaries: ## headings, - bullets, paragraphs, **bold**, *em*, `code`, [text](url).
function inline(text: string): (Node | string)[] {
  const out: (Node | string)[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith('**')) out.push(h('strong', null, t.slice(2, -2)));
    else if (t.startsWith('`')) out.push(h('code', null, t.slice(1, -1)));
    else if (t.startsWith('[')) {
      const [, label, url] = t.match(/\[([^\]]+)\]\(([^)]+)\)/)!;
      out.push(/^https?:/.test(url) ? h('a', { href: url, target: '_blank', rel: 'noopener' }, label) : label);
    } else out.push(h('em', null, t.slice(1, -1)));
    last = m.index! + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function markdown(src: string): HTMLElement {
  const root = h('div', { class: 'md' });
  let list: HTMLElement | null = null;
  let para: string[] = [];
  const flush = () => {
    if (para.length) root.appendChild(h('p', null, inline(para.join(' '))));
    para = [];
  };
  for (const raw of src.split('\n')) {
    const line = raw.trimEnd();
    const head = line.match(/^(#{1,4})\s+(.*)/);
    const item = line.match(/^\s*[-*]\s+(.*)/);
    if (head) {
      flush();
      list = null;
      root.appendChild(h('h4', null, inline(head[2])));
    } else if (item) {
      flush();
      if (!list) root.appendChild((list = h('ul')));
      list.appendChild(h('li', null, inline(item[1])));
    } else if (!line.trim()) {
      flush();
      list = null;
    } else {
      list = null;
      para.push(line.trim());
    }
  }
  flush();
  return root;
}
