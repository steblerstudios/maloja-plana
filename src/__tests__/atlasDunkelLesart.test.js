import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// /kantonsatlas/ im dunklen Modus (Befund 09.11.2026, gefunden bei der App-Karte in #780): Dort ist die höchste
// Stufe die hellste (--k4 #C6D6E5), die Seite sagte aber überall «hell = tiefer, dunkel = höher».
// Was nicht mit dem Modus wechseln kann (SVG-Beschreibung, Vorlesetext der Legende), sagt jetzt «tiefere/höhere
// Zahlen» ohne Farbwort; der sichtbare Text hat je Modus seine Fassung, die andere ist per display versteckt.
const seite = fs.readFileSync(path.resolve(process.cwd(), 'public', 'kantonsatlas', 'index.html'), 'utf8');
const quelle = fs.readFileSync(path.resolve(process.cwd(), 'scripts', 'seiten', 'kantonsatlas.mjs'), 'utf8');

describe('Kantonsatlas: Lesart der Farben stimmt in beiden Modi', () => {
  it('der dunkle Modus dreht die Stufen tatsächlich (sonst wäre diese Regel unnötig)', () => {
    const hell = seite.match(/:root\{ --k1:(#[0-9A-F]{6}); --k2:#[0-9A-F]{6}; --k3:#[0-9A-F]{6}; --k4:(#[0-9A-F]{6})/);
    const dunkel = seite.match(/prefers-color-scheme: dark\)\{\s*:root\{ --k1:(#[0-9A-F]{6}); --k2:#[0-9A-F]{6}; --k3:#[0-9A-F]{6}; --k4:(#[0-9A-F]{6})/);
    const hellig = (hex) => parseInt(hex.slice(1, 3), 16) + parseInt(hex.slice(3, 5), 16) + parseInt(hex.slice(5, 7), 16);
    expect(hellig(hell[1])).toBeGreaterThan(hellig(hell[2]));     // hell: Stufe 1 heller als 4
    expect(hellig(dunkel[1])).toBeLessThan(hellig(dunkel[2]));    // dunkel: Stufe 1 dunkler als 4
  });

  it('Beschreibungen der Karten und Vorlesetext der Legende ohne Farbwort', () => {
    const beschreibungen = [...seite.matchAll(/<desc id="karte-[a-z]+-d">([^<]+)<\/desc>/g)].map((m) => m[1]);
    expect(beschreibungen.length).toBeGreaterThan(5);
    for (const d of beschreibungen) {
      expect(d).not.toMatch(/\bhell\b|\bdunkel\b/i);
      expect(d).toContain('von den tieferen zu den höheren Zahlen');
    }
    const legende = [...seite.matchAll(/<span class="sr-only">(Stufe \d von \d[^<]*)<\/span>/g)].map((m) => m[1]);
    expect(legende.length).toBeGreaterThan(20);
    for (const l of legende) expect(l).not.toMatch(/\bhell\b|\bdunkel\b/i);
  });

  it('sichtbarer Text: je Modus eine Fassung, die andere per display versteckt', () => {
    expect(seite).toContain('.nur-dunkel{ display:none }');
    expect(seite).toMatch(/@media \(prefers-color-scheme: dark\)\{ \.nur-hell\{ display:none \} \.nur-dunkel\{ display:inline \} \}/);
    expect(seite).toContain('<span class="nur-hell">Dunkel</span><span class="nur-dunkel">Hell</span> heisst «höhere Zahl»');
    expect(seite).toContain('<span class="nur-dunkel">Im dunklen Modus sind die Kantone mit den tieferen Zahlen dunkel, die mit den höheren hell.</span>');
    // ausserhalb der beiden Hüllen kein Satz, der «hell/dunkel» als feste Lesart nennt
    const ohneHuellen = seite.replace(/<span class="nur-(hell|dunkel)">[^<]*<\/span>/g, '').replace(/<style>[\s\S]*?<\/style>/g, '');
    expect(ohneHuellen).not.toMatch(/Hell sind die Kantone|Dunkel heisst|von hell \(tiefere Zahl\)/);
  });

  it('die Seite kommt aus der Quelle (kein Handeingriff im HTML)', () => {
    expect(quelle).toContain("', tiefste Zahlen'");
    expect(quelle).toContain('von den tieferen zu den höheren Zahlen.');
  });
});
