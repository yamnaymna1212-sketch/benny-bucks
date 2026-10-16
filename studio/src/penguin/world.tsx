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

// Tiny ice-cube apartment (the hero's rental), with a hand-written sign on the door.
export const IceCube = ({x, y, w = 300, id = 'cube', sign}: {x: number; y: number; w?: number; id?: string; sign?: string}) =>
  <Svg x={x} y={y} w={w} h={w} vb="0 0 300 300" id={id}>
    <path d="M20 60 L230 40 L280 70 L280 296 L20 296 Z" fill={ICE} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M20 60 L230 40 L280 70 L70 92 Z" fill="#fff" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M230 40 L230 270 M70 92 L70 296" stroke={ICE3} strokeWidth={4} />
    <path d="M110 296 L110 200 Q150 176 190 200 L190 296 Z" fill="#2C4A5E" stroke={INK} strokeWidth={LW} />
    <path d="M240 120 l 20 -6 M246 170 l 20 -6" stroke={ICE3} strokeWidth={4} strokeLinecap="round" />
    {sign && <><rect x={96} y={120} width={108} height={46} fill="#fff" stroke={INK} strokeWidth={LW - 1} />
      <text x={150} y={152} textAnchor="middle" fontFamily={HAND} fontSize={Math.min(30, 170 / sign.length)} fill="#D83A2E" fontWeight={700}>{sign}</text></>}
  </Svg>;

// Rich igloo mansion: three domes, gold trim, fish flag.
export const Mansion = ({x, y, w = 760, id = 'mansion'}: {x: number; y: number; w?: number; id?: string}) => {
  const t = useT2();
  return <Svg x={x} y={y} w={w} h={w * 0.72} vb="0 0 760 548" id={id}>
    <path d="M380 70 L380 0" stroke={INK} strokeWidth={LW} /><path d={`M380 4 Q420 ${14 + Math.sin(t * 6) * 6} 456 8 Q420 ${34 + Math.sin(t * 6) * 6} 380 34 Z`} fill="#41A8EC" stroke={INK} strokeWidth={LW - 1} />
    <path d="M20 546 Q30 300 200 296 Q330 300 340 546 Z" fill={ICE} stroke={INK} strokeWidth={LW} />
    <path d="M420 546 Q430 300 580 296 Q730 300 740 546 Z" fill={ICE} stroke={INK} strokeWidth={LW} />
    <path d="M170 546 Q180 70 380 66 Q580 70 590 546 Z" fill="#F2FAFE" stroke={INK} strokeWidth={LW} />
    {[180, 280, 380].map((yy) => <path key={yy} d={`M${190 + (yy - 120) * 0.05} ${yy} Q380 ${yy - 40} ${570 - (yy - 120) * 0.05} ${yy}`} fill="none" stroke={ICE3} strokeWidth={3.5} />)}
    <path d="M190 470 Q380 440 570 470" fill="none" stroke="#E2B13C" strokeWidth={10} />
    <path d="M320 546 L320 440 Q380 400 440 440 L440 546 Z" fill="#2C4A5E" stroke={INK} strokeWidth={LW} />
    <circle cx={428} cy={496} r={7} fill="#E2B13C" />
    {[[110, 430], [650, 430], [270, 250], [490, 250]].map(([a, b], i) => <rect key={i} x={a - 26} y={b - 22} width={52} height={44} rx={8} fill="#FFE9A8" stroke={INK} strokeWidth={LW - 1} />)}
  </Svg>;
};

