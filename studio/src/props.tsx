// Hand-drawn style SVG props (black outlines, flat fills, slight wobble). Times are absolute seconds.
import React from 'react';
import {C, FONT, pop, ramp, useT} from './engine';

const S = 6; // stroke width
const Rough = () => <defs><filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4} /><feDisplacementMap in="SourceGraphic" scale={3.5} /></filter></defs>;
const Svg = ({w, h, vb, children}: {w: number; h: number; vb: string; children: React.ReactNode}) => (
  <svg width={w} height={h} viewBox={vb} style={{overflow: 'visible', display: 'block'}}><Rough /><g filter="url(#rough)" stroke={C.ink} strokeWidth={S} strokeLinejoin="round" strokeLinecap="round">{children}</g></svg>
);
const T = ({x, y, size, children, fill = C.ink, weight = 800}: {x: number; y: number; size: number; children: React.ReactNode; fill?: string; weight?: number}) =>
  <text x={x} y={y} fontFamily={FONT} fontWeight={weight} fontSize={size} textAnchor="middle" dominantBaseline="central" fill={fill} stroke="none">{children}</text>;

export const Pump = ({w = 300, display, color = C.red, flag}: {w?: number; display: string; color?: string; flag?: 'iran' | 'usa'}) => (
  <Svg w={w} h={w * 1.6} vb="0 0 200 320">
    <rect x="20" y="30" width="130" height="270" rx="12" fill={color} />
    <rect x="35" y="55" width="100" height="60" rx="6" fill="#F4F4F0" />
    <T x={85} y={86} size={display.length > 6 ? 20 : 26}>{display}</T>
    {flag === 'iran' && <><rect x="20" y="140" width="130" height="18" fill={C.green} /><rect x="20" y="158" width="130" height="18" fill="#fff" /><rect x="20" y="176" width="130" height="18" fill={C.red} /></>}
    {flag === 'usa' && <><rect x="20" y="140" width="130" height="54" fill="#fff" /><rect x="20" y="140" width="50" height="30" fill={C.blue} /><path d="M70 152 H150 M70 166 H150 M20 182 H150" stroke={C.red} strokeWidth={8} /></>}
    <rect x="10" y="295" width="150" height="16" rx="4" fill="#9a9a9a" />
    <path d="M150 90 C190 100 190 200 175 240" fill="none" />
    <rect x="160" y="230" width="28" height="40" rx="6" fill="#333" />
  </Svg>
);

export const JerryCan = ({w = 220, fill}: {w?: number; fill: number}) => (
  <Svg w={w} h={w * 1.25} vb="0 0 160 200">
    <clipPath id="can"><path d="M20 40 L120 40 L140 60 L140 190 L20 190 Z" /></clipPath>
    <path d="M20 40 L120 40 L140 60 L140 190 L20 190 Z" fill="#fff" />
    <rect x="20" y={190 - 150 * fill} width="120" height={150 * fill} fill={C.red} clipPath="url(#can)" stroke="none" />
    <path d="M20 40 L120 40 L140 60 L140 190 L20 190 Z" fill="none" />
    <rect x="45" y="12" width="50" height="22" rx="8" fill="none" />
    <path d="M40 80 L120 170 M120 80 L40 170" stroke="#00000033" />
  </Svg>
);

export const Tag = ({text, color = C.gold, w = 320}: {text: string; color?: string; w?: number}) => (
  <Svg w={w} h={w * 0.5} vb="0 0 300 150">
    <path d="M40 15 L285 15 L285 135 L40 135 L8 75 Z" fill={color} />
    <circle cx="45" cy="75" r="10" fill="#fff" />
    <T x={165} y={77} size={text.length > 7 ? 40 : 56}>{text}</T>
  </Svg>
);

export const Plane = ({w = 200}: {w?: number}) => (
  <Svg w={w} h={w * 0.5} vb="0 0 200 100">
    <path d="M10 55 Q20 40 60 42 L170 40 Q195 45 170 60 L60 62 Q20 64 10 55 Z" fill="#fff" />
    <path d="M90 42 L60 5 L80 5 L125 41 Z M90 61 L65 95 L85 95 L125 60 Z M25 45 L12 22 L28 22 L45 43 Z" fill={C.blue} />
    <circle cx="150" cy="50" r="5" fill={C.blue} />
  </Svg>
);

