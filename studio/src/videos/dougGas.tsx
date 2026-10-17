// EP2 "Gas Explained by Doug" — hook first (approval), full episode after. Line timings: studio/src/data/doug-gas.json.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {Fish, INK, Penguin, onTwos} from '../penguin/rig';
import {Seagull, Walrus} from '../penguin/cast';
import {BigWord, FishPile, HookTitle, Stamp} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-gas.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_GAS_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1250;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);

// Classic tall US gas-station price sign: state name on top, red LED digits with the small 9/10.
export const GasSign = ({x, y, state, price, at = -1, t, glow}: {x: number; y: number; state: string; price: string; at?: number; t: number; glow?: boolean}) => {
  const p = t < at ? 0 : Math.min(1, (t - at) / 0.25);
  const flick = glow ? 0.75 + 0.25 * Math.abs(Math.sin(t * 9)) : 1;
  return <div style={{position: 'absolute', left: x - 170, top: y - 520, width: 340, transform: `scale(${0.6 + 0.4 * p})`, opacity: p, transformOrigin: '50% 100%'}}>
    <svg width={340} height={520} viewBox="0 0 340 520" style={{overflow: 'visible'}}>
      <rect x={155} y={300} width={30} height={220} fill="#8A9399" stroke={INK} strokeWidth={5} />
      <rect x={10} y={10} width={320} height={300} rx={18} fill="#F7F3E8" stroke={INK} strokeWidth={6} />
      <rect x={10} y={10} width={320} height={70} rx={18} fill="#2F5DA8" stroke={INK} strokeWidth={6} />
      <text x={170} y={58} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={state.length > 8 ? 30 : 40} fill="#fff">{state}</text>
      <g transform="translate(18 -54)"><rect width={70} height={44} fill="#fff" stroke={INK} strokeWidth={3} />{[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} y={i * 6.3} width={70} height={3.2} fill="#B22234" />)}<rect width={30} height={24} fill="#3C3B6E" /><line x1={0} y1={0} x2={0} y2={-30} stroke={INK} strokeWidth={4} /></g>
      <text x={170} y={120} textAnchor="middle" fontFamily="Architects Daughter" fontSize={32} fill={INK} fontWeight={700}>1 GALLON</text>
      <rect x={30} y={140} width={280} height={150} rx={10} fill="#1B1B1B" stroke={INK} strokeWidth={5} />
      <text x={150} y={242} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={76} fill="#FF3B2F" opacity={flick} style={{letterSpacing: 2}}>{price}</text>
      <text x={286} y={196} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#FF3B2F" opacity={flick}>9</text>
      <path d="M272 202 L300 202" stroke="#FF3B2F" strokeWidth={3} opacity={flick} />
      <text x={286} y={232} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={26} fill="#FF3B2F" opacity={flick}>10</text>
    </svg>
  </div>;
};

// Gas pump with a counter that spins while `run`.
const Pump = ({x, y, t, run, dollars}: {x: number; y: number; t: number; run: boolean; dollars: number}) =>
  <svg width={200} height={330} viewBox="0 0 200 330" style={{position: 'absolute', left: x - 100, top: y - 330, overflow: 'visible'}}>
    <rect x={20} y={20} width={140} height={300} rx={14} fill="#D83A2E" stroke={INK} strokeWidth={6} />
    <rect x={38} y={44} width={104} height={70} rx={6} fill="#E8F7E4" stroke={INK} strokeWidth={4} />
    <text x={90} y={92} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill={INK}>${(run ? dollars + ((t * 37) % 10) / 10 : dollars).toFixed(2)}</text>
    <rect x={50} y={140} width={80} height={40} rx={6} fill="#fff" stroke={INK} strokeWidth={4} />
    <path d="M160 120 C 200 140, 196 240, 170 260" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
    <rect x={10} y={310} width={160} height={16} fill="#8A9399" stroke={INK} strokeWidth={4} />
  </svg>;

