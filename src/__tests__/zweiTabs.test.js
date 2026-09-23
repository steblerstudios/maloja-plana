// K116 · Zwei offene Maloja-Tabs überschreiben einander nicht mehr still.
//
// Erprobt am 24.09.2026 im Browser, vor diesem Test: Tab B speicherte einen
// Nachnamen, Tab A (älterer Stand) änderte danach den Titel — der Nachname war aus
// `or5_data` verschwunden, ohne Meldung. Ursache: das Auto-Save schreibt den GANZEN
// Stand des eigenen Tabs, und der `storage`-Listener hörte nur aufs Lösch-Signal.
//
// Kein DOM-Test (vitest ohne jsdom, siehe fokusFalle.test.js). Belegt sind darum:
//   1. die reine Entscheidung, welche Schlüssel als fremde Änderung zählen,
//   2. die Meldung, wie sie gerendert wird,
//   3. ein Wächter an der AUFRUFSTELLE: das Auto-Save bricht ab, bevor es schreibt.
// Das Zusammenspiel zweier echter Tabs ist im Browser nachgemessen, nicht hier.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { istFremdeAenderung } from '../utils/fremdeAenderung.js';
import { AutoSaveStatus } from '../AutoSaveStatus.jsx';
import de from '../i18n/de.js';

const lies = (p) => fs.readFileSync(path.resolve(__dirname, '..', p), 'utf8');

describe('istFremdeAenderung — was das eigene Auto-Save überschriebe', () => {
  it('Angaben, Dokumentliste und clear() zählen', () => {
    expect(istFremdeAenderung('or5_data')).toBe(true);
    expect(istFremdeAenderung('or5_docs')).toBe(true);
    expect(istFremdeAenderung(null)).toBe(true);
  });

  it('Einstellungen und das Lösch-Signal zählen nicht', () => {
    for (const k of ['or5_lang', 'or5_theme', 'or5_loeschsignal', 'or5_last_backup', 'or5_data_premigration']) {
      expect(istFremdeAenderung(k)).toBe(false);
    }
  });
});

describe('AutoSaveStatus meldet die fremde Änderung', () => {
  const palette = { text: '#111', surface: '#fff', border: '#ccc', mid: '#666', sage: '#6a6' };
  const t = (k) => k.split('.').reduce((o, s) => o?.[s], de);

  it('zeigt den Satz und den einen Handgriff «Seite neu laden»', () => {
    const html = renderToStaticMarkup(React.createElement(AutoSaveStatus, { palette, t, fremdGeaendert: true }));
    expect(html).toContain(de.common.fremdGeaendert);
    expect(html).toMatch(/<button[^>]*type="button"[^>]*>Seite neu laden<\/button>/);
    expect(html).toContain('aria-live="polite"');
    expect(html).not.toContain(de.common.saved);
  });

  it('der Knopf setzt seine Farbe selbst (Dunkelmodus)', () => {
    const html = renderToStaticMarkup(React.createElement(AutoSaveStatus, { palette, t, fremdGeaendert: true }));
    expect(html.match(/<button[^>]*style="([^"]*)"/)[1]).toMatch(/color:#111/);
  });

  it('ohne fremde Änderung: keine Meldung', () => {
    const html = renderToStaticMarkup(React.createElement(AutoSaveStatus, { palette, t, fremdGeaendert: false }));
    expect(html).not.toContain(de.common.fremdGeaendert);
  });
});

describe('main.jsx — das Auto-Save schreibt nach fremder Änderung nicht mehr', () => {
  const main = lies('main.jsx');

  it('der Listener nutzt dieselbe Entscheidung', () => {
    expect(main).toMatch(/if \(istFremdeAenderung\(e\.key\)\) setFremdGeaendert\(true\);/);
  });

  it('im Intervall steht die Sperre VOR dem Schreiben von or5_data', () => {
    const intervall = main.slice(main.indexOf('const timer = setInterval('));
    const sperre = intervall.indexOf('if (fremdGeaendert) return;');
    const schreiben = intervall.indexOf("localStorage.setItem('or5_data'");
    expect(sperre).toBeGreaterThan(-1);
    expect(schreiben).toBeGreaterThan(sperre);
  });

  it('die Meldung bekommt den Zustand', () => {
    expect(main).toMatch(/AutoSaveStatus, \{[^}]*fremdGeaendert[^}]*\}/);
  });
});
