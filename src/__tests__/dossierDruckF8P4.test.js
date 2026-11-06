import { describe, it, expect } from 'vitest';
import { generateLebensmappe, generateNotfallDossier, generateBehoerdenDossier, BD_LANGER_WERT } from '../dossierGenerator.js';
import { getChapters } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { calculateSozialhilfe, calculateIPV, checkELEligibility } from '../config/cantonalData.js';
import { steuernFuerProfil, steuerEingabenAusDaten, KANTONAL_DATA_VERSION } from '../data/kantonaleSteuerdaten.js';

// F8-P4, Druckprobe vom 05.11.2026 (drei PDFs mit Maria, Chromium):
// 1. Der Browser druckte Datum und «about:blank» in Kopf und Fuss → Seitenrand 0, Rand im Behälter.
// 2. Die Schlusszeile der Lebensmappe stand allein auf Seite 3 → bleibt beim letzten Abschnitt.
// 3. Lange Werte im Behörden-Dossier standen rechtsbündig als Block → linksbündig unter dem Feldnamen.
const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
const chapters = getChapters(t);

const behoerden = () => {
  const eingaben = steuerEingabenAusDaten(DEMO_DATA);
  const steuern = steuernFuerProfil(eingaben);
  const calculations = {
    sozialhilfe: calculateSozialhilfe(DEMO_DATA),
    ipv: calculateIPV(DEMO_DATA),
    el: checkELEligibility(DEMO_DATA),
    tax: {
      total: steuern.bund.steuer, taxableIncome: steuern.bund.steuerBaresEinkommen, taxableQuelle: steuern.quelle,
      kantonal: steuern.kanton.kantonal, annahmen: steuern.annahmen, kantonOhneZahl: false, datenstand: KANTONAL_DATA_VERSION,
    },
  };
  return generateBehoerdenDossier(DEMO_DATA, chapters, t, calculations);
};
const druckBlock = (html) => html.slice(html.indexOf('@media print'), html.indexOf('</style>'));

describe('F8-P4 · Druck der drei Dossiers', () => {
  const faelle = [
    ['lm', generateLebensmappe(DEMO_DATA, chapters, t, [])],
    ['nd', generateNotfallDossier(DEMO_DATA, chapters, t)],
    ['bd', behoerden()],
  ];

  it.each(faelle)('%s: Seitenrand 0 (kein Browser-Kopf/-Fuss), 2 cm Rand im Behälter auf jeder Seite', (x, html) => {
    const d = druckBlock(html);
    expect(d).toMatch(/@page \{ margin: 0; size: A4; \}/);
    expect(d).not.toMatch(/@page \{ margin: 2cm/);
    expect(d).toMatch(new RegExp(`\\.${x}-container \\{ padding: 2cm;[^}]*box-decoration-break: clone`));
  });

  it.each(faelle)('%s: die Schlusszeile bricht nicht allein auf eine neue Seite', (x, html) => {
    expect(druckBlock(html)).toMatch(new RegExp(`\\.${x}-footer \\{ break-before: avoid;`));
  });

  it('Behörden-Dossier: lange Werte linksbündig unter dem Feldnamen, kurze bleiben in der Spalte', () => {
    const html = behoerden();
    const lang = [...html.matchAll(/<div class="bd-value-lang[^"]*">([^<]+)<\/div>/g)].map((m) => m[1]);
    expect(lang.length).toBeGreaterThan(0);
    expect(lang.every((w) => w.length > BD_LANGER_WERT)).toBe(true);
    const kurz = [...html.matchAll(/<td class="bd-value[^"]*">([^<]+)<\/td>/g)].map((m) => m[1]);
    expect(kurz.length).toBeGreaterThan(0);
    expect(kurz.every((w) => w.length <= BD_LANGER_WERT)).toBe(true);
    expect(html).toMatch(/\.bd-value-lang \{[^}]*text-align: left/);
  });
});
