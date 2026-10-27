// EP8 "Credit score: same $100,000 car, Doug pays $40,000 more". Whole episode on the blue background of the user's hook image
// (videos/doug-credit/src/hook-ref.png; car sprites cut by tools/credit_plate.py). Line timings: studio/src/data/doug-credit.json.
// Numbers: Experian Q1 2026 used-car APR by VantageScore tier: 501-600 = 19.42%, 781-850 = 6.30%. $100,000, 60 months:
// 19.42% -> $157,033 total ; 6.30% -> $116,837 total ; difference $40,196.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Fox} from './dougLaundering';
import {Otter} from './dougFriend';
import {Captions, Phrase, Sfx, beat} from '../penguin/edit';
import {Fx, cutFX} from '../penguin/acting';
import TIM from '../data/doug-credit.json';

const PH = TIM as Phrase[];
const P = (i: number) => PH[i].start, E = (i: number) => PH[i].end;
export const DOUG_CREDIT_SECONDS = Math.ceil((PH[PH.length - 1].end + 0.9) * 30) / 30;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const RED = '#FF4B3E', GREEN = '#7EE04A', WHITE = '#FFFFFF', HAND = 'Architects Daughter';
const FLOOR = 1450; // characters stand here in the story shots (captions sit at y 1530)

// ---------- blue background (same as the hook image: navy -> royal blue, glow on the right, faint grid, stars) ----------
const BlueBg = ({t}: {t: number}) => <AbsoluteFill style={{background: 'linear-gradient(180deg, #011a58 0%, #022a78 45%, #023897 100%)'}}>
  <AbsoluteFill style={{background: 'radial-gradient(circle at 98% 40%, rgba(30,140,255,0.55) 0%, rgba(30,140,255,0) 45%)'}} />
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 75%, rgba(10,80,190,0.45) 0%, rgba(10,80,190,0) 60%)'}} />
  <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.045) 2px, transparent 2px)', backgroundSize: '57px 57px'}} />
  {[[80, 60], [520, 300], [150, 820], [990, 180], [320, 1350], [880, 1250], [700, 90], [60, 1700]].map(([x, y], i) =>
    <div key={i} style={{position: 'absolute', left: x, top: y, width: 4, height: 4, borderRadius: 2, background: '#9FD0FF', opacity: 0.4 + 0.4 * Math.sin(t * 2 + i)}} />)}
</AbsoluteFill>;

// ---------- text ----------
const pop = (t: number, at: number) => { const p = ease((t - at) / 0.2); return p + (p < 1 ? Math.sin(p * Math.PI) * 0.15 : 0); };
const Hand = ({text, x, y, size = 110, color = WHITE, at = -9, t, rot = -2}: {text: React.ReactNode; x: number; y: number; size?: number; color?: string; at?: number; t: number; rot?: number}) => {
  const p = pop(t, at); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${p})`, fontFamily: HAND, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: 'nowrap', textAlign: 'center', textShadow: '0 5px 0 rgba(0,10,40,0.35)'}}>{text}</div>;
};
const Num = ({text, x, y, size = 150, color = WHITE, at = -9, t, rot = -3}: {text: string; x: number; y: number; size?: number; color?: string; at?: number; t: number; rot?: number}) => {
  const p = pop(t, at); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${p})`, fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap', textShadow: '0 7px 0 rgba(0,10,40,0.45)'}}>{text}</div>;
};
const Brush = ({x, y, w, color}: {x: number; y: number; w: number; color: string}) =>
  <svg width={w} height={30} viewBox="0 0 200 30" preserveAspectRatio="none" style={{position: 'absolute', left: x - w / 2, top: y}}>
    <path d="M4 18 Q 60 8 120 14 T 196 12" stroke={color} strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M10 26 Q 70 20 140 24" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
  </svg>;

