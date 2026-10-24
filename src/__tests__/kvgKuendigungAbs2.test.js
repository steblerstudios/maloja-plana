// KK-Wechsel: der 30. November gilt für die Kündigung NACH der Prämienmitteilung (KVG Art. 7
// Abs. 2), nicht für die «ordentliche» Kündigung — die läuft nach Abs. 1 auf Ende Semester
// (Eingang bis 31. März bzw. 30. September). Bis 24.10.2026 stand in Schritt 4 und in der
// Erinnerungs-Notiz «Die ordentliche Kündigung muss bis 30. November …» (Fachprüfung
// swiss-precision 24.10.2026). Quelle: https://www.fedlex.admin.ch/eli/cc/1995/1328_1328_1328/de#art_7
import { describe, it, expect } from 'vitest';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js';
import rm from '../i18n/rm.js';

const texte = (w) => (typeof w === 'string' ? [w] : [w.sie, w.du]);
const ORDENTLICH = /ordentlich|ordinary|ordinaire|ordinaria/i;

describe('KK-Wechsel: 30. November nur nach der Prämienmitteilung', () => {
  for (const [name, sprache] of [['de', de], ['en', en], ['fr', fr], ['it', itSprache], ['rm', rm]]) {
    it(name + ': Schritt 4 und Erinnerung nennen Art. 7 Abs. 2 und nicht «ordentlich»', () => {
      for (const k of ['step4Text', 'reminderNotes']) {
        for (const s of texte(sprache.kvgWechsel[k])) {
          expect(s, name + '.' + k).not.toMatch(ORDENTLICH);
          expect(s, name + '.' + k).toMatch(/Art\. 7 (Abs|para|al|cpv)\. 2/i);
          expect(s, name + '.' + k).toMatch(/30/);
        }
      }
    });
  }
});
