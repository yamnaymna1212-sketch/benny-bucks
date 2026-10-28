// EP7 "Internet Explained by Doug" — USA $25 vs India ~$2 (same phone). Versus hook (still first), full episode after approval.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {G, GREEN, Label, RED, UsFlag, Vs, Why, ease} from './dougVenezuela';

const InFlag = () => <g>
  <rect width={190} height={40} fill="#FF9933" /><rect y={40} width={190} height={40} fill="#fff" /><rect y={80} width={190} height={40} fill="#138808" />
  <circle cx={95} cy={60} r={14} fill="none" stroke="#1F4BA8" strokeWidth={4} />
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} />
</g>;

// Simple phone: just the GB amount (same on both sides). Price sits above it.
const GbPhone = ({x, y, color, gb, t}: {x: number; y: number; color: string; gb: string; t: number}) =>
  <svg width={320} height={500} viewBox="0 0 320 500" style={{position: 'absolute', left: x - 160, top: y - 500, overflow: 'visible', transform: `rotate(${Math.sin(t * 3) * 1.5}deg)`}}>
    <rect x={20} y={10} width={280} height={480} rx={46} fill={color} stroke={INK} strokeWidth={9} />
    <rect x={44} y={46} width={232} height={408} rx={24} fill="#fff" stroke={INK} strokeWidth={6} />
    <rect x={120} y={22} width={80} height={12} rx={6} fill={INK} />
    <text x={160} y={282} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={92} fill={INK}>{gb}</text>
  </svg>;
const Price = ({text, x, y, color, at, t}: {text: string; x: number; y: number; color: string; at: number; t: number}) => {
  const p = ease((t - at) / 0.3);
  return <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 180, lineHeight: "230px", color, WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke fill', opacity: p, transform: `scale(${0.5 + 0.5 * p})`}}>{text}</div>;
};
const MiniFlag = ({x, y, flag}: {x: number; y: number; flag: 'us' | 'in'}) =>
  <svg width={171} height={108} viewBox="0 0 190 120" style={{position: 'absolute', left: x - 85, top: y}}>{flag === 'us' ? <UsFlag /> : <InFlag />}</svg>;

const SWING = 1.2, SAME = 2.0;
const Hook = ({t}: {t: number}) => {
  const lookR = t >= SWING;
  return <>
    <div style={{position: "absolute", inset: 0, transform: "translateY(-150px)"}}><Why t={t} /></div>
    <Price text="$25" x={210} y={590} color={RED} at={0.3} t={t} />
    <Price text="~$2" x={830} y={590} color={GREEN} at={SWING} t={t} />
    <Vs x={540} y={700} t={t} />
    <Label text="USA" x={210} y={780} at={0.3} t={t} />
    <Label text="INDIA" x={830} y={780} at={SWING} t={t} />
    <MiniFlag x={210} y={870} flag="us" />
    <MiniFlag x={830} y={870} flag="in" />
    <GbPhone x={210} y={1480} color="#E8443A" gb="2GB" t={t} />
    <GbPhone x={830} y={1480} color="#2E9E4F" gb="2GB" t={t} />
    <Penguin id="doug" x={540} y={G + 150} h={440} pose={{turn: lookR ? 0.5 : -0.5, look: [lookR ? 0.8 : -0.8, -0.3], brows: lookR ? 'shock' : 'worried', eyeScale: lookR ? 1.25 : 1.05, pupil: lookR ? 0.5 : 1, beak: 'frown', flapR: 35, flapL: 35, sweat: lookR}} />
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
