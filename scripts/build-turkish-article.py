"""Build the separate Turkish article using the unchanged English DOCX template.

Requires python-docx, reportlab and pypdfium2. Run from the repository root.
No model execution, source-manuscript edit or English artifact overwrite occurs.
The Turkish Markdown is human-translated; this script is not a machine translator.
"""
from pathlib import Path
from copy import deepcopy
from importlib.util import spec_from_file_location, module_from_spec
from types import SimpleNamespace
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib, json, math, re, argparse, sys
from lxml import etree
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics import renderSVG, renderPDF
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Circle
from reportlab.lib.colors import HexColor
import pypdfium2

ROOT = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True
OUT = ROOT / 'docs/article'
QA = ROOT / '.local/translation-qa'
ENGLISH_MD = '5215f423e991bc73edf7bcf329e089455c9fc8b19544e063fcee72c51cce8252'
ENGLISH_DOCX = '28e3d3d7429d39ac9d312a14572ea9e82739ffe71805ca6f984b5e8dd67a4794'
NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
      'm': 'http://schemas.openxmlformats.org/officeDocument/2006/math',
      'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing'}


def load_module(name, filename):
    spec = spec_from_file_location(name, ROOT / 'scripts' / filename)
    module = module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def assert_english_unchanged():
    for name, digest in [('morrow-article.md', ENGLISH_MD), ('morrow-article.docx', ENGLISH_DOCX)]:
        assert hashlib.sha256((OUT / name).read_bytes()).hexdigest() == digest, name


def save_figure(drawing, target):
    target = Path(target)
    assert target.name.endswith('.tr.svg')
    renderSVG.drawToFile(drawing, str(target))
    target.write_text(target.read_text(encoding='utf-8'), encoding='utf-8', newline='\n')
    pdf = QA / (target.stem + '.pdf')
    renderPDF.drawToFile(drawing, str(pdf))
    with pypdfium2.PdfDocument(str(pdf)) as document:
        page = document[0]
        bitmap = page.render(scale=5)
        bitmap.to_pil().save(target.with_suffix('.png'))
        bitmap.close()
        page.close()


def figures(regular, bold):
    # Register real Unicode fonts under the source plot's names. The original
    # geometry and saved-data values stay intact, including negative/reversed dots.
    pdfmetrics.registerFont(TTFont('Helvetica', str(regular)))
    pdfmetrics.registerFont(TTFont('Helvetica-Bold', str(bold)))
    base = load_module('original_evidence_plot', 'build-article-evidence.py')
    base.POPPLER = None
    base.renderSVG = SimpleNamespace(drawToFile=save_figure)
    paired = base.load('paired-analysis.json')
    thrift = base.load('thrift-analysis.json')
    base.plot('population.tr', '16. gün son ölçümünde popülasyon',
        'İlk eşleştirilmiş dallar  On iki başlangıç koşulu',
        [[(r['seed'], r[a]['population']) for r in paired['runs']]
         for a in ['control', 'drought']], 4217, 4228, 1, 0, 180, 30,
        'Başlangıç tohumu', 'Yaşayan organizmalar', ['Doğal bolluk', 'Doğal kuraklık'],
        ['#184b70', '#a44b18'], False)
    seeds = paired['seeds']
    base.plot('share-interaction.tr', 'Tutumluluk normalleştirmesinin Çiy payına etkisi',
        'Etkileşim = kuraklıktaki etki eksi bolluktaki etki',
        [[(r['seed'], r['share']['interaction']) for r in thrift['runs']],
         [(s, 0) for s in seeds],
         [(s, thrift['effects']['share']['interaction']['mean']) for s in seeds]],
        4217, 4228, 1, -60, 20, 20, 'Başlangıç tohumu', 'Yüzde puan',
        ['Tekil tohum etkileşimi', 'Sıfır etkileşim', 'Ortalama etkileşim'],
        ['#184b70', '#777777', '#a44b18'], False)

    report = json.loads((ROOT / 'docs/replication-analysis.json').read_text(encoding='utf-8'))
    effect = report['effects']['share']['interaction']
    lower, upper = report['bootstrap']['share']['interval']
    drawing = Drawing(540, 310)
    drawing.add(Rect(0, 0, 540, 310, fillColor=HexColor('#ffffff'), strokeColor=None))
    drawing.add(String(40, 289, 'İncelenmemiş 100 dünyada pay etkileşimleri', fontName='Helvetica-Bold', fontSize=13))
    drawing.add(String(40, 272,
        f'Ortalama {effect["mean"]:.2f} yüzde puan; merkezî %95 eşleştirilmiş bootstrap aralığı [{lower:.2f}, {upper:.2f}]',
        fontName='Helvetica', fontSize=8))
    bottom, top, left, right = 48, 249, 55, 517
    ymin = math.floor(min(effect['range'][0], lower) / 10) * 10
    ymax = math.ceil(max(effect['range'][1], upper) / 10) * 10
    x = lambda seed: left + (seed - 10000) / 99 * (right - left)
    y = lambda value: bottom + (value - ymin) / (ymax - ymin) * (top - bottom)
    drawing.add(Rect(left, y(lower), right - left, y(upper) - y(lower), fillColor=HexColor('#e5eee8'), strokeColor=None))
    for value in range(ymin, ymax + 1, 20):
        drawing.add(Line(left, y(value), right, y(value), strokeColor=HexColor('#e1e6e9'), strokeWidth=.5))
        drawing.add(String(left - 8, y(value) - 3, str(value), textAnchor='end', fontName='Helvetica', fontSize=8))
    drawing.add(Line(left, y(0), right, y(0), strokeColor=HexColor('#666666'), strokeWidth=.8))
    drawing.add(Line(left, y(effect['mean']), right, y(effect['mean']), strokeColor=HexColor('#315f78'), strokeWidth=1.1))
    for row in report['runs']:
        value = row['share']['interaction']
        if value is not None:
            drawing.add(Circle(x(row['seed']), y(value), 2.2,
                fillColor=HexColor('#315f78' if value < 0 else '#a46438'), strokeColor=None))
    for seed in [10000, 10020, 10040, 10060, 10080, 10099]:
        drawing.add(String(x(seed), 32, str(seed), textAnchor='middle', fontName='Helvetica', fontSize=8))
    drawing.add(String(285, 16, 'Daha önce incelenmemiş başlangıç tohumunun kimliği', textAnchor='middle', fontName='Helvetica', fontSize=8))
    drawing.add(String(40, 258, 'Yüzde puan', fontName='Helvetica', fontSize=8))
    save_figure(drawing, OUT / 'figures/replication-interactions.tr.svg')


