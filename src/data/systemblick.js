// Systemblick — derselbe Musterhaushalt, 26 Kantone (Prototyp, Konzept: docs/STATISTIK-SYSTEMBLICK.md).
//
// Sozioökonomische Statistik OHNE Nutzerdaten, Stufe 1: Maloja zählt keine Personen, sondern rechnet
// erfundene Musterhaushalte durch die amtlich belegten Kantonsmodelle, die die App ohnehin hat
// (Prämienverbilligung: config/cantonalData.js → IPV_MODULE, Wortlaute docs/sources/ipv-kantone-2026.md).
// Es entsteht keine neue Zahl ohne Beleg: jeder Betrag ist das, was die App einer Person mit genau
// diesem Profil im Rechner zeigen würde.
//
// Grenzen (gehören zu jeder Darstellung, siehe Konzept):
// - Die App rechnet mit dem Nettolohn (hier aus dem BAG-Brutto hergeleitet); die Kantone mit
//   ihrem eigenen massgebenden Einkommen.
//   Das ist dieselbe Vereinfachung wie im Rechner — kein amtlicher Kantonsvergleich.
// - Kantone, deren Modell bewusst keine Zahl zeigt (z. B. nach Steuerbetrag), erscheinen als
//   «keine Zahl» mit ihrem Grund — nie als 0 und nie geschätzt.
// - Ein Wohnort je Kanton: der Hauptort. In Kantonen mit Prämienregionen gilt der Betrag nur dort.
import { CANTON_CODES, calculateIPV, ladeIPVModelle } from '../config/cantonalData.js';
import { lookupPLZ } from './plzGemeinde.js';
import { getAveragePremium } from './praemienRegionen.js';
import { bruttoZuNettoRichtwert } from './lohnAbzuege.js';

// Hauptort je Kanton (Sitz der Kantonsregierung) mit einer seiner Postleitzahlen. Der Test prüft
// gegen data/plzGemeinde.js, dass PLZ und Gemeinde wirklich im Kanton liegen.
export const HAUPTORTE = {
  ZH: { plz: '8001', ort: 'Zürich' },
  BE: { plz: '3011', ort: 'Bern' },
  LU: { plz: '6003', ort: 'Luzern' },
  UR: { plz: '6460', ort: 'Altdorf (UR)' },
  SZ: { plz: '6430', ort: 'Schwyz' },
  OW: { plz: '6060', ort: 'Sarnen' },
  NW: { plz: '6370', ort: 'Stans' },
  GL: { plz: '8750', ort: 'Glarus' },
  ZG: { plz: '6300', ort: 'Zug' },
  FR: { plz: '1700', ort: 'Fribourg' },
  SO: { plz: '4500', ort: 'Solothurn' },
  BS: { plz: '4051', ort: 'Basel' },
  BL: { plz: '4410', ort: 'Liestal' },
  SH: { plz: '8200', ort: 'Schaffhausen' },
  AR: { plz: '9100', ort: 'Herisau' },
  AI: { plz: '9050', ort: 'Appenzell' },
  SG: { plz: '9000', ort: 'St. Gallen' },
  GR: { plz: '7000', ort: 'Chur' },
  AG: { plz: '5000', ort: 'Aarau' },
  TG: { plz: '8500', ort: 'Frauenfeld' },
  TI: { plz: '6500', ort: 'Bellinzona' },
  VD: { plz: '1003', ort: 'Lausanne' },
  VS: { plz: '1950', ort: 'Sion' },
  NE: { plz: '2000', ort: 'Neuchâtel' },
  GE: { plz: '1204', ort: 'Genève' },
  JU: { plz: '2800', ort: 'Delémont' },
};

