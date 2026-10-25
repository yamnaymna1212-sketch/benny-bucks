// EP "Why Rich Countries Lend" (IMF) — Rich Island (Walrus) lends fish to Broke Island (Doug).
// Hook = the user's USA-vs-Iran image clip (tools/hook_iran.py -> public/doug-imf-hook.mp4, has its own SFX).
// Line timings: studio/src/data/doug-imf.json (free Kokoro am_puck 1.0 VO, one line per phrase).
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Walrus} from '../penguin/cast';
import {BigWord, FishFlight, FishPile, Paper, PriceTag, Stamp, Thought, Title} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {Sled, Sparkles} from './dougLaundering';
import TIM from '../data/doug-imf.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_IMF_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1200, SEA = G + 40;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const RED = '#D83A2E', GREEN = '#2E9E4F';

// ---------- world ----------
const Sea = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: -400, right: -400, top: SEA, height: 1000, background: '#8FD3F4', borderTop: `5px solid ${INK}`}} />
  {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: 'absolute', left: ((i * 233 + t * 40) % 1300) - 150, top: SEA + 60 + (i % 3) * 90, width: 90, height: 14, borderRadius: 7, background: '#fff', opacity: 0.8}} />)}
</>;
// Floating ice island: flat top at y, `cracks` for the broke one, `sink` 0..1 tilts it under water.
const Island = ({x, y, w, cracks, sink = 0}: {x: number; y: number; w: number; cracks?: boolean; sink?: number}) =>
  <svg width={w} height={w * 0.5} viewBox="0 0 200 100" style={{position: 'absolute', left: x - w / 2, top: y + sink * w * 0.45, transform: `rotate(${sink * 18}deg)`, overflow: 'visible'}}>
    <path d="M4 6 L196 6 L176 40 L150 80 L100 96 L50 80 L22 40 Z" fill="#EAF7FD" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M4 6 L196 6 L190 18 L10 18 Z" fill="#fff" stroke={INK} strokeWidth={3} />
    {cracks && <path d="M70 6 L80 30 L72 50 L84 76 M130 6 L122 34 L134 58" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />}
  </svg>;
const Crate = ({x, y, w = 220, label}: {x: number; y: number; w?: number; label: string}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.6, width: w, height: w * 0.6, background: '#C98C4E', border: `6px solid ${INK}`, borderRadius: 8, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: w * 0.2, color: INK}}>{label}</div>;
const Shop = ({x, y, w = 420}: {x: number; y: number; w?: number}) => <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.9, width: w, height: w * 0.9}}>
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: w * 0.22, background: RED, border: `6px solid ${INK}`, borderRadius: 12, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.09, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>WALRUS NETS & BOATS</div>
  <div style={{position: 'absolute', left: w * 0.05, right: w * 0.05, top: w * 0.22, bottom: 0, background: '#FFF4DE', border: `6px solid ${INK}`, borderTop: 'none'}} />
</div>;
const Argentina = ({x, y, w = 330}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={w * 0.64} viewBox="0 0 190 120" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.32}}>
    <rect width={190} height={120} fill="#fff" /><rect width={190} height={40} fill="#74ACDF" /><rect y={80} width={190} height={40} fill="#74ACDF" />
    <circle cx={95} cy={60} r={13} fill="#F6B40E" stroke="#85340A" strokeWidth={2} />
    <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} /></svg>;
