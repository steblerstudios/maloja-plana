import React from 'react';
import { text, weight, space, radius } from '../config/tokens.js';

// Ruhiger, einheitlicher Leer-Zustand (dritter Konsistenz-Baustein aus dem
// Design-Audit, neben Heading & PrimaryButton). Leitgedanke: leer = Versprechen,
// nicht Defizit — ruhiger Ton, kein Ausrufezeichen, höchstens EINE Handlung.
// - icon:        optionales Element oben (z. B. Icon), rein dekorativ (aria-hidden)
// - title:       kurze Zeile (Pflicht)
// - description: optionaler ruhiger Satz darunter
// - action:      optionales Element darunter (z. B. PrimaryButton)
// - style:       überschreibt zuletzt; die Basis bleibt konsistent
export const EmptyState = ({ palette, title, description, icon, action, style, ...rest }) =>
  React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      gap: space.xs + 'px', padding: space.xl + 'px ' + space.lg + 'px',
      background: palette.up, border: '1px dashed ' + palette.border,
      borderRadius: radius.md + 'px',
      ...style,
    }, ...rest,
  },
    icon ? React.createElement('div', {
      'aria-hidden': 'true',
      style: { color: palette.mid, opacity: 0.8, marginBottom: space.xs + 'px' },
    }, icon) : null,
    React.createElement('div', {
      style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text },
    }, title),
    description ? React.createElement('div', {
      style: { fontSize: text.sm, color: palette.mid, lineHeight: 1.5, maxWidth: '340px' },
    }, description) : null,
    action ? React.createElement('div', { style: { marginTop: space.sm + 'px' } }, action) : null
  );

export default EmptyState;
