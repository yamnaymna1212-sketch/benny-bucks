// EP5 burger version (2026-10-20): Doug buys burger + soda for $15, cash vs card, soft/indirect wording (no bank, no totals).
// Script videos/doug-cash-card-burger/voice.txt, voice Edge TTS en-US-AndrewNeural x1.125. Hook camera rule. P(i) = phrase i start.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HAND, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {BigWord, Igloo, PriceTag, Sign, Stamp, Title} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {BigSeal, Puffin, Walrus} from '../penguin/cast';
import TIM from '../data/doug-cash-burger.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_CASH_BURGER_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1250, RED = '#D83A2E', GREEN = '#2E9E4F', BLUE = '#2F5DA8';
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => { const q = cl(p); return q * q * (3 - 2 * q); };
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const CASHW = 2.35, CARDW = 3.75; // spoken "cash..." / "card?" (silencedetect inside the hook line)
// "fifteen" spoken -> the price pops
const TEN = [1.55, 3.2, 6.15, 10.7, 12.9];
const tenPop = (tc: number) => { const d = TEN.map((a) => tc - a).find((x) => x >= 0 && x < 0.4); return d === undefined ? 1 : 1 + 0.2 * Math.sin((d / 0.4) * Math.PI); };
const SHOCK = CARDW;

// ---------- money props ----------
// "ten" of every spoken "ten dollars" (tightened VO times) -> the $10 bill pops on that word
// Cartoon $10 note (v3): plain green bill with a big "$10" and a little fish (Doug-world money: 1 fish = $10).
// No "United States", portrait, seals or serials, so it never reads as a copy of real currency.
const RealTen = ({w = 300}: {w?: number}) =>
  <svg width={w} height={w * 0.425} viewBox="0 0 470 200" style={{display: 'block', overflow: 'visible'}}>
    <rect x={3} y={3} width={464} height={194} rx={16} fill="#BFE3B4" stroke={INK} strokeWidth={7} />
    <rect x={20} y={20} width={430} height={160} rx={10} fill="none" stroke="#6FB062" strokeWidth={5} strokeDasharray="14 8" />
    <text x={235} y={130} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={100} fill={INK}>$10</text>
    <g transform="translate(60 100)"><path d="M-30 0 Q0 -26 26 0 Q0 26 -30 0 Z M26 0 L44 -16 L44 16 Z" fill="#5EC4FA" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><circle cx={-14} cy={-4} r={4} fill={INK} /></g>
    <g transform="translate(410 100) scale(-1 1)"><path d="M-30 0 Q0 -26 26 0 Q0 26 -30 0 Z M26 0 L44 -16 L44 16 Z" fill="#5EC4FA" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><circle cx={-14} cy={-4} r={4} fill={INK} /></g>
  </svg>;
const CashIcon = ({w = 250, t = -1}: {w?: number; t?: number}) => <div style={{transform: `rotate(-6deg) scale(${t < 0 ? 1 : tenPop(t)})`}}><RealTen w={w} /></div>;
const CardIcon = ({w = 250}: {w?: number}) =>
  <div style={{width: w, height: w * 0.62, background: BLUE, border: `6px solid ${INK}`, borderRadius: 18, position: 'relative', transform: 'rotate(6deg)'}}>
    <div style={{position: 'absolute', left: 24, top: 34, width: 52, height: 40, background: '#F5C518', border: `4px solid ${INK}`, borderRadius: 8}} />
    <div style={{position: 'absolute', left: 24, bottom: 22, right: 24, height: 12, background: 'rgba(255,255,255,0.7)', borderRadius: 6}} />
  </div>;
// hook right side: the card, and the same real $10 slides out from behind it on "ten dollars with card"
const CardSide = ({t = -1}: {t?: number}) => { const p = t < 0 ? 0 : ease((t - TEN[1]) / 0.25);
  return <div style={{position: 'relative', width: 250, height: 155}}>
    {p > 0 && <div style={{position: 'absolute', left: -60 * p, top: -30 * p, transform: `rotate(-10deg) scale(${tenPop(t)})`, opacity: p}}><RealTen w={220} /></div>}
    <div style={{position: 'absolute', left: 0, top: 0}}><CardIcon /></div>
  </div>; };
// the bill on stage: always the real $10 note; another value (shrunk by fees) gets a red sticker on it. Pops on every spoken "ten dollars".
const Bill = ({x, y, w = 300, text = '$10', rot = -4, s = 1}: {x: number; y: number; w?: number; text?: string; rot?: number; s?: number; color?: string}) => {
  const k = tenPop(useCurrentFrame() / FPS);
  return <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.2125, width: w, transform: `rotate(${rot}deg) scale(${s * k})`}}>
    <RealTen w={w} />
    {text !== '$10' && <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) rotate(-6deg)', background: RED, color: '#fff', border: `5px solid ${INK}`, borderRadius: 14,
      padding: '2px 18px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.2, whiteSpace: 'nowrap'}}>{text}</div>}
  </div>; };
