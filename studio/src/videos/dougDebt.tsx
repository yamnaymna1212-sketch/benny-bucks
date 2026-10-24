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
// hook beats: "Poor Doug" -> push left; "Rich Doug" -> push right; "Both use credit cards" -> both
const POOR_AT = 0.6, RICH_AT = P(1), BOTH_AT = P(2);

// ---------- hook (user's reference image, 2026-10-24: white, POOR/RICH, grey card vs gold card, thin divider) ----------
// Spoken hook = on-screen words: "Why? Poor Doug: minus 1,800 dollars! Rich Doug: plus 3,000 dollars!"
const HG = 1290;
const Why = () => <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: HAND, fontWeight: 700, fontSize: 210, lineHeight: '220px', color: INK, WebkitTextStroke: `6px ${INK}`}}>
  Why<span style={{color: RED, WebkitTextStroke: `6px ${RED}`}}>?</span></div>;

const SideLabel = ({text, x, y, color, t, at}: {text: string; x: number; y: number; color: string; t: number; at: number}) => {
  const k = t >= at && t < at + 0.25 ? 1 + 0.15 * Math.sin(((t - at) / 0.25) * Math.PI) : 1;
  return <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', transform: `scale(${k}) rotate(-3deg)`}}>
    <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 150, lineHeight: '150px', color, WebkitTextStroke: `7px ${color}`, letterSpacing: 4}}>{text}</div>
    <svg width={420} height={50} viewBox="0 0 420 50"><path d="M20 38 Q 160 18, 400 14" fill="none" stroke={color} strokeWidth={13} strokeLinecap="round" /></svg>
  </div>;
};

// Credit card. kind: purple (story card), grey (poor, plain numbers), gold (rich, no brand logo).
const Card = ({x, y, w = 230, rot = -4, shake = 0, t = 0, kind = 'purple'}: {x: number; y: number; w?: number; rot?: number; shake?: number; t?: number; kind?: 'purple' | 'grey' | 'gold'}) =>
  <svg width={w} height={w * 0.635} viewBox="0 0 230 146" style={{position: 'absolute', left: x - w / 2 + Math.sin(t * 60) * shake, top: y - w * 0.3175, overflow: 'visible', transform: `rotate(${rot}deg)`}}>
    <defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F6E3A1" /><stop offset="0.5" stopColor="#D9B45A" /><stop offset="1" stopColor="#B8902F" /></linearGradient></defs>
    <rect x={4} y={4} width={222} height={138} rx={14} fill={kind === 'gold' ? 'url(#gold)' : kind === 'grey' ? '#4A5466' : CARD} stroke={INK} strokeWidth={6} />
    <rect x={26} y={kind === 'purple' ? 40 : 48} width={40} height={30} rx={6} fill="#F5C518" stroke={INK} strokeWidth={4} />
    <path d={`M26 ${kind === 'purple' ? 55 : 63} L66 ${kind === 'purple' ? 55 : 63}`} stroke={INK} strokeWidth={3} />
    {kind === 'purple' && <><circle cx={176} cy={34} r={14} fill={RED} stroke={INK} strokeWidth={3} /><circle cx={196} cy={34} r={14} fill="#F5A623" stroke={INK} strokeWidth={3} />
      <path d="M26 108 L200 108" stroke="#fff" strokeWidth={6} strokeDasharray="14 10" strokeLinecap="round" /></>}
    {kind === 'grey' && <text x={115} y={108} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={19} fill="#E8ECF2" letterSpacing={2}>1234 5678 9012 3456</text>}
    {kind === 'gold' && <><text x={115} y={34} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={20} fill="#5A4410" letterSpacing={4}>GOLD CARD</text>
      <circle cx={170} cy={78} r={22} fill="none" stroke="#7A5C14" strokeWidth={3} /><text x={170} y={86} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={22} fill="#7A5C14">D</text>
      <text x={30} y={124} fontFamily="Montserrat" fontWeight={700} fontSize={13} fill="#5A4410">DOUG</text></>}
  </svg>;

