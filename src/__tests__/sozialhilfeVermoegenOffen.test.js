import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { berechneSozialhilfe } from '../data/sozialhilfeRechner.js';
import { sozialhilfePegelState } from '../data/pegel.js';
import { sozialhilfeVorbefuellung } from '../utils/sozialhilfeVorbefuellung.js';
import { SozialhilfeRechner } from '../SozialhilfeRechner.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Fachprüfung auf 2a1d09d0: Vermögen über dem Freibetrag zeigte zugleich «Kein Anspruch» und einen Betrag.
// SKOS-RL D.3.1 Abs. 2 und 3, Version 1.1.2026: Ausnahmen, Frist zur Verwertung, in der Zwischenzeit Unterstützung.
// Also weder Nein noch Betrag, sondern offen, wie beim Konkubinat (#656).
const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const profil = (finanzen, basis = {}) => ({
  basis: { canton: 'ZH', dateOfBirth: '1986-03-01', household: { adults: 1, children: [] }, ...basis },
  finanzen: { employmentType: 'employed', monthlyIncome: 800, incomeType: 'netto', ...finanzen },
  wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 300 },
});
const render = (d) => renderToStaticMarkup(React.createElement(SozialhilfeRechner, { palette, t, data: d, onNavigate: () => {} }));

describe('Vermögen über dem Freibetrag: offen, kein Betrag, kein Nein', () => {
  const reich = profil({ savingsAccount: 100000 });
  it('die Seite verspricht keinen Betrag und sagt nicht Nein', () => {
    const s = calculateSozialhilfe(reich);
    expect(s.deficit).toBe(0);
    expect(s.eligible).toBe(false);
    expect(s.anspruchOffen).toBe(true);
    expect(s.offenText).toBe('pegel.vermoegen');
    expect(s.betragOffen).toBe(true);
  });
  it('Pegel und Rechnung des Rechners sagen dasselbe', () => {
    expect(sozialhilfePegelState(reich).mode).toBe('vermoegen');
    expect(sozialhilfePegelState(reich).amount).toBe(0);
    const r = berechneSozialhilfe({ adults: 1, miete: 1200, krankenkassePraemie: 300, erwerbseinkommen: 800, vermoegen: 100000, erwerbstaetig: true, kanton: 'ZH' });
    expect(r.vermoegenZuerst).toBe(true);
    expect(r.sozialhilfeAnspruch).toBe(0);
    expect(r.hatAnspruch).toBe(false);
  });
  it('der Rechner sagt nicht «Kein Anspruch» und zeigt keinen Betrag', () => {
    const html = render(reich);
    expect(html).not.toContain(de.sh.keinAnspruch);
    expect(html).toContain(de.pegel.vermoegen);
    expect(html).not.toMatch(/kein Anspruch/);
  });
  it('Gegenprobe: unter dem Freibetrag Betrag wie bisher', () => {
    const s = calculateSozialhilfe(profil({ savingsAccount: 1000 }));
    expect(s.eligible).toBe(true);
    expect(s.vermoegenZuerst).toBe(false);
  });
  it('Gegenprobe: Einkommen deckt den Bedarf, das Vermögen ist nicht der Grund', () => {
    const s = calculateSozialhilfe(profil({ monthlyIncome: 6000, savingsAccount: 100000 }));
    expect(s.vermoegenZuerst).toBe(false);
    expect(s.anspruchOffen).toBe(false);
  });
  it('Konkubinat mit Vermögen: bleibt offen, der Vermögenshinweis steht dabei', () => {
    const s = calculateSozialhilfe(profil({ savingsAccount: 100000 }, { maritalStatus: 'cohabiting', household: { adults: 2, children: [], partnerIncome: 5000 } }));
    expect(s.konkubinatBetragOffen).toBe(true);
    expect(s.hinweise).toContain('pegel.vermoegen');
  });
});

describe('Hauptlohn 0 und Nebenerwerb nicht netto', () => {
  for (const [name, f] of [['brutto', { sideIncomeType: 'brutto' }], ['ohne Art', {}]]) {
    it(`${name}: Feld leer, kein Betrag aus Einkommen 0`, () => {
      const p = profil({ monthlyIncome: 0, sideIncome: 2000, ...f });
      expect(sozialhilfeVorbefuellung(p).einkommen).toBe('');
      expect(render(p)).toContain(de.sh.lohnEingeben.sie);
    });
  }
  it('Gegenprobe: Hauptlohn 0 ohne Nebenerwerb bleibt eine Antwort', () => {
    expect(sozialhilfeVorbefuellung(profil({ monthlyIncome: 0 })).einkommen).toBe('0');
  });
});

describe('Rechner im Konkubinat', () => {
  const k = { maritalStatus: 'cohabiting', household: { adults: 2, children: [], partnerIncome: 5000 } };
  it('eigenes Einkommen deckt den Bedarf: keine Sperre, wie auf der Seite', () => {
    const p = profil({ monthlyIncome: 5000 }, k);
    expect(calculateSozialhilfe(p).konkubinatBetragOffen).toBe(false);
    expect(render(p)).not.toContain(de.pegel.konkubinatBetragOffen);
  });
  it('gesperrt: keine Zeile «Noch eine Angabe nötig»', () => {
    const html = render(profil({ monthlyIncome: 800, savingsAccount: 100 }, k));
    expect(html).toContain(de.pegel.konkubinatBetragOffen);
    expect(html).not.toContain('Noch eine Angabe');
    expect(html).not.toMatch(/Noch \d+ Angaben/);
  });
});
