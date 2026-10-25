import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FinanzenImKapitel } from '../components/FinanzAuswertung.jsx';
import { ChapterViewComplete } from '../ChapterView.jsx';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { DEMO_DATA } from '../config/demoData.js';

// Zusammenlegung Kapitel Finanzen + Finanz-Übersicht, Bauschritt 3 (docs/entscheide/finanzen-fusion.md
// §3): nach dem Formular Lebensbaum, Lohn, «Was sich daraus ergibt», «Weitere Ansprüche» (eingeklappt,
// offen bei Anspruch); nach «Passend» der Druck und der Hinweis.
const t = createT({ de }, 'de', 'sie');
const chapters = getChapters(t);
const nurText = (html) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
const teil = (teilName, data, extra = {}) => renderToStaticMarkup(React.createElement(FinanzenImKapitel, {
  teil: teilName, palette: LIGHT_PALETTE, t, data, onNavigate: () => {}, ...extra,
}));

// Knapp: Einperson in Bern, Lohn unter dem Bedarf — Sozialhilfe möglich.
const knapp = {
  basis: { canton: 'BE', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 1200, incomeType: 'netto', groceries: 500 },
  wohnen: { rentAmount: 1400 },
  versicherungen: { kkPremium: 420 },
};

describe('Auswertung im Kapitel, oberer Teil', () => {
  it('Reihenfolge: Lohn, «Was sich daraus ergibt» mit Steuern, IPV, KK-Last, dann «Weitere Ansprüche»', () => {
    const text = nurText(teil('oben', DEMO_DATA));
    const stelle = (s) => { const i = text.indexOf(s); expect(i, s).toBeGreaterThan(-1); return i; };
    const lohn = stelle('Wo steht Ihr Lohn?');
    const folgt = stelle('Was sich daraus ergibt');
    // Ab «Was sich daraus ergibt» gesucht: seit 24.10.2026 steht «Steuern» auch als Ausgabe im
    // Geldfluss weiter oben (geldfluss.test.js hält dessen Platz vor dem Lohn fest).
    const steuern = text.indexOf('Steuern', folgt);
    expect(steuern, 'Steuern').toBeGreaterThan(-1);
    const ipv = stelle('Prämienverbilligung');
    const weitere = stelle('Weitere Ansprüche');
    const sozialhilfe = text.indexOf('Sozialhilfe', weitere);
    expect(lohn).toBeLessThan(folgt);
    expect(folgt).toBeLessThan(steuern);
    expect(steuern).toBeLessThan(ipv);
    expect(ipv).toBeLessThan(weitere);
    expect(sozialhilfe).toBeGreaterThan(weitere);
  });

  it('mit Kapiteln steht der Lebensbaum vor der Rechnung', () => {
    const html = teil('oben', DEMO_DATA, { chapters });
    expect(html).toContain('data-teil="lebensbaum"');
    expect(html.indexOf('data-teil="lebensbaum"')).toBeLessThan(html.indexOf('Wo steht Ihr Lohn?'));
  });

  it('ohne Anspruch: «Weitere Ansprüche» eingeklappt', () => {
    const html = teil('oben', DEMO_DATA);
    const details = html.match(/<details[^>]*data-ansprueche[^>]*>/)[0];
    expect(details).not.toMatch(/\sopen/);
  });

  it('mit möglichem Anspruch: «Weitere Ansprüche» offen', () => {
    const html = teil('oben', knapp);
    const details = html.match(/<details[^>]*data-ansprueche[^>]*>/)[0];
    expect(details).toMatch(/\sopen/);
  });

  it('ohne Lohn: keine Rechnung, keine Ansprüche', () => {
    const html = teil('oben', { basis: {}, finanzen: {} });
    expect(html).not.toContain('Was sich daraus ergibt');
    expect(html).not.toContain('data-ansprueche');
  });
});

describe('Auswertung im Kapitel, unterer Teil', () => {
  it('Drucken und Hinweis zur Schätzung', () => {
    const text = nurText(teil('unten', DEMO_DATA));
    expect(text).toContain('Übersicht drucken');
    expect(text).toContain(nurText(t('finanzUebersicht.disclaimer')).slice(0, 30));
  });

  it('ohne Lohn: nichts', () => {
    expect(teil('unten', { basis: {}, finanzen: {} })).toBe('');
  });
});

