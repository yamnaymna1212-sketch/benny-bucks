// Motion test for the penguin world: walk-in on a bobbing ice floe, talk, fish savings drop in, one fish escapes
// into the sea (splash), the rest rot (inflation), then the signature shock close-up. Nothing on screen is ever static.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {FPS, SFX_GAIN} from '../engine';
import {HAND, HandFont, Write} from '../sketch';
import {Fish, IceFloe, INK, Penguin, PenguinPose, Sea, Snow, Splash, talk} from '../penguin/rig';

export const PENGUIN_TEST_SECONDS = 12;
const SEA = 1300, FLOE = 1240, PH = 650;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const r = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const ease = (p: number) => 1 - Math.pow(1 - p, 3);

const Sfx = ({at, name, vol = 0.5}: {at: number; name: string; vol?: number}) =>
  <Sequence from={Math.round(at * FPS)} layout="none"><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * SFX_GAIN} /></Sequence>;

// Fish savings pile on the floe (5 fish). Index 4 is the one that escapes.
const PILE: [number, number, number][] = [[740, 1196, -4], [880, 1200, 5], [810, 1150, -8], [745, 1104, 6], [860, 1100, -3]];
const DROP = (i: number) => 3.8 + i * 0.22;
const JUMP = 5.6, SPLASH = 6.25, ROT = 7.0, SHOCK = 9.2;

const PileFish = ({i, t}: {i: number; t: number}) => {
  const [tx, ty, rot] = PILE[i], d = DROP(i);
  if (t < d) return null;
  const p = r(t, d, d + 0.32);
  let y = ty - (1 - p * p) * 800, x = tx, rr = rot + (1 - p) * 40;
  const after = t - d - 0.32;
  if (after > 0) y -= Math.abs(Math.sin(after * 14)) * 30 * Math.exp(-after * 7);
  if (i === 4 && t >= JUMP) {
    const q = r(t, JUMP, SPLASH);
    if (t > SPLASH) return null;
    x = tx + (960 - tx) * q; y = ty + (-520 * q + 600 * q * q) + (SEA - ty - 80) * q * q; rr = rot + q * 300;
  }
  const rotten = i === 4 ? 0 : ease(r(t, ROT + i * 0.15, ROT + 1.2 + i * 0.15));
  return <Fish x={x} y={y} w={175} rot={rr} flip={i % 2 === 1} rotten={rotten} id={`f${i}`} seed={i * 0.7} wag={i === 4 && t >= JUMP ? 2 : 1} />;
};

