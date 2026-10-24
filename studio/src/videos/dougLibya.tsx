// EP8 hook "Gas: America vs Libya" — built from the user's own image (941x1672), sliced into layers and animated.
// Prices are the user's: USA $5.00 vs LIBYA $0.09 per gallon (verify before the full episode).
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, back, onTwos} from '../penguin/rig';
import {Stamp} from '../penguin/world';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-libya.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const LIBYA_HOOK_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const RED = '#D83A2E', K = 1920 / 1672; // image px -> canvas px
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);

// A rectangular slice of the user's image; white background disappears (multiply on the white stage).
const Slice = ({x0, y0, x1, y1, dx = 0, dy = 0, rot = 0, scale = 1, wave, id}: {x0: number; y0: number; x1: number; y1: number; dx?: number; dy?: number; rot?: number; scale?: number; wave?: boolean; id?: string}) => {
  const w = (x1 - x0) * K, h = (y1 - y0) * K;
  return <div style={{position: 'absolute', left: x0 * K + dx, top: y0 * K + dy, width: w, height: h, overflow: 'hidden', mixBlendMode: 'multiply', transform: `rotate(${rot}deg) scale(${scale})`, transformOrigin: '50% 100%',
    filter: wave ? `url(#${id})` : undefined}}>
    <Img src={staticFile('gas/libya.png')} style={{position: 'absolute', left: -x0 * K, top: -y0 * K, width: 941 * K, height: 1672 * K, maxWidth: 'none'}} />
  </div>;
};
// Animated flag-wave filter (re-seeded every 3 frames).
const WaveFilter = ({id, amount, seed}: {id: string; amount: number; seed: number}) => <svg width={0} height={0} style={{position: 'absolute'}}>
  <filter id={id} x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={1} seed={seed} /><feDisplacementMap in="SourceGraphic" scale={amount} xChannelSelector="R" yChannelSelector="G" /></filter>
</svg>;

const Arrow = ({x, y, t, swingAt}: {x: number; y: number; t: number; swingAt: number}) => {
  const draw = ease((t - 0.25) / 0.4), sw = t < swingAt ? 0 : cl((t - swingAt) / 0.35);
  const over = sw < 1 ? Math.sin(sw * Math.PI) * 12 : 0, ang = 148 + (32 - 148) * ease(sw) - over;
  return <svg width={10} height={10} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <g transform={`rotate(${ang})`}>
      <path d="M0 0 Q 85 -34, 170 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />
      {draw > 0.9 && <path d="M170 0 L128 -26 M170 0 L130 30" fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />}
    </g>
  </svg>;
};
const SideLabel = ({text, x, y, at, t}: {text: string; x: number; y: number; at: number; t: number}) => {
  const p = back((t - at) / 0.3); if (t < at) return null;
  return <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color: INK, transform: `scale(${p})`}}>{text}</div>;
};

const Hook = ({t}: {t: number}) => {
  const f = Math.floor(t * 30), seedA = (f / 3 | 0) % 9 + 1, seedB = ((f / 3 | 0) + 4) % 9 + 1;
  const sway = (k: number) => Math.sin(t * 2.4 + k) * 1.3, bob = (k: number) => Math.sin(t * 3 + k) * 5;
  // price signs shake while their price is spoken
  const shake = (a: number, b: number) => t > a && t < b ? Math.sin(t * 50) * 6 : 0;
  const pulse = (a: number) => t > a && t < a + 0.5 ? 1 + 0.14 * Math.sin(((t - a) / 0.5) * Math.PI) : 1;
  const why = back(t / 0.3);
  return <>
    <WaveFilter id="waveA" amount={14} seed={seedA} /><WaveFilter id="waveB" amount={14} seed={seedB} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 40, height: 330, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 290, lineHeight: '300px', color: INK, letterSpacing: -6,
      transform: `scale(${0.6 + 0.4 * cl(why)})`, opacity: cl(why), transformOrigin: '50% 60%'}}>why<span style={{color: RED}}>?</span></div>
    <SideLabel text="USA" x={200} y={352} at={0.15} t={t} /><SideLabel text="LIBYA" x={850} y={352} at={0.3} t={t} />
    {/* busts + flags */}
    <Slice x0={0} y0={355} x1={385} y1={735} dy={bob(0)} rot={sway(0)} wave id="waveA" />
    <Slice x0={560} y0={355} x1={941} y1={735} dy={bob(2)} rot={sway(2)} wave id="waveB" />
    {/* price signs */}
    <Slice x0={15} y0={740} x1={385} y1={950} dx={shake(P(0) + 1.5, P(0) + 2.4)} scale={pulse(P(0) + 1.5)} />
    <Slice x0={555} y0={740} x1={925} y1={950} dx={shake(P(1), P(1) + 1.2)} scale={pulse(P(1) + 0.3)} />
    {/* pumps */}
    <Slice x0={10} y0={970} x1={345} y1={1405} rot={Math.sin(t * 5) * 0.6} />
    <Slice x0={595} y0={970} x1={925} y1={1405} rot={Math.sin(t * 5 + 1) * 0.6} />
    {/* middle: VS + Doug */}
    <div style={{position: 'absolute', left: 540 - 75, top: 950 - 75, width: 150, height: 150, borderRadius: '50%', background: RED, border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 72, color: '#fff', transform: `scale(${back((t - 0.5) / 0.3)}) rotate(${-8 + Math.sin(t * 4) * 3}deg)`}}>VS</div>
    <Penguin id="doug" x={540} y={1585} h={400} pose={{brows: 'worried', eyeScale: 1.1, look: [t < P(1) ? -0.5 : 0.5, 0], sweat: t > P(1)}} />
    <div style={{position: 'absolute', left: 585, top: 1180 + Math.sin(t * 6) * 8, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 110, color: INK, transform: 'rotate(14deg)'}}>?</div>
    <Arrow x={470} y={330} t={t} swingAt={P(1) - 0.1} />
    <Stamp text="SAME GAS" x={540} y={1190} at={P(2)} color={RED} size={90} rot={-8} />
  </>;
};

export const DougLibyaHook = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const toL = ease((tc - 1.0) / 0.6) * (tc < P(1) ? 1 : 0), toR = ease((tc - P(1)) / 0.5) * (tc < P(2) ? 1 : 0);
  const s = (1 + 0.1 * (toL + toR)) * (tc < 1.0 ? 1 : beat(tc, TIM)), fx = 540 - 150 * toL + 150 * toR, fy = 900;
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}><Hook t={t} /></AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-libya-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.15} name="user-whoosh" vol={0.25} />
    <Sfx at={P(0) + 1.5} name="user-cash-register" vol={0.3} />
    <Sfx at={P(1) + 0.5} name="user-boom" vol={0.45} />
    <Sfx at={P(2)} name="user-slap" vol={0.4} />
  </AbsoluteFill>;
};
