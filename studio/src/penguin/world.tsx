// Penguin world set pieces + story devices, same pen/fill language as the cast (thin uneven ink, two-tone flat fills,
// subtle boil, animated on twos). Reference equivalents: BANK -> Ice Bank, safe -> ice vault, hut -> igloo,
// thought cloud, A/B letters, red "+ interest" notes, sparkle concept titles, fire for disaster endings.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FPS} from '../engine';
import {HAND} from '../sketch';
import {Boil, FishShape, INK, back, useT2} from './rig';

const LW = 4.5;
const ICE = '#E4F4FC', ICE2 = '#BFE0F0', ICE3 = '#8FC3DC';

const Svg = ({x, y, w, h, vb, id, amount = 1.8, children, anchor = 'bottom', style}: {x: number; y: number; w: number; h: number; vb: string; id: string; amount?: number; children: React.ReactNode; anchor?: 'bottom' | 'center'; style?: React.CSSProperties}) =>
  <svg width={w} height={h} viewBox={vb} style={{position: 'absolute', left: x - w / 2, top: anchor === 'bottom' ? y - h : y - h / 2, overflow: 'visible', ...style}}>
    <defs><Boil id={id} amount={amount} /></defs><g filter={`url(#${id})`}>{children}</g>
  </svg>;

// Pop-in scale (overshoot) for anything that appears at `at`.
const usePop = (at = -99) => { const t = useT2(); return t < at ? 0 : back((t - at) / 0.25); };

// Classical bank facade carved from ice. x = centre, y = ground.
export const IceBank = ({x, y, w = 640, id = 'bank'}: {x: number; y: number; w?: number; id?: string}) => {
  const h = w * 0.86;
  return <Svg x={x} y={y} w={w} h={h} vb="0 0 640 550" id={id}>
    <path d="M250 70 Q320 0 390 70 Z" fill={ICE2} stroke={INK} strokeWidth={LW} />
    <path d="M40 140 L320 60 L600 140 Z" fill={ICE} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <text x={320} y={128} textAnchor="middle" fontFamily={HAND} fontSize={58} fill={INK}>BANK</text>
    <rect x={30} y={140} width={580} height={36} fill={ICE2} stroke={INK} strokeWidth={LW} />
    {[80, 200, 400, 520].map((cx) => <g key={cx}>
      <rect x={cx - 26} y={176} width={52} height={300} fill={ICE} stroke={INK} strokeWidth={LW} />
      <path d={`M${cx - 10} 190 L${cx - 10} 462 M${cx + 10} 190 L${cx + 10} 462`} stroke={ICE3} strokeWidth={3} />
    </g>)}
    <path d="M260 476 L260 300 Q320 250 380 300 L380 476 Z" fill="#2C4A5E" stroke={INK} strokeWidth={LW} />
    <rect x={10} y={476} width={620} height={30} fill={ICE2} stroke={INK} strokeWidth={LW} />
    <rect x={0} y={506} width={640} height={36} fill={ICE} stroke={INK} strokeWidth={LW} />
    <path d="M120 520 l 30 -8 M430 522 l 40 -10" stroke={ICE3} strokeWidth={4} strokeLinecap="round" />
  </Svg>;
};

