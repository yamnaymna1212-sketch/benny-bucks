// Flat cut-paper props for the college-germany video (no outlines: collage pieces get cream keylines from <Piece>).
import React from 'react';
import {C, FONT} from '../engine';

const V = ({w, h, vb, children}: {w: number; h: number; vb: string; children: React.ReactNode}) =>
  <svg width={w} height={h} viewBox={vb} style={{display: 'block', overflow: 'visible'}}>{children}</svg>;
const T = ({x, y, s, fill = C.ink, children, w = 900}: {x: number; y: number; s: number; fill?: string; children: React.ReactNode; w?: number}) =>
  <text x={x} y={y} fontFamily={FONT} fontWeight={w} fontSize={s} fill={fill} textAnchor="middle" dominantBaseline="central">{children}</text>;
const GOLD = '#E8B53A', STONE = '#EFE4CF', STONE2 = '#D9C7A6';

// Fancy US private college: columns, pediment, gold dome.
export const Ivy = ({w = 420}: {w?: number}) => <V w={w} h={w * 0.95} vb="0 0 400 380">
  <ellipse cx="200" cy="70" rx="60" ry="55" fill={GOLD} /><rect x="194" y="0" width="12" height="22" fill={GOLD} />
  <path d="M30 150 L200 70 L370 150 Z" fill={STONE2} /><rect x="30" y="150" width="340" height="22" fill={STONE} />
  {[60, 120, 180, 240, 300].map((x) => <rect key={x} x={x} y="172" width="38" height="160" fill="#fff" />)}
  <rect x="15" y="332" width="370" height="26" fill={STONE2} /><rect x="0" y="356" width="400" height="24" fill={STONE} />
  <rect x="181" y="250" width="38" height="82" fill="#7A4B2A" />
</V>;

// Plain German public university: simple block, door wide open.
export const PlainUni = ({w = 400}: {w?: number}) => <V w={w} h={w * 0.8} vb="0 0 400 320">
  <rect x="20" y="40" width="360" height="280" fill="#E9E9E2" /><rect x="20" y="40" width="360" height="26" fill="#9AA3A0" />
  {Array.from({length: 8}, (_, k) => <rect key={k} x={50 + (k % 4) * 82} y={90 + Math.floor(k / 4) * 70} width="50" height="44" fill="#A9D3EE" />)}
  <rect x="160" y="236" width="80" height="84" fill="#FFF6C9" /><path d="M160 236 L130 248 L130 330 L160 320 Z" fill="#6B8F71" />
</V>;

export const Plate = ({w = 300}: {w?: number}) => <V w={w} h={w * 0.4} vb="0 0 300 120">
  <ellipse cx="150" cy="60" rx="145" ry="55" fill="#fff" /><ellipse cx="150" cy="60" rx="95" ry="34" fill="#F1ECE2" />
</V>;

export const Passport = ({w = 200, color = '#1F3A68', label = 'USA'}: {w?: number; color?: string; label?: string}) => <V w={w} h={w * 1.35} vb="0 0 200 270">
  <rect width="200" height="270" rx="12" fill={color} /><circle cx="100" cy="115" r="40" fill="none" stroke={GOLD} strokeWidth="8" />
  <T x={100} y={45} s={24} fill={GOLD}>PASSPORT</T><T x={100} y={215} s={30} fill={GOLD}>{label}</T>
</V>;

export const Bus = ({w = 420}: {w?: number}) => <V w={w} h={w * 0.55} vb="0 0 400 220">
  <rect x="10" y="20" width="380" height="160" rx="26" fill="#F2C230" /><rect x="10" y="130" width="380" height="20" fill="#2E7D4F" />
  {[40, 120, 200, 280].map((x) => <rect key={x} x={x} y="45" width="64" height="60" rx="6" fill="#BFE3F5" />)}
  <circle cx="90" cy="185" r="30" fill={C.ink} /><circle cx="310" cy="185" r="30" fill={C.ink} />
</V>;

export const QMark = ({w = 360, color = CREAMQ}: {w?: number; color?: string}) => <V w={w} h={w * 1.2} vb="0 0 300 360">
  <T x={150} y={190} s={380} fill={color}>?</T>
</V>;
const CREAMQ = '#FFF3D6';

export const Chalkboard = ({w = 560}: {w?: number}) => <V w={w} h={w * 0.62} vb="0 0 500 310">
  <rect width="500" height="310" fill="#8B5A2B" /><rect x="18" y="18" width="464" height="274" fill="#2F4F3A" />
  {['Vorlesung', 'Prüfungsordnung', 'Hausarbeit'].map((s, i) => <T key={s} x={250} y={80 + i * 75} s={46} fill="#F4F1E6" w={600}>{s}</T>)}
</V>;

