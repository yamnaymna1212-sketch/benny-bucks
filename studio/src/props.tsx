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

export const Burrito = ({w = 340}: {w?: number}) => (
  <Svg w={w} h={w * 0.6} vb="0 0 250 150">
    <path d="M20 95 Q15 40 80 30 L200 25 Q240 30 235 75 Q230 120 180 125 L60 130 Q22 128 20 95 Z" fill="#F1D9A6" />
    <path d="M200 25 Q240 30 235 75 Q230 120 180 125 Q215 110 212 75 Q210 40 200 25 Z" fill="#7DBB4C" />
    <path d="M70 40 Q90 80 70 120 M120 35 Q140 80 120 125 M165 30 Q185 80 165 124" fill="none" strokeWidth={3} />
  </Svg>
);

export const Terminal = ({w = 260, screen = '', flash = 0}: {w?: number; screen?: string; flash?: number}) => (
  <Svg w={w} h={w * 1.4} vb="0 0 180 252">
    <rect x="15" y="10" width="150" height="232" rx="18" fill="#3B3B3B" />
    <rect x="30" y="30" width="120" height="70" rx="6" fill={flash > 0 ? '#BDF5C8' : '#DDE7DD'} />
    <T x={90} y={65} size={screen.length > 5 ? 20 : 30}>{screen}</T>
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={38 + c * 38} y={120 + r * 36} width="28" height="24" rx="4" fill="#9a9a9a" strokeWidth={3} />))}
  </Svg>
);

export const Receipt = ({w = 380, rows}: {w?: number; rows: [string, string, string?][]}) => (
  <Svg w={w} h={w * 1.1} vb="0 0 300 330">
    <path d="M20 10 L280 10 L280 300 L260 320 L240 300 L220 320 L200 300 L180 320 L160 300 L140 320 L120 300 L100 320 L80 300 L60 320 L40 300 L20 320 Z" fill="#fff" />
    <T x={150} y={40} size={26}>RECEIPT</T>
    {rows.map(([a, b, col], i) => <g key={i}><text x={35} y={95 + i * 52} fontFamily={FONT} fontWeight={700} fontSize={24} fill={col ?? C.ink} stroke="none">{a}</text>
      <text x={265} y={95 + i * 52} fontFamily={FONT} fontWeight={800} fontSize={24} fill={col ?? C.ink} stroke="none" textAnchor="end">{b}</text></g>)}
  </Svg>
);

export const Bank = ({w = 340}: {w?: number}) => (
  <Svg w={w} h={w * 0.9} vb="0 0 300 270">
    <path d="M20 90 L150 20 L280 90 Z" fill="#E6E6E6" /><rect x="30" y="90" width="240" height="20" fill="#E6E6E6" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={50 + i * 58} y="115" width="28" height="110" fill="#fff" />)}
    <rect x="20" y="225" width="260" height="30" fill="#E6E6E6" /><T x={150} y={70} size={30}>BANK</T>
  </Svg>
);

export const BittenCoin = ({w = 220, bite = 1}: {w?: number; bite?: number}) => (
  <Svg w={w} h={w} vb="0 0 100 100">
    <mask id="bite"><rect width="100" height="100" fill="#fff" stroke="none" />{[0, 1, 2].map((i) => <circle key={i} cx={92 - (1 - bite) * 30} cy={30 + i * 14} r={bite * 10} fill="#000" stroke="none" />)}</mask>
    <g mask="url(#bite)"><circle cx="50" cy="50" r="44" fill={C.gold} /><T x={50} y={52} size={34}>$</T></g>
  </Svg>
);

export const Ticket = ({w = 380, label = 'CELTICS'}: {w?: number; label?: string}) => (
  <Svg w={w} h={w * 0.5} vb="0 0 300 150">
    <path d="M10 15 L290 15 L290 60 Q270 75 290 90 L290 135 L10 135 L10 90 Q30 75 10 60 Z" fill={C.green} />
    <path d="M220 20 L220 130" strokeDasharray="8 8" strokeWidth={3} /><T x={115} y={77} size={36} fill="#fff">{label}</T><T x={255} y={77} size={22} fill="#fff">ADMIT</T>
  </Svg>
);

export const Calendar = ({w = 300, month = 'JAN', label}: {w?: number; month?: string; label?: string}) => (
  <Svg w={w} h={w} vb="0 0 200 200">
    <rect x="15" y="25" width="170" height="160" rx="12" fill="#fff" /><rect x="15" y="25" width="170" height="45" rx="12" fill={C.red} />
    <path d="M55 10 L55 40 M145 10 L145 40" strokeWidth={8} /><T x={100} y={48} size={30} fill="#fff">{month}</T>
    {label && <T x={100} y={128} size={label.length > 4 ? 30 : 46}>{label}</T>}
  </Svg>
);

