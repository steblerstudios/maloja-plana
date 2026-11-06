import React from 'react';
import { text, weight, radius, space } from '../config/tokens.js';

// Der EINE Primär-Button der App (Konsistenz-Baustein aus dem Design-Audit).
// Sand-Hintergrund + dunkler onSand-Text (6.15:1; Sand ist in hell+dunkel gleich).
// Fassung 9 (Stebler Studios 05.11.2026, Variante B «Ja, so»): Gold = handeln (Haupt-,
// Nebenknopf, Links), Grün = gut/erledigt, Blau = informieren und Fristen, Rot = warnen.
// Regel: ein Hauptknopf je Seite, weitere Handlungen als SecondaryButton.
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
      padding: '12px 16px', minHeight: '44px',
      background: disabled ? palette.mid : palette.sand,
      color: palette.onSand,
      border: 'none', borderRadius: radius.md + 'px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: text.sm, fontFamily: 'inherit', fontWeight: weight.semi,
      opacity: disabled ? 0.6 : 1,
      ...style,
    },
    ...rest,
  }, icon || null, children);
};

// Nebenknopf: gleiche Form, leer, Rand und Schrift in sandDeep (hell 5.73:1, dunkel 5.87:1).
export const SecondaryButton = ({ palette, onClick, children, icon, disabled, style, type, ...rest }) =>
  React.createElement('button', {
    type: type || 'button',
    onClick,
    disabled: !!disabled,
    style: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: space.xs + 'px',
      padding: '12px 16px', minHeight: '44px',
      background: 'transparent',
      color: disabled ? palette.mid : palette.sandDeep,
      border: '1px solid ' + (disabled ? palette.border : palette.sandDeep), borderRadius: radius.md + 'px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: text.sm, fontFamily: 'inherit', fontWeight: weight.semi,
      ...style,
    },
    ...rest,
  }, icon || null, children);

export default PrimaryButton;
