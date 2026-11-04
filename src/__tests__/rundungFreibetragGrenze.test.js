import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { sozialhilfeVorbefuellung } from '../utils/sozialhilfeVorbefuellung.js';
import { getBehoerdenDossierPreview } from '../dossierGenerator.js';
import { SozialhilfeRechner } from '../SozialhilfeRechner.jsx';
import { betrag } from '../utils/geld.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Predeploy 1e6819ab: ZH, allein, Lohn 800 netto, Sparkonto 3000.40, Wertschriften 3000.40. Karte und Blatt rundeten je
// Zeile (6000, Betrag), der Rechner erst die Summe (6001, «Vermögen zuerst»). Eine Regel: je Zeile (vermoegenSumme).
const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const profil = (finanzen) => ({
  basis: { canton: 'ZH', dateOfBirth: '1986-03-01', household: { adults: 1, children: [] } },
  finanzen: { employmentType: 'employed', monthlyIncome: 800, incomeType: 'netto', ...finanzen },
  wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 300 },
});
const rechner = (d) => renderToStaticMarkup(React.createElement(SozialhilfeRechner, { palette, t, data: d, onNavigate: () => {} }));

describe('Rappen an der Freibetrags-Grenze: Seite = Rechner = Blatt', () => {
  const grenze = profil({ savingsAccount: 3000.4, securitiesValue: 3000.4 });

  it('alle drei zählen dasselbe Vermögen', () => {
    const s = calculateSozialhilfe(grenze);
    expect(s.vermoegen).toBe(6000);
    expect(Number(sozialhilfeVorbefuellung(grenze).vermoegen)).toBe(s.vermoegen);
  });

  it('der gerenderte Rechner nennt denselben Betrag wie Karte und Blatt, kein «Vermögen zuerst»', () => {
    const s = calculateSozialhilfe(grenze);
    expect(s.deficit).toBeGreaterThan(0);
    const html = rechner(grenze);
    expect(html).not.toContain(de.sh.vermoegenZuerstTitel);
    expect(html).toContain(betrag(s.deficit));
    expect(JSON.stringify(getBehoerdenDossierPreview(grenze, [], t, { sozialhilfe: s }))).toContain(betrag(s.deficit));
  });

  it('über der Grenze sagen beide «Vermögen zuerst»', () => {
    const drueber = profil({ savingsAccount: 3000.6, securitiesValue: 3000.4 });
    expect(calculateSozialhilfe(drueber).vermoegenZuerst).toBe(true);
    expect(rechner(drueber)).toContain(de.sh.vermoegenZuerstTitel);
  });

  // Fachprüfung 639b6495: dieselbe Regel für den Titel und für Rappen, die direkt ins Feld getippt werden.
  it('Titel «Vermögen zuerst» und Rechnerfeld runden gleich', () => {
    const halb = profil({ savingsAccount: 3000.5, securitiesValue: 2999.5 });
    const s = calculateSozialhilfe(halb);
    expect(s.vermoegen).toBe(6001);
    expect(s.offenTitel).toBe('sh.vermoegenZuerstTitel');
    const feld = { ...profil({ savingsAccount: 6000.4 }) };
    expect(calculateSozialhilfe(feld).vermoegenZuerst).toBe(false);
    expect(rechner(feld)).not.toContain(de.sh.vermoegenZuerstTitel);
  });

  // Schlussprüfung 8fa8721c: Ein negativer Kontostand zählt als 0, auch im Titel (wie Karte und Blatt), nicht als Abzug.
  it('negativer Kontostand zählt als 0, auch für den Titel', () => {
    const p = profil({ savingsAccount: -10, securitiesValue: 6000.6 });
    const s = calculateSozialhilfe(p);
    expect(s.vermoegen).toBe(6001);
    expect(s.offenTitel).toBe('sh.vermoegenZuerstTitel');
    expect(Number(sozialhilfeVorbefuellung(p).vermoegen)).toBe(6001);
  });

  it('leer bleibt leer im Rechner', () => {
    expect(sozialhilfeVorbefuellung(profil({})).vermoegen).toBe('');
    expect(sozialhilfeVorbefuellung(profil({ savingsAccount: 0 })).vermoegen).toBe('0');
  });
});
