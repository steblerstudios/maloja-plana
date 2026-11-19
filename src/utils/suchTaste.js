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

// WCAG 2.1.4 (Entscheid Stebler Studios 11.11.2026): «/» ist ein Kürzel aus einer einzigen Taste. Wer per
// Sprache steuert, löst es sonst aus Versehen aus. Darum lässt es sich in den Einstellungen abschalten
// (Barrierefreiheit). ⌘K/Strg+K bleiben immer — mit Zusatztaste gilt die Regel nicht. Im Gerät gespeichert
// wie die anderen Schalter (or5_…), Standard: an. Gelesen bei jedem Tastendruck, damit der Schalter sofort wirkt.
export const SLASH_SCHLUESSEL = 'or5_suchtaste';
export const slashAn = (speicher = globalThis.localStorage) => {
  try { return speicher?.getItem(SLASH_SCHLUESSEL) !== '0'; } catch { return true; }
};
export const slashSetzen = (an, speicher = globalThis.localStorage) => {
  try { speicher?.setItem(SLASH_SCHLUESSEL, an ? '1' : '0'); } catch { /* ohne Speicher: bleibt beim Standard */ }
};

const FELD_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

export const istEingabeFeld = (el) =>
  !!el && (FELD_TAGS.has(el.tagName) || el.isContentEditable === true);

export const istSuchTaste = (e, { dialogOffen = false, slash = true } = {}) => {
  if (!e || e.defaultPrevented || e.isComposing || dialogOffen) return false;
  const k = typeof e.key === 'string' ? e.key.toLowerCase() : '';
  // ⌘K (Mac) oder Strg+K — ohne Umschalt/Alt, die belegen andere Programme.
  if (k === 'k' && (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) return true;
  // «/» nur ohne jede Zusatztaste und nie aus einem Eingabefeld heraus.
  if (slash && e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !istEingabeFeld(e.target)) return true;
  return false;
};

// Hängt den Zuhörer an `fenster` (im Browser `window`). `oeffnen()` wechselt zur Suche und meldet
// mit true, dass es das getan hat (in der Einführung meldet es false: dann bleibt die Taste, was
// sie ist). Danach der Fokus ins Suchfeld: main.jsx legt ihn nach jedem Ansichtswechsel im
// nächsten Bild auf <main>, und die Suchansicht lädt selbst nach. Darum zwei Bilder warten und
// dann höchstens rund eine Sekunde (60 Bilder) nach dem Feld suchen. Gibt das Abmelden zurück.
// aria-keyshortcuts und Hinweis am Lupen-Knopf nennen «/» nur, solange die Taste an ist (WCAG 2.1.4 / 4.1.2,
// a11y-Reste 16.11.2026). main.jsx nennt fest «/ Control+K Meta+K» und «(/)» (im Startbündel kein Platz für die
// Abfrage); hier, nachgeladen, fällt «/» weg, wenn die Taste aus ist. Ein MutationObserver holt jedes Neusetzen
// durch React ein, bevor es gezeichnet wird: Sprachwechsel (neuer title), Neu-Einhängen, Ende der Einführung,
// Handy/Desktop. Der Schalter in den Einstellungen meldet sich mit dem Ereignis «or5:suchtaste» (SettingsView).
// Fokus und Zeiger auf der Lupe bleiben als Rückfall, wo es keinen MutationObserver gibt. (Entscheid Stebler Studios 16.11.:
// «zuerst eine Lösung» — ohne Zuwachs im Startbündel.)
const LUPE = '[aria-keyshortcuts~="Meta+K"]';
const setzeWennAnders = (el, name, wert) => { if (el.getAttribute(name) !== wert) el.setAttribute(name, wert); };
export const kuerzelNennen = (doc, an, knopf = doc?.querySelector(LUPE)) => {
  if (!knopf) return;
  // Nur schreiben, was sich ändert — sonst weckte jedes Schreiben den Beobachter erneut.
  setzeWennAnders(knopf, 'aria-keyshortcuts', (an ? '/ ' : '') + knopf.getAttribute('aria-keyshortcuts').replace(/^\/ /, ''));
  const titel = (knopf.getAttribute('title') || '').replace(/ \(\/\)$/, '');
  if (titel) setzeWennAnders(knopf, 'title', titel + (an ? ' (/)' : ''));
};

export const suchTasteAnmelden = (oeffnen, fenster = window) => {
  const doc = fenster.document;
  kuerzelNennen(doc, slashAn(fenster.localStorage));
  const nachfuehren = (e) => { if (e.target?.matches?.(LUPE)) kuerzelNennen(doc, slashAn(fenster.localStorage), e.target); };
  // Den Knopf merken, solange er hängt — der Beobachter läuft bei jeder DOM-Änderung, die Suche nur bei Bedarf.
  let lupe = null;
  const nennen = () => {
    // Neu suchen auch, wenn der Knopf noch hängt, aber nicht mehr passt (Handy: React nimmt aria-keyshortcuts weg).
    if (!lupe || lupe.isConnected === false || lupe.matches?.(LUPE) === false) lupe = doc.querySelector(LUPE);
    kuerzelNennen(doc, slashAn(fenster.localStorage), lupe);
  };
  const beobachter = fenster.MutationObserver && doc.body ? new fenster.MutationObserver(nennen) : null;
  beobachter?.observe(doc.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['title', 'aria-keyshortcuts'] });
  const onKey = (e) => {
    if (!istSuchTaste(e, { dialogOffen: !!doc.querySelector('[aria-modal="true"]'), slash: slashAn(fenster.localStorage) })) return;
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
  fenster.addEventListener('focusin', nachfuehren);
  fenster.addEventListener('pointerover', nachfuehren);
  fenster.addEventListener('or5:suchtaste', nennen);
  return () => {
    fenster.removeEventListener('or5:suchtaste', nennen);
    beobachter?.disconnect();
    fenster.removeEventListener('keydown', onKey);
    fenster.removeEventListener('focusin', nachfuehren);
    fenster.removeEventListener('pointerover', nachfuehren);
  };
};
