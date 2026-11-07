import sys
sys.argv = ["x"]
import frames as F
from lib import *
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math, random
random.seed(7)
O = "/home/claude/collage/"
MONOF = F.MONOF
WHITE = (244, 241, 230)


def auditor(height, mode="halftone", flip=False, tag="aud"):
    CW, CH = 900, 900
    L = Image.new("L", (CW, CH), 0); A = Image.new("L", (CW, CH), 0)
    d, a = ImageDraw.Draw(L), ImageDraw.Draw(A)
    def both(fn_l, fn_a=None):
        fn_l(d)
        (fn_a or fn_l)(a)
    ox = 130
    # coat
    coat = [(ox+60, 900), (ox+90, 560), (ox+210, 470), (ox+470, 470), (ox+590, 560), (ox+620, 900)]
    d.polygon(coat, fill=68); a.polygon(coat, fill=255)
    # neck + shirt
    d.rectangle([ox+295, 400, ox+385, 500], fill=140); a.rectangle([ox+295, 400, ox+385, 500], fill=255)
    d.polygon([(ox+280, 470), (ox+400, 470), (ox+340, 700)], fill=228)
    d.polygon([(ox+325, 485), (ox+355, 485), (ox+368, 640), (ox+340, 700), (ox+312, 640)], fill=22)
    # lapels and raised collar
    d.polygon([(ox+280, 470), (ox+190, 480), (ox+250, 720), (ox+330, 640)], fill=96)
    d.polygon([(ox+400, 470), (ox+490, 480), (ox+430, 720), (ox+350, 640)], fill=96)
    d.polygon([(ox+210, 440), (ox+300, 430), (ox+290, 520), (ox+185, 505)], fill=52)
    d.polygon([(ox+470, 440), (ox+380, 430), (ox+390, 520), (ox+495, 505)], fill=52)
    a.polygon([(ox+210, 440), (ox+300, 430), (ox+290, 520), (ox+185, 505)], fill=255)
    a.polygon([(ox+470, 440), (ox+380, 430), (ox+390, 520), (ox+495, 505)], fill=255)
    # face
    fb = [ox+230, 215, ox+450, 450]
    d.ellipse(fb, fill=190); a.ellipse(fb, fill=255)
    # half-face shadow (mystery)
    sh = Image.new("L", (CW, CH), 0); ImageDraw.Draw(sh).polygon([(ox+340, 200), (ox+470, 200), (ox+470, 470), (ox+300, 470)], fill=255)
    m = Image.new("L", (CW, CH), 0); ImageDraw.Draw(m).ellipse(fb, fill=255)
    from PIL import ImageChops
    shadow = ImageChops.multiply(sh, m)
    L.paste(60, mask=shadow)
    d = ImageDraw.Draw(L)
    # brim shadow across eyes
    band = Image.new("L", (CW, CH), 0); ImageDraw.Draw(band).rectangle([ox+220, 255, ox+460, 305], fill=255)
    L.paste(70, mask=ImageChops.multiply(band, m).filter(ImageFilter.GaussianBlur(6)))
    d = ImageDraw.Draw(L)
    d.ellipse([ox+292, 318, ox+322, 336], fill=250)   # one visible eye
    d.line([(ox+300, 400), (ox+355, 404)], fill=40, width=6)  # mouth line
    # fedora
    crown = [ox+255, 80, ox+425, 250]
    d.rounded_rectangle(crown, radius=60, fill=38); a.rounded_rectangle(crown, radius=60, fill=255)
    d.rectangle([ox+255, 205, ox+425, 232], fill=120)
    brim = [ox+175, 215, ox+505, 285]
    d.ellipse(brim, fill=30); a.ellipse(brim, fill=255)
    # arm with magnifier (toward left)
    arm = [(ox+90, 580), (ox+10, 700), (ox-40, 640), (ox+40, 520)]
    d.polygon(arm, fill=82); a.polygon(arm, fill=255)
    d.ellipse([ox-70, 600, ox-10, 680], fill=175); a.ellipse([ox-70, 600, ox-10, 680], fill=255)
    d.line([(ox-40, 610), (ox-95, 520)], fill=40, width=18); a.line([(ox-40, 610), (ox-95, 520)], fill=255, width=18)
    cx, cy, r = ox-120, 450, 92
    d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=222); a.ellipse([cx-r, cy-r, cx+r, cy+r], fill=255)
    d.ellipse([cx-r, cy-r, cx+r, cy+r], outline=25, width=16)
    d.arc([cx-r+22, cy-r+22, cx+r-22, cy+r-22], 200, 260, fill=255, width=8)
    yy, xx = np.mgrid[0:CH, 0:CW]
    vig = 0.75 + 0.35 * np.exp(-(((xx - 450) / 420) ** 2 + ((yy - 380) / 520) ** 2))
    arr = np.clip(np.asarray(L, dtype=np.float32) * vig, 0, 255).astype(np.uint8)
    Lb = Image.fromarray(arr).filter(ImageFilter.GaussianBlur(1.3))
    src = "/tmp/%s_src.png" % tag
    Image.merge("RGBA", (Lb, Lb, Lb, A)).save(src)
    dst = "/tmp/%s_%s.png" % (tag, mode)
    F.cut_tool.build(src, dst, mode, height, 7 if height > 650 else 5, 8)
    im = Image.open(dst).convert("RGBA")
    return im.transpose(Image.FLIP_LEFT_RIGHT) if flip else im


