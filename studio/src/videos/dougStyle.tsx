// STYLE TEST v2 (not an episode): the OLD Doug base (rig, cast, PriceTag, captions, camera) on the Night look v3
// backdrop + glass number cards. Two stills: hook (frame 30) and a one-idea scene (frame 120). Numbers = placeholders.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {Penguin} from '../penguin/rig';
import {Walrus} from '../penguin/cast';
import {PriceTag} from '../penguin/world';
import {Captions} from '../penguin/edit';
import {GlassCard, NightBg, NightGround, NumberCard, N_RED, Pill, Ring, SeriesBadge} from '../penguin/night';

const G = 1250;
const CAP = [{start: 0, end: 3, text: 'You paid $60 for gas.'}, {start: 3, end: 6, text: 'Larry take 80%.'}];

// Hook: ONE number, talks to the viewer, Doug centered, motion from frame 1
const Hook = () => <>
  <NightGround y={G} />
  <NumberCard x={540} y={250} value="$60" label="YOUR GAS TANK" source="placeholder" at={0} color={N_RED} />
  <Penguin id="doug" x={540} y={G + 40} h={600} pose={{turn: 0, look: [0, 0.2], brows: 'shock', eyeScale: 1.3, pupil: 0.6, beak: 'frown', flapR: 45, flapL: 45, sweat: true}} />
</>;

// One idea per scene: who takes the money (Larry) + one glowing figure
const Scene = () => <>
  <NightGround y={G} />
  <GlassCard x={90} y={210} w={900} h={360}>
    <Pill x={36} y={30} text="who gets it?" />
    <Ring x={200} y={210} pct={0.8} at={3} size={250} />
    <div style={{position: 'absolute', left: 380, top: 130, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60, color: '#fff', lineHeight: 1.15}}>OF DOUG'S<br />FISH GO TO<br /><span style={{color: N_RED}}>LARRY</span></div>
  </GlassCard>
  <Penguin id="doug2" x={330} y={G + 40} h={470} pose={{turn: 0.5, look: [0.8, -0.1], brows: 'sad', eyeScale: 1.1, beak: 'frown', flapR: 15, flapL: 15}} />
  <Walrus id="larry" x={790} y={G + 60} h={560} flip />
  <PriceTag x={560} y={760} price="$48" fish="5 fish" rot={-8} />
</>;

export const DougStyle = () => {
  const tc = useCurrentFrame() / FPS, s = 1.04;
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <NightBg />
    <AbsoluteFill style={{transform: `translate(${540 - 540 * s}px, ${960 - 960 * s}px) scale(${s})`, transformOrigin: '0 0'}}>{tc < 3 ? <Hook /> : <Scene />}</AbsoluteFill>
    <SeriesBadge ep={1} />
    <Captions t={tc} phrases={CAP} />
  </AbsoluteFill>;
};
