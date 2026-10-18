// EP4 "Full tank: $66 in the USA vs $0.45 in Iran" — hook = WhyHook main template, then the Doug ice world.
// Phrase timings: src/data/doug-gas-iran.json (tightened ElevenLabs VO, videos/doug-gas-iran/vo). P(i) = phrase i start.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {WhyHook} from '../penguin/whyHook';
import {INK, Penguin, PenguinPose, onTwos} from '../penguin/rig';
import {BigWord, FishFlight, FishPile, Igloo, PriceTag, Stamp, Title} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {Barrel, MoneyBag, OilGush, Pump, Snowfall, Snowmobile} from './dougGas';
import TIM from '../data/doug-gas-iran.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_GAS_IRAN_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1250, RED = '#D83A2E', GREEN = '#2E9E4F';
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => { const q = cl(p); return q * q * (3 - 2 * q); };
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// ---------- hook: Doug stares at the USA price, snaps to Iran with the camera, freaks out on "forty-five cents?" ----------
const hookDoug = (t: number): {pose: PenguinPose; mark: string} => {
  const toR = ease((t - P(1)) / 0.3), shock = ease((t - P(2)) / 0.15);
  const turn = -0.45 + 0.9 * toR;
  if (shock <= 0) return {mark: '?', pose: {turn, look: [turn < 0 ? -0.8 : 0.8, -0.2], brows: 'worried', beak: 'frown', flapL: 14, flapR: 14}};
  return {mark: '!', pose: {turn: 0.45, look: [0.8, -0.3], eyeScale: 1 + 0.4 * shock, pupil: 0.7, brows: 'shock', mouth: 0.7 * shock,
    flapL: 14 + 70 * shock, flapR: 14 + 70 * shock, hop: 40 * shock * Math.max(0, 1 - (t - P(2)) / 0.5), tremble: 0.6, sweat: true}};
};
const HookSet = ({t = -1}: {t?: number}) => { const d = t < 0 ? undefined : hookDoug(t);
  return <WhyHook dougPose={d?.pose} mark={d?.mark}
    left={{flag: 'usa', price: '$66', unit: 'FULL TANK', obj: 'pump', color: '#2F5DA8'}}
    right={{flag: 'iran', price: '$0.45', unit: 'FULL TANK', obj: 'pump', color: '#2E9E4F'}} />; };
export const DougGasIranHook = () => <HookSet />;
const hookCam = (t: number) => {
  const toL = ease((t - 0.6) / 0.9) * (1 - ease((t - P(1)) / 0.35));
  const toR = ease((t - P(1)) / 0.35) * (1 - ease((t - P(2) - 0.15) / 0.3));
  return {s: 1 + 0.16 * (toL + toR), x: 540 + (225 - 540) * toL + (855 - 540) * toR, y: 960 + (760 - 960) * (toL + toR)};
};

// ---------- small props ----------
const Ice = () => <>
  <div style={{position: 'absolute', left: -2000, top: -2000, width: 5080, height: 6000, background: '#fff'}} />
  <div style={{position: 'absolute', left: -2000, top: G - 10, width: 5080, height: 3000, background: '#E4F4FC', borderTop: `6px solid ${INK}`}} />
</>;
const Sky = () => <div style={{position: 'absolute', left: -2000, top: -2000, width: 5080, height: 6000, background: '#E8F5FC'}} />;
const FlagTag = ({x, y, text, color}: {x: number; y: number; text: string; color: string}) =>
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%) rotate(-3deg)', background: color, color: '#fff', border: `6px solid ${INK}`, borderRadius: 14,
    padding: '4px 26px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, whiteSpace: 'nowrap'}}>{text}</div>;
const Plane = ({x, y, rot = 0, w = 460}: {x: number; y: number; rot?: number; w?: number}) =>
  <svg width={w} height={w * 0.5} viewBox="0 0 460 230" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.25, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
    <path d="M40 120 Q40 90 90 90 L380 90 Q440 95 450 120 Q440 145 380 150 L90 150 Q40 150 40 120 Z" fill="#fff" stroke={INK} strokeWidth={7} />
    <path d="M200 100 L150 20 L190 20 L270 100 Z M200 140 L150 220 L190 220 L270 140 Z M60 95 L30 40 L70 40 L110 95 Z" fill="#5EC4FA" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={170 + i * 40} cy={115} r={11} fill="#BFE0F0" stroke={INK} strokeWidth={4} />)}
  </svg>;
