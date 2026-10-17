# ACTIVE CHANNEL = "Doug the Penguin" (since 2026-10-16)
For any new video use the `doug-episode` skill + HANDOFF.md + PROJECT_LOG.md + videos/penguin-series/script-formula.md.
Those Doug rules OVERRIDE the Benny rules below (grid paper, am_fenrir, exactly 60 s, yellow captions, Rich Rick, zoom-only).
Doug: 61–65 s, user's ElevenLabs voice, no music, hand-written captions, user SFX library, hook preview before full render.
The Benny rules below are kept only for the old Benny videos.

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

# Permanent rules for every video (TikTok, American audience)

## Language
- Always talk to me in Arabic: explanations, questions, feedback, status updates.
- Video deliverables (spoken script lines, on-screen text, image prompts, captions) are written in English, because the audience is American, unless I explicitly ask for another language.

## Workflow (always in this order)
1. Script and hook: write 3 hook options, pick the strongest one and tell me honestly why, then write the rest of the script following the content rules below.
2. Format (saved standard = `videos/foundation/foundation.mp4`, code `studio/src/videos/foundation.tsx`; details in the benny-collage-edit skill, "Style B" + sections below it): white grid paper, moving Benny clips (`assets/character/animated`), Rich Rick cutouts, big colored keywords, "WHY?" banner top-center in the hook, real hand-drawn icons on every spoken noun (my own drawings first, then props, doodle icons, real brand logos; never 3D emoji), yellow one-word captions in the middle that never cover a character, camera = ZOOM ONLY (punch / deep push / pull-out / hold, zoom transitions; no shake, no tilt, no lateral whips), the camera always follows the side Benny points at and the side being named, a visual change every 0.5–0.8 s, Benny moving from second 0. Voice: am_fenrir (young American male, fast, no dead air). Length: exactly 60 s. Show me the stills sheet before the hook preview; everything free and local (no Gemini, no Grok, no paid APIs or keys).
3. Assembly and render: build the video with `CollageVideo` (`studio/src/collageVideo.tsx`, Remotion) with voice, sound effects, captions and icons, then render 1080×1920 and compress under 30 MB.
4. One Take: use the onetake skill only when I ask for a "one-take version". In that case, the camera travels from one side to the other without cuts instead of cutting between them.
5. Before any final render: show me the hook (first 3 seconds) and get my approval.

## Content rule
My most successful videos are built on a strong, exaggerated contrast between two sides (expensive vs cheap, or a crazy comparison) that the viewer understands from the image before hearing any words.

Hook (first 3 seconds):
- The first frame is a split scene with two contrasting sides, understood in under 2 seconds.
- The contrast is extreme and aimed at Americans: gas, iPhone, burger, rent, coffee, a cow, the dollar.
- Each side has a price, a number, or a recognizable real object in large text.
- The first line is a question or a shock tied directly to the image. No intros.

Script:
- Short lines. One line = one idea = one image. Explicit numbers.
- Sequence: contrast shock, then the reason, then a number that confirms it, then an ending with value or a question that provokes comments.

Images:
- One image per line. Contrasting colors between the two sides.
- If there is a recurring character: put the full locked character description at the start of every image prompt, and make every prompt fully standalone with no references to other prompts.

Camera movement:
- The camera follows the narration literally: when the first side is mentioned, zoom toward it and return; then the same for the second side.
- For every line specify: movement type (pan / zoom in / zoom out / push in / whip pan), direction, and duration in seconds.

Sound effects: cash sound on prices, whoosh on camera moves, boom on the shock, ding on the key number, synced exactly to the word or movement.

## Output format
[line number] | spoken line | full image prompt | camera movement + duration | sound effect

## Pre-send checklist
- Is the contrast clear and exaggerated from the first frame, with no words?
- Does each side have a price or a number an American recognizes?
- Does the camera move with each side as it's mentioned?
- Is it one line = one image, and is every prompt standalone?
- Are sound effects included?
If any item fails, rewrite before sending. Give me blunt, direct criticism of my ideas and don't flatter me.
