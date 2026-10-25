// EP7 "Why poor country give its oil to rich country... for free?" — Venezuela -> USA oil, answer held to the end.
// Hook layout = the user's image (videos/doug-gas-debt/hook-ref.webp): two floating islands, a pipe, barrel pushed in.
// Hook first (approval), full episode after. Line timings: studio/src/data/doug-oil.json.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {BigSeal, Seagull, Walrus} from '../penguin/cast';
import {BigWord, IceBank, Stamp} from '../penguin/world';
import {MoneyBag, Pump} from './dougGas';
import {Fox} from './dougLaundering';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {Arrow, FlagPump, Puzzled, UsFlag, VeFlag, Why} from './dougVenezuela';
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

// ---------- hook = the user's image (studio/public/ep7-hook.webp, 1536x1024), animated ----------
const RICH = 1.35; // "rich country" in line 0
const FREE = P(1);
const IMG = staticFile('ep7-hook.webp'), IW = 1536, IH = 1024, K = 1080 / IW, IMG_TOP = 790;
const ix = (x: number) => x * K, iy = (y: number) => IMG_TOP + y * K;

// Waving flag: the flag area of the image is redrawn as vertical strips that ripple (still at the pole).
const WaveFlag = ({x0, y0, x1, y1, t, ph}: {x0: number; y0: number; x1: number; y1: number; t: number; ph: number}) => {
  const n = 14, w = (x1 - x0) / n;
  return <>
    <div style={{position: 'absolute', left: ix(x0), top: iy(y0) - 6, width: ix(x1 - x0) + 4, height: (y1 - y0) * K + 12, background: '#fff'}} />
    {Array.from({length: n}, (_, i) => {
      const amp = (i / n) * 7, dy = Math.sin(t * 6 - i * 0.55 + ph) * amp;
      return <div key={i} style={{position: 'absolute', left: ix(x0 + i * w), top: iy(y0) + dy, width: ix(w) + 1, height: (y1 - y0) * K, overflow: 'hidden'}}>
        <img src={IMG} style={{position: 'absolute', left: -ix(x0 + i * w), top: -y0 * K, width: 1080, height: IH * K}} />
      </div>;
    })}
  </>;
};

// Oil glints + arrow running through the horizontal pipe.
const OilFlow = ({t, fast}: {t: number; fast: number}) => {
  const xa = ix(650), xb = ix(990), y = iy(832), sp = 160 + 260 * fast;
  return <svg width={10} height={10} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <path d={`M${xa} ${y} L${xb} ${y}`} stroke="#FFE27A" strokeWidth={5} strokeDasharray="18 34" strokeDashoffset={-t * sp} strokeLinecap="round" opacity={0.9} />
    {[0, 0.5].map((o) => { const x = xa + (((t * sp / (xb - xa)) + o) % 1) * (xb - xa); return <path key={o} d={`M${x - 20} ${y - 7} L${x} ${y - 7} L${x} ${y - 15} L${x + 18} ${y} L${x} ${y + 15} L${x} ${y + 7} L${x - 20} ${y + 7} Z`} fill="#F7D21E" stroke={INK} strokeWidth={3} />; })}
  </svg>;
};

// Spotlight on the hidden pipe: everything else goes dark -> the "secret" way the oil leaves.
const Secret = ({t}: {t: number}) => {
  const p = ease((t - FREE) / 0.25);
  if (p <= 0) return null;
  return <div style={{position: 'absolute', inset: -400, opacity: p * 0.78,
    background: `radial-gradient(ellipse 430px 190px at ${ix(820) + 400}px ${iy(810) + 400}px, transparent 55%, #0B0B14 100%)`}} />;
};

const SideTag = ({text, x, y, at, t, color = INK}: {text: string; x: number; y: number; at: number; t: number; color?: string}) => {
  const p = ease((t - at) / 0.25);
  return <div style={{position: 'absolute', left: x - 250, width: 500, top: y, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, color, opacity: p, transform: `scale(${0.5 + 0.5 * p}) rotate(${-2 + Math.sin(t * 3) * 1}deg)`}}>{text}</div>;
};

