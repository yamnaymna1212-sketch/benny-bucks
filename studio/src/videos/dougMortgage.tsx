// EP7 "Mortgage Explained by Doug" — the bank pays $400,000 for the house, Doug pays $997,000 (30 yr at 7.4%). Hook first (approval), full episode after.
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
const G = 1200;
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
// Red hand-drawn arrow: draws itself on, points at DOUG PAYS (left), swings to HOUSE PRICE (right) on "four hundred thousand".
const Arrow = ({x, y, t, swingAt}: {x: number; y: number; t: number; swingAt: number}) => {
  const draw = ease((t - 0.15) / 0.4), sw = t < swingAt ? 0 : cl((t - swingAt) / 0.35);
  const over = sw < 1 ? Math.sin(sw * Math.PI) * 12 : 0;
  const ang = 148 + (32 - 148) * ease(sw) - over;
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
  return <div style={{position: 'absolute', left: x - 75, top: y - 75, width: 150, height: 150, borderRadius: '50%', background: RED, border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 72, color: '#fff', transform: `scale(${p}) rotate(${-8 + Math.sin(t * 4) * 3}deg)`}}>VS</div>;
};
// American suburban house (hand-drawn): wall, gable roof, chimney, door, two windows. (x, y) = bottom centre.
export const House = ({x, y, w = 400}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={w * 0.95} viewBox="0 0 400 380" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.95, overflow: 'visible'}}>
    <rect x={285} y={40} width={44} height={90} fill="#B04A35" stroke={INK} strokeWidth={7} />
    <rect x={50} y={170} width={300} height={207} fill="#F4DDB0" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M18 182 L200 30 L382 182 Z" fill="#C0533A" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <rect x={168} y={262} width={64} height={115} rx={6} fill="#5B3A22" stroke={INK} strokeWidth={6} />
    <circle cx={219} cy={322} r={5} fill="#F2C94C" />
    {[78, 262].map((wx) => <g key={wx}>
      <rect x={wx} y={220} width={62} height={62} fill="#BFE6FA" stroke={INK} strokeWidth={6} />
      <path d={`M${wx + 31} 220 V282 M${wx} 251 H${wx + 62}`} stroke={INK} strokeWidth={4} />
    </g>)}
  </svg>;
const Ground = () => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />;

// ---------- sets ----------
const LX = 270, RX = 810;
const Hook = ({t}: {t: number}) => {
  // Doug's pile of payments grows while "one million dollars" is spoken
  const bills = Math.round(2 + 12 * ease((t - 0.7) / 1.3));
  return <>
    <Why t={t} />
    <Ground />
    {/* left: what Doug pays (RED) */}
    <Label text="DOUG PAYS" x={LX} y={500} at={0.2} t={t} size={70} />
    <Label text="$997,000" x={LX} y={590} at={MILLION - 0.1} t={t} size={96} color={RED} />
    <House x={LX} y={G} w={380} />
    {Array.from({length: bills}, (_, i) => <Bill key={i} x={LX - 120 + (i % 4) * 80} y={G - 25 - Math.floor(i / 4) * 40} w={150} rot={((i * 37) % 30) - 15} />)}
    {/* right: house price (GREEN) */}
    <Label text="HOUSE PRICE" x={RX} y={500} at={0.5} t={t} size={70} />
    <Label text="$400,000" x={RX} y={590} at={FOUR - 0.05} t={t} size={96} color={GREEN} />
    <House x={RX} y={G} w={380} />
    <Bill x={RX} y={G - 25} w={150} rot={-6} />
    <Vs x={540} y={980} t={t} />
    <Arrow x={540} y={800} t={t} swingAt={FOUR} />
    <Stamp text="SAME HOUSE" x={540} y={860} at={SAME} color={RED} size={100} rot={-8} />
    {/* Doug in front, small, one "?" */}
    <Penguin id="doug" x={540} y={G + 270} h={290} pose={{look: [t < FOUR ? -0.7 : 0.7, -0.4], brows: 'shock', eyeScale: 1.2, beak: 'frown'}} />
    <div style={{position: 'absolute', left: 660, top: G - 10 + Math.sin(t * 6) * 8, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 110, color: INK, transform: 'rotate(14deg)'}}>?</div>
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
    s = 1 + 0.22 * z; fx = 540 - 230 * toL + 230 * toR; fy = 960 - 60 * z;
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