const Card = ({x, y, w = 260, rot = 8}: {x: number; y: number; w?: number; rot?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.31, transform: `rotate(${rot - 6}deg)`}}><CardIcon w={w} /></div>;
// a bill flying on an arc between two points during [a, b]; parked at the end afterwards
const BillFly = ({t, x1, y1, x2, y2, a, b, w = 220, text = '$10', arc = 260}: {t: number; x1: number; y1: number; x2: number; y2: number; a: number; b: number; w?: number; text?: string; arc?: number}) => {
  const p = ease((t - a) / (b - a)); // held at the start point until it flies
  return <Bill x={lerp(x1, x2, p)} y={lerp(y1, y2, p) - Math.sin(p * Math.PI) * arc} w={w} text={text} rot={-4 + 10 * Math.sin(p * 6)} />;
};
const Coin = ({x, y, text, w = 150}: {x: number; y: number; text: string; w?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w / 2, width: w, height: w, borderRadius: '50%', background: '#F5C518', border: `6px solid ${INK}`, boxShadow: 'inset 0 0 0 8px #E2A90F',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.3, color: INK}}>{text}</div>;
// card reader: the screen flashes green "BEEP" for 0.35 s after each beep time
const Reader = ({x, y, w = 200, t, beeps = [], amount = '$10.00'}: {x: number; y: number; w?: number; t: number; beeps?: number[]; amount?: string}) => {
  const on = beeps.some((b) => t >= b && t < b + 0.35);
  return <div style={{position: 'absolute', left: x - w / 2, top: y - w * 1.5, width: w, height: w * 1.5, background: '#3A3F47', border: `7px solid ${INK}`, borderRadius: w * 0.12,
    transform: on ? 'scale(1.08)' : undefined}}>
    <div style={{margin: w * 0.08, height: w * 0.45, borderRadius: 8, border: `4px solid ${INK}`, background: on ? '#5CF07A' : '#9EE6A0', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * (on ? 0.2 : 0.15), color: INK}}>{on ? 'BEEP' : amount}</div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: w * 0.05, margin: `0 ${w * 0.12}px`}}>
      {Array.from({length: 9}, (_, i) => <div key={i} style={{height: w * 0.11, borderRadius: 5, background: '#C9CED4'}} />)}</div>
  </div>;
};
const Scissors = ({x, y, t, s = 1}: {x: number; y: number; t: number; s?: number}) => { const o = 14 + 12 * Math.sin(t * 22);
  return <svg width={220 * s} height={160 * s} viewBox="-110 -80 220 160" style={{position: 'absolute', left: x - 110 * s, top: y - 80 * s, overflow: 'visible'}}>
    <g transform={`rotate(${-o})`}><path d="M0 0 L100 -8 L100 6 Z" fill="#DDE6EC" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><circle cx={-44} cy={-10} r={26} fill="none" stroke={RED} strokeWidth={12} /></g>
    <g transform={`rotate(${o})`}><path d="M0 0 L100 8 L100 -6 Z" fill="#DDE6EC" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><circle cx={-44} cy={10} r={26} fill="none" stroke={RED} strokeWidth={12} /></g>
    <circle r={7} fill={INK} />
  </svg>; };
