# Daily Doug plan (user, 2026-10-17)
- 2 NEW episodes per day for 1 month (user choice; warned about Claude usage limits + YouTube inauthentic-content risk).
- Post times (Tunisia, UTC+1): 00:00 and 02:00 (= 7 pm / 9 pm New York, EDT; after Nov 2 US time change = 6 pm / 8 pm).
- Platforms via Metricool (brand blogId 7420762): TikTok + YouTube Shorts (+ Instagram/Facebook Reels if connected). AI-content label ON, YouTube madeForKids=false.
- NO VPN / location tricks (refused; TikTok ToS).
- Flow per episode: topic + real numbers -> script -> ElevenLabs voice (tools/elevenlabs_tts.py) -> hook preview -> user "go" -> full build/render -> upload to PUBLIC repo doug-videos (finished mp4 only) -> user "go" -> Metricool schedule.
- Blocked until the user: (1) connects TikTok + YouTube in Metricool, (2) adds api.elevenlabs.io + ELEVENLABS_API_KEY to the environment, (3) says "موافق" to the public repo doug-videos.
- Then: new session -> verify all three -> create the daily scheduled task (fresh session per run).
