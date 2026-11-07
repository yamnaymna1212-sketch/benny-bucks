import io, sys, subprocess
import cairosvg
from lib import *

sys.path.insert(0, "/home/claude/people-kit")
import cutout as cut_tool

OUT = "/home/claude/collage/"
ICONS = "/home/claude/visual-world-kit/icons/gold/"
MONOF = lambda s: ImageFont.truetype(MONO, s)
GREY = (96, 94, 86)


def add_ring_shadow(sub, outline=7, blur=14, off=(12, 16)):
    pad = outline * 3 + 30
    cs = (sub.width + 2 * pad, sub.height + 2 * pad)
    A = Image.new("L", cs, 0)
    A.paste(sub.getchannel("A"), (pad, pad))
    A = A.point(lambda p: 255 if p > 128 else 0)
    ring = A.filter(ImageFilter.MaxFilter(outline * 2 + 1)).filter(ImageFilter.GaussianBlur(1.2)).point(lambda p: 255 if p > 90 else 0)
    shadow = ring.filter(ImageFilter.GaussianBlur(blur)).point(lambda p: int(p * 0.38))
    out = Image.new("RGBA", cs, (0, 0, 0, 0))
    sh = Image.new("RGBA", cs, (0, 0, 0, 255))
    sh.putalpha(shadow)
    out.alpha_composite(sh, off)
    red = Image.new("RGBA", cs, RED + (255,))
    red.putalpha(ring)
    out.alpha_composite(red)
    out.alpha_composite(sub, (pad, pad))
    return out


def sticker(name, size=150, rot=0):
    svg = open(ICONS + name + ".svg").read().replace("#C9A24B", "#1A1A1C").replace("#B3261E", "#D6453D")
    png = cairosvg.svg2png(bytestring=svg.encode(), output_width=size, output_height=size)
    ic = Image.open(io.BytesIO(png)).convert("RGBA")
    p = 26
    chip = Image.new("RGBA", (size + 2 * p, size + 2 * p), (0, 0, 0, 0))
    ImageDraw.Draw(chip).rounded_rectangle([0, 0, size + 2 * p - 1, size + 2 * p - 1], radius=36, fill=(243, 239, 228, 255))
    chip.alpha_composite(ic, (p, p))
    return add_ring_shadow(chip, outline=6).rotate(rot, expand=True, resample=Image.BICUBIC)


def figure(kind, mode, height):
    W_, H_ = 600, 800
    L = Image.new("L", (W_, H_), 0)
    A = Image.new("L", (W_, H_), 0)
    d, a = ImageDraw.Draw(L), ImageDraw.Draw(A)
    if kind == "suit":
        a.rounded_rectangle([40, 420, 560, 800], radius=150, fill=255)
        a.ellipse([195, 70, 405, 350], fill=255)
        a.rectangle([255, 320, 345, 440], fill=255)
        d.rounded_rectangle([40, 420, 560, 800], radius=150, fill=75)
        d.ellipse([195, 70, 405, 350], fill=205)
        d.rectangle([255, 320, 345, 440], fill=185)
        d.pieslice([185, 55, 415, 270], 180, 360, fill=110)
        d.polygon([(255, 430), (345, 430), (300, 610)], fill=235)
        d.polygon([(255, 430), (212, 650), (300, 615)], fill=30)
        d.polygon([(345, 430), (388, 650), (300, 615)], fill=30)
        d.polygon([(290, 455), (310, 455), (318, 590), (300, 645), (282, 590)], fill=22)
    else:
        a.rounded_rectangle([20, 470, 580, 800], radius=170, fill=255)
        a.ellipse([120, 50, 480, 570], fill=255)
        d.rounded_rectangle([20, 470, 580, 800], radius=170, fill=60)
        d.ellipse([120, 50, 480, 570], fill=48)
        d.ellipse([120, 50, 480, 570], outline=135, width=7)
        d.ellipse([205, 185, 395, 440], fill=6)
        d.ellipse([205, 185, 395, 440], outline=95, width=4)
    yy, xx = np.mgrid[0:H_, 0:W_]
    vig = 0.72 + 0.4 * np.exp(-(((xx - 270) / 320) ** 2 + ((yy - 300) / 470) ** 2))
    arr = np.clip(np.asarray(L, dtype=np.float32) * vig, 0, 255).astype(np.uint8)
    Lb = Image.fromarray(arr).filter(ImageFilter.GaussianBlur(1.6))
    src = "/tmp/fig_%s.png" % kind
    Image.merge("RGBA", (Lb, Lb, Lb, A)).save(src)
    dst = "/tmp/fig_%s_%s.png" % (kind, mode)
    cut_tool.build(src, dst, mode, height, 7, 8)
    return Image.open(dst).convert("RGBA")


def tag(img, xy, text, size=46):
    d = ImageDraw.Draw(img)
    f = pf(size, 600)
    w = int(f.getlength(text) + 76)
    d.rectangle([xy[0], xy[1], xy[0] + w, xy[1] + 80], fill=RED)
    d.text((xy[0] + w / 2, xy[1] + 42), text, font=f, fill=(255, 255, 255), anchor="mm")