const BarberPole = ({x, y, t}: {x: number; y: number; t: number}) =>
  <div style={{position: 'absolute', left: x - 50, top: y - 380, width: 100, height: 380}}>
    <div style={{position: 'absolute', left: 10, top: 30, width: 80, height: 320, borderRadius: 40, border: `7px solid ${INK}`, overflow: 'hidden',
      background: `repeating-linear-gradient(-35deg, ${RED} 0 30px, #fff 30px 60px, ${BLUE} 60px 90px, #fff 90px 120px)`, backgroundPositionY: `${(t * 120) % 240}px`}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 100, height: 40, borderRadius: 20, background: '#DDE6EC', border: `7px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 0, bottom: 0, width: 100, height: 40, borderRadius: 20, background: '#DDE6EC', border: `7px solid ${INK}`}} />
  </div>;
const Sled = ({x, y, w = 360, t}: {x: number; y: number; w?: number; t: number}) =>
  <svg width={w} height={w * 0.45} viewBox="0 0 360 160" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.45, overflow: 'visible'}}>
    <path d="M30 40 L300 40 L320 100 L40 100 Z" fill={RED} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M10 140 L320 140 Q350 140 350 110 M80 100 L80 140 M260 100 L260 140" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={60 + i * 60 + Math.sin(t * 3 + i) * 10} cy={20 - ((t * 60 + i * 30) % 80)} r={16 + (i % 2) * 8} fill="#E8F6FD" stroke="#7CC4EC" strokeWidth={4} />)}
  </svg>;
const NameTag = ({x, y, text, color = INK}: {x: number; y: number; text: string; color?: string}) =>
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%) rotate(-3deg)', background: color, color: '#fff', border: `6px solid ${INK}`, borderRadius: 14,
    padding: '4px 26px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60, whiteSpace: 'nowrap'}}>{text}</div>;
const XMark = ({x, y, at, t, s = 1}: {x: number; y: number; at: number; t: number; s?: number}) => t < at ? null :
  <svg width={200 * s} height={200 * s} viewBox="0 0 200 200" style={{position: 'absolute', left: x - 100 * s, top: y - 100 * s, overflow: 'visible', transform: `scale(${Math.min(1, (t - at) / 0.1) * (t - at < 0.15 ? 1.2 : 1)})`}}>
    <path d="M30 30 L170 170 M170 30 L30 170" stroke={RED} strokeWidth={26} strokeLinecap="round" /></svg>;
const Panel = ({x, y, w = 300, children}: {x: number; y: number; w?: number; children?: React.ReactNode}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w / 2, width: w, height: w, border: `7px solid ${INK}`, borderRadius: 28, background: '#F4FAFD'}}>{children}</div>;


// ---------- food + shop props ----------
const Burger = ({x, y, s = 1}: {x: number; y: number; s?: number}) =>
  <svg width={200 * s} height={170 * s} viewBox="0 0 200 170" style={{position: 'absolute', left: x - 100 * s, top: y - 170 * s, overflow: 'visible'}}>
    <path d="M20 70 Q20 10 100 10 Q180 10 180 70 Z" fill="#E3A857" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {[[60, 35], [100, 28], [140, 38], [80, 52], [120, 50]].map(([a, b], i) => <ellipse key={i} cx={a} cy={b} rx={6} ry={3.5} fill="#FFF3D6" />)}
    <path d="M14 76 Q40 92 60 78 Q80 94 100 78 Q120 94 140 78 Q160 94 186 76 L186 86 L14 86 Z" fill="#5FB34F" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={18} y={86} width={164} height={30} rx={12} fill="#7A3E22" stroke={INK} strokeWidth={7} />
    <path d="M16 116 L184 116 L172 128 L28 128 Z" fill="#F5C518" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M20 128 L180 128 Q180 162 100 162 Q20 162 20 128 Z" fill="#E3A857" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
  </svg>;
const Soda = ({x, y, s = 1}: {x: number; y: number; s?: number}) =>
  <svg width={110 * s} height={200 * s} viewBox="0 0 110 200" style={{position: 'absolute', left: x - 55 * s, top: y - 200 * s, overflow: 'visible'}}>
    <path d="M62 40 L78 0" stroke={RED} strokeWidth={9} strokeLinecap="round" />
    <path d="M8 40 L102 40 L90 196 L20 196 Z" fill={RED} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <rect x={2} y={30} width={106} height={16} rx={6} fill="#fff" stroke={INK} strokeWidth={6} />
    <path d="M24 100 Q55 80 86 100 L84 130 Q55 112 26 130 Z" fill="#fff" />
  </svg>;
const Combo = ({x, y, s = 1}: {x: number; y: number; s?: number}) => <><Burger x={x - 40 * s} y={y} s={s} /><Soda x={x + 85 * s} y={y} s={s * 0.9} /></>;
// small cartoon cash note (no real-currency details)
const Note = ({x, y, w = 150, rot = -8}: {x: number; y: number; w?: number; rot?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.22, width: w, height: w * 0.45, background: '#BFE3B4', border: `5px solid ${INK}`, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.3, color: INK, transform: `rotate(${rot}deg)`}}>$</div>;
const MiniCard = ({x, y, w = 130, rot = -14}: {x: number; y: number; w?: number; rot?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.31, width: w, height: w * 0.62, background: BLUE, border: `5px solid ${INK}`, borderRadius: 12, transform: `rotate(${rot}deg)`}}>
    <div style={{position: 'absolute', left: w * 0.12, top: w * 0.14, width: w * 0.22, height: w * 0.16, background: '#F5C518', border: `3px solid ${INK}`, borderRadius: 4}} /></div>;
const PriceBoard = ({x, y, price = '$15', t = -1, color = INK}: {x: number; y: number; price?: string; t?: number; color?: string}) =>
  <div style={{position: 'absolute', left: x - 170, top: y, width: 340, height: 120, background: '#24292E', border: `7px solid ${INK}`, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color: color === INK ? '#F7CF3B' : color, transform: `scale(${t < 0 ? 1 : tenPop(t)})`}}>{price}</div>;
const CashBox = ({x, y, open = 0}: {x: number; y: number; open?: number}) =>
  <div style={{position: 'absolute', left: x - 140, top: y - 150, width: 280, height: 150}}>
    <div style={{position: 'absolute', left: 0, top: 40, width: 280, height: 110, background: '#8A95A3', border: `7px solid ${INK}`, borderRadius: 14}} />
    <div style={{position: 'absolute', left: 20, top: 40 - 60 * open, width: 240, height: 40, background: '#C9CED4', border: `6px solid ${INK}`, borderRadius: 8}} />
  </div>;
const Small = ({x, y, text}: {x: number; y: number; text: string}) =>
  <div style={{position: 'absolute', left: x, top: y, transform: 'translateX(-50%)', fontFamily: HAND, fontSize: 42, color: '#5A6470', whiteSpace: 'nowrap'}}>{text}</div>;

// ---------- hook: "What the difference" split, burger + soda + $15 both sides; Hook camera rule ----------
const BSide = ({side, t = -1}: {side: 'cash' | 'card'; t?: number}) => { const o = side === 'cash' ? 0 : 540;
  const react = t >= 0 && t >= (side === 'cash' ? CASHW : CARDW);
  return <>
    <Puffin x={o + 445} y={1180} h={330} id={`hp${side}`} pose={react ? (side === 'cash' ? {look: -0.6, mouth: 0.35} : {look: 0.2, lids: 0.45}) : {look: -0.6, mouth: 0.15}} />
    <Counter x={o + 270} w={260} />
    <Combo x={o + 430} y={1086} s={0.45} />
    {side === 'card' && <Reader x={o + 320} y={1086} w={90} t={t} beeps={[CARDW]} amount="$15" />}
    <Penguin id={`hd${side}`} x={o + 150} y={1420} h={410} pose={react ? {turn: 0.55, look: [0.8, -0.2], flapR: 62, beak: 'smile', brows: 'happy', hop: side === 'cash' ? Math.max(0, 20 * Math.sin((t - CASHW) * 9)) : 0}
      : {turn: 0.55, look: [0.8, -0.1], flapR: 62, beak: 'flat', lids: 0.25}} />
    {side === 'cash' ? <Note x={o + 290} y={1040} w={130} /> : <MiniCard x={o + 250} y={1020} w={120} />}
  </>; };
const HookB = ({t = -1}: {t?: number}) => <AbsoluteFill style={{background: '#fff'}}>
  <Fonts /><HandFont />
  <div style={{position: 'absolute', left: 0, top: 110, width: 1080, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontStyle: 'italic', fontSize: 96, whiteSpace: 'nowrap',
    color: INK, letterSpacing: -3, textShadow: '5px 6px 0 rgba(0,0,0,0.18)'}}>What the difference</div>
  <Combo x={250} y={420} s={0.95} /><Combo x={790} y={420} s={0.95} />
  <PriceBoard x={270} y={430} t={t} /><PriceBoard x={810} y={430} t={t} />
  <div style={{position: 'absolute', left: 0, top: 575, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 104, color: GREEN}}>CASH</div>
  <div style={{position: 'absolute', left: 540, top: 575, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 104, color: BLUE}}>CARD</div>
  <div style={{position: 'absolute', left: 536, top: 710, width: 0, height: 750, borderLeft: `8px dashed ${INK}`}} />
  <div style={{position: 'absolute', left: 540 - 62, top: 575, width: 124, height: 124, borderRadius: '50%', background: '#F7CF3B', border: `7px solid ${INK}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 54, color: INK}}>VS</div>
  <BSide side="cash" t={t} /><BSide side="card" t={t} />
