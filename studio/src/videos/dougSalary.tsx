// EP4 "Same Salary" — Doug vs his brother Ricky, same $70,000 salary, one stays poor, one becomes a millionaire.
// Hook layout = the user's reference (cash stack + salary above each character, names below). Hook first (approval).
// Line timings: studio/src/data/doug-salary.json (Kokoro am_fenrir, pauses squeezed to 0.1 s).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Fx, cutFX} from '../penguin/acting';
import {FPS, Fonts, HAND, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {BigWord, FishFlight, FishPile, IceBank, Paper, PriceTag, Stamp, Title} from '../penguin/world';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-salary.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
const G = 1300;
export const DOUG_SALARY_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 1.5) * 30) / 30;
const RED = '#D83A2E', GREEN = '#2E9E4F';
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const pop = (t: number, at: number) => { const d = t - at; return d < 0 ? 0 : d < 0.15 ? 1.3 * ease(d / 0.15) : 1.3 - 0.3 * ease((d - 0.15) / 0.15); };
const DREAM = P(1) + 0.8, USED = P(1) + 1.4; // dream car -> Doug's car pops; then Ricky's used car

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
    fontSize: size, color, letterSpacing: -2, whiteSpace: 'nowrap', transform: `scale(${s})`, opacity: s > 0 ? 1 : 0}}>{text}</div>;

type Pose = React.ComponentProps<typeof Penguin>['pose'];
const Ricky = ({x, y, h = 590, pose = {}}: {x: number; y: number; h?: number; pose?: Pose}) => <>
  <Penguin x={x} y={y} h={h} id="ricky" seed={0.7} build="thin" outfit="banker" pose={{brows: 'happy', beak: 'smile', ...pose}} />
  <YellowCap x={x - 8} y={y - h * 0.81 - (pose?.hop ?? 0)} w={h * 0.42} />
</>;

// ---------- hook: same salary -> Doug's cash becomes a car payment, Ricky's cash becomes a fish mountain ----------
const L = 290, R = 790;
const Hook = ({t}: {t: number}) => {
  const out = ease((t - DREAM) / 0.25), outR = ease((t - USED) / 0.25);
  return <>
    <div style={{opacity: 1 - out, transform: `translateY(${-160 * out}px)`}}><CashStack x={L} y={550} /><Big x={L} y={560} text="$70,000" /></div>
    <div style={{opacity: 1 - outR, transform: `translateY(${-160 * outR}px)`}}><CashStack x={R} y={550} /><Big x={R} y={560} text="$70,000" /></div>
    {t >= DREAM && <div style={{position: 'absolute', inset: 0, transform: `scale(${pop(t, DREAM)})`, transformOrigin: `${L}px 450px`}}><Car x={L} y={540} w={420} shiny /></div>}
    {t >= DREAM + 0.2 && <div style={{position: 'absolute', left: L + 120, top: 250 + Math.sin(t * 5) * 12, fontSize: 90, transform: `scale(${pop(t, DREAM + 0.2)})`}}>❤️</div>}
    <Big x={L} y={570} text="$44,000" color={RED} size={96} s={pop(t, DREAM + 0.15)} />
    {t >= USED && <div style={{position: 'absolute', inset: 0, transform: `scale(${pop(t, USED)})`, transformOrigin: `${R}px 450px`}}><Car x={R} y={540} w={380} color="#5B8DB8" /></div>}
    <Big x={R} y={570} text="$10,000" color={GREEN} size={96} s={pop(t, USED + 0.15)} />
    <Penguin x={L} y={1290} h={560} id="doug" pose={t < DREAM ? {turn: 0.35, look: [0.3, 0]}
      : {turn: 0.2, look: [0, -0.5], brows: 'happy', beak: 'smile', blush: 1, eyeScale: 1.15, flapL: 80, flapR: 80}} />
    <Ricky x={R} y={1290} pose={t < USED ? {turn: -0.35, look: [-0.3, 0]} : {turn: -0.2, look: [0, -0.4], flapR: 30}} />
    <Big x={L} y={1320} text="Doug" size={84} />
    <Big x={R} y={1320} text="Ricky" size={84} />
    {t >= P(0) + 0.3 && t < P(1) && <Big x={540} y={170} text="SAME SALARY" size={84} s={pop(t, P(0) + 0.3)} />}
  </>;
};

