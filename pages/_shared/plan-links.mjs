// Link the first plain mention of the local plans in each <section> (and in the footer) to the documents themselves.
// Mentions already inside a link, a quotation or a heading's anchor are left alone.

export const PLAN_LINKS = [
  { re: /\b(?:Stratford-on-Avon (?:District )?)?Core Strategy\b/, url: 'https://www.stratford.gov.uk/planning-building/core-strategy.cfm' },
  { re: /\b(?:Claverdon )?Neighbourhood Plan\b/, url: 'https://claverdon-pc.gov.uk/wp-content/uploads/2024/09/Claverdon-Neighbourhood-Plan.pdf' },
];

// Positions in `chunk` that are inside a tag, a link, a blockquote or a cite.
function blocked(chunk) {
  const spans = [];
  for (const re of [/<a\b[\s\S]*?<\/a>/g, /<blockquote\b[\s\S]*?<\/blockquote>/g, /<cite\b[\s\S]*?<\/cite>/g, /<[^>]+>/g, /<title>[\s\S]*?<\/title>/g]) {
    for (const m of chunk.matchAll(re)) spans.push([m.index, m.index + m[0].length]);
  }
  return (i, j) => spans.some(([a, b]) => i < b && j > a);
}

function linkFirst(chunk, { re, url }) {
  if (chunk.includes(url)) return chunk; // already linked in this part
  const isBlocked = blocked(chunk);
  const g = new RegExp(re.source, 'g');
  for (const m of chunk.matchAll(g)) {
    if (isBlocked(m.index, m.index + m[0].length)) continue;
    return chunk.slice(0, m.index) + `<a href="${url}">${m[0]}</a>` + chunk.slice(m.index + m[0].length);
  }
  return chunk;
}

/** Applies to text after <main> (or <body>): each <section> and the <footer> is treated separately. */
export function addPlanLinks(html, plans = PLAN_LINKS) {
  const start = Math.max(html.indexOf('<main'), 0);
  const parts = html.slice(start).split(/(?=<section\b|<footer\b)/);
  const done = parts.map((p) => plans.reduce((acc, plan) => linkFirst(acc, plan), p));
  return html.slice(0, start) + done.join('');
}
