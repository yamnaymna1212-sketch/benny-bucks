# CHANNEL = "Doug the Penguin" (the only project in this repo)
For any new video type `/doug-episode` (manual-only skill) + HANDOFF.md + the last 20 lines of PROJECT_LOG.md + videos/penguin-series/script-formula.md.
Doug rules: 61–65 s, the user's ElevenLabs voice (via connector: generations_count=1 ONLY, one take, never 4 — user rule 2026-10-19), NO music, hand-written one-colour captions, the user's SFX library (tools/sfx_user_map.json, "ting" at 0 s of every hook), hook starts with "Why", hook preview before the full render.
HOOK = main template `WhyHook` (studio/src/penguin/whyHook.tsx): big "WHY" + two flag/price/object sides + plain confused Doug in the middle; never an "Explained by Doug" title.
MASTER EDIT STYLE (every video) = 'Edit rules v4' in videos/penguin-series/script-formula.md, template studio/src/videos/dougGasIran.tsx: white hook, Doug acts the hook (looks A -> snaps to B -> shock), no pauses (0.08 s), new shot every ~2.5 s.
VISUAL RULES v5 (every video): no empty white frames (World backdrop), a moving character in every shot, fixed zones, real-object icons in penguin style (studio/src/penguin/props.tsx) — see "Visual rules v5" in script-formula.md.
HOOK CAMERA (every split hook): no zoom at first -> zoom into side A on its spoken word -> zoom to side B on its word -> back to full split; each side's characters react with their own expression (see "Hook camera rule" in script-formula.md).
Cast: only Doug (and his family) are penguins; every other role is a different snow-world animal. Currency = fish (1 fish = $10).
Code: Remotion in `studio/` — rig `studio/src/penguin/`, episodes `studio/src/videos/doug*.tsx`, phrase timings `studio/src/data/<slug>.json`.
Posting times (best 3 per day, US): videos/penguin-series/posting-times.md — 10:00 / 12:00 / 18:00 ET.

# TOKEN GUARD (user rule, always on)
Before doing anything expensive, WARN the user in Arabic in 1–2 lines and offer the cheaper option, then wait for their choice:
- Full video render / re-render (any render > 5 s) -> offer ONE still or the 5-s hook preview instead; never re-render a finished episode unless asked.
- Many small fix requests in a row -> ask the user to batch all fixes into one message, then render once.
- Long session (context > ~50% or several episodes in one chat) -> tell them to start a new session (one episode = one session; first message: "/doug-episode ...").
- General chat / strategy questions inside the build session -> suggest asking in a normal claude.ai chat or using Sonnet.
- Vague requests ("fix it", "analyse everything", "review the whole project") -> ask one short clarifying question instead of reading many files.
- Big style changes mid-series -> warn that tools must be rebuilt; confirm first.
- Many screenshots/images -> ask for one clear image or a text description.
Cheap habits to recommend: scripts/ideas on Sonnet, build on Opus; read only the last 20 lines of PROJECT_LOG.md; named files (ep3-voice.mp3, money.mp3).

# Permanent rules (TikTok, American audience)

## Language
- Always talk to me in Arabic: explanations, questions, feedback, status updates.
- Video deliverables (spoken script lines, on-screen text, captions) are written in English, because the audience is American, unless I explicitly ask for another language.

## Content rule
My most successful videos are built on a strong, exaggerated contrast between two sides (expensive vs cheap, or a crazy comparison) that the viewer understands from the image before hearing any words.

Hook (first 3 seconds):
- Contrast understood in under 2 seconds, aimed at Americans: gas, iPhone, burger, rent, coffee, the dollar.
- Each side has a price, a number, or a recognizable real object in large text.
- The first line is a "Why" question or a shock tied directly to the image. No intros.

Script:
- Short lines. One line = one idea = one shot. Explicit numbers.
- Sequence: contrast shock, then the reason, then a number that confirms it, then an ending with value or a question that provokes comments.

Sound effects: cash sound on prices, whoosh on camera moves/transitions, boom on the shock, ding on the key number, synced exactly to the word or movement.

## Truth rule (user, 2026-10-20, after EP5 cash vs card was removed twice on TikTok)
- Every claim must be literally true, not "cartoon-simplified". If a number is a made-up example, say so on screen ("example").
- Show both sides fairly: when someone takes a fee, also say what they give (service, safety, rewards). Never "they do nothing", "X hates Y", "secret trick", "banks are fighting cash" framings.
- Never show money shrinking/disappearing; show who pays whom and why.
- No financial advice ("always pay cash"); end with a question instead.
- Every real-world number needs a named source in the script notes (e.g. Nilson Report 2025) and the pinned comment.
- Never re-upload a removed video or a near-copy of it; change topic.

## Pre-render safety + fun check (user rule 2026-10-20, EVERY video — run on the script AND on a contact sheet BEFORE any full render; fix, then render)
Safety / fairness (anything that can get a TikTok video removed or limited):
- No misleading or unfair comparison; same unit, same amount, same conditions on both sides (e.g. same $50). Say "example" for made-up numbers.
- No favouring one side: never push the viewer to use A or avoid B, no "always/never use X", no financial advice — end with a question.
- No distorting, belittling, mocking or demonising a side, a company type, a job (bankers, landlords, stores) or a group; the "villain" animal must also show what it gives (service, safety, rewards).
- No racism, stereotypes, national/ethnic jokes, religion, politics, body shaming, debt shaming.
- No false or outdated facts; every real number has a named official source (on screen small + pinned comment); no unofficial big exaggerations ("10x", "everyone", "secret").
- No get-rich-quick, guaranteed returns, "passive income", wealth flexing, crypto/gambling/loans promotion, fake urgency ("before it's too late").
- No real brands, logos, real people, real currency copies (fish versions only); no copyrighted music.
- No dangerous acts, theft shown as cool/rewarded (a thief always fails or is the problem), no minors in risky situations.
- Label AI-generated voice/visuals; caption + description must match the video (no clickbait the video does not deliver).
Fun / curiosity (never boring):
- A simple, NEW angle a 10-year-old gets in one look; caveman-English lines, one idea per shot.
- A humour beat every ~6–8 s: visual gag, "Doug <state>." gag, character reaction, running gags (Fox snicker, Doug's jacket...).
- Keep curiosity alive: open a question early ("but..."), reveal the key number late, never give the answer in the first 3 s; twist or loop ending + comment question.
- Playful tone: mock situations, never people or sides.

## Pre-send checklist
- Is the contrast clear and exaggerated from the first frame, with no words?
- Does each side have a price or a number an American recognizes?
- Is it one line = one shot?
- Are sound effects included?
- Is every claim literally true and are both sides shown fairly (Truth rule)?
- Did the pre-render safety + fun check pass (nothing removable, nothing boring, curiosity kept)?
If any item fails, rewrite before sending. Give me blunt, direct criticism of my ideas and don't flatter me.
