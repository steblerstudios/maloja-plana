// Sozialhilfe-Rechner nach SKOS-Richtlinien, Stand 1.1.2026
// (2. Etappe der Richtlinienrevision, von der SODK am 15.5.2025 genehmigt, in Kraft 1.1.2026:
// https://skos.ch/skos-richtlinien/laufende-richtlinienrevision, abgerufen 16.09.2026).
// Quellen: SKOS-RL Kapitel C.3–C.6 und D.3.1, Kanton Zürich Sozialhilfehandbuch
// GBL-Stand gegengeprüft 2026-07-19: SODK/SKOS empfahlen 1061 «spätestens ab 1.1.2026»,
// nächste Anpassung erst 1.1.2027 (an EL-Teuerung gekoppelt) → Tabelle 2025 gilt 2026 unverändert.
// Neu per 1.1.2026 ist der Vermögensfreibetrag (D.3.1, unten): 6000 statt 4000 Franken für
// Einzelpersonen, 12 000 für Paare (skos.ch, Artikel «Vermögensfreibetrag auch im Kanton
// Thurgau», 28.08.2025, abgerufen 16.09.2026). Datenstand deshalb 2026-01, nicht mehr 2025-01.

export const SKOS_DATA_VERSION = '2026-01';

// GBL = Grundbedarf für den Lebensunterhalt (SKOS C.3.1, ab 1.1.2025, für 2026 unverändert)
const GBL_TABELLE = [
  0,     // 0 Personen (Platzhalter)
  1061,  // 1 Person
  1624,  // 2 Personen
  1974,  // 3 Personen
  2271,  // 4 Personen
  2568,  // 5 Personen
  2784,  // 6 Personen
  3000,  // 7 Personen
];
const GBL_PRO_WEITERE = 216;

// Integrationszulage (IZU) – SKOS C.6.1
// Für besondere Integrationsleistungen (z.B. regelmässige Freiwilligenarbeit,
// Programme, Praktika): CHF 100–300/Monat, im Ermessen der Sozialbehörde.
// Wir rechnen konservativ mit dem garantierten Mindestbetrag (nie über-versprechen).
const IZU_MIN = 100;
const IZU_MAX = 300;
const IZU_STANDARD = IZU_MIN;

// Einkommensfreibetrag (EFB) – SKOS C.6.2
const EFB_PAUSCHAL = 400;
const EFB_ANTEIL = 0.33;
const EFB_MAX = 700;

// Medizinische Grundversorgung – SKOS C.5
const FRANCHISE_STANDARD = 300;
const SELBSTBEHALT_SATZ = 0.10;
const SELBSTBEHALT_MAX_ERW = 700;
const SELBSTBEHALT_MAX_KIND = 350;

export const SKOS_PARAMS = {
  gblEinperson: GBL_TABELLE[1],
  gblProWeitere: GBL_PRO_WEITERE,
  izuMin: IZU_MIN,
  izuMax: IZU_MAX,
  izuStandard: IZU_STANDARD,
  efbPauschal: EFB_PAUSCHAL,
  efbAnteil: Math.round(EFB_ANTEIL * 100),
  efbMax: EFB_MAX,
  franchiseStandard: FRANCHISE_STANDARD,
  selbstbehaltSatz: Math.round(SELBSTBEHALT_SATZ * 100),
  selbstbehaltMaxErw: SELBSTBEHALT_MAX_ERW,
  selbstbehaltMaxKind: SELBSTBEHALT_MAX_KIND,
};

export function grundbedarfFuerHaushalt(personen) {
  if (personen < 1) return 0;
  if (personen <= 7) return GBL_TABELLE[personen];
  return GBL_TABELLE[7] + (personen - 7) * GBL_PRO_WEITERE;
}

export function einkommensfreibetrag(erwerbseinkommen) {
  if (erwerbseinkommen <= 0) return 0;
  const efb = EFB_PAUSCHAL + (erwerbseinkommen - EFB_PAUSCHAL) * EFB_ANTEIL;
  return Math.min(Math.max(0, Math.round(efb)), EFB_MAX);
}