</AbsoluteFill>;
export const DougCashBurgerHook = () => <HookB />;
const hookCam = (t: number) => {
  const toL = ease((t - CASHW + 0.1) / 0.3) * (1 - ease((t - CARDW + 0.1) / 0.3));
  const toR = ease((t - CARDW + 0.1) / 0.3) * (1 - ease((t - P(1)) / 0.35));
  return {s: 1 + 0.5 * (toL + toR), x: 540 + (270 - 540) * toL + (810 - 540) * toR, y: 960 + (900 - 960) * (toL + toR)};
};
const Counter = ({x, w}: {x: number; w: number}) => <>
  <div style={{position: 'absolute', left: x, top: 1100, width: w, height: 300, background: '#C98F55', border: `7px solid ${INK}`, borderRadius: 10,
    backgroundImage: `repeating-linear-gradient(90deg, transparent 0 52px, rgba(0,0,0,0.18) 52px 56px)`}} />
  <div style={{position: 'absolute', left: x - 14, top: 1082, width: w + 28, height: 34, background: '#E0A96D', border: `7px solid ${INK}`, borderRadius: 8}} />
</>;
// ---------- stage ----------
const Ice = () => <>
  <div style={{position: 'absolute', left: -2000, top: -2000, width: 5080, height: 6000, background: '#fff'}} />
  <div style={{position: 'absolute', left: -2000, top: G - 10, width: 5080, height: 3000, background: '#E4F4FC', borderTop: `6px solid ${INK}`}} />
</>;
const Dark = () => <div style={{position: 'absolute', left: -2000, top: -2000, width: 5080, height: 6000, background: '#24292E'}} />;
const Spot = ({x = 540, y = 1000, r = 440}: {x?: number; y?: number; r?: number}) =>
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: 'radial-gradient(#FFF8DC, rgba(255,248,220,0) 70%)'}} />;

// ---------- sets (one idea per shot) ----------
const NoteFly = ({t, x1, y1, x2, y2, a, b}: {t: number; x1: number; y1: number; x2: number; y2: number; a: number; b: number}) => { const p = ease((t - a) / (b - a));
  return <Note x={lerp(x1, x2, p)} y={lerp(y1, y2, p) - Math.sin(p * Math.PI) * 220} w={170} rot={-8 + 14 * Math.sin(p * 6)} />; };
