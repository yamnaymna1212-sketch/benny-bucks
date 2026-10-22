// Trial episode (one-off, user 2026-10-22): the user's own "floating islands" image style (agentstick look).
// The user's image is cut into 3 pieces (USA island / scale / Russia island, studio/public/enemy-oil/*.png) that move
// on their own; Doug + his flag stand in the middle like "Bob"; one big word in the centre, word by word with the voice.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts} from '../base';
import {INK, Penguin, onTwos, talk} from '../penguin/rig';
import {Sfx} from '../penguin/edit';
import {Bill} from './dougLaundering';

export const DOUG_ENEMY_OIL_HOOK_SECONDS = 5;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const RED = '#D83A2E';
const DY = 60; // whole picture pushed down a little (TikTok top bar)

// spoken words (syllable-aligned to the voice)
const WORDS: [number, string, string?][] = [
  [0, 'WHY'], [0.19, 'DO'], [0.38, 'RICH'], [0.56, 'COUNTRIES'], [0.94, 'KEEP'], [1.13, 'BUYING'], [1.5, 'OIL'], [1.69, 'FROM'],
  [1.88, 'COUNTRIES'], [2.25, 'THEY'], [2.44, 'CALL'], [2.63, 'ENEMIES?', RED], [3.24, 'THERE ARE'], [3.55, '3', RED], [3.75, 'REASONS', RED],
];
const T = {rich: 0.38, buying: 1.13, oil: 1.5, enemies: 2.63, three: 3.55, end: 4.16};

// pop 1 -> 1.08 -> 1 at time `at`
const pop = (t: number, at: number) => t < at ? 1 : 1 + 0.08 * Math.sin(cl((t - at) / 0.35) * Math.PI);

const Piece = ({src, x, y, w, t, phase, s = 1, rot = 0, shake = 0}: {src: string; x: number; y: number; w: number; t: number; phase: number; s?: number; rot?: number; shake?: number}) =>
  <Img src={staticFile(`enemy-oil/${src}.png`)} style={{position: 'absolute', left: x + shake, top: y + DY + Math.sin(t * 1.8 + phase) * 6, width: w,
    transform: `scale(${s}) rotate(${rot}deg)`, transformOrigin: '50% 90%'}} />;

const BigWord = ({t}: {t: number}) => {
  const i = WORDS.findIndex((w, k) => t >= w[0] && t < (WORDS[k + 1]?.[0] ?? 99));
  if (i < 0) return null;
  const [at, text, color = INK] = WORDS[i], d = t - at, s = d < 0.1 ? 1.12 - 0.12 * (d / 0.1) : 1;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 830 + DY, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontStyle: 'italic',
    fontSize: Math.min(190, 1150 / text.length), lineHeight: 1, letterSpacing: -4, color, transform: `scale(${s}) skewX(-6deg)`}}>{text}</div>;
};

// Doug's own flag: blue with a white fish (the channel's money).
const DougFlag = ({x, y, t}: {x: number; y: number; t: number}) => {
  const w = Math.sin(t * 5) * 4;
  return <svg width={260} height={760} viewBox="0 0 260 760" style={{position: 'absolute', left: x, top: y - 760, overflow: 'visible'}}>
    <line x1={8} y1={10} x2={8} y2={760} stroke={INK} strokeWidth={10} /><circle cx={8} cy={10} r={12} fill="#F5C518" stroke={INK} strokeWidth={4} />
    <g transform={`translate(14 ${24 + w}) skewY(${w})`}>
      <rect width={230} height={150} fill="#2F7FD8" stroke={INK} strokeWidth={6} />
      <path d="M60 75 C 90 40, 150 40, 175 75 C 150 110, 90 110, 60 75 Z M60 75 L30 50 L30 100 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={150} cy={68} r={6} fill={INK} />
    </g>
  </svg>;
};

const OilBarrel = ({x, y, s = 1}: {x: number; y: number; s?: number}) => <svg width={70 * s} height={90 * s} viewBox="0 0 70 90" style={{position: 'absolute', left: x - 35 * s, top: y - 45 * s, overflow: 'visible'}}>
  <rect x={3} y={3} width={64} height={84} rx={10} fill="#262626" stroke={INK} strokeWidth={5} />
  <line x1={3} y1={30} x2={67} y2={30} stroke="#666" strokeWidth={5} /><line x1={3} y1={60} x2={67} y2={60} stroke="#666" strokeWidth={5} />
  <path d="M35 36 C 28 46, 28 52, 35 54 C 42 52, 42 46, 35 36 Z" fill="#fff" />
