// EP7 "Mortgage Explained by Doug" — one American house: price $400,000, Doug pays ~$1,000,000 ($997K, 30 yr at 7.4%). Hook first (approval), full episode after.
// Line timings: studio/src/data/doug-mortgage.json (edge-tts en-US-AndrewNeural, one take, pauses tightened to 0.07 s + atempo 1.05).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Seagull, Walrus} from '../penguin/cast';
import {BigWord, FishPile, IceBank, Igloo, PriceTag, Stamp, Thought, Title} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {Bill, Bubble, Fox, Sparkles} from './dougLaundering';
import TIM from '../data/doug-mortgage.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_MORTGAGE_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 1.2) * 30) / 30;
const G = 1290;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
// word times in the hook (vo/raw.words.json)
const MILLION = 0.97, FOUR = 1.84, SAME = P(1);

// ---------- hook props (versus layout from dougVenezuela) ----------
const Why = ({t}: {t: number}) => {
  const p = ease(t / 0.25);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 170, height: 330, transform: `scale(${0.6 + 0.4 * p})`, opacity: p, transformOrigin: '50% 60%'}}>
    <div style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 290, lineHeight: '300px', color: INK, letterSpacing: -6}}>
      why<span style={{color: RED}}>?</span>
    </div>
  </div>;
};
// Red hand-drawn arrow under the price boards: draws itself on, points up at DOUG PAYS (left), swings to HOUSE PRICE (right) on "four hundred thousand".
const Arrow = ({x, y, t, swingAt}: {x: number; y: number; t: number; swingAt: number}) => {
  const draw = ease((t - 0.15) / 0.4), sw = t < swingAt ? 0 : cl((t - swingAt) / 0.35);
  const over = sw < 1 ? Math.sin(sw * Math.PI) * 12 : 0;
  const ang = -150 + (-30 + 150) * ease(sw) + over;
  return <svg width={10} height={10} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <g transform={`rotate(${ang})`}>
      <path d="M0 0 Q 85 -34, 170 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />
      {draw > 0.9 && <path d="M170 0 L128 -26 M170 0 L130 30" fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />}
    </g>
  </svg>;
};
const Label = ({text, x, y, at, t, size = 80, color = INK}: {text: string; x: number; y: number; at: number; t: number; size?: number; color?: string}) => {
  const p = ease((t - at) / 0.25);
  return <div style={{position: 'absolute', left: x - 270, width: 540, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, color, opacity: p, transform: `scale(${0.5 + 0.5 * p})`, whiteSpace: 'nowrap'}}>{text}</div>;
};
const Vs = ({x, y, t}: {x: number; y: number; t: number}) => {
  const p = ease((t - 0.2) / 0.25);
  return <div style={{position: 'absolute', left: x - 62, top: y - 62, width: 124, height: 124, borderRadius: '50%', background: RED, border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60, color: '#fff', transform: `scale(${p}) rotate(${-8 + Math.sin(t * 4) * 3}deg)`}}>VS</div>;
};
// US flag (13 stripes + blue canton with stars). (x, y) = top-left, waves a little.
export const FlagUS = ({x, y, w = 180, t = 0}: {x: number; y: number; w?: number; t?: number}) =>
  <svg width={w} height={w * 0.53} viewBox="0 0 190 100" style={{position: 'absolute', left: x, top: y, overflow: 'visible', transform: `skewY(${Math.sin(t * 5) * 3}deg)`, transformOrigin: '0 50%'}}>
    {Array.from({length: 13}, (_, i) => <rect key={i} x={0} y={i * 100 / 13} width={190} height={100 / 13 + 0.5} fill={i % 2 ? '#fff' : '#C8102E'} />)}
    <rect x={0} y={0} width={76} height={54} fill="#0A3161" />
    {Array.from({length: 20}, (_, i) => <circle key={i} cx={9 + (i % 5) * 14.5 + (Math.floor(i / 5) % 2) * 7} cy={8 + Math.floor(i / 5) * 12.5} r={2.6} fill="#fff" />)}
    <rect x={0} y={0} width={190} height={100} fill="none" stroke={INK} strokeWidth={5} />
  </svg>;
