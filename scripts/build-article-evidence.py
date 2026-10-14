"""Build manuscript tables and scientific plots from the preserved JSON evidence.

Requires reportlab. Run from any directory. Does not run or alter experiments.
Plots use ReportLab's LinePlot. Optional --poppler-bin exports crisp PNGs via
temporary vector PDFs, so no system font substitution is needed for SVG text.
"""
from pathlib import Path
import hashlib
import json
import re
import argparse
import os
import subprocess
import tempfile
from html import escape
from reportlab.graphics.shapes import Drawing, String
from reportlab.graphics.charts.lineplots import LinePlot
from reportlab.graphics.widgets.markers import makeMarker
from reportlab.graphics import renderSVG, renderPDF
from reportlab.lib.colors import HexColor

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/article'
FIG = OUT / 'figures'
POPPLER = None


def load(name):
    return json.loads((ROOT / 'docs' / name).read_text(encoding='utf-8'))


def table(caption, headers, rows):
    return '\n'.join([f'**{caption}**', '', '| ' + ' | '.join(headers) + ' |',
                      '| ' + ' | '.join(['---'] * len(headers)) + ' |'] +
                     ['| ' + ' | '.join(str(v) for v in row) + ' |' for row in rows])


def plot(name, title, subtitle, data, x_min, x_max, x_step, y_min, y_max,
         y_step, x_title, y_title, labels, colors, connect=True):
    drawing = Drawing(540, 292)
    drawing.add(String(12, 274, title, fontName='Helvetica-Bold', fontSize=13))
    drawing.add(String(12, 255, subtitle, fontName='Helvetica', fontSize=9,
                       fillColor=HexColor('#444444')))
    chart = LinePlot()
    chart.x, chart.y, chart.width, chart.height = 56, 57, 465, 177
    chart.data = data
    chart.joinedLines = int(connect)
    chart.xValueAxis.valueMin, chart.xValueAxis.valueMax = x_min, x_max
    chart.xValueAxis.valueStep = x_step
    chart.yValueAxis.valueMin, chart.yValueAxis.valueMax = y_min, y_max
    chart.yValueAxis.valueStep = y_step
    chart.xValueAxis.labels.fontSize = chart.yValueAxis.labels.fontSize = 8
    chart.xValueAxis.labels.fontName = chart.yValueAxis.labels.fontName = 'Helvetica'
    chart.xValueAxis.labelTextFormat = '%.0f'
    chart.yValueAxis.labelTextFormat = '%.0f'
    chart.yValueAxis.visibleGrid = True
    chart.yValueAxis.gridStrokeColor = HexColor('#dddddd')
    chart.yValueAxis.gridStrokeWidth = .4
    for i, color in enumerate(colors):
        chart.lines[i].strokeColor = HexColor(color)
        chart.lines[i].strokeWidth = 1
        chart.lines[i].symbol = makeMarker('FilledCircle')
        chart.lines[i].symbol.fillColor = HexColor(color)
        chart.lines[i].symbol.strokeColor = HexColor(color)
        chart.lines[i].symbol.size = 4.4
    drawing.add(chart)
    drawing.add(String(285, 30, x_title, textAnchor='middle', fontName='Helvetica', fontSize=9))
    drawing.add(String(56, 240, y_title, fontName='Helvetica', fontSize=9))
    for i, (label, color) in enumerate(zip(labels, colors)):
        drawing.add(String(56 + i * 172, 10, label, fontName='Helvetica', fontSize=8,
                           fillColor=HexColor(color)))
    svg_path = FIG / f'{name}.svg'
    renderSVG.drawToFile(drawing, str(svg_path))
    svg = svg_path.read_text(encoding='utf-8')
    svg = svg.replace('<title>...</title>', f'<title>{escape(title)}</title>')
    svg = svg.replace('<desc>...</desc>', f'<desc>{escape(subtitle)}</desc>')
    svg = svg.replace('font-family: Helvetica-Bold;', 'font-family: Arial, sans-serif; font-weight: bold;')
    svg = svg.replace('font-family: Helvetica;', 'font-family: Arial, sans-serif;')
    svg_path.write_text(svg, encoding='utf-8', newline='\n')
    if POPPLER:
        local = ROOT / '.local/article-figures'
        local.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(dir=local, prefix='plot-') as temp:
            folder = Path(temp)
            assert folder.resolve().is_relative_to(ROOT)
            renderPDF.drawToFile(drawing, str(folder / 'figure.pdf'))
            # Relative ASCII paths accommodate Windows Poppler's output encoding.
            subprocess.run([str(POPPLER), '-png', '-singlefile', '-r', '360',
                            'figure.pdf', 'figure'], cwd=folder, check=True)
            (FIG / f'{name}.png').write_bytes((folder / 'figure.png').read_bytes())


