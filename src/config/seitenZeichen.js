// ─── Seiten-Zeichen — welches Icon jede Seite trägt, und warum ─────────────
//
// Icon-Plan November 2026, Bauplan Schritt B1. Grundlage: Entscheidungsblatt
// docs/design/icon-besprechung-2026-11.md (Zweig docs/icon-plan, Stand 07.11.2026) und
// docs/design/seiten-architektur-2026-11.md (Kapitel und Ast jeder Seite).
//
// Das System in einem Satz: **Leitform = das Kapitel (bzw. der Ast), Zeichen im Abzeichen =
// was passiert, Farbe des Abzeichens = wer mitspielt** (ein anderer Ast, oder Geld = gold).
// Spielt niemand mit, ist das Abzeichen «leer» (helle Scheibe, Ring in der Farbe der Form).
//
// Was hier NICHT steht, sondern abgeleitet wird (eine Quelle je Wahrheit):
//   · Kapitel und Ast einer Seite  → Feld `bereich` in config/ansichtenRegister.js bzw.
//                                     data/werkzeugRegister.js, Kapitel über astKapitel()
//   · alle Farben                  → data/lebensbereiche.js
//
// Seit Bauplan B4 (08.11.2026) zeichnen alle sieben Kapitel nach dieser Tabelle (IconAbzeichen.jsx,
// über ansichtIkon()). Der Wächter __tests__/seitenZeichen.test.js hält sie vollständig und widerspruchsfrei.

import { astKapitel, getBereich, getBereichForChapter } from '../data/lebensbereiche.js';

// Leitform je Kapitel; Äste mit eigener gezeichneter Variante stehen in LEITFORM_AST.
export const LEITFORM_KAPITEL = {
  basis: 'ausweiskarte',
  wohnen: 'chalet',
  finanzen: 'fuenfliber',
  versicherungen: 'edelweissSchild',
  ausbildung: 'schulhut',
  behoerden: 'helvetia',
  notfall: 'arztkoffer', // Kapitel «Gesundheit», Schlüssel bleibt `notfall`
};
export const LEITFORM_AST = {
  person: 'ausweiskarte', // eine Person
  familie: 'ausweiskarteZwei', // zwei Personen
  bildung: 'schulhut',
  arbeit: 'helm',
};

// Das Wörterbuch der Zeichen im Abzeichen: jedes Zeichen genau eine Bedeutung.
export const ZEICHEN = {
  plus: 'kommt dazu / ergänzt',
  minus: 'geht weg / Schuld',
  pfeilHinaus: 'geht hinaus (Umzug)',
  pfeilHerein: 'kommt herein (Geld, das man zugut hat)',
  wechselpfeile: 'wechseln / abgleichen',
  kreuzchen: 'endet (gekündigt, verloren)',
  ausrufezeichen: 'es ist etwas passiert / mahnt',
  haken: 'geschafft / gedeckt',
  sanduhr: 'Frist läuft',
  uhr: 'pro Stunde (generische Uhr; Label «Uhr»)',
  blitz: 'selbständig',
  blatt: 'Schriftstück',
  blattHerz: 'Patientenverfügung',
  balken: 'Übersicht in Zahlen',
  prozent: 'Steuer',
  schere: 'vom Lohn abgezogen (Quellensteuer)',
  schirm: 'Schutz',
  waage: 'Recht / Grenze',
  karteChip: 'Zahlkarte',
  karteMitPerson: 'Ausweis',
  kartePlus: 'Bürgerrecht kommt dazu',
  schloss: 'gesichert',
  zahl18: 'volljährig',
  ringe: 'Heirat',
  herz: 'Liebe / Organ',
  herzRiss: 'Trennung',
  herzPuls: 'Notfall',
  kerze: 'Abschied',
  berg: 'Pensionierung',
  saeulen: 'drei Säulen',
  lenkrad: 'Fahren',
  gradabzeichen: 'Dienst',
  pflegebett: 'Pflege',
  hoerer: 'anrufen',
  handy: 'das Telefon (Gerät)',
  fuenfliber: 'Geld fliesst (der echte Fünfliber im Kleinen)',
  miniHelm: 'Arbeit spielt mit (Mini-Leitform)',
  miniSchild: 'Versicherung spielt mit (Mini-Leitform mit Edelweiss)',
};

