// EP6 "How Poor vs Rich Penguins Buy a House" — fast cut (new shot every 1–2 s). Phrase timings: studio/src/data/doug-house.json.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {Fish, INK, Penguin, onTwos} from '../penguin/rig';
import {Fox, Puffin} from '../penguin/cast';
import {BigWord, FishFlight, FishPile, IceBank, Paper, PriceTag, Stamp, Title} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-house.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_HOUSE_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1460;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';

// Plain American suburban house (siding, gable roof, chimney, porch door, two windows).
const House = ({x, y, w = 440}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={w * 0.95} viewBox="0 0 440 418" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.95, overflow: 'visible'}}>
    <rect x={300} y={40} width={44} height={90} fill="#B5543C" stroke={INK} strokeWidth={5} />
    <path d="M20 200 L220 40 L420 200 Z" fill="#6E7C8A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <rect x={50} y={198} width={340} height={210} fill="#F3E6C8" stroke={INK} strokeWidth={6} />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M52 ${236 + i * 36} L388 ${236 + i * 36}`} stroke="#D9C9A4" strokeWidth={4} />)}
    <rect x={185} y={290} width={70} height={118} fill="#B23A2E" stroke={INK} strokeWidth={5} /><circle cx={242} cy={352} r={5} fill={INK} />
    {[85, 285].map((wx) => <g key={wx}><rect x={wx} y={240} width={72} height={66} fill="#BFE0F0" stroke={INK} strokeWidth={5} /><path d={`M${wx + 36} 240 L${wx + 36} 306 M${wx} 273 L${wx + 72} 273`} stroke={INK} strokeWidth={4} /></g>)}
    <rect x={30} y={404} width={380} height={12} fill="#9AA5AE" stroke={INK} strokeWidth={4} />
    <g transform="translate(108 -40)"><line x1={0} y1={0} x2={0} y2={170} stroke={INK} strokeWidth={6} />
      <rect width={96} height={60} fill="#fff" stroke={INK} strokeWidth={4} />{[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} y={i * 8.6} width={96} height={4.3} fill="#B22234" />)}
      <rect width={42} height={32} fill="#3C3B6E" />{[0, 1, 2].map((i) => <circle key={i} cx={9 + i * 12} cy={10 + (i % 2) * 10} r={2.6} fill="#fff" />)}
      <rect width={96} height={60} fill="none" stroke={INK} strokeWidth={4} /></g>
  </svg>;

const Label = ({text, x, color}: {text: string; x: number; color: string}) =>
  <div style={{position: 'absolute', left: x, top: 620, transform: 'translate(-50%,-50%)', textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 92, color, lineHeight: 1}}>
    {text}<div style={{height: 9, background: color, borderRadius: 5, marginTop: 6, transform: 'rotate(-2deg)'}} /></div>;

// Hook title: same hand font as the POOR / RICH labels, in blue (user).
const ClearTitle = ({lines, y, size}: {lines: string[]; y: number; size: number}) =>
  <div style={{position: 'absolute', left: 540, top: y, transform: 'translate(-50%,-50%)', textAlign: 'center'}}>
    {lines.map((l, i) => <div key={i} style={{fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: size, lineHeight: 1.15, whiteSpace: 'nowrap', color: '#1A7FE0'}}>{l}</div>)}
  </div>;

const POORT = P(1), RICHT = P(2);
// User hook (2026-10-19): poor penguin vs rich penguin, POOR / RICH labels, an American house behind each, NO prices.
const Hook = ({t}: {t: number}) => {
  const onRich = t >= RICHT;
  return <>
    <ClearTitle lines={['How Poor vs Rich', 'Penguins Buy a House']} y={240} size={88} />
    <div style={{position: 'absolute', left: 536, top: 520, width: 8, height: 1000, background: INK, borderRadius: 4}} />
    <Label text="POOR" x={270} color={RED} />
    <Label text="RICH" x={810} color={GREEN} />
    <House x={270} y={1260} w={500} />
    <House x={810} y={1260} w={500} />
    <Penguin id="doug" x={270} y={G} h={390} build="thin" pose={{turn: onRich ? 0.5 : 0, look: [onRich ? 0.9 : 0, -0.2], brows: onRich ? 'shock' : 'worried', eyeScale: onRich ? 1.2 : 1, pupil: onRich ? 0.5 : 1, sweat: true, beak: 'frown'}} />
    <Penguin id="rich" x={745} y={G} h={400} build="fat" outfit="rich" pose={{turn: -0.2, lids: 0.45, beak: 'smile', brows: 'happy'}} />
    <Fish id="onefish" x={385} y={1300} w={120} rot={-20} />
    <FishPile x={935} y={G} n={15} w={95} />
  </>;
};

