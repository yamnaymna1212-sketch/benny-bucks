// Ambulance: USA $1,277 vs Japan $0 — built with the benny-collage-edit system (CollageVideo).
import React from 'react';
import {C, wordTimer} from '../engine';
import {TornSplit, Field, Piece, Card, FlagUS} from '../collage';
import {CollageVideo, CollageSheet, LineFn, K, zoomTo, punchIn, videoSeconds} from '../collageVideo';
import {QMark} from './collegeProps';
import {Ambulance, LongBill, Shield, JackBox, Phone, Jar, CaliforniaMap, SplitBill, Hospital, DownArrow, Car} from './ambulanceProps';
import TIM from '../data/ambulance-japan.json';

const US = '#F6D3BC', JP = '#D2E7D3', CATCH = '#F5E3B5', DEBT = '#F4CFC6', CARD = '#FFFFFF';
const INK_US = '#D2461F', INK_JP = '#1F6B4A';
const FlagJP = ({w = 190}: {w?: number}) => <svg width={w} height={w * 0.66} viewBox="0 0 150 100"><rect width="150" height="100" fill="#fff" /><circle cx="75" cy="50" r="30" fill="#BC002D" /></svg>;
const Benny = ({pose, at, x = 540}: {pose: string; at: number; x?: number}) => <Piece x={x} y={1760} w={430} at={at} from="bottom" src={`benny-${pose}`} />;
const Split = ({at, us, jp, small}: {at: number; us: number; jp: number; small?: number}) => <>
  <TornSplit left={US} right={JP} at={at - 1} />
  <Piece x={270} y={250} w={180} at={at} from="top" rot={-5}><FlagUS w={180} /></Piece><Piece x={810} y={250} w={180} at={at} from="top" rot={5}><FlagJP w={180} /></Piece>
  <Piece x={270} y={600} w={440} at={us} from="left" rot={-3}><Ambulance w={440} /></Piece><Piece x={810} y={600} w={440} at={jp} from="right" rot={3}><Ambulance w={440} stripe="#E8742E" /></Piece>
  <Card text="$1,277" count x={270} y={950} at={us} hits={[us + 0.2]} from="pop" rot={-4} color={CARD} ink={INK_US} size={110} />
  <Card text="$0" x={810} y={950} at={jp} hits={[jp + 0.2]} from="pop" rot={4} color={CARD} ink={INK_JP} size={150} />
  {small !== undefined && <Card text="or $50" x={830} y={1120} at={small} from="pop" rot={-6} color={CATCH} ink={C.ink} size={56} />}
</>;

