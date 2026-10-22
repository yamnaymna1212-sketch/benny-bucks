// EP7 "Electric vs Gas" — hook first (approval), full episode after. Line timings: studio/src/data/doug-ev.json.
// Hook cars = the user's own image cropped to the cars (studio/public/doug-ev/hook-cars.png; source videos/doug-ev/hook-source.png).
// Under them: battery (EV) and gas can fill up while the price counts up, Doug in the middle.
// Numbers: gas supercar 13 mpg EPA, 24.3 gal tank, premium ~$5.25/gal -> ~$128 per fill (~316 mi);
//          long-range EV ~75 kWh x ~$0.18/kWh home rate -> ~$13 per full charge (~300 mi).
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {BigWord, Flame, Igloo, Sign, Stamp, Thought, Title} from '../penguin/world';
import {Seagull, Walrus} from '../penguin/cast';
import {MoneyBag, Pump, Receipt, Snowfall} from './dougGas';
import {Bill} from './dougLaundering';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-ev.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_EV_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.6) * 30) / 30;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';
const G = 1300;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

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

// ---------- episode props ----------
// The user's two cars, cut out of their hook image (bottom-anchored at y).
const CAR = {ev: 209 / 430, gas: 189 / 431};
const Car = ({kind, x, y, w = 520, flip, rot = 0}: {kind: 'ev' | 'gas'; x: number; y: number; w?: number; flip?: boolean; rot?: number}) =>
  <Img src={staticFile(`doug-ev/car-${kind}.png`)} style={{position: 'absolute', left: x - w / 2, top: y - w * CAR[kind], width: w, transform: `scaleX(${flip ? -1 : 1}) rotate(${rot}deg)`, filter: 'drop-shadow(0 14px 10px rgba(0,0,0,0.25))'}} />;
const Scale = ({x, y, k, children}: {x: number; y: number; k: number; children: React.ReactNode}) =>
  <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${k})`, transformOrigin: `${x}px ${y}px`}}>{children}</div>;
const Ground = ({color = '#E4F4FC'}: {color?: string}) => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: color, borderTop: `5px solid ${INK}`}} />;
const Big = ({text, x, y, at, t, color = INK, size = 150, rot = -4}: {text: string; x: number; y: number; at: number; t: number; color?: string; size?: number; rot?: number}) => {
  if (t < at) return null; const d = t - at, s = d < 0.12 ? 1.6 - 0.6 * (d / 0.12) : 1;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(${rot}deg)`, fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, color, whiteSpace: 'nowrap', WebkitTextStroke: `${size * 0.05}px #fff`, paintOrder: 'stroke fill', textShadow: '0 6px 0 rgba(0,0,0,0.2)'}}>{text}</div>;
};
const Socket = ({x, y}: {x: number; y: number}) => <svg width={200} height={260} viewBox="0 0 200 260" style={{position: 'absolute', left: x - 100, top: y - 130}}>
  <rect x={10} y={10} width={180} height={240} rx={24} fill="#fff" stroke={INK} strokeWidth={8} />
  {[70, 170].map((yy) => <g key={yy}><rect x={70} y={yy - 30} width={14} height={34} rx={4} fill={INK} /><rect x={116} y={yy - 30} width={14} height={34} rx={4} fill={INK} /><circle cx={100} cy={yy + 18} r={8} fill={INK} /></g>)}
</svg>;
const Phone = ({x, y}: {x: number; y: number}) => <svg width={130} height={240} viewBox="0 0 130 240" style={{position: 'absolute', left: x - 65, top: y - 240}}>
  <rect x={6} y={6} width={118} height={228} rx={22} fill="#222" stroke={INK} strokeWidth={6} />
  <rect x={16} y={26} width={98} height={186} rx={10} fill="#5EC4FA" />
  <path d="M68 70 L 48 124 L 66 124 L 56 168 L 86 108 L 68 108 L 78 70 Z" fill="#fff" />
