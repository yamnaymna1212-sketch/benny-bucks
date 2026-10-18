// EP4 "Full tank: $66 in the USA vs $0.45 in Iran" — hook = WhyHook main template, then the Doug ice world.
// Phrase timings: src/data/doug-gas-iran.json (tightened ElevenLabs VO, videos/doug-gas-iran/vo).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS} from '../base';
import {WhyHook} from '../penguin/whyHook';
import {PenguinPose} from '../penguin/rig';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-gas-iran.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_GAS_IRAN_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => { const q = cl(p); return q * q * (3 - 2 * q); };

// Doug acts the hook: stares at the USA price, then snaps to Iran with the camera and freaks out on "forty-five cents?"
const hookDoug = (t: number): {pose: PenguinPose; mark: string} => {
  const toR = ease((t - P(1)) / 0.3), shock = ease((t - P(2)) / 0.15);
  const turn = -0.45 + 0.9 * toR;
  if (shock <= 0) return {mark: '?', pose: {turn, look: [turn < 0 ? -0.8 : 0.8, -0.2], brows: 'worried', beak: 'frown', flapL: 14, flapR: 14}};
  return {mark: '!', pose: {turn: 0.45, look: [0.8, -0.3], eyeScale: 1 + 0.4 * shock, pupil: 0.7, brows: 'shock', mouth: 0.7 * shock,
    flapL: 14 + 70 * shock, flapR: 14 + 70 * shock, hop: 40 * shock * Math.max(0, 1 - (t - P(2)) / 0.5), tremble: 0.6, sweat: true}};
};

const HookSet = ({t = -1}: {t?: number}) => { const d = t < 0 ? undefined : hookDoug(t);
  return <WhyHook dougPose={d?.pose} mark={d?.mark}
    left={{flag: 'usa', price: '$66', unit: 'FULL TANK', obj: 'pump', color: '#2F5DA8'}}
    right={{flag: 'iran', price: '$0.45', unit: 'FULL TANK', obj: 'pump', color: '#2E9E4F'}} />; };
export const DougGasIranHook = () => <HookSet />;

// Hook camera: push toward the USA price while it is said, swing to Iran on "but in Iran", back out on "forty-five cents?"
const hookCam = (t: number) => {
  const toL = ease((t - 0.6) / 0.9) * (1 - ease((t - P(1)) / 0.35));
  const toR = ease((t - P(1)) / 0.35) * (1 - ease((t - P(2) - 0.15) / 0.3));
  const z = 1 + 0.16 * toL + 0.16 * toR;
  const x = 540 + (225 - 540) * toL + (855 - 540) * toR, y = 960 + (760 - 960) * (toL + toR);
  return {z, x, y};
};

export const DougGasIran = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const hook = t < P(3) - 0.05;
  const cam = hookCam(t), k = beat(t, TIM);
  const shake = t > P(2) && t < P(2) + 0.25 ? Math.sin(t * 90) * 8 * (1 - (t - P(2)) / 0.25) : 0;
  return <AbsoluteFill style={{background: '#FBFBF8', overflow: 'hidden'}}>
    <AbsoluteFill style={{transformOrigin: `${cam.x}px ${cam.y}px`, transform: `translate(${shake}px,0) scale(${cam.z * k})`}}>
      {hook && <HookSet t={t} />}
    </AbsoluteFill>
    <Captions t={t} phrases={TIM} y={hook ? 1640 : 1530} />
    <Audio src={staticFile('doug-gas-iran-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.75} name="user-whoosh" vol={0.25} />
    <Sfx at={1.35} name="user-cash-register" vol={0.4} />
    <Sfx at={P(1)} name="user-whoosh" vol={0.3} />
    <Sfx at={P(2)} name="user-boom" vol={0.5} />
    <Sfx at={P(2) + 0.35} name="user-pop" vol={0.35} />
    <Sfx at={P(2) + 0.05} name="penguin-squawk" vol={0.4} />
    <Sfx at={P(1) + 0.1} name="swoosh-fast" vol={0.3} />
  </AbsoluteFill>;
};
