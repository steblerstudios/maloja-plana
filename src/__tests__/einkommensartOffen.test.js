import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { AlvRechner } from '../AlvRechner.jsx';
import { EOrechner } from '../EOrechner.jsx';
import { VorsorgeRechner } from '../VorsorgeRechner.jsx';
import { SozialhilfeRechner } from '../SozialhilfeRechner.jsx';

// Predeploy-Gate 25.09.2026: derselbe Lohn ohne gewählte Einkommensart galt im EO-, AHV/BVG-
// und ALV-Rechner als brutto, im Sozialhilfe-Rechner als netto. Die Zusage jetzt: ist die Art
// offen, füllt KEIN Rechner den Lohn vor, und jeder sagt am Feld, warum. Geprüft wird, was die
// Nutzerin sieht — das gerenderte Feld und der Hinweis, nicht die Hilfsfunktion.
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
const LOHN = 5137; // unverwechselbar, damit ein vorbefülltes Feld auffällt (×12 = 61644, ×13 = 66781)
const offen = { finanzen: { monthlyIncome: LOHN } };

const render = (Comp, data) => renderToStaticMarkup(React.createElement(Comp, { palette, t, data, onNavigate: () => {}, onUpdateData: () => {} }));
const RECHNER = [
  ['ALV', AlvRechner, 'offenBrutto'],
  ['EO', EOrechner, 'offenBrutto'],
  ['AHV/BVG', VorsorgeRechner, 'offenBrutto'],
  ['Sozialhilfe', SozialhilfeRechner, 'offenNetto'],
];
const lohnImFeld = (html) => /value="(5137|61644|66781)"/.test(html);

describe('Einkommensart offen → kein Rechner füllt den Lohn vor', () => {
  for (const [name, Comp, hinweis] of RECHNER) {
    it(`${name}: Feld leer, Hinweis sichtbar`, () => {
      const html = render(Comp, offen);
      expect(lohnImFeld(html), `${name} hat den Lohn trotz offener Art übernommen`).toBe(false);
      expect(html).toContain(de.einkommensart[hinweis]);
    });
  }

  it('Gegenprobe: mit passender Art füllen alle vier vor', () => {
    for (const [name, Comp, hinweis] of RECHNER) {
      const art = hinweis === 'offenNetto' ? 'netto' : 'brutto';
      const html = render(Comp, { finanzen: { monthlyIncome: LOHN, incomeType: art } });
      expect(lohnImFeld(html), `${name} füllt mit incomeType ${art} nicht vor`).toBe(true);
      expect(html).not.toContain(de.einkommensart[hinweis]);
    }
  });

  it('Sozialhilfe: Nebenerwerb ohne Art zählt nicht mit und wird gemeldet', () => {
    const html = render(SozialhilfeRechner, { finanzen: { monthlyIncome: 3000, incomeType: 'netto', sideIncome: 400 } });
    expect(html).toMatch(/value="3000"/);
    expect(html).not.toMatch(/value="3400"/);
    expect(html).toContain(de.einkommensart.nebenOffen);
  });
});

describe('Demo-Profil hat eine gewählte Einkommensart', () => {
  // Live 25.09.2026 aufgefallen: die Demo hatte monthlyIncome ohne incomeType und zeigte darum in
  // vier Rechnern nur Hinweise. Entscheid Stebler Studios: netto — Steuern und Sozialhilfe rechnen.
  it('netto: Steuerschätzung rechnet, Sozialhilfe ist vorbefüllt', async () => {
    const { DEMO_DATA } = await import('../config/demoData.js');
    const { steuerbaresEinkommenFuerProfil, steuerEingabenAusDaten } = await import('../data/kantonaleSteuerdaten.js');
    const { sozialhilfeVorbefuellung } = await import('../utils/sozialhilfeVorbefuellung.js');
    expect(DEMO_DATA.finanzen.incomeType).toBe('netto');
    expect(steuerbaresEinkommenFuerProfil(steuerEingabenAusDaten(DEMO_DATA)).steuerbar).toBeGreaterThan(0);
    expect(sozialhilfeVorbefuellung(DEMO_DATA).einkommen).toBe(String(DEMO_DATA.finanzen.monthlyIncome));
  });
});
