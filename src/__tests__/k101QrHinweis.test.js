// K101 (Entscheid Stebler Studios, 19.09.2026): Der ehrliche Hinweis des Notfall-QR
// («nicht verschlüsselt, für alle lesbar, die scannen · Bildschirmfoto oder Seite drucken»)
// steht auch am Krankenkassen- und am Organspende-QR — gleicher Schlüssel, gleiche Optik,
// ohne Live-Region (er steht beim Erscheinen des Blocks schon da).
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const quelle = datei => fs.readFileSync(path.join(__dirname, '..', datei), 'utf8');

// Die Optik des Hinweises im Notfall-Dossier (Bestand seit 0.1.36).
const OPTIK = "style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginBottom: '12px' }";

const stellen = [
  // [Datei, Marke des QR-Behälters, der NACH dem Hinweis kommt]
  ['NotfallDossier.jsx', 'ref: qrRef'],
  ['KKScanner.jsx', "id: 'kk-qr-output'"],
  ['OrganDonation.jsx', 'ref: qrRef, style'],
];

describe('K101 · QR-Hinweis an allen drei QR-Stellen', () => {
  for (const [datei, behaelter] of stellen) {
    it(`${datei}: Hinweis steht über dem QR, in derselben Optik`, () => {
      const src = quelle(datei);
      const i = src.indexOf("t('notfallDossier.qrHint')");
      expect(i).toBeGreaterThan(-1);
      const element = src.slice(src.lastIndexOf('React.createElement', i), i);
      expect(element).toContain(OPTIK);
      const j = src.indexOf(behaelter, i);
      expect(j).toBeGreaterThan(i);
      // Keine Live-Region am Hinweis.
      expect(element).not.toMatch(/role:\s*'status'|aria-live/);
    });
  }

  // Zeitgrenze 30 s: lädt alle fünf Sprachdateien per dynamischem Import; unter Last
  // lag das bei 5,0–5,2 s und fiel als Timeout rot (24.09.2026).
  it('der Schlüssel ist in allen fünf Sprachen vorhanden', { timeout: 30_000 }, async () => {
    for (const lang of ['de', 'fr', 'it', 'en', 'rm']) {
      const { default: tr } = await import(`../i18n/${lang}.js`);
      const wert = (tr.notfallDossier || {}).qrHint;
      expect(typeof wert, lang).toBe('string');
      expect(wert.length, lang).toBeGreaterThan(40);
    }
  });
});
