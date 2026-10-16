# Benny Bucks — project log (read this first in a new session instead of re-exploring)
Last update: 2026-10-16. Branch: `claude/benny-tiktok-factory-design-lex9ua`. Rules: CLAUDE.md. Edit system: `.claude/skills/benny-collage-edit/SKILL.md`.

## Saved format (default for every video)
Grid paper · moving Benny clips (`assets/character/animated/alpha/*.webm` → `studio/public/anim`) · Rich Rick stills (`studio/public/gen/rich-*.png`)
· original kid "Rick Jr." (`studio/src/babyRick.tsx`) · hand-drawn icons on spoken nouns (`studio/src/icons.tsx`, never 3D, never the safe icon)
· yellow mid captions · ZOOM-ONLY camera; hook = strong zoom from frame 0 swinging side→side with the words, Benny points at each side (flip clip)
· Fenrir voice (`tools/tts.py ... am_fenrir <speed> 0.08`, pauses 0.05) · exactly 60s (`minSeconds={60}`) · compress crf 22 under 30 MB.
Build: `studio/src/videos/<name>.tsx` with `CollageVideo` + `<name>-sheet` comp; reference builds: `trust.tsx`, `taxEvasion.tsx`, `foundation.tsx`.

## Finished videos (all on the branch, raw link = github.com/yamnaymna1212-sketch/benny-bucks/raw/claude/benny-tiktok-factory-design-lex9ua/<path>)
| video | path | notes |
|---|---|---|
| Billionaire foundations | videos/foundation/foundation.mp4 | 60s, ends "Follow for part two" |
| Tax evasion (Benny, cash worker) | videos/tax-evasion/tax-evasion.mp4 | 60s, ends "Next video: how rich people pay less, legally" |
| Trusts / estate tax | videos/trust/trust.mp4 | 60s, Rick Jr. as the son |
| Ambulance USA vs Japan | videos/ambulance-japan/ambulance.mp4 | old collage style |
| College USA vs Germany | videos/college-germany/college-germany.mp4 | old collage style, accurate hook |
| Older: gas-iran, cash-vs-card, rich-get-richer, house-poor-vs-rich, bonus-1000 | videos/* | pre-format |

## User preferences learned (don't re-ask)
- Arabic chat, English video text. Blunt criticism. Facts verified + sourced; fix misleading claims in pasted scripts (keep hook/structure).
- No real people / copyrighted characters (no Fed-chair likeness, no Scrooge McDuck, no Stewie). No Gemini/paid APIs. No dark/black backgrounds.
- Pasted scripts from other creators = structure only; reword to avoid duplicate content.
- Show stills sheet + hook preview, then render on "go".
- House v2 (2026-10-16): user asked for a CLEAR, calmer pace — voice speed 1.0 and `beatEvery={1.6}`; ask before reusing the very fast pace.

## Known gaps
- Rick has no animated clips (stills only). IRS agent = cast-advisor (book says "ADVISOR"). Doodle emoji faces are weak.
- Photo sites (Wikimedia/Unsplash/Pexels) blocked; GitHub raw + npm reachable.