describe('Kapitel Finanzen: Reihenfolge und keine Doppelungen mehr', () => {
  const QUELLE = fs.readFileSync(path.resolve(__dirname, '../ChapterView.jsx'), 'utf8');
  const render = (extra = {}) => renderToStaticMarkup(React.createElement(ChapterViewComplete, {
    palette: LIGHT_PALETTE, t, chapter: chapters.find((c) => c.key === 'finanzen'), data: DEMO_DATA.finanzen, allData: DEMO_DATA,
    onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {}, ...extra,
  }));

  it('Formular → Auswertung oben → Passend → Auswertung unten → Als Nächstes', () => {
    const i = (s) => { const n = QUELLE.indexOf(s); expect(n, s).toBeGreaterThan(-1); return n; };
    const formular = i('abschnittsliste()\n');
    const oben = i("renderAuswertung('oben')");
    const passend = i('    renderPassend(),');  // seit Fassung 6 in jedem Kapitel
    const unten = i("renderAuswertung('unten')");
    const naechstes = i('renderAlsNaechstes() :');
    expect(formular).toBeLessThan(oben);
    expect(oben).toBeLessThan(passend);
    expect(passend).toBeLessThan(unten);
    expect(unten).toBeLessThan(naechstes);
  });

  it('der grüne IPV-Hinweis und das eigene Lohn-Barometer stehen nicht mehr im Kapitel', () => {
    expect(QUELLE).not.toContain('orientation.contextIpv');
    expect(QUELLE).not.toContain("aktuellesKapitel: chapter.key");
    // Dafür im neuen Baustein: der «fehlt noch …»-Hinweis springt nicht ins eigene Kapitel.
    const AUSWERTUNG = fs.readFileSync(path.resolve(__dirname, '../components/FinanzAuswertung.jsx'), 'utf8');
    expect(AUSWERTUNG).toContain("aktuellesKapitel: 'finanzen'");
  });

  it('«Passend»: Neuer Job, Lohnausweis, Monatsbudget, Behörden-Dossier — keine Übersicht, keine IPV mehr', () => {
    const text = nurText(render());
    for (const s of ['Neuer Job', 'Lohnausweis ablegen', 'Monatsbudget', 'Einnahmen und Ausgaben im Detail', 'Behörden-Dossier']) expect(text, s).toContain(s);
    expect(text).not.toContain('Alle Berechnungen auf einen Blick');
    expect(text).not.toContain('Prämienverbilligung prüfen');
  });
});

// Entscheid 24.10.2026 (nach Bauschritt 4): der Knopf «neben dem eigenen Stand rechnen», der auf
// der Finanz-Übersicht stand, erscheint im Kapitel am Anfang der Auswertung.
describe('Probiermodus-Knopf bei der Auswertung', () => {
  const knopfText = t('sandbox.footerLink');

  it('mit onEnterSandbox: der Knopf steht am Anfang der Auswertung, vor dem Lebensbaum', () => {
    const html = teil('oben', DEMO_DATA, { chapters, onEnterSandbox: () => {} });
    expect(html).toContain('data-weg="probieren"');
    expect(nurText(html)).toContain(knopfText);
    expect(html.indexOf('data-weg="probieren"')).toBeLessThan(html.indexOf('data-teil="lebensbaum"'));
  });

  it('ohne onEnterSandbox (Beispiel, Probiermodus läuft schon): kein Knopf', () => {
    expect(teil('oben', DEMO_DATA)).not.toContain('data-weg="probieren"');
  });

  it('main.jsx gibt den Knopf nur ausserhalb von Beispiel und laufendem Probiermodus weiter', () => {
    const main = fs.readFileSync(path.resolve(__dirname, '../main.jsx'), 'utf8');
    expect(main).toContain('onEnterSandbox: !demoMode && !sandboxActive ? enterSandbox : undefined');
    const cv = fs.readFileSync(path.resolve(__dirname, '../ChapterView.jsx'), 'utf8');
    expect(cv).toMatch(/onEnterSandbox: teil === 'oben' \? onEnterSandbox : undefined/);
  });
});

// Abnahme F6 (Sophie 25.10.2026, Befunde 1, 5): Lohn-Hinweise hinter «So ist gerechnet», Steuer-Karte im
// Kapitel kurz und ohne Verweis «ins Kapitel Finanzen & Geld».
describe('Kapitel Finanzen · Abnahme F6', () => {
  it('die Lohn-Hinweise stecken hinter «So ist gerechnet»', () => {
    const html = teil('oben', DEMO_DATA);
    const block = html.match(/<details[^>]*data-teil="lohn-so-gerechnet"[^>]*>[\s\S]*?<\/details>/);
    expect(block).not.toBeNull();
    expect(block[0]).toContain('So ist gerechnet');
    expect(nurText(block[0])).toContain('13. Monatslohn');
  });
  it('Steuer-Karte im Kapitel: kurz, ohne Selbstverweis', () => {
    const text = nurText(teil('oben', DEMO_DATA));
    expect(text).not.toContain('im Kapitel «Finanzen & Geld»');
    expect(text).not.toContain('Messpunkten des Steuerrechners');
    expect(text).toContain('grobe Schätzung für den Hauptort, ohne Kirchensteuer');
  });
});
