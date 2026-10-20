// EP6 "Debit vs credit: same $50, very different bill" (Truth rule) — "What the difference" split hook + Hook camera rule; template = dougCashCard.tsx.
// Phrase timings: src/data/doug-debit-credit.json (Edge TTS Andrew, tightened + atempo 1.035, videos/doug-debit-credit/vo). P(i) = phrase i start.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HAND, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {BigWord, IceBank, Paper, PriceTag, Sign, Stamp} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {Fox, Puffin} from '../penguin/cast';
import TIM from '../data/doug-debit-credit.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_DEBIT_CREDIT_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1250, RED = '#D83A2E', GREEN = '#2E9E4F', BLUE = '#2F5DA8', GOLD = '#E2A90F';
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => { const q = cl(p); return q * q * (3 - 2 * q); };
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const DEBITW = 1.7; // the word "debit..."
const CREDITW = 3.5; // the word "credit?"

// ---------- money props ----------
// Cartoon $50 note: plain green bill with a big "$50" and fish (Doug-world money). No real-currency details.
const Note50 = ({w = 300}: {w?: number}) =>
  <svg width={w} height={w * 0.425} viewBox="0 0 470 200" style={{display: 'block', overflow: 'visible'}}>
    <rect x={3} y={3} width={464} height={194} rx={16} fill="#BFE3B4" stroke={INK} strokeWidth={7} />
    <rect x={20} y={20} width={430} height={160} rx={10} fill="none" stroke="#6FB062" strokeWidth={5} strokeDasharray="14 8" />
    <text x={235} y={130} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={100} fill={INK}>$50</text>
    <g transform="translate(60 100)"><path d="M-30 0 Q0 -26 26 0 Q0 26 -30 0 Z M26 0 L44 -16 L44 16 Z" fill="#5EC4FA" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><circle cx={-14} cy={-4} r={4} fill={INK} /></g>
    <g transform="translate(410 100) scale(-1 1)"><path d="M-30 0 Q0 -26 26 0 Q0 26 -30 0 Z M26 0 L44 -16 L44 16 Z" fill="#5EC4FA" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><circle cx={-14} cy={-4} r={4} fill={INK} /></g>
  </svg>;
const Bill = ({x, y, w = 300, rot = -4, s = 1}: {x: number; y: number; w?: number; rot?: number; s?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.2125, width: w, transform: `rotate(${rot}deg) scale(${s})`}}><Note50 w={w} /></div>;
const BillFly = ({t, x1, y1, x2, y2, a, b, w = 220, arc = 260}: {t: number; x1: number; y1: number; x2: number; y2: number; a: number; b: number; w?: number; arc?: number}) => {
  const p = ease((t - a) / (b - a));
  return <Bill x={lerp(x1, x2, p)} y={lerp(y1, y2, p) - Math.sin(p * Math.PI) * arc} w={w} rot={-4 + 10 * Math.sin(p * 6)} />;
};
// bank cards: DEBIT = green, CREDIT = gold
const CardIcon = ({w = 250, kind, rot = 0}: {w?: number; kind: 'debit' | 'credit'; rot?: number}) =>
  <div style={{width: w, height: w * 0.62, background: kind === 'debit' ? GREEN : GOLD, border: `6px solid ${INK}`, borderRadius: w * 0.07, position: 'relative', transform: `rotate(${rot}deg)`}}>
    <div style={{position: 'absolute', left: w * 0.1, top: w * 0.13, width: w * 0.2, height: w * 0.16, background: '#F7E08A', border: `4px solid ${INK}`, borderRadius: 8}} />
    <div style={{position: 'absolute', right: w * 0.08, top: w * 0.31, fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.13, color: '#fff', WebkitTextStroke: `2px ${INK}`}}>{kind.toUpperCase()}</div>
    <div style={{position: 'absolute', left: w * 0.1, bottom: w * 0.09, right: w * 0.1, height: w * 0.05, background: 'rgba(255,255,255,0.7)', borderRadius: 6}} />
  </div>;
const Card = ({x, y, w = 260, kind, rot = 0}: {x: number; y: number; w?: number; kind: 'debit' | 'credit'; rot?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.31}}><CardIcon w={w} kind={kind} rot={rot} /></div>;
const Coin = ({x, y, text, w = 150}: {x: number; y: number; text: string; w?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w / 2, width: w, height: w, borderRadius: '50%', background: '#F5C518', border: `6px solid ${INK}`, boxShadow: 'inset 0 0 0 8px #E2A90F',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.3, color: INK}}>{text}</div>;
// card reader: screen flashes green "BEEP" for 0.35 s after each beep time
const Reader = ({x, y, w = 200, t, beeps = [], amount = '$50.00'}: {x: number; y: number; w?: number; t: number; beeps?: number[]; amount?: string}) => {
  const on = beeps.some((b) => t >= b && t < b + 0.35);
  return <div style={{position: 'absolute', left: x - w / 2, top: y - w * 1.5, width: w, height: w * 1.5, background: '#3A3F47', border: `7px solid ${INK}`, borderRadius: w * 0.12,
    transform: on ? 'scale(1.08)' : undefined}}>
    <div style={{margin: w * 0.08, height: w * 0.45, borderRadius: 8, border: `4px solid ${INK}`, background: on ? '#5CF07A' : '#9EE6A0', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * (on ? 0.2 : 0.15), color: INK}}>{on ? 'BEEP' : amount}</div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: w * 0.05, margin: `0 ${w * 0.12}px`}}>
      {Array.from({length: 9}, (_, i) => <div key={i} style={{height: w * 0.11, borderRadius: 5, background: '#C9CED4'}} />)}</div>
  </div>;
};
const NameTag = ({x, y, text, color = INK, size = 60}: {x: number; y: number; text: string; color?: string; size?: number}) =>
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%) rotate(-3deg)', background: color, color: '#fff', border: `6px solid ${INK}`, borderRadius: 14,
    padding: '4px 26px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, whiteSpace: 'nowrap'}}>{text}</div>;
