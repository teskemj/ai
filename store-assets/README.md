# Store assets

Marketing images for the App Store and Google Play listings. All generated from
the live app (dark theme, De Pere WI, with representative mocked data), so they
stay in sync with the real UI.

## What's here
```
store-assets/
├─ contact-sheet.png            one-image overview of the six phone shots
├─ feature-graphic.png          1024×500  — Google Play feature graphic (required)
└─ screenshots/
   ├─ iphone-6.7/   1290×2796   — Apple App Store (iPhone 6.7"); 6 shots
   └─ android-phone/ 1080×2400  — Google Play phone; 6 shots
```

The six shots (same order both platforms):

| File | Screen | Caption idea |
|---|---|---|
| `1-live`   | Current conditions + severe-weather alert | "The official NWS forecast, with a Midwest accent." |
| `2-trend`  | 48-hour temperature trend + what-to-wear | "See the next 48 hours at a glance." |
| `3-bbq`    | BBQ forecast (Premium) | "Grill, timed to the weather." |
| `4-radar`  | Live radar / clouds / wind | "Live radar, clouds, and wind." |
| `5-nature` | Field & Stream (Premium) | "Hunt and fish by the solunar windows." |
| `6-sports` | The Ballpark Report | "Weather at the ballpark + what to wear." |

> The radar shot uses a representative storm cell and a neutral basemap for
> preview (live map tiles can't be fetched in the build sandbox). Re-shoot on a
> real device/live site if you want an actual radar frame for the final listing.

## Apple sizes
- **6.7"** (1290×2796) is the primary required size and is what's here. Apple will
  scale it to the other iPhone sizes; add a 6.9" (1320×2868) set too if you want
  pixel-perfect on the newest Max.

## Google Play sizes
- **Phone screenshots:** 1080×2400 here (within Play's allowed range; 2–8 required).
- **Feature graphic:** 1024×500 (`feature-graphic.png`), required.
- You'll also need the **512×512 hi-res icon** — generate from `assets/icon.png`
  (e.g. `npm run assets` produces the Play icon, or resize the 1024² source).

## Regenerate
Needs Playwright + the bundled Chromium, and an up-to-date `demo.html`
(`npm run sync:web`). Then:
```bash
npm run assets:shots      # re-renders both device sets into screenshots/
npm run assets:feature    # re-renders feature-graphic.png + contact-sheet.png
npm run assets:store      # icon + splash + shots + feature, all at once
```
Inputs (vendored Leaflet + mock data) live in `scripts/screenshot-src/`; the
shot list, device sizes, and mock data are edited in `scripts/gen-shots.cjs`.
See **../STORE_LISTING.md** for the listing copy and submission answers.