const RED = '#D83A2E', GREEN = '#2E9E4F';
const r = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// ---------- small props drawn in the series style ----------
const Snowmobile = ({x, y, w = 420, t, moving}: {x: number; y: number; w?: number; t: number; moving?: boolean}) => {
  const b = moving ? Math.sin(t * 30) * 4 : 0;
  return <svg width={w} height={w * 0.55} viewBox="0 0 420 230" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.55 + b, overflow: 'visible'}}>
    <path d="M20 210 L400 210 Q415 210 410 196" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
    <path d="M60 190 L140 120 L330 110 L390 160 L380 190 Z" fill="#D83A2E" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M140 120 L170 70 L230 70 L240 112 Z" fill="#BFE0F0" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <rect x={250} y={100} width={90} height={22} rx={8} fill="#1B1B1B" />
    <path d="M90 190 L90 210 M330 190 L330 210" stroke={INK} strokeWidth={8} />
  </svg>;
};
const OilGush = ({x, y, t, at}: {x: number; y: number; t: number; at: number}) => {
  if (t < at) return null;
  const p = Math.min(1, (t - at) / 0.4), h = 420 * p, wob = Math.sin(t * 14) * 10;
  return <svg width={400} height={600} viewBox="0 0 400 600" style={{position: 'absolute', left: x - 200, top: y - 600, overflow: 'visible'}}>
    <path d={`M180 600 Q${170 + wob} ${600 - h * 0.6} 200 ${600 - h} Q${230 - wob} ${600 - h * 0.6} 220 600 Z`} fill="#1B1B1B" />
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={200 + Math.cos(i * 1.3 + t * 4) * 70 * p} cy={600 - h - 20 + Math.sin(i * 2 + t * 5) * 30} r={18 + (i % 2) * 8} fill="#1B1B1B" />)}
    <ellipse cx={200} cy={598} rx={150 * p} ry={22} fill="#1B1B1B" />
  </svg>;
};
const Refinery = ({x, y, w = 460, t, label, closed, id}: {x: number; y: number; w?: number; t: number; label?: string; closed?: boolean; id: string}) =>
  <svg width={w} height={w * 0.9} viewBox="0 0 460 414" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.9, overflow: 'visible'}} key={id}>
    {!closed && [0, 1, 2].map((i) => { const ph = (t * 0.8 + i / 3) % 1; return <circle key={i} cx={95 + ph * 30} cy={70 - ph * 90} r={20 + ph * 26} fill="#D6D6D6" stroke={INK} strokeWidth={3} opacity={1 - ph} />; })}
    <rect x={80} y={70} width={34} height={240} fill="#B9C0C3" stroke={INK} strokeWidth={5} />
    <rect x={150} y={150} width={130} height={170} rx={60} fill="#E4E7E8" stroke={INK} strokeWidth={5} />
    <rect x={300} y={190} width={110} height={130} rx={50} fill="#E4E7E8" stroke={INK} strokeWidth={5} />
    <path d="M114 230 L150 230 M280 250 L300 250" stroke={INK} strokeWidth={8} />
    <rect x={20} y={320} width={420} height={70} fill="#9FB8C6" stroke={INK} strokeWidth={5} />
    {label && <text x={230} y={366} textAnchor="middle" fontFamily="Architects Daughter" fontWeight={700} fontSize={40} fill={INK}>{label}</text>}
    {closed && <g transform="rotate(-10 230 230)"><rect x={110} y={200} width={240} height={70} fill="#fff" stroke={RED} strokeWidth={8} /><text x={230} y={250} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={44} fill={RED}>CLOSED</text></g>}
  </svg>;
const Barrel = ({x, y}: {x: number; y: number}) => <svg width={90} height={120} viewBox="0 0 90 120" style={{position: 'absolute', left: x - 45, top: y - 120}}>
  <rect x={5} y={5} width={80} height={110} rx={12} fill="#2B2B2B" stroke={INK} strokeWidth={4} /><path d="M5 40 L85 40 M5 80 L85 80" stroke="#666" strokeWidth={5} /></svg>;
const GasCan = ({x, y, w = 110, special}: {x: number; y: number; w?: number; special?: boolean}) => <svg width={w} height={w * 1.2} viewBox="0 0 110 132" style={{position: 'absolute', left: x - w / 2, top: y - w * 1.2, overflow: 'visible'}}>
  <path d="M10 30 L70 30 L100 60 L100 125 L10 125 Z" fill={special ? '#F2C230' : RED} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  <path d="M70 30 L90 8 L104 18 L84 40" fill="none" stroke={INK} strokeWidth={6} />
  {special && [0, 1, 2].map((i) => <path key={i} d={`M${20 + i * 34} ${-10 - (i % 2) * 14} l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6 Z`} fill="#F5C518" stroke={INK} strokeWidth={2} />)}
