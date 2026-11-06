import fs from 'node:fs';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { SozialhilfeRechner } from '../SozialhilfeRechner.jsx';
import { SozialhilfeView } from '../SozialhilfeView.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Rechtsprüfung auf b76bf8f8. SKOS-RL D.3.1 Abs. 1, Erl. a, Version 1.1.2026: Bankguthaben sind verfügbare Mittel.
// Abs. 3 trägt «möglich» dort nicht, nur die Ausnahme nach Abs. 2.
const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const profil = (finanzen, basis = {}, rent = 1200, kk = 300) => ({
  basis: { canton: 'ZH', dateOfBirth: '1986-03-01', household: { adults: 1, children: [] }, ...basis },
  finanzen: { employmentType: 'employed', monthlyIncome: 800, incomeType: 'netto', ...finanzen },
  wohnen: { rentAmount: rent }, versicherungen: { kkPremium: kk },
});
const rechner = (d) => renderToStaticMarkup(React.createElement(SozialhilfeRechner, { palette, t, data: d, onNavigate: () => {} }));
const seite = (d) => renderToStaticMarkup(React.createElement(SozialhilfeView, { palette, t, data: d, onNavigate: () => {} }));
const konkubinat = { maritalStatus: 'cohabiting', household: { adults: 2, children: [], partnerIncome: 8000 } };

describe('Vermögen: keine Überschrift «möglich»', () => {
  const p = profil({ savingsAccount: 100000 });
  it('Rechner und Seite', () => {
    for (const html of [rechner(p), seite(p)]) {
      expect(html).toContain(de.sh.vermoegenZuerstTitel);
      expect(html).not.toContain(de.dashboard.anspruchMoeglich);
    }
  });
  it('Der Text lässt die Ausnahme offen (D.3.1 Abs. 2)', () => {
    expect(de.pegel.vermoegen).toContain('in der Regel');
  });
  it('Wertgegenstände bleiben «möglich», Wertpapiere nicht (D.3.1 Erl. a und c)', () => {
    expect(calculateSozialhilfe(profil({ securitiesValue: 100000 })).offenTitel).toBe('sh.vermoegenZuerstTitel');
    const p2 = profil({ otherAssets: 100000 });
    expect(calculateSozialhilfe(p2).offenTitel).toBe('dashboard.anspruchMoeglich');
    expect(rechner(p2)).toContain(de.dashboard.anspruchMoeglich);
    expect(rechner(p2)).not.toContain(de.sh.vermoegenZuerstTitel);
    expect(seite(p2)).not.toContain(de.sh.vermoegenZuerstTitel);
  });
  it('Gegenprobe: ohne Vermögen bleibt der offene Fall «möglich»', () => {
    const offen = profil({ monthlyIncome: 2000 });
    expect(calculateSozialhilfe(offen).offenTitel).toBe('dashboard.anspruchMoeglich');
  });
});

describe('Konkubinat plus Vermögen: eine Aussage', () => {
  it('Rechner sperrt, auch wenn das Vermögen den Betrag schon wegnimmt', () => {
    const html = rechner(profil({ savingsAccount: 100000 }, konkubinat, 2000, 0));
    expect(html).toContain(de.pegel.konkubinatBetragOffen);
    expect(html).not.toContain(de.dashboard.anspruchMoeglich);
    expect(html).not.toContain(de.sh.vermoegenZuerstTitel);
  });
  it('Seite: Konkubinat ist der Grund, das Vermögen steht als Hinweis dabei', () => {
    const d = profil({ savingsAccount: 100000 }, konkubinat, 2000, 0);
    expect(calculateSozialhilfe(d).offenTitel).toBe('dashboard.anspruchMoeglich');
    expect(calculateSozialhilfe(d).hinweise).toContain('pegel.vermoegen');
    expect(seite(d)).toContain(de.pegel.vermoegen);
  });
});

describe('Knapp über dem Bedarf mit Vermögen: der ganze Grund', () => {
  const p = profil({ monthlyIncome: 2700, savingsAccount: 100000 });
  it('zuerst die fehlenden Erwerbsunkosten, das Vermögen dazu', () => {
    const s = calculateSozialhilfe(p);
    expect(s.offenText).toBe('pegel.coveredOffen');
    expect(s.hinweise).toContain('pegel.vermoegen');
  });
  it('Überschrift und Listen passen dazu', () => {
    expect(calculateSozialhilfe(p).offenTitel).toBe('dashboard.anspruchMoeglich');
    expect(rechner(p)).not.toContain(de.sh.vermoegenZuerstTitel);
    const quelle = (f) => fs.readFileSync(new URL(f, import.meta.url), 'utf8');
    expect(quelle('../components/Leistungsliste.jsx')).toContain("sh.hinweise?.includes('pegel.vermoegen')");
    expect(quelle('../components/FinanzAuswertung.jsx')).toContain("sozialhilfe.hinweise?.includes('pegel.vermoegen')");
    expect(seite(p).split(de.pegel.vermoegen).length - 1).toBeLessThanOrEqual(2);
  });
  it('Rechner sagt beides', () => {
    const html = rechner(p);
    expect(html).toContain(de.pegel.coveredOffen);
    expect(html).toContain('Frist zur Verwertung');
  });
});

describe('Nebenerwerb nicht netto: Rechner sagt den richtigen Grund', () => {
  it('Hauptlohn netto, Nebenerwerb brutto: nicht «kein Nettobetrag»', () => {
    const html = rechner(profil({ monthlyIncome: 0, sideIncome: 2000, sideIncomeType: 'brutto' }));
    expect(html).toContain(de.sh.nebenEingeben.sie);
    expect(html).not.toContain(de.sh.lohnEingeben.sie);
  });
  it('Hauptlohn 0 mit Lohnart brutto: nicht «im Profil steht ein Lohn»', () => {
    const html = rechner(profil({ monthlyIncome: 0, incomeType: 'brutto', sideIncome: 2000, sideIncomeType: 'brutto' }));
    expect(html).toContain(de.sh.nebenEingeben.sie);
    expect(html).not.toContain(de.sh.lohnEingeben.sie);
  });
  it('Hauptlohn 0 mit Lohnart brutto, Nebenerwerb netto: Betrag wie auf der Seite', () => {
    const html = rechner(profil({ monthlyIncome: 0, incomeType: 'brutto', sideIncome: 2000, sideIncomeType: 'netto' }));
    expect(html).not.toContain(de.sh.nebenEingeben.sie);
    expect(html).not.toContain(de.sh.lohnEingeben.sie);
  });
  it('Gegenprobe: Hauptlohn brutto behält seinen Satz', () => {
    expect(rechner(profil({ monthlyIncome: 3000, incomeType: 'brutto' }))).toContain(de.sh.lohnEingeben.sie);
  });
  it('Keine 0 neben «möglich»: Seite im Freibetrag-Fall', () => {
    const p = profil({ monthlyIncome: 2300 }, { canton: 'AG' }, 600, 300);
    expect(calculateSozialhilfe(p).efbEntscheidet).toBe(true);
    expect(seite(p)).not.toMatch(/CHF\s*0\//);
    expect(fs.readFileSync(new URL('../dossierGenerator.js', import.meta.url), 'utf8')).toContain('deficit: sozialhilfe.betragOffen || sozialhilfe.efbEntscheidet ? null');
  });
});

describe('Neue Schlüssel in fünf Sprachen', () => {
  it('vorhanden', () => {
    for (const l of [de, en, fr, itTranslations, rm]) {
      expect(l.sh.vermoegenZuerstTitel).toBeTruthy();
      expect(l.sh.nebenEingeben).toBeTruthy();
    }
  });
});
