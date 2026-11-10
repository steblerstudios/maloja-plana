// UVG und die 8-Stunden-Grenze (Predeploy 09.11.2026, Befund 2; Fix 10.11.2026).
//
// UVV Art. 13 (SR 832.202, Stand 1.1.2026, am Fedlex-Volltext gelesen):
//   Abs. 1 — wer bei EINEM Arbeitgeber mindestens acht Stunden pro Woche arbeitet, ist AUCH
//            gegen Nichtberufsunfälle versichert.
//   Abs. 2 — darunter gelten Unfälle auf dem Arbeitsweg als Berufsunfälle.
// Berufsunfälle sind also ohne Stundengrenze versichert. Vorher stand in drei Sätzen, die
// Versicherung gelte erst «ab 8h/Woche» bzw. unter 8 Std. müsse «der Unfall» in die
// Krankenkasse — auch Berufsunfälle schienen damit nicht versichert.
//
// Der Test pinnt die Sache, nicht den Wortlaut: jeder der drei Sätze nennt die Stelle
// (Art. 13), sagt «derselbe Arbeitgeber», und keiner bindet Berufsunfälle an die 8 Stunden.
import { describe, it, expect } from 'vitest';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

const SPRACHEN = { de, fr, it: it_, en, rm };
const PFADE = ['unfallKrankheit.step2UnfallText', 'neuerJob.step3Text', 'sectionIntros.versicherungen.additional'];
const hole = (o, p) => p.split('.').reduce((a, k) => (a ? a[k] : undefined), o);
const fassungen = (v) => (typeof v === 'string' ? [v] : [v.sie, v.du]);

// «derselbe Arbeitgeber» je Sprache (rm-Fallback ist für zwei Sätze noch deutsch)
const SELBER = /selben Arbeitgeber|même employeur|stesso datore|same employer|medem patrun/;

describe('UVG: Berufsunfälle ohne Stundengrenze, Nichtberufsunfälle ab 8 Std. beim selben Arbeitgeber', () => {
  for (const [sprache, d] of Object.entries(SPRACHEN)) {
    for (const pfad of PFADE) {
      it(`${sprache} · ${pfad}`, () => {
        const v = hole(d, pfad);
        expect(v, pfad).toBeTruthy();
        for (const text of fassungen(v)) {
          expect(text).toMatch(/Art\. 13|art\. 13/);
          expect(text).toMatch(SELBER);
          // der alte Fehler: Berufsunfälle erst ab 8 Stunden
          expect(text).not.toMatch(/Berufs- und Nichtberufsunfälle ab 8|professionnels et non professionnels dès 8|professionali e non professionali da 8|work and non-work accidents from 8|professiunals e betg professiunals da 8/);
        }
      });
    }
  }

  it('de: unter 8 Std. ist der Arbeitsweg Berufsunfall (Abs. 2)', () => {
    expect(de.unfallKrankheit.step2UnfallText.sie).toContain('Arbeitsweg als Berufsunfall');
    expect(de.unfallKrankheit.step2UnfallText.du).toContain('Arbeitsweg als Berufsunfall');
  });

  // KVG Art. 8: die Unfalldeckung der Krankenkasse ist da, bis sie sistiert wird — keine Pflicht,
  // «sie einzuschliessen» (Hinweis rechts-pruefer 10.11.). Wer unter 8 Std. arbeitet, soll sie nicht sistieren.
  it('de: Krankenkasse deckt den Unfall, Sistieren nach KVG Art. 8', () => {
    for (const v of [de.unfallKrankheit.step2UnfallText, de.neuerJob.step3Text]) {
      for (const text of [v.sie, v.du]) expect(text).toMatch(/KVG Art\. 8 Abs\. 1/);
    }
    expect(de.unfallKrankheit.step2UnfallText.sie).not.toMatch(/muss der Unfall in der Krankenkasse eingeschlossen/);
  });
});