</svg>;
const MoneyBag = ({x, y, w, label}: {x: number; y: number; w: number; label: string}) => <svg width={w} height={w * 1.1} viewBox="0 0 100 110" style={{position: 'absolute', left: x - w / 2, top: y - w * 1.1, overflow: 'visible'}}>
  <path d="M30 20 L70 20 L60 34 C 95 50, 100 105, 50 106 C 0 105, 5 50, 40 34 Z" fill="#D9B77A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
  <text x={50} y={80} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={26} fill={INK}>{label}</text></svg>;
const Sun = ({x, y, t, size = 220}: {x: number; y: number; t: number; size?: number}) => <svg width={size * 2} height={size * 2} viewBox="-100 -100 200 200" style={{position: 'absolute', left: x - size, top: y - size, overflow: 'visible'}}>
  <g transform={`rotate(${t * 20})`}>{Array.from({length: 12}, (_, i) => <path key={i} d="M0 -62 L8 -92 L-8 -92 Z" fill="#F5A524" stroke={INK} strokeWidth={3} transform={`rotate(${i * 30})`} />)}</g>
  <circle r={56} fill="#F5C518" stroke={INK} strokeWidth={4} /></svg>;
const Receipt = ({x, y, t, at}: {x: number; y: number; t: number; at: number}) => {
  const L = 120 + 900 * ease((t - at) / 1.6);
  return <div style={{position: 'absolute', left: x - 110, top: y, width: 220, height: L, background: '#FFFDF5', border: `5px solid ${INK}`, borderTop: 'none', overflow: 'hidden'}}>
    {Array.from({length: 26}, (_, i) => <div key={i} style={{height: 6, margin: '18px 24px', background: '#C9CED4', width: `${50 + ((i * 37) % 45)}%`}} />)}</div>;
};

// ---------- sets ----------
const CA = P(1), SAME = P(3);
const Hook = ({t}: {t: number}) => {
  const lookR = t >= CA;
  return <>
    <HookTitle lines={['Gas Explained', 'by Doug']} at={-1} y={360} />
    <GasSign x={210} y={1180} state="TEXAS" price="$3.82" t={t} />
    <GasSign x={870} y={1180} state="CALIFORNIA" price="$6.23" t={t} glow={lookR} />
    <Pump x={680} y={G} t={t} run={t > CA} dollars={lookR ? 93 : 57} />
    <Penguin id="doug" x={450} y={G} h={430} pose={{turn: lookR ? 0.6 : -0.6, look: [lookR ? 0.8 : -0.8, -0.3], brows: lookR ? 'shock' : 'worried', eyeScale: lookR ? 1.2 : 1, pupil: lookR ? 0.5 : 1, sweat: true, flapL: lookR ? 90 : 10, flapR: lookR ? 90 : 10}} />
    <Stamp text="SAME GAS" x={540} y={1360} at={SAME} color={RED} size={96} />
    {t >= P(4) && <BigWord text="same Doug." x={540} y={1480} at={P(4)} size={70} />}
  </>;
};
const Snowfall = ({t}: {t: number}) => <>{Array.from({length: 18}, (_, i) => { const sp = 50 + (i * 37) % 60, x = (i * 173) % 1080, y = ((i * 311) % 2000 + t * sp) % 2000 - 60;
  return <div key={i} style={{position: 'absolute', left: x, top: y, width: 10, height: 10, borderRadius: '50%', background: '#D6E8F3'}} />; })}</>;

const Ride = ({t}: {t: number}) => {
  const x = lerp(-200, 560, ease((t - P(5)) / 1.2));
  return <>
    <Snowfall t={t} />
    {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: ((i * 300 - t * 900) % 1400 + 1400) % 1400 - 200, top: G + 20 + i * 14, width: 160, height: 6, background: '#D6E8F3', borderRadius: 3}} />)}
    <Snowmobile x={x} y={G} t={t} moving />
    <Penguin id="doug" x={x - 30} y={G - 120} h={330} pose={{side: true, turn: 1, beak: 'smile', brows: 'happy'}} />
    {t >= P(7) && <Pump x={860} y={G} t={t} run dollars={20} />}
    <BigWord text="every day" x={540} y={620} at={P(8)} size={100} color={RED} />
  </>;
};