// Die sieben Modellhaushalte des BAG-Monitorings (Ecoplan im Auftrag des BAG, «Wirksamkeit der
// Prämienverbilligung – Monitoring 2020», Mai 2022, S. 12, Abb. K-2) — damit die Zahlen an die
// amtliche Reihe anschliessen. Bezeichnung und Bruttoeinkommen wörtlich von dort («Bruttoarbeits- oder
// -renteneinkommen exkl. Familienzulagen»). Von Maloja GESETZT (das BAG nennt es nicht):
//   - Geburtsjahre der Erwachsenen; Kinderalter ganzzahlig (BAG «3.5 Jahre» → 3)
//   - Rentnerin: AHV-Maximalrente 2026 (CHF 2'520, data/ahvRechner.js) + Rest als BVG-Rente
//   - Netto aus Brutto mit dem App-Richtwert (bruttoZuNettoRichtwert: AHV/IV/EO, ALV, PK-Anteil);
//     ohne 13., Brutto ÷ 12. OHNE Familienzulagen — das BAG rechnet sie zum Nettoeinkommen dazu
//     (Anhang B, S. 132, Abb. B-2: z. B. Haushalt 3 + CHF 5'575); die App fragt nicht danach.
//   - Vermögen 0 (kein Feld gesetzt → vermoegenSumme 0). Alle Kantone rechnen einen Teil des Vermögens
//     an (BAG S. 11); das BAG nennt für die Modellhaushalte in Anhang B (S. 131–134) keine Annahme dazu.
//   - Prämie = regionale Durchschnittsprämie 2026 am Hauptort je Person, Standardmodell, alle Versicherer
//     (data/praemienRegionen.js). Das ist WEDER die «Standardprämie» des Monitorings (teuerste Region
//     des Kantons) NOCH dessen «Mittlere Prämie» (effektiv bezahlt, mit Wahlmodellen und hohen
//     Franchisen) — beide BAG S. 134. Welche Franchisen der Durchschnitt mischt, ist nicht geprüft;
//     zusammen mit Franchise 300 unten ist das Profil eine Vereinfachung, kein realer Versicherungsvertrag.
// Haushalte mit zwei Erwachsenen (2, 4, 5, 7) und junge Erwachsene 19–25 (6) rechnet heute kein
// Kantonsmodell in Maloja (24 Kantone stoppen am Riegel `mehrereErwachsene` bzw. am Alter; TG und JU
// schon vorher an der Steuergrösse): sie stehen trotzdem in der Tabelle, damit die Lücke sichtbar bleibt.
export const MUSTERHAUSHALTE = {
  bag1: {
    bezeichnung: 'BAG 1 · Alleinstehende Rentnerin', bruttoJahr: 45000, rente: true,
    erwachsene: ['1955-05-01'], kinder: [], maritalStatus: 'single',
  },
  bag2: {
    bezeichnung: 'BAG 2 · Familie mit zwei Kindern (3.5 und 5 Jahre)', bruttoJahr: 70000,
    erwachsene: ['1986-05-01', '1986-05-01'], kinder: [3, 5], maritalStatus: 'married',
  },
  bag3: {
    bezeichnung: 'BAG 3 · Einelternfamilie mit zwei Kindern (3.5 und 5 Jahre)', bruttoJahr: 60000,
    erwachsene: ['1988-05-01'], kinder: [3, 5], maritalStatus: 'single',
  },
  bag4: {
    bezeichnung: 'BAG 4 · Familie mit vier Kindern (3.5, 5, 8, 10 Jahre)', bruttoJahr: 85000,
    erwachsene: ['1984-05-01', '1984-05-01'], kinder: [3, 5, 8, 10], maritalStatus: 'married',
  },
  bag5: {
    bezeichnung: 'BAG 5 · Familie mit einem Kind (16) und einer jungen Erwachsenen in Ausbildung (20)', bruttoJahr: 70000,
    erwachsene: ['1978-05-01', '1978-05-01'], kinder: [16, 20], maritalStatus: 'married',
  },
  bag6: {
    bezeichnung: 'BAG 6 · Alleinstehender junger Erwerbstätiger (24 Jahre)', bruttoJahr: 38000,
    erwachsene: ['2002-05-01'], kinder: [], maritalStatus: 'single',
  },
  bag7: {
    bezeichnung: 'BAG 7 · Ehepaar ohne Kinder', bruttoJahr: 60000,
    erwachsene: ['1971-05-01', '1971-05-01'], kinder: [], maritalStatus: 'married',
  },
};

// AHV-Maximalrente 2026 pro Monat (Skala 44) — dieselbe Zahl wie AHV_HEUTE.maxRente in data/ahvRechner.js.
const AHV_MAXRENTE_2026 = 2520;
const JAHR = 2026;

function alterIm(jahr, geburt) { return jahr - Number(geburt.slice(0, 4)); }

// Prämien-Altersklasse wie in data/praemienRegionen.js: Kind bis 18, junge Erwachsene 19–25.
function praemienKlasse(alter) { return alter < 19 ? 'kinder' : alter < 26 ? 'junge' : 'erwachsene'; }

// BFS-Nummer des Hauptorts — für die Durchschnittsprämie der Region.
export function hauptortBfs(kanton) {
  const g = lookupPLZ(HAUPTORTE[kanton].plz).find((x) => x.kanton === kanton);
  return g ? g.bfsNr : null;
}

// Haushaltsprämie pro Monat = Summe der regionalen Durchschnittsprämien 2026 am Hauptort, je Person.
export function haushaltsPraemie(kanton, h) {
  const p = getAveragePremium(hauptortBfs(kanton));
  if (!p) return null;
  const alter = [...h.erwachsene.map((g) => alterIm(JAHR, g)), ...h.kinder];
  return Math.round(alter.reduce((s, a) => s + p[praemienKlasse(a)], 0));
}

