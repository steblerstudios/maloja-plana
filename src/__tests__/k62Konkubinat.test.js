import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';

// ─────────────────────────────────────────────────────────────
// K62 Punkt 1 und 5 (Bau-Liste §15/§21, Oktober-Punkte) — Konkubinat.
//   1. Konkubinat ohne Kinder: Bundessteuer UND Kantons-/Gemeindesteuer auf dem eigenen Einkommen
//      (Einzelbesteuerung, DBG Art. 9 Abs. 1/1bis, StHG Art. 3 Abs. 3/4), die Annahme sichtbar.
//      Vorher: Bundessteuer ja, Kanton «keine Zahl», sobald ein Partnereinkommen > 0 erfasst war.
//      Ausnahme belegt am ESTV-Steuerrechner (Zivilstand «Konkubinat» gegen «ledig»): BE, JU und VS
//      (VS nur bis Brutto 45 000) rechnen Konkubinat anders → dort weiter keine Kantonszahl.
//   5. Zivilstand-Vergleich: im Konkubinat mit Partnereinkommen (oder ohne Angabe) kein Vergleich mit
//      einem gedachten Alleinverdiener-Ehepaar. Vorher (ZH, Nettolohn 71 883, Partner 5 000/Mt.):
//      «verheiratet CHF 452, rund 454 weniger als ledig» — die ESTV rechnet das Ehepaar mit beiden
//      Einkommen (80 000 + 60 000 brutto) mit CHF 1 881 Bundessteuer, einzeln zusammen 1 317.
//
// Erwartungen aus den Messdateien des ESTV-Steuerrechners 2026, nicht aus dem eigenen Code:
//   docs/sources/konkubinat-kantonssteuer-2026.messpunkte.json   Konkubinat gegen ledig, 26 Kantone
//   docs/sources/nettolohn-abzuege-2026.messpunkte.json           Brutto → Nettolohn
// ─────────────────────────────────────────────────────────────

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
const { KantonssteuerOrientierung, orientierungsText } = await import('../components/KantonssteuerOrientierung.jsx');
const { SteuerSaeulen } = await import('../components/SteuerSaeulen.jsx');
const { generateBehoerdenJSON, STEUER_KENNUNG } = await import('../dossierGenerator.js');
const { annahmenTexte } = await import('../utils/steuerTexte.js');
const {
  steuernFuerProfil, steuerEingabenAusDaten, tarifvergleichFuerProfil, tarifvergleichGrund,
  imKonkubinat, KONKUBINAT_WIE_LEDIG_AB,
} = await import('../data/kantonaleSteuerdaten.js');

const lies = (datei) => JSON.parse(readFileSync(new URL('../../docs/sources/' + datei, import.meta.url), 'utf-8'));
const messung = lies('konkubinat-kantonssteuer-2026.messpunkte.json');
const NETTO = new Map(lies('nettolohn-abzuege-2026.messpunkte.json').punkte.map((p) => [p[0], p[1]]));
// [kanton, brutto, steuerbarBundKonk, bundKonk, kgKonk, steuerbarBundLedig, bundLedig, kgLedig, quelle]
const punkt = (kt, brutto) => messung.punkte.find((p) => p[0] === kt && p[1] === brutto);
const KANTONE = [...new Set(messung.punkte.map((p) => p[0]))];
const imRahmen = (wert, soll) => Math.abs(wert - soll) <= Math.max(0.03 * soll, 50);

const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });

