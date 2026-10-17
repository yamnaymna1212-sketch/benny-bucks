// EP1 "Rent Explained by Doug" — built on the user's ElevenLabs narration (tightened: tools/tighten_vo.py).
// Every narrated phrase = one simple, readable picture; locations/framings/transitions change constantly; no music.
// Phrase timings: studio/src/data/doug-rent.json (P(i) = start of phrase i, E(i) = end).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, SFX_GAIN} from '../engine';
import {HandFont} from '../sketch';
import {Fish, INK, Line, Penguin, onTwos, talk} from '../penguin/rig';
import {Walrus} from '../penguin/cast';
import {BigWord, FishFlight, FishPile, HookTitle, IceBank, Igloo, Note, Paper, PriceTag, Sign, SnowPile, Stamp, Thought} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, beat} from '../penguin/edit';
import PH from '../data/doug-rent.json';

const P = (i: number) => PH[i].start, E = (i: number) => PH[i].end;
export const DOUG_RENT_SECONDS = Math.ceil((PH[PH.length - 1].end + 0.6) * 30) / 30;
const G = 1250;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const r = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const ease = (p: number) => 1 - Math.pow(1 - p, 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const RED = '#D83A2E', GREEN = '#2E9E4F';

const Sfx = ({at, name, vol = 0.35}: {at: number; name: string; vol?: number}) =>
  <Sequence from={Math.round(at * FPS)} layout="none"><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * SFX_GAIN} /></Sequence>;

// Light snowfall so held shots never feel frozen.
const Snowfall = ({t}: {t: number}) => <>{Array.from({length: 22}, (_, i) => {
  const sp = 50 + (i * 37) % 60, x = (i * 173) % 1080 + Math.sin(t * 0.9 + i) * 26, y = ((i * 311) % 2000 + t * sp) % 2000 - 60;
  return <div key={i} style={{position: 'absolute', left: x, top: y, width: 9 + (i % 3) * 4, height: 9 + (i % 3) * 4, borderRadius: '50%', background: '#D6E8F3'}} />;
})}</>;

// Hand-drawn gold crown that drops onto Larry's hat in the hook.
const Crown = ({x, y, t, at}: {x: number; y: number; t: number; at: number}) => {
  const p = ease(r(t, at, at + 0.3));
  return <svg width={170} height={110} viewBox="0 0 170 110" style={{position: 'absolute', left: x - 85, top: y - 55 - (1 - p) * 300, opacity: p, transform: `rotate(${Math.sin(t * 3) * 4}deg)`}}>
    <path d="M10 100 L20 30 L55 65 L85 10 L115 65 L150 30 L160 100 Z" fill="#F2C230" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={85} cy={70} r={10} fill={RED} stroke={INK} strokeWidth={4} />
  </svg>;
};

// ---------- sets ----------
const Hook = ({t}: {t: number}) => {
  const larryOwns = t >= P(3) + 0.2;
  return <>
    <HookTitle lines={['Rent Explained', 'by Doug']} at={-1} y={400} />
    <div style={{position: 'absolute', left: 0, top: 0, transform: `translateX(${larryOwns ? lerp(0, 120, ease(r(t, P(3) + 0.2, P(3) + 0.6))) : 0}px)`}}>
      <Igloo x={540} y={G - 60} w={300} id="hkIg" />
    </div>
    <Penguin id="doug" x={220} y={G} h={440} pose={{brows: 'worried', sweat: true, turn: 0.3, look: [0.6, 0], flapL: t > P(1) ? 70 : 6, flapR: t > P(1) ? 70 : 6, beak: t > P(1) ? 'frown' : 'flat'}} />
    <Walrus x={860} y={G} h={440} pose={{lids: 0.5, look: -0.6, laugh: larryOwns ? 1 : 0}} />
    <PriceTag x={220} y={G + 140} price="180 fish" fish="every month" at={P(0) + 0.3} size={0.8} />
    <BigWord text="own: 0" x={220} y={620} at={P(1) + 0.3} color={RED} size={90} />
    <PriceTag x={860} y={G + 140} price="owner" at={P(2) + 0.3} size={0.8} color={GREEN} rot={5} />
    {larryOwns && <Crown x={860} y={736} t={t} at={P(3) + 0.2} />}
    <BigWord text="own: igloo" x={850} y={610} at={P(3) + 0.4} color={GREEN} size={84} rot={4} />
  </>;
};

