// B5 · Was «In den Stand übernehmen» im Probier-Modus tut.
//
// Der Probier-Modus hält eine Kopie des Stands; «Übernehmen» ersetzt den gespeicherten
// Stand durch diese Kopie. Nach «Leer starten» ist die Kopie aber `{}` plus das, was
// seither getippt wurde — ein einziges Feld genügte, und alle übrigen Kapitel waren
// weg (Voll-Audit 10/2026). Darum nach einem Leer-Start zuerst nachfragen.
//
// Bewusst kein Einmischen der geänderten Felder: Rechner schreiben ganze Listen und
// Unterobjekte (Schulden, Organspende, KVG), ein Feld-für-Feld-Mischen setzte
// Probezahlen still neben echte. Die Frage ist kleiner und lässt nichts im Unklaren.
//
//   nichts   — leere Probe: Modus verlassen, Stand unberührt (wie bisher)
//   fragen   — nach Leer-Start, noch nicht bestätigt: Stand unberührt, Frage zeigen
//   ersetzen — Stand durch die Probe ersetzen
export function probeUebernehmen({ probe, leerGestartet, bestaetigt }) {
  if (!probe || Object.keys(probe).length === 0) return { aktion: 'nichts' };
  if (leerGestartet && !bestaetigt) return { aktion: 'fragen' };
  return { aktion: 'ersetzen', stand: probe };
}
