// EP11 "Same house: $1,000,000 in America vs $35,000 in France".
// Hook v2 (user, 2026-10-24): PURE WHITE background, the SAME luxury American house on both sides (identical),
// price ABOVE each house, American Doug (red cap) vs French Doug (beret + striped shirt + baguette), both penguins
// react and move, slow clear voice on the side names + prices, then a cut to a different shot right after the hook.
// Real photo (user, 2026-10-24): studio/public/home/house.png = the user's house photo, cropped, sky/trees/watermark removed (rembg isnet),
// drawn with an ink outline so the white house reads on the white page. HOUSE_PHOTO = false falls back to the drawn LuxHouse.
// Spoken hook = on-screen words: "Why? Same house! America! One million dollars! France! Thirty-five thousand dollars!"
// Line timings: studio/src/data/doug-home.json.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HAND, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Thought} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Sfx} from '../penguin/edit';
import {UsFlag} from './dougLibya';
import TIM from '../data/doug-home.json';

const HOUSE_PHOTO = true;
const P = (i: number) => TIM[i].start;
export const DOUG_HOME_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';
// hook beats: "America!" -> "One million dollars!" -> "France!" -> "Thirty-five thousand dollars!" -> cut
const US_AT = P(1), US_PRICE = P(2), FR_AT = P(3), FR_PRICE = P(4), HOOK_END = P(5);

export const FrFlag = ({w = 170}: {w?: number}) => <svg width={w} height={w * 0.63} viewBox="0 0 190 120">
  <rect width={64} height={120} fill="#0055A4" /><rect x={63} width={64} height={120} fill="#fff" /><rect x={126} width={64} height={120} fill="#EF4135" />
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={6} />
</svg>;

// Luxury American house (2 floors, white columns, double garage, hedges). Drawn identical on both sides.
export const LuxHouse = ({x, y, w = 480}: {x: number; y: number; w?: number}) => {
  if (HOUSE_PHOTO) return <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.541, width: w, height: w * 0.541}}>
    <Img src={staticFile('home/house.png')} style={{width: '100%', height: '100%', filter: `drop-shadow(3px 0 0 ${INK}) drop-shadow(-3px 0 0 ${INK}) drop-shadow(0 3px 0 ${INK}) drop-shadow(0 -3px 0 ${INK})`}} />
    <div style={{position: 'absolute', left: -14, right: -14, bottom: -4, height: 6, background: INK, borderRadius: 3}} /></div>;
  return <svg width={w} height={w * 0.7} viewBox="0 0 500 350" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.7, overflow: 'visible'}}>
    <rect x={20} y={130} width={330} height={210} fill="#F4EEE4" stroke={INK} strokeWidth={6} />
    <rect x={350} y={200} width={135} height={140} fill="#E9E1D3" stroke={INK} strokeWidth={6} />
    <path d="M340 205 L417 150 L495 205 Z" fill="#4A5160" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <rect x={366} y={248} width={104} height={92} fill="#fff" stroke={INK} strokeWidth={5} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M366 ${268 + i * 20} L470 ${268 + i * 20}`} stroke="#B9B2A6" strokeWidth={3} />)}
    <path d="M0 140 L185 40 L370 140 Z" fill="#4A5160" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <rect x={270} y={58} width={34} height={60} fill="#9C5A44" stroke={INK} strokeWidth={5} />
    <path d="M120 140 L185 96 L250 140 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {[[48, 160], [272, 160], [48, 250], [272, 250]].map(([a, b], i) => <g key={i}>
      <rect x={a} y={b} width={52} height={66} fill="#A8DCF5" stroke={INK} strokeWidth={5} />
      <path d={`M${a + 26} ${b} L${a + 26} ${b + 66} M${a} ${b + 33} L${a + 52} ${b + 33}`} stroke="#fff" strokeWidth={4} /></g>)}
    <rect x={150} y={160} width={70} height={60} rx={30} fill="#FFE9A8" stroke={INK} strokeWidth={5} />
    {[132, 238].map((cx) => <rect key={cx} x={cx - 7} y={140} width={14} height={200} fill="#fff" stroke={INK} strokeWidth={4} />)}
    <rect x={160} y={250} width={50} height={90} rx={4} fill="#2C3E5C" stroke={INK} strokeWidth={5} />
    <circle cx={200} cy={298} r={4} fill="#E2B13C" />
    {[10, 60, 300, 345].map((cx) => <ellipse key={cx} cx={cx + 20} cy={334} rx={28} ry={18} fill="#5FA052" stroke={INK} strokeWidth={4} />)}
    <path d="M-10 342 L510 342" stroke={INK} strokeWidth={6} />
  </svg>;
};

const Why = () => <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', fontFamily: HAND, fontWeight: 700, fontSize: 200, lineHeight: '210px', color: INK, WebkitTextStroke: `6px ${INK}`}}>
  Why<span style={{color: RED, WebkitTextStroke: `6px ${RED}`}}>?</span></div>;

const punch = (t: number, at: number, d = 0.3, a = 0.18) => t >= at && t < at + d ? 1 + a * Math.sin(((t - at) / d) * Math.PI) : 1;

const SideLabel = ({text, x, y, color, t, at}: {text: string; x: number; y: number; color: string; t: number; at: number}) =>
  <div style={{position: 'absolute', left: x - 270, width: 540, top: y, textAlign: 'center', transform: `scale(${punch(t, at)}) rotate(-3deg)`}}>
    <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 108, lineHeight: '116px', color, WebkitTextStroke: `6px ${color}`, letterSpacing: 2}}>{text}</div>
    <svg width={380} height={36} viewBox="0 0 400 40"><path d="M20 30 Q 150 12, 380 10" fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" /></svg>
  </div>;

const Price = ({text, x, y, color, t, at, size = 110}: {text: string; x: number; y: number; color: string; t: number; at: number; size?: number}) =>
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(-3deg) scale(${punch(t, at, 0.35, 0.3)})`, fontFamily: HAND, fontWeight: 700, fontSize: size, lineHeight: 1,
    color, WebkitTextStroke: `${size * 0.03}px ${color}`, letterSpacing: 2, whiteSpace: 'nowrap'}}>{text}</div>;

