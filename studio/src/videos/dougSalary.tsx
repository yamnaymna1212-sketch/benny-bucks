// EP4 "Same Salary" — Doug vs his brother Ricky, same $70,000 salary, one stays poor, one becomes a millionaire.
// Hook layout = the user's reference (cash stack + salary above each character, names below). Hook first (approval).
// Line timings: studio/src/data/doug-salary.json (Kokoro am_fenrir, pauses squeezed to 0.1 s).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HAND, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {FishPile, Stamp} from '../penguin/world';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-salary.json';

const P = (i: number) => TIM[i].start;
export const DOUG_SALARY_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const RED = '#D83A2E', GREEN = '#2E9E4F';
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const pop = (t: number, at: number) => { const d = t - at; return d < 0 ? 0 : d < 0.15 ? 1.3 * ease(d / 0.15) : 1.3 - 0.3 * ease((d - 0.15) / 0.15); };
const POOR = P(1), RICH = P(2);

// Banded stack of green bills with three "shine" ticks above it.
const CashStack = ({x, y, w = 300}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={w * 0.75} viewBox="0 0 300 225" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.75, overflow: 'visible'}}>
    <path d="M150 20 L150 60 M95 40 L110 68 M205 40 L190 68" stroke={INK} strokeWidth={9} strokeLinecap="round" />
    {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(0 ${190 - i * 26})`}>
      <path d="M30 0 L250 0 L280 -22 L60 -22 Z" fill={i === 3 ? '#8FD18F' : '#5DAE5D'} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M30 0 L250 0 L250 22 L30 22 Z M250 0 L280 -22 L280 0 L250 22 Z" fill="#3F8F46" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    </g>)}
    <path d="M130 112 L170 112 L170 212 L130 212 Z M170 112 L184 102 L184 196 L170 212" fill="#E8D3A8" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <ellipse cx={155} cy={101} rx={40} ry={8} fill="#2F7A36" opacity={0.6} />
  </svg>;

// Side-view car. shiny = brand new (sparkles), otherwise old (dent, rust patch, mismatched door).
export const Car = ({x, y, w = 380, color = RED, shiny}: {x: number; y: number; w?: number; color?: string; shiny?: boolean}) =>
  <svg width={w} height={w * 0.5} viewBox="0 0 400 200" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.5, overflow: 'visible'}}>
    <path d="M20 140 L20 105 Q22 88 50 84 L110 78 L150 38 Q160 30 180 30 L270 30 Q290 30 300 42 L335 80 L365 86 Q385 92 385 112 L385 140 Z" fill={color} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M128 80 L160 46 L215 46 L215 80 Z M232 80 L232 46 L285 46 L316 80 Z" fill="#CFEAF8" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {!shiny && <path d="M215 84 L300 84 L300 138 L215 138 Z" fill="#8FA3B8" stroke={INK} strokeWidth={4} />}
    {!shiny && <path d="M60 110 q10 -8 20 0 q-6 10 -20 0 Z" fill="#B5652A" stroke={INK} strokeWidth={3} />}
    {!shiny && <path d="M330 100 q8 6 0 14" fill="none" stroke={INK} strokeWidth={4} />}
    <path d="M370 100 L384 100" stroke="#F7C531" strokeWidth={10} strokeLinecap="round" />
    {[100, 305].map((cx) => <g key={cx}><circle cx={cx} cy={142} r={34} fill={INK} /><circle cx={cx} cy={142} r={14} fill="#bbb" stroke={INK} strokeWidth={4} /></g>)}
    {shiny && [[60, 20], [360, 40], [200, 6]].map(([sx, sy], i) => <path key={i} transform={`translate(${sx} ${sy})`} d="M0 -18 L5 -5 L18 0 L5 5 L0 18 L-5 5 L-18 0 L-5 -5 Z" fill="#F7C531" stroke={INK} strokeWidth={3} />)}
  </svg>;

// Yellow baseball cap (Ricky's signature), brim to the viewer's left; (x, y) = bottom-centre of the crown.
const YellowCap = ({x, y, w = 250}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={w * 0.6} viewBox="0 0 250 150" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.48, overflow: 'visible'}}>
    <path d="M40 120 Q 40 20 135 18 Q 225 20 225 120 Z" fill="#F7C531" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M132 20 Q 120 70 128 120" fill="none" stroke={INK} strokeWidth={4} />
    <path d="M48 112 Q 0 112 -30 132 Q 20 146 60 132 Z" fill="#E0A912" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M40 120 L225 120" stroke={INK} strokeWidth={6} />
    <circle cx={134} cy={18} r={9} fill="#E0A912" stroke={INK} strokeWidth={4} />
  </svg>;

const Big = ({x, y, text, color = INK, s = 1, size = 92}: {x: number; y: number; text: string; color?: string; s?: number; size?: number}) =>
  <div style={{position: 'absolute', left: x - 300, width: 600, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, color, letterSpacing: -2, transform: `scale(${s})`, opacity: s > 0 ? 1 : 0}}>{text}</div>;

type Pose = React.ComponentProps<typeof Penguin>['pose'];
const Ricky = ({x, y, h = 590, pose = {}}: {x: number; y: number; h?: number; pose?: Pose}) => <>
  <Penguin x={x} y={y} h={h} id="ricky" seed={0.7} build="thin" outfit="banker" pose={{brows: 'happy', beak: 'smile', ...pose}} />
  <YellowCap x={x - 8} y={y - h * 0.81 - (pose?.hop ?? 0)} w={h * 0.42} />
</>;

// ---------- hook: same salary -> Doug's cash becomes a car payment, Ricky's cash becomes a fish mountain ----------
const L = 290, R = 790;
const Hook = ({t}: {t: number}) => {
  const out = ease((t - POOR) / 0.25), outR = ease((t - RICH) / 0.25), hop = t < RICH ? 0 : Math.abs(Math.sin((t - RICH) * 9)) * 30;
  return <>
    <div style={{opacity: 1 - out, transform: `translateY(${-160 * out}px)`}}><CashStack x={L} y={550} /><Big x={L} y={560} text="$70,000" /></div>
    <div style={{opacity: 1 - outR, transform: `translateY(${-160 * outR}px)`}}><CashStack x={R} y={550} /><Big x={R} y={560} text="$70,000" /></div>
    {t >= POOR && <div style={{position: 'absolute', inset: 0, transform: `scale(${pop(t, POOR)})`, transformOrigin: `${L}px 450px`}}><Car x={L} y={540} w={400} shiny /></div>}
    <Big x={L} y={570} text="$650/MONTH" color={RED} size={70} s={pop(t, POOR + 0.15)} />
    {t >= RICH && <FishPile x={R} y={540} n={Math.min(12, 3 + Math.floor((t - RICH) * 14))} w={170} seed={2} />}
    <Big x={R} y={570} text="$1,170,000" color={GREEN} size={86} s={pop(t, RICH + 0.2)} />
    <Penguin x={L} y={1290} h={560} id="doug" pose={t < POOR ? {turn: 0.35, look: [0.3, 0]}
      : {turn: 0.2, look: [0, -0.4], brows: 'worried', beak: 'frown', tears: true, flapL: 20, flapR: 20}} />
    <Ricky x={R} y={1290} pose={t < RICH ? {turn: -0.35, look: [-0.3, 0]} : {turn: -0.2, look: [0, -0.3], hop, flapL: 45, flapR: 45}} />
    <Big x={L} y={1320} text="Doug" size={84} />
    <Big x={R} y={1320} text="Ricky" size={84} />
    <Stamp text="POOR" x={L} y={1170} at={POOR + 0.3} color={RED} size={100} />
    <Stamp text="MILLIONAIRE" x={R} y={1170} at={RICH + 0.35} color={GREEN} size={74} rot={8} />
  </>;
};

export const DougSalary = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  // camera: push toward Doug on "stay poor", swing to Ricky on "millionaire", back to both after.
  const toL = ease((tc - POOR) / 0.3) * (tc < RICH ? 1 : 0), toR = ease((tc - RICH) / 0.3) * (tc < P(3) - 0.3 ? 1 : 0);
  const s = (1 + 0.22 * (toL + toR)) * beat(tc, TIM), fx = 540 - 250 * toL + 250 * toR, fy = 960 + 90 * (toL + toR);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}><Hook t={t} /></AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-salary-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.5} name="user-money" vol={0.3} />
    <Sfx at={POOR - 0.05} name="user-whoosh" vol={0.25} />
    <Sfx at={POOR + 0.15} name="user-cash-register" vol={0.3} />
    <Sfx at={POOR + 0.3} name="user-wrong" vol={0.3} />
    <Sfx at={RICH - 0.05} name="user-whoosh" vol={0.25} />
    <Sfx at={RICH + 0.2} name="user-boom" vol={0.45} />
    <Sfx at={RICH + 0.4} name="user-money-transfer" vol={0.3} />
  </AbsoluteFill>;
};

// Still of the opening frame (approved look), kept for thumbnails.
export const DougSalaryHook = () => <AbsoluteFill style={{background: '#fff'}}><Fonts /><HandFont /><Hook t={0} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 1500, textAlign: 'center', fontFamily: HAND, fontSize: 66, color: INK, transform: 'rotate(-2deg)'}}>two penguins make same salary…</div>
</AbsoluteFill>;
