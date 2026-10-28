---
name: doug-ideas
description: Find FRESH, research-backed video ideas for "Doug the Penguin" (Price Gap / versus format) from this week's news, prices and statistics — never from memory. Use when the user asks for new video ideas, topics, a "strong comparison", or says ideas are repeating.
---
# Doug ideas — research first, never from memory

Talk to the user in Arabic; idea titles, hooks and numbers in English. Cheap task: web searches + a short answer, NO code, NO render. Follow the TOKEN GUARD in CLAUDE.md.

## 0. What is already used (do this first, it is cheap)
- Read only `tail -n 30 PROJECT_LOG.md` and `ls videos/` -> list topics AND countries already used (rent, gas TX/CA, gas USA/Venezuela, money laundering, internet USA/India, ...).
- Never propose a used topic, and do not reuse the country of the last 2 episodes.

## 1. Research (WebSearch, run the searches in parallel, mode "standard"; "extended" only if results are thin/old)
Run at least 6 searches, mixing:
- **This week's US price news**: "price increase this week US", "record high price October <year>", "<item> price 2026" for eggs, coffee, beef, rent, car insurance, iPhone, tuition, childcare, concert tickets, healthcare, electricity.
- **Country vs country gaps**: "<item> price USA vs <country>", "cheapest country to buy <item>", "most expensive country for <item>".
- **Stats sources** (prefer these, cite them): BLS CPI, AAA, Numbeo, cable.co.uk, The Economist Big Mac Index, KFF (health), EIA (energy), Census, Zillow/Redfin, Kelley Blue Book.
- **What is viral now**: "trending TikTok money topic this week", "viral price comparison video".
- If the Metricool connector is available (ToolSearch "metricool"), pull the user's last 30 days of post metrics and note which topics/formats got the most views — rank ideas toward what already works for THIS account.

Discard any number older than ~12 months unless it is the latest official release (say so).

## 2. Filter — keep only ideas that pass ALL
- Contrast is understood from ONE image in < 2 s (two prices, same object, flags) — no words needed.
- Gap is huge (≥ 5x, or $ vs ¢, or $X vs $0).
- The US side is something Americans pay for (gas, iPhone, burger, rent, coffee, insulin, college, the dollar...).
- Both numbers come from a source with a link, and the comparison is fair (same item, same period). If not fair, say exactly what caveat the script must say (like "only 2GB" in EP7).
- Can be explained with Doug's world: Larry (walrus owner), Boss Bear (government), Tax Gull, Fox the banker, Big Seal (money maker). Only Doug + family are penguins.

## 3. Output (short, Arabic explanations)
Give **5 ideas**, ranked, each as:
1. **Title** — USA vs X (item)
2. **Hook line** (starts with "Why", ≤ 20 words): "Why Doug pay $A for <item> in America... but $B in <country>? Same <item>."
3. **Hook image**: left / right (price, flag, object).
4. **The real reason** in one line (what the episode teaches: subsidy, tax, monopoly, scale, wages, exchange rate...).
5. **Numbers + sources** as markdown links, with the date of each number.
6. **Risk**: what a commenter could attack, and the line the script needs to stay honest.
7. **Strength** /10 (contrast, emotion/anger, comment bait).

Then give a blunt recommendation (which one and why), no flattery, and remind the user: build it in a NEW session with "Use the doug-episode skill, idea: ...".

## Never
- Give ideas without searching first. Repeat used topics/countries. Invent or round numbers without saying so. Use brand logos on screen (names in text are fine).