// Two-storey American house: white siding, grey roof, shutters, porch, garage, flag pole. (x, y) = bottom centre.
export const House = ({x, y, w = 700, t = 0}: {x: number; y: number; w?: number; t?: number}) => {
  const k = w / 600;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - 430 * k, width: w, height: 430 * k}}>
    <svg width={w} height={430 * k} viewBox="0 0 600 430" style={{position: 'absolute', overflow: 'visible'}}>
      <rect x={320} y={40} width={34} height={80} fill="#A5452F" stroke={INK} strokeWidth={6} />
      {/* main block */}
      <rect x={50} y={125} width={340} height={305} fill="#F7F5EE" stroke={INK} strokeWidth={7} />
      {Array.from({length: 14}, (_, i) => <line key={i} x1={54} x2={386} y1={145 + i * 20} y2={145 + i * 20} stroke="#D9D5C8" strokeWidth={3} />)}
      <path d="M28 135 L220 22 L412 135 Z" fill="#4A4F57" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      {/* garage */}
      <rect x={390} y={255} width={185} height={175} fill="#F7F5EE" stroke={INK} strokeWidth={7} />
      <path d="M380 262 L482 200 L585 262 Z" fill="#4A4F57" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <rect x={412} y={300} width={140} height={130} fill="#E9E6DC" stroke={INK} strokeWidth={6} />
      {[0, 1, 2].map((i) => <line key={i} x1={412} x2={552} y1={332 + i * 32} y2={332 + i * 32} stroke={INK} strokeWidth={4} />)}
      {/* upstairs windows with shutters */}
      {[80, 190, 300].map((wx) => <g key={wx}>
        <rect x={wx - 14} y={158} width={12} height={66} fill="#2F4F3A" stroke={INK} strokeWidth={4} />
        <rect x={wx + 52} y={158} width={12} height={66} fill="#2F4F3A" stroke={INK} strokeWidth={4} />
        <rect x={wx} y={158} width={50} height={66} fill="#BFE6FA" stroke={INK} strokeWidth={5} />
        <path d={`M${wx + 25} 158 V224 M${wx} 191 H${wx + 50}`} stroke={INK} strokeWidth={3} />
      </g>)}
      {/* downstairs windows */}
      {[80, 300].map((wx) => <g key={wx}>
        <rect x={wx - 14} y={318} width={12} height={66} fill="#2F4F3A" stroke={INK} strokeWidth={4} />
        <rect x={wx + 52} y={318} width={12} height={66} fill="#2F4F3A" stroke={INK} strokeWidth={4} />
        <rect x={wx} y={318} width={50} height={66} fill="#BFE6FA" stroke={INK} strokeWidth={5} />
        <path d={`M${wx + 25} 318 V384 M${wx} 351 H${wx + 50}`} stroke={INK} strokeWidth={3} />
      </g>)}
      {/* porch + red front door */}
      <rect x={160} y={300} width={120} height={14} fill="#fff" stroke={INK} strokeWidth={5} />
      <path d="M150 305 L220 268 L290 305 Z" fill="#4A4F57" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {[168, 264].map((cx) => <rect key={cx} x={cx} y={314} width={10} height={116} fill="#fff" stroke={INK} strokeWidth={4} />)}
      <rect x={196} y={326} width={50} height={104} rx={4} fill="#9B2B2B" stroke={INK} strokeWidth={5} />
      <circle cx={236} cy={380} r={4} fill="#F2C94C" />
      {/* flag pole */}
      <rect x={-2} y={110} width={8} height={320} fill="#9AA3AB" stroke={INK} strokeWidth={3} />
      <circle cx={2} cy={106} r={8} fill="#F2C94C" stroke={INK} strokeWidth={3} />
    </svg>
    <FlagUS x={6 * k} y={118 * k} w={130 * k} t={t} />
  </div>;
};
const Ground = () => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 800, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />;
// Price board: label + big price, coloured frame.
const Tag = ({x, y, label, price, color, at, t}: {x: number; y: number; label: string; price: string; color: string; at: number; t: number}) => {
  const p = ease((t - at) / 0.25);
  return <div style={{position: 'absolute', left: x - 225, top: y, width: 450, height: 210, background: '#fff', border: `9px solid ${color}`, borderRadius: 26, boxSizing: 'border-box', opacity: p, transform: `scale(${0.5 + 0.5 * p}) rotate(${x < 540 ? -3 : 3}deg)`, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900}}>
    <div style={{fontSize: 48, color: INK, marginTop: 16}}>{label}</div>
    <div style={{fontSize: 74, color, lineHeight: '110px', letterSpacing: -3}}>{price}</div>
  </div>;
};

// ---------- sets ----------
const LX = 255, RX = 825;
// Only what explains the topic in the first second: why? + two prices + VS + one American house + Doug.
// Doug acts: walks in, PAYS (bills fly to the red board) on "one million", jaw-drops at the green price, sad on "Same house".
const DX = 430, DY = G + 140, PAY0 = 0.85, PAY1 = 2.0;
const PayDoug = ({t}: {t: number}) => {
  const walkP = ease(t / 0.8), x = 150 + (DX - 150) * walkP;
  const paying = t >= PAY0 && t < FOUR, shocked = t >= FOUR && t < SAME, sad = t >= SAME;
  const throwA = paying ? 95 + Math.sin((t - PAY0) * 14) * 35 : 6;
  const pose = t < PAY0 ? {walk: t < 0.8 ? t * 2.4 : null, look: [0.3, -0.6] as [number, number], beak: 'smile' as const, brows: 'happy' as const}
    : paying ? {flapL: throwA, flapR: throwA, look: [-0.6, -0.8] as [number, number], brows: 'worried' as const, beak: 'frown' as const, sweat: true, tremble: 0.3}
    : shocked ? {turn: 1, look: [0.9, -0.9] as [number, number], eyeScale: 1.5, mouth: 0.8, brows: 'shock' as const, tremble: 0.6, flapL: 40, flapR: 40, hop: t < FOUR + 0.3 ? Math.sin((t - FOUR) / 0.3 * Math.PI) * 50 : 0}
    : {look: [0, 0.2] as [number, number], brows: 'worried' as const, beak: 'frown' as const, tears: true, squash: 0.25, flapL: 0, flapR: 0};
  return <Penguin id="doug" x={x} y={DY} h={360} pose={pose} />;
};
// Bills fly in an arc from Doug's flippers to the red DOUG PAYS board.
const PayStream = ({t}: {t: number}) => <>
  {Array.from({length: 9}, (_, i) => {
    const a = PAY0 + i * 0.13, p = (t - a) / 0.45;
    if (p < 0 || p > 1) return null;
    const x = DX + (LX - DX) * p, y = DY - 230 + (640 - (DY - 230)) * p - Math.sin(p * Math.PI) * 220;
    return <Bill key={i} x={x} y={y} w={130 * (1 - 0.35 * p)} rot={p * 360 + i * 40} />;
  })}