const Wallet = ({t}: {t: number}) => {
  let n = PILE.filter((_, i) => t >= DROP(i) + 0.32).length;
  if (t >= JUMP) n -= 1;
  const rotten = ease(r(t, ROT, ROT + 1.2));
  const kick = [0, 1, 2, 3, 4].map((i) => DROP(i) + 0.32).concat([JUMP]).reduce((k, at) => { const d = t - at; return d >= 0 && d < 0.4 ? k + 0.25 * Math.exp(-d * 9) : k; }, 1);
  return <div style={{position: 'absolute', left: 50, top: 110, transform: `scale(${kick})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 14,
    background: '#fff', border: `6px solid ${INK}`, borderRadius: 26, padding: '10px 28px 10px 14px', boxShadow: '5px 7px 0 rgba(0,0,0,0.12)'}}>
    <div style={{position: 'relative', width: 130, height: 70}}><Fish x={65} y={35} w={130} rotten={rotten} id="wal" /></div>
    <div style={{fontFamily: HAND, fontSize: 84, color: rotten > 0.5 ? '#5E8A3A' : INK, lineHeight: 1}}>× {n}</div>
  </div>;
};

export const PenguinTest = () => {
  const frame = useCurrentFrame(), t = frame / FPS;
  // --- penguin acting ---
  const px = interpolate(t, [0, 2], [-260, 420], {extrapolateRight: 'clamp'});
  const walking = t < 2;
  const settle = t >= 2 && t < 2.6 ? Math.sin((t - 2) * 18) * Math.exp(-(t - 2) * 7) : 0;
  const shock = t >= SHOCK;
  const pose: PenguinPose = {
    walk: walking ? t * 1.6 : null, squash: settle,
    mouth: shock ? 0.35 : talk(t, [[2.3, 3.5], [4.0, 4.6]]),
    brows: shock ? 'shock' : t >= SPLASH ? 'worried' : t >= 2.3 ? 'happy' : 'none',
    look: t < 3.7 ? [0, 0] : t < JUMP ? [0.8, 0.35] : t < 6.6 ? [1, interpolate(t, [JUMP, SPLASH], [-0.5, 0.6], {extrapolateRight: 'clamp'})] : t < SHOCK ? [0.75, 0.6] : [0, 0],
    flapR: shock ? 115 : t > 2.3 && t < 3.6 ? 95 + Math.sin(t * 13) * 28 : t > 3.8 && t < 5.2 ? 35 + Math.abs(Math.sin(t * 9)) * 25 : 8 + (walking ? Math.sin(t * 10) * 12 : 0),
    flapL: shock ? 115 : t > 3.8 && t < 5.2 ? 35 + Math.abs(Math.sin(t * 9 + 1)) * 25 : 8 + (walking ? -Math.sin(t * 10) * 12 : 0),
    eyeScale: shock ? 1 + 0.28 * ease(r(t, SHOCK, SHOCK + 0.15)) : 1, pupil: shock ? 0.45 : 1, tremble: shock ? 1 : 0,
  };
  // --- camera (zoom only): slow push while talking, push toward the pile, snap close-up on the shock ---
  const faceY = FLOE + 2 - (500 - 190) * (PH / 520);
  const zs = shock ? spring({frame: frame - SHOCK * FPS, fps: FPS, config: {damping: 16, stiffness: 260}}) : 0;
  const pile = ease(r(t, 6.6, 8.6));
  let s = 1 + 0.06 * ease(r(t, 2.0, 3.6)) + 0.12 * pile, fx = 540 + 150 * pile, fy = 960 + 160 * pile;
  s = s + (3.0 - s) * zs; fx = fx + (420 - fx) * zs; fy = fy + (faceY - fy) * zs;
  const cam = `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`;
  const steps = Array.from({length: 7}, (_, k) => k * 0.3125).filter((a) => a < 2);
  return <AbsoluteFill style={{background: '#FFFFFF', overflow: 'hidden'}}>
    <HandFont />
    <AbsoluteFill style={{transform: cam, transformOrigin: '0 0'}}>
      <Snow />
      <Sea top={SEA} />
      <IceFloe x={560} top={FLOE} w={840}>
        <Penguin x={px} y={FLOE + 2} h={PH} pose={pose} />
        {PILE.map((_, i) => <PileFish key={i} i={i} t={t} />)}
      </IceFloe>
      <Splash x={960} y={SEA + 10} at={SPLASH} />
    </AbsoluteFill>
    <Wallet t={t} />
    <Write text="that was his rent." x={540} y={1430} at={SHOCK + 0.7} size={88} pencil={false} />
    {steps.map((a) => <Sfx key={a} at={a} name="tick" vol={0.25} />)}
    <Sfx at={2.0} name="thud" vol={0.35} />
    {[2.35, 2.6, 2.85, 3.1, 3.35, 4.05, 4.3, 4.5].map((a) => <Sfx key={a} at={a} name="blip" vol={0.35} />)}
    {[0, 1, 2, 3, 4].map((i) => <Sfx key={i} at={DROP(i) + 0.3} name="pop" vol={0.4} />)}
    <Sfx at={JUMP} name="boing" vol={0.5} />
    <Sfx at={SPLASH} name="splash" vol={0.6} />
    <Sfx at={ROT + 0.3} name="hum" vol={0.25} />
    <Sfx at={SHOCK} name="impact" vol={0.7} />
    <Sfx at={SHOCK + 0.9} name="sad-horn" vol={0.45} />
  </AbsoluteFill>;
};
