// EP "Gas: America vs Kuwait" — hook still first (approval), full episode after.
// Hook: "Why is gas $5.02 in America but just $1 in Kuwait?" ($5.02 = AAA record Jun 14 2022; Kuwait Premium 91 = 85 fils/L ≈ $1.05/gal).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-kuwait-hook.json';
import {UsFlag} from './dougVenezuela';

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
const US_AT = TIM[0].start, US_PRICE = 0.85, KW_AT = TIM[1].start, KW_PRICE = KW_AT + 0.75;
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

export const KuwaitHook = ({t}: {t: number}) => {
  // Doug: puzzled look toward America, points at it; then whips to Kuwait, stunned, points at it.
  const toUS = ease((t - 0.3) / 0.35), toKW = ease((t - KW_AT) / 0.25), shock = ease((t - KW_PRICE) / 0.15);
  const turn = mix(mix(0, -0.5, toUS), 0.5, toKW);
  const lookX = mix(mix(0, -0.85, toUS), 0.85, toKW);
  const pointL = ease((t - US_PRICE) / 0.3) * (1 - toKW), pointR = ease((t - (KW_AT + 0.35)) / 0.3);
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
  const z1 = ease((tc - 0.3) / 2.6), z2 = ease((tc - KW_AT) / 0.45), z3 = ease((tc - KW_AT - 0.45) / 1.6);
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
