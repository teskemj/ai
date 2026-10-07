# Store launch checklist & monetization plan

Everything needed to take Heartland Weather Desk to the Apple App Store and Google
Play — and charge for it without stepping on a landmine.

## 0. Data licensing — do this FIRST ⚠️
The moment the app charges money or shows ads, it's **commercial use**. Current
sources and what that means:

| Source | Commercial use? | Action |
|---|---|---|
| **NWS / weather.gov** (alerts) | ✅ Public domain | Keep as-is |
| **Open-Meteo** (forecast, AQI, pressure) | ⚠️ Free tier is **non-commercial** | Move to their paid API plan (~€29–€299/mo) or another licensed provider |
| **ESPN hidden API** (schedules) | ❌ **Not licensed** for commercial use | License a sports feed (SportsDataIO, Sportradar) **or** remove live schedules for the paid build |
| **Zippopotam** (ZIP lookup) | Fine; or use the OS geocoder | Optional |

Don't skip this. It's the difference between a side project and a takedown notice.

## 1. Free vs. Premium split
Free is genuinely useful: **weather + local sports**. Premium unlocks everything else.

**Free — weather & local sports**
- Current conditions, hourly, 10-day, air quality, humidity
- Extreme-weather alerts, what-to-wear, stay-home verdict
- Realistic scenic background, auto-colored by your local team (by ZIP)
- Holidays banner
- Local sports: Game Watch schedules, the weather line, bleacher attire

**Premium — unlocks everything**
- 🔥 **BBQ forecast** — grill verdict + best window
- ⛳ **Golf forecast** — tee-time playability + best window
- 🦌🎣 **Field & Stream** — fishing/hunting ratings, solunar windows, moon, pressure trend
- 🎨 **Team backgrounds** — hand-pick any team's colors
- 🔔 **Severe-weather push alerts** (native app; the #1 paid feature)
- 📍 Unlimited saved locations · 🏈 game-day/tailgate reminders · 🚫 ad-free

## 2. Pricing
- **Freemium + annual subscription** is the best fit: **$2.99/mo or $19.99/yr**, with a 7-day trial.
- Use **RevenueCat** to manage subscriptions across both stores from one SDK.
- Enroll in **Apple Small Business Program** + **Google Play's 15% tier** → you pay 15%, not 30%, under $1M/yr.

## 3. Accounts & costs
- Apple Developer Program — **$99/year**
- Google Play Developer — **$25 one-time**
- Commercial weather API — **~$30–50/mo** to start
- Firebase Cloud Messaging (push) — free tier is plenty
- A backend or scheduled function to send severe-weather pushes (Firebase Functions / a tiny server)

## 4. Technical build (see CAPACITOR.md)
1. `npm install` → `npm run sync:web` → `npx cap add ios android` → `npx cap sync`
2. Add native value so Apple approves (guideline 4.2 rejects pure web wrappers):
   **push alerts + a home-screen widget + offline cache** are the ones that matter.
3. Wire `@capacitor/push-notifications` (severe weather) and `@capacitor/local-notifications` (BBQ/game reminders).
4. Add in-app purchases via RevenueCat; gate the Pro features.

## 5. Store submission assets (both stores require these)
- App icon (1024×1024) + splash — generate with `npm run assets`
- Screenshots for each required device size (iPhone 6.7"/6.5", iPad, Android phone/tablet)
- **Privacy policy URL** (mandatory). Must disclose location use and any analytics.
- App Store: privacy "nutrition label" + data-use answers
- Google Play: Data Safety form + target API level compliance
- Short + long description, keywords, category (Weather)
- Age rating questionnaire

## 6. Suggested sequence
1. Lock in commercial data sources (step 0).
2. Keep the free web app (GitHub Pages) as the marketing funnel.
3. Build the native shell + push alerts + one widget.
4. Add IAP, define Free/Pro gate.
5. Privacy policy, screenshots, submit. Launch annual-subscription freemium.
6. Market to the niche: Midwest outdoors / Packers-Brewers-deer-camp identity.

## Positioning
Don't fight Weather.com on radar. Win as the **regional lifestyle app** — the one
that tells you whether to grill, hunt, fish, or brave the tailgate, with a Wisconsin
accent and a sense of humor. That personality is the moat.
