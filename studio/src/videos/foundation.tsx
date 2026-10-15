// Why billionaires start their own foundations — grid style B (moving Benny, Rich Rick stills, auto-beat, Fenrir voice).
import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, wordTimer, useT, ramp} from '../engine';
import {DrawArrow} from '../draw';
import {CollageVideo, CollageSheet, LineFn, K, videoSeconds} from '../collageVideo';
import {GridField, AnimBenny, Word, Banner, PriceTag, Obj} from '../grid';
import {Building} from '../props';
import TIM from '../data/foundation.json';

const G = '#1E9E4A', R = '#D7261E', GOLD = '#D9A400';
const Rick = ({pose, x = 540, y = 1330, w = 560, at, until}: {pose: string; x?: number; y?: number; w?: number; at: number; until?: number}) =>
  <Obj x={x} y={y} at={at} until={until}><Img src={staticFile(`gen/rich-${pose}.png`)} style={{width: w, display: 'block'}} /></Obj>;
const Strike = ({x, y, w, at}: {x: number; y: number; w: number; at: number}) => {
  const t = useT(); if (t < at) return null;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - 8, width: w * ramp(t, at, at + 0.2), height: 16, background: R, borderRadius: 8, transform: 'rotate(-6deg)', transformOrigin: 'left'}} />;
};
const Table = () => <svg width={620} height={260} viewBox="0 0 620 260">
  <rect x="40" y="150" width="540" height="30" rx="8" fill="#8B5A2B" /><rect x="80" y="180" width="20" height="70" fill="#8B5A2B" /><rect x="520" y="180" width="20" height="70" fill="#8B5A2B" />
  {['MOM', 'BRO', 'SON'].map((s, i) => <g key={s}><rect x={95 + i * 160} y="40" width="110" height="110" rx="14" fill="#2F5DA8" />
    <text x={150 + i * 160} y="100" fontFamily="Montserrat" fontWeight={900} fontSize="30" fill="#fff" textAnchor="middle">{s}</text></g>)}
</svg>;

