import { useEffect, useRef } from 'react';

// ─── Gemeinsame Fokus-Falle für modale Schichten (Bau-Liste O17) ─────────────
// Vorher trug jede modale Schicht ihre eigene Fassung: die Tour eine, der
// Lösch-Dialog eine zweite, die beiden Schubladen gar keine. Drei Fassungen
// heissen drei Stellen, an denen es auseinanderdriftet — und die Schubladen
// zeigten, wohin das führt: dort lag der Escape-Griff auf dem Hintergrund,
// während der Fokus beim auslösenden Knopf AUSSERHALB stehen blieb. Das
// Tastendruck-Ereignis erreichte den Griff nie; Escape tat nichts.
//
// Was eine modale Schicht mit der Tastatur schuldet (WCAG 2.1.2 «No Keyboard
// Trap» und 2.4.3 «Focus Order»):
//   1. Beim Öffnen wandert der Fokus hinein — sonst tabbt man erst durch die
//      ganze Seite dahinter.
//   2. Tab und Shift+Tab bleiben drin und laufen im Kreis.
//   3. Escape schliesst.
//   4. Beim Schliessen kehrt der Fokus auf den auslösenden Knopf zurück —
//      sonst steht er am Seitenanfang und der Faden ist gerissen.
//
// NICHT für Schichten, die keine Dialoge sind: das Glossar-Sprechblase
// (`role="tooltip"`, nicht modal), die Speicher-Meldung (`aria-live`-Region)
// und der Erfassen-Fächer in der Bodenleiste (eine Auswahl am Knopf, der
// geöffnet bleibt). Eine Falle wäre dort falsch, nicht bloss überflüssig —
// sie würde den Fokus an etwas binden, das der Mensch gar nicht betreten hat.

// Was als tabbar gilt. `[tabindex]` ist bewusst breit; die Aussortierung der
// -1-Fälle macht `fokussierbareIn` unten, weil ein Attribut-Selektor den Wert
// nicht zuverlässig vergleicht.
export const FOKUSSIERBAR = 'a[href], button, input, select, textarea, [tabindex]';

// Reine Entscheidung: Wohin muss der Fokus bei Tab/Shift+Tab?
//   Rückgabe: Index in `anzahl` — oder null, wenn der Browser es selbst
//   richtig macht und wir uns nicht einmischen sollen.
//
// `aktivIndex === -1` heisst: der Fokus steht auf etwas im Dialog, das nicht
// in der Liste steht — in aller Regel die Überschrift mit `tabIndex={-1}`, auf
// die wir beim Öffnen springen. Von dort führt Shift+Tab ans Ende (sonst
// verliesse man den Dialog nach hinten); Tab darf der Browser selbst machen,
// er landet beim nächsten Feld darunter.
export const tabZiel = ({ anzahl, aktivIndex, shift }) => {
  if (!anzahl) return null;
  if (shift) return aktivIndex <= 0 ? anzahl - 1 : null;
  return aktivIndex === anzahl - 1 ? 0 : null;
};

// Die tabbaren Elemente innerhalb eines Knotens, in Dokument-Reihenfolge.
// `offsetParent === null` sortiert Verstecktes aus (ein ausgeblendeter Schritt
// der Tour hat noch Knöpfe im Baum, sie gehören aber nicht in den Kreis).
export const fokussierbareIn = (knoten) => {
  if (!knoten) return [];
  return Array.from(knoten.querySelectorAll(FOKUSSIERBAR)).filter((el) => (
    !el.disabled
    && el.tabIndex >= 0
    && el.offsetParent !== null
  ));
};

