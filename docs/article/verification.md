# Article verification

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
