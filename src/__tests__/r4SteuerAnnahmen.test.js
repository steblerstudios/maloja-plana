import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';

// ─────────────────────────────────────────────────────────────
// R4 · Steuer-Annahmen (Prüfbefunde Swiss-Precision, Predeploy 16.09.2026)
//   1. 13. Monatslohn: Hauptlohn × 13, wenn im Profil «ja»; offen → × 12 und sichtbar gekennzeichnet
//   2. Rentner/Selbständige: keine Schätzung aus dem Nettolohn (die ESTV-Abzüge sind für
//      Unselbständige gemessen); ein direkt eingetragenes steuerbares Einkommen rechnet weiter
//   3. Verheiratet ohne Angabe zum Partnereinkommen: keine Zahl; bewusst 0 → Alleinverdiener-Ehepaar
//   4. Häkchen «eingetragenen Wert verwenden» wird gespeichert; alle drei Seiten lesen dieselbe Regel
//   5. Tarifvergleich: ledig und verheiratet je mit dem passenden steuerbaren Einkommen
//
// Erwartungen aus den Messdateien des ESTV-Steuerrechners 2026 (Hauptort, ohne Kirchensteuer,
// unselbständig, Alter 40), nicht aus dem eigenen Code:
//   docs/sources/nettolohn-abzuege-2026.messpunkte.json   Brutto → Nettolohn → steuerbar Bund
//   docs/sources/steuerfaktor-band-2026.messpunkte.json   [kt, zs, brutto, steuerbarBund, bundEstv, …, K+G]
// ─────────────────────────────────────────────────────────────

// TaxCalculator hat Hooks und kein DOM im Repo: kleiner Speicher statt React-Hooks
// (wie kantonssteuerAnsicht.test.js).
const zustand = { slots: [], i: 0, effekte: [] };
vi.mock('react', async (importOriginal) => {
  const R = await importOriginal();
  const useState = (init) => {
    const i = zustand.i++;
    if (!(i in zustand.slots)) zustand.slots[i] = typeof init === 'function' ? init() : init;
    return [zustand.slots[i], (v) => { zustand.slots[i] = typeof v === 'function' ? v(zustand.slots[i]) : v; }];
  };
  const useEffect = (fn) => { zustand.effekte.push(fn); };
  const gemockt = { ...R, useState, useEffect, useId: () => 'id' };
  return { ...gemockt, default: gemockt };
});
globalThis.window ??= { innerWidth: 1024, addEventListener: () => {}, removeEventListener: () => {} };

const { TaxCalculator } = await import('../TaxCalculator.jsx');
const { LabeledField } = await import('../components/LabeledField.jsx');
const { KantonssteuerOrientierung } = await import('../components/KantonssteuerOrientierung.jsx');
const { SteuerSaeulen } = await import('../components/SteuerSaeulen.jsx');
const { FinanzUebersicht, druckAbschnitte } = await import('../FinanzUebersicht.jsx');
const { BehoerdenDossier } = await import('../BehoerdenDossier.jsx');
const { getBehoerdenDossierPreview, generateBehoerdenJSON } = await import('../dossierGenerator.js');
const { renderToStaticMarkup } = await import('react-dom/server');
const React = (await import('react')).default;
const {
  steuernFuerProfil, steuerEingabenAusDaten, tarifvergleichFuerProfil, dreizehnterStatus,
} = await import('../data/kantonaleSteuerdaten.js');

const lies = (datei) => JSON.parse(readFileSync(new URL('../../docs/sources/' + datei, import.meta.url), 'utf-8'));
const abzuege = lies('nettolohn-abzuege-2026.messpunkte.json');
const band = lies('steuerfaktor-band-2026.messpunkte.json');
const NETTO = new Map(abzuege.punkte.map((p) => [p[0], { netto: p[1], steuerbar: p[3] }]));
const estv = (kt, zs, brutto) => {
  const p = band.punkte.find((q) => q[0] === kt && q[1] === zs && q[2] === brutto);
  return { steuerbar: p[3], bund: p[4], kg: p[10] };
};

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const tausender = (n) => { const r = Math.round(n); return r >= 1000 ? r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '’') : String(r); };
const imRahmen = (wert, soll) => Math.abs(wert - soll) <= Math.max(0.03 * soll, 50);
// Bundessteuer: die ESTV weist ganze Franken aus; #184 belegt höchstens CHF 0.50 Abstand.
const bundWieEstv = (wert, soll) => Math.abs(wert - soll) <= 0.5;

