// How poor vs rich people buy a house — v2 in the saved format. Hook copies the user's reference frame:
// handwritten title with red "Poor" / green "Rich" highlights, POOR (Benny) left, RICH (Rick) right, small house in the middle.
import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, wordTimer, useT, ramp} from '../engine';
import {DrawArrow} from '../draw';
import {Write, HandFont} from '../sketch';
import {CollageVideo, CollageSheet, LineFn, K} from '../collageVideo';
import {GridField, AnimBenny, Word, PriceTag, Obj} from '../grid';
import {IconArt} from '../icons';
import {House, Building} from '../props';
import TIM from '../data/house-v2.json';

const G = '#1E9E4A', R = '#D7261E', GOLD = '#D9A400', HR = '#E8584A', HG = '#4CAF50';
const Pic = ({src, x = 540, y = 1440, w = 520, at, until}: {src: string; x?: number; y?: number; w?: number; at: number; until?: number}) =>
  <Obj x={x} y={y} at={at} until={until}><Img src={staticFile(`gen/${src}.png`)} style={{width: w, display: 'block'}} /></Obj>;
const Rick = (p: {pose: string; at: number; until?: number; x?: number; y?: number; w?: number}) => <Pic src={`rich-${p.pose}`} {...p} />;
const B = (p: {clip: string; at: number; until?: number; from?: number; x?: number; flip?: boolean}) => <AnimBenny x={p.x ?? 540} y={1460} h={980} {...p} />;
const Ic = ({id, x = 540, y = 700, size = 300, at, until}: {id: string; x?: number; y?: number; size?: number; at: number; until?: number}) =>
  <Obj x={x} y={y} at={at} until={until}><IconArt id={id} size={size} /></Obj>;
const Line = ({x1, x2, y, color, at}: {x1: number; x2: number; y: number; color: string; at: number}) => {
  const t = useT(); if (t < at) return null;
  return <div style={{position: 'absolute', left: x1, top: y, width: (x2 - x1) * ramp(t, at, at + 0.25), height: 8, background: color, borderRadius: 4}} />;
};
const W = (l: number, w: string) => wordTimer(TIM)(l, w);

