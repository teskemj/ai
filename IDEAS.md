# Backlog / ideas (filed, not yet built)

Parking lot for features we want but aren't building right now. Pull one up when
it's time; keep the notes concrete enough to start cold.

## Should I mow my lawn? (rain-aware)
A verdict card (free-tier candidate, pairs with the BBQ forecast) that answers
"is today a good day to mow?" driven by rain expectation.

- **Inputs we already have:** hourly `precipitation_probability` + `precipitation`,
  daily rain odds, wind, and (NWS primary) the hourly feed.
- **Logic sketch:**
  - Grass should be dry → avoid mowing within a few hours *after* measurable rain,
    and don't bother if it's actively raining or high POP in the next window.
  - Prefer a dry stretch: look for the longest low-POP daylight window today and
    suggest it ("best mow window: 2–6 PM").
  - "Rain coming" nuance: a light mow before a dry spell is fine; mowing right
    before heavy rain wastes the cut. Flag "mow today, rain moves in tomorrow."
  - Heat/humidity guardrail: punt on dangerous heat index (reuse `feelsLike`).
  - Witty verdict copy to match the house voice (e.g. "Fire up the mower — the
    sky's holding its water till tonight.").
- **Placement:** a tile/card on Live or a small "Yard & Grill" group alongside BBQ.
- **Source note:** uses the same NWS-primary / Open-Meteo-fallback path as the
  rest of the forecast (accuracy is #1 — see ACCURACY.md).
