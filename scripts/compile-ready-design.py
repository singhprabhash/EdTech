#!/usr/bin/env python3
"""Compile user-supplied layout inputs into inert React presentation data. No JS execution."""
import hashlib
import json
import re
import sys
import unicodedata
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
ALLOWED = set('header main footer section article aside nav div span p a button input select option label form h1 h2 h3 h4 h5 h6 ul ol li strong b em i small sup sub br hr img figure figcaption table thead tbody tr th td dl dt dd pre code blockquote svg path circle rect line polyline title details summary dialog'.split())

class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = {'tag':'root','attrs':{},'children':[]}
        self.stack = [self.root]
    def handle_starttag(self, tag, attrs):
        node = {'tag':tag,'attrs':dict(attrs),'children':[]}
        self.stack[-1]['children'].append(node)
        if tag not in VOID: self.stack.append(node)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID: self.handle_endtag(tag)
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i]['tag'] == tag:
                self.stack = self.stack[:i]
                return
    def handle_data(self, data):
        if data.strip(): self.stack[-1]['children'].append(data)

def parse_fragment(source):
    parser = Parser(); parser.feed(source)
    return parser.root['children']

def walk(node):
    if isinstance(node, dict):
        yield node
        for child in node['children']: yield from walk(child)

def text(node):
    if isinstance(node,str): return node
    return ' '.join(text(n).strip() for n in node['children']).strip()

def label_text(node):
    if isinstance(node,str): return node.strip()
    if 'material-symbols-outlined' in node['attrs'].get('class',''): return ''
    return ' '.join(label_text(n) for n in node['children']).strip()

def slug(value):
    return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',value).encode('ascii','ignore').decode().lower()).strip('-')

def sanitize(node):
    if isinstance(node,str): return node
    if node['tag'] not in ALLOWED: return None
    attrs = {}
    for key,value in node['attrs'].items():
        if key.startswith('on') or key in {'srcdoc','formaction'}: continue
        if key in {'href','src'} and value and not re.match(r'^(?:https?://|mailto:|tel:|/|#)', value): continue
        if key == 'style' and value and re.search(r'expression|javascript:|url\(',value,re.I): continue
        if key == 'class' and value:
            value=value.replace('text-primary-fixed-dim/90','text-primary-fixed-dim')
            if 'bg-surface-container-lowest' in value:value=value.replace('text-on-tertiary-container','text-tertiary').replace('text-secondary-container','text-secondary')
            value=value.replace('bg-[#011633]', 'bg-primary-dark').replace('bg-[#1F58C4]', 'bg-primary').replace('text-[#011633]', 'text-primary').replace('text-[#1F58C4]', 'text-secondary')
        attrs[key] = value if value is not None else ''
    children = [sanitize(c) for c in node['children']]
    return {'tag':node['tag'],'attrs':attrs,'children':[c for c in children if c is not None]}

