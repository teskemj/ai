# Store listing copy & submission answers

Ready-to-paste text for the App Store and Google Play, plus the privacy
disclosures each store makes you fill in. Edit the bracketed bits, then paste.
Companion to **STORE_LAUNCH.md** (the checklist) — this file is the *content*.

> ⚠️ **Blocking item before you charge money:** the data-licensing decision in
> STORE_LAUNCH.md §0 is still open. Open-Meteo's free tier is non-commercial and
> the ESPN feed isn't licensed. Lock that down (paid Open-Meteo plan + a licensed
> sports feed, or drop live schedules from the paid build) before submitting a
> paid/subscription app. Listing copy below assumes sports stays in; trim it if
> you drop the sports feed.

---

## App name / title
- **App Store (30 char max):** `Heartland Weather Desk`
- **Google Play (30 char max):** `Heartland Weather Desk`

## Subtitle / short description
- **App Store subtitle (30 char):** `Midwest weather with a wink`
- **Google Play short description (80 char):**
  `Trusted Midwest forecast, severe alerts, sports, BBQ & hunting — with humor.`

## Promotional text (App Store, 170 char, updatable anytime)
`Now powered by the official National Weather Service forecast. Know whether to grab a jacket, fire up the grill, or just stay home — with a Midwest sense of humor.`

## Keywords (App Store, 100 char, comma-separated, no spaces)
`weather,midwest,forecast,radar,severe,alerts,NWS,wisconsin,hunting,fishing,BBQ,humidity,air quality`

## Category
- **Primary:** Weather
- **Secondary (Play):** Lifestyle

---

## Description (long — both stores)

> Heartland Weather Desk is the forecast built for people who actually go outside
> in the Midwest. Accurate first, honest always, and funny enough to make a cold
> front bearable.

**Accuracy is the whole point.**
In the U.S. we lead with the official **National Weather Service** gridpoint
forecast — the same NBM-based numbers the pros use — for current conditions, the
hourly outlook, the temperature trend, and today's rain odds, backed by
high-resolution models (HRRR/NBM) for everything else. You see the source right
on screen.

**An honest sky.** Most apps round the day up to a cheerful sun. We show the actual
cloud cover — clear, partly cloudy, overcast — as a straight percentage, because a
grey Tuesday is still a Tuesday.

**What you get, free:**
• 10-day and hour-by-hour forecast, timezone-correct wherever you look
• Cloud cover you can trust — a real sky percentage, not full-sun wishful thinking
• Air quality (US AQI), humidity, and a real "feels like"
• Extreme-weather alerts straight from the National Weather Service
• Plain-English **what to wear** and a blunt **should-I-stay-home** verdict
• Live local sports lines — the weather at the ballpark and what to wear to the game

**Premium unlocks the lifestyle layer:**
• 🔥 **BBQ forecast** — grill verdict + the best window to cook today
• ⛳ **Golf forecast** — tee-time playability
• 🦌🎣 **Field & Stream** — hunting & fishing ratings, solunar feeding windows, moon
  phase, and the barometric-pressure trend that actually moves fish
• 🔔 **Severe-weather push alerts** — the big one, for when minutes matter
• 📍 Unlimited saved locations and game-day reminders

**Radar & maps:** animated precipitation radar, cloud cover, and a live wind field.

Not a substitute for official warnings. If a siren goes off, don't finish reading
the app.

*New visitors get a 14-day full-access trial. After that, weather + local sports
stay free; Premium is [$2.99/mo or $19.99/yr].*

---

## What's New (first release)
`First release. The Midwest finally has a weather app with a sense of humor —
powered by the official National Weather Service forecast, with severe-weather
alerts, radar, sports, BBQ, and hunting/fishing smarts.`

---

## Apple App Store — App Privacy ("nutrition label") answers

Fill these in App Store Connect → App Privacy. Based on what the app actually does.

**Do you collect data? → Yes** (only the items below; everything else = No).

| Data type | Collected? | Linked to identity? | Used for tracking? | Purpose |
|---|---|---|---|---|
| **Coarse/Precise Location** | Yes | **No** (not linked to an identity) | **No** | App Functionality (fetch the forecast for your spot) |
| **Device ID (push token)** | Yes — only if push alerts enabled | No | No | App Functionality (deliver severe-weather alerts) |
| **Purchases** | Yes — only if you subscribe | No | No | App Functionality (unlock/restore Premium) |

