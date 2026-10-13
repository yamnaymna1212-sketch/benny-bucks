// Reusable Benny Bucks building blocks. All times are in seconds, relative to the parent <Scene>.
import React from 'react';
import {AbsoluteFill, Audio, Img as RImg, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const FPS = 30;
export const f = (s: number) => Math.round(s * FPS);
export const C = {ink: '#1A1A1A', green: '#2E9E4F', red: '#D83A2E', yellow: '#F5C518', paper: '#FFFFFF'};
const font = `@font-face{font-family:Marker;src:url(${staticFile('fonts/PermanentMarker.ttf')})}`;
export const Fonts = () => <style>{font}</style>;

const useT = () => useCurrentFrame() / FPS;
const pop = (t: number, at: number) => spring({frame: f(t - at), fps: FPS, config: {damping: 9, stiffness: 160}});

type Enter = 'pop' | 'slideL' | 'slideR' | 'drop' | 'fade' | 'none';
type Common = {x: number; y: number; at?: number; until?: number; enter?: Enter; shakeAt?: number[]; bob?: boolean; rot?: number};

function useMotion({at = 0, until, enter = 'pop', shakeAt = [], bob, rot = 0}: Common) {
  const t = useT();
  if (t < at || (until !== undefined && t >= until)) return null;
  const p = enter === 'none' ? 1 : pop(t, at);
  let dx = 0, dy = 0, s = 1, o = 1;
  if (enter === 'pop') s = p;
  if (enter === 'slideL') dx = (1 - p) * -900;
  if (enter === 'slideR') dx = (1 - p) * 900;
  if (enter === 'drop') dy = (1 - p) * -700;
  if (enter === 'fade') o = Math.min(1, (t - at) / 0.25);
  for (const k of shakeAt) { const d = t - k; if (d >= 0 && d < 0.35) dx += Math.sin(d * 90) * 18 * (1 - d / 0.35); }
  if (bob) { dy += Math.sin(t * 3.2) * 6; s *= 1 + Math.sin(t * 2.1) * 0.008; }
  return {transform: `translate(${dx}px,${dy}px) scale(${s}) rotate(${rot}deg)`, opacity: o};
}

// Image placed by its center; white backgrounds vanish via multiply blending.
export const Pic = ({src, w, ...m}: Common & {src: string; w: number}) => {
  const st = useMotion(m);
  if (!st) return null;
  return <RImg src={staticFile(`gen/${src}.jpg`)} style={{position: 'absolute', left: m.x - w / 2, top: m.y, width: w,
    transform: `translateY(-50%) ${st.transform}`, opacity: st.opacity, mixBlendMode: 'multiply', transformOrigin: 'center'}} />;
};

export const Txt = ({children, size = 110, color = C.ink, stroke = true, ...m}: Common & {children: React.ReactNode; size?: number; color?: string; stroke?: boolean}) => {
  const st = useMotion(m);
  if (!st) return null;
  return <div style={{position: 'absolute', left: m.x, top: m.y, transform: `translate(-50%,-50%) ${st.transform}`, opacity: st.opacity,
    fontFamily: 'Marker', fontSize: size, color, whiteSpace: 'pre', textAlign: 'center', lineHeight: 1.05,
    WebkitTextStroke: stroke ? `${Math.max(3, size / 22)}px white` : undefined, paintOrder: 'stroke fill'}}>{children}</div>;
};

// Number that counts from `from` to `to` between `at` and `at+dur`.
export const Counter = ({from, to, dur, fmt, ...rest}: Common & {from: number; to: number; dur: number; fmt: (n: number) => string; size?: number; color?: string}) => {
  const t = useT();
  const v = interpolate(t, [rest.at ?? 0, (rest.at ?? 0) + dur], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)});
  return <Txt {...rest}>{fmt(v)}</Txt>;
};

export const Box = ({w, h, bg, children, ...m}: Common & {w: number; h: number; bg: string; children?: React.ReactNode}) => {
  const st = useMotion(m);
  if (!st) return null;
  return <div style={{position: 'absolute', left: m.x - w / 2, top: m.y - h / 2, width: w, height: h, background: bg, border: `6px solid ${C.ink}`,
    borderRadius: 18, transform: st.transform, opacity: st.opacity, display: 'flex', alignItems: 'center', justifyContent: 'center', transformOrigin: 'center'}}><div style={{position: 'relative', width: 0, height: 0}}>{children}</div></div>;
};

// Camera: keyframes of [time, zoom, focusX, focusY]; focus point is kept centered.
export const Scene = ({from, to, cam = [[0, 1, 540, 960]], overlay, children}: {from: number; to: number; cam?: [number, number, number, number][]; overlay?: boolean; children: React.ReactNode}) => (
  <Sequence from={f(from)} durationInFrames={f(to) - f(from)}><Cam cam={cam} overlay={overlay}>{children}</Cam></Sequence>
);
const Cam = ({cam, overlay, children}: {cam: [number, number, number, number][]; overlay?: boolean; children: React.ReactNode}) => {
  const t = useT();
  const k = (i: number) => cam.length === 1 ? cam[0][i] : interpolate(t, cam.map((c) => c[0]), cam.map((c) => c[i]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => x * x * (3 - 2 * x)});
  const z = k(1), fx = k(2), fy = k(3);
  return <AbsoluteFill style={{background: overlay ? 'transparent' : C.paper, overflow: 'hidden'}}>
    <AbsoluteFill style={{transform: `translate(${540 - fx * z}px,${960 - fy * z}px) scale(${z})`, transformOrigin: '0 0'}}>{children}</AbsoluteFill>
  </AbsoluteFill>;
};

// SFX always sit well under the narration (global gain ≈ -9 dB).
export const SFX_GAIN = 0.35;
export const Sfx = ({at, name, vol = 0.5}: {at: number; name: string; vol?: number}) => (
  <Sequence from={f(at)} layout="none"><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * SFX_GAIN} /></Sequence>
);
