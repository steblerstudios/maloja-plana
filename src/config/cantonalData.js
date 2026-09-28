// Kantonale Werte (SKOS-Grundbedarf, IPV, EL, Mietzinsmaxima) — ändern jährlich.
// Ein Datei-weiter Datenstand (CANTONAL_DATA_VERSION '2024/2025') wurde am 16.09.2026
// entfernt: nirgends angezeigt, und ein Stand für die ganze Datei datiert Werte mit
// unterschiedlichem Prüfstand falsch. Stände je Block, z. B. SKOS_DATA_VERSION in data/sozialhilfeRechner.js.
import { partnerEinkommenRoh } from '../utils/partnereinkommen.js';
import { dreizehnterStatus, hauptlohnMonate } from '../utils/dreizehnter.js';
import { vermoegensfreibetragKanton } from '../data/vermoegensfreibetragKanton.js';
import { vermoegensfreibetragUnbestaetigt } from '../data/vermoegensfreibetragUnbestaetigt.js';
import { sozialhilfeBilanz, istErwerbstaetig } from '../data/sozialhilfeKern.js';
import { nettoMonatAusProfil } from '../utils/nettoAusProfil.js';

// PLZ → Kanton/Gemeinde, Kantonscodes und -namen liegen seit 28.09.2026 in kantonPLZ.js (klein, für
// die Startdatei). Hier nur weitergereicht, damit bestehende Importe gültig bleiben.
import { plzModul, preloadPLZModul } from './kantonPLZ.js';
export { cantonFromPLZ, gemeindeFromPLZ, CANTON_CODES, getCantonName } from './kantonPLZ.js';

// K31: das Register der kantonalen Prämienverbilligungs-Modelle. Je Kanton ein eigenes, nachgeladenes
// Modul (eigener Chunk, hält die Startdatei klein); `fn` ist der Name der Einstiegsfunktion darin.
// Bis 28.09.2026 stand hier je Kanton ein eigener `if`-Block mit eigener Modul-Variable — bei fünf
// Kantonen lesbar, bei 26 nicht mehr, und jeder Block kostete Startbündel (65-kB-Deckel, npm run size).
// Ein neuer Kanton trägt sich hier mit EINER Zeile ein; die Reihenfolge der Riegel, die Formel und
// die Vorbehalte bleiben im Kantonsmodul (config/kantonsModell.js erklärt, was gemeinsam ist).
//
//   brauchtPLZ: false  — nur, wo der Kanton keine Prämienregion kennt und darum nicht auf die
//                        PLZ-Daten wartet (AG: V KVGG § 4 Abs. 1, kantonsweiter Durchschnitt).
//                        Ohne Angabe wartet der Kanton auf Modul UND PLZ-Daten.
export const IPV_MODULE = {
  ZH: { laden: () => import('./ipvZuerich.js'), fn: 'ipvZuerich' },
  BE: { laden: () => import('./ipvBern.js'), fn: 'ipvBern' },
  AG: { laden: () => import('./ipvAargau.js'), fn: 'ipvAargau', brauchtPLZ: false },
  SG: { laden: () => import('./ipvStGallen.js'), fn: 'ipvStGallen' },
  LU: { laden: () => import('./ipvLuzern.js'), fn: 'ipvLuzern' },
  VD: { laden: () => import('./ipvVaud.js'), fn: 'ipvVaud' },
  // JU: keine Prämienregion — und das Modul zeigt bewusst keine Zahl (steuerbares Einkommen fehlt).
  JU: { laden: () => import('./ipvJura.js'), fn: 'ipvJura', brauchtPLZ: false },
  UR: { laden: () => import('./ipvUri.js'), fn: 'ipvUri', brauchtPLZ: false },
  NE: { laden: () => import('./ipvNeuchatel.js'), fn: 'ipvNeuchatel', brauchtPLZ: false },
  // GE: feste Monatsbeträge je Einkommensgruppe, kantonsweit gleich — keine Prämienregion (Barème 2026).
  GE: { laden: () => import('./ipvGenf.js'), fn: 'ipvGenf', brauchtPLZ: false },
  GR: { laden: () => import('./ipvGraubuenden.js'), fn: 'ipvGraubuenden' },
  // TG rechnet nach dem Steuerbetrag, nicht nach Region oder Einkommen — und zeigt bewusst keine Zahl.
  TG: { laden: () => import('./ipvThurgau.js'), fn: 'ipvThurgau', brauchtPLZ: false },
  // TI kennt Prämienregionen, rechnet aber mit einem kantonsweiten PMR (LCAMal Art. 28 Abs. 2).
  TI: { laden: () => import('./ipvTicino.js'), fn: 'ipvTicino', brauchtPLZ: false },
  OW: { laden: () => import('./ipvObwalden.js'), fn: 'ipvObwalden', brauchtPLZ: false },
  SO: { laden: () => import('./ipvSolothurn.js'), fn: 'ipvSolothurn', brauchtPLZ: false },
  ZG: { laden: () => import('./ipvZug.js'), fn: 'ipvZug', brauchtPLZ: false },
};
const _module = {};

