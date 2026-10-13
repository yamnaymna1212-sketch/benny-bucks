import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Box, C, Counter, Fonts, Pic, Scene, Sfx, Txt} from '../engine';

export const GAS_IRAN_SECONDS = 61.9;
const usd = (d: number) => (n: number) => '$' + n.toFixed(d);
const int = (n: number) => Math.round(n).toLocaleString('en-US');
const Q = ({x, y, at, flip, children}: {x: number; y: number; at: number; flip: number; children: React.ReactNode}) => (
  <>
    <Box x={x} y={y} w={380} h={460} bg="#FFF4D6" at={at} until={flip}><Txt x={0} y={0} size={220} enter="none">?</Txt></Box>
    {children}
  </>
);

export const GasIran = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Fonts />
    <Audio src={staticFile('voice-gas-iran.mp3')} />

    {/* 1 Hook: $66 fill-up */}
    <Scene from={0} to={3.15} cam={[[0, 1, 540, 1000], [3.15, 1.12, 560, 1000]]}>
      <Pic src="benny-gas-station" w={1080} x={540} y={1010} enter="none" bob />
      <Counter from={0} to={66.15} dur={2.2} at={0.2} fmt={usd(2)} x={540} y={420} size={190} color={C.red} enter="none" />
    </Scene>
    <Sfx at={0} name="hum" vol={0.25} /><Sfx at={2.4} name="ding" vol={0.4} />

    {/* 2 Contrast: Iran, less than gum */}
    <Scene from={3.15} to={6.5}>
      <Pic src="benny-gas-station" w={600} x={290} y={1000} enter="slideL" />
      <Pic src="iran-gas-station" w={600} x={800} y={1000} enter="slideR" at={0.4} />
      <Txt x={290} y={470} size={130} color={C.red} enter="none">$66</Txt>
      <Txt x={790} y={470} size={130} color={C.green} at={2.3}>$0.39</Txt>
      <Pic src="gum-pack" w={330} x={820} y={1400} at={2.3} rot={-12} />
      <Txt x={790} y={1530} size={64} at={2.5}>less than gum</Txt>
    </Scene>
    <Sfx at={3.15} name="whoosh" /><Sfx at={5.45} name="record-scratch" vol={0.6} />


    {/* 3 Decision */}
    <Scene from={6.5} to={7.95} cam={[[0, 1, 540, 960], [1.4, 1.18, 540, 800]]}>
      <Pic src="benny-pointing" w={900} x={480} y={1150} />
      <Txt x={800} y={700} size={110} at={0.3} enter="slideR">IRAN →</Txt>
    </Scene>
    <Sfx at={6.55} name="pop" />

    {/* 4 Last US fill-up */}
    <Scene from={7.95} to={11.5}>
      <Pic src="benny-sad-02" w={900} x={540} y={1170} enter="none" bob />
      <Box x={540} y={350} w={560} h={230} bg="#FFF" at={2.2} enter="drop"><Txt x={0} y={0} size={120} color={C.red} enter="none">$4.41/gal</Txt></Box>
    </Scene>
    <Sfx at={10.15} name="thud" /><Sfx at={10.3} name="coins" vol={0.35} />

    {/* 5 Liquid dinosaurs */}
    <Scene from={11.5} to={13.75}>
      <Pic src="benny-angry" w={900} x={360} y={1050} enter="none" shakeAt={[0.4]} />
      <Pic src="dino-skeleton" w={620} x={790} y={760} at={0.9} rot={6} />
      <Txt x={540} y={1560} size={80} at={0.9}>liquid dinosaurs</Txt>
    </Scene>
    <Sfx at={11.9} name="impact" vol={0.4} /><Sfx at={12.45} name="roar" vol={0.35} />

    {/* 6 Fly to Tehran */}
    <Scene from={13.75} to={15.0} cam={[[0, 2, 330, 860], [1.25, 2, 820, 900]]}>
      <Pic src="map-usa-iran" w={1080} x={540} y={960} enter="none" />
    </Scene>
    <Scene from={15.0} to={17.5}>
      <Pic src="iran-gas-station" w={1080} x={540} y={960} enter="none" />
      <Txt x={905} y={950} size={64} at={0.95} stroke={false}>{'1,500\ntomans/L'}</Txt>
      <Txt x={540} y={330} size={90} at={0.1} enter="drop">TEHRAN</Txt>
    </Scene>
    <Sfx at={13.75} name="whoosh" /><Sfx at={15.0} name="thud" /><Sfx at={15.95} name="pop" />

    {/* 7 Is that a lot? */}
    <Scene from={17.5} to={18.55}>
      <Pic src="benny-thinking-03" w={900} x={540} y={1170} enter="none" bob />
      <Txt x={540} y={330} size={150} at={0.1}>= ?</Txt>
    </Scene>
    <Sfx at={17.55} name="boing" vol={0.4} />

    {/* 8 Less than 3 cents */}
    <Scene from={18.55} to={20.45} cam={[[0, 1, 540, 960], [0.9, 1, 540, 960], [1.1, 1.15, 540, 420]]}>
      <Pic src="benny-shocked" w={820} x={540} y={1230} enter="none" shakeAt={[1.05]} />
      <Counter from={4.41} to={0.03} dur={1.0} at={0.05} fmt={usd(2)} x={540} y={330} size={190} color={C.green} enter="none" />
      <Txt x={540} y={470} size={64} at={1.0}>per gallon</Txt>
    </Scene>
    <Sfx at={18.6} name="tick" vol={0.3} /><Sfx at={19.6} name="impact" vol={0.5} />

    {/* 9 Couch money */}
    <Scene from={20.45} to={22.2}>
      <Pic src="benny-relaxed" w={1080} x={540} y={1050} enter="none" bob />
      {[0, 1, 2].map((i) => <Box key={i} x={380 + i * 150} y={300} w={110} h={110} bg={C.yellow} at={0.3 + i * 0.12} rot={i * 8}><Txt x={0} y={0} size={60} enter="none" stroke={false}>¢</Txt></Box>)}
      <Txt x={540} y={1600} size={70} at={0.5}>couch money &gt; gas</Txt>
    </Scene>
    <Sfx at={20.75} name="coins" vol={0.4} />

    {/* 10 Fuel card + quota + price jump */}
    <Scene from={22.2} to={28.65} cam={[[0, 2.3, 315, 980], [1.6, 2.3, 315, 980], [2.2, 1, 540, 960]]}>
      <Pic src="iran-gas-station" w={1080} x={540} y={960} enter="none" until={2.4} />
      <Box x={315} y={975} w={130} h={100} bg={C.red} at={0.35} until={2.4}><Txt x={0} y={0} size={22} color="#fff" stroke={false} enter="none">{'FUEL CARD\nREQUIRED'}</Txt></Box>
      <Txt x={905} y={950} size={64} enter="none" until={2.4} stroke={false}>{'1,500\ntomans/L'}</Txt>
      <Pic src="iran-gas-station" w={780} x={400} y={900} enter="none" at={2.4} />
      <Txt x={664} y={893} size={46} enter="none" at={2.4} until={5.2} stroke={false}>{'1,500\ntomans/L'}</Txt>
      <Txt x={664} y={893} size={46} color={C.red} at={5.2} enter="drop" stroke={false}>{'10,000\ntomans/L'}</Txt>
      <Txt x={540} y={360} size={84} at={2.3}>LOCALS ONLY</Txt>
      <Box x={540} y={500} w={720} h={90} bg="#fff" at={2.4} enter="fade">{null}</Box>
      <QuotaFill />
      <Txt x={540} y={630} size={66} at={2.6}>60 liters / month</Txt>
      <Pic src="benny-worried" w={480} x={850} y={1460} at={2.5} enter="slideR" />
      <Txt x={790} y={720} size={100} color={C.red} at={5.2} enter="pop">↑</Txt>
    </Scene>
    <Sfx at={22.55} name="error" vol={0.35} /><Sfx at={24.7} name="riser" vol={0.2} /><Sfx at={27.4} name="spring" vol={0.4} />

    {/* 11 Still pocket change */}
    <Scene from={28.65} to={29.95}>
      <Pic src="benny-excited" w={900} x={540} y={1170} enter="none" bob />
      <Txt x={540} y={320} size={110} color={C.green} at={0.2}>STILL CHEAP!</Txt>
    </Scene>
    <Sfx at={28.9} name="cha-ching" vol={0.45} />

    {/* 12-13 Mystery cards: government, then broken money */}
    <Scene from={29.95} to={41.1}>
      <Txt x={540} y={330} size={84} at={0.05}>WHO PAYS?</Txt>
      <Q x={300} y={760} at={0.1} flip={1.95}><Pic src="government-office" w={430} x={300} y={760} at={1.95} /></Q>
      <Txt x={300} y={1040} size={60} color={C.red} at={2.6}>BELOW COST</Txt>
      <Q x={780} y={760} at={0.2} flip={4.45}><Pic src="rial-stack" w={520} x={780} y={790} at={4.45} shakeAt={[10.35]} /></Q>
      <Txt x={780} y={1080} size={54} color={C.red} at={6.3}>{'$1 = 2,200,000+\nrials'}</Txt>
      <Pic src="benny-thinking-03" w={540} x={540} y={1560} at={0.3} until={6.8} enter="slideL" />
      <Pic src="benny-shocked" w={480} x={540} y={1600} at={6.8} until={8.75} enter="none" />
      <Pic src="benny-thinking-02" w={540} x={540} y={1560} at={8.75} enter="none" />
      <Txt x={780} y={700} size={120} color={C.red} at={10.3} rot={-14}>BROKEN</Txt>
    </Scene>
    <Sfx at={30.0} name="riser" vol={0.25} /><Sfx at={31.9} name="flip" /><Sfx at={34.4} name="flip" /><Sfx at={36.3} name="thud" /><Sfx at={40.25} name="crack" vol={0.5} />

    {/* 14 America: world price stack */}
    <Scene from={41.1} to={46.75}>
      <Pic src="benny-pointing" w={820} x={330} y={1150} bob />
      <Txt x={540} y={340} size={84} at={0.9}>WORLD PRICE</Txt>
      <PriceStack />
    </Scene>
    <Sfx at={42.6} name="thud" /><Sfx at={44.0} name="thud" /><Sfx at={44.7} name="thud" /><Sfx at={45.6} name="thud" />

    {/* 15 Millionaire */}
    <Scene from={46.75} to={52.95} cam={[[0, 1, 540, 960], [5.2, 1.12, 540, 760]]}>
      <Txt x={540} y={420} size={150} color={C.green} at={0.3}>$66 =</Txt>
      <Counter from={0} to={145000000} dur={3.2} at={1.6} fmt={int} x={540} y={640} size={120} color={C.green} />
      <Txt x={540} y={780} size={80} at={1.8}>rials</Txt>
      <Pic src="rial-stack" w={600} x={540} y={1250} at={2.0} until={5.2} />
      <Pic src="benny-excited" w={680} x={540} y={1460} at={5.2} bob />
    </Scene>
    <Sfx at={48.4} name="tick" vol={0.25} /><Sfx at={49.2} name="tick" vol={0.25} /><Sfx at={50.0} name="tick" vol={0.25} /><Sfx at={51.95} name="cash-rain" vol={0.5} />

    {/* 16 Texas, empty tank */}
    <Scene from={52.95} to={56.75}>
      <Pic src="benny-tired-driving" w={1080} x={540} y={1050} enter="none" shakeAt={[0.3, 1.2]} />
      <Txt x={540} y={360} size={110} at={0.6} enter="drop">TEXAS</Txt>
      <Txt x={800} y={1500} size={90} color={C.red} at={2.2}>EMPTY</Txt>
    </Scene>
    <Sfx at={53.2} name="sputter" vol={0.4} /><Sfx at={55.0} name="sad-horn" vol={0.3} />

    {/* 17 Comment question */}
    <Scene from={56.75} to={GAS_IRAN_SECONDS}>
      <Txt x={290} y={330} size={84} color={C.red} at={0.1}>{'$66\nGAS'}</Txt>
      <Txt x={790} y={330} size={70} color={C.red} at={1.0}>{'BROKEN\nMONEY'}</Txt>
      <Pic src="dino-skeleton" w={420} x={290} y={620} at={0.2} />
      <Pic src="rial-stack" w={360} x={790} y={630} at={1.0} />
      <Txt x={540} y={850} size={80} at={2.3}>WHICH IS WORSE? ↓</Txt>
      <Pic src="benny-front" w={680} x={540} y={1450} bob />
    </Scene>
    {/* curiosity tag until the answer (on top of everything) */}
    <Scene from={3.4} to={31.9} overlay><Txt x={120} y={215} size={56} color={C.red} rot={-8}>WHY?</Txt></Scene>
    <Sfx at={56.85} name="pop" /><Sfx at={57.75} name="pop" /><Sfx at={59.05} name="boing" vol={0.3} />
  </AbsoluteFill>
);

import {interpolate, useCurrentFrame} from 'remotion';
const QuotaFill = () => {
  const t = useCurrentFrame() / 30;
  const p = interpolate(t, [2.6, 3.8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (t < 2.4) return null;
  return <div style={{position: 'absolute', left: 190, top: 465, width: 700 * p, height: 70, background: C.green, borderRadius: 10}} />;
};
const PriceStack = () => {
  const t = useCurrentFrame() / 30;
  const seg = [['crude oil', 0.52, '#3B3B3B', 1.5], ['refining', 0.22, '#7A7A7A', 2.9], ['trucks', 0.15, C.yellow, 3.6], ['taxes', 0.12, C.red, 4.5]] as const;
  let y = 1550;
  return <>{seg.map(([name, share, col, at]) => {
    const h = 900 * share; y -= h;
    if (t < at) return null;
    const top = y;
    return <div key={name} style={{position: 'absolute', left: 700, top, width: 260, height: h - 6, background: col, border: `5px solid ${C.ink}`, borderRadius: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Marker', fontSize: 46, color: '#fff', WebkitTextStroke: '2px #1A1A1A'}}>{name}</div>;
  })}{t > 4.9 && <Txt x={830} y={1620} size={80} color={C.red}>$4.41</Txt>}</>;
};
