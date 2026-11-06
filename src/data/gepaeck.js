// Mein Gepäck — reine Registry für die Rucksack-Ansicht der Lebensereignisse.
// Jeder Lebensbereich ist ein echtes Ausrüstungsstück (Schlüsselbund, Arztkoffer …);
// darin liegen die Wege (Ereignisse), die je in einen bestehenden geführten Ablauf
// führen. Bewusst datenfrei und deterministisch: nur Struktur + Glyphen (SVG-Pfade),
// keine React-Abhängigkeit, damit testbar. Der Baum und der Obstgarten bleiben
// unberührt — das Gepäck ist eine eigene, zusätzliche Ansicht.
import { hausarztName } from '../utils/hausarzt.js';

// Glyph = Liste von SVG-path-`d`-Strings, gezeichnet als ruhige Outline (stroke).
// viewBox aller Weg-Glyphen ist 0 0 24 24.
export const GEGENSTAENDE = [
  {
    key: 'wohnen', ill: 'key',
    wege: [
      { key: 'digitaleordnung', view: 'digitaleordnung', icon: 'ereignisDigitaleordnung' },
      { key: 'betreibungsauszug', view: 'betreibungsauszug', icon: 'ereignisBetreibungsauszug' },
      { key: 'ausweis', view: 'ausweis', icon: 'ereignisAusweis' },
      { key: 'wegzug', view: 'wegzug', icon: 'ereignisWegzug' },
      { key: 'einbuergerung', view: 'einbuergerung', icon: 'ereignisEinbuergerung' },
      { key: 'wohnunggekuendigt', view: 'wohnunggekuendigt', icon: 'ereignisWohnunggekuendigt' },
      { key: 'umzug', view: 'umzug', icon: 'ereignisUmzug' },
      { key: 'neuch', view: 'zuzug', icon: 'ereignisNeuch' },
      { key: 'bewilligung', view: 'bewilligung', icon: 'ereignisBewilligung' },
      { key: 'mietzins', view: 'mietzins', icon: 'ereignisMietzins' },
      { key: 'fuehrerausweis', view: 'fuehrerausweis', icon: 'ereignisFuehrerausweis' },
      { key: 'asyl', view: 'asyl', icon: 'ereignisAsyl' },
    ],
  },
  {
    key: 'arbeit', ill: 'toolroll',
    wege: [
      // Gruppe «Erwachsen werden» (F7-A9, Entscheid Stebler Studios 27.10.2026): 18 werden, Militär- oder
      // Zivildienst, Lehre — zusammen und zuoberst in der Werkzeugrolle. «18 werden» lag vorher in der
      // Erinnerungskiste; hier steht es bei den zwei Wegen, die meist im selben Alter kommen.
      { gruppe: 'erwachsen', key: 'volljaehrig', view: 'volljaehrig', icon: 'ereignisVolljaehrig' },
      { gruppe: 'erwachsen', key: 'dienst', view: 'dienst', icon: 'ereignisDienst' },
      { gruppe: 'erwachsen', key: 'lehre', view: 'lehre', icon: 'ereignisLehre' },
      // F7-L11: «Ausgesteuert» ist seit Gruppe F ein Teil von «Stelle verloren» (Umleitung) — kein eigener Weg mehr.
      { key: 'quellensteuer', view: 'quellensteuer', icon: 'ereignisQuellensteuer' },
      { key: 'job', view: 'neuerjob', icon: 'ereignisJob' },
      { key: 'stelleweg', view: 'stelleverloren', icon: 'ereignisStelleweg' },
      { key: 'selbst', view: 'selbstaendigkeit', icon: 'ereignisSelbst' },
      { key: 'stipendien', view: 'stipendien', icon: 'ereignisStipendien' },
    ],
  },
  {
    key: 'familie', ill: 'box',
    wege: [
      { key: 'adoption', view: 'adoption', icon: 'ereignisAdoption' },
      { key: 'zusammenziehen', view: 'zusammenziehen', icon: 'ereignisZusammenziehen' },
      { key: 'heirat', view: 'heirat', icon: 'ereignisHeirat' },
      { key: 'geburt', view: 'kind', icon: 'ereignisGeburt' },
      { key: 'trennung', view: 'trennung', icon: 'ereignisTrennung' },
    ],
  },
  {
    key: 'gesundheit', ill: 'doctorbag',
    wege: [
      { key: 'unfall', view: 'unfallkrankheit', icon: 'ereignisUnfall' },
      { key: 'kkwechsel', view: 'kvgwechsel', icon: 'ereignisKkwechsel' },
      { key: 'kkerst', view: 'kkerst', icon: 'ereignisKkerst' },
      // «Zusatzversicherung wechseln» ist seit F7-A5 (27.10.2026) der Weg «Zusatz» in «Krankenkasse wechseln».
      { key: 'iv', view: 'iv', icon: 'ereignisIv' },
    ],
  },
  {
    key: 'alter', ill: 'flask',
    wege: [
      { key: 'ergaenzungsleistungen', view: 'ergaenzungsleistungen', icon: 'ereignisErgaenzungsleistungen' },
      { key: 'vorsorgeauftrag', view: 'vorsorgeauftrag', icon: 'ereignisVorsorgeauftrag' },
      { key: 'pension', view: 'pensionierung', icon: 'ereignisPension' },
      { key: 'pflege', view: 'pflege', icon: 'ereignisPflege' },
    ],
  },
  {
    key: 'abschied', ill: 'letter',
    wege: [
      { key: 'todesfall', view: 'todesfall', icon: 'ereignisTodesfall' },
      { key: 'bestattung', view: 'bestattung', icon: 'ereignisBestattung' },
      { key: 'organ', view: 'organ', icon: 'ereignisOrgan' },
    ],
  },
  // Portemonnaie (Entscheid 25.09.2026): trägt die Geld-Werkzeuge aus
  // data/werkzeugRegister.js (`fach: 'geld'`) und — Entscheid 27.09.2026 — die Wege
  // «Mahnung erhalten» und «Betreibung erhalten» (vorher Werkzeugrolle).
  { key: 'geld', ill: 'wallet', wege: [
      { key: 'mahnung', view: 'mahnung', icon: 'ereignisMahnung' },
      { key: 'betreibung', view: 'betreibung', icon: 'ereignisBetreibung' },
      // F7-A10 (27.10.2026): eigener Weg, vorher Schritt 6 von «Mahnung erhalten».
      { key: 'selbstmahnen', view: 'selbstmahnen', icon: 'ereignisSelbstmahnen' },
    ],
  },
];