// Die Kantonsmodelle liegen im selben Moment nach wie die PLZ-Daten. Ein Ladefehler bleibt still:
// dann zeigt der Kanton die Orientierung «laden», nie einen geratenen Betrag.
export function preloadIPVModelle() {
  for (const [kt, m] of Object.entries(IPV_MODULE)) {
    if (!_module[kt]) m.laden().then(mod => { _module[kt] = mod; }).catch(() => {});
  }
}

// PLZ-Modul aktiv vorladen UND die Kantonsmodelle — wie bisher, für alle, die von hier importieren.
export function preloadPLZ() {
  preloadPLZModul();
  preloadIPVModelle();
}

// ─── Household helper ─────────────────────────────────────
// Single source of truth for household composition.
// Reads from household object if present, falls back to legacy dependents field.
export function getHouseholdInfo(data) {
  const basis = data?.basis || {};
  const household = basis.household;

  if (household && typeof household === 'object') {
    const adults = Math.max(1, Number(household.adults) || 1);
    const children = Array.isArray(household.children) ? household.children : [];
    return {
      adults,
      childrenCount: children.length,
      children,
      isRetired: Boolean(household.isRetired),
      householdSize: adults + children.length,
      // K62-Nachlauf A: nur, wenn das Feld «Nettolohn Partner/in» sichtbar wäre (utils/partnereinkommen.js).
      partnerIncome: Number(partnerEinkommenRoh(basis) || 0),
    };
  }

  // Fallback: derive from legacy dependents field
  const dependents = Number(basis.dependents || 0);
  return {
    adults: 1,
    childrenCount: dependents,
    children: Array.from({ length: dependents }, () => ({ age: 0 })),
    isRetired: data?.finanzen?.employmentType === 'retired',
    householdSize: 1 + dependents,
    partnerIncome: 0,
  };
}

