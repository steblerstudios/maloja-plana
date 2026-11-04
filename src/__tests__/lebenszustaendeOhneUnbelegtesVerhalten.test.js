import { describe, it, expect } from 'vitest';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// Erster Lauf des sozio-pruefers (04.11.2026, Frage 2): In den Lebenslagen standen Sätze über
// das Verhalten von Menschen («oft unbekannt», «viele fragen gar nicht», «eine der am häufigsten
// nicht bezogenen Leistungen der Schweiz») ohne jede Studie. Gestrichen in allen fünf Sprachen;
// dieser Test hält sie draussen. Wer so einen Satz wieder will, braucht eine Quelle im Text —
// und dann gehört die Formulierung hier begründet aus der Liste.
const UNBELEGT = {
  de: ['oft unbekannt', 'oft übersehen', 'oft unbeachtet', 'kaum genannt', 'viele nie beziehen', 'viele gar nicht fragen', 'am häufigsten nicht bezogen', 'oft zu spät'],
  fr: ['souvent méconnu', 'souvent oublié', 'rarement reconnus', 'rarement mentionnées', 'beaucoup ne demandent jamais', 'beaucoup ignorent', 'plus souvent non demandées', 'souvent trop tard'],
  it: ['spesso poco noto', 'spesso trascurato', 'raramente riconosciuta', 'menzionate di rado', 'molti non richiedono mai', 'molti non sanno', 'più spesso non richieste', 'spesso parte troppo tardi'],
  en: ['often unknown', 'often overlooked', 'rarely recognised', 'rarely mentioned', 'many never claim', 'many don’t know', 'most often unclaimed', 'often starts late'],
  rm: ['savens nunenconuschent', 'savens survis', 'savens sursvieu', 'savens nunconsiderada', 'numnà darar', 'blers na dumondan mai', 'blers na san betg', 'pli savens betg dumandadas', 'savens memia tard'],
};
const SPRACHEN = { de, fr, it: it_, en, rm };

describe('Lebenslagen ohne unbelegte Verhaltensaussagen', () => {
  for (const [lang, d] of Object.entries(SPRACHEN)) {
    it(lang, () => {
      const text = JSON.stringify(d.lebenszustaende).toLowerCase();
      const treffer = UNBELEGT[lang].filter((w) => text.includes(w.toLowerCase()));
      expect(treffer).toEqual([]);
    });
  }
});
