import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ZipExport } from '../ZipExport.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { LIGHT_PALETTE, DARK_PALETTE, applyColorBlind } from '../config/constants.js';

// ─────────────────────────────────────────────────────────────
// K53 (Bau-Liste §13) — der gesperrte Knopf «verschlüsselt exportieren».
// Vorher: Schwarz auf palette.mid → hell 3.38:1. Gesperrte Bedienelemente sind
// von WCAG 1.4.3 ausgenommen; lesbar sollen sie trotzdem sein. Jetzt: Text mid auf
// der Fläche up (vorhandene Tokens), und das «geht nicht» trägt nicht die Farbe
// allein, sondern auch der gestrichelte Rand und der Sperr-Cursor.
// Kontrast-Formel wie in dashboardMountainLabelContrast.test.js (dort dupliziert,
// es gibt kein gemeinsames Kontrast-Modul).
// ─────────────────────────────────────────────────────────────

function luminanz(hex) {
  const h = hex.replace('#', '');
  const kanal = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * kanal[0] + 0.7152 * kanal[1] + 0.0722 * kanal[2];
}
function kontrast(a, b) {
  const la = luminanz(a), lb = luminanz(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const t = createT({ de }, 'de', 'sie');

function knopf(html, label) {
  const ende = html.indexOf(label);
  const start = html.lastIndexOf('<button', ende);
  return html.slice(start, ende);
}

describe('K53 · gesperrter Export-Knopf', () => {
  beforeEach(() => {
    const map = new Map();
    globalThis.localStorage = {
      getItem: (k) => (map.has(k) ? map.get(k) : null),
      setItem: (k, v) => { map.set(k, String(v)); },
      removeItem: (k) => { map.delete(k); },
    };
  });

  for (const [name, palette] of [
    ['hell', LIGHT_PALETTE],
    ['dunkel', DARK_PALETTE],
    ['hell, Farbenblind', applyColorBlind(LIGHT_PALETTE, true)],
    ['dunkel, Farbenblind', applyColorBlind(DARK_PALETTE, true)],
  ]) {
    it(name + ': Text mid auf up trägt ≥ 4.5:1', () => {
      expect(kontrast(palette.mid, palette.up)).toBeGreaterThanOrEqual(4.5);
    });
  }

  it('ohne Passphrase: gesperrt, gestrichelt, Sperr-Cursor, Text in mid', () => {
    const html = renderToStaticMarkup(React.createElement(ZipExport, {
      palette: LIGHT_PALETTE, t, data: { basis: {} }, documents: [], demoMode: false,
    }));
    const b = knopf(html, t('backup.exportEncrypted'));
    expect(b).toContain('disabled=""');
    expect(b).toContain('cursor:not-allowed');
    expect(b).toContain('border:1px dashed ' + LIGHT_PALETTE.mid);
    expect(b).toContain('background:' + LIGHT_PALETTE.up);
    expect(b).toContain('color:' + LIGHT_PALETTE.mid);
  });
});
