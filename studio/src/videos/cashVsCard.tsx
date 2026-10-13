import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {At, Benny, C, Camera, Counter, Fonts, Scene, Sfx, Txt, Words, Z, ramp, useT, wordTimer} from '../engine';
import {Arrow, Bank, BarStack, Bill, BittenCoin, Burrito, Calendar, Card, Coin, FlipCard, Land, Receipt, Sparkles, Tag, Terminal, Ticket, Wallet} from '../props';
import lines from '../data/cash-vs-card.json';

export const CASH_CARD_SECONDS = 60.8;
const w = wordTimer(lines);
const L = (n: number) => lines[n - 1];
const Y = Z.topY;
const Live = ({children}: {children: (t: number) => React.ReactNode}) => <>{children(useT())}</>;
const usd = (n: number) => '$' + n.toFixed(2);
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const CashVsCard = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Fonts />
    <Audio src={staticFile('voice-cash-vs-card.mp3')} />
    <Camera punch={[w(6, 'twenty-four'), w(8, 'two point'), w(11, 'double'), w(13, 'twenty-two'), w(17, 'cash payers'), w(19, 'Twice')]}
      shake={[L(7).start, w(10, 'cover'), w(18, 'cashback')]}>

      {/* 1 Burrito, cash vs card */}
      <Scene from={0} to={L(2).start}>
        <At x={540} y={Y - 40} at={0}><Burrito w={420} /></At>
        <At x={270} y={Y + 190} enter="slideL" at={w(1, 'Cash')}><Bill w={260} label="$10" /></At>
        <At x={810} y={Y + 190} enter="slideR" at={w(1, 'card')}><Card w={280} label="CARD" /></At>
      </Scene>

      {/* 2 Same burrito, same price, who paid extra? */}
      <Scene from={L(2).start} to={L(3).start}>
        <At x={290} y={Y - 30} enter="slideL" at={L(2).start}><Burrito w={340} /></At>
        <At x={790} y={Y - 30} enter="slideR" at={L(2).start + 0.15}><Burrito w={340} /></At>
        <At x={290} y={Y + 160} enter="drop" at={w(2, 'price')}><Tag text="$10" w={240} /></At>
        <At x={790} y={Y + 160} enter="drop" at={w(2, 'price') + 0.1}><Tag text="$10" w={240} /></At>
        <Txt x={540} y={Y - 30} size={160} color={C.red} at={w(2, 'secretly')}>?</Txt>
      </Scene>

      {/* 3 Genius */}
      <Scene from={L(3).start} to={L(4).start}>
        <At x={540} y={Y} at={L(3).start}><Sparkles w={620} at={L(3).start} /></At>
      </Scene>

      {/* 4 Round one: cash, shop keeps all ten */}
      <Scene from={L(4).start} to={L(5).start}>
        <Txt x={540} y={Y - 230} size={60} at={L(4).start}>ROUND 1</Txt>
        <Live>{(t) => { const p = ramp(t, w(4, 'Ten'), w(4, 'shop')); return <At x={220 + 380 * p} y={Y - 20 - 60 * Math.sin(p * Math.PI)} at={w(4, 'Ten')} rot={-10 + 20 * p}><Bill w={230} label="$10" /></At>; }}</Live>
        <At x={790} y={Y} at={L(4).start + 0.2}><Wallet w={300} label="SHOP" /></At>
        <Counter x={790} y={Y + 200} size={70} color={C.green} from={0} to={10} at={w(4, 'shop')} dur={0.6} fmt={usd} />
      </Scene>

      {/* 5 Round two: card, beep */}
      <Scene from={L(5).start} to={L(6).start}>
        <Txt x={540} y={Y - 230} size={60} at={L(5).start}>ROUND 2</Txt>
        <At x={680} y={Y + 20} at={L(5).start}><Live>{(t) => <Terminal w={230} screen={t > w(5, 'Beep') ? 'BEEP!' : '$10.00'} flash={t > w(5, 'Beep') ? 1 : 0} />}</Live></At>
        <Live>{(t) => { const p = ramp(t, w(5, 'card'), w(5, 'Beep')); return <At x={300 + 250 * p} y={Y + 40} at={w(5, 'card')} rot={-20 * (1 - p)}><Card w={250} label="CARD" /></At>; }}</Live>
      </Scene>

      {/* 6 Banks bite off 24 cents */}
      <Scene from={L(6).start} to={L(7).start}>
        <At x={270} y={Y - 10} at={w(6, 'banks')} enter="slideL"><Bank w={330} /></At>
        <At x={760} y={Y - 60} at={w(6, 'penny')}><Live>{(t) => <BittenCoin w={240} bite={ramp(t, w(6, 'bite'), w(6, 'bite') + 0.4)} />}</Live></At>
        <Counter x={760} y={Y + 150} size={64} color={C.green} from={10} to={9.76} at={w(6, 'twenty-four')} dur={0.6} fmt={(n) => `shop: ${usd(n)}`} />
        <At x={760} y={Y + 240} enter="drop" at={w(6, 'twenty-four')}><Tag text="-24¢" color={C.red} w={220} /></At>
      </Scene>

      {/* 7 For a beep?! */}
      <Scene from={L(7).start} to={L(8).start}>
        <At x={540} y={Y} at={L(7).start} shakeAt={[w(7, 'beep')]}><Live>{(t) => <Terminal w={260} screen="BEEP?!" flash={Math.sin(t * 20) > 0 ? 1 : 0} />}</Live></At>
      </Scene>

      {/* 8 Swipe fee 2.36% */}
      <Scene from={L(8).start} to={L(9).start}>
        <At x={330} y={Y}><BarStack h={520} w={240} segs={[['shop', 0.9764, C.green, L(8).start + 0.2], ['', 0.0236, C.red, w(8, 'two point')]]} /></At>
        <At x={700} y={Y - 120} enter="slideR" at={w(8, 'swipe')}><Card w={300} label="SWIPE" /></At>
        <Counter x={720} y={Y + 140} size={110} color={C.red} from={0} to={2.36} at={w(8, 'two point')} dur={0.8} fmt={(n) => n.toFixed(2) + '%'} />
      </Scene>

      {/* 9 Surcharge on the receipt */}
      <Scene from={L(9).start} to={L(10).start}>
        <At x={540} y={Y} at={L(9).start}><Live>{(t) => <Receipt w={540} rows={[['Burrito', '$10.00'], ...(t > w(9, 'three') ? [['Card fee 3%', '+$0.30', C.red]] as [string, string, string][] : []), ...(t > w(9, 'top') ? [['TOTAL', '$10.30']] as [string, string][] : [])]} />}</Live></At>
      </Scene>

      {/* 10 Cover charge */}
      <Scene from={L(10).start} to={L(11).start}>
        <At x={420} y={Y} at={L(10).start}><Burrito w={380} /></At>
        <At x={800} y={Y - 120} enter="drop" at={w(10, 'cover')} rot={8}><Tag text="COVER" color={C.red} w={280} /></At>
      </Scene>

      {/* 11 MIT Celtics auction: card bids more than double */}
      <Scene from={L(11).start} to={L(12).start}>
        <At x={540} y={Y - 170} enter="drop" at={w(11, 'Celtics')}><Ticket w={400} /></At>
        <At x={360} y={Y + 140} at={w(11, 'Card payers')}><Bill w={200} label="CASH" /></At>
        <Live>{(t) => <div style={{position: 'absolute', left: 300, top: Y + 30 - 100 * ramp(t, w(11, 'Card payers'), w(11, 'Card payers') + 0.6), width: 120, height: 100 * ramp(t, w(11, 'Card payers'), w(11, 'Card payers') + 0.6), background: C.green, border: `5px solid ${C.ink}`, borderRadius: 8}} />}</Live>
        <Live>{(t) => <div style={{position: 'absolute', left: 660, top: Y + 30 - 220 * ramp(t, w(11, 'double') - 0.3, w(11, 'double') + 0.5), width: 120, height: 220 * ramp(t, w(11, 'double') - 0.3, w(11, 'double') + 0.5), background: C.blue, border: `5px solid ${C.ink}`, borderRadius: 8}} />}</Live>
        <At x={720} y={Y + 140} at={w(11, 'Card payers')}><Card w={200} label="CARD" /></At>
        <Txt x={880} y={Y - 110} size={70} color={C.red} at={w(11, 'double')}>2X+</Txt>
      </Scene>

      {/* 12 Two burritos */}
      <Scene from={L(12).start} to={L(13).start}>
        <At x={300} y={Y} at={w(12, 'two')}><Burrito w={340} /></At>
        <At x={780} y={Y} at={w(12, 'two') + 0.15}><Burrito w={340} /></At>
        <At x={540} y={Y - 40} at={w(12, 'two')}><Sparkles w={700} at={w(12, 'two')} /></At>
      </Scene>

      {/* 13 Hurts less; 22% a year, months flip */}
      <Scene from={L(13).start} to={L(14).start}>
        <At x={300} y={Y} at={w(13, 'balance')}><Live>{(t) => <Calendar w={300} month={MONTHS[Math.min(11, Math.floor(ramp(t, w(13, 'balance'), L(13).end, 0, 12)))]} />}</Live></At>
        <Counter x={760} y={Y - 40} size={130} color={C.red} from={0} to={22} at={w(13, 'twenty-two')} dur={0.8} fmt={(n) => Math.round(n) + '%'} />
        <Txt x={760} y={Y + 80} size={50} at={w(13, 'year')}>per year</Txt>
        <At x={760} y={Y - 200} at={w(13, 'hurt')} until={w(13, 'balance')}><Card w={260} label="CARD" /></At>
      </Scene>

      {/* 14 Payment plan */}
      <Scene from={L(14).start} to={L(15).start}>
        <At x={360} y={Y} at={L(14).start}><Burrito w={340} /></At>
        <At x={780} y={Y} enter="drop" at={w(14, 'payment')}><Calendar w={260} month="PLAN" label="1/12" /></At>
      </Scene>

      {/* 15 Twist: flip card */}
      <Scene from={L(15).start} to={L(16).start}>
        <At x={540} y={Y} at={L(15).start}><FlipCard w={360} h={460} at={w(15, 'twist')}><Wallet w={300} label="CASH" /></FlipCard></At>
      </Scene>

      {/* 16 Prices rise for everyone, even the cash guy */}
      <Scene from={L(16).start} to={L(17).start}>
        {[0, 1, 2].map((i) => <At key={i} x={220 + i * 320} y={Y - 120} at={w(16, 'prices') + i * 0.12}><Live>{(t) => <Tag w={250} text={t > w(16, 'cover') ? '$10.24' : '$10.00'} color={t > w(16, 'cover') ? C.red : C.gold} />}</Live></At>)}
        <At x={540} y={Y + 40} at={w(16, 'cover')}><Arrow w={120} /></At>
        <At x={540} y={Y + 220} enter="slideL" at={w(16, 'cash guy')}><Wallet w={260} label="CASH" /></At>
      </Scene>

      {/* 17 Boston Fed: cash payers fund card rewards (coins flow wallet → card) */}
      <Scene from={L(17).start} to={L(18).start}>
        <Txt x={540} y={Y - 230} size={56} at={w(17, 'Boston')}>BOSTON FED STUDY</Txt>
        <At x={230} y={Y + 20} at={w(17, 'cash payers')} enter="slideL"><Wallet w={280} label="CASH" /></At>
        <At x={850} y={Y + 20} at={w(17, 'card rewards')} enter="slideR"><Card w={280} label="REWARDS" color={C.gold} /></At>
        {[0, 1, 2, 3].map((i) => <Live key={i}>{(t) => { const a = w(17, 'help') + i * 0.35; if (t < a) return null; const p = ((t - a) / 1.1) % 1;
          return <At x={330 + 420 * p} y={Y - 10 - 90 * Math.sin(p * Math.PI)}><Coin w={90} label="$" spin={t * 6} /></At>; }}</Live>)}
      </Scene>

      {/* 18 My cashback? */}
      <Scene from={L(18).start} to={L(19).start}>
        <At x={360} y={Y} at={L(18).start}><Wallet w={300} label="CASH" /></At>
        <At x={760} y={Y} at={w(18, 'cashback')}><Card w={300} label="CASHBACK" color={C.gold} /></At>
        <At x={560} y={Y - 10} at={w(18, 'cashback')} rot={90}><Arrow w={110} color={C.gold} /></At>
      </Scene>

      {/* 19 Pay in full: you win. Don't: bank wins twice */}
      <Scene from={L(19).start} to={L(20).start}>
        <At x={260} y={Y} enter="fade" at={w(19, 'full')}><Land kind="green" label="YOU WIN" w={400} /></At>
        <At x={820} y={Y} enter="fade" at={w(19, 'bank')}><Land kind="cracked" label="BANK WINS" w={400} /></At>
        <Txt x={800} y={Y + 200} size={80} color={C.red} at={w(19, 'Twice')}>x2</Txt>
      </Scene>

      {/* 20 Cash vs card */}
      <Scene from={L(20).start} to={CASH_CARD_SECONDS}>
        <At x={260} y={Y} enter="slideL" at={L(20).start}><Bill w={300} label="CASH" /></At>
        <Txt x={540} y={Y} size={90} at={L(20).start + 0.3}>VS</Txt>
        <At x={820} y={Y} enter="slideR" at={L(20).start + 0.2}><Card w={300} label="CARD" /></At>
      </Scene>

      {/* Benny narrator + middle word */}
      <Scene from={0} to={CASH_CARD_SECONDS} overlay>
        <Benny poses={[[0, 'benny-front'], [L(2).start, 'benny-thinking-03'], [L(3).start, 'benny-excited'], [L(4).start, 'benny-front'], [L(5).start, 'benny-pointing'],
          [L(6).start, 'benny-worried'], [L(7).start, 'benny-angry'], [L(8).start, 'benny-thinking-03'], [L(9).start, 'benny-sad-02'], [L(10).start, 'benny-shocked'],
          [L(11).start, 'benny-front'], [L(12).start, 'benny-excited'], [L(13).start, 'benny-worried'], [L(14).start, 'benny-sad'], [L(15).start, 'benny-thinking-03'],
          [L(16).start, 'benny-pointing'], [L(17).start, 'benny-front'], [L(18).start, 'benny-shocked'], [L(19).start, 'benny-pointing'], [L(20).start, 'benny-front']]} />
        <Words end={CASH_CARD_SECONDS} items={[
          [0, '$10 BURRITO'], [w(1, 'Cash'), 'CASH', C.green], [w(1, 'card'), 'CARD', C.blue],
          [L(2).start, 'SAME BURRITO'], [w(2, 'price'), 'SAME PRICE'], [w(2, 'secretly'), 'WHO PAID EXTRA?', C.red],
          [L(3).start, 'GENIUS'], [L(4).start, 'ROUND 1: CASH', C.green], [w(4, 'shop'), 'ALL $10', C.green],
          [L(5).start, 'ROUND 2: CARD', C.blue], [w(5, 'Beep'), 'BEEP!'], [w(6, 'banks'), 'THE BANKS'], [w(6, 'twenty-four'), '24¢', C.red],
          [L(7).start, 'FOR A BEEP?!', C.red], [w(8, 'swipe'), 'SWIPE FEE'], [w(8, 'two point'), '2.36%', C.red],
          [L(9).start, 'SOME SHOPS'], [w(9, 'three'), '+3%', C.red], [L(10).start, 'COVER CHARGE?'],
          [L(11).start, 'MIT'], [w(11, 'Celtics'), 'CELTICS'], [w(11, 'Card payers'), 'CARD PAYERS'], [w(11, 'double'), 'MORE THAN 2X', C.red],
          [L(12).start, 'DOUBLE?!'], [w(12, 'two'), '2 BURRITOS', C.green],
          [L(13).start, 'HURTS LESS'], [w(13, 'balance'), 'CARRY A BALANCE?'], [w(13, 'twenty-two'), '22% A YEAR', C.red],
          [L(14).start, 'PAYMENT PLAN', C.red], [L(15).start, 'WHO PAID EXTRA?'], [w(15, 'twist'), 'TWIST'],
          [L(16).start, 'PRICES UP', C.red], [w(16, 'everyone'), 'EVERYONE'], [w(16, 'cash guy'), 'EVEN CASH GUY'],
          [L(17).start, 'BOSTON FED'], [w(17, 'cash payers'), 'CASH PAYERS'], [w(17, 'card rewards'), 'FUND REWARDS', C.red],
          [L(18).start, 'CASH GUY...'], [w(18, 'cashback'), 'MY CASHBACK?!'],
          [w(19, 'full'), 'PAY IN FULL', C.green], [w(19, 'win.'), 'YOU WIN', C.green], [w(19, 'bank'), 'BANK WINS', C.red], [w(19, 'Twice'), 'TWICE', C.red],
          [L(20).start, 'CASH OR CARD?'], [w(20, 'Comment'), 'COMMENT ↓']]} />
        <Txt x={120} y={215} size={44} color={C.red} rot={-8} at={w(2, 'secretly')} until={w(15, 'twist')}>WHO?</Txt>
      </Scene>
    </Camera>

    <Sfx at={0.2} name="pop" /><Sfx at={w(1, 'Cash')} name="whoosh" /><Sfx at={w(1, 'card')} name="whoosh" />
    <Sfx at={w(2, 'price')} name="thud" /><Sfx at={w(2, 'secretly')} name="record-scratch" vol={0.6} /><Sfx at={L(3).start} name="cha-ching" vol={0.35} />
    <Sfx at={w(4, 'Ten')} name="whoosh" /><Sfx at={w(4, 'shop')} name="ding" vol={0.35} /><Sfx at={w(5, 'Beep')} name="tick" vol={0.7} /><Sfx at={w(5, 'Beep') + 0.12} name="tick" vol={0.7} />
    <Sfx at={w(6, 'bite')} name="crack" vol={0.4} /><Sfx at={w(6, 'twenty-four')} name="impact" vol={0.45} /><Sfx at={L(7).start} name="boing" vol={0.4} />
    <Sfx at={w(8, 'swipe')} name="whoosh" /><Sfx at={w(8, 'two point')} name="thud" /><Sfx at={w(9, 'three')} name="error" vol={0.3} /><Sfx at={w(10, 'cover')} name="record-scratch" vol={0.5} />
    <Sfx at={w(11, 'Celtics')} name="pop" /><Sfx at={w(11, 'double')} name="spring" vol={0.4} /><Sfx at={w(12, 'two')} name="cha-ching" vol={0.35} />
    <Sfx at={w(13, 'balance')} name="riser" vol={0.2} /><Sfx at={w(13, 'twenty-two')} name="impact" vol={0.45} /><Sfx at={w(14, 'payment')} name="sad-horn" vol={0.25} />
    <Sfx at={L(15).start} name="riser" vol={0.25} /><Sfx at={w(15, 'twist')} name="flip" /><Sfx at={w(16, 'cover')} name="spring" vol={0.35} />
    <Sfx at={w(17, 'help')} name="coins" vol={0.35} /><Sfx at={w(18, 'cashback')} name="record-scratch" vol={0.5} />
    <Sfx at={w(19, 'full')} name="ding" vol={0.3} /><Sfx at={w(19, 'bank')} name="thud" /><Sfx at={w(19, 'Twice')} name="impact" vol={0.4} />
    <Sfx at={L(20).start} name="whoosh" /><Sfx at={w(20, 'Comment')} name="pop" />
  </AbsoluteFill>
);
