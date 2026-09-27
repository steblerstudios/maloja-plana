// ─── Auswahl-Feld: gespeicherter Schlüssel → Anzeige ─────────────────────────
// Auswahlfelder speichern einen Schlüssel (`bachelor`, `f1500`, `standard`), angezeigt
// werden muss das Etikett der Sprache (`Bachelor`, `1’500`, `Standard (freie Arztwahl)`).
// Befund Seitenrundgang 27.09.2026: dieselbe Fehlerklasse an mehreren Stellen —
// Blutgruppe «aPos», Lebenslauf «bachelor», Dashboard «Franchise f1500, standard».
// Eine Funktion für alle; zivilstandLabel und blutgruppeLabel sind Sonderfälle davon.
//
// Leer ergibt ''. Unbekannte Werte (von Hand importiert, Freitext aus alten Ständen)
// erscheinen unverändert statt als Schlüsselpfad.
export function auswahlLabel(kapitel, feld, wert, t) {
  const w = String(wert ?? '').trim();
  if (!w) return '';
  if (typeof t !== 'function') return w;
  const schluessel = 'chapters.' + kapitel + '.fields.' + feld + '.options.' + w;
  const text = t(schluessel);
  return typeof text === 'string' && text && text !== schluessel ? text : w;
}
