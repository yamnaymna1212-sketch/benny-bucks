import {Composition} from 'remotion';
import {PenguinWorld} from './videos/penguinWorld';
import {PenguinCast2} from './videos/penguinCast2';
import {DougGas, DOUG_GAS_SECONDS} from './videos/dougGas';
import {DougRent, DOUG_RENT_SECONDS} from './videos/dougRent';
import {DougVenezuela, DOUG_VENEZUELA_SECONDS} from './videos/dougVenezuela';
import {DougInternet, DOUG_INTERNET_SECONDS} from './videos/dougInternet';
import {DougCollege, DOUG_COLLEGE_SECONDS} from './videos/dougCollege';
import {DougLaundering, DOUG_LAUNDERING_SECONDS} from './videos/dougLaundering';
export const Root = () => (
  <>
    <Composition id="doug-rent" component={DougRent} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_RENT_SECONDS * 30)} />
    <Composition id="doug-gas" component={DougGas} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_GAS_SECONDS * 30)} />
    <Composition id="doug-venezuela" component={DougVenezuela} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_VENEZUELA_SECONDS * 30)} />
    <Composition id="doug-laundering" component={DougLaundering} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_LAUNDERING_SECONDS * 30)} />
    <Composition id="doug-internet" component={DougInternet} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_INTERNET_SECONDS * 30)} />
    <Composition id="doug-college" component={DougCollege} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_COLLEGE_SECONDS * 30)} />
    <Composition id="penguin-cast2" component={PenguinCast2} width={1080} height={1920} fps={30} durationInFrames={60} />
    <Composition id="penguin-world" component={PenguinWorld} width={1080} height={1920} fps={30} durationInFrames={60} />
  </>
);
