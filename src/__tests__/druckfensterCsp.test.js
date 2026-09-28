import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { druckKnoepfeVerdrahten } from '../utils/helpers.js';

// Das Druckfenster erbt die CSP der App (script-src 'self'): ein Inline-Handler
// wie onclick="window.print()" wird dort blockiert. Die App hängt den Druck darum
// von aussen an alle [data-druck]-Knöpfe (openPrintWindow → druckKnoepfeVerdrahten).

const fakeKnopf = () => {
  const k = { attrs: { onclick: 'window.print()' }, handler: null };
  k.removeAttribute = (n) => { delete k.attrs[n]; };
  k.addEventListener = (typ, fn) => { if (typ === 'click') k.handler = fn; };
  return k;
};

describe('druckKnoepfeVerdrahten', () => {
  it('hängt den Druck an jeden [data-druck]-Knopf und entfernt das onclick', () => {
    const knoepfe = [fakeKnopf(), fakeKnopf()];
    let gedruckt = 0;
    const win = {
      focus() {},
      print() { gedruckt++; },
      document: { querySelectorAll: (sel) => (sel === '[data-druck]' ? knoepfe : []) },
    };
    expect(druckKnoepfeVerdrahten(win)).toBe(2);
    for (const k of knoepfe) {
      expect(k.attrs.onclick).toBeUndefined();
      k.handler();
    }
    expect(gedruckt).toBe(2);
  });
});

// Wächter: jeder Druckknopf im Druck-HTML trägt data-druck — sonst tut er im
// Druckfenster nichts. Gesucht wird im ganzen src/, nicht in einer Liste.
const dateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === '__tests__' || e.name === 'vendor' ? [] : dateien(p);
  return /\.(jsx?|mjs)$/.test(e.name) ? [p] : [];
});

describe('Druckknöpfe im Druck-HTML', () => {
  const src = path.resolve(__dirname, '..');
  const funde = dateien(src).flatMap((p) => {
    const text = fs.readFileSync(p, 'utf8');
    return [...text.matchAll(/<button[^>]*window\.print\(\)[^>]*>/g)].map((m) => ({ datei: path.relative(src, p), tag: m[0] }));
  });

  it('findet überhaupt Druckknöpfe (sonst prüft der Wächter die leere Menge)', () => {
    expect(funde.length).toBeGreaterThanOrEqual(5);
  });

  it('jeder Druckknopf trägt data-druck', () => {
    const ohne = funde.filter((f) => !/\sdata-druck[\s>=]/.test(f.tag));
    expect(ohne, ohne.map((f) => f.datei + ': ' + f.tag).join('\n')).toEqual([]);
  });
});