const Shiver = ({t}: {t: number}) => <>
  <Snowfall t={t} />
  <SnowPile x={830} y={G + 4} w={260} id="snS" />
  <Penguin id="doug" x={420} y={G} h={560} pose={{tremble: 0.5, brows: 'worried', beak: 'frown', flapL: 20, flapR: 20, look: [0.4, -0.3], ...(t < P(5) ? {flapR: 95 + Math.sin(t * 13) * 25} : {})}} />
  <Thought x={720} y={640} w={400} tx={560} ty={G - 480} at={P(5) + 0.1}><div style={{position: 'relative', width: 400, height: 248}}><Igloo x={200} y={220} w={240} id="dreamIg" /></div></Thought>
</>;

const Price = ({t}: {t: number}) => <>
  <Igloo x={540} y={G - 130} w={520} id="bigIg" />
  <PriceTag x={540} y={620} price="30,000 fish" at={P(6) + 0.2} size={1.3} />
  {t >= P(7) && <>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, background: '#fff'}} />
    <Penguin id="doug" x={330} y={G + 80} h={520} pose={{look: [0.7, 0.6], brows: 'worried', flapR: 40}} />
    <FishPile x={720} y={G + 70} n={12} w={120} seed={7} />
    <BigWord text="12" x={720} y={760} at={P(7) + 0.4} size={170} color={RED} />
  </>}
</>;

const LarryBroke = ({t}: {t: number}) => <>
  <Walrus x={540} y={G + 60} h={620} pose={{lids: 0.1, look: 0, flap: 40 + Math.sin(t * 9) * 10, mouth: 0}} />
  <BigWord text="0 fish" x={540} y={600} at={P(8) + 0.9} color={RED} size={130} />
</>;

const BankLoan = ({t}: {t: number}) => <>
  <IceBank x={720} y={G + 30} w={620} id="bankL" />
  <Penguin id="banker" outfit="banker" x={720} y={G} h={360} seed={1.3} pose={{turn: -0.6, beak: 'smile', ...(t > P(10) && t < P(10) + 1 ? {flapL: 75} : {})}} />
  <Walrus x={230} y={G} h={430} flip pose={{lids: t > P(10) + 0.8 ? 0.55 : 0.15, look: 0.6, laugh: t > P(10) + 0.8 ? 1 : 0}} />
  <FishFlight x1={640} y1={G - 140} x2={380} y2={G} a={P(10) + 0.3} b={P(10) + 0.8} n={14} w={110} seed={2} />
  {t >= P(10) + 0.8 && <FishPile x={380} y={G} n={14} w={110} seed={2} />}
</>;

const Owe = ({t}: {t: number}) => <>
  <Igloo x={360} y={G} w={440} id="oweIg" />
  <Walrus x={720} y={G} h={420} pose={{lids: t < P(12) ? 0.5 : 0.15, look: 0.3, laugh: t < P(12) ? 1 : 0}} />
  <Stamp text="SOLD" x={360} y={900} at={P(11) + 0.3} color={GREEN} size={90} />
  <IceBank x={930} y={720} w={230} id="bankO" />
  <Note text="owes the bank" x={560} y={560} toX={850} toY={640} at={P(12) + 0.2} size={58} />
  <BigWord text="150 fish" x={720} y={1000} at={P(13)} color={RED} size={120} />
  <BigWord text="every month" x={720} y={1110} at={P(14)} color={INK} size={70} />
</>;

const FindDoug = ({t}: {t: number}) => {
  const spot = t >= P(16);
  return <>
    <Snowfall t={t} />
    <Igloo x={250} y={G - 40} w={360} id="fdIg" />
    <Walrus x={500} y={G} h={420} flip pose={{lids: spot ? 0.5 : 0.2, look: spot ? 0.9 : -0.2, laugh: spot ? 1 : 0, flap: t < P(16) ? Math.abs(Math.sin(t * 6)) * 25 : 0}} />
    <Penguin id="doug" x={880} y={G} h={330} pose={{tremble: 0.5, brows: 'worried', look: [-0.6, 0], turn: -0.4}} />
    {!spot && <BigWord text="pay?" x={500} y={700} at={P(15) + 0.3} color={RED} size={110} />}
    {spot && <BigWord text="!" x={880} y={820} at={P(16) + 0.3} color={RED} size={160} />}
  </>;
};

