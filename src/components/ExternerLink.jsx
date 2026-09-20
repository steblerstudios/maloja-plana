import React from 'react';
import { visuallyHiddenStyle } from '../config/tokens.js';

// Visuell verstecktes Element — wohnt jetzt in config/tokens.js, damit auch der
// Start-Pfad (BetaGate, Onboarding) es ohne zusätzliche Import-Kante bekommt.
// Hier nur weitergereicht, damit die bestehenden Importe unverändert gelten.
export { visuallyHiddenStyle };

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