// ---------- more props ----------
const StockBoard = ({x, y, w = 460, t, at = -99}: {x: number; y: number; w?: number; t: number; at?: number}) => {
  const p = ease((t - at) / 1.2), pts = [[30, 250], [90, 210], [140, 225], [200, 160], [260, 175], [320, 100], [380, 60]];
  const n = Math.max(2, Math.ceil(p * pts.length));
  return <svg width={w} height={w * 0.75} viewBox="0 0 420 315" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.75, overflow: 'visible'}}>
    <rect x={5} y={5} width={410} height={290} rx={16} fill="#1F2A36" stroke={INK} strokeWidth={7} />
    {[80, 140, 200, 260].map((yy) => <path key={yy} d={`M20 ${yy} L400 ${yy}`} stroke="#3A4C5E" strokeWidth={3} />)}
    <polyline points={pts.slice(0, n).map((q) => q.join(' ')).join(' ')} fill="none" stroke="#4CD964" strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
    {p > 0.95 && <path d="M380 60 L350 62 M380 60 L372 88" stroke="#4CD964" strokeWidth={10} strokeLinecap="round" />}
    <text x={210} y={-18} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={54} fill={INK}>STOCKS</text>
    <rect x={190} y={295} width={40} height={60} fill="#8B5A2B" stroke={INK} strokeWidth={5} />
  </svg>;
};
const Smoke = ({x, y, t}: {x: number; y: number; t: number}) => <>{[0, 1, 2, 3, 4].map((i) => { const ph = (t * 0.8 + i * 0.2) % 1;
  return <div key={i} style={{position: 'absolute', left: x - 50 + Math.sin(i * 2 + t) * 30, top: y - ph * 320, width: 100 + ph * 90, height: 100 + ph * 90, marginLeft: -ph * 45,
    borderRadius: '50%', background: '#9AA0A6', border: `5px solid ${INK}`, opacity: 0.85 - ph * 0.7}} />; })}</>;
const Counter = ({x, y, t, at, to, dur = 1.2, color = GREEN, size = 150, prefix = '$'}: {x: number; y: number; t: number; at: number; to: number; dur?: number; color?: string; size?: number; prefix?: string}) =>
  t < at ? null : <Big x={x} y={y} text={prefix + Math.round(to * ease((t - at) / dur)).toLocaleString('en-US')} color={color} size={size} />;
const Ground = () => <div style={{position: 'absolute', left: -600, right: -600, top: G, height: 700, background: '#EEF6FB', borderTop: `5px solid ${INK}`}} />;
const Doug = ({x, y = G + 20, h = 560, pose = {}}: {x: number; y?: number; h?: number; pose?: Pose}) => <Penguin x={x} y={y} h={h} id="doug" pose={pose} />;
const Close = ({who, pose}: {who: 'doug' | 'ricky'; pose: Pose}) => who === 'doug'
  ? <Penguin id="doug" x={540} y={G + 380} h={1000} pose={pose} /> : <Ricky x={540} y={G + 380} h={1000} pose={pose} />;
const flights = (x1: number, y1: number, x2: number, y2: number, a: number, b: number, n = 3, seed = 0) =>
  Array.from({length: n}, (_, i) => { const d = (b - a) / n; return <FishFlight key={i} x1={x1} y1={y1} x2={x2} y2={y2} a={a + i * d} b={a + i * d + d * 0.9} n={2} w={90} seed={seed + i} arc={260} />; });