const NiceIgloo = ({t}: {t: number}) => <>
  <Walrus x={560} y={G + 200} h={760} pose={{lids: 0.55, look: 0.4, mouth: talk(t, [[P(17), E(17)], [P(18), E(18)]])}} />
  <Line t={t} text="nice igloo." x={540} y={420} at={P(17)} size={92} />
  <BigWord text="180 fish." x={540} y={560} at={P(18)} color={RED} size={120} />
</>;

const Flow = ({t}: {t: number}) => <>
  <IceBank x={900} y={G - 260} w={300} id="bankF" />
  <Penguin id="doug" x={170} y={G} h={360} pose={{turn: 0.7, look: [0.7, 0], brows: t > P(19) + 0.6 ? 'worried' : 'none', beak: t > P(19) + 0.6 ? 'frown' : 'flat'}} />
  <Walrus x={560} y={G} h={400} pose={{lids: t >= P(21) ? 0.55 : 0.35, look: 0.2, laugh: t >= P(21) ? 1 : 0}} />
  <FishFlight x1={230} y1={G - 120} x2={470} y2={G - 20} a={P(19) + 0.4} b={P(19) + 0.9} n={9} w={90} seed={3} />
  <BigWord text="180" x={330} y={760} at={P(19) + 0.4} until={P(20)} size={110} />
  {t >= P(19) + 0.9 && t < P(20) + 0.4 && <FishPile x={470} y={G - 20} n={9} w={90} seed={3} />}
  <FishFlight x1={470} y1={G - 20} x2={880} y2={G - 330} a={P(20) + 0.4} b={P(20) + 0.9} n={7} w={90} seed={4} />
  <BigWord text="150" x={730} y={700} at={P(20) + 0.4} until={P(21)} size={110} />
  {t >= P(20) + 0.4 && <FishPile x={470} y={G - 20} n={2} w={90} seed={5} />}
  <BigWord text="+30" x={560} y={660} at={P(21) + 0.2} color={GREEN} size={150} />
</>;

// Signature gag: Doug stares into the lens, one blink, total silence.
const Stare = ({t, low}: {t: number; low?: boolean}) => <Penguin id="doug" x={540} y={low ? G + 420 : G + 260} h={low ? 1100 : 900} pose={{lids: 0.35, look: [0, 0], beak: 'flat'}} />;

const SameIgloo = ({t}: {t: number}) => <>
  <Igloo x={540} y={G} w={560} id="sIg" />
  <Penguin id="doug" x={150} y={G + 40} h={330} pose={{turn: 0.6, look: [0.6, -0.3]}} />
  <Walrus x={930} y={G + 40} h={330} pose={{lids: 0.5, look: -0.6}} />
  <BigWord text="RENT" x={300} y={760} at={P(23)} color={RED} size={110} rot={-6} />
  <BigWord text="MORTGAGE" x={780} y={760} at={P(24)} color="#2F5DA8" size={90} rot={5} />
  <BigWord text="same igloo" x={540} y={560} at={P(25)} size={100} />
  {t >= P(26) && <Sign x={540} y={G - 40} text="LARRY" w={260} id="larrySign" />}
</>;

const Stat = ({t}: {t: number}) => <>
  <Penguin id="r1" x={300} y={G} h={460} pose={{sweat: true, brows: 'worried', flapR: 60, turn: 0.4}} />
  <Penguin id="r2" x={780} y={G} h={460} build="thin" pose={{sweat: true, brows: 'worried', flapL: 60, turn: -0.4}} seed={0.7} />
  <Paper x={440} y={840} w={230} title="PAYCHECK" amount="30%+" at={P(27) + 1.2} rot={-8} id="pc1" />
  <BigWord text="1 in 2 US renters" x={540} y={460} at={P(27) + 0.3} size={86} />
  <BigWord text="30%+ → rent" x={540} y={600} at={P(27) + 2.6} color={RED} size={110} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 34, color: '#888'}}>Harvard JCHS, 2024</div>
</>;

