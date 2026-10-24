import { describe, it, expect, beforeAll } from 'vitest';
import { CANTON_CODES } from '../../config/cantonalData.js';
import { lookupPLZ } from '../plzGemeinde.js';
import { HAUPTORTE, MUSTERHAUSHALTE, musterProfil, haushaltsPraemie, einordnen, kennzahlen, systemblickIPV } from '../systemblick.js';

// Systemblick (Prototyp): derselbe Musterhaushalt durch alle 26 belegten IPV-Kantonsmodelle.
// Geprüft wird, dass die Auswertung VOLLSTÄNDIG und EHRLICH ist — nicht, ob ein Kanton richtig
// rechnet (das prüfen die Kantonstests in config/__tests__/ipv*.test.js).

describe('Systemblick: Hauptorte', () => {
  it('jeder der 26 Kantone hat genau einen Hauptort', () => {
    expect(Object.keys(HAUPTORTE).sort()).toEqual([...CANTON_CODES].sort());
  });

  it('jede Hauptort-PLZ liegt laut PLZ-Daten im eigenen Kanton', () => {
    const falsch = Object.entries(HAUPTORTE)
      .filter(([kt, { plz }]) => !lookupPLZ(plz).some((g) => g.kanton === kt))
      .map(([kt, { plz }]) => `${kt} ${plz}`);
    expect(falsch).toEqual([]);
  });
});

describe('Systemblick: die sieben BAG-Modellhaushalte (Monitoring 2020, Abb. K-2)', () => {
  it('genau sieben, mit den Bruttoeinkommen aus dem BAG-Bericht', () => {
    expect(Object.fromEntries(Object.entries(MUSTERHAUSHALTE).map(([k, h]) => [k, h.bruttoJahr]))).toEqual({
      bag1: 45000, bag2: 70000, bag3: 60000, bag4: 85000, bag5: 70000, bag6: 38000, bag7: 60000,
    });
  });

  it('jeder Hauptort hat eine BAG-Durchschnittsprämie, jede Haushaltsprämie ist positiv', () => {
    const fehlt = CANTON_CODES.flatMap((kt) => Object.keys(MUSTERHAUSHALTE)
      .filter((h) => !(haushaltsPraemie(kt, MUSTERHAUSHALTE[h]) > 0)).map((h) => `${kt}/${h}`));
    expect(fehlt).toEqual([]);
  });

  it('mehr Personen, höhere Prämie: Einelternfamilie (2 Kinder) über der Rentnerin allein', () => {
    for (const kt of CANTON_CODES) {
      expect(haushaltsPraemie(kt, MUSTERHAUSHALTE.bag3)).toBeGreaterThan(haushaltsPraemie(kt, MUSTERHAUSHALTE.bag1));
    }
  });
});

describe('Systemblick: Musterprofil', () => {
  it('Erwerbshaushalt: Netto aus BAG-Brutto unter dem Brutto, ohne offene 13.-Frage, Hauptort als Wohnort', () => {
    const p = musterProfil('BS', 'bag3');
    expect(p.finanzen.dreizehnter).toBe('nein');
    expect(p.finanzen.monthlyIncome).toBeGreaterThan(0);
    expect(p.finanzen.monthlyIncome).toBeLessThan(60000 / 12);
    expect(p.wohnen.postalCode).toBe('4051');
    expect(p.basis.household.children).toEqual([{ age: 3, birthDate: '2023-01-01' }, { age: 5, birthDate: '2021-01-01' }]);
  });

  it('Rentnerin: CHF 45\'000 Rente = AHV-Maximalrente 2026 + BVG-Rest, kein Lohn', () => {
    const f = musterProfil('ZH', 'bag1').finanzen;
    expect(f.monthlyIncome).toBeUndefined();
    expect(f.ahvRente).toBe(2520);
    expect((f.ahvRente + f.bvgRente) * 12).toBe(45000);
  });

  it('wirft bei unbekanntem Kanton oder Haushalt statt still zu rechnen', () => {
    expect(() => musterProfil('XX', 'bag1')).toThrow();
    expect(() => musterProfil('ZH', 'gibtsNicht')).toThrow();
  });
});