const Hungry = ({t}: {t: number}) => <>
  <Penguin id="doug" x={540} y={G + 220} h={780} pose={t >= P(5) ? {brows: 'worried', beak: 'frown', look: [0, -0.5], tremble: 0.3} : {beak: 'smile', brows: 'happy'}} />
  {t >= P(5) && <BigWord text="grrr..." x={760} y={520} at={P(5) + 0.1} size={110} />}
</>;
const Shop = ({t}: {t: number}) => { const x = lerp(160, 380, ease((t - P(6)) / 0.8));
  return <>
    <Igloo x={760} y={G + 20} w={480} />
    <NameTag x={760} y={560} text="PUFFIN BURGER" color={RED} />
    <Penguin id="doug" x={x} y={G + 40} h={380} pose={{side: true, turn: 1, walk: (t * 2) % 1, beak: 'smile'}} />
  </>; };
const Menu = ({t}: {t: number}) => <>
  {t >= P(7) && <Burger x={360} y={900} s={1.6} />}
  {t >= P(8) && <Soda x={760} y={900} s={1.5} />}
  {t >= P(9) && <PriceBoard x={540} y={1000} t={t} />}
</>;
const PayCash = ({t}: {t: number}) => <>
  <Penguin id="doug" x={270} y={G + 40} h={440} pose={{turn: 0.5, look: [0.8, -0.2], beak: 'smile', brows: 'happy', flapR: t < P(10) + 0.5 ? 70 : 20}} />
  <Puffin x={820} y={G + 40} h={430} pose={{look: -0.5, mouth: 0.3}} />
  <Combo x={560} y={G - 40} s={0.7} />
  <NoteFly t={t} x1={450} y1={G - 140} x2={780} y2={G - 470} a={P(10) + 0.1} b={P(10) + 0.7} />
  <Stamp text="CASH" x={540} y={520} at={P(10) + 0.2} color={GREEN} size={120} />
</>;
const IntoBox = ({t}: {t: number}) => { const p = ease((t - P(11) - 0.4) / 0.6);
  return <>
    <Puffin x={330} y={G + 40} h={460} flip pose={{look: 0.5, mouth: 0.3}} />
    <CashBox x={740} y={G + 20} open={p < 1 ? 1 : 0} />
    {p < 1 && <Note x={lerp(480, 740, p)} y={lerp(G - 300, G - 120, p)} w={170} />}
    <PriceTag x={740} y={560} price="$15" fish="in the box" at={TEN[4]} color={GREEN} />
    <Stamp text="ALL OF IT" x={540} y={380} at={P(12)} color={GREEN} size={100} />
  </>; };
const NextDay = ({t}: {t: number}) => <>
  <Title lines={['NEXT DAY']} y={520} size={130} />
  {t >= P(14) && <Burger x={380} y={1100} s={1.3} />}
  {t >= P(15) && <Soda x={740} y={1100} s={1.2} />}
</>;
const PayCard = ({t}: {t: number}) => { const swipe = ease((t - P(16) - 0.8) / 0.5);
  return <>
    <Penguin id="doug" x={270} y={G + 40} h={440} pose={{turn: 0.5, look: [0.8, -0.2], beak: 'smile', flapR: 70}} />
    <Puffin x={840} y={G + 40} h={430} pose={{look: -0.5}} />
    <Reader x={640} y={G - 260} w={190} t={t} beeps={[P(17)]} amount="$15" />
    <MiniCard x={lerp(420, 600, swipe)} y={G - 400 + 40 * swipe} w={210} />
  </>; };
const LittleLess = ({t}: {t: number}) => <>
  <Puffin x={540} y={G + 40} h={560} pose={{look: 0, lids: 0.3}} />
  <PriceTag x={540} y={500} price="a little less" fish="than $15" at={P(18) + 0.4} size={1.1} />
</>;
const WhereRest = ({t}: {t: number}) => <>
  <Penguin id="doug" x={300} y={G + 40} h={460} pose={{brows: 'worried', look: [0.6, -0.5], turn: 0.4}} />
  {t < P(20) && <BigWord text="?" x={760} y={600} at={P(19) + 0.1} size={220} />}
  {t >= P(20) && <Reader x={760} y={G - 40} w={210} t={t} beeps={[P(20) + 0.2]} amount="¢" />}
</>;
const Shield = () => <svg width={170} height={190} viewBox="0 0 170 190"><path d="M85 10 L155 40 Q155 130 85 180 Q15 130 15 40 Z" fill={BLUE} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
  <path d="M55 95 L78 118 L118 70" fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Check = ({x, y, at, t}: {x: number; y: number; at: number; t: number}) => t < at ? null :
  <div style={{position: 'absolute', left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: '50%', background: GREEN, border: `6px solid ${INK}`, color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, fontWeight: 900, transform: `scale(${Math.min(1, (t - at) / 0.12)})`}}>✓</div>;
