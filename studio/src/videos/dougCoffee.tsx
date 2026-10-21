// EP7 "Overdraft: Poor Doug vs Rich Doug" — same $6 coffee, poor pays $41 (overdraft fee), rich pays $6. Hook first (approval), full episode after.
// Line timings: studio/src/data/doug-coffee.json (free Kokoro am_michael 1.1 VO, one line per phrase).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Stamp} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-coffee.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_COFFEE_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1380;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';

// ---------- hook props (POOR vs RICH layout from the user's 13.8K video + versus rules) ----------
const Why = ({t}: {t: number}) => {
  const p = ease(t / 0.25);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 230, lineHeight: '240px', color: INK, letterSpacing: -6, transform: `scale(${0.6 + 0.4 * p})`, opacity: p}}>
    why<span style={{color: RED}}>?</span>
  </div>;
};
// Red hand-drawn arrow: draws itself on, points at POOR (left), swings to RICH (right) at `swingAt`.
const Arrow = ({x, y, t, swingAt}: {x: number; y: number; t: number; swingAt: number}) => {
  const draw = ease((t - 0.15) / 0.4), sw = t < swingAt ? 0 : cl((t - swingAt) / 0.35);
  const over = sw < 1 ? Math.sin(sw * Math.PI) * 12 : 0;
  const ang = 140 + (40 - 140) * ease(sw) - over;
  return <svg width={10} height={10} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <g transform={`rotate(${ang})`}>
      <path d="M0 0 Q 55 -22, 110 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="none" stroke={RED} strokeWidth={14} strokeLinecap="round" />
      {draw > 0.9 && <path d="M110 0 L74 -22 M110 0 L76 26" fill="none" stroke={RED} strokeWidth={14} strokeLinecap="round" />}
    </g>
  </svg>;
};
const Side = ({text, x, y, at, t, color}: {text: string; x: number; y: number; at: number; t: number; color: string}) => {
  const p = ease((t - at) / 0.25);
  return <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 150, lineHeight: '160px', color, WebkitTextStroke: `3px ${color}`, opacity: p, transform: `scale(${0.5 + 0.5 * p}) rotate(-3deg)`}}>{text}</div>;
};
const Price = ({text, x, y, at, t, color, size = 170}: {text: string; x: number; y: number; at: number; t: number; color: string; size?: number}) => {
  const p = t < at ? 0 : Math.min(1, (t - at) / 0.18), sc = p < 1 ? 0.3 + 1.0 * p : 1 + 0.12 * Math.max(0, 1 - (t - at - 0.18) / 0.2);
  return <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, lineHeight: `${size}px`, color, WebkitTextStroke: `6px ${INK}`, paintOrder: 'stroke fill', opacity: p > 0 ? 1 : 0, transform: `scale(${sc}) rotate(${color === RED ? -4 : 4}deg)`}}>{text}</div>;
};
const Vs = ({x, y, t}: {x: number; y: number; t: number}) => {
  const p = ease((t - 0.5) / 0.3);
  return <div style={{position: 'absolute', left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: '50%', background: RED, border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 66, color: '#fff', transform: `scale(${p}) rotate(${-8 + Math.sin(t * 4) * 3}deg)`}}>VS</div>;
};
// Paper coffee cup with lid, sleeve and steam. (x, y) = bottom centre.
export const Coffee = ({x, y, w = 150, t, rot = 0}: {x: number; y: number; w?: number; t: number; rot?: number}) =>
  <svg width={w} height={w * 1.6} viewBox="0 0 100 160" style={{position: 'absolute', left: x - w / 2, top: y - w * 1.6, overflow: 'visible', transform: `rotate(${rot}deg)`, transformOrigin: '50% 100%'}}>
    {[0, 1, 2].map((i) => <path key={i} d={`M${32 + i * 18} ${-6 - ((t * 30 + i * 9) % 14)} c -8 -10, 8 -16, 0 -28`} fill="none" stroke="#9AA3AB" strokeWidth={4} strokeLinecap="round" opacity={0.8} />)}
    <path d="M14 34 L86 34 L76 156 L24 156 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M18 74 L82 74 L79 112 L21 112 Z" fill="#B7845A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <rect x={6} y={18} width={88} height={18} rx={6} fill="#fff" stroke={INK} strokeWidth={5} />
    <rect x={20} y={8} width={60} height={13} rx={5} fill="#fff" stroke={INK} strokeWidth={5} />
  </svg>;
