// EP11 "Same house: $1,000,000 in America vs $35,000 in France".
// Hook v2 (user, 2026-10-24): PURE WHITE background, the SAME luxury American house on both sides (identical),
// price ABOVE each house, American Doug (red cap) vs French Doug (beret + striped shirt + baguette), both penguins
// react and move, slow clear voice on the side names + prices, then a cut to a different shot right after the hook.
// Real photo (user, 2026-10-24): studio/public/home/house.png = the user's house photo, cropped, sky/trees/watermark removed (rembg isnet),
// drawn with an ink outline so the white house reads on the white page. HOUSE_PHOTO = false falls back to the drawn LuxHouse.
// Spoken hook = on-screen words: "Why? Same house! America! One million dollars! France! Thirty-five thousand dollars!"
// Line timings: studio/src/data/doug-home.json.
import React from 'react';
import {AbsoluteFill, Audio, Img, getInputProps, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HAND, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Stamp, Thought, Title} from '../penguin/world';
import {Puffin, Seagull, Walrus} from '../penguin/cast';
import {Fox} from './dougLaundering';
import {BossBear} from './dougVenezuela';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {UsFlag} from './dougLibya';
import TIM from '../data/doug-home.json';
import CAP from '../data/doug-home.captions.json';

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

// ---------- story props ----------
const Ground = ({y = 1250}: {y?: number}) => <div style={{position: 'absolute', left: -400, right: -400, top: y, height: 6, background: INK}} />;
const E = (i: number) => TIM[i].end;
const back = (p: number) => { const c = 1.7; const q = cl(p) - 1; return 1 + (c + 1) * q * q * q + c * q * q; };
const Pop = ({at, t, x, y, children}: {at: number; t: number; x: number; y: number; children: React.ReactNode}) =>
  t < at ? null : <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${back((t - at) / 0.3)})`}}>{children}</div>;
const Txt = ({text, x, y, size = 90, color = INK, at = -99, t, rot = -3}: {text: string; x: number; y: number; size?: number; color?: string; at?: number; t: number; rot?: number}) =>
  t < at ? null : <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${back((t - at) / 0.3)})`, fontFamily: HAND, fontWeight: 700, fontSize: size, lineHeight: 1.05,
    color, WebkitTextStroke: `${size * 0.03}px ${color}`, whiteSpace: 'nowrap', textAlign: 'center'}}>{text}</div>;
