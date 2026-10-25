import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { WohnkostenInstrument, wohnkostenRechnung, REGLER_MIN, REGLER_MAX, reglerMax } from '../components/WohnkostenInstrument.jsx';
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
    expect(i18nDe.wohnenInstrument.faustregel).toMatch(/Orientierung/);
    expect(i18nDe.wohnenInstrument.mehrAlsDrittel).toMatch(/Faustregel, keine Vorschrift/);
    expect(i18nDe.wohnenInstrument.faustregel).toMatch(/feste Grenze ist das nicht/);
    for (const l of [i18nDe, i18nEn, i18nFr, i18nIt, i18nRm]) {
      const alles = JSON.stringify(l.wohnenInstrument);
      expect(alles).not.toMatch(/Vermieter|landlord|bailleur|locator|locatur/i);
    }
  });
});

// Fachprüfung (Swiss-Precision) 24.10.2026, eingearbeitet.
describe('Kapitel Wohnen · Randfälle der Fachprüfung', () => {
  it('Partner/in: «eigenen Einkommens» und kein «Mehr als ein Drittel», die Miete gilt für den Haushalt', () => {
    const p = profil({ monthlyIncome: '4000' });
    p.basis = { ...p.basis, maritalStatus: 'married', household: { adults: 2, children: [], partnerIncome: '4000' } };
    const r = wohnkostenRechnung(p.wohnen, p);
    expect(r.mitPartner).toBe(true);
    expect(r.einkommen).toBe(4000);
    const html = render(p.wohnen, p);
    expect(html).toContain('wohnenInstrument.anteilEigen');
    expect(html).toContain('wohnenInstrument.mitPartner');
    expect(html).not.toContain('wohnenInstrument.mehrAlsDrittel');
  });

  it('nur der Nebenerwerb brutto: «teils brutto», nicht «des Bruttoeinkommens»', () => {
    const p = profil({ monthlyIncome: '4000', sideIncome: '800', sideIncomeType: 'brutto' });
    const html = render(p.wohnen, p);
    expect(html).toContain('wohnenInstrument.anteilTeilsBrutto');
    expect(html).not.toContain('wohnenInstrument.anteilBrutto(');
  });

  it('Eigentum mit Hypothek: Hypothek und Gebäudeversicherung zählen, kein Regler', () => {
    const p = profil({}, { rentAmount: '', utilities: '250', mortgageStatus: 'yes', mortgagePayment: '1200', buildingsInsurance: '600' });
    const r = wohnkostenRechnung(p.wohnen, p);
    expect(r.eigentum).toBe(true);
    expect(r.kosten).toBe(1500);
    const html = render(p.wohnen, p);
    expect(html).toContain('wohnenInstrument.titel');
    expect(html).not.toContain('miete-ausprobieren');
    // «Hypothek vorhanden? Nein»: ein stehengebliebener Betrag zählt nicht.
    const nein = profil({}, { mortgageStatus: 'no', mortgagePayment: '1200' });
    expect(wohnkostenRechnung(nein.wohnen, nein).kosten).toBe(1830);
  });

  it('im Minus: «Es fehlen danach» mit dem Betrag ohne Vorzeichen', () => {
    const p = profil({ monthlyIncome: '1500' });
    expect(wohnkostenRechnung(p.wohnen, p).frei).toBeLessThan(0);
    const html = render(p.wohnen, p);
    expect(html).toContain('wohnenInstrument.fehltDanach');
    expect(html).not.toContain('wohnenInstrument.freiDanach');
  });

  it('eine erfasste Miete über 3’500 bleibt auf dem Regler erreichbar', () => {
    expect(reglerMax(1650)).toBe(3500);
    expect(reglerMax(4120)).toBe(4150);
    const p = profil({ monthlyIncome: '12000' }, { rentAmount: '4120' });
    expect(render(p.wohnen, p)).toMatch(/type="range"[^>]*max="4150"[^>]*value="4100"/);
  });
});

