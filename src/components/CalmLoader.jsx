import React from 'react';
import { text, weight, space } from '../config/tokens.js';

// Ruhiger Lade-Zustand als Suspense-Fallback: eine sanft „atmende" Granit-Bergsilhouette
// (on-brand, Gipfel-Motiv) statt eines zappelnden Spinners. Die Animation liegt in
// tokens.css (.mp-loader-peak) und verstummt automatisch bei prefers-reduced-motion.
// Bewusst klein und eager importiert (muss synchron als Fallback bereitstehen).
export const CalmLoader = ({ palette, t, label }) =>
  React.createElement('div', {
    role: 'status', 'aria-live': 'polite',
    style: {
      padding: space.xl + 'px', minHeight: '160px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: space.md + 'px',
    },
  },
    React.createElement('svg', {
      className: 'mp-loader-peak', width: 58, height: 44, viewBox: '0 0 64 48', 'aria-hidden': 'true', fill: 'none',
    },
      // hintere Bergkette (Gipfel-M-Anklang), zart
      React.createElement('path', { d: 'M2 44 L22 12 L34 30 L46 8 L62 44 Z', fill: palette.soft, opacity: 0.5 }),
      // vorderer Granitgipfel
      React.createElement('path', { d: 'M17 44 L34 19 L51 44 Z', fill: palette.mid, opacity: 0.9 }),
      // Schneekuppe
      React.createElement('path', { d: 'M34 19 L29.5 26 L38.5 26 Z', fill: palette.surface }),
    ),
    React.createElement('div', {
      style: { fontSize: text.sm, color: palette.soft, fontWeight: weight.normal, letterSpacing: '0.02em' },
    }, label || t('common.loading')),
  );

export default CalmLoader;
