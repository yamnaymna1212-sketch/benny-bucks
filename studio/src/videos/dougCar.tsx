// EP7 "How Poor vs Rich Doug buy a car" — POOR $250,000 flying sports car vs RICH $5,000 used sedan.
// Hook first (approval), full episode after. Hook = 5 s (HOOK_SECONDS). Generic cars, no brand logos.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, back, onTwos} from '../penguin/rig';
import {Sfx} from '../penguin/edit';

export const HOOK_SECONDS = 5;
const RED = '#D83A2E', GREEN = '#2E9E4F';
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const ROAD = 1230; // top of the road

// ---------- props ----------
// Real car photos (cut out of the user's image): Tesla hovers on jets, sedan rolls in.
export const TeslaPhoto = ({x, y, w = 470, t, fly}: {x: number; y: number; w?: number; t: number; fly: number}) => {
  const h = w * 249 / 414, flame = 0.8 + 0.2 * Math.sin(t * 40);
  return <div style={{position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h}}>
    {fly > 0.02 && [0.27, 0.73].map((k) => <svg key={k} width={90} height={260} viewBox="0 0 90 260" style={{position: 'absolute', left: w * k - 45, top: h * 0.86, overflow: 'visible', opacity: fly}}>
      <path d={`M10 0 L45 ${240 * flame} L80 0 Z`} fill="#8FD3FF" opacity={0.9} /><path d={`M28 0 L45 ${140 * flame} L62 0 Z`} fill="#fff" />
    </svg>)}
    <Img src={staticFile('car/tesla.png')} style={{position: 'absolute', left: 0, top: 0, width: w, height: h}} />
  </div>;
};
export const SedanPhoto = ({x, y, w = 450}: {x: number; y: number; w?: number}) =>
  <Img src={staticFile('car/sedan.png')} style={{position: 'absolute', left: x - w / 2, top: y - w * 244 / 438, width: w, height: w * 244 / 438}} />;

export const Smoke = ({x, y, t, at}: {x: number; y: number; t: number; at: number}) => <>
  {Array.from({length: 9}, (_, i) => { const ph = ((t - at) * 1.6 + i / 9) % 1, side = i % 2 ? 1 : -1, r = 40 + ph * 70;
    return <div key={i} style={{position: 'absolute', left: x + side * (70 + ph * 80) - r, top: y - ph * 40 - r, width: r * 2, height: r * 2, borderRadius: '50%', background: '#fff', border: `4px solid #D9E2E8`, boxSizing: 'border-box', opacity: (1 - ph) * 0.9}} />; })}
</>;

