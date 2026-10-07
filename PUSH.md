# Severe-weather push alerts

The keystone Premium / retention feature: the app pushes **Severe** and **Extreme**
NWS alerts for the user's saved locations, even when the app is closed.

## Pieces
| Part | Where | What it does |
|---|---|---|
| Client | `index.html` (push module, native-guarded) | Registers for push, sends token + watched locations to the backend |
| Backend | `server/weather-alerts/` | Polls NWS every 15 min, sends FCM pushes for new severe alerts |

On the **web** the client is inert (no push) — this runs only inside the iOS/Android
Capacitor app.

## Wire it up
1. **Deploy the backend** — follow `server/weather-alerts/README.md`. Copy the
   `registerDevice` URL it prints.
2. **Point the app at it** — set `PUSH_ENDPOINT` at the top of the push module in
   `index.html` to that URL, then `npm run sync:web`.
3. **Add push plugins to the native build** (already in `package.json`):
   `@capacitor/push-notifications`, `@capacitor/local-notifications`. Run
   `npm install && npx cap sync`.
4. **Native credentials:**
   - Android: drop `google-services.json` into `android/app/`.
   - iOS: add `GoogleService-Info.plist`, enable Push Notifications + Background Modes
     (Remote notifications) capabilities in Xcode, and upload your APNs key to Firebase.

## Behaviour
- Watched locations come from the places the user views (the app stores up to 1 for free,
  up to 10 on Premium — `savedLocations()` in `index.html`).
- Registration only happens for Premium/trial/preview users (`premiumUnlocked()` gate).
- Only `Severe`/`Extreme` alerts push; each alert fires once per device.
- Foreground pushes are mirrored to a local notification so they're visible in-app.

## Try it without the stores
Use the Firebase emulator (`npm run serve` in `server/weather-alerts`) and call
`registerDevice` with curl to confirm the Firestore write, then invoke `checkAlerts`
from the emulator UI. Real device delivery still needs FCM/APNs credentials.