export const Book = ({w = 240, label = 'DEUTSCH'}: {w?: number; label?: string}) => <V w={w} h={w * 1.25} vb="0 0 200 250">
  <rect width="200" height="250" rx="8" fill={C.red} /><rect x="0" y="0" width="26" height="250" fill="#A82A20" />
  <rect x="45" y="70" width="135" height="60" fill="#FFF3D6" /><T x={112} y={100} s={26}>{label}</T>
</V>;

export const Diploma = ({w = 380, label = 'HIGH SCHOOL'}: {w?: number; label?: string}) => <V w={w} h={w * 0.72} vb="0 0 380 274">
  <rect x="10" y="10" width="360" height="254" fill="#FFF8E7" /><rect x="26" y="26" width="328" height="222" fill="none" stroke={GOLD} strokeWidth="6" />
  <T x={190} y={80} s={30}>DIPLOMA</T><T x={190} y={130} s={24} w={700}>{label}</T>
  <circle cx="300" cy="210" r="28" fill={C.red} />
</V>;

export const ExamPaper = ({w = 200, label = 'AP'}: {w?: number; label?: string}) => <V w={w} h={w * 1.3} vb="0 0 200 260">
  <rect width="200" height="260" fill="#fff" />{[90, 125, 160, 195, 230].map((y) => <rect key={y} x="25" y={y} width="150" height="10" fill="#D7DCE3" />)}
  <T x={100} y={45} s={44} fill={C.blue}>{label}</T>
</V>;

export const Vault = ({w = 420}: {w?: number}) => <V w={w} h={w} vb="0 0 400 400">
  <rect x="10" y="10" width="380" height="380" rx="24" fill="#8C9396" /><circle cx="200" cy="200" r="150" fill="#B9C0C3" />
  <circle cx="200" cy="200" r="40" fill="#5E6669" />{[0, 60, 120].map((a) => <rect key={a} x="190" y="90" width="20" height="220" fill="#5E6669" transform={`rotate(${a} 200 200)`} />)}
</V>;

export const Lock = ({w = 160}: {w?: number}) => <V w={w} h={w * 1.2} vb="0 0 160 190">
  <path d="M40 80 L40 50 A40 40 0 0 1 120 50 L120 80" fill="none" stroke="#5E6669" strokeWidth="18" /><rect x="15" y="80" width="130" height="105" rx="12" fill={GOLD} />
  <circle cx="80" cy="125" r="14" fill={C.ink} /><rect x="74" y="130" width="12" height="30" fill={C.ink} />
</V>;

export const EuroCoin = ({w = 110}: {w?: number}) => <V w={w} h={w} vb="0 0 100 100">
  <circle cx="50" cy="50" r="46" fill={GOLD} /><circle cx="50" cy="50" r="34" fill="#F4CE62" /><T x={50} y={52} s={44}>€</T>
</V>;

export const Mountain = ({w = 460}: {w?: number}) => <V w={w} h={w * 0.9} vb="0 0 460 414">
  {Array.from({length: 28}, (_, i) => { const row = [7, 6, 5, 4, 3, 2, 1]; let r = 0, k = i; while (k >= row[r]) { k -= row[r]; r++; }
    const x = 230 - row[r] * 31 + k * 62, y = 360 - r * 50;
    return <g key={i}><rect x={x} y={y} width="58" height="44" rx="4" fill="#7FB37A" /><rect x={x + 22} y={y} width="14" height="44" fill="#E8D9A8" /></g>; })}
</V>;

export const GradCap = ({w = 320}: {w?: number}) => <V w={w} h={w * 0.7} vb="0 0 320 224">
  <path d="M160 10 L310 70 L160 130 L10 70 Z" fill={C.ink} /><path d="M70 95 L70 170 Q160 215 250 170 L250 95 L160 130 Z" fill="#2B2B2B" />
  <path d="M160 70 L275 110 L275 175" fill="none" stroke={GOLD} strokeWidth="7" /><circle cx="275" cy="182" r="12" fill={GOLD} />
</V>;

export const Chain = ({w = 520, color = '#A8AEB1'}: {w?: number; color?: string}) => <V w={w} h={w * 0.2} vb="0 0 520 104">
  {Array.from({length: 8}, (_, i) => <ellipse key={i} cx={40 + i * 62} cy={52} rx={40} ry={i % 2 ? 18 : 30} fill="none" stroke={color} strokeWidth="14" />)}
</V>;

export const Road = ({w = 760}: {w?: number}) => <V w={w} h={w * 0.55} vb="0 0 760 418">
  <path d="M330 418 L430 418 L560 0 L470 0 Z" fill="#5A5F63" /><path d="M330 418 L430 418 L290 0 L200 0 Z" fill="#5A5F63" />
  <path d="M380 410 L515 10 M380 410 L245 10" stroke="#F4E3A1" strokeWidth="8" strokeDasharray="30 26" />
</V>;

export const Cross = ({w = 220}: {w?: number}) => <V w={w} h={w} vb="0 0 100 100">
  <path d="M15 15 L85 85 M85 15 L15 85" stroke={C.red} strokeWidth="14" strokeLinecap="round" />
</V>;
