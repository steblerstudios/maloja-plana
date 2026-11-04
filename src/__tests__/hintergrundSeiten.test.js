import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { HINTERGRUND, KRANKENKASSE } from '../../scripts/seiten/krankenkasse.mjs';
import { kantonsPraemien, einsetzen, zahlen, PRAEMIENJAHR } from '../../scripts/seiten-figuren.mjs';
import { BASIS } from '../../scripts/seiten-inhalt.mjs';
import { PRAEMIEN, GEMEINDEN } from '../data/praemienRegionenDaten.js';
import { NATIONAL_AVG_PREMIUM_JE_JAHR } from '../data/praemienRegionen.js';
import { FRANCHISE_STUFEN, SELBSTBEHALT_MAX } from '../data/kvgLeistungen.js';

// ─────────────────────────────────────────────────────────────
// Hintergrundseiten · Entscheid Stebler Studios 04.11.2026 («Weg A»)
//
// Anders als die Erklärseiten DÜRFEN diese Seiten Zahlen nennen (Begründung:
// scripts/seiten/krankenkasse.mjs, Kopf). Dafür hält dieser Wächter drei Riegel:
//
//   • Was Maloja führt, steht so auf der Seite, wie es in src/data steht —
//     Prämien je Kantonsregion, Schweizer Mittel, Franchise und Dach.
//   • Der Stand ist sichtbar, und nach `pruefenBis` wird dieser Test rot, bis
//     jemand den Text gegen die neuen BAG-Zahlen gelesen hat.
//   • Kein Skript, nur Deutsch, keine Übersetzung, auf die verwiesen würde.
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
const rp = (n) => Number(n).toFixed(2);