// partnerIncome: nicht gesetzt = nie beantwortet (so legt ChapterView das Feld an)
const profil = ({ canton = 'ZH', monat, neben, dreizehnter, verheiratet = false, kinder = 0, partnerIncome, employmentType, taxableIncome, taxData } = {}) => ({
  basis: {
    canton, maritalStatus: verheiratet ? 'married' : 'single',
    household: { adults: verheiratet ? 2 : 1, children: Array.from({ length: kinder }, () => ({ age: 8 })), ...(partnerIncome !== undefined ? { partnerIncome } : {}) },
  },
  finanzen: {
    ...(monat ? { monthlyIncome: monat } : {}),
    ...(neben ? { sideIncome: neben } : {}),
    ...(dreizehnter !== undefined ? { dreizehnter } : {}),
    ...(employmentType ? { employmentType } : {}),
    ...(taxableIncome ? { taxableIncome } : {}),
  },
  wohnen: {},
  versicherungen: {},
  ...(taxData ? { taxData } : {}),
});

const regel = (p) => steuernFuerProfil(steuerEingabenAusDaten(p));

// ── Seiten ───────────────────────────────────────────────────
const knoten = (el, out = []) => {
  if (Array.isArray(el)) { el.forEach((c) => knoten(c, out)); return out; }
  if (!el || typeof el !== 'object' || !el.props) return out;
  out.push(el);
  let kinder = el.props.children;
  if (el.type === LabeledField && typeof kinder === 'function') kinder = kinder('id');
  if (el.type === KantonssteuerOrientierung) kinder = KantonssteuerOrientierung(el.props);
  if (el.type === SteuerSaeulen) kinder = SteuerSaeulen(el.props);
  knoten(kinder, out);
  return out;
};
const texte = (alle) => alle.map((k) => k.props.children).flat().filter((c) => typeof c === 'string').join('\n');

const steuerrechner = (data) => {
  zustand.slots = [];
  const gespeichert = [];
  const render = () => {
    zustand.i = 0;
    zustand.effekte = [];
    return knoten(TaxCalculator({ palette, t, data, onSave: (d) => gespeichert.push(d), onNavigate: () => {} }));
  };
  render();
  zustand.effekte.forEach((fn) => fn());
  const alle = render();
  const text = texte(alle);
  const betraege = text.split('\n').filter((z) => /^~ CHF \d+(\.\d+)?$/.test(z)).map((z) => Number(z.slice(6)));
  const steuerbar = alle.find((k) => k.props['data-testid'] === 'steuerbares-einkommen');
  return { alle, text, betraege, steuerbar: steuerbar ? texte(knoten(steuerbar.props.children)) : null, gespeichert, render };
};

const statisch = (C, data) => {
  zustand.slots = [];
  zustand.i = 0;
  return renderToStaticMarkup(React.createElement(C, { palette, t, data, chapters: [], onNavigate: () => {} }));
};

const dossierRechnung = (p) => {
  const s = regel(p);
  return { tax: s.bund ? { total: s.bund.steuer, taxableIncome: s.bund.steuerBaresEinkommen, taxableQuelle: s.quelle, kantonal: s.kanton.kantonal, kantonOhneZahl: !s.kanton.kantonal, annahmen: s.annahmen, datenstand: '2026' } : null };
};

