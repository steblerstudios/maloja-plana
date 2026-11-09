// Wer zählt als angestellt? Lernende sind Arbeitnehmende mit Lehrvertrag: gleich versichert, Lohn mit
// Abzügen. Nur beim Lohnvergleich und beim Mindestlohn gelten sie anders (data/lohnEinordnung.js, lohnCheck.js).
export const istLernend = (finanzen) => finanzen?.employmentType === 'apprentice';
export const istAngestellt = (finanzen) => finanzen?.employmentType === 'employed' || istLernend(finanzen);

// Ist eine angestellte Person auch gegen Unfälle in der Freizeit versichert (Kapitel 4, V1)? Nur wer bei einer
// Arbeitgeberin «mindestens acht Stunden» pro Woche arbeitet (UVV Art. 13 Abs. 1). Nur dann darf die Unfalldeckung
// bei der Krankenkasse ruhen (KVG Art. 8 Abs. 1: «obligatorisch für dieses Risiko voll gedeckt»).
//   'ja'    angestellt, Pensum der Hauptstelle ≥ 8 Std./Woche
//   'nein'  angestellt, Pensum bekannt und darunter
//   'offen' angestellt, Pensum nicht eingetragen
//   null    nicht angestellt
export function nichtberufsunfallStatus(allData) {
  if (!istAngestellt(allData?.finanzen)) return null;
  const roh = String(allData?.ausbildung?.workHoursPerWeek ?? '').replace(',', '.').trim();
  const std = Number.parseFloat(roh);
  if (!roh || !Number.isFinite(std) || std <= 0) return 'offen';
  return std >= 8 ? 'ja' : 'nein';
}
