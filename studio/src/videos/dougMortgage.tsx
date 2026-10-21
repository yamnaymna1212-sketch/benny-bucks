// EP7 "Mortgage Explained by Doug" — one American house: price $400,000, Doug pays ~$1,000,000 ($997K, 30 yr at 7.4%). Hook first (approval), full episode after.
// Line timings: studio/src/data/doug-mortgage.json (edge-tts en-US-AndrewNeural, one take, word boundaries -> phrases).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Stamp} from '../penguin/world';
import {Captions, Sfx} from '../penguin/edit';
import {Bill} from './dougLaundering';
import TIM from '../data/doug-mortgage.json';

const P = (i: number) => TIM[i].start;
export const DOUG_MORTGAGE_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1290;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';
// word times in the hook (vo/raw.words.json)
const MILLION = 1.09, FOUR = 2.0, SAME = P(1);

// ---------- hook props (versus layout from dougVenezuela) ----------
const Why = ({t}: {t: number}) => {
  const p = ease(t / 0.25);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 170, height: 330, transform: `scale(${0.6 + 0.4 * p})`, opacity: p, transformOrigin: '50% 60%'}}>
    <div style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 290, lineHeight: '300px', color: INK, letterSpacing: -6}}>
      why<span style={{color: RED}}>?</span>
    </div>
  </div>;
};
// Red hand-drawn arrow under the price boards: draws itself on, points up at DOUG PAYS (left), swings to HOUSE PRICE (right) on "four hundred thousand".
const Arrow = ({x, y, t, swingAt}: {x: number; y: number; t: number; swingAt: number}) => {
  const draw = ease((t - 0.15) / 0.4), sw = t < swingAt ? 0 : cl((t - swingAt) / 0.35);
  const over = sw < 1 ? Math.sin(sw * Math.PI) * 12 : 0;
  const ang = -150 + (-30 + 150) * ease(sw) + over;
  return <svg width={10} height={10} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <g transform={`rotate(${ang})`}>
      <path d="M0 0 Q 85 -34, 170 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />
      {draw > 0.9 && <path d="M170 0 L128 -26 M170 0 L130 30" fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />}
    </g>
  </svg>;
};
const Label = ({text, x, y, at, t, size = 80, color = INK}: {text: string; x: number; y: number; at: number; t: number; size?: number; color?: string}) => {
  const p = ease((t - at) / 0.25);
  return <div style={{position: 'absolute', left: x - 270, width: 540, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, color, opacity: p, transform: `scale(${0.5 + 0.5 * p})`, whiteSpace: 'nowrap'}}>{text}</div>;
};
const Vs = ({x, y, t}: {x: number; y: number; t: number}) => {
  const p = ease((t - 0.5) / 0.3);
  return <div style={{position: 'absolute', left: x - 62, top: y - 62, width: 124, height: 124, borderRadius: '50%', background: RED, border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60, color: '#fff', transform: `scale(${p}) rotate(${-8 + Math.sin(t * 4) * 3}deg)`}}>VS</div>;
};
// US flag (13 stripes + blue canton with stars). (x, y) = top-left, waves a little.
export const FlagUS = ({x, y, w = 180, t = 0}: {x: number; y: number; w?: number; t?: number}) =>
  <svg width={w} height={w * 0.53} viewBox="0 0 190 100" style={{position: 'absolute', left: x, top: y, overflow: 'visible', transform: `skewY(${Math.sin(t * 5) * 3}deg)`, transformOrigin: '0 50%'}}>
    {Array.from({length: 13}, (_, i) => <rect key={i} x={0} y={i * 100 / 13} width={190} height={100 / 13 + 0.5} fill={i % 2 ? '#fff' : '#C8102E'} />)}
    <rect x={0} y={0} width={76} height={54} fill="#0A3161" />
    {Array.from({length: 20}, (_, i) => <circle key={i} cx={9 + (i % 5) * 14.5 + (Math.floor(i / 5) % 2) * 7} cy={8 + Math.floor(i / 5) * 12.5} r={2.6} fill="#fff" />)}
    <rect x={0} y={0} width={190} height={100} fill="none" stroke={INK} strokeWidth={5} />
  </svg>;
