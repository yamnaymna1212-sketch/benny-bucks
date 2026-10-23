// EP7 "How Poor vs Rich Doug buy a car" — full episode. Hook = Hook in dougCar.tsx (approved). Timings: studio/src/data/doug-car.json.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, back, onTwos} from '../penguin/rig';
import {Puffin, Walrus} from '../penguin/cast';
import {BigWord, PriceTag, Paper, Stamp, Title} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {Fox} from './dougLaundering';
import {Bill, Hook, SedanPhoto, Smoke, TeslaPhoto} from './dougCar';
import TIM from '../data/doug-car.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_CAR_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1300;
const RED = '#D83A2E', GREEN = '#2E9E4F';
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const usd = (n: number) => '$' + (Math.round(n / 1000) * 1000).toLocaleString('en-US');

const Ground = () => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 60, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />;
const Pop = ({at, t, children, style}: {at: number; t: number; children: React.ReactNode; style?: React.CSSProperties}) =>
  t < at ? null : <div style={{position: 'absolute', transform: `scale(${back((t - at) / 0.3)})`, ...style}}>{children}</div>;
const Sign = ({text, x, y, w = 520, color = '#41A8EC'}: {text: string; x: number; y: number; w?: number; color?: string}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, textAlign: 'center', background: color, border: `7px solid ${INK}`, borderRadius: 18, boxSizing: 'border-box', padding: '10px 0',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: '#fff', letterSpacing: 1}}>{text}</div>;
const Down = ({x, y, t, at}: {x: number; y: number; t: number; at: number}) => t < at ? null :
  <svg width={120} height={200} style={{position: 'absolute', left: x - 60, top: y + ((t * 120) % 60), overflow: 'visible'}}><path d="M60 0 L60 140 M20 100 L60 150 L100 100" fill="none" stroke={RED} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Flow = ({x1, y1, x2, y2, t, from, to, every = 0.3, w = 110}: {x1: number; y1: number; x2: number; y2: number; t: number; from: number; to: number; every?: number; w?: number}) =>
  <>{Array.from({length: Math.floor((to - from) / every)}, (_, i) => { const p = (t - (from + i * every)) / 0.5; if (p < 0 || p > 1) return null;
    return <Bill key={i} x={lerp(x1, x2, ease(p))} y={lerp(y1, y2, ease(p)) - Math.sin(p * Math.PI) * 160} rot={lerp(-20, 30, p)} w={w} />; })}</>;

// ---------- shots ----------
const Intro = ({t}: {t: number}) => <>
  <Ground />
  <Penguin id="doug" x={540} y={G} h={560} pose={{beak: 'smile', brows: 'happy', look: t > P(6) ? [0, -0.9] : [0, 0], flapR: 60 + Math.sin(t * 8) * 20}} />
  <BigWord text="Doug" x={540} y={560} at={P(5)} until={P(6)} size={170} />
  <Pop at={P(6)} t={t} style={{left: 0, top: 0}}><TeslaPhoto x={540} y={760} w={640} t={t} fly={0} /></Pop>
  {t > P(6) + 0.3 && <BigWord text="shiny!" x={540} y={360} at={P(6) + 0.3} size={130} color={RED} />}
</>;

const Shop = ({t}: {t: number}) => <>
  <Ground />
  <Sign text="LARRY CARS" x={780} y={330} w={560} />
  <TeslaPhoto x={360} y={G - 30} w={560} t={t} fly={0} />
  <Walrus id="larry" x={860} y={G} h={520} pose={{laugh: t > P(8) ? 1 : 0, lids: 0.5}} />
  <PriceTag x={540} y={640} price="$250,000" at={P(8)} size={1.2} />
  <Penguin id="doug" x={170} y={G} h={400} pose={t > P(9) ? {brows: 'worried', sweat: true, beak: 'frown', flapL: 90, flapR: 90} : {turn: 0.4}} />
  <BigWord text="$0" x={180} y={800} at={P(9)} size={190} color={RED} />
</>;

