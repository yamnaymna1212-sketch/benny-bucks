"""Hook preview: user's USA-vs-Iran image, cut-out puppet animation by warping the flat image.
Tug-of-war on the bag, waving flags, breathing, eye-pop expressions, ground cracks on "rich",
real $100 bills, USA counter -> $1T vs IRAN $0 (on screen from frame 0), big WHY?.
Usage (repo root): python3 tools/hook_iran.py <image.png> <voice.wav|-> <out.mp4> [nosfx]
"""
import math, os, random, shutil, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont

src, voice, out = sys.argv[1], sys.argv[2], sys.argv[3]
W, H, FPS = 1080, 1920, 30
INK, GREEN, RED = (25, 25, 25), (22, 150, 70), (220, 40, 40)
BOLD = 'studio/public/fonts/Montserrat.ttf'
def font(s, w=900):
    f = ImageFont.truetype(BOLD, s)
    try: f.set_variation_by_axes([w])
    except Exception: pass
    return f

dur = 4.0
if voice != '-':
    with wave.open(voice) as w: dur = w.getnframes() / w.getframerate() + 0.4
N = int(dur * FPS)
# word times by syllable share of the VO (22 syllables): "rich" = 2, "never" = 17
T_RICH, T_ZERO = 2 / 22 * (dur - 0.4), 17 / 22 * (dur - 0.4)

CROP = (165, 200, 1055, 900); K = W / (CROP[2] - CROP[0])
def A(x, y): return ((x - CROP[0]) * K, (y - CROP[1]) * K)  # original image px -> art px
art = Image.open(src).convert('RGB').crop(CROP)
art = np.asarray(art.resize((W, int(art.height * K)), Image.LANCZOS)).astype(np.float32)
AH = art.shape[0]; ART_Y = 330; LABEL_Y = ART_Y + AH + 110
LEFT_X, RIGHT_X = 270, 810
YY, XX = np.mgrid[0:AH, 0:W].astype(np.float32)

def smooth(a, b, v):
    x = np.clip((v - a) / (b - a), 0, 1); return x * x * (3 - 2 * x)
def box(x0, y0, x1, y1, f=22):  # soft rectangle weight, coords in original px
    (ax0, ay0), (ax1, ay1) = A(x0, y0), A(x1, y1)
    return smooth(ax0 - f, ax0 + f, XX) * (1 - smooth(ax1 - f, ax1 + f, XX)) * smooth(ay0 - f, ay0 + f, YY) * (1 - smooth(ay1 - f, ay1 + f, YY))
def lean(feet, top):  # 0 at the feet, 1 at upper body -> translation reads as a lean
    return smooth(A(0, feet)[1], A(0, top)[1], YY)

# puppets (original image px)
KH = box(318, 335, 578, 715) * lean(700, 520)
TR = box(636, 345, 878, 715, 10) * lean(705, 530)
ART_NO_ME = np.concatenate([art, np.full(art.shape[:2] + (1,), 1.0, np.float32)], -1); _r = ART_NO_ME[int(A(0, 340)[1]):int(A(0, 590)[1]), int(A(858, 0)[0]):]
_r[~((_r[..., 2] > _r[..., 0] + 15) & (_r[..., :3].sum(-1) < 330)), 3] = 0  # Trump layer: keep his navy suit, drop Messi  # Trump's yank must not drag Messi along
TR_M = (TR > 0.01)[..., None]
BAG = box(535, 380, 668, 540, 14)
RO = box(222, 330, 348, 715); RO_FEET = A(0, 710)[1]
ME = box(858, 365, 978, 715); ME_FEET = A(0, 708)[1]
RO_HEAD = box(250, 335, 320, 410, 14)
FLAG_IR = box(250, 222, 410, 392, 10); FLAG_US = box(796, 255, 968, 410, 10)
POLE_IR, POLE_US = A(246, 0)[0], A(970, 0)[0]
EYES = {'ro': A(285, 383), 'kh': A(475, 403), 'tr': A(730, 415), 'me': A(895, 420)}

