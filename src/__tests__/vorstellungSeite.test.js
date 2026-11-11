import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { vorstellungBauen, KAPITEL, BEISPIEL } from '../../scripts/seiten/vorstellung.mjs';
import { LEBENSBEREICHE } from '../data/lebensbereiche.js';
import de from '../i18n/de.js';
import { CHAPTER_KEYS } from '../config/constants.js';

// Vorstellungsseite auf malojaplana.ch/ (Plan «App nach /app/», PR 3).
// Quelle scripts/seiten/vorstellung.mjs → website/index.html → dist/index.html.

const WURZEL = fileURLToPath(new URL('../..', import.meta.url));
const html = vorstellungBauen();

describe('Vorstellungsseite: Kopf und Suchmaschinen', () => {
  it('die erzeugte Datei ist aktuell (sonst: node scripts/build-seiten.mjs)', () => {
    expect(fs.readFileSync(path.join(WURZEL, 'website/index.html'), 'utf8')).toBe(html);
  });

  it('indexierbar, canonical auf die Wurzel, JSON-LD zeigt die App unter /app/', () => {
    expect(html).toContain('<meta name="robots" content="index, follow">');
    expect(html).toContain('<link rel="canonical" href="https://malojaplana.ch/">');
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const app = ld['@graph'].find((g) => g['@type'] === 'WebApplication');
    expect(app.url).toBe('https://malojaplana.ch/app/');
  });

  it('nur eigene Skripte: /weiterleitung.js und /reise.js (Die Reise, 10.11.2026) — und die CSP erlaubt nur eigene', () => {
    const skripte = [...html.matchAll(/<script([^>]*)>/g)].map((m) => m[1]).filter((a) => !a.includes('ld+json'));
    expect(skripte).toEqual([' src="/weiterleitung.js"', ' src="/reise.js" defer']);
    expect(html).toMatch(/content="default-src 'none'; script-src 'self';/);
    // www.infomaniak.com: Quelle zu «Grün gehostet» (E, 10.11.2026 spät), ein Link, nichts Geladenes
    expect(html).not.toMatch(/https?:\/\/(?!malojaplana\.ch|www\.gnu\.org|github\.com|schema\.org|www\.infomaniak\.com\/en\/ecology")/);
  });
});

describe('Vorstellungsseite: Inhalt', () => {
  it('die sieben Kapitel heissen wie in der App, in derselben Reihenfolge', () => {
    const app = CHAPTER_KEYS.map((k) => de.chapters[k]);
    expect(KAPITEL).toHaveLength(7);
    // Name der Seite = Kurzname der App oder Anfang ihres Titels («Versicherungen & Vorsorge»).
    KAPITEL.forEach((k, i) => {
      expect(k.name === app[i].short || app[i].title.startsWith(k.name), `${k.name} ↔ ${app[i].title}`).toBe(true);
    });
    expect(html).not.toMatch(/class="name">Notfall</);
  });

  it('Kapitelfarben wie in src/data/lebensbereiche.js', () => {
    const farbe = (key) => LEBENSBEREICHE.find((b) => b.key === key);
    const keys = ['person', 'wohnen', 'finanzen', 'versicherungen', 'bildung', 'behoerden', 'gesundheit'];
    keys.forEach((key, i) => {
      const b = farbe(key);
      expect([b.light, b.lightDeep], key).toContain(KAPITEL[i].farbe);
      expect(KAPITEL[i].dunkel, key).toBe(b.dark);
    });
  });

  it('alle Beispiel-Knöpfe öffnen das Beispiel direkt', () => {
    const ziele = [...html.matchAll(/href="([^"]*beispiel[^"]*)"/g)].map((m) => m[1]);
    expect(ziele.length).toBeGreaterThanOrEqual(8);
    for (const z of ziele) expect(z.startsWith(BEISPIEL)).toBe(true);
    expect(html).not.toMatch(/href="\/#\//);
  });

  it('jedes Bild liegt in public/', () => {
    const bilder = [...html.matchAll(/<img src="([^"]+)"/g)].map((m) => m[1]);
    expect(bilder.length).toBeGreaterThanOrEqual(7);
    for (const b of new Set(bilder)) expect(fs.existsSync(path.join(WURZEL, 'public', b)), b).toBe(true);
  });

  it('jede verlinkte Erklärseite gibt es', () => {
    const seiten = [...html.matchAll(/href="\/([a-z-]+)\/"/g)].map((m) => m[1]).filter((s) => s !== 'app');
    expect(seiten.length).toBeGreaterThanOrEqual(5);
    for (const s of seiten) expect(fs.existsSync(path.join(WURZEL, 'public', s, 'index.html')), s).toBe(true);
  });

  it('wer keinen Zugangscode hat, erfährt, wie er per E-Mail kommt (Entscheid 09.11.2026)', () => {
    const fragen = html.slice(html.indexOf('Warum brauche ich einen Zugangscode?'));
    expect(fragen).toMatch(/^[\s\S]{0,400}mailto:info@malojaplana\.ch\?subject=Maloja%20Plana%3A%20Zugangscode/);
  });

  it('Warteliste ist nur ein Mail-Entwurf: kein Formular, kein Dienst (Entscheid 09.11.2026)', () => {
    const absatz = html.match(/<p class="bald" id="warteliste">[\s\S]*?<\/p>/)[0];
    const href = absatz.match(/href="([^"]+)"/)[1].replace(/&amp;/g, '&');
    const url = new URL(href);
    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe('info@malojaplana.ch');
    expect(url.searchParams.get('subject')).toBe('Maloja Plana: Warteliste');
    // Der vorbefüllte Text sagt, was mit der Adresse passiert — gleich wie der Datenschutz.
    expect(url.searchParams.get('body')).toMatch(/höchstens zweimal[\s\S]*Ende 2027[\s\S]*gelöscht[\s\S]*abmelden/);
    expect(absatz).toMatch(/Ende 2027[\s\S]*href="\/rechtliches\/"/);
    expect(html).not.toMatch(/<form|<input[^>]+type="email"/i);
    // Der Datenschutz nennt die Warteliste in allen fünf Sprachen, mit derselben Höchstfrist.
    for (const l of ['', 'fr/', 'it/', 'en/', 'rm/']) {
      const recht = fs.readFileSync(path.join(WURZEL, 'public', l, 'rechtliches/index.html'), 'utf8');
      expect(recht, l || 'de').toMatch(/2027/);
      expect(recht, l || 'de').toMatch(/Warteliste|Liste d’attente|Lista d’attesa|Waiting list|Glista da spetga/);
    }
  });

  it('ohne Sozialberatung und ohne Platzhalter, solange die Rechtstexte offen sind', () => {
    expect(html).not.toMatch(/Sozialberatung|#beratung|\[Name\]|class="platzhalter"/i);
  });
});

// Die Reise «näher an Fuji» (Entscheid A–E) und die Startseite als Ganzes (Entscheid A–F), 10.11.2026, Brand Book §7e.
describe('Vorstellungsseite: Die Reise (A–F)', () => {
  const js = fs.readFileSync(path.join(WURZEL, 'website/reise.js'), 'utf8');
  const stil = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const koerper = html.slice(html.indexOf('<body>'));

  it('A/B · Hero liegt auf der Bühne der Reise: Passbild ist Bild 0, die Kehren folgen direkt, Situationen danach', () => {
    const anfang = koerper.indexOf('class="reise-bruecke"');
    expect(anfang).toBeGreaterThan(0);
    expect(koerper.indexOf('<h1>')).toBeGreaterThan(anfang);
    expect(koerper.indexOf('id="kehre-1"')).toBeGreaterThan(koerper.indexOf('<h1>'));
    expect(koerper.indexOf('id="situationen"')).toBeGreaterThan(koerper.indexOf('id="kehre-7"'));
    expect(html).toContain('class="kehre-bild pass-bild an" src="/vorstellung/landschaft.webp"');
    expect(html).toContain('class="reise-buehne" aria-hidden="true" data-hier="-1"');
    expect(html).toContain('<a class="knopf zweit pass-weiter" href="#kehre-1">');
    expect(html).toMatch(/<h2 id="t-weg"[^>]*>[^<]+<\/h2>/);
    expect(html).toMatch(/class="unsichtbar">[^<]*KI-gemalt/);
  });

  it('Pass von oben (A1, 10.11.; seit E mit «Was Sie eingeben»): Karte nach Kehre 7, vor den Situationen, mit Quelle und fertiger SVG', () => {
    const karte = koerper.indexOf('id="vertrauen"');
    expect(karte).toBeGreaterThan(koerper.indexOf('class="reise-ausklang"'));
    expect(koerper.indexOf('id="situationen"')).toBeGreaterThan(karte);
    expect(html).toContain('src="/vorstellung/pass-karte.svg"');
    expect(html).toContain('Höhen © swisstopo · Strasse © OpenStreetMap');
    expect(html).toContain('Passhöhe 1815&nbsp;m');
    const svg = fs.readFileSync(path.join(WURZEL, 'public/vorstellung/pass-karte.svg'), 'utf8');
    expect(svg).toContain('© swisstopo');
    expect(svg).toContain('© OpenStreetMap');
    expect(svg).toContain('Passhöhe 1815 m');
    expect(svg).not.toMatch(/<script|href=/);   // reines Bild, nichts Ausführbares, nichts Nachgeladenes
  });

  it('Vier Höhenlinien-Bilder: nach Kehre 7 Blick Papier + Karte Salbei, Blick Salbei in «App holen» (O, getauscht 10.11. abends), Karte Papier trägt den Schluss (N)', () => {
    const lage = (f) => koerper.indexOf(`src="/vorstellung/${f}"`);
    expect(lage('pass-blick-papier.svg')).toBeGreaterThan(koerper.indexOf('class="reise-ausklang"'));
    expect(lage('pass-karte.svg')).toBeGreaterThan(lage('pass-blick-papier.svg'));   // D (Nachlesen) vor E (Vertrauen)
    expect(lage('pass-blick.svg')).toBeGreaterThan(koerper.indexOf('id="t-holen"'));
    expect(koerper.indexOf('class="holen"')).toBeGreaterThan(lage('pass-blick.svg'));
    expect(lage('pass-karte-papier.svg')).toBeGreaterThan(koerper.indexOf('id="t-schluss"'));
    expect(koerper.indexOf('<footer')).toBeGreaterThan(lage('pass-karte-papier.svg'));
    for (const f of ['pass-blick.svg', 'pass-blick-papier.svg', 'pass-karte-papier.svg']) {
      const svg = fs.readFileSync(path.join(WURZEL, 'public/vorstellung', f), 'utf8');
      expect(svg, f).toContain('© swisstopo');
      expect(svg, f).not.toMatch(/<script|href=/);
    }
    expect((koerper.match(/Höhen © swisstopo/g) || []).length).toBe(4);   // Nachlesen (C), Vertrauen (A), App holen (D), Schluss (B)
  });

  it('B · ohne Skript hängen alle sieben Stocknägel am Stock (ausblenden nur unter .js)', () => {
    expect((html.match(/<g class="nagel">/g) || []).length).toBe(7);
    expect(stil).toContain('.js .nagel{ opacity:0 }');
    expect(stil).not.toMatch(/(?<!\.js )\.nagel\{[^}]*opacity:0/);
  });

  it('C · Laptop und Telefon im Hero, beide mit Namen', () => {
    expect(html).toContain('<div class="laptop" role="img" aria-label="Maloja Plana auf einem Laptop, im Beispiel mit erfundenen Daten.">');
    expect(html).toContain('src="/vorstellung/app-computer.webp"');
    expect(fs.existsSync(path.join(WURZEL, 'public/vorstellung/app-computer.webp'))).toBe(true);
    expect(html).toContain('<div class="telefon" role="img" aria-label="Maloja Plana auf einem Telefon, im Beispiel mit erfundenen Daten.">');
  });

  it('C · jede Kehre hat «im Beispiel ansehen» und «Weiter»; jedes Weiter-Ziel gibt es', () => {
    const weiter = [...html.matchAll(/<a class="weiter" href="#([^"]+)"/g)].map((m) => m[1]);
    expect(weiter).toEqual(['kehre-2', 'kehre-3', 'kehre-4', 'kehre-5', 'kehre-6', 'kehre-7', 'holen']);
    for (const ziel of weiter) expect(html).toContain(`id="${ziel}"`);
    KAPITEL.forEach((k, i) => expect(html).toContain(`<a class="beispiel" href="${BEISPIEL}#/chapter/${i}">${k.name} im Beispiel ansehen</a>`));
  });

  it('D · gross steht das Kapitel-Zeichen (nur Bild, aria-hidden), «Kehre n von 7» steht als Text; keine grosse Zahl mehr', () => {
    expect((html.match(/<div class="reise-gross" aria-hidden="true"><svg /g) || []).length).toBe(7);
    expect(html).not.toContain('class="reise-zahl"');
    KAPITEL.forEach((k, i) => expect(html).toContain(`Kehre ${i + 1} von 7 · ${k.name}`));
  });

  it('B/D · jeder Stocknagel ist ein Aufkleber mit dem Kapitel-Zeichen, flach im Passbild-Stil (10.11.: rund, gerade, ohne Schatten und Wölbung)', () => {
    const naegel = html.split('<g class="nagel">').slice(1).map((t) => t.split('<g class="nagel-dreh"')[0].split('</svg>\n')[0]);
    expect(naegel).toHaveLength(7);
    for (const n of naegel) {
      expect(n).toMatch(/^<g transform="rotate\(0 60 \d+\)">/);
      expect(n).toMatch(/<g class="bild" style="color:var\(--k\d\)"><svg x="42"/);
      expect(n).toMatch(/<g class="schild"[^>]*><circle /);
      expect(n).not.toContain('woelbung');
      expect(n).not.toContain('unterschatten');
      expect(n).not.toContain('<text x="60"');
    }
  });

  it('jede Masken-Id der Kapitel-Zeichen kommt auf der Seite nur einmal vor', () => {
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it('D · der Stock dreht sich (Nägel rundum), er zoomt nicht', () => {
    expect(js).toContain('var SCHRITT = 2 * Math.PI / naegel.length');
    expect(js).toMatch(/if \(ruhig\.matches\) \{ winkel = /);
    expect(stil).not.toMatch(/reise-stock\{[^}]*scale\(/);
    expect(js).not.toContain('--nah');
  });

  it('E · Bild 0 lädt sofort, die Kehren-Bilder erst über das Skript (data-src)', () => {
    for (let n = 1; n <= 7; n++) {
      expect(html).toContain(`data-src="/vorstellung/kehre-${n}.webp"`);
      expect(html).not.toContain(` src="/vorstellung/kehre-${n}.webp"`);
    }
    expect(js).toContain("getAttribute('data-src')");
  });

  it('weniger Bewegung: Pinselstrich, Nagel und Wolken bewegen sich nur bei no-preference', () => {
    const bewegt = stil.match(/@media \(prefers-reduced-motion: no-preference\)\{([\s\S]*?)\n {4}\}\n/)[1];
    for (const teil of ['mask-position .9s', 'animation:anschlagen', 'animation:ziehen']) expect(bewegt).toContain(teil);
    expect(stil).toMatch(/@media \(prefers-reduced-motion: reduce\)\{[\s\S]*?\.reise-wolken\{ display:none \}/);
    expect(js).toContain("matchMedia('(prefers-reduced-motion: reduce)')");
  });
});

// F · Brand Book auf der Startseite (Knöpfe Fassung 9, Logo §4, Links §2, Icons §5), 10.11.2026.
describe('Vorstellungsseite: Brand Book', () => {
  const stil = html.match(/<style>([\s\S]*?)<\/style>/)[1];

  it('genau ein Hauptknopf auf der Seite', () => {
    expect((html.match(/class="knopf haupt"/g) || []).length).toBe(1);
  });

  it('Knöpfe und Auswahl mit 10 px Ecke, keine Pillen an Textknöpfen', () => {
    expect(stil).toContain('--radius-knopf:10px');
    expect(stil).toMatch(/\.knopf\{[^}]*border-radius:var\(--radius-knopf\)/);
    expect(stil).toMatch(/\.reise-knoepfe a\{[^}]*border-radius:var\(--radius-knopf\)/);
    expect(stil).toMatch(/\.lagen \.chips label\{[^}]*border-radius:var\(--radius-knopf\)/);
    expect(stil).not.toContain('border-radius:999px');
  });

  it('Farben aus dem Brand Book: Sand #C4A06A, Schrift darauf #2A2620, Links sandDeep und unterstrichen', () => {
    expect(stil).toContain('--sand:#C4A06A; --auf-sand:#2A2620; --sand-tief:#7A5F30;');
    expect(stil).toMatch(/\n {4}a\{ color:var\(--sand-tief\); text-decoration:underline;/);
  });

  it('Bildmarke auf heller Fläche einfarbig (Anthrazit)', () => {
    const marke = html.match(/<a class="marke"[\s\S]*?<\/a>/)[0];
    expect(marke).not.toMatch(/#7E9F8C|#8FB0A0|#C4A870/);
    expect(stil).toMatch(/\.marke\{[^}]*color:#22211F/);
  });

  it('Kapitel-Zeichen sind die der App (erzeugt aus IconAbzeichen.jsx, nicht nachgezeichnet)', async () => {
    const { KAPITEL_ZEICHEN } = await import('../../scripts/seiten/kapitel-zeichen.mjs');
    const React = (await import('react')).default;
    const { renderToStaticMarkup } = await import('react-dom/server');
    const { FamilienZeichen } = await import('../IconAbzeichen.jsx');
    const { LEITFORM_KAPITEL } = await import('../config/seitenZeichen.js');
    const app = CHAPTER_KEYS.map((k) => renderToStaticMarkup(React.createElement(FamilienZeichen, { leitform: LEITFORM_KAPITEL[k], formFarbe: 'currentColor' })));
    // Die Masken-Ids zählen je Lauf hoch; verglichen wird die Zeichnung ohne Ids.
    const ohneIds = (t) => t.replace(/(id="|url\(#)[a-zA-Z0-9-]+/g, '$1#');
    expect(KAPITEL_ZEICHEN.map(ohneIds)).toEqual(app.map(ohneIds));
    KAPITEL_ZEICHEN.forEach((z) => expect(ohneIds(html)).toContain(ohneIds(z).replace('<svg ', '')));
  });
});

// Kopf, Leiste und Fuss nach der Durchsicht der eigenen Projekte (Skizze A–E, Stebler Studios «Alle», 10.11.2026).
describe('Vorstellungsseite: Kopf, Leiste, Fuss', () => {
  const js = fs.readFileSync(path.join(WURZEL, 'website/reise.js'), 'utf8');
  const stil = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const handy = stil.slice(stil.indexOf('@media (max-width:760px)'));

  it('«Zum Inhalt springen» ist der erste Link und zeigt auf main', () => {
    expect(html.slice(html.indexOf('<body>')).match(/<a [^>]*>/)[0]).toBe('<a class="sprung" href="#inhalt">');
    expect(html).toContain('<main id="inhalt" tabindex="-1">');
  });

  it('a11y-Prüfung 10.11.: Navs eindeutig benannt, Leiste bei kurzem Bildschirm weg, keine unsichtbare Checkbox bei weniger Bewegung', () => {
    expect(html).toContain('<nav aria-label="Hauptmenü">');
    expect(html).toContain('aria-label="Abschnitte dieser Seite"');
    const kurz = stil.slice(stil.indexOf('@media (max-height:520px)'));
    expect(kurz.slice(0, kurz.indexOf('\n    }'))).toContain('.leiste{ display:none }');
    expect(stil).toContain('.schalter, #anhalten{ display:none }');
  });

  it('Predeploy 10.11.: «Bildfolge anhalten» trifft das Telefon in .geraete-bild (Pause-Möglichkeit)', () => {
    const sel = stil.match(/#anhalten:checked ~ ([^,{]+) \.folge img/)[1].trim();
    expect(html).toMatch(new RegExp(`<input type="checkbox" id="anhalten"[^>]*>\\s*<div class="${sel.replace('.', '')}"`));
  });

  // Design-Durchgang 10.11.2026 (Stebler Studios «Ja, alle so», Befunde A–M), Brand Book §7e.
  it('A · eine Seitenfarbe: die Creme des Passbilds, auch Ausklang und Hero-Schleier; kein Granit-Grau mehr', () => {
    const wurzel = stil.match(/:root\{([\s\S]*?)\n {4}\}/)[1];
    expect(wurzel).toContain('--bg:#FCF0E4;');
    expect(wurzel).toContain('--himmel:#FCF0E4;');
    expect(wurzel).toContain('--schleier:252,240,228;');
    const regeln = stil.replace(/\/\*[\s\S]*?\*\//g, '');   // Kommentare nennen die alten Töne als Historie
    expect(regeln).not.toMatch(/rgba\(244,240,230/);
    expect(regeln).not.toMatch(/#F2F2F0/i);
    expect(stil).toMatch(/\.leiste\{[^}]*background:#FFF8F0/);
  });

  it('A · im dunklen Modus bleibt der Hero hell: seine Nebenknöpfe tragen festes Papier, keine Variable', () => {
    expect(stil).toContain('.pass .knopf.zweit{ background:#FFF8F0 }');
  });

  it('B · nach der letzten Kehre gehen Stock, Weglinie und dunkle Schicht mit dem Bild weg', () => {
    expect(js).toContain("buehne.setAttribute('data-ende', '')");
    for (const teil of ['.reise-stock', '.reise-linie', '.reise-quelle']) expect(stil).toContain(`.js .reise-buehne[data-ende] ${teil}`);
    expect(stil).toContain('.js .reise-buehne[data-ende]::after{ opacity:0 }');
  });

  it('C · der Stock ist 86 % hoch und mittig, nicht bildhoch', () => {
    expect(stil).toMatch(/\.reise-stock\{ position:absolute; left:50%; top:7%; height:86%;/);
    expect(stil).toContain('margin-left:calc(86svh * -120 / 700 / 2)');
  });

  it('D/E · am Handy lässt die Textfläche den Stock frei, «KI-gemalt» steht links unten', () => {
    expect(handy).toContain('.reise-station{ align-items:center; padding:10vh 84px 10vh 16px }');
    expect(handy).toMatch(/\.reise-stock\{ left:auto; right:-30px;/);
    expect(stil).toMatch(/\.reise-quelle\{ position:absolute; left:12px;/);
  });

  it('F/G · die Karte von oben steht auf Inhaltsbreite, vor der Papier-Karte keine doppelte Luft', () => {
    // seit D/E steht die Karte von oben in E im Inhaltsrahmen (.rahmen, höchstens 1040 px)
    expect(html).toMatch(/<section id="vertrauen" class="bildwahl bildwahl-salbei"[^>]*>\s*<fieldset class="rahmen">/);
    expect(stil).toContain('.pass-band-karte{ margin:0 }');
  });

  it('H/I · Reiter «Kantone» in Kopf und Leiste; am Handy rückt der gewählte Reiter in Sicht', () => {
    expect(html.match(/<a href="#atlas">Kantone<\/a>/g)).toHaveLength(2);
    expect(js).toContain('function inSicht(a)');
    expect(js).toContain('if (aktuell) inSicht(aktuell)');
  });

  it('J · der Trennpunkt hängt am vorderen Wort (Hero und Fuss), keine Zeile beginnt mit «·»', () => {
    expect(stil).toContain('.pass .fakten span:not(:last-child)::after{');
    expect(stil).toContain('.fuss .vertrauen span:not(:last-child)::after{');
    expect(stil).not.toMatch(/(fakten|vertrauen) span::before/);
  });

  it('K · unter 960 px steht der Hero in einer Spalte', () => {
    const tablet = stil.slice(stil.indexOf('@media (max-width:960px)'));
    expect(tablet.slice(0, tablet.indexOf('\n    }'))).toContain('.pass{ grid-template-columns:1fr;');
  });

  // Zweite Runde (Stebler Studios «Ja, N bis P so», 10.11.2026)
  it('N · Schluss auf der Karte: «Beispiel ansehen» am Fuss der Kehren, «App holen» an der Passhöhe, deckend', () => {
    const schluss = html.slice(html.indexOf('<section class="schluss-karte"'), html.indexOf('</section>', html.indexOf('<section class="schluss-karte"')));
    expect(schluss).toMatch(/style="--x:43\.6%; --y:76\.5%; --xh:39\.7%; --xp:27%" href="[^"]*">Beispiel ansehen/);
    expect(schluss).toMatch(/style="--x:57\.8%; --y:26\.6%; --xh:62\.6%; --xp:78%" href="#holen">App holen/);
    expect(stil).toMatch(/\.knopf\.am-punkt\{[^}]*background:var\(--flaeche\)/);
    expect(schluss).not.toContain('knopf haupt');   // ein Hauptknopf je Seite, und der steht im Hero
    // Der Text steht auf allen Breiten auf den Linien (Stebler Studios 10.11. abends): nie aus dem Raster gelöst
    expect(stil).not.toMatch(/\.schluss-bild > \*\{ grid-area:auto \}/);
    expect(handy).toContain('.schluss-punkt, .knopf.am-punkt{ left:var(--xp) }');
    expect(handy).toContain('.schluss-bild img{ aspect-ratio:3/5;');
    expect(schluss).toMatch(/class="knopf zweit am-punkt oben" style="[^"]*--xp:78%"/);
    // Passhöhe in der Karte (viewBox 1 1 278 128) liegt bei 161,6 | 35,1 → 57,8 % | 26,6 %
    const karte = fs.readFileSync(path.join(WURZEL, 'public/vorstellung/pass-karte-papier.svg'), 'utf8');
    expect(karte).toContain('<circle cx="161.6" cy="35.1"');
  });

  it('O · App holen: drei Geräte als Auswahl auf dem Blick, nur die gewählte Anleitung sichtbar, ohne Skript', () => {
    const holen = html.slice(html.indexOf('<section id="holen"'), html.indexOf('</section>', html.indexOf('<section id="holen"')));
    expect(holen.match(/<input type="radio" name="geraet"/g)).toHaveLength(3);
    expect(holen).toContain('<input type="radio" name="geraet" id="g1" class="unsichtbar" checked>');
    for (const n of ['iPhone und iPad', 'Android', 'Computer']) expect(holen).toMatch(new RegExp(`<label for="g\\d"[^>]*><svg[^>]*>.*?</svg>${n}</label>`));
    expect(stil).toContain('.holen .geraet{ display:none }');
    for (const i of [1, 2, 3]) expect(stil).toContain(`#g${i}:checked ~ .holen .t${i}{ display:block }`);
    expect(holen).not.toMatch(/apple|android-logo/i);
  });

  it('O · der Kopf von «App holen» liegt auf dem Salbei-Blick, das Bild läuft oben aus; am Handy steht er darüber', () => {
    const fig = html.slice(html.indexOf('<figure class="holen-blick">'), html.indexOf('</figure>', html.indexOf('<figure class="holen-blick">')));
    expect(fig.indexOf('<h2 id="t-holen">')).toBeGreaterThan(-1);
    expect(fig.indexOf('class="holen-kopf"')).toBeLessThan(fig.indexOf('class="holen-flaeche"'));
    expect(stil).toContain('.holen-blick > .holen-kopf, .holen-blick > .holen-flaeche{ grid-area:1 / 1 }');
    expect(stil).toMatch(/\.holen-blick img\{[^}]*mask-image:linear-gradient\(180deg, transparent 0%/);
    expect(handy).toContain('.holen-blick > .holen-kopf, .holen-blick > .holen-flaeche{ grid-area:auto }');
  });

  // D (Stebler Studios 10.11.2026 spät, «ja D und E»): «Zum Nachlesen» steht auf dem hellen Blick nach Kehre 7.
  it('D · Zum Nachlesen im hellen Blick: Kopf auf dem Bild, je Thema (Kapitel) eine Wahl auf der Strasse, Tippen öffnet im Bild die Berichte des Themas', () => {
    const koerper = html.slice(html.indexOf('<body>'));
    const d = html.match(/<section id="nachlesen"[\s\S]*?<\/section>/)[0];
    expect(koerper.indexOf('id="nachlesen"')).toBeGreaterThan(koerper.indexOf('class="reise-ausklang"'));
    expect(d).toMatch(/<figure class="bildwahl-blick">\s*<div class="bildwahl-kopf">[\s\S]*?<h2 id="t-nachlesen">Zum Nachlesen\.<\/h2>[\s\S]*?<\/div>\s*<div class="bildwahl-flaeche">\s*<img src="\/vorstellung\/pass-blick-papier\.svg"/);
    // Themen = Kapitel der App, Einordnung wie werkzeugRegister.js; jede Erklärseite der Website genau einmal
    const themen = [[5, ['/was-steht-mir-zu/', '/politsystem/', '/kantone-im-vergleich/']], [3, ['/praemienverbilligung/', '/krankenkasse/']], [2, ['/steuern/', '/sozialhilfe/']]];
    themen.forEach(([k, ziele], n) => {
      expect(d).toMatch(new RegExp(`<label for="n${n + 1}" style="--x:[\\d.]+%; --y:[\\d.]+%; --farbe:var\\(--k${k}\\)"><span class="zeichen" aria-hidden="true"><svg`));
      const pop = d.match(new RegExp(`<div class="bildwahl-pop t${n + 1}"[\\s\\S]*?<\\/ul><\\/div>`))[0];
      for (const ziel of ziele) expect(pop, ziel).toContain(`<a href="${ziel}">`);
      expect((pop.match(/<li>/g) || []).length).toBe(ziele.length);
    });
    expect((d.match(/<input type="radio" name="nachlesen"/g) || []).length).toBe(3);
    expect(stil).toContain('#n2:checked ~ .bildwahl-blick .bildwahl-pop.t2{ display:block }');
    expect(stil).toMatch(/\.bildwahl-pop a\{[^}]*min-height:44px/);
    expect(html).not.toContain('<h2>Zum Nachlesen</h2>');
    const fragen = html.slice(html.indexOf('<div class="fragen">'), html.indexOf('</section>', html.indexOf('<div class="fragen">')));
    expect(fragen).not.toContain('zeichen');
  });

  it('E · «Was Sie eingeben, bleibt bei Ihnen» auf der Salbei-Karte wie «App holen»: Kopf auf dem Auslauf, fünf Versprechen als Wahl, Grün gehostet mit Quelle', () => {
    const koerper = html.slice(html.indexOf('<body>'));
    const e = html.match(/<section id="vertrauen"[\s\S]*?<\/section>/)[0];
    expect(koerper.indexOf('id="vertrauen"')).toBeGreaterThan(koerper.indexOf('id="nachlesen"'));
    expect(koerper.indexOf('id="situationen"')).toBeGreaterThan(koerper.indexOf('id="vertrauen"'));
    expect(e).toMatch(/<div class="bildwahl-kopf">[\s\S]*?<h2 id="t-vertrauen">Was Sie eingeben, bleibt bei Ihnen\.<\/h2>[\s\S]*?<\/div>\s*<div class="bildwahl-flaeche">\s*<img src="\/vorstellung\/pass-karte\.svg"/);
    expect((e.match(/<input type="radio" name="versprechen"/g) || []).length).toBe(5);
    expect((e.match(/<label for="v\d"/g) || []).length).toBe(5);
    expect(e).toMatch(/<h3>Grün gehostet<\/h3><p>[^<]*nach <a href="https:\/\/www\.infomaniak\.com\/en\/ecology">Angaben des Anbieters<\/a>/);
    // Zeichen typisch, ohne Strich (Stebler Studios 11.11.2026): je Versprechen eines, nie ein Verbots-Strich (kein roter Strich)
    expect((e.match(/<label for="v\d"[^>]*><span class="zeichen"><svg viewBox="0 0 24 24"/g) || []).length).toBe(5);
    expect(e).not.toMatch(/#A32D2D|#B87070|roseDeep/);
    // Schrift auf Salbei nur auf Papier: die Fläche läuft oben aus, der Kopf beginnt 96 px darüber
    expect(stil).toMatch(/\.bildwahl-salbei \.bildwahl-flaeche\{ margin-top:96px; aspect-ratio:280\/130; background:#7E8F7B;/);
    // der Text des gewählten Versprechens steht im Bild (in der Ebene), rechts auf der freien Seite der Karte
    expect(e).toMatch(/<div class="bildwahl-ebene">[\s\S]*<div class="bildwahl-tafeln">[\s\S]*<\/div>\s*<\/div>\s*<figcaption/);
    expect(stil).toMatch(/\.bildwahl-salbei \.bildwahl-tafeln\{ position:absolute; right:2%;/);
    expect((html.match(/id="t-vertrauen"/g) || []).length).toBe(1);
  });

  it('P · die Schicht neben dem Stock trägt die Kapitelfarbe, unter dem Text mindestens 74 %', () => {
    expect(stil).toContain("@property --ton{ syntax:'<color>'; inherits:true; initial-value:#121210 }");
    for (let i = 0; i < 7; i++) expect(stil).toContain(`.reise-buehne[data-hier="${i}"]{ --ton:color-mix(in oklab, var(--k${i}) 30%, #121210) }`);
    expect(stil).toContain('color-mix(in oklab, var(--ton) 74%, transparent) 46%');
    expect(handy).toContain('background:color-mix(in oklab, color-mix(in oklab, var(--farbe) 30%, #121210) 82%, transparent)');
  });

  // Das Brand Book wird im selben Zweig nachgeführt (10.11.: ein Skript brach ab, die Zeilen N–P fehlten unbemerkt).
  it('Brand Book §7e beschreibt Seitenfarbe, App holen (O), Schluss (N) und die Schicht in der Kapitelfarbe (P)', () => {
    const buch = fs.readFileSync(path.join(WURZEL, 'docs/brand/brand-guidelines.md'), 'utf8');
    const e = buch.slice(buch.indexOf('### 7e.'), buch.indexOf('## 8.'));
    for (const zeile of ['| **Seitenfarbe** |', '| **App holen (O)** |', '| **Schluss (N)** |', '| **Telefon an der Kehre (A)**', '| **Situationen mit Telefon (C/D)**', '| **Ausweg (B)**', '| **Einblenden nach der Reise (D)**', '| **Zwei Höhenbilder mit Aufgabe (D/E)**']) expect(e).toContain(zeile);
    expect(e).toContain('**in der Farbe der Kehre**');
    expect(e).toContain('`#FCF0E4`');
  });

  // «Ein Blick hinein» vereint mit Reise und Situationen (Stebler Studios 10.11.2026: «A, dazu C und D»).
  it('A · Kehre 7 trägt das Telefon mit dem Gesundheits-Bildschirm, in der linken Bildhälfte; am Handy über der Karte', () => {
    const kehre = (n) => html.match(new RegExp(`<li class="reise-station[^"]*" id="kehre-${n}"[\\s\\S]*?</li>`))[0];
    expect(kehre(7)).toMatch(/^<li class="reise-station mit-telefon"/);
    expect(kehre(7)).toMatch(/<div class="reise-telefon"><div class="telefon" role="img" aria-label="Kapitel Gesundheit im Beispiel, mit erfundenen Daten">[\s\S]*?<img src="\/vorstellung\/app-5\.webp"/);
    expect(kehre(7).indexOf('class="reise-telefon"')).toBeLessThan(kehre(7).indexOf('class="reise-text"'));
    for (const n of [1, 2, 3, 4, 5, 6]) expect(kehre(n), `Kehre ${n}`).not.toContain('reise-telefon');
    // Vorbilder 10.11.2026 (A2/A3): ab 1100 px gross und unten angeschnitten, darunter nur der Ausschnitt in der Textfläche
    expect(stil).toMatch(/\.reise-telefon\{ --breite:clamp\(260px, 28vw, 380px\); position:absolute; left:27%; bottom:0;[^}]*overflow:hidden \}/);
    expect(stil).toMatch(/@media \(max-width:1099px\)\{\s*\.reise-telefon\{ display:none \}\s*\.reise-ausschnitt\{ display:block \}/);
    expect(kehre(7)).toMatch(/<div class="reise-text">\s*<div class="reise-ausschnitt" role="img" aria-label="Ausschnitt aus dem Kapitel Gesundheit im Beispiel, mit erfundenen Daten"><img src="\/vorstellung\/app-5\.webp"/);
    expect(stil).toMatch(/\.reise-ausschnitt img\{[^}]*width:360px/);
    expect(stil).not.toMatch(/\.reise-telefon \.telefon\{ width:96px/);
  });

  it('C/D · «Was steht mir zu?» steht neben der Auswahl der Situationen, mit dem Satz zum Gerät; «Ein Blick hinein» ist weg', () => {
    const lagen = html.match(/<section id="situationen"[\s\S]*?<\/section>/)[0];
    expect(lagen).toMatch(/<div class="lagen-raster">\s*<fieldset>[\s\S]*<\/fieldset>\s*<figure class="lagen-telefon">/);
    expect(lagen).toMatch(/aria-label="Ansicht «Was steht mir zu\?» im Beispiel, mit erfundenen Daten"[\s\S]*?<img src="\/vorstellung\/app-3\.webp"/);
    expect(lagen).toContain('<figcaption>Was Sie wählen, bleibt auf Ihrem Gerät und dient nur dazu, Ihnen Passendes zu zeigen — kein Profil, keine Bewertung.</figcaption>');
    expect(html).not.toContain('t-blick');
    expect(html).not.toContain('<p class="augenbraue">Ein Blick hinein</p>');   // im Stil-Kommentar steht der Name als Historie
    expect(stil).not.toMatch(/\.blick[\s.{-]/);
    expect(html.match(/app-5\.webp/g)).toHaveLength(3);   // Bildfolge im Hero + Kehre 7 (Telefon und Ausschnitt)
  });

  it('Browserleiste hell nach der Seitenfarbe, dunkel nach Granit', () => {
    expect(html).toContain('<meta name="theme-color" content="#FCF0E4" media="(prefers-color-scheme: light)">');
    expect(html).toContain('<meta name="theme-color" content="#22211F" media="(prefers-color-scheme: dark)">');
  });

  it('A · am Handy verschwindet die Navigation nicht, sie wird eine wischbare Zeile mit 44 px', () => {
    expect(handy).not.toMatch(/\.kopf nav\{ display:none \}/);
    expect(handy).toMatch(/\.kopf nav, \.leiste-links\{[^}]*overflow-x:auto/);
    expect(handy).toMatch(/\.kopf nav a, \.leiste-links a\{[^}]*min-height:44px/);
  });

  it('C · die Leiste erscheint erst nach der Reise (während der Reise zeigt die Weglinie den Ort) und ohne Skript nie', () => {
    expect(html).toContain('<nav class="leiste" aria-label="Abschnitte dieser Seite" data-zustand="aus">');
    expect(stil).toMatch(/\.leiste\{[^}]*visibility:hidden/);
    expect(js).toContain("var zustand = (ausklang || bruecke).getBoundingClientRect().bottom <= h * 0.5 ? 'seite' : 'aus';");
    expect(js).not.toContain("'reise'");
    expect(html).not.toContain('class="leiste-ort"');
    expect(js).toContain("setAttribute('aria-current', 'location')");
  });

  it('C · auf der Weglinie sitzt an jedem Halt das Kapitel-Zeichen', () => {
    const halte = html.match(/<g class="halt" /g) || [];
    expect(halte).toHaveLength(7);
    expect(html).toMatch(/<g class="halt" data-kehre="1" data-x="[\d.]+" data-y="[\d.]+" transform="translate\([\d.]+ [\d.]+\)" style="color:var\(--k0\); --n:0"><circle class="treffer" r="22"\/><circle class="schein" r="19"\/><circle r="12"\/><svg x="-8.5"/);
  });

  // Vorbilder 10.11.2026 (Stebler Studios «A, B, C, D so»), stebler-studios/analysen/maloja-startseite-vorbilder-2026-11-10.md
  it('B · Ausweg: jeder Halt führt zu seiner Kehre (nicht fokussierbar), «Reise überspringen» klebt während der Reise', () => {
    for (let n = 1; n <= 7; n++) expect(html).toContain(`<a class="halt-ziel" href="#kehre-${n}" tabindex="-1"><g class="halt" data-kehre="${n}"`);
    const weg = html.match(/<section id="weg"[\s\S]*?<ol class="reise-stationen"/)[0];
    expect(weg).toContain('<a class="reise-ueberspringen" href="#situationen">Reise überspringen</a>');
    expect(html).toContain('id="situationen"');
    expect(stil).toMatch(/\.reise-ueberspringen\{ position:sticky;[^}]*min-height:44px/);
    expect(stil).toContain('.js .reise-ablauf{ pointer-events:none }');
    expect(stil).toContain('.js .reise-anfang, .js .reise-ablauf .reise-text, .js .reise-ablauf .reise-telefon, .reise-ueberspringen{ pointer-events:auto }');
  });

  it('C · in der Reise keine Papier-Knöpfe: Link und leises «Weiter», weiss und unterstrichen, 44 px', () => {
    const regel = stil.match(/\.reise-knoepfe a\{[^}]*\}/)[0];
    expect(regel).toContain('color:#FBFBFA');
    expect(regel).toContain('text-decoration:underline');
    expect(regel).toContain('min-height:44px');
    expect(regel).not.toMatch(/background|border:/);
    const reise = html.match(/<ol class="reise-stationen"[\s\S]*?<\/ol>/)[0];
    expect(reise).not.toContain('class="knopf');
  });

  it('D · Abschnitte nach der Reise kommen an den Scroll gebunden herein, nur mit Unterstützung und ohne «weniger Bewegung»', () => {
    expect(stil).toMatch(/@supports \(\(animation-timeline: view\(\)\) and \(animation-range: 0% 100%\)\)\{\s*@media \(prefers-reduced-motion: no-preference\)\{\s*:is\(main, \.rahmen\) > section :is\(\.augenbraue, h2, h2 \+ \.unterzeile\)\{[^\n]*\n\s*animation:leise-ein linear both; animation-timeline:view\(\); animation-range:entry 0% cover 25% \}/);
    expect(stil).toMatch(/@keyframes leise-ein\{ from\{ opacity:0; transform:translateY\(16px\) \} to\{ opacity:1; transform:none \} \}/);
  });

  it('Oklab: die getönte Schicht mischt in Oklab; die Salbei-Karte läuft per Maske aus (keine Farbmischung, keine graue Mitte)', () => {
    expect(stil).toContain('color-mix(in oklab, var(--ton) 74%, transparent) 46%');
    expect(stil).not.toContain('.pass-karte-anfang{');
    expect(stil).toMatch(/\.bildwahl-salbei \.bildwahl-flaeche\{[^}]*mask-image:linear-gradient\(180deg, transparent 0%/);
  });

  it('B · Kamera: das Bild wandert beim Drehen seitlich mit, kein Milchglas auf der Seite', () => {
    expect(stil).toContain('translateX(calc(var(--kamera, 0) * -6%))');
    expect(js).toContain("buehne.style.setProperty('--kamera'");
    expect(stil).not.toContain('backdrop-filter');
  });

  it('D/E · Fuss: Marke, Entdecken, Rechtliches, darunter die Vertrauenszeile; alle Links der Seite bleiben erreichbar', () => {
    const fuss = html.slice(html.indexOf('<footer class="fuss">'), html.indexOf('</footer>'));
    for (const t of ['Entdecken', 'Rechtliches', 'Ohne Konto', 'Ihre Angaben bleiben auf dem Gerät', 'keine Rechts- oder Finanzberatung']) expect(fuss).toContain(t);
    for (const ziel of ['/rechtliches/', 'https://github.com/steblerstudios/maloja-plana', '/krankenkasse/', BEISPIEL, 'Problem%20melden']) expect(fuss).toContain(ziel);
    expect(fuss).toMatch(/Englisch, Französisch, Italienisch und Rätoromanisch/);
  });

  it('die Sprachen im Fuss sind die der App (SUPPORTED in src/i18n/index.js)', () => {
    const i18n = fs.readFileSync(path.join(WURZEL, 'src/i18n/index.js'), 'utf8');
    expect(i18n).toMatch(/const SUPPORTED = \['en', 'de', 'fr', 'it', 'rm'\];/);
  });
});

// Schrift nach Brand Book §3 (Titel Hanken Grotesk, Skala aus tokens.js), nach polygrafin-Prüfung 10.11.2026.
describe('Vorstellungsseite: Schrift', () => {
  const stil = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  it('Titel in Hanken Grotesk, lokal geladen (600/700), Text in Lexend', () => {
    expect(stil).toContain("font-family:'Hanken Grotesk'; src:url('/fonts/hanken-grotesk-latin-700-normal.woff2')");
    expect(stil).toMatch(/h1, h2, h3\{ font-family:'Hanken Grotesk','Lexend'/);
    expect(fs.existsSync(path.join(WURZEL, 'public/fonts/hanken-grotesk-latin-700-normal.woff2'))).toBe(true);
  });
  it('Schriftgrössen nur aus der Skala (13 · 15 · 16 · 19 · 23 · 28 · 36), ausser h1 48 und den Zeichen im SVG', () => {
    const erlaubt = new Set([13, 15, 16, 19, 23, 28, 36, 48, 32, 38]); // 32/38: h1 am Handy/Tablet
    const groessen = [...stil.matchAll(/font-size:(\d+)px/g)].map((m) => Number(m[1]));
    expect(groessen.filter((g) => !erlaubt.has(g))).toEqual([]);
  });
  it('keine Versalien-Etiketten mehr', () => {
    expect(stil).not.toContain('text-transform:uppercase');
  });
});

// Motion 11.11.2026 (Stebler Studios «Alle vier, A–D»), stebler-studios/analysen/maloja-startseite-motion-2026-11-11.md.
// Vorbild Fuji nur im Prinzip; Zeiten aus §7a E, nur transform und opacity, «weniger Bewegung» = Endzustand.
describe('Vorstellungsseite: Motion (A–D, Hero)', () => {
  const js = fs.readFileSync(path.join(WURZEL, 'website/reise.js'), 'utf8');
  const stil = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const bewegt = stil.match(/@media \(prefers-reduced-motion: no-preference\)\{([\s\S]*?)\n {4}\}\n/)[1];
  const ruhig = stil.match(/@media \(prefers-reduced-motion: reduce\)\{\n {6}\.reise-bild img[\s\S]*?\n {4}\}/)[0];
  const ohneBewegt = stil.replace(bewegt, '');

  it('Zeiten der Bewegung nur aus §7a E (150 · 250 · 400 · 600 · Bühne 900); einzige Schleifen Wolken und Teilchen', () => {
    const erlaubt = new Set(['.15s', '.25s', '.4s', '.6s', '.9s']);
    const zeilen = bewegt.split('\n').filter((z) => /(animation|transition)(-duration)?:/.test(z));
    for (const z of zeilen) {
      for (const [, wert] of z.matchAll(/(?:animation|transition)(?:-duration)?:([^;}]*)/g)) {
        const dauer = wert.match(/(?<![\d.])\d*\.?\d+m?s\b/);
        if (!dauer || /ziehen 80s|var\(--t\)/.test(wert)) continue;
        expect(erlaubt, `Zeit ${dauer[0]} in «${z.trim()}»`).toContain(dauer[0]);
      }
    }
    for (const kf of ['rieseln', 'aufscheinen', 'schweben', 'auftritt']) {
      const k = bewegt.match(new RegExp(`@keyframes ${kf}\\{([^\\n]*)`))[1];
      expect(k, kf).not.toMatch(/scale\(|width|height|top:|left:/);
    }
  });

  it('A · Stardust: jeder Aufkleber trägt einen Lichtring und sechs Sandkörner, bewegt nur ohne «weniger Bewegung»', () => {
    const naegel = html.split('<g class="nagel">').slice(1);
    expect(naegel).toHaveLength(7);
    for (const n of naegel) {
      expect(n).toMatch(/<circle class="schein" cx="60" cy="\d+" r="35"\/>/);
      expect((n.split('<g class="staub">')[1].split('</g>')[0].match(/<circle /g) || [])).toHaveLength(6);
    }
    expect(bewegt).toContain('.js .nagel.dran .staub circle{ animation:rieseln');
    expect(bewegt).toContain('.js .nagel.dran .schein{ animation:aufscheinen');
    expect(ohneBewegt).not.toMatch(/animation:(rieseln|aufscheinen)/);
    expect(stil).toMatch(/\.nagel \.schein\{[^}]*opacity:0/);
  });

  it('B · Luft: drei Schichten (Gold Kehre 1–3, Hell 4–6, Schnee 7), fest erzeugt, ohne Skript und bei weniger Bewegung weg', () => {
    const luft = html.match(/<div class="reise-luft" aria-hidden="true">([\s\S]*?)<\/div><\/div>/)[0];
    expect(luft).toMatch(/<div class="gold">/); expect(luft).toMatch(/<div class="hell">/); expect(luft).toMatch(/<div class="schnee">/);
    expect(luft.match(/<i /g).length).toBeLessThanOrEqual(60);
    expect(vorstellungBauen()).toBe(html);   // gleiche Seite bei jedem Bauen (kein Math.random in der Quelle)
    expect(stil).toContain('.js .reise-buehne[data-hier="6"] .schnee{ opacity:1 }');
    expect(stil).toMatch(/\[data-hier="0"\], \[data-hier="1"\], \[data-hier="2"\]\) \.gold/);
    expect(stil).toContain('html:not(.js) .reise-luft{ display:none }');
    expect(ruhig).toContain('.reise-luft{ display:none }');
    expect(bewegt).toContain('.reise-luft i{ animation:schweben');
    expect(ohneBewegt).not.toContain('animation:schweben');
  });

  it('C · Titel setzen sich nur ohne «weniger Bewegung»; vorgelesen wird der ganze Titel, Streuung höchstens 250 ms', () => {
    expect(js).toContain('if (!ruhig.matches) titel.forEach(setzbar);');
    expect(js).toContain("vorlesen.className = 'unsichtbar'");
    expect(js).toContain("bild.setAttribute('aria-hidden', 'true')");
    expect(js).toContain('* 150 + Math.random() * 100');
    expect(stil).toContain('.js .reise-text h3.setzen .z{ opacity:0 }');   // nur was das Skript aufgeteilt hat, ist verborgen
    expect(bewegt).toContain('.js .reise-text h3.setzen.gesetzt .z{ transition:opacity .4s');
  });

  it('D · oben angekommen leuchtet der Weg einmal von unten nach oben, 150 ms je Halt', () => {
    expect((html.match(/<circle class="schein" r="19"\/>/g) || [])).toHaveLength(7);
    for (let i = 0; i < 7; i++) expect(html).toContain(`style="color:var(--k${i}); --n:${i}"`);
    expect(js).toContain('var oben = hier === stationen.length - 1;');
    expect(bewegt).toContain('.js .reise-buehne[data-oben] .halt .schein{ animation:aufscheinen .4s');
    expect(bewegt).toContain('animation-delay:calc(var(--n) * .15s)');
  });

  it('Hero gestaffelt (Fuji: Aufforderung zuletzt), nur ohne «weniger Bewegung», Hauptknopf nicht verborgen ohne Animation', () => {
    expect(bewegt).toMatch(/\.pass h1 > span, [^{]*\.pass-weiter\{ animation:auftritt \.4s/);
    expect(bewegt).toContain('.pass .fakten, .pass .beta, .pass-weiter{ animation-delay:.6s }');
    expect(ohneBewegt).not.toContain('animation:auftritt');
  });
});
