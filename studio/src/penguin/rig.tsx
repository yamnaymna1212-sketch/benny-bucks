// Penguin world rig, drawn in the reference "primate economics" technique: thin uneven ink line, flat two-tone fills
// with interior crease lines, 3/4 turns, characters that hand things to each other, empty white stage.
// Our own cast (penguin from the user's ref, fish currency, seal landlord). Everything is alive: subtle line boil,
// breathing, blinking, wagging. Times are absolute seconds.
import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {FPS} from '../engine';

export const INK = '#161616';
export const ORANGE = '#F08A24';
const LW = 4.5; // thin pen line (viewBox units)

// Subtle hand-drawn line boil (re-jitters every 4 frames) so a held pose still feels drawn, never frozen.
export const Boil = ({id, amount = 1.8, freq = 0.03}: {id: string; amount?: number; freq?: number}) => {
  const seed = Math.floor(useCurrentFrame() / 4) % 7;
  return <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={2} seed={seed} />
    <feDisplacementMap in="SourceGraphic" scale={amount} xChannelSelector="R" yChannelSelector="G" />
  </filter>;
};

// Characters animate "on twos" (12 poses/s) like hand-drawn animation; the camera still moves every frame.
export const useT2 = () => Math.floor(useCurrentFrame() / 2) * 2 / FPS;
export const onTwos = (frame: number) => Math.floor(frame / 2) * 2 / FPS;
// Overshoot ease for flipper swings / pops (anticipation + settle).
export const back = (p: number) => { const c = 1.9; const q = Math.max(0, Math.min(1, p)) - 1; return 1 + (c + 1) * q * q * q + c * q * q; };

// Beak/mouth open amount while speaking (uneven syllables).
export const talk = (t: number, ranges: [number, number][]) => {
  for (const [a, b] of ranges) if (t >= a && t <= b) return Math.min(1, Math.abs(Math.sin(t * 17)) * (0.55 + 0.45 * Math.sin(t * 5.3 + 1)));
  return 0;
};

// ---------- Fish (currency, user's design) as an SVG group centred on (0,0), 300x150 units ----------
export const FishShape = ({t, rotten = 0, wag = 1}: {t: number; rotten?: number; wag?: number}) => {
  const c = (a: string, b: string) => interpolateColors(rotten, [0, 1], [a, b]);
  const tail = Math.sin(t * (10 - rotten * 7)) * 16 * wag * (1 - rotten * 0.7);
  return <g transform="translate(-150 -75)">
    <g transform={`rotate(${tail} 228 75)`}>
      <path d="M226 75 L286 30 C 292 28, 296 34, 292 40 L 268 75 L 292 112 C 296 118, 290 124, 284 120 Z" fill={c('#1A7FCC', '#5E8A3A')} stroke={INK} strokeWidth={LW + 1} strokeLinejoin="round" />
    </g>
    <path d="M118 42 L168 16 C 174 14, 178 18, 176 24 L 170 48 Z" fill={c('#1A7FCC', '#5E8A3A')} stroke={INK} strokeWidth={LW + 1} strokeLinejoin="round" />
    <path d="M22 66 C 60 26, 168 20, 232 66 C 236 72, 236 80, 232 86 C 168 128, 60 124, 22 84 L 46 76 Z" fill={c('#41A8EC', '#8DB360')} stroke={INK} strokeWidth={LW + 1} strokeLinejoin="round" />
    <path d="M34 88 C 80 112, 170 112, 226 84 C 170 122, 70 122, 34 88 Z" fill={c('#BEE3FA', '#C9DDA0')} />
    <path d="M102 86 L150 80 L128 108 Z" fill={c('#1A7FCC', '#5E8A3A')} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <circle cx={72} cy={62} r={17} fill="#fff" stroke={INK} strokeWidth={LW} />
    {rotten > 0.6 ? <path d="M64 54 L80 70 M80 54 L64 70" stroke={INK} strokeWidth={5} strokeLinecap="round" /> : <circle cx={73} cy={63} r={4.5} fill={INK} />}
    {rotten > 0.05 && [0, 1, 2].map((i) => { const ph = t * 3 + i * 2;
      return <path key={i} d={`M${110 + i * 45} 8 q 12 -14 0 -28 q -12 -14 0 -28 q 12 -14 0 -28`} transform={`translate(${Math.sin(ph) * 6} ${-((t * 30 + i * 20) % 30)})`}
        fill="none" stroke="#7FA34A" strokeWidth={6} strokeLinecap="round" opacity={rotten * (0.6 + 0.4 * Math.sin(ph))} />; })}
  </g>;
};

