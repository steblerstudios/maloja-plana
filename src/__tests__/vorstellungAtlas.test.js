import { describe, it, expect } from 'vitest';
import { vorstellungBauen } from '../../scripts/seiten/vorstellung.mjs';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BRILLEN, KARTE_MASS, karteBild, stufen, KARTEN_FRUCHT, FRUCHT_STUFEN } from '../../scripts/seiten/kantonsatlas.mjs';

// Kantonsatlas als Brückenstück, Teil B (Stebler Studios 09.11.2026, «Ja, A bis C bauen»): Die Website zeigt den
// Atlas als eigenen Abschnitt; jede Brille führt gefiltert hinein (/kantonsatlas/#fuer-<id>, Teil A in #803).
const html = vorstellungBauen();
const abschnitt = html.match(/<section id="atlas" aria-labelledby="t-atlas">[\s\S]*?<\/section>/)[0];

describe('Vorstellungsseite: Abschnitt Kantonsatlas', () => {
  // «Ein Blick hinein» ist seit 10.11.2026 in Kehre 7 und die Situationen aufgegangen: der Atlas folgt den Situationen.
  it('steht zwischen den Situationen und «Holen»', () => {
    const i = (s) => html.indexOf(s);
    expect(i('id="t-lagen"')).toBeLessThan(i('id="t-atlas"'));
    expect(i('id="t-atlas"')).toBeLessThan(i('id="t-holen"'));
  });

  it('jede Brille mit Name und Frage aus dem Atlas und einem Weg gefiltert hinein', () => {
    for (const b of BRILLEN) {
      expect(abschnitt, b.id).toContain(`<h3>${b.name}</h3><p>${b.frage}</p>`);
      expect(abschnitt, b.id).toContain(`<a href="/kantonsatlas/#fuer-${b.id}">`);
    }
  });

  it('die Zahl der Karten kommt aus den Brillen, ausgeschrieben wie «sieben Kapitel»', () => {
    expect(new Set(BRILLEN.flatMap((b) => b.karten)).size).toBe(10);
    expect(abschnitt).toContain('<a class="knopf zweit" href="/kantonsatlas/">Alle zehn Karten ansehen</a>');
    expect(abschnitt).toContain('zehn Karten der 26 Kantone');
  });

  it('die Wege in den Atlas und «Zum Nachlesen» sind gross genug zum Tippen (44 px)', () => {
    expect(html).toContain('.liste > li > a{ display:inline-block; padding:13px 0 }');
    // «Zum Nachlesen» steht seit D (10.11.2026 spät) auf dem hellen Blick: Zeichen 44 px, Link in der Karte 44 px hoch.
    expect(html).toMatch(/\.bildwahl-ebene label\{[^}]*min-height:44px/);
    expect(html).toMatch(/\.bildwahl-tafel a\{[^}]*min-height:44px/);
    expect(abschnitt.match(/<\/p><a href="\/kantonsatlas\/#fuer-/g)).toHaveLength(BRILLEN.length);
    // Der Link im Satz (Datenschutz) steht in einem <p> und wird nicht aufgebläht.
    expect(html).toMatch(/<p>[^<]*Keine Werbung[^<]*<a href="\/rechtliches\/">Datenschutz<\/a>/);
  });

  // Karte als eigenes Bild (Entscheid Stebler Studios 10.11.2026, Skizze A–C → C).
  it('zeigt die Prämienkarte als eigenes Bild, das erst beim Hinscrollen lädt und in den Atlas führt', () => {
    const fig = abschnitt.match(/<figure class="atlas-bild">[\s\S]*?<\/figure>/)[0];
    expect(fig).toContain('<a href="/kantonsatlas/#karte-praemie"><img src="/kantonsatlas/karte-praemie.svg"');
    expect(fig).toContain(`width="${KARTE_MASS.w}" height="${KARTE_MASS.h}"`);
    expect(fig).toContain('loading="lazy"');
    expect(fig).toMatch(/alt="Karte der 26 Kantone: [^"]+Kantonsatlas[^"]*"/);
    // Nicht in die Seite eingebettet: die Seite bleibt leicht.
    expect(html).not.toMatch(/<svg[^>]*viewBox="0 0 800 520"/);
  });

  it('das Bild trägt die Heidelbeere der Prämienkarte, hell und dunkel, und alle 26 Kantone', () => {
    const svg = karteBild('praemie');
    const { stufe } = stufen('praemie');
    expect(KARTEN_FRUCHT.praemie).toBe('heidelbeere');
    FRUCHT_STUFEN.heidelbeere.hell.forEach((c, i) => expect(svg).toContain(`.k${i + 1}{fill:${c}}`));
    const dunkel = svg.slice(svg.indexOf('@media (prefers-color-scheme:dark)'));
    FRUCHT_STUFEN.heidelbeere.dunkel.forEach((c, i) => expect(dunkel).toContain(`.k${i + 1}{fill:${c}}`));
    expect(svg.match(/<use href="#ka-[A-Z]{2}" class="k[1-4]"\/>/g)).toHaveLength(26);
    expect(svg).toContain(`<use href="#ka-ZH" class="k${stufe.ZH}"/>`);
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
  });

  it('die Bilddatei im Repo stimmt mit der Quelle überein', () => {
    const datei = readFileSync(resolve(__dirname, '../../public/kantonsatlas/karte-praemie.svg'), 'utf8');
    expect(datei).toBe(karteBild('praemie'));
  });

  it('verspricht nicht für jede Karte eine Rechnung (es gibt nicht zu jeder ein Werkzeug)', () => {
    expect(abschnitt).toContain('nicht Ihre eigene Lage');
    expect(abschnitt).not.toMatch(/rechnet Maloja/);
  });
});
