"""Check the public site's structure and links using the Python standard library."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.elements = []
        self.stack = []
        self.errors = []
        self.json_buffer = None

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if len(attrs) != len(values):
            self.errors.append(f'Duplicate attribute on {tag}')
        self.elements.append((tag, values))
        if tag not in VOID:
            self.stack.append(tag)
        if tag == 'script' and values.get('type') == 'application/ld+json':
            self.json_buffer = ''

    def handle_data(self, data):
        if self.json_buffer is not None:
            self.json_buffer += data

    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1] != tag:
            self.errors.append(f'Unexpected closing tag: {tag}')
        else:
            self.stack.pop()
        if tag == 'script' and self.json_buffer is not None:
            try:
                json.loads(self.json_buffer)
            except ValueError as error:
                self.errors.append(f'Invalid structured data: {error}')
            self.json_buffer = None


def validate():
    page = SiteParser()
    page.feed((ROOT / 'index.html').read_text(encoding='utf-8'))
    errors = page.errors
    if page.stack:
        errors.append(f'Unclosed elements: {page.stack}')
    ids = [attrs['id'] for _, attrs in page.elements if 'id' in attrs]
    errors.extend(f'Duplicate id: {key}' for key, count in Counter(ids).items() if count > 1)
    for landmark in ('main', 'h1'):
        if sum(tag == landmark for tag, _ in page.elements) != 1:
            errors.append(f'Expected one {landmark}')
    labels = {attrs.get('for') for tag, attrs in page.elements if tag == 'label'}
    for tag, attrs in page.elements:
        if tag == 'img' and not all(attrs.get(key) for key in ('alt', 'width', 'height')):
            errors.append(f'Image needs alt text and dimensions: {attrs.get("src")}')
        if tag in ('input', 'textarea') and attrs.get('type') != 'hidden' and attrs.get('id') not in labels:
            errors.append(f'Unlabeled form control: {attrs.get("id")}')
        if attrs.get('target') == '_blank' and 'noopener' not in attrs.get('rel', '').split():
            errors.append(f'New-tab link needs noopener: {attrs.get("href")}')
        for key in ('src', 'href'):
            value = attrs.get(key)
            if not value:
                continue
            link = urlsplit(value)
            if link.scheme or link.netloc:
                continue
            if link.path:
                file = ROOT / unquote(link.path)
                if not file.is_file():
                    errors.append(f'Missing local asset: {value}')
                elif not file.read_bytes().strip():
                    errors.append(f'Empty local asset: {value}')
                elif file.suffix.lower() == '.pdf' and not file.read_bytes().startswith(b'%PDF-'):
                    errors.append(f'Invalid PDF signature: {value}')
                elif file.suffix.lower() == '.svg':
                    try:
                        if not ET.parse(file).getroot().tag.endswith('svg'):
                            errors.append(f'Invalid SVG root: {value}')
                    except ET.ParseError:
                        errors.append(f'Invalid SVG markup: {value}')
            elif link.fragment and link.fragment not in ids:
                errors.append(f'Broken anchor: {value}')
    required_metadata = {'description', 'og:title', 'og:description', 'og:url', 'og:image', 'twitter:card', 'twitter:image'}
    metadata = {attrs.get('name') or attrs.get('property') for tag, attrs in page.elements if tag == 'meta' and attrs.get('content')}
    errors.extend(f'Missing metadata: {key}' for key in sorted(required_metadata - metadata))
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'PASS: {len(page.elements)} elements; structure, local assets, anchors, PDF, labels, image dimensions and metadata checked.')


if __name__ == '__main__':
    validate()
