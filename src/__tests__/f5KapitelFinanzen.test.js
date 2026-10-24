import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterViewComplete, monatsUebersicht, nebenerwerbAngegeben, NEBENERWERB_FELDER } from '../ChapterView.jsx';
import { getChapters, LIGHT_PALETTE, CHAPTER_KEYS } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { DEMO_DATA } from '../config/demoData.js';
import { sumAllExpenses, sumTotalIncome } from '../utils/monatsrechnung.js';

// Fassung 5 · Kapitel Finanzen (Entscheide Stebler Studios 23.10.2026, VERGLEICH.md
// «Kapitel Finanzen · entschieden / · alle Felder / · die eingebauten Helfer», «Vor dem Bau festgelegt»).
const t = createT({ de }, 'de', 'sie');
const chapters = getChapters(t);
const kapitel = (k) => chapters.find((c) => c.key === k);
const render = (key, data, extra = {}) => renderToStaticMarkup(React.createElement(ChapterViewComplete, {
  palette: LIGHT_PALETTE, t, chapter: kapitel(key), data, allData: { ...DEMO_DATA, [key]: data },
  onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {}, ...extra,
}));
const QUELLE = fs.readFileSync(path.resolve(__dirname, '../ChapterView.jsx'), 'utf8');

describe('Kopf links und ruhig — für alle Kapitel', () => {
  it.each(CHAPTER_KEYS)('%s: Kopf links, Titel in Textfarbe, kein zentriertes Band', (key) => {
    const html = render(key, DEMO_DATA[key] || {});
    const kopf = html.match(/<div data-kapitelkopf="links"[^>]*>/);
    expect(kopf).toBeTruthy();
    expect(kopf[0]).toContain('text-align:left');
    expect(html).toContain(kapitel(key).title.replace(/&/g, '&amp;'));
    // Titel trägt die Textfarbe, nicht mehr die Bereichsfarbe
    expect(html).toMatch(new RegExp('<h2[^>]*color:' + LIGHT_PALETTE.text));
  });
});

describe('«Jeden Monat bleiben»', () => {
  it('rechnet wie der Satz «Es bleiben CHF …» (utils/monatsrechnung.js)', () => {
    const m = monatsUebersicht(DEMO_DATA.finanzen, DEMO_DATA);
    expect(m.einkommen).toBe(sumTotalIncome(DEMO_DATA.finanzen));
    expect(m.verplant).toBe(sumAllExpenses(DEMO_DATA.finanzen, DEMO_DATA));
    expect(m.bleibt).toBe(m.einkommen - m.verplant);
  });

  // Maria zahlt in die Säule 3a ein — die Budget-Rechnung weicht ab, darum steht die
  // Haushalts-Zeile darunter und die obere Zeile nennt das eigene Einkommen (Entscheid 24.10.2026).
  it('Maria: CHF 2’480, 3’720 verplant von 6’200 Einkommen, netto — wie der Satz', () => {
    const html = render('finanzen', DEMO_DATA.finanzen);
    const text = html.replace(/<[^>]+>/g, '');
    expect(text).toContain('Mit dem eigenen Einkommen bleiben jeden MonatCHF 2’480');
    expect(text).toContain('3’720 verplant');
    expect(text).toContain('von 6’200 Einkommen, netto');
    expect(text).toContain('Es bleiben CHF 2’480.');
  });

  it('Einkommen ohne Art: Zahl ohne «netto»', () => {
    const text = render('finanzen', { ...DEMO_DATA.finanzen, incomeType: '' }).replace(/<[^>]+>/g, '');
    expect(text).toContain('von 6’200 Einkommen');
    expect(text).not.toContain('Einkommen, netto');
  });

  // Entscheid 24.10.2026: bei brutto keine Zahl, die so nie auf dem Konto liegt — die Netto-Frage
  // wie auf der Budget-Seite. Vorher (Fassung 5, 23.10.) stand die Brutto-Zahl ohne «netto».
  it('Einkommen brutto: keine Zahl, sondern die Frage nach dem Netto', () => {
    const html = render('finanzen', { ...DEMO_DATA.finanzen, incomeType: 'brutto' });
    // Nur der Block — der Spiegelsatz darunter («Monatliches Einkommen …») ist eine eigene Stelle.
    const text = html.replace(/<[^>]+>/g, '').split('Monatliches Einkommen')[0];
    expect(text).toContain('Jeden Monat bleiben');
    expect(text).toContain('Ein Lohn ist als Bruttolohn erfasst');
    expect(text).not.toContain('CHF 2’480');
    expect(text).not.toContain('verplant');
    expect(html).not.toContain('data-teil="monat-haushalt"');
  });

  // Entscheid 24.10.2026: auch der Spiegelsatz nennt bei brutto keinen Rest — sonst stünde
  // «Es bleiben CHF 2’480» direkt unter der Frage nach dem Netto.
  it('Einkommen brutto: Spiegelsatz mit Einkommen und Ausgaben, ohne «Es bleiben / Es fehlen»', () => {
    const text = render('finanzen', { ...DEMO_DATA.finanzen, incomeType: 'brutto' }).replace(/<[^>]+>/g, '');
    expect(text).toContain('Monatliches Einkommen CHF 6’200');
    expect(text).toContain('Erfasste monatliche Ausgaben CHF 3’720.');
    expect(text).not.toContain('Es bleiben');
    const minus = render('finanzen', { ...DEMO_DATA.finanzen, incomeType: 'brutto', monthlyIncome: '1000' }).replace(/<[^>]+>/g, '');
    expect(minus).not.toContain('Es fehlen');
  });

  it('ohne Ausgaben: kein Block', () => {
    expect(monatsUebersicht({ monthlyIncome: '5000' }, {})).toBeNull();
  });

  // Entscheid 24.10.2026: im Minus verschwindet der Block nicht mehr (vorher: kein Betrag).
  // Die Darstellung prüft finanzenHaushaltsSaldo.test.js mit eigenen Daten.
  it('im Minus: ein Ergebnis mit negativem Rest und vollem Balken', () => {
    const m = monatsUebersicht({ monthlyIncome: '1000', monthlyTax: '2000' }, {});
    expect(m.bleibt).toBe(-1000);
    expect(m.anteil).toBe(100);
  });

  it('nur im Kapitel Finanzen', () => {
    expect(render('wohnen', DEMO_DATA.wohnen)).not.toContain('Jeden Monat bleiben');
  });
});

