import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { BRILLEN, KARTE_WERKZEUG, KARTEN_FRUCHT } from '../../scripts/seiten/kantonsatlas.mjs';
import { appBeispiel } from '../../scripts/seiten-ziele.mjs';
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
      expect(figur(key), key).toContain(`zugeklappt, gehört nicht zur gewählten Brille. <a href="#karte-${key.toLowerCase()}">Karte zeigen`);
    }
  });

  it('je Brille: Adresse am Statussatz, Knopf mit «(gewählt)», und die Regeln, die filtern', () => {
    expect(seite).toContain('<a href="#brillen" class="wahl-alle">Alle Karten<span class="gewaehlt sr-only"> (gewählt)</span></a>');
    for (const b of BRILLEN) {
      // Das Sprungziel ist der Statussatz selbst: er wird beim Wählen zuerst gelesen (a11y-Prüfung 09.11.2026).
      expect(seite, b.id).toContain(`<p class="brillen-status" id="fuer-${b.id}" tabindex="-1">Gewählt: Brille «${b.name}».`);
      expect(seite, b.id).toContain(`<a href="#fuer-${b.id}">${b.name}<span class="gewaehlt sr-only"> (gewählt)</span></a>`);
      expect(seite, b.id).toContain(`body:has(#fuer-${b.id}:target) a[href="#fuer-${b.id}"] .gewaehlt`);
      expect(seite, b.id).toContain(`body:has(#fuer-${b.id}:target) .atlas:not([data-brillen~="${b.id}"]) > :not(.atlas-zu){ display:none }`);
      expect(seite, b.id).toContain(`body:has(#fuer-${b.id}:target) .atlas:not([data-brillen~="${b.id}"]) > .atlas-zu{ display:block }`);
    }
  });

  it('ohne :has() gibt es weder Knöpfe noch den Satz dazu (kein Knopf, der nichts tut)', () => {
    expect(seite).toContain('.brillen-wahl, .nur-mit-filter, .brillen-status, .gewaehlt{ display:none }');
    const block = seite.slice(seite.indexOf('@supports selector(:has(*)){'));
    expect(block).toContain('.brillen-wahl{ display:block');
    expect(block).toContain('.nur-mit-filter{ display:inline }');
    expect(seite).toMatch(/<span class="nur-mit-filter"> Wählen Sie eine: Deren Karten bleiben offen/);
  });

  it('gewählt zeigt sich nicht nur in Farbe (fett), und die Seite bleibt ohne Skript', () => {
    expect(seite).toMatch(/\{ border-color:var\(--heidel-text\); background:var\(--heidel-hauch\); color:var\(--text\); font-weight:600 \}/);
    expect(seite).not.toMatch(/<script(?![^>]*application\/ld\+json)/);
  });
});

describe('C · Weg von der Karte in die App', () => {
  it('KARTE_WERKZEUG ist die Umkehrung von KANTONSKARTE in der App', () => {
    const umgekehrt = Object.fromEntries(Object.entries(KANTONSKARTE).map(([view, href]) => [href.split('#karte-')[1], view]));
    const soll = Object.fromEntries(Object.entries(KARTE_WERKZEUG).map(([k, v]) => [k.toLowerCase(), v.view]));
    expect(soll).toEqual(umgekehrt);
    for (const { view } of Object.values(KARTE_WERKZEUG)) expect(VALID_VIEWS.has(view), view).toBe(true);
  });

  it('Karten mit Werkzeug führen dorthin, die übrigen versprechen nichts', () => {
    for (const key of Object.keys(KARTEN_FRUCHT)) {
      const f = figur(key);
      const W = KARTE_WERKZEUG[key];
      // ?beispiel: ohne Zugangscode direkt ins Beispiel, sonst stimmte der Satz daneben nicht (Copy-Prüfung).
      if (W) expect(f, key).toContain(`<p class="atlas-weiter"><a href="${appBeispiel(W.view)}">Mit Ihren Angaben rechnen: ${W.name}</a> <span>Ohne Zugangscode öffnet sich das Beispiel.</span>`);
      else expect(f, key).not.toContain('atlas-weiter');
    }
  });
});
