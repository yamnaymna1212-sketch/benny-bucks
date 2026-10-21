// EP7 "Overdraft: Poor Doug vs Rich Doug" — same $6 coffee, poor pays $41 (overdraft fee), rich pays $6. Hook first (approval), full episode after.
// Line timings: studio/src/data/doug-coffee.json (free Kokoro am_michael 1.1 VO, one line per phrase).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Puffin, Walrus} from '../penguin/cast';
import {BigWord, FishFlight, Igloo, PriceTag, Stamp, Title, Vault} from '../penguin/world';
import {Bill, Fox} from './dougLaundering';
import {MoneyBag} from './dougGas';
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
// Snow world: sky + far ice hills + snow ground. mood: cold (grey poor sky), sun (bright rich sky), storm (dark).
const SKY = {day: ['#BFE6FA', '#F2FAFE'], cold: ['#B9C6CF', '#E6ECF0'], sun: ['#8FD3F7', '#E9F7FF'], storm: ['#4A5560', '#8A96A0']};
const World = ({mood = 'day', x0 = -400, w = 1880, ground = G}: {mood?: keyof typeof SKY; x0?: number; w?: number; ground?: number}) => <>
  <div style={{position: 'absolute', left: x0, top: -400, width: w, height: ground + 400, background: `linear-gradient(180deg, ${SKY[mood][0]}, ${SKY[mood][1]})`}} />
  <svg width={w} height={260} viewBox={`0 0 ${w} 260`} style={{position: 'absolute', left: x0, top: ground - 250}}>
    <path d={`M0 260 L0 150 Q ${w * 0.12} 40 ${w * 0.25} 140 Q ${w * 0.4} 60 ${w * 0.55} 150 Q ${w * 0.72} 30 ${w * 0.85} 130 Q ${w * 0.95} 90 ${w} 140 L${w} 260 Z`} fill="#DDF0FA" stroke="#9CC9E2" strokeWidth={5} />
  </svg>
  <div style={{position: 'absolute', left: x0, top: ground, width: w, height: 1200, background: '#F2FAFE', borderTop: `5px solid ${INK}`}} />
</>;
const Flakes = ({t, x0 = 0, w = 1080}: {t: number; x0?: number; w?: number}) => <>
  {Array.from({length: 14}, (_, i) => <div key={i} style={{position: 'absolute', left: x0 + ((i * 137) % w) + Math.sin(t * 2 + i) * 20, top: ((i * 211 + t * 160) % 1500) - 50, width: 14, height: 14, borderRadius: '50%', background: '#fff', border: '2px solid #9AA7B5'}} />)}
</>;
const Sun = ({x, y, t}: {x: number; y: number; t: number}) => <svg width={220} height={220} viewBox="-110 -110 220 220" style={{position: 'absolute', left: x - 110, top: y - 110}}>
  <g transform={`rotate(${t * 20})`}>{Array.from({length: 10}, (_, i) => <path key={i} d="M0 -100 L0 -76" transform={`rotate(${i * 36})`} stroke="#F2B21B" strokeWidth={10} strokeLinecap="round" />)}</g>
  <circle r={60} fill="#FFD23F" stroke={INK} strokeWidth={6} />
</svg>;
const Why = ({t}: {t: number}) => { const p = ease(t / 0.25);
  return <div style={{position: 'absolute', left: 340, width: 400, top: 40, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 160, lineHeight: '170px', color: INK, letterSpacing: -4, WebkitTextStroke: '6px #fff', paintOrder: 'stroke fill', transform: `scale(${0.6 + 0.4 * p}) rotate(-4deg)`, opacity: p}}>why<span style={{color: RED}}>?</span></div>; };