describe('«Passend zu diesem Bereich» und «Als Nächstes»', () => {
  it('vier Wege zu Zielen, die es in der App gibt', () => {
    const html = render('finanzen', DEMO_DATA.finanzen);
    expect(html).toContain('Passend zu diesem Bereich');
    for (const s of ['Alle Berechnungen auf einen Blick', 'Prämienverbilligung prüfen', 'Neuer Job', 'Ablauf · 5 Schritte', 'Lohnausweis ablegen']) {
      expect(html).toContain(s);
    }
  });

  it('ohne Navigation kein «Passend»', () => {
    expect(render('finanzen', DEMO_DATA.finanzen, { onNavigate: undefined })).not.toContain('Passend zu diesem Bereich');
  });

  it('die Ziele sind Ansichten, die die App wirklich zeigt (main.jsx)', () => {
    const main = fs.readFileSync(path.resolve(__dirname, '../main.jsx'), 'utf8');
    for (const v of ['neuerjob', 'premium', 'finanzuebersicht', 'tresor']) expect(main).toContain("view === '" + v + "' && React.createElement(");
  });

  it('«Als Nächstes» mit Titel, Satz und dem Weiter-Knopf', () => {
    const naechstes = kapitel('versicherungen');
    const html = render('finanzen', DEMO_DATA.finanzen, { nextChapter: naechstes, onNext: () => {} });
    const text = html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
    expect(text).toContain('Als Nächstes');
    expect(text).toContain(naechstes.description);
    expect(text).toContain('Weiter mit ' + naechstes.title);
  });

  it('andere Kapitel behalten den bisherigen Weiter-Knopf ohne «Als Nächstes»', () => {
    const html = render('wohnen', DEMO_DATA.wohnen, { nextChapter: kapitel('finanzen'), onNext: () => {} });
    expect(html).toContain('Weiter mit');
    expect(html).not.toContain('Als Nächstes');
    expect(html).not.toContain('Passend zu diesem Bereich');
  });
});

