// EP7 "Internet Explained by Doug" — USA $25 vs India ~$2 for one month of data (same phone, same 2GB on screen).
// Hook = clean versus layout (user-approved still). Line timings: studio/src/data/doug-internet.json (Kokoro VO, one line per phrase).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Walrus} from '../penguin/cast';
import {BigWord, Crowd, FishFlight, FishPile, PriceTag, Sign, Stamp, Title} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {GREEN, RED, UsFlag, Vs, Why} from './dougVenezuela';
import TIM from '../data/doug-internet.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_INTERNET_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1250;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const MONT = 'Montserrat';

// ---------- props ----------
const InFlag = () => <g>
  <rect width={190} height={40} fill="#FF9933" /><rect y={40} width={190} height={40} fill="#fff" /><rect y={80} width={190} height={40} fill="#138808" />
  <circle cx={95} cy={60} r={14} fill="none" stroke="#1F4BA8" strokeWidth={4} />
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} />
</g>;
const Flag = ({x, y, w = 240, flag}: {x: number; y: number; w?: number; flag: 'us' | 'in'}) =>
  <svg width={w} height={w * 0.632} viewBox="0 0 190 120" style={{position: 'absolute', left: x - w / 2, top: y}}>{flag === 'us' ? <UsFlag /> : <InFlag />}</svg>;
const Name = ({text, x, y, size = 76}: {text: string; x: number; y: number; size?: number}) =>
  <div style={{position: 'absolute', left: x - 250, width: 500, top: y, textAlign: 'center', fontFamily: MONT, fontWeight: 900, fontSize: size, color: INK}}>{text}</div>;
