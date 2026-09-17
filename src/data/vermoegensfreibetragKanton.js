// Vermögensfreibetrag je Kanton (SKOS D.3.1 + kantonale Abweichungen).
// K67 (17.09.2026): aus data/sozialhilfeRechner.js herausgelöst. Rollup legt ein
// Modul immer ganz in einen Teil des Bundles — weil config/cantonalData.js (Hauptbundle)
// nur diese Funktion braucht, lag sonst der ganze Sozialhilfe-Rechner im Hauptbundle.
// sozialhilfeRechner.js exportiert die Funktion weiter (bestehende Importe bleiben gültig).

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
  // AG: § 11 Abs. 4 SPV (SAR 851.211) / Handbuch Soziales AG Ziff. 9.2, «Freibeträge (pro
  // Person Fr. 1'500.—, maximal Fr. 4'500.— pro Unterstützungseinheit)» (Wortlaut am
  // 16.09.2026 an der neuen Adresse nachgelesen; die alte /de/verwaltung/…-Adresse leitet per 301 hierher)
  // https://www.ag.ch/de/themen/soziales-gesellschaft/soziale-sicherheit/handbuch-soziales/9-anrechnung-von-eigenen-mitteln-(einkommen-und-vermoegen)/9-2-vermoegen
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
// data/vermoegensfreibetragUnbestaetigt.js. Seit R4 (16.09.2026) liefern berechneSozialhilfe
// und calculateSozialhilfe sie als Flag `vfbUnbestaetigt` mit — auch UNTER dem Freibetrag,
// weil der unbestätigte Betrag dort direkt in die Aussage «Anspruch» einfliesst.
