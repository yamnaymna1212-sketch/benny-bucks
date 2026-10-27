// EP8 "Credit score: same car, Doug pays $10,000 more". Whole episode on the blue background of the user's hook image
// (videos/doug-credit/src/hook-ref.png; car sprites cut by tools/credit_plate.py). Line timings: studio/src/data/doug-credit.json.
// Facts only, no advice (user rule). Example: $25,000 used-car loan, 60 months, Experian Q1 2026 average used-car APR by
// VantageScore tier: 501-600 = 19.42% -> $654/mo, $14,258 interest ; 781-850 = 6.30% -> $487/mo, $4,209 interest ; diff $10,049.
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

const ReportCard = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 190, top: 480, width: 700, height: 760, background: '#FFFDF5', border: `8px solid ${INK}`, borderRadius: 22, transform: `rotate(-3deg) scale(${pop(t, P(7) + 0.2)})`, padding: 40, boxSizing: 'border-box'}}>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56, color: INK}}>REPORT CARD</div>
    <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 40, color: '#5A6B85', marginTop: 4}}>but for money</div>
    {['bills', 'cards', 'loans'].map((r, i) => <div key={r} style={{display: 'flex', justifyContent: 'space-between', marginTop: 34, fontFamily: HAND, fontWeight: 700, fontSize: 54, color: INK, borderBottom: '4px dashed #C9D3E0', paddingBottom: 10}}>
      <span>{r}</span><span>...</span></div>)}
    <div style={{position: 'absolute', right: 40, bottom: 40, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 90, color: RED, border: `7px solid ${RED}`, borderRadius: 50, padding: '0 26px', transform: 'rotate(-8deg)'}}>550</div>
  </div>
  <Hand t={t} x={540} y={320} size={110} text="like a report card" at={P(7)} />
</>;

const Bureaus = ({t}: {t: number}) => {
  const names = ['EQUIFAX', 'EXPERIAN', 'TRANSUNION'], d = (E(8) - P(8)) * 0.45;
  return <>
    <Hand t={t} x={540} y={320} size={100} text="3 companies keep it" at={P(8)} />
    {names.map((n, i) => { const at = P(8) + d + i * (E(8) - P(8) - d) / 3, p = pop(t, at);
      return p > 0 && <div key={n} style={{position: 'absolute', left: 140, top: 520 + i * 260, width: 800, height: 200, borderRadius: 26, background: '#FFFDF5', border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p}) rotate(${(i - 1) * 2}deg)`,
        fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color: '#1B3E8C'}}>📄 {n}</div>; })}
  </>;
};

const Bank = ({t}: {t: number}) => <>
  <Gauge x={760} y={700} r={170} v={620 + Math.sin(t * 3) * 6} />
  <Shadow x={330} y={FLOOR} w={300} />
  <Fox x={330} y={FLOOR} h={560} pen={false} sly={0.4} />
  <Magnifier x={620} y={760} rot={-10 + Math.sin(t * 4) * 6} />
  <Shadow x={860} y={FLOOR} w={200} />
  <Penguin id="doug" x={860} y={FLOOR} h={300} shadow={false} pose={{turn: -0.5, look: [-0.6, -0.3], flapL: 100, brows: 'worried'}} />
  <Hand t={t} x={540} y={330} size={110} text="bank checks" at={P(9) + 0.4} />
</>;

const Rent = ({t}: {t: number}) => {
  const go = ease((t - P(10) - 0.2) / 0.7), back = ease((t - P(10) - 1.3) / 0.7);
  return <>
    <Shadow x={260} y={FLOOR} w={300} /><Fox x={260} y={FLOOR} h={520} mouth={0.4} sly={0.6} />
    <Shadow x={850} y={FLOOR} w={220} /><Penguin id="doug" x={850} y={FLOOR} h={340} shadow={false} pose={{turn: -0.5, look: [-0.6, 0], flapL: 60}} />
    <Num t={t} x={lerp(330, 760, go)} y={900} size={120} text="$" color={GREEN} rot={0} />
    {t > P(10) + 1.3 && <Num t={t} x={lerp(760, 330, back)} y={1080} size={100} text="$ + %" color={RED} rot={0} />}
    <Hand t={t} x={540} y={330} size={110} text="interest = rent" at={P(10) + 1.3} color="#FFE45C" />
  </>;
};

const Trust = ({t, high}: {t: number; high: boolean}) => {
  const at = high ? P(11) : P(12), shake = high ? 0 : Math.sin(t * 40) * 6;
  return <>
    <Gauge x={540} y={680} r={210} v={high ? 790 : 520} />
    <Shadow x={540 + shake} y={FLOOR} w={300} />
    <div style={{position: 'absolute', left: shake, top: 0}}><Fox x={540} y={FLOOR} h={600} mouth={high ? 0.6 : 0.2} sly={high ? 0 : 1} /></div>
    {!high && <Hand t={t} x={760} y={980} size={130} text="!" at={at + 0.4} color={RED} rot={10} />}
    <Hand t={t} x={540} y={300} size={110} text={high ? 'bank trust you' : 'bank scared'} at={at + 0.3} color={high ? GREEN : RED} />
    <Num t={t} x={540} y={1180} size={92} text={high ? 'LOWER INTEREST' : 'HIGHER INTEREST'} at={at + 1.2} color={high ? GREEN : RED} />
  </>;
};

const Person = ({t, who}: {t: number; who: 'friend' | 'doug'}) => {
  const f = who === 'friend', at = f ? P(13) : P(14);
  return <>
    <Gauge x={540} y={640} r={190} v={sweep(t, at, at + 0.9, 575, f ? 790 : 550)} />
    <Num t={t} x={540} y={290} size={140} text={f ? '790' : '550'} at={at + 0.3} color={f ? GREEN : RED} rot={0} />
    <Num t={t} x={f ? 800 : 280} y={1050} size={220} text={f ? '6%' : '19%'} at={at + 1.6} color={f ? GREEN : RED} rot={f ? -6 : 6} />
    <Hand t={t} x={f ? 800 : 280} y={1200} size={56} text="avg interest" at={at + 1.6} />
    <Shadow x={f ? 300 : 790} y={FLOOR} w={280} />
    {f ? <div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${-Math.abs(Math.sin(t * 7)) * 30}px)`}}><Otter x={300} y={FLOOR} h={460} t={t} mood="cheer" /></div>
      : <Penguin id="doug" x={790} y={FLOOR} h={460} shadow={false} pose={{brows: 'worried', beak: 'frown', tears: true, lids: 0.3, look: [-0.5, -0.4]}} />}
  </>;
};