</svg>;
const Cable = ({d, color = INK}: {d: string; color?: string}) => <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}><path d={d} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" /></svg>;
const Engine = ({x, y, t, hot}: {x: number; y: number; t: number; hot: number}) => <>
  <svg width={520} height={380} viewBox="0 0 520 380" style={{position: 'absolute', left: x - 260, top: y - 380}}>
    <rect x={40} y={110} width={440} height={250} rx={24} fill={hot > 0.5 ? '#C9473C' : '#8A9399'} stroke={INK} strokeWidth={9} />
    {[0, 1, 2, 3].map((i) => { const up = Math.sin(t * 22 + i * 1.6) * 22; return <g key={i}>
      <rect x={70 + i * 102} y={40 + up} width={74} height={100} rx={10} fill="#C9CED4" stroke={INK} strokeWidth={7} />
      <line x1={107 + i * 102} y1={140 + up} x2={107 + i * 102} y2={250} stroke={INK} strokeWidth={10} /></g>; })}
    <circle cx={260} cy={300} r={36} fill="#555" stroke={INK} strokeWidth={7} />
  </svg>
  {hot > 0 && [0, 1, 2, 3, 4].map((i) => <Flame key={i} x={x - 200 + i * 100} y={y - 330} s={0.6 + 0.5 * hot} seed={i} />)}
</>;
const Heat = ({x, y, t, n = 3}: {x: number; y: number; t: number; n?: number}) => <svg width={300} height={300} viewBox="0 0 300 300" style={{position: 'absolute', left: x - 150, top: y - 300, overflow: 'visible'}}>
  {Array.from({length: n}, (_, i) => { const o = (t * 120 + i * 40) % 80; return <path key={i} d={`M${60 + i * 90} ${280 - o} q 25 -30 0 -60 q -25 -30 0 -60 q 25 -30 0 -60`} fill="none" stroke={RED} strokeWidth={12} strokeLinecap="round" opacity={0.9} />; })}
</svg>;
const Tire = ({x, y, t, spin = 1, r = 120}: {x: number; y: number; t: number; spin?: number; r?: number}) => <svg width={r * 2} height={r * 2} viewBox="-100 -100 200 200" style={{position: 'absolute', left: x - r, top: y - r}}>
  <circle r={96} fill="#1c1c1c" stroke={INK} strokeWidth={6} /><circle r={60} fill="#C9CED4" stroke={INK} strokeWidth={6} />
  <g transform={`rotate(${t * 360 * spin})`}>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-7} y={-56} width={14} height={44} rx={4} fill="#555" transform={`rotate(${i * 72})`} />)}</g>
  <circle r={14} fill="#777" stroke={INK} strokeWidth={5} />
</svg>;
const FlowArrow = ({x1, y1, x2, y2, color, t, at}: {x1: number; y1: number; x2: number; y2: number; color: string; t: number; at: number}) => {
  const p = ease((t - at) / 0.4); if (p <= 0) return null;
  const xe = lerp(x1, x2, p), ye = lerp(y1, y2, p), a = Math.atan2(y2 - y1, x2 - x1);
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={color} strokeWidth={22} strokeLinecap="round" />
    {p > 0.95 && <path d={`M${x2} ${y2} l ${-50 * Math.cos(a - 0.5)} ${-50 * Math.sin(a - 0.5)} M${x2} ${y2} l ${-50 * Math.cos(a + 0.5)} ${-50 * Math.sin(a + 0.5)}`} stroke={color} strokeWidth={22} strokeLinecap="round" />}
  </svg>;
};
const FastCharger = ({x, y, price}: {x: number; y: number; price: string}) => <svg width={220} height={480} viewBox="0 0 220 480" style={{position: 'absolute', left: x - 110, top: y - 480}}>
  <rect x={20} y={20} width={180} height={450} rx={26} fill="#F4F6F8" stroke={INK} strokeWidth={9} />
  <rect x={44} y={56} width={132} height={110} rx={12} fill="#1D2A33" />
  <text x={110} y={128} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={46} fill="#FF5A4E">{price}</text>
  <path d="M118 200 L 82 290 L 112 290 L 96 370 L 146 260 L 114 260 L 132 200 Z" fill="#3DDC84" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  <text x={110} y={440} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill={INK}>FAST</text>
