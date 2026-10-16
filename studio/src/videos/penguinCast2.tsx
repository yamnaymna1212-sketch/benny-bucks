// Named cast + sets for the inflation episode (still sheet for approval; no video before the user's voiceover).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {HandFont} from '../sketch';
import {Penguin} from '../penguin/rig';
import {BigSeal, Puffin, Seagull, Walrus} from '../penguin/cast';
import {Bedroom, ConeStand, Crowd, FishPrinter, FishReserve, Letter, SnowCone, StatCard, Title, Town} from '../penguin/world';

const N = ({t, x, y, s = 40}: {t: string; x: number; y: number; s?: number}) => <Letter text={t} x={x} y={y} size={s} />;
export const PenguinCast2 = () => <AbsoluteFill style={{background: '#fff'}}>
  <HandFont />
  <Title lines={['MEET THE CAST']} x={540} y={60} size={60} />
  <Penguin x={130} y={430} h={300} id="doug" pose={{beak: 'smile', brows: 'happy', flapR: 70}} /><N t="DOUG" x={130} y={470} s={50} />
  <BigSeal x={380} y={430} h={320} /><N t="BIG SEAL" x={380} y={470} />
  <Puffin x={600} y={430} h={240} pose={{smirk: true}} /><N t="PUFFIN" x={600} y={470} />
  <Walrus x={820} y={430} h={250} /><N t="LANDLORD LARRY" x={820} y={470} s={34} />
  <Seagull x={1010} y={430} h={220} /><N t="TAX GULL" x={1000} y={470} s={34} />
  <FishReserve x={300} y={980} w={520} />
  <FishPrinter x={800} y={980} w={330} on />
  <ConeStand x={290} y={1460} w={400} price="2 fish" cones={5} />
  <Puffin x={290} y={1300} h={170} id="p2" pose={{smirk: true}} />
  <Crowd x={800} y={1440} n={5} h={190} />
  <Town y={1640} />
  <Bedroom x={240} y={1915} w={300} fish={3} id="bedS" />
  <StatCard x={760} y={1800} from="$100" to="$123" fromLabel="2020" toLabel="2025" note="US CPI (BLS)" />
  <SnowCone x={1010} y={1690} w={70} /><SnowCone x={1010} y={1900} w={70} size={0.5} id="small" />
</AbsoluteFill>;
