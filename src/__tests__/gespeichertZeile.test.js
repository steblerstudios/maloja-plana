// Speichern-Knöpfe sagen «Gespeichert» — über EINEN Baustein.
//
// Bis 24.09.2026 speicherten KK-Karte, Organspende, Steuerrechner und Schuldenmanager
// ohne ein Wort. Jetzt zeigt jede dieser Ansichten `GespeichertZeile`; die Zeile ist
// eine Status-Region, die immer im DOM steht und sich erst füllt.
import { describe, it, expect } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { GespeichertZeile } from '../components/GespeichertZeile.jsx';

const palette = { sageDeep: '#3a5a4a', sage: '#8fb0a0' };
const t = (k) => (k === 'common.saved' ? 'Gespeichert' : k);
const zeile = (sichtbar) => renderToStaticMarkup(React.createElement(GespeichertZeile, { palette, t, sichtbar }));

describe('GespeichertZeile', () => {
  it('steht auch leer als Status-Region im DOM', () => {
    expect(zeile(false)).toMatch(/^<p role="status"[^>]*><\/p>$/);
  });
  it('füllt sich mit «Gespeichert», wenn sichtbar', () => {
    expect(zeile(true)).toMatch(/role="status"/);
    expect(zeile(true)).toContain('Gespeichert');
  });
  it('die vier Ansichten mit Speichern-Knopf benutzen sie', () => {
    for (const d of ['KKScanner.jsx', 'OrganDonation.jsx', 'TaxCalculator.jsx', 'SchuldenManager.jsx']) {
      const q = fs.readFileSync(path.resolve(__dirname, '..', d), 'utf8');
      expect(q, d).toMatch(/createElement\(GespeichertZeile, \{ palette, t, sichtbar: /);
    }
  });
  it('Organspende und Steuer zeigen es nur, solange der Stand dem gespeicherten gleicht', () => {
    for (const d of ['OrganDonation.jsx', 'TaxCalculator.jsx']) {
      const q = fs.readFileSync(path.resolve(__dirname, '..', d), 'utf8');
      expect(q, d).toMatch(/sichtbar: gespeichertAls === stand/);
      expect(q, d).toMatch(/setGespeichertAls\(stand\)/);
    }
  });
});
