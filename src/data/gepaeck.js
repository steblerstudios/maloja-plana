// Mein Gepäck — reine Registry für die Rucksack-Ansicht der Lebensereignisse.
// Jeder Lebensbereich ist ein echtes Ausrüstungsstück (Schlüsselbund, Arztkoffer …);
// darin liegen die Wege (Ereignisse), die je in einen bestehenden geführten Ablauf
// führen. Bewusst datenfrei und deterministisch: nur Struktur + Glyphen (SVG-Pfade),
// keine React-Abhängigkeit, damit testbar. Der Baum und der Obstgarten bleiben
// unberührt — das Gepäck ist eine eigene, zusätzliche Ansicht.

// Glyph = Liste von SVG-path-`d`-Strings, gezeichnet als ruhige Outline (stroke).
// viewBox aller Weg-Glyphen ist 0 0 24 24.
export const GEGENSTAENDE = [
  {
    key: 'wohnen', ill: 'key',
    wege: [
      { key: 'umzug', view: 'umzug', g: ['M3 12l9-8 9 8', 'M5 10v10h14V10', 'M10 20v-6h4v6'] },
      { key: 'neuch', view: 'situationen', g: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18', 'M3 12h18', 'M12 3c3 3 3 15 0 18', 'M12 3c-3 3-3 15 0 18'] },
      { key: 'bewilligung', view: 'bewilligung', g: ['M3 5h18v14H3z', 'M8 11a2 2 0 1 0 0-.01', 'M13 9h5', 'M13 13h5'] },
      { key: 'mietzins', view: 'mietzins', g: ['M4 10l8-6 8 6', 'M6 9v10h12V9', 'M12 12.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4'] },
    ],
  },
  {
    key: 'arbeit', ill: 'toolroll',
    wege: [
      { key: 'job', view: 'neuerjob', g: ['M3 7h18v13H3z', 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 'M3 12h18'] },
      { key: 'stelleweg', view: 'stelleverloren', g: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18', 'M12 7v5l3 2'] },
      { key: 'selbst', view: 'selbstaendigkeit', g: ['M13 3L4 14h6l-1 7 9-11h-6z'] },
      { key: 'stipendien', view: 'stipendien', g: ['M3 8l9-4 9 4-9 4z', 'M7 11v4c0 1.2 2.2 2 5 2s5-.8 5-2v-4', 'M21 8v4.5'] },
    ],
  },
  {
    key: 'familie', ill: 'box',
    wege: [
      { key: 'heirat', view: 'heirat', g: ['M7 15a5 5 0 1 0 10 0 5 5 0 0 0-10 0', 'M9.5 8.5l2.5-3 2.5 3-2.5 2.5z'] },
      { key: 'geburt', view: 'kind', g: ['M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10', 'M12 13v7', 'M9.5 20h5'] },
      { key: 'trennung', view: 'trennung', g: ['M12 3v7', 'M8 21l4-11 4 11', 'M5 21h6', 'M13 21h6'] },
    ],
  },
  {
    key: 'gesundheit', ill: 'doctorbag',
    wege: [
      { key: 'unfall', view: 'unfallkrankheit', g: ['M12 5v14', 'M5 12h14'] },
      { key: 'kkwechsel', view: 'kvgwechsel', g: ['M4 12a8 8 0 0 1 13-6l3 3', 'M20 12a8 8 0 0 1-13 6l-3-3', 'M20 3v6h-6', 'M4 21v-6h6'] },
      { key: 'kkerst', view: 'kkerst', g: ['M12 3l7 3v5c0 4-3 7-7 9-4-2-7-5-7-9V6z', 'M12 8.5v5', 'M9.5 11h5'] },
      { key: 'iv', view: 'iv', g: ['M12 4.5a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8', 'M12 8v5h4.5', 'M8 11l4 1.2', 'M10 13a3.8 3.8 0 1 0 5.4 3.4'] },
    ],
  },
  {
    key: 'alter', ill: 'flask',
    wege: [
      { key: 'pension', view: 'pensionierung', g: ['M3 20l6-14 4 8 3-5 5 11z'] },
      { key: 'pflege', view: 'pflege', g: ['M12 19c3-2 6-5 6-8a3 3 0 0 0-6-1 3 3 0 0 0-6 1c0 3 3 6 6 8z', 'M12 19v2'] },
    ],
  },
  {
    key: 'abschied', ill: 'letter',
    wege: [
      { key: 'todesfall', view: 'todesfall', g: ['M3 6h18v12H3z', 'M3 7l9 6 9-6'] },
      { key: 'organ', view: 'organ', g: ['M12 20c4-2.6 7-6 7-9.5A3.7 3.7 0 0 0 12 8a3.7 3.7 0 0 0-7 2.5C5 14 8 17.4 12 20z', 'M12 11v4', 'M10 13h4'] },
    ],
  },
];

// Flache Liste aller Wege — für Tests und einfache Iteration.
export const alleWege = () => GEGENSTAENDE.flatMap((g) => g.wege.map((w) => ({ ...w, gegenstand: g.key })));

// Anzahl Wege je Gegenstand (echte Zahl, kein erfundener Fortschritt).
export const wegeCount = (gegenstandKey) => {
  const g = GEGENSTAENDE.find((x) => x.key === gegenstandKey);
  return g ? g.wege.length : 0;
};

// ── Reife-Pünktchen: EHRLICH aus den erfassten Daten ────────────────────────
// Kein erfundener Fortschritt: die Pünktchen zählen, wie viele echte Felder aus
// dem passenden Lebensbereich schon ausgefüllt sind. Leer = noch nichts gepackt.
// Ja/Nein-Felder zählen nur bei 'yes'; leere Strings, '0', 'no', 'none' gelten als
// ungepackt. Absichtlich pro GEGENSTAND (dort liegen echte Daten), nicht pro Weg.
const filled = (v) => {
  if (v == null) return false;
  if (Array.isArray(v)) return v.length > 0;
  const s = String(v).trim().toLowerCase();
  return s !== '' && s !== 'no' && s !== 'none' && s !== '0';
};

const CHECKS = {
  wohnen: (d) => [d?.wohnen?.address, d?.wohnen?.city || d?.wohnen?.postalCode, d?.wohnen?.rentAmount, d?.basis?.canton],
  arbeit: (d) => [d?.finanzen?.employer, d?.finanzen?.monthlyIncome, d?.finanzen?.employmentType, d?.ausbildung?.jobTitle],
  familie: (d) => [d?.basis?.maritalStatus, d?.basis?.household?.children, d?.finanzen?.familienzulagen, d?.finanzen?.alimenteReceived || d?.finanzen?.alimentePaid],
  gesundheit: (d) => [d?.versicherungen?.kkInsurer, d?.versicherungen?.franchise, d?.versicherungen?.kkPremium, d?.notfall?.doctor],
  alter: (d) => [d?.versicherungen?.bvgInsurer, d?.finanzen?.pension3a, d?.versicherungen?.bvgBalance, d?.vorsorge?.ikAuszug],
  abschied: (d) => [d?.behoerden?.willMade, d?.notfall?.patientenverfuegung, d?.notfall?.vorsorgeauftrag, d?.notfall?.organDonor],
};

// { done, total } — done = erfüllte echte Felder, total = geprüfte Felder.
export const gegenstandReadiness = (gegenstandKey, data) => {
  const fn = CHECKS[gegenstandKey];
  if (!fn) return { done: 0, total: 0 };
  const vals = fn(data || {});
  return { done: vals.filter(filled).length, total: vals.length };
};
