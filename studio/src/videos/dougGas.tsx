// EP2 "Gas Explained by Doug" — hook first (approval), full episode after. Line timings: studio/src/data/doug-gas.json.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts} from '../engine';
import {HandFont} from '../sketch';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {HookTitle, Stamp} from '../penguin/world';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-gas.json';

const P = (i: number) => TIM[i].start;
export const DOUG_GAS_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 1) * 30) / 30;
const G = 1250;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);

// Classic tall US gas-station price sign: state name on top, red LED digits with the small 9/10.
export const GasSign = ({x, y, state, price, at = -1, t, glow}: {x: number; y: number; state: string; price: string; at?: number; t: number; glow?: boolean}) => {
  const p = t < at ? 0 : Math.min(1, (t - at) / 0.25);
  const flick = glow ? 0.75 + 0.25 * Math.abs(Math.sin(t * 9)) : 1;
  return <div style={{position: 'absolute', left: x - 170, top: y - 520, width: 340, transform: `scale(${0.6 + 0.4 * p})`, opacity: p, transformOrigin: '50% 100%'}}>
    <svg width={340} height={520} viewBox="0 0 340 520" style={{overflow: 'visible'}}>
      <rect x={155} y={300} width={30} height={220} fill="#8A9399" stroke={INK} strokeWidth={5} />
      <rect x={10} y={10} width={320} height={300} rx={18} fill="#F7F3E8" stroke={INK} strokeWidth={6} />
      <rect x={10} y={10} width={320} height={70} rx={18} fill="#2F5DA8" stroke={INK} strokeWidth={6} />
      <text x={170} y={58} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={40} fill="#fff">{state}</text>
      <text x={170} y={120} textAnchor="middle" fontFamily="Architects Daughter" fontSize={34} fill={INK} fontWeight={700}>REGULAR</text>
      <rect x={30} y={140} width={280} height={150} rx={10} fill="#1B1B1B" stroke={INK} strokeWidth={5} />
      <text x={150} y={242} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={76} fill="#FF3B2F" opacity={flick} style={{letterSpacing: 2}}>{price}</text>
      <text x={286} y={196} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#FF3B2F" opacity={flick}>9</text>
      <path d="M272 202 L300 202" stroke="#FF3B2F" strokeWidth={3} opacity={flick} />
      <text x={286} y={232} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={26} fill="#FF3B2F" opacity={flick}>10</text>
    </svg>
  </div>;
};

// Gas pump with a counter that spins while `run`.
const Pump = ({x, y, t, run, dollars}: {x: number; y: number; t: number; run: boolean; dollars: number}) =>
  <svg width={200} height={330} viewBox="0 0 200 330" style={{position: 'absolute', left: x - 100, top: y - 330, overflow: 'visible'}}>
    <rect x={20} y={20} width={140} height={300} rx={14} fill="#D83A2E" stroke={INK} strokeWidth={6} />
    <rect x={38} y={44} width={104} height={70} rx={6} fill="#E8F7E4" stroke={INK} strokeWidth={4} />
    <text x={90} y={92} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill={INK}>${(run ? dollars + ((t * 37) % 10) / 10 : dollars).toFixed(2)}</text>
    <rect x={50} y={140} width={80} height={40} rx={6} fill="#fff" stroke={INK} strokeWidth={4} />
    <path d="M160 120 C 200 140, 196 240, 170 260" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
    <rect x={10} y={310} width={160} height={16} fill="#8A9399" stroke={INK} strokeWidth={4} />
  </svg>;

const Hook = ({t}: {t: number}) => {
  const lookR = t >= P(1);
  return <>
    <HookTitle lines={['Gas Explained', 'by Doug']} at={-1} y={360} />
    <GasSign x={210} y={1180} state="TEXAS" price="$3.82" t={t} />
    <GasSign x={870} y={1180} state="CALIF." price="$6.23" t={t} glow={lookR} />
    <Pump x={680} y={G} t={t} run={t > P(1)} dollars={lookR ? 93 : 57} />
    <Penguin id="doug" x={450} y={G} h={430} pose={{turn: lookR ? 0.6 : -0.6, look: [lookR ? 0.8 : -0.8, -0.3], brows: lookR ? 'shock' : 'worried', eyeScale: lookR ? 1.2 : 1, pupil: lookR ? 0.5 : 1, sweat: true, flapL: lookR ? 90 : 10, flapR: lookR ? 90 : 10}} />
    <Stamp text="SAME GAS" x={540} y={760} at={P(2)} color="#D83A2E" size={96} />
  </>;
};

export const DougGas = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  // hook camera: push toward Texas on line 0, toward California on line 1 (zoom follows the side named)
  const toTX = ease((tc - 0.2) / 0.6) * (tc < P(1) ? 1 : 0), toCA = ease((tc - P(1)) / 0.5) * (tc < P(2) ? 1 : 0);
  const s = (1 + 0.06 * (toTX + toCA)) * beat(tc, TIM);
  const fx = 540 - 140 * toTX + 140 * toCA, fy = 960 + 40 * (toTX + toCA);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>
      <Hook t={t} />
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-gas-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={P(0) + 1.4} name="user-cash-register" vol={0.3} />
    <Sfx at={P(1) + 1.9} name="user-boom" vol={0.45} />
    <Sfx at={P(2)} name="user-slap" vol={0.4} />
    <Sfx at={P(2) + 0.4} name="penguin-squawk" vol={0.35} />
  </AbsoluteFill>;
};
