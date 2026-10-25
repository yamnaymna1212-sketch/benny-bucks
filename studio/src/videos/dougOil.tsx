// EP7 "Why poor country give its oil to rich country... for free?" — Venezuela -> USA oil, answer held to the end.
// Hook layout = the user's image (videos/doug-gas-debt/hook-ref.webp): two floating islands, a pipe, barrel pushed in.
// Hook first (approval), full episode after. Line timings: studio/src/data/doug-oil.json.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Walrus} from '../penguin/cast';
import {Stamp} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {Arrow, Puzzled, UsFlag, VeFlag, Why} from './dougVenezuela';
import TIM from '../data/doug-oil.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_OIL_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F', OIL = '#F2B705';
const TOP = 1270; // island grass line

// ---------- props ----------
// Floating island: grass cap + jagged dirt underside (as in the user's image).
export const Island = ({cx, w = 520, top = TOP, seed = 0}: {cx: number; w?: number; top?: number; seed?: number}) => {
  const n = 9, teeth = Array.from({length: n + 1}, (_, i) => {
    const x = (i / n) * w, depth = 70 + ((i * 53 + seed * 17) % 5) * 22 + (i === Math.floor(n / 2) ? 60 : 0);
    return `L${x} ${30 + depth * (1 - Math.abs(i / n - 0.5) * 1.1)}`;
  }).join(' ');
  return <svg width={w} height={260} viewBox={`0 0 ${w} 260`} style={{position: 'absolute', left: cx - w / 2, top: top - 20, overflow: 'visible'}}>
    <path d={`M0 30 ${teeth} L${w} 30 Z`} fill="#A0632F" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {Array.from({length: 6}, (_, i) => <path key={i} d={`M${40 + i * (w - 80) / 5} 50 l${-8 + (i % 3) * 8} ${50 + (i % 2) * 30}`} stroke="#7A4520" strokeWidth={5} strokeLinecap="round" />)}
    <path d={`M-6 34 Q ${w / 2} 0 ${w + 6} 34 Q ${w / 2} 58 -6 34 Z`} fill="#6DBE45" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {Array.from({length: 14}, (_, i) => <path key={i} d={`M${10 + i * (w - 20) / 13} ${42 + (i % 2) * 4} l-6 14 l12 0 Z`} fill="#4E9A2F" />)}
  </svg>;
};

// Flag on a golden pole, waving.
export const PoleFlag = ({x, y, flag, t, h = 380}: {x: number; y: number; flag: 'us' | 've'; t: number; h?: number}) => {
  const wave = Math.sin(t * 5 + (flag === 'us' ? 1 : 0)) * 4;
  return <svg width={260} height={h} viewBox={`0 0 260 ${h}`} style={{position: 'absolute', left: x - 10, top: y - h, overflow: 'visible'}}>
    <line x1={10} y1={14} x2={10} y2={h} stroke="#C8961E" strokeWidth={10} /><line x1={10} y1={14} x2={10} y2={h} stroke={INK} strokeWidth={3} opacity={0.4} />
    <circle cx={10} cy={12} r={13} fill="#F2C230" stroke={INK} strokeWidth={4} />
    <g transform={`translate(16 ${26 + wave}) skewY(${wave * 0.8}) scale(1.15)`}>{flag === 'us' ? <UsFlag /> : <VeFlag />}</g>
  </svg>;
};

// Black oil barrel with the yellow drop.
export const OilBarrel = ({x, y, w = 150, rot = 0}: {x: number; y: number; w?: number; rot?: number}) =>
  <svg width={w} height={w * 1.3} viewBox="0 0 100 130" style={{position: 'absolute', left: x - w / 2, top: y - w * 1.3, overflow: 'visible', transform: `rotate(${rot}deg)`, transformOrigin: '50% 100%'}}>
    <rect x={4} y={8} width={92} height={118} rx={10} fill="#262626" stroke={INK} strokeWidth={5} />
    <ellipse cx={50} cy={10} rx={46} ry={8} fill="#3A3A3A" stroke={INK} strokeWidth={4} />
    <path d="M4 44 L96 44 M4 92 L96 92" stroke="#555" strokeWidth={6} />
    <path d="M50 52 Q 66 74 62 84 A 13 13 0 0 1 38 84 Q 34 74 50 52 Z" fill={OIL} stroke={INK} strokeWidth={3} />
    <path d="M14 18 L14 116" stroke="#4A4A4A" strokeWidth={6} strokeLinecap="round" />
  </svg>;

