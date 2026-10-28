// EP "Gas: America vs Kuwait" — hook still first (approval), full episode after.
// Hook: "Why is gas $5.02 in America but just $1 in Kuwait?" ($5.02 = AAA record Jun 14 2022; Kuwait Premium 91 = 85 fils/L ≈ $1.05/gal).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-kuwait-hook.json';
import FULL from '../data/doug-kuwait.json';
import {Walrus, Seagull, Puffin} from '../penguin/cast';
import {BigWord, FishFlight, Stamp, Vault} from '../penguin/world';
import {Barrel, GasCan, GasSign, MoneyBag, OilGush, Pump} from './dougGas';
import {Fx, cutFX} from '../penguin/acting';
import {UsFlag} from './dougVenezuela';

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F', YELLOW = '#F7C948';
const G = 1640;

const KwFlag = () => <g>
  <rect width={190} height={40} fill="#007A3D" /><rect y={40} width={190} height={40} fill="#fff" /><rect y={80} width={190} height={40} fill="#CE1126" />
  <path d="M0 0 L52 40 L52 80 L0 120 Z" fill={INK} />
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} />
</g>;

// Yellow brush stroke with a heavy "WHY" and little shock dashes on both sides.
const WhyBanner = ({t}: {t: number}) => {
  const p = ease((t + 0.12) / 0.25);
  return <svg width={1080} height={420} viewBox="0 0 1080 420" style={{position: 'absolute', left: 0, top: 120, opacity: p, transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: '50% 50%'}}>
    <path d="M190 120 C 330 92, 640 84, 900 96 L 912 132 C 880 150, 905 190, 895 230 C 902 268, 880 300, 890 322 C 640 340, 380 336, 182 330 C 196 300, 170 270, 186 236 C 172 200, 196 160, 170 140 Z" fill={YELLOW} />
    <text x={540} y={300} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={250} fill={INK} letterSpacing={-6} transform="rotate(-3 540 220)">WHY</text>
    {[[150, 150, 80, 120], [130, 220, 50, 220], [150, 290, 80, 330], [930, 150, 1000, 120], [950, 220, 1030, 220], [930, 290, 1000, 330]].map(([x1, y1, x2, y2], i) =>
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={14} strokeLinecap="round" />)}
  </svg>;
};

// Simple gas pump: solid red body, screen, black hose + nozzle on the side. Same pump on both sides.
const GasPump = ({x, bottom, s = 0.9}: {x: number; bottom: number; s?: number}) =>
  <svg width={300} height={470} viewBox="0 0 300 470" style={{position: 'absolute', left: x - 150 * s, top: bottom - 470 * s, overflow: 'visible', transform: `scale(${s})`, transformOrigin: '0 0'}}>
    {/* body: one solid colour, like the real thing (and the ⛽ icon) */}
    <rect x={20} y={20} width={230} height={400} rx={30} fill="#D9372B" stroke={INK} strokeWidth={9} />
    <rect x={50} y={60} width={170} height={110} rx={14} fill="#F4F6F8" stroke={INK} strokeWidth={7} />
    <path d="M135 222 C 135 222, 92 290, 92 322 A 43 43 0 0 0 178 322 C 178 290, 135 222, 135 222 Z" fill="#fff" stroke={INK} strokeWidth={7} />
    {/* hose from the bottom of the pump up to the nozzle hanging on its side */}
    <path d="M250 370 C 330 350, 335 230, 292 186" fill="none" stroke={INK} strokeWidth={18} strokeLinecap="round" />
    <rect x={250} y={96} width={46} height={98} rx={12} fill="#2B2B2B" stroke={INK} strokeWidth={6} />
    <rect x={226} y={102} width={40} height={20} rx={6} fill="#2B2B2B" stroke={INK} strokeWidth={6} />
    {/* base */}
    <rect x={0} y={420} width={270} height={34} rx={8} fill="#555" stroke={INK} strokeWidth={7} />
  </svg>;

