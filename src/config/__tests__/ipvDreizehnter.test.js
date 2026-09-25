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
    expect(offen.annahmen).toEqual({ ohneDreizehnten: true, partnerOhneDreizehnten: false });
    expect(nein.annahmen).toEqual({ ohneDreizehnten: false, partnerOhneDreizehnten: false });
    expect(calculateIPV(profil(canton, plz, city, 2160, JA)).annahmen).toEqual({ ohneDreizehnten: false, partnerOhneDreizehnten: false });
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
      // Partnereinkommen: immer ×12, und das Ergebnis sagt es dazu (nach dem 13. der zweiten
      // Person fragt die App nicht). Nur mit sichtbarem Partnerfeld (zweite erwachsene Person).
      const paar = { ...mit13, basis: { ...mit13.basis, maritalStatus: 'married', household: { adults: 2, children: [], partnerIncome: '1000' } } };
      expect(ipvJahreseinkommen(paar)).toBe(2160 * 13 + 1000 * 12);
      const r = calculateIPV(paar);
      expect(r.eligible).toBe(true);
      expect(r.annahmen).toEqual({ ohneDreizehnten: false, partnerOhneDreizehnten: true });
      expect(calculateIPV(mit13).annahmen.partnerOhneDreizehnten).toBe(false);
    } finally { zurueck(); }
  });
});

// Fachprüfung 25.09.2026 zum Fix: der Schätzbetrag läuft auch ins Behörden-Dossier — die Annahme
// muss dort mit (Datei-Kennung wie bei der Steuer), sonst steht der Betrag ohne sie beim Amt.
describe('Behörden-Dossier trägt die Annahme mit', () => {
  it('JSON: calculations.ipv.assumptions nur bei offener Frage', async () => {
    const { generateBehoerdenJSON } = await import('../../dossierGenerator.js');
    const ipv = (ohneDreizehnten, partnerOhneDreizehnten = false) => ({ belegt: true, eligible: true, amount: 100, annahmen: { ohneDreizehnten, partnerOhneDreizehnten } });
    const json = (i) => generateBehoerdenJSON({}, { ipv: i }, (k) => k).calculations.ipv;
    expect(json(ipv(true)).assumptions).toEqual([{ code: 'ohne_13_monatslohn', text: 'behoerdenDossier.jsonTexte.annahmeOhneDreizehnten' }]);
    expect(json(ipv(false, true)).assumptions).toEqual([{ code: 'partner_ohne_13_monatslohn', text: 'behoerdenDossier.jsonTexte.annahmePartnerOhneDreizehnten' }]);
    expect(json(ipv(false)).assumptions).toBeUndefined();
  });
});