// ─────────────────────────────────────────────────────────────
describe('R4-1 · 13. Monatslohn', () => {
  it('liest die Werte aus dem Finanzen-Kapitel (Optionen yes/no) und ältere Schreibweisen', () => {
    expect(dreizehnterStatus('yes')).toBe('ja');
    expect(dreizehnterStatus(true)).toBe('ja');
    expect(dreizehnterStatus('ja')).toBe('ja');
    expect(dreizehnterStatus('no')).toBe('nein');
    expect(dreizehnterStatus(false)).toBe('nein');
    expect(dreizehnterStatus(undefined)).toBe('offen');
    expect(dreizehnterStatus('')).toBe('offen');
  });

  it('ZH ledig, 5 000 netto, 13. ja → steuerbar 61 200 (statt 56 200)', () => {
    expect(steuerEingabenAusDaten(profil({ monat: 5000, dreizehnter: 'yes' })).nettolohnJahr).toBe(65000);
    expect(regel(profil({ monat: 5000, dreizehnter: 'yes' })).steuerbar).toBe(61200);
    expect(regel(profil({ monat: 5000, dreizehnter: 'no' })).steuerbar).toBe(56200);
    expect(regel(profil({ monat: 5000 })).steuerbar).toBe(56200);
  });

  it('Nebenerwerb bleibt × 12 (die Frage im Profil gilt dem Hauptlohn)', () => {
    expect(steuerEingabenAusDaten(profil({ monat: 5000, neben: 1000, dreizehnter: 'yes' })).nettolohnJahr).toBe(5000 * 13 + 1000 * 12);
  });

  it('ESTV-Messpunkt: Nettolohn 58 653 (Brutto 65 000) als 13 Monatslöhne → steuerbar, Bund und Kanton wie die ESTV', () => {
    const { netto, steuerbar } = NETTO.get(65000);
    const soll = estv('ZH', 'ledig', 65000);
    expect(soll.steuerbar).toBe(steuerbar);
    const s = regel(profil({ monat: netto / 13, dreizehnter: 'yes' }));
    expect(s.steuerbar).toBe(steuerbar);
    expect(bundWieEstv(s.bund.steuer, soll.bund)).toBe(true);
    expect(imRahmen(s.kanton.kantonal.kantonalUndGemeinde, soll.kg)).toBe(true);
    // Vorher (× 12) lag das steuerbare Einkommen daneben.
    expect(regel(profil({ monat: netto / 13 })).steuerbar).not.toBe(steuerbar);
  });

  it('offen → gleiche Zahl wie heute, aber gekennzeichnet; ja/nein → keine Kennzeichnung', () => {
    expect(regel(profil({ monat: 5000 })).annahmen.ohneDreizehnten).toBe(true);
    expect(regel(profil({ monat: 5000, dreizehnter: 'no' })).annahmen.ohneDreizehnten).toBe(false);
    expect(regel(profil({ monat: 5000, dreizehnter: 'yes' })).annahmen.ohneDreizehnten).toBe(false);
    // direkt eingetragenes steuerbares Einkommen: der Monatslohn spielt keine Rolle
    expect(regel(profil({ monat: 5000, taxableIncome: 50000 })).annahmen.ohneDreizehnten).toBe(false);
  });

  it('die drei Seiten zeigen die Kennzeichnung', () => {
    const p = profil({ monat: 5000 });
    expect(statisch(FinanzUebersicht, p)).toContain('tax.annahmeOhneDreizehnten');
    expect(statisch(BehoerdenDossier, p)).toContain('tax.annahmeOhneDreizehnten');
    expect(steuerrechner(p).text).toContain('tax.annahmeOhneDreizehnten');
    expect(steuerrechner(profil({ monat: 5000, dreizehnter: 'yes' })).text).not.toContain('tax.annahmeOhneDreizehnten');
    expect(steuerrechner(profil({ monat: 5000, dreizehnter: 'yes' })).text).toContain('tax.netIncomeNote13');
    expect(steuerrechner(profil({ monat: 5000, dreizehnter: 'yes' })).text).toContain('CHF 65’000');
    const json = generateBehoerdenJSON(p, dossierRechnung(p)).calculations.tax;
    // E40: Kennung statt deutschem Klartext (ohne t nur die Kennung)
    expect(json.assumptions).toContainEqual({ code: 'ohne_13_monatslohn' });
  });
});

