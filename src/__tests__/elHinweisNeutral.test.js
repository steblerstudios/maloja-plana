// EL-Hinweise ohne «Bezüger» (Finanzübersicht-Rest 28.09.2026): drei Schlüssel sagten in
// de/fr/it/rm «AHV/IV-Bezüger» / «bénéficiaires» / «beneficiari» / «benefiziaris» — nur die
// männliche Form. Neutral: «bei AHV- oder IV-Leistung» (ELG Art. 4 knüpft an die Leistung,
// nicht an eine Person). Der Test pinnt die Sache: keine männliche Personenform in diesen
// drei Schlüsseln, und jeder nennt weiterhin AHV/AVS und IV/AI.
import { describe, it, expect } from 'vitest';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

const texte = { de, en, fr, it: it_, rm };
const schluessel = (t) => [t.sozialhilfe.elOnlyAhvIv, t.elCalc.onlyAhvIv, t.behoerdenDossier.elNotApplicable];
const maennlich = /Bezüger\b|bénéficiaires\b|beneficiari\b|benefiziaris\b/;

describe('EL-Hinweise — neutral formuliert', () => {
  it('keine der fünf Sprachen nennt nur die männliche Personenform', () => {
    for (const [lang, t] of Object.entries(texte)) {
      for (const s of schluessel(t)) {
        expect(typeof s, lang).toBe('string');
        expect(s, lang + ': ' + s).not.toMatch(maennlich);
      }
    }
  });

  it('jeder Hinweis nennt weiterhin AHV und IV', () => {
    for (const [lang, t] of Object.entries(texte)) {
      for (const s of schluessel(t)) {
        expect(s, lang + ': ' + s).toMatch(/AHV|AVS/);
        expect(s, lang + ': ' + s).toMatch(/\bIV\b|\bAI\b/);
      }
    }
  });
});
