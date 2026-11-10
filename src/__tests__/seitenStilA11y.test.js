import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// ─────────────────────────────────────────────────────────────
// Gemeinsamer Stil der öffentlichen Seiten · a11y-Wächter (05.11.2026)
//
// Zwei Befunde aus der a11y-Prüfung von /politsystem/, die alle Seiten betrafen:
//
//   1. `a:hover{ color:var(--salbei) }` — Salbei #7E9F8C auf #F2F2F0 hat 2.59:1,
//      WCAG 1.4.3 verlangt 4.5:1. Dieser Wächter rechnet für JEDE Hover-Regel
//      mit Farbe den Kontrast gegen den Seitengrund, hell und dunkel.
//   2. Scrollbare `.tabelle` (overflow-x:auto) waren per Tastatur nicht
//      erreichbar (WCAG 2.1.1). Jede muss eine benannte Region mit tabindex="0"
//      sein, und der Fokus muss sichtbar sein.
//
// Geprüft wird die gebaute Ausgabe unter public/, nicht der Generator: Das ist
// das, was ausgeliefert wird.
// ─────────────────────────────────────────────────────────────

const PUBLIC = path.resolve(process.cwd(), 'public');
function htmlDateien(ordner) {
  return fs.readdirSync(ordner, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(ordner, e.name);
    if (e.isDirectory()) return htmlDateien(p);
    return e.name.endsWith('.html') ? [p] : [];
  });
}
// Nur Seiten aus scripts/build-seiten.mjs. Die App (index.html der Wurzel) und
// die zwei handgeschriebenen Seiten 404.html und wartung.html haben eigenen Stil.
const NICHT_GENERIERT = new Set(['index.html', '404.html', 'wartung.html']);
const SEITEN = htmlDateien(PUBLIC)
  .filter((p) => !NICHT_GENERIERT.has(path.relative(PUBLIC, p)))
  .map((p) => ({ name: path.relative(PUBLIC, p), html: fs.readFileSync(p, 'utf8') }))
  .filter((s) => s.html.includes('<style>'));