// ─────────────────────────────────────────────────────────────
describe('R4-2 · Rentner und Selbständige', () => {
  it.each([
    ['retired', 'rente'],
    ['selfEmployed', 'selbstaendig'],
    ['freelance', 'selbstaendig'],
  ])('%s → keine Bundes- und keine Kantonszahl aus dem Nettolohn (grund %s)', (employmentType, grund) => {
    const s = regel(profil({ canton: 'BE', monat: 3000, employmentType }));
    expect(s.bund).toBeNull();
    expect(s.grund).toBe(grund);
    expect(s.kanton.kantonal).toBeNull();
    expect(s.kanton.grund).toBe(grund);
  });

  it('angestellt bzw. ohne Angabe → rechnet wie gemessen', () => {
    expect(regel(profil({ canton: 'BE', monat: 3000, employmentType: 'employed' })).bund).not.toBeNull();
    expect(regel(profil({ canton: 'BE', monat: 3000 })).bund).not.toBeNull();
  });

  it('direkt eingetragenes steuerbares Einkommen rechnet weiter (BE ledig, steuerbar 32 803 → ESTV)', () => {
    const soll = estv('BE', 'ledig', 40000);
    const s = regel(profil({ canton: 'BE', monat: 3000, employmentType: 'retired', taxableIncome: soll.steuerbar }));
    expect(s.quelle).toBe('direkt');
    expect(bundWieEstv(s.bund.steuer, soll.bund)).toBe(true);
    expect(imRahmen(s.kanton.kantonal.kantonalUndGemeinde, soll.kg)).toBe(true);
  });

  it('BE Rentner 3 000: Seiten zeigen den ruhigen Hinweis mit ESTV-Link, keinen Betrag', () => {
    const p = profil({ canton: 'BE', monat: 3000, employmentType: 'retired' });
    const fu = statisch(FinanzUebersicht, p);
    expect(fu).toContain('tax.noTaxFigure');
    expect(fu).toContain('tax.ohneZahlRente');
    expect(fu).toContain('href="https://swisstaxcalculator.estv.admin.ch/"');
    expect(fu).not.toContain('tax.federalTax:');
    const bd = statisch(BehoerdenDossier, p);
    expect(bd).not.toContain('tax.federalTax');
    const r = steuerrechner(p);
    expect(r.betraege).toEqual([]);
    expect(r.text).toContain('tax.ohneZahlRente');
    const selbst = steuerrechner(profil({ canton: 'BE', monat: 3000, employmentType: 'selfEmployed' }));
    expect(selbst.text).toContain('tax.ohneZahlSelbstaendig');
    // ohne Kanton: der Grund steht direkt bei der Bundessteuer
    expect(steuerrechner(profil({ canton: '', monat: 3000, employmentType: 'retired' })).text).toContain('tax.ohneZahlRente');
  });
});

