// Auswahl aus einer Jahrestabelle `{ 2026: {...}, 2027: {...} }` nach Stichtag.
//
// Warum es das gibt (Entscheid Stebler Studios 21.10.2026, «Weg A»): Die Bundeswerte 2027 sind beschlossen
// und publiziert, gelten aber erst ab dem 1.1.2027. Ein Tausch der Konstanten hätte ab dem Deploy
// gewirkt, also im Dezember schon die Renten 2027 gezeigt. Mit der Tabelle kann im Dezember
// ausgeliefert werden, und am 1.1. schaltet die App von selbst um.
//
// Bewusst ein Blatt ohne eigene Importe: lohnAbzuege.js liegt im Startbündel.
//
// Regel für Jahre ausserhalb der Tabelle:
//   • nach dem letzten belegten Jahr → das letzte belegte Jahr. Das ist genau das Verhalten vor
//     der Tabelle (die Konstanten galten weiter, bis jemand sie nachtrug). Damit das nicht still
//     passiert, trägt das Ergebnis `jahr` (das Jahr der Werte) und `belegt: false`. Wer eine
//     Jahreszahl anzeigt, zeigt `jahr`, nicht das Stichtagsjahr.
//   • vor dem ersten belegten Jahr → das erste. Ältere Jahre führt die App nicht.
// Anders als `saeule3aMaximum` (gibt `null`): Ein AHV- oder BVG-Rechner ohne Werte zeigte gar nichts,
// und die Werte des Vorjahres sind bis zur Anpassung die geltenden.
//
// `stichtag`: ein Datum, ein Datums-String oder eine Jahreszahl (2027). Fehlt/`null`/unlesbar → heute.
export function werteFuerStichtag(tabelle, stichtag = new Date()) {
  const jahre = Object.keys(tabelle).map(Number).sort((a, b) => a - b);
  const d = stichtag == null ? new Date() : stichtag instanceof Date ? stichtag : new Date(stichtag);
  const gewuenscht = Number.isInteger(stichtag) && stichtag > 1900 && stichtag < 3000 ? stichtag
    : Number.isFinite(d.getTime()) ? d.getFullYear() : new Date().getFullYear();
  const jahr = tabelle[gewuenscht] ? gewuenscht
    : gewuenscht > jahre[jahre.length - 1] ? jahre[jahre.length - 1] : jahre[0];
  return { ...tabelle[jahr], jahr, belegt: jahr === gewuenscht };
}
