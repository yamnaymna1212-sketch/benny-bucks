// Grid-style test: ambulance lines 1–2 rebuilt in the reference look (moving Benny, graph paper, fast shots).
import React from 'react';
import {C, wordTimer} from '../engine';
import {FlagUS} from '../collage';
import {DrawArrow} from '../draw';
import {CollageVideo, LineFn, K} from '../collageVideo';
import {GridField, AnimBenny, Word, Banner, PriceTag, Obj} from '../grid';
import {Ambulance} from './ambulanceProps';
import ALL from '../data/grid-test.json';

const TIM = ALL.slice(0, 2);
const W = wordTimer(TIM);
const FlagJP = ({w = 170}: {w?: number}) => <svg width={w} height={w * 0.66} viewBox="0 0 150 100"><rect width="150" height="100" fill="#fff" stroke="#ccc" strokeWidth="3" /><circle cx="75" cy="50" r="30" fill="#BC002D" /></svg>;

const lines: LineFn[] = [
  ({at}) => <><GridField />
    <Banner at={at} y={170} />
    <Obj x={230} y={360} at={at} rot={-4}><FlagUS w={170} /></Obj><Obj x={850} y={360} at={at} rot={4}><FlagJP /></Obj>
    <PriceTag price="$1,277" unit="AMBULANCE RIDE" x={240} y={560} at={at} color={C.red} size={88} />
    <PriceTag price="$0" unit="AMBULANCE RIDE" x={840} y={560} at={at} color={C.green} size={88} />
    <Obj x={240} y={790} at={at}><Ambulance w={380} /></Obj><Obj x={840} y={790} at={at}><Ambulance w={380} stripe="#E8742E" /></Obj>
    <DrawArrow from={[470, 1060]} to={[300, 680]} at={Math.max(1.2, W(1, 'America'))} color={C.red} />
    <DrawArrow from={[610, 1060]} to={[780, 680]} at={W(1, 'Japan')} color={C.red} />
    <AnimBenny clip="point-then-shocked" x={540} y={1400} h={980} at={at} play={1.2} /></>,
  ({at, w}) => <><GridField />
    <AnimBenny clip="long-receipt-facepalm" x={540} y={1330} h={1000} at={at} until={w('emergency')} />
    <Word text="$1,277" x={540} y={430} at={at} color={C.red} size={170} until={w('emergency')} />
    <Word text="AVERAGE" x={540} y={600} at={w('average')} color={C.ink} size={70} until={w('emergency')} rot={-3} />
    <Obj x={540} y={560} at={w('emergency')} until={w('Before')}><Ambulance w={720} /></Obj>
    <Word text="EMERGENCY" x={540} y={300} at={w('emergency')} color={C.red} italic size={100} until={w('Before')} />
    <AnimBenny clip="angry-point-crossarms" x={540} y={1380} h={900} at={w('emergency')} from={1} until={w('Before')} />
    <AnimBenny clip="reads-bill-upset" x={540} y={1330} h={1000} at={w('Before')} />
    <Word text="+ MILEAGE" x={540} y={460} at={w('mileage')} color={C.red} italic size={130} rot={-4} />
    <DrawArrow from={[820, 520]} to={[700, 880]} at={w('mileage') + 0.15} color="#F08A24" /></>,
];
const cams: K[][] = [
  [[0, 1, 540, 960], [1.2, 1, 540, 960], [W(1, 'America') + 0.4, 1.12, 380, 900], [W(1, 'Japan'), 1.12, 420, 900], [W(1, 'zero'), 1.12, 700, 900], [TIM[0].end, 1.12, 700, 900]],
  [[TIM[1].start, 1.08, 540, 900], [W(2, 'emergency'), 1.0, 540, 960], [W(2, 'Before'), 1.08, 540, 900]],
];
const sfx: [number, string][] = [[W(1, 'America'), 'whoosh'], [W(1, 'Japan'), 'whoosh'], [W(1, 'zero'), 'impact'], [W(2, 'average'), 'ding'], [W(2, 'emergency'), 'whoosh'], [W(2, 'mileage'), 'cha-ching']];

export const GRID_TEST_SECONDS = +(TIM[1].end + 0.9).toFixed(2); // = videoSeconds(TIM)
export const GridTest = () => <CollageVideo voice="voice-gridtest.mp3" tim={TIM} lines={lines} cams={cams} sfx={sfx} captionFill="#FFD43B" captionYs={[975, 790]} />;
