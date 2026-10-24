// EP11 "Same house: $1,000,000 in America vs $35,000 in France" — hook in the clean EP10 style (white, "Why?",
// side labels with underline, thin divider, everything visible from frame 0). Same house drawn twice: US = painted
// siding + picket fence, France = old village stone + shutters (honest: the cheap one is an old village house).
// Spoken hook = on-screen words: "Why? Same house! America: one million dollars! France: thirty-five thousand dollars!"
// Line timings: studio/src/data/doug-home.json.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HAND, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Fx, cutFX} from '../penguin/acting';
import {Sfx} from '../penguin/edit';
import {UsFlag} from './dougLibya';
import TIM from '../data/doug-home.json';

const P = (i: number) => TIM[i].start;
export const DOUG_HOME_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';
const US_AT = P(1), FR_AT = P(2), BOTH_AT = P(3);

export const FrFlag = ({w = 170}: {w?: number}) => <svg width={w} height={w * 0.63} viewBox="0 0 190 120">
  <rect width={64} height={120} fill="#0055A4" /><rect x={63} width={64} height={120} fill="#fff" /><rect x={126} width={64} height={120} fill="#EF4135" />
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={6} />
</svg>;

// Same 3-bedroom house, two finishes. Geometry identical on purpose ("same house").
export const House = ({x, y, w = 440, kind}: {x: number; y: number; w?: number; kind: 'us' | 'fr'}) => {
  const us = kind === 'us';
  const wall = us ? '#BFE0F2' : '#E6D3AE', roof = us ? '#5B6270' : '#C8613A', trim = us ? '#fff' : '#3F7F7A';
  return <svg width={w} height={w * 0.95} viewBox="0 0 440 420" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.95, overflow: 'visible'}}>
    <rect x={300} y={40} width={44} height={90} fill={us ? '#8A4B3A' : '#B9A586'} stroke={INK} strokeWidth={6} />
    <rect x={50} y={150} width={340} height={250} fill={wall} stroke={INK} strokeWidth={7} />
    {us ? [0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M54 ${180 + i * 28} L386 ${180 + i * 28}`} stroke="#8FB9D1" strokeWidth={3} />)
      : [[70, 175, 50, 26], [300, 200, 60, 28], [90, 330, 56, 26], [330, 350, 44, 24], [200, 365, 50, 24], [240, 175, 46, 24]].map(([a, b, c, d], i) =>
        <rect key={i} x={a} y={b} width={c} height={d} rx={6} fill="none" stroke="#A88E62" strokeWidth={3} />)}
    {!us && <path d="M150 260 L162 280 L154 296" fill="none" stroke="#7A6440" strokeWidth={3} />}
    <path d="M24 158 L220 30 L416 158 Z" fill={roof} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {[[90, 190], [290, 190], [90, 290], [290, 290]].map(([a, b], i) => <g key={i}>
      {!us && <><rect x={a - 30} y={b - 4} width={22} height={68} fill={trim} stroke={INK} strokeWidth={4} /><rect x={a + 68} y={b - 4} width={22} height={68} fill={trim} stroke={INK} strokeWidth={4} /></>}
      <rect x={a - 4} y={b - 4} width={68} height={68} fill={us ? trim : '#F3E9D2'} stroke={INK} strokeWidth={5} />
      <rect x={a + 4} y={b + 4} width={52} height={52} fill="#9FD3F0" stroke={INK} strokeWidth={4} />
      <path d={`M${a + 30} ${b + 4} L${a + 30} ${b + 56} M${a + 4} ${b + 30} L${a + 56} ${b + 30}`} stroke={INK} strokeWidth={4} /></g>)}
    <rect x={190} y={290} width={60} height={110} rx={us ? 4 : 30} fill={us ? '#C23B2E' : '#7A5634'} stroke={INK} strokeWidth={6} />
    <circle cx={238} cy={348} r={5} fill={INK} />
    {us ? <g>{Array.from({length: 13}, (_, i) => <path key={i} d={`M${-10 + i * 36} 420 L${-10 + i * 36} 378 L${0 + i * 36} 366 L${10 + i * 36} 378 L${10 + i * 36} 420 Z`} fill="#fff" stroke={INK} strokeWidth={4} />)}
      <path d="M-14 396 L456 396" stroke={INK} strokeWidth={4} /></g>
      : <g>{[[40, 300], [26, 340], [58, 360], [380, 260], [400, 300], [372, 330]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={20} fill="#5FA052" stroke={INK} strokeWidth={4} />)}</g>}
  </svg>;
};

const Why = () => <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: HAND, fontWeight: 700, fontSize: 200, lineHeight: '210px', color: INK, WebkitTextStroke: `6px ${INK}`}}>
  Why<span style={{color: RED, WebkitTextStroke: `6px ${RED}`}}>?</span></div>;

const punch = (t: number, at: number, d = 0.3, a = 0.18) => t >= at && t < at + d ? 1 + a * Math.sin(((t - at) / d) * Math.PI) : 1;

const SideLabel = ({text, x, y, color, t, at}: {text: string; x: number; y: number; color: string; t: number; at: number}) =>
  <div style={{position: 'absolute', left: x - 270, width: 540, top: y, textAlign: 'center', transform: `scale(${punch(t, at)}) rotate(-3deg)`}}>
    <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 112, lineHeight: '120px', color, WebkitTextStroke: `6px ${color}`, letterSpacing: 2}}>{text}</div>
    <svg width={400} height={40} viewBox="0 0 400 40"><path d="M20 30 Q 150 12, 380 10" fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" /></svg>
  </div>;

const Price = ({text, x, y, color, t, at, size = 118}: {text: string; x: number; y: number; color: string; t: number; at: number; size?: number}) =>
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(-4deg) scale(${punch(t, at, 0.3, 0.28)})`, fontFamily: HAND, fontWeight: 700, fontSize: size, lineHeight: 1,
    color, WebkitTextStroke: `${size * 0.03}px ${color}`, letterSpacing: 3, whiteSpace: 'nowrap'}}>{text}</div>;

