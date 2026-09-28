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

// Knopf in der Bereichsfarbe (Entscheid 25.09.2026): Schrift weiss oder dunkel, je
// nachdem, was auf dieser Fläche mehr Kontrast hat. Reicht keine für WCAG-AA (4.5:1,
// Knopfschrift ist klein), bleibt der Knopf beim allgemeinen Sand.
const luminanz = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const kontrast = (a, b) => {
  const la = luminanz(a), lb = luminanz(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
export const bereichsKnopf = (farbe, palette) => {
  const schrift = [palette.onSand, '#FFFFFF']
    .map((c) => [c, /^#[0-9a-f]{6}$/i.test(farbe || '') ? kontrast(farbe, c) : 0])
    .sort((a, b) => b[1] - a[1])[0];
  return schrift[1] >= 4.5
    ? { background: farbe, color: schrift[0] }
    : { background: palette.sand, color: palette.onSand };
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

// ─── Kapitel in der Bereichsfarbe (Entscheid Stebler Studios 27.09.2026) ────────────
// Titel und Zeichen des Kapitels tragen die Farbe seines Lebensbereichs, und der
// Seitenhintergrund HINTER der Karte ist leicht in ihr getönt; die Karte bleibt neutral.
// Vorher: Basis, Wohnen und Ausbildung alle gleich salbeigrün, die Tönung 4 % im Kopf.

// Zwei Farben mischen (anteil 0 = a, 1 = b).
export const mischeHex = (a, b, anteil) => {
  const kanal = (x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16));
  const [p, q] = [kanal(a), kanal(b)];
  return '#' + p.map((v, i) => Math.round(v * (1 - anteil) + q[i] * anteil).toString(16).padStart(2, '0')).join('');
};

// Die Bereichsfarbe als lesbare Schrift auf `grund`: in 5-%-Schritten Richtung Schwarz
// (hell) bzw. Weiss (dunkel), bis WCAG-AA (4.5:1) erreicht ist. Der Farbton bleibt;
// Gold auf hellem Grund (2.2:1) wird so zu einem dunkleren Gold statt zu Braun-Grau.
export const lesbareFarbe = (farbe, grund, isDarkMode, min = 4.5) => {
  const ziel = isDarkMode ? '#FFFFFF' : '#000000';
  for (let a = 0; a <= 1; a += 0.05) {
    const f = mischeHex(farbe, ziel, a);
    if (kontrast(f, grund) >= min) return f;
  }
  return ziel;
};

// { schrift, grund } für ein Kapitel — oder null, wenn es keinem Bereich gehört.
// Tönung: 16 % dunkel, 12 % hell («schwächer», Probe 27.09.2026).
export const kapitelBereichsfarbe = (chapterKey, palette, isDarkMode) => {
  const b = getBereichForChapter(chapterKey);
  if (!b) return null;
  const farbe = isDarkMode ? b.dark : b.light;
  return {
    schrift: lesbareFarbe(farbe, palette.surface, isDarkMode),
    grund: mischeHex(palette.bg, farbe, isDarkMode ? 0.16 : 0.12),
  };
};