const Hook = ({t}: {t: number}) => {
  const enter = ease(t / 0.3), bob = Math.sin(t * 2.2) * 6;
  const look = t < 0.3 ? 0 : t < RICH ? -0.9 : t < FREE ? 0.9 : 0;
  const shock = t >= FREE;
  return <>
    <Why t={t} />
    {/* the user's picture, floating */}
    <div style={{position: 'absolute', left: 0, top: bob, width: 1080, height: 1920, transform: `scale(${0.92 + 0.08 * enter})`, transformOrigin: '540px 1150px', opacity: enter}}>
      <img src={IMG} style={{position: 'absolute', left: 0, top: IMG_TOP, width: 1080, height: IH * K}} />
      <WaveFlag x0={146} y0={150} x1={342} y1={338} t={t} ph={0} />
      <WaveFlag x0={1108} y0={160} x1={1330} y1={360} t={t} ph={1.3} />
      <OilFlow t={t} fast={shock ? 1 : 0} />
      <Secret t={t} />
      {shock && <Stamp text="TOP SECRET" x={ix(820)} y={iy(930)} at={FREE + 0.1} color={RED} size={70} rot={-8} />}
    </div>
    <SideTag text="POOR COUNTRY" x={235} y={828} at={0.35} t={t} color={shock ? '#fff' : INK} />
    <SideTag text="RICH COUNTRY" x={865} y={828} at={RICH} t={t} color={shock ? '#fff' : INK} />
    {/* Doug in the middle, reacting */}
    <div style={{position: 'absolute', left: 430, top: 778 + Math.sin(t * 2.6) * 5, width: 220, height: 40, background: '#E4F4FC', border: `5px solid ${INK}`, borderRadius: '50%'}} />
    <Penguin id="doug" x={540} y={800 + Math.sin(t * 2.6) * 5} h={240} shadow={false}
      pose={{turn: look * 0.5, look: [look, shock ? -0.4 : -0.1], brows: shock ? 'shock' : look ? 'worried' : 'none', eyeScale: shock ? 1.35 : 1.05, pupil: shock ? 0.5 : 1, beak: shock ? 'frown' : undefined, flapL: shock ? 120 : 30, flapR: shock ? 120 : 30, sweat: shock}} />
    {shock && <Puzzled x={660} y={610} t={t} />}
    <Arrow x={540} y={470} t={t} swingAt={RICH} />
  </>;
};

// ---------- small props ----------
const G = 1300;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const Ground = ({color = '#E4F4FC'}: {color?: string}) => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: color, borderTop: `5px solid ${INK}`}} />;
const Note = ({text}: {text: string}) => <div style={{position: 'absolute', left: 0, right: 0, top: 1440, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 30, color: '#888'}}>{text}</div>;

// Wallet (open): big & full (US) or tiny & empty with a moth.
const WalletBox = ({x, y, w, full, t}: {x: number; y: number; w: number; full?: boolean; t: number}) =>
  <svg width={w} height={w * 0.75} viewBox="0 0 200 150" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.75, overflow: 'visible'}}>
    {full && [0, 1, 2, 3].map((i) => <rect key={i} x={30 + i * 30} y={-30 - (i % 2) * 18 + Math.sin(t * 4 + i) * 3} width={70} height={110} rx={6} fill="#86C67C" stroke={INK} strokeWidth={4} transform={`rotate(${-12 + i * 8} ${65 + i * 30} 30)`} />)}
    <rect x={10} y={30} width={180} height={110} rx={16} fill="#7A4A26" stroke={INK} strokeWidth={6} />
    <rect x={10} y={30} width={180} height={34} rx={12} fill="#93603A" stroke={INK} strokeWidth={5} />
    {full && <><rect x={130} y={84} width={44} height={28} fill="#fff" stroke={INK} strokeWidth={3} /><rect x={130} y={84} width={18} height={14} fill="#3C3B6E" />{[0, 1, 2].map((i) => <rect key={i} x={148} y={86 + i * 9} width={26} height={4} fill="#B22234" />)}</>}
  </svg>;
