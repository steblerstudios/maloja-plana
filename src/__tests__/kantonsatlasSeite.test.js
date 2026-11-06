import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { KANTONSATLAS, stufen } from '../../scripts/seiten/kantonsatlas.mjs';
import { HINTERGRUND } from '../../scripts/seiten/hintergrund.mjs';
import { KANTONE, EBENEN, KITA_NICHT_VERGLICHEN } from '../../scripts/seiten-vergleich.mjs';
import de from '../i18n/de.js';

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

  describe('Befunde (E3)', () => {
    const abschnitt = html.match(/<h2 id="befunde"[\s\S]*?(?=<h2 |<aside|<section class="cta|$)/)[0];
    const befunde = [...abschnitt.matchAll(/<article class="befund"[\s\S]*?<\/article>/g)].map((m) => m[0]);

    it('jeder Befund nennt Art, Belegt und die zuständige Stelle — und ist belegt', () => {
      expect(befunde.length).toBe(2);
      for (const b of befunde) {
        expect(b).toMatch(/<dt>Art<\/dt><dd>(grosse Spanne|Stand der Umsetzung|Umsetzung unklar)<\/dd>/);
        expect(b).toContain('<dt>Belegt</dt><dd>ja</dd>');
        expect(b).toContain('<dt>Wer die Regel festlegt</dt>');
        expect(b).toMatch(/<sup class="beleg[^"]*"><a href="#quelle-/);
      }
    });

    it('der Kita-Befund rechnet seine Zahlen aus den Daten und listet keine Kantone nach Rang', () => {
      // Rechtsprüfung 07.11.2026: eine selbst gewählte Schwelle mit sortierter Liste wirkte wie eine Rangliste.
      const b = befunde[0];
      const verglichen = KANTONE.filter((k) => !KITA_NICHT_VERGLICHEN.includes(k));
      const w = (k) => EBENEN.kita.wert(k);
      const bund = 25800;
      const unter = verglichen.filter((k) => w(k) < bund).length;
      const ab = verglichen.filter((k) => w(k) >= bund).length;
      expect(b).toContain(`${unter} Kantone liegen unter dem Betrag des Bundes, ${ab} auf oder darüber`);
      const vs = KANTONE.map(w);
      const tief = KANTONE.find((k) => w(k) === Math.min(...vs));
      const hoch = KANTONE.find((k) => w(k) === Math.max(...vs));
      expect(b).toContain(`von ${EBENEN.kita.fmt(w(tief))} Franken im Kanton ${de.cantons[tief]} bis ${EBENEN.kita.fmt(w(hoch))} Franken im Kanton ${de.cantons[hoch]}`);
      const genannt = KANTONE.filter((k) => b.includes(de.cantons[k]));
      expect(genannt.sort()).toEqual([tief, hoch, ...KITA_NICHT_VERGLICHEN].sort());
    });

    it('fordert nichts und nennt keine ungeprüften Befunde', () => {
      const t = abschnitt.replace(/<[^>]+>/g, ' ');
      expect(t).not.toMatch(/Petition|unterschreiben|Unterschrift|fordern|Forderung:|Instrument/i);
      // B1 (Alimente VD) erst nach der Antwort des BRAPA, K1 hielt der Nachrechnung nicht stand.
      expect(t).not.toMatch(/Alimente|BRAPA|Prämienlast/);
    });
  });
});
