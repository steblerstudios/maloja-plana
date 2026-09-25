import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ERGEBNIS_ART, ERGEBNIS_ARTEN, ergebnis, ergebnisSatz, fehlendeAngaben, istErgebnisArt } from '../data/ergebnisArt.js';
import { alvErgebnis } from '../data/alvRechner.js';
import { getMietzinsbeitraege, mietzinsErgebnis } from '../data/mietzinsbeitraege.js';
import { PFLEGE_ENTLOEHNUNG_ERGEBNIS, PflegeEntloehnung } from '../PflegeEntloehnung.jsx';
import { AlvRechner } from '../AlvRechner.jsx';
import { MietzinsOrientierung } from '../MietzinsOrientierung.jsx';
import { eoErgebnis } from '../data/eoRechner.js';
import { sozialhilfeErgebnis } from '../data/sozialhilfeRechner.js';
import { stipendienErgebnis } from '../data/stipendienData.js';
import { lohnEinordnungErgebnis } from '../data/lohnEinordnung.js';
import { EOrechner } from '../EOrechner.jsx';
import { SozialhilfeRechner } from '../SozialhilfeRechner.jsx';
import { KKLastCard, KK_LAST_ERGEBNIS } from '../KKLastCard.jsx';
import { StipendienView } from '../StipendienView.jsx';
import { LohnEinordnung } from '../components/LohnEinordnung.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import itTexte from '../i18n/it.js'; // nicht `it` — kollidiert mit vitest it()
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// ─────────────────────────────────────────────────────────────
// O3 · Ergebnis-Art als festes Feld.
// Geprüft wird die ZUSAGE, nicht die Schreibweise:
//   1. Jeder umgestellte Rechner meldet eine der vier Arten — an der Aufrufstelle, im gerenderten
//      Markup, nicht nur in seiner reinen Funktion (ein Wächter nur an der Funktion hätte eine
//      Aufrufstelle, die das Feld wegwirft, nicht bemerkt).
//   2. Fehlen Angaben, steht ihre Zahl da — in jeder Sprache.
//   3. Kein umgestellter Rechner nennt sich «Berechnung» (Wahrheits-Disziplin, Stand 24.09.2026).
// ─────────────────────────────────────────────────────────────

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const tStub = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (C, props) => renderToStaticMarkup(React.createElement(C, { palette, t: tStub, onNavigate: () => {}, ...props }));

// Alle Ergebnis-Art-Zeilen im Markup: [{ art, fehlend }]
const artZeilen = (html) => [...html.matchAll(/data-ergebnis-art="([^"]*)" data-fehlend="(\d+)"/g)]
  .map((m) => ({ art: m[1], fehlend: Number(m[2]) }));

const leer = { basis: {}, finanzen: {}, wohnen: {}, versicherungen: {} };