const Check = ({x, y, at, t}: {x: number; y: number; at: number; t: number}) => t < at ? null :
  <div style={{position: 'absolute', left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: '50%', background: GREEN, border: `6px solid ${INK}`, color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, fontWeight: 900, transform: `scale(${Math.min(1, (t - at) / 0.12)})`}}>✓</div>;
const Shield = ({s = 1}: {s?: number}) => <svg width={170 * s} height={190 * s} viewBox="0 0 170 190"><path d="M85 10 L155 40 Q155 130 85 180 Q15 130 15 40 Z" fill={BLUE} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
  <path d="M55 95 L78 118 L118 70" fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Small = ({x, y, text, size = 40, color = '#5A6470'}: {x: number; y: number; text: string; size?: number; color?: string}) =>
  <div style={{position: 'absolute', left: x, top: y, transform: 'translateX(-50%)', fontFamily: HAND, fontSize: size, color, whiteSpace: 'nowrap'}}>{text}</div>;
const Big = ({x, y, text, size = 100, color = INK, op = 1}: {x: number; y: number; text: string; size?: number; color?: string; op?: number}) =>
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%) rotate(-3deg)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, color, whiteSpace: 'nowrap', opacity: op}}>{text}</div>;

// red puffer jacket (what Doug buys)
const Jacket = ({x, y, w = 260}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={w} viewBox="0 0 200 200" style={{position: 'absolute', left: x - w / 2, top: y - w / 2, overflow: 'visible'}}>
    <path d="M60 30 L100 45 L140 30 L190 70 L170 110 L150 95 L150 185 L50 185 L50 95 L30 110 L10 70 Z" fill={RED} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {[80, 115, 150].map((yy) => <path key={yy} d={`M52 ${yy} Q100 ${yy + 10} 148 ${yy}`} fill="none" stroke={INK} strokeWidth={4} opacity={0.5} />)}
    <path d="M100 45 L100 185" stroke={INK} strokeWidth={5} />
  </svg>;
// Stoat (the card thief): white weasel, black tail tip, burglar mask — a snow-world animal, not a penguin
const Stoat = ({x, y, h = 380, t = 0, flip}: {x: number; y: number; h?: number; t?: number; flip?: boolean}) => {
  const k = h / 300, sway = Math.sin(t * 6) * 6;
  return <svg width={300 * k} height={300 * k} viewBox="-150 -300 300 300" style={{position: 'absolute', left: x - 150 * k, top: y - 300 * k, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
    <ellipse cx={0} cy={-6} rx={90} ry={12} fill="rgba(30,40,60,0.13)" />
    <path d={`M60 -40 Q140 -60 ${130 + sway} -150`} fill="none" stroke="#F4F1EA" strokeWidth={30} strokeLinecap="round" />
    <path d={`M${120 + sway * 0.8} -125 Q${132 + sway} -140 ${130 + sway} -150`} fill="none" stroke={INK} strokeWidth={30} strokeLinecap="round" />
    <path d="M-50 -10 Q-70 -120 -20 -190 Q20 -220 50 -180 Q80 -110 60 -10 Z" fill="#F4F1EA" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <ellipse cx={5} cy={-215} rx={58} ry={48} fill="#F4F1EA" stroke={INK} strokeWidth={7} />
    <circle cx={-38} cy={-252} r={16} fill="#F4F1EA" stroke={INK} strokeWidth={6} /><circle cx={46} cy={-252} r={16} fill="#F4F1EA" stroke={INK} strokeWidth={6} />
    <path d="M-50 -228 Q5 -244 60 -228 L58 -205 Q5 -218 -48 -205 Z" fill="#111" />
    <circle cx={-18} cy={-218} r={7} fill="#fff" /><circle cx={28} cy={-218} r={7} fill="#fff" />
    <ellipse cx={5} cy={-190} rx={9} ry={6} fill={INK} />
    <path d="M-10 -178 Q5 -170 20 -178" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
  </svg>;
};
// a bank-account screen: label + balance
const Account = ({x, y, w = 520, label = "DOUG'S ACCOUNT", balance, color = INK}: {x: number; y: number; w?: number; label?: string; balance: string; color?: string}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.3, width: w, height: w * 0.6, background: '#F4FAFD', border: `8px solid ${INK}`, borderRadius: 30,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.08, color: BLUE}}>{label}</div>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.22, color}}>{balance}</div>
  </div>;
