import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import { CANTON_CODES } from '../config/cantonalData.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Codex-Audit 24.09.2026 — drei Zusagen, die vorher nicht galten:
//   1. Die IPV-Kachel verspricht «Kanton und Einkommen im Rechner» — ohne Kanton gab es dort
//      aber kein Feld, nur einen Verweis in zwei andere Kapitel (Sackgasse).
//   2. Die Kacheln nennen keinen Frankenbetrag: «Bis CHF 3'600» hatte keinen Beleg (E9) und
//      «Ab CHF 800» las sich wie ein Preis.
//   3. «Was ist jetzt dran?» nennt eine Handlung, nicht nur das Feld («Vorname»).

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const ohneKanton = { basis: {}, finanzen: {}, wohnen: {}, versicherungen: {} };

describe('Codex-Audit: IPV ohne Kanton ist keine Sackgasse', () => {
  it('zeigt die Kantonswahl direkt im Rechner, mit allen 26 Kantonen', () => {
    const html = renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data: ohneKanton, onUpdateData: () => {} }));
    expect(html).toMatch(/<select[^>]*id="ipv-kanton"/);
    expect(html).toContain('for="ipv-kanton"');
    for (const c of CANTON_CODES) expect(html).toContain('value="' + c + '"');
    expect(CANTON_CODES).toHaveLength(26);
    expect(html).not.toContain('premium.enterCanton');
  });

  it('ohne Schreibweg bleibt der Hinweis — nie ein Feld, das nichts speichert', () => {
    const html = renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data: ohneKanton }));
    expect(html).not.toContain('ipv-kanton');
    expect(html).toContain('premium.enterCanton');
  });
});

const sprachen = { de, en, fr, it: it_, rm };
const alleFormen = (v) => (typeof v === 'string' ? [v] : Object.values(v || {}));

describe('Codex-Audit: Texte in allen fünf Sprachen', () => {
  for (const [lang, d] of Object.entries(sprachen)) {
    it(lang + ': die Einstiegs-Kacheln nennen keinen Frankenbetrag', () => {
      for (const k of ['highlightTaxSub', 'highlightIpvSub']) {
        const formen = alleFormen(d.dashboard[k]);
        expect(formen.length).toBeGreaterThan(0);
        for (const s of formen) expect(s).not.toMatch(/CHF|\d{3}/);
      }
    });
    it(lang + ': der nächste Schritt setzt das Feld in eine Handlung', () => {
      const s = d.dashboard.nextUpAction;
      expect(typeof s).toBe('string');
      expect(s).toContain('{feld}');
      expect(s.replace('{feld}', '').trim().length).toBeGreaterThan(2);
    });
    it(lang + ': die Kantonswahl im IPV-Rechner ist beschriftet', () => {
      for (const k of ['cantonChoose', 'cantonSavedHint']) expect(alleFormen(d.premium[k]).length).toBeGreaterThan(0);
    });
  }
});
