# Heartland Weather Desk

A personal, Midwest-tuned weather app. Single self-contained HTML page for the web —
no build, no dependencies, no API keys — plus a Capacitor wrapper for iOS/Android.

**Live site:** https://teskemj.github.io/ai/ *(after Pages is enabled — see below)*

## What it does
- **10-day forecast** with highs/lows, rain odds, wind, and daily humidity
- **Hourly** next-24-hours strip, timezone-correct per location
- **Air quality** (US AQI) with a color-coded gauge and PM2.5
- **Humidity & comfort** read
- **Extreme-weather alerts** straight from the U.S. National Weather Service
- **What to wear** and a blunt **stay-home verdict**, with a dry sense of humor
- **Live scenic backdrop** that tracks the conditions (sun/moon, rain, snow, storms, fog)
- **Holidays** banner with countdown and festive backdrop on the day
- **Ballpark Report** — weather-driven sports lines + what to wear to the game, with
  live Packers/Brewers/Bucks/Badgers schedules (teams follow the location you view)
- **Field & Stream** — hunting & fishing ratings, solunar feeding windows, moon phase,
  barometric pressure trend
- **BBQ forecast** — grill verdict + best grilling window today
- **Share cards** — one-tap branded, team-colored image of the conditions or the active
  NWS alert (native share / Web Share API / download)
- **Radar & maps** — interactive Leaflet map with animated **precipitation** radar
  (RainViewer), **cloud** cover (infrared satellite), and **wind** (OpenWeatherMap;
  set `OWM_KEY` in `index.html` to enable it)

## Sources
- Official hazard alerts: [National Weather Service](https://www.weather.gov) (`api.weather.gov`)
- Forecast / humidity / air quality / pressure: [Open-Meteo](https://open-meteo.com) (NOAA GFS/HRRR)
- Team schedules: ESPN public API · ZIP lookup: Zippopotam.us

## Run it (web)
Open `index.html` in any browser, or visit the live site. The 📍 location button needs
HTTPS (the hosted site); city/ZIP search works anywhere.

**Free vs. Premium:** new visitors get a 14-day full-access trial, then the free tier
(weather + local sports); Premium unlocks BBQ, Golf, Field & Stream and team themes.

**Paywall-free demo:** `demo.html` (e.g. `https://teskemj.github.io/ai/demo.html`) shows
everything unlocked with no paywall UI — for demos, investors, or store review. Adding
`?demo` to the normal URL does the same. `demo.html` is generated from `index.html` by
`npm run sync:web`, so keep editing `index.html` only.

## Mobile apps (iOS + Android)
The same `index.html` is wrapped with Capacitor. See **[CAPACITOR.md](CAPACITOR.md)**
to build and run, **[STORE_LAUNCH.md](STORE_LAUNCH.md)** for the data-licensing
requirements and the full App Store / Google Play submission checklist, and
**[PUSH.md](PUSH.md)** for severe-weather push alerts (client + `server/weather-alerts/`).

> `index.html` at the repo root is the single source of truth (web + app).
> Run `npm run sync:web` to copy it into `www/` before a Capacitor build.
