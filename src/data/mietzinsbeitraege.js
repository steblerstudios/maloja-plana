// Mietzinsbeiträge (individuelle, bedarfsabhängige Wohnkostenzuschüsse) — kantonal/
// kommunal sehr fragmentiert. Anders als die IPV (bundesrechtlich in allen Kantonen)
// gibt es Mietzinsbeiträge nur in einzelnen Kantonen — und oft auf Gemeinde-Ebene.
//
// Drei Zustände (würdevoll, keine Falschaussage):
//   'has'   — Kanton hat ein bestätigtes, einkommensabhängiges Programm → affirmativ + Link
//   'none'  — bestätigt KEINES (auch keine Gemeinde) → ausgegraut „gibt's hier nicht"
//   'check' — variiert / unbekannt (Gemeinden können eigene haben) → ruhig „prüf bei Gemeinde/Kanton"
//
// Konservativ: nur solide belegte Programme sind 'has'; alles andere 'check' (nie ein
// falsches „none"). Die Programm-Parameter (Stand 2025) sind RICHTWERTE für eine erste
// Einschätzung — verbindlich ist immer die kantonale bzw. kommunale Stelle. Die Werte
// ändern jährlich → bei Pflege gegen die Quellen unten prüfen.
import { ergebnis, fehlendeAngaben, ERGEBNIS_ART } from './ergebnisArt.js';

export const MIETZINS_OVERVIEW_URL = 'https://www.bwo.admin.ch/de/kantonale-hilfen';

// Datenstand der Programm-Parameter (für künftige Pflege sichtbar).
export const MIETZINS_DATA_VERSION = '2025';

// Bestätigte einkommensabhängige Mietzinsbeitrags-Programme mit recherchierten Eckwerten.
// Felder:
//   group        'all' | 'families'  — Zielgruppe (manche Kantone nur Familien mit Kind)
//   incomeLimit  Jahres-Einkommens-Richtgrenze in CHF (null = mietabhängiges barème, keine Einzelgrenze)
//   incomePerChild / incomePerAdult  Zuschläge zur Grenze (sofern bekannt)
//   residencyYears  Mindest-Wohnsitz im Kanton
//   assetLimit   Reinvermögens-Grenze in CHF (sofern bekannt)
//   noteKey      i18n-Schlüssel für die kantonsspezifische Besonderheit
//   url          offizielle kantonale Quelle  ·  stand  Datenstand
const PROGRAMS = {
  // Basel-Stadt — Mietbeiträge. Seit 1.7.2025 auch Einzel-/Paarhaushalte (vorher nur Familien).
  // Einkommensgrenze ~50'000 (Einzel/Paar, Familien höher); Mietzinslimiten nach Zimmerzahl;
  // Beitrag 50–1'060 CHF/Monat; min. 2 Jahre Wohnsitz. Quelle: bs.ch (Amt für Sozialbeiträge).
  BS: { state: 'has', group: 'all', incomeLimit: 50000, residencyYears: 2, benefitMaxMonth: 1060,
        noteKey: 'mietzinsView.cantonNote_BS', stand: '2025',
        url: 'https://www.bs.ch/themen/finanzielle-hilfe/leistungen/mietbeitraege' },
  // Basel-Landschaft — Mietzinsbeiträge, nur Haushalte mit mind. 1 Kind. Netto-Jahreseinkommen
  // ~40–75k (Paare) bzw. ~30–60k (Alleinerziehende); min. 2 Jahre Wohnsitz; Gemeinden zahlen aus.
  // Quelle: baselland.ch (Sozialamt), Mietzinsbeitragsgesetz.
  // ⟨25.09.2026, Fachprüfung⟩ KEINE feste Grenze mehr: nach § 6 MBG wird die Grenze je Haushalt
  // berechnet (Lebensbedarf, KVG-Prämie, Miete, Kinderbetreuung), die Gemeinden setzen sie per
  // Reglement fest (§ 10). Die frühere Pauschale 75'000 schätzte in beide Richtungen falsch.
  // limitArt 'gemeinde' → Orientierung mit Verweis auf die Wohngemeinde statt Grenzvergleich.
  BL: { state: 'has', group: 'families', incomeLimit: null, limitArt: 'gemeinde', residencyYears: 2,
        noteKey: 'mietzinsView.cantonNote_BL', stand: '2025',
        url: 'https://www.baselland.ch/politik-und-behorden/direktionen/finanz-und-kirchendirektion/sozialamt/mietzinsbeitraege' },
  // Genf — Allocation de logement. Anspruch über „taux d'effort" (Mietbelastung 24.7–29.9% je
  // Zimmer/Personen), Eintritts-barème mietabhängig (keine einzelne Grenze); 2 von 5 Jahren
  // Wohnsitz; max. 1'400 CHF/Zimmer, höchstens halbe Miete. Quelle: ge.ch.
  GE: { state: 'has', group: 'all', incomeLimit: null, residencyYears: 2, benefitMaxRoom: 1400,
        noteKey: 'mietzinsView.cantonNote_GE', stand: '2024',
        url: 'https://www.ge.ch/allocation-logement/allocation-logement-conditions-obligations' },
  // Zug — Mietzinszuschüsse (WFG). Einkommen nach dir. Bundessteuer ≤ 60'000 (+2'500/Kind;
  // die Basisgrenze gilt für ZWEI Erwachsene, erst ab der 3. erwachsenen Person +20'000 je
  // weitere — siehe mietzinsIncomeLimit `adults - 2`, belegt durch das ZG-Merkblatt
  // Mietzinsbeiträge Sept. 2025: „Für mehr als zwei erwachsene Personen erhöht sich die
  // Einkommensgrenze um CHF 20'000 je weitere Person."); Reinvermögen ≤ 144'000; Wohnung
  // max. 2 Zimmer mehr als Personen; min. 3 Jahre Wohnsitz/Arbeit; an Vermieter. Quelle: zg.ch.
  // einkommensBasis 'steuerbar': ZG vergleicht das steuerbare Einkommen (neuste definitive Veranlagung),
  // die App den Nettolohn — der liegt meist höher. Über der Grenze sagt die Ansicht das dazu.
  ZG: { state: 'has', group: 'all', incomeLimit: 60000, einkommensBasis: 'steuerbar', incomePerChild: 2500, incomePerAdult: 20000,
        residencyYears: 3, assetLimit: 144000,
        noteKey: 'mietzinsView.cantonNote_ZG', stand: '2025',
        url: 'https://zg.ch/de/soziales/wohnungswesen/foerderinstrumente/fuer-privatpersonen' },
};

