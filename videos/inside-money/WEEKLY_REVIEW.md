# Sunday weekly review (user request 2026-11-08)
Runs every Sunday as a scheduled task (fresh session). Read-only analysis: never post, send, spend, or change settings.

## Steps
1. Read CLAUDE.md, videos/inside-money/PROJECT_BRIEF.md section 0, and the last 20 lines of PROJECT_LOG.md.
2. `git log --since="7 days ago" --oneline --all` to see what was built this week.
3. If the Metricool connector is available: pull the last 7 days of TikTok/YouTube stats (views, avg watch time, full-watch %, followers) per video. If not available, say so; do not guess numbers.
4. Write `videos/inside-money/reviews/YYYY-MM-DD.md` (English file, short) using the report format below, plus:
   - Best and worst video of the week, with the number that proves it.
   - What went wrong in the process (re-renders, wasted tokens, repeated fixes).
   - 3 concrete changes for next week (max).
5. Commit and push the review file only. Then give the user a 5-line summary in Arabic.

## Report format (same for every agent/session report)
- Done:
- Files:
- Decisions needed from you:
- Blockers:
- Next:
