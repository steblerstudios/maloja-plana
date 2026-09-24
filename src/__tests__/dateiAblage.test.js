// «oder hier hinziehen» — und die Fläche nimmt die Datei auch an.
//
// Bis 24.09.2026 versprachen drei Flächen das Hineinziehen (KK-Karte, Budget-Import,
// Kapitel-Upload), aber keine hatte einen Drop-Handler. Regel: jede Datei, die einen
// Text mit diesem Versprechen zeigt, hängt `useDateiAblage` an ihre Fläche.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ablageEreignis } from '../hooks/useDateiAblage.js';
import de from '../i18n/de.js';

const SRC = path.resolve(__dirname, '..');

// Die Schlüssel, deren deutscher Text das Hineinziehen verspricht — aus dem Wörterbuch
// erhoben, nicht von Hand gelistet: ein neuer solcher Text fällt hier auf.
const versprechen = [];
const sammeln = (o, pfad) => {
  for (const [k, v] of Object.entries(o)) {
    const p = pfad ? pfad + '.' + k : k;
    if (typeof v === 'string' && /hier(her)? ?(rein|hin)?ziehen/i.test(v)) versprechen.push(p);
    else if (v && typeof v === 'object') sammeln(v, p);
  }
};
sammeln(de, '');

const dateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return ['__tests__', 'i18n'].includes(e.name) ? [] : dateien(p);
  return /\.jsx$/.test(e.name) ? [p] : [];
});

describe('Hineinziehen', () => {
  it('das Wörterbuch hat solche Versprechen (sonst prüft der Rest die leere Menge)', () => {
    expect(versprechen).toEqual(expect.arrayContaining(['kkScanner.selectImage', 'budgetImport.orDragHere', 'chapterView.selectFile']));
  });

  it('jede Datei, die ein solches Versprechen zeigt, hat eine Ablage-Fläche', () => {
    const ohne = [];
    for (const p of dateien(SRC)) {
      const q = fs.readFileSync(p, 'utf8');
      const zeigt = versprechen.filter((k) => q.includes("'" + k + "'"));
      if (zeigt.length && !(/useDateiAblage\(/.test(q) && /\.\.\.ablageProps/.test(q))) ohne.push(path.relative(SRC, p) + ' ' + zeigt.join(','));
    }
    expect(ohne).toEqual([]);
  });

  it('ablageEreignis hat die Form eines input-onChange', () => {
    const files = [{ name: 'a.csv' }];
    expect(ablageEreignis({ files }).target.files).toBe(files);
    expect(ablageEreignis(undefined).target.files).toEqual([]);
  });
});
