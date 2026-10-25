// Nachträge aus der Fachprüfung zum Muster M1–M8 (#581, 25.10.2026; Sophie: «ok sauber weiter»).
// 1. Wochenaufenthalt: das Feld speichert `weekly`/`secondary`, PremiumSubsidy und Sozialhilfe verglichen mit
//    'wochenaufenthalt'/'nebenwohnsitz' — ihre Hinweise erschienen nie.
// 2. «trifft nicht zu» für Felder, die oft nicht gelten (Pensionskasse, Familienzulagen, Kinderbetreuung).
// 3. Der AHV-Beitrag ist ein Jahresbetrag: in der Liste mit «/ Jahr».
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import { SozialhilfeView } from '../SozialhilfeView.jsx';
import { ChapterViewComplete } from '../ChapterView.jsx';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { DEMO_DATA } from '../config/demoData.js';

const t = createT({ de }, 'de', 'sie');
const mit = (residenceType) => ({ ...DEMO_DATA, wohnen: { ...DEMO_DATA.wohnen, residenceType } });
const premium = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette: LIGHT_PALETTE, t, data, onNavigate: () => {}, onUpdateData: () => {} }));
const sozialhilfe = (data) => renderToStaticMarkup(React.createElement(SozialhilfeView, { palette: LIGHT_PALETTE, t, data, onNavigate: () => {} }));

describe('Wochenaufenthalt wird erkannt (gespeicherter Wert `weekly`)', () => {
  it('Prämienverbilligung: Hinweis bei `weekly`, nicht bei `main`', () => {
    expect(premium(mit('weekly'))).toContain(t('premium.weeklyIpvNote'));
    expect(premium(mit('main'))).not.toContain(t('premium.weeklyIpvNote'));
  });
  it('Sozialhilfe: Hinweis bei `weekly`, nicht bei `main`', () => {
    expect(sozialhilfe(mit('weekly'))).toContain(t('sozialhilfe.weeklyNote'));
    expect(sozialhilfe(mit('main'))).not.toContain(t('sozialhilfe.weeklyNote'));
  });
  it('Prämienverbilligung nennt den Kanton, mit dem gerechnet wird', () => {
    expect(premium(mit('weekly'))).toContain('Gerechnet wird mit dem Kanton Zürich. Das stimmt nur, wenn dort Ihr Hauptwohnsitz ist.');
  });
  it('Sozialhilfe bei Wochenaufenthalt: Notlage am Aufenthaltsort, Miete, Steuern mit Vorbehalt', () => {
    const html = sozialhilfe(mit('weekly'));
    expect(html).toContain('In einer akuten Notlage hilft auch die Gemeinde, in der Sie sich gerade aufhalten.');
    expect(html).toContain(t('sozialhilfe.weeklyMiete'));
    expect(html).toContain('kann die Steuerverwaltung anders entscheiden');
  });
  it('Nebenwohnsitz: Hinweise zu Prämie, IPV und Sozialhilfe — ohne Steuersatz und ohne Miete-Satz', () => {
    expect(premium(mit('secondary'))).toContain(t('premium.nebenResidence'));
    expect(premium(mit('secondary'))).toContain(t('premium.weeklyIpvNote'));
    const html = sozialhilfe(mit('secondary'));
    expect(html).toContain(t('sozialhilfe.nebenResidence'));
    expect(html).toContain(t('sozialhilfe.weeklyNote'));
    expect(html).not.toContain('kann die Steuerverwaltung anders entscheiden');
    expect(html).not.toContain(t('sozialhilfe.weeklyMiete'));
  });
  it('ältere Profile mit dem alten Wort gelten weiter', () => {
    expect(premium(mit('wochenaufenthalt'))).toContain(t('premium.weeklyIpvNote'));
  });
});

const kapitel = (k) => getChapters(t).find((c) => c.key === k);
const feld = (kap, k) => kapitel(kap).fields.find((f) => f.k === k);

describe('«trifft nicht zu» und «/ Jahr»', () => {
  it('Pensionskasse: «trifft nicht zu», Beitrag und Guthaben gehen mit', () => {
    expect(feld('versicherungen', 'bvgInsurer').naOk).toBe(true);
    expect(feld('versicherungen', 'bvgInsurer').naMit).toEqual(['bvgContribution', 'bvgBalance']);
    expect(feld('versicherungen', 'bvgContribution').naVon).toBe('bvgInsurer');
    expect(feld('versicherungen', 'bvgBalance').naVon).toBe('bvgInsurer');
  });
  it('Familienzulagen und Kinderbetreuung: «trifft nicht zu»', () => {
    expect(feld('finanzen', 'familienzulagen').naOk).toBe(true);
    expect(feld('finanzen', 'childcare').naOk).toBe(true);
  });
  it('Pensionskasse «trifft nicht zu» → Berufliche Vorsorge ohne Zählung der drei Felder als fehlend', () => {
    const data = { ...DEMO_DATA.versicherungen, bvgInsurer: '', bvgContribution: '', bvgBalance: '', _na: ['bvgInsurer', 'bvgContribution', 'bvgBalance'] };
    const html = renderToStaticMarkup(React.createElement(ChapterViewComplete, {
      palette: LIGHT_PALETTE, t, chapter: kapitel('versicherungen'), data, allData: { ...DEMO_DATA, versicherungen: data },
      onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {},
    }));
    const vorsorge = html.slice(html.indexOf('id="mp-section-bvgInsurer"'), html.indexOf('id="mp-section-uvg"'));
    expect(vorsorge).not.toMatch(/Nicht erfasst:[^<]*Pensionskasse/);
    expect(vorsorge).not.toContain('data-fehlt="bvg');
  });
  it('AHV-Beitrag mit «/ Jahr»', () => {
    expect(feld('versicherungen', 'ahvContribution').jahr).toBe(true);
    const data = { ...DEMO_DATA.versicherungen, ahvContribution: 4200 };
    const html = renderToStaticMarkup(React.createElement(ChapterViewComplete, {
      palette: LIGHT_PALETTE, t, chapter: kapitel('versicherungen'), data, allData: { ...DEMO_DATA, versicherungen: data },
      onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {},
    }));
    expect(html).toMatch(/AHV-Beitrag<\/dt><dd[^>]*>CHF 4’200\u00a0\/ Jahr</);
  });
});