const FillUp = ({t}: {t: number}) => {
  const ups = [P(12), P(13), P(14)].filter((a) => t >= a).length;
  const dollars = t < P(11) ? 20 + (t - P(9)) * 18 : 57 + ups * 12;
  return <>
    <Pump x={560} y={G + 40} t={t} run dollars={Math.max(0, dollars)} />
    <Penguin id="doug" x={260} y={G + 40} h={420} pose={{turn: 0.6, look: [0.8, -0.4], eyeScale: 1 + ups * 0.12, pupil: 1 - ups * 0.15, brows: ups ? 'shock' : 'worried', sweat: ups > 0}} />
    <BigWord text="15 gallons" x={540} y={560} at={P(10)} size={110} />
    {ups > 0 && <BigWord text={['up', 'up!', 'UP!!'][ups - 1]} x={760} y={760 - ups * 60} at={[P(12), P(13), P(14)][ups - 1]} color={RED} size={100 + ups * 30} />}
  </>;
};

const Oil = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 0, right: 0, top: G, height: 40, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
  <OilGush x={540} y={G + 5} t={t} at={P(16) - 0.1} />
  <Penguin id="doug" x={230} y={G} h={360} pose={{turn: 0.5, look: [0.6, -0.6], brows: t > P(16) ? 'shock' : 'none', eyeScale: t > P(16) ? 1.2 : 1}} />
  <BigWord text="oil" x={540} y={560} at={P(15) + 0.3} size={140} />
</>;

const LarryRef = ({t}: {t: number}) => <>
  <Refinery x={620} y={G} t={t} label="LARRY OIL" id="lr" />
  <Walrus x={260} y={G} h={420} flip pose={{lids: 0.5, laugh: t < P(18) ? 1 : 0, look: 0.6}} />
  {t >= P(18) && [0, 1, 2].map((i) => { const p = ((t - P(18)) * 0.9 + i / 3) % 1; return <Barrel key={i} x={lerp(380, 520, p)} y={G} />; })}
  {t >= P(18) + 0.4 && [0, 1].map((i) => { const p = ((t - P(18)) * 0.9 + i / 2) % 1; return <GasCan key={i} x={lerp(880, 1000, p)} y={G} />; })}
</>;

const StateRef = ({t, tx}: {t: number; tx: boolean}) => {
  const n = tx ? 6 : 2, closeAt = P(24);
  return <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 110, color: '#2F5DA8'}}>{tx ? 'TEXAS' : 'CALIFORNIA'}</div>
    {Array.from({length: n}, (_, i) => <Refinery key={i} x={tx ? 160 + (i % 3) * 380 : 300 + i * 480} y={tx ? 900 + Math.floor(i / 3) * 360 : 1150} w={tx ? 300 : 420} t={t} id={`r${i}`} closed={!tx && i === 1 && t >= closeAt} />)}
    {tx && t >= P(20) && <FishPile x={540} y={1400} n={9} w={110} />}
    {tx ? <BigWord text="cheap" x={540} y={560} at={P(21)} color={GREEN} size={130} /> : <>
      <BigWord text="rare" x={300} y={1420} at={P(25)} color={RED} size={110} />
      <BigWord text="expensive" x={700} y={1420} at={P(26)} color={RED} size={110} />
    </>}
  </>;
};

const NoPipe = ({t}: {t: number}) => <>
  <Refinery x={230} y={G} w={330} t={t} label="TEXAS" id="np1" />
  <Refinery x={850} y={G} w={330} t={t} label="CALIF." id="np2" />
  <div style={{position: 'absolute', left: 380, top: G - 120, width: 120, height: 30, background: '#8A9399', border: `4px solid ${INK}`}} />
  <div style={{position: 'absolute', left: 580, top: G - 120, width: 120, height: 30, background: '#8A9399', border: `4px solid ${INK}`}} />
  <BigWord text="✕" x={540} y={G - 105} at={P(27) + 0.6} color={RED} size={120} />
  <BigWord text="alone" x={850} y={560} at={P(28)} size={110} />
</>;

const Gulls = ({t}: {t: number}) => {
  const fly = t < P(30);
  return <>
    {fly ? <Seagull x={lerp(1200, 560, ease((t - P(29)) / 0.8))} y={lerp(400, G, ease((t - P(29)) / 0.8))} h={420} pose={{fly: t < P(29) + 0.8}} /> : <>
      <Seagull x={300} y={G} h={360} flip pose={{mouth: t > P(30) && t < E(30) ? 0.6 : 0}} />
      <Seagull x={800} y={G} h={360} id="g2" pose={{mouth: t > P(31) && t < E(31) ? 0.6 : 0}} />
      <MoneyBag x={420} y={G} w={110} label="20¢" />
      {t >= P(31) && <MoneyBag x={640} y={G} w={230} label="60¢" />}
      <div style={{position: 'absolute', left: 140, top: 470, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: '#2F5DA8'}}>TEXAS</div>
      <div style={{position: 'absolute', left: 600, top: 470, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: '#2F5DA8'}}>CALIF.</div>
      <BigWord text="every gallon" x={540} y={1440} at={P(32)} color={RED} size={90} />
    </>}
  </>;
};