// ---------- shots (one line = one shot) ----------
const Intro = ({t}: {t: number}) => <><Ground /><Doug x={540} h={720} pose={{flapR: 90 + Math.sin(t * 8) * 15, beak: 'smile'}} /><BigWord text="DOUG" x={540} y={420} at={P(3)} size={150} /></>;
const Brother = ({t}: {t: number}) => <><Ground /><Doug x={330} pose={{turn: 0.4, beak: 'smile'}} /><Ricky x={760} y={G + 20} pose={{turn: -0.4, flapL: 60}} />
  <BigWord text="RICKY" x={760} y={420} at={P(4)} size={140} /><BigWord text="brothers" x={540} y={600} at={P(4) + 0.6} size={80} color={RED} rot={4} /></>;
const SameJob = ({t}: {t: number}) => <><Paper x={290} y={760} w={330} title="PAYCHECK" amount="$70,000" at={P(5)} rot={-6} id="pc1" /><Paper x={790} y={760} w={330} title="PAYCHECK" amount="$70,000" at={P(5) + 0.3} rot={6} id="pc2" />
  <BigWord text="=" x={540} y={760} at={P(5) + 0.6} size={200} /><Doug x={290} y={G + 150} h={460} /><Ricky x={790} y={G + 150} h={480} /></>;
const NeedCar = ({t}: {t: number}) => <><Ground /><Doug x={300} pose={{look: [0.2, -0.8]}} /><Ricky x={780} y={G + 20} pose={{look: [-0.2, -0.8]}} />
  <div style={{transform: `translateY(${Math.sin(t * 4) * 10}px)`}}><Car x={540} y={560} w={420} color="#bbb" /></div><BigWord text="?" x={300} y={680} at={P(6) + 0.2} size={130} /><BigWord text="?" x={780} y={680} at={P(6) + 0.3} size={130} /></>;
const NewCar = ({t}: {t: number}) => <><Ground /><Car x={620} y={G + 10} w={620} shiny /><Doug x={200} pose={{turn: 0.6, look: [0.7, 0], eyeScale: 1.2, beak: 'smile', blush: 1}} />
  <PriceTag x={620} y={560} price="$44,000" fish="4,400 fish" at={P(7) + 1} /></>;
const NoFish = ({t}: {t: number}) => <><Ground /><Doug x={540} h={600} pose={{brows: 'worried', beak: 'frown', sweat: true, look: [0, 0.6], flapL: 40, flapR: 40}} />
  <FishPile x={540} y={G + 40} n={1} w={120} /><Counter x={540} y={240} t={t} at={P(8) + 0.3} to={3} dur={0.01} prefix="" color={RED} size={180} /><BigWord text="fish" x={540} y={500} at={P(8) + 0.3} size={90} color={RED} /></>;
const Loan = ({t}: {t: number}) => <><Ground /><IceBank x={700} y={G} w={600} /><Doug x={230} pose={{turn: 0.6, look: [0.8, 0]}} /><Paper x={430} y={720} w={260} title="LOAN" amount="7 years" at={P(9) + 0.4} id="loan" /></>;
const Monthly = ({t}: {t: number}) => <><Ground /><IceBank x={790} y={G} w={480} /><Doug x={220} pose={{turn: 0.6, flapR: 70}} />
  {flights(260, G - 300, 760, G - 250, P(10), E(10), 4)}<BigWord text="65 fish / month" x={540} y={360} at={P(10)} size={86} color={RED} />
  <Counter x={540} y={480} t={t} at={P(10) + 1} to={84} dur={1.2} prefix="month " color={INK} size={90} /></>;
const Happy = ({t}: {t: number}) => <><Close who="doug" pose={{beak: 'smile', brows: 'happy', lids: 0.3, blush: 1, flapL: 120, flapR: 120}} />
  {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 200, top: 360 + (i % 2) * 120 + Math.sin(t * 6 + i) * 20, fontSize: 90}}>✨</div>)}</>;
const OldCar = ({t}: {t: number}) => <><Ground /><Car x={620} y={G + 10} w={600} color="#5B8DB8" /><Ricky x={200} y={G + 20} pose={{turn: 0.6, look: [0.7, 0]}} />
  <PriceTag x={620} y={560} price="$10,000" fish="1,000 fish" color={GREEN} at={P(12) + 0.6} /><Stamp text="CASH" x={620} y={900} at={P(12) + 1.9} size={110} /></>;