// `aktiv`    — ob die Schicht gerade offen ist.
// `ref`      — auf den Knoten, in dem der Fokus bleiben soll.
// `onEscape` — was Escape auslöst (schliessen, verschieben, …).
// `neuAusrichten` — Werte, bei deren Wechsel der Einstiegsfokus neu gesetzt
//   wird. Der Lösch-Dialog tauscht bei jedem Schritt seine Überschrift aus;
//   ohne das stünde der Fokus auf einem Knoten, den es nicht mehr gibt.
export const useFocusTrap = (aktiv, { ref, onEscape, neuAusrichten = [] } = {}) => {
  const ausloeser = useRef(null);
  const eingestiegen = useRef(false);
  const escapeRef = useRef(onEscape);
  escapeRef.current = onEscape;

  // Den Auslöser WÄHREND DES RENDERNS merken, nicht erst im Effekt. Der Grund ist
  // gemessen (20.09.2026, Menü-Schublade): React setzt ein `autoFocus`-Feld schon
  // beim Einhängen in die Seite, also bevor der erste Effekt läuft. Ein Effekt
  // fände dort nicht mehr den Knopf, der die Schicht geöffnet hat, sondern das
  // Suchfeld darin — und das verschwindet beim Schliessen, sodass der Fokus
  // ersatzlos auf <body> fiel. Hier, im Render des Öffnens, ist die Seite noch
  // unverändert und `document.activeElement` noch der Auslöser.
  if (aktiv && !ausloeser.current && typeof document !== 'undefined') {
    const vorher = document.activeElement;
    if (vorher && vorher.focus && vorher !== document.body) ausloeser.current = vorher;
  }

  // Beim Schliessen dorthin zurück. Bewusst NUR an `aktiv` gehängt: hinge diese
  // Rückkehr auch an `neuAusrichten`, spränge der Fokus bei jedem Schritt eines
  // mehrstufigen Dialogs kurz nach draussen und wieder herein — der Screenreader
  // läse dann jedes Mal den Knopf dahinter vor.
  useEffect(() => {
    const knoten = ref && ref.current;
    if (!aktiv || !knoten) return undefined;
    return () => {
      const zurueck = ausloeser.current;
      ausloeser.current = null;
      if (zurueck && zurueck.focus && zurueck.isConnected) zurueck.focus();
    };
  }, [aktiv, ref]);

  // Einstiegsfokus: zuerst die Überschrift (der Screenreader liest dann den Namen
  // des Dialogs), sonst das erste tabbare Element. Läuft bei jedem Wechsel in
  // `neuAusrichten` neu, weil dann meist die Überschrift ausgetauscht wurde.
  useEffect(() => {
    const knoten = ref && ref.current;
    if (!aktiv) { eingestiegen.current = false; return; }
    if (!knoten) return;
    // Beim ERSTEN Einstieg nicht am Fokus rütteln, wenn er schon drin steht: die
    // Menü-Schublade setzt ihn per `autoFocus` bewusst ins Suchfeld, und eine
    // Falle soll den Einstieg sichern, nicht die Absicht der Schicht
    // überschreiben. Bei einer NEUAUSRICHTUNG dagegen schon — dort hat die
    // Schicht ihre Überschrift getauscht, und genau die soll vorgelesen werden.
    const ersterEinstieg = !eingestiegen.current;
    eingestiegen.current = true;
    if (ersterEinstieg && knoten.contains(document.activeElement)) return;
    const ziel = knoten.querySelector('[data-dialog-titel]') || fokussierbareIn(knoten)[0];
    if (ziel) ziel.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktiv, ref, ...neuAusrichten]);

  // Tastatur. Der Griff sitzt auf dem Knoten selbst — dort, wo der Fokus nach
  // dem Öffnen auch wirklich steht.
  useEffect(() => {
    const knoten = ref && ref.current;
    if (!aktiv || !knoten) return undefined;

    const beiTaste = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (escapeRef.current) escapeRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const els = fokussierbareIn(knoten);
      const ziel = tabZiel({
        anzahl: els.length,
        aktivIndex: els.indexOf(document.activeElement),
        shift: e.shiftKey,
      });
      if (ziel === null) return;
      e.preventDefault();
      els[ziel].focus();
    };

    knoten.addEventListener('keydown', beiTaste);
    return () => knoten.removeEventListener('keydown', beiTaste);
  }, [aktiv, ref]);
};
