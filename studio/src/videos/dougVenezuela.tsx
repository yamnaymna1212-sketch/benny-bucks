// EP3 "Gas: America vs Venezuela" — remake of the user's hit (USA $4.41 vs Venezuela $0.13), penguin version.
// Hook first (approval), full episode after. Line timings: studio/src/data/doug-venezuela.json.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Stamp} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-venezuela.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_VENEZUELA_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1300;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';

// ---------- props ----------
const UsFlag = () => <g>
  <rect width={190} height={120} fill="#fff" stroke={INK} strokeWidth={5} />
  {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} y={i * 17.4} width={190} height={8.7} fill="#B22234" />)}
  <rect width={84} height={64} fill="#3C3B6E" />
  {Array.from({length: 12}, (_, i) => <circle key={i} cx={12 + (i % 4) * 20} cy={12 + Math.floor(i / 4) * 20} r={4} fill="#fff" />)}
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} />
</g>;
const VeFlag = () => <g>
  <rect width={190} height={40} fill="#F5C518" /><rect y={40} width={190} height={40} fill="#1F4BA8" /><rect y={80} width={190} height={40} fill="#D83A2E" />
  {Array.from({length: 8}, (_, i) => { const a = Math.PI * (0.85 - i * 0.1); return <circle key={i} cx={95 + Math.cos(a) * 30} cy={78 - Math.sin(a) * 26} r={4} fill="#fff" />; })}
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} />
</g>;

// Gas pump with a flag on a pole and a big "$x / GALLON" window, jerry can in front (as in the user's original thumbnail).
const FlagPump = ({x, y, price, flag, top, t, color, fill}: {x: number; y: number; price: string; flag: 'us' | 've'; top: string; t: number; color: string; fill: number}) => {
  const wave = Math.sin(t * 5) * 3;
  return <svg width={420} height={760} viewBox="0 0 420 760" style={{position: 'absolute', left: x - 210, top: y - 760, overflow: 'visible'}}>
    <line x1={60} y1={40} x2={60} y2={300} stroke={INK} strokeWidth={8} />
    <circle cx={60} cy={36} r={10} fill={INK} />
    <g transform={`translate(64 ${50 + wave}) skewY(${wave})`}>{flag === 'us' ? <UsFlag /> : <VeFlag />}</g>
    <rect x={40} y={300} width={300} height={440} rx={22} fill="#F4F4F2" stroke={INK} strokeWidth={7} />
    <rect x={40} y={300} width={300} height={34} rx={14} fill={top} stroke={INK} strokeWidth={7} />
    <rect x={64} y={370} width={252} height={160} rx={12} fill="#fff" stroke={INK} strokeWidth={6} />
    <text x={190} y={460} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={price.length > 5 ? 74 : 84} fill={color}>{price}</text>
    <text x={190} y={510} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={34} fill={INK}>/ GALLON</text>
    <path d="M340 400 C 400 420, 400 560, 360 600" fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
    <path d="M340 400 C 400 420, 400 560, 360 600" fill="none" stroke={top} strokeWidth={6} strokeLinecap="round" />
    <rect x={20} y={730} width={340} height={22} fill={top} stroke={INK} strokeWidth={5} />
    {/* jerry can, fills with gas (fill 0..1) */}
    <g transform="translate(70 600)">
      <defs><clipPath id={`can-${flag}`}><path d="M0 30 L90 30 L130 70 L130 150 L0 150 Z" /></clipPath></defs>
      <path d="M0 30 L90 30 L130 70 L130 150 L0 150 Z" fill="#FFF8E0" />
      <g clipPath={`url(#can-${flag})`}>
        <path d={`M-10 ${150 - 120 * fill + Math.sin(t * 9) * 3} Q 35 ${150 - 120 * fill - 7} 70 ${150 - 120 * fill} T 150 ${150 - 120 * fill} L150 160 L-10 160 Z`} fill="#F2B705" />
      </g>
      <path d="M0 30 L90 30 L130 70 L130 150 L0 150 Z" fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M20 60 L100 130 M100 60 L20 130" stroke="#C99A00" strokeWidth={8} opacity={0.5} />
      {fill > 0 && fill < 1 && <path d={`M150 -20 Q 120 -10, 60 ${150 - 120 * fill}`} fill="none" stroke="#F2B705" strokeWidth={9} strokeLinecap="round" />}
      <rect x={20} y={6} width={60} height={22} rx={8} fill="none" stroke={INK} strokeWidth={6} />
    </g>
  </svg>;
};

