# Forecast accuracy — the #1 product priority

Accuracy of the forecast is the thing we optimize for above features and polish.
Every data-source or model decision gets weighed against "does this make the
forecast more correct for the Midwest?" This file is the standing record of where
we are and what's next. Update it whenever the data path changes.

## Where the numbers come from today
- **Forecast, hourly, 10-day, humidity, pressure, UV, sun times:**
  [Open-Meteo](https://open-meteo.com) with the default **`best_match`** model.
  For the continental US / Midwest, `best_match` blends **NOAA HRRR** (3 km,
  hourly, best for 0–18 h), the **National Blend of Models (NBM)**, and **GFS** for
  the longer range — this is genuinely among the most accurate free sources for our
  region, not a generic global model.
- **Severe-weather alerts:** the U.S. **National Weather Service** (`api.weather.gov`)
  — the authoritative source.
- **Air quality:** Open-Meteo air-quality (US AQI).
- **Radar:** RainViewer (observed), not a model.

## Why this is already good for the Midwest
HRRR is NOAA's high-resolution rapid-refresh model, updated hourly, and is the model
meteorologists lean on for short-range CONUS forecasting (storms, timing, temps).
Getting HRRR + NBM auto-selected per location is the main reason the current
forecast holds up.

## Roadmap — in priority order
1. **Add the official NWS gridpoint forecast as the US primary.**
   `api.weather.gov/points/{lat},{lon}` → the gridpoint `forecastHourly` / `forecast`
   endpoints return the NWS's own NBM-based, forecaster-refined numbers — the most
   "trusted" US forecast. Use it as primary inside the US, fall back to Open-Meteo
   for non-US locations and for fields NWS doesn't serve. Show the source on screen.
2. **Blend + disagreement flag.** When NWS and Open-Meteo disagree beyond a
   threshold (e.g. >4 °F or a precip-timing split), widen the confidence and say so,
   rather than showing false precision.
3. **Model/source label + "updated" time** on the forecast, so users know the
   provenance (we already show "Updated HH:MM").
4. **Verification loop.** Log forecast vs. observed (nearest ASOS/METAR station) for
   a handful of Midwest points and track mean absolute error by lead time. Let the
   numbers — not vibes — decide any future model change.
5. **Ensemble spread** for the 7–10 day range to communicate uncertainty honestly.

## Guardrails
- Never trade accuracy for a prettier chart or a faster load.
- Prefer official/high-res regional models (HRRR, NBM, NWS) over global ones for the US.
- When unsure, show a wider range or say "low confidence" — don't fake precision.
- Keep the data sources commercial-licensed before monetizing (see STORE_LAUNCH.md).
