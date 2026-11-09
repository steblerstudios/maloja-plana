import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { KANTONSSEITEN, WEGE, WEG_AUS_NOTEKEY, monatJahr } from '../../scripts/seiten/praemienverbilligung-kantone.mjs';
import { BASIS, QUELLEN } from '../../scripts/seiten-inhalt.mjs';
import { CANTONAL_IPV } from '../config/cantonalData.js';
import { CANTONAL_LINKS, CANTONAL_LINKS_GEPRUEFT } from '../data/direktLinks.js';

// ─────────────────────────────────────────────────────────────
// Kantonsseiten /praemienverbilligung/<kanton>/ · seit 09.11.2026
// Bauplan: docs/roadmap/BAUPLAN-kantonsseiten-2026-11.md (E1–E4, Riegel §4)
//
// Was dieser Wächter hält:
//   • dieselbe Kernregel wie die Erklärseiten: KEINE Zahlen ausser dem Prüfdatum
//   • der Weg auf der Seite ist derselbe wie in der App (CANTONAL_IPV.noteKey)
//   • die Stelle verlinkt den geprüften Amtslink aus der App, keinen eigenen
//   • das Datum heisst «abgeglichen», ist das Datum der Fachprüfung der Seite und
//     sagt «keine amtliche Auskunft» (Rechtsprüfung 09.11.2026)
//   • «rechnet» steht nur, wo die App ein Rechenmodul für den Kanton hat (UWG)
//   • die Stelle steht als Text, der Link ist als Amtsseite beschriftet
//   • jede Seite hat genug eigenen Text (gegen «Doorway Pages», Bauplan §4.2)
//   • jede Seite ist von der Hauptseite verlinkt und steht in der Sitemap
// ─────────────────────────────────────────────────────────────

const WURZEL = process.cwd();
const lies = (pfad) => fs.readFileSync(path.resolve(WURZEL, 'public', pfad, 'index.html'), 'utf8');
const sichtbar = (html) => html
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const hauptteil = (html) => sichtbar((html.match(/<main>([\s\S]*?)<\/main>/) || [])[1] || '');