// ---------- props ----------
const r = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const Desk = ({x, y, w = 760}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={200} viewBox="0 0 760 200" style={{position: 'absolute', left: x - w / 2, top: y - 200, overflow: 'visible'}}>
    <rect x={10} y={20} width={740} height={40} rx={8} fill="#A9744A" stroke={INK} strokeWidth={6} />
    <rect x={40} y={60} width={680} height={140} fill="#8C5C37" stroke={INK} strokeWidth={6} />
    <text x={380} y={150} textAnchor="middle" fontFamily="Architects Daughter" fontWeight={700} fontSize={56} fill="#F7E7C6">FOX BANK</text>
  </svg>;
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const Calendar = ({x, y, t, speed = 6, label, w = 260}: {x: number; y: number; t: number; speed?: number; label?: string; w?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, background: '#fff', border: `6px solid ${INK}`, borderRadius: 16, textAlign: 'center', overflow: 'hidden', boxShadow: '5px 7px 0 rgba(0,0,0,0.1)'}}>
    <div style={{background: RED, color: '#fff', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: w * 0.17, borderBottom: `6px solid ${INK}`}}>{label ?? MONTHS[Math.floor(t * speed) % 12]}</div>
    <div style={{fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: w * 0.42, color: INK, lineHeight: 1.1}}>1</div>
  </div>;
const Cake = ({x, y}: {x: number; y: number}) => <svg width={220} height={200} viewBox="0 0 220 200" style={{position: 'absolute', left: x - 110, top: y - 200, overflow: 'visible'}}>
  <rect x={20} y={90} width={180} height={100} rx={14} fill="#F7C6D0" stroke={INK} strokeWidth={6} />
  <path d="M20 120 Q65 140 110 120 Q155 100 200 120" fill="none" stroke="#fff" strokeWidth={10} />
  {[70, 110, 150].map((cx) => <g key={cx}><rect x={cx - 6} y={50} width={12} height={40} fill="#5EC4FA" stroke={INK} strokeWidth={3} /><path d={`M${cx} 22 Q${cx + 10} 38 ${cx} 46 Q${cx - 10} 38 ${cx} 22`} fill="#F5A524" /></g>)}</svg>;
const Tree = ({x, y}: {x: number; y: number}) => <svg width={300} height={420} viewBox="0 0 300 420" style={{position: 'absolute', left: x - 150, top: y - 420, overflow: 'visible'}}>
  <rect x={128} y={360} width={44} height={60} fill="#8C5C37" stroke={INK} strokeWidth={6} />
  <path d="M150 20 L270 360 L30 360 Z" fill="#2E9E4F" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  {[[110, 200], [190, 250], [130, 300], [170, 150], [90, 320], [220, 320]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={13} fill={i % 2 ? RED : '#F5C518'} stroke={INK} strokeWidth={3} />)}
  <path d="M150 0 l10 22 l24 3 l-18 16 l5 24 l-21 -12 l-21 12 l5 -24 l-18 -16 l24 -3 Z" fill="#F5C518" stroke={INK} strokeWidth={3} /></svg>;
const Cross = ({x, y, at, t, size = 220}: {x: number; y: number; at: number; t: number; size?: number}) => { if (t < at) return null; const p = r(t, at, at + 0.15);
  return <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: x - size / 2, top: y - size / 2, overflow: 'visible'}}>
    <path d={`M10 10 L${10 + 80 * Math.min(1, p * 2)} ${10 + 80 * Math.min(1, p * 2)}`} stroke={RED} strokeWidth={12} strokeLinecap="round" />
    {p > 0.5 && <path d={`M90 10 L${90 - 80 * (p - 0.5) * 2} ${10 + 80 * (p - 0.5) * 2}`} stroke={RED} strokeWidth={12} strokeLinecap="round" />}</svg>; };
