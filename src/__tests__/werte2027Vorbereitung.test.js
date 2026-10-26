// Werte 2027 vorbereiten (Seitenrundgang 26.10.2026): SKOS-Grundbedarf als Jahrestabelle, Mindestlöhne je
// Jahr, ALV nicht als «2027» ausweisen, solange der Grenzbetrag 80 % für 2027 nicht belegt ist.
// Die Uhr wird gestellt; Module, die beim Laden das Jahr lesen, werden danach frisch geladen.
import { describe, it, expect, vi, afterEach } from 'vitest';
import { gblStand, grundbedarf, SKOS_GBL_JE_JAHR } from '../data/skosGrundbedarf.js';
import { berechneSozialhilfe, grundbedarfFuerHaushalt } from '../data/sozialhilfeRechner.js';
import { SKOS_GRUNDBEDARF, getGrundbedarf } from '../config/cantonalData.js';
import { mindestlohnAusTabelle, mindestlohnJahrNichtBelegt } from '../data/lohnCheck.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js'; // nicht «it» — das überschriebe vitests it()
import rm from '../i18n/rm.js';

afterEach(() => { vi.useRealTimers(); vi.resetModules(); });

const mitUhr = async (iso, modul) => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(iso));
  vi.resetModules();
  return import(modul);
};

describe('SKOS-Grundbedarf: eine Jahrestabelle', () => {
  it('2026 belegt, 2027 (noch) nicht: dann Werte 2026 mit belegt:false', () => {
    expect(gblStand(2026)).toMatchObject({ jahr: 2026, belegt: true });
    expect(gblStand('2027-01-15')).toMatchObject({ jahr: 2026, belegt: false });
    expect(grundbedarf(1, 2027)).toBe(1061);
    expect(grundbedarf(8, 2026)).toBe(3000 + 216);
    expect(grundbedarf(0)).toBe(0);
  });

  it('beide Rechnungen lesen dieselbe Tabelle (vorher zwei Kopien ohne Jahr)', () => {
    const t26 = SKOS_GBL_JE_JAHR[2026].tabelle;
    for (let p = 1; p <= 10; p++) {
      expect(grundbedarfFuerHaushalt(p, 2026)).toBe(grundbedarf(p, 2026));
      expect(getGrundbedarf(p)).toBe(grundbedarfFuerHaushalt(p));
    }
    expect(Object.values(SKOS_GRUNDBEDARF)).toEqual(t26.slice(1));
  });

  it('der ausführliche Rechner nennt Jahr und Beleg', () => {
    const r26 = berechneSozialhilfe({ adults: 1, miete: 1000, krankenkassePraemie: 300, stichtag: '2026-12-31' });
    expect(r26).toMatchObject({ gbl: 1061, gblJahr: 2026, gblBelegt: true });
    const r27 = berechneSozialhilfe({ adults: 1, miete: 1000, krankenkassePraemie: 300, stichtag: '2027-01-01' });
    expect(r27).toMatchObject({ gbl: 1061, gblJahr: 2026, gblBelegt: false });
  });

  it('die Schnellrechnung meldet ab 1.1.2027 «nicht belegt»', async () => {
    const { calculateSozialhilfe } = await mitUhr('2027-01-15T10:00:00', '../config/cantonalData.js');
    const r = calculateSozialhilfe({ basis: { canton: 'ZH' }, wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 400 } });
    expect(r).toMatchObject({ gblJahr: 2026, gblBelegt: false });
  });

  it('Dashboard-Satz nimmt den Betrag aus der Tabelle, nicht fest im Text', () => {
    for (const s of [de, en, fr, itSprache]) {
      const v = s.dashboard.highlightSozialhilfeSub;
      for (const txt of typeof v === 'string' ? [v] : [v.sie, v.du]) {
        expect(txt).toContain('{betrag}');
        expect(txt).not.toMatch(/1.?061/);
      }
    }
  });
});

describe('Mindestlöhne: Tabelle je Jahr', () => {
  const tab = { 2026: { GE: { chfStunde: 24.59 } }, 2027: { GE: { chfStunde: 25.00 } } };

  it('ein im Dezember eingetragenes 2027 gilt erst ab 1.1.', () => {
    expect(mindestlohnAusTabelle(tab, 'GE', new Date(2026, 11, 20))).toMatchObject({ chfStunde: 24.59, jahr: 2026 });
    expect(mindestlohnAusTabelle(tab, 'GE', new Date(2027, 0, 2))).toMatchObject({ chfStunde: 25.00, jahr: 2027 });
  });

  it('ohne Eintrag fürs laufende Jahr: letzter belegter Satz, und der Riegel greift', () => {
    const nur26 = { 2026: tab[2026] };
    const heute = new Date(2027, 0, 2);
    const ml = mindestlohnAusTabelle(nur26, 'GE', heute);
    expect(ml).toMatchObject({ jahr: 2026 });
    expect(mindestlohnJahrNichtBelegt(ml.jahr, heute)).toBe(true);
  });

  it('Kanton ohne Mindestlohn → null; Kanton, der im neuen Jahr fehlt → sein letztes Jahr', () => {
    expect(mindestlohnAusTabelle(tab, 'ZH', new Date(2027, 0, 2))).toBeNull();
    const ohneJu27 = { 2026: { JU: { chfStunde: 21.40 } }, 2027: { GE: { chfStunde: 25 } } };
    expect(mindestlohnAusTabelle(ohneJu27, 'JU', new Date(2027, 0, 2))).toMatchObject({ jahr: 2026 });
  });

  it('die App selbst: im Dezember 2026 belegt, im Januar 2027 Riegel', async () => {
    const dez = await mitUhr('2026-12-20T10:00:00', '../data/lohnCheck.js');
    expect(dez.pruefeStundenlohn(5000, 42, 'GE').status).toBe('ok');
    const jan = await mitUhr('2027-01-05T10:00:00', '../data/lohnCheck.js');
    expect(jan.pruefeStundenlohn(5000, 42, 'GE').status).toBe('jahrNichtBelegt');
  });
});

describe('ALV: nicht als 2027 ausweisen, solange der Grenzbetrag 80 % fehlt', () => {
  it('2026: Version 2026, belegt', async () => {
    const m = await mitUhr('2026-11-01T10:00:00', '../data/alvRechner.js');
    expect(m.ALV_PARAMS).toMatchObject({ version: '2026', satz80Schwelle: 3797, satz80Jahr: 2026, satz80Belegt: true });
  });
  it('2027: Version bleibt 2026, Grenzbetrag nicht belegt (Höchstverdienst 2027 schaltet trotzdem)', async () => {
    const m = await mitUhr('2027-01-15T10:00:00', '../data/alvRechner.js');
    expect(m.ALV_PARAMS).toMatchObject({ version: '2026', satz80Jahr: 2026, satz80Belegt: false });
    expect(m.ALV_DATA_VERSION).toBe('2026');
  });
});

describe('Hinweistexte in allen fünf Sprachen', () => {
  it('sh.gblNichtBelegt und alv.satz80NichtBelegt mit Platzhaltern', () => {
    for (const s of [de, en, fr, itSprache, rm]) {
      expect(s.sh.gblNichtBelegt).toMatch(/\{jahr\}[\s\S]*\{laufend\}/);
      expect(s.alv.satz80NichtBelegt).toMatch(/\{betrag\}[\s\S]*\{jahr\}[\s\S]*\{laufend\}/);
    }
  });
});
