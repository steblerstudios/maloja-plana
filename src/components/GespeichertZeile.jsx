import React from 'react';
import { hinweisZeichen } from '../IconKern.jsx';
import { text, weight, space } from '../config/tokens.js';

// «Gespeichert» nach einem Speichern-Knopf — EINE Quelle für vier Ansichten.
//
// Bis 24.09.2026 speicherten KK-Karte, Organspende, Steuerrechner und Schuldenmanager
// ohne ein Wort. Die Zeile ist eine Status-Region, die immer im DOM steht und sich erst
// füllt: eine Region, die MIT ihrem Text erscheint, sagen Screenreader oft nicht an.
// `sichtbar` entscheidet die Ansicht — z. B. «gespeicherter Stand == aktueller Stand»,
// damit die Zeile verschwindet, sobald man danach wieder etwas ändert.
// `vorlaeufig` (27.09.2026): im Beispiel und beim Ausprobieren liegt die Änderung nur im
// Arbeitsspeicher — dort sagte die Zeile «Gespeichert», der Banner «nichts wird gespeichert».
export const GespeichertZeile = ({ palette, t, sichtbar, vorlaeufig, style }) => React.createElement('p', {
  role: 'status',
  style: {
    margin: sichtbar ? space.sm + 'px 0 0' : 0,
    fontSize: text.sm, fontWeight: weight.semi,
    color: palette.sageDeep || palette.sage,
    ...style,
  },
}, sichtbar ? [hinweisZeichen('check', 12, 'z'), t(vorlaeufig ? 'common.savedTemporary' : 'common.saved')] : null);