const Arrow = ({x1, y1, x2, y2, p, color = RED}: {x1: number; y1: number; x2: number; y2: number; p: number; color?: string}) => p <= 0 ? null :
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <path d={`M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 220} ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
    {p > 0.95 && <circle cx={x2} cy={y2} r={20} fill={color} />}
  </svg>;

// ---------- sets ----------
const Intro = ({t}: {t: number}) => <>
  <Sea t={t} />
  <Island x={540} y={G - 20} w={620} cracks />
  <Penguin id="doug" x={t >= P(3) ? 420 : 540} y={G - 6} h={480} pose={t >= P(3) ? {brows: 'worried', beak: 'frown', look: [0.8, 0.3], turn: 0.4} : {beak: 'smile', brows: 'happy', flapR: 60 + Math.sin(t * 8) * 20}} />
  <BigWord text="Doug" x={540} y={460} at={P(1)} until={P(2)} size={170} />
  <BigWord text="broke island" x={540} y={460} at={P(2)} until={P(3)} size={130} />
  {t >= P(3) && <Crate x={720} y={G - 6} label="FISH" />}
  <BigWord text="0 fish" x={560} y={460} at={P(3)} size={170} color={RED} />
</>;

const Rich = ({t}: {t: number}) => <>
  <Sea t={t} />
  <Island x={540} y={G - 20} w={980} />
  <FishPile x={620} y={G - 6} n={22} w={150} seed={2} />
  <Walrus x={330} y={G - 6} h={520} pose={{lids: 0.5, look: 0.4, laugh: Math.sin(t * 3) > 0.5 ? 1 : 0}} />
  <Sparkles x={700} y={640} t={t} />
  <BigWord text="mountain of fish" x={540} y={380} at={P(4)} size={110} color={GREEN} />
</>;

const Want = ({t}: {t: number}) => <>
  <Sea t={t} />
  <Island x={300} y={G - 20} w={560} cracks />
  <Penguin id="doug" x={300} y={G - 6} h={460} pose={{look: [0.7, -0.7], brows: 'happy', beak: 'smile', blush: 1}} />
  <Thought x={430} y={430} w={520} tx={320} ty={780} at={P(5)}><Sled x={260} y={230} w={300} color="#F2C230" /></Thought>
  <PriceTag x={760} y={880} price="100 fish" fish="= $1,000" at={P(6)} color={RED} />
</>;

const Lend = ({t}: {t: number}) => {
  const owe = t >= P(8);
  return <>
    <Sea t={t} />
    <Island x={230} y={G - 20} w={440} />
    <Island x={850} y={G - 20} w={380} cracks />
    <FishPile x={260} y={G - 6} n={9} w={110} seed={4} />
    <Walrus x={180} y={G - 6} h={400} pose={{look: 0.6, mouth: owe ? 0.6 : 0, lids: 0.4}} />
    <Penguin id="doug" x={850} y={G - 6} h={380} pose={owe ? {brows: 'shock', eyeScale: 1.3, beak: 'frown', look: [-0.6, 0]} : {beak: 'smile', brows: 'happy', look: [-0.8, -0.3], flapL: 100}} />
    <FishFlight x1={260} y1={G - 300} x2={850} y2={G - 380} a={P(7) + 0.2} b={P(7) + 1.2} n={5} w={95} />
    {t >= P(7) + 1.2 && <FishPile x={930} y={G - 6} n={5} w={95} />}
    <BigWord text="lend 100" x={540} y={420} at={P(7)} until={P(8)} size={140} color={GREEN} />
    <Paper x={540} y={620} w={300} title="DOUG OWE" amount={owe ? '110 fish' : '100 fish'} at={P(7) + 0.6} id="iou" />
    <BigWord text="+10 fish" x={540} y={360} at={P(9)} size={150} color={RED} />
  </>;
};

const Poor = ({t}: {t: number}) => t < P(12) ? <>
  <Sea t={t} />
  <Island x={540} y={G - 20} w={620} cracks />
  <Penguin id="doug" x={540} y={G - 6} h={520} pose={{brows: 'worried', beak: 'frown', flapL: 30 + Math.sin(t * 9) * 15, flapR: 30 - Math.sin(t * 9) * 15, look: [0, 0.4]}} />
  <Crate x={820} y={G - 6} w={180} label="0" />
  <Stamp text="CAN'T PAY" x={540} y={520} at={P(11) + 0.2} color={RED} size={110} />
</> : <>
  <div style={{position: 'absolute', inset: -400, background: '#E9EDF0'}} />
  <Penguin id="doug" x={540} y={G + 300} h={950} pose={{lids: 0.35, brows: 'worried', beak: 'frown', tears: true}} />
  <BigWord text="Doug poor." x={540} y={340} at={P(12)} size={140} color={RED} />
</>;

const Roll = ({t}: {t: number}) => {
  const debt = t < P(15) ? (t >= P(14) ? 110 : 100) : Math.round(110 * Math.pow(1.1, cl((t - P(15)) / 0.45, 0, 12)));
  return <>
    <Sea t={t} />
    <Island x={230} y={G - 20} w={440} />
    <Island x={850} y={G - 20} w={380} cracks />
    <Walrus x={200} y={G - 6} h={400} pose={{laugh: t >= P(15) ? 1 : 0, lids: 0.5, look: 0.6}} />
    <Penguin id="doug" x={850} y={G - 6} h={380} pose={{brows: 'worried', beak: 'frown', look: [-0.6, -0.2], sweat: t >= P(15)}} />
    <FishFlight x1={260} y1={G - 300} x2={850} y2={G - 380} a={P(13) + 0.1} b={P(13) + 1.0} n={6} w={95} />
    <FishFlight x1={850} y1={G - 380} x2={260} y2={G - 300} a={P(14) + 0.3} b={P(14) + 1.2} n={6} w={95} seed={3} arc={-260} />
    <Arrow x1={300} y1={700} x2={800} y2={700} p={ease((t - P(13)) / 0.5)} color={GREEN} />
    <Arrow x1={800} y1={900} x2={300} y2={900} p={ease((t - P(14)) / 0.5)} color={RED} />
    {t >= P(15) && <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 150, color: RED, transform: `scale(${1 + 0.04 * Math.sin(t * 30)})`}}>DEBT {debt}</div>}
    <BigWord text="same fish" x={540} y={400} at={P(14)} until={P(15)} size={120} />
    <BigWord text="never end" x={540} y={560} at={P(16)} size={120} color={RED} />
  </>;
};

const Why = ({t}: {t: number}) => <>
  <Sea t={t} />
  <Island x={540} y={G - 20} w={900} />
  <FishPile x={700} y={G - 6} n={14} w={130} seed={6} />
  <Walrus x={420} y={G - 6} h={560} pose={{look: -0.2, lids: 0.3, flap: Math.sin(t * 4) * 0.5}} />
  <Thought x={360} y={320} w={460} tx={420} ty={700} at={P(18)} until={P(19)}><div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 150, color: RED}}>?</div></Thought>
  {[1, 2, 3].map((n, i) => <BigWord key={n} text={`${n}`} x={260 + i * 280} y={360} at={P(19) + i * 0.25} size={200} color={i === 1 ? GREEN : INK} />)}
</>;

const Reason1 = ({t}: {t: number}) => {
  const s = ease((t - P(20) - 1.2) / 1.2);
  return <>
    <Sea t={t} />
    <Island x={250} y={G - 20} w={420} />
    <Walrus x={220} y={G - 6} h={420} pose={{mouth: s > 0 ? 1 : 0, lids: 0.1, look: 0.8, flap: s}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(0, ${s * 260}px) rotate(${s * 14}deg)`, transformOrigin: '830px 1180px'}}>
      <Island x={830} y={G - 20} w={420} cracks />
      <Penguin id="doug" x={830} y={G - 6} h={360} pose={{brows: 'shock', eyeScale: 1.3, beak: 'frown', flapL: 130, flapR: 130}} />
      <FishPile x={930} y={G - 6} n={5} w={90} />
    </div>
    <div style={{position: 'absolute', left: -400, right: -400, top: SEA + 40, height: 900, background: '#8FD3F4', opacity: 0.85}} />
    <BigWord text="1" x={140} y={360} at={P(20)} size={220} />
    <BigWord text="sink = lose all fish" x={600} y={420} at={P(20) + 1.2} size={92} color={RED} />
  </>;
};

