// Wächter: Es steht dran, welche Rechtstext-Fassung verbindlich ist.
//
// Befund (Tester-Durchsicht 23.09.2026, Schutz-Durchgang 28.09.2026, § 2 D): Es gibt drei
// parallele Fassungen — die öffentliche Seite /rechtliches/, der Text in der App unter
// «Datenschutz & Rechtliches», und die Arbeitsdokumente in docs/legal/. Keine sagte, welche
// gilt. Seit 28.09.2026 sagt es jede: die veröffentlichten Fassungen gelten (Seite für
// Website + Erklärseiten, App-Text für die Anwendung); docs/legal ist Arbeitsfassung.
//
// Der Wächter pinnt die Sache, nicht die Schreibweise: an jeder der drei Stellen muss der
// Verweis auf «docs/legal» als NICHT verbindliche Fassung stehen — in allen fünf Sprachen.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { inhaltFuer } from '../../scripts/seiten-inhalt.mjs';
import { SPRACHEN } from '../../scripts/seiten-sprachen.mjs';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

const I18N = { de, en, fr, it: it_, rm };
const lies = (datei) => readFileSync(join(process.cwd(), datei), 'utf8');

/** Ein Text «sagt, dass docs/legal nicht verbindlich ist», wenn er docs/legal nennt UND
 *  das Wort für verbindlich/massgebend in der jeweiligen Sprache trägt. */
const VERBINDLICH_WORT = /verbindlich|binding|fait foi|font foi|vincolante|fanno fede|fa fede|liant/i;
export const sagtVerbindlichkeit = (text) =>
  typeof text === 'string' && text.includes('docs/legal') && VERBINDLICH_WORT.test(text);

const alsText = (eintrag) => (typeof eintrag === 'string' ? eintrag : `${eintrag?.sie ?? ''} ${eintrag?.du ?? ''}`);

describe('Rechtstexte — es steht dran, welche Fassung verbindlich ist', () => {
  it('Vorbedingung: fünf Sprachen', () => {
    expect(SPRACHEN.map((s) => s.code).sort()).toEqual(['de', 'en', 'fr', 'it', 'rm']);
  });

  describe('A · öffentliche Seite /rechtliches/ (Vorspann)', () => {
    for (const sprache of SPRACHEN) {
      it(`${sprache.code}: Vorspann nennt docs/legal als nicht verbindlich`, () => {
        const seite = inhaltFuer(sprache.code).sonderseiten.find((s) => s.pfad === 'rechtliches');
        expect(seite, 'Sonderseite rechtliches fehlt').toBeTruthy();
        expect(sagtVerbindlichkeit(seite.vorspann), seite.vorspann).toBe(true);
      });
    }
  });

  describe('B · In-App «Datenschutz & Rechtliches» (legal.privacy.responsible5)', () => {
    for (const [code, t] of Object.entries(I18N)) {
      it(`${code}: responsible5 vorhanden und sagt es`, () => {
        const text = alsText(t.legal?.privacy?.responsible5);
        expect(text.trim().length, 'Schlüssel fehlt').toBeGreaterThan(40);
        expect(sagtVerbindlichkeit(text), text).toBe(true);
        expect(text).toContain('malojaplana.ch/rechtliches');
      });
    }
  });

  describe('C · Arbeitsdokumente docs/legal/ tragen den Hinweis im Kopf', () => {
    for (const datei of ['datenschutzerklaerung-ndsg.md', 'impressum.md', 'nutzungsbedingungen.md']) {
      it(`${datei}: «Nicht die verbindliche Fassung» in den ersten 8 Zeilen`, () => {
        const kopf = lies(`docs/legal/${datei}`).split('\n').slice(0, 8).join('\n');
        expect(kopf).toContain('Nicht die verbindliche Fassung');
        expect(kopf).toContain('malojaplana.ch/rechtliches/');
      });
    }
  });

  describe('D · Gegenprobe — der Wächter beisst', () => {
    it('ein Text ohne docs/legal gilt nicht', () => {
      expect(sagtVerbindlichkeit('Verbindlich ist die Fassung in der App.')).toBe(false);
    });
    it('ein Text mit docs/legal, aber ohne Verbindlichkeits-Wort gilt nicht', () => {
      expect(sagtVerbindlichkeit('Siehe docs/legal für Details.')).toBe(false);
    });
    it('der alte Vorspann (vor 28.09.) wäre rot', () => {
      const alt = 'Diese Seite gilt für malojaplana.ch und die öffentlichen Erklärseiten. Für die Anwendung selbst gilt zusätzlich die ausführliche Datenschutzerklärung, die in der App unter «Datenschutz & Rechtliches» steht — auch sie ohne Zugangscode.';
      expect(sagtVerbindlichkeit(alt)).toBe(false);
    });
  });
});
