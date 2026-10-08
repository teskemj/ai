const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const SRC = __dirname + "/screenshot-src";
const OUT = path.join(__dirname, "..", "store-assets", "screenshots");
fs.mkdirSync(OUT, { recursive: true });
const mock = JSON.parse(fs.readFileSync(path.join(SRC, "mock.json"), "utf8"));
const leaflet = fs.readFileSync(path.join(SRC, "leaflet.min.js"), "utf8");
const leafletCss = fs.readFileSync(path.join(SRC, "leaflet.css"), "utf8");

// ---- severe alert (Midwest-flavored) ----
const alerts = { features: [{ properties: {
  event: "Winter Storm Warning", severity: "Severe", certainty: "Likely", urgency: "Expected",
  headline: "Winter Storm Warning in effect from 6 PM this evening to noon CST tomorrow",
  description: "Heavy snow expected. Total snow accumulations of 6 to 10 inches and winds gusting as high as 40 mph.",
  areaDesc: "Brown; Outagamie; Winnebago", ends: "2026-10-09T18:00:00-05:00"
}}]};

// ---- ESPN schedule: build a game TODAY for whatever team path is requested ----
function espnFor(url) {
  const lg = /baseball/.test(url) ? "mlb" : /basketball/.test(url) ? "nba"
          : /college-football/.test(url) ? "ncaaf" : "nfl";
  const m = url.match(/teams\/([^/]+)\/schedule/); const abbr = (m ? m[1] : "gb").toUpperCase();
  const opp = { nfl: { n: "Chicago Bears", s: "Bears", a: "CHI" }, mlb: { n: "Chicago Cubs", s: "Cubs", a: "CHC" },
                nba: { n: "Chicago Bulls", s: "Bulls", a: "CHI" }, ncaaf: { n: "Minnesota", s: "Gophers", a: "MINN" } }[lg];
  const d = new Date(); d.setHours(19, 10, 0, 0); // 7:10 PM today
  return { team: { abbreviation: abbr }, events: [{ date: d.toISOString(), competitions: [{ competitors: [
    { homeAway: "home", team: { abbreviation: abbr, displayName: "Home", shortDisplayName: "Home" } },
    { homeAway: "away", team: { abbreviation: opp.a, displayName: opp.n, shortDisplayName: opp.s } }
  ], status: { type: { completed: false, state: "pre" } } }] }] };
}

// ---- tile SVGs ----
function svg(body) { return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">${body}</svg>`; }
function basemapTile(x, y) {
  const water = ((x * 7 + y * 13) % 5 === 0);
  return svg(`<rect width="256" height="256" fill="#dfe3da"/>
    <rect x="0" y="${(y*37)%180}" width="256" height="46" fill="#e7ebe2"/>
    ${water ? `<path d="M${(x*53)%120} 256 q 80 -90 150 -40 l 60 80 Z" fill="#b9c7cf" opacity="0.8"/>` : ``}
    <path d="M-10 ${(x*29)%220} L266 ${(x*29)%220+28}" stroke="#c6cabf" stroke-width="3" fill="none"/>
    <path d="M${(y*31)%200} -10 L${(y*31)%200+24} 266" stroke="#ccd0c6" stroke-width="2" fill="none"/>`);
}
function precipTile(z, x, y) {
  if (+z !== 7) return svg("");
  const dx = x - 32, dy = y - 46;
  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) return svg("");
  const cx = 128 - dx * 256, cy = 128 - dy * 256; // storm core centered on center tile
  return svg(`<defs><radialGradient id="g" cx="${cx}" cy="${cy}" r="300" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#ef6a2e" stop-opacity="0.85"/>
    <stop offset="0.18" stop-color="#e8d13a" stop-opacity="0.8"/>
    <stop offset="0.42" stop-color="#3bbf4a" stop-opacity="0.72"/>
    <stop offset="0.7" stop-color="#7ec850" stop-opacity="0.5"/>
    <stop offset="1" stop-color="#7ec850" stop-opacity="0"/>
  </radialGradient></defs><rect width="256" height="256" fill="url(#g)"/>`);
}
const radarJson = { host: "https://radar.mock", radar: {
  past: [{ time: Math.floor(Date.now()/1000)-600, path: "/v2/radar/past" }],
  nowcast: [{ time: Math.floor(Date.now()/1000)+600, path: "/v2/radar/now" }] }, satellite: { infrared: [] } };

