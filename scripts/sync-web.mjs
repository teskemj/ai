// Copies the canonical web app (root index.html) into the Capacitor webDir (www/),
// and generates a paywall-free demo build (demo.html) from the same source.
// Edit index.html at the repo root — it's the single source of truth and also what
// GitHub Pages serves. Run `npm run sync:web` before `npx cap copy` / `npx cap sync`.
import { copyFileSync, writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";

mkdirSync("www", { recursive: true });

if (!existsSync("index.html")) {
  console.error("✗ index.html not found at repo root — nothing to copy.");
  process.exit(1);
}

const src = readFileSync("index.html", "utf8");
copyFileSync("index.html", "www/index.html");
if (existsSync("purchases.js")) copyFileSync("purchases.js", "www/purchases.js"); // RevenueCat client (stub on web)

// Demo build: everything unlocked, no paywall UI (for marketing, investors, store review).
const demo = "<script>window.HWD_DEMO=true;</script>\n" + src;
writeFileSync("demo.html", demo);
writeFileSync("www/demo.html", demo);

console.log("✓ Synced index.html → www/index.html  (+ demo.html paywall-free build)");
