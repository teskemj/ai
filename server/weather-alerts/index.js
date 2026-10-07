/**
 * Heartland Weather Desk — severe-weather push backend (Firebase Functions v2).
 *
 * Two functions:
 *   registerDevice (HTTPS)  — the app POSTs its push token + watched locations
 *   checkAlerts    (schedule)— every 15 min, polls the NWS for each location and
 *                              pushes NEW severe/extreme alerts via FCM.
 *
 * Deploy: see README.md. Requires the Firebase Blaze plan (scheduled functions).
 */
const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
setGlobalOptions({ region: "us-central1", memory: "256MiB" });

// NWS asks for a identifying User-Agent on every request — put a real contact here.
const UA = "HeartlandWeatherDesk/1.0 (contact: michael.teske@outlook.com)";
const SEVERE = new Set(["Extreme", "Severe"]); // only push the serious ones

/* ---- the app registers / updates its device here ---- */
exports.registerDevice = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }
  const { token, platform, locations } = req.body || {};
  if (!token) { res.status(400).json({ error: "token required" }); return; }
  await db.collection("devices").doc(token).set({
    token,
    platform: platform || "unknown",
    locations: Array.isArray(locations) ? locations.slice(0, 10) : [],
    updated: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  res.json({ ok: true });
});

/* ---- fetch active NWS alerts for a point ---- */
async function activeAlerts(lat, lon) {
  const url = `https://api.weather.gov/alerts/active?status=actual&point=${lat.toFixed(4)},${lon.toFixed(4)}`;
  const r = await fetch(url, { headers: { Accept: "application/geo+json", "User-Agent": UA } });
  if (!r.ok) return [];
  const d = await r.json();
  return (d.features || [])
    .map((f) => ({ id: f.id, event: f.properties.event, headline: f.properties.headline, severity: f.properties.severity }))
    .filter((a) => a.id && a.event);
}

/* ---- poll + push every 15 minutes ---- */
exports.checkAlerts = onSchedule("every 15 minutes", async () => {
  const snap = await db.collection("devices").get();
  const cache = new Map(); // rounded "lat,lon" -> alerts, so shared locations fetch once

  for (const doc of snap.docs) {
    const dev = doc.data();
    const sent = new Set(dev.sent || []);
    let changed = false;

    for (const loc of dev.locations || []) {
      if (typeof loc.lat !== "number" || typeof loc.lon !== "number") continue;
      const key = loc.lat.toFixed(2) + "," + loc.lon.toFixed(2);
      let alerts = cache.get(key);
      if (!alerts) { try { alerts = await activeAlerts(loc.lat, loc.lon); } catch (e) { alerts = []; } cache.set(key, alerts); }

      for (const a of alerts) {
        if (!SEVERE.has(a.severity) || sent.has(a.id)) continue;
        try {
          await admin.messaging().send({
            token: dev.token,
            notification: {
              title: `⚠️ ${a.event}`,
              body: (a.headline || `${a.event} for ${loc.label || "your area"}`).slice(0, 180),
            },
            data: { alertId: a.id, event: a.event, location: loc.label || "" },
            android: { priority: "high" },
            apns: { payload: { aps: { sound: "default" } } },
          });
          sent.add(a.id);
          changed = true;
        } catch (e) {
          if (e.code === "messaging/registration-token-not-registered") { await doc.ref.delete(); changed = false; break; }
          console.error("send failed", e.code || e.message);
        }
      }
    }

    if (changed) await doc.ref.set({ sent: Array.from(sent).slice(-50) }, { merge: true });
  }
});
