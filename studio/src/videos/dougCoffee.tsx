// EP7 "Overdraft: Poor Doug vs Rich Doug" — same $6 coffee, poor pays $41 (overdraft fee), rich pays $6. Hook first (approval), full episode after.
// Line timings: studio/src/data/doug-coffee.json (free Kokoro am_michael 1.1 VO, one line per phrase).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-coffee.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_COFFEE_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1420;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';

// ---------- hook props (POOR vs RICH layout from the user's 13.8K video + versus rules) ----------
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
const Box = ({text, x, y, t, at, color}: {text: string; x: number; y: number; t: number; at: number; color: string}) => {
  const p = ease((t - at) / 0.2);
  return <div style={{position: 'absolute', left: x - 190, top: y, width: 380, height: 160, background: '#1F2329', border: `6px solid ${INK}`, borderRadius: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 130, color, transform: `scale(${0.4 + 0.6 * p})`, opacity: p}}>{text}</div>;
};
const Word = ({text, x, y, t, at, color}: {text: string; x: number; y: number; t: number; at: number; color: string}) => {
  const p = ease((t - at) / 0.2);
  return <div style={{position: 'absolute', left: x - 250, width: 500, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 130, lineHeight: '130px', color, opacity: p, transform: `scale(${0.5 + 0.5 * p})`}}>{text}</div>;
};
// Shop counter with a card reader; (x, y) = bottom-left.
const Counter = ({x, y, w = 230}: {x: number; y: number; w?: number}) => <>
  <div style={{position: 'absolute', left: x, top: y - 300, width: w, height: 300, background: '#D9A066', border: `6px solid ${INK}`, borderRadius: 8, boxSizing: 'border-box', backgroundImage: `repeating-linear-gradient(90deg, transparent 0 52px, ${INK} 52px 56px)`}} />
  <div style={{position: 'absolute', left: x - 12, top: y - 330, width: w + 24, height: 36, background: '#E8B57E', border: `6px solid ${INK}`, borderRadius: 8, boxSizing: 'border-box'}} />
  <div style={{position: 'absolute', left: x + w / 2 - 45, top: y - 470, width: 90, height: 140, background: '#3A3F46', border: `6px solid ${INK}`, borderRadius: 12, boxSizing: 'border-box'}}>
    <div style={{margin: '10px auto 0', width: 56, height: 36, background: '#8EE08A', border: `3px solid ${INK}`, borderRadius: 4}} />
  </div>
</>;
const Card = ({x, y, rot}: {x: number; y: number; rot: number}) =>
  <div style={{position: 'absolute', left: x - 70, top: y - 45, width: 140, height: 90, background: '#2F6FD6', border: `6px solid ${INK}`, borderRadius: 12, boxSizing: 'border-box', transform: `rotate(${rot}deg)`}}>
    <div style={{position: 'absolute', left: 16, top: 26, width: 30, height: 22, background: '#F5C542', border: `3px solid ${INK}`, borderRadius: 4}} />
  </div>;
const FORTY1 = P(0) + 1.15, RICH = P(1), SAME = P(1) + 1.75;
// Clean versus hook (user ref: "Cash vs Card" 16.1K): coffee + price box on top, POOR vs RICH, dotted line, Doug paying at a counter. No extra text.
const Hook = ({t}: {t: number}) => <>
  <Coffee x={270} y={420} w={150} t={t} />
  <Coffee x={810} y={420} w={150} t={t} />
  <Box text="$41" x={270} y={450} t={t} at={0.05} color={RED} />
  <Box text="$6" x={810} y={450} t={t} at={0.15} color={GREEN} />
  <Word text="POOR" x={250} y={660} t={t} at={0.25} color={RED} />
  <Word text="RICH" x={830} y={660} t={t} at={0.35} color={GREEN} />
  <div style={{position: 'absolute', left: 536, top: 820, width: 8, height: 620, backgroundImage: `repeating-linear-gradient(180deg, ${INK} 0 26px, transparent 26px 44px)`}} />
  <Vs x={540} y={725} t={t} />
  <Counter x={290} y={G} />
  <Penguin id="doug" x={170} y={G} h={480} pose={{look: [0.6, -0.1], brows: 'worried', beak: 'frown', tears: t > FORTY1, lids: 0.3, flapR: 80}} />
  <Rags x={170} y={G} h={480} />
  <Card x={330} y={G - 400} rot={-12} />
  <Counter x={830} y={G} />
  <Penguin id="doug" x={710} y={G} h={480} outfit="rich" pose={{look: [0.6, -0.1], brows: 'happy', beak: 'smile', lids: 0.3, blush: 1, flapR: 80}} />
  <Card x={870} y={G - 400} rot={-12} />
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
    <Sfx at={P(1) + 1.0} name="user-money" vol={0.35} />
  </AbsoluteFill>;
};
