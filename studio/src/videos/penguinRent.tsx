// Style test v3 (~20 s, music bed, no narrator yet): all fixes in one short.
// Split contrast hook -> rent hand-off -> landlord smug close-up -> seagull tax steals the last fish -> crying close-up
// -> sitting/dreaming -> title -> logical twist (his rent bought the walrus igloo #41) -> signature shock close-up.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FPS, SFX_GAIN} from '../engine';
import {HandFont} from '../sketch';
import {Fish, INK, Line, Penguin, onTwos} from '../penguin/rig';
import {Seagull, Walrus} from '../penguin/cast';
import {BigWord, FishPile, Igloo, IceCube, Mansion, PriceTag, SnowPile, SpeedLines, Thought, Title, Wallet, fishOf} from '../penguin/world';
import {Music, perform} from '../penguin/acting';

export const PENGUIN_RENT_SECONDS = 20.5;
const G = 1300;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const r = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const ease = (p: number) => 1 - Math.pow(1 - p, 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const RENT = 1800, RENT_FISH = fishOf(RENT);

const Sfx = ({at, name, vol = 0.5}: {at: number; name: string; vol?: number}) =>
  <Sequence from={Math.round(at * FPS)} layout="none"><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * SFX_GAIN} /></Sequence>;

type Shot = {at: number; s: number; fx: number; fy: number; set: string};
const SHOTS: Shot[] = [
  {at: 0, s: 1, fx: 540, fy: 960, set: 'hook'},
  {at: 2.6, s: 1, fx: 540, fy: 960, set: 'yard'},
  {at: 5.6, s: 2.2, fx: 760, fy: 1030, set: 'yard'},
  {at: 7.0, s: 1, fx: 540, fy: 960, set: 'yard'},
  {at: 9.0, s: 2.6, fx: 330, fy: G - 420, set: 'yard'},
  {at: 10.6, s: 1, fx: 540, fy: 960, set: 'yard'},
  {at: 13.0, s: 1, fx: 540, fy: 960, set: 'title'},
  {at: 15.0, s: 1, fx: 540, fy: 960, set: 'twist'},
  {at: 17.5, s: 3.0, fx: 540, fy: G - 330, set: 'shock'},
  {at: 19.0, s: 1, fx: 540, fy: 960, set: 'end'},
];

const HookSet = ({t}: {t: number}) => {
  const hero = perform(t, 270, [{do: 'sweat', at: 0, until: 3}, {do: 'look', at: 0, look: [0.8, 0]}, {do: 'mood', at: 0, pose: {brows: 'worried', beak: 'frown'}}]);
  return <>
    <div style={{position: 'absolute', left: 536, top: 260, width: 8, height: 1240, background: INK, borderRadius: 4, transform: 'rotate(1deg)'}} />
    <IceCube x={250} y={G - 150} w={300} sign="RENT" />
    <Penguin id="hero" x={hero.x} y={G + 40} h={500} pose={hero.pose} />
    <PriceTag x={270} y={540} price={`$${RENT.toLocaleString()}`} fish={`= ${RENT_FISH} fish / mo`} at={0} size={1.25} />
    <Mansion x={810} y={G - 170} w={520} />
    <Walrus x={820} y={G + 40} h={500} pose={{lids: 0.5, look: -0.6}} />
    <BigWord text="owns 40" x={815} y={540} at={0.3} size={112} color="#2E9E4F" rot={4} />
  </>;
};

const YardSet = ({t}: {t: number}) => {
  const hero = perform(t, 120, [
    {do: 'hold', at: 2.6, until: 4.75}, {do: 'walk', at: 2.8, to: 400}, {do: 'give', at: 4.5},
    {do: 'look', at: 4.9, look: [0.7, -0.1]}, {do: 'mood', at: 4.9, pose: {brows: 'worried', beak: 'frown'}},
    {do: 'hold', at: 7.0, until: 8.0}, {do: 'look', at: 7.2, look: [0.6, -0.8]}, {do: 'sweat', at: 7.3, until: 8.6},
    {do: 'cry', at: 8.1, until: 10.6},
    {do: 'face', at: 10.6, turn: 0}, {do: 'sit', at: 10.7, until: 13}, {do: 'droop', at: 10.7, until: 13},
  ], {turn: 0.8});
  const walrusTalk = t > 3.0 && t < 3.8 ? 0.6 * Math.abs(Math.sin(t * 16)) : t > 5.8 && t < 6.8 ? 0.7 * Math.abs(Math.sin(t * 15)) : 0;
  // fish pile arcs from the hero to the walrus at 4.75
  const fp = r(t, 4.75, 5.25);
  // seagull: flies in 7.0-7.8, snatches at 8.0, flies off 8.3-9.0
  const gIn = ease(r(t, 7.0, 7.8)), gOut = r(t, 8.3, 9.0);
  const gx = lerp(1250, 560, gIn) + gOut * 800, gy = lerp(500, G, gIn) - gOut * 900;
  const gullOn = t >= 7.0 && t < 9.0;
  return <>
    <SnowPile x={980} y={G + 2} w={180} id="snR" />
    <IceCube x={110} y={G + 2} w={230} id="cubeY" />
    <Mansion x={820} y={G - 150} w={560} id="manY" />
    <Walrus x={800} y={G} h={520} pose={{mouth: walrusTalk, lids: t > 5 ? 0.55 : 0.4, laugh: t > 5.8 && t < 6.8 ? 1 : 0, flap: t > 4.9 && t < 5.4 ? 30 : 0, look: -0.5}} />
    {t >= 5.25 && t < 15 && <FishPile x={700} y={G - 10} n={9} w={130} seed={4} />}
    {fp > 0 && fp < 1 && <FishPile x={lerp(470, 700, fp)} y={lerp(G - 260, G - 10, fp) - Math.sin(fp * Math.PI) * 380} n={9} w={130} seed={4} />}
    <Penguin id="hero" x={hero.x} y={G} h={540} pose={{...hero.pose, holding: hero.pose.holding}} />
    {hero.running && <SpeedLines x={hero.x - 120} y={G - 120} />}
    {gullOn && <Seagull x={gx} y={gy} h={330} pose={{fly: t < 7.8 || t > 8.3, holding: t >= 8.0, mouth: t > 7.85 && t < 8.2 ? 0.8 : 0}} />}
    {t >= 10.6 && t < 13 && <Thought x={430} y={560} w={420} tx={370} ty={G - 470} at={11.1}><div style={{position: 'relative', width: 420, height: 260}}><Igloo x={210} y={230} w={260} id="dream" /></div></Thought>}
    {/* hand-written lines above the speaker (only in wide shots) */}
    <Line t={t} text="rent's due." x={760} y={700} at={3.0} until={4.4} size={80} />
    <Line t={t} text="my lunch..." x={400} y={620} at={7.2} until={7.9} size={72} />
    <BigWord text="TAX" x={640} y={520} at={8.0} until={9.0} color="#D83A2E" size={170} />
    <Line t={t} text="one day..." x={400} y={1430} at={11.4} until={13} size={80} />
  </>;
};