const Big = ({text, x, y, at, size = 150, color = INK, rot = -3}: {text: string; x: number; y: number; at: number; size?: number; color?: string; rot?: number}) => <BigWord text={text} x={x} y={y} at={at} size={size} color={color} rot={rot} />;
const Cane = ({x, y}: {x: number; y: number}) => <svg width={80} height={300} viewBox="0 0 80 300" style={{position: 'absolute', left: x - 40, top: y - 300, overflow: 'visible'}}>
  <path d="M40 300 L40 40 Q40 10 64 14 Q78 18 76 34" fill="none" stroke="#8C5C37" strokeWidth={14} strokeLinecap="round" /></svg>;
const Sparkles = ({t, x, y}: {t: number; x: number; y: number}) => <>{[0, 1, 2, 3, 4].map((i) => { const a = i * 1.26 + t * 2, rr = 220 + Math.sin(t * 5 + i) * 20;
  return <svg key={i} width={60} height={60} viewBox="-30 -30 60 60" style={{position: 'absolute', left: x + Math.cos(a) * rr - 30, top: y + Math.sin(a) * rr * 0.6 - 30}}><path d="M0 -26 L7 -7 L26 0 L7 7 L0 26 L-7 7 L-26 0 L-7 -7 Z" fill="#F5C518" stroke={INK} strokeWidth={3} /></svg>; })}</>;

const DOUG = (o: Partial<React.ComponentProps<typeof Penguin>> & {pose?: React.ComponentProps<typeof Penguin>['pose']}) =>
  <Penguin id="doug" x={o.x ?? 300} y={o.y ?? G} h={o.h ?? 420} build="thin" pose={o.pose} />;
const RICH = (o: {x: number; y?: number; h?: number; flip?: boolean; pose?: React.ComponentProps<typeof Penguin>['pose']}) =>
  <Penguin id="rich" x={o.x} y={o.y ?? G} h={o.h ?? 440} build="fat" outfit="rich" pose={{lids: 0.45, beak: 'smile', brows: 'happy', ...o.pose}} />;

// ---------- sets ----------
const ToBank = ({t}: {t: number}) => { const p = ease(r(t, P(3), P(3) + 1.2));
  return <><IceBank x={720} y={1300} w={620} /><Fox x={760} y={1320} h={360} pose={{flap: t > P(3) + 0.8 ? -40 : 0}} />
    <DOUG x={lerp(-120, 330, p)} pose={{walk: p < 1 ? t * 2 : null, brows: 'worried', sweat: true}} /><Fish id="f1" x={lerp(-40, 410, p)} y={1290} w={110} rot={-20} /></>; };
const Give = ({t}: {t: number}) => <><Desk x={540} y={1460} /><Fox x={790} y={1300} h={480} pose={{flap: -60}} /><DOUG x={260} y={G + 20} pose={{eyeScale: 1.2, beak: 'smile', brows: 'happy', flapL: 60, flapR: 60}} />
  <FishFlight x1={760} y1={1050} x2={300} y2={1180} a={P(4) + 0.2} b={P(4) + 0.9} n={8} w={110} /></>;
const PayBack = ({t}: {t: number}) => <><Calendar x={540} y={330} t={t} speed={8} w={300} /><Fox x={800} y={G} h={460} pose={{greedy: true}} /><DOUG x={280} pose={{brows: 'worried', sweat: true, flapR: 70}} />
  {[0, 1, 2, 3].map((i) => <FishFlight key={i} x1={330} y1={1150} x2={760} y2={1180} a={P(5) + i * 0.32} b={P(5) + i * 0.32 + 0.4} n={1} w={110} seed={i} arc={260} />)}</>;