// ─────────────────────────────────────────────────────────────
describe('R4-3 · Verheiratet ohne Angabe zum Partnereinkommen', () => {
  it('nie beantwortet (Feld fehlt oder leer) → keine Zahl, grund partnerOffen', () => {
    for (const partnerIncome of [undefined, '', null]) {
      const s = regel(profil({ monat: 6000, verheiratet: true, partnerIncome }));
      expect(s.bund, String(partnerIncome)).toBeNull();
      expect(s.grund).toBe('partnerOffen');
      expect(s.kanton.kantonal).toBeNull();
      expect(s.kanton.grund).toBe('partnerOffen');
    }
  });

  it('bewusst 0 → rechnet als Alleinverdiener-Ehepaar (ZH, Nettolohn 71 883 → ESTV verheiratet)', () => {
    const { netto } = NETTO.get(80000);
    const soll = estv('ZH', 'verheiratet', 80000);
    for (const partnerIncome of ['0', 0]) {
      const s = regel(profil({ monat: netto / 12, verheiratet: true, partnerIncome }));
      expect(s.steuerbar).toBe(soll.steuerbar);
      expect(s.bund.steuer).toBe(soll.bund);
      expect(imRahmen(s.kanton.kantonal.kantonalUndGemeinde, soll.kg)).toBe(true);
      expect(s.annahmen.alleinverdiener).toBe(true);
    }
  });

  it('ledig ohne Partnerangabe → rechnet, ohne Alleinverdiener-Kennzeichnung', () => {
    const s = regel(profil({ monat: 6000 }));
    expect(s.bund).not.toBeNull();
    expect(s.annahmen.alleinverdiener).toBe(false);
  });

  it('direkt eingetragen, Partner offen → Bundessteuer aus dem Wert, keine Kantonszahl (Tabelle = Alleinverdiener)', () => {
    const s = regel(profil({ monat: 6000, verheiratet: true, taxableIncome: 60000 }));
    expect(s.bund).not.toBeNull();
    expect(s.kanton.kantonal).toBeNull();
    // K62.4: eigener Grund — der Text betrifft nur die Kantonssteuer, die Bundessteuer steht.
    expect(s.kanton.grund).toBe('partnerOffenDirekt');
    expect(s.annahmen.alleinverdiener).toBe(false);
  });

  it('ZH verheiratet 6 000 ohne Partnerangabe: Hinweis auf allen Seiten; mit 0: Kennzeichnung', () => {
    const offen = profil({ monat: 6000, verheiratet: true });
    const fu = statisch(FinanzUebersicht, offen);
    expect(fu).toContain('tax.noTaxFigure');
    expect(fu).toContain('tax.ohneZahlPartnerOffen');
    expect(statisch(BehoerdenDossier, offen)).not.toContain('tax.federalTax');
    const r = steuerrechner(offen);
    expect(r.betraege).toEqual([]);
    expect(r.text).toContain('tax.ohneZahlPartnerOffen');

    const null0 = profil({ monat: 6000, verheiratet: true, partnerIncome: '0' });
    expect(statisch(FinanzUebersicht, null0)).toContain('tax.annahmeAlleinverdiener');
    expect(statisch(BehoerdenDossier, null0)).toContain('tax.annahmeAlleinverdiener');
    expect(steuerrechner(null0).text).toContain('tax.annahmeAlleinverdiener');
    const json = generateBehoerdenJSON(null0, dossierRechnung(null0), t).calculations.tax;
    expect(json.assumptions).toContainEqual({ code: 'alleinverdiener_ehepaar', text: 'behoerdenDossier.jsonTexte.annahmeAlleinverdiener' });
  });

  it('Steuerrechner-Probiermodus: ledig im Profil, «verheiratet» angekreuzt → gerechnet und gekennzeichnet', () => {
    const r = steuerrechner(profil({ monat: 6000 }));
    const box = r.alle.find((k) => k.props.type === 'checkbox' && k.props.checked === false && typeof k.props.onChange === 'function');
    box.props.onChange({ target: { checked: true } });
    const nach = texte(r.render());
    expect(nach).toContain('tax.marriedTariff');
    expect(nach).toContain('tax.annahmeAlleinverdiener');
  });
});