const Moth = ({x, y, at, t}: {x: number; y: number; at: number; t: number}) => {
  const d = t - at; if (d < 0) return null;
  const mx = x + d * 160 + Math.sin(d * 9) * 30, my = y - d * 260;
  const flap = Math.sin(t * 40) * 0.6 + 0.4;
  return <svg width={80} height={60} viewBox="-40 -30 80 60" style={{position: 'absolute', left: mx - 40, top: my - 30, overflow: 'visible'}}>
    <ellipse cx={-18} cy={-4} rx={20} ry={14 * flap + 2} fill="#C9B79C" stroke={INK} strokeWidth={3} /><ellipse cx={18} cy={-4} rx={20} ry={14 * flap + 2} fill="#C9B79C" stroke={INK} strokeWidth={3} />
    <ellipse cx={0} cy={0} rx={6} ry={16} fill="#6B5A44" stroke={INK} strokeWidth={3} />
  </svg>;
};
// Calculator that smokes, then explodes.
const Calculator = ({x, y, t, at}: {x: number; y: number; t: number; at: number}) => {
  const d = t - at, boom = d > 0.75;
  if (boom) return <>
    {Array.from({length: 10}, (_, i) => { const a = i / 10 * Math.PI * 2, r = 80 + (d - 0.75) * 700; return <div key={i} style={{position: 'absolute', left: x + Math.cos(a) * r - 18, top: y - 200 + Math.sin(a) * r - 18, width: 36, height: 36, background: i % 2 ? '#555' : '#9AD0A0', border: `4px solid ${INK}`, transform: `rotate(${d * 600 + i * 40}deg)`}} />; })}
    <div style={{position: 'absolute', left: x - 170, top: y - 370, width: 340, height: 340, borderRadius: '50%', background: '#FFB13B', border: `6px solid ${INK}`, transform: `scale(${Math.min(1, (d - 0.75) * 5)})`, opacity: Math.max(0, 1.6 - d)}} />
  </>;
  const shake = d > 0 ? Math.sin(t * 60) * 6 * cl(d * 2) : 0;
  return <>
    <svg width={260} height={360} viewBox="0 0 260 360" style={{position: 'absolute', left: x - 130 + shake, top: y - 360, overflow: 'visible'}}>
      <rect x={10} y={10} width={240} height={340} rx={24} fill="#5C6670" stroke={INK} strokeWidth={7} />
      <rect x={34} y={34} width={192} height={70} rx={8} fill="#BEE3B5" stroke={INK} strokeWidth={5} />
      <text x={214} y={86} textAnchor="end" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill={INK}>{d > 0.35 ? 'ERROR' : '18B-0.5B'}</text>
      {Array.from({length: 12}, (_, i) => <rect key={i} x={34 + (i % 3) * 66} y={124 + Math.floor(i / 3) * 54} width={56} height={42} rx={8} fill={i === 11 ? '#F08A24' : '#EDEDED'} stroke={INK} strokeWidth={4} />)}
    </svg>
    {d > 0.2 && [0, 1, 2].map((i) => { const ph = (t * 1.8 + i / 3) % 1; return <div key={i} style={{position: 'absolute', left: x - 40 + i * 30 - ph * 20, top: y - 420 - ph * 160, width: 60 + ph * 50, height: 60 + ph * 50, borderRadius: '50%', background: '#BDBDBD', border: `4px solid ${INK}`, opacity: 1 - ph}} />; })}
  </>;
};
// Tiny scooter.
const Scooter = ({x, y, w = 240, t}: {x: number; y: number; w?: number; t: number}) =>
  <svg width={w} height={w * 0.7} viewBox="0 0 200 140" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.7, overflow: 'visible'}}>
    <path d="M30 110 L150 110 L165 60 L180 20" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" /><path d="M165 22 L195 18" stroke={INK} strokeWidth={10} strokeLinecap="round" />
    <path d="M40 100 Q 40 70 80 70 L130 70 L140 100 Z" fill="#7CC4EC" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {[40, 160].map((cx) => <circle key={cx} cx={cx} cy={118} r={20} fill="#333" stroke={INK} strokeWidth={5} />)}
  </svg>;
// Ice stand: "ICE 1 FISH".
const IceStand = ({x, y}: {x: number; y: number}) =>
  <div style={{position: 'absolute', left: x - 220, top: y - 360, width: 440, height: 360}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 440, height: 90, background: 'repeating-linear-gradient(90deg,#D83A2E 0 55px,#fff 55px 110px)', border: `6px solid ${INK}`, borderRadius: '20px 20px 0 0'}} />
    <div style={{position: 'absolute', left: 30, top: 200, width: 380, height: 160, background: '#C99A6B', border: `6px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 60, top: 230, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 64, color: INK}}>ICE 1🐟</div>
    {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 70 + i * 110, top: 140, width: 80, height: 60, background: '#DDF3FD', border: `5px solid ${INK}`, borderRadius: 10}} />)}
  </div>;
const IceBlock = ({x, y, w = 120}: {x: number; y: number; w?: number}) => <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.8, width: w, height: w * 0.8, background: '#DDF3FD', border: `5px solid ${INK}`, borderRadius: 12}} />;
// Bank window with a US flag; shutter slams on "Later".
const BankWin = ({x, y, t, shut}: {x: number; y: number; t: number; shut: number}) =>
  <div style={{position: 'absolute', left: x - 300, top: y - 620, width: 600, height: 620}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 600, height: 620, background: '#EDE6D6', border: `7px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 600, height: 110, background: '#3C3B6E', border: `7px solid ${INK}`, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, textAlign: 'center', lineHeight: '100px'}}>US BANK</div>
    <div style={{position: 'absolute', left: 120, top: 170, width: 360, height: 280, background: '#CFEAF7', border: `7px solid ${INK}`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 360, height: 280 * shut, background: 'repeating-linear-gradient(0deg,#9AA3A8 0 26px,#7F888D 26px 30px)', borderBottom: shut > 0 ? `6px solid ${INK}` : undefined}} />
      {shut > 0.95 && <div style={{position: 'absolute', left: 60, top: 100, width: 240, background: '#fff', border: `6px solid ${RED}`, color: RED, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60, textAlign: 'center', transform: 'rotate(-6deg)'}}>LATER</div>}
    </div>
    <div style={{position: 'absolute', left: 80, top: 450, width: 440, height: 40, background: '#A87459', border: `6px solid ${INK}`}} />
  </div>;