</svg>;
const Bar = ({x, y, h, color, label, top, p}: {x: number; y: number; h: number; color: string; label: string; top: string; p: number}) => <>
  <div style={{position: 'absolute', left: x - 110, top: y - h * p, width: 220, height: h * p, background: color, border: `7px solid ${INK}`, borderRadius: '16px 16px 0 0'}} />
  <div style={{position: 'absolute', left: x - 200, width: 400, top: y - h * p - 130, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 110, color, WebkitTextStroke: '5px #fff', paintOrder: 'stroke fill', opacity: p}}>{top}</div>
  <div style={{position: 'absolute', left: x - 200, width: 400, top: y + 20, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 46, color: INK}}>{label}</div>
</>;

// ---------- sets ----------
const Intro = ({t}: {t: number}) => <>
  <Ground />
  <Igloo x={220} y={G} w={360} />
  <Penguin id="doug" x={560} y={G + 40} h={560} pose={{look: [0.6, -0.6], beak: 'smile', brows: 'happy', flapR: 60 + Math.sin(t * 8) * 20}} />
  <Thought x={800} y={560} w={480} tx={640} ty={G - 520} at={P(3) + 0.9}><Car kind="gas" x={240} y={250} w={340} /></Thought>
</>;
const Lot = ({t}: {t: number}) => <>
  <Ground />
  <Sign x={540} y={480} text="LARRY CARS" w={460} />
  <Car kind="ev" x={300} y={G + 20} w={440} />
  <Car kind="gas" x={790} y={G + 20} w={440} />
  <Walrus x={540} y={G + 330} h={420} pose={{laugh: t > P(4) + 0.4 ? 1 : 0, lids: 0.4}} />
  <Stamp text="SAME SPEED" x={540} y={760} at={P(4) + 1.0} color={INK} size={90} rot={-6} />
</>;
const GasDrink = ({t}: {t: number}) => <>
  <Ground />
  <Pump x={250} y={G} t={t} run dollars={5.25} />
  <Cable d={`M330 ${G - 210} C 420 ${G - 120}, 470 ${G - 260}, 560 ${G - 170}`} />
  <Car kind="gas" x={720} y={G + 20} w={560} />
  <Big text="⛽ GAS" x={540} y={520} at={P(5)} t={t} color={RED} size={130} />
  <Big text="$5 / GALLON" x={540} y={760} at={P(6)} t={t} color={RED} size={110} />
</>;
const EvDrink = ({t}: {t: number}) => <>
  <Ground />
  <Socket x={180} y={900} />
  <Cable d={`M180 900 C 260 1150, 420 1050, 520 ${G - 150}`} color="#2B2B2B" />
  <Car kind="ev" x={720} y={G + 20} w={560} />
  <Big text="⚡ ELECTRICITY" x={540} y={500} at={P(7)} t={t} color={GREEN} size={100} />
  {t >= P(7) + 1.6 && <><Phone x={180} y={G - 20} /><Cable d={`M180 900 C 130 1000, 120 1050, 180 ${G - 250}`} color="#2B2B2B" /></>}
  <Big text="like phone" x={540} y={680} at={P(7) + 1.9} t={t} color={INK} size={80} />
