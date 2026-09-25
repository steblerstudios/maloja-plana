// K123 · die Zusage an der AUFRUFSTELLE: was die Notfall-Seite tatsächlich an den QR übergibt,
// und dass das Kästchen an der KK-Karte erscheint und leer ist. Der Test daneben
// (k123AhvNurAufWunsch) prüft die Bausteine; dieser prüft, dass die Seiten sie benutzen.
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getChapters } from '../config/constants.js';
import { LIGHT_PALETTE } from '../config/constants.js';

const aufrufe = [];
vi.mock('../utils/qrSicher.js', async (orig) => {
  const echt = await orig();
  return { ...echt, qrNotfallVcard: (abschnitte, opt) => { aufrufe.push(abschnitte); return echt.qrNotfallVcard(abschnitte, opt); } };
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
const AHV = '756.1234.5678.90';
const data = {
  basis: { firstName: 'Zoë', lastName: 'Müller', phone: '079 123 45 67', ahv: AHV },
  notfall: { emergencyContact: 'Kim', emergencyPhone: '079 000 00 00', bloodType: 'A+' },
  versicherungen: { kkInsurer: 'ÖKK', kkCardNumber: '80756001234567890' },
};

describe('K123 · Aufrufstelle', () => {
  it('die Notfall-Seite übergibt dem QR keine AHV-Zeile — obwohl sie im Dossier steht', async () => {
    const { NotfallDossier } = await import('../NotfallDossier.jsx');
    aufrufe.length = 0;
    const html = renderToStaticMarkup(React.createElement(NotfallDossier, { palette: LIGHT_PALETTE, t, data, chapters: getChapters(t), onNavigate: () => {} }));
    expect(html).toContain(AHV); // die Seite zeigt sie (gedrucktes Dossier)
    expect(aufrufe.length).toBeGreaterThan(0);
    const felder = aufrufe.at(-1).flatMap((s) => s.rows.map((r) => r.feld));
    expect(felder).toContain('notfall.bloodType');
    expect(felder).not.toContain('basis.ahv');
  });

  it('die KK-Karte zeigt das Kästchen, nicht angekreuzt, sobald eine AHV-Nummer da ist', async () => {
    const { KKScanner } = await import('../KKScanner.jsx');
    const html = renderToStaticMarkup(React.createElement(KKScanner, { palette: LIGHT_PALETTE, t, data, onSave: () => {} }));
    const box = html.match(/<label[^>]*>(?:(?!<\/label>).)*kkScanner\.ahvImQr(?:(?!<\/label>).)*<\/label>/);
    expect(box).not.toBeNull();
    expect(box[0]).toMatch(/type="checkbox"/);
    expect(box[0]).not.toMatch(/checked/);
  });

  it('ohne AHV-Nummer kein Kästchen', async () => {
    const { KKScanner } = await import('../KKScanner.jsx');
    const html = renderToStaticMarkup(React.createElement(KKScanner, { palette: LIGHT_PALETTE, t, data: { ...data, basis: { ...data.basis, ahv: '' } }, onSave: () => {} }));
    expect(html).not.toContain('kkScanner.ahvImQr');
  });
});
