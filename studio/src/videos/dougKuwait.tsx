// EP "Gas: America vs Kuwait" — hook still first (approval), full episode after.
// Hook: "Why is gas $5.02 in America but just $1 in Kuwait?" ($5.02 = AAA record Jun 14 2022; Kuwait Premium 91 = 85 fils/L ≈ $1.05/gal).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin} from '../penguin/rig';
import {UsFlag} from './dougVenezuela';

const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F', PUMP = '#2F6FD6', YELLOW = '#F7C948';
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

// One column: waving flag, small tag, big price board, down arrow, pump (same pump colour on both sides).
const Side = ({x, flag, price, color, tag, tagColor, t, at}: {x: number; flag: 'us' | 'kw'; price: string; color: string; tag: string; tagColor: string; t: number; at: number}) => {
  const p = ease((t - at) / 0.3), wave = Math.sin(t * 4) * 2.5;
  return <div style={{position: 'absolute', left: x - 230, top: 0, width: 460, height: 1920, opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
    <svg width={460} height={1920} viewBox="0 0 460 1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g transform={`translate(${230 - 133} ${600 + wave}) scale(1.4) skewY(${wave * 0.6})`}>{flag === 'us' ? <UsFlag /> : <KwFlag />}</g>
      {/* price board */}
      <rect x={20} y={860} width={420} height={250} rx={30} fill="#fff" stroke={INK} strokeWidth={9} />
      <text x={230} y={1010} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={140} fill={color} letterSpacing={-4}>{price}</text>
      <text x={230} y={1075} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={44} fill={INK}>PER GALLON</text>
      {/* down arrow */}
      <path d="M230 1130 L230 1195 M205 1170 L230 1198 L255 1170" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      {/* pump */}
      <g transform="translate(95 1220)">
        <path d="M250 120 C 320 130, 320 300, 280 330" fill="none" stroke={INK} strokeWidth={18} strokeLinecap="round" />
        <path d="M250 120 C 320 130, 320 300, 280 330" fill="none" stroke="#333" strokeWidth={8} strokeLinecap="round" />
        <rect x={262} y={316} width={44} height={70} rx={10} fill={RED} stroke={INK} strokeWidth={6} transform="rotate(-18 284 350)" />
        <rect x={0} y={0} width={260} height={400} rx={34} fill={PUMP} stroke={INK} strokeWidth={9} />
        <rect x={40} y={40} width={180} height={90} rx={12} fill="#DDE6EE" stroke={INK} strokeWidth={7} />
        <rect x={52} y={52} width={156} height={20} rx={6} fill="#fff" opacity={0.7} />
        <rect x={40} y={170} width={180} height={170} rx={16} fill="#2A5DBA" />
        <path d="M130 195 C 130 195, 90 250, 90 280 A 40 40 0 0 0 170 280 C 170 250, 130 195, 130 195 Z" fill="#fff" stroke={INK} strokeWidth={5} />
        <rect x={-20} y={400} width={300} height={30} rx={8} fill="#555" stroke={INK} strokeWidth={7} />
      </g>
    </svg>
    {/* tag above the board: RECORD vs TODAY (keeps the $5.02 honest) */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center'}}>
      <div style={{background: tagColor, color: '#fff', border: `6px solid ${INK}`, borderRadius: 40, padding: '6px 26px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, letterSpacing: 1, transform: 'rotate(-2deg)'}}>{tag}</div>
    </div>
  </div>;
};

const Q = ({x, y, t, r}: {x: number; y: number; t: number; r: number}) =>
  <div style={{position: 'absolute', left: x, top: y + Math.sin(t * 5 + r) * 6, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 100, color: INK, transform: `rotate(${r * 14}deg)`}}>?</div>;

export const KuwaitHook = ({t}: {t: number}) => <>
  <WhyBanner t={t} />
  <Side x={265} flag="us" price="$5.02" color={RED} tag="RECORD · 2022" tagColor={RED} t={t} at={0.15} />
  <Side x={805} flag="kw" price="$1.05" color={GREEN} tag="TODAY" tagColor={GREEN} t={t} at={0.45} />
  <div style={{position: 'absolute', left: 140, right: 140, top: G - 2, height: 16, borderRadius: 8, background: '#E6E8EA'}} />
  <Penguin id="doug" x={540} y={G + 6} h={500} pose={{look: [0, -0.6], brows: 'worried', eyeScale: 1.15, beak: 'frown', flapR: 40, flapL: 20}} />
  <Q x={420} y={1110} t={t} r={-1} />
  <Q x={610} y={1100} t={t} r={1} />
</>;

export const DougKuwaitHook = () => {
  const t = useCurrentFrame() / FPS;
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <KuwaitHook t={t} />
  </AbsoluteFill>;
};