// Vermögensfreibetrag — JE KANTON (Entscheid 16.09.2026: «Je Kanton, gekennzeichnet»).
// Belege: docs/sources/skos-vermoegensfreibetrag-2026.md (alle Quellen abgerufen 16.09.2026).
// SKOS-Empfehlung D.3.1 (ab 1.1.2026; vorher C.7, 36 Jahre unverändert): CHF 6'000
// Einzelperson / 12'000 Paar (2+ Erwachsene) + 3'000 pro minderjähriges Kind, max.
// 15'000 pro Unterstützungseinheit — gilt für alle Kantone OHNE Eintrag unten
// (ZH Sozialhilfehandbuch 9.2.01 · GR Art. 5 ABzUG · JU Communiqué 30.10.2025 · VS
// Directive LIAS 21.1 mit eigener gleicher Zahl; ZG · SZ · LU · NW · GL · TG · AR · UR
// per Verweis auf SKOS). Einzige Quelle der Wahrheit — auch von config/cantonalData.js
// genutzt. Nur ABWEICHENDE bzw. UNBESTÄTIGTE Kantone stehen hier (Hauptbundle-Budget).
// Format (kompakt fürs Hauptbundle), Beträge in HUNDERT Franken (15 = CHF 1'500):
//   Zahl  = Einzelbetrag bei SKOS-Struktur: Paar = 2×, je Kind = ½×, Max = 2,5× Einzel
//           (so bei SKOS 6'000/12'000/3'000/15'000 und allen Kantonen mit einer Zahl unten)
//   Liste = [Einzel, je Kind, Max] bei abweichender Struktur.
//   Paar ist überall 2× Einzel, begrenzt durch Max (bei BL/TI: Max = Einzel → Paar = Einzel).
// Kantonal NICHT bestätigte Kantone: zusätzlich in data/vermoegensfreibetragUnbestaetigt.js.
const VFB_KANTON = {
  // AG: § 11 Abs. 4 SPV (SAR 851.211) / Handbuch Soziales AG Ziff. 9.2, «Freibeträge pro
  // Person 1'500, Maximalbetrag pro Unterstützungseinheit 4'500»
  // https://www.ag.ch/de/verwaltung/dgs/gesellschaft/soziales/handbuch-soziales/9-anrechnung-von-eigenen-mitteln-(einkommen-und-vermoegen)/9-2-vermoegen
  // Gelesen als: jede Person der Einheit (auch Kinder) 1'500 → Paar 3'000, Kind +1'500, max. 4'500.
  AG: [15, 15, 45],
  // SH: Richtlinien Bemessung der Sozialhilfe, Ziff. D.6.1, gültig ab 1.1.2022
  // https://sh.ch/CMS/get/file/9dd85ebc-6cb7-4bb0-bfee-d1e9de104705
  // Einzel 2'000 / Paar 4'000. Kinderzuschlag und Höchstbetrag dort NICHT geregelt →
  // kein Kinderzuschlag gerechnet (0), Max = Paarbetrag (nicht als «0 belegt» lesen).
  SH: [20, 0, 40],
  // SO: § 93 Abs. 1 Bst. j SV, Sozialhilfehandbuch SO (Stand 16.09.2026)
  // https://sozialhilfehandbuch.so.ch/praxis-sozialhilfe/anrechnung-einkommen-und-vermoegen/vermoegen/anrechnung-von-vermoegen-und-freibetraege/
  SO: 20, // 2'000 / 4'000 / +1'000 / max. 5'000
  // BE: Art. 8n SHV (BSG 860.111), zitiert im Merkblatt «Vermögen» der Stadt Bern
  // https://www.bern.ch/themen/gesundheit-alter-und-soziales/sozialhilfe/unterstuetzungsrichtlinien-sozialhilfe/downloads-1/downloads/vermogen-17-08-23.pdf
  BE: 40, // 4'000 / 8'000 / +2'000 / max. 10'000
  // NE: Art. 18 ANCAM (RSN 831.02), état au 1er avril 2026
  // https://rsn.ne.ch/DATA/program/books/rsne/pdf/83102.pdf
  NE: 40, // dito
  // GE: Art. 3 RASLP (RSG J 4 04.01), in Kraft; SKOS-Karte «Erhöhung in Diskussion» noch nicht wirksam
  // https://silgeneve.ch/legis/program/books/RSG/pdf/rsg_j4_04p01.pdf
  GE: 40, // dito
  // BS: Unterstützungsrichtlinien WSU Basel-Stadt, Ziff. 14, gültig ab 1.1.2026
  // https://media.bs.ch/original_file/8ed016dbcae7b24e4bb7e4d333c71072442b2d80/unterstuetzungsrichtlinien-wsu-2026.pdf
  BS: 80, // 8'000 / 16'000 / +4'000 / max. 20'000
  // ── Kantonal NICHT bestätigt (vermoegensfreibetragUnbestaetigt.js) — Einzelbetrag laut SKOS-Karte
  // «Höhe des Vermögensfreibetrags», Stand 1.1.2026:
  // https://skos.ch/fileadmin/user_upload/skos_main/public/pdf/richtlinien/260101_Vermoegensfreibetrag.pdf
  // SG: Karte 2'500; Paar/Kind/Max aus «Beiblatt zum KOS-Handbuch Kanton St. Gallen»,
  // Stadt Wil (Asylsozialhilfe), ab 1.1.2026 — nur indirekt belegt.
  // https://www.stadtwil.ch/storage/a2c0535935b95a4362a501465528b04f18638dddcb1f3bbe4c029d6098974f3a
  SG: 25, // 2'500 / 5'000 / +1'250 / max. 6'250
  // FR: Karte 4'000; Directives d'application LASoc Ziff. 5, «en vigueur depuis le 1er mai 2017»
  // (vor der neuen LASoc per 1.1.2026 — Aktualität unklar)
  // https://www.fr.ch/sites/default/files/contens/sasoc/_www/files/pdf92/6_fr_directives_d_application.pdf
  FR: 40, // 4'000 / 8'000 / +2'000 / max. 10'000
  // VD: Karte 4'000 («Erhöhung in Diskussion»); Art. 18 RLASV (RSV 850.051.1), Fassung «Etat au
  // 01.02.2008» — Aktualität 2026 unklar. https://www.lexfind.ch/tolv/122897/fr
  VD: 40, // dito
  // AI (Art. 5 Abs. 2 ShiV: nicht-öffentliche Richtlinien) und OW (kein Vermögensartikel in
  // SHG GDB 870.1 / SHV GDB 870.11): Karte 6'000 = SKOS-Einzelbetrag → SKOS-Staffel übernommen,
  // weil der Kartenwert genau der Empfehlung entspricht → kein Eintrag nötig, nur Kennzeichnung.
  // BL (Karte 2'200) und TI (Karte 10'000): kein Beleg für Paar/Kind/Max, und die Karte weicht
  // von SKOS ab → keine Staffel abgeleitet (für BL kursiert unbelegt ein Paarwert 3'400, der der
  // SKOS-Verhältniszahl widerspricht). Nur der Einzelbetrag, für jede Haushaltsgrösse.
  BL: [22, 0, 22],
  TI: [100, 0, 100],
};

