// Review sheet of every icon id used by ICON_WORDS (render 1 frame: npx remotion still src/index.ts icon-gallery out.png).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Fonts} from '../engine';
import {GridField} from '../grid';
import {ICON_WORDS, IconArt, iconExists} from '../icons';

export const IconGallery = () => {
  const ids = [...new Set(Object.values(ICON_WORDS))].filter(iconExists);
  return <AbsoluteFill><Fonts /><GridField />
    <div style={{position: 'absolute', inset: 30, display: 'flex', flexWrap: 'wrap', gap: 22, alignContent: 'flex-start'}}>
      {ids.map((id) => <div key={id} style={{width: 150, height: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{height: 135, display: 'flex', alignItems: 'center'}}><IconArt id={id} size={120} /></div>
        <div style={{fontFamily: 'Montserrat', fontSize: 15, fontWeight: 700}}>{id}</div></div>)}
    </div></AbsoluteFill>;
};
