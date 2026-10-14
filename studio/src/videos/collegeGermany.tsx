// College USA $45,000 vs Germany $0 — free local collage (src/collage.tsx).
// college-sheet: 1 frame per line (Gate 2 stills). college-assemble: each line assembles in 2.5s (Gate 3).
import React from 'react';
import {Audio, staticFile} from 'remotion';
import {Scene, Fonts, C, Sfx, wordTimer} from '../engine';
import {OutlineCaptions} from '../sketch';
import TIM from '../data/college-germany.json';
import {Receipt, Calendar, House, GroceryBag, Ticket, Scale} from '../props';
import {TornSplit, Field, Piece, Card, FlagUS, FlagDE} from '../collage';
import {Ivy, PlainUni, Plate, Passport, Bus, QMark, Chalkboard, Book, Diploma, ExamPaper, Vault, Lock, EuroCoin, Mountain, GradCap, Chain, Road, Cross} from './collegeProps';

// Light 'white caramel' paper backgrounds (user rule); each side keeps its own tint for contrast. INK_* = strong text colors.
const US = '#F6D3BC', DE = '#D2E7D3', CATCH = '#F5E3B5', DEBT = '#F4CFC6', END = '#E3D8EE', CARD = '#FFFFFF';
const INK_US = '#D2461F', INK_DE = '#1F6B4A', INK_DEBT = '#B8322A', INK_END = '#4B2E6B';
const Benny = ({pose, at, x = 540}: {pose: string; at: number; x?: number}) => <Piece x={x} y={1760} w={430} at={at} from="bottom" src={`benny-${pose}`} />;
type L = (p: {at: number}) => JSX.Element;

