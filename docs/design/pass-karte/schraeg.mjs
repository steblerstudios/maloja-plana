// Schrägsicht «unsere Ansicht»: echte Höhenlinien in Perspektive, verdeckte Teile weggelassen, Himmelslinie.
// Aufruf: node schraeg.mjs <hoehen-weit.json> <stil: salbei|papier> <ausgabe.svg> [cx cy cz tx ty tz fov]
/* global process, console */
import { readFileSync, writeFileSync } from 'node:fs';
import { contours } from 'd3-contour';

const [datei, stil, aus, ...kam] = process.argv.slice(2);
const d = JSON.parse(readFileSync(datei, 'utf8'));
const { w: W, h: H, r: R, x0: X0, y1: Y1, z: Z } = d;
const [cx, cy, cz, tx, ty, tz, fov] = (kam.length ? kam : [2769300, 1145200, 3900, 2775600, 1139600, 2100, 55]).map(Number);

// Gelände: bilinear im Raster (Rasterkoordinaten c,r; Meter x,y)
function hoehe(x, y) {
  const c = (x - X0) / R, r = (Y1 - y) / R;
  if (c < 0 || r < 0 || c > W - 1 || r > H - 1) return -Infinity;
  const c0 = Math.floor(c), r0 = Math.floor(r), c1 = Math.min(W - 1, c0 + 1), r1 = Math.min(H - 1, r0 + 1);
  const fc = c - c0, fr = r - r0;
  const a = Z[r0 * W + c0], b = Z[r0 * W + c1], e = Z[r1 * W + c0], f = Z[r1 * W + c1];
  return (a * (1 - fc) + b * fc) * (1 - fr) + (e * (1 - fc) + f * fc) * fr;
}

// Kamera
const sub = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
const norm = (p) => { const l = Math.hypot(...p); return p.map((v) => v / l); };
const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
const C = [cx, cy, cz];
const vor = norm(sub([tx, ty, tz], C));
const rechts = norm(cross(vor, [0, 0, 1]));
const oben = cross(rechts, vor);
const BW = 1600, BH = 760, F = (BW / 2) / Math.tan((fov / 2) * Math.PI / 180);
function projiziere(p) {
  const v = sub(p, C); const t = dot(v, vor);
  if (t <= 1) return null;
  return [BW / 2 + dot(v, rechts) / t * F, BH * 0.42 - dot(v, oben) / t * F, t];
}

// Sichtbarkeit: Strahl von der Kamera zum Punkt abtasten; liegt Gelände darüber, ist der Punkt verdeckt
function sichtbar(p) {
  const v = sub(p, C); const L = Math.hypot(v[0], v[1]);
  const n = Math.max(24, Math.min(160, Math.ceil(L / 40)));
  for (let i = 1; i < n; i++) {
    const t = i / n;
    if (t > 0.997) break;
    const x = C[0] + v[0] * t, y = C[1] + v[1] * t, z = C[2] + v[2] * t;
    if (hoehe(x, y) > z + 3) return false;
  }
  return true;
}

// Höhenlinien alle 20 m (100 m kräftig), in 3D, sichtbare Läufe projiziert
const linien = { duenn: [], kraeftig: [] };
const th = []; for (let v = 1400; v <= 3160; v += 20) th.push(v);
const cs = contours().size([W, H]).smooth(true).thresholds(th)(Z);
let punkte = 0;
for (const c of cs) {
  const ziel = c.value % 100 === 0 ? linien.kraeftig : linien.duenn;
  for (const poly of c.coordinates) for (const ring of poly) {
    let lauf = [];
    const schliessen = () => { if (lauf.length > 1) ziel.push(lauf); lauf = []; };
    for (const [gc, gr] of ring) {
      if (gc <= 0.5 || gr <= 0.5 || gc >= W - 0.5 || gr >= H - 0.5) { schliessen(); continue; } // Rasterrand ist keine Linie
      const p = [X0 + gc * R, Y1 - gr * R, c.value];
      punkte++;
      const q = sichtbar(p) ? projiziere(p) : null;
      if (!q || q[0] < -20 || q[0] > BW + 20 || q[1] < -20 || q[1] > BH + 20) { schliessen(); continue; }
      const l = lauf[lauf.length - 1];
      if (!l || Math.hypot(q[0] - l[0], q[1] - l[1]) > 1.8) lauf.push(q);
    }
    schliessen();
  }
}

// Himmelslinie: je Bildspalte der höchste sichtbare Geländepunkt
const himmel = new Array(BW + 1).fill(Infinity);
for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
  const q = projiziere([X0 + c * R, Y1 - r * R, Z[r * W + c]]);
  if (!q) continue;
  const s = Math.round(q[0]);
  for (let k = s - 2; k <= s + 2; k++) if (k >= 0 && k <= BW && q[1] < himmel[k]) himmel[k] = q[1];
}
for (let k = 0; k <= BW; k++) if (!isFinite(himmel[k])) himmel[k] = BH;

const f1 = (v) => (Math.round(v * 10) / 10).toString();
const pfad = (ls) => ls.map((l) => 'M' + l.map((q) => f1(q[0]) + ' ' + f1(q[1])).join('L')).join('');
const himmelPfad = 'M0 ' + f1(himmel[0]) + himmel.map((y, k) => 'L' + k + ' ' + f1(y)).join('');
const flaeche = himmelPfad + `L${BW} ${BH}L0 ${BH}Z`;

const farben = stil === 'salbei'
  ? { himmel: '#FCF0E4', land: '#7E8F7B', linie: '#F6F2E8', deck: '.5', grat: '#F6F2E8' }
  : { himmel: 'none', land: 'none', linie: '#2B2A26', deck: '.55', grat: '#2B2A26' };
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BW} ${BH}" preserveAspectRatio="xMidYMid slice">
<!-- Malojapass, Blick vom Lunghin her nach Südosten zur Margna. Höhenlinien alle 20 m (100 m kräftig) aus swissALTI3D 2023
     © swisstopo, 20-m-Raster, perspektivisch mit verdeckten Linien. Kamera LV95 ${cx}/${cy}, ${cz} m. Erzeugt 10.11.2026. -->
${farben.himmel !== 'none' ? `<rect width="${BW}" height="${BH}" fill="${farben.himmel}"/>` : ''}
${farben.land !== 'none' ? `<path fill="${farben.land}" d="${flaeche}"/>` : ''}
<g fill="none" stroke="${farben.linie}" stroke-opacity="${farben.deck}" stroke-linejoin="round" stroke-linecap="round">
<path stroke-width=".6" vector-effect="non-scaling-stroke" d="${pfad(linien.duenn)}"/>
<path stroke-width="1.2" vector-effect="non-scaling-stroke" d="${pfad(linien.kraeftig)}"/>
</g>
<path fill="none" stroke="${farben.grat}" stroke-opacity=".9" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round" d="${himmelPfad}"/>
</svg>
`;
writeFileSync(aus, svg);
console.log(`${stil}: ${punkte} Punkte, ${linien.duenn.length + linien.kraeftig.length} Läufe, ${Math.round(svg.length / 1024)} kB`);
