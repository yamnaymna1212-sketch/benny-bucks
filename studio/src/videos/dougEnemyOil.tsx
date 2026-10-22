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

// object flying on an arc between (x1,y1) and (x2,y2) from time a, for d seconds
const fly = (t: number, a: number, d: number, x1: number, y1: number, x2: number, y2: number, arc = 180) => {
  const p = (t - a) / d; if (p < 0 || p > 1) return null;
  return {x: lerp(x1, x2, p), y: lerp(y1, y2, p) - Math.sin(p * Math.PI) * arc, p};
};
const F = 1080 / 941; // user's picture -> video scale
const bobOf = (t: number, phase: number) => Math.sin(t * 1.8 + phase) * 6;

// A cut-out character from the user's picture. (fx, fy) = feet point; motion = hop / lean around the feet.
const Actor = ({src, left, top, w, fx, fy, hop = 0, rot = 0, dx = 0}: {src: string; left: number; top: number; w: number; fx: number; fy: number; hop?: number; rot?: number; dx?: number}) =>
  <Img src={staticFile(`enemy-oil/${src}.png`)} style={{position: 'absolute', left: left + dx, top: top - hop, width: w,
    transform: `rotate(${rot}deg)`, transformOrigin: `${fx - left}px ${fy - top}px`}} />;

// The real barrel from the picture (copies get shipped to America).
const BW = 82 * F, BH = 126 * F;
const Barrel = ({x, y, s = 1, rot = 0}: {x: number; y: number; s?: number; rot?: number}) =>
  <Img src={staticFile('enemy-oil/barrel.png')} style={{position: 'absolute', left: x - BW * s / 2, top: y - BH * s, width: BW * s, transform: `rotate(${rot}deg)`, transformOrigin: '50% 100%'}} />;

// barrels shipped Russia -> America: [start, landing x, landing y (bottom)]
const SHIP: [number, number, number][] = [[1.5, 200, 552], [1.95, 295, 556], [2.75, 105, 546]];
const FROM = {x: 819 * F, y: 474 * F};

const Hook = ({t}: {t: number}) => {
  const usaB = bobOf(t, 0), ruB = bobOf(t, 2);
  const tilt = t < T.buying ? 0 : Math.sin((t - T.buying) * 7) * 6 * Math.exp(-(t - T.buying) * 1.2);
  const enemy = t >= T.enemies;
  const side = t < T.buying ? -1 : t < T.enemies - 0.4 ? 0 : t < 3.24 ? 1 : 0;
  // Trump: hop on "rich", leans + swings the bag on "buying", angry jabbing at Putin on "enemies"
  const hopP = cl((t - T.rich) / 0.35), tHop = t >= T.rich && hopP < 1 ? Math.sin(hopP * Math.PI) * 34 : 0;
  const tLean = t >= T.buying && t < T.enemies ? 6 * Math.sin(cl((t - T.buying) / 0.3) * Math.PI / 2) * (1 + 0.3 * Math.sin(t * 9)) : 0;
  const tJab = enemy && t < 3.3 ? 7 + Math.sin(t * 22) * 5 : 0;
  const tShake = enemy && t < 3.3 ? Math.sin(t * 60) * 3 : 0;
  // Putin: catches the money (bounce), then leans back smug and laughs on "enemies"
  const catchP = cl((t - T.buying - 0.55) / 0.3), pBounce = catchP > 0 && catchP < 1 ? Math.sin(catchP * Math.PI) * 22 : 0;
  const pLean = enemy ? -5 : 0, pLaugh = enemy && t < 3.4 ? Math.abs(Math.sin(t * 16)) * 8 : 0;
  return <>
    {enemy && <div style={{position: 'absolute', left: 640, top: 200 + DY, width: 520, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(216,58,46,0.35), rgba(216,58,46,0))',
      opacity: 0.6 + 0.4 * Math.sin((t - T.enemies) * 10)}} />}
    <Piece src="usa" x={0} y={195} w={383} t={t} phase={0} />
    <Piece src="russia" x={718} y={124} w={362} t={t} phase={2} />
    <Piece src="scale" x={383} y={247} w={335} t={t} phase={4} rot={tilt} />
    <Actor src="putin" left={650 * F} top={180 * F + DY + ruB} w={140 * F} fx={720 * F} fy={455 * F + DY + ruB} hop={pBounce + pLaugh} rot={pLean} />
    {SHIP.map(([a, x, y], i) => t >= a + 0.6 && <Barrel key={i} x={x} y={y + DY + usaB} s={0.9} />)}
    <Actor src="trump" left={100 * F} top={165 * F + DY + usaB} w={234 * F} fx={215 * F} fy={430 * F + DY + usaB} hop={tHop} rot={tLean + tJab} dx={tShake} />
    {[0, 1, 2].map((i) => { const f = fly(t, T.buying + i * 0.13, 0.55, 165, 460 + DY, 820, 380 + DY); return f && <Bill key={i} x={f.x} y={f.y} w={120} rot={f.p * 360} />; })}
    {SHIP.map(([a, x, y], i) => { const f = fly(t, a, 0.6, FROM.x, FROM.y + DY, x, y + DY, 230); return f && <Barrel key={i} x={f.x} y={f.y} s={lerp(1.1, 0.9, f.p)} rot={f.p * -360} />; })}
    <BigWord t={t} />
    <Penguin id="doug" x={540} y={1880} h={780} pose={{turn: side * 0.45, look: [side * 0.8, side ? -0.6 : 0], mouth: talk(t, [[0, T.end]]),
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