// Wer mitspielt: ein Ast-Schlüssel aus lebensbereiche.js, 'geld' (gold) oder null (leer).
export const GELD = 'geld';

// Jede Seite mit Ast (`bereich`) in den zwei Registern (Schlüssel `key`, sonst `view`). zeichen: null nur für eine Seite,
// die selbst das Bild ihres Kapitels ist (Arztkoffer).
export const SEITEN_ZEICHEN = {
  // ── Persönliche Basis · Ast Person ──
  volljaehrig: { zeichen: 'zahl18', mit: null },
  digitaleordnung: { zeichen: 'schloss', mit: null },
  // ── Persönliche Basis · Ast Familie ──
  kind: { zeichen: 'plus', mit: 'familie' },
  adoption: { zeichen: 'plus', mit: 'familie' },
  heirat: { zeichen: 'ringe', mit: 'familie' },
  trennung: { zeichen: 'herzRiss', mit: 'familie' },
  todesfall: { zeichen: 'kerze', mit: 'familie' },
  eo: { zeichen: 'fuenfliber', mit: GELD },
  // ── Wohnen ──
  umzug: { zeichen: 'pfeilHinaus', mit: null },
  wohnunggekuendigt: { zeichen: 'kreuzchen', mit: null },
  zusammenziehen: { zeichen: 'herz', mit: 'familie' },
  mietzins: { zeichen: 'fuenfliber', mit: GELD },
  // ── Finanzen ──
  finanzuebersicht: { zeichen: 'balken', mit: null },
  sync: { zeichen: 'wechselpfeile', mit: null },
  kreditkarte: { zeichen: 'karteChip', mit: null },
  tax: { zeichen: 'prozent', mit: 'behoerden' },
  quellensteuer: { zeichen: 'schere', mit: 'behoerden' },
  schulden: { zeichen: 'minus', mit: null },
  mahnung: { zeichen: 'ausrufezeichen', mit: null },
  betreibung: { zeichen: 'minus', mit: 'behoerden' },
  sozialhilfe: { zeichen: 'schirm', mit: 'behoerden' },
  selbstmahnen: { zeichen: 'pfeilHerein', mit: null },
  mindestlohn: { zeichen: 'waage', mit: 'arbeit' }, // Abschnitt der Kapitelseite Finanzen (Schlüssel, nicht Ansicht)
  // ── Versicherungen & Vorsorge · Ast Versicherungen ──
  kkerst: { zeichen: 'plus', mit: 'gesundheit' },
  kvgwechsel: { zeichen: 'wechselpfeile', mit: 'gesundheit' },
  praemien: { zeichen: 'balken', mit: 'gesundheit' },
  premium: { zeichen: 'fuenfliber', mit: GELD }, // IPV
  // ── Versicherungen & Vorsorge · Ast Vorsorge ──
  vorsorge: { zeichen: 'balken', mit: 'vorsorge' }, // Vorsorge-Rechner
  pensionierung: { zeichen: 'berg', mit: 'vorsorge' },
  ergaenzungsleistungen: { zeichen: 'plus', mit: GELD },
  // ── Ausbildung & Arbeit · Ast Bildung ──
  stipendien: { zeichen: 'fuenfliber', mit: GELD },
  lehre: { zeichen: 'miniHelm', mit: 'arbeit' },
  // ── Ausbildung & Arbeit · Ast Arbeit (Abzeichen leer: der Helm sagt schon «Arbeit», Entscheid C 06.11.) ──
  neuerjob: { zeichen: 'plus', mit: null },
  stelleverloren: { zeichen: 'kreuzchen', mit: null },
  aussteuerung: { zeichen: 'sanduhr', mit: null },
  selbstaendigkeit: { zeichen: 'blitz', mit: null },
  cv: { zeichen: 'blatt', mit: null },
  alv: { zeichen: 'fuenfliber', mit: GELD },
  stundenlohn: { zeichen: 'uhr', mit: GELD },
  // ── Behörden ──
  zuzug: { zeichen: 'plus', mit: 'wohnen' },
  bewilligung: { zeichen: 'blatt', mit: null },
  einbuergerung: { zeichen: 'kartePlus', mit: 'person' },
  asyl: { zeichen: 'schirm', mit: null },
  wegzug: { zeichen: 'minus', mit: 'wohnen' },
  ausweis: { zeichen: 'karteMitPerson', mit: 'person' },
  fuehrerausweis: { zeichen: 'lenkrad', mit: null },
  dienst: { zeichen: 'gradabzeichen', mit: 'person' },
  betreibungsauszug: { zeichen: 'blatt', mit: 'finanzen' },
  // ── Gesundheit · Ast Gesundheit ──
  gesundheit: { zeichen: null, mit: null }, // Arztkoffer: die Seite ist das Kapitel-Bild
  kvg: { zeichen: 'haken', mit: 'versicherungen' },
  kk: { zeichen: 'blatt', mit: 'versicherungen' }, // KK-Belege
  unfallkrankheit: { zeichen: 'ausrufezeichen', mit: 'versicherungen' },
  iv: { zeichen: 'miniSchild', mit: 'versicherungen' },
  pflege: { zeichen: 'pflegebett', mit: 'familie' },
  // ── Gesundheit · Ast Notfall (Rot = im Ernstfall gebraucht, Violett = für später festgelegt) ──
  notfalleinstieg: { zeichen: 'herzPuls', mit: 'notfall' },
  notfallkarte: { zeichen: 'hoerer', mit: 'notfall' },
  notfallpass: { zeichen: 'handy', mit: 'notfall' },
  patientenverfuegung: { zeichen: 'blattHerz', mit: 'notfall' },
  vorsorgeauftrag: { zeichen: 'blatt', mit: 'vorsorge' },
  organ: { zeichen: 'herz', mit: 'notfall' },
  bestattung: { zeichen: 'kerze', mit: 'vorsorge' },
};