// Simple bar.
const Bar = ({x, w = 190, h, color, label, value, p, top = G}: {x: number; w?: number; h: number; color: string; label: string; value: string; p: number; top?: number}) =>
  <>
    <div style={{position: 'absolute', left: x - w / 2, top: top - h * p, width: w, height: h * p, background: color, border: `6px solid ${INK}`, boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: x - 160, width: 320, top: top - h * p - 80, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, color: INK, opacity: p}}>{value}</div>
    <div style={{position: 'absolute', left: x - 160, width: 320, top: top + 16, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, color: INK}}>{label}</div>
  </>;
// Debt IOU paper.
const IOU = ({x, y, w = 300, rot = 0}: {x: number; y: number; w?: number; rot?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.6, width: w, height: w * 0.6, background: '#FFF8E0', border: `5px solid ${INK}`, transform: `rotate(${rot}deg)`, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: w * 0.2, textAlign: 'center', lineHeight: `${w * 0.6}px`}}>I.O.U.</div>;

// Larry the walrus as the "America man" (navy suit, red tie, flag pin).
const Larry = ({x, y, h = 480, t, open = 0, laugh = 0}: {x: number; y: number; h?: number; t: number; open?: number; laugh?: number}) => <>
  <Walrus id="larry" x={x} y={y} h={h} flip hat={false} pose={{laugh, lids: 0.3, look: -0.8, mouth: laugh ? 0.4 : 0}} />
  <Suit x={x} y={y} h={h} t={t} open={open} />
</>;

// ---------- scenes ----------
// Prices (lines 2-3): real pumps with flags, Doug between.
const Prices = ({t}: {t: number}) => <>
  <FlagPump x={270} y={1300} price="$4.33" flag="us" top={RED} t={t} color={RED} fill={ease((t - P(2)) / 1.6)} />
  {t >= P(3) && <FlagPump x={810} y={1300} price="$0.13" flag="ve" top="#F5C518" t={t} color={GREEN} fill={ease((t - P(3)) / 1.4)} />}
  <Penguin id="doug" x={540} y={1330} h={260} pose={{turn: t >= P(3) ? 0.5 : -0.5, look: [t >= P(3) ? 0.8 : -0.8, -0.3], eyeScale: 1.2, brows: 'shock'}} />
  <Note text="AAA Oct 2026 · GlobalPetrolPrices" />
</>;

const Intro = ({t}: {t: number}) => <>
  <Ground />
  <PoleFlag x={760} y={G} flag="ve" t={t} h={560} />
  <Penguin id="doug" x={440} y={G} h={520} pose={{beak: 'smile', brows: 'happy', flapR: 60 + Math.sin(t * 8) * 20}} />
  <BigWord text="Doug" x={440} y={560} at={P(4)} until={P(5)} size={150} />
  <BigWord text="Venezuela" x={540} y={560} at={P(5) + 0.2} size={130} color={GREEN} />
</>;

const Reserves = ({t}: {t: number}) => {
  const a = ease((t - P(6) - 0.2) / 1.2), b = ease((t - P(7)) / 0.6), c = ease((t - P(7) - 0.9) / 0.6);
  const smash = a > 0.92;
  return <>
    <Ground />
    <BigWord text="most oil in the world" x={700} y={420} at={P(6)} size={70} />
    <Bar x={220} h={860} color="#F5C518" label="VENEZUELA" value="303B" p={a} />
    <Bar x={540} h={560} color="#2E9E4F" label="SAUDI" value="267B" p={b} />
    <Bar x={860} h={110} color="#3C6DB5" label="USA" value="~45B" p={c} />
    {smash && <BigWord text="💥" x={220} y={330} at={P(6) + 1.3} size={150} />}
    {smash && <Penguin id="doug" x={300} y={G} h={240} pose={{turn: 0.3, look: [-0.3, -1], eyeScale: 1.3, brows: 'shock'}} />}
    <Note text="proven reserves · OPEC" />
  </>;
};

