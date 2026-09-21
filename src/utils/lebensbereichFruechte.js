// Gemeinsame Ableitungen für Kapitel-Zustand, Ast-Farbe und Bereichs-Früchte.
//
// Lagen bis 21.09.2026 als lokale Helfer in `DashboardComplete`. Beim Umzug des
// Lebensbaums auf die Finanz-Übersicht brauchten beide Seiten dieselbe Logik —
// verschoben werden konnte sie also nicht, geteilt schon.
//
// Kein React, keine Palette-Annahmen ausser den übergebenen Werten: damit bleibt
// das hier prüfbar, ohne eine Ansicht zu rendern.
import { getBereichForChapter } from '../data/lebensbereiche.js';
import { feldErledigt, kapitelVollstaendigkeit } from './vollstaendigkeit.js';

// Vier Stufen, jede positiv lesbar — kein Defizit, kein Rückstand.
// «trifft nicht zu» zählt über `feldErledigt` als erledigt (E17).
export const kapitelStatus = (chapter, chapterData) => {
  const filled = chapter.fields.filter((f) => feldErledigt(chapterData, f.k)).length;
  if (filled === 0) return 'leer';
  const mvoFields = chapter.fields.filter((f) => f.mvo);
  const mvoFilled = mvoFields.filter((f) => feldErledigt(chapterData, f.k)).length;
  if (mvoFields.length > 0 && mvoFilled === mvoFields.length) {
    const total = chapter.fields.length;
    return filled >= Math.ceil(total * 0.75) ? 'vertieft' : 'grundordnung';
  }
  return 'begonnen';
};

// Ast-Farbe je Kapitel — eigene Frucht-Farbe je Lebensbereich, theme-abhängig.
// Der Rückfall greift nur für Kapitel ohne eigenen Bereich.
export const astFarben = (chapters, palette, isDarkMode) => {
  const rueckfall = {
    basis: palette.sage, wohnen: palette.sage, finanzen: palette.gold,
    versicherungen: palette.sky, ausbildung: palette.sage,
    behoerden: palette.sand, notfall: palette.rose,
  };
  return Object.fromEntries(
    chapters.map((ch) => {
      const b = getBereichForChapter(ch.key);
      return [ch.key, b ? (isDarkMode ? b.dark : b.light) : (rueckfall[ch.key] || palette.sage)];
    })
  );
};

// Reife-Stufe der Frucht folgt derselben Vier-Stufen-Logik wie das Kapitel:
// Knospe · Blüte · junge Frucht · reife Frucht.
const STUFE = { leer: 1, begonnen: 2, grundordnung: 3, vertieft: 4 };

// Eine Frucht je Kapitel, das einen Lebensbereich hat. Kapitel ohne Bereich
// fallen heraus — sie hätten keine Frucht zu tragen.
export const bereichsFruechte = (chapters, data, astFarbe) =>
  chapters.map((ch, idx) => {
    const b = getBereichForChapter(ch.key);
    if (!b) return null;
    return {
      key: ch.key,
      idx,
      fruit: b.fruit,
      iconName: ch.key,
      color: astFarbe[ch.key],
      pct: kapitelVollstaendigkeit(ch, data[ch.key]).pct,
      title: ch.title,
      short: ch.short,
      stage: STUFE[kapitelStatus(ch, data[ch.key])] || 1,
    };
  }).filter(Boolean);