export const Bill = ({x, y, rot = 0, w = 110}: {x: number; y: number; rot?: number; w?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.22, width: w, height: w * 0.44, background: '#8FD18F', border: `4px solid ${INK}`, borderRadius: 6, boxSizing: 'border-box', transform: `rotate(${rot}deg)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.3, color: '#1E5A2A'}}>$</div>;

const Label = ({text, x, y, color, at, t}: {text: string; x: number; y: number; color: string; at: number; t: number}) => {
  const p = back((t - at) / 0.35); if (t < at) return null;
  return <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', transform: `scale(${p}) rotate(-3deg)`}}>
    <span style={{display: 'inline-block', padding: '4px 36px', background: color, border: `7px solid ${INK}`, borderRadius: 18, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 112, color: '#fff', letterSpacing: -2}}>{text}</span>
  </div>;
};
const Price = ({text, x, y, color, at, t}: {text: string; x: number; y: number; color: string; at: number; t: number}) => {
  const p = back((t - at) / 0.35); if (t < at) return null;
  return <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', transform: `scale(${p})`}}>
    <span style={{display: 'inline-block', padding: '0 22px', background: INK, border: `6px solid ${INK}`, borderRadius: 22, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 86, lineHeight: '124px', whiteSpace: 'nowrap', color}}>{text}</span>
  </div>;
};

// ---------- hook ----------
export const Hook = ({t}: {t: number}) => {
  const tt = back(t / 0.35);
  // POOR car: lifts off at 0.5 s, then hovers and bobs; Doug's cash flies out toward it.
  const lift = ease((t - 0.8) / 0.9), carY = lerp(ROAD + 30, 1060, lift) + Math.sin(t * 5) * 10 * lift, carX = 270 + Math.sin(t * 3) * 8 * lift;
  // RICH sedan: rolls in from the right edge and parks calmly.
  const roll = ease((t - 0.2) / 1.0), sedX = lerp(980, 810, roll), sedY = ROAD + 40 + Math.sin(t * 22) * (1 - roll) * 2;
  const dashOff = (t * 420) % 120;
  const cash = Array.from({length: 30}, (_, i) => 1.2 + i * 0.25);
  return <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 40, height: 330, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 300, lineHeight: '320px', color: INK, letterSpacing: -6,
      transform: `scale(${0.6 + 0.4 * tt})`, opacity: cl(tt), transformOrigin: '50% 60%'}}>how<span style={{color: RED}}>?</span></div>
    {/* road + divider */}
    <div style={{position: 'absolute', left: 0, right: 0, top: ROAD, height: 1920 - ROAD, background: '#9AA1A8', borderTop: `6px solid ${INK}`}} />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <div key={i} style={{position: 'absolute', left: ((i * 120 - dashOff) % 1200 + 1200) % 1200 - 100, top: ROAD + 470, width: 70, height: 12, background: '#fff', borderRadius: 4}} />)}
    <div style={{position: 'absolute', left: 536, top: 400, width: 8, height: 1520, background: INK, borderRadius: 4}} />
    <Label text="POOR" x={270} y={400} color={RED} at={0.02} t={t} />
    <Label text="RICH" x={810} y={400} color={GREEN} at={0.08} t={t} />
    <Price text="$250,000" x={270} y={590} color="#fff" at={0.12} t={t} />
    <Price text="$5,000" x={810} y={590} color="#6BE08A" at={0.18} t={t} />
    {/* POOR side */}
    {lift > 0.02 && <Smoke x={carX} y={ROAD + 60} t={t} at={0.8} />}
    <TeslaPhoto x={carX} y={carY} t={t} fly={lift} />
    <Penguin id="dougL" x={270} y={1800} h={400} pose={{turn: 0.2, look: [0.3, -0.9], brows: 'shock', eyeScale: 1.25, sweat: true, tremble: 0.5, flapR: 70 + Math.sin(t * 14) * 16, flapL: 20}} />
    <Bill x={470} y={1640} rot={-20} w={120} />
    {cash.map((a, i) => { const p = (t - a) / 0.55; if (p < 0 || p > 1) return null;
      return <Bill key={i} x={lerp(470, carX, ease(p))} y={lerp(1640, carY - 70, ease(p)) - Math.sin(p * Math.PI) * 120} rot={lerp(-20, 260, p)} w={110 * (1 - 0.3 * p)} />; })}
    {/* RICH side */}
    <SedanPhoto x={sedX} y={sedY} />
    <Penguin id="dougR" x={810} y={1800} h={400} outfit="rich" pose={{beak: 'smile', lids: 0.45, brows: 'none', flapL: 8, flapR: 8, look: [-0.2, 0]}} />
  </>;
};

export const DougCarHook = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  // push toward the poor side (named first), then swing to the rich side.
  const toL = ease((tc - 1.6) / 0.6) * (tc < 3.2 ? 1 : 0), toR = ease((tc - 3.2) / 0.6);
  const s = 1 + 0.07 * (toL + toR), fx = 540 - 70 * toL + 70 * toR, fy = 960;
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}><Hook t={t} /></AbsoluteFill>
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.1} name="user-cash-register" vol={0.3} />
    <Sfx at={0.8} name="user-whoosh" vol={0.35} />
    <Sfx at={1.0} name="user-boom" vol={0.35} />
    <Sfx at={3.2} name="user-whoosh" vol={0.25} />
  </AbsoluteFill>;
};
