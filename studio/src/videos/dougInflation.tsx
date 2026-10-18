// EP3 "Inflation Explained by Doug" — hook first (approval), full episode after. Line timings: studio/src/data/doug-inflation.json.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts} from '../engine';
import {HandFont} from '../sketch';
import {Fish, INK, Penguin, onTwos} from '../penguin/rig';
import {BigSeal, Puffin, Walrus} from '../penguin/cast';
import {BigWord, ConeStand, Crowd, FishFlight, FishPile, FishPrinter, FishReserve, HookTitle, IceCube, PriceTag, SnowCone, StatCard, Title} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-inflation.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_INFLATION_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1250, RED = '#D83A2E', GREEN = '#2E9E4F';
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);

// ---------- groceries (series style: flat fill + thick ink) ----------
const Bread = ({x, y}: {x: number; y: number}) => <g transform={`translate(${x} ${y})`}>
  <path d="M-60 30 L-60 -10 Q-60 -45 -25 -45 Q0 -60 25 -45 Q60 -45 60 -10 L60 30 Z" fill="#E3A857" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  {[-30, 0, 30].map((d) => <path key={d} d={`M${d - 10} -30 L${d + 10} -10`} stroke={INK} strokeWidth={4} strokeLinecap="round" />)}
</g>;
const Milk = ({x, y}: {x: number; y: number}) => <g transform={`translate(${x} ${y})`}>
  <path d="M-38 60 L-38 -40 L-18 -70 L18 -70 L38 -40 L38 60 Z" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  <rect x={-14} y={-92} width={28} height={22} rx={4} fill="#2F5DA8" stroke={INK} strokeWidth={5} />
  <rect x={-38} y={-10} width={76} height={36} fill="#2F5DA8" stroke={INK} strokeWidth={5} />
  <text x={0} y={17} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={24} fill="#fff">MILK</text>
</g>;
const Eggs = ({x, y}: {x: number; y: number}) => <g transform={`translate(${x} ${y})`}>
  {[-36, -12, 12, 36].map((d) => <ellipse key={d} cx={d} cy={-22} rx={13} ry={17} fill="#FFF8EA" stroke={INK} strokeWidth={4} />)}
  <path d="M-58 -16 L58 -16 L50 30 L-50 30 Z" fill="#C9B79C" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  <text x={0} y={18} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={22} fill={INK}>EGGS</text>
</g>;
// cart 400x360 box; items at bread(115,100) milk(215,80) eggs(307,95) in cart coords
const Cart = ({x, y}: {x: number; y: number}) =>
  <svg width={400} height={360} viewBox="0 0 400 360" style={{position: 'absolute', left: x - 200, top: y - 360, overflow: 'visible'}}>
    <Bread x={115} y={100} /><Milk x={215} y={70} /><Eggs x={307} y={100} />
    <path d="M30 120 L370 120 L330 280 L80 280 Z" fill="#DDE6EC" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {[1, 2, 3, 4, 5].map((i) => <line key={i} x1={30 + i * 57} y1={120} x2={80 + i * 42} y2={280} stroke={INK} strokeWidth={3} />)}
    <line x1={45} y1={180} x2={355} y2={180} stroke={INK} strokeWidth={3} /><line x1={60} y1={232} x2={343} y2={232} stroke={INK} strokeWidth={3} />
    <path d="M370 120 L392 60 L420 60" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
    <path d="M80 280 L68 306 L322 306" fill="none" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={110} cy={326} r={18} fill="#1B1B1B" /><circle cx={292} cy={326} r={18} fill="#1B1B1B" />
  </svg>;
const ITEM = {bread: [115, 100], milk: [215, 70], eggs: [307, 100]} as const;
const at = (cx: number, item: keyof typeof ITEM): [number, number] => [cx - 200 + ITEM[item][0], G - 360 + ITEM[item][1]];

