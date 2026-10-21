// EP7 "Overdraft: Poor Doug vs Rich Doug" — same $6 coffee, poor pays $41 (overdraft fee), rich pays $6. Hook first (approval), full episode after.
// Line timings: studio/src/data/doug-coffee.json (free Kokoro am_michael 1.1 VO, one line per phrase).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Walrus} from '../penguin/cast';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-coffee.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_COFFEE_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1420;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';

// ---------- hook props (POOR vs RICH layout from the user's 13.8K video + versus rules) ----------
const Vs = ({x, y, t}: {x: number; y: number; t: number}) => {
  const p = ease((t - 0.5) / 0.3);
  return <div style={{position: 'absolute', left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: '50%', background: RED, border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 66, color: '#fff', transform: `scale(${p}) rotate(${-8 + Math.sin(t * 4) * 3}deg)`}}>VS</div>;
};
// Coffee-chain cup (generic, no real logo): white cup, dome lid, kraft sleeve, green round badge with a white star. (x, y) = bottom centre.
export const Coffee = ({x, y, w = 150, t, rot = 0}: {x: number; y: number; w?: number; t: number; rot?: number}) =>
  <svg width={w} height={w * 1.7} viewBox="0 0 100 170" style={{position: 'absolute', left: x - w / 2, top: y - w * 1.7, overflow: 'visible', transform: `rotate(${rot}deg)`, transformOrigin: '50% 100%'}}>
    {[0, 1, 2].map((i) => <path key={i} d={`M${34 + i * 16} ${-4 - ((t * 30 + i * 9) % 14)} c -8 -10, 8 -16, 0 -26`} fill="none" stroke="#9AA3AB" strokeWidth={4} strokeLinecap="round" opacity={0.8} />)}
    <path d="M14 40 L86 40 L76 166 L24 166 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M17 84 L83 84 L80 126 L20 126 Z" fill="#C79A6B" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={50} cy={62} r={17} fill="#00704A" stroke={INK} strokeWidth={4} />
    <path d="M50 51 L53.5 58.5 L61.5 59 L55.3 64 L57.5 72 L50 67.5 L42.5 72 L44.7 64 L38.5 59 L46.5 58.5 Z" fill="#fff" />
    <path d="M8 40 L92 40 L88 26 L12 26 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M18 26 Q50 2 82 26 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={50} cy={10} r={4} fill={INK} />
  </svg>;
// Poor clothes: torn grey tee with holes over Doug's belly. Matches Penguin h (feet at y).
const Rags = ({x, y, h}: {x: number; y: number; h: number}) => {
  const s = h / 520;
  return <svg width={240 * s} height={220 * s} viewBox="0 0 240 220" style={{position: 'absolute', left: x - 120 * s, top: y - 0.44 * h}}>
    <path d="M30 20 Q120 0 210 20 L222 190 L196 176 L176 200 L150 180 L120 205 L94 182 L66 202 L44 180 L18 192 Z" fill="#E6E2D8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M70 70 l14 -6 l6 16 l-12 10 z M150 110 l18 4 l-6 18 l-16 -8 z" fill="#2E2E2E" stroke={INK} strokeWidth={3} />
    <path d="M110 40 l6 12 M126 140 l-8 10" stroke={INK} strokeWidth={4} strokeLinecap="round" />
  </svg>;
};