// ---------- credit score gauge (red -> green half dial, white needle). v = score 300..850 ----------
const Gauge = ({x, y, r = 110, v, label = true}: {x: number; y: number; r?: number; v: number; label?: boolean}) => {
  const cols = ['#E8392F', '#F5852B', '#F7C531', '#8FD14F', '#2EA84A'];
  const arc = (a0: number, a1: number) => { const p = (a: number) => [Math.cos(a) * 100, -Math.sin(a) * 100]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0} ${y0} A100 100 0 0 1 ${x1} ${y1}`; };
  const ang = Math.PI * (1 - cl((v - 300) / 550));
  return <svg width={r * 2.4} height={r * 1.9} viewBox="-120 -120 240 190" style={{position: 'absolute', left: x - r * 1.2, top: y - r * 1.26, overflow: 'visible'}}>
    <path d={arc(Math.PI, 0)} stroke={WHITE} strokeWidth={40} fill="none" />
    {cols.map((c, i) => <path key={i} d={arc(Math.PI * (1 - i / 5) - (i ? 0.01 : 0), Math.PI * (1 - (i + 1) / 5))} stroke={c} strokeWidth={28} fill="none" />)}
    {[1, 2, 3, 4].map((i) => { const a = Math.PI * (1 - i / 5); return <line key={i} x1={Math.cos(a) * 86} y1={-Math.sin(a) * 86} x2={Math.cos(a) * 114} y2={-Math.sin(a) * 114} stroke={WHITE} strokeWidth={3} />; })}
    <line x1={0} y1={0} x2={Math.cos(ang) * 76} y2={-Math.sin(ang) * 76} stroke={INK} strokeWidth={12} strokeLinecap="round" />
    <line x1={0} y1={0} x2={Math.cos(ang) * 74} y2={-Math.sin(ang) * 74} stroke={WHITE} strokeWidth={6} strokeLinecap="round" />
    <circle r={12} fill={WHITE} stroke={INK} strokeWidth={4} />
    {label && <><text y={50} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={30} fill={WHITE}>CREDIT SCORE</text>
      <path d="M-58 62 Q 0 56 58 62" stroke={WHITE} strokeWidth={3} fill="none" /></>}
  </svg>;
};
// needle value that eases from a to b between t0 and t1, with a small wobble when it lands
const sweep = (t: number, t0: number, t1: number, a: number, b: number) => { const p = cl((t - t0) / (t1 - t0)); return lerp(a, b, ease(p)) + (p > 0 && p < 1 ? 0 : Math.sin(t * 9) * 3); };

// ---------- the flying car (sprite cut from the user's image) ----------
const CarSprite = ({x, y, w, side = 'l', t, seed = 0}: {x: number; y: number; w: number; side?: 'l' | 'r'; t: number; seed?: number}) => {
  const bob = Math.sin(t * 3 + seed) * 10, tilt = Math.sin(t * 2 + seed) * 1.2;
  return <Img src={staticFile(`credit/car-${side}.png`)} style={{position: 'absolute', left: x - w / 2, top: y + bob, width: w, transform: `rotate(${tilt}deg)`}} />;
};
const Shadow = ({x, y, w}: {x: number; y: number; w: number}) => <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.06, width: w, height: w * 0.12, borderRadius: '50%', background: 'rgba(0,10,50,0.45)'}} />;

// ---------- props ----------
const Bill = ({x, y, t, at}: {x: number; y: number; t: number; at: number}) => <>
  <div style={{position: 'absolute', left: x - 160, top: y - 210, width: 320, height: 420, background: '#FFFDF5', border: `7px solid ${INK}`, borderRadius: 16, transform: 'rotate(-4deg)', padding: 28, boxSizing: 'border-box'}}>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 46, color: INK}}>BILL</div>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{height: 12, background: '#C9D3E0', borderRadius: 6, marginTop: 26, width: `${90 - i * 12}%`}} />)}
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: INK, marginTop: 34}}>DUE: 1st</div>
  </div>
  {t >= at && <div style={{position: 'absolute', left: x - 170, top: y - 40, transform: `rotate(-16deg) scale(${pop(t, at)})`, border: `9px solid ${RED}`, borderRadius: 16, padding: '4px 26px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 96, color: RED, background: 'rgba(255,255,255,0.9)'}}>LATE</div>}
</>;

const CreditCard = ({x, y, w = 420, color = '#1E1E1E', label, rot = 0, s = 1}: {x: number; y: number; w?: number; color?: string; label?: string; rot?: number; s?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.315, width: w, height: w * 0.63, borderRadius: w * 0.06, background: color, border: `6px solid ${INK}`, boxSizing: 'border-box', transform: `rotate(${rot}deg) scale(${s})`, boxShadow: '0 12px 0 rgba(0,10,40,0.35)'}}>
    <div style={{position: 'absolute', left: w * 0.08, top: w * 0.16, width: w * 0.16, height: w * 0.12, borderRadius: 8, background: '#F2C14E', border: `3px solid ${INK}`}} />
    <div style={{position: 'absolute', left: w * 0.08, top: w * 0.36, fontFamily: 'Montserrat', fontWeight: 800, fontSize: w * 0.075, color: '#fff', letterSpacing: 3}}>•••• •••• •••• 4821</div>
    {label && <div style={{position: 'absolute', right: w * 0.07, bottom: w * 0.06, fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.07, color: '#fff'}}>{label}</div>}
  </div>;

const Bar = ({x, y, w = 760, fill, color, mark}: {x: number; y: number; w?: number; fill: number; color: string; mark?: number}) => <>
  <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: 80, borderRadius: 40, background: 'rgba(255,255,255,0.18)', border: `6px solid ${WHITE}`, overflow: 'hidden', boxSizing: 'border-box'}}>
    <div style={{width: `${fill * 100}%`, height: '100%', background: color}} />
  </div>
  {mark !== undefined && <div style={{position: 'absolute', left: x - w / 2 + w * mark - 3, top: y - 30, width: 6, height: 140, background: WHITE, borderRadius: 3}} />}
  <div style={{position: 'absolute', left: x - w / 2, width: w, top: y + 100, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color}}>{Math.round(fill * 100)}% USED</div>
</>;

const Magnifier = ({x, y, rot = -20}: {x: number; y: number; rot?: number}) =>
  <svg width={220} height={220} viewBox="0 0 220 220" style={{position: 'absolute', left: x - 110, top: y - 110, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
    <line x1={140} y1={140} x2={205} y2={205} stroke={INK} strokeWidth={26} strokeLinecap="round" /><line x1={140} y1={140} x2={205} y2={205} stroke="#8B5A2B" strokeWidth={16} strokeLinecap="round" />
    <circle cx={90} cy={90} r={70} fill="rgba(200,235,255,0.35)" stroke={INK} strokeWidth={12} /><circle cx={90} cy={90} r={70} fill="none" stroke="#D7DDE2" strokeWidth={5} />
  </svg>;

// ---------- hook = the user's image, animated ----------
// Positions mirror videos/doug-credit/src/hook-ref.png (941x1671 scaled x1.1477).
const Hook = ({t}: {t: number}) => {
  const lv = sweep(t, P(1) + 0.2, P(1) + 1.2, 640, 550), rv = sweep(t, P(1) + 0.2, P(1) + 1.2, 640, 790);
  const scared = t > P(1) + 0.3;
  return <>
    <Hand t={t} x={540} y={350} size={128} text={<>what's the<br />difference<span style={{color: RED}}>?</span></>} />
    <Num t={t} x={270} y={598} size={118} color={RED} text="550" rot={0} />
    <Brush x={270} y={660} w={250} color={RED} />
    <Num t={t} x={803} y={598} size={118} color={GREEN} text="790" rot={0} />
    <Brush x={803} y={660} w={250} color={GREEN} />
    <Hand t={t} x={270} y={726} size={50} text="credit score" rot={0} />
    <Hand t={t} x={803} y={726} size={50} text="credit score" rot={0} />
    <div style={{position: 'absolute', left: 538, top: 505, width: 5, height: 1080, background: WHITE, borderRadius: 3}} />
    <div style={{position: 'absolute', left: 532, top: 940, width: 17, height: 17, borderRadius: 9, background: WHITE}} />
    <CarSprite x={260} y={836} w={470} side="l" t={t} />
    <CarSprite x={811} y={817} w={502} side="r" t={t} seed={1.3} />
    <Gauge x={264} y={1200} r={100} v={lv} />
    <Gauge x={803} y={1200} r={100} v={rv} />
    <Shadow x={235} y={1808} w={240} /><Shadow x={803} y={1808} w={260} />
    <Penguin id="doug" x={235} y={1808} h={360} shadow={false} pose={{look: [0.1, -0.7], brows: scared ? 'shock' : 'worried', eyeScale: scared ? 1.4 : 1.2, tears: true, sweat: true, tremble: scared ? 1 : 0.3, beak: 'frown', flapL: scared ? 40 + Math.sin(t * 14) * 20 : 10, flapR: scared ? 40 + Math.sin(t * 14 + 1) * 20 : 10}} />
    <div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${-Math.abs(Math.sin(t * 7)) * 34}px)`}}>
      <Otter x={803} y={1808} h={360} t={t} mood="cheer" />
    </div>
  </>;
};

