// Suche per Taste (10.11.2026): «/» und ⌘K bzw. Strg+K öffnen die Lupe — wie in vielen
// Werkzeugen am Desktop. Am Handy ohne Wirkung (keine Tastatur, kein Schaden).
//
// Diese Datei wird NACHGELADEN (main.jsx: import() nach dem ersten Zeichnen), nicht ins
// Startbündel gezogen: eingebaut kostete sie 0,37 kB gzip und das Startbündel lag danach mit
// 65,14 kB über seiner Grenze von 65 kB. Die Taste wirkt darum erst, wenn die Seite steht —
// wer in der ersten Sekunde «/» drückt, tippt einfach nichts.
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

// Hängt den Zuhörer an `fenster` (im Browser `window`). `oeffnen()` wechselt zur Suche und meldet
// mit true, dass es das getan hat (in der Einführung meldet es false: dann bleibt die Taste, was
// sie ist). Danach der Fokus ins Suchfeld: main.jsx legt ihn nach jedem Ansichtswechsel im
// nächsten Bild auf <main>, und die Suchansicht lädt selbst nach. Darum zwei Bilder warten und
// dann höchstens rund eine Sekunde (60 Bilder) nach dem Feld suchen. Gibt das Abmelden zurück.
export const suchTasteAnmelden = (oeffnen, fenster = window) => {
  const doc = fenster.document;
  const onKey = (e) => {
    if (!istSuchTaste(e, { dialogOffen: !!doc.querySelector('[aria-modal="true"]') })) return;
    if (!oeffnen()) return;
    e.preventDefault();
    let versuche = 0;
    const fassen = () => {
      const feld = doc.querySelector('[data-suchfeld]');
      // Ein früherer Begriff bleibt in der Suche stehen — markiert, damit Tippen ihn ersetzt.
      if (feld) { if (doc.activeElement !== feld) feld.focus(); if (feld.select) feld.select(); return; }
      if (versuche++ < 60) fenster.requestAnimationFrame(fassen);
    };
    fenster.requestAnimationFrame(() => fenster.requestAnimationFrame(fassen));
  };
  fenster.addEventListener('keydown', onKey);
  return () => fenster.removeEventListener('keydown', onKey);
};
