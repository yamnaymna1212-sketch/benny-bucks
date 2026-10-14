// College USA $45,000 vs Germany $0 — free local collage (src/collage.tsx).
// college-sheet: 1 frame per line (Gate 2 stills). college-assemble: each line assembles in 2.5s (Gate 3).
import React from 'react';
import {Scene, Fonts, C} from '../engine';
import {Receipt, Calendar, House, GroceryBag, Ticket, Scale} from '../props';
import {TornSplit, Field, Piece, Card, FlagUS, FlagDE} from '../collage';
import {Ivy, PlainUni, Plate, Passport, Bus, QMark, Chalkboard, Book, Diploma, ExamPaper, Vault, Lock, EuroCoin, Mountain, GradCap, Chain, Road, Cross} from './collegeProps';

const US = '#E4572E', DE = '#1F6B4A', CATCH = '#D9A21B', DEBT = '#B8322A', END = '#4B2E6B', CARD = '#FFF3D6';
const Benny = ({pose, at, x = 540}: {pose: string; at: number; x?: number}) => <Piece x={x} y={1650} w={430} at={at} from="bottom" src={`benny-${pose}`} />;
type L = (p: {at: number}) => JSX.Element;

const lines: L[] = [
  ({at}) => <><TornSplit left={US} right={DE} at={at} />
    <Piece x={270} y={250} w={190} at={at + .2} from="top" rot={-6}><FlagUS w={190} /></Piece><Piece x={810} y={250} w={190} at={at + .25} from="top" rot={5}><FlagDE w={190} /></Piece>
    <Piece x={270} y={560} w={440} at={at + .35} from="left" rot={-2}><Ivy w={440} /></Piece><Piece x={810} y={580} w={380} at={at + .4} from="right" rot={2}><PlainUni w={380} /></Piece>
    <Piece x={250} y={880} w={330} at={at + .5} from="left" rot={-4}><Mountain w={330} /></Piece><Piece x={810} y={900} w={260} at={at + .55} from="right"><Plate w={260} /></Piece>
    <Card text="$45,000" x={270} y={1110} at={at + .7} from="pop" rot={-4} color={CARD} ink={US} size={92} /><Card text="$0" x={810} y={1110} at={at + .8} from="pop" rot={4} color={CARD} ink={DE} size={140} />
    <Benny pose="shocked" at={at + .6} /></>,
  ({at}) => <><Field color="#C8512B" />
    <Piece x={540} y={450} w={560} at={at} from="top"><Ivy w={560} /></Piece>
    <Piece x={360} y={950} w={400} at={at + .3} from="left" rot={-8}><Receipt w={400} rows={[['TUITION', '$45,000', C.red], ['RENT', '+', C.ink], ['FOOD', '+', C.ink], ['BOOKS', '+', C.ink]]} /></Piece>
    <Card text="$45,000/yr" x={760} y={1080} at={at + .6} from="pop" rot={5} color={CARD} ink={US} size={80} />
    <Benny pose="worried" at={at + .4} x={760} /></>,
  ({at}) => <><Field color={DEBT} />
    {[1, 2, 3, 4].map((n, i) => <Piece key={n} x={180 + i * 240} y={330 + (i % 2) * 60} w={210} at={at + i * .15} from="top" rot={(i % 2 ? 6 : -6)}><Calendar w={210} month={`YEAR ${n}`} label="$45K" /></Piece>)}
    <Piece x={330} y={760} w={250} at={at + .7} from="left"><House w={250} /></Piece><Piece x={330} y={760} w={220} at={at + .9} from="pop"><Cross w={220} /></Piece>
    <Piece x={750} y={760} w={220} at={at + .75} from="right"><GroceryBag w={220} /></Piece><Piece x={750} y={760} w={220} at={at + .95} from="pop"><Cross w={220} /></Piece>
    <Card text="$180,000" x={540} y={1060} at={at + 1} from="pop" rot={-3} color={CARD} ink={DEBT} size={120} />
    <Benny pose="sad-02" at={at + .5} /></>,
  ({at}) => <><Field color={DE} />
    <Piece x={540} y={480} w={560} at={at} from="top"><PlainUni w={560} /></Piece>
    <Piece x={330} y={900} w={190} at={at + .3} from="left" rot={-10}><Passport w={190} /></Piece><Piece x={750} y={900} w={190} at={at + .35} from="right" rot={8}><Passport w={190} color="#7A1F2B" label="EU" /></Piece>
    <Card text="TUITION €0" x={540} y={1110} at={at + .6} from="pop" rot={-4} color={C.gold} ink={DE} size={96} />
    <Benny pose="excited" at={at + .45} /></>,
  ({at}) => <><Field color="#2E8B57" />
    <Piece x={330} y={420} w={420} at={at} from="left" rot={-6}><Ticket w={420} label="SEMESTER" /></Piece>
    <Piece x={600} y={800} w={560} at={at + .35} from="right"><Bus w={560} /></Piece>
    <Card text="€150–400" x={760} y={420} at={at + .6} from="pop" rot={6} color={CARD} ink={DE} size={80} />
    <Benny pose="pointing" at={at + .45} x={420} /></>,
  ({at}) => <><TornSplit left={US} right={DE} at={at} />
    <Piece x={200} y={330} w={210} at={at + .2} from="left" rot={-12}><FlagUS w={210} /></Piece><Piece x={880} y={330} w={210} at={at + .25} from="right" rot={12}><FlagDE w={210} /></Piece>
    <Piece x={540} y={700} w={420} at={at + .4} from="pop" rot={-4}><QMark w={420} /></Piece>
    <Benny pose="thinking-03" at={at + .5} /></>,
  ({at}) => <><Field color={CATCH} />
    <Card text="CATCH #1" x={540} y={190} at={at} from="top" rot={-3} color={C.ink} ink={CARD} size={70} />
    <Piece x={540} y={560} w={760} at={at + .2} from="top"><Chalkboard w={760} /></Piece>
    <Piece x={820} y={1000} w={220} at={at + .5} from="top" rot={14}><Book w={220} /></Piece>
    <Benny pose="thinking-03" at={at + .4} x={380} /></>,
  ({at}) => <><Field color={CATCH} />
    <Card text="CATCH #2" x={540} y={190} at={at} from="top" rot={3} color={C.ink} ink={CARD} size={70} />
    <Piece x={330} y={540} w={460} at={at + .2} from="left" rot={-4}><Diploma w={460} /></Piece>
    <Card text="NOT ENOUGH" x={330} y={560} at={at + .5} from="pop" rot={-14} color={C.red} ink="#fff" size={56} />
    <Piece x={780} y={500} w={180} at={at + .6} from="right" rot={6}><ExamPaper w={180} label="AP" /></Piece><Piece x={820} y={830} w={180} at={at + .7} from="right" rot={-5}><ExamPaper w={180} label="1 YR" /></Piece>
    <Benny pose="angry" at={at + .4} x={420} /></>,
  ({at}) => <><Field color={CATCH} />
    <Card text="CATCH #3" x={540} y={190} at={at} from="top" rot={-3} color={C.ink} ink={CARD} size={70} />
    <Piece x={540} y={620} w={520} at={at + .2} from="top"><Vault w={520} /></Piece><Piece x={760} y={800} w={170} at={at + .5} from="pop" rot={8}><Lock w={170} /></Piece>
    <Card text="≈ €12,000" x={540} y={1080} at={at + .6} from="pop" rot={3} color={CARD} ink={C.red} size={96} />
    <Benny pose="worried" at={at + .4} x={320} /></>,
  ({at}) => <><Field color="#E9DFC4" />
    {Array.from({length: 12}, (_, i) => <Piece key={i} x={250 + (i % 4) * 190} y={300 + Math.floor(i / 4) * 170} w={130} at={at + i * .06} from="pop"><EuroCoin w={130} /></Piece>)}
    <Piece x={800} y={900} w={240} at={at + .9} from="right"><House w={240} /></Piece>
    <Card text="≈ €1,000/mo" x={420} y={1000} at={at + 1} from="pop" rot={-3} color={DE} ink={CARD} size={80} />
    <Benny pose="saving-cash" at={at + .5} x={480} /></>,
  ({at}) => <><TornSplit left={US} right={DE} at={at} />
    <Piece x={270} y={760} w={480} at={at + .3} from="left"><Mountain w={480} /></Piece><Piece x={810} y={860} w={340} at={at + .4} from="right"><Plate w={340} /></Piece>
    <Card text="$180,000" x={270} y={1180} at={at + .6} from="pop" rot={-4} color={CARD} ink={US} size={90} /><Card text="$0" x={810} y={1180} at={at + .7} from="pop" rot={4} color={CARD} ink={DE} size={150} /></>,
  ({at}) => <><Field color={DEBT} />
    <Piece x={540} y={520} w={480} at={at} from="top" rot={-4}><GradCap w={480} /></Piece>
    <Piece x={540} y={560} w={700} at={at + .35} from="left" rot={-12}><Chain w={700} /></Piece>
    <Card text="$39,500" x={540} y={1000} at={at + .6} from="pop" rot={3} color={CARD} ink={DEBT} size={130} />
    <Benny pose="sad-02" at={at + .45} /></>,
  ({at}) => <><Field color={END} />
    <Piece x={540} y={620} w={760} at={at} from="top"><Scale w={760} tilt={-12} left={<Mountain w={230} />} right={<FlagDE w={170} />} /></Piece>
    <Card text="$180,000 GAP" x={540} y={1090} at={at + .5} from="pop" rot={-3} color={C.gold} ink={END} size={96} />
    <Benny pose="thinking-03" at={at + .35} /></>,
  ({at}) => <><TornSplit left={US} right={DE} at={at} />
    <Piece x={270} y={420} w={400} at={at + .2} from="left" rot={-3}><Ivy w={400} /></Piece><Piece x={810} y={440} w={360} at={at + .25} from="right" rot={3}><PlainUni w={360} /></Piece>
    <Piece x={540} y={920} w={760} at={at + .4} from="bottom"><Road w={760} /></Piece>
    <Card text="WOULD YOU GO?" x={540} y={1140} at={at + .7} from="pop" rot={-3} color={C.gold} ink={END} size={80} />
    <Benny pose="front" at={at + .5} /></>,
];

export const COLLEGE_SHEET_FRAMES = lines.length;
export const CollegeSheet = () => <><Fonts />{lines.map((Line, k) =>
  <Scene key={k} from={k / 30} to={(k + 1) / 30}><Line at={k / 30 - 10} /></Scene>)}</>;

export const ASSEMBLE_LEN = 2.5;
export const COLLEGE_ASSEMBLE_SECONDS = lines.length * ASSEMBLE_LEN;
export const CollegeAssemble = () => <><Fonts />{lines.map((Line, k) =>
  <Scene key={k} from={k * ASSEMBLE_LEN} to={(k + 1) * ASSEMBLE_LEN}><Line at={k * ASSEMBLE_LEN} /></Scene>)}</>;
