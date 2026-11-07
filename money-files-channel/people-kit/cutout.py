#!/usr/bin/env python3
"""Turn a photo of a person or object into a paper-collage cutout.

Usage:
  python cutout.py input.jpg output.png --mode gray        # grayscale photo, red outline (like the Musk frame)
  python cutout.py input.jpg output.png --mode halftone    # halftone dots, red outline (like the Buffett frame)

If the input already has a transparent background it is used as is.
Otherwise the background is removed with rembg (pip install rembg onnxruntime).
Only use photos you have the right to use (public domain, CC with attribution, or your own).
"""
import argparse
import math
import sys

import numpy as np
from PIL import Image, ImageFilter, ImageOps

RED = (214, 69, 61)
INK = (26, 26, 28)


def load_subject(path):
    im = Image.open(path).convert("RGBA")
    if np.asarray(im)[:, :, 3].min() < 250:
        return im
    try:
        from rembg import remove
    except ImportError:
        sys.exit("The image has no transparent background and rembg is not installed.\n"
                 "Run: pip install rembg onnxruntime   (or supply a PNG with transparency)")
    return remove(im)


def halftone_mask(gray, cell, angle=45):
    Ln = np.asarray(gray, dtype=np.float32) / 255
    h, w = Ln.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    th = math.radians(angle)
    c, s = math.cos(th), math.sin(th)
    u = xx * c + yy * s
    v = -xx * s + yy * c
    cu = (np.floor(u / cell) + 0.5) * cell
    cv = (np.floor(v / cell) + 0.5) * cell
    cx = cu * c - cv * s
    cy = cu * s + cv * c
    cxi = np.clip(cx.round().astype(int), 0, w - 1)
    cyi = np.clip(cy.round().astype(int), 0, h - 1)
    lum = Ln[cyi, cxi]
    r = cell * 0.74 * np.sqrt(np.clip(1 - lum, 0, 1))
    dist = np.sqrt((u - cu) ** 2 + (v - cv) ** 2)
    return np.clip(r - dist + 0.5, 0, 1)


def build(src, dst, mode, height, cell, outline):
    im = load_subject(src)
    box = im.getchannel("A").point(lambda p: 255 if p > 20 else 0).getbbox()
    if box is None:
        sys.exit("Nothing left after background removal.")
    im = im.crop(box)
    k = height / im.height
    im = im.resize((max(1, round(im.width * k)), height), Image.LANCZOS)
    A = im.getchannel("A")
    gray = ImageOps.autocontrast(im.convert("L"), cutoff=1)
    if mode == "halftone":
        m = halftone_mask(gray, cell)
        base = np.array((240, 236, 224), dtype=np.float32)
        ink = np.array(INK, dtype=np.float32)
        rgb = base[None, None, :] * (1 - m[:, :, None]) + ink[None, None, :] * m[:, :, None]
    else:
        g = np.asarray(gray, dtype=np.float32)
        g = np.clip((g - 128) * 1.12 + 128, 0, 255)
        warm = np.array((1.0, 0.985, 0.95), dtype=np.float32)
        rgb = np.dstack([g, g, g]) * warm[None, None, :]
    subject = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), np.asarray(A)]).astype(np.uint8), "RGBA")

    pad = outline * 3 + 40
    canvas_size = (subject.width + 2 * pad, subject.height + 2 * pad)
    A_full = Image.new("L", canvas_size, 0)
    A_full.paste(A, (pad, pad))
    A_full = A_full.point(lambda p: 255 if p > 128 else 0)
    ring = A_full.filter(ImageFilter.MaxFilter(outline * 2 + 1)).filter(ImageFilter.GaussianBlur(1.2))
    ring = ring.point(lambda p: 255 if p > 90 else 0)
    shadow = ring.filter(ImageFilter.GaussianBlur(16)).point(lambda p: int(p * 0.38))

    out = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    sh = Image.new("RGBA", canvas_size, (0, 0, 0, 255))
    sh.putalpha(shadow)
    out.alpha_composite(sh, (12, 16))
    red = Image.new("RGBA", canvas_size, RED + (255,))
    red.putalpha(ring)
    out.alpha_composite(red)
    out.alpha_composite(subject, (pad, pad))
    out.save(dst)
    print("saved", dst, out.size)


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--mode", choices=["gray", "halftone"], default="gray")
    ap.add_argument("--height", type=int, default=900)
    ap.add_argument("--cell", type=int, default=7, help="halftone dot spacing in px")
    ap.add_argument("--outline", type=int, default=8, help="red outline thickness in px")
    a = ap.parse_args()
    build(a.input, a.output, a.mode, a.height, a.cell, a.outline)
