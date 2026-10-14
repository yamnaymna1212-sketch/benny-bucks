// Flat cut-paper props for the ambulance video (collage pieces get keylines from <Piece>).
import React from 'react';
import {C, FONT} from '../engine';

const V = ({w, h, vb, children}: {w: number; h: number; vb: string; children: React.ReactNode}) =>
  <svg width={w} height={h} viewBox={vb} style={{display: 'block', overflow: 'visible'}}>{children}</svg>;
const T = ({x, y, s, fill = C.ink, children, w = 900}: {x: number; y: number; s: number; fill?: string; children: React.ReactNode; w?: number}) =>
  <text x={x} y={y} fontFamily={FONT} fontWeight={w} fontSize={s} fill={fill} textAnchor="middle" dominantBaseline="central">{children}</text>;

export const Ambulance = ({w = 460, stripe = '#D83A2E'}: {w?: number; stripe?: string}) => <V w={w} h={w * 0.56} vb="0 0 460 258">
  <rect x="10" y="40" width="300" height="170" rx="10" fill="#FDFDFB" /><path d="M310 90 L400 90 L450 150 L450 210 L310 210 Z" fill="#FDFDFB" />
  <path d="M325 102 L392 102 L428 148 L325 148 Z" fill="#BFE3F5" /><rect x="10" y="150" width="440" height="22" fill={stripe} />
  <rect x="120" y="70" width="24" height="70" fill={stripe} /><rect x="97" y="93" width="70" height="24" fill={stripe} />
  <rect x="40" y="22" width="60" height="20" rx="6" fill="#E84A3A" /><rect x="100" y="22" width="60" height="20" rx="6" fill="#3A7BE8" />
  <circle cx="90" cy="215" r="34" fill={C.ink} /><circle cx="90" cy="215" r="13" fill="#C9C9C9" /><circle cx="370" cy="215" r="34" fill={C.ink} /><circle cx="370" cy="215" r="13" fill="#C9C9C9" />
</V>;

export const LongBill = ({w = 300, lines = ['ALS RIDE', '$1,277', '+ MILES', '+ SUPPLIES']}: {w?: number; lines?: string[]}) => <V w={w} h={w * 1.6} vb="0 0 300 480">
  <path d="M10 0 L290 0 L290 450 L270 480 L250 450 L230 480 L210 450 L190 480 L170 450 L150 480 L130 450 L110 480 L90 450 L70 480 L50 450 L30 480 L10 450 Z" fill="#fff" />
  <T x={150} y={45} s={30}>BILL</T>{lines.map((l, i) => <T key={l} x={150} y={120 + i * 80} s={l.startsWith('$') ? 54 : 30} fill={l.startsWith('$') ? '#D2461F' : C.ink} w={l.startsWith('$') ? 900 : 700}>{l}</T>)}
</V>;

export const Shield = ({w = 380, label = 'NO SURPRISES ACT'}: {w?: number; label?: string}) => <V w={w} h={w * 1.15} vb="0 0 380 437">
  <path d="M190 10 L360 70 L340 260 Q300 380 190 427 Q80 380 40 260 L20 70 Z" fill="#2F5DA8" />
  {label.split(' ').map((s, i) => <T key={s} x={190} y={140 + i * 58} s={42} fill="#fff">{s}</T>)}
  <ellipse cx="190" cy="350" rx="85" ry="42" fill="#F3E9D8" />
</V>;

export const JackBox = ({w = 320}: {w?: number}) => <V w={w} h={w * 1.3} vb="0 0 320 416">
  <rect x="40" y="250" width="240" height="160" fill="#E4572E" /><rect x="40" y="250" width="240" height="30" fill="#B8322A" />
  <path d="M160 250 L120 225 L200 200 L120 175 L200 150 L160 130" fill="none" stroke="#9AA3A0" strokeWidth="10" />
  <rect x="85" y="20" width="150" height="110" fill="#fff" /><T x={160} y={55} s={26}>BILL</T><T x={160} y={95} s={34} fill="#D2461F">$$$</T>
</V>;