const Price = ({t}: {t: number}) => <>
  <CarSprite x={540} y={600} w={820} side="r" t={t} />
  <Num t={t} x={540} y={420} size={150} text="$25,000" at={P(15) + 0.5} rot={-2} />
  <Num t={t} x={540} y={1150} size={110} text="5 YEARS" at={P(15) + 1.5} color="#FFE45C" rot={2} />
  <Hand t={t} x={540} y={1280} size={50} text="example loan" at={P(15) + 1.5} color="#BFD7FF" rot={0} />
</>;

// split = friend right, Doug left (same as the hook)
const Split = ({t, l, r, at, atL, sub}: {t: number; l: string; r: string; at: number; atL: number; sub: string}) => <>
  <div style={{position: 'absolute', left: 538, top: 300, width: 5, height: 1100, background: WHITE, borderRadius: 3}} />
  <CarSprite x={270} y={420} w={440} side="l" t={t} />
  <CarSprite x={810} y={410} w={460} side="r" t={t} seed={1} />
  <Num t={t} x={810} y={840} size={96} text={r} at={at} color={GREEN} rot={0} />
  <Num t={t} x={270} y={840} size={96} text={l} at={atL} color={RED} rot={0} />
  <Hand t={t} x={810} y={940} size={50} text={sub} at={at} rot={0} />
  <Hand t={t} x={270} y={940} size={50} text={sub} at={atL} rot={0} />
  <Shadow x={270} y={FLOOR} w={240} /><Shadow x={810} y={FLOOR} w={240} />
  <Penguin id="doug" x={270} y={FLOOR} h={380} shadow={false} pose={{brows: t > atL ? 'shock' : 'worried', eyeScale: t > atL ? 1.4 : 1.1, tears: t > atL, look: [0.2, -0.8]}} />
  <Otter x={810} y={FLOOR} h={380} t={t} mood="happy" flip />
</>;

