// Penguin world reference sheet: the whole cast, outfits, set pieces and story devices on one page.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {HandFont} from '../sketch';
import {Penguin, Seal, Stand} from '../penguin/rig';
import {Flame, FishPile, IceBank, Igloo, Letter, Note, Plus, Sign, SnowPile, Thought, Title, Vault} from '../penguin/world';

export const PenguinWorld = () => <AbsoluteFill style={{background: '#fff'}}>
  <HandFont />
  <Title lines={['PENGUIN ECONOMY']} x={540} y={90} size={70} />
  <Penguin x={110} y={520} h={300} id="a" />
  <Penguin x={320} y={520} h={300} id="b" outfit="rich" pose={{brows: 'angry', turn: -0.3}} />
  <Penguin x={530} y={520} h={300} id="c" outfit="banker" pose={{turn: 0.4}} />
  <Penguin x={740} y={520} h={300} id="d" outfit="burglar" pose={{brows: 'angry'}} />
  <Penguin x={950} y={520} h={300} id="e" outfit="worker" pose={{brows: 'worried'}} />
  {['hero', 'rich', 'banker', 'burglar', 'worker'].map((s, i) => <Letter key={s} text={s} x={110 + i * 210} y={560} size={40} />)}
  <Seal x={180} y={900} h={230} />
  <Stand x={520} y={900} label="RENT" w={260} h={330} counter={90} />
  <Igloo x={860} y={900} w={330} />
  <IceBank x={270} y={1380} w={460} id="bk" />
  <Vault x={760} y={1180} w={250} open={0.75} fish={4} />
  <FishPile x={760} y={1400} n={6} w={120} />
  <FishPile x={960} y={1400} n={3} w={110} rotten={1} seed={2} />
  <Thought x={300} y={1560} w={330} tx={130} ty={1700}><div style={{position: 'relative', width: 330, height: 205}}><Igloo x={165} y={180} w={200} id="ig2" /></div></Thought>
  <Sign x={620} y={1840} text="WE WANT FISH" w={240} />
  <Plus x={830} y={1600} />
  <Note text="interest" x={960} y={1700} toX={960} toY={1580} />
  {[0, 1, 2].map((i) => <Flame key={i} x={880 + i * 70} y={1880} s={0.8} seed={i} />)}
  <SnowPile x={120} y={1880} w={200} />
</AbsoluteFill>;