// Ice vault door. open 0..1 swings it open on its left hinge, showing the fish inside (count).
export const Vault = ({x, y, w = 360, open = 0, fish = 0, id = 'vault'}: {x: number; y: number; w?: number; open?: number; fish?: number; id?: string}) => {
  const t = useT2();
  return <Svg x={x} y={y} w={w} h={w} vb="0 0 360 360" id={id} anchor="center">
    <rect x={10} y={10} width={340} height={340} rx={16} fill="#3B5568" stroke={INK} strokeWidth={LW} />
    {[120, 190, 260].map((yy) => <path key={yy} d={`M30 ${yy + 50} L330 ${yy + 50}`} stroke="#2A4052" strokeWidth={6} />)}
    {Array.from({length: fish}, (_, i) => <g key={i} transform={`translate(${110 + (i % 2) * 140} ${280 - Math.floor(i / 2) * 70}) scale(0.42) rotate(${(i % 3) * 6 - 6})`}><FishShape t={t + i} wag={0.5} /></g>)}
    <g transform={`translate(10 0) scale(${1 - open * 0.92} 1) translate(-10 0)`}>
      <rect x={10} y={10} width={340} height={340} rx={16} fill="#9FB8C6" stroke={INK} strokeWidth={LW} />
      <rect x={34} y={34} width={292} height={292} rx={10} fill="#B9CFDA" stroke={INK} strokeWidth={LW - 1} />
      <circle cx={180} cy={180} r={82} fill="#9FB8C6" stroke={INK} strokeWidth={LW} />
      <g transform={`rotate(${open * 200} 180 180)`}>{[0, 60, 120].map((a) => <rect key={a} x={174} y={104} width={12} height={152} rx={5} fill="#6F8A99" stroke={INK} strokeWidth={3} transform={`rotate(${a} 180 180)`} />)}</g>
      <circle cx={180} cy={180} r={22} fill="#6F8A99" stroke={INK} strokeWidth={LW} />
    </g>
  </Svg>;
};

// Igloo home (the reference's hut).
export const Igloo = ({x, y, w = 420, id = 'igloo'}: {x: number; y: number; w?: number; id?: string}) =>
  <Svg x={x} y={y} w={w} h={w * 0.62} vb="0 0 420 260" id={id}>
    <path d="M20 256 Q30 20 210 16 Q390 20 400 256 Z" fill={ICE} stroke={INK} strokeWidth={LW} />
    {[80, 140, 200].map((yy) => <path key={yy} d={`M${30 + (yy - 60) * 0.12} ${yy} Q210 ${yy - 28} ${390 - (yy - 60) * 0.12} ${yy}`} fill="none" stroke={ICE3} strokeWidth={3.5} />)}
    {[[120, 60, 80], [250, 60, 80], [90, 110, 140], [190, 110, 140], [300, 110, 140], [140, 160, 200], [270, 160, 200]].map(([xx, a, b], i) =>
      <path key={i} d={`M${xx} ${a + 6} L${xx} ${b - 4}`} stroke={ICE3} strokeWidth={3.5} />)}
    <path d="M150 256 L150 190 Q210 140 270 190 L270 256 Z" fill="#2C4A5E" stroke={INK} strokeWidth={LW} />
    <path d="M300 30 Q330 40 352 70" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" />
  </Svg>;

// Thought cloud with anything inside; small trailing puffs point to the thinker at (tx, ty).
export const Thought = ({x, y, w = 420, tx, ty, at = -99, until, children}: {x: number; y: number; w?: number; tx: number; ty: number; at?: number; until?: number; children?: React.ReactNode}) => {
  const t = useT2(), p = usePop(at);
  if (t < at || (until !== undefined && t >= until)) return null;
  const h = w * 0.62;
  const puffs = Array.from({length: 11}, (_, i) => { const a = (i / 11) * Math.PI * 2;
    return [w / 2 + Math.cos(a) * w * 0.42, h / 2 + Math.sin(a) * h * 0.38, w * 0.13 + Math.sin(i * 1.7 + t * 2) * 3] as const; });
  return <div style={{position: 'absolute', left: 0, top: 0, transform: `scale(${p})`, transformOrigin: `${tx}px ${ty}px`}}>
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs><Boil id="thought" amount={1.6} /></defs>
      <g filter="url(#thought)">
        {[0.25, 0.5].map((k, i) => <ellipse key={i} cx={tx + (x - tx) * k} cy={ty + (y + h / 2 - ty) * k} rx={10 + i * 10} ry={8 + i * 8} fill="#fff" stroke={INK} strokeWidth={LW} />)}
        <g transform={`translate(${x - w / 2} ${y - h / 2})`}>
          {puffs.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#fff" stroke={INK} strokeWidth={LW} />)}
          <ellipse cx={w / 2} cy={h / 2} rx={w * 0.42} ry={h * 0.38} fill="#fff" />
        </g>
      </g>
    </svg>
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h}}>{children}</div>
  </div>;
};

