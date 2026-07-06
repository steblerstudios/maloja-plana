// Ergänzungsleistungen für Familien (Familien-EL) — eine kantonale Bedarfsleistung,
// die erwerbstätigen Familien mit kleinen Kindern und knappem Einkommen eine monatliche
// Ergänzung zahlt, damit sie nicht auf Sozialhilfe angewiesen sind ("working poor").
// NUR wenige Kantone haben sie — deshalb kanton-bewusst wie mietzinsbeitraege.js /
// regionaleVerguenstigungen.js: nur Kantone mit web-verifizierter offizieller Seite
// sind gelistet ('has'); alle anderen zeigen den Eintrag GAR NICHT (kein falsches
// Versprechen). Kein Rechner — die Einkommensgrenzen/Regeln variieren je Kanton.
//
// Alle URLs 2026-07 einzeln web-verifiziert (offizielle Kantonsportale):
//   SO — so.ch (Familienergänzungsleistungen, Amt für Gesellschaft und Soziales)
//   VD — vd.ch (Prestations complémentaires cantonales pour familles, PC Familles)
// Bekannte Kandidaten zum Ergänzen, sobald offizielle URL verifiziert: TI (Assegni
// familiari integrativi/di prima infanzia — Pionier), evtl. GE. NICHT ungeprüft raten.

const FAMILIEN_EL = {
  SO: 'https://so.ch/verwaltung/departement-des-innern/amt-fuer-gesellschaft-und-soziales/kinder-jugendliche-und-familien/familienergaenzungsleistungen/',
  VD: 'https://www.vd.ch/aides-financieres-et-soutien-social/aides-financieres-et-comment-les-demander/pc-familles',
};

// Liefert { has, url } für einen Kanton. Kanton ohne Familien-EL → has:false (Eintrag
// wird in Lebenssituationen.jsx gar nicht gerendert).
export function getFamilienEL(canton) {
  const url = FAMILIEN_EL[(canton || '').trim()];
  return url ? { has: true, url } : { has: false, url: null };
}
