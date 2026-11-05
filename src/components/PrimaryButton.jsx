import React from 'react';
import { text, weight, radius, space } from '../config/tokens.js';

// Die Knopfarten der App (Fassung 9, Stebler Studios 05.11.2026). Eine Quelle für Form,
// Rundung und Farbe — Ansichten rufen knopfStil / linkStil / auswahlStil statt eigene Stile
// zu bauen. Wächter: src/__tests__/knopfarten.test.js.
//
// Farbrollen (Variante B «Ja, so»): Gold = handeln, Grün = gut/erledigt,
// Blau = informieren und Fristen, Rot = warnen.
//   haupt  · gefüllt Sand, Schrift onSand (6.15:1). EIN Hauptknopf je Seite oder Dialog.
//   neben  · leer, Rand + Schrift sandDeep (hell 5.73:1, dunkel 5.87:1).
//   gefahr · leer, Rand + Schrift roseDeep — nur wenn etwas verloren geht.
//            `gefuellt: true` nur im letzten Bestätigungsschritt (dort ist er der Hauptschritt).
//   leise  · Aufklapper («Mehr zeigen ›»): goldener Text ohne Rand.
//   link   · führt woanders hin: goldener Text, immer unterstrichen.
//   auswahl· Reiter, Chips, Schalter: gewählt = Sand gefüllt.
// Rundung: alle Knöpfe und Auswahlen KNOPF_RADIUS (6 px). Kreise nur für reine Symbolknöpfe.
export const KNOPF_RADIUS = radius.sm + 'px';

const basis = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: space.xs + 'px',
  padding: '10px 16px', minHeight: '44px', boxSizing: 'border-box',
  borderRadius: KNOPF_RADIUS, fontSize: text.sm, fontFamily: 'inherit', fontWeight: weight.semi,
};

export const knopfStil = (palette, art = 'haupt', { disabled = false, gefuellt = false } = {}) => {
  const cursor = disabled ? 'not-allowed' : 'pointer';
  if (art === 'leise') {
    return { ...basis, padding: '6px 0', minHeight: '44px', background: 'none', border: 'none',
      color: disabled ? palette.mid : palette.sandDeep, cursor };
  }
  if (art === 'gefahr') {
    return gefuellt
      ? { ...basis, background: disabled ? palette.mid : palette.roseBtn, color: '#fff', border: 'none', cursor }
      : { ...basis, background: 'transparent', color: disabled ? palette.mid : palette.roseDeep,
          border: '1px solid ' + (disabled ? palette.border : palette.roseDeep), cursor };
  }
  if (art === 'neben') {
    return { ...basis, background: 'transparent', color: disabled ? palette.mid : palette.sandDeep,
      border: '1px solid ' + (disabled ? palette.border : palette.sandDeep), cursor };
  }
  return { ...basis, background: disabled ? palette.mid : palette.sand,
    color: disabled ? '#fff' : palette.onSand, border: 'none', cursor, opacity: disabled ? 0.6 : 1 };
};

// Link: als <button> oder <a>. Erbt die Schriftgrösse der Umgebung.
export const linkStil = (palette) => ({
  color: palette.sandDeep, textDecoration: 'underline', textUnderlineOffset: '3px',
  background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer',
});

// Auswahl (Reiter, Segment, Chip, Schalter an/aus).
export const auswahlStil = (palette, gewaehlt) => ({
  borderRadius: KNOPF_RADIUS, cursor: 'pointer', fontFamily: 'inherit',
  border: '1px solid ' + (gewaehlt ? palette.sand : palette.border),
  background: gewaehlt ? palette.sand : 'transparent',
  color: gewaehlt ? palette.onSand : palette.text,
});

const bauKnopf = (art) => ({ palette, onClick, children, icon, disabled, gefuellt, style, type, ...rest }) =>
  React.createElement('button', {
    type: type || 'button',
    onClick,
    disabled: !!disabled,
    style: { ...knopfStil(palette, art, { disabled, gefuellt }), ...style },
    ...rest,
  }, icon || null, children);

// - icon: optionales Element links vom Text
// - disabled: dimmt + sperrt
// - style: überschreibt zuletzt (z. B. width, marginTop) — Form und Farbe bleiben aus knopfStil
export const PrimaryButton = bauKnopf('haupt');
export const SecondaryButton = bauKnopf('neben');
export const DangerButton = bauKnopf('gefahr');

export default PrimaryButton;
