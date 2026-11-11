import React, { useState, Suspense } from 'react';
import { LIGHT_PALETTE, DARK_PALETTE } from './config/constants.js';

// Startbündel-Diät (23.10.2026, size-limit stand bei 64,99 / 65 kB): wer den Zugang schon hat
// — also fast alle, die die App öffnen —, sieht die Code-Wand nie. Darum prüft hier nur der
// gespeicherte Zugang, und die eigentliche Wand (BetaGate.jsx: Formular, Demo, Rechtliches)
// kommt erst nach, wenn sie gebraucht wird. BetaGate selbst ist unverändert und prüft den
// Zugang noch einmal; dieses Tor ist nur der Kurzweg daran vorbei.
// Schlüssel bewusst als Text — der Import aus BetaGate.jsx zöge die Wand ins Startbündel
// zurück. Wächter: betaGateTor.test.js (gleicher Schlüssel wie in BetaGate.jsx).
export const ZUGANG_KEY = 'or5_beta_access';

// Die Wand ist für Neue das erste Bild: ihre Texte liegen im Sprach-Kern (vite.config.js), sie wartet nicht auf den Rest.
const BetaGate = React.lazy(() => import('./BetaGate.jsx'));

export const BetaGateTor = ({ children }) => {
  const [hatZugang] = useState(() => {
    try { return localStorage.getItem(ZUGANG_KEY) === 'true'; } catch { return false; }
  });
  if (hatZugang) return children;
  // Ruhiger Grund in der Farbe der Wand, solange sie lädt — kein Spinner, kein Sprung.
  return React.createElement(Suspense, {
    // Grund in der Farbe, die theme-init.js schon gesetzt hat (Gruppe C, D: das Tor folgt dem Erscheinungsbild).
    fallback: React.createElement('div', { style: { minHeight: '100vh', background: (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light' ? LIGHT_PALETTE : DARK_PALETTE).bg } }),
  }, React.createElement(BetaGate, null, children));
};

export default BetaGateTor;
