// Penguin world rig: every piece is alive (hand-drawn "line boil", breathing, blinking, wiggling, bobbing).
// All characters are drawn in code so they stay identical across episodes. Times are absolute seconds.
import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {FPS} from '../engine';

export const INK = '#1A1A1A';
export const ORANGE = '#F28C28';
const LW = 7; // line weight (viewBox units)

// Hand-drawn line boil: the outline re-jitters every 4 frames, like a real drawn animation, even when nothing moves.
export const Boil = ({id, amount = 3.2, freq = 0.025}: {id: string; amount?: number; freq?: number}) => {
  const seed = Math.floor(useCurrentFrame() / 4) % 7;
  return <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={2} seed={seed} />
    <feDisplacementMap in="SourceGraphic" scale={amount} xChannelSelector="R" yChannelSelector="G" />
  </filter>;
};

// Talking: beak open amount while speaking (natural, uneven syllables).
export const talk = (t: number, ranges: [number, number][]) => {
  for (const [a, b] of ranges) if (t >= a && t <= b) return Math.min(1, Math.abs(Math.sin(t * 17)) * (0.55 + 0.45 * Math.sin(t * 5.3 + 1)));
  return 0;
};

export type Brows = 'none' | 'happy' | 'worried' | 'angry' | 'shock';
export type PenguinPose = {
  mouth?: number; flapL?: number; flapR?: number; look?: [number, number]; brows?: Brows;
  eyeScale?: number; pupil?: number; walk?: number | null; lean?: number; squash?: number; tremble?: number;
};

// The hero penguin. (x, y) = point between the feet. h = height in px.
export const Penguin = ({x, y, h = 650, flip, id = 'pg', seed = 0, pose = {}}: {x: number; y: number; h?: number; flip?: boolean; id?: string; seed?: number; pose?: PenguinPose}) => {
  const t = useCurrentFrame() / FPS + seed;
  const {mouth = 0, flapL = 8, flapR = 8, look = [0, 0], brows = 'none', eyeScale = 1, pupil = 1, walk = null, lean = 0, squash = 0, tremble = 0} = pose;
  const k = h / 520, w = 400 * k;
  const breathe = 1 + 0.014 * Math.sin(t * 2.6);
  const blink = (t % 3.3) < 0.12 && eyeScale <= 1 ? 0.08 : 1;
  let rot = lean, bob = 0, liftL = 0, liftR = 0;
  if (walk !== null) {
    const s = Math.sin(walk * Math.PI * 2);
    rot += s * 7; bob = -Math.abs(s) * 16; liftL = Math.max(0, s) * 18; liftR = Math.max(0, -s) * 18;
  }
  const tr = tremble ? Math.sin(t * 70) * 3 * tremble : 0;
  const sy = breathe * (1 - squash * 0.12), sx = 1 + squash * 0.1;
  const er = 38 * eyeScale, pr = 8 * pupil;
  const eye = (cx: number) => <g transform={`translate(${cx} 188) scale(1 ${blink})`}>
    <ellipse cx={0} cy={0} rx={er} ry={er * 1.08} fill="#fff" stroke={INK} strokeWidth={LW - 1} />
    <circle cx={look[0] * er * 0.45} cy={look[1] * er * 0.45} r={pr} fill={INK} />
  </g>;
  const browPath: Record<Brows, string> = {
    none: '', happy: 'M118 130 Q155 108 190 126 M210 126 Q245 108 282 130', worried: 'M120 140 L186 120 M214 120 L280 140',
    angry: 'M122 118 L188 140 M212 140 L278 118', shock: 'M115 112 Q155 88 192 108 M208 108 Q245 88 285 112',
  };
  const flipper = (a: number) => <g transform={`rotate(${-a})`}>
    <path d="M-8 0 C 20 30, 42 110, 38 175 C 36 186, 22 187, 18 176 C 10 120, -6 60, -22 14 Z" fill={INK} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
  </g>;
  const foot = (fx: number, lift: number) => <path transform={`translate(${fx} ${500 - lift})`}
    d="M-38 6 L-12 -12 L12 -12 L38 6 L16 1 L0 8 L-16 1 Z" fill={ORANGE} stroke={INK} strokeWidth={LW - 2} strokeLinejoin="round" />;
  const o = mouth;
  return <svg width={w} height={h} viewBox="0 0 400 520" style={{position: 'absolute', left: x - w / 2 + tr, top: y - h + bob * k, overflow: 'visible'}}>
    <defs><Boil id={id} /></defs>
    <g filter={`url(#${id})`} transform={`${flip ? 'translate(400 0) scale(-1 1)' : ''} rotate(${rot} 200 500) translate(200 500) scale(${sx} ${sy}) translate(-200 -500)`}>
      {foot(150, liftL)}{foot(250, liftR)}
      <g transform="translate(66 225) scale(-1 1)">{flipper(flapL)}</g>
      <g transform="translate(334 225)">{flipper(flapR)}</g>
      <path d="M200 38 C 302 38, 348 160, 352 300 C 356 420, 302 492, 200 492 C 98 492, 44 420, 48 300 C 52 160, 98 38, 200 38 Z" fill={INK} />
      <path d="M200 96 C 272 96, 306 172, 310 300 C 314 410, 270 470, 200 470 C 130 470, 86 410, 90 300 C 94 172, 128 96, 200 96 Z" fill="#fff" stroke={INK} strokeWidth={2} />
      <g transform={`rotate(${Math.sin(t * 3.1) * 6 + rot * 1.5} 200 42)`}>
        <path d="M196 44 C 188 14, 170 4, 160 10 M200 44 C 200 10, 214 -4, 226 2 M204 44 C 218 22, 240 22, 246 32" fill="none" stroke={INK} strokeWidth={LW} strokeLinecap="round" />
      </g>
      {eye(152)}{eye(248)}
      {brows !== 'none' && <><path d={browPath[brows]} fill="none" stroke="#fff" strokeWidth={LW + 7} strokeLinecap="round" />
        <path d={browPath[brows]} fill="none" stroke={INK} strokeWidth={LW} strokeLinecap="round" /></>}
      {o > 0.02 && <ellipse cx={200} cy={250 + o * 14} rx={40} ry={o * 22} fill="#7A1F1F" />}
      <path d={`M152 ${250 + o * 26} Q200 ${262 + o * 40} 248 ${250 + o * 26} Q200 ${254 + o * 30} 152 ${250 + o * 26} Z`} fill={ORANGE} stroke={INK} strokeWidth={LW - 2} strokeLinejoin="round" />
      <path d="M142 246 Q200 230 258 246 Q200 260 142 246 Z" fill={ORANGE} stroke={INK} strokeWidth={LW - 2} strokeLinejoin="round" />
    </g>
  </svg>;
};

