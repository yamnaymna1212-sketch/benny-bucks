// Episode-structure test (~22 s, no narrator yet): "how banks make money", built shot-by-shot like the reference
// bank short: wide set-ups, hand-offs, vault insert, thought cloud, "+ interest" equation, sparkle title,
// rich-owner close-up, "still yours", signature shock close-up, disaster ending. Acting on twos, hard cuts.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FPS, SFX_GAIN} from '../engine';
import {HAND, HandFont} from '../sketch';
import {Fish, INK, Line, Penguin, PenguinPose, back, onTwos, talk} from '../penguin/rig';
import {Flame, FishPile, IceBank, Igloo, Letter, Note, Plus, SnowPile, Thought, Title, Vault} from '../penguin/world';

export const PENGUIN_BANK_SECONDS = 22;
const G = 1250, PH = 540, PB = 400; // PB = penguin height on the wide bank set (building reads big, like the ref)
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const r = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const ease = (p: number) => 1 - Math.pow(1 - p, 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const walkPhase = (t: number, a: number, b: number) => (t > a && t < b ? (t - a) * 1.8 : null);

const Sfx = ({at, name, vol = 0.5, rate = 1}: {at: number; name: string; vol?: number; rate?: number}) =>
  <Sequence from={Math.round(at * FPS)} layout="none"><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * SFX_GAIN} playbackRate={rate} /></Sequence>;

// Shot list: start time, camera scale, focus. Each shot is its own set-up (hard cut), with a slow push inside.
type Shot = {at: number; s: number; fx: number; fy: number; set: 'bank' | 'vault' | 'equation' | 'title' | 'rich' | 'shock' | 'fire'};
const SHOTS: Shot[] = [
  {at: 0, s: 1, fx: 540, fy: 960, set: 'bank'},
  {at: 6.0, s: 1, fx: 540, fy: 960, set: 'vault'},
  {at: 7.6, s: 1, fx: 540, fy: 960, set: 'bank'},
  {at: 10.0, s: 1, fx: 540, fy: 960, set: 'equation'},
  {at: 12.4, s: 1, fx: 540, fy: 960, set: 'title'},
  {at: 14.4, s: 1, fx: 540, fy: 960, set: 'rich'},
  {at: 16.6, s: 1, fx: 540, fy: 960, set: 'bank'},
  {at: 18.6, s: 3.0, fx: 540, fy: G - 300, set: 'shock'},
  {at: 20.0, s: 1, fx: 540, fy: 960, set: 'fire'},
];

