import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  schaetzeKantonaleSteuer, kantonssteuerReihe, interpoliere,
  steuerbarNachEstv, kantonssteuerFuerProfil, abzuegeAusTaxData,
  KANTONAL_DATA_VERSION, KANTONAL_DATA_ABGERUFEN, KANTONAL_MAX_KINDER,
} from '../kantonaleSteuerdaten.js';
import { KANTONSSTEUER_TABELLE, KANTONSSTEUER_QUELLE } from '../kantonssteuerTabelle.js';
import de from '../../i18n/de.js';
import en from '../../i18n/en.js';
import fr from '../../i18n/fr.js';
import it_ from '../../i18n/it.js';
import rm from '../../i18n/rm.js';

// E38 — Kantons- und Gemeindesteuer aus der ESTV-Stütztabelle (docs/sources/kantonssteuer-tabelle-2026.md).
// Die Erwartungen kommen aus den Rohwerten des ESTV-Steuerrechners (Messdateien), nicht aus der Tabelle.

const KANTONE = ['AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'];
const imRahmen = (wert, estv) => Math.abs(wert - estv) <= Math.max(0.03 * estv, 50);

const lies = (datei) => JSON.parse(readFileSync(new URL('../../../docs/sources/' + datei, import.meta.url), 'utf-8'));
const ohneKinder = lies('steuerfaktor-band-2026.messpunkte.json');
const mitKindern = lies('kantonssteuer-kinder-2026.messpunkte.json');
const abzuege = lies('nettolohn-abzuege-2026.messpunkte.json');
const NETTO = new Map(abzuege.punkte.map((p) => [p[0], p[1]]));
// Einheitlich: [kanton, zivilstand, kinder, brutto, steuerbarBund, ESTV K+G]
const PUNKTE = [
  ...ohneKinder.punkte.map((p) => [p[0], p[1], 0, p[2], p[3], p[10]]),
  ...mitKindern.punkte.map((p) => [p[0], p[1], p[2], p[3], p[4], p[11]]),
];

describe('E38 · Messdateien', () => {
  it('stammen aus dem ESTV-Steuerrechner, Steuerjahr 2026, mit bestandener Gegenprobe', () => {
    for (const m of [ohneKinder, mitKindern]) {
      expect(m.webseite).toBe('https://swisstaxcalculator.estv.admin.ch/');
      expect(m.steuerjahr).toBe(2026);
    }
    expect(ohneKinder.gegenprobe).toMatch(/fehlgeschlagen wie erwartet/);
    expect(mitKindern.laeufe.length).toBeGreaterThan(0);
    for (const l of mitKindern.laeufe) expect(l.gegenprobe).toMatch(/fehlgeschlagen wie erwartet/);
    expect(mitKindern.kinderalter).toBe(8);
  });

  it('decken 26 Kantone × 2 Zivilstände × 0–3 Kinder mit je 68 Bruttolöhnen ab', () => {
    const bloecke = new Map();
    for (const [kt, zs, k] of PUNKTE) bloecke.set(kt + zs + k, (bloecke.get(kt + zs + k) || 0) + 1);
    expect(bloecke.size).toBe(26 * 2 * 4);
    expect([...bloecke.values()].every((n) => n === 68)).toBe(true);
  });
});