// Free-standing fish at (x,y), w px wide.
export const Fish = ({x, y, w = 200, rot = 0, flip, rotten = 0, id, seed = 0, wag = 1}: {x: number; y: number; w?: number; rot?: number; flip?: boolean; rotten?: number; id: string; seed?: number; wag?: number}) => {
  const t = useT2() + seed, k = w / 300, bend = Math.sin(t * 6 + 1) * 2.5 * wag;
  return <svg width={w} height={w * 0.5} viewBox="-150 -75 300 150" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.25, overflow: 'visible', transform: `rotate(${rot + bend}deg) scaleX(${flip ? -1 : 1})`}}>
    <defs><Boil id={id} amount={1.6 / k} /></defs>
    <g filter={`url(#${id})`}><FishShape t={t} rotten={rotten} wag={wag} /></g>
  </svg>;
};

// ---------- Penguin hero ----------
export type Brows = 'none' | 'happy' | 'worried' | 'angry' | 'shock';
export type PenguinPose = {
  mouth?: number; flapL?: number; flapR?: number; look?: [number, number]; brows?: Brows; turn?: number;
  eyeScale?: number; pupil?: number; walk?: number | null; lean?: number; squash?: number; tremble?: number; holding?: boolean;
};

// (x, y) = point between the feet; h = height px. turn: 0 = front, +1 = 3/4 facing right (-1 left).
export type Outfit = 'none' | 'rich' | 'banker' | 'burglar' | 'worker';
export const Penguin = ({x, y, h = 520, id = 'pg', seed = 0, pose = {}, outfit = 'none'}: {x: number; y: number; h?: number; id?: string; seed?: number; pose?: PenguinPose; outfit?: Outfit}) => {
  const t = useT2() + seed;
  const {mouth = 0, flapL = 6, flapR = 6, look = [0, 0], brows = 'none', turn = 0, eyeScale = 1, pupil = 1, walk = null, lean = 0, squash = 0, tremble = 0, holding} = pose;
  const k = h / 520, w = 400 * k;
  const breathe = 1 + 0.014 * Math.sin(t * 2.6);
  const blink = (t % 3.3) < 0.12 && eyeScale <= 1 ? 0.08 : 1;
  let rot = lean, bob = 0, liftL = 0, liftR = 0;
  if (walk !== null) { const s = Math.sin(walk * Math.PI * 2); rot += s * 6; bob = -Math.abs(s) * 14; liftL = Math.max(0, s) * 16; liftR = Math.max(0, -s) * 16; }
  const tr = tremble ? Math.sin(t * 70) * 3 * tremble : 0;
  const sy = breathe * (1 - squash * 0.12), sx = 1 + squash * 0.1;
  const dx = turn * 42, nar = 1 - Math.abs(turn) * 0.18; // face features slide toward the facing side
  const er = 34 * eyeScale, pr = 7 * pupil;
  const eye = (cx: number, far: boolean) => <g transform={`translate(${cx} 190) scale(${far ? 1 - Math.abs(turn) * 0.25 : 1} ${blink})`}>
    <ellipse rx={er} ry={er * 1.1} fill="#fff" stroke={INK} strokeWidth={LW} />
    <circle cx={look[0] * er * 0.45 + turn * 6} cy={look[1] * er * 0.45} r={pr} fill={INK} />
  </g>;
  const browPath: Record<Brows, string> = {
    none: '', happy: 'M122 132 Q152 114 182 128 M218 128 Q248 114 278 132', worried: 'M124 140 L180 124 M220 124 L276 140',
    angry: 'M124 122 L180 140 M220 140 L276 122', shock: 'M120 120 Q152 98 184 114 M216 114 Q248 98 280 120',
  };
  const flipper = (a: number, hold: boolean) => <g transform={`rotate(${-a})`}>
    <path d="M-8 0 C 20 30, 40 110, 36 172 C 34 182, 22 183, 18 174 C 10 120, -6 60, -22 14 Z" fill="#1F1F1F" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M2 30 C 14 70, 22 110, 24 150" fill="none" stroke="#454545" strokeWidth={6} strokeLinecap="round" />
    {hold && <g transform="translate(26 196) rotate(90) scale(0.42)"><FishShape t={t} /></g>}
  </g>;
  const foot = (fx: number, lift: number) => <path transform={`translate(${fx + turn * 22} ${500 - lift})`}
    d="M-36 6 L-12 -10 L12 -10 L36 6 L15 1 L0 8 L-15 1 Z" fill={ORANGE} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />;
  const o = mouth, bx = 200 + turn * 58;
  const nearR = turn > 0.3, nearL = turn < -0.3;
  return <svg width={w} height={h} viewBox="0 0 400 520" style={{position: 'absolute', left: x - w / 2 + tr, top: y - h + bob * k, overflow: 'visible'}}>
    <defs><Boil id={id} amount={1.8 / k} /></defs>
    <g filter={`url(#${id})`} transform={`rotate(${rot} 200 500) translate(200 500) scale(${sx} ${sy}) translate(-200 -500)`}>
      {foot(152, liftL)}{foot(248, liftR)}
      {!nearL && <g transform={`translate(${64 + Math.max(0, turn) * 30} 228) scale(-1 1)`}>{flipper(flapL, false)}</g>}
      {!nearR && <g transform={`translate(${336 + Math.min(0, turn) * 30} 228)`}>{flipper(flapR, !!holding)}</g>}
      <path d="M200 40 C 288 40, 330 150, 344 290 C 360 420, 314 494, 200 494 C 86 494, 40 420, 56 290 C 70 150, 112 40, 200 40 Z" fill="#1F1F1F" stroke={INK} strokeWidth={LW} />
      <path d="M100 150 C 74 230, 66 330, 84 430 C 74 340, 82 240, 114 160 Z" fill="#3A3A3A" />
      <g transform={`translate(${200 + dx} 0) scale(${nar} 1) translate(-200 0)`}>
        <path d="M200 98 C 268 98, 300 174, 304 300 C 308 408, 266 468, 200 468 C 134 468, 92 408, 96 300 C 100 174, 132 98, 200 98 Z" fill="#fff" stroke={INK} strokeWidth={LW - 1} />
        <path d="M282 220 C 298 290, 296 380, 262 446 C 286 380, 290 300, 274 226 Z" fill="#E8E8E8" />
        <path d="M150 420 q 14 10 28 0 M206 434 q 14 10 28 0" fill="none" stroke="#BDBDBD" strokeWidth={4} strokeLinecap="round" />
      </g>
      {outfit === 'burglar' && <path d={`M${96 + dx} 150 Q200 136 ${304 + dx} 150 L${306 + dx} 226 Q200 212 ${94 + dx} 226 Z`} fill="#111" />}
      {outfit !== 'rich' && outfit !== 'worker' && <g transform={`rotate(${Math.sin(t * 3.1) * 6 + rot * 1.5} ${200 + dx * 0.5} 44)`}>
        <path d={`M${196 + dx * 0.5} 44 C ${188 + dx * 0.5} 16, 172 6, 162 12 M${200 + dx * 0.5} 44 C ${200 + dx * 0.5} 12, 214 -2, 226 4 M${204 + dx * 0.5} 44 C ${218 + dx * 0.5} 24, 240 24, 246 34`} fill="none" stroke={INK} strokeWidth={LW + 1} strokeLinecap="round" />
      </g>}
      {eye(154 + dx, turn > 0.3)}{eye(246 + dx, turn < -0.3)}
      {brows !== 'none' && <g transform={`translate(${dx} 0)`}><path d={browPath[brows]} fill="none" stroke="#fff" strokeWidth={LW + 6} strokeLinecap="round" />
        <path d={browPath[brows]} fill="none" stroke={INK} strokeWidth={LW + 1} strokeLinecap="round" /></g>}
      <g transform={`translate(${bx - 200} 0)`}>
        {o > 0.02 && <ellipse cx={200} cy={250 + o * 14} rx={36} ry={o * 20} fill="#7A1F1F" />}
        <path d={`M156 ${250 + o * 26} Q200 ${262 + o * 38} 244 ${250 + o * 26} Q200 ${254 + o * 30} 156 ${250 + o * 26} Z`} fill={ORANGE} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d={`M${146 - Math.min(0, turn) * 30} 246 Q200 230 ${254 + Math.max(0, turn) * 30} 246 Q200 260 ${146 - Math.min(0, turn) * 30} 246 Z`} fill={ORANGE} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
      </g>
      <OutfitLayer outfit={outfit} dx={dx} t={t} />
      {nearR && <g transform={`translate(${300 + turn * 20} 232)`}>{flipper(flapR, !!holding)}</g>}
      {nearL && <g transform={`translate(${100 + turn * 20} 232) scale(-1 1)`}>{flipper(flapL, !!holding)}</g>}
    </g>
  </svg>;
};