export function vermoegensfreibetragKanton(kanton, adults = 1, minorChildren = 0) {
  const w = VFB_KANTON[kanton] || 60; // ohne Eintrag: SKOS-Empfehlung D.3.1
  const [einzel, kind, max] = w.length ? w : [w, w / 2, w * 2.5];
  return 100 * Math.min(max, (adults >= 2 ? 2 : 1) * einzel + Math.max(0, minorChildren) * kind);
}

// Die Kennzeichnung «kantonal nicht bestätigt» (SG · FR · VD · AI · OW · BL · TI) steht in
// data/vermoegensfreibetragUnbestaetigt.js — nur die Anzeige braucht sie (Lazy-Chunk).

// SKOS-Empfehlung D.3.1 ohne Kanton (Standard-Staffel).
export const vermoegensfreibetragSKOS = (adults, minorChildren) => vermoegensfreibetragKanton('', adults, minorChildren);

// Freibetrag bei RÜCKERSTATTUNG rechtmässig bezogener Sozialhilfe wegen günstiger
// Verhältnisse (Vermögensanfall, z.B. Erbschaft) — NICHT zu verwechseln mit dem
// Vermögensfreibetrag WÄHREND des Bezugs (oben, 6'000/12'000/+3'000). Andere,
// höhere Grenze: CHF 30'000 Einzelperson / 50'000 Paar (2+ Erwachsene) + 15'000
// pro minderjähriges Kind, ohne Deckel. Quelle: § 27 SHG Kanton Zürich +
// Sozialhilfehandbuch ZH 15.2.03 (Stand ab 1.1.2026). KANTONAL VERSCHIEDEN —
// nur Orientierung mit Zürcher Werten. Erwerbseinkommen löst i.d.R. keine
// Rückerstattung aus (SKOS-Empfehlung).
export function rueckerstattungsFreibetrag(adults = 1, minorChildren = 0) {
  const basis = adults >= 2 ? 50000 : 30000;
  return basis + Math.max(0, minorChildren) * 15000;
}