// One column: waving flag, big price board, down arrow, pump.
const Side = ({x, flag, price, color, t, hit}: {x: number; flag: 'us' | 'kw'; price: string; color: string; t: number; hit: number}) => {
  const wave = Math.sin(t * 4) * 2.5, d = t - hit, punch = d >= 0 && d < 0.5 ? 1 + 0.12 * Math.sin(d / 0.5 * Math.PI) : 1;
  return <div style={{position: 'absolute', left: x - 230, top: 0, width: 460, height: 1920}}>
    <svg width={460} height={1920} viewBox="0 0 460 1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g transform={`translate(${230 - 133} ${610 + wave}) scale(1.4) skewY(${wave * 0.6})`}>{flag === 'us' ? <UsFlag /> : <KwFlag />}</g>
      <g transform={`translate(230 975) scale(${punch}) translate(-230 -975)`}>
      <rect x={40} y={850} width={380} height={250} rx={30} fill="#fff" stroke={INK} strokeWidth={9} />
      <text x={230} y={1000} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={126} fill={color} letterSpacing={-4}>{price}</text>
      <text x={230} y={1065} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={42} fill={INK}>PER GALLON</text>
      </g>
      <path d="M230 1120 L230 1190 M205 1160 L230 1192 L255 1160" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <GasPump x={230} bottom={G + 6} />
  </div>;
};

const Q = ({x, y, t, r, on}: {x: number; y: number; t: number; r: number; on: number}) =>
  <div style={{position: 'absolute', left: x, top: y + Math.sin(t * 5 + r) * 6, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 100, color: INK, opacity: on, transform: `rotate(${r * 14}deg) scale(${0.6 + 0.4 * on})`}}>?</div>;

const Vs = ({t}: {t: number}) =>
  <div style={{position: 'absolute', left: 540 - 70, top: 975 - 70, width: 140, height: 140, borderRadius: '50%', background: RED, border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: '#fff', transform: `rotate(${-8 + Math.sin(t * 4) * 3}deg)`}}>VS</div>;

// Red hand-drawn arrow under WHY: draws itself toward America, swings to Kuwait when Kuwait is spoken.
const Arrow = ({t, drawAt, swingAt}: {t: number; drawAt: number; swingAt: number}) => {
  const draw = ease((t - drawAt) / 0.4), sw = t < swingAt ? 0 : cl((t - swingAt) / 0.35);
  const ang = 140 + (40 - 140) * ease(sw) - (sw < 1 ? Math.sin(sw * Math.PI) * 10 : 0);
  if (draw <= 0) return null;
  return <svg width={10} height={10} style={{position: 'absolute', left: 540, top: 500, overflow: 'visible'}}>
    <g transform={`rotate(${ang})`}>
      <path d="M0 0 Q 80 -30, 160 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />
      {draw > 0.9 && <path d="M160 0 L120 -26 M160 0 L122 28" fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />}
    </g>
  </svg>;
};

// Beats (s) from the hook voice: line 1 = America, line 2 = Kuwait.
// price words sit at ~28% of line 1 and ~42% of line 2 (scales with any voice speed)
const US_AT = TIM[0].start, US_PRICE = US_AT + 0.28 * (TIM[0].end - US_AT), KW_AT = TIM[1].start, KW_PRICE = KW_AT + 0.42 * (TIM[1].end - KW_AT);
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

export const KuwaitHook = ({t}: {t: number}) => {
  // Doug: puzzled look toward America, points at it; then whips to Kuwait, stunned, points at it.
  const toUS = ease((t - 0.2) / 0.3), toKW = ease((t - KW_AT) / 0.2), shock = ease((t - KW_PRICE) / 0.15);
  const turn = mix(mix(0, -0.5, toUS), 0.5, toKW);
  const lookX = mix(mix(0, -0.85, toUS), 0.85, toKW);
  const pointL = ease((t - US_PRICE) / 0.3) * (1 - toKW), pointR = ease((t - (KW_AT + 0.2)) / 0.25);
  const jolt = t >= KW_PRICE && t < KW_PRICE + 0.3 ? Math.sin((t - KW_PRICE) / 0.3 * Math.PI) : 0;
  return <>
    <WhyBanner t={t} />
    <Side x={215} flag="us" price="$5.02" color={RED} t={t} hit={US_PRICE} />
    <Side x={865} flag="kw" price="$1.05" color={GREEN} t={t} hit={KW_PRICE} />
    <Vs t={t} />
    <Arrow t={t} drawAt={US_AT + 0.2} swingAt={KW_AT} />
    <Penguin id="doug" x={540} y={G + 6 - jolt * 30} h={440} pose={{turn, look: [lookX, -0.35], brows: toKW > 0.5 ? 'shock' : 'worried',
      eyeScale: mix(1.1, 1.35, shock), pupil: mix(1, 0.5, shock), beak: 'frown', mouth: shock * 0.6, sweat: shock > 0.5,
      flapL: mix(8, 105, pointL), flapR: mix(8, 105, pointR), squash: jolt * 0.08}} />
    <Q x={430} y={1170} t={t} r={-1} on={toUS * (1 - toKW)} />
    <Q x={600} y={1160} t={t} r={1} on={toKW} />
  </>;
};