// Price tag card: solid colour, white numbers (readable at a glance).
const PriceCard = ({text, x, y, color, at, t, tilt = 0, w = 380, h = 190, size = 150}: {text: string; x: number; y: number; color: string; at: number; t: number; tilt?: number; w?: number; h?: number; size?: number}) => {
  const p = ease((t - at) / 0.3); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x - w / 2, width: w, top: y, height: h, borderRadius: 32, background: color, border: `9px solid ${INK}`, boxShadow: `0 12px 0 ${INK}`, boxSizing: 'border-box',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONT, fontWeight: 900, fontSize: size, color: '#fff', letterSpacing: -4, whiteSpace: 'nowrap',
    transform: `scale(${0.5 + 0.5 * p}) rotate(${tilt}deg)`}}>{text}</div>;
};
// Phone (x = centre, y = bottom), screen content as children.
const Phone = ({x, y, w = 300, color = '#2B2F36', rot = 0, children}: {x: number; y: number; w?: number; color?: string; rot?: number; children?: React.ReactNode}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 1.75, width: w, height: w * 1.75, borderRadius: w * 0.15, background: color, border: `${Math.round(w * 0.03 + 4)}px solid ${INK}`, boxSizing: 'border-box', padding: w * 0.07, transform: `rotate(${rot}deg)`}}>
    <div style={{position: 'absolute', left: '50%', top: w * 0.025, width: w * 0.26, height: w * 0.04, marginLeft: -w * 0.13, borderRadius: 8, background: INK}} />
    <div style={{width: '100%', height: '100%', borderRadius: w * 0.08, background: '#fff', border: `5px solid ${INK}`, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative'}}>{children}</div>
  </div>;
const Wifi = ({size = 90, color = INK}: {size?: number; color?: string}) =>
  <svg width={size} height={size * 0.8} viewBox="0 0 100 80"><g fill="none" stroke={color} strokeWidth={10} strokeLinecap="round">
    <path d="M8 30 Q50 -6 92 30" /><path d="M24 46 Q50 22 76 46" /></g><circle cx={50} cy={66} r={9} fill={color} /></svg>;
const Txt = ({text, size, color = INK, font = MONT}: {text: string; size: number; color?: string; font?: string}) =>
  <div style={{fontFamily: font, fontWeight: 900, fontSize: size, color, lineHeight: 1.05, whiteSpace: 'nowrap', textAlign: 'center'}}>{text}</div>;
const GbScreen = ({gb = '2GB', size = 100}: {gb?: string; size?: number}) => <><Wifi size={size * 0.85} /><Txt text={gb} size={size} /><Txt text="DATA" size={size * 0.4} /></>;
const DataBar = ({fill, w = 220, color = GREEN}: {fill: number; w?: number; color?: string}) =>
  <div style={{width: w, height: 40, borderRadius: 20, border: `5px solid ${INK}`, background: '#E8EEF2', boxSizing: 'border-box', padding: 3, marginTop: 14}}>
    <div style={{width: `${cl(fill) * 100}%`, height: '100%', borderRadius: 14, background: fill < 0.25 ? RED : color}} /></div>;
const Play = ({size = 120}: {size?: number}) =>
  <svg width={size} height={size} viewBox="0 0 100 100"><circle cx={50} cy={50} r={44} fill={RED} stroke={INK} strokeWidth={6} /><path d="M40 30 L72 50 L40 70 Z" fill="#fff" /></svg>;
// Phone tower: lattice mast with pulsing signal arcs.
const Tower = ({x, y, h = 820, t, sign}: {x: number; y: number; h?: number; t: number; sign?: string}) => {
  const w = h * 0.4;
  return <>
    <svg width={w * 2.4} height={h + 40} viewBox={`${-w * 0.7} -40 ${w * 2.4} ${h + 40}`} style={{position: 'absolute', left: x - w * 1.2, top: y - h, overflow: 'visible'}}>
      {[0, 1, 2].map((i) => { const p = (t * 1.2 + i / 3) % 1;
        return <g key={i} opacity={1 - p} fill="none" stroke="#3A9BD9" strokeWidth={9} strokeLinecap="round">
          <path d={`M${w / 2 - 60 - p * 160} ${60 - p * 50} Q${w / 2 - 90 - p * 200} 110 ${w / 2 - 60 - p * 160} ${160 + p * 50}`} />
          <path d={`M${w / 2 + 60 + p * 160} ${60 - p * 50} Q${w / 2 + 90 + p * 200} 110 ${w / 2 + 60 + p * 160} ${160 + p * 50}`} /></g>; })}
      <path d={`M0 ${h} L${w / 2 - 14} 90 L${w / 2 + 14} 90 L${w} ${h}`} fill="none" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      {Array.from({length: 6}, (_, i) => { const y1 = 90 + (h - 90) * i / 6, y2 = 90 + (h - 90) * (i + 1) / 6, a = (y: number) => (w / 2 - 14) * (y - h) / (90 - h);
        return <path key={i} d={`M${a(y1)} ${y1} L${w - a(y2)} ${y2} M${w - a(y1)} ${y1} L${a(y2)} ${y2} M${a(y2)} ${y2} L${w - a(y2)} ${y2}`} stroke={INK} strokeWidth={5} />; })}
      <rect x={w / 2 - 30} y={60} width={60} height={60} rx={10} fill="#E8443A" stroke={INK} strokeWidth={6} />
      <line x1={w / 2} y1={60} x2={w / 2} y2={0} stroke={INK} strokeWidth={8} /><circle cx={w / 2} cy={0} r={12} fill={RED} stroke={INK} strokeWidth={5} />
    </svg>
    {sign && <Sign x={x} y={y - h * 0.42} text={sign} w={300} id={`sign-${sign}`} />}
  </>;
};
const Snow = () => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 900, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />;
const Note = ({text, y = 1420}: {text: string; y?: number}) =>
  <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 34, color: '#888'}}>{text}</div>;
const Suitcase = ({x, y, w = 150}: {x: number; y: number; w?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.8, width: w, height: w * 0.8, background: '#C9773A', border: `6px solid ${INK}`, borderRadius: 16, boxSizing: 'border-box'}}>
    <div style={{position: 'absolute', left: '30%', top: -w * 0.18, width: '40%', height: w * 0.18, border: `6px solid ${INK}`, borderBottom: 'none', borderRadius: '12px 12px 0 0', boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: '45%', top: 0, width: '10%', height: '100%', background: '#8E4E20'}} /></div>;

