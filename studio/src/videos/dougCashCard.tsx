// EP5 "Cash vs card: the same $10 passed 20 times" (swipe-fee chain) — WhyHook main template (Edit rules v4), template = dougGasIran.tsx.
// Phrase timings: src/data/doug-cash-card.json (tightened ElevenLabs VO x1.045, videos/doug-cash-card/vo). P(i) = phrase i start.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {WhyHook} from '../penguin/whyHook';
import {INK, Penguin, PenguinPose, onTwos} from '../penguin/rig';
import {BigWord, FishPile, IceBank, PriceTag, Sign, Stamp, Title} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {BigSeal, Fox, Puffin, Walrus} from '../penguin/cast';
import TIM from '../data/doug-cash-card.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_CASH_CARD_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1250, RED = '#D83A2E', GREEN = '#2E9E4F', BLUE = '#2F5DA8';
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => { const q = cl(p); return q * q * (3 - 2 * q); };
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const SHOCK = P(1) + 0.75; // the word "card?"

// ---------- money props ----------
// "ten" of every spoken "ten dollars" (tightened VO times) -> the $10 bill pops on that word
const TEN = [1.38, 2.67, 4.27, 10.09, 13.82, 17.23, 19.16, 32.54, 34.58];
const tenPop = (tc: number) => { const d = TEN.map((a) => tc - a).find((x) => x >= 0 && x < 0.4); return d === undefined ? 1 : 1 + 0.2 * Math.sin((d / 0.4) * Math.PI); };
// A real-looking US $10 note (drawn, not a photo): cream-green paper, guilloche border, "10" corners, portrait oval, seals, TEN DOLLARS.
const RealTen = ({w = 300}: {w?: number}) =>
  <svg width={w} height={w * 0.425} viewBox="0 0 470 200" style={{display: 'block', overflow: 'visible'}}>
    <rect x={3} y={3} width={464} height={194} rx={8} fill="#E7E9D6" stroke={INK} strokeWidth={6} />
    <rect x={14} y={14} width={442} height={172} rx={4} fill="none" stroke="#5E7F5A" strokeWidth={5} />
    <rect x={22} y={22} width={426} height={156} rx={3} fill="none" stroke="#9DB28F" strokeWidth={2} strokeDasharray="4 3" />
    <path d="M300 60 Q340 40 380 70 Q420 100 440 80" fill="none" stroke="#E6B07A" strokeWidth={10} opacity={0.6} />
    <text x={235} y={46} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={17} fill="#2E3B2C" textLength={270} lengthAdjust="spacingAndGlyphs">THE UNITED STATES OF AMERICA</text>
    <ellipse cx={235} cy={108} rx={52} ry={58} fill="#D7DEC4" stroke="#3F5A3C" strokeWidth={4} />
    <path d="M205 160 Q205 128 235 124 Q265 128 265 160 Z" fill="#4A5E47" />
    <circle cx={235} cy={100} r={22} fill="#C9D3B5" stroke="#3F5A3C" strokeWidth={3} />
    <path d="M213 94 Q216 72 238 74 Q258 76 258 96 Q250 84 236 84 Q222 86 213 94 Z" fill="#4A5E47" />
    <circle cx={120} cy={108} r={26} fill="none" stroke="#2E3B2C" strokeWidth={3} /><text x={120} y={117} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={26} fill="#2E3B2C">L</text>
    <circle cx={350} cy={118} r={24} fill="#C9DCC2" stroke="#3E7A4C" strokeWidth={4} /><path d="M338 118 L362 118 M350 106 L350 130" stroke="#3E7A4C" strokeWidth={3} />
    <text x={40} y={64} fontFamily="Georgia, serif" fontWeight={700} fontSize={36} fill="#2E3B2C">10</text>
    <text x={430} y={64} textAnchor="end" fontFamily="Georgia, serif" fontWeight={700} fontSize={36} fill="#2E3B2C">10</text>
    <text x={40} y={176} fontFamily="Georgia, serif" fontWeight={700} fontSize={36} fill="#2E3B2C">10</text>
    <text x={436} y={182} textAnchor="end" fontFamily="Georgia, serif" fontWeight={900} fontSize={62} fill="#C9702E" stroke={INK} strokeWidth={1.5}>10</text>
    <text x={235} y={186} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={20} fill="#2E3B2C" textLength={150} lengthAdjust="spacingAndGlyphs">TEN DOLLARS</text>
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

