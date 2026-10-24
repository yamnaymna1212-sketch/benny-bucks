// EP10 "How Poor vs Rich Doug use debt" — hook in the user's reference style (big title, POOR red / RICH green,
// both sides = Doug, VERSUS pole in the middle, -$1,800 under poor, PAID +$3,000 under rich, all visible from frame 0).
// Kept clean on purpose (user, 2026-10-24): tinted halves, no extra props. Line timings: studio/src/data/doug-debt.json.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HAND, HandFont} from '../base';
import {Fish, INK, Penguin, onTwos} from '../penguin/rig';
import {BigWord, FishFlight, FishPile, Paper, Stamp, Title} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {Fox} from './dougLaundering';
import TIM from '../data/doug-debt.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_DEBT_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1170;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const RED = '#D83A2E', GREEN = '#2E9E4F', CARD = '#7C6FD6';
// hook beats: "poor Doug lose 1,800" -> push left; "rich Doug get paid 3,000" -> push right; "Same card" -> both
const POOR_AT = 0.9, RICH_AT = P(1) + 0.15, BOTH_AT = P(2);

// ---------- hook ----------
const Word = ({text, color = INK, size}: {text: string; color?: string; size: number}) =>
  <span style={{color, WebkitTextStroke: `${size * 0.03}px ${color}`}}>{text}</span>;

// Big title, fully visible on frame 0 (TikTok thumbnail).
const HookTitle = () =>
  <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: HAND, fontWeight: 700, color: INK, whiteSpace: 'nowrap'}}>
    <div style={{fontSize: 92, lineHeight: '112px'}}><Word text="HOW " size={92} /><Word text="POOR" color={RED} size={92} /><Word text=" VS " size={92} /><Word text="RICH" color={GREEN} size={92} /></div>
    <div style={{fontSize: 124, lineHeight: '140px'}}><Word text="DOUG USE " size={124} /><Word text="DEBT" color={RED} size={124} /></div>
  </div>;

// Side label (POOR / RICH) with a hand-drawn underline; pulses once when that side is named.
const SideLabel = ({text, x, y, color, t, at}: {text: string; x: number; y: number; color: string; t: number; at: number}) => {
  const k = t >= at && t < at + 0.25 ? 1 + 0.15 * Math.sin(((t - at) / 0.25) * Math.PI) : 1;
  return <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', transform: `scale(${k}) rotate(-3deg)`}}>
    <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 130, lineHeight: '130px', color, WebkitTextStroke: `5px ${color}`, letterSpacing: 4}}>{text}</div>
    <svg width={400} height={40} viewBox="0 0 400 40"><path d="M20 22 Q 120 34, 210 20 T 380 18" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" /></svg>
  </div>;
};

// Credit card (same purple card on both sides = same card).
const Card = ({x, y, w = 230, rot = -4, shake = 0, t = 0}: {x: number; y: number; w?: number; rot?: number; shake?: number; t?: number}) =>
  <svg width={w} height={w * 0.635} viewBox="0 0 230 146" style={{position: 'absolute', left: x - w / 2 + Math.sin(t * 60) * shake, top: y - w * 0.3175, overflow: 'visible', transform: `rotate(${rot}deg)`}}>
    <rect x={4} y={4} width={222} height={138} rx={18} fill={CARD} stroke={INK} strokeWidth={7} />
    <rect x={26} y={40} width={44} height={34} rx={6} fill="#F5C518" stroke={INK} strokeWidth={4} />
    <path d="M26 57 L70 57 M48 40 L48 74" stroke={INK} strokeWidth={3} />
    <circle cx={176} cy={34} r={14} fill={RED} stroke={INK} strokeWidth={3} /><circle cx={196} cy={34} r={14} fill="#F5A623" stroke={INK} strokeWidth={3} />
    <path d="M26 108 L200 108" stroke="#fff" strokeWidth={6} strokeDasharray="14 10" strokeLinecap="round" />
  </svg>;