export const Coin = ({w = 160, label = '¢', spin = 0}: {w?: number; label?: string; spin?: number}) => (
  <div style={{transform: `scaleX(${Math.cos(spin)})`}}><Svg w={w} h={w} vb="0 0 100 100">
    <circle cx="50" cy="50" r="44" fill={C.gold} /><circle cx="50" cy="50" r="32" fill="none" strokeWidth={3} /><T x={50} y={52} size={40}>{label}</T>
  </Svg></div>
);

export const Bill = ({w = 260, label = '$1'}: {w?: number; label?: string}) => (
  <Svg w={w} h={w * 0.5} vb="0 0 200 100">
    <rect x="5" y="8" width="190" height="84" rx="6" fill={C.bill} /><ellipse cx="100" cy="50" rx="26" ry="30" fill="#DDEFD6" /><T x={100} y={52} size={34}>{label}</T>
  </Svg>
);

// Pile of bill bricks; n grows the pile.
export const Stack = ({w = 360, n, color = C.bill, label}: {w?: number; n: number; color?: string; label?: string}) => {
  const bricks = Array.from({length: Math.max(0, Math.round(n))}, (_, i) => i);
  const per = 4;
  return <Svg w={w} h={w} vb="0 0 300 300">
    {bricks.map((i) => {
      const row = Math.floor(i / per), col = i % per, off = row % 2 ? 30 : 0;
      return <rect key={i} x={10 + col * 66 + off} y={260 - row * 34} width="62" height="30" rx="4" fill={color} />;
    })}
    {label && <T x={150} y={290} size={34}>{label}</T>}
  </Svg>;
};

export const Scale = ({w = 520, tilt, left, right}: {w?: number; tilt: number; left: React.ReactNode; right: React.ReactNode}) => {
  const a = (tilt * Math.PI) / 180, dy = Math.sin(a) * 150;
  return <div style={{position: 'relative', width: w, height: w * 0.75}}>
    <Svg w={w} h={w * 0.75} vb="0 0 400 300">
      <path d="M200 60 L200 280 M140 285 L260 285" />
      <g transform={`rotate(${tilt} 200 60)`}><path d="M50 60 L350 60" strokeWidth={10} /></g>
      <path d={`M50 ${60 - dy} L20 ${150 - dy} M50 ${60 - dy} L80 ${150 - dy} M350 ${60 + dy} L320 ${150 + dy} M350 ${60 + dy} L380 ${150 + dy}`} strokeWidth={3} />
      <path d={`M5 ${150 - dy} Q50 ${185 - dy} 95 ${150 - dy} Z M305 ${150 + dy} Q350 ${185 + dy} 395 ${150 + dy} Z`} fill={C.gold} />
      <circle cx="200" cy="60" r="12" fill={C.gold} />
    </Svg>
    <div style={{position: 'absolute', left: w * 0.125, top: (w * 0.75) * ((150 - dy) / 300), transform: 'translate(-50%,-100%)'}}>{left}</div>
    <div style={{position: 'absolute', left: w * 0.875, top: (w * 0.75) * ((150 + dy) / 300), transform: 'translate(-50%,-100%)'}}>{right}</div>
  </div>;
};

export const Card = ({w = 320, label, color = C.blue, rejected = 0}: {w?: number; label: string; color?: string; rejected?: number}) => (
  <Svg w={w} h={w * 0.63} vb="0 0 200 126">
    <rect x="5" y="5" width="190" height="116" rx="12" fill={color} /><rect x="20" y="35" width="34" height="26" rx="4" fill={C.gold} />
    <T x={100} y={95} size={label.length > 9 ? 16 : 20} fill="#fff">{label}</T>
    {rejected > 0 && <path d={`M40 20 L${40 + 120 * rejected} ${20 + 86 * rejected} M160 20 L${160 - 120 * rejected} ${20 + 86 * rejected}`} stroke={C.red} strokeWidth={16} />}
  </Svg>
);

export const Gauge = ({w = 380, level}: {w?: number; level: number}) => {
  const a = Math.PI * (1 - level);
  return <Svg w={w} h={w * 0.62} vb="0 0 300 186">
    <path d="M20 170 A130 130 0 0 1 280 170 Z" fill="#fff" />
    <path d="M40 170 A110 110 0 0 1 75 92" stroke={C.red} strokeWidth={14} fill="none" />
    <T x={45} y={140} size={30}>E</T><T x={255} y={140} size={30}>F</T>
    <path d={`M150 170 L${150 + Math.cos(a) * 110} ${170 - Math.sin(a) * 110}`} strokeWidth={8} /><circle cx="150" cy="170" r="12" fill={C.ink} />
  </Svg>;
};