// Kantonale Prämienverbilligung — Einkommensgrenzen und Beiträge pro Kanton
// Quelle: BAG, kantonale Gesundheitsdirektionen (vereinfacht, Stand 2024/2025)
//
// E9 (Entscheid 16.09.2026): Die Grenzen und Beträge unten sind nach einem Muster
// erzeugt (Familie = 2× Einzel, Kind = ½, Grenzen gerundet) und NICHT amtlich belegt.
// Solange ein Kanton `belegt: false` trägt, zeigt die App dort keinen Betrag, kein
// «Berechtigt» und keine Grenze, sondern nur eine Orientierung (calculateIPV unten).
// Das Feld `beleg` je Kanton ist Flag und Quellen-Feld zugleich:
//   beleg: null                                  → nicht amtlich belegt (heute 21 von 26; ZH, BE, AG, SG und LU belegt seit K31)
//   beleg: { quelle: 'Erlass-Kürzel + Amt; der Wortlaut steht im Quellenblatt
//                     docs/sources/ipv-kantone-2026.md (nicht hier doppelt: jedes Zeichen
//                     dieser Datei liegt im Hauptbundle, gelesen wird zur Laufzeit nur, OB es da ist)',
//            stand: 'Datum der Prüfung bzw. Gültigkeitsjahr, z. B. 2026' }
//                                                → belegt; zeigt wieder einen Betrag
// Beim Belegen maxIncome/subsidy* auf die amtlichen Werte setzen. Ein `beleg` ohne
// `quelle` gilt als unbelegt.
export const CANTONAL_IPV = {
  // ZH (K31): eigenes Modell in config/ipvZuerich.js; Grenze und Höchstbetrag hängen von
  // Prämienregion und Haushalt ab, darum hier keine Einzelwerte (die Musterwerte sind entfernt).
  ZH: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplySva', noteParams: { canton: 'ZH' },
    beleg: { quelle: 'EG KVG ZH (LS 832.01) · RRB 297/2025, 947/2025 · SVA Zürich — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-19' } },
  // BE (K31): eigenes Modell in config/ipvBern.js (Stufentabelle); Grenze und Höchstbetrag
  // hängen von Prämienregion und Haushalt ab, darum hier keine Einzelwerte.
  BE: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteAutoTaxData',
    beleg: { quelle: 'KKVV BE (BSG 842.111.1) · Amt für Sozialversicherungen BE — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-20' } },
  // LU (K31): eigenes Modell in config/ipvLuzern.js (Richtprämie minus Prozentsatz, der MIT dem
  // Einkommen steigt; Kinder 80 % fest bis zur Einkommensgrenze). Keine publizierte Grenze für
  // Erwachsene, darum maxIncome null wie in SG und AG.
  LU: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyCantonalCompensation',
    beleg: { quelle: 'SRL 866a · SRL 866 · WAS Ausgleichskasse Luzern — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-23' } },
  // UR (K31): eigenes Modell in config/ipvUri.js (Richtprämien minus 8,5 % des PV-Einkommens, eine
  // Prämienregion). Von Amtes wegen aus den Steuerdaten (Art. 10 RB 20.2213). Keine publizierte
  // Einkommensgrenze — die 90'000 gelten nur für den Mindestanspruch der Kinder.
  UR: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteAutoTaxData',
    beleg: { quelle: 'RB 20.2213 · Steuerungsgrössen 2026 (GSUD Uri) · SVS Uri — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-28' } },
  SZ: { maxIncome: 48000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyCompensation', beleg: null },
  // OW (K31): eigenes Modell in config/ipvObwalden.js (Richtprämien minus linear-progressiver
  // Selbstbehalt, harte Grenze 50 000 / mit Kindern 75 000 anrechenbares Einkommen, eine Region).
  // Die Grenze hängt am Haushalt, darum steht sie im Ergebnis, nicht hier. Antrag bei der
  // Ausgleichskasse Obwalden (GDB 851.11 Art. 10).
  OW: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyCompensation',
    beleg: { quelle: 'GDB 851.12 · GDB 851.11 · GDB 851.1 · Ausgleichskasse Obwalden — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-28' } },
  NW: { maxIncome: 45000, subsidySingle: 2250, subsidyFamily: 4500, subsidyChild: 1125, modelKey: 'ipv.modelFlat', noteKey: 'ipv.noteApplySocialOffice', beleg: null },
  GL: { maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, modelKey: 'ipv.modelFlat', noteKey: 'ipv.noteAutoTaxData', beleg: null },
  // ZG (K31): eigenes Modell in config/ipvZug.js (Richtprämien minus 8 % Selbstbehalt, Kürzung ab
  // 70'000, kein Anspruch über 89'900 — eine Grenze für alle, RRB 2025 Ziff. 1.5). ZG rechnet einen
  // Betrag; «kein Anspruch» nur auf einer Untergrenze des Reineinkommens. maxIncome null: die 89'900
  // gelten für das massgebende Einkommen, nicht für den erfassten Lohn.
  ZG: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyCompensation',
    beleg: { quelle: 'IPVG ZG (BGS 842.6) · V IPVG (BGS 842.61) · Ausgleichskasse Zug — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-28' } },
  FR: { maxIncome: 48000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyCantonalCompensation', beleg: null },
  // SO (K31): eigenes Modell in config/ipvSolothurn.js (Richtprämie minus Eigenanteil 10–16 %, linear).
  // Die Eckpunkte der linearen Skala sind nicht veröffentlicht — darum zeigt SO heute keinen Betrag,
  // nur «kein Anspruch», wo er sicher ist. Der Grenzwert 74'000 ist amtlich, aber keine Grenze, bis
  // zu der ein Betrag bestünde (für Alleinstehende endet er viel früher) — darum maxIncome null.
  SO: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyCompensation',
    beleg: { quelle: 'Parameter IPV 2026 DDI SO (27.01.2026) · SV (BGS 831.2) · SG (BGS 831.1) · AKSO — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-28' } },
  BS: { maxIncome: 54000, subsidySingle: 3000, subsidyFamily: 6000, subsidyChild: 1500, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteAutoTaxData', beleg: null },
  BL: { maxIncome: 51000, subsidySingle: 2700, subsidyFamily: 5400, subsidyChild: 1350, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplySva', noteParams: { canton: 'BL' }, beleg: null },
  SH: { maxIncome: 45000, subsidySingle: 2250, subsidyFamily: 4500, subsidyChild: 1125, modelKey: 'ipv.modelFlat', noteKey: 'ipv.noteApplyAhvBranchShort', beleg: null },
  AR: { maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, modelKey: 'ipv.modelFlat', noteKey: 'ipv.noteApplySva', noteParams: { canton: 'AR' }, beleg: null },
  AI: { maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, modelKey: 'ipv.modelFlat', noteKey: 'ipv.noteApplySocialOffice', beleg: null },
  // SG (K31): eigenes Modell in config/ipvStGallen.js (Referenzprämie minus Belastungsgrenze,
  // deren Satz MIT dem Einkommen steigt). Der Kanton publiziert keine Einkommensgrenze als
  // Zahl — sie ergäbe sich nur aus der Formel —, darum bleibt maxIncome null wie in AG.
  SG: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplySva', noteParams: { canton: 'SG' },
    beleg: { quelle: 'sGS 331.538 · sGS 331.111 · SVA St.Gallen — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-20' } },
  // GR (K31): eigenes Modell in config/ipvGraubuenden.js (Richtprämie der Region minus Selbstbehalt,
  // dessen Satz nach Einkommenskategorien von 5 % auf 10 % steigt). Keine publizierte Grenze für
  // Erwachsene — die Grenzen in Art. 8 Abs. 3 KPVG betreffen nur Kinder —, darum maxIncome null.
  GR: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplySva', noteParams: { canton: 'GR' },
    beleg: { quelle: 'KPVG (BR 542.100) · VOzKPVG (BR 542.120) · SVA Graubünden — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-28' } },
  // AG (K31): eigenes Modell in config/ipvAargau.js (Richtprämie minus 17,5 % des massgebenden
  // Einkommens). Keine Prämienregionen; die Einkommensgrenze nach § 5 Abs. 5 KVGG publiziert
  // der Kanton nicht als Zahl, darum bleibt maxIncome null und die Anzeige nennt keine Grenze.
  AG: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplySva', noteParams: { canton: 'AG' },
    beleg: { quelle: 'KVGG AG (SAR 837.200) · V KVGG (SAR 837.211) · SVA Aargau — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-20' } },
  // TG (K31): Modul config/ipvThurgau.js. Feste Ansätze nach der einfachen Steuer zu 100 % (TG KVV
  // § 14), nicht nach dem Einkommen — die App kennt diese Steuerzahl nicht und zeigt darum bewusst
  // keinen Betrag (Grund `tgSteuerbetrag`). Keine Einkommensgrenze in Franken, darum maxIncome null.
  // Antrag bei der Krankenkassenkontrollstelle der Gemeinde, nicht bei einer SVA (Merkblatt 2026).
  TG: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelFlat', noteKey: 'ipv.noteApplyKkKontrollstelle',
    beleg: { quelle: 'TG KVV (RB 832.10) § 14–15 · Amt für Gesundheit TG — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-28' } },
  // TI (K31): eigenes Modell in config/ipvTicino.js (PMR − PMR × RD²/RDM², × 76,5 %). Keine
  // publizierte Einkommensgrenze — das IAS verweist auf seinen Rechner —, darum maxIncome null.
  TI: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyIas',
    beleg: { quelle: 'LCAMal (RL 853.100) · RL 853.310 · RLCAMal (RL 853.110) · RL 870.130 · IAS — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-28' } },
  // VD (K31): Grenze und Höchstbetrag hängen an der Kategorie (Arrêté 2026 art. 2) — keine Einzelwerte.
  // Der Weg ist ein Antrag (Notice OVAM 2026 Ziff. 4), nicht die automatische Prüfung via Steuerdaten.
  VD: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyOvam',
    beleg: { quelle: 'Arrêté CE VD du 17.12.2025 (subsides 2026) · RLVLAMal (BLV 832.01.1) · LVLAMal (BLV 832.01) · LHPS (BLV 850.03) · OVAM — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-28' } },
  VS: { maxIncome: 45000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyHealthService', beleg: null },
  // NE (K31): Klassen S1–S15, Grenzen je Kinderzahl (Annexe RSN 821.102) — keine Einzelwerte.
  // Weg: automatisch nach der Veranlagung, neu Berechtigte mit Antwortschein innert 30 Tagen (RALILAMal Art. 31).
  NE: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteAutoOcab',
    beleg: { quelle: 'RSN 821.102 · Décret RSN 821.104 · LILAMal (RSN 821.10) · RALILAMal (RSN 821.101) · OCAB — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-28' } },
  // GE (K31): eigenes Modell in config/ipvGenf.js (acht Gruppen nach RDU mit festen Monatsbeträgen,
  // Gruppe 9 nur für Kinder). Die Grenze ist amtlich publiziert (LaLAMal Art. 21) und hängt an der
  // Haushaltsform — das Modul setzt sie je Fall; hier darum null wie in BE.
  // noteKey: «in der Regel automatisch» — ge.ch nennt Antragsfälle, die die App nicht erfragt
  // (Zuzug, Quellensteuer, fehlende Veranlagung, veränderte Lage); das Modul überschreibt ihn im
  // Antragsfall (Rechtsprüfung 28.09.2026: vorher stand hier `ipv.noteAutoSam` ohne Einschränkung).
  GE: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.geWegAutomatisch',
    beleg: { quelle: 'LaLAMal (rsGE J 3 05) Art. 21/22 · RaLAMal (rsGE J 3 05.01) Art. 9–10A · LRDU (rsGE J 4 06) Art. 8 · Barème subsides 2026, Service de l\'assurance-maladie (SAM) — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-28' } },
  // JU (K31): Modell in config/ipvJura.js (Stufentabelle in 1'000er-Schritten). Massgebend ist das
  // steuerbare Einkommen der Veranlagung 2024, das die App nicht kennt — darum zeigt JU bewusst
  // KEINE Zahl, sondern die Orientierung mit Grund. Weg: Prüfung von Amtes wegen durch die ECAS.
  JU: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteAutoTaxData',
    beleg: { quelle: 'Arrêté RPI 2026 (RSJU 832.115.1) · Ordonnance RSJU 832.115 · Caisse de compensation JU (ECAS) — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-28' } },
};