const Thirty = ({t}: {t: number}) => <>{Array.from({length: 9}, (_, i) => { const ph = (t * 1.6 + i / 9) % 1;
  return <Calendar key={i} x={140 + (i * 113) % 820} y={-260 + ph * 2200} t={t + i} speed={0} label={MONTHS[i % 12]} w={170} />; })}
  <Big text="30 YEARS" x={540} y={820} at={P(6)} size={190} color={RED} /><DOUG x={540} y={1380} h={380} pose={{brows: 'shock', eyeScale: 1.3, pupil: 0.4, tremble: 1}} /></>;
const Extra = ({t}: {t: number}) => { const n = 3 + Math.floor(r(t, P(6) + 1.3, E(7)) * 12);
  return <><Fox x={600} y={G} h={620} pose={{greedy: true, flap: -30, mouth: 0.4}} /><FishPile x={250} y={G} n={n} w={120} />
    <Big text="+ EXTRA FISH" x={540} y={520} at={P(6) + 1.3} size={120} color={GREEN} /><Calendar x={880} y={260} t={t} speed={10} w={200} /></>; };
const Interest = ({t}: {t: number}) => <><Title lines={['INTEREST']} y={760} at={P(8)} size={170} /><Fox x={540} y={G} h={480} pose={{greedy: true, flap: -80}} /><Sparkles t={t} x={540} y={760} /></>;
const Birthday = ({t}: {t: number}) => <><Cake x={300} y={1240} /><DOUG x={300} y={G} h={360} pose={{beak: 'frown', brows: 'worried', tears: true}} />
  <div style={{position: 'absolute', left: 250, top: 1000, width: 0, height: 0, borderLeft: '50px solid transparent', borderRight: '50px solid transparent', borderBottom: `110px solid #5EC4FA`}} />
  <Fox x={800} y={G} h={460} pose={{greedy: true}} /><FishFlight x1={360} y1={1150} x2={760} y2={1150} a={P(9) + 0.5} b={P(9) + 0.9} n={2} w={110} />
  <Big text="HAPPY BIRTHDAY?" x={540} y={560} at={P(9)} size={100} color="#1A7FE0" /></>;
const Christmas = ({t}: {t: number}) => <><Tree x={180} y={G} /><DOUG x={420} y={G} h={360} pose={{beak: 'frown', brows: 'worried', sweat: true}} />
  <Fox x={810} y={G} h={460} pose={{greedy: true, santa: true}} /><FishFlight x1={470} y1={1150} x2={770} y2={1150} a={P(10) + 0.5} b={P(10) + 0.9} n={3} w={110} />
  {Array.from({length: 14}, (_, i) => <div key={i} style={{position: 'absolute', left: (i * 173) % 1080, top: ((i * 311) % 1900 + t * 140) % 1900, width: 12, height: 12, borderRadius: '50%', background: '#BFD9EA'}} />)}</>;
const TinyDown = ({t}: {t: number}) => <><Desk x={540} y={1460} /><Fox x={800} y={1300} h={460} pose={{lids: 0.2, smirk: false, mouth: 0.3}} /><DOUG x={250} y={G + 20} h={400} pose={{flapR: 80, beak: 'smile'}} />
  <Fish id="tiny" x={500} y={1240} w={lerp(110, 50, r(t, P(11) + 0.4, P(11) + 0.9))} rot={0} /><Big text="tiny down payment" x={540} y={600} at={P(11) + 0.3} size={90} /></>;
const MoreFish = ({t}: {t: number}) => <><Fox x={540} y={G} h={680} pose={{greedy: true, flap: -90, mouth: 0.5}} /><Big text="MORE FISH!" x={540} y={480} at={P(12) + 0.2} size={150} color={RED} /></>;
const Insurance = ({t}: {t: number}) => <><Fox x={800} y={G} h={480} pose={{greedy: true, flap: -50}} /><DOUG x={260} pose={{brows: 'shock', eyeScale: 1.25, pupil: 0.45}} />
  <Paper x={520} y={720} w={380} title="FOX INSURANCE" amount="+ fish every month" at={P(13)} rot={-4} /></>;