</>;
const Hook = ({t}: {t: number}) => <>
  <Why t={t} />
  <Ground />
  <House x={540} y={G} w={720} t={t} />
  <Tag x={LX} y={470} label="DOUG PAYS" price="$1,000,000" color={RED} at={0.05} t={t} />
  <Tag x={RX} y={470} label="HOUSE PRICE" price="$400,000" color={GREEN} at={0.15} t={t} />
  <Vs x={540} y={575} t={t} />
  <Arrow x={540} y={760} t={t} swingAt={FOUR} />
  <PayDoug t={t} />
  <PayStream t={t} />
</>;

// ---------- episode sets (ground at S) ----------
const S = 1200;
const Snow = ({grey}: {grey?: boolean}) => <>
  {grey && <div style={{position: 'absolute', inset: -400, background: '#E9EDF0'}} />}
  <div style={{position: 'absolute', left: -400, right: -400, top: S, height: 900, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
</>;
// Fish coin = 1 payment. Flies from (x1,y1) to (x2,y2), one every `gap` s from `a` until `b`.
const FishRain = ({x1, y1, x2, y2, t, a, b, gap = 0.18, w = 90, arc = 260}: {x1: number; y1: number; x2: number; y2: number; t: number; a: number; b: number; gap?: number; w?: number; arc?: number}) => <>
  {Array.from({length: Math.max(0, Math.floor((Math.min(t, b) - a) / gap) + 1)}, (_, i) => {
    const p = (t - a - i * gap) / 0.5; if (p < 0 || p > 1) return null;
    return <div key={i} style={{position: 'absolute', left: 0, top: 0}}><FishPile x={lerp(x1, x2, p)} y={lerp(y1, y2, p) - Math.sin(p * Math.PI) * arc} n={1} w={w} seed={i} /></div>;
  })}
</>;
const Calendar = ({x, y, t, a, label, w = 300, speed = 6}: {x: number; y: number; t: number; a: number; label: (n: number) => string; w?: number; speed?: number}) => {
  const n = Math.max(0, Math.floor((t - a) * speed)), flip = ((t - a) * speed) % 1;
  return <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: w * 0.95, background: '#fff', border: `7px solid ${INK}`, borderRadius: 18, boxSizing: 'border-box', overflow: 'hidden'}}>
    <div style={{height: w * 0.25, background: RED, borderBottom: `6px solid ${INK}`}} />
    <div style={{textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.26, lineHeight: `${w * 0.6}px`, color: INK, transform: `rotateX(${flip < 0.25 ? 70 * (1 - flip * 4) : 0}deg)`}}>{label(n)}</div>
  </div>;
};
const Bar = ({x, y, w, h, color, at, t, text}: {x: number; y: number; w: number; h: number; color: string; at: number; t: number; text: string}) => {
  const p = ease((t - at) / 0.4);
  return <div style={{position: 'absolute', left: x, top: y + h * (1 - p), width: w, height: h * p, background: color, border: `7px solid ${INK}`, boxSizing: 'border-box', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: '#fff', overflow: 'hidden', whiteSpace: 'nowrap'}}>{p > 0.6 && text}</div>;
};