// Liefert Verfügbarkeit + Eckwerte für einen Kanton (Fallback: 'check' ohne Programm-Daten).
export function getMietzinsbeitraege(canton) {
  const p = PROGRAMS[canton];
  if (p) return { ...p, canton };
  return { state: 'check', url: MIETZINS_OVERVIEW_URL, canton };
}

// Einkommens-Richtgrenze inkl. Haushalts-Zuschläge (sofern der Kanton solche kennt).
// Gibt null zurück, wenn der Kanton keine einzelne Grenze hat (z.B. GE: mietabhängiges barème).
export function mietzinsIncomeLimit(program, householdSize = 1, childrenCount = 0) {
  if (!program || program.incomeLimit == null) return null;
  let limit = program.incomeLimit;
  if (program.incomePerChild) limit += program.incomePerChild * childrenCount;
  if (program.incomePerAdult) {
    // ZG-Regel: Basisgrenze gilt für zwei Erwachsene, Zuschlag erst ab der 3. Person
    // („Für mehr als zwei erwachsene Personen … +20'000 je weitere Person", ZG-Merkblatt).
    const adults = Math.max(1, householdSize - childrenCount);
    limit += program.incomePerAdult * Math.max(0, adults - 2);
  }
  return limit;
}

// O3 — Ergebnis-Art des Mietzins-Schnellchecks (MietzinsOrientierung.jsx).
// Die Einschätzung selbst bleibt in der Ansicht; hier wird nur aus IHREM Ergebnis (dem Schlüssel)
// die Art abgeleitet, damit es für die Einschätzung weiter genau eine Quelle gibt.
//
//   VORPRÜFUNG   Vergleich des Jahreseinkommens mit einer Richtgrenze (MIETZINS_DATA_VERSION) —
//                sagt, ob sich ein Antrag lohnen könnte, nie einen Betrag.
//   ORIENTIERUNG 'effortBased' (GE) / 'municipalLimit' (BL): keine feste Grenze, also wird nichts geprüft.
//   null         Kanton ohne bestätigtes Programm ('none'/'check'): keine Prüfung, keine Art.
// Ohne Kanton ist offen, ob es ein Programm gibt — die Vorprüfung wartet auf den Kanton und,
// falls es fehlt, aufs Einkommen.
export function mietzinsErgebnis({ info, assessmentKey, annualIncome = 0 }) {
  if (!info) {
    return ergebnis(ERGEBNIS_ART.VORPRUEFUNG, { fehlend: fehlendeAngaben({ kanton: false, einkommen: annualIncome > 0 }) });
  }
  if (info.state !== 'has' || !assessmentKey) return null;
  if (assessmentKey === 'effortBased' || assessmentKey === 'municipalLimit') return ergebnis(ERGEBNIS_ART.ORIENTIERUNG);
  if (assessmentKey === 'needIncome') return ergebnis(ERGEBNIS_ART.VORPRUEFUNG, { fehlend: ['einkommen'] });
  return ergebnis(ERGEBNIS_ART.VORPRUEFUNG);
}