def body_paragraphs(body):
    return body.xpath('./w:p | ./w:tbl/w:tr/w:tc/w:p', namespaces=NS)


def build_docx():
    converter = load_module('original_article_converter', 'md-to-docx.py')
    temporary = QA / 'translated-content.docx'
    converter.convert(OUT / 'morrow-article.tr.md', temporary)
    reference = OUT / 'morrow-article.docx'
    output = OUT / 'morrow-article.tr.docx'
    with ZipFile(reference) as original, ZipFile(temporary) as translated:
        xml = etree.fromstring(original.read('word/document.xml'))
        content = etree.fromstring(translated.read('word/document.xml'))
        paragraphs = body_paragraphs(xml.find('w:body', NS))
        replacements = body_paragraphs(content.find('w:body', NS))
        assert len(paragraphs) == len(replacements), 'Translation changed document structure'
        original_rels = etree.fromstring(original.read('word/_rels/document.xml.rels'))
        translated_rels = etree.fromstring(translated.read('word/_rels/document.xml.rels'))
        by_target = {r.get('Target'): r.get('Id') for r in original_rels}
        ids = {r.get('Id'): by_target[r.get('Target')] for r in translated_rels}
        for paragraph, replacement in zip(paragraphs, replacements):
            if paragraph.xpath('.//m:oMath', namespaces=NS):
                assert etree.tostring(paragraph) == etree.tostring(replacement), 'Equation changed'
                continue
            if paragraph.xpath('.//w:drawing', namespaces=NS):
                a = paragraph.xpath('.//wp:docPr', namespaces=NS)
                b = replacement.xpath('.//wp:docPr', namespaces=NS)
                assert len(a) == len(b) == 1
                a[0].set('descr', b[0].get('descr'))
                continue
            # Keep the reference's paragraph properties, table grids and all
            # caption styles. Only translated text/run/hyperlink content changes.
            for child in list(paragraph):
                if child.tag != '{' + NS['w'] + '}pPr':
                    paragraph.remove(child)
            for child in replacement:
                if child.tag == '{' + NS['w'] + '}pPr':
                    continue
                child = deepcopy(child)
                for link in child.iter('{' + NS['w'] + '}hyperlink'):
                    key = '{' + NS['r'] + '}id'
                    if link.get(key):
                        link.set(key, ids[link.get(key)])
                paragraph.append(child)
            props = paragraph.find('w:pPr', NS)
            if props is None:
                props = etree.Element('{' + NS['w'] + '}pPr')
                paragraph.insert(0, props)
            run_props = props.find('w:rPr', NS)
            if run_props is None:
                run_props = etree.SubElement(props, '{' + NS['w'] + '}rPr')
            lang = run_props.find('w:lang', NS)
            if lang is None:
                lang = etree.SubElement(run_props, '{' + NS['w'] + '}lang')
            lang.set('{' + NS['w'] + '}val', 'tr-TR')
        patches = {'word/document.xml': etree.tostring(xml, xml_declaration=True, encoding='UTF-8', standalone=True)}
        core = etree.fromstring(original.read('docProps/core.xml'))
        for namespace, name, value in [
            ('http://purl.org/dc/elements/1.1/', 'title', 'Morrow’da kaynak kıtlığı ve soyların başarısı'),
            ('http://purl.org/dc/elements/1.1/', 'language', 'tr-TR'),
            ('http://purl.org/dc/elements/1.1/', 'subject', 'İngilizce makalenin ikinci sürümünün tam Türkçe çevirisi')]:
            node = core.find('{' + namespace + '}' + name)
            if node is None:
                node = etree.SubElement(core, '{' + namespace + '}' + name)
            node.text = value
        patches['docProps/core.xml'] = etree.tostring(core, xml_declaration=True, encoding='UTF-8', standalone=True)
        for index, stem in enumerate(['population', 'share-interaction', 'replication-interactions'], 1):
            patches[f'word/media/image{index}.png'] = (OUT / f'figures/{stem}.tr.png').read_bytes()
        assert set(patches).issubset(set(original.namelist()))
        with ZipFile(output, 'w', ZIP_DEFLATED) as final:
            for part in original.infolist():
                final.writestr(part, patches.get(part.filename, original.read(part.filename)))
    print(f'Created {output} using the preserved English package and styles')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--font-regular', type=Path, default=Path('C:/Windows/Fonts/arial.ttf'))
    parser.add_argument('--font-bold', type=Path, default=Path('C:/Windows/Fonts/arialbd.ttf'))
    args = parser.parse_args()
    assert_english_unchanged()
    QA.mkdir(parents=True, exist_ok=True)
    figures(args.font_regular, args.font_bold)
    build_docx()
    assert_english_unchanged()


if __name__ == '__main__':
    main()