// Bewusst gleich aussehende Seiten im selben Kapitel-Menü — nur mit Entscheid und Grund.
export const GEWOLLTE_ZWILLINGE = [
  { seiten: ['kind', 'adoption'], grund: 'Entscheid 06.11.2026: «Adoption = Plus, gleich wie Kind — ein Kind kommt dazu»' },
];

// ─── Ableitungen ──────────────────────────────────────────────────────────

// Leitform einer Seite aus ihrem Ast (`bereich` im Register).
export const leitformFuer = (bereich) => LEITFORM_AST[bereich] || LEITFORM_KAPITEL[astKapitel(bereich)] || null;

// Farbe des Abzeichens: { art: 'voll' | 'leer', farbe }. Leer = Ring in der Farbe der Form (Kapitel).
export const abzeichenFarbe = (bereich, mit, isDark = false) => {
  const kapitel = astKapitel(bereich);
  if (!mit) {
    const form = getBereichForChapter(kapitel);
    return { art: 'leer', farbe: form ? (isDark ? form.dark : form.light) : null };
  }
  const ast = getBereich(mit === GELD ? 'finanzen' : mit);
  return { art: 'voll', farbe: ast ? (isDark ? ast.dark : ast.light) : null };
};

// Alles, was das Abzeichen-Bauteil (IconAbzeichen.jsx, Bauplan B3) für eine Seite braucht.
// `bereich` kommt vom Aufrufer aus dem Register (eine Quelle).
export const seitenBild = (view, bereich, isDark = false) => {
  const e = SEITEN_ZEICHEN[view];
  if (!e || !bereich) return null;
  const f = abzeichenFarbe(bereich, e.mit, isDark);
  const form = getBereichForChapter(astKapitel(bereich));
  return {
    leitform: leitformFuer(bereich), zeichen: e.zeichen, art: f.art, farbe: f.farbe,
    formFarbe: form ? (isDark ? form.dark : form.light) : null,
  };
};

// Wie seitenBild, aber die Farben als CSS-Variablen `--mp-ast-<Ast>` (gesetzt in main.jsx aus
// lebensbereiche.js, je nach hell/dunkel) — mit der hellen Farbe als Rückfall (Bauplan B4).
export const astVariable = (key) => {
  const b = getBereich(key);
  return b ? `var(--mp-ast-${key}, ${b.light})` : null;
};
export const seitenBildVariabel = (view, bereich) => {
  const e = SEITEN_ZEICHEN[view];
  if (!e || !bereich) return null;
  const form = getBereichForChapter(astKapitel(bereich));
  const formVar = form ? astVariable(form.key) : null;
  return {
    leitform: leitformFuer(bereich), zeichen: e.zeichen, art: e.mit ? 'voll' : 'leer',
    farbe: e.mit ? astVariable(e.mit === GELD ? 'finanzen' : e.mit) : formVar,
    formFarbe: formVar,
  };
};