const SameHouse = ({t}: {t: number}) => {
  const p = ease((t - 0.45) / 0.2);
  return <div style={{position: 'absolute', left: 540, top: 365, transform: `translate(-50%,-50%) rotate(-4deg) scale(${(2 - p) * (t < 0.45 ? 0 : 1)})`, opacity: p,
    border: `8px solid ${INK}`, borderRadius: 18, padding: '4px 26px', background: '#FFE45C', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 62, color: INK, whiteSpace: 'nowrap'}}>SAME HOUSE</div>;
};

// French baguette held up by French Doug.
const Baguette = ({x, y, rot}: {x: number; y: number; rot: number}) =>
  <svg width={190} height={60} viewBox="0 0 190 60" style={{position: 'absolute', left: x - 95, top: y - 30, overflow: 'visible', transform: `rotate(${rot}deg)`}}>
    <path d="M10 34 Q12 12 40 12 L160 10 Q184 12 182 30 Q180 48 156 48 L36 50 Q8 50 10 34 Z" fill="#E2A65A" stroke={INK} strokeWidth={5} />
    {[50, 85, 120, 150].map((a) => <path key={a} d={`M${a} 18 Q${a + 12} 28 ${a + 6} 42`} fill="none" stroke="#B9782F" strokeWidth={5} strokeLinecap="round" />)}
  </svg>;