const Tag = ({text, x, y, color, at, t, size = 90}: {text: string; x: number; y: number; color: string; at: number; t: number; size?: number}) => {
  if (t < at) return null; const p = ease((t - at) / 0.3), sw = Math.sin(t * 3) * 3;
  return <div style={{position: 'absolute', left: x, top: y - 260 * (1 - p), transform: `translate(-50%,-50%) rotate(${-6 + sw}deg)`, background: '#fff', border: `7px solid ${INK}`, borderRadius: 18,
    padding: '6px 26px', fontFamily: HAND, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.025}px ${color}`, whiteSpace: 'nowrap'}}>{text}</div>;
};
const Arrow = ({x, y, up, t, at, color}: {x: number; y: number; up: boolean; t: number; at: number; color: string}) => {
  const p = ease((t - at) / 0.6); if (t < at) return null;
  return <svg width={360} height={560} viewBox="0 0 360 560" style={{position: 'absolute', left: x - 180, top: y - 280, overflow: 'visible', transform: up ? undefined : 'scaleY(-1)'}}>
    <path d={`M40 520 L120 ${520 - 160 * p} L200 ${520 - 120 * p} L300 ${520 - 420 * p}`} fill="none" stroke={color} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
    <path d={`M${300 - 70} ${520 - 420 * p + 10} L300 ${520 - 420 * p - 20} L${300 + 18} ${520 - 420 * p + 70}`} fill="none" stroke={color} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
};
const Palm = ({x, y, s = 1}: {x: number; y: number; s?: number}) => <svg width={200 * s} height={420 * s} viewBox="0 0 200 420" style={{position: 'absolute', left: x - 100 * s, top: y - 420 * s, overflow: 'visible'}}>
  <path d="M100 420 Q90 250 110 110" fill="none" stroke="#9C6B3F" strokeWidth={22} strokeLinecap="round" /><path d="M100 420 Q90 250 110 110" fill="none" stroke={INK} strokeWidth={4} strokeDasharray="4 26" />
  {[-150, -110, -60, -20, 30].map((a, i) => <path key={i} d="M110 110 Q170 90 210 140" fill="none" stroke="#3E9B4F" strokeWidth={20} strokeLinecap="round" transform={`rotate(${a + 60} 110 110)`} />)}
</svg>;
const Tower = ({x, y, w, h, c = '#CFE3F2'}: {x: number; y: number; w: number; h: number; c?: string}) => <div style={{position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h, background: c, border: `6px solid ${INK}`,
  backgroundImage: 'linear-gradient(90deg, transparent 70%, rgba(255,255,255,0.8) 70%), linear-gradient(transparent 70%, rgba(255,255,255,0.8) 70%)', backgroundSize: '40px 46px'}} />;
const StoneHouse = ({x, y, w = 200, door = '#7A5634'}: {x: number; y: number; w?: number; door?: string}) => <svg width={w} height={w} viewBox="0 0 200 200" style={{position: 'absolute', left: x - w / 2, top: y - w, overflow: 'visible'}}>
  <rect x={20} y={80} width={160} height={118} fill="#E6D3AE" stroke={INK} strokeWidth={6} /><path d="M6 86 L100 20 L194 86 Z" fill="#C8613A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  <rect x={86} y={130} width={30} height={68} fill={door} stroke={INK} strokeWidth={5} /><rect x={38} y={104} width={32} height={30} fill="#9FD3F0" stroke={INK} strokeWidth={4} /><rect x={132} y={104} width={32} height={30} fill="#9FD3F0" stroke={INK} strokeWidth={4} />
</svg>;
const Church = ({x, y}: {x: number; y: number}) => <svg width={160} height={380} viewBox="0 0 160 380" style={{position: 'absolute', left: x - 80, top: y - 380, overflow: 'visible'}}>
  <rect x={30} y={140} width={100} height={238} fill="#E6D3AE" stroke={INK} strokeWidth={6} /><path d="M20 146 L80 10 L140 146 Z" fill="#8A8F99" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  <path d="M80 10 L80 -30 M66 -16 L94 -16" stroke={INK} strokeWidth={6} /><circle cx={80} cy={200} r={22} fill="#fff" stroke={INK} strokeWidth={5} /><path d="M80 200 L80 186 M80 200 L90 206" stroke={INK} strokeWidth={4} />
</svg>;
const Car = ({x, y, w = 360, c = '#2F6FD6'}: {x: number; y: number; w?: number; c?: string}) => <svg width={w} height={w * 0.5} viewBox="0 0 360 180" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.5, overflow: 'visible'}}>
  <path d="M20 130 L30 90 L100 80 L140 36 L250 36 L300 84 L344 96 L346 130 Z" fill={c} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
  <path d="M150 48 L240 48 L276 84 L120 84 Z" fill="#BFE6FA" stroke={INK} strokeWidth={5} /><path d="M196 48 L196 84" stroke={INK} strokeWidth={5} />
  {[90, 280].map((cx) => <g key={cx}><circle cx={cx} cy={134} r={34} fill="#222" stroke={INK} strokeWidth={6} /><circle cx={cx} cy={134} r={13} fill="#ccc" /></g>)}
</svg>;
const Bus = ({x, y}: {x: number; y: number}) => <svg width={520} height={260} viewBox="0 0 520 260" style={{position: 'absolute', left: x - 260, top: y - 260, overflow: 'visible'}}>
  <rect x={10} y={30} width={500} height={180} rx={24} fill="#F2C230" stroke={INK} strokeWidth={7} />
  {[40, 140, 240, 340].map((a) => <rect key={a} x={a} y={56} width={80} height={64} rx={8} fill="#BFE6FA" stroke={INK} strokeWidth={5} />)}
  <rect x={440} y={56} width={50} height={130} rx={6} fill="#BFE6FA" stroke={INK} strokeWidth={5} />
  <text x={200} y={176} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill={INK}>BIG CITY</text>
  {[110, 400].map((cx) => <circle key={cx} cx={cx} cy={214} r={36} fill="#222" stroke={INK} strokeWidth={6} />)}
</svg>;
const ForSale = ({x, y, s = 1}: {x: number; y: number; s?: number}) => <div style={{position: 'absolute', left: x - 70 * s, top: y - 200 * s, width: 140 * s}}>
  <div style={{background: '#fff', border: `${5 * s}px solid ${RED}`, borderRadius: 10, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30 * s, color: RED, textAlign: 'center', lineHeight: 1.05, padding: '6px 0'}}>FOR<br />SALE</div>
  <div style={{margin: '0 auto', width: 10 * s, height: 110 * s, background: INK}} /></div>;
const Sun = ({x, y, t}: {x: number; y: number; t: number}) => <svg width={220} height={220} viewBox="-110 -110 220 220" style={{position: 'absolute', left: x - 110, top: y - 110, transform: `rotate(${t * 20}deg)`}}>
  {Array.from({length: 10}, (_, i) => <path key={i} d="M0 -64 L0 -100" stroke="#F5B400" strokeWidth={12} strokeLinecap="round" transform={`rotate(${i * 36})`} />)}
  <circle r={54} fill="#FFD23F" stroke={INK} strokeWidth={6} /></svg>;
const Clock = ({x, y, t}: {x: number; y: number; t: number}) => <svg width={200} height={200} viewBox="-100 -100 200 200" style={{position: 'absolute', left: x - 100, top: y - 100}}>
  <circle r={86} fill="#fff" stroke={INK} strokeWidth={8} /><path d={`M0 0 L0 -60`} stroke={INK} strokeWidth={8} strokeLinecap="round" transform={`rotate(${t * 360})`} />
  <path d="M0 0 L36 0" stroke={RED} strokeWidth={8} strokeLinecap="round" transform={`rotate(${t * 30})`} /></svg>;
const Fish = ({x, y, w = 90, rot = 0}: {x: number; y: number; w?: number; rot?: number}) => <svg width={w} height={w * 0.55} viewBox="0 0 100 55" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.27, transform: `rotate(${rot}deg)`}}>
  <path d="M8 28 Q40 0 74 24 L96 8 L92 28 L96 48 L74 32 Q40 56 8 28 Z" fill="#5EC4FA" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><circle cx={26} cy={24} r={4} fill={INK} /></svg>;
const Animals = ({x, y, t, n = 5, walk = 0, h = 240}: {x: number; y: number; t: number; n?: number; walk?: number; h?: number}) => {
  const kinds = [0, 1, 2, 3, 4];
  return <>{Array.from({length: n}, (_, i) => { const k = kinds[i % 5], ax = x + i * h * 0.62 + walk, bob = Math.abs(Math.sin(t * 8 + i)) * (walk ? 14 : 0);
    return <div key={i} style={{position: 'absolute', left: 0, top: -bob}}>
      {k === 0 && <Puffin x={ax} y={y} h={h * 0.8} id={`pf${i}`} pose={{flap: Math.sin(t * 9 + i) * 20}} />}
      {k === 1 && <Seagull x={ax} y={y} h={h} id={`gl${i}`} pose={{angry: false, walk: walk ? t * 2 + i : null}} />}
      {k === 2 && <Fox x={ax} y={y} h={h} />}
      {k === 3 && <BossBear x={ax} y={y} h={h * 1.1} />}
      {k === 4 && <Walrus x={ax} y={y} h={h} id={`wl${i}`} hat={false} />}
    </div>; })}</>;
};

// ---------- shots ----------
const Intro = ({t}: {t: number}) => {
  const d = t - HOOK_END;
  return <>
    <Ground />
    <Penguin id="doug" x={340} y={1250} h={560} pose={{flapR: d < 0.6 ? 130 + Math.sin(t * 14) * 20 : 30, beak: 'smile', hop: d < 0.35 ? Math.sin((d / 0.35) * Math.PI) * 60 : 0, look: d > 0.8 ? [0.6, -0.6] : [0, 0]}} />
    <Thought x={760} y={560} w={460} tx={470} ty={760} at={P(5) + 0.7}><LuxHouse x={230} y={270} w={340} /></Thought>
  </>;
};
const California = ({t}: {t: number}) => <>
  <Ground />
  <Tower x={120} y={1250} w={150} h={620} /><Tower x={960} y={1250} w={170} h={700} c="#D9E8F5" />
  <Palm x={250} y={1250} /><Palm x={850} y={1250} s={0.9} />
  <Txt text="CALIFORNIA" x={540} y={330} size={120} color={RED} t={t} at={P(6)} />
  <LuxHouse x={540} y={1250} w={600} />
  <Tag text="$1,000,000" x={540} y={560} color={RED} at={P(6) + 1.2} t={t} size={110} />
  <Penguin id="usdoug" x={200} y={1420} h={300} outfit="usa" pose={{eyeScale: t > P(6) + 1.3 ? 1.35 : 1.05, pupil: t > P(6) + 1.3 ? 0.55 : 1, tremble: t > P(6) + 1.3 ? 1 : 0, beak: 'frown', brows: 'worried', flapL: 120, flapR: 120}} />
</>;
const FishPileShot = ({t}: {t: number}) => {
  const d = t - P(7);
  return <>
    <Ground y={1300} />
    {Array.from({length: 60}, (_, i) => { const r = (i * 73) % 100, row = Math.floor(i / 12), col = i % 12, fall = cl((d - i * 0.012) / 0.4);
      return <Fish key={i} x={110 + col * 78 + (row % 2) * 39} y={1290 - row * 60 - (1 - fall) * 900} w={110} rot={r * 3.6} />; })}
    <Penguin id="usdoug" x={540} y={1060} h={300} outfit="usa" pose={{eyeScale: 1.35, pupil: 0.55, beak: 'frown', brows: 'worried', flapL: 140, flapR: 140}} />
    <Txt text="100,000 fish" x={540} y={420} size={130} color={INK} t={t} at={P(7) + 0.3} />
  </>;
};
const Village = ({t}: {t: number}) => <>
  <Ground />
  <StoneHouse x={110} y={1250} w={190} /><Church x={260} y={1250} /><StoneHouse x={960} y={1250} w={200} />
  <Txt text="FRENCH VILLAGE" x={540} y={330} size={110} color={GREEN} t={t} at={P(8) + 0.3} />
  <div style={{position: 'absolute', left: 870, top: 420, transform: `skewY(${Math.sin(t * 5) * 3}deg)`}}><FrFlag w={140} /></div>
  <LuxHouse x={600} y={1250} w={560} />
  <Tag text="$35,000" x={600} y={620} color={GREEN} at={P(8) + 2} t={t} size={120} />
  <Penguin id="frdoug" x={860} y={1430} h={300} outfit="french" pose={{beak: 'smile', brows: 'happy', hop: t > P(8) + 2 ? Math.abs(Math.sin(t * 7)) * 40 : 0, flapL: 110, flapR: 110}} />
</>;
const CarShot = ({t}: {t: number}) => <>
  <Ground />
  <LuxHouse x={280} y={1250} w={420} /><Car x={800} y={1250} w={400} />
  <Txt text="$35,000" x={280} y={720} size={100} color={GREEN} t={t} at={P(9)} />
  <Txt text="NEW CAR" x={800} y={920} size={90} color={INK} t={t} at={P(9) + 0.3} />
  <Txt text="<" x={545} y={1050} size={200} color={RED} t={t} at={P(9) + 0.6} rot={0} />
</>;
const Same = ({t}: {t: number}) => <>
  <Ground y={1000} />
  <LuxHouse x={272} y={1000} w={500} /><LuxHouse x={808} y={1000} w={500} />
  {['SAME WALLS ✓', 'SAME ROOF ✓', '3 BEDROOMS ✓'].map((s, i) => <Txt key={s} text={s} x={540} y={1110 + i * 110} size={84} color={GREEN} t={t} at={P(10) + i * 0.6} rot={-2} />)}
  <Txt text="WHY?" x={540} y={400} size={170} color={RED} t={t} at={P(10) + 1.9} />
</>;
const Jobs = ({t}: {t: number}) => <>
  <Txt text="HOUSE PRICE" x={540} y={640} size={130} color={INK} t={t} at={P(11) + 0.2} />
  <Txt text="≠ HOUSE" x={540} y={820} size={130} color={RED} t={t} at={P(11) + 0.6} />
  <Txt text="= JOBS" x={540} y={1060} size={190} color={GREEN} t={t} at={P(11) + 1.4} />
  <Penguin id="doug" x={540} y={1550} h={320} pose={{eyeScale: 1.2, look: [0, -0.7], flapR: t > P(11) + 1.4 ? 130 : 30}} />
</>;
const BigJobs = ({t}: {t: number}) => <>
  <Ground />
  <Tower x={200} y={1250} w={220} h={760} /><Tower x={540} y={1250} w={260} h={900} c="#BFD8EE" /><Tower x={880} y={1250} w={220} h={680} />
  <Pop at={P(12) + 0.9} t={t} x={540} y={440}><div style={{background: '#fff', border: `7px solid ${INK}`, borderRadius: 16, padding: '4px 30px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 80, color: INK}}>TECH</div></Pop>
  <Txt text="BIG PAYCHECK $$$" x={540} y={1360} size={100} color={GREEN} t={t} at={P(12) + 1.5} />
</>;
const Everybody = ({t}: {t: number}) => <>
  <Ground />
  <Tower x={900} y={1250} w={220} h={720} />
  <Animals x={-150 + (t - P(13)) * 260} y={1250} t={t} n={5} walk={1} h={230} />
  <Txt text="NEAR JOB" x={880} y={450} size={90} color={INK} t={t} at={P(13) + 0.6} />
</>;
const FewHouses = ({t}: {t: number}) => <>
  <Ground />
  <Animals x={90} y={1250} t={t} n={6} h={200} />
  <LuxHouse x={880} y={850} w={300} />
  <Txt text="MANY ANIMALS" x={360} y={560} size={90} color={RED} t={t} at={P(14)} />
  <Txt text="1 HOUSE" x={880} y={440} size={90} color={INK} t={t} at={P(14) + 0.7} />
</>;
const Rules = ({t}: {t: number}) => <>
  <Ground />
  <BossBear x={330} y={1250} h={620} mouth={Math.abs(Math.sin(t * 12)) * 0.6} />
  <Pop at={P(15) + 0.2} t={t} x={780} y={860}><div style={{width: 360, height: 420, background: '#DCEBFA', border: `6px solid ${INK}`, borderRadius: 12, backgroundImage: 'linear-gradient(#9CC2E6 2px, transparent 2px), linear-gradient(90deg, #9CC2E6 2px, transparent 2px)', backgroundSize: '40px 40px'}} /></Pop>
  <Stamp text="BUILD SLOW" x={780} y={860} at={P(15) + 0.7} color={RED} size={70} />
</>;
const Auction = ({t}: {t: number}) => {
  const bids = ['$800K', '$900K', '$1M!'];
  return <>
    <Ground />
    <LuxHouse x={540} y={820} w={420} />
    <Animals x={130} y={1250} t={t} n={5} h={210} />
    {bids.map((b, i) => <Txt key={b} text={b} x={200 + i * 340} y={980} size={90} color={i === 2 ? RED : INK} t={t} at={P(16) + 0.4 + i * 0.5} />)}
    <Stamp text="SOLD" x={540} y={600} at={E(16) - 0.5} color={RED} size={90} />
  </>;
};
const PriceUp = ({t}: {t: number}) => <>
  <Arrow x={540} y={900} up t={t} at={P(17)} color={RED} />
  <Txt text="$1,000,000" x={540} y={420} size={140} color={RED} t={t} at={P(18)} />
  <Penguin id="usdoug" x={250} y={1450} h={300} outfit="usa" pose={{eyeScale: 1.35, pupil: 0.55, tremble: 1, beak: 'frown', brows: 'worried', sweat: true, flapL: 140, flapR: 140}} />
</>;
const NoJobs = ({t}: {t: number}) => <>
  <Ground />
  <StoneHouse x={180} y={1250} w={230} /><Church x={420} y={1250} /><StoneHouse x={680} y={1250} w={230} door="#555" />
  <Pop at={P(19) + 0.6} t={t} x={830} y={760}><div style={{background: '#fff', border: `7px solid ${RED}`, borderRadius: 14, padding: '6px 24px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: RED, transform: 'rotate(8deg)'}}>NO JOBS</div></Pop>
  <Penguin id="frdoug" x={900} y={1440} h={300} outfit="french" pose={{brows: 'worried', beak: 'frown', look: [-0.6, 0]}} />
</>;
const Leave = ({t}: {t: number}) => {
  const d = t - P(20);
  return <>
    <Ground />
    <StoneHouse x={150} y={1250} w={200} /><Church x={330} y={1250} />
    <Bus x={560 + d * 300} y={1250} />
    <Txt text="BYE!" x={600 + d * 300} y={820} size={90} color={INK} t={t} at={P(20) + 0.5} />
  </>;
};
const NobodyWant = ({t}: {t: number}) => <>
  <Ground />
  {[0, 1, 2, 3].map((i) => <React.Fragment key={i}><StoneHouse x={150 + i * 260} y={1250} w={230} /><ForSale x={210 + i * 260} y={1250 + 0} s={0.8} /></React.Fragment>)}
  <Txt text="NOBODY WANT" x={540} y={600} size={110} color={RED} t={t} at={P(21) + 0.6} />
</>;
const PriceDown = ({t}: {t: number}) => <>
  <Arrow x={540} y={900} up={false} t={t} at={P(22)} color={GREEN} />
  <Txt text="$35,000" x={540} y={1450} size={150} color={GREEN} t={t} at={P(23)} />
  <Penguin id="frdoug" x={850} y={700} h={280} outfit="french" pose={{beak: 'smile', brows: 'happy', hop: Math.abs(Math.sin(t * 7)) * 30, flapL: 120, flapR: 120}} />
</>;
const Called = () => <Title lines={['SUPPLY', '& DEMAND']} y={900} at={P(24) + 0.5} size={150} />;
const Poor = ({t}: {t: number}) => <>
  <Penguin id="usdoug" x={540} y={1500} h={900} outfit="usa" pose={{brows: 'worried', beak: 'frown', lids: 0.35, tears: t > P(25) + 0.2}} />
</>;
const Stat = ({big, label, src, color, at, t}: {big: string; label: string; src: string; color: string; at: number; t: number}) => <>
  <Txt text={big} x={540} y={760} size={190} color={color} t={t} at={at} />
  <Txt text={label} x={540} y={980} size={70} color={INK} t={t} at={at + 0.3} rot={-1} />
  {t > at + 0.5 && <div style={{position: 'absolute', left: 0, right: 0, top: 1080, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 700, fontSize: 34, color: '#777'}}>{src}</div>}
</>;
const RealFr = ({t}: {t: number}) => <>
  <Txt text="IN REAL LIFE" x={540} y={380} size={100} color={INK} t={t} at={P(26)} />
  <div style={{position: 'absolute', left: 480, top: 470, transform: `skewY(${Math.sin(t * 5) * 3}deg)`}}><FrFlag w={120} /></div>
  <Stat big="€37,500" label="house near Boussac, France" src="listing: french-property.com (2026)" color={GREEN} at={P(26) + 1.8} t={t} />
  <StoneHouse x={540} y={1500} w={300} />
</>;
const RealUs = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 480, top: 470, transform: `skewY(${Math.sin(t * 5) * 3}deg)`}}><UsFlag w={120} /></div>
  <Stat big="$905,000" label="typical California house" src="C.A.R. 2026 forecast (median)" color={RED} at={P(27) + 1} t={t} />
  <LuxHouse x={540} y={1500} w={420} />
</>;
const Buy = ({t}: {t: number}) => <>
  <Ground />
  <LuxHouse x={560} y={1250} w={600} />
  <Stamp text="SOLD" x={560} y={720} at={P(28) + 0.4} color={GREEN} size={100} />
  <Penguin id="frdoug" x={830} y={1440} h={320} outfit="french" pose={{beak: 'smile', brows: 'happy', blush: 1, hop: Math.abs(Math.sin(t * 7)) * 40, flapL: 130, flapR: 130}} />
</>;
const Good = ({t}: {t: number}) => <>
  <Sun x={880} y={300} t={t} />
  <Ground />
  {[0, 1, 2, 3, 4, 5].map((i) => <svg key={i} width={70} height={110} viewBox="0 0 70 110" style={{position: 'absolute', left: 60 + i * 170, top: 1150}}>
    <path d="M35 110 L35 50" stroke="#3E9B4F" strokeWidth={8} /><circle cx={35} cy={40} r={26} fill={['#E8546A', '#F5B400', '#B06AD9'][i % 3]} stroke={INK} strokeWidth={5} /></svg>)}
  <Penguin id="frdoug" x={420} y={1250} h={520} outfit="french" pose={{beak: 'smile', brows: 'happy', flapR: 120 + Math.sin(t * 10) * 15}} />
  <Baguette x={600} y={820} rot={-50 + Math.sin(t * 8) * 10} />
  <Txt text="LIFE IS GOOD" x={540} y={520} size={110} color={GREEN} t={t} at={P(29) + 1} />
</>;
const NeedJob = ({t}: {t: number}) => <>
  <Ground />
  <Penguin id="frdoug" x={420} y={1250} h={520} outfit="french" pose={{beak: 'frown', brows: 'worried', eyeScale: 1.3, pupil: 0.6, tremble: 0.6, look: [0.6, -0.4]}} />
  <Txt text="JOB?" x={800} y={600} size={200} color={RED} t={t} at={P(30) + 0.9} />
</>;
const Drive = ({t}: {t: number}) => {
  const d = t - P(31);
  return <>
    <Ground y={1200} />
    {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: 'absolute', left: ((i * 220 - d * 600) % 1320 + 1320) % 1320 - 120, top: 1240, width: 120, height: 14, background: INK, borderRadius: 7}} />)}
    <Car x={540} y={1200} w={460} c="#5EC4FA" />
    <div style={{position: 'absolute', left: 0, top: 0}}><Penguin id="frdoug" x={560} y={1060} h={150} outfit="french" shadow={false} pose={{beak: 'frown', brows: 'worried'}} /></div>
    <Pop at={P(31) + 0.3} t={t} x={540} y={420}><div style={{background: '#2E7D4F', border: `7px solid ${INK}`, borderRadius: 14, padding: '10px 30px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 66, color: '#fff'}}>JOB → 1 HOUR</div></Pop>
    <Clock x={540} y={700} t={d * 2} />
    <Txt text="2 HOURS / DAY" x={540} y={1450} size={100} color={RED} t={t} at={P(31) + 2.1} />
  </>;
};
const LarryBuys = ({t}: {t: number}) => <>
  <Ground />
  <LuxHouse x={560} y={1250} w={560} />
  <Walrus x={850} y={1290} h={480} pose={{laugh: t > P(32) + 1 ? 1 : 0, mouth: Math.abs(Math.sin(t * 10)) * 0.5}} />
  <Stamp text="LARRY'S" x={540} y={680} at={P(32) + 1.2} color={RED} size={90} />
  <Palm x={150} y={1250} s={0.8} />
</>;
const Rent = ({t}: {t: number}) => {
  const d = t - P(33);
  return <>
    <Ground />
    <Walrus x={800} y={1250} h={480} flip pose={{laugh: 1}} />
    <Penguin id="frdoug" x={260} y={1250} h={420} outfit="french" pose={{beak: 'frown', brows: 'worried', flapR: 110}} />
    {[0, 1, 2].map((i) => { const p = cl((d - 0.2 - i * 0.35) / 0.6); return p > 0 && p < 1 ? <Fish key={i} x={330 + 360 * p} y={950 - Math.sin(p * Math.PI) * 220} w={100} rot={p * 300} /> : null; })}
    <Txt text="EVERY MONTH" x={540} y={520} size={100} color={RED} t={t} at={P(33) + 0.8} />
  </>;
};
const Equation = ({t}: {t: number}) => <>
  <Txt text="CHEAP HOUSE" x={300} y={600} size={80} color={GREEN} t={t} at={P(34)} />
  <Txt text="NO JOB ✗" x={780} y={600} size={80} color={RED} t={t} at={P(34) + 0.5} />
  <Txt text="BIG JOB" x={300} y={900} size={80} color={GREEN} t={t} at={P(34) + 1} />
  <Txt text="NO HOUSE ✗" x={780} y={900} size={80} color={RED} t={t} at={P(34) + 1.4} />
  <Penguin id="frdoug" x={330} y={1450} h={320} outfit="french" pose={{brows: 'worried', look: [0.5, -0.5]}} />
  <Penguin id="usdoug" x={750} y={1450} h={320} outfit="usa" pose={{brows: 'worried', look: [-0.5, -0.5]}} />
</>;
const Cta = ({t}: {t: number}) => <>
  {[['$1,000,000 HOUSE', RED], ['$35,000 VILLAGE', GREEN]].map(([s, c], i) => { const p = ease((t - P(35) - 0.3 - i * 1.2) / 0.25);
    return <div key={s} style={{position: 'absolute', left: 140, top: 520 + i * 230, width: 800, height: 170, background: '#fff', border: `8px solid ${c}`, borderRadius: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: c, transform: `scale(${p}) rotate(${i % 2 ? 2 : -2}deg)`}}>{s}</div>; })}
  <Penguin id="usdoug" x={300} y={1450} h={320} outfit="usa" pose={{beak: 'smile', flapR: 120 + Math.sin(t * 10) * 10}} />
  <Penguin id="frdoug" x={780} y={1450} h={320} outfit="french" pose={{beak: 'smile', flapL: 120 + Math.sin(t * 10) * 10}} />
  <Txt text="👇" x={540} y={1300} size={150} color={INK} t={t} at={P(36)} rot={0} />
</>;

type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: HOOK_END, set: (t) => <Intro t={t} />, fx_: 'swipe'},
  {at: P(6), set: (t) => <California t={t} />, fx_: 'zoom'},
  {at: P(7), set: (t) => <FishPileShot t={t} />, fx_: 'pop'},
  {at: P(8), set: (t) => <Village t={t} />, fx_: 'swipeL'},
  {at: P(9), set: (t) => <CarShot t={t} />, fx_: 'swipe'},
  {at: P(10), set: (t) => <Same t={t} />, fx_: 'iris'},
  {at: P(11), set: (t) => <Jobs t={t} />, fx_: 'zoom'},
  {at: P(12), set: (t) => <BigJobs t={t} />, fx_: 'swipe'},
  {at: P(13), set: (t) => <Everybody t={t} />, fx_: 'swipeL'},
  {at: P(14), set: (t) => <FewHouses t={t} />, fx_: 'pop'},
  {at: P(15), set: (t) => <Rules t={t} />, fx_: 'swipe'},
  {at: P(16), set: (t) => <Auction t={t} />, fx_: 'zoom'},
  {at: P(17), set: (t) => <PriceUp t={t} />, fx_: 'pop'},
  {at: P(19), set: (t) => <NoJobs t={t} />, fx_: 'iris'},
  {at: P(20), set: (t) => <Leave t={t} />, fx_: 'swipe'},
  {at: P(21), set: (t) => <NobodyWant t={t} />, fx_: 'swipeL'},
  {at: P(22), set: (t) => <PriceDown t={t} />, fx_: 'pop'},
  {at: P(24), set: () => <Called />, fx_: 'zoom'},
  {at: P(25), set: (t) => <Poor t={t} />, fx_: 'zoom'},
  {at: P(26), set: (t) => <RealFr t={t} />, fx_: 'swipe'},
  {at: P(27), set: (t) => <RealUs t={t} />, fx_: 'swipeL'},
  {at: P(28), set: (t) => <Buy t={t} />, fx_: 'iris'},
  {at: P(29), set: (t) => <Good t={t} />, fx_: 'pop'},
  {at: P(30), set: (t) => <NeedJob t={t} />, fx_: 'zoom'},
  {at: P(31), set: (t) => <Drive t={t} />, fx_: 'swipe'},
  {at: P(32), set: (t) => <LarryBuys t={t} />, fx_: 'iris'},
  {at: P(33), set: (t) => <Rent t={t} />, fx_: 'swipeL'},
  {at: P(34), set: (t) => <Equation t={t} />, fx_: 'pop'},
  {at: P(35), set: (t) => <Cta t={t} />, fx_: 'swipe'},
];
// deep zooms [segment, focusX, focusY, scale] — dive onto the named subject, released on the next phrase
const DEEP: [number, number, number, number][] = [[7, 540, 1000, 1.35], [15, 780, 860, 1.4], [18, 540, 500, 1.5], [23, 540, 1350, 1.4], [25, 540, 1000, 1.7], [27, 540, 800, 1.3], [31, 540, 500, 1.3]];

export const DougHome = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side named (America, then France)
    const toU = ease((tc - US_AT) / 0.35) * (tc < FR_AT ? 1 : 0), toF = ease((tc - FR_AT) / 0.35);
    s0 = 1 + 0.16 * (toU + toF); fx = 540 - 270 * toU + 270 * toF; fy = 960 + 40 * (toU + toF);
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (tc < HOOK_END ? 1 : beat(tc, TIM));
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    {!getInputProps().noCaptions && tc >= HOOK_END && <Captions t={tc} phrases={TIM} place={CAP} bare />}
    <Audio src={staticFile('doug-home-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
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
    <Sfx at={P(6) + 1.2} name="user-cash-register" vol={0.4} />
    <Sfx at={P(6) + 1.4} name="user-shock" vol={0.35} />
    <Sfx at={P(7)} name="user-money" vol={0.35} />
    <Sfx at={P(7) + 0.4} name="user-ting" vol={0.35} />
    <Sfx at={P(8) + 2} name="user-money" vol={0.35} />
    <Sfx at={P(8) + 2.2} name="user-yeah" vol={0.35} />
    <Sfx at={P(9) + 0.6} name="user-boom" vol={0.35} />
    {[0, 1, 2].map((i) => <Sfx key={`c${i}`} at={P(10) + i * 0.6} name="user-pop" vol={0.3} />)}
    <Sfx at={P(10) + 1.9} name="user-wrong" vol={0.3} />
    <Sfx at={P(11) + 1.4} name="user-boom" vol={0.4} />
    <Sfx at={P(12) + 0.9} name="user-pop" vol={0.3} />
    <Sfx at={P(12) + 1.5} name="user-cash-register" vol={0.35} />
    <Sfx at={P(13) + 0.2} name="gull-caw" vol={0.25} />
    <Sfx at={P(14) + 0.7} name="user-shock" vol={0.3} />
    <Sfx at={P(15) + 0.7} name="user-slap" vol={0.4} />
    {[0, 1, 2].map((i) => <Sfx key={`b${i}`} at={P(16) + 0.4 + i * 0.5} name="user-money" vol={0.3} />)}
    <Sfx at={E(16) - 0.5} name="user-slap" vol={0.4} />
    <Sfx at={P(17)} name="user-wow" vol={0.3} />
    <Sfx at={P(18)} name="user-cash-register" vol={0.4} />
    <Sfx at={P(19) + 0.6} name="user-wrong" vol={0.35} />
    <Sfx at={P(20) + 0.5} name="user-horn" vol={0.3} />
    <Sfx at={P(21) + 0.6} name="user-aww" vol={0.35} />
    <Sfx at={P(23)} name="user-ting" vol={0.4} />
    <Sfx at={P(24) + 0.5} name="user-ting" vol={0.35} />
    <Sfx at={P(25)} name="user-fahh" vol={0.45} />
    <Sfx at={P(26) + 1.8} name="user-ting" vol={0.4} />
    <Sfx at={P(27) + 1} name="user-cash-register" vol={0.4} />
    <Sfx at={P(28) + 0.4} name="user-slap" vol={0.35} />
    <Sfx at={P(28) + 0.8} name="user-yeah" vol={0.35} />
    <Sfx at={P(29) + 1} name="user-wow" vol={0.3} />
    <Sfx at={P(30)} name="user-wrong" vol={0.35} />
    <Sfx at={P(30) + 0.9} name="user-shock" vol={0.35} />
    <Sfx at={P(31) + 0.3} name="user-timer" vol={0.3} />
    <Sfx at={P(31) + 2.1} name="user-fahh-long" vol={0.35} />
    <Sfx at={P(32) + 1} name="walrus-laugh" vol={0.35} />
    <Sfx at={P(32) + 1.2} name="user-slap" vol={0.35} />
    <Sfx at={P(33) + 0.2} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(33) + 0.8} name="user-timer" vol={0.3} />
    <Sfx at={P(34) + 0.5} name="user-wrong" vol={0.3} />
    <Sfx at={P(34) + 1.4} name="user-wrong" vol={0.3} />
    <Sfx at={P(35) + 0.3} name="user-pop" vol={0.35} />
    <Sfx at={P(35) + 1.5} name="user-pop" vol={0.35} />
    <Sfx at={P(36)} name="user-ting" vol={0.35} />
  </AbsoluteFill>;
};
