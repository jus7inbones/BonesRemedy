from pathlib import Path
import zipfile, hashlib, sys
root=Path(sys.argv[1] if len(sys.argv)>1 else ".")
ext=root/"extension" if (root/"extension").exists() else root
out=Path(sys.argv[2] if len(sys.argv)>2 else "MetaTruth-release.zip")
with zipfile.ZipFile(out,"w",zipfile.ZIP_DEFLATED) as z:
    for p in ext.rglob("*"):
        if p.is_file(): z.write(p,p.relative_to(ext))
print(out)
print(hashlib.sha256(out.read_bytes()).hexdigest())
