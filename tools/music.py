"""Original, royalty-free background music for the penguin series (100% generated here, no samples).
Playful "curious explainer" bed: pizzicato-style plucks, marimba chords, walking bass, soft shaker/snap.
Writes studio/public/music/<name>.wav. Usage: python3 tools/music.py
"""
import os, wave
import numpy as np

SR = 44100
out = os.path.join(os.path.dirname(__file__), "..", "studio", "public", "music")
os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(7)

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)

def pluck(f, d, bright=0.5):  # Karplus-Strong string pluck
    n = int(d * SR); p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p) * bright + rng.uniform(-1, 1, p) * (1 - bright) * 0.3
    y = np.zeros(n)
    for i in range(n):
        y[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    return y * np.exp(-np.linspace(0, 6, n))

def marimba(f, d):
    t = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 30)) * np.exp(-t * 7)

def bass(f, d):
    t = np.arange(int(d * SR)) / SR
    y = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sign(np.sin(2 * np.pi * f * t))
    return y * np.minimum(1, t * 200) * np.exp(-t * 5)

def glock(f, d):
    t = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t)) * np.exp(-t * 4)

def noise_hit(d, decay, hp=0.0):
    n = int(d * SR); x = rng.standard_normal(n)
    if hp: x = x - np.convolve(x, np.ones(8) / 8, mode="same")  # crude high-pass
    return x * np.exp(-np.linspace(0, decay, n))

def kick(d=0.25):
    t = np.arange(int(d * SR)) / SR
    return np.sin(2 * np.pi * (50 + 70 * np.exp(-t * 30)) * t) * np.exp(-t * 14)

def place(track, y, at, g=1.0):
    i = int(at * SR); j = min(len(track), i + len(y))
    if i < len(track): track[i:j] += y[: j - i] * g

def song(name, bpm, bars, chords, melody, seconds, swing=0.08):
    beat = 60 / bpm; e = beat / 2
    L = int(seconds * SR) + SR
    mel, harm, low, perc = (np.zeros(L) for _ in range(4))
    b = 0; t0 = 0.0
    while t0 < seconds:
        root, triad = chords[b % len(chords)]
        line = melody[b % len(melody)]
        for k in range(8):  # eighths with a light swing
            at = t0 + k * e + (swing * e if k % 2 else 0)
            # melody
            n = line[k]
            if n is not None: place(mel, pluck(hz(n), 0.45, 0.7), at, 0.55)
            # marimba chord stabs on the off-beats
            if k in (1, 3, 5, 7) and (b % 4 != 3 or k < 5):
                for m in triad: place(harm, marimba(hz(m), 0.3), at, 0.16)
            # walking bass on quarters
            if k % 2 == 0:
                walk = [root, root + 7, root + 12, root + 7][k // 2]
                place(low, bass(hz(walk), 0.32), at, 0.5)
            # shaker on every eighth, snap on 2 and 4, soft kick on 1
            place(perc, noise_hit(0.05, 30, hp=1), at, 0.022 if k % 2 else 0.035)
            if k in (2, 6): place(perc, noise_hit(0.07, 28, hp=1), at, 0.11)
            if k == 0: place(perc, kick(), at, 0.5)
        if b % 8 == 7: place(mel, glock(hz(line[0] + 12 if line[0] else 84), 1.2), t0 + 7 * e, 0.25)
        b += 1; t0 += 4 * beat
    mix = mel + harm + low + perc
    mix = mix[: int(seconds * SR)]
    fade = int(0.04 * SR); mix[:fade] *= np.linspace(0, 1, fade); mix[-fade:] *= np.linspace(1, 0, fade)
    mix = 0.85 * mix / (np.max(np.abs(mix)) + 1e-9)
    st = np.stack([mix, np.roll(mix, int(0.012 * SR)) * 0.96], axis=1)  # tiny width
    with wave.open(f"{out}/{name}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())
    print("wrote", name, seconds, "s")

R = None
# F major, playful/sneaky: F - Dm - Bb - C (two melodic variations, 8 bars)
CH = [(41, [65, 69, 72]), (38, [62, 65, 69]), (34, [58, 62, 65]), (36, [60, 64, 67])]
MEL = [
    [72, R, 69, R, 70, 72, R, 77], [74, R, 72, 70, 69, R, R, R],
    [70, R, 74, R, 72, 70, 69, R], [67, 69, 70, R, 72, R, R, R],
    [72, R, 69, R, 70, 72, R, 77], [79, R, 77, 76, 74, R, 72, R],
    [70, 72, 74, R, 77, R, 74, R], [76, R, 72, R, R, R, R, R],
]
song("penguin-curious", 100, 8, CH, MEL, 70)
# Same theme, minor & slower for sad/"broke" moments: Dm - Bb - Gm - A
CH2 = [(38, [62, 65, 69]), (34, [58, 62, 65]), (31, [55, 58, 62]), (33, [57, 61, 64])]
MEL2 = [[69, R, 65, R, 67, R, 69, R], [70, R, R, 69, 67, R, R, R], [67, R, 70, R, 69, 67, 65, R], [64, R, R, R, 61, R, R, R]]
song("penguin-sad", 84, 4, CH2, MEL2, 40, swing=0.04)