// Big hand-written "why?" with the red question mark and a red arrow toward the US pump (as in the original).
const Why = ({t}: {t: number}) => {
  const p = ease(t / 0.25);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 230, height: 330, transform: `scale(${0.6 + 0.4 * p})`, opacity: p, transformOrigin: '50% 60%'}}>
    <div style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 290, lineHeight: '300px', color: INK, letterSpacing: -6}}>
      why<span style={{color: RED}}>?</span>
    </div>
  </div>;
};
const Puzzled = ({x, y, t}: {x: number; y: number; t: number}) =>
  <div style={{position: 'absolute', left: x, top: y + Math.sin(t * 6) * 8, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 120, color: INK, transform: 'rotate(14deg)'}}>?</div>;
// Red hand-drawn arrow: draws itself on, points at America, then swings over to point at Venezuela.
const Arrow = ({x, y, t, swingAt}: {x: number; y: number; t: number; swingAt: number}) => {
  const draw = ease((t - 0.15) / 0.4), sw = t < swingAt ? 0 : cl((t - swingAt) / 0.35);
  const over = sw < 1 ? Math.sin(sw * Math.PI) * 12 : 0; // little overshoot while swinging
  const ang = 148 + (32 - 148) * ease(sw) - over;
  return <svg width={10} height={10} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <g transform={`rotate(${ang})`}>
      <path d="M0 0 Q 85 -34, 170 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />
      {draw > 0.9 && <path d="M170 0 L128 -26 M170 0 L130 30" fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />}
    </g>
  </svg>;
};
const Label = ({text, x, y, at, t}: {text: string; x: number; y: number; at: number; t: number}) => {
  const p = ease((t - at) / 0.25);
  return <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: text.length > 5 ? 64 : 80, color: INK, opacity: p, transform: `scale(${0.5 + 0.5 * p})`}}>{text}</div>;
};
const Vs = ({x, y, t}: {x: number; y: number; t: number}) => {
  const p = ease((t - 0.5) / 0.3);
  return <div style={{position: 'absolute', left: x - 75, top: y - 75, width: 150, height: 150, borderRadius: '50%', background: RED, border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 72, color: '#fff', transform: `scale(${p}) rotate(${-8 + Math.sin(t * 4) * 3}deg)`}}>VS</div>;
};

// ---------- sets ----------
const VE = P(1), SAME = P(2);
const Hook = ({t}: {t: number}) => {
  const lookR = t >= VE;
  return <>
    <Why t={t} />
    <Label text="USA" x={210} y={622} at={0.3} t={t} />
    <Label text="VENEZUELA" x={830} y={630} at={VE} t={t} />
    <FlagPump x={210} y={G + 120} price="$4.41" flag="us" top="#D83A2E" t={t} color={RED} fill={ease((t - 0.4) / 2)} />
    <FlagPump x={830} y={G + 120} price="$0.13" flag="ve" top="#F5C518" t={t} color={GREEN} fill={ease((t - VE) / 1.6)} />
    <Arrow x={540} y={512} t={t} swingAt={VE} />
    <Vs x={540} y={790} t={t} />
    <Puzzled x={392} y={830} t={t} />
    <Penguin id="doug" x={540} y={G + 60} h={470} pose={{turn: lookR ? 0.5 : -0.5, look: [lookR ? 0.8 : -0.8, -0.3], brows: lookR ? 'shock' : 'worried', eyeScale: lookR ? 1.25 : 1.05, pupil: lookR ? 0.5 : 1, beak: 'frown', flapR: 35, flapL: 35, sweat: lookR}} />
    <Stamp text="SAME GAS" x={540} y={1180} at={SAME} color={RED} size={96} />
  </>;
};

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [];

export const DougVenezuela = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side named (America, then Venezuela)
    const toUS = ease((tc - 0.3) / 0.6) * (tc < VE ? 1 : 0), toVE = ease((tc - VE) / 0.5) * (tc < SAME ? 1 : 0);
    s0 = 1 + 0.22 * (toUS + toVE); fx = 540 - 230 * toUS + 230 * toVE; fy = 960 + 40 * (toUS + toVE);
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, TIM);
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-venezuela-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={P(0) + 1.5} name="user-cash-register" vol={0.3} />
    <Sfx at={VE + 0.5} name="user-boom" vol={0.45} />
    <Sfx at={SAME} name="user-slap" vol={0.4} />
  </AbsoluteFill>;
};