const Special = ({t}: {t: number}) => <>
  <GasCan x={540} y={1000} w={300} special />
  <BigWord text="special summer gas" x={540} y={460} at={P(33) + 0.3} size={86} />
  {t >= P(34) && <BigWord text="$$$" x={820} y={720} at={P(34) + 0.3} color={RED} size={130} />}
  {t >= P(35) && <Refinery x={540} y={G + 280} w={300} t={t} id="sp" label="1 of few" />}
</>;

const Stare = () => <Penguin id="doug" x={540} y={G + 300} h={950} pose={{lids: 0.35, look: [0, 0]}} />;

const RealLife = ({t}: {t: number}) => <>
  <BigWord text="real life" x={540} y={420} at={P(37)} size={110} />
  <GasSign x={300} y={1200} state="CALIFORNIA" price="$6.23" t={t} at={P(38)} glow />
  <GasSign x={780} y={1200} state="TEXAS" price="$3.82" t={t} at={P(39)} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 1240, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 36, color: '#888'}}>AAA, Oct 2026</div>
</>;

const Year = ({t}: {t: number}) => <>
  {t < P(42) && <>
    <Snowmobile x={540} y={G} t={t} moving />
    <Penguin id="doug" x={510} y={G - 120} h={330} pose={{side: true, turn: 1}} />
    <BigWord text="12,000 miles / year" x={540} y={560} at={P(40) + 0.2} size={84} />
  </>}
  {t >= P(42) && <>
    <Penguin id="doug" x={300} y={G} h={460} pose={{brows: 'shock', eyeScale: 1.25, pupil: 0.4, tremble: 1, look: [0.6, 0.4]}} />
    <Receipt x={720} y={520} t={t} at={P(42)} />
    <BigWord text="+$1,000" x={720} y={460} at={P(42) + 0.4} color={RED} size={130} />
  </>}
  {t >= P(44) && <FishPile x={300} y={1420} n={12} w={110} seed={2} />}
</>;

