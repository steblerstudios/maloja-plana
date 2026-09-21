import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { GEPRUEFT, inhaltFuer, QUELLEN, quelleFuer, BASIS } from '../../scripts/seiten-inhalt.mjs';
import { SPRACHEN, RAHMEN, SPRACHNAME } from '../../scripts/seiten-sprachen.mjs';

// ─────────────────────────────────────────────────────────────
// Die Erklärseiten in fünf Sprachen · seit 21.09.2026
//
// `oeffentlicheSeiten.test.js` bewacht die deutschen Seiten. Dieser Wächter
// bewacht die Sprach-Dimension, und zwar zwei Dinge, die verschieden schwer
// wiegen:
//
//   1. 🛑 DIE SPERRE. Vier der fünf Sprachen sind Übersetzungen, die kein
//      Mensch gegengelesen hat. Sie dürfen existieren, aber sie dürfen nicht
//      in den Index. «freigegeben: false» muss deshalb ZWEI Dinge zugleich
//      bedeuten — noindex auf der Seite UND nicht in der Sitemap. Fällt eine
//      der beiden Hälften weg, geht ungelesener Text über Schweizer
//      Sozialrecht öffentlich. Das ist der Grund, warum es diese Datei gibt.
//
//   2. Die Zahlen-Regel gilt in JEDER Sprache. Eine Regel, die nur auf
//      Deutsch greift, ist beim ersten übersetzten Betrag wertlos.
//
// Dazu die Form: gleiche Seiten, gleiche Abschnitte, gleiche FAQ-Anzahl wie im
// Original. Eine Sprache, die inhaltlich davonläuft, ist schlimmer als eine,
// die fehlt — man merkt es nicht.
// ─────────────────────────────────────────────────────────────

const WURZEL = process.cwd();
const dateiFuer = (pfad, sprache) =>
  path.resolve(WURZEL, 'public', ...`${sprache.praefix}${pfad}`.split('/'), 'index.html');
const lies = (pfad, sprache) => fs.readFileSync(dateiFuer(pfad, sprache), 'utf8');

const sichtbar = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const jsonLd = (html) => {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  return m ? JSON.parse(m[1]) : null;
};

const DEUTSCH = SPRACHEN.find((s) => s.code === 'de');
const UEBRIGE = SPRACHEN.filter((s) => s.code !== 'de');