const Reason2 = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 900, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
  <Shop x={600} y={G} w={420} />
  <Walrus x={890} y={G} h={360} pose={{mouth: 0.5, lids: 0.4, look: -0.5}} flip />
  <Penguin id="doug" x={250} y={G} h={420} pose={{turn: 0.6, look: [0.8, 0], beak: 'smile', flapR: 90}} />
  <FishFlight x1={300} y1={G - 330} x2={880} y2={G - 380} a={P(22)} b={P(22) + 0.9} n={6} w={95} />
  <BigWord text="2" x={140} y={360} at={P(21)} size={220} />
  <BigWord text="fish come back" x={600} y={360} at={P(22)} size={100} color={GREEN} />
</>;

const Reason3 = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 900, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
  <Walrus x={700} y={G} h={620} pose={{look: -0.7, lids: 0.6, mouth: t >= P(24) ? 0.6 : 0, flap: t >= P(24) ? 1 : 0}} flip />
  <Penguin id="doug" x={260} y={G} h={380} pose={t >= P(24) ? {lean: 25, brows: 'worried', beak: 'frown', look: [0.6, 0.6]} : {brows: 'worried', look: [0.8, -0.6]}} />
  <Paper x={420} y={620} w={240} title="DOUG OWE" amount="1,000 fish" at={P(23) + 0.3} id="iou3" />
  <BigWord text="3" x={140} y={360} at={P(23)} size={220} />
  <BigWord text="yes boss" x={300} y={820} at={P(24) + 0.6} size={90} />
