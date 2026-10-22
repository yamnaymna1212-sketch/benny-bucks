// EP7 "Electric vs Gas" — hook first (approval), full episode after. Line timings: studio/src/data/doug-ev.json.
// Hook cars = the user's own image cropped to the cars (studio/public/doug-ev/hook-cars.png; source videos/doug-ev/hook-source.png).
// Under them: battery (EV) and gas can fill up while the price counts up, Doug in the middle.
// Numbers: gas supercar 13 mpg EPA, 24.3 gal tank, premium ~$5.25/gal -> ~$128 per fill (~316 mi);
//          long-range EV ~75 kWh x ~$0.18/kWh home rate -> ~$13 per full charge (~300 mi).
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Stamp} from '../penguin/world';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-ev.json';

const P = (i: number) => TIM[i].start;
export const DOUG_EV_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.6) * 30) / 30;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';

// Big price tag: "$13" / "FULL CHARGE".
const Price = ({x, y, value, fill, sub, color, at, t}: {x: number; y: number; value: number; fill: number; sub: string; color: string; at: number; t: number}) => {
  const p = ease((t - at) / 0.22); if (p <= 0) return null;
  const d = t - at, s = d < 0.12 ? 1.6 - 0.6 * (d / 0.12) : 1, price = `$${Math.round(value * fill)}`;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(-4deg)`, textAlign: 'center', opacity: p}}>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 170, lineHeight: '165px', color, WebkitTextStroke: '9px #fff', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.25)'}}>{price}</div>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 42, color: '#fff', background: color, borderRadius: 12, padding: '2px 16px', border: `5px solid ${INK}`, display: 'inline-block'}}>{sub}</div>
  </div>;
};
// Battery (EV side): cells fill green with a bolt.
const Battery = ({x, y, fill}: {x: number; y: number; fill: number}) => {
  const lvl = 330 * fill;
  return <svg width={260} height={420} viewBox="0 0 260 420" style={{position: 'absolute', left: x - 130, top: y - 420}}>
    <defs><clipPath id="batt"><rect x={24} y={56} width={212} height={350} rx={26} /></clipPath></defs>
    <rect x={90} y={14} width={80} height={44} rx={10} fill={INK} />
    <rect x={20} y={52} width={220} height={358} rx={32} fill="#fff" stroke={INK} strokeWidth={10} />
    <g clipPath="url(#batt)"><rect x={20} y={400 - lvl} width={220} height={lvl + 10} fill="#3DDC84" /><rect x={20} y={400 - lvl} width={220} height={14} fill="#7DF0AE" /></g>
    {[1, 2, 3, 4].map((i) => <line key={i} x1={30} x2={230} y1={56 + i * 70} y2={56 + i * 70} stroke="#fff" strokeWidth={6} opacity={0.8} />)}
    <path d="M142 120 L 92 240 L 134 240 L 112 340 L 176 200 L 134 200 L 158 120 Z" fill={fill >= 1 ? '#fff' : INK} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  </svg>;
};
// Gas can (gas side): yellow gas rises with a pour stream while filling.
const GasCan = ({x, y, fill, t}: {x: number; y: number; fill: number; t: number}) => {
  const lvl = 300 * fill, top = 400 - lvl;
  return <svg width={300} height={440} viewBox="0 0 300 440" style={{position: 'absolute', left: x - 150, top: y - 440, overflow: 'visible'}}>
    <defs><clipPath id="can"><path d="M20 110 L170 110 L270 200 L270 410 L20 410 Z" /></clipPath></defs>
    <path d="M20 110 L170 110 L270 200 L270 410 L20 410 Z" fill="#E3201B" />
    <g clipPath="url(#can)">
      <rect x={10} y={110} width={270} height={300} fill="#B5120E" />
      <path d={`M0 ${top + Math.sin(t * 9) * 5} Q 70 ${top - 12} 140 ${top} T 290 ${top} L290 420 L0 420 Z`} fill="#F2B705" />
    </g>
    <path d="M20 110 L170 110 L270 200 L270 410 L20 410 Z" fill="none" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
    <path d="M60 170 L230 380 M230 200 L60 380" stroke="#fff" strokeWidth={12} opacity={0.35} />
    <rect x={40} y={60} width={100} height={50} rx={14} fill="none" stroke={INK} strokeWidth={10} />
    <path d="M200 140 L 250 60 L 290 60" fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" />
    {fill > 0 && fill < 1 && <path d={`M330 -60 Q 260 -40, 150 ${top}`} fill="none" stroke="#F2B705" strokeWidth={16} strokeLinecap="round" />}
  </svg>;
};
const Vs = ({x, y, t}: {x: number; y: number; t: number}) => {
  const p = ease((t - 0.35) / 0.3);
  return <div style={{position: 'absolute', left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: '50%', background: RED, border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: '#fff', transform: `scale(${p}) rotate(${-8 + Math.sin(t * 4) * 3}deg)`}}>VS</div>;
};
// Red hand-drawn arrow above Doug: points at the EV (left), swings over to the supercar (right) when it is named.
const Arrow = ({x, y, t, swingAt}: {x: number; y: number; t: number; swingAt: number}) => {
  const draw = ease((t - 0.15) / 0.35), sw = t < swingAt ? 0 : cl((t - swingAt) / 0.35);
  const ang = 205 + (335 - 205) * ease(sw) - (sw < 1 ? Math.sin(sw * Math.PI) * 12 : 0);
  return <svg width={10} height={10} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <g transform={`rotate(${ang})`}>
      <path d="M0 0 Q 85 -34, 170 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />
      {draw > 0.9 && <path d="M170 0 L128 -26 M170 0 L130 30" fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />}
    </g>
  </svg>;
};
const Puzzled = ({x, y, t}: {x: number; y: number; t: number}) =>
  <div style={{position: 'absolute', left: x, top: y + Math.sin(t * 6) * 8, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 120, color: INK, transform: 'rotate(14deg)'}}>?</div>;

// ---------- hook ----------
const EV_AT = 0.5, GAS = P(1), SAME = P(2);
const Hook = ({t}: {t: number}) => {
  const lookR = t >= GAS, evFill = ease((t - EV_AT) / (GAS - EV_AT - 0.1)), gasFill = cl((t - GAS) / (SAME - GAS - 0.05));
  return <>
    <Img src={staticFile('doug-ev/hook-cars.png')} style={{position: 'absolute', left: 0, top: 240, width: 1080, height: 530}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 200, lineHeight: '210px', color: INK, transform: `scale(${0.6 + 0.4 * ease(t / 0.25)})`}}>why<span style={{color: RED}}>?</span></div>
    <Vs x={540} y={470} t={t} />
    <Price x={240} y={860} value={13} fill={evFill} sub="FULL CHARGE" color={GREEN} at={EV_AT} t={t} />
    <Price x={850} y={860} value={128} fill={gasFill} sub="FULL TANK" color={RED} at={GAS} t={t} />
    <Battery x={220} y={1450} fill={evFill} />
    <GasCan x={860} y={1450} fill={gasFill} t={t} />
    <Arrow x={540} y={1010} t={t} swingAt={GAS} />
    <Puzzled x={610} y={980} t={t} />
    <Penguin id="doug" x={540} y={1490} h={440} pose={{turn: lookR ? 0.5 : -0.5, look: [lookR ? 0.8 : -0.8, -0.3], brows: lookR ? 'shock' : 'worried', eyeScale: lookR ? 1.25 : 1.05, pupil: lookR ? 0.5 : 1, beak: 'frown', flapR: 35, flapL: 35, sweat: lookR}} />
    <Stamp text="SAME 300 MILES" x={540} y={1640} at={SAME} color={INK} size={84} rot={-8} />
  </>;
};

export const DougEv = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  // camera: wide first beat, push toward the EV, swing to the supercar, back out on SAME
  const toEv = ease((tc - 0.6) / 0.4) * (tc < GAS ? 1 : 0), toGas = ease((tc - GAS) / 0.35) * (tc < SAME ? 1 : 0);
  const s = (1 + 0.15 * (toEv + toGas)) * (tc < 0.6 ? 1 : beat(tc, TIM)), fx = 540 - 230 * toEv + 230 * toGas, fy = 960;
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}><Hook t={t} /></AbsoluteFill>
    <Captions t={tc} phrases={TIM} y={1790} />
    <Audio src={staticFile('doug-ev-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.9} name="user-cash-register" vol={0.35} />
    <Sfx at={GAS} name="user-whoosh" vol={0.3} />
    <Sfx at={GAS + 0.35} name="user-boom" vol={0.45} />
    <Sfx at={SAME} name="user-slap" vol={0.4} />
  </AbsoluteFill>;
};
