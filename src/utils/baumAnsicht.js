// Welche Baum-Ansicht ist eingestellt? Reine Logik, damit sie testbar bleibt.
//
// Standard ist die RÄUMLICHE Ansicht (Entscheid Stebler Studios, 20.09.2026).
// Wer umschaltet, bekommt seine Wahl gemerkt — beim nächsten Besuch steht der
// Baum so da, wie man ihn verlassen hat.
//
// Der Speicher darf nie den Ausschlag geben, ob die Seite überhaupt lädt:
// im Privat-Modus wirft der Zugriff, und dann gilt still der Standard.

export const BAUM_ANSICHT_KEY = 'or5_baumAnsicht';

/** true = räumlich. Ohne gespeicherte Wahl: räumlich. */
export function baumAnsichtLesen(speicher) {
  try {
    const s = speicher || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!s) return true;
    const wert = s.getItem(BAUM_ANSICHT_KEY);
    if (wert === 'flach') return false;
    if (wert === 'raeumlich') return true;
    return true; // nichts gespeichert → Standard
  } catch {
    return true; // Speicher gesperrt → Standard, nie ein Absturz
  }
}

/** Merkt die Wahl. Schlägt das fehl, bleibt die Ansicht trotzdem umgeschaltet. */
export function baumAnsichtSchreiben(raeumlich, speicher) {
  try {
    const s = speicher || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!s) return false;
    s.setItem(BAUM_ANSICHT_KEY, raeumlich ? 'raeumlich' : 'flach');
    return true;
  } catch {
    return false;
  }
}
