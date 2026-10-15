// Why billionaires don't leave money directly to their kids — saved format (moving Benny, Rick, icons, zoom-only, Fenrir, 60s).
import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, wordTimer, useT, ramp} from '../engine';
import {DrawArrow} from '../draw';
import {CollageVideo, CollageSheet, LineFn, K} from '../collageVideo';
import {GridField, AnimBenny, Word, Banner, PriceTag, Obj} from '../grid';
import {IconArt} from '../icons';
import {BabyRick} from '../babyRick';
import TIM from '../data/trust.json';

const G = '#1E9E4A', R = '#D7261E', GOLD = '#D9A400';
const Pic = ({src, x = 540, y = 1440, w = 520, at, until}: {src: string; x?: number; y?: number; w?: number; at: number; until?: number}) =>
  <Obj x={x} y={y} at={at} until={until}><Img src={staticFile(`gen/${src}.png`)} style={{width: w, display: 'block'}} /></Obj>;
const Rick = (p: {pose: string; at: number; until?: number; x?: number; y?: number; w?: number}) => <Pic src={`rich-${p.pose}`} {...p} />;
const Strike = ({x, y, w, at}: {x: number; y: number; w: number; at: number}) => {
  const t = useT(); if (t < at) return null;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - 8, width: w * ramp(t, at, at + 0.2), height: 16, background: R, borderRadius: 8, transform: 'rotate(-6deg)', transformOrigin: 'left'}} />;
};
const B = (p: {clip: string; at: number; until?: number; from?: number; x?: number; flip?: boolean}) => <AnimBenny x={p.x ?? 540} y={1460} h={980} {...p} />;
const Ic = ({id, x = 540, y = 700, size = 320, at, until}: {id: string; x?: number; y?: number; size?: number; at: number; until?: number}) =>
  <Obj x={x} y={y} at={at} until={until}><IconArt id={id} size={size} /></Obj>;

