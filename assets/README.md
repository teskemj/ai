# App icons & splash screens

`icon.png` (1024×1024) and `splash.png` (2732×2732) are **already here** — a
"Heartland sunrise" mark (warm amber sun cresting a teal horizon on the app's deep
slate `#0d131b`). After adding the native platforms, run `npm run assets` (uses
`@capacitor/assets`) to generate every icon/splash size for iOS and Android:

```bash
npx cap add ios android   # creates the native projects
npm run assets            # fans these two sources out to all required sizes
```

- `icon.png` — 1024×1024, no transparency, no rounded corners (the stores round it).
- `splash.png` — 2732×2732, important content centered within the middle ~1200×1200.

## Regenerating the source art
The two PNGs are rendered from SVG via Chromium, so they stay crisp and are easy to
tweak:

```bash
npm run assets:art        # re-renders icon.png + splash.png from scripts/mark.svg.js
```

To change the look (sun size, colors, add a monogram), edit `scripts/mark.svg.js`
and re-run, or just drop in your own 1024²/2732² PNGs — the filenames are all
`npm run assets` needs.
