import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateIPV, ipvJahreseinkommen, preloadPLZ } from '../cantonalData.js';
import { rohesEinkommenJahr, einkommenJahr, SAEULE_3A } from '../kantonsModell.js';
import { steuerEingabenAusDaten } from '../../data/kantonaleSteuerdaten.js';
import { jahreslohnAusProfil } from '../../utils/jahreslohnAusProfil.js';
import { pegelState } from '../../data/pegel.js';
import { kantoneBelegtSimulieren } from './ipvBelegtSimulieren.js';
import { PremiumSubsidy } from '../../PremiumSubsidy.jsx';

// Befund Fachprüfung 25.09.2026 (PR #380): die IPV rechnete das Jahreseinkommen immer ×12.
// Wer einen 13. Monatslohn erhält, hat 8,3 % mehr (13/12) — die Verbilligung fiel zu hoch aus.
// Regel: der HAUPTLOHN zählt ×13 bei «ja», sonst ×12 — genau wie im Steuerrechner
// (steuerEingabenAusDaten) und bei der EO/AHV/BVG-Vorbefüllung. Eine Regel, eine Quelle:
// utils/dreizehnter.js. Nebenerwerb, Renten und Partnereinkommen bleiben ×12.

const JA = 'yes';
const NEIN = 'no';

describe('IPV-Jahreseinkommen mit und ohne 13. Monatslohn', () => {
  it('Kantonsmodule (rohesEinkommenJahr): Hauptlohn ×13 nur bei «ja»', () => {
    expect(rohesEinkommenJahr({ monthlyIncome: 5000, dreizehnter: JA })).toBe(65000);
    expect(rohesEinkommenJahr({ monthlyIncome: 5000, dreizehnter: NEIN })).toBe(60000);
    // «offen» (leer) ist nicht «nein» — gerechnet wird aber ×12, das Ergebnis sagt es dazu.
    expect(rohesEinkommenJahr({ monthlyIncome: 5000 })).toBe(60000);
    // Die Kantonsregeln setzen darauf auf (hier ohne 3a: kein Abzug).
    expect(einkommenJahr({ monthlyIncome: 5000, dreizehnter: JA }, SAEULE_3A.voll)).toBe(65000);
  });

  it('Nebenerwerb und Renten bleiben ×12 — die Frage steht beim Hauptlohn', () => {
    expect(rohesEinkommenJahr({ monthlyIncome: 5000, sideIncome: 1000, ahvRente: 500, dreizehnter: JA }))
      .toBe(5000 * 13 + (1000 + 500) * 12);
  });

  it('Muster-Kantone (ipvJahreseinkommen): gleich, Partnereinkommen ×12', () => {
    const d = (dreizehnter) => ({
      basis: { household: { adults: 2, children: [], partnerIncome: '2000' }, maritalStatus: 'married' },
      finanzen: { monthlyIncome: 5000, sideIncome: 1000, dreizehnter },
    });
    expect(ipvJahreseinkommen(d(JA))).toBe(5000 * 13 + 1000 * 12 + 2000 * 12);
    expect(ipvJahreseinkommen(d(NEIN))).toBe((5000 + 1000 + 2000) * 12);
  });

  // Die Regel ist EINE: für jede Schreibweise liefern Steuer, IPV und EO dasselbe Jahr.
  it.each([['yes'], ['ja'], [true], ['no'], ['nein'], [false], [''], [undefined], [null]])(
    'dieselbe Zahl wie der Steuerrechner und die EO-Vorbefüllung (dreizehnter = %j)',
    (dreizehnter) => {
      const f = { monthlyIncome: 4000, sideIncome: 500, dreizehnter, incomeType: 'brutto' };
      const data = { basis: {}, finanzen: f };
      const steuer = steuerEingabenAusDaten(data).nettolohnJahr;
      expect(rohesEinkommenJahr(f)).toBe(steuer);
      expect(ipvJahreseinkommen(data)).toBe(steuer);
      expect(Number(jahreslohnAusProfil(f))).toBe(steuer - 500 * 12);
    },
  );
});

// Gegenprobe über das ganze Ergebnis: «ja» mit Monatslohn m muss GENAU dasselbe liefern wie
// «nein» mit m × 13/12. So ist belegt, dass jeder Rechenweg den 13. einrechnet — und nur ihn.
const profil = (canton, plz, city, monthlyIncome, dreizehnter) => ({
  basis: { canton, dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome, ...(dreizehnter !== undefined && { dreizehnter }) },
  wohnen: { postalCode: plz, city, rentAmount: 1200 },
  versicherungen: { kkPremium: 480 },
});