describe('E38 · Tabelle gegen alle Messpunkte', () => {
  it('jede Reihe ist vorhanden, trägt die Quelle und hat streng steigendes x', () => {
    expect(KANTONSSTEUER_QUELLE).toMatch(/ESTV/);
    expect(Object.keys(KANTONSSTEUER_TABELLE).sort()).toEqual(KANTONE);
    for (const kt of KANTONE) {
      for (const zs of ['ledig', 'verheiratet']) {
        expect(KANTONSSTEUER_TABELLE[kt][zs]).toHaveLength(KANTONAL_MAX_KINDER + 1);
        for (const reihe of KANTONSSTEUER_TABELLE[kt][zs]) {
          expect(reihe.length % 2).toBe(0);
          expect(reihe.length / 2).toBeLessThanOrEqual(20);
          for (let i = 2; i < reihe.length; i += 2) expect(reihe[i]).toBeGreaterThan(reihe[i - 2]);
        }
      }
    }
  });

  it('an jedem Messpunkt mit steuerbarem Einkommen > 0 höchstens ±3 % bzw. ±CHF 50 neben der ESTV', () => {
    const fehler = [];
    let geprueft = 0;
    for (const [kt, zs, kinder, brutto, steuerbar, kg] of PUNKTE) {
      if (steuerbar <= 0) continue;
      const r = schaetzeKantonaleSteuer({ kanton: kt, steuerbaresEinkommen: steuerbar, verheiratet: zs === 'verheiratet', kinder, elterntarif: true });
      geprueft++;
      if (r.lage !== 'innerhalb' || !imRahmen(r.kantonal.kantonalUndGemeinde, kg)) fehler.push([kt, zs, kinder, brutto, r.lage, r.kantonal?.kantonalUndGemeinde, kg]);
    }
    expect(geprueft).toBeGreaterThan(7000);
    expect(fehler).toEqual([]);
  });

  it('der Tabellenbereich reicht vom kleinsten bis zum grössten Messpunkt (steuerbar > 0)', () => {
    for (const kt of KANTONE) {
      for (const zs of ['ledig', 'verheiratet']) {
        for (let k = 0; k <= KANTONAL_MAX_KINDER; k++) {
          const xs = PUNKTE.filter((p) => p[0] === kt && p[1] === zs && p[2] === k && p[4] > 0).map((p) => p[4]);
          const r = schaetzeKantonaleSteuer({ kanton: kt, steuerbaresEinkommen: xs[0], verheiratet: zs === 'verheiratet', kinder: k, elterntarif: true });
          expect(r.bereich, kt + zs + k).toEqual({ min: Math.min(...xs), max: Math.max(...xs) });
        }
      }
    }
  });
});

describe('E38 · Nettolohn → steuerbares Einkommen wie die ESTV', () => {
  it('Abzugsmessung: ESTV 2026, Gegenprobe bestanden, 68 Bruttolöhne', () => {
    expect(abzuege.webseite).toBe('https://swisstaxcalculator.estv.admin.ch/');
    expect(abzuege.steuerjahr).toBe(2026);
    expect(abzuege.gegenprobe).toMatch(/fehlgeschlagen wie erwartet/);
    expect(abzuege.punkte).toHaveLength(68);
  });

  it('trifft an allen Messpunkten (alle Kantone, Zivilstände, Kinderzahlen) das steuerbare Einkommen Bund der ESTV', () => {
    const fehler = [];
    for (const [kt, zs, kinder, brutto, steuerbar] of PUNKTE) {
      const x = steuerbarNachEstv({ nettolohnJahr: NETTO.get(brutto), verheiratet: zs === 'verheiratet', kinder });
      if (Math.abs(x - steuerbar) > 1) fehler.push([kt, zs, kinder, brutto, x, steuerbar]);
    }
    expect(fehler).toEqual([]);
  });

  it('Beispiele aus den ESTV-Abzugsposten', () => {
    // Brutto 80 000: Nettolohn 71 883 − Berufsauslagen 2 156 − Versicherungen 1 800 = 67 927
    expect(steuerbarNachEstv({ nettolohnJahr: 71883 })).toBe(67927);
    // verheiratet, 2 Kinder: − 2 156 − 5 100 − 2 800 − 13 600 = 48 227
    expect(steuerbarNachEstv({ nettolohnJahr: 71883, verheiratet: true, kinder: 2 })).toBe(48227);
    // Brutto 20 000 ohne BVG-Beitrag: − 2 000 (Minimum) − 2 700 (1 800 × 1,5) = 13 940
    expect(steuerbarNachEstv({ nettolohnJahr: 18640 })).toBe(13940);
    // Brutto 300 000: Berufsauslagen höchstens 4 000
    expect(steuerbarNachEstv({ nettolohnJahr: 271339 })).toBe(265539);
  });

  it('erfasste Berufsauslagen ersetzen die Pauschale, übrige Abzüge werden abgezogen, nie unter 0', () => {
    expect(steuerbarNachEstv({ nettolohnJahr: 71883, berufsauslagen: 5000 })).toBe(71883 - 5000 - 1800);
    expect(steuerbarNachEstv({ nettolohnJahr: 71883, weitereAbzuege: 7258 })).toBe(67927 - 7258);
    expect(steuerbarNachEstv({ nettolohnJahr: 5000, kinder: 3 })).toBe(0);
    expect(steuerbarNachEstv({ nettolohnJahr: 0 })).toBe(0);
    expect(abzuegeAusTaxData({ workCosts: 3000, pension3a: 7258, other: 100, elterntarif: true })).toEqual({ berufsauslagen: 3000, weitereAbzuege: 7358 });
    expect(abzuegeAusTaxData(undefined)).toEqual({ berufsauslagen: 0, weitereAbzuege: 0 });
  });
});