async function routeAll(ctx) {
  await ctx.route("**/*", route => {
    const url = route.request().url();
    const json = o => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(o) });
    const asvg = s => route.fulfill({ status: 200, contentType: "image/svg+xml", body: s });
    if (/leaflet\.min\.js|leaflet-src\.js|leaflet\.js/.test(url)) return route.fulfill({ status: 200, contentType: "application/javascript", body: leaflet });
    if (/leaflet.*\.css/.test(url)) return route.fulfill({ status: 200, contentType: "text/css", body: leafletCss });
    if (/api\.open-meteo\.com\/v1\/forecast/.test(url)) return json(mock.fc);
    if (/air-quality-api\.open-meteo\.com/.test(url)) return json(mock.air);
    if (/marine-api|ensemble-api|api\.open-meteo\.com/.test(url)) return json(mock.fc); // wind bulk etc.
    if (/api\.weather\.gov\/points\//.test(url)) return json({ properties: { forecastHourly: "https://api.weather.gov/gp/forecast/hourly", forecast: "https://api.weather.gov/gp/forecast" } });
    if (/forecast\/hourly/.test(url)) return json({ properties: { periods: nwsPeriods() } });
    if (/api\.weather\.gov\/alerts/.test(url)) return json(alerts);
    if (/espn\.com/.test(url)) return json(espnFor(url));
    if (/zippopotam/.test(url)) return json({ places: [{ "place name": "De Pere", state: "Wisconsin", latitude: "44.4489", longitude: "-88.0604" }] });
    if (/rainviewer\.com/.test(url)) return json(radarJson);
    if (/radar\.mock/.test(url)) { const m = url.match(/256\/(\d+)\/(\d+)\/(\d+)\//); return asvg(m ? precipTile(m[1], +m[2], +m[3]) : svg("")); }
    if (/tile\.openstreetmap\.org/.test(url)) { const m = url.match(/\/(\d+)\/(\d+)\/(\d+)\.png/); return asvg(m ? basemapTile(+m[2], +m[3]) : svg("")); }
    return route.continue();
  });
}
function nwsPeriods() {
  const out = []; const days = ["2026-10-08", "2026-10-09"];
  for (const day of days) for (let h = 0; h < 24; h++) {
    const isDay = h >= 7 && h < 19, wmo = h % 6 === 0 ? 61 : (isDay ? 1 : 2);
    out.push({ startTime: `${day}T${String(h).padStart(2,"0")}:00:00-05:00`, temperature: 40 + h, temperatureUnit: "F",
      probabilityOfPrecipitation: { value: wmo === 61 ? 55 : 10 }, relativeHumidity: { value: 60 },
      windSpeed: "8 mph", windDirection: "NW", isDaytime: isDay,
      icon: `https://api.weather.gov/icons/land/${isDay ? "day" : "night"}/${wmo===61?"rain":isDay?"few":"sct"}?size=medium` });
  }
  return out;
}

const DEVICES = {
  "iphone-6.7":    { w: 430, h: 932, dsr: 3 },   // 1290 x 2796
  "android-phone": { w: 360, h: 800, dsr: 3 },   // 1080 x 2400
};

async function scrollTo(page, sel, off = 64) {
  await page.evaluate(([s, o]) => {
    const el = document.querySelector(s); if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - o;
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  }, [sel, off]);
  await page.waitForTimeout(350);
}
async function scrollToText(page, text, off = 105) {
  await page.evaluate(([t, o]) => {
    const el = [...document.querySelectorAll(".tab-panel:not([hidden]) h2")].find(h => h.textContent.includes(t));
    if (!el) return; const card = el.closest(".card") || el;
    const top = card.getBoundingClientRect().top + window.scrollY - o;
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  }, [text, off]);
  await page.waitForTimeout(350);
}

const SHOTS = [
  { id: "1-live",    tab: "live",     prep: async p => { await p.evaluate(() => window.scrollTo(0,0)); } },
  { id: "2-trend",   tab: "live",     prep: async p => { await scrollTo(p, ".trend-card", 112); } },
  { id: "3-bbq",     tab: "live",     prep: async p => { await scrollToText(p, "BBQ forecast", 108); } },
  { id: "4-radar",   tab: "radar",    prep: async p => { await p.waitForTimeout(1500); await scrollTo(p, ".radar-card", 150); await p.waitForTimeout(600); } },
  { id: "5-nature",  tab: "nature",   prep: async p => { await scrollTo(p, ".tab-panel:not([hidden]) .section-head", 136); } },
  { id: "6-sports",  tab: "sports",   prep: async p => { await scrollTo(p, ".tab-panel:not([hidden]) .section-head", 136); } },
];

(async () => {
  const browser = await chromium.launch();
  const errs = [];
  for (const [name, d] of Object.entries(DEVICES)) {
    const dir = path.join(OUT, name); fs.mkdirSync(dir, { recursive: true });
    const ctx = await browser.newContext({ viewport: { width: d.w, height: d.h }, deviceScaleFactor: d.dsr, colorScheme: "dark" });
    await routeAll(ctx);
    const page = await ctx.newPage();
    page.on("pageerror", e => errs.push(name + ": " + e.message));
    await page.addInitScript(() => { try { document.documentElement.setAttribute("data-theme", "dark"); } catch(e){} });
    await page.goto("file://" + path.join(__dirname, "..", "demo.html"), { waitUntil: "load" });
    await page.waitForTimeout(500);
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
    await page.waitForTimeout(1700);
    for (const shot of SHOTS) {
      await page.evaluate(t => showTab(t), shot.tab);
      await page.waitForTimeout(500);
      await shot.prep(page);
      await page.screenshot({ path: path.join(dir, `${shot.id}.png`) });
    }
    await ctx.close();
  }
  await browser.close();
  console.log("done. errors:", errs.length ? errs : "none");
  for (const name of Object.keys(DEVICES))
    console.log(" ", name + ":", fs.readdirSync(path.join(OUT, name)).filter(f=>f.endsWith(".png")).length, "shots");
})();
