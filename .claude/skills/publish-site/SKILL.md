---
name: publish-site
description: Rebuild planningdistilled.org from this repo into the main-site checkout, verify the result, then (when the user agrees) push main-site, check the live site and notify IndexNow. Also republishes the matching claude.ai artifacts. Use when asked to publish, deploy, rebuild the site, or push changes live.
---

# Publish planningdistilled.org

Pushing main-site publishes to the public site, so confirm with the user before step 4 unless the request already said to publish. The order matters: builders first, `finish.mjs` last.

## 1. Preconditions

- `git -C ../main-site status -sb` must show a clean tree, level with `origin/main`. Pull if it is behind; stop and ask if it has unexplained local changes.
- The research tree must be committed, or at least contain only the changes being published.
- `python3 tools/check_public.py` must pass.

## 2. Build into main-site

Run only what changed. When unsure, run all of it; the builds are deterministic.

```bash
# NPPF Navigator, including the static decisions/ and route/ copies
cd pages/england/nppf-navigator && npm ci && npm test && npm run build && npm run export:pages && node build/method-page.mjs && cd -

# Service village
node pages/england/service-village/build.mjs --pages

# Stratford note (needs ../sources for the checks)
cd pages/authority/stratford-dc/nppf-decisions/build
python3 sweep.py note.md && python3 loccheck.py note.md && python3 verify.py quotes.json   # 100% / 0 problems / all ok
python3 cases.py && python3 build.py
STAGE=$(mktemp -d) && mkdir $STAGE/stratford-nppf-decisions
python3 standalone.py $STAGE/stratford-nppf-decisions && cp case-*.html $STAGE/stratford-nppf-decisions/
python3 ../../../../../site/seo.py $STAGE
cp $STAGE/stratford-nppf-decisions/* ../../../../../../main-site/research/authority/stratford-dc/nppf-2026-decisions/
rm -f index.html case-*.html && cd -

# Station Road on Foot: only when its artifact changed (pages/settlement/claverdon/station-road-on-foot/README.md)

# Always last
node site/finish.mjs
```

## 3. Verify before pushing

- Run `git -C ../main-site diff --stat` and read the diff. Every change should be explained by what was meant to change.
  - Expected noise: `builtAt` in `nppf-navigator/data/manifest.json`, `<!-- pd:meta -->` dates, and `sitemap.xml` / `llms*.txt`.
  - Anything else unexpected (a page losing content, a changed licence line, a new name) is a stop.
- Check new or changed public text against the sources (CLAUDE.md, hard rule 3). Spot-check two or three changed pages in a browser-like read: `sed` the `<h1>` and the first paragraph.
- Run `grep -rL 'rel="license"' ../main-site --include='*.html' | grep -v 404.html`. It must print nothing.

## 4. Publish (after the user agrees)

```bash
cd ../main-site && git add -A && git commit -m "<what changed and why>" && git push && cd -
gh run list -R planningdistilled/main-site -L 1     # wait for "completed success" (about 40 s)
```

## 5. Check the live site

Compare a sample of the live site with the pushed files. Cover every hand-edited page, about 30 random `research/england/nppf-navigator/decisions/*.html`, the changed pages, `sitemap.xml` and `llms.txt`. Fetch `https://planningdistilled.org/<path>` (strip `index.html`) and run `cmp` against the file. Report the match count.

Then:
```bash
node site/finish.mjs --indexnow
```

## 6. Artifacts

If a page with a claude.ai copy changed, republish it from the same build. The URLs are in CLAUDE.md.

- **Navigator:** publish `dist/index.html` with every `dist/` file, and null out shard names that are gone.
- **Service village:** run `node build.mjs` without `--pages` for `dist/`.

Report what was published, the live check result and the IndexNow response.
