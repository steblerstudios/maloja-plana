import { describe, it, expect, vi } from 'vitest';

// ─────────────────────────────────────────────────────────────
// K86 · Verheiratet mit direkt eingetragenem (gemeinsamem) steuerbarem Einkommen: der effektive
//       Steuersatz teilte die Steuer auf das GEMEINSAME Einkommen durch den EIGENEN Nettolohn,
//       ebenso «Nettoeinkommen» = eigener Nettolohn − Steuer auf das gemeinsame Einkommen.
//       Jetzt: kein Satz, kein Nettoeinkommen, ein Hinweis. Die Zeile «Jahreseinkommen» heisst
//       «eigener Nettolohn».
// K87 · Probiermodus: weicht die Kinderzahl von der im Profil ab und ist ein Wert direkt
//       eingetragen → keine Zahl, Hinweis (gleiches Muster wie K62.4 beim Zivilstand).
//       Vorher: ledig 50 000, Profil 0 Kinder, im Rechner 2 → Bundessteuer ohne Hinweis.
// K98 · Texte: «Ohne Partnereinkommen im Profil 0 eintragen» eindeutig · it «qui sopra»,
//       durchgehend «salario netto» · «gemeinsam» als Annahme.
// ─────────────────────────────────────────────────────────────

// TaxCalculator hat Hooks und kein DOM im Repo: kleiner Speicher statt React-Hooks
// (wie r4SteuerAnnahmen.test.js).
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
const { steuernFuerProfil, steuerEingabenAusDaten } = await import('../data/kantonaleSteuerdaten.js');
const { bundessteuerAusSteuerbarem } = await import('../data/steuerRechner.js');
const sprachen = {
  de: (await import('../i18n/de.js')).default,
  fr: (await import('../i18n/fr.js')).default,
  it: (await import('../i18n/it.js')).default,
  en: (await import('../i18n/en.js')).default,
  rm: (await import('../i18n/rm.js')).default,
};

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);

const profil = ({ canton = 'ZH', monat, verheiratet = false, kinder = 0, partnerIncome, taxableIncome, taxData } = {}) => ({
  basis: {
    canton, maritalStatus: verheiratet ? 'married' : 'single',
    household: { adults: verheiratet ? 2 : 1, children: Array.from({ length: kinder }, () => ({ age: 8 })), ...(partnerIncome !== undefined ? { partnerIncome } : {}) },
  },
  finanzen: { ...(monat ? { monthlyIncome: monat } : {}), ...(taxableIncome ? { taxableIncome } : {}) },
  wohnen: {},
  versicherungen: {},
  ...(taxData ? { taxData } : {}),
});
const regel = (p) => steuernFuerProfil(steuerEingabenAusDaten(p));

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
const betraege = (text) => text.split('\n').filter((z) => /^~ CHF/.test(z));

const steuerrechner = (data) => {
  zustand.slots = [];
  const render = () => {
    zustand.i = 0;
    zustand.effekte = [];
    return knoten(TaxCalculator({ palette, t, data, onSave: () => {}, onNavigate: () => {} }));
  };
  render();
  const alle = render();
  return { alle, text: texte(alle), render };
};
// Kopfzeile der Bundessteuer: «tax.federalTax» plus allenfalls « ~x.xx%»
const satzZeile = (alle) => alle.find((k) => Array.isArray(k.props.children) && k.props.children[0] === 'tax.federalTax');
const hatNettoeinkommen = (alle) => alle.some((k) => k.props.children === 'tax.netIncome');
const kinderAuswahl = (alle) => alle.find((k) => k.type === 'select' && typeof k.props.value === 'number');

