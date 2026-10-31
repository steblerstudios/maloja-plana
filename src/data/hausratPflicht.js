// Kantone mit obligatorischer Hausrat- bzw. Mobiliarversicherung (nur Feuer und Elementar; Diebstahl, Wasser, Glas
// bleiben freiwillig). Stand: Fachprüfung swiss-precision-pruefer 27.10.2026, ohne Webzugriff; Vergleichsdienste
// nennen dieselben vier. Waadt: ECA Vaud (LAIEF); Nidwalden: Nidwaldner Sachversicherung; Freiburg und Jura: Pflicht,
// Abschluss bei privaten Versicherern.
//
// verify: true — die Erlasse und Artikel aller vier Kantone sind NICHT belegt (Entscheid Stebler Studios 27.10.2026:
// «Hausrat-Pflicht je Kanton mit Prüf-Vermerk»). Solange das Flag steht, sagt die App «bitte bei der kantonalen
// Gebäudeversicherung bestätigen». Erst entfernen, wenn die vier Erlasse nachgelesen und hier zitiert sind.
export const HAUSRAT_PFLICHT = {
  kantone: ['NW', 'FR', 'JU', 'VD'],
  verify: true,
};

// 'pflicht' | 'freiwillig' | 'unbekannt' (Kanton nicht erfasst)
export function hausratPflicht(kanton) {
  const k = String(kanton || '').trim().toUpperCase();
  if (!k) return 'unbekannt';
  return HAUSRAT_PFLICHT.kantone.includes(k) ? 'pflicht' : 'freiwillig';
}