// Poor clothes: torn grey tee with holes over Doug's belly. Matches Penguin h (feet at y).
const Rags = ({x, y, h}: {x: number; y: number; h: number}) => {
  const s = h / 520;
  return <svg width={240 * s} height={220 * s} viewBox="0 0 240 220" style={{position: 'absolute', left: x - 120 * s, top: y - 0.44 * h}}>
    <path d="M30 20 Q120 0 210 20 L222 190 L196 176 L176 200 L150 180 L120 205 L94 182 L66 202 L44 180 L18 192 Z" fill="#E6E2D8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M70 70 l14 -6 l6 16 l-12 10 z M150 110 l18 4 l-6 18 l-16 -8 z" fill="#2E2E2E" stroke={INK} strokeWidth={3} />
    <path d="M110 40 l6 12 M126 140 l-8 10" stroke={INK} strokeWidth={4} strokeLinecap="round" />
  </svg>;
};

// ---------- sets ----------
const FORTY1 = P(0) + 1.15, SIX = P(1) + 1.0, SAME = P(1) + 1.75, RICH = P(1);
const Hook = ({t}: {t: number}) => <>
  <Why t={t} />
  <div style={{position: 'absolute', left: 536, top: 380, width: 8, height: 1150, background: INK, borderRadius: 4}} />
  <Side text="POOR" x={270} y={380} at={0.15} t={t} color={RED} />
  <Side text="RICH" x={810} y={380} at={0.35} t={t} color={GREEN} />
  <Arrow x={540} y={320} t={t} swingAt={RICH} />
  <Vs x={540} y={820} t={t} />
  {/* poor Doug: rags, tears, big red $41 */}
  <Penguin id="doug" x={270} y={G} h={560} pose={{look: [0.2, 0.3], brows: 'worried', beak: 'frown', tears: t > FORTY1, lids: 0.3, flapR: 70}} />
  <Rags x={270} y={G} h={560} />
  <Coffee x={410} y={G - 150} w={120} t={t} rot={6} />
  <Price text="$41" x={270} y={560} at={FORTY1} t={t} color={RED} />
  {t > FORTY1 + 0.4 && <div style={{position: 'absolute', left: 40, top: 740, width: 460, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 46, color: RED, transform: 'rotate(-4deg)'}}>$6 + $35 FEE</div>}
  {/* rich Doug: suit, happy, big green $6 */}
  <Penguin id="doug" x={810} y={G} h={560} outfit="rich" pose={{look: [-0.2, 0.2], brows: 'happy', beak: 'smile', lids: 0.3, blush: 1, flapL: 70}} />
  <Coffee x={670} y={G - 150} w={120} t={t} rot={-6} />
  <Price text="$6" x={810} y={560} at={SIX} t={t} color={GREEN} />
  {t >= SAME && <Stamp text="SAME COFFEE" x={540} y={1240} at={SAME} color={RED} size={100} rot={-8} />}
  <div style={{position: 'absolute', left: 120, top: 820 + Math.sin(t * 6) * 8, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 110, color: INK, transform: 'rotate(-14deg)', opacity: t > FORTY1 ? 1 : 0}}>?</div>
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [];

export const DougCoffee = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: strong zoom toward POOR on "$41", swing to RICH, zoom out to both on "same coffee"
    const toP = ease((tc - FORTY1 + 0.2) / 0.35) * (tc < RICH ? 1 : 0), toR = ease((tc - RICH) / 0.35) * (tc < SAME ? 1 : 0), out = ease((tc - SAME) / 0.3);
    const z = Math.max(toP, toR) * (1 - out);
    s0 = 1 + 0.22 * z; fx = 540 + (toR > 0 ? 270 * toR : -270 * toP) * (1 - out); fy = 960 + 20 * z;
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (tc < 1.0 ? 1 : beat(tc, TIM));
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-coffee-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.2} name="swoosh-fast" vol={0.3} />
    <Sfx at={FORTY1} name="user-cash-register" vol={0.4} />
    <Sfx at={FORTY1 + 0.4} name="user-boom" vol={0.4} />
    <Sfx at={RICH} name="user-whoosh" vol={0.3} />
    <Sfx at={SIX} name="user-money" vol={0.35} />
    <Sfx at={SAME} name="user-slap" vol={0.35} />
  </AbsoluteFill>;
};
