// College USA $45,000 vs Germany $0 — free local collage (src/collage.tsx). Gate 2 stills: one frame per line.
import React from 'react';
import {Scene, Fonts} from '../engine';
import {Building} from '../props';
import {TornSplit, Piece, Card, FlagUS, FlagDE} from '../collage';

export const COLLEGE_STILLS_SECONDS = 3;
const US = '#E4572E', DE = '#1F6B4A';

// Line 1 — hook: USA college $45,000 (red/orange) vs Germany college $0 (deep green), Benny shocked in the middle.
const L1 = ({at}: {at: number}) => <>
  <TornSplit left={US} right={DE} at={at} />
  <Piece x={270} y={300} w={200} at={at + 0.25} from="top" rot={-6}><FlagUS w={200} /></Piece>
  <Piece x={810} y={300} w={200} at={at + 0.3} from="top" rot={5}><FlagDE w={200} /></Piece>
  <Piece x={270} y={720} w={360} at={at + 0.4} from="left" rot={-3}><Building w={360} /></Piece>
  <Piece x={810} y={720} w={360} at={at + 0.45} from="right" rot={3}><Building w={360} /></Piece>
  <Card text="$45,000" x={270} y={1050} at={at + 0.7} from="pop" rot={-4} color="#FFF3D6" ink={US} size={86} />
  <Card text="$0" x={810} y={1050} at={at + 0.8} from="pop" rot={4} color="#FFF3D6" ink={DE} size={150} />
  <Piece x={540} y={1600} w={470} at={at + 0.55} from="bottom" src="benny-shocked" />
</>;

export const CollegeStills = () => <>
  <Fonts />
  <Scene from={0} to={3}><L1 at={0} /></Scene>
</>;
