// Fehlerschirm · alles bleibt erreichbar (23.09.2026)
//
// Gemessen im Browser auf dem Handy QUER (667×375), bevor dies gefixt wurde:
// die Karte ist dort höher als der Schirm, und `align-items: center` in einem
// Kasten mit fester `height: 100vh` schiebt ihren oberen Rand über die Kante.
// 8 px auf Italienisch, 19 px auf Deutsch im Lese-Modus — und nach oben scrollen
// war unmöglich: `window.scrollTo(0, -9999)` liess `scrollY` auf 0.
//
// Abgeschnitten war damals nur Polsterung; bis zum Symbol waren es ~25 px. Der
// Fehler ist nicht die aktuelle Zahl, sondern das Muster: jede zusätzliche Zeile
// und jede längere Übersetzung schiebt Symbol, Titel und am Ende den Melde-Weg
// unerreichbar nach oben. Ausgerechnet auf dem Schirm, auf dem jemand gerade
// nicht weiterkommt.
//
// Die Zusage lautet deshalb: **der Fehlerschirm hat immer einen Scrollweg, und
// nichts rutscht über seine obere Kante.** Ein Unit-Test kann keine Höhen messen
// (kein Layout im Server-Rendering), aber er kann die drei Eigenschaften halten,
// aus denen die Zusage folgt — und ohne die sie nachweislich gebrochen war.
import { describe, it, expect, afterEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import ErrorBoundary from '../ErrorBoundary.jsx';

const speicher = (werte) => ({ getItem: (k) => (k in werte ? werte[k] : null) });

const schirm = () => {
  const eb = new ErrorBoundary({});
  eb.state = { hasError: true, error: new Error('Kaputt') };
  eb.context = null;
  return renderToString(eb.render());
};

describe('Fehlerschirm — nichts rutscht unerreichbar nach oben', () => {
  afterEach(() => { delete globalThis.localStorage; });

  it('bindet sich nicht auf eine feste Höhe', () => {
    globalThis.localStorage = speicher({});
    const html = schirm();
    // `height:100vh` ist der Auslöser: ohne Scrollweg gibt es keinen Rückweg nach oben.
    expect(html).not.toMatch(/[^-]height:100vh/);
    expect(html).toMatch(/min-height:100dvh/);
  });

  it('hat einen senkrechten Scrollweg', () => {
    globalThis.localStorage = speicher({});
    expect(schirm()).toMatch(/overflow-y:auto/);
  });

  it('zentriert über auto-Ränder statt über align-items — die werden nie negativ', () => {
    globalThis.localStorage = speicher({});
    const html = schirm();
    expect(html).not.toMatch(/align-items:center/);
    expect(html).toMatch(/margin:auto/);
  });

  it('spannt nicht über 100vw — sonst kommt zum senkrechten ein waagrechter Scrollweg', () => {
    globalThis.localStorage = speicher({});
    expect(schirm()).not.toMatch(/width:100vw/);
  });

  it('zeigt den Melde-Weg weiterhin — er ist der Grund, warum die Erreichbarkeit zählt', () => {
    globalThis.localStorage = speicher({});
    expect(schirm()).toMatch(/mailto:/);
  });
});
