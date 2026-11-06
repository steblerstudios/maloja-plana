// Querverweise und Abfolge (Fassung 9, F9-D3 und F9-D5, Stebler Studios 06.11.2026 «Ja, Querverweise»).
// D3: verwandte Seiten verweisen in beide Richtungen, der Name kommt aus dem Register.
// D5: das Dringende steht vorn — «Verloren» bei Ausweis und Führerausweis, die Fristen beim Asyl.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ansichtName } from '../config/ansichtenRegister.js';
import { VERWANDTE } from '../config/ablaufVerwandte.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { Ausweis } from '../Ausweis.jsx';
import { Fuehrerausweis } from '../Fuehrerausweis.jsx';
import de from '../i18n/de.js';

const lese = (o, k) => k.split('.').reduce((x, y) => (x ? x[y] : undefined), o);
const t = (k, p) => { const v = lese(de, k); let s = typeof v === 'string' ? v : (v && v.sie) || k; for (const [a, b] of Object.entries(p || {})) s = s.replace('{' + a + '}', b); return s; };
const quelle = (d) => fs.readFileSync(path.resolve(__dirname, '..', d), 'utf8');

describe('Querverweise in beide Richtungen', () => {
  for (const [datei, ziel] of [
    ['PremiumSubsidy.jsx', 'kvgwechsel'], ['KVGWechsel.jsx', 'premium'], ['KVGLeistungen.jsx', 'kvgwechsel'],
    ['Todesfall.jsx', 'ergaenzungsleistungen'], ['AlvRechner.jsx', 'stelleverloren'], ['SozialhilfeView.jsx', 'stelleverloren'],
    ['Patientenverfuegung.jsx', 'vorsorgeauftrag'], ['Bestattung.jsx', 'vorsorgeauftrag'],
  ]) {
    it(`${datei} → ${ziel}`, () => {
      expect(quelle(datei)).toContain(`onNavigate('${ziel}')`);
      expect(ansichtName(ziel), `Name im Register für ${ziel}`).toBeTruthy();
    });
  }
  it('Todesfall nennt die Ergänzungsleistungen unter «Verwandte»', () => {
    expect(VERWANDTE.todesfall).toContain('ergaenzungsleistungen');
  });
});

describe('Das Dringende zuerst', () => {
  const ersterSchritt = (html) => {
    const i = html.indexOf('data-ablauf-schritt="1"');
    return html.slice(i, html.indexOf('data-ablauf-schritt="2"'));
  };
  it('Ausweis: «Verloren oder gestohlen» ist Schritt 1', () => {
    const html = renderToStaticMarkup(React.createElement(Ausweis, { palette: LIGHT_PALETTE, t, onNavigate: () => {} }));
    expect(ersterSchritt(html)).toContain('Verloren oder gestohlen');
  });
  it('Führerausweis: «Verlust oder Diebstahl» ist Schritt 1', () => {
    const html = renderToStaticMarkup(React.createElement(Fuehrerausweis, { palette: LIGHT_PALETTE, t, onNavigate: () => {} }));
    expect(ersterSchritt(html)).toContain('Verlust oder Diebstahl');
  });
  it('Asyl: die Fristen stehen vor den Ausweistypen', () => {
    const src = quelle('AsylView.jsx');
    expect(src.indexOf("t('asyl.fristenTitle')")).toBeLessThan(src.indexOf("t('asyl.statusTitle')"));
  });
  it('Nummern in den Titeln folgen der neuen Reihenfolge, in allen fünf Sprachen', () => {
    for (const l of ['de', 'fr', 'it', 'en', 'rm']) {
      const s = quelle(`i18n/${l}.js`);
      for (const ns of ['ausweis', 'fuehrerausweis']) {
        const block = s.match(new RegExp(`\\n  ${ns}: \\{([\\s\\S]*?)\\n  \\},`))[1];
        expect(block, `${l}.${ns}.step5Title`).toMatch(/step5Title: (\{ sie: )?['"]1 ·/);
        expect(block, `${l}.${ns}.step1Title`).toMatch(/step1Title: (\{ sie: )?['"]2 ·/);
      }
    }
  });
});