const lines: L[] = [
  ({at}) => <><TornSplit left={US} right={DE} at={at} />
    <Piece x={270} y={250} w={190} at={at + 0.07} from="top" rot={-6}><FlagUS w={190} /></Piece><Piece x={810} y={250} w={190} at={at + 0.09} from="top" rot={5}><FlagDE w={190} /></Piece>
    <Piece x={270} y={560} w={440} at={at + 0.12} from="left" rot={-2}><Ivy w={440} /></Piece><Piece x={810} y={580} w={380} at={at + 0.14} from="right" rot={2}><PlainUni w={380} /></Piece>
    <Piece x={250} y={880} w={330} at={at + 0.17} from="left" rot={-4}><Mountain w={330} /></Piece><Piece x={810} y={900} w={260} at={at + 0.19} from="right"><Plate w={260} /></Piece>
    <Card text="$45,000" x={270} y={1110} at={at + 0.24} from="pop" rot={-4} color={CARD} ink={INK_US} size={92} /><Card text="$0" x={810} y={1110} at={at + 0.28} from="pop" rot={4} color={CARD} ink={INK_DE} size={140} />
    <Benny pose="shocked" at={at + 0.21} /></>,
  ({at}) => <><Field color="#F3E3D3" />
    <Piece x={540} y={450} w={560} at={at} from="top"><Ivy w={560} /></Piece>
    <Piece x={360} y={950} w={400} at={at + 0.1} from="left" rot={-8}><Receipt w={400} rows={[['TUITION', '$45,000', C.red], ['RENT', '+', C.ink], ['FOOD', '+', C.ink], ['BOOKS', '+', C.ink]]} /></Piece>
    <Card text="$45,000/yr" x={760} y={1080} at={at + 0.21} from="pop" rot={5} color={CARD} ink={INK_US} size={80} />
    <Benny pose="worried" at={at + 0.14} x={760} /></>,
  ({at}) => <><Field color={DEBT} />
    {[1, 2, 3, 4].map((n, i) => <Piece key={n} x={180 + i * 240} y={330 + (i % 2) * 60} w={210} at={at + i * 0.052} from="top" rot={(i % 2 ? 6 : -6)}><Calendar w={210} month={`YEAR ${n}`} label="$45K" /></Piece>)}
    <Piece x={330} y={760} w={250} at={at + 0.24} from="left"><House w={250} /></Piece><Piece x={330} y={760} w={220} at={at + 0.32} from="pop"><Cross w={220} /></Piece>
    <Piece x={750} y={760} w={220} at={at + 0.26} from="right"><GroceryBag w={220} /></Piece><Piece x={750} y={760} w={220} at={at + 0.33} from="pop"><Cross w={220} /></Piece>
    <Card text="$180,000" x={540} y={1060} at={at + 0.35} from="pop" rot={-3} color={CARD} ink={INK_DEBT} size={120} />
    <Benny pose="sad-02" at={at + 0.17} /></>,
  ({at}) => <><Field color={DE} />
    <Piece x={540} y={480} w={560} at={at} from="top"><PlainUni w={560} /></Piece>
    <Piece x={330} y={900} w={190} at={at + 0.1} from="left" rot={-10}><Passport w={190} /></Piece><Piece x={750} y={900} w={190} at={at + 0.12} from="right" rot={8}><Passport w={190} color="#7A1F2B" label="EU" /></Piece>
    <Card text="TUITION €0" x={540} y={1110} at={at + 0.21} from="pop" rot={-4} color={C.gold} ink={INK_DE} size={96} />
    <Benny pose="excited" at={at + 0.16} /></>,
  ({at}) => <><Field color="#DCEBD7" />
    <Piece x={330} y={420} w={420} at={at} from="left" rot={-6}><Ticket w={420} label="SEMESTER" /></Piece>
    <Piece x={600} y={800} w={560} at={at + 0.12} from="right"><Bus w={560} /></Piece>
    <Card text="€150–400" x={760} y={420} at={at + 0.21} from="pop" rot={6} color={CARD} ink={INK_DE} size={80} />
    <Benny pose="pointing" at={at + 0.16} x={420} /></>,
  ({at}) => <><TornSplit left={US} right={DE} at={at} />
    <Piece x={200} y={330} w={210} at={at + 0.07} from="left" rot={-12}><FlagUS w={210} /></Piece><Piece x={880} y={330} w={210} at={at + 0.09} from="right" rot={12}><FlagDE w={210} /></Piece>
    <Piece x={540} y={700} w={420} at={at + 0.14} from="pop" rot={-4}><QMark w={420} color={C.ink} /></Piece>
    <Benny pose="thinking-03" at={at + 0.17} /></>,
  ({at}) => <><Field color={CATCH} />
    <Card text="CATCH #1" x={540} y={190} at={at} from="top" rot={-3} color={C.ink} ink={CARD} size={70} />
    <Piece x={540} y={560} w={760} at={at + 0.07} from="top"><Chalkboard w={760} /></Piece>
    <Piece x={820} y={1000} w={220} at={at + 0.17} from="top" rot={14}><Book w={220} /></Piece>
    <Benny pose="thinking-03" at={at + 0.14} x={380} /></>,
  ({at}) => <><Field color={CATCH} />
    <Card text="CATCH #2" x={540} y={190} at={at} from="top" rot={3} color={C.ink} ink={CARD} size={70} />
    <Piece x={330} y={540} w={460} at={at + 0.07} from="left" rot={-4}><Diploma w={460} /></Piece>
    <Card text="NOT ENOUGH" x={330} y={560} at={at + 0.17} from="pop" rot={-14} color={C.red} ink="#fff" size={56} />
    <Piece x={780} y={500} w={180} at={at + 0.21} from="right" rot={6}><ExamPaper w={180} label="AP" /></Piece><Piece x={820} y={830} w={180} at={at + 0.24} from="right" rot={-5}><ExamPaper w={180} label="1 YR" /></Piece>
    <Benny pose="angry" at={at + 0.14} x={420} /></>,
  ({at}) => <><Field color={CATCH} />
    <Card text="CATCH #3" x={540} y={190} at={at} from="top" rot={-3} color={C.ink} ink={CARD} size={70} />
    <Piece x={540} y={620} w={520} at={at + 0.07} from="top"><Vault w={520} /></Piece><Piece x={760} y={800} w={170} at={at + 0.17} from="pop" rot={8}><Lock w={170} /></Piece>
    <Card text="≈ €12,000" x={540} y={1080} at={at + 0.21} from="pop" rot={3} color={CARD} ink={C.red} size={96} />
    <Benny pose="worried" at={at + 0.14} x={320} /></>,
  ({at}) => <><Field color="#F3E9D8" />
    {Array.from({length: 12}, (_, i) => <Piece key={i} x={250 + (i % 4) * 190} y={300 + Math.floor(i / 4) * 170} w={130} at={at + i * 0.021} from="pop"><EuroCoin w={130} /></Piece>)}
    <Piece x={800} y={900} w={240} at={at + 0.32} from="right"><House w={240} /></Piece>
    <Card text="≈ €1,000/mo" x={420} y={1000} at={at + 0.35} from="pop" rot={-3} color={INK_DE} ink={CARD} size={80} />
    <Benny pose="saving-cash" at={at + 0.17} x={480} /></>,
  ({at}) => <><TornSplit left={US} right={DE} at={at} />
    <Piece x={270} y={760} w={480} at={at + 0.1} from="left"><Mountain w={480} /></Piece><Piece x={810} y={860} w={340} at={at + 0.14} from="right"><Plate w={340} /></Piece>
    <Card text="$180,000" x={270} y={1150} at={at + 0.21} from="pop" rot={-4} color={CARD} ink={INK_US} size={90} /><Card text="$0" x={810} y={1150} at={at + 0.24} from="pop" rot={4} color={CARD} ink={INK_DE} size={150} /></>,
  ({at}) => <><Field color={DEBT} />
    <Piece x={540} y={520} w={480} at={at} from="top" rot={-4}><GradCap w={480} /></Piece>
    <Piece x={540} y={560} w={700} at={at + 0.12} from="left" rot={-12}><Chain w={700} /></Piece>
    <Card text="$39,500" x={540} y={1000} at={at + 0.21} from="pop" rot={3} color={CARD} ink={INK_DEBT} size={130} />
    <Benny pose="sad-02" at={at + 0.16} /></>,
  ({at}) => <><Field color={END} />
    <Piece x={540} y={620} w={760} at={at} from="top"><Scale w={760} tilt={-12} left={<Mountain w={230} />} right={<FlagDE w={170} />} /></Piece>
    <Card text="$180,000 GAP" x={540} y={1090} at={at + 0.17} from="pop" rot={-3} color={C.gold} ink={INK_END} size={96} />
    <Benny pose="thinking-03" at={at + 0.12} /></>,
  ({at}) => <><TornSplit left={US} right={DE} at={at} />
    <Piece x={270} y={420} w={400} at={at + 0.07} from="left" rot={-3}><Ivy w={400} /></Piece><Piece x={810} y={440} w={360} at={at + 0.09} from="right" rot={3}><PlainUni w={360} /></Piece>
    <Piece x={540} y={920} w={760} at={at + 0.14} from="bottom"><Road w={760} /></Piece>
    <Card text="WOULD YOU GO?" x={540} y={1140} at={at + 0.24} from="pop" rot={-3} color={C.gold} ink={INK_END} size={80} />
    <Benny pose="front" at={at + 0.17} /></>,
];

