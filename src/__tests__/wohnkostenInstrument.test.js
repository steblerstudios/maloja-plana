import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { WohnkostenInstrument, wohnkostenRechnung, REGLER_MIN, REGLER_MAX } from '../components/WohnkostenInstrument.jsx';
import { DEMO_DATA } from '../config/demoData.js';
import i18nDe from '../i18n/de.js';
import i18nEn from '../i18n/en.js';
import i18nFr from '../i18n/fr.js';
import i18nIt from '../i18n/it.js';
import i18nRm from '../i18n/rm.js';

// Fassung 6 · Kapitel Wohnen (Runde 9, Entwurf Z, Entscheid Sophie 24.10.2026): Wohnkosten pro Monat
// mit Drittel-Marke, Regional-Barometer, «Ausprobieren: andere Miete». Ersetzt den Kasten
// «Wohnkosten / Einkommen / Anteil» und im Kapitel den MietVergleich (bis 24.10.2026 lag hier der
// Wächter mietVergleichImKapitelWohnen.test.js — «direkt unter dem Wohnkostenanteil»).
const QUELLE = fs.readFileSync(path.resolve(__dirname, '../ChapterView.jsx'), 'utf8');
const BAUTEIL = fs.readFileSync(path.resolve(__dirname, '../components/WohnkostenInstrument.jsx'), 'utf8');

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (wohnen, allData) => renderToStaticMarkup(React.createElement(WohnkostenInstrument, { palette, t, wohnen, allData, isDarkMode: false }));

const profil = (finanzen = {}, wohnen = {}) => ({
  basis: { canton: 'ZH', household: { adults: 1, children: [] } },
  wohnen: { rentAmount: '1650', utilities: '180', ...wohnen },
  finanzen: { monthlyIncome: '6000', incomeType: 'netto', ...finanzen },
});

