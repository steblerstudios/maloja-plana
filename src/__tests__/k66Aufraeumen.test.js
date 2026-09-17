// K66: Aufräumen ohne Verhaltensänderung — die zusammengeführten Helfer liefern
// dieselben Ausgaben wie die früheren Einzelfassungen.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chf, annahmenTexte } from '../utils/steuerTexte.js';
import { LOESCH_SIGNAL } from '../utils/datenLoeschen.js';
import { LegalView } from '../LegalView.jsx';

const t = (k) => '«' + k + '»';

// Die frühere Inline-Fassung aus dossierGenerator.js / KantonssteuerOrientierung.jsx, wörtlich.
const alteAnnahmen = (t, annahmen) => [
  annahmen?.ohneDreizehnten && t('tax.annahmeOhneDreizehnten'),
  annahmen?.alleinverdiener && t('tax.annahmeAlleinverdiener'),
].filter(Boolean);

describe('K66 annahmenTexte', () => {
  const faelle = [undefined, null, {}, { ohneDreizehnten: true }, { alleinverdiener: true },
    { ohneDreizehnten: true, alleinverdiener: true }, { ohneDreizehnten: false, alleinverdiener: 0 }];
  it.each(faelle.map((f) => [JSON.stringify(f), f]))('gleiche Sätze für %s', (_, annahmen) => {
    expect(annahmenTexte(t, annahmen)).toEqual(alteAnnahmen(t, annahmen));
  });
  it('Reihenfolge: 13. Monatslohn vor Alleinverdiener', () => {
    expect(annahmenTexte(t, { alleinverdiener: true, ohneDreizehnten: true }))
      .toEqual(['«tax.annahmeOhneDreizehnten»', '«tax.annahmeAlleinverdiener»']);
  });
});

describe('K66 chf', () => {
  const alteChf = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '’');
  it.each([0, 7, 999.4, 999.5, 1000, 12345.6, 1234567, -4321])('gleich wie vorher für %s', (n) => {
    expect(chf(n)).toBe(alteChf(n));
  });
});

describe('K66 Löschsignal in main.jsx', () => {
  it('der Text-Schlüssel im storage-Listener ist LOESCH_SIGNAL', () => {
    const src = fs.readFileSync(path.resolve(__dirname, '../main.jsx'), 'utf8');
    const m = src.match(/e\.key !== '([^']+)'/);
    expect(m).not.toBe(null);
    expect(m[1]).toBe(LOESCH_SIGNAL);
  });
});

describe('K66 LegalView reicht t an externe Links durch', () => {
  it('externe Links tragen den übersetzten Hinweis', () => {
    const palette = new Proxy({}, { get: () => '#000' });
    // Ein Text mit URL (autoLink) und einer mit Gesetzesbegriff (LEGAL_LINKS).
    const tMarke = (k) => k === 'legal.privacy.responsible1' ? 'Siehe https://example.ch und nDSG.' : 'Ü:' + k;
    const html = renderToStaticMarkup(React.createElement(LegalView, { palette, t: tMarke, lang: 'de', onNavigate: () => {}, section: 'privacy' }));
    expect(html).toContain('href="https://example.ch"');
    expect(html).toContain('href="https://www.fedlex.admin.ch/eli/cc/2022/491/de"');
    // der a11y-Hinweis kommt aus derselben t-Funktion wie der Rest der Seite — bei beiden Links
    expect(html.split('(Ü:a11y.neuerTab)').length - 1).toBeGreaterThanOrEqual(2);
  });
});