// ---------- hook (clean versus layout) ----------
const IN = () => P(1);
const Hook = ({t}: {t: number}) => {
  const lookR = t >= IN();
  return <>
    <div style={{position: 'absolute', inset: 0, transform: 'translateY(-175px) scale(0.92)', transformOrigin: '50% 0'}}><Why t={t} /></div>
    <Flag x={250} y={395} flag="us" /><Flag x={830} y={395} flag="in" />
    <Name text="USA" x={250} y={555} /><Name text="INDIA" x={830} y={555} />
    <PriceCard text="$25" x={250} y={670} color={RED} at={0.3} t={t} tilt={-3} />
    <PriceCard text="$2" x={830} y={670} color={GREEN} at={IN()} t={t} tilt={3} />
    <Vs x={540} y={765} t={t} />
    <Phone x={230} y={1490} w={300} color="#E8443A" rot={Math.sin(t * 3) * 1.5}><GbScreen /></Phone>
    <Phone x={850} y={1490} w={300} color={GREEN} rot={-Math.sin(t * 3) * 1.5}><GbScreen /></Phone>
    <Penguin id="doug" x={540} y={1490} h={380} pose={{turn: lookR ? 0.5 : -0.5, look: [lookR ? 0.8 : -0.8, -0.3], brows: lookR ? 'shock' : 'worried', eyeScale: lookR ? 1.25 : 1.05, pupil: lookR ? 0.5 : 1, beak: 'frown', flapR: 35, flapL: 35, sweat: lookR}} />
  </>;
};

// ---------- sets ----------
const Intro = ({t}: {t: number}) => <>
  <Snow />
  <Penguin id="doug" x={480} y={G + 120} h={720} pose={{beak: 'smile', brows: 'happy', flapR: 70 + Math.sin(t * 4) * 6, look: [0.6, -0.2]}} />
  <Phone x={790} y={G - 260} w={190} rot={12}><GbScreen size={56} /></Phone>
  <BigWord text="Doug" x={540} y={330} at={P(3)} size={150} />
  <BigWord text="+ phone" x={640} y={500} at={P(3) + 0.9} size={110} color="#3A9BD9" />
</>;

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const Watch = ({t}: {t: number}) => {
  const d = Math.floor(Math.max(0, t - P(4)) / 0.3) % 7;
  return <>
    <Snow />
    <Phone x={600} y={G + 60} w={480}>
      <Play size={170} />
      <div style={{width: 300, height: 16, background: '#E8EEF2', borderRadius: 8, marginTop: 30, border: `4px solid ${INK}`}}><div style={{width: `${((t * 40) % 100)}%`, height: '100%', background: RED, borderRadius: 6}} /></div>
    </Phone>
    <Penguin id="doug" x={190} y={G + 120} h={430} pose={{look: [0.9, -0.4], eyeScale: 1.2, beak: 'smile', flapR: 40}} />
    <div style={{position: 'absolute', left: 340, top: 260, width: 400, height: 170, background: '#fff', border: `7px solid ${INK}`, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONT, fontWeight: 900, fontSize: 100, color: RED}}>{DAYS[d]}</div>
    <BigWord text="every day" x={540} y={1380} at={P(4) + 0.6} size={110} color={RED} />
  </>;
};

