import {Composition} from 'remotion';
import {PenguinTest, PENGUIN_TEST_SECONDS} from './videos/penguinTest';
import {PenguinWorld} from './videos/penguinWorld';
import {PenguinRent, PENGUIN_RENT_SECONDS} from './videos/penguinRent';
import {PenguinBank, PENGUIN_BANK_SECONDS} from './videos/penguinBank';
import {HouseV2Video, HOUSE_V2_SECONDS, HouseV2Sheet, HOUSE_V2_SHEET_FRAMES} from './videos/houseV2';
import {TrustVideo, TRUST_SECONDS, TrustSheet, TRUST_SHEET_FRAMES} from './videos/trust';
import {TaxEvasionVideo, TAX_EVASION_SECONDS, TaxEvasionSheet, TAX_EVASION_SHEET_FRAMES} from './videos/taxEvasion';
import {IconGallery} from './videos/iconGallery';
import {FoundationVideo, FOUNDATION_SECONDS, FoundationSheet, FOUNDATION_SHEET_FRAMES} from './videos/foundation';
import {GridTest, GRID_TEST_SECONDS} from './videos/gridTest';
import {AmbulanceVideo, AMBULANCE_SECONDS, AmbulanceSheet, AMBULANCE_SHEET_FRAMES} from './videos/ambulance';
import {GasIran, GAS_IRAN_SECONDS} from './videos/gasIran';
import {CashVsCard, CASH_CARD_SECONDS} from './videos/cashVsCard';
import {RichGetRicher, RICH_SECONDS} from './videos/richGetRicher';
import {StyleTest, STYLE_SECONDS} from './videos/styleTest';
import {House, HOUSE_SECONDS} from './videos/house';
import {Bonus, BONUS_SECONDS} from './videos/bonus';
import {CollegeSheet, COLLEGE_SHEET_FRAMES, CollegeAssemble, COLLEGE_ASSEMBLE_SECONDS, CollegeVideo, COLLEGE_SECONDS} from './videos/collegeGermany';
export const Root = () => (
  <>
    <Composition id="penguin-bank" component={PenguinBank} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(PENGUIN_BANK_SECONDS * 30)} />
    <Composition id="penguin-rent" component={PenguinRent} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(PENGUIN_RENT_SECONDS * 30)} />
    <Composition id="penguin-world" component={PenguinWorld} width={1080} height={1920} fps={30} durationInFrames={60} />
    <Composition id="penguin-test" component={PenguinTest} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(PENGUIN_TEST_SECONDS * 30)} />
    <Composition id="gas-iran" component={GasIran} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(GAS_IRAN_SECONDS * 30)} />
    <Composition id="cash-vs-card" component={CashVsCard} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(CASH_CARD_SECONDS * 30)} />
    <Composition id="rich-get-richer" component={RichGetRicher} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(RICH_SECONDS * 30)} />
    <Composition id="style-test" component={StyleTest} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(STYLE_SECONDS * 30)} />
    <Composition id="house" component={House} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(HOUSE_SECONDS * 30)} />
    <Composition id="bonus" component={Bonus} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(BONUS_SECONDS * 30)} />
    <Composition id="college-sheet" component={CollegeSheet} width={1080} height={1920} fps={30} durationInFrames={COLLEGE_SHEET_FRAMES} />
    <Composition id="college-assemble" component={CollegeAssemble} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(COLLEGE_ASSEMBLE_SECONDS * 30)} />
    <Composition id="college-germany" component={CollegeVideo} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(COLLEGE_SECONDS * 30)} />
    <Composition id="ambulance" component={AmbulanceVideo} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(AMBULANCE_SECONDS * 30)} />
    <Composition id="ambulance-sheet" component={AmbulanceSheet} width={1080} height={1920} fps={30} durationInFrames={AMBULANCE_SHEET_FRAMES} />
    <Composition id="grid-test" component={GridTest} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(GRID_TEST_SECONDS * 30)} />
    <Composition id="foundation" component={FoundationVideo} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(FOUNDATION_SECONDS * 30)} />
    <Composition id="foundation-sheet" component={FoundationSheet} width={1080} height={1920} fps={30} durationInFrames={FOUNDATION_SHEET_FRAMES} />
    <Composition id="icon-gallery" component={IconGallery} width={1080} height={1920} fps={30} durationInFrames={1} />
    <Composition id="tax-evasion" component={TaxEvasionVideo} width={1080} height={1920} fps={30} durationInFrames={TAX_EVASION_SECONDS * 30} />
    <Composition id="tax-evasion-sheet" component={TaxEvasionSheet} width={1080} height={1920} fps={30} durationInFrames={TAX_EVASION_SHEET_FRAMES} />
    <Composition id="trust" component={TrustVideo} width={1080} height={1920} fps={30} durationInFrames={TRUST_SECONDS * 30} />
    <Composition id="trust-sheet" component={TrustSheet} width={1080} height={1920} fps={30} durationInFrames={TRUST_SHEET_FRAMES} />
    <Composition id="house-v2" component={HouseV2Video} width={1080} height={1920} fps={30} durationInFrames={HOUSE_V2_SECONDS * 30} />
    <Composition id="house-v2-sheet" component={HouseV2Sheet} width={1080} height={1920} fps={30} durationInFrames={HOUSE_V2_SHEET_FRAMES} />
  </>
);