// partnerIncome: nicht gesetzt = nie beantwortet
const profil = ({ canton = 'ZH', brutto = 80000, status = 'cohabiting', adults = 2, kinder = 0, partnerIncome, taxData } = {}) => ({
  basis: {
    canton, maritalStatus: status,
    household: { adults, children: Array.from({ length: kinder }, () => ({ age: 8 })), ...(partnerIncome !== undefined ? { partnerIncome } : {}) },
  },
  finanzen: { monthlyIncome: NETTO.get(brutto) / 12, dreizehnter: 'no' },
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
  const render = () => { zustand.i = 0; zustand.effekte = []; return knoten(TaxCalculator({ palette, t, data, onSave: () => {}, onNavigate: () => {} })); };
  render();
  zustand.effekte.forEach((fn) => fn());
  const alle = render();
  return { alle, text: texte(alle), saeulen: alle.some((k) => k.type === SteuerSaeulen), render };
};

describe('Messung · ESTV rechnet Konkubinat einzeln', () => {
  it('Messdatei: 26 Kantone × 68 Bruttolöhne, Gegenprobe gescheitert wie erwartet', () => {
    expect(KANTONE).toHaveLength(26);
    expect(messung.punkte).toHaveLength(26 * 68);
    expect(messung.gegenprobe).toBe('erfundene Operation → fehlgeschlagen wie erwartet');
  });

  it('Bund: steuerbares Einkommen und Bundessteuer im Konkubinat überall wie ledig', () => {
    for (const p of messung.punkte) {
      expect(p[2], p[0] + ' ' + p[1]).toBe(p[5]);
      expect(Math.abs(p[3] - p[6]), p[0] + ' ' + p[1]).toBeLessThanOrEqual(1);
    }
  });

  it('das zweite Einkommen ändert im Konkubinat nichts (104 Punkte), im Ehepaar schon (Kontrolle)', () => {
    const z = messung.zweitesEinkommen;
    expect(z.zeilen).toHaveLength(104);
    for (const zeile of z.zeilen) {
      // ok|DIFF kanton brutto · steuerbar ledig/konk0/konk60k · Bund ledig/0/60k · K+G ledig/0/60k · …
      const [, , , , s0, s6, , b0, b6, , k0, k6] = zeile.split(/\s+/);
      expect([s0, b0, k0], zeile).toEqual([s6, b6, k6]);
    }
    const [, vorher, nachher] = z.kontrolleVerheiratet.match(/(\d+) (\d+)$/);
    expect(Number(nachher)).toBeGreaterThan(Number(vorher));
  });

  it('Kanton: KONKUBINAT_WIE_LEDIG_AB deckt genau die Punkte ab, an denen Konkubinat von ledig abweicht', () => {
    for (const p of messung.punkte) {
      const weichtAb = Math.abs(p[4] - p[7]) > 1;
      const gesperrt = !(p[2] >= (KONKUBINAT_WIE_LEDIG_AB[p[0]] ?? 0));
      if (weichtAb) expect(gesperrt, p[0] + ' ' + p[1]).toBe(true);
    }
    // und sperrt nicht mehr als nötig: VS ab dem ersten gleichen Punkt nach der letzten Abweichung
    expect(Object.keys(KONKUBINAT_WIE_LEDIG_AB).sort()).toEqual(['BE', 'JU', 'VS']);
    expect(punkt('VS', 45000)[4]).not.toBe(punkt('VS', 45000)[7]);
    expect(punkt('VS', 47500)[2]).toBe(KONKUBINAT_WIE_LEDIG_AB.VS);
    expect(punkt('VS', 47500)[4]).toBe(punkt('VS', 47500)[7]);
  });
});

describe('K62.1 · Konkubinat ohne Kinder bekommt eine Kantonszahl', () => {
  it.each(KANTONE)('%s, Brutto 80 000, Partnereinkommen 4 000: Zahl wie ESTV «Konkubinat» — oder begründet keine', (kt) => {
    const [, , steuerbar, bund, kg] = punkt(kt, 80000);
    const s = regel(profil({ canton: kt, partnerIncome: '4000' }));
    expect(s.steuerbar).toBe(steuerbar);
    expect(Math.abs(s.bund.steuer - bund)).toBeLessThanOrEqual(1);
    expect(s.annahmen.einzeln).toBe(true);
    if (kt === 'BE' || kt === 'JU') {
      expect(s.kanton).toMatchObject({ lage: 'ungeprueft', kantonal: null, grund: 'konkubinatKanton' });
    } else {
      expect(s.kanton.lage).toBe('innerhalb');
      expect(imRahmen(s.kanton.kantonal.kantonalUndGemeinde, kg), kt + ': ' + s.kanton.kantonal.kantonalUndGemeinde + ' gegen ESTV ' + kg).toBe(true);
    }
  });

  it('VS unter der Schwelle (Brutto 40 000): keine Kantonszahl; darüber (Brutto 80 000) eine', () => {
    expect(regel(profil({ canton: 'VS', brutto: 40000, partnerIncome: '4000' })).kanton.grund).toBe('konkubinatKanton');
    expect(regel(profil({ canton: 'VS', brutto: 80000, partnerIncome: '4000' })).kanton.lage).toBe('innerhalb');
  });

  it('im Profil «Konkubinat» ohne Partnerangabe: dieselbe Regel (ZH Zahl, BE keine), Annahme sichtbar', () => {
    const zh = regel(profil({ partnerIncome: undefined }));
    expect(zh.kanton.lage).toBe('innerhalb');
    expect(zh.annahmen.einzeln).toBe(true);
    expect(regel(profil({ canton: 'BE', partnerIncome: undefined })).kanton.grund).toBe('konkubinatKanton');
  });

  it('ledig ohne Partner: unverändert — Zahl auch in BE, keine Konkubinat-Annahme', () => {
    const be = regel(profil({ canton: 'BE', status: 'single', adults: 1 }));
    expect(be.kanton.lage).toBe('innerhalb');
    expect(imRahmen(be.kanton.kantonal.kantonalUndGemeinde, punkt('BE', 80000)[7])).toBe(true);
    expect(be.annahmen.einzeln).toBe(false);
  });

  it('verheiratet mit Partnereinkommen und Konkubinat mit Kindern: weiter keine Zahl (nicht gemessen)', () => {
    expect(regel(profil({ status: 'married', partnerIncome: '4000' })).kanton.grund).toBe('partner');
    const mitKind = regel(profil({ partnerIncome: '4000', kinder: 1, taxData: { elterntarif: true } }));
    expect(mitKind.bund).toBeNull();
    expect(mitKind.kanton.grund).toBe('partner');
  });

  it('imKonkubinat: verheiratet nie; sonst Profil «Konkubinat» oder Partnereinkommen > 0', () => {
    expect(imKonkubinat({ verheiratet: true, konkubinat: true, partnerEinkommen: 5 })).toBe(false);
    expect(imKonkubinat({ konkubinat: true })).toBe(true);
    expect(imKonkubinat({ partnerEinkommen: 1 })).toBe(true);
    expect(imKonkubinat({ partnerEinkommen: 0 })).toBe(false);
    expect(imKonkubinat()).toBe(false);
  });

  it('die Annahme erscheint als Satz, im Steuerrechner und in der Dossier-Datei (Kennung neu, alte unverändert)', () => {
    expect(annahmenTexte(t, { einzeln: true })).toEqual(['tax.annahmeEinzeln']);
    const p = profil({ partnerIncome: '4000' });
    expect(steuerrechner(p).text).toContain('tax.annahmeEinzeln');
    const s = regel(p);
    const json = generateBehoerdenJSON(p, { tax: { total: s.bund.steuer, annahmen: s.annahmen, kantonal: s.kanton.kantonal, basis: 'estv' } }, t).calculations.tax;
    expect(json.assumptions).toContainEqual({ code: 'einzeln_konkubinat', text: 'behoerdenDossier.jsonTexte.annahmeEinzeln' });
    expect(STEUER_KENNUNG).toMatchObject({ annahmeOhneDreizehnten: 'ohne_13_monatslohn', annahmeAlleinverdiener: 'alleinverdiener_ehepaar', annahmeEinzeln: 'einzeln_konkubinat' });
  });

  it('BE: Orientierung nennt den Grund, die Bundessteuer bleibt', () => {
    const s = regel(profil({ canton: 'BE', partnerIncome: '4000' }));
    expect(orientierungsText(t, s.kanton, 2026)).toBe('tax.bandKonkubinat');
    const v = steuerrechner(profil({ canton: 'BE', partnerIncome: '4000' }));
    expect(v.text).toContain('tax.bandKonkubinat');
    expect(v.text).toContain('~ CHF ' + s.bund.steuer);
  });
});

describe('K62.5 · Zivilstand-Vergleich im Konkubinat', () => {
  it('mit Partnereinkommen: kein Vergleich (vorher: gedachtes Alleinverdiener-Ehepaar, CHF 454 «günstiger»)', () => {
    const e = steuerEingabenAusDaten(profil({ partnerIncome: '5000' }));
    expect(tarifvergleichFuerProfil(e)).toBeNull();
    expect(tarifvergleichGrund(e)).toBe('konkubinatPartner');
    const v = steuerrechner(profil({ partnerIncome: '5000' }));
    expect(v.saeulen).toBe(false);
    expect(v.text).toContain('tax.saeulen.konkubinatPartner');
    expect(v.text).not.toContain('tax.saeulen.nurGeschaetzt');
  });

  it('Partnerangabe fehlt: kein Vergleich, mit dem Weg zur Angabe', () => {
    const e = steuerEingabenAusDaten(profil({ partnerIncome: undefined }));
    expect(tarifvergleichGrund(e)).toBe('konkubinatPartnerOffen');
    const v = steuerrechner(profil({ partnerIncome: '' }));
    expect(v.saeulen).toBe(false);
    expect(v.text).toContain('tax.saeulen.konkubinatPartnerOffen');
  });

  it('bewusst 0: Vergleich wie gemessen (Alleinverdiener-Ehepaar)', () => {
    const e = steuerEingabenAusDaten(profil({ partnerIncome: '0' }));
    expect(tarifvergleichGrund(e)).toBeNull();
    expect(tarifvergleichFuerProfil(e)).toMatchObject({ alleinstehend: 906, steuerBaresEinkommenVerheiratet: 63227 });
    expect(steuerrechner(profil({ partnerIncome: '0' })).saeulen).toBe(true);
  });

  it('ledig ohne zweite Person: Vergleich unverändert', () => {
    const e = steuerEingabenAusDaten(profil({ status: 'single', adults: 1 }));
    expect(tarifvergleichGrund(e)).toBeNull();
    expect(tarifvergleichFuerProfil(e)).toMatchObject({ alleinstehend: 906, verheiratet: 452 });
  });

  it('der Probiermodus «verheiratet» öffnet den Vergleich im Konkubinat nicht (Profil zählt)', () => {
    const e = { ...steuerEingabenAusDaten(profil({ partnerIncome: undefined })), verheiratet: true, partnerAngegeben: true, partnerAngegebenProfil: false };
    expect(tarifvergleichGrund(e)).toBe('konkubinatPartnerOffen');
  });

  // K62-Nachlauf D (K62 Punkt 4): im Profil Konkubinat, Partnerangabe fehlt, im Steuerrechner
  // «verheiratet» angekreuzt. Vorher: gerechnet als Alleinverdiener-Ehepaar (gekennzeichnet) — obwohl
  // eine Partnerin oder ein Partner im Haushalt lebt und das Einkommen offen ist. Jetzt wie im echten
  // Profil «verheiratet» ohne Angabe: keine Zahl, «Angabe fehlt».
  it('Probiermodus «verheiratet» im Konkubinat ohne Partnerangabe: «Angabe fehlt», kein Alleinverdiener-Ehepaar', () => {
    for (const partnerIncome of [undefined, '']) {
      const r = steuerrechner(profil({ partnerIncome }));
      const box = r.alle.find((k) => k.props.type === 'checkbox' && k.props.checked === false && typeof k.props.onChange === 'function');
      box.props.onChange({ target: { checked: true } });
      const nach = texte(r.render());
      expect(nach, String(partnerIncome)).toContain('tax.ohneZahlPartnerOffen');
      expect(nach, String(partnerIncome)).not.toContain('tax.annahmeAlleinverdiener');
    }
  });

  it('Probiermodus «verheiratet» im Konkubinat mit bewusst 0: gerechnet wie gemessen (Alleinverdiener)', () => {
    const r = steuerrechner(profil({ partnerIncome: '0' }));
    const box = r.alle.find((k) => k.props.type === 'checkbox' && k.props.checked === false && typeof k.props.onChange === 'function');
    box.props.onChange({ target: { checked: true } });
    const nach = texte(r.render());
    expect(nach).toContain('tax.annahmeAlleinverdiener');
    expect(nach).not.toContain('tax.ohneZahlPartnerOffen');
  });

  it('ein eingetragener Wert: weiter der alte Hinweis', () => {
    const e = steuerEingabenAusDaten({ ...profil({ status: 'single', adults: 1 }), finanzen: { monthlyIncome: 6000, taxableIncome: 60000 } });
    expect(tarifvergleichGrund(e)).toBe('geschaetzt');
  });
});
