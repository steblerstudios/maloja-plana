import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterViewComplete, haushaltsSaldo } from '../ChapterView.jsx';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { calculateMonthlyBudget } from '../budgetSync.js';

// Zusammenlegung Kapitel Finanzen + Finanz-Übersicht, Entscheid 1 (Stebler Studios 24.10.2026,
// docs/entscheide/finanzen-fusion.md): beide Saldi zeigen, klar benannt. «Jeden Monat bleiben»
// rechnet weiter nach utils/monatsrechnung.js; darunter steht der Saldo des Haushalts wie auf der
// Budget-Seite (budgetSync.js) — nur, wenn er abweicht.
// Fassung 6 (24.10.2026, Gesamtbericht 🔴 1): beide rechnen mit denselben Posten (Nebenerwerb,
// Hypothek, Kinderbetreuung, Gebäudeversicherung, Säule 3a); nur Partner/in trennt die zwei Zeilen.
const t = createT({ de }, 'de', 'sie');
const kapitel = getChapters(t).find((c) => c.key === 'finanzen');
const render = (allData) => renderToStaticMarkup(React.createElement(ChapterViewComplete, {
  palette: LIGHT_PALETTE, t, chapter: kapitel, data: allData.finanzen, allData,
  onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {},
}));
const nurText = (html) => html.replace(/<[^>]+>/g, '');

// Partner/in im Haushalt: das Feld zählt bei zwei Erwachsenen (utils/partnereinkommen.js).
const mitPartner = (d, betrag) => ({ ...d, basis: { ...d.basis, household: { adults: 2, partnerIncome: betrag } } });

// Ohne Kanton: keine IPV-Schätzung, nichts Kantonales im Spiel.
const basis = () => ({
  basis: {},
  finanzen: { monthlyIncome: 5000, incomeType: 'netto', groceries: 600 },
  wohnen: { rentAmount: 1500 },
  versicherungen: { kkPremium: 400 },
});

// Die drei Entscheide nach Bauschritt 1 (24.10.2026): Brutto → Netto-Frage statt Zahl;
// Minus / ohne eigenen Lohn → Block bleibt; obere Zeile nennt das eigene Einkommen, sobald die
// Haushalts-Zeile darunter steht.
describe('Saldo-Block: Minus, ohne eigenen Lohn, Benennung', () => {
  it('im Minus: «Jeden Monat fehlen CHF …», ohne Vorzeichen', () => {
    const d = basis();
    d.finanzen = { ...d.finanzen, monthlyIncome: 2000 };
    const html = render(d);
    expect(html).toContain('data-teil="monat-bleiben"');
    const text = nurText(html);
    expect(text).toContain('Jeden Monat fehlenCHF 500');
    expect(text).not.toContain('−');
    expect(html).not.toContain('data-teil="monat-haushalt"');
  });

  it('eigener Saldo im Minus, Haushalt im Plus: beide Zeilen, oben das eigene Einkommen', () => {
    const d = mitPartner(basis(), 1500);
    d.finanzen = { ...d.finanzen, monthlyIncome: 2000 };
    const text = nurText(render(d));
    expect(text).toContain('Mit dem eigenen Einkommen fehlen jeden MonatCHF 500');
    expect(text).toContain('Mit dem ganzen Haushalt bleiben CHF 1’000');
  });

  it('ohne eigenes Einkommen, aber mit Partner/in: Block mit beiden Zeilen', () => {
    const d = mitPartner(basis(), 3000);
    d.finanzen = { incomeType: 'netto', groceries: 600 };
    const text = nurText(render(d));
    expect(text).toContain('Mit dem eigenen Einkommen fehlen jeden MonatCHF 2’500');
    expect(text).toContain('Mit dem ganzen Haushalt bleiben CHF 500');
    // «von 0 Einkommen» wäre leer — die Zeile fällt weg.
    expect(text).not.toContain('von 0');
  });

  it('ohne eigenes Einkommen und ohne weiteres: kein Block', () => {
    const d = basis();
    d.finanzen = { groceries: 600 };
    expect(render(d)).not.toContain('data-teil="monat-bleiben"');
  });

  it('ohne Haushalts-Zeile bleibt die obere Zeile «Jeden Monat bleiben»', () => {
    const text = nurText(render(basis()));
    expect(text).toContain('Jeden Monat bleibenCHF 2’500');
    expect(text).not.toContain('eigenen Einkommen');
  });
});

