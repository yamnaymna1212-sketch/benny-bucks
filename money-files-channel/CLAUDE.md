# Financial-crime documentary channel — project context

Read this first in every new session. The user is **Yassin** (Gabès, Tunisia). He writes in Arabic, so reply in Arabic. He is a video editor who uses Claude Code. He supplies the ideas and Claude does the execution.

## The channel
- A YouTube channel about **real, documented financial cases**: heists, frauds, collapses. It should feel documentary, cinematic and slightly mysterious, and be built as a long-term professional brand.
- It must stand out from generic AI channels by feeling human, using real sources, and following YouTube policy (avoid inauthentic or reused content; say "alleged" where a claim is unproven).
- **Not decided yet:** the channel language (Arabic or English), the channel name, and the first episode (Bybit hack, Feb 21 2025, or FTX).

## Visual identity (current direction)
- Dark navy, flat geometric noir. Palette:
  - background `#0f2a46` with grunge texture (`public/navy.png`)
  - coat `#15171c` / `#252a33`
  - red `#d6453d`
  - gold `#e8b23a`
  - ivory `#ede6d6`
  - yellow `#f2c230`
- Fonts: Oswald (titles), Playfair Display (narration text), Liberation Mono (sources and labels).
- **Host character "The Auditor"** (`episode-sample/src/Detective.tsx`). An original design: trench coat with the collar raised to hide the face, fedora with a red band, gold reading glasses glinting in the shadow, gold ledger under the arm.
  - Rigged poses: walk, point, look, squint, glasses glint.
  - Character sheet: `auditor_character_sheet.png`.
- Every scene should look different: evidence board, press wall, money-flow map, analyst screen, ledger/chart, institution document.
- On-screen **source chips** for every claim: publisher, date, URL.

## Code
- `episode-sample/` is a Remotion 4.0.540 project with these compositions:
  - `Case`: 13-second Bybit scene with the Auditor (the current best example)
  - `Sheet`: the character sheet
  - `Episode`: an older paper-collage test
  - `Auditor`: an older 2D test
- Render with: `npx remotion render src/index.ts Case out.mp4 --browser-executable=<chromium path> --concurrency=2`
- Other folders:
  - `people-kit/`: turns **licensed** photos into styled cutouts. Each photo is registered in `assets/people/people.json` with its license and source URL; `build_library.py` builds the cutouts.
  - `collage/`: PIL generators from earlier style tests.
  - `visual-world-kit/`: icons and `DESIGN.md`.

## Rules
- Claude does not download photos of real people or real news footage. The user downloads licensed material (Wikimedia Commons, US-government images, court/SEC/DOJ/FBI documents), and Claude places it automatically.
- Do not draw real currency designs or real institution logos. Show institution names as text.
- Verify every fact against a source before it goes on screen.

## Verified facts (Bybit)
- FBI IC3 PSA I-022625-PSA, Feb 26 2025 (ic3.gov/PSA/2025/PSA250226):
  - North Korea ("TraderTraitor") was responsible for stealing about $1.5B in virtual assets on or about Feb 21 2025.
  - Some of the stolen assets were converted to Bitcoin and other assets dispersed across thousands of addresses on multiple blockchains.
- Initial reports, Feb 21 2025: TechCrunch ("around $1.4B"), Bloomberg ("almost $1.5B").

## Known weaknesses (fix in this order)
1. No script and no voiceover. Yassin will record his own voice.
2. No real material yet. Give him a per-scene list of what to download and the licensed source for each item.
3. The character is still stiff. It has no mouth or acting yet; drive its animation from the voice.
4. The research is shallow. The episode needs an hour-by-hour timeline from several sources.
5. The episode has no unique angle.
6. The brand is not fixed (no name, no language).
7. Music and sound design are basic. Use licensed music.
8. The style has not been tested on a long video.

## Next steps
1. Help decide the channel language and name.
2. Write the full Bybit script (8–12 minutes) with sources, a timeline and an angle.
3. Give the per-scene list of real material to download.
4. After the voice is recorded, build the video on it.
