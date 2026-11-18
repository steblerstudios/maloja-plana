import React from 'react';
import { text, weight, radius, space, ease, duration } from '../config/tokens.js';

// Ein Schalter für «an/aus» (Gruppe C, Gestaltung A, 11.11.2026). Der Zustand steht als Wort
// daneben («An»/«Aus»), nicht nur als Tönung: wer Farben schlecht sieht, liest ihn trotzdem ab
// (WCAG 1.4.1). Rand mit mindestens 3:1 in beiden Zuständen (1.4.11), Tippfläche 44 px hoch,
// role="switch" mit aria-checked (4.1.2). Der Name kommt aus `label` (sichtbar in der Zeile
// daneben), darum hier aria-label = label.
//
// Liegt bewusst NICHT im Startbündel: nur die Einstellungsseite, die Einstellungs-Schublade und
// die Benachrichtigungen benutzen ihn, alle nachgeladen.
export const Schalter = ({ palette, t, an, onChange, label, disabled = false, beschreibungId }) => {
  const wort = an ? t('common.schalterAn') : t('common.schalterAus');
  return React.createElement('button', {
    type: 'button',
    role: 'switch',
    'aria-checked': !!an,
    'aria-label': label,
    'aria-describedby': beschreibungId || undefined,
    disabled,
    onClick: () => { if (!disabled) onChange(!an); },
    style: {
      display: 'inline-flex', alignItems: 'center', gap: space.sm + 'px',
      minHeight: '44px', padding: '0 ' + space.xs + 'px', flexShrink: 0,
      background: 'transparent', border: 'none', color: palette.text,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
      fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.semi,
    },
  },
    React.createElement('span', { 'aria-hidden': 'true', style: { minWidth: '2.6em', textAlign: 'end', color: palette.text } }, wort),
    React.createElement('span', {
      'aria-hidden': 'true',
      'data-schalter-spur': an ? 'an' : 'aus',
      style: {
        position: 'relative', display: 'inline-block', width: '44px', height: '26px',
        borderRadius: radius.full,
        background: an ? palette.sand : palette.up,
        border: '2px solid ' + (an ? palette.sandDeep : palette.feldrand),
        boxSizing: 'border-box',
        transition: `background ${duration.normal}ms ${ease}, border-color ${duration.normal}ms ${ease}`,
      },
    },
      React.createElement('span', {
        style: {
          position: 'absolute', top: '3px', insetInlineStart: an ? '21px' : '3px',
          width: '16px', height: '16px', borderRadius: '50%',
          background: an ? palette.onSand : palette.mid,
          transition: `inset-inline-start ${duration.normal}ms ${ease}`,
        },
      })
    )
  );
};

export default Schalter;