const TenK = ({t}: {t: number}) => <>
  <Num t={t} x={540} y={600} size={170} text="+$10,000" at={P(19)} color={RED} />
  <Hand t={t} x={540} y={830} size={110} text="for one number" at={P(19) + 1.1} />
  <Gauge x={540} y={1080} r={150} v={550} />
</>;

const Mood = ({t, at, kind}: {t: number; at: number; kind: 'poor' | 'angry'}) => {
  const pose = kind === 'poor' ? {lids: 0.35, brows: 'worried' as const, beak: 'frown' as const, tears: true}
    : {brows: 'angry' as const, angry: 1, beak: 'frown' as const, tremble: 1};
  return <>
    {kind === 'angry' && <AbsoluteFill style={{background: 'rgba(255,60,50,0.28)'}} />}
    {kind === 'angry' && [0, 1].map((i) => { const ph = (t * 1.5 + i / 2) % 1; return <div key={i} style={{position: 'absolute', left: 300 + i * 380, top: 560 - ph * 180, width: 90 + ph * 60, height: 90 + ph * 60, borderRadius: '50%', background: '#fff', border: `5px solid ${INK}`, opacity: 1 - ph}} />; })}
    <Penguin id="doug" x={540} y={1600} h={950} pose={pose} />
    <Hand t={t} x={540} y={330} size={140} text={`Doug ${kind}.`} at={at} color={RED} />
  </>;
};

const Why = ({t}: {t: number}) => <>
  <Gauge x={720} y={700} r={200} v={550} />
  <Shadow x={300} y={FLOOR} w={260} />
  <Penguin id="doug" x={300} y={FLOOR} h={460} shadow={false} pose={{turn: 0.5, look: [0.8, -0.6], brows: 'worried', eyeScale: 1.2}} />
  <Hand t={t} x={440} y={880} size={180} text="?" at={P(21) + 0.3} color="#FFE45C" rot={12} />
  <Hand t={t} x={540} y={300} size={110} text="why so low?" at={P(21)} />
</>;

// small gauge in the corner: the needle dips (no invented point values)
const MiniGauge = ({t, a, b, at}: {t: number; a: number; b: number; at: number}) => <>
  <Gauge x={820} y={360} r={110} v={sweep(t, at, at + 0.6, a, b)} />
  {t >= at && <Num t={t} x={820} y={540} size={90} text="↓" at={at} color={RED} rot={0} />}
</>;

const Late = ({t}: {t: number}) => <>
  <Bill x={400} y={850} t={t} at={P(22) + 0.4} />
  <MiniGauge t={t} a={620} b={590} at={P(22) + 0.6} />
</>;

const MaxedCard = ({t}: {t: number}) => <>
  <CreditCard x={540} y={640} w={560} rot={-4} label="CREDIT" />
  <Bar x={540} y={1000} fill={ease((t - P(23) - 0.2) / 0.9)} color={RED} />
  <MiniGauge t={t} a={590} b={570} at={P(23) + 1} />
</>;

const FiveCards = ({t}: {t: number}) => {
  const cols = ['#1E1E1E', '#2F6FD6', '#C8352B', '#2EA84A', '#8A4FD6'];
  return <>
    {cols.map((c, i) => { const at = P(24) + 0.2 + i * 0.25, p = pop(t, at); return p > 0 && <CreditCard key={i} x={540 + (i - 2) * 70} y={820 - Math.abs(i - 2) * 20} w={380} color={c} rot={(i - 2) * 12} s={p} />; })}
    <Num t={t} x={540} y={1230} size={110} text="5 IN 1 MONTH" at={P(24) + 1.1} color={RED} rot={-3} />
    <MiniGauge t={t} a={570} b={550} at={P(24) + 1.3} />
  </>;
};

