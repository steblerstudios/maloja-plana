import React from 'react';

// Zwei verschlungene Ringe = verheiratet. Outline, konsistent mit dem funktionalen
// Icon-Set (viewBox 24, runde Enden, fill none) — siehe docs/ICON_KONVENTION.md.
export const TwoRingsIcon = ({ size = 16, color = 'currentColor', style }) =>
  React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: '1.6', strokeLinecap: 'round', 'aria-hidden': 'true', style,
  },
    React.createElement('circle', { cx: '9', cy: '14.5', r: '5.5' }),
    React.createElement('circle', { cx: '15', cy: '9.5', r: '5.5' })
  );