</>;

const Owned = ({t}: {t: number}) => t < P(26) ? <Title lines={['POWER']} y={880} at={P(25) + 0.2} size={200} /> : <>
  <div style={{position: 'absolute', inset: -400, background: '#E9EDF0'}} />
  <Penguin id="doug" x={540} y={G + 300} h={950} pose={{lids: 0.4, brows: 'worried', beak: 'frown', sweat: true}} />
  <BigWord text="Doug owned." x={540} y={340} at={P(26)} size={140} color={RED} />
</>;

const RealLife = ({t}: {t: number}) => <>
  <BigWord text="real life" x={540} y={300} at={P(27)} size={120} />
  {t >= P(28) && <Argentina x={540} y={560} />}
  <BigWord text="IMF 2018" x={540} y={820} at={P(28) + 0.3} size={110} rot={0} />
  <BigWord text="$44,000,000,000" x={540} y={980} at={P(28) + 1.4} size={112} color={RED} rot={0} />
  {t >= P(29) && <Stamp text="BIGGEST LOAN EVER" x={540} y={1180} at={P(29) + 0.2} color={RED} size={70} />}
  {t >= P(30) && <><BigWord text="2025:" x={330} y={1350} at={P(30) + 0.4} size={100} rot={0} /><BigWord text="+$20B" x={700} y={1350} at={P(30) + 0.9} size={110} color={RED} rot={0} /></>}
  <div style={{position: 'absolute', left: 0, right: 0, top: 1680, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 30, color: '#888'}}>IMF: 2018 Stand-By Arrangement, 2025 Extended Fund Facility</div>
</>;

const Control = ({t}: {t: number}) => <>
  <Sea t={t} />
  <Island x={540} y={G - 20} w={980} />
  <FishPile x={540} y={G - 6} n={26} w={150} seed={8} />
  <Walrus x={540} y={G - 300} h={460} pose={{laugh: 1, lids: 0.5}} />
  <div style={{position: 'absolute', left: 470, top: G - 760, fontSize: 130}}>👑</div>
  <BigWord text="no loss" x={540} y={330} at={P(31)} until={P(32)} size={140} color={GREEN} />
  <BigWord text="control" x={540} y={330} at={P(32)} size={160} color={RED} />
