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
export const GespeichertZeile = ({ palette, t, sichtbar, style }) => React.createElement('p', {
  role: 'status',
  style: {
    margin: sichtbar ? space.sm + 'px 0 0' : 0,
    fontSize: text.sm, fontWeight: weight.semi,
    color: palette.sageDeep || palette.sage,
    ...style,
  },
}, sichtbar ? [hinweisZeichen('check', 12, 'z'), t('common.saved')] : null);