// Accessories that tell the viewer who a penguin is at a glance (like the reference's top hat / shirt+tie / mask).
const OutfitLayer = ({outfit, dx, t}: {outfit: Outfit; dx: number; t: number}) => {
  const hx = 200 + dx * 0.5, wob = Math.sin(t * 2.4) * 1.5;
  if (outfit === 'rich') return <g>
    <g transform={`rotate(${wob} ${hx} 60)`}>
      <ellipse cx={hx} cy={62} rx={96} ry={16} fill="#111" stroke={INK} strokeWidth={LW} />
      <path d={`M${hx - 62} 60 L${hx - 56} -66 Q${hx} -76 ${hx + 56} -66 L${hx + 62} 60 Z`} fill="#111" stroke={INK} strokeWidth={LW} />
      <path d={`M${hx - 60} 30 L${hx + 60} 30 L${hx + 61} 50 L${hx - 61} 50 Z`} fill="#D83A2E" />
    </g>
    <circle cx={246 + dx} cy={190} r={44} fill="none" stroke="#E2B13C" strokeWidth={6} />
    <path d={`M${288 + dx} 204 Q 310 280 ${290 + dx} 330`} fill="none" stroke="#E2B13C" strokeWidth={3} />
    <path d={`M${200 + dx} 300 L${150 + dx} 276 L${150 + dx} 326 Z M${200 + dx} 300 L${250 + dx} 276 L${250 + dx} 326 Z`} fill="#D83A2E" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <circle cx={200 + dx} cy={300} r={11} fill="#B42A20" stroke={INK} strokeWidth={LW} />
  </g>;
  if (outfit === 'banker') return <g>
    <circle cx={154 + dx} cy={190} r={44} fill="none" stroke={INK} strokeWidth={5} /><circle cx={246 + dx} cy={190} r={44} fill="none" stroke={INK} strokeWidth={5} />
    <path d={`M${198 + dx} 186 L${202 + dx} 186`} stroke={INK} strokeWidth={6} />
    <path d={`M${186 + dx} 288 L${214 + dx} 288 L${208 + dx} 306 L${222 + dx} 396 L${200 + dx} 418 L${178 + dx} 396 L${192 + dx} 306 Z`} fill="#2F5DA8" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
  </g>;
  if (outfit === 'worker') return <g transform={`rotate(${wob} ${hx} 60)`}>
    <path d={`M${hx - 100} 70 Q${hx} 40 ${hx + 100} 70 Q${hx + 70} -20 ${hx} -22 Q${hx - 70} -20 ${hx - 100} 70 Z`} fill="#F2C230" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <path d={`M${hx - 16} -20 L${hx - 10} 52 M${hx + 16} -20 L${hx + 10} 52`} stroke="#C9971A" strokeWidth={6} />
  </g>;
  return null;
};

