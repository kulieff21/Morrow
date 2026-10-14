"""Generate the replication figure and complete article ledgers from saved JSON.

Requires bundled ReportLab; --poppler-bin additionally creates the lossless PNG.
Never runs the model or changes the original evidence/figures.
"""
from pathlib import Path
import argparse, json, math, re, subprocess
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Circle
from reportlab.graphics import renderSVG, renderPDF
from reportlab.lib.colors import HexColor

ROOT = Path(__file__).resolve().parents[1]

def table(title, headers, rows):
    return '\n'.join(['**' + title + '**', '', '| ' + ' | '.join(headers) + ' |',
        '| ' + ' | '.join(['---'] * len(headers)) + ' |'] +
        ['| ' + ' | '.join(str(v) for v in row) + ' |' for row in rows])

def main(poppler):
    report = json.loads((ROOT / 'docs/replication-analysis.json').read_text(encoding='utf-8'))
    runs = report['runs']
    assert len(runs) == 100
    figure_dir = ROOT / 'docs/article/figures'
    temporary = ROOT / '.local/replication-qa'
    temporary.mkdir(parents=True, exist_ok=True)
    drawing = Drawing(540, 310)
    drawing.add(Rect(0, 0, 540, 310, fillColor=HexColor('#ffffff'), strokeColor=None))
    drawing.add(String(40, 289, 'Share interactions in 100 unseen worlds', fontName='Helvetica-Bold', fontSize=13))
    effect = report['effects']['share']['interaction']
    lower, upper = report['bootstrap']['share']['interval']
    drawing.add(String(40, 272, f'Mean {effect["mean"]:.2f} pp; central 95% paired-bootstrap interval [{lower:.2f}, {upper:.2f}]', fontSize=8))
    bottom, top, left, right = 48, 249, 55, 517
    ymin = math.floor(min(effect['range'][0], lower) / 10) * 10
    ymax = math.ceil(max(effect['range'][1], upper) / 10) * 10
    x = lambda seed: left + (seed-10000)/99*(right-left)
    y = lambda value: bottom + (value-ymin)/(ymax-ymin)*(top-bottom)
    drawing.add(Rect(left, y(lower), right-left, y(upper)-y(lower),
        fillColor=HexColor('#e5eee8'), strokeColor=None))
    for value in range(ymin, ymax+1, 20):
        drawing.add(Line(left, y(value), right, y(value), strokeColor=HexColor('#e1e6e9'), strokeWidth=.5))
        drawing.add(String(left-8, y(value)-3, str(value), textAnchor='end', fontSize=8))
    drawing.add(Line(left, y(0), right, y(0), strokeColor=HexColor('#666666'), strokeWidth=.8))
    drawing.add(Line(left, y(effect['mean']), right, y(effect['mean']), strokeColor=HexColor('#315f78'), strokeWidth=1.1))
    for row in runs:
        value = row['share']['interaction']
        if value is not None:
            drawing.add(Circle(x(row['seed']), y(value), 2.2,
                fillColor=HexColor('#315f78' if value < 0 else '#a46438'), strokeColor=None))
    for seed in [10000, 10020, 10040, 10060, 10080, 10099]:
        drawing.add(String(x(seed), 32, str(seed), textAnchor='middle', fontSize=8))
    drawing.add(String(285, 16, 'Previously unexamined seed identifier', textAnchor='middle', fontSize=8))
    drawing.add(String(40, 258, 'Percentage points', fontSize=8))
    stem = figure_dir / 'replication-interactions'
    renderSVG.drawToFile(drawing, str(stem.with_suffix('.svg')))
    pdf = temporary / 'replication-interactions.pdf'
    renderPDF.drawToFile(drawing, str(pdf))
    if poppler:
        executable = poppler / 'pdftoppm.exe' if (poppler / 'pdftoppm.exe').exists() else poppler / 'pdftoppm'
        # Relative ASCII paths avoid Windows Poppler's Unicode output-path bug.
        subprocess.run([str(executable), '-r', '360', '-png', '-singlefile',
            str(pdf.relative_to(ROOT)), str(stem.relative_to(ROOT))], cwd=ROOT, check=True)

    arms = ['naturalAbundance', 'naturalDrought', 'normalizedAbundance', 'normalizedDrought']
    f = lambda value: 'Undefined' if value is None else f'{value:.4f}'
    sections = ['## Appendix D Complete unseen seed replication ledger',
        'These are the 100 new paired units, seeds 10000–10099. A and D denote natural abundance and drought; XA and XD denote normalized abundance and drought. All endpoints are at day 16. No seed is removed or pooled with the original twelve. Counts are exact integers; shares and effects are rounded only for display. Complete six-lineage statistics, checkpoints and state hashes remain in the public raw JSON.',
        table('Table D1 Total population in the 400 new branches', ['Seed', 'A N', 'D N', 'XA N', 'XD N'],
            [[r['seed']] + [r['arms'][a]['population'] for a in arms] for r in runs]),
        table('Table D2 Living Ciy descendants in the 400 new branches', ['Seed', 'A n', 'D n', 'XA n', 'XD n'],
            [[r['seed']] + [r['arms'][a]['count'] for a in arms] for r in runs]),
        table('Table D3 Ciy shares in the 400 new branches in percent', ['Seed', 'A', 'D', 'XA', 'XD'],
            [[r['seed']] + [f(r['arms'][a]['sharePercent']) for a in arms] for r in runs]),
        table('Table D4 Environment specific effects and interactions',
            ['Seed', 'Share EA', 'Share ED', 'Share I', 'Count EA', 'Count ED', 'Count I'],
            [[r['seed']] + [f(r[m][e]) for m in ['share', 'count'] for e in ['abundance', 'drought', 'interaction']] for r in runs]),
        'EA is XA minus A; ED is XD minus D; I is ED minus EA. Share effects are percentage points and count effects are organisms. All 100 share interactions are defined. The criterion and uncertainty method were fixed before any of these outcomes were executed.']
    manuscript = ROOT / 'docs/article/morrow-article.md'
    text = manuscript.read_text(encoding='utf-8')
    block = '<!-- BEGIN REPLICATION EVIDENCE -->\n\n' + '\n\n'.join(sections) + '\n\n<!-- END REPLICATION EVIDENCE -->'
    if '<!-- BEGIN REPLICATION EVIDENCE -->' in text:
        text, n = re.subn(r'<!-- BEGIN REPLICATION EVIDENCE -->.*?<!-- END REPLICATION EVIDENCE -->', lambda _: block, text, flags=re.S)
        assert n == 1
    else:
        text = text.rstrip() + '\n\n' + block + '\n'
    manuscript.write_text(text, encoding='utf-8', newline='\n')
    print('Generated one replication figure and four complete 100-row endpoint tables.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--poppler-bin', type=Path)
    main(parser.parse_args().poppler_bin)