const Stare = () => <Penguin id="doug" x={540} y={G + 360} h={1000} build="thin" pose={{lids: 0.35, look: [0, 0]}} />;
const Skip = ({t}: {t: number}) => { const p = ease(r(t, P(15), P(15) + 1.4));
  return <><IceBank x={300} y={1300} w={520} /><Fox x={360} y={1320} h={340} pose={{lids: 0.1, smirk: false, mouth: 0.3}} />
    <RICH x={lerp(1200, 820, p)} pose={{walk: p < 1 ? t * 2 : null, turn: -0.5}} /><Big text="NO THANKS" x={760} y={700} at={P(15) + 0.8} size={100} color={GREEN} /></>; };
const AllAtOnce = ({t}: {t: number}) => <><House x={760} y={1280} w={520} /><RICH x={260} h={460} pose={{flapR: 90}} /><FishPile x={280} y={G} n={6} w={120} />
  <FishFlight x1={320} y1={1100} x2={760} y2={1150} a={P(16) + 0.2} b={P(16) + 1.1} n={14} w={110} arc={460} /><Stamp text="PAID" x={760} y={950} at={P(16) + 1.1} color={GREEN} size={130} /></>;
const NoNoNo = ({t}: {t: number}) => <>
  <Fox x={210} y={900} h={340} /><Cross x={210} y={720} at={P(17) + 0.15} t={t} size={300} />
  {t >= P(18) && <><Big text="%" x={540} y={760} at={P(18)} size={260} color={RED} /><Cross x={540} y={740} at={P(18) + 0.2} t={t} size={280} /></>}
  {t >= P(19) && <><Calendar x={870} y={600} t={t} speed={0} label="30 YRS" w={240} /><Cross x={870} y={760} at={P(19) + 0.25} t={t} size={300} /></>}
  <RICH x={540} y={G} h={380} pose={{flapL: 100, flapR: 100}} /></>;
const RealPrice = ({t}: {t: number}) => <><House x={540} y={1300} w={640} /><PriceTag x={540} y={640} price="$420,000" at={P(20) + 1.6} size={1.2} color={INK} />
  <Big text="IN REAL LIFE" x={540} y={330} at={P(20)} size={110} color="#1A7FE0" /><div style={{position: 'absolute', left: 0, right: 0, top: 1380, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 40, color: '#556'}}>median US home · NAR, Sep 2026</div></>;
const Rate = ({t}: {t: number}) => <><Big text="7.4%" x={540} y={740} at={P(21) + 0.5} size={330} color={RED} /><Big text="mortgage rate" x={540} y={460} at={P(21)} size={100} />
  <Fox x={540} y={1400} h={300} pose={{greedy: true}} /><div style={{position: 'absolute', left: 0, right: 0, top: 960, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 40, color: '#556'}}>30-yr fixed · Freddie Mac, Oct 2026</div></>;
const Receipt = ({t}: {t: number}) => { const L = 120 + 1100 * ease(r(t, P(22) + 0.3, P(22) + 2.4));
  return <><div style={{position: 'absolute', left: 380, top: 300, width: 320, height: L, background: '#FFFDF5', border: `6px solid ${INK}`, borderTop: 'none', overflow: 'hidden'}}>
    {Array.from({length: 30}, (_, i) => <div key={i} style={{height: 8, margin: '22px 30px', background: '#C9CED4', width: `${50 + ((i * 37) % 45)}%`}} />)}</div>
    <DOUG x={200} y={G} h={380} pose={{brows: 'shock', eyeScale: 1.3, pupil: 0.4, tremble: 1, sweat: true}} />
    <Big text="$1,000,000+" x={540} y={250} at={P(22) + 1.4} size={150} color={RED} /></>; };
const Double = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 536, top: 400, width: 8, height: 1050, background: INK, borderRadius: 4}} />
  <House x={270} y={1150} w={460} /><House x={810} y={1150} w={460} />
  <PriceTag x={270} y={560} price="$1M+" at={P(23)} size={0.9} /><PriceTag x={810} y={560} price="$420K" at={P(23)} size={0.9} color={GREEN} />
  <DOUG x={270} y={G} h={300} pose={{brows: 'shock', eyeScale: 1.2}} /><RICH x={810} y={G} h={320} />
  <Big text="x2.4" x={540} y={330} at={P(23) + 0.6} size={170} color={RED} /></>;
