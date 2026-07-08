import React from 'react';
import { text, weight, space } from '../config/tokens.js';

// Baustein für „Pattern B": sichtbares Label + Eingabefeld, programmatisch
// gekoppelt (Konsistenz-Baustein aus dem A11y-Formular-Audit, 2026-07-08).
//
// PROBLEM: Viele Formulare zeigen ein <label>/Label-<div> über dem Feld, ohne
// htmlFor/id-Kopplung. Sehende Nutzende sehen den Text, Screenreader-Nutzende
// bekommen aber KEINEN Feldnamen. Ein aria-label wäre Doppel-Pflege; die saubere
// Lösung ist die echte Kopplung über eine eindeutige id.
//
// LÖSUNG: useId() erzeugt eine stabile, eindeutige id; das Label bekommt htmlFor,
// das Kind-Feld (input/select/textarea) die id — geklont, ohne die vorhandenen
// Props anzutasten. Ein bereits gesetztes id/aria-label des Kindes bleibt erhalten.
//
// STATUS: Vorschlag. Noch NICHT migriert — Migration heisst, bestehende
// Label+Input-Paare hiermit zu umschliessen (mit Sophies Segen, gestaffelt).
//
// Beispiel:
//   React.createElement(LabeledField, { palette, label: t('tax.taxCanton') },
//     React.createElement('select', { value: canton, onChange, style: inputStyle }, …options))

export const LabeledField = ({ palette, label, hint, htmlFor, children, style, labelStyle, ...rest }) => {
  const autoId = React.useId();
  const id = htmlFor || (React.isValidElement(children) && children.props.id) || autoId;

  const field = React.isValidElement(children)
    ? React.cloneElement(children, { id: children.props.id || id })
    : children;

  return React.createElement('div', { style: { marginBottom: space.sm + 'px', ...style }, ...rest },
    React.createElement('label', {
      htmlFor: id,
      style: {
        display: 'block', fontSize: text.sm, color: palette.mid,
        marginBottom: space.xs + 'px', fontWeight: weight.medium, ...labelStyle,
      },
    }, label),
    hint ? React.createElement('div', {
      style: { fontSize: text.xs, color: palette.mid, marginBottom: space.xs + 'px' },
    }, hint) : null,
    field
  );
};