describe('Saldo des Haushalts unter «Jeden Monat bleiben»', () => {
  it('gleiche Zahl in beiden Rechnungen: keine zweite Zeile', () => {
    const d = basis();
    expect(haushaltsSaldo(d, 2500)).toBeNull();
    const html = render(d);
    expect(nurText(html)).toContain('Jeden Monat bleibenCHF 2’500');
    expect(html).not.toContain('data-teil="monat-haushalt"');
  });

  // Fassung 6: der eigene Nebenerwerb ist eigenes Einkommen — er zählt oben, eine Zahl mit dem Budget.
  // Vorher: oben 2’500, «Mit dem ganzen Haushalt bleiben 3’500» (Gesamtbericht 🔴 1).
  it('mit Nebenerwerb: oben die Budget-Zahl, keine zweite Zeile', () => {
    const d = basis();
    d.finanzen = { ...d.finanzen, sideIncome: 1000, sideIncomeType: 'netto' };
    expect(calculateMonthlyBudget(d).remaining).toBe(3500);
    expect(haushaltsSaldo(d, 3500)).toBeNull();
    const html = render(d);
    expect(nurText(html)).toContain('Jeden Monat bleibenCHF 3’500');
    expect(html).not.toContain('data-teil="monat-haushalt"');
  });

  it('mit Partner/in: die Budget-Zahl, benannt als Haushalt', () => {
    const d = mitPartner(basis(), 1000);
    expect(calculateMonthlyBudget(d).remaining).toBe(3500);
    const html = render(d);
    expect(html).toContain('data-teil="monat-haushalt"');
    const text = nurText(html);
    expect(text).toContain('Mit dem eigenen Einkommen bleiben jeden MonatCHF 2’500');
    expect(text).toContain('Mit dem ganzen Haushalt bleiben CHF 3’500');
    expect(text).toContain('wie auf der Budget-Seite');
  });

  // Fassung 6: die Hypothek zählt auch oben — im Minus «Jeden Monat fehlen», ohne Vorzeichen.
  it('Hypothek: oben «fehlen», ohne Vorzeichen, keine zweite Zeile', () => {
    const d = basis();
    d.wohnen = { ...d.wohnen, mortgagePayment: 3000 };
    const html = render(d);
    const text = nurText(html);
    expect(text).toContain('Jeden Monat fehlenCHF 500');
    expect(text).not.toContain('−');
    expect(html).not.toContain('data-teil="monat-haushalt"');
  });

  it('Haushalt im Minus: «Mit dem ganzen Haushalt fehlen», ohne Vorzeichen', () => {
    const d = mitPartner(basis(), 500);
    d.wohnen = { ...d.wohnen, mortgagePayment: 3500 };
    const text = nurText(render(d));
    expect(text).toContain('Mit dem ganzen Haushalt fehlen CHF 500');
    expect(text).not.toContain('−');
  });

  // Fassung 6: ein brutto erfasster Nebenerwerb ist eigenes Einkommen — oben die Netto-Frage,
  // keine Zahl, die so nie auf dem Konto liegt; keine zweite Zeile.
  it('Nebenerwerb brutto: oben die Frage nach dem Netto, keine Zahl', () => {
    const d = basis();
    d.finanzen = { ...d.finanzen, sideIncome: 1000, sideIncomeType: 'brutto' };
    expect(calculateMonthlyBudget(d).bruttoDabei).toBe(true);
    const html = render(d);
    expect(html).not.toContain('data-teil="monat-haushalt"');
    const text = nurText(html).split('Monatliches Einkommen')[0];
    expect(text).toContain('Ein Lohn ist als Bruttolohn erfasst');
    expect(text).not.toContain('CHF 3’500');
  });

  it('eigener Lohn brutto: keine zweite Zeile, auch mit Hypothek (die Zahl darüber ist selbst brutto)', () => {
    const d = basis();
    d.finanzen = { ...d.finanzen, incomeType: 'brutto' };
    expect(haushaltsSaldo(d, 2500)).toBeNull();
    d.wohnen = { ...d.wohnen, mortgagePayment: 800 };
    expect(haushaltsSaldo(d, 2500)).toBeNull();
    expect(render(d)).not.toContain('data-teil="monat-haushalt"');
  });

  it('mit Kanton: die Zeile nennt genau den Saldo der Budget-Seite (IPV steht dort neben, nicht im Saldo)', () => {
    const d = mitPartner(basis(), 1000);
    d.basis = { ...d.basis, canton: 'ZH' };
    const h = haushaltsSaldo(d, 2500);
    expect(h.rest).toBe(Math.round(calculateMonthlyBudget(d).remaining));
    expect(h.rest).toBe(3500);
  });

  it('ungültiger Wert in einem Budget-Feld: keine Zeile statt «CHF NaN»', () => {
    const d = basis();
    d.wohnen = { ...d.wohnen, mortgagePayment: 'abc' };
    expect(haushaltsSaldo(d, 2500)).toBeNull();
  });

  it('Rappen aus Jahresbeträgen (/12) gelten nicht als Abweichung', () => {
    expect(haushaltsSaldo({ ...basis(), wohnen: { rentAmount: 1500, buildingsInsurance: 4 } }, 2500)).toBeNull();
  });
});