const NoMoney = ({t}: {t: number}) => {
  const poor = t >= P(9);
  return <>
    <Ground />
    {[0, 1, 2, 3, 4, 5].map((i) => <OilBarrel key={i} x={700 + (i % 3) * 120 - (i > 2 ? -60 : 0)} y={G - (i > 2 ? 200 : 0)} w={130} />)}
    <Penguin id="doug" x={330} y={G} h={480} pose={poor ? {lids: 0.4, brows: 'worried', beak: 'frown', look: [0, 0.6]} : {beak: 'smile', brows: 'happy', flapR: 110}} />
    <BigWord text="oil ✓" x={780} y={620} at={P(8)} size={110} color={GREEN} />
    {poor && <><WalletBox x={590} y={G - 20} w={200} t={t} /><Moth x={590} y={G - 140} at={P(9) + 0.3} t={t} /></>}
    <BigWord text="money ✗" x={330} y={560} at={P(9)} size={110} color={RED} />
  </>;
};

const SellIce = ({t}: {t: number}) => {
  const k = (i: number) => t > P(10) + 0.6 + i * 0.5;
  return <>
    <Ground />
    <IceStand x={300} y={G} />
    <Penguin id="doug" x={300} y={G - 120} h={300} pose={{beak: 'smile', brows: 'happy', flapR: 120 + Math.sin(t * 10) * 15}} />
    <BigSeal id="sea" x={700} y={G} h={360} flip />
    {k(0) && <IceBlock x={700} y={G - 330} w={150} />}
    <Seagull id="gul" x={930} y={G} h={300} flip pose={{angry: false}} />
    {k(1) && <IceBlock x={930} y={G - 290} w={130} />}
    {t > P(10) + 1.6 && <Stamp text="EVERYONE HAS ICE" x={600} y={560} at={P(10) + 1.6} color={RED} size={64} rot={-6} />}
  </>;
};

const PipeScene = ({t}: {t: number}) => {
  const push = Math.sin(t * 7) * 6;
  return <>
    <Island cx={290} seed={2} />
    <PoleFlag x={60} y={TOP + 10} flag="ve" t={t} h={420} />
    <Pipe x1={460} x2={1180} top={TOP + 10} bottom={1450} t={t} />
    <Penguin id="doug" x={250 + push * 0.4} y={TOP + 26} h={400} pose={{side: true, turn: 1, lean: 14}} />
    <OilBarrel x={430 + push} y={TOP + 28} w={160} rot={push * 0.5} />
    {t >= P(12) && <svg width={300} height={200} viewBox="0 0 190 120" style={{position: 'absolute', left: 760, top: 900}}><UsFlag /></svg>}
    <BigWord text="→ USA" x={830} y={1180} at={P(12)} size={110} color={RED} />
  </>;
};

const ThankYou = ({t}: {t: number}) => <>
  <Ground />
  <Larry x={660} y={G} h={560} t={t} open={ease((t - P(13)) / 0.3)} laugh={0.5} />
  <OilBarrel x={560} y={G} w={170} />
  <Penguin id="doug" x={200} y={G} h={300} pose={{turn: 0.5, look: [0.8, -0.3], brows: 'worried', lids: 0.2}} />
  <BigWord text='"THANK YOU, DOUG"' x={600} y={500} at={P(13) + 0.3} size={78} />
  {t > P(13) + 1.2 && <BigWord text="...you're welcome?" x={330} y={880} at={P(13) + 1.2} size={56} rot={4} />}
</>;

const Sell = ({t}: {t: number}) => {
  const bank = t >= P(15);
  return <>
    <Ground />
    {!bank ? <>
      <Larry x={380} y={G} h={480} t={t} />
      <OilBarrel x={700} y={G} w={150} />
      <MoneyBag x={860} y={G - 30} w={210} label="$" />
      <BigWord text="SOLD" x={720} y={700} at={P(14) + 0.5} size={120} color={GREEN} />
    </> : <>
      <IceBank x={720} y={G} w={560} id="usb" />
      <svg width={260} height={170} viewBox="0 0 190 120" style={{position: 'absolute', left: 600, top: 560}}><UsFlag /></svg>
      {[0, 1, 2].map((i) => <MoneyBag key={i} x={lerp(160, 640, ease((t - P(15) - i * 0.3) / 0.7))} y={G - 40 - Math.sin(ease((t - P(15) - i * 0.3) / 0.7) * Math.PI) * 220} w={140} label="$" />)}
      <BigWord text="US bank account" x={540} y={420} at={P(15) + 0.2} size={84} />
    </>}
  </>;
};