// Pipe from under the poor island to the rich island, oil flowing left -> right.
export const Pipe = ({x1, x2, top, bottom, t, flow = 1}: {x1: number; x2: number; top: number; bottom: number; t: number; flow?: number}) => {
  const r = 60, d = `M${x1} ${top} L${x1} ${bottom - r} Q ${x1} ${bottom} ${x1 + r} ${bottom} L${x2 - r} ${bottom} Q ${x2} ${bottom} ${x2} ${bottom - r} L${x2} ${top}`;
  const arrowX = x1 + 80 + ((t * 260) % (x2 - x1 - 160));
  return <svg width={10} height={10} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <path d={d} fill="none" stroke={INK} strokeWidth={62} strokeLinejoin="round" />
    <path d={d} fill="none" stroke="#5B5B5B" strokeWidth={50} strokeLinejoin="round" />
    <path d={`M${x1 + r} ${bottom} L${x2 - r} ${bottom}`} fill="none" stroke={OIL} strokeWidth={26 * flow} strokeLinecap="round" opacity={0.95} />
    <path d={`M${x1 + r} ${bottom} L${x2 - r} ${bottom}`} fill="none" stroke="#FFE27A" strokeWidth={6 * flow} strokeDasharray="30 40" strokeDashoffset={-t * 240} strokeLinecap="round" />
    {flow > 0 && <path d={`M${arrowX - 26} ${bottom - 10} L${arrowX} ${bottom - 10} L${arrowX} ${bottom - 20} L${arrowX + 22} ${bottom} L${arrowX} ${bottom + 20} L${arrowX} ${bottom + 10} L${arrowX - 26} ${bottom + 10} Z`} fill="#F7D21E" stroke={INK} strokeWidth={3} />}
    {[x1, x2].map((x) => <rect key={x} x={x - 40} y={top + 6} width={80} height={22} rx={5} fill="#777" stroke={INK} strokeWidth={4} />)}
    {[x1 + r + 40, x2 - r - 40].map((x) => <rect key={x} x={x - 11} y={bottom - 40} width={22} height={80} rx={5} fill="#777" stroke={INK} strokeWidth={4} />)}
  </svg>;
};

// Big American pickup truck (drinks gas — the user's Tesla swapped: an EV doesn't burn oil).
export const Pickup = ({x, y, w = 420, t}: {x: number; y: number; w?: number; t: number}) =>
  <svg width={w} height={w * 0.55} viewBox="0 0 400 220" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.55 + Math.sin(t * 20) * 0.8, overflow: 'visible'}}>
    <path d="M20 160 L20 110 L150 104 L190 50 L300 50 L330 104 L385 112 L388 160 Z" fill="#C8352B" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M200 62 L292 62 L314 104 L176 104 Z" fill="#BFE6F7" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M246 62 L246 104" stroke={INK} strokeWidth={5} />
    <rect x={20} y={100} width={150} height={14} fill="#A82A22" stroke={INK} strokeWidth={4} />
    <rect x={370} y={120} width={22} height={18} rx={4} fill="#FFF2A8" stroke={INK} strokeWidth={4} />
    <rect x={14} y={150} width={380} height={16} rx={6} fill="#D9D9D9" stroke={INK} strokeWidth={4} />
    {[95, 305].map((cx) => <g key={cx}><circle cx={cx} cy={170} r={42} fill="#222" stroke={INK} strokeWidth={6} /><circle cx={cx} cy={170} r={18} fill="#BDBDBD" stroke={INK} strokeWidth={4} /></g>)}
    <text x={95} y={140} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={22} fill="#fff">V8</text>
  </svg>;

