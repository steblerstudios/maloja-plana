import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { LIGHT_PALETTE, DARK_PALETTE } from '../config/constants.js';

// ─────────────────────────────────────────────────────────────
// **Deckkraft auf Text rechnet den Kontrast weg — und die Farbtafel sieht es nicht.**
//
// `constants.js` ist sorgfältig auf ≥4.5:1 hin gebaut und dokumentiert je Farbe
// ihr Verhältnis. Ein `opacity: 0.7` auf demselben Knoten macht das zunichte,
// ohne dass irgendeine Farb-Prüfung anschlägt: gerechnet wird mit der Farbe,
// gesehen wird ihre Mischung mit dem Untergrund.
//
// Im Browser gemessen (23.09.), Hellmodus:
//   Fusszeile         mid @0.7      → 3.10:1   (auf JEDER Seite, mit «Datenschutz & Rechtliches»)
//   Offline-Hinweis   mid @0.8      → 3.80:1
//   Vertrauens-Zeile  sageDeep @0.8 → 3.85:1   (zweimal: ChapterView, Dashboard)
//   Notfall-Einstieg  sageDeep @0.7 → 3.16:1
//
// Dasselbe Muster hatte `dashboardMountainLabelContrast.test.js` schon einmal an
// den Berg-Beschriftungen behoben — dort war die Lösung volle Deckkraft plus
// FORM statt Farbe. Beim Notfall-Einstieg trug der Zustand die Form bereits
// (Haken gegen leeres Kästchen), die Deckkraft war reine Zugabe.
//
// Dieser Test hält zwei Dinge:
//   1. die Begründung — er rechnet vor, dass gängige Deckkraftwerte die
//      Sekundärfarben unter AA drücken;
//   2. den Bestand — kein Stilobjekt in src/**/*.jsx setzt noch Deckkraft < 0.85
//      auf einen Knoten, der zugleich eine Schriftgrösse trägt.
//
// Die Ausnahmeliste ist kurz und jede Zeile nennt ihren Grund.
// ─────────────────────────────────────────────────────────────

function luminanz(hex) {
  const h = hex.replace('#', '');
  const k = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2];
}
const kontrast = (a, b) => {
  const [x, y] = [luminanz(a), luminanz(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const mischen = (vorn, hinten, deckkraft) => {
  const teile = (h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16));
  const [v, h] = [teile(vorn), teile(hinten)];
  return '#' + v.map((c, i) => Math.round(c * deckkraft + h[i] * (1 - deckkraft)).toString(16).padStart(2, '0')).join('');
};

// Stellen, an denen Deckkraft < 0.85 auf einem Knoten MIT Schriftgrösse erlaubt ist.
// Schlüssel: Datei. Wert: der Grund, warum es dort in Ordnung geht.
const AUSNAHMEN = {
  // WCAG 1.4.3 nimmt inaktive Bedienelemente ausdrücklich aus («Incidental»):
  // das Feld ist `disabled`, wenn das IK-Jahr eine Lücke ist.
  'src/VorsorgeRechner.jsx': 'disabled input (WCAG 1.4.3 Incidental)',
};

function jsxDateien(wurzel) {
  const raus = [];
  for (const eintrag of fs.readdirSync(wurzel, { withFileTypes: true })) {
    const p = path.join(wurzel, eintrag.name);
    if (eintrag.isDirectory()) {
      if (eintrag.name === '__tests__') continue;
      raus.push(...jsxDateien(p));
    } else if (eintrag.name.endsWith('.jsx')) {
      raus.push(p);
    }
  }
  return raus;
}

describe('Deckkraft frisst Kontrast — die Begründung', () => {
  for (const [name, p] of [['hell', LIGHT_PALETTE], ['dunkel', DARK_PALETTE]]) {
    it(`${name}: mid und sageDeep fallen bei Deckkraft 0.8 unter AA`, () => {
      for (const ton of ['mid', 'sageDeep']) {
        const voll = kontrast(p[ton], p.surface);
        const gedimmt = kontrast(mischen(p[ton], p.surface, 0.8), p.surface);
        expect(voll, `${ton} voll: ${voll.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
        expect(gedimmt, `${ton} @0.8: ${gedimmt.toFixed(2)}`).toBeLessThan(4.5);
      }
    });
  }
});

describe('Deckkraft frisst Kontrast — der Bestand', () => {
  it('kein Stilobjekt setzt Deckkraft < 0.85 auf einen Knoten mit Schriftgrösse', () => {
    const wurzel = path.resolve(__dirname, '..');
    const treffer = [];
    for (const datei of jsxDateien(wurzel)) {
      const rel = 'src/' + path.relative(wurzel, datei);
      const zeilen = fs.readFileSync(datei, 'utf8').split('\n');
      zeilen.forEach((roh, i) => {
        // Zeilenkommentare weg, bevor gesucht wird — sonst schlägt der Wächter auf
        // Sätzen an, die genau ERKLÄREN, warum hier keine Deckkraft mehr steht.
        // (Beim ersten Lauf genau so passiert.) `://` bleibt verschont, damit
        // Adressen in Kommentaren nichts abschneiden.
        const zeile = roh.replace(/(^|[^:])\/\/.*$/, '$1');
        if (!/fontSize|text\./.test(zeile)) return;
        const m = zeile.match(/opacity: ([^,}]+)/);
        if (!m) return;
        const werte = (m[1].match(/0\.\d+/g) || []).map(Number);
        if (!werte.length || Math.min(...werte) >= 0.85) return;
        if (AUSNAHMEN[rel]) return;
        treffer.push(`${rel}:${i + 1} → opacity ${m[1].trim()}`);
      });
    }
    expect(treffer, treffer.join('\n')).toEqual([]);
  });

  it('die Ausnahmeliste zeigt auf existierende Dateien — sie darf nicht verwaisen', () => {
    for (const rel of Object.keys(AUSNAHMEN)) {
      const p = path.resolve(__dirname, '..', '..', rel);
      expect(fs.existsSync(p), `${rel} gibt es nicht mehr`).toBe(true);
    }
  });
});
