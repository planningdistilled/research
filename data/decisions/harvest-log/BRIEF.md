# Harvester brief (shared by all harvesting agents)

Repo root: the planningdistilled/research checkout
Case store: data/decisions/  — READ its README.md FIRST (schema, case-id rules, vocabularies).
Policy codes: data/decisions/nppf-2026-policy-codes.md
Framework text: data/open-sources/nppf/NPPF-August-2026.pdf (text extract beside it: NPPF-August-2026.txt). Policy codes and the
2024→2026 mapping: data/decisions/nppf-2026-policy-codes.md.

Today is 2026-09-23. The new NPPF was published and took effect 17 Aug 2026. We want every decision you can find dated
17 Aug 2026 or later, distilled into one case file each. Quality over raw count, but aim high — 15–40 cases per agent is
a good outcome if the sources allow.

Tools/method notes:
- Use WebSearch / WebFetch (load them via ToolSearch "select:WebSearch,WebFetch" if needed) and /usr/bin/curl.
- PINS decision letters: https://acp.planninginspectorate.gov.uk/ViewDocument.aspx?fileid=NNNN ; case pages
  https://acp.planninginspectorate.gov.uk/ViewCase.aspx?caseid=NNNNNNN (new-style 7-digit refs 600xxxx). Try curl with a
  browser User-Agent. Planning Geek (planninggeek.co.uk), Urbanist Architecture, Planning Resource, law-firm blogs, and
  LinkedIn posts often link decision letters.
- SDC API: see memory note — base https://apps.stratford.gov.uk/EplanningV2/API/ (v1/Search?parish=..., v1/PlanningApplication/{guid},
  documents via POST v1/Document/{id}/Request with --data "" then GET .../Download).
- Council committee reports: most councils use modern.gov (e.g. democracy.<council>.gov.uk/ieListMeetings.aspx) — agendas
  and report PDFs are fetchable even when the Idox planning portal blocks bots.
- pdftotext -layout for PDFs. No OCR available (tesseract absent); if a PDF is scanned, note it and use the notice / other docs.
- Save PDFs to `data/open-sources/pins-letters/<case-id>.pdf` (PINS, Secretary of State and Crown decisions) or `../sources/council/<case-id>.pdf` (council documents, private repo) (or -report / -notice suffix).

Hard rules:
- Before writing each case, `grep -ril "<appeal ref or number or site name>" data/decisions/cases/` — other agents
  are working in parallel. If a file exists, enrich it (add sources / findings) rather than duplicate.
- Frontmatter must be valid YAML matching the schema. Quote strings containing colons. After writing cases, run
  `uv run tools/build_index.py` and fix any WARN lines for your files.
- Verbatim quotes with decision-letter paragraph numbers. No invented facts. Mark verification honestly.
- Do NOT edit files outside data/decisions/ and `data/open-sources/pins-letters/` (PINS letters) and `../sources/council/` (council documents, private repo). Do not git commit.
- Write your harvest log to data/decisions/harvest-log/<your-agent-name>.md: sources searched, queries,
  what worked, dead ends, and a "LEADS NOT FOLLOWED" list (refs/URLs you saw but didn't process) — this is important for
  follow-up passes.
- Also append, at the end of your log, a section "OBSERVED PATTERNS" — 5–15 bullets of patterns you noticed across your
  cases (how policies are being read, what facts are decisive, recurring weights, surprises), each citing case ids.

Final reply to the coordinator: counts (cases written / enriched), 3–6 headline patterns, and the biggest gaps.

---
## Wave 2 — corpus slices (added by coordinator)

The full set of new-style PINS decisions (17 Aug–23 Sep 2026) is in data/open-sources/pins-corpus/<ref>.txt
(docs.map there gives the PDF path; PDF URL = https://appeal-planning-decision.service.gov.uk/published-document/<uuid>).
Uncovered decisions are split into work lists in harvest-log/slices/*.tsv (same columns as pins-corpus-index.tsv).
Work ONLY your assigned list. Case id for these: PINS-<ref>. Set `local_copy` to the corpus .txt path if no PDF saved.

Triage every letter into one of two tiers — BOTH tiers get a full, valid frontmatter (the index depends on it):
- **Tier 1 (full case file):** the letter reasons substantively through the 2026 Framework — principle of development
  (S3–S6, GB, HO), a policy-led balance, heritage balance (HE4–HE7), design refusal via DP3/S4(2)/S5(2), TR3/TR6,
  flood, landscape, or says something about the transitional switch. Full body per README.
- **Tier 2 (short case file):** routine amenity/character/design appeals where the Framework is cited in passing. Full
  frontmatter (policy_findings can be 1–3 entries; key_facts 1–3 lines), body = `## Summary` (2–3 sentences) +
  `## What made the difference` (1–3 sentences). Add tag `tier-2`.
- Skip nothing silently: if a letter is unusable (e.g. withdrawn, invalid, text missing), list it in your log.

YAML hygiene: wrap any value containing a colon, a leading quote, `#`, or a quote-then-more-text in single quotes
(double any inner single quotes). Run the index builder at the end and fix WARN lines for your files.
In your log, add a table: ref | tier | outcome | determinative codes — so coverage can be audited.
You may fork sub-agents for parallelism (split your list), but keep total to ≤3 and make each run the grep-before-write check.
