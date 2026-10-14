# College: USA $45,000 vs Germany $0 — status
- Hook (approved): "Why does college in the USA cost $45,000… but in Germany it costs $0?"
- Script: 14 lines approved (see chat table); line 4 adds "Yes — you can go."
- Gate 1 (collage metaphors): APPROVED, all 14. Benny IS in the collage images: his real cutout from studio/public/gen/ (exact face/hair/outfit) is placed in every still; prices/numbers are added as animated text in hyperframes assembly (collage skill forbids text in images).
- Next: Gate 2 stills (local, free: `college-stills` composition → `gate2/lineNN.png`), Gate 3 assemble clips (same composition rendered as mp4), then assembly, hook approval before final render.
- Setup each new session: `bash tools/setup_collage.sh` (checks local tools only; no key).
- Facts: College Board 2025-26 private nonprofit tuition & fees $45,000; Germany no tuition at public universities in 15/16 states (Baden-Württemberg €1,500/semester non-EU); blocked account ≈ €11,904/yr (verify on Auswärtiges Amt); avg federal student loan ≈ $39,500.

## Still generation (Gate 2) — method: local collage (studio/src/collage.tsx), no API
Each line = one standalone scene (TornSplit/Field + Piece cutouts + Card prices); the prompt text stays in the script table for the record. Benny pose per line:
1 benny-shocked · 2 benny-worried · 3 benny-sad-02 · 4 benny-excited · 5 benny-pointing · 6 benny-thinking-03 · 7 benny-thinking · 8 benny-sad · 9 benny-worried · 10 benny-saving-cash · 11 (no Benny) · 12 benny-sad-02 · 13 benny-thinking-03 · 14 benny-front
Locked description: Benny, a skinny young American man with messy spiky bright-yellow hair, pale skin, thick dark eyebrows, droopy half-closed eyes, gap-toothed grin, shirtless with a little chest hair, blue denim shorts, black flip-flops.