def put_right(cv, im, y, margin=40):
    F.shadow_paste(cv, im, (W - im.width - margin, y))


def put_center(cv, im, cx, cy):
    F.shadow_paste(cv, im, (int(cx - im.width / 2), int(cy - im.height / 2)))


def chip(cv, l1, l2, xy):
    d = ImageDraw.Draw(cv)
    f1, f2 = MONOF(26), MONOF(23)
    w = int(max(f1.getlength(l1), f2.getlength(l2)) + 70)
    d.rectangle([xy[0], xy[1], xy[0] + w, xy[1] + 96], fill=INK)
    d.rectangle([xy[0], xy[1], xy[0] + 10, xy[1] + 96], fill=RED)
    d.text((xy[0] + 32, xy[1] + 30), l1, font=f1, fill=WHITE, anchor="lm")
    d.text((xy[0] + 32, xy[1] + 68), l2, font=f2, fill=(190, 188, 178), anchor="lm")


def finish(cv, n, name, light=True):
    d = ImageDraw.Draw(cv)
    c = INK if light else WHITE
    d.text((W - 90, 70), "%02d / 05" % n, font=MONOF(32), fill=c, anchor="rm")
    d.text((W - 90, 106), "SAMPLE LAYOUT", font=MONOF(20), fill=(150, 148, 140), anchor="rm")
    cv.convert("RGB").save(O + name)
    print("ok", name)


def pin(d, p):
    d.ellipse([p[0]-11, p[1]-11, p[0]+11, p[1]+11], fill=RED, outline=(120, 30, 26), width=3)
    d.ellipse([p[0]-4, p[1]-6, p[0]+1, p[1]-1], fill=(255, 200, 190))


def string(d, p, q, sag=40):
    pts = bez(p, ((p[0]+q[0])/2, (p[1]+q[1])/2 + sag), q, 40)
    for i in range(len(pts)-1):
        d.line([pts[i], pts[i+1]], fill=RED, width=5)


