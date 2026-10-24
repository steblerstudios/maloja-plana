// Systemblick — derselbe Musterhaushalt, 26 Kantone (Prototyp, Konzept: docs/STATISTIK-SYSTEMBLICK.md).
//
// Sozioökonomische Statistik OHNE Nutzerdaten, Stufe 1: Maloja zählt keine Personen, sondern rechnet
// erfundene Musterhaushalte durch die amtlich belegten Kantonsmodelle, die die App ohnehin hat
// (Prämienverbilligung: config/cantonalData.js → IPV_MODULE, Wortlaute docs/sources/ipv-kantone-2026.md).
// Es entsteht keine neue Zahl ohne Beleg: jeder Betrag ist das, was die App einer Person mit genau
// diesem Profil im Rechner zeigen würde.
//
// Grenzen (gehören zu jeder Darstellung, siehe Konzept):
// - Die App rechnet mit dem Nettolohn; die Kantone mit ihrem eigenen massgebenden Einkommen.
//   Das ist dieselbe Vereinfachung wie im Rechner — kein amtlicher Kantonsvergleich.
// - Kantone, deren Modell bewusst keine Zahl zeigt (z. B. nach Steuerbetrag), erscheinen als
//   «keine Zahl» mit ihrem Grund — nie als 0 und nie geschätzt.
// - Ein Wohnort je Kanton: der Hauptort. In Kantonen mit Prämienregionen gilt der Betrag nur dort.
import { CANTON_CODES, calculateIPV, ladeIPVModelle } from '../config/cantonalData.js';

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

// Musterhaushalte — erfunden, keine Personen. Nettolohn pro Monat ohne 13. (ausdrücklich «nein»,
// damit kein Kanton mit der offenen Frage rechnet), Prämie = Summe des Haushalts pro Monat.
export const MUSTERHAUSHALTE = {
  einzel: {
    bezeichnung: 'Eine erwachsene Person, erwerbstätig',
    basis: { dateOfBirth: '1985-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
    praemie: 450,
  },
  alleinerziehend: {
    bezeichnung: 'Eine erwachsene Person, ein Kind (7)',
    basis: { dateOfBirth: '1988-05-01', maritalStatus: 'single', household: { adults: 1, children: [{ age: 7 }] } },
    praemie: 560,
  },
  familie: {
    bezeichnung: 'Ehepaar, zwei Kinder (4 und 10), ein Einkommen',
    basis: { dateOfBirth: '1984-05-01', maritalStatus: 'married', household: { adults: 2, children: [{ age: 4 }, { age: 10 }], partnerIncome: 0 } },
    praemie: 1120,
  },
};

// Ein Profil in der Form, die die App speichert (wie data in calculateIPV).
export function musterProfil(kanton, haushalt, monatsNetto) {
  const h = MUSTERHAUSHALTE[haushalt];
  const ort = HAUPTORTE[kanton];
  if (!h || !ort) throw new Error(`Systemblick: unbekannt ${kanton}/${haushalt}`);
  return {
    basis: { ...h.basis, canton: kanton },
    finanzen: { monthlyIncome: monatsNetto, employmentType: 'employed', dreizehnter: 'nein' },
    wohnen: { postalCode: ort.plz, city: ort.ort },
    // Ordentliche Franchise (CHF 300): ohne Angabe zeigt NE bewusst keine Zahl (Kürzung bei Wahlfranchise).
    versicherungen: { kkPremium: h.praemie, franchise: '300' },
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

// Ein Musterhaushalt bei einem Nettolohn durch alle 26 Kantone. Wartet, bis alle Kantonsmodelle
// geladen sind — sonst stünden Kantone auf «laden» und die Auswertung wäre zufällig unvollständig.
export async function systemblickIPV(haushalt, monatsNetto) {
  await ladeIPVModelle();
  const zeilen = CANTON_CODES.map((kt) => einordnen(kt, calculateIPV(musterProfil(kt, haushalt, monatsNetto))));
  const offenLaden = zeilen.filter((z) => z.grund === 'laden');
  if (offenLaden.length) throw new Error(`Systemblick: Modelle nicht geladen (${offenLaden.map((z) => z.kanton).join(', ')})`);
  return { haushalt, monatsNetto, zeilen, kennzahlen: kennzahlen(zeilen) };
}
