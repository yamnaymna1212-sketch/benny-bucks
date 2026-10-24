// EP8 "Gas: America vs Libya" — full episode. Hook = Versus + SameGas from dougLibya.tsx (approved).
// Voice: Kokoro am_fenrir x1.2 (user pick). Timings: studio/src/data/doug-libya.json. Captions in the middle band (y 1100).
// Facts: Libya ~$0.023/L = ~$0.09/gal (GlobalPetrolPrices, Oct 2026); US avg ~$4.41 (AAA, early Oct 2026); CA over $6.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, back, onTwos} from '../penguin/rig';
import {BigSeal, Seagull} from '../penguin/cast';
import {BigWord, FishFlight, PriceTag, Stamp, Title} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {MoneyBag, OilGush, Pump, Refinery, Snowfall, Snowmobile} from './dougGas';
import {BossBear} from './dougVenezuela';
import {LyFlag, SameGas, UsFlag, Versus} from './dougLibya';
import TIM from '../data/doug-libya.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_LIBYA_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 1.2) * 30) / 30;
const LOW = 250, G = 1300, RED = '#D83A2E', GREEN = '#239E46';
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const Ground = () => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 60, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />;
const Pop = ({at, t, x, y, children}: {at: number; t: number; x: number; y: number; children: React.ReactNode}) =>
  t < at ? null : <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${back((t - at) / 0.3)})`}}>{children}</div>;
const Flag = ({x, y, us, t, w = 200}: {x: number; y: number; us?: boolean; t: number; w?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y, transform: `skewY(${Math.sin(t * 5 + x) * 3}deg)`}}>{us ? <UsFlag w={w} /> : <LyFlag w={w} />}</div>;
const Board = ({x, y, label, price, color, at, t, us}: {x: number; y: number; label: string; price: string; color: string; at: number; t: number; us?: boolean}) =>
  <Pop at={at} t={t} x={x} y={y}>
    <div style={{width: 300, textAlign: 'center', background: '#fff', border: `7px solid ${INK}`, borderRadius: 22, padding: '14px 0'}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: label.length > 7 ? 36 : 46, color: INK}}>{label}</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 82, color, lineHeight: 1.05}}>{price}</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 26, color: INK}}>/ GALLON</div>
    </div>
    {us !== undefined && <div style={{position: 'absolute', left: 95, top: -85}}>{us ? <UsFlag w={110} /> : <LyFlag w={110} />}</div>}
  </Pop>;
const Barrel = ({x, y, w = 80}: {x: number; y: number; w?: number}) =>
  <div style={{position: 'absolute', left: x - w * 0.45, top: y - w * 1.2, width: w * 0.9, height: w * 1.2, background: '#2B2B2B', border: `4px solid ${INK}`, borderRadius: 10, boxSizing: 'border-box'}}>
    <div style={{marginTop: w * 0.35, height: 5, background: '#666'}} /><div style={{marginTop: w * 0.3, height: 5, background: '#666'}} /></div>;
const Suitcase = ({x, y}: {x: number; y: number}) => <div style={{position: 'absolute', left: x - 70, top: y - 100, width: 140, height: 100, background: '#B5652B', border: `6px solid ${INK}`, borderRadius: 14, boxSizing: 'border-box'}}>
  <div style={{position: 'absolute', left: 40, top: -30, width: 50, height: 26, border: `6px solid ${INK}`, borderBottom: 'none', borderRadius: '12px 12px 0 0'}} /></div>;

// ---------- shots ----------
const Intro = ({t}: {t: number}) => {
  const ride = t >= P(4), x = ride ? lerp(-200, 560, ease((t - P(4)) / 0.9)) : 540;
  return <>
    <Snowfall t={t} /><Ground />
    {!ride ? <Penguin id="doug" x={540} y={G} h={540} pose={{beak: 'smile', brows: 'happy', flapR: 60 + Math.sin(t * 8) * 20}} /> : <>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: ((i * 300 - t * 900) % 1400 + 1400) % 1400 - 200, top: G + 20 + i * 14, width: 160, height: 6, background: '#D6E8F3', borderRadius: 3}} />)}
      <Snowmobile x={x} y={G} t={t} moving />
      <Penguin id="doug" x={x - 30} y={G - 120} h={330} pose={{side: true, turn: 1, beak: 'smile', brows: 'happy'}} />
    </>}
    <BigWord text="Doug" x={540} y={520} at={P(3)} until={P(4)} size={170} />
    {ride && <BigWord text="to work" x={540} y={520} at={P(4) + 0.4} size={120} />}
  </>;
};

const Fill = ({t}: {t: number}) => <>
  <Ground />
  <Snowmobile x={300} y={G} t={t} />
  <Pump x={790} y={G} t={t} run={t > P(5) + 0.9} dollars={Math.max(0, (t - P(5) - 0.9)) * 18} />
  <Penguin id="doug" x={560} y={G} h={380} pose={{turn: 0.6, look: [0.8, -0.2], brows: 'worried'}} />
  <BigWord text="every week" x={540} y={480} at={P(5) + 1.3} size={130} color={RED} />
</>;

const Oil = ({t}: {t: number}) => <>
  <Ground />
  <OilGush x={640} y={G + 5} t={t} at={P(6) + 0.9} />
  <Penguin id="doug" x={230} y={G} h={400} pose={{turn: 0.5, look: [0.6, -0.6], brows: t > P(6) + 0.9 ? 'shock' : 'none', eyeScale: t > P(6) + 0.9 ? 1.25 : 1}} />
  <BigWord text="gas ← oil" x={540} y={480} at={P(6) + 0.2} size={130} />
</>;

const Pile = ({t}: {t: number}) => {
  const rows = 6, w = 86, out: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) for (let i = 0; i < rows - r; i++) {
    const k = r * 10 + i, at = P(7) + k * 0.04; if (t < at) continue;
    out.push(<Barrel key={k} x={540 + (i - (rows - r - 1) / 2) * w} y={G - r * w * 1.2 - (1 - ease((t - at) / 0.2)) * 200} w={w} />);
  }
  return <>
    <Ground />{out}
    <Flag x={540} y={G - rows * w * 1.2 - 170} t={t} />
    <BigWord text="#1 in Africa" x={540} y={360} at={P(7) + 1.2} size={130} color={GREEN} />
  </>;
};

const Cost = ({t}: {t: number}) => {
  const steps = [{x: 190, label: 'pull', at: P(8) + 1.0}, {x: 540, label: 'clean', at: P(8) + 1.6}, {x: 890, label: 'ship', at: P(8) + 2.2}];
  return <>
    <Ground />
    <BigWord text="not free" x={540} y={400} at={P(8)} size={150} color={RED} />
    {/* derrick */}
    {t > steps[0].at && <svg width={260} height={420} viewBox="0 0 260 420" style={{position: 'absolute', left: 60, top: G - 420, overflow: 'visible'}}>
      <path d="M60 420 L130 60 L200 420 M85 300 L175 300 M100 200 L160 200" fill="none" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <g transform={`rotate(${Math.sin(t * 3) * 14} 130 70)`}><rect x={20} y={55} width={220} height={30} rx={10} fill="#E0463A" stroke={INK} strokeWidth={6} /><rect x={226} y={50} width={30} height={90} rx={8} fill="#2B2B2B" /></g>
    </svg>}
    {t > steps[1].at && <Refinery x={540} y={G} w={340} t={t} id="ref" />}
    {/* ship */}
    {t > steps[2].at && <svg width={300} height={220} viewBox="0 0 300 220" style={{position: 'absolute', left: 740, top: G - 220 + Math.sin(t * 4) * 6, overflow: 'visible'}}>
      <path d="M10 120 L290 120 L250 200 L50 200 Z" fill="#3D6FB6" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <rect x={70} y={70} width={70} height={50} fill="#2B2B2B" stroke={INK} strokeWidth={5} /><rect x={150} y={70} width={70} height={50} fill="#2B2B2B" stroke={INK} strokeWidth={5} />
      <rect x={220} y={30} width={40} height={90} fill="#fff" stroke={INK} strokeWidth={5} />
    </svg>}
    {steps.map((s) => <Pop key={s.label} at={s.at} t={t} x={s.x} y={G - 520}>
      <div style={{fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 80, color: INK, textAlign: 'center', lineHeight: 1}}>{s.label}<div style={{color: RED, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70}}>$$</div></div>
    </Pop>)}
  </>;
};

const NotNine = ({t}: {t: number}) => <>
  <Ground />
  <PriceTag x={540} y={640} price="$0.09" at={P(9)} size={1.6} color={GREEN} />
  <BigWord text="✕" x={540} y={640} at={P(9) + 1.0} size={460} color={RED} />
  <Penguin id="doug" x={540} y={G} h={380} pose={{brows: 'shock', eyeScale: 1.2}} />
</>;

const WhoPays = ({t}: {t: number}) => {
  const bearIn = P(10) + 1.2;
  return <>
    <Ground />
    <BigWord text="who pay?" x={540} y={420} at={P(10)} until={bearIn} size={150} />
    {t > bearIn && <>
      <BossBear x={lerp(1300, 560, ease((t - bearIn) / 0.6))} y={G} h={680} mouth={t > bearIn + 0.6 ? 0.4 : 0} />
      <Flag x={lerp(1300, 560, ease((t - bearIn) / 0.6)) + 260} y={500} t={t} w={160} />
      <BigWord text="Boss Bear" x={540} y={420} at={bearIn + 0.4} size={130} color={RED} />
    </>}
  </>;
};

const Pays = ({t}: {t: number}) => <>
  <Ground />
  <Pump x={560} y={G} t={t} run={false} dollars={0.09} />
  <BossBear x={170} y={G} h={520} mouth={0.3} />
  <BigSeal id="driver" x={900} y={G} h={360} flip />
  <FishFlight x1={200} y1={G - 500} x2={560} y2={G - 360} a={P(11)} b={P(11) + 0.8} n={5} w={90} />
  <FishFlight x1={200} y1={G - 500} x2={560} y2={G - 360} a={P(11) + 0.9} b={P(11) + 1.7} n={5} w={90} seed={3} />
  <FishFlight x1={200} y1={G - 500} x2={560} y2={G - 360} a={P(11) + 1.8} b={P(11) + 2.6} n={5} w={90} seed={5} />
  <BigWord text="$$$$$" x={330} y={440} at={P(11)} size={110} color={RED} />
  <BigWord text="9¢" x={880} y={500} at={P(11) + 1.5} size={170} color={GREEN} />
</>;

const America = ({t}: {t: number}) => <>
  <Ground />
  <Flag x={250} y={340} us t={t} w={240} />
  <Pump x={720} y={G} t={t} run={false} dollars={5} />
  {/* empty spot where Boss Bear would be */}
  <div style={{position: 'absolute', left: 120, top: G - 520, width: 280, height: 520, border: `8px dashed #9AA1A8`, borderRadius: '140px 140px 20px 20px', boxSizing: 'border-box'}} />
  <BigWord text="✕" x={260} y={G - 260} at={P(13) + 0.6} size={260} color={RED} />
  <Penguin id="doug" x={470} y={G} h={380} pose={t > P(14) ? {brows: 'worried', beak: 'frown', look: [0, 0.4], lids: 0.3} : {turn: -0.5, look: [-0.8, 0]}} />
  <BigWord text="nobody" x={600} y={400} at={P(14)} size={140} color={RED} />