const Loan = ({t}: {t: number}) => <>
  <Ground />
  <Fox x={820} y={G} h={600} mouth={t < P(11) ? 0.3 : 0} />
  <Penguin id="doug" x={250} y={G} h={480} pose={{turn: 0.5, beak: t > P(11) ? 'smile' : 'flat', brows: t > P(11) ? 'happy' : 'worried'}} />
  <Paper x={540} y={820} w={300} title="LOAN" amount="$250,000" at={P(10) + 0.5} rot={-6} id="loan" />
  <Stamp text="YES" x={540} y={560} at={P(11) + 0.1} color={GREEN} size={150} />
</>;

const Interest = ({t}: {t: number}) => {
  const grow = cl((t - P(12)) / 2.2);
  return <>
    <Ground />
    <Penguin id="doug" x={250} y={G} h={480} pose={{turn: 0.5, sweat: true, brows: 'worried'}} />
    <Fox x={830} y={G} h={600} />
    <Flow x1={330} y1={G - 200} x2={760} y2={G - 220} t={t} from={P(12) + 0.3} to={P(14) - 0.3} />
    {Array.from({length: 1 + Math.floor(grow * 7)}, (_, i) => <Bill key={i} x={640 + (i % 3) * 18} y={G - 20 - i * 24} w={150} rot={(i * 17) % 20 - 10} />)}
    <BigWord text="+ extra" x={540} y={520} at={P(12) + 0.7} until={P(13)} size={150} color={RED} />
    <Title lines={['INTEREST']} y={600} at={P(13)} size={170} />
  </>;
};

const Monthly = ({t}: {t: number}) => {
  const m = ['JAN', 'FEB', 'MAR'];
  return <>
    <Ground />
    <Penguin id="doug" x={230} y={G} h={440} pose={{turn: 0.5, sweat: true, brows: 'worried', beak: 'frown'}} />
    <Fox x={850} y={G} h={540} mouth={0.3} />
    <BigWord text="every month" x={540} y={330} at={P(14)} size={120} />
    {m.map((mo, i) => <Pop key={mo} at={P(14) + 0.5 + i * 0.7} t={t} style={{left: 160 + i * 270, top: 520, width: 230, height: 250}}>
      <div style={{background: '#fff', border: `7px solid ${INK}`, borderRadius: 18, height: '100%', boxSizing: 'border-box', overflow: 'hidden', textAlign: 'center'}}>
        <div style={{background: RED, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 46, padding: '6px 0'}}>{mo}</div>
        <div style={{fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 72, color: RED, marginTop: 24}}>-$4K</div>
      </div></Pop>)}
    <Flow x1={310} y1={G - 200} x2={780} y2={G - 220} t={t} from={P(14) + 0.3} to={E(14)} every={0.25} />
    <BigWord text="$4,000+" x={540} y={950} at={P(14) + 1.6} size={190} color={RED} />
  </>;
};

const Leave = ({t}: {t: number}) => {
  const out = ease((t - P(15)) / 0.9), x = lerp(-260, 540, out);
  const k = cl((t - P(16)) / (E(17) - P(16) + 0.3)), val = lerp(250000, 100000, k);
  return <>
    <Ground />
    <Sign text="LARRY CARS" x={850} y={330} w={460} />
    {t < P(16) && out < 1 && <Smoke x={x - 200} y={G + 30} t={t} at={P(15)} />}
    <TeslaPhoto x={x} y={G - 30} w={620} t={t} fly={0} />
    <PriceTag x={x} y={G - 360} price={usd(val)} at={P(15) + 0.5} rot={-4} size={1.05} color={k > 0.05 ? RED : '#2E9E4F'} />
    <Down x={190} y={620} t={t} at={P(16)} /><Down x={890} y={620} t={t} at={P(17)} />
    <Penguin id="doug" x={900} y={G} h={380} pose={t > P(16) ? {brows: 'shock', eyeScale: 1.25, sweat: true, tremble: 0.4, flapL: 100, flapR: 100} : {turn: -0.4, beak: 'smile'}} />
  </>;
};

