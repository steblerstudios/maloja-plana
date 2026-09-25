import { describe, it, expect } from 'vitest';
import React from 'react';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nContext } from '../i18n/index.js';
import { getChapters } from '../config/constants.js';
import DashboardComplete from '../Dashboard.jsx';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// ─────────────────────────────────────────────────────────────
// Die Leistungs-Zeile ("Ihr persönlicher Schweizer Lebensordner — …
// Steuerrechner, IPV, Sozialhilfe, Notfallkarte …") beantwortet "Was ist das hier?".
//
// Bis 25.09.2026 stand sie auf der Übersicht, nur solange kaum etwas erfasst war
// (gemessen am Handy: sie schob «Was ist jetzt dran?» an die Unterkante).
// Seit 25.09.2026 abends hat sie einen FESTEN Ort: letzte Zeile jeder Seite, über der
// Fusszeile (Entscheid Stebler Studios). Weggenommen wird nichts — nur umgezogen.
//
// Dieser Test hält die ZUSAGE fest, nicht die Bauweise.
// ─────────────────────────────────────────────────────────────

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k) => k;
const chapters = getChapters(t);

const zeichne = (data) =>
  renderToStaticMarkup(
    React.createElement(
      I18nContext.Provider,
      { value: { lang: 'de', t, anrede: 'sie', setLang: () => {}, setAnrede: () => {} } },
      React.createElement(DashboardComplete, {
        palette, t, chapters, data,
        onSelectChapter: () => {}, onNavigate: () => {},
        completion: {}, demoMode: false, onEnterDemo: () => {},
        simpleView: false, isDarkMode: false,
      })
    )
  );

const dreiKapitelBegonnen = {
  basis: { firstName: 'Alex' },
  wohnen: { city: 'Basel' },
  finanzen: { monthlyIncome: 6000 },
};

describe("Leistungs-Zeile — fester Ort am Seitenende", () => {
  it('steht nicht mehr auf der Übersicht, weder leer noch begonnen', () => {
    expect(zeichne({})).not.toContain('dashboard.tagline');
    expect(zeichne(dreiKapitelBegonnen)).not.toContain('dashboard.tagline');
  });

  it('steht als letzte Zeile jeder Seite, unbedingt (kein Schalter davor)', () => {
    const main = readFileSync(new URL('../main.jsx', import.meta.url), 'utf8');
    const def = main.slice(main.indexOf('const leistungEl'), main.indexOf('const footerEl'));
    expect(def).toContain("t('dashboard.tagline')");
    expect(def).toContain("t('dashboard.taglineBenefit')");
    // Eingehängt ohne Bedingung: `leistungEl,` als eigenes Kind, nicht `x && leistungEl`.
    expect(main).toMatch(/^\s*leistungEl,\s*$/m);
    expect(main).not.toMatch(/&&\s*leistungEl/);
  });

  it('zeigt den Anspruch in beiden Fällen — er ist die Identität der Seite', () => {
    expect(zeichne({})).toContain('dashboard.welcome');
    expect(zeichne(dreiKapitelBegonnen)).toContain('dashboard.welcome');
  });
});

// «Vorname ergänzen» + «Jetzt ergänzen» sagte dasselbe Verb zweimal (25.09.2026).
// Der Knopf wiederholt das Verb aus dem Titel nicht — in keiner Sprache.
describe('«Was ist jetzt dran?» — Knopf wiederholt das Verb nicht', () => {
  const stamm = (w) => w.toLowerCase().slice(0, 5);
  for (const [lang, d] of Object.entries({ de, fr, it: it_, en, rm })) {
    it(lang, () => {
      const titel = d.dashboard.nextUpAction.replace('{feld}', '').toLowerCase();
      const cta = typeof d.dashboard.nextUpCta === 'string' ? d.dashboard.nextUpCta : d.dashboard.nextUpCta.sie;
      const doppelt = cta.split(/\s+/).filter((w) => w.length >= 4 && titel.includes(stamm(w)));
      expect(doppelt).toEqual([]);
    });
  }
});
