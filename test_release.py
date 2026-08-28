from pathlib import Path
import json,re,zipfile,subprocess,sys
ROOT=Path(__file__).resolve().parents[1]; EXT=ROOT/'extension'
errors=[]
def ok(c,m):
    if not c: errors.append(m)
m=json.loads((EXT/'manifest.json').read_text())
ok(m.get('manifest_version')==3,'Manifest must be MV3')
ok(m.get('version')=='0.4.0','Unexpected version')
for f in ['manifest.json','service-worker.js','content.js','popup.html','popup.js','landing.html','landing.js','admin.html','admin.js','theme.css']:
    ok((EXT/f).exists(),f'Missing {f}')
for html in EXT.glob('*.html'):
    t=html.read_text()
    ok(not re.search(r'<script(?![^>]*src=)[^>]*>',t,re.I),f'Inline script forbidden in {html.name}')
    ok(not re.search(r'\son\w+\s*=',t,re.I),f'Inline event handler forbidden in {html.name}')
for js in EXT.glob('*.js'):
    t=js.read_text(); ok('eval(' not in t,f'eval forbidden: {js.name}'); ok('new Function' not in t,f'new Function forbidden: {js.name}')
# Manifest references
ok((EXT/m['background']['service_worker']).exists(),'Missing service worker')
for cs in m.get('content_scripts',[]):
    for f in cs.get('js',[]): ok((EXT/f).exists(),f'Missing content script {f}')
# No remote JS/CSS imports in extension pages
for html in EXT.glob('*.html'):
    t=html.read_text(); ok('http://' not in t and 'https://' not in t,f'Remote resource in {html.name}')
if errors:
    print('FAIL'); [print(' -',e) for e in errors]; sys.exit(1)
print('Static release checks passed:',len(list(EXT.iterdir())),'extension files')
