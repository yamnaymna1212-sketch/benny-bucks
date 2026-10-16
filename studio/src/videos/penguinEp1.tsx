// Episode 1 "Rent explained with fish" in the reference (monkey economics) method:
// deadpan narrator explains ONE idea step by step; every narrated line = one simple shot on a white stage
// that shows exactly what is said; reaction close-ups; concept title card; question ending.
// Shots are keyed to the narration timings (studio/src/data/penguin-rent.json), so a new voiceover re-syncs.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FPS, SFX_GAIN} from '../engine';
import {HandFont} from '../sketch';
import {Fish, INK, Line, Penguin, onTwos} from '../penguin/rig';
import {Seagull, Walrus} from '../penguin/cast';
import {BigWord, FishFlight, FishPile, IceBank, Igloo, Letter, Note, Paper, PriceTag, Stamp, Title} from '../penguin/world';
import {Music, perform} from '../penguin/acting';
import TIM from '../data/penguin-rent.json';

const T = (i: number) => TIM[i].start;
export const PENGUIN_EP1_SECONDS = Math.max(61.5, TIM[TIM.length - 1].end + 1.2);
const G = 1180;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const r = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const ease = (p: number) => 1 - Math.pow(1 - p, 3);

const Sfx = ({at, name, vol = 0.4}: {at: number; name: string; vol?: number}) =>
  <Sequence from={Math.round(at * FPS)} layout="none"><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * SFX_GAIN} /></Sequence>;

// ---------- sets (one per narrated idea) ----------
const Hook = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 536, top: 300, width: 8, height: 1100, background: INK, borderRadius: 4, transform: 'rotate(1deg)'}} />
  <Igloo x={340} y={G + 40} w={330} id="hIg" />
  <Penguin id="hero" x={150} y={G + 120} h={400} pose={{brows: 'worried', sweat: true, look: [0.7, 0]}} />
  <PriceTag x={270} y={520} price="$1,800" fish="= 180 fish / mo" at={0} size={1.15} />
  <Walrus x={810} y={G + 120} h={460} pose={{lids: 0.5, look: -0.6, laugh: t > T(1) + 0.3 ? 1 : 0}} />
  {t >= T(1) && <FishPile x={700} y={G + 130} n={9} w={110} seed={1} />}
  <FishFlight x1={200} y1={G} x2={700} y2={G + 130} a={T(1)} b={T(1) + 0.45} n={9} w={110} seed={1} />
  <BigWord text="collects it" x={810} y={520} at={T(1)} color="#2E9E4F" size={100} rot={4} />
</>;

const WalrusIgloo = ({t}: {t: number}) => <>
  <Igloo x={360} y={G} w={420} id="wIg" />
  <Walrus x={770} y={G} h={480} pose={{lids: 0.4, look: -0.8, flap: t > T(3) + 0.2 ? 25 : 0}} />
  <BigWord text="paid: 0 fish" x={540} y={560} at={T(3) + 0.4} color="#D83A2E" size={110} />
</>;

const BankLoan = ({t}: {t: number}) => <>
  <IceBank x={760} y={G + 30} w={560} id="bankL" />
  <Penguin id="banker" outfit="banker" x={760} y={G} h={330} pose={{turn: -0.6, ...(t > T(4) + 0.2 && t < T(4) + 1 ? {flapL: 70} : {})}} seed={1.3} />
  <Walrus x={260} y={G} h={430} flip pose={{lids: t > T(4) + 1 ? 0.5 : 0.2, look: 0.6}} />
  {t >= T(4) + 0.95 && t < T(5) && <FishPile x={420} y={G} n={12} w={110} seed={2} />}
  <FishFlight x1={700} y1={G - 120} x2={420} y2={G} a={T(4) + 0.5} b={T(4) + 0.95} n={12} w={110} seed={2} />
  {t >= T(5) && <>
    <Note text="150 fish / month" x={640} y={560} toX={740} toY={800} at={T(5) + 0.3} size={62} />
    <BigWord text="owes" x={200} y={560} at={T(5)} color="#D83A2E" size={110} />
  </>}