// Offene Befunde der Fachprüfung, nachgezogen 24.10.2026 abends (auf Sophies Zuruf).
describe('Kapitel Wohnen · Nachzug Fachprüfung', () => {
  it('kein unbelegter Vermieter-Satz mehr, in keiner Sprache', () => {
    for (const l of [i18nDe, i18nEn, i18nFr, i18nIt, i18nRm]) {
      expect(l.mietzinsView.rentShareGuide).not.toMatch(/Vermieter|landlord|bailleur|locator|locatur/i);
    }
    expect(i18nDe.mietzinsView.rentShareGuide).toMatch(/feste Grenze ist das nicht/);
  });

  it('das Feld heisst Nettomiete, ohne Nebenkosten — wie die BFS-Werte, mit denen verglichen wird', () => {
    expect(i18nDe.chapters.wohnen.fields.rentAmount).toMatch(/^Nettomiete .*ohne Nebenkosten/);
  });

  it('Quellenzeile nennt die Erhebung so wie das BFS: Mietpreis-Strukturerhebung', () => {
    expect(i18nDe.po.regionalCompare.rent.source).toMatch(/Mietpreis-Strukturerhebung \{year\}/);
    expect(i18nFr.po.regionalCompare.rent.source).toMatch(/enquête de structure sur les loyers/);
    expect(i18nIt.po.regionalCompare.rent.source).toMatch(/rilevazione strutturale sugli affitti/);
  });

  it('Barometer-Legende: Einträge brechen nicht in sich um', () => {
    const html = render(profil().wohnen, profil());
    expect(html).toMatch(/white-space:nowrap[^>]*>.*po\.regionalCompare\.nationalVal/);
    expect(html).toMatch(/white-space:nowrap[^>]*>.*po\.regionalCompare\.regionalVal/);
  });
});

// Fachprüfung Mietpreise 2024 (25.10.2026): das Barometer sagt, womit es vergleicht.
describe('Kapitel Wohnen · Barometer nennt die Vergleichsgrösse', () => {
  it('ohne Zimmerzahl: 3-Zimmer-Wohnungen, angenommen aus der Haushaltsgrösse', () => {
    const html = render(profil().wohnen, profil());
    expect(html).toContain('data-teil="miete-vergleich-groesse"');
    expect(html).toContain('po.regionalCompare.rent.vergleichZimmer(3)');
    expect(html).toContain('po.regionalCompare.rent.zimmerAngenommen');
  });

  it('mit Zimmerzahl: nicht «angenommen»; in einem unsicheren Feld der Hinweis', () => {
    const p = profil({}, { rooms: '1' });
    p.basis.canton = 'UR';
    const html = render(p.wohnen, p);
    expect(html).toContain('po.regionalCompare.rent.vergleichZimmer(1)');
    expect(html).not.toContain('po.regionalCompare.rent.zimmerAngenommen');
    expect(html).toContain('po.regionalCompare.rent.wenigeAntworten');
  });
});


// Abnahme Fassung 6 (Sophie 25.10.2026): Barometer im Kapitel ruhiger, Zimmer-Hinweis zeigt auf die
// Angaben darunter statt «im Kapitel Wohnen», Tausender-Zeichen, «›» an der Ausprobieren-Zeile.
describe('Kapitel Wohnen · Abnahme F6', () => {
  it('ohne strukturelle Erklärung, mit dem Zimmer-Hinweis fürs Kapitel', () => {
    const html = render(profil().wohnen, profil());
    expect(html).toContain('po.regionalCompare.rent.title');
    expect(html).not.toContain('po.regionalCompare.rent.structural');
    expect(html).toContain('po.regionalCompare.rent.zimmerAngenommenHier');
    expect(html).not.toContain('po.regionalCompare.rent.zimmerAngenommen ');
  });
  it('Werte im Barometer mit Tausender-Zeichen', () => {
    expect(render(profil().wohnen, profil())).toContain('po.regionalCompare.rent.yourVal(1’650)');
  });
  it('die Ausprobieren-Zeile zeigt ein «›»', () => {
    expect(render(profil().wohnen, profil())).toMatch(/data-teil="ausprobieren-zeichen"[^>]*>›</);
  });
  it('der neue Hinweis steht in allen fünf Sprachen', () => {
    for (const s of [i18nDe, i18nEn, i18nFr, i18nIt, i18nRm]) {
      expect(s.po.regionalCompare.rent.zimmerAngenommenHier).toBeTruthy();
    }
  });
});
