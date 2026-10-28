// EP7 "Internet Explained by Doug" — USA $25 vs India ~$2 (same phone). Versus hook (still first), full episode after approval.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {G, GREEN, RED, UsFlag, Vs, Why, ease} from './dougVenezuela';

const InFlag = () => <g>
  <rect width={190} height={40} fill="#FF9933" /><rect y={40} width={190} height={40} fill="#fff" /><rect y={80} width={190} height={40} fill="#138808" />
  <circle cx={95} cy={60} r={14} fill="none" stroke="#1F4BA8" strokeWidth={4} />
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} />
</g>;

// Simple phone: just the GB amount (same on both sides).
const GbPhone = ({x, y, color, gb, t}: {x: number; y: number; color: string; gb: string; t: number}) =>
  <svg width={360} height={540} viewBox="0 0 360 540" style={{position: 'absolute', left: x - 180, top: y - 540, overflow: 'visible', transform: `rotate(${Math.sin(t * 3) * 1.5}deg)`}}>
    <rect x={10} y={10} width={340} height={520} rx={52} fill={color} stroke={INK} strokeWidth={10} />
    <rect x={38} y={50} width={284} height={440} rx={26} fill="#fff" stroke={INK} strokeWidth={6} />
    <rect x={140} y={22} width={80} height={14} rx={7} fill={INK} />
    <text x={180} y={310} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={118} fill={INK}>{gb}</text>
  </svg>;
// Price tag: solid colour card, white numbers (readable at a glance).
const Price = ({text, x, y, color, at, t, tilt}: {text: string; x: number; y: number; color: string; at: number; t: number; tilt: number}) => {
  const p = ease((t - at) / 0.3);
  return <div style={{position: 'absolute', left: x - 200, width: 400, top: y, height: 200, borderRadius: 34, background: color, border: `9px solid ${INK}`, boxShadow: `0 12px 0 ${INK}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 160, color: '#fff', letterSpacing: -4,
    opacity: p, transform: `scale(${0.5 + 0.5 * p}) rotate(${tilt}deg)`}}>{text}</div>;
};
const BigFlag = ({x, y, flag}: {x: number; y: number; flag: 'us' | 'in'}) =>
  <svg width={266} height={168} viewBox="0 0 190 120" style={{position: 'absolute', left: x - 133, top: y}}>{flag === 'us' ? <UsFlag /> : <InFlag />}</svg>;
const Name = ({text, x, y}: {text: string; x: number; y: number}) =>
  <div style={{position: 'absolute', left: x - 250, width: 500, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color: INK}}>{text}</div>;

const SWING = 1.2;
const Hook = ({t}: {t: number}) => {
  const lookR = t >= SWING;
  return <>
    <div style={{position: 'absolute', inset: 0, transform: 'translateY(-170px) scale(0.92)', transformOrigin: '50% 0'}}><Why t={t} /></div>
    <BigFlag x={260} y={410} flag="us" />
    <BigFlag x={820} y={410} flag="in" />
    <Name text="USA" x={260} y={585} />
    <Name text="INDIA" x={820} y={585} />
    <Price text="$25" x={260} y={705} color={RED} at={0.3} t={t} tilt={-3} />
    <Price text="$2" x={820} y={705} color={GREEN} at={SWING} t={t} tilt={3} />
    <Vs x={540} y={805} t={t} />
    <GbPhone x={250} y={1480} color="#E8443A" gb="2GB" t={t} />
    <GbPhone x={830} y={1480} color="#2E9E4F" gb="2GB" t={t} />
    <Penguin id="doug" x={540} y={G + 170} h={430} pose={{turn: lookR ? 0.5 : -0.5, look: [lookR ? 0.8 : -0.8, -0.3], brows: lookR ? 'shock' : 'worried', eyeScale: lookR ? 1.25 : 1.05, pupil: lookR ? 0.5 : 1, beak: 'frown', flapR: 35, flapL: 35, sweat: lookR}} />
  </>;
};

export const DOUG_INTERNET_HOOK_SECONDS = 4;
export const DougInternetHook = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const toUS = ease((tc - 1.0) / 0.6) * (tc < SWING ? 1 : 0), toIN = ease((tc - SWING) / 0.5) * (tc < 2.0 ? 1 : 0);
  const s = 1 + 0.22 * (toUS + toIN), fx = 540 - 230 * toUS + 230 * toIN, fy = 960 + 40 * (toUS + toIN);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}><Hook t={t} /></AbsoluteFill>
  </AbsoluteFill>;
};