const TowerSet = ({t}: {t: number}) => {
  const larry = t >= P(6);
  return <>
    <Snow />
    <Tower x={700} y={G} t={t} sign={larry ? 'LARRY DATA' : undefined} />
    <Penguin id="doug" x={210} y={G + 110} h={420} pose={{look: [0.9, -0.6], beak: 'smile', flapR: 120}} />
    <Phone x={330} y={G - 200} w={110} rot={20}><Wifi size={56} color="#3A9BD9" /></Phone>
    {larry && <Walrus id="larry" x={lerp(1250, 860, ease((t - P(6)) / 0.4))} y={G + 140} h={420} pose={{laugh: t > P(6) + 0.5 ? 1 : 0}} />}
    <BigWord text="data" x={300} y={360} at={P(5)} until={P(6)} size={140} color="#3A9BD9" />
    {larry && <BigWord text="Larry" x={540} y={300} at={P(6)} size={140} />}
  </>;
};

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'];
const Pay = ({t}: {t: number}) => {
  const m = Math.floor(Math.max(0, t - P(7)) / 0.35) % 8;
  return <>
    <Snow />
    <Penguin id="doug" x={250} y={G + 120} h={470} pose={{turn: 0.5, look: [0.8, 0], beak: 'frown', brows: 'worried', flapR: 90}} />
    <Walrus id="larry" x={820} y={G + 140} h={500} pose={{laugh: 1, mouth: 0.5}} />
    <FishFlight x1={330} y1={G - 280} x2={760} y2={G - 300} a={P(7) + 0.1} b={E(7) + 0.3} n={7} w={110} arc={150} />
    <div style={{position: 'absolute', left: 390, top: 300, width: 300, height: 200, background: '#fff', border: `7px solid ${INK}`, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONT, fontWeight: 900, fontSize: 92, color: RED}}>
      <div style={{position: 'absolute', top: -7, left: -7, right: -7, height: 50, background: RED, border: `7px solid ${INK}`, borderRadius: '18px 18px 0 0'}} />{MONTHS[m]}</div>
    <BigWord text="every month" x={540} y={620} at={P(7) + 0.8} size={100} color={RED} />
  </>;
};

const America = ({t}: {t: number}) => <>
  <Snow />
  <Flag x={540} y={230} w={260} flag="us" />
  <Tower x={830} y={G} h={700} t={t} />
  <Walrus id="larry" x={720} y={G + 140} h={480} pose={{mouth: t < P(9) ? 0.5 : 0, laugh: t >= P(9) ? 1 : 0}} />
  <PriceCard text="$25" x={540} y={470} color={RED} at={P(8) + 0.4} t={t} tilt={-4} w={420} h={210} size={170} />
  <Penguin id="doug" x={230} y={G + 120} h={430} pose={{turn: 0.5, look: [0.8, -0.3], brows: 'worried', beak: 'frown', sweat: t >= P(9), flapR: t >= P(9) ? 100 : 20}} />
  {t >= P(9) + 0.6 && <FishFlight x1={300} y1={G - 250} x2={620} y2={G - 300} a={P(9) + 0.6} b={E(9) + 0.4} n={5} w={100} />}
  <BigWord text="price high" x={540} y={820} at={P(9)} size={110} color={RED} />
</>;

const Jio = ({t}: {t: number}) => {
  const free = t >= P(11);
  return <>
    <Snow />
    <Flag x={540} y={200} w={240} flag="in" />
    <Tower x={300} y={G} h={760} t={t} sign="JIO" />
    <Walrus id="jio" x={lerp(-200, 470, ease((t - P(10)) / 0.5))} y={G + 140} h={440} flip pose={{laugh: free ? 1 : 0, mouth: 0.4}} />
    {free && <PriceCard text="FREE DATA" x={720} y={430} color={GREEN} at={P(11)} t={t} tilt={4} w={600} h={190} size={104} />}
    {free && <Crowd x={lerp(1500, 860, ease((t - P(11) - 0.2) / 0.8))} y={G + 150} n={5} h={250} run={1} dir={-1} />}
    <BigWord text="Jio Larry" x={760} y={760} at={P(10) + 0.4} until={P(11)} size={110} color="#1F4BA8" />
    {free && <BigWord text="FREE!" x={720} y={760} at={P(11) + 0.8} size={150} color={GREEN} />}
  </>;
};