// Gleiche Fehlerklasse ausserhalb der IPV: Mietzinsbeiträge (MietzinsOrientierung.jsx) rechneten
// das Jahreseinkommen ebenfalls ×12. BS, Richtgrenze 50 000: 4 000 × 12 = 48 000 liegt darunter,
// 4 000 × 13 = 52 000 darüber — genau der Fall, den der 13. kippt.
describe('Mietzinsbeiträge: 13. Monatslohn nach derselben Regel', () => {
  const t = (k, p) => (p && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
  const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
  const render = async (dreizehnter) => {
    const { MietzinsOrientierung } = await import('../../MietzinsOrientierung.jsx');
    const data = { basis: { canton: 'BS', household: { adults: 1, children: [] } }, finanzen: { monthlyIncome: 4000, ...(dreizehnter !== undefined && { dreizehnter }) }, wohnen: { rentAmount: 1200 } };
    return renderToStaticMarkup(React.createElement(MietzinsOrientierung, { palette, t, data }));
  };
  it('«ja»: 52 000 über der Grenze', async () => {
    const html = await render(JA);
    expect(html).toContain('mietzinsView.result_incomeHigh');
    expect(html).not.toContain('mietzinsView.result_likely');
  });
  it('«nein»: 48 000 unter der Grenze, ohne Annahme-Hinweis', async () => {
    const html = await render(NEIN);
    expect(html).toContain('mietzinsView.result_likely');
    expect(html).not.toContain('mietzinsView.annahmeOhneDreizehnten');
  });
  it('offen: ×12 wie «nein», aber mit sichtbarer Annahme', async () => {
    const html = await render(undefined);
    expect(html).toContain('mietzinsView.result_likely');
    expect(html).toContain('mietzinsView.annahmeOhneDreizehnten');
  });
});

// Schutzschild: die BVG-Eintrittsschwelle misst den AHV-Jahreslohn, der 13. gehört dazu
// (BVG Art. 7 Abs. 2). Ein Monatslohn, der ×12 knapp unter, ×13 über der Schwelle liegt.
describe('Schutzschild: BVG-Eintrittsschwelle mit 13. Monatslohn', () => {
  it('×13 bei «ja» macht die BVG-Pflicht sichtbar, ×12 sonst nicht', async () => {
    const { schildState, jahreseinkommenFuerSchild } = await import('../../data/schutzschild.js');
    const { BVG_PARAMS } = await import('../../data/ahvRechner.js');
    const m = BVG_PARAMS.eintrittsschwelle / 12.5;
    const bvgPflicht = (dreizehnter) => schildState({ kkInsurer: 'X' }, { employed: true, annualIncome: jahreseinkommenFuerSchild({ monthlyIncome: m, dreizehnter }) })
      .pflicht.items.some((i) => i.key === 'bvg');
    expect(bvgPflicht(JA)).toBe(true);
    expect(bvgPflicht(NEIN)).toBe(false);
    expect(bvgPflicht(undefined)).toBe(false);
  });
});

describe('IPV-Rechner zeigt die Partner-Annahme', () => {
  it('nur mit Partnereinkommen', () => {
    const zurueck = kantoneBelegtSimulieren(['BS']);
    try {
      const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
      const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t: (k) => k, data, onUpdateData: () => {} }));
      const allein = profil('BS', '4051', 'Basel', 2160, JA);
      const paar = { ...allein, basis: { ...allein.basis, maritalStatus: 'married', household: { adults: 2, children: [], partnerIncome: '1000' } } };
      expect(render(paar)).toContain('ipv.annahmePartnerOhneDreizehnten');
      expect(render(allein)).not.toContain('ipv.annahmePartnerOhneDreizehnten');
    } finally { zurueck(); }
  });
});

// Fachprüfung 25.09.2026: massgebend ist das HAUSHALTSeinkommen (BS bs.ch · BL MBG § 8 Abs. 1 ·
// ZG Merkblatt Sept. 2025). Nebenerwerb immer, Partnereinkommen bei Ehe; im Konkubinat offen.
describe('Mietzinsbeiträge: Haushaltseinkommen', () => {
  const t = (k, p) => (p && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
  const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
  const render = async ({ maritalStatus = 'single', adults = 1, partnerIncome, sideIncome } = {}) => {
    const { MietzinsOrientierung } = await import('../../MietzinsOrientierung.jsx');
    const data = {
      basis: { canton: 'BS', maritalStatus, household: { adults, children: [], ...(partnerIncome != null && { partnerIncome: String(partnerIncome) }) } },
      finanzen: { monthlyIncome: 3000, dreizehnter: NEIN, ...(sideIncome != null && { sideIncome }) },
      wohnen: { rentAmount: 1200 },
    };
    return renderToStaticMarkup(React.createElement(MietzinsOrientierung, { palette, t, data }));
  };
  it('allein: 36 000 unter 50 000', async () => {
    expect(await render()).toContain('mietzinsView.result_likely(36’000|50’000)');
  });
  it('Nebenerwerb zählt ×12: 3 000 × 12 + 1 500 × 12 = 54 000 über der Grenze', async () => {
    expect(await render({ sideIncome: 1500 })).toContain('mietzinsView.result_incomeHigh');
  });
  it('verheiratet: Partnereinkommen zählt (36 000 + 24 000)', async () => {
    const html = await render({ maritalStatus: 'married', adults: 2, partnerIncome: 2000 });
    expect(html).toContain('mietzinsView.result_incomeHigh');
    expect(html).not.toContain('mietzinsView.konkubinatPartner');
  });
  it('Konkubinat: nicht eingerechnet, aber die Zahl mit Partnereinkommen genannt', async () => {
    const html = await render({ maritalStatus: 'cohabiting', adults: 2, partnerIncome: 2000 });
    expect(html).toContain('mietzinsView.result_likely(36’000|50’000)');
    expect(html).toContain('mietzinsView.konkubinatPartner(60’000)');
  });
});