export function berechneSozialhilfe({
  haushaltGroesse,
  adults = 1,
  kinderImHaushalt = 0,
  miete = 0,
  krankenkassePraemie = 0,
  erwerbseinkommen = 0,
  andereEinkuenfte = 0,
  vermoegen = 0,
  erwerbstaetig = false,
  integrationsMassnahme = false,
  kanton, // Kantonskürzel; ohne → SKOS-Empfehlung beim Vermögensfreibetrag
}) {
  if (haushaltGroesse == null) haushaltGroesse = adults + kinderImHaushalt;
  const gbl = grundbedarfFuerHaushalt(haushaltGroesse);
  const wohnkosten = Math.max(0, miete);
  const kvgPraemie = Math.max(0, krankenkassePraemie);

  const bedarf = gbl + wohnkosten + kvgPraemie;

  let izu = 0;
  if (integrationsMassnahme && !erwerbstaetig) {
    izu = IZU_STANDARD;
  }

  let efb = 0;
  if (erwerbstaetig && erwerbseinkommen > 0) {
    efb = einkommensfreibetrag(erwerbseinkommen);
  }

  const totalEinkommen = Math.max(0, erwerbseinkommen) + Math.max(0, andereEinkuenfte);
  const anrechenbaresEinkommen = Math.max(0, totalEinkommen - efb);

  const sozialhilfeAnspruch = Math.max(0, bedarf - anrechenbaresEinkommen);
  const totalUnterstuetzung = sozialhilfeAnspruch + izu;

  // Vermögensfreibetrag je Kanton (ohne Kanton: SKOS-Empfehlung D.3.1) — vereinheitlichter Helper
  const minderjaehrigeKinder = Math.max(0, haushaltGroesse - adults);
  const vermoegensfreibetrag = vermoegensfreibetragKanton(kanton, adults, minderjaehrigeKinder);
  const anrechenbaresVermoegen = Math.max(0, vermoegen - vermoegensfreibetrag);
  const hatAnspruch = anrechenbaresVermoegen <= 0 && sozialhilfeAnspruch > 0;

  return {
    gbl,
    gblProPerson: Math.round(gbl / haushaltGroesse),
    wohnkosten,
    kvgPraemie,
    bedarf,
    efb,
    izu,
    totalEinkommen,
    anrechenbaresEinkommen,
    sozialhilfeAnspruch,
    totalUnterstuetzung,
    vermoegensfreibetrag,
    anrechenbaresVermoegen,
    hatAnspruch,
    haushaltGroesse,
    kinderImHaushalt,
  };
}

export function vergleicheHaushaltGroessen(miete, kvgPraemie) {
  const ergebnisse = [];
  for (let p = 1; p <= 7; p++) {
    ergebnisse.push({
      personen: p,
      gbl: grundbedarfFuerHaushalt(p),
      gblProPerson: Math.round(grundbedarfFuerHaushalt(p) / p),
      totalBedarf: grundbedarfFuerHaushalt(p) + miete + kvgPraemie,
    });
  }
  return ergebnisse;
}

export function berechneExistenzminimum({ haushaltGroesse = 1, miete = 0, krankenkassePraemie = 0 }) {
  const gbl = grundbedarfFuerHaushalt(haushaltGroesse);
  const total = gbl + miete + krankenkassePraemie;
  return {
    gbl,
    miete,
    krankenkassePraemie,
    existenzminimum: total,
    existenzminimumJahr: total * 12,
  };
}

// ── BFS-Armutsgrenze (absolute Armut) ────────────────────────────────────────
// Methodik BFS (in Anlehnung an die SKOS-Richtlinien): die Armutsgrenze eines
// Haushalts = Grundbedarf für den Lebensunterhalt (SKOS C.3.1) + effektive
// Wohnkosten (bis zur kantonalen Obergrenze) + CHF 100/Monat pro Person ab 16.
// Verglichen wird sie mit dem VERFÜGBAREN Haushaltseinkommen — davon sind
// KK-Prämien, Sozialabgaben, Steuern und Alimente VORGÄNGIG abgezogen; die
// KK-Prämie gehört also NICHT in die Armutsgrenze (anders als beim Existenz-
// minimum). Anders als das Lohn-Barometer (Brutto-Lohnniveau) beantwortet sie
// die Frage «bin ich unter dem Existenzminimum?».
// Quelle: BFS «Armut in der Schweiz», Medienmitteilung publiziert Februar 2026,
// Bezugsjahr 2024 (neueste verfügbare Zahl): durchschnittliche Armutsgrenze
// Einzelperson CHF 2388, zwei Erwachsene + zwei Kinder CHF 4159/Monat.
// (Gegengeprüft 2026-07-19; die älteren 2023-Zahlen waren CHF 2315 / 4051.)
export const ARMUTSGRENZE_PAUSCHALE_AB16 = 100;
export const ARMUTSGRENZE_DATA_VERSION = '2024';

export function berechneArmutsgrenze({ grundbedarf, effektiveWohnkosten = 0, personenAb16 = 1 }) {
  const g = Math.max(0, grundbedarf || 0);
  const w = Math.max(0, effektiveWohnkosten || 0);
  const pauschale = ARMUTSGRENZE_PAUSCHALE_AB16 * Math.max(0, personenAb16 || 0);
  return g + w + pauschale;
}

// Der Brutto-Richtwert aus einem Netto-Lohn (AHV/ALV + geschätzte PK) lebt in
// data/ahvRechner.js (nettoZuBruttoRichtwert) — dort, wo die BVG-Bausteine sind.