// credit-score gauge: needle moves from `from` to `to` (0..1) during [a, a+0.8]
const Gauge = ({x, y, t, a, from = 0.45, to = 0.7, w = 420}: {x: number; y: number; t: number; a: number; from?: number; to?: number; w?: number}) => {
  const v = lerp(from, to, ease((t - a) / 0.8)), ang = -180 + 180 * v, r = w * 0.42;
  return <svg width={w} height={w * 0.62} viewBox={`${-w / 2} ${-w * 0.5} ${w} ${w * 0.62}`} style={{position: 'absolute', left: x - w / 2, top: y - w * 0.5, overflow: 'visible'}}>
    {[[RED, -180, -120], [GOLD, -120, -60], [GREEN, -60, 0]].map(([c, s, e], i) => {
      const p = (d: number) => `${r * Math.cos((d as number) * Math.PI / 180)} ${r * Math.sin((d as number) * Math.PI / 180)}`;
      return <path key={i} d={`M${p(s as number)} A${r} ${r} 0 0 1 ${p(e as number)}`} fill="none" stroke={c as string} strokeWidth={w * 0.09} />;
    })}
    <line x1={0} y1={0} x2={r * 0.85 * Math.cos(ang * Math.PI / 180)} y2={r * 0.85 * Math.sin(ang * Math.PI / 180)} stroke={INK} strokeWidth={12} strokeLinecap="round" />
    <circle r={18} fill={INK} />
  </svg>;
};
// calendar page that flips through months
const Calendar = ({x, y, t, a, w = 260}: {x: number; y: number; t: number; a: number; w?: number}) => {
  const M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const m = M[Math.max(0, Math.min(11, Math.floor((t - a) / 0.25)))];
  return <div style={{position: 'absolute', left: x - w / 2, top: y - w / 2, width: w, height: w, background: '#fff', border: `7px solid ${INK}`, borderRadius: 22, overflow: 'hidden'}}>
    <div style={{height: w * 0.3, background: RED, borderBottom: `6px solid ${INK}`}} />
    <div style={{textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.28, color: INK, marginTop: w * 0.1}}>{m}</div>
  </div>;
};

// ---------- hook: "What the difference" split, SAME $50 on both sides ----------
// Left: Doug taps a green DEBIT card. Right: Doug taps a gold CREDIT card, Fox the Banker peeks in behind. Dashed divider + VS.
const Counter = ({x, w}: {x: number; w: number}) => <>
  <div style={{position: 'absolute', left: x, top: 1100, width: w, height: 300, background: '#C98F55', border: `7px solid ${INK}`, borderRadius: 10,
    backgroundImage: `repeating-linear-gradient(90deg, transparent 0 52px, rgba(0,0,0,0.18) 52px 56px)`}} />
  <div style={{position: 'absolute', left: x - 14, top: 1082, width: w + 28, height: 34, background: '#E0A96D', border: `7px solid ${INK}`, borderRadius: 8}} />
</>;
const DiffSide = ({side, t = -1}: {side: 'debit' | 'credit'; t?: number}) => { const o = side === 'debit' ? 0 : 540;
  const w = side === 'debit' ? DEBITW : CREDITW, react = t >= w;
  const peek = side === 'credit' ? ease((t - CREDITW) / 0.3) : 0;
  const tap = t < 0 ? 0 : ease((t - w + 0.3) / 0.35);
  return <>
    {side === 'credit' && <Fox x={o + 470} y={1000 + 120 * (1 - peek)} h={300} id="hfox" pose={{smirk: false, lids: 0.3, look: -0.5}} />}
    <Puffin x={o + 445} y={1180} h={330} id={`hp${side}`} pose={react ? {look: -0.6, mouth: 0.35} : {look: -0.6, mouth: 0.15}} />
    <Counter x={o + 270} w={260} />
    <Reader x={o + 330} y={1086} w={96} t={t} beeps={[w + 0.1]} amount="$50" />
    <Penguin id={`hd${side}`} x={o + 150} y={1420} h={410} pose={react ? (side === 'debit' ? {turn: 0.55, look: [0.8, -0.2], flapR: 30 + 40 * tap, beak: 'smile', brows: 'happy'}
      : {turn: 0.55, look: [0.8, -0.3], flapR: 30 + 40 * tap, beak: 'smile', brows: 'worried', eyeScale: 1.15})
      : {turn: 0.55, look: [0.8, -0.1], flapR: 30 + 40 * tap, beak: 'flat', lids: 0.25}} />
    {/* Doug pays: the card moves from his flipper to the reader on his side's word, then taps (beep) */}
    <Card x={lerp(o + 205, o + 285, tap)} y={lerp(1150, 1000, tap) + 12 * Math.sin(cl((t - w - 0.1) / 0.2) * Math.PI)} w={130} kind={side} rot={lerp(10, -14, tap)} />
  </>; };