const HB = 1220; // house baseline
const Hook = ({t}: {t: number}) => {
  const usHot = t >= US_AT, usShock = t >= US_PRICE, frHot = t >= FR_AT, frJoy = t >= FR_PRICE;
  const usHop = t >= US_PRICE && t < US_PRICE + 0.5 ? Math.sin(((t - US_PRICE) / 0.5) * Math.PI) * 70 : 0;
  const frHop = frJoy ? Math.abs(Math.sin((t - FR_PRICE) * 7)) * 45 : frHot && t < FR_AT + 0.4 ? Math.sin(((t - FR_AT) / 0.4) * Math.PI) * 30 : 0;
  const sway = Math.sin(t * 3) * 6;
  return <>
    <Why />
    <SameHouse t={t} />
    <SideLabel text="AMERICA" x={270} y={450} color={RED} t={t} at={US_AT} />
    <SideLabel text="FRANCE" x={810} y={450} color={GREEN} t={t} at={FR_AT} />
    <div style={{position: 'absolute', left: 270 - 60, top: 625, transform: `skewY(${Math.sin(t * 5) * 3}deg)`}}><UsFlag w={120} /></div>
    <div style={{position: 'absolute', left: 810 - 60, top: 625, transform: `skewY(${Math.sin(t * 5 + 1) * 3}deg)`}}><FrFlag w={120} /></div>
    <Price text="$1,000,000" x={270} y={800} color={RED} t={t} at={US_PRICE} size={96} />
    <Price text="$35,000" x={810} y={800} color={GREEN} t={t} at={FR_PRICE} size={118} />
    <div style={{position: 'absolute', left: 537, top: 600, width: 7, height: 980, background: INK, borderRadius: 4}} />
    <LuxHouse x={272} y={HB} w={520} />
    <LuxHouse x={808} y={HB} w={520} />
    <Penguin id="usdoug" x={275} y={HB + 330} h={290} outfit="usa"
      pose={{turn: 0.3, brows: 'worried', eyeScale: usShock ? 1.35 : usHot ? 1.15 : 1.05, pupil: usShock ? 0.55 : 1, beak: usShock ? 'frown' : 'flat', tremble: usShock ? 1 : 0, sweat: usShock,
        hop: usHop, flapL: usShock ? 140 : 25 + sway, flapR: usShock ? 140 : 25 - sway, look: usHot ? [0.5, -0.4] : [0, 0]}} />
    <Penguin id="frdoug" x={805} y={HB + 330} h={290} outfit="french"
      pose={{turn: -0.3, brows: frHot ? 'happy' : 'worried', beak: frJoy ? 'smile' : 'flat', eyeScale: frJoy ? 1.2 : 1.05, hop: frHop, blush: frJoy ? 1 : 0,
        flapL: frJoy ? 120 + Math.sin(t * 14) * 25 : 25 + sway, flapR: frHot ? 110 : 25 - sway, look: frHot ? [-0.5, -0.4] : [0, 0]}} />
    <Baguette x={frHot ? 870 : 900} y={frHot ? HB + 60 - frHop : HB + 210} rot={frHot ? -60 + Math.sin(t * 12) * 12 : 75} />
  </>;
};

// ---------- shot 2: "This is Doug! Doug want house!" — a different place right after the hook ----------
const Ground = ({y = 1250}: {y?: number}) => <div style={{position: 'absolute', left: -400, right: -400, top: y, height: 6, background: INK}} />;
const Intro = ({t}: {t: number}) => {
  const d = t - HOOK_END;
  return <>
    <Ground />
    <Penguin id="doug" x={340} y={1250} h={560} pose={{flapR: d < 0.6 ? 130 + Math.sin(t * 14) * 20 : 30, beak: 'smile', hop: d < 0.35 ? Math.sin((d / 0.35) * Math.PI) * 60 : 0, look: d > 0.8 ? [0.6, -0.6] : [0, 0]}} />
    <Thought x={760} y={560} w={460} tx={470} ty={760} at={P(5) + 0.7}><LuxHouse x={230} y={270} w={340} /></Thought>
  </>;
};

type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: HOOK_END, set: (t) => <Intro t={t} />, fx_: 'swipe'},
];

export const DougHome = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side named (America, then France)
    const toU = ease((tc - US_AT) / 0.35) * (tc < FR_AT ? 1 : 0), toF = ease((tc - FR_AT) / 0.35);
    s = 1 + 0.16 * (toU + toF); fx = 540 - 270 * toU + 270 * toF; fy = 960 + 40 * (toU + toF);
  }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Audio src={staticFile('doug-home-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.25} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.45} name="user-pop" vol={0.35} />
    <Sfx at={US_AT - 0.05} name="user-whoosh" vol={0.25} />
    <Sfx at={US_PRICE + 0.1} name="user-cash-register" vol={0.4} />
    <Sfx at={US_PRICE + 0.4} name="user-shock" vol={0.35} />
    <Sfx at={FR_AT - 0.05} name="user-whoosh" vol={0.25} />
    <Sfx at={FR_PRICE + 0.1} name="user-boom" vol={0.4} />
    <Sfx at={FR_PRICE + 0.5} name="user-yeah" vol={0.35} />
    <Sfx at={HOOK_END + 0.1} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(5) + 0.7} name="user-pop" vol={0.3} />
  </AbsoluteFill>;
};