export const DOUG_KUWAIT_HOOK_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.6) * 30) / 30;
export const DougKuwaitHook = () => {
  const frame = useCurrentFrame(), tc = frame / FPS, t = onTwos(frame);
  // slow push toward the side being spoken: America first, then a quick pan to Kuwait and keep pushing
  const z1 = ease((tc - 0.3) / (KW_AT - 0.3)), z2 = ease((tc - KW_AT) / 0.35), z3 = ease((tc - KW_AT - 0.35) / 1.2);
  const s = (1 + 0.16 * z1 + 0.06 * z3) * beat(tc, TIM);
  const fx = mix(mix(540, 300, z1), 780, z2), fy = mix(960, 1080, z1);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}><KuwaitHook t={t} /></AbsoluteFill>
    <Captions t={tc} phrases={TIM} y={1700} />
    <Audio src={staticFile('doug-kuwait-hook-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.3} name="user-whoosh" vol={0.22} />
    <Sfx at={US_PRICE} name="user-cash-register" vol={0.35} />
    <Sfx at={KW_AT - 0.05} name="user-whoosh" vol={0.25} />
    <Sfx at={KW_PRICE} name="user-boom" vol={0.45} />
  </AbsoluteFill>;
};

// =====================================================================
// FULL EPISODE "3 reasons" countdown (new style: reason cards, no caveman lines). Timings: data/doug-kuwait.json
// =====================================================================
const ROW = FULL;
const P = (i: number) => ROW[i].start, E = (i: number) => ROW[i].end;
export const DOUG_KUWAIT_SECONDS = Math.ceil((ROW[ROW.length - 1].end + 0.3) * 30) / 30;
const GR = 1300;
const NAVY = '#1F3A5F';

const Ground = ({sand}: {sand?: boolean}) =>
  <div style={{position: 'absolute', left: -400, right: -400, top: GR, height: 900, background: sand ? '#F2DCA0' : '#EEF2F5', borderTop: `6px solid ${INK}`}} />;
const FlagAt = ({x, y, flag, s = 1}: {x: number; y: number; flag: 'us' | 'kw'; s?: number}) =>
  <svg width={190 * s} height={120 * s} viewBox="-4 -4 198 128" style={{position: 'absolute', left: x - 95 * s, top: y - 60 * s, overflow: 'visible'}}>{flag === 'us' ? <UsFlag /> : <KwFlag />}</svg>;
const Board = ({x, y, price, color, label, w = 380, at = -99, t}: {x: number; y: number; price: string; color: string; label?: string; w?: number; at?: number; t: number}) => {
  const p = ease((t - at) / 0.25); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - 110, width: w, height: 220, background: '#fff', border: `9px solid ${INK}`, borderRadius: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.5 + 0.5 * p})`}}>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: price.length > 6 ? 90 : 120, color, letterSpacing: -4, lineHeight: 1}}>{price}</div>
    {label && <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 40, color: INK}}>{label}</div>}
  </div>;
};

// Countdown card: big number in a circle + the reason title. (New format for this episode.)
const ReasonCard = ({n, title, t, at}: {n: number; title: string[]; t: number; at: number}) => {
  const p = ease((t - at) / 0.3), spin = (1 - p) * -180;
  return <>
    <div style={{position: 'absolute', inset: -400, background: NAVY}} />
    {Array.from({length: 14}, (_, i) => <div key={i} style={{position: 'absolute', left: 540, top: 760, width: 1400, height: 60, background: 'rgba(255,255,255,0.05)', transformOrigin: '0 50%', transform: `rotate(${i * 360 / 14 + t * 8}deg)`}} />)}
    <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: YELLOW, letterSpacing: 8, opacity: p}}>REASON</div>
    <div style={{position: 'absolute', left: 540 - 210, top: 520, width: 420, height: 420, borderRadius: '50%', background: YELLOW, border: `12px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 300, color: INK, transform: `scale(${p}) rotate(${spin}deg)`}}>{n}</div>
    <div style={{position: 'absolute', left: 40, right: 40, top: 1020, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 104, lineHeight: 1.05, color: '#fff', opacity: ease((t - at - 0.25) / 0.25)}}>
      {title.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  </>;
};