// Mietzins-Limite (bis zu welcher Miete die Sozialhilfe die Wohnkosten anrechnet): die App kennt
// sie NICHT. Bis 28.09.2026 stand hier eine Tabelle mit 26 Kantonen (CANTONAL_RENT_LIMITS,
// getRentLimit) — ohne Quelle und ohne Stand seit dem ersten Commit, angezeigt als «kantonale
// Mietzins-Limite» und in der Schnellrechnung als Deckel der Wohnkosten. Die Limiten legen meist
// die Gemeinden fest, nicht der Kanton. Weggelassen, nicht vereinheitlicht: wer sie belegt, führt
// sie je Gemeinde mit `beleg` ein (Bauart wie CANTONAL_IPV) — nicht als Kantonswert zurück.
// Wächter: src/config/__tests__/mietzinslimiteUnbelegt.test.js

// SKOS-Grundbedarf für den Lebensunterhalt (GBL), Stand 2025/2026 (SKOS-RL C.3.1)
// Quelle: SKOS, bestätigt via Sozialhilfehandbuch Kanton ZH + AG. Ab 8 Personen + CHF 216/Person.
// Muss mit grundbedarfFuerHaushalt() in data/sozialhilfeRechner.js übereinstimmen (Guard-Test).
export const SKOS_GRUNDBEDARF = {
  1: 1061,
  2: 1624,
  3: 1974,
  4: 2271,
  5: 2568,
  6: 2784,
  7: 3000,
};
const SKOS_GBL_PRO_WEITERE = 216;

