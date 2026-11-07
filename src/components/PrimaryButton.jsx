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
// Rundung: alle Knöpfe und Auswahlen KNOPF_RADIUS (10 px, Entscheid 06.11.2026, überholt 6 px).
// Regel C: Ecke ≈ ¼ der Höhe — 44 px hoch → 10 px. Kreise nur für reine Symbolknöpfe.
export const KNOPF_RADIUS = radius.md + 'px';

// Kompakt geschrieben: der Baustein liegt im Startbündel (Limit 65 kB).
export const knopfStil = (p, art = 'haupt', { disabled: d = false, gefuellt: g = false } = {}) => {
  const s = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: space.xs + 'px',
    padding: '12px 16px', minHeight: '44px', boxSizing: 'border-box', borderRadius: KNOPF_RADIUS,
    fontSize: text.sm, fontFamily: 'inherit', fontWeight: weight.semi, cursor: d ? 'not-allowed' : 'pointer' };
  if (art === 'haupt' || (art === 'gefahr' && g)) {
    return { ...s, border: 'none', background: d ? p.mid : g ? p.roseBtn : p.sand, color: d || g ? '#fff' : p.onSand };
  }
  const c = d ? p.mid : art === 'gefahr' ? p.roseDeep : p.sandDeep;
  return art === 'leise'
    ? { ...s, padding: '8px 0', background: 'none', border: 'none', color: c }
    : { ...s, background: 'transparent', color: c, border: '1px solid ' + (d ? p.border : c) };
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