const ThirtyYears = ({t}: {t: number}) => <>
  <BigWord text="30 years later" x={540} y={460} at={P(28)} size={110} />
  <Igloo x={420} y={G} w={480} id="tyIg" />
  <IceBank x={880} y={G - 330} w={260} id="bankT" />
  <Penguin id="banker" outfit="banker" x={880} y={G - 330} h={190} seed={1.3} pose={t >= P(29) ? {beak: 'smile', brows: 'happy', flapL: 100 + Math.sin(t * 16) * 20, flapR: 100 - Math.sin(t * 16) * 20, hop: Math.abs(Math.sin(t * 9)) * 20} : {}} />
  {t >= P(30) && <Walrus x={720} y={G + 30} h={360} flip pose={{lids: 0.6, laugh: 1, look: -0.6}} />}
  <Stamp text="PAID OFF" x={420} y={1010} at={P(30) + 0.2} />
</>;

const OneFish = ({t}: {t: number}) => <>
  <Penguin id="doug" x={420} y={G} h={520} pose={{look: [0.6, 0.6], brows: 'worried', lids: 0.25, beak: 'frown'}} />
  {t >= P(32) && <Fish x={760} y={G - 40} w={220} rot={-10} rotten={1} id="lastFish" wag={0.3} />}
  <BigWord text="1 fish" x={760} y={800} at={P(32) + 0.1} color="#5E8A3A" size={130} />
</>;

const NewDoug = ({t}: {t: number}) => {
  const pop = ease(r(t, P(34) + 0.6, P(34) + 0.9));
  const nx = lerp(1250, 830, ease(r(t, P(35), P(35) + 1.1)));
  return <>
    <Igloo x={250} y={G} w={320} id="nd1" />
    {pop > 0 && <div style={{position: 'absolute', left: 0, top: 0, transform: `scale(${Math.min(1.06, pop * 1.06)})`, transformOrigin: `560px ${G}px`}}><Igloo x={560} y={G} w={320} id="nd2" /></div>}
    <Walrus x={420} y={G + 140} h={380} pose={{lids: 0.55, laugh: t > P(34) + 0.6 ? 1 : 0, look: t > P(35) ? 0.9 : 0.2}} flip />
    <BigWord text="#2" x={560} y={760} at={P(34) + 0.8} color={GREEN} size={140} />
    {t >= P(35) && <Penguin id="newdoug" x={nx} y={G} h={330} build="thin" pose={{tremble: 0.5, brows: 'worried', walk: t < P(35) + 1.1 ? t * 1.8 : null, turn: -0.8, look: [-0.6, 0]}} />}
    {t >= P(35) + 0.9 && <BigWord text="new Doug" x={830} y={820} at={P(35) + 0.9} color={RED} size={80} />}
  </>;
};

const Cta = ({t}: {t: number}) => <>
  <BigWord text="RENT or BUY?" x={540} y={520} at={P(36)} size={130} />
  <Penguin id="doug" x={540} y={G + 120} h={640} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
  
</>;

// ---------- shot list ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; s?: number; fx?: number; fy?: number; fx_?: Fx; push?: [number, number]};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(4), set: (t) => <Shiver t={t} />, fx_: 'pop'},
  {at: P(6), set: (t) => <Price t={t} />},
  {at: P(8), set: (t) => <LarryBroke t={t} />, fx_: 'swipe'},
  {at: P(9), set: (t) => <BankLoan t={t} />, fx_: 'zoom'},
  {at: P(11), set: (t) => <Owe t={t} />},
  {at: P(15), set: (t) => <FindDoug t={t} />, fx_: 'swipeL'},
  {at: P(17), set: (t) => <NiceIgloo t={t} />, fx_: 'pop'},
  {at: P(19), set: (t) => <Flow t={t} />},
  {at: P(22), set: (t) => <Stare t={t} />, fx_: 'zoom'},
  {at: P(23), set: (t) => <SameIgloo t={t} />},
  {at: P(27), set: (t) => <Stat t={t} />, fx_: 'iris'},
  {at: P(28), set: (t) => <ThirtyYears t={t} />, fx_: 'swipe'},
  {at: P(31), set: (t) => <OneFish t={t} />},
  {at: P(33), set: (t) => <Stare t={t} low />, fx_: 'zoom'},
  {at: P(34), set: (t) => <NewDoug t={t} />},
  {at: P(36), set: (t) => <Cta t={t} />, fx_: 'pop'},
];

