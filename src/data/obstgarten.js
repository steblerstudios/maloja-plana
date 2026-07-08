import { LEBENSBEREICHE } from './lebensbereiche.js';

// Reine Logik für den Lebens-Obstgarten — kein React, damit testbar.
// Jeder Lebensbereich ist ein eigenes Bäumchen, das mit dem Ausfüllstand seines
// Kapitels reift (4 Wuchsstufen wie beim Einzelbaum). Die vier Bereiche ohne
// eigenes Kapitel (Gesundheit/Arbeit/Familie/Vorsorge) stehen als Setzlinge da
// — Vorschau auf Kommendes, kein Defizit.

// Natürliche Pflanzenform je (schon entschiedener) Frucht — die Frucht selbst
// bleibt aus lebensbereiche.js, hier kommt nur die Wuchsform dazu:
//   rund  = runder Obstbaum (Apfel/Aprikose)
//   hoch  = hoher, schlanker Baum (Birne/Zwetschge/Vogelbeere)
//   breit = breit ausladend (Kirsche)
//   gross = grosse breite Krone (Baumnuss)
//   busch = niedriger Strauch, kaum Stamm (Heidelbeere/Hagebutte/Haselnuss)
//   rebe  = Rebe am Spalier (Traube)
export const FRUIT_FORM = {
  apfel: 'rund', aprikose: 'rund',
  birne: 'hoch', zwetschge: 'hoch', vogelbeere: 'hoch',
  kirsche: 'breit', baumnuss: 'gross',
  heidelbeere: 'busch', hagebutte: 'busch', haselnuss: 'busch',
  traube: 'rebe',
};
export function fruitForm(fruit) { return FRUIT_FORM[fruit] || 'rund'; }

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