// Ein Profil in der Form, die die App speichert (wie data in calculateIPV). `bruttoJahr` ersetzt
// das BAG-Einkommen (für Schwellen-Fächer), Standard ist das des Modellhaushalts.
export function musterProfil(kanton, haushalt, bruttoJahr) {
  const h = MUSTERHAUSHALTE[haushalt];
  const ort = HAUPTORTE[kanton];
  if (!h || !ort) throw new Error(`Systemblick: unbekannt ${kanton}/${haushalt}`);
  const brutto = bruttoJahr ?? h.bruttoJahr;
  const alter = alterIm(JAHR, h.erwachsene[0]);
  const finanzen = h.rente
    ? { employmentType: 'retired', ahvRente: Math.min(AHV_MAXRENTE_2026, brutto / 12), bvgRente: Math.max(0, brutto / 12 - AHV_MAXRENTE_2026) }
    : { employmentType: 'employed', dreizehnter: 'nein', monthlyIncome: bruttoZuNettoRichtwert(brutto / 12, alter) };
  return {
    basis: {
      canton: kanton, dateOfBirth: h.erwachsene[0], maritalStatus: h.maritalStatus,
      // Kinder mit Geburtsjahr (1. Januar), nicht nur mit Alter: ohne Datum bleiben vorsichtige Kantone
      // an der Altersgrenze stehen (AR: Kinderabzug nach Jahrgang), und alle lesen dasselbe Jahr.
      // partnerIncome 0: heute ohne Wirkung (zwei Erwachsene → keine Zahl). Rechnen die Modelle einmal
      // Paare, wäre hier das ganze Haushaltsbrutto einer Person zugeordnet — dann aufteilen.
      household: { adults: h.erwachsene.length, children: h.kinder.map((age) => ({ age, birthDate: `${JAHR - age}-01-01` })), isRetired: !!h.rente, partnerIncome: 0 },
    },
    finanzen,
    wohnen: { postalCode: ort.plz, city: ort.ort },
    // Ordentliche Franchise (CHF 300): ohne Angabe zeigt NE bewusst keine Zahl (Kürzung bei Wahlfranchise).
    versicherungen: { kkPremium: haushaltsPraemie(kanton, h), franchise: '300' },
  };
}

// Ergebnis eines Kantons in drei Arten — die Darstellung darf «keine Zahl» nie wie 0 behandeln.
export function einordnen(kanton, r) {
  if (r.belegt && r.eligible && Number.isFinite(r.annual)) {
    return { kanton, art: 'betrag', jahr: r.annual, monat: r.amount, grund: r.vorbehaltKey || r.noteKey || null };
  }
  if (r.belegt && r.amount === 0) return { kanton, art: 'keinAnspruch', jahr: 0, monat: 0, grund: r.noteKey || null };
  return { kanton, art: 'keineZahl', jahr: null, monat: null, grund: r.offen || r.noteKey || r.vorbehaltKey || null };
}

// Kennzahlen über die Kantone mit Betrag. Median, nicht Durchschnitt: robust gegen einen Ausreisser.
export function kennzahlen(zeilen) {
  const betraege = zeilen.filter((z) => z.art === 'betrag').map((z) => z.jahr).sort((a, b) => a - b);
  const n = betraege.length;
  const median = n === 0 ? null : n % 2 ? betraege[(n - 1) / 2] : Math.round((betraege[n / 2 - 1] + betraege[n / 2]) / 2);
  return {
    mitBetrag: n,
    keinAnspruch: zeilen.filter((z) => z.art === 'keinAnspruch').length,
    keineZahl: zeilen.filter((z) => z.art === 'keineZahl').length,
    min: n ? betraege[0] : null,
    max: n ? betraege[n - 1] : null,
    median,
  };
}

// Ein Modellhaushalt durch alle 26 Kantone (Brutto = BAG-Wert, ausser `bruttoJahr` ist gesetzt).
// Wartet, bis alle Kantonsmodelle geladen sind — sonst stünden Kantone auf «laden» und die
// Auswertung wäre zufällig unvollständig. Je Zeile auch die verwendete Haushaltsprämie.
export async function systemblickIPV(haushalt, bruttoJahr) {
  await ladeIPVModelle();
  const zeilen = CANTON_CODES.map((kt) => {
    const profil = musterProfil(kt, haushalt, bruttoJahr);
    return { ...einordnen(kt, calculateIPV(profil)), praemieMonat: profil.versicherungen.kkPremium };
  });
  const offenLaden = zeilen.filter((z) => z.grund === 'laden');
  if (offenLaden.length) throw new Error(`Systemblick: Modelle nicht geladen (${offenLaden.map((z) => z.kanton).join(', ')})`);
  return { haushalt, bruttoJahr: bruttoJahr ?? MUSTERHAUSHALTE[haushalt].bruttoJahr, zeilen, kennzahlen: kennzahlen(zeilen) };
}