const Bill = ({x, y, w = 300, text = '$1'}: {x: number; y: number; w?: number; text?: string}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.45, width: w, height: w * 0.45, background: '#CFE8C8', border: `6px solid ${INK}`, borderRadius: 12,
    boxShadow: 'inset 0 0 0 10px #B5D9AB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.3, color: INK}}>{text}</div>;
const Rials = ({x, y, n}: {x: number; y: number; n: number}) => <>{Array.from({length: Math.round(n)}, (_, i) =>
  <div key={i} style={{position: 'absolute', left: x - 150 + ((i * 53) % 40) - 20, top: y - 34 - i * 30, width: 300, height: 60, background: '#F3E3C4', border: `5px solid ${INK}`, borderRadius: 8,
    transform: `rotate(${((i * 37) % 9) - 4}deg)`, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A6A3A'}}>RIAL</div>)}</>;
const Bread = ({x, y, s = 1}: {x: number; y: number; s?: number}) =>
  <svg width={240 * s} height={150 * s} viewBox="-120 -90 240 150" style={{position: 'absolute', left: x - 120 * s, top: y - 150 * s, overflow: 'visible'}}>
    <path d="M-110 50 L-110 -10 Q-110 -70 -50 -70 Q0 -95 50 -70 Q110 -70 110 -10 L110 50 Z" fill="#E3A857" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {[-55, 0, 55].map((d) => <path key={d} d={`M${d - 16} -48 L${d + 16} -16`} stroke={INK} strokeWidth={6} strokeLinecap="round" />)}
  </svg>;
const FuelCard = ({x, y}: {x: number; y: number}) =>
  <div style={{position: 'absolute', left: x - 200, top: y - 125, width: 400, height: 250, background: GREEN, border: `7px solid ${INK}`, borderRadius: 24, color: '#fff',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, padding: 26, boxSizing: 'border-box'}}>FUEL CARD<div style={{width: 70, height: 52, background: '#F5C518', border: `4px solid ${INK}`, borderRadius: 8, marginTop: 30}} /></div>;
const JerryCan = ({x, y, fill}: {x: number; y: number; fill: number}) =>
  <svg width={260} height={320} viewBox="0 0 260 320" style={{position: 'absolute', left: x - 130, top: y - 320, overflow: 'visible'}}>
    <defs><clipPath id="jc"><path d="M20 70 L170 70 L240 140 L240 310 L20 310 Z" /></clipPath></defs>
    <rect x={0} y={310 - 240 * fill} width={260} height={240 * fill} fill={RED} clipPath="url(#jc)" />
    <path d="M20 70 L170 70 L240 140 L240 310 L20 310 Z" fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M170 70 L200 20 L230 36 L205 86" fill="none" stroke={INK} strokeWidth={9} />
  </svg>;

// ---------- sets (one idea per shot) ----------
const Smell = ({t}: {t: number}) => <>
  <Pump x={820} y={G + 40} t={t} run={false} dollars={0.45} />
  <Penguin id="doug" x={420} y={G + 260} h={820} pose={{turn: 0.4, look: [0.8, -0.2], lids: t >= P(4) ? 0.45 : 0, brows: t >= P(4) ? 'angry' : 'worried', beak: 'frown', squash: Math.sin(t * 18) > 0.6 && t >= P(4) ? 0.15 : 0}} />
  <Stamp text="SAME GAS" x={540} y={520} at={P(3)} color={INK} size={100} />
</>;

const Ride = ({t}: {t: number}) => { const x = lerp(200, 560, ease((t - P(5)) / 0.6));
  return <>
    <Snowfall t={t} />
    {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: ((i * 300 - t * 900) % 1400 + 1400) % 1400 - 200, top: G + 20 + i * 14, width: 160, height: 6, background: '#D6E8F3', borderRadius: 3}} />)}
    <Snowmobile x={x} y={G} t={t} moving />
    <Penguin id="doug" x={x - 30} y={G - 120} h={330} pose={{side: true, turn: 1, beak: 'smile', brows: 'happy'}} />
  </>; };

const FillUSA = ({t}: {t: number}) => { const d = Math.min(66.15, 66.15 * ease((t - P(7)) / 1.3));
  return <>
    <FlagTag x={540} y={420} text="USA" color="#2F5DA8" />
    <Pump x={700} y={G + 40} t={t} run={d < 66} dollars={d} />
    <Penguin id="doug" x={330} y={G + 40} h={430} pose={{turn: 0.5, look: [0.8, -0.3], brows: d > 50 ? 'shock' : 'worried', eyeScale: d > 50 ? 1.25 : 1, sweat: d > 50}} />
    <FishFlight x1={330} y1={G - 300} x2={700} y2={G - 380} a={P(8) + 0.2} b={E(8) + 0.4} n={7} w={110} />
    <PriceTag x={760} y={640} price="$66" fish="almost 7 fish" at={P(8)} />
  </>; };

const Fly = ({t}: {t: number}) => { const p = ease((t - P(9)) / (P(10) - P(9)));
  return <>
    <Sky />
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}><path d="M60 1300 Q540 500 1020 900" stroke={INK} strokeWidth={6} strokeDasharray="16 20" fill="none" opacity={0.4} /></svg>
    <FlagTag x={170} y={1420} text="USA" color="#2F5DA8" /><FlagTag x={900} y={1020} text="IRAN" color={GREEN} />
    <Plane x={lerp(60, 1020, p)} y={lerp(1300, 900, p) - Math.sin(p * Math.PI) * 420} rot={-25 + 45 * p} />
  </>; };

const FillIran = ({t}: {t: number}) => { const rich = t >= P(11), d = 0.45 * ease((t - P(10)) / 0.6);
  return <>
    <FlagTag x={540} y={420} text="IRAN" color={GREEN} />
    <Pump x={720} y={G + 40} t={t} run={false} dollars={d} />
    <Penguin id="doug" x={330} y={G + 40} h={rich ? 480 : 430} pose={rich ? {beak: 'smile', brows: 'happy', flapL: 130, flapR: 130, hop: Math.abs(Math.sin(t * 9)) * 40, eyeScale: 1.2}
      : {turn: 0.5, look: [0.8, -0.3], brows: 'shock', eyeScale: 1.3, pupil: 0.6, mouth: 0.4}} />
    <PriceTag x={760} y={640} price="$0.45" fish="full tank" at={P(10) + 0.5} color={GREEN} />
  </>; };

const OilLand = ({t}: {t: number}) => <>
  <OilGush x={260} y={G} t={t} at={P(13)} /><OilGush x={560} y={G} t={t} at={P(13) + 0.25} /><OilGush x={840} y={G} t={t} at={P(14)} />
  {t >= P(14) && [0, 1, 2, 3, 4, 5].map((i) => <Barrel key={i} x={150 + i * 150} y={G + 140 - (i % 2) * 20} />)}
  <FlagTag x={540} y={420} text="IRAN" color={GREEN} />
</>;

const GovPays = ({t}: {t: number}) => <>
  <Pump x={720} y={G + 40} t={t} run={false} dollars={0.45} />
  <MoneyBag x={260} y={G + 40} w={300} label="GOV" />
  <FishFlight x1={260} y1={G - 340} x2={700} y2={G - 360} a={P(15) + 0.3} b={E(15) + 0.4} n={5} w={100} />
  {t >= P(16) && <PriceTag x={720} y={560} price="cheap" fish="on purpose" at={P(16)} color={GREEN} />}
</>;

const Name = () => <Title lines={['SUBSIDY']} y={760} size={140} />;
const Stare = ({marks}: {marks?: boolean}) => <>
  <Penguin id="doug" x={540} y={G + 300} h={950} pose={{lids: 0.35, look: [0, 0], brows: marks ? 'worried' : 'none'}} />
  {marks && <BigWord text="?" x={830} y={420} at={-1} size={220} />}
</>;

const Trick = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: -2000, top: -2000, width: 5080, height: 6000, background: '#24292E'}} />
  <div style={{position: 'absolute', left: 540 - 420, top: 1000 - 420, width: 840, height: 840, borderRadius: '50%', background: 'radial-gradient(#FFF8DC, rgba(255,248,220,0) 70%)'}} />
  <Penguin id="doug" x={540} y={1400} h={620} pose={{look: [Math.sin(t * 3) * 0.8, 0], brows: 'worried', sweat: true}} />
