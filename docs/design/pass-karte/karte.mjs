// Erzeugt public/vorstellung/pass-karte.svg (Probe A1 Salbei) aus Höhenraster + Strasse.
// Aufruf: node karte.mjs <maloja-hoehen.json> <strasse.json> <ausgabe.svg>
/* global process, console */
import { readFileSync, writeFileSync } from 'node:fs';
import { contours } from 'd3-contour';
import { geoPath } from 'd3-geo';
import { line, curveCatmullRom } from 'd3-shape';
import { range, min, max } from 'd3-array';

const [hoehenDatei, strassenDatei, aus] = process.argv.slice(2);
const d = JSON.parse(readFileSync(hoehenDatei, 'utf8'));
const wege = JSON.parse(readFileSync(strassenDatei, 'utf8'));

// Ausschnitt im 10-m-Raster: 2,8 × 1,3 km um Passhöhe und Kehren
const X = 95, Y = 140, W = 280, H = 130;
const z = [];
for (let r = Y; r < Y + H; r++) for (let c = X; c < X + W; c++) z.push(d.z[r * d.n + c]);

const th = range(Math.floor(min(z) / 20) * 20, max(z) + 20, 20);
const runde = (s) => s.replace(/-?\d+\.\d+/g, (m) => (+m).toFixed(1).replace(/\.0$/, ''));
const pfad = geoPath();
const cs = contours().size([W, H]).smooth(true).thresholds(th)(z);
const duenn = [], kraeftig = [];
for (const c of cs) { const p = pfad(c); if (p) (c.value % 100 === 0 ? kraeftig : duenn).push(runde(p)); }

// Strasse: in den Ausschnitt verschieben, Abschnitte weit ausserhalb weglassen
const linie = line().curve(curveCatmullRom.alpha(0.5));
const strasse = wege
  .map((w) => w.map(([c, r]) => [c - X, r - Y]))
  .filter((w) => w.some(([c, r]) => c > -20 && c < W + 20 && r > -20 && r < H + 20))
  .map((w) => runde(linie(w)));

// Passhöhe = höchster Strassenpunkt im Ausschnitt
let top = null;
for (const w of wege) for (const [c, r] of w) {
  const cc = Math.round(c), rr = Math.round(r);
  if (cc < X || cc >= X + W || rr < Y || rr >= Y + H) continue;
  const v = d.z[rr * d.n + cc];
  if (!top || v > top.v) top = { c: c - X, r: r - Y, v };
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 ${W - 2} ${H - 2}" preserveAspectRatio="xMidYMid slice">
<!-- Malojapass von oben. Höhenlinien alle 20 m (100 m kräftig) aus swissALTI3D 2023 © swisstopo, 10-m-Raster;
     Passstrasse (Hauptstrasse 3) © OpenStreetMap-Mitwirkende, ODbL. Erzeugt 10.11.2026, Passhöhe ${Math.round(top.v)} m. -->
<g fill="none" stroke="#F6F2E8" stroke-opacity=".55" vector-effect="non-scaling-stroke">
<path stroke-width=".5" vector-effect="non-scaling-stroke" d="${duenn.join('')}"/>
<path stroke-width="1.1" vector-effect="non-scaling-stroke" d="${kraeftig.join('')}"/>
</g>
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="#55685A" stroke-width="6" vector-effect="non-scaling-stroke" d="${strasse.join('')}"/>
<path stroke="#ECE7D8" stroke-width="3.5" vector-effect="non-scaling-stroke" d="${strasse.join('')}"/>
</g>
<circle cx="${top.c.toFixed(1)}" cy="${top.r.toFixed(1)}" r="1.6" fill="#ECE7D8" stroke="#55685A" stroke-width="1.5" vector-effect="non-scaling-stroke"/>
</svg>
`;
writeFileSync(aus, svg);
console.log(`Passhöhe ${top.v} m bei ${(top.c / W * 100).toFixed(1)} % / ${(top.r / H * 100).toFixed(1)} %, ${svg.length} Bytes`);