const Airtel = ({t}: {t: number}) => {
  const cut = t >= P(13);
  return <>
    <Snow />
    <Tower x={760} y={G} h={760} t={t} sign="AIRTEL" />
    <Walrus id="airtel" x={600} y={G + 140} h={480} pose={{mouth: 0.9, lids: 0, flap: Math.sin(t * 14) * 0.8}} />
    {!cut && <BigWord text="!!!" x={600} y={560} at={P(12)} size={180} color={RED} />}
    <PriceCard text="$25" x={260} y={420} color={RED} at={P(12)} t={t} tilt={-4} w={340} h={170} size={130} />
    {cut && <div style={{position: 'absolute', left: 80, top: 500, width: 360, height: 16, background: INK, transform: 'rotate(-12deg)', borderRadius: 8}} />}
    {cut && <PriceCard text="$10" x={260} y={680} color={GREEN} at={P(13) + 0.4} t={t} tilt={3} w={340} h={170} size={130} />}
    <BigWord text="panic" x={760} y={300} at={P(12) + 0.3} until={P(13)} size={130} color={RED} />
    {cut && <BigWord text="cut price" x={760} y={300} at={P(13)} size={120} color={GREEN} />}
  </>;
};

const AllCut = ({t}: {t: number}) => {
  const down = t >= P(15), steps = ['$25', '$10', '$5', '$2'];
  return <>
    <Snow />
    {[180, 540, 900].map((x, i) => <Walrus key={i} id={`w${i}`} x={x} y={G + 140} h={330} flip={i === 0} pose={{mouth: 0.6, laugh: down ? 0 : 1}} />)}
    {[180, 540, 900].map((x, i) => <PriceTag key={`p${i}`} x={x} y={G - 380} price="CUT" at={P(14) + i * 0.25} size={0.8} rot={i % 2 ? 5 : -5} />)}
    {down && steps.map((s, i) => <PriceCard key={s} text={s} x={210 + i * 220} y={320 + i * 120} color={i === 3 ? GREEN : RED} at={P(15) + i * 0.45} t={t} w={220} h={130} size={84} />)}
    {down && <svg width={900} height={600} style={{position: 'absolute', left: 120, top: 300, overflow: 'visible'}}>
      <path d="M40 40 L780 520" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease((t - P(15)) / 1.4)} stroke={RED} strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.35} /></svg>}
    {!down && <BigWord text="all cut" x={540} y={420} at={P(14)} size={150} color={RED} />}
  </>;
};

const Called = ({lines}: {lines: string[]}) => <Title lines={lines} y={860} at={-99} size={170} />;

const Billion = ({t}: {t: number}) => <>
  <Snow />
  <Flag x={540} y={200} w={200} flag="in" />
  <Crowd x={540} y={G - 120} n={9} h={210} seed={1} />
  <Crowd x={560} y={G + 40} n={9} h={230} seed={3} />
  <Crowd x={520} y={G + 210} n={8} h={250} seed={5} />
  <BigWord text="1 BILLION" x={540} y={470} at={P(17) + 0.2} size={160} color={RED} />
  <BigWord text="phones" x={540} y={640} at={P(17) + 0.6} size={110} />
</>;

const SellSmall = ({t}: {t: number}) => <>
  <Snow />
  <Walrus id="larry" x={300} y={G + 140} h={440} flip pose={{laugh: 1, mouth: 0.4}} />
  <Crowd x={810} y={G + 150} n={4} h={240} seed={2} />
  {Array.from({length: 8}, (_, i) => { const p = cl((t - P(18) - i * 0.25) / 0.7); if (p <= 0 || p >= 1) return null;
    return <div key={i} style={{position: 'absolute', left: lerp(380, 650 + (i % 4) * 110, p), top: lerp(G - 300, G - 260, p) - Math.sin(p * Math.PI) * 260, width: 54, height: 90, borderRadius: 12, background: GREEN, border: `5px solid ${INK}`, transform: `rotate(${p * 360}deg)`}} />; })}
  <BigWord text="sell small" x={540} y={380} at={P(18)} size={130} color={GREEN} />
  <BigWord text="to everybody" x={540} y={560} at={P(18) + 1.0} size={110} />
</>;

