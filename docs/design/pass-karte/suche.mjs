// Sucht die Kamera, bei der die echten Kehren so im Bild liegen wie auf dem Foto.
// Ziel (im 1600×760-Rahmen des Zeichners): Kehren-Mitte ~(672,532), Breite ~800 px, ganz sichtbar;
// Strasse unterhalb der Kehren rechts unten ~(1360,608).
/* global process, console */
import { readFileSync } from 'node:fs';
const [grobDatei, feinDatei, strassenDatei] = process.argv.slice(2);
const g = JSON.parse(readFileSync(grobDatei, 'utf8'));
const f = JSON.parse(readFileSync(feinDatei, 'utf8'));
function bil(Z, n, w, h, c, r) {
  if (c < 0 || r < 0 || c > w - 1 || r > h - 1) return null;
  const c0 = Math.floor(c), r0 = Math.floor(r), c1 = Math.min(w - 1, c0 + 1), r1 = Math.min(h - 1, r0 + 1), fc = c - c0, fr = r - r0;
  return (Z[r0 * n + c0] * (1 - fc) + Z[r0 * n + c1] * fc) * (1 - fr) + (Z[r1 * n + c0] * (1 - fc) + Z[r1 * n + c1] * fc) * fr;
}
function hoehe(x, y) {
  const h = bil(f.z, f.n, f.n, f.n, (x - f.x0) / f.r, (f.y1 - y) / f.r);
  if (h !== null) return h;
  const k = bil(g.z, g.w, g.w, g.h, (x - g.x0) / g.r, (g.y1 - y) / g.r);
  return k === null ? -Infinity : k;
}
// Strassenpunkte in Metern
const wege = JSON.parse(readFileSync(strassenDatei, 'utf8')).map((w) => w.map(([c, r]) => {
  const x = 2771000 + c * 10, y = 1143000 - r * 10; return [x, y, hoehe(x, y) + 2];
}));
const alle = wege.flat().filter((p) => isFinite(p[2]));
const kehren = alle.filter(([x, y]) => x > 2772500 && x < 2773570 && y > 1140600 && y < 1141300);
const ausgang = alle.filter(([x, y, z]) => x > 2771900 && x < 2772450 && y < 1140750 && z < 1600);
const mitte = (ps) => ps.reduce((a, p) => [a[0] + p[0] / ps.length, a[1] + p[1] / ps.length, a[2] + p[2] / ps.length], [0, 0, 0]);
const K = mitte(kehren), A = mitte(ausgang);
const probe = kehren.filter((_, i) => i % Math.ceil(kehren.length / 40) === 0);
console.log('Kehren', kehren.length, K.map(Math.round), 'Ausgang', ausgang.length, A.map(Math.round));

function sichtbar(C, p) {
  const v = [p[0] - C[0], p[1] - C[1], p[2] - C[2]], n = 60;
  for (let i = 1; i < n; i++) { const t = i / n; if (t > 0.985) break; if (hoehe(C[0] + v[0] * t, C[1] + v[1] * t) > C[2] + v[2] * t + 2) return false; }
  return true;
}
const BW = 1600, BH = 760;
function kamera(C, gier, nick, fov) {
  const vor = [Math.cos(gier) * Math.cos(nick), Math.sin(gier) * Math.cos(nick), Math.sin(nick)];
  const l = Math.hypot(vor[0], vor[1]); const rechts = [vor[1] / l, -vor[0] / l, 0];
  const oben = [rechts[1] * vor[2] - rechts[2] * vor[1], rechts[2] * vor[0] - rechts[0] * vor[2], rechts[0] * vor[1] - rechts[1] * vor[0]];
  const F = (BW / 2) / Math.tan(fov / 2);
  return (p) => { const v = [p[0] - C[0], p[1] - C[1], p[2] - C[2]]; const t = v[0] * vor[0] + v[1] * vor[1] + v[2] * vor[2];
    if (t <= 1) return null; return [BW / 2 + (v[0] * rechts[0] + v[1] * rechts[1]) / t * F, BH * 0.42 - (v[0] * oben[0] + v[1] * oben[1] + v[2] * oben[2]) / t * F]; };
}
const kandidaten = [];
for (let x = 2772300; x <= 2774000; x += 50) for (let y = 1140300; y <= 1142000; y += 50) {
  const ab = Math.hypot(x - K[0], y - K[1]); if (ab < 150 || ab > 600) continue;
  const boden = hoehe(x, y); if (!isFinite(boden)) continue;
  if (x > 2772450 && x < 2773620 && y > 1140550 && y < 1141350) continue;   // nicht mitten in den Kehren
  for (const ueber of [5, 20, 50, 100, 160]) {
    const C = [x, y, boden + ueber];
    for (let gd = 0; gd < 360; gd += 3) for (let nd = -40; nd <= -4; nd += 3) for (const fd of [55, 65, 75, 85]) {
      const pr = kamera(C, gd * Math.PI / 180, nd * Math.PI / 180, fd * Math.PI / 180);
      const k = pr(K), a = pr(A); if (!k || !a) continue;
      let fehler = Math.hypot(k[0] - 672, k[1] - 532) + 0.7 * Math.hypot(a[0] - 1360, a[1] - 608);
      if (fehler > 700) continue;
      let xmin = Infinity, xmax = -Infinity, raus = 0;
      for (const p of probe) { const q = pr(p); if (!q) { raus++; continue; } xmin = Math.min(xmin, q[0]); xmax = Math.max(xmax, q[0]); if (q[0] < 0 || q[0] > BW || q[1] > BH) raus++; }
      fehler += Math.abs((xmax - xmin) - 800) * 0.5 + raus * 40;
      kandidaten.push({ fehler, C, gd, nd, fd });
    }
  }
}
kandidaten.sort((a, b) => a.fehler - b.fehler);
const beste = [];
for (const k of kandidaten.slice(0, 400)) {
  const sicht = probe.filter((p) => sichtbar(k.C, p)).length / probe.length;
  k.gesamt = k.fehler + (1 - sicht) * 600; k.sicht = sicht; beste.push(k);
}
beste.sort((a, b) => a.gesamt - b.gesamt);
for (const k of beste.slice(0, 6)) {
  const gier = k.gd * Math.PI / 180, nick = k.nd * Math.PI / 180, d = 5000;
  const T = [k.C[0] + Math.cos(gier) * Math.cos(nick) * d, k.C[1] + Math.sin(gier) * Math.cos(nick) * d, k.C[2] + Math.sin(nick) * d];
  console.log(Math.round(k.gesamt), 'sicht', k.sicht.toFixed(2), 'ARGS', k.C.map(Math.round).join(' '), T.map(Math.round).join(' '), k.fd);
}
