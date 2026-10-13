import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {At, AutoCaptions, Backdrop, Benny, C, Camera, Counter, Fonts, Scene, Sfx, Stage, Txt, Z, ramp, useT, wordTimer} from '../engine';
import {Arrow, Balloon, Bank, Bill, Building, Calendar, FlipCard, FollowButton, Globe, GroceryBag, House, Land, LoanDoc, MouseTrap, Printer, Scale, Sparkles, Stack, Tag} from '../props';
import {DrawArrow, DrawCircle} from '../draw';
import lines from '../data/rich-get-richer.json';

export const RICH_SECONDS = 55.2;
const w = wordTimer(lines);
const L = (n: number) => lines[n - 1];
const Y = Z.topY;
const Live = ({children}: {children: (t: number) => React.ReactNode}) => <>{children(useT())}</>;
const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const BLUE = ['#EEF3F9', '#DCE8F5'], RED = ['#FBEDE8', '#F8D9CF'], GREEN = ['#EEF6E8', '#DCEFD0'], GOLD = ['#FFF5DC', '#FDE9B5'], SAND = ['#F4F1EA', '#E9E4D8'];
const S = (from: number, to: number, col: string[], children: React.ReactNode, cam?: [number, number, number, number][]) =>
  <Scene from={from} to={to} overlay cam={cam}><Stage color={col[1]} from={from} />{children}</Scene>;