const lines: LineFn[] = [
  ({at}) => <><Split at={at} us={at} jp={at} /><Benny pose="shocked" at={at} /></>,
  ({at, w}) => <><Field color={US} />
    <Piece x={330} y={430} w={460} at={at} from="left"><Ambulance w={460} /></Piece>
    <Piece x={760} y={760} w={300} at={w('average')} from="top" rot={6}><LongBill w={300} /></Piece>
    <Card text="AVERAGE" x={330} y={780} at={w('average')} from="pop" rot={-5} color={C.ink} ink={CARD} size={60} />
    <Card text="+ MILEAGE" x={330} y={940} at={w('mileage')} from="left" rot={3} color={CARD} ink={INK_US} size={60} />
    <Benny pose="worried" at={at + 0.05} x={420} /></>,
  ({at, w}) => <><Field color={DEBT} />
    <Piece x={540} y={560} w={420} at={at} from="top"><Shield w={420} /></Piece>
    <Piece x={540} y={900} w={380} at={w('covered')} from="left" rot={-4}><Ambulance w={380} /></Piece>
    <Card text="NOT COVERED" x={540} y={1110} at={w('covered')} from="pop" rot={-4} color={C.red} ink="#fff" size={70} />
    <Benny pose="angry" at={at + 0.05} /></>,
  ({at, w}) => <><Field color={DEBT} />
    <Piece x={540} y={620} w={420} at={at} from="bottom" hits={[w('surprise')]}><JackBox w={420} /></Piece>
    <Card text="OUT OF NETWORK" x={540} y={1080} at={w('network')} from="pop" rot={3} color={CARD} ink={INK_US} size={64} />
    <Benny pose="shocked" at={at + 0.05} x={760} /></>,
  ({at, w}) => <><Field color={JP} />
    <Piece x={250} y={480} w={220} at={at} from="left" rot={-6} hits={[w('one-one-nine')]}><Phone w={220} /></Piece>
    <Piece x={720} y={430} w={420} at={w('ride')} from="right"><Ambulance w={420} stripe="#E8742E" /></Piece>
    <Card text="FREE" x={720} y={700} at={w('free')} from="pop" rot={4} color={INK_JP} ink={CARD} size={110} />
    <Piece x={330} y={960} w={240} at={w('taxes')} from="bottom" rot={-3}><Jar w={240} /></Piece>
    <Benny pose="excited" at={at + 0.05} x={760} /></>,
  ({at}) => <><TornSplit left={US} right={JP} at={at - 1} />
    <Piece x={540} y={640} w={420} at={at} from="pop" rot={-4}><QMark w={420} color={C.ink} /></Piece>
    <Benny pose="thinking-03" at={at + 0.05} /></>,
  ({at, w}) => <><Field color={CATCH} />
    <Card text="REASON #1" x={540} y={190} at={at} from="top" rot={-3} color={C.ink} ink={CARD} size={70} />
    <Piece x={380} y={640} w={320} at={w('state')} from="left" rot={-4}><CaliforniaMap w={320} /></Piece>
    <Card text="$1,461" count x={740} y={760} at={w('California')} hits={[w('fourteen')]} from="pop" rot={5} color={CARD} ink={INK_US} size={110} />
    <Benny pose="shocked" at={at + 0.05} x={760} /></>,
  ({at, w}) => <><Field color={CATCH} />
    <Card text="REASON #2" x={540} y={190} at={at} from="top" rot={3} color={C.ink} ink={CARD} size={70} />
    <Piece x={540} y={640} w={700} at={w('insurers')} from="top" hits={[w('rest')]}><SplitBill w={700} /></Piece>
    <Benny pose="sad-02" at={at + 0.05} /></>,
  ({at, w}) => <><Field color={JP} />
    <Card text="JAPAN'S CATCH" x={540} y={190} at={at} from="top" rot={-3} color={C.ink} ink={CARD} size={66} />
    <Piece x={540} y={560} w={480} at={at + 0.05} from="top"><Hospital w={480} /></Piece>
    <Card text="¥7,700 ≈ $50" x={540} y={900} at={w('seventy')} hits={[w('fifty')]} from="pop" rot={-4} color={CARD} ink={INK_JP} size={90} />
    <Card text="NOT ADMITTED" x={540} y={1060} at={w('admitted')} from="pop" rot={3} color={C.red} ink="#fff" size={56} />
    <Benny pose="thinking-03" at={at + 0.05} x={300} /></>,
  ({at, w}) => <><Field color={JP} />
    {[0, 1, 2].map((i) => <Piece key={i} x={250 + i * 70} y={520 - i * 40} w={180} at={at + i * 0.08} from="left" rot={-8 + i * 6}><Phone w={180} label="!" color={C.red} /></Piece>)}
    <Piece x={760} y={640} w={240} at={w('dropped')} from="top" hits={[w('ten')]}><DownArrow w={240} /></Piece>
    <Card text="MATSUSAKA" x={540} y={1060} at={w('Matsusaka')} from="pop" rot={-3} color={CARD} ink={INK_JP} size={64} />
    <Benny pose="relaxed" at={at + 0.05} x={320} /></>,
  ({at, w}) => <><Field color={US} />
    <Piece x={300} y={460} w={400} at={at} from="left"><Ambulance w={400} /></Piece>
    <Piece x={680} y={820} w={440} at={w('Uber')} from="right"><Car w={440} /></Piece>
    <Piece x={800} y={430} w={200} at={w('fell')} from="top" hits={[w('seven')]}><DownArrow w={200} label="−7%" color={INK_US} /></Piece>
    <Benny pose="pointing" at={at + 0.05} x={380} /></>,
  ({at, w}) => <Split at={at} us={at} jp={w('versus')} small={w('fifty')} />,
  ({at, w}) => <><TornSplit left={US} right={JP} at={at - 1} />
    <Piece x={270} y={560} w={420} at={at} from="left"><Ambulance w={420} /></Piece><Card text="911" x={270} y={860} at={at} from="pop" color={C.red} ink="#fff" size={110} />
    <Piece x={810} y={580} w={420} at={w('Uber')} from="right"><Car w={420} /></Piece><Card text="UBER?" x={810} y={860} at={w('Uber')} from="pop" color={C.ink} ink="#fff" size={110} />
    <Benny pose="front" at={at + 0.05} /></>,
];