const Window = ({t}: {t: number}) => {
  const shut = ease((t - P(17) - 0.1) / 0.18);
  return <>
    <Ground color="#EFE7D8" />
    <BankWin x={620} y={G} t={t} shut={shut} />
    <Penguin id="doug" x={250} y={G} h={420} pose={shut > 0.9 ? {brows: 'shock', eyeScale: 1.4, beak: 'frown', squash: 0.1} : {turn: 0.4, look: [0.7, -0.4], brows: 'worried', flapR: 100}} />
    {t < P(17) && <BigWord text='"where my money?"' x={420} y={520} at={P(16) + 0.2} size={70} />}
  </>;
};

const Waiting = ({t}: {t: number}) => {
  const d = t - P(18), months = d < 0.9 ? 1 : d < 1.7 ? 2 : 12, snow = cl(d / 2.4);
  return <>
    <Ground color="#EFE7D8" />
    <div style={{position: 'absolute', left: 640, top: 520, width: 300, height: 330, background: '#fff', border: `7px solid ${INK}`, borderRadius: 16, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900}}>
      <div style={{background: RED, color: '#fff', fontSize: 50, borderBottom: `7px solid ${INK}`}}>MONTH</div>
      <div style={{fontSize: 170, lineHeight: '230px', color: INK}}>{months}</div>
    </div>
    <Penguin id="doug" x={330} y={G} h={440} pose={{lids: 0.55, brows: 'worried', beak: 'frown', sit: 0}} />
    <div style={{position: 'absolute', left: 230, top: G - 450 - 120 * snow, width: 200, height: 40 + 140 * snow, background: '#fff', border: `5px solid ${INK}`, borderRadius: '50% 50% 20% 20%', opacity: snow > 0.05 ? 1 : 0}} />
    {t > P(18) + 1.8 && <BigWord text="still waiting..." x={540} y={420} at={P(18) + 1.8} size={90} color={RED} />}
  </>;
};

const RealLife = ({t}: {t: number}) => {
  const a = ease((t - P(19) - 0.8) / 1), b = ease((t - P(20) - 0.4) / 0.6);
  return <>
    <Ground />
    <BigWord text="real life" x={540} y={330} at={P(19)} size={100} />
    <Bar x={330} w={260} h={760} color="#F5C518" label="SOLD 2025" value="$18.2B" p={a} />
    {t >= P(20) && <Bar x={770} w={260} h={24} color={GREEN} label="GOT BACK" value="$0.5B" p={b} />}
    {t >= P(20) + 1 && <BigWord text="?!" x={770} y={980} at={P(20) + 1} size={160} color={RED} />}
    <Note text="Venezuela Central Bank · US Energy Dept (Jul 2026)" />
  </>;
};

const Math_ = ({t}: {t: number}) => <>
  <Ground />
  <Penguin id="doug" x={300} y={G} h={420} pose={{turn: 0.4, look: [0.8, 0.2], brows: t > P(21) + 0.8 ? 'shock' : 'worried', eyeScale: t > P(21) + 0.8 ? 1.4 : 1, sweat: true}} />
  <Calculator x={720} y={G - 40} t={t} at={P(21) + 0.1} />
</>;

const Poor = ({t}: {t: number}) => <>
  <Penguin id="doug" x={540} y={G + 300} h={950} pose={{lids: 0.35, brows: 'worried', beak: 'frown', tears: true}} />
  <WalletBox x={820} y={1300} w={220} t={t} />
  <Moth x={820} y={1180} at={P(22) + 0.1} t={t} />
  <BigWord text="Doug poor." x={540} y={360} at={P(22)} size={130} color={RED} />
</>;

const Truck = ({t}: {t: number}) => {
  const run = t >= P(24) - 0.2, d = cl((t - P(24) + 0.2) / 1.8);
  return <>
    <Ground />
    <Pickup x={380} y={G} w={560} t={t} />
    <Pump x={800} y={G} t={t} run={run && d < 1} dollars={d * 129.9} />
    <Larry x={980} y={G} h={400} t={t} laugh={0.3} />
    <BigWord text="30 gallons" x={420} y={620} at={P(24)} size={100} />
    {d >= 1 && <BigWord text="$130" x={540} y={460} at={P(24) + 1.6} size={160} color={RED} />}
  </>;
};

