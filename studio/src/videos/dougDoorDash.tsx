// EP5 idea "Same burger: $4 cooked at home vs $27 on DoorDash" — WhyHook main template with labels instead of flags.
import React from 'react';
import {WhyHook} from '../penguin/whyHook';
import {INK} from '../penguin/rig';

const Burger = ({w = 230}: {w?: number}) =>
  <svg width={w} height={w * 0.8} viewBox="0 0 230 184" style={{overflow: 'visible'}}>
    <path d="M20 80 Q20 10 115 10 Q210 10 210 80 Z" fill="#E3A857" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {[60, 100, 140, 175].map((x, i) => <ellipse key={x} cx={x} cy={38 + (i % 2) * 14} rx={7} ry={4} fill="#FFF3D6" />)}
    <path d="M12 92 Q40 80 70 94 Q100 80 130 94 Q160 80 190 94 Q205 86 218 92 L214 104 L16 104 Z" fill="#6DBE45" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <rect x={14} y={104} width={202} height={32} rx={14} fill="#7A4A2A" stroke={INK} strokeWidth={6} />
    <path d="M20 136 L210 136 L196 168 Q115 184 34 168 Z" fill="#E3A857" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
  </svg>;
const Bag = ({w = 220}: {w?: number}) =>
  <svg width={w} height={w * 1.05} viewBox="0 0 220 230" style={{overflow: 'visible'}}>
    <path d="M30 60 L190 60 L176 222 L44 222 Z" fill="#E8432E" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M70 60 Q70 14 110 14 Q150 14 150 60" fill="none" stroke={INK} strokeWidth={9} />
    <text x={110} y={150} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={27} fill="#fff">DELIVERY</text>
  </svg>;

export const DougDoorDashHook = () => <WhyHook
  left={{label: 'HOME', price: '$4', unit: 'SAME BURGER', obj: <Burger />}}
  right={{label: 'DOORDASH', price: '$27', unit: 'SAME BURGER', obj: <Bag />}} />;