- **Tracking:** **No.** The app does not track users across apps/sites; no IDFA.
- **Analytics:** None.
- Location is "used but not linked to the user's identity" and **not** stored by us
  unless push alerts are on (then only tied to an anonymous push token).

## Google Play — Data Safety form answers

Play Console → App content → Data safety.

- **Does your app collect or share user data? → Yes.**
- **Is all data encrypted in transit? → Yes** (HTTPS to all providers).
- **Can users request data deletion?** Yes — disabling notifications removes the
  device from the alert service; clearing app data removes on-device settings.

| Data | Collected | Shared | Purpose | Optional? |
|---|---|---|---|---|
| **Location (approximate & precise)** | Yes | Sent to weather providers to return the forecast | App functionality | Required for auto-location; can type a city/ZIP instead |
| **Device/push token** | Yes (if push on) | No | App functionality (severe-weather alerts) | Optional |
| **Purchase history** | Yes (if subscribed) | With RevenueCat/store | App functionality | Optional |

- **No** personal info (name/email), **no** financial info stored by us, **no**
  analytics, **no** advertising data, **no** data sold.

## Age rating
- **Apple:** 4+ (no objectionable content; mild humor is fine — no mature themes).
- **Google (IARC questionnaire):** Everyone. Answer "no" to all violence/sexual/
  substance questions. Note: references to hunting/fishing and BBQ are informational;
  no graphic content.

---

## Privacy policy URL (mandatory, both stores)
Host the included **`privacy-policy.html`** and use its public URL:
`https://teskemj.github.io/ai/privacy-policy.html`

## Support URL / contact
- Support URL: `https://teskemj.github.io/ai/`
- Contact email: `Michael.teske@outlook.com`

---

## Screenshots — required sizes & shot list

Generate from the live app (or `demo.html`, which is fully unlocked). Shoot in
**dark theme** on a scenic location (e.g. De Pere, WI) with an active-ish forecast.

**Required device sizes**
| Store | Device | Pixel size (portrait) | How many |
|---|---|---|---|
| App Store | iPhone 6.7" (15 Pro Max) | 1290 × 2796 | 3–10 |
| App Store | iPhone 6.5" (11 Pro Max) | 1242 × 2688 | 3–10 (can reuse/scale) |
| App Store | iPad 12.9" (optional) | 2048 × 2732 | if you ship iPad |
| Google Play | Phone | ≥ 1080 px short side (e.g. 1080 × 2340) | 2–8 |
| Google Play | Feature graphic | 1024 × 500 | 1 (required) |

**Shot list (6 screens, captioned)**
1. **Live / current conditions** — "The official NWS forecast, with a Midwest accent."
2. **Temperature trend chart** — "See the next 48 hours at a glance."
3. **Severe-weather alert + what-to-wear** — "Know when to worry — and when not to."
4. **Radar** — "Live radar, clouds, and wind."
5. **BBQ / Field & Stream (Premium)** — "Grill, hunt, fish — timed to the weather."
6. **Sports / Ballpark report** — "Weather at the ballpark + what to wear to the game."

**Generated set (dark theme) is in [`store-assets/`](store-assets/):**
- `store-assets/screenshots/iphone-6.7/` — 6 shots at 1290×2796 (Apple)
- `store-assets/screenshots/android-phone/` — 6 shots at 1080×2400 (Play)
- `store-assets/feature-graphic.png` — 1024×500 (Play, required)
- `store-assets/contact-sheet.png` — one-image overview

Regenerate with `npm run assets:shots` / `npm run assets:feature`. (The radar shot
uses a representative storm cell + neutral basemap for preview; re-shoot on a live
device if you want an actual radar frame.)

---

## Pre-submit checklist
- [ ] Data licensing resolved (STORE_LAUNCH.md §0) ⚠️
- [x] App icon (1024²) + splash (2732²) — `assets/icon.png`, `assets/splash.png`
- [ ] `npm run assets` run after `cap add ios android` (generates all sizes)
- [x] Privacy policy page — `privacy-policy.html` (contact email set)
- [x] Contact/support email set (policy + store listing): Michael.teske@outlook.com
- [x] Screenshots generated — `store-assets/` (iPhone 6.7" + Android phone + feature graphic)
- [ ] Apple App Privacy answers entered (table above)
- [ ] Google Play Data Safety answers entered (table above)
- [ ] RevenueCat products + entitlement live, sandbox-tested (REVENUECAT.md)
- [ ] Push alerts tested on a real device (PUSH.md)
- [ ] Apple Dev ($99/yr) + Google Play ($25) accounts enrolled