// Clean versus hook (user ref: "Cash vs Card" 16.1K): why? on top, chain coffee + big price, POOR vs RICH, dotted line, Doug paying Larry the barista.
const Hook = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: -400, top: -400, width: 940, height: 2800, overflow: 'hidden'}}><div style={{position: 'absolute', left: 400, top: 400}}><World mood="cold" x0={-400} w={940} /><Flakes t={t} w={540} /></div></div>
  <div style={{position: 'absolute', left: 540, top: -400, width: 940, height: 2800, overflow: 'hidden'}}><div style={{position: 'absolute', left: -540, top: 400}}><World mood="sun" x0={540} w={940} /><Sun x={1010} y={1080} t={t} /></div></div>
  <Why t={t} />
  <Coffee x={250} y={400} w={170} t={t} rot={-4} />
  <Coffee x={830} y={400} w={170} t={t} rot={4} />
  <Price text="$41" x={260} y={420} t={t} at={0.05} color={RED} />
  <Price text="$6" x={820} y={420} t={t} at={0.15} color={GREEN} />
  <Word text="POOR" x={250} y={650} t={t} at={0.25} color={RED} />
  <Word text="RICH" x={830} y={650} t={t} at={0.35} color={GREEN} />
  <div style={{position: 'absolute', left: 536, top: 800, width: 8, height: 660, backgroundImage: `repeating-linear-gradient(180deg, ${INK} 0 26px, transparent 26px 44px)`}} />
  <Vs x={540} y={710} t={t} />
  <div style={{position: 'absolute', left: 0, top: 760, width: 536, height: 900, overflow: 'hidden'}}><div style={{position: 'absolute', left: 0, top: -760, width: 1080, height: 1920}}>
    <PoorSide t={t} />
  </div></div>
  <div style={{position: 'absolute', left: 544, top: 760, width: 536, height: 900, overflow: 'hidden'}}><div style={{position: 'absolute', left: -544, top: -760, width: 1080, height: 1920}}>
    <RichSide t={t} />
  </div></div>
</>;
const PoorDoug = ({x, y = G, h = 430, t, pose = {}}: {x: number; y?: number; h?: number; t: number; pose?: object}) => <>
  <Penguin id="doug" x={x} y={y} h={h} build="thin" pose={{brows: 'worried', beak: 'frown', lids: 0.35, ...pose}} />
  <Rags x={x} y={y} h={h} />
  <Flies x={x - 10} y={y - h * 1.1} t={t} />
</>;
const RichDoug = ({x, y = G, h = 430, t, pose = {}}: {x: number; y?: number; h?: number; t: number; pose?: object}) => <>
  <Penguin id="doug" x={x} y={y} h={h} build="fat" outfit="rich" pose={{brows: 'happy', beak: 'smile', lids: 0.3, blush: 1, ...pose}} />
  <svg width={h * 0.47} height={h * 0.28} viewBox="0 0 200 120" style={{position: 'absolute', left: x - h * 0.23, top: y - h * 0.4}}><path d="M10 10 Q100 110 190 10" fill="none" stroke="#E2B227" strokeWidth={12} strokeDasharray="14 6" strokeLinecap="round" /></svg>
  <Bling x={x + 10} y={y - h * 1.3} t={t} />
</>;
const PoorSide = ({t, dx = 0}: {t: number; dx?: number}) => <>
  <Barista x={450 + dx} y={G - 210} h={360} t={t} />
  <Counter x={240 + dx} y={G} />
  <PoorDoug x={125 + dx} t={t} pose={{look: [0.6, -0.1], tears: true, flapR: 75}} />
  <Card x={240 + dx} y={G - 330} rot={-14} />
</>;
const RichSide = ({t, dx = 0}: {t: number; dx?: number}) => <>
  <Barista x={990 + dx} y={G - 210} h={360} t={t} happy />
  <Counter x={800 + dx} y={G} />
  <RichDoug x={690 + dx} t={t} pose={{look: [0.6, -0.1], flapR: 75}} />
  <Card x={800 + dx} y={G - 330} rot={-14} gold />
</>;