// Ohne CSS-Kommentare: Sonst landet ein Kommentar vor einer Regel im Selektor
// (Mutationsprobe 05.11.2026: Kommas im Kommentar wurden zu «Selektoren»).
const stilVon = (html) => (html.match(/<style>([\s\S]*?)<\/style>/g) || []).join('\n').replace(/\/\*[\s\S]*?\*\//g, '');

function luminanz(hex) {
  const h = hex.replace('#', '');
  const voll = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(voll.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function kontrast(a, b) {
  const [x, y] = [luminanz(a), luminanz(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// Variablen aus dem ersten :root (hell) und dem :root im dark-Block.
function variablen(stil) {
  const hell = {}, dunkel = {};
  const lesen = (block, ziel) => {
    for (const [, k, v] of block.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\b/g)) if (!(k in ziel)) ziel[k] = v;
  };
  // ALLE Dunkel-Blöcke: Die Hintergrundseiten setzen --heidel-text erst in einem
  // zweiten @media-Block. Mit nur dem ersten galt dunkel der helle Wert (05.11.2026).
  const dunkelBloecke = [...stil.matchAll(/prefers-color-scheme:\s*dark\)\s*\{([\s\S]*?)\n\s*\}/g)];
  let ohneDunkel = stil;
  for (const b of dunkelBloecke) ohneDunkel = ohneDunkel.replace(b[0], '');
  for (const m of ohneDunkel.matchAll(/:root\s*\{([^}]*)\}/g)) lesen(m[1], hell);
  for (const b of dunkelBloecke) for (const m of b[1].matchAll(/:root\s*\{([^}]*)\}/g)) lesen(m[1], dunkel);
  return { hell, dunkel: { ...hell, ...dunkel } };
}

describe('Kontrast-Rechnung', () => {
  it('stimmt mit bekannten Werten überein', () => {
    expect(kontrast('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    // Der Befund selbst: Salbei auf Seitengrund
    expect(kontrast('#7E9F8C', '#F2F2F0')).toBeCloseTo(2.59, 2);
    expect(kontrast('#24262A', '#F2F2F0')).toBeGreaterThan(13);
  });
});

describe('Öffentliche Seiten · gemeinsamer Stil', () => {
  it('findet gebaute Seiten', () => {
    expect(SEITEN.length).toBeGreaterThan(10);
  });

  it.each(SEITEN.map((s) => [s.name, s]))('%s: jede Hover-Farbe hat mindestens 4.5:1 auf dem Seitengrund', (_, s) => {
    const stil = stilVon(s.html);
    const { hell, dunkel } = variablen(stil);
    expect(hell.bg, 'kein --bg im Stil gefunden').toBeTruthy();
    const schwach = [];
    for (const [, regel, rumpf] of stil.matchAll(/([^{}]*:hover[^{]*)\{([^}]*)\}/g)) {
      const farbe = rumpf.match(/(?:^|[;\s])color\s*:\s*([^;}\s]+)/);
      if (!farbe) continue;
      for (const [modus, v] of [['hell', hell], ['dunkel', dunkel]]) {
        const wert = farbe[1].startsWith('var(') ? v[farbe[1].match(/var\(--([\w-]+)\)/)[1]] : farbe[1];
        if (wert === 'inherit' || wert === 'currentColor') continue;
        expect(wert, `${regel.trim()}: Farbe ${farbe[1]} nicht auflösbar`).toMatch(/^#[0-9a-fA-F]{3,6}$/);
        const k = kontrast(wert, v.bg);
        if (k < 4.5) schwach.push(`${regel.trim()} (${modus}): ${wert} auf ${v.bg} = ${k.toFixed(2)}:1`);
      }
    }
    expect(schwach).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────
// Links im Fliesstext nicht nur an der Farbe erkennbar (WCAG 1.4.1) · 05.11.2026
//
// Ohne Unterstreichung bleibt nur die Farbe, und die müsste sich mit 3:1 vom
// umgebenden Text abheben. Die Belege (sup.beleg a) hatten mit --heidel-text
// gegen den Fliesstext nur 2.68:1 hell und 1.94:1 dunkel, «Zurück zum Text»
// (.q-zurueck a) gegen den leisen Text 1.10:1 und 1.01:1.
//
// Deshalb eine ERLAUBNISLISTE: Jede Regel mit text-decoration:none (ausser
// :hover/:focus) muss hier mit Grund stehen. Wer eine neue einführt, muss
// begründen, warum der Link ohne Unterstreichung erkennbar bleibt.
//
// Offen, nicht Teil dieses Wächters (a11y-Prüfung 05.11.2026, Soll): Die
// Beleg-Trefferfläche misst im Browser 24×20 px (line-height:0 in sup.beleg),
// also unter 24px Höhe. Benachbarte Belege überlappen nicht (0 Fälle auf
// /krankenkasse/), die Abstands-Ausnahme von 2.5.8 greift vermutlich.
// ─────────────────────────────────────────────────────────────
const OHNE_UNTERSTRICH_ERLAUBT = {
  '.marke': 'Wortmarke im Kopf, kein Link im Fliesstext',
  '.knopf': 'Knopfform mit Goldfläche, Form statt Farbe',
  // Hängt an der leisen Beschreibung (<span>) darunter: ohne sie wäre nur das Gewicht übrig.
  '.weiter a': 'Liste, in der jeder Eintrag ein Link ist, halbfett; Hover unterstreicht',
  'nav.inhalt a': 'Inhaltsverzeichnis in nav, jeder Eintrag ein Link; Hover unterstreicht',
  // Drei-Schichten-Probe 09.11.2026 (/krankenkasse/): Weg-Knöpfe in nav.wege.
  'a.weg': 'Knopfform mit Rand, Fläche und Pfeil, 44 px hoch, Form statt Farbe',
  // Kantonsatlas, Brillen als Filter (Brückenstück 09.11.2026): Knopfreihe in nav.brillen-wahl.
  '.brillen-wahl a': 'Knopfform (Pille mit Rand und Fläche), 44 px hoch, in nav; gewählt zusätzlich fett',
  // Die Reise (/reise/, Entwurf 10.11.2026).
  '.etappen a': 'Etappen-Leiste in nav, jeder Eintrag ein Link mit Stations-Punkt, 44 px hoch; aktuelle Etappe mit Fläche',
  '.notfall': 'festes Notfall-Schild: Pille mit Rand, Fläche und Kreuz-Symbol, 44 px hoch, Form statt Farbe',
};

describe('Links im Text sind nicht nur an der Farbe erkennbar (WCAG 1.4.1)', () => {
  it.each(SEITEN.map((s) => [s.name, s]))('%s: text-decoration:none nur für erlaubte Regeln', (_, s) => {
    const fremd = [];
    for (const [, regel, rumpf] of stilVon(s.html).matchAll(/([^{}]*)\{([^}]*)\}/g)) {
      const sel = regel.trim();
      if (/:hover|:focus/.test(sel)) continue;
      if (!/text-decoration(?:-line)?\s*:\s*none/.test(rumpf)) continue;
      for (const teil of sel.split(',').map((t) => t.trim())) if (!(teil in OHNE_UNTERSTRICH_ERLAUBT)) fremd.push(teil);
    }
    expect(fremd).toEqual([]);
  });

  const mitBelegen = SEITEN.filter((s) => /<sup class="beleg">/.test(s.html));
  it('es gibt Seiten mit Belegen (sonst prüft dieser Wächter nichts)', () => {
    expect(mitBelegen.length).toBeGreaterThan(0);
  });

  // Positiv geprüft, nicht nur «kein none»: so fällt auch auf, wenn die Regel
  // verschwindet und eine spätere Regel die Unterstreichung anders wegnimmt.
  it.each(mitBelegen.map((s) => [s.name, s]))('%s: Beleg- und Zurück-Links sind im Ruhezustand unterstrichen', (_, s) => {
    const stil = stilVon(s.html);
    for (const sel of ['sup\\.beleg a', '\\.q-zurueck a']) {
      const regeln = [...stil.matchAll(new RegExp(`(?:^|[}\\s])${sel}\\s*\\{([^}]*)\\}`, 'g'))].map((m) => m[1]);
      expect(regeln.length, `keine Regel für ${sel}`).toBeGreaterThan(0);
      expect(regeln.some((r) => /text-decoration\s*:\s*underline/.test(r)), `${sel} nicht unterstrichen`).toBe(true);
      // Und keine Regel macht die Linie wieder unsichtbar (a11y-Prüfung 05.11.2026).
      const unsichtbar = regeln.filter((r) =>
        /text-decoration(?:-line)?\s*:\s*none|text-decoration-color\s*:\s*transparent|text-decoration-thickness\s*:\s*0(?![.\d])/.test(r));
      expect(unsichtbar, `${sel}: Unterstreichung wird wieder weggenommen`).toEqual([]);
    }
  });

  // Der Grund für die Unterstreichung bleibt sichtbar: Die Linkfarbe allein
  // reicht gegen den Fliesstext nicht. Steigt sie einmal über 3:1, darf dieser
  // Test angepasst werden, die Unterstreichung bleibt trotzdem die ruhigere Wahl.
  it('Belegfarbe gegen Fliesstext liegt unter 3:1 (darum unterstrichen)', () => {
    const s = mitBelegen[0];
    const { hell, dunkel } = variablen(stilVon(s.html));
    expect(kontrast(hell['heidel-text'], hell.text)).toBeLessThan(3);
    expect(kontrast(dunkel['heidel-text'], dunkel.text)).toBeLessThan(3);
    // und gegen den Grund genügt sie 1.4.3
    expect(kontrast(hell['heidel-text'], hell.bg)).toBeGreaterThanOrEqual(4.5);
    expect(kontrast(dunkel['heidel-text'], dunkel.bg)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('Scrollbare Tabellen sind per Tastatur erreichbar (WCAG 2.1.1)', () => {
  const mitTabellen = SEITEN.filter((s) => /<div class="tabelle[ "]/.test(s.html));

  it('es gibt Seiten mit Tabellen (sonst prüft dieser Wächter nichts)', () => {
    expect(mitTabellen.length).toBeGreaterThan(0);
  });

  it.each(mitTabellen.map((s) => [s.name, s]))('%s: jede .tabelle ist Region mit Namen und tabindex="0"', (_, s) => {
    const kaputt = [];
    for (const [tag] of s.html.matchAll(/<div class="tabelle[^"]*"[^>]*>/g)) {
      const name = tag.match(/aria-label="([^"]*)"/);
      if (!/role="region"/.test(tag) || !/tabindex="0"/.test(tag) || !name || !name[1].trim()) kaputt.push(tag);
    }
    expect(kaputt).toEqual([]);
  });

  it.each(mitTabellen.map((s) => [s.name, s]))('%s: jede <table> steckt in einer .tabelle mit caption', (_, s) => {
    const tabellen = (s.html.match(/<table[\s>]/g) || []).length;
    const huellen = (s.html.match(/<div class="tabelle[^"]*"[^>]*><table>\s*<caption>/g) || []).length;
    expect(huellen).toBe(tabellen);
  });

  // Der Name gehört zum sichtbaren Titel: meist die ganze caption
  // (tabellenErreichbar() in build-seiten.mjs). Seiten dürfen ihn von Hand
  // kürzen oder umformulieren (/kantone-im-vergleich/), deshalb kein Wortlaut-
  // Vergleich. Geprüft wird die Sache: nicht leer, nicht generisch, und
  // mindestens ein tragendes Wort (ab 5 Buchstaben) steht auch in der caption.
  const GENERISCH = /^(tabelle|table|tableau|tabella|daten|zahlen)$/i;
  const woerter = (t) => new Set(t.toLowerCase().match(/[\p{L}]{5,}/gu) || []);
  it.each(mitTabellen.map((s) => [s.name, s]))('%s: der Name der Region kommt aus der caption', (_, s) => {
    let geprueft = 0;
    for (const [, name, caption] of s.html.matchAll(/<div class="tabelle[^"]*"[^>]*aria-label="([^"]*)"[^>]*><table>\s*<caption>([\s\S]*?)<\/caption>/g)) {
      const text = caption.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().replace(/&amp;/g, '&');
      const n = name.replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
      expect(n.length, `leerer Name zu «${text}»`).toBeGreaterThan(0);
      expect(GENERISCH.test(n), `Name «${n}» ist generisch`).toBe(false);
      const inCaption = woerter(text);
      expect([...woerter(n)].some((w) => inCaption.has(w)), `Name «${n}» passt nicht zur caption «${text}»`).toBe(true);
      geprueft++;
    }
    // Sonst liefe die Schleife bei geänderter Attributreihenfolge leer und bliebe grün.
    expect(geprueft).toBe((s.html.match(/<div class="tabelle[ "]/g) || []).length);
  });

  it.each(mitTabellen.map((s) => [s.name, s]))('%s: fokussierte Tabelle hat einen sichtbaren Rahmen', (_, s) => {
    const stil = stilVon(s.html);
    expect(stil).toMatch(/\.tabelle\[tabindex\]:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--text\)/);
    // Keine Regel für .tabelle darf den Rahmen wieder wegnehmen.
    expect(stil).not.toMatch(/\.tabelle[^{]*\{[^}]*outline:\s*(?:none|0)\b/);
  });
});
