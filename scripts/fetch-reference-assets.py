#!/usr/bin/env python3
"""Vendor exact ready_design image URLs and Google's Material Symbols font.

Run with Python's standard library. Sources stay untouched. Every successful
download must have HTTP 200 and an expected binary signature before being saved.
"""
import concurrent.futures
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/reference-assets'
FONT_CSS = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
UA = 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'


class Images(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sources = set()

    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            src = dict(attrs).get('src')
            if src:
                self.sources.add(src)


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as response:
        if response.status != 200:
            raise ValueError(f'Unexpected HTTP status: {response.status}')
        return response.read(), response.headers.get('Content-Type'), response.url


def image_extension(data):
    if data.startswith(b'\x89PNG\r\n\x1a\n'):
        return 'png'
    if data.startswith(b'\xff\xd8\xff'):
        return 'jpg'
    if data.startswith((b'GIF87a', b'GIF89a')):
        return 'gif'
    if data.startswith(b'RIFF') and data[8:12] == b'WEBP':
        return 'webp'
    if data[4:8] == b'ftyp' and data[8:12] in (b'avif', b'avis'):
        return 'avif'
    raise ValueError('Response has no recognized image signature')


def download_image(item):
    url, sources = item
    try:
        data, mime, resolved = fetch(url)
        ext = image_extension(data)
        name = hashlib.sha256(url.encode()).hexdigest()[:16] + '.' + ext
        (OUT / name).write_bytes(data)
        return url, {'path': '/reference-assets/' + name, 'source_files': sources,
                     'http_status': 200, 'content_type': mime,
                     'resolved_url': resolved, 'bytes': len(data),
                     'sha256': hashlib.sha256(data).hexdigest(), 'signature': ext}
    except Exception as error:
        return url, {'source_files': sources, 'error': str(error)}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    sources = {}
    for path in sorted((ROOT / 'ready_design').glob('*.html')):
        text = path.read_text()
        parser = Images()
        parser.feed(text)
        # Some source headers use a raw image URL as the logo div's text.
        parser.sources.update(html.unescape(url) for url in re.findall(
            r'https://lh3\.googleusercontent\.com/aida/[^\s<>"\']+', text))
        for url in sorted(parser.sources):
            sources.setdefault(url, []).append(str(path.relative_to(ROOT)))
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        results = dict(pool.map(download_image, sorted(sources.items())))
    manifest = {url: result['path'] for url, result in results.items() if 'path' in result}
    font = {'stylesheet_url': FONT_CSS}
    try:
        css, mime, resolved = fetch(FONT_CSS)
        (OUT / 'material-symbols-google.css').write_bytes(css)
        font.update(stylesheet_content_type=mime, stylesheet_resolved_url=resolved)
        urls = re.findall(r'url\((https://[^)]+)\)', css.decode())
        if len(set(urls)) != 1:
            raise ValueError(f'Expected one full font URL, received {len(set(urls))}')
        data, mime, resolved = fetch(urls[0])
        if not data.startswith(b'wOF2'):
            raise ValueError('Font lacks WOFF2 signature')
        (OUT / 'material-symbols-outlined.woff2').write_bytes(data)
        font.update(url=urls[0], resolved_url=resolved, http_status=200,
                    content_type=mime, bytes=len(data), sha256=hashlib.sha256(data).hexdigest(),
                    path='/reference-assets/material-symbols-outlined.woff2')
    except Exception as error:
        font['error'] = str(error)
    (OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    provenance = {'description': 'Exact assets from archived ready_design HTML; no metadata or claims approved by vendoring.',
                  'images': results, 'material_symbols': font}
    (OUT / 'provenance.json').write_text(json.dumps(provenance, indent=2) + '\n')
    failed = {url: result['error'] for url, result in results.items() if 'error' in result}
    print(json.dumps({'images_requested': len(sources), 'images_saved': len(manifest),
                      'failed_images': failed, 'font': font}, indent=2))
    if failed or 'error' in font:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
