import fs from 'node:fs';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { berechneSozialhilfe } from '../data/sozialhilfeRechner.js';
import { sozialhilfePegelState } from '../data/pegel.js';
import { sozialhilfeVorbefuellung } from '../utils/sozialhilfeVorbefuellung.js';
import { SozialhilfeRechner } from '../SozialhilfeRechner.jsx';
import { SozialhilfeView } from '../SozialhilfeView.jsx';
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
    expect(html).toContain('Frist zur Verwertung');
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
      expect(render(p)).toContain(de.sh.nebenEingeben.sie);
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

describe('Nachtrag Rechtsprüfer 2a1d09d0', () => {
  const k = { maritalStatus: 'cohabiting', household: { adults: 2, children: [], partnerIncome: 8000 } };
  it('Knapp-Fall: kein Betrag, auch keine 0', () => {
    const s = calculateSozialhilfe(profil({ monthlyIncome: 2700 })); // Bedarf 2561, Quote 1,05
    expect(s.anspruchOffen).toBe(true);
    expect(s.betragOffen).toBe(true);
  });
  it('Lohn 9000, Partner 8000: Seite und Rechner sagen beide, das Einkommen reicht', () => {
    const p = profil({ monthlyIncome: 9000 }, k);
    expect(calculateSozialhilfe(p).betragOffen).toBe(false);
    expect(render(p)).toContain(de.sh.keinAnspruch);
  });
  it('Text sagt tiefer oder wegfallen', () => {
    expect(de.pegel.konkubinatBetragOffen).toContain('tiefer sein oder wegfallen');
  });
  it('JSON-Export: offener Betrag ist null, Hinweise lesbar', async () => {
    const quelle = (await import('node:fs')).readFileSync(new URL('../dossierGenerator.js', import.meta.url), 'utf8');
    expect(quelle).toContain('deficit: sozialhilfe.betragOffen || sozialhilfe.efbEntscheidet ? null : sozialhilfe.deficit || 0');
    expect(quelle).toContain('hinweise: (sozialhilfe.hinweise || []).map((k) => (t ? t(k) : k))');
  });
});

describe('Die Seite zeigt es, nicht nur das Feld', () => {
  const seite = (d) => renderToStaticMarkup(React.createElement(SozialhilfeView, { palette, t, data: d, onNavigate: () => {} }));
  it('Vermögen über dem Freibetrag: keine Zusage, der Satz steht, kein Nein', () => {
    const html = seite(profil({ savingsAccount: 100000 }));
    expect(html).not.toContain(de.sozialhilfe.entitled);
    expect(html).not.toContain('2’028');
    expect(html).toContain('Frist zur Verwertung');
    expect(html).not.toContain(de.sh.keinAnspruch);
  });
  it('Konkubinat Partner 8000, Lohn 800, Sparkonto 100000: Vermögenssatz bleibt', () => {
    const html = seite(profil({ savingsAccount: 100000 }, { maritalStatus: 'cohabiting', household: { adults: 2, children: [], partnerIncome: 8000 } }));
    expect(html).toContain(de.pegel.konkubinatBetragOffen);
    expect(html).toContain(de.pegel.vermoegen);
  });
  it('Knapp-Fall: keine Zeile CHF 0', () => {
    const html = seite(profil({ monthlyIncome: 2700 }));
    expect(html).toContain('—');
    expect(html).not.toMatch(/CHF\s*0</);
  });
  it('Gegenprobe: normaler Anspruch zeigt die Zusage', () => {
    expect(seite(profil({ savingsAccount: 1000 }))).toContain('/ ' + de.sh.monat);
  });
});

describe('Fachprüfung 44c6808f', () => {
  const brutto = { monthlyIncome: 1500, sideIncome: 2000, sideIncomeType: 'brutto' };
  it('Nebenerwerb brutto bei Hauptlohn über 0: kein Betrag, bis das Netto eingetragen ist', () => {
    const html = render(profil(brutto));
    expect(html).not.toContain('/ ' + de.sh.monat);
    expect(html).toContain(de.sh.nebenEingeben.sie);
    expect(html).toMatch(/value="1500"/);
  });
  it('Nebenerwerb ohne Art: dasselbe', () => {
    expect(render(profil({ monthlyIncome: 1500, sideIncome: 2000 }))).toContain(de.sh.nebenEingeben.sie);
  });
  it('Vermögen beim gewöhnlichen Nein: kein Vermögenssatz im Rechner', () => {
    const html = render(profil({ monthlyIncome: 6000, savingsAccount: 100000 }));
    expect(html).toContain(de.sh.keinAnspruch);
    expect(html).not.toContain('Frist zur Verwertung');
  });
  it('Rechner zeigt keine 0 neben «Anspruch möglich»', () => {
    const r = berechneSozialhilfe({ adults: 1, miete: 1200, krankenkassePraemie: 300, erwerbseinkommen: 2700, erwerbstaetig: true, kanton: 'ZH' });
    expect(r.anspruchOffen).toBe(true);
    expect(render(profil({ monthlyIncome: 2700 }))).not.toMatch(/>0<\/td>/);
  });
  it('JSON nennt den Grund', () => {
    const quelle = fs.readFileSync(new URL('../dossierGenerator.js', import.meta.url), 'utf8');
    expect(quelle).toContain('vermoegenZuerst: !!sozialhilfe.vermoegenZuerst');
    expect(quelle).toContain('offenText: sozialhilfe.betragOffen && t ? t(sozialhilfe.offenText) : undefined');
  });
});