// ---------- story props ----------
const CoffeeShop = ({x, y, w = 760, t}: {x: number; y: number; w?: number; t: number}) => <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.95, width: w, height: w * 0.95}}>
  <div style={{position: 'absolute', left: 0, right: 0, top: w * 0.25, bottom: 0, background: '#E3F3FB', border: `7px solid ${INK}`, borderRadius: 14, boxSizing: 'border-box', backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 78px, #A9D3EA 78px 82px)'}} />
  <div style={{position: 'absolute', left: w * 0.08, right: w * 0.08, top: w * 0.4, height: w * 0.32, background: '#FFF7E0', border: `7px solid ${INK}`, borderRadius: 10, boxSizing: 'border-box'}} />
  <svg width={w + 40} height={w * 0.22} viewBox="0 0 400 80" preserveAspectRatio="none" style={{position: 'absolute', left: -20, top: w * 0.2}}>
    {Array.from({length: 8}, (_, i) => <path key={i} d={`M${i * 50} 0 L${i * 50 + 50} 0 L${i * 50 + 50} 60 Q${i * 50 + 25} 80 ${i * 50} 60 Z`} fill={i % 2 ? '#fff' : '#00704A'} stroke={INK} strokeWidth={4} />)}
  </svg>
  <div style={{position: 'absolute', left: w / 2 - 90, top: 0, width: 180, height: 180, borderRadius: '50%', background: '#00704A', border: `7px solid ${INK}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 110, lineHeight: 1}}>★</div>
  <div style={{position: 'absolute', left: w * 0.7, top: w * 0.75, width: w * 0.2, height: w * 0.2, background: '#8A5A3B', border: `6px solid ${INK}`, boxSizing: 'border-box', borderRadius: '10px 10px 0 0'}} />
  {[0, 1, 2].map((i) => <Coffee key={i} x={w * 0.2 + i * w * 0.2} y={w * 0.7} w={90} t={t} />)}
</div>;
const Reader = ({x, y, w = 340, ok}: {x: number; y: number; w?: number; ok: boolean}) => <div style={{position: 'absolute', left: x - w / 2, top: y - w * 1.5, width: w, height: w * 1.5, background: '#3A3F46', border: `9px solid ${INK}`, borderRadius: 40, boxSizing: 'border-box'}}>
  <div style={{margin: '30px auto 0', width: w * 0.72, height: w * 0.48, background: ok ? '#5FD068' : '#9FD4A3', border: `6px solid ${INK}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.16, color: INK}}>{ok ? 'OK ✓' : '$6'}</div>
  <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, margin: '30px 34px'}}>{Array.from({length: 9}, (_, i) => <div key={i} style={{height: 34, borderRadius: 8, background: '#6B727B', border: `4px solid ${INK}`}} />)}</div>
</div>;
const BigCard = ({x, y, s = 2.4, rot = -14, gold}: {x: number; y: number; s?: number; rot?: number; gold?: boolean}) => <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: '0 0'}}><Card x={0} y={0} rot={rot} gold={gold} /></div>;
const Phone = ({x, y, w = 420, children}: {x: number; y: number; w?: number; children?: React.ReactNode}) => <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.95, width: w, height: w * 1.9, background: '#22262B', border: `9px solid ${INK}`, borderRadius: 54, boxSizing: 'border-box'}}>
  <div style={{position: 'absolute', left: 22, right: 22, top: 50, bottom: 50, background: '#fff', borderRadius: 26, padding: 22, boxSizing: 'border-box', fontFamily: 'Montserrat', fontWeight: 900, color: INK, textAlign: 'center'}}>
    <div style={{fontSize: 30, color: '#00704A', marginBottom: 14}}>FOX BANK</div>{children}
  </div>
</div>;
const Row = ({label, amount, color = INK, t, at, size = 46}: {label: string; amount: string; color?: string; t: number; at: number; size?: number}) => { const p = ease((t - at) / 0.2);
  return <div style={{display: 'flex', justifyContent: 'space-between', fontSize: size, color, margin: '18px 0', opacity: p, transform: `scale(${0.6 + 0.4 * p})`}}><span>{label}</span><span>{amount}</span></div>; };
const BillPaper = ({x, y, w = 680, t}: {x: number; y: number; w?: number; t: number}) => <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, padding: '34px 46px 40px', background: '#FFFDF5', border: `8px solid ${INK}`, borderRadius: 10, boxSizing: 'border-box', transform: 'rotate(-3deg)', fontFamily: 'Montserrat', fontWeight: 900, color: INK}}>
  <div style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 52}}><span style={{display: 'inline-block', width: 64, height: 64, borderRadius: '50%', background: '#E07B2E', border: `5px solid ${INK}`}} />FOX BANK</div>
  <div style={{height: 6, background: INK, margin: '20px 0 10px'}} />
  <Row label="Coffee" amount="$6" t={t} at={P(10)} size={64} />
  <Row label="FEE" amount="$35" color={RED} t={t} at={P(11)} size={84} />
