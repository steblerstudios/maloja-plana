import React from 'react';

// Visuell verstecktes Element — nur für Screenreader hörbar, im Layout ohne
// Wirkung (kein Sprung, keine Lücke). Klassisches "sr-only"-Muster.
export const visuallyHiddenStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

// Externer Link, der in einem neuen Tab öffnet (target="_blank") — WCAG 3.2.5 /
// G201: ein Wechsel des Kontexts muss angekündigt sein, nicht nur optisch (Pfeil)
// erkennbar. Screenreader-Nutzer:innen bekommen den Hinweis als visuell
// verstecktes Kind-Element mit; rel="noopener noreferrer" ist immer gesetzt,
// auch wenn ein Aufruf nur "noopener" übergibt (Tabnabbing-Schutz).
//
// Nutzung: React.createElement(ExternerLink, { t, href, style }, 'Text')
// statt React.createElement('a', { href, target: '_blank', rel: '…' }, 'Text').
export const ExternerLink = ({ t, children, style, ...rest }) => {
  return React.createElement(
    'a',
    { ...rest, target: '_blank', rel: 'noopener noreferrer', style },
    children,
    React.createElement('span', { style: visuallyHiddenStyle }, ' (' + t('a11y.neuerTab') + ')')
  );
};

export default ExternerLink;