const Price = ({text, x, y, at: a, color, t}: {text: string; x: number; y: number; at: number; color: string; t: number}) => {
  if (t < a) return null;
  const d = t - a, s = d < 0.14 ? 0.3 + 0.9 * (d / 0.14) : d < 0.24 ? 1.2 - 0.2 * ((d - 0.14) / 0.1) : 1;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(-4deg) scale(${s})`, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 140, color,
    WebkitTextStroke: '8px #fff', paintOrder: 'stroke fill', filter: `drop-shadow(0 6px 0 ${INK})`}}>{text}</div>;
};
// big centre words; the caption hides for exactly these windows (one text on screen at a time)
type Big = {text: string; at: number; until: number; x?: number; y?: number; color?: string; size: number};
const BIGS: Big[] = [
  {text: 'did nothing', at: P(7) + 0.2, until: P(8), size: 80},
  {text: 'poorer.', at: P(9), until: P(10), color: RED, size: 110},
  {text: 'same 10', at: P(17) + 0.5, until: P(18), x: 810, y: G - 760, size: 90},
  {text: 'more fish', at: P(18), until: P(19), x: 260, y: G - 520, color: GREEN, size: 80},
  {text: 'same cone', at: P(19), until: P(20), x: 800, y: G - 520, size: 80},
  {text: 'real life', at: P(28), until: P(28) + 0.2, y: 460, size: 110},
  {text: 'BRRRR', at: P(15), until: P(16), y: 560, size: 150},
  {text: '+50%', at: P(24) + 0.3, until: P(25), x: 580, y: 760, color: RED, size: 140},
  {text: '+5%', at: P(30), until: P(31), y: 620, color: GREEN, size: 170},
  {text: '+10%', at: P(33) + 0.2, until: P(34), y: 620, color: RED, size: 170},
];
// other full-screen text (title card, stat card) also mutes the caption
const QUIET: [number, number][] = [[P(21), P(22)], [P(28) + 0.2, P(29)]];
// "same eggs / milk / bread": the object itself pops in big, one at a time, synced to the word
const SAMES: [number, (p: {x: number; y: number}) => JSX.Element][] = [[4, Eggs], [5, Milk], [6, Bread]];
const SameObject = ({tc}: {tc: number}) => {
  const k = SAMES.findIndex(([i], n) => tc >= P(i) && tc < (n < 2 ? P(SAMES[n + 1][0]) : P(7)));
  if (k < 0) return null;
  const [i, Obj] = SAMES[k], d = tc - P(i), s = d < 0.1 ? 0.3 + 4.7 * (d / 0.1) : d < 0.18 ? 5 - 0.6 * ((d - 0.1) / 0.08) : 4.4;
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <g transform={`translate(540 980) scale(${s}) rotate(${Math.sin(tc * 6) * 3})`}><Obj x={0} y={0} /></g>
  </svg>;
};

const Hook = ({t}: {t: number}) => {
  const right = t >= P(2), done = t >= P(7), poor = t >= P(8);
  return <>
    {/* oversized so no white edge shows at any zoom/pan */}
    <div style={{position: 'absolute', left: -2000, top: -2000, width: 2540, height: 6000, background: '#EAF7EC'}} />
    <div style={{position: 'absolute', left: 540, top: -2000, width: 2540, height: 6000, background: '#FCEAE8'}} />
    <div style={{position: 'absolute', left: 535, top: 600, width: 10, height: 3000, background: INK}} />
    <HookTitle lines={['Inflation Explained', 'by Doug']} at={-1} y={300} />
    <div style={{position: 'absolute', left: 270, top: 560, transform: 'translate(-50%,-50%)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 90, color: INK}}>2020</div>
    <div style={{position: 'absolute', left: 810, top: 560, transform: 'translate(-50%,-50%)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 90, color: INK}}>TODAY</div>
    <Cart x={270} y={G} /><Cart x={810} y={G} />
    <Price text="$100" x={270} y={740} at={P(1) + 0.55} color={GREEN} t={t} />
    <Price text="$120+" x={810} y={740} at={P(3) + 0.35} color={RED} t={t} />
    <Penguin id="doug" x={540} y={G + 190} h={poor ? 420 : 360} pose={done
      ? {brows: poor ? 'shock' : 'worried', eyeScale: poor ? 1.35 : 1, pupil: poor ? 0.4 : 1, tremble: poor ? 1 : 0, tears: poor, flapL: poor ? 20 : 95, flapR: poor ? 20 : 95, beak: 'frown', look: [0, 0.2]}
      : {turn: right ? 0.6 : -0.6, look: [right ? 0.8 : -0.8, -0.4], brows: right ? 'shock' : 'worried', eyeScale: right ? 1.2 : 1, pupil: right ? 0.5 : 1, sweat: right}} />
  </>;
};

// ---------- Doug ice world (after the hook) ----------
const Ice = () => <>
  <div style={{position: 'absolute', left: -2000, top: -2000, width: 5080, height: 6000, background: '#fff'}} />
  <div style={{position: 'absolute', left: -2000, top: G - 10, width: 5080, height: 3000, background: '#E4F4FC', borderTop: `6px solid ${INK}`}} />
</>;
const Snowfall = ({t}: {t: number}) => <>{Array.from({length: 18}, (_, i) => { const sp = 50 + (i * 37) % 60, x = (i * 173) % 1080, y = ((i * 311) % 2000 + t * sp) % 2000 - 60;
  return <div key={i} style={{position: 'absolute', left: x, top: y, width: 10, height: 10, borderRadius: '50%', background: '#D6E8F3'}} />; })}</>;
const Heart = ({x, y, t}: {x: number; y: number; t: number}) => <div style={{position: 'absolute', left: x - 40, top: y - 40 - (t * 40) % 40, fontSize: 80, color: '#E8546A', fontFamily: 'Montserrat', fontWeight: 900}}>♥</div>;

const Intro = ({t}: {t: number}) => <>
  <Snowfall t={t} />
  <Penguin id="doug" x={420} y={G} h={520} pose={t < P(11) ? {flapR: 60, beak: 'smile', brows: 'happy'} : {beak: 'smile', brows: 'happy', lids: 0.3, look: [0.7, -0.3], blush: 1}} />
  {t >= P(11) && <><SnowCone x={790} y={G - 40} w={190} /><Heart x={590} y={G - 560} t={t} /></>}
  <PriceTag x={790} y={G - 420} price="1 fish" at={P(12)} color={GREEN} />
</>;

const Reserve = ({t}: {t: number}) => {
  const on = t >= P(14);
  return <>
    <FishReserve x={300} y={G} w={520} />
    <BigSeal x={300} y={G + 40} h={360} pose={{mouth: t < E(13) ? 0.5 : 0, flap: on ? 1 : 0}} />
    <FishPrinter x={790} y={G} w={380} on={on} />
    <FishFlight x1={790} y1={G - 300} x2={540} y2={G - 900} a={P(14) + 0.3} b={P(16) + 1} n={9} w={120} />
  </>;
};

const Everyone = ({t}: {t: number}) => <>
  <Crowd x={300} y={G} n={5} h={250} run={t < P(17) ? 1 : 0} />
  {[150, 300, 450].map((x, i) => <FishPile key={i} x={x} y={G + 70} n={4} w={90} seed={i} />)}
  {t >= P(17) && <>
    <ConeStand x={810} y={G} w={420} price="1 fish" cones={10} />
    <Puffin x={810} y={G - 230} h={170} pose={{smirk: true}} />
  </>}
</>;

const Equation = ({t}: {t: number}) => <>
  <FishPile x={260} y={G} n={14} w={120} />
  {t >= P(19) && <><SnowCone x={800} y={G - 20} w={180} /></>}
  {t >= P(20) && <PriceTag x={800} y={G - 760} price={t < P(20) + 0.5 ? '1 fish' : '2 fish'} at={P(20)} color={RED} />}
</>;

const Name = () => <Title lines={['INFLATION']} y={760} size={140} />;
const Stare = ({side}: {side?: boolean}) => <Penguin id="doug" x={540} y={1450} h={820} pose={{lids: 0.35, look: side ? [0.6, 0] : [0, 0], turn: side ? 0.4 : 0}} />;

const IceDeal = ({t}: {t: number}) => <>
  <Walrus x={330} y={G} h={430} flip pose={{mouth: t < E(23) ? 0.4 : 0, laugh: t >= P(24) ? 1 : 0}} />
  <IceCube x={590} y={G} w={260} sign={t >= P(24) ? '2 fish' : '1 fish'} />
  <Puffin x={840} y={G} h={300} pose={{look: -0.6}} />
</>;

const PuffinPays = ({t}: {t: number}) => <>
  <Walrus x={220} y={G} h={360} flip pose={{laugh: 1}} />
  <FishFlight x1={560} y1={G - 250} x2={260} y2={G - 300} a={P(25)} b={P(26)} n={6} w={100} />
  <ConeStand x={720} y={G} w={440} price={t >= P(27) ? '3 fish' : '2 fish'} cones={10} />
  <Puffin x={720} y={G - 240} h={180} pose={{smirk: t >= P(26), mouth: t >= P(26) && t < E(26) ? 0.5 : 0}} />
  {t >= P(27) && <PriceTag x={720} y={G - 900} price="3 fish" at={P(27)} color={RED} size={1.3} />}
</>;

const RealLife = () => <>
  <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: 'scale(1.15)', transformOrigin: '540px 900px'}}>
    <StatCard x={540} y={900} from="$100" to="$123" fromLabel="2020" toLabel="2025" at={P(28) + 0.2} note="US CPI (BLS)" />
  </div>
</>;

const Raise = ({t}: {t: number}) => {
  const rich = t >= P(31);
  return <>
    <Walrus x={280} y={G} h={400} flip hat pose={{mouth: t < E(29) ? 0.4 : 0}} />
    {t >= P(29) + 0.6 && <Fish x={lerp(380, 650, ease((t - P(29) - 0.6) / 0.5))} y={G - 300} w={120} id="raise" />}
    <Penguin id="doug" x={760} y={G} h={460} pose={rich ? {beak: 'smile', brows: 'happy', flapL: 130, flapR: 130, hop: Math.abs(Math.sin(t * 8))} : {look: [-0.6, 0]}} />
    {rich && <FishPile x={760} y={G + 80} n={6} w={90} />}
  </>;
};
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const GoBuy = ({t}: {t: number}) => <>
  <Penguin id="doug" x={lerp(180, 520, ease((t - P(32)) / 1))} y={G} h={380} pose={{side: true, turn: 1, run: true, beak: 'smile'}} />
  <ConeStand x={840} y={G} w={380} price="3 fish" cones={10} />
</>;

const Poorer = ({t}: {t: number}) => {
  const cry = t >= P(35);
  return <>
    <div style={{position: 'absolute', left: 230, top: G - 120, width: 160, height: 120, background: GREEN, border: `6px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 230, top: G - 150, width: 160, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, transform: 'translateY(-100%)'}}>PAY +5%</div>
    <div style={{position: 'absolute', left: 690, top: G - lerp(120, 240, ease((t - P(33)) / 0.4)), width: 160, height: lerp(120, 240, ease((t - P(33)) / 0.4)), background: RED, border: `6px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 690, top: G - 270, width: 160, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, transform: 'translateY(-100%)'}}>PRICE +10%</div>
    <Penguin id="doug" x={540} y={G + 80} h={cry ? 440 : 380} pose={cry ? {brows: 'worried', beak: 'frown', tears: true, look: [0, 0.3]} : {look: [0.6, -0.3], brows: 'worried'}} />
    {cry && <SnowCone x={650} y={G + 20} w={60} size={0.5} id="tiny" />}
  </>;
};

const Cta = ({t}: {t: number}) => <>
  <ConeStand x={820} y={G} w={340} price="4 fish" cones={6} />
  <Penguin id="doug" x={420} y={G + 120} h={600} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx; ice?: boolean};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(10), set: (t) => <Intro t={t} />, fx_: 'swipe', ice: true},
  {at: P(13), set: (t) => <Reserve t={t} />, fx_: 'zoom', ice: true},
  {at: P(16), set: (t) => <Everyone t={t} />, fx_: 'pop', ice: true},
  {at: P(18), set: (t) => <Equation t={t} />, fx_: 'iris', ice: true},
  {at: P(21), set: () => <Name />, fx_: 'pop'},
  {at: P(22), set: () => <Stare />, fx_: 'zoom'},
  {at: P(23), set: (t) => <IceDeal t={t} />, fx_: 'swipe', ice: true},
  {at: P(25), set: (t) => <PuffinPays t={t} />, fx_: 'swipeL', ice: true},
  {at: P(28), set: () => <RealLife />, fx_: 'iris'},
  {at: P(29), set: (t) => <Raise t={t} />, fx_: 'swipe', ice: true},
  {at: P(32), set: (t) => <GoBuy t={t} />, fx_: 'swipeL', ice: true},
  {at: P(33), set: (t) => <Poorer t={t} />, fx_: 'pop', ice: true},
  {at: P(36), set: () => <Stare side />, fx_: 'zoom'},
  {at: P(37), set: (t) => <Cta t={t} />, fx_: 'pop', ice: true},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [
  [8, 540, G - 120, 1.8], [9, 540, G - 120, 1.8], [12, 790, G - 300, 1.6], [14, 790, G - 220, 1.5], [20, 800, G - 500, 1.6],
  [24, 560, G - 120, 1.7], [27, 720, G - 600, 1.5], [31, 760, G - 250, 1.5], [35, 540, G - 220, 1.7],
];

export const DougInflation = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side named (2020 left, today right)
    const toL = ease((tc - 0.1) / 0.5) * (tc < P(2) ? 1 : 0), toR = ease((tc - P(2)) / 0.4) * (tc < P(4) ? 1 : 0);
    s0 = 1 + 0.14 * (toL + toR); fx = 540 - 230 * toL + 230 * toR; fy = 960 + 20 * (toL + toR);
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.1), dp = dz ? ease((tc - P(dz[0])) / 0.18) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, TIM);
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  const quiet = BIGS.some((b) => tc >= b.at && tc < b.until) || QUIET.some(([a, b]) => tc >= a && tc < b);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>
        {sh.ice && <Ice />}
        {sh.set(t)}
        {BIGS.map((b) => <BigWord key={b.text} text={b.text} x={b.x ?? 540} y={b.y ?? 960} at={b.at} until={b.until} color={b.color} size={b.size} />)}
      </AbsoluteFill>
    </AbsoluteFill>
    {sh.at === 0 && <SameObject tc={tc} />}
    {!quiet && <Captions t={tc} phrases={TIM} />}
    <Audio src={staticFile('doug-inflation-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.1} name="user-whoosh" vol={0.25} />
    <Sfx at={P(1) + 0.55} name="user-cash-register" vol={0.4} />
    <Sfx at={P(2)} name="user-whoosh" vol={0.3} />
    <Sfx at={P(3) + 0.35} name="user-boom" vol={0.5} />
    <Sfx at={P(3) + 0.4} name="user-cash-register" vol={0.3} />
    {SAMES.map(([i]) => <Sfx key={i} at={P(i)} name="user-pop" vol={0.45} />)}
    <Sfx at={P(7)} name="user-wrong" vol={0.35} />
    <Sfx at={P(9)} name="user-fahh" vol={0.5} />
    <Sfx at={P(10)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(12)} name="user-money" vol={0.35} />
    <Sfx at={P(13)} name="user-boom" vol={0.4} />
    <Sfx at={P(15)} name="user-horn" vol={0.3} />
    <Sfx at={P(16)} name="user-yeah" vol={0.35} />
    <Sfx at={P(17) + 0.5} name="user-pop" vol={0.35} />
    <Sfx at={P(20)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(20) + 0.5} name="user-wrong" vol={0.35} />
    <Sfx at={P(21)} name="user-pop" vol={0.4} />
    <Sfx at={P(22)} name="user-shock" vol={0.35} />
    <Sfx at={P(23)} name="walrus-grunt" vol={0.4} />
    <Sfx at={P(24) + 0.3} name="user-slap" vol={0.4} />
    <Sfx at={P(24) + 0.4} name="walrus-laugh" vol={0.35} />
    <Sfx at={P(25)} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(27)} name="user-cash-register" vol={0.4} />
    <Sfx at={P(28)} name="user-ting" vol={0.4} />
    <Sfx at={P(28) + 0.3} name="user-timer" vol={0.3} />
    <Sfx at={P(29) + 0.6} name="user-money" vol={0.35} />
    <Sfx at={P(30)} name="user-wow" vol={0.35} />
    <Sfx at={P(31)} name="user-yeah" vol={0.35} />
    <Sfx at={P(33) + 0.2} name="user-fahh" vol={0.45} />
    <Sfx at={P(35)} name="user-aww" vol={0.4} />
    <Sfx at={P(36)} name="user-wrong" vol={0.4} />
    <Sfx at={P(37)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
