import React from 'react';
import { text, weight, radius, space } from '../config/tokens.js';

// Der EINE Primär-Button der App (Konsistenz-Baustein aus dem Design-Audit).
// Fassung 9 (F9-A2, Stebler Studios 05.11.2026 «Ja, folgen»): Grün = handeln, wie im
// Markenhandbuch (Sage: Buttons, Links). Fläche sageBtn, Schrift #fff (8.17:1, AA, wie die
// bisherigen sageBtn-Knöpfe); im Farbenblind-Modus wird sageBtn blau. Sand bleibt Akzent (Frist, Hervorhebung, Fokus).
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
      padding: '10px 16px', minHeight: '44px',
      background: disabled ? palette.mid : palette.sageBtn,
      color: '#fff',
      border: 'none', borderRadius: radius.sm + 'px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: text.sm, fontFamily: 'inherit', fontWeight: weight.semi,
      opacity: disabled ? 0.6 : 1,
      ...style,
    },
    ...rest,
  }, icon || null, children);
};

// Nebenknopf: gleiche Form, nur Rand und Schrift in Sage (sageDeep trägt AA in hell und dunkel).
export const SecondaryButton = ({ palette, onClick, children, icon, disabled, style, type, ...rest }) =>
  React.createElement('button', {
    type: type || 'button',
    onClick,
    disabled: !!disabled,
    style: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: space.xs + 'px',
      padding: '10px 16px', minHeight: '44px',
      background: 'transparent',
      color: disabled ? palette.mid : palette.sageDeep,
      border: '1px solid ' + (disabled ? palette.border : palette.sageDeep), borderRadius: radius.sm + 'px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: text.sm, fontFamily: 'inherit', fontWeight: weight.semi,
      ...style,
    },
    ...rest,
  }, icon || null, children);

export default PrimaryButton;
