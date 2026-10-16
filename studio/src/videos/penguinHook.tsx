// First-frame mockup of the series hook (still only): blue title on top, Doug left vs Larry right, like the reference layout.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Fonts} from '../engine';
import {HandFont} from '../sketch';
import {Penguin} from '../penguin/rig';
import {Walrus} from '../penguin/cast';
import {HookTitle, Igloo, PriceTag} from '../penguin/world';

export const PenguinHook = () => <AbsoluteFill style={{background: '#fff'}}>
  <Fonts /><HandFont />
  <HookTitle lines={['Rent Explained', 'by Doug']} at={-1} />
  <Igloo x={540} y={1180} w={300} id="hkIg" />
  <Penguin x={220} y={1250} h={430} id="hkDoug" pose={{brows: 'worried', sweat: true, look: [0.6, 0], turn: 0.3}} />
  <Walrus x={860} y={1250} h={430} pose={{lids: 0.5, look: -0.6}} />
  <PriceTag x={220} y={1380} price="180 fish" fish="every month" at={-1} size={0.75} color="#D83A2E" />
  <PriceTag x={860} y={1380} price="owner" at={-1} size={0.75} color="#2E9E4F" rot={5} />
</AbsoluteFill>;