const Laugh = ({t}: {t: number}) => { const hop = Math.abs(Math.sin(t * 12)) * 25;
  return <><Ground /><Car x={300} y={G + 10} w={460} shiny /><Doug x={300} y={G - 150 - hop} h={400} pose={{beak: 'smile', brows: 'happy', lids: 0.5, flapR: 130}} />
    <Car x={800} y={G + 10} w={420} color="#5B8DB8" /><Ricky x={820} y={G - 130} h={360} pose={{look: [-0.6, 0]}} /><BigWord text="HA HA" x={330} y={520} at={P(13) + 0.2} size={120} color={RED} /></>; };
const RickyFish = ({t}: {t: number}) => <><Ground /><Ricky x={380} y={G + 20} h={620} pose={{turn: 0.4, flapR: 80, beak: 'smile'}} /><FishPile x={800} y={G + 10} n={6} w={150} seed={3} />
  <BigWord text="65 fish / month" x={540} y={360} at={P(14) + 0.5} size={86} color={GREEN} /></>;
const NoBank = ({t}: {t: number}) => <><Ground /><IceBank x={450} y={G} w={520} /><Stamp text="NO" x={450} y={850} at={P(15) + 0.4} color={RED} size={200} /><Ricky x={900} y={G + 20} h={420} pose={{turn: -0.6, look: [-0.7, 0]}} /></>;
const Stocks = ({t}: {t: number}) => <><Ground /><StockBoard x={680} y={G - 120} t={t} at={P(16) + 0.3} /><Ricky x={200} y={G + 20} pose={{turn: 0.6, flapR: 80}} />{flights(260, G - 300, 640, G - 350, P(16) + 0.2, E(16), 3, 4)}</>;
const DougToBank = ({t}: {t: number}) => <><Ground /><IceBank x={790} y={G} w={480} /><Doug x={220} pose={{turn: 0.6}} />{flights(260, G - 300, 760, G - 250, P(17), E(17) + 0.1, 3, 6)}
  <BigWord text="bye fish" x={540} y={430} at={P(17) + 0.5} size={80} color={RED} /></>;
const FishWork = ({t}: {t: number}) => <><Ground /><StockBoard x={540} y={G - 200} w={560} t={t} at={P(18) - 2} />
  {[0, 1, 2].map((i) => <div key={i} style={{transform: `translateY(${-Math.abs(Math.sin(t * 8 + i)) * 30}px)`}}><FishPile x={330 + i * 210} y={G + 10} n={1} w={140} seed={i} /></div>)}
  <BigWord text="fish go to work" x={540} y={340} at={P(18) + 0.2} size={80} color={GREEN} /></>;
const WorthLess = ({t}: {t: number}) => { const y = Math.floor(cl((t - P(19)) / 1.4) * 6) + 1;
  return <><Ground /><Car x={540} y={G + 10} w={600} shiny={y < 3} color={y < 3 ? RED : '#B5524A'} /><Counter x={540} y={380} t={t} at={P(19)} to={y} dur={0.01} prefix="year " color={INK} size={100} />
    <BigWord text="value ↓" x={540} y={620} at={P(19) + 0.6} size={120} color={RED} /></>; };
const Babies = ({t}: {t: number}) => <><Ground /><Ricky x={220} y={G + 20} pose={{turn: 0.6, beak: 'smile'}} /><FishPile x={680} y={G + 10} n={Math.min(12, 3 + Math.floor((t - P(20)) * 5))} w={150} seed={5} />
  <BigWord text="+ baby fish" x={680} y={560} at={P(20) + 0.7} size={90} color={GREEN} /></>;