describe('E38 · kantonssteuerFuerProfil', () => {
  it('Nettolohn-Weg liest die Tabelle mit steuerbar nach ESTV', () => {
    const r = kantonssteuerFuerProfil({ kanton: 'ZH', nettolohnJahr: 71883, bundessteuer: 1717 });
    expect(r.steuerbar).toBe(67927);
    expect(r.lage).toBe('innerhalb');
    expect(imRahmen(r.kantonal.kantonalUndGemeinde, 7039)).toBe(true);
  });

  it('direkt eingetragenes steuerbares Einkommen wird unverändert gelesen — auch bei Bruttolohn', () => {
    const r = kantonssteuerFuerProfil({ kanton: 'ZH', nettolohnJahr: 999999, direktSteuerbar: 67927, einkommensart: 'brutto' });
    expect(r.steuerbar).toBe(67927);
    expect(r.lage).toBe('innerhalb');
  });

  it('Partnereinkommen (Doppelverdiener, Konkubinat mit Kindern) und Bruttolohn → keine Zahl, mit Grund', () => {
    expect(kantonssteuerFuerProfil({ kanton: 'ZH', nettolohnJahr: 71883, verheiratet: true, partnerEinkommen: 1 })).toMatchObject({ lage: 'ungeprueft', kantonal: null, grund: 'partner' });
    // K62.1: Konkubinat ohne Kinder rechnet (Einzelbesteuerung); mit Kindern bleibt es bei keiner Zahl.
    expect(kantonssteuerFuerProfil({ kanton: 'ZH', nettolohnJahr: 71883, partnerEinkommen: 500 }).lage).toBe('innerhalb');
    expect(kantonssteuerFuerProfil({ kanton: 'ZH', nettolohnJahr: 71883, partnerEinkommen: 500, kinder: 1, elterntarif: true })).toMatchObject({ lage: 'ungeprueft', grund: 'partner' });
    expect(kantonssteuerFuerProfil({ kanton: 'ZH', nettolohnJahr: 71883, einkommensart: 'brutto' })).toMatchObject({ lage: 'ungeprueft', kantonal: null, grund: 'brutto' });
    expect(kantonssteuerFuerProfil({ kanton: 'ZH', nettolohnJahr: 71883, einkommensart: 'netto' }).lage).toBe('innerhalb');
  });

  it('ohne Kanton → keinKanton; sehr tiefer Nettolohn → ausserhalb', () => {
    expect(kantonssteuerFuerProfil({ kanton: '', nettolohnJahr: 71883 }).lage).toBe('keinKanton');
    expect(kantonssteuerFuerProfil({ kanton: 'ZH', nettolohnJahr: 8000 }).lage).toBe('ausserhalb');
  });
});

