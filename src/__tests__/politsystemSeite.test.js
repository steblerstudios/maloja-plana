import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  POLITSYSTEM, GEMEINDEN, SITZE_AB_2027, SITZE_SEIT_2023, STAENDERAT, HALBE, REGELN, BUNDESRAT_PARTEIEN, zahlenPolitsystem,
} from '../../scripts/seiten/politsystem.mjs';
import { HINTERGRUND } from '../../scripts/seiten/hintergrund.mjs';
import { KRANKENKASSE } from '../../scripts/seiten/krankenkasse.mjs';
import { einsetzen } from '../../scripts/seiten-figuren.mjs';
import { BASIS } from '../../scripts/seiten-inhalt.mjs';

// ─────────────────────────────────────────────────────────────
// Hintergrundseite /politsystem/ · Entscheid Stebler Studios 04.11.2026 («Weg A»)
//
// Dieselben Riegel wie /krankenkasse/ (hintergrundSeiten.test.js), aber mit den
// Zahlen dieser Seite: Sitze, Stimmen, Fristen stehen einmal in
// scripts/seiten/politsystem.mjs und so auf der Seite. Dazu: keine bewegte
// Fassung, solange Stebler Studios das nicht freigibt.
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
const summe = (o) => Object.values(o).reduce((a, b) => a + b, 0);

const seite = POLITSYSTEM;
const html = lies('politsystem');
const text = sichtbar(html);