const Second = ({t}: {t: number}) => <><House x={300} y={1240} w={460} /><House x={800} y={1240} w={460} /><RICH x={540} y={G} h={400} pose={{flapL: 80, flapR: 80}} />
  <Stamp text="SOLD" x={800} y={900} at={P(24) + 0.9} color={GREEN} size={110} />{t >= P(25) && <Big text="FOR RENT" x={800} y={600} at={P(25)} size={110} color="#1A7FE0" />}</>;
const RentPay = ({t}: {t: number}) => <><House x={540} y={1200} w={520} /><Puffin x={300} y={G} h={360} flip pose={{mouth: 0.2}} /><RICH x={800} y={G} h={420} />
  {[0, 1, 2].map((i) => <FishFlight key={i} x1={340} y1={1200} x2={760} y2={1200} a={P(26) + i * 0.5} b={P(26) + i * 0.5 + 0.45} n={1} w={100} seed={i} arc={240} />)}
  <Calendar x={540} y={260} t={t} speed={8} w={220} /></>;
const PaysItself = ({t}: {t: number}) => <><House x={540} y={1300} w={640} /><FishPile x={880} y={G} n={9 + Math.floor(r(t, P(27), E(27)) * 6)} w={110} />
  <Big text="pays for itself" x={540} y={460} at={P(27) + 0.1} size={120} color={GREEN} /><RICH x={220} y={G} h={360} pose={{lids: 0.2}} /></>;
const Empire = ({t}: {t: number}) => { const n = t < P(29) ? 2 : t < P(30) ? 3 : 4;
  return <>{[0, 1, 2, 3].slice(0, n).map((i) => <React.Fragment key={i}><House x={160 + (i % 2) * 760 - (i > 1 ? 0 : 0)} y={i < 2 ? 900 : 1380} w={380} />
      {i >= 2 && <Stamp text="SOLD" x={160 + (i % 2) * 760} y={i < 2 ? 760 : 1240} at={i === 2 ? P(29) + 0.2 : P(30) + 0.2} color={GREEN} size={80} />}</React.Fragment>)}
    <RICH x={540} y={1300} h={460} pose={{flapL: 100, flapR: 100}} /><FishPile x={540} y={G + 40} n={12} w={120} />
    {t >= P(29) && <Big text={n === 3 ? '3' : '4'} x={540} y={420} at={n === 3 ? P(29) : P(30)} size={220} color={GREEN} />}</>; };
const StillPay = ({t}: {t: number}) => <><Calendar x={540} y={300} t={t} speed={12} w={280} /><Fox x={790} y={G} h={480} pose={{greedy: true}} />
  <DOUG x={290} h={420} pose={{brows: 'worried', sweat: true, tears: true, flapR: 70}} />
  {[0, 1, 2].map((i) => <FishFlight key={i} x1={340} y1={1150} x2={750} y2={1150} a={P(31) + i * 0.35} b={P(31) + i * 0.35 + 0.35} n={1} w={100} seed={i} arc={220} />)}</>;
const Later = ({t}: {t: number}) => t < P(32) + 1.0
  ? <Title lines={['30 YEARS', 'LATER']} y={900} at={P(32)} size={150} />
  : <><House x={540} y={1260} w={600} /><DOUG x={460} y={G} h={400} pose={{lids: 0.3, brows: 'worried'}} /><Cane x={600} y={G} />
    <Stamp text="PAID OFF" x={540} y={760} at={P(32) + 1.1} color={GREEN} size={110} /></>;
const Happy = ({t}: {t: number}) => <><House x={540} y={1240} w={560} /><DOUG x={540} y={G} h={440} pose={{beak: 'smile', brows: 'happy', lids: 0.3, flapL: 120, flapR: 120, hop: Math.abs(Math.sin(t * 6))}} />
  <Sparkles t={t} x={540} y={1150} />{t >= P(34) && <Big text="life is good" x={540} y={520} at={P(34)} size={110} color={GREEN} />}</>;