const HookSplit = ({t = -1}: {t?: number}) => <AbsoluteFill style={{background: '#fff'}}>
  <Fonts /><HandFont />
  <div style={{position: 'absolute', left: 0, top: 110, width: 1080, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontStyle: 'italic', fontSize: 96, whiteSpace: 'nowrap',
    color: INK, letterSpacing: -3, textShadow: '5px 6px 0 rgba(0,0,0,0.18)'}}>What the difference</div>
  <div style={{position: 'absolute', left: 0, top: 255, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 104, color: GREEN}}>DEBIT</div>
  <div style={{position: 'absolute', left: 540, top: 255, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 104, color: GOLD}}>CREDIT</div>
  <div style={{position: 'absolute', left: 270 - 150, top: 410}}><CardIcon w={300} kind="debit" rot={-6} /></div>
  <div style={{position: 'absolute', left: 810 - 150, top: 410}}><CardIcon w={300} kind="credit" rot={6} /></div>
  <div style={{position: 'absolute', left: 0, top: 610, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 120, color: INK}}>$50</div>
  <div style={{position: 'absolute', left: 540, top: 610, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 120, color: INK}}>$50</div>
  <div style={{position: 'absolute', left: 536, top: 400, width: 0, height: 1060, borderLeft: `8px dashed ${INK}`}} />
  <div style={{position: 'absolute', left: 540 - 62, top: 640, width: 124, height: 124, borderRadius: '50%', background: '#F7CF3B', border: `7px solid ${INK}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 54, color: INK}}>VS</div>
  <DiffSide side="debit" t={t} /><DiffSide side="credit" t={t} />
  {t >= P(1) && <div style={{position: 'absolute', left: 540, top: 860, transform: `translate(-50%,-50%) rotate(-8deg) scale(${Math.min(1, 0.6 + (t - P(1)) / 0.15)})`, background: RED, color: '#fff',
    border: `7px solid ${INK}`, borderRadius: 18, padding: '6px 30px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, whiteSpace: 'nowrap'}}>SAME $50</div>}
</AbsoluteFill>;
export const DougDebitCreditHook = () => <HookSplit />;
// Hook camera (user rule): still at first, zoom into side A on "debit", across to side B on "credit", back to the full split on "Same fifty dollars".
const hookCam = (t: number) => {
  const toL = ease((t - DEBITW + 0.1) / 0.3) * (1 - ease((t - CREDITW + 0.1) / 0.3));
  const toR = ease((t - CREDITW + 0.1) / 0.3) * (1 - ease((t - P(1)) / 0.35));
  return {s: 1 + 0.5 * (toL + toR), x: 540 + (270 - 540) * toL + (810 - 540) * toR, y: 960 + (900 - 960) * (toL + toR)};
};

// ---------- stage ----------
const Ice = () => <>
  <div style={{position: 'absolute', left: -2000, top: -2000, width: 5080, height: 6000, background: '#fff'}} />
  <div style={{position: 'absolute', left: -2000, top: G - 10, width: 5080, height: 3000, background: '#E4F4FC', borderTop: `6px solid ${INK}`}} />
</>;
const Dark = () => <div style={{position: 'absolute', left: -2000, top: -2000, width: 5080, height: 6000, background: '#24292E'}} />;
const Snow = ({t}: {t: number}) => <>{Array.from({length: 26}, (_, i) => <div key={i} style={{position: 'absolute', left: (i * 137) % 1080, top: ((i * 211 + t * 160) % 1500) - 100,
  width: 18, height: 18, borderRadius: '50%', background: '#fff', border: '3px solid #9CCBE6'}} />)}</>;

// ---------- sets (one idea per shot) — script videos/doug-debit-credit/voice.txt ----------
const Intro = ({t}: {t: number}) => <>
  <Penguin id="doug" x={540} y={G + 220} h={780} pose={t < P(4) ? {beak: 'smile', brows: 'happy', flapR: 20} : {brows: 'worried', beak: 'frown', tremble: 0.8, flapL: 5, flapR: 5}} />
  {t >= P(4) && <Snow t={t} />}
  {t >= P(4) && <div style={{position: 'absolute', left: 800, top: 380, transform: `scale(${Math.min(1, (t - P(4)) / 0.2)})`}}><Jacket x={0} y={0} w={240} /></div>}
  {t >= P(4) && <BigWord text="brrr" x={260} y={460} at={P(4) + 0.2} size={110} color={BLUE} />}
</>;
const Shop = ({t}: {t: number}) => <>
  <Sign x={700} y={G + 30} text="PUFFIN COATS" w={420} />
  <Puffin x={780} y={G + 40} h={430} flip={false} pose={{look: -0.5, mouth: 0.3, flap: 30}} />
  <Jacket x={460} y={G - 380} w={300} />
  <PriceTag x={440} y={470} price="$50" fish="jacket" at={P(6)} color={RED} size={1.2} />
  <Penguin id="doug" x={170} y={G + 60} h={360} pose={{turn: 0.5, look: [0.8, -0.4], brows: 'happy', beak: 'smile'}} />
</>;
const PayDebit = ({t}: {t: number}) => { const tap = ease((t - P(7) - 0.5) / 0.4);
  return <>
    <Penguin id="doug" x={290} y={G + 40} h={440} pose={{turn: 0.5, look: [0.8, -0.2], beak: 'smile', flapR: 70}} />
    <Puffin x={840} y={G + 40} h={430} pose={{look: -0.5}} />
    <Reader x={640} y={G - 260} w={190} t={t} beeps={[P(8)]} />
    <Card x={lerp(420, 600, tap)} y={G - 400 + 40 * tap} w={220} kind="debit" />
    <Stamp text="DEBIT" x={540} y={330} at={P(7) + 0.3} color={GREEN} size={110} />
  </>; };
const LeaveAccount = ({t}: {t: number}) => { const a = P(9) + 0.4, out = t >= a + 0.6;
  return <>
    <Account x={300} y={620} w={480} balance={out ? '$70' : '$120'} color={out ? INK : GREEN} />
    <Small x={300} y={790} text="(example)" size={40} />
    <BillFly t={t} x1={300} y1={760} x2={790} y2={G - 330} a={a} b={a + 0.7} w={200} />
    <Puffin x={820} y={G + 40} h={420} pose={{look: -0.5, mouth: out ? 0.35 : 0.1}} />
    <Penguin id="doug" x={230} y={G + 140} h={320} pose={{turn: 0.4, look: [0.8, -0.3], beak: 'flat'}} />
    {t >= P(10) && <Stamp text="RIGHT NOW" x={540} y={260} at={P(10)} color={RED} size={100} />}
  </>; };
const Done = ({t}: {t: number}) => <>
  <Penguin id="doug" x={540} y={G + 200} h={720} pose={{beak: 'smile', brows: 'happy', flapR: 60, flapL: 60, hop: Math.max(0, 25 * Math.sin((t - P(11)) * 8))}} />
  <Jacket x={540} y={G - 230} w={330} />
  <Check x={830} y={430} at={P(11)} t={t} />
  {t >= P(12) && <BigWord text="simple" x={540} y={380} at={P(12)} size={120} color={GREEN} />}
</>;
const PayCredit = ({t}: {t: number}) => { const tap = ease((t - P(13) - 1.0) / 0.4);
  return <>
    <Snow t={t} />
    <Penguin id="doug" x={290} y={G + 40} h={440} pose={{turn: 0.5, look: [0.8, -0.2], beak: 'smile', flapR: 70}} />
    <Puffin x={840} y={G + 40} h={430} pose={{look: -0.5}} />
    <Reader x={640} y={G - 260} w={190} t={t} beeps={[P(14)]} />
    <Card x={lerp(420, 600, tap)} y={G - 400 + 40 * tap} w={220} kind="credit" />
    <NameTag x={540} y={300} text="NEXT WINTER" color={BLUE} size={64} />
  </>; };
const StillFull = ({t}: {t: number}) => <>
  <Account x={540} y={680} w={600} balance="$120" color={GREEN} />
  <Small x={540} y={880} text="(example)" size={42} />
  {t < P(16) && <BigWord text="?" x={900} y={400} at={P(15)} size={180} />}
  {t >= P(16) && <Stamp text="STILL FULL" x={540} y={360} at={P(16)} color={GREEN} size={110} />}
  <Penguin id="doug" x={180} y={G + 160} h={330} pose={{brows: 'happy', beak: 'smile', look: [0.7, -0.5]}} />
</>;
const FoxPays = ({t}: {t: number}) => { const a = P(17) + 0.6;
  return <>
    {/* Doug still does the payment: he taps his credit card, Fox's money goes to Puffin */}
    <Penguin id="doug" x={150} y={G + 60} h={380} pose={{turn: 0.5, look: [0.8, -0.2], beak: 'smile', flapR: 70}} />
    <Reader x={360} y={G - 200} w={130} t={t} beeps={[P(17) + 0.3]} />
    <Card x={lerp(250, 350, ease((t - P(17)) / 0.3))} y={G - 330} w={150} kind="credit" />
    <Fox x={560} y={G + 40} h={420} pose={{smirk: false, lids: 0.3, look: 0.5}} />
    <BillFly t={t} x1={600} y1={G - 420} x2={850} y2={G - 360} a={a} b={a + 0.7} w={200} arc={120} />
    <Puffin x={900} y={G + 40} h={400} pose={{look: -0.5, mouth: t >= a + 0.7 ? 0.35 : 0.1}} />
    <NameTag x={540} y={320} text="FOX THE BANKER" color="#26324A" />
    <Small x={540} y={420} text="pays Puffin for Doug" size={48} color={INK} />
  </>; };
const Owe = ({t}: {t: number}) => <>
  <Penguin id="doug" x={300} y={G + 40} h={480} pose={{turn: 0.5, look: [0.8, -0.3], brows: 'worried', beak: 'frown'}} />
  <Fox x={790} y={G + 40} h={470} pose={{smirk: false, lids: 0.25, look: -0.5}} />
  <Paper x={540} y={600} w={400} title="DOUG OWES FOX" amount="$50" at={P(18) + 0.2} rot={-3} id="iou" />
</>;
const BillCome = ({t}: {t: number}) => { const p = ease((t - P(19) - 0.6) / 0.5);
  return <>
    <Calendar x={800} y={520} t={t} a={P(19) + 10} w={240} />
    <Small x={800} y={660} text="1 month later" size={46} color={INK} />
    <div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${(1 - p) * -600}px)`}}>
      <Paper x={360} y={700} w={380} title="CARD BILL" amount="$50" at={P(19) + 0.6} rot={4} id="bill" /></div>
    <Penguin id="doug" x={300} y={G + 160} h={340} pose={{brows: 'worried', look: [0, -0.8]}} />
  </>; };
