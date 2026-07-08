import React from 'react';
import { text, weight, space } from '../config/tokens.js';

// Drei klare Überschriften-Rollen (Konsistenz-Baustein aus dem Design-Audit).
// Das HTML-Tag folgt der BEDEUTUNG, nicht der Grösse — damit Screenreader die
// Dokumentstruktur korrekt lesen (vorher war <h2> alles von 13px bis 28px).
// Flex nur bei inline-Icon, sonst bleiben zentrierte Hero-Titel unberührt.

// Seitentitel: genau einer pro Ansicht (Hero, 28px bold).
export const PageTitle = ({ palette, children, icon, style, ...rest }) =>
  React.createElement('h2', {
    style: {
      ...(icon ? { display: 'inline-flex', alignItems: 'center', gap: space.sm + 'px' } : {}),
      fontSize: text['2xl'], fontWeight: weight.bold, color: palette.text, margin: 0, ...style,
    }, ...rest,
  }, icon || null, children);

// Karten-/Abschnittstitel (19px semi, optionales Icon).
export const PanelTitle = ({ palette, children, icon, style, ...rest }) =>
  React.createElement('h3', {
    style: {
      ...(icon ? { display: 'inline-flex', alignItems: 'center', gap: space.sm + 'px' } : {}),
      fontSize: text.lg, fontWeight: weight.semi, color: palette.text, margin: 0, ...style,
    }, ...rest,
  }, icon || null, children);

// Kleines Kicker-Label — bewusst KEINE Überschrift (kein h*), damit die
// Screenreader-Struktur sauber bleibt (13px uppercase).
export const Eyebrow = ({ palette, children, style, ...rest }) =>
  React.createElement('div', {
    style: {
      fontSize: text.xs, fontWeight: weight.semi, textTransform: 'uppercase',
      letterSpacing: '0.5px', color: palette.mid, ...style,
    }, ...rest,
  }, children);