// The currency: a blue fish (user's design). rotten 0..1 turns it green with stink lines + a fly. Tail always wags.
export const Fish = ({x, y, w = 220, rot = 0, flip, rotten = 0, id, seed = 0, wag = 1}: {x: number; y: number; w?: number; rot?: number; flip?: boolean; rotten?: number; id: string; seed?: number; wag?: number}) => {
  const t = useCurrentFrame() / FPS + seed;
  const c = (a: string, b: string) => interpolateColors(rotten, [0, 1], [a, b]);
  const tail = Math.sin(t * (10 - rotten * 7)) * 16 * wag * (1 - rotten * 0.7);
  const bend = Math.sin(t * 6 + 1) * 2.5 * wag;
  const h = w * 0.5;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot + bend}deg) scaleX(${flip ? -1 : 1})`}}>
    <svg width={w} height={h} viewBox="0 0 300 150" style={{overflow: 'visible'}}>
      <defs><Boil id={id} amount={2.6} /></defs>
      <g filter={`url(#${id})`}>
        <g transform={`rotate(${tail} 228 75)`}>
          <path d="M226 75 L286 30 C 292 28, 296 34, 292 40 L 268 75 L 292 112 C 296 118, 290 124, 284 120 Z" fill={c('#1A7FCC', '#5E8A3A')} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        </g>
        <path d="M118 42 L168 16 C 174 14, 178 18, 176 24 L 170 48 Z" fill={c('#1A7FCC', '#5E8A3A')} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M22 66 C 60 26, 168 20, 232 66 C 236 72, 236 80, 232 86 C 168 128, 60 124, 22 84 L 46 76 Z" fill={c('#41A8EC', '#8DB360')} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M34 88 C 80 112, 170 112, 226 84 C 170 122, 70 122, 34 88 Z" fill={c('#BEE3FA', '#C9DDA0')} />
        <path d="M102 86 L150 80 L128 108 Z" fill={c('#1A7FCC', '#5E8A3A')} stroke={INK} strokeWidth={LW - 1} strokeLinejoin="round" />
        <circle cx={72} cy={62} r={17} fill="#fff" stroke={INK} strokeWidth={LW - 1} />
        {rotten > 0.6 ? <path d="M64 54 L80 70 M80 54 L64 70" stroke={INK} strokeWidth={5} strokeLinecap="round" /> : <circle cx={73} cy={63} r={4.5} fill={INK} />}
      </g>
      {rotten > 0.05 && [0, 1, 2].map((i) => {
        const ph = t * 3 + i * 2;
        return <path key={i} d={`M${110 + i * 45} ${8 - 10 * i % 2} q 12 -14 0 -28 q -12 -14 0 -28 q 12 -14 0 -28`} transform={`translate(${Math.sin(ph) * 6} ${-((t * 30 + i * 20) % 30)})`}
          fill="none" stroke="#7FA34A" strokeWidth={6} strokeLinecap="round" opacity={rotten * (0.6 + 0.4 * Math.sin(ph))} />;
      })}
    </svg>
    {rotten > 0.3 && <Fly cx={w * 0.5} cy={-h * 0.4} r={w * 0.35} t={t} o={rotten} />}
  </div>;
};