def ease(x): x = max(0.0, min(1.0, x)); return 1 - (1 - x) ** 3
def pop(t, t0, d=0.25):
    x = (t - t0) / d
    if x <= 0: return 0.0
    if x >= 1: return 1.0
    return ease(x) + 0.3 * math.sin(x * math.pi) * (1 - x)
def env(t, t0, a=0.12): return ease((t - t0) / a)

def warp(t):
    dx = np.zeros_like(XX); dy = np.zeros_like(XX); wsum = np.zeros_like(XX)
    z = env(t, T_ZERO, 0.15)
    tug = 9 * math.sin(2 * math.pi * 1.7 * t) * min(1, max(0, (t - 0.1) / 0.3))
    kx = tug - 55 * z                        # Iran yanks the bag at "never"
    tx = tug - 18 * z + (6 * math.sin(t * 30) * math.exp(-(t - T_ZERO) * 3) if t > T_ZERO else 0)  # Trump stumbles
    for w, ddx, ddy in ((KH, kx, -3 * z), (TR, tx, 4 * z), (BAG, (kx + tx) / 2 - 6 * z, -10 * z)):
        dx += w * ddx; dy += w * ddy; wsum += w
    wsum = np.maximum(1, wsum); dx /= wsum; dy /= wsum
    tdx, tdy = TR * tx / wsum, TR * 4 * z / wsum
    dy += RO * (YY - RO_FEET) * 0.012 * math.sin(t * 5.5) + ME * (YY - ME_FEET) * 0.012 * math.sin(t * 5.1 + 1)  # breathing
    dx += RO_HEAD * (8 * z)  # Ronaldo turns toward the money
    dy += RO_HEAD * (-4 * abs(math.sin(t * 4))) * (1 - z)      # smug nod before
    for flag, pole, sgn in ((FLAG_IR, POLE_IR, 1), (FLAG_US, POLE_US, -1)):
        d = np.clip(sgn * (XX - pole), 0, None)
        dy += flag * 9 * np.sin(d * 0.045 - t * 9) * (d / 190)
        dx += flag * 3 * np.cos(d * 0.045 - t * 9) * (d / 190)
    # eye-pop expressions: magnify around the eyes
    pops = {'kh': 0.35 * env(t, T_ZERO - 0.2, 0.1), 'tr': 0.35 * z, 'me': 0.22 * z, 'ro': 0.22 * z}
    for k, s in pops.items():
        if s <= 0: continue
        cx, cy = EYES[k]
        if k == 'kh': cx += kx
        if k == 'tr': cx += tx
        if k == 'ro': cx += 10 * z
        g = s * np.exp(-((XX - cx) ** 2 + (YY - cy) ** 2) / (2 * 20 ** 2))
        dx += (XX - cx) * g; dy += (YY - cy) * g
    return dx, dy, tdx, tdy

def sample(dx, dy, src=art):
    sx = np.clip(XX - dx, 0, W - 1.001); sy = np.clip(YY - dy, 0, AH - 1.001)
    x0 = sx.astype(np.int32); y0 = sy.astype(np.int32); fx = (sx - x0)[..., None]; fy = (sy - y0)[..., None]
    a, b, c, d = src[y0, x0], src[y0, x0 + 1], src[y0 + 1, x0], src[y0 + 1, x0 + 1]
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy

# ground cracks on the USA island (original px), grow on "rich"
random.seed(4)
def crack(x, y, ang, n):
    pts = [A(x, y)]
    for _ in range(n):
        ang += random.uniform(-0.6, 0.6); x += 14 * math.cos(ang); y += 14 * math.sin(ang)
        ax, ay = A(x, y)
        if not (0 <= ay < AH and 0 <= ax < W) or art[int(ay), int(ax)].sum() > 690: break  # stay on the island
        pts.append((ax, ay))
    return pts
