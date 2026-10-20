// EP6 "Debit vs credit: same $50, very different bill" (Truth rule) — "What the difference" split hook + Hook camera rule; template = dougCashCard.tsx.
// Phrase timings: src/data/doug-debit-credit.json (Edge TTS Andrew, tightened + atempo 1.035, videos/doug-debit-credit/vo). P(i) = phrase i start.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HAND, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {BigWord, IceBank, Paper, PriceTag, Stamp, Thought} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {Fox, Puffin} from '../penguin/cast';
import {BankCard, Note, Phone, PufferJacket, Rack, WallCalendar, World} from '../penguin/props';
import TIM from '../data/doug-debit-credit.json';
import WORDS from '../data/doug-debit-credit.words.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
// W(i) = start of spoken word i (Edge TTS word boundaries mapped onto the tightened VO, videos/doug-debit-credit/vo/voice.words.json) — camera moves and pops land on the word
const W = (i: number) => WORDS[i].a;
export const DOUG_DEBIT_CREDIT_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1250, RED = '#D83A2E', GREEN = '#2E9E4F', BLUE = '#2F5DA8', GOLD = '#E2A90F';
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => { const q = cl(p); return q * q * (3 - 2 * q); };
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const DEBITW = W(8); // the word "debit..."
const CREDITW = W(13); // the word "credit?"
// Doug's right flipper tip on screen (mirrors rig.tsx flipper geometry: shoulder (300 + turn*20, 232), tip (28, 178), rotate(-flap)) so the card sits IN his flipper
const hand = (x: number, y: number, h: number, flap: number, turn = 0.55): [number, number] => {
  const k = h / 520, a = (-flap * Math.PI) / 180, tx = 28 * Math.cos(a) - 178 * Math.sin(a), ty = 28 * Math.sin(a) + 178 * Math.cos(a);
  return [x - 200 * k + (300 + turn * 20 + tx) * k, y - h + (232 + ty) * k];
};
// flipper angle: rest 62 -> tap 115 around time `at` (rises 0.3 s before, holds 0.35 s, comes back)
const tapFlap = (t: number, at: number) => 62 + 53 * (ease((t - at + 0.3) / 0.3) - ease((t - at - 0.35) / 0.3));

// ---------- money props ----------
// Cartoon $50 note: plain green bill with a big "$50" and fish (Doug-world money). No real-currency details.
const Note50 = ({w = 300}: {w?: number}) => <Note w={w} value={50} />;
const Bill = ({x, y, w = 300, rot = -4, s = 1}: {x: number; y: number; w?: number; rot?: number; s?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.2125, width: w, transform: `rotate(${rot}deg) scale(${s})`}}><Note50 w={w} /></div>;
const BillFly = ({t, x1, y1, x2, y2, a, b, w = 220, arc = 260}: {t: number; x1: number; y1: number; x2: number; y2: number; a: number; b: number; w?: number; arc?: number}) => {
  const p = ease((t - a) / (b - a));
  return <Bill x={lerp(x1, x2, p)} y={lerp(y1, y2, p) - Math.sin(p * Math.PI) * arc} w={w} rot={-4 + 10 * Math.sin(p * 6)} />;
};
// bank cards: DEBIT = green, CREDIT = gold
const CardIcon = ({w = 250, kind, rot = 0}: {w?: number; kind: 'debit' | 'credit'; rot?: number}) =>
  <div style={{width: w, transform: `rotate(${rot}deg)`}}><BankCard w={w} kind={kind} /></div>;
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
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.575}}><PufferJacket w={w} hanger={false} /></div>;
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
const Account = ({x, y, w = 300, balance, color = INK, note = 'example'}: {x: number; y: number; w?: number; balance: string; color?: string; note?: string}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.95}}><Phone w={w} balance={balance} color={color} note={note} /></div>;
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
const Calendar = ({x, y, t, a, w = 260, step = 0.25}: {x: number; y: number; t: number; a: number; w?: number; step?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w / 2}}><WallCalendar w={w} month={Math.max(0, Math.min(11, Math.floor((t - a) / step)))} /></div>;

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
  const fl = t < 0 ? 62 : tapFlap(t, w + 0.1), [hx, hy] = hand(o + 150, 1420, 410, fl);
  return <>
    {side === 'credit' && <Fox x={o + 470} y={1000 + 120 * (1 - peek)} h={300} id="hfox" pose={{smirk: false, lids: 0.3, look: -0.5}} />}
    <Puffin x={o + 445} y={1180} h={330} id={`hp${side}`} pose={react ? {look: -0.6, mouth: 0.35} : {look: -0.6, mouth: 0.15}} />
    <Counter x={o + 270} w={260} />
    <Reader x={o + 330} y={1086} w={96} t={t} beeps={[w + 0.1]} amount="$50" />
    <Penguin id={`hd${side}`} x={o + 150} y={1420} h={410} pose={react ? (side === 'debit' ? {turn: 0.55, look: [0.8, -0.2], flapR: fl, beak: 'smile', brows: 'happy'}
      : {turn: 0.55, look: [0.8, -0.3], flapR: fl, beak: 'smile', brows: 'worried', eyeScale: 1.15})
      : {turn: 0.55, look: [0.8, -0.1], flapR: fl, beak: 'flat', lids: 0.25}} />
    {/* Doug pays: the card moves from his flipper to the reader on his side's word, then taps (beep) */}
    <Card x={hx} y={hy} w={120} kind={side} rot={fl - 90} />
  </>; };