const PayFull = ({t}: {t: number}) => { const a = P(20) + 0.6;
  return <>
    <Penguin id="doug" x={250} y={G + 40} h={450} pose={{turn: 0.5, look: [0.8, -0.2], beak: 'smile', brows: 'happy', flapR: 60}} />
    <Fox x={830} y={G + 40} h={450} pose={{smirk: false, lids: 0.3, look: -0.5}} />
    <BillFly t={t} x1={400} y1={G - 280} x2={760} y2={G - 380} a={a} b={a + 0.7} w={200} />
    <Small x={540} y={300} text="all $50, on time" size={56} color={INK} />
    {t >= P(20) + 2.3 && <Big x={540} y={480} text="INTEREST: $0" size={96} color={GREEN} />}
  </>; };
const Points = ({t}: {t: number}) => <>
  <Penguin id="doug" x={260} y={G + 60} h={470} pose={{beak: 'smile', brows: 'happy', flapR: 70, turn: 0.3}} />
  <PriceTag x={300} y={420} price="+points" fish="rewards" at={P(21) + 0.3} color={GREEN} size={0.9} />
  {t >= P(22) && <><Gauge x={780} y={720} t={t} a={P(22) + 0.5} w={440} /><Small x={780} y={760} text="credit score can go up" size={42} color={INK} /></>}
