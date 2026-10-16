// Reusable builder for collage videos: voice + one scene per narration line + narration-synced camera
// + a camera kick on every cut + shake on every 'impact' + SFX + outlined captions. Keeps every video consistent.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile} from 'remotion';
import {Scene, Fonts, Sfx, Camera, wordTimer, useT} from './engine';
import {HOOK_STILL} from './collage';
import {AutoIcons} from './icons';
import {OutlineCaptions} from './sketch';

export type Tim = {text: string; start: number; end: number}[];
export type K = [number, number, number, number]; // [time, zoom, focusX, focusY]
// w(word) = time that word is spoken in this line, so pieces enter ON their word (in stills it returns `at`).
export type LineFn = (p: {at: number; w: (word: string) => number}) => JSX.Element;

// Camera helpers (absolute seconds). Zoom is capped at 1.15 and kept near the vertical center so the
// caption band and Benny are never covered; backgrounds bleed, so no edge ever shows.
export const zoomTo = (t: number, z: number, fx: number, fy: number, back?: number): K[] =>
  [[t, 1, 540, 960], [t + 0.2, z, fx, fy], ...(back ? [[back, z, fx, fy], [back + 0.2, 1, 540, 960]] as K[] : [])];
export const punchIn = (a: number, b: number, z: number, fx: number, fy: number): K[] => [[a, 1, 540, 960], [a + 0.25, z, fx, fy], [Math.max(b, a + 0.3), z, fx, fy]];
const soften = (c: K[]) => c.map(([t, z, fx, fy]) => [t, Math.min(z, 1.15), fx, 960 + (fy - 960) * 0.25] as K);

// AUTO-BEAT: a visual change every ~0.5–0.8s generated from the word timings — the framing jumps between two
// tight crops (zoom 1.0 ↔ 1.06, nudged left/right) on word starts, and every line change is a fast whip (slide + blur).
// Skips the hook line (it has its own strong side-to-side zoom, uncapped) and the 0.35s after each cut.
export const beatTimes = (tim: Tim, min = 0.6) => {
  const out: number[] = []; let last = -9;
  const cuts = tim.slice(1).map((l) => l.start);
  tim.forEach((l) => { let i = 0;
    for (const w of l.text.split(' ')) { const t = l.start + (l.end - l.start) * (l.text.indexOf(w, i) / l.text.length); i = l.text.indexOf(w, i) + w.length;
      if (t >= (tim[1]?.start ?? 0) && t - last >= min && !cuts.some((c) => t >= c - 0.05 && t < c + 0.35)) { out.push(t); last = t; } } });
  return out;
};
// Camera language per beat (cycled so it never repeats the same move twice in a row):
// punch = quick 0.08s cut-in · deep = slow push into the subject over the whole beat
// out = pull-back reveal · hold = no move (breathing room). Line changes: zoom-through or zoom-out settle.
// User rule: ZOOM ONLY — no shake, no tilt, no lateral drift/whips. Variety comes from zoom type and depth.
const MOVES = ['punch', 'deep', 'hold', 'out', 'punch', 'hold', 'deep', 'out'] as const;
const TRANS = ['zoom', 'zoomOut'] as const;
const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const Beat = ({beats, cuts, children}: {beats: number[]; cuts: number[]; children: React.ReactNode}) => {
  const t = useT();
  const lineStart = Math.max(-9, ...cuts.filter((c) => c <= t));
  const nextCut = Math.min(1e9, ...cuts.filter((c) => c > t));
  let n = -1; beats.forEach((b, i) => { if (t >= b && b > lineStart) n = i; });
  let z = 1, x = 0, y = 0, r = 0;
  if (n >= 0) {
    const b0 = beats[n], b1 = Math.min(beats[n + 1] ?? 1e9, nextCut), d = t - b0, len = Math.max(0.3, b1 - b0);
    const mv = MOVES[n % MOVES.length];
    if (mv === 'punch') z = 1 + 0.08 * ease(d / 0.08);
    if (mv === 'deep') z = 1 + 0.14 * ease(d / len);
    if (mv === 'out') z = 1.16 - 0.16 * ease(d / 0.35);
  }
  const ci = cuts.indexOf(lineStart), tr = TRANS[(ci < 0 ? 0 : ci) % TRANS.length], dd = t - lineStart;
  const wp = ci >= 0 && dd >= 0 && dd < 0.18 ? Math.pow(1 - dd / 0.18, 2) : 0;
  if (wp > 0) { if (tr === 'zoom') z *= 1 + 0.3 * wp; else z *= 1 + 0.12 * wp; }
  return <AbsoluteFill style={{transform: `translate(${x}px,${y}px) scale(${z}) rotate(${r}deg)`, transformOrigin: '50% 45%', filter: wp > 0.08 ? `blur(${9 * wp}px)` : undefined}}>{children}</AbsoluteFill>;
};

export const videoSeconds = (tim: Tim) => +(tim[tim.length - 1].end + 0.9).toFixed(2);

// captionFill/captionYs: grid style = yellow word placed per line next to the subject.
export const CollageVideo = ({voice, tim, lines, cams, sfx, captionY = 1305, captionFill, captionYs, beats = true, icons = false, minSeconds = 0, beatEvery = 0.6}: {voice: string; tim: Tim; lines: LineFn[]; cams: K[][]; sfx: [number, string][]; captionY?: number; captionFill?: string; captionYs?: number[]; beats?: boolean; icons?: boolean; minSeconds?: number; beatEvery?: number}) => {
  const end = Math.max(minSeconds, videoSeconds(tim));
  const starts = [-1.6, ...tim.slice(1).map((l) => l.start)]; // line 1 is fully assembled at 0s: the hook opens still
  const cuts = tim.slice(1).map((l) => l.start);
  const W = wordTimer(tim);
  const bt = beats ? beatTimes(tim, beatEvery) : []; // Beat sits inside each Scene so the bled background covers whips/zooms
  return <>
    <Fonts />
    <Audio src={staticFile(voice)} />
    <Camera punch={cuts}>
      {lines.map((Line, k) => <Scene key={k} from={Math.max(0, starts[k])} to={k < lines.length - 1 ? tim[k + 1].start : end} cam={k === 0 && cams[0]?.length ? cams[0] : soften(cams[k]?.length ? cams[k] : [[0, 1, 540, 960]])}><Beat beats={bt} cuts={beats ? cuts : []}><Line at={starts[k]} w={k === 0 ? () => starts[0] : (word) => W(k + 1, word)} /></Beat></Scene>)}
    </Camera>
    {sfx.map(([t, n], i) => <Sfx key={i} at={t} name={n} />)}
    {cuts.map((c, i) => <Sfx key={`cut${i}`} at={Math.max(0, c - 0.05)} name="whoosh" vol={0.22} />)}
    {icons && <Scene from={0} to={end} overlay><AutoIcons tim={tim} /></Scene>}
    <Scene from={0} to={end} overlay><OutlineCaptions lines={tim.map((l) => ({...l, text: l.text.replace(/-/g, ' ')}))} end={end} y={captionY} size={68} fill={captionFill} yOf={captionYs ? (i) => captionYs[i] ?? captionY : undefined} /></Scene>
  </>;
};

// Gate 2 contact-sheet composition: one fully assembled frame per line.
export const CollageSheet = ({lines}: {lines: LineFn[]}) => <><Fonts />{lines.map((Line, k) =>
  <Scene key={k} from={k / 30} to={(k + 1) / 30}><Line at={k / 30 - 10} w={() => k / 30 - 10} /></Scene>)}</>;