const Equation = ({t}: {t: number}) => <>
  <Snow />
  <PriceCard text="$2" x={190} y={360} color={GREEN} at={P(19)} t={t} w={240} h={160} size={110} />
  <BigWord text="×" x={380} y={440} at={P(19) + 0.5} size={140} />
  <Crowd x={700} y={600} n={5} h={210} seed={4} />
  <BigWord text="many Doug" x={700} y={300} at={P(19) + 0.6} size={90} />
  <BigWord text="=" x={540} y={760} at={P(19) + 1.2} size={160} />
  {t >= P(19) + 1.3 && <FishPile x={540} y={G + 40} n={22} w={150} />}
  {t >= P(19) + 1.3 && <BigWord text="big money" x={540} y={1380} at={P(19) + 1.3} size={120} color={GREEN} />}
</>;

const Angry = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', inset: -400, background: '#FBE3E0'}} />
  <Penguin id="doug" x={540} y={G + 300} h={950} pose={{brows: 'angry', angry: 1, beak: 'frown', tremble: 1, flapL: 30, flapR: 30}} />
  <BigWord text="Doug angry." x={540} y={340} at={P(21)} size={140} color={RED} />
</>;

const RealUS = ({t}: {t: number}) => <>
  <BigWord text="real life" x={540} y={260} at={P(22)} size={120} />
  <Flag x={240} y={420} w={220} flag="us" />
  <Name text="USA" x={240} y={570} size={70} />
  <Phone x={640} y={1300} w={420} color="#E8443A">
    <Txt text="$25" size={150} color={RED} /><Txt text="/ month" size={50} />
    <div style={{height: 30}} /><Wifi size={80} /><Txt text="UNLIMITED" size={52} color={GREEN} />
  </Phone>
  <Note text="Visible (Verizon), base plan, Oct 2026" />
</>;

const RealIN = ({t}: {t: number}) => {
  const only = t >= P(24);
  return <>
    <Flag x={240} y={420} w={220} flag="in" />
    <Name text="INDIA" x={240} y={570} size={70} />
    <Phone x={640} y={1300} w={420} color={GREEN}>
      <Txt text="189" size={150} color={GREEN} /><Txt text="RUPEES" size={46} />
      <Txt text="≈ $2" size={80} color={INK} />
      <div style={{height: 20}} /><Txt text="2GB" size={66} color={only ? RED : INK} /><DataBar fill={only ? 0.18 : 0.6} />
    </Phone>
    {only && <Stamp text="ONLY 2GB" x={330} y={900} at={P(24)} color={RED} size={100} />}
    <Note text="Jio 189 / Airtel 199 rupee plans, 28 days, Oct 2026" />
  </>;
};

const Move = ({t}: {t: number}) => {
  const happy = t >= P(26), w = ease((t - P(25)) / 1.4);
  return <>
    <Snow />
    <Sign x={880} y={G - 300} text="INDIA" w={280} id="sign-india" />
    {!happy && <><Penguin id="doug" x={lerp(150, 560, w)} y={G + 120} h={430} pose={{side: true, turn: 1, walk: t * 3, beak: 'smile'}} />
      <Suitcase x={lerp(270, 680, w)} y={G + 110} /></>}
    {happy && <>
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 200, top: 520 + (i % 2) * 120 + Math.sin(t * 6 + i) * 20, fontSize: 90}}>✨</div>)}
      <Penguin id="doug" x={540} y={G + 140} h={620} pose={{beak: 'smile', brows: 'happy', lids: 0.3, blush: 1, flapL: 120, flapR: 120, hop: Math.abs(Math.sin(t * 6)) * 0.5}} />
      <BigWord text="life is good" x={540} y={360} at={P(26)} size={130} color={GREEN} /></>}
  </>;
};

