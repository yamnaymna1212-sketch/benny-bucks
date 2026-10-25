"""Hook preview: user's USA-vs-Iran image + rolling USA counter + IRAN $0 stamp.
Usage (repo root): python3 tools/hook_iran.py <image.png> <voice.wav|-> <out.mp4>
"""
import math, os, subprocess, sys, wave
from PIL import Image, ImageDraw, ImageFont

src, voice, out = sys.argv[1], sys.argv[2], sys.argv[3]
W, H, FPS = 1080, 1920, 30
INK, GREEN, RED = (25, 25, 25), (22, 150, 70), (220, 40, 40)
HAND = 'studio/public/fonts/ArchitectsDaughter.ttf'; BOLD = 'studio/public/fonts/Montserrat.ttf'
def font(p, s, w=None):
    f = ImageFont.truetype(p, s)
    if w:
        try: f.set_variation_by_axes([w])
        except Exception: pass
    return f

dur = 4.0
if voice != '-':
    with wave.open(voice) as w: dur = w.getnframes() / w.getframerate() + 0.35
N = int(dur * FPS)
T_ROLL, T_ZERO = 0.25, dur * 0.6  # $0 lands on "never pay it back"

art = Image.open(src).convert('RGB').crop((165, 200, 1055, 900))
art = art.resize((W, int(art.height * W / art.width)), Image.LANCZOS)
ART_Y = 330
LEFT_X, RIGHT_X = 270, 810  # island centres (Iran left, USA right)
LABEL_Y = ART_Y + art.height + 110

f_big = font(BOLD, 150, 900); f_bill = font(BOLD, 34, 900); f_small = font(BOLD, 11, 700)

def ease(x): x = max(0.0, min(1.0, x)); return 1 - (1 - x) ** 3
def pop(t, t0, d=0.25):
    x = (t - t0) / d
    if x <= 0: return 0.0
    if x >= 1: return 1.0
    return 1 + 0.25 * math.sin(x * math.pi) * (1 - x) + (ease(x) - 1)

def money(t):
    p = ease((t - T_ROLL) / (T_ZERO - T_ROLL - 0.1))
    v = 1000 * p ** 2.2
    return '$1T' if p >= 1 else f'${int(v)}B'

def centered(d, cx, y, text, f, fill, scale=1.0, img=None):
    if scale <= 0: return
    bw = int(d.textlength(text, font=f)) + 40; bh = f.size + 50
    layer = Image.new('RGBA', (bw, bh), (0, 0, 0, 0))
    ImageDraw.Draw(layer).text((20, 10), text, font=f, fill=fill)
    if scale != 1.0: layer = layer.resize((max(1, int(bw * scale)), max(1, int(bh * scale))), Image.LANCZOS)
    img.alpha_composite(layer, (int(cx - layer.width / 2), int(y - layer.height / 2)))

DARK = (52, 82, 60)
def make_bill():  # real-looking $100 note
    b = Image.new('RGBA', (220, 94), (0, 0, 0, 0)); d = ImageDraw.Draw(b)
    d.rectangle((0, 0, 219, 93), fill=(222, 228, 210), outline=(150, 165, 140), width=2)
    d.rectangle((7, 7, 212, 86), outline=DARK, width=2)
    d.rectangle((150, 7, 157, 86), fill=(90, 140, 200))  # blue security ribbon
    d.ellipse((80, 16, 136, 78), fill=(190, 200, 180), outline=DARK, width=2)
    d.ellipse((96, 26, 120, 50), fill=(120, 135, 115)); d.pieslice((88, 46, 128, 86), 180, 360, fill=(120, 135, 115))
    for (x, y) in ((12, 9), (176, 9), (12, 62), (176, 62)): d.text((x, y), '100', font=f_bill.font_variant(size=20), fill=DARK)
    d.text((110, 12), 'THE UNITED STATES OF AMERICA', font=f_small, fill=DARK, anchor='mt')
    d.text((185, 47), '100', font=f_bill, fill=(176, 120, 60), anchor='mm')
    return b
BILL = make_bill()
def bill(img, x, y, rot, sc=1.0):
    b = BILL.resize((int(220 * sc), int(94 * sc)), Image.LANCZOS)
    b = b.rotate(rot, expand=True, resample=Image.BICUBIC)
    img.alpha_composite(b, (int(x - b.width / 2), int(y - b.height / 2)))

frames = f'{out}.frames'; os.makedirs(frames, exist_ok=True)
for i in range(N):
    t = i / FPS
    img = Image.new('RGBA', (W, H), (255, 255, 255, 255)); d = ImageDraw.Draw(img)
    s = 0.92 + 0.08 * ease(t / 0.3)
    a = art.resize((int(W * s), int(art.height * s)), Image.LANCZOS)
    img.paste(a, (int((W - a.width) / 2), ART_Y + int((art.height - a.height) / 2)))
    # real $100 bills pour out of the bag down onto Iran's side (below the faces)
    if T_ROLL < t < T_ZERO + 0.5:
        for j in range(7):
            ph = ((t - T_ROLL) * 1.1 + j / 7) % 1
            x = 540 - ph * (230 + 40 * (j % 3))
            y = ART_Y + 400 + ph * ph * 330
            bill(img, x, y, 40 * math.sin((ph + j) * 5), 0.55 + 0.35 * ph)
    if t >= T_ROLL:
        centered(d, RIGHT_X, LABEL_Y, money(t), font(BOLD, 130, 900), GREEN,
                 1.0 + (0.12 * math.sin(t * 40) if t < T_ZERO - 0.1 else 0), img)
    zp = pop(t, T_ZERO, 0.2)
    if zp > 0:
        centered(d, LEFT_X, LABEL_Y, '$0', f_big, RED, 1 + 1.5 * (1 - min(1, (t - T_ZERO) / 0.12)), img)
    img.convert('RGB').save(f'{frames}/{i:04d}.png')

S = 'studio/public/sfx/user-'
fx = [('ting', 0.0, 1.0), ('whoosh', T_ROLL, 0.7), ('cash-register', T_ROLL + 0.05, 0.8), ('boom', T_ZERO, 1.0)]
cmd = ['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', f'{frames}/%04d.png']
if voice != '-': cmd += ['-i', voice]
for n, _, _ in fx: cmd += ['-i', f'{S}{n}.wav']
base = 2 if voice != '-' else 1
parts = [f'[{base + k}:a]adelay={int(t0 * 1000)}:all=1,volume={v}[s{k}]' for k, (_, t0, v) in enumerate(fx)]
mix = ''.join(f'[s{k}]' for k in range(len(fx))) + ('[1:a]' if voice != '-' else '')
n_in = len(fx) + (voice != '-')
fc = ';'.join(parts) + f';{mix}amix=inputs={n_in}:normalize=0,atrim=0:{dur:.2f}[a]'
cmd += ['-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-c:a', 'aac', '-b:a', '192k', out]
subprocess.run(cmd, check=True)
print(out, f'{dur:.2f}s')
