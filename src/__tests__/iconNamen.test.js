// Jeder Icon-Name, der im Code steht, muss im Register stehen.
//
// Warum: `Icon` gibt für einen unbekannten Namen still `null` zurück — kein
// Fehler, keine Warnung, nur ein fehlendes Bild. So fehlten bis 23.09.2026 drei
// Icons, ohne dass es jemand merkte: `child` (Seitentitel «Kind bekommen"),
// `calculator` und `shield` (zwei Briefvorlagen). Dieselbe Fehlerart wie am
// 21.09., als die Suche `Icons['◎']` weiterreichte.
//
// Geprüft werden die Stellen, an denen ein Name als LITERAL steht: `icon: '…'`,
// `createElement(Icon, { name: '…' })`, `hinweisZeichen('…')`, `Icons.…`,
// `Icons['…']`. Ein Name, der erst zur Laufzeit zusammengesetzt wird, bleibt
// unsichtbar — das ist die Grenze dieses Tests, nicht ein Freispruch.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { Icons } from '../IconSystem.jsx';

const SRC = path.resolve(__dirname, '..');

const dateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === '__tests__' || e.name === 'i18n' ? [] : dateien(p);
  return /\.jsx?$/.test(e.name) ? [p] : [];
});

const MUSTER = [
  /\bicon:\s*'([^']+)'/g,
  /createElement\(Icon,\s*\{\s*name:\s*'([^']+)'/g,
  /\b(?:hinweisZeichen|HinweisZeichen)\(\s*'([^']+)'/g,
  /\bIcons\.([A-Za-z_$][\w$]*)/g,
  /\bIcons\[\s*'([^']+)'\s*\]/g,
];

// Erlaubnisliste, nicht Verbotsliste: jede Ausnahme steht hier mit Datei UND
// Namen. Ein neuer unbekannter Name fällt auf, auch in einer bekannten Datei.
const AUSNAHMEN = new Set([
  // Boden-Anker am Handy: zeichnet seine Icons selbst (`bottomIcon`), bewusst
  // als Referenz-Set der Outline-Icons (docs/ICON_KONVENTION.md).
  ...['file', 'receipt', 'calendarToday', 'pencil', 'sackmesser', 'gift', 'menu']
    .map((n) => `main.jsx:${n}`),
  // Browser-Benachrichtigung: ein Bildpfad, kein Icon-Name.
  'notifications.js:/icon-192.png',
]);

const verweise = () => {
  const gefunden = [];
  for (const datei of dateien(SRC)) {
    if (datei.endsWith('IconSystem.jsx')) continue;
    const inhalt = fs.readFileSync(datei, 'utf8');
    for (const muster of MUSTER) {
      for (const m of inhalt.matchAll(muster)) {
        const zeile = inhalt.slice(0, m.index).split('\n').length;
        gefunden.push({ name: m[1], datei: path.basename(datei), ort: `${path.basename(datei)}:${zeile}` });
      }
    }
  }
  return gefunden;
};

describe('Icon-Namen · jeder Verweis trifft das Register', () => {
  it('findet überhaupt Verweise (sonst prüft der Test die leere Menge)', () => {
    // Stand 23.09.2026: gut 100. Die Schwelle liegt tief genug, um Umbauten
    // auszuhalten, und hoch genug, dass ein kaputtes Muster auffällt.
    expect(verweise().length).toBeGreaterThan(60);
  });

  it('kein Verweis auf einen Namen, den es nicht gibt', () => {
    const unbekannt = verweise()
      .filter((v) => !(v.name in Icons))
      .filter((v) => !AUSNAHMEN.has(`${v.datei}:${v.name}`))
      .map((v) => `${v.ort} → ${v.name}`);
    expect(unbekannt).toEqual([]);
  });

  it('jede Ausnahme wird noch gebraucht', () => {
    const benutzt = new Set(verweise().map((v) => `${v.datei}:${v.name}`));
    expect([...AUSNAHMEN].filter((a) => !benutzt.has(a))).toEqual([]);
  });
});