// ─────────────────────────────────────────────────────────────
describe('K86 · effektiver Satz bei verheiratet + direkt eingetragenem gemeinsamem Wert', () => {
  const gemeinsam = profil({ monat: 6000, verheiratet: true, partnerIncome: '5000', taxableIncome: 120000 });

  it('Regel: Bundessteuer aus dem Wert, aber kein Satz (kein Bezug zum eigenen Nettolohn)', () => {
    const s = regel(gemeinsam);
    expect(s.quelle).toBe('direkt');
    expect(s.bund).not.toBeNull();
    expect(s.bund.steuer).toBeGreaterThan(0);
    expect(s.bund.effektiverSatz).toBeNull();
    expect(s.gemeinsamDirekt).toBe(true);
  });

  it('Steuerrechner: Bundessteuer ohne «~x%», Hinweis sichtbar, kein Nettoeinkommen', () => {
    const r = steuerrechner(gemeinsam);
    expect(betraege(r.text).length).toBeGreaterThan(0);
    expect(satzZeile(r.alle).props.children.join('')).not.toMatch(/%/);
    expect(r.text).toContain('tax.gemeinsamDirektHinweis');
    expect(hatNettoeinkommen(r.alle)).toBe(false);
  });

  it('auch mit Partnereinkommen offen (partnerOffenDirekt): kein Satz', () => {
    const s = regel(profil({ monat: 6000, verheiratet: true, taxableIncome: 60000 }));
    expect(s.bund.effektiverSatz).toBeNull();
  });

  it('ledig mit eingetragenem Wert: Satz und Nettoeinkommen bleiben', () => {
    const p = profil({ monat: 6000, taxableIncome: 60000 });
    const s = regel(p);
    expect(s.gemeinsamDirekt).toBe(false);
    expect(s.bund.effektiverSatz).toBeGreaterThan(0);
    const r = steuerrechner(p);
    expect(satzZeile(r.alle).props.children.join('')).toMatch(/~\d+(\.\d+)?%/);
    expect(r.text).not.toContain('tax.gemeinsamDirektHinweis');
    expect(hatNettoeinkommen(r.alle)).toBe(true);
  });

  it('verheiratet, geschätzt aus dem Nettolohn (Partner 0): Satz bleibt', () => {
    const s = regel(profil({ monat: 6000, verheiratet: true, partnerIncome: '0' }));
    expect(s.quelle).toBe('estv');
    expect(s.bund.effektiverSatz).toBeGreaterThan(0);
  });

  it('bundessteuerAusSteuerbarem: einkommen null → kein Satz, Bezug = steuerbar', () => {
    const r = bundessteuerAusSteuerbarem({ steuerbaresEinkommen: 100000, verheiratet: true, einkommen: null });
    expect(r.effektiverSatz).toBeNull();
    expect(r.bruttoEinkommen).toBe(100000);
    expect(r.abzuege).toBe(0);
    // ohne Angabe wie bisher
    expect(bundessteuerAusSteuerbarem({ steuerbaresEinkommen: 100000 }).effektiverSatz).toBeGreaterThan(0);
  });

  it('Zeile «Jahreseinkommen» heisst in allen Sprachen eigener Nettolohn', () => {
    const lesen = (v) => (typeof v === 'string' ? [v] : [v.sie, v.du]);
    expect(lesen(sprachen.de.tax.grossIncome).every((s) => /Nettolohn/.test(s) && /(Ihr|Dein) eigener/.test(s))).toBe(true);
    expect(lesen(sprachen.fr.tax.grossIncome).every((s) => /salaire net/.test(s))).toBe(true);
    expect(lesen(sprachen.it.tax.grossIncome).every((s) => /salario netto/.test(s))).toBe(true);
    expect(lesen(sprachen.en.tax.grossIncome).every((s) => /own net salary/.test(s))).toBe(true);
    for (const [name, l] of Object.entries(sprachen)) {
      expect(l.tax.gemeinsamDirektHinweis, name).toBeTruthy();
    }
  });
});