// Hand-written letter/label under a character ("A", "B").
export const Letter = ({text, x, y, at = -99, size = 72, color = INK}: {text: string; x: number; y: number; at?: number; size?: number; color?: string}) => {
  const p = usePop(at); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${p})`, fontFamily: HAND, fontSize: size, color, lineHeight: 1}}>{text}</div>;
};

// Red hand-drawn note with an arrow pointing at something (reference: "+ interest").
export const Note = ({text, x, y, toX, toY, at = -99, until, size = 60, color = '#D83A2E'}: {text: string; x: number; y: number; toX: number; toY: number; at?: number; until?: number; size?: number; color?: string}) => {
  const t = useT2(), p = usePop(at);
  if (p <= 0 || (until !== undefined && t >= until)) return null;
  const ang = Math.atan2(toY - y, toX - x), L = Math.hypot(toX - x, toY - y) * Math.min(1, (t - at) / 0.3);
  const ex = x + Math.cos(ang) * L, ey = y + Math.sin(ang) * L;
  return <>
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M${x} ${y} L${ex} ${ey}`} stroke={color} strokeWidth={6} strokeLinecap="round" />
      <path d={`M${ex} ${ey} l ${Math.cos(ang + 2.6) * 26} ${Math.sin(ang + 2.6) * 26} M${ex} ${ey} l ${Math.cos(ang - 2.6) * 26} ${Math.sin(ang - 2.6) * 26}`} stroke={color} strokeWidth={6} strokeLinecap="round" />
    </svg>
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, ${toY > y ? '-110%' : '10%'}) scale(${p})`, fontFamily: HAND, fontSize: size, color, whiteSpace: 'nowrap', fontWeight: 700}}>{text}</div>
  </>;
};

// Big red "+" between two things (reference: pile + small pile).
export const Plus = ({x, y, at = -99, size = 70}: {x: number; y: number; at?: number; size?: number}) => {
  const p = usePop(at); if (p <= 0) return null;
  return <svg width={size} height={size} viewBox="0 0 10 10" style={{position: 'absolute', left: x - size / 2, top: y - size / 2, transform: `scale(${p})`}}>
    <path d="M5 1 L5 9 M1 5 L9 5" stroke="#D83A2E" strokeWidth={2} strokeLinecap="round" /></svg>;
};

// Concept title, hand-lettered with twinkling yellow sparkles (reference: "DEMAND-PULL INFLATION").
export const Title = ({lines, x = 540, y = 960, at = -99, size = 110}: {lines: string[]; x?: number; y?: number; at?: number; size?: number}) => {
  const t = useT2(), p = usePop(at); if (p <= 0) return null;
  const half = Math.max(...lines.map((l) => l.length)) * size * 0.3 + 30;
  const sp = [[-0.55, -0.9], [0.6, -0.8], [-0.62, 0.7], [0.5, 0.9], [0.05, -1.2], [0.7, 0.1]];
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${p})`, textAlign: 'center'}}>
    {lines.map((l, i) => <div key={i} style={{fontFamily: HAND, fontSize: i === 0 ? size : size * 0.62, color: INK, letterSpacing: 6, lineHeight: 1.25, whiteSpace: 'nowrap'}}>{l}</div>)}
    {sp.map(([sx, sy], i) => { const tw = 0.6 + 0.4 * Math.sin(t * 6 + i * 1.3);
      return <svg key={i} width={40} height={40} viewBox="-10 -10 20 20" style={{position: 'absolute', left: `calc(50% + ${sx * half * 1.1}px)`, top: `calc(50% + ${sy * size * 1.1}px)`, transform: `scale(${tw}) rotate(${t * 40 + i * 30}deg)`}}>
        <path d="M0 -9 Q1.5 -1.5 9 0 Q1.5 1.5 0 9 Q-1.5 1.5 -9 0 Q-1.5 -1.5 0 -9 Z" fill="#F5C518" /></svg>; })}
  </div>;
};

