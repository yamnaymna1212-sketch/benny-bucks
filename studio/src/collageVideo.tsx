// Reusable builder for collage videos: voice + one scene per narration line + narration-synced camera
// + a camera kick on every cut + shake on every 'impact' + SFX + outlined captions. Keeps every video consistent.
import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile} from 'remotion';
import {Scene, Fonts, Sfx, Camera, wordTimer, useT} from './engine';
import {HOOK_STILL} from './collage';
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
// Skips the still hook and the 0.35s after each cut.
export const beatTimes = (tim: Tim, min = 0.55) => {
  const out: number[] = []; let last = -9;
  const cuts = tim.slice(1).map((l) => l.start);
  tim.forEach((l) => { let i = 0;
    for (const w of l.text.split(' ')) { const t = l.start + (l.end - l.start) * (l.text.indexOf(w, i) / l.text.length); i = l.text.indexOf(w, i) + w.length;
      if (t > HOOK_STILL + 0.2 && t - last >= min && !cuts.some((c) => t >= c - 0.05 && t < c + 0.35)) { out.push(t); last = t; } } });
  return out;
};
const Beat = ({beats, cuts, children}: {beats: number[]; cuts: number[]; children: React.ReactNode}) => {
  const t = useT();
  let n = 0, lb = -9; for (const b of beats) if (t >= b) { n++; lb = b; }
  const lineStart = Math.max(-9, ...cuts.filter((c) => c <= t));
  const k = interpolate(t - lb, [0, 0.09], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const prev = (n - 1) % 2 === 1 ? 1 : 0, cur = n % 2 === 1 ? 1 : 0;
  const on = lb > lineStart ? prev + (cur - prev) * k : 0; // reset to the wide framing at each new line
  const z = 1 + 0.06 * on, nx = (n % 4 < 2 ? -1 : 1) * 18 * on;
  const d = t - lineStart, wp = d >= 0 && d < 0.16 ? 1 - d / 0.16 : 0, dir = cuts.indexOf(lineStart) % 2 ? -1 : 1;
  return <AbsoluteFill style={{transform: `translateX(${nx + dir * 220 * wp * wp}px) scale(${z})`, transformOrigin: '50% 45%', filter: wp > 0.05 ? `blur(${8 * wp}px)` : undefined}}>{children}</AbsoluteFill>;
};

export const videoSeconds = (tim: Tim) => +(tim[tim.length - 1].end + 0.9).toFixed(2);

// captionFill/captionYs: grid style = yellow word placed per line next to the subject.
export const CollageVideo = ({voice, tim, lines, cams, sfx, captionY = 1305, captionFill, captionYs, beats = true}: {voice: string; tim: Tim; lines: LineFn[]; cams: K[][]; sfx: [number, string][]; captionY?: number; captionFill?: string; captionYs?: number[]; beats?: boolean}) => {
  const end = videoSeconds(tim);
  const starts = [-1.6, ...tim.slice(1).map((l) => l.start)]; // line 1 is fully assembled at 0s: the hook opens still
  const cuts = tim.slice(1).map((l) => l.start);
  const W = wordTimer(tim);
  const bt = beats ? beatTimes(tim) : []; // Beat sits inside each Scene so the bled background covers whips/zooms
  const impacts = sfx.filter(([, n]) => n === 'impact').map(([t]) => t);
  return <>
    <Fonts />
    <Audio src={staticFile(voice)} />
    <Camera punch={cuts} shake={impacts}>
      {lines.map((Line, k) => <Scene key={k} from={Math.max(0, starts[k])} to={k < lines.length - 1 ? tim[k + 1].start : end} cam={soften(cams[k]?.length ? cams[k] : [[0, 1, 540, 960]])}><Beat beats={bt} cuts={beats ? cuts : []}><Beat beats={bt} cuts={beats ? cuts : []}><Line at={starts[k]} w={k === 0 ? () => starts[0] : (word) => W(k + 1, word)} /></Beat></Beat></Scene>)}
    </Camera>
    {sfx.map(([t, n], i) => <Sfx key={i} at={t} name={n} />)}
    <Scene from={0} to={end} overlay><OutlineCaptions lines={tim.map((l) => ({...l, text: l.text.replace(/-/g, ' ')}))} end={end} y={captionY} size={68} fill={captionFill} yOf={captionYs ? (i) => captionYs[i] ?? captionY : undefined} /></Scene>
  </>;
};

// Gate 2 contact-sheet composition: one fully assembled frame per line.
export const CollageSheet = ({lines}: {lines: LineFn[]}) => <><Fonts />{lines.map((Line, k) =>
  <Scene key={k} from={k / 30} to={(k + 1) / 30}><Line at={k / 30 - 10} w={() => k / 30 - 10} /></Scene>)}</>;
