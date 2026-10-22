// EP7 "Electric vs Gas" — hook first (approval), full episode after. Line timings: studio/src/data/doug-ev.json.
// Cars are semi-realistic vector drawings (gradients, glass, chrome) with NO real brand names or logos.
// Numbers: gas supercar 13 mpg EPA, 24.3 gal tank, premium ~$5.25/gal -> ~$128 per fill (~316 mi);
//          long-range EV ~75 kWh x ~$0.18/kWh home rate -> ~$13 per full charge (~300 mi).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
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

// ---------- semi-realistic cars (side view, facing right) ----------
const Wheel = ({cx, cy, r, spin}: {cx: number; cy: number; r: number; spin: number}) => <g>
  <circle cx={cx} cy={cy} r={r} fill="#151515" />
  <circle cx={cx} cy={cy} r={r * 0.92} fill="#222" />
  <circle cx={cx} cy={cy} r={r * 0.66} fill="url(#rim)" stroke="#6b6b6b" strokeWidth={3} />
  <g transform={`rotate(${spin} ${cx} ${cy})`}>
    {Array.from({length: 5}, (_, i) => <rect key={i} x={cx - r * 0.07} y={cy - r * 0.62} width={r * 0.14} height={r * 0.5} rx={4} fill="#3a3a3a" transform={`rotate(${i * 72} ${cx} ${cy})`} />)}
  </g>
  <circle cx={cx} cy={cy} r={r * 0.14} fill="#888" stroke="#333" strokeWidth={3} />
</g>;

const Defs = () => <defs>
  <radialGradient id="rim" cx="40%" cy="35%"><stop offset="0" stopColor="#f2f2f2" /><stop offset="0.6" stopColor="#b9b9b9" /><stop offset="1" stopColor="#7d7d7d" /></radialGradient>
  <linearGradient id="evBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="0.45" stopColor="#e9edf1" /><stop offset="0.8" stopColor="#b8c0c8" /><stop offset="1" stopColor="#7f8a94" /></linearGradient>
  <linearGradient id="scBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff5a4a" /><stop offset="0.4" stopColor="#e3201b" /><stop offset="0.8" stopColor="#a50f0c" /><stop offset="1" stopColor="#5e0606" /></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6e8796" /><stop offset="0.5" stopColor="#1d2a33" /><stop offset="1" stopColor="#0b1116" /></linearGradient>
  <radialGradient id="shadow" cx="50%" cy="50%"><stop offset="0" stopColor="#000" stopOpacity="0.45" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
</defs>;

// Smooth electric sedan: tall rounded roof, no grille.
const EvCar = ({x, y, w = 760, spin = 0}: {x: number; y: number; w?: number; spin?: number}) =>
  <svg width={w} height={w * 0.36} viewBox="0 0 760 275" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.36, overflow: 'visible'}}>
    <Defs />
    <ellipse cx={380} cy={262} rx={360} ry={18} fill="url(#shadow)" />
    <path d="M30 200 C 26 165, 50 148, 110 140 C 170 132, 215 72, 330 58 C 430 46, 520 60, 590 118 C 660 128, 725 140, 740 175 C 748 200, 742 222, 720 226 L 50 226 C 34 224, 30 214, 30 200 Z" fill="url(#evBody)" stroke="#2b2f33" strokeWidth={4} />
    <path d="M200 132 C 240 86, 290 72, 350 70 L 360 132 Z" fill="url(#glass)" />
    <path d="M378 132 L 370 70 C 450 68, 520 80, 572 124 Z" fill="url(#glass)" />
    <path d="M90 170 C 260 160, 520 160, 735 172" stroke="#ffffff" strokeWidth={5} opacity={0.9} fill="none" />
    <path d="M360 140 L 360 214 M 560 140 L 556 214" stroke="#9aa4ad" strokeWidth={2} />
    <rect x={410} y={152} width={46} height={7} rx={3} fill="#9aa4ad" />
    <path d="M700 152 C 722 154, 734 160, 738 170 L 702 166 Z" fill="#fff6c9" stroke="#999" strokeWidth={2} />
    <path d="M34 168 L 62 162 L 60 178 L 34 182 Z" fill="#c4161c" />
    <path d="M230 82 C 300 62, 420 54, 520 74" stroke="#fff" strokeWidth={4} opacity={0.6} fill="none" />
    <Wheel cx={170} cy={222} r={52} spin={spin} />
    <Wheel cx={600} cy={222} r={52} spin={spin} />
  </svg>;

