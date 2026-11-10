# EP6 facts (verified 2026-11-08 via web; re-verify live numbers on render day)
Hook: "Trump pays four dollars a gallon. In Iran, the same gallon costs eleven cents." = comedic framing (Trump = the typical American driver); numbers are the real averages below. Per-gallon in BOTH countries (Iran sells per liter: 1 gal = 3.785 L).
- US pump price: AAA national average $4.1493 on 2026-11-03 (was $4.2661 on 10-27) -> https://gasprices.aaa.com/news/page/2?draft=live  (RE-CHECK gasprices.aaa.com on render day, say "about four dollars")
- US price split, EIA snapshot May 2026 (retail $4.48): crude ~52%, refining ~22%, distribution+marketing ~15%, taxes ~12% (sum 101% rounding) -> https://www.eia.gov/petroleum/gasdiesel/  (taxes ~12% x ~$4.15 = ~50 cents: own math; federal excise 18.4 c/gal)
- Iran tiers (Sep 2026): 1,500 toman/L first 60 L per month; 3,000 toman/L next 50 L; top tier doubled from 5,000 to 10,000 toman/L effective 2026-09-08 -> https://www.hurriyetdailynews.com/iran-raises-price-of-petrol-as-us-applies-economic-pressure-226551 , https://shafaq.com/en/World/Iran-to-double-unsubsidized-gasoline-to-10K-tomans , https://www.tasnimnews.ir/en/news/2026/09/09/3692779/pezeshkian-calls-for-weekly-car-free-day-after-gasoline-price-hike/amp
- Iran average ~ $0.029 per liter (DailyFuels, 2026-08-24, 2nd-cheapest of 133) = ~$0.11/gal (0.029 x 3.785) -> also https://www.globalpetrolprices.com/Iran/gasoline_prices/
- Top tier 10,000 toman = ~$0.044-0.048/L = ~$0.17-0.18/gal -> "under twenty cents" (exchange rate varies by source).
- Official: Iran imports gasoline at ~60,000 toman/L; ~$0.28/L = ~$1.07/gal at ~215k toman/$ (own math; ONE official claim, say "an Iranian official said ... about a dollar") -> same Hurriyet/Tasnim-family reports; Iran International https://v1.iranintl.com/en/202511180120
- Smuggling: price gap drives smuggling (estimates $1-12B/yr, very uncertain) -> script says only "some gets smuggled" with NO number.
- Subsidy cost totals ($16B-$50B) = inconsistent definitions -> NOT used in script.
- NOT yet sourced (kept soft): "government controls the price" (supported by tier reports), currency "lost so much value" (derived from toman/$ in sources). Re-confirm exchange rate on render day.

## Re-check 2026-11-08
- AAA national average regular: $4.0203 on 11/8/26 (yesterday $4.0371, week ago $4.1732) -> https://gasprices.aaa.com/  => voice "four dollars" still true; hook signs show $4.15 (11-03 value): change both '$4.15' strings in ep6.html to the AAA value on render day.
- GlobalPetrolPrices 02-Nov-2026: Iran $0.029/L = 15,000 IRR (1,500 toman) for the first 60 L/month, then 30,000 IRR -> https://www.globalpetrolprices.com/Iran/gasoline_prices/  => ~$0.11/gal confirmed (source's own rate).
- WARNING exchange rate: GPP's $0.029 implies ~51,700 toman/$, while the import claim ($1/gal) used ~215k toman/$ (open market). Live open-market rate NOT confirmed (bonbast loads by script; search results undated). The ratio is rate-free and safe: imports ~60,000 toman/L vs 1,500 toman/L = ~40x. If questioned, keep "eleven cents" (cited average) and treat "about a dollar" as the official's claim.
