# EP5 "The sofa vs the plan" - build plan (2026-11-01)
Script: SCRIPT.md + lines.txt (20 lines, 210 words). Style ref: references/inside-money/analysis/tax-town-diorama.md.
## World = "Maple Street, USA" (one continuous set, built once, camera flies through it)
- Sky: Poly Haven HDRI, blue sky + clouds, warm afternoon sun, long soft shadows; final shot golden hour.
- Street: asphalt with white crosswalk + double yellow, sidewalks, curb, fire hydrant, USPS blue mailboxes, street lamps, power poles, stop sign, US flags on porches, picket fences, real PBR siding/shingle/brick/grass textures, varied trees.
- Houses (cutaway ground floor, closed 2nd floor): MIKE = tired grey-blue clapboard colonial, cracked driveway, old Ford-style pickup. DANA across the street = tidy craftsman house, flag, new SUV, small garage office "Dana Design Co." (side business). Corner: FIRST NATIONAL BANK, travel agency (vacation trail), gas station.
- Life: school bus passing, mail truck, jogger, kid on bike, neighbour walking a dog, cars driving by; MakeHuman cast (Mike, Dana, IRS agent x2, banker, charity volunteer). Everyone different and animated.
- Money: green US $100 bundles ($10,000 each, 4 = $40,000) with Zack-glow on key ones; red/green/yellow floating 3D numbers.
- IRS = black SUV + two agents in navy jackets, "IRS" on doors (real brand allowed).
## Shot table (one line = one new scene/angle; cuts every 2-3 s)
1 hook: inside Mike's living room, over-the-shoulder, he lifts the sofa cushion, 4 bundles, RED "$40,000", he reacts
2 camera pulls back through the cutaway to the whole street, IRS SUV rolls in
3 glowing yellow trail: house -> bank -> pickup -> travel agency (suitcase)
4 agents carry the bundles back to the SUV
5 jail bars drop over Mike's house, RED "75%" and "5 YEARS"
6 Mike on his porch, sweating, closes the curtains
7 night: Mike awake in the upstairs cutaway, flashing lights outside, knock
8 morning: Dana drinks coffee on her porch, same pay stub as Mike, sleeps fine
9 pay stub rolls on a conveyor into a 401(k) booth, GREEN $24,500, red tax box can't reach
10 Roth IRA glass vault, a money tree grows, GREEN $7,500
11 Dana hands a box to the food-bank volunteer, receipt stamp DEDUCTIBLE
12 garage office "Dana Design Co.": 20 % slice glows GREEN
13 split frame: two identical stacks, "SAME MONEY / SAME IRS"
14 REVEAL (~75 %): Mike's house behind bars | Dana's house with the Internal Revenue Code book on a lectern
15-16 tower of purple SCHEME ? boxes, IRS SUV knocks it down
17 Mike's sofa with dust and a cobweb, the cash earns nothing
18 Dana's bundles stamped REPORTED (green), working = money tree
19-20 golden-hour wide of the street, two yard signs TEAM SOFA / TEAM PLAN, caption CTA
## Differences from the reference (the "better than" list)
US everything (house types, flags, cars, bus, mailboxes, dollars), living street with people and traffic, real PBR materials + HDRI shadows, characters on screen, continuous camera, glow numbers (Zack rule), 1-word caption at 74 %.
## Open points
- Needs NEW assets (houses/cars/props) -> render-kit/assets.mjs must download CC0 packs (candidates: Kenney City/Car kits, Quaternius, Poly Haven models; verify licence + availability before use) or build procedural houses with real textures.
- Style change vs EP1-4 (plaza/lobby): confirm with user first (TOKEN GUARD).
- Next: user OK -> voice (Kokoro one take) -> assets -> look stills -> 5-s hook preview -> approval -> full render.

## STATUS 2026-11-01: FULL v2 RENDERED (one-take voice 61.2 s, flying camera, idle motion; v1 voice kept in v1/, scene authored on v1 timing and remapped per line)
- render-kit/ep5-tax-sofa.mp4 (61.6 s, Apple M3, not in git) + ep5-tax-sofa/ep5-tax-sofa-phone.mp4 (crf 26, in git).
- Scene render-kit/ep5.html (Maple Street: Mike cutaway x=-9, Dana cutaway + garage office x=11, bank/travel/gas across the street), mix ep5-tax-sofa/mix_ep5.py, timeline render-kit/timeline_ep5.json (make_timeline.py), render `npm run render -- ep5` FROM render-kit.
- Cast: mike, printer (= Dana), teller (= food-bank volunteer), guard + manager (= IRS agents). Rebuild GLBs: blender -b --python characters/make_cast.py -- mike printer teller guard manager.
- Assets: node assets5.mjs (Poly Haven CC0, clear-sky HDRI kloofendal_43d_clear_puresky saved as dl/kloofendal_clear_4k.hdr).
- Money: $40,000 = 20 straps of $20s ($2,000, violet strap). Illustrative notes (no portrait / security features).
- Known weak spots: faces mostly static (jaw/smile bones only); DANA DESIGN CO. sign slightly cropped at the end of line 12; characters small in some lawn shots.
- Pinned comment: "Team SOFA or Team PLAN? Comment one." On-screen/description: "Education only, not tax advice". Re-check 401(k)/IRA/QBI numbers on irs.gov before posting.
