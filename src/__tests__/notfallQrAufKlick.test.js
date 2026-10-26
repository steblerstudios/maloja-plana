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

// Beim ersten Render darf nichts gezeichnet werden (Effekte laufen hier ohnehin nicht — doppelte Sicherung).
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
    expect(html).toMatch(/<button[^>]*aria-expanded="false"[^>]*><span aria-hidden="true">(?:(?!<\/button>).)*<\/span>notfallDossier\.qrAnzeigen<\/button>/);
    expect(html).not.toContain('notfallDossier.qrAusblenden');
    // Hinweis (K101) steht weiter über dem Knopf, damit man vor dem Anzeigen weiss, was darin steht.
    expect(html.indexOf('notfallDossier.qrHint')).toBeLessThan(html.indexOf('notfallDossier.qrAnzeigen'));
    // Die Kürzungs-Notiz gehört zum sichtbaren Code, nicht zum Knopf.
    expect(html).not.toContain('notfallDossier.qrGekuerzt');
    expect(gezeichnet).toHaveLength(0);
  });

  // Quelltext-Wächter, kein Verhaltenstest: die Testumgebung hat kein DOM (kein jsdom), renderToStaticMarkup
  // führt keine Effekte aus und kann nicht klicken. Das Umschalten ist im Browser geprüft (26.10.2026).
  it('Quelltext-Wächter: Effekt zeichnet erst, wenn sichtbar; ohne Inhalte wieder verborgen', () => {
    const src = fs.readFileSync(path.resolve(__dirname, '../NotfallDossier.jsx'), 'utf8');
    expect(src).toMatch(/if \(!qrSichtbar \|\| !hasSections \|\| !qrRef\.current\) return;/);
    expect(src).toMatch(/const \[qrSichtbar, setQrSichtbar\] = useState\(false\);/);
    expect(src).toMatch(/if \(!hasSections\) setQrSichtbar\(false\);/);
    // nicht gespeichert: kein localStorage für den Zustand
    expect(src).not.toMatch(/localStorage[^\n]*qr/i);
  });

  it('der Hinweis sagt, dass der Code zum Mitführen erst angezeigt werden muss', () => {
    expect(de.notfallDossier.qrHint).toContain('den Code anzeigen, dann');
    expect(en.notfallDossier.qrHint).toContain('show the code, then');
  });

  it('Knopf in allen fünf Sprachen', () => {
    for (const s of [de, en, fr, itSprache, rm]) {
      expect(s.notfallDossier.qrAnzeigen).toBeTruthy();
      expect(s.notfallDossier.qrAusblenden).toBeTruthy();
    }
  });
});