const lines: LineFn[] = [
  ({at}) => <><GridField /><Banner at={at} y={160} />
    <PriceTag price="BILLIONAIRE" x={260} y={370} at={at} size={56} color={G} />
    <PriceTag price="CHARITY ♥" x={820} y={370} at={at} size={62} color={R} />
    <Rick pose="sitting-cash-pile" x={260} y={720} w={500} at={at} />
    <Obj x={820} y={720} at={at}><Building w={360} /></Obj>
    <DrawArrow from={[470, 1050]} to={[300, 520]} at={1.25} color={R} />
    <DrawArrow from={[610, 1050]} to={[780, 520]} at={2.2} color={R} />
    <AnimBenny clip="phone-shock-idea" x={540} y={1430} h={900} at={at} play={1.2} /></>,
  ({at, w}) => <><GridField />
    <Word text="NOT JUST" x={540} y={380} at={at} color={R} size={150} rot={-3} />
    <Word text="helping others" x={540} y={540} at={w('helping')} color={C.ink} size={80} italic />
    <AnimBenny clip="angry-point-crossarms" x={540} y={1380} h={1000} at={at} from={1.6} /></>,
  ({at, w}) => <><GridField />
    <Word text="$10,000,000" x={540} y={380} at={w('ten')} color={G} size={140} />
    <Rick pose="throwing-money" at={at} w={600} y={1250} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="$3.7M" unit="THE IRS WANTS" x={540} y={400} at={at} color={R} size={130} until={w('Rick')} />
    <AnimBenny clip="reads-bill-upset" x={540} y={1380} h={980} at={at} until={w('Rick')} />
    <Word text="NO." x={540} y={420} at={w('Rick')} color={R} size={220} rot={-4} />
    <Rick pose="angry" at={w('Rick')} w={560} /></>,
  ({at, w}) => <><GridField />
    <Word text="PRIVATE FOUNDATION" x={540} y={360} at={w('private')} color={C.ink} size={78} until={w('the Rich')} />
    <Rick pose="checklist" at={at} w={560} until={w('the Rich')} />
    <Obj x={540} y={800} at={w('the Rich')}><Building w={460} /></Obj>
    <PriceTag price="RICH RICK FOUNDATION" x={540} y={360} at={w('the Rich')} size={56} color={G} />
    <AnimBenny clip="point-then-shocked" x={300} y={1450} h={800} at={w('the Rich')} /></>,
  ({at, w}) => <><GridField />
    <Rick pose="money-bag-hug" x={300} y={760} w={420} at={at} until={w('charity')} />
    <Obj x={800} y={760} at={at} until={w('charity')}><Building w={320} /></Obj>
    <DrawArrow from={[470, 760]} to={[650, 760]} at={w('donates')} color={G} />
    <Word text="$10M" x={560} y={560} at={w('donates')} color={G} size={110} until={w('charity')} />
    <Word text="TAX-DEDUCTIBLE" x={540} y={420} at={w('charity')} color={G} size={100} rot={-3} />
    <AnimBenny clip="money-rain" x={540} y={1360} h={980} at={w('charity')} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="30%" unit="OF HIS INCOME / YEAR" x={540} y={420} at={w('Thirty')} color={G} size={160} until={w('rest')} />
    <Word text="+ next 5 years" x={540} y={420} at={w('rest')} color={C.ink} size={100} italic until={w('His tax')} />
    <PriceTag price="−$1.1M" unit="TAX BILL" x={540} y={420} at={w('His tax')} color={G} size={150} />
    <AnimBenny clip="phone-shock-idea" x={540} y={1380} h={980} at={at} until={w('His tax')} />
    <AnimBenny clip="wave-holds-dollar" x={540} y={1380} h={980} at={w('His tax')} from={2} /></>,
  ({at, w}) => <><GridField />
    <Word text="NOPE" x={540} y={400} at={at} color={R} size={180} until={w('named')} />
    <AnimBenny clip="throws-paper-falls" x={540} y={1380} h={980} at={at} until={w('named')} />
    <Word text="PRESIDENT" x={540} y={400} at={w('named')} color={GOLD} size={150} stroke />
    <Rick pose="crown" at={w('named')} w={560} /></>,
  ({at, w}) => <><GridField />
    <Word text="SALARY" x={540} y={360} at={w('salary')} color={G} size={150} />
    <Word text="if it's “reasonable”" x={540} y={520} at={w('Legal')} color={C.ink} size={80} italic />
    <Rick pose="counting-cash" at={at} w={560} /></>,
  ({at, w}) => <><GridField />
    <Word text="THE BOARD" x={540} y={330} at={at} color={C.ink} size={110} />
    <Obj x={540} y={620} at={w('board')}><Table /></Obj>
    <Word text="LEGAL ✓" x={540} y={880} at={w('Also')} color={G} size={110} rot={-3} />
    <AnimBenny clip="point-then-shocked" x={540} y={1500} h={760} at={at} from={1.6} /></>,
  ({at, w}) => <><GridField />
    <Word text="PRIVATE JET?" x={540} y={360} at={at} color={C.ink} size={110} until={w('Vacations')} />
    <Rick pose="airplane" at={at} w={600} y={1150} until={w('Vacations')} />
    <Word text="foundation trips only" x={540} y={520} at={w('Only')} color={G} size={76} italic until={w('Vacations')} />
    <Rick pose="beach-dream" at={w('Vacations')} w={560} y={1150} />
    <Word text="SELF-DEALING" x={540} y={420} at={w('self-dealing')} color={R} size={130} rot={-8} stroke /></>,
  ({at, w}) => <><GridField />
    <Word text="5%" x={300} y={480} at={w('five')} color={G} size={150} />
    <Word text="give away" x={300} y={600} at={w('five')} color={C.ink} size={56} italic />
    <Word text="95%" x={770} y={500} at={w('rest')} color={GOLD} size={230} stroke />
    <Word text="stays with him" x={770} y={660} at={w('control')} color={C.ink} size={56} italic />
    <Rick pose="sitting-cash-pile" at={w('rest')} w={520} y={1300} />
    <AnimBenny clip="reads-bill-upset" x={540} y={1380} h={980} at={at} until={w('rest')} /></>,
  ({at, w}) => <><GridField />
    <Word text="DECADES" x={540} y={400} at={w('decades')} color={G} size={150} />
    <DrawArrow from={[300, 700]} to={[800, 520]} at={w('growing')} color={G} />
    <Rick pose="laptop-chart-dream" at={at} w={600} /></>,
  ({at, w}) => <><GridField />
    <Word text="ESTATE TAX 40%" x={540} y={420} at={w('forty')} color={R} size={110} />
    <Strike x={540} y={420} w={820} at={w('estate') + 0.2} />
    <Rick pose="jump" at={at} w={560} /></>,
  ({at, w}) => <><GridField />
    <Word text="HIS KIDS" x={540} y={360} at={w('kids')} color={C.ink} size={130} />
    <Word text="+ salaries" x={540} y={520} at={w('salaries')} color={G} size={100} italic />
    <Rick pose="thumbs-up" at={at} w={540} /></>,
  ({at, w}) => <><GridField />
    <Word text="PHILANTHROPIST" x={540} y={380} at={w('philanthropist')} color={GOLD} size={110} stroke />
    <Rick pose="excited-wave" at={at} w={560} until={w('philanthropist')} />
    <AnimBenny clip="long-receipt-facepalm" x={540} y={1380} h={980} at={w('philanthropist')} from={2} /></>,
  ({at, w}) => <><GridField />
    <Word text="FOLLOW" x={540} y={380} at={w('Follow')} color={R} size={170} />
    <Word text="for part 2" x={540} y={540} at={w('part')} color={C.ink} size={90} italic />
    <AnimBenny clip="talking-thumbs-up" x={540} y={1380} h={1000} at={at} /></>,
];