</>;
const FillUp = ({t}: {t: number}) => {
  const run = cl((t - P(8)) / (P(9) + 0.6 - P(8)));
  return <>
    <Ground />
    <Pump x={300} y={G} t={t} run={run < 1} dollars={Math.round(128 * run * 100) / 100} />
    <Car kind="gas" x={760} y={G + 20} w={480} />
    <Penguin id="doug" x={140} y={G + 40} h={380} pose={{look: [0.8, -0.4], brows: run >= 1 ? 'shock' : 'worried', eyeScale: run >= 1 ? 1.3 : 1, sweat: run > 0.5, beak: 'frown'}} />
    <Receipt x={540} y={300} t={t} at={P(9)} />
    <Big text="$128" x={760} y={700} at={P(9)} t={t} color={RED} size={190} />
  </>;
};
const Mood = ({t, at, kind}: {t: number; at: number; kind: 'poor' | 'happy' | 'angry'}) => {
  const pose = kind === 'poor' ? {lids: 0.35, brows: 'worried' as const, beak: 'frown' as const, tears: true}
    : kind === 'happy' ? {beak: 'smile' as const, brows: 'happy' as const, lids: 0.3, blush: 1, flapL: 120, flapR: 120}
    : {brows: 'angry' as const, angry: 1, beak: 'frown' as const, tremble: 1};
  return <>
    {kind === 'angry' && <div style={{position: 'absolute', inset: 0, background: '#FFE3DF'}} />}
    {kind === 'happy' && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 200, top: 420 + (i % 2) * 120 + Math.sin(t * 6 + i) * 20, fontSize: 90}}>✨</div>)}
    <Penguin id="doug" x={540} y={G + 300} h={950} pose={pose} />
    {kind === 'poor' && <>
      <div style={{position: 'absolute', left: 640, top: 1180, width: 260, height: 170, background: '#8B5A2B', border: `6px solid ${INK}`, borderRadius: 18}} />
      <Bill x={lerp(770, 980, ease((t - at) / 0.8))} y={lerp(1180, 480, ease((t - at) / 0.8))} w={150} rot={t * 300} />
    </>}
    {kind === 'angry' && [0, 1].map((i) => { const ph = (t * 1.5 + i / 2) % 1; return <div key={i} style={{position: 'absolute', left: 300 + i * 420, top: 520 - ph * 200, width: 90 + ph * 60, height: 90 + ph * 60, borderRadius: '50%', background: '#fff', border: `5px solid ${INK}`, opacity: 1 - ph}} />; })}
    <BigWord text={`Doug ${kind}.`} x={540} y={360} at={at} size={130} color={kind === 'happy' ? GREEN : RED} />
  </>;
};
const Burn = ({t}: {t: number}) => <>
  <Engine x={540} y={1250} t={t} hot={cl((t - P(11) - 0.6) / 0.5)} />
  <Big text="why?" x={540} y={460} at={P(11)} t={t} size={150} />
  {[0, 1, 2].map((i) => <Big key={i} text="BOOM" x={300 + i * 240} y={640 + (i % 2) * 90} at={P(12) + i * 0.26} t={t} color={i % 2 ? '#F08A24' : RED} size={90} rot={-10 + i * 10} />)}
</>;
const Waste = ({t}: {t: number}) => {
  const split = t >= P(13) + 1.2, heat = t >= P(14);
  return <>
    <Ground />
    {[0, 1, 2, 3].map((i) => { const go = i === 0 && split ? ease((t - P(13) - 1.2) / 0.5) : 0, burn = i > 0 && heat ? 1 : 0;
      return <React.Fragment key={i}>
        {!burn && <Bill x={lerp(240 + i * 200, 260, go)} y={lerp(560, 1000, go)} w={170} rot={-5 + i * 4} />}
        {burn > 0 && <><Flame x={240 + i * 200} y={620} s={1.1} seed={i} /><Heat x={240 + i * 200} y={560} t={t} n={2} /></>}
      </React.Fragment>; })}
    <Big text="$4" x={540} y={380} at={P(13)} t={t} size={140} />
    {split && <Tire x={260} y={G - 120} t={t} />}
    {split && t < P(15) && <Big text="$1 → wheels" x={640} y={1180} at={P(13) + 1.2} t={t} color={GREEN} size={80} rot={0} />}
    <Big text="$3 = HEAT" x={540} y={800} at={P(14)} t={t} color={RED} size={120} />
    {t >= P(15) && <Penguin id="doug" x={880} y={G + 40} h={360} pose={{sweat: true, brows: 'worried', beak: 'frown', tremble: 0.5, look: [-0.6, -0.4]}} />}
  </>;
};
const Motor = ({t}: {t: number}) => <>
  <Ground />
  <Scale x={230} y={1100} k={0.75}><Battery x={230} y={1100} fill={1} /></Scale>
  <FlowArrow x1={360} y1={900} x2={640} y2={900} color={GREEN} t={t} at={P(16) + 0.3} />
  <FlowArrow x1={720} y1={980} x2={820} y2={1060} color={GREEN} t={t} at={P(17)} />
  <Tire x={850} y={G - 140} t={t} spin={2} r={130} />
  <Big text="~90%" x={540} y={560} at={P(17)} t={t} color={GREEN} size={190} />
  <Big text="almost no waste" x={540} y={1480} at={P(16) + 0.6} t={t} size={70} rot={-2} />
