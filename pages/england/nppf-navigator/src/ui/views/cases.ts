import { h } from '../h';
import { markdown } from '../md';
import { findCases, type CaseIdx, type Match } from '../../data/match';
import { caseBody, caseNotes, type Manifest } from '../../data/shards';
import type { CaseQuery, Facts } from '../../engine/types';

const DM: Record<string, string> = { I: 'Inspector', SoS: 'Secretary of State', C: 'Council committee', D: 'Council delegated', Ct: 'Court' };
const FW: Record<string, string> = { '24t': 'applied the 2024 Framework (transitional)', nc: 'Framework not cited' };
const PERMITTED = new Set(['allowed', 'approved', 'part-allowed', 'split']);
const SHOW = 4;

function fmtDate(d: string) {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function caseRow(m: Manifest, match: Match): HTMLElement {
  const c: CaseIdx = match.c;
  const [code, finding, weight] = c.f[match.row];
  const note = h('p', { class: 'case-note muted' }, 'Loading the finding…');
  const links = h('div', { class: 'case-links' });
  const summary = h('div', { class: 'case-summary', hidden: true });
  const toggle = h('button', { class: 'link', type: 'button', 'aria-expanded': 'false' }, 'Read summary');
  toggle.addEventListener('click', async () => {
    const open = summary.hidden;
    summary.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Hide summary' : 'Read summary';
    if (open && !summary.firstChild) {
      summary.append(h('p', { class: 'muted' }, 'Loading…'));
      try {
        const md = await caseBody(m, c);
        summary.replaceChildren(markdown(md));
      } catch (e) {
        summary.replaceChildren(h('p', { class: 'muted' }, `The summary could not be loaded: ${(e as Error).message}`));
      }
    }
  });
  caseNotes(m, c)
    .then((n) => {
      note.classList.remove('muted');
      note.textContent = n?.n[match.row] || n?.dev || '';
      if (n?.letter) links.append(h('a', { href: n.letter, target: '_blank', rel: 'noopener' }, 'Decision letter'));
      if (n?.page && n.page !== n.letter) links.append(h('a', { href: n.page, target: '_blank', rel: 'noopener' }, 'Case page'));
      links.append(toggle);
    })
    .catch(() => {
      note.textContent = 'The finding could not be loaded.';
      links.append(toggle);
    });

  return h(
    'li',
    { class: 'case' },
    h('div', { class: 'case-head' }, h('span', { class: 'case-title' }, c.t), h('span', { class: `pill ${PERMITTED.has(c.o) ? 'ok' : 'no'}` }, c.o)),
    h(
      'div',
      { class: 'case-meta' },
      c.a,
      ' · ',
      fmtDate(c.d),
      ' · ',
      DM[c.dm] ?? c.dm,
      c.ref ? [' · ', h('span', { class: 'mono' }, c.ref)] : null,
      c.u ? ` · ${c.u} ${c.u === 1 ? 'home' : 'homes'}` : null,
      c.fw !== '26' ? h('span', { class: 'flag' }, FW[c.fw] ?? c.fw) : null,
      c.v !== 'L' ? h('span', { class: 'flag' }, c.v === 'R' ? 'from the officer report' : 'from the decision notice') : null,
    ),
    h('div', { class: 'case-finding' }, h('span', { class: 'code' }, code), h('span', { class: `finding f-${finding}` }, finding), weight ? h('span', { class: 'weight' }, weight) : null),
    note,
    links,
    summary,
  );
}

/** A panel of matching decisions for a query, grouped as the query asks. */
export function casesPanel(m: Manifest, index: CaseIdx[], q: CaseQuery, facts: Facts, heading?: string): HTMLElement {
  const groups = findCases(index, q, facts);
  const total = groups.reduce((s, g) => s + g.matches.length, 0);
  const box = h('section', { class: 'cases', 'aria-label': 'Matching decisions' });
  box.append(
    h('div', { class: 'cases-head' }, h('h3', null, heading ?? q.label ?? 'Matching decisions'), h('span', { class: 'count' }, `${total}`)),
    h('p', { class: 'fine' }, `Decisions with a finding on ${q.policies.join(', ')}${q.tags ? `, tagged ${q.tags.join(' or ')}` : ''}. Ranked by similarity to your answers; 2026-Framework decisions first.`),
  );
  if (!total) {
    box.append(h('p', { class: 'muted' }, 'No decisions in the dataset make this finding yet.'));
    return box;
  }
  for (const g of groups) {
    const list = h('ul', { class: 'case-list' });
    g.matches.slice(0, SHOW).forEach((mt) => list.append(caseRow(m, mt)));
    const grp = h('div', { class: 'group' }, h('h4', null, g.label, h('span', { class: 'count' }, `${g.matches.length}`)), list);
    if (g.matches.length > SHOW) {
      const more = h('button', { class: 'link', type: 'button' }, `Show all ${g.matches.length}`);
      more.addEventListener('click', () => {
        g.matches.slice(SHOW).forEach((mt) => list.append(caseRow(m, mt)));
        more.remove();
      });
      grp.append(more);
    }
    box.append(grp);
  }
  box.append(h('p', { class: 'fine' }, 'Appeals are mostly against refusals, and the council decisions collected are mostly approvals. Compare like with like, and read counts as a guide to how the test is applied, not as odds.'));
  return box;
}