// Flickering cartoon flames (disaster endings). Place several along a building.
export const Flame = ({x, y, s = 1, seed = 0}: {x: number; y: number; s?: number; seed?: number}) => {
  const fr = Math.floor(useCurrentFrame() / 3) + seed * 7;
  const k = 1 + Math.sin(fr * 1.9) * 0.12, lean = Math.sin(fr * 1.3) * 8;
  return <svg width={120 * s} height={160 * s} viewBox="0 0 120 160" style={{position: 'absolute', left: x - 60 * s, top: y - 150 * s, overflow: 'visible', transform: `scaleY(${k}) rotate(${lean}deg)`, transformOrigin: '50% 95%'}}>
    <path d="M60 4 C 74 40, 112 60, 104 110 C 98 146, 22 150, 16 110 C 10 76, 40 70, 44 40 C 52 60, 60 56, 60 4 Z" fill="#F08A24" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M62 60 C 70 84, 88 96, 82 120 C 76 140, 42 140, 38 118 C 36 100, 54 98, 62 60 Z" fill="#F5C518" />
  </svg>;
};

// Snow mound / ice rock so the empty white stage reads as "south pole" without clutter.
export const SnowPile = ({x, y, w = 260, id = 'snow'}: {x: number; y: number; w?: number; id?: string}) =>
  <Svg x={x} y={y} w={w} h={w * 0.35} vb="0 0 260 90" id={id}>
    <path d="M6 88 Q40 20 100 34 Q140 0 190 30 Q240 26 254 88 Z" fill={ICE} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M150 40 Q180 36 200 52" fill="none" stroke={ICE3} strokeWidth={4} strokeLinecap="round" />
  </Svg>;

// Protest / announcement sign held up on a stick (reference: "WE WANT").
export const Sign = ({x, y, text, w = 300, id = 'sign', sway = 1}: {x: number; y: number; text: string; w?: number; id?: string; sway?: number}) => {
  const t = useT2();
  return <div style={{position: 'absolute', left: 0, top: 0, transform: `rotate(${Math.sin(t * 4 + x) * 5 * sway}deg)`, transformOrigin: `${x}px ${y}px`}}>
    <Svg x={x} y={y} w={w} h={w * 1.1} vb="0 0 300 330" id={id}>
      <rect x={142} y={150} width={16} height={180} fill="#9A6A35" stroke={INK} strokeWidth={LW} />
      <path d="M6 10 L294 4 L296 160 L4 166 Z" fill="#C8924E" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
      <text x={150} y={102} textAnchor="middle" fontFamily={HAND} fontSize={Math.min(70, 470 / Math.max(1, text.length))} fill={INK}>{text}</text>
    </Svg>
  </div>;
};

// Fish bundle on the ground: n fish stacked (the "pile of money").
export const FishPile = ({x, y, n, w = 150, rotten = 0, seed = 0}: {x: number; y: number; n: number; w?: number; rotten?: number; seed?: number}) => {
  const t = useT2();
  const k = w / 300;
  return <svg width={w * 2} height={w * 2.2} viewBox={`${-w} ${-w * 2} ${w * 2} ${w * 2.2}`} style={{position: 'absolute', left: x - w, top: y - w * 2, overflow: 'visible'}}>
    <defs><Boil id={`pile${seed}`} amount={1.6} /></defs>
    <g filter={`url(#pile${seed})`}>
      {Array.from({length: n}, (_, i) => { const row = Math.floor(i / 3), col = i % 3, inRow = Math.min(3, n - row * 3);
        const fx = (col - (inRow - 1) / 2) * w * 0.55 + (row % 2) * w * 0.12, fy = -w * 0.18 - row * w * 0.28;
        return <g key={i} transform={`translate(${fx} ${fy}) rotate(${((i * 37) % 13) - 6}) scale(${k * (i % 2 ? -1 : 1)} ${k})`}><FishShape t={t + i * 0.37 + seed} rotten={rotten} wag={0.5} /></g>; })}
    </g>
  </svg>;
};

export const WORLD_FPS = FPS;