const Intro = ({t}: {t: number}) => {
  const want = t >= P(3);
  return <>
    <Snow />
    <Penguin id="doug" x={want ? 330 : 540} y={S + 60} h={want ? 520 : 640} pose={want ? {turn: 0.5, look: [0.7, -0.7], beak: 'smile', brows: 'happy', blush: 1} : {beak: 'smile', brows: 'happy', flapR: 70 + Math.sin(t * 9) * 25}} />
    <BigWord text="Doug" x={540} y={420} at={P(2)} until={P(3)} size={180} />
    {want && <Thought x={760} y={520} w={480} tx={480} ty={820} at={P(3)}>
      <Igloo x={t >= P(5) ? 190 : 240} y={270} w={t >= P(4) ? 330 + 60 * ease((t - P(4)) / 0.3) : 300} />
      {t >= P(5) && <div style={{position: 'absolute', left: 330, top: 270 - 110 * ease((t - P(5)) / 0.25), width: 120, height: 110 * ease((t - P(5)) / 0.25), background: '#DDF2FB', border: `5px solid ${INK}`, boxSizing: 'border-box', overflow: 'hidden'}}>
        {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 14, right: 14, top: 22 + i * 26, height: 0, borderTop: `4px solid ${INK}`}} />)}
      </div>}
    </Thought>}
    {want && <BigWord text="igloo" x={760} y={330} at={P(3) + 0.2} until={P(4)} size={120} />}
    {t >= P(4) && <BigWord text="BIG igloo" x={760} y={330} at={P(4)} until={P(5)} size={110} />}
    {t >= P(5) && <BigWord text="+ garage" x={760} y={330} at={P(5)} size={110} color={GREEN} />}
  </>;
};
const Cost = ({t}: {t: number}) => {
  const zero = t >= P(8);
  return <>
    <Snow grey={zero} />
    <Igloo x={zero ? 760 : 540} y={S} w={zero ? 460 : 640} />
    <PriceTag x={zero ? 760 : 540} y={zero ? 700 : 560} price="$400,000" fish={`${(40000).toLocaleString('en-US')} fish`} at={P(6) + 0.6} size={zero ? 0.9 : 1.3} rot={-5} />
    {t >= P(7) && !zero && <><FishPile x={540} y={S + 250} n={Math.min(14, 2 + Math.floor((t - P(7)) * 10))} w={150} /><BigWord text="40,000 fish" x={540} y={300} at={P(7)} size={130} color={RED} /></>}
    {zero && <>
      <Penguin id="doug" x={300} y={S + 40} h={480} pose={{look: [0.8, -0.3], brows: 'worried', beak: 'frown', flapL: 70, flapR: 70, eyeScale: 1.2}} />
      <BigWord text="$0" x={300} y={480} at={P(8)} size={220} color={RED} />
    </>}
  </>;
};
const Bank = ({t}: {t: number}) => {
  const walk = ease((t - P(9)) / 0.8), lend = t >= P(10);
  return <>
    <Snow />
    <IceBank x={540} y={S} w={980} />
    <div style={{position: 'absolute', left: 520, top: S - 220, width: 520, height: 220, background: '#C8924E', border: `7px solid ${INK}`, boxSizing: 'border-box'}} />
    <Fox x={790} y={S - 120} h={520} mouth={lend ? 0.3 : 0} />
    <Penguin id="doug" x={-100 + 400 * walk} y={S} h={440} pose={lend ? {look: [0.8, -0.3], beak: 'smile', brows: 'happy', flapL: 100, flapR: 100, hop: Math.max(0, Math.sin((t - P(10) - 0.6) * 9)) * 30} : {walk: walk < 1 ? t : null, turn: 0.6, look: [0.8, 0], beak: 'smile'}} />
    {lend && <FishRain x1={760} y1={S - 420} x2={300} y2={S - 260} t={t} a={P(10) + 0.2} b={E(10)} gap={0.12} />}
    {lend && <BigWord text="$400,000" x={540} y={300} at={P(10) + 0.3} size={120} color={GREEN} />}
  </>;
};
const Back = ({t}: {t: number}) => {
  const interest = t >= P(12);
  return <>
    <Snow />
    <Fox x={interest ? 540 : 760} y={S} h={interest ? 760 : 600} mouth={0.3 + 0.2 * Math.sin(t * 18)} sly={1} />
    {!interest && <>
      <Penguin id="doug" x={290} y={S} h={420} pose={{look: [0.8, -0.4], brows: 'worried', beak: 'frown'}} />
      <Bubble text="give back" x={700} y={330} at={P(11) + 0.1} t={t} w={460} tailX={60} size={70} />
    </>}
    {interest && <><BigWord text="INTEREST" x={540} y={330} at={P(12)} size={160} color={RED} /><FishPile x={860} y={S} n={7} w={140} /></>}
  </>;
};
const Rate = ({t}: {t: number}) => {
  const n = 6 - Math.min(5, Math.floor(cl((t - P(15) - 1.2) / 1.4) * 6));
  return <>
    <Snow />
    <Fox x={830} y={S} h={520} mouth={0.2} />
    <Penguin id="doug" x={260} y={S} h={440} pose={{look: [0.8, -0.2], brows: 'worried', beak: 'frown', sweat: true}} />
    <FishPile x={260} y={S - 470} n={n} w={110} />
    <FishRain x1={260} y1={S - 520} x2={820} y2={S - 420} t={t} a={P(15) + 1.2} b={E(15)} gap={0.25} />
    <BigWord text="7.4%" x={540} y={470} at={P(15) + 1.0} size={240} color={RED} />
    <BigWord text="every year" x={540} y={250} at={P(15)} size={100} />
  </>;
};
const Monthly = ({t}: {t: number}) => {
  const years = t >= P(17);
  return <>
    <Snow />
    <Calendar x={years ? 540 : 300} y={360} t={t} a={P(16)} w={years ? 420 : 320} speed={years ? 12 : 4} label={(n) => years ? `${Math.min(30, 1 + Math.floor(n / 1.4))} yr` : ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'][n % 7]} />
    {!years && <><Fox x={850} y={S} h={460} mouth={0.2} /><Penguin id="doug" x={330} y={S} h={420} pose={{turn: 0.5, look: [0.8, 0], brows: 'worried', beak: 'frown', flapR: 90 + Math.sin(t * 10) * 30}} />
      <FishRain x1={360} y1={S - 300} x2={820} y2={S - 330} t={t} a={P(16) + 0.2} b={E(16) + 0.4} gap={0.25} /></>}
    {t >= P(18) && <BigWord text="360 payments" x={540} y={260} at={P(18)} size={110} />}
    {t >= P(18) && <FishRain x1={140} y1={S + 100} x2={940} y2={S - 100} t={t} a={P(18)} b={E(18) + 0.3} gap={0.08} w={70} arc={420} />}
    {years && <><BigWord text="30 YEARS" x={540} y={950} at={P(17)} size={170} color={RED} /><Penguin id="doug" x={540} y={S + 330} h={360} pose={{lids: 0.4, brows: 'worried', beak: 'frown', tears: true}} /></>}
  </>;
};
const Split = ({t}: {t: number}) => {
  const fox = t >= P(20), igloo = t >= P(21);
  return <>
    <Snow />
    <BigWord text="1st payment" x={540} y={280} at={P(19)} size={110} />
    <Fox x={800} y={S} h={520} mouth={fox ? 0.4 : 0} />
    <Igloo x={250} y={S} w={340} />
    <Penguin id="doug" x={520} y={S + 40} h={340} pose={{look: [igloo ? -0.8 : 0.8, -0.3], brows: 'worried', beak: 'frown'}} />
    {fox && <><FishRain x1={520} y1={S - 260} x2={800} y2={S - 400} t={t} a={P(20)} b={E(20)} gap={0.14} /><BigWord text="$2,467" x={800} y={480} at={P(20) + 0.4} size={120} color={RED} /><BigWord text="Fox" x={800} y={620} at={P(20) + 0.4} size={80} /></>}
    {igloo && <><FishRain x1={520} y1={S - 260} x2={250} y2={S - 240} t={t} a={P(21) + 0.4} b={P(21) + 0.4} /><BigWord text="$303" x={250} y={560} at={P(21) + 0.4} size={90} color={GREEN} /><BigWord text="igloo" x={250} y={680} at={P(21) + 0.4} size={70} /></>}
  </>;
};
const Called = ({t}: {t: number}) => t < P(24) ? <Title lines={['MORTGAGE']} y={880} at={P(23) + 0.4} size={180} /> : <>
  <BigWord text="old French" x={540} y={330} at={P(24)} size={100} />
  <BigWord text="MORT" x={330} y={620} at={P(24) + 0.9} size={170} color={RED} rot={-4} />
  <BigWord text="GAGE" x={760} y={620} at={P(24) + 1.2} size={170} color={INK} rot={3} />
  <BigWord text="💀 death" x={330} y={860} at={P(24) + 1.6} size={100} color={RED} />
  <BigWord text="🤝 pledge" x={760} y={860} at={P(24) + 2.1} size={100} />
  <Penguin id="doug" x={540} y={S + 200} h={360} pose={{eyeScale: 1.4, brows: 'shock', beak: 'frown', tremble: 0.6}} />
</>;
const Poor = ({t}: {t: number}) => <>
  <Snow grey />
  <Penguin id="doug" x={540} y={S + 300} h={950} pose={{lids: 0.35, brows: 'worried', beak: 'frown', tears: true}} />
  <BigWord text="Doug poor." x={540} y={340} at={P(25)} size={140} color={RED} />
</>;
const RealLife = ({t}: {t: number}) => <>
  <BigWord text="real life" x={540} y={330} at={P(26)} size={120} />
  <FlagUS x={400} y={440} w={280} t={t} />
  <BigWord text="7.4%" x={540} y={760} at={P(26) + 1.1} size={150} color={RED} />
  <BigWord text="$2,770" x={540} y={990} at={P(26) + 2.6} size={200} color={RED} rot={0} />
  <BigWord text="every month" x={540} y={1180} at={P(26) + 4.6} size={100} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 34, color: '#888'}}>$400,000 loan · 30-year fixed · 7.4%</div>
