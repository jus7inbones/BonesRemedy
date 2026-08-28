from pathlib import Path
import zipfile, hashlib, json
ROOT=Path(__file__).resolve().parents[1]
EXT=ROOT/'extension'
OUT=ROOT/'dist'
OUT.mkdir(exist_ok=True)
version=json.loads((EXT/'manifest.json').read_text())['version']
zip_path=OUT/f'MetaTruth-Bones-Remedy-Chrome-v{version}.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as z:
    for p in EXT.rglob('*'):
        if p.is_file(): z.write(p,p.relative_to(EXT))
sha=hashlib.sha256(zip_path.read_bytes()).hexdigest()
(zip_path.with_suffix('.sha256')).write_text(sha+'  '+zip_path.name+'\n')
print(zip_path)
print(sha)