</>;

const Broken = ({t}: {t: number}) => { const n = 2 + 13 * ease((t - P(21)) / 1.6);
  return <>
    <Bill x={270} y={G - 520} w={300} />
    <div style={{position: 'absolute', left: 270, top: G - 470, transform: 'translateX(-50%)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, color: INK}}>=</div>
    <Rials x={760} y={G} n={n} />
    {t >= P(20) && <Stamp text="BROKEN" x={760} y={G - 260} at={P(20)} color={RED} size={110} />}
    <Penguin id="doug" x={270} y={G + 40} h={360} pose={{turn: 0.5, look: [0.8, -0.6], brows: 'shock', eyeScale: 1.2}} />
  </>; };

const Everything = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 0, top: 360, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: GREEN}}>GAS</div>
  <div style={{position: 'absolute', left: 540, top: 360, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: RED}}>EVERYTHING</div>
  <div style={{position: 'absolute', left: 535, top: 330, width: 10, height: 1000, background: INK}} />
  <Pump x={270} y={G} t={t} run={false} dollars={0.45} />
  {t >= P(23) && t < P(24) && <PriceTag x={810} y={780} price="$$$" at={P(23)} />}
  {t >= P(24) && <><Bread x={810} y={G - lerp(0, 220, ease((t - P(24)) / 0.5))} s={1.1} /><PriceTag x={700} y={600} price="↑" fish="bread" at={P(24)} size={0.8} /></>}
  {t >= P(25) && <><Igloo x={900} y={G} w={260} /><PriceTag x={930} y={600} price="↑" fish="rent" at={P(25)} size={0.8} /></>}
