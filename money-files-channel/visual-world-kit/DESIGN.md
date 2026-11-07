# Channel visual world: Editorial Noir Motion

Read this file before building any scene. Never leave these rules.

## Palette (only these)
- Ink background: #0B0D10
- Ivory text: #EDE6D6
- Gold (money, flow, highlights): #C9A24B
- Red (danger, the mistake, evidence stamps): #B3261E
- Slate (secondary lines, ticks): #5F5E5A
Rule: red appears only at the key moment of a scene. Gold carries everything about money.

## Typography
- Titles and big numbers: Georgia-class serif (use Cormorant Garamond or Playfair Display via Google Fonts).
- Dates, labels, stamps: monospace (IBM Plex Mono or Courier New).
- Arabic titles: Amiri. Arabic body or subtitles: Noto Naskh Arabic. Never mix more than 2 families per frame.
- Big numbers are the stars of the frame: at least 120px on 1080p.

## Motion rules
- Enter: 0.6s ease-out, fade plus 20px rise. No bounce, no spring, no playful easing.
- Constant slow push-in (scale 1.0 to 1.06) over every scene.
- New visual event every 5 to 8 seconds.
- Money-flow lines draw progressively; the final node turns red and pulses once.
- Counter numbers count up with easing, tabular monospace digits.
- Always overlay grain and vignette (backgrounds/grain-overlay.svg, vignette-overlay.svg).

## Sound
- Low constant drone under narration at -28 dB.
- Typewriter tick on every text reveal; soft low hit on big numbers; paper sound on document cards.
- Silence of 0.4s before the red moment.

## Scene library (build once as reusable Remotion components)
1. Hook: big number + one line + timestamp.
2. Flow map: nodes and gold lines between accounts, ends on a red node.
3. Document card: real source document, zoom into one highlighted line, evidence stamp.
4. Counter badge (overlays/counter-badge.svg) top right, counting up.
5. Lower third timeline (overlays/lower-third.svg) with date and time.
6. Chapter card: roman numeral + short title + gold line.
7. Closing card: one wisdom question about greed, ivory on ink, nothing else.

## Assets
- icons/gold and icons/ivory: 20 line icons, same stroke width. Never mix with other icon styles.
- backgrounds: noir base, meander border (Greek key), grain, vignette.
- stamps: evidence, classified, confirmed, redact bar.

## Forbidden
- Generated faces, talking characters, stock photos of real people, copyrighted artworks.
- Any extra colors, gradients on text, glow, neon, emoji.
- Claims without a visible source on screen. Use "alleged" before any verdict.