const lines: LineFn[] = [
  ({at}) => <><GridField /><HandFont />
    <Write text="How" x={135} y={250} at={at} size={110} pencil={false} />
    <Write text="Poor" x={390} y={250} at={at} size={110} pencil={false} highlight={HR} color={R} />
    <Write text="Vs" x={625} y={250} at={at} size={110} pencil={false} />
    <Write text="Rich" x={860} y={250} at={at} size={110} pencil={false} highlight={HG} color={G} />
    <Write text="People Buy" x={540} y={390} at={at} size={120} pencil={false} />
    <Write text="A House" x={540} y={520} at={at} size={120} pencil={false} />
    <Line x1={330} x2={750} y={590} color={C.ink} at={at} />
    <AnimBenny clip="reads-bill-upset" x={220} y={1010} h={700} at={at} play={0} />
    <Rick pose="front" x={860} y={1010} w={480} at={at} />
    <Pic src="house-modern-cut" x={540} y={1610} w={560} at={at} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="$430,000" unit="ZILLOW LISTING" x={540} y={330} at={w('four')} color={C.ink} size={130} />
    <Pic src="house-modern-cut" x={540} y={720} w={560} at={w('house')} />
    <Obj x={890} y={520} at={w('Zillow')}><IconArt id="brand:siZillow" size={150} /></Obj>
    <B clip="phone-shock-idea" at={at} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="5% DOWN" x={540} y={330} at={w('five')} color={C.ink} size={110} />
    <Word text="$21,500" x={540} y={520} at={w('Twenty-one')} color={R} size={150} stroke />
    <Word text="everything he saved" x={540} y={680} at={w('Everything')} color={C.ink} size={70} italic />
    <B clip="throws-paper-falls" at={w('Everything')} />
    <Ic id="doodle:PiggyBank" x={540} y={1300} size={260} at={at} until={w('Everything')} /></>,
  ({at, w}) => <><GridField />
    <Pic src="bank" y={620} w={460} at={at} />
    <Word text="30 YEARS · 7%" x={540} y={330} at={w('Thirty')} color={R} size={110} stroke />
    <B clip="reads-bill-upset" at={at} x={540} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="$2,700" unit="EVERY MONTH" x={540} y={400} at={w('twenty-seven')} color={R} size={170} />
    <Word text="+ taxes + insurance" x={540} y={620} at={w('Before')} color={C.ink} size={74} italic />
    <B clip="long-receipt-facepalm" at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="$978,000" x={540} y={330} at={w('million')} color={R} size={170} stroke />
    <Word text="for a $430,000 house" x={540} y={520} at={w('For')} color={C.ink} size={80} italic />
    <B clip="point-then-shocked" at={at} from={2} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="$570,000" unit="JUST INTEREST" x={540} y={400} at={w('interest')} color={R} size={150} />
    <Word text="the bank's profit" x={540} y={620} at={w('bank')} color={C.ink} size={80} italic />
    <Pic src="bank" y={1350} w={420} at={w('bank')} />
    <B clip="angry-point-crossarms" at={at} until={w('bank')} /></>,
  ({at, w}) => <><GridField />
    <Word text="TAXES" x={540} y={290} at={w('taxes')} color={C.ink} size={100} />
    <Word text="INSURANCE" x={540} y={410} at={w('Insurance')} color={C.ink} size={100} />
    <Word text="NEW ROOF" x={540} y={530} at={w('roof')} color={C.ink} size={100} />
    <Word text="HOUSE POOR" x={540} y={680} at={w('house poor')} color={R} size={130} rot={-4} stroke />
    <B clip="reads-bill-upset" at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="SAME $21K" x={540} y={300} at={w('Same')} color={C.ink} size={110} />
    <Obj x={540} y={640} at={w('fourplex')}><Building w={360} /></Obj>
    <PriceTag price="4 HOMES" unit="ONE BUILDING" x={540} y={950} at={w('Four')} color={G} size={100} />
    <Rick pose="pointing" x={800} y={1450} w={420} at={at} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="FHA LOAN" unit="3.5% DOWN" x={540} y={380} at={w('FHA')} color={G} size={130} />
    <Word text="if he lives in one unit" x={540} y={600} at={w('lives')} color={C.ink} size={74} italic />
    <Rick pose="checklist" at={at} /></>,
  ({at, w}) => <><GridField />
    <Obj x={540} y={600} at={at}><Building w={380} /></Obj>
    <Word text="1 FOR RICK" x={540} y={290} at={w('moves')} color={GOLD} size={100} stroke />
    <Word text="3 FOR RENT" x={540} y={920} at={w('rents')} color={G} size={110} stroke />
    <Rick pose="thumbs-up" x={830} y={1450} w={400} at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="$1,550 × 3" x={540} y={330} at={w('fifteen')} color={G} size={140} stroke />
    <PriceTag price="$4,650" unit="EVERY MONTH" x={540} y={560} at={w('forty-six')} color={G} size={140} />
    <Word text="= his whole mortgage" x={540} y={760} at={w('whole')} color={C.ink} size={74} italic />
    <Rick pose="counting-cash" at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="LIVES ALMOST FREE" x={540} y={360} at={w('free')} color={G} size={92} stroke />
    <Word text="tenants pay it off" x={540} y={530} at={w('tenants')} color={C.ink} size={80} italic />
    <Rick pose="chair-relax" at={at} w={560} /></>,
  ({at, w}) => <><GridField />
    <Word text="BENNY: 1 HOUSE" x={540} y={330} at={w('Benny')} color={R} size={96} />
    <Word text="RICK: 4 + RENT" x={540} y={480} at={w('Rick')} color={G} size={110} stroke />
    <B clip="point-then-shocked" at={at} until={w('Rick')} x={540} />
    <Rick pose="sitting-cash-pile" at={w('Rick')} /></>,
  ({at, w}) => <><GridField />
    <Word text="WORKED FOR HIS HOUSE" x={540} y={330} at={at} color={R} size={78} until={w('Rick')} />
    <B clip="pushups" at={at} until={w('Rick')} />
    <Word text="HOUSE WORKS FOR HIM" x={540} y={330} at={w('Rick')} color={G} size={78} stroke />
    <Rick pose="money-rain" at={w('Rick')} /></>,
  ({at, w}) => <><GridField />
    <Word text="SAME SAVINGS" x={540} y={350} at={at} color={C.ink} size={110} />
    <Word text="DIFFERENT LIFE" x={540} y={500} at={w('different')} color={GOLD} size={120} stroke />
    <AnimBenny clip="reads-bill-upset" x={280} y={1460} h={860} at={at} />
    <Rick pose="chair-relax" x={800} y={1440} w={420} at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="BENNY or RICK?" x={540} y={360} at={at} color={C.ink} size={110} />
    <Word text="comment below" x={540} y={520} at={w('Comment')} color={R} size={90} italic />
    <DrawArrow from={[540, 600]} to={[540, 760]} at={w('Comment')} color={R} />
    <B clip="talking-thumbs-up" at={at} /></>,
];

const cams: K[][] = [
  // hook: zoom from frame 0 to POOR/Benny on "poor", swing to RICH/Rick on "rich", pull toward the house on "house"
  [[0, 1, 540, 960], [0.25, 1.25, 280, 820], [W(1, 'rich') - 0.05, 1.25, 280, 820], [W(1, 'rich') + 0.2, 1.25, 800, 820], [W(1, 'house') - 0.05, 1.25, 800, 820], [W(1, 'house') + 0.2, 1.15, 540, 1400], [TIM[0].end, 1.15, 540, 1400]],
  ...TIM.slice(1).map((): K[] => []),
];
const sfx: [number, string][] = [
  [0.0, 'whoosh'], [W(1, 'poor'), 'error'], [W(1, 'rich') - 0.05, 'whoosh'], [W(1, 'rich'), 'cha-ching'], [W(1, 'house'), 'impact'],
  [W(2, 'four'), 'cha-ching'], [W(3, 'Twenty-one'), 'coins'], [W(4, 'Seven'), 'thud'], [W(5, 'twenty-seven'), 'cha-ching'], [W(6, 'million'), 'impact'],
  [W(7, 'interest'), 'error'], [W(8, 'house poor'), 'sad-horn'], [W(9, 'fourplex'), 'ding'], [W(10, 'FHA'), 'pop'], [W(11, 'rents'), 'ding'],
  [W(12, 'forty-six'), 'cash-rain'], [W(13, 'free'), 'ding'], [W(14, 'Rick owns'), 'cha-ching'], [W(15, 'worked for him'), 'impact'], [W(17, 'Comment'), 'pop'],
];

export const HOUSE_V2_SECONDS = 60;
export const HouseV2Video = () => <CollageVideo minSeconds={60} voice="voice-housev2.mp3" tim={TIM} lines={lines} cams={cams} sfx={sfx} icons captionFill="#FFD43B" captionYs={[-1, 955, ...TIM.slice(2).map(() => 870)]} />;
export const HOUSE_V2_SHEET_FRAMES = lines.length;
export const HouseV2Sheet = () => <CollageSheet lines={lines} />;