</svg>;

// object flying on an arc between (x1,y1) and (x2,y2) from time a, for d seconds
const fly = (t: number, a: number, d: number, x1: number, y1: number, x2: number, y2: number, arc = 180) => {
  const p = (t - a) / d; if (p < 0 || p > 1) return null;
  return {x: lerp(x1, x2, p), y: lerp(y1, y2, p) - Math.sin(p * Math.PI) * arc, p};
};

const Hook = ({t}: {t: number}) => {
  const usaS = pop(t, T.rich), ruS = pop(t, T.enemies);
  const tilt = t < T.buying ? 0 : Math.sin((t - T.buying) * 7) * 6 * Math.exp(-(t - T.buying) * 1.2);
  const enemy = t >= T.enemies;
  const side = t < T.buying ? -1 : t < T.enemies - 0.4 ? 0 : t < 3.24 ? 1 : 0;
  return <>
    {/* red danger glow behind Russia on "enemies" */}
    {enemy && <div style={{position: 'absolute', left: 640, top: 200 + DY, width: 520, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(216,58,46,0.35), rgba(216,58,46,0))',
      opacity: 0.6 + 0.4 * Math.sin((t - T.enemies) * 10)}} />}
    <Piece src="usa" x={0} y={195} w={383} t={t} phase={0} s={usaS} shake={enemy && t < T.enemies + 0.5 ? Math.sin(t * 60) * 4 : 0} />
    <Piece src="russia" x={718} y={124} w={362} t={t} phase={2} s={ruS} />
    <Piece src="scale" x={383} y={247} w={335} t={t} phase={4} rot={tilt} />
    {/* money flies USA -> Russia, oil flies Russia -> USA */}
    {[0, 1, 2].map((i) => { const f = fly(t, T.buying + i * 0.13, 0.6, 170, 480 + DY, 930, 520 + DY); return f && <Bill key={i} x={f.x} y={f.y} w={130} rot={f.p * 360} />; })}
    {(() => { const f = fly(t, T.oil, 0.6, 930, 520 + DY, 200, 520 + DY, 140); return f && <OilBarrel x={f.x} y={f.y} s={1.1} />; })()}
    <BigWord t={t} />
    <DougFlag x={800} y={1880} t={t} />
    <Penguin id="doug" x={480} y={1880} h={780} pose={{turn: side * 0.45, look: [side * 0.8, side ? -0.6 : 0], mouth: talk(t, [[0, T.end]]),
      flapL: side < 0 ? 140 + Math.sin(t * 9) * 6 : 25, flapR: side > 0 ? 140 + Math.sin(t * 9) * 6 : t >= T.three ? 150 : 25,
      brows: enemy && t < 3.24 ? 'angry' : 'worried', eyeScale: t >= T.three ? 1.15 : 1}} />
  </>;
};

export const DougEnemyOilHook = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  // very light push toward the side being spoken, back to wide on "There are 3 reasons"
  const toL = tc >= T.rich && tc < T.buying + 0.3 ? ease((tc - T.rich) / 0.4) : 0, toR = tc >= T.enemies - 0.4 && tc < 3.24 ? ease((tc - T.enemies + 0.4) / 0.4) : 0;
  const s = 1 + 0.05 * (toL + toR), fx = 540 - 70 * toL + 70 * toR, fy = 900;
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${fy - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}><Hook t={t} /></AbsoluteFill>
    <Audio src={staticFile('doug-enemy-oil-hook-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={T.rich} name="user-pop" vol={0.3} />
    <Sfx at={T.buying} name="user-whoosh" vol={0.35} />
    <Sfx at={T.buying + 0.5} name="user-cash-register" vol={0.35} />
    <Sfx at={T.enemies} name="user-boom" vol={0.45} />
    <Sfx at={T.three} name="user-ting" vol={0.4} />
  </AbsoluteFill>;
};
