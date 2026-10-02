---
slug: github-uk-planning-skills-issue-62
title: "national-planning-policy: S5(5) summary omits the Green Belt carve-back, and it produced a wrong Severity A finding in use"
url: https://github.com/SeagullTwo/uk-planning-skills/issues/62
publisher: SeagullTwo/uk-planning-skills (GitHub)
publisher_type: independent
date: 2026-09-20
audience: developers and users of AI planning-analysis skills
is_training: false
about_draft: false
local_copy: sources:guidance/github-uk-planning-skills-issue-62.txt
verification: local-text
retrieved_on: 2026-10-02
category: law-firms
---

## Summary

A bug report (closed) on an open-source set of AI "skills" for UK planning. The skill's one-line summary said Green Belt and Local Green Space are "excluded from S5 altogether". It left out the second sentence of S5(5): where development is not inappropriate through GB7 or HC8, it should be approved unless the benefits would be substantially outweighed by adverse effects, applying S5(2). The wrong summary led an automated review of the Sevenoaks District Council committee report on 25/02129/OUT (660 homes, Former Broke Hill Golf Club, Halstead, committee 24 September 2026) to flag a "Severity A" error that was not there. The officer's report was right. The author recommends quoting short policies in full instead of summarising them, and checking other one-line summaries for the same "exclude then carve back" pattern.

## What it tells officers/decision-makers to do

- For Green Belt land: apply GB6–GB8 (and HC8 for Local Green Space) first; if the scheme is not inappropriate, apply the S5(5) presumption at the "substantially outweighed" threshold, including S5(2).
- Do not rely on compressed summaries of policy; check against the published Framework text.

## Positions against our propositions

- **METH – not applicable (checked 2 Oct 2026).** The issue is about an AI tool's one-line summary of the S5(5) policy text, not about coding appeal decisions, counting outcomes or the weight of appeal decisions. "Consider whether the core should quote S5(5) rather than summarise it." (Issue body, "Suggested fix") is verbatim, but it says nothing about our method. At most it is a general caution, already covered by our rule to verify against source: our policy codes should quote the Framework text and not rely on paraphrase. It is not a stance against METH.
- **GB – agrees.** Passing GB7 leads to a further balance, not straight to approval: "So the route is: GB7 exception → development is not inappropriate → the S5 presumption does" ... 'apply, at the "substantially outweighed" threshold.' (Issue body, "The defect"). Matches our finding that passing GB7 is not approval and losses come through S5(2) triggers.
- **SH2 – silent (relevant clarification only).** The issue does not discuss washed-over villages, Annex B "settlement" status or S4 at all; it restates S5(5) for Green Belt land generally: "Green Belt and Local Green Space fall outside S5's own categories" (Issue body, "Suggested fix"). That is consistent with SH2 and sharpens what "the S5/Green Belt route" means in our wording (GB6–GB8 first, then the S5(5) presumption at the "substantially outweighed" threshold, not the S5(1) categories), but it neither tests nor limits SH2.

## Leads

- Sevenoaks DC 25/02129/OUT, Former Broke Hill Golf Club, Halstead (660 dwellings), committee report and decision, 24 September 2026 — an officer's reading of S5(5) for a large Green Belt scheme.
- SeagullTwo/uk-planning-skills repository: other policy summaries and the "planning-report-quality" skill (a third-party coded method to compare with ours).