// Low wedge supercar: long hood, big side intake, rear wing.
const SuperCar = ({x, y, w = 800, spin = 0}: {x: number; y: number; w?: number; spin?: number}) =>
  <svg width={w} height={w * 0.3} viewBox="0 0 800 240" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.3, overflow: 'visible'}}>
    <Defs />
    <ellipse cx={400} cy={228} rx={380} ry={16} fill="url(#shadow)" />
    <path d="M40 120 L 60 110 L 30 104 L 34 94 L 120 98 C 200 92, 260 60, 340 52 C 420 46, 470 56, 520 92 C 610 100, 720 116, 780 150 C 790 168, 786 186, 770 192 L 50 192 C 34 188, 30 172, 34 150 Z" fill="url(#scBody)" stroke="#2a0606" strokeWidth={4} />
    <path d="M300 96 C 330 66, 380 60, 430 62 L 440 98 Z" fill="url(#glass)" />
    <path d="M454 98 L 446 62 C 480 64, 500 76, 512 94 Z" fill="url(#glass)" />
    <path d="M230 118 C 260 112, 300 112, 320 122 L 312 150 C 280 140, 250 140, 226 146 Z" fill="#1a0505" />
    <path d="M90 136 C 300 128, 560 128, 776 152" stroke="#ff8a7a" strokeWidth={4} opacity={0.8} fill="none" />
    <path d="M30 104 L 120 98 L 112 88 L 38 92 Z" fill="#1a0505" />
    <path d="M748 146 C 768 150, 780 156, 784 164 L 748 162 Z" fill="#fff6c9" stroke="#600" strokeWidth={2} />
    <path d="M40 126 L 70 124 L 68 136 L 40 138 Z" fill="#ffcf40" />
    {[0, 1].map((i) => <rect key={i} x={20} y={164 + i * 12} width={30} height={8} rx={4} fill="#888" />)}
    <path d="M330 60 C 380 50, 450 50, 500 74" stroke="#fff" strokeWidth={4} opacity={0.55} fill="none" />
    <Wheel cx={180} cy={190} r={50} spin={spin} />
    <Wheel cx={640} cy={190} r={50} spin={spin} />
  </svg>;