const Capitol = ({x, y}: {x: number; y: number}) =>
  <svg width={420} height={330} viewBox="0 0 420 330" style={{position: 'absolute', left: x - 210, top: y - 330, overflow: 'visible'}}>
    <path d="M110 150 A 100 100 0 0 1 310 150 Z" fill="#fff" stroke={INK} strokeWidth={7} />
    <rect x={200} y={20} width={20} height={40} fill="#fff" stroke={INK} strokeWidth={6} />
    <rect x={40} y={150} width={340} height={30} fill="#fff" stroke={INK} strokeWidth={7} />
    {Array.from({length: 7}, (_, i) => <rect key={i} x={60 + i * 46} y={180} width={22} height={110} fill="#fff" stroke={INK} strokeWidth={5} />)}
    <rect x={20} y={290} width={380} height={34} fill="#fff" stroke={INK} strokeWidth={7} />
  </svg>;

const Coin = ({x, y, text, s = 1}: {x: number; y: number; text: string; s?: number}) =>
  <div style={{position: 'absolute', left: x - 90 * s, top: y - 90 * s, width: 180 * s, height: 180 * s, borderRadius: '50%', background: '#F5C518', border: `8px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64 * s, color: INK}}>{text}</div>;
const fly = (t: number, a: number, d = 0.7) => ease((t - a) / d);

const Barrels = ({x, y, n, cols, s = 1}: {x: number; y: number; n: number; cols: number; s?: number}) => <>
  {Array.from({length: n}, (_, i) => <Barrel key={i} x={x + (i % cols) * 100 * s - (cols - 1) * 50 * s} y={y - Math.floor(i / cols) * 120 * s} />)}
</>;
const Person = ({x, y, s = 1}: {x: number; y: number; s?: number}) =>
  <svg width={40 * s} height={80 * s} viewBox="0 0 40 80" style={{position: 'absolute', left: x - 20 * s, top: y - 80 * s}}>
    <circle cx={20} cy={14} r={11} fill={INK} /><path d="M4 80 L4 40 Q20 24 36 40 L36 80 Z" fill={INK} />
  </svg>;
const Bar = ({x, w, h, color, label, flag, t, at}: {x: number; w: number; h: number; color: string; label: string; flag: 'us' | 'kw' | 'sa'; t: number; at: number}) => {
  const p = ease((t - at) / 0.5);
  return <>
    <div style={{position: 'absolute', left: x - w / 2, top: GR - h * p, width: w, height: h * p, background: color, border: `7px solid ${INK}`, borderRadius: '14px 14px 0 0'}} />
    {p > 0.6 && <div style={{position: 'absolute', left: x - 160, width: 320, top: GR - h * p - 210, textAlign: 'center'}}>
      {flag === 'sa' ? <div style={{width: 190, height: 120, margin: '0 auto', background: '#006C35', border: `5px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 26}}>SAUDI</div>
        : <svg width={190} height={120} viewBox="-4 -4 198 128">{flag === 'us' ? <UsFlag /> : <KwFlag />}</svg>}
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, color: INK, marginTop: 6}}>{label}</div>
    </div>}
  </>;
};
const Ship = ({x, y}: {x: number; y: number}) =>
  <svg width={460} height={260} viewBox="0 0 460 260" style={{position: 'absolute', left: x - 230, top: y - 260, overflow: 'visible'}}>
    <path d="M10 150 L450 150 L400 240 L60 240 Z" fill={RED} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${90 + i * 75} 60)`}><rect width={60} height={88} rx={10} fill="#2C3E50" stroke={INK} strokeWidth={6} /><line x1={0} y1={30} x2={60} y2={30} stroke="#95A5A6" strokeWidth={6} /></g>)}
  </svg>;
const UpArrow = ({x, y, t, at, color = RED}: {x: number; y: number; t: number; at: number; color?: string}) => {
  const p = ease((t - at) / 0.4);
  return <svg width={160} height={260} viewBox="0 0 160 260" style={{position: 'absolute', left: x - 80, top: y - 260 * p, opacity: p, overflow: 'visible'}}>
    <path d="M80 250 L80 50 M20 110 L80 30 L140 110" fill="none" stroke={color} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
};

// ---------- sets ----------
const Reasons = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', inset: -400, background: NAVY}} />
  {[3, 2, 1].map((n, i) => { const p = ease((t - P(2) - 0.2 - i * 0.35) / 0.25);
    return <div key={n} style={{position: 'absolute', left: 140 + i * 300 - 110, top: 640, width: 220, height: 220, borderRadius: '50%', background: n === 1 ? RED : YELLOW, border: `10px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 150, color: n === 1 ? '#fff' : INK, transform: `scale(${p * (n === 1 && t > P(2) + 1.1 ? 1 + 0.08 * Math.sin(t * 12) : 1)})`}}>{n}</div>; })}
  <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 110, color: '#fff'}}>3 REASONS</div>
  <BigWord text="#1 is crazy" x={540} y={1040} at={P(2) + 1.1} color={YELLOW} size={100} />
  <Penguin id="doug" x={540} y={GR + 260} h={420} pose={{look: [0, -0.4], brows: 'worried', eyeScale: 1.15}} />
