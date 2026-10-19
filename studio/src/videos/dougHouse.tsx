// EP6 "How Poor vs Rich Buy a House" — hook first (approval), full episode after. Temp timings in studio/src/data/doug-house.json until the hook line is approved + VO arrives.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {Fish, INK, Penguin, onTwos} from '../penguin/rig';
import {FishPile} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-house.json';

const P = (i: number) => TIM[i].start;
export const DOUG_HOUSE_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1460;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';

// Plain American suburban house (siding, gable roof, chimney, porch door, two windows).
const House = ({x, y, w = 440}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={w * 0.95} viewBox="0 0 440 418" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.95, overflow: 'visible'}}>
    <rect x={300} y={40} width={44} height={90} fill="#B5543C" stroke={INK} strokeWidth={5} />
    <path d="M20 200 L220 40 L420 200 Z" fill="#6E7C8A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <rect x={50} y={198} width={340} height={210} fill="#F3E6C8" stroke={INK} strokeWidth={6} />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M52 ${236 + i * 36} L388 ${236 + i * 36}`} stroke="#D9C9A4" strokeWidth={4} />)}
    <rect x={185} y={290} width={70} height={118} fill="#B23A2E" stroke={INK} strokeWidth={5} /><circle cx={242} cy={352} r={5} fill={INK} />
    {[85, 285].map((wx) => <g key={wx}><rect x={wx} y={240} width={72} height={66} fill="#BFE0F0" stroke={INK} strokeWidth={5} /><path d={`M${wx + 36} 240 L${wx + 36} 306 M${wx} 273 L${wx + 72} 273`} stroke={INK} strokeWidth={4} /></g>)}
    <rect x={30} y={404} width={380} height={12} fill="#9AA5AE" stroke={INK} strokeWidth={4} />
    <g transform="translate(108 -40)"><line x1={0} y1={0} x2={0} y2={170} stroke={INK} strokeWidth={6} />
      <rect width={96} height={60} fill="#fff" stroke={INK} strokeWidth={4} />{[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} y={i * 8.6} width={96} height={4.3} fill="#B22234" />)}
      <rect width={42} height={32} fill="#3C3B6E" />{[0, 1, 2].map((i) => <circle key={i} cx={9 + i * 12} cy={10 + (i % 2) * 10} r={2.6} fill="#fff" />)}
      <rect width={96} height={60} fill="none" stroke={INK} strokeWidth={4} /></g>
  </svg>;

const Label = ({text, x, color}: {text: string; x: number; color: string}) =>
  <div style={{position: 'absolute', left: x, top: 620, transform: 'translate(-50%,-50%)', textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 92, color, lineHeight: 1}}>
    {text}<div style={{height: 9, background: color, borderRadius: 5, marginTop: 6, transform: 'rotate(-2deg)'}} /></div>;

// Hook title: same hand font as the POOR / RICH labels, in blue (user).
const ClearTitle = ({lines, y, size}: {lines: string[]; y: number; size: number}) =>
  <div style={{position: 'absolute', left: 540, top: y, transform: 'translate(-50%,-50%)', textAlign: 'center'}}>
    {lines.map((l, i) => <div key={i} style={{fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: size, lineHeight: 1.15, whiteSpace: 'nowrap', color: '#1A7FE0'}}>{l}</div>)}
  </div>;

const RICHT = P(1);
// User hook (2026-10-19): poor penguin vs rich penguin, POOR / RICH labels, an American house behind each, NO prices.
const Hook = ({t}: {t: number}) => {
  const onRich = t >= RICHT;
  return <>
    <ClearTitle lines={['How Poor vs Rich', 'Penguins Buy a House']} y={240} size={88} />
    <div style={{position: 'absolute', left: 536, top: 520, width: 8, height: 1000, background: INK, borderRadius: 4}} />
    <Label text="POOR" x={270} color={RED} />
    <Label text="RICH" x={810} color={GREEN} />
    <House x={270} y={1260} w={500} />
    <House x={810} y={1260} w={500} />
    <Penguin id="doug" x={270} y={G} h={390} build="thin" pose={{turn: onRich ? 0.5 : 0, look: [onRich ? 0.9 : 0, -0.2], brows: onRich ? 'shock' : 'worried', eyeScale: onRich ? 1.2 : 1, pupil: onRich ? 0.5 : 1, sweat: true, beak: 'frown'}} />
    <Penguin id="rich" x={745} y={G} h={400} build="fat" outfit="rich" pose={{turn: -0.2, lids: 0.45, beak: 'smile', brows: 'happy'}} />
    <Fish id="onefish" x={385} y={1300} w={120} rot={-20} />
    <FishPile x={935} y={G} n={15} w={95} />
  </>;
};

const SHOTS: {at: number; set: (t: number) => React.ReactNode; fx_?: Fx}[] = [{at: 0, set: (t) => <Hook t={t} />}];

export const DougHouse = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  // hook: push toward the side named (Doug's $1M house, then Larry's), release on "Same house."
  const toL = ease((tc - 0.2) / 0.6) * (tc < RICHT ? 1 : 0), toR = ease((tc - RICHT) / 0.5) * (tc < P(2) ? 1 : 0);
  const s = (1 + 0.08 * (toL + toR)) * beat(tc, TIM), fx = 540 - 150 * toL + 150 * toR, fy = 960 + 30 * (toL + toR);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.3} name="user-aww" vol={0.3} />
    <Sfx at={RICHT - 0.05} name="user-whoosh" vol={0.22} />
    <Sfx at={RICHT + 0.2} name="user-wow" vol={0.3} />
  </AbsoluteFill>;
};