const Video = ({t}: {t: number}) => {
  const gone = t >= P(28), fill = 1 - ease((t - P(27) - 0.3) / 1.0);
  return <>
    <Snow />
    <Phone x={560} y={G + 80} w={460} color={GREEN}>
      {gone ? <Txt text="0 GB" size={120} color={RED} /> : <Play size={160} />}
      <DataBar fill={gone ? 0 : fill} w={300} />
    </Phone>
    <Penguin id="doug" x={170} y={G + 140} h={400} pose={{look: [0.9, -0.3], eyeScale: gone ? 1.3 : 1, brows: gone ? 'shock' : 'happy', beak: gone ? 'frown' : 'smile', flapR: 40}} />
    <BigWord text="1 video" x={560} y={330} at={P(27)} until={P(28)} size={130} />
    {gone && <BigWord text="data gone" x={560} y={330} at={P(28)} size={130} color={RED} />}
  </>;
};

const PayAgain = ({t}: {t: number}) => {
  const sad = t >= P(30);
  return <>
    {sad && <div style={{position: 'absolute', inset: -400, background: '#E9EDF0'}} />}
    <Snow />
    <Tower x={880} y={G} h={620} t={t} sign="JIO" />
    <Walrus id="larry" x={720} y={G + 140} h={460} pose={{laugh: 1, mouth: 0.5}} />
    <Penguin id="doug" x={260} y={G + 120} h={460} pose={{turn: 0.5, look: [0.7, 0.2], brows: 'worried', beak: 'frown', tears: sad, lids: sad ? 0.4 : 0, flapR: sad ? 10 : 90}} />
    <FishFlight x1={330} y1={G - 270} x2={660} y2={G - 300} a={P(29) + 0.1} b={E(29) + 0.3} n={5} w={100} />
    <BigWord text="again" x={540} y={380} at={P(29) + 0.3} until={P(30)} size={140} color={RED} />
    {sad && <BigWord text="life is not good" x={540} y={380} at={P(30)} size={110} color={RED} />}
  </>;
};

const Cta = ({t}: {t: number}) => <>
  <Snow />
  <PriceCard text="$25 · UNLIMITED" x={540} y={330} color={RED} at={P(31) + 0.2} t={t} tilt={-3} w={760} h={170} size={84} />
  <Txt text="" size={10} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontFamily: MONT, fontWeight: 900, fontSize: 80, color: INK}}>or</div>
  <PriceCard text="$2 · 2GB" x={540} y={640} color={GREEN} at={P(31) + 0.7} t={t} tilt={3} w={760} h={170} size={92} />
  <Penguin id="doug" x={540} y={G + 120} h={480} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0, 0.6]}} />
  <BigWord text="👇" x={800} y={1080} at={P(32)} size={140} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(3), set: (t) => <Intro t={t} />, fx_: 'zoom'},
  {at: P(4), set: (t) => <Watch t={t} />, fx_: 'swipe'},
  {at: P(5), set: (t) => <TowerSet t={t} />, fx_: 'swipeL'},
  {at: P(7), set: (t) => <Pay t={t} />, fx_: 'pop'},
  {at: P(8), set: (t) => <America t={t} />, fx_: 'swipe'},
  {at: P(10), set: (t) => <Jio t={t} />, fx_: 'iris'},
  {at: P(12), set: (t) => <Airtel t={t} />, fx_: 'swipeL'},
  {at: P(14), set: (t) => <AllCut t={t} />, fx_: 'pop'},
  {at: P(16), set: () => <Called lines={['PRICE', 'WAR']} />, fx_: 'zoom'},
  {at: P(17), set: (t) => <Billion t={t} />, fx_: 'swipe'},
  {at: P(18), set: (t) => <SellSmall t={t} />, fx_: 'swipeL'},
  {at: P(19), set: (t) => <Equation t={t} />, fx_: 'pop'},
  {at: P(20), set: () => <Called lines={['SCALE']} />, fx_: 'zoom'},
  {at: P(21), set: (t) => <Angry t={t} />, fx_: 'zoom'},
  {at: P(22), set: (t) => <RealUS t={t} />, fx_: 'swipe'},
  {at: P(23), set: (t) => <RealIN t={t} />, fx_: 'swipeL'},
  {at: P(25), set: (t) => <Move t={t} />, fx_: 'iris'},
  {at: P(27), set: (t) => <Video t={t} />, fx_: 'pop'},
  {at: P(29), set: (t) => <PayAgain t={t} />, fx_: 'swipe'},
  {at: P(31), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[6, 860, 1000, 1.5], [9, 540, 640, 1.4], [12, 600, 900, 1.5], [24, 450, 950, 1.3], [28, 560, 800, 1.4], [30, 300, 900, 1.5]];

