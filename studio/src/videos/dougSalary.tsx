// EP4 "Same Salary" — Doug vs his brother Ricky, same $70,000 salary, one stays poor, one becomes a millionaire.
// Hook layout = the user's reference (cash stack + salary above each character, names below). Hook first (approval).
// Line timings: studio/src/data/doug-salary.json (Kokoro am_fenrir, pauses squeezed to 0.1 s).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Fx, cutFX} from '../penguin/acting';
import {FPS, Fonts, HAND, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {BigWord, IceBank, Paper, PriceTag, Stamp, Title} from '../penguin/world';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-salary.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
const G = 1300;
export const DOUG_SALARY_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 1.5) * 30) / 30;
const RED = '#D83A2E', GREEN = '#2E9E4F';
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const pop = (t: number, at: number) => { const d = t - at; return d < 0 ? 0 : d < 0.15 ? 1.3 * ease(d / 0.15) : 1.3 - 0.3 * ease((d - 0.15) / 0.15); };
const DRIVE = P(1), DREAM = P(1) + 0.75, JUNK = P(2); // supercar drives in to Doug, then Ricky's bike rolls in

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

// Dream supercar (no logo): low wedge body, tinted canopy, side intake, spoiler, big spoked rims. (x, y) = ground under its centre.
const SuperCar = ({x, y, w = 480, t = 0, spin = 0}: {x: number; y: number; w?: number; t?: number; spin?: number}) =>
  <svg width={w} height={w * 0.38} viewBox="0 0 600 228" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.38, overflow: 'visible'}}>
    <defs>
      <linearGradient id="scBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF4B3A" /><stop offset="0.55" stopColor="#D8231A" /><stop offset="1" stopColor="#8E1410" /></linearGradient>
      <linearGradient id="scGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3A4A5C" /><stop offset="1" stopColor="#11161C" /></linearGradient>
    </defs>
    <ellipse cx={300} cy={214} rx={280} ry={14} fill="rgba(0,0,0,0.22)" />
    <path d="M14 176 L18 150 Q24 128 70 120 L190 104 Q250 62 330 58 Q400 58 452 92 L540 112 Q584 120 590 150 L588 178 Q586 188 572 188 L14 188 Z" fill="url(#scBody)" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M206 104 Q258 70 330 68 Q392 68 440 98 L420 108 L222 112 Z" fill="url(#scGlass)" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M250 84 Q300 74 352 76" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.55} />
    <path d="M318 70 L312 110" stroke={INK} strokeWidth={4} />
    <path d="M60 132 Q260 116 560 128" fill="none" stroke="#FF8A7A" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
    <path d="M300 128 L380 124 L392 160 L316 162 Z" fill="#2A0A08" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    {[0, 1, 2].map((i) => <path key={i} d={`M${318 + i * 22} 134 L${328 + i * 22} 156`} stroke="#5A1A14" strokeWidth={4} />)}
    <path d="M520 104 L578 92 L582 104 L530 112 Z" fill="#8E1410" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M556 132 Q574 132 586 142 L560 146 Z" fill="#FFF3B0" stroke={INK} strokeWidth={4} />
    <path d="M18 150 L44 146 L42 160 L16 162 Z" fill="#FFD84A" stroke={INK} strokeWidth={4} />
    {[130, 470].map((cx) => <g key={cx}>
      <path d={`M${cx - 78} 186 Q${cx - 76} 118 ${cx} 116 Q${cx + 76} 118 ${cx + 78} 186 Z`} fill="#1A0605" />
      <circle cx={cx} cy={180} r={54} fill="#141414" stroke={INK} strokeWidth={5} />
      <circle cx={cx} cy={180} r={36} fill="#C9CDD2" stroke={INK} strokeWidth={4} />
      <g transform={`rotate(${spin} ${cx} 180)`}>{[0, 1, 2, 3, 4].map((k) => <path key={k} transform={`rotate(${k * 72} ${cx} 180)`} d={`M${cx - 6} 180 L${cx} 148 L${cx + 6} 180 Z`} fill="#8A9097" stroke={INK} strokeWidth={2} />)}</g>
      <circle cx={cx} cy={180} r={9} fill="#D8231A" stroke={INK} strokeWidth={3} />
    </g>)}
    {t > 0 && [[40, -10], [560, 20], [300, 30]].map(([sx, sy], i) => <path key={i} transform={`translate(${sx} ${sy}) scale(${0.7 + 0.3 * Math.sin(t * 8 + i)})`} d="M0 -22 L6 -6 L22 0 L6 6 L0 22 L-6 6 L-22 0 L-6 -6 Z" fill="#F7C531" stroke={INK} strokeWidth={3} />)}
  </svg>;

// City bike: diamond frame, spoked wheels (spin), saddle, handlebar, front basket. (x, y) = ground under its centre.
const Bike = ({x, y, w = 420, spin = 0}: {x: number; y: number; w?: number; spin?: number}) =>
  <svg width={w} height={w * 0.62} viewBox="0 0 420 260" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.62, overflow: 'visible'}}>
    <ellipse cx={210} cy={252} rx={200} ry={9} fill="rgba(0,0,0,0.18)" />
    {[95, 325].map((cx) => <g key={cx}>
      <circle cx={cx} cy={185} r={68} fill="none" stroke={INK} strokeWidth={12} />
      <circle cx={cx} cy={185} r={60} fill="none" stroke="#9AA0A6" strokeWidth={3} />
      <g transform={`rotate(${spin} ${cx} 185)`}>{Array.from({length: 12}, (_, k) => <path key={k} transform={`rotate(${k * 15} ${cx} 185)`} d={`M${cx} 125 L${cx} 245`} stroke="#9AA0A6" strokeWidth={2} />)}</g>
      <circle cx={cx} cy={185} r={9} fill="#555" stroke={INK} strokeWidth={3} />
    </g>)}
    <path d="M95 185 L175 185 L280 95 L150 95 Z M175 185 L150 95 M280 95 L325 185" fill="none" stroke="#2E8BC0" strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
    <path d="M150 95 L140 62 M118 56 Q140 48 166 56" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
    <path d="M280 95 L272 52 M250 44 Q268 40 286 50 Q300 56 296 70" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
    <path d="M296 62 L360 62 L352 106 L300 106 Z" fill="#C8A26A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {[312, 328, 344].map((xx) => <path key={xx} d={`M${xx} 64 L${xx - 2} 104`} stroke="#8B6A3A" strokeWidth={3} />)}
    <circle cx={175} cy={185} r={16} fill="#666" stroke={INK} strokeWidth={4} />
    <path d="M175 185 L190 212 L206 212" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
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
    fontSize: size, color, letterSpacing: -2, whiteSpace: 'nowrap', transform: `scale(${s})`, opacity: s > 0 ? 1 : 0}}>{text}</div>;