export const Wallet = ({w = 300, label}: {w?: number; label?: string}) => (
  <Svg w={w} h={w * 0.8} vb="0 0 250 200">
    <rect x="40" y="20" width="150" height="70" rx="6" fill={C.bill} transform="rotate(-8 115 55)" />
    <rect x="15" y="60" width="220" height="125" rx="16" fill="#8B5A2B" /><rect x="170" y="100" width="65" height="45" rx="8" fill="#A9743F" />
    {label && <T x={110} y={130} size={30} fill="#fff">{label}</T>}
  </Svg>
);

export const Printer = ({w = 380, t = 0}: {w?: number; t?: number}) => (
  <Svg w={w} h={w * 0.9} vb="0 0 300 270">
    {[0, 1, 2].map((i) => { const p = ((t * 1.6 + i / 3) % 1); return <rect key={i} x={95 + Math.sin(i * 2 + t) * 10} y={150 + p * 110} width="110" height="50" rx="5" fill={C.bill} opacity={1 - p * 0.3} transform={`rotate(${(p - 0.5) * 30} 150 ${175 + p * 110})`} />; })}
    <rect x="20" y="40" width="260" height="120" rx="16" fill="#5B6B7A" /><rect x="40" y="20" width="220" height="30" rx="8" fill="#8899A6" />
    <rect x="80" y="135" width="140" height="18" rx="4" fill={C.ink} /><circle cx="245" cy="75" r="11" fill={C.red} /><circle cx="245" cy="108" r="11" fill={C.green} />
    <T x={120} y={95} size={34} fill="#fff">FED</T>
  </Svg>
);

export const GroceryBag = ({w = 260}: {w?: number}) => (
  <Svg w={w} h={w * 1.1} vb="0 0 200 220">
    <path d="M60 60 Q60 20 100 20 Q140 20 140 60" fill="none" />
    <path d="M85 70 L70 15 L95 15 Z" fill={C.green} /><circle cx="120" cy="45" r="22" fill={C.red} /><rect x="125" y="20" width="22" height="55" rx="6" fill="#F2E3B3" />
    <path d="M30 70 L170 70 L155 210 L45 210 Z" fill="#D9B98C" />
  </Svg>
);

export const House = ({w = 300}: {w?: number}) => (
  <Svg w={w} h={w} vb="0 0 200 200">
    <path d="M20 95 L100 25 L180 95 Z" fill={C.red} /><rect x="40" y="95" width="120" height="95" fill="#F4E9D8" />
    <rect x="85" y="130" width="32" height="60" fill="#8B5A2B" /><rect x="52" y="112" width="24" height="24" fill="#9CC9F0" /><rect x="125" y="112" width="24" height="24" fill="#9CC9F0" />
  </Svg>
);

export const Building = ({w = 340}: {w?: number}) => (
  <Svg w={w} h={w * 1.3} vb="0 0 200 260">
    <rect x="30" y="30" width="140" height="220" fill="#E8D3B0" /><rect x="20" y="20" width="160" height="16" fill="#B5835A" />
    {Array.from({length: 12}, (_, k) => <rect key={k} x={48 + (k % 3) * 40} y={50 + Math.floor(k / 3) * 42} width="24" height="26" fill="#9CC9F0" strokeWidth={4} />)}
    <rect x="85" y="215" width="30" height="35" fill="#8B5A2B" strokeWidth={4} />
  </Svg>
);

export const LoanDoc = ({w = 300, amount = '$1,000,000', fixed = false}: {w?: number; amount?: string; fixed?: boolean}) => (
  <Svg w={w} h={w * 1.25} vb="0 0 200 250">
    <path d="M20 10 L150 10 L180 40 L180 240 L20 240 Z" fill="#fff" /><path d="M150 10 L150 40 L180 40" fill="none" />
    <T x={100} y={45} size={26}>LOAN</T><T x={100} y={100} size={amount.length > 8 ? 24 : 30} fill={C.green}>{amount}</T>
    <path d="M45 140 L155 140 M45 165 L155 165 M45 190 L120 190" strokeWidth={4} />
    {fixed && <g transform="translate(150 200)"><rect x="-22" y="-8" width="44" height="34" rx="6" fill={C.gold} /><path d="M-12 -8 Q-12 -32 0 -32 Q12 -32 12 -8" fill="none" /></g>}
  </Svg>
);

export const MouseTrap = ({w = 360, snap = 0}: {w?: number; snap?: number}) => (
  <Svg w={w} h={w * 0.6} vb="0 0 300 180">
    <rect x="20" y="110" width="260" height="50" rx="8" fill="#D9A066" />
    <rect x="150" y="80" width="90" height="34" rx="4" fill={C.bill} /><T x={195} y={97} size={18}>CASH</T>
    <g transform={`rotate(${-150 + 150 * snap} 70 112)`}><path d="M70 112 L230 112" strokeWidth={9} /></g>
    <circle cx="70" cy="112" r="10" fill="#9a9a9a" />
  </Svg>
);