describe('E38 · keine Zahl, wo die Tabelle nicht trägt', () => {
  const zh = (steuerbar, extra = {}) => schaetzeKantonaleSteuer({ kanton: 'ZH', steuerbaresEinkommen: steuerbar, bundessteuer: 906, ...extra });

  it('ohne Kanton → Hinweis zur Kantonswahl', () => {
    expect(schaetzeKantonaleSteuer({ kanton: '', steuerbaresEinkommen: 67927 })).toEqual({ lage: 'keinKanton', bereich: null, kantonal: null });
  });

  it('unbekannter Kanton → keine Zahl', () => {
    expect(schaetzeKantonaleSteuer({ kanton: 'XX', steuerbaresEinkommen: 67927 }).lage).toBe('ungeprueft');
  });

  it('unter dem kleinsten und über dem grössten Messpunkt → keine Zahl (keine Extrapolation)', () => {
    // ZH ledig ohne Kinder: gemessen von steuerbar 13 940 (Brutto 20 000) bis 265 539 (Brutto 300 000).
    const unten = zh(13939);
    expect(unten.lage).toBe('ausserhalb');
    expect(unten.kantonal).toBeNull();
    expect(unten.bereich).toEqual({ min: 13940, max: 265539 });
    expect(zh(265540).kantonal).toBeNull();
    expect(zh(1000000).lage).toBe('ausserhalb');
    expect(zh(0).kantonal).toBeNull();
    expect(zh(Number.NaN).kantonal).toBeNull();
    expect(zh(13940).lage).toBe('innerhalb');
    expect(zh(265539).lage).toBe('innerhalb');
  });

  it('mehr als drei Kinder → nicht gemessen → keine Zahl', () => {
    expect(zh(80000, { verheiratet: true, kinder: 4 }).lage).toBe('ungeprueft');
    expect(zh(80000, { verheiratet: true, kinder: 1.5 }).lage).toBe('ungeprueft');
    expect(zh(80000, { verheiratet: true, kinder: 3 }).lage).toBe('innerhalb');
  });

  it('nicht verheiratet mit Kindern: nur mit bestätigtem Elterntarif (Kinder im gleichen Haushalt)', () => {
    expect(zh(60000, { kinder: 1 }).lage).toBe('ungeprueft');
    expect(zh(60000, { kinder: 1, elterntarif: false }).kantonal).toBeNull();
    expect(zh(60000, { kinder: 1, elterntarif: true }).lage).toBe('innerhalb');
    // Verheiratete brauchen die Bestätigung nicht (gemeinsamer Haushalt angenommen, wie in steuerRechner.js).
    expect(zh(60000, { verheiratet: true, kinder: 2 }).lage).toBe('innerhalb');
  });

  it('innerhalb: Summe = Bundessteuer + Kantons- und Gemeindesteuer, mit Hauptort', () => {
    const r = zh(67927);
    expect(r.kantonal.hauptort).toBe('Zürich');
    expect(r.kantonal.bundessteuer).toBe(906);
    expect(r.kantonal.total).toBe(906 + r.kantonal.kantonalUndGemeinde);
  });

  it('interpoliere gibt ausserhalb null zurück', () => {
    expect(interpoliere([10, 0, 20, 100], 15)).toBe(50);
    expect(interpoliere([10, 0, 20, 100], 9)).toBeNull();
    expect(interpoliere([10, 0, 20, 100], 21)).toBeNull();
    expect(interpoliere(null, 15)).toBeNull();
  });

  it('kantonssteuerReihe liefert für jede gemessene Lage eine Reihe', () => {
    for (const kt of KANTONE) {
      expect(kantonssteuerReihe(kt)).not.toBeNull();
      expect(kantonssteuerReihe(kt, { verheiratet: true, kinder: 3 })).not.toBeNull();
    }
  });
});

describe('K13 / E38 — Kennzeichnung und Datenstand', () => {
  it('Datenstand = ESTV-Steuerrechner 2026, Abrufdatum 16.09.2026', () => {
    expect(KANTONAL_DATA_VERSION).toBe('2026');
    expect(KANTONAL_DATA_ABGERUFEN).toBe('2026-09-16');
  });

  it('in allen 5 Sprachen: grobe Schätzung, Hauptort + ohne Kirchensteuer, kein alter Eichpunkt', () => {
    const dicts = { de, en, fr, it: it_, rm };
    for (const [lang, dict] of Object.entries(dicts)) {
      expect(dict.tax.roughEstimateBadge, lang).toBeTruthy();
      expect(dict.tax.basedOnHauptort, lang).not.toMatch(/80[’'.,\s]?000/);
      expect(dict.tax.basedOnHauptort, lang).toContain('{year}');
      expect(dict.tax.bandChecked, lang).toContain('{date}');
      expect(dict.tax.cantonalNoteLabel, lang).toBeTruthy();
      expect(dict.tax.noCantonalFigure, lang).toContain('swisstaxcalculator.estv.admin.ch');
      const aussen = typeof dict.tax.bandOutside === 'string' ? [dict.tax.bandOutside] : Object.values(dict.tax.bandOutside);
      for (const s of aussen) for (const p of ['{min}', '{max}', '{year}']) expect(s, lang).toContain(p);
    }
    expect(de.tax.basedOnHauptort).toMatch(/Hauptort des Kantons, ohne Kirchensteuer; in anderen Gemeinden kann die Steuer deutlich abweichen/);
  });
});