type Pose = React.ComponentProps<typeof Penguin>['pose'];
const Ricky = ({x, y, h = 590, pose = {}}: {x: number; y: number; h?: number; pose?: Pose}) => <>
  <Penguin x={x} y={y} h={h} id="ricky" seed={0.7} build="thin" outfit="banker" pose={{brows: 'happy', beak: 'smile', ...pose}} />
  <YellowCap x={x - 8} y={y - h * 0.81 - (pose?.hop ?? 0)} w={h * 0.42} />
</>;

// ---------- hook: same salary -> Doug's cash becomes a car payment, Ricky's cash becomes a fish mountain ----------
const L = 290, R = 790;
const Hook = ({t}: {t: number}) => {
  const out = ease((t - DRIVE) / 0.25), outR = ease((t - JUNK) / 0.25);
  const inD = ease((t - DRIVE) / (DREAM - DRIVE)), inJ = ease((t - JUNK) / 0.5);
  const hopD = t > DREAM ? Math.abs(Math.sin((t - DREAM) * 10)) * 40 : 0, shrug = t > JUNK + 0.45;
  return <>
    <div style={{opacity: 1 - out, transform: `translateY(${-160 * out}px)`}}><CashStack x={L} y={560} /><Big x={L} y={570} text="$70,000" /></div>
    <div style={{opacity: 1 - outR, transform: `translateY(${-160 * outR}px)`}}><CashStack x={R} y={560} /><Big x={R} y={570} text="$70,000" /></div>
    {t >= DRIVE && <>
      {inD < 1 && <div style={{position: 'absolute', left: L - 700 * (1 - inD) - 330, top: 440, width: 260, height: 100, opacity: 1 - inD}}>
        {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', top: i * 34, left: i * 30, width: 200, height: 8, borderRadius: 4, background: INK}} />)}</div>}
      <SuperCar x={L - 700 * (1 - inD)} y={560} w={500} t={t > DREAM ? t : 0} spin={inD * 1400} />
      <Big x={L} y={590} text="$44,000" color={RED} size={100} s={pop(t, DREAM)} />
    </>}
    {t >= JUNK && <>
      <Bike x={R + 700 * (1 - inJ)} y={560} w={400} spin={inJ * 1100} />
      <Big x={R} y={590} text="$400" color={GREEN} size={100} s={pop(t, JUNK + 0.4)} />
    </>}
    <Penguin x={L} y={1290 - hopD} h={560} id="doug" pose={t < DREAM ? {turn: 0.35, look: [t >= DRIVE ? -0.6 : 0.3, 0]}
      : {turn: 0.2, look: [0, -0.6], brows: 'happy', beak: 'smile', blush: 1, eyeScale: 1.2, flapL: 120, flapR: 120}} />
    <Ricky x={R} y={1290} pose={t < JUNK ? {turn: -0.35, look: [-0.3, 0]} : shrug ? {turn: -0.1, look: [0, -0.6], flapL: 70, flapR: 70, brows: 'worried', beak: 'flat'} : {turn: -0.2, look: [0.6, -0.4]}} />
  </>;
};

// ---------- more props ----------
// Stock price board: green line climbing (up) or red line falling (down), drawn on over 1.2 s.
const StockBoard = ({x, y, w = 460, t, at = -99, down}: {x: number; y: number; w?: number; t: number; at?: number; down?: boolean}) => {
  const up = [[30, 250], [90, 210], [140, 225], [200, 160], [260, 175], [320, 100], [380, 60]];
  const pts = down ? up.map(([px, py]) => [px, 310 - py]) : up, c = down ? '#FF5A4E' : '#4CD964', end = pts[pts.length - 1];
  const p = ease((t - at) / 1.2), n = Math.max(2, Math.ceil(p * pts.length));
  return <svg width={w} height={w * 0.75} viewBox="0 0 420 315" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.75, overflow: 'visible'}}>
    <rect x={5} y={5} width={410} height={290} rx={16} fill="#1F2A36" stroke={INK} strokeWidth={7} />
    {[80, 140, 200, 260].map((yy) => <path key={yy} d={`M20 ${yy} L400 ${yy}`} stroke="#3A4C5E" strokeWidth={3} />)}
    <polyline points={pts.slice(0, n).map((q) => q.join(' ')).join(' ')} fill="none" stroke={c} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
    {p > 0.95 && <path d={down ? `M${end[0]} ${end[1]} L${end[0] - 30} ${end[1] - 2} M${end[0]} ${end[1]} L${end[0] - 8} ${end[1] - 28}` : `M${end[0]} ${end[1]} L${end[0] - 30} ${end[1] + 2} M${end[0]} ${end[1]} L${end[0] - 8} ${end[1] + 28}`} stroke={c} strokeWidth={10} strokeLinecap="round" />}
    <text x={210} y={-18} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={54} fill={INK}>STOCKS</text>
    <rect x={190} y={295} width={40} height={60} fill="#8B5A2B" stroke={INK} strokeWidth={5} />
  </svg>;
};
const Counter = ({x, y, t, at, from = 0, to, dur = 1.2, color = GREEN, size = 150, prefix = '$', suffix = ''}: {x: number; y: number; t: number; at: number; from?: number; to: number; dur?: number; color?: string; size?: number; prefix?: string; suffix?: string}) =>
  t < at ? null : <Big x={x} y={y} text={prefix + Math.round(from + (to - from) * ease((t - at) / dur)).toLocaleString('en-US') + suffix} color={color} size={size} />;
