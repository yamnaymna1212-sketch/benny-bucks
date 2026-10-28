// EP8 "College Explained by Doug" — private US college $45,000/yr vs Germany public university ~$0 (same degree).
// Line timings: studio/src/data/doug-college.json (Kokoro VO am_puck 1.35). Sub-beats inside long lines come from pauses in vo/voice.wav.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {Fish, INK, Penguin, Seal, onTwos} from '../penguin/rig';
import {Walrus} from '../penguin/cast';
import {BigWord, Crowd, FishFlight, FishPile, Igloo, Paper, Sign, Stamp, Thought, Title} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {BossBear, GREEN, RED, UsFlag, Vs, Why} from './dougVenezuela';
import {Fox} from './dougLaundering';
import TIM from '../data/doug-college.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_COLLEGE_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const MONT = 'Montserrat';
const G = 1250;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const DeFlag = () => <g>
  <rect width={190} height={40} fill="#111" /><rect y={40} width={190} height={40} fill="#DD0000" /><rect y={80} width={190} height={40} fill="#FFCE00" />
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} />
</g>;
const Flag = ({x, y, w = 240, flag}: {x: number; y: number; w?: number; flag: 'us' | 'de'}) =>
  <svg width={w} height={w * 0.632} viewBox="0 0 190 120" style={{position: 'absolute', left: x - w / 2, top: y}}>{flag === 'us' ? <UsFlag /> : <DeFlag />}</svg>;
const Name = ({text, x, y, size = 76}: {text: string; x: number; y: number; size?: number}) =>
  <div style={{position: 'absolute', left: x - 270, width: 540, top: y, textAlign: 'center', fontFamily: MONT, fontWeight: 900, fontSize: size, color: INK}}>{text}</div>;
const PriceCard = ({text, x, y, color, at, t, tilt = 0, w = 410, h = 190, size = 98}: {text: string; x: number; y: number; color: string; at: number; t: number; tilt?: number; w?: number; h?: number; size?: number}) => {
  const p = ease((t - at) / 0.3); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x - w / 2, width: w, top: y, height: h, borderRadius: 32, background: color, border: `9px solid ${INK}`, boxShadow: `0 12px 0 ${INK}`, boxSizing: 'border-box',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONT, fontWeight: 900, fontSize: size, color: '#fff', letterSpacing: -3, whiteSpace: 'nowrap',
    transform: `scale(${0.5 + 0.5 * p}) rotate(${tilt}deg)`}}>{text}</div>;
};
// Graduation cap + diploma scroll (identical on both sides = "same degree").
const Grad = ({x, y, w = 300, rot = 0}: {x: number; y: number; w?: number; rot?: number}) =>
  <svg width={w} height={w * 0.95} viewBox="0 0 300 285" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.95, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
    <path d="M150 20 L290 80 L150 140 L10 80 Z" fill="#2B2F36" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M70 112 L70 170 Q150 215 230 170 L230 112 L150 140 Z" fill="#3A404A" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M150 80 L262 96 L262 170" fill="none" stroke="#F5C518" strokeWidth={8} strokeLinecap="round" /><circle cx={262} cy={178} r={13} fill="#F5C518" stroke={INK} strokeWidth={5} />
    <rect x={60} y={205} width={180} height={64} rx={30} fill="#FBF3D5" stroke={INK} strokeWidth={8} />
    <rect x={128} y={205} width={44} height={64} fill="#D83A2E" stroke={INK} strokeWidth={6} />
  </svg>;
const Note = ({text, x, y}: {text: string; x: number; y: number}) =>
  <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 38, color: '#777'}}>{text}</div>;

// ---------- hook (clean versus layout) ----------
const DE = () => P(1);
const Hook = ({t}: {t: number}) => {
  const lookR = t >= DE();
  return <>
    <div style={{position: 'absolute', inset: 0, transform: 'translateY(-175px) scale(0.92)', transformOrigin: '50% 0'}}><Why t={t} /></div>
    <Flag x={250} y={395} flag="us" /><Flag x={830} y={395} flag="de" />
    <Name text="USA" x={250} y={555} /><Name text="GERMANY" x={830} y={555} size={66} />
    <PriceCard text="$45,000" x={235} y={670} color={RED} at={0.3} t={t} tilt={-3} />
    <PriceCard text="~$0" x={845} y={670} color={GREEN} at={DE() + 0.3} t={t} tilt={3} size={130} />
    <Vs x={540} y={765} t={t} />
    <Note text="per year · private college" x={250} y={900} /><Note text="public university" x={830} y={900} />
    <Grad x={230} y={1500} w={300} rot={Math.sin(t * 3) * 1.5} /><Grad x={850} y={1500} w={300} rot={-Math.sin(t * 3) * 1.5} />
    <Penguin id="doug" x={540} y={1490} h={380} pose={{turn: lookR ? 0.5 : -0.5, look: [lookR ? 0.8 : -0.8, -0.3], brows: lookR ? 'shock' : 'worried', eyeScale: lookR ? 1.25 : 1.05, pupil: lookR ? 0.5 : 1, beak: 'frown', flapR: 35, flapL: 35, sweat: lookR}} />
  </>;
};
const Same = ({t}: {t: number}) => <>
  <Grad x={260} y={1150} w={400} /><Grad x={820} y={1150} w={400} />
  <BigWord text="=" x={540} y={780} at={P(2)} size={260} color={INK} rot={0} />
  <BigWord text="same degree" x={540} y={300} at={P(2)} until={P(3)} size={130} color={RED} />
  {t >= P(3) && <><Penguin id="doug" x={540} y={1500} h={520} pose={{beak: 'flat', brows: 'worried', eyeScale: 1.2, look: [0, 0.3], flapL: 40, flapR: 40}} />
    <BigWord text="same Doug" x={540} y={300} at={P(3)} size={130} color={RED} /></>}
