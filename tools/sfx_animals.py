"""Original cartoon animal / comedy SFX (generated, royalty-free). Writes studio/public/sfx/<name>.wav.
penguin-squawk, penguin-honk, walrus-grunt, walrus-laugh, gull-caw, gull-mine, splat, swoosh-fast, pop-high, card-beep, fox-snicker.
Usage: python3 tools/sfx_animals.py
"""
import os, wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "studio", "public", "sfx")
rng = np.random.default_rng(3)
T = lambda d: np.arange(int(d * SR)) / SR

def save(name, x):
    x = 0.9 * x / (np.max(np.abs(x)) + 1e-9)
    with wave.open(f"{OUT}/{name}.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())

def env(n, a=0.01, r=0.1):
    e = np.ones(n); A, R = int(a * SR), int(r * SR)
    e[:A] = np.linspace(0, 1, A); e[-R:] *= np.linspace(1, 0, R); return e

def voice(f0, d, formants, buzz=1.0, vib=0.0, vibf=7):
    t = T(d); f = f0(t) if callable(f0) else np.full_like(t, f0)
    f = f * (1 + vib * np.sin(2 * np.pi * vibf * t))
    ph = 2 * np.cumsum(np.pi * f / SR)
    src = sum((1 / k) * np.sin(k * ph) for k in range(1, 18)) * buzz + 0.05 * rng.standard_normal(len(t))
    out = np.zeros_like(t)
    for fc, bw, g in formants:  # crude resonators
        r = np.exp(-np.pi * bw / SR); th = 2 * np.pi * fc / SR
        a1, a2 = -2 * r * np.cos(th), r * r; y1 = y2 = 0.0; y = np.empty_like(src)
        for i, s in enumerate(src):
            y0 = s - a1 * y1 - a2 * y2; y[i] = y0; y2, y1 = y1, y0
        out += g * y
    return out * env(len(t), 0.01, 0.06)

def mix(*parts):
    L = max(int(a * SR) + len(x) for a, x in parts); y = np.zeros(L)
    for a, x in parts: i = int(a * SR); y[i:i + len(x)] += x
    return y

# penguin: nasal squawk with upward bend, and a short honk
save("penguin-squawk", voice(lambda t: 420 + 380 * np.sin(np.pi * t / 0.35), 0.35, [(900, 120, 1), (2300, 200, .5)], vib=0.04, vibf=28))
save("penguin-honk", mix((0, voice(330, 0.14, [(700, 100, 1), (1800, 160, .4)])), (0.18, voice(300, 0.18, [(650, 100, 1), (1700, 160, .4)]))))
# walrus: low grunt, and a "hoh-hoh-hoh" laugh
save("walrus-grunt", voice(lambda t: 95 - 20 * t, 0.45, [(320, 80, 1), (900, 120, .3)], vib=0.08, vibf=18))
save("walrus-laugh", mix(*[(i * 0.17, voice(lambda t, i=i: 150 - 10 * i, 0.13, [(420, 90, 1), (1000, 140, .3)])) for i in range(4)]))
# seagull: sharp caw, and "mine?" style double caw
save("gull-caw", voice(lambda t: 1400 - 900 * t / 0.3, 0.3, [(2200, 300, 1), (3500, 400, .5)], vib=0.06, vibf=40))
save("gull-mine", mix((0, voice(lambda t: 1300 + 400 * t, 0.16, [(2400, 300, 1)])), (0.2, voice(lambda t: 1500 - 600 * t, 0.22, [(2300, 300, 1)]))))
# comedy utility
t = T(0.25); save("swoosh-fast", rng.standard_normal(len(t)) * np.sin(np.pi * t / 0.25) ** 2 * np.convolve(np.ones(len(t)), np.ones(1), 'same'))
t = T(0.09); save("pop-high", np.sin(2 * np.pi * (900 + 2200 * t / 0.09) * t) * np.exp(-t * 40))
t = T(0.3); n = rng.standard_normal(len(t)); save("splat", np.convolve(n, np.ones(25) / 25, 'same') * np.exp(-t * 14) + 0.5 * np.sin(2 * np.pi * 90 * t) * np.exp(-t * 20))
# card reader: short clean "beep" (square-ish 1.9 kHz), and a sly fox "heh-heh"
t = T(0.16); save("card-beep", np.sign(np.sin(2 * np.pi * 1900 * t)) * 0.4 * env(len(t), 0.004, 0.02))
save("fox-snicker", mix(*[(i * 0.14, voice(lambda t, i=i: 520 - 30 * i, 0.1, [(1500, 200, 1), (2900, 300, .4)], buzz=0.6)) for i in range(3)]))
print("ok")