</>;

const Taxes = ({t}: {t: number}) => {
  const land = ease((t - P(4) - 1.2) / 0.6), grab = t > P(4) + 2.1;
  const fed = fly(t, P(5) + 0.1), state = ease((t - P(6)) / 0.6);
  return <>
    <Ground />
    {t >= P(5) && <><Capitol x={830} y={GR} /><div style={{position: 'absolute', left: 620, width: 420, top: GR + 20, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, color: INK}}>WASHINGTON</div></>}
    <Pump x={t >= P(5) ? 300 : 620} y={GR} t={t} run={t < P(5)} dollars={5.02} />
    <Penguin id="doug" x={t >= P(5) ? 130 : 380} y={GR} h={380} pose={{turn: 0.5, look: [0.6, 0], beak: grab ? 'frown' : 'flat', brows: grab ? 'worried' : 'none'}} />
    {t < P(5) && <Seagull x={lerp(1250, 800, land)} y={lerp(300, GR, land)} h={330} pose={{fly: land < 1, holding: grab, mouth: grab ? 0.5 : 0}} />}
    {t < P(5) && grab && <Coin x={760} y={GR - 300} text="TAX" s={0.8} />}
    {t >= P(5) && t < P(6) && <Coin x={lerp(330, 830, fed)} y={GR - 420 - Math.sin(fed * Math.PI) * 300} text="18¢" />}
    {t >= P(6) && <>
      <Seagull x={lerp(1250, 560, state)} y={lerp(300, GR - 40, state)} h={300} pose={{fly: state < 1, holding: true, mouth: 0.5, angry: true}} />
      <Coin x={lerp(330, 560, state)} y={GR - 480} text="30¢" />
      <BigWord text="STATE TAX" x={540} y={480} at={P(6) + 0.2} color={RED} size={100} />
    </>}
    {t >= P(5) && t < P(6) && <BigWord text="FEDERAL TAX" x={540} y={480} at={P(5)} color={RED} size={100} />}
    <BigWord text="TAKES A CUT" x={540} y={480} at={P(4) + 2} until={P(5)} color={RED} size={110} />
  </>;
};

const ZeroTax = ({t}: {t: number}) => <>
  <Ground sand />
  <FlagAt x={540} y={430} flag="kw" s={1.3} />
  <GasPump x={360} bottom={GR + 6} s={0.8} />
  <Board x={760} y={760} price="$1.05" color={GREEN} label="PER GALLON" t={t} at={P(7)} w={360} />
  <Stamp text="TAX: $0" x={780} y={1010} at={P(7) + 0.9} color={GREEN} size={100} />
</>;

const FiftyCents = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', inset: -400, background: '#FFE3DF'}} />
  <FlagAt x={540} y={360} flag="us" s={1.2} />
  <Coin x={540} y={760} text="50¢" s={1.8} />
  <BigWord text="EVERY GALLON" x={540} y={1060} at={P(8) + 0.5} color={RED} size={110} />
  <Penguin id="doug" x={540} y={GR + 360} h={420} pose={{brows: 'angry', angry: 1, beak: 'frown', tremble: 1}} />
</>;

const Owners = ({t}: {t: number}) => {
  const laugh = t > P(11) + 0.6;
  return <>
    <Ground />
    <OilGush x={250} y={GR} t={t} at={P(10)} />
    <Barrels x={560} y={GR} n={6} cols={3} s={0.9} />
    <FlagAt x={250} y={420} flag="us" />
    <Walrus id="larry" x={820} y={GR} h={460} pose={{laugh: laugh ? 1 : 0, mouth: laugh ? 0.6 : 0.1, look: -0.5}} />
    <BigWord text="OIL COMPANIES" x={540} y={560} at={P(10) + 0.2} until={P(11)} color={INK} size={96} />
    {t >= P(11) && <><BigWord text="WORLD PRICE" x={540} y={420} at={P(11)} color={RED} size={100} /><MoneyBag x={820} y={GR - 520} w={200} label="PROFIT" /></>}
  </>;
};

