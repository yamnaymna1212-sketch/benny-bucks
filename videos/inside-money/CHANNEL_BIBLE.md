# NEW DIRECTION (draft, 2026-10-29): 3D "how money works" cutaway shorts — NOT yet approved as replacement of Doug rules in CLAUDE.md
Why: gas/price-gap penguin videos retain 5-8% (Studio data); cutaway explainers (You Built It 1-2M, Zack D 100M+) win on ONE repeatable look.
Working title: "Inside Money" (check name availability on TikTok before use).

## Main character: MINT (viewer stand-in, appears in ~30-50% of shots; the rest = pure mechanism cutaways)
Late-20s man, medium skin tone, short wavy black hair, round gold-rimmed glasses, clean-shaven, mustard-yellow bomber jacket over white tee,
navy trousers, white sneakers, small gold coin pendant. Mustard + gold = money colour, stands out in the feed, easy for AI to keep consistent.
Do NOT copy any real creator's look (no beard/headband like Zack). Never put a creator's name or any brand/logo in prompts.

## Prompt 1 — character sheet (run once in Gemini/Flow image or any image model, keep the best result as THE reference)
Character turnaround sheet: the same person full body from front, side and back, plus 6 head close-ups (neutral, curious, shocked, smug, worried, laughing).
Photorealistic 3D CGI character render, semi-stylized proportions, Unreal Engine / Pixar-realism look, soft studio lighting, plain light-grey background.
Late-20s man, medium skin tone, short wavy black hair, round gold-rimmed glasses, clean-shaven, mustard-yellow bomber jacket over a white t-shirt,
navy trousers, white sneakers, small gold coin pendant on a thin chain. Friendly expressive face. No text, no logos, no brand names.

## Prompt 2 — style prefix (paste at the START of every video-clip prompt)
Photorealistic 3D CGI animation, clean cutaway / cross-section view, Unreal-Engine-quality materials, soft global illumination, shallow depth of field,
smooth slow camera move, vertical 9:16, no text, no letters, no logos, no brands.
Then ONE idea per clip, ~8 s, attach the character sheet as reference ("Ingredients" in Flow) whenever Mint appears.

## Pipeline (who does what)
| Step | Tool | Who |
|---|---|---|
| Idea (1 line) | — | user |
| Research + script (v2 rules, natural English, hook in 1 s) + numbers with sources | Claude | Claude |
| Shot list = 6-8 clip prompts (style prefix + 1 idea) | Claude | Claude |
| Generate clips | Google Flow (Veo), alternatives: Kling / Runway / Hailuo | user (paste prompts, download mp4, name clip01..clip08) |
| Voice | ElevenLabs connector, 1 take | Claude |
| Assembly: clips + voice + big captions + number overlays + SFX (ASMR style) + render | Remotion in studio/ | Claude |
| Post | TikTok (+ Shorts/Reels reuse) | user |
Real Blender/Unreal/MetaHuman 3D = best control but needs a strong PC and weeks of learning -> not recommended now.

## Limits (be honest)
- AI video often gets mechanisms wrong and garbles on-screen text -> all text/numbers are overlays added by Remotion; check mechanisms against the research notes.
- Flow credits: 6-8 clips/video x 3 videos/day may exceed the plan -> start with 1 video/day, check credit use.
- Not photoreal-Zack quality guaranteed. Test 3 videos before changing CLAUDE.md rules.

## Test episode 1
"Where does your money go after you tap your card?" (card chip -> terminal -> bank ledger -> merchant). Facts must be sourced before shot list.
