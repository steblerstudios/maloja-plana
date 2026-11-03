import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SozialhilfeRechner } from '../SozialhilfeRechner.jsx';
import { SozialhilfeView } from '../SozialhilfeView.jsx';
import { createT } from '../i18n/index.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { bvgHerausloesen } from '../utils/unterstuetzungseinheit.js';
import { sozialhilfeVorbefuellung } from '../utils/sozialhilfeVorbefuellung.js';
import de from '../i18n/de.js';

// F8-Prüfer 03.11.2026: SKOS-RL D.3.3 Abs. 3 (Version vom 1.1.2026): «Vermögen der 2. Säule und der Säule 3a sind
// grundsätzlich zusammen mit dem AHV-Vorbezug oder dem Bezug einer ganzen IV-Rente herauszulösen.» Abs. 5: ausgelöst
// zählt es zum Vermögen. Was ausbezahlt wird, kennt das Profil nicht: kein Betrag, ein Hinweis.
const heute = new Date(2026, 10, 3);
const jung = { canton: 'ZH', dateOfBirth: '1986-03-01', gender: 'm', household: { adults: 1, children: [] } };
const vorbezug = { ...jung, dateOfBirth: '1963-01-01' }; // 63 Jahre: frühester AHV-Vorbezug für Männer
const profil = (basis, versicherungen = {}, finanzen = {}) => ({
  basis, finanzen: { monthlyIncome: 800, incomeType: 'netto', savingsAccount: 1000, ...finanzen },
  wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 300, ...versicherungen },
});

describe('2. Säule in der Sozialhilfe (SKOS-RL D.3.3 Abs. 3)', () => {
  it('Auslöser: Vorbezugsalter oder ganze IV-Rente, und nur mit Guthaben', () => {
    expect(bvgHerausloesen({}, { bvgBalance: 80000 }, vorbezug, heute)).toBe(true);
    expect(bvgHerausloesen({ ivBezug: 'ganz' }, { bvgBalance: 80000 }, jung, heute)).toBe(true);
    expect(bvgHerausloesen({ ivBezug: 'teil' }, { bvgBalance: 80000 }, jung, heute)).toBe(false);
    expect(bvgHerausloesen({}, { bvgBalance: 80000 }, jung, heute)).toBe(false);
    expect(bvgHerausloesen({}, { bvgBalance: '' }, vorbezug, heute)).toBe(false);
    expect(bvgHerausloesen({}, { bvgBalance: 80000 }, { ...vorbezug, dateOfBirth: '' }, heute)).toBe(false);
  });

  it('im Vorbezugsalter mit Guthaben und Lücke: kein Betrag, der Grund steht da', () => {
    const ohne = calculateSozialhilfe(profil(vorbezug));
    expect(ohne.deficit).toBeGreaterThan(0);
    const mit = calculateSozialhilfe(profil(vorbezug, { bvgBalance: 80000 }));
    expect(mit).toMatchObject({ bvgOffen: true, betragOffen: true, deficit: 0, eligible: false, offenText: 'sh.bvgHerausloesen' });
    // Das Guthaben steckt nicht im Vermögen: Die Seite erfindet keine Kapitalsumme.
    expect(mit.vermoegen).toBe(ohne.vermoegen);
    expect(mit.hinweise).not.toContain('sh.bvgHerausloesen');
  });

  it('jünger: Das Guthaben ändert nichts', () => {
    const a = calculateSozialhilfe(profil(jung));
    const b = calculateSozialhilfe(profil(jung, { bvgBalance: 80000 }));
    expect(b.deficit).toBe(a.deficit);
    expect(b.bvgOffen).toBe(false);
  });

  it('Lohn deckt den Bedarf: kein Betrag zu sperren, aber der Hinweis bleibt', () => {
    const s = calculateSozialhilfe(profil(vorbezug, { bvgBalance: 80000 }, { monthlyIncome: 9000 }));
    expect(s.deficit).toBe(0);
    expect(s.offenText).not.toBe('sh.bvgHerausloesen');
    expect(s.hinweise).toContain('sh.bvgHerausloesen');
  });

  it('der Rechner wartet auf das angepasste Vermögen, wie bei der Rente', () => {
    expect(sozialhilfeVorbefuellung(profil(vorbezug, { bvgBalance: 80000 }), heute).bvgOffen).toBe(true);
    expect(sozialhilfeVorbefuellung(profil(jung, { bvgBalance: 80000 }), heute).bvgOffen).toBe(false);
  });

  it('die Texte nennen die Fundstelle und keinen Betrag', () => {
    expect(de.sh.bvgHerausloesen).toContain('D.3.3 Abs. 3 und 5');
    expect(de.sh.bvgEintragen.sie).toContain('D.3.3 Abs. 3');
    expect(de.sh.bvgHerausloesen).not.toMatch(/\d['’]\d{3}/);
  });

  it('Rechner und Seite: kein Franken-Betrag, der Grund steht da', () => {
    const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
    const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
    const render = (C, d) => renderToStaticMarkup(React.createElement(C, { palette, t, data: d, onNavigate: () => {} }));
    const d = profil(vorbezug, { bvgBalance: 80000 }, { employmentType: 'employed' });
    const rechner = render(SozialhilfeRechner, d);
    expect(rechner).toContain(de.sh.bvgEintragen.sie.slice(0, 40));
    const seite = render(SozialhilfeView, d);
    expect(seite).toContain(de.sh.bvgHerausloesen.slice(0, 40));
    // Gegenprobe: ohne Guthaben rechnet der Rechner.
    expect(render(SozialhilfeRechner, profil(vorbezug, {}, { employmentType: 'employed' }))).not.toContain(de.sh.bvgEintragen.sie.slice(0, 40));
  });
});
