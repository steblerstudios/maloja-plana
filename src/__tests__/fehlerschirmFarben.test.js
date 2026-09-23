// Fehlerschirm · Farben (23.09.2026) — die zweite Hälfte von B-5.
//
// PR #273 hat dem Absturz-Schirm die Sprache gegeben, die Farben blieben offen:
// `palette` wird nicht übergeben, also standen dort dunkle Rückfallwerte — im
// Hellmodus erschien der Schirm dunkel. Jetzt liest er das Thema aus derselben
// Quelle wie die App (`or5_theme`).
//
// Der letzte Block ist der wichtige: die Thema-Logik steht an DREI Stellen
// (constants.js, main.jsx, public/theme-init.js). Die dritte ist unvermeidlich —
// das Script läuft im <head> vor dem Bundle und kann nichts importieren. Also
// wird die Gleichheit hier gehalten, nicht gehofft.
import { describe, it, expect, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
import ErrorBoundary from '../ErrorBoundary.jsx';
import { paletteAusSpeicher, DARK_PALETTE, LIGHT_PALETTE } from '../config/constants.js';

const quelle = (...teile) => fs.readFileSync(path.resolve(__dirname, '..', ...teile), 'utf8');
const speicher = (werte) => ({ getItem: (k) => (k in werte ? werte[k] : null) });

describe('Die Farbtafel kommt aus dem Speicher', () => {
  it('hell, wenn das Thema hell ist', () => {
    expect(paletteAusSpeicher(speicher({ or5_theme: 'false' })).bg).toBe(LIGHT_PALETTE.bg);
  });

  it('dunkel, wenn das Thema dunkel ist', () => {
    expect(paletteAusSpeicher(speicher({ or5_theme: 'true' })).bg).toBe(DARK_PALETTE.bg);
  });

  it('dunkel ohne Eintrag — derselbe Default wie theme-init.js', () => {
    expect(paletteAusSpeicher(speicher({})).bg).toBe(DARK_PALETTE.bg);
  });

  it('dunkel bei gesperrtem Speicher und bei Unrat im Eintrag — wirft nie', () => {
    const gesperrt = { getItem: () => { throw new Error('privates Fenster'); } };
    expect(paletteAusSpeicher(gesperrt).bg).toBe(DARK_PALETTE.bg);
    expect(paletteAusSpeicher(speicher({ or5_theme: '{kaputt' })).bg).toBe(DARK_PALETTE.bg);
  });

  it('nimmt den Farbenblind-Modus mit', () => {
    const p = paletteAusSpeicher(speicher({ or5_theme: 'false', or5_colorblind: '1' }));
    expect(p.colorBlind).toBe(true);
    expect(p.sage).not.toBe(LIGHT_PALETTE.sage);
  });
});

describe('Der Fehlerschirm folgt dem Thema', () => {
  afterEach(() => { delete globalThis.localStorage; });

  // klein geschrieben: React gibt die Hex-Werte so weiter, wie sie in der Tafel
  // stehen (gross) — der Vergleich soll an der Schreibweise nicht scheitern.
  const schirm = () => {
    const eb = new ErrorBoundary({});
    eb.state = { hasError: true, error: new Error('Kaputt') };
    eb.context = null;
    return renderToString(eb.render()).toLowerCase();
  };

  it('ist im Hellmodus hell', () => {
    globalThis.localStorage = speicher({ or5_theme: 'false' });
    const html = schirm();
    expect(html).toContain(LIGHT_PALETTE.bg.toLowerCase());
    expect(html).not.toContain(DARK_PALETTE.bg.toLowerCase());
  });

  it('ist im Dunkelmodus dunkel', () => {
    globalThis.localStorage = speicher({ or5_theme: 'true' });
    expect(schirm()).toContain(DARK_PALETTE.bg.toLowerCase());
  });

  it('rendert auch ohne jeden Speicher — dunkel, kein Absturz im Absturz-Schirm', () => {
    expect(() => schirm()).not.toThrow();
    expect(schirm()).toContain(DARK_PALETTE.bg.toLowerCase());
  });
});

describe('Eine Wahrheit, drei Stellen — Schlüssel und Default sind gleich', () => {
  const stellen = [
    ['config/constants.js', quelle('config', 'constants.js')],
    ['main.jsx', quelle('main.jsx')],
    ['public/theme-init.js', fs.readFileSync(path.resolve(__dirname, '..', '..', 'public', 'theme-init.js'), 'utf8')],
  ];

  it('alle drei lesen or5_theme', () => {
    for (const [name, text] of stellen) {
      expect(text, name).toContain("'or5_theme'");
    }
  });

  // Nicht auf `getItem(` gemustert: constants.js liest über einen eigenen kleinen
  // Leser (`laden('or5_theme')`), damit der gesperrte Speicher gefangen wird. Der
  // gemeinsame Teil ist der Schlüssel und der Default, nicht die Schreibweise.
  it('alle drei fallen auf dunkel zurück', () => {
    for (const [name, text] of stellen) {
      expect(text, name + ": Default 'true' fehlt").toMatch(/'or5_theme'\s*\)\s*\|\|\s*'true'/);
    }
  });
});