const Ground = ({snow}: {snow?: boolean}) => <div style={{position: 'absolute', left: -600, right: -600, top: G, height: 700, background: snow ? '#F4F9FD' : '#EEF6FB', borderTop: `5px solid ${INK}`}} />;
const Snow = ({t, n = 26}: {t: number; n?: number}) => <>{Array.from({length: n}, (_, i) => { const sp = 120 + (i * 53) % 90, x0 = (i * 211) % 1180 - 50;
  return <div key={i} style={{position: 'absolute', left: x0 + Math.sin(t * 2 + i) * 30, top: ((t * sp + i * 97) % 1500) - 100, width: 16 + (i % 3) * 6, height: 16 + (i % 3) * 6, borderRadius: '50%', background: '#fff', border: `3px solid ${INK}`}} />; })}</>;
const Doug = ({x, y = G + 20, h = 560, pose = {}}: {x: number; y?: number; h?: number; pose?: Pose}) => <Penguin x={x} y={y} h={h} id="doug" pose={pose} />;
const Close = ({who, pose}: {who: 'doug' | 'ricky'; pose: Pose}) => who === 'doug'
  ? <Penguin id="doug" x={540} y={G + 380} h={1000} pose={pose} /> : <Ricky x={540} y={G + 380} h={1000} pose={pose} />;