const OilUp = ({t}: {t: number}) => <>
  <Ground />
  <Barrel x={300} y={GR} />
  <UpArrow x={300} y={GR - 240} t={t} at={P(12) + 0.1} />
  <GasSign x={760} y={GR} state="USA" price={t > P(12) + 1 ? '$5.02' : '$3.10'} t={t} glow={t > P(12) + 1} />
  <UpArrow x={760} y={GR - 520} t={t} at={P(12) + 0.9} />
  <BigWord text="OIL ↑ = GAS ↑" x={540} y={420} at={P(12)} color={RED} size={110} />
</>;

const GovOil = ({t}: {t: number}) => {
  const below = t >= P(14), ppl = t >= P(15);
  return <>
    <Ground sand />
    <FlagAt x={540} y={below ? 380 : 520} flag="kw" s={below ? 1 : 1.4} />
    {!below && <><OilGush x={320} y={GR} t={t} at={P(13)} /><OilGush x={760} y={GR} t={t} at={P(13) + 0.3} /><Stamp text="100% GOVERNMENT" x={540} y={900} at={P(13) + 1.1} color={NAVY} size={84} /></>}
    {below && <>
      <div style={{position: 'absolute', left: -400, right: -400, top: GR + 40, height: 340, background: '#D9B76A', borderTop: `5px dashed ${INK}`}} />
      <Barrels x={540} y={GR + 340} n={18} cols={9} s={0.85} />
      <BigWord text="100 BILLION BARRELS" x={540} y={620} at={P(14) + 0.3} until={P(15)} color={INK} size={66} />
    </>}
    {ppl && <>
      {Array.from({length: 5}, (_, i) => <Person key={i} x={360 + i * 90} y={GR - 10} s={1.4} />)}
      <BigWord text="ONLY 5 MILLION PEOPLE" x={540} y={760} at={P(15) + 0.2} color={RED} size={66} />
    </>}
  </>;
};

const GovPays = ({t}: {t: number}) => {
  const pay = t >= P(18), driver = t >= P(19), cost = t >= P(20);
  return <>
    <Ground sand />
    <GasPump x={300} bottom={GR + 6} s={0.8} />
    {!pay && <><Board x={760} y={700} price="$$$$" color={RED} label="REAL PRICE" t={t} at={P(17) + 0.2} w={380} /><UpArrow x={760} y={1080} t={t} at={P(17) + 0.6} /></>}
    {pay && <>
      <Vault id="kwvault" x={800} y={cost ? 700 : 760} w={cost ? 420 : 320} open={1} fish={cost ? Math.max(0, 6 - Math.floor((t - P(20)) * 3)) : 6} />
      <FishFlight x1={800} y1={760} x2={330} y2={GR - 300} a={P(18) + 0.2} b={P(18) + 1.1} n={4} w={110} />
      {!cost && <FlagAt x={800} y={480} flag="kw" s={0.9} />}
    </>}
    {driver && !cost && <><Puffin id="kwdriver" x={560} y={GR} h={300} pose={{}} /><Board x={300} y={560} price="$1" color={GREEN} label="DRIVER PAYS" t={t} at={P(19)} w={340} /></>}
    {cost && <BigWord text="BILLIONS / YEAR" x={540} y={380} at={P(20) + 0.2} color={RED} size={100} />}
  </>;
};

const Twist = ({t}: {t: number}) => {
  const tw = t >= P(21) + 0.9;
  return <>
    {tw && <div style={{position: 'absolute', inset: -400, background: YELLOW}} />}
    <Penguin id="doug" x={540} y={GR + 300} h={800} pose={tw ? {brows: 'shock', eyeScale: 1.35, pupil: 0.5, mouth: 0.6, beak: 'frown'} : {beak: 'smile', brows: 'happy', lids: 0.3, blush: 1, flapL: 110, flapR: 110}} />
    {!tw && [0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 150 + i * 230, top: 360 + (i % 2) * 120 + Math.sin(t * 6 + i) * 20, fontSize: 90}}>✨</div>)}
    <BigWord text="PERFECT?" x={540} y={380} at={P(21)} until={P(21) + 0.9} color={GREEN} size={130} />
    <BigWord text="THE TWIST" x={540} y={380} at={P(21) + 0.9} color={RED} size={150} />
  </>;
};