describe('Erklärseiten in fünf Sprachen', () => {
  it('kennt genau die fünf Sprachen der App', () => {
    expect(SPRACHEN.map((s) => s.code)).toEqual(['de', 'fr', 'it', 'en', 'rm']);
    for (const s of SPRACHEN) {
      expect(RAHMEN[s.code], `Rahmen-Texte fehlen für ${s.code}`).toBeTruthy();
      expect(SPRACHNAME[s.code], `Sprachname fehlt für ${s.code}`).toBeTruthy();
    }
  });

  it('Deutsch bleibt ohne Präfix, die übrigen bekommen eines', () => {
    // Die deutschen Adressen sind seit dem 20.09. in der Sitemap und dürfen
    // nicht wandern — eine umgezogene URL ohne Umleitung ist ein toter Link.
    expect(DEUTSCH.praefix).toBe('');
    for (const s of UEBRIGE) expect(s.praefix).toBe(`${s.code}/`);
  });

  // ─── 🛑 Die Sperre ────────────────────────────────────────────────────────
  describe('die Freigabe-Sperre', () => {
    const xml = fs.readFileSync(path.resolve(WURZEL, 'public', 'sitemap.xml'), 'utf8');

    for (const sprache of SPRACHEN) {
      const { seiten, sonderseiten } = inhaltFuer(sprache.code);

      for (const seite of [...seiten, ...sonderseiten]) {
        const html = lies(seite.pfad, sprache);

        it(`${sprache.code}/${seite.pfad}: robots passt zur Freigabe`, () => {
          const robots = html.match(/<meta name="robots" content="([^"]+)">/)?.[1];
          expect(robots, 'kein robots-Tag').toBeTruthy();
          if (sprache.freigegeben) {
            expect(robots).toBe('index, follow');
          } else {
            expect(robots, `${sprache.code} ist nicht freigegeben und MUSS noindex tragen`)
              .toBe('noindex, follow');
          }
        });

        it(`${sprache.code}/${seite.pfad}: steht nur bei Freigabe in der Sitemap`, () => {
          const loc = `<loc>${BASIS}/${sprache.praefix}${seite.pfad}/</loc>`;
          if (sprache.freigegeben) {
            expect(xml, 'freigegebene Seite fehlt in der Sitemap').toContain(loc);
          } else {
            expect(xml, `${sprache.code} ist nicht freigegeben und darf NICHT in der Sitemap stehen`)
              .not.toContain(loc);
          }
        });
      }

      it(`${sprache.code}: Entwurfs-Hinweis genau dann, wenn nicht freigegeben`, () => {
        const html = lies(seiten[0].pfad, sprache);
        if (sprache.freigegeben) {
          expect(RAHMEN[sprache.code].entwurfBanner).toBeNull();
          expect(html).not.toContain('class="entwurf"');
        } else {
          expect(RAHMEN[sprache.code].entwurfBanner, 'Entwurfs-Hinweis fehlt').toBeTruthy();
          expect(html, 'nicht freigegeben, aber ohne sichtbaren Hinweis').toContain('class="entwurf"');
        }
      });

      it(`${sprache.code}: Prüfdatum nur bei Freigabe`, () => {
        // Ein «Inhaltlich geprüft»-Datum auf einer ungelesenen Übersetzung
        // wäre die Behauptung einer Prüfung, die nicht stattgefunden hat.
        const html = lies(seiten[0].pfad, sprache);
        const label = RAHMEN[sprache.code].geprueftLabel;
        if (sprache.freigegeben) {
          expect(sprache.geprueft).toBeTruthy();
          expect(sichtbar(html)).toContain(`${label}: ${sprache.geprueft}.`);
        } else {
          expect(sprache.geprueft).toBeNull();
          expect(sichtbar(html), 'behauptet eine Prüfung, die es nicht gab')
            .not.toContain(`${label}:`);
        }
      });
    }

    it('die Sitemap führt ausschliesslich freigegebene Sprachen', () => {
      const frei = SPRACHEN.filter((s) => s.freigegeben);
      const erwartet = frei.reduce((n, s) => {
        const i = inhaltFuer(s.code);
        return n + i.seiten.length + i.sonderseiten.length;
      }, 0) + 1; // + die Startseite
      expect((xml.match(/<loc>/g) || []).length).toBe(erwartet);
    });

    it('hreflang nennt keine Sprache, die nicht freigegeben ist', () => {
      for (const sprache of SPRACHEN) {
        const html = lies(inhaltFuer(sprache.code).seiten[0].pfad, sprache);
        const ringe = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)"/g)]
          .map((m) => m[1])
          .filter((l) => l !== 'x-default');
        for (const l of ringe) {
          const s = SPRACHEN.find((x) => x.htmlLang === l);
          expect(s?.freigegeben, `hreflang zeigt auf ${l}, das nicht freigegeben ist`).toBe(true);
        }
      }
    });
  });

  // ─── Die Zahlen-Regel, in jeder Sprache ───────────────────────────────────
  describe('keine Beträge, Prozentsätze oder Fristen — in allen Sprachen', () => {
    const verboten = [
      /\bCHF\b/i,
      /\bFr\.\s*\d/,
      /\b(Franken|francs|franchi|francs suisses)\b/i,
      /\d+\s*%/,
      /\b\d{4,}\b/,
      /\b\d{1,3}['’]\d{3}\b/,
    ];

    for (const sprache of SPRACHEN) {
      const { seiten } = inhaltFuer(sprache.code);
      for (const seite of seiten) {
        it(`${sprache.code}/${seite.pfad}`, () => {
          let text = sichtbar(lies(seite.pfad, sprache));
          // Dieselbe eine benannte Ausnahme wie auf Deutsch: das sichtbare
          // Prüfdatum. Es steht nur auf freigegebenen Sprachen, siehe oben.
          if (sprache.geprueft) {
            text = text.split(`${RAHMEN[sprache.code].geprueftLabel}: ${sprache.geprueft}.`).join(' ');
          }
          // «3.01» ist die amtliche Nummer eines AHV-Merkblatts, keine Zahl im
          // Sinn der Regel — und sie steht in der Quellenliste, nicht im Text.
          text = text.split('3.01').join(' ');
          for (const muster of verboten) {
            expect(text, `${muster} auf /${sprache.praefix}${seite.pfad}/`).not.toMatch(muster);
          }
        });
      }
    }

    it('Gegenprobe: die Regel schlägt auf übersetzte Beträge an', () => {
      // Ohne diese Zeile misst die Regel nur sich selbst.
      expect(sichtbar('<p>Le forfait s’élève à 1’031 francs.</p>')).toMatch(/\bfrancs\b/i);
      expect(sichtbar('<p>Il fabbisogno è di 1’031 franchi.</p>')).toMatch(/\bfranchi\b/i);
      expect(sichtbar('<p>Up to 17.5 % of income.</p>')).toMatch(/\d+\s*%/);
    });
  });

  // ─── Form: gleiche Struktur wie das Original ──────────────────────────────
  describe('Struktur-Gleichstand mit dem deutschen Original', () => {
    const de = inhaltFuer('de');

    for (const sprache of UEBRIGE) {
      const uebersetzt = inhaltFuer(sprache.code);

      it(`${sprache.code}: dieselben Seiten in derselben Reihenfolge`, () => {
        expect(uebersetzt.seiten.map((s) => s.pfad)).toEqual(de.seiten.map((s) => s.pfad));
        expect(uebersetzt.sonderseiten.map((s) => s.pfad)).toEqual(de.sonderseiten.map((s) => s.pfad));
      });

      it(`${sprache.code}: gleiche Zahl an Abschnitten, Absätzen, FAQ und Quellen`, () => {
        for (const [i, seite] of [...de.seiten, ...de.sonderseiten].entries()) {
          const u = [...uebersetzt.seiten, ...uebersetzt.sonderseiten][i];
          expect(u.abschnitte.length, `${seite.pfad}: Abschnitte`).toBe(seite.abschnitte.length);
          expect(u.faq.length, `${seite.pfad}: FAQ`).toBe(seite.faq.length);
          expect((u.quellen || []).length, `${seite.pfad}: Quellen`).toBe((seite.quellen || []).length);
          for (const [j, a] of seite.abschnitte.entries()) {
            expect(u.abschnitte[j].absaetze.length, `${seite.pfad} §${j + 1}: Absätze`)
              .toBe(a.absaetze.length);
          }
        }
      });

      it(`${sprache.code}: übersetzt wirklich — kein durchgereichter deutscher Titel`, () => {
        // Eine Sprachdatei, die versehentlich das Original kopiert, sähe sonst
        // vollständig aus und wäre es nicht.
        for (const [i, seite] of de.seiten.entries()) {
          expect(uebersetzt.seiten[i].titel, `${seite.pfad}: Titel unübersetzt`)
            .not.toBe(seite.titel);
          expect(uebersetzt.seiten[i].vorspann, `${seite.pfad}: Vorspann unübersetzt`)
            .not.toBe(seite.vorspann);
        }
      });
    }
  });

  // ─── Kopf und Verweise ────────────────────────────────────────────────────
  describe('Auszeichnung und interne Verweise', () => {
    for (const sprache of SPRACHEN) {
      const { seiten, sonderseiten } = inhaltFuer(sprache.code);

      for (const seite of [...seiten, ...sonderseiten]) {
        it(`${sprache.code}/${seite.pfad}: lang, canonical, og:locale, inLanguage`, () => {
          const html = lies(seite.pfad, sprache);
          expect(html).toContain(`<html lang="${sprache.htmlLang}">`);
          expect(html).toContain(
            `<link rel="canonical" href="${BASIS}/${sprache.praefix}${seite.pfad}/">`);
          expect(html).toContain(`<meta property="og:locale" content="${sprache.ogLocale}">`);
          const ld = jsonLd(html);
          const seitenKnoten = ld['@graph'].find((k) => k['@type'] === 'WebPage');
          expect(seitenKnoten.inLanguage).toBe(sprache.ldLang);
          expect((html.match(/<h1[ >]/g) || []).length).toBe(1);
        });

        it(`${sprache.code}/${seite.pfad}: interne Links zeigen auf Dateien, die es gibt`, () => {
          const html = lies(seite.pfad, sprache);
          const ziele = [...html.matchAll(/href="\/([^"#?]*)"/g)]
            .map((m) => m[1])
            .filter((z) => z && !z.includes('.'));
          for (const z of ziele) {
            const datei = path.resolve(WURZEL, 'public', ...z.split('/').filter(Boolean), 'index.html');
            expect(fs.existsSync(datei), `toter interner Link: /${z}`).toBe(true);
          }
        });
      }

      it(`${sprache.code}: der Sprachumschalter führt in alle fünf Sprachen`, () => {
        const html = lies(seiten[0].pfad, sprache);
        const zeile = html.match(/<p class="sprachen">([\s\S]*?)<\/p>/)?.[1];
        expect(zeile, 'kein Sprachumschalter').toBeTruthy();
        for (const s of SPRACHEN) expect(zeile).toContain(SPRACHNAME[s.code]);
        // Die aktive Sprache steht ohne Link da.
        expect(zeile).toContain(`<span aria-current="true">${SPRACHNAME[sprache.code]}</span>`);
      });
    }
  });

  // ─── Quellen ──────────────────────────────────────────────────────────────
  describe('amtliche Quellen je Sprache', () => {
    it('jede Quelle hat für jede Sprache einen Text', () => {
      for (const [schluessel, q] of Object.entries(QUELLEN)) {
        for (const s of UEBRIGE) {
          expect(q.texte?.[s.code], `${schluessel}: Beschriftung fehlt für ${s.code}`).toBeTruthy();
        }
      }
    });

    it('eine Sprach-Adresse ist immer eine echte Abweichung, nie die deutsche', () => {
      // Sonst stünde eine Adresse als «auf Französisch verfügbar» da, die es
      // nicht ist — und der Vermerk «nur auf Deutsch» fiele still weg.
      for (const [schluessel, q] of Object.entries(QUELLEN)) {
        for (const [code, url] of Object.entries(q.sprachen || {})) {
          expect(url, `${schluessel}/${code} ist die deutsche Adresse`).not.toBe(q.url);
          expect(url).toMatch(/^https:\/\//);
        }
      }
    });

    it('fehlt die Sprach-Adresse, steht der Vermerk sichtbar dabei', () => {
      for (const sprache of UEBRIGE) {
        for (const seite of inhaltFuer(sprache.code).seiten) {
          const html = lies(seite.pfad, sprache);
          const fehlende = (seite.quellen || [])
            .filter((k) => quelleFuer(k, sprache.code).nurDeutsch);
          if (fehlende.length) {
            expect(html, `${sprache.code}/${seite.pfad}: Vermerk fehlt`)
              .toContain(RAHMEN[sprache.code].nurDeutsch);
          }
        }
      }
    });

    it('Rumantsch hat für keine Quelle eine eigene Adresse — gemessen, nicht vergessen', () => {
      // Der Bund publiziert Priminfo, das AHV-Merkblatt und den ESTV-Rechner
      // nicht auf Rumantsch (geprüft 21.09.2026 mit Gegenprobe). Diese Zeile
      // hält fest, dass das ein Befund ist und keine Lücke — fällt sie eines
      // Tages, weil jemand eine rm-Adresse einträgt, ist das eine gute
      // Nachricht und der Test gehört angepasst.
      for (const q of Object.values(QUELLEN)) {
        expect(q.sprachen?.rm).toBeUndefined();
      }
    });
  });

  // ─── FAQ-Schema ───────────────────────────────────────────────────────────
  it('das FAQ-Schema enthält in jeder Sprache nur sichtbare Antworten', () => {
    for (const sprache of SPRACHEN) {
      for (const seite of inhaltFuer(sprache.code).seiten) {
        const html = lies(seite.pfad, sprache);
        const text = sichtbar(html);
        const faq = jsonLd(html)['@graph'].find((k) => k['@type'] === 'FAQPage');
        expect(faq, `${sprache.code}/${seite.pfad}: kein FAQPage`).toBeTruthy();
        for (const frage of faq.mainEntity) {
          expect(text, `${sprache.code}/${seite.pfad}: Frage nicht sichtbar`).toContain(frage.name);
          expect(text, `${sprache.code}/${seite.pfad}: Antwort nicht sichtbar`)
            .toContain(frage.acceptedAnswer.text);
        }
      }
    }
  });

  it('keine Seite lädt Skripte oder Fremdressourcen', () => {
    for (const sprache of SPRACHEN) {
      for (const seite of [...inhaltFuer(sprache.code).seiten, ...inhaltFuer(sprache.code).sonderseiten]) {
        const html = lies(seite.pfad, sprache);
        expect(html, `${sprache.code}/${seite.pfad}`).not.toMatch(/<script(?![^>]*application\/ld\+json)/);
        const fremd = [...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)]
          .map((m) => m[1])
          .filter((u) => !u.startsWith(BASIS) && !u.startsWith('https://www.gnu.org')
            && !u.startsWith('https://github.com') && !u.startsWith('https://schema.org'));
        // Übrig bleiben dürfen nur die amtlichen Quellen — verlinkt, nicht geladen.
        for (const u of fremd) {
          const bekannt = Object.values(QUELLEN).some((q) =>
            q.url === u || Object.values(q.sprachen || {}).includes(u));
          expect(bekannt, `${sprache.code}/${seite.pfad}: unbekannte fremde Adresse ${u}`).toBe(true);
        }
      }
    }
  });

  it('das deutsche Prüfdatum ist unverändert', () => {
    // Sicherung gegen ein versehentliches Mitziehen beim Sprachumbau: das
    // Datum sagt, wann ein MENSCH den Inhalt gelesen hat. Es darf sich beim
    // Übersetzen nicht bewegen.
    expect(DEUTSCH.geprueft).toBe(GEPRUEFT);
  });
});
