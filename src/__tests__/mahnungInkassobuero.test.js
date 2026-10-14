// Mahnung, Schritt 3 — Inkassobüro statt Gläubiger (Nachtrag 28.09.2026 zu #408).
// Quelle: schuldeninfo.ch (Berner Schuldenberatung), Stichwort «Inkassobüros» (04.2024):
// Vollmacht/Abtretung verlangen; geschuldet nur Forderung, Verzugszins, berechtigte Betreibungskosten.
// SchKG Art. 27 Abs. 2 (Fassung seit 1.1.2018, gelesen in der Konsolidierung 1.1.2026):
// «Die Kosten der Vertretung im Verfahren vor den Betreibungs- und Konkursämtern dürfen nicht
// der Gegenpartei überbunden werden.» — der Text pinnt die Sache, nicht die Schreibweise.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

const here = dirname(fileURLToPath(import.meta.url));
const texte = { de, en, fr, it: it_, rm };
const beide = (v) => (typeof v === 'string' ? [v] : [v.sie, v.du]);

describe('Mahnung Schritt 3 — Inkassobüro', () => {
  it('nennt in allen fünf Sprachen Vollmacht/Abtretung und SchKG Art. 27 Abs. 2', () => {
    for (const [lang, t] of Object.entries(texte)) {
      const fassungen = beide(t.mahnung.step3Inkasso);
      expect(fassungen.length, lang).toBeGreaterThan(0);
      for (const s of fassungen) {
        expect(s, lang).toMatch(/27/);
        // rm: «plainpudair» (Vollmacht), seit der rm-Fassung vom 28.09.2026 — vorher deutscher Rückfall
        expect(s, lang).toMatch(/Vollmacht|power of attorney|procuration|procura|plainpudair/);
      }
    }
  });

  it('verspricht keinen Höchstsatz und keine Zahl, die die Quelle nicht nennt', () => {
    for (const [lang, t] of Object.entries(texte)) {
      for (const s of beide(t.mahnung.step3Inkasso)) {
        expect(s, lang).not.toMatch(/CHF|Fr\.|%/);
      }
    }
  });

  it('die Quellen-Zeile führt schuldeninfo.ch «Inkassobüros» und SchKG Art. 27', () => {
    for (const [lang, t] of Object.entries(texte)) {
      expect(t.mahnung.quelle, lang).toContain('schuldeninfo.ch/Schulden-ABC.html#inkassob');
      expect(t.mahnung.quelle, lang).toMatch(/529_488_529\/(de|en|fr|it|rm)#art_27/);
    }
  });

  it('der Ablauf zeigt den Absatz unter Schritt 3', () => {
    const src = readFileSync(join(here, '..', 'MahnungErhalten.jsx'), 'utf8');
    expect(src).toContain("t('mahnung.step3Inkasso')");
  });
});