def shadow_paste(canvas, rgba, xy, blur=10, off=(8, 12), alpha=0.35):
    pad = 40
    big = Image.new("RGBA", (rgba.width + 2 * pad, rgba.height + 2 * pad), (0, 0, 0, 0))
    big.alpha_composite(rgba, (pad, pad))
    a = big.getchannel("A").filter(ImageFilter.GaussianBlur(blur)).point(lambda p: int(p * alpha))
    s = Image.new("RGBA", big.size, (0, 0, 0, 255))
    s.putalpha(a)
    canvas.alpha_composite(s, (xy[0] - pad + off[0], xy[1] - pad + off[1]))
    canvas.alpha_composite(big, (xy[0] - pad, xy[1] - pad))


def caption(canvas, parts, xy, size=54, rot=-0.6):
    f = pf(size, 600)
    w = int(sum(f.getlength(t) for t, _ in parts) + 110)
    h = int(size * 2.1)
    strip = Image.new("RGB", (w, h), (246, 243, 233))
    strip = line_with_highlight(strip, 55, int(h * 0.66), parts, f)
    ImageDraw.Draw(strip).rectangle([0, 0, w - 1, h - 1], outline=(40, 40, 42), width=2)
    rgba = strip.convert("RGBA").rotate(rot, expand=True, resample=Image.BICUBIC)
    shadow_paste(canvas, rgba, xy)


def corner_labels(canvas, idx):
    d = ImageDraw.Draw(canvas)
    d.text((W - 110, 96), "%02d / 04" % idx, font=MONOF(34), fill=INK, anchor="rm")
    d.text((W - 110, 134), "SAMPLE LAYOUT", font=MONOF(20), fill=GREY, anchor="rm")