</div>;
const Gum = ({x, y, w = 120}: {x: number; y: number; w?: number}) => <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.45, width: w, height: w * 0.45, background: '#F48FB1', border: `${Math.max(4, w * 0.05)}px solid ${INK}`, borderRadius: w * 0.08, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.2, color: INK}}>GUM</div>;
const Kettle = ({x, y, t}: {x: number; y: number; t: number}) => <svg width={220} height={200} viewBox="0 0 220 200" style={{position: 'absolute', left: x - 110, top: y - 200, overflow: 'visible'}}>
  {[0, 1].map((i) => <path key={i} d={`M${170 + i * 20} ${40 - ((t * 40 + i * 15) % 30)} c -10 -14, 10 -22, 0 -36`} fill="none" stroke="#9AA3AB" strokeWidth={6} strokeLinecap="round" />)}
  <path d="M40 190 Q20 90 110 80 Q200 90 180 190 Z" fill="#D83A2E" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
  <path d="M175 120 L215 70" stroke={INK} strokeWidth={14} strokeLinecap="round" /><path d="M70 80 Q110 30 150 80" fill="none" stroke={INK} strokeWidth={9} />
</svg>;
const Box3 = ({x, y, w = 360, label, t}: {x: number; y: number; w?: number; label: string; t: number}) => <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.9, width: w, height: w * 0.9, background: '#C79A6B', border: `8px solid ${INK}`, borderRadius: 10, boxSizing: 'border-box', transform: `rotate(${Math.sin(t * 3) * 2}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.14, color: INK, textAlign: 'center', lineHeight: 1.1, whiteSpace: 'pre-line'}}>{label}</div>;
const Cloud = ({x, y, t, rain}: {x: number; y: number; t: number; rain?: boolean}) => <>
  <svg width={420} height={200} viewBox="0 0 420 200" style={{position: 'absolute', left: x - 210, top: y - 100}}><path d="M60 170 Q10 170 20 120 Q30 70 90 80 Q110 20 180 30 Q250 0 290 60 Q370 50 380 110 Q410 170 340 170 Z" fill="#7D8892" stroke={INK} strokeWidth={7} /></svg>
  {rain && Array.from({length: 9}, (_, i) => <div key={i} style={{position: 'absolute', left: x - 170 + i * 42, top: y + 70 + ((t * 600 + i * 70) % 300), width: 8, height: 34, borderRadius: 4, background: '#5AA9E6'}} />)}
</>;
const BankHouse = ({x, y, w = 640}: {x: number; y: number; w?: number}) => <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.85, width: w, height: w * 0.85}}>
  <svg width={w} height={w * 0.3} viewBox="0 0 640 190" style={{position: 'absolute', left: 0, top: 0}}><path d="M10 185 L320 10 L630 185 Z" fill="#EEF2F5" stroke={INK} strokeWidth={9} strokeLinejoin="round" /></svg>
  <div style={{position: 'absolute', left: w * 0.06, right: w * 0.06, top: w * 0.29, height: w * 0.1, background: '#EEF2F5', border: `7px solid ${INK}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.07, color: INK, letterSpacing: 8}}>BANK</div>
  {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: w * (0.12 + i * 0.22), top: w * 0.39, width: w * 0.1, height: w * 0.4, background: '#fff', border: `6px solid ${INK}`, boxSizing: 'border-box'}} />)}
  <div style={{position: 'absolute', left: 0, right: 0, top: w * 0.78, height: w * 0.07, background: '#EEF2F5', border: `7px solid ${INK}`, boxSizing: 'border-box'}} />
</div>;
const Gag = ({t, at, text, kind}: {t: number; at: number; text: string; kind: 'poor' | 'happy'}) => <>
  <World mood={kind === 'poor' ? 'storm' : 'sun'} />
  {kind === 'poor' ? <Cloud x={540} y={420} t={t} rain /> : <Sun x={930} y={170} t={t} />}
  {kind === 'poor' ? <PoorDoug x={540} y={G + 360} h={1000} t={t} pose={{tears: true, lids: 0.45}} /> :
    <Penguin id="doug" x={540} y={G + 360} h={1000} build="thin" pose={{beak: 'smile', brows: 'happy', lids: 0.3, blush: 1, flapL: 120, flapR: 120}} />}
  {kind === 'happy' && <Rags x={540} y={G + 360} h={1000} />}
  <BigWord text={text} x={540} y={kind === 'poor' ? 640 : 360} at={at} size={130} color={kind === 'poor' ? RED : GREEN} />
</>;