const SameHouse = ({t}: {t: number}) => {
  const p = ease((t - 0.35) / 0.2);
  return <div style={{position: 'absolute', left: 540, top: 380, transform: `translate(-50%,-50%) rotate(-5deg) scale(${(2 - p) * (t < 0.35 ? 0 : 1)})`, opacity: p,
    border: `8px solid ${INK}`, borderRadius: 18, padding: '4px 26px', background: '#FFE45C', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: INK, whiteSpace: 'nowrap'}}>SAME HOUSE</div>;
};

const HG = 1290;
const Hook = ({t}: {t: number}) => {
  const usHot = t >= US_AT && t < FR_AT, frHot = t >= FR_AT;
  return <>
    <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1920, background: '#FDEEEE'}} />
    <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1920, background: '#ECF8EF'}} />
    <Why />
    <SameHouse t={t} />
    <SideLabel text="AMERICA" x={270} y={480} color={RED} t={t} at={US_AT} />
    <SideLabel text="FRANCE" x={810} y={480} color={GREEN} t={t} at={FR_AT} />
    <div style={{position: 'absolute', left: 270 - 75, top: 670, transform: `skewY(${Math.sin(t * 5) * 3}deg)`}}><UsFlag w={150} /></div>
    <div style={{position: 'absolute', left: 810 - 75, top: 670, transform: `skewY(${Math.sin(t * 5 + 1) * 3}deg)`}}><FrFlag w={150} /></div>
    <div style={{position: 'absolute', left: 537, top: 620, width: 7, height: 940, background: INK, borderRadius: 4}} />
    <div style={{position: 'absolute', left: 0, top: HG, width: 1080, height: 6, background: INK}} />
    <House x={300} y={HG} w={440} kind="us" />
    <House x={780} y={HG} w={440} kind="fr" />
    <Penguin id="usdoug" x={70} y={HG + 40} h={230} pose={{brows: 'worried', eyeScale: usHot ? 1.25 : 1.05, pupil: usHot ? 0.6 : 1, beak: usHot ? 'frown' : 'flat', tremble: usHot ? 0.8 : 0, flapL: 25, flapR: 25}} />
    <Penguin id="frdoug" x={1010} y={HG + 40} h={230} pose={{brows: frHot ? 'happy' : 'worried', beak: frHot ? 'smile' : 'flat', eyeScale: 1.05, flapL: frHot ? 70 : 25, flapR: frHot ? 70 : 25}} />
    <Price text="$1,000,000" x={270} y={HG + 170} color={RED} t={t} at={US_AT} size={92} />
    <Price text="$35,000" x={810} y={HG + 170} color={GREEN} t={t} at={FR_AT} size={120} />
  </>;
};

type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
];

export const DougHome = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side named (America, then France)
    const toU = ease((tc - US_AT) / 0.35) * (tc < FR_AT ? 1 : 0), toF = ease((tc - FR_AT) / 0.35) * (tc < BOTH_AT ? 1 : 0);
    s = 1 + 0.18 * (toU + toF); fx = 540 - 270 * toU + 270 * toF; fy = 960 + 30 * (toU + toF);
  }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Audio src={staticFile('doug-home-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.35} name="user-pop" vol={0.35} />
    <Sfx at={US_AT - 0.05} name="user-whoosh" vol={0.25} />
    <Sfx at={US_AT + 0.6} name="user-cash-register" vol={0.4} />
    <Sfx at={FR_AT - 0.05} name="user-whoosh" vol={0.25} />
    <Sfx at={FR_AT + 0.7} name="user-boom" vol={0.4} />
    <Sfx at={FR_AT + 0.9} name="user-money" vol={0.3} />
  </AbsoluteFill>;
};