// ---------- story shots ----------
const OneNumber = ({t}: {t: number}) => <>
  <Gauge x={540} y={900} r={300} v={575 + Math.sin(t * 5) * 140} label={false} />
  <Hand t={t} x={540} y={1240} size={150} text="?" at={P(3) + 0.2} color={RED} />
  <Hand t={t} x={540} y={330} size={130} text="one number" at={P(3)} />
</>;

const Named = ({t}: {t: number}) => <>
  <Gauge x={540} y={980} r={300} v={sweep(t, P(4), P(4) + 0.8, 450, 700)} label={false} />
  <Hand t={t} x={540} y={360} size={150} text="CREDIT SCORE" at={P(4) + 0.4} color="#FFE45C" />
  {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 140 + i * 200, top: 200 + (i % 2) * 260 + Math.sin(t * 6 + i) * 14, fontSize: 70, opacity: t > P(4) + 0.4 ? 1 : 0}}>✨</div>)}
</>;

const Range = ({t}: {t: number}) => <>
  <Gauge x={540} y={980} r={300} v={sweep(t, P(5) + 0.6, P(5) + 1.8, 300, 850)} label={false} />
  <Num t={t} x={190} y={1110} size={96} text="300" at={P(5) + 0.4} color={RED} rot={0} />
  <Num t={t} x={890} y={1110} size={96} text="850" at={P(5) + 1.5} color={GREEN} rot={0} />
  <Hand t={t} x={540} y={380} size={120} text="higher = better" at={P(6)} color={GREEN} />
  {t >= P(6) && <svg width={200} height={260} viewBox="0 0 200 260" style={{position: 'absolute', left: 820, top: 480 - ease((t - P(6)) / 0.4) * 40}}><path d="M100 250 L100 40 M30 110 L100 30 L170 110" stroke={GREEN} strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
</>;

const Bank = ({t}: {t: number}) => <>
  <Gauge x={760} y={700} r={170} v={620 + Math.sin(t * 3) * 6} />
  <Shadow x={330} y={FLOOR} w={300} />
  <Fox x={330} y={FLOOR} h={560} pen={false} sly={0.4} />
  <Magnifier x={620} y={760} rot={-10 + Math.sin(t * 4) * 6} />
  <Shadow x={860} y={FLOOR} w={200} />
  <Penguin id="doug" x={860} y={FLOOR} h={300} shadow={false} pose={{turn: -0.5, look: [-0.6, -0.3], flapL: 100, brows: 'worried'}} />
  <Hand t={t} x={540} y={330} size={110} text="bank checks" at={P(7) + 0.4} />
</>;

const Trust = ({t, high}: {t: number; high: boolean}) => {
  const at = high ? P(8) : P(9), shake = high ? 0 : Math.sin(t * 40) * 6;
  return <>
    <Gauge x={540} y={680} r={210} v={high ? 790 : 520} />
    <Shadow x={540 + shake} y={FLOOR} w={300} />
    <div style={{position: 'absolute', left: shake, top: 0}}><Fox x={540} y={FLOOR} h={600} mouth={high ? 0.6 : 0.2} sly={high ? 0 : 1} /></div>
    {!high && <Hand t={t} x={760} y={980} size={130} text="!" at={at + 0.4} color={RED} rot={10} />}
    <Hand t={t} x={540} y={300} size={110} text={high ? 'bank trust you' : 'bank scared'} at={at + 0.3} color={high ? GREEN : RED} />
    <Num t={t} x={540} y={1180} size={92} text={high ? 'SMALL INTEREST' : 'BIG INTEREST'} at={at + 1.2} color={high ? GREEN : RED} />
  </>;
};

const Person = ({t, who}: {t: number; who: 'friend' | 'doug'}) => {
  const f = who === 'friend', at = f ? P(10) : P(11);
  return <>
    <Gauge x={540} y={640} r={190} v={sweep(t, at, at + 0.9, 575, f ? 790 : 550)} />
    <Num t={t} x={540} y={290} size={140} text={f ? '790' : '550'} at={at + 0.3} color={f ? GREEN : RED} rot={0} />
    <Num t={t} x={f ? 800 : 280} y={1050} size={220} text={f ? '6%' : '19%'} at={at + 1.4} color={f ? GREEN : RED} rot={f ? -6 : 6} />
    <Hand t={t} x={f ? 800 : 280} y={1200} size={60} text="interest" at={at + 1.4} />
    <Shadow x={f ? 300 : 790} y={FLOOR} w={280} />
    {f ? <div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${-Math.abs(Math.sin(t * 7)) * 30}px)`}}><Otter x={300} y={FLOOR} h={460} t={t} mood="cheer" /></div>
      : <Penguin id="doug" x={790} y={FLOOR} h={460} shadow={false} pose={{brows: 'worried', beak: 'frown', tears: true, lids: 0.3, look: [-0.5, -0.4]}} />}
  </>;
};

const Price = ({t}: {t: number}) => <>
  <CarSprite x={540} y={620} w={820} side="r" t={t} />
  <Num t={t} x={540} y={420} size={150} text="$100,000" at={P(12) + 0.4} rot={-2} />
</>;

const Totals = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 538, top: 300, width: 5, height: 1100, background: WHITE, borderRadius: 3}} />
  <CarSprite x={270} y={420} w={440} side="l" t={t} />
  <CarSprite x={810} y={410} w={460} side="r" t={t} seed={1} />
  <Num t={t} x={810} y={840} size={96} text="$116,837" at={P(13) + 0.1} color={GREEN} rot={0} />
  <Num t={t} x={270} y={840} size={96} text="$157,033" at={P(13) + 1.4} color={RED} rot={0} />
  <Shadow x={270} y={FLOOR} w={240} /><Shadow x={810} y={FLOOR} w={240} />
  <Penguin id="doug" x={270} y={FLOOR} h={380} shadow={false} pose={{brows: t > P(13) + 1.4 ? 'shock' : 'worried', eyeScale: t > P(13) + 1.4 ? 1.4 : 1.1, tears: t > P(13) + 1.4, look: [0.2, -0.8]}} />
  <Otter x={810} y={FLOOR} h={380} t={t} mood="happy" flip />
</>;

const FortyK = ({t}: {t: number}) => <>
  <Num t={t} x={540} y={600} size={150} text="+$40,000" at={P(14)} color={RED} />
  <Hand t={t} x={540} y={830} size={110} text="for one number" at={P(14) + 1.1} />
  <Gauge x={540} y={1080} r={150} v={550} />
</>;

const Mood = ({t, at, kind}: {t: number; at: number; kind: 'poor' | 'angry' | 'happy'}) => {
  const pose = kind === 'poor' ? {lids: 0.35, brows: 'worried' as const, beak: 'frown' as const, tears: true}
    : kind === 'happy' ? {beak: 'smile' as const, brows: 'happy' as const, lids: 0.3, blush: 1, flapL: 120, flapR: 120}
    : {brows: 'angry' as const, angry: 1, beak: 'frown' as const, tremble: 1};
  return <>
    {kind === 'angry' && <AbsoluteFill style={{background: 'rgba(255,60,50,0.28)'}} />}
    {kind === 'happy' && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 200, top: 420 + (i % 2) * 120 + Math.sin(t * 6 + i) * 20, fontSize: 90}}>✨</div>)}
    {kind === 'angry' && [0, 1].map((i) => { const ph = (t * 1.5 + i / 2) % 1; return <div key={i} style={{position: 'absolute', left: 300 + i * 380, top: 560 - ph * 180, width: 90 + ph * 60, height: 90 + ph * 60, borderRadius: '50%', background: '#fff', border: `5px solid ${INK}`, opacity: 1 - ph}} />; })}
    <Penguin id="doug" x={540} y={1600} h={950} pose={pose} />
    <Hand t={t} x={540} y={330} size={140} text={`Doug ${kind}.`} at={at} color={kind === 'happy' ? GREEN : RED} />
  </>;
};

const Why = ({t}: {t: number}) => <>
  <Gauge x={720} y={700} r={200} v={550} />
  <Shadow x={300} y={FLOOR} w={260} />
  <Penguin id="doug" x={300} y={FLOOR} h={460} shadow={false} pose={{turn: 0.5, look: [0.8, -0.6], brows: 'worried', eyeScale: 1.2}} />
  <Hand t={t} x={440} y={880} size={180} text="?" at={P(16) + 0.3} color="#FFE45C" rot={12} />
  <Hand t={t} x={540} y={300} size={110} text="why so low?" at={P(16)} />
</>;

const MiniGauge = ({t, a, b, at}: {t: number; a: number; b: number; at: number}) => <>
  <Gauge x={820} y={360} r={110} v={sweep(t, at, at + 0.6, a, b)} />
  {t >= at && <Num t={t} x={820} y={540} size={80} text={`↓ ${Math.round(Math.max(b, lerp(a, b, ease((t - at) / 0.6))))}`} at={at} color={RED} rot={0} />}
</>;

const Late = ({t}: {t: number}) => <>
  <Bill x={400} y={850} t={t} at={P(17) + 0.5} />
  <MiniGauge t={t} a={640} b={600} at={E(17) - 0.8} />
</>;

const MaxedCard = ({t}: {t: number}) => <>
  <CreditCard x={540} y={640} w={560} rot={-4} label="CREDIT" />
  <Bar x={540} y={1000} fill={ease((t - P(18) - 0.3) / 1.0)} color={RED} />
  <MiniGauge t={t} a={600} b={575} at={E(18) - 0.8} />
</>;

const FiveCards = ({t}: {t: number}) => {
  const cols = ['#1E1E1E', '#2F6FD6', '#C8352B', '#2EA84A', '#8A4FD6'];
  return <>
    {cols.map((c, i) => { const at = P(19) + 0.2 + i * 0.3, p = pop(t, at); return p > 0 && <CreditCard key={i} x={540 + (i - 2) * 70} y={820 - Math.abs(i - 2) * 20} w={380} color={c} rot={(i - 2) * 12} s={p} />; })}
    <Num t={t} x={540} y={1230} size={110} text="5 IN 1 MONTH" at={P(19) + 1.2} color={RED} rot={-3} />
    <MiniGauge t={t} a={575} b={550} at={E(19) - 0.8} />
  </>;
};

const Up = ({t}: {t: number}) => <>
  <Gauge x={540} y={760} r={260} v={550 + Math.sin(t * 4) * 20} label={false} />
  <svg width={240} height={300} viewBox="0 0 200 260" style={{position: 'absolute', left: 820, top: 520 - Math.abs(Math.sin(t * 4)) * 30}}><path d="M100 250 L100 40 M30 110 L100 30 L170 110" stroke={GREEN} strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
  <Hand t={t} x={540} y={300} size={130} text="how to go up?" at={P(21)} color={GREEN} />
</>;

const OnTime = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 160, top: 420, width: 760, height: 560, background: '#FFFDF5', border: `7px solid ${INK}`, borderRadius: 24}}>
    <div style={{height: 90, background: RED, borderRadius: '16px 16px 0 0', borderBottom: `6px solid ${INK}`}} />
    {Array.from({length: 12}, (_, i) => { const p = pop(t, P(22) + 0.2 + i * 0.1);
      return <div key={i} style={{position: 'absolute', left: 30 + (i % 4) * 180, top: 120 + Math.floor(i / 4) * 140, width: 150, height: 110, borderRadius: 14, background: '#E9EEF5', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {p > 0 && <span style={{fontSize: 80, color: '#2EA84A', fontWeight: 900, transform: `scale(${p})`, fontFamily: 'Montserrat'}}>✓</span>}</div>; })}
  </div>
  <Num t={t} x={540} y={1150} size={100} text="#1 BIGGEST PART" at={E(22) - 1.2} color="#FFE45C" rot={-3} />
  <Hand t={t} x={540} y={300} size={110} text="pay on time" at={P(22)} color={GREEN} />
</>;

const Under30 = ({t}: {t: number}) => <>
  <CreditCard x={540} y={600} w={520} rot={3} color="#2F6FD6" label="CREDIT" />
  <Bar x={540} y={950} fill={0.25 * ease((t - P(23) - 0.3) / 1)} color={GREEN} mark={0.3} />
  <Num t={t} x={540} y={300} size={130} text="UNDER 30%" at={P(23) + 0.6} color={GREEN} rot={-2} />
</>;

const OldCard = ({t}: {t: number}) => <>
  <CreditCard x={540} y={700} w={600} color="#5C4632" rot={-3} label="SINCE 2012" />
  {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 300 + i * 220, top: 500 + Math.sin(t * 2 + i) * 12, width: 70, height: 4, background: 'rgba(255,255,255,0.6)', transform: 'rotate(-30deg)'}} />)}
  <div style={{position: 'absolute', left: 230, top: 1000, transform: `rotate(-10deg) scale(${pop(t, P(24) + 1)})`, border: `9px solid ${GREEN}`, borderRadius: 16, padding: '4px 30px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 96, color: GREEN, background: 'rgba(0,30,90,0.6)', opacity: t > P(24) + 1 ? 1 : 0}}>OLD = GOOD</div>
</>;

const Slow = ({t}: {t: number}) => {
  const g = ease((t - P(25)) / 1.8);
  return <>
    <svg width={700} height={420} viewBox="0 0 700 420" style={{position: 'absolute', left: 190, top: FLOOR - 420}}>
      <path d={`M0 420 Q 350 ${420 - 380 * g} 700 420 Z`} fill="#F4F9FF" stroke={INK} strokeWidth={7} />
    </svg>
    <Gauge x={540} y={560} r={200} v={550 + 60 * g} />
    <Hand t={t} x={540} y={250} size={110} text="slow..." at={P(25)} />
  </>;
};

const RealLife = ({t}: {t: number}) => <>
  <Hand t={t} x={540} y={300} size={110} text="real life" at={P(26)} />
  <Num t={t} x={290} y={700} size={190} text="19%" at={P(26) + 1.2} color={RED} rot={0} />
  <Hand t={t} x={290} y={860} size={60} text="low score" at={P(26) + 1.4} />
  <Num t={t} x={800} y={700} size={190} text="6%" at={P(27)} color={GREEN} rot={0} />
  <Hand t={t} x={800} y={860} size={60} text="high score" at={P(27) + 0.2} />
  <Hand t={t} x={540} y={1050} size={56} text="used car loan · Experian 2026" at={P(26) + 0.3} color="#BFD7FF" rot={0} />
</>;

const YearLater = ({t}: {t: number}) => <>
  <Hand t={t} x={540} y={300} size={110} text="1 year later" at={P(28) + 0.8} color="#FFE45C" />
  <Gauge x={540} y={740} r={260} v={sweep(t, P(28) + 1.2, P(28) + 2.2, 550, 650)} label={false} />
  {t >= P(28) + 1.4 && <Num t={t} x={540} y={980} size={130} text={`${Math.round(lerp(550, 650, ease((t - P(28) - 1.2) / 1)))}`} at={P(28) + 1.4} color={GREEN} rot={0} />}
  <Shadow x={540} y={FLOOR} w={240} />
  <Penguin id="doug" x={540} y={FLOOR} h={300} shadow={false} pose={{beak: 'smile', brows: 'happy', look: [0, -0.8]}} />
</>;

const Cta = ({t}: {t: number}) => <>
  <Gauge x={540} y={700} r={240} v={575 + Math.sin(t * 3) * 200} label={false} />
  <Hand t={t} x={540} y={330} size={120} text="what's YOUR score?" at={P(30)} color="#FFE45C" />
  <Shadow x={360} y={FLOOR} w={240} />
  <Penguin id="doug" x={360} y={FLOOR} h={380} shadow={false} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
  <Hand t={t} x={700} y={1250} size={150} text="👇" at={P(30) + 1} rot={0} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(3), set: (t) => <OneNumber t={t} />, fx_: 'zoom'},
  {at: P(4), set: (t) => <Named t={t} />, fx_: 'pop'},
  {at: P(5), set: (t) => <Range t={t} />, fx_: 'swipe'},
  {at: P(7), set: (t) => <Bank t={t} />, fx_: 'swipeL'},
  {at: P(8), set: (t) => <Trust t={t} high />, fx_: 'iris'},
  {at: P(9), set: (t) => <Trust t={t} high={false} />, fx_: 'swipe'},
  {at: P(10), set: (t) => <Person t={t} who="friend" />, fx_: 'swipeL'},
  {at: P(11), set: (t) => <Person t={t} who="doug" />, fx_: 'swipe'},
  {at: P(12), set: (t) => <Price t={t} />, fx_: 'zoom'},
  {at: P(13), set: (t) => <Totals t={t} />, fx_: 'swipeL'},
  {at: P(14), set: (t) => <FortyK t={t} />, fx_: 'pop'},
  {at: P(15), set: (t) => <Mood t={t} at={P(15)} kind="poor" />, fx_: 'zoom'},
  {at: P(16), set: (t) => <Why t={t} />, fx_: 'swipe'},
  {at: P(17), set: (t) => <Late t={t} />, fx_: 'pop'},
  {at: P(18), set: (t) => <MaxedCard t={t} />, fx_: 'swipeL'},
  {at: P(19), set: (t) => <FiveCards t={t} />, fx_: 'swipe'},
  {at: P(20), set: (t) => <Mood t={t} at={P(20)} kind="angry" />, fx_: 'zoom'},
  {at: P(21), set: (t) => <Up t={t} />, fx_: 'iris'},
  {at: P(22), set: (t) => <OnTime t={t} />, fx_: 'swipe'},
  {at: P(23), set: (t) => <Under30 t={t} />, fx_: 'swipeL'},
  {at: P(24), set: (t) => <OldCard t={t} />, fx_: 'pop'},
  {at: P(25), set: (t) => <Slow t={t} />, fx_: 'swipe'},
  {at: P(26), set: (t) => <RealLife t={t} />, fx_: 'iris'},
  {at: P(28), set: (t) => <YearLater t={t} />, fx_: 'swipeL'},
  {at: P(29), set: (t) => <Mood t={t} at={P(29)} kind="happy" />, fx_: 'zoom'},
  {at: P(30), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[11, 540, 900, 1.2], [14, 540, 640, 1.15]];

export const DougCredit = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: wide on frame 0 (contrast at a glance), push to Doug's side on "forty thousand more", wide again on the question
    const toDoug = ease((tc - P(1)) / 0.4) * (tc < P(2) ? 1 : 0);
    s0 = 1 + 0.16 * toDoug; fx = 540 - 230 * toDoug; fy = 960 + 120 * toDoug;
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (tc < 0.3 ? 1 : beat(tc, PH));
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <BlueBg t={t} />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    {tc >= P(3) && <Captions t={tc} phrases={PH} />}
    <Audio src={staticFile('doug-credit-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={P(1) + 0.3} name="user-wrong" vol={0.4} />
    <Sfx at={P(1) + 1.2} name="user-cash-register" vol={0.35} />
    <Sfx at={P(2)} name="user-boom" vol={0.4} />
    <Sfx at={P(4) + 0.4} name="user-ting" vol={0.4} />
    <Sfx at={P(5) + 1.5} name="user-pop" vol={0.35} />
    <Sfx at={P(6)} name="user-yeah" vol={0.3} />
    <Sfx at={P(8) + 1.2} name="user-wow" vol={0.35} />
    <Sfx at={P(9) + 0.4} name="user-shock" vol={0.35} />
    <Sfx at={P(10) + 1.4} name="user-ting" vol={0.4} />
    <Sfx at={P(11) + 1.4} name="user-boom" vol={0.4} />
    <Sfx at={P(12) + 0.4} name="user-cash-register" vol={0.35} />
    <Sfx at={P(13) + 0.1} name="user-money" vol={0.3} />
    <Sfx at={P(13) + 1.4} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(14)} name="user-boom" vol={0.45} />
    <Sfx at={P(15)} name="user-aww" vol={0.4} />
    <Sfx at={P(17)} name="user-notif" vol={0.35} />
    <Sfx at={P(17) + 0.5} name="user-slap" vol={0.4} />
    <Sfx at={E(17) - 0.8} name="user-wrong" vol={0.3} />
    <Sfx at={E(18) - 0.8} name="user-wrong" vol={0.3} />
    {[0, 1, 2, 3, 4].map((i) => <Sfx key={`c${i}`} at={P(19) + 0.2 + i * 0.3} name="user-pop" vol={0.25} />)}
    <Sfx at={E(19) - 0.8} name="user-fahh" vol={0.4} />
    <Sfx at={P(20)} name="user-shock" vol={0.4} />
    <Sfx at={P(22) + 0.2} name="user-timer" vol={0.25} />
    <Sfx at={E(22) - 1.2} name="user-ting" vol={0.4} />
    <Sfx at={P(23) + 0.6} name="user-pop" vol={0.35} />
    <Sfx at={P(24) + 1} name="user-slap" vol={0.35} />
    <Sfx at={P(26) + 1.2} name="user-boom" vol={0.35} />
    <Sfx at={P(27)} name="user-ting" vol={0.4} />
    <Sfx at={P(28) + 1.2} name="user-yeah" vol={0.35} />
    <Sfx at={P(29)} name="user-wow" vol={0.35} />
    <Sfx at={P(30)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