</>;

// ---------- props ----------
const Snow = ({bg}: {bg?: string}) => <>
  {bg && <div style={{position: 'absolute', inset: -400, background: bg}} />}
  <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 900, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} /></>;
const Src = ({text, y = 1420}: {text: string; y?: number}) =>
  <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 34, color: '#888'}}>{text}</div>;
const Card = ({text, x, y, color, at, t, w = 600, h = 180, size = 110, tilt = 0}: {text: string; x: number; y: number; color: string; at: number; t: number; w?: number; h?: number; size?: number; tilt?: number}) =>
  <PriceCard text={text} x={x} y={y} color={color} at={at} t={t} w={w} h={h} size={size} tilt={tilt} />;
// College building (x = centre, y = ground). Columns + pediment with a sign.
const College = ({x, y, w = 640, sign = 'COLLEGE', color = '#F3E9D2'}: {x: number; y: number; w?: number; sign?: string; color?: string}) => {
  const h = w * 0.78;
  return <svg width={w} height={h} viewBox="0 0 640 500" style={{position: 'absolute', left: x - w / 2, top: y - h, overflow: 'visible'}}>
    <path d="M20 150 L320 20 L620 150 Z" fill={color} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <text x={320} y={128} textAnchor="middle" fontFamily={MONT} fontWeight={900} fontSize={sign.length > 9 ? 44 : 56} fill={INK}>{sign}</text>
    <rect x={40} y={150} width={560} height={40} fill={color} stroke={INK} strokeWidth={9} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={70 + i * 112} y={190} width={52} height={250} fill="#fff" stroke={INK} strokeWidth={8} />)}
    <rect x={20} y={440} width={600} height={56} fill={color} stroke={INK} strokeWidth={9} />
    <rect x={285} y={330} width={70} height={110} rx={8} fill="#7A4B2A" stroke={INK} strokeWidth={7} />
  </svg>;
};
const Hospital = ({x, y, w = 300}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={w * 0.9} viewBox="0 0 300 270" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.9}}>
    <rect x={20} y={40} width={260} height={226} fill="#fff" stroke={INK} strokeWidth={8} />
    <path d="M130 70 h40 v40 h40 v40 h-40 v40 h-40 v-40 h-40 v-40 h40 Z" fill={RED} stroke={INK} strokeWidth={6} />
    <rect x={120} y={206} width={60} height={60} fill="#9BD3F0" stroke={INK} strokeWidth={6} />
  </svg>;
const Road = ({x, y, w = 320}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={w * 0.8} viewBox="0 0 320 256" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.8}}>
    <path d="M120 0 L200 0 L310 256 L10 256 Z" fill="#555B63" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    {[0, 1, 2].map((i) => <rect key={i} x={153 - i * 3} y={20 + i * 80} width={14 + i * 6} height={46} fill="#F5C518" />)}
  </svg>;
const Suitcase = ({x, y, w = 150}: {x: number; y: number; w?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.8, width: w, height: w * 0.8, background: '#C9773A', border: `6px solid ${INK}`, borderRadius: 16, boxSizing: 'border-box'}}>
    <div style={{position: 'absolute', left: '30%', top: -w * 0.18, width: '40%', height: w * 0.18, border: `6px solid ${INK}`, borderBottom: 'none', borderRadius: '12px 12px 0 0', boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: '45%', top: 0, width: '10%', height: '100%', background: '#8E4E20'}} /></div>;
const Called = ({lines}: {lines: string[]}) => <Title lines={lines} y={860} at={-99} size={170} />;
const Cross = ({x, y, w = 300, at, t}: {x: number; y: number; w?: number; at: number; t: number}) => {
  const p = ease((t - at) / 0.25); if (p <= 0) return null;
  return <svg width={w} height={w} viewBox="0 0 100 100" style={{position: 'absolute', left: x - w / 2, top: y - w / 2, overflow: 'visible'}}>
    <path d="M10 10 L90 90 M90 10 L10 90" stroke={RED} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" /></svg>;
};

// ---------- sets ----------
const Intro = ({t}: {t: number}) => <>
  <Snow />
  <Penguin id="doug" x={400} y={G + 120} h={700} pose={{beak: 'smile', brows: 'happy', flapR: 70 + Math.sin(t * 4) * 6, look: [0.6, -0.4]}} />
  <Thought x={780} y={560} w={380} tx={560} ty={G - 520} at={P(4) + 0.5}><div style={{position: 'relative', width: 380, height: 240}}><Grad x={190} y={235} w={230} /></div></Thought>
  <BigWord text="Doug" x={300} y={300} at={P(4)} size={150} />
  <BigWord text="want degree" x={790} y={320} at={P(4) + 0.6} size={90} color="#3A9BD9" />
