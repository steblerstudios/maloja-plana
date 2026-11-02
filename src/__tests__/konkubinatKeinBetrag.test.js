import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { sozialhilfePegelState } from '../data/pegel.js';
import { sozialhilfeVorbefuellung } from '../utils/sozialhilfeVorbefuellung.js';
import { anspruchSignale } from '../data/anspruchSignale.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Entscheid Stebler Studios 02.11.2026: Konkubinat mit Partnerlohn zeigt keinen Betrag. SKOS-RL D.4.4 (Fassung 1.1.2026):
// Im stabilen Konkubinat zählt ein Beitrag als Einnahme, die App kennt weder Dauer noch Budget des Partners.
const profil = (partnerIncome, finanzen = {}, maritalStatus = 'cohabiting') => ({
  basis: { canton: 'ZH', maritalStatus, household: { adults: 2, children: [], partnerIncome } },
  finanzen, wohnen: { rentAmount: 2000 }, versicherungen: { kkPremium: 0 },
});

describe('Konkubinat mit Partnerlohn: kein Betrag', () => {
  it('kein Betrag, kein Anspruch, sondern offen', () => {
    const s = calculateSozialhilfe(profil(8000));
    expect(s.deficit).toBe(0);
    expect(s.eligible).toBe(false);
    expect(s.anspruchOffen).toBe(true);
    expect(s.efbEntscheidet).toBe(false);
    expect(s.offenText).toBe('pegel.konkubinatBetragOffen');
    expect(s.hinweise).not.toContain('pegel.konkubinatOffen');
  });

  it('Pegel und Signal behaupten nichts', () => {
    const p = sozialhilfePegelState(profil(8000));
    expect(p.mode).toBe('offen');
    expect(p.amount).toBe(0);
    expect(p.offenText).toBe('pegel.konkubinatBetragOffen');
    expect((anspruchSignale(profil(8000)).behoerden || []).find((x) => x.key === 'sozialhilfe')).toBeUndefined();
  });

  it('Keine 0 als Aussage: Seite und Dossier zeigen keine Zeile mit Betrag', () => {
    const quelle = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
    expect(quelle('../SozialhilfeView.jsx')).toContain("sozialhilfe.betragOffen || sozialhilfe.efbEntscheidet ? '—'");
    expect(quelle('../dossierGenerator.js')).toContain("!sozialhilfe.betragOffen && { label: t('sozialhilfe.deficit')");
  });

  it('Rechner bekommt die Sperre', () => {
    expect(sozialhilfeVorbefuellung(profil(8000)).konkubinatBetragOffen).toBe(true);
  });

  it('Gegenprobe: ohne Partnerlohn und in der Ehe wie bisher', () => {
    const ohne = calculateSozialhilfe(profil(0));
    expect(ohne.eligible).toBe(true);
    expect(ohne.deficit).toBeGreaterThan(0);
    expect(ohne.hinweise).toContain('pegel.konkubinatOffen');
    expect(sozialhilfeVorbefuellung(profil(0)).konkubinatBetragOffen).toBe(false);
    const ehe = calculateSozialhilfe(profil(1000, {}, 'married'));
    expect(ehe.offenText).toBe('pegel.coveredOffen');
    expect(ehe.deficit).toBeGreaterThan(0);
  });

  it('Eigenes Einkommen deckt den Bedarf: gewöhnliches Nein', () => {
    const s = calculateSozialhilfe(profil(8000, { monthlyIncome: 9000, incomeType: 'netto' }));
    expect(s.anspruchOffen).toBe(false);
  });

  it('Text in fünf Sprachen, ohne Betrag', () => {
    for (const l of [de, en, fr, it_, rm]) expect(l.pegel.konkubinatBetragOffen.length).toBeGreaterThan(40);
    expect(de.pegel.konkubinatBetragOffen).toMatch(/Sozialdienst/);
  });
});

describe('Hauptlohn 0 plus Nebenerwerb nicht netto', () => {
  it('kein Betrag aus Einkommen 0', () => {
    const f = { monthlyIncome: 0, incomeType: 'netto', sideIncome: 2000, sideIncomeType: 'brutto' };
    expect(sozialhilfeVorbefuellung({ finanzen: f }).lohnNichtUebernommen).toBe(true);
    expect(sozialhilfeVorbefuellung({ finanzen: { ...f, sideIncomeType: 'netto' } }).lohnNichtUebernommen).toBe(false);
  });
});