const ScooterScene = ({t}: {t: number}) => {
  const drop = cl((t - P(25) - 0.6) / 0.5);
  return <>
    <Ground />
    <Scooter x={460} y={G} w={300} t={t} />
    <Penguin id="doug" x={440} y={G - 90} h={300} pose={{side: true, turn: 1, beak: 'smile', brows: 'happy'}} />
    <Pump x={800} y={G} t={t} run={false} dollars={0.04} />
    {drop > 0 && drop < 1 && <div style={{position: 'absolute', left: 760, top: lerp(1000, 1150, drop), width: 22, height: 30, background: OIL, border: `3px solid ${INK}`, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'}} />}
    <BigWord text="4¢" x={540} y={560} at={P(25) + 1.1} size={190} color={GREEN} />
  </>;
};

// Callback: the user's picture again with the big why.
const WhyAgain = ({t}: {t: number}) => <>
  <Why t={t - P(26)} />
  <img src={IMG} style={{position: 'absolute', left: 0, top: IMG_TOP, width: 1080, height: IH * K}} />
  <OilFlow t={t} fast={1} />
</>;

const Debt = ({t}: {t: number}) => {
  const lend = (i: number) => t > P(28) + i * 0.5;
  return <>
    <Ground />
    <BigWord text="$150 BILLION" x={540} y={360} at={P(27) + 0.2} size={120} color={RED} />
    {Array.from({length: 7}, (_, i) => <IOU key={i} x={260 + (i % 2) * 20} y={G - i * 70} w={260} rot={(i % 3 - 1) * 5} />)}
    <Penguin id="doug" x={260} y={G - 480} h={220} pose={{brows: 'shock', eyeScale: 1.3, sweat: true}} />
    {lend(0) && <><Seagull id="c1" x={620} y={G} h={300} flip /><div style={{position: 'absolute', left: 540, top: G - 360, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40}}>CHINA</div></>}
    {lend(1) && <><Fox x={800} y={G} h={360} flip sly={1} /><div style={{position: 'absolute', left: 735, top: G - 410, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40}}>BANKS</div></>}
    {lend(2) && <>{[0, 1, 2].map((i) => <BigSeal key={i} id={`e${i}`} x={930 + i * 90} y={G} h={200} flip />)}<div style={{position: 'absolute', left: 830, top: G - 270, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36}}>EVERYONE</div></>}
  </>;
};

const WalletScene = ({t}: {t: number}) => {
  const empty = t >= P(30) + 0.8;
  return <>
    <Ground />
    <Larry x={330} y={G} h={520} t={t} laugh={0.6} />
    <WalletBox x={360} y={G - 380} w={330} full t={t} />
    <BigWord text="America hold the wallet" x={540} y={380} at={P(29)} until={P(30)} size={64} />
    {t >= P(30) && <><Penguin id="doug" x={820} y={G} h={360} pose={{lids: 0.4, brows: 'worried', beak: 'frown', look: [0, 0.6]}} /><WalletBox x={820} y={G - 50} w={150} t={t} /></>}
    {empty && <Moth x={820} y={G - 160} at={P(30) + 0.8} t={t} />}
    {t >= P(30) && <BigWord text="Big wallet. Doug wallet empty." x={540} y={420} at={P(30)} size={56} color={RED} />}
  </>;
};

const PayBack = ({t}: {t: number}) => {
  const push = Math.sin(t * 7) * 6, cta = t >= P(32);
  return <>
    <Island cx={290} seed={3} />
    <Pipe x1={460} x2={1180} top={TOP + 10} bottom={1450} t={t} />
    {!cta ? <>
      <Penguin id="doug" x={250 + push * 0.4} y={TOP + 26} h={400} pose={{side: true, turn: 1, lean: 14, brows: 'worried', sweat: true}} />
      <OilBarrel x={430 + push} y={TOP + 28} w={160} rot={push * 0.5} />
      <Stamp text="PAY BACK" x={760} y={760} at={P(31) + 0.2} color={RED} size={100} />
    </> : <>
      <Penguin id="doug" x={300} y={TOP + 26} h={460} pose={{flapR: 130 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
      <BigWord text="is this fair?" x={540} y={520} at={P(32)} size={110} />
      <BigWord text="👇" x={760} y={900} at={P(32) + 0.3} size={150} />
    </>}
  </>;
};

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(2), set: (t) => <Prices t={t} />, fx_: 'zoom'},
  {at: P(4), set: (t) => <Intro t={t} />, fx_: 'swipe'},
  {at: P(6), set: (t) => <Reserves t={t} />, fx_: 'pop'},
  {at: P(8), set: (t) => <NoMoney t={t} />, fx_: 'swipeL'},
  {at: P(10), set: (t) => <SellIce t={t} />, fx_: 'iris'},
  {at: P(11), set: (t) => <PipeScene t={t} />, fx_: 'swipe'},
  {at: P(13), set: (t) => <ThankYou t={t} />, fx_: 'zoom'},
  {at: P(14), set: (t) => <Sell t={t} />, fx_: 'swipeL'},
  {at: P(16), set: (t) => <Window t={t} />, fx_: 'pop'},
  {at: P(18), set: (t) => <Waiting t={t} />, fx_: 'iris'},
  {at: P(19), set: (t) => <RealLife t={t} />, fx_: 'swipe'},
  {at: P(21), set: (t) => <Math_ t={t} />, fx_: 'zoom'},
  {at: P(22), set: (t) => <Poor t={t} />, fx_: 'zoom'},
  {at: P(23), set: (t) => <Truck t={t} />, fx_: 'swipeL'},
  {at: P(25), set: (t) => <ScooterScene t={t} />, fx_: 'pop'},
  {at: P(26), set: (t) => <WhyAgain t={t} />, fx_: 'iris'},
  {at: P(27), set: (t) => <Debt t={t} />, fx_: 'swipe'},
  {at: P(29), set: (t) => <WalletScene t={t} />, fx_: 'swipeL'},
  {at: P(31), set: (t) => <PayBack t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[3, 810, 1000, 1.35], [9, 460, 1100, 1.4], [17, 620, 1000, 1.35], [21, 600, 1050, 1.3], [25, 620, 1100, 1.35], [28, 760, 1100, 1.35], [30, 820, 1150, 1.5]];

export const DougOil = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push to the poor island, swing to the rich one, pull back to the pipe on "for free?"
    const L = ease((tc - 0.6) / 0.45) * (tc < RICH ? 1 : 0), R = ease((tc - RICH) / 0.4) * (tc < FREE ? 1 : 0), F = ease((tc - FREE) / 0.3);
    s0 = 1 + 0.2 * (L + R) + 0.12 * F; fx = 540 - 250 * L + 250 * R + (ix(800) - 540) * F; fy = 960 + 160 * (L + R) + (iy(800) - 960) * F * 0.6;
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
    <Sfx at={FREE + 0.1} name="user-slap" vol={0.35} />
    <Sfx at={P(2) + 0.4} name="user-cash-register" vol={0.3} />
    <Sfx at={P(3) + 0.4} name="user-ting" vol={0.35} />
    <Sfx at={P(4)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(6) + 1.3} name="user-boom" vol={0.4} />
    <Sfx at={P(7)} name="user-wow" vol={0.3} />
    <Sfx at={P(9)} name="user-wrong" vol={0.35} />
    <Sfx at={P(9) + 0.3} name="user-aww" vol={0.35} />
    <Sfx at={P(10) + 1.6} name="user-horn" vol={0.35} />
    <Sfx at={P(11)} name="pop-high" vol={0.3} />
    <Sfx at={P(13) + 0.3} name="walrus-laugh" vol={0.35} />
    <Sfx at={P(14) + 0.5} name="user-cash-register" vol={0.35} />
    <Sfx at={P(15)} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(16)} name="user-notif" vol={0.3} />
    <Sfx at={P(17) + 0.1} name="user-slap" vol={0.45} />
    <Sfx at={P(18)} name="user-timer" vol={0.35} />
    <Sfx at={P(19)} name="user-ting" vol={0.35} />
    <Sfx at={P(20) + 0.4} name="user-wrong" vol={0.35} />
    <Sfx at={P(21) + 0.85} name="user-boom" vol={0.45} />
    <Sfx at={P(22)} name="user-fahh" vol={0.45} />
    <Sfx at={P(24) + 1.6} name="user-cash-register" vol={0.35} />
    <Sfx at={P(25) + 1.1} name="pop-high" vol={0.4} />
    <Sfx at={P(26)} name="user-ting" vol={0.35} />
    <Sfx at={P(27) + 0.2} name="user-boom" vol={0.4} />
    <Sfx at={P(28)} name="gull-caw" vol={0.35} />
    <Sfx at={P(29)} name="walrus-laugh" vol={0.35} />
    <Sfx at={P(30) + 0.8} name="user-aww" vol={0.35} />
    <Sfx at={P(31) + 0.2} name="user-slap" vol={0.35} />
    <Sfx at={P(32)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