const More = ({t}: {t: number}) => <><Ground /><FishPile x={540} y={G + 10} n={Math.min(24, 12 + Math.floor((t - P(21)) * 12))} w={230} seed={7} /><Ricky x={540} y={G - 480} h={380} pose={{flapL: 120, flapR: 120, beak: 'smile'}} /></>;
const Called = () => <Title lines={['compound', 'interest']} y={800} at={P(22)} size={140} />;
const Poor = () => <Close who="doug" pose={{lids: 0.35, brows: 'worried', beak: 'frown', tears: true}} />;
const RealLife = ({t}: {t: number}) => <><BigWord text="real life" x={540} y={330} at={P(24)} size={110} /><Paper x={540} y={760} w={380} title="CAR LOAN" amount="$44,000" at={P(24) + 1} id="rl" />
  <BigWord text="7 years" x={540} y={1080} at={P(24) + 2.6} size={100} color={RED} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center', fontFamily: HAND, fontSize: 34, color: '#888'}}>Experian Q1 2026 · avg new loan $43,925 at 6.39%</div></>;
const Payment = ({t}: {t: number}) => <><Car x={540} y={700} w={520} shiny /><Counter x={540} y={780} t={t} at={P(25) + 0.4} to={650} dur={0.8} color={RED} size={190} /><BigWord text="a month" x={540} y={1080} at={P(25) + 1.2} size={100} /></>;
const Invest = ({t}: {t: number}) => <><StockBoard x={540} y={1000} w={600} t={t} at={P(26)} /><BigWord text="≈7% a year" x={540} y={1160} at={P(26) + 1.2} size={110} color={GREEN} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center', fontFamily: HAND, fontSize: 34, color: '#888'}}>assumption, not guaranteed</div></>;
const Seven = ({t}: {t: number}) => <><BigWord text="7 years" x={540} y={460} at={P(27)} size={120} /><Counter x={540} y={640} t={t} at={P(27) + 0.5} to={70199} dur={1} /><FishPile x={540} y={1250} n={9} w={170} seed={8} /></>;
const ThirtyFive = ({t}: {t: number}) => <><BigWord text="35 years" x={540} y={210} at={P(28)} size={110} /><Counter x={540} y={290} t={t} at={P(28) + 0.5} to={1170685} dur={1.2} size={140} />
  <FishPile x={540} y={G + 120} n={Math.min(24, 6 + Math.floor((t - P(28)) * 20))} w={260} seed={9} /><Ricky x={540} y={G - 440} h={360} pose={{flapL: 130, flapR: 130, beak: 'smile', hop: Math.abs(Math.sin(t * 9)) * 30}} /></>;
const LastPay = ({t}: {t: number}) => <><Ground /><IceBank x={790} y={G} w={480} /><Doug x={220} pose={{turn: 0.6, beak: 'smile', lids: 0.3}} />{flights(260, G - 300, 760, G - 250, P(29) + 0.2, P(29) + 1, 1, 11)}
  <Stamp text="PAID" x={540} y={560} at={P(29) + 1.2} size={130} /><BigWord text="year 7" x={540} y={360} at={P(29)} size={100} /></>;
const Broke = ({t}: {t: number}) => { const shake = t < P(30) + 0.15 ? 0 : Math.sin(t * 60) * 6;
  return <><Ground /><div style={{transform: `translateX(${shake}px) rotate(${t > P(30) + 0.2 ? -4 : 0}deg)`}}><Car x={600} y={G + 10} w={620} color="#B5524A" /></div>
    {t > P(30) + 0.1 && <Smoke x={840} y={G - 220} t={t} />}<Doug x={180} pose={{brows: 'shock', eyeScale: 1.3, pupil: 0.5, beak: 'frown', flapL: 100, flapR: 100}} />
    <BigWord text="BOOM" x={600} y={700} at={P(30) + 0.1} size={140} color={RED} /></>; };
const RickyNew = ({t}: {t: number}) => <><Ground /><Car x={620} y={G + 10} w={600} color={GREEN} shiny /><Ricky x={200} y={G + 20} pose={{turn: 0.6, beak: 'smile', flapR: 90}} />
  {flights(240, G - 300, 600, G - 200, P(31) + 0.3, E(31), 3, 13)}<Stamp text="CASH" x={620} y={700} at={P(31) + 0.8} size={120} /></>;
