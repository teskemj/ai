// Copies the canonical web app (root index.html) into the Capacitor webDir (www/).
// Edit index.html at the repo root — it's the single source of truth and also what
// GitHub Pages serves. Run `npm run sync:web` before `npx cap copy` / `npx cap sync`.
import { copyFileSync, mkdirSync, existsSync } from "node:fs";

mkdirSync("www", { recursive: true });

if (!existsSync("index.html")) {
  console.error("✗ index.html not found at repo root — nothing to copy.");
  process.exit(1);
}

copyFileSync("index.html", "www/index.html");
console.log("✓ Synced index.html → www/index.html");