// ---------- Seal landlord: side view facing left, two-tone grey, deadpan dot eyes, red tie ----------
export const Seal = ({x, y, h = 330, id = 'seal', mouth = 0, flap = 0, smug = false}: {x: number; y: number; h?: number; id?: string; mouth?: number; flap?: number; smug?: boolean}) => {
  const t = useT2() + 1.7;
  const k = h / 360, w = 520 * k, br = 1 + 0.012 * Math.sin(t * 2.2);
  const blink = (t % 4.1) < 0.12 ? 0.1 : 1, hb = Math.sin(t * 1.6) * 3;
  const wh = Math.sin(t * 7) * 2;
  return <svg width={w} height={h} viewBox="0 0 520 360" style={{position: 'absolute', left: x - w / 2, top: y - h, overflow: 'visible'}}>
    <defs><Boil id={id} amount={1.8 / k} /></defs>
    <g filter={`url(#${id})`} transform={`translate(0 352) scale(1 ${br}) translate(0 -352)`}>
      <path d="M470 330 L515 300 C 520 296, 524 304, 520 310 L 500 340 L 518 352 L 466 352 Z" fill="#7C838A" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
      <path d="M90 230 C 100 170, 170 150, 240 160 C 330 172, 410 230, 470 300 C 486 320, 486 352, 460 352 L 150 352 C 100 352, 82 300, 90 230 Z" fill="#8E959C" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
      <path d="M120 300 C 200 330, 330 340, 455 344 C 440 352, 200 352, 140 346 Z" fill="#C3C8CD" />
      <path d="M260 200 q 30 10 50 30 M300 190 q 30 14 46 36" fill="none" stroke="#6E757C" strokeWidth={4} strokeLinecap="round" />
      <g transform={`translate(0 ${hb})`}>
        <path d="M58 170 C 50 100, 110 66, 160 80 C 214 96, 226 160, 200 214 C 180 250, 90 252, 66 214 C 60 202, 58 186, 58 170 Z" fill="#8E959C" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M70 196 C 92 228, 160 236, 196 206 C 176 244, 96 246, 70 196 Z" fill="#C3C8CD" />
        <ellipse cx={98} cy={140} rx={7} ry={7 * blink} fill={INK} /><ellipse cx={146} cy={136} rx={7} ry={7 * blink} fill={INK} />
        {smug && <path d="M86 126 L110 132 M134 130 L158 124" stroke={INK} strokeWidth={LW} strokeLinecap="round" />}
        <ellipse cx={110} cy={168} rx={16} ry={11} fill={INK} />
        <path d={`M92 ${190 + mouth * 4} Q112 ${196 + mouth * 18} 132 ${190 + mouth * 4}`} fill={mouth > 0.1 ? '#7A1F1F' : 'none'} stroke={INK} strokeWidth={LW} strokeLinecap="round" />
        {[-1, 0, 1].map((i) => <path key={i} d={`M88 ${172 + i * 9} L52 ${168 + i * 16 + wh}`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />)}
        {[-1, 0, 1].map((i) => <path key={`r${i}`} d={`M134 ${172 + i * 9} L170 ${168 + i * 16 - wh}`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />)}
      </g>
      <path d="M150 232 L170 228 L166 246 L176 292 L158 304 L148 290 L156 246 Z" fill="#D83A2E" stroke={INK} strokeWidth={LW - 0.5} strokeLinejoin="round" />
      <g transform={`rotate(${-flap} 190 290)`}><path d="M190 290 C 170 310, 150 340, 170 350 C 196 352, 214 320, 214 296 Z" fill="#7C838A" stroke={INK} strokeWidth={LW} strokeLinejoin="round" /></g>
    </g>
  </svg>;
};

// Hand-lettered wooden stand (like the reference's BANANA stand). x = centre, y = ground. Character goes behind it.
export const Stand = ({x, y, label, id = 'stand', w = 420, h = 600, counter = 190, children}: {x: number; y: number; label: string; id?: string; w?: number; h?: number; counter?: number; children?: React.ReactNode}) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: x - w / 2, top: y - h, overflow: 'visible'}}>
    <defs><Boil id={id} amount={1.8} /></defs>
    <g filter={`url(#${id})`}>
      <rect x={18} y={Math.min(170, w * 0.42)} width={14} height={h - Math.min(170, w * 0.42)} fill="#9A6A35" stroke={INK} strokeWidth={LW} />
      <rect x={w - 32} y={Math.min(170, w * 0.42)} width={14} height={h - Math.min(170, w * 0.42)} fill="#9A6A35" stroke={INK} strokeWidth={LW} />
      <path d={`M4 8 L${w - 4} 4 L${w - 2} 176 L2 180 Z`.replace(/176|180/g, (m) => m === "176" ? String(Math.min(176, w * 0.44)) : String(Math.min(180, w * 0.45)))} fill="#C8924E" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
      <text x={w / 2} y={Math.min(92, w * 0.22)} textAnchor="middle" dominantBaseline="middle" fontFamily="Architects Daughter" fontSize={Math.min(w * 0.3, (w * 1.5) / Math.max(1, label.length))} fill={INK}>{label}</text>
      {children}
      <path d={`M0 ${h - counter} L${w} ${h - counter - 4} L${w} ${h - counter + 18} L0 ${h - counter + 22} Z`} fill="#B07A3E" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    </g>
  </svg>
);