const Look = ({t}: {t: number}) => <><House x={250} y={1260} w={440} /><House x={830} y={1260} w={440} /><DOUG x={250} y={G} h={340} pose={{turn: 0.7, look: [1, 0], beak: 'smile'}} />
  <RICH x={900} y={G} h={360} pose={{turn: -0.4}} /></>;
const Son = ({t}: {t: number}) => <><House x={700} y={1260} w={560} /><RICH x={860} y={G} h={420} pose={{turn: -0.4}} />
  <Penguin id="son" x={560} y={G} h={240} build="baby" pose={{flapR: 80, brows: 'worried', sweat: true}} /><FishFlight x1={600} y1={1300} x2={820} y2={1200} a={P(36)} b={P(36) + 0.4} n={1} w={90} />
  <DOUG x={180} y={G} h={380} pose={{brows: 'shock', eyeScale: 1.35, pupil: 0.35, tremble: 1, beak: 'frown'}} /></>;
const Cta = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 536, top: 520, width: 8, height: 1000, background: INK, borderRadius: 4}} />
  <Label text="DOUG?" x={270} color={RED} /><Label text="RICH?" x={810} color={GREEN} />
  <DOUG x={270} y={G} h={420} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} /><RICH x={810} y={G} h={430} />
  <Fish id="cta1" x={385} y={1300} w={110} rot={-20} /><FishPile x={1000} y={G} n={9} w={80} />
  <ClearTitle lines={['Doug or Rich?', 'Comment 👇']} y={280} size={90} /></>;

