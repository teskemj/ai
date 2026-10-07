# Severe-weather push backend

Firebase Functions that watch the NWS and push severe-weather alerts to the app.

## One-time setup
1. Create a Firebase project and upgrade it to the **Blaze** plan (scheduled functions require it).
2. Install the CLI and sign in:
   ```bash
   npm i -g firebase-tools && firebase login
   ```
3. From the repo root, init functions pointing at this folder (or run inside it):
   ```bash
   cd server/weather-alerts && npm install
   firebase use --add         # pick your project
   ```
4. Edit `index.js` → set `UA` to a real contact (NWS requires an identifying User-Agent).

## Deploy
```bash
npm run deploy      # firebase deploy --only functions
```
You'll get a URL for `registerDevice`, e.g.
`https://us-central1-<project>.cloudfunctions.net/registerDevice`.
Put that in the app at `PUSH_ENDPOINT` (top of the push module in `index.html`).

## How it works
- The app calls **registerDevice** with `{ token, platform, locations }` and it's stored in
  Firestore (`devices/{token}`).
- **checkAlerts** runs every 15 minutes: for each device + location it queries
  `api.weather.gov/alerts/active?point=lat,lon`, and for any **Severe/Extreme** alert it
  hasn't already sent to that device, it sends an FCM push. Sent alert IDs are remembered
  (last 50) so nobody gets the same alert twice. Dead tokens are pruned automatically.

## Mobile push credentials
- **Android:** FCM works out of the box once `google-services.json` is in the Android app.
- **iOS:** upload your **APNs auth key (.p8)** in Firebase Console → Project Settings →
  Cloud Messaging, and add `GoogleService-Info.plist` to the iOS app.

## Cost
Tiny. NWS is free; FCM is free; Functions on Blaze bill per-invocation — a 15-minute poll
over a modest user base stays within the free monthly allotment for a long time. Scale note:
the poller fetches once per unique rounded location per run; for large user bases, batch by
NWS zone instead of per-point.
