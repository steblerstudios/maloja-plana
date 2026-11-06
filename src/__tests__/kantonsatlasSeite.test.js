import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { KANTONSATLAS, stufen } from '../../scripts/seiten/kantonsatlas.mjs';
import { HINTERGRUND } from '../../scripts/seiten/hintergrund.mjs';
import { KANTONE, EBENEN } from '../../scripts/seiten-vergleich.mjs';

// ─────────────────────────────────────────────────────────────
// /kantonsatlas/ · Der Kantonsatlas als Maloja-Erklärseite (Stebler Studios, 06.11.2026)
//
// Die allgemeinen Riegel (kein Skript, nur Deutsch, Quellen, Prüfdatum) hält
// hintergrundSeiten.test.js für alle Hintergrundseiten. Hier die Karten:
//   • jede Karte färbt alle 26 Kantone, die Stufe kommt aus den Daten;
//   • eine Farbe, keine Rangliste, keine Wertungsfarben;
//   • keine Versprechen zu Datenspenden, die es in Maloja nicht gibt.
// ─────────────────────────────────────────────────────────────

const lies = (pfad) => fs.readFileSync(path.resolve(process.cwd(), 'public', pfad, 'index.html'), 'utf8');
const html = lies('kantonsatlas');
const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const KARTEN = ['praemie', 'lastNachIpv', 'steuer', 'miete', 'leer', 'kinderzulage', 'kita', 'alq', 'sozialhilfe', 'el'];
const karte = (key) => html.match(new RegExp(`<figure class="abb atlas" id="karte-${key.toLowerCase()}">[\\s\\S]*?</figure>`))[0];

describe('/kantonsatlas/', () => {
  it('steht in der Liste der Hintergrundseiten', () => {
    expect(HINTERGRUND).toContain(KANTONSATLAS);
  });

  it('zeigt zehn Karten, jede mit allen 26 Kantonen', () => {
    expect((html.match(/<figure class="abb atlas"/g) || []).length).toBe(KARTEN.length);
    for (const key of KARTEN) {
      const uses = [...karte(key).matchAll(/<use href="#ka-([A-Z]{2})" class="k(\d)"\/>/g)];
      expect(uses.map((u) => u[1]).sort(), key).toEqual([...KANTONE].sort());
    }
  });

  it('die Stufe jedes Kantons kommt aus seinem Wert', () => {
    for (const key of KARTEN) {
      const { stufe } = stufen(key);
      const f = karte(key);
      for (const k of KANTONE) expect(f, `${key} ${k}`).toContain(`<use href="#ka-${k}" class="k${stufe[k]}"/>`);
      const vs = KANTONE.map((k) => EBENEN[key].wert(k));
      const tief = KANTONE.find((k) => EBENEN[key].wert(k) === Math.min(...vs));
      const hoch = KANTONE.find((k) => EBENEN[key].wert(k) === Math.max(...vs));
      expect(stufe[tief], `${key}: tiefster Kanton in Stufe 1`).toBe(1);
      expect(stufe[hoch], `${key}: höchster Kanton in der obersten Stufe`).toBeGreaterThan(1);
      // Gleicher Wert, gleiche Stufe.
      for (const a of KANTONE) for (const b of KANTONE) {
        if (EBENEN[key].wert(a) === EBENEN[key].wert(b)) expect(stufe[a]).toBe(stufe[b]);
        if (EBENEN[key].wert(a) < EBENEN[key].wert(b)) expect(stufe[a]).toBeLessThanOrEqual(stufe[b]);
      }
    }
  });

  it('die Legende nennt die Spanne jeder Stufe aus den Daten', () => {
    for (const key of KARTEN) {
      const { spannen } = stufen(key);
      const f = karte(key);
      for (const s of spannen) {
        const t = s.min === s.max ? EBENEN[key].fmt(s.min) : `${EBENEN[key].fmt(s.min)} bis ${EBENEN[key].fmt(s.max)}`;
        expect(f, key).toMatch(new RegExp(`<li><i class="k${s.s}" aria-hidden="true"></i><span class="sr-only">Stufe \\d von \\d[^<]*</span>${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</li>`));
      }
    }
  });

  it('die Kantonsformen stehen einmal, jeder Verweis findet sein Ziel', () => {
    expect((html.match(/<defs>/g) || []).length).toBe(1);
    const ids = new Set([...html.matchAll(/<path id="(ka-[^"]+)"/g)].map((m) => m[1]));
    for (const [, ziel] of html.matchAll(/<use href="#([^"]+)"/g)) expect(ids, ziel).toContain(ziel);
  });

  it('ordnet die Kantone nicht: keine Platzziffer, kein Rang, keine Wertungsfarben', () => {
    expect(text).not.toMatch(/\b(Rang \d|\d+\. Rang|Rang(liste)?:|Platz \d|\d+\. Platz|bester Kanton|schlechtester|Spitzenreiter|Schlusslicht)/i);
    expect(html).not.toMatch(/class="[^"]*(gut|schlecht|rot|gruen)[^"]*"/);
  });

  it('verspricht keine Datenspenden — die gibt es in Maloja nicht', () => {
    expect(text).not.toMatch(/spende|Spenden|Datenspende|Nichtbezug/i);
  });

  it('ist von «Kantone im Vergleich» aus verlinkt', () => {
    expect(lies('kantone-im-vergleich')).toContain('<a href="/kantonsatlas/">Kantonsatlas</a>');
  });
});
