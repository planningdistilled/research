# NPPF 2026 Map

Source of https://planningdistilled.org/research/england/nppf-map/: the whole National Planning Policy Framework (August 2026) as a map.

```bash
node pages/england/nppf-map/build.mjs          # writes main-site/research/england/nppf-map/index.html
node pages/england/nppf-map/build.mjs --refs   # also lists every extracted cross-reference
node site/finish.mjs                           # always after a build
```

## What the page does

- **Overview**: the decision-route diagram (the same one as the Navigator's route map, each box opening the policy behind it) and a grid of the 20 chapters and 6 annexes with their policy codes.
- **Chapter or annex** (`#ch4`, `#AnnexA`): a hub graph of the chapter's policies in the middle, the policies elsewhere that refer into the chapter on the left, the policies and annexes the chapter refers to on the right, and arcs for references within the chapter.
- **Policy** (`#S5`) or any paragraph or limb (`#S5-1-j`): the policy as a tree of its paragraphs and limbs, with the places it refers to beside the referring node and the policies that refer to it on the left; below it, the chapter graph with the policy highlighted.
- **Glossary term** (`#AnnexB-settlement`): a star of every policy and annex that uses the term by name.
- **Text column** (right): the verbatim text of the policy, chapter introduction, annex or term, with the selection highlighted and scrolled to, footnotes, printed page markers, and lists of what it refers to, what refers to it, and the glossary terms it uses. Links go to the same anchor in the Markdown edition and the PDF page.
- **Quick-nav box**: resolves `S5(1)(j)`, `S5 1 j`, `s5-1-j`, `GB7 1 g iii`, `Annex B settlement`, `chapter 4`, or a word, and lists the node itself, every node that refers to it or to a limb of it, every node that refers to the policy or paragraph it sits in, and every node whose text contains the words. `?q=S5(1)(j)` in the URL pre-fills it. The hash is the Markdown anchor, so links are shareable.

## How it is built

`build.mjs` reads the canonical Markdown edition and its structure sidecar (`data/open-sources/nppf/`), locates every entry by its anchor, takes its verbatim text, and checks that text against the committed `pdftotext` extract (the quotation oracle); the build fails on a mismatch. Cross-references are extracted from the Framework's own words: "policy TR5", "policies HC8, GB6, GB7 and/or GB8", "GB6 to GB8", "paragraph 2 of this policy", "(HC7)", "(including TR3, TR4 and DP3(2)(d))", "Annex B", "Chapter 4". Codes in other contexts (M4(2) of the Building Regulations, PM2.5, CO2 as a gas) are deliberately not treated as references. Every target is checked to exist; unresolved codes are reported and dropped.

The client (`client.js`) and stylesheet (`style.css`) are inlined into the page with the data as JSON, so the page is a single file with no network dependencies beyond fonts.

## Checks

- `node pages/england/nppf-map/build.mjs --refs | grep "(bracket)"` to review the parenthesised references, the only pattern that could in principle match a non-policy code.
- Headless Chrome: `--dump-dom` of `index.html#S5-1-j` and `index.html?q=S5(1)(j)` show the rendered view and the quick-nav results without a browser session.