</>;
const Efficiency = ({t}: {t: number}) => <>
  <Title lines={['EFFICIENCY']} y={760} at={P(18)} size={140} />
  <Car kind="ev" x={300} y={G + 120} w={380} />
  <Big text="90%" x={300} y={1420} at={P(18) + 0.3} t={t} color={GREEN} size={100} />
  <Car kind="gas" x={790} y={G + 120} w={380} />
  <Big text="30%" x={790} y={1420} at={P(18) + 0.3} t={t} color={RED} size={100} />
</>;
const Gull = ({t}: {t: number}) => {
  const land = ease((t - P(19)) / 0.7);
  return <>
    <Ground />
    <Pump x={720} y={G} t={t} run dollars={5.25} />
    <Seagull x={lerp(1200, 480, land)} y={lerp(300, G, land)} h={400} pose={{fly: land < 1, mouth: 0.4, holding: t > P(19) + 1}} />
    {t > P(19) + 0.9 && <Bill x={480} y={G - 330} w={150} rot={-12} />}
    <Big text="TAX" x={540} y={520} at={P(19) + 0.4} t={t} color={RED} size={150} />
    <Big text="every gallon" x={540} y={1460} at={P(19) + 1.1} t={t} color={RED} size={80} rot={-2} />
  </>;
};
const RealLife = ({t}: {t: number}) => <>
  <Big text="IN REAL LIFE" x={540} y={330} at={P(20)} t={t} size={90} rot={0} />
  <Car kind="gas" x={540} y={820} w={560} />
  <Big text="13 MPG" x={540} y={930} at={P(20) + 1.0} t={t} color={RED} size={130} />
  {t >= P(21) && <Car kind="ev" x={540} y={1360} w={560} />}
  <Big text="4 MILES / kWh" x={540} y={1470} at={P(21) + 0.6} t={t} color={GREEN} size={96} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 1700, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 700, fontSize: 30, color: '#777'}}>EPA · DOE</div>
</>;
const Prices = ({t}: {t: number}) => {
  const big = ease((t - P(23)) / 0.5);
  return <>
    <Ground />
    <Car kind="ev" x={260} y={G} w={400} />
    <Big text="$40,000" x={260} y={880} at={P(22) + 0.3} t={t} color={GREEN} size={100} />
    <Scale x={790} y={G} k={1 + 0.35 * big}><Car kind="gas" x={790} y={G} w={400} /></Scale>
    <Big text="$400,000" x={780} y={620} at={P(23) + 0.3} t={t} color={RED} size={110} />
  </>;
};
const Home = ({t}: {t: number}) => {
  const fill = cl((t - P(25)) / (P(26) + 0.5 - P(25)));
  return <>
    <Ground />
    <Igloo x={240} y={G} w={420} />
    <Cable d={`M380 ${G - 80} C 460 ${G - 10}, 520 ${G - 160}, 600 ${G - 120}`} color="#2B2B2B" />
    <Car kind="ev" x={780} y={G + 20} w={480} />
    <Penguin id="doug" x={540} y={G + 60} h={360} pose={{beak: 'smile', brows: 'happy', flapR: 110, look: [0.6, -0.3], hop: t < P(25) ? 1 : 0}} />
    {t >= P(25) && <Scale x={780} y={760} k={0.55}><Battery x={780} y={760} fill={fill} /></Scale>}
    <Big text="$13" x={300} y={600} at={P(26)} t={t} color={GREEN} size={190} />
  </>;
};
const Save = ({t}: {t: number}) => <>
  <Penguin id="doug" x={540} y={G + 120} h={600} pose={{beak: 'smile', brows: 'happy', flapL: 120, flapR: 120, blush: 1}} />
  {[0, 1, 2, 3, 4].map((i) => { const p = ease((t - P(28) - 0.2 - i * 0.25) / 0.5); return p > 0 && p < 1 ? <Bill key={i} x={lerp(100 + i * 220, 540, p)} y={lerp(300, 1100, p)} w={150} rot={t * 200 + i * 40} /> : null; })}
  <MoneyBag x={540} y={G + 140} w={260} label="$$$" />
  <Big text="+$350" x={540} y={460} at={P(28) + 0.8} t={t} color={GREEN} size={190} />
  <Big text="every month" x={540} y={640} at={P(28) + 0.2} t={t} size={80} rot={-2} />
