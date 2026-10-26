// DOUG PAYS · EP. 1 "Rent" — HOOK PREVIEW v2 (first 3 s). ONE idea: rent $1,600 vs Doug has $200 (two bars, Doug centered).
// ~$1,600 = typical US rent range; Zillow typical asking rent Jul 2026 = $1,962. "$200" = story figure (not a stat).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {Penguin} from '../penguin/rig';
import {Captions} from '../penguin/edit';
import {NightBg, NightGround, N_GREEN, N_RED, Pill, SeriesBadge} from '../penguin/night';

const G = 1290;
const CAP = [{start: 0, end: 1.2, text: 'Rent is $1,600.'}, {start: 1.2, end: 2.2, text: 'Doug has $200.'}, {start: 2.2, end: 3.2, text: 'Due Friday.'}];
const ease = (x: number) => { const k = Math.max(0, Math.min(1, x)); return 1 - (1 - k) ** 3; };

const Row = ({y, label, value, color, pct, at}: {y: number; label: string; value: string; color: string; pct: number; at: number}) => {
  const t = useCurrentFrame() / FPS, p = ease((t - at) / 0.45), W = 900;
  return <div style={{position: 'absolute', left: 90, top: y, width: W, opacity: Math.min(1, p * 3)}}>
    <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 52, color: '#fff', letterSpacing: 3}}>{label}</div>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 170, lineHeight: 1.05, color, textShadow: `0 0 28px ${color}88`, transform: `scale(${0.9 + 0.1 * p})`, transformOrigin: '0 50%'}}>{value}</div>
    <div style={{height: 56, borderRadius: 28, background: 'rgba(255,255,255,0.12)', marginTop: 8, overflow: 'hidden'}}>
      <div style={{width: W * pct * p, height: '100%', borderRadius: 28, background: color, boxShadow: `0 0 24px ${color}`}} />
    </div>
  </div>;
};

const Hook = ({t}: {t: number}) => {
  const shock = t >= 1.2;
  return <>
    <Row y={170} label="RENT" value="$1,600" color={N_RED} pct={1} at={0.1} />
    <Pill x={640} y={178} text="DUE FRIDAY" color={N_RED} />
    <Row y={580} label="DOUG HAS" value="$200" color={N_GREEN} pct={0.125} at={1.0} />
    <NightGround y={G} />
    <Penguin id="doug" x={540} y={G + 40} h={470} pose={{turn: 0, look: [0, 0.2], brows: shock ? 'shock' : 'worried', eyeScale: shock ? 1.35 : 1.05, pupil: 0.6, beak: 'frown', flapR: shock ? 50 : 30, flapL: shock ? 50 : 30, sweat: shock}} />
  </>;
};

export const DougPaysHook = () => {
  const tc = useCurrentFrame() / FPS, s = 1 + 0.02 * tc;
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <NightBg />
    <AbsoluteFill style={{transform: `translate(${540 - 540 * s}px, ${960 - 960 * s}px) scale(${s})`, transformOrigin: '0 0'}}><Hook t={tc} /></AbsoluteFill>
    <SeriesBadge ep={1} />
    <Captions t={tc} phrases={CAP} />
  </AbsoluteFill>;
};