describe('Nebenerwerb — die fünf Felder erst mit Nebenerwerb', () => {
  it('ohne Angaben: eingeklappt, «falls vorhanden»', () => {
    const html = render('finanzen', DEMO_DATA.finanzen, { anfangsOffen: 'alle' });
    const zeile = html.match(/<details[^>]*data-nebenerwerb="leer"[^>]*>/);
    expect(zeile).toBeTruthy();
    expect(zeile[0]).not.toMatch(/\sopen/);
    expect(html).toContain('falls vorhanden');
  });

  it('jedes der fünf Felder mit Wert zählt als angegeben — nichts verschwindet still', () => {
    for (const k of NEBENERWERB_FELDER) {
      const wert = k === 'sideIncomeType' ? 'brutto' : '12';
      expect(nebenerwerbAngegeben({ [k]: wert })).toBe(true);
      const html = render('finanzen', { ...DEMO_DATA.finanzen, [k]: wert }, { anfangsOffen: 'alle' });
      expect(html).toMatch(/<details[^>]*data-nebenerwerb="angegeben"[^>]*open/);
    }
  });

  it('«trifft nicht zu» zählt als angegeben; leer und null nicht, 0 schon', () => {
    expect(nebenerwerbAngegeben({ _na: ['sideEmployer'] })).toBe(true);
    expect(nebenerwerbAngegeben({ sideIncome: '' })).toBe(false);
    expect(nebenerwerbAngegeben({})).toBe(false);
    expect(nebenerwerbAngegeben({ sideIncome: 0 })).toBe(true);
  });

  it('alle fünf Felder bleiben im Formular (alle 37 Felder bleiben)', () => {
    expect(kapitel('finanzen').fields).toHaveLength(37);
    const html = render('finanzen', DEMO_DATA.finanzen, { anfangsOffen: 'alle' });
    for (const k of NEBENERWERB_FELDER) {
      const label = kapitel('finanzen').fields.find((f) => f.k === k).label;
      expect(html).toContain(label.replace(/&/g, '&amp;'));
    }
  });
});

describe('Weitere Bereiche anzeigen', () => {
  it('ohne Daten in den Zusatzfeldern: eingeklappt, steuerbares Einkommen und Vorsorge verborgen', () => {
    const ohne = { ...DEMO_DATA.finanzen, pension3a: '' };
    const html = render('finanzen', ohne, { anfangsOffen: 'alle' });
    expect(html).toContain('Weitere Bereiche anzeigen');
    expect(html).not.toContain(kapitel('finanzen').fields.find((f) => f.k === 'taxableIncome').label);
    expect(html).not.toContain('Einige ausgeblendete Bereiche enthalten bereits Daten.');
  });

  it('mit Daten: startet offen («Weniger anzeigen»), die Daten stehen da', () => {
    const html = render('finanzen', DEMO_DATA.finanzen);
    expect(html).toContain('Weniger anzeigen');
    expect(html).toContain('3. Säule A eingezahlt');
  });

  it('eingeklappt mit Daten: der App-Hinweis steht beim Schalter', () => {
    expect(QUELLE).toMatch(/!showSecondary && secondaryHasData && [\s\S]{0,200}chapterView\.hasHiddenData/);
  });

  it('andere Kapitel behalten ihren eigenen Schalter', () => {
    const html = render('notfall', {});
    expect(html).toContain(t('chapterView.disclosure.notfall.more'));
  });
});

describe('Reiter «Dokumente» plus «Dokument fotografieren»', () => {
  it('zweiter Datei-Eingang mit Kamera, kein eigener Kamera-Code, nur Finanzen', () => {
    expect(QUELLE).toMatch(/istFinanzen && React\.createElement\('label', \{\s*'data-weg': 'fotografieren'/);
    expect(QUELLE).toMatch(/type: 'file', accept: 'image\/\*', capture: 'environment'/);
    expect(QUELLE).not.toMatch(/getUserMedia/);
  });

  it('der bisherige Weg bleibt: Dokumenttyp, Ablaufdatum, Datei, Hochladen, Erforderliche Dokumente', () => {
    for (const k of ['chapterView.docType', 'chapterView.expiryDate', 'chapterView.selectFile', 'chapterView.upload', 'chapterView.requiredDocs', 'chapterView.trustDocuments', 'chapterView.selectDocType', 'chapterView.selectExpiry', 'chapterView.fileTooLarge', 'chapterView.uploadError']) {
      expect(QUELLE).toContain("'" + k + "'");
    }
  });
});
