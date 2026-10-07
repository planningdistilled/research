# Inspector Training Manual (17 September 2026): Markdown edition and index

The Planning Inspectorate's Inspector Training Manual (ITM) is internal training material for Inspectors: practical advice on
procedure and on each casework topic. It "does not constitute Government policy or guidance" and is "not the source of any
guidance" (Index page). This folder holds a Markdown edition of the consolidated 17 September 2026 edition, split so that an agent
can load one chapter, section or annex at a time, plus PINS Note 04/2026 (the Inspectorate's briefing on the August 2026 NPPF)
and a glossary that maps recurring NPPF terms to both documents.

## Files

- `INDEX.md`: the chapter list with pages, sizes, the NPPF edition each chapter reflects and the NPPF policy codes it cites. Start here.
- `chapters/<No>-<slug>.md`: one file per chapter, full text less its annexes.
- `chapters/<No>-<slug>/<NN>-<slug>.md`: the chapter's sections (from the PDF bookmarks where the chapter has them, else its own headings).
- `chapters/<No>-<slug>/annex-<NN>-<slug>.md`: the chapter's annexes and appendices (example decisions, templates, case law summaries), linked from the chapter file where they were.
- `manual-full.md`: everything in one file.
- `pins-note-04-2026.md`: PINS Note 04/2026.
- `glossary/GLOSSARY.md` and `glossary/terms/<term>.md`: the term index; `glossary/terms.txt` is the curated term list it is built from.
- `structure.json`: the same map for programs.
- NPPF chunk files (one per chapter, policy and annex of the Framework) are beside the canonical copy at `../nppf/chunks/`.

## Source and page references

The PDFs are in the private sources checkout as `sources:pins/<file>`:

| Part | File | Pages |
| --- | --- | ---: |
| 1 | `Consolidated Inspector Training Manual 17 September 2026_Part1.pdf` | |
| 2 | `Consolidated Inspector Training Manual 17 September 2026_Part2.pdf` | |
| 3 | `Consolidated Inspector Training Manual 17 September 2026_Part3.pdf` | |
| 4 | `Consolidated Inspector Training Manual 17 September 2026_Part4.pdf` | |
| Note | `PN 04.2026 NPPF 2026.pdf` | 12 |

Every file's front matter gives `pdf` (the `sources:` reference with `#page=`), `pdf_pages` and `pdf_link` (a relative link that
opens the PDF at the first page when the sources checkout is beside this repository). In the text, `<!-- PartN p.M -->` marks the
start of PDF page M of Part N, so any passage can be cited as "ITM <chapter>, Part N p. M".

## How it was made

`tools/itm_md.py build` reads the PDFs' own text layer with PyMuPDF (no OCR was needed: every page has text). It drops the
diagonal "Valid only on 17 September 2026" watermark (a rotated text line on every page), the running footers and the page numbers,
rejoins wrapped lines, keeps numbered paragraphs and bullets as written, renders bold headings as Markdown headings by font size
and joins cells that share a line with ` | `. Tables therefore read row by row; diagrams and flowcharts are not captured. Yellow
highlighting (which the manual uses to mark recent changes) is not captured. Text is otherwise verbatim; nothing is summarised.

Chapter boundaries come from each chapter's cover page and the PDF bookmarks. Part 1 pages 912-1064 repeat the Enforcement Case
Law chapter and are skipped; the procedural "Enforcement" chapter on the Index page is not in the consolidated PDF.

## Copyright and reuse

The manual is Crown copyright, produced by the Planning Inspectorate, an executive agency of the Ministry of Housing, Communities
and Local Government. The Inspectorate's stated policy (Index page) is "to disclose the Inspector Training Manual if requested by
an external customer, but not to publish the material externally on a website"; this copy was obtained by such a request. Crown
copyright information released under the Freedom of Information Act 2000 is not automatically licensed for reuse: the Open
Government Licence applies only where the public authority has applied it, and section 19 of the Act and the Re-use of Public
Sector Information Regulations 2015 govern reuse of released information. This folder is published on the working assumption
that the Inspectorate's training material, like its other published guidance, is reusable under the OGL v3.0, pending
confirmation. If that assumption proves wrong the text will be withdrawn to the private sources checkout and only this index,
the glossary locations and short quotations will remain. PINS Note 04/2026 is treated the same way.
