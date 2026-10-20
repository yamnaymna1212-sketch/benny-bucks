// EP5 v3 "Cash vs card: who pays the swipe fee" (balanced, Truth rule; v1/v2 removed on TikTok) — WhyHook main template (Edit rules v4), template = dougGasIran.tsx.
// Phrase timings: src/data/doug-cash-card.json (tightened ElevenLabs VO x1.045, videos/doug-cash-card/vo). P(i) = phrase i start.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HAND, HandFont} from '../base';
import {WhyHook} from '../penguin/whyHook';
import {INK, Penguin, PenguinPose, onTwos} from '../penguin/rig';
import {BigWord, FishPile, IceBank, Paper, PriceTag, Sign, Stamp, Title} from '../penguin/world';
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
const SHOCK = 3.55; // the word "card?"

// ---------- money props ----------
// "ten" of every spoken "ten dollars" (tightened VO times) -> the $10 bill pops on that word
const TEN = [1.6, 2.9, 4.62, 11.3, 13.35]; // v3 VO (Edge TTS), estimated inside each phrase
const tenPop = (tc: number) => { const d = TEN.map((a) => tc - a).find((x) => x >= 0 && x < 0.4); return d === undefined ? 1 : 1 + 0.2 * Math.sin((d / 0.4) * Math.PI); };
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
const DiffSide = ({side, t = -1}: {side: 'cash' | 'card'; t?: number}) => { const o = side === 'cash' ? 0 : 540;
  return <>
    <Puffin x={o + 445} y={1180} h={330} id={`hp${side}`} pose={{look: -0.6, mouth: 0.15}} />
    <Counter x={o + 270} w={260} />
    {side === 'card' && <Reader x={o + 330} y={1086} w={96} t={t} beeps={[SHOCK]} amount="$10" />}
    <Penguin id={`hd${side}`} x={o + 150} y={1420} h={410} pose={{turn: 0.55, look: [0.8, -0.1], flapR: 62, beak: 'flat', lids: 0.25}} />
    {side === 'cash' ? <Bill x={o + 300} y={1040} w={180} rot={-8} /> : <div style={{position: 'absolute', left: 0, top: 0, transform: `scale(${t < 0 ? 1 : tenPop(t - (SHOCK - TEN[1])) })`, transformOrigin: `${o + 255}px 1020px`}}><Card x={o + 255} y={1020} w={130} rot={-14} /></div>}
  </>; };
