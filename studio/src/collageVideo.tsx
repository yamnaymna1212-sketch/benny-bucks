// Reusable builder for collage videos: voice + one scene per narration line + narration-synced camera
// + a camera kick on every cut + shake on every 'impact' + SFX + outlined captions. Keeps every video consistent.
import React from 'react';
import {Audio, staticFile} from 'remotion';
import {Scene, Fonts, Sfx, Camera, wordTimer} from './engine';
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

export const videoSeconds = (tim: Tim) => +(tim[tim.length - 1].end + 0.9).toFixed(2);

export const CollageVideo = ({voice, tim, lines, cams, sfx, captionY = 1305}: {voice: string; tim: Tim; lines: LineFn[]; cams: K[][]; sfx: [number, string][]; captionY?: number}) => {
  const end = videoSeconds(tim);
  const starts = [-1.6, ...tim.slice(1).map((l) => l.start)]; // line 1 is fully assembled at 0s: the hook opens still
  const cuts = tim.slice(1).map((l) => l.start);
  const W = wordTimer(tim);
  const impacts = sfx.filter(([, n]) => n === 'impact').map(([t]) => t);
  return <>
    <Fonts />
    <Audio src={staticFile(voice)} />
    <Camera punch={cuts} shake={impacts}>
      {lines.map((Line, k) => <Scene key={k} from={Math.max(0, starts[k])} to={k < lines.length - 1 ? tim[k + 1].start : end} cam={soften(cams[k] ?? [[0, 1, 540, 960]])}><Line at={starts[k]} w={k === 0 ? () => starts[0] : (word) => W(k + 1, word)} /></Scene>)}
    </Camera>
    {sfx.map(([t, n], i) => <Sfx key={i} at={t} name={n} />)}
    <Scene from={0} to={end} overlay><OutlineCaptions lines={tim.map((l) => ({...l, text: l.text.replace(/-/g, ' ')}))} end={end} y={captionY} size={68} /></Scene>
  </>;
};

// Gate 2 contact-sheet composition: one fully assembled frame per line.
export const CollageSheet = ({lines}: {lines: LineFn[]}) => <><Fonts />{lines.map((Line, k) =>
  <Scene key={k} from={k / 30} to={(k + 1) / 30}><Line at={k / 30 - 10} w={() => k / 30 - 10} /></Scene>)}</>;
