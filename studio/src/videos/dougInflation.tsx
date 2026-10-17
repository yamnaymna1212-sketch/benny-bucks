// EP3 "Inflation Explained by Doug" — hook first (approval), full episode after. Line timings: studio/src/data/doug-inflation.json.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts} from '../engine';
import {HandFont} from '../sketch';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {BigWord, HookTitle} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-inflation.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_INFLATION_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1250, RED = '#D83A2E', GREEN = '#2E9E4F';
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);

// ---------- groceries (series style: flat fill + thick ink) ----------
const Bread = ({x, y}: {x: number; y: number}) => <g transform={`translate(${x} ${y})`}>
  <path d="M-60 30 L-60 -10 Q-60 -45 -25 -45 Q0 -60 25 -45 Q60 -45 60 -10 L60 30 Z" fill="#E3A857" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  {[-30, 0, 30].map((d) => <path key={d} d={`M${d - 10} -30 L${d + 10} -10`} stroke={INK} strokeWidth={4} strokeLinecap="round" />)}
</g>;
const Milk = ({x, y}: {x: number; y: number}) => <g transform={`translate(${x} ${y})`}>
  <path d="M-38 60 L-38 -40 L-18 -70 L18 -70 L38 -40 L38 60 Z" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  <rect x={-14} y={-92} width={28} height={22} rx={4} fill="#2F5DA8" stroke={INK} strokeWidth={5} />
  <rect x={-38} y={-10} width={76} height={36} fill="#2F5DA8" stroke={INK} strokeWidth={5} />
  <text x={0} y={17} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={24} fill="#fff">MILK</text>
</g>;
const Eggs = ({x, y}: {x: number; y: number}) => <g transform={`translate(${x} ${y})`}>
  {[-36, -12, 12, 36].map((d) => <ellipse key={d} cx={d} cy={-22} rx={13} ry={17} fill="#FFF8EA" stroke={INK} strokeWidth={4} />)}
  <path d="M-58 -16 L58 -16 L50 30 L-50 30 Z" fill="#C9B79C" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  <text x={0} y={18} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={22} fill={INK}>EGGS</text>
</g>;
// cart 400x360 box; items at bread(115,100) milk(215,80) eggs(307,95) in cart coords
const Cart = ({x, y}: {x: number; y: number}) =>
  <svg width={400} height={360} viewBox="0 0 400 360" style={{position: 'absolute', left: x - 200, top: y - 360, overflow: 'visible'}}>
    <Bread x={115} y={100} /><Milk x={215} y={70} /><Eggs x={307} y={100} />
    <path d="M30 120 L370 120 L330 280 L80 280 Z" fill="#DDE6EC" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {[1, 2, 3, 4, 5].map((i) => <line key={i} x1={30 + i * 57} y1={120} x2={80 + i * 42} y2={280} stroke={INK} strokeWidth={3} />)}
    <line x1={45} y1={180} x2={355} y2={180} stroke={INK} strokeWidth={3} /><line x1={60} y1={232} x2={343} y2={232} stroke={INK} strokeWidth={3} />
    <path d="M370 120 L392 60 L420 60" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
    <path d="M80 280 L68 306 L322 306" fill="none" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={110} cy={326} r={18} fill="#1B1B1B" /><circle cx={292} cy={326} r={18} fill="#1B1B1B" />
  </svg>;
const ITEM = {bread: [115, 100], milk: [215, 70], eggs: [307, 100]} as const;
const at = (cx: number, item: keyof typeof ITEM): [number, number] => [cx - 200 + ITEM[item][0], G - 360 + ITEM[item][1]];

