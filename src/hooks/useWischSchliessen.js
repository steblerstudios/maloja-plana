import { useState, useRef } from 'react';
import { duration, ease } from '../config/tokens.js';

// Wischen zum Schliessen (10.11.2026) — für die Einstellungs-Schublade, die von der Seite
// einfährt (MobileNav, mode 'settings'). Ein Wisch zurück zu der Seite, von der sie kam,
// schiebt sie hinaus. Die Schublade folgt dabei dem Finger; wer loslässt, bevor es reicht,
// sieht sie zurückgleiten. ✕, Esc und der Tipp daneben bleiben, wie sie sind.
//
// Bewusst NICHT am ganzseitigen Menü (mode 'nav'): das ist eine Seite, die senkrecht scrollt.
// Ein Herunterwischen kollidierte dort mit dem Scrollen und dem Neuladen des Browsers.
//
// Nur Finger und Stift. Mit der Maus zieht man Text, keine Schubladen.

// Ab wann gilt eine Bewegung als Wisch und in welche Richtung (in px). Darunter ist es ein Tipp.
export const WISCH_SCHWELLE = 10;
// Weit genug: ein Drittel der Schubladenbreite. Oder schnell genug: ein kurzer Schnipser.
export const WISCH_ANTEIL = 1 / 3;
export const WISCH_TEMPO = 0.5; // px je ms

// Richtung festlegen, sobald die Bewegung die Schwelle überschreitet. Senkrecht gewinnt bei
// Gleichstand — Scrollen ist häufiger als Schliessen, und ein falsches Schliessen ist teurer.
export const wischAchse = (dx, dy) => {
  if (Math.abs(dx) < WISCH_SCHWELLE && Math.abs(dy) < WISCH_SCHWELLE) return null;
  return Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
};

// Wie weit die Schublade dem Finger folgt: nur Richtung Ausgang, nie nach innen über den Rand.
// `seite`: 'right' (fährt rechts aus, Standard) oder 'left' (Linkshänder-Modus).
export const wischVersatz = (dx, seite) => (seite === 'left' ? Math.min(0, dx) : Math.max(0, dx));

// Beim Loslassen: schliessen oder zurück?
export const wischSchliesst = ({ dx, dt, breite, seite }) => {
  const weg = Math.abs(wischVersatz(dx, seite));
  if (!breite || weg === 0) return false;
  return weg >= breite * WISCH_ANTEIL || (dt > 0 && weg / dt >= WISCH_TEMPO);
};

// Bedienelemente, auf denen ein Wisch etwas anderes heisst (Regler ziehen, Text markieren).
const NICHT_WISCHEN = 'input, select, textarea, [role="slider"], [contenteditable="true"]';

const bewegungRuhig = () => {
  try {
    if (document.documentElement.dataset.reduceMotion === '1') return true;
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch { return false; }
};

export const useWischSchliessen = ({ seite = 'right', onClose }) => {
  const [versatz, setVersatz] = useState(0);
  const [zieht, setZieht] = useState(false);
  const zug = useRef(null); // { id, x, y, t, achse, breite }
  // Nach einem waagrechten Zug kommt beim Loslassen oft noch ein Klick auf das Element, auf dem
  // der Finger begann — etwa einen Schalter. Der Wisch soll keine Einstellung umlegen.
  const gewischt = useRef(false);

  const ende = (e, abgebrochen) => {
    const z = zug.current;
    if (!z || z.id !== e.pointerId) return;
    zug.current = null;
    setZieht(false);
    const dx = e.clientX - z.x;
    if (!abgebrochen && z.achse === 'x' && wischSchliesst({ dx, dt: e.timeStamp - z.t, breite: z.breite, seite })) {
      // Hinausgleiten lassen, dann schliessen. Bei reduzierter Bewegung sofort.
      if (bewegungRuhig()) { onClose(); return; }
      setVersatz(seite === 'left' ? -z.breite : z.breite);
      setTimeout(onClose, duration.fast);
      return;
    }
    setVersatz(0);
  };

  const griffe = {
    onClickCapture: (e) => {
      if (!gewischt.current) return;
      gewischt.current = false;
      e.preventDefault();
      e.stopPropagation();
    },
    onPointerDown: (e) => {
      gewischt.current = false;
      if (e.pointerType === 'mouse' || !e.isPrimary) return;
      if (e.target && e.target.closest && e.target.closest(NICHT_WISCHEN)) return;
      const breite = e.currentTarget.getBoundingClientRect().width;
      zug.current = { id: e.pointerId, x: e.clientX, y: e.clientY, t: e.timeStamp, achse: null, breite };
    },
    onPointerMove: (e) => {
      const z = zug.current;
      if (!z || z.id !== e.pointerId) return;
      const dx = e.clientX - z.x, dy = e.clientY - z.y;
      if (!z.achse) {
        z.achse = wischAchse(dx, dy);
        if (z.achse === 'y') { zug.current = null; return; } // Scrollen: nicht mehr unser Zug
        if (z.achse === 'x') { gewischt.current = true; setZieht(true); try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ältere Browser */ } }
      }
      if (z.achse === 'x') setVersatz(wischVersatz(dx, seite));
    },
    onPointerUp: (e) => ende(e, false),
    onPointerCancel: (e) => ende(e, true),
  };

  // Während des Ziehens folgt die Schublade ohne Verzögerung; danach gleitet sie (Token-Zeit),
  // auch zurück auf 0 — darum steht `transform` immer da. Die Einfahr-Animation (slideIn…)
  // stört das nicht: eine laufende Animation geht im CSS einem Inline-Stil vor.
  // pan-y: der Browser darf senkrecht scrollen, das Waagrechte gehört uns.
  const stil = {
    touchAction: 'pan-y',
    transform: 'translateX(' + versatz + 'px)',
    transition: zieht ? 'none' : 'transform ' + duration.fast + 'ms ' + ease,
  };

  return { griffe, stil };
};