</>;
const Total = ({t}: {t: number}) => {
  const x0 = 250, w = 580, H = 700, top = 380, k = H / 997;
  return <>
    <BigWord text="30 years later" x={540} y={260} at={P(27)} until={P(28)} size={110} />
    {t >= P(28) && <BigWord text="$997,000" x={540} y={260} at={P(28)} size={150} color={RED} rot={0} />}
    <Bar x={x0} y={top + 597 * k} w={w} h={400 * k} color={GREEN} at={P(28)} t={t} text="HOUSE $400K" />
    <Bar x={x0} y={top} w={w} h={597 * k} color={RED} at={P(29)} t={t} text="INTEREST $597K" />
    {t >= P(29) && <Fox x={930} y={top + 520} h={300} mouth={0.4} />}
    <div style={{position: 'absolute', left: -400, right: -400, top: top + H, height: 900, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
  </>;
};
const PaidOff = ({t}: {t: number}) => {
  const old = t >= P(33), own = t >= P(34), good = t >= P(35);
  return <>
    <Snow />
    <Igloo x={720} y={S} w={560} />
    {!own && <Fox x={980} y={S} h={420} mouth={0.2} />}
    <Penguin id="doug" x={old ? 360 : 330} y={S + 30} h={460} pose={old ? {lids: 0.5, lean: -8, brows: good ? 'happy' : 'worried', beak: good ? 'smile' : 'flat', squash: 0.2} : {flapR: 100, look: [0.8, -0.2], beak: 'smile'}} />
    {old && <><div style={{position: 'absolute', left: 430, top: S - 300, width: 14, height: 300, background: '#8B5A2B', border: `4px solid ${INK}`, transform: 'rotate(8deg)'}} />
      <BigWord text="80 years old" x={360} y={480} at={P(33)} until={P(34)} size={90} /></>}
    {!old && <><FishRain x1={360} y1={S - 300} x2={960} y2={S - 300} t={t} a={P(32) + 0.2} b={P(32) + 0.2} /><BigWord text="last payment" x={540} y={420} at={P(32)} size={110} /></>}
    {own && <Stamp text="PAID OFF" x={720} y={S - 450} at={P(34)} color={GREEN} size={110} />}
    {good && <><BigWord text="life is good" x={540} y={400} at={P(35)} size={120} color={GREEN} /><Sparkles x={720} y={620} t={t} /></>}
  </>;
};
const Tax = ({t}: {t: number}) => {
  const land = ease((t - P(36)) / 0.6), tax = t >= P(37), year = t >= P(38), ever = t >= P(39);
  return <>
    <Snow />
    <Igloo x={420} y={S} w={460} />
    <Penguin id="doug" x={250} y={S + 60} h={380} pose={{lids: 0.5, brows: tax ? 'worried' : 'happy', beak: tax ? 'frown' : 'smile', eyeScale: tax ? 1.2 : 1}} />
    <Seagull x={lerp(1200, 830, land)} y={lerp(250, S, land)} h={420} pose={{fly: land < 1, mouth: tax ? 0.4 : 0, holding: tax}} />
    {!tax && <BigWord text="Tax Gull" x={760} y={420} at={P(36) + 0.4} size={120} color={RED} />}
    {tax && !year && <Bubble text="property tax" x={760} y={420} at={P(37)} t={t} w={500} tailX={60} size={66} />}
    {year && <Calendar x={760} y={330} t={t} a={P(38)} w={300} speed={8} label={(n) => `${2056 + n}`} />}
    {year && <FishRain x1={250} y1={S - 280} x2={830} y2={S - 260} t={t} a={P(38)} b={E(39) + 0.3} gap={0.2} />}
    {ever && <BigWord text="∞ forever" x={540} y={760} at={P(39)} size={140} color={RED} />}
  </>;
};
const Owns = ({t}: {t: number}) => {
  const flip = t >= P(41);
  return <>
    <Snow grey={flip} />
    <Igloo x={flip ? 540 : 700} y={S} w={flip ? 820 : 480} />
    {flip && <><div style={{position: 'absolute', left: 430, top: S - 360, width: 60, height: 60, borderRadius: '50%', background: '#fff', border: `6px solid ${INK}`}}><div style={{margin: 14, width: 20, height: 20, borderRadius: '50%', background: INK}} /></div>
      <div style={{position: 'absolute', left: 590, top: S - 360, width: 60, height: 60, borderRadius: '50%', background: '#fff', border: `6px solid ${INK}`}}><div style={{margin: 14, width: 20, height: 20, borderRadius: '50%', background: INK}} /></div></>}
    <Penguin id="doug" x={flip ? 540 : 300} y={flip ? S + 250 : S} h={flip ? 260 : 460} pose={flip ? {brows: 'worried', beak: 'frown', tears: true, tremble: 0.5} : {beak: 'smile', brows: 'happy', flapR: 110, lids: 0.3}} />
    {!flip && <BigWord text="Doug own igloo" x={540} y={420} at={P(40)} size={110} color={GREEN} />}
    {flip && <BigWord text="igloo own Doug" x={540} y={420} at={P(41)} size={110} color={RED} />}
  </>;
};
const Cta = ({t}: {t: number}) => <>
  <Snow />
  {['RENT', 'BUY'].map((s, i) => { const p = ease((t - P(42) - 0.3 - i * 0.4) / 0.25);
    return <div key={s} style={{position: 'absolute', left: 120 + i * 470, top: 520, width: 380, height: 220, background: '#fff', border: `9px solid ${i ? RED : GREEN}`, borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 110, color: i ? RED : GREEN, transform: `scale(${p}) rotate(${i ? 3 : -3}deg)`}}>{s}</div>; })}
  <BigWord text="or" x={540} y={630} at={P(42) + 0.6} size={90} />
  <BigWord text="at 7.4%?" x={540} y={360} at={P(42) + 1.4} size={110} color={RED} />
  <Penguin id="doug" x={540} y={S + 60} h={460} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0, 0.6]}} />
  <BigWord text="👇" x={800} y={1000} at={P(43)} size={160} />
