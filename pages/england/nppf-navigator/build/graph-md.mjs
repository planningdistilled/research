// Render the graph as a reviewable document: every node, its guard in words, options, findings and quotes.
export function graphMarkdown(g, describe) {
  const labels = new Map(); // fact -> { title, values: Map }
  for (const n of g.nodes) {
    const values = new Map((n.input.options || []).map((o) => [o.value, o.label]));
    const prev = labels.get(n.fact);
    if (prev) {
      values.forEach((v, k) => prev.values.set(k, v));
      prev.title = `\`${n.fact}\``; // shared by several nodes: name the fact, not one node's title
    }
    else labels.set(n.fact, { title: n.title, values });
  }
  const label = (fact, value) => {
    const l = labels.get(fact);
    if (value === undefined) return `\`${fact}\``;
    const v = l?.values.get(value) ?? JSON.stringify(value);
    return `${l ? l.title : fact} = "${v}"`;
  };
  const when = (p) => (p ? describe(p, label) : 'always');
  const out = [];
  out.push(`# ${g.meta.title}: decision graph (v${g.meta.version})`, '');
  out.push(`Generated from \`graph/\` by \`npm run build\`. Do not edit by hand. ${g.nodes.length} nodes, ${Object.keys(g.quotes).length} verbatim quotes (all verified against the ${g.meta.framework} text at build time).`, '');
  out.push('Reading guide: nodes are asked in this order, each only when its **Shown when** condition holds. A **judgement** is a planning judgement the user makes with the policy text, guidance and matching cases in front of them. **Findings** are what the answer records for the final reasons.', '');

  out.push('## Derived facts', '', '| Fact | Value | When | Basis |', '| --- | --- | --- | --- |');
  for (const d of g.derived) out.push(`| \`${d.fact}\` | ${JSON.stringify(d.value)} | ${when(d.when).replace(/\|/g, '/')} | ${d.note || ''} |`);
  out.push('');

  for (const s of g.sections) {
    const nodes = g.nodes.filter((n) => n.section === s.id);
    if (!nodes.length) continue;
    out.push(`## ${s.title}`, '');
    for (const n of nodes) {
      out.push(`### ${n.title} \`${n.id}\` (${n.kind})`, '');
      out.push(`**Shown when:** ${when(n.when)}`, '');
      out.push(`**Asks:** ${n.prompt}`, '');
      if (n.input.options) {
        for (const o of n.input.options) {
          const eff = (o.effects || []).map((f) => ` → *${f.kind}* ${f.policy}: ${f.text}`).join('');
          out.push(`- ${o.label}${o.when ? ` _(offered when ${when(o.when)})_` : ''}${eff}`);
        }
        out.push('');
      } else if (n.input.type === 'number') out.push(`Number (${n.input.unit || ''})`, '');
      if (n.effects?.length) {
        out.push('**Findings:**');
        for (const e of n.effects) out.push(`- ${e.when ? `if ${when(e.when)}: ` : ''}*${e.finding.kind}*${e.finding.weight ? ` (${e.finding.weight})` : ''} **${e.finding.policy}**: ${e.finding.text}`);
        out.push('');
      }
      if (n.help?.length) out.push('**Guidance:**', ...n.help.map((h) => `- ${h}`), '');
      if (n.contested) {
        out.push(`**Contested:** ${n.contested.summary}`);
        for (const r of n.contested.readings) out.push(`- *${r.label}*: ${r.summary}`);
        out.push('');
      }
      if (n.cases) out.push(`**Cases:** policies ${n.cases.policies.join(', ')}${n.cases.tags ? `; tags ${n.cases.tags.join(', ')}` : ''}${n.cases.groupBy ? `; grouped by ${n.cases.groupBy}` : ''}`, '');
      if (n.quotes?.length) {
        out.push('**Framework text:**', '');
        for (const q of n.quotes) out.push(`> **${g.quotes[q].code}** ${g.quotes[q].text.replace(/ ¦ /g, ' ')}`, '>');
        out.pop();
        out.push('');
      }
    }
  }
  out.push('## Outcomes (first match wins)', '', '| Verdict | When | Title | Test |', '| --- | --- | --- | --- |');
  for (const o of g.outcomes) out.push(`| ${o.verdict} | ${when(o.when).replace(/\|/g, '/')} | ${o.title} | ${o.test} |`);
  out.push('');
  return out.join('\n');
}
