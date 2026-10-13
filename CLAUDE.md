# Benny Bucks

TikTok/Shorts factory for entertaining English finance stories (US, 18–30) starring **Benny** (never a penguin).

## Always
- Before any video task (script, scenes, assets, animation, audio, render), read `REFERENCE_GUIDE.md` and only the relevant assets.
- `REFERENCE_GUIDE.md` overrides the older `benny-bucks-video-style` skill wherever they conflict (e.g. music, textures, outfit).
- No paid tools/APIs, deleting files, or major changes without the user's approval.
- The user is a beginner: explain simply. Talk to the user in Arabic; code, filenames, and video content in English.

## Character reference
مرجع شخصية Benny: assets/character/. اقرأ INDEX.md أولًا ولا تفتح الصور إلا عند الحاجة، وافتح فقط الصور المطلوبة للمشهد (مثلًا benny-sad عند مشهد حزين) مع المرجع الأساسي. لا تعدّل التصميم ولا تبتكر ملابس أو ملامح جديدة.

## Working style (token efficiency)
- Short, direct replies; no filler, no restating instructions, no long summaries.
- Inspect and reuse existing files/assets/code; never duplicate rules across files.
- Read only needed parts of files; for media, extract representative frames.
- No regenerating assets, redundant tool calls, or unnecessary verification (but never skip verification that matters).
- Ask only when info is missing or approval is required; brief plan before major changes.
