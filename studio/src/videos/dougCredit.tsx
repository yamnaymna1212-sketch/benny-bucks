// EP8 "Credit score: same $25,000 car, Doug pays $10,000 more". Hook image first (approval).
// Numbers: $25,000 used car, 60 months. APR by VantageScore tier, Experian Q1 2026 (used): 501-600 = 19.42%, 781-850 = 6.30%.
// $100,000 car, 60 months: 19.42% -> $157,033 total ($2,617/mo) ; 6.30% -> $116,837 total ($1,947/mo).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Fonts, HandFont} from '../base';
import {INK, Penguin} from '../penguin/rig';
import {Otter} from './dougFriend';

const G = 1300;
const RED = '#D83A2E', GREEN = '#2E9E4F';

// Original sleek electric flying car (no brand, no logo): white body, glass roof, glowing thrusters, hover glow + shadow.
const FlyCar = ({x, y, w = 440, t = 0}: {x: number; y: number; w?: number; t?: number}) => {
  const k = w / 400, bob = Math.sin(t * 3) * 6;
  return <svg width={w} height={190 * k} viewBox="0 0 400 190" style={{position: 'absolute', left: x - w / 2, top: y - 190 * k + bob, overflow: 'visible'}}>
    <ellipse cx={200} cy={186 + 40 - bob} rx={150} ry={12} fill="rgba(30,40,60,0.16)" />
    <ellipse cx={110} cy={150} rx={44} ry={10} fill="#7FD8FF" opacity={0.55} />
    <ellipse cx={300} cy={150} rx={44} ry={10} fill="#7FD8FF" opacity={0.55} />
    <path d="M62 150 L64 168 M158 150 L156 168 M252 150 L250 168 M348 150 L346 168" stroke="#7FD8FF" strokeWidth={9} strokeLinecap="round" opacity={0.7} />
    <path d="M8 128 Q10 104 40 98 L120 92 Q150 44 196 40 L262 40 Q304 44 330 90 L372 100 Q394 108 392 130 L388 142 Q380 152 366 152 L34 152 Q14 150 8 140 Z" fill="#F4F6F8" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M132 92 Q156 56 198 52 L258 52 Q290 56 312 92 Z" fill="#9ED9F7" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <line x1={226} y1={52} x2={226} y2={92} stroke={INK} strokeWidth={4} />
    <path d="M20 122 L380 122" stroke="#C7CDD3" strokeWidth={5} />
    <rect x={350} y={104} width={32} height={9} rx={4} fill="#FFE08A" stroke={INK} strokeWidth={3} />
    <rect x={14} y={106} width={22} height={9} rx={4} fill="#FF6B5E" stroke={INK} strokeWidth={3} />
    <path d="M-20 70 L-60 70 M-30 92 L-90 92 M-14 114 L-74 114" stroke="#BFE6FA" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
    <g>{[110, 300].map((cx) => <g key={cx}><circle cx={cx} cy={150} r={26} fill={INK} /><circle cx={cx} cy={150} r={11} fill="#D7DDE2" stroke={INK} strokeWidth={3} /></g>)}</g>
  </svg>;
};

const Cost = ({x, y, n, color, t}: {x: number; y: number; n: string; color: string; t: number}) =>
  <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 92, lineHeight: '110px', color, WebkitTextStroke: `5px ${INK}`, paintOrder: 'stroke fill'}}>{n}</div>;

export const CreditHook = ({t = 0}: {t?: number}) => <>
  <div style={{position: 'absolute', left: 538, top: 420, width: 6, height: 870, background: INK, opacity: 0.85}} />
  <div style={{position: 'absolute', left: -400, right: -400, top: 1290, height: 700, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 112, lineHeight: '120px', color: INK, transform: 'rotate(-2deg)'}}>
    what's the<br />difference<span style={{color: RED}}>?</span>
  </div>
  <div style={{position: 'absolute', left: 0, top: 470, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 110, color: RED}}>550</div>
  <div style={{position: 'absolute', left: 540, top: 470, width: 540, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 110, color: GREEN}}>790</div>
  {[270, 810].map((x) => <div key={x} style={{position: 'absolute', left: x - 200, width: 400, top: 600, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 44, color: INK}}>credit score</div>)}
  <FlyCar x={270} y={1010} w={500} t={t} />
  <FlyCar x={810} y={1010} w={500} t={t + 1} />
  <Cost x={270} y={1120} n="$157,033" color={RED} t={t} />
  <Cost x={810} y={1120} n="$116,837" color={GREEN} t={t} />
  <Penguin id="doug" x={270} y={G + 540} h={330} pose={{turn: 0.5, look: [0.4, -0.5], brows: 'shock', eyeScale: 1.35, sweat: true, tears: true}} />
  <Otter x={810} y={G + 540} h={320} flip t={t} />
</>;

export const DOUG_CREDIT_HOOK_SECONDS = 3;
export const DougCreditHook = () => <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}><Fonts /><HandFont /><CreditHook /></AbsoluteFill>;
