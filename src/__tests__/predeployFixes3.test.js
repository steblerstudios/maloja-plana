import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { sozialhilfeVorbefuellung } from '../utils/sozialhilfeVorbefuellung.js';
import de from '../i18n/de.js';

const quelle = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const profil = (employmentType) => ({ basis: { canton: 'AG', dateOfBirth: '2008-03-01' }, wohnen: { rentAmount: '600' }, versicherungen: { kkPremium: '300' }, finanzen: { employmentType, monthlyIncome: '1200', incomeType: 'netto' } });

describe('Predeploy 02.11.2026, dritte Runde', () => {
  it('Lernende: kein Einkommensfreibetrag, Rechnung und Rechner gleich', () => {
    const lernend = calculateSozialhilfe(profil('apprentice'));
    const angestellt = calculateSozialhilfe(profil('employed'));
    expect(lernend.efb).toBe(0);
    expect(lernend.deficit).toBe(calculateSozialhilfe(profil(undefined)).deficit);
    expect(angestellt.efb).toBeGreaterThan(0);
    expect(lernend.erwerbsunkostenOffen).toBe(true);
    expect(sozialhilfeVorbefuellung(profil('apprentice')).erwerbstaetig).toBe(false);
    expect(sozialhilfeVorbefuellung(profil('employed')).erwerbstaetig).toBe(true);
  });

  it('Unfall: kein pauschaler Satz zu Arbeitslosen', () => {
    expect(de.absicherung?.unfallArbeitslos ?? quelle('../i18n/de.js')).toContain('AVIG Art. 8');
    expect(quelle('../i18n/de.js')).not.toContain('Wer arbeitslos ist, ist obligatorisch');
  });

  it('IV-Nachzahlung nennt die Ausnahme, die Rechnung den Aufschub', () => {
    expect(de.hilflos.wartezeitIv).toContain('(Abs. 2)');
    expect(de.hilflos.wartezeitIv).not.toContain('höchstens');
    expect(de.hilflos.aufschubNote).toContain('Art. 43bis');
    expect(quelle('../HilflosenRechner.jsx')).toContain("t('hilflos.aufschubNote')");
  });

  it('F, N, S: der Hinweis steht am Betrag', () => {
    expect(quelle('../components/Leistungsliste.jsx').match(/sh\.ansatzTiefer/g).length).toBe(2);
    expect(quelle('../SozialhilfeRechner.jsx')).toContain("hatAusweisFNS(data) && t('pegel.ansatzTiefer')");
  });
});