// Red/white striped ice pole with VERSUS across it.
const VersusPole = ({x, y}: {x: number; y: number}) => <>
  <svg width={90} height={560} viewBox="0 0 90 560" style={{position: 'absolute', left: x - 45, top: y - 280, overflow: 'visible'}}>
    <defs><clipPath id="pole"><rect x={18} y={36} width={54} height={488} rx={27} /></clipPath></defs>
    <rect x={18} y={36} width={54} height={488} rx={27} fill="#fff" />
    <g clipPath="url(#pole)">{Array.from({length: 12}, (_, i) => <path key={i} d={`M0 ${i * 56} L90 ${i * 56 - 50} L90 ${i * 56 - 26} L0 ${i * 56 + 24} Z`} fill={RED} />)}</g>
    <rect x={18} y={36} width={54} height={488} rx={27} fill="none" stroke={INK} strokeWidth={6} />
    <rect x={8} y={8} width={74} height={36} rx={16} fill="#CFE6F3" stroke={INK} strokeWidth={6} />
    <rect x={8} y={516} width={74} height={36} rx={16} fill="#CFE6F3" stroke={INK} strokeWidth={6} />
  </svg>
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%) rotate(-4deg)', fontFamily: 'Montserrat', fontWeight: 900, fontStyle: 'italic',
    fontSize: 60, color: INK, WebkitTextStroke: '9px #fff', paintOrder: 'stroke fill'}}>VERSUS</div>
</>;

// Big number, visible from frame 0; punches when its side is named.
const Amount = ({text, x, y, color, t, at, size = 150}: {text: string; x: number; y: number; color: string; t: number; at: number; size?: number}) => {
  const d = t - at, k = d >= 0 && d < 0.3 ? 1 + 0.25 * Math.sin((d / 0.3) * Math.PI) : 1;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(-5deg) scale(${k})`, fontFamily: HAND, fontWeight: 700, fontSize: size, lineHeight: 1,
    color, WebkitTextStroke: `${size * 0.02}px ${color}`, letterSpacing: 8, whiteSpace: 'nowrap'}}>{text}</div>;
};

const Paid = ({x, y, t, at}: {x: number; y: number; t: number; at: number}) => {
  const d = t - at, s = d >= 0 && d < 0.14 ? 1.9 - 0.9 * (d / 0.14) : 1;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(-10deg) scale(${s})`, border: `9px solid ${GREEN}`, borderRadius: 16, padding: '0 26px',
    fontFamily: HAND, fontWeight: 700, fontSize: 92, lineHeight: '110px', color: GREEN, letterSpacing: 6, background: 'rgba(255,255,255,0.85)'}}>PAID</div>;
};

const Ground = ({tint}: {tint?: boolean}) => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 900, background: tint ? 'transparent' : '#E4F4FC', borderTop: `5px solid ${INK}`}} />;

const Hook = ({t}: {t: number}) => {
  const poorHot = t >= POOR_AT && t < RICH_AT, richHot = t >= RICH_AT && t < BOTH_AT, same = t >= BOTH_AT;
  const bump = same ? Math.abs(Math.sin((t - BOTH_AT) * 7)) * 14 * Math.exp(-(t - BOTH_AT) * 2) : 0;
  return <>
    {/* tinted halves: the contrast reads before any word */}
    <div style={{position: 'absolute', left: -400, top: -400, width: 940, height: 2800, background: '#FDECEA'}} />
    <div style={{position: 'absolute', left: 540, top: -400, width: 940, height: 2800, background: '#E7F6EC'}} />
    <Ground tint />
    <HookTitle />
    <SideLabel text="POOR" x={250} y={420} color={RED} t={t} at={POOR_AT} />
    <SideLabel text="RICH" x={830} y={420} color={GREEN} t={t} at={RICH_AT} />
    <Penguin id="poor" x={240} y={G} h={430} pose={{turn: 0.25, look: [0.3, -0.2], brows: poorHot ? 'shock' : 'worried', eyeScale: poorHot ? 1.25 : 1.05, pupil: poorHot ? 0.55 : 1,
      beak: 'frown', tremble: poorHot ? 1 : 0, flapL: 30, flapR: 30}} />
    <Card x={240} y={G - 100 - bump} t={t} shake={poorHot ? 4 : 0} />
    <Penguin id="rich" x={840} y={G} h={430} outfit="rich" pose={{turn: -0.25, look: [-0.3, -0.2], brows: 'happy', beak: 'smile',
      flapL: richHot ? 120 + Math.sin(t * 9) * 12 : 30, flapR: richHot ? 120 + Math.sin(t * 9 + 1) * 12 : 30}} />
    <Card x={840} y={G - 100 - bump} />
    <VersusPole x={540} y={G - 280} />
    <Amount text="-$1,800" x={270} y={G + 245} color={RED} t={t} at={POOR_AT} size={140} />
    <Paid x={820} y={G + 110} t={t} at={RICH_AT} />
    <Amount text="+$3,000" x={820} y={G + 250} color={GREEN} t={t} at={RICH_AT} size={120} />
  </>;
};

