// Reusable acting library: describe a penguin's performance as a list of named actions, get position + pose per frame.
// Keeps episodes fast to build and every character consistent. Times are absolute seconds.
import React from 'react';
import {Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {FPS} from '../base';
import {PenguinPose, back, talk} from './rig';

export type Act =
  | {do: 'walk' | 'run'; at: number; to: number; dur?: number}
  | {do: 'face'; at: number; turn: number; side?: boolean}
  | {do: 'give' | 'take'; at: number; hand?: 'L' | 'R'}
  | {do: 'hold'; at: number; until: number}
  | {do: 'talk'; at: number; until: number}
  | {do: 'shock' | 'cheer' | 'fall'; at: number; dur?: number}
  | {do: 'cry' | 'droop' | 'sit' | 'sweat' | 'angry' | 'smug' | 'wave'; at: number; until: number}
  | {do: 'look'; at: number; look: [number, number]}
  | {do: 'mood'; at: number; pose: PenguinPose};

const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const r = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const ease = (p: number) => 1 - Math.pow(1 - p, 3);

// Returns the penguin's x and pose at time t for a start x and a list of actions.
export function perform(t: number, x0: number, acts: Act[], base: PenguinPose = {}): {x: number; pose: PenguinPose; running: boolean; dir: number} {
  let x = x0, pose: PenguinPose = {...base}, running = false, dir = (base.turn ?? 0) < 0 ? -1 : 1;
  const flap = (side: 'L' | 'R', v: number) => { if (side === 'R') pose.flapR = v; else pose.flapL = v; };
  for (const a of [...acts].sort((p, q) => p.at - q.at)) {
    if (t < a.at) break;
    switch (a.do) {
      case 'walk': case 'run': {
        const speed = a.do === 'run' ? 650 : 280, dur = a.dur ?? Math.max(0.35, Math.abs(a.to - x) / speed);
        const p = r(t, a.at, a.at + dur), from = x;
        dir = a.to >= from ? 1 : -1;
        x = from + (a.to - from) * (a.do === 'run' ? p : ease(p));
        if (p < 1) { pose.walk = (t - a.at) * (a.do === 'run' ? 3.2 : 1.8); pose.side = a.do === 'run' || pose.side; pose.run = a.do === 'run'; pose.turn = dir * 0.8; running = a.do === 'run'; }
        else { pose.walk = null; pose.run = false; pose.side = false; pose.turn = dir * 0.8; const d = t - a.at - dur; if (d < 0.5) pose.squash = Math.sin(d * 18) * Math.exp(-d * 7); }
        break;
      }
      case 'face': pose.turn = a.turn; pose.side = !!a.side; dir = a.turn < 0 ? -1 : 1; break;
      case 'give': case 'take': {
        const hand = a.hand ?? (dir > 0 ? 'R' : 'L'), d = t - a.at;
        const up = d < 0.25 ? back(d / 0.25) : d < 0.9 ? 1 : 1 - ease(r(d, 0.9, 1.2));
        flap(hand, 6 + 78 * up);
        pose.holding = a.do === 'give' ? d < 0.3 : d >= 0.25;
        break;
      }
      case 'hold': pose.holding = t < a.until; break;
      case 'talk': if (t < a.until) pose.mouth = talk(t, [[a.at, a.until]]); else pose.mouth = 0; break;
      case 'shock': { const dur = a.dur ?? 1.3; if (t < a.at + dur) {
        pose = {...pose, brows: 'shock', eyeScale: 1 + 0.3 * ease(r(t, a.at, a.at + 0.15)), pupil: 0.4, tremble: 1, mouth: 0.3, flapL: 115, flapR: 115, turn: 0, side: false, holding: false};
      } else { pose.tremble = 0; pose.eyeScale = 1; pose.pupil = 1; pose.mouth = 0; pose.flapL = 6; pose.flapR = 6; pose.brows = 'worried'; } break; }
      case 'cheer': { const d = t - a.at, dur = a.dur ?? 1.2; if (d < dur) { pose.hop = Math.abs(Math.sin(d * 9)) * 60; pose.flapL = 100 + Math.sin(d * 18) * 20; pose.flapR = 100 - Math.sin(d * 18) * 20; pose.brows = 'happy'; pose.beak = 'smile'; } break; }
      case 'fall': pose.lie = ease(r(t, a.at, a.at + 0.3)); pose.brows = 'shock'; pose.eyeScale = 1.2; pose.pupil = 0.4; break;
      case 'cry': if (t < a.until) { pose.tears = true; pose.brows = 'worried'; pose.beak = 'frown'; pose.look = [0, 0.4]; } else pose.tears = false; break;
      case 'droop': if (t < a.until) { pose.lids = 0.45; pose.brows = 'worried'; pose.beak = 'frown'; pose.lean = (pose.lean ?? 0) + 4; pose.look = [0, 0.6]; pose.flapL = 2; pose.flapR = 2; } else { pose.lids = 0; } break;
      case 'sit': if (t < a.until) pose.sit = ease(r(t, a.at, a.at + 0.25)); else pose.sit = 0; break;
      case 'sweat': pose.sweat = t < a.until; break;
      case 'angry': if (t < a.until) { pose.angry = ease(r(t, a.at, a.at + 0.4)); pose.brows = 'angry'; pose.beak = 'frown'; } else pose.angry = 0; break;
      case 'smug': if (t < a.until) { pose.lids = 0.5; pose.beak = 'smile'; pose.brows = 'none'; } else pose.lids = 0; break;
      case 'wave': if (t < a.until) { flap(dir > 0 ? 'R' : 'L', 95 + Math.sin(t * 13) * 28); } break;
      case 'look': pose.look = a.look; break;
      case 'mood': pose = {...pose, ...a.pose}; break;
    }
  }
  return {x, pose, running, dir};
}

// Background music bed with ducking: dips under the narrator (vo ranges) and cuts out on `stops` (shock beats), then returns.
export const Music = ({src, from = 0, until, vol = 0.32, duck = [], stops = [], startAt = 0}: {src: string; from?: number; until?: number; vol?: number; duck?: [number, number][]; stops?: number[]; startAt?: number}) => {
  const frame0 = Math.round(from * FPS), dur = until !== undefined ? Math.round((until - from) * FPS) : undefined;
  return <Sequence from={frame0} durationInFrames={dur} layout="none">
    <Audio src={staticFile(`music/${src}.wav`)} startFrom={Math.round(startAt * FPS)} volume={(f) => {
      const t = from + f / FPS;
      let v = vol * Math.min(1, f / 8);
      if (until !== undefined) v *= Math.min(1, (until - t) / 0.4);
      for (const [a, b] of duck) if (t > a - 0.15 && t < b + 0.25) v *= 0.45;
      for (const s of stops) { const d = t - s; if (d >= 0 && d < 1.0) v *= d < 0.8 ? 0 : (d - 0.8) / 0.2; }
      return Math.max(0, v);
    }} />
  </Sequence>;
};

export const useSeconds = () => useCurrentFrame() / FPS;
export const lerpT = (t: number, a: number, b: number, from: number, to: number) => interpolate(t, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
export const Frag = React.Fragment;

// ---------- Transitions between shots (variety without shake): ----------
// 'cut' hard cut (default, like the reference) | 'swipe' slide + streak | 'zoom' punch through | 'iris' circle open | 'pop' scale settle.
export type Fx = 'cut' | 'swipe' | 'swipeL' | 'zoom' | 'iris' | 'pop';
export function cutFX(tc: number, cuts: {at: number; fx?: Fx}[]): React.CSSProperties {
  const D = 0.16;
  for (let i = 0; i < cuts.length; i++) {
    const {at, fx = 'cut'} = cuts[i];
    if (fx === 'cut') continue;
    const into = (tc - at) / D, out = (at - tc) / D; // into: 0..1 after the cut, out: 0..1 before it
    if (into >= 0 && into < 1) {
      const p = 1 - Math.pow(1 - into, 3);
      if (fx === 'swipe' || fx === 'swipeL') return {transform: `translateX(${(1 - p) * (fx === 'swipe' ? 1080 : -1080)}px)`, filter: `blur(${(1 - p) * 6}px)`};
      if (fx === 'zoom') return {transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: '540px 960px'};
      if (fx === 'iris') return {clipPath: `circle(${p * 1150}px at 540px 900px)`};
      if (fx === 'pop') return {transform: `scale(${1.12 - 0.12 * p})`, transformOrigin: '540px 960px'};
    }
    if (out > 0 && out < 1 && (fx === 'swipe' || fx === 'swipeL' || fx === 'zoom')) {
      const p = 1 - out;
      if (fx === 'zoom') return {transform: `scale(${1 + p * p * 1.6})`, transformOrigin: '540px 960px', filter: `blur(${p * 5}px)`};
      return {transform: `translateX(${p * p * (fx === 'swipe' ? -1080 : 1080)}px)`, filter: `blur(${p * 6}px)`};
    }
  }
  return {};
}
