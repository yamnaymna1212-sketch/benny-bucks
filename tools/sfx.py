"""Synthesize original, license-free SFX into assets/audio/sfx/synth/ (48 kHz mono WAV)."""
import numpy as np, soundfile as sf, os
SR = 48000; out = "assets/audio/sfx/synth"; os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(7)
t = lambda d: np.arange(int(d * SR)) / SR
env = lambda n, a=0.005, r=0.1: np.minimum(1, np.arange(n) / (a * SR + 1)) * np.exp(-np.arange(n) / (r * SR))
def tone(f0, f1, d, r=0.1, kind="sin"):
    x = t(d); f = np.linspace(f0, f1, len(x)); ph = 2 * np.pi * np.cumsum(f) / SR
    w = np.sin(ph) if kind == "sin" else np.sign(np.sin(ph)) * 0.5
    return w * env(len(x), r=r)
def noise(d): return rng.standard_normal(int(d * SR))
def lp(x, k):  # simple moving-average low-pass
    return np.convolve(x, np.ones(k) / k, "same")
def norm(x, g=0.9): return g * x / (np.max(np.abs(x)) + 1e-9)
def save(n, x): sf.write(f"{out}/{n}.wav", norm(x).astype(np.float32), SR)
def mix(*parts):
    n = max(int(o * SR) + len(p) for o, p in parts); y = np.zeros(n)
    for o, p in parts: s = int(o * SR); y[s:s + len(p)] += p
    return y

save("pop", tone(900, 300, 0.08, 0.03))
w = noise(0.45); save("whoosh", lp(w, 40) * np.sin(np.pi * np.linspace(0, 1, len(w))) ** 2)
save("boing", tone(250, 520, 0.4, 0.25) * (1 + 0.5 * np.sin(2 * np.pi * 18 * t(0.4))))
save("impact", lp(noise(0.35), 120) * env(int(0.35 * SR), r=0.08) + tone(90, 40, 0.35, 0.15))
save("thud", lp(noise(0.25), 300) * env(int(0.25 * SR), r=0.05) + tone(70, 45, 0.25, 0.08))
save("tick", tone(2500, 2500, 0.02, 0.005))
x = t(1.2); r = noise(1.2) * (x / 1.2) ** 2; save("riser", lp(r, 8) + tone(200, 900, 1.2, 2) * (x / 1.2))
save("ding", tone(1760, 1760, 0.9, 0.35) + 0.4 * tone(3520, 3520, 0.9, 0.2))
save("error", tone(180, 180, 0.35, 1, "sq") * (t(0.35) < 0.15) + tone(180, 180, 0.35, 1, "sq") * (t(0.35) > 0.2))
coin = lambda f: tone(f, f, 0.25, 0.08) + 0.5 * tone(f * 2.7, f * 2.7, 0.25, 0.05)
save("coins", mix(*[(i * 0.06, coin(f)) for i, f in enumerate([2800, 3300, 2600, 3100, 2900])]))
save("cha-ching", mix((0, coin(2400)), (0.08, coin(3000)), (0.15, tone(1760, 1760, 0.8, 0.3)), (0.15, lp(noise(0.15), 3) * 0.2)))
x = t(0.5); sc = lp(noise(0.5), 6) * np.abs(np.sin(2 * np.pi * 3 * x)); save("record-scratch", sc * env(len(x), r=0.4))
save("spring", tone(300, 1200, 0.3, 0.2) * (1 + 0.6 * np.sin(2 * np.pi * 30 * t(0.3))))
save("flip", lp(noise(0.12), 15) * env(int(0.12 * SR), r=0.03))
save("crack", mix(*[(i * 0.03, noise(0.04) * env(int(0.04 * SR), r=0.01)) for i in range(6)]) - lp(mix(*[(i * 0.03, noise(0.04)) for i in range(6)]), 20))
save("cash-rain", mix(*[(rng.uniform(0, 1.2), lp(noise(0.05), 4) * env(int(0.05 * SR), r=0.015)) for _ in range(40)]))
x = t(1.1); save("sputter", lp(noise(1.1), 60) * (np.sin(2 * np.pi * 9 * x) > 0.3) * np.linspace(1, 0.2, len(x)))
save("sad-horn", mix((0, tone(392, 370, 0.4, 0.5, "sq")), (0.45, tone(370, 349, 0.4, 0.5, "sq")), (0.9, tone(349, 300, 0.9, 0.8, "sq"))))
x = t(0.6); save("roar", lp(noise(0.6), 25) * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * x)) * env(len(x), a=0.05, r=0.3))
save("hum", lp(noise(1.0), 200) * 0.3 + tone(120, 120, 1.0, 5) * 0.3)
print(len(os.listdir(out)), "sfx")