describe('Systemblick: Einordnen und Kennzahlen', () => {
  it('«keine Zahl» ist nie 0 und zählt nicht in Median, Minimum oder Maximum', () => {
    const z = [
      einordnen('A', { belegt: true, eligible: true, annual: 1200, amount: 100 }),
      einordnen('B', { belegt: true, eligible: false, amount: 0, noteKey: 'x' }),
      einordnen('C', { belegt: false, eligible: false, amount: null, noteKey: 'ipv.orientierungOffen' }),
      einordnen('D', { belegt: true, eligible: true, annual: 3600, amount: 300 }),
    ];
    expect(z.map((r) => r.art)).toEqual(['betrag', 'keinAnspruch', 'keineZahl', 'betrag']);
    expect(z[2].jahr).toBeNull();
    expect(kennzahlen(z)).toEqual({ mitBetrag: 2, keinAnspruch: 1, keineZahl: 1, min: 1200, max: 3600, median: 2400 });
  });

  it('ohne einen einzigen Betrag: Kennzahlen null statt 0', () => {
    expect(kennzahlen([])).toEqual({ mitBetrag: 0, keinAnspruch: 0, keineZahl: 0, min: null, max: null, median: null });
  });
});

describe('Systemblick: alle 26 Kantone, geladen', () => {
  // Je Haushalt das BAG-Brutto und zwei Nachbarn (−20 %, +20 %) für die Monotonie-Prüfung.
  const FAKTOREN = [0.8, 1, 1.2];
  const lohnFuer = (h, f) => Math.round(MUSTERHAUSHALTE[h].bruttoJahr * f);
  const ergebnisse = {};
  beforeAll(async () => {
    for (const h of Object.keys(MUSTERHAUSHALTE)) {
      for (const f of FAKTOREN) ergebnisse[`${h}/${f}`] = await systemblickIPV(h, lohnFuer(h, f));
    }
  });

  it('zwei Erwachsene oder 19–25-jährig: in jedem Kanton «keine Zahl», nie 0 (bekannte Lücke, Konzept)', () => {
    for (const h of ['bag2', 'bag4', 'bag5', 'bag6', 'bag7']) {
      expect(ergebnisse[`${h}/1`].zeilen.every((z) => z.art === 'keineZahl')).toBe(true);
    }
  });

  it('jede Auswertung hat 26 Zeilen, keine steht auf «laden»', () => {
    for (const r of Object.values(ergebnisse)) {
      expect(r.zeilen).toHaveLength(26);
      expect(r.zeilen.filter((z) => z.grund === 'laden')).toEqual([]);
    }
  });

  it('jeder Betrag ist eine endliche, nicht negative ganze Zahl', () => {
    const schlecht = Object.entries(ergebnisse).flatMap(([id, r]) => r.zeilen
      .filter((z) => z.art === 'betrag' && !(Number.isInteger(z.jahr) && z.jahr > 0))
      .map((z) => `${id} ${z.kanton}: ${z.jahr}`));
    expect(schlecht).toEqual([]);
  });

  it('mehr Lohn gibt in keinem Kanton mehr Verbilligung (derselbe Haushalt)', () => {
    const schlecht = [];
    for (const h of Object.keys(MUSTERHAUSHALTE)) {
      for (const kt of CANTON_CODES) {
        const jahre = FAKTOREN.map((f) => ergebnisse[`${h}/${f}`].zeilen.find((z) => z.kanton === kt))
          .filter((z) => z.art !== 'keineZahl').map((z) => z.jahr);
        for (let i = 1; i < jahre.length; i++) if (jahre[i] > jahre[i - 1]) schlecht.push(`${h} ${kt}: ${jahre.join(' → ')}`);
      }
    }
    expect(schlecht).toEqual([]);
  });
});
