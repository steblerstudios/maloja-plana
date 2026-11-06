// Aussteuerung, Schritt 4 (Fassung 9, 06.11.2026): Wer ab 60 ausgesteuert ist, muss die
// Abwägung beim Vorbezug sehen. Am Volltext belegt (Fedlex, 06.11.2026):
// - ÜLG Art. 5 Abs. 3: kein ÜL-Anspruch mit IV-Rente oder vorbezogener AHV-Rente.
// - ÜLG Art. 3 Abs. 1 Bst. b: ÜL enden beim frühestmöglichen Vorbezug, wenn EL im Referenzalter absehbar.
// - AHVG Art. 40a + AHVV Art. 56bis Abs. 3: Kürzung, auch ab dem Referenzalter abgezogen.
// - ELG Art. 4, 9, 9a: der Vorbezug erfüllt nur eine Voraussetzung — keine EL-Zusage.
// Der Test pinnt die Sache in allen fünf Sprachen, nicht die Schreibweise.
import { describe, it, expect } from 'vitest';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

const texte = { de, en, fr, it: it_, rm };
const fassungen = (v) => (typeof v === 'string' ? [v] : [v.sie, v.du]);

describe('Aussteuerung — Vorbezug und Überbrückungsleistungen', () => {
  it('nennt die IV-Rente als Ausschluss und die Fundstellen in jeder Fassung', () => {
    for (const [lang, t] of Object.entries(texte)) {
      for (const s of fassungen(t.aussteuerung.step4Uel)) {
        expect(typeof s, lang).toBe('string');
        expect(s, lang).toMatch(/\bIV\b|\bAI\b/);
        expect(s, lang).toMatch(/(Art\.|art\.) 3 (Abs\.|al\.|cpv\.|para\.) 1/);
        expect(s, lang).toMatch(/40a/);
        expect(s, lang).toMatch(/56bis/);
        expect(s, lang).toMatch(/9a/);
      }
    }
  });

  it('nennt 63 und 62 als frühestes Vorbezugsalter', () => {
    for (const [lang, t] of Object.entries(texte)) {
      for (const s of fassungen(t.aussteuerung.step4Uel)) {
        expect(s, lang).toMatch(/63/);
        expect(s, lang).toMatch(/62/);
        expect(s, lang).toMatch(/1961/);
      }
    }
  });

  it('sagt, dass die Stelle von Amtes wegen prüft und die ÜL bis zur Klärung weiterlaufen (ÜLV Art. 1)', () => {
    for (const [lang, t] of Object.entries(texte)) {
      for (const s of fassungen(t.aussteuerung.step4Uel)) {
        expect(s, lang).toMatch(/(ÜLV|OPtra|OPTD) (Art\.|art\.) 1/);
      }
      expect(t.aussteuerung.quelle, lang).toContain('2021/376/');
    }
  });

  it('die Quellenliste verlinkt die neuen Artikel', () => {
    for (const [lang, t] of Object.entries(texte)) {
      const q = t.aussteuerung.quelle;
      for (const anker of ['2021/373/', '#art_3]', '#art_40_a]', '#art_40_c]', '#art_56_bis]', '2007/804/', '#art_9_a]']) {
        expect(q, lang + ' ' + anker).toContain(anker);
      }
    }
  });
});
