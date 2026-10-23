// Startbündel-Diät (23.10.2026): BetaGateTor lässt Personen mit Zugang direkt durch und lädt
// die Code-Wand (BetaGate.jsx) nur ohne Zugang nach.
import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { BetaGateTor, ZUGANG_KEY } from '../BetaGateTor.jsx';

const quelle = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');

const speicher = {};
beforeEach(() => {
  for (const k of Object.keys(speicher)) delete speicher[k];
  globalThis.localStorage = {
    getItem: (k) => (k in speicher ? speicher[k] : null),
    setItem: (k, v) => { speicher[k] = String(v); },
    removeItem: (k) => { delete speicher[k]; },
  };
});

describe('BetaGateTor', () => {
  it('liest denselben Zugangs-Schlüssel wie BetaGate', () => {
    expect(quelle('BetaGate.jsx')).toContain(`const STORAGE_KEY = '${ZUGANG_KEY}';`);
  });

  it('mit Zugang: die App direkt, ohne Wand', () => {
    speicher[ZUGANG_KEY] = 'true';
    const html = renderToStaticMarkup(React.createElement(BetaGateTor, null, React.createElement('p', null, 'App')));
    expect(html).toBe('<p>App</p>');
  });

  it('ohne Zugang: nicht die App, sondern der ruhige Grund, bis die Wand geladen ist', () => {
    const html = renderToStaticMarkup(React.createElement(BetaGateTor, null, React.createElement('p', null, 'App')));
    expect(html).not.toContain('App');
    expect(html).toContain('min-height:100vh');
  });

  it('main.jsx bindet nur das Tor ein, nicht die Wand', () => {
    const main = quelle('main.jsx');
    expect(main).toContain("import BetaGateTor from './BetaGateTor.jsx';");
    expect(main).not.toMatch(/import BetaGate from/);
  });
});