// Gas-can price icon: red jerry can + "$x / gal".
export const CanPrice = ({x, y, price, color, at, t}: {x: number; y: number; price: string; color: string; at: number; t: number}) => {
  const p = ease((t - at) / 0.25); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x - 200, top: y, width: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transform: `scale(${0.4 + 0.6 * p})`}}>
    <svg width={74} height={88} viewBox="0 0 110 132"><path d="M10 30 L70 30 L100 60 L100 125 L10 125 Z" fill={RED} stroke={INK} strokeWidth={7} strokeLinejoin="round" /><path d="M70 30 L90 8 L104 18 L84 40" fill="none" stroke={INK} strokeWidth={8} /><path d="M28 56 L84 108 M84 56 L28 108" stroke="#8E1F17" strokeWidth={8} /></svg>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: price.length > 4 ? 76 : 86, color, lineHeight: 1, WebkitTextStroke: `3px ${INK}`}}>{price}<span style={{fontSize: 34, color: INK, WebkitTextStroke: '0px'}}> /gal</span></div>
  </div>;
};

// Doug's ragged shirt in Venezuela colours (drawn over the penguin body).
const RaggedShirt = ({x, y, h, t}: {x: number; y: number; h: number; t: number}) => {
  const k = h / 520;
  return <svg width={300 * k} height={260 * k} viewBox="0 0 300 260" style={{position: 'absolute', left: x - 150 * k, top: y - h * 0.62, overflow: 'visible', transform: `rotate(${Math.sin(t * 9) * 1.2}deg)`}}>
    <defs><clipPath id="rag"><path d="M40 20 L260 20 L276 210 L250 196 L232 222 L206 200 L180 230 L150 204 L120 226 L96 198 L70 220 L46 200 L24 210 Z" /></clipPath></defs>
    <g clipPath="url(#rag)">
      <rect x={0} y={0} width={300} height={90} fill="#F5C518" /><rect x={0} y={90} width={300} height={70} fill="#1F4BA8" /><rect x={0} y={160} width={300} height={100} fill="#D83A2E" />
      {Array.from({length: 7}, (_, i) => { const a = Math.PI * (0.8 - i * 0.1); return <circle key={i} cx={150 + Math.cos(a) * 48} cy={150 - Math.sin(a) * 34} r={6} fill="#fff" />; })}
    </g>
    <path d="M40 20 L260 20 L276 210 L250 196 L232 222 L206 200 L180 230 L150 204 L120 226 L96 198 L70 220 L46 200 L24 210 Z" fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <rect x={190} y={54} width={44} height={36} rx={6} fill="#B8864B" stroke={INK} strokeWidth={4} transform="rotate(12 212 72)" />
    <path d="M196 60 l30 26 M228 58 l-26 30" stroke={INK} strokeWidth={2} />
    <rect x={62} y={150} width={40} height={34} rx={6} fill="#8E5A2E" stroke={INK} strokeWidth={4} transform="rotate(-10 82 167)" />
  </svg>;
};

// Larry's navy suit + red tie, open arms (drawn over the walrus, facing left).
const Suit = ({x, y, h, t, open}: {x: number; y: number; h: number; t: number; open: number}) => {
  const k = h / 520, a = -20 - 50 * open + Math.sin(t * 4) * 4;
  return <svg width={420 * k} height={340 * k} viewBox="0 0 420 340" style={{position: 'absolute', left: x - 210 * k, top: y - 330 * k, overflow: 'visible'}}>
    <g transform={`rotate(${a} 110 70)`}><path d="M110 60 L-20 70 L-24 112 L110 104 Z" fill="#1E2F5C" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><circle cx={-34} cy={90} r={22} fill="#A87459" stroke={INK} strokeWidth={5} /></g>
    <g transform={`rotate(${-a} 310 70)`}><path d="M310 60 L440 70 L444 112 L310 104 Z" fill="#1E2F5C" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><circle cx={454} cy={90} r={22} fill="#A87459" stroke={INK} strokeWidth={5} /></g>
    <path d="M90 40 Q 210 10 330 40 L360 320 L60 320 Z" fill="#1E2F5C" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M168 30 L210 120 L252 30 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M200 44 L220 44 L228 150 L210 172 L192 150 Z" fill={RED} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M168 30 L196 170 M252 30 L224 170" stroke="#2E4580" strokeWidth={10} />
    <rect x={262} y={86} width={38} height={24} fill="#fff" stroke={INK} strokeWidth={3} /><rect x={262} y={86} width={16} height={12} fill="#3C3B6E" />
    {[0, 1, 2].map((i) => <circle key={i} cx={210} cy={200 + i * 40} r={6} fill="#C8961E" stroke={INK} strokeWidth={2} />)}
  </svg>;
};

