import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nContext } from '../i18n/index.js';
import { getChapters } from '../config/constants.js';
import DashboardComplete from '../Dashboard.jsx';

// ─────────────────────────────────────────────────────────────
// Die Leistungs-Zeile unter dem Anspruch ("Ihr persönlicher Schweizer
// Lebensordner — … Steuerrechner, IPV, Sozialhilfe, Notfallkarte …")
// beantwortet "Was ist das hier?". Diese Frage stellt sich genau einmal.
//
// Gemessen am Handy (390x844, Demo-Profil) vor der Änderung: von 619 px
// sichtbarem Inhalt gingen die ersten 502 px an Anspruch + Leistungs-Zeile +
// Entwicklungs-Hinweis. "Was ist jetzt dran?" lag bei 502 px — an der
// Unterkante — und der Berg mit dem Fortschritt begann bei 657 px, also unter
// dem Falz. Ohne die Leistungs-Zeile: Orientierung bei 384 px, Berg bei 539 px
// und damit sichtbar.
//
// Weggenommen wird nichts (Prinzip "entschlacken, nie löschen"): wer noch
// keine drei Kapitel begonnen und keines abgeschlossen hat, sieht sie
// unverändert. Der Anspruch selbst steht immer — er ist die Identität der Seite.
//
// Dieser Test hält die ZUSAGE fest, nicht die Bauweise: er fragt nur, ob der
// Text erscheint, nicht wie er ausgezeichnet ist.
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

// Ein begonnenes Kapitel = mindestens ein ausgefülltes Feld (kapitelStatus).
const dreiKapitelBegonnen = {
  basis: { firstName: 'Alex' },
  wohnen: { city: 'Basel' },
  finanzen: { monthlyIncome: 6000 },
};

describe('Dashboard — die Leistungs-Zeile erscheint nur, solange sie hilft', () => {
  it('zeigt sie beim leeren Stand', () => {
    expect(zeichne({})).toContain('dashboard.tagline');
  });

  it('lässt sie weg, sobald drei Kapitel begonnen sind', () => {
    expect(zeichne(dreiKapitelBegonnen)).not.toContain('dashboard.tagline');
  });

  it('zeigt den Anspruch in beiden Fällen — er ist die Identität der Seite', () => {
    expect(zeichne({})).toContain('dashboard.welcome');
    expect(zeichne(dreiKapitelBegonnen)).toContain('dashboard.welcome');
  });
});
