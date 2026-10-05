# planningdistilled.org: the finishing pass

`finish.mjs` is the last step of every publish to https://planningdistilled.org/ (repo `planningdistilled/main-site`, checked out beside this repo, or wherever `$PD_SITE` points). The page builds own each page's title, description, canonical link and licence line; this pass adds everything search engines and AI crawlers read on top of that, the same way on every page.

```
node site/finish.mjs               # after any build or hand edit in main-site, before committing there
node site/finish.mjs --indexnow    # after the push is live: notify IndexNow of pages changed today
```

It:

- fails if any page lacks a `<title>`, description, matching canonical link (all in `<head>`) or an `<h1>`;
- writes the block between `<!-- pd:meta -->` markers: Open Graph and Twitter card tags, the share image (`assets/og.png`), favicon, snippet and text-and-data-mining permissions, published and modified dates, and schema.org JSON-LD (Article, Dataset for the decisions index, WebApplication for the Navigator, BreadcrumbList);
- regenerates `sitemap.xml` (a page's `lastmod` moves only when its content, ignoring the block, differs from the last commit), `llms.txt` and `llms-full.txt`.

It is idempotent; a second run writes nothing.

## Publish checklist

1. Build into `main-site`. Every builder writes there by default:
   - Navigator: `cd pages/england/nppf-navigator && npm run build && npm run export:pages && node build/method-page.mjs`
   - Service village: `node pages/england/service-village/build.mjs --pages`
   - Stratford note: see `pages/authority/stratford-dc/nppf-decisions/build/README.md`
   - Station Road on Foot: see `pages/settlement/claverdon/station-road-on-foot/README.md`
   - Station Road Decision Route: `node pages/settlement/claverdon/station-road-decision-route/build.mjs`
   - Policy weight pages (need `../sources`): `node pages/authority/stratford-dc/core-strategy-weight/build.mjs` and `node pages/settlement/claverdon/neighbourhood-plan-weight/build.mjs`
   - `python3 site/seo.py <dir>` adds search metadata to the artifact exports (Stratford note, Station Road) before they are copied in.
2. `node site/finish.mjs`
3. Commit and push `main-site` with its Planning Distilled git identity.
4. Once GitHub Pages has deployed, `node site/finish.mjs --indexnow`.

## What else is at the site root

`robots.txt` (every crawler welcome, AI training included; names the sitemap), `.well-known/tdmrep.json` (text-and-data-mining rights not reserved), `favicon.svg`, `about/` and the IndexNow key file. These are edited by hand in `main-site`.

Google Search Console is verified for the domain by a DNS TXT record. Google no longer accepts sitemap pings: submit `sitemap.xml` there once and it is re-read on its own schedule.
