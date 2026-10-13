import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile} from 'remotion';
import {At, Benny, C, Camera, Counter, Fonts, Pic, Scene, Sfx, Txt, Words, Z, pop, ramp, useT, wordTimer} from '../engine';
import {Arrow, BarStack, Bill, Card, Coin, Crack, Cushion, FlipCard, Gauge, Globe, JerryCan, Land, Plane, Pump, Scale, Sparkles, Stack, Tag} from '../props';
import lines from '../data/gas-iran.json';

export const GAS_IRAN_SECONDS = 61.9;
const w = wordTimer(lines);
const L = (n: number) => lines[n - 1];
const usd = (d: number) => (n: number) => '$' + n.toFixed(d);
const int = (n: number) => Math.round(n).toLocaleString('en-US');
const Y = Z.topY; // center of the top illustration band

// Small helpers that read the timeline
const Live = ({children}: {children: (t: number) => React.ReactNode}) => <>{children(useT())}</>;

export const GasIran = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Fonts />
    <Audio src={staticFile('voice-gas-iran.mp3')} />
    <Camera punch={[2.45, w(4, 'Four'), w(8, 'three'), w(15, 'two million'), w(18, 'hundred'), w(19, 'millionaire')]}
      shake={[w(5, 'bucks'), w(16, 'broken'), 53.4]}>

      {/* 1 Hook: pump counts to $66.15 */}
      <Scene from={0} to={L(2).start}>
        <At x={540} y={Y}><Live>{(t) => <Pump w={380} flag="usa" display={usd(2)(ramp(t, 0.2, 2.4, 0, 66.15))} />}</Live></At>
        <At x={820} y={Y - 120} at={2.4}><Sparkles w={260} at={2.4} /></At>
      </Scene>

      {/* 2 USA pump vs Iran pump, gum */}
      <Scene from={L(2).start} to={L(3).start}>
        <At x={250} y={Y} enter="slideL" at={L(2).start}><Pump w={290} flag="usa" display="$66.15" /></At>
        <At x={680} y={Y} enter="slideR" at={w(2, 'Iran')}><Pump w={290} flag="iran" color="#fff" display="$0.39" /></At>
        <Pic src="gum-pack" w={170} x={930} y={Y + 170} at={w(2, 'gum')} rot={-15} />
      </Scene>

      {/* 3 Plane takes off */}
      <Scene from={L(3).start} to={L(4).start}>
        <Live>{(t) => { const p = ramp(t, L(3).start + 0.2, L(4).start); return <>
          <svg width={1080} height={700} style={{position: 'absolute', left: 0, top: Y - 350}}><path d={`M80 560 Q540 ${80} 1000 300`} stroke={C.ink} strokeWidth={6} strokeDasharray="14 18" fill="none" strokeDashoffset={0} opacity={0.5} /></svg>
          <At x={80 + 920 * p} y={Y + 210 - 520 * p + 330 * p * p} rot={-25 + 40 * p}><Plane w={220} /></At></>; }}</Live>
        <Txt x={930} y={Y + 10} size={70} color={C.green} at={w(3, 'Iran')}>IRAN</Txt>
      </Scene>

      {/* 4 Last US fill-up: jerrycan fills, $4.41 tag drops */}
      <Scene from={L(4).start} to={L(5).start}>
        <At x={300} y={Y}><Pump w={290} flag="usa" display="$4.41/gal" /></At>
        <At x={580} y={Y + 100}><Live>{(t) => <JerryCan w={220} fill={ramp(t, L(4).start + 0.3, L(5).start - 0.3)} />}</Live></At>
        <At x={830} y={Y - 80} enter="drop" at={w(4, 'Four')}><Tag text="$4.41" color={C.gold} w={360} /></At>
      </Scene>

      {/* 5 Liquid dinosaurs */}
      <Scene from={L(5).start} to={L(6).start}>
        <At x={300} y={Y} shakeAt={[w(5, 'bucks')]}><Pump w={290} flag="usa" display="$66.15" /></At>
        <Pic src="dino-skeleton" w={560} x={720} y={Y} at={w(5, 'dinosaurs')} rot={8} />
      </Scene>

      {/* 6 Map flight, then Tehran station (full frame) */}
      <Scene from={L(6).start} to={L(6).start + 1.3} cam={[[L(6).start, 1.9, 330, 860], [L(6).start + 1.3, 1.9, 820, 900]]}>
        <Pic src="map-usa-iran" w={1080} x={540} y={960} enter="none" />
      </Scene>
      <Scene from={L(6).start + 1.3} to={L(7).start} cam={[[L(6).start + 1.3, 1.08, 540, 960], [L(7).start, 1, 540, 960]]}>
        <Pic src="iran-gas-station" w={1080} x={540} y={960} enter="none" />
        <Counter x={905} y={950} size={58} from={0} to={1500} at={w(6, 'Fifteen')} dur={0.6} fmt={int} />
        <Txt x={905} y={1010} size={30} at={w(6, 'tomans')}>tomans / liter</Txt>
      </Scene>

      {/* 7 Is that a lot? spinning coin */}
      <Scene from={L(7).start} to={L(8).start}>
        <Live>{(t) => <At x={540} y={Y} at={L(7).start}><Coin w={340} label="?" spin={t * 7} /></At>}</Live>
      </Scene>

      {/* 8 Less than 3 cents */}
      <Scene from={L(8).start} to={L(9).start}>
        <Counter x={480} y={Y} size={200} color={C.green} from={4.41} to={0.03} at={L(8).start} dur={1.1} fmt={usd(2)} />
        <Txt x={480} y={Y + 150} size={50} at={L(8).start + 0.3}>per gallon</Txt>
        <At x={880} y={Y} at={w(8, 'three')}><Arrow w={170} color={C.green} rot={180} /></At>
      </Scene>

      {/* 9 Couch coins */}
      <Scene from={L(9).start} to={L(10).start}>
        <At x={540} y={Y + 150}><Cushion w={520} /></At>
        {[0, 1, 2].map((i) => <Live key={i}>{(t) => { const a = w(9, 'couch') - 0.3 + i * 0.18; const p = pop(t, a);
          return t < a ? null : <At x={380 + i * 160} y={Y + 110 - 230 * p}><Coin w={120} spin={t * 5 + i} /></At>; }}</Live>)}
      </Scene>

      {/* 10 Fuel card rejected → quota fills to 60 L → 10,000 tomans */}
      <Scene from={L(10).start} to={L(12).start}>
        <At x={540} y={Y} at={w(10, 'locals')} until={w(10, 'sixty')}><Live>{(t) => <Card w={560} label="FUEL CARD" color={C.green} rejected={ramp(t, w(10, 'card'), w(10, 'card') + 0.3)} />}</Live></At>
        <At x={330} y={Y} at={w(10, 'sixty')}><Live>{(t) => <JerryCan w={260} fill={ramp(t, w(10, 'sixty'), L(10).end)} />}</Live></At>
        <Live>{(t) => t < w(10, 'sixty') ? null : <Txt x={330} y={Y + 210} size={50}>{`${Math.round(60 * ramp(t, w(10, 'sixty'), L(10).end))} L / month`}</Txt>}</Live>
        <At x={730} y={Y - 40} enter="drop" at={w(11, 'ten')}><Tag text="10,000" color={C.red} w={330} /></At>
        <At x={730} y={Y + 150} at={w(11, 'ten') + 0.2}><Arrow w={120} /></At>
      </Scene>

      {/* 11 Still cheap */}
      <Scene from={L(12).start} to={L(13).start}>
        <At x={540} y={Y}><Stack w={420} n={6} /></At>
        <At x={540} y={Y - 30}><Sparkles w={520} at={L(12).start} /></At>
      </Scene>

      {/* 12 Who pays? card 1 → government below cost */}
      <Scene from={L(13).start} to={L(15).start}>
        <At x={300} y={Y} at={L(13).start}><FlipCard w={360} h={460} at={w(14, 'government')}><Img src={staticFile('gen/government-office.jpg')} style={{width: 320, mixBlendMode: 'multiply'}} /></FlipCard></At>
        <At x={780} y={Y} at={L(13).start + 0.1}><FlipCard w={360} h={460} at={99}>?</FlipCard></At>
        <At x={300} y={Y + 260} enter="drop" at={w(14, 'below')}><Tag text="BELOW COST" color={C.red} w={300} /></At>
      </Scene>

      {/* 13 Card 2 → scale: $1 outweighs a mountain of rials, rials crack */}
      <Scene from={L(15).start} to={L(17).start}>
        <At x={780} y={Y} until={w(15, 'money') + 0.3}><FlipCard w={360} h={460} at={w(15, 'money')}>$</FlipCard></At>
        <At x={540} y={Y + 20} at={w(15, 'money') + 0.3}><Live>{(t) => <Scale w={820} tilt={ramp(t, w(15, 'one dollar'), w(15, 'one dollar') + 0.8, 0, 14)}
          left={<Bill w={200} label="$1" />} right={<Stack w={260} n={ramp(t, w(15, 'two million') - 0.5, w(15, 'two million') + 0.6, 2, 14)} label="RIALS" />} />}</Live></At>
        <At x={760} y={Y - 90} at={w(16, 'broken')} enter="none"><Live>{(t) => <Crack w={240} p={ramp(t, w(16, 'broken'), w(16, 'broken') + 0.4)} />}</Live></At>
      </Scene>

      {/* 14 America: world price + bar stack */}
      <Scene from={L(17).start} to={L(18).start}>
        <At x={290} y={Y} at={w(17, 'America')}><Live>{(t) => <Globe w={360} spin={t} />}</Live></At>
        <At x={290} y={Y + 200} enter="drop" at={w(17, 'world')}><Tag text="WORLD" color={C.gold} w={260} /></At>
        <At x={780} y={Y}><BarStack h={560} w={260} segs={[['crude oil', 0.52, '#3B3B3B', w(17, 'world')], ['refining', 0.22, '#7A7A7A', w(17, 'refining')], ['trucks', 0.15, C.gold, w(17, 'trucks')], ['taxes', 0.11, C.red, w(17, 'taxes')]]} /></At>
      </Scene>

      {/* 15 $66 = 145,000,000 rials, money grows */}
      <Scene from={L(18).start} to={L(20).start}>
        <Txt x={540} y={Y - 230} size={90} color={C.green} at={w(18, 'sixty')}>$66 =</Txt>
        <Counter x={540} y={Y - 110} size={100} color={C.green} from={0} to={145000000} at={w(18, 'hundred')} dur={2.2} fmt={int} />
        <At x={540} y={Y + 60} at={w(18, 'hundred')}><Live>{(t) => <Stack w={460} n={ramp(t, w(18, 'hundred'), L(18).end, 1, 24)} />}</Live></At>
        <At x={540} y={Y + 60} at={L(19).start}><Sparkles w={700} at={L(19).start} /></At>
      </Scene>

      {/* 16 Texas: full-frame car, gauge drops to E */}
      <Scene from={L(20).start} to={L(21).start}>
        <Pic src="benny-tired-driving" w={1080} x={540} y={1060} enter="none" shakeAt={[53.4, w(20, 'empty')]} />
        <At x={540} y={360} at={w(20, 'Texas')}><Live>{(t) => <Gauge w={480} level={ramp(t, w(20, 'Texas'), w(20, 'empty') + 0.3, 0.6, 0)} />}</Live></At>
      </Scene>

      {/* 17 Green land vs cracked land */}
      <Scene from={L(21).start} to={GAS_IRAN_SECONDS}>
        <At x={280} y={Y} enter="slideL" at={L(21).start}><Land kind="green" label="$66 GAS" w={500} /></At>
        <At x={800} y={Y} enter="slideR" at={w(21, 'broken')}><Land kind="cracked" label="BROKEN MONEY" w={500} /></At>
      </Scene>

      {/* Benny narrator layer (bottom half) */}
      <Scene from={0} to={GAS_IRAN_SECONDS} overlay>
        <Benny poses={[[0, 'benny-worried'], [L(2).start, 'benny-shocked'], [L(3).start, 'benny-pointing'], [L(4).start, 'benny-sad-02'], [L(5).start, 'benny-angry'],
          [L(6).start, null], [L(7).start, 'benny-thinking-03'], [L(8).start, 'benny-shocked'], [L(9).start, 'benny-relaxed'], [L(10).start, 'benny-worried'],
          [L(12).start, 'benny-excited'], [L(13).start, 'benny-thinking-03'], [L(14).start, 'benny-front'], [w(15, 'one dollar'), 'benny-shocked'], [L(16).start, 'benny-thinking-03'],
          [L(17).start, 'benny-pointing'], [L(18).start, 'benny-front'], [L(19).start, 'benny-excited'], [L(20).start, null], [L(21).start, 'benny-front']]} />
        <Words end={GAS_IRAN_SECONDS} items={[
          [0, 'WHY?'], [w(1, 'sixty'), '$66', C.red], [w(2, 'Iran'), 'IRAN', C.green], [w(2, 'gum'), 'GUM'],
          [L(3).start, 'OKAY.'], [w(3, 'Iran'), 'TO IRAN'], [L(4).start, 'LAST FILL-UP'], [w(4, 'Four'), '$4.41', C.red],
          [L(5).start, '$66!', C.red], [w(5, 'dinosaurs'), 'DINOSAURS'], [L(6).start, ''], [L(7).start, 'A LOT?'], [w(8, 'three'), '3¢', C.green],
          [w(9, 'couch'), 'COUCH'], [w(10, 'locals'), 'LOCALS'], [w(10, 'card'), 'FUEL CARD'], [w(10, 'sixty'), '60 LITERS'], [w(11, 'ten'), '10,000', C.red],
          [L(12).start, 'STILL CHEAP!', C.green], [L(13).start, 'WHO PAYS?'], [w(14, 'government'), 'GOVERNMENT'], [w(14, 'below'), 'BELOW COST', C.red],
          [w(15, 'money'), 'THE MONEY'], [w(15, 'one dollar'), '$1', C.green], [w(15, 'two million'), '2,000,000+'], [w(16, 'broken'), 'BROKEN', C.red],
          [w(17, 'America'), 'AMERICA'], [w(17, 'world'), 'WORLD PRICE'], [w(17, 'refining'), 'REFINING'], [w(17, 'trucks'), 'TRUCKS'], [w(17, 'taxes'), 'TAXES', C.red],
          [w(18, 'twist'), 'TWIST'], [w(18, 'hundred'), 'RIALS', C.green], [w(19, 'millionaire'), 'MILLIONAIRE', C.green], [L(20).start, ''],
          [w(21, 'Expensive'), 'EXPENSIVE GAS', C.red], [w(21, 'broken'), 'BROKEN MONEY', C.red], [w(21, 'Which'), 'WHICH IS WORSE?'], [w(21, 'Comment'), 'COMMENT ↓']]} />
        <Txt x={120} y={215} size={50} color={C.red} rot={-8} until={w(14, 'government')}>WHY?</Txt>
      </Scene>
    </Camera>

    {/* SFX (quiet; narration stays on top) */}
    <Sfx at={0} name="hum" vol={0.25} /><Sfx at={2.45} name="ding" vol={0.4} />
    <Sfx at={L(2).start} name="whoosh" /><Sfx at={w(2, 'Iran')} name="whoosh" /><Sfx at={w(2, 'gum')} name="record-scratch" vol={0.6} />
    <Sfx at={L(3).start + 0.2} name="whoosh" vol={0.6} /><Sfx at={w(4, 'Four')} name="thud" /><Sfx at={w(4, 'Four') + 0.1} name="coins" vol={0.35} />
    <Sfx at={w(5, 'bucks')} name="impact" vol={0.4} /><Sfx at={w(5, 'dinosaurs')} name="roar" vol={0.4} />
    <Sfx at={L(6).start} name="whoosh" /><Sfx at={L(6).start + 1.3} name="thud" /><Sfx at={w(6, 'Fifteen')} name="tick" vol={0.3} />
    <Sfx at={L(7).start} name="boing" vol={0.4} /><Sfx at={w(8, 'three')} name="impact" vol={0.5} /><Sfx at={w(9, 'couch') - 0.3} name="coins" vol={0.4} />
    <Sfx at={w(10, 'card')} name="error" vol={0.35} /><Sfx at={w(10, 'sixty')} name="riser" vol={0.2} /><Sfx at={w(11, 'ten')} name="spring" vol={0.4} />
    <Sfx at={L(12).start} name="cha-ching" vol={0.45} /><Sfx at={L(13).start} name="riser" vol={0.25} /><Sfx at={w(14, 'government')} name="flip" />
    <Sfx at={w(14, 'below')} name="thud" /><Sfx at={w(15, 'money')} name="flip" /><Sfx at={w(15, 'one dollar')} name="thud" /><Sfx at={w(16, 'broken')} name="crack" vol={0.5} />
    <Sfx at={w(17, 'world')} name="thud" /><Sfx at={w(17, 'refining')} name="thud" /><Sfx at={w(17, 'trucks')} name="thud" /><Sfx at={w(17, 'taxes')} name="thud" />
    <Sfx at={w(18, 'hundred')} name="tick" vol={0.25} /><Sfx at={w(18, 'hundred') + 0.8} name="tick" vol={0.25} /><Sfx at={L(19).start} name="cash-rain" vol={0.5} />
    <Sfx at={53.2} name="sputter" vol={0.4} /><Sfx at={w(20, 'empty')} name="sad-horn" vol={0.3} />
    <Sfx at={L(21).start} name="whoosh" /><Sfx at={w(21, 'broken')} name="whoosh" /><Sfx at={w(21, 'Which')} name="boing" vol={0.3} />
  </AbsoluteFill>
);
