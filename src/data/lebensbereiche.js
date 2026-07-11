// ─── Lebensbereiche — die Äste des Lebensbaums ──────────────────────────
//
// EINZIGE QUELLE DER WAHRHEIT für Ast-Farbe + Frucht pro Lebensbereich.
// Dieselbe Farbe + Frucht taucht überall wieder auf: am Baum, in den
// Kapitel-Karten, in den Mappen-Reitern (Bundesordner) und den Fächern
// (Arztkoffer). Design-Phase Schritt 2 — [[project_navigation_spine]].
//
// Barrierefreiheit (verschärft, Stebler Studios 2026-07-06): DREI redundante Kanäle —
//   1. Frucht-SILHOUETTE (Form überlebt Graustufen) → FruchtSilhouette.jsx
//   2. HELLIGKEIT der Töne gespreizt (hell → mittel → dunkel), nicht nur Farbton
//   3. Wort (Name des Bereichs)
// Nie Farbe allein. Test über den Schwarzweiss-Toggle (or5_grayscale).
//
// GUARDRAIL: reine Navigations-/Anzeige-Struktur. KEINE 7→11 Datenmigration —
// die 7 heutigen Kapitel behalten ihre Felder; die übrigen vier Bereiche
// (Gesundheit/Arbeit/Familie/Vorsorge) sind für spätere Nav-Stufen vorbereitet.

// Reihenfolge grob hell → dunkel, damit die Helligkeit als eigener Kanal trägt.
export const LEBENSBEREICHE = [
  { key: 'wohnen',         chapterKey: 'wohnen',         fruit: 'birne',      light: '#7E9A4E', dark: '#9DBA6A' },
  { key: 'finanzen',       chapterKey: 'finanzen',       fruit: 'aprikose',   light: '#C4A870', dark: '#D2B77E' },
  { key: 'person',         chapterKey: 'basis',          fruit: 'apfel',      light: '#5A7868', dark: '#7E9F8C' },
  { key: 'versicherungen', chapterKey: 'versicherungen', fruit: 'heidelbeere',light: '#6E90B0', dark: '#86A6C2' },
  { key: 'gesundheit',     chapterKey: null,             fruit: 'hagebutte',  light: '#C67A4A', dark: '#D98F5C' },
  { key: 'arbeit',         chapterKey: null,             fruit: 'haselnuss',  light: '#A8895E', dark: '#C0A277' },
  { key: 'familie',        chapterKey: null,             fruit: 'kirsche',    light: '#B96470', dark: '#CE8088' },
  { key: 'vorsorge',       chapterKey: null,             fruit: 'traube',     light: '#7E6E93', dark: '#9788AC' },
  { key: 'bildung',        chapterKey: 'ausbildung',     fruit: 'baumnuss',   light: '#8A6D4B', dark: '#A98A64' },
  { key: 'notfall',        chapterKey: 'notfall',        fruit: 'vogelbeere', light: '#B0524C', dark: '#C77069' },
  { key: 'behoerden',      chapterKey: 'behoerden',      fruit: 'zwetschge',  light: '#5A6472', dark: '#7C8798' },
];

// Schnellzugriff über den Bereichs-Schlüssel.
const BY_KEY = Object.fromEntries(LEBENSBEREICHE.map((b) => [b.key, b]));

// Schnellzugriff über den heutigen Kapitel-Schlüssel (nur die 7 mit Kapitel).
const BY_CHAPTER = Object.fromEntries(
  LEBENSBEREICHE.filter((b) => b.chapterKey).map((b) => [b.chapterKey, b])
);

export function getBereich(key) {
  return BY_KEY[key] || null;
}

// Bereich zu einem der 7 heutigen Kapitel (basis/wohnen/… → Ast).
export function getBereichForChapter(chapterKey) {
  return BY_CHAPTER[chapterKey] || null;
}

// Theme-bewusste Ast-Farbe. isDark true = dunkles Standard-Theme.
export function bereichColor(key, isDark) {
  const b = BY_KEY[key];
  if (!b) return null;
  return isDark ? b.dark : b.light;
}

// Ast-Farbe direkt zu einem Kapitel (Bequemlichkeit für die Dashboard-Karten).
export function chapterColor(chapterKey, isDark) {
  const b = BY_CHAPTER[chapterKey];
  if (!b) return null;
  return isDark ? b.dark : b.light;
}
