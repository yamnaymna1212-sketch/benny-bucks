import {Composition} from 'remotion';
import {PenguinWorld} from './videos/penguinWorld';
import {PenguinCast2} from './videos/penguinCast2';
import {DougGas, DOUG_GAS_SECONDS} from './videos/dougGas';
import {DougRent, DOUG_RENT_SECONDS} from './videos/dougRent';
export const Root = () => (
  <>
    <Composition id="doug-rent" component={DougRent} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_RENT_SECONDS * 30)} />
    <Composition id="doug-gas" component={DougGas} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_GAS_SECONDS * 30)} />
    <Composition id="penguin-cast2" component={PenguinCast2} width={1080} height={1920} fps={30} durationInFrames={60} />
    <Composition id="penguin-world" component={PenguinWorld} width={1080} height={1920} fps={30} durationInFrames={60} />
  </>
);