// ---------- props ----------
const Tv = ({x, y, w = 300}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={w * 0.8} viewBox="0 0 300 240" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.8, overflow: 'visible'}}>
    <rect x={10} y={10} width={280} height={170} rx={14} fill="#2B2F36" stroke={INK} strokeWidth={8} />
    <rect x={28} y={28} width={244} height={134} rx={6} fill="#6EC6F2" />
    <path d="M40 140 L110 80 L160 120 L200 90 L262 140 Z" fill="#fff" opacity={0.7} />
    <path d="M150 180 L150 215 M90 225 L210 225" stroke={INK} strokeWidth={10} strokeLinecap="round" />
  </svg>;
const Sled = ({x, y, w = 260}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={w * 0.45} viewBox="0 0 260 117" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.45, overflow: 'visible'}}>
    <path d="M10 105 L230 105 Q258 105 250 80" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
    <path d="M40 105 L40 80 M200 105 L200 80" stroke={INK} strokeWidth={8} />
    <rect x={20} y={40} width={220} height={42} rx={12} fill="#D83A2E" stroke={INK} strokeWidth={6} />
  </svg>;
const Box = ({x, y, w = 150, c = '#E3B97A'}: {x: number; y: number; w?: number; c?: string}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.8, width: w, height: w * 0.8, background: c, border: `6px solid ${INK}`, borderRadius: 8, boxSizing: 'border-box'}}>
    <div style={{position: 'absolute', left: '45%', width: '10%', top: 0, bottom: 0, background: 'rgba(0,0,0,0.15)'}} /></div>;
// Pops a child in at `at` (scale from 0 with a little overshoot).
const Pop = ({at, t, x, y, children}: {at: number; t: number; x: number; y: number; children: React.ReactNode}) => {
  const p = ease((t - at) / 0.2); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: 0, top: 0, transform: `scale(${p})`, transformOrigin: `${x}px ${y}px`}}>{children}</div>;
};
// DEBT snowball: grows with `size`, rolls a little.
const Snowball = ({x, y, size, t}: {x: number; y: number; size: number; t: number}) =>
  <div style={{position: 'absolute', left: x - size / 2, top: y - size, width: size, height: size, borderRadius: '50%', background: '#F4FAFD', border: `8px solid ${INK}`, boxSizing: 'border-box',
    display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${Math.sin(t * 3) * 4}deg)`, boxShadow: 'inset -30px -30px 0 rgba(150,190,215,0.35)'}}>
    <span style={{fontFamily: HAND, fontWeight: 700, fontSize: size * 0.24, color: RED}}>DEBT</span></div>;
// Hand-written note line (small label).
const Note = ({text, x, y, size = 60, color = INK, at = -99, t}: {text: string; x: number; y: number; size?: number; color?: string; at?: number; t: number}) => {
  const p = ease((t - at) / 0.2); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${p})`, fontFamily: HAND, fontWeight: 700, fontSize: size, color, whiteSpace: 'nowrap'}}>{text}</div>;
};
// Food / gas / plane icons as plain emoji tiles.
const Tile = ({icon, label, x, y, at, t}: {icon: string; label: string; x: number; y: number; at: number; t: number}) => {
  const p = ease((t - at) / 0.2); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x - 130, top: y - 130, width: 260, height: 260, background: '#fff', border: `7px solid ${INK}`, borderRadius: 30, textAlign: 'center', transform: `scale(${p}) rotate(${(x % 3) - 1}deg)`}}>
    <div style={{fontSize: 120, lineHeight: '170px'}}>{icon}</div>
    <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 50, marginTop: -20}}>{label}</div></div>;
};
const Arrow = ({x1, y1, x2, y2, color = INK, at, t}: {x1: number; y1: number; x2: number; y2: number; color?: string; at: number; t: number}) => {
  const p = ease((t - at) / 0.35); if (p <= 0) return null;
  const a = Math.atan2(y2 - y1, x2 - x1), ex = x1 + (x2 - x1) * p, ey = y1 + (y2 - y1) * p;
  return <svg width={10} height={10} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <path d={`M${x1} ${y1} L${ex} ${ey}`} stroke={color} strokeWidth={16} strokeLinecap="round" />
    {p > 0.9 && <path d={`M${ex} ${ey} L${ex - 50 * Math.cos(a - 0.5)} ${ey - 50 * Math.sin(a - 0.5)} M${ex} ${ey} L${ex - 50 * Math.cos(a + 0.5)} ${ey - 50 * Math.sin(a + 0.5)}`} stroke={color} strokeWidth={16} strokeLinecap="round" />}
  </svg>;
};