def compile_design():
    manifest = json.loads((ROOT/'public/reference-assets/manifest.json').read_text())
    sources = {}
    hashes = {}
    for key,filename in [('home','index.html'),('catalogue','catalog.html'),('subject','catagory.html'),('detail','book_detail.html')]:
        source = (ROOT/'ready_design'/filename).read_text()
        sources[key] = parse_fragment(source)
        hashes[filename] = hashlib.sha256(source.encode()).hexdigest()
    records = []
    for collection in ['catalogue','subject']:
        for root in sources[collection]:
            for node in walk(root):
                a=node['attrs']
                if node['tag']!='article' or 'book-card' not in a.get('class',''): continue
                title_node=next((n for n in walk(node) if n['tag']=='h2'),None)
                if title_node is None: title_node=next((n for n in walk(node) if n['tag']=='h3'),None)
                title=a.get('data-title') or (text(title_node) if title_node else '')
                cite=next((n for n in walk(node) if 'data-book' in n['attrs']),None)
                citation=cite['attrs'] if cite else {}
                author=a.get('data-author') or citation.get('data-authors','')
                isbn=a.get('data-isbn') or citation.get('data-isbn','')
                img=next((n for n in walk(node) if n['tag']=='img'),None)
                record={'id':collection+'-'+str(len(records)+1),'slug':slug(title),'title':title,'author':author,'isbn':isbn,'subject':a.get('data-subject','Horticulture'),'year':a.get('data-year',''),'language':a.get('data-lang',''),'type':a.get('data-type',a.get('data-format','Monograph')),'category':a.get('data-category',''),'format':a.get('data-format',''),'description':a.get('data-search',''),'cover':manifest.get(img['attrs'].get('src',''),'') if img else '', 'collection':collection}
                # Same title can represent a different supplied edition; never merge by title.
                if any(r['slug']==record['slug'] for r in records): record['slug']+='-'+record['year']+'-'+isbn.replace('-','')[-4:]
                records.append(record)
                a['data-record-id']=record['id']
                a['data-slug']=record['slug']
    for root in sources['detail']:
        for node in walk(root):
            if node['tag']!='div' or 'bg-surface-container-lowest rounded-xl shadow-md hover:shadow-xl p-6' not in node['attrs'].get('class',''): continue
            heading=next((n for n in walk(node) if n['tag']=='h4'),None)
            match=re.search(r'ISBN:\s*([\d-]+)\s*•\s*(\d{4})',text(node))
            if heading is None or match is None: continue
            author=next((label_text(n)[3:] for n in walk(node) if n['tag']=='p' and label_text(n).startswith('By ')),'')
            image=next((n for n in walk(node) if n['tag']=='img'),None)
            subject=next((label_text(n) for n in walk(node) if n['tag']=='div' and 'absolute top-3 left-3' in n['attrs'].get('class','')),'')
            records.append({'id':'related-'+str(len(records)+1),'slug':slug(text(heading)),'title':text(heading),'author':author,'isbn':match[1],'year':match[2],'subject':subject,'language':'','type':'','cover':manifest.get(image['attrs']['src'],'') if image else '', 'collection':'related'})
    detail_slug=next(r['slug'] for r in records if r['title'].startswith('Frontier Agronomy'))
    paths={'home':'/','books':'/books','subjects':'/subjects','publish-with-us':'/publish-with-us','submit-a-manuscript':'/publish-with-us#publishing-enquiries','services':'/#publishing-services','book-chapters':'/#book-chapters','about':'/#about','contact':'/contact'}

    def convert(node, page, ancestors=None):
        ancestors=ancestors or []
        if isinstance(node,str):
            url=node.strip()
            if url in manifest:
                return {'tag':'img','attrs':{'src':manifest[url],'alt':'EdTech Publications circular seal','width':'512','height':'512','class':'w-full h-full object-contain'},'children':[]}
            return node
        original=node
        node=sanitize({**node,'children':[]})
        if node is None: return None
        a=node['attrs']; raw=original['attrs']; tag=node['tag']; label=label_text(original)
        for key in ['src','poster']:
            if key in a:
                if a[key] in manifest: a[key]=manifest[a[key]]
                elif a[key].startswith('https://lh3.googleusercontent.com'): raise ValueError('Missing local asset '+a[key])
        if tag=='img':
            a.setdefault('alt',raw.get('data-alt','Academic book artwork from supplied reference'))
            a.setdefault('width','600'); a.setdefault('height','850')
            a['decoding']='async'
            if page!='home': a['loading']='lazy'
        if tag=='span' and 'material-symbols-outlined' in a.get('class',''): a['aria-hidden']='true'
        if tag=='main': a['id']='main'; a['tabindex']='-1'
        if page=='subject' and raw.get('role')=='tablist':a['role']='group'
        if page=='subject' and 'filter-btn' in raw.get('class',''):
            a.pop('role',None);a.pop('aria-selected',None);a.pop('tabindex',None)
        if raw.get('id')=='mobile-menu-drawer' and page=='header':
            node['tag']='nav';a['aria-label']='Mobile navigation';a.pop('aria-modal',None);a.pop('role',None)
        if tag=='div' and 'shadow-lg' in raw.get('class','') and any(n['attrs'].get('id')=='catalog-search-hero' for n in walk(original)):
            node['tag']='form';a.update({'action':'/books','method':'get','role':'search'})
        if tag=='div' and any(isinstance(c,dict) and c['tag']=='input' for c in original['children']) and page=='header':
            node['tag']='form';a.update({'action':'/books','method':'get','role':'search'})
        if raw.get('id')=='toast-notification': return None
        if any(isinstance(c,dict) and c['attrs'].get('id')=='pag-visible-count' for c in original['children']):a['id']='category-pagination-summary'
        if tag=='section' and page=='home':
            if 'Upholding the rigour' in label: a['id']='about'
            if 'Single & Multi-Author Books' in label: a['id']='publishing-services'
        if page=='home' and tag=='div' and 'Edited Collections' in label and 'Book Chapters & Anthologies' in label and len(label)<650 and any(isinstance(c,dict) and c['tag']=='a' for c in original['children']): a['id']='book-chapters'
        if tag=='div' and 'Institutional & University Library Acquisitions' in label and 'border border-outline-variant/40 rounded-2xl p-5' in raw.get('class',''):
            a['class']=a.get('class','')+' ready-acquisitions'
        if tag=='a':
            path=raw.get('data-path')
            if path in paths: a['href']=paths[path]
            if a.get('href','').startswith('#') or not a.get('href'):
                if 'Download' in label or 'download' in label.lower():
                    a['href']='mailto:edtechpublications@gmail.com?subject='+quote('Request '+label.replace('download','').replace('Download','').strip())
                    a['data-request-download']='true'
                else: a['href']='/contact'
            if path=='books' and ('View' in label or 'Details' in label):
                for parent in reversed(ancestors):
                    content=label_text(parent)
                    matches=[r for r in records if r['title'] in content]
                    if len(matches)==1 and len(content)<1800:
                        a['href']='/books/'+matches[0]['slug']; break
            if any(word in label for word in ['View Details','Details']) and not path:
                parent=next((p for p in reversed(ancestors) if p['tag']=='article'),None)
                if parent and parent['attrs'].get('data-slug'): a['href']='/books/'+parent['attrs']['data-slug']
            if path=='subjects':
                if 'Horticulture' in label or 'Pomology' in label: a['href']='/subjects/horticulture-pomology'
                elif any(x in label for x in ['Agronomy','Soil','Protection','Biotechnology','Food','Agroforestry','Allied']):
                    subject=next((value for alias,value in [('Agronomy','Agronomy'),('Soil','Soil Science'),('Protection','Plant Protection'),('Biotechnology','Biotechnology'),('Food','Food & Nutrition'),('Agroforestry','Agroforestry'),('Allied','Allied Sciences')] if alias in label),'')
                    a['href']='/books?subject='+quote(subject)
            if any(p['tag']=='nav' and p['attrs'].get('aria-label','').startswith('Breadcrumb') for p in ancestors):
                if label=='Home':a['href']='/'
                elif label in ['Catalogue','Books']:a['href']='/books'
                elif label.startswith('Agronomy'):a['href']='/books?subject=Agronomy'
            if re.match(r'^10\.\d{4,9}/\S+$',label):a['href']='https://doi.org/'+label
            if 'Privacy Policy'==label or 'Terms of Use'==label or 'Shipping & Returns'==label:
                node['tag']='span';a.pop('href',None);a['aria-disabled']='true';a['title']='Approved policy document not supplied'
            if 'Download' in label:
                a['href']='mailto:edtechpublications@gmail.com?subject='+quote('Request '+label.replace('Download','').strip());a['data-request-download']='true';a.pop('download',None)
            if raw.get('href')=='#request-quotation': a['href']='/contact?topic=Library%20quotation'
            if 'doi.org' in raw.get('href',''): a['href']='https://doi.org/'+raw['href'].split('doi.org/')[-1]
        if tag=='button':
            a['type']=a.get('type','button')
            if label.strip()=='Search' and page=='home': a['type']='submit'
            action=raw.get('onclick','')
            if 'switchTab' in action:
                tab=re.search(r"switchTab\('([^']+)'\)",action)
                if tab: a['data-tab']=tab[1];a['role']='tab';a['aria-selected']='true' if tab[1]=='overview' else 'false';a['aria-controls']='tab-pane-'+tab[1];a['tabindex']='0' if tab[1]=='overview' else '-1'
            if 'openCitationModal' in action: a['data-open-citation']='true'
            if 'closeCitationModal' in action: a['data-close-citation']='true';a.setdefault('aria-label','Close citation')
            if 'copyCitation' in action:
                target=re.search(r"copyCitation\('([^']+)'\)",action)
                if target:a['data-copy-target']=target[1]
            if 'downloadSample' in action or 'Download TOC' in label or label.strip()=='file_download Download TOC PDF':
                node['tag']='a';a['href']='mailto:edtechpublications@gmail.com?subject='+quote('Request sample or contents: Frontier Agronomy');a.pop('type',None);a['data-request-download']='true'
            if tag=='button' and 'account_balance'==label.strip():
                node['tag']='a';a['href']='/contact?topic=Library%20quotation';a['aria-label']='Request library quotation';a.pop('type',None)
        if raw.get('id','').startswith('tab-pane-'):
            a['role']='tabpanel';a['aria-labelledby']=raw['id'].replace('tab-pane-','tab-btn-')
        if raw.get('id')=='citation-modal':node['tag']='dialog';a['role']='dialog';a['aria-modal']='true';a.setdefault('aria-label','Publication citation');a['tabindex']='-1'
        if tag=='input':
            a.setdefault('aria-label','Search the catalogue');a.setdefault('maxlength','200')
            if a.get('type','text') in ['text','search']:
                a['type']='search';a['name']='q'
        if tag=='button' and page=='subject' and label.strip() in ['Next','2']:
            a['disabled']='';a['aria-label']=label.strip()+' — No additional supplied pages';a['title']='All supplied titles are on this page'
        if tag=='select':a.setdefault('aria-label','Sort catalogue' if 'sort' in a.get('id','').lower() else 'Filter catalogue')
        if tag=='form':a['action']='/books';a['method']='get';a['role']='search'
        a.pop('selected',None)
        children=[convert(c,page,ancestors+[original]) for c in original['children']]
        node['children']=[c for c in children if c is not None]
        if raw.get('data-record-id'):
            r=next(r for r in records if r['id']==raw['data-record-id'])
            for n in walk(node):
                if n['tag']=='a' and ('Details' in text(n) or text(n).strip().startswith('View')):n['attrs']['href']='/books/'+r['slug']
        return node

    pages={}
    for key,roots in sources.items():
        whole={'tag':'root','attrs':{},'children':roots}
        main=next(n for n in walk(whole) if n['tag']=='main')
        footer=next(n for n in walk(whole) if n['tag']=='footer')
        main_nodes={id(n) for n in walk(main)}
        overlays=[convert(n,key) for n in walk(whole) if n['attrs'].get('id')=='citation-modal' and id(n) not in main_nodes]
        pages[key]={'main':convert(main,key),'footer':convert(footer,key),'overlays':overlays}
        for node in walk(pages[key]['footer']):
            classes=node['attrs'].get('class','')
            node['attrs']['class']=classes.replace('text-slate-400','text-primary-fixed-dim').replace('text-slate-300','text-primary-fixed').replace('text-slate-200','text-on-primary-container')
    home_root={'tag':'root','attrs':{},'children':sources['home']}
    header=next(n for n in walk(home_root) if n['tag']=='header')
    pages['header']=convert(header,'header')
    pages['sources']=hashes
    pages['detailSlug']=detail_slug
    # Convert only the literal Tailwind object; never evaluate source JavaScript.
    source=(ROOT/'ready_design/index.html').read_text()
    literal=re.search(r'tailwind.config\s*=\s*(\{[\s\S]*?\});',source)[1]
    literal=re.sub(r'([,{]\s*)([A-Za-z][A-Za-z0-9]*)\s*:',r'\1"\2":',literal)
    literal=re.sub(r',\s*([}\]])',r'\1',literal)
    theme=json.loads(literal)['theme']['extend']
    brand=json.loads((ROOT/'src/config/brand-theme.json').read_text())
    theme['colors']=brand['colors']
    theme['fontSize']['body-md'][0]=brand['bodySize']
    theme['fontSize']['body-md'][1]['lineHeight']=brand['bodyLineHeight']
    for family in theme['fontFamily'].values():
        family.insert(-1, '"Noto Sans Devanagari"')
    css=['/* Generated from archived reference typography + src/config/brand-theme.json. Run npm run reference:compile. */','@theme {']
    for k,v in theme['colors'].items():css.append(f'  --color-{k}: {v};')
    for k,v in theme['fontFamily'].items():css.append(f'  --font-{k}: '+', '.join(v)+';')
    for k,(size,options) in theme['fontSize'].items():
        css.append(f'  --text-{k}: {size};')
        for prop,v in options.items():css.append(f'  --text-{k}--'+re.sub(r'([A-Z])',lambda m:'-'+m[1].lower(),prop)+f': {v};')
    for k,v in theme['spacing'].items():css.append(f'  --spacing-{k}: {v};')
    css += ['  --radius-lg: 0.25rem;','  --radius-xl: 0.5rem;','}', '']
    return {'src/content/ready-pages.json':json.dumps(pages,ensure_ascii=False,indent=2)+'\n','src/content/ready-catalogue.json':json.dumps(records,ensure_ascii=False,indent=2)+'\n','src/app/ready-theme.css':'\n'.join(css)}

def main():
    outputs=compile_design(); stale=[]
    for name,content in outputs.items():
        path=ROOT/name
        if '--check' in sys.argv:
            if not path.exists() or path.read_text()!=content:stale.append(name)
        else:path.parent.mkdir(parents=True,exist_ok=True);path.write_text(content)
    if stale:print('Stale ready-design outputs: '+', '.join(stale));return 1
    print('Ready-design '+('outputs verified' if '--check' in sys.argv else 'compiled')+': '+str(len(outputs))+' files')
    return 0

if __name__=='__main__':sys.exit(main())