</>;

const RentMoney = ({t}: {t: number}) => {
  const doug = t >= P(14);
  return <>
    <Snow />
    <BigWord text="INTEREST" x={540} y={260} at={P(13)} size={130} color={RED} />
    <BigWord text="= rent for money" x={540} y={420} at={P(13) + 0.5} size={95} />
    <Fox x={doug ? 820 : 600} y={S} h={doug ? 480 : 600} mouth={0.3} />
    {!doug && <FishPile x={300} y={S} n={6} w={150} />}
    {doug && <>
      <Penguin id="doug" x={330} y={S} h={480} pose={{holding: true, flapR: 70, look: [0.6, -0.3], beak: 'smile', brows: 'worried'}} />
      <Stamp text="RENTED" x={330} y={650} at={P(14) + 0.3} color={RED} size={100} />
      <FishPile x={460} y={S} n={4} w={110} />
    </>}
  </>;
};
const Owe = ({t}: {t: number}) => {
  const p = ease((t - P(22) - 1.2) / 0.6), own = 13;
  return <>
    <Snow />
    <Calendar x={540} y={190} t={t} a={P(22)} w={230} speed={7} label={(n) => `${Math.min(10, 1 + n)} yr`} />
    <Igloo x={540} y={S} w={760} />
    {/* how much of the igloo Doug really owns */}
    <div style={{position: 'absolute', left: 160, top: 590, width: 760, height: 110, border: `7px solid ${INK}`, borderRadius: 14, background: RED, overflow: 'hidden', opacity: p}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${own * p}%`, background: GREEN, borderRight: `6px solid ${INK}`}} />
      <div style={{position: 'absolute', right: 24, top: 0, lineHeight: '96px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56, color: '#fff'}}>FOX 87%</div>
    </div>
    <BigWord text="Doug 13%" x={260} y={745} at={P(22) + 1.6} size={80} color={GREEN} />
    <BigWord text="still owe $346,000" x={540} y={500} at={P(22) + 1.9} size={95} color={RED} />
    <Penguin id="doug" x={880} y={S + 60} h={360} pose={{brows: 'worried', beak: 'frown', sweat: true, look: [-0.7, -0.6], eyeScale: 1.2}} />
  </>;
};
const LarryBank = ({t}: {t: number}) => {
  const laugh = t >= P(31);
  return <>
    <Snow />
    <IceBank x={380} y={S} w={620} />
    <BigWord text="Larry's bank" x={540} y={300} at={P(30)} size={120} />
    <FishRain x1={380} y1={S - 380} x2={820} y2={S - 300} t={t} a={P(30) + 0.2} b={E(31)} gap={0.1} />
    <FishPile x={830} y={S} n={Math.min(10, 2 + Math.floor((t - P(30)) * 5))} w={140} />
    <Walrus x={830} y={S - 120} h={460} pose={{laugh: laugh ? 1 : 0, lids: 0.5, look: -0.5}} />
    {laugh && <BigWord text="HA HA" x={830} y={560} at={P(31)} size={110} color={GREEN} />}
  </>;
};

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(2), set: (t) => <Intro t={t} />, fx_: 'zoom'},
  {at: P(6), set: (t) => <Cost t={t} />, fx_: 'swipe'},
  {at: P(9), set: (t) => <Bank t={t} />, fx_: 'swipeL'},
  {at: P(11), set: (t) => <Back t={t} />, fx_: 'pop'},
  {at: P(13), set: (t) => <RentMoney t={t} />, fx_: 'swipeL'},
  {at: P(15), set: (t) => <Rate t={t} />, fx_: 'zoom'},
  {at: P(16), set: (t) => <Monthly t={t} />, fx_: 'swipe'},
  {at: P(19), set: (t) => <Split t={t} />, fx_: 'iris'},
  {at: P(22), set: (t) => <Owe t={t} />, fx_: 'swipe'},
  {at: P(23), set: (t) => <Called t={t} />, fx_: 'zoom'},
  {at: P(25), set: (t) => <Poor t={t} />, fx_: 'pop'},
  {at: P(26), set: (t) => <RealLife t={t} />, fx_: 'swipe'},
  {at: P(27), set: (t) => <Total t={t} />, fx_: 'swipeL'},
  {at: P(30), set: (t) => <LarryBank t={t} />, fx_: 'pop'},
  {at: P(32), set: (t) => <PaidOff t={t} />, fx_: 'iris'},
  {at: P(36), set: (t) => <Tax t={t} />, fx_: 'swipe'},
  {at: P(40), set: (t) => <Owns t={t} />, fx_: 'pop'},
  {at: P(42), set: (t) => <Cta t={t} />, fx_: 'zoom'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[8, 300, 700, 1.5], [7, 540, 500, 1.3], [10, 520, 800, 1.3], [12, 540, 600, 1.4], [20, 800, 700, 1.5], [21, 250, 800, 1.6], [33, 360, 900, 1.6], [37, 760, 700, 1.4], [41, 540, 900, 1.4]];

export const DougMortgage = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: strong zoom to the price being spoken (left on "million", right on "four hundred thousand"), out to both on "Same house"
    const toL = ease((tc - 0.8) / 0.35) * (tc < FOUR ? 1 : 0), toR = ease((tc - FOUR) / 0.35) * (tc < SAME ? 1 : 0), z = Math.max(toL, toR);
    s0 = 1 + 0.22 * z; fx = 540 - 240 * toL + 240 * toR; fy = 960 - 150 * z;
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (tc < SAME ? 1 : beat(tc, TIM));
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-mortgage-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    {/* hook */}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.2} name="swoosh-fast" vol={0.3} />
    <Sfx at={0.8} name="user-whoosh" vol={0.25} />
    <Sfx at={MILLION} name="user-cash-register" vol={0.35} />
    <Sfx at={PAY0} name="user-money" vol={0.35} />
    <Sfx at={PAY0 + 0.6} name="user-money" vol={0.3} />
    <Sfx at={FOUR + 0.05} name="penguin-squawk" vol={0.35} />
    <Sfx at={SAME + 0.3} name="user-aww" vol={0.3} />
    <Sfx at={FOUR} name="user-whoosh" vol={0.25} />
    <Sfx at={FOUR + 0.6} name="user-ting" vol={0.35} />
    <Sfx at={SAME} name="user-boom" vol={0.45} />
    {/* episode */}
    <Sfx at={P(2)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(3)} name="user-pop" vol={0.3} />
    <Sfx at={P(6) + 0.6} name="user-cash-register" vol={0.35} />
    <Sfx at={P(8)} name="user-wrong" vol={0.35} />
    <Sfx at={P(9) + 0.1} name="user-notif" vol={0.25} />
    <Sfx at={P(10) + 0.2} name="user-money" vol={0.4} />
    <Sfx at={P(10) + 0.4} name="user-yeah" vol={0.35} />
    <Sfx at={P(11) + 0.1} name="user-pop" vol={0.3} />
    <Sfx at={P(12)} name="user-boom" vol={0.4} />
    <Sfx at={P(15) + 1.0} name="user-ting" vol={0.4} />
    <Sfx at={P(15) + 1.2} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(16)} name="user-timer" vol={0.35} />
    <Sfx at={P(17)} name="user-boom" vol={0.35} />
    <Sfx at={P(17) + 0.3} name="user-aww" vol={0.3} />
    <Sfx at={P(20)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(20) + 0.4} name="walrus-laugh" vol={0.25} />
    <Sfx at={P(21) + 0.4} name="user-ting" vol={0.35} />
    <Sfx at={P(21) + 0.8} name="user-horn" vol={0.3} />
    <Sfx at={P(23) + 0.4} name="user-ting" vol={0.35} />
    <Sfx at={P(24) + 1.6} name="user-shock" vol={0.4} />
    <Sfx at={P(25)} name="user-fahh" vol={0.45} />
    <Sfx at={P(26)} name="user-ting" vol={0.3} />
    <Sfx at={P(26) + 2.6} name="user-cash-register" vol={0.4} />
    <Sfx at={P(26) + 4.6} name="user-timer" vol={0.3} />
    <Sfx at={P(28)} name="user-ting" vol={0.4} />
    <Sfx at={P(29)} name="user-boom" vol={0.45} />
    <Sfx at={P(29) + 0.5} name="user-slap" vol={0.3} />
    <Sfx at={P(32) + 0.2} name="user-money" vol={0.35} />
    <Sfx at={P(34)} name="user-wow" vol={0.35} />
    <Sfx at={P(35)} name="user-yeah" vol={0.4} />
    <Sfx at={P(36) + 0.2} name="gull-caw" vol={0.4} />
    <Sfx at={P(37)} name="user-notif2" vol={0.3} />
    <Sfx at={P(38)} name="user-timer" vol={0.3} />
    <Sfx at={P(38) + 0.1} name="user-money-transfer" vol={0.3} />
    <Sfx at={P(39)} name="user-wrong" vol={0.35} />
    <Sfx at={P(40)} name="user-yeah" vol={0.3} />
    <Sfx at={P(41)} name="user-shock" vol={0.4} />
    <Sfx at={P(41) + 0.2} name="user-fahh-long" vol={0.35} />
    <Sfx at={P(42)} name="user-pop" vol={0.35} />
    <Sfx at={P(43)} name="user-pop" vol={0.3} />
    <Sfx at={P(4)} name="user-pop" vol={0.3} />
    <Sfx at={P(5)} name="user-wow" vol={0.3} />
    <Sfx at={P(7)} name="user-money" vol={0.35} />
    <Sfx at={P(13)} name="user-ting" vol={0.35} />
    <Sfx at={P(14) + 0.3} name="user-slap" vol={0.3} />
    <Sfx at={P(18)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(22)} name="user-timer" vol={0.3} />
    <Sfx at={P(22) + 1.9} name="user-wrong" vol={0.35} />
    <Sfx at={P(30) + 0.2} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(31)} name="walrus-laugh" vol={0.45} />
  </AbsoluteFill>;
};