describe('Kapitel Wohnen · Ort im Kapitel', () => {
  it('erst bei Bedarf geladen und nur im Kapitel Wohnen, mit dem ganzen Profil', () => {
    expect(QUELLE).toMatch(/const WohnkostenInstrument = React\.lazy\(\(\) => import\('\.\/components\/WohnkostenInstrument\.jsx'\)/);
    expect(QUELLE).toMatch(/chapter\.key === 'wohnen' && allData && React\.createElement\(React\.Suspense, \{ key: 'wohnkosten'/);
    expect(QUELLE).toMatch(/React\.createElement\(WohnkostenInstrument, \{ palette, t: tr, wohnen: data, allData, isDarkMode \}\)/);
  });

  it('oben, gleich nach der ruhigen Zusammenfassung', () => {
    const satz = QUELLE.indexOf('React.createElement(MirrorCards');
    const instrument = QUELLE.indexOf("key: 'wohnkosten'");
    expect(satz).toBeGreaterThan(-1);
    expect(instrument).toBeGreaterThan(satz);
    expect(instrument - satz).toBeLessThan(800);
  });

  it('der alte Kasten und der MietVergleich stehen nicht mehr im Kapitel — keine Doppelung', () => {
    expect(QUELLE).not.toMatch(/wohnkostenanteil\./);
    expect(QUELLE).not.toMatch(/React\.createElement\(MietVergleich/);
    for (const l of [i18nDe, i18nEn, i18nFr, i18nIt, i18nRm]) expect(l.wohnkostenanteil).toBeUndefined();
  });
});

describe('Kapitel Wohnen · Rechnung aus der einen Monatsrechnung', () => {
  it('Beispiel Maria: CHF 1’830, 29.5 % von 6’200, frei 2’459 wie im Kapitel Finanzen', () => {
    const r = wohnkostenRechnung(DEMO_DATA.wohnen, DEMO_DATA);
    expect(r.kosten).toBe(1830);
    expect(r.einkommen).toBe(6200);
    expect(r.anteil.toFixed(1)).toBe('29.5');
    expect(r.ueberDrittel).toBe(false);
    expect(Math.round(r.frei)).toBe(2459);
  });

  it('Nebenerwerb zählt zum Einkommen (eigeneEinnahmen), nicht nur der Lohn', () => {
    const r = wohnkostenRechnung(profil().wohnen, profil({ monthlyIncome: '3000', sideIncome: '1500', sideIncomeType: 'netto' }));
    expect(r.einkommen).toBe(4500);
  });

  it('der Regler ändert Hauptzahl, Drittel und «Frei verfügbar» — Franken für Franken', () => {
    const p = profil();
    const heute = wohnkostenRechnung(p.wohnen, p);
    const neu = wohnkostenRechnung(p.wohnen, p, 2400);
    expect(neu.kosten).toBe(2580);
    expect(neu.netto).toBe(2400);
    expect(neu.ueberDrittel).toBe(true);
    expect(heute.frei - neu.frei).toBe(750);
  });

  it('der Regler verändert das Profil nie', () => {
    const p = profil();
    const vorher = JSON.stringify(p);
    wohnkostenRechnung(p.wohnen, p, 3000);
    expect(JSON.stringify(p)).toBe(vorher);
    // Das Bauteil bekommt keinen Weg zum Speichern.
    expect(BAUTEIL).not.toMatch(/onUpdate|localStorage|sessionStorage/);
    expect(QUELLE).not.toMatch(/WohnkostenInstrument, \{[^}]*onUpdate/);
  });

  it('Lohn brutto: keine «Frei verfügbar»-Zahl, sondern die Netto-Frage', () => {
    const p = profil({ incomeType: 'brutto' });
    expect(wohnkostenRechnung(p.wohnen, p).frei).toBeNull();
    const html = render(p.wohnen, p);
    expect(html).toContain('budgetSync.availableNeedsNetto');
    expect(html).not.toContain('wohnenInstrument.freiDanach');
    expect(html).toContain('wohnenInstrument.anteilBrutto');
  });
});

describe('Kapitel Wohnen · Anzeige', () => {
  it('unter einem Drittel: Faustregel-Satz, über einem Drittel: «Mehr als ein Drittel» in Sand', () => {
    const unten = render(profil().wohnen, profil());
    expect(unten).toContain('wohnenInstrument.faustregel');
    expect(unten).toContain('wohnenInstrument.titel');
    const p = profil({ monthlyIncome: '4000' });
    const oben = render(p.wohnen, p);
    expect(oben).toContain('wohnenInstrument.mehrAlsDrittel');
  });

  it('Barometer «Miete regional vs. Schweiz» mit dem Kanton, ohne zweites Drittel-«!»', () => {
    const html = render(profil().wohnen, profil());
    expect(html).toContain('po.regionalCompare.rent.title');
    expect(BAUTEIL).not.toMatch(/thresholdValue/);
  });

  it('Regler 800–3’500 in Schritten, aufklappbar, mit Hinweis «nichts gespeichert»', () => {
    expect(REGLER_MIN).toBe(800);
    expect(REGLER_MAX).toBe(3500);
    const html = render(profil().wohnen, profil());
    expect(html).toMatch(/<details[^>]*data-teil="miete-ausprobieren"/);
    expect(html).toMatch(/type="range"[^>]*min="800"[^>]*max="3500"/);
    expect(html).toContain('wohnenInstrument.durchspielen');
    expect(html).toContain('wohnenInstrument.freiDanach');
  });

  it('leer: ohne Wohnkosten nichts; ohne Einkommen die Hauptzahl und ein ruhiger Satz', () => {
    expect(render({}, profil({}, { rentAmount: '', utilities: '' }))).toBe('');
    const p = profil({ monthlyIncome: '' });
    const html = render(p.wohnen, p);
    expect(html).toContain('wohnenInstrument.ohneEinkommen');
    expect(html).not.toContain('drittel-balken');
    expect(html).not.toContain('wohnenInstrument.freiDanach');
  });

  it('ohne Kanton kein Barometer, der Rest bleibt', () => {
    const p = profil();
    p.basis.canton = '';
    const html = render(p.wohnen, p);
    expect(html).not.toContain('po.regionalCompare.rent.title');
    expect(html).toContain('drittel-balken');
  });

  it('Drittel nie als Regel oder Recht ausgegeben (Swiss-Precision): «Faustregel» in jeder Sprache', () => {
    expect(i18nDe.wohnenInstrument.faustregel).toMatch(/Faustregel/);
    expect(i18nDe.wohnenInstrument.mehrAlsDrittel.sie).toMatch(/Faustregel, keine Vorschrift/);
    for (const l of [i18nDe, i18nEn, i18nFr, i18nIt, i18nRm]) {
      const alles = JSON.stringify(l.wohnenInstrument);
      expect(alles).not.toMatch(/Vermieter|landlord|bailleur|locator|locatur/i);
    }
  });
});
