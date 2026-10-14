# Article verification

The following initial-delivery notes describe revision 1. The current revision 2
verification appears below; original scientific evidence is preserved.

Verified 14 October 2026. The article is entirely English. This verification
concerns its numerical fidelity and document presentation, not empirical ecology.

## Numerical and structural audit

`python scripts/check-article.py` passes. All 21 DOCX tables match every Markdown
table cell. Hand-written lineage means, four-arm means and both contrast tables
match the saved machine-readable analyses. Four frozen input/source SHA-256 values
match the manuscript. The DOCX contains ten native Office Math expressions,
including structural superscripts/subscripts, two embedded figures, reference
hyperlinks and repeating table headers. There is no title border or generated
evidence marker in the rendered document.

Tables A1–A4 and B1–B6 are generated directly from existing JSON. No seed is
removed. Original natural-arm endpoints and prior model/evidence files remain
unchanged. No new scientific experiment was run to prepare the article.

## Visual review

The final Word document is 24 A4 pages. All pages were opened individually at
120 dpi and reviewed for text clipping, overlap, missing characters, table
alignment, page breaks, repeated headers, equations and footer numbering.
The final small ethics edit was rerendered; changed pages were reviewed again
and unchanged pages were compared pixel for pixel with inspected images.

The initial table-header orphan was corrected by keeping headers with the first
data row and keeping short tables intact. The initial SVG font substitution was
removed from embedded figures by using ReportLab vector PDF output and 360-dpi
PNG rasterization. Final figures are 2700 × 1460 pixels and remain readable at
the document's display width.

The bundled Windows authoring runtime supplies Python 3.12, python-docx 1.2.0,
ReportLab 4.4.9, Poppler and PDFium, but no LibreOffice. A separate invisible
Microsoft Word 16 instance exported this document read-only to an internal PDF.
The bundled `render_docx.py` was used with an adapter supplying that conversion
and bundled PDFium page rasterization. No packaged renderer file was changed.
Poppler dropped glyphs in some later page images; PDF text extraction and
independent PDFium rendering confirmed the document itself retained them.

Internal PDFs, page PNGs and the renderer adapter are ignored under `.local/`;
they are QA intermediates rather than requested deliverables. The DOCX is the
requested final Word artifact. Its pagination can vary with another renderer
or missing fonts; the Markdown remains the canonical text.

## Application checks

All 30 Node tests and `npm run check` passed before the article commits. The
existing CI also verifies generated scientific analysis and a full four-arm
replay. The authoring tools introduce no browser application dependency.

No package installation, repository visibility change, hosting deployment,
message to another person, journal submission or unrelated cleanup was performed.
Project artifacts and QA files are on D. Existing runtime/session storage and
Word's own system activity can use C; no claim of zero C-drive writes is made.

## Revision 2 verification after the unseen seed replication

Revision 2 contains 40 A 4 pages,28 tables,3 data figures and 10 native editable
Office Math expressions. Its current abstract, chronology, methods, results,
discussion, conclusions and public-access statement include the 100 new paired
worlds. Tables D 1–D 4 provide all 100 new endpoints separately from the old 12.
The Python document audit compares every DOCX table cell with Markdown, every
new ledger cell with JSON, all new arm/interaction summary rows and the original
summary values, figure/equation structure and frozen source identifiers.

The figure builder reads only saved replication JSON. Figure 3 is a 2700×1550
lossless PNG from ReportLab PDF at 360 dpi. Its interval band concerns the mean,
not individual outcomes. Windows Poppler requires relative ASCII output paths
under this Unicode project directory; the builder handles that explicitly.

Used the existing bundled Python 3.12/python-docx/ReportLab/PDFium environment,
with no package install. The workspace dependency loader was not exposed as a
callable tool; the existing managed runtime.json and bundled dependency paths
identified the authoring environment. The bundle has no LibreOffice. A separate
invisible Word 16 instance opened the DOCX read-only and exported a 40-page QA PDF.
The packaged render_docx.py used the local Word-PDF/PDFium adapter at 120 dpi;
stdout was set to UTF-8 to handle the vault's Unicode path. No managed files were
changed. Every page was visually inspected; repeated table headers, page breaks,
math, hashes and all three figures are readable without clipping or overlap.

Some view_image previews omitted repeated glyph regions even when file hashes
and direct PDFium rasterizations were pixel-identical; unique preview filenames
and direct rasterizations confirmed source pixels. QA PDF/PNGs remain ignored under
.local/replication-qa/. The delivered file is the DOCX, not these intermediates.
Current artifact-manifest.json replaces revision 1's manifest; the original
manifest and original manuscript remain accessible at Git revision c1409cc.