// Deep zooms: [phrase, focusX, focusY, scale] — dive onto the face / object the narrator names.
const DEEP: [number, number, number, number][] = [
  [7, 560, 1150, 1.6], [13, 720, 1050, 1.5], [16, 880, 1060, 1.9],
  [21, 560, 900, 1.6], [26, 540, 1150, 1.5], [30, 560, 1050, 1.5], [32, 760, 1150, 1.8], [35, 830, 1050, 1.7], [37, 540, 1000, 1.4],
];

// Camera = slow push only; in the hook it pushes toward the side being named (Doug left, then Larry right).
const camFor = (tc: number, sh: Shot) => {
  if (sh.at === 0) {
    const toDoug = ease(r(tc, 0, P(2))) * (1 - ease(r(tc, P(2), P(2) + 0.3)));
    const toLarry = ease(r(tc, P(2), P(3) + 1));
    return {s: 1 + 0.045 * toDoug + 0.045 * toLarry, fx: 540 - 60 * toDoug + 60 * toLarry, fy: 960 + 30 * (toDoug + toLarry)};
  }
  return {s: 1 + 0.015 * (tc - sh.at), fx: 540, fy: 960};
};

export const DougRent = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  const {s: s0, fx, fy} = camFor(tc, sh);
  // deep zoom on chosen phrases: the camera dives onto the subject being named, then the next phrase releases it
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15);
  const dp = dz ? ease(r(tc, P(dz[0]), P(dz[0]) + 0.22)) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, PH);
  const fxx = dz ? fx + (dz[1] - fx) * dp : fx, fyy = dz ? fy + (dz[2] - fy) * dp : fy;
  const cam = `translate(${540 - fxx * s}px, ${960 - fyy * s}px) scale(${s})`;
  const fxStyle = cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})));
  return <AbsoluteFill style={{background: '#FFFFFF', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={fxStyle}>
      <AbsoluteFill style={{transform: cam, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={PH} />
    <Audio src={staticFile('doug-rent-voice.mp3')} />
    {/* rhythm SFX: a fast swoosh on every cut, a pop on every big word, animal voices on the characters */}
    {SHOTS.slice(1).map((x, i) => <Sfx key={`sw${i}`} at={x.at - 0.05} name="swoosh-fast" vol={0.18} />)}
    <Sfx at={P(3) + 0.25} name="walrus-laugh" vol={0.4} />
    <Sfx at={P(4)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(7) + 0.4} name="penguin-honk" vol={0.3} />
    <Sfx at={P(8) + 0.9} name="walrus-grunt" vol={0.4} />
    <Sfx at={P(10) + 0.8} name="walrus-laugh" vol={0.35} />
    <Sfx at={P(15) + 0.3} name="walrus-grunt" vol={0.35} />
    <Sfx at={P(16) + 0.3} name="penguin-squawk" vol={0.3} />
    <Sfx at={P(21) + 0.3} name="walrus-laugh" vol={0.35} />
    <Sfx at={P(29)} name="penguin-honk" vol={0.3} />
    <Sfx at={P(32) + 0.1} name="splat" vol={0.35} />
    <Sfx at={P(35) + 0.2} name="penguin-squawk" vol={0.3} />
    {[P(1) + 0.3, P(6) + 0.2, P(13), P(18), P(23), P(24), P(28), P(36)].map((a, i) => <Sfx key={`pp${i}`} at={a} name="pop-high" vol={0.25} />)}
    <Sfx at={P(0) + 0.3} name="cha-ching" vol={0.25} />
    <Sfx at={P(7) + 0.4} name="pop" />
    <Sfx at={P(10) + 0.3} name="whoosh" vol={0.25} />
    <Sfx at={P(11) + 0.3} name="thud" vol={0.35} />
    <Sfx at={P(19) + 0.9} name="cha-ching" vol={0.22} /><Sfx at={P(20) + 0.9} name="cha-ching" vol={0.22} />
    <Sfx at={P(26) + 0.1} name="thud" vol={0.4} />
    <Sfx at={P(30) + 0.2} name="thud" vol={0.4} />
    <Sfx at={P(34) + 0.6} name="pop" />
  </AbsoluteFill>;
};