CRACKS = [crack(850, 655, 1.6, 14), crack(760, 665, 1.9, 11), crack(940, 670, 1.3, 11), crack(850, 700, 0.4, 7), crack(820, 720, 2.6, 7)]

DARK = (52, 82, 60)
def make_bill():  # real-looking $100 note
    b = Image.new('RGBA', (220, 94), (0, 0, 0, 0)); d = ImageDraw.Draw(b)
    d.rectangle((0, 0, 219, 93), fill=(222, 228, 210), outline=(150, 165, 140), width=2)
    d.rectangle((7, 7, 212, 86), outline=DARK, width=2)
    d.rectangle((150, 7, 157, 86), fill=(90, 140, 200))
    d.ellipse((80, 16, 136, 78), fill=(190, 200, 180), outline=DARK, width=2)
    d.ellipse((96, 26, 120, 50), fill=(120, 135, 115)); d.pieslice((88, 46, 128, 86), 180, 360, fill=(120, 135, 115))
    for (x, y) in ((12, 9), (176, 9), (12, 62), (176, 62)): d.text((x, y), '100', font=font(20), fill=DARK)
    d.text((110, 12), 'THE UNITED STATES OF AMERICA', font=font(11, 700), fill=DARK, anchor='mt')
    d.text((185, 47), '100', font=font(34), fill=(176, 120, 60), anchor='mm')
    return b
BILL = make_bill()
def bill(img, x, y, rot, sc):
    b = BILL.resize((int(220 * sc), int(94 * sc)), Image.LANCZOS).rotate(rot, expand=True, resample=Image.BICUBIC)
    img.alpha_composite(b, (int(x - b.width / 2), int(y - b.height / 2)))

def text(img, cx, cy, s, f, fill, scale=1.0, rot=0, stroke=0):
    if scale <= 0: return
    d = ImageDraw.Draw(img); bw = int(d.textlength(s, font=f)) + 60; bh = f.size + 70
    L = Image.new('RGBA', (bw, bh), (0, 0, 0, 0))
    ImageDraw.Draw(L).text((bw / 2, bh / 2), s, font=f, fill=fill, anchor='mm', stroke_width=stroke, stroke_fill=INK)
    L = L.resize((max(1, int(bw * scale)), max(1, int(bh * scale))), Image.LANCZOS)
    if rot: L = L.rotate(rot, expand=True, resample=Image.BICUBIC)
    img.alpha_composite(L, (int(cx - L.width / 2), int(cy - L.height / 2)))

def drop(d, x, y, s=1.0):  # sweat drop
    d.polygon([(x, y - 22 * s), (x - 11 * s, y), (x + 11 * s, y)], fill=(120, 190, 255))
    d.ellipse((x - 11 * s, y - 11 * s, x + 11 * s, y + 11 * s), fill=(120, 190, 255), outline=INK, width=3)

def money(t):
    p = ease((t - T_RICH) / (T_ZERO - T_RICH - 0.15)); v = 1000 * p ** 2.2
    return '$1T' if p >= 1 else f'${int(v)}B'