// Hand-drawn price tag on a string: big dollar price + fish conversion line.
export const PriceTag = ({x, y, price, fish, at = -99, rot = -6, size = 1, color = '#D83A2E'}: {x: number; y: number; price: string; fish?: string; at?: number; rot?: number; size?: number; color?: string}) => {
  const t = useT2(), p = usePop(at); if (p <= 0) return null;
  const sw = Math.sin(t * 2.5) * 2;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot + sw}deg) scale(${p * size})`, transformOrigin: '50% 0%'}}>
    <div style={{position: 'relative', background: '#FFF9EC', border: `5px solid ${INK}`, borderRadius: 18, padding: '10px 34px 12px 50px', textAlign: 'center', boxShadow: '4px 6px 0 rgba(0,0,0,0.10)'}}>
      <div style={{position: 'absolute', left: 14, top: '50%', width: 18, height: 18, marginTop: -9, borderRadius: '50%', border: `4px solid ${INK}`, background: '#fff'}} />
      <div style={{fontFamily: HAND, fontSize: 96, fontWeight: 700, color, lineHeight: 1}}>{price}</div>
      {fish && <div style={{fontFamily: HAND, fontSize: 44, color: INK, lineHeight: 1.1}}>{fish}</div>}
    </div>
  </div>;
};

// Fish ATM: screen + slot that spits fish.
export const FishATM = ({x, y, w = 300, id = 'atm', screen = 'FISH'}: {x: number; y: number; w?: number; id?: string; screen?: string}) =>
  <Svg x={x} y={y} w={w} h={w * 1.5} vb="0 0 300 450" id={id}>
    <rect x={20} y={20} width={260} height={428} rx={18} fill="#9FB8C6" stroke={INK} strokeWidth={LW} />
    <rect x={50} y={60} width={200} height={120} rx={8} fill="#BFE7C9" stroke={INK} strokeWidth={LW} />
    <text x={150} y={134} textAnchor="middle" fontFamily={HAND} fontSize={44} fill={INK}>{screen}</text>
    {Array.from({length: 9}, (_, i) => <rect key={i} x={70 + (i % 3) * 56} y={210 + Math.floor(i / 3) * 44} width={44} height={32} rx={6} fill="#E4EEF3" stroke={INK} strokeWidth={3} />)}
    <rect x={60} y={360} width={180} height={24} rx={6} fill="#2C4A5E" stroke={INK} strokeWidth={LW} />
  </Svg>;

// Motion streaks behind a running character (dir = +1 running right).
export const SpeedLines = ({x, y, dir = 1, h = 300}: {x: number; y: number; dir?: number; h?: number}) => {
  const t = useT2();
  return <svg width={400} height={h} style={{position: 'absolute', left: dir > 0 ? x - 400 : x, top: y - h, overflow: 'visible'}}>
    {[0.2, 0.4, 0.6, 0.8].map((k, i) => { const len = 120 + ((t * 9 + i) % 1) * 140, yy = h * k, x0 = dir > 0 ? 400 - 30 : 30;
      return <path key={i} d={`M${x0} ${yy} L${x0 - dir * len} ${yy}`} stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={0.7} />; })}
  </svg>;
};

// Big hand-lettered key word / number (readable on a phone): pops, slight wobble.
export const BigWord = ({text, x, y, at, until, size = 150, color = INK, rot = -3}: {text: string; x: number; y: number; at: number; until?: number; size?: number; color?: string; rot?: number}) => {
  const t = useT2(), p = usePop(at); if (p <= 0 || (until !== undefined && t >= until)) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot + Math.sin(t * 3) * 1}deg) scale(${p})`, fontFamily: HAND, fontSize: size, fontWeight: 700,
    color, whiteSpace: 'nowrap', lineHeight: 1, WebkitTextStroke: `${size * 0.035}px #fff`, paintOrder: 'stroke fill', textShadow: '0 0 1px #fff'}}>{text}</div>;
};

// Fish wallet: only shows when the count changes (then fades after `hold` s). steps = [time, count][] sorted.
export const Wallet = ({steps, hold = 2.4}: {steps: [number, number][]; hold?: number}) => {
  const t = useT2();
  const cur = [...steps].reverse().find(([a]) => t >= a);
  if (!cur) return null;
  const since = t - cur[0];
  if (since > hold) return null;
  const n = cur[1], o = Math.min(1, since / 0.12, (hold - since) / 0.3), kick = 1 + 0.25 * Math.exp(-since * 9);
  return <div style={{position: 'absolute', left: 46, top: 250, opacity: o, transform: `scale(${kick})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 12,
    background: '#fff', border: `5px solid ${INK}`, borderRadius: 26, padding: '8px 30px 8px 10px', boxShadow: '4px 6px 0 rgba(0,0,0,0.10)'}}>
    <svg width={140} height={74} viewBox="-150 -75 300 150"><FishShape t={t} rotten={0} /></svg>
    <div style={{fontFamily: HAND, fontSize: 92, color: n === 0 ? '#D83A2E' : INK, lineHeight: 1, fontWeight: 700}}>× {n}</div>
  </div>;
};

// Exchange rate used across the whole series so prices never contradict: 1 fish = $10.
export const FISH_USD = 10;
export const fishOf = (usd: number) => Math.round(usd / FISH_USD);