describe('O3 · das Feld selbst', () => {
  it('kennt genau vier Arten, von genau bis vorsichtig', () => {
    expect(ERGEBNIS_ARTEN).toEqual(['berechnung', 'schaetzung', 'vorpruefung', 'orientierung']);
    for (const a of ERGEBNIS_ARTEN) expect(istErgebnisArt(a)).toBe(true);
  });

  it('eine unbekannte Art fällt laut aus, statt still auszuweichen', () => {
    expect(() => ergebnis('ungefaehr')).toThrow(TypeError);
    expect(() => ergebnis(undefined)).toThrow(TypeError);
  });

  it('zählt fehlende Angaben, jede nur einmal', () => {
    expect(ergebnis(ERGEBNIS_ART.SCHAETZUNG, { fehlend: ['a', 'b', 'a', null] }).fehlend).toEqual(['a', 'b']);
    expect(fehlendeAngaben({ a: true, b: false, c: 0, d: 'x' })).toEqual(['b', 'c']);
  });

  it('der Satz trägt die Zahl der fehlenden Angaben — in allen fünf Sprachen', () => {
    const sprachen = { de, fr, it: itTexte, en, rm };
    for (const [lang, texte] of Object.entries(sprachen)) {
      const t = createT({ [lang]: texte, de }, lang, 'sie');
      for (const art of ERGEBNIS_ARTEN) {
        const ohne = ergebnisSatz(ergebnis(art), t);
        const drei = ergebnisSatz(ergebnis(art, { fehlend: ['a', 'b', 'c'] }), t);
        const eine = ergebnisSatz(ergebnis(art, { fehlend: ['a'] }), t);
        // Kein roher Schlüssel, kein offener Platzhalter.
        for (const s of [ohne, eine, drei]) {
          expect(s, `${lang}/${art}`).not.toMatch(/ergebnisArt\.|\{/);
        }
        expect(drei, `${lang}/${art}: die Zahl 3 fehlt`).toMatch(/\b3\b/);
        expect(ohne, `${lang}/${art}: ohne Fehlende keine Zahl`).not.toMatch(/\d/);
        // Die fehlende Angabe verlängert den Satz — sie wird gesagt, nicht verschluckt.
        expect(eine.length, `${lang}/${art}`).toBeGreaterThan(ohne.length);
      }
    }
  });
});

describe('O3 · ALV-Rechner (Schätzung)', () => {
  it('reine Funktion: immer Schätzung, fehlend = was das Ergebnis verändert', () => {
    for (const bruttolohn of [0, 6000]) for (const beitragsmonate of [0, 14]) for (const alter of [null, 40]) {
      const e = alvErgebnis({ bruttolohn, beitragsmonate, alter });
      expect(e.art).toBe(ERGEBNIS_ART.SCHAETZUNG);
      const erwartet = (bruttolohn ? 0 : 1) + (beitragsmonate ? 0 : 1) + (alter == null ? 1 : 0);
      expect(e.fehlend.length).toBe(erwartet);
    }
  });

  it('Aufrufstelle: ohne Angaben meldet der Rechner seine Art und drei fehlende', () => {
    const zeilen = artZeilen(render(AlvRechner, { data: leer }));
    expect(zeilen).toHaveLength(1);
    expect(istErgebnisArt(zeilen[0].art)).toBe(true);
    expect(zeilen[0]).toEqual({ art: 'schaetzung', fehlend: 3 });
  });

  it('Aufrufstelle: mit Lohn und Geburtsdatum fehlen nur noch die Beitragsmonate', () => {
    const data = { ...leer, basis: { dateOfBirth: '1986-03-01' }, finanzen: { monthlyIncome: 6000, incomeType: 'brutto' } };
    expect(artZeilen(render(AlvRechner, { data }))).toEqual([{ art: 'schaetzung', fehlend: 1 }]);
  });
});

describe('O3 · Mietzinsbeiträge (Vorprüfung)', () => {
  const KANTONE = ['AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'];

  it('reine Funktion: wo geprüft wird, nie ein Betrag — also nie Berechnung oder Schätzung', () => {
    const SCHLUESSEL = ['familiesOnly', 'effortBased', 'municipalLimit', 'needIncome', 'incomeHigh', 'likely'];
    let geprueft = 0;
    for (const k of KANTONE) for (const assessmentKey of SCHLUESSEL) {
      const info = getMietzinsbeitraege(k);
      const e = mietzinsErgebnis({ info, assessmentKey, annualIncome: 30000 });
      if (info.state !== 'has') { expect(e, k).toBeNull(); continue; }
      geprueft++;
      expect([ERGEBNIS_ART.VORPRUEFUNG, ERGEBNIS_ART.ORIENTIERUNG], k).toContain(e.art);
    }
    expect(geprueft, 'Gegenprobe: mindestens ein Kanton wird wirklich geprüft').toBeGreaterThan(0);
  });

  it('Aufrufstelle: ohne Kanton und Einkommen wartet die Vorprüfung auf zwei Angaben', () => {
    expect(artZeilen(render(MietzinsOrientierung, { data: leer }))).toEqual([{ art: 'vorpruefung', fehlend: 2 }]);
  });

  it('Aufrufstelle: Basel-Stadt ohne Einkommen — noch eine Angabe; mit Einkommen — keine', () => {
    const bs = { ...leer, basis: { canton: 'BS' } };
    expect(artZeilen(render(MietzinsOrientierung, { data: bs }))).toEqual([{ art: 'vorpruefung', fehlend: 1 }]);
    const mit = { ...bs, finanzen: { monthlyIncome: 8000 } };
    expect(artZeilen(render(MietzinsOrientierung, { data: mit }))).toEqual([{ art: 'vorpruefung', fehlend: 0 }]);
  });

  it('Aufrufstelle: Genf prüft nichts (Orientierung), ein Kanton ohne Programm zeigt keine Art', () => {
    const ge = { ...leer, basis: { canton: 'GE' }, finanzen: { monthlyIncome: 4000 } };
    expect(artZeilen(render(MietzinsOrientierung, { data: ge }))).toEqual([{ art: 'orientierung', fehlend: 0 }]);
    const ohne = KANTONE.find((k) => getMietzinsbeitraege(k).state !== 'has');
    const html = render(MietzinsOrientierung, { data: { ...leer, basis: { canton: ohne }, finanzen: { monthlyIncome: 4000 } } });
    expect(artZeilen(html), ohne).toEqual([]);
  });
});

describe('O3 · Pflege-Entlöhnung (Orientierung)', () => {
  it('Anbieter-Richtwert mal Stunden ist Orientierung, ohne fehlende Angabe — auch an der Aufrufstelle', () => {
    expect(PFLEGE_ENTLOEHNUNG_ERGEBNIS.art).toBe(ERGEBNIS_ART.ORIENTIERUNG);
    expect(artZeilen(render(PflegeEntloehnung, {}))).toEqual([{ art: 'orientierung', fehlend: 0 }]);
  });
});

describe('O3 · EO-Rechner (Schätzung, Fachprüfung 24.09.2026)', () => {
  it('reine Funktion: Schätzung; es fehlt nur das Einkommen, sonst nichts', () => {
    expect(eoErgebnis({ einkommen: 0 })).toEqual({ art: 'schaetzung', fehlend: ['bruttolohn'] });
    expect(eoErgebnis({ einkommen: 80000 }).fehlend).toEqual([]);
  });
  it('Aufrufstelle: ohne Lohn eine fehlende Angabe, mit Bruttolohn keine', () => {
    expect(artZeilen(render(EOrechner, { data: leer }))).toEqual([{ art: 'schaetzung', fehlend: 1 }]);
    const data = { ...leer, finanzen: { monthlyIncome: 6000, incomeType: 'brutto' } };
    expect(artZeilen(render(EOrechner, { data }))).toEqual([{ art: 'schaetzung', fehlend: 0 }]);
  });
  it('die Quellenzeile nennt sich in keiner Sprache mehr «Berechnung»', () => {
    for (const [lang, texte] of Object.entries({ de, fr, it: itTexte, en, rm })) {
      expect(texte.eo.source, lang).not.toMatch(/^(Berechnung|Calcul|Calcolo|Calculation|Calculaziun)/);
      expect(texte.sh.source, lang).not.toMatch(/^(Berechnung|Calcul|Calcolo|Calculation|Calculaziun)/);
    }
  });
});

describe('O3 · SKOS-Rechner (Schätzung, Fachprüfung 24.09.2026)', () => {
  it('reine Funktion: ein leeres Feld fehlt, eine eingetragene 0 ist eine Antwort', () => {
    const alleLeer = sozialhilfeErgebnis({ miete: '', kvgPraemie: '', erwerbseinkommen: '', vermoegen: '', kanton: '' });
    expect(alleLeer.art).toBe(ERGEBNIS_ART.SCHAETZUNG);
    expect(alleLeer.fehlend).toEqual(['miete', 'kvgPraemie', 'erwerbseinkommen', 'vermoegen']);
    const nullen = sozialhilfeErgebnis({ miete: '1200', kvgPraemie: '400', erwerbseinkommen: '0', vermoegen: '0', kanton: '' });
    expect(nullen.fehlend).toEqual([]);
  });
  it('reine Funktion: der Kanton fehlt nur, wenn Vermögen erfasst ist', () => {
    const basis = { miete: '1200', kvgPraemie: '400', erwerbseinkommen: '0' };
    expect(sozialhilfeErgebnis({ ...basis, vermoegen: '20000', kanton: '' }).fehlend).toEqual(['kanton']);
    expect(sozialhilfeErgebnis({ ...basis, vermoegen: '20000', kanton: 'ZH' }).fehlend).toEqual([]);
  });
  it('Aufrufstelle: ohne Angaben vier fehlende; mit Miete, Prämie, Lohn, Vermögen und Kanton keine', () => {
    expect(artZeilen(render(SozialhilfeRechner, { data: leer }))).toEqual([{ art: 'schaetzung', fehlend: 4 }]);
    const data = {
      basis: { canton: 'ZH', household: { adults: 1, children: [] } },
      wohnen: { rentAmount: 1200 },
      versicherungen: { kkPremium: 400 },
      finanzen: { monthlyIncome: 1500, incomeType: 'netto', savingsAccount: 2000 },
    };
    const zeilen = artZeilen(render(SozialhilfeRechner, { data }));
    expect(zeilen).toHaveLength(1);
    expect(zeilen[0].art).toBe('schaetzung');
    expect(zeilen[0].fehlend).toBe(0);
  });
});

describe('O3 · KK-Last (Orientierung)', () => {
  it('mit Prämie und Einkommen: Orientierung ohne fehlende Angabe; ohne: keine Karte, keine Zeile', () => {
    expect(KK_LAST_ERGEBNIS.art).toBe(ERGEBNIS_ART.ORIENTIERUNG);
    const data = { ...leer, basis: { canton: 'ZH' }, finanzen: { monthlyIncome: 4000 }, versicherungen: { kkPremium: 450 } };
    expect(artZeilen(render(KKLastCard, { data }))).toEqual([{ art: 'orientierung', fehlend: 0 }]);
    expect(artZeilen(render(KKLastCard, { data: leer }))).toEqual([]);
  });
});

describe('O3 · Stipendien-Kurzcheck (Vorprüfung)', () => {
  it('reine Funktion: zählt die offenen Fragen des Checks', () => {
    expect(stipendienErgebnis({ status: '', scope: '' })).toEqual({ art: 'vorpruefung', fehlend: ['status', 'scope'] });
    expect(stipendienErgebnis({ status: 'swiss', scope: '' }).fehlend).toEqual(['scope']);
    expect(stipendienErgebnis({ status: 'swiss', scope: 'tertiaer' }).fehlend).toEqual([]);
  });
  it('Aufrufstelle: vor der ersten Antwort Vorprüfung mit zwei offenen Fragen', () => {
    expect(artZeilen(render(StipendienView, { data: leer }))).toEqual([{ art: 'vorpruefung', fehlend: 2 }]);
  });
});

describe('O3 · Lohn-Einordnung (Orientierung)', () => {
  it('reine Funktion: Einkommen, Einkommensart, Wochenstunden', () => {
    expect(lohnEinordnungErgebnis({}).fehlend).toEqual(['einkommen', 'einkommensart', 'wochenstunden']);
    expect(lohnEinordnungErgebnis({ income: 6000, incomeType: 'brutto', hoursPerWeek: 42 })).toEqual({ art: 'orientierung', fehlend: [] });
  });
  it('Aufrufstelle: in allen drei Zuständen genau eine Zeile mit der richtigen Zahl', () => {
    expect(artZeilen(render(LohnEinordnung, { data: leer }))).toEqual([{ art: 'orientierung', fehlend: 3 }]);
    const ohneStunden = { ...leer, basis: { canton: 'ZH' }, finanzen: { monthlyIncome: 6000, incomeType: 'brutto' } };
    expect(artZeilen(render(LohnEinordnung, { data: ohneStunden }))).toEqual([{ art: 'orientierung', fehlend: 1 }]);
    const voll = { ...ohneStunden, ausbildung: { workHoursPerWeek: 42 } };
    expect(artZeilen(render(LohnEinordnung, { data: voll }))).toEqual([{ art: 'orientierung', fehlend: 0 }]);
  });
});

describe('O3 · Wahrheits-Disziplin', () => {
  it('kein umgestellter Rechner nennt sich «Berechnung»', () => {
    const faelle = [
      alvErgebnis({ bruttolohn: 6000, beitragsmonate: 20, alter: 40 }),
      PFLEGE_ENTLOEHNUNG_ERGEBNIS,
      mietzinsErgebnis({ info: getMietzinsbeitraege('BS'), assessmentKey: 'likely', annualIncome: 30000 }),
      mietzinsErgebnis({ info: getMietzinsbeitraege('GE'), assessmentKey: 'effortBased', annualIncome: 30000 }),
      eoErgebnis({ einkommen: 80000 }),
      sozialhilfeErgebnis({ miete: '1200', kvgPraemie: '400', erwerbseinkommen: '0', vermoegen: '0' }),
      KK_LAST_ERGEBNIS,
      stipendienErgebnis({ status: 'swiss', scope: 'tertiaer' }),
      lohnEinordnungErgebnis({ income: 6000, incomeType: 'brutto', hoursPerWeek: 42 }),
    ];
    for (const e of faelle) expect(e.art).not.toBe(ERGEBNIS_ART.BERECHNUNG);
  });
});
