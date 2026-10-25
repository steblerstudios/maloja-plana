// Fassung 6 · Prämien-Fundament (Entscheid Stebler Studios 24.10.2026 «erfasste Versicherungsprämien
// gehören ins Budget (Hausrat, Haftpflicht)», gebaut 25.10.2026 mit Fachprüfung):
// - Hausrat- und Haftpflicht-Prämie sind Jahresbeträge und zählen ÷ 12 überall gleich
//   (Monatsrechnung, Budget, Dashboard-Tankanzeige).
// - Die Haftpflicht-Versicherungssumme und die Fahrzeugversicherung zählen nicht.
// - Jahresfelder zeigen «/ Jahr» am Wert.
// - Stehen Prämien UND «Weitere Versicherungen» drin, sagt das Kapitel Finanzen es — nichts wird abgezogen.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { monatsAusgaben, sumAllExpenses } from '../utils/monatsrechnung.js';
import { monthlyExpenses } from '../data/haushaltskosten.js';
import { calculateMonthlyBudget } from '../budgetSync.js';
import { ChapterViewComplete } from '../ChapterView.jsx';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { DEMO_DATA } from '../config/demoData.js';

const t = createT({ de }, 'de', 'sie');
const chapters = getChapters(t);
const nurText = (html) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
const render = (key, data, allData = DEMO_DATA) => nurText(renderToStaticMarkup(React.createElement(ChapterViewComplete, {
  palette: LIGHT_PALETTE, t, chapter: chapters.find((c) => c.key === key), data, allData,
  onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {},
})));

const profil = (versicherungen, finanzen = {}) => ({
  finanzen: { monthlyIncome: '5000', incomeType: 'netto', groceries: '400', ...finanzen },
  versicherungen,
});

describe('Prämien zählen ÷ 12, überall gleich', () => {
  const d = profil({ householdInsuranceAmount: '240', liabilityPremium: '120', liabilityAmount: '5000000', autoInsuranceAmount: '900' });
  it('Monatsrechnung: Hausrat 20, Haftpflicht 10; Summe und Fahrzeug zählen nicht', () => {
    const p = monatsAusgaben(d);
    expect(p.householdInsurance).toBe(20);
    expect(p.liabilityInsurance).toBe(10);
    expect(sumAllExpenses(d.finanzen, d)).toBe(430);
  });
  it('Budget und Dashboard-Tankanzeige rechnen dieselbe Summe', () => {
    expect(calculateMonthlyBudget(d, t).totalExpenses).toBe(430);
    expect(monthlyExpenses(d)).toBe(430);
  });
});

describe('Beispiel Maria', () => {
  it('realistische Werte: KK 540.30 (CSS, ZH1, Standard, F 1’500, ohne Unfall), Hausrat 240, Haftpflicht 120, Summe 5 Mio.', () => {
    expect(DEMO_DATA.versicherungen.kkPremium).toBe('540.30');
    expect(DEMO_DATA.versicherungen.householdInsuranceAmount).toBe('240');
    expect(DEMO_DATA.versicherungen.liabilityPremium).toBe('120');
    expect(DEMO_DATA.versicherungen.liabilityAmount).toBe('5000000');
  });
  it('Kapitel Versicherungen: Jahresprämien mit «/ Jahr»', () => {
    const text = render('versicherungen', DEMO_DATA.versicherungen);
    // geschütztes Leerzeichen vor «/ Jahr»
    expect(text).toContain('CHF 240 / Jahr');
    expect(text).toContain('CHF 120 / Jahr');
  });
});

// Nachprüfung (swiss-precision, 25.10.2026): wie bei der Hypothek zählt ein stehengebliebener Betrag
// nicht, wenn «Versicherung vorhanden? Nein» gewählt ist; Dashboard und Tankanzeige rechnen wie das Budget.
describe('Nachprüfung', () => {
  it('«Nein» bei Hausrat oder Haftpflicht: die Prämie zählt nicht', () => {
    const d = profil({ householdInsurance: 'no', householdInsuranceAmount: '240', liabilityInsurance: 'no', liabilityPremium: '120' });
    expect(sumAllExpenses(d.finanzen, d)).toBe(400);
    expect(monthlyExpenses(d)).toBe(400);
  });
  it('Tankanzeige zählt negative Beträge nicht mit (eine Rechnung mit dem Budget)', () => {
    const d = profil({}, { otherInsurance: '-50' });
    expect(monthlyExpenses(d)).toBe(calculateMonthlyBudget(d, t).totalExpenses);
  });
});

describe('Überschneidung mit «Weitere Versicherungen»', () => {
  const hinweis = de.chapters.finanzen.monat.doppeltVersichert;
  it('Prämie erfasst und «Weitere Versicherungen» > 0: ruhiger Hinweis im Kapitel Finanzen', () => {
    const finanzen = { ...DEMO_DATA.finanzen, otherInsurance: '60' };
    const text = render('finanzen', finanzen, { ...DEMO_DATA, finanzen });
    expect(text).toContain(typeof hinweis === 'string' ? hinweis : hinweis.sie);
  });
  it('ohne «Weitere Versicherungen» (wie Maria): kein Hinweis', () => {
    const text = render('finanzen', DEMO_DATA.finanzen);
    expect(text).not.toContain(typeof hinweis === 'string' ? hinweis : hinweis.sie);
  });
});

describe('neue Texte in allen fünf Sprachen', () => {
  for (const [name, s] of Object.entries({ de, en, fr, it: it_, rm })) {
    it(name, () => {
      expect(s.chapterView.proJahr, 'proJahr').toBeTruthy();
      expect(s.budgetSync.field.householdInsurance, 'Budget Hausrat').toBeTruthy();
      expect(s.budgetSync.field.liabilityInsurance, 'Budget Haftpflicht').toBeTruthy();
      expect(s.chapters.finanzen.monat.doppeltVersichert, 'Hinweis doppelt').toBeTruthy();
    });
  }
});