export const COLLEGE_SHEET_FRAMES = lines.length;
export const CollegeSheet = () => <><Fonts />{lines.map((Line, k) =>
  <Scene key={k} from={k / 30} to={(k + 1) / 30}><Line at={k / 30 - 10} /></Scene>)}</>;

export const ASSEMBLE_LEN = 2.5;
export const COLLEGE_ASSEMBLE_SECONDS = lines.length * ASSEMBLE_LEN;
export const CollegeAssemble = () => <><Fonts />{lines.map((Line, k) =>
  <Scene key={k} from={k * ASSEMBLE_LEN} to={(k + 1) * ASSEMBLE_LEN}><Line at={k * ASSEMBLE_LEN} /></Scene>)}</>;

// Full video: voice + per-line collage scenes + camera that follows the narration + SFX + captions.
const W = wordTimer(TIM);
const st = (k: number) => TIM[k - 1].start;
export const COLLEGE_SECONDS = +(TIM[TIM.length - 1].end + 0.9).toFixed(2);
type K = [number, number, number, number];
// zoom toward (fx,fy) at t, hold, then return to the full frame at back
const zt = (t: number, z: number, fx: number, fy: number, back?: number): K[] => [[t, 1, 540, 960], [t + 0.2, z, fx, fy], ...(back ? [[back, z, fx, fy], [back + 0.2, 1, 540, 960]] as K[] : [])];
// quick punch-in (0.25s) then hold; b is kept as the hold end
const push = (a: number, b: number, z: number, fx: number, fy: number): K[] => [[a, 1, 540, 960], [a + 0.25, z, fx, fy], [Math.max(b, a + 0.3), z, fx, fy]];
const CAMS: K[][] = [
  [[0, 1, 540, 960], ...zt(W(1, 'U.S.A.'), 1.45, 290, 700), [W(1, 'but') , 1.45, 290, 700], [W(1, 'Germany'), 1.45, 800, 700], [W(1, 'zero') + 0.3, 1.45, 800, 700], [W(1, 'zero') + 0.5, 1, 540, 960]],
  push(st(2), TIM[1].end, 1.18, 420, 900),
  [...zt(st(3) + 0.3, 1.3, 540, 380, W(3, 'Before rent')), [TIM[2].end, 1, 540, 960]],
  push(st(4), W(4, 'Yes'), 1.2, 540, 600).concat([[W(4, 'Yes') + 0.2, 1, 540, 960]]),
  [[st(5), 1.25, 360, 450], [W(5, 'bus'), 1.25, 360, 450], [W(5, 'bus') + 0.2, 1.25, 620, 800]],
  [[st(6), 1.25, 540, 760], [st(6) + 0.25, 1, 540, 960]],
  push(st(7) + 0.3, TIM[6].end, 1.22, 540, 560),
  [...zt(st(8) + 0.3, 1.3, 340, 560, W(8, 'They')), [W(8, 'A.P.'), 1.3, 800, 660], [TIM[7].end, 1.3, 800, 660]],
  push(st(9) + 0.3, W(9, 'blocked'), 1.3, 560, 680),
  [[st(10), 1.2, 400, 420], [TIM[9].end, 1.2, 640, 560]],
  [[st(11), 1, 540, 960], ...zt(W(11, 'One hundred'), 1.4, 290, 900), [W(11, 'versus'), 1.4, 290, 900], [W(11, 'zero'), 1.4, 800, 900], [TIM[10].end, 1.4, 800, 900]],
  push(st(12), W(12, 'thirty-nine'), 1.25, 540, 760),
  [[st(13), 1.25, 540, 640], [st(13) + 0.25, 1, 540, 960]],
  push(st(14), TIM[13].end, 1.15, 540, 1000),
];
const SFX: [number, string][] = [
  [W(1, 'U.S.A.'), 'whoosh'], [W(1, 'forty-five'), 'cha-ching'], [W(1, 'Germany'), 'whoosh'], [W(1, 'zero'), 'impact'],
  [W(2, 'Forty-five'), 'cha-ching'], [st(3) + 0.1, 'thud'], [W(3, 'One hundred'), 'ding'], [W(3, 'Before rent'), 'error'],
  [st(4), 'whoosh'], [W(4, 'no tuition'), 'ding'], [W(4, 'Yes'), 'pop'], [W(5, 'semester fee'), 'cha-ching'], [W(5, 'bus'), 'whoosh'],
  [st(6), 'whoosh'], [st(7), 'record-scratch'], [st(8), 'record-scratch'], [W(8, "isn't enough"), 'error'], [st(9), 'record-scratch'],
  [W(9, 'twelve'), 'cha-ching'], [W(9, 'blocked'), 'thud'], [W(10, 'thousand'), 'coins'], [W(11, 'One hundred'), 'whoosh'],
  [W(11, 'One hundred') + 0.15, 'cha-ching'], [W(11, 'zero'), 'whoosh'], [W(11, 'zero') + 0.1, 'impact'], [W(12, 'thirty-nine'), 'ding'],
  [W(13, 'one-hundred'), 'ding'], [st(14), 'whoosh'], [W(14, 'Comment'), 'pop'],
];
const STARTS = [-1.6, ...TIM.slice(1).map((l) => l.start)];
export const CollegeVideo = () => <>
  <Fonts />
  <Audio src={staticFile('voice-college.mp3')} />
  {lines.map((Line, k) => <Scene key={k} from={Math.max(0, STARTS[k])} to={k < 13 ? TIM[k + 1].start : COLLEGE_SECONDS} cam={CAMS[k].map(([t, z, fx, fy]) => [t, Math.min(z, 1.15), fx, 960 + (fy - 960) * 0.25] as K)}><Line at={STARTS[k]} /></Scene>)}
  {SFX.map(([t, n], i) => <Sfx key={i} at={t} name={n} />)}
  <Scene from={0} to={COLLEGE_SECONDS} overlay><OutlineCaptions lines={TIM} end={COLLEGE_SECONDS} y={1305} size={68} /></Scene>
</>;