</>;

const NeedPaper = ({t}: {t: number}) => {
  const go = t >= 7.0, w = ease((t - 7.0) / 0.8);
  return <>
    <Snow />
    {!go && <><Sign x={760} y={G - 40} text="JOB" w={300} id="sign-job" />
      <Paper x={760} y={560} w={300} title="DIPLOMA?" amount="REQUIRED" at={P(5) + 0.2} rot={6} id="jobpaper" />
      <Penguin id="doug" x={300} y={G + 120} h={520} pose={{turn: 0.5, look: [0.8, -0.5], brows: 'worried', beak: 'frown', flapR: 30}} />
      <BigWord text="need paper" x={330} y={330} at={P(5) + 0.3} size={110} color={RED} /></>}
    {go && <><College x={820} y={G + 20} w={480} />
      <Penguin id="doug" x={lerp(120, 480, w)} y={G + 120} h={460} pose={{side: true, turn: 1, walk: t * 3, beak: 'smile'}} />
      <BigWord text="go to college" x={540} y={330} at={7.0} size={110} /></>}
  </>;
};

const Building = ({t}: {t: number}) => {
  const larry = t >= 8.6;
  return <>
    <Snow />
    <College x={540} y={G + 20} w={760} sign={larry ? 'LARRY U' : 'COLLEGE'} />
    {larry && <Walrus id="larry" x={lerp(1300, 860, ease((t - 8.6) / 0.4))} y={G + 160} h={430} pose={{laugh: t > 9.0 ? 1 : 0, mouth: 0.4}} />}
    <Penguin id="doug" x={160} y={G + 140} h={340} pose={{look: [0.8, -0.8], eyeScale: 1.2, beak: 'flat'}} />
    {!larry && <BigWord text="building" x={540} y={260} at={P(6)} size={130} />}
    {larry && <BigWord text="Larry own" x={540} y={260} at={8.6} size={130} color={RED} />}
  </>;
};

const Price = ({t}: {t: number}) => {
  const pay = t >= 10.05;
  return <>
    <Snow />
    <Walrus id="larry" x={800} y={G + 150} h={520} pose={{mouth: pay ? 0.3 : 0.7, laugh: pay ? 1 : 0}} />
    <Card text="$45,000" x={600} y={330} color={RED} at={P(7) + 0.2} t={t} w={560} h={200} size={140} tilt={-3} />
    <BigWord text="a year" x={600} y={600} at={P(7) + 0.4} size={90} color={RED} />
    <Penguin id="doug" x={250} y={G + 120} h={470} pose={{turn: 0.5, look: [0.8, -0.3], brows: 'shock', eyeScale: 1.3, pupil: 0.5, beak: 'frown', sweat: true, flapR: pay ? 100 : 20}} />
    {pay && <FishFlight x1={320} y1={G - 260} x2={700} y2={G - 330} a={10.05} b={E(7) + 0.3} n={6} w={100} />}
  </>;
};

const FourYears = ({t}: {t: number}) => {
  const total = t >= 11.5, paid = t >= 12.6;
  return <>
    <Snow />
    {[0, 1, 2, 3].map((i) => { const at = P(8) + 0.05 + i * 0.22; if (t < at) return null;
      return <React.Fragment key={i}>
        <div style={{position: 'absolute', left: 60 + i * 245, top: 250, width: 220, height: 190, background: '#fff', border: `7px solid ${INK}`, borderRadius: 18, boxSizing: 'border-box', overflow: 'hidden', textAlign: 'center'}}>
          <div style={{height: 54, background: RED, borderBottom: `7px solid ${INK}`, fontFamily: MONT, fontWeight: 900, fontSize: 36, color: '#fff', lineHeight: '50px'}}>YEAR {i + 1}</div>
          <div style={{fontFamily: MONT, fontWeight: 900, fontSize: 52, color: RED, marginTop: 30}}>$45K</div></div>
      </React.Fragment>; })}
    {total && <Card text="$180,000" x={540} y={560} color={RED} at={11.5} t={t} w={760} h={230} size={170} tilt={-2} />}
    {paid && <Stamp text="DOUG PAY" x={540} y={950} at={12.6} color={RED} size={100} />}
    <Penguin id="doug" x={540} y={G + 130} h={paid ? 360 : 300} pose={{brows: 'shock', eyeScale: 1.4, pupil: 0.4, beak: 'frown', sweat: paid, tremble: paid ? 1 : 0}} />
  </>;
};

const Discount = ({t}: {t: number}) => <>
  <Snow />
  <Walrus id="larry" x={820} y={G + 150} h={480} pose={{mouth: 0.4, flap: Math.sin(t * 8) * 0.4}} />
  <Penguin id="doug" x={240} y={G + 120} h={420} pose={{turn: 0.5, look: [0.8, -0.3], brows: 'worried', beak: 'flat'}} />
  <Card text="$45,000" x={460} y={300} color={RED} at={P(9)} t={t} w={520} h={180} size={120} />
  <Cross x={460} y={390} w={300} at={14.3} t={t} />
  <Card text="$35,000" x={520} y={560} color="#F08A24" at={14.5} t={t} w={520} h={180} size={120} tilt={3} />
  <BigWord text="not everybody" x={540} y={850} at={P(9) + 0.2} until={14.3} size={100} />
  <BigWord text="discount" x={540} y={850} at={14.4} size={120} color={GREEN} />