// Small hand-written line that pops above a character (reference style: no bubble box).
export const Line = ({text, x, y, at, until, t, size = 50}: {text: string; x: number; y: number; at: number; until?: number; t: number; size?: number}) => {
  if (t < at || (until !== undefined && t >= until)) return null;
  const p = Math.min(1, (t - at) / 0.15);
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * p})`, opacity: p, fontFamily: 'Architects Daughter', fontSize: size, color: INK, whiteSpace: 'nowrap', fontWeight: 700}}>{text}</div>;
};

// Water impact (kept for stories that need the sea): ripple rings + droplets.
export const Splash = ({x, y, at}: {x: number; y: number; at: number}) => {
  const t = useCurrentFrame() / FPS - at;
  if (t < 0 || t > 1.6) return null;
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    {[0, 0.25, 0.5].map((d, i) => { const p = t - d; if (p < 0) return null;
      return <ellipse key={i} cx={x} cy={y} rx={30 + p * 260} ry={8 + p * 50} fill="none" stroke={INK} strokeWidth={4 * Math.max(0, 1 - p / 1.1)} opacity={Math.max(0, 1 - p / 1.1)} />; })}
    {t < 0.8 && [-3, -2, -1, 1, 2, 3].map((k) => { const vx = k * 70, vy = -620 + Math.abs(k) * 60;
      return <ellipse key={k} cx={x + vx * t} cy={y + vy * t + 1400 * t * t} rx={10} ry={14} fill="#8CCBEA" stroke={INK} strokeWidth={3.5} />; })}
  </svg>;
};