const KANTONE = [
  ['ZH', '8004', 'Zürich'],
  ['BE', '3011', 'Bern'],
  ['AG', '5000', 'Aarau'],
  ['SG', '9000', 'St.Gallen'],
  ['LU', '6003', 'Luzern'],
];

describe('calculateIPV in den fünf Kantonsmodulen', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../../data/plzGemeinde.js');
    await Promise.all(['ipvZuerich', 'ipvBern', 'ipvAargau', 'ipvStGallen', 'ipvLuzern'].map((m) => import(`../${m}.js`)));
    await new Promise((r) => setTimeout(r, 0));
  });

  // BE rechnet in Stufen von rund 6 000/Jahr: 2 160 × 12 und × 13 liegen in verschiedenen Stufen.
  it.each(KANTONE)('%s: «ja» mit 2 160/Monat = «nein» mit 2 340/Monat', (canton, plz, city) => {
    const mit13 = calculateIPV(profil(canton, plz, city, 2160, JA));
    const ohne13 = calculateIPV(profil(canton, plz, city, 2160, NEIN));
    const gleichesJahr = calculateIPV(profil(canton, plz, city, 2340, NEIN));
    expect(mit13.belegt).toBe(true);
    expect(mit13.eligible).toBe(true);
    expect(mit13).toEqual(gleichesJahr);
    // Der 13. bewegt die Zahl — und zwar nach unten (mehr Einkommen, weniger Verbilligung).
    expect(mit13.annual).toBeLessThan(ohne13.annual);
  });

  it.each(KANTONE)('%s: bei offener Frage ×12 gerechnet und die Annahme sichtbar', (canton, plz, city) => {
    const offen = calculateIPV(profil(canton, plz, city, 2160));
    const nein = calculateIPV(profil(canton, plz, city, 2160, NEIN));
    expect(offen.annual).toBe(nein.annual);
    expect(offen.annahmen).toEqual({ ohneDreizehnten: true });
    expect(nein.annahmen).toEqual({ ohneDreizehnten: false });
    expect(calculateIPV(profil(canton, plz, city, 2160, JA)).annahmen).toEqual({ ohneDreizehnten: false });
  });

  it('der IPV-Rechner zeigt die Annahme nur bei offener Frage', () => {
    const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
    const t = (k) => k;
    const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));
    expect(render(profil('ZH', '8004', 'Zürich', 2160))).toContain('ipv.annahmeOhneDreizehnten');
    expect(render(profil('ZH', '8004', 'Zürich', 2160, JA))).not.toContain('ipv.annahmeOhneDreizehnten');
    expect(render(profil('ZH', '8004', 'Zürich', 2160, NEIN))).not.toContain('ipv.annahmeOhneDreizehnten');
  });
});

describe('calculateIPV in einem Muster-Kanton (Beleg simuliert)', () => {
  it('«ja» mit 2 160/Monat = «nein» mit 2 340/Monat, auch im IPV-Pegel', () => {
    const zurueck = kantoneBelegtSimulieren(['BS']);
    try {
      const mit13 = profil('BS', '4051', 'Basel', 2160, JA);
      const gleichesJahr = profil('BS', '4051', 'Basel', 2340, NEIN);
      expect(calculateIPV(mit13).eligible).toBe(true);
      expect(calculateIPV(mit13)).toEqual(calculateIPV(gleichesJahr));
      expect(calculateIPV(mit13).annual).toBeLessThan(calculateIPV(profil('BS', '4051', 'Basel', 2160, NEIN)).annual);
      // Der Pegel steht neben derselben Grenze — also dasselbe Einkommen.
      expect(pegelState(mit13).income).toBe(2160 * 13);
    } finally { zurueck(); }
  });
});

// Fachprüfung 25.09.2026 zum Fix: der Schätzbetrag läuft auch ins Behörden-Dossier — die Annahme
// muss dort mit (Datei-Kennung wie bei der Steuer), sonst steht der Betrag ohne sie beim Amt.
describe('Behörden-Dossier trägt die Annahme mit', () => {
  it('JSON: calculations.ipv.assumptions nur bei offener Frage', async () => {
    const { generateBehoerdenJSON } = await import('../../dossierGenerator.js');
    const ipv = (ohneDreizehnten) => ({ belegt: true, eligible: true, amount: 100, annahmen: { ohneDreizehnten } });
    const offen = generateBehoerdenJSON({}, { ipv: ipv(true) }, (k) => k).calculations.ipv;
    expect(offen.assumptions).toEqual([{ code: 'ohne_13_monatslohn', text: 'behoerdenDossier.jsonTexte.annahmeOhneDreizehnten' }]);
    expect(generateBehoerdenJSON({}, { ipv: ipv(false) }, (k) => k).calculations.ipv.assumptions).toBeUndefined();
  });
});