</>;

const FindTenant = ({t}: {t: number}) => {
  const hero = perform(t, -120, [{do: 'walk', at: T(6) + 0.1, to: 300, dur: 1.4}, {do: 'face', at: T(7), turn: 0.6}, {do: 'mood', at: T(7) + 0.6, pose: {beak: 'smile', brows: 'happy'}}]);
  return <>
    <Igloo x={540} y={G - 10} w={380} id="tIg" />
    <Walrus x={850} y={G} h={430} pose={{lids: 0.45, look: -0.8}} />
    <Penguin id="hero" x={hero.x} y={G} h={400} pose={hero.pose} />
    <PriceTag x={560} y={620} price="180 fish" fish="/ month" at={T(7) + 0.8} size={1} />
  </>;
};

// One row: penguin -> walrus -> bank; the money flow repeats every month (like the reference's repeated bank set).
const Flow = ({t}: {t: number}) => {
  const kept = t >= T(11);
  return <>
    <IceBank x={900} y={G - 230} w={300} id="bankF" />
    <Penguin id="hero" x={170} y={G} h={360} pose={{turn: 0.7, look: [0.7, 0], brows: t > T(8) + 0.5 ? 'worried' : 'none'}} />
    <Walrus x={560} y={G} h={400} pose={{lids: kept ? 0.55 : 0.35, look: 0.2, laugh: kept ? 1 : 0}} />
    <Letter text="renter" x={170} y={G + 60} size={48} /><Letter text="landlord" x={560} y={G + 60} size={48} /><Letter text="bank" x={900} y={G + 60} size={48} />
    <FishFlight x1={230} y1={G - 120} x2={470} y2={G - 20} a={T(8) + 0.3} b={T(8) + 0.8} n={9} w={90} seed={3} />
    <BigWord text="180" x={340} y={760} at={T(8) + 0.3} until={T(9)} color={INK} size={100} />
    {t >= T(8) + 0.8 && t < T(9) + 0.3 && <FishPile x={470} y={G - 20} n={9} w={90} seed={3} />}
    <FishFlight x1={470} y1={G - 20} x2={880} y2={G - 300} a={T(9) + 0.3} b={T(9) + 0.8} n={7} w={90} seed={4} />
    <BigWord text="150" x={730} y={700} at={T(9) + 0.3} until={T(10)} color={INK} size={100} />
    {t >= T(9) + 0.3 && <FishPile x={470} y={G - 20} n={2} w={90} seed={5} />}
    {t >= T(10) && t < T(11) + 0.2 && <Seagull x={t < T(10) + 0.6 ? 900 - (t - T(10)) * 700 : 480 + (t - T(10) - 0.6) * 900} y={t < T(10) + 0.6 ? 500 + (t - T(10)) * 700 : 920 - (t - T(10) - 0.6) * 900} h={260} pose={{fly: true, holding: t > T(10) + 0.6}} />}
    <BigWord text="tax" x={480} y={640} at={T(10) + 0.5} until={T(11)} color="#D83A2E" size={100} />
    <BigWord text="+20" x={560} y={640} at={T(11) + 0.2} color="#2E9E4F" size={140} />
  </>;
};

const RaiseRent = ({t}: {t: number}) => <>
  <Igloo x={420} y={G} w={420} id="rIg" />
  <Walrus x={850} y={G} h={430} pose={{lids: 0.55, look: -0.8, flap: t > T(12) + 1.5 ? 30 : 0}} />
  <PriceTag x={420} y={620} price="180" fish="fish / month" at={T(12)} size={1.1} color={INK} />
  {t >= T(12) + 1.8 && <div style={{position: 'absolute', left: 300, top: 600, width: 240, height: 10, background: '#D83A2E', transform: 'rotate(-14deg)', borderRadius: 5}} />}
  <BigWord text="200!" x={700} y={470} at={T(12) + 1.9} color="#D83A2E" size={150} />
