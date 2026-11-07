import sys, os, shutil, wave
import numpy as np

sys.path.insert(0, "/home/claude/collage")
os.chdir("/home/claude/collage")
from lib import paper  # noqa
import frames
sticker = frames.sticker

PUB = "/home/claude/episode-sample/public"
os.makedirs(PUB + "/sfx", exist_ok=True)

paper(2112, 1188).save(PUB + "/paper.png")

spec = {"warning": (130, -8), "padlock": (130, 7), "magnifier": (190, 8), "document": (140, -6),
        "bank": (190, -5), "wallet": (190, 4), "network": (190, -3), "coins": (190, 6),
        "scale": (150, -7), "ledger": (140, 6)}
for n, (s, r) in spec.items():
    sticker(n, s, r).save("%s/st_%s.png" % (PUB, n))

shutil.copy("/tmp/fig_hood_gray.png", PUB + "/hood.png")
shutil.copy("/tmp/fig_suit_halftone.png", PUB + "/suit_halftone.png")
shutil.copy("/tmp/fig_suit_gray.png", PUB + "/suit_gray.png")
shutil.copy("/tmp/pf.ttf", PUB + "/pf.ttf")

SR = 44100
rng = np.random.default_rng(3)


def save(name, x, peak=0.9):
    x = np.clip(x / (np.max(np.abs(x)) + 1e-9) * peak, -1, 1)
    with wave.open("%s/sfx/%s.wav" % (PUB, name), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


t = np.arange(int(0.6 * SR)) / SR
save("thud", np.sin(2 * np.pi * (55 + 40 * np.exp(-t * 30)) * t) * np.exp(-t * 7) + 0.25 * rng.standard_normal(len(t)) * np.exp(-t * 60))
tt = np.arange(int(0.06 * SR)) / SR
tick = np.diff(rng.standard_normal(len(tt)) * np.exp(-tt * 110), prepend=0)
save("tick", tick, 0.6)
n = int(0.7 * SR)
noise = rng.standard_normal(n)
alpha = np.linspace(0.02, 0.35, n)
y = np.zeros(n)
for i in range(1, n):
    y[i] = y[i - 1] + alpha[i] * (noise[i] - y[i - 1])
save("whoosh", y * np.sin(np.pi * np.arange(n) / n) ** 2, 0.7)
n = int(23 * SR)
td = np.arange(n) / SR
d = 0.5 * np.sin(2 * np.pi * 55 * td) + 0.3 * np.sin(2 * np.pi * 82.41 * td + 1) + 0.2 * np.sin(2 * np.pi * 110 * td) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * td))
d *= np.minimum(1, td / 1.5) * np.minimum(1, (td[-1] - td) / 2)
save("drone", d, 0.8)
print("assets ok", sorted(os.listdir(PUB)))
