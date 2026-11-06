// ─── Strichfigur «Drei Ebenen» für /politsystem/ (Hairline-Stil) ─────────────
//
// Erzeugt scripts/seiten/figuren/politsystem-ebenen.svg: drei Terrassen, von
// hinten nach vorn und von oben nach unten — eine Platte für den Bund, 26
// Klötze für die Kantone, ein Feld aus Punkten für die Gemeinden. Ruhebild,
// ohne Skript; die Klassen (sil, lo, nf, hi, dot) färbt der Seitenstil (.hl).
//
// Gezeichnet mit dem Hairline-Kernel, der schon im Repo liegt
// (bewegt/fremd/hairline-kernel.js, MIT, unverändert): nur seine Geometrie
// (Kamera, Projektion, gerundete Körper), kein DOM. Die Punkte stehen für
// «viele Gemeinden», nicht für 2110 einzelne — die Zahl steht in der Legende.
//
// Neu erzeugen:  node scripts/seiten/figuren/politsystem-ebenen.mjs
// Entscheid «Ebenen als Strichfigur»: Stebler Studios, 05.11.2026 (A bis E).

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const HIER = dirname(fileURLToPath(import.meta.url));
const kernel = readFileSync(resolve(HIER, 'bewegt', 'fremd', 'hairline-kernel.js'), 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(`${kernel}\nthis.HL = HL;`, ctx);
const { Cam, fit, proj, facing, rings, prism } = ctx.HL;

// Welt: x nach rechts unten, y nach links unten, z nach oben (Kernel-Index).
const BREITE = 132;
const BUND = { y0: 0, y1: 30, z: 46 };
const KANTONE = { y0: 36, y1: 78, z: 28 };
const GEMEINDEN = { y0: 84, y1: 140, z: 8 };

const C = Cam(45, 0.5, 1.5);
fit(C, [[0, 0, BUND.z + 10], [BREITE, 0, BUND.z + 10], [0, GEMEINDEN.y1, 0], [BREITE, GEMEINDEN.y1, 0], [BREITE, 0, 0]], 200, 160);
const P = proj(C), front = facing(C);
const r2 = (n) => Math.round(n * 10) / 10;
const kurz = (d) => d.replace(/-?\d+\.\d+/g, (z) => String(r2(Number(z))));

const teile = [];
const koerper = (x0, y0, x1, y1, z0, z1, r, b, hi = false) => {
  const [ring, inner] = rings(x0, y0, x1, y1, r, b);
  const s = prism(P, front, ring, inner, z0, z1);
  teile.push(`<g><path class="sil${hi ? ' hi' : ''}" d="${kurz(s.sil)}"/><path class="nf lo" d="${kurz(s.crease)}"/></g>`);
};
const punkt = (x, y, z, cls) => {
  const [sx, sy] = P(x, y, z);
  teile.push(`<ellipse class="${cls}" cx="${r2(sx)}" cy="${r2(sy)}" rx="1.2" ry="0.7"/>`);
};

// von hinten nach vorn malen (Kernel: aufsteigend x + y)
// 1 · Bund: eine Platte, oben der eine Block, hervorgehoben
koerper(0, BUND.y0, BREITE, BUND.y1, 0, BUND.z, 7, 1.6);
koerper(BREITE / 2 - 16, BUND.y0 + 6, BREITE / 2 + 16, BUND.y1 - 6, BUND.z, BUND.z + 10, 4, 1.2, true);

// 2 · Kantone: eine Platte, darauf 26 Klötze in zwei Reihen à 13
koerper(0, KANTONE.y0, BREITE, KANTONE.y1, 0, KANTONE.z, 7, 1.6);
const SP = 13, KW = (BREITE - 12) / SP;
for (let reihe = 0; reihe < 2; reihe++) {
  for (let i = 0; i < SP; i++) {
    const x0 = 6 + i * KW + 1.1, y0 = KANTONE.y0 + 6 + reihe * 16;
    koerper(x0, y0, x0 + KW - 2.2, y0 + 12, KANTONE.z, KANTONE.z + 5, 2, 0.6);
  }
}

// 3 · Gemeinden: eine flache Platte, darauf ein dichtes Feld aus Punkten
koerper(0, GEMEINDEN.y0, BREITE, GEMEINDEN.y1, 0, GEMEINDEN.z, 7, 1.6);
for (let j = 0; j < 9; j++) {
  for (let i = 0; i < 30; i++) {
    punkt(5 + i * ((BREITE - 10) / 29), GEMEINDEN.y0 + 6 + j * ((GEMEINDEN.y1 - GEMEINDEN.y0 - 12) / 8), GEMEINDEN.z, 'dot m');
  }
}

const svg = `<svg viewBox="0 0 400 320">${teile.join('')}</svg>\n`;
if (/NaN|undefined/.test(svg)) throw new Error('politsystem-ebenen: Geometrie unvollständig');
writeFileSync(resolve(HIER, 'politsystem-ebenen.svg'), svg);
console.log(`✓ politsystem-ebenen.svg (${(svg.length / 1024).toFixed(1)} kB)`);
