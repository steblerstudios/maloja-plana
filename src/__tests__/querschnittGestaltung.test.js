// Querschnitt 1 Gestaltung (Gesamtbefund 09.11.2026, Stebler Studios: «c finde ich gut», «Ja, A und B»).
// Regel: Material statt Effekt. Was man bedienen kann, muss man sehen können. Nichts kleiner als die Skala.
//  A · kein Milchglas (backdropFilter) in der App
//  B · keine Schrift unter text.xs (13 px) im HTML; Grafiken stehen als Bestand mit Sperrklinke
//  C · Eingabefelder tragen palette.feldrand (≥ 3:1, WCAG 1.4.11), nicht die Schmuck-Haarlinie border
// Geprüft wird der Quelltext, weil die Stile inline in createElement stehen.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DARK_PALETTE, LIGHT_PALETTE } from '../config/constants.js';
import { text } from '../config/tokens.js';

const SRC = fileURLToPath(new URL('..', import.meta.url));
const dateien = (dir = SRC) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  if (statSync(p).isDirectory()) return n === '__tests__' || n === 'assets' ? [] : dateien(p);
  return /\.(jsx|js)$/.test(n) && !/\.test\./.test(n) ? [p] : [];
});
const QUELLEN = dateien().map((p) => ({ datei: relative(SRC, p), s: readFileSync(p, 'utf8') }));

const leuchte = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const kontrast = (a, b) => {
  const [h, d] = [leuchte(a), leuchte(b)].sort((x, y) => y - x);
  return (h + 0.05) / (d + 0.05);
};

// Klammer-Ende ab einer öffnenden Klammer.
const bisZu = (s, start, auf, zu) => {
  let tiefe = 0;
  for (let i = start; i < s.length; i++) {
    if (s[i] === auf) tiefe++;
    else if (s[i] === zu && --tiefe === 0) return i + 1;
  }
  return s.length;
};

describe('C · Feldrand', () => {
  it.each([['hell', LIGHT_PALETTE], ['dunkel', DARK_PALETTE]])('%s: feldrand ≥ 3:1 auf up und surface, heller als mid', (_, p) => {
    expect(kontrast(p.feldrand, p.up)).toBeGreaterThanOrEqual(3);
    expect(kontrast(p.feldrand, p.surface)).toBeGreaterThanOrEqual(3);
    // Rangfolge: Hinweistext (mid) steht vor dem Rand.
    expect(kontrast(p.mid, p.surface)).toBeGreaterThan(kontrast(p.feldrand, p.surface));
  });

  it('kein Eingabefeld zeichnet seinen Rand mit palette.border', () => {
    const funde = [];
    const OHNE_RAND = /type:\s*'(checkbox|radio|range|file|hidden)'/;
    for (const { datei, s } of QUELLEN) {
      for (const m of s.matchAll(/createElement\((?:'(?:input|select|textarea)'|mehrzeilig \? 'textarea' : 'input')/g)) {
        const ende = bisZu(s, m.index + m[0].indexOf('('), '(', ')');
        const koerper = s.slice(m.index, ende);
        if (OHNE_RAND.test(koerper)) continue;
        const bereiche = [koerper];
        for (const r of koerper.matchAll(/style:\s*(?:\{\s*\.\.\.)?([A-Za-z_]\w*)(?:\.(\w+))?/g)) {
          const def = s.match(new RegExp('\\bconst\\s+' + r[1] + '\\s*=\\s*[^{]*?\\{'));
          if (!def) continue;
          const a = def.index + def[0].length - 1;
          let teil = s.slice(a, bisZu(s, a, '{', '}'));
          if (r[2]) {
            const mm = teil.match(new RegExp('\\b' + r[2] + '\\s*:\\s*\\{'));
            if (!mm) continue;
            teil = teil.slice(mm.index, bisZu(teil, mm.index + mm[0].length - 1, '{', '}'));
          }
          bereiche.push(teil);
        }
        if (bereiche.some((b) => /solid '\s*\+\s*\(?[^)]*?palette\.border\b/.test(b))) {
          funde.push(datei + ':' + (s.slice(0, m.index).split('\n').length));
        }
      }
    }
    expect(funde).toEqual([]);
  });
});

describe('A · kein Milchglas', () => {
  it('kein backdropFilter in der App', () => {
    const funde = QUELLEN.filter(({ s }) => /backdropFilter|backdrop-filter/i.test(s)).map(({ datei }) => datei);
    expect(funde).toEqual([]);
  });
});

describe('B · Mindestschrift', () => {
  it('der kleinste Schritt der Skala ist 13 px', () => {
    expect(text.xs).toBe(13);
  });

  // Grafiken (SVG-Beschriftungen, Etiketten in Bildern) und Deko-Zeichen (Aufklapp-Pfeile der Auswahlfelder):
  // Bestand vom 09.11.2026. Eine Zahl darf nur sinken. Grafiken werden einzeln am Bild bei 375 px gemessen.
  const BESTAND = {
    'AblaufSchale.jsx': 2, 'Baum3D.jsx': 2, 'ChapterView.jsx': 1, 'SozialhilfeRechner.jsx': 1, 'VorsorgeRechner.jsx': 11,
    'components/BergLandschaft.jsx': 2, 'components/FranchiseKreuz.jsx': 13, 'components/Gauge.jsx': 3,
    'components/Geldfluss.jsx': 1, 'components/Jahreskreis.jsx': 2, 'components/LebenslaufVorschau.jsx': 1,
    'components/LeistungsKompass.jsx': 2, 'components/LohnEinordnung.jsx': 2, 'components/Pegel.jsx': 3,
  };
  const KLEIN = /fontSize:\s*(?:'(\d+(?:\.\d+)?)px'|(\d+(?:\.\d+)?)\b(?!\s*[-+*/])|text\.xs\s*-\s*\d+)/g;
  const zaehle = (s) => {
    const z = s.split('\n');
    let n = 0;
    z.forEach((zeile, i) => {
      // Deko-Zeichen: Aufklapp-Pfeil (auch eine Zeile tiefer) und das kleine «a» im Schriftgrössen-Knopf.
      if (/aufklappZeichen/.test(zeile + (z[i + 1] || '')) || zeile.includes("'a')")) return;
      for (const m of zeile.matchAll(KLEIN)) {
        const v = m[1] ?? m[2];
        if (v === undefined || Number(v) < 13) n++;
      }
    });
    return n;
  };

  it('keine Schrift unter 13 px ausserhalb des Grafik-Bestands', () => {
    const zuviel = QUELLEN
      .map(({ datei, s }) => [datei, zaehle(s), BESTAND[datei] || 0])
      .filter(([, ist, darf]) => ist > darf)
      .map(([d, ist, darf]) => `${d}: ${ist} (erlaubt ${darf})`);
    expect(zuviel).toEqual([]);
  });
});
