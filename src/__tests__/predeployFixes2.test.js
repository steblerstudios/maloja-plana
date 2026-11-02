import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { useEinkommen } from '../components/EinkommenFeld.jsx';
import { merkeWahl, leseWahl } from '../utils/hashRouter.js';
import { sozialhilfePegelState } from '../data/pegel.js';

const quelle = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const profil = (f, v = {}) => ({ basis: { canton: 'ZH', dateOfBirth: '1985-03-01' }, wohnen: { rentAmount: '1200' }, finanzen: f, versicherungen: v });

// Der Haken läuft echt, ohne DOM: renderToString führt useState aus.
const feld = (data) => {
  let e;
  const Probe = () => { e = useEinkommen(data); return null; };
  renderToString(React.createElement(Probe));
  return e;
};

describe('Predeploy 02.11.2026, zweite Runde', () => {
  it('Selbständige mit brutto: Feld und Sozialhilfe rechnen mit demselben Einkommen', () => {
    const data = profil({ employmentType: 'selfEmployed', monthlyIncome: '2800', incomeType: 'brutto' });
    const e = feld(data);
    expect(e.nettoMonat).toBe(2800);
    expect(e.nettoMonat).toBe(calculateSozialhilfe(data).income);
    expect(e.gegenwert).toBe(0);
    expect(e.geschaetzt).toBe(false);
  });

  it('Angestellte mit brutto: Feld und Sozialhilfe bleiben gleich und geschätzt', () => {
    const data = profil({ employmentType: 'employed', monthlyIncome: '4000', incomeType: 'brutto' });
    const e = feld(data);
    expect(e.nettoMonat).toBeLessThan(4000);
    expect(e.nettoMonat).toBe(calculateSozialhilfe(data).income);
    expect(e.geschaetzt).toBe(true);
  });

  it('Mögliche Quellensteuer, Feld auf netto: kein Brutto; die Art kommt aus dem Feld', () => {
    const data = { ...profil({ employmentType: 'employed', monthlyIncome: '4000', incomeType: 'netto' }) };
    data.basis = { ...data.basis, nationality: 'other', residencePermit: 'B' };
    const mitNetto = feld(data);
    expect(mitNetto.gegenwert).toBe(0);
    expect(quelle('../components/EinkommenFeld.jsx')).toContain('incomeType: art');
  });

  it('Hinweis erscheint auch ohne erfasste Beiträge, nicht ohne Einkommen', () => {
    expect(calculateSozialhilfe(profil({ employmentType: 'selfEmployed', monthlyIncome: '3300', incomeType: 'netto' })).vorBeitraegen).toBe(true);
    expect(calculateSozialhilfe(profil({ employmentType: 'selfEmployed' })).vorBeitraegen).toBe(false);
  });

  it('Der Nebenerwerb einer selbständigen Person behält seine Art', () => {
    const sh = calculateSozialhilfe(profil({ employmentType: 'selfEmployed', monthlyIncome: '1500', incomeType: 'brutto', sideIncome: '2000', sideIncomeType: 'brutto' }));
    expect(sh.income).toBeLessThan(3500);
    expect(sh.income).toBeGreaterThan(1500);
  });

  it('Hinweis und offener Zustand stehen an allen Anzeigen', () => {
    for (const p of ['../BudgetSync.jsx', '../components/FinanzAuswertung.jsx', '../components/Leistungsliste.jsx']) {
      const s = quelle(p);
      expect(s).toContain("t('pegel.vorBeitraegen')");
      expect(s).toContain('anspruchOffen ?');
    }
  });

  it('Der offene Satz gilt nur knapp über dem Bedarf', () => {
    const lohn = (monthlyIncome) => calculateSozialhilfe(profil({ employmentType: 'employed', monthlyIncome, incomeType: 'netto' }));
    const bedarf = lohn('12000').totalBedarf;
    expect(lohn('12000').anspruchOffen).toBe(false);
    expect(lohn('12000').erwerbsunkostenOffen).toBe(true);
    expect(sozialhilfePegelState(profil({ employmentType: 'employed', monthlyIncome: '12000', incomeType: 'netto' })).mode).toBe('covered');
    const knapp = lohn(String(Math.round(bedarf * 1.05)));
    expect(knapp.eligible).toBe(false);
    expect(knapp.anspruchOffen || knapp.efbEntscheidet).toBe(true);
    expect(lohn(String(Math.round(bedarf * 1.2))).anspruchOffen).toBe(false);
    expect(calculateSozialhilfe(profil({ employmentType: 'retired', monthlyIncome: String(Math.round(bedarf * 1.05)), incomeType: 'netto' })).anspruchOffen).toBe(false);
  });

  it('ALV-Rechner: bei keinLohn kein Vorbefüllen und ein eigener Hinweis', () => {
    const s = quelle('../AlvRechner.jsx');
    expect(s).toContain("profilLohn > 0 && sperre !== 'keinLohn' ? String(");
    expect(s).toContain("t('alv.keinLohnHint')");
  });

  describe('Gemerkte Wahl', () => {
    afterEach(() => vi.unstubAllGlobals());
    const speicher = () => {
      const m = new Map();
      vi.stubGlobal('sessionStorage', { getItem: (k) => m.get(k) ?? null, setItem: (k, w) => m.set(k, w), removeItem: (k) => m.delete(k) });
    };

    it('Ohne Wahl wird der Eintrag geleert', () => {
      speicher();
      merkeWahl('drucken', 'amt');
      expect(leseWahl('drucken')).toBe('amt');
      merkeWahl('drucken', undefined);
      expect(leseWahl('drucken')).toBeUndefined();
    });

    it('Kein Effekt auf [view, wahl]: gemerkt wird, wo die Wahl fällt', () => {
      const s = quelle('../main.jsx');
      expect(s).not.toMatch(/useEffect\(\(\) => \{[^\n]*merkeWahl/);
      expect(s).toContain('onWahl: waehle');
      expect(s).toContain('onReiter: waehle');
      expect(s).toContain('SEITEN_MIT_WAHL.includes(viewName)');
    });
  });
});
