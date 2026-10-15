// Tax evasion explained by Benny (caveman English) — saved grid format (moving Benny, icons, varied camera, Fenrir, 60s).
import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, wordTimer, useT, ramp} from '../engine';
import {DrawArrow} from '../draw';
import {CollageVideo, CollageSheet, LineFn, K} from '../collageVideo';
import {GridField, AnimBenny, Word, Banner, PriceTag, Obj} from '../grid';
import {IconArt} from '../icons';
import TIM from '../data/tax-evasion.json';

const G = '#1E9E4A', R = '#D7261E', GOLD = '#D9A400';
const Pic = ({src, x = 540, y = 1440, w = 440, at, until}: {src: string; x?: number; y?: number; w?: number; at: number; until?: number}) =>
  <Obj x={x} y={y} at={at} until={until}><Img src={staticFile(`gen/${src}.png`)} style={{width: w, display: 'block'}} /></Obj>;
const Strike = ({x, y, w, at}: {x: number; y: number; w: number; at: number}) => {
  const t = useT(); if (t < at) return null;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - 8, width: w * ramp(t, at, at + 0.2), height: 16, background: R, borderRadius: 8, transform: 'rotate(-6deg)', transformOrigin: 'left'}} />;
};
const B = (p: {clip: string; at: number; until?: number; from?: number; x?: number}) => <AnimBenny x={p.x ?? 540} y={1460} h={980} {...p} />;

const lines: LineFn[] = [
  ({at}) => <><GridField /><Banner text="TAX EVASION?" at={at} y={280} size={78} />
    <PriceTag price="$50,000" unit="REAL INCOME" x={270} y={490} at={at} size={92} color={G} />
    <PriceTag price="$5,000" unit="ON TAX FORM" x={810} y={490} at={at} size={92} color={R} />
    <Pic src="rial-stack" x={270} y={790} w={400} at={at} />
    <Obj x={810} y={790} at={at}><IconArt id="doodle:FileForm" size={330} /></Obj>
    <DrawArrow from={[70, 300]} to={[150, 420]} at={1.3} color={R} />
    <DrawArrow from={[1010, 300]} to={[930, 420]} at={0.3} color={R} />
    <AnimBenny clip="point-then-shocked" x={540} y={1560} h={840} at={at} play={0} /></>,
  ({at, w}) => <><GridField />
    <Word text="CASH ONLY" x={540} y={380} at={at} color={G} size={130} until={w('fifty')} />
    <Pic src="benny-tired-driving" at={at} w={620} y={1300} until={w('fifty')} />
    <PriceTag price="$50,000" unit="IN ONE YEAR" x={540} y={420} at={w('fifty')} color={G} size={140} />
    <B clip="wave-holds-dollar" at={w('fifty')} from={2} /></>,
  ({at, w}) => <><GridField />
    <Word text="NEW TRUCK!" x={540} y={400} at={w('truck')} color={G} size={140} rot={-3} />
    <B clip="money-rain" at={at} /></>,
  ({at}) => <><GridField />
    <Word text="NOT SO FAST" x={540} y={400} at={at} color={R} size={130} rot={-4} stroke />
    <B clip="point-then-shocked" at={at} from={2} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="GOVERNMENT" x={540} y={330} at={at} size={60} color={C.ink} until={w('form')} />
    <Pic src="cast-advisor-02" at={at} w={420} y={1400} until={w('form')} />
    <Word text="TAX FORM" x={540} y={330} at={w('form')} color={R} size={130} />
    <Obj x={540} y={640} at={w('form')}><IconArt id="doodle:FileForm" size={300} /></Obj>
    <B clip="reads-bill-upset" at={w('form')} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="$50,000" unit="YOU EARN" x={540} y={400} at={at} color={G} size={130} until={w('take')} />
    <PriceTag price="−$10,000" unit="GOVERNMENT TAKES" x={540} y={400} at={w('take')} color={R} size={130} />
    <Word text="roads · schools" x={540} y={600} at={w('roads')} color={C.ink} size={70} italic />
    <B clip="reads-bill-upset" at={at} /></>,
  ({at}) => <><GridField />
    <Word text="ROBBED?!" x={540} y={400} at={at} color={R} size={170} rot={-5} stroke />
    <B clip="throws-paper-falls" at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="IDEA" x={540} y={360} at={at} color={GOLD} size={150} stroke until={w('lie')} />
    <Word text="cash = no paper" x={540} y={520} at={w('Cash')} color={C.ink} size={80} italic until={w('lie')} />
    <Word text="LIE ON FORM" x={540} y={420} at={w('lie')} color={R} size={130} rot={-3} />
    <B clip="phone-shock-idea" at={at} from={2.3} /></>,
  ({at, w}) => <><GridField />
    <Word text="$50,000" x={540} y={340} at={at} color={C.ink} size={130} />
    <Strike x={540} y={340} w={560} at={w('only')} />
    <Word text="$5,000" x={540} y={540} at={w('five')} color={G} size={170} rot={-3} />
    <B clip="talking-thumbs-up" at={at} from={1} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="$700" unit="TAX NOW" x={540} y={380} at={at} color={G} size={140} until={w('keep')} />
    <Word text="+$10,000" x={540} y={400} at={w('keep')} color={G} size={180} stroke />
    <Word text="extra for Benny" x={540} y={580} at={w('extra')} color={C.ink} size={70} italic />
    <B clip="sitting-on-cash" at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="TRUCK" x={540} y={300} at={w('truck')} color={C.ink} size={100} />
    <Word text="HOUSE" x={540} y={430} at={w('house')} color={C.ink} size={100} />
    <Word text="JET SKI" x={540} y={560} at={w('jet')} color={C.ink} size={100} />
    <B clip="lying-in-money" at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="CASH OVER $10,000" x={540} y={330} at={w('cash')} color={R} size={84} />
    <PriceTag price="FORM 8300" unit="DEALER → IRS" x={540} y={520} at={w('report')} color={C.ink} size={90} />
    <Word text="IRS KNOW" x={540} y={700} at={w('IRS know')} color={R} size={110} rot={-4} stroke />
    <B clip="point-then-shocked" at={at} from={1.8} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="IRS" unit="INTERNAL REVENUE SERVICE" x={540} y={330} at={at} color={C.blue} size={120} />
    <Pic src="government-office" at={at} w={560} y={760} until={w('compare')} />
    <Word text="BANK ≠ TRUCK ≠ HOUSE" x={540} y={620} at={w('compare')} color={C.ink} size={66} />
    <Word text="NO MATCH" x={540} y={760} at={w('match')} color={R} size={140} rot={-4} stroke />
    <B clip="phone-shock-idea" at={w('compare')} from={1.3} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="IRS AGENT" x={540} y={330} at={at} color={R} size={80} until={w('hide')} />
    <Pic src="cast-advisor" at={at} w={420} y={1400} until={w('hide')} />
    <B clip="opens-door" at={w('hide')} until={w('run')} />
    <Pic src="cast-advisor" x={850} y={1150} w={300} at={w('already')} until={w('run')} />
    <Word text="ALREADY THERE" x={540} y={380} at={w('already')} color={R} size={100} until={w('run')} />
    <B clip="running-money-bag" at={w('run')} />
    <Pic src="cast-advisor" x={860} y={1150} w={300} at={w('too')} />
    <Word text="THERE TOO?!" x={540} y={380} at={w('too')} color={R} size={110} stroke /></>,
  ({at, w}) => <><GridField />
    <Word text="PAY BACK TAX" x={540} y={300} at={w('Pay')} color={C.ink} size={96} />
    <Word text="+75% PENALTY" x={540} y={440} at={w('seventy-five')} color={R} size={110} stroke />
    <Word text="+ INTEREST" x={540} y={580} at={w('interest')} color={R} size={90} italic />
    <B clip="long-receipt-facepalm" at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="FELONY" x={540} y={380} at={w('felony')} color={R} size={170} rot={-6} stroke until={w('five')} />
    <B clip="angry-point-crossarms" at={at} until={w('five')} />
    <Word text="UP TO 5 YEARS" x={540} y={400} at={w('five')} color={R} size={120} stroke />
    <B clip="jail-counting-cash" at={w('five')} /></>,
  ({at, w}) => <><GridField />
    <Word text="DEATH" x={300} y={380} at={w('death')} color={C.ink} size={120} until={w('Next')} />
    <Word text="TAXES" x={780} y={380} at={w('taxes')} color={R} size={120} until={w('Next')} />
    <B clip="talking-thumbs-up" at={at} until={w('Next')} />
    <Word text="PART 2" x={540} y={330} at={w('Next')} color={GOLD} size={150} stroke />
    <Word text="pay less, legally" x={540} y={500} at={w('legally')} color={G} size={90} italic />
    <Obj x={540} y={1440} at={w('Next')}><Img src={staticFile('gen/rich-thumbs-up.png')} style={{width: 500, display: 'block'}} /></Obj></>,
];