const BankSet = ({t}: {t: number}) => {
  // A (hero) deposits 0-6; B (worker) borrows 7.6-10; A comes back 16.6-18.6.
  const partA = t < 6, partB = t >= 7.6 && t < 10, partC = t >= 16.6;
  const banker: PenguinPose = {
    turn: -0.5, mouth: talk(t, [[4.8, 5.6], [9.0, 9.6], [17.6, 18.3]]),
    flapL: partA && t > 4.5 ? lerp(6, 70, ease(r(t, 4.5, 4.8))) : partB && t > 8.8 && t < 9.8 ? lerp(6, 80, back(r(t, 8.8, 9.1))) : 6,
    holding: partA ? t > 4.6 : partB ? t < 9.2 && t > 8.8 : false, brows: partC ? 'happy' : 'none',
  };
  let hero: React.ReactNode = null, worker: React.ReactNode = null;
  if (partA) {
    const x = lerp(200, 470, ease(r(t, 3.4, 4.4)));
    hero = <Penguin id="hero" x={x} y={G} h={PB} pose={{
      turn: t < 3.1 ? 0 : 0.8, walk: walkPhase(t, 3.4, 4.4), mouth: talk(t, [[0.5, 1.5]]), brows: 'happy',
      flapR: t < 1.6 && t > 0.5 ? 95 + Math.sin(t * 13) * 28 : t > 4.3 && t < 4.7 ? lerp(6, 80, back(r(t, 4.3, 4.55))) : 6,
      holding: t >= 3.2 && t < 4.6, look: t < 3 ? [0, 0] : [0.7, 0],
    }} />;
  }
  if (partB) {
    const x = lerp(200, 470, ease(r(t, 8.0, 8.8)));
    worker = <Penguin id="worker" outfit="worker" x={x} y={G} h={PB} pose={{
      turn: t < 7.95 ? 0 : 0.8, walk: walkPhase(t, 8.0, 8.8), brows: t < 8 ? 'worried' : 'happy', look: [0.6, -0.3],
      flapR: t > 8.8 && t < 9.2 ? lerp(6, 80, ease(r(t, 8.8, 9.0))) : 6, holding: t >= 9.2,
    }} />;
  }
  if (partC) {
    hero = <Penguin id="hero" x={450} y={G} h={PB} pose={{turn: 0.7, mouth: talk(t, [[16.8, 17.5]]), brows: t > 17.6 ? 'worried' : 'none', look: [0.6, 0], flapR: t < 17.5 ? 40 + Math.sin(t * 9) * 12 : 6}} />;
  }
  return <>
    <SnowPile x={90} y={G + 4} w={200} id="sn1" />
    <IceBank x={790} y={G + 40} w={600} />
    <Penguin id="banker" outfit="banker" x={770} y={G} h={360} pose={banker} seed={1.3} />
    {partA && t < 3.2 && <FishPile x={80} y={G} n={5} w={130} />}
    {hero}{worker}
    {partA && <Letter text="A" x={200} y={G + 70} />}
    {partB && <Letter text="B" x={lerp(200, 470, ease(r(t, 8.0, 8.8)))} y={G + 70} />}
    <Line t={t} text="where do I keep my fish?" x={400} y={G - PB - 70} at={0.5} until={2.6} />
    <Line t={t} text="thank you penguin." x={760} y={700} at={4.8} until={6} />
    {partB && <Thought x={300} y={G - PB - 230} w={380} tx={240} ty={G - PB + 30} at={7.75} until={8.5}><div style={{position: 'relative', width: 380, height: 236}}><Igloo x={190} y={205} w={230} id="dream" /></div></Thought>}
    <Line t={t} text="here. pay it back with extra." x={640} y={700} at={9.0} until={10} />
    <Line t={t} text="can I have my fish?" x={420} y={G - PB - 70} at={16.8} until={17.6} />
    {partC && <Thought x={760} y={470} w={380} tx={770} ty={G - 330} at={17.6}><div style={{position: 'relative', width: 380, height: 236}}><Vault x={190} y={118} w={170} open={1} fish={0} id="emptyv" /></div></Thought>}
    {partC && <Line t={t} text="still yours." x={940} y={720} at={17.7} size={52} />}
  </>;
};

const VaultSet = ({t}: {t: number}) => {
  const open = t < 6.5 ? ease(r(t, 6.1, 6.5)) : 1 - ease(r(t, 7.0, 7.4));
  const fly = r(t, 6.5, 6.95);
  return <>
    <Vault x={540} y={940} w={620} open={open} fish={t >= 6.95 ? 5 : 0} />
    {fly > 0 && fly < 1 && <FishPile x={lerp(-100, 540, fly)} y={lerp(1500, 1050, fly) - Math.sin(fly * Math.PI) * 300} n={5} w={150} />}
  </>;
};

const EquationSet = ({t}: {t: number}) => <>
  <FishPile x={290} y={1110} n={5} w={200} />
  <Plus x={560} y={1040} at={10.5} size={90} />
  {t >= 10.8 && <FishPile x={780} y={1090} n={1} w={190} seed={3} />}
  <Note text="interest" x={780} y={1320} toX={780} toY={1120} at={11.1} size={70} />
  <Letter text="B pays back" x={540} y={760} at={10.2} size={64} />
</>;

const RichSet = ({t}: {t: number}) => <>
  <Penguin id="rich" outfit="rich" x={540} y={1760} h={1150} pose={{brows: 'angry', turn: -0.15, mouth: talk(t, [[14.8, 15.9]]), flapR: 30 + Math.sin(t * 3) * 6}} />
  <Line t={t} text="your fish. my profit." x={540} y={360} at={14.8} size={84} />
  {[0, 1, 2, 3].map((i) => t > 15 + i * 0.25 ? <Fish key={i} x={170 + i * 250} y={420 + ((t - 15 - i * 0.25) * 900) % 1600} w={150} rot={i * 40 + t * 120} id={`rain${i}`} wag={2} /> : null)}
</>;

const ShockSet = ({t}: {t: number}) => <Penguin id="hero" x={540} y={G} h={PH} pose={{brows: 'shock', eyeScale: 1 + 0.3 * ease(r(t, 18.6, 18.75)), pupil: 0.4, tremble: 1, mouth: 0.3, flapL: 115, flapR: 115}} />;