const DougAgain = ({t}: {t: number}) => <><Ground /><Car x={620} y={G + 10} w={600} shiny /><Doug x={200} pose={{turn: 0.6, beak: 'smile', blush: 1}} />
  <Paper x={620} y={640} w={280} title="NEW LOAN" amount="7 years" at={P(32) + 0.6} rot={5} id="nl" /></>;
const Cta = ({t}: {t: number}) => <><Ground /><Doug x={290} pose={{turn: 0.3, look: [0.2, 0.6]}} /><Ricky x={790} y={G + 20} pose={{turn: -0.3, look: [-0.2, 0.6], beak: 'smile'}} />
  <BigWord text="team Doug" x={290} y={400} at={P(33)} size={84} color={RED} /><BigWord text="or" x={540} y={520} at={P(33) + 0.3} size={76} /><BigWord text="team Ricky?" x={790} y={640} at={P(33) + 0.5} size={84} color={GREEN} />
  <BigWord text="👇" x={540} y={820} at={P(33) + 0.8} size={140} /></>;

type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(3), set: (t) => <Intro t={t} />, fx_: 'swipe'},
  {at: P(4), set: (t) => <Brother t={t} />, fx_: 'pop'},
  {at: P(5), set: (t) => <SameJob t={t} />, fx_: 'zoom'},
  {at: P(6), set: (t) => <NeedCar t={t} />, fx_: 'swipeL'},
  {at: P(7), set: (t) => <NewCar t={t} />, fx_: 'iris'},
  {at: P(8), set: (t) => <NoFish t={t} />, fx_: 'pop'},
  {at: P(9), set: (t) => <Loan t={t} />, fx_: 'swipe'},
  {at: P(10), set: (t) => <Monthly t={t} />, fx_: 'zoom'},
  {at: P(11), set: (t) => <Happy t={t} />, fx_: 'pop'},
  {at: P(12), set: (t) => <OldCar t={t} />, fx_: 'swipeL'},
  {at: P(13), set: (t) => <Laugh t={t} />, fx_: 'iris'},
  {at: P(14), set: (t) => <RickyFish t={t} />, fx_: 'swipe'},
  {at: P(15), set: (t) => <NoBank t={t} />, fx_: 'pop'},
  {at: P(16), set: (t) => <Stocks t={t} />, fx_: 'zoom'},
  {at: P(17), set: (t) => <DougToBank t={t} />, fx_: 'swipeL'},
  {at: P(18), set: (t) => <FishWork t={t} />, fx_: 'swipe'},
  {at: P(19), set: (t) => <WorthLess t={t} />, fx_: 'iris'},
  {at: P(20), set: (t) => <Babies t={t} />, fx_: 'pop'},
  {at: P(21), set: (t) => <More t={t} />, fx_: 'zoom'},
  {at: P(22), set: () => <Called />, fx_: 'pop'},
  {at: P(23), set: () => <Poor />, fx_: 'zoom'},
  {at: P(24), set: (t) => <RealLife t={t} />, fx_: 'swipe'},
  {at: P(25), set: (t) => <Payment t={t} />, fx_: 'pop'},
  {at: P(26), set: (t) => <Invest t={t} />, fx_: 'swipeL'},
  {at: P(27), set: (t) => <Seven t={t} />, fx_: 'pop'},
  {at: P(28), set: (t) => <ThirtyFive t={t} />, fx_: 'zoom'},
  {at: P(29), set: (t) => <LastPay t={t} />, fx_: 'swipe'},
  {at: P(30), set: (t) => <Broke t={t} />, fx_: 'pop'},
  {at: P(31), set: (t) => <RickyNew t={t} />, fx_: 'swipeL'},
  {at: P(32), set: (t) => <DougAgain t={t} />, fx_: 'iris'},
  {at: P(33), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[7, 520, 950, 1.25], [10, 540, 800, 1.25], [13, 330, 1000, 1.6], [16, 560, 1000, 1.2], [21, 540, 1050, 1.4],
  [25, 540, 900, 1.3], [28, 540, 800, 1.3], [30, 540, 1050, 1.2]];

