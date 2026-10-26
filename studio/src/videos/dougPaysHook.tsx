// DOUG PAYS · EP. 1 "Rent" — HOOK PREVIEW (first 3 s). Pressure hook: person at stake + number + deadline + threat.
// Numbers: rent ~$2,000 = Zillow typical US asking rent, July 2026 ($1,962). "Doug has $1,400" = story figure (not a stat).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {Penguin} from '../penguin/rig';
import {Walrus} from '../penguin/cast';
import {Igloo, Paper, Stamp} from '../penguin/world';
import {Captions} from '../penguin/edit';
import {GlassCard, NightBg, NightGround, N_GREEN, N_RED, Pill, SeriesBadge} from '../penguin/night';

const G = 1290;
const CAP = [{start: 0, end: 1.6, text: 'Rent is $2,000. Doug has $1,400.'}, {start: 1.6, end: 3.2, text: 'Friday... or the igloo is gone.'}];
const ease = (x: number) => { const k = Math.max(0, Math.min(1, x)); return 1 - (1 - k) ** 3; };

const Side = ({x, value, label, color, at}: {x: number; value: string; label: string; color: string; at: number}) => {
  const t = useCurrentFrame() / FPS, p = ease((t - at) / 0.25);
  return <div style={{opacity: p, transform: `scale(${0.85 + 0.15 * p})`, transformOrigin: '50% 50%'}}>
    <GlassCard x={x} y={190} w={470} h={300}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 36, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 112, lineHeight: 1, color, textShadow: `0 0 26px ${color}88`}}>{value}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 800, fontSize: 42, color: '#fff'}}>{label}</div>
    </GlassCard>
  </div>;
};

const Hook = ({t}: {t: number}) => {
  const gap = ease((t - 1.0) / 0.25), shake = t > 1.9 ? Math.sin(t * 60) * 4 : 0;
  return <>
    <Side x={60} value="$2,000" label="RENT DUE" color={N_RED} at={0.1} />
    <Side x={550} value="$1,400" label="DOUG HAS" color={N_GREEN} at={0.7} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 530, textAlign: 'center', opacity: gap, transform: `scale(${0.8 + 0.2 * gap})`}}>
      <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 96, color: N_RED, textShadow: `0 0 26px ${N_RED}88`}}>−$600</span>
      <span style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 56, color: '#fff', marginLeft: 26}}>by FRIDAY</span>
    </div>
    <NightGround y={G} />
    <Igloo x={700} y={G + 10} w={500} />
    <Walrus id="larry" x={820} y={G + 50} h={440} flip pose={{}} />
    <Paper x={560} y={820} w={250} title="PAY OR OUT" amount="$2,000" at={1.4} rot={-8} />
    <Penguin id="doug" x={300} y={G + 40} h={560} pose={{turn: 0.4, look: [0.8, -0.1], brows: t > 1.0 ? 'shock' : 'worried', eyeScale: t > 1.0 ? 1.3 : 1.05, pupil: 0.6, beak: 'frown', flapR: 40 + shake, flapL: 40 - shake, sweat: t > 1.0}} />
    <Penguin id="son" x={120} y={G + 40} h={300} build="baby" pose={{turn: 0.3, look: [0.5, 0.2], brows: 'worried', eyeScale: 1.2, beak: 'frown'}} />
    <Stamp text="OR OUT" x={540} y={1385} at={2.2} color={N_RED} size={96} rot={-6} />
  </>;
};

export const DougPaysHook = () => {
  const tc = useCurrentFrame() / FPS, s = 1 + 0.025 * tc;
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <NightBg />
    <AbsoluteFill style={{transform: `translate(${540 - 540 * s}px, ${960 - 960 * s}px) scale(${s})`, transformOrigin: '0 0'}}><Hook t={tc} /></AbsoluteFill>
    <SeriesBadge ep={1} />
    <Captions t={tc} phrases={CAP} />
  </AbsoluteFill>;
};
