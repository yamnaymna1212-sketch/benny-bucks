// EP9 "Gas: Iran vs America" — full episode. Hook = IranVersus + SameGas (approved). Voice: Kokoro am_fenrir x1.2.
// Facts: Iran ~$0.029/L = ~$0.11/gal, first 60 L/month, then 2x (GlobalPetrolPrices 2026); US avg ~$4.41/gal (AAA, Oct 2026);
// Iran 3rd largest proven oil reserves; energy subsidies ~$50B/yr (IEA); rial lost >90% of its value.
import React from 'react';
import {AbsoluteFill, Audio, getInputProps, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, back, onTwos} from '../penguin/rig';
import {BigSeal, Seagull} from '../penguin/cast';
import {BigWord, FishFlight, PriceTag, Stamp, Title} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {MoneyBag, OilGush, Pump, Refinery, Snowfall, Snowmobile} from './dougGas';
import {BossBear} from './dougVenezuela';
import {SameGas, UsFlag} from './dougLibya';
import {IrFlag, IranVersus} from './dougIran';
import TIM from '../data/doug-iran.json';
import CAP from '../data/doug-iran.captions.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_IRAN_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 1.2) * 30) / 30;
const LOW = 250, G = 1300, RED = '#D83A2E', GREEN = '#239E46';
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const Ground = () => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 60, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />;
const Pop = ({at, t, x, y, children}: {at: number; t: number; x: number; y: number; children: React.ReactNode}) =>
  t < at ? null : <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${back((t - at) / 0.3)})`}}>{children}</div>;
const Flag = ({x, y, us, t, w = 200}: {x: number; y: number; us?: boolean; t: number; w?: number}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y, transform: `skewY(${Math.sin(t * 5 + x) * 3}deg)`}}>{us ? <UsFlag w={w} /> : <IrFlag w={w} />}</div>;
const Board = ({x, y, label, price, color, at, t, us, unit = '/ GALLON', w = 360}: {x: number; y: number; label: string; price: string; color: string; at: number; t: number; us?: boolean; unit?: string; w?: number}) =>
  <Pop at={at} t={t} x={x} y={y}>
    <div style={{width: w, textAlign: 'center', background: '#fff', border: `7px solid ${INK}`, borderRadius: 22, padding: '14px 0'}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 50, color: INK}}>{label}</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.3, color, lineHeight: 1.05}}>{price}</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 30, color: INK}}>{unit}</div>
    </div>
    {us !== undefined && <div style={{position: 'absolute', left: w / 2 - 70, top: -100}}>{us ? <UsFlag w={140} /> : <IrFlag w={140} />}</div>}
  </Pop>;
const Barrel = ({x, y, w = 80}: {x: number; y: number; w?: number}) =>
  <div style={{position: 'absolute', left: x - w * 0.45, top: y - w * 1.2, width: w * 0.9, height: w * 1.2, background: '#2B2B2B', border: `4px solid ${INK}`, borderRadius: 10, boxSizing: 'border-box'}}>
    <div style={{marginTop: w * 0.35, height: 5, background: '#666'}} /><div style={{marginTop: w * 0.3, height: 5, background: '#666'}} /></div>;
// Iranian banknote that melts (drips) as `melt` goes 0 -> 1.
const Rial = ({x, y, w = 300, melt = 0, rot = 0}: {x: number; y: number; w?: number; melt?: number; rot?: number}) => {
  const h = w * 0.5;
  return <svg width={w} height={h * 2} viewBox={`0 0 ${w} ${h * 2}`} style={{position: 'absolute', left: x - w / 2, top: y - h / 2, overflow: 'visible', transform: `rotate(${rot}deg)`}}>
    <g transform={`translate(0 ${h * 0.5 * melt}) scale(1 ${1 - 0.5 * melt})`}>
      <rect x={4} y={4} width={w - 8} height={h - 8} rx={10} fill="#C9A3D9" stroke={INK} strokeWidth={6} />
      <circle cx={w / 2} cy={h / 2} r={h * 0.26} fill="none" stroke={INK} strokeWidth={5} />
      <text x={w / 2} y={h / 2 + h * 0.1} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={h * 0.26} fill={INK}>RIAL</text>
    </g>
    {melt > 0 && [0.2, 0.45, 0.7, 0.88].map((k, i) => <path key={i} d={`M${w * k - 10} ${h - 6} Q ${w * k} ${h + 60 * melt * (1 + (i % 2))}, ${w * k + 10} ${h - 6}`} fill="#C9A3D9" stroke={INK} strokeWidth={4} />)}
  </svg>;
};
const Dollar = ({x, y, w = 260}: {x: number; y: number; w?: number}) => <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.25, width: w, height: w * 0.5, background: '#8FCB8B', border: `6px solid ${INK}`, borderRadius: 10, boxSizing: 'border-box',
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.3, color: INK}}>$1</div>;

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
  <Pump x={790} y={G} t={t} run={t > P(5) + 0.5} dollars={Math.max(0, (t - P(5) - 0.5)) * 25} />
  <Penguin id="doug" x={560} y={G} h={380} pose={{turn: 0.6, look: [0.8, -0.2], brows: 'worried'}} />
  <BigWord text="every week" x={540} y={480} at={P(5) + 0.3} size={130} color={RED} />
</>;

const UsPrice = ({t}: {t: number}) => <>
  <Ground />
  <Board x={540} y={620} label="USA" price="$4.41" color={RED} at={P(6) + 0.2} t={t} us w={460} />
  <Penguin id="doug" x={540} y={G} h={360} pose={{brows: 'worried', sweat: true, look: [0, -0.7]}} />
</>;

const IrPrice = ({t}: {t: number}) => <>
  <Ground />
  <Board x={280} y={620} label="USA" price="$4.41" color={RED} at={-99} t={t} us w={360} />
  <Board x={800} y={620} label="IRAN" price="$0.11" color={GREEN} at={P(7) + 0.4} t={t} us={false} w={360} />
  <Penguin id="doug" x={540} y={G} h={360} pose={{brows: t > P(7) + 0.4 ? 'shock' : 'none', eyeScale: t > P(7) + 0.4 ? 1.25 : 1, look: [0.8, -0.4]}} />
</>;

const Jealous = ({t}: {t: number}) => <>
  <Ground />
  <Flag x={830} y={330} t={t} w={240} />
  <Penguin id="doug" x={480} y={G + 80} h={900} pose={{brows: 'angry', beak: 'frown', look: [0.9, -0.3], lids: 0.45, angry: 0.5, tremble: 0.4}} />
</>;

const Three = ({t}: {t: number}) => <>
  <Ground />
  <Penguin id="doug" x={250} y={G} h={420} pose={{look: [0.7, -0.6], brows: 'worried', flapR: 70}} />
  {[0, 1, 2].map((i) => <Pop key={i} at={P(9) + 0.9 + i * 0.25} t={t} x={560 + i * 170} y={760}>
    <div style={{width: 140, height: 140, borderRadius: 70, background: [GREEN, '#fff', RED][i], border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 90, color: i === 1 ? INK : '#fff'}}>{i + 1}</div>
  </Pop>)}
</>;

const Reason = ({t, n, word, at, children}: {t: number; n: number; word: string; at: number; children?: React.ReactNode}) => <>
  <Ground />
  <Title lines={[`REASON ${n}`]} y={330} at={at} size={130} />
  <BigWord text={word} x={540} y={560} at={at + 0.6} size={150} color={RED} />
  {children}
</>;

const Oil = ({t}: {t: number}) => <>
  <Ground />
  <OilGush x={640} y={G + 5} t={t} at={P(11) + 0.9} />
  <Penguin id="doug" x={230} y={G} h={400} pose={{turn: 0.5, look: [0.6, -0.6], brows: t > P(11) + 0.9 ? 'shock' : 'none', eyeScale: t > P(11) + 0.9 ? 1.25 : 1}} />
  <BigWord text="gas ← oil" x={540} y={480} at={P(11) + 0.2} size={130} />
</>;

const Pile = ({t}: {t: number}) => {
  const rows = 6, w = 86, out: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) for (let i = 0; i < rows - r; i++) {
    const k = r * 10 + i, at = P(12) + k * 0.04; if (t < at) continue;
    out.push(<Barrel key={k} x={540 + (i - (rows - r - 1) / 2) * w} y={G - r * w * 1.2 - (1 - ease((t - at) / 0.2)) * 200} w={w} />);
  }
  return <>
    <Ground />{out}
    <Flag x={540} y={G - rows * w * 1.2 - 170} t={t} />
    <BigWord text="#3 on Earth" x={540} y={330} at={P(12) + 1.2} size={130} color={GREEN} />
  </>;
};

const NextDoor = ({t}: {t: number}) => {
  const shipX = lerp(1300, 860, ease((t - P(13) - 1.2) / 0.4));
  return <>
    <Ground />
    {/* oil well */}
    <svg width={260} height={420} viewBox="0 0 260 420" style={{position: 'absolute', left: 40, top: G - 420, overflow: 'visible'}}>
      <path d="M60 420 L130 60 L200 420 M85 300 L175 300 M100 200 L160 200" fill="none" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <g transform={`rotate(${Math.sin(t * 3) * 14} 130 70)`}><rect x={20} y={55} width={220} height={30} rx={10} fill="#E0463A" stroke={INK} strokeWidth={6} /><rect x={226} y={50} width={30} height={90} rx={8} fill="#2B2B2B" /></g>
    </svg>
    {/* short pipe straight to the pump */}
    <div style={{position: 'absolute', left: 250, top: G - 60, width: 340, height: 34, background: '#555', border: `5px solid ${INK}`, boxSizing: 'border-box'}} />
    <Pump x={640} y={G} t={t} run={false} dollars={0.11} />
    <BigWord text="next door" x={420} y={520} at={P(13) + 0.3} size={120} color={GREEN} />
    {t > P(13) + 1.2 && <>
      <svg width={300} height={220} viewBox="0 0 300 220" style={{position: 'absolute', left: shipX - 150, top: G - 220 + Math.sin(t * 4) * 6, overflow: 'visible'}}>
        <path d="M10 120 L290 120 L250 200 L50 200 Z" fill="#3D6FB6" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <rect x={70} y={70} width={70} height={50} fill="#2B2B2B" stroke={INK} strokeWidth={5} /><rect x={150} y={70} width={70} height={50} fill="#2B2B2B" stroke={INK} strokeWidth={5} />
      </svg>
      <BigWord text="✕" x={860} y={G - 130} at={P(13) + 1.5} size={300} color={RED} />
    </>}
  </>;
};

const BearIn = ({t}: {t: number}) => {
  const at = P(14) + 0.6, x = lerp(1300, 700, ease((t - at) / 0.6));
  return <Reason t={t} n={2} word="" at={P(14)}>
    {t > at && <><BossBear x={x} y={G} h={620} mouth={t > at + 0.6 ? 0.4 : 0} /><Flag x={x + 250} y={560} t={t} w={160} /></>}
    <BigWord text="Boss Bear" x={250} y={900} at={P(14) + 0.9} size={90} color={RED} />
  </Reason>;
};

const Cost = ({t}: {t: number}) => {
  const steps = [{x: 190, label: 'pull', at: P(15) + 0.6}, {x: 540, label: 'clean', at: P(15) + 1.1}, {x: 890, label: 'ship', at: P(15) + 1.6}];
  return <>
    <Ground />
    <BigWord text="not free" x={540} y={400} at={P(15)} size={150} color={RED} />
    {t > steps[0].at && <svg width={260} height={420} viewBox="0 0 260 420" style={{position: 'absolute', left: 60, top: G - 420, overflow: 'visible'}}>
      <path d="M60 420 L130 60 L200 420 M85 300 L175 300 M100 200 L160 200" fill="none" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <g transform={`rotate(${Math.sin(t * 3) * 14} 130 70)`}><rect x={20} y={55} width={220} height={30} rx={10} fill="#E0463A" stroke={INK} strokeWidth={6} /><rect x={226} y={50} width={30} height={90} rx={8} fill="#2B2B2B" /></g>
    </svg>}
    {t > steps[1].at && <Refinery x={540} y={G} w={340} t={t} id="ref" />}
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

const BelowCost = ({t}: {t: number}) => <>
  <Ground />
  <Pump x={300} y={G} t={t} run={false} dollars={0.11} />
  <PriceTag x={740} y={560} price="$3+" at={P(16)} size={1.2} color={INK} />
  <BigWord text="real cost" x={740} y={380} at={P(16)} size={80} />
  <PriceTag x={740} y={960} price="$0.11" at={P(16) + 0.8} size={1.4} color={GREEN} />
  <BigWord text="↓" x={740} y={770} at={P(16) + 0.6} size={160} color={RED} />
</>;

const WhoPays = ({t}: {t: number}) => {
  const bearIn = P(17) + 0.9;
  return <>
    <Ground />
    <BigWord text="who pay?" x={540} y={420} at={P(17)} until={bearIn} size={150} />
    {t > bearIn && <>
      <BossBear x={lerp(1300, 560, ease((t - bearIn) / 0.5))} y={G} h={680} mouth={t > bearIn + 0.5 ? 0.4 : 0} />
      <Flag x={lerp(1300, 560, ease((t - bearIn) / 0.5)) + 260} y={500} t={t} w={160} />
    </>}
  </>;
};

const Pays = ({t}: {t: number}) => <>
  <Ground />
  <Pump x={560} y={G} t={t} run={false} dollars={0.11} />
  <BossBear x={170} y={G} h={520} mouth={0.3} />
  <BigSeal id="driver" x={900} y={G} h={360} flip />
  <FishFlight x1={200} y1={G - 500} x2={560} y2={G - 360} a={P(18)} b={P(18) + 0.8} n={5} w={90} />
  <FishFlight x1={200} y1={G - 500} x2={560} y2={G - 360} a={P(18) + 0.9} b={P(18) + 1.7} n={5} w={90} seed={3} />
  <BigWord text="$$$$$" x={330} y={440} at={P(18)} size={110} color={RED} />
  <BigWord text="11¢" x={880} y={500} at={P(18) + 1.4} size={170} color={GREEN} />
</>;

const Billions = ({t}: {t: number}) => <>
  <Ground />
  <BigWord text="in real life" x={540} y={300} at={P(20)} size={120} />
  <MoneyBag x={540} y={G} w={480} label="$50B" />
  <BossBear x={170} y={G} h={460} sweat />
  <BigWord text="every year" x={540} y={520} at={P(20) + 2.4} size={110} color={RED} />
  <div style={{position: 'absolute', left: 0, right: 0, top: G + 80, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 40, color: '#666'}}>IEA estimate</div>
</>;

const America = ({t}: {t: number}) => {
  const gull = P(21) + 1.9, gx = lerp(1300, 860, ease((t - gull) / 0.5));
  return <>
    <Ground />
    <Flag x={250} y={340} us t={t} w={240} />
    <div style={{position: 'absolute', left: 110, top: G - 520, width: 280, height: 520, border: `8px dashed #9AA1A8`, borderRadius: '140px 140px 20px 20px', boxSizing: 'border-box'}} />
    <BigWord text="✕" x={250} y={G - 260} at={P(21) + 0.5} size={260} color={RED} />
    <Pump x={640} y={G} t={t} run={false} dollars={4.41} />
    <Penguin id="doug" x={460} y={G} h={360} pose={t > P(21) + 1 ? {brows: 'worried', beak: 'frown', sweat: true} : {turn: -0.5, look: [-0.8, 0]}} />
    {t > gull && <Seagull id="gull" x={gx} y={G} h={340} flip pose={{angry: true, holding: t > gull + 0.4}} />}
    <BigWord text="+ TAX" x={860} y={560} at={gull + 0.2} size={120} color={RED} />
  </>;
};

