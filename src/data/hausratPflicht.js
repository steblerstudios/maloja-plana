// Kantone mit obligatorischer Hausrat- bzw. Mobiliarversicherung (nur Feuer und Elementar; Diebstahl, Wasser, Glas
// bleiben freiwillig). Fachprüfung 01.11.2026:
//   NW  belegt: NSVG Art. 27 Abs. 1 und Art. 2 Abs. 1 (PDF der Nidwaldner Sachversicherung, Stand 1.10.2020).
//   VD  über das Amt belegt: ECA Vaud nennt die Pflicht nach der LAIEN; der Erlass selbst ist nicht gelesen.
//   FR, JU  NICHT belegt: die Anstalten nennen nur Gebäude, die Erlasse waren nicht lesbar. Darum `unbelegt`: die App
//           sagt dort «je nach Kanton Pflicht», bis der Erlass gelesen ist.
//   Übrige 22 Kantone: nicht geprüft.
//
// verify: true — Entscheid Stebler Studios 27.10.2026: «Hausrat-Pflicht je Kanton mit Prüf-Vermerk». Solange das Flag
// steht, steht der Vermerk bei jedem Kanton. Erst entfernen, wenn alle Erlasse nachgelesen und hier zitiert sind.
export const HAUSRAT_PFLICHT = {
  kantone: ['NW', 'VD'],
  unbelegt: ['FR', 'JU'],
  verify: true,
};

// 'pflicht' | 'freiwillig' | 'unbekannt' (Kanton nicht erfasst)
export function hausratPflicht(kanton) {
  const k = String(kanton || '').trim().toUpperCase();
  if (!k || HAUSRAT_PFLICHT.unbelegt.includes(k)) return 'unbekannt';
  return HAUSRAT_PFLICHT.kantone.includes(k) ? 'pflicht' : 'freiwillig';
}
