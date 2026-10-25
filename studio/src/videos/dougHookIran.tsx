// Doug layer for the USA-vs-Iran hook (tools/hook_iran.py composites it). Transparent 560x480, timings match the doug-imf VO.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS} from '../base';
import {Penguin} from '../penguin/rig';

export const DOUG_HOOK_IRAN_SECONDS = 5.11;
const RICH = 2 / 22 * 4.71, ZERO = 17 / 22 * 4.71; // am_puck 1.0 VO (doug-imf line 1)

export const DougHookIran = () => {
  const t = useCurrentFrame() / FPS;
  const pose = t < RICH ? {look: [-0.8, -0.6] as [number, number], brows: 'none' as const, beak: 'flat' as const, flapL: 20, flapR: 20}
    : t < ZERO ? {look: [-0.9, -0.5] as [number, number], brows: 'worried' as const, eyeScale: 1.15, beak: 'frown' as const, flapL: 30, flapR: 70 + Math.sin(t * 9) * 25}
    : {look: [-0.9, -0.3] as [number, number], brows: 'shock' as const, eyeScale: 1.4, pupil: 0.6, beak: 'frown' as const, sweat: true, tremble: 1, flapL: 120, flapR: 120, hop: t < ZERO + 0.3 ? 1 : 0};
  return <AbsoluteFill>
    <Penguin id="doug" x={280} y={450} h={380} pose={pose} />
  </AbsoluteFill>;
};