const HookSplit = ({t = -1}: {t?: number}) => <AbsoluteFill style={{background: '#fff'}}>
  <Fonts /><HandFont />
  <div style={{position: 'absolute', left: 0, top: 110, width: 1080, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontStyle: 'italic', fontSize: 96, whiteSpace: 'nowrap',
    color: INK, letterSpacing: -3, textShadow: '5px 6px 0 rgba(0,0,0,0.18)'}}>What the difference</div>
  <div style={{position: 'absolute', left: 0, top: 255, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 104, color: BLUE}}>DEBIT</div>
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

// ---------- stage (user rule 2026-10-20: never an empty white page — snowy World backdrop, a moving character in every shot, props in fixed zones) ----------
// Zones: title y 260–420 · info y 450–950 · characters stand on G (1250) · captions 1530.
const Bg = ({t, night}: {t: number; night?: boolean}) => <World g={G} t={t} night={night} />;
const Snow = ({t}: {t: number}) => <>{Array.from({length: 22}, (_, i) => <div key={i} style={{position: 'absolute', left: (i * 137) % 1080, top: ((i * 211 + t * 180) % 1400) - 100,
  width: 16, height: 16, borderRadius: '50%', background: '#fff', border: '3px solid #9CCBE6'}} />)}</>;
const ShopCounter = ({x, w, top = 1000}: {x: number; w: number; top?: number}) => <>
  <div style={{position: 'absolute', left: x, top, width: w, height: G + 20 - top, background: '#C98F55', border: `7px solid ${INK}`, borderRadius: 10,
    backgroundImage: `repeating-linear-gradient(90deg, transparent 0 52px, rgba(0,0,0,0.18) 52px 56px)`}} />
  <div style={{position: 'absolute', left: x - 14, top: top - 18, width: w + 28, height: 34, background: '#E0A96D', border: `7px solid ${INK}`, borderRadius: 8}} />
</>;
const Board = ({x = 540, y = 650, w = 860, h = 560, children}: {x?: number; y?: number; w?: number; h?: number; children?: React.ReactNode}) => <>
  {[x - w * 0.32, x + w * 0.32].map((px) => <div key={px} style={{position: 'absolute', left: px - 14, top: y + h / 2 - 10, width: 28, height: G - y - h / 2 + 20, background: '#9A6A35', border: `6px solid ${INK}`}} />)}
  <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, background: '#F4FAFD', border: `9px solid ${INK}`, borderRadius: 30, boxShadow: 'inset 0 0 0 14px #DCEFF9'}}>{children}</div>
</>;
const idle = (t: number, k = 1) => Math.sin(t * 5) * 6 * k; // small flipper motion so nobody stands frozen

// ---------- sets (one idea per shot) — script videos/doug-debit-credit/voice.txt ----------
const Intro = ({t}: {t: number}) => { const cold = t >= P(4);
  return <>
    {cold && <Snow t={t} />}
    <Penguin id="doug" x={540} y={G + 200} h={760} pose={!cold ? {beak: 'smile', brows: 'happy', flapR: 40 + 30 * Math.sin(t * 9), look: [0, 0]}
      : {brows: 'worried', beak: 'frown', tremble: 0.9, flapL: 8, flapR: 8, look: [0.5, -0.6]}} />
    <Thought x={760} y={480} w={430} tx={640} ty={700} at={P(4) + 0.1}><div /></Thought>
    {cold && <div style={{position: 'absolute', left: 760 - 95, top: 480 - 120, transform: `scale(${Math.min(1, (t - P(4) - 0.1) / 0.25)})`}}><PufferJacket w={190} hanger={false} /></div>}
    {cold && <BigWord text="brrr" x={230} y={560} at={P(4) + 0.2} size={110} color={BLUE} />}
  </>; };