const Dep = ({t}: {t: number}) => <>
  <Ground />
  <svg width={1080} height={900} style={{position: 'absolute', left: 0, top: 700, overflow: 'visible'}}>
    <path d="M120 120 C 300 130, 380 330, 560 450 C 700 540, 820 560, 960 580" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease((t - P(18)) / 0.9)} fill="none" stroke={RED} strokeWidth={22} strokeLinecap="round" />
  </svg>
  <PriceTag x={220} y={760} price="$250,000" at={P(18)} size={0.8} />
  <PriceTag x={820} y={1230} price="$100,000" at={P(18) + 0.5} size={0.8} color={RED} />
  <Title lines={['DEPRECIATION']} y={440} at={P(18) + 0.1} size={130} />
</>;

const Poor = ({t}: {t: number}) => <>
  <Ground />
  <Penguin id="doug" x={540} y={G + 80} h={900} pose={{tears: true, brows: 'worried', beak: 'frown', lids: 0.3, look: [0, 0.5], flapL: 2, flapR: 2}} />
  <Flow x1={540} y1={G - 500} x2={1300} y2={G - 900} t={t} from={P(19)} to={E(19)} every={0.2} w={130} />
</>;

const OldLot = ({t}: {t: number}) => <>
  <Ground />
  <Sign text="USED CARS" x={700} y={330} w={560} color={GREEN} />
  <SedanPhoto x={640} y={G - 20} w={560} />
  <PriceTag x={640} y={680} price="$5,000" at={P(21)} size={1.2} color={GREEN} />
  <Puffin id="puff" x={960} y={G} h={360} />
  <Penguin id="doug" x={230} y={G} h={460} outfit="rich" pose={{turn: 0.5, beak: 'smile', lids: 0.35, flapR: t > P(22) ? 70 : 8}} />
  <Flow x1={330} y1={G - 280} x2={930} y2={G - 220} t={t} from={P(22) + 0.1} to={E(22)} every={0.18} />
  <BigWord text="cash" x={230} y={640} at={P(22)} size={150} color={GREEN} />
</>;

const NoFox = ({t}: {t: number}) => <>
  <Ground />
  <Fox x={640} y={G} h={620} flip />
  <Penguin id="doug" x={240} y={G} h={480} outfit="rich" pose={{beak: 'smile', lids: 0.4}} />
  <BigWord text="✕" x={640} y={780} at={P(23)} size={420} color={RED} />
  <BigWord text="0%" x={870} y={620} at={P(23) + 0.7} size={230} color={GREEN} />
</>;

const OldLose = ({t}: {t: number}) => {
  const k = ease((t - P(25)) / 0.6);
  return <>
    <Ground />
    <SedanPhoto x={540} y={G - 20} w={640} />
    <PriceTag x={540} y={720} price={k > 0.5 ? '$4,800' : '$5,000'} at={P(24)} size={1.25} color={k > 0.05 ? '#E8A33A' : GREEN} />
    <BigWord text="just a little" x={540} y={900} at={P(25)} size={110} color={GREEN} />
    <Penguin id="doug" x={170} y={G} h={380} outfit="rich" pose={{beak: 'smile', lids: 0.45}} />
  </>;
};

const Real = ({t}: {t: number}) => {
  const k = ease((t - P(26) - 1.2) / 2.0), val = lerp(250000, 100000, k);
  return <>
    <Ground />
    <BigWord text="in real life" x={540} y={330} at={P(26)} size={130} />
    <TeslaPhoto x={540} y={G - 30} w={560} t={t} fly={0} />
    <PriceTag x={540} y={720} price={usd(val)} at={P(26) + 0.4} size={1.25} color={k > 0.02 ? RED : GREEN} />
    <BigWord text="-60%" x={540} y={980} at={P(26) + 2.4} size={260} color={RED} />
    <BigWord text="5 years" x={540} y={1160} at={P(26) + 3.0} size={100} />
  </>;
};