// Green dollar bills flying along an arc (payments / investing), n bills spread over [a, b].
const Bills = ({x1, y1, x2, y2, t, a, b, n = 3}: {x1: number; y1: number; x2: number; y2: number; t: number; a: number; b: number; n?: number}) => <>{Array.from({length: n}, (_, i) => {
  const d = (b - a) / n, p = (t - a - i * d) / (d * 0.9); if (p < 0 || p > 1) return null;
  return <div key={i} style={{position: 'absolute', left: x1 + (x2 - x1) * p - 55, top: y1 + (y2 - y1) * p - Math.sin(p * Math.PI) * 260 - 28, width: 110, height: 56, background: '#5DAE5D', border: `5px solid ${INK}`, borderRadius: 8,
    transform: `rotate(${p * 360}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, color: '#1E5E24'}}>$</div>; })}</>;
const Bank = ({x, y = G, w = 480}: {x: number; y?: number; w?: number}) => <IceBank x={x} y={y} w={w} />;
const Office = ({x, y = G, w = 340}: {x: number; y?: number; w?: number}) =>
  <svg width={w} height={w * 1.5} viewBox="0 0 340 510" style={{position: 'absolute', left: x - w / 2, top: y - w * 1.5, overflow: 'visible'}}>
    <rect x={20} y={60} width={300} height={450} fill="#DCE6EE" stroke={INK} strokeWidth={6} />
    {Array.from({length: 12}, (_, i) => <rect key={i} x={50 + (i % 3) * 90} y={100 + Math.floor(i / 3) * 90} width={60} height={56} fill="#9FC9E8" stroke={INK} strokeWidth={4} />)}
    <rect x={130} y={440} width={80} height={70} fill="#5A6B7A" stroke={INK} strokeWidth={5} />
    <rect x={70} y={6} width={200} height={54} rx={8} fill="#fff" stroke={INK} strokeWidth={5} />
    <text x={170} y={46} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={38} fill={INK}>WORK</text>
  </svg>;
const Source = ({text}: {text: string}) => <div style={{position: 'absolute', left: 0, right: 0, top: 1430, textAlign: 'center', fontFamily: HAND, fontSize: 34, color: '#888'}}>{text}</div>;
const Speed = ({x, y}: {x: number; y: number}) => <>{[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: x - 300 - i * 30, top: y + i * 40, width: 220, height: 9, borderRadius: 5, background: INK}} />)}</>;

// ---------- shots (one line = one shot) ----------
const Brothers = ({t}: {t: number}) => <><Ground /><Doug x={300} pose={{turn: 0.4, beak: 'smile', flapR: 60}} /><Ricky x={780} y={G + 20} pose={{turn: -0.4, flapL: 60, beak: 'smile'}} />
  <BigWord text="Doug" x={300} y={500} at={P(3)} size={110} /><BigWord text="Ricky" x={780} y={500} at={P(3) + 0.8} size={110} /></>;
const SameJob = () => <><Paper x={290} y={700} w={330} title="PAYCHECK" amount="$70,000" at={P(4)} rot={-6} id="pc1" /><Paper x={790} y={700} w={330} title="PAYCHECK" amount="$70,000" at={P(4) + 0.3} rot={6} id="pc2" />
  <BigWord text="=" x={540} y={700} at={P(4) + 0.6} size={200} /><Doug x={290} y={G + 150} h={460} /><Ricky x={790} y={G + 150} h={480} /></>;
const Salary = ({t}: {t: number}) => <><CashStack x={540} y={720} w={480} /><Counter x={540} y={760} t={t} at={P(5)} to={70000} dur={0.9} size={170} color={INK} /><BigWord text="a year" x={540} y={1080} at={P(5) + 0.9} size={100} /></>;
const ToWork = ({t}: {t: number}) => <><Ground /><Office x={880} /><Doug x={190} pose={{turn: 0.6, look: [0.8, -0.2]}} /><Ricky x={520} y={G + 20} pose={{turn: 0.6, look: [0.8, -0.2]}} />
  <BigWord text="?" x={350} y={600} at={P(6) + 0.3} size={150} /></>;
const BuyCar = ({t}: {t: number}) => <><Ground /><SuperCar x={620} y={G + 10} w={680} t={t} /><Doug x={170} pose={{turn: 0.6, look: [0.7, 0], eyeScale: 1.2, beak: 'smile', blush: 1, flapR: 90}} />
  <PriceTag x={620} y={600} price="$44,000" at={P(7) + 1.2} /></>;
const Loan = () => <><Ground /><Bank x={720} w={560} /><Doug x={220} pose={{turn: 0.6, look: [0.8, 0]}} /><Paper x={440} y={700} w={260} title="LOAN" at={P(8) + 0.2} id="loan" /></>;
const Monthly = ({t}: {t: number}) => <><Ground /><Bank x={800} w={440} /><Doug x={200} pose={{turn: 0.6, flapR: 70}} /><Bills x1={260} y1={G - 300} x2={780} y2={G - 250} t={t} a={P(9)} b={E(9)} n={4} />
  <Counter x={540} y={330} t={t} at={P(9) + 0.3} to={650} dur={0.7} color={RED} size={170} /><BigWord text="every month" x={540} y={600} at={P(9) + 1.2} size={90} /></>;
const Years = ({t}: {t: number}) => <><BigWord text="7 years" x={540} y={480} at={P(10)} size={150} color={RED} /><Counter x={540} y={700} t={t} at={P(10)} from={1} to={84} dur={0.9} prefix="month " color={INK} size={110} /></>;
const Drive = ({t}: {t: number}) => <><Ground snow /><Snow t={t} /><Speed x={300} y={G - 220} />
  <div style={{transform: `translateY(${Math.sin(t * 30) * 2}px)`}}><Doug x={600} y={G - 120} h={300} pose={{beak: 'smile', brows: 'happy', lids: 0.3}} /><SuperCar x={560} y={G + 10} w={640} spin={t * 900} /></div>
  <BigWord text="fast" x={330} y={520} at={P(11)} size={110} /><BigWord text="warm" x={760} y={520} at={P(11) + 0.8} size={110} color={RED} /></>;
const DougHappy = ({t}: {t: number}) => <><Close who="doug" pose={{beak: 'smile', brows: 'happy', lids: 0.3, blush: 1, flapL: 120, flapR: 120}} />
  {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 200, top: 360 + (i % 2) * 120 + Math.sin(t * 6 + i) * 20, fontSize: 90}}>✨</div>)}</>;
const BuyBike = () => <><Ground /><Bike x={640} y={G + 10} w={560} /><Ricky x={200} y={G + 20} pose={{turn: 0.6, look: [0.7, 0], beak: 'smile'}} />
  <PriceTag x={640} y={560} price="$400" color={GREEN} at={P(13) + 1.2} /><Stamp text="CASH" x={640} y={880} at={P(13) + 2.2} size={110} /></>;
const Cheap = () => <><Ground /><Bike x={680} y={G + 10} w={500} /><Ricky x={260} y={G + 20} h={640} pose={{turn: 0.4, beak: 'smile', brows: 'happy', flapR: 100}} />
  <BigWord text="cheap" x={540} y={520} at={P(14)} size={130} color={GREEN} /></>;
const SlowCold = ({t}: {t: number}) => { const x = 200 + (t - P(15)) * 70;
  return <><Ground snow /><Snow t={t} n={40} /><Bike x={x} y={G + 10} w={420} spin={t * 120} /><Ricky x={x - 10} y={G - 130} h={320} pose={{brows: 'worried', tremble: 0.6, look: [0.5, 0]}} />
    <BigWord text="slow" x={300} y={480} at={P(15) + 0.4} size={110} /><BigWord text="cold" x={760} y={480} at={P(15) + 1.3} size={110} color="#2E8BC0" /></>; };
const Freezing = ({t}: {t: number}) => <><div style={{position: 'absolute', inset: -300, background: '#DDEEFF'}} /><Snow t={t} n={34} />
  <Close who="ricky" pose={{brows: 'worried', beak: 'frown', tremble: 1.4, lids: 0.2}} /></>;
const Invest = ({t}: {t: number}) => <><Ground /><StockBoard x={700} y={G - 120} t={t} at={P(17) + 0.4} /><Ricky x={200} y={G + 20} pose={{turn: 0.6, flapR: 80}} />
  <Bills x1={260} y1={G - 300} x2={660} y2={G - 380} t={t} a={P(17) + 0.2} b={E(17)} n={4} /><BigWord text="every month" x={540} y={330} at={P(17) + 1.6} size={86} /></>;
const Up = ({t}: {t: number}) => <><StockBoard x={540} y={1180} w={680} t={t} at={P(18)} /><BigWord text="up" x={540} y={360} at={P(18) + 0.3} size={150} color={GREEN} /></>;
const Down = ({t}: {t: number}) => <><StockBoard x={540} y={1180} w={680} t={t} at={P(19)} down /><BigWord text="down" x={540} y={360} at={P(19) + 0.3} size={150} color={RED} /></>;
const Grow = ({t}: {t: number}) => { const n = Math.min(5, 1 + Math.floor((t - P(20)) * 3));
  return <>{Array.from({length: n}, (_, i) => <CashStack key={i} x={540 + ((i % 3) - 1) * 300} y={1150 - Math.floor(i / 3) * 280} w={280} />)}<BigWord text="money makes money" x={540} y={420} at={P(20) + 0.3} size={90} color={GREEN} /></>; };
const CalledCI = () => <Title lines={['compound', 'interest']} y={800} at={P(21)} size={140} />;
const LoseValue = ({t}: {t: number}) => { const y = Math.min(7, 1 + Math.floor((t - P(22)) * 4));
  return <><Ground /><SuperCar x={540} y={G + 10} w={680} /><Big x={540} y={430} text={`year ${y}`} size={100} /><BigWord text="value ↓" x={540} y={700} at={P(22) + 0.5} size={120} color={RED} /></>; };
const CalledDep = () => <Title lines={['depreciation']} y={800} at={P(23)} size={130} />;
const RealLife = () => <><BigWord text="real life" x={540} y={330} at={P(24)} size={110} /><Paper x={540} y={760} w={380} title="NEW CAR LOAN" amount="$44,000" at={P(24) + 1.5} id="rl" />
  <Source text="Experian Q1 2026 · avg new-car loan $43,925 at 6.39%" /></>;
const Rate = () => <><BigWord text="≈ 6%" x={540} y={720} at={P(25)} size={260} color={RED} /><BigWord text="interest" x={540} y={1000} at={P(25) + 0.3} size={100} /></>;
const PaidOff = ({t}: {t: number}) => <><Ground /><Bank x={800} w={440} /><Doug x={220} pose={{turn: 0.6, beak: 'smile', lids: 0.3}} /><Bills x1={260} y1={G - 300} x2={780} y2={G - 250} t={t} a={P(26)} b={P(26) + 0.8} n={1} />
  <BigWord text="year 7" x={540} y={360} at={P(26)} size={100} /><Stamp text="PAID OFF" x={540} y={640} at={P(26) + 1.2} size={90} rot={-8} /></>;
const OwnCar = ({t}: {t: number}) => <><Ground /><SuperCar x={640} y={G + 10} w={600} t={t} /><Doug x={200} pose={{turn: 0.6, beak: 'smile', blush: 1, flapR: 110}} /><BigWord text="Doug's car" x={640} y={520} at={P(27)} size={100} /></>;
const IfGrow = ({t}: {t: number}) => <><StockBoard x={540} y={1050} w={620} t={t} at={P(28)} /><BigWord text="if ≈7% a year" x={540} y={360} at={P(28) + 0.3} size={110} color={GREEN} />
  <Source text="assumption — stocks can also go down" /></>;
const Have = ({t}: {t: number}) => <><Counter x={540} y={420} t={t} at={P(29) + 0.6} to={70199} dur={1} size={160} /><CashStack x={330} y={1150} w={300} /><CashStack x={750} y={1150} w={300} />
  <Ricky x={540} y={G + 60} h={420} pose={{beak: 'smile'}} /></>;
const IfFall = ({t}: {t: number}) => { const cut = ease((t - P(30) - 0.6) / 0.3);
  return <><StockBoard x={540} y={1220} w={620} t={t} at={P(30)} down /><Big x={540} y={300} text="$70,199" color={INK} size={130} />
    <div style={{position: 'absolute', left: 230, top: 375, width: 620 * cut, height: 14, background: RED, transform: 'rotate(-6deg)', borderRadius: 7}} />
    <BigWord text="less" x={540} y={560} at={P(30) + 0.8} size={120} color={RED} /></>; };
const SameSalary = () => <><Ground /><Doug x={290} /><Ricky x={790} y={G + 20} /><CashStack x={290} y={560} /><Big x={290} y={570} text="$70,000" /><CashStack x={790} y={560} /><Big x={790} y={570} text="$70,000" /></>;
const Choices = ({t}: {t: number}) => <><Ground /><SuperCar x={290} y={660} w={440} t={t} /><Bike x={790} y={660} w={340} /><Doug x={290} h={480} /><Ricky x={790} y={G + 20} h={500} />
  <Big x={290} y={240} text="$44,000" color={RED} size={90} /><Big x={790} y={240} text="$400" color={GREEN} size={90} /></>;
const Numbers = ({t}: {t: number}) => <><Ground /><SuperCar x={290} y={660} w={440} /><Bike x={790} y={660} w={340} /><Doug x={290} h={480} /><Ricky x={790} y={G + 20} h={500} />
  <Big x={290} y={240} text="$650/mo" color={RED} size={80} /><Big x={790} y={240} text="$650/mo" color={GREEN} size={80} />
  <BigWord text="car" x={290} y={400} at={P(33)} size={70} /><BigWord text="stocks" x={790} y={400} at={P(33) + 0.3} size={70} /></>;

type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(3), set: (t) => <Brothers t={t} />, fx_: 'swipe'},
  {at: P(4), set: () => <SameJob />, fx_: 'zoom'},
  {at: P(5), set: (t) => <Salary t={t} />, fx_: 'pop'},
  {at: P(6), set: (t) => <ToWork t={t} />, fx_: 'swipeL'},
  {at: P(7), set: (t) => <BuyCar t={t} />, fx_: 'iris'},
  {at: P(8), set: () => <Loan />, fx_: 'pop'},
  {at: P(9), set: (t) => <Monthly t={t} />, fx_: 'swipe'},
  {at: P(10), set: (t) => <Years t={t} />, fx_: 'zoom'},
  {at: P(11), set: (t) => <Drive t={t} />, fx_: 'swipeL'},
  {at: P(12), set: (t) => <DougHappy t={t} />, fx_: 'pop'},
  {at: P(13), set: () => <BuyBike />, fx_: 'iris'},
  {at: P(14), set: () => <Cheap />, fx_: 'pop'},
  {at: P(15), set: (t) => <SlowCold t={t} />, fx_: 'swipe'},
  {at: P(16), set: (t) => <Freezing t={t} />, fx_: 'zoom'},
  {at: P(17), set: (t) => <Invest t={t} />, fx_: 'swipeL'},
  {at: P(18), set: (t) => <Up t={t} />, fx_: 'pop'},
  {at: P(19), set: (t) => <Down t={t} />, fx_: 'pop'},
  {at: P(20), set: (t) => <Grow t={t} />, fx_: 'zoom'},
  {at: P(21), set: () => <CalledCI />, fx_: 'pop'},
  {at: P(22), set: (t) => <LoseValue t={t} />, fx_: 'iris'},
  {at: P(23), set: () => <CalledDep />, fx_: 'pop'},
  {at: P(24), set: () => <RealLife />, fx_: 'swipe'},
  {at: P(25), set: () => <Rate />, fx_: 'pop'},
  {at: P(26), set: (t) => <PaidOff t={t} />, fx_: 'swipeL'},
  {at: P(27), set: (t) => <OwnCar t={t} />, fx_: 'pop'},
  {at: P(28), set: (t) => <IfGrow t={t} />, fx_: 'zoom'},
  {at: P(29), set: (t) => <Have t={t} />, fx_: 'pop'},
  {at: P(30), set: (t) => <IfFall t={t} />, fx_: 'swipe'},
  {at: P(31), set: () => <SameSalary />, fx_: 'iris'},
  {at: P(32), set: (t) => <Choices t={t} />, fx_: 'pop'},
  {at: P(33), set: (t) => <Numbers t={t} />, fx_: 'zoom'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[7, 560, 1050, 1.3], [9, 540, 700, 1.25], [13, 520, 1050, 1.3], [15, 540, 1000, 1.25],
  [17, 560, 1000, 1.25], [22, 540, 1050, 1.25], [11, 540, 1000, 1.2], [29, 540, 800, 1.3]];

export const DougSalary = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) {
    // push in on Doug as the supercar arrives, swing over to Ricky's bike, settle on both
    const toL = ease((tc - DRIVE) / 0.3) * (tc < JUNK ? 1 : 0), toR = ease((tc - JUNK) / 0.3) * (tc < P(3) - 0.25 ? 1 : 0);
    s0 = 1 + 0.3 * (toL + toR); fx = 540 - 250 * toL + 250 * toR; fy = 960 - 120 * (toL + toR);
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
    <Audio src={staticFile('doug-salary-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.5} name="user-money" vol={0.3} />
    <Sfx at={DRIVE - 0.05} name="user-whoosh" vol={0.35} />
    <Sfx at={DRIVE} name="swoosh-fast" vol={0.35} />
    <Sfx at={DREAM} name="user-boom" vol={0.45} />
    <Sfx at={DREAM + 0.05} name="user-cash-register" vol={0.3} />
    <Sfx at={DREAM + 0.1} name="user-wow" vol={0.3} />
    <Sfx at={JUNK - 0.05} name="user-whoosh" vol={0.3} />
    <Sfx at={JUNK + 0.4} name="user-ting" vol={0.35} />
    <Sfx at={JUNK + 0.45} name="user-money" vol={0.3} />
    <Sfx at={P(3)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(3) + 0.8} name="penguin-honk" vol={0.35} />
    <Sfx at={P(4) + 0.6} name="user-pop" vol={0.3} />
    <Sfx at={P(5)} name="user-money" vol={0.3} />
    <Sfx at={P(6) + 0.3} name="user-notif" vol={0.3} />
    <Sfx at={P(7) + 1.2} name="user-cash-register" vol={0.35} />
    <Sfx at={P(8) + 0.2} name="user-notif2" vol={0.3} />
    <Sfx at={P(9) + 0.3} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(10)} name="user-timer" vol={0.3} />
    <Sfx at={P(11)} name="swoosh-fast" vol={0.35} />
    <Sfx at={P(12)} name="user-yeah" vol={0.35} />
    <Sfx at={P(13) + 1.2} name="user-cash-register" vol={0.3} />
    <Sfx at={P(13) + 2.2} name="user-slap" vol={0.3} />
    <Sfx at={P(14)} name="user-ting" vol={0.3} />
    <Sfx at={P(15) + 1.3} name="user-wrong" vol={0.3} />
    <Sfx at={P(16)} name="user-shock" vol={0.35} />
    <Sfx at={P(17) + 0.2} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(18) + 0.3} name="user-wow" vol={0.35} />
    <Sfx at={P(19) + 0.3} name="user-wrong" vol={0.35} />
    <Sfx at={P(20) + 0.3} name="user-pop" vol={0.3} />
    <Sfx at={P(21)} name="user-ting" vol={0.35} />
    <Sfx at={P(22) + 0.5} name="user-wrong" vol={0.3} />
    <Sfx at={P(23)} name="user-ting" vol={0.35} />
    <Sfx at={P(24) + 1.5} name="user-notif" vol={0.3} />
    <Sfx at={P(25)} name="user-boom" vol={0.4} />
    <Sfx at={P(26) + 1.2} name="user-slap" vol={0.35} />
    <Sfx at={P(27)} name="user-yeah" vol={0.3} />
    <Sfx at={P(28) + 0.3} name="user-wow" vol={0.3} />
    <Sfx at={P(29) + 0.6} name="user-cash-register" vol={0.35} />
    <Sfx at={P(30) + 0.5} name="user-wrong" vol={0.35} />
    <Sfx at={P(31)} name="user-money" vol={0.3} />
    <Sfx at={P(32)} name="user-pop" vol={0.3} />
    <Sfx at={P(33)} name="user-boom" vol={0.35} />
  </AbsoluteFill>;
};

// Still of the opening frame (approved look), kept for thumbnails.
export const DougSalaryHook = () => <AbsoluteFill style={{background: '#fff'}}><Fonts /><HandFont /><Hook t={0} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 1500, textAlign: 'center', fontFamily: HAND, fontSize: 66, color: INK, transform: 'rotate(-2deg)'}}>two penguins make same salary…</div>
</AbsoluteFill>;
