// Suche per Taste (10.11.2026): «/» und ⌘K bzw. Strg+K öffnen die Lupe — wie in vielen
// Werkzeugen am Desktop. Am Handy ohne Wirkung (keine Tastatur, kein Schaden).
//
// Zwei Fallen, die diese Prüfung abfängt:
// - «/» ist ein gewöhnliches Zeichen. Wer in einem Feld tippt («50/50», «Basel/Stadt»), darf
//   nicht aus dem Feld gerissen werden. ⌘K/Strg+K dagegen tippt niemand als Text.
// - Ein offener Dialog (Einstellungen, Tour, Menü-Schublade, Daten löschen) hält den Fokus mit
//   Absicht fest (useFocusTrap). Die Suche öffnet sich dann nicht dahinter.

const FELD_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

export const istEingabeFeld = (el) =>
  !!el && (FELD_TAGS.has(el.tagName) || el.isContentEditable === true);

export const istSuchTaste = (e, { dialogOffen = false } = {}) => {
  if (!e || e.defaultPrevented || e.isComposing || dialogOffen) return false;
  const k = typeof e.key === 'string' ? e.key.toLowerCase() : '';
  // ⌘K (Mac) oder Strg+K — ohne Umschalt/Alt, die belegen andere Programme.
  if (k === 'k' && (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) return true;
  // «/» nur ohne jede Zusatztaste und nie aus einem Eingabefeld heraus.
  if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !istEingabeFeld(e.target)) return true;
  return false;
};