// Big price tag: "$13" / "FULL CHARGE".
const Price = ({x, y, price, sub, color, at, t}: {x: number; y: number; price: string; sub: string; color: string; at: number; t: number}) => {
  const p = ease((t - at) / 0.22); if (p <= 0) return null;
  const d = t - at, s = d < 0.12 ? 1.6 - 0.6 * (d / 0.12) : 1;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(-4deg)`, textAlign: 'center', opacity: p}}>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 190, lineHeight: '180px', color, WebkitTextStroke: '8px #fff', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.18)'}}>{price}</div>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 46, color: '#fff', background: color, borderRadius: 12, padding: '2px 18px', border: `5px solid ${INK}`, display: 'inline-block'}}>{sub}</div>
  </div>;
};
const Label = ({text, x, y, color, at, t}: {text: string; x: number; y: number; color: string; at: number; t: number}) => {
  const p = ease((t - at) / 0.25);
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 58, color, letterSpacing: 2, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>{text}</div>;
};
const Plug = ({x, y}: {x: number; y: number}) => <svg width={120} height={260} viewBox="0 0 120 260" style={{position: 'absolute', left: x, top: y - 260}}>
  <rect x={10} y={10} width={90} height={250} rx={18} fill="#f4f6f8" stroke={INK} strokeWidth={6} />
  <rect x={24} y={34} width={62} height={70} rx={8} fill="#1d2a33" />
  <path d="M60 46 L 46 74 L 60 74 L 52 96 L 74 64 L 60 64 L 68 46 Z" fill="#3DDC84" />
  <path d="M100 150 C 140 160, 150 230, 110 250" stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" />
</svg>;
const GasPump = ({x, y}: {x: number; y: number}) => <svg width={130} height={270} viewBox="0 0 130 270" style={{position: 'absolute', left: x, top: y - 270}}>
  <rect x={10} y={10} width={95} height={260} rx={14} fill={RED} stroke={INK} strokeWidth={6} />
  <rect x={24} y={34} width={66} height={60} rx={6} fill="#fff" stroke={INK} strokeWidth={4} />
  <text x={57} y={74} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={26} fill={INK}>GAS</text>
  <path d="M105 120 C 140 130, 140 220, 112 240" stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" />
</svg>;
const Vs = ({x, y, t}: {x: number; y: number; t: number}) => {
  const p = ease((t - 0.35) / 0.3);
  return <div style={{position: 'absolute', left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: '50%', background: RED, border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: '#fff', transform: `scale(${p}) rotate(${-8 + Math.sin(t * 4) * 3}deg)`}}>VS</div>;
};
// Red arrow: points up at the EV, swings down to the supercar when it is named.
const Arrow = ({x, y, t, swingAt}: {x: number; y: number; t: number; swingAt: number}) => {
  const draw = ease((t - 0.15) / 0.35), sw = t < swingAt ? 0 : cl((t - swingAt) / 0.3);
  const ang = -55 + 110 * ease(sw) - (sw < 1 ? Math.sin(sw * Math.PI) * 14 : 0);
  return <svg width={10} height={10} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <g transform={`rotate(${ang})`}>
      <path d="M0 0 Q 70 -28, 140 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="none" stroke={RED} strokeWidth={14} strokeLinecap="round" />
      {draw > 0.9 && <path d="M140 0 L104 -22 M140 0 L106 26" fill="none" stroke={RED} strokeWidth={14} strokeLinecap="round" />}
    </g>
  </svg>;
};
const Road = ({y, color}: {y: number; color: string}) => <>
  <div style={{position: 'absolute', left: -300, right: -300, top: y, height: 70, background: '#4a4f55', borderTop: `5px solid ${INK}`}} />
  <div style={{position: 'absolute', left: -300, right: -300, top: y + 32, height: 6, background: `repeating-linear-gradient(90deg, ${color} 0 60px, transparent 60px 110px)`}} />
</>;

// ---------- hook ----------
const GAS = P(1), SAME = P(2);
const Hook = ({t}: {t: number}) => {
  const lookDown = t >= GAS;
  return <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 200, lineHeight: '210px', color: INK, transform: `scale(${0.6 + 0.4 * ease(t / 0.25)})`}}>why<span style={{color: RED}}>?</span></div>
    {/* top half: electric */}
    <div style={{position: 'absolute', left: -300, right: -300, top: 380, height: 520, background: '#EAF7EF'}} />
    <Label text="⚡ ELECTRIC" x={60} y={410} color={GREEN} at={0.2} t={t} />
    <Plug x={40} y={880} />
    <EvCar x={600} y={880} w={700} />
    <Road y={880} color="#fff" />
    <Price x={760} y={560} price="$13" sub="FULL CHARGE" color={GREEN} at={0.9} t={t} />
    {/* bottom half: gas */}
    <div style={{position: 'absolute', left: -300, right: -300, top: 950, height: 520, background: '#FDEDEA'}} />
    <Label text="⛽ GAS" x={60} y={980} color={RED} at={GAS} t={t} />
    <GasPump x={30} y={1430} />
    <SuperCar x={610} y={1430} w={760} />
    <Road y={1430} color="#F2B705" />
    <Price x={760} y={1130} price="$128" sub="FULL TANK" color={RED} at={GAS + 0.35} t={t} />
    <Vs x={540} y={925} t={t} />
    <Arrow x={330} y={925} t={t} swingAt={GAS} />
    <Penguin id="doug" x={930} y={1880} h={300} pose={{look: [-0.6, lookDown ? 0.4 : -0.6], brows: lookDown ? 'shock' : 'worried', eyeScale: lookDown ? 1.25 : 1.05, beak: 'frown', sweat: lookDown}} />
    <Stamp text="SAME 300 MILES" x={540} y={925} at={SAME} color={INK} size={84} rot={-8} />
  </>;
};

export const DougEv = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  // camera: wide first beat, then push to the EV, then down to the supercar, back out on SAME
  const toEv = ease((tc - 0.6) / 0.4) * (tc < GAS ? 1 : 0), toGas = ease((tc - GAS) / 0.35) * (tc < SAME ? 1 : 0);
  const s = (1 + 0.08 * (toEv + toGas)) * (tc < 0.6 ? 1 : beat(tc, TIM)), fx = 560, fy = 960 - 200 * toEv + 160 * toGas;
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