</>;

const Scholarship = ({t}: {t: number}) => {
  const still = t >= 16.1;
  return <>
    <Title lines={['SCHOLARSHIP']} y={420} at={-99} size={130} />
    <Paper x={540} y={900} w={300} title="SCHOLARSHIP" amount="-$10,000" at={P(9) + 2.2} rot={-4} id="schol" />
    {still && <Card text="STILL $35,000" x={540} y={1140} color={RED} at={16.1} t={t} w={720} h={170} size={92} tilt={-2} />}
  </>;
};

const NoFish = ({t}: {t: number}) => {
  const go = t >= 17.65, w = ease((t - 17.65) / 0.6);
  return <>
    <Snow />
    {!go && <><Penguin id="doug" x={420} y={G + 120} h={600} pose={{brows: 'worried', beak: 'frown', lids: 0.3, flapL: 60, flapR: 60}} />
      <BigWord text="0 fish" x={780} y={400} at={P(10) + 0.1} size={150} color={RED} />
      <div style={{position: 'absolute', left: 690, top: 560, fontSize: 120}}>🕸️</div></>}
    {go && <><Fox x={830} y={G + 120} h={520} flip mouth={0.2} />
      <Sign x={830} y={G - 470} text="FOX LOANS" w={340} id="sign-fox" />
      <Penguin id="doug" x={lerp(100, 420, w)} y={G + 120} h={430} pose={{side: true, turn: 1, walk: t * 3, beak: 'flat'}} /></>}
  </>;
};

const Loan = ({t}: {t: number}) => {
  const sign = t >= 18.95;
  return <>
    <Snow />
    <Fox x={800} y={G + 120} h={540} flip mouth={sign ? 0 : 0.3} pen />
    <Penguin id="doug" x={250} y={G + 120} h={440} pose={{turn: 0.5, look: [0.8, 0.3], beak: sign ? 'flat' : 'smile', brows: sign ? 'worried' : 'happy', holding: sign}} />
    <Paper x={520} y={560} w={330} title="LOAN" amount="$180,000" at={P(11)} rot={-5} id="loan" />
    {sign && <div style={{position: 'absolute', left: 440, top: 560, fontFamily: 'Architects Daughter', fontSize: 56, color: '#1F4BA8', transform: 'rotate(-8deg)', clipPath: `inset(0 ${100 - cl((t - 18.95) / 0.5) * 100}% 0 0)`}}>Doug</div>}
    <BigWord text="loan" x={540} y={240} at={P(11)} until={18.95} size={140} color="#F08A24" />
    {sign && <BigWord text="sign" x={540} y={240} at={18.95} size={140} />}
  </>;
};

const Owe = ({t}: {t: number}) => {
  const late = t >= 20.5, top = t >= 21.7, n = top ? Math.min(24, 8 + Math.floor((t - 21.7) * 18)) : late ? 8 : 4;
  return <>
    <Snow />
    <Fox x={860} y={G + 120} h={460} flip mouth={late ? 0.5 : 0} sly={1} />
    <FishPile x={360} y={G + 60} n={n} w={140} />
    <Penguin id="doug" x={360} y={G + 120 - (top ? Math.min(220, (t - 21.7) * 260) : 0)} h={300} pose={{brows: 'shock', eyeScale: 1.3, beak: 'frown', sweat: true, flapL: 80, flapR: 80}} />
    <BigWord text="owe" x={540} y={300} at={P(12)} until={20.5} size={150} color={RED} />
    {late && !top && <BigWord text="late = more" x={540} y={300} at={20.5} size={130} color={RED} />}
    {top && <BigWord text="fish on fish" x={540} y={300} at={21.7} size={130} color={RED} />}
  </>;
};

const ManyDoug = ({t}: {t: number}) => <>
  <Snow />
  <Crowd x={540} y={G - 60} n={8} h={220} seed={1} />
  <Crowd x={560} y={G + 120} n={8} h={250} seed={3} />
  {[0, 1, 2, 3, 4].map((i) => <Paper key={i} x={150 + i * 190} y={560 + (i % 2) * 90} w={150} title="OWE" at={P(14) + 0.1 + i * 0.12} rot={i % 2 ? 6 : -6} id={`owe${i}`} />)}
  <BigWord text="many Doug" x={540} y={260} at={P(14)} size={140} color={RED} />
</>;

const Poor = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', inset: -400, background: '#E9EDF0'}} />
  <Penguin id="doug" x={540} y={G + 300} h={950} pose={{brows: 'worried', beak: 'frown', tears: true, lids: 0.45, flapL: 10, flapR: 10}} />
  <BigWord text="Doug poor." x={540} y={340} at={P(16)} size={140} color={RED} />
</>;

const DeFlagBig = ({y = 200, w = 260}: {y?: number; w?: number}) => <Flag x={540} y={y} w={w} flag="de" />;

const Germany = ({t}: {t: number}) => <>
  <Snow />
  <DeFlagBig y={180} w={300} />
  <BossBear x={lerp(1300, 560, ease((t - 26.9) / 0.6))} y={G + 120} h={640} mouth={t > 27.5 ? 0.4 : 0} />
  <BigWord text="Germany" x={540} y={470} at={P(17)} until={26.9} size={150} />
  {t >= 26.9 && <BigWord text="Boss Bear" x={540} y={470} at={26.9} size={140} color={RED} />}
