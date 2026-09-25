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
// ⟨25.09.2026⟩ alle vier Programme gegen die Quellen 2026 geprüft (swiss-precision, Werte + Wortlaut im PR #388).
export const MIETZINS_DATA_VERSION = '2026';

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
  // ⟨25.09.2026, Quellenprüfung⟩ Keine Pauschale: die Grenze ist je Haushalt eindeutig berechenbar,
  // Merkblatt Mietbeiträge 01.2026 Ziff. 13 — Faktor 0, wenn das massgebliche Einkommen «das Grund-
  // einkommen um mehr als 36'000 Franken übersteigt». Grundeinkommen = Haushaltsabzug (12'000 ohne,
  // 24'000 mit Kindern) + Sozialabzug (3'750 · 6'000 · 16'000 · 24'000 · 30'000, +6'000 je weitere
  // Person); Beitragstabelle 04.07.2025 Kopfzeile. Die frühere Pauschale 50'000 lag für eine Person
  // ~1'750 zu tief, für ein Paar ~4'000 zu tief und hielt Familien ab. Obere Schranke — der Beitrag
  // kann schon darunter unter die Auszahlungsschwelle (600/Jahr, Ziff. 11) fallen; darum «bis etwa».
  // Drei und mehr Erwachsene ohne Kind stehen nicht in der Tabelle → keine Zahl (nicht belegt).
  // Massgeblich ist das Einkommen nach SoHaG § 6 Abs. 2 lit. c inkl. 10 % des Vermögens über dem
  // Freibetrag (Ziff. 2) — nicht der Lohn. MBG (890.500) § 4 Abs. 2: kein Anspruch ab Referenzalter.
  BS: { state: 'has', group: 'all', incomeLimit: 'formel', limitFormel: 'bs', einkommensBasis: 'massgebend',
        residencyYears: 2, benefitMaxMonth: 1060,
        noteKey: 'mietzinsView.cantonNote_BS', stand: '2026',
        url: 'https://www.bs.ch/themen/finanzielle-hilfe/leistungen/mietbeitraege' },
  // Basel-Landschaft — Mietzinsbeiträge, nur Haushalte mit mind. 1 Kind. Netto-Jahreseinkommen
  // ~40–75k (Paare) bzw. ~30–60k (Alleinerziehende); min. 2 Jahre Wohnsitz; Gemeinden zahlen aus.
  // Quelle: baselland.ch (Sozialamt), Mietzinsbeitragsgesetz.
  // ⟨25.09.2026, Fachprüfung⟩ KEINE feste Grenze mehr: nach § 6 MBG wird die Grenze je Haushalt
  // berechnet (Lebensbedarf, KVG-Prämie, Miete, Kinderbetreuung), die Gemeinden setzen sie per
  // Reglement fest (§ 10). Die frühere Pauschale 75'000 schätzte in beide Richtungen falsch.
  // limitArt 'gemeinde' → Orientierung mit Verweis auf die Wohngemeinde statt Grenzvergleich.
  BL: { state: 'has', group: 'families', incomeLimit: null, limitArt: 'gemeinde', residencyYears: 2,
        noteKey: 'mietzinsView.cantonNote_BL', stand: '2026',
        url: 'https://www.baselland.ch/politik-und-behorden/direktionen/finanz-und-kirchendirektion/sozialamt/mietzinsbeitraege' },
  // Genf — Allocation de logement. Anspruch über „taux d'effort" (Mietbelastung 24.7–29.9% je
  // Zimmer/Personen), Eintritts-barème mietabhängig (keine einzelne Grenze); 2 von 5 Jahren
  // Wohnsitz; max. 1'400 CHF/Zimmer, höchstens halbe Miete. Quelle: ge.ch.
  // ⟨25.09.2026⟩ 1'000 statt 1'400 pro Zimmer: RGL I 4 05.01 Art. 24 Abs. 2 «au maximum de 1 000 francs
  // par pièce»; die 1'400 galten nur im Übergangsrecht Art. 90 Abs. 3 (1.4.2024–31.3.2025).
  GE: { state: 'has', group: 'all', incomeLimit: null, residencyYears: 2, benefitMaxRoom: 1000,
        noteKey: 'mietzinsView.cantonNote_GE', stand: '2026',
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
        // Nur für Wohnungen, die dem WFG unterstellt sind (Merkblatt Sept. 2025; zg.ch: «rund 1900
        // Wohnungen»). Entscheid Stebler Studios 25.09.2026: der Rechner FRAGT danach (wohnen.wfgWohnung,
        // 'ja' | 'nein' | 'weissNicht'). «nein» → kein Anspruch; offen/«weiss nicht» → Hinweis beim Ergebnis.
        wfgFrage: true,
        // Merkblatt Sept. 2025: zwischen 50'000 und 60'000 nur, wenn die Miete nach Verbilligung 25 %
        // des Einkommens übersteigt. Die App kennt die Miete VOR Verbilligung → nur ein Hinweis.
        mietbelastung: { ab: 50000, anteil: 0.25 },
        bedingungKey: 'mietzinsView.bedingung_ZG',
        noteKey: 'mietzinsView.cantonNote_ZG', stand: '2026',
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
export function mietzinsIncomeLimit(program, householdSize = 1, childrenCount = 0, children = null) {
  if (!program || program.incomeLimit == null) return null;
  if (program.limitFormel === 'bs') {
    if (!children) return bsObergrenze(householdSize, childrenCount);
    const h = bsHaushalt(householdSize - childrenCount, children);
    return h.offen ? null : bsObergrenze(h.personen, h.kinder);
  }
  let limit = program.incomeLimit;
  // ZG: +2'500 je MINDERJÄHRIGES Kind; volljährige «Kinder» zählen als erwachsene Personen
  // (Merkblatt Sept. 2025; Abschluss-Prüfung 25.09.2026 — vorher bekam jedes Kind +2'500 und
  // nie +20'000, bis 17'500 zu streng). Ohne Altersangabe: minderjährig.
  const volljaehrig = children ? children.filter((c) => Number(c?.age) >= 18).length : 0;
  const minderjaehrig = childrenCount - volljaehrig;
  if (program.incomePerChild) limit += program.incomePerChild * minderjaehrig;
  if (program.incomePerAdult) {
    // ZG-Regel: Basisgrenze gilt für zwei Erwachsene, Zuschlag erst ab der 3. Person
    // („Für mehr als zwei erwachsene Personen … +20'000 je weitere Person", ZG-Merkblatt).
    const adults = Math.max(1, householdSize - childrenCount) + volljaehrig;
    limit += program.incomePerAdult * Math.max(0, adults - 2);
  }
  return limit;
}

// BS: Grundeinkommen + 36'000 (Merkblatt 01.2026 Ziff. 13, Werte oben beim Programm).
// null für drei und mehr Erwachsene ohne Kind — diesen Haushaltstyp führt die Tabelle nicht.
// ⟨25.09.2026, Quellenprüfung⟩ Ab der sechsten Person +4'000, nicht +6'000: MBVO (890.510) Anhang 1
// «Für jede weitere Person plus Fr. 4'000.- ausgehend vom 5 PH», ebenso SoHaV (890.710) § 11 Abs. 2.
// Das Merkblatt nennt 6'000; massgebend sind nach seiner Ziff. 14 die Gesetzesbestimmungen.
export function bsObergrenze(personen, kinder) {
  const n = Math.max(1, Number(personen) || 1);
  const k = Math.max(0, Number(kinder) || 0);
  if (k === 0 && n >= 3) return null;
  const haushaltsabzug = k > 0 ? 24000 : 12000;
  const sozialabzug = n <= 5 ? [3750, 6000, 16000, 24000, 30000][n - 1] : 30000 + 4000 * (n - 5);
  return haushaltsabzug + sozialabzug + 36000;
}

// BS: wer als «Kind» zur Haushaltseinheit zählt — SoHaG (890.700) § 5 Abs. 2 lit. c, SoHaV § 2/§ 3,
// MBVO § 9 Abs. 2: minderjährig, oder 18–24 UND in Erstausbildung. 25 und älter gehört nicht dazu
// (auch nicht als erwachsene Person). Ob jemand zwischen 18 und 24 in Erstausbildung ist, weiss die
// App nur, wenn es beantwortet ist: `erstausbildung` am Kind ('ja' | 'nein'), gefragt im Mietzins-
// Rechner (Entscheid Stebler Studios 25.09.2026). 'ja' → Kind · 'nein' → nicht in der Haushaltseinheit
// (auch nicht als erwachsene Person, SoHaV § 3) · keine Antwort → `offen`, keine Grenze (je nach
// Antwort 12'000–16'000 Unterschied). Ohne Altersangabe zählt ein Kind als minderjährig.
export const istJungErwachsen = (c) => Number(c?.age) >= 18 && Number(c?.age) <= 24;
export function bsHaushalt(erwachsene, children = []) {
  const alter = (c) => Number(c?.age);
  const kinder = children.filter((c) => !(alter(c) >= 18) || (istJungErwachsen(c) && c.erstausbildung === 'ja'));
  const offen = children.some((c) => istJungErwachsen(c) && c.erstausbildung !== 'ja' && c.erstausbildung !== 'nein');
  return { personen: Math.max(1, erwachsene) + kinder.length, kinder: kinder.length, offen };
}

// O3 — Ergebnis-Art des Mietzins-Schnellchecks (MietzinsOrientierung.jsx).
// Die Einschätzung selbst bleibt in der Ansicht; hier wird nur aus IHREM Ergebnis (dem Schlüssel)
// die Art abgeleitet, damit es für die Einschätzung weiter genau eine Quelle gibt.
//
//   VORPRÜFUNG   Vergleich des Jahreseinkommens mit einer Richtgrenze (MIETZINS_DATA_VERSION) —
//                sagt, ob sich ein Antrag lohnen könnte, nie einen Betrag.
//   ORIENTIERUNG 'effortBased' (GE) / 'municipalLimit' (BL) / 'tableLimit' (BS, Haushaltstyp nicht in der Tabelle): keine feste
//                Grenze, also wird nichts geprüft.
//   null         Kanton ohne bestätigtes Programm ('none'/'check'): keine Prüfung, keine Art.
// Ohne Kanton ist offen, ob es ein Programm gibt — die Vorprüfung wartet auf den Kanton und,
// falls es fehlt, aufs Einkommen.
export function mietzinsErgebnis({ info, assessmentKey, annualIncome = 0 }) {
  if (!info) {
    return ergebnis(ERGEBNIS_ART.VORPRUEFUNG, { fehlend: fehlendeAngaben({ kanton: false, einkommen: annualIncome > 0 }) });
  }
  if (info.state !== 'has' || !assessmentKey) return null;
  if (['effortBased', 'municipalLimit', 'tableLimit', 'jungeErwachseneOffen'].includes(assessmentKey)) return ergebnis(ERGEBNIS_ART.ORIENTIERUNG);
  if (assessmentKey === 'needIncome') return ergebnis(ERGEBNIS_ART.VORPRUEFUNG, { fehlend: ['einkommen'] });
  return ergebnis(ERGEBNIS_ART.VORPRUEFUNG);
}
