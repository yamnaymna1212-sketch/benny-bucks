# EP3 build plan (2026-10-30) — continue in a NEW session (this one is long)
Hook (lines 1-2) is DONE in render-kit/ep3.html: living room, man raises phone (palm-up grip: pa=[0.3,-0.55,0.6,1.3,1.5,0], fingers curl on the X axis, phone held at its lower end po=[0,0.15,0.03]), close-ups use phone-up camera (PUP), written hook at the top "THE BANK SENT HIM $120,000 BY MISTAKE", flashback grade for "the day before". Preview: npm run render -- ep3 5.
User rules for this episode: Zack-style story, answer withheld to the end, obstacles escalate, MANY places / objects / characters / movement, everything real-looking, written hook at the top, never silent audio (-11 LUFS, mix_ep3.py), camera moves 0.5-0.85 s, subject centred.

## Scenes still to build (one per line, cut at least every 2 s; L(n) = line start)
| line | place | what moves | props / characters |
|---|---|---|---|
| 3 teller mistake | bank branch interior (marble counter, monitors, queue rope) | teller types, clicks DEPOSIT, screen "$120,000 -> Acct ••4821" | teller = guy clone (white shirt, tie) |
| 4 "is it mine now?" | living room | man looks up, slow orbit, red "?" floats | — |
| 5 didn't call, went shopping | living room -> door | thumb skips "Call bank", pockets phone, walk cycle to the door | front door |
| 6 $15,000 down on an SUV | car dealership lot (flags, price stickers) | man hands cash stack to salesman, SUV lights blink | SUV (primitive car()), salesman clone (suit), banknote stacks |
| 7 four-wheelers, camper, race car | driveway | 3 quick reveals with fly-moves | ATVs (primitive), camper trailer, race car (CarConcept.glb) |
| 8 $15,000 to friends | backyard | 2 friends receive stacks, bills flutter | 2 clones (different shirts/caps) |
| 9 2.5 weeks, $100k gone | living room | calendar pages flip 17 days, phone balance counts down | wall calendar |
| 10 bank noticed | bank back office | manager leans to monitor, red alert row | manager clone |
| 11 pulled it all back | phone close / bank | money flies out of the phone toward the bank | bill particles |
| 12 minus $107,000 | phone close | balance flips to -$107,416.00 red, man's step back | — |
| 13-15 call, wife, stopped answering | kitchen counter | phone rings "BANK", lifted; later "7 missed calls" vibrating | kitchen (Poly Haven), phone |
| 16-17 who's right? | split: bank exterior vs house | justice scale tilting | scale (primitive) |
| 18 police knock | house porch | officer knocks, police car lights | officer clone (cap), police car from ep2v2 |
| 19 admitted | living room | man on sofa nods, officer standing | — |
| 20 charges | table | paper "THEFT / RECEIVING STOLEN PROPERTY" slides in, red stamp | paper (canvas) |
| 21 answer | bank exterior | bills fly back into the bank | — |
| 22 can be theft | phone deposit close-up | "NOT YOURS" stamp | — |
| 23 Pennsylvania 2019 | house exterior wide | 3D text "PENNSYLVANIA · 2019" | — |
| 24 vote | split screen in 3D | "CALL THE BANK" vs "GO SHOPPING" | phone + shopping bags |
CAST (built 2026-10-30, ep3.html `CAST`): MAN (blue-grey tee), teller (white shirt, glasses, short), salesman (dark shirt, heavy fat .9, big head, mustache), friend1 (red tee, dark skin, thin, cap), friend2 (green tee, blond, heavier), manager (light shirt, bald, glasses, mustache), officer (navy, police cap + badge, mustache). Shirt/trousers tinted separately (waist split shader). Lineup check: `node stills.mjs ep3.html 0 --q "lineup=1&cx=0&cz=6"` (heads: cz=1.6&ly=1.55). The wife: the only free female model (three.js Michelle) is a stylised dancer, so she is NOT used; show her through the phone call (hand + phone, caller 'BANK').
Old note: only guy.glb is available (one face). Vary them with clothes colours, caps, scale, skin tint, and keep faces small; a second real character model (e.g. a female for the wife) needs a new CC0 asset — ask the user first.