</>;

const Stack = ({t}: {t: number}) => {
  const parts = [{label: 'OIL', h: 300, c: '#2B2B2B', at: P(15)}, {label: 'REFINERY', h: 180, c: '#7D8DA6', at: P(15) + 1.3}, {label: 'TAX 50¢', h: 130, c: RED, at: P(15) + 2.6}];
  let y = G;
  const gull = P(15) + 2.6, gx = lerp(1300, 820, ease((t - gull) / 0.5));
  return <>
    <Ground />
    {parts.map((p) => { if (t < p.at) return null; const k = ease((t - p.at) / 0.3); y -= p.h * k;
      return <div key={p.label} style={{position: 'absolute', left: 380, top: y, width: 320, height: p.h * k, background: p.c, border: `6px solid ${INK}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Montserrat', fontWeight: 900, fontSize: 48, color: '#fff', overflow: 'hidden'}}>{p.label}</div>; })}
    <BigWord text="$5" x={540} y={y - 120} at={P(15) + 3.4} size={170} color={RED} />
    <Penguin id="doug" x={180} y={G} h={360} pose={{turn: 0.5, sweat: true, brows: 'worried'}} />
    {t > gull && <Seagull id="gull" x={gx} y={G} h={360} flip pose={{angry: true, holding: t > gull + 0.6}} />}
    <BigWord text="every gallon" x={540} y={330} at={P(15) + 3.7} size={100} />
  </>;
};

const Mood = ({t, at, kind}: {t: number; at: number; kind: 'angry' | 'confused'}) => <>
  <Ground />
  <Penguin id="doug" x={540} y={G + 80} h={900} pose={kind === 'angry' ? {angry: ease((t - at) / 0.3), brows: 'angry', beak: 'frown', tremble: 0.6} : {brows: 'worried', look: [0.6, -0.4], beak: 'flat'}} />
  {kind === 'confused' && [0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 300 + i * 220, top: 260 + Math.sin(t * 5 + i) * 15, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 150, color: INK, transform: `rotate(${(i - 1) * 15}deg)`}}>?</div>)}
</>;

const RealLife = ({t}: {t: number}) => <>
  <BigWord text="in real life" x={540} y={300} at={P(17)} size={130} />
  <Board x={200} y={720} label="USA" price="$4.41" color={RED} at={P(17) + 1.4} t={t} us />
  <Board x={540} y={720} label="CALIFORNIA" price="$6+" color="#8E1B12" at={P(17) + 3.0} t={t} />
  <Board x={880} y={720} label="LIBYA" price="$0.09" color={GREEN} at={P(18)} t={t} us={false} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 40, color: '#666'}}>AAA · GlobalPetrolPrices · Oct 2026</div>
</>;

const Tank = ({t}: {t: number}) => {
  const rcpt = (x: number, title: string, amount: string, c: string, at: number, us: boolean) => <Pop at={at} t={t} x={x} y={700}>
    <div style={{width: 360, background: '#FFFDF5', border: `6px solid ${INK}`, padding: '20px 0', textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700}}>
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: 10}}>{us ? <UsFlag w={120} /> : <LyFlag w={120} />}</div>
      <div style={{fontSize: 50, color: INK}}>{title}</div>
      <div style={{fontSize: 44, color: '#888'}}>12 gallons</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 110, color: c}}>{amount}</div>
    </div>
  </Pop>;
  return <>
    <Ground />
    {rcpt(280, 'AMERICA', '$53', RED, P(19) + 1.3, true)}
    {rcpt(800, 'LIBYA', '$1', GREEN, P(19) + 2.8, false)}
    <BigWord text="50x" x={540} y={260} at={P(20)} size={200} color={RED} />
    <Penguin id="doug" x={540} y={G + 40} h={300} pose={{brows: 'shock', eyeScale: 1.2}} />
  </>;
};

const Pack = ({t}: {t: number}) => {
  const walk = t > P(22), x = walk ? lerp(420, 1250, cl((t - P(22)) / 1.4)) : 420;
  return <>
    <Ground />
    <Flag x={150} y={420} us t={t} w={220} />
    <Flag x={930} y={420} t={t} w={220} />
    <BigWord text="→ LIBYA" x={760} y={330} at={P(21) + 0.3} size={90} color={GREEN} />
    <Penguin id="doug" x={x} y={G} h={420} pose={walk ? {walk: (t - P(22)) * 1.8, turn: 0.8, beak: 'smile', flapL: 100 + Math.sin(t * 12) * 25} : {beak: 'smile', brows: 'happy'}} />
    <Suitcase x={x + 120} y={G - 20} />
  </>;
};

const NotFreeLibya = ({t}: {t: number}) => <>
  <Ground />
  <Flag x={540} y={360} t={t} w={300} />
  <MoneyBag x={540} y={G} w={340} label="OIL $" />
  <Stamp text="NOT FREE" x={540} y={780} at={P(23) + 0.5} color={RED} size={130} />
</>;

const Hospital = ({x, y, broken}: {x: number; y: number; broken: boolean}) =>
  <div style={{position: 'absolute', left: x - 140, top: y - 260, width: 280, height: 260, background: broken ? '#DADADA' : '#fff', border: `7px solid ${INK}`, boxSizing: 'border-box', filter: broken ? 'grayscale(1)' : undefined}}>
    <div style={{position: 'absolute', left: 105, top: 40, width: 70, height: 70}}><div style={{position: 'absolute', left: 25, width: 20, height: 70, background: RED}} /><div style={{position: 'absolute', top: 25, width: 70, height: 20, background: RED}} /></div>
    {broken && <svg width={280} height={260} style={{position: 'absolute', left: -7, top: -7}}><path d="M140 0 L120 80 L160 130 L130 200 L150 260" fill="none" stroke={INK} strokeWidth={6} /></svg>}
  </div>;

const Roads = ({t}: {t: number}) => {
  const broken = t > P(24) + 1.6;
  return <>
    <Ground />
    <BossBear x={200} y={G} h={480} />
    <Pump x={540} y={G} t={t} run={false} dollars={0.09} />
    <FishFlight x1={230} y1={G - 420} x2={520} y2={G - 330} a={P(24) + 0.2} b={P(24) + 1.0} n={6} w={90} />
    <Hospital x={880} y={G} broken={broken} />
    <div style={{position: 'absolute', left: 740, top: G - 470, width: 290, height: 60, background: broken ? '#9AA1A8' : '#555', border: `6px solid ${INK}`, boxSizing: 'border-box'}}>
      {broken && <svg width={290} height={60} style={{position: 'absolute', left: -6, top: -6}}><path d="M40 0 L70 30 L60 60 M180 0 L200 30 L190 60" fill="none" stroke={INK} strokeWidth={5} /></svg>}
    </div>
    <BigWord text="roads ✕" x={880} y={G - 560} at={P(24) + 1.6} size={80} color={RED} />
    <BigWord text="hospitals ✕" x={880} y={480} at={P(24) + 2.2} size={80} color={RED} />
  </>;
};

const Smugglers = ({t}: {t: number}) => {
  const x = lerp(-250, 1350, cl((t - P(25) - 0.2) / 2.4));
  return <>
    <Ground />
    <div style={{position: 'absolute', left: 536, top: 500, width: 8, height: G - 500, background: `repeating-linear-gradient(${INK} 0 30px, transparent 30px 50px)`}} />
    <Flag x={330} y={520} t={t} w={180} />
    <BigWord text="other country" x={820} y={560} at={P(25)} size={70} />
    <div style={{position: 'absolute', left: x - 230, top: G - 120, width: 300, height: 60, background: '#3D8BD8', border: `6px solid ${INK}`, borderRadius: 14, boxSizing: 'border-box'}} />
    {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: x - 210 + i * 90, top: G - 210, width: 76, height: 92, background: '#E0463A', border: `5px solid ${INK}`, borderRadius: 8, boxSizing: 'border-box'}} />)}
    <BigSeal id="smug" x={x + 160} y={G} h={300} pose={{}} />
    {x > 560 && <BigWord text="$$$" x={x} y={G - 330} at={P(25) + 1.4} size={110} color={GREEN} />}
  </>;
};

const Cta = ({t}: {t: number}) => <>
  <Ground />
  <BigWord text="move for 9¢?" x={540} y={380} at={P(27)} size={150} />
  <Flag x={780} y={560} t={t} w={240} />
  <Penguin id="doug" x={300} y={G + 60} h={560} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
  <BigWord text="👇" x={300} y={640} at={P(27) + 1.6} size={140} />
</>;

type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Versus t={t} />},
  {at: P(2), set: (t) => <div style={{position: 'absolute', inset: 0, transform: 'translateY(140px)'}}><SameGas t={t} at={P(2)} /></div>, fx_: 'zoom'},
  {at: P(3), set: (t) => <Intro t={t} />, fx_: 'swipe'},
  {at: P(5), set: (t) => <Fill t={t} />, fx_: 'swipeL'},
  {at: P(6), set: (t) => <Oil t={t} />, fx_: 'pop'},
  {at: P(7), set: (t) => <Pile t={t} />, fx_: 'zoom'},
  {at: P(8), set: (t) => <Cost t={t} />, fx_: 'swipe'},
  {at: P(9), set: (t) => <NotNine t={t} />, fx_: 'pop'},
  {at: P(10), set: (t) => <WhoPays t={t} />, fx_: 'iris'},
  {at: P(11), set: (t) => <Pays t={t} />, fx_: 'swipeL'},
  {at: P(12), set: () => <Title lines={['SUBSIDY']} y={760} at={P(12)} size={170} />, fx_: 'zoom'},
  {at: P(13), set: (t) => <America t={t} />, fx_: 'swipe'},
  {at: P(15), set: (t) => <Stack t={t} />, fx_: 'swipeL'},
  {at: P(16), set: (t) => <Mood t={t} at={P(16)} kind="angry" />, fx_: 'zoom'},
  {at: P(17), set: (t) => <RealLife t={t} />, fx_: 'iris'},
  {at: P(19), set: (t) => <Tank t={t} />, fx_: 'swipe'},
  {at: P(21), set: (t) => <Pack t={t} />, fx_: 'pop'},
  {at: P(23), set: (t) => <NotFreeLibya t={t} />, fx_: 'zoom'},
  {at: P(24), set: (t) => <Roads t={t} />, fx_: 'swipeL'},
  {at: P(25), set: (t) => <Smugglers t={t} />, fx_: 'swipe'},
  {at: P(26), set: (t) => <Mood t={t} at={P(26)} kind="confused" />, fx_: 'zoom'},
  {at: P(27), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [phrase, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[7, 540, 700, 1.3], [9, 540, 700, 1.3], [11, 600, 900, 1.3], [14, 470, 1000, 1.35], [20, 540, 600, 1.3], [24, 880, 1050, 1.35], [26, 540, 900, 1.2]];

export const DougLibya = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side named
    const toL = ease((tc - 0.9) / 0.5) * (tc < P(1) ? 1 : 0), toR = ease((tc - P(1)) / 0.4);
    s0 = 1 + 0.1 * (toL + toR); fx = 540 - 150 * toL + 150 * toR; fy = 900;
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (tc < 0.9 ? 1 : beat(tc, TIM));
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] + LOW - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.at >= P(3) ? <div style={{position: 'absolute', inset: 0, transform: `translateY(${LOW}px)`}}>{sh.set(t)}</div> : sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} y={1100} size={70} />
    <Audio src={staticFile('doug-libya-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={P(0) + 1.2} name="user-cash-register" vol={0.3} />
    <Sfx at={P(1) + 0.3} name="user-boom" vol={0.45} />
    <Sfx at={P(2) + 0.5} name="user-ting" vol={0.35} />
    <Sfx at={P(3)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(5) + 0.9} name="user-money" vol={0.3} />
    <Sfx at={P(5) + 1.3} name="user-timer" vol={0.3} />
    <Sfx at={P(6) + 0.9} name="user-boom" vol={0.4} />
    <Sfx at={P(7) + 1.2} name="user-wow" vol={0.35} />
    <Sfx at={P(8)} name="user-wrong" vol={0.3} />
    <Sfx at={P(8) + 1.0} name="user-cash-register" vol={0.25} />
    <Sfx at={P(8) + 2.2} name="user-cash-register" vol={0.25} />
    <Sfx at={P(9) + 1.0} name="user-slap" vol={0.4} />
    <Sfx at={P(10) + 1.2} name="user-boom" vol={0.4} />
    <Sfx at={P(11)} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(11) + 1.5} name="user-ting" vol={0.35} />
    <Sfx at={P(12)} name="user-ting" vol={0.35} />
    <Sfx at={P(13) + 0.6} name="user-wrong" vol={0.35} />
    <Sfx at={P(14)} name="user-aww" vol={0.35} />
    <Sfx at={P(15)} name="user-money" vol={0.3} />
    <Sfx at={P(15) + 2.6} name="gull-caw" vol={0.4} />
    <Sfx at={P(15) + 3.2} name="gull-mine" vol={0.35} />
    <Sfx at={P(16)} name="user-fahh" vol={0.45} />
    <Sfx at={P(17) + 1.4} name="user-cash-register" vol={0.3} />
    <Sfx at={P(17) + 3.0} name="user-shock" vol={0.35} />
    <Sfx at={P(18)} name="user-ting" vol={0.4} />
    <Sfx at={P(19) + 1.3} name="user-cash-register" vol={0.35} />
    <Sfx at={P(19) + 2.8} name="user-yeah" vol={0.35} />
    <Sfx at={P(20)} name="user-boom" vol={0.45} />
    <Sfx at={P(22)} name="user-yeah" vol={0.35} />
    <Sfx at={P(23) + 0.5} name="user-slap" vol={0.4} />
    <Sfx at={P(24) + 1.6} name="user-wrong" vol={0.35} />
    <Sfx at={P(25) + 0.2} name="swoosh-fast" vol={0.4} />
    <Sfx at={P(25) + 1.4} name="user-money" vol={0.3} />
    <Sfx at={P(26)} name="user-shock" vol={0.4} />
    <Sfx at={P(27) + 1.6} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
