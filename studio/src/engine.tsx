// Reusable Benny Bucks building blocks. ALL times are absolute seconds on the video timeline.
import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Audio, Img as RImg, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';

export const FPS = 30;
export const f = (s: number) => Math.round(s * FPS);
export const C = {ink: '#1A1A1A', green: '#2E9E4F', red: '#D83A2E', gold: '#F2B705', yellow: '#F5C518', blue: '#2F5DA8', paper: '#FFFFFF', bill: '#8CC084', sand: '#E8C46A'};
export const FONT = 'Montserrat';
export const Fonts = () => <style>{`@font-face{font-family:${FONT};src:url(${staticFile('fonts/Montserrat.ttf')});font-weight:100 900}`}</style>;

// Layout zones (agentstick-style split screen)
export const Z = {topY: 580, wordY: 990, bennyHeadY: 1110};

const SceneStart = createContext(0);
export const useT = () => useContext(SceneStart) + useCurrentFrame() / FPS;
export const pop = (t: number, at: number, damping = 9) => spring({frame: f(t - at), fps: FPS, config: {damping, stiffness: 170}});
export const ramp = (t: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(t, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)});

type Enter = 'pop' | 'slideL' | 'slideR' | 'drop' | 'fade' | 'none';
export type Timing = {at?: number; until?: number; enter?: Enter; shakeAt?: number[]; bob?: boolean; rot?: number};

export function useMotion({at = -1e9, until, enter = 'pop', shakeAt = [], bob, rot = 0}: Timing) {
  const t = useT();
  if (t < at || (until !== undefined && t >= until)) return null;
  const p = enter === 'none' || at < -1e8 ? 1 : pop(t, at);
  let dx = 0, dy = 0, s = 1, o = 1;
  if (enter === 'pop') s = p;
  if (enter === 'slideL') dx = (1 - p) * -900;
  if (enter === 'slideR') dx = (1 - p) * 900;
  if (enter === 'drop') dy = (1 - p) * -600;
  if (enter === 'fade') o = Math.min(1, (t - at) / 0.25);
  for (const k of shakeAt) { const d = t - k; if (d >= 0 && d < 0.35) dx += Math.sin(d * 90) * 16 * (1 - d / 0.35); }
  if (bob) { dy += Math.sin(t * 3.2) * 6; s *= 1 + Math.sin(t * 2.1) * 0.008; }
  return {transform: `translate(${dx}px,${dy}px) scale(${s}) rotate(${rot}deg)`, opacity: o, t};
}

// Positioned layer: centers its children at (x,y) and applies the timing motion.
export const At = ({x, y, children, ...m}: Timing & {x: number; y: number; children: React.ReactNode}) => {
  const st = useMotion(m);
  if (!st) return null;
  return <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, transform: st.transform, opacity: st.opacity}}>
    <div style={{position: 'absolute', transform: 'translate(-50%,-50%)'}}>{children}</div>
  </div>;
};

// Raster image; white background vanishes via multiply blending.
export const Pic = ({src, w, x, y, ...m}: Timing & {src: string; w: number; x: number; y: number}) => (
  <At x={x} y={y} {...m}><RImg src={staticFile(`gen/${src}.png`)} style={{width: w, display: 'block'}} /></At>
);

export const Txt = ({children, size = 90, color = C.ink, weight = 800, x, y, ...m}: Timing & {children: React.ReactNode; size?: number; color?: string; weight?: number; x: number; y: number}) => (
  <At x={x} y={y} {...m}><div style={{fontFamily: FONT, fontWeight: weight, fontSize: size, color, whiteSpace: 'pre', textAlign: 'center', lineHeight: 1.0, letterSpacing: -1}}>{children}</div></At>
);

export const Counter = ({from, to, at, dur, fmt, ...rest}: {from: number; to: number; at: number; dur: number; fmt: (n: number) => string; x: number; y: number; size?: number; color?: string; until?: number; enter?: Enter}) => {
  const t = useT();
  return <Txt at={at} enter={rest.enter ?? 'none'} {...rest}>{fmt(ramp(t, at, at + dur, from, to))}</Txt>;
};

