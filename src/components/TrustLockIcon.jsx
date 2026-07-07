import React from 'react';

// Vertrauens-Schloss — dekoratives Badge neben „100% lokal"/Vertrauens-Texten.
// Vorher 4× identisch inline (BetaGate, ChapterView, Onboarding, main) in viewBox 16;
// hier einmalig in der Standard-viewBox 24. Die Strichstärke 2.25 rendert bei jeder
// Grösse pixelgleich zur früheren 1.5-in-16-Variante (1.5 · 24/16 = 2.25).
export const TrustLockIcon = ({ size = 14, color = 'currentColor', style }) =>
  React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: '2.25', strokeLinecap: 'round',
    'aria-hidden': 'true', style,
  },
    React.createElement('rect', { x: '6', y: '10.5', width: '12', height: '10.5', rx: '1.5' }),
    React.createElement('path', { d: 'M 9 10.5 V 7.5 a 3 3 0 0 1 6 0 V 10.5' })
  );
