# Morrow research article

Entirely English, prepared for Elmar Quliyev on 14 October 2026.

- [Complete Markdown manuscript](morrow-article.md)
- [Word manuscript](morrow-article.docx)
- [Reporting research and editorial decisions](research-notes.md)
- [Markdown to Word converter](../../scripts/md-to-docx.py)
- [Evidence table and figure builder](../../scripts/build-article-evidence.py)
- [Article audit](../../scripts/check-article.py)

The manuscript contains the complete model, three-stage study chronology,
equations, both outcome scales, all twelve paired endpoints, four-arm target
endpoints, limitations, access statements, AI-assistance disclosure and references.
Twenty-one tables include ten generated endpoint ledgers and a parameter ledger.
The two scientific figures are generated from preserved JSON rather than screenshots.

## Build

The application remains dependency-free. Document authoring uses Python with
`python-docx`; evidence plots additionally use `reportlab`. Versions used are in
`requirements.txt`. No dependency installation was performed for this article;
the available bundled authoring runtime supplied these libraries.

From the repository root, in a Python environment containing those libraries:

```powershell
python scripts/md-to-docx.py docs/article/morrow-article.md `
  --output docs/article/morrow-article.docx
python scripts/check-article.py
```

The converter supports the Markdown subset documented in its module docstring.
Equation fences use Unicode math, converted to editable Office Math with native
subscripts and superscripts. It does not parse arbitrary LaTeX. Images resolve
relative to the input Markdown. The provided PNG figures are sufficient for a
normal rebuild and are embedded in the DOCX.

To regenerate all appendix tables and SVG figures from frozen evidence:

```powershell
python scripts/build-article-evidence.py
```

To regenerate PNG figures as well, supply the directory containing Poppler's
`pdftoppm` with `--poppler-bin`. The builder uses ReportLab vector PDFs and
360-dpi rasterization, keeping temporary files under ignored `.local/` on D.
It replaces only the marked generated-evidence region in the Markdown and does
not run a new experiment. Rebuild the DOCX after regenerating evidence.

## Review

`check-article.py` compares every DOCX table cell with Markdown, checks summary
tables against saved JSON, verifies the four frozen hashes, native equations,
embedded figures and reference links. It complements visual inspection.

Word pagination should be checked after any content or typography change.
The delivery was exported read-only with Microsoft Word 16, then rasterized with
the bundled `render_docx.py` using that PDF as its conversion input. The bundled
Windows runtime has no LibreOffice. All final pages were inspected individually.
The renderer used the bundled PDFium rasterization backend after bundled Poppler
dropped some glyphs on later pages in both parallel and sequential rendering.
Independent PDF text extraction confirmed those characters remained in the PDF;
PDFium rendered them correctly. Internal PDFs and page PNGs remain ignored in
`.local/`. No packaged renderer files were modified.

The manuscript was finalized while the repository was private. Later on
14 October 2026, Elmar authorized public visibility and GitHub Pages publication.
The source and evidence are now at [the public repository](https://github.com/kulieff21/Morrow),
with the [case study and Word download](https://kulieff21.github.io/Morrow/#article)
on Pages. The original manuscript and its manifest are preserved byte-for-byte;
its private-access wording describes the earlier revision. Publication does not
confer an open-source license or represent peer review or journal acceptance.