</>;

const Paycheck = ({t}: {t: number}) => <>
  <Penguin id="hero" x={380} y={G} h={480} pose={{turn: 0.5, brows: 'worried', beak: 'frown', sweat: true, look: [0.8, -0.2], flapR: 60}} />
  <Paper x={720} y={850} title="PAYCHECK" amount="300 fish" at={T(13) + 0.2} rot={6} />
  <BigWord text="same." x={720} y={1150} at={T(13) + 1.4} color="#D83A2E" size={120} />
</>;

const PaidOff = ({t}: {t: number}) => <>
  <BigWord text="30 years later" x={540} y={480} at={T(15)} size={110} />
  <Igloo x={540} y={G} w={520} id="pIg" />
  <Stamp text="PAID OFF" x={540} y={1000} at={T(15) + 1.6} />
</>;

const WhoPaid = ({t}: {t: number}) => <>
  <Igloo x={540} y={G} w={480} id="qIg" />
  <BigWord text="?" x={540} y={560} at={t < T(18) ? T(16) : T(18)} size={260} color={INK} />
</>;

const OwnsOneFish = ({t}: {t: number}) => <>
  <Penguin id="hero" x={430} y={G} h={480} pose={{look: [0.6, 0.6], brows: 'worried', lids: 0.25}} />
  {t >= T(21) && <Fish x={700} y={G - 40} w={200} rot={-10} rotten={1} id="lastFish" wag={0.3} />}
  <BigWord text="1 fish" x={700} y={760} at={T(21) + 0.2} color="#5E8A3A" size={120} />
</>;

const AnotherIgloo = ({t}: {t: number}) => <>
  <Igloo x={260} y={G} w={330} id="a1" />
  {t >= T(22) + 1.6 && <div style={{position: 'absolute', left: 0, top: 0, transform: `scale(${Math.min(1, ease(r(t, T(22) + 1.6, T(22) + 1.9)) * 1.08)})`, transformOrigin: `820px ${G}px`}}><Igloo x={820} y={G} w={330} id="a2" /></div>}
  <Walrus x={540} y={G + 60} h={420} pose={{lids: 0.55, laugh: t > T(22) + 1.7 ? 1 : 0, look: 0.6}} />
  <BigWord text="#2" x={820} y={720} at={T(22) + 1.8} color="#2E9E4F" size={150} />
</>;

const Ending = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 536, top: 360, width: 8, height: 1000, background: INK, borderRadius: 4, transform: 'rotate(1deg)'}} />
  <Igloo x={340} y={G + 40} w={300} id="eIg1" />
  <Penguin id="hero" x={150} y={G + 120} h={380} pose={{brows: 'worried', beak: 'frown'}} />
  <BigWord text="RENT" x={270} y={560} at={T(23)} color="#D83A2E" size={120} />
  <Igloo x={860} y={G + 40} w={300} id="eIg2" />
  <Penguin id="hero2" x={665} y={G + 120} h={320} pose={{brows: 'happy', beak: 'smile'}} />
  <BigWord text="BUY" x={810} y={560} at={T(23) + 1.4} color="#2E9E4F" size={120} />
  <BigWord text="?" x={540} y={1480} at={T(23) + 2.6} size={200} />
</>;