const SHOTS: {at: number; set: (t: number) => React.ReactNode; fx_?: Fx}[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(3), set: (t) => <ToBank t={t} />, fx_: 'swipe'},
  {at: P(4), set: (t) => <Give t={t} />, fx_: 'zoom'},
  {at: P(5), set: (t) => <PayBack t={t} />, fx_: 'swipeL'},
  {at: P(6), set: (t) => <Thirty t={t} />, fx_: 'pop'},
  {at: P(6) + 1.3, set: (t) => <Extra t={t} />, fx_: 'zoom'},
  {at: P(8), set: (t) => <Interest t={t} />, fx_: 'iris'},
  {at: P(9), set: (t) => <Birthday t={t} />, fx_: 'swipe'},
  {at: P(10), set: (t) => <Christmas t={t} />, fx_: 'swipeL'},
  {at: P(11), set: (t) => <TinyDown t={t} />, fx_: 'zoom'},
  {at: P(12), set: (t) => <MoreFish t={t} />, fx_: 'pop'},
  {at: P(13), set: (t) => <Insurance t={t} />, fx_: 'swipe'},
  {at: P(14), set: () => <Stare />, fx_: 'zoom'},
  {at: P(15), set: (t) => <Skip t={t} />, fx_: 'swipeL'},
  {at: P(16), set: (t) => <AllAtOnce t={t} />, fx_: 'zoom'},
  {at: P(17), set: (t) => <NoNoNo t={t} />, fx_: 'pop'},
  {at: P(20), set: (t) => <RealPrice t={t} />, fx_: 'iris'},
  {at: P(21), set: (t) => <Rate t={t} />, fx_: 'swipe'},
  {at: P(22), set: (t) => <Receipt t={t} />, fx_: 'zoom'},
  {at: P(23), set: (t) => <Double t={t} />, fx_: 'pop'},
  {at: P(24), set: (t) => <Second t={t} />, fx_: 'swipeL'},
  {at: P(26), set: (t) => <RentPay t={t} />, fx_: 'swipe'},
  {at: P(27), set: (t) => <PaysItself t={t} />, fx_: 'zoom'},
  {at: P(28), set: (t) => <Empire t={t} />, fx_: 'pop'},
  {at: P(31), set: (t) => <StillPay t={t} />, fx_: 'swipeL'},
  {at: P(32), set: (t) => <Later t={t} />, fx_: 'iris'},
  {at: P(33), set: (t) => <Happy t={t} />, fx_: 'zoom'},
  {at: P(35), set: (t) => <Look t={t} />, fx_: 'swipe'},
  {at: P(36), set: (t) => <Son t={t} />, fx_: 'zoom'},
  {at: P(37), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [phrase, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[4, 540, 1100, 1.3], [7, 280, 1300, 1.6], [11, 500, 1240, 1.9], [13, 540, 900, 1.4], [22, 540, 700, 1.25], [30, 540, 1100, 1.25], [36, 450, 1250, 1.4]];

export const DougHouse = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.02 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side named (poor, then rich)
    const toL = ease((tc - POORT) / 0.35) * (tc < RICHT ? 1 : 0), toR = ease((tc - RICHT) / 0.35) * (tc < E(2) + 0.2 ? 1 : 0);
    s0 = 1 + 0.22 * (toL + toR); fx = 540 - 270 * toL + 270 * toR; fy = 960 + 150 * (toL + toR);
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.2) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, TIM);
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-house-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={POORT + 0.5} name="user-aww" vol={0.3} />
    <Sfx at={RICHT + 0.3} name="user-money" vol={0.35} />
    <Sfx at={RICHT + 0.6} name="user-wow" vol={0.3} />
    <Sfx at={P(3) + 0.3} name="penguin-squawk" vol={0.3} />
    <Sfx at={P(4) + 0.3} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(5)} name="user-timer" vol={0.3} />
    <Sfx at={P(6)} name="user-boom" vol={0.4} />
    <Sfx at={P(6) + 1.3} name="user-cash-register" vol={0.35} />
    <Sfx at={P(7)} name="user-timer" vol={0.3} />
    <Sfx at={P(8)} name="user-pop" vol={0.4} />
    <Sfx at={P(9) + 0.5} name="user-slap" vol={0.35} />
    <Sfx at={P(10) + 0.5} name="user-cash-register" vol={0.3} />
    <Sfx at={P(11) + 0.4} name="user-pop" vol={0.35} />
    <Sfx at={P(12) + 0.2} name="user-boom" vol={0.35} />
    <Sfx at={P(13)} name="user-notif" vol={0.35} />
    <Sfx at={P(14)} name="user-shock" vol={0.4} />
    <Sfx at={P(15) + 0.8} name="user-yeah" vol={0.3} />
    <Sfx at={P(16) + 0.2} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(16) + 1.1} name="user-slap" vol={0.35} />
    {[P(17), P(18), P(19)].map((a, i) => <Sfx key={`x${i}`} at={a + 0.15} name="user-wrong" vol={0.25 + i * 0.05} />)}
    <Sfx at={P(20) + 1.6} name="user-cash-register" vol={0.4} />
    <Sfx at={P(21) + 0.9} name="user-ting" vol={0.4} />
    <Sfx at={P(22) + 0.3} name="user-cash-register" vol={0.3} />
    <Sfx at={P(22) + 1.4} name="user-fahh" vol={0.45} />
    <Sfx at={P(23) + 0.6} name="user-boom" vol={0.4} />
    <Sfx at={P(24) + 0.9} name="user-slap" vol={0.3} />
    <Sfx at={P(25)} name="user-pop" vol={0.35} />
    {[0, 1, 2].map((i) => <Sfx key={`r${i}`} at={P(26) + i * 0.5 + 0.4} name="user-money" vol={0.25} />)}
    <Sfx at={P(27) + 0.1} name="user-wow" vol={0.3} />
    <Sfx at={P(29) + 0.2} name="user-cash-register" vol={0.3} />
    <Sfx at={P(30) + 0.2} name="user-cash-register" vol={0.35} />
    <Sfx at={P(31)} name="user-aww" vol={0.35} />
    <Sfx at={P(32)} name="user-timer" vol={0.3} />
    <Sfx at={P(32) + 1.1} name="user-yeah" vol={0.35} />
    <Sfx at={P(34)} name="user-wow" vol={0.3} />
    <Sfx at={P(35) + 0.8} name="user-notif" vol={0.3} />
    <Sfx at={P(36)} name="user-fahh-long" vol={0.45} />
    <Sfx at={P(37)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
