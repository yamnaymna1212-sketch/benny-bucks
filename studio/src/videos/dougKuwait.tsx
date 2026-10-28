// EP "Gas: America vs Kuwait" — hook still first (approval), full episode after.
// Hook: "Why is gas $5.02 in America but just $1 in Kuwait?" ($5.02 = AAA record Jun 14 2022; Kuwait Premium 91 = 85 fils/L ≈ $1.05/gal).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin} from '../penguin/rig';
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
  const p = ease(t / 0.25);
  return <svg width={1080} height={420} viewBox="0 0 1080 420" style={{position: 'absolute', left: 0, top: 120, opacity: p, transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: '50% 50%'}}>
    <path d="M190 120 C 330 92, 640 84, 900 96 L 912 132 C 880 150, 905 190, 895 230 C 902 268, 880 300, 890 322 C 640 340, 380 336, 182 330 C 196 300, 170 270, 186 236 C 172 200, 196 160, 170 140 Z" fill={YELLOW} />
    <text x={540} y={300} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={250} fill={INK} letterSpacing={-6} transform="rotate(-3 540 220)">WHY</text>
    {[[150, 150, 80, 120], [130, 220, 50, 220], [150, 290, 80, 330], [930, 150, 1000, 120], [950, 220, 1030, 220], [930, 290, 1000, 330]].map(([x1, y1, x2, y2], i) =>
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={14} strokeLinecap="round" />)}
  </svg>;
};

// Classic gas pump (real colours: red body, white panel, black LCD, hose + nozzle). Same pump on both sides.
const GasPump = ({x, bottom, s = 0.9}: {x: number; bottom: number; s?: number}) =>
  <svg width={300} height={470} viewBox="0 0 300 470" style={{position: 'absolute', left: x - 150 * s, top: bottom - 470 * s, overflow: 'visible', transform: `scale(${s})`, transformOrigin: '0 0'}}>
    {/* hose + nozzle on the outer side */}
    <path d="M262 190 C 335 200, 335 330, 290 360" fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" />
    <path d="M262 190 C 335 200, 335 330, 290 360" fill="none" stroke="#3A3A3A" strokeWidth={10} strokeLinecap="round" />
    <g transform="rotate(-14 286 372)">
      <rect x={266} y={352} width={40} height={78} rx={10} fill="#2B2B2B" stroke={INK} strokeWidth={6} />
      <rect x={290} y={364} width={22} height={34} rx={6} fill="#C9CED3" stroke={INK} strokeWidth={5} />
    </g>
    {/* body */}
    <rect x={20} y={40} width={250} height={380} rx={26} fill="#D9372B" stroke={INK} strokeWidth={9} />
    <rect x={20} y={40} width={250} height={64} rx={22} fill="#fff" stroke={INK} strokeWidth={9} />
    <text x={145} y={90} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={48} fill={INK} letterSpacing={4}>GAS</text>
    {/* LCD */}
    <rect x={48} y={128} width={194} height={92} rx={12} fill="#fff" stroke={INK} strokeWidth={7} />
    <rect x={60} y={140} width={170} height={68} rx={8} fill="#1B2A20" />
    <text x={218} y={194} textAnchor="end" fontFamily="Montserrat" fontWeight={800} fontSize={52} fill="#5CFF8A" letterSpacing={2}>0.00</text>
    {/* grade buttons */}
    {[0, 1, 2].map((i) => <rect key={i} x={52 + i * 64} y={246} width={52} height={34} rx={8} fill={['#2E9E4F', '#F2B705', '#2F6FD6'][i]} stroke={INK} strokeWidth={5} />)}
    {/* nozzle holster + drop logo */}
    <rect x={52} y={304} width={186} height={78} rx={14} fill="#fff" stroke={INK} strokeWidth={6} />
    <path d="M145 316 C 145 316, 120 346, 120 358 A 25 25 0 0 0 170 358 C 170 346, 145 316, 145 316 Z" fill="#D9372B" stroke={INK} strokeWidth={5} />
    {/* base */}
    <rect x={0} y={420} width={290} height={34} rx={8} fill="#555" stroke={INK} strokeWidth={7} />
  </svg>;

// One column: waving flag, big price board, down arrow, pump.
const Side = ({x, flag, price, color, t, at}: {x: number; flag: 'us' | 'kw'; price: string; color: string; t: number; at: number}) => {
  const p = ease((t - at) / 0.3), wave = Math.sin(t * 4) * 2.5;
  return <div style={{position: 'absolute', left: x - 230, top: 0, width: 460, height: 1920, opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
    <svg width={460} height={1920} viewBox="0 0 460 1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g transform={`translate(${230 - 133} ${610 + wave}) scale(1.4) skewY(${wave * 0.6})`}>{flag === 'us' ? <UsFlag /> : <KwFlag />}</g>
      <rect x={40} y={850} width={380} height={250} rx={30} fill="#fff" stroke={INK} strokeWidth={9} />
      <text x={230} y={1000} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={126} fill={color} letterSpacing={-4}>{price}</text>
      <text x={230} y={1065} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={42} fill={INK}>PER GALLON</text>
      <path d="M230 1120 L230 1190 M205 1160 L230 1192 L255 1160" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <GasPump x={230} bottom={G + 6} />
  </div>;
};

const Q = ({x, y, t, r}: {x: number; y: number; t: number; r: number}) =>
  <div style={{position: 'absolute', left: x, top: y + Math.sin(t * 5 + r) * 6, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 100, color: INK, transform: `rotate(${r * 14}deg)`}}>?</div>;

export const KuwaitHook = ({t}: {t: number}) => <>
  <WhyBanner t={t} />
  <Side x={215} flag="us" price="$5.02" color={RED} t={t} at={0.15} />
  <Side x={865} flag="kw" price="$1.05" color={GREEN} t={t} at={0.45} />
    <Penguin id="doug" x={540} y={G + 6} h={440} pose={{look: [0, -0.6], brows: 'worried', eyeScale: 1.15, beak: 'frown', flapR: 8, flapL: 8}} />
  <Q x={430} y={1170} t={t} r={-1} />
  <Q x={600} y={1160} t={t} r={1} />
</>;

export const DougKuwaitHook = () => {
  const t = useCurrentFrame() / FPS;
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <KuwaitHook t={t} />
  </AbsoluteFill>;
};