const Risk = ({t}: {t: number}) => <>
  <Shadow x={400} y={FLOOR} w={300} />
  <Fox x={400} y={FLOOR} h={600} sly={1} mouth={0.2} />
  <Magnifier x={700} y={820} rot={-14 + Math.sin(t * 4) * 6} />
  {t >= P(25) + 0.8 && <div style={{position: 'absolute', left: 560, top: 520, transform: `rotate(-12deg) scale(${pop(t, P(25) + 0.8)})`, border: `10px solid ${RED}`, borderRadius: 18, padding: '4px 30px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 120, color: RED, background: 'rgba(255,255,255,0.92)'}}>RISK</div>}
</>;

const RealLife = ({t}: {t: number}) => <>
  <Hand t={t} x={540} y={300} size={110} text="real life" at={P(27)} />
  <Num t={t} x={290} y={700} size={190} text="19%" at={P(27) + 2.6} color={RED} rot={0} />
  <Hand t={t} x={290} y={860} size={60} text="low score" at={P(27) + 2.8} />
  <Num t={t} x={800} y={700} size={190} text="6%" at={P(28) + 0.3} color={GREEN} rot={0} />
  <Hand t={t} x={800} y={860} size={60} text="high score" at={P(28) + 0.5} />
  <Hand t={t} x={540} y={1050} size={40} text={<>average used-car loan APR<br />Experian, Q1 2026</>} at={P(27) + 0.4} color="#BFD7FF" rot={0} />
</>;

const SameDiff = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 538, top: 250, width: 5, height: 1150, background: WHITE, borderRadius: 3}} />
  <CarSprite x={260} y={330} w={470} side="l" t={t} />
  <CarSprite x={811} y={311} w={502} side="r" t={t} seed={1.3} />
  <Hand t={t} x={540} y={200} size={90} text="same car" at={P(29)} color={WHITE} rot={0} />
  <Gauge x={264} y={760} r={110} v={550} /><Gauge x={803} y={760} r={110} v={790} />
  <Num t={t} x={264} y={1000} size={90} text="$654/mo" at={P(29) + 1.4} color={RED} rot={0} />
  <Num t={t} x={803} y={1000} size={90} text="$487/mo" at={P(29) + 1.4} color={GREEN} rot={0} />
  <Shadow x={264} y={FLOOR} w={240} /><Shadow x={803} y={FLOOR} w={240} />
  <Penguin id="doug" x={264} y={FLOOR} h={340} shadow={false} pose={{brows: 'worried', tears: true, look: [0.2, -0.8]}} />
  <Otter x={803} y={FLOOR} h={340} t={t} mood="cheer" />
</>;

const Cta = ({t}: {t: number}) => <>
  <Gauge x={540} y={700} r={240} v={575 + Math.sin(t * 3) * 200} label={false} />
  <Hand t={t} x={540} y={330} size={120} text="what's YOUR score?" at={P(30)} color="#FFE45C" />
  <Shadow x={360} y={FLOOR} w={240} />
  <Penguin id="doug" x={360} y={FLOOR} h={380} shadow={false} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
  <Hand t={t} x={700} y={1250} size={150} text="👇" at={P(30) + 0.8} rot={0} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(3), set: (t) => <OneNumber t={t} />, fx_: 'zoom'},
  {at: P(4), set: (t) => <Named t={t} />, fx_: 'pop'},
  {at: P(5), set: (t) => <Range t={t} />, fx_: 'swipe'},
  {at: P(7), set: (t) => <ReportCard t={t} />, fx_: 'swipeL'},
  {at: P(8), set: (t) => <Bureaus t={t} />, fx_: 'swipe'},
  {at: P(9), set: (t) => <Bank t={t} />, fx_: 'iris'},
  {at: P(10), set: (t) => <Rent t={t} />, fx_: 'swipeL'},
  {at: P(11), set: (t) => <Trust t={t} high />, fx_: 'pop'},
  {at: P(12), set: (t) => <Trust t={t} high={false} />, fx_: 'swipe'},
  {at: P(13), set: (t) => <Person t={t} who="friend" />, fx_: 'swipeL'},
  {at: P(14), set: (t) => <Person t={t} who="doug" />, fx_: 'swipe'},
  {at: P(15), set: (t) => <Price t={t} />, fx_: 'zoom'},
  {at: P(16), set: (t) => <Split t={t} r="$487/mo" l="$654/mo" sub="every month" at={P(16) + 0.9} atL={P(16) + 2.4} />, fx_: 'swipeL'},
  {at: P(17), set: (t) => <Split t={t} r="$4,209" l="$14,258" sub="interest" at={P(17) + 0.3} atL={P(18) + 0.2} />, fx_: 'pop'},
  {at: P(19), set: (t) => <TenK t={t} />, fx_: 'zoom'},
  {at: P(20), set: (t) => <Mood t={t} at={P(20)} kind="poor" />, fx_: 'zoom'},
  {at: P(21), set: (t) => <Why t={t} />, fx_: 'swipe'},
  {at: P(22), set: (t) => <Late t={t} />, fx_: 'pop'},
  {at: P(23), set: (t) => <MaxedCard t={t} />, fx_: 'swipeL'},
  {at: P(24), set: (t) => <FiveCards t={t} />, fx_: 'swipe'},
  {at: P(25), set: (t) => <Risk t={t} />, fx_: 'iris'},
  {at: P(26), set: (t) => <Mood t={t} at={P(26)} kind="angry" />, fx_: 'zoom'},
  {at: P(27), set: (t) => <RealLife t={t} />, fx_: 'swipe'},
  {at: P(29), set: (t) => <SameDiff t={t} />, fx_: 'swipeL'},
  {at: P(30), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[19, 540, 640, 1.15]];