// ---------- scenes ----------
const Intro = ({t}: {t: number}) => <>
  <Ground />
  <Penguin id="doug" x={540} y={G} h={560} pose={{beak: 'smile', brows: 'happy', flapR: 110 + Math.sin(t * 8) * 10}} />
  <Card x={760} y={G - 520} w={300} rot={-14} />
  <BigWord text="Doug" x={540} y={420} at={P(3)} size={150} />
  <Note text="1 credit card" x={760} y={G - 700} at={P(3) + 1.1} t={t} size={70} />
</>;

const Magic = ({t}: {t: number}) => <>
  <Ground />
  {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 300 + i * 120, top: 560 + (i % 2) * 90 + Math.sin(t * 6 + i) * 18, fontSize: 70}}>✨</div>)}
  <Card x={540} y={760} w={480} rot={Math.sin(t * 3) * 4} />
  <Penguin id="doug" x={540} y={G} h={360} pose={{beak: 'smile', brows: 'happy', look: [0, -0.8], flapL: 100, flapR: 100}} />
  <BigWord text="buy now" x={300} y={360} at={P(4) + 0.9} size={110} color={GREEN} />
  <BigWord text="pay later" x={760} y={1350} at={P(4) + 1.8} size={110} color={RED} />
</>;

const Shop = ({t}: {t: number}) => {
  const a = P(5);
  return <>
    <Ground />
    <Pop at={a + 0.5} t={t} x={780} y={G}><Tv x={780} y={G} w={340} /></Pop>
    <Pop at={a + 1.2} t={t} x={330} y={G}><Sled x={330} y={G} w={300} /></Pop>
    {[0, 1, 2, 3, 4, 5].map((i) => <Pop key={i} at={a + 1.8 + i * 0.1} t={t} x={200 + i * 140} y={G - 300}><Box x={200 + (i % 3) * 330 + (i > 2 ? 160 : 0)} y={G - 330 - (i > 2 ? 140 : 0)} w={150} c={['#E3B97A', '#F2C230', '#7CC4EC'][i % 3]} /></Pop>)}
    <Penguin id="doug" x={540} y={G} h={420} pose={{beak: 'smile', brows: 'happy', flapL: 80 + Math.sin(t * 10) * 15, flapR: 80 + Math.sin(t * 10 + 1) * 15, hop: Math.abs(Math.sin(t * 6)) * 0.5}} />
    <BigWord text="buy everything" x={540} y={400} at={a + 1.8} size={110} />
  </>;
};

const Bill = ({t}: {t: number}) => <>
  <Ground />
  <Paper x={540} y={680} w={460} title="CARD BILL" at={P(6)} rot={-4} id="bill" />
  <Penguin id="doug" x={540} y={G + 120} h={520} pose={{brows: 'shock', eyeScale: 1.35, pupil: 0.45, beak: 'frown', flapL: 70, flapR: 70, tremble: 1, look: [0, -0.7]}} />
  <BigWord text="$8,200" x={540} y={330} at={P(6) + 0.9} size={160} color={RED} />
</>;

const Minimum = ({t}: {t: number}) => <>
  <Ground />
  <Penguin id="doug" x={260} y={G} h={430} pose={{turn: 0.6, look: [0.8, 0], brows: 'worried', beak: 'flat', flapR: 70}} />
  <Box x={800} y={G} w={300} c="#9AA7B2" />
  <Note text="FOX BANK" x={800} y={G - 120} size={56} t={t} />
  <FishFlight x1={330} y1={G - 280} x2={800} y2={G - 300} a={P(7) + 0.6} b={P(7) + 1.4} n={3} w={90} />
  <BigWord text="minimum" x={540} y={420} at={P(7) + 0.3} size={120} />
  <BigWord text="$200" x={540} y={600} at={P(7) + 1.3} size={130} color={RED} />
