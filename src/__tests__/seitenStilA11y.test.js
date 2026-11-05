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

const stilVon = (html) => (html.match(/<style>([\s\S]*?)<\/style>/g) || []).join('\n');

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
  const dunkelBlock = stil.match(/prefers-color-scheme:\s*dark\)\s*\{([\s\S]*?)\n\s*\}/);
  const ohneDunkel = dunkelBlock ? stil.replace(dunkelBlock[0], '') : stil;
  for (const m of ohneDunkel.matchAll(/:root\s*\{([^}]*)\}/g)) lesen(m[1], hell);
  if (dunkelBlock) for (const m of dunkelBlock[1].matchAll(/:root\s*\{([^}]*)\}/g)) lesen(m[1], dunkel);
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