frames = f'{out}.frames'; os.makedirs(frames, exist_ok=True)
for i in range(N):
    t = i / FPS
    z = env(t, T_ZERO, 0.15)
    dx, dy, tdx, tdy = warp(t)
    tr = sample(dx, dy, ART_NO_ME); al = tr[..., 3:] * TR_M
    pic = Image.fromarray((tr[..., :3] * al + sample(dx - tdx, dy - tdy) * (1 - al)).astype(np.uint8)).convert('RGBA'); pd = ImageDraw.Draw(pic)
    g = ease((t - T_RICH) / 0.25)
    if t >= T_RICH:
        for c in CRACKS:
            seg = c[:max(2, int(len(c) * g))]
            pd.line([(x + 2, y + 3) for x, y in seg], fill=(150, 110, 70), width=12, joint='curve')
            pd.line(seg, fill=(30, 18, 10), width=10, joint='curve')
    img = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    sh = 0.0  # screen shake on "rich" and on the $0 boom
    for t0, a in ((T_RICH, 16), (T_ZERO, 12)):
        if t0 <= t < t0 + 0.45: sh = a * (1 - (t - t0) / 0.45)
    ox, oy = int(sh * math.sin(t * 90)), int(sh * math.cos(t * 77))
    img.alpha_composite(pic, (ox, ART_Y + oy))
    # bills pour from the bag to Iran's side (below the faces)
    bx, by = A(600, 470); bx -= 40 * z
    if t > 0.3:
        for j in range(9 if t > T_ZERO else 6):
            ph = ((t - 0.3) * (1.6 if t > T_ZERO else 1.1) + j / 7) % 1
            bill(img, ox + bx - ph * (240 + 40 * (j % 3)), oy + ART_Y + by + ph * ph * 330, 40 * math.sin((ph + j) * 5), 0.5 + 0.35 * ph)
    # expressions on top: sweat on Trump, !! over the players
    if z > 0:
        hx, hy = A(705, 360); d = ImageDraw.Draw(img)
        for k in range(3):
            ph = ((t - T_ZERO) * 1.8 + k / 3) % 1
            drop(d, ox + hx - 40 * z + 60 * k - 50, oy + ART_Y + hy + ph * 70, 0.9)
        for key in ('ro', 'me'):
            ex, ey = EYES[key]
            text(img, ox + ex + (-75 if key == 'ro' else 70), oy + ART_Y + ey - 40, '!!', font(70), RED, pop(t, T_ZERO + 0.05, 0.2), -10, 3)
    text(img, W / 2, 175, 'WHY?', font(230), INK, pop(t, 0.0, 0.3) * (1 + 0.03 * math.sin(t * 6)), 3 * math.sin(t * 3))
    if t >= T_RICH:
        text(img, RIGHT_X, LABEL_Y, money(t), font(130), GREEN, 1.0 + (0.1 * math.sin(t * 40) if t < T_ZERO - 0.15 else 0))
    zs = 1 + 0.6 * (1 - ease((t - T_ZERO) / 0.2)) if t >= T_ZERO else 1.0
    zr = 6 * math.sin((t - T_ZERO) * 40) * math.exp(-(t - T_ZERO) * 5) if t >= T_ZERO else 0
    text(img, LEFT_X, LABEL_Y, '$0', font(160), RED, pop(t, 0.0, 0.3) * zs, zr)
    img.convert('RGB').save(f'{frames}/{i:04d}.png')

S = 'studio/public/sfx/user-'
fx = [('ting', 0.0, 1.0), ('shock', T_RICH, 0.9), ('whoosh', T_RICH, 0.6), ('cash-register', T_RICH + 0.1, 0.7), ('boom', T_ZERO, 1.0)]
if 'nosfx' in sys.argv[4:]: fx = []  # user: voice only
cmd = ['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', f'{frames}/%04d.png']
if voice != '-': cmd += ['-i', voice]
for n, _, _ in fx: cmd += ['-i', f'{S}{n}.wav']
base = 2 if voice != '-' else 1
parts = [f'[{base + k}:a]adelay={int(t0 * 1000)}:all=1,volume={v}[s{k}]' for k, (_, t0, v) in enumerate(fx)]
mix = ''.join(f'[s{k}]' for k in range(len(fx))) + ('[1:a]' if voice != '-' else '')
fc = ''.join(p + ';' for p in parts) + f'{mix}amix=inputs={len(fx) + (voice != "-")}:normalize=0,atrim=0:{dur:.2f}[a]'
cmd += ['-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-c:a', 'aac', '-b:a', '192k', out]
subprocess.run(cmd, check=True)
shutil.rmtree(frames)
print(out, f'{dur:.2f}s', f'rich={T_RICH:.2f} zero={T_ZERO:.2f}')