</>;

const FoxSmile = ({t}: {t: number}) => <>
  <Ground />
  <Fox x={560} y={G + 80} h={900} sly={1} mouth={0} />
  <BigWord text="Fox the banker" x={540} y={300} at={P(8)} size={100} />
</>;

const Rate = ({t}: {t: number}) => <>
  <Ground />
  <Fox x={760} y={G} h={600} sly={1} pen mouth={0.3} />
  <Card x={290} y={760} w={360} rot={-8} />
  <BigWord text="22%" x={300} y={480} at={P(9) + 0.6} size={230} color={RED} />
  <Note text="interest" x={300} y={960} at={P(9) + 1.2} t={t} size={80} color={RED} />
</>;

const Grow = ({t}: {t: number}) => {
  const g = ease((t - P(10)) / 1.6), pays = t >= P(11);
  return <>
    <Ground />
    <Snowball x={700} y={G} size={lerp(260, 620, g)} t={t} />
    <Penguin id="doug" x={230} y={G} h={400} pose={{turn: 0.6, look: [0.8, -0.3], brows: pays ? 'worried' : 'shock', beak: 'frown', eyeScale: 1.15, flapR: pays ? 60 + Math.sin(t * 14) * 40 : 20, sweat: pays}} />
    {pays && [0, 1, 2].map((i) => <FishFlight key={i} x1={300} y1={G - 280} x2={680} y2={G - 300} a={P(11) + i * 0.5} b={P(11) + i * 0.5 + 0.5} n={1} w={80} seed={i} arc={200} />)}
    <BigWord text="debt grow" x={540} y={380} at={P(10) + 0.8} until={P(11)} size={120} color={RED} />
    <BigWord text="still there" x={540} y={380} at={P(11) + 1.2} size={120} color={RED} />
  </>;
};

const ToFox = ({t}: {t: number}) => {
  const a = P(12);
  return <>
    <Ground />
    <Penguin id="doug" x={230} y={G} h={400} pose={{turn: 0.6, look: [0.8, -0.2], brows: 'worried', beak: 'frown', flapR: 40}} />
    <Fox x={830} y={G} h={540} sly={1} mouth={t > a + 1 ? 0.4 : 0} />
    {[0, 1, 2, 3, 4].map((i) => <FishFlight key={i} x1={300} y1={G - 280} x2={800} y2={G - 300} a={a + 0.3 + i * 0.45} b={a + 0.3 + i * 0.45 + 0.6} n={3} w={80} seed={i} arc={260} />)}
    {t >= a + 1.5 && <FishPile x={830} y={G + 10} n={Math.min(12, Math.floor((t - a - 1.5) * 6))} w={90} />}
    <BigWord text="-$1,800 / year" x={540} y={420} at={a + 0.4} size={110} color={RED} />
    <BigWord text="for nothing" x={540} y={620} at={a + 2.6} size={100} />
  </>;
};

const Called = ({t}: {t: number}) => <Title lines={['INTEREST']} y={880} at={P(13) + 0.4} size={170} />;

const Mood = ({t, at, kind}: {t: number; at: number; kind: 'poor' | 'happy'}) => <>
  {kind === 'happy' && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 200, top: 520 + (i % 2) * 120 + Math.sin(t * 6 + i) * 20, fontSize: 90}}>✨</div>)}
  {kind === 'poor' && <div style={{position: 'absolute', inset: -400, background: '#E9EDF0'}} />}
  <Penguin id="doug" x={540} y={G + 300} h={950} outfit={kind === 'happy' ? 'rich' : 'none'}
    pose={kind === 'happy' ? {beak: 'smile', brows: 'happy', lids: 0.3, blush: 1, flapL: 120, flapR: 120} : {lids: 0.35, brows: 'worried', beak: 'frown', tears: true}} />
  <BigWord text={`Doug ${kind}.`} x={540} y={340} at={at} size={140} color={kind === 'happy' ? GREEN : RED} />
</>;

const RichIntro = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', inset: -400, background: '#E7F6EC'}} />
  <Ground />
  <Penguin id="rich" x={540} y={G} h={560} outfit="rich" pose={{beak: 'smile', brows: 'happy', flapR: 110 + Math.sin(t * 8) * 10}} />
  <Card x={770} y={G - 520} w={300} rot={-14} />
  <BigWord text="rich Doug" x={540} y={380} at={P(15)} size={130} color={GREEN} />
  <Note text="same card" x={770} y={G - 700} at={P(15) + 0.9} t={t} size={70} />