// pop on every big word (usual SFX)
const POPS = [P(3), P(4) + 0.4, P(5) + 0.4, P(5) + 1.5, P(6), P(7), P(8), P(9) + 0.4, P(10) + 1.3, P(11) + 0.3, P(12) + 0.3, P(13) + 0.3, P(14) + 0.3, P(16) + 0.9, P(16) + 2.4,
  P(19) + 1.1, P(21), P(24) + 1.1, P(27), P(28) + 0.3, P(29), P(29) + 1.4, P(30)];

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
    {POPS.map((at, i) => <Sfx key={`p${i}`} at={at} name="user-pop" vol={0.28} />)}
    <Sfx at={P(1) + 0.3} name="user-wrong" vol={0.4} />
    <Sfx at={P(1) + 1.2} name="user-cash-register" vol={0.35} />
    <Sfx at={P(2)} name="user-boom" vol={0.4} />
    <Sfx at={P(4) + 0.4} name="user-ting" vol={0.4} />
    <Sfx at={P(6)} name="user-yeah" vol={0.3} />
    {[0, 1, 2].map((i) => <Sfx key={`b${i}`} at={P(8) + (E(8) - P(8)) * 0.45 + i * (E(8) - P(8)) * 0.55 / 3} name="user-slap" vol={0.25} />)}
    <Sfx at={P(10) + 0.2} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(10) + 1.3} name="user-cash-register" vol={0.3} />
    <Sfx at={P(11) + 1.2} name="user-wow" vol={0.35} />
    <Sfx at={P(12) + 0.4} name="user-shock" vol={0.35} />
    <Sfx at={P(13) + 1.6} name="user-ting" vol={0.4} />
    <Sfx at={P(14) + 1.6} name="user-boom" vol={0.4} />
    <Sfx at={P(15) + 0.5} name="user-cash-register" vol={0.35} />
    <Sfx at={P(15) + 1.5} name="user-timer" vol={0.3} />
    <Sfx at={P(16) + 0.9} name="user-money" vol={0.3} />
    <Sfx at={P(16) + 2.4} name="user-money" vol={0.3} />
    <Sfx at={P(17) + 0.3} name="user-ting" vol={0.35} />
    <Sfx at={P(18) + 0.2} name="user-cash-register" vol={0.35} />
    <Sfx at={P(19)} name="user-boom" vol={0.45} />
    <Sfx at={P(20)} name="user-aww" vol={0.45} />
    <Sfx at={P(20) + 0.2} name="user-fahh" vol={0.35} />
    <Sfx at={P(22)} name="user-notif" vol={0.35} />
    <Sfx at={P(22) + 0.4} name="user-slap" vol={0.4} />
    <Sfx at={P(22) + 0.6} name="user-wrong" vol={0.3} />
    <Sfx at={P(23) + 1} name="user-wrong" vol={0.3} />
    {[0, 1, 2, 3, 4].map((i) => <Sfx key={`c${i}`} at={P(24) + 0.2 + i * 0.25} name="user-pop" vol={0.25} />)}
    <Sfx at={P(24) + 1.3} name="user-wrong" vol={0.3} />
    <Sfx at={P(25) + 0.8} name="user-slap" vol={0.4} />
    <Sfx at={P(26)} name="user-shock" vol={0.45} />
    <Sfx at={P(27) + 2.6} name="user-boom" vol={0.35} />
    <Sfx at={P(28) + 0.3} name="user-ting" vol={0.4} />
    <Sfx at={P(29) + 1.4} name="user-cash-register" vol={0.3} />
  </AbsoluteFill>;
};
