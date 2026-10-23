// Leere App nach dem Installieren (Rückmeldung Stebler Studios, 23.10.2026): Safari gibt der
// installierten App (iPhone-Startbildschirm, Mac-Dock) einen eigenen Speicher. Wer im Browser
// schon ausgefüllt hat, landet in der App wieder in der Einführung — ohne Hinweis, warum.
// Die Einführung ist genau der Schirm, den eine leere App zuerst zeigt; dort steht deshalb,
// nur wenn die Seite als App läuft, der Weg zur Sicherung.
import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { Onboarding, zurSicherungWechseln } from '../Onboarding.jsx';
import { LIGHT_PALETTE } from '../config/constants.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

const t = (k) => k;
const alsApp = (ja) => {
  globalThis.window = { matchMedia: (q) => ({ matches: ja && q === '(display-mode: standalone)' }), navigator: {} };
};
const rendern = (props = {}) => renderToStaticMarkup(React.createElement(Onboarding, {
  palette: LIGHT_PALETTE, t, setLanguage: () => {}, supportedLanguages: ['de', 'en'],
  onComplete: () => {}, onUpdateData: () => {}, onSicherungEinspielen: () => {}, ...props,
}));

describe('Einführung · Hinweis auf die Sicherung in der installierten App', () => {
  afterEach(() => { delete globalThis.window; delete globalThis.localStorage; });

  it('als App: Hinweis und Knopf stehen im ersten Schritt', () => {
    globalThis.localStorage = { getItem: () => null, setItem: () => {} };
    alsApp(true);
    const html = rendern();
    expect(html).toContain('data-testid="app-leer-sicherung"');
    expect(html).toContain('onboarding.appLeer.text');
    expect(html).toMatch(/<button[^>]*>[^<]*onboarding\.appLeer\.knopf/);
  });

  it('im Browser: kein Hinweis — dort teilt sich nichts', () => {
    globalThis.localStorage = { getItem: () => null, setItem: () => {} };
    alsApp(false);
    expect(rendern()).not.toContain('app-leer-sicherung');
  });

  it('ohne Weg zur Sicherung (kein onSicherungEinspielen): kein toter Knopf', () => {
    globalThis.localStorage = { getItem: () => null, setItem: () => {} };
    alsApp(true);
    expect(rendern({ onSicherungEinspielen: undefined })).not.toContain('app-leer-sicherung');
  });

  it('Knopf und Titel setzen ihre Farbe selbst (Dunkelmodus)', () => {
    globalThis.localStorage = { getItem: () => null, setItem: () => {} };
    alsApp(true);
    const block = rendern().match(/<div[^>]*data-testid="app-leer-sicherung"[\s\S]*?<\/button>/)[0];
    for (const tag of block.match(/<(button|p|strong)[^>]*>/g)) expect(tag).toMatch(/color:/);
    expect(Number(block.match(/<button[^>]*min-height:\s*(\d+)px/)[1])).toBeGreaterThanOrEqual(44);
  });
});

describe('zurSicherungWechseln', () => {
  it('schliesst die Einführung ab und führt weiter — ohne Angaben zu schreiben', () => {
    const geschrieben = {};
    let weiter = 0;
    zurSicherungWechseln({ setItem: (k, v) => { geschrieben[k] = v; } }, () => { weiter += 1; });
    expect(geschrieben).toEqual({ or5_onboarding_done: 'true' });
    expect(weiter).toBe(1);
  });

  it('gesperrter Speicher (Privatmodus) ist kein Fehlerfall — es geht trotzdem weiter', () => {
    let weiter = 0;
    zurSicherungWechseln({ setItem: () => { throw new Error('gesperrt'); } }, () => { weiter += 1; });
    expect(weiter).toBe(1);
  });
});

describe('main.jsx führt aus der Einführung direkt zur Sicherung', () => {
  const mainJsx = readFileSync(new URL('../main.jsx', import.meta.url), 'utf8');
  it('onSicherungEinspielen setzt die Ansicht «export»', () => {
    expect(mainJsx).toMatch(/onSicherungEinspielen:\s*\(\)\s*=>\s*\{[^}]*setView\('export'\)/);
  });
});

describe('Texte in allen fünf Sprachen', () => {
  for (const [name, sprache] of Object.entries({ de, en, fr, it: it_, rm })) {
    it(name, () => {
      const a = sprache.onboarding && sprache.onboarding.appLeer;
      expect(a, name).toBeTruthy();
      for (const k of ['titel', 'text', 'knopf']) expect(a[k], name + '.' + k).toBeTruthy();
    });
  }
});