export function getGrundbedarf(householdSize) {
  if (householdSize < 1) return SKOS_GRUNDBEDARF[1];
  if (householdSize <= 7) return SKOS_GRUNDBEDARF[householdSize];
  return SKOS_GRUNDBEDARF[7] + (householdSize - 7) * SKOS_GBL_PRO_WEITERE;
}

// Sozialhilfe-Schnellrechnung (SKOS-basiert, kantonal angepasst), Ergebnis-Art SCHÄTZUNG.
// Bedarf ↔ Einkommen rechnet data/sozialhilfeKern.js, derselbe Kern wie im ausführlichen Rechner
// (dort stehen die Quellen). Die Schnellrechnung bringt nur mit, was das Profil hergibt:
// - Erwerbseinkommen = Monatslohn + Nebenerwerb. Freibetrag (SKOS-RL D.2) nur bei Erwerbstätigkeit.
//   Der Lohn der Partnerin oder des Partners zählt als andere Einkunft ohne Freibetrag, wie im Rechner.
// - Erwerbsunkosten (SKOS-RL C.6.3): das Profil hat dafür kein Feld, deshalb 0. Bei Erwerbstätigen
//   ist der Bedarf also zu tief; `erwerbsunkostenOffen` sagt das der Anzeige, und im Rechner
//   lassen sie sich eintragen.
// - Eintritt vorsichtig ohne Freibetrag (ausser ZH/BS mit belegter Regel). `efbEntscheidet`: erst
//   der Freibetrag ergäbe einen Anspruch — ob er beim Eintritt zählt, regelt der Kanton.
export function calculateSozialhilfe(data) {
  const canton = data.basis?.canton || '';
  const hh = getHouseholdInfo(data);
  const householdSize = hh.householdSize;
  // Brutto im Profil → Netto-Richtwert (eine Regel mit dem Dashboard, utils/nettoAusProfil.js;
  // Predeploy 25.09.2026). Vorher galt jeder Monatslohn hier als netto, auch ein brutto erfasster.
  const haupt = nettoMonatAusProfil(data.finanzen?.monthlyIncome, data.finanzen?.incomeType, data.basis);
  const neben = nettoMonatAusProfil(data.finanzen?.sideIncome, data.finanzen?.sideIncomeType, data.basis);
  const erwerbseinkommen = haupt.netto + neben.netto;
  const einkommenGeschaetzt = haupt.geschaetzt || neben.geschaetzt;
  const erwerbstaetig = istErwerbstaetig(data.finanzen);
  const rent = Number(data.wohnen?.rentAmount || 0);
  const utilities = Number(data.wohnen?.utilities || 0);
  const kkPremium = Number(data.versicherungen?.kkPremium || 0);

  const grundbedarf = getGrundbedarf(householdSize);
  // Die ganze erfasste Miete, ohne Deckel: die Mietzins-Limite der Gemeinde kennt die App nicht
  // (siehe oben). Die Anzeige sagt das, statt eine Zahl zu erfinden.
  const effectiveRent = rent + utilities;
  const effectiveKK = kkPremium;

  const bilanz = sozialhilfeBilanz({
    grundbedarf, wohnkosten: effectiveRent, kvgPraemie: effectiveKK,
    erwerbseinkommen, andereEinkuenfte: hh.partnerIncome, erwerbstaetig, kanton: canton,
  });
  const totalBedarf = bilanz.bedarf;
  const income = bilanz.totalEinkommen;
  const deficit = bilanz.luecke;

  // Vermögensfreibetrag je Kanton (Tabelle + Quellen in data/sozialhilfeRechner.js;
  // ohne eigenen Eintrag: SKOS-RL D.3.1, ab 1.1.2026). Orientierung:
  // Vermögen über dem Freibetrag muss i.d.R. zuerst eingesetzt werden.
  const vermoegen = Number(data.finanzen?.securitiesValue || 0) + Number(data.finanzen?.otherAssets || 0) + Number(data.finanzen?.savingsAccount || 0);
  const minorChildren = hh.children.filter(c => (Number(c.age) || 0) < 18).length;
  const vermoegensfreibetrag = vermoegensfreibetragKanton(canton, hh.adults, minorChildren);
  const vermoegenUeberFreibetrag = Math.max(0, vermoegen - vermoegensfreibetrag);

  return {
    grundbedarf,
    effectiveRent,
    effectiveKK,
    totalBedarf,
    income,
    efb: bilanz.efb,
    anrechenbaresEinkommen: bilanz.anrechenbaresEinkommen,
    efbEntscheidet: bilanz.efbEntscheidet,
    // Einkommen aus brutto geschätzt (Anzeige: «≈ … (geschätzt)»).
    einkommenGeschaetzt,
    erwerbstaetig,
    erwerbsunkostenOffen: erwerbstaetig,
    deficit,
    eligible: deficit > 0,
    // Eine Wahrheit für die Anzeigen: ein Betrag/Anspruch, in dem die ganze Miete steckt (keine
    // Mietzins-Limite, siehe oben). Jeder Leser setzt dann `sozialhilfe.mitGanzerMiete` dazu.
    mitGanzerMiete: deficit > 0 && effectiveRent > 0,
    vermoegen,
    vermoegensfreibetrag,
    vermoegenUeberFreibetrag,
    // Vermögen erfasst UND Freibetrag kantonal nicht bestätigt (R4) — auch unter dem Freibetrag.
    vfbUnbestaetigt: vermoegen > 0 && vermoegensfreibetragUnbestaetigt(canton, minorChildren),
    householdSize,
    adults: hh.adults,
    childrenCount: hh.childrenCount,
    children: hh.children,
    isRetired: hh.isRetired,
    canton,
    noteKey: deficit > 0 ? 'sozialhilfeCalc.entitled' : 'sozialhilfeCalc.notEntitled',
    noteParams: deficit > 0 ? { value: deficit.toFixed(0) } : {},
  };
}

