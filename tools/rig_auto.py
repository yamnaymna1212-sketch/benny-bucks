"""Measure each character cutout (alpha bbox) so characters can be placed at a consistent size.
Writes studio/src/data/rig-auto.json: {name: {aspect, top, bottom, l, r}} as fractions of the image."""
import json, glob, os
import numpy as np
from PIL import Image
out = {}
for p in sorted(glob.glob('studio/public/gen/*.png')):
    n = os.path.basename(p)[:-4]
    if not n.startswith(('benny-', 'rich-', 'cast-')): continue
    a = np.asarray(Image.open(p).convert('RGBA'))[:, :, 3] > 40
    ys, xs = np.where(a)
    if not len(ys): continue
    h, w = a.shape
    out[n] = {'aspect': round(h / w, 4), 'top': round(ys.min() / h, 4), 'bottom': round(ys.max() / h, 4), 'l': round(xs.min() / w, 4), 'r': round(xs.max() / w, 4)}
json.dump(out, open('studio/src/data/rig-auto.json', 'w'), indent=0)
print(len(out), 'rigs')