const HookV2 = ({t = -1}: {t?: number}) => <AbsoluteFill style={{background: '#fff'}}>
  <Fonts /><HandFont />
  <div style={{position: 'absolute', left: 0, top: 120, width: 1080, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontStyle: 'italic', fontSize: 96, whiteSpace: 'nowrap',
    color: INK, letterSpacing: -3, textShadow: '5px 6px 0 rgba(0,0,0,0.18)'}}>What the difference</div>
  <div style={{position: 'absolute', left: 270 - 190, top: 340}}><RealTen w={380} /></div>
  <div style={{position: 'absolute', left: 810 - 165, top: 320}}><CardIcon w={330} /></div>
  <div style={{position: 'absolute', left: 0, top: 560, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 104, color: GREEN}}>CASH</div>
  <div style={{position: 'absolute', left: 540, top: 560, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 104, color: BLUE}}>CARD</div>
  <div style={{position: 'absolute', left: 536, top: 700, width: 0, height: 760, borderLeft: `8px dashed ${INK}`}} />
  <div style={{position: 'absolute', left: 540 - 62, top: 560, width: 124, height: 124, borderRadius: '50%', background: '#F7CF3B', border: `7px solid ${INK}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 54, color: INK}}>VS</div>
  <DiffSide side="cash" t={t} /><DiffSide side="card" t={t} />
</AbsoluteFill>;
export const DougCashCardHookV2 = () => <HookV2 />;
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

// ---------- sets (one idea per shot) — v3 script videos/doug-cash-card/voice-v3.txt ----------
const NotPuffin = ({t}: {t: number}) => <>
  <Puffin x={540} y={G + 120} h={760} pose={{look: 0, lids: 0.35, mouth: 0.1}} />
  <BigWord text="?" x={860} y={520} at={P(3) + 0.2} size={200} />
</>;
const Intro = ({t}: {t: number}) => <>
  <Penguin id="doug" x={540} y={G + 220} h={780} pose={{beak: 'smile', brows: 'happy', flapR: t >= P(5) ? 30 : 10, look: t >= P(5) ? [0, -0.9] : [0, 0]}} />
  {t >= P(5) && <BigWord text="3 hairs" x={540} y={470} at={P(5) + 0.1} size={130} />}
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
  <Puffin x={800} y={G + 40} h={430} pose={{look: -0.5, mouth: t >= P(9) ? 0.3 : 0}} />
  <BillFly t={t} x1={480} y1={G - 130} x2={760} y2={G - 470} a={TEN[3]} b={TEN[3] + 0.6} w={240} />
  <Stamp text="CASH" x={540} y={560} at={P(9)} color={GREEN} size={120} />
</>;
const PuffinKeeps = ({t}: {t: number}) => <>
  <Puffin x={540} y={G + 120} h={640} pose={{look: 0, mouth: 0.3, flap: 40}} />
  <Bill x={540} y={560} w={420} rot={-3} />
  <Stamp text="KEEPS $10" x={540} y={330} at={TEN[4] + 0.2} color={GREEN} size={100} />
</>;
const PayCard = ({t}: {t: number}) => { const swipe = ease((t - P(11) - 0.8) / 0.5);
  return <>
    <Penguin id="doug" x={290} y={G + 40} h={440} pose={{turn: 0.5, look: [0.8, -0.2], beak: 'smile', flapR: 70}} />
    <Puffin x={840} y={G + 40} h={430} pose={{look: -0.5}} />
    <Reader x={640} y={G - 260} w={190} t={t} beeps={[P(12)]} />
    <Card x={lerp(420, 600, swipe)} y={G - 400 + 40 * swipe} w={220} />
  </>; };
const NineSeventySix = ({t}: {t: number}) => <>
  <Puffin x={540} y={G + 40} h={560} pose={{look: 0, mouth: 0.2, lids: 0.3}} />
  <PriceTag x={540} y={520} price="$9.76" fish="to Puffin" at={P(13) + 0.3} color={GREEN} size={1.2} />
</>;
const Fee = ({t}: {t: number}) => <>
  <Coin x={540} y={760} text="24¢" w={300} />
  <Stamp text="SWIPE FEE" x={540} y={460} at={P(14) + 1.0} color={RED} size={110} />
  <div style={{position: 'absolute', left: 540, top: 1010, transform: 'translateX(-50%)', fontFamily: HAND, fontSize: 56, color: INK, whiteSpace: 'nowrap'}}>about 2.4% of $10</div>
</>;
const WhereFee = ({t}: {t: number}) => { const p = ease((t - P(15) - 0.3) / 0.9);
  return <>
    <IceBank x={380} y={G + 20} w={480} />
    <NameTag x={380} y={420} text="CARD BANK" color={BLUE} />
    <div style={{position: 'absolute', left: 660, top: 760, width: 330, height: 220, background: '#F4FAFD', border: `7px solid ${INK}`, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 46, color: INK, textAlign: 'center', opacity: t >= P(15) + 1.0 ? 1 : 0}}>CARD<br />NETWORK</div>
    {p < 1 && <Coin x={lerp(540, 380, p)} y={lerp(1400, 900, p) - Math.sin(p * Math.PI) * 200} text="¢" w={110} />}
  </>; };
const FoxIntro = ({t}: {t: number}) => <>
  <Dark /><Spot y={1000} r={520} />
  <Fox x={540} y={1460} h={760} pose={{look: -0.3, smirk: false, lids: 0.3}} />
  <NameTag x={540} y={380} text="FOX THE BANKER" color="#26324A" />
</>;
const Lazy = ({t}: {t: number}) => <>
  <Fox x={540} y={G + 60} h={560} pose={{lids: t < P(18) ? 0.7 : 0.1, smirk: false, look: 0}} />
  <BigWord text="lazy?" x={540} y={460} at={P(17) + 0.2} until={P(18)} size={150} />
  <Stamp text="NO" x={540} y={460} at={P(18)} color={RED} size={170} />
</>;
const Check = ({x, y, at, t}: {x: number; y: number; at: number; t: number}) => t < at ? null :
  <div style={{position: 'absolute', left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: '50%', background: GREEN, border: `6px solid ${INK}`, color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, fontWeight: 900, transform: `scale(${Math.min(1, (t - at) / 0.12)})`}}>✓</div>;
const Shield = () => <svg width={170} height={190} viewBox="0 0 170 190"><path d="M85 10 L155 40 Q155 130 85 180 Q15 130 15 40 Z" fill={BLUE} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
  <path d="M55 95 L78 118 L118 70" fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Services = ({t}: {t: number}) => <>
  <Panel x={200} y={560} w={290}><div style={{position: 'absolute', left: 60, top: 40}}><Shield /></div></Panel>
  <Panel x={540} y={560} w={290}><div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: GREEN}}><span style={{fontSize: 110, lineHeight: 1}}>↩</span>MONEY BACK</div></Panel>
  <Panel x={880} y={560} w={290}><div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, color: INK, lineHeight: 1.1, textAlign: 'center'}}>BUY NOW<br /><span style={{color: RED}}>PAY LATER</span></div></Panel>
  <Check x={310} y={680} at={P(19) + 0.3} t={t} /><Check x={650} y={680} at={P(20) + 0.4} t={t} /><Check x={990} y={680} at={P(21) + 0.4} t={t} />
  <Fox x={540} y={G + 60} h={420} pose={{smirk: false, lids: 0.2, flap: 30}} />
</>;
const PuffinPays = ({t}: {t: number}) => <>
  <Puffin x={250} y={G + 40} h={420} flip pose={{look: 0.5, mouth: 0.1}} />
  <Reader x={540} y={G - 60} w={170} t={t} beeps={[P(22) + 0.4, P(22) + 1.0, P(22) + 1.6]} amount="$10" />
  <Fox x={840} y={G + 40} h={430} pose={{smirk: false, lids: 0.3}} />
  {[0, 1, 2].map((i) => { const p = cl((t - P(22) - 0.45 - i * 0.6) / 0.45); return p > 0 && p < 1 ? <Coin key={i} x={lerp(300, 820, p)} y={G - 360 - Math.sin(p * Math.PI) * 200} text="¢" w={80} /> : null; })}
  <PriceTag x={540} y={470} price="a little" fish="every beep" at={P(22) + 0.5} size={0.9} />
</>;
const Smart = ({t}: {t: number}) => <>
  <Puffin x={540} y={G + 120} h={700} pose={{smirk: true, lids: 0.4, look: 0.3}} />
  <BigWord text="!" x={830} y={480} at={P(23) + 0.3} size={220} color="#F7CF3B" />
</>;
const RaisePrice = ({t}: {t: number}) => { const up = t >= P(24) + 0.6;
  return <>
    <Sign x={700} y={G + 30} text="HAIRCUT" w={400} />
    <PriceTag x={720} y={560} price={up ? '$10.25' : '$10'} fish="haircut" at={P(24)} color={up ? RED : GREEN} size={1.1} />
    <Puffin x={280} y={G + 40} h={430} flip pose={{smirk: true, look: 0.5}} />
    {t >= P(25) && <><Penguin id="doug" x={160} y={G + 340} h={260} pose={{brows: 'worried'}} /><BigSeal x={420} y={G + 340} h={280} id="bsq" /><Walrus x={720} y={G + 340} h={240} hat={false} id="wq" /></>}
    {t >= P(25) && <BigWord text="everybody" x={540} y={360} at={P(25)} size={110} />}
  </>; };
const CashToo = ({t}: {t: number}) => <>
  <Penguin id="doug" x={300} y={G + 40} h={460} pose={{turn: 0.5, look: [0.8, -0.2], brows: 'worried', beak: 'frown', flapR: 60}} />
  <Bill x={500} y={G - 200} w={220} rot={-6} />
  <PriceTag x={760} y={600} price="$10.25" fish="cash price too" at={P(26) + 0.1} />
</>;
const Stare = ({marks}: {marks?: boolean}) => <>
  <Penguin id="doug" x={540} y={G + 300} h={950} pose={{lids: 0.35, look: [0, 0], brows: marks ? 'worried' : 'none'}} />
  {marks && <BigWord text="?" x={830} y={420} at={-1} size={220} />}
</>;
const Gift = ({x, y, s = 1}: {x: number; y: number; s?: number}) => <svg width={180 * s} height={180 * s} viewBox="0 0 180 180" style={{position: 'absolute', left: x - 90 * s, top: y - 180 * s, overflow: 'visible'}}>
  <rect x={15} y={60} width={150} height={115} rx={10} fill={RED} stroke={INK} strokeWidth={7} /><rect x={5} y={40} width={170} height={36} rx={8} fill="#E85A4F" stroke={INK} strokeWidth={7} />
  <rect x={78} y={40} width={24} height={135} fill="#F7CF3B" stroke={INK} strokeWidth={5} /><path d="M90 40 Q60 0 50 30 Q60 45 90 40 Q120 0 130 30 Q120 45 90 40" fill="#F7CF3B" stroke={INK} strokeWidth={5} /></svg>;
const Rewards = ({t}: {t: number}) => <>
  <BigSeal x={300} y={G + 40} h={460} flip pose={{look: 0.4, mouth: 0.3}} />
  <Card x={460} y={G - 240} w={180} />
  {t >= P(28) + 0.4 && <PriceTag x={760} y={420} price="+points" at={P(28) + 0.4} color={GREEN} size={0.9} />}
  {t >= P(29) && <Coin x={760} y={760} text="$" w={150} />}
  {t >= P(30) && <Gift x={790} y={G + 40} s={1.2} />}
</>;
const WhoPays = ({t}: {t: number}) => { const p = ease((t - P(32) - 0.5) / 0.9);
  return <>
    <Penguin id="doug" x={230} y={G + 40} h={430} pose={{turn: 0.5, look: [0.8, -0.3], brows: 'worried', flapR: 50}} />
    <Bill x={380} y={G - 230} w={190} rot={-6} />
    <Gift x={850} y={G + 40} s={1.3} />
    {t < P(32) && <BigWord text="?" x={850} y={620} at={P(31) + 0.2} size={180} />}
    {t >= P(32) + 0.5 && p < 1 && <Coin x={lerp(380, 850, p)} y={G - 300 - Math.sin(p * Math.PI) * 220} text="¢" w={90} />}
    {t >= P(32) && <PriceTag x={540} y={480} price="partly" fish="cash people" at={P(32) + 0.2} size={0.9} />}
  </>; };
const Billions = ({t}: {t: number}) => { const n = 2 + Math.floor(10 * ease((t - P(33) - 2.0) / 2.0));
  return <>
    <NameTag x={540} y={360} text="USA · 2025" color={BLUE} />
    <div style={{position: 'absolute', left: 540, top: 560, transform: 'translate(-50%,-50%) rotate(-3deg)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 100, color: RED, whiteSpace: 'nowrap',
      opacity: t >= P(33) + 2.0 ? 1 : 0}}>$198 BILLION</div>
    <div style={{position: 'absolute', left: 540, top: 690, transform: 'translate(-50%,-50%)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, color: INK, whiteSpace: 'nowrap',
      opacity: t >= P(33) + 2.0 ? 1 : 0}}>swipe fees paid by stores</div>
    {Array.from({length: n}, (_, i) => <Bill key={i} x={300 + (i % 4) * 160} y={G - 40 - Math.floor(i / 4) * 70} w={200} rot={((i * 37) % 11) - 5} />)}
    <div style={{position: 'absolute', left: 540, top: 1330, transform: 'translateX(-50%)', fontFamily: HAND, fontSize: 40, color: '#5A6470', whiteSpace: 'nowrap'}}>source: Nilson Report</div>
  </>; };
const FedPaper = ({t}: {t: number}) => <>
  <Paper x={540} y={760} w={520} title="FEDERAL RESERVE" amount="study" at={P(34)} rot={-3} id="fedp" />
  <BigWord text="cash payers help pay" x={540} y={330} at={P(34) + 1.6} size={70} color={RED} />
  <BigWord text="for card rewards" x={540} y={420} at={P(34) + 2.2} size={70} color={RED} />
  <Penguin id="doug" x={170} y={G + 140} h={360} pose={{brows: 'shock', eyeScale: 1.25, look: [0.8, -0.4]}} />
  <div style={{position: 'absolute', left: 540, top: 1330, transform: 'translateX(-50%)', fontFamily: HAND, fontSize: 40, color: '#5A6470', whiteSpace: 'nowrap'}}>source: Boston Fed, 2010</div>
</>;
const NotEvil = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 0, top: 330, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 80, color: BLUE}}>CARD</div>
  <div style={{position: 'absolute', left: 540, top: 330, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 80, color: GREEN}}>CASH</div>
  <div style={{position: 'absolute', left: 535, top: 320, width: 10, height: 1000, background: INK}} />
  <Card x={270} y={720} w={330} />
  <Bill x={810} y={720} w={380} rot={3} />
  <BigWord text="not evil" x={270} y={1020} at={P(35) + 0.3} size={90} />
  <BigWord text="not magic" x={810} y={1020} at={P(36) + 0.3} size={90} />
</>;
const NoFee = ({t}: {t: number}) => <>
  <Puffin x={540} y={G + 80} h={580} pose={{mouth: 0.35, flap: 50}} />
  <Bill x={540} y={520} w={360} rot={-3} />
  <Stamp text="NO FEE" x={540} y={760} at={P(37) + 0.6} color={GREEN} size={110} />
</>;
const SafeFast = ({t}: {t: number}) => <>
  <Penguin id="doug" x={360} y={G + 60} h={520} pose={{beak: 'smile', brows: 'happy', flapR: 70, turn: 0.3}} />
  <Card x={600} y={G - 330} w={220} />
  <div style={{position: 'absolute', left: 700, top: 430}}><Shield /></div>
  <BigWord text="fast!" x={820} y={780} at={P(38) + 1.0} size={110} color={BLUE} />
</>;
const Choice = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 60, top: 380, width: 440, padding: 24, border: `7px solid ${INK}`, borderRadius: 26, background: '#EAF7EC', textAlign: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, lineHeight: 1.15, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>CASH<CashIcon w={220} /></div>
  {t >= P(39) + 0.4 && <div style={{position: 'absolute', left: 580, top: 380, width: 440, padding: 24, border: `7px solid ${INK}`, borderRadius: 26, background: '#E8EEF9', textAlign: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, lineHeight: 1.15, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>CARD<CardIcon w={220} /></div>}
  <Penguin id="doug" x={540} y={G + 140} h={560} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.2, 0.6], brows: 'happy'}} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx; ice?: boolean};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <HookV2 t={t} />},
  {at: P(3), set: (t) => <NotPuffin t={t} />, fx_: 'zoom', ice: true},
  {at: P(4), set: (t) => <Intro t={t} />, fx_: 'pop', ice: true},
  {at: P(6), set: (t) => <NeedCut t={t} />, fx_: 'swipe', ice: true},
  {at: P(7), set: (t) => <Cut t={t} />, fx_: 'pop', ice: true},
  {at: P(8), set: (t) => <PayCash t={t} />, fx_: 'swipeL', ice: true},
  {at: P(10), set: (t) => <PuffinKeeps t={t} />, fx_: 'zoom', ice: true},
  {at: P(11), set: (t) => <PayCard t={t} />, fx_: 'swipe', ice: true},
  {at: P(13), set: (t) => <NineSeventySix t={t} />, fx_: 'zoom', ice: true},
  {at: P(14), set: (t) => <Fee t={t} />, fx_: 'pop'},
  {at: P(15), set: (t) => <WhereFee t={t} />, fx_: 'swipe', ice: true},
  {at: P(16), set: (t) => <FoxIntro t={t} />, fx_: 'iris'},
  {at: P(17), set: (t) => <Lazy t={t} />, fx_: 'zoom', ice: true},
  {at: P(19), set: (t) => <Services t={t} />, fx_: 'pop', ice: true},
  {at: P(22), set: (t) => <PuffinPays t={t} />, fx_: 'swipe', ice: true},
  {at: P(23), set: (t) => <Smart t={t} />, fx_: 'zoom', ice: true},
  {at: P(24), set: (t) => <RaisePrice t={t} />, fx_: 'swipeL', ice: true},
  {at: P(26), set: (t) => <CashToo t={t} />, fx_: 'pop', ice: true},
  {at: P(27), set: () => <Stare />, fx_: 'zoom'},
  {at: P(28), set: (t) => <Rewards t={t} />, fx_: 'swipe', ice: true},
  {at: P(31), set: (t) => <WhoPays t={t} />, fx_: 'swipeL', ice: true},
  {at: P(33), set: (t) => <Billions t={t} />, fx_: 'iris', ice: true},
  {at: P(34), set: (t) => <FedPaper t={t} />, fx_: 'swipe', ice: true},
  {at: P(35), set: (t) => <NotEvil t={t} />, fx_: 'pop', ice: true},
  {at: P(37), set: (t) => <NoFee t={t} />, fx_: 'swipe', ice: true},
  {at: P(38), set: (t) => <SafeFast t={t} />, fx_: 'swipeL', ice: true},
  {at: P(39), set: (t) => <Choice t={t} />, fx_: 'pop', ice: true},
];
// deep zooms [phrase, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [
  [5, 540, 820, 1.45], [13, 540, G - 380, 1.3], [26, 460, G - 280, 1.25], [32, 540, G - 280, 1.15],
];
const BIGS: {text: string; at: number; until: number; x?: number; y?: number; color?: string; size: number}[] = [
  {text: 'BEEP!', at: P(12), until: P(13), y: 520, color: RED, size: 200},
];
const QUIET: [number, number][] = [];

export const DougCashCard = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { const c = hookCam(tc); s0 = c.s; fx = c.x; fy = c.y; }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, TIM);
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  const shk = (a: number) => tc > a && tc < a + 0.25 ? Math.sin(tc * 90) * 8 * (1 - (tc - a) / 0.25) : 0;
  const shake = shk(P(18)) + shk(P(33) + 2.0);
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
    <Sfx at={SHOCK} name="card-beep" vol={0.4} />
    <Sfx at={TEN[2]} name="user-ting" vol={0.4} />
    <Sfx at={P(3)} name="user-boom" vol={0.4} />
    {/* cash */}
    <Sfx at={P(4)} name="penguin-honk" vol={0.3} />
    <Sfx at={P(5) + 0.1} name="user-ting" vol={0.4} />
    <Sfx at={P(6) + 0.3} name="user-aww" vol={0.3} />
    {[0, 0.25, 0.5].map((d) => <Sfx key={d} at={P(7) + 0.2 + d} name="pop-high" vol={0.3} />)}
    <Sfx at={TEN[3]} name="user-money" vol={0.35} />
    <Sfx at={P(9)} name="user-cash-register" vol={0.4} />
    <Sfx at={TEN[4] + 0.2} name="user-yeah" vol={0.35} />
    {/* card */}
    <Sfx at={P(11)} name="user-notif" vol={0.3} />
    <Sfx at={P(12)} name="card-beep" vol={0.45} />
    <Sfx at={P(13) + 0.3} name="user-cash-register" vol={0.35} />
    <Sfx at={P(14) + 1.0} name="user-slap" vol={0.4} />
    <Sfx at={P(15) + 0.3} name="user-money-transfer" vol={0.3} />
    <Sfx at={P(16)} name="fox-snicker" vol={0.35} />
    <Sfx at={P(18)} name="user-wrong" vol={0.4} />
    <Sfx at={P(19) + 0.3} name="user-ting" vol={0.35} />
    <Sfx at={P(20) + 0.4} name="user-ting" vol={0.35} />
    <Sfx at={P(21) + 0.4} name="user-ting" vol={0.35} />
    {[0.4, 1.0, 1.6].map((d) => <Sfx key={`pb${d}`} at={P(22) + d} name="card-beep" vol={0.3} />)}
    <Sfx at={P(23) + 0.3} name="user-pop" vol={0.4} />
    <Sfx at={P(24) + 0.6} name="user-cash-register" vol={0.4} />
    <Sfx at={P(25)} name="user-boom" vol={0.35} />
    <Sfx at={P(26) + 0.1} name="user-wrong" vol={0.35} />
    <Sfx at={P(27)} name="user-fahh" vol={0.4} />
    <Sfx at={P(28) + 0.4} name="user-wow" vol={0.35} />
    <Sfx at={P(29)} name="user-money" vol={0.3} />
    <Sfx at={P(30)} name="user-pop" vol={0.35} />
    <Sfx at={P(32) + 0.5} name="user-money-transfer" vol={0.3} />
    {/* real life */}
    <Sfx at={P(33) + 2.0} name="user-boom" vol={0.45} />
    <Sfx at={P(33) + 2.1} name="user-cash-register" vol={0.35} />
    <Sfx at={P(34) + 1.6} name="user-shock" vol={0.35} />
    <Sfx at={P(35) + 0.3} name="user-ting" vol={0.35} />
    <Sfx at={P(36) + 0.3} name="user-ting" vol={0.35} />
    <Sfx at={P(37) + 0.6} name="user-yeah" vol={0.35} />
    <Sfx at={P(38) + 1.0} name="swoosh-fast" vol={0.35} />
    <Sfx at={P(39)} name="user-pop" vol={0.35} />
    <Sfx at={P(39) + 0.4} name="user-pop" vol={0.35} />
    <Sfx at={P(41)} name="user-ting" vol={0.35} />
  </AbsoluteFill>;
};