// ---------- sets ----------
// Big clear price, no box: coloured Montserrat with a thick ink outline.
const Price = ({text, x, y, t, at, color}: {text: string; x: number; y: number; t: number; at: number; color: string}) => {
  const p = ease((t - at) / 0.2);
  return <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 190, lineHeight: '190px', color, WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill', opacity: p, transform: `scale(${0.4 + 0.6 * p}) rotate(${color === RED ? -4 : 4}deg)`}}>{text}</div>;
};
const Word = ({text, x, y, t, at, color}: {text: string; x: number; y: number; t: number; at: number; color: string}) => {
  const p = ease((t - at) / 0.2);
  return <div style={{position: 'absolute', left: x - 250, width: 500, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 120, lineHeight: '120px', color, opacity: p, transform: `scale(${0.5 + 0.5 * p})`}}>{text}</div>;
};
// Coffee-shop counter with card reader; (x, y) = bottom-left.
const Counter = ({x, y, w = 170}: {x: number; y: number; w?: number}) => <>
  <div style={{position: 'absolute', left: x, top: y - 260, width: w, height: 260, background: '#5B8C5A', border: `6px solid ${INK}`, borderRadius: 8, boxSizing: 'border-box', backgroundImage: `repeating-linear-gradient(90deg, transparent 0 40px, rgba(0,0,0,0.25) 40px 44px)`}} />
  <div style={{position: 'absolute', left: x - 12, top: y - 290, width: w + 24, height: 36, background: '#8A5A3B', border: `6px solid ${INK}`, borderRadius: 8, boxSizing: 'border-box'}} />
  <div style={{position: 'absolute', left: x + 6, top: y - 400, width: 70, height: 112, background: '#3A3F46', border: `6px solid ${INK}`, borderRadius: 10, boxSizing: 'border-box'}}>
    <div style={{margin: '8px auto 0', width: 44, height: 28, background: '#8EE08A', border: `3px solid ${INK}`, borderRadius: 4}} />
  </div>
</>;
// Larry the walrus as barista: green apron + cap, behind the counter.
const Barista = ({x, y, h, t, happy}: {x: number; y: number; h: number; t: number; happy?: boolean}) => <>
  <Walrus id="larry" x={x} y={y} h={h} hat={false} pose={{mouth: happy ? 0.4 : 0.1, lids: happy ? 0.2 : 0.55, laugh: happy ? 0.5 : 0, look: -0.6}} />
  <div style={{position: 'absolute', left: x - h * 0.32, top: y - h * 0.42, width: h * 0.5, height: h * 0.45, background: '#00704A', border: `5px solid ${INK}`, borderRadius: '14px 14px 30px 30px', boxSizing: 'border-box'}} />
</>;
const Card = ({x, y, rot, gold}: {x: number; y: number; rot: number; gold?: boolean}) =>
  <div style={{position: 'absolute', left: x - 62, top: y - 40, width: 124, height: 80, background: gold ? '#F2C230' : '#9AA7B5', border: `6px solid ${INK}`, borderRadius: 12, boxSizing: 'border-box', transform: `rotate(${rot}deg)`, boxShadow: gold ? '0 0 30px 8px rgba(255,214,70,0.8)' : 'none'}}>
    <div style={{position: 'absolute', left: 14, top: 22, width: 26, height: 20, background: gold ? '#fff' : '#C9CED4', border: `3px solid ${INK}`, borderRadius: 4}} />
    {!gold && <div style={{position: 'absolute', left: 50, top: -8, width: 26, height: 84, background: 'rgba(240,220,150,0.85)', transform: 'rotate(20deg)'}} />}
  </div>;
// Poor: flies buzzing round the head. Rich: gold sparkles + chain.
const Flies = ({x, y, t}: {x: number; y: number; t: number}) => <>
  {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: x + Math.sin(t * 7 + i * 2.1) * 80, top: y + Math.cos(t * 9 + i * 1.7) * 40, width: 14, height: 14, borderRadius: '50%', background: INK, boxShadow: '-8px -6px 0 -3px #fff, -8px -6px 0 -1px #555'}} />)}
</>;
const Bling = ({x, y, t}: {x: number; y: number; t: number}) => <>
  {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: x - 170 + i * 110, top: y - (i % 2) * 90, fontSize: 64, transform: `scale(${0.6 + 0.4 * Math.abs(Math.sin(t * 5 + i))})`}}>✨</div>)}