const FireSet = ({t}: {t: number}) => <>
  <IceBank x={540} y={1290} w={760} id="bank2" />
  {[[230, 900], [360, 880], [540, 860], [720, 880], [850, 900], [300, 1120], [780, 1120], [540, 1100]].map(([x, y], i) => t > 20.1 + i * 0.08 ? <Flame key={i} x={x} y={y} s={1.1} seed={i} /> : null)}
  <Penguin id="hero" x={170} y={1500} h={330} pose={{brows: 'shock', eyeScale: 1.2, pupil: 0.5, flapL: 100, flapR: 100, tremble: 0.6}} />
  <Penguin id="worker" outfit="worker" x={920} y={1500} h={330} pose={{brows: 'worried', flapL: 60, flapR: 60}} seed={0.6} />
</>;

export const PenguinBank = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const shot = [...SHOTS].reverse().find((s) => tc >= s.at)!;
  const s = shot.s * (1 + 0.012 * (tc - shot.at));
  const cam = `translate(${540 - shot.fx * s}px, ${960 - shot.fy * s}px) scale(${s})`;
  const wallet = t < 4.6 ? 5 : 0;
  return <AbsoluteFill style={{background: '#FFFFFF', overflow: 'hidden'}}>
    <HandFont />
    <AbsoluteFill style={{transform: cam, transformOrigin: '0 0'}}>
      {shot.set === 'bank' && <BankSet t={t} />}
      {shot.set === 'vault' && <VaultSet t={t} />}
      {shot.set === 'equation' && <EquationSet t={t} />}
      {shot.set === 'title' && <Title lines={['HOW BANKS', 'MAKE MONEY']} at={12.5} size={150} />}
      {shot.set === 'rich' && <RichSet t={t} />}
      {shot.set === 'shock' && <ShockSet t={t} />}
      {shot.set === 'fire' && <FireSet t={t} />}
    </AbsoluteFill>
    {shot.set !== 'title' && <div style={{position: 'absolute', left: 46, top: 96, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `4px solid ${INK}`, borderRadius: 22, padding: '6px 24px 6px 8px'}}>
      <div style={{position: 'relative', width: 120, height: 64}}><Fish x={60} y={32} w={120} id="wal" /></div>
      <div style={{fontFamily: HAND, fontSize: 76, color: wallet === 0 ? '#D83A2E' : INK, lineHeight: 1, fontWeight: 700}}>× {wallet}</div>
    </div>}
    {[0.55, 0.8, 1.05, 1.3].map((a) => <Sfx key={a} at={a} name="blip" vol={0.3} />)}
    <Sfx at={3.2} name="pop" vol={0.45} />
    {[3.45, 3.73, 4.01, 4.29, 8.05, 8.33, 8.61].map((a) => <Sfx key={a} at={a} name="tick" vol={0.25} />)}
    <Sfx at={4.6} name="flip" vol={0.45} />
    {[4.85, 5.1, 5.35, 9.05, 9.3, 17.75, 18.0].map((a) => <Sfx key={a} at={a} name="blip" vol={0.3} rate={0.7} />)}
    <Sfx at={6.1} name="spring" vol={0.35} /><Sfx at={6.5} name="whoosh" vol={0.35} /><Sfx at={6.95} name="coins" vol={0.4} /><Sfx at={7.35} name="thud" vol={0.5} />
    <Sfx at={7.75} name="pop" vol={0.35} />
    <Sfx at={9.2} name="flip" vol={0.45} />
    <Sfx at={10.5} name="pop" vol={0.4} /><Sfx at={10.8} name="pop" vol={0.4} /><Sfx at={11.1} name="ding" vol={0.5} />
    <Sfx at={12.5} name="riser" vol={0.3} />
    <Sfx at={15.0} name="cash-rain" vol={0.45} /><Sfx at={14.85} name="cha-ching" vol={0.4} />
    {[16.85, 17.1, 17.35].map((a) => <Sfx key={a} at={a} name="blip" vol={0.3} />)}
    <Sfx at={18.6} name="impact" vol={0.8} />
    <Sfx at={20.1} name="roar" vol={0.4} /><Sfx at={20.6} name="sad-horn" vol={0.45} />
  </AbsoluteFill>;
};
