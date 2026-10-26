// Notfall-QR erst auf Klick (Entscheid Stebler Studios 26.10.2026, Vorschlag rechts-pruefer): der Code trägt
// Gesundheitsangaben unverschlüsselt und war sofort sichtbar, sobald das Notfall-Dossier Inhalte hatte.
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js'; // nicht «it» — das überschriebe vitests it()
import rm from '../i18n/rm.js';

const gezeichnet = [];
vi.mock('../utils/qrSicher.js', async (orig) => {
  const echt = await orig();
  return { ...echt, qrZeichnen: (...a) => { gezeichnet.push(a); return true; } };
});

let gesetzt = [];
beforeAll(() => {
  for (const k of ['window', 'document']) if (!(k in globalThis)) gesetzt.push(k);
  globalThis.window ??= globalThis;
  globalThis.document ??= {
    documentElement: { tagName: 'div' },
    getElementById: () => null,
    createElement: () => ({ style: {}, getContext: () => null, appendChild() {}, setAttribute() {} }),
  };
});
afterAll(() => { for (const k of gesetzt) delete globalThis[k]; gesetzt = []; });

const t = (k) => k;
const data = {
  basis: { firstName: 'Anna', lastName: 'Muster' },
  notfall: { emergencyContact: 'Kim', emergencyPhone: '079 000 00 00', bloodType: 'aPos', allergies: 'Penicillin' },
};

describe('Notfall-QR erst auf Klick', () => {
  it('beim Öffnen: Knopf «QR anzeigen», zugeklappt, keine Code-Fläche', async () => {
    const { NotfallDossier } = await import('../NotfallDossier.jsx');
    const html = renderToStaticMarkup(React.createElement(NotfallDossier, { palette: LIGHT_PALETTE, t, data, chapters: getChapters(t), onNavigate: () => {} }));
    expect(html).toMatch(/<button[^>]*aria-expanded="false"[^>]*>notfallDossier\.qrAnzeigen<\/button>/);
    expect(html).not.toContain('notfallDossier.qrAusblenden');
    // Hinweis (K101) steht weiter über dem Knopf, damit man vor dem Anzeigen weiss, was darin steht.
    expect(html.indexOf('notfallDossier.qrHint')).toBeLessThan(html.indexOf('notfallDossier.qrAnzeigen'));
    // Die Kürzungs-Notiz gehört zum sichtbaren Code, nicht zum Knopf.
    expect(html).not.toContain('notfallDossier.qrGekuerzt');
  });

  it('gezeichnet wird nur, wenn sichtbar (Quelle: Effekt prüft qrSichtbar zuerst)', () => {
    const src = fs.readFileSync(path.resolve(__dirname, '../NotfallDossier.jsx'), 'utf8');
    expect(src).toMatch(/if \(!qrSichtbar \|\| !hasSections \|\| !qrRef\.current\) return;/);
    expect(src).toMatch(/useState\(false\);\s*\n\s*useEffect/);
    // nicht gespeichert: kein localStorage für den Zustand
    expect(src).not.toMatch(/localStorage[^\n]*qr/i);
  });

  it('Knopf in allen fünf Sprachen', () => {
    for (const s of [de, en, fr, itSprache, rm]) {
      expect(s.notfallDossier.qrAnzeigen).toBeTruthy();
      expect(s.notfallDossier.qrAusblenden).toBeTruthy();
    }
  });
});