// Two-storey American house: white siding, grey roof, shutters, porch, garage, flag pole. (x, y) = bottom centre.
export const House = ({x, y, w = 700, t = 0}: {x: number; y: number; w?: number; t?: number}) => {
  const k = w / 600;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - 430 * k, width: w, height: 430 * k}}>
    <svg width={w} height={430 * k} viewBox="0 0 600 430" style={{position: 'absolute', overflow: 'visible'}}>
      <rect x={320} y={40} width={34} height={80} fill="#A5452F" stroke={INK} strokeWidth={6} />
      {/* main block */}
      <rect x={50} y={125} width={340} height={305} fill="#F7F5EE" stroke={INK} strokeWidth={7} />
      {Array.from({length: 14}, (_, i) => <line key={i} x1={54} x2={386} y1={145 + i * 20} y2={145 + i * 20} stroke="#D9D5C8" strokeWidth={3} />)}
      <path d="M28 135 L220 22 L412 135 Z" fill="#4A4F57" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      {/* garage */}
      <rect x={390} y={255} width={185} height={175} fill="#F7F5EE" stroke={INK} strokeWidth={7} />
      <path d="M380 262 L482 200 L585 262 Z" fill="#4A4F57" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <rect x={412} y={300} width={140} height={130} fill="#E9E6DC" stroke={INK} strokeWidth={6} />
      {[0, 1, 2].map((i) => <line key={i} x1={412} x2={552} y1={332 + i * 32} y2={332 + i * 32} stroke={INK} strokeWidth={4} />)}
      {/* upstairs windows with shutters */}
      {[80, 190, 300].map((wx) => <g key={wx}>
        <rect x={wx - 14} y={158} width={12} height={66} fill="#2F4F3A" stroke={INK} strokeWidth={4} />
        <rect x={wx + 52} y={158} width={12} height={66} fill="#2F4F3A" stroke={INK} strokeWidth={4} />
        <rect x={wx} y={158} width={50} height={66} fill="#BFE6FA" stroke={INK} strokeWidth={5} />
        <path d={`M${wx + 25} 158 V224 M${wx} 191 H${wx + 50}`} stroke={INK} strokeWidth={3} />
      </g>)}
      {/* downstairs windows */}
      {[80, 300].map((wx) => <g key={wx}>
        <rect x={wx - 14} y={318} width={12} height={66} fill="#2F4F3A" stroke={INK} strokeWidth={4} />
        <rect x={wx + 52} y={318} width={12} height={66} fill="#2F4F3A" stroke={INK} strokeWidth={4} />
        <rect x={wx} y={318} width={50} height={66} fill="#BFE6FA" stroke={INK} strokeWidth={5} />
        <path d={`M${wx + 25} 318 V384 M${wx} 351 H${wx + 50}`} stroke={INK} strokeWidth={3} />
      </g>)}
      {/* porch + red front door */}
      <rect x={160} y={300} width={120} height={14} fill="#fff" stroke={INK} strokeWidth={5} />
      <path d="M150 305 L220 268 L290 305 Z" fill="#4A4F57" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {[168, 264].map((cx) => <rect key={cx} x={cx} y={314} width={10} height={116} fill="#fff" stroke={INK} strokeWidth={4} />)}
      <rect x={196} y={326} width={50} height={104} rx={4} fill="#9B2B2B" stroke={INK} strokeWidth={5} />
      <circle cx={236} cy={380} r={4} fill="#F2C94C" />
      {/* flag pole */}
      <rect x={-2} y={110} width={8} height={320} fill="#9AA3AB" stroke={INK} strokeWidth={3} />
      <circle cx={2} cy={106} r={8} fill="#F2C94C" stroke={INK} strokeWidth={3} />
    </svg>
    <FlagUS x={6 * k} y={118 * k} w={130 * k} t={t} />
  </div>;
};
const Ground = () => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 800, background: '#8CCB5E', borderTop: `5px solid ${INK}`}} />;
// Price board: label + big price, coloured frame.
const Tag = ({x, y, label, price, color, at, t}: {x: number; y: number; label: string; price: string; color: string; at: number; t: number}) => {
  const p = ease((t - at) / 0.25);
  return <div style={{position: 'absolute', left: x - 225, top: y, width: 450, height: 210, background: '#fff', border: `9px solid ${color}`, borderRadius: 26, boxSizing: 'border-box', opacity: p, transform: `scale(${0.5 + 0.5 * p}) rotate(${x < 540 ? -3 : 3}deg)`, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900}}>
    <div style={{fontSize: 48, color: INK, marginTop: 16}}>{label}</div>
    <div style={{fontSize: 74, color, lineHeight: '110px', letterSpacing: -3}}>{price}</div>
  </div>;
};

