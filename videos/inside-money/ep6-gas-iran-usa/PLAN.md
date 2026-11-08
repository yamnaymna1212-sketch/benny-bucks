# EP6 plan - gas: USA vs Iran (template: render-kit/ep4.html)
Hook 0-5 s (no sound): over-the-shoulder Mike at a US gas station, pump screen "$4.15"; split-screen/wipe to Iranian pump (Persian-style station, flag) "$0.11" glowing green vs red. Both signs fully in frame, centred. ting at 0 s, one whoosh on the wipe, one cash.
Beats (1 line = 1 new scene): 3D gallon jug split into 4 coloured layers (crude 52 red, refining 22, trucks 15, taxes 12 yellow), US map pump, Iran tier price board (1,500 / 3,000 / 10,000 toman), imported tanker at dock "$1", smuggling truck at border, price board doubling, scale (market vs subsidy), CTA to camera.
Rules: real 3D props only (no emoji icons), NaN-guard pass, 1-word captions, hero faces camera, one take voice (Kokoro am_liam 1.10, max_gap 0.04), 61-65 s.
Next: TTS -> check duration -> 5-s hook preview ONLY -> user approval -> full render.

## Status 2026-11-08 (hook APPROVED by user: v3 + louder "Trump")
- Hook 0-4.9 s done in render-kit/ep6.html: Trump (EP9 look) at US pump $4.15 (arms up), whoosh to Iran pump $0.11 (landlord model, open arms), push-in, side-by-side split US left / Iran right on "Here's why".
- Mix: ep6-gas-iran-usa/mix_ep6.py (ting .28 at 0, whoosh at Iran-.25, cash at $0.11, "Trump" boosted). Captions fixed in timeline_ep6.json.
- NEXT: build scenes 4.9-62.9 s in ep6.html (sentence starts: 4.86 America pump, 7.38 crude 52%, 10.48 refining 22%, 13.48 trucks 15%, 16.40 taxes 12% / 50 cents, 19.78 world market, 22.96 everyone paid from one gallon, 27.82 Iran gov controls price, 32.08 avg 11 c / top tier <20, 35.92 currency, 40.50 cheap gas has a bill, 41.72 import $1/gal, 45.76 state pays the difference, 48.34 burn more + smuggled, 52.34 raising prices in steps, 55.08 Sept top tier doubled, 56.64 market vs subsidy, 60.40 CTA to camera). Props per the beat list above (gallon jug 4 layers, tier board 1,500/3,000/10,000 toman, tanker "$1", border truck, price board x2, scale). Add a whoosh per big scene change only (few SFX).
- Then: update '$4.15' to the AAA price of render day, full render (`npm run render -- ep6`), check 61-65 s + Apple M3, PUBLISH.md + title/hashtags in chat.
