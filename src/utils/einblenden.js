// Leises Einblenden beim Wechsel der Ansicht (25.09.2026).
//
// Vorher wechselte das Bild hart: Übersicht weg, Kapitel da. Jetzt kommt die neue Ansicht
// in einer Viertelsekunde herein — nur über die Deckkraft (Animation `mp-einblenden` in
// tokens.css). Bewusst OHNE Verschieben: ein transform auf <main> machte es während der
// Animation zum Bezugsrahmen für jedes position:fixed darin (Schubladen, Hinweise).
//
// Als CSS-Klasse, nicht per Web-Animations-API: so gilt der Block für reduzierte Bewegung
// in tokens.css von selbst (Gerät UND Schalter in der App), und das Hauptbündel trägt nur
// diese paar Zeilen — gemessen 25.09.2026 blieben dort 310 Byte Luft.
//
// Nicht bei «Zurück»: dort springt die Seite an die alte Stelle (merkeStelle), und ein
// Aufblenden darüber sähe aus wie ein Flackern.
export function blendeEin(el, { zurueck = false } = {}) {
  if (!el || zurueck || !el.classList) return false;
  el.classList.remove('mp-einblenden');
  void el.offsetWidth; // Animation neu starten, auch wenn die Klasse schon sass
  el.classList.add('mp-einblenden');
  return true;
}
