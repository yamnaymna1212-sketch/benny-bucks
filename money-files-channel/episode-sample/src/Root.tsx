import React from 'react';
import {Composition} from 'remotion';
import {Episode} from './Episode';
import {AuditorScene} from './AuditorScene';
import {CaseScene, CharacterSheet, CASE_LEN} from './CaseScene';
export const Root: React.FC = () => (
  <>
  <Composition id="Episode" component={Episode} durationInFrames={660} fps={30} width={1920} height={1080} />
  <Composition id="Auditor" component={AuditorScene} durationInFrames={300} fps={30} width={1920} height={1080} />
  <Composition id="Case" component={CaseScene} durationInFrames={CASE_LEN} fps={30} width={1920} height={1080} />
  <Composition id="Sheet" component={CharacterSheet} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