def arrow2(img, p0, p1, p2, color=INK, width=6, dashed=True):
    d = ImageDraw.Draw(img)
    pts = bez(p0, p1, p2, 60)
    for i in range(0, len(pts) - 1):
        if dashed and (i // 3) % 2 == 1:
            continue
        d.line([pts[i], pts[i + 1]], fill=color, width=width)
        d.ellipse([pts[i][0] - width / 2, pts[i][1] - width / 2, pts[i][0] + width / 2, pts[i][1] + width / 2], fill=color)
    ex, ey = pts[-1]
    bx, by = pts[-5]
    ang = math.atan2(ey - by, ex - bx)
    for da in (math.radians(28), -math.radians(28)):
        a = ang + math.pi + da
        d.line([(ex, ey), (ex + 40 * math.cos(a), ey + 40 * math.sin(a))], fill=color, width=width)


def doc_card(w=520, h=600):
    c = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    d.rectangle([0, 0, w - 1, h - 1], fill=(250, 248, 240, 255), outline=(60, 58, 52, 255), width=2)
    d.text((40, 52), "OFFICIAL RECORD", font=MONOF(26), fill=INK, anchor="lm")
    d.line([(40, 84), (w - 40, 84)], fill=INK, width=3)
    y = 125
    for i in range(12):
        bw = random.randint(int(w * 0.5), w - 90)
        if i == 6:
            d.rectangle([32, y - 10, w - 40, y + 24], fill=(250, 230, 42, 235))
        d.rectangle([40, y, 40 + bw, y + 12], fill=(120, 118, 108, 255))
        y += 38
    return c


def stamp(text="EVIDENCE", rot=-13):
    w, h = 400, 130
    s = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(s)
    d.rectangle([4, 4, w - 5, h - 5], outline=RED + (255,), width=8)
    d.rectangle([18, 18, w - 19, h - 19], outline=RED + (255,), width=2)
    d.text((w / 2, h / 2 + 2), text, font=MONOF(60), fill=RED + (255,), anchor="mm")
    a = np.asarray(s.getchannel("A"), dtype=np.float32)
    keep = (noise(3, w, h) > 0.16).astype(np.float32)
    s.putalpha(Image.fromarray((a * keep * 0.92).astype(np.uint8)))
    return s.rotate(rot, expand=True, resample=Image.BICUBIC)


def tape(rot):
    t = Image.new("RGBA", (170, 48), (226, 214, 160, 185))
    return t.rotate(rot, expand=True, resample=Image.BICUBIC)


# ---------------- Frame 1: hook + personage + icons + caption ----------------
img = paper()
tag(img, (130, 108), "Feb 21, 2025")
big = pf(112, 800)
img = line_with_highlight(img, 130, 370, [("The ", False), ("Largest", True), (" Crypto", False)], big)
img = line_with_highlight(img, 130, 510, [("Heist in History", False)], big)
cv = img.convert("RGBA")
hood = figure("hood", "gray", 830)
cv.alpha_composite(hood, (1220, 170))
cv.alpha_composite(sticker("warning", 130, -8), (120, 560))
cv.alpha_composite(sticker("padlock", 130, 7), (390, 580))
caption(cv, [("It all happened in a ", False), ("single day.", True)], (130, 880))
corner_labels(cv, 1)
cv.convert("RGB").save(OUT + "style_1_hook.png")

# ---------------- Frame 2: document + evidence + personage (halftone) ----------------
img = paper()
big = pf(96, 800)
img = line_with_highlight(img, 130, 200, [("Follow the ", False), ("Paper Trail", True)], big)
cv = img.convert("RGBA")
card = doc_card().rotate(-4, expand=True, resample=Image.BICUBIC)
shadow_paste(cv, card, (170, 260), blur=14, off=(10, 14), alpha=0.4)
cv.alpha_composite(tape(32), (125, 222))
cv.alpha_composite(tape(-30), (580, 214))
cv.alpha_composite(stamp(), (360, 640))
cv.alpha_composite(sticker("magnifier", 190, 8), (610, 300))
cv.alpha_composite(sticker("document", 140, -6), (800, 640))
suit = figure("suit", "halftone", 650)
cv.alpha_composite(suit, (1180, 230))
caption(cv, [("The FBI later named ", False), ("North Korea.", True)], (130, 900))
corner_labels(cv, 2)
cv.convert("RGB").save(OUT + "style_2_document.png")

# ---------------- Frame 3: money flow map ----------------
img = paper()
big = pf(96, 800)
img = line_with_highlight(img, 130, 200, [("Where the ", False), ("Money", True), (" Went", False)], big)
cv = img.convert("RGBA")
names = [("bank", "EXCHANGE"), ("wallet", "ATTACKER WALLET"), ("network", "SPLIT ACROSS WALLETS"), ("coins", "CONVERTED")]
centers = [(320, 600), (760, 470), (1200, 640), (1620, 540)]
size = 190
half = (size + 52) // 2
for (n, lab), (ccx, ccy), rot in zip(names, centers, [-5, 4, -3, 6]):
    st = sticker(n, size, rot)
    cv.alpha_composite(st, (ccx - st.width // 2, ccy - st.height // 2))
d = ImageDraw.Draw(cv)
for i in range(3):
    (x0, y0), (x1, y1) = centers[i], centers[i + 1]
    p0 = (x0 + half + 25, y0 - 40)
    p2 = (x1 - half - 25, y1 - 40)
    mid = ((p0[0] + p2[0]) / 2, min(p0[1], p2[1]) - 110)
    arrow2(cv, p0, mid, p2, color=RED if i == 2 else INK, width=7)
for (n, lab), (ccx, ccy) in zip(names, centers):
    d.text((ccx, ccy + half + 46), lab, font=MONOF(26), fill=INK, anchor="mm")
badge = Image.new("RGBA", (360, 190), (243, 239, 228, 255))
bd = ImageDraw.Draw(badge)
bd.rectangle([0, 0, 359, 189], outline=(40, 40, 42, 255), width=2)
bd.rectangle([0, 0, 359, 52], fill=RED + (255,))
bd.text((180, 28), "STOLEN", font=MONOF(30), fill=(255, 255, 255, 255), anchor="mm")
bd.text((180, 128), "$1.5B", font=pf(100, 850), fill=INK + (255,), anchor="mm")
shadow_paste(cv, badge.rotate(2.5, expand=True, resample=Image.BICUBIC), (1440, 200))
caption(cv, [("Within days, the funds were ", False), ("split across many wallets.", True)], (130, 880))
corner_labels(cv, 3)
cv.convert("RGB").save(OUT + "style_3_flow.png")

# ---------------- Frame 4: chapter + timeline + closing question ----------------
img = paper()
big = pf(380, 850)
d = ImageDraw.Draw(img)
d.text((130, 480), "III", font=big, fill=INK, anchor="ls")
img = line_with_highlight(img, 130, 620, [("The ", False), ("Lesson", True)], pf(100, 800))
d = ImageDraw.Draw(img)
d.line([(130, 770), (1120, 770)], fill=INK, width=4)
for x, top, bot in [(260, "FEB 21", "THE HACK"), (980, "FEB 26", "FBI NAMES NORTH KOREA")]:
    d.ellipse([x - 16, 754, x + 16, 786], fill=RED)
    d.text((x, 715), top, font=MONOF(34), fill=INK, anchor="mm")
    d.text((x, 830), bot, font=MONOF(24), fill=GREY, anchor="mm")
cv = img.convert("RGBA")
cv.alpha_composite(sticker("scale", 150, -7), (1090, 130))
cv.alpha_composite(sticker("ledger", 140, 6), (1400, 120))
suit2 = figure("suit", "gray", 470)
cv.alpha_composite(suit2, (1480, 520))
caption(cv, [("How safe is a billion dollars if ", False), ("one weak link", True), (" can break it?", False)], (130, 910), size=42)
corner_labels(cv, 4)
cv.convert("RGB").save(OUT + "style_4_lesson.png")
print("done")
