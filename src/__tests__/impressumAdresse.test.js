import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

// ─────────────────────────────────────────────────────────────
// Die Kontaktadresse im Impressum · 23.09.2026
//
// 🛑 DIESER WÄCHTER IST ABSICHTLICH ROT. Er wird grün, sobald die echte,
// zustellfähige Adresse eingesetzt ist — die kann nur Stebler Studios setzen.
//
// Hergang: Eine Durchsicht von aussen hat bemerkt, dass Impressum und
// Datenschutz «Basel, Schweiz» nennen, aber keine Strasse. Die öffentliche
// Seite trägt zugleich den Satz «Angaben gemäss Art. 3 Abs. 1 lit. s UWG» —
// sie behauptet also eine Vollständigkeit, die sie nicht hat. Ob UWG für ein
// kostenloses Angebot ohne Bestellvorgang überhaupt greift, ist Frage F0 in
// docs/legal/k48-fragen-juristin.md und NICHT hier zu entscheiden. Eine
// erreichbare Adresse ist so oder so richtig.
//
// Warum ein roter Test und kein stiller Platzhalter: ein Platzhalter, den
// niemand bemerkt, geht irgendwann live. Ein roter Test kann das nicht.
// Vergleiche das Muster in den Gedächtnis-Notizen: «einen Wächter, den ich
// nicht rot gesehen habe, halte ich für eine Behauptung.» Dieser hier ist
// rot gesehen worden, bevor er eingecheckt wurde.
//
// ZUM GRÜNMACHEN — an genau diesen Stellen die Adresse einsetzen:
//   src/i18n/{de,en,fr,it,rm}.js  →  legal.privacy.responsible1
//   src/i18n/{de,en,fr,it,rm}.js  →  legal.imprint.operator2
//   scripts/seiten-inhalt.mjs     →  SONDERSEITEN «Anbieterin»
//   scripts/seiten/{en,fr,it,rm}.mjs → dieselbe Stelle
// danach `node scripts/build-seiten.mjs` und die public/-Seiten mitcommitten.
// ─────────────────────────────────────────────────────────────

const PLATZHALTER = ['[Strasse Nr.]', '[PLZ]'];
const SPRACHEN = { de, en, fr, it: it_, rm };

// Ein i18n-Wert ist entweder ein String oder { sie, du }.
const alsText = (wert) =>
  typeof wert === 'string' ? wert : [wert?.sie, wert?.du].filter(Boolean).join(' ');

describe('Kontaktadresse im Impressum', () => {
  describe.each(Object.entries(SPRACHEN))('%s.js', (_sprache, pakete) => {
    it('nennt eine Strasse in der verantwortlichen Person', () => {
      const text = alsText(pakete.legal.privacy.responsible1);
      for (const p of PLATZHALTER) {
        expect(text, `Platzhalter ${p} steht noch in legal.privacy.responsible1`)
          .not.toContain(p);
      }
    });

    it('nennt eine Strasse in der Betreiberin', () => {
      const text = alsText(pakete.legal.imprint.operator2);
      for (const p of PLATZHALTER) {
        expect(text, `Platzhalter ${p} steht noch in legal.imprint.operator2`)
          .not.toContain(p);
      }
    });
  });

  it('die öffentliche Rechtsseite nennt in allen 5 Sprachen eine Strasse', () => {
    const wurzel = process.cwd();
    for (const praefix of ['', 'en/', 'fr/', 'it/', 'rm/']) {
      const datei = path.resolve(wurzel, 'public', `${praefix}rechtliches`, 'index.html');
      const html = fs.readFileSync(datei, 'utf8');
      for (const p of PLATZHALTER) {
        expect(html, `Platzhalter ${p} steht noch in /${praefix}rechtliches/`)
          .not.toContain(p);
      }
    }
  });

  // Gegenprobe: der Wächter darf nicht nur deshalb anschlagen, weil er
  // überall anschlägt. Ein fertiger Adresstext muss ihn zufriedenstellen —
  // sonst prüft er seine eigene Formulierung statt die Sache.
  it('ein vollständiger Adresstext liesse ihn durch', () => {
    const fertig = 'Stebler Studios — Musterweg 1, 4051 Basel, Schweiz';
    for (const p of PLATZHALTER) expect(fertig).not.toContain(p);
  });
});