// ---------- shot list: [start, set, camera scale, focus x, focus y] ----------
type Shot = [number, string, number, number, number];
const SHOTS: Shot[] = [
  [0, 'hook', 1, 540, 960],
  [T(2), 'walrusCU', 2.4, 770, G - 300],
  [T(3), 'walrusIgloo', 1, 540, 960],
  [T(4), 'bank', 1, 540, 960],
  [T(6), 'tenant', 1, 540, 960],
  [T(8), 'flow', 1, 540, 960],
  [T(12), 'raise', 1, 540, 960],
  [T(13), 'paycheck', 1, 540, 960],
  [T(14), 'title', 1, 540, 960],
  [T(15), 'paidoff', 1, 540, 960],
  [T(16), 'who', 1, 540, 960],
  [T(17), 'penguinCU', 2.6, 430, G - 300],
  [T(18), 'who', 1, 540, 960],
  [T(19), 'walrusCU', 2.4, 770, G - 300],
  [T(20), 'onefish', 1, 540, 960],
  [T(21) + 0.7, 'shock', 3, 540, G - 300],
  [T(22), 'another', 1, 540, 960],
  [T(23), 'ending', 1, 540, 960],
];

export const PenguinEp1 = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const [s0, set, sc, fx, fy] = [...SHOTS].reverse().find(([a]) => tc >= a)!;
  const s = sc * (1 + 0.012 * (tc - s0));
  const cam = `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`;
  return <AbsoluteFill style={{background: '#FFFFFF', overflow: 'hidden'}}>
    <HandFont />
    <AbsoluteFill style={{transform: cam, transformOrigin: '0 0'}}>
      {set === 'hook' && <Hook t={t} />}
      {set === 'walrusCU' && <Walrus x={770} y={G} h={480} pose={{lids: 0.55, look: -0.4, laugh: 1, mouth: 0.3}} />}
      {set === 'walrusIgloo' && <WalrusIgloo t={t} />}
      {set === 'bank' && <BankLoan t={t} />}
      {set === 'tenant' && <FindTenant t={t} />}
      {set === 'flow' && <Flow t={t} />}
      {set === 'raise' && <RaiseRent t={t} />}
      {set === 'paycheck' && <Paycheck t={t} />}
      {set === 'title' && <Title lines={['RENT', 'explained with fish']} at={T(14)} size={150} />}
      {set === 'paidoff' && <PaidOff t={t} />}
      {set === 'who' && <WhoPaid t={t} />}
      {set === 'penguinCU' && <Penguin id="hero" x={430} y={G} h={480} pose={{brows: 'worried', beak: 'frown', lids: 0.35, tears: true}} />}
      {set === 'onefish' && <OwnsOneFish t={t} />}
      {set === 'shock' && <Penguin id="hero" x={540} y={G} h={480} pose={perform(t, 540, [{do: 'shock', at: T(21) + 0.7, dur: 9}]).pose} />}
      {set === 'another' && <AnotherIgloo t={t} />}
      {set === 'ending' && <Ending t={t} />}
    </AbsoluteFill>
    {set === 'flow' && tc > T(8) + 0.9 && tc < T(9) && <Line t={t} text="thank you penguin." x={560} y={560} at={T(8) + 0.9} size={64} />}
    {/* narrator + music bed (ducked under the voice) + a few key SFX */}
    <Audio src={staticFile('penguin-rent-voice.mp3')} />
    <Music src="penguin-curious" from={0} until={T(20)} vol={0.2} />
    <Music src="penguin-sad" from={T(20)} until={T(22)} vol={0.24} stops={[T(21) + 0.7]} />
    <Music src="penguin-curious" from={T(22)} until={PENGUIN_EP1_SECONDS} startAt={20} vol={0.2} />
    <Sfx at={T(1)} name="cha-ching" vol={0.3} />
    <Sfx at={T(4) + 0.5} name="whoosh" vol={0.25} />
    <Sfx at={T(10) + 0.6} name="pop" vol={0.3} />
    <Sfx at={T(12) + 1.9} name="pop" vol={0.3} />
    <Sfx at={T(15) + 1.6} name="thud" vol={0.45} />
    <Sfx at={T(21) + 0.7} name="impact" vol={0.6} />
    <Sfx at={T(22) + 1.6} name="pop" vol={0.3} />
  </AbsoluteFill>;
};
