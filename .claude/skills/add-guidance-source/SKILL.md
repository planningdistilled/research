---
name: add-guidance-source
description: Add a published commentary, briefing, training material or government page on the August 2026 NPPF to the guidance corpus (data/guidance), with a saved copy, coded stances and machine-checked quotes, then refresh the Navigator method and sources pages. Use when given an article, webinar, law-firm note or council training document about the new Framework to add, or asked to extend the guidance review.
---

# Add a source to the guidance corpus

Read `data/guidance/README.md` first. It covers how the corpus was built, the categories, and the cautions about coding. Look at two or three existing `data/guidance/corpus/*.md` files of the same `publisher_type` as models.

## 1. Check it isn't already there

```bash
grep -ril "<distinctive title words or the URL host and path>" data/guidance/corpus/
```

Republications of the same piece (for example a law-firm note on Local Government Lawyer) are kept, but cross-referenced.

## 2. Save a copy

- Fetch the page: `/usr/bin/curl -sL -A "Mozilla/5.0"` first, then WebFetch, then the Internet Archive.
- Save the original (`.html` or `.pdf`) and a text extract (`.txt`, from `pdftotext -layout` or tags stripped).
- Name both by slug (`<publisher>-<short-title>`).

Where the copy goes:
- **MHCLG or Planning Inspectorate (Crown copyright, OGL):** `data/open-sources/guidance-ogl/`, cited as `open:guidance-ogl/<file>`.
- **Everything else:** `../sources/guidance/` (the private repo), cited as `sources:guidance/<file>`. Never put a third-party copy in this repo; `check_public.py` will reject it.

## 3. Write the corpus file

Create `data/guidance/corpus/<slug>.md` with this frontmatter:

```yaml
slug: <slug>
title: "<title>"
url: <canonical url>
publisher: <name>
publisher_type: government | pins | lpa | law-firm | chambers | consultancy | press | sector-body | campaign | training-body | independent
date: YYYY-MM-DD
audience: <who it is for>
is_training: true|false
about_draft: true|false        # about the Dec 2025 consultation draft rather than the Aug 2026 text
local_copy: sources:guidance/<slug>.html     # or open:guidance-ogl/…
local_text: sources:guidance/<slug>.txt
verification: local-text       # or webfetch-only / not-retrieved
retrieved_on: YYYY-MM-DD
category: <existing category>
```

Then add the sections other files use: `## Summary`, `## What it tells officers/decision-makers to do`, and `## Positions against our propositions` (one bullet per proposition the source touches).

Positions use the heading `## Positions against our propositions` and the pattern `- **GB, agrees.** <one-sentence reading>. Quote: "<verbatim>"`; the stance is agrees, qualifies or disagrees (`tools/corpus_quotes.py` parses exactly this). The propositions are SH1, SH2, TR, S5, SUP, GB, A2, DIV and METH, and their meanings are in the README. Code only what the source actually says. "Agrees" usually means agreement with the Framework text, not with our findings.

Quotes must be verbatim from the saved text. Don't write unchecked claims that a source is silent on something; the method page filters them out anyway.

## 4. Check and refresh

```bash
uv run tools/corpus_quotes.py      # needs ../sources; every quote in the new file must verify
```

Fix any quote that fails. Any "disagrees" or "qualifies" coding gets an adversarial second read: try to knock it down against the full text. Then do the following.

1. Add the source to the README source table and update the counts.
2. If it changes the picture, update `data/guidance/analysis/guidance-vs-our-method.md`.
3. Regenerate the pages and check the gate:
   ```bash
   cd pages/england/nppf-navigator && npm run build && node build/method-page.mjs && cd -
   python3 tools/check_public.py
   ```
4. Commit the research repo, and commit `../sources` for the private copy.
5. Offer `/publish-site`.
