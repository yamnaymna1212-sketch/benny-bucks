// EP8 hook "Gas: America vs Libya" — built from the user's own image (941x1672), sliced into layers and animated.
// Prices are the user's: USA $5.00 vs LIBYA $0.09 per gallon (verify before the full episode).
// On "Same gas." the scene cuts to one oil barrel filling two identical gas cans.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, back, onTwos} from '../penguin/rig';
import {Title} from '../penguin/world';
import {Captions, Sfx, beat} from '../penguin/edit';
import {cutFX} from '../penguin/acting';
import TIM from '../data/doug-libya.json';

const P = (i: number) => TIM[i].start;
export const LIBYA_HOOK_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 1.2) * 30) / 30;
const RED = '#D83A2E', GREEN = '#239E46', BLUE = '#1F4BA8', K = 1920 / 1672; // image px -> canvas px
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const bump = (t: number, a: number, d = 0.45) => t > a && t < a + d ? Math.sin(((t - a) / d) * Math.PI) : 0;

// A rectangular slice of the user's image; white background disappears (multiply on the white stage).
const Slice = ({x0, y0, x1, y1, dx = 0, dy = 0, rot = 0, sx = 1, sy = 1, filter}: {x0: number; y0: number; x1: number; y1: number; dx?: number; dy?: number; rot?: number; sx?: number; sy?: number; filter?: string}) =>
  <div style={{position: 'absolute', left: x0 * K + dx, top: y0 * K + dy, width: (x1 - x0) * K, height: (y1 - y0) * K, overflow: 'hidden', mixBlendMode: 'multiply',
    transform: `rotate(${rot}deg) scale(${sx}, ${sy})`, transformOrigin: '50% 100%', filter: filter ? `url(#${filter})` : undefined}}>
    <Img src={staticFile('gas/libya.png')} style={{position: 'absolute', left: -x0 * K, top: -y0 * K, width: 941 * K, height: 1672 * K, maxWidth: 'none'}} />
  </div>;
// Flag-wave filter: horizontal ripples, re-seeded every 3 frames.
const WaveFilter = ({id, amount, seed}: {id: string; amount: number; seed: number}) => <svg width={0} height={0} style={{position: 'absolute'}}>
  <filter id={id} x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.025" numOctaves={1} seed={seed} /><feDisplacementMap in="SourceGraphic" scale={amount} xChannelSelector="R" yChannelSelector="G" /></filter>
</svg>;

const Arrow = ({x, y, t, swingAt}: {x: number; y: number; t: number; swingAt: number}) => {
  const draw = ease((t - 0.25) / 0.4), sw = t < swingAt ? 0 : cl((t - swingAt) / 0.35);
  const over = sw < 1 ? Math.sin(sw * Math.PI) * 12 : 0, ang = 148 + (32 - 148) * ease(sw) - over;
  return <svg width={10} height={10} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <g transform={`rotate(${ang})`}>
      <path d="M0 0 Q 70 -28, 140 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="none" stroke={RED} strokeWidth={14} strokeLinecap="round" />
      {draw > 0.9 && <path d="M140 0 L102 -24 M140 0 L104 26" fill="none" stroke={RED} strokeWidth={14} strokeLinecap="round" />}
    </g>
  </svg>;
};
const SideLabel = ({text, x, y, at, t, color, hit}: {text: string; x: number; y: number; at: number; t: number; color: string; hit: number}) => {
  if (t < at) return null;
  const p = back((t - at) / 0.3) * (1 + 0.18 * hit);
  return <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 78, lineHeight: '84px', color, letterSpacing: 2,
    WebkitTextStroke: `10px #fff`, paintOrder: 'stroke fill', transform: `scale(${p})`}}>{text}</div>;
};

