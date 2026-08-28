from pathlib import Path
import json,re,sys,zipfile
root=Path(sys.argv[1] if len(sys.argv)>1 else ".")
ext=root/"extension" if (root/"extension").exists() else root
m=json.loads((ext/"manifest.json").read_text())
assert m["manifest_version"]==3
assert m["version"]=="0.5.0"
for f in ["service-worker.js","content.js","admin.html","admin-v05.js","source-scoring.js","evidence-normalizer.js","claim-comparison.js"]:
    assert (ext/f).exists(), f
for html in ext.glob("*.html"):
    s=html.read_text()
    assert not re.search(r'onclick\s*=',s,re.I), f"inline onclick in {html.name}"
    assert "<script>" not in s.lower(), f"inline script in {html.name}"
for js in ext.glob("*.js"):
    s=js.read_text()
    assert "eval(" not in s
    assert "new Function(" not in s
print("PASS: static release checks")