def main():
    batch, paired, thrift = map(load, ['initial-batch.json', 'paired-analysis.json',
                                     'thrift-analysis.json'])
    for source in [paired['source'], thrift['source']]:
        assert hashlib.sha256((ROOT / source['path']).read_bytes()).hexdigest() == source['sha256']
    FIG.mkdir(parents=True, exist_ok=True)
    seeds = paired['seeds']
    plot('population', 'Population at the day 16 endpoint',
         'Original paired branches  Twelve initial conditions',
         [[(r['seed'], r[a]['population']) for r in paired['runs']]
          for a in ['control', 'drought']], 4217, 4228, 1, 0, 180, 30,
         'Seed', 'Living organisms', ['Natural abundance', 'Natural drought'],
         ['#184b70', '#a44b18'], False)
    plot('share-interaction', 'Effect of thrift normalization on Ciy share',
         'Interaction = effect in drought minus effect in abundance',
         [[(r['seed'], r['share']['interaction']) for r in thrift['runs']],
          [(s, 0) for s in seeds],
          [(s, thrift['effects']['share']['interaction']['mean']) for s in seeds]],
         4217, 4228, 1, -60, 20, 20, 'Seed', 'Percentage points',
         ['Individual seed interaction', 'Zero interaction', 'Mean interaction'],
         ['#184b70', '#777777', '#a44b18'], False)
    # One reference point per seed marks levels without implying a time trajectory.
    names = [r['name'] for r in paired['lineages']]
    arm_keys = ['naturalAbundance', 'naturalDrought', 'normalizedAbundance', 'normalizedDrought']
    sections = ['## Appendix A Complete paired endpoint ledger',
                'These tables reproduce the saved endpoints. Counts are integers; shares and contrasts are rounded only for display. A comma separates tied leaders. No branch is excluded.', '']
    lead = lambda ids: ', '.join(names[i] for i in ids) or 'Undefined'
    sections.append(table('Table A1 Population and lineage leadership',
        ['Seed', 'Day 8 N', 'A N', 'D N', 'Day 8 leaders', 'A leaders', 'D leaders'],
        [[r['seed'], r['baseline']['population'], r['control']['population'], r['drought']['population'],
          lead(r['baseline']['leaders']), lead(r['control']['leaders']), lead(r['drought']['leaders'])]
         for r in paired['runs']]))
    for key, title in [('baseline', 'Day 8 checkpoint'), ('control', 'Natural abundance at day 16'),
                       ('drought', 'Natural drought at day 16')]:
        idx = ['baseline', 'control', 'drought'].index(key) + 2
        sections += ['', table(f'Table A{idx} {title} lineage counts', ['Seed'] + names,
                      [[r['seed']] + [x['count'] for x in r[key]['lineages']] for r in batch['runs']])]
    sections += ['', '## Appendix B Complete four arm endpoint ledger',
                 'A means natural abundance, D natural drought, XA normalized abundance and XD normalized drought. Each row is one paired initial condition. N denotes total living population; n denotes living Çiy descendants.', '']
    sections.append(table('Table B1 Total population in every arm', ['Seed', 'A N', 'D N', 'XA N', 'XD N'],
                          [[r['seed']] + [r['arms'][a]['population'] for a in arm_keys] for r in thrift['runs']]))
    sections += ['', table('Table B2 Çiy counts in every arm', ['Seed', 'A n', 'D n', 'XA n', 'XD n'],
                            [[r['seed']] + [r['arms'][a]['count'] for a in arm_keys] for r in thrift['runs']])]
    sections += ['', table('Table B3 Çiy shares in every arm in percent', ['Seed', 'A', 'D', 'XA', 'XD'],
                            [[r['seed']] + [f"{r['arms'][a]['sharePercent']:.2f}" for a in arm_keys] for r in thrift['runs']])]
    for outcome, label, num in [('share', 'share effects in percentage points', 4), ('count', 'count effects in organisms', 5)]:
        sections += ['', table(f'Table B{num} Normalization {label}', ['Seed', 'XA minus A', 'XD minus D', 'Interaction'],
            [[r['seed']] + [f"{r[outcome][x]:+.2f}" for x in ['abundance', 'drought', 'interaction']]
             for r in thrift['runs']])]
    sections += ['', table('Table B6 Treated checkpoint cohort and inherited thrift at the endpoint',
        ['Seed', 'Edited n', 'Day 8 mean h', 'XA mean h', 'XD mean h'],
        [[r['seed'], r['editedOrganisms'], f"{r['checkpointMeanThrift']:.4f}"] +
         [('Undefined' if r['arms'][a]['meanThrift'] is None else f"{r['arms'][a]['meanThrift']:.4f}")
          for a in ['normalizedAbundance', 'normalizedDrought']] for r in thrift['runs']]),
        '', 'Endpoint thrift averages describe surviving descendants, not a new mechanistic analysis. Their departure from 1.0000 confirms that normalization was not maintained as a permanent clamp. Undefined means no Çiy remained in that arm.', '']
    manuscript = OUT / 'morrow-article.md'
    original = manuscript.read_text(encoding='utf-8')
    replacement = '<!-- BEGIN GENERATED EVIDENCE -->\n\n' + '\n\n'.join(sections) + '\n<!-- END GENERATED EVIDENCE -->'
    updated, n = re.subn(r'<!-- BEGIN GENERATED EVIDENCE -->.*?<!-- END GENERATED EVIDENCE -->',
                         lambda _: replacement, original, flags=re.S)
    assert n == 1, 'Expected exactly one generated evidence block'
    manuscript.write_text(updated, encoding='utf-8', newline='\n')
    print('Rebuilt two SVG figures and ten appendix tables from frozen evidence.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--poppler-bin', type=Path,
                        help='Directory containing pdftoppm; also generate PNG figures')
    args = parser.parse_args()
    if args.poppler_bin:
        POPPLER = (args.poppler_bin / ('pdftoppm.exe' if os.name == 'nt' else 'pdftoppm')).resolve()
        if not POPPLER.is_file():
            raise FileNotFoundError(POPPLER)
    main()
