import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nContext } from '../i18n/index.js';
import { getChapters } from '../config/constants.js';
import DashboardComplete from '../Dashboard.jsx';

// Der Prozent-Kreis im Berg-Bild stand bis 25.09.2026 erst ab 10 % Gesamtfortschritt.
// Seither: sobald etwas begonnen ist, auch bei 1 % (Entscheid Stebler Studios).
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k) => k;
const chapters = getChapters(t);
const zeichne = (data, completion) => renderToStaticMarkup(
  React.createElement(I18nContext.Provider,
    { value: { lang: 'de', t, anrede: 'sie', setLang: () => {}, setAnrede: () => {} } },
    React.createElement(DashboardComplete, {
      palette, t, chapters, data, completion,
      onSelectChapter: () => {}, onNavigate: () => {},
      demoMode: false, onEnterDemo: () => {}, simpleView: false, isDarkMode: false,
    })));

describe('Dashboard — Prozent-Kreis ohne 10-%-Schwelle', () => {
  it('ein Feld ausgefüllt, 1 % gesamt: der Kreis steht', () => {
    const html = zeichne({ basis: { firstName: 'Alex' } }, 1);
    expect(html).toContain('berg-prozent');
    expect(html).toContain('1%');
  });
  it('nichts begonnen: kein Kreis, nur der ruhige Satz', () => {
    expect(zeichne({}, 0)).not.toContain('berg-prozent');
  });
});