</>;

const Ending = ({t}: {t: number}) => {
  const bad = t >= P(35), pull = ease((t - P(36) - 0.3) / 1.4);
  return <>
    {bad ? <div style={{position: 'absolute', inset: -400, background: '#E9EDF0'}} /> : null}
    <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 900, background: bad ? '#D5DBE0' : '#E4F4FC', borderTop: `5px solid ${INK}`}} />
    <Sled x={lerp(540, 1500, pull)} y={G} w={420} color="#F2C230" />
    {!bad && <Penguin id="doug" x={540} y={G - 120} h={440} pose={{beak: 'smile', brows: 'happy', lids: 0.3, blush: 1, flapL: 120 + Math.sin(t * 8) * 10, flapR: 120}} />}
    {!bad && t >= P(34) && <Sparkles x={540} y={560} t={t} />}
    {bad && <Penguin id="doug" x={360} y={G} h={440} pose={{brows: 'worried', beak: 'frown', tears: true, look: [0.8, 0]}} />}
    {bad && <Walrus x={lerp(880, 1600, pull)} y={G} h={480} pose={{laugh: 1, lids: 0.5, look: -0.6}} />}
    {t >= P(36) && <Stamp text="WALRUS" x={lerp(540, 1500, pull)} y={G - 110} at={P(36) + 0.1} color={RED} size={70} />}
    <BigWord text="life is good" x={540} y={380} at={P(34)} until={P(35)} size={130} color={GREEN} />
    <BigWord text="life is NOT good" x={540} y={380} at={P(35)} size={120} color={RED} />
  </>;
};