</>;

const Quota = ({t}: {t: number}) => { const fill = cl((t - P(28)) / 1.0);
  return <>
    <FuelCard x={300} y={G - 420} />
    <JerryCan x={780} y={G} fill={fill} />
    {t >= P(28) && <BigWord text="60 L / month" x={780} y={G - 420} at={P(28) + 0.3} size={80} />}
    {t >= P(29) && <PriceTag x={300} y={G - 120} price="x2" fish="after 60 L" at={P(29) + 0.3} />}
  </>; };

const LookLook = ({t}: {t: number}) => { const right = t >= P(32), sad = t >= P(34);
  return <>
    <Pump x={200} y={G} t={t} run={false} dollars={0.45} />
    <Bread x={880} y={G} s={1.1} />
    <PriceTag x={880} y={760} price="$$$" at={P(33)} />
    {t >= P(31) && <PriceTag x={200} y={760} price="cheap" at={P(31)} color={GREEN} size={0.8} />}
    <Penguin id="doug" x={540} y={G + 60} h={520} pose={{turn: right ? 0.6 : -0.6, look: [right ? 0.8 : -0.8, -0.1], brows: sad ? 'worried' : 'happy', beak: sad ? 'frown' : 'smile', tears: sad}} />
  </>; };

const Home = ({t}: {t: number}) => { const happy = t >= P(37);
  return <>
    <FlagTag x={540} y={420} text="USA" color="#2F5DA8" />
    <Pump x={720} y={G + 40} t={t} run={false} dollars={4.4} />
    <PriceTag x={760} y={640} price="$4.40" fish="per gallon" at={P(36)} />
    <Penguin id="doug" x={330} y={G + 40} h={460} pose={happy ? {beak: 'smile', brows: 'happy', lids: 0.25, blush: 1} : {turn: 0.5, look: [0.8, -0.2]}} />
  </>; };

const Choice = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 60, top: 420, width: 440, padding: 24, border: `7px solid ${INK}`, borderRadius: 26, background: '#EAF7EC', textAlign: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, lineHeight: 1.15}}>CHEAP GAS<br /><span style={{color: RED}}>BROKEN MONEY</span></div>
  {t >= P(40) && <div style={{position: 'absolute', left: 580, top: 420, width: 440, padding: 24, border: `7px solid ${INK}`, borderRadius: 26, background: '#FCEAE8', textAlign: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, lineHeight: 1.15}}>EXPENSIVE GAS<br /><span style={{color: GREEN}}>STRONG MONEY</span></div>}
  <Penguin id="doug" x={540} y={G + 140} h={560} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.2, 0.6], brows: 'happy'}} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx; ice?: boolean};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <HookSet t={t} />},
  {at: P(3), set: (t) => <Smell t={t} />, fx_: 'zoom', ice: true},
  {at: P(5), set: (t) => <Ride t={t} />, fx_: 'swipe', ice: true},
  {at: P(7), set: (t) => <FillUSA t={t} />, fx_: 'pop', ice: true},
  {at: P(9), set: (t) => <Fly t={t} />, fx_: 'swipe'},
  {at: P(10), set: (t) => <FillIran t={t} />, fx_: 'swipeL', ice: true},
  {at: P(12), set: (t) => <OilLand t={t} />, fx_: 'iris', ice: true},
  {at: P(15), set: (t) => <GovPays t={t} />, fx_: 'swipe', ice: true},
  {at: P(17), set: () => <Name />, fx_: 'pop'},
  {at: P(18), set: () => <Stare />, fx_: 'zoom'},
  {at: P(19), set: (t) => <Trick t={t} />, fx_: 'iris'},
  {at: P(20), set: (t) => <Broken t={t} />, fx_: 'pop', ice: true},
  {at: P(22), set: (t) => <Everything t={t} />, fx_: 'swipe', ice: true},
  {at: P(27), set: (t) => <Quota t={t} />, fx_: 'swipeL', ice: true},
  {at: P(30), set: (t) => <LookLook t={t} />, fx_: 'pop', ice: true},
  {at: P(35), set: (t) => <Home t={t} />, fx_: 'swipe', ice: true},
  {at: P(38), set: () => <Stare marks />, fx_: 'zoom'},
  {at: P(39), set: (t) => <Choice t={t} />, fx_: 'pop', ice: true},
];
// deep zooms [phrase, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [
  [8, 560, G - 320, 1.35], [11, 330, G - 260, 1.6], [16, 720, 600, 1.4], [29, 540, G - 300, 1.3], [34, 760, G - 250, 1.5], [37, 330, G - 260, 1.6],
];
// big centre words; the caption hides while they (and full-screen text) are on screen
const BIGS: {text: string; at: number; until: number; x?: number; y?: number; color?: string; size: number}[] = [
  {text: 'how?', at: P(12), until: P(13), y: 640, size: 200},
  {text: 'the trick', at: P(19) + 0.2, until: P(20), y: 560, color: RED, size: 140},
  {text: '1 dollar = 2,000,000 rials', at: P(21) + 0.3, until: P(22), y: 420, size: 66},
  {text: 'prices +70%', at: P(26), until: P(27), y: 250, color: RED, size: 120},
];
const QUIET: [number, number][] = [[P(17), P(18)], [P(39), P(41)]];