const TwistSet = ({t}: {t: number}) => {
  const pop = t >= 16.0;
  return <>
    <Mansion x={420} y={G - 40} w={620} id="manT" />
    {pop && <div style={{position: 'absolute', left: 0, top: 0, transform: `scale(${Math.min(1, ease(r(t, 16.0, 16.3)) * 1.1)})`, transformOrigin: `880px ${G}px`}}><Igloo x={880} y={G} w={300} id="new41" /></div>}
    <Walrus x={560} y={G + 260} h={460} pose={{lids: 0.55, laugh: t > 16.2 ? 1 : 0, mouth: t > 16.2 ? 0.5 * Math.abs(Math.sin(t * 14)) : 0, look: 0.6}} flip />
    {t < 16 && <FishPile x={860} y={G - 20} n={9} w={130} seed={5} />}
    <BigWord text="#41" x={880} y={880} at={16.1} color="#2E9E4F" size={160} />
    <Line t={t} text="paid for by your rent." x={540} y={460} at={16.4} size={78} />
  </>;
};

export const PenguinRent = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const shot = [...SHOTS].reverse().find((s) => tc >= s.at)!;
  const s = shot.s * (1 + 0.012 * (tc - shot.at));
  const cam = `translate(${540 - shot.fx * s}px, ${960 - shot.fy * s}px) scale(${s})`;
  return <AbsoluteFill style={{background: '#FFFFFF', overflow: 'hidden'}}>
    <HandFont />
    <AbsoluteFill style={{transform: cam, transformOrigin: '0 0'}}>
      {shot.set === 'hook' && <HookSet t={t} />}
      {shot.set === 'yard' && <YardSet t={t} />}
      {shot.set === 'title' && <Title lines={['WHY RENT EATS', 'YOUR PAYCHECK']} at={13.1} size={130} />}
      {shot.set === 'twist' && <TwistSet t={t} />}
      {shot.set === 'shock' && <Penguin id="hero" x={540} y={G} h={540} pose={perform(t, 540, [{do: 'shock', at: 17.5, dur: 9}]).pose} />}
      {shot.set === 'end' && <>
        <Penguin id="hero" x={540} y={1450} h={760} pose={{brows: 'worried', beak: 'frown', lids: 0.3, look: [0, -0.2]}} />
        <Line t={t} text="part 2: how he fights back." x={540} y={420} at={19.1} size={72} />
      </>}
    </AbsoluteFill>
    <Wallet steps={[[2.7, RENT_FISH], [4.8, 0], [7.0, 1], [8.0, 0]]} />
    {shot.set === 'yard' && tc >= 5.6 && tc < 7.0 && <Line t={t} text="thanks, tenant." x={540} y={1730} at={5.8} size={92} />}
    {/* music bed carries the video; SFX only on the key beats */}
    <Music src="penguin-curious" from={0} until={9.0} vol={0.6} />
    <Music src="penguin-sad" from={9.0} until={13.0} vol={0.62} />
    <Music src="penguin-curious" from={13.0} until={PENGUIN_RENT_SECONDS} startAt={13} vol={0.6} stops={[17.5]} />
    <Sfx at={4.75} name="whoosh" vol={0.3} /><Sfx at={5.25} name="cha-ching" vol={0.3} />
    <Sfx at={8.0} name="pop" vol={0.35} />
    <Sfx at={16.0} name="pop" vol={0.35} />
    <Sfx at={17.5} name="impact" vol={0.75} />
    <Fish x={-200} y={-200} w={10} id="preload" />
  </AbsoluteFill>;
};