// Big number under each Doug; punches when its side is spoken.
const Amount = ({text, x, y, color, t, at, size = 150}: {text: string; x: number; y: number; color: string; t: number; at: number; size?: number}) => {
  const d = t - at, k = d >= 0 && d < 0.3 ? 1 + 0.25 * Math.sin((d / 0.3) * Math.PI) : 1;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(-4deg) scale(${k})`, fontFamily: HAND, fontWeight: 700, fontSize: size, lineHeight: 1,
    color, WebkitTextStroke: `${size * 0.03}px ${color}`, letterSpacing: 6, whiteSpace: 'nowrap'}}>{text}</div>;
};

const Ground = () => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 900, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />;

const Hook = ({t}: {t: number}) => {
  const poorHot = t >= POOR_AT && t < RICH_AT, richHot = t >= RICH_AT;
  const bump = t >= BOTH_AT ? Math.abs(Math.sin((t - BOTH_AT) * 7)) * 16 * Math.exp(-(t - BOTH_AT) * 2) : 0;
  return <>
    <Why />
    <SideLabel text="POOR" x={260} y={330} color={RED} t={t} at={POOR_AT} />
    <SideLabel text="RICH" x={820} y={330} color={GREEN} t={t} at={RICH_AT} />
    <div style={{position: 'absolute', left: 537, top: 640, width: 7, height: 700, background: INK, borderRadius: 4}} />
    <Penguin id="poor" x={260} y={HG} h={560} pose={{brows: 'worried', eyeScale: poorHot ? 1.2 : 1.05, pupil: poorHot ? 0.6 : 1, beak: poorHot ? 'frown' : 'flat', tremble: poorHot ? 0.8 : 0, flapL: 20, flapR: 20}} />
    <Card x={260} y={HG - 200 - bump} w={270} rot={-3} kind="grey" t={t} shake={poorHot ? 3 : 0} />
    <Penguin id="rich" x={820} y={HG} h={560} outfit="tophat" pose={{brows: richHot ? 'happy' : 'worried', beak: richHot ? 'smile' : 'flat', eyeScale: 1.05, flapL: 20, flapR: 20}} />
    <Card x={820} y={HG - 190 - bump} w={330} rot={-2} kind="gold" />
    <Amount text="-$1,800" x={260} y={HG + 130} color={RED} t={t} at={POOR_AT} size={120} />
    <Amount text="+$3,000" x={820} y={HG + 130} color={GREEN} t={t} at={RICH_AT} size={120} />
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
  <Card x={760} y={G - 520} w={300} rot={-14} kind="grey" />
  <BigWord text="Doug" x={540} y={420} at={P(3)} size={150} />
  <Note text="1 credit card" x={760} y={G - 700} at={P(3) + 1.1} t={t} size={70} />
</>;

const Magic = ({t}: {t: number}) => <>
  <Ground />
  {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 300 + i * 120, top: 560 + (i % 2) * 90 + Math.sin(t * 6 + i) * 18, fontSize: 70}}>✨</div>)}
  <Card x={540} y={760} w={480} rot={Math.sin(t * 3) * 4} kind="grey" />
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
  <Paper x={540} y={680} w={460} title="CARD BILL" at={P(7)} rot={-4} id="bill" />
  <Penguin id="doug" x={540} y={G + 120} h={520} pose={{brows: 'shock', eyeScale: 1.35, pupil: 0.45, beak: 'frown', flapL: 70, flapR: 70, tremble: 1, look: [0, -0.7]}} />
  <BigWord text="$8,200" x={540} y={330} at={P(7) + 0.9} size={160} color={RED} />
</>;

const Minimum = ({t}: {t: number}) => <>
  <Ground />
  <Penguin id="doug" x={260} y={G} h={430} pose={{turn: 0.6, look: [0.8, 0], brows: 'worried', beak: 'flat', flapR: 70}} />
  <Box x={800} y={G} w={300} c="#9AA7B2" />
  <Note text="FOX BANK" x={800} y={G - 120} size={56} t={t} />
  <FishFlight x1={330} y1={G - 280} x2={800} y2={G - 300} a={P(8) + 0.6} b={P(8) + 1.4} n={3} w={90} />
  <BigWord text="minimum" x={540} y={420} at={P(8) + 0.3} size={120} />
  <BigWord text="$200" x={540} y={600} at={P(8) + 1.3} size={130} color={RED} />
  <BigWord text="trap!" x={540} y={800} at={P(9) + 0.9} size={150} color={RED} />
</>;

const FoxSmile = ({t}: {t: number}) => <>
  <Ground />
  <Fox x={560} y={G + 80} h={900} sly={1} mouth={0} />
  <BigWord text="Fox the banker" x={540} y={300} at={P(10)} size={100} />
</>;

const Rate = ({t}: {t: number}) => <>
  <Ground />
  <Fox x={760} y={G} h={600} sly={1} pen mouth={0.3} />
  <Card x={290} y={760} w={360} rot={-8} kind="grey" />
  <BigWord text="22%" x={300} y={480} at={P(11) + 0.6} size={230} color={RED} />
  <Note text="interest" x={300} y={960} at={P(11) + 1.2} t={t} size={80} color={RED} />
</>;

const Grow = ({t}: {t: number}) => {
  const g = ease((t - P(12)) / 1.6), pays = t >= P(13);
  return <>
    <Ground />
    <Snowball x={700} y={G} size={lerp(260, 620, g)} t={t} />
    <Penguin id="doug" x={230} y={G} h={400} pose={{turn: 0.6, look: [0.8, -0.3], brows: pays ? 'worried' : 'shock', beak: 'frown', eyeScale: 1.15, flapR: pays ? 60 + Math.sin(t * 14) * 40 : 20, sweat: pays}} />
    {pays && [0, 1, 2].map((i) => <FishFlight key={i} x1={300} y1={G - 280} x2={680} y2={G - 300} a={P(13) + i * 0.5} b={P(13) + i * 0.5 + 0.5} n={1} w={80} seed={i} arc={200} />)}
    <BigWord text="debt grow" x={540} y={380} at={P(12) + 0.8} until={P(13)} size={120} color={RED} />
    <BigWord text="still there" x={540} y={380} at={P(13) + 1.2} size={120} color={RED} />
  </>;
};

const ToFox = ({t}: {t: number}) => {
  const a = P(14);
  return <>
    <Ground />
    <Penguin id="doug" x={230} y={G} h={400} pose={{turn: 0.6, look: [0.8, -0.2], brows: 'worried', beak: 'frown', flapR: 40}} />
    <Fox x={830} y={G} h={540} sly={1} mouth={t > a + 1 ? 0.4 : 0} />
    {[0, 1, 2, 3, 4].map((i) => <FishFlight key={i} x1={300} y1={G - 280} x2={800} y2={G - 300} a={a + 0.3 + i * 0.45} b={a + 0.3 + i * 0.45 + 0.6} n={3} w={80} seed={i} arc={260} />)}
    {t >= a + 1.5 && <FishPile x={830} y={G + 10} n={Math.min(12, Math.floor((t - a - 1.5) * 6))} w={90} />}
    <BigWord text="-$1,800 / year" x={540} y={420} at={a + 0.4} size={110} color={RED} />
    <BigWord text="for nothing" x={540} y={620} at={a + 2.6} until={P(15)} size={100} />
    <BigWord text="180 fish gone" x={540} y={620} at={P(15)} size={100} color={RED} />
  </>;
};

const Called = ({t}: {t: number}) => <Title lines={['INTEREST']} y={880} at={P(16) + 0.4} size={170} />;

const Mood = ({t, at, kind}: {t: number; at: number; kind: 'poor' | 'happy'}) => <>
  {kind === 'happy' && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 200, top: 520 + (i % 2) * 120 + Math.sin(t * 6 + i) * 20, fontSize: 90}}>✨</div>)}
  {kind === 'poor' && <div style={{position: 'absolute', inset: -400, background: '#E9EDF0'}} />}
  <Penguin id="doug" x={540} y={G + 300} h={950} outfit={kind === 'happy' ? 'tophat' : 'none'}
    pose={kind === 'happy' ? {beak: 'smile', brows: 'happy', lids: 0.3, blush: 1, flapL: 120, flapR: 120} : {lids: 0.35, brows: 'worried', beak: 'frown', tears: true}} />
  <BigWord text={`Doug ${kind}.`} x={540} y={340} at={at} size={140} color={kind === 'happy' ? GREEN : RED} />
</>;

const RichIntro = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', inset: -400, background: '#E7F6EC'}} />
  <Ground />
  <Penguin id="rich" x={540} y={G} h={560} outfit="tophat" pose={{beak: 'smile', brows: 'happy', flapR: 110 + Math.sin(t * 8) * 10}} />
  <Card x={770} y={G - 520} w={340} rot={-14} kind="gold" />
  <BigWord text="rich Doug" x={540} y={380} at={P(18)} size={130} color={GREEN} />
  <Note text="gold card" x={770} y={G - 720} at={P(18) + 0.6} t={t} size={70} color="#B8902F" />
</>;

const Spend = ({t}: {t: number}) => {
  const a = P(19);
  return <>
    <Ground />
    <Tile icon="🍔" label="food" x={220} y={560} at={a + 0.5} t={t} />
    <Tile icon="⛽" label="gas" x={540} y={520} at={a + 0.9} t={t} />
    <Tile icon="✈️" label="travel" x={860} y={560} at={a + 1.3} t={t} />
    <Penguin id="rich" x={540} y={G} h={380} outfit="tophat" pose={{beak: 'smile', brows: 'happy', flapR: 90}} />
    <BigWord text="$150,000 / year" x={540} y={260} at={a + 2.2} size={110} />
  </>;
};

const FullBill = ({t}: {t: number}) => <>
  <Ground />
  <Paper x={700} y={700} w={440} title="CARD BILL" amount="$12,500" at={P(20)} rot={5} id="bill2" />
  <Stamp text="PAID IN FULL" x={700} y={720} at={P(20) + 0.9} color={GREEN} size={74} />
  <Penguin id="rich" x={260} y={G} h={430} outfit="tophat" pose={{turn: 0.6, look: [0.8, -0.3], beak: 'smile', brows: 'happy', flapR: 100}} />
  <BigWord text="every month" x={540} y={1330} at={P(20) + 1.4} size={110} color={GREEN} />
</>;

const Zero = ({t}: {t: number}) => <>
  <Ground />
  <Fox x={780} y={G} h={560} sly={t >= P(21) + 0.8 ? 0 : 0.2} mouth={t >= P(21) + 0.8 ? 0.5 : 0} />
  <BigWord text="Fox: $0" x={780} y={420} at={P(21) + 0.8} size={100} color={RED} />
  <BigWord text="0%" x={330} y={620} at={P(21)} size={300} color={GREEN} />
  <Note text="interest" x={330} y={850} at={P(21) + 0.3} t={t} size={80} color={GREEN} />
</>;

const Back = ({t}: {t: number}) => {
  const a = P(22);
  return <>
    <Ground />
    <Card x={760} y={700} w={380} rot={8} kind="gold" />
    <Penguin id="rich" x={280} y={G} h={430} outfit="tophat" pose={{turn: 0.6, look: [0.8, -0.4], beak: 'smile', brows: 'happy', flapL: 110, flapR: 110}} />
    {[0, 1, 2].map((i) => <FishFlight key={i} x1={760} y1={700} x2={300} y2={G - 300} a={a + 0.4 + i * 0.45} b={a + 0.4 + i * 0.45 + 0.6} n={2} w={80} seed={i} arc={200} />)}
    <BigWord text="2% back" x={540} y={380} at={a + 1} size={140} color={GREEN} />
  </>;
};

const Free = ({t}: {t: number}) => {
  const a = P(23), n = Math.min(14, Math.floor((t - a) * 9));
  return <>
    <Ground />
    {n > 0 && <FishPile x={700} y={G + 10} n={n} w={110} />}
    <Penguin id="rich" x={280} y={G} h={460} outfit="tophat" pose={{beak: 'smile', brows: 'happy', blush: 1, flapL: 120 + Math.sin(t * 10) * 15, flapR: 120 + Math.sin(t * 10 + 1) * 15, hop: Math.abs(Math.sin(t * 6)) * 0.6}} />
    <BigWord text="+$3,000" x={540} y={420} at={a} size={190} color={GREEN} />
    <BigWord text="free" x={760} y={640} at={a + 0.9} until={P(24)} size={120} />
    <BigWord text="300 fish!" x={760} y={640} at={P(24)} size={120} color={GREEN} />
  </>;
};

const CashBack = () => <Title lines={['CASH BACK']} y={880} at={P(25) + 0.4} size={160} />;

const Stat = ({big, label, src, at, t, color}: {big: string; label: string; src: string; at: number; t: number; color: string}) => <>
  <BigWord text={big} x={540} y={760} at={at + 0.3} size={260} color={color} />
  <Note text={label} x={540} y={990} at={at + 0.6} t={t} size={80} />
  <Note text={src} x={540} y={1110} at={at + 0.9} t={t} size={44} color="#777" />
</>;
const RealLife = ({t}: {t: number}) => <>
  <Stamp text="REAL LIFE" x={540} y={380} at={P(27)} color={RED} size={100} />
  {t < P(28) ? <Stat big="$6,610" label="avg US credit card debt" src="TransUnion, 2026" at={P(27) + 1} t={t} color={RED} />
    : <Stat big="22%" label="avg card interest" src="Federal Reserve, 2026" at={P(28)} t={t} color={RED} />}
</>;

const Twist = ({t}: {t: number}) => {
  const a = P(29);
  return <>
    <Ground />
    <Penguin id="poor" x={170} y={G} h={330} pose={{turn: 0.6, look: [0.8, 0], brows: 'worried', beak: 'frown', flapR: 50}} />
    <Fox x={540} y={G} h={420} sly={1} mouth={0.3} />
    <Penguin id="rich" x={910} y={G} h={330} outfit="tophat" pose={{turn: -0.6, look: [-0.8, 0], beak: 'smile', brows: 'happy', flapL: 100}} />
    <Arrow x1={230} y1={G - 420} x2={430} y2={G - 520} color={RED} at={a + 1} t={t} />
    <Arrow x1={650} y1={G - 520} x2={850} y2={G - 420} color={GREEN} at={a + 2.2} t={t} />
    <FishFlight x1={200} y1={G - 300} x2={520} y2={G - 300} a={a + 1} b={a + 1.8} n={3} w={70} arc={250} />
    <FishFlight x1={560} y1={G - 300} x2={900} y2={G - 300} a={a + 2.2} b={a + 3} n={2} w={70} arc={250} seed={2} />
    <BigWord text="Fox in the middle" x={540} y={380} at={a} until={P(30)} size={100} />
    <BigWord text="same Fox, different Doug" x={540} y={380} at={P(30)} size={80} />
    <Amount text="-$1,800" x={250} y={G + 170} color={RED} t={t} at={a + 1} size={80} />
    <Amount text="+$3,000" x={830} y={G + 170} color={GREEN} t={t} at={a + 2.2} size={80} />
  </>;
};

const Lesson = ({t}: {t: number}) => <>
  <Ground />
  <Card x={330} y={560} w={380} rot={-6} kind="grey" />
  <BigWord text="✓" x={720} y={560} at={P(31)} size={200} color={GREEN} />
  <BigWord text="MINIMUM" x={430} y={850} at={P(31) + 1.1} size={140} color={RED} />
  <BigWord text="✗" x={880} y={850} at={P(31) + 1.3} size={200} color={RED} />
  <Penguin id="doug" x={540} y={G} h={240} pose={{brows: 'happy', beak: 'smile', flapR: 110}} />
</>;

const Cta = ({t}: {t: number}) => <>
  <Ground />
  <BigWord text="you?" x={540} y={360} at={P(32)} size={140} />
  {[['PAY FULL', GREEN], ['MINIMUM', RED]].map(([s, c], i) => { const p = ease((t - P(32) - 0.4 - i * 0.5) / 0.25);
    return <div key={s} style={{position: 'absolute', left: 520, top: 560 + i * 200, width: 480, height: 150, background: '#fff', border: `7px solid ${c}`, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: c, transform: `scale(${p}) rotate(${i % 2 ? 3 : -3}deg)`}}>{s}</div>; })}
  <Penguin id="doug" x={280} y={G} h={520} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
  <Card x={330} y={G - 160} w={200} kind="grey" />
  <BigWord text="👇" x={760} y={1060} at={P(32) + 1.6} size={140} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(3), set: (t) => <Intro t={t} />, fx_: 'swipe'},
  {at: P(4), set: (t) => <Magic t={t} />, fx_: 'pop'},
  {at: P(5), set: (t) => <Shop t={t} />, fx_: 'swipeL'},
  {at: P(7), set: (t) => <Bill t={t} />, fx_: 'zoom'},
  {at: P(8), set: (t) => <Minimum t={t} />, fx_: 'swipe'},
  {at: P(10), set: (t) => <FoxSmile t={t} />, fx_: 'iris'},
  {at: P(11), set: (t) => <Rate t={t} />, fx_: 'pop'},
  {at: P(12), set: (t) => <Grow t={t} />, fx_: 'swipeL'},
  {at: P(14), set: (t) => <ToFox t={t} />, fx_: 'swipe'},
  {at: P(16), set: (t) => <Called t={t} />, fx_: 'zoom'},
  {at: P(17), set: (t) => <Mood t={t} at={P(17)} kind="poor" />, fx_: 'zoom'},
  {at: P(18), set: (t) => <RichIntro t={t} />, fx_: 'iris'},
  {at: P(19), set: (t) => <Spend t={t} />, fx_: 'swipe'},
  {at: P(20), set: (t) => <FullBill t={t} />, fx_: 'swipeL'},
  {at: P(21), set: (t) => <Zero t={t} />, fx_: 'pop'},
  {at: P(22), set: (t) => <Back t={t} />, fx_: 'swipe'},
  {at: P(23), set: (t) => <Free t={t} />, fx_: 'zoom'},
  {at: P(25), set: () => <CashBack />, fx_: 'pop'},
  {at: P(26), set: (t) => <Mood t={t} at={P(26)} kind="happy" />, fx_: 'zoom'},
  {at: P(27), set: (t) => <RealLife t={t} />, fx_: 'swipeL'},
  {at: P(29), set: (t) => <Twist t={t} />, fx_: 'iris'},
  {at: P(31), set: (t) => <Lesson t={t} />, fx_: 'swipe'},
  {at: P(32), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[7, 540, 700, 1.4], [10, 560, 600, 1.4], [11, 330, 700, 1.4], [13, 540, 950, 1.2], [19, 540, 800, 1.2], [28, 540, 850, 1.3]];

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
    <Captions t={tc} phrases={TIM.slice(2)} />
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
    <Sfx at={P(7)} name="user-notif2" vol={0.35} />
    <Sfx at={P(7) + 0.9} name="user-shock" vol={0.4} />
    <Sfx at={P(8) + 0.6} name="user-money-transfer" vol={0.3} />
    <Sfx at={P(8) + 1.3} name="user-ting" vol={0.35} />
    <Sfx at={P(11) + 0.6} name="user-boom" vol={0.4} />
    <Sfx at={P(12) + 0.8} name="user-wrong" vol={0.35} />
    <Sfx at={P(13)} name="user-money" vol={0.3} />
    <Sfx at={P(13) + 1.2} name="user-slap" vol={0.35} />
    <Sfx at={P(14)} name="user-timer" vol={0.3} />
    <Sfx at={P(14) + 0.4} name="user-cash-register" vol={0.35} />
    <Sfx at={P(14) + 2.6} name="user-aww" vol={0.35} />
    <Sfx at={P(16) + 0.4} name="user-ting" vol={0.35} />
    <Sfx at={P(17)} name="user-fahh" vol={0.45} />
    <Sfx at={P(18)} name="user-pop" vol={0.3} />
    <Sfx at={P(19) + 0.5} name="user-pop" vol={0.3} />
    <Sfx at={P(19) + 0.9} name="user-pop" vol={0.3} />
    <Sfx at={P(19) + 1.3} name="user-pop" vol={0.3} />
    <Sfx at={P(19) + 2.2} name="user-cash-register" vol={0.35} />
    <Sfx at={P(20) + 0.9} name="user-slap" vol={0.4} />
    <Sfx at={P(20) + 1.4} name="user-timer" vol={0.3} />
    <Sfx at={P(21)} name="user-ting" vol={0.4} />
    <Sfx at={P(22) + 0.4} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(23)} name="user-money" vol={0.4} />
    <Sfx at={P(23) + 0.9} name="user-wow" vol={0.4} />
    <Sfx at={P(25) + 0.4} name="user-ting" vol={0.35} />
    <Sfx at={P(26)} name="user-yeah" vol={0.4} />
    <Sfx at={P(27)} name="user-slap" vol={0.35} />
    <Sfx at={P(27) + 1.3} name="user-ting" vol={0.4} />
    <Sfx at={P(28) + 0.3} name="user-ting" vol={0.4} />
    <Sfx at={P(29) + 1} name="user-wrong" vol={0.35} />
    <Sfx at={P(29) + 2.2} name="user-cash-register" vol={0.35} />
    <Sfx at={P(9) + 0.9} name="user-wrong" vol={0.35} />
    <Sfx at={P(15)} name="user-aww" vol={0.3} />
    <Sfx at={P(21) + 0.8} name="user-horn" vol={0.35} />
    <Sfx at={P(24)} name="user-money" vol={0.35} />
    <Sfx at={P(30)} name="user-boom" vol={0.35} />
    <Sfx at={P(31)} name="user-ting" vol={0.35} />
    <Sfx at={P(31) + 1.1} name="user-wrong" vol={0.35} />
    <Sfx at={P(32)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