export const DougGasIran = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { const c = hookCam(tc); s0 = c.s; fx = c.x; fy = c.y; }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, TIM);
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  const shake = tc > P(2) && tc < P(2) + 0.25 ? Math.sin(tc * 90) * 8 * (1 - (tc - P(2)) / 0.25) : 0;
  const quiet = BIGS.some((b) => tc >= b.at && tc < b.until) || QUIET.some(([a, b]) => tc >= a && tc < b);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s + shake}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>
        {sh.ice && <Ice />}
        {sh.set(t)}
        {BIGS.map((b) => <BigWord key={b.text} text={b.text} x={b.x ?? 540} y={b.y ?? 960} at={b.at} until={b.until} color={b.color} size={b.size} />)}
      </AbsoluteFill>
    </AbsoluteFill>
    {!quiet && <Captions t={tc} phrases={TIM} y={sh.at === 0 ? 1640 : 1530} />}
    <Audio src={staticFile('doug-gas-iran-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    {/* hook */}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.75} name="user-whoosh" vol={0.25} />
    <Sfx at={1.35} name="user-cash-register" vol={0.4} />
    <Sfx at={P(1) + 0.1} name="swoosh-fast" vol={0.3} />
    <Sfx at={P(2)} name="user-boom" vol={0.5} />
    <Sfx at={P(2) + 0.05} name="penguin-squawk" vol={0.4} />
    {/* story */}
    <Sfx at={P(3)} name="user-slap" vol={0.35} />
    <Sfx at={P(4) + 0.3} name="user-horn" vol={0.25} />
    <Sfx at={P(5)} name="penguin-squawk" vol={0.3} />
    <Sfx at={P(7) + 1.3} name="user-cash-register" vol={0.4} />
    <Sfx at={P(8) + 0.2} name="user-money" vol={0.35} />
    <Sfx at={P(10) + 0.5} name="user-ting" vol={0.4} />
    <Sfx at={P(11)} name="user-wow" vol={0.4} />
    <Sfx at={P(13)} name="user-boom" vol={0.4} />
    <Sfx at={P(15) + 0.3} name="user-money-transfer" vol={0.3} />
    <Sfx at={P(17)} name="user-pop" vol={0.4} />
    <Sfx at={P(18)} name="user-fahh" vol={0.45} />
    <Sfx at={P(19)} name="user-boom" vol={0.45} />
    <Sfx at={P(20)} name="user-slap" vol={0.45} />
    <Sfx at={P(21) + 0.3} name="user-shock" vol={0.35} />
    <Sfx at={P(24)} name="user-wrong" vol={0.35} />
    <Sfx at={P(25)} name="user-wrong" vol={0.35} />
    <Sfx at={P(26)} name="user-boom" vol={0.4} />
    <Sfx at={P(28)} name="user-timer" vol={0.3} />
    <Sfx at={P(29) + 0.3} name="user-cash-register" vol={0.35} />
    <Sfx at={P(31)} name="user-yeah" vol={0.3} />
    <Sfx at={P(34)} name="user-aww" vol={0.4} />
    <Sfx at={P(36)} name="user-money" vol={0.3} />
    <Sfx at={P(37)} name="user-yeah" vol={0.35} />
    <Sfx at={P(38)} name="user-shock" vol={0.35} />
    <Sfx at={P(39)} name="user-pop" vol={0.35} />
    <Sfx at={P(40)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