const W = (l: number, w: string) => wordTimer(TIM)(l, w);
const lines: LineFn[] = [
  // Hook: strong zoom LEFT (leave it directly → −$394M), Benny (flipped) points left; on "directly" swing RIGHT (trust → $0), Benny points right.
  ({at}) => <><GridField /><Banner text="WHY?" at={at} y={250} size={130} />
    <PriceTag price="−$394M" unit="ESTATE TAX" x={270} y={490} at={at} size={90} color={R} />
    <PriceTag price="$0" unit="TAX ON THE GROWTH" x={810} y={490} at={at} size={90} color={G} />
    <Rick pose="money-bag" x={270} y={830} w={290} at={at} />
    <Obj x={810} y={820} at={at}><BabyRick w={240} /></Obj>
    <DrawArrow from={[70, 300]} to={[150, 420]} at={0.3} color={R} />
    <DrawArrow from={[1010, 300]} to={[930, 420]} at={W(1, 'directly')} color={R} />
    <AnimBenny clip="point-then-shocked" x={540} y={1560} h={840} at={at} play={0} flip until={W(1, 'directly')} />
    <AnimBenny clip="point-then-shocked" x={540} y={1560} h={840} at={W(1, 'directly')} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="$1,000,000,000" x={540} y={380} at={w('billion')} color={G} size={92} />
    <Word text="+ 1 SON" x={540} y={560} at={w('son')} color={C.ink} size={100} />
    <Obj x={860} y={1160} at={w('son')}><BabyRick w={230} /></Obj>
    <Rick pose="front" at={at} w={720} y={1400} /></>,
  ({at, w}) => <><GridField />
    <Word text="IRS" x={540} y={330} at={w('IRS')} color={R} size={170} stroke />
    <Pic src="government-office" y={700} w={520} at={w('IRS')} />
    <B clip="point-then-shocked" at={at} from={2} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="40%" unit="ESTATE TAX" x={540} y={380} at={w('estate')} color={R} size={170} />
    <Word text="above $15M" x={540} y={600} at={w('above')} color={C.ink} size={90} italic />
    <B clip="reads-bill-upset" at={at} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="−$394M" x={540} y={400} at={at} color={R} size={170} />
    <Word text="GONE." x={540} y={600} at={w('Gone')} color={R} size={140} rot={-5} stroke />
    <B clip="throws-paper-falls" at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="THEY DON'T OWN" x={540} y={330} at={w('own')} color={C.ink} size={96} />
    <Word text="THE TRUST DOES" x={540} y={470} at={w('trusts')} color={G} size={110} stroke />
    <Obj x={540} y={780} at={w('trusts')}><BabyRick w={260} /></Obj>
    <Rick pose="pointing" at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="YEARS EARLIER" x={540} y={330} at={at} color={GOLD} size={110} stroke />
    <Word text="SHARES → TRUST" x={540} y={490} at={w('shares')} color={C.ink} size={96} />
    <Word text="irrevocable" x={540} y={620} at={w('irrevocable')} color={R} size={80} italic />
    <Rick pose="laptop-chart-dream" at={at} /></>,
  ({at, w}) => <><GridField />
    <PriceTag price="$15M" unit="WORTH BACK THEN" x={540} y={380} at={w('fifteen')} color={G} size={160} />
    <Word text="TAX-FREE LIMIT ✓" x={540} y={600} at={w('tax-free')} color={G} size={90} />
    <B clip="talking-thumbs-up" at={at} from={1} /></>,
  ({at, w}) => <><GridField />
    <Word text="$15M" x={300} y={420} at={w('Fifteen')} color={C.ink} size={130} />
    <DrawArrow from={[450, 440]} to={[640, 440]} at={w('turns')} color={G} />
    <Word text="$1B" x={830} y={420} at={w('billion')} color={G} size={170} stroke />
    <Word text="inside the trust" x={540} y={600} at={w('Inside')} color={C.ink} size={80} italic />
    <Rick pose="jump-money-rain" at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="ESTATE TAX" x={540} y={420} at={w('estate')} color={C.ink} size={140} />
    <Strike x={540} y={420} w={820} at={w('never touches')} />
    <Rick pose="thumbs-up" at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="OWNS $0" x={540} y={360} at={w('dime')} color={R} size={140} until={w('beneficiary')} />
    <Word text="BENEFICIARY" x={540} y={400} at={w('beneficiary')} color={GOLD} size={130} stroke />
    <Obj x={540} y={1360} at={at}><BabyRick w={380} /></Obj></>,
  ({at, w}) => <><GridField />
    <Word text="MANSION" x={540} y={300} at={w('mansion')} color={C.ink} size={100} />
    <Word text="CARS" x={540} y={420} at={w('cars')} color={C.ink} size={100} />
    <Word text="JET" x={540} y={540} at={w('jet')} color={C.ink} size={100} />
    <Rick pose="holding-house" at={at} until={w('jet')} />
    <Rick pose="airplane" at={w('jet')} w={600} y={1350} /></>,
  ({at, w}) => <><GridField />
    <Word text="SUED?" x={540} y={340} at={at} color={R} size={150} stroke />
    <Word text="usually protected" x={540} y={520} at={w('creditors')} color={G} size={90} italic />
    <Ic id="doodle:Shield" y={760} size={300} at={w('spendthrift')} />
    <B clip="angry-point-crossarms" at={at} from={1.6} /></>,
  ({at, w}) => <><GridField />
    <Word text="DIVORCE?" x={540} y={340} at={at} color={R} size={150} stroke />
    <Word text="trust stays out" x={540} y={520} at={w('stays')} color={G} size={90} italic />
    <B clip="opens-door" at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="GENERATIONS" x={540} y={380} at={w('generations')} color={GOLD} size={120} stroke />
    <Ic id="doodle:Tree" y={700} size={320} at={w('generations')} />
    <Rick pose="sitting-cash-pile" at={at} /></>,
  ({at, w}) => <><GridField />
    <Word text="OWN LESS" x={540} y={420} at={w('less')} color={GOLD} size={170} stroke />
    <Word text="on paper" x={540} y={600} at={w('paper')} color={C.ink} size={90} italic />
    <Rick pose="crown" at={at} w={720} y={1400} /></>,
  ({at, w}) => <><GridField />
    <Word text="FOLLOW" x={540} y={380} at={w('Follow')} color={R} size={170} />
    <Word text="rich people cheat codes" x={540} y={540} at={w('cheat')} color={C.ink} size={70} italic />
    <B clip="talking-thumbs-up" at={at} /></>,
];

const cams: K[][] = [
  [[0, 1, 540, 960], [0.3, 1.3, 380, 880], [W(1, 'directly') - 0.05, 1.3, 380, 880], [W(1, 'directly') + 0.25, 1.3, 700, 880], [TIM[0].end, 1.3, 700, 880]],
  ...TIM.slice(1).map((): K[] => []),
];
const sfx: [number, string][] = [
  [0.0, 'whoosh'], [0.3, 'cha-ching'], [W(1, 'directly') - 0.05, 'whoosh'], [W(1, 'directly') + 0.2, 'ding'], [W(1, 'children'), 'impact'],
  [W(2, 'billion'), 'cha-ching'], [W(3, 'IRS'), 'record-scratch'], [W(4, 'forty'), 'ding'], [W(5, 'Gone'), 'impact'], [W(6, 'trusts'), 'ding'],
  [W(7, 'irrevocable'), 'thud'], [W(8, 'fifteen'), 'cha-ching'], [W(9, 'billion'), 'cash-rain'], [W(10, 'never touches'), 'crack'],
  [W(11, 'beneficiary'), 'ding'], [W(13, 'Sued'), 'record-scratch'], [W(14, 'Divorce'), 'record-scratch'], [W(16, 'less'), 'ding'], [W(17, 'Follow'), 'pop'],
];

export const TRUST_SECONDS = 60;
export const TrustVideo = () => <CollageVideo minSeconds={60} voice="voice-trust.mp3" tim={TIM} lines={lines} cams={cams} sfx={sfx} icons captionFill="#FFD43B" captionYs={[1125, ...TIM.slice(1).map(() => 870)]} />;
export const TRUST_SHEET_FRAMES = lines.length;
export const TrustSheet = () => <CollageSheet lines={lines} />;