// ---------- sets ----------
const Intro = ({t}: {t: number}) => <>
  <World mood="cold" /><Flakes t={t} />
  <PoorDoug x={540} h={620} t={t} pose={{look: [0, 0.2], flapR: t >= P(3) ? 70 : 10}} />
  <BigWord text="Doug" x={540} y={520} at={P(2)} until={P(3)} size={170} />
  {t >= P(3) && <><Bill x={800} y={G - 420} w={240} rot={-10} /><BigWord text="$5" x={800} y={700} at={P(3) + 0.3} size={190} color={GREEN} /></>}
</>;
const Shop = ({t}: {t: number}) => <>
  <World />
  <CoffeeShop x={620} y={G} t={t} />
  <PoorDoug x={190} h={400} t={t} pose={{look: [0.8, -0.4], turn: 0.4, brows: 'none', eyeScale: 1.3, beak: 'smile'}} />
  <BigWord text="coffee!" x={300} y={520} at={P(4) + 0.2} until={P(5)} size={120} />
  <PriceTag x={430} y={980} price="$6" at={P(5) + 0.3} size={1.6} />
</>;
const Tap = ({t}: {t: number}) => { const go = ease((t - P(6)) / 0.5), ok = t >= P(6) + 0.75;
  return <>
    <World />
    <Reader x={600} y={1300} ok={ok} />
    <BigCard x={-200 + 640 * go} y={1150 - 380 * go} s={2.6} />
    {ok && <BigWord text="BEEP" x={300} y={420} at={P(6) + 0.75} size={170} color={GREEN} />}
  </>; };
const FoxNice = ({t}: {t: number}) => <>
  <World mood="sun" />
  <BankHouse x={540} y={G - 140} w={760} />
  <Fox x={740} y={G + 120} h={700} mouth={0.6} sly={0} />
  <PoorDoug x={250} y={G + 120} h={440} t={t} pose={{look: [0.8, -0.2], beak: 'smile', brows: 'happy'}} />
  <Stamp text="YES" x={540} y={380} at={P(7) + 0.2} color={GREEN} size={150} />
  <BigWord text="nice" x={300} y={620} at={P(7) + 1.0} size={120} color={GREEN} />
</>;
const FoxEvil = ({t}: {t: number}) => <>
  <World mood="storm" />
  <div style={{position: 'absolute', inset: -400, background: 'rgba(160,20,20,0.25)'}} />
  <Fox x={540} y={G + 380} h={1350} mouth={1} sly={1} />
  <BigWord text="not nice" x={540} y={330} at={P(8) + 0.4} size={150} color={RED} />
</>;
const LetterSet = ({t}: {t: number}) => <>
  <World mood="cold" /><Flakes t={t} />
  <Igloo x={850} y={G} w={420} />
  <BillPaper x={540} y={300 - 900 * (1 - ease((t - P(9) - 0.2) / 0.4))} t={t} />
  <PoorDoug x={250} y={G + 80} h={440} t={t} pose={{look: [0.6, -0.8], eyeScale: 1.3, brows: 'shock', beak: 'frown', sweat: t >= P(11)}} />
</>;
const Chain = ({t}: {t: number}) => <>
  <World mood="cold" />
  <PoorDoug x={250} h={460} t={t} pose={{look: [0.6, 0], flapR: 70}} />
  <Bill x={400} y={G - 330} w={160} rot={-10} />
  <BigWord text="$5" x={250} y={520} at={P(12) + 0.1} size={150} color={GREEN} />
  {t < P(13) ? <><Coffee x={800} y={G - 60} w={200} t={t} /><BigWord text="$6" x={800} y={520} at={P(12) + 0.6} size={150} color={RED} /></> :
    <><Fox x={810} y={G + 40} h={640} mouth={0.8} sly={1} /><FishFlight x1={300} y1={G - 300} x2={760} y2={G - 380} a={P(13)} b={P(13) + 1.0} n={4} w={120} /><BigWord text="+$35" x={800} y={400} at={P(13) + 0.6} size={150} color={RED} /></>}
</>;
const Called = ({t, lines, at, mood}: {t: number; lines: string[]; at: number; mood: keyof typeof SKY}) => <>
  <World mood={mood} />{mood === 'sun' && <Sun x={880} y={330} t={t} />}
  <Title lines={lines} y={820} at={at + 0.2} size={150} />