// Das Jahreseinkommen der Muster-Kantone (und des IPV-Pegels, data/pegel.js — derselbe Wert,
// sonst stünde der Pegel neben einer anderen Grenze-Rechnung).
// 13. Monatslohn: dieselbe Regel wie im Steuerrechner und in den Kantonsmodulen (utils/dreizehnter.js),
// nur für den Hauptlohn. Das Partnereinkommen bleibt ×12 — nach seinem 13. fragt die App nicht.
export function ipvJahreseinkommen(data, hh = getHouseholdInfo(data)) {
  return Number(data?.finanzen?.monthlyIncome || 0) * hauptlohnMonate(data?.finanzen?.dreizehnter)
    + (Number(data?.finanzen?.sideIncome || 0) + (hh.partnerIncome || 0)) * 12;
}

// Kantonale IPV-Berechnung — einkommensabhängig
// Modell: linearer Abbau der Verbilligung zwischen 0 und maxIncome.
// Bei Einkommen = 0 → voller Betrag, bei maxIncome → 0.
//
// Ergebnis-Felder (E9):
//   belegt           true nur, wenn die Kantonszeile amtlich belegt ist (beleg.quelle)
//   eligible/amount  nur bei belegtem Kanton; sonst eligible false, amount null
//   anspruchMoeglich belegt: = eligible. Unbelegt: «prüfenswert», OHNE Vergleich mit der
//                    (unbelegten) Grenze — sobald eine KK-Prämie erfasst ist
// Unbelegt gibt es keine Einschätzung aus Grenze oder Einkommen (die Muster-Grenzen sind
// in vielen Kantonen nachweislich falsch, docs/sources/ipv-kantone-2026.md, PR #161):
// immer derselbe neutrale Hinweis, weder «wahrscheinlich» noch «nicht berechtigt», und
// ohne cantonData (auch der Verfahrens-Hinweis je Kanton ist unbelegt).
//   annahmen.ohneDreizehnten  wie im Steuerrechner (steuernFuerProfil): ein Betrag steht, der
//                    Hauptlohn ist erfasst, die Frage nach dem 13. Monatslohn aber offen — gerechnet
//                    ×12. Mit 13. läge das Einkommen 8,3 % höher (13/12) und die Verbilligung tiefer.
//   annahmen.partnerOhneDreizehnten  Partnereinkommen erfasst — immer ×12 gerechnet (keine Frage dazu).
export function calculateIPV(data) {
  const r = ipvRechnen(data);
  if (!r.eligible) return r;
  const ohneDreizehnten = Number(data.finanzen?.monthlyIncome) > 0 && dreizehnterStatus(data.finanzen?.dreizehnter) === 'offen';
  // Das Partnereinkommen zählt ×12 — nach dem 13. der zweiten Person fragt die App nicht.
  const partnerOhneDreizehnten = getHouseholdInfo(data).partnerIncome > 0;
  return { ...r, annahmen: { ohneDreizehnten, partnerOhneDreizehnten } };
}