describe('Hintergrundseiten', () => {
  it('kennt die Krankenkassen-Seite', () => {
    expect(HINTERGRUND.map((h) => h.pfad)).toContain('krankenkasse');
  });

  describe.each(HINTERGRUND.map((h) => [h.pfad, h]))('/%s/', (pfad, seite) => {
    const html = lies(pfad);
    const text = sichtbar(html);

    it('ist noch nicht über ihr Prüfdatum hinaus', () => {
      // Absichtlich ein Datum: die Zahlen veralten jedes Jahr Ende September.
      // Wird das rot, Text gegen die neuen BAG-Zahlen lesen, dann `pruefenBis`
      // und `stand` in scripts/seiten/<pfad>.mjs nachführen.
      expect(seite.pruefenBis).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const heute = new Date().toISOString().slice(0, 10);
      expect(heute <= seite.pruefenBis,
        `${pfad}: Prüfdatum ${seite.pruefenBis} überschritten — Zahlen und Text gegen das neue Prämienjahr lesen`).toBe(true);
    });

    it('zeigt sichtbar, welchen Stand die Zahlen haben', () => {
      expect(text).toContain('Stand der Zahlen:');
      expect(text).toContain(`Prämien ${PRAEMIENJAHR}`);
    });

    it('lässt keinen Platzhalter und keinen Figur-Block stehen', () => {
      expect(html).not.toMatch(/\{\{|\}\}/);
      expect(html).not.toMatch(/<!--(FIG|TAB):/);
    });

    it('sagt nicht «nennt bewusst keine Beträge» — das gilt hier nicht', () => {
      expect(text).not.toMatch(/nennt bewusst keine Beträge/);
      expect(text).toContain('keine Rechts-, Versicherungs- oder Finanzberatung');
    });

    it('nennt im Quellen-Hinweis keine Stelle, die gar nicht verlinkt ist', () => {
      // Rechtsprüfung 04.11.2026: der Rahmentext der Erklärseiten nennt die SKOS.
      expect(text).toContain(seite.quellenHinweis);
      if (!seite.quellen.some((q) => /skos/i.test(q.url))) expect(text).not.toContain('SKOS');
    });

    it('ist indexierbar, auf Deutsch, mit sich selbst als kanonischer Adresse', () => {
      expect(html).toContain('<html lang="de">');
      expect(html).toContain('<meta name="robots" content="index, follow">');
      expect(html).toContain(`<link rel="canonical" href="${BASIS}/${pfad}/">`);
      expect((html.match(/<h1[\s>]/g) || []).length).toBe(1);
    });

    it('kommt ohne JavaScript aus', () => {
      const skripte = [...html.matchAll(/<script([^>]*)>/g)].map((m) => m[1]);
      for (const attr of skripte) expect(attr).toContain('application/ld+json');
      expect(html).toContain("default-src 'none'");
    });

    it('gibt es nur auf Deutsch — kein hreflang, keine Übersetzung, kein Link darauf', () => {
      expect(html).not.toContain('hreflang=');
      for (const code of ['fr', 'it', 'en', 'rm']) {
        expect(fs.existsSync(path.resolve(WURZEL, 'public', code, pfad, 'index.html'))).toBe(false);
      }
      expect(text).toContain('diese Seite gibt es bisher nur auf Deutsch');
    });

    it('jede Figur ist ein beschriftetes Bild mit Titel und Beschreibung', () => {
      const svgs = [...html.matchAll(/<svg [^>]*>([\s\S]*?)<\/svg>/g)];
      expect(svgs.length).toBeGreaterThanOrEqual(4);
      for (const [ganz, innen] of svgs) {
        expect(ganz).toMatch(/role="img"/);
        expect(ganz).toMatch(/aria-labelledby="[^"]+-t [^"]+-d"/);
        expect(innen).toMatch(/<title id="[^"]+">[^<]{10,}<\/title>/);
        expect(innen).toMatch(/<desc id="[^"]+">[^<]{20,}<\/desc>/);
      }
    });

    it('verlinkt nach aussen nur die eingetragenen Quellen', () => {
      const erlaubt = new Set([
        ...seite.quellen.map((q) => q.url),
        'https://www.gnu.org/licenses/agpl-3.0.html',
        'https://github.com/steblerstudios/maloja-plana',
      ]);
      const extern = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'))
        .filter((u) => !u.startsWith(BASIS));
      for (const u of extern) expect(erlaubt, `nicht eingetragener Link: ${u}`).toContain(u);
      for (const q of seite.quellen) expect(q.url).toMatch(/^https:\/\//);
    });

    it('steht einmal in der Sitemap, ohne Sprach-Alternativen', () => {
      const xml = fs.readFileSync(path.resolve(WURZEL, 'public', 'sitemap.xml'), 'utf8');
      const loc = `<loc>${BASIS}/${pfad}/</loc>`;
      expect(xml.split(loc).length - 1).toBe(1);
      const eintrag = xml.slice(xml.indexOf(loc), xml.indexOf('</url>', xml.indexOf(loc)));
      expect(eintrag).not.toContain('xhtml:link');
    });
  });

  // ─── Die Zahlen kommen aus Malojas Daten ─────────────────────────────────
  describe('/krankenkasse/ · Zahlen aus src/data', () => {
    const html = lies('krankenkasse');
    const text = sichtbar(html);
    const figur = html.match(/<svg [^>]*aria-labelledby="fig-kantone-t[\s\S]*?<\/svg>/)[0];

    it('jede Kantonsregion steht mit ihrer Prämie im Kantonsbild', () => {
      const tabelle = PRAEMIEN[PRAEMIENJAHR];
      expect(Object.keys(tabelle).length).toBeGreaterThan(26);
      for (const [schluessel, werte] of Object.entries(tabelle)) {
        expect(figur, `${schluessel} fehlt`).toContain(rp(werte[2]));
      }
      // Alle 26 Kantone, je eine Zeile.
      const kantone = kantonsPraemien();
      expect(kantone.length).toBe(26);
      for (const k of kantone) expect(figur).toContain(`>${k.kanton}</text>`);
    });

    it('nennt für Kantone mit mehreren Regionen die Spanne, keinen selbst gemittelten Wert', () => {
      const mehrere = kantonsPraemien().filter((k) => !k.eineRegion);
      expect(mehrere.map((k) => k.kanton).sort()).toEqual(
        ['BE', 'BL', 'FR', 'GR', 'LU', 'SG', 'SH', 'TI', 'VD', 'VS', 'ZH']);
      for (const k of mehrere) expect(figur).toContain(`>${rp(k.tief)} · `);
      // Die Zürcher Tabellenzeile: Spanne der drei Regionen.
      expect(text).toMatch(new RegExp(`Zürich ${rp(Math.min(...[1, 2, 3].map((r) => PRAEMIEN[PRAEMIENJAHR]['ZH' + r][2])))} bis`));
    });

    it('der tiefste und der höchste Kanton im Text sind die aus den Daten', () => {
      const alle = Object.entries(PRAEMIEN[PRAEMIENJAHR]).map(([k, w]) => [k, w[2]]);
      const tief = alle.reduce((a, b) => (b[1] < a[1] ? b : a));
      const hoch = alle.reduce((a, b) => (b[1] > a[1] ? b : a));
      expect(text).toContain(`im Schnitt in Zug ${rp(tief[1])} Franken, in Genf ${rp(hoch[1])} Franken`);
      expect(tief[0]).toBe('ZG0');
      expect(hoch[0]).toBe('GE0');
    });

    it('das Schweizer Mittel stammt aus praemienRegionen.js', () => {
      const m = NATIONAL_AVG_PREMIUM_JE_JAHR[PRAEMIENJAHR];
      for (const v of [m.erwachsene, m.junge, m.kinder, m.gesamt]) expect(text).toContain(rp(v));
    });

    it('Franchise und Dach stammen aus kvgLeistungen.js', () => {
      const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
      const min = Math.min(...FRANCHISE_STUFEN), max = Math.max(...FRANCHISE_STUFEN);
      expect(text).toContain(`zwischen ${fmt(min)} und ${fmt(max)} Franken`);
      expect(text).toContain(`höchstens ${fmt(min + SELBSTBEHALT_MAX)} bis ${fmt(max + SELBSTBEHALT_MAX)} Franken`);
    });

    it('das Zürcher Beispiel zu den Prämienregionen stimmt mit der Gemeindeliste', () => {
      const zh = Object.values(GEMEINDEN).filter((g) => g[0] === 'ZH');
      const region = (name) => zh.find((g) => g[1] === name)?.[2];
      expect(zh.filter((g) => g[2] === 1).map((g) => g[1])).toEqual(['Zürich']);
      for (const n of ['Winterthur', 'Uster', 'Dietikon']) expect(region(n)).toBe(2);
      for (const n of ['Bülach', 'Andelfingen']) expect(region(n)).toBe(3);
      expect(text).toContain('Winterthur, Uster und Dietikon sind in Region 2, Bülach und Andelfingen in Region 3');
    });
  });

  // ─── Verweise aus den Erklärseiten ───────────────────────────────────────
  it('ist aus «Was steht mir zu?» und «Prämienverbilligung» verlinkt — nur auf Deutsch', () => {
    for (const p of ['was-steht-mir-zu', 'praemienverbilligung']) {
      expect(lies(p)).toContain(`<a href="/krankenkasse/">${KRANKENKASSE.titel}</a>`);
    }
    for (const p of ['fr/praemienverbilligung', 'it/was-steht-mir-zu', 'en/praemienverbilligung', 'rm/praemienverbilligung']) {
      expect(lies(p)).not.toContain('/krankenkasse/');
    }
  });

  // ─── Gegenproben: die Riegel schlagen an ─────────────────────────────────
  it('ein unbekannter Platzhalter bricht den Bau ab, statt leer durchzurutschen', () => {
    expect(() => einsetzen('{{gibtsnicht}}', zahlen())).toThrow(/Unbekannte Zahl/);
    expect(() => einsetzen('<!--FIG:gibtsnicht-->', zahlen(), {})).toThrow(/Unbekannter Block/);
  });

  it('der Prüfdatum-Riegel würde ein vergangenes Datum bemerken', () => {
    const heute = new Date().toISOString().slice(0, 10);
    expect(heute <= '2000-01-01').toBe(false);
  });
});
