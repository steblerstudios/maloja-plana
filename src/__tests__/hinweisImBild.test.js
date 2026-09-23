import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';

import { SozialhilfeView } from '../SozialhilfeView.jsx';
import { TaxCalculator } from '../TaxCalculator.jsx';
import { AlvRechner } from '../AlvRechner.jsx';
import { EOrechner } from '../EOrechner.jsx';
import { VorsorgeRechner } from '../VorsorgeRechner.jsx';
import { PraemienOrientierung } from '../PraemienOrientierung.jsx';
import { MietzinsOrientierung } from '../MietzinsOrientierung.jsx';
import { SchuldenManager } from '../SchuldenManager.jsx';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import { PflegeAblauf } from '../PflegeAblauf.jsx';
import { StipendienView } from '../StipendienView.jsx';
import { Schnellcheck } from '../Schnellcheck.jsx';
import { AnspruchCheck } from '../AnspruchCheck.jsx';
import { KVGWechsel } from '../KVGWechsel.jsx';
import { ZusatzWechsel } from '../ZusatzWechsel.jsx';

// «15 von 15 Ansichten zeigen einen Hinweis im Bild» war bis zum 23.09.2026 eine
// Handmessung — und die Rechts-Prüfung hat zu Recht angemerkt, dass ausgerechnet der
// Satz, auf den sich eine Jurist:in stützen würde, von nichts gehalten wird. (Die
// erste Fassung dieser Messung war zudem falsch: das Suchmuster kannte «Keine
// rechtsverbindliche Auskunft» nicht.)
//
// Hier wird jede Ansicht wirklich gerendert, mit den echten deutschen Texten —
// geprüft wird also das, was im Bild steht, nicht ein Schlüsselname.
//
// Ein erster Anlauf gab statt der Texte die SCHLÜSSEL aus und suchte darin nach
// «noAdvice», «disclaimer» und ähnlichem. Drei Ansichten fielen durch, die im Browser
// nachweislich einen Hinweis zeigen (vorsorge, mietzins, stipendien) — ihre Schlüssel
// heissen bloss anders. Das wäre zum dritten Mal an einem Tag eine Messung des
// Messgeräts gewesen. Vermerkt, damit der nächste Anlauf die Falle kennt.
//
// Geprüft wird die AUSSAGE, nicht der Satz: das Muster fragt nach «Orientierung»,
// «unverbindlich», «keine rechtsverbindliche Auskunft», «ersetzt keine …». Eine
// Umformulierung innerhalb dieser Aussage lässt den Test grün; ein verschwundener
// Hinweis macht ihn rot.
//
// Was er NICHT kann: er rendert den Anfangszustand. Eine Ansicht, die ihren Hinweis
// erst nach einer Eingabe zeigt, fiele hier durch — bisher tut das keine.

const HINWEIS = /Orientierung|orientier(?:t|en Sie sich)?\b|ersetzt kein|keine Rechtsberatung|keine verbindliche|rechtsverbindlich|unverbindlich|ohne Gewähr|keine Gewähr|verbindlich ist/i;

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });

// Echtes `t`: löst den Punktpfad in de.js auf, nimmt bei Sie/Du-Varianten die
// Sie-Form und setzt {platzhalter} ein. Fehlt ein Schlüssel, bleibt er stehen —
// dann fällt im Markup der Schlüsselname auf, wie in der App auch.
const t = (schluessel, p) => {
  const wert = String(schluessel).split('.').reduce((o, k) => (o == null ? undefined : o[k]), de);
  let text = wert;
  if (wert && typeof wert === 'object') text = wert.sie ?? Object.values(wert)[0];
  if (typeof text !== 'string') return schluessel;
  if (p && typeof p === 'object') for (const [k, v] of Object.entries(p)) text = text.split('{' + k + '}').join(String(v));
  return text;
};

// Ein vollständiges Beispielprofil — genug, dass die Rechner etwas zu rechnen haben.
const daten = {
  basis: { canton: 'BS', dateOfBirth: '1985-04-12', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 4200, pension3a: 3000, assets: 8000, debts: 2000 },
  wohnen: { postalCode: '4051', city: 'Basel', rentAmount: 1400 },
  versicherungen: { kkPremium: 420, kkFranchise: 2500, insurer: 'Beispielkasse' },
  behoerden: { cantoneOfTaxation: 'BS' },
  ausbildung: {},
  notfall: {},
};

const ANSICHTEN = [
  ['sozialhilfe', SozialhilfeView],
  ['tax', TaxCalculator],
  ['alv', AlvRechner],
  ['eo', EOrechner],
  ['vorsorge', VorsorgeRechner],
  ['praemien', PraemienOrientierung],
  ['mietzins', MietzinsOrientierung],
  ['schulden', SchuldenManager],
  ['premium', PremiumSubsidy],
  ['pflege', PflegeAblauf],
  ['stipendien', StipendienView],
  ['schnellcheck', Schnellcheck],
  ['anspruchcheck', AnspruchCheck],
  ['kvgwechsel', KVGWechsel],
  ['zusatzwechsel', ZusatzWechsel],
];

const zeichne = (Komponente) => renderToStaticMarkup(
  React.createElement(Komponente, {
    palette,
    t,
    data: daten,
    onNavigate: () => {},
    onUpdateData: () => {},
    isDarkMode: false,
    documents: [],
  })
);

describe('Hinweis im Bild — jede gerechnete Ansicht sagt, dass sie orientiert', () => {
  for (const [name, Komponente] of ANSICHTEN) {
    it(`${name}: gibt ein Hinweis-Element aus`, () => {
      const markup = zeichne(Komponente);
      expect(markup.length, `${name}: nichts gerendert`).toBeGreaterThan(200);
      expect(HINWEIS.test(markup), `${name}: kein Orientierungs-Hinweis im gerenderten Bild`).toBe(true);
    });
  }

  it('Gegenprobe: eine Ansicht ohne Hinweis fällt durch', () => {
    const Ohne = () => React.createElement('div', null, 'Ihre Rente: CHF 715 pro Monat. Das ist der Betrag.');
    expect(HINWEIS.test(renderToStaticMarkup(React.createElement(Ohne)))).toBe(false);
    // Drei verschiedene Formulierungen derselben Aussage werden erkannt —
    // der Test hängt an keiner davon.
    for (const satz of ['Dies ist Orientierung, keine Rechtsberatung.', 'Keine rechtsverbindliche Auskunft.', 'Unverbindliche Schätzung.']) {
      expect(HINWEIS.test(renderToStaticMarkup(React.createElement(() => React.createElement('div', null, satz)))), satz).toBe(true);
    }
  });

  it('Gegenprobe: das echte `t` gibt Text zurück, nicht den Schlüssel', () => {
    expect(t('alpha.noAdviceHint')).toMatch(/ersetzt keine/);
    expect(t('gibtsnicht.foo')).toBe('gibtsnicht.foo');
  });

  it('die gefundenen Schlüssel lösen in Deutsch zu echtem Text auf', () => {
    // Sonst zeigt die Ansicht im Bild den Schlüsselnamen statt eines Satzes.
    const hole = (pfad) => pfad.split('.').reduce((o, k) => (o || {})[k], de);
    for (const pfad of ['alpha.noAdviceHint', 'alpha.summary', 'briefe.disclaimer']) {
      const wert = hole(pfad);
      const text = typeof wert === 'string' ? wert : Object.values(wert || {}).join(' ');
      expect(text.length, `${pfad} fehlt oder ist leer`).toBeGreaterThan(20);
    }
  });
});