const WhatFor = ({t}: {t: number}) => <>
  <Panel x={200} y={620} w={290}><Reader x={140} y={205} w={100} t={-1} amount="" />
    <div style={{position: 'absolute', left: 0, bottom: 14, width: '100%', textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30}}>MACHINE</div></Panel>
  <Panel x={540} y={620} w={290}><div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, textAlign: 'center', color: BLUE}}>CARD<br />COMPANY</div></Panel>
  <Panel x={880} y={620} w={290}><div style={{position: 'absolute', left: 60, top: 40}}><Shield /></div></Panel>
  <Check x={310} y={740} at={P(21) + 0.2} t={t} /><Check x={650} y={740} at={P(22) + 0.2} t={t} /><Check x={990} y={740} at={P(23) + 0.3} t={t} />
  <Penguin id="doug" x={540} y={G + 140} h={360} pose={{beak: 'smile', brows: 'happy'}} />
</>;
const DontMind = ({t}: {t: number}) => <>
  <Puffin x={360} y={G + 40} h={480} flip pose={{mouth: 0.3, look: 0.4}} />
  {t >= P(25) && <><MiniCard x={760} y={700} w={220} /><BigWord text="fast!" x={760} y={520} at={P(25)} size={110} color={BLUE} /></>}
  {t >= P(26) && <><BigWord text="♥" x={640} y={900} at={P(26)} size={120} color={RED} /><BigWord text="♥" x={900} y={980} at={P(26) + 0.15} size={90} color={RED} /></>}
</>;
const FewCents = ({t}: {t: number}) => <>
  <Reader x={420} y={G + 20} w={200} t={t} beeps={[P(27) + 0.3]} amount="$15" />
  <Puffin x={820} y={G + 40} h={420} pose={{look: -0.5, lids: 0.3}} />
  {t >= P(27) + 0.4 && <Coin x={620} y={720} text="¢" w={130} />}
  <PriceTag x={540} y={460} price="a few cents" fish="every beep" at={P(27) + 0.6} size={0.9} />
</>;
const Busy = ({t}: {t: number}) => <>
  <Igloo x={880} y={G + 20} w={320} />
  {[0, 1, 2, 3, 4].map((i) => i % 2 ? <BigSeal key={i} x={110 + i * 150} y={G + 40} h={250} id={`q${i}`} flip /> : <Walrus key={i} x={110 + i * 150} y={G + 40} h={210} id={`w${i}`} hat={false} flip />)}
  {t >= P(29) && <PriceTag x={540} y={520} price="100 a day" fish="customers" at={P(29)} />}
  {t >= P(29) && <Small x={540} y={700} text="(example)" />}
</>;
const Beeps = ({t}: {t: number}) => <>
  <Reader x={540} y={G + 20} w={260} t={t} beeps={[P(31), P(32), P(33)]} amount="$15" />
  <MiniCard x={300} y={700} w={200} rot={-20} /><MiniCard x={540} y={620} w={200} rot={6} /><MiniCard x={780} y={700} w={200} rot={20} />
</>;
const Adds = ({t}: {t: number}) => { const n = Math.round(2 + 16 * ease((t - P(34) - 0.4) / 2.2));
  return <>
    {Array.from({length: n}, (_, i) => <Coin key={i} x={360 + (i % 6) * 72} y={G - 20 - Math.floor(i / 6) * 60} text="¢" w={80} />)}
    <BigWord text="× 100" x={540} y={520} at={P(34) + 0.9} size={120} />
    <BigWord text="every day" x={540} y={680} at={P(34) + 1.9} size={90} color={RED} />
    <Small x={540} y={G + 80} text="(example)" />
  </>; };
const RealMoney = ({t}: {t: number}) => <>
  <Puffin x={540} y={G + 40} h={560} pose={{lids: 0.4, look: 0.3}} />
  <Igloo x={880} y={G + 20} w={240} />
  <BigWord text="small shop" x={540} y={460} at={P(35) + 0.6} size={110} />
</>;
const PriceUp = ({t}: {t: number}) => { const up = t >= P(36) + 1.3;
  return <>
    <Combo x={380} y={1100} s={1.1} />
    <PriceBoard x={760} y={760} price={up ? '$15.50' : '$15'} color={up ? RED : INK} />
    {t >= P(37) && <BigWord text="a little" x={760} y={620} at={P(37)} size={90} />}
  </>; };
const Everybody = ({t}: {t: number}) => <>
  <BigWord text="everybody" x={540} y={400} at={P(38)} size={120} />
  {t >= P(39) && <><BigSeal x={300} y={G + 40} h={420} id="cardp" flip /><MiniCard x={440} y={G - 260} w={150} /></>}
  {t >= P(40) && <><Walrus x={780} y={G + 40} h={360} id="cashp" hat={false} /><Note x={650} y={G - 230} w={150} /></>}
</>;
const Stare = () => <Penguin id="doug" x={540} y={G + 300} h={950} pose={{lids: 0.35, look: [0, 0]}} />;
const Points = ({t}: {t: number}) => <>
  <BigSeal x={360} y={G + 40} h={460} flip pose={{mouth: 0.3}} />
  <MiniCard x={520} y={G - 260} w={170} />
  <PriceTag x={760} y={560} price="+points" fish="back" at={P(42) + 0.3} color={GREEN} />