const Price = ({text, x, y, at: a, color, t}: {text: string; x: number; y: number; at: number; color: string; t: number}) => {
  if (t < a) return null;
  const d = t - a, s = d < 0.14 ? 0.3 + 0.9 * (d / 0.14) : d < 0.24 ? 1.2 - 0.2 * ((d - 0.14) / 0.1) : 1;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(-4deg) scale(${s})`, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 140, color,
    WebkitTextStroke: '8px #fff', paintOrder: 'stroke fill', filter: `drop-shadow(0 6px 0 ${INK})`}}>{text}</div>;
};
// big centre words; the caption hides for exactly these windows (one text on screen at a time)
const BIGS: {text: string; at: number; until: number; color?: string; size: number}[] = [
  {text: 'did nothing', at: P(7) + 0.2, until: P(8), size: 80},
  {text: 'poorer.', at: P(8) + 0.1, until: E(8) + 0.8, color: RED, size: 110},
];
// "same eggs / milk / bread": the object itself pops in big, one at a time, synced to the word
const SAMES: [number, (p: {x: number; y: number}) => JSX.Element][] = [[4, Eggs], [5, Milk], [6, Bread]];
const SameObject = ({tc}: {tc: number}) => {
  const k = SAMES.findIndex(([i], n) => tc >= P(i) && tc < (n < 2 ? P(SAMES[n + 1][0]) : P(7)));
  if (k < 0) return null;
  const [i, Obj] = SAMES[k], d = tc - P(i), s = d < 0.1 ? 0.3 + 4.7 * (d / 0.1) : d < 0.18 ? 5 - 0.6 * ((d - 0.1) / 0.08) : 4.4;
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <g transform={`translate(540 980) scale(${s}) rotate(${Math.sin(tc * 6) * 3})`}><Obj x={0} y={0} /></g>
  </svg>;
};

const Hook = ({t}: {t: number}) => {
  const right = t >= P(2), done = t >= P(7), poor = t >= P(8);
  return <>
    {/* oversized so no white edge shows at any zoom/pan */}
    <div style={{position: 'absolute', left: -2000, top: -2000, width: 2540, height: 6000, background: '#EAF7EC'}} />
    <div style={{position: 'absolute', left: 540, top: -2000, width: 2540, height: 6000, background: '#FCEAE8'}} />
    <div style={{position: 'absolute', left: 535, top: 600, width: 10, height: 3000, background: INK}} />
    <HookTitle lines={['Inflation Explained', 'by Doug']} at={-1} y={300} />
    <div style={{position: 'absolute', left: 270, top: 560, transform: 'translate(-50%,-50%)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 90, color: INK}}>2020</div>
    <div style={{position: 'absolute', left: 810, top: 560, transform: 'translate(-50%,-50%)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 90, color: INK}}>TODAY</div>
    <Cart x={270} y={G} /><Cart x={810} y={G} />
    <Price text="$100" x={270} y={740} at={P(1) + 0.55} color={GREEN} t={t} />
    <Price text="$120+" x={810} y={740} at={P(3) + 0.35} color={RED} t={t} />
    <Penguin id="doug" x={540} y={G + 190} h={poor ? 420 : 360} pose={done
      ? {brows: poor ? 'shock' : 'worried', eyeScale: poor ? 1.35 : 1, pupil: poor ? 0.4 : 1, tremble: poor ? 1 : 0, tears: poor, flapL: poor ? 20 : 95, flapR: poor ? 20 : 95, beak: 'frown', look: [0, 0.2]}
      : {turn: right ? 0.6 : -0.6, look: [right ? 0.8 : -0.8, -0.4], brows: right ? 'shock' : 'worried', eyeScale: right ? 1.2 : 1, pupil: right ? 0.5 : 1, sweat: right}} />
    {BIGS.map((b) => <BigWord key={b.text} text={b.text} x={540} y={960} at={b.at} until={b.until} color={b.color} size={b.size} />)}
  </>;
};

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
];
// deep zooms [segment, focusX, focusY, scale]: Doug's face
const DEEP: [number, number, number, number][] = [
  [8, 540, G - 120, 1.8],
];

export const DougInflation = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side named (2020 left, today right)
    const toL = ease((tc - 0.1) / 0.5) * (tc < P(2) ? 1 : 0), toR = ease((tc - P(2)) / 0.4) * (tc < P(4) ? 1 : 0);
    s0 = 1 + 0.14 * (toL + toR); fx = 540 - 230 * toL + 230 * toR; fy = 960 + 20 * (toL + toR);
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.1), dp = dz ? ease((tc - P(dz[0])) / 0.18) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, TIM);
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    {sh.at === 0 && <SameObject tc={tc} />}
    {!BIGS.some((b) => tc >= b.at && tc < b.until) && <Captions t={tc} phrases={TIM} />}
    <Audio src={staticFile('doug-inflation-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.1} name="user-whoosh" vol={0.25} />
    <Sfx at={P(1) + 0.55} name="user-cash-register" vol={0.4} />
    <Sfx at={P(2)} name="user-whoosh" vol={0.3} />
    <Sfx at={P(3) + 0.35} name="user-boom" vol={0.5} />
    <Sfx at={P(3) + 0.4} name="user-cash-register" vol={0.3} />
    {SAMES.map(([i]) => <Sfx key={i} at={P(i)} name="user-pop" vol={0.45} />)}
    <Sfx at={P(7)} name="user-wrong" vol={0.35} />
    <Sfx at={P(8)} name="user-fahh" vol={0.5} />
  </AbsoluteFill>;
};