// ─────────────────────────────────────────────────────────────
// K62.4 · Steuerrechner widersprach sich bei «verheiratet» mit direkt eingetragenem steuerbarem
// Einkommen:
//   a) Partnereinkommen offen: oben eine Bundessteuer, darunter «zeigt Maloja noch keine
//      Steuerschätzung» (tax.ohneZahlPartnerOffen) — ebenso in der Finanzübersicht.
//   b) Probiermodus: der eingetragene Wert gehört zum Zivilstand im Profil, wurde aber mit dem
//      anderen Tarif gerechnet (gemeinsam veranlagt, als ledig gerechnet — oder umgekehrt).
// Regel jetzt: a) Bundessteuer aus dem Wert, Kantonstext nennt nur die fehlende Kantonszahl;
// b) keine Zahl. Dieselbe Regel auf allen drei Seiten (steuernFuerProfil).
// ─────────────────────────────────────────────────────────────
describe('K62.4 · verheiratet mit eingetragenem steuerbarem Einkommen', () => {
  const marriedBox = (r, checked) => r.alle.find((k) => k.props.type === 'checkbox' && k.props.checked === checked && !k.props.id && typeof k.props.onChange === 'function');
  const kurz = (s) => s.split('\n').filter((z) => /^~ CHF/.test(z));

  it('Partnereinkommen offen: Bundessteuer auf allen drei Seiten, Kantonstext widerspricht nicht', () => {
    const p = profil({ monat: 6000, verheiratet: true, taxableIncome: 60000 });
    const s = regel(p);
    expect(s.bund).not.toBeNull();
    expect(s.kanton.grund).toBe('partnerOffenDirekt');
    // Steuerrechner
    const r = steuerrechner(p);
    expect(r.betraege).toEqual([Math.round(s.bund.steuer)]);
    expect(r.text).toContain('tax.bandPartnerOffenDirekt');
    expect(r.text).not.toContain('tax.ohneZahlPartnerOffen');
    // Finanzübersicht
    const fu = statisch(FinanzUebersicht, p);
    expect(fu).toContain('tax.bandPartnerOffenDirekt');
    expect(fu).not.toContain('tax.ohneZahlPartnerOffen');
    // Dossier: Bundessteuer, «keine Schätzung» nur bei der Kantonssteuer
    const bd = statisch(BehoerdenDossier, p);
    expect(bd).toContain('CHF ' + tausender(s.bund.steuer) + 'common.perYear');
    expect(bd).toContain('tax.noCantonalFigure');
    expect(bd).not.toContain('tax.ohneZahlPartnerOffen');
  });

  it('der deutsche Kantonstext sagt nicht «keine Steuerschätzung», der ohne eingetragenen Wert schon', async () => {
    const de = (await import('../i18n/de.js')).default;
    expect(de.tax.bandPartnerOffenDirekt).not.toMatch(/keine Steuerschätzung/);
    expect(de.tax.bandPartnerOffenDirekt).toMatch(/Kantons- und Gemeindesteuer/);
    expect(de.tax.ohneZahlPartnerOffen.sie).toMatch(/keine Steuerschätzung/);
  });

  it('ohne eingetragenen Wert bleibt es bei «keine Zahl» (R4-3 unverändert)', () => {
    const s = regel(profil({ monat: 6000, verheiratet: true }));
    expect(s.bund).toBeNull();
    expect(s.kanton.grund).toBe('partnerOffen');
  });

  it('Probiermodus ledig → verheiratet mit eingetragenem Wert: keine Zahl, Hinweis', () => {
    const p = profil({ monat: 6000, taxableIncome: 60000 });
    const r = steuerrechner(p);
    const vorher = regel(p);
    // mit dem Zivilstand aus dem Profil: dieselben Zahlen wie Finanzübersicht und Dossier
    expect(r.betraege).toEqual([Math.round(vorher.bund.steuer), vorher.kanton.kantonal.kantonalUndGemeinde, vorher.kanton.kantonal.total]);
    expect(statisch(FinanzUebersicht, p)).toContain('tax.federalTax: CHF ' + tausender(vorher.bund.steuer) + ' +');
    marriedBox(r, false).props.onChange({ target: { checked: true } });
    const nach = texte(r.render());
    expect(kurz(nach)).toEqual([]);
    expect(nach).toContain('tax.ohneZahlZivilstandDirekt');
    expect(nach).not.toContain('tax.marriedTariff');
  });

  it('Probiermodus verheiratet → ledig mit eingetragenem Wert: keine Zahl', () => {
    const p = profil({ monat: 6000, verheiratet: true, partnerIncome: '0', taxableIncome: 60000 });
    const r = steuerrechner(p);
    expect(kurz(r.text).length).toBeGreaterThan(0);
    marriedBox(r, true).props.onChange({ target: { checked: false } });
    const nach = texte(r.render());
    expect(kurz(nach)).toEqual([]);
    expect(nach).toContain('tax.ohneZahlZivilstandDirekt');
    expect(nach).not.toContain('tax.singleTariff');
  });

  it('Probiermodus mit entferntem Häkchen (Schätzung aus dem Nettolohn) rechnet weiter', () => {
    const p = profil({ monat: 6000, taxableIncome: 60000, taxData: { useEnteredTaxable: false } });
    const r = steuerrechner(p);
    marriedBox(r, false).props.onChange({ target: { checked: true } });
    const nach = texte(r.render());
    expect(nach).toContain('tax.marriedTariff');
    expect(kurz(nach).length).toBeGreaterThan(0);
  });

  it('Regel ohne Seite: zivilstandDirekt für Bund und Kanton; ohne Profil-Zivilstand keine Prüfung', () => {
    const e = { kanton: 'ZH', nettolohnJahr: 72000, direktSteuerbar: 60000, verheiratet: true, partnerAngegeben: true, kinder: 0 };
    const abweichend = steuernFuerProfil({ ...e, direktVerheiratet: false });
    expect(abweichend.bund).toBeNull();
    expect(abweichend.grund).toBe('zivilstandDirekt');
    expect(abweichend.kanton.kantonal).toBeNull();
    expect(abweichend.kanton.grund).toBe('zivilstandDirekt');
    expect(steuernFuerProfil({ ...e, direktVerheiratet: true }).bund).not.toBeNull();
    expect(steuernFuerProfil(e).bund).not.toBeNull();
    // Profil liefert den Zivilstand des eingetragenen Werts mit
    expect(steuerEingabenAusDaten(profil({ monat: 6000, verheiratet: true })).direktVerheiratet).toBe(true);
    expect(steuerEingabenAusDaten(profil({ monat: 6000 })).direktVerheiratet).toBe(false);
  });

  it('Orientierung ohne Kanton: der Grund steht direkt bei der Bundessteuer', () => {
    const r = steuerrechner(profil({ canton: '', monat: 6000, taxableIncome: 60000 }));
    marriedBox(r, false).props.onChange({ target: { checked: true } });
    expect(texte(r.render())).toContain('tax.ohneZahlZivilstandDirekt');
  });
});