</>;
const Trip = ({t}: {t: number}) => {
  const bars = t >= P(31);
  return bars ? <>
    <Ground color="#fff" />
    <Bar x={300} y={G} h={160} color={GREEN} label="FAST CHARGE" top="$40" p={ease((t - P(31)) / 0.4)} />
    <Bar x={780} y={G} h={520} color={RED} label="FULL TANK" top="$128" p={ease((t - P(31) - 0.2) / 0.4)} />
    <Big text="still cheaper" x={540} y={400} at={P(31) + 0.3} t={t} color={GREEN} size={100} />
  </> : <>
    <Ground color="#C9CED4" />
    <div style={{position: 'absolute', left: -400, right: -400, top: G + 60, height: 12, background: `repeating-linear-gradient(90deg, #fff 0 80px, transparent 80px 140px)`, transform: `translateX(${-(t * 600) % 140}px)`}} />
    <FastCharger x={170} y={G} price={t >= P(30) ? '$40' : '$13'} />
    <Car kind="ev" x={660} y={G + 20} w={520} />
    <Penguin id="doug" x={930} y={G + 40} h={320} pose={{brows: t >= P(30) ? 'shock' : 'none', eyeScale: t >= P(30) ? 1.3 : 1, beak: t >= P(30) ? 'frown' : 'smile', look: [-0.8, -0.3]}} />
    <Big text="x3" x={420} y={640} at={P(30)} t={t} color={RED} size={200} />
    <Big text="ROAD TRIP" x={540} y={420} at={P(29) + 0.3} t={t} size={100} rot={0} />
  </>;
};
const Winter = ({t}: {t: number}) => {
  const drop = ease((t - P(33)) / 1.2), again = t >= P(34), lvl = again ? 0.6 + 0.4 * Math.abs(Math.sin((t - P(34)) * 2.4)) : 1 - 0.4 * drop;
  return <>
    <div style={{position: 'absolute', inset: 0, background: '#DCEBF5'}} />
    <Snowfall t={t} />
    <Ground color="#fff" />
    <Car kind="ev" x={620} y={G + 20} w={560} />
    <Scale x={180} y={1100} k={0.6}><Battery x={180} y={1100} fill={lvl} /></Scale>
    <Big text="-40%" x={540} y={560} at={P(33) + 0.4} t={t} color={RED} size={190} />
    <Big text="WINTER" x={540} y={360} at={P(32)} t={t} color="#2A7AB8" size={120} rot={0} />
    <Big text="charge again..." x={540} y={1460} at={P(34)} t={t} size={80} rot={-2} />
  </>;
};
const Snow = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', inset: 0, background: '#DCEBF5'}} />
  <Snowfall t={t} /><Snowfall t={t + 7} />
  <Ground color="#fff" />
  <Igloo x={820} y={G} w={380} />
  <Penguin id="doug" x={420} y={G + 40} h={560} pose={{tremble: 1, brows: 'worried', beak: 'frown', flapL: 20, flapR: 20, look: [0, -0.2]}} />
  <Big text="❄️ ❄️ ❄️" x={540} y={420} at={P(35)} t={t} size={110} rot={0} />