</>;
const FORTY1 = P(0) + 1.15, RICH = P(1), SAME = P(1) + 1.75;
// Clean versus hook (user ref: "Cash vs Card" 16.1K): chain coffee + big price, POOR vs RICH, dotted line, Doug paying Larry the barista. No extra text.
const Hook = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: -400, top: -400, width: 940, height: 2800, background: '#ECEAE4'}} />
  <div style={{position: 'absolute', left: 540, top: -400, width: 940, height: 2800, background: '#FFF4CF'}} />
  <Coffee x={270} y={400} w={170} t={t} rot={-4} />
  <Coffee x={810} y={400} w={170} t={t} rot={4} />
  <Price text="$41" x={270} y={420} t={t} at={0.05} color={RED} />
  <Price text="$6" x={810} y={420} t={t} at={0.15} color={GREEN} />
  <Word text="POOR" x={250} y={650} t={t} at={0.25} color={RED} />
  <Word text="RICH" x={830} y={650} t={t} at={0.35} color={GREEN} />
  <div style={{position: 'absolute', left: 536, top: 800, width: 8, height: 660, backgroundImage: `repeating-linear-gradient(180deg, ${INK} 0 26px, transparent 26px 44px)`}} />
  <Vs x={540} y={710} t={t} />
  {/* poor side (clipped to its half, like the ref's cut-off cashier) */}
  <div style={{position: 'absolute', left: 0, top: 760, width: 536, height: 900, overflow: 'hidden'}}><div style={{position: 'absolute', left: 0, top: -760, width: 1080, height: 1920}}>
    <Barista x={450} y={G - 210} h={360} t={t} />
    <Counter x={240} y={G} />
    <Penguin id="doug" x={125} y={G} h={430} build="thin" pose={{look: [0.6, -0.1], brows: 'worried', beak: 'frown', tears: true, lids: 0.35, flapR: 75}} />
    <Rags x={125} y={G} h={430} />
    <Flies x={115} y={G - 470} t={t} />
    <Card x={240} y={G - 330} rot={-14} />
  </div></div>
  {/* rich side */}
  <div style={{position: 'absolute', left: 544, top: 760, width: 536, height: 900, overflow: 'hidden'}}><div style={{position: 'absolute', left: -544, top: -760, width: 1080, height: 1920}}>
    <Barista x={990} y={G - 210} h={360} t={t} happy />
    <Counter x={800} y={G} />
    <Penguin id="doug" x={690} y={G} h={430} build="fat" outfit="rich" pose={{look: [0.6, -0.1], brows: 'happy', beak: 'smile', lids: 0.3, blush: 1, flapR: 75}} />
    <svg width={200} height={120} style={{position: 'absolute', left: 590, top: G - 250}}><path d="M10 10 Q100 110 190 10" fill="none" stroke="#E2B227" strokeWidth={12} strokeDasharray="14 6" strokeLinecap="round" /></svg>
    <Bling x={700} y={G - 560} t={t} />
    <Card x={800} y={G - 330} rot={-14} gold />
  </div></div>
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [];

export const DougCoffee = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: strong zoom toward POOR on "$41", swing to RICH, zoom out to both on "same coffee"
    const toP = ease((tc - FORTY1 + 0.2) / 0.35) * (tc < RICH ? 1 : 0), toR = ease((tc - RICH) / 0.35) * (tc < SAME ? 1 : 0), out = ease((tc - SAME) / 0.3);
    const z = Math.max(toP, toR) * (1 - out);
    s0 = 1 + 0.22 * z; fx = 540 + (toR > 0 ? 270 * toR : -270 * toP) * (1 - out); fy = 960 + 20 * z;
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
    <Audio src={staticFile('doug-coffee-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.2} name="swoosh-fast" vol={0.3} />
    <Sfx at={FORTY1} name="user-cash-register" vol={0.4} />
    <Sfx at={FORTY1 + 0.4} name="user-boom" vol={0.4} />
    <Sfx at={RICH} name="user-whoosh" vol={0.3} />
    <Sfx at={P(1) + 1.0} name="user-money" vol={0.35} />
  </AbsoluteFill>;
};
