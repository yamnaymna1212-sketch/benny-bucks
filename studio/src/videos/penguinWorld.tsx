// Penguin world reference sheet: cast (builds, outfits, side view, expressions), other species, set pieces, story devices.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {HandFont} from '../sketch';
import {Penguin} from '../penguin/rig';
import {Seagull, Walrus} from '../penguin/cast';
import {FishATM, FishPile, IceBank, IceCube, Igloo, Letter, Mansion, PriceTag, Thought, Title, Vault} from '../penguin/world';

const L = ({t, x, y}: {t: string; x: number; y: number}) => <Letter text={t} x={x} y={y} size={36} />;
export const PenguinWorld = () => <AbsoluteFill style={{background: '#fff'}}>
  <HandFont />
  <Title lines={['PENGUIN ECONOMY']} x={540} y={70} size={64} />
  {/* row 1: hero expressions */}
  <Penguin x={100} y={380} h={230} id="e1" pose={{beak: 'smile', brows: 'happy'}} /><L t="happy" x={100} y={410} />
  <Penguin x={270} y={380} h={230} id="e2" pose={{tears: true, brows: 'worried', beak: 'frown'}} /><L t="cry" x={270} y={410} />
  <Penguin x={440} y={380} h={230} id="e3" pose={{sweat: true, brows: 'worried', look: [0.6, 0]}} /><L t="nervous" x={440} y={410} />
  <Penguin x={610} y={380} h={230} id="e4" pose={{angry: 1, brows: 'angry', beak: 'frown'}} /><L t="angry" x={610} y={410} />
  <Penguin x={780} y={380} h={230} id="e5" pose={{brows: 'shock', eyeScale: 1.3, pupil: 0.4, flapL: 110, flapR: 110}} /><L t="shock" x={780} y={410} />
  <Penguin x={960} y={380} h={230} id="e6" pose={{side: true, turn: 1, walk: 0.2}} /><L t="side" x={960} y={410} />
  {/* row 2: builds + outfits */}
  <Penguin x={110} y={730} h={260} id="b1" build="fat" outfit="rich" pose={{lids: 0.5, beak: 'smile'}} /><L t="rich (fat)" x={110} y={760} />
  <Penguin x={320} y={730} h={260} id="b2" build="thin" outfit="worker" pose={{brows: 'worried', lids: 0.3}} /><L t="worker (thin)" x={320} y={760} />
  <Penguin x={510} y={730} h={260} id="b3" outfit="banker" pose={{turn: 0.4}} /><L t="banker" x={510} y={760} />
  <Penguin x={680} y={730} h={260} id="b4" outfit="burglar" pose={{brows: 'angry'}} /><L t="burglar" x={680} y={760} />
  <Penguin x={850} y={730} h={180} id="b5" build="baby" pose={{beak: 'smile'}} /><L t="baby" x={850} y={760} />
  <Penguin x={990} y={730} h={250} id="b6" pose={{sit: 1, lids: 0.45, brows: 'worried', beak: 'frown'}} /><L t="sit" x={990} y={760} />
  {/* row 3: other species */}
  <Walrus x={220} y={1130} h={300} /><L t="walrus = landlord / rich" x={220} y={1165} />
  <Seagull x={560} y={1130} h={260} /><L t="seagull = TAX" x={560} y={1165} />
  <Seagull x={850} y={1060} h={220} id="gfly" pose={{fly: true, holding: true}} /><L t="steals fish" x={850} y={1165} />
  {/* row 4: places */}
  <IceCube x={130} y={1480} w={200} sign="RENT" /><Igloo x={390} y={1480} w={250} /><Mansion x={760} y={1480} w={380} />
  {/* row 5: props + devices */}
  <IceBank x={160} y={1880} w={290} id="bk" />
  <Vault x={420} y={1760} w={170} open={0.7} fish={4} />
  <FishATM x={600} y={1880} w={150} />
  <FishPile x={760} y={1880} n={6} w={90} />
  <PriceTag x={930} y={1640} price="$1,800" fish="= 180 fish" size={0.6} />
  <Thought x={930} y={1800} w={240} tx={1000} ty={1900}><div style={{position: 'relative', width: 240, height: 150}}><Igloo x={120} y={135} w={130} id="ig2" /></div></Thought>
</AbsoluteFill>;