export const RichGetRicher = () => (
  <AbsoluteFill>
    <Fonts />
    <Audio src={staticFile('voice-rich-get-richer.mp3')} />
    <Scene from={0} to={RICH_SECONDS} overlay>
      <Backdrop keys={[[0, SAND[0]], [L(2).start, BLUE[0]], [L(3).start, RED[0]], [L(5).start, GREEN[0]], [L(8).start, RED[0]], [L(9).start, GREEN[0]],
        [L(10).start, GOLD[0]], [L(11).start, BLUE[0]], [L(12).start, GREEN[0]], [L(13).start, SAND[0]], [L(14).start, GOLD[0]]]} />
    </Scene>
    <Camera punch={[0.05, w(3, 'billions'), w(6, 'million'), w(10, 'secret'), w(12, 'cheaper'), w(13, 'real world')]} shake={[w(4, 'Rent'), w(5, 'trap')]}>

      {/* 1 HOOK: poor stack shrinks, rich stack grows; circle the rich pile */}
      {S(0, L(2).start, SAND, <>
        <At x={300} y={Y + 40} at={0}><Live>{(t) => <Stack w={380} n={ramp(t, 0.2, 2.0, 8, 2)} color={C.bill} />}</Live></At>
        <At x={300} y={Y - 210} at={w(1, 'poorer')}><Arrow w={110} rot={180} /></At>
        <At x={780} y={Y + 40} at={0.1}><Live>{(t) => <Stack w={380} n={ramp(t, w(1, 'rich'), L(1).end, 4, 16)} color={C.bill} />}</Live></At>
        <At x={780} y={Y - 210} at={w(1, 'richer')}><Arrow w={110} color={C.green} /></At>
        <DrawCircle x={780} y={Y + 40} rx={210} ry={200} at={w(1, 'richer')} color={C.green} />
      </>, [[0, 1, 540, 960], [0.3, 1.1, 540, 900], [L(2).start, 1.13, 540, 890]])}

      {/* 2 Normal guy saves in the bank */}
      {S(L(2).start, L(3).start, BLUE, <>
        <DrawArrow from={[860, 760]} to={[700, 1140]} at={w(2, 'normal')} />
        <Txt x={300} y={420} size={56} at={w(2, 'normal')} enter="slideL">NORMAL GUY</Txt>
        <At x={360} y={Y + 70} at={L(2).start}><Bank w={400} /></At>
        <Live>{(t) => [0, 1, 2].map((i) => { const a = w(2, 'saves') + i * 0.25; if (t < a) return null; const p = Math.min(1, (t - a) / 0.6);
          return <At key={i} x={800 - 420 * p} y={Y - 120 + 160 * p} rot={-20 * p}><Bill w={150} label="$" /></At>; })}</Live>
        <Counter x={760} y={Y + 200} size={64} color={C.green} from={0} to={10000} at={w(2, 'saves')} dur={1} fmt={usd} />
      </>)}

      {/* 3 The Fed creates billions */}
      {S(L(3).start, L(4).start, RED, <>
        <At x={420} y={Y} at={L(3).start}><Live>{(t) => <Printer w={460} t={t} />}</Live></At>
        <At x={810} y={Y + 60} at={w(3, 'billions')}><Live>{(t) => <Stack w={280} n={ramp(t, w(3, 'billions'), L(3).end, 2, 16)} />}</Live></At>
        <Txt x={810} y={Y - 200} size={60} color={C.red} at={w(3, 'billions')}>+ BILLIONS</Txt>
      </>)}

      {/* 4 Inflation: balloon, groceries, rent, cash loses value */}
      {S(L(4).start, L(5).start, RED, <>
        <At x={540} y={Y} at={w(4, 'inflation')} until={w(4, 'Groceries')}><Live>{(t) => <Balloon w={300} size={ramp(t, w(4, 'inflation'), w(4, 'Groceries'), 0.5, 1)} />}</Live></At>
        <At x={420} y={Y + 20} at={w(4, 'Groceries')} until={w(4, 'Rent')} enter="slideL"><GroceryBag w={340} /></At>
        <At x={760} y={Y - 60} at={w(4, 'more')} until={w(4, 'Rent')} enter="drop"><Tag text="PRICE ↑" color={C.red} w={300} /></At>
        <At x={420} y={Y + 20} at={w(4, 'Rent')} until={w(4, 'His')} enter="slideL"><House w={390} /></At>
        <At x={760} y={Y - 60} at={w(4, 'up')} until={w(4, 'His')} enter="drop"><Tag text="RENT ↑" color={C.red} w={300} /></At>
        <At x={400} y={Y} at={w(4, 'His')}><Live>{(t) => <div style={{transform: `scale(${ramp(t, w(4, 'loses'), L(4).end, 1, 0.78)})`}}><Bill w={420} label="$10,000" /></div>}</Live></At>
        <Counter x={780} y={Y - 40} size={68} color={C.red} from={10000} to={7750} at={w(4, 'loses')} dur={1.4} fmt={(n) => 'buys ' + usd(n)} />
        <Txt x={780} y={Y + 60} size={40} at={w(4, 'loses')}>2020 → 2026</Txt>
      </>)}

      {/* 5 Rich Benny knows cash is a trap */}
      {S(L(5).start, L(6).start, GREEN, <>
        <Txt x={540} y={400} size={74} color={C.green} at={w(5, 'Rich')} enter="drop">RICH BENNY</Txt>
        <At x={540} y={Y - 160} at={w(5, 'Rich')}><Sparkles w={620} at={w(5, 'Rich')} /></At>
        <At x={540} y={Y + 110} at={L(5).start + 0.1}><Live>{(t) => <MouseTrap w={460} snap={ramp(t, w(5, 'trap'), w(5, 'trap') + 0.12)} />}</Live></At>
      </>)}

      {/* 6 Exact opposite: bank → $1,000,000 loan */}
      {S(L(6).start, L(7).start, GREEN, <>
        <Txt x={540} y={420} size={74} at={L(6).start} until={w(6, 'walks')}>↩ OPPOSITE</Txt>
        <At x={540} y={Y + 80} at={L(6).start + 0.2} until={w(6, 'walks')}><Stack w={300} n={10} /></At>
        <At x={330} y={Y + 40} at={w(6, 'walks')} enter="slideL"><Bank w={420} /></At>
        <Live>{(t) => { const a = w(6, 'borrows'); if (t < a) return null; const p = ramp(t, a, a + 0.5);
          return <At x={420 + 360 * p} y={Y + 20}><LoanDoc w={300} /></At>; }}</Live>
        <Counter x={760} y={Y - 220} size={76} color={C.green} from={0} to={1000000} at={w(6, 'million')} dur={0.8} fmt={usd} />
      </>)}

      {/* 7 Debt buys a real asset */}
      {S(L(7).start, L(8).start, GREEN, <>
        <At x={300} y={Y} at={L(7).start} until={w(7, 'real')}><LoanDoc w={300} /></At>
        <At x={300} y={Y} at={w(7, 'real')} until={w(7, 'apartment')}><Arrow w={130} color={C.green} rot={90} /></At>
        <At x={680} y={Y + 20} at={w(7, 'real')}><Building w={380} /></At>
        <At x={340} y={Y + 150} at={w(7, 'asset')} enter="drop"><Tag text="REAL ASSET" color={C.gold} w={330} /></At>
      </>)}

      {/* 8 Watch what inflation does */}
      {S(L(8).start, L(9).start, RED, <>
        <At x={300} y={Y} at={L(8).start}><Live>{(t) => <Balloon w={300} size={0.8 + 0.1 * Math.sin(t * 6)} />}</Live></At>
        <At x={760} y={Y + 20} at={L(8).start + 0.2}><Building w={340} /></At>
        <DrawArrow from={[400, Y - 140]} to={[640, Y - 120]} at={w(8, 'does')} />
      </>)}

      {/* 9 Building value up, rent up */}
      {S(L(9).start, L(10).start, GREEN, <>
        <At x={360} y={Y + 30} at={L(9).start}><Live>{(t) => <div style={{transform: `scale(${ramp(t, w(9, 'building'), w(9, 'value'), 1, 1.15)})`, transformOrigin: '50% 100%'}}><Building w={350} /></div>}</Live></At>
        <Live>{(t) => { const a = w(9, 'goes up'); if (t < a) return null; return <At x={760} y={Y - 80 - 60 * ramp(t, a, a + 1)}><Tag text="VALUE ↑" color={C.green} w={300} /></At>; }}</Live>
        <At x={760} y={Y + 140} at={w(9, 'rent')} enter="drop"><Tag text="RENT ↑" color={C.gold} w={300} /></At>
        <Live>{(t) => [0, 1, 2].map((i) => { const a = w(9, 'tenants') + i * 0.2; if (t < a) return null; const p = ((t - a) / 0.8) % 1;
          return <At key={i} x={760 - 380 * p} y={Y + 260 - 120 * Math.sin(p * Math.PI)}><Bill w={110} label="$" /></At>; })}</Live>
      </>)}

      {/* 10 Secret: fixed loan stays the same while years pass */}
      {S(L(10).start, L(11).start, GOLD, <>
        <At x={330} y={Y} at={L(10).start}><FlipCard w={330} h={430} at={w(10, 'million-dollar')}><LoanDoc w={260} fixed /></FlipCard></At>
        <At x={760} y={Y - 40} at={w(10, 'stays')}><Live>{(t) => <Calendar w={260} month="YEAR" label={String(2026 + Math.floor(ramp(t, w(10, 'stays'), L(10).end, 0, 10)))} />}</Live></At>
        <Txt x={760} y={Y + 190} size={64} color={C.green} at={w(10, 'same')}>STILL $1M</Txt>
      </>)}

      {/* 11 Normal Benny's savings shrink */}
      {S(L(11).start, L(12).start, BLUE, <>
        <At x={400} y={Y} at={L(11).start}><Live>{(t) => <div style={{transform: `scale(${ramp(t, w(11, 'worth'), L(11).end, 1, 0.65)})`}}><Bill w={440} label="$10,000" /></div>}</Live></At>
        <At x={800} y={Y} at={w(11, 'less')}><Arrow w={150} rot={180} /></At>
      </>)}

      {/* 12 Debt cheaper, assets more valuable */}
      {S(L(12).start, L(13).start, GREEN, <>
        <At x={540} y={Y + 10} at={L(12).start}><Live>{(t) => <Scale w={820} tilt={ramp(t, w(12, 'assets'), L(12).end, 0, 14)}
          left={<div style={{transform: `scale(${ramp(t, w(12, 'cheaper'), w(12, 'cheaper') + 0.8, 1, 0.65)})`, transformOrigin: '50% 100%'}}><LoanDoc w={150} /></div>}
          right={<div style={{transform: `scale(${ramp(t, w(12, 'valuable'), L(12).end, 1, 1.3)})`, transformOrigin: '50% 100%'}}><Building w={160} /></div>} />}</Live></At>
        <Txt x={250} y={Y + 270} size={50} color={C.green} at={w(12, 'cheaper')}>DEBT ↓</Txt>
        <Txt x={830} y={Y + 270} size={50} color={C.green} at={w(12, 'valuable')}>ASSETS ↑</Txt>
      </>)}

      {/* 13 Paper money vs the real world */}
      {S(L(13).start, L(14).start, SAND, <>
        <At x={280} y={Y + 80} enter="slideL" at={L(13).start}><Land kind="cracked" label="PAPER" w={420} /></At>
        <At x={280} y={Y - 110} at={w(13, 'save')}><Bill w={200} label="$" /></At>
        <At x={800} y={Y + 80} enter="slideR" at={w(13, 'The rich')}><Land kind="green" label="REAL WORLD" w={420} /></At>
        <At x={760} y={Y - 120} at={w(13, 'real world')}><Building w={150} /></At>
        <At x={880} y={Y - 90} at={w(13, 'real world') + 0.1}><Live>{(t) => <Globe w={130} spin={t} />}</Live></At>
      </>)}

      {/* 14 Follow */}
      {S(L(14).start, RICH_SECONDS, GOLD, <>
        <At x={540} y={Y - 60} at={L(14).start}><Sparkles w={700} at={L(14).start} /></At>
        <At x={540} y={Y + 40} at={L(14).start}><FollowButton w={520} /></At>
        <DrawCircle x={540} y={Y + 40} rx={310} ry={130} at={w(14, 'Follow') + 0.15} />
      </>)}

      {/* Benny + captions */}
      <Scene from={0} to={RICH_SECONDS} overlay>
        <Benny poses={[[0, 'benny-sad-02'], [w(1, 'rich'), 'benny-smug-cash-pile'], [L(2).start, 'benny-front'], [w(2, 'saves'), 'benny-saving-cash'],
          [L(3).start, 'benny-shocked'], [w(3, 'billions'), 'benny-angry'], [L(4).start, 'benny-thinking-03'], [w(4, 'Groceries'), 'benny-shocked'], [w(4, 'Rent'), 'benny-angry'], [w(4, 'His'), 'benny-sad-02'],
          [L(5).start, 'benny-smug-cash-pile'], [w(5, 'trap'), 'benny-pointing'], [L(6).start, 'benny-smug-cash-pile'], [w(6, 'walks'), 'benny-running-cash'], [w(6, 'million'), 'benny-excited'],
          [L(7).start, 'benny-smug-cash-pile'], [w(7, 'apartment'), 'benny-pointing'], [L(8).start, 'benny-thinking-03'], [L(9).start, 'benny-excited'], [w(9, 'rent'), 'benny-smug-cash-pile'],
          [L(10).start, 'benny-front'], [w(10, 'fixed-rate'), 'benny-smug-cash-pile'], [L(11).start, 'benny-sad-02'], [w(11, 'less and'), 'benny-thinking-03'],
          [L(12).start, 'benny-smug-cash-pile'], [w(12, 'assets'), 'benny-excited'], [L(13).start, 'benny-sad-02'], [w(13, 'The rich'), 'benny-smug-cash-pile'],
          [L(14).start, 'benny-pointing'], [w(14, 'Follow'), 'benny-excited']]} />
        <AutoCaptions lines={lines} end={RICH_SECONDS} emphasis={{poorer: C.red, richer: C.green, poor: C.red, rich: C.green, saves: C.blue, fed: C.red, billions: C.red, inflation: C.red,
          groceries: C.red, rent: C.red, value: C.red, trap: C.red, opposite: C.green, million: C.green, borrows: C.green, asset: C.green, building: C.green, secret: C.gold,
          'fixed-rate': C.gold, same: C.green, less: C.red, cheaper: C.green, valuable: C.green, paper: C.red, real: C.green, world: C.green, follow: C.red}} />
      </Scene>
    </Camera>

    <Sfx at={0.03} name="impact" vol={0.6} /><Sfx at={w(1, 'poorer')} name="thud" /><Sfx at={w(1, 'richer')} name="cha-ching" vol={0.45} />
    <Sfx at={w(2, 'normal')} name="whoosh" /><Sfx at={w(2, 'saves')} name="coins" vol={0.35} />
    <Sfx at={L(3).start} name="hum" vol={0.3} /><Sfx at={w(3, 'billions')} name="cash-rain" vol={0.4} />
    <Sfx at={w(4, 'inflation')} name="riser" vol={0.25} /><Sfx at={w(4, 'Groceries')} name="pop" /><Sfx at={w(4, 'Rent')} name="thud" /><Sfx at={w(4, 'loses')} name="sad-horn" vol={0.2} />
    <Sfx at={w(5, 'Rich')} name="ding" vol={0.35} /><Sfx at={w(5, 'trap')} name="impact" vol={0.5} />
    <Sfx at={w(6, 'opposite')} name="record-scratch" vol={0.5} /><Sfx at={w(6, 'walks')} name="whoosh" /><Sfx at={w(6, 'million')} name="cha-ching" vol={0.45} />
    <Sfx at={w(7, 'real')} name="pop" /><Sfx at={w(7, 'asset')} name="thud" /><Sfx at={w(8, 'does')} name="whoosh" />
    <Sfx at={w(9, 'goes up')} name="spring" vol={0.35} /><Sfx at={w(9, 'tenants')} name="coins" vol={0.35} />
    <Sfx at={L(10).start} name="riser" vol={0.25} /><Sfx at={w(10, 'million-dollar')} name="flip" /><Sfx at={w(10, 'same')} name="ding" vol={0.3} />
    <Sfx at={w(11, 'worth')} name="sad-horn" vol={0.2} /><Sfx at={w(12, 'cheaper')} name="thud" /><Sfx at={w(12, 'valuable')} name="cha-ching" vol={0.4} />
    <Sfx at={L(13).start} name="whoosh" /><Sfx at={w(13, 'The rich')} name="whoosh" /><Sfx at={w(13, 'real world')} name="impact" vol={0.45} />
    <Sfx at={w(14, 'Follow')} name="pop" /><Sfx at={w(14, 'Follow') + 0.15} name="ding" vol={0.3} />
  </AbsoluteFill>
);
