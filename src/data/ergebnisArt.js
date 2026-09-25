// O3 — Ergebnis-Art als festes Feld (Bauliste §8.2, MP-034/036).
//
// WARUM ES DIESE DATEI GIBT
// Bis zum 24.09.2026 sagte jeder Rechner selbst, was für ein Ergebnis er liefert — mit eigenen
// Wörtern: «Orientierung», «Geschätzt», «Grobe Schätzung», «Berechnung nach …», «Einschätzung».
// Dasselbe Wort bedeutete an zwei Stellen Verschiedenes (der SKOS-Rechner nennt sich
// «Berechnung», die Sozialhilfe-Ansicht daneben «Orientierung»). Hier stehen die vier Arten EINMAL,
// mit fester Bedeutung. Ein Rechner wählt eine davon; er erfindet keine fünfte.
//
// DIE VIER ARTEN — von der genausten zur vorsichtigsten
//   berechnung    Rechnet nach den geltenden Regeln mit allen Angaben, die die Regel braucht.
//                 Das Ergebnis sollte dem der zuständigen Stelle entsprechen. Verbindlich ist es
//                 trotzdem nicht — entscheiden tut die Stelle.
//   schaetzung    Ein Betrag nach amtlichen Eckwerten (Gesetz, Verordnung, amtliche Tabelle), aber
//                 mit Vereinfachungen oder Annahmen, die die Stelle nicht macht.
//   vorpruefung   Prüft, ob ein Anspruch infrage kommt — ohne Betrag. Den Anspruch prüft die Stelle.
//   orientierung  Eine Grössenordnung oder ein Richtwert ohne Rechnung nach amtlicher Regel für den
//                 Einzelfall (z. B. ein Anbieter-Richtwert mal Stunden).
//
// 🛑 WAHRHEITS-DISZIPLIN
// Im Zweifel die vorsichtigere Art. Ein Rechner wird nicht auf «berechnung» hochgestuft, weil sein
// Code sauber aussieht, sondern erst, wenn belegt ist, dass er rechnet wie die Stelle. Am
// 24.09.2026 ist KEIN Rechner als «berechnung» eingestuft.
//
// «NOCH n ANGABEN NÖTIG»
// `fehlend` ist die Liste der Angaben, ohne die das Ergebnis unvollständig ist — als stabile
// Namen (z. B. 'bruttolohn'), nicht als Anzeige-Text. Die Anzeige nennt nur die Zahl; die Namen
// bleiben für den späteren «Nächsten Schritt» (O7) im Feld.

export const ERGEBNIS_ART = Object.freeze({
  BERECHNUNG: 'berechnung',
  SCHAETZUNG: 'schaetzung',
  VORPRUEFUNG: 'vorpruefung',
  ORIENTIERUNG: 'orientierung',
});

// Reihenfolge: genauste zuerst, vorsichtigste zuletzt.
export const ERGEBNIS_ARTEN = Object.freeze([
  ERGEBNIS_ART.BERECHNUNG,
  ERGEBNIS_ART.SCHAETZUNG,
  ERGEBNIS_ART.VORPRUEFUNG,
  ERGEBNIS_ART.ORIENTIERUNG,
]);

export function istErgebnisArt(art) {
  return ERGEBNIS_ARTEN.includes(art);
}

// Das feste Feld. Eine unbekannte Art ist ein Programmierfehler und fällt laut aus — still auf
// eine Art auszuweichen, würde genau das verstecken, was dieses Feld sichtbar machen soll.
export function ergebnis(art, { fehlend = [] } = {}) {
  if (!istErgebnisArt(art)) {
    throw new TypeError('Unbekannte Ergebnis-Art: ' + String(art) + ' (erlaubt: ' + ERGEBNIS_ARTEN.join(', ') + ')');
  }
  const liste = Array.isArray(fehlend) ? fehlend.filter(Boolean) : [];
  return Object.freeze({ art, fehlend: Object.freeze([...new Set(liste)]) });
}

// Aus { name: vorhanden? } die Namen der fehlenden Angaben — in der Reihenfolge des Objekts.
export function fehlendeAngaben(angaben) {
  return Object.keys(angaben || {}).filter((name) => !angaben[name]);
}

// Der eine Satz für die Anzeige: i18n-Schlüssel und Parameter. Rein, damit testbar.
//   ergebnisArt.satz.<art>    die Art mit ihrer Bedeutung (ohne Punkt)
//   ergebnisArt.vollstaendig  '{satz}.'
//   ergebnisArt.fehltEine     '{satz}. Noch eine Angabe nötig.'
//   ergebnisArt.fehltMehrere  '{satz}. Noch {n} Angaben nötig.'
export function ergebnisSatz(e, t) {
  const satz = t('ergebnisArt.satz.' + e.art);
  const n = e.fehlend.length;
  if (n === 0) return t('ergebnisArt.vollstaendig', { satz });
  if (n === 1) return t('ergebnisArt.fehltEine', { satz });
  return t('ergebnisArt.fehltMehrere', { satz, n });
}