// ─────────────────────────────────────────────────────────────
describe('K87 · Probiermodus mit abweichender Kinderzahl und eingetragenem Wert', () => {
  it('ledig 50 000 eingetragen, Profil 0 Kinder, Rechner 2 → keine Zahl, Hinweis', () => {
    const r = steuerrechner(profil({ monat: 5000, taxableIncome: 50000 }));
    expect(betraege(r.text).length).toBeGreaterThan(0);
    kinderAuswahl(r.alle).props.onChange({ target: { value: '2' } });
    const nach = texte(r.render());
    expect(betraege(nach)).toEqual([]);
    expect(nach).toContain('tax.ohneZahlKinderDirekt');
  });

  it('zurück auf die Kinderzahl aus dem Profil → rechnet wieder', () => {
    const r = steuerrechner(profil({ monat: 5000, taxableIncome: 50000, kinder: 1 }));
    kinderAuswahl(r.alle).props.onChange({ target: { value: '3' } });
    expect(betraege(texte(r.render()))).toEqual([]);
    kinderAuswahl(r.render()).props.onChange({ target: { value: '1' } });
    expect(betraege(texte(r.render())).length).toBeGreaterThan(0);
  });

  it('Häkchen entfernt (Schätzung aus dem Nettolohn): andere Kinderzahl rechnet weiter', () => {
    const r = steuerrechner(profil({ monat: 5000, taxableIncome: 50000, taxData: { useEnteredTaxable: false } }));
    kinderAuswahl(r.alle).props.onChange({ target: { value: '2' } });
    expect(betraege(texte(r.render())).length).toBeGreaterThan(0);
  });

  it('ohne Kanton: der Grund steht direkt bei der Bundessteuer', () => {
    const r = steuerrechner(profil({ canton: '', monat: 5000, taxableIncome: 50000 }));
    kinderAuswahl(r.alle).props.onChange({ target: { value: '2' } });
    expect(texte(r.render())).toContain('tax.ohneZahlKinderDirekt');
  });

  it('Regel ohne Seite: kinderDirekt für Bund und Kanton; ohne Profil-Kinderzahl keine Prüfung', () => {
    const e = { kanton: 'ZH', nettolohnJahr: 60000, direktSteuerbar: 50000, verheiratet: false, kinder: 2 };
    const abweichend = steuernFuerProfil({ ...e, direktKinder: 0 });
    expect(abweichend.bund).toBeNull();
    expect(abweichend.grund).toBe('kinderDirekt');
    expect(abweichend.kanton.kantonal).toBeNull();
    expect(abweichend.kanton.grund).toBe('kinderDirekt');
    expect(steuernFuerProfil({ ...e, direktKinder: 2 }).bund).not.toBeNull();
    expect(steuernFuerProfil(e).bund).not.toBeNull();
    expect(steuerEingabenAusDaten(profil({ monat: 5000, kinder: 2 })).direktKinder).toBe(2);
    // Zivilstand und Kinderzahl weichen ab: der Zivilstand wird zuerst genannt (K62.4)
    expect(steuernFuerProfil({ ...e, direktKinder: 0, direktVerheiratet: true }).grund).toBe('zivilstandDirekt');
  });

  it('Hinweistext in allen fünf Sprachen', () => {
    for (const [name, l] of Object.entries(sprachen)) {
      expect(l.tax.ohneZahlKinderDirekt, name).toBeTruthy();
    }
    expect(sprachen.de.tax.ohneZahlKinderDirekt).toMatch(/Kinderzahl im Profil/);
  });
});

// ─────────────────────────────────────────────────────────────
describe('K98 · Texte', () => {
  const alle = (v) => (typeof v === 'string' ? v : v.sie + ' ' + v.du);

  it('«ohne Partnereinkommen 0 eintragen» ist eindeutig (kein Einkommen der Partnerperson)', () => {
    expect(sprachen.de.tax.bandPartnerOffenDirekt).not.toMatch(/Ohne Partnereinkommen im Profil 0 eintragen/);
    expect(sprachen.de.tax.bandPartnerOffenDirekt).toMatch(/kein eigenes Einkommen/);
    expect(alle(sprachen.de.tax.ohneZahlPartnerOffen)).not.toMatch(/ohne Einkommen 0 eintragen/);
    expect(alle(sprachen.de.tax.ohneZahlPartnerOffen)).toMatch(/kein eigenes Einkommen/);
    expect(sprachen.fr.tax.bandPartnerOffenDirekt).not.toMatch(/^.*Sans revenu du ou de la partenaire, indiquer 0/);
    expect(sprachen.en.tax.bandPartnerOffenDirekt).not.toMatch(/With no partner income, enter 0/);
  });

  it('it: «qui sopra» und durchgehend «salario netto»', () => {
    expect(sprachen.it.tax.bandPartnerOffenDirekt).toMatch(/qui sopra/);
    expect(JSON.stringify(sprachen.it)).not.toMatch(/[Ss]tipendio netto/);
  });

  it('«gemeinsam» als Annahme formuliert', () => {
    expect(sprachen.de.tax.taxableIncomeDirectHint).toMatch(/nimmt Maloja eine gemeinsame Veranlagung an/);
    expect(sprachen.de.tax.bandPartnerOffenDirekt).toMatch(/nimmt an/);
    expect(sprachen.de.tax.bandPartnerOffenDirekt).not.toMatch(/mit dem eingetragenen gemeinsamen steuerbaren Einkommen/);
  });
});
