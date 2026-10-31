// F7-L2 und F7-L1 (31.10.2026): keine Seite endet ohne nächsten Schritt, «Jemand schuldet Geld» hat einen Eingang.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SeitenSchluss, SCHLUSS_ZIELE } from '../components/SeitenSchluss.jsx';
import { LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';

const t = createT({ de }, 'de', 'sie');
const seite = (view) => renderToStaticMarkup(React.createElement(SeitenSchluss, { palette: LIGHT_PALETTE, t, view, onNavigate: () => {} }));
const quelle = (d) => fs.readFileSync(path.resolve(__dirname, '..', d), 'utf8');

describe('Seitenschluss', () => {
  it('main.jsx und die Tabelle nennen dieselben Seiten', () => {
    const m = /const MIT_SEITENSCHLUSS = \[([^\]]+)\]/.exec(quelle('main.jsx'));
    expect(m[1].match(/'(\w+)'/g).map((s) => s.slice(1, -1)).sort()).toEqual(Object.keys(SCHLUSS_ZIELE).sort());
  });
  it.each([
    ['kk', 'Weiter mit Versicherungen & Vorsorge'], ['sync', 'Weiter mit Finanzen & Geld'], ['direktlinks', 'Weiter mit Was steht mir zu?'],
    ['export', 'Weiter mit Dokumentenablage'], ['notifications', 'Weiter mit Was ansteht'],
  ])('%s führt weiter: %s', (view, text) => {
    expect(seite(view).replace(/&amp;/g, '&')).toContain(text);
  });
  it('Flyer und Installation führen zur Übersicht', () => {
    expect(seite('flyer')).toContain('Als Nächstes');
    expect(seite('installApp')).toContain('Übersicht');
  });
  it('andere Seiten bekommen nichts', () => {
    expect(seite('tax')).toBe('');
  });
  it('der Schluss liegt nicht im Hauptbündel', () => {
    expect(quelle('main.jsx')).toContain("React.lazy(() => import('./components/SeitenSchluss.jsx'))");
  });
  it('«Jemand schuldet Geld» hat einen Eingang aus dem Kapitel Behörden (F7-L1)', () => {
    expect(quelle('ChapterView.jsx')).toContain("weg('selbstmahnen')");
  });
});