function ipvRechnen(data) {
  const canton = data.basis?.canton || '';
  const ipvData = CANTONAL_IPV[canton];
  // K118: ohne (erkannten) Kanton ist der Anspruch UNBEKANNT, nicht 0. Dieselbe Form wie ein
  // unbelegter Kanton (belegt: false, amount: null) — sonst zeigte der Rechner mit erfasstem
  // Einkommen «Nicht berechtigt» und «CHF 0», eine Aussage, für die jede Grundlage fehlt.
  if (!ipvData) return { eligible: false, belegt: false, amount: null, anspruchMoeglich: false, noteKey: 'ipv.cantonUnknown', noteParams: {}, canton };

  const hh = getHouseholdInfo(data);
  const income = ipvJahreseinkommen(data, hh);
  const childrenCount = hh.childrenCount;
  // Junge Erwachsene 19–25 in Ausbildung haben in den meisten Kantonen eine
  // eigene (oft höhere) IPV-Kategorie. Die Kinderverbilligung hier gilt für
  // Kinder bis 18 — junge Erwachsene werden separat als Hinweis ausgewiesen.
  const youngAdultsCount = (hh.children || []).filter(c => {
    const age = Number(c.age);
    return age >= 19 && age <= 25;
  }).length;

  const orientierung = (offen) => ({
    eligible: false, belegt: false, amount: null, noteKey: 'ipv.orientierungOffen',
    anspruchMoeglich: Number(data.versicherungen?.kkPremium) > 0, youngAdultsCount, canton, ...(offen && { offen }),
  });
  if (!(ipvData.beleg && ipvData.beleg.quelle)) return orientierung();
  // K31: ein Kanton mit Modul im Register IPV_MODULE rechnet nach seinem eigenen amtlichen Modell.
  // Solange PLZ-Daten (wo gebraucht) und Kantonsmodul noch laden: Orientierung wie ohne Beleg, nie
  // ein geratener Betrag. Ein belegter Kanton OHNE Modul fällt auf den Muster-Abbau unten zurück —
  // das ist heute keiner (Wächter: cantonalData.test.js), und so soll es bleiben.
  const modul = IPV_MODULE[canton];
  if (modul) {
    const plz = plzModul();
    if (!_module[canton] || (modul.brauchtPLZ !== false && !plz)) { preloadPLZ(); return orientierung('laden'); }
    return _module[canton][modul.fn](data, hh, ipvData, youngAdultsCount, orientierung, plz ? plz.lookupPLZ : undefined);
  }

  let maxAnnualSubsidy;
  if (childrenCount > 0) {
    maxAnnualSubsidy = ipvData.subsidyFamily + childrenCount * ipvData.subsidyChild;
  } else {
    maxAnnualSubsidy = ipvData.subsidySingle;
  }

  // Über der Grenze (income ≥ maxIncome) wird der Faktor 0 → annualSubsidy 0.
  const reductionFactor = income > 0 ? Math.max(0, 1 - (income / ipvData.maxIncome)) : 1;
  const annualSubsidy = Math.round(maxAnnualSubsidy * reductionFactor);
  const monthlySubsidy = Math.round(annualSubsidy / 12);

  if (annualSubsidy <= 0) {
    return { belegt: true, eligible: false, amount: 0, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: ipvData.maxIncome }, canton, cantonData: ipvData };
  }

  return {
    eligible: true,
    belegt: true,
    anspruchMoeglich: true,
    amount: monthlySubsidy,
    annual: annualSubsidy,
    maxAnnual: maxAnnualSubsidy,
    reductionPercent: Math.round(reductionFactor * 100),
    noteKey: ipvData.noteKey,
    noteParams: ipvData.noteParams || {},
    youngAdultsCount,
    canton,
    cantonData: ipvData
  };
}

// EL (Ergänzungsleistungen) Berechtigungsprüfung
export function checkELEligibility(data) {
  const hh = getHouseholdInfo(data);
  const income = Number(data.finanzen?.monthlyIncome || 0) + Number(data.finanzen?.sideIncome || 0) + hh.partnerIncome;
  const rent = Number(data.wohnen?.rentAmount || 0);
  const kkPremium = Number(data.versicherungen?.kkPremium || 0);
  const ahvRente = Number(data.finanzen?.ahvRente || 0);
  const ivRente = Number(data.finanzen?.ivRente || 0);
  const bvgRente = Number(data.finanzen?.bvgRente || 0);

  const totalIncome = income + ahvRente + ivRente + bvgRente;
  const totalExpenses = rent + kkPremium;
  const isAHVIV = ahvRente > 0 || ivRente > 0;

  return {
    eligible: isAHVIV && totalIncome < totalExpenses + 2000,
    isAHVIV,
    totalIncome,
    totalExpenses,
    noteKey: isAHVIV ? 'elCalc.possible' : 'elCalc.onlyAhvIv',
    noteParams: {},
  };
}
