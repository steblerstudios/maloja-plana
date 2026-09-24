import React from 'react';
import { hinweisZeichen } from '../IconKern.jsx';
import { visuallyHiddenStyle } from '../config/tokens.js';

// Visuell verstecktes Element — wohnt jetzt in config/tokens.js, damit auch der
// Start-Pfad (BetaGate, Onboarding) es ohne zusätzliche Import-Kante bekommt.
// Hier nur weitergereicht, damit die bestehenden Importe unverändert gelten.
export { visuallyHiddenStyle };

// ─── Ziel-Hinweis ────────────────────────────────────────────────────────────
// Ein Zeichen NUR dort, wo etwas den Ort verlässt oder auf dem Gerät landet.
//
// Warum das die ganze Regel ist: Maloja speichert alles hier. Die einzige
// Auskunft, die eine Zeile wirklich schuldet, lautet «geht das jetzt woanders
// hin?». Ein Pfeil an jedem inneren Querverweis beantwortet diese Frage nicht —
// er steht überall und sagt deshalb nichts. Seit 20.09.2026 tragen die inneren
// Verweise gar kein Zeichen mehr; die Zeile ist ohnehin ein Knopf.
//
// Und der Hinweis gehört HIERHER, nicht an die Aufrufstelle. Vorher klebte an
// sechs Stellen ein rohes ↗ neben einem ExternerLink, der den Kontextwechsel
// längst selbst ankündigte — doppelt, und an der siebten Stelle vergessen.
// Ein Versprechen, das von Hand wiederholt wird, wird irgendwann gebrochen.
//
// WCAG 3.2.5 / G201: ein Wechsel des Kontexts muss angekündigt sein, nicht nur
// optisch erkennbar. Das Piktogramm ist `aria-hidden`; die Ankündigung ist der
// visuell versteckte Text daneben.
const ZIEL = {
  extern:   { ikon: 'external', hinweis: 'a11y.neuerTab' },
  download: { ikon: 'download', hinweis: 'a11y.dateiGespeichert' },
  upload:   { ikon: 'upload',   hinweis: 'a11y.dateiGewaehlt' },
};

export const ZielHinweis = ({ t, art = 'extern', size = 13 }) => {
  const z = ZIEL[art] || ZIEL.extern;
  return React.createElement(React.Fragment, null,
    hinweisZeichen(z.ikon, size),
    React.createElement('span', { style: visuallyHiddenStyle }, ' (' + t(z.hinweis) + ')')
  );
};

// Externer Link, der in einem neuen Tab öffnet (target="_blank"). Setzt Zeichen
// und Ankündigung selbst; `rel="noopener noreferrer"` ist immer gesetzt, auch
// wenn ein Aufruf nur "noopener" übergibt (Tabnabbing-Schutz).
//
// Nutzung: React.createElement(ExternerLink, { t, href, style }, 'Text')
// statt React.createElement('a', { href, target: '_blank', rel: '…' }, 'Text').
export const ExternerLink = ({ t, children, style, ...rest }) => {
  return React.createElement(
    'a',
    { ...rest, target: '_blank', rel: 'noopener noreferrer', style },
    children,
    React.createElement(ZielHinweis, { t })
  );
};

export default ExternerLink;
