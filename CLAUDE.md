# ACTIVE DIRECTION (2026-10-29): "Inside Money" — 3D cutaway videos about how money/banks/finance work. START with videos/inside-money/PROJECT_BRIEF.md (section 0 = latest user rules 2026-10-31; template for every new video = render-kit/ep4.html) (new machine/phone: videos/inside-money/SETUP.md; style references: references/inside-money/).
The Doug the Penguin rules below are LEGACY (kept for reference) unless the user asks to resume Doug.

# CHANNEL = "Doug the Penguin" (the only project in this repo)
For new video IDEAS use the `doug-ideas` skill (web research, never from memory). For any new video use the `doug-episode` skill + HANDOFF.md + the last 20 lines of PROJECT_LOG.md + videos/penguin-series/script-formula-v2.md (v2 replaces the caveman-English parts of script-formula.md: natural English, viewer-stake hook, mystery structure, no "3 reasons" lists — proven by TikTok retention data 2026-10-29).
Doug rules: 61–65 s, the user's ElevenLabs voice (via connector: generations_count=1 ONLY, one take, never 4 — user rule 2026-10-19), NO music, hand-written one-colour captions, the user's SFX library (tools/sfx_user_map.json, "ting" at 0 s of every hook), hook starts with "Why", hook preview before the full render.
Cast: only Doug (and his family) are penguins; every other role is a different snow-world animal. Currency = fish (1 fish = $10).
Code: Remotion in `studio/` — rig `studio/src/penguin/`, episodes `studio/src/videos/doug*.tsx`, phrase timings `studio/src/data/<slug>.json`.

# TOKEN GUARD (user rule, always on)
Before doing anything expensive, WARN the user in Arabic in 1–2 lines and offer the cheaper option, then wait for their choice:
- Full video render / re-render (any render > 5 s) -> offer ONE still or the 5-s hook preview instead; never re-render a finished episode unless asked.
- Many small fix requests in a row -> ask the user to batch all fixes into one message, then render once.
- Long session (context > ~50% or several episodes in one chat) -> tell them to start a new session (one episode = one session; first message: "Use the doug-episode skill ...").
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

## Pre-send checklist
- Is the contrast clear and exaggerated from the first frame, with no words?
- Does each side have a price or a number an American recognizes?
- Is it one line = one shot?
- Are sound effects included?
If any item fails, rewrite before sending. Give me blunt, direct criticism of my ideas and don't flatter me.

# Script safety (user rule 2026-10-29, all channels, TikTok is strict on money topics)
Never in a script or on screen: anything that encourages illegal acts, misleading info, made-up or inflated numbers, "do this / buy this" instructions, promises (gains, guarantees), insults or sensitive wording. Every number needs a source in the episode's facts.md; simplifications must not change the truth.
Real brand names/logos on screen: allowed by the user (2026-10-29) for realism.
