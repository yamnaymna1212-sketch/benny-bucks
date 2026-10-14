# Permanent rules for every video (TikTok, American audience)

## Language
- Always talk to me in Arabic: explanations, questions, feedback, status updates.
- Video deliverables (spoken script lines, on-screen text, image prompts, captions) are written in English, because the audience is American, unless I explicitly ask for another language.

## Workflow (always in this order)
1. Script and hook: write 3 hook options, pick the strongest one and tell me honestly why, then write the rest of the script following the content rules below.
2. Images: use the gbro-collage-broll skill to generate the visuals for each line in a paper-cutout collage style. Follow its three approval gates and don't spend tokens before I approve. Ask me for the Gemini API key and never write it into any file that could be pushed to GitHub.
3. Assembly and motion: use the hyperframes skill to assemble the clips into a 9:16 video: split screen, camera zoom synced to the narration, captions, voice, sound effects, then render.
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
