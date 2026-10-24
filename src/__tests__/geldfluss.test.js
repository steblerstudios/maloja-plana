// Geldfluss (Sankey), seit 24.10.2026 im Kapitel Finanzen am Anfang der Auswertung (vorher auf
// der Charts-Seite; Sophie: «der Ort ist falsch»). Gehalten wird: beide Seiten sind gleich
// breit (nichts verschwindet, nichts kommt dazu), ein Fehlbetrag steht als «Nicht gedeckt»
// links statt still unterzugehen, die Beschriftungen überlappen sich nicht, er rechnet wie
// utils/monatsrechnung.js, steht nach dem Lebensbaum und vor dem Lohn — und ein alter
// Charts-Link landet hier (die Charts-Seite gibt es seit 24.10.2026 nicht mehr).
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { geldflussLayout, geldflussDaten, GeldflussImKapitel } from '../components/Geldfluss.jsx';
import { FinanzenImKapitel } from '../components/FinanzAuswertung.jsx';
import { DEMO_DATA } from '../config/demoData.js';
import { LIGHT_PALETTE, getChapters } from '../config/constants.js';
import { sumAllExpenses, sumTotalIncome } from '../utils/monatsrechnung.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';

const t = createT({ de }, 'de', 'sie');
const G = de.chapters.finanzen.geldfluss;
const zeichne = (data) => renderToStaticMarkup(React.createElement(GeldflussImKapitel, { data, t, palette: LIGHT_PALETTE }));
const bild = (html) => html.match(/<svg viewBox="0 0 560[\s\S]*?<\/svg>/)[0];
const summe = (l) => l.reduce((a, x) => a + x.value, 0);
const summeHoehe = (knoten) => knoten.reduce((a, k) => a + k.h, 0);

describe('Geldfluss', () => {
  // Fassung 6: der Fluss erst mit zwei Einnahmequellen — Maria (ein Lohn) zeigt den Kuchen, hier
  // mit Familienzulagen als zweiter Quelle.
  it('Beispiel Maria mit Familienzulagen: Titel und Beschreibung für Screenreader', () => {
    const html = zeichne({ ...DEMO_DATA, finanzen: { ...DEMO_DATA.finanzen, familienzulagen: '215' } });
    expect(html).toContain(G.title);
    expect(html).toContain('role="img"');
    expect(html).toContain('Pro Monat kommen CHF');
  });

  it('rechnet wie das Kapitel: links das Einkommen, rechts Ausgaben und Rest', () => {
    const { quellen, ziele } = geldflussDaten(DEMO_DATA, t, LIGHT_PALETTE);
    const ein = sumTotalIncome(DEMO_DATA.finanzen);
    const aus = sumAllExpenses(DEMO_DATA.finanzen, DEMO_DATA);
    expect(summe(quellen)).toBeCloseTo(Math.max(ein, aus), 6);
    expect(summe(ziele)).toBeCloseTo(Math.max(ein, aus), 6);
  });

  it('Überschuss: rechts steht der Rest, links kein «Nicht gedeckt»', () => {
    const svg = bild(zeichne({ finanzen: { monthlyIncome: '5000', familienzulagen: '215', groceries: '400' } }));
    expect(svg).toContain(de.budgetSync.remaining);
    expect(svg).not.toContain(G.uncovered);
  });

  it('Fehlbetrag: links steht «Nicht gedeckt», rechts kein Rest', () => {
    const svg = bild(zeichne({ finanzen: { monthlyIncome: '2000', familienzulagen: '215', groceries: '500' }, wohnen: { rentAmount: '1800' } }));
    expect(svg).toContain(G.uncovered);
    expect(svg).not.toContain(de.budgetSync.remaining);
  });

  it('beide Seiten und die Mitte sind gleich breit', () => {
    const lage = geldflussLayout(
      [{ label: 'a', value: 3000 }, { label: 'b', value: 500 }],
      [{ label: 'x', value: 1500 }, { label: 'y', value: 1200 }, { label: 'z', value: 800 }],
    );
    expect(summeHoehe(lage.links)).toBeCloseTo(lage.mitte.h, 6);
    expect(summeHoehe(lage.rechts)).toBeCloseTo(lage.mitte.h, 6);
  });

  it('Beschriftungen halten Abstand, auch bei vielen kleinen Posten', () => {
    const ziele = [{ label: 'gross', value: 5000 }].concat(Array.from({ length: 9 }, (_, i) => ({ label: 'k' + i, value: 5 })));
    const lage = geldflussLayout([{ label: 'q', value: 5045 }], ziele);
    for (let i = 1; i < lage.rechts.length; i++) {
      expect(lage.rechts[i].marke - lage.rechts[i - 1].marke).toBeGreaterThanOrEqual(15);
    }
    expect(lage.hoehe).toBeGreaterThanOrEqual(lage.rechts[lage.rechts.length - 1].marke);
  });

  it('nichts zu zeigen: kein Layout', () => {
    expect(geldflussLayout([], [])).toBeNull();
  });
});

describe('Geldfluss am neuen Ort', () => {
  it('im Kapitel Finanzen: nach dem Lebensbaum, vor dem Lohn', () => {
    const html = renderToStaticMarkup(React.createElement(FinanzenImKapitel, {
      teil: 'oben', palette: LIGHT_PALETTE, t, data: DEMO_DATA, onNavigate: () => {}, chapters: getChapters(t),
    }));
    const baum = html.indexOf('data-teil="lebensbaum"');
    const fluss = html.indexOf('data-teil="geldfluss"');
    const lohn = html.indexOf('Wo steht Ihr Lohn?');
    expect(baum).toBeGreaterThan(-1);
    expect(fluss).toBeGreaterThan(baum);
    expect(lohn).toBeGreaterThan(fluss);
  });

  it('ohne Einkommen kein Geldfluss im Kapitel', () => {
    const html = renderToStaticMarkup(React.createElement(FinanzenImKapitel, {
      teil: 'oben', palette: LIGHT_PALETTE, t, data: { finanzen: {} }, onNavigate: () => {},
    }));
    expect(html).not.toContain('data-teil="geldfluss"');
  });

  // Bis 24.10.2026 hiess es hier «die Charts-Seite zeigt wieder ihr Kuchendiagramm». Die Seite
  // gibt es nicht mehr (#/charts → hierher, chartsUmleitung.test.js). Seit Fassung 6 steht ihr Kuchen
  // hier; Maria hat einen Lohn, darum kein Fluss.
  it('ein alter Charts-Link landet beim Kuchen', () => {
    const html = renderToStaticMarkup(React.createElement(FinanzenImKapitel, {
      teil: 'oben', palette: LIGHT_PALETTE, t, data: DEMO_DATA, onNavigate: () => {},
    }));
    expect(html).toContain('id="mp-finanz-auswertung"');
    expect(html).toContain(de.budgetSync.expensesOverview);
    expect(html).not.toContain(G.title);
  });
});

// Fachprüfung Fassung 6 (24.10.2026): bei brutto erfasstem Lohn kein Fluss mit «Übrig».
describe('Geldfluss und Brutto-Regel', () => {
  const t = (k) => k;
  const palette = {};
  it('Nebenerwerb brutto: geldflussDaten meldet brutto', () => {
    const d = { finanzen: { monthlyIncome: 4000, incomeType: 'netto', sideIncome: 1000, sideIncomeType: 'brutto', groceries: 500 } };
    expect(geldflussDaten(d, t, palette).brutto).toBe(true);
  });
  it('alles netto: kein brutto, Nebenerwerb als eigene Quelle', () => {
    const d = { finanzen: { monthlyIncome: 4000, incomeType: 'netto', sideIncome: 1000, sideIncomeType: 'netto', groceries: 500 } };
    const g = geldflussDaten(d, t, palette);
    expect(g.brutto).toBe(false);
    expect(g.quellen.map((q) => q.label)).toContain('budgetSync.incomeSide');
  });
});