</>;
const Cta = ({t}: {t: number}) => <>
  <Ground />
  <Car kind="ev" x={260} y={1150} w={420} />
  <Car kind="gas" x={820} y={1150} w={420} />
  <Big text="TEAM ⚡" x={270} y={560} at={P(37)} t={t} color={GREEN} size={80} />
  <Big text="TEAM ⛽" x={810} y={560} at={P(37) + 0.4} t={t} color={RED} size={80} />
  <Penguin id="doug" x={540} y={G + 80} h={420} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
  <BigWord text="👇" x={540} y={780} at={P(38)} size={140} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(3), set: (t) => <Intro t={t} />, fx_: 'swipe'},
  {at: P(4), set: (t) => <Lot t={t} />, fx_: 'pop'},
  {at: P(5), set: (t) => <GasDrink t={t} />, fx_: 'swipeL'},
  {at: P(7), set: (t) => <EvDrink t={t} />, fx_: 'swipe'},
  {at: P(8), set: (t) => <FillUp t={t} />, fx_: 'zoom'},
  {at: P(10), set: (t) => <Mood t={t} at={P(10)} kind="poor" />, fx_: 'zoom'},
  {at: P(11), set: (t) => <Burn t={t} />, fx_: 'iris'},
  {at: P(13), set: (t) => <Waste t={t} />, fx_: 'swipe'},
  {at: P(16), set: (t) => <Motor t={t} />, fx_: 'swipeL'},
  {at: P(18), set: (t) => <Efficiency t={t} />, fx_: 'pop'},
  {at: P(19), set: (t) => <Gull t={t} />, fx_: 'swipe'},
  {at: P(20), set: (t) => <RealLife t={t} />, fx_: 'iris'},
  {at: P(22), set: (t) => <Prices t={t} />, fx_: 'swipeL'},
  {at: P(24), set: (t) => <Home t={t} />, fx_: 'swipe'},
  {at: P(27), set: (t) => <Mood t={t} at={P(27)} kind="happy" />, fx_: 'zoom'},
  {at: P(28), set: (t) => <Save t={t} />, fx_: 'pop'},
  {at: P(29), set: (t) => <Trip t={t} />, fx_: 'swipeL'},
  {at: P(32), set: (t) => <Winter t={t} />, fx_: 'iris'},
  {at: P(35), set: (t) => <Snow t={t} />, fx_: 'swipe'},
  {at: P(36), set: (t) => <Mood t={t} at={P(36)} kind="angry" />, fx_: 'zoom'},
  {at: P(37), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[6, 540, 760, 1.4], [9, 760, 760, 1.5], [14, 540, 760, 1.4], [17, 540, 640, 1.4], [23, 790, 900, 1.3], [26, 300, 700, 1.5], [30, 420, 760, 1.4], [33, 540, 700, 1.4]];

export const DougEv = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the EV, swing to the supercar, back out on SAME
    const toEv = ease((tc - 0.6) / 0.4) * (tc < GAS ? 1 : 0), toGas = ease((tc - GAS) / 0.35) * (tc < SAME ? 1 : 0);
    s0 = 1 + 0.15 * (toEv + toGas); fx = 540 - 230 * toEv + 230 * toGas;
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (tc < 0.6 ? 1 : beat(tc, TIM));
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} y={tc < P(3) ? 1790 : 1600} />
    <Audio src={staticFile('doug-ev-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.9} name="user-cash-register" vol={0.35} />
    <Sfx at={GAS + 0.35} name="user-boom" vol={0.45} />
    <Sfx at={SAME} name="user-slap" vol={0.4} />
    <Sfx at={P(3)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(4) + 0.4} name="walrus-laugh" vol={0.4} />
    <Sfx at={P(4) + 1.0} name="user-slap" vol={0.3} />
    <Sfx at={P(6)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(7) + 1.9} name="user-pop" vol={0.35} />
    <Sfx at={P(9)} name="user-money" vol={0.35} />
    <Sfx at={P(9) + 0.5} name="user-fahh" vol={0.4} />
    <Sfx at={P(10)} name="user-shock" vol={0.4} />
    {[0, 1, 2].map((i) => <Sfx key={`b${i}`} at={P(12) + i * 0.26} name="user-boom" vol={0.3} />)}
    <Sfx at={P(14)} name="user-wrong" vol={0.35} />
    <Sfx at={P(17)} name="user-ting" vol={0.35} />
    <Sfx at={P(18)} name="user-pop" vol={0.35} />
    <Sfx at={P(19)} name="gull-caw" vol={0.4} />
    <Sfx at={P(19) + 0.9} name="user-slap" vol={0.35} />
    <Sfx at={P(20)} name="user-ting" vol={0.35} />
    <Sfx at={P(23)} name="user-boom" vol={0.35} />
    <Sfx at={P(26)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(27)} name="user-wow" vol={0.4} />
    <Sfx at={P(28)} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(30)} name="user-wrong" vol={0.35} />
    <Sfx at={P(31)} name="user-ting" vol={0.35} />
    <Sfx at={P(33)} name="user-aww" vol={0.4} />
    <Sfx at={P(34)} name="user-timer" vol={0.3} />
    <Sfx at={P(35)} name="user-horn" vol={0.4} />
    <Sfx at={P(36)} name="user-slap" vol={0.4} />
    <Sfx at={P(37)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
