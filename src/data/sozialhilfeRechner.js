// Sozialhilfe-Rechner nach SKOS-Richtlinien, Stand 1.1.2026
// (2. Etappe der Richtlinienrevision, von der SODK am 15.5.2025 genehmigt, in Kraft 1.1.2026:
// https://skos.ch/skos-richtlinien/laufende-richtlinienrevision, abgerufen 16.09.2026).
// Quellen: SKOS-RL Kapitel C.3–C.6 und D.3.1, Kanton Zürich Sozialhilfehandbuch
// GBL-Stand gegengeprüft 2026-07-19: SODK/SKOS empfahlen 1061 «spätestens ab 1.1.2026»,
// nächste Anpassung erst 1.1.2027 (an EL-Teuerung gekoppelt) → Tabelle 2025 gilt 2026 unverändert.
// Neu per 1.1.2026 ist der Vermögensfreibetrag (D.3.1, unten): 6000 statt 4000 Franken für
// Einzelpersonen, 12 000 für Paare (skos.ch, Artikel «Vermögensfreibetrag auch im Kanton
// Thurgau», 28.08.2025, abgerufen 16.09.2026). Datenstand deshalb 2026-01, nicht mehr 2025-01.

import { vermoegensfreibetragUnbestaetigt } from './vermoegensfreibetragUnbestaetigt.js';
import { vermoegensfreibetragKanton } from './vermoegensfreibetragKanton.js';
import { ergebnis, fehlendeAngaben, ERGEBNIS_ART } from './ergebnisArt.js';

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

// Vermögensfreibetrag je Kanton: Tabelle, Belege und Formel stehen seit K67 in
// data/vermoegensfreibetragKanton.js (hält das Hauptbundle klein). Hier nur weitergereicht.
export { vermoegensfreibetragKanton };

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

// Grundbedarf je Wohnform (SKOS-RL C.3.1 / C.3.2; Wortlaut und Beträge gegengelesen im Merkblatt
// «Grundbedarf in Wohngemeinschaften», Kantonales Sozialamt GR, V6.0 vom 7.1.2025):
// - 'allein': nur die Unterstützungseinheit lebt im Haushalt → GBL nach ihrer Grösse.
// - 'familienaehnlich': gemeinsam geführter Haushalt ohne gemeinsame Unterstützungseinheit (z. B.
//   Konkubinat, Eltern mit volljährigen Kindern) → GBL nach der GANZEN Haushaltsgrösse, davon der
//   Pro-Kopf-Anteil der unterstützten Personen (GR: 2 Pers. 812, 3 Pers. 658 p. P.).
// - 'zweckWg': Zusammenwohnen, um Wohnkosten zu sparen, Haushalt getrennt geführt → GBL nach der
//   Unterstützungseinheit, minus 10 % (GR: 955 p. P.).
// Im Zweifel gilt ein gemeinsamer Haushalt als familienähnlich — die Zweck-WG muss die unterstützte
// Person nachweisen (GR-Merkblatt Ziff. 2.1). Sonderregeln für junge Erwachsene sind kantonal und
// hier nicht abgebildet.
export const WOHNFORMEN = ['allein', 'familienaehnlich', 'zweckWg'];
export function grundbedarfNachWohnform(einheit, weiterePersonen = 0, wohnform = 'allein') {
  const weitere = Math.max(0, Math.floor(Number(weiterePersonen) || 0));
  if (wohnform === 'familienaehnlich' && weitere > 0) {
    const haushalt = einheit + weitere;
    return Math.round(grundbedarfFuerHaushalt(haushalt) / haushalt * einheit);
  }
  if (wohnform === 'zweckWg' && weitere > 0) return Math.round(grundbedarfFuerHaushalt(einheit) * 0.9);
  return grundbedarfFuerHaushalt(einheit);
}

export function berechneSozialhilfe({
  haushaltGroesse,
  wohnform = 'allein',
  weiterePersonen = 0,
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
  // haushaltGroesse = Grösse der Unterstützungseinheit (Erwachsene + Kinder); Mitbewohnende
  // ausserhalb der Einheit kommen über weiterePersonen + wohnform dazu.
  if (haushaltGroesse == null) haushaltGroesse = adults + kinderImHaushalt;
  const gbl = grundbedarfNachWohnform(haushaltGroesse, weiterePersonen, wohnform);
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
  // Vermögen erfasst UND der Freibetrag dieses Kantons ist kantonal nicht bestätigt.
  const vfbUnbestaetigt = vermoegen > 0 && vermoegensfreibetragUnbestaetigt(kanton, minderjaehrigeKinder);

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
    vfbUnbestaetigt,
    haushaltGroesse,
    kinderImHaushalt,
    wohnform: Number(weiterePersonen) > 0 ? wohnform : 'allein',
    weiterePersonen: Math.max(0, Math.floor(Number(weiterePersonen) || 0)),
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

// O3 — Ergebnis-Art des SKOS-Rechners: SCHÄTZUNG (Fachprüfung swiss-precision, 24.09.2026, PR #345).
// Grundbedarf und Vermögensfreibetrag folgen Richtlinien und Kantonsrecht, aber: Miete ohne
// Mietzins-Obergrenze der Gemeinde, KVG-Prämie ohne Prämienverbilligung, keine medizinische
// Grundversorgung und keine situationsbedingten Leistungen im Bedarf, Einkommensfreibetrag und
// Integrationszulage für alle Kantone gleich. Der Sozialdienst rechnet anders.
//
// Fehlend: ein LEERES Feld fehlt, eine eingetragene 0 ist eine Antwort (heute macht der Rechner aus
// «leer» still 0 — beim Einkommen und Vermögen zu hoch, bei Miete oder Prämie zu tief).
//   miete, kvgPraemie      je einzeln — gerechnet wird schon, sobald eines von beiden da ist
//   erwerbseinkommen       leer → zählt als 0 → Anspruch zu hoch
//   vermoegen              leer → zählt als 0 → Freibetrag nie überschritten
//   kanton                 nur wenn Vermögen erfasst ist: ohne Kanton gilt der SKOS-Standardfreibetrag
const leer = (v) => v == null || String(v).trim() === '';
export function sozialhilfeErgebnis({ miete, kvgPraemie, erwerbseinkommen, vermoegen, kanton }) {
  return ergebnis(ERGEBNIS_ART.SCHAETZUNG, {
    fehlend: fehlendeAngaben({
      miete: !leer(miete),
      kvgPraemie: !leer(kvgPraemie),
      erwerbseinkommen: !leer(erwerbseinkommen),
      vermoegen: !leer(vermoegen),
      kanton: !(Number(vermoegen) > 0) || !!kanton,
    }),
  });
}