// Dieselben Muster wie in oeffentlicheSeiten.test.js («nennt KEINE Beträge …»).
const VERBOTEN = [
  /\bCHF\b/i,
  /\bFr\.\s*\d/,
  /\bFranken\b/i,
  /\d+\s*%/,
  /\d[\d'’.]*\s*(Franken|CHF)/i,
  /\b\d{4,}\b/,
  /\b\d{1,3}['’]\d{3}\b/,
];

// Schwelle für eigenen Text. Gemessen an den drei Piloten am 09.11.2026, erste
// Fassung ZH 0.47 · BE 0.48 · TG 0.51, nach der Fachprüfung ZH 0.50 · BE 0.64 ·
// TG 0.60 (Wortanteil der Sätze, die auf keiner anderen
// Kantonsseite vorkommen, Kantonsname herausgerechnet). 0.40 liegt darunter, mit
// Luft für kürzere Kantone. Nicht anheben, um eine Seite durchzulassen: dann
// fehlt der Seite Inhalt, nicht dem Test Toleranz.
const EIGENER_TEXT_MIN = 0.40;

describe('Kantonsseiten Prämienverbilligung', () => {
  it('es gibt die drei Pilotkantone (Entscheid E2)', () => {
    expect(KANTONSSEITEN.map((k) => k.kanton).sort()).toEqual(['BE', 'TG', 'ZH']);
  });

  describe.each(KANTONSSEITEN.map((k) => [k.pfad, k]))('/%s/', (pfad, k) => {
    const html = lies(pfad);
    const text = sichtbar(html);

    it('Titel, Beschreibung, canonical, Sprache, eine h1, indexierbar', () => {
      const titel = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
      expect(titel).toBe(`${k.titel} — Maloja Plana`);
      expect(titel.length).toBeLessThanOrEqual(65);
      expect(k.beschreibung.length).toBeGreaterThanOrEqual(70);
      expect(k.beschreibung.length).toBeLessThanOrEqual(160);
      expect(html).toContain(`<link rel="canonical" href="${BASIS}/${pfad}/">`);
      expect(html).toContain('<html lang="de">');
      expect((html.match(/<h1[\s>]/g) || []).length).toBe(1);
      expect(html).toContain('<meta name="robots" content="index, follow">');
    });

    it('nennt KEINE Beträge, Prozentsätze, Grenzen oder Jahreszahlen — ausser dem Prüfdatum', () => {
      const ausnahme = `Mit den Unterlagen des Kantons abgeglichen: ${k.geprueft}.`;
      expect(text, 'Prüfdatum fehlt').toContain(ausnahme);
      const rest = text.split(ausnahme).join(' ');
      for (const muster of VERBOTEN) {
        expect(rest, `Muster ${muster} auf /${pfad}/`).not.toMatch(muster);
      }
    });

    it('das Abgleich-Datum stammt aus dem Text des Kantons und ist als keine amtliche Auskunft markiert', () => {
      expect(k.geprueft).toBe(monatJahr(k.abgeglichen));
      expect(text).toContain(`abgeglichen: ${k.geprueft}. Keine amtliche Auskunft.`);
      // Das alte Etikett behauptete eine Prüfung des Seitentexts, die es so nicht gab.
      expect(text).not.toContain('Inhaltlich geprüft');
    });

    it('verspricht eine Rechnung nur, wo die App ein Rechenmodul für den Kanton hat', () => {
      const modul = k.appModul ? path.resolve(WURZEL, 'src', 'config', k.appModul) : null;
      if (modul) expect(fs.existsSync(modul), modul).toBe(true);
      const karte = sichtbar(html.split('<div class="karte">')[1].split('</div>')[0]);
      if (k.appRechnet) expect(karte).toContain('rechnet das für viele Haushalte durch');
      else expect(karte).not.toMatch(/rechnet/);
    });

    it('nennt eine Frist (ohne Datum) im Kasten «Muss ich etwas tun?»', () => {
      const box = sichtbar(html.split(`<div class="weg ${k.weg}">`)[1].split('</div>')[0]);
      expect(box).toMatch(/Frist|laufende Jahr/);
    });

    it('nennt denselben Weg wie die App, mit Wort und Zeichen', () => {
      const weg = WEG_AUS_NOTEKEY(CANTONAL_IPV[k.kanton].noteKey);
      expect(weg, `noteKey ${CANTONAL_IPV[k.kanton].noteKey}`).toBe(k.weg);
      expect(html).toContain(`<div class="weg ${weg}">`);
      expect(text).toContain(WEGE[weg].label);
      // Zeichen vorhanden und für Screenreader ausgeblendet, weil das Wort daneben steht.
      const box = html.split(`<div class="weg ${weg}">`)[1].split('</div>')[0];
      expect(box).toMatch(/<svg[^>]*aria-hidden="true"/);
    });

    it('nennt die Stelle als Text und verlinkt den geprüften Amtslink der App als «Amtsseite»', () => {
      expect(k.link).toBe(CANTONAL_LINKS[k.kanton].ipv);
      expect(CANTONAL_LINKS_GEPRUEFT[k.kanton].ipv).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(html).toContain(`<p class="stelle">${k.stelle}</p>`);
      expect(html).toContain(`Amtsseite: <a href="${k.link}" rel="noopener">`);
      // Befund Sprache/a11y/Recht 09.11.2026: Der Linktext darf nicht die Stelle nennen,
      // wenn das Ziel eine andere Seite ist.
      expect(html).not.toContain(`rel="noopener">${k.stelle}</a>`);
    });

    it('Quellen: Auswahl, ohne Verbindung, KVG Art. 65 dabei', () => {
      expect(text).toContain('Eine Auswahl, nicht abschliessend.');
      expect(text).toContain('in keiner Verbindung');
      expect(html).toContain(QUELLEN.fedlexKvgArt65.url);
    });

    it('verlinkt nach aussen nur Amtslink, eigene Quellen, Lizenz und Quellcode', () => {
      const erlaubt = new Set([k.link, ...k.quellen.filter((q) => q.url).map((q) => q.url),
        'https://www.gnu.org/licenses/agpl-3.0.html', 'https://github.com/steblerstudios/maloja-plana']);
      const aussen = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1])
        .filter((u) => !u.startsWith(BASIS));
      for (const u of aussen) expect(erlaubt.has(u), `fremder Link ${u}`).toBe(true);
    });

    it('trägt den Vorbehalt weit oben und verlinkt Impressum und Datenschutz', () => {
      expect(text.slice(0, 700)).toContain('keine Rechts- oder Finanzberatung');
      expect(text).toContain('zuständigen Stelle');
      expect(html).toContain('href="/rechtliches/"');
      expect(text).toContain('geschlossenen Beta');
    });

    it('Brotkrume mit drei Stufen, sichtbar und im JSON-LD', () => {
      expect(html).toContain('<a href="/praemienverbilligung/">Prämienverbilligung</a> › ' + k.brotkrume);
      const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
      const krume = ld['@graph'].find((g) => g['@type'] === 'BreadcrumbList');
      expect(krume.itemListElement.map((i) => i.name)).toEqual(['Maloja Plana', 'Prämienverbilligung', k.brotkrume]);
    });

    it(`hat mindestens ${EIGENER_TEXT_MIN * 100} % eigenen Text`, () => {
      const namen = new RegExp(KANTONSSEITEN.map((x) => x.name).join('|'), 'g');
      const saetze = (p) => hauptteil(lies(p)).split(/(?<=[.?!])\s+/)
        .map((s) => s.trim().replace(namen, 'X')).filter((s) => s.length > 20);
      const eigene = saetze(pfad);
      const andere = new Set(KANTONSSEITEN.filter((x) => x.pfad !== pfad).flatMap((x) => saetze(x.pfad)));
      const woerter = (a) => a.join(' ').split(' ').length;
      const anteil = woerter(eigene.filter((s) => !andere.has(s))) / woerter(eigene);
      expect(anteil).toBeGreaterThanOrEqual(EIGENER_TEXT_MIN);
    });

    it('ist von der deutschen Hauptseite verlinkt und steht in der Sitemap', () => {
      expect(lies('praemienverbilligung')).toContain(`<a href="/${pfad}/">${k.brotkrume}</a>`);
      const xml = fs.readFileSync(path.resolve(WURZEL, 'public', 'sitemap.xml'), 'utf8');
      expect(xml).toContain(`<loc>${BASIS}/${pfad}/</loc>`);
    });

    it('gibt es nur auf Deutsch (keine ungelesene Übersetzung)', () => {
      for (const s of ['fr', 'it', 'en', 'rm']) {
        expect(fs.existsSync(path.resolve(WURZEL, 'public', s, pfad, 'index.html')), `/${s}/${pfad}/`).toBe(false);
      }
    });
  });

  it('die Übersetzungen der Hauptseite verlinken keine Kantonsseite (die gibt es nur auf Deutsch)', () => {
    for (const s of ['fr', 'it', 'en', 'rm']) {
      expect(lies(`${s}/praemienverbilligung`)).not.toContain('/praemienverbilligung/zuerich/');
    }
  });
});