// Gruppen innerhalb eines Gegenstands (`gruppe` am Weg): Name i18n `gepaeck.gruppe.<key>`.
export const GRUPPEN = ['erwachsen'];

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
  gesundheit: (d) => [d?.versicherungen?.kkInsurer, d?.versicherungen?.franchise, d?.versicherungen?.kkPremium, hausarztName(d?.notfall)],
  alter: (d) => [d?.versicherungen?.bvgInsurer, d?.finanzen?.pension3a, d?.versicherungen?.bvgBalance, d?.vorsorge?.ikAuszug],
  abschied: (d) => [d?.behoerden?.willMade, d?.notfall?.patientenverfuegung, d?.notfall?.vorsorgeauftrag, d?.notfall?.organDonor === 'undecided' ? '' : d?.notfall?.organDonor],
  // Steuern, Haushaltsbudget, Sparziel, Bankverbindung — was die Geld-Werkzeuge lesen.
  geld: (d) => [d?.finanzen?.monthlyTax, d?.finanzen?.groceries, d?.finanzen?.savingsGoal, d?.finanzen?.bankName],
};

// { done, total } — done = erfüllte echte Felder, total = geprüfte Felder.
export const gegenstandReadiness = (gegenstandKey, data) => {
  const fn = CHECKS[gegenstandKey];
  if (!fn) return { done: 0, total: 0 };
  const vals = fn(data || {});
  return { done: vals.filter(filled).length, total: vals.length };
};

// ── Versiegelter Brief im Dunkelmodus (27.09.2026) ──────────────────────────
// Vorher: Papier = palette.surface (Kartenfläche) → Brief-Form 1,0 : 1, Rand 1,13 : 1,
// Siegel 2,86 : 1. Jetzt eigene Töne, WCAG 1.4.11 (≥ 3 : 1) — gehalten von
// gepaeckBriefKontrast.test.js. Helligkeit wie die übrigen Dunkel-Töne (Papier ≈ Stahl
// der Feldflasche, Luminanz ~0,28; polygrafin 27.09.: #B9B2A5 war ein heller Fleck),
// darum ein dunkles Siegel, das sich vom Papier abhebt, auf dem es sitzt.
export const BRIEF_DUNKEL = { papier: '#958F84', rand: '#A8A296', siegel: '#62302A' };
