// EP6 "How Poor vs Rich Buy a House" — hook first (approval), full episode after. Line timings: studio/src/data/doug-house.json (temp until the user's VO).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Walrus} from '../penguin/cast';
import {HookTitle, PriceTag, Stamp} from '../penguin/world';
import {cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-house.json';

const P = (i: number) => TIM[i].start;
export const DOUG_HOUSE_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1420;
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
  </svg>;

const Label = ({text, x, color}: {text: string; x: number; color: string}) =>
  <div style={{position: 'absolute', left: x, top: 560, transform: 'translate(-50%,-50%)', textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 92, color, lineHeight: 1}}>
    {text}<div style={{height: 9, background: color, borderRadius: 5, marginTop: 6, transform: 'rotate(-2deg)'}} /></div>;

const LARRY = P(1), SAME = P(2);
const Hook = ({t}: {t: number}) => {
  const onLarry = t >= LARRY, same = t >= SAME;
  return <>
    <HookTitle lines={['How Poor vs Rich', 'Buy a House']} at={-1} y={240} size={86} />
    <Label text="POOR" x={270} color={RED} />
    <Label text="RICH" x={810} color={GREEN} />
    <House x={270} y={1130} />
    <House x={810} y={1130} />
    <PriceTag x={270} y={800} price="$1,000,000" at={0.35} rot={-6} size={0.74} />
    <PriceTag x={810} y={800} price="$420,000" at={LARRY + 0.9} rot={5} size={0.74} color={GREEN} />
    <Penguin id="doug" x={250} y={G} h={360} pose={{turn: onLarry ? 0.6 : 0.2, look: [onLarry ? 0.9 : 0, -0.4], brows: onLarry ? 'shock' : 'worried', eyeScale: onLarry ? 1.25 : 1, pupil: onLarry ? 0.45 : 1, sweat: true, flapL: onLarry ? 90 : 10, flapR: onLarry ? 90 : 10, beak: 'frown'}} />
    <Walrus x={840} y={G} h={400} pose={{lids: 0.45, laugh: onLarry && !same ? 1 : 0, look: -0.5}} />
    <Stamp text="SAME HOUSE" x={540} y={425} at={SAME} color={RED} size={70} rot={-4} />
  </>;
};

const SHOTS: {at: number; set: (t: number) => React.ReactNode; fx_?: string}[] = [{at: 0, set: (t) => <Hook t={t} />}];

export const DougHouse = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  // hook: push toward the side named (Doug's $1M house, then Larry's), release on "Same house."
  const toL = ease((tc - 0.2) / 0.6) * (tc < LARRY ? 1 : 0), toR = ease((tc - LARRY) / 0.5) * (tc < SAME ? 1 : 0);
  const s = (1 + 0.08 * (toL + toR)) * beat(tc, TIM), fx = 540 - 150 * toL + 150 * toR, fy = 960 + 30 * (toL + toR);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.35} name="user-cash-register" vol={0.35} />
    <Sfx at={1.1} name="user-boom" vol={0.45} />
    <Sfx at={LARRY - 0.05} name="user-whoosh" vol={0.22} />
    <Sfx at={LARRY + 0.3} name="walrus-laugh" vol={0.4} />
    <Sfx at={LARRY + 0.9} name="user-money" vol={0.35} />
    <Sfx at={SAME} name="user-slap" vol={0.4} />
    <Sfx at={SAME + 0.2} name="user-shock" vol={0.3} />
  </AbsoluteFill>;
};
