import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChapterViewComplete } from '../ChapterView.jsx';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { DEMO_DATA } from '../config/demoData.js';

// Entscheid Stebler Studios 27.09.2026: die Kapitelseite zeigt jeden Wert EINMAL, als
// Abschnittsliste; «ändern ›» öffnet genau diesen Abschnitt. Vorher Satz + Tabelle + Formular.
const t = createT({ de }, 'de', 'sie');
const kapitel = (k) => getChapters(t).find((c) => c.key === k);
const render = (key, data, extra = {}) => renderToStaticMarkup(React.createElement(ChapterViewComplete, {
  palette: LIGHT_PALETTE, t, chapter: kapitel(key), data, allData: { ...DEMO_DATA, [key]: data },
  onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {}, ...extra,
}));

describe('Abschnittsliste', () => {
  it('Finanzen, ausgefüllt: Abschnitte als Liste, kein offenes Formular', () => {
    const html = render('finanzen', DEMO_DATA.finanzen);
    expect(html).toContain('Einkommen');
    expect(html).toContain('ändern ›');
    expect(html).toMatch(/<dd[^>]*>CHF 6’200<\/dd>/);
    expect(html).not.toMatch(/<input[^>]*type="number"/);
  });

  it('der Einkommensbetrag steht einmal, nicht dreimal', () => {
    const html = render('finanzen', DEMO_DATA.finanzen);
    const treffer = html.match(/6’200/g) || [];
    // einmal im Satz, einmal in der Liste — früher zusätzlich Tabelle + Eingabefeld
    expect(treffer.length).toBeLessThanOrEqual(3);
  });

  it('leerer Abschnitt: gestrichelt, «ergänzen ›», «noch leer»', () => {
    const html = render('finanzen', { ...DEMO_DATA.finanzen, debtPayments: '', alimentePaid: '' });
    expect(html).toContain('ergänzen ›');
    expect(html).toContain('noch leer');
  });

  it('ein leeres Feld der Grundordnung öffnet seinen Abschnitt von selbst', () => {
    const html = render('basis', { canton: 'ZH' });
    expect(html).toMatch(/<input[^>]*autocomplete="given-name"/i);
  });

  it('anfangsOffen «alle» öffnet alles (Formular-Tests)', () => {
    const html = render('finanzen', DEMO_DATA.finanzen, { anfangsOffen: 'alle' });
    expect(html).toContain('fertig');
    expect(html).toMatch(/<input/);
  });

  it('kein Vorspann mehr: keine «Ihre Daten fliessen in»-Chips', () => {
    const html = render('finanzen', DEMO_DATA.finanzen);
    expect(html).not.toContain(t('chapterView.benefitsLabel'));
  });
});