</>;

const TakeFish = ({t}: {t: number}) => <>
  <Snow />
  <BossBear x={820} y={G + 120} h={540} mouth={0.3} />
  <Crowd x={320} y={G + 130} n={4} h={240} seed={2} />
  {[0, 1, 2, 3].map((i) => <FishFlight key={i} x1={160 + i * 110} y1={G - 140} x2={760} y2={G - 330} a={P(18) + 0.3 + i * 0.2} b={P(18) + 0.9 + i * 0.2} n={1} w={70} seed={i} arc={200} />)}
  <BigWord text="small fish" x={540} y={330} at={P(18)} size={120} />
  <BigWord text="from everybody" x={540} y={490} at={P(18) + 0.7} size={100} />
</>;

const PaysFor = ({t}: {t: number}) => <>
  <Snow />
  <BossBear x={540} y={G + 140} h={420} mouth={0.3} />
  <FishPile x={540} y={G - 300} n={10} w={110} />
  <College x={220} y={760} w={340} sign="COLLEGE" />
  {t >= 31.25 && <Road x={540} y={760} w={280} />}
  {t >= 31.85 && <Hospital x={860} y={760} w={280} />}
  <BigWord text="college" x={220} y={280} at={P(20) + 0.6} size={84} color={GREEN} />
  <BigWord text="roads" x={540} y={280} at={31.25} size={84} color={GREEN} />
  <BigWord text="hospital" x={860} y={280} at={31.85} size={84} color={GREEN} />
</>;

const Class = ({t}: {t: number}) => {
  const keep = t >= 33.1;
  return <>
    <Snow />
    <College x={760} y={G + 20} w={520} sign="UNI" color="#E2ECF5" />
    <Seal x={lerp(80, 330, ease((t - P(21)) / 0.6))} y={G + 120} h={300} mouth={keep ? 0.4 : 0} smug={keep} />
    <Sign x={300} y={G - 340} text="STUDENT" w={320} id="sign-stu" />
    {keep && <FishPile x={300} y={G + 140} n={6} w={110} />}
    <BigWord text="go to class" x={540} y={300} at={P(21)} until={33.1} size={120} />
    {keep && <BigWord text="keep fish" x={540} y={300} at={33.1} size={130} color={GREEN} />}
  </>;
};

const FoodIgloo = ({t}: {t: number}) => {
  const notClass = t >= 35.0;
  return <>
    <Snow />
    <Igloo x={250} y={G} w={320} id="stuIg" />
    <Fish x={250} y={720} w={200} id="foodfish" />
    <Card text="PAY" x={250} y={430} color={RED} at={P(22) + 0.2} t={t} w={260} h={140} size={90} />
    <College x={790} y={G} w={400} sign="CLASS" color="#E2ECF5" />
    {notClass && <Card text="$0" x={790} y={430} color={GREEN} at={35.0} t={t} w={260} h={140} size={100} />}
    <Seal x={540} y={G + 140} h={240} />
    <BigWord text="food + igloo" x={250} y={260} at={P(22)} size={80} />
    {notClass && <BigWord text="not class" x={790} y={260} at={35.0} size={80} color={GREEN} />}
  </>;
};

const AlmostZero = ({t}: {t: number}) => <>
  <DeFlagBig y={230} w={280} />
  <Card text="~$0" x={540} y={560} color={GREEN} at={P(23)} t={t} w={560} h={300} size={240} />
  <Seal x={540} y={1360} h={300} smug mouth={0.4} />
</>;

const Angry = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', inset: -400, background: '#FBE3E0'}} />
  <Penguin id="doug" x={540} y={G + 300} h={950} pose={{brows: 'angry', angry: 1, beak: 'frown', tremble: 1, flapL: 30, flapR: 30}} />
  <BigWord text="Doug angry." x={540} y={340} at={P(25)} size={140} color={RED} />
</>;

const RealPrivate = ({t}: {t: number}) => <>
  <BigWord text="real life" x={540} y={240} at={P(26)} size={120} />
  <Flag x={540} y={360} w={240} flag="us" />
  <College x={540} y={1100} w={560} sign="PRIVATE" />
  <Card text="$45,000 / year" x={540} y={600} color={RED} at={P(26) + 0.6} t={t} w={800} h={190} size={104} tilt={-2} />
  <Src text="College Board, Trends in College Pricing 2025-26 (avg private nonprofit 4-yr)" />
</>;

const RealPublic = ({t}: {t: number}) => {
  const notFree = t >= 43.4;
  return <>
    <Flag x={540} y={260} w={220} flag="us" />
    <College x={540} y={1100} w={520} sign="STATE U" color="#E2ECF5" />
    <Card text="~$12,000 / year" x={540} y={500} color="#F08A24" at={P(27) + 0.4} t={t} w={800} h={190} size={100} tilt={2} />
    {notFree && <Stamp text="NOT FREE" x={540} y={800} at={43.4} color={RED} size={110} />}
    <Src text="College Board 2025-26 (avg public 4-yr, in-state tuition + fees)" />
  </>;
};

