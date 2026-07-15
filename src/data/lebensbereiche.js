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

// `lightDeep` — Frucht-Ton für bedeutungstragende FLÄCHEN im Hellmodus (Balken-Füllung).
// Predeploy-Runde 8, Stebler-Studios-Entscheid. Gemessen, nicht geschätzt:
//   Birne #7E9A4E gegen Spur #DCDAD6 = 2.27:1 und gegen Karte #ECECEA = 2.68:1 —
//   WCAG 1.4.11 will 3:1 für Grafik, die die Aussage trägt. Die Frucht ist im Hellmodus
//   schlicht zu hell für BEIDE Kanten.
//   ⚠️ Eine dunklere SPUR behebt das NICHT, sie macht es schlimmer (2.27 → 1.71): die
//   Frucht ist dunkler als die helle Spur, beide rücken zusammen. Erst eine fast schwarze
//   Spur (4.78:1) trüge — das ist im Hellmodus der lauteste Punkt der Seite.
//   Im DUNKELMODUS ist die Richtung umgekehrt (Frucht heller als Spur) und alles hält
//   schon: 4.83:1 / 4.33:1. Darum gibt es bewusst kein `darkDeep`.
// Farbton bleibt identisch (82.1°→81.6° · 34.9°→34.4°) — nur die Helligkeit sinkt.
// `light` selbst wird NICHT angefasst: es ist die Identitätsfarbe (Baum, Kapitel-Karten,
// Mappen-Reiter, Arztkoffer) und trägt zugleich den Helligkeits-Kanal der Reihenfolge.
// → Nur die Bereiche, die heute eine Füllung zeichnen, tragen `lightDeep`. Kommt ein
//   neues Instrument dazu, braucht sein Bereich einen — sonst fällt es auf `light`
//   zurück und verfehlt 1.4.11 still. Siehe `bereichFillColor`.
//
// Reihenfolge grob hell → dunkel, damit die Helligkeit als eigener Kanal trägt.
export const LEBENSBEREICHE = [
  { key: 'wohnen',         chapterKey: 'wohnen',         fruit: 'birne',      light: '#7E9A4E', lightDeep: '#6C8343', dark: '#9DBA6A' },
  { key: 'finanzen',       chapterKey: 'finanzen',       fruit: 'aprikose',   light: '#C4A870', dark: '#D2B77E' },
  { key: 'person',         chapterKey: 'basis',          fruit: 'apfel',      light: '#5A7868', dark: '#7E9F8C' },
  { key: 'versicherungen', chapterKey: 'versicherungen', fruit: 'heidelbeere',light: '#6E90B0', dark: '#86A6C2' },
  { key: 'gesundheit',     chapterKey: null,             fruit: 'hagebutte',  light: '#C67A4A', dark: '#D98F5C' },
  { key: 'arbeit',         chapterKey: null,             fruit: 'haselnuss',  light: '#A8895E', lightDeep: '#947750', dark: '#C0A277' },
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
// Identitätsfarbe des Bereichs — Baum, Kapitel-Karten, Reiter, Fächer.
export function bereichColor(key, isDark) {
  const b = BY_KEY[key];
  if (!b) return null;
  return isDark ? b.dark : b.light;
}

// Frucht-Ton für bedeutungstragende FLÄCHEN (Balken-Füllung) — trägt WCAG 1.4.11 (3:1).
// Im Dunkelmodus ist `dark` bereits stark genug (4.83:1 / 4.33:1), darum nur hell ein
// eigener Ton. Ohne `lightDeep` fällt der Bereich auf `light` zurück und verfehlt 1.4.11
// still — deshalb der Hinweis im Dev-Build statt eines stummen Durchfallens.
export function bereichFillColor(key, isDark) {
  const b = BY_KEY[key];
  if (!b) return null;
  if (isDark) return b.dark;
  // Hinweis nur im Dev-Build: `import.meta.env.DEV` ist im Produktions-Build `false`,
  // der ganze Zweig fällt beim Bündeln weg — kein Byte im Budget (es steht bei ~65 kB
  // von 65 kB). Der Wächter, der wirklich zählt, ist der Test:
  // `data/__tests__/lebensbereiche.contrast.test.js` rechnet die Kontraste nach.
  if (import.meta.env.DEV && !b.lightDeep) {
    console.warn(`[lebensbereiche] "${key}": kein lightDeep → Füllung verfehlt WCAG 1.4.11 (hell).`);
  }
  return b.lightDeep || b.light;
}

// Ast-Farbe direkt zu einem Kapitel (Bequemlichkeit für die Dashboard-Karten).
export function chapterColor(chapterKey, isDark) {
  const b = BY_CHAPTER[chapterKey];
  if (!b) return null;
  return isDark ? b.dark : b.light;
}