const Versus = ({t}: {t: number}) => {
  const f = Math.floor(t * 30), seedA = (f / 3 | 0) % 9 + 1, seedB = ((f / 3 | 0) + 4) % 9 + 1;
  const usHit = bump(t, P(0) + 1.2, 0.5), lyHit = bump(t, P(1) + 0.3, 0.5);
  // people: breathe, bob, lean in when their country is named
  const person = (k: number, hit: number) => ({dy: Math.sin(t * 3 + k) * 8 - hit * 40, rot: Math.sin(t * 2.2 + k) * 2.5 + hit * (k ? 4 : -4), sx: 1 + 0.015 * Math.sin(t * 2.6 + k) + hit * 0.08, sy: 1 + 0.02 * Math.sin(t * 2.6 + k) + hit * 0.08});
  const shake = (a: number, b: number) => t > a && t < b ? Math.sin(t * 50) * 6 : 0;
  const why = back(t / 0.3);
  return <>
    <WaveFilter id="waveA" amount={11} seed={seedA} /><WaveFilter id="waveB" amount={11} seed={seedB} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 20, height: 270, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 240, lineHeight: '260px', color: INK, letterSpacing: -5,
      transform: `scale(${0.6 + 0.4 * cl(why)})`, opacity: cl(why), transformOrigin: '50% 60%'}}>why<span style={{color: RED}}>?</span></div>
    <Arrow x={480} y={250} t={t} swingAt={P(1) - 0.1} />
    {/* busts + waving flags */}
    <Slice x0={0} y0={355} x1={385} y1={735} {...person(0, usHit)} filter="waveA" />
    <Slice x0={560} y0={355} x1={941} y1={735} {...person(2, lyHit)} filter="waveB" />
    <SideLabel text="USA" x={200} y={290} at={0.1} t={t} color={BLUE} hit={usHit} />
    <SideLabel text="LIBYA" x={860} y={290} at={0.25} t={t} color={GREEN} hit={lyHit} />
    {/* price signs */}
    <Slice x0={15} y0={740} x1={385} y1={950} dx={shake(P(0) + 1.2, P(0) + 2.0)} sx={1 + 0.12 * usHit} sy={1 + 0.12 * usHit} />
    <Slice x0={555} y0={740} x1={925} y1={950} dx={shake(P(1), P(1) + 1.0)} sx={1 + 0.12 * lyHit} sy={1 + 0.12 * lyHit} />
    {/* pumps */}
    <Slice x0={10} y0={970} x1={345} y1={1405} rot={Math.sin(t * 5) * 0.8} />
    <Slice x0={595} y0={970} x1={925} y1={1405} rot={Math.sin(t * 5 + 1) * 0.8} />
    {/* middle: VS + Doug */}
    <div style={{position: 'absolute', left: 540 - 70, top: 690 - 70, width: 140, height: 140, borderRadius: '50%', background: RED, border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 66, color: '#fff', transform: `scale(${back((t - 0.4) / 0.3)}) rotate(${-8 + Math.sin(t * 4) * 3}deg)`}}>VS</div>
    <Penguin id="doug" x={540} y={1585} h={400} pose={{brows: 'worried', eyeScale: 1.1, look: [t < P(1) ? -0.6 : 0.6, 0], sweat: t > P(1), tremble: lyHit * 0.8}} />
    <div style={{position: 'absolute', left: 585, top: 1180 + Math.sin(t * 6) * 8, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 110, color: INK, transform: 'rotate(14deg)'}}>?</div>
  </>;
};