const W = wordTimer(TIM);
const cams: K[][] = [
  [[0, 1, 540, 960], [0.35, 1.06, 640, 960], [W(1, 'find'), 1.06, 640, 960], [TIM[0].end, 1.0, 540, 960]],
  ...TIM.slice(1).map((): K[] => []),
];
const sfx: [number, string][] = [
  [0.02, 'pop'], [0.3, 'spring'], [0.3, 'whoosh'], [0.6, 'cha-ching'], [1.3, 'spring'], [W(1, 'find'), 'impact'],
  [W(2, 'fifty'), 'cha-ching'], [W(3, 'truck'), 'ding'], [TIM[3].start, 'record-scratch'], [W(5, 'form'), 'flip'], [W(6, 'take'), 'cha-ching'],
  [TIM[6].start, 'sad-horn'], [W(8, 'idea'), 'ding'], [W(9, 'five'), 'pop'], [W(10, 'keep'), 'coins'], [W(12, 'report'), 'boing'],
  [W(13, 'match'), 'error'], [W(14, 'already'), 'record-scratch'], [W(14, 'too'), 'record-scratch'], [W(15, 'seventy-five'), 'cha-ching'],
  [W(16, 'felony'), 'impact'], [W(16, 'jail'), 'thud'], [W(17, 'Next'), 'ding'],
];

export const TAX_EVASION_SECONDS = 60;
export const TaxEvasionVideo = () => <CollageVideo minSeconds={60} voice="voice-taxevasion.mp3" tim={TIM} lines={lines} cams={cams} sfx={sfx} icons captionFill="#FFD43B" captionYs={[1090, ...TIM.slice(1).map(() => 870)]} />;
export const TAX_EVASION_SHEET_FRAMES = lines.length;
export const TaxEvasionSheet = () => <CollageSheet lines={lines} />;