</>;
const Nothing = ({t}: {t: number}) => <>
  <Penguin id="doug" x={360} y={G + 40} h={460} pose={{turn: 0.4, look: [0.7, -0.3], brows: 'worried', beak: 'frown'}} />
  <Note x={520} y={G - 220} w={160} />
  <PriceTag x={760} y={560} price="+0" fish="nothing extra" at={P(43) + 0.8} />
</>;
const SignShop = ({t, text, color, at}: {t: number; text: string; color: string; at: number}) => <>
  <Igloo x={540} y={G + 20} w={520} />
  <div style={{position: 'absolute', left: 540, top: 470, transform: `translate(-50%,-50%) rotate(-3deg) scale(${t < at ? 0 : Math.min(1, (t - at) / 0.15)})`, background: color, color: '#fff', border: `7px solid ${INK}`,
    borderRadius: 18, padding: '10px 34px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, whiteSpace: 'nowrap'}}>{text}</div>
</>;
const ReadSign = ({t}: {t: number}) => <>
  <Sign x={760} y={G + 30} text="CASH OR CARD?" w={420} />
  <Penguin id="doug" x={330} y={G + 40} h={480} pose={{turn: 0.5, look: [0.8, -0.6], brows: 'happy', beak: 'smile'}} />
</>;
const CardGood = ({t}: {t: number}) => <>
  <MiniCard x={300} y={700} w={260} rot={-8} />
  <div style={{position: 'absolute', left: 470, top: 560}}><Shield /></div>
  <BigWord text="★" x={850} y={700} at={P(47) + 1.2} size={170} color="#F7CF3B" />
  <BigWord text="fast · safe · points" x={540} y={1000} at={P(47) + 0.2} size={74} color={BLUE} />
</>;
const CashGood = ({t}: {t: number}) => <>
  <Puffin x={540} y={G + 80} h={560} pose={{mouth: 0.35}} />
  <Note x={540} y={520} w={300} rot={-4} />
  <Stamp text="NO BEEP" x={540} y={760} at={P(48) + 0.8} color={GREEN} size={100} />
</>;
const Choice = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 60, top: 380, width: 440, height: 300, border: `7px solid ${INK}`, borderRadius: 26, background: '#EAF7EC', textAlign: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, paddingTop: 20, boxSizing: 'border-box'}}>CASH<Note x={220} y={190} w={200} rot={-4} /></div>
  {t >= P(49) + 0.4 && <div style={{position: 'absolute', left: 580, top: 380, width: 440, height: 300, border: `7px solid ${INK}`, borderRadius: 26, background: '#E8EEF9', textAlign: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, paddingTop: 20, boxSizing: 'border-box'}}>CARD<MiniCard x={220} y={190} w={200} rot={4} /></div>}
  <Penguin id="doug" x={540} y={G + 140} h={560} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.2, 0.6], brows: 'happy'}} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx; ice?: boolean};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <HookB t={t} />},
  {at: P(4), set: (t) => <Hungry t={t} />, fx_: 'zoom', ice: true},
  {at: P(6), set: (t) => <Shop t={t} />, fx_: 'swipe', ice: true},
  {at: P(7), set: (t) => <Menu t={t} />, fx_: 'pop'},
  {at: P(10), set: (t) => <PayCash t={t} />, fx_: 'swipeL', ice: true},
  {at: P(11), set: (t) => <IntoBox t={t} />, fx_: 'zoom', ice: true},
  {at: P(13), set: (t) => <NextDay t={t} />, fx_: 'iris'},
  {at: P(16), set: (t) => <PayCard t={t} />, fx_: 'swipe', ice: true},
  {at: P(18), set: (t) => <LittleLess t={t} />, fx_: 'zoom', ice: true},
  {at: P(19), set: (t) => <WhereRest t={t} />, fx_: 'pop', ice: true},
  {at: P(21), set: (t) => <WhatFor t={t} />, fx_: 'swipe', ice: true},
  {at: P(24), set: (t) => <DontMind t={t} />, fx_: 'swipeL', ice: true},
  {at: P(27), set: (t) => <FewCents t={t} />, fx_: 'pop', ice: true},
  {at: P(28), set: (t) => <Busy t={t} />, fx_: 'swipe', ice: true},
  {at: P(30), set: (t) => <Beeps t={t} />, fx_: 'zoom'},
  {at: P(34), set: (t) => <Adds t={t} />, fx_: 'pop', ice: true},
  {at: P(35), set: (t) => <RealMoney t={t} />, fx_: 'swipeL', ice: true},
  {at: P(36), set: (t) => <PriceUp t={t} />, fx_: 'zoom'},
  {at: P(38), set: (t) => <Everybody t={t} />, fx_: 'swipe', ice: true},
  {at: P(41), set: () => <Stare />, fx_: 'zoom'},
  {at: P(42), set: (t) => <Points t={t} />, fx_: 'swipe', ice: true},
  {at: P(43), set: (t) => <Nothing t={t} />, fx_: 'swipeL', ice: true},
  {at: P(44), set: (t) => <SignShop t={t} text="CASH = small discount" color={GREEN} at={P(44) + 0.8} />, fx_: 'pop', ice: true},
  {at: P(45), set: (t) => <SignShop t={t} text="CARD = small extra fee" color={BLUE} at={P(45) + 0.8} />, fx_: 'swipe', ice: true},
  {at: P(46), set: (t) => <ReadSign t={t} />, fx_: 'swipeL', ice: true},
  {at: P(47), set: (t) => <CardGood t={t} />, fx_: 'pop'},
  {at: P(48), set: (t) => <CashGood t={t} />, fx_: 'swipe', ice: true},
  {at: P(49), set: (t) => <Choice t={t} />, fx_: 'pop', ice: true},
];
const DEEP: [number, number, number, number][] = [[18, 540, G - 380, 1.3], [43, 460, G - 280, 1.2]];
const BIGS: {text: string; at: number; until: number; x?: number; y?: number; color?: string; size: number}[] = [
  {text: 'BEEP!', at: P(17), until: P(18), y: 520, color: RED, size: 200},
];

