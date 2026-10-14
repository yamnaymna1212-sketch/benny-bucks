import {Composition} from 'remotion';
import {GasIran, GAS_IRAN_SECONDS} from './videos/gasIran';
import {CashVsCard, CASH_CARD_SECONDS} from './videos/cashVsCard';
import {RichGetRicher, RICH_SECONDS} from './videos/richGetRicher';
import {StyleTest, STYLE_SECONDS} from './videos/styleTest';
import {House, HOUSE_SECONDS} from './videos/house';
import {Bonus, BONUS_SECONDS} from './videos/bonus';
import {CollegeSheet, COLLEGE_SHEET_FRAMES, CollegeAssemble, COLLEGE_ASSEMBLE_SECONDS, CollegeVideo, COLLEGE_SECONDS} from './videos/collegeGermany';
export const Root = () => (
  <>
    <Composition id="gas-iran" component={GasIran} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(GAS_IRAN_SECONDS * 30)} />
    <Composition id="cash-vs-card" component={CashVsCard} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(CASH_CARD_SECONDS * 30)} />
    <Composition id="rich-get-richer" component={RichGetRicher} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(RICH_SECONDS * 30)} />
    <Composition id="style-test" component={StyleTest} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(STYLE_SECONDS * 30)} />
    <Composition id="house" component={House} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(HOUSE_SECONDS * 30)} />
    <Composition id="bonus" component={Bonus} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(BONUS_SECONDS * 30)} />
    <Composition id="college-sheet" component={CollegeSheet} width={1080} height={1920} fps={30} durationInFrames={COLLEGE_SHEET_FRAMES} />
    <Composition id="college-assemble" component={CollegeAssemble} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(COLLEGE_ASSEMBLE_SECONDS * 30)} />
    <Composition id="college-germany" component={CollegeVideo} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(COLLEGE_SECONDS * 30)} />
  </>
);