const Trillion = ({t}: {t: number}) => <>
  <Snow />
  <Crowd x={540} y={G - 120} n={9} h={200} seed={1} />
  <Crowd x={560} y={G + 40} n={9} h={220} seed={3} />
  <Crowd x={520} y={G + 210} n={8} h={240} seed={5} />
  <Card text="$1.6 TRILLION+" x={540} y={330} color={RED} at={45.6} t={t} w={900} h={210} size={112} tilt={-2} />
  <BigWord text="student loans" x={540} y={640} at={46.3} size={110} color={RED} />
  <Src text="Federal Reserve / NY Fed household debt data, 2026" y={1460} />
</>;

const NoTuition = ({t}: {t: number}) => <>
  <DeFlagBig y={220} w={280} />
  <College x={540} y={1000} w={520} sign="UNI" color="#E2ECF5" />
  <Stamp text="NO TUITION" x={540} y={560} at={P(29) + 1.0} color={GREEN} size={120} />
  {t >= 49.2 && <Card text="small fee / semester" x={540} y={1060} color="#F08A24" at={49.2} t={t} w={760} h={150} size={70} />}
  <Src text="Public universities, most German states (some charge non-EU students)" y={1260} />
</>;

const HigherTax = ({t}: {t: number}) => <>
  <Snow />
  <BossBear x={780} y={G + 120} h={560} mouth={0.3} />
  <Seal x={260} y={G + 130} h={260} mouth={0} />
  <FishFlight x1={300} y1={G - 140} x2={700} y2={G - 360} a={P(30) + 0.8} b={E(30)} n={5} w={90} arc={220} />
  <BigWord text="nothing is free" x={540} y={300} at={P(30)} until={51.4} size={110} color={RED} />
  {t >= 51.4 && <Card text="HIGHER TAX" x={540} y={260} color={RED} at={51.4} t={t} w={640} h={170} size={100} tilt={-2} />}
</>;

const Move = ({t}: {t: number}) => {
  const study = t >= 53.1, happy = t >= 53.8, w = ease((t - P(31)) / 0.6);
  return <>
    <Snow />
    {!study && <><Sign x={860} y={G - 300} text="GERMANY" w={320} id="sign-de" />
      <Penguin id="doug" x={lerp(150, 560, w)} y={G + 120} h={430} pose={{side: true, turn: 1, walk: t * 3, beak: 'smile'}} />
      <Suitcase x={lerp(270, 680, w)} y={G + 110} /></>}
    {study && !happy && <><College x={540} y={G - 20} w={520} sign="UNI" color="#E2ECF5" />
      <Penguin id="doug" x={540} y={G + 140} h={380} pose={{look: [0, -0.6], beak: 'smile', brows: 'happy', flapR: 110}} />
      <BigWord text="study" x={540} y={260} at={53.1} size={130} /></>}
    {happy && <><DeFlagBig y={180} w={240} />
      <Penguin id="doug" x={540} y={G + 140} h={620} pose={{beak: 'smile', brows: 'happy', lids: 0.3, blush: 1, flapL: 120, flapR: 120, hop: Math.abs(Math.sin(t * 6)) * 0.5}} />
      <BigWord text="Doug happy" x={540} y={460} at={53.8} size={130} color={GREEN} /></>}
  </>;
};

const Graduate = ({t}: {t: number}) => {
  const step = t >= 55.45 ? 3 : t >= 55.0 ? 2 : t >= 54.6 ? 1 : 0;
  return <>
    <Snow bg={step === 1 ? '#DCE6F5' : undefined} />
    {step === 0 && <><Penguin id="doug" x={540} y={G + 140} h={560} pose={{beak: 'smile', brows: 'happy', holding: true, flapR: 60}} />
      <Fish x={650} y={G - 300} w={200} id="eatfish" rot={-30} /><BigWord text="eat" x={540} y={300} at={P(32)} size={140} /></>}
    {step === 1 && <><Penguin id="doug" x={540} y={G + 120} h={520} pose={{lie: 1, lids: 1, beak: 'flat'}} />
      <BigWord text="Zzz" x={760} y={520} at={54.6} size={140} color="#3A9BD9" /><BigWord text="sleep" x={540} y={300} at={54.6} size={140} /></>}
    {step >= 2 && <><Grad x={540} y={lerp(900, 420, ease((t - 55.0) / 0.4))} w={260} rot={t * 120 % 360} />
      <Penguin id="doug" x={540} y={G + 140} h={560} pose={{beak: 'smile', brows: 'happy', flapL: 150, flapR: 150, hop: Math.abs(Math.sin(t * 7)) * 0.4}} />
      {step === 2 && <BigWord text="graduate" x={540} y={260} at={55.0} size={130} color={GREEN} />}
      {step === 3 && <Stamp text="NO DEBT" x={540} y={760} at={55.45} color={GREEN} size={130} />}</>}
  </>;
};

const TaxPaper = ({t}: {t: number}) => <>
  <Snow />
  <BossBear x={830} y={G + 120} h={480} mouth={0.2} />
  <Paper x={500} y={560} w={330} title="TAX" amount="-fish" at={P(33) + 0.1} rot={-6} id="taxpaper" />
  <Penguin id="doug" x={260} y={G + 120} h={460} pose={{turn: 0.5, look: [0.7, -0.4], brows: 'worried', beak: 'frown', lids: t >= 56.7 ? 0.5 : 0, holding: true}} />
  {t >= 56.7 && <BigWord text="sigh..." x={300} y={300} at={56.7} size={120} color="#888" />}