export const DougInternet = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side being named (USA, then India), back out on "Same phone"
    const toUS = ease((tc - 1.0) / 0.6) * (tc < IN() ? 1 : 0), toIN = ease((tc - IN()) / 0.5) * (tc < P(2) ? 1 : 0);
    s0 = 1 + 0.18 * (toUS + toIN); fx = 540 - 230 * toUS + 230 * toIN; fy = 960 + 40 * (toUS + toIN);
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
    <Audio src={staticFile('doug-internet-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.3} name="user-cash-register" vol={0.3} />
    <Sfx at={IN()} name="user-boom" vol={0.45} />
    <Sfx at={P(2)} name="user-slap" vol={0.35} />
    <Sfx at={P(3)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(3) + 0.9} name="user-pop" vol={0.3} />
    <Sfx at={P(4) + 0.6} name="user-timer" vol={0.3} />
    <Sfx at={P(5)} name="user-notif" vol={0.3} />
    <Sfx at={P(6)} name="walrus-laugh" vol={0.4} />
    <Sfx at={P(7) + 0.1} name="user-money" vol={0.3} />
    <Sfx at={P(7) + 0.8} name="user-timer" vol={0.25} />
    <Sfx at={P(8) + 0.4} name="user-cash-register" vol={0.35} />
    <Sfx at={P(9)} name="user-wrong" vol={0.3} />
    <Sfx at={P(9) + 0.6} name="user-money-transfer" vol={0.3} />
    <Sfx at={P(10)} name="walrus-grunt" vol={0.4} />
    <Sfx at={P(11)} name="user-wow" vol={0.4} />
    <Sfx at={P(11) + 0.8} name="user-yeah" vol={0.3} />
    <Sfx at={P(12)} name="user-shock" vol={0.4} />
    <Sfx at={P(13)} name="user-slap" vol={0.35} />
    <Sfx at={P(13) + 0.4} name="user-ting" vol={0.3} />
    <Sfx at={P(14)} name="user-pop" vol={0.3} />
    {[0, 1, 2, 3].map((i) => <Sfx key={`d${i}`} at={P(15) + i * 0.45} name="swoosh-fast" vol={0.3} />)}
    <Sfx at={P(16)} name="user-boom" vol={0.4} />
    <Sfx at={P(17) + 0.2} name="user-wow" vol={0.35} />
    <Sfx at={P(18)} name="user-money-transfer" vol={0.3} />
    <Sfx at={P(19) + 1.3} name="user-cash-register" vol={0.4} />
    <Sfx at={P(20)} name="user-boom" vol={0.4} />
    <Sfx at={P(21)} name="user-fahh" vol={0.45} />
    <Sfx at={P(22)} name="user-ting" vol={0.35} />
    <Sfx at={P(23)} name="user-ting" vol={0.35} />
    <Sfx at={P(24)} name="user-boom" vol={0.4} />
    <Sfx at={P(25)} name="swoosh-fast" vol={0.3} />
    <Sfx at={P(26)} name="user-yeah" vol={0.4} />
    <Sfx at={P(27)} name="user-notif2" vol={0.3} />
    <Sfx at={P(28)} name="user-wrong" vol={0.4} />
    <Sfx at={P(29) + 0.1} name="user-money" vol={0.3} />
    <Sfx at={P(29) + 0.3} name="walrus-laugh" vol={0.35} />
    <Sfx at={P(30)} name="user-aww" vol={0.4} />
    <Sfx at={P(31) + 0.2} name="user-pop" vol={0.3} />
    <Sfx at={P(32)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