export const Balloon = ({w = 260, size = 1, label = 'INFLATION'}: {w?: number; size?: number; label?: string}) => (
  <Svg w={w} h={w * 1.4} vb="0 0 200 280">
    <g transform={`translate(100 110) scale(${size}) translate(-100 -110)`}><ellipse cx="100" cy="110" rx="80" ry="95" fill={C.red} /><T x={100} y={110} size={label.length > 6 ? 24 : 32} fill="#fff">{label}</T></g>
    <path d={`M100 ${110 + 95 * size} Q90 240 105 275`} fill="none" strokeWidth={3} />
  </Svg>
);

export const FollowButton = ({w = 420}: {w?: number}) => (
  <Svg w={w} h={w * 0.32} vb="0 0 300 96"><rect x="5" y="5" width="290" height="86" rx="43" fill={C.red} /><T x={150} y={50} size={44} fill="#fff">FOLLOW</T></Svg>
);

export const BigHouse = ({w = 520}: {w?: number}) => (
  <Svg w={w} h={w * 0.72} vb="0 0 360 260">
    <path d="M10 250 L350 250" /><path d="M0 252 Q180 236 360 252 L360 260 L0 260 Z" fill="#8FC66B" strokeWidth={3} />
    <path d="M30 110 L140 30 L250 110 Z" fill="#B5583F" /><rect x="45" y="110" width="190" height="140" fill="#F4E9D8" />
    {[[60, 130], [175, 130], [60, 190], [175, 190]].map(([x, y], i) => <rect key={i} x={x} y={y} width="40" height="36" fill="#9CC9F0" strokeWidth={4} />)}
    <rect x="120" y="185" width="40" height="65" fill="#8B5A2B" strokeWidth={4} />
    <path d="M235 140 L300 110 L345 140 Z" fill="#B5583F" /><rect x="240" y="140" width="100" height="110" fill="#E8DCC8" />
    <path d="M255 170 L325 170 M255 190 L325 190 M255 210 L325 210 M255 230 L325 230" strokeWidth={3} />
  </Svg>
);

// Duplex: left (green) and right (blue) homes; labels optional.
export const Duplex = ({w = 520, left, right, leak = 0}: {w?: number; left?: string; right?: string; leak?: number}) => (
  <Svg w={w} h={w * 0.8} vb="0 0 300 240">
    <path d="M10 95 L150 20 L290 95 Z" fill="#A0705A" /><rect x="25" y="95" width="125" height="135" fill="#8FC67E" /><rect x="150" y="95" width="125" height="135" fill="#8BB0D9" />
    <rect x="70" y="160" width="34" height="70" fill="#5E9C52" strokeWidth={4} /><rect x="196" y="160" width="34" height="70" fill="#5B82B5" strokeWidth={4} />
    <rect x="38" y="112" width="28" height="28" fill="#DCEBFA" strokeWidth={4} /><rect x="112" y="112" width="28" height="28" fill="#DCEBFA" strokeWidth={4} />
    <rect x="163" y="112" width="28" height="28" fill="#DCEBFA" strokeWidth={4} /><rect x="237" y="112" width="28" height="28" fill="#DCEBFA" strokeWidth={4} />
    {left && <T x={87} y={147} size={left.length > 6 ? 15 : 19} fill={C.ink}>{left}</T>}
    {right && <T x={213} y={147} size={right.length > 6 ? 15 : 19} fill={C.ink}>{right}</T>}
    {leak > 0 && [0, 1, 2].map((i) => <path key={i} d={`M${200 + i * 18} ${70 + ((leak * 60 + i * 20) % 50)} q4 8 0 12 q-4 -4 0 -12 Z`} fill="#4A90D9" strokeWidth={2} />)}
  </Svg>
);

export const Furnace = ({w = 260, broken = 0}: {w?: number; broken?: number}) => (
  <Svg w={w} h={w * 1.3} vb="0 0 200 260">
    <rect x="30" y="20" width="140" height="230" rx="8" fill="#B8C0C8" /><rect x="55" y="140" width="90" height="80" rx="6" fill="#3B3B3B" />
    {broken < 1 ? <path d="M100 210 Q80 185 95 165 Q100 180 108 172 Q122 190 100 210 Z" fill="#F28C28" /> : <path d="M60 150 L140 210 M140 150 L60 210" stroke={C.red} strokeWidth={10} />}
    {broken > 0 && [0, 1, 2].map((i) => <circle key={i} cx={80 + i * 22} cy={10 - broken * 30 - i * 8} r={12 + i * 3} fill="#9a9a9a" opacity={0.7} strokeWidth={2} />)}
    <path d="M60 50 L140 50 M60 70 L140 70 M60 90 L140 90" strokeWidth={4} />
  </Svg>
);

export const Noodles = ({w = 260}: {w?: number}) => (
  <Svg w={w} h={w * 0.8} vb="0 0 200 160">
    <path d="M60 10 L95 95 M85 5 L105 95" strokeWidth={5} />
    <path d="M20 80 L180 80 Q170 150 100 150 Q30 150 20 80 Z" fill="#E8E3D6" />
    <path d="M40 80 Q60 60 80 80 Q100 60 120 80 Q140 60 160 80" fill="none" stroke="#E8C46A" strokeWidth={7} />
  </Svg>
);
