// EP7 "Electric vs Gas" — hook first (approval), full episode after. Line timings: studio/src/data/doug-ev.json.
// Hook background = the user's own image (studio/public/doug-ev/hook-bg.png, 1024x1536): EV left, supercar right, forked road.
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
const BG_W = 1080, BG_H = 1620, BG_TOP = 60; // user image scaled to full width

// Big price tag: "$13" / "FULL CHARGE".
const Price = ({x, y, price, sub, color, at, t}: {x: number; y: number; price: string; sub: string; color: string; at: number; t: number}) => {
  const p = ease((t - at) / 0.22); if (p <= 0) return null;
  const d = t - at, s = d < 0.12 ? 1.6 - 0.6 * (d / 0.12) : 1;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(-4deg)`, textAlign: 'center', opacity: p}}>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 170, lineHeight: '165px', color, WebkitTextStroke: '9px #fff', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.25)'}}>{price}</div>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 42, color: '#fff', background: color, borderRadius: 12, padding: '2px 16px', border: `5px solid ${INK}`, display: 'inline-block'}}>{sub}</div>
  </div>;
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
const GAS = P(1), SAME = P(2);
const Hook = ({t}: {t: number}) => {
  const lookR = t >= GAS;
  return <>
    <Img src={staticFile('doug-ev/hook-bg.png')} style={{position: 'absolute', left: 0, top: BG_TOP, width: BG_W, height: BG_H}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 200, lineHeight: '210px', color: INK, transform: `scale(${0.6 + 0.4 * ease(t / 0.25)})`}}>why<span style={{color: RED}}>?</span></div>
    <Price x={250} y={930} price="$13" sub="FULL CHARGE" color={GREEN} at={0.9} t={t} />
    <Price x={830} y={930} price="$128" sub="FULL TANK" color={RED} at={GAS + 0.35} t={t} />
    <Vs x={540} y={560} t={t} />
    <Arrow x={540} y={1110} t={t} swingAt={GAS} />
    <Puzzled x={620} y={1080} t={t} />
    <Penguin id="doug" x={540} y={1560} h={400} pose={{turn: lookR ? 0.5 : -0.5, look: [lookR ? 0.8 : -0.8, -0.3], brows: lookR ? 'shock' : 'worried', eyeScale: lookR ? 1.25 : 1.05, pupil: lookR ? 0.5 : 1, beak: 'frown', flapR: 35, flapL: 35, sweat: lookR}} />
    <Stamp text="SAME 300 MILES" x={540} y={1680} at={SAME} color={INK} size={84} rot={-8} />
  </>;
};

export const DougEv = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  // camera: wide first beat, push toward the EV, swing to the supercar, back out on SAME
  const toEv = ease((tc - 0.6) / 0.4) * (tc < GAS ? 1 : 0), toGas = ease((tc - GAS) / 0.35) * (tc < SAME ? 1 : 0);
  const s = (1 + 0.15 * (toEv + toGas)) * (tc < 0.6 ? 1 : beat(tc, TIM)), fx = 540 - 230 * toEv + 230 * toGas, fy = 960 - 150 * (toEv + toGas);
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
