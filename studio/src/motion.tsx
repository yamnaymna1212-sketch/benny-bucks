// Motion system v3: actors that walk/turn/react, shot camera with whip transitions, background presets.
// All times are absolute seconds (use inside a <Scene>).
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {C, FONT, pop, ramp, useT} from './engine';
import AUTO from './data/rig-auto.json';

type Auto = {aspect: number; top: number; bottom: number; l: number; r: number};
const ease = (x: number) => x * x * (3 - 2 * x);

// ---------- Actor ----------
// keys: time-ordered keyframes. Position is interpolated; moving between keys plays a walk cycle.
export type Key = {t: number; pose?: string | null; x?: number; feet?: number; h?: number; flip?: boolean; act?: 'jump' | 'shake' | 'nod' | 'punch'};
export const Actor = ({keys}: {keys: Key[]}) => {
  const t = useT();
  // resolve carried-forward state per key
  type S = {t: number; pose: string | null; x: number; feet: number; h: number; flip: boolean; act?: Key['act']};
  const ks: S[] = [];
  let cur: S = {t: 0, pose: null, x: 540, feet: 1680, h: 680, flip: false};
  for (const kk of keys) { cur = {...cur, ...kk, act: kk.act}; ks.push(cur); }
  let i = -1;
  ks.forEach((kk, j) => { if (t >= kk.t) i = j; });
  if (i < 0) return null;
  const k = ks[i];
  if (!k.pose) return null;
  const nxt: S | undefined = ks[i + 1];
  // movement toward the next key happens during the 0.6s before it (walk), if position changes
  let x = k.x, feet = k.feet, h = k.h, walking = false;
  if (nxt && (nxt.x !== k.x || nxt.feet !== k.feet || nxt.h !== k.h)) {
    const a = Math.max(k.t, nxt.t - 0.6), p = ease(Math.min(1, Math.max(0, (t - a) / (nxt.t - a))));
    x = k.x + (nxt.x - k.x) * p; feet = k.feet + (nxt.feet - k.feet) * p; h = k.h + (nxt.h - k.h) * p;
    walking = p > 0 && p < 1 && Math.abs(nxt.x - k.x) > 40;
  }
  const auto = (AUTO as Record<string, Auto>)[k.pose] ?? {aspect: 1.79, top: 0.05, bottom: 0.95, l: 0.2, r: 0.8};
  const w = h / ((auto.bottom - auto.top) * auto.aspect);
  const imgH = w * auto.aspect;
  const left = x - ((auto.l + auto.r) / 2) * w, top = feet - auto.bottom * imgH;
  const since = t - k.t;
  const entry = pop(t, k.t, 11);
  let dy = Math.sin(t * 3) * 4, rot = Math.sin(t * 1.4) * 1.2, sx = 1, sy = 1;
  if (walking) { const c = t * 11; dy -= Math.abs(Math.sin(c)) * 18; rot = Math.sin(c) * 4; }
  if (k.act === 'jump' && since < 0.5) dy -= Math.sin((since / 0.5) * Math.PI) * 90;
  if (k.act === 'shake' && since < 0.4) rot += Math.sin(since * 70) * 6 * (1 - since / 0.4);
  if (k.act === 'nod' && since < 0.5) { sy = 1 - 0.05 * Math.sin((since / 0.5) * Math.PI * 2); }
  const punch = (0.9 + 0.1 * entry) * (1 + (k.act === 'punch' && since < 0.3 ? 0.1 * Math.sin((since / 0.3) * Math.PI) : 0));
  return <div style={{position: 'absolute', left, top, width: w, height: imgH, transformOrigin: `50% ${auto.bottom * 100}%`,
    transform: `translateY(${dy}px) rotate(${rot}deg) scale(${(k.flip ? -1 : 1) * sx * punch}, ${sy * punch})`}}>
    <Img src={staticFile(`gen/${k.pose}.png`)} style={{width: w, display: 'block'}} />
    <div style={{position: 'absolute', left: '20%', right: '20%', bottom: '-1%', height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.12)', zIndex: -1}} />
  </div>;
};

// ---------- Shot camera with whip-pan transitions ----------
// shots: [time, zoom, focusX, focusY] keyframes (eased). whips: times where a fast horizontal push + motion blur hides a scene change.
export const ShotCam = ({shots, whips = [], bg, children}: {shots: [number, number, number, number][]; whips?: number[]; bg?: React.ReactNode; children: React.ReactNode}) => {
  const t = useT();
  const k = (i: number) => shots.length === 1 ? shots[0][i] : interpolate(t, shots.map((s) => s[0]), shots.map((s) => s[i]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const z = k(1), fx = k(2), fy = k(3);
  let dx = 0, blur = 0;
  for (const T of whips) {
    if (t >= T - 0.12 && t < T) { const p = (t - (T - 0.12)) / 0.12; dx = -ease(p) * 650; blur = 22 * p; }
    if (t >= T && t < T + 0.16) { const p = (t - T) / 0.16; dx = (1 - ease(p)) * 650; blur = 22 * (1 - p); }
  }
  const f = blur > 0.5 ? `blur(${blur}px)` : undefined;
  // background: oversized parallax layer (moves ~30% of the camera) so camera moves never reveal edges
  const bz = 1.12 + (z - 1) * 0.3, bx = (540 - fx) * 0.3 + dx * 0.6, by = (960 - fy) * 0.3;
  return <AbsoluteFill style={{overflow: 'hidden', background: '#1C1712'}}>
    {bg && <AbsoluteFill style={{transform: `translate(${bx}px,${by}px) scale(${bz})`, transformOrigin: '50% 50%', filter: f}}>{bg}</AbsoluteFill>}
    <AbsoluteFill style={{transform: `translate(${540 - fx * z + dx}px,${960 - fy * z}px) scale(${z})`, transformOrigin: '0 0', filter: f}}>{children}</AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- Backgrounds ----------
export type BgKind = 'caramel' | 'dark' | 'light' | 'room' | 'street';
const Grain = ({o = 0.06}: {o?: number}) => <AbsoluteFill style={{opacity: o, backgroundImage: 'repeating-radial-gradient(circle at 30% 20%, #000 0 1px, transparent 1px 4px)'}} />;
export const BgPreset = ({kind}: {kind: BgKind}) => {
  if (kind === 'caramel') return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #F6E7CF 0%, #E9CFA6 60%, #D9B585 100%)'}}><Grain /></AbsoluteFill>;
  if (kind === 'dark') return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, #3A3129 0%, #1C1712 55%, #0E0B08 100%)'}}><Grain o={0.08} /></AbsoluteFill>;
  if (kind === 'light') return <AbsoluteFill style={{background: '#FBF8F3', backgroundImage: 'linear-gradient(#EEE7DC 2px, transparent 2px), linear-gradient(90deg, #EEE7DC 2px, transparent 2px)', backgroundSize: '60px 60px'}} />;
  if (kind === 'room') return <AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(#F1DEC0 0 70%, #C99B6B 70% 100%)'}} />
    <svg width={1080} height={1920} style={{position: 'absolute'}}>
      <rect x="640" y="300" width="300" height="360" fill="#CFE6F5" stroke={C.ink} strokeWidth={8} /><path d="M790 300 L790 660 M640 480 L940 480" stroke={C.ink} strokeWidth={6} />
      <rect x="0" y="1340" width="1080" height="10" fill="#8E6A45" /><rect x="90" y="360" width="200" height="140" fill="#E9CFA6" stroke={C.ink} strokeWidth={6} />
    </svg><Grain /></AbsoluteFill>;
  // street
  return <AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(#F7E9D2 0 72%, #CDBBA2 72% 100%)'}} />
    <svg width={1080} height={1920} style={{position: 'absolute'}}>
      {[[0, 520, '#D9A47A'], [300, 600, '#C9B79B'], [600, 480, '#B98A66'], [860, 560, '#D7C3A4']].map(([x, h, c], i) =>
        <g key={i}><rect x={x as number} y={1382 - (h as number)} width="250" height={h as number} fill={c as string} stroke={C.ink} strokeWidth={6} />
          {[0, 1, 2, 3].map((r) => [0, 1].map((cc) => <rect key={`${r}${cc}`} x={(x as number) + 40 + cc * 100} y={1382 - (h as number) + 50 + r * 110} width="60" height="70" fill="#F6E9C9" stroke={C.ink} strokeWidth={4} />))}</g>)}
      <rect x="0" y="1382" width="1080" height="16" fill="#8E7A62" />
    </svg><Grain /></AbsoluteFill>;
};
// Background timeline: switches at given times (pair them with whips so the change is hidden in motion).
export const BgTimeline = ({keys}: {keys: [number, BgKind][]}) => {
  const t = useT();
  let i = 0;
  keys.forEach((k, j) => { if (t >= k[0]) i = j; });
  return <BgPreset kind={keys[i][1]} />;
};

// ---------- Numbers ----------
export const BigNum = ({x, y, at, until, from = 0, to, dur = 0.7, fmt, size = 160, color = C.ink, glow}: {x: number; y: number; at: number; until?: number; from?: number; to: number; dur?: number; fmt: (n: number) => string; size?: number; color?: string; glow?: string}) => {
  const t = useT();
  if (t < at || (until !== undefined && t >= until)) return null;
  const p = pop(t, at, 9);
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * p})`, fontFamily: FONT, fontWeight: 900, fontSize: size, color,
    WebkitTextStroke: `${size * 0.05}px ${C.ink}`, paintOrder: 'stroke fill', textShadow: glow ? `0 0 40px ${glow}` : undefined, whiteSpace: 'nowrap', letterSpacing: -3}}>{fmt(ramp(t, at, at + dur, from, to))}</div>;
};

// Bars growing over time (compound growth), with the last bar labeled.
export const GrowthBars = ({x, y, at, years = 7, from = 1000, rate = 0.1, step = 5, w = 620, h = 520, color = C.green}: {x: number; y: number; at: number; years?: number; from?: number; rate?: number; step?: number; w?: number; h?: number; color?: string}) => {
  const t = useT();
  if (t < at) return null;
  const vals = Array.from({length: years}, (_, i) => from * Math.pow(1 + rate, i * step));
  const max = vals[vals.length - 1], bw = w / years - 14;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h}}>
    {vals.map((v, i) => { const g = pop(t, at + i * 0.18, 12); const bh = (v / max) * (h - 70) * g;
      return <div key={i} style={{position: 'absolute', left: i * (bw + 14), bottom: 40, width: bw, height: Math.max(6, bh), background: color, border: `5px solid ${C.ink}`, borderRadius: 8}} />; })}
    {vals.map((_, i) => <div key={`l${i}`} style={{position: 'absolute', left: i * (bw + 14), bottom: 0, width: bw, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.ink}}>{i * step}y</div>)}
  </div>;
};

// Line chart that climbs then crashes (market drop).
export const CrashLine = ({x, y, at, w = 700, h = 420, drop = 0.3}: {x: number; y: number; at: number; w?: number; h?: number; drop?: number}) => {
  const t = useT();
  if (t < at) return null;
  const pts = [[0, 0.75], [0.15, 0.6], [0.3, 0.65], [0.45, 0.4], [0.6, 0.3], [0.7, 0.18], [0.82, 0.18 + drop * 1.5], [1, 0.18 + drop * 1.6]];
  const p = ramp(t, at, at + 1.1);
  const n = Math.max(2, Math.floor(p * pts.length) + 1);
  const d = pts.slice(0, Math.min(n, pts.length)).map(([a, b], i) => `${i ? 'L' : 'M'} ${a * w} ${b * h}`).join(' ');
  const crashed = n > 6;
  return <svg width={w} height={h} style={{position: 'absolute', left: x - w / 2, top: y - h / 2, overflow: 'visible'}}>
    <path d={`M0 ${h} L${w} ${h}`} stroke="#9a8f80" strokeWidth={4} />
    <path d={d} stroke={crashed ? C.red : C.green} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
};

// Simple phone prop.
export const Phone = ({w = 200, glow = 0}: {w?: number; glow?: number}) => (
  <svg width={w} height={w * 1.9} viewBox="0 0 100 190" style={{overflow: 'visible', filter: glow ? `drop-shadow(0 0 ${18 * glow}px #FFE58A)` : undefined}}>
    <rect x="5" y="5" width="90" height="180" rx="16" fill="#2B2B2B" stroke={C.ink} strokeWidth={5} /><rect x="13" y="20" width="74" height="145" rx="6" fill="#7FB8E6" />
    <circle cx="50" cy="13" r="3" fill="#888" /><path d="M30 80 L45 95 L72 62" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />
  </svg>
);