// ---------- sets ----------
const LX = 255, RX = 825;
const Hook = ({t}: {t: number}) => {
  // Doug's pile of payments grows while "one million dollars" is spoken
  const bills = Math.round(2 + 14 * ease((t - 0.7) / 1.3));
  return <>
    <Why t={t} />
    <Ground />
    <House x={540} y={G} w={720} t={t} />
    <Tag x={LX} y={470} label="DOUG PAYS" price="$1,000,000" color={RED} at={MILLION - 0.15} t={t} />
    <Tag x={RX} y={470} label="HOUSE PRICE" price="$400,000" color={GREEN} at={FOUR - 0.1} t={t} />
    <Vs x={540} y={575} t={t} />
    <Arrow x={540} y={760} t={t} swingAt={FOUR} />
    {/* Doug's payments pile up on the lawn */}
    {Array.from({length: bills}, (_, i) => <Bill key={i} x={110 + (i % 4) * 75} y={G + 90 - Math.floor(i / 4) * 38} w={140} rot={((i * 37) % 30) - 15} />)}
    <Stamp text="SAME HOUSE" x={540} y={1010} at={SAME} color={RED} size={100} rot={-8} />
    {/* Doug on the lawn, one "?" */}
    <Penguin id="doug" x={830} y={G + 210} h={300} pose={{look: [t < FOUR ? -0.8 : 0.2, -0.6], brows: 'shock', eyeScale: 1.2, beak: 'frown'}} />
    <div style={{position: 'absolute', left: 950, top: G - 60 + Math.sin(t * 6) * 8, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 110, color: INK, transform: 'rotate(14deg)'}}>?</div>
  </>;
};

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
];

export const DougMortgage = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s = 1, fx = 540, fy = 960;
  if (sh.at === 0) { // hook: strong zoom to the side being spoken (left on "million", right on "four hundred thousand"), out to both on "Same house"
    const toL = ease((tc - 0.8) / 0.35) * (tc < FOUR ? 1 : 0), toR = ease((tc - FOUR) / 0.35) * (tc < SAME ? 1 : 0), z = Math.max(toL, toR);
    s = 1 + 0.22 * z; fx = 540 - 240 * toL + 240 * toR; fy = 960 - 150 * z;
  }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-mortgage-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.2} name="swoosh-fast" vol={0.3} />
    <Sfx at={0.8} name="user-whoosh" vol={0.25} />
    <Sfx at={MILLION} name="user-cash-register" vol={0.35} />
    <Sfx at={FOUR} name="user-whoosh" vol={0.25} />
    <Sfx at={FOUR + 0.6} name="user-ting" vol={0.35} />
    <Sfx at={SAME} name="user-boom" vol={0.45} />
  </AbsoluteFill>;
};
