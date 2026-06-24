// Sozialhilfe-Rechner nach SKOS-Richtlinien (Stand 1.1.2025)
// Quellen: SKOS-RL Kapitel C.3–C.6, Kanton Zürich Sozialhilfehandbuch

export const SKOS_DATA_VERSION = '2025-01';

// GBL = Grundbedarf für den Lebensunterhalt (SKOS C.3.1, ab 1.1.2025)
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

  // Vermögensfreibetrag (SKOS C.7): CHF 4'000 Einzelperson, +2'000 pro weitere
  const vermoegensfreibetrag = 4000 + Math.max(0, haushaltGroesse - 1) * 2000;
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