export const Fly = ({cx, cy, r, t, o = 1}: {cx: number; cy: number; r: number; t: number; o?: number}) => {
  const a = t * 5.5, fx = cx + Math.cos(a) * r, fy = cy + Math.sin(a * 2.1) * r * 0.4;
  const flap = Math.sin(t * 90) > 0 ? 1 : 0.4;
  return <svg width={40} height={30} viewBox="0 0 40 30" style={{position: 'absolute', left: fx - 20, top: fy - 15, opacity: o, overflow: 'visible'}}>
    <ellipse cx={14} cy={8} rx={8} ry={7 * flap} fill="#E9F3FA" stroke={INK} strokeWidth={2} />
    <ellipse cx={26} cy={8} rx={8} ry={7 * flap} fill="#E9F3FA" stroke={INK} strokeWidth={2} />
    <circle cx={20} cy={18} r={7} fill={INK} />
  </svg>;
};

// Sea: light-blue water whose hand-drawn surface line keeps rolling. top = water line in px.
export const Sea = ({top, id = 'sea'}: {top: number; id?: string}) => {
  const t = useCurrentFrame() / FPS;
  const pts: string[] = [];
  for (let x = -100; x <= 1180; x += 40) pts.push(`${x},${top + Math.sin(x * 0.012 + t * 2.2) * 10 + Math.sin(x * 0.031 - t * 3.1) * 4}`);
  const line = `M${pts.join(' L')}`;
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <defs><Boil id={id} amount={3} /></defs>
    <g filter={`url(#${id})`}>
      <path d={`${line} L1180,2400 L-100,2400 Z`} fill="#D3EEFB" />
      <path d={line} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5].map((i) => { const xx = ((i * 211 + t * 40) % 1300) - 110, yy = top + 120 + (i % 3) * 140;
        return <path key={i} d={`M${xx} ${yy} q 25 -14 50 0 q 25 14 50 0`} fill="none" stroke="#8CCBEA" strokeWidth={5} strokeLinecap="round" />; })}
    </g>
  </svg>;
};

// Ice floe the penguin stands on; bobs on the water. Children ride along with it.
export const IceFloe = ({x, top, w = 780, id = 'ice', children}: {x: number; top: number; w?: number; id?: string; children?: React.ReactNode}) => {
  const t = useCurrentFrame() / FPS;
  const dy = Math.sin(t * 1.9) * 7, r = Math.sin(t * 1.3) * 0.8;
  return <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${dy}px) rotate(${r}deg)`, transformOrigin: `${x}px ${top}px`}}>
    <svg width={w} height={150} viewBox={`0 0 ${w} 150`} style={{position: 'absolute', left: x - w / 2, top: top - 20, overflow: 'visible'}}>
      <defs><Boil id={id} amount={3} /></defs>
      <g filter={`url(#${id})`}>
        <path d={`M30 20 L${w - 40} 14 L${w - 6} 60 L${w - 60} 128 L70 134 L8 70 Z`} fill="#E3F4FC" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d={`M30 20 L${w - 40} 14 L${w - 20} 40 L20 46 Z`} fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M${w * 0.3} 70 l 40 30 M${w * 0.62} 64 l -30 34`} stroke="#9AD3EE" strokeWidth={5} strokeLinecap="round" />
      </g>
    </svg>
    {children}
  </div>;
};

// Water impact: expanding ripple rings + droplets. at = impact time.
export const Splash = ({x, y, at}: {x: number; y: number; at: number}) => {
  const t = useCurrentFrame() / FPS - at;
  if (t < 0 || t > 1.6) return null;
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    {[0, 0.25, 0.5].map((d, i) => { const p = t - d; if (p < 0) return null;
      return <ellipse key={i} cx={x} cy={y} rx={30 + p * 260} ry={8 + p * 50} fill="none" stroke={INK} strokeWidth={5 * Math.max(0, 1 - p / 1.1)} opacity={Math.max(0, 1 - p / 1.1)} />; })}
    {t < 0.8 && [-3, -2, -1, 1, 2, 3].map((k) => { const vx = k * 70, vy = -620 + Math.abs(k) * 60;
      return <ellipse key={k} cx={x + vx * t} cy={y + vy * t + 1400 * t * t} rx={11} ry={15} fill="#8CCBEA" stroke={INK} strokeWidth={4} />; })}
  </svg>;
};

// Gentle falling snow: the frame is never frozen.
export const Snow = ({n = 26}: {n?: number}) => {
  const t = useCurrentFrame() / FPS;
  return <>{Array.from({length: n}, (_, i) => {
    const sp = 40 + (i * 37) % 50, x = (i * 173) % 1080 + Math.sin(t * 0.9 + i) * 30, y = ((i * 311) % 2000 + t * sp) % 2000 - 60;
    return <div key={i} style={{position: 'absolute', left: x, top: y, width: 10 + (i % 3) * 4, height: 10 + (i % 3) * 4, borderRadius: '50%', background: '#DCEBF5'}} />;
  })}</>;
};