def polaroid(icon, label, rot, size=300):
    w, h = size, int(size*1.18)
    c = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    d.rectangle([0, 0, w-1, h-1], fill=(248, 246, 238, 255))
    d.rectangle([22, 22, w-23, w-23], fill=(214, 210, 198, 255))
    if isinstance(icon, str):
        st = F.sticker(icon, 130, 0); c.alpha_composite(st.resize((int(st.width*0.9), int(st.height*0.9))), (w//2 - int(st.width*0.45), w//2 - int(st.height*0.45)))
    else:
        im = icon; s = (w-60)/im.height*0.95; im = im.resize((int(im.width*s), int(im.height*s))); c.alpha_composite(im, (w//2 - im.width//2, 26))
    d.text((w//2, h-44), label, font=MONOF(24), fill=INK, anchor="mm")
    return c.rotate(rot, expand=True, resample=Image.BICUBIC)

# ---------- 1 evidence board ----------
cv = paper(base=(176, 140, 98)).convert("RGBA")
F.caption(cv, [("Something doesn't ", False), ("add up", True)], (110, 90), 70, -1)
pts = [(270, 380), (620, 340), (950, 450)]
dd = ImageDraw.Draw(cv)
string(dd, pts[0], pts[1], 40); string(dd, pts[1], pts[2], 50); string(dd, (950, 450), (1080, 330), 30)
hood = F.figure("hood", "gray", 360)
for (x, y), (ic, lab, r) in zip([(120, 400), (470, 360), (800, 470)], [("bank", "EXCHANGE", -4), ("wallet", "WALLET 0x…", 3), ("network", "ADDRESSES", -2)]):
    F.shadow_paste(cv, polaroid(ic, lab, r), (x, y))
F.shadow_paste(cv, polaroid(hood, "FBI: DPRK-linked", 4, 330), (930, 300))
dd = ImageDraw.Draw(cv)
for p in pts + [(1080, 330)]: pin(dd, p)
aud = auditor(680, "halftone", tag="aud1")
cv.alpha_composite(aud, (1000 + 560, 190)) if False else None
cv.alpha_composite(aud.resize((int(aud.width*0.8), int(aud.height*0.8))), (-60, 330)) if False else None
put_right(cv, aud, H - aud.height + 20, 30)
chip(cv, "SOURCE · FBI IC3 PSA I-022625-PSA", "Feb 26, 2025 · ic3.gov/PSA/2025/PSA250226", (70, 940))
finish(cv, 1, "pack_1_board.png")

# ---------- 2 press wall ----------
cv = paper().convert("RGBA")
F.caption(cv, [("Show the ", False), ("source", True), (" on screen", False)], (110, 80), 66, -0.8)
for i, (x, y, r) in enumerate([(160, 330, -5), (540, 300, 3), (930, 360, -2)]):
    c = F.doc_card(430, 520)
    dd = ImageDraw.Draw(c)
    dd.rectangle([0, 0, 429, 40], fill=(26, 26, 28, 255))
    dd.text((16, 20), ["NEWS · SCREENSHOT", "OFFICIAL · PDF", "NEWS · SCREENSHOT"][i], font=MONOF(20), fill=WHITE + (255,), anchor="lm")
    F.shadow_paste(cv, c.rotate(r, expand=True, resample=Image.BICUBIC), (x, y))
    F.shadow_paste(cv, F.tape(r * 4 + 2), (x + 130, y - 22), blur=3, off=(2, 3), alpha=0.2)
F.arrow2(cv.convert("RGB"), (0, 0), (0, 0), (0, 0)) if False else None
dd = ImageDraw.Draw(cv)
F.arrow2(cv, (1330, 760), (1290, 560), (1250, 470))
F.shadow_paste(cv, F.stamp("VERIFIED", -10), (700, 800))
aud = auditor(620, "halftone", flip=True, tag="aud2")
put_right(cv, aud, H - aud.height + 20, 30)
chip(cv, "SOURCE · Bloomberg · TechCrunch", "Feb 21, 2025 · every claim gets a citation", (70, 940))
finish(cv, 2, "pack_2_press.png")

# ---------- 3 blueprint map ----------
cv = paper(base=(20, 46, 92)).convert("RGBA")
dd = ImageDraw.Draw(cv)
for gx in range(0, W, 120): dd.line([(gx, 0), (gx, H)], fill=(60, 96, 150, 90), width=1)
for gy in range(0, H, 120): dd.line([(0, gy), (W, gy)], fill=(60, 96, 150, 90), width=1)
dd.text((120, 150), "Follow the money", font=pf(110, 800), fill=WHITE, anchor="lm")
nodes = [(380, 620, "EXCHANGE"), (900, 520, "THOUSANDS OF\nADDRESSES"), (1330, 640, "FIAT (expected)")]
for x, y, t in nodes:
    dd.ellipse([x-130, y-130, x+130, y+130], outline=WHITE, width=6)
    dd.ellipse([x-112, y-112, x+112, y+112], outline=(120, 160, 220), width=2)
    dd.multiline_text((x, y+190), t, font=MONOF(30), fill=WHITE, anchor="ma", align="center")
F.arrow2(cv, (520, 590), (700, 480), (760, 520), color=WHITE, width=7)
F.arrow2(cv, (1040, 540), (1170, 480), (1200, 620), color=WHITE, width=7)
put_center(cv, F.sticker("bank", 120, -5), 380, 620)
put_center(cv, F.sticker("network", 120, 4), 900, 520)
put_center(cv, F.sticker("coins", 120, -4), 1330, 640)
F.caption(cv, [("Bitcoin and other assets, ", False), ("dispersed", True)], (560, 800), 48, -0.6)
aud = auditor(430, "gray", tag="aud3")
put_right(cv, aud, H - aud.height + 10, 20)
chip(cv, "SOURCE · FBI IC3 PSA", "Feb 26, 2025 · ic3.gov/PSA/2025/PSA250226", (70, 960))
finish(cv, 3, "pack_3_map.png", light=False)

# ---------- 4 analyst screen ----------
cv = paper(base=(18, 20, 24)).convert("RGBA")
dd = ImageDraw.Draw(cv)
dd.rectangle([90, 150, 1230, 900], outline=(90, 200, 150), width=3)
dd.text((120, 185), "> trace --chain ETH --illustrative", font=MONOF(34), fill=(90, 200, 150), anchor="lm")
for i in range(11):
    y = 260 + i * 56
    hx = "0x" + "".join(random.choice("0123456789abcdef") for _ in range(22)) + "…"
    amt = random.choice(["1,204.5", "88.0", "3,001.2", "412.7", "29.9"])
    if i == 5:
        dd.rectangle([105, y-24, 1215, y+24], fill=YEL + (255,))
        dd.text((125, y), "%s    %s ETH   >> flagged" % (hx, amt), font=MONOF(30), fill=INK, anchor="lm")
    else:
        dd.text((125, y), "%s    %s ETH" % (hx, amt), font=MONOF(30), fill=(150, 160, 156), anchor="lm")
F.shadow_paste(cv, F.sticker("magnifier", 150, 8), (1010, 520))
F.caption(cv, [("Every transaction leaves a ", False), ("trail", True)], (110, 940), 52, -0.5)
aud = auditor(700, "gray", tag="aud4")
put_right(cv, aud, H - aud.height + 20, 20)
finish(cv, 4, "pack_4_screen.png", light=False)

# ---------- 5 ledger ----------
cv = paper(base=(238, 232, 210)).convert("RGBA")
dd = ImageDraw.Draw(cv)
for y in range(170, H, 64): dd.line([(0, y), (W, y)], fill=(150, 175, 205, 255), width=2)
dd.line([(150, 0), (150, H)], fill=RED + (255,), width=4)
F.caption(cv, [("Biggest crypto ", False), ("hacks", True)], (200, 60), 64, -0.6)
bars = [("Bybit 2025", 1.5, True), ("Ronin 2022", 0.625, False), ("Poly 2021", 0.611, False)]
base_y = 880
for i, (n, v, hi) in enumerate(bars):
    x0 = 280 + i * 330; h = int(v / 1.5 * 520)
    dd.rectangle([x0, base_y - h, x0 + 210, base_y], fill=(236, 230, 214, 255) if not hi else YEL + (255,), outline=INK, width=5)
    dd.text((x0 + 105, base_y - h - 34), "~$%sB" % ("%.2g" % v if v >= 1 else "%.2f" % v).rstrip("0"), font=pf(44, 800), fill=INK, anchor="mm")
    dd.text((x0 + 105, base_y + 36), n, font=MONOF(28), fill=INK, anchor="mm")
F.shadow_paste(cv, F.stamp("APPROX.", -8), (800, 300))
aud = auditor(560, "halftone", flip=True, tag="aud5")
put_right(cv, aud, H - aud.height + 20, 30)
chip(cv, "SOURCE · TechCrunch · Bloomberg", "figures approximate · verified per episode", (70, 960))
finish(cv, 5, "pack_5_ledger.png")
