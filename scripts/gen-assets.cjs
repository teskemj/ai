// Renders the source app icon (1024²) and splash (2732²) into ./assets from SVG,
// using the pre-installed Chromium via Playwright so the output stays crisp.
// Run:  node scripts/gen-assets.cjs
// Then: npm run assets   (fans these two out to every iOS/Android size)
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const mark = require("./mark.svg.js");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "assets");

function iconPage(px) {
  return `<!doctype html><html><head><meta charset="utf-8">
  <style>html,body{margin:0;padding:0;background:#0d131b}
  #c{width:${px}px;height:${px}px;overflow:hidden}</style></head><body>
  <div id="c"><svg width="${px}" height="${px}" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">${mark({ vignette: true })}</svg></div>
  </body></html>`;
}

function splashPage(px) {
  const inner = px * 0.432 | 0; // ~1180 of 2732
  return `<!doctype html><html><head><meta charset="utf-8">
  <style>html,body{margin:0;padding:0}
  #c{width:${px}px;height:${px}px;background:
     radial-gradient(60% 55% at 50% 42%, #101a25 0%, #0d131b 55%, #0a1016 100%);
     position:relative;overflow:hidden;font-family:Georgia,'Times New Roman',serif}
  #mk{position:absolute;left:50%;top:50%;transform:translate(-50%,-56%);width:${inner}px;height:${inner}px;border-radius:${px*0.016|0}px;overflow:hidden}
  #wm{position:absolute;left:0;right:0;top:50%;margin-top:${px*0.234|0}px;text-align:center;color:#e7edf3}
  #wm .t{font-size:${px*0.043|0}px;letter-spacing:2px}
  #wm .s{font-size:${px*0.019|0}px;letter-spacing:10px;text-transform:uppercase;color:#56b6cf;margin-top:${px*0.0095|0}px;font-family:-apple-system,Segoe UI,Roboto,sans-serif}
  </style></head><body>
  <div id="c">
    <div id="mk"><svg width="${inner}" height="${inner}" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">${mark({ vignette: false })}</svg></div>
    <div id="wm"><div class="t">Heartland Weather Desk</div><div class="s">Midwest forecasting</div></div>
  </div></body></html>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const p = await browser.newPage({ deviceScaleFactor: 1 });

  await p.setViewportSize({ width: 1024, height: 1024 });
  await p.setContent(iconPage(1024), { waitUntil: "networkidle" });
  await p.locator("#c").screenshot({ path: path.join(OUT, "icon.png") });

  await p.setViewportSize({ width: 2732, height: 2732 });
  await p.setContent(splashPage(2732), { waitUntil: "networkidle" });
  await p.locator("#c").screenshot({ path: path.join(OUT, "splash.png") });

  await browser.close();
  for (const f of ["icon.png", "splash.png"]) {
    console.log("✓ assets/" + f, (fs.statSync(path.join(OUT, f)).size / 1024 | 0) + "KB");
  }
})();