</>;

const Think = ({t}: {t: number}) => {
  const hard = t >= 57.75, choose = t >= 58.15;
  return <>
    <Snow />
    <Penguin id="doug" x={360} y={G + 120} h={choose ? 600 : 520} pose={{look: [0.5, -0.8], brows: choose ? 'happy' : 'worried', beak: choose ? 'smile' : 'flat', tremble: hard && !choose ? 1 : 0, sweat: hard && !choose, flapR: choose ? 130 : 20}} />
    <Thought x={760} y={480} w={420} tx={520} ty={G - 520} at={P(34) + 0.1}><div style={{position: 'relative', width: 420, height: 260}}>
      {!choose ? <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONT, fontWeight: 900, fontSize: 64, color: INK}}>
        <span style={{color: RED}}>$45K</span>&nbsp;or&nbsp;<span style={{color: GREEN}}>TAX</span></div>
        : <svg width={260} height={164} viewBox="0 0 190 120" style={{position: 'absolute', left: 80, top: 48}}><DeFlag /></svg>}</div></Thought>
    {hard && !choose && <BigWord text="think hard" x={540} y={190} at={57.75} size={110} />}
    {choose && <BigWord text="still Germany" x={540} y={190} at={58.15} size={110} color={GREEN} />}
  </>;
};

const Cta = ({t}: {t: number}) => <>
  <Snow />
  <Card text="TAX · FREE COLLEGE" x={540} y={300} color={GREEN} at={P(35) + 0.2} t={t} tilt={-3} w={880} h={170} size={80} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center', fontFamily: MONT, fontWeight: 900, fontSize: 80, color: INK}}>or</div>
  <Card text="PAY LARRY $45K" x={540} y={620} color={RED} at={59.85} t={t} tilt={3} w={880} h={170} size={90} />
  <Penguin id="doug" x={360} y={G + 120} h={460} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0, 0.6]}} />
  <Walrus id="larry" x={830} y={G + 150} h={380} pose={{laugh: 1, mouth: 0.4}} />
  <BigWord text="👇" x={600} y={1080} at={60.3} size={140} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(2), set: (t) => <Same t={t} />, fx_: 'zoom'},
  {at: P(4), set: (t) => <Intro t={t} />, fx_: 'pop'},
  {at: P(5), set: (t) => <NeedPaper t={t} />, fx_: 'swipe'},
  {at: P(6), set: (t) => <Building t={t} />, fx_: 'swipeL'},
  {at: P(7), set: (t) => <Price t={t} />, fx_: 'pop'},
  {at: P(8), set: (t) => <FourYears t={t} />, fx_: 'zoom'},
  {at: P(9), set: (t) => <Discount t={t} />, fx_: 'swipe'},
  {at: 15.25, set: (t) => <Scholarship t={t} />, fx_: 'pop'},
  {at: P(10), set: (t) => <NoFish t={t} />, fx_: 'iris'},
  {at: P(11), set: (t) => <Loan t={t} />, fx_: 'swipeL'},
  {at: P(12), set: (t) => <Owe t={t} />, fx_: 'pop'},
  {at: P(13), set: () => <Called lines={['INTEREST']} />, fx_: 'zoom'},
  {at: P(14), set: (t) => <ManyDoug t={t} />, fx_: 'swipe'},
  {at: P(15), set: () => <Called lines={['STUDENT', 'DEBT']} />, fx_: 'zoom'},
  {at: P(16), set: (t) => <Poor t={t} />, fx_: 'zoom'},
  {at: P(17), set: (t) => <Germany t={t} />, fx_: 'iris'},
  {at: P(18), set: (t) => <TakeFish t={t} />, fx_: 'swipe'},
  {at: P(19), set: () => <Called lines={['TAX']} />, fx_: 'zoom'},
  {at: P(20), set: (t) => <PaysFor t={t} />, fx_: 'pop'},
  {at: P(21), set: (t) => <Class t={t} />, fx_: 'swipeL'},
  {at: P(22), set: (t) => <FoodIgloo t={t} />, fx_: 'swipe'},
  {at: P(23), set: (t) => <AlmostZero t={t} />, fx_: 'pop'},
  {at: P(24), set: () => <Called lines={['PUBLIC', 'UNIVERSITY']} />, fx_: 'zoom'},
  {at: P(25), set: (t) => <Angry t={t} />, fx_: 'zoom'},
  {at: P(26), set: (t) => <RealPrivate t={t} />, fx_: 'iris'},
  {at: P(27), set: (t) => <RealPublic t={t} />, fx_: 'swipeL'},
  {at: P(28), set: (t) => <Trillion t={t} />, fx_: 'pop'},
  {at: P(29), set: (t) => <NoTuition t={t} />, fx_: 'swipe'},
  {at: P(30), set: (t) => <HigherTax t={t} />, fx_: 'swipeL'},
  {at: P(31), set: (t) => <Move t={t} />, fx_: 'iris'},
  {at: P(32), set: (t) => <Graduate t={t} />, fx_: 'pop'},
  {at: P(33), set: (t) => <TaxPaper t={t} />, fx_: 'swipe'},
  {at: P(34), set: (t) => <Think t={t} />, fx_: 'zoom'},
  {at: P(35), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[7, 560, 700, 1.22], [12, 450, 800, 1.2], [16, 540, 760, 1.25], [23, 540, 700, 1.3], [32, 540, 900, 1.2]];