describe('/politsystem/', () => {
  it('steht in der Liste der Hintergrundseiten, nach Krankenkasse und Kantonsvergleich', () => {
    expect(HINTERGRUND.map((h) => h.pfad)).toEqual(['krankenkasse', 'kantone-im-vergleich', 'politsystem', 'kantonsatlas']);
  });

  it('ist noch nicht über ihr Prüfdatum hinaus', () => {
    // Wird das rot: Wahlen 2027 und Bundesratswahl gegen den Text lesen, dann
    // Sitze, Parteien, `stand` und `pruefenBis` in politsystem.mjs nachführen.
    expect(seite.pruefenBis).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const heute = new Date().toISOString().slice(0, 10);
    expect(heute <= seite.pruefenBis, `Prüfdatum ${seite.pruefenBis} überschritten`).toBe(true);
  });

  it('die Gemeindezahl ist noch nicht über ihr eigenes Prüfdatum hinaus', () => {
    // Fusionen gelten zum Jahreswechsel: Zahl im BFS-Verzeichnis neu zählen,
    // dann GEMEINDEN in politsystem.mjs nachführen.
    const heute = new Date().toISOString().slice(0, 10);
    expect(heute <= GEMEINDEN.pruefenBis, `Gemeindezahl: Prüfdatum ${GEMEINDEN.pruefenBis} überschritten`).toBe(true);
    expect(text).toContain(`Stand ${GEMEINDEN.stand}`);
  });

  it('zeigt sichtbar, welchen Stand die Angaben haben, und sagt, dass sie vereinfacht', () => {
    expect(text).toContain('Stand der Zahlen:');
    expect(text).toContain('keine Rechtsberatung');
    expect(text).toContain(seite.quellenHinweis);
    expect(text).not.toMatch(/nennt bewusst keine Beträge/);
    expect(text).not.toContain('SKOS');
  });

  it('lässt keinen Platzhalter und keinen Figur-Block stehen', () => {
    expect(html).not.toMatch(/\{\{|\}\}/);
    expect(html).not.toMatch(/<!--(FIG|TAB):/);
  });

  it('ist indexierbar, auf Deutsch, mit sich selbst als kanonischer Adresse', () => {
    expect(html).toContain('<html lang="de">');
    expect(html).toContain('<meta name="robots" content="index, follow">');
    expect(html).toContain(`<link rel="canonical" href="${BASIS}/politsystem/">`);
    expect((html.match(/<h1[\s>]/g) || []).length).toBe(1);
    expect(html).toContain('<p class="kicker">Politik erklärt</p>');
  });

  it('kommt ohne JavaScript und ohne Rahmen aus', () => {
    const skripte = [...html.matchAll(/<script([^>]*)>/g)].map((m) => m[1]);
    for (const attr of skripte) expect(attr).toContain('application/ld+json');
    expect(html).toContain("default-src 'none'");
    expect(html).not.toContain('frame-src');
    expect(html).not.toContain('<iframe');
  });

  it('zeigt die Kugelbahn nur als Standbild — keine bewegte Fassung, kein Link darauf', () => {
    expect(seite.bewegtEinbetten).toBe(false);
    expect(seite.bewegtVerlinken).toBe(false);
    expect(html).not.toContain('/bewegt/');
    expect(fs.existsSync(path.resolve(WURZEL, 'public', 'politsystem', 'bewegt'))).toBe(false);
  });

  it('gibt es nur auf Deutsch — kein hreflang, keine Übersetzung', () => {
    expect(html).not.toContain('hreflang=');
    for (const code of ['fr', 'it', 'en', 'rm']) {
      expect(fs.existsSync(path.resolve(WURZEL, 'public', code, 'politsystem', 'index.html'))).toBe(false);
    }
    expect(text).toContain('diese Seite gibt es bisher nur auf Deutsch');
  });

  it('jede Figur ist ein beschriftetes Bild ohne Fremdes, Clip-Pfade mit eigener id', () => {
    const svgs = [...html.matchAll(/<svg [^>]*>([\s\S]*?)<\/svg>/g)];
    expect(svgs.length).toBe(4);
    for (const [ganz, innen] of svgs) {
      expect(ganz).toMatch(/role="img"/);
      expect(ganz).toMatch(/aria-labelledby="[^"]+-t [^"]+-d"/);
      expect(innen).toMatch(/<title id="[^"]+">[^<]{10,}<\/title>/);
      expect(innen).toMatch(/<desc id="[^"]+">[^<]{20,}<\/desc>/);
      expect(innen).not.toMatch(/tabindex|role="button"|kb-ziel/);
    }
    // Jeder Verweis url(#…) zeigt auf eine id, die es in der Seite gibt (sonst zeichnet der Browser schwarz).
    for (const [, id] of html.matchAll(/url\(#([^)]+)\)/g)) expect(html).toContain(`id="${id}"`);
  });

  it('Bildmix: drei isometrische Bilder, eine Strichfigur, keine Uhr und keine Waage mehr', () => {
    expect((html.match(/<div class="abb-bild iso">/g) || []).length).toBe(3);
    expect((html.match(/<div class="abb-bild hl">/g) || []).length).toBe(1);
    expect(html).not.toContain('abb-uhrwerk');
    expect(html).not.toContain('abb-waage');
    for (const f of ['politsystem-uhrwerk.svg', 'politsystem-waage.svg']) {
      expect(fs.existsSync(path.resolve(WURZEL, 'scripts', 'seiten', 'figuren', f))).toBe(false);
    }
  });

  it('Bereichsfarbe Zwetschge (Behörden), nicht Heidelbeere (Versicherungen)', () => {
    expect(html).toContain('--heidel-text:#5A6472');
    expect(html).toContain('--heidel-text:#9AA4B3');
    // Die Kugel trägt ihre Kontur über diesen Selektor; ändert der Abgriff die Schreibweise, fiele sie still weg.
    expect(html).toContain('.iso svg circle[style*="--kb-gold"]{ stroke:var(--anatomy-hi)');
    expect(html).toMatch(/<circle [^>]*style="fill:var\(--kb-gold\)"/);
  });

  it('Schrittliste, Bundesrat und Ständemehr stehen als Text bzw. beschriftetes Bild da', () => {
    expect(html).toMatch(/<ol class="schritte" role="list" aria-label="[^"]+">/);
    expect((html.match(/<ol class="schritte"[\s\S]*?<\/ol>/)[0].match(/<li role="listitem">/g) || []).length).toBe(6);
    expect(html).toContain('role="img" aria-label="7 gleich grosse Sitze im Bundesrat, November 2026: SVP 2, SP 2, FDP 2, Mitte 1"');
    const kaestchen = html.match(/<div class="bundesrat"[\s\S]*?<\/div>/)[0];
    expect((kaestchen.match(/<span><\/span>/g) || []).length).toBe(REGELN.bundesrat);
    const streifen = html.match(/<div class="staende"[\s\S]*?<\/div>/)[0];
    expect((streifen.match(/class="ganz"/g) || []).length).toBe(20);
    expect((streifen.match(/class="halb"/g) || []).length).toBe(HALBE.length);
    expect(streifen).toContain('ein Ja braucht mindestens 12');
  });

  it('die Sitztabelle ist offen sichtbar, mit Balken ab null', () => {
    expect(html).not.toContain('<details class="abb-tabelle">');
    expect(html).toContain('<div class="tabelle zahlen sitze" role="region" aria-label="Sitze je Kanton" tabindex="0">');
    expect(html).toMatch(/<th scope="row">Zürich<\/th><td class="balken" aria-hidden="true"><span style="width:100%"><\/span><\/td><td class="n">36<\/td>/);
  });

  it('das Trennkomma steht nur zwischen direkt aufeinanderfolgenden Belegen', () => {
    // «sup + sup» griff über Text hinweg (Befund 05.11.2026); jetzt nur mit Klasse «folge».
    expect(html).toContain('sup.beleg.folge::before');
    expect(html).not.toMatch(/sup\.beleg \+ sup\.beleg/);
    for (const m of html.matchAll(/(.{6})<sup class="beleg folge">/g)) expect(m[1]).toBe('</sup>');
    expect(html).toMatch(/<\/sup><sup class="beleg folge">/);
    const kk = lies('krankenkasse');
    for (const m of kk.matchAll(/(.{6})<sup class="beleg folge">/g)) expect(m[1]).toBe('</sup>');
  });

  it('verlinkt nach aussen nur die eingetragenen Quellen', () => {
    const erlaubt = new Set([
      ...seite.quellen.flatMap((q) => [q.url, q.auch?.url].filter(Boolean)),
      'https://www.gnu.org/licenses/agpl-3.0.html',
      'https://github.com/steblerstudios/maloja-plana',
    ]);
    const extern = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'))
      .filter((u) => !u.startsWith(BASIS));
    for (const u of extern) expect(erlaubt, `nicht eingetragener Link: ${u}`).toContain(u);
    for (const q of seite.quellen) expect(q.url).toMatch(/^https:\/\//);
  });

  it('jeder Beleg im Text führt zu einer Quelle, und jede Quelle führt zurück', () => {
    for (const q of seite.quellen) {
      expect(html).toContain(`<li id="quelle-${q.key}">`);
      expect(html).toContain(`href="#beleg-${q.key}-1"`);
      expect(html).toContain(`id="beleg-${q.key}-1"`);
    }
  });

  it('nicht amtliche Quellen sind als solche gekennzeichnet', () => {
    const nicht = seite.quellen.filter((q) => !q.amtlich).map((q) => q.key);
    expect(nicht).toEqual(['hls', 'hlsSvp']);
    expect((html.match(/class="q-art">keine Behörde/g) || []).length).toBe(nicht.length);
  });

  it('steht einmal in der Sitemap, ohne Sprach-Alternativen', () => {
    const xml = fs.readFileSync(path.resolve(WURZEL, 'public', 'sitemap.xml'), 'utf8');
    const loc = `<loc>${BASIS}/politsystem/</loc>`;
    expect(xml.split(loc).length - 1).toBe(1);
    const eintrag = xml.slice(xml.indexOf(loc), xml.indexOf('</url>', xml.indexOf(loc)));
    expect(eintrag).not.toContain('xhtml:link');
  });

  it('ist aus «Was steht mir zu?» verlinkt — nur auf Deutsch', () => {
    expect(lies('was-steht-mir-zu')).toContain(`<a href="/politsystem/">${seite.titel}</a>`);
    for (const p of ['fr/was-steht-mir-zu', 'it/was-steht-mir-zu', 'en/was-steht-mir-zu', 'rm/was-steht-mir-zu']) {
      expect(lies(p)).not.toContain('/politsystem/');
    }
  });

  it('die Krankenkassen-Seite behält ihren Kopf (Verallgemeinerung des Baus)', () => {
    const kk = lies('krankenkasse');
    expect(kk).toContain('<p class="kicker">Krankenkasse erklärt</p>');
    expect(kk).toContain('<p>Acht Fragen</p>');
    // Seit #683 setzt die Krankenkasse ihren Kicker selbst (vorher galt der Vorgabewert des Baus).
    expect(KRANKENKASSE.kicker).toBe('Krankenkasse erklärt');
  });
});

// ─── Die Zahlen: eine Quelle, auf der Seite wie in den Daten ────────────────
describe('/politsystem/ · Zahlen', () => {
  it('Nationalrat 200, Ständerat 46, 23 Standesstimmen, Bundesrat 7', () => {
    expect(summe(SITZE_AB_2027)).toBe(REGELN.nationalrat);
    expect(summe(SITZE_SEIT_2023)).toBe(REGELN.nationalrat);
    expect(summe(STAENDERAT)).toBe(REGELN.staenderat);
    expect(26 - HALBE.length + HALBE.length / 2).toBe(REGELN.standesstimmen);
    expect(BUNDESRAT_PARTEIEN.reduce((a, [, n]) => a + n, 0)).toBe(REGELN.bundesrat);
  });

  it('die vier Änderungen von 2023 auf 2027 (Verordnungen 2021 und 2025)', () => {
    const anders = Object.keys(SITZE_AB_2027).filter((k) => SITZE_AB_2027[k] !== SITZE_SEIT_2023[k]);
    expect(anders.sort()).toEqual(['BE', 'FR', 'GR', 'LU']);
    expect(text).toContain('Für die Wahlen 2027 gewinnen Luzern und Freiburg je einen Sitz, Bern und Graubünden geben je einen ab.');
  });

  it('die Sitztabelle zeigt jeden Kanton mit seinen Sitzen', () => {
    const z = zahlenPolitsystem();
    expect(text).toContain(`Zürich wählt ${z['sitze.zh']} Mitglieder des Nationalrats, Uri ${z['sitze.ur']}.`);
    expect(text).toMatch(/Bern 24 23 −1 2/);
    expect(text).toMatch(/Luzern 9 10 \+1 2/);
    expect(text).toMatch(/Basel-Stadt 4 4 1/);
    expect(text).toMatch(/Zusammen 200 200 46/);
  });

  it('Fristen und Unterschriften stehen so auf der Seite wie in den Regeln', () => {
    expect(text).toContain("50'000 Stimmberechtigte oder acht Kantone innert 100 Tagen");
    expect(text).toContain("100'000 Stimmberechtigte können innert 18 Monaten");
    expect(text).toContain('aus je 13 Mitgliedern');
  });

  it('ein unbekannter Platzhalter bricht den Bau ab', () => {
    expect(() => einsetzen('{{gibtsnicht}}', zahlenPolitsystem())).toThrow(/Unbekannte Zahl/);
    expect(() => einsetzen('<!--FIG:gibtsnicht-->', zahlenPolitsystem(), POLITSYSTEM.bloecke)).toThrow(/Unbekannter Block/);
  });
});