export const DougSalary = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward Doug on "stay poor", swing to Ricky on "millionaire"
    const toL = ease((tc - P(1)) / 0.3) * (tc < USED ? 1 : 0); // push to Doug on "only one buy his dream car", back to both for Ricky
    s0 = 1 + 0.22 * toL; fx = 540 - 250 * toL; fy = 960 + 90 * toL;
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
    <Sfx at={P(1) - 0.05} name="user-whoosh" vol={0.25} />
    <Sfx at={DREAM} name="user-boom" vol={0.4} />
    <Sfx at={DREAM + 0.15} name="user-cash-register" vol={0.3} />
    <Sfx at={USED - 0.05} name="user-whoosh" vol={0.25} />
    <Sfx at={USED + 0.15} name="user-money" vol={0.3} />
    <Sfx at={P(3)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(4) + 0.6} name="penguin-honk" vol={0.35} />
    <Sfx at={P(5)} name="user-money" vol={0.3} />
    <Sfx at={P(7) + 1} name="user-cash-register" vol={0.35} />
    <Sfx at={P(8) + 0.3} name="user-aww" vol={0.35} />
    <Sfx at={P(9) + 0.4} name="user-notif" vol={0.35} />
    <Sfx at={P(10)} name="user-money-transfer" vol={0.3} />
    <Sfx at={P(10) + 1} name="user-timer" vol={0.3} />
    <Sfx at={P(11)} name="user-yeah" vol={0.35} />
    <Sfx at={P(12) + 0.6} name="user-money" vol={0.3} />
    <Sfx at={P(12) + 1.9} name="user-slap" vol={0.35} />
    <Sfx at={P(13) + 0.2} name="penguin-squawk" vol={0.4} />
    <Sfx at={P(15) + 0.4} name="user-wrong" vol={0.35} />
    <Sfx at={P(16) + 0.3} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(17) + 0.5} name="user-aww" vol={0.3} />
    <Sfx at={P(18) + 0.2} name="user-wow" vol={0.35} />
    <Sfx at={P(19) + 0.6} name="user-wrong" vol={0.3} />
    <Sfx at={P(20) + 0.7} name="user-pop" vol={0.35} />
    <Sfx at={P(21)} name="user-wow" vol={0.35} />
    <Sfx at={P(22)} name="user-ting" vol={0.35} />
    <Sfx at={P(23)} name="user-fahh" vol={0.4} />
    <Sfx at={P(25) + 0.4} name="user-boom" vol={0.4} />
    <Sfx at={P(26) + 1.2} name="user-pop" vol={0.3} />
    <Sfx at={P(27) + 0.5} name="user-cash-register" vol={0.35} />
    <Sfx at={P(28) + 0.5} name="user-boom" vol={0.45} />
    <Sfx at={P(28) + 0.8} name="user-wow" vol={0.35} />
    <Sfx at={P(29) + 1.2} name="user-slap" vol={0.35} />
    <Sfx at={P(30) + 0.1} name="user-boom" vol={0.45} />
    <Sfx at={P(30) + 0.4} name="user-horn" vol={0.35} />
    <Sfx at={P(31) + 0.8} name="user-yeah" vol={0.35} />
    <Sfx at={P(32) + 0.6} name="user-fahh-long" vol={0.35} />
    <Sfx at={P(33) + 0.8} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};

// Still of the opening frame (approved look), kept for thumbnails.
export const DougSalaryHook = () => <AbsoluteFill style={{background: '#fff'}}><Fonts /><HandFont /><Hook t={0} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 1500, textAlign: 'center', fontFamily: HAND, fontSize: 66, color: INK, transform: 'rotate(-2deg)'}}>two penguins make same salary…</div>
</AbsoluteFill>;
