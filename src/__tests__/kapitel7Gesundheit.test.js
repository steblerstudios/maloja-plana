// Kapitel 7 · Gesundheit (Befund docs/design/kapitel-7-gesundheit.html, Entscheid Stebler Studios 10.11.2026
// «Ja, alles bauen»). Jeder Test pinnt die Sache, die jemanden falsch handeln liess.
import { describe, it, expect, beforeEach } from 'vitest';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import { vorlageHtml } from '../data/vorsorgeauftrag.js';

beforeEach(() => { globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }; });
const t = createT({ de }, 'de', 'sie');
const SPRACHEN = { de, fr, it: it_, en, rm };

describe('L1 · Vorlage zum Vorsorgeauftrag ohne Unterschriftslinien (ZGB Art. 361 Abs. 2)', () => {
  const html = vorlageHtml({}, {}, t, 'de');
  it('druckt keine Linie für Ort, Datum oder Unterschrift', () => {
    expect(html).not.toContain('class="pv-linie"');
    expect(html).not.toMatch(/>Unterschrift</);
  });
  it('sagt stattdessen: von Hand auf die Abschrift', () => {
    expect(html).toContain('Ort, Datum und Unterschrift setzen Sie von Hand auf Ihre Abschrift, nicht auf dieses Blatt.');
    expect(html).toContain('auch nicht mit Unterschrift');
  });
  it('hat den Satz in allen fünf Sprachen', () => {
    for (const [lang, d] of Object.entries(SPRACHEN)) {
      const tt = createT({ [lang]: d }, lang, 'sie');
      expect(tt('va.doc.handschrift'), lang).not.toBe('va.doc.handschrift');
    }
  });
});