// ─────────────────────────────────────────────────────────────
describe('R4-4 · eine Zahl überall (Häkchen «eingetragenen Wert verwenden»)', () => {
  const zahlen = (p) => {
    const s = regel(p);
    const r = steuerrechner(p);
    return { s, r, fu: statisch(FinanzUebersicht, p), bd: statisch(BehoerdenDossier, p) };
  };

  it.each([
    ['Häkchen gesetzt', { useEnteredTaxable: true }, 'direkt'],
    ['Häkchen entfernt', { useEnteredTaxable: false }, 'estv'],
    ['altes Profil ohne Häkchen-Wert → eingetragener Wert gilt (wie bisher überall)', undefined, 'direkt'],
  ])('%s', (_, taxData, quelle) => {
    const p = profil({ monat: 6000, dreizehnter: 'no', taxableIncome: 40000, taxData });
    const { s, r, fu, bd } = zahlen(p);
    expect(s.quelle).toBe(quelle);
    const steuerbar = quelle === 'direkt' ? 40000 : 72000 - 2160 - 1800;
    expect(s.steuerbar).toBe(steuerbar);
    // Steuerrechner
    expect(r.steuerbar).toContain('CHF ' + tausender(steuerbar)); // seit 24.09.2026 mit ’
    expect(r.betraege[0]).toBe(Math.round(s.bund.steuer));
    expect(r.betraege[1]).toBe(s.kanton.kantonal.kantonalUndGemeinde);
    // Finanzübersicht
    expect(fu).toContain('tax.federalTax: CHF ' + tausender(s.bund.steuer) + ' +');
    expect(fu).toContain('CHF ' + tausender(s.kanton.kantonal.kantonalUndGemeinde));
    // Dossier
    expect(bd).toContain('CHF ' + tausender(steuerbar) + '<');
    expect(bd).toContain('CHF ' + tausender(s.bund.steuer) + 'common.perYear');
    expect(bd).toContain('CHF ' + tausender(s.kanton.kantonal.kantonalUndGemeinde));
    const preview = getBehoerdenDossierPreview(p, [], t, dossierRechnung(p));
    expect(preview.sections.find((x) => x.key === 'steuern').rows.map((x) => x.value)).toContain('CHF ' + tausender(steuerbar));
  });

  it('der Steuerrechner speichert das Häkchen mit', () => {
    const p = profil({ monat: 6000, taxableIncome: 40000 });
    const r = steuerrechner(p);
    const box = r.alle.find((k) => k.props.id === 'tax-use-entered');
    expect(box.props.checked).toBe(true);
    box.props.onChange({ target: { checked: false } });
    const alle = r.render();
    const speichern = alle.find((k) => k.type === 'button' && String(k.props.children).includes('tax.saveData'));
    speichern.props.onClick();
    const d = r.gespeichert.at(-1);
    expect(d.taxData.useEnteredTaxable).toBe(false);
    expect(d.finanzen.taxableIncome).toBe(40000);
    // gespeichertes Profil → Finanzübersicht rechnet ebenfalls ohne den eingetragenen Wert
    expect(steuerEingabenAusDaten(d).direktSteuerbar).toBe(0);
    // gespeichert wieder geöffnet → Häkchen bleibt entfernt
    const wieder = steuerrechner(d);
    expect(wieder.alle.find((k) => k.props.id === 'tax-use-entered').props.checked).toBe(false);
  });

  it('ohne eingetragenen Wert wird kein Häkchen-Wert gespeichert', () => {
    const r = steuerrechner(profil({ monat: 6000 }));
    r.alle.find((k) => k.type === 'button' && String(k.props.children).includes('tax.saveData')).props.onClick();
    expect(r.gespeichert.at(-1).taxData.useEnteredTaxable).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────
describe('R4-5 · Tarifvergleich mit dem passenden steuerbaren Einkommen', () => {
  it('ZH, Nettolohn 71 883: ledig → ESTV ledig, verheiratet → ESTV verheiratet (Alleinverdiener)', () => {
    const { netto } = NETTO.get(80000);
    const ledig = estv('ZH', 'ledig', 80000);
    const verh = estv('ZH', 'verheiratet', 80000);
    for (const verheiratet of [false, true]) {
      const e = steuerEingabenAusDaten(profil({ monat: netto / 12, verheiratet, partnerIncome: verheiratet ? '0' : undefined }));
      const v = tarifvergleichFuerProfil(e);
      expect(v.steuerBaresEinkommen).toBe(ledig.steuerbar);
      expect(v.steuerBaresEinkommenVerheiratet).toBe(verh.steuerbar);
      expect(v.alleinstehend).toBe(ledig.bund);
      expect(v.verheiratet).toBe(verh.bund);
      expect(v.differenz).toBe(ledig.bund - verh.bund);
    }
  });

  it('direkt eingetragener Wert → kein Vergleich (der Wert gilt nur für den heutigen Zivilstand)', () => {
    expect(tarifvergleichFuerProfil(steuerEingabenAusDaten(profil({ monat: 6000, taxableIncome: 40000 })))).toBeNull();
    const r = steuerrechner(profil({ monat: 6000, taxableIncome: 40000 }));
    expect(r.text).toContain('tax.saeulen.nurGeschaetzt');
  });

  it('der Steuerrechner zeigt die Säulen mit den Werten des Vergleichs', () => {
    const { netto } = NETTO.get(80000);
    const r = steuerrechner(profil({ monat: netto / 12, dreizehnter: 'no' }));
    const saeulen = r.alle.find((k) => k.type === SteuerSaeulen);
    expect(saeulen.props.vergleich.alleinstehend).toBe(906);
    expect(saeulen.props.vergleich.verheiratet).toBe(452);
    expect(r.text).toContain('tax.saeulen.abzuegeNote(67’927|63’227)');
  });
});

// ─────────────────────────────────────────────────────────────
describe('R4 · Druck der Finanzübersicht nennt die Annahmen', () => {
  it('ohne 13. und Alleinverdiener', () => {
    const p = profil({ monat: 6000, verheiratet: true, partnerIncome: '0' });
    const s = regel(p);
    const html = druckAbschnitte(t, { income: 6000, canton: 'ZH', taxResult: s.bund, kantonal: s.kanton.kantonal, annahmen: s.annahmen, ipv: {}, sozialhilfe: {}, el: {} })[0].zeilen.map((z) => z.html).join('');
    expect(html).toContain('tax.annahmeOhneDreizehnten');
    expect(html).toContain('tax.annahmeAlleinverdiener');
  });
});

describe('R4 · i18n', () => {
  it('neue Schlüssel in allen fünf Sprachen', async () => {
    const sprachen = await Promise.all(['de', 'en', 'fr', 'it', 'rm'].map((l) => import('../i18n/' + l + '.js').then((m) => m.default)));
    const schluessel = ['ohneZahlRente', 'ohneZahlSelbstaendig', 'ohneZahlPartnerOffen', 'annahmeOhneDreizehnten', 'annahmeAlleinverdiener', 'netIncomeNote13', 'annahmenLabel'];
    for (const s of sprachen) {
      for (const k of schluessel) expect(s.tax[k], k).toBeTruthy();
      expect(s.tax.saeulen.abzuegeNote).toMatch(/\{ledig\}.*\{verheiratet\}/s);
      expect(s.tax.saeulen.nurGeschaetzt).toBeTruthy();
    }
  });
});