const Melt = ({t}: {t: number}) => <Reason t={t} n={3} word="" at={P(22)}>
  <Rial x={540} y={900} w={420} melt={ease((t - P(22) - 0.5) / 0.9)} />
  <BigWord text="money melt" x={540} y={600} at={P(22) + 0.5} size={120} color={RED} />
</Reason>;

const SamePrice = ({t}: {t: number}) => <>
  <Ground />
  <Pump x={330} y={G} t={t} run={false} dollars={0.11} />
  <Rial x={760} y={720} w={330} rot={-6} />
  <Stamp text="SAME" x={760} y={980} at={P(23) + 0.6} color={GREEN} size={120} />
</>;

const Ninety = ({t}: {t: number}) => {
  const m = ease((t - P(24) - 0.3) / 1.6);
  return <>
    <Ground />
    <Rial x={540} y={820} w={520} melt={m} />
    <BigWord text="-90%" x={540} y={480} at={P(24) + 1.0} size={220} color={RED} />
    <Penguin id="doug" x={180} y={G} h={330} pose={{brows: 'shock', eyeScale: 1.2, turn: 0.5}} />
  </>;
};

const Pennies = ({t}: {t: number}) => <>
  <Ground />
  <Dollar x={300} y={700} w={300} />
  <BigWord text="=" x={540} y={700} at={P(25) + 0.3} size={180} />
  {[0, 1, 2].map((i) => <Pop key={i} at={P(25) + 0.6 + i * 0.15} t={t} x={760 + (i % 2) * 120} y={620 + i * 90}>
    <div style={{width: 110, height: 110, borderRadius: 55, background: '#C77B3A', border: `6px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 50, color: '#fff'}}>1¢</div>
  </Pop>)}
  <Pump x={540} y={G} t={t} run={false} dollars={0.11} />
</>;

const Mood = ({t}: {t: number}) => <>
  <Ground />
  <Penguin id="doug" x={540} y={G + 80} h={900} pose={{brows: 'shock', eyeScale: 1.3, flapL: 120 + Math.sin(t * 12) * 12, flapR: 120 - Math.sin(t * 12) * 12}} />
</>;

const Recap = ({t}: {t: number}) => {
  const items = [{at: P(27), n: <Barrel x={0} y={120} w={150} />}, {at: P(27) + 0.6, n: <div style={{position: 'relative', left: 0, top: 0}}><BossBear x={0} y={200} h={300} /></div>}, {at: P(27) + 1.2, n: <Rial x={0} y={40} w={240} melt={0.6} />}];
  return <>
    <Ground />
    {items.map((it, i) => t < it.at ? null : <div key={i} style={{position: 'absolute', left: 200 + i * 340, top: 700, transform: `scale(${back((t - it.at) / 0.3)})`}}>{it.n}</div>)}
    {[0, 1].map((i) => t > items[i + 1].at && <div key={`p${i}`} style={{position: 'absolute', left: 340 + i * 340, top: 700, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 110, color: INK}}>+</div>)}
  </>;
};

const Cheapest = ({t}: {t: number}) => <>
  <Ground />
  {/* podium */}
  {[{x: 540, h: 360, n: '1'}, {x: 270, h: 240, n: '2'}, {x: 810, h: 170, n: '3'}].map((p) =>
    <div key={p.n} style={{position: 'absolute', left: p.x - 130, top: G - p.h, width: 260, height: p.h, background: p.n === '1' ? '#F2B705' : '#D6DDE3', border: `7px solid ${INK}`, boxSizing: 'border-box', textAlign: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 110, color: INK, paddingTop: 20}}>{p.n}</div>)}
  <Penguin id="doug" x={540} y={G - 360} h={300} pose={{beak: 'smile', brows: 'happy', flapR: 140}} />
  <Flag x={540} y={G - 360 - 420} t={t} w={200} />
  <BigWord text="#1 in Asia" x={540} y={330} at={P(28) + 0.8} size={130} color={GREEN} />
</>;

const Liter = ({t}: {t: number}) => <>
  <Ground />
  <PriceTag x={540} y={700} price="3¢" at={P(29)} size={2} color={GREEN} />
  <BigWord text="/ liter" x={540} y={1000} at={P(29) + 0.3} size={110} />
</>;

const Catch = ({t}: {t: number}) => <>
  <Ground />
  <Penguin id="doug" x={540} y={G} h={480} pose={{brows: 'worried', look: [0, -0.5], beak: 'flat'}} />
  <Stamp text="CATCH" x={540} y={560} at={P(30) + 0.3} color={RED} size={150} />
</>;

const Limit = ({t}: {t: number}) => {
  const lvl = cl((t - P(31) - 0.3) / 1.2);
  return <>
    <Ground />
    <div style={{position: 'absolute', left: 330, top: 520, width: 300, height: 600, border: `8px solid ${INK}`, borderRadius: 24, overflow: 'hidden', boxSizing: 'border-box', background: '#fff'}}>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: '#F2B705'}} />
    </div>
    <BigWord text="60 L" x={480} y={420} at={P(31) + 0.2} size={140} color={GREEN} />
    {/* calendar */}
    <div style={{position: 'absolute', left: 700, top: 700, width: 250, height: 240, background: '#fff', border: `7px solid ${INK}`, borderRadius: 16, boxSizing: 'border-box', textAlign: 'center'}}>
      <div style={{height: 60, background: RED, borderBottom: `6px solid ${INK}`}} />
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56, color: INK, marginTop: 30}}>1 month</div>
    </div>
  </>;
};

const Double = ({t}: {t: number}) => <>
  <Ground />
  <PriceTag x={300} y={720} price="3¢" at={-99} size={1.4} color={GREEN} />
  <BigWord text="→" x={540} y={720} at={P(32) + 0.2} size={160} />
  <PriceTag x={790} y={720} price="6¢" at={P(32) + 0.4} size={1.6} color={RED} />
  <Stamp text="x2" x={790} y={1000} at={P(32) + 0.7} color={RED} size={130} />
</>;

const Cta = ({t}: {t: number}) => <>
  <Ground />
  <Flag x={250} y={420} t={t} w={240} />
  <Flag x={830} y={420} us t={t} w={240} />
  <BigWord text="gas" x={250} y={720} at={P(33) + 0.2} size={110} color={GREEN} />
  <BigWord text="paycheck" x={830} y={720} at={P(33) + 0.9} size={100} color={RED} />
  <Penguin id="doug" x={540} y={G + 40} h={480} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [Math.sin(t * 2), 0.4]}} />
  <BigWord text="👇" x={800} y={1000} at={P(33) + 1.6} size={120} />
</>;

type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <IranVersus t={t} />},
  {at: P(2), set: (t) => <div style={{position: 'absolute', inset: 0, transform: 'translateY(140px)'}}><SameGas t={t} at={P(2)} left={<IrFlag />} right={<UsFlag />} priceL="$0.11" priceR="$4.41" colorL={GREEN} colorR={RED} /></div>, fx_: 'zoom'},
  {at: P(3), set: (t) => <Intro t={t} />, fx_: 'swipe'},
  {at: P(5), set: (t) => <Fill t={t} />, fx_: 'swipeL'},
  {at: P(6), set: (t) => <UsPrice t={t} />, fx_: 'pop'},
  {at: P(7), set: (t) => <IrPrice t={t} />, fx_: 'swipe'},
  {at: P(8), set: (t) => <Jealous t={t} />, fx_: 'zoom'},
  {at: P(9), set: (t) => <Three t={t} />, fx_: 'iris'},
  {at: P(10), set: (t) => <Reason t={t} n={1} word="OIL" at={P(10)}><Flag x={540} y={760} t={t} w={260} /></Reason>, fx_: 'pop'},
  {at: P(11), set: (t) => <Oil t={t} />, fx_: 'swipeL'},
  {at: P(12), set: (t) => <Pile t={t} />, fx_: 'zoom'},
  {at: P(13), set: (t) => <NextDoor t={t} />, fx_: 'swipe'},
  {at: P(14), set: (t) => <BearIn t={t} />, fx_: 'pop'},
  {at: P(15), set: (t) => <Cost t={t} />, fx_: 'swipeL'},
  {at: P(16), set: (t) => <BelowCost t={t} />, fx_: 'swipe'},
  {at: P(17), set: (t) => <WhoPays t={t} />, fx_: 'iris'},
  {at: P(18), set: (t) => <Pays t={t} />, fx_: 'swipeL'},
  {at: P(19), set: () => <Title lines={['SUBSIDY']} y={760} at={P(19)} size={170} />, fx_: 'zoom'},
  {at: P(20), set: (t) => <Billions t={t} />, fx_: 'pop'},
  {at: P(21), set: (t) => <America t={t} />, fx_: 'swipe'},
  {at: P(22), set: (t) => <Melt t={t} />, fx_: 'iris'},
  {at: P(23), set: (t) => <SamePrice t={t} />, fx_: 'swipeL'},
  {at: P(24), set: (t) => <Ninety t={t} />, fx_: 'zoom'},
  {at: P(25), set: (t) => <Pennies t={t} />, fx_: 'swipe'},
  {at: P(26), set: (t) => <Mood t={t} />, fx_: 'zoom'},
  {at: P(27), set: (t) => <Recap t={t} />, fx_: 'pop'},
  {at: P(28), set: (t) => <Cheapest t={t} />, fx_: 'swipeL'},
  {at: P(29), set: (t) => <Liter t={t} />, fx_: 'zoom'},
  {at: P(30), set: (t) => <Catch t={t} />, fx_: 'iris'},
  {at: P(31), set: (t) => <Limit t={t} />, fx_: 'swipe'},
  {at: P(32), set: (t) => <Double t={t} />, fx_: 'pop'},
  {at: P(33), set: (t) => <Cta t={t} />, fx_: 'swipeL'},
];
// deep zooms [phrase, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[6, 540, 650, 1.3], [7, 800, 650, 1.3], [12, 540, 700, 1.3], [18, 560, 950, 1.2], [20, 540, 800, 1.15], [24, 540, 700, 1.3], [29, 540, 750, 1.3], [32, 560, 800, 1.2]];

export const DougIran = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side named (same as the approved hook)
    const swing = P(1) + 0.85, toL = ease((tc - 0.5) / 0.5) * (tc < swing ? 1 : 0), toR = ease((tc - swing) / 0.4);
    s0 = 1 + 0.15 * (toL + toR); fx = 540 - 190 * toL + 190 * toR; fy = 860;
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (tc < 0.5 ? 1 : beat(tc, TIM));
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] + LOW - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.at >= P(3) ? <div style={{position: 'absolute', inset: 0, transform: `translateY(${LOW}px)`}}>{sh.set(t)}</div> : sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    {!getInputProps().noCaptions && <Captions t={tc} phrases={TIM} place={CAP} bare />}
    <Audio src={staticFile('doug-iran-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    {/* hook (same as the approved preview) */}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.6} name="user-cash-register" vol={0.3} />
    <Sfx at={P(1) + 1.0} name="user-boom" vol={0.45} />
    <Sfx at={P(2) + 0.5} name="user-ting" vol={0.35} />
    {/* story */}
    <Sfx at={P(3)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(5) + 0.5} name="user-money" vol={0.3} />
    <Sfx at={P(5) + 0.3} name="user-timer" vol={0.3} />
    <Sfx at={P(6) + 0.2} name="user-cash-register" vol={0.35} />
    <Sfx at={P(7) + 0.4} name="user-ting" vol={0.4} />
    <Sfx at={P(8)} name="user-aww" vol={0.35} />
    <Sfx at={P(9) + 0.9} name="user-pop" vol={0.3} />
    <Sfx at={P(10)} name="user-boom" vol={0.35} />
    <Sfx at={P(11) + 0.9} name="user-boom" vol={0.4} />
    <Sfx at={P(12) + 1.2} name="user-wow" vol={0.35} />
    <Sfx at={P(13) + 1.5} name="user-wrong" vol={0.35} />
    <Sfx at={P(14)} name="user-boom" vol={0.35} />
    <Sfx at={P(15) + 0.6} name="user-cash-register" vol={0.25} />
    <Sfx at={P(15) + 1.6} name="user-cash-register" vol={0.25} />
    <Sfx at={P(16) + 0.8} name="user-slap" vol={0.35} />
    <Sfx at={P(17) + 0.9} name="user-boom" vol={0.4} />
    <Sfx at={P(18)} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(18) + 1.4} name="user-ting" vol={0.35} />
    <Sfx at={P(19)} name="user-ting" vol={0.35} />
    <Sfx at={P(20)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(20) + 2.4} name="user-timer" vol={0.3} />
    <Sfx at={P(21) + 0.5} name="user-wrong" vol={0.35} />
    <Sfx at={P(21) + 1.9} name="gull-caw" vol={0.4} />
    <Sfx at={P(22)} name="user-boom" vol={0.35} />
    <Sfx at={P(22) + 0.5} name="user-aww" vol={0.3} />
    <Sfx at={P(23) + 0.6} name="user-slap" vol={0.35} />
    <Sfx at={P(24) + 1.0} name="user-fahh" vol={0.45} />
    <Sfx at={P(25) + 0.6} name="user-money" vol={0.3} />
    <Sfx at={P(26)} name="user-shock" vol={0.4} />
    <Sfx at={P(27)} name="user-pop" vol={0.3} />
    <Sfx at={P(27) + 0.6} name="user-pop" vol={0.3} />
    <Sfx at={P(27) + 1.2} name="user-pop" vol={0.3} />
    <Sfx at={P(28) + 0.8} name="user-yeah" vol={0.35} />
    <Sfx at={P(29)} name="user-ting" vol={0.45} />
    <Sfx at={P(30) + 0.3} name="user-slap" vol={0.4} />
    <Sfx at={P(31) + 0.3} name="user-timer" vol={0.3} />
    <Sfx at={P(32) + 0.4} name="user-cash-register" vol={0.35} />
    <Sfx at={P(32) + 0.7} name="user-boom" vol={0.35} />
    <Sfx at={P(33) + 1.6} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
