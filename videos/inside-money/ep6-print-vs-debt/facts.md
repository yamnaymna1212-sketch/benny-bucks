# EP6 facts (verified 2026-11-02)
- Total public debt outstanding $40,593,637,262,883.48 on 2026-10-29; held by public $32.71T; intragovernmental $7.88T. Source: Treasury Fiscal Data API debt_to_penny (api.fiscaldata.treasury.gov).
- Per American: 40.593T / 342M (Census, see ep4 facts.md) = ~$118.7K -> "about one hundred nineteen thousand".
- Net interest FY2025: 3.2% of GDP ($970B) (CBO Feb 2026 outlook via CRFB: crfb.org/blogs/cbo-releases-february-2026-budget-and-economic-outlook). Deficit FY2025: $1.8T (same source).
- Debt held by public: 99% of GDP end FY2025, 101% in FY2026 projection, 120% by 2036 (CBO Feb 2026, via CRFB; search summary).
- Avg interest rate on interest-bearing debt 3.531% (2026-09-30, Treasury avg_interest_rates) - not used in script.
- Rollover mechanism: Cato "overrated debt ceiling"; Krugman: governments must service, not necessarily pay off (secondary sources).
TODO before final: re-check "last year" wording = FY2025; confirm CBO 101%/99% on cbo.gov (403 from fetch); Social Security trust fund is part of intragovernmental holdings (verify on fiscaldata).
- Foreign holdings of Treasuries $9.353T (April 2026, Treasury TIC via tradingeconomics/mondovisione). 9.353/40.594 = 23% foreign -> ~77% domestic (public + Fed + intragov) -> "about three out of every four dollars ... inside America".
- Script v3 line "people holding a lot of that debt are people like you": via banks, pension funds, Social Security trust fund (intragov $7.88T). Framed "a lot", not "most", to stay exact.
## v4 additions (2026-11-02)
- "Japan alone is owed more than one trillion dollars": Japan = largest foreign holder of U.S. Treasuries, $1,116.7B end of June 2026 (Treasury TIC; FRED FORTREASPOS42609; primerates.com June 2026 summary). On screen "$1.1 TRILLION".
- "China and others are owed trillions more": total foreign holdings $9.30T June 2026 (same TIC release) -> others = ~$8.2T.
- Map: Natural Earth 110m countries (public domain), render-kit/assets/world-110m.json.
- Dropped (not used): "2022 inflation hit over nine percent" (BLS: 9.1% y/y June 2022) - would imply printing alone caused it.
