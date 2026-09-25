import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ABLAEUFE } from '../config/ansichtenRegister.js';
import { VALID_VIEWS } from '../utils/hashRouter.js';
import { LEBENSZUSTAENDE } from '../data/lebenszustaende.js';

// Querverweise der geführten Abläufe und der Lebenszustände — Befund 24.09.2026:
// geprüft hatte das bisher niemand, ein Tippfehler im Ziel wäre still ins Leere
// gelaufen. Gelesen wird der Quelltext, weil die Ziele als Literale in
// `onNavigate('…')` stehen; ein neuer Ablauf wird über ABLAEUFE mitgeprüft.
const DATEI = {
  kkerst: 'KKErstAnmeldung.jsx', kvgwechsel: 'KVGWechsel.jsx', zusatzwechsel: 'ZusatzWechsel.jsx',
  neuerjob: 'NeuerJob.jsx', stelleverloren: 'StelleVerloren.jsx', unfallkrankheit: 'UnfallKrankheit.jsx',
  umzug: 'UmzugAblauf.jsx', pensionierung: 'Pensionierung.jsx', betreibung: 'BetreibungErhalten.jsx',
  selbstaendigkeit: 'Selbstaendigkeit.jsx', heirat: 'Heirat.jsx', kind: 'KindBekommen.jsx',
  trennung: 'Trennung.jsx', bewilligung: 'BewilligungFristen.jsx', fuehrerausweis: 'Fuehrerausweis.jsx',
  asyl: 'AsylView.jsx', einbuergerung: 'Einbuergerung.jsx', zuzug: 'ZuzugAusland.jsx', aussteuerung: 'Aussteuerung.jsx', quellensteuer: 'Quellensteuer.jsx', wohnunggekuendigt: 'WohnungGekuendigt.jsx', iv: 'IvVerfahren.jsx', pflege: 'PflegeAblauf.jsx', todesfall: 'Todesfall.jsx',
};

const ziele = (datei) => {
  const src = readFileSync(resolve(__dirname, '..', datei), 'utf8');
  return [...src.matchAll(/onNavigate\(\s*'([A-Za-z]+)'/g)].map((m) => m[1]);
};

describe('Abläufe — Querverweise', () => {
  it('jeder Ablauf im Register hat eine Datei hier', () => {
    for (const a of ABLAEUFE) expect(DATEI[a.view], `keine Datei für ${a.view}`).toBeTruthy();
  });

  it.each(Object.entries(DATEI))('%s: jedes onNavigate-Ziel ist eine gültige Ansicht', (view, datei) => {
    const gefunden = ziele(datei);
    // Die Leere-Menge-Falle: ein Ablauf ohne einen einzigen Verweis wäre hier grün.
    expect(gefunden.length, `${datei}: kein onNavigate gefunden — Muster veraltet?`).toBeGreaterThan(0);
    for (const z of gefunden) expect(VALID_VIEWS.has(z), `${datei} → ${z}`).toBe(true);
  });

  it('jedes Ziel eines Lebenszustands ist eine gültige Ansicht', () => {
    let geprueft = 0;
    for (const z of LEBENSZUSTAENDE) {
      for (const b of z.berechtigungen) {
        if (!b.view) continue;
        geprueft++;
        expect(VALID_VIEWS.has(b.view), `${z.key}.${b.key} → ${b.view}`).toBe(true);
      }
    }
    expect(geprueft).toBeGreaterThan(20);
  });
});