const Lose = ({t}: {t: number}) => <>
  <Ground />
  <Penguin id="doug" x={540} y={G + 60} h={620} pose={{tears: true, brows: 'worried', beak: 'frown', look: [0, 0.4]}} />
  <BigWord text="-$150,000" x={540} y={400} at={P(27)} size={180} color={RED} />
  <BigWord text="+ $50,000" x={540} y={620} at={P(28)} size={150} color={RED} />
  <Flow x1={540} y1={G - 300} x2={1250} y2={G - 800} t={t} from={P(27)} to={E(28)} every={0.2} w={130} />
</>;

const RichZero = ({t}: {t: number}) => <>
  <Ground />
  <SedanPhoto x={680} y={G - 20} w={560} />
  <Penguin id="doug" x={240} y={G} h={520} outfit="rich" pose={{beak: 'smile', lids: 0.35, hop: t > P(30) ? Math.abs(Math.sin((t - P(30)) * 9)) * 50 : 0, flapL: t > P(30) ? 100 : 8, flapR: t > P(30) ? 100 : 8}} />
  <BigWord text="≈ $0" x={560} y={560} at={P(29)} size={230} color={GREEN} />
</>;

const Work = ({t}: {t: number}) => {
  const go = ease((t - P(31)) / (P(32) + 0.6 - P(31))), stop = t > P(32) + 0.6;
  const dashes = (t * 500) % 120;
  return <>
    <div style={{position: 'absolute', left: -400, right: -400, top: G - 120, height: 380, background: '#9AA1A8', borderTop: `6px solid ${INK}`, borderBottom: `6px solid ${INK}`}} />
    {Array.from({length: 12}, (_, i) => <div key={i} style={{position: 'absolute', left: ((i * 120 - (stop ? 0 : dashes)) % 1440 + 1440) % 1440 - 200, top: G + 60, width: 70, height: 12, background: '#fff'}} />)}
    <div style={{position: 'absolute', left: 520, top: G - 700, width: 20, height: 580, background: INK}} />
    <div style={{position: 'absolute', left: 480, top: G - 800, width: 100, height: 240, background: INK, borderRadius: 20}}>
      <div style={{width: 60, height: 60, borderRadius: '50%', background: stop ? '#555' : '#555', margin: '16px auto 8px'}} />
      <div style={{width: 60, height: 60, borderRadius: '50%', background: '#555', margin: '0 auto 8px'}} />
      <div style={{width: 60, height: 60, borderRadius: '50%', background: RED, margin: '0 auto', boxShadow: `0 0 30px ${RED}`}} />
    </div>
    <TeslaPhoto x={lerp(-300, 260, go)} y={G + 20} w={440} t={t} fly={0} />
    <SedanPhoto x={lerp(-300, 800, go)} y={G + 160} w={440} />
    <Stamp text="SAME TIME" x={540} y={520} at={P(32) + 0.8} color={GREEN} size={130} />
    <Penguin id="doug" x={180} y={G + 520} h={300} pose={{brows: 'worried', beak: 'frown'}} />
    <Penguin id="doug2" x={900} y={G + 520} h={300} outfit="rich" pose={{beak: 'smile', lids: 0.4}} />
  </>;
};

const Cta = ({t}: {t: number}) => <>
  <Ground />
  <BigWord text="new or old?" x={540} y={400} at={P(33)} size={170} />
  <Penguin id="doug" x={300} y={G + 60} h={560} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
  <TeslaPhoto x={780} y={800} w={380} t={t} fly={0} />
  <SedanPhoto x={780} y={1130} w={380} />
  <BigWord text="👇" x={300} y={640} at={P(34)} size={140} />
</>;

