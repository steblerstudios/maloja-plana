import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { BRILLEN, KARTE_WERKZEUG, KARTEN_FRUCHT } from '../../scripts/seiten/kantonsatlas.mjs';
import { appAnsicht } from '../../scripts/seiten-ziele.mjs';
import { KANTONSKARTE } from '../components/ErklaerseiteLink.jsx';
import { VALID_VIEWS } from '../utils/hashRouter.js';

// Kantonsatlas als Brückenstück (Stebler Studios 09.11.2026, «Ja, A bis C bauen»):
// A Brillen als Filter ohne Skript · C jede Karte mit Werkzeug führt in die App.
const seite = fs.readFileSync(path.resolve(process.cwd(), 'public', 'kantonsatlas', 'index.html'), 'utf8');
const figur = (key) => seite.match(new RegExp(`<figure class="abb atlas" id="karte-${key.toLowerCase()}"[^>]*>[\\s\\S]*?</figure>`))[0];

describe('A · Brillen als Filter', () => {
  it('jede Karte nennt genau die Brillen, die sie führen, und keine Karte gehört zu keiner', () => {
    for (const key of Object.keys(KARTEN_FRUCHT)) {
      const soll = BRILLEN.filter((b) => b.karten.includes(key)).map((b) => b.id);
      expect(soll.length, key).toBeGreaterThan(0);
      expect(figur(key), key).toContain(`data-brillen="${soll.join(' ')}"`);
      expect(figur(key), key).toContain(`<a href="#karte-${key.toLowerCase()}">Karte zeigen`);
    }
  });

  it('je Brille: Adresse, Knopf, Hinweis und die Regeln, die filtern', () => {
    expect(seite).toContain('<a href="#brillen" class="wahl-alle">Alle Karten</a>');
    for (const b of BRILLEN) {
      expect(seite, b.id).toContain(`<span class="brillen-anker" id="fuer-${b.id}"></span>`);
      expect(seite, b.id).toContain(`<a href="#fuer-${b.id}">${b.name}</a>`);
      expect(seite, b.id).toContain(`class="brillen-status nur-fuer-${b.id}"`);
      expect(seite, b.id).toContain(`body:has(#fuer-${b.id}:target) .atlas:not([data-brillen~="${b.id}"]) > :not(.atlas-zu){ display:none }`);
      expect(seite, b.id).toContain(`body:has(#fuer-${b.id}:target) .atlas:not([data-brillen~="${b.id}"]) > .atlas-zu{ display:block }`);
    }
  });

  it('gewählt zeigt sich nicht nur in Farbe (fett), und die Seite bleibt ohne Skript', () => {
    expect(seite).toMatch(/\{ border-color:var\(--heidel-text\); background:var\(--heidel-hauch\); color:var\(--text\); font-weight:600 \}/);
    expect(seite).not.toMatch(/<script(?![^>]*application\/ld\+json)/);
  });
});

describe('C · Weg von der Karte in die App', () => {
  it('KARTE_WERKZEUG ist die Umkehrung von KANTONSKARTE in der App', () => {
    const umgekehrt = Object.fromEntries(Object.entries(KANTONSKARTE).map(([view, href]) => [href.split('#karte-')[1], view]));
    const soll = Object.fromEntries(Object.entries(KARTE_WERKZEUG).map(([k, v]) => [k.toLowerCase(), v]));
    expect(soll).toEqual(umgekehrt);
    for (const view of Object.values(KARTE_WERKZEUG)) expect(VALID_VIEWS.has(view), view).toBe(true);
  });

  it('Karten mit Werkzeug führen dorthin, die übrigen versprechen nichts', () => {
    for (const key of Object.keys(KARTEN_FRUCHT)) {
      const f = figur(key);
      if (KARTE_WERKZEUG[key]) expect(f, key).toContain(`<p class="atlas-weiter"><a href="${appAnsicht(KARTE_WERKZEUG[key])}">Ihre eigene Lage in Maloja ansehen`);
      else expect(f, key).not.toContain('atlas-weiter');
    }
  });
});