export const DougCollege = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // push toward the side being named (USA, then Germany), back out on "Same degree"
    const toUS = ease((tc - 1.0) / 0.6) * (tc < DE() ? 1 : 0), toDE = ease((tc - DE()) / 0.5) * (tc < P(2) ? 1 : 0);
    s0 = 1 + 0.18 * (toUS + toDE); fx = 540 - 230 * toUS + 230 * toDE; fy = 960 + 40 * (toUS + toDE);
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (tc < 1.0 ? 1 : beat(tc, TIM));
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-college-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.3} name="user-cash-register" vol={0.3} />
    <Sfx at={DE()} name="user-boom" vol={0.45} />
    <Sfx at={P(2)} name="user-slap" vol={0.35} />
    <Sfx at={P(3)} name="penguin-honk" vol={0.35} />
    <Sfx at={P(4)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(4) + 0.5} name="user-pop" vol={0.3} />
    <Sfx at={P(5) + 0.2} name="user-notif" vol={0.3} />
    <Sfx at={7.0} name="swoosh-fast" vol={0.3} />
    <Sfx at={8.6} name="walrus-laugh" vol={0.4} />
    <Sfx at={P(7) + 0.2} name="user-cash-register" vol={0.4} />
    <Sfx at={P(7) + 0.5} name="user-shock" vol={0.35} />
    <Sfx at={10.05} name="user-money" vol={0.3} />
    {[0, 1, 2, 3].map((i) => <Sfx key={`y${i}`} at={P(8) + 0.05 + i * 0.22} name="user-pop" vol={0.28} />)}
    <Sfx at={11.5} name="user-boom" vol={0.45} />
    <Sfx at={12.6} name="user-slap" vol={0.35} />
    <Sfx at={14.3} name="swoosh-fast" vol={0.3} />
    <Sfx at={14.5} name="user-ting" vol={0.35} />
    <Sfx at={16.1} name="user-wrong" vol={0.35} />
    <Sfx at={P(10) + 0.1} name="user-aww" vol={0.35} />
    <Sfx at={P(11)} name="user-notif2" vol={0.3} />
    <Sfx at={18.95} name="user-money-transfer" vol={0.3} />
    <Sfx at={20.5} name="user-timer" vol={0.3} />
    <Sfx at={21.7} name="user-money" vol={0.35} />
    <Sfx at={P(13)} name="user-boom" vol={0.4} />
    <Sfx at={P(14)} name="user-wow" vol={0.3} />
    <Sfx at={P(15)} name="user-boom" vol={0.4} />
    <Sfx at={P(16)} name="user-fahh" vol={0.45} />
    <Sfx at={P(17)} name="user-horn" vol={0.3} />
    <Sfx at={27.4} name="walrus-grunt" vol={0.35} />
    <Sfx at={P(18) + 0.3} name="user-money-transfer" vol={0.3} />
    <Sfx at={P(19)} name="user-boom" vol={0.4} />
    <Sfx at={P(20) + 0.6} name="user-pop" vol={0.3} />
    <Sfx at={31.25} name="user-pop" vol={0.3} />
    <Sfx at={31.85} name="user-pop" vol={0.3} />
    <Sfx at={33.1} name="user-yeah" vol={0.35} />
    <Sfx at={P(22) + 0.2} name="user-cash-register" vol={0.3} />
    <Sfx at={35.0} name="user-ting" vol={0.35} />
    <Sfx at={P(23)} name="user-wow" vol={0.4} />
    <Sfx at={P(24)} name="user-boom" vol={0.4} />
    <Sfx at={P(25)} name="user-fahh-long" vol={0.4} />
    <Sfx at={P(26) + 0.6} name="user-cash-register" vol={0.35} />
    <Sfx at={P(27) + 0.4} name="user-ting" vol={0.35} />
    <Sfx at={43.4} name="user-wrong" vol={0.35} />
    <Sfx at={45.6} name="user-boom" vol={0.45} />
    <Sfx at={46.3} name="user-shock" vol={0.35} />
    <Sfx at={P(29) + 1.0} name="user-ting" vol={0.4} />
    <Sfx at={P(30) + 0.8} name="user-money-transfer" vol={0.3} />
    <Sfx at={51.4} name="user-slap" vol={0.35} />
    <Sfx at={P(31)} name="swoosh-fast" vol={0.3} />
    <Sfx at={53.8} name="user-yeah" vol={0.4} />
    <Sfx at={55.0} name="user-wow" vol={0.35} />
    <Sfx at={55.45} name="user-ting" vol={0.4} />
    <Sfx at={P(33) + 0.1} name="user-notif" vol={0.3} />
    <Sfx at={56.7} name="user-aww" vol={0.4} />
    <Sfx at={57.75} name="user-timer" vol={0.25} />
    <Sfx at={58.15} name="user-yeah" vol={0.35} />
    <Sfx at={P(35) + 0.2} name="user-pop" vol={0.3} />
    <Sfx at={59.85} name="walrus-laugh" vol={0.35} />
    <Sfx at={60.3} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