type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(5), set: (t) => <Intro t={t} />, fx_: 'swipe'},
  {at: P(7), set: (t) => <Shop t={t} />, fx_: 'swipeL'},
  {at: P(10), set: (t) => <Loan t={t} />, fx_: 'pop'},
  {at: P(12), set: (t) => <Interest t={t} />, fx_: 'zoom'},
  {at: P(14), set: (t) => <Monthly t={t} />, fx_: 'swipe'},
  {at: P(15), set: (t) => <Leave t={t} />, fx_: 'swipeL'},
  {at: P(18), set: (t) => <Dep t={t} />, fx_: 'iris'},
  {at: P(19), set: (t) => <Poor t={t} />, fx_: 'zoom'},
  {at: P(20), set: (t) => <OldLot t={t} />, fx_: 'swipe'},
  {at: P(23), set: (t) => <NoFox t={t} />, fx_: 'pop'},
  {at: P(24), set: (t) => <OldLose t={t} />, fx_: 'swipeL'},
  {at: P(26), set: (t) => <Real t={t} />, fx_: 'iris'},
  {at: P(27), set: (t) => <Lose t={t} />, fx_: 'zoom'},
  {at: P(29), set: (t) => <RichZero t={t} />, fx_: 'swipe'},
  {at: P(31), set: (t) => <Work t={t} />, fx_: 'swipeL'},
  {at: P(33), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [phrase, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[8, 540, 640, 1.35], [11, 300, 900, 1.35], [16, 620, 900, 1.3], [19, 540, 1000, 1.25], [22, 300, 1000, 1.2], [29, 540, 900, 1.3]];

export const DougCar = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the POOR side when named, swing to RICH, zoom out on "Same Doug"
    const toL = ease((tc - (P(1) - 0.2)) / 0.5) * (tc < P(3) - 0.3 ? 1 : 0), toR = ease((tc - (P(3) - 0.3)) / 0.5) * (tc < P(4) ? 1 : 0);
    s0 = 1 + 0.08 * (toL + toR); fx = 540 - 90 * toL + 90 * toR;
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (tc < 1.0 ? 1 : beat(tc, TIM));
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>
        {sh.set(t)}
        {sh.at === 0 && <Stamp text="SAME DOUG" x={540} y={1000} at={P(4)} color={RED} size={110} rot={-8} />}
      </AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-car-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.1} name="user-cash-register" vol={0.3} />
    <Sfx at={0.8} name="swoosh-fast" vol={0.35} />
    <Sfx at={1.0} name="user-boom" vol={0.35} />
    <Sfx at={P(3)} name="user-boom" vol={0.4} />
    <Sfx at={P(4)} name="user-slap" vol={0.4} />
    <Sfx at={P(5)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(6)} name="user-wow" vol={0.3} />
    <Sfx at={P(8)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(8) + 0.3} name="walrus-laugh" vol={0.35} />
    <Sfx at={P(9)} name="user-wrong" vol={0.35} />
    <Sfx at={P(10) + 0.5} name="user-notif" vol={0.3} />
    <Sfx at={P(11) + 0.1} name="user-slap" vol={0.4} />
    <Sfx at={P(13)} name="user-ting" vol={0.35} />
    <Sfx at={P(12) + 0.3} name="user-money" vol={0.3} />
    <Sfx at={P(14)} name="user-timer" vol={0.3} />
    <Sfx at={P(14) + 1.6} name="user-cash-register" vol={0.35} />
    <Sfx at={P(15)} name="swoosh-fast" vol={0.4} />
    <Sfx at={P(16)} name="user-aww" vol={0.4} />
    <Sfx at={P(18)} name="user-ting" vol={0.35} />
    <Sfx at={P(19)} name="user-fahh" vol={0.45} />
    <Sfx at={P(21)} name="user-wow" vol={0.3} />
    <Sfx at={P(22)} name="user-money" vol={0.35} />
    <Sfx at={P(23)} name="user-wrong" vol={0.35} />
    <Sfx at={P(23) + 0.7} name="user-yeah" vol={0.35} />
    <Sfx at={P(25)} name="user-pop" vol={0.3} />
    <Sfx at={P(26) + 2.4} name="user-boom" vol={0.45} />
    <Sfx at={P(27)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(28)} name="user-shock" vol={0.4} />
    <Sfx at={P(29)} name="user-yeah" vol={0.4} />
    <Sfx at={P(30)} name="user-wow" vol={0.3} />
    <Sfx at={P(32) + 0.8} name="user-slap" vol={0.4} />
    <Sfx at={P(32) + 0.9} name="user-horn" vol={0.35} />
    <Sfx at={P(34)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
