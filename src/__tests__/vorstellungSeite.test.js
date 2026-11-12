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
    expect(html).not.toMatch(/https?:\/\/(?!malojaplana\.ch|www\.gnu\.org|github\.com|schema\.org)/);
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

  it('Pass von oben (A1, 10.11.): Karte nach Kehre 7, vor den Situationen, mit Quelle und fertiger SVG', () => {
    const karte = koerper.indexOf('class="pass-karte"');
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

  it('Vier Höhenlinien-Bilder (10.11. abends): C+A nach Kehre 7, D vor «App holen», B vor dem Fuss, je mit Quelle', () => {
    const lage = (f) => koerper.indexOf(`src="/vorstellung/${f}"`);
    expect(lage('pass-blick.svg')).toBeGreaterThan(koerper.indexOf('class="reise-ausklang"'));
    expect(lage('pass-karte.svg')).toBeGreaterThan(lage('pass-blick.svg'));
    expect(lage('pass-blick-papier.svg')).toBeGreaterThan(koerper.indexOf('id="atlas"'));
    expect(koerper.indexOf('id="holen"')).toBeGreaterThan(lage('pass-blick-papier.svg'));
    expect(lage('pass-karte-papier.svg')).toBeGreaterThan(koerper.indexOf('class="schluss"'));
    expect(koerper.indexOf('<footer')).toBeGreaterThan(lage('pass-karte-papier.svg'));
    for (const f of ['pass-blick.svg', 'pass-blick-papier.svg', 'pass-karte-papier.svg']) {
      const svg = fs.readFileSync(path.join(WURZEL, 'public/vorstellung', f), 'utf8');
      expect(svg, f).toContain('© swisstopo');
      expect(svg, f).not.toMatch(/<script|href=/);
    }
    expect((koerper.match(/Höhen © swisstopo/g) || []).length).toBe(3);   // A, D, B; C teilt die Zeile mit A
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
    KAPITEL.forEach((k, i) => expect(html).toContain(`<a href="${BEISPIEL}#/chapter/${i}">${k.name} im Beispiel ansehen</a>`));
  });

  it('D · gross steht das Kapitel-Zeichen (nur Bild, aria-hidden), «Kehre n von 7» steht als Text; keine grosse Zahl mehr', () => {
    expect((html.match(/<div class="reise-gross" aria-hidden="true"><svg /g) || []).length).toBe(7);
    expect(html).not.toContain('class="reise-zahl"');
    KAPITEL.forEach((k, i) => expect(html).toContain(`Kehre ${i + 1} von 7 · ${k.name}`));
  });

  it('B/D · jeder Stocknagel ist ein Aufkleber mit dem Kapitel-Zeichen statt einer Nummer, leicht schräg', () => {
    const naegel = html.split('<g class="nagel">').slice(1).map((t) => t.split('<g class="nagel-dreh"')[0].split('</svg>\n')[0]);
    expect(naegel).toHaveLength(7);
    for (const n of naegel) {
      expect(n).toMatch(/^<g transform="rotate\(-?\d+ 60 \d+\)">/);
      expect(n).toMatch(/<g class="bild" style="color:var\(--k\d\)"><svg x="42"/);
      expect(n).toContain('<g class="woelbung">');
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
    for (const teil of ['mask-position 1.1s', 'animation:anschlagen', 'animation:ziehen']) expect(bewegt).toContain(teil);
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

  it('Browserleiste hell und dunkel nach Granit', () => {
    expect(html).toContain('<meta name="theme-color" content="#F2F2F0" media="(prefers-color-scheme: light)">');
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
    expect(js).toContain("var zustand = bruecke.getBoundingClientRect().bottom <= h * 0.5 ? 'seite' : 'aus';");
    expect(js).not.toContain("'reise'");
    expect(html).not.toContain('class="leiste-ort"');
    expect(js).toContain("setAttribute('aria-current', 'location')");
  });

  it('C · auf der Weglinie sitzt an jedem Halt das Kapitel-Zeichen', () => {
    const halte = html.match(/<g class="halt" /g) || [];
    expect(halte).toHaveLength(7);
    expect(html).toMatch(/<g class="halt" data-kehre="1" data-x="[\d.]+" data-y="[\d.]+" transform="translate\([\d.]+ [\d.]+\)" style="color:var\(--k0\)"><circle r="12"\/><svg x="-8.5"/);
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