const W = wordTimer(TIM);
const st = (k: number) => TIM[k - 1].start;
const cams: K[][] = [
  [[0, 1, 540, 960], ...zoomTo(Math.max(1.2, W(1, 'America')), 1.15, 330, 700, W(1, 'Japan') - 0.2).slice(0, 3), [W(1, 'Japan'), 1.15, 750, 700], [W(1, 'Why'), 1.15, 750, 700], [W(1, 'Why') + 0.2, 1, 540, 960]],
  punchIn(st(2), W(2, 'mileage'), 1.12, 540, 700),
  zoomTo(st(3) + 0.1, 1.15, 540, 560, W(3, 'covered')),
  punchIn(st(4), TIM[3].end, 1.12, 540, 620),
  [[st(5), 1.15, 300, 500], [W(5, 'ride'), 1.15, 300, 500], [W(5, 'ride') + 0.2, 1.15, 720, 500], [W(5, 'taxes'), 1.15, 720, 500], [W(5, 'taxes') + 0.2, 1, 540, 960]],
  [[st(6), 1.15, 540, 700], [st(6) + 0.25, 1, 540, 960]],
  zoomTo(W(7, 'state'), 1.15, 380, 640, W(7, 'California')),
  [[st(8), 1, 540, 960], [W(8, 'allow'), 1.15, 380, 640], [W(8, 'rest'), 1.15, 380, 640], [W(8, 'rest') + 0.2, 1.15, 720, 640]],
  punchIn(W(9, 'seventy'), TIM[8].end, 1.12, 540, 800),
  zoomTo(W(10, 'dropped'), 1.15, 700, 640),
  [[st(11), 1.15, 320, 500], [W(11, 'Uber'), 1.15, 320, 500], [W(11, 'Uber') + 0.2, 1.15, 700, 760]],
  [[st(12), 1.15, 330, 700], [W(12, 'versus'), 1.15, 330, 700], [W(12, 'versus') + 0.2, 1.15, 750, 700]],
  punchIn(st(13), TIM[12].end, 1.1, 540, 900),
];
const sfx: [number, string][] = [
  [W(1, 'America'), 'whoosh'], [W(1, 'twelve'), 'cha-ching'], [W(1, 'Japan'), 'whoosh'], [W(1, 'zero'), 'impact'],
  [W(2, 'average'), 'ding'], [W(2, 'mileage'), 'cha-ching'], [st(3), 'record-scratch'], [W(3, 'covered'), 'thud'],
  [W(4, 'surprise'), 'boing'], [W(4, 'bill'), 'cha-ching'], [W(5, 'one-one-nine'), 'pop'], [W(5, 'ride'), 'whoosh'], [W(5, 'free'), 'ding'], [W(5, 'taxes'), 'coins'],
  [st(6), 'whoosh'], [st(7), 'record-scratch'], [W(7, 'fourteen'), 'cha-ching'], [st(8), 'record-scratch'], [W(8, 'seven'), 'cha-ching'], [W(8, 'rest'), 'error'],
  [st(9), 'record-scratch'], [W(9, 'seventy'), 'coins'], [W(10, 'dropped'), 'whoosh'], [W(10, 'ten'), 'ding'],
  [W(11, 'Uber'), 'whoosh'], [W(11, 'seven'), 'ding'], [W(12, 'Twelve'), 'cha-ching'], [W(12, 'versus'), 'whoosh'], [W(12, 'zero'), 'impact'], [W(12, 'fifty'), 'pop'],
  [st(13), 'whoosh'], [W(13, 'Comment'), 'pop'],
];

export const AMBULANCE_SECONDS = videoSeconds(TIM);
export const AmbulanceVideo = () => <CollageVideo voice="voice-ambulance.mp3" tim={TIM} lines={lines} cams={cams} sfx={sfx} />;
export const AMBULANCE_SHEET_FRAMES = lines.length;
export const AmbulanceSheet = () => <CollageSheet lines={lines} />;
