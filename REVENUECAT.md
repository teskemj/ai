# In-app purchases (RevenueCat)

Turns the Premium unlock into a real App Store / Google Play subscription, without
touching the buildless web/Pages app.

## How it's wired
- `src/purchases.src.js` — the RevenueCat client. Bundled to **`purchases.js`** for the
  native app. It sets `localStorage["hwd.pro"]` from the `premium` entitlement and fires a
  `hwd-entitlement` event; the app's `isPro()` already reads that flag.
- `purchases.js` (committed) is a **no-op stub** for the web — so GitHub Pages has no IAP and
  nothing breaks. `npm run build:purchases` overwrites it with the real bundle for native.
- In `index.html`: on a native platform the app calls `window.HWDPurchases.configure(key)`,
  the **Keep Premium** button calls `purchase()`, **Restore purchase** calls `restore()`, and
  the `hwd-entitlement` event re-renders. On the web these fall back to the demo unlock.

## Setup
1. Create a [RevenueCat](https://www.revenuecat.com) project; add your App Store + Play apps.
2. Create an **entitlement** with id `premium`, a product (e.g. `hwd_annual` $19.99/yr with a
   14-day trial), and an **offering** containing it.
3. Put your **public SDK keys** in `index.html`: `RC_API_KEY_IOS` and `RC_API_KEY_ANDROID`.
4. Install + build:
   ```bash
   npm install
   npm run build:purchases     # bundles src/purchases.src.js -> purchases.js
   npm run sync:web            # copies it into www/
   npx cap sync
   ```
5. Store config:
   - **iOS:** add the in-app purchase + subscription in App Store Connect; add the StoreKit
     capability in Xcode.
   - **Android:** create the subscription in Play Console; add the RevenueCat/Play billing key.

## Test
- RevenueCat's **sandbox** (Apple sandbox tester / Play internal testing) exercises the real
  flow without charging. Verify: purchase flips `hwd.pro` to "1", Premium unlocks, and
  Restore works on a fresh install.
- The **web** always uses the demo unlock / 14-day trial — IAP is native-only.

## Notes
- If you bump `@revenuecat/purchases-capacitor`, re-check the method shapes in
  `src/purchases.src.js` against their docs (configure / getOfferings / purchasePackage /
  restorePurchases / getCustomerInfo).