</>;
const PhoneSet = ({t}: {t: number}) => <>
  <World mood="cold" />
  <Phone x={620} y={800}>
    <div style={{fontSize: 34, marginTop: 60, color: '#6B727B'}}>BALANCE</div>
    <div style={{fontSize: 120, color: RED, marginTop: 30, transform: `scale(${0.4 + 0.6 * ease((t - P(16) - 0.5) / 0.2)})`}}>-$36</div>
  </Phone>
  <PoorDoug x={200} y={G + 60} h={460} t={t} pose={{look: [0.8, -0.5], brows: 'shock', sweat: true, eyeScale: 1.3}} />
</>;
const GumSet = ({t}: {t: number}) => <>
  <World />
  <div style={{position: 'absolute', left: 520, top: G - 380, width: 480, height: 380, background: '#F6C8D2', border: `7px solid ${INK}`, borderRadius: 12, boxSizing: 'border-box'}} />
  <Puffin x={820} y={G - 300} h={360} pose={{smirk: true, look: -0.6}} />
  <div style={{position: 'absolute', left: 490, top: G - 410, width: 540, height: 44, background: '#8A5A3B', border: `6px solid ${INK}`, borderRadius: 8, boxSizing: 'border-box'}} />
  <Gum x={620} y={G - 410} w={120} />
  <PoorDoug x={260} h={460} t={t} pose={{look: [0.7, 0], beak: t < P(18) ? 'smile' : 'frown', brows: t < P(18) ? 'happy' : 'worried', flapR: 60}} />
  <Stamp text="FEE $35" x={540} y={520} at={P(18) + 0.2} color={RED} size={130} />
</>;
const Compare = ({t}: {t: number}) => <>
  <World mood="cold" />
  <Gum x={200} y={1000} w={130} />
  <BigWord text="small gum" x={220} y={780} at={P(19)} size={90} />
  <BigWord text="$35" x={760} y={1000} at={P(19) + 0.7} size={300} color={RED} />
  <BigWord text="big fee" x={760} y={700} at={P(19) + 0.7} size={110} color={RED} />
</>;
const RichIntro = ({t}: {t: number}) => { const v = t >= P(21);
  return <>
    <World mood="sun" /><Sun x={950} y={200} t={t} />
    <RichDoug x={v ? 300 : 540} h={v ? 520 : 680} t={t} pose={{flapR: 110 + Math.sin(t * 8) * 15}} />
    <BigWord text="rich Doug" x={540} y={500} at={P(20)} until={P(21)} size={150} color={GREEN} />
    {v && <><Vault x={790} y={G - 260} w={460} open={ease((t - P(21)) / 0.4)} fish={14} /><BigWord text="$$$" x={790} y={560} at={P(21) + 0.4} size={170} color={GREEN} /></>}
  </>; };
const RichBuy = ({t}: {t: number}) => <>
  <World mood="sun" /><Sun x={150} y={330} t={t} />
  <CoffeeShop x={540} y={G - 300} w={600} t={t} />
  <div style={{position: 'absolute', left: 0, top: 0, transform: 'translate(-300px, 0)'}}><RichSide t={t} /></div>
  {t >= P(23) && <><FishFlight x1={560} y1={G - 400} x2={420} y2={G - 300} a={P(23) + 0.1} b={P(23) + 0.8} n={3} w={110} />
    <BigWord text="+money back" x={540} y={330} at={P(23) + 0.4} size={110} color={GREEN} /></>}
</>;
const Split = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: -400, top: -400, width: 940, height: 2800, overflow: 'hidden'}}><div style={{position: 'absolute', left: 400, top: 400}}><World mood="cold" x0={-400} w={940} /></div></div>
  <div style={{position: 'absolute', left: 540, top: -400, width: 940, height: 2800, overflow: 'hidden'}}><div style={{position: 'absolute', left: -540, top: 400}}><World mood="sun" x0={540} w={940} /></div></div>
  <div style={{position: 'absolute', left: 536, top: 200, width: 8, height: 1260, backgroundImage: `repeating-linear-gradient(180deg, ${INK} 0 26px, transparent 26px 44px)`}} />
  <PoorDoug x={270} h={520} t={t} pose={{tears: true}} />
  <RichDoug x={810} h={520} t={t} />
  <BigWord text="pay MORE" x={270} y={520} at={P(25) + 0.1} size={110} color={RED} />
  <BigWord text="pay LESS" x={810} y={520} at={P(25) + 1.2} size={110} color={GREEN} />
