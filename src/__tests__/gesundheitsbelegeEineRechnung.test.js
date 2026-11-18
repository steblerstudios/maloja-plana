// Eine Rechnung für die Gesundheitsbelege (Instrumente-Matrix B-R3, Entscheid Stebler Studios 11.11.2026: «Ja,
// Thermometer + Rechnung A»). Vier Orte zählten die KK-Belege eines Jahres selbst zusammen: die Kachel
// Franchise-Stand und das Kreuz (gesundheitskostenBisher), der KVG-Reiter Franchise (inline), die Prämien-Übersicht
// (inline) und die Finanzen-Karte (inline, eine andere Grösse mit ähnlichem Namen). Jetzt rechnet eine Funktion,
// belegeImJahr, und gibt zwei benannte Grössen zurück:
//   anDieFranchise — was an Franchise und Selbstbehalt zählt (Betrag, offene und bezahlte Belege)
//   ausgaben       — was für die Gesundheit bezahlt ist bzw. offen steht (mit nicht gedecktem Anteil;
//                    offene, die als Forderung im Schuldenmanager stehen, nicht ein zweites Mal)
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { belegeImJahr, gesundheitskostenBisher } from '../data/franchiseTacho.js';

const quelle = (pfad) => readFileSync(fileURLToPath(new URL(pfad, import.meta.url)), 'utf8');
const HEUTE = new Date(2026, 10, 11);

const daten = {
  versicherungen: {
    kkBelege: [
      { id: 'a', datum: '2026-03-01', betrag: 800, status: 'bezahlt', nichtGedeckt: 140 },
      { id: 'b', datum: '2026-10-02', betrag: 310, status: 'offen' },
      { id: 'c', datum: '2026-09-15', betrag: 90, status: 'offen', forderungId: '7' },
      { id: 'd', betrag: 50, status: 'bezahlt' },
      { id: 'e', datum: '2025-12-30', betrag: 999, status: 'bezahlt', nichtGedeckt: 1 },
    ],
  },
};

describe('belegeImJahr — eine Rechnung, zwei Namen', () => {
  it('an die Franchise: alle Belege des Jahres, nur der Betrag', () => {
    const r = belegeImJahr(daten, 2026, HEUTE);
    expect(r.anDieFranchise).toEqual({ gesamt: 1250, bezahlt: 850, offen: 400 });
  });

  it('Ausgaben: mit nicht gedecktem Anteil, offene Forderungen nicht doppelt', () => {
    const r = belegeImJahr(daten, 2026, HEUTE);
    expect(r.ausgaben).toEqual({ bezahlt: 990, offen: 310 });
  });

  it('Beleg ohne Datum zählt im laufenden Jahr, nie in einem früheren', () => {
    expect(belegeImJahr(daten, 2025, HEUTE).anDieFranchise.gesamt).toBe(999);
    expect(belegeImJahr(daten, 2025, HEUTE).ausgaben.bezahlt).toBe(1000);
  });

  it('ohne Belege: Nullen, kein Fehler', () => {
    expect(belegeImJahr({}, 2026, HEUTE)).toEqual({ anDieFranchise: { gesamt: 0, bezahlt: 0, offen: 0 }, ausgaben: { bezahlt: 0, offen: 0 } });
  });

  it('gesundheitskostenBisher ist dieselbe Zahl (Kachel, Kreuz, Versicherungen)', () => {
    expect(gesundheitskostenBisher(daten, HEUTE)).toBe(belegeImJahr(daten, 2026, HEUTE).anDieFranchise.gesamt);
  });
});

// Wächter: die Orte rufen die Funktion auf und zählen nicht mehr selbst.
describe('kein Ort zählt die Belege selbst', () => {
  const orte = {
    'KVG-Reiter Franchise': '../KVGLeistungen.jsx',
    'Prämien-Übersicht': '../PraemienOrientierung.jsx',
    'Finanzen-Karte': '../components/FinanzAuswertung.jsx',
  };
  for (const [name, pfad] of Object.entries(orte)) {
    it(name + ' ruft belegeImJahr', () => {
      const code = quelle(pfad);
      expect(code).toMatch(/belegeImJahr\(/);
      // Ein Zusammenzählen über Belege (reduce mit b.betrag) gehört in franchiseTacho.js, nicht hierher.
      expect(code).not.toMatch(/reduce\(.*\bb\.betrag\b/);
      expect(code).not.toMatch(/belegTotal/);
    });
  }
});