const Production = ({t}: {t: number}) => {
  const others = t >= P(23);
  return <>
    <Ground />
    <Bar x={others ? 260 : 540} w={240} h={760} color="#3C6FD6" label="#1 ON EARTH" flag="us" t={t} at={P(22) + 0.1} />
    {others && <><Bar x={560} w={220} h={520} color="#2E9E4F" label="SAUDI" flag="sa" t={t} at={P(23) + 0.9} /><Bar x={840} w={220} h={170} color="#888" label="KUWAIT" flag="kw" t={t} at={P(23)} /></>}
    <BigWord text="OIL PUMPED" x={540} y={260} at={P(22)} color={INK} size={90} />
  </>;
};

const StillPaid = ({t}: {t: number}) => <>
  <Ground />
  <GasPump x={700} bottom={GR + 6} s={0.8} />
  <Board x={700} y={600} price="$5.02" color={RED} label="PER GALLON" t={t} at={P(24)} w={380} />
  <Penguin id="doug" x={330} y={GR} h={430} pose={{turn: 0.5, look: [0.7, -0.2], brows: 'worried', lids: 0.35, beak: 'frown', tears: true}} />
</>;

const Confused = ({t}: {t: number}) => <>
  <Penguin id="doug" x={540} y={GR + 320} h={950} pose={{look: [0.4, -0.7], brows: 'worried', eyeScale: 1.25, beak: 'frown', flapR: 70}} />
  {[-1, 1, 0].map((r, i) => <div key={i} style={{position: 'absolute', left: 300 + i * 220, top: 240 + (i === 2 ? -60 : 0) + Math.sin(t * 5 + i) * 10, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 170, color: INK, transform: `rotate(${r * 14}deg)`}}>?</div>)}
</>;

const Export = ({t}: {t: number}) => {
  const sail = ease((t - P(26) - 0.6) / 2);
  return <>
    <div style={{position: 'absolute', left: -400, right: -400, top: GR - 40, height: 900, background: '#7FB8E6', borderTop: `6px solid ${INK}`}} />
    <Walrus id="larry" x={180} y={GR - 40} h={360} flip pose={{laugh: 1, mouth: 0.5}} />
    <Ship x={lerp(560, 1100, sail)} y={GR + 40} />
    <BigWord text="SOLD AT WORLD PRICE" x={540} y={460} at={P(26) + 0.2} color={RED} size={84} />
  </>;
};

const Tanks = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 540, top: 300, width: 8, height: 1000, background: INK, opacity: 0.25}} />
  <FlagAt x={270} y={420} flag="us" />
  <FlagAt x={810} y={420} flag="kw" />
  <div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: INK}}>ONE FULL TANK</div>
  <GasCan x={270} y={1220} w={200} />
  <GasCan x={810} y={1220} w={200} />
  <Board x={270} y={720} price="$75" color={RED} t={t} at={P(27) + 1.2} w={320} />
  <Board x={810} y={720} price="$15" color={GREEN} t={t} at={P(28) + 0.4} w={320} />
  {t >= P(29) && <>
    <FishFlight x1={810} y1={900} x2={540} y2={1000} a={P(29) + 0.2} b={P(29) + 1} n={6} w={110} />
    <Stamp text="$60 SAVED" x={540} y={980} at={P(29) + 0.9} color={GREEN} size={100} />
  </>}
</>;

const Cta = ({t}: {t: number}) => <>
  <Ground sand />
  <FlagAt x={760} y={560} flag="kw" s={1.2} />
  <GasPump x={820} bottom={GR + 6} s={0.6} />
  <div style={{position: 'absolute', left: 380, top: GR - 150, width: 150, height: 120, background: '#8B5A2B', border: `6px solid ${INK}`, borderRadius: 16}} />
  <Penguin id="doug" x={300} y={GR} h={460} pose={{turn: 0.5, flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.5, -0.2]}} />
  <BigWord text="MOVE TO KUWAIT?" x={540} y={330} at={P(30)} size={100} />
  <BigWord text="👇" x={540} y={1180} at={P(30) + 1.5} size={140} />
</>;

