#!/usr/bin/env python3
"""Process every photo listed in assets/people/people.json into a collage cutout.

Usage: python build_library.py [assets/people] [gray|halftone]

For each person with a "file" set, the photo must exist in assets/people/raw/ and the entry must
record its license and source URL. Entries missing that record are skipped with a warning, so
you always know where every image came from (and can show it if a claim is filed).
"""
import json
import pathlib
import subprocess
import sys

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "assets/people")
mode = sys.argv[2] if len(sys.argv) > 2 else "gray"
here = pathlib.Path(__file__).resolve().parent
raw, out = root / "raw", root / "cutouts"
out.mkdir(parents=True, exist_ok=True)
meta = json.loads((root / "people.json").read_text(encoding="utf-8"))

done, skipped = [], []
for p in meta["people"]:
    f = p.get("file")
    if not f:
        continue
    if not (p.get("license") and p.get("source_url")):
        skipped.append((p["name"], "license or source_url missing"))
        continue
    src = raw / f
    if not src.exists():
        skipped.append((p["name"], "file not found in raw/"))
        continue
    dst = out / (pathlib.Path(f).stem + ".png")
    subprocess.run([sys.executable, str(here / "cutout.py"), str(src), str(dst), "--mode", mode], check=True)
    p["cutout"] = f"cutouts/{dst.name}"
    done.append(p["name"])

(root / "people.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
print("processed:", done or "none")
for name, why in skipped:
    print("SKIPPED:", name, "-", why)
