// Reusable "Heartland sunrise" mark as an SVG string, drawn in a 0 0 1000 1000 viewBox.
// opts.splash = true softens the vignette and lets a wordmark sit below (handled by caller).
module.exports = function mark({ vignette = true } = {}) {
  return `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#101a25"/>
      <stop offset="0.55" stop-color="#0d131b"/>
      <stop offset="1" stop-color="#0a1016"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.44" r="0.42">
      <stop offset="0" stop-color="#e6a94a" stop-opacity="0.55"/>
      <stop offset="0.6" stop-color="#e6a94a" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#e6a94a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f3c879"/>
      <stop offset="0.5" stop-color="#e6a94a"/>
      <stop offset="1" stop-color="#d98b2b"/>
    </linearGradient>
    <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2d6f84"/>
      <stop offset="1" stop-color="#245b6d"/>
    </linearGradient>
    <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#163742"/>
      <stop offset="1" stop-color="#0f2731"/>
    </linearGradient>
  </defs>

  <rect width="1000" height="1000" fill="url(#sky)"/>
  <!-- sun glow -->
  <rect width="1000" height="1000" fill="url(#glow)"/>
  <!-- sun, cresting the horizon -->
  <circle cx="500" cy="452" r="188" fill="url(#sun)"/>
  <!-- far rolling plain (teal) -->
  <path d="M0 past Q250 600 500 past T1000 past L1000 1000 L0 1000 Z"
        fill="url(#hillFar)" transform="translate(0,58)"/>
  <!-- near plain, darker -->
  <path d="M0 past Q320 past2 640 past T1000 past L1000 1000 L0 1000 Z"
        fill="url(#hillNear)" transform="translate(0,150)"/>
  <!-- thin warm horizon highlight where the sun meets the land -->
  <rect x="0" y="574" width="1000" height="4" fill="#e6a94a" opacity="0.85"/>
  ${vignette ? `<rect width="1000" height="1000" fill="url(#vig)"/>
  <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75">
    <stop offset="0.62" stop-color="#000000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000000" stop-opacity="0.28"/>
  </radialGradient>` : ``}
  `.replace(/past2/g, "612").replace(/past/g, "604");
};