</>;
const RealLife = ({t}: {t: number}) => <>
  <World />
  <BankHouse x={540} y={G} w={760} />
  <BigWord text="in real life" x={540} y={260} at={P(26)} size={100} />
  <BigWord text="UP TO $35" x={540} y={520} at={P(26) + 2.4} size={170} color={RED} />
  <BigWord text="per overdraft" x={540} y={700} at={P(26) + 3.4} size={90} />
</>;
const Expensive = ({t}: {t: number}) => <>
  <World mood="cold" /><Flakes t={t} />
  <PoorDoug x={540} h={600} t={t} pose={{tears: true}} />
  {['$35', '$35', '$35', '$35', '$35'].map((p, i) => <PriceTag key={i} x={160 + i * 190} y={-200 + Math.min(1, (t - P(27) - i * 0.12) / 0.5) * (760 + (i % 2) * 160)} price={p} size={1.1} rot={(i % 2 ? 8 : -8)} />)}
  <BigWord text="poor = expensive" x={540} y={250} at={P(27) + 0.3} size={110} color={RED} />
</>;
const Home = ({t}: {t: number}) => <>
  <World mood="sun" /><Sun x={900} y={300} t={t} />
  <Igloo x={760} y={G} w={520} />
  <PoorDoug x={330} h={470} t={t} pose={{beak: 'smile', brows: 'happy', lids: 0.2, look: [0.5, 0]}} />
  {t >= P(29) && <><Kettle x={560} y={G} t={t} /><Coffee x={470} y={G - 240} w={90} t={t} /></>}
  {t >= P(30) && <BigWord text="30¢" x={540} y={500} at={P(30) + 0.3} size={260} color={GREEN} />}
</>;
const Phone2 = ({t}: {t: number}) => <>
  <World mood="cold" />
  <Phone x={620} y={800}>
    <Row label="" amount="" t={t} at={0} size={10} />
    {t >= P(33) && <Box3 x={165} y={420} w={260} label={'COFFEE\nMAKER'} t={t} />}
    <div style={{position: 'absolute', left: 0, right: 0, top: 470, fontSize: 110, color: RED, opacity: t >= P(33) + 0.9 ? 1 : 0}}>-$99</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 620, fontSize: 44, color: '#6B727B', opacity: t >= P(34) ? 1 : 0}}>BALANCE $5</div>
  </Phone>
  <PoorDoug x={200} y={G + 60} h={460} t={t} pose={{look: [0.8, -0.5], brows: t >= P(33) + 0.9 ? 'shock' : 'happy', beak: t >= P(33) + 0.9 ? 'frown' : 'smile', eyeScale: 1.3}} />
