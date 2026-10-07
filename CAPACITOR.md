# Building the mobile apps (iOS + Android)

This wraps the same `index.html` that runs on the web into native iOS and Android
apps using [Capacitor](https://capacitorjs.com). One codebase, two stores.

## Prerequisites
- **Node 18+**
- **iOS builds:** macOS + Xcode 15+ (and an Apple Developer account, $99/yr, to ship)
- **Android builds:** Android Studio (and a Google Play Developer account, $25 once, to ship)

## First-time setup
```bash
npm install                 # install Capacitor + plugins
npm run sync:web            # copy index.html -> www/
npx cap add ios             # creates the ios/ project (macOS only)
npx cap add android         # creates the android/ project
npx cap sync                # copy web assets + install native plugin code
```

## Generate icons & splash (optional but recommended)
Put `icon.png` (1024×1024) and `splash.png` (2732×2732) in `./assets`, then:
```bash
npm run assets
```

## Run it
```bash
npm run open:ios        # opens Xcode — pick a simulator/device, press Run
npm run open:android    # opens Android Studio — pick an emulator/device, press Run
```

## After every change to the web app
Edit the root **`index.html`** (the single source of truth — it's also what GitHub
Pages serves), then:
```bash
npm run sync:web && npx cap copy
```

## What's already wired
`capacitor.config.json` sets the app id (`com.becausesecurity.heartlandweather`),
name, splash screen, and push-notification presentation. These plugins are in
`package.json`, ready to use from the web code via `import { ... } from '@capacitor/...'`
(after `npm install`):

| Plugin | Powers (your Pro features) |
|---|---|
| `@capacitor/push-notifications` | Severe-weather alerts (the keystone paid feature) |
| `@capacitor/local-notifications` | BBQ "good window opens at 4 PM", game-day reminders |
| `@capacitor/geolocation` | Native, more accurate location than the browser |
| `@capacitor/preferences` | Reliable saved locations / settings (replaces localStorage) |
| `@capacitor/splash-screen`, `@capacitor/status-bar`, `@capacitor/app` | Native polish |

The existing web app runs **unchanged** inside the native WebView — `fetch` to
NWS / Open-Meteo / ESPN works there (no browser-sandbox restrictions), so you can
build and run immediately, then progressively adopt the native plugins.

See **STORE_LAUNCH.md** for the data-licensing requirements and the full
submission checklist before you charge money.