</>;

const Spend = ({t}: {t: number}) => {
  const a = P(16);
  return <>
    <Ground />
    <Tile icon="🍔" label="food" x={220} y={560} at={a + 0.5} t={t} />
    <Tile icon="⛽" label="gas" x={540} y={520} at={a + 0.9} t={t} />
    <Tile icon="✈️" label="travel" x={860} y={560} at={a + 1.3} t={t} />
    <Penguin id="rich" x={540} y={G} h={380} outfit="rich" pose={{beak: 'smile', brows: 'happy', flapR: 90}} />
    <BigWord text="$150,000 / year" x={540} y={260} at={a + 2.2} size={110} />
  </>;
};

const FullBill = ({t}: {t: number}) => <>
  <Ground />
  <Paper x={700} y={700} w={440} title="CARD BILL" amount="$12,500" at={P(17)} rot={5} id="bill2" />
  <Stamp text="PAID IN FULL" x={700} y={720} at={P(17) + 0.9} color={GREEN} size={74} />
  <Penguin id="rich" x={260} y={G} h={430} outfit="rich" pose={{turn: 0.6, look: [0.8, -0.3], beak: 'smile', brows: 'happy', flapR: 100}} />
  <BigWord text="every month" x={540} y={1330} at={P(17) + 1.4} size={110} color={GREEN} />
</>;

const Zero = ({t}: {t: number}) => <>
  <Ground />
  <Fox x={780} y={G} h={560} sly={0.2} mouth={0} />
  <BigWord text="0%" x={330} y={620} at={P(18)} size={300} color={GREEN} />
  <Note text="interest" x={330} y={850} at={P(18) + 0.3} t={t} size={80} color={GREEN} />
</>;

const Back = ({t}: {t: number}) => {
  const a = P(19);
  return <>
    <Ground />
    <Card x={760} y={700} w={360} rot={8} />
    <Penguin id="rich" x={280} y={G} h={430} outfit="rich" pose={{turn: 0.6, look: [0.8, -0.4], beak: 'smile', brows: 'happy', flapL: 110, flapR: 110}} />
    {[0, 1, 2].map((i) => <FishFlight key={i} x1={760} y1={700} x2={300} y2={G - 300} a={a + 0.4 + i * 0.45} b={a + 0.4 + i * 0.45 + 0.6} n={2} w={80} seed={i} arc={200} />)}
    <BigWord text="2% back" x={540} y={380} at={a + 1} size={140} color={GREEN} />
  </>;
};

const Free = ({t}: {t: number}) => {
  const a = P(20), n = Math.min(14, Math.floor((t - a) * 9));
  return <>
    <Ground />
    {n > 0 && <FishPile x={700} y={G + 10} n={n} w={110} />}
    <Penguin id="rich" x={280} y={G} h={460} outfit="rich" pose={{beak: 'smile', brows: 'happy', blush: 1, flapL: 120 + Math.sin(t * 10) * 15, flapR: 120 + Math.sin(t * 10 + 1) * 15, hop: Math.abs(Math.sin(t * 6)) * 0.6}} />
    <BigWord text="+$3,000" x={540} y={420} at={a} size={190} color={GREEN} />
    <BigWord text="free" x={760} y={640} at={a + 0.9} size={120} />
  </>;
};

const CashBack = () => <Title lines={['CASH BACK']} y={880} at={P(21) + 0.4} size={160} />;

const Stat = ({big, label, src, at, t, color}: {big: string; label: string; src: string; at: number; t: number; color: string}) => <>
  <BigWord text={big} x={540} y={760} at={at + 0.3} size={260} color={color} />
  <Note text={label} x={540} y={990} at={at + 0.6} t={t} size={80} />
  <Note text={src} x={540} y={1110} at={at + 0.9} t={t} size={44} color="#777" />
</>;
const RealLife = ({t}: {t: number}) => <>
  <Stamp text="REAL LIFE" x={540} y={380} at={P(23)} color={RED} size={100} />
  {t < P(24) ? <Stat big="$6,610" label="avg US credit card debt" src="TransUnion, 2026" at={P(23) + 1} t={t} color={RED} />
    : <Stat big="22%" label="avg card interest" src="Federal Reserve, 2026" at={P(24)} t={t} color={RED} />}
