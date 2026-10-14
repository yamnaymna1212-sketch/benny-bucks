import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {At, Benny, C, Camera, Counter, Fonts, Scene, Sfx, Txt, ramp, useT, wordTimer} from '../engine';
import {Arrow, BarStack, BigHouse, Card, Coin, Duplex, Furnace, GroceryBag, Noodles, Tag} from '../props';
import {DrawArrow, DrawCircle} from '../draw';
import {FlipCal, GridPaper, HandFont, OutlineCaptions, SketchBox, Stamp, Write} from '../sketch';
import lines from '../data/house.json';

const w = wordTimer(lines);
const L = (n: number) => lines[n - 1];
export const HOUSE_SECONDS = +(lines[lines.length - 1].end + 0.7).toFixed(2);
const Live = ({children}: {children: (t: number) => React.ReactNode}) => <>{children(useT())}</>;
const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const Y = 560; // top illustration band center
const RED_HL = '#F2A7A0', GREEN_HL = '#A9D8A0';
const BEN_END = L(8).start, RICK_END = L(15).start;

export const House = () => (
  <AbsoluteFill>
    <Fonts /><HandFont />
    <GridPaper />
    <Audio src={staticFile('voice-house.mp3')} />
    <Camera punch={[w(2, 'approved'), w(5, 'three thousand'), w(6, 'dies'), w(7, 'house poor'), w(11, 'payment'), w(12, 'thousand')]} shake={[w(6, 'dies'), w(14, 'leaks')]}>
      <Scene from={0} to={HOUSE_SECONDS} overlay>

        {/* 1 HOOK (reference layout): title written live, POOR / RICH labels over Benny and Rick, house sketch between */}
        <Write text="How" x={170} y={300} at={0} dur={0.18} size={92} pencil={false} until={L(2).start} />
        <Write text="Poor" x={400} y={300} at={w(1, 'poor')} dur={0.25} size={92} color={C.red} highlight={RED_HL} until={L(2).start} />
        <Write text="vs" x={590} y={300} at={w(1, 'versus')} dur={0.15} size={80} pencil={false} until={L(2).start} />
        <Write text="Rich" x={790} y={300} at={w(1, 'rich')} dur={0.25} size={92} color={C.green} highlight={GREEN_HL} until={L(2).start} />
        <Write text="People Buy A House" x={540} y={430} at={w(1, 'people')} dur={0.45} size={78} under={C.ink} until={L(2).start} />
        <Write text="POOR" x={230} y={600} at={w(1, 'poor') + 0.1} dur={0.25} size={70} color={C.red} under={C.red} pencil={false} until={L(2).start} />
        <Write text="RICH" x={850} y={600} at={w(1, 'rich') + 0.1} dur={0.25} size={70} color={C.green} under={C.green} pencil={false} until={L(2).start} />
        <Live>{(t) => t >= w(1, 'house') && t < L(2).start ? <SketchBox x={540} y={1330} w={190} h={150} at={w(1, 'house')} drawDur={0.2}><div style={{fontSize: 0}} /></SketchBox> : null}</Live>
        <Live>{(t) => t >= w(1, 'house') && t < L(2).start ? <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}><path d="M430 1255 L540 1180 L650 1255" stroke={C.ink} strokeWidth={5} fill="#C98B6B" /></svg> : null}</Live>
        <Benny cw={300} x={230} headY={700} poses={[[0, 'benny-front'], [L(2).start, null]]} />
        <Benny cw={290} x={850} headY={700} poses={[[w(1, 'rich'), 'rich-front'], [L(2).start, null]]} />

        {/* Section headers */}
        <Write text="BENNY" x={180} y={250} at={L(2).start} dur={0.35} size={56} highlight={RED_HL} pencil={false} until={BEN_END} />
        <Write text="RICK" x={900} y={250} at={L(8).start} dur={0.3} size={56} highlight={GREEN_HL} pencil={false} until={RICK_END} />

        {/* 2 Benny saves for years → approved $400,000 */}
        <FlipCal x={640} y={560} w={300} label="SAVING" items={[[w(2, 'saves'), '2026'], [w(2, 'for'), '2027'], [w(2, 'years'), '2028'], [w(2, 'The bank') - 0.2, '2029']]} until={w(2, 'The bank')} />
        <Live>{(t) => t >= w(2, 'The bank') && t < L(3).start ? <>
          <SketchBox x={640} y={560} w={420} h={470} at={w(2, 'The bank')} drawDur={0.3}><div style={{width: 380, height: 430}} /></SketchBox>
          <Write text="LOAN LETTER" x={640} y={400} at={w(2, 'The bank') + 0.3} dur={0.45} size={44} />
          <Write text="$400,000" x={640} y={540} at={w(2, 'four')} dur={0.6} size={76} color={C.green} />
          <Stamp x={640} y={680} at={w(2, 'thousand') + 0.2} until={L(3).start} size={52} />
        </> : null}</Live>

        {/* 3 Biggest house: 4 bed, 2-car garage */}
        <At x={600} y={Y} at={w(3, 'biggest')} until={L(4).start}><BigHouse w={600} /></At>
        <At x={800} y={1250} at={w(3, 'Four')} until={L(4).start} enter="drop"><Tag text="4 BED" color={C.gold} w={270} /></At>
        <At x={800} y={1400} at={w(3, 'Two-car')} until={L(4).start} enter="drop"><Tag text="2-CAR" color={C.gold} w={270} /></At>

        {/* 4 Bank sees pay before taxes, not groceries */}
        <Write text="PAY BEFORE TAXES" x={600} y={420} at={L(4).start + 0.1} dur={0.5} size={58} under={C.green} until={L(5).start} />
        <At x={600} y={650} at={w(4, 'pay')} until={L(5).start}><GroceryBag w={230} /></At>
        <Live>{(t) => t >= w(4, 'Not') && t < L(5).start ? <DrawCircle x={600} y={650} rx={150} ry={150} at={w(4, 'grocery')} color={C.red} /> : null}</Live>
        <Txt x={820} y={650} size={60} color={C.red} at={w(4, 'bill')} until={L(5).start}>NOT SEEN</Txt>

        {/* 5 Payment > half of take-home: bar fills */}
        <Write text="TAKE-HOME PAY" x={600} y={290} at={L(5).start} dur={0.4} size={44} pencil={false} until={L(6).start} />
        <At x={600} y={Y + 40} at={L(5).start} until={L(6).start}><BarStack h={480} w={300} segs={[['house', 0.56, C.red, w(5, 'More')], ['', 0.44, '#E9E4D8', L(5).start + 0.1]]} /></At>
        <Counter x={800} y={1300} size={84} color={C.red} from={0} to={3000} at={w(5, 'three thousand')} dur={0.6} fmt={(n) => usd(n) + '+'} until={L(6).start} />
        <Txt x={800} y={1390} size={40} at={w(5, 'month')} until={L(6).start}>per month</Txt>

        {/* 6 Furnace dies → $6,000 on a credit card */}
        <At x={500} y={Y} at={L(6).start} until={L(7).start} shakeAt={[w(6, 'dies')]}><Live>{(t) => <Furnace w={250} broken={ramp(t, w(6, 'dies'), w(6, 'dies') + 0.6)} />}</Live></At>
        <At x={800} y={Y - 60} at={w(6, 'Six')} until={L(7).start} enter="slideR"><Card w={280} label="CREDIT" color={C.blue} /></At>
        <Counter x={800} y={Y + 140} size={80} color={C.red} from={0} to={6000} at={w(6, 'Six')} dur={0.6} fmt={usd} until={L(7).start} />

        {/* 7 Noodles on the floor → HOUSE POOR stamp */}
        <At x={620} y={Y - 40} at={L(7).start} until={L(8).start}><BigHouse w={460} /></At>
        <At x={790} y={1330} at={w(7, 'noodles')} until={L(8).start}><Noodles w={260} /></At>
        <Stamp x={600} y={Y + 200} at={w(7, 'house poor')} until={L(8).start} text="HOUSE POOR" size={66} />

        {/* 8 Rick: same letter → duplex */}
        <Live>{(t) => t >= L(8).start && t < w(8, 'duplex') ? <>
          <SketchBox x={440} y={560} w={420} h={470} at={L(8).start} drawDur={0.3}><div style={{width: 380, height: 430}} /></SketchBox>
          <Write text="$400,000" x={440} y={540} at={L(8).start + 0.3} dur={0.4} size={72} color={C.green} />
          <Stamp x={440} y={680} at={w(8, 'approval') + 0.1} until={w(8, 'duplex')} size={50} />
        </> : null}</Live>
        <At x={440} y={Y} at={w(8, 'duplex')} until={L(14).start}><Live>{(t) => <Duplex w={540}
          left={t >= w(9, 'lives') ? (t >= L(13).start ? 'RENTED' : 'RICK') : undefined}
          right={t >= w(11, 'rents') ? 'RENTED' : undefined} />}</Live></At>
        <Write text="2 HOMES, 1 BUILDING" x={440} y={880} at={w(8, 'Two homes')} dur={0.5} size={42} pencil={false} until={L(9).start} />

        {/* 9 FHA loan, 3.5% down */}
        <At x={200} y={1260} at={w(9, 'FHA')} until={L(10).start} enter="drop"><Tag text="FHA LOAN" color={C.gold} w={300} /></At>
        <Counter x={200} y={1400} size={70} color={C.green} from={0} to={3.5} at={w(9, 'Three')} dur={0.5} fmt={(n) => n.toFixed(1) + '% DOWN'} until={L(10).start} />

        {/* 10 $300k → $10,500 down */}
        <Write text="$300,000" x={230} y={1250} at={w(10, 'three-hundred')} dur={0.45} size={60} until={L(11).start} />
        <Counter x={230} y={1370} size={66} color={C.green} from={0} to={10500} at={w(10, 'ten')} dur={0.6} fmt={(n) => '↓ ' + usd(n)} until={L(11).start} />
        <Txt x={230} y={1450} size={34} at={w(10, 'closing')} until={L(11).start}>+ closing costs</Txt>

        {/* 11-12 Renter pays $1,500 of the ~$2,500 payment → Rick pays ~$1,000 */}
        {[0, 1, 2].map((i) => <Live key={i}>{(t) => { const a = w(11, 'fifteen') + i * 0.25; if (t < a || t >= L(13).start) return null; const p = ((t - a) / 0.9) % 1;
          return <At x={590 - 280 * p} y={Y - 170 - 70 * Math.sin(p * Math.PI)}><Coin w={70} label="$" spin={t * 6} /></At>; }}</Live>)}
        <Live>{(t) => t >= w(11, 'payment') && t < L(13).start ? <At x={200} y={1290}><BarStack h={380} w={250} segs={[['RENTER $1.5K', 0.6, C.blue, w(11, 'payment')], ['RICK', 0.4, C.green, w(12, 'lives')]]} /></At> : null}</Live>
        <Txt x={200} y={1060} size={40} at={w(11, 'payment')} until={L(13).start}>≈ $2,500 / mo</Txt>
        <Counter x={540} y={1300} size={70} color={C.green} from={2500} to={1000} at={w(12, 'thousand')} dur={0.6} fmt={(n) => '≈ ' + usd(n)} until={L(13).start} />
        <Txt x={540} y={1390} size={32} at={w(12, 'Less')} until={L(13).start}>{'1-BR apt ≈ $1,518'}</Txt>

        {/* 13 A year later, rent both sides */}
        <FlipCal x={200} y={1280} w={260} label="A YEAR LATER" color={C.green} items={[[L(13).start, 'YEAR 2']]} until={L(14).start} />

        {/* 14 Risk: renter leaves / roof leaks */}
        <At x={440} y={Y} at={L(14).start} until={RICK_END}><Live>{(t) => <Duplex w={540} left="EMPTY" right="RENTED" leak={t >= w(14, 'roof') ? t : 0} />}</Live></At>
        <Write text="LANDLORD = A JOB" x={300} y={1300} at={w(14, 'Being')} dur={0.6} size={46} under={C.red} until={RICK_END} />

        {/* 15 Final split: same bank, opposite house */}
        <Write text="SAME BANK" x={540} y={300} at={L(15).start} dur={0.4} size={64} until={HOUSE_SECONDS} />
        <At x={260} y={600} at={w(15, 'Opposite')} enter="slideL"><BigHouse w={420} /></At>
        <At x={820} y={600} at={w(15, 'Opposite') + 0.1} enter="slideR"><Duplex w={400} /></At>
        <Write text="OPPOSITE HOUSE" x={540} y={830} at={w(15, 'Opposite')} dur={0.45} size={52} highlight="#FDE9B5" pencil={false} />

        {/* Characters (bottom). Benny left during his story, Rick right during his, both at title and end. */}
        <Benny cw={380} x={270} headY={1060} poses={[[0, null], [L(2).start, 'benny-saving-cash'], [w(2, 'approved'), 'benny-excited'], [L(3).start, 'benny-pointing'],
          [L(4).start, 'benny-thinking-03'], [L(5).start, 'benny-shocked'], [L(6).start, 'benny-worried'], [L(7).start, 'benny-sad-02'], [BEN_END, null], [L(15).start, 'benny-sad-02']]} />
        <Benny cw={360} x={820} headY={1060} poses={[[0, null], [L(8).start, 'rich-front'], [w(8, 'duplex'), 'rich-holding-house'], [L(9).start, 'rich-idea-finger'],
          [L(10).start, 'rich-cash-fan'], [L(11).start, 'rich-pointing-chart'], [L(12).start, 'rich-thumbs-up'], [L(13).start, 'rich-airplane'], [L(14).start, 'rich-stressed-paperwork'],
          [L(15).start, 'rich-front']]} />

        <Live>{(t) => <OutlineCaptions lines={lines} end={HOUSE_SECONDS} y={t < L(2).start ? 1150 : 955} size={t < L(2).start ? 52 : 66} />}</Live>
      </Scene>
    </Camera>

    <Sfx at={0.02} name="impact" vol={0.5} /><Sfx at={w(1, 'poor')} name="pop" /><Sfx at={w(1, 'rich')} name="cha-ching" vol={0.35} /><Sfx at={w(1, 'house')} name="tick" vol={0.4} />
    <Sfx at={w(2, 'saves')} name="flip" /><Sfx at={w(2, 'years')} name="flip" /><Sfx at={w(2, 'thousand') + 0.2} name="impact" vol={0.55} />
    <Sfx at={w(3, 'biggest')} name="pop" /><Sfx at={w(3, 'Four')} name="thud" /><Sfx at={w(3, 'Two-car')} name="thud" />
    <Sfx at={w(4, 'Not')} name="record-scratch" vol={0.45} /><Sfx at={w(5, 'More')} name="riser" vol={0.2} /><Sfx at={w(5, 'three thousand')} name="impact" vol={0.45} />
    <Sfx at={w(6, 'dies')} name="crack" vol={0.5} /><Sfx at={w(6, 'Six')} name="error" vol={0.3} /><Sfx at={w(7, 'house poor')} name="impact" vol={0.55} /><Sfx at={w(7, 'house poor') + 0.1} name="sad-horn" vol={0.2} />
    <Sfx at={L(8).start} name="whoosh" /><Sfx at={w(8, 'approval') + 0.1} name="impact" vol={0.45} /><Sfx at={w(8, 'duplex')} name="pop" />
    <Sfx at={w(9, 'FHA')} name="thud" /><Sfx at={w(10, 'ten')} name="tick" vol={0.4} /><Sfx at={w(11, 'fifteen')} name="coins" vol={0.35} />
    <Sfx at={w(12, 'thousand')} name="cha-ching" vol={0.4} /><Sfx at={L(13).start} name="flip" /><Sfx at={L(13).start + 0.2} name="whoosh" />
    <Sfx at={w(14, 'leaks')} name="error" vol={0.3} /><Sfx at={L(15).start} name="whoosh" /><Sfx at={w(15, 'Opposite')} name="whoosh" /><Sfx at={w(15, 'Which')} name="boing" vol={0.3} />
  </AbsoluteFill>
);
