import React from 'react';
import { text, weight, radius, space } from '../config/tokens.js';

// Der EINE Primär-Button der App (Konsistenz-Baustein aus dem Design-Audit).
// Sand-Hintergrund + dunkler onSand-Text (WCAG-AA; Sand ist in hell+dunkel gleich).
// - icon: optionales Element links vom Text
// - disabled: dimmt + sperrt (grauer Hintergrund)
// - style: überschreibt zuletzt (z. B. width, marginTop) — die Basis bleibt konsistent
export const PrimaryButton = ({ palette, onClick, children, icon, disabled, style, type, ...rest }) => {
  return React.createElement('button', {
    type: type || 'button',
    onClick,
    disabled: !!disabled,
    style: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: space.xs + 'px',
      padding: '10px 16px',
      background: disabled ? palette.mid : palette.sand,
      color: palette.onSand,
      border: 'none', borderRadius: radius.sm + 'px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: text.sm, fontFamily: 'inherit', fontWeight: weight.semi,
      opacity: disabled ? 0.6 : 1,
      ...style,
    },
    ...rest,
  }, icon || null, children);
};

export default PrimaryButton;