</>;
const Smart = ({t}: {t: number}) => <>
  <Penguin id="doug" x={540} y={G + 300} h={950} pose={{beak: 'smile', brows: 'happy', lids: 0.2, look: [0, 0]}} />
  <svg width={420} height={120} viewBox="0 0 420 120" style={{position: 'absolute', left: 330, top: 690}}>
    <circle cx={110} cy={60} r={50} fill="rgba(255,255,255,0.3)" stroke={INK} strokeWidth={12} /><circle cx={310} cy={60} r={50} fill="rgba(255,255,255,0.3)" stroke={INK} strokeWidth={12} />
    <path d="M160 60 L260 60" stroke={INK} strokeWidth={12} /></svg>
</>;
const PayLittle = ({t}: {t: number}) => <>
  <Penguin id="doug" x={250} y={G + 40} h={450} pose={{turn: 0.5, look: [0.8, -0.2], brows: 'worried', beak: 'flat', flapR: 40}} />
  <Fox x={830} y={G + 40} h={450} pose={{smirk: true, lids: 0.3, look: -0.5}} />
  <Coin x={lerp(400, 740, ease((t - P(24) - 0.5) / 0.6))} y={G - 360} text="a bit" w={130} />
  <Paper x={540} y={480} w={360} title="STILL OWE" amount="most of it" at={P(24) + 0.8} rot={-4} id="owe2" />
</>;
const Interest = ({t}: {t: number}) => { const n = Math.max(0, Math.min(6, Math.floor((t - P(25) - 0.3) / 0.25)));
  return <>
    <Fox x={260} y={G + 40} h={470} flip pose={{smirk: false, lids: 0.3, look: 0.5}} />
    <Paper x={720} y={640} w={360} title="DOUG'S BILL" amount="$50" at={-1} rot={3} id="b3" />
    {Array.from({length: n}, (_, i) => <div key={i} style={{position: 'absolute', left: 860 + (i % 2) * 60, top: 820 - i * 70, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: RED}}>+</div>)}
    <Stamp text="+ INTEREST" x={720} y={340} at={P(25) + 0.2} color={RED} size={100} />
    {t >= P(26) && <Calendar x={420} y={560} t={t} a={P(26)} w={210} />}
  </>; };
const RealLife = ({t}: {t: number}) => { const n = Math.round(22 * ease((t - P(27) - 2.0) / 1.0));
  return <>
    <NameTag x={540} y={360} text="IN REAL LIFE · USA" color={BLUE} />
    <Small x={540} y={470} text="average credit card interest" size={56} color={INK} />
    <Big x={540} y={720} text={`~${n}%`} size={260} color={RED} op={t >= P(27) + 2.0 ? 1 : 0} />
    <Small x={540} y={900} text="a year" size={64} color={INK} />
  </>; };
const FedData = ({t}: {t: number}) => <>
  <Paper x={540} y={700} w={520} title="FEDERAL RESERVE" amount="22%" at={P(28)} rot={-3} id="fed" />
  <Small x={540} y={1330} text="source: Federal Reserve G.19, 2026" />
  <Penguin id="doug" x={170} y={G + 140} h={360} pose={{brows: 'shock', eyeScale: 1.25, look: [0.8, -0.4]}} />
</>;
const OneYear = ({t}: {t: number}) => <>
  <Bill x={330} y={640} w={420} rot={-4} />
  <Calendar x={800} y={640} t={t} a={P(29) + 0.2} w={240} />
  <Small x={540} y={300} text="$50 not paid back for 1 year" size={54} color={INK} />
  {t >= P(30) + 0.4 && <Big x={540} y={930} text="+$11 EXTRA" size={130} color={RED} />}
  {t >= P(30) + 0.4 && <Small x={540} y={1330} text="about 22% a year (example)" />}
</>;
const Steal = ({t}: {t: number}) => { const run = ease((t - P(31) - 0.6) / 1.0);
  return <>
    <Dark />
    <div style={{position: 'absolute', left: 820, top: 220, width: 140, height: 140, borderRadius: '50%', background: '#F7E9A8', boxShadow: '0 0 60px #F7E9A8'}} />
    <Penguin id="doug" x={250} y={G + 40} h={380} pose={{lie: 1, lids: 1}} />
    <BigWord text="zzz" x={280} y={760} at={-1} size={80} color="#fff" />
    <Stoat x={lerp(520, 1150, run)} y={G + 40} h={380} t={t} />
    <Card x={lerp(560, 1190, run)} y={G - 240} w={140} kind="debit" rot={-10} />
  </>; };
