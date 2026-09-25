import React from 'react';
import { text, space, leading } from '../config/tokens.js';
import { ergebnisSatz } from '../data/ergebnisArt.js';

// O3 — die ruhige Anzeige der Ergebnis-Art: ein Satz in der Fliesstext-Farbe, keine Plakette,
// kein Farbsignal. Sie sagt, was für ein Ergebnis darüber steht (Berechnung · Schätzung ·
// Vorprüfung · Orientierung) und, wenn Angaben fehlen, wie viele.
//
// Die Art steht zusätzlich als data-Attribut am Element. Das ist keine Dekoration: die Tests
// prüfen daran die Zusage «jeder umgestellte Rechner meldet eine der vier Arten», ohne an der
// Schreibweise des Satzes zu hängen.
export const ErgebnisArt = ({ palette, t, ergebnis, style }) => {
  if (!ergebnis) return null;
  return React.createElement('p', {
    'data-ergebnis-art': ergebnis.art,
    'data-fehlend': ergebnis.fehlend.length,
    style: {
      fontSize: text.xs,
      color: palette.mid,
      lineHeight: leading.normal,
      margin: space.sm + 'px 0 0',
      ...style,
    },
  }, ergebnisSatz(ergebnis, t));
};

export default ErgebnisArt;
