import math, random, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

W, H = 1920, 1080
rng = np.random.default_rng(11)
random.seed(11)
PF = "/tmp/pf.ttf"
MONO = "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"
if not os.path.exists(MONO):
    MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
RED = (214, 69, 61)
INK = (26, 26, 28)
YEL = (250, 230, 42)


def pf(size, wght=800):
    f = ImageFont.truetype(PF, size)
    f.set_variation_by_axes([wght])
    return f


def noise(scale, w, h):
    sw, sh = max(2, w // scale), max(2, h // scale)
    a = rng.random((sh, sw)).astype(np.float32)
    im = Image.fromarray((a * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(im, dtype=np.float32) / 255


def paper(w=W, h=H, base=(235, 232, 222)):
    hf = 0.3 * noise(220, w, h) + 0.4 * noise(80, w, h) + 0.2 * noise(30, w, h) + 0.05 * noise(8, w, h)
    ridge = np.abs(noise(90, w, h) - 0.5) * 2
    hf = hf + 0.1 * (1 - ridge) ** 4
    gy, gx = np.gradient(hf)
    shade = np.clip(1 - (gx + gy) * 3.2, 0.94, 1.05)
    grain = 1 + (noise(2, w, h) - 0.5) * 0.04
    arr = np.array(base, dtype=np.float32)[None, None, :] * (shade * grain)[:, :, None]
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    for y in range(40, h, 40):
        for x in range(40, w, 40):
            d.ellipse([x - 2, y - 2, x + 2, y + 2], fill=(206, 203, 193))
    return img


def highlight(img, x0, y0, x1, y1, color=YEL, pad=(12, 4)):
    layer = Image.new("RGB", img.size, (255, 255, 255))
    d = ImageDraw.Draw(layer)
    n = 16
    pts = []
    for i in range(n + 1):
        pts.append((x0 - pad[0] + (x1 - x0 + 2 * pad[0]) * i / n + random.uniform(-2, 2), y0 - pad[1] + random.uniform(-4, 4)))
    for i in range(n, -1, -1):
        pts.append((x0 - pad[0] + (x1 - x0 + 2 * pad[0]) * i / n + random.uniform(-3, 3), y1 + pad[1] + random.uniform(-4, 4)))
    d.polygon(pts, fill=color)
    return ImageChops.multiply(img, layer)


def line_with_highlight(img, x, baseline, parts, font, fill=INK):
    """parts: list of (text, highlighted). Highlights first, then text."""
    cur = x
    spans = []
    for t, hl in parts:
        w = font.getlength(t)
        spans.append((t, hl, cur, cur + w))
        cur += w
    for t, hl, a, b in spans:
        if hl:
            bb = font.getbbox(t.strip(), anchor="ls")
            lead = font.getlength(t) - font.getlength(t.lstrip())
            img = highlight(img, a + lead, baseline + bb[1] + 6, b - (font.getlength(t) - font.getlength(t.rstrip())), baseline + bb[3] - 2)
    d = ImageDraw.Draw(img)
    for t, hl, a, b in spans:
        d.text((a, baseline), t, font=font, fill=fill, anchor="ls")
    return img


def coin_scene():
    S = (560, 640)
    L = Image.new("L", S, 0)
    A = Image.new("L", S, 0)
    dL, dA = ImageDraw.Draw(L), ImageDraw.Draw(A)
    rx, ry, h = 88, 26, 24

    def coin(cx, ytop):
        for x in range(int(cx - rx), int(cx + rx) + 1):
            t = (x - (cx - rx)) / (2 * rx)
            g = int(95 + 135 * (math.sin(t * math.pi) ** 0.7))
            u = (x - cx) / rx
            e = ry * math.sqrt(max(0, 1 - u * u))
            dL.line([(x, ytop), (x, ytop + h + e)], fill=g)
            dA.line([(x, ytop), (x, ytop + h + e)], fill=255)
        box = [cx - rx, ytop - ry, cx + rx, ytop + ry]
        dL.ellipse(box, fill=238)
        dA.ellipse(box, fill=255)
        dL.arc([cx - rx, ytop + h - ry, cx + rx, ytop + h + ry], 0, 180, fill=40, width=4)

    def stack(cx, base_y, n):
        for k in range(n):
            coin(cx, base_y - h * (k + 1))

    stack(290, 430, 12)
    stack(135, 520, 7)
    stack(445, 540, 5)
    stack(300, 610, 1)
    return L, A


def halftone(L, cell=11, angle=45):
    Ln = np.asarray(L, dtype=np.float32) / 255
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


def make_cutout(scale=1.0, cell=7):
    L, A = coin_scene()
    m = halftone(L, cell)
    Aa = np.asarray(A, dtype=np.float32) / 255
    base = np.array((240, 236, 224), dtype=np.float32)
    ink = np.array(INK, dtype=np.float32)
    rgb = base[None, None, :] * (1 - m[:, :, None]) + ink[None, None, :] * m[:, :, None]
    sub = Image.fromarray(np.dstack([rgb, Aa * 255]).astype(np.uint8), "RGBA")
    outline_a = A.filter(ImageFilter.MaxFilter(17)).filter(ImageFilter.GaussianBlur(1.2))
    outline_a = outline_a.point(lambda p: 255 if p > 90 else 0)
    shadow_a = outline_a.filter(ImageFilter.GaussianBlur(14)).point(lambda p: int(p * 0.38))
    out = Image.new("RGBA", sub.size, (0, 0, 0, 0))
    sh = Image.new("RGBA", sub.size, (0, 0, 0, 255))
    sh.putalpha(shadow_a)
    out.alpha_composite(sh, (12, 16))
    red = Image.new("RGBA", sub.size, RED + (255,))
    red.putalpha(outline_a)
    out.alpha_composite(red)
    out.alpha_composite(sub)
    if scale != 1.0:
        out = out.resize((int(out.width * scale), int(out.height * scale)), Image.LANCZOS)
    return out


def bez(p0, p1, p2, n=40):
    pts = []
    for i in range(n + 1):
        t = i / n
        x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0]
        y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]
        pts.append((x + random.uniform(-1.5, 1.5), y + random.uniform(-1.5, 1.5)))
    return pts


def arrow(img, p0, p1, p2, width=9):
    d = ImageDraw.Draw(img)
    pts = bez(p0, p1, p2)
    d.line(pts, fill=RED, width=width, joint="curve")
    for p in pts[::4]:
        d.ellipse([p[0] - width / 2, p[1] - width / 2, p[0] + width / 2, p[1] + width / 2], fill=RED)
    ex, ey = pts[-1]
    bx, by = pts[-6]
    ang = math.atan2(ey - by, ex - bx)
    for da in (math.radians(28), -math.radians(28)):
        a = ang + math.pi + da
        d.line([(ex, ey), (ex + 46 * math.cos(a), ey + 46 * math.sin(a))], fill=RED, width=width)
        d.ellipse([ex - width / 2, ey - width / 2, ex + width / 2, ey + width / 2], fill=RED)


def paste_shadowed_rect(img, box, fill):
    x0, y0, x1, y1 = box
    sh = Image.new("L", img.size, 0)
    ImageDraw.Draw(sh).rectangle([x0 + 8, y0 + 10, x1 + 8, y1 + 10], fill=110)
    sh = sh.filter(ImageFilter.GaussianBlur(9))
    black = Image.new("RGB", img.size, (0, 0, 0))
    img.paste(black, (0, 0), sh)
    ImageDraw.Draw(img).rectangle(box, fill=fill)