// One big word in the middle band, swapped on the voice. items: [time, text, color?]
export const Words = ({items, end}: {items: [number, string, string?][]; end: number}) => {
  const t = useT();
  let i = -1;
  items.forEach((it, k) => { if (t >= it[0]) i = k; });
  if (i < 0 || t >= end) return null;
  const [at, text, color] = items[i];
  const p = pop(t, at, 11);
  const size = Math.min(160, Math.floor(940 / (Math.max(3, text.length) * 0.74)));
  return <div style={{position: 'absolute', left: 540, top: Z.wordY, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * p})`,
    fontFamily: FONT, fontWeight: 900, fontSize: size, color: color ?? C.ink, whiteSpace: 'nowrap', letterSpacing: -2}}>{text}</div>;
};

// Benny rig: pose swaps with zoom punch, idle tilt/bob, and blinking eyelids.
type Rig = {aspect: number; top: number; eyes?: [number, number, number][]};
export const RIG: Record<string, Rig> = {
  'benny-shocked': {aspect: 1.79, top: 0.05, eyes: [[0.26, 0.316, 0.085], [0.475, 0.3, 0.085]]},
  'benny-pointing': {aspect: 1.79, top: 0.085, eyes: [[0.40, 0.267, 0.05], [0.55, 0.26, 0.05]]},
  'benny-sad-02': {aspect: 1.79, top: 0.085, eyes: [[0.59, 0.268, 0.04], [0.675, 0.27, 0.04]]},
  'benny-angry': {aspect: 1.79, top: 0.07, eyes: [[0.575, 0.256, 0.04], [0.67, 0.256, 0.04]]},
  'benny-thinking-03': {aspect: 1.79, top: 0.045, eyes: [[0.44, 0.275, 0.05], [0.59, 0.275, 0.055]]},
  'benny-relaxed': {aspect: 1.79, top: 0.14, eyes: [[0.40, 0.31, 0.045], [0.54, 0.31, 0.045]]},
  'benny-worried': {aspect: 1.5, top: 0.07, eyes: [[0.44, 0.285, 0.035], [0.54, 0.285, 0.035]]},
  'benny-excited': {aspect: 1.79, top: 0.03},
  'benny-front': {aspect: 1.79, top: 0.03, eyes: [[0.44, 0.256, 0.05], [0.575, 0.256, 0.05]]},
  'benny-sad': {aspect: 1.79, top: 0.03, eyes: [[0.425, 0.256, 0.05], [0.575, 0.256, 0.05]]},
  'benny-smug-cash-pile': {aspect: 1.79, top: 0.056, eyes: [[0.38, 0.223, 0.04], [0.50, 0.212, 0.04]]},
  'benny-saving-cash': {aspect: 1.5, top: 0.075, eyes: [[0.405, 0.242, 0.04], [0.51, 0.242, 0.04]]},
  'benny-running-cash': {aspect: 1.79, top: 0.195, eyes: [[0.695, 0.30, 0.03], [0.78, 0.296, 0.03]]},
};
export const Benny = ({poses, w = 760, x = 540}: {poses: [number, string | null][]; w?: number; x?: number}) => {
  const t = useT();
  let i = -1;
  poses.forEach((p, k) => { if (t >= p[0]) i = k; });
  if (i < 0 || !poses[i][1]) return null;
  const [at, name] = poses[i] as [number, string];
  const rig = RIG[name] ?? {aspect: 1.79, top: 0.05};
  const h = w * rig.aspect;
  const top = Z.bennyHeadY - rig.top * h;
  const p = pop(t, at, 10);
  const close = i % 3 === 1 ? 1.16 : 1;
  const s = (0.9 + 0.1 * p) * close + Math.sin(t * 2.1) * 0.006;
  const tilt = Math.sin(t * 1.3 + i) * 1.6;
  const blink = ((t + i * 0.7) % 3.4) < 0.12;
  return <div style={{position: 'absolute', left: x - w / 2, top, width: w, height: h, transformOrigin: `50% ${rig.top * 100}%`,
    transform: `translateY(${Math.sin(t * 3.2) * 5}px) scale(${s}) rotate(${tilt}deg)`}}>
    <RImg src={staticFile(`gen/${name}.png`)} style={{width: w, display: 'block'}} />
    {blink && rig.eyes && <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
      {rig.eyes.map(([ex, ey, r], k) => <g key={k}>
        <ellipse cx={ex * w} cy={ey * h} rx={r * w * 1.15} ry={r * w * 1.05} fill="#F6F4EF" />
        <path d={`M${(ex - r) * w} ${ey * h} Q${ex * w} ${ey * h + r * w * 0.5} ${(ex + r) * w} ${ey * h}`} stroke={C.ink} strokeWidth={Math.max(3, w * 0.006)} fill="none" strokeLinecap="round" />
      </g>)}
    </svg>}
  </div>;
};

// Whole-frame camera: zoom punches and shakes at given times.
export const Camera = ({punch = [], shake = [], children}: {punch?: number[]; shake?: number[]; children: React.ReactNode}) => {
  const t = useT();
  let s = 1, dx = 0, dy = 0;
  for (const k of punch) { const d = t - k; if (d >= 0 && d < 0.5) s += 0.07 * Math.exp(-d * 9) * Math.cos(d * 12); }
  for (const k of shake) { const d = t - k; if (d >= 0 && d < 0.4) { dx += Math.sin(d * 95) * 14 * (1 - d / 0.4); dy += Math.cos(d * 80) * 8 * (1 - d / 0.4); } }
  return <AbsoluteFill style={{transform: `translate(${dx}px,${dy}px) scale(${s})`, transformOrigin: '50% 45%'}}>{children}</AbsoluteFill>;
};

// Scene = a time window with its own white background and optional pan/zoom keyframes [time, zoom, focusX, focusY].
export const Scene = ({from, to, cam, overlay, children}: {from: number; to: number; cam?: [number, number, number, number][]; overlay?: boolean; children: React.ReactNode}) => (
  <Sequence from={f(from)} durationInFrames={f(to) - f(from)}>
    <SceneStart.Provider value={from}><Cam cam={cam ?? [[from, 1, 540, 960]]} overlay={overlay}>{children}</Cam></SceneStart.Provider>
  </Sequence>
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

// Estimated word time inside a voice line (proportional to character position).
export const wordTimer = (lines: {text: string; start: number; end: number}[]) => (line: number, word: string) => {
  const l = lines[line - 1];
  const i = l.text.indexOf(word);
  if (i < 0) throw new Error(`"${word}" not in line ${line}`);
  return +(l.start + (l.end - l.start) * (i / l.text.length)).toFixed(2);
};

// Soft colored backdrop: color shifts by act; faint $ doodles add texture without clutter.
export const Backdrop = ({keys}: {keys: [number, string][]}) => {
  const t = useT();
  let i = 0;
  keys.forEach((k, j) => { if (t >= k[0]) i = j; });
  const prev = keys[Math.max(0, i - 1)][1], cur = keys[i][1];
  const mix = i === 0 ? 1 : Math.min(1, (t - keys[i][0]) / 0.35);
  return <AbsoluteFill>
    <AbsoluteFill style={{background: prev}} />
    <AbsoluteFill style={{background: cur, opacity: mix}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)'}} />
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.07}}>
      {Array.from({length: 40}, (_, k) => <text key={k} x={(k * 263) % 1080} y={((k * 397) % 1920) + Math.sin(t * 0.6 + k) * 8} fontFamily={FONT} fontWeight={900} fontSize={54} fill={C.ink}>$</text>)}
    </svg>
  </AbsoluteFill>;
};

// Rounded stage panel behind the top illustration band.
export const Stage = ({color, from = 0}: {color: string; from?: number}) => {
  const t = useT();
  const p = pop(t, from, 14);
  return <div style={{position: 'absolute', left: 60, top: 270, width: 960, height: 620, borderRadius: 48, background: color,
    border: `6px solid ${C.ink}`, transform: `scale(${0.96 + 0.04 * p})`, boxShadow: '0 12px 0 rgba(0,0,0,0.12)'}} />;
};

// Synced captions in the middle band: short word groups (>= ~0.4s each); emphasis words get their own group and color.
export const AutoCaptions = ({lines, emphasis = {}, end}: {lines: {text: string; start: number; end: number}[]; emphasis?: Record<string, string>; end: number}) => {
  const t = useT();
  if (t >= end) return null;
  type G = {at: number; words: string[]};
  const groups: G[] = [];
  const key = (wd: string) => wd.replace(/[^A-Za-z0-9$%'-]/g, '').toLowerCase();
  for (const l of lines) {
    let idx = 0, cur: G | null = null;
    const ws = l.text.split(' ');
    ws.forEach((raw, j) => {
      const i = l.text.indexOf(raw, idx); idx = i + raw.length;
      const at = l.start + (l.end - l.start) * (i / l.text.length);
      const emph = key(raw) in emphasis;
      const nextAt = j + 1 < ws.length ? l.start + (l.end - l.start) * (l.text.indexOf(ws[j + 1], idx) / l.text.length) : l.end;
      if (!cur || emph || (at - cur.at >= 0.4) || cur.words.some((x) => key(x) in emphasis) || cur.words.length >= 3) { cur = {at, words: []}; groups.push(cur); }
      cur.words.push(raw);
      if (/[.?!:]$/.test(raw) && nextAt - at > 0) cur = null;
    });
  }
  let k = -1;
  groups.forEach((g, j) => { if (t >= g.at) k = j; });
  const line = lines.find((l) => t >= l.start - 0.05 && t <= l.end + 0.35);
  if (k < 0 || !line) return null;
  const g = groups[k];
  const text = g.words.map((x) => x.replace(/[.,!?:]+$/, '')).join(' ');
  const p = pop(t, g.at, 12);
  const size = Math.min(150, Math.floor(940 / (Math.max(4, text.length) * 0.72)));
  return <div style={{position: 'absolute', left: 540, top: Z.wordY, transform: `translate(-50%,-50%) scale(${0.75 + 0.25 * p})`,
    fontFamily: FONT, fontWeight: 900, fontSize: size, whiteSpace: 'nowrap', letterSpacing: -2, textTransform: 'uppercase', textShadow: '0 5px 0 rgba(255,255,255,0.9)'}}>
    {g.words.map((x, j) => <span key={j} style={{color: emphasis[key(x)] ?? C.ink}}>{x.replace(/[.,!?:]+$/, '')}{j < g.words.length - 1 ? ' ' : ''}</span>)}
  </div>;
};
