// EP7 "Internet Explained by Doug" — USA $25 vs India ~$2 (same phone). Versus hook (still first), full episode after approval.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {HookTitle, Stamp} from '../penguin/world';
import {Arrow, G, GREEN, Label, Puzzled, RED, UsFlag, Vs, Why, cl, ease} from './dougVenezuela';

const InFlag = () => <g>
  <rect width={190} height={40} fill="#FF9933" /><rect y={40} width={190} height={40} fill="#fff" /><rect y={80} width={190} height={40} fill="#138808" />
  <circle cx={95} cy={60} r={14} fill="none" stroke="#1F4BA8" strokeWidth={4} />
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} />
</g>;

// Phone with flag, big "$x / MONTH" on the screen and a data bar that fills (fill 0..1).
const PhoneSign = ({x, y, price, flag, color, note, t, fill}: {x: number; y: number; price: string; flag: 'us' | 'in'; color: string; note: string; t: number; fill: number}) => {
  const wave = Math.sin(t * 5) * 3;
  return <svg width={420} height={760} viewBox="0 0 420 760" style={{position: 'absolute', left: x - 210, top: y - 760, overflow: 'visible'}}>
    <line x1={60} y1={40} x2={60} y2={200} stroke={INK} strokeWidth={8} />
    <circle cx={60} cy={36} r={10} fill={INK} />
    <g transform={`translate(64 ${50 + wave}) skewY(${wave})`}>{flag === 'us' ? <UsFlag /> : <InFlag />}</g>
    <rect x={70} y={230} width={280} height={510} rx={44} fill="#2B2F36" stroke={INK} strokeWidth={8} />
    <rect x={90} y={262} width={240} height={450} rx={22} fill="#fff" stroke={INK} strokeWidth={5} />
    <rect x={165} y={242} width={90} height={12} rx={6} fill={INK} />
    <text x={210} y={400} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={price.length > 3 ? 96 : 116} fill={color}>{price}</text>
    <text x={210} y={452} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={40} fill={INK}>/ MONTH</text>
    <text x={210} y={520} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={30} fill={INK}>DATA</text>
    <rect x={112} y={540} width={196} height={40} rx={20} fill="#E8EEF2" stroke={INK} strokeWidth={5} />
    <rect x={116} y={544} width={Math.max(0, 188 * fill)} height={32} rx={16} fill={GREEN} />
    <text x={210} y={650} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={30} fill={INK}>{note}</text>
  </svg>;
};

const SWING = 1.2, SAME = 2.0;
const Hook = ({t}: {t: number}) => {
  const lookR = t >= SWING;
  return <>
    <HookTitle lines={['Internet Explained', 'by Doug']} x={540} y={130} size={72} at={0.1} />
    <Why t={t} />
    <Label text="USA" x={210} y={622} at={0.3} t={t} />
    <Label text="INDIA" x={830} y={622} at={SWING} t={t} />
    <PhoneSign x={210} y={G + 120} price="$25" flag="us" color={RED} note="UNLIMITED" t={t} fill={ease((t - 0.4) / 1.4)} />
    <PhoneSign x={830} y={G + 120} price="~$2" flag="in" color={GREEN} note="189 RUPEES" t={t} fill={ease((t - SWING) / 1.0)} />
    <Arrow x={540} y={512} t={t} swingAt={SWING} />
    <Vs x={540} y={790} t={t} />
    <Puzzled x={392} y={830} t={t} />
    <Penguin id="doug" x={540} y={G + 60} h={470} pose={{turn: lookR ? 0.5 : -0.5, look: [lookR ? 0.8 : -0.8, -0.3], brows: lookR ? 'shock' : 'worried', eyeScale: lookR ? 1.25 : 1.05, pupil: lookR ? 0.5 : 1, beak: 'frown', flapR: 35, flapL: 35, sweat: lookR}} />
    <Stamp text="SAME PHONE" x={540} y={1480} at={SAME} color={RED} size={90} />
  </>;
};

export const DOUG_INTERNET_HOOK_SECONDS = 4;
export const DougInternetHook = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const toUS = ease((tc - 1.0) / 0.6) * (tc < SWING ? 1 : 0), toIN = ease((tc - SWING) / 0.5) * (tc < SAME ? 1 : 0);
  const s = 1 + 0.22 * (toUS + toIN), fx = 540 - 230 * toUS + 230 * toIN, fy = 960 + 40 * (toUS + toIN);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}><Hook t={t} /></AbsoluteFill>
  </AbsoluteFill>;
};