const Cta = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 900, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
  <Penguin id="doug" x={320} y={G} h={520} pose={{look: [0, 0], brows: 'worried', flapR: 120 + Math.sin(t * 10) * 10}} />
  <Walrus x={780} y={G} h={520} pose={{look: 0, lids: 0.5}} flip />
  <BigWord text="lend to a friend?" x={540} y={380} at={P(37)} size={110} />
  <BigWord text="👇" x={540} y={600} at={P(37) + 1.2} size={150} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: () => null},
  {at: P(1), set: (t) => <Intro t={t} />, fx_: 'zoom'},
  {at: P(4), set: (t) => <Rich t={t} />, fx_: 'swipe'},
  {at: P(5), set: (t) => <Want t={t} />, fx_: 'swipeL'},
  {at: P(7), set: (t) => <Lend t={t} />, fx_: 'pop'},
  {at: P(10), set: () => <Title lines={['INTEREST']} y={880} at={P(10) + 0.2} size={170} />, fx_: 'zoom'},
  {at: P(11), set: (t) => <Poor t={t} />, fx_: 'swipe'},
  {at: P(13), set: (t) => <Roll t={t} />, fx_: 'iris'},
  {at: P(17), set: () => <Title lines={['ROLLOVER']} y={880} at={P(17) + 0.2} size={170} />, fx_: 'zoom'},
  {at: P(18), set: (t) => <Why t={t} />, fx_: 'swipeL'},
  {at: P(20), set: (t) => <Reason1 t={t} />, fx_: 'pop'},
  {at: P(21), set: (t) => <Reason2 t={t} />, fx_: 'swipe'},
  {at: P(23), set: (t) => <Reason3 t={t} />, fx_: 'swipeL'},
  {at: P(25), set: (t) => <Owned t={t} />, fx_: 'zoom'},
  {at: P(27), set: (t) => <RealLife t={t} />, fx_: 'iris'},
  {at: P(31), set: (t) => <Control t={t} />, fx_: 'pop'},
  {at: P(33), set: (t) => <Ending t={t} />, fx_: 'swipe'},
  {at: P(37), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// mini zooms on the subject named in the line [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[3, 700, 1000, 1.08], [6, 760, 880, 1.08], [8, 560, 650, 1.08], [12, 540, 700, 1.08], [15, 540, 450, 1.08], [20, 830, 1000, 1.08], [24, 300, 1000, 1.08], [26, 540, 700, 1.08], [28, 540, 900, 1.08], [32, 540, 600, 1.08], [36, 900, 1000, 1.08]];

export const DougImf = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  const s0 = 1 + 0.01 * (tc - sh.at);
  let fx = 540, fy = 960;
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.3) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, TIM);
  if (dz) { fx += (dz[1] - fx) * dp * 0.35; fy += (dz[2] - fy) * dp * 0.35; } // mini zoom: lean toward the subject, never crop the cast
  const hookF = Math.round(P(1) * FPS);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <Sequence durationInFrames={hookF}><OffthreadVideo src={staticFile('doug-imf-hook.mp4')} volume={1.6} /></Sequence>
    {tc >= P(1) && <>
      <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
        <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
      </AbsoluteFill>
      <Captions t={tc} phrases={TIM.slice(1)} />
    </>}
    <Sequence from={hookF}><Audio src={staticFile('doug-imf-voice.mp3')} startFrom={hookF} volume={1.6} /></Sequence>
    {SHOTS.slice(2).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={P(1)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(3)} name="user-wrong" vol={0.35} />
    <Sfx at={P(4)} name="user-wow" vol={0.35} />
    <Sfx at={P(4) + 0.4} name="walrus-laugh" vol={0.35} />
    <Sfx at={P(5)} name="user-pop" vol={0.3} />
    <Sfx at={P(6)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(7) + 0.2} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(8) + 0.4} name="user-slap" vol={0.35} />
    <Sfx at={P(9)} name="user-ting" vol={0.35} />
    <Sfx at={P(10) + 0.2} name="user-ting" vol={0.3} />
    <Sfx at={P(11) + 0.2} name="user-wrong" vol={0.3} />
    <Sfx at={P(12)} name="user-fahh" vol={0.45} />
    <Sfx at={P(13) + 0.1} name="user-money" vol={0.3} />
    <Sfx at={P(14) + 0.3} name="user-money" vol={0.3} />
    <Sfx at={P(15)} name="user-timer" vol={0.3} />
    <Sfx at={P(16)} name="walrus-laugh" vol={0.35} />
    <Sfx at={P(17) + 0.2} name="user-ting" vol={0.3} />
    <Sfx at={P(18)} name="walrus-grunt" vol={0.35} />
    <Sfx at={P(19)} name="user-pop" vol={0.3} />
    <Sfx at={P(20) + 1.2} name="splat" vol={0.4} />
    <Sfx at={P(20) + 1.3} name="user-shock" vol={0.35} />
    <Sfx at={P(21)} name="user-pop" vol={0.3} />
    <Sfx at={P(22)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(23)} name="user-notif" vol={0.3} />
    <Sfx at={P(24) + 0.5} name="penguin-honk" vol={0.3} />
    <Sfx at={P(25) + 0.2} name="user-boom" vol={0.4} />
    <Sfx at={P(26)} name="user-fahh-long" vol={0.4} />
    <Sfx at={P(27)} name="user-ting" vol={0.35} />
    <Sfx at={P(28) + 1.4} name="user-boom" vol={0.4} />
    <Sfx at={P(29) + 0.2} name="user-slap" vol={0.35} />
    <Sfx at={P(30) + 0.9} name="user-cash-register" vol={0.35} />
    <Sfx at={P(31)} name="user-yeah" vol={0.35} />
    <Sfx at={P(32)} name="user-boom" vol={0.4} />
    <Sfx at={P(34)} name="user-wow" vol={0.35} />
    <Sfx at={P(35)} name="user-wrong" vol={0.35} />
    <Sfx at={P(36) + 0.1} name="user-slap" vol={0.35} />
    <Sfx at={P(36) + 0.4} name="walrus-laugh" vol={0.4} />
    <Sfx at={P(37)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