// ---------- hook: Doug looks at CASH -> snaps to CARD -> shock on "card?" ----------
const hookDoug = (t: number): {pose: PenguinPose; mark: string} => {
  const toR = ease((t - P(1)) / 0.3), shock = ease((t - SHOCK) / 0.15);
  const turn = -0.45 + 0.9 * toR;
  if (shock <= 0) return {mark: '?', pose: {turn, look: [turn < 0 ? -0.8 : 0.8, -0.2], brows: 'worried', beak: 'frown', flapL: 14, flapR: 14}};
  return {mark: '!', pose: {turn: 0.45, look: [0.8, -0.3], eyeScale: 1 + 0.4 * shock, pupil: 0.7, brows: 'shock', mouth: 0.7 * shock,
    flapL: 14 + 70 * shock, flapR: 14 + 70 * shock, hop: 40 * shock * Math.max(0, 1 - (t - SHOCK) / 0.5), tremble: 0.6, sweat: true}};
};
const HookSet = ({t = -1}: {t?: number}) => { const d = t < 0 ? undefined : hookDoug(t);
  return <WhyHook dougPose={d?.pose} mark={d?.mark}
    left={{label: 'CASH', price: '$10', unit: 'STAYS $10', obj: <CashIcon t={t} />, color: GREEN}}
    right={{label: 'CARD', price: '$10', unit: 'BECOMES $6.20', obj: <CardSide t={t} />, color: RED}} />; };
export const DougCashCardHook = () => <HookSet />;

// ---------- hook v2 (TikTok flagged "$10 vs $6.20" as misleading): "the difference" split, SAME $10 on both sides ----------
// Left: Doug pays Puffin with the real $10 note. Right: Doug taps his card, the reader shows $10.00. Dashed divider + VS.
const Counter = ({x, w}: {x: number; w: number}) => <>
  <div style={{position: 'absolute', left: x, top: 1100, width: w, height: 300, background: '#C98F55', border: `7px solid ${INK}`, borderRadius: 10,
    backgroundImage: `repeating-linear-gradient(90deg, transparent 0 52px, rgba(0,0,0,0.18) 52px 56px)`}} />
  <div style={{position: 'absolute', left: x - 14, top: 1082, width: w + 28, height: 34, background: '#E0A96D', border: `7px solid ${INK}`, borderRadius: 8}} />
</>;
const DiffSide = ({side}: {side: 'cash' | 'card'}) => { const o = side === 'cash' ? 0 : 540;
  return <>
    <Puffin x={o + 445} y={1180} h={330} id={`hp${side}`} pose={{look: -0.6, mouth: 0.15}} />
    <Counter x={o + 270} w={260} />
    {side === 'card' && <Reader x={o + 330} y={1086} w={96} t={-1} amount="$10" />}
    <Penguin id={`hd${side}`} x={o + 150} y={1420} h={410} pose={{turn: 0.55, look: [0.8, -0.1], flapR: 62, beak: 'flat', lids: 0.25}} />
    {side === 'cash' ? <Bill x={o + 300} y={1040} w={180} rot={-8} /> : <Card x={o + 255} y={1020} w={130} rot={-14} />}
  </>; };
