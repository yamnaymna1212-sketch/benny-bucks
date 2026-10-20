// EP4 "Same Salary" — Doug vs his brother Ricky, same $70,000 salary, one stays poor, one becomes a millionaire.
// Hook layout = the user's reference (cash stack + salary above each character, names below). Hook first (approval).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Fonts, HAND, HandFont} from '../base';
import {INK, Penguin} from '../penguin/rig';

const GREEN = '#2E9E4F';

// Banded stack of green bills with three "shine" ticks above it.
const CashStack = ({x, y, w = 300}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={w * 0.75} viewBox="0 0 300 225" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.75, overflow: 'visible'}}>
    <path d="M150 20 L150 60 M95 40 L110 68 M205 40 L190 68" stroke={INK} strokeWidth={9} strokeLinecap="round" />
    {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(0 ${190 - i * 26})`}>
      <path d="M30 0 L250 0 L280 -22 L60 -22 Z" fill={i === 3 ? '#8FD18F' : '#5DAE5D'} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M30 0 L250 0 L250 22 L30 22 Z M250 0 L280 -22 L280 0 L250 22 Z" fill="#3F8F46" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    </g>)}
    <path d="M130 112 L170 112 L170 212 L130 212 Z M170 112 L184 102 L184 196 L170 212" fill="#E8D3A8" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <ellipse cx={155} cy={101} rx={40} ry={8} fill="#2F7A36" opacity={0.6} />
  </svg>;

// Yellow baseball cap (Ricky's signature), brim to the viewer's left; (x, y) = bottom-centre of the crown.
const YellowCap = ({x, y, w = 250}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={w * 0.6} viewBox="0 0 250 150" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.48, overflow: 'visible'}}>
    <path d="M40 120 Q 40 20 135 18 Q 225 20 225 120 Z" fill="#F7C531" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M132 20 Q 120 70 128 120" fill="none" stroke={INK} strokeWidth={4} />
    <path d="M48 112 Q 0 112 -30 132 Q 20 146 60 132 Z" fill="#E0A912" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M40 120 L225 120" stroke={INK} strokeWidth={6} />
    <circle cx={134} cy={18} r={9} fill="#E0A912" stroke={INK} strokeWidth={4} />
  </svg>;

const Salary = ({x, y}: {x: number; y: number}) => <>
  <CashStack x={x} y={y - 110} />
  <div style={{position: 'absolute', left: x - 260, width: 520, top: y - 100, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: 92, color: INK, letterSpacing: -2}}>$70,000</div>
</>;

const Name = ({x, y, text}: {x: number; y: number; text: string}) =>
  <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color: INK}}>{text}</div>;

export const DougSalaryHook = () => {
  const L = 290, R = 790;
  return <AbsoluteFill style={{background: '#fff'}}>
    <Fonts /><HandFont />
    <Salary x={L} y={660} />
    <Salary x={R} y={660} />
    <Penguin x={L} y={1290} h={560} id="doug" pose={{turn: 0.35, look: [0.3, 0]}} />
    <Penguin x={R} y={1290} h={590} id="ricky" seed={0.7} build="thin" outfit="banker" pose={{turn: -0.35, look: [-0.3, 0], brows: "up", beak: "smile"}} />
    <YellowCap x={782} y={812} />
    <Name x={L} y={1320} text="Doug" />
    <Name x={R} y={1320} text="Ricky" />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1500, textAlign: 'center', fontFamily: HAND, fontSize: 66, color: INK, transform: 'rotate(-2deg)'}}>
      two penguins make same salary…
    </div>
  </AbsoluteFill>;
};