const W = wordTimer(TIM);
const st = (k: number) => TIM[k - 1].start;
const cams: K[][] = [
  [[0, 1, 540, 960], [1.2, 1, 540, 960], [1.6, 1.12, 380, 900], [W(1, 'charitable'), 1.12, 420, 900], [W(1, 'foundations'), 1.12, 700, 900], [TIM[0].end, 1.12, 700, 900]],
  ...TIM.slice(1).map((): K[] => []),
];
const sfx: [number, string][] = [
  [1.25, 'whoosh'], [W(1, 'foundations'), 'whoosh'], [W(1, 'foundations') + 0.2, 'impact'], [st(2), 'record-scratch'],
  [W(3, 'ten'), 'cha-ching'], [W(4, 'three'), 'cha-ching'], [W(4, 'Rick'), 'error'], [W(5, 'Rich'), 'ding'], [W(6, 'donates'), 'coins'], [W(6, 'deductible'), 'ding'],
  [W(7, 'His tax'), 'cha-ching'], [W(8, 'named'), 'impact'], [W(9, 'salary'), 'cha-ching'], [W(10, 'legal'), 'ding'], [W(11, 'self-dealing'), 'error'],
  [W(12, 'rest'), 'impact'], [W(13, 'decades'), 'ding'], [W(14, 'forty'), 'crack'], [W(15, 'salaries'), 'cha-ching'], [W(16, 'philanthropist'), 'sad-horn'], [W(17, 'Follow'), 'pop'],
];

export const FOUNDATION_SECONDS = videoSeconds(TIM);
export const FoundationVideo = () => <CollageVideo voice="voice-foundation.mp3" tim={TIM} lines={lines} cams={cams} sfx={sfx} captionFill="#FFD43B" captionYs={[1090, ...TIM.slice(1).map(() => 900)]} />;
export const FOUNDATION_SHEET_FRAMES = lines.length;
export const FoundationSheet = () => <CollageSheet lines={lines} />;
