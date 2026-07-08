import { LEBENSBEREICHE } from './lebensbereiche.js';

// Reine Logik für den Lebens-Obstgarten — kein React, damit testbar.
// Jeder Lebensbereich ist ein eigenes Bäumchen, das mit dem Ausfüllstand seines
// Kapitels reift (4 Wuchsstufen wie beim Einzelbaum). Die vier Bereiche ohne
// eigenes Kapitel (Gesundheit/Arbeit/Familie/Vorsorge) stehen als Setzlinge da
// — Vorschau auf Kommendes, kein Defizit.

// Ausfüllstand → Wuchsstufe (gleiche Schwellen wie die Krone des Einzelbaums).
export function gardenStage(pct) {
  return pct >= 70 ? 4 : pct >= 40 ? 3 : pct >= 15 ? 2 : 1;
}

// data = gesamter Datensatz; chapters = getChapters(t) (Liste mit key/fields/title).
export function gardenTrees(data = {}, chapters = []) {
  const byKey = {};
  chapters.forEach((c, i) => { byKey[c.key] = { chapter: c, idx: i }; });
  return LEBENSBEREICHE.map((b) => {
    const entry = b.chapterKey ? byKey[b.chapterKey] : null;
    if (entry) {
      const cd = data[entry.chapter.key] || {};
      const total = entry.chapter.fields.length;
      const filled = entry.chapter.fields.filter((f) => cd[f.k]).length;
      const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
      return {
        key: b.key, fruit: b.fruit, chapterKey: entry.chapter.key, chapterIdx: entry.idx,
        title: entry.chapter.title, pct, stage: gardenStage(pct), future: false,
      };
    }
    return { key: b.key, fruit: b.fruit, chapterKey: null, chapterIdx: null, title: null, pct: 0, stage: 1, future: true };
  });
}