const DebitStolen = ({t}: {t: number}) => <>
  <NameTag x={540} y={300} text="WITH DEBIT" color={GREEN} />
  <Account x={540} y={650} w={520} balance={t >= P(33) ? '$0' : '$120'} color={t >= P(33) ? RED : GREEN} />
  <Small x={540} y={830} text="Doug's own money (example)" size={42} />
  {t >= P(34) && <><IceBank x={820} y={G + 20} w={340} /><Penguin id="doug" x={330} y={G + 60} h={420} pose={{turn: 0.5, look: [0.8, -0.2], brows: 'worried', beak: 'frown', sweat: true}} />
    <BigWord text="waiting..." x={330} y={1000} at={P(34)} size={80} /></>}
</>;
const CreditStolen = ({t}: {t: number}) => <>
  <NameTag x={540} y={300} text="WITH CREDIT" color={GOLD} />
  <Fox x={300} y={G + 40} h={460} flip pose={{smirk: false, lids: 0.3, look: 0.5}} />
  {t >= P(36) && <Small x={300} y={560} text="Fox's money" size={56} color={INK} />}
  {t >= P(37) && <div style={{position: 'absolute', left: 620, top: 470}}><Shield s={1.4} /></div>}
  {t >= P(37) + 0.3 && <Big x={760} y={830} text="$50 MAX" size={110} color={GREEN} />}
  {t >= P(37) + 1.9 && <Big x={760} y={960} text="usually $0" size={80} color={INK} />}
  {t >= P(37) && <Small x={540} y={1330} text="Fair Credit Billing Act" />}
</>;
const Summary = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 0, top: 320, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color: GREEN}}>DEBIT</div>
  <div style={{position: 'absolute', left: 540, top: 320, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color: GOLD}}>CREDIT</div>
  <div style={{position: 'absolute', left: 535, top: 320, width: 10, height: 1000, background: INK}} />
  <Card x={270} y={600} w={300} kind="debit" rot={-5} />
  <Card x={810} y={600} w={300} kind="credit" rot={5} />
  <Big x={270} y={860} text="your money" size={62} color={INK} />
  {t >= P(39) && <Big x={810} y={860} text="you borrow" size={62} color={INK} />}
  {t >= P(40) && <><Big x={810} y={980} text="+ points" size={52} color={GREEN} /><Big x={810} y={1060} text="+ protection" size={52} color={BLUE} /><Big x={810} y={1160} text="pay in full!" size={56} color={RED} /></>}
</>;
const SameBeep = ({t}: {t: number}) => <>
  <Reader x={300} y={1000} w={220} t={t} beeps={[P(41) + 0.1]} />
  <Reader x={780} y={1000} w={220} t={t} beeps={[P(41) + 0.1]} />
  <Card x={300} y={420} w={200} kind="debit" rot={-6} />
  <Card x={780} y={420} w={200} kind="credit" rot={6} />
  {t >= P(42) && <><Paper x={300} y={1130} w={260} title="BILL" amount="$50" at={P(42)} rot={-3} id="sb1" />
    <Paper x={780} y={1130} w={260} title="BILL" amount="$50 + ?" at={P(42) + 0.2} rot={3} id="sb2" /></>}
</>;
const Choice = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 60, top: 360, width: 440, padding: 24, border: `7px solid ${INK}`, borderRadius: 26, background: '#EAF7EC', textAlign: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, lineHeight: 1.15, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>DEBIT<CardIcon w={220} kind="debit" /></div>
  {t >= P(43) + 0.4 && <div style={{position: 'absolute', left: 580, top: 360, width: 440, padding: 24, border: `7px solid ${INK}`, borderRadius: 26, background: '#FBF1D6', textAlign: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, lineHeight: 1.15, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>CREDIT<CardIcon w={220} kind="credit" /></div>}
  <Penguin id="doug" x={540} y={G + 140} h={560} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.2, 0.6], brows: 'happy'}} />
  {t >= P(45) && <BigWord text="👇" x={880} y={1080} at={P(45)} size={140} />}
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx; ice?: boolean};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <HookSplit t={t} />},
  {at: P(3), set: (t) => <Intro t={t} />, fx_: 'zoom', ice: true},
  {at: P(5), set: (t) => <Shop t={t} />, fx_: 'swipe', ice: true},
  {at: P(7), set: (t) => <PayDebit t={t} />, fx_: 'pop', ice: true},
  {at: P(9), set: (t) => <LeaveAccount t={t} />, fx_: 'swipeL', ice: true},
  {at: P(11), set: (t) => <Done t={t} />, fx_: 'zoom', ice: true},
  {at: P(13), set: (t) => <PayCredit t={t} />, fx_: 'iris', ice: true},
  {at: P(15), set: (t) => <StillFull t={t} />, fx_: 'pop', ice: true},
  {at: P(17), set: (t) => <FoxPays t={t} />, fx_: 'swipe', ice: true},
  {at: P(18), set: (t) => <Owe t={t} />, fx_: 'zoom', ice: true},
  {at: P(19), set: (t) => <BillCome t={t} />, fx_: 'swipeL', ice: true},
  {at: P(20), set: (t) => <PayFull t={t} />, fx_: 'pop', ice: true},
  {at: P(21), set: (t) => <Points t={t} />, fx_: 'swipe', ice: true},
  {at: P(23), set: (t) => <Smart t={t} />, fx_: 'zoom'},
  {at: P(24), set: (t) => <PayLittle t={t} />, fx_: 'swipeL', ice: true},
  {at: P(25), set: (t) => <Interest t={t} />, fx_: 'pop', ice: true},
  {at: P(27), set: (t) => <RealLife t={t} />, fx_: 'iris'},
  {at: P(28), set: (t) => <FedData t={t} />, fx_: 'swipe', ice: true},
  {at: P(29), set: (t) => <OneYear t={t} />, fx_: 'zoom'},
  {at: P(31), set: (t) => <Steal t={t} />, fx_: 'iris'},
  {at: P(32), set: (t) => <DebitStolen t={t} />, fx_: 'swipe', ice: true},
  {at: P(35), set: (t) => <CreditStolen t={t} />, fx_: 'swipeL', ice: true},
  {at: P(38), set: (t) => <Summary t={t} />, fx_: 'pop'},
  {at: P(41), set: (t) => <SameBeep t={t} />, fx_: 'zoom'},
  {at: P(43), set: (t) => <Choice t={t} />, fx_: 'pop', ice: true},
];
// deep zooms [phrase, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [
  [6, 440, 520, 1.35], [10, 540, 500, 1.2], [16, 540, 680, 1.25], [30, 540, 900, 1.25], [33, 540, 650, 1.3], [37, 760, 800, 1.2],
];
const BIGS: {text: string; at: number; until: number; x?: number; y?: number; color?: string; size: number}[] = [
  {text: 'BEEP!', at: P(8), until: P(9), y: 420, color: GREEN, size: 200},
  {text: 'BEEP!', at: P(14), until: P(15), y: 420, color: GOLD, size: 200},
];
const QUIET: [number, number][] = [];

