// RevenueCat client for the native app. Bundled to ../purchases.js by `npm run build:purchases`.
// On the web this file is NOT used (a no-op stub purchases.js ships instead), so the
// buildless web/Pages app is never affected.
import { Purchases } from "@revenuecat/purchases-capacitor";

const ENTITLEMENT = "premium"; // must match the entitlement id in the RevenueCat dashboard

function apply(info) {
  try {
    const active = !!(info && info.entitlements && info.entitlements.active && info.entitlements.active[ENTITLEMENT]);
    localStorage.setItem("hwd.pro", active ? "1" : "0");
    window.dispatchEvent(new CustomEvent("hwd-entitlement", { detail: { active } }));
  } catch (e) {}
}

async function refresh() {
  try { const { customerInfo } = await Purchases.getCustomerInfo(); apply(customerInfo); } catch (e) {}
}

async function configure(apiKey) {
  if (!apiKey) return;
  try {
    await Purchases.configure({ apiKey });
    Purchases.addCustomerInfoUpdateListener((info) => apply(info));
    await refresh();
  } catch (e) { console.warn("RC configure", e); }
}

async function purchase() {
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings && offerings.current && offerings.current.availablePackages && offerings.current.availablePackages[0];
    if (!pkg) throw new Error("no current offering");
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    apply(customerInfo);
    return !!(customerInfo.entitlements.active && customerInfo.entitlements.active[ENTITLEMENT]);
  } catch (e) { console.warn("RC purchase", e); return false; }
}

async function restore() {
  try {
    const res = await Purchases.restorePurchases();
    apply(res.customerInfo || res);
    return true;
  } catch (e) { console.warn("RC restore", e); return false; }
}

window.HWDPurchases = { configure, purchase, restore, refresh };