</>;

const Twist = ({t}: {t: number}) => {
  const a = P(25);
  return <>
    <Ground />
    <Penguin id="poor" x={170} y={G} h={330} pose={{turn: 0.6, look: [0.8, 0], brows: 'worried', beak: 'frown', flapR: 50}} />
    <Fox x={540} y={G} h={420} sly={1} mouth={0.3} />
    <Penguin id="rich" x={910} y={G} h={330} outfit="rich" pose={{turn: -0.6, look: [-0.8, 0], beak: 'smile', brows: 'happy', flapL: 100}} />
    <Arrow x1={230} y1={G - 420} x2={430} y2={G - 520} color={RED} at={a + 1} t={t} />
    <Arrow x1={650} y1={G - 520} x2={850} y2={G - 420} color={GREEN} at={a + 2.2} t={t} />
    <FishFlight x1={200} y1={G - 300} x2={520} y2={G - 300} a={a + 1} b={a + 1.8} n={3} w={70} arc={250} />
    <FishFlight x1={560} y1={G - 300} x2={900} y2={G - 300} a={a + 2.2} b={a + 3} n={2} w={70} arc={250} seed={2} />
    <BigWord text="same card" x={540} y={380} at={a} size={120} />
    <Amount text="-$1,800" x={250} y={G + 170} color={RED} t={t} at={a + 1} size={80} />
    <Amount text="+$3,000" x={830} y={G + 170} color={GREEN} t={t} at={a + 2.2} size={80} />
  </>;
};

const Cta = ({t}: {t: number}) => <>
  <Ground />
  <BigWord text="you?" x={540} y={360} at={P(26)} size={140} />
  {[['PAY FULL', GREEN], ['MINIMUM', RED]].map(([s, c], i) => { const p = ease((t - P(26) - 0.4 - i * 0.5) / 0.25);
    return <div key={s} style={{position: 'absolute', left: 520, top: 560 + i * 200, width: 480, height: 150, background: '#fff', border: `7px solid ${c}`, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: c, transform: `scale(${p}) rotate(${i % 2 ? 3 : -3}deg)`}}>{s}</div>; })}
  <Penguin id="doug" x={280} y={G} h={520} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
  <Card x={330} y={G - 160} w={200} />
  <BigWord text="👇" x={760} y={1060} at={P(26) + 1.6} size={140} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(3), set: (t) => <Intro t={t} />, fx_: 'swipe'},
  {at: P(4), set: (t) => <Magic t={t} />, fx_: 'pop'},
  {at: P(5), set: (t) => <Shop t={t} />, fx_: 'swipeL'},
  {at: P(6), set: (t) => <Bill t={t} />, fx_: 'zoom'},
  {at: P(7), set: (t) => <Minimum t={t} />, fx_: 'swipe'},
  {at: P(8), set: (t) => <FoxSmile t={t} />, fx_: 'iris'},
  {at: P(9), set: (t) => <Rate t={t} />, fx_: 'pop'},
  {at: P(10), set: (t) => <Grow t={t} />, fx_: 'swipeL'},
  {at: P(12), set: (t) => <ToFox t={t} />, fx_: 'swipe'},
  {at: P(13), set: (t) => <Called t={t} />, fx_: 'zoom'},
  {at: P(14), set: (t) => <Mood t={t} at={P(14)} kind="poor" />, fx_: 'zoom'},
  {at: P(15), set: (t) => <RichIntro t={t} />, fx_: 'iris'},
  {at: P(16), set: (t) => <Spend t={t} />, fx_: 'swipe'},
  {at: P(17), set: (t) => <FullBill t={t} />, fx_: 'swipeL'},
  {at: P(18), set: (t) => <Zero t={t} />, fx_: 'pop'},
  {at: P(19), set: (t) => <Back t={t} />, fx_: 'swipe'},
  {at: P(20), set: (t) => <Free t={t} />, fx_: 'zoom'},
  {at: P(21), set: () => <CashBack />, fx_: 'pop'},
  {at: P(22), set: (t) => <Mood t={t} at={P(22)} kind="happy" />, fx_: 'zoom'},
  {at: P(23), set: (t) => <RealLife t={t} />, fx_: 'swipeL'},
  {at: P(25), set: (t) => <Twist t={t} />, fx_: 'iris'},
  {at: P(26), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[6, 540, 700, 1.4], [8, 560, 600, 1.4], [9, 330, 700, 1.4], [11, 540, 950, 1.2], [16, 540, 800, 1.2], [18, 330, 700, 1.4], [24, 540, 850, 1.3]];