export const DougCashBurger = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { const c = hookCam(tc); s0 = c.s; fx = c.x; fy = c.y; }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, TIM);
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  const quiet = BIGS.some((b) => tc >= b.at && tc < b.until);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>
        {sh.ice && <Ice />}
        {sh.set(t)}
        {BIGS.map((b, i) => <BigWord key={i} text={b.text} x={b.x ?? 540} y={b.y ?? 960} at={b.at} until={b.until} color={b.color} size={b.size} />)}
      </AbsoluteFill>
    </AbsoluteFill>
    {!quiet && <Captions t={tc} phrases={TIM} y={sh.at === 0 ? 1640 : 1530} />}
    <Audio src={staticFile('doug-cash-burger-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    {/* hook */}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={TEN[0]} name="user-cash-register" vol={0.35} />
    <Sfx at={CASHW - 0.15} name="user-whoosh" vol={0.25} />
    <Sfx at={CARDW - 0.15} name="swoosh-fast" vol={0.3} />
    <Sfx at={CARDW} name="card-beep" vol={0.4} />
    <Sfx at={TEN[2]} name="user-ting" vol={0.4} />
    {/* story */}
    <Sfx at={P(4)} name="penguin-honk" vol={0.3} />
    <Sfx at={P(5) + 0.1} name="user-aww" vol={0.3} />
    <Sfx at={P(7)} name="user-pop" vol={0.35} />
    <Sfx at={P(8)} name="user-pop" vol={0.35} />
    <Sfx at={P(9)} name="user-cash-register" vol={0.4} />
    <Sfx at={P(10) + 0.2} name="user-money" vol={0.35} />
    <Sfx at={P(11) + 0.9} name="user-cash-register" vol={0.35} />
    <Sfx at={P(12)} name="user-yeah" vol={0.35} />
    <Sfx at={P(14)} name="user-pop" vol={0.3} />
    <Sfx at={P(15)} name="user-pop" vol={0.3} />
    <Sfx at={P(17)} name="card-beep" vol={0.45} />
    <Sfx at={P(18) + 0.4} name="user-ting" vol={0.35} />
    <Sfx at={P(20) + 0.2} name="card-beep" vol={0.35} />
    <Sfx at={P(21) + 0.2} name="user-ting" vol={0.3} />
    <Sfx at={P(22) + 0.2} name="user-ting" vol={0.3} />
    <Sfx at={P(23) + 0.3} name="user-ting" vol={0.3} />
    <Sfx at={P(25)} name="swoosh-fast" vol={0.3} />
    <Sfx at={P(26)} name="user-wow" vol={0.3} />
    <Sfx at={P(27) + 0.3} name="card-beep" vol={0.35} />
    <Sfx at={P(29)} name="user-ting" vol={0.35} />
    <Sfx at={P(31)} name="card-beep" vol={0.4} />
    <Sfx at={P(32)} name="card-beep" vol={0.4} />
    <Sfx at={P(33)} name="card-beep" vol={0.4} />
    <Sfx at={P(34) + 0.4} name="user-money-transfer" vol={0.3} />
    <Sfx at={P(35) + 0.6} name="user-aww" vol={0.3} />
    <Sfx at={P(36) + 1.3} name="user-cash-register" vol={0.4} />
    <Sfx at={P(38)} name="user-boom" vol={0.35} />
    <Sfx at={P(41)} name="user-fahh" vol={0.35} />
    <Sfx at={P(42) + 0.3} name="user-wow" vol={0.3} />
    <Sfx at={P(43) + 0.8} name="user-wrong" vol={0.3} />
    <Sfx at={P(44) + 0.8} name="user-ting" vol={0.35} />
    <Sfx at={P(45) + 0.8} name="user-ting" vol={0.35} />
    <Sfx at={P(47) + 1.2} name="user-ting" vol={0.3} />
    <Sfx at={P(48) + 0.8} name="user-yeah" vol={0.35} />
    <Sfx at={P(49)} name="user-pop" vol={0.35} />
    <Sfx at={P(49) + 0.4} name="user-pop" vol={0.35} />
    <Sfx at={P(51)} name="user-ting" vol={0.35} />
  </AbsoluteFill>;
};