// ---------- "Same gas." scene: one oil barrel pours into two identical gas cans ----------
const UsFlag = ({w = 170}: {w?: number}) => <svg width={w} height={w * 0.63} viewBox="0 0 190 120">
  <rect width={190} height={120} fill="#fff" />
  {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} y={i * 17.4} width={190} height={8.7} fill="#B22234" />)}
  <rect width={84} height={64} fill="#3C3B6E" />
  {Array.from({length: 12}, (_, i) => <circle key={i} cx={12 + (i % 4) * 20} cy={12 + Math.floor(i / 4) * 20} r={4} fill="#fff" />)}
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={6} />
</svg>;
const LyFlag = ({w = 170}: {w?: number}) => <svg width={w} height={w * 0.63} viewBox="0 0 190 120">
  <rect width={190} height={30} fill="#E70013" /><rect y={30} width={190} height={60} fill="#111" /><rect y={90} width={190} height={30} fill={GREEN} />
  <circle cx={88} cy={60} r={20} fill="#fff" /><circle cx={95} cy={60} r={16} fill="#111" />
  <path d="M112 50 L115 58 L124 58 L117 63 L120 71 L112 66 L104 71 L107 63 L100 58 L109 58 Z" fill="#fff" />
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={6} />
</svg>;
const Can = ({x, y, fill, t}: {x: number; y: number; fill: number; t: number}) => {
  const lvl = 150 - 120 * fill;
  return <svg width={260} height={300} viewBox="-10 0 160 170" style={{position: 'absolute', left: x - 130, top: y - 300, overflow: 'visible'}}>
    <defs><clipPath id={`can${x}`}><path d="M0 30 L90 30 L130 70 L130 160 L0 160 Z" /></clipPath></defs>
    <path d="M0 30 L90 30 L130 70 L130 160 L0 160 Z" fill="#E0463A" />
    <g clipPath={`url(#can${x})`}><path d={`M-10 ${lvl + Math.sin(t * 9) * 3} Q 35 ${lvl - 7} 70 ${lvl} T 150 ${lvl} L150 170 L-10 170 Z`} fill="#F2B705" opacity={0.9} /></g>
    <path d="M0 30 L90 30 L130 70 L130 160 L0 160 Z" fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <rect x={20} y={6} width={60} height={22} rx={8} fill="none" stroke={INK} strokeWidth={6} />
    <path d="M100 40 L120 10 L136 18" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
  </svg>;
};
const SameGas = ({t, at}: {t: number; at: number}) => {
  const d = t - at, fill = ease((d - 0.3) / 0.9), wave = Math.sin(t * 5) * 3;
  const pour = (x2: number) => <path d={`M540 ${560} Q ${(540 + x2) / 2} 520, ${x2} 900`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(d / 0.35)} fill="none" stroke="#F2B705" strokeWidth={18} strokeLinecap="round" />;
  return <>
    <Title lines={['SAME GAS']} y={210} at={at} size={150} />
    {/* oil barrel */}
    <div style={{position: 'absolute', left: 540 - 110, top: 330, width: 220, height: 260, background: '#2B2B2B', border: `7px solid ${INK}`, borderRadius: 22, boxSizing: 'border-box', transform: `rotate(${Math.sin(t * 3) * 2}deg)`}}>
      <div style={{marginTop: 70, height: 8, background: '#666'}} /><div style={{marginTop: 70, height: 8, background: '#666'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 92, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, color: '#fff'}}>OIL</div>
    </div>
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>{pour(260)}{pour(820)}</svg>
    {/* two identical cans, each with its flag waving */}
    <div style={{position: 'absolute', left: 175, top: 760, transform: `skewY(${wave}deg)`}}><UsFlag /></div>
    <div style={{position: 'absolute', left: 735, top: 760, transform: `skewY(${-wave}deg)`}}><LyFlag /></div>
    <Can x={260} y={1270} fill={fill} t={t} /><Can x={820} y={1270} fill={fill} t={t} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 840, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 200, color: INK, transform: `scale(${back((d - 0.5) / 0.3)})`}}>=</div>
    <div style={{position: 'absolute', left: 260 - 200, width: 400, top: 1290, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 90, color: RED}}>$5.00</div>
    <div style={{position: 'absolute', left: 820 - 200, width: 400, top: 1290, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 90, color: GREEN}}>$0.09</div>
    <div style={{position: 'absolute', left: -400, right: -400, top: 1400, height: 40, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
    <Penguin id="doug2" x={540} y={1400} h={330} pose={{brows: 'shock', eyeScale: 1.2, flapL: 110 + Math.sin(t * 10) * 10, flapR: 110 - Math.sin(t * 10) * 10}} />
  </>;
};

export const DougLibyaHook = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS, same = tc >= P(2);
  const toL = ease((tc - 0.9) / 0.5) * (tc < P(1) ? 1 : 0), toR = ease((tc - P(1)) / 0.4) * (same ? 0 : 1);
  const s = (same ? 1 + 0.02 * (tc - P(2)) : 1 + 0.1 * (toL + toR)) * (tc < 0.9 ? 1 : beat(tc, TIM)), fx = same ? 540 : 540 - 150 * toL + 150 * toR, fy = same ? 960 : 900;
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, [{at: 0}, {at: P(2), fx: 'zoom'}])}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{same ? <div style={{position: 'absolute', inset: 0, transform: 'translateY(140px)'}}><SameGas t={t} at={P(2)} /></div> : <Versus t={t} />}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} y={same ? 1560 : 1105} size={72} />
    <Audio src={staticFile('doug-libya-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.1} name="user-whoosh" vol={0.25} />
    <Sfx at={P(0) + 1.2} name="user-cash-register" vol={0.3} />
    <Sfx at={P(1) + 0.3} name="user-boom" vol={0.45} />
    <Sfx at={P(2) - 0.05} name="user-whoosh" vol={0.3} />
    <Sfx at={P(2) + 0.5} name="user-ting" vol={0.35} />
  </AbsoluteFill>;
};