// Side name above each island (one line, never wraps).
const Side = ({text, x, at, t}: {text: string; x: number; at: number; t: number}) => {
  const p = ease((t - at) / 0.25);
  return <div style={{position: 'absolute', left: x - 270, width: 540, top: 600, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: 'Montserrat', fontWeight: 900, fontSize: text.length > 9 ? 58 : 76, color: INK, opacity: p, transform: `scale(${0.5 + 0.5 * p})`}}>{text}</div>;
};

// ---------- hook ----------
const RICH = 1.55; // "rich country" in line 0
const FREE = P(1), VE = P(2), US = P(3);
const Hook = ({t}: {t: number}) => {
  const lookR = t >= RICH && t < VE || t >= US;
  const push = Math.sin(t * 7) * 6;
  return <>
    <Why t={t} />
    <Arrow x={540} y={505} t={t} swingAt={RICH} />
    {/* labels: generic in the hook, real names after */}
    {t < VE ? <Side text="POOR COUNTRY" x={270} at={0.3} t={t} /> : <Side text="VENEZUELA" x={270} at={VE} t={t} />}
    {t < US ? <Side text="RICH COUNTRY" x={810} at={RICH} t={t} /> : <Side text="USA" x={810} at={US} t={t} />}
    <CanPrice x={270} y={700} price="13¢" color={GREEN} at={0.5} t={t} />
    <CanPrice x={810} y={700} price="$4.33" color={RED} at={RICH + 0.1} t={t} />
    <PoleFlag x={30} y={TOP + 10} flag="ve" t={t} h={430} />
    <PoleFlag x={1040} y={TOP + 10} flag="us" t={t} h={470} />
    <Island cx={270} seed={1} /><Island cx={810} seed={4} />
    <Pipe x1={450} x2={680} top={TOP + 10} bottom={1450} t={t} />
    <Pickup x={930} y={TOP + 26} w={360} t={t} />
    <Walrus id="larry" x={720} y={TOP + 26} h={400} flip hat={false} pose={{laugh: t > RICH ? 0.6 : 0, lids: 0.3, look: -0.8, mouth: t > RICH ? 0.3 : 0}} />
    <Suit x={720} y={TOP + 26} h={400} t={t} open={ease((t - RICH) / 0.4)} />
    <Penguin id="doug" x={230 + push * 0.4} y={TOP + 26} h={400} pose={{side: true, turn: 1, lean: 14, brows: t > FREE ? 'worried' : 'none', sweat: t > FREE, beak: t > FREE ? 'frown' : undefined}} />
    <RaggedShirt x={262 + push * 0.4} y={TOP + 40} h={400} t={t} />
    <OilBarrel x={420 + push} y={TOP + 28} w={160} rot={push * 0.5} />
    {t > FREE && t < VE + 0.6 && <Puzzled x={300} y={840} t={t} />}
    {t >= FREE && t < VE && <Stamp text="FREE?" x={560} y={1330} at={FREE} color={RED} size={100} />}
  </>;
};

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
];
const DEEP: [number, number, number, number][] = [];

export const DougOil = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push to the side being spoken; wide on "for free?"
    const L = ease((tc - 0.9) / 0.5) * (tc < RICH ? 1 : 0) + ease((tc - VE) / 0.4) * (tc >= VE && tc < US ? 1 : 0);
    const R = ease((tc - RICH) / 0.4) * (tc < FREE ? 1 : 0) + ease((tc - US) / 0.4) * (tc >= US ? 1 : 0);
    s0 = 1 + 0.26 * (L + R); fx = 540 - 270 * L + 270 * R; fy = 960 + 140 * (L + R);
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (tc < 1.0 ? 1 : beat(tc, TIM));
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-oil-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.5} name="user-whoosh" vol={0.25} />
    <Sfx at={RICH} name="user-cash-register" vol={0.3} />
    <Sfx at={FREE} name="user-boom" vol={0.45} />
    <Sfx at={VE} name="user-pop" vol={0.35} />
    <Sfx at={US} name="user-pop" vol={0.35} />
    <Sfx at={US + 0.5} name="walrus-laugh" vol={0.35} />
  </AbsoluteFill>;
};