export const Globe = ({w = 320, spin = 0}: {w?: number; spin?: number}) => (
  <Svg w={w} h={w} vb="0 0 200 200">
    <circle cx="100" cy="100" r="90" fill="#9CC9F0" />
    <g transform={`translate(${((spin * 60) % 120) - 30} 0)`}><path d="M40 60 Q70 40 95 70 Q80 100 50 95 Z M110 110 Q150 100 160 140 Q130 165 115 140 Z" fill={C.green} strokeWidth={4} /></g>
    <circle cx="100" cy="100" r="90" fill="none" />
  </Svg>
);

export const Land = ({w = 440, kind, label}: {w?: number; kind: 'green' | 'cracked'; label?: string}) => (
  <Svg w={w} h={w * 0.65} vb="0 0 300 195">
    <path d="M10 70 L290 70 L250 180 L180 150 L130 190 L70 150 Z" fill="#8B5A2B" />
    <path d="M10 70 Q150 30 290 70 Q150 105 10 70 Z" fill={kind === 'green' ? '#7DBB4C' : C.sand} />
    {kind === 'cracked' && <path d="M60 68 L95 80 L120 66 M160 60 L175 78 L210 72 M230 66 L245 82" strokeWidth={3} fill="none" />}
    {label && <T x={150} y={14} size={label.length > 10 ? 30 : 40}>{label}</T>}
  </Svg>
);

export const Cushion = ({w = 420}: {w?: number}) => (
  <Svg w={w} h={w * 0.45} vb="0 0 300 135"><path d="M15 40 Q150 10 285 40 L285 115 Q150 135 15 115 Z" fill="#D9B98C" /><path d="M150 25 L150 125" strokeWidth={3} /></Svg>
);

export const Crack = ({w = 360, p}: {w?: number; p: number}) => (
  <svg width={w} height={w} viewBox="0 0 300 300" style={{overflow: 'visible'}}>
    <path d="M150 0 L130 60 L170 110 L120 170 L160 230 L140 300 M170 110 L230 140 M120 170 L60 190" stroke={C.ink} strokeWidth={8} fill="none"
      strokeDasharray="900" strokeDashoffset={900 * (1 - p)} strokeLinecap="round" />
  </svg>
);

export const Arrow = ({w = 140, color = C.red, rot = 0}: {w?: number; color?: string; rot?: number}) => (
  <div style={{transform: `rotate(${rot}deg)`}}><Svg w={w} h={w} vb="0 0 100 100"><path d="M50 95 L50 30 M20 45 L50 8 L80 45 Z" fill={color} stroke={C.ink} /></Svg></div>
);

export const Sparkles = ({w = 420, at}: {w?: number; at: number}) => {
  const t = useT();
  const pts = [[0.15, 0.2], [0.85, 0.25], [0.1, 0.8], [0.9, 0.75], [0.5, 0.05]];
  return <svg width={w} height={w} viewBox="0 0 100 100" style={{overflow: 'visible'}}>{pts.map(([x, y], i) => {
    const s = Math.max(0, Math.sin((t - at) * 6 + i * 1.3)) * pop(t, at + i * 0.08);
    return <path key={i} transform={`translate(${x * 100} ${y * 100}) scale(${s})`} d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3 Z" fill={C.gold} stroke={C.ink} strokeWidth={1.5} />;
  })}</svg>;
};

// Card that flips from "?" to its content at `at`.
export const FlipCard = ({w = 360, h = 440, at, children}: {w?: number; h?: number; at: number; children: React.ReactNode}) => {
  const t = useT();
  const p = ramp(t, at - 0.15, at + 0.15);
  const sx = Math.abs(Math.cos(p * Math.PI));
  const front = p < 0.5;
  return <div style={{width: w, height: h, transform: `scaleX(${sx})`, border: `6px solid ${C.ink}`, borderRadius: 22, background: front ? '#FFF4D6' : '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 220}}>{front ? '?' : children}</div>;
};

export const BarStack = ({segs, h = 520, w = 260}: {segs: [string, number, string, number][]; h?: number; w?: number}) => {
  const t = useT();
  let y = h;
  return <div style={{position: 'relative', width: w, height: h}}>{segs.map(([name, share, col, at]) => {
    const full = h * share; y -= full;
    if (t < at) return null;
    const g = pop(t, at, 12);
    return <div key={name} style={{position: 'absolute', left: 0, top: y + full * (1 - g), width: w, height: full * g - 6, background: col, border: `5px solid ${C.ink}`, borderRadius: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 34, color: col === C.gold ? C.ink : '#fff'}}>{full > 50 ? name : ''}</div>;
  })}</div>;
};