export const DougDebt = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side named (poor, then rich), back to both on "Same card"
    const toP = ease((tc - POOR_AT) / 0.4) * (tc < RICH_AT ? 1 : 0), toR = ease((tc - RICH_AT) / 0.4) * (tc < BOTH_AT ? 1 : 0);
    s0 = 1 + 0.22 * (toP + toR); fx = 540 - 270 * toP + 270 * toR; fy = 960 + 120 * (toP + toR);
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (tc < BOTH_AT ? 1 : beat(tc, TIM));
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-debt-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={POOR_AT - 0.05} name="user-whoosh" vol={0.25} />
    <Sfx at={POOR_AT + 0.15} name="user-wrong" vol={0.4} />
    <Sfx at={RICH_AT - 0.05} name="user-whoosh" vol={0.25} />
    <Sfx at={RICH_AT + 0.05} name="user-cash-register" vol={0.4} />
    <Sfx at={BOTH_AT} name="user-boom" vol={0.4} />
    <Sfx at={P(3)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(4) + 0.9} name="user-wow" vol={0.3} />
    <Sfx at={P(4) + 1.8} name="user-notif" vol={0.3} />
    <Sfx at={P(5) + 0.5} name="user-money" vol={0.3} />
    <Sfx at={P(5) + 1.2} name="user-pop" vol={0.3} />
    <Sfx at={P(5) + 1.8} name="user-cash-register" vol={0.3} />
    <Sfx at={P(6)} name="user-notif2" vol={0.35} />
    <Sfx at={P(6) + 0.9} name="user-shock" vol={0.4} />
    <Sfx at={P(7) + 0.6} name="user-money-transfer" vol={0.3} />
    <Sfx at={P(7) + 1.3} name="user-ting" vol={0.35} />
    <Sfx at={P(9) + 0.6} name="user-boom" vol={0.4} />
    <Sfx at={P(10) + 0.8} name="user-wrong" vol={0.35} />
    <Sfx at={P(11)} name="user-money" vol={0.3} />
    <Sfx at={P(11) + 1.2} name="user-slap" vol={0.35} />
    <Sfx at={P(12)} name="user-timer" vol={0.3} />
    <Sfx at={P(12) + 0.4} name="user-cash-register" vol={0.35} />
    <Sfx at={P(12) + 2.6} name="user-aww" vol={0.35} />
    <Sfx at={P(13) + 0.4} name="user-ting" vol={0.35} />
    <Sfx at={P(14)} name="user-fahh" vol={0.45} />
    <Sfx at={P(15)} name="user-pop" vol={0.3} />
    <Sfx at={P(16) + 0.5} name="user-pop" vol={0.3} />
    <Sfx at={P(16) + 0.9} name="user-pop" vol={0.3} />
    <Sfx at={P(16) + 1.3} name="user-pop" vol={0.3} />
    <Sfx at={P(16) + 2.2} name="user-cash-register" vol={0.35} />
    <Sfx at={P(17) + 0.9} name="user-slap" vol={0.4} />
    <Sfx at={P(17) + 1.4} name="user-timer" vol={0.3} />
    <Sfx at={P(18)} name="user-ting" vol={0.4} />
    <Sfx at={P(19) + 0.4} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(20)} name="user-money" vol={0.4} />
    <Sfx at={P(20) + 0.9} name="user-wow" vol={0.4} />
    <Sfx at={P(21) + 0.4} name="user-ting" vol={0.35} />
    <Sfx at={P(22)} name="user-yeah" vol={0.4} />
    <Sfx at={P(23)} name="user-slap" vol={0.35} />
    <Sfx at={P(23) + 1.3} name="user-ting" vol={0.4} />
    <Sfx at={P(24) + 0.3} name="user-ting" vol={0.4} />
    <Sfx at={P(25) + 1} name="user-wrong" vol={0.35} />
    <Sfx at={P(25) + 2.2} name="user-cash-register" vol={0.35} />
    <Sfx at={P(26)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
