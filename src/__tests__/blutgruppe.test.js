import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { blutgruppeLabel } from '../utils/blutgruppe.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import en from '../i18n/en.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Befund 27.09.2026: «Blutgruppe aPos» stand im Dashboard, in der Kapitel-Tabelle,
// auf der gedruckten Notfallkarte und im Organspende-QR.
describe('blutgruppeLabel', () => {
  const t = createT({ de }, 'de', 'sie');

  it('zeigt das Etikett, nicht den gespeicherten Schlüssel', () => {
    expect(blutgruppeLabel('aPos', t)).toBe('A+');
    expect(blutgruppeLabel('abNeg', t)).toBe('AB−');
    expect(blutgruppeLabel('oPos', t)).toBe('0+');
  });

  it('unbekannt und leer ergeben nichts', () => {
    expect(blutgruppeLabel('unknown', t)).toBe('');
    expect(blutgruppeLabel('', t)).toBe('');
    expect(blutgruppeLabel(undefined, t)).toBe('');
  });

  it('fremde Werte bleiben stehen, statt als Schlüsselpfad zu erscheinen', () => {
    expect(blutgruppeLabel('A+', t)).toBe('A+');
  });

  it('alle Sprachen kennen alle Blutgruppen', () => {
    for (const [lang, tr] of Object.entries({ de, fr, en, it: it_, rm })) {
      const tl = createT({ [lang]: tr, de }, lang, 'sie');
      for (const k of ['oPos', 'oNeg', 'aPos', 'aNeg', 'bPos', 'bNeg', 'abPos', 'abNeg']) {
        expect(blutgruppeLabel(k, tl), lang + ':' + k).not.toBe(k);
      }
    }
  });

  // Wächter: kein Leser reicht den rohen Wert mehr durch.
  it('keine Anzeige liest bloodType roh', () => {
    const dateien = ['Dashboard.jsx', 'ChapterView.jsx', 'MirrorCards.jsx', 'OrganDonation.jsx'];
    for (const d of dateien) {
      const src = fs.readFileSync(path.join(__dirname, '..', d), 'utf8');
      expect(src, d).not.toMatch(/type: chData\.bloodType\b|escapeHtml\(data\.bloodType\)|': ' \+ data\.bloodType|value: data\.bloodType\b|String\(data\.notfall\?\.bloodType/);
    }
  });
});