export const Phone = ({w = 220, label = '119', color = '#1F6B4A'}: {w?: number; label?: string; color?: string}) => <V w={w} h={w * 1.8} vb="0 0 220 396">
  <rect width="220" height="396" rx="30" fill={C.ink} /><rect x="14" y="40" width="192" height="316" rx="10" fill="#FDFDFB" />
  <T x={110} y={170} s={72} fill={color}>{label}</T><circle cx="110" cy="280" r="34" fill="#2E9E4F" />
</V>;

export const Jar = ({w = 240, label = 'LOCAL TAXES'}: {w?: number; label?: string}) => <V w={w} h={w * 1.2} vb="0 0 240 288">
  <rect x="50" y="10" width="140" height="30" rx="6" fill="#9AA3A0" /><path d="M40 40 L200 40 L215 260 Q120 300 25 260 Z" fill="#DDEFF5" />
  {[[90, 230], [140, 225], [115, 195], [80, 180], [150, 175]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="26" fill="#E8B53A" />)}
  <rect x="35" y="90" width="170" height="44" fill="#fff" /><T x={120} y={112} s={22}>{label}</T>
</V>;

export const CaliforniaMap = ({w = 300}: {w?: number}) => <V w={w} h={w * 1.4} vb="0 0 300 420">
  <path d="M20 10 L150 10 L150 160 L285 330 L270 400 L190 410 L170 370 L110 330 L80 260 L45 200 L30 120 Z" fill="#D2461F" />
  <T x={110} y={190} s={30} fill="#fff">CA</T>
</V>;

export const SplitBill = ({w = 620}: {w?: number}) => <V w={w} h={w * 0.5} vb="0 0 620 310">
  <path d="M10 10 L300 10 L285 60 L305 110 L280 160 L300 210 L285 260 L300 300 L10 300 Z" fill="#fff" />
  <path d="M330 10 L610 10 L610 300 L330 300 L315 260 L330 210 L310 160 L335 110 L315 60 Z" fill="#fff" />
  <T x={150} y={120} s={56} fill="#1F6B4A">$758</T><T x={150} y={190} s={34} fill="#1F6B4A">PAID</T>
  <T x={470} y={120} s={44} fill="#D2461F">THE REST</T><T x={470} y={190} s={38} fill="#D2461F">→ YOU</T>
</V>;

export const Hospital = ({w = 420}: {w?: number}) => <V w={w} h={w * 0.85} vb="0 0 420 357">
  <rect x="20" y="60" width="380" height="297" fill="#F7F7F2" /><rect x="20" y="60" width="380" height="24" fill="#9AA3A0" />
  <rect x="180" y="100" width="60" height="60" fill="#fff" /><rect x="200" y="106" width="20" height="48" fill={C.red} /><rect x="186" y="120" width="48" height="20" fill={C.red} />
  {[50, 110, 290, 350].map((x) => [180, 250].map((y) => <rect key={`${x}${y}`} x={x - 20} y={y} width="40" height="40" fill="#A9D3EE" />))}
  <rect x="180" y="280" width="60" height="77" fill="#7A4B2A" />
</V>;

export const DownArrow = ({w = 220, label = '−10%', color = '#1F6B4A'}: {w?: number; label?: string; color?: string}) => <V w={w} h={w * 1.3} vb="0 0 220 286">
  <path d="M45 0 L175 0 L175 150 L215 150 L110 280 L5 150 L45 150 Z" fill={color} /><T x={110} y={85} s={40} fill="#fff">{label}</T>
</V>;

export const Car = ({w = 420, label = 'UBER'}: {w?: number; label?: string}) => <V w={w} h={w * 0.5} vb="0 0 420 210">
  <path d="M20 120 L80 60 L300 60 L360 120 L400 125 L400 170 L20 170 Z" fill="#1E1E1E" /><path d="M100 72 L190 72 L190 118 L60 118 Z M205 72 L290 72 L335 118 L205 118 Z" fill="#BFE3F5" />
  <rect x="150" y="128" width="120" height="30" rx="6" fill="#fff" /><T x={210} y={144} s={22}>{label}</T>
  <circle cx="100" cy="172" r="30" fill="#444" /><circle cx="320" cy="172" r="30" fill="#444" />
</V>;