const Shop = ({t}: {t: number}) => <>
  <NameTag x={540} y={300} text="PUFFIN COATS" color={RED} />
  <Rack x={500} y={G + 20} w={420}>
    <div style={{position: 'absolute', left: 210 - 140, top: 6}}><PufferJacket w={280} /></div>
  </Rack>
  {t >= W(28) && <div style={{position: 'absolute', left: 700, top: 560, transform: `rotate(8deg) scale(${Math.min(1, (t - W(28)) / 0.15)})`, transformOrigin: '0 0'}}>
    <div style={{background: '#FFF8DC', border: `6px solid ${INK}`, borderRadius: 14, padding: '8px 22px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color: RED}}>$50</div></div>}
  <Puffin x={870} y={G + 60} h={480} pose={{look: -0.5, mouth: t >= P(5) ? 0.3 : 0.1, flap: 20 + 20 * Math.sin(t * 6)}} />
  <Penguin id="doug" x={190} y={G + 80} h={420} pose={{turn: 0.5, look: [0.8, -0.5], brows: 'happy', beak: 'smile', eyeScale: 1.15, flapR: 10 + idle(t)}} />
</>;
const PayScene = ({t, kind, beep, outfit}: {t: number; kind: 'debit' | 'credit'; beep: number; outfit?: 'jacket'}) => {
  const fl = tapFlap(t, beep), [hx, hy] = hand(330, G + 60, 560, fl, 0.5);
  return <>
    <Puffin x={790} y={1090} h={460} pose={{look: -0.5, mouth: t >= beep ? 0.35 : 0.1}} />
    <ShopCounter x={560} w={380} />
    <Reader x={630} y={1000} w={150} t={t} beeps={[beep]} />
    <Penguin id="doug" x={330} y={G + 60} h={560} outfit={outfit} pose={{turn: 0.5, look: [0.8, -0.3], beak: 'smile', flapR: fl, flapL: 6 + idle(t)}} />
    <Card x={hx} y={hy} w={170} kind={kind} rot={fl - 90} />
  </>; };
const PayDebit = ({t}: {t: number}) => <>
  <PayScene t={t} kind="debit" beep={P(8)} />
  <Stamp text="DEBIT" x={540} y={330} at={W(32)} color={BLUE} size={110} />
</>;
const LeaveAccount = ({t}: {t: number}) => { const a = W(39), out = t >= a + 0.6;
  return <>
    <Account x={540} y={640} w={300} balance={out ? '$70' : '$120'} color={out ? INK : GREEN} />
    <BillFly t={t} x1={540} y1={700} x2={880} y2={G - 420} a={a} b={a + 0.7} w={210} />
    <Puffin x={890} y={G + 60} h={440} pose={{look: -0.5, mouth: out ? 0.35 : 0.1, flap: out ? 30 + 20 * Math.sin(t * 8) : 0}} />
    <Penguin id="doug" x={190} y={G + 60} h={460} pose={{turn: 0.4, look: [0.8, -0.6], beak: 'flat', flapR: 30 + idle(t)}} />
    {t >= P(10) && <Stamp text="RIGHT NOW" x={540} y={290} at={P(10)} color={RED} size={90} />}
  </>; };
const Done = ({t}: {t: number}) => <>
  <Penguin id="doug" x={540} y={G + 200} h={760} outfit="jacket" pose={{beak: 'smile', brows: 'happy', flapR: 60 + idle(t, 2), flapL: 60 - idle(t, 2), hop: Math.max(0, 25 * Math.sin((t - P(11)) * 8))}} />
  <Check x={850} y={470} at={P(11)} t={t} />
  {t >= W(45) && <BigWord text="simple" x={540} y={380} at={W(45)} size={120} color={GREEN} />}
</>;
const PayCredit = ({t}: {t: number}) => <>
  <Snow t={t} />
  <PayScene t={t} kind="credit" beep={P(14)} outfit="jacket" />
  <NameTag x={540} y={320} text="NEXT WINTER" color={BLUE} size={64} />
</>;
const StillFull = ({t}: {t: number}) => <>
  <Account x={660} y={700} w={290} balance="$120" color={GREEN} />
  {t < W(56) && <BigWord text="?" x={900} y={380} at={P(15)} size={160} />}
  {t >= W(56) && <Stamp text="STILL FULL" x={620} y={250} at={W(56)} color={GREEN} size={90} />}
  <Penguin id="doug" x={230} y={G + 60} h={540} outfit="jacket" pose={{turn: 0.4, brows: 'happy', beak: 'smile', look: [0.8, -0.5], flapR: 40 + idle(t), hop: t >= W(56) ? Math.max(0, 20 * Math.sin((t - W(56)) * 9)) : 0}} />
</>;
const FoxPays = ({t}: {t: number}) => { const a = W(62), fl = tapFlap(t, W(61)), [hx, hy] = hand(200, G + 60, 480, fl, 0.5);
  return <>
    <NameTag x={540} y={300} text="FOX THE BANKER" color="#26324A" />
    <Small x={540} y={390} text="pays Puffin for Doug" size={50} color={INK} />
    <Penguin id="doug" x={200} y={G + 60} h={480} outfit="jacket" pose={{turn: 0.5, look: [0.8, -0.2], beak: 'smile', flapR: fl}} />
    <Reader x={440} y={1010} w={130} t={t} beeps={[W(61)]} />
    <Card x={hx} y={hy} w={140} kind="credit" rot={fl - 90} />
    <Fox x={650} y={G + 60} h={500} pose={{smirk: false, lids: 0.3, look: 0.5, flap: t >= a ? 30 : 0}} />
    <BillFly t={t} x1={680} y1={G - 420} x2={900} y2={G - 380} a={a} b={a + 0.7} w={200} arc={140} />
    <Puffin x={920} y={G + 60} h={420} pose={{look: -0.5, mouth: t >= a + 0.7 ? 0.35 : 0.1}} />
  </>; };
const Owe = ({t}: {t: number}) => <>
  <Paper x={540} y={580} w={380} title="DOUG OWES FOX" amount="$50" at={W(67)} rot={-3} id="iou" />
  <Penguin id="doug" x={250} y={G + 60} h={540} outfit="jacket" pose={{turn: 0.5, look: [0.8, -0.4], brows: 'worried', beak: 'frown', flapR: 10 + idle(t)}} />
  <Fox x={830} y={G + 60} h={540} pose={{smirk: true, lids: 0.25, look: -0.5, flap: 20 + idle(t, 2)}} />
</>;
const BillCome = ({t}: {t: number}) => { const p = ease((t - W(75) + 0.25) / 0.4);
  return <>
    <Calendar x={830} y={540} t={t} a={W(71)} w={250} step={0.6} />
    <Small x={830} y={700} text="1 month later" size={46} color={INK} />
    <div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${(1 - p) * -700}px)`}}>
      <Paper x={380} y={560} w={320} title="CARD BILL" amount="$50" at={W(75) - 0.25} rot={4} id="bill" /></div>
    <Penguin id="doug" x={380} y={G + 60} h={520} outfit="jacket" pose={{brows: 'worried', look: [0, -0.9], flapR: 50 + idle(t), flapL: 50 - idle(t)}} />
  </>; };
const PayFull = ({t}: {t: number}) => { const a = W(80);
  return <>
    <Small x={540} y={330} text="all $50, on time" size={60} color={INK} />
    {t >= W(86) && <Big x={540} y={520} text="INTEREST: $0" size={100} color={GREEN} />}
    <Penguin id="doug" x={250} y={G + 60} h={540} outfit="jacket" pose={{turn: 0.5, look: [0.8, -0.2], beak: 'smile', brows: 'happy', flapR: t < a + 0.4 ? 70 : 30 + idle(t)}} />
    <Fox x={830} y={G + 60} h={540} pose={{smirk: false, lids: 0.3, look: -0.5}} />
    <BillFly t={t} x1={420} y1={G - 330} x2={760} y2={G - 420} a={a} b={a + 0.7} w={200} />
  </>; };
const Points = ({t}: {t: number}) => <>
  <PriceTag x={300} y={430} price="+points" fish="rewards" at={W(90)} color={GREEN} size={0.9} />
  {t >= P(22) && <><Gauge x={790} y={700} t={t} a={W(96)} w={440} /><Small x={790} y={740} text="credit score can go up" size={42} color={INK} /></>}
  <Penguin id="doug" x={280} y={G + 60} h={580} outfit="jacket" pose={{beak: 'smile', brows: 'happy', flapR: 70 + idle(t, 2), turn: 0.3, hop: t >= W(90) ? Math.max(0, 18 * Math.sin((t - W(90)) * 9)) : 0}} />
</>;
const Smart = ({t}: {t: number}) => <>
  <Penguin id="doug" x={540} y={G + 300} h={950} outfit="jacket" pose={{beak: 'smile', brows: 'happy', lids: 0.2, look: [0, 0], flapR: 20 + idle(t), flapL: 20 - idle(t)}} />
  <svg width={420} height={120} viewBox="0 0 420 120" style={{position: 'absolute', left: 330, top: 690}}>
    <circle cx={110} cy={60} r={50} fill="rgba(255,255,255,0.3)" stroke={INK} strokeWidth={12} /><circle cx={310} cy={60} r={50} fill="rgba(255,255,255,0.3)" stroke={INK} strokeWidth={12} />
    <path d="M160 60 L260 60" stroke={INK} strokeWidth={12} /></svg>
</>;
const PayLittle = ({t}: {t: number}) => <>
  <Paper x={540} y={540} w={340} title="STILL OWE" amount="most of it" at={W(106) + 0.4} rot={-4} id="owe2" />
  <Penguin id="doug" x={250} y={G + 60} h={540} outfit="jacket" pose={{turn: 0.5, look: [0.8, -0.2], brows: 'worried', beak: 'flat', flapR: 40 + idle(t)}} />
  <Fox x={830} y={G + 60} h={540} pose={{smirk: true, lids: 0.3, look: -0.5}} />
  <Coin x={lerp(420, 760, ease((t - W(106)) / 0.5))} y={G - 380} text="a bit" w={130} />
</>;
const Interest = ({t}: {t: number}) => { const n = Math.max(0, Math.min(6, Math.floor((t - W(109)) / 0.25)));
  return <>
    <Stamp text="+ INTEREST" x={540} y={300} at={W(109)} color={RED} size={100} />
    <Paper x={700} y={620} w={320} title="DOUG'S BILL" amount="$50" at={-1} rot={3} id="b3" />
    {Array.from({length: n}, (_, i) => <div key={i} style={{position: 'absolute', left: 870 + (i % 2) * 54, top: 760 - i * 64, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: RED}}>+</div>)}
    {t >= W(110) && <Calendar x={330} y={560} t={t} a={W(110)} w={220} />}
    <Fox x={230} y={G + 60} h={480} flip pose={{smirk: false, lids: 0.3, look: 0.5, flap: 20 + idle(t, 2)}} />
    <Penguin id="doug" x={860} y={G + 60} h={420} outfit="jacket" pose={{brows: 'worried', beak: 'frown', sweat: true, look: [-0.6, -0.6], tremble: 0.4}} />
  </>; };
const RealLife = ({t}: {t: number}) => { const n = Math.round(22 * ease((t - W(121)) / 0.5));
  return <>
    <Board y={640} h={600}>
      <div style={{position: 'absolute', left: 0, top: 50, width: '100%', textAlign: 'center'}}><NameTag x={430} y={20} text="IN REAL LIFE · USA" color={BLUE} /></div>
      <div style={{position: 'absolute', left: 0, top: 130, width: '100%', textAlign: 'center', fontFamily: HAND, fontSize: 54, color: INK}}>average credit card interest</div>
      <div style={{position: 'absolute', left: 0, top: 200, width: '100%', textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 230, color: RED, opacity: t >= W(121) ? 1 : 0}}>~{n}%</div>
      <div style={{position: 'absolute', left: 0, top: 470, width: '100%', textAlign: 'center', fontFamily: HAND, fontSize: 60, color: INK}}>a year</div>
    </Board>
    <Penguin id="doug" x={150} y={G + 80} h={380} outfit="jacket" pose={t >= W(121) ? {brows: 'shock', eyeScale: 1.3, look: [0.6, -0.8], mouth: 0.5, flapR: 70, flapL: 70} : {look: [0.6, -0.8], flapR: 10 + idle(t)}} />
    <Fox x={930} y={G + 80} h={380} pose={{smirk: true, lids: 0.3, look: -0.6}} />
  </>; };
const FedData = ({t}: {t: number}) => <>
  <Paper x={540} y={560} w={400} title="FEDERAL RESERVE" amount="22%" at={P(28)} rot={-3} id="fed" />
  <Small x={540} y={845} text="source: Federal Reserve G.19, 2026" size={38} />
  <Penguin id="doug" x={160} y={G + 60} h={440} outfit="jacket" pose={{brows: 'shock', eyeScale: 1.2, look: [0.8, -0.5], flapR: 30 + idle(t)}} />
  <Fox x={920} y={G + 60} h={440} pose={{smirk: false, lids: 0.3, look: -0.5, flap: 20}} />
</>;
const OneYear = ({t}: {t: number}) => <>
  <Small x={540} y={290} text="$50 not paid back for 1 year" size={56} color={INK} />
  <Bill x={330} y={540} w={400} rot={-4} />
  <Calendar x={810} y={540} t={t} a={P(29) + 0.2} w={240} step={0.12} />
  {t >= W(139) && <Big x={540} y={820} text="+$11 EXTRA" size={130} color={RED} />}
  {t >= W(139) && <Small x={540} y={910} text="about 22% a year (example)" size={42} />}
  <Fox x={190} y={G + 80} h={360} flip pose={{smirk: true, lids: 0.3, look: 0.5}} />
  <Penguin id="doug" x={890} y={G + 80} h={360} outfit="jacket" pose={t >= W(139) ? {brows: 'shock', eyeScale: 1.3, mouth: 0.5, look: [-0.6, -0.7], tremble: 0.5} : {brows: 'worried', look: [-0.6, -0.7]}} />
</>;
const Steal = ({t}: {t: number}) => { const run = ease((t - W(145)) / 1.0);
  return <>
    <Bg t={t} night />
    <div style={{position: 'absolute', left: 820, top: 220, width: 140, height: 140, borderRadius: '50%', background: '#F7E9A8', boxShadow: '0 0 60px #F7E9A8'}} />
    <Penguin id="doug" x={480} y={G + 40} h={380} pose={{lie: 1, lids: 1}} />
    <BigWord text="zzz" x={360} y={760} at={-1} size={80} color="#fff" />
    <Stoat x={lerp(700, 1250, run)} y={G + 40} h={380} t={t} />
    <Card x={lerp(780, 1330, run)} y={G - 120} w={130} kind="debit" rot={-10} />
  </>; };
const DebitStolen = ({t}: {t: number}) => { const gone = t >= W(153);
  return <>
    <NameTag x={540} y={300} text="WITH DEBIT" color={BLUE} />
    <Account x={540} y={650} w={290} balance={gone ? '$0' : '$120'} color={gone ? RED : GREEN} note="Doug's own money" />
    {t >= W(154) && <><IceBank x={880} y={G + 20} w={300} /><BigWord text="waiting..." x={860} y={900} at={W(154)} size={70} /></>}
    <Penguin id="doug" x={190} y={G + 60} h={480} outfit="jacket" pose={gone ? {brows: 'worried', beak: 'frown', tears: true, sweat: true, look: [0.7, -0.5], flapR: 10 + idle(t)} : {brows: 'worried', look: [0.7, -0.5]}} />
  </>; };
const CreditStolen = ({t}: {t: number}) => <>
  <NameTag x={540} y={300} text="WITH CREDIT" color={GOLD} />
  {t >= W(163) && <Small x={260} y={560} text="Fox's money" size={56} color={INK} />}
  {t >= P(37) && <div style={{position: 'absolute', left: 680, top: 420}}><Shield s={1.3} /></div>}
  {t >= W(169) && <Big x={770} y={760} text="$50 MAX" size={110} color={GREEN} />}
  {t >= W(172) && <Big x={770} y={880} text="usually $0" size={76} color={INK} />}
  {t >= P(37) && <Small x={770} y={950} text="Fair Credit Billing Act" size={40} />}
  <Fox x={260} y={G + 60} h={500} flip pose={{smirk: false, lids: 0.3, look: 0.5, flap: 20 + idle(t)}} />
  <Penguin id="doug" x={740} y={G + 80} h={300} outfit="jacket" pose={t >= W(172) ? {brows: 'happy', beak: 'smile', flapR: 60, flapL: 60, hop: Math.max(0, 16 * Math.sin((t - W(172)) * 9))} : {brows: 'worried', look: [-0.6, -0.3]}} />
</>;
const Summary = ({t}: {t: number}) => { const right = t >= W(181);
  return <>
    <div style={{position: 'absolute', left: 0, top: 300, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color: BLUE}}>DEBIT</div>
    <div style={{position: 'absolute', left: 540, top: 300, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color: GOLD}}>CREDIT</div>
    <div style={{position: 'absolute', left: 536, top: 300, width: 8, height: 640, background: INK, borderRadius: 4}} />
    <Card x={270} y={560} w={300} kind="debit" rot={-5} />
    <Card x={810} y={560} w={300} kind="credit" rot={5} />
    <Big x={270} y={790} text="your money" size={58} color={INK} />
    {right && <Big x={810} y={790} text="you borrow" size={58} color={INK} />}
    {t >= W(184) && <Big x={810} y={870} text="+ points + protection" size={40} color={GREEN} />}
    {t >= W(187) && <Big x={810} y={940} text="pay in full!" size={56} color={RED} />}
    <Penguin id="doug" x={540} y={G + 80} h={340} outfit="jacket" pose={{turn: right ? 0.5 : -0.5, look: [right ? 0.8 : -0.8, -0.4], beak: 'smile', flapR: right ? 80 : 10, flapL: right ? 10 : 80}} />
  </>; };
const SameBeep = ({t}: {t: number}) => <>
  <Card x={290} y={400} w={220} kind="debit" rot={-6} />
  <Card x={790} y={400} w={220} kind="credit" rot={6} />
  <Reader x={290} y={860} w={200} t={t} beeps={[W(193)]} />
  <Reader x={790} y={860} w={200} t={t} beeps={[W(193)]} />
  {t >= W(196) && <><Paper x={290} y={1050} w={240} title="BILL" amount="$50" at={W(196)} rot={-3} id="sb1" />
    <Paper x={790} y={1050} w={240} title="BILL" amount="$50 + ?" at={W(196) + 0.15} rot={3} id="sb2" /></>}
  <Penguin id="doug" x={540} y={G + 80} h={360} outfit="jacket" pose={{look: [Math.sin(t * 4) * 0.8, -0.3], brows: t >= W(196) ? 'worried' : 'happy', beak: 'smile', flapR: 20 + idle(t), flapL: 20 - idle(t)}} />
</>;
const Choice = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 60, top: 340, width: 440, padding: 24, border: `7px solid ${INK}`, borderRadius: 26, background: '#EAF2FA', textAlign: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, lineHeight: 1.15, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>DEBIT<CardIcon w={260} kind="debit" /></div>
  {t >= W(199) && <div style={{position: 'absolute', left: 580, top: 340, width: 440, padding: 24, border: `7px solid ${INK}`, borderRadius: 26, background: '#FBF1D6', textAlign: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, lineHeight: 1.15, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>CREDIT<CardIcon w={260} kind="credit" /></div>}
  <Penguin id="doug" x={540} y={G + 140} h={560} outfit="jacket" pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.2, 0.6], brows: 'happy'}} />
  {t >= P(45) && <BigWord text="👇" x={880} y={1080} at={P(45)} size={140} />}
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx; world?: boolean};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <HookSplit t={t} />},
  {at: P(3), set: (t) => <Intro t={t} />, fx_: 'zoom', world: true},
  {at: P(5), set: (t) => <Shop t={t} />, fx_: 'swipe', world: true},
  {at: P(7), set: (t) => <PayDebit t={t} />, fx_: 'pop', world: true},
  {at: P(9), set: (t) => <LeaveAccount t={t} />, fx_: 'swipeL', world: true},
  {at: P(11), set: (t) => <Done t={t} />, fx_: 'zoom', world: true},
  {at: P(13), set: (t) => <PayCredit t={t} />, fx_: 'iris', world: true},
  {at: P(15), set: (t) => <StillFull t={t} />, fx_: 'pop', world: true},
  {at: P(17), set: (t) => <FoxPays t={t} />, fx_: 'swipe', world: true},
  {at: P(18), set: (t) => <Owe t={t} />, fx_: 'zoom', world: true},
  {at: P(19), set: (t) => <BillCome t={t} />, fx_: 'swipeL', world: true},
  {at: P(20), set: (t) => <PayFull t={t} />, fx_: 'pop', world: true},
  {at: P(21), set: (t) => <Points t={t} />, fx_: 'swipe', world: true},
  {at: P(23), set: (t) => <Smart t={t} />, fx_: 'zoom', world: true},
  {at: P(24), set: (t) => <PayLittle t={t} />, fx_: 'swipeL', world: true},
  {at: P(25), set: (t) => <Interest t={t} />, fx_: 'pop', world: true},
  {at: P(27), set: (t) => <RealLife t={t} />, fx_: 'iris', world: true},
  {at: P(28), set: (t) => <FedData t={t} />, fx_: 'swipe', world: true},
  {at: P(29), set: (t) => <OneYear t={t} />, fx_: 'zoom', world: true},
  {at: P(31), set: (t) => <Steal t={t} />, fx_: 'iris'},
  {at: P(32), set: (t) => <DebitStolen t={t} />, fx_: 'swipe', world: true},
  {at: P(35), set: (t) => <CreditStolen t={t} />, fx_: 'swipeL', world: true},
  {at: P(38), set: (t) => <Summary t={t} />, fx_: 'pop', world: true},
  {at: P(41), set: (t) => <SameBeep t={t} />, fx_: 'zoom', world: true},
  {at: P(43), set: (t) => <Choice t={t} />, fx_: 'pop', world: true},
];
// deep zooms on the spoken word [from, to, focusX, focusY, scale]
const DEEP: [number, number, number, number, number][] = [
  // kept gentle (<= 1.15, near centre) so the whole scene stays readable — characters never cropped out
  [W(28), E(6), 600, 820, 1.1], [W(56), E(16), 520, 760, 1.1], [W(86), E(20), 540, 760, 1.12],
  [W(121), E(27), 540, 800, 1.08], [W(139), E(30), 540, 800, 1.1], [W(153), E(33), 520, 760, 1.12],
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
  const dz = DEEP.find(([a, b]) => tc >= a - 0.08 && tc < b + 0.15), dp = dz ? ease((tc - dz[0] + 0.08) / 0.22) : 0;
  const s = (dz ? s0 + (dz[4] - s0) * dp : s0) * beat(tc, TIM);
  if (dz) { fx += (dz[2] - fx) * dp; fy += (dz[3] - fy) * dp; }
  const shk = (a: number) => tc > a && tc < a + 0.25 ? Math.sin(tc * 90) * 8 * (1 - (tc - a) / 0.25) : 0;
  const shake = shk(W(121)) + shk(W(153));
  const quiet = BIGS.some((b) => tc >= b.at && tc < b.until) || QUIET.some(([a, b]) => tc >= a && tc < b);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s + shake}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>
        {sh.world && <Bg t={t} />}
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
    <Sfx at={W(39)} name="user-money-transfer" vol={0.35} />
    <Sfx at={W(42)} name="user-ting" vol={0.4} />
    <Sfx at={P(11)} name="user-yeah" vol={0.35} />
    {/* credit */}
    <Sfx at={P(14)} name="card-beep" vol={0.45} />
    <Sfx at={W(56)} name="user-wow" vol={0.35} />
    <Sfx at={W(61)} name="card-beep" vol={0.4} />
    <Sfx at={P(17)} name="fox-snicker" vol={0.3} />
    <Sfx at={W(62)} name="user-money" vol={0.35} />
    <Sfx at={W(67)} name="user-slap" vol={0.35} />
    <Sfx at={W(75)} name="user-notif" vol={0.35} />
    <Sfx at={W(80)} name="user-money" vol={0.3} />
    <Sfx at={W(86)} name="user-ting" vol={0.45} />
    <Sfx at={W(90)} name="user-wow" vol={0.35} />
    <Sfx at={W(96)} name="user-yeah" vol={0.3} />
    <Sfx at={P(23)} name="user-pop" vol={0.4} />
    <Sfx at={W(106) + 0.4} name="user-wrong" vol={0.35} />
    <Sfx at={W(109)} name="user-cash-register" vol={0.35} />
    <Sfx at={W(110)} name="user-timer" vol={0.35} />
    {/* real life */}
    <Sfx at={W(121)} name="user-boom" vol={0.45} />
    <Sfx at={P(28)} name="user-ting" vol={0.35} />
    <Sfx at={W(139)} name="user-shock" vol={0.35} />
    {/* stolen card */}
    <Sfx at={W(145)} name="swoosh-fast" vol={0.35} />
    <Sfx at={W(153)} name="user-fahh" vol={0.4} />
    <Sfx at={W(169)} name="user-ting" vol={0.4} />
    <Sfx at={W(172)} name="user-yeah" vol={0.35} />
    {/* wrap-up */}
    <Sfx at={W(183)} name="user-pop" vol={0.35} />
    <Sfx at={W(193)} name="card-beep" vol={0.45} />
    <Sfx at={W(196)} name="user-boom" vol={0.35} />
    <Sfx at={P(43)} name="user-pop" vol={0.35} />
    <Sfx at={P(43) + 0.4} name="user-pop" vol={0.35} />
    <Sfx at={P(45)} name="user-ting" vol={0.35} />
  </AbsoluteFill>;
};
