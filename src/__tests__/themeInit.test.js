// K4: public/theme-init.js setzt data-theme vor dem ersten Rendern. Diese Tests halten
// die Datei an dieselbe Logik wie main.jsx (Schlüssel, Default) und die Grundfarben in
// index.html an die JS-Paletten — sonst driftet das Aufblitzen still zurück.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { DARK_PALETTE, LIGHT_PALETTE } from '../config/constants.js';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const script = read('../../public/theme-init.js');
const html = read('../../index.html');
const mainJsx = read('../main.jsx');

function runWith(localStorage) {
  const attrs = {};
  const document = { documentElement: { setAttribute: (k, v) => { attrs[k] = v; } } };
  new Function('localStorage', 'document', script)(localStorage, document);
  return attrs['data-theme'];
}
const stored = (value) => ({ getItem: (key) => (key === 'or5_theme' ? value : null) });

describe('theme-init.js (K4)', () => {
  it('ohne Eintrag dunkel — wie der Default in main.jsx', () => {
    expect(runWith(stored(null))).toBe('dark');
  });
  it('liest den gespeicherten Wert', () => {
    expect(runWith(stored('true'))).toBe('dark');
    expect(runWith(stored('false'))).toBe('light');
  });
  it('kaputter Wert oder gesperrter Speicher → dunkel, kein Fehler', () => {
    expect(runWith(stored('{kaputt'))).toBe('dark');
    expect(runWith({ getItem: () => { throw new Error('SecurityError'); } })).toBe('dark');
  });
  it('main.jsx nutzt denselben Schlüssel und Default', () => {
    expect(mainJsx).toContain("localStorage.getItem('or5_theme') || 'true'");
    expect(script).toContain("localStorage.getItem('or5_theme') || 'true'");
  });
});

describe('index.html lädt theme-init.js CSP-konform (K4)', () => {
  it('als klassisches, synchrones Skript vor dem App-Bundle', () => {
    const tag = html.match(/<script[^>]*src="\/theme-init\.js"[^>]*>/);
    expect(tag).not.toBeNull();
    expect(tag[0]).not.toMatch(/type="module"|\basync\b|\bdefer\b/);
    expect(html.indexOf('/theme-init.js')).toBeLessThan(html.indexOf('/src/main.jsx'));
    expect(html.indexOf('Content-Security-Policy')).toBeLessThan(html.indexOf('/theme-init.js'));
  });
  it('kein ausführbares Inline-Skript (CSP script-src self)', () => {
    const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>/g)]
      .filter((m) => !/type="application\/ld\+json"/.test(m[1]));
    expect(inline).toHaveLength(0);
  });
  it('Grundfarben entsprechen palette.bg', () => {
    expect(html).toMatch(new RegExp(`:root\\[data-theme="dark"\\]\\s*\\{\\s*background:\\s*${DARK_PALETTE.bg}`));
    expect(html).toMatch(new RegExp(`:root\\[data-theme="light"\\]\\s*\\{\\s*background:\\s*${LIGHT_PALETTE.bg}`));
  });
});