</>;
const Cta = ({t}: {t: number}) => <>
  <World mood="sun" />
  <Walrus id="larry" x={790} y={G} h={520} pose={{laugh: 1, mouth: 0.7, lids: 0.3}} />
  <MoneyBag x={980} y={G} w={200} label="$" />
  <PoorDoug x={300} h={520} t={t} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
  <BigWord text="worst fee?" x={540} y={400} at={P(36)} size={150} />
  <BigWord text="👇" x={300} y={640} at={P(36) + 0.8} size={140} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(2), set: (t) => <Intro t={t} />, fx_: 'zoom'},
  {at: P(4), set: (t) => <Shop t={t} />, fx_: 'swipe'},
  {at: P(6), set: (t) => <Tap t={t} />, fx_: 'pop'},
  {at: P(7), set: (t) => <FoxNice t={t} />, fx_: 'swipeL'},
  {at: P(8), set: (t) => <FoxEvil t={t} />, fx_: 'zoom'},
  {at: P(9), set: (t) => <LetterSet t={t} />, fx_: 'iris'},
  {at: P(12), set: (t) => <Chain t={t} />, fx_: 'swipe'},
  {at: P(14), set: (t) => <Called t={t} lines={['OVERDRAFT', 'FEE']} at={P(14)} mood="cold" />, fx_: 'zoom'},
  {at: P(15), set: (t) => <Gag t={t} at={P(15)} text="Doug poor." kind="poor" />, fx_: 'zoom'},
  {at: P(16), set: (t) => <PhoneSet t={t} />, fx_: 'swipeL'},
  {at: P(17), set: (t) => <GumSet t={t} />, fx_: 'swipe'},
  {at: P(19), set: (t) => <Compare t={t} />, fx_: 'pop'},
  {at: P(20), set: (t) => <RichIntro t={t} />, fx_: 'iris'},
  {at: P(22), set: (t) => <RichBuy t={t} />, fx_: 'swipe'},
  {at: P(24), set: (t) => <Called t={t} lines={['CASHBACK']} at={P(24)} mood="sun" />, fx_: 'zoom'},
  {at: P(25), set: (t) => <Split t={t} />, fx_: 'swipeL'},
  {at: P(26), set: (t) => <RealLife t={t} />, fx_: 'iris'},
  {at: P(27), set: (t) => <Expensive t={t} />, fx_: 'pop'},
  {at: P(28), set: (t) => <Home t={t} />, fx_: 'swipe'},
  {at: P(31), set: (t) => <Gag t={t} at={P(31)} text="Doug happy." kind="happy" />, fx_: 'zoom'},
  {at: P(32), set: (t) => <Phone2 t={t} />, fx_: 'swipeL'},
  {at: P(35), set: (t) => <Gag t={t} at={P(35)} text="Doug poor again." kind="poor" />, fx_: 'zoom'},
  {at: P(36), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[3, 800, 800, 1.4], [5, 430, 1000, 1.5], [8, 540, 700, 1.4], [11, 540, 620, 1.5], [16, 620, 760, 1.5], [18, 540, 600, 1.4], [21, 790, 1000, 1.3], [30, 540, 600, 1.4], [33, 620, 800, 1.5]];

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
    <Sfx at={P(1) + 1.0} name="user-money" vol={0.35} />
    <Sfx at={E(1) - 0.05} name="user-fahh" vol={0.5} />
    <Sfx at={P(2)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(3) + 0.3} name="user-money" vol={0.3} />
    <Sfx at={P(5) + 0.3} name="user-cash-register" vol={0.35} />
    <Sfx at={P(6) + 0.75} name="user-ting" vol={0.4} />
    <Sfx at={P(7) + 0.2} name="user-yeah" vol={0.35} />
    <Sfx at={P(8)} name="user-boom" vol={0.5} />
    <Sfx at={P(9)} name="user-notif" vol={0.35} />
    <Sfx at={P(10)} name="user-pop" vol={0.3} />
    <Sfx at={P(11)} name="user-shock" vol={0.4} />
    <Sfx at={P(13)} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(14) + 0.2} name="user-ting" vol={0.35} />
    <Sfx at={P(15)} name="user-fahh" vol={0.45} />
    <Sfx at={P(16) + 0.5} name="user-wrong" vol={0.35} />
    <Sfx at={P(17)} name="user-cash-register" vol={0.3} />
    <Sfx at={P(18) + 0.2} name="user-slap" vol={0.4} />
    <Sfx at={P(19) + 0.7} name="user-boom" vol={0.4} />
    <Sfx at={P(20)} name="user-wow" vol={0.35} />
    <Sfx at={P(21) + 0.4} name="user-money" vol={0.35} />
    <Sfx at={P(22) + 0.5} name="user-cash-register" vol={0.3} />
    <Sfx at={P(23) + 0.1} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(24) + 0.2} name="user-ting" vol={0.35} />
    <Sfx at={P(25) + 0.1} name="user-aww" vol={0.3} />
    <Sfx at={P(25) + 1.2} name="user-yeah" vol={0.3} />
    <Sfx at={P(26) + 2.4} name="user-ting" vol={0.45} />
    <Sfx at={P(27) + 0.3} name="user-wrong" vol={0.3} />
    <Sfx at={P(28)} name="penguin-honk" vol={0.3} />
    <Sfx at={P(30) + 0.3} name="user-wow" vol={0.35} />
    <Sfx at={P(31)} name="user-yeah" vol={0.4} />
    <Sfx at={P(32)} name="user-notif2" vol={0.35} />
    <Sfx at={P(33) + 0.9} name="user-shock" vol={0.4} />
    <Sfx at={P(35)} name="user-fahh-long" vol={0.45} />
    <Sfx at={P(36)} name="walrus-laugh" vol={0.4} />
  </AbsoluteFill>;
};