const Move = ({t}: {t: number}) => {
  const happy = t >= P(46);
  return <>
    <Sun x={860} y={480} t={t} size={150} />
    {!happy ? <>
      <div style={{position: 'absolute', left: lerp(-500, 300, ease((t - P(45)) / 1)), top: G - 300, width: 460, height: 260, background: '#F2F2F2', border: `6px solid ${INK}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Architects Daughter', fontSize: 64, fontWeight: 700}}>TEXAS →</div>
    </> : <>
      <div style={{position: 'absolute', left: 300, top: G - 120, width: 420, height: 30, background: '#E8546A', border: `5px solid ${INK}`, borderRadius: 8, transform: 'rotate(-8deg)'}} />
      <Penguin id="doug" x={510} y={G - 60} h={420} pose={{beak: 'smile', brows: 'happy', lids: 0.4, flapL: 120, flapR: 120}} />
      <BigWord text="life is good" x={540} y={1440} at={P(47)} color={GREEN} size={100} />
    </>}
  </>;
};

const Melt = ({t}: {t: number}) => {
  const m = ease((t - P(48) - 0.5) / 1.4);
  return <>
    <Sun x={540} y={460} t={t} size={230 + m * 40} />
    <BigWord text="105°F" x={850} y={760} at={P(48) + 0.3} color={RED} size={120} />
    <div style={{position: 'absolute', left: 0, top: 0, transform: `scaleY(${1 - 0.7 * m}) scaleX(${1 + 0.4 * m})`, transformOrigin: `540px ${G}px`}}>
      <Penguin id="doug" x={540} y={G} h={460} pose={{brows: 'worried', sweat: true, beak: 'frown', tremble: m}} />
    </div>
    <div style={{position: 'absolute', left: 540 - 260 * m, top: G - 30, width: 520 * m, height: 70 * m, borderRadius: '50%', background: '#7CC4EC', opacity: m}} />
  </>;
};

const Cta = ({t}: {t: number}) => <>
  <BigWord text="move for cheap gas?" x={540} y={480} at={P(50)} size={90} />
  <Penguin id="doug" x={540} y={G + 120} h={620} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
  <div style={{position: 'absolute', left: 470, top: G - 560, width: 140, height: 110, background: '#E4F4FC', border: `5px solid ${INK}`, borderRadius: 14}} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(5), set: (t) => <Ride t={t} />, fx_: 'swipe'},
  {at: P(9), set: (t) => <FillUp t={t} />, fx_: 'pop'},
  {at: P(15), set: (t) => <Oil t={t} />, fx_: 'zoom'},
  {at: P(17), set: (t) => <LarryRef t={t} />},
  {at: P(19), set: (t) => <StateRef t={t} tx />, fx_: 'swipe'},
  {at: P(22), set: (t) => <StateRef t={t} tx={false} />, fx_: 'swipeL'},
  {at: P(27), set: (t) => <NoPipe t={t} />},
  {at: P(29), set: (t) => <Gulls t={t} />, fx_: 'pop'},
  {at: P(33), set: (t) => <Special t={t} />, fx_: 'iris'},
  {at: P(36), set: () => <Stare />, fx_: 'zoom'},
  {at: P(37), set: (t) => <RealLife t={t} />},
  {at: P(40), set: (t) => <Year t={t} />, fx_: 'swipe'},
  {at: P(45), set: (t) => <Move t={t} />, fx_: 'swipeL'},
  {at: P(48), set: (t) => <Melt t={t} />},
  {at: P(50), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[11, 560, 1000, 1.6], [17, 620, 1150, 1.5], [26, 700, 1300, 1.4], [31, 640, 1150, 1.6], [42, 720, 900, 1.4], [49, 540, 1150, 1.6]];

export const DougGas = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side named (Texas, then California)
    const toTX = ease((tc - 0.2) / 0.6) * (tc < CA ? 1 : 0), toCA = ease((tc - CA) / 0.5) * (tc < SAME ? 1 : 0);
    s0 = 1 + 0.06 * (toTX + toCA); fx = 540 - 140 * toTX + 140 * toCA; fy = 960 + 40 * (toTX + toCA);
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, TIM);
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-gas-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={P(2) + 0.6} name="user-boom" vol={0.45} />
    <Sfx at={SAME} name="user-slap" vol={0.4} />
    <Sfx at={P(5)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(7)} name="user-money" vol={0.35} />
    <Sfx at={P(8)} name="user-timer" vol={0.3} />
    {[P(12), P(13), P(14)].map((a, i) => <Sfx key={`u${i}`} at={a} name="user-cash-register" vol={0.22 + i * 0.06} />)}
    <Sfx at={P(16)} name="user-boom" vol={0.4} />
    <Sfx at={P(17)} name="walrus-laugh" vol={0.4} />
    <Sfx at={P(17) + 0.4} name="user-wow" vol={0.3} />
    <Sfx at={P(21)} name="user-yeah" vol={0.35} />
    <Sfx at={P(24)} name="user-wrong" vol={0.4} />
    <Sfx at={P(26)} name="user-aww" vol={0.35} />
    <Sfx at={P(27) + 0.6} name="user-horn" vol={0.3} />
    <Sfx at={P(29)} name="gull-caw" vol={0.4} />
    <Sfx at={P(30) + 0.4} name="user-money-transfer" vol={0.3} />
    <Sfx at={P(31) + 0.4} name="user-slap" vol={0.4} />
    <Sfx at={P(31) + 0.6} name="gull-mine" vol={0.35} />
    <Sfx at={P(33) + 0.3} name="user-wow" vol={0.3} />
    <Sfx at={P(34) + 0.3} name="user-cash-register" vol={0.3} />
    <Sfx at={P(36)} name="user-shock" vol={0.35} />
    <Sfx at={P(38)} name="user-ting" vol={0.35} />
    <Sfx at={P(42) + 0.4} name="user-fahh" vol={0.45} />
    <Sfx at={P(44)} name="user-money" vol={0.3} />
    <Sfx at={P(46)} name="user-yeah" vol={0.35} />
    <Sfx at={P(48) + 0.3} name="user-notif" vol={0.3} />
    <Sfx at={P(49)} name="user-wrong" vol={0.45} />
    <Sfx at={P(50)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
