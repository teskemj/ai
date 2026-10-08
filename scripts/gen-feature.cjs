const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const mark = require("./mark.svg.js");
const OUT = path.join(__dirname, "..", "store-assets");
const SHOTS = path.join(OUT, "screenshots", "iphone-6.7");

const feature = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;padding:0}
#c{width:1024px;height:500px;position:relative;overflow:hidden;
   background:radial-gradient(70% 120% at 22% 40%, #13202c 0%, #0d131b 60%, #0a1016 100%);
   font-family:Georgia,'Times New Roman',serif;color:#e7edf3}
#mk{position:absolute;left:70px;top:50%;transform:translateY(-50%);width:300px;height:300px;border-radius:30px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5)}
#tx{position:absolute;left:430px;top:50%;transform:translateY(-50%);right:50px}
#tx .t{font-size:60px;line-height:1.05;letter-spacing:.5px}
#tx .s{font-size:27px;color:#e6a94a;margin-top:14px;font-style:italic}
#tx .chips{margin-top:26px;display:flex;flex-wrap:wrap;gap:10px;font-family:-apple-system,Segoe UI,Roboto,sans-serif}
#tx .chip{font-size:16px;letter-spacing:.04em;padding:8px 15px;border:1px solid #2a3744;border-radius:999px;color:#9fb0c0}
#tx .chip b{color:#56b6cf;font-weight:600}
</style></head><body><div id="c">
  <div id="mk"><svg width="300" height="300" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">${mark({vignette:false})}</svg></div>
  <div id="tx">
    <div class="t">Heartland<br>Weather Desk</div>
    <div class="s">Midwest weather, with a wink.</div>
    <div class="chips">
      <span class="chip"><b>Official NWS</b> forecast</span>
      <span class="chip">Severe alerts</span>
      <span class="chip">Live radar</span>
      <span class="chip">Sports · BBQ · Hunt · Fish</span>
    </div>
  </div>
</div></body></html>`;

const caps = {
  "1-live":   "Current conditions + severe alerts",
  "2-trend":  "48-hour temperature trend",
  "3-bbq":    "BBQ forecast (Premium)",
  "4-radar":  "Live radar, clouds & wind",
  "5-nature": "Field & Stream (Premium)",
  "6-sports": "The Ballpark Report",
};
const b64 = k => "data:image/png;base64," + fs.readFileSync(path.join(SHOTS, `${k}.png`)).toString("base64");
const sheetImgs = Object.keys(caps).map(k =>
  `<figure><img src="${b64(k)}"><figcaption>${caps[k]}</figcaption></figure>`).join("");
const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;background:#0a0e14;font-family:-apple-system,Segoe UI,Roboto,sans-serif}
#c{width:1860px;padding:40px 40px 48px;box-sizing:border-box}
h1{color:#e7edf3;font-size:30px;margin:4px 0 2px}
p.sub{color:#9fb0c0;font-size:16px;margin:0 0 28px}
.row{display:flex;gap:26px;justify-content:space-between}
figure{margin:0;flex:1}
img{width:100%;border-radius:18px;border:1px solid #243040;display:block}
figcaption{color:#cdd8e2;font-size:15px;text-align:center;margin-top:12px}
</style></head><body><div id="c">
  <h1>Heartland Weather Desk — store screenshots (iPhone 6.7″, 1290×2796)</h1>
  <p class="sub">Dark theme · De Pere, WI · mocked data for preview. Same six render at 1080×2400 for Google Play.</p>
  <div class="row">${sheetImgs}</div>
</div></body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 1 });
  await p.setViewportSize({ width: 1024, height: 500 });
  await p.setContent(feature, { waitUntil: "networkidle" });
  await p.locator("#c").screenshot({ path: path.join(OUT, "feature-graphic.png") });

  await p.setViewportSize({ width: 1860, height: 1200 });
  await p.setContent(sheet, { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  await p.locator("#c").screenshot({ path: path.join(OUT, "contact-sheet.png") });
  await b.close();
  console.log("feature-graphic.png", (fs.statSync(path.join(OUT,"feature-graphic.png")).size/1024|0)+"KB");
  console.log("contact-sheet.png", (fs.statSync(path.join(OUT,"contact-sheet.png")).size/1024|0)+"KB");
})();