export const DougDebitCredit = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { const c = hookCam(tc); s0 = c.s; fx = c.x; fy = c.y; }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, TIM);
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  const shk = (a: number) => tc > a && tc < a + 0.25 ? Math.sin(tc * 90) * 8 * (1 - (tc - a) / 0.25) : 0;
  const shake = shk(P(27) + 2.0) + shk(P(33));
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
    <Audio src={staticFile('doug-debit-credit-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    {/* hook */}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={DEBITW - 0.15} name="user-whoosh" vol={0.25} />
    <Sfx at={DEBITW + 0.1} name="card-beep" vol={0.35} />
    <Sfx at={CREDITW - 0.15} name="swoosh-fast" vol={0.3} />
    <Sfx at={CREDITW + 0.1} name="card-beep" vol={0.35} />
    <Sfx at={CREDITW + 0.2} name="fox-snicker" vol={0.3} />
    <Sfx at={P(1)} name="user-boom" vol={0.4} />
    {/* debit */}
    <Sfx at={P(3)} name="penguin-honk" vol={0.3} />
    <Sfx at={P(4) + 0.2} name="user-aww" vol={0.3} />
    <Sfx at={P(6)} name="user-cash-register" vol={0.4} />
    <Sfx at={P(8)} name="card-beep" vol={0.45} />
    <Sfx at={P(9) + 0.4} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(10)} name="user-ting" vol={0.4} />
    <Sfx at={P(11)} name="user-yeah" vol={0.35} />
    {/* credit */}
    <Sfx at={P(14)} name="card-beep" vol={0.45} />
    <Sfx at={P(16)} name="user-wow" vol={0.35} />
    <Sfx at={P(17) + 0.3} name="card-beep" vol={0.4} />
    <Sfx at={P(17)} name="fox-snicker" vol={0.3} />
    <Sfx at={P(17) + 0.6} name="user-money" vol={0.35} />
    <Sfx at={P(18) + 0.2} name="user-slap" vol={0.35} />
    <Sfx at={P(19) + 0.6} name="user-notif" vol={0.35} />
    <Sfx at={P(20) + 0.6} name="user-money" vol={0.3} />
    <Sfx at={P(20) + 2.3} name="user-ting" vol={0.45} />
    <Sfx at={P(21) + 0.3} name="user-wow" vol={0.35} />
    <Sfx at={P(22) + 0.5} name="user-yeah" vol={0.3} />
    <Sfx at={P(23)} name="user-pop" vol={0.4} />
    <Sfx at={P(24) + 0.8} name="user-wrong" vol={0.35} />
    <Sfx at={P(25) + 0.2} name="user-cash-register" vol={0.35} />
    <Sfx at={P(26)} name="user-timer" vol={0.35} />
    {/* real life */}
    <Sfx at={P(27) + 2.0} name="user-boom" vol={0.45} />
    <Sfx at={P(28)} name="user-ting" vol={0.35} />
    <Sfx at={P(30) + 0.4} name="user-shock" vol={0.35} />
    {/* stolen card */}
    <Sfx at={P(31) + 0.6} name="swoosh-fast" vol={0.35} />
    <Sfx at={P(33)} name="user-fahh" vol={0.4} />
    <Sfx at={P(37)} name="user-ting" vol={0.4} />
    <Sfx at={P(37) + 1.9} name="user-yeah" vol={0.35} />
    {/* wrap-up */}
    <Sfx at={P(39)} name="user-pop" vol={0.35} />
    <Sfx at={P(41) + 0.1} name="card-beep" vol={0.45} />
    <Sfx at={P(42)} name="user-boom" vol={0.35} />
    <Sfx at={P(43)} name="user-pop" vol={0.35} />
    <Sfx at={P(43) + 0.4} name="user-pop" vol={0.35} />
    <Sfx at={P(45)} name="user-ting" vol={0.35} />
  </AbsoluteFill>;
};