type KShot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const KSHOTS: KShot[] = [
  {at: 0, set: (t) => <KuwaitHook t={t} />},
  {at: P(2), set: (t) => <Reasons t={t} />, fx_: 'pop'},
  {at: P(3), set: (t) => <ReasonCard n={3} title={['TAXES']} t={t} at={P(3)} />, fx_: 'zoom'},
  {at: P(4), set: (t) => <Taxes t={t} />, fx_: 'swipe'},
  {at: P(7), set: (t) => <ZeroTax t={t} />, fx_: 'swipeL'},
  {at: P(8), set: (t) => <FiftyCents t={t} />, fx_: 'pop'},
  {at: P(9), set: (t) => <ReasonCard n={2} title={['WHO OWNS', 'THE OIL?']} t={t} at={P(9)} />, fx_: 'zoom'},
  {at: P(10), set: (t) => <Owners t={t} />, fx_: 'swipe'},
  {at: P(12), set: (t) => <OilUp t={t} />, fx_: 'iris'},
  {at: P(13), set: (t) => <GovOil t={t} />, fx_: 'swipeL'},
  {at: P(16), set: (t) => <ReasonCard n={1} title={['THE GOVERNMENT', 'PAYS FOR GAS']} t={t} at={P(16)} />, fx_: 'zoom'},
  {at: P(17), set: (t) => <GovPays t={t} />, fx_: 'swipe'},
  {at: P(21), set: (t) => <Twist t={t} />, fx_: 'pop'},
  {at: P(22), set: (t) => <Production t={t} />, fx_: 'swipeL'},
  {at: P(24), set: (t) => <StillPaid t={t} />, fx_: 'swipe'},
  {at: P(25), set: (t) => <Confused t={t} />, fx_: 'zoom'},
  {at: P(26), set: (t) => <Export t={t} />, fx_: 'iris'},
  {at: P(27), set: (t) => <Tanks t={t} />, fx_: 'swipe'},
  {at: P(30), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const KDEEP: [number, number, number, number][] = [[5, 600, 1000, 1.3], [14, 540, 1200, 1.2], [19, 420, 1000, 1.35], [23, 540, 1000, 1.2], [28, 810, 900, 1.3]];

export const DougKuwait = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...KSHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) {
    const z1 = ease((tc - 0.3) / (KW_AT - 0.3)), z2 = ease((tc - KW_AT) / 0.35), z3 = ease((tc - KW_AT - 0.35) / 1.2);
    s0 = 1 + 0.16 * z1 + 0.06 * z3; fx = mix(mix(540, 300, z1), 780, z2); fy = mix(960, 1080, z1);
  }
  const dz = KDEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, ROW);
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, KSHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={ROW} y={1700} />
    <Audio src={staticFile('doug-kuwait-voice.mp3')} />
    {KSHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={US_PRICE} name="user-cash-register" vol={0.35} />
    <Sfx at={KW_PRICE} name="user-boom" vol={0.45} />
    {[3, 9, 16].map((i) => <Sfx key={`r${i}`} at={P(i) + 0.2} name="user-boom" vol={0.4} />)}
    <Sfx at={P(2) + 1.1} name="user-shock" vol={0.35} />
    <Sfx at={P(4) + 0.3} name="user-cash-register" vol={0.3} />
    <Sfx at={P(4) + 2.1} name="user-slap" vol={0.35} />
    <Sfx at={P(5) + 0.1} name="user-money" vol={0.35} />
    <Sfx at={P(6) + 0.6} name="user-slap" vol={0.35} />
    <Sfx at={P(7) + 0.9} name="user-ting" vol={0.4} />
    <Sfx at={P(8) + 0.2} name="user-wrong" vol={0.35} />
    <Sfx at={P(11) + 0.6} name="user-cash-register" vol={0.35} />
    <Sfx at={P(12) + 1} name="user-boom" vol={0.35} />
    <Sfx at={P(13) + 1.1} name="user-pop" vol={0.35} />
    <Sfx at={P(14) + 0.3} name="user-wow" vol={0.35} />
    <Sfx at={P(15) + 0.2} name="user-ting" vol={0.35} />
    <Sfx at={P(17) + 0.6} name="user-wrong" vol={0.3} />
    <Sfx at={P(18) + 0.2} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(19)} name="user-ting" vol={0.4} />
    <Sfx at={P(20) + 0.2} name="user-money" vol={0.35} />
    <Sfx at={P(21)} name="user-yeah" vol={0.35} />
    <Sfx at={P(21) + 0.9} name="user-horn" vol={0.4} />
    <Sfx at={P(22) + 0.4} name="user-boom" vol={0.4} />
    <Sfx at={P(24)} name="user-aww" vol={0.4} />
    <Sfx at={P(25)} name="user-fahh" vol={0.45} />
    <Sfx at={P(26) + 0.6} name="user-cash-register" vol={0.3} />
    <Sfx at={P(27) + 1.2} name="user-cash-register" vol={0.35} />
    <Sfx at={P(28) + 0.4} name="user-ting" vol={0.4} />
    <Sfx at={P(29) + 0.9} name="user-wow" vol={0.4} />
    <Sfx at={P(30)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