export const DougCashCardHookV2 = () => <AbsoluteFill style={{background: '#fff'}}>
  <Fonts /><HandFont />
  <div style={{position: 'absolute', left: 0, top: 120, width: 1080, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontStyle: 'italic', fontSize: 132,
    color: INK, letterSpacing: -4, textShadow: '5px 6px 0 rgba(0,0,0,0.18)'}}>the difference</div>
  <div style={{position: 'absolute', left: 270 - 190, top: 340}}><RealTen w={380} /></div>
  <div style={{position: 'absolute', left: 810 - 165, top: 320}}><CardIcon w={330} /></div>
  <div style={{position: 'absolute', left: 0, top: 560, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 104, color: GREEN}}>CASH</div>
  <div style={{position: 'absolute', left: 540, top: 560, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 104, color: BLUE}}>CARD</div>
  <div style={{position: 'absolute', left: 536, top: 700, width: 0, height: 760, borderLeft: `8px dashed ${INK}`}} />
  <div style={{position: 'absolute', left: 540 - 62, top: 560, width: 124, height: 124, borderRadius: '50%', background: '#F7CF3B', border: `7px solid ${INK}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 54, color: INK}}>VS</div>
  <DiffSide side="cash" /><DiffSide side="card" />
</AbsoluteFill>;
const hookCam = (t: number) => {
  const toL = ease((t - 0.6) / 0.9) * (1 - ease((t - P(1)) / 0.35));
  const toR = ease((t - P(1)) / 0.35) * (1 - ease((t - SHOCK - 0.15) / 0.3));
  return {s: 1 + 0.16 * (toL + toR), x: 540 + (225 - 540) * toL + (855 - 540) * toR, y: 960 + (760 - 960) * (toL + toR)};
};

// ---------- stage ----------
const Ice = () => <>
  <div style={{position: 'absolute', left: -2000, top: -2000, width: 5080, height: 6000, background: '#fff'}} />
  <div style={{position: 'absolute', left: -2000, top: G - 10, width: 5080, height: 3000, background: '#E4F4FC', borderTop: `6px solid ${INK}`}} />
</>;
const Dark = () => <div style={{position: 'absolute', left: -2000, top: -2000, width: 5080, height: 6000, background: '#24292E'}} />;
const Spot = ({x = 540, y = 1000, r = 440}: {x?: number; y?: number; r?: number}) =>
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: 'radial-gradient(#FFF8DC, rgba(255,248,220,0) 70%)'}} />;

// ---------- sets (one idea per shot) ----------
const Intro = ({t}: {t: number}) => <>
  <Penguin id="doug" x={540} y={G + 220} h={780} pose={{beak: 'smile', brows: 'happy', flapR: t >= P(4) ? 30 : 10, look: t >= P(4) ? [0, -0.9] : [0, 0]}} />
  {t >= P(4) && <BigWord text="3 hairs" x={540} y={470} at={P(4) + 0.1} size={130} />}
</>;

const NeedCut = ({t}: {t: number}) => <>
  <Sign x={720} y={G + 30} text="PUFFIN CUTS" w={400} />
  <BarberPole x={980} y={G + 20} t={t} />
  <Penguin id="doug" x={330} y={G + 40} h={480} pose={{turn: 0.5, look: [0.8, -0.4], brows: 'worried', beak: 'frown', sweat: true}} />
</>;

const Cut = ({t}: {t: number}) => <>
  <Penguin id="doug" x={420} y={G + 40} h={460} pose={{sit: 0.6, lids: 0.6, brows: 'worried', beak: 'frown', tremble: 0.4}} />
  <Puffin x={790} y={G + 40} h={430} pose={{look: -0.6, smirk: true}} />
  <Scissors x={560 + Math.sin(t * 5) * 25} y={G - 400} t={t} s={1.1} />
  <BarberPole x={1000} y={G + 20} t={t} />
</>;

const PayCash = ({t}: {t: number}) => <>
  <Penguin id="doug" x={290} y={G + 40} h={440} pose={{turn: 0.5, look: [0.8, -0.2], beak: 'smile', brows: 'happy', flapR: t < TEN[3] + 0.4 ? 70 : 20}} />
  <Puffin x={800} y={G + 40} h={430} pose={{look: -0.5, mouth: t >= P(8) ? 0.3 : 0}} />
  <BillFly t={t} x1={480} y1={G - 130} x2={760} y2={G - 470} a={TEN[3]} b={TEN[3] + 0.6} w={240} />
  <Stamp text="CASH" x={540} y={560} at={P(8)} color={GREEN} size={120} />
</>;

const SealShop = ({t}: {t: number}) => <>
  <NameTag x={540} y={400} text="SEAL FISH SHOP" color={BLUE} />
  <div style={{position: 'absolute', left: 560, top: G - 230, width: 440, height: 240, background: '#E9D2A8', border: `7px solid ${INK}`, borderRadius: 14}} />
  <FishPile x={780} y={G - 230} n={6} w={120} />
  <BigSeal x={800} y={G - 220} h={420} pose={{look: -0.5, mouth: t >= TEN[4] + 0.6 ? 0.3 : 0}} />
  <Puffin x={260} y={G + 40} h={400} flip pose={{look: 0.5}} />
  <BillFly t={t} x1={410} y1={G - 120} x2={700} y2={G - 560} a={TEN[4]} b={TEN[4] + 0.6} w={220} />
  {t >= TEN[4] + 0.6 && <PriceTag x={330} y={560} price="$10" fish="same bill" at={TEN[4] + 0.6} color={GREEN} />}
</>;

const CarWash = ({t}: {t: number}) => <>
  <NameTag x={540} y={400} text="LARRY CAR WASH" color={RED} />
  <Sled x={560} y={G + 20} t={t} />
  <Walrus x={880} y={G + 40} h={400} pose={{look: -0.6, laugh: t >= TEN[5] + 0.6 ? 1 : 0}} />
  <BigSeal x={190} y={G + 40} h={400} flip pose={{look: 0.4}} />
  <BillFly t={t} x1={350} y1={G - 130} x2={860} y2={G - 470} a={TEN[5]} b={TEN[5] + 0.6} w={220} arc={320} />
  {t >= TEN[5] + 0.6 && <PriceTag x={330} y={700} price="$10" fish="same bill" at={TEN[5] + 0.6} color={GREEN} />}
</>;

const Chain = ({t}: {t: number}) => { const xs = [120, 330, 540, 750, 960], hop = cl((t - P(13)) / 0.85) * 4, i0 = Math.floor(hop), f = hop - i0;
  const bx = lerp(xs[Math.min(4, i0)], xs[Math.min(4, i0 + 1)], f), by = G - 380 - Math.sin(f * Math.PI) * 160;
  return <>
    <Puffin x={xs[0]} y={G + 40} h={260} flip pose={{look: 0.5}} />
    <BigSeal x={xs[1]} y={G + 40} h={280} flip />
    <Walrus x={xs[2]} y={G + 40} h={260} flip hat={false} />
    <Puffin x={xs[3]} y={G + 40} h={260} id="pf2" flip />
    <BigSeal x={xs[4]} y={G + 40} h={280} id="bs2" />
    {t < P(14) ? <Bill x={bx} y={by} w={200} /> : <Bill x={540} y={760} w={480} s={1 + 0.05 * Math.sin(t * 6)} />}
    {t < P(14) && <BigWord text={`x${Math.min(20, 1 + Math.floor(cl((t - P(13)) / 0.8) * 19))}`} x={540} y={520} at={P(13)} size={140} color={BLUE} />}
    <Stamp text="STILL $10" x={540} y={1040} at={P(14) + 0.1} color={GREEN} size={100} />
  </>; };

const Loop = ({t}: {t: number}) => { const a = (t - P(15)) * 4.2;
  return <>
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      <circle cx={540} cy={850} r={300} fill="none" stroke={INK} strokeWidth={8} strokeDasharray="30 26" opacity={0.5} />
      <path d="M840 850 l-26 -40 l52 0 Z" fill={INK} opacity={0.5} />
    </svg>
    <Bill x={540 + Math.cos(a) * 300} y={850 + Math.sin(a) * 300} w={240} rot={0} />
    <Penguin id="doug" x={540} y={1060} h={300} pose={{look: [Math.cos(a) * 0.8, Math.sin(a) * 0.8], beak: 'smile', brows: 'happy'}} />
    <Stamp text="NEVER SHRINK" x={540} y={400} at={P(16)} color={GREEN} size={100} />
  </>; };

const PayCard = ({t}: {t: number}) => { const swipe = ease((t - P(17) - 0.4) / 0.5);
  return <>
    <Penguin id="doug" x={290} y={G + 40} h={440} pose={{turn: 0.5, look: [0.8, -0.2], beak: 'smile', flapR: 70}} />
    <Puffin x={840} y={G + 40} h={430} pose={{look: -0.5}} />
    <Reader x={640} y={G - 260} w={190} t={t} beeps={[P(18)]} />
    <Card x={lerp(420, 600, swipe)} y={G - 400 + 40 * swipe} w={220} />
  </>; };

const NineSeventySix = ({t}: {t: number}) => <>
  <Puffin x={540} y={G + 40} h={560} pose={{look: 0, mouth: 0.2, lids: 0.3}} />
  <Bill x={540} y={G - 700} w={360} text="$9.76" color={RED} s={0.98} />
  <PriceTag x={330} y={340} price="-24¢" at={P(19) + 0.6} />
</>;

const FoxReveal = ({t}: {t: number}) => { const p = ease((t - P(20) - 0.2) / 0.6);
  return <>
    <Dark /><Spot y={1000} r={520} />
    <Fox x={540} y={1460} h={760} pose={{laugh: t >= P(20) + 0.9 ? 1 : 0, pocket: p * 0.3, look: -0.3}} />
    {p < 1 && <Coin x={lerp(1000, 610, p)} y={lerp(1180, 1080, p) - Math.sin(p * Math.PI) * 120} text="24¢" />}
    {t >= P(20) + 0.5 && <NameTag x={540} y={380} text="FOX THE BANKER" color="#26324A" />}
  </>; };

const CardPay = ({t, i0, from, to}: {t: number; i0: number; from: 'puffin' | 'seal'; to: 'seal' | 'larry'}) => { const fox = ease((t - P(i0 + 2)) / 0.3);
  const amount = from === 'puffin' ? '$9.53' : '$9.30';
  return <>
    {from === 'puffin' ? <Puffin x={200} y={G + 40} h={380} flip pose={{look: 0.5}} /> : <BigSeal x={200} y={G + 40} h={400} flip pose={{look: 0.5}} />}
    {to === 'seal' ? <BigSeal x={880} y={G + 40} h={400} pose={{look: -0.5, mouth: t >= P(i0 + 2) ? 0.3 : 0}} /> : <Walrus x={880} y={G + 40} h={380} pose={{look: -0.5, mouth: t >= P(i0 + 2) ? 0.3 : 0}} />}
    <Reader x={540} y={G - 120} w={180} t={t} beeps={[P(i0 + 1)]} amount={amount} />
    <Card x={380} y={G - 470} w={200} />
    <Fox x={lerp(1280, 760, fox)} y={G - 150} h={420} id={`fx${i0}`} pose={{flap: 40, laugh: fox > 0.9 ? 1 : 0}} />
    {t >= P(i0 + 2) && <BigWord text="cut!" x={760} y={560} at={P(i0 + 2) + 0.1} size={110} color={RED} />}
    {t >= P(i0 + 2) && <PriceTag x={300} y={560} price={amount} at={P(i0 + 2) + 0.15} size={0.8} />}
  </>; };

const Shrink = ({t}: {t: number}) => { const k = Math.min(5, Math.floor(cl((t - P(27)) / 1.3) * 6)), val = 10 * Math.pow(1 - 0.0236, k * 2);
  return <>
    <Bill x={540} y={800} w={560} s={val / 10} text={`$${val.toFixed(2)}`} color={k ? RED : INK} rot={0} />
    <Reader x={540} y={G + 20} w={150} t={t} beeps={[0, 1, 2, 3, 4].map((i) => P(27) + 0.26 * (i + 1))} amount="" />
  </>; };

const TwentyBeeps = ({t}: {t: number}) => { const n = Math.min(20, 1 + Math.floor(cl((t - P(28)) / 0.8) * 19));
  return <>
    <Dark /><Spot y={900} r={500} />
    <div style={{position: 'absolute', left: 540, top: 560, transform: 'translate(-50%,-50%) rotate(-3deg)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 150, color: '#F7CF3B', whiteSpace: 'nowrap'}}>BEEP x{n}</div>
    <Reader x={540} y={1340} w={260} t={t} beeps={Array.from({length: 6}, (_, i) => P(28) + i * 0.14)} amount="" />
  </>; };

const Compare = ({t}: {t: number}) => { const six = P(29) + 0.98;
  return <>
    <div style={{position: 'absolute', left: 0, top: 330, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 90, color: GREEN}}>CASH</div>
    <div style={{position: 'absolute', left: 540, top: 330, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 90, color: RED}}>CARD</div>
    <div style={{position: 'absolute', left: 535, top: 320, width: 10, height: 1000, background: INK}} />
    <Bill x={270} y={760} w={440} rot={-4} />
    <Bill x={810} y={760} w={440} rot={4} s={t >= six ? 0.62 : 1 - 0.38 * ease((t - P(29)) / 0.95)} text={t >= six ? '$6.20' : '$10'} color={t >= six ? RED : INK} />
    <Penguin id="doug" x={540} y={G + 160} h={420} pose={t >= six ? {brows: 'shock', eyeScale: 1.35, pupil: 0.6, mouth: 0.6, flapL: 80, flapR: 80, sweat: true} : {look: [0.7, -0.6], brows: 'worried'}} />
  </>; };

const WhereIs = ({t}: {t: number}) => <>
  <Penguin id="doug" x={540} y={G + 60} h={560} pose={{turn: Math.sin((t - P(30)) * 6) * 0.6, look: [Math.sin((t - P(30)) * 6) * 0.9, -0.1], brows: 'worried', beak: 'frown'}} />
  <BigWord text="$3.80?" x={540} y={460} at={P(30) + 0.3} size={170} color={RED} />
  <BigWord text="?" x={230} y={760} at={P(30) + 0.6} size={160} />
  <BigWord text="?" x={860} y={720} at={P(30) + 0.8} size={130} />
</>;

const Pocket = ({t}: {t: number}) => <>
  <Dark /><Spot y={1000} r={540} />
  <Fox x={540} y={1460} h={820} pose={{laugh: 1, pocket: 1, lids: 0.5}} />
  {[0, 1, 2].map((i) => { const p = cl((t - P(31) - i * 0.15) / 0.4); return p > 0 && p < 1 ? <Coin key={i} x={lerp(200 + i * 300, 690, p)} y={lerp(400, 1120, p)} text="¢" w={90} /> : null; })}
</>;

const Name = () => <><Title lines={['SWIPE FEE']} y={700} size={150} /><Card x={540} y={1050} w={360} /></>;
const Stare = ({marks}: {marks?: boolean}) => <>
  <Penguin id="doug" x={540} y={G + 300} h={950} pose={{lids: 0.35, look: [0, 0], brows: marks ? 'worried' : 'none'}} />
  {marks && <BigWord text="?" x={830} y={420} at={-1} size={220} />}
</>;

const Billions = ({t}: {t: number}) => { const n = 2 + Math.floor(10 * ease((t - P(34) - 1.2) / 1.8));
  return <>
    <NameTag x={540} y={360} text="USA" color={BLUE} />
    <div style={{position: 'absolute', left: 540, top: 560, transform: 'translate(-50%,-50%) rotate(-3deg)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 100, color: RED, whiteSpace: 'nowrap',
      opacity: t >= P(34) + 1.2 ? 1 : 0}}>$198 BILLION</div>
    <div style={{position: 'absolute', left: 540, top: 690, transform: 'translate(-50%,-50%)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60, color: INK, whiteSpace: 'nowrap',
      opacity: t >= P(34) + 1.2 ? 1 : 0}}>in swipe fees</div>
    {Array.from({length: n}, (_, i) => <Bill key={i} x={300 + (i % 4) * 160} y={G - 40 - Math.floor(i / 4) * 70} w={200} rot={((i * 37) % 11) - 5} />)}
    <Fox x={900} y={G + 40} h={380} pose={{laugh: 1, pocket: 1}} />
    <Stamp text="IN 1 YEAR" x={420} y={880} at={P(35)} color={RED} size={90} />
  </>; };

const Monthly = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 140, top: 360, width: 360, height: 380, background: '#fff', border: `7px solid ${INK}`, borderRadius: 20, overflow: 'hidden'}}>
    <div style={{height: 90, background: RED, borderBottom: `7px solid ${INK}`, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, textAlign: 'center', lineHeight: '90px'}}>MONTH</div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, padding: 18}}>{Array.from({length: 20}, (_, i) => <div key={i} style={{height: 36, borderRadius: 6, background: '#E4F4FC'}} />)}</div>
  </div>
  <PriceTag x={790} y={560} price="$50" fish="every month" at={P(36) + 0.6} />
  {[['doug', 220], ['puffin', 540], ['seal', 860]].map(([who, x], i) => <React.Fragment key={who}>
    {who === 'doug' ? <Penguin id="doug" x={x as number} y={G + 60} h={300} pose={{brows: 'worried', beak: 'frown'}} />
      : who === 'puffin' ? <Puffin x={x as number} y={G + 60} h={280} /> : <BigSeal x={x as number} y={G + 60} h={300} />}
    {t >= P(37) + i * 0.15 && <BigWord text="-$50" x={x as number} y={880} at={P(37) + i * 0.15} size={90} color={RED} />}
  </React.Fragment>)}
</>;

const NotWork = ({t}: {t: number}) => <>
  <Panel x={200} y={560} w={290}><Scissors x={145} y={145} t={0} s={1} /></Panel>
  <Panel x={540} y={560} w={290}><FishPile x={145} y={200} n={3} w={110} /></Panel>
  <Panel x={880} y={560} w={290}><Sled x={145} y={210} w={240} t={0} /></Panel>
  <XMark x={200} y={560} at={P(38) + 0.3} t={t} /><XMark x={540} y={560} at={P(39) + 0.3} t={t} /><XMark x={880} y={560} at={P(40) + 0.3} t={t} />
  <Fox x={540} y={G + 60} h={460} pose={{lids: 0.55, look: 0.2}} />
</>;

const JustBeep = ({t}: {t: number}) => <>
  <Dark /><Spot y={1000} r={540} />
  <Fox x={500} y={1460} h={820} pose={{flap: 70, holding: true, laugh: t >= P(41) + 0.9 ? 1 : 0, lids: 0.5}} />
  <BigWord text="beep." x={820} y={520} at={P(41) + 0.8} size={150} color="#F7CF3B" />
</>;

const BankLove = ({t}: {t: number}) => <>
  <IceBank x={540} y={G + 20} w={560} />
  <Card x={250} y={560} w={260} />
  <BigWord text="♥" x={250} y={380} at={P(42) + 1.0} size={170} color={RED} />
  {t >= P(43) && <><Bill x={830} y={560} w={260} /><XMark x={830} y={560} at={P(43) + 0.2} t={t} s={0.9} /></>}
  <Fox x={900} y={G + 40} h={320} pose={{lids: 0.5}} />
</>;

const KeepCash = ({t}: {t: number}) => <>
  <Penguin id="doug" x={290} y={G + 40} h={460} pose={{turn: 0.5, look: [0.8, -0.2], beak: 'smile', brows: 'happy', flapR: t < P(44) + 0.6 ? 70 : 20, blush: t >= P(45) ? 1 : 0}} />
  <Puffin x={820} y={G + 40} h={420} pose={{look: -0.5, mouth: 0.3}} />
  {t < P(44) + 0.2 ? <Bill x={400} y={G - 330} w={240} /> : <BillFly t={t} x1={400} y1={G - 330} x2={780} y2={G - 470} a={P(44) + 0.2} b={P(44) + 0.8} w={240} />}
  {t >= P(45) && <BigWord text="3 hairs ✓" x={420} y={520} at={P(45) + 0.15} size={110} color={GREEN} />}
</>;

const Choice = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 60, top: 380, width: 440, padding: 24, border: `7px solid ${INK}`, borderRadius: 26, background: '#EAF7EC', textAlign: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, lineHeight: 1.15, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>CASH<CashIcon w={220} /></div>
  {t >= P(46) + 0.4 && <div style={{position: 'absolute', left: 580, top: 380, width: 440, padding: 24, border: `7px solid ${INK}`, borderRadius: 26, background: '#FCEAE8', textAlign: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, lineHeight: 1.15, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>CARD<CardIcon w={220} /></div>}
  <Penguin id="doug" x={540} y={G + 140} h={560} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.2, 0.6], brows: 'happy'}} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx; ice?: boolean};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <HookSet t={t} />},
  {at: P(3), set: (t) => <Intro t={t} />, fx_: 'zoom', ice: true},
  {at: P(5), set: (t) => <NeedCut t={t} />, fx_: 'swipe', ice: true},
  {at: P(6), set: (t) => <Cut t={t} />, fx_: 'pop', ice: true},
  {at: P(7), set: (t) => <PayCash t={t} />, fx_: 'swipeL', ice: true},
  {at: P(9), set: (t) => <SealShop t={t} />, fx_: 'swipe', ice: true},
  {at: P(11), set: (t) => <CarWash t={t} />, fx_: 'swipe', ice: true},
  {at: P(13), set: (t) => <Chain t={t} />, fx_: 'zoom', ice: true},
  {at: P(15), set: (t) => <Loop t={t} />, fx_: 'iris', ice: true},
  {at: P(17), set: (t) => <PayCard t={t} />, fx_: 'pop', ice: true},
  {at: P(19), set: (t) => <NineSeventySix t={t} />, fx_: 'zoom', ice: true},
  {at: P(20), set: (t) => <FoxReveal t={t} />, fx_: 'iris'},
  {at: P(21), set: (t) => <CardPay t={t} i0={21} from="puffin" to="seal" />, fx_: 'swipe', ice: true},
  {at: P(24), set: (t) => <CardPay t={t} i0={24} from="seal" to="larry" />, fx_: 'swipeL', ice: true},
  {at: P(27), set: (t) => <Shrink t={t} />, fx_: 'pop', ice: true},
  {at: P(28), set: (t) => <TwentyBeeps t={t} />, fx_: 'zoom'},
  {at: P(29), set: (t) => <Compare t={t} />, fx_: 'pop', ice: true},
  {at: P(30), set: (t) => <WhereIs t={t} />, fx_: 'swipe', ice: true},
  {at: P(31), set: (t) => <Pocket t={t} />, fx_: 'iris'},
  {at: P(32), set: () => <Name />, fx_: 'pop'},
  {at: P(33), set: () => <Stare />, fx_: 'zoom'},
  {at: P(34), set: (t) => <Billions t={t} />, fx_: 'swipe', ice: true},
  {at: P(36), set: (t) => <Monthly t={t} />, fx_: 'swipeL', ice: true},
  {at: P(38), set: (t) => <NotWork t={t} />, fx_: 'pop', ice: true},
  {at: P(41), set: (t) => <JustBeep t={t} />, fx_: 'iris'},
  {at: P(42), set: (t) => <BankLove t={t} />, fx_: 'swipe', ice: true},
  {at: P(44), set: (t) => <KeepCash t={t} />, fx_: 'swipeL', ice: true},
  {at: P(46), set: (t) => <Choice t={t} />, fx_: 'pop', ice: true},
];
// deep zooms [phrase, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [
  [4, 540, 820, 1.45], [19, 540, G - 520, 1.3], [26, 760, G - 380, 1.35], [31, 640, 1150, 1.5], [45, 330, G - 300, 1.5],
];
// big centre words; the caption hides while they (and full-screen text) are on screen
const BIGS: {text: string; at: number; until: number; x?: number; y?: number; color?: string; size: number}[] = [
  {text: 'BEEP!', at: P(18), until: P(19), y: 520, color: RED, size: 200},
  {text: 'BEEP!', at: P(22), until: P(23), y: 420, color: RED, size: 160},
  {text: 'BEEP!', at: P(25), until: P(26), y: 420, color: RED, size: 160},
];
const QUIET: [number, number][] = [[P(32), P(33)], [P(28), P(29)]];

export const DougCashCard = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { const c = hookCam(tc); s0 = c.s; fx = c.x; fy = c.y; }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, TIM);
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  const shk = (a: number) => tc > a && tc < a + 0.25 ? Math.sin(tc * 90) * 8 * (1 - (tc - a) / 0.25) : 0;
  const shake = shk(SHOCK) + shk(P(29) + 0.98) + shk(P(34) + 1.2);
  const quiet = BIGS.some((b) => tc >= b.at && tc < b.until) || QUIET.some(([a, b]) => tc >= a && tc < b);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s + shake}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>
        {sh.ice && <Ice />}
        {sh.set(t)}
        {BIGS.map((b, i) => <BigWord key={i} text={b.text} x={b.x ?? 540} y={b.y ?? 960} at={b.at} until={b.until} color={b.color} size={b.size} />)}
      </AbsoluteFill>
    </AbsoluteFill>
    {!quiet && <Captions t={tc} phrases={TIM} y={sh.at === 0 ? 1640 : 1530} />}
    <Audio src={staticFile('doug-cash-card-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    {/* hook */}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.75} name="user-whoosh" vol={0.25} />
    <Sfx at={TEN[0]} name="user-cash-register" vol={0.4} />
    <Sfx at={TEN[1]} name="user-money" vol={0.3} />
    <Sfx at={P(1) + 0.1} name="swoosh-fast" vol={0.3} />
    <Sfx at={SHOCK - 0.08} name="card-beep" vol={0.3} />
    <Sfx at={SHOCK} name="user-boom" vol={0.5} />
    <Sfx at={SHOCK + 0.05} name="penguin-squawk" vol={0.4} />
    {/* story: cash */}
    <Sfx at={P(3)} name="penguin-honk" vol={0.3} />
    <Sfx at={P(4) + 0.1} name="user-ting" vol={0.4} />
    <Sfx at={P(5) + 0.3} name="user-aww" vol={0.3} />
    {[0, 0.25, 0.5].map((d) => <Sfx key={d} at={P(6) + 0.2 + d} name="pop-high" vol={0.3} />)}
    <Sfx at={TEN[3]} name="user-money" vol={0.35} />
    <Sfx at={P(8)} name="user-cash-register" vol={0.4} />
    <Sfx at={TEN[4]} name="user-money" vol={0.35} />
    <Sfx at={TEN[4] + 0.6} name="user-cash-register" vol={0.35} />
    <Sfx at={P(11) + 0.2} name="splat" vol={0.25} />
    <Sfx at={TEN[5] + 0.6} name="user-cash-register" vol={0.35} />
    <Sfx at={TEN[5] + 0.65} name="walrus-laugh" vol={0.35} />
    <Sfx at={P(13)} name="user-money-transfer" vol={0.3} />
    <Sfx at={P(14) + 0.1} name="user-ting" vol={0.4} />
    <Sfx at={P(15)} name="swoosh-fast" vol={0.3} />
    <Sfx at={P(16)} name="user-yeah" vol={0.35} />
    {/* story: card */}
    <Sfx at={P(17)} name="user-notif" vol={0.3} />
    <Sfx at={P(18)} name="card-beep" vol={0.45} />
    <Sfx at={P(19) + 0.6} name="user-wrong" vol={0.35} />
    <Sfx at={P(20)} name="fox-snicker" vol={0.4} />
    <Sfx at={P(20) + 0.8} name="user-ting" vol={0.35} />
    <Sfx at={P(22)} name="card-beep" vol={0.45} />
    <Sfx at={P(23)} name="user-slap" vol={0.4} />
    <Sfx at={P(23) + 0.2} name="fox-snicker" vol={0.35} />
    <Sfx at={P(25)} name="card-beep" vol={0.45} />
    <Sfx at={P(26)} name="user-slap" vol={0.4} />
    {[1, 2, 3, 4, 5].map((i) => <Sfx key={`b${i}`} at={P(27) + 0.26 * i} name="card-beep" vol={0.3} />)}
    <Sfx at={P(28)} name="user-timer" vol={0.3} />
    {[0, 1, 2, 3, 4, 5].map((i) => <Sfx key={`c${i}`} at={P(28) + 0.14 * i} name="card-beep" vol={0.28} />)}
    <Sfx at={P(29) + 0.98} name="user-boom" vol={0.5} />
    <Sfx at={P(29) + 1.0} name="user-shock" vol={0.35} />
    <Sfx at={P(30)} name="user-fahh" vol={0.4} />
    <Sfx at={P(31)} name="user-cash-register" vol={0.4} />
    <Sfx at={P(31) + 0.2} name="fox-snicker" vol={0.4} />
    <Sfx at={P(32)} name="user-pop" vol={0.4} />
    <Sfx at={P(33)} name="user-fahh-long" vol={0.4} />
    {/* real life */}
    <Sfx at={P(34) + 1.2} name="user-boom" vol={0.45} />
    <Sfx at={P(34) + 1.3} name="user-cash-register" vol={0.35} />
    <Sfx at={P(35)} name="user-slap" vol={0.4} />
    <Sfx at={P(36)} name="user-timer" vol={0.3} />
    <Sfx at={P(36) + 0.6} name="user-cash-register" vol={0.35} />
    <Sfx at={P(37)} name="user-wrong" vol={0.35} />
    <Sfx at={P(38) + 0.3} name="user-wrong" vol={0.3} />
    <Sfx at={P(39) + 0.3} name="user-wrong" vol={0.3} />
    <Sfx at={P(40) + 0.3} name="user-wrong" vol={0.3} />
    <Sfx at={P(41) + 0.8} name="card-beep" vol={0.45} />
    <Sfx at={P(41) + 1.0} name="fox-snicker" vol={0.4} />
    <Sfx at={P(42) + 1.0} name="user-pop" vol={0.35} />
    <Sfx at={P(43) + 0.2} name="user-slap" vol={0.4} />
    {/* ending */}
    <Sfx at={P(44) + 0.3} name="user-cash-register" vol={0.4} />
    <Sfx at={P(45) + 0.15} name="user-yeah" vol={0.35} />
    <Sfx at={P(46)} name="user-pop" vol={0.35} />
    <Sfx at={P(46) + 0.4} name="user-pop" vol={0.35} />
    <Sfx at={P(48)} name="user-ting" vol={0.35} />
  </AbsoluteFill>;
};
