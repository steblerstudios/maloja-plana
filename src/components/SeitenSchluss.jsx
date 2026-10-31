import React from 'react';
import { text, weight, radius, space } from '../config/tokens.js';
import { CHAPTER_KEYS } from '../config/constants.js';
import { ansichtName } from '../config/ansichtenRegister.js';

// F7-L2 (31.10.2026): «Als Nächstes» für die Seiten, die selbst keinen Weg weiter kennen (bis dahin nur «Übersicht»).
// Eine Tabelle statt sieben Änderungen in sieben Komponenten; main.jsx lädt das erst auf diesen Seiten. Die Liste dort
// (MIT_SEITENSCHLUSS) und diese Tabelle hält der Test seitenSchluss.test.js gleich.
export const SCHLUSS_ZIELE = {
  kk: { kapitel: 'versicherungen' },
  sync: { kapitel: 'finanzen' },
  direktlinks: { ziel: 'situationen' },
  export: { ziel: 'tresor' },
  notifications: { ziel: 'calendar' },
  flyer: {},
  installApp: {},
};

export const SeitenSchluss = ({ palette, t, view, onNavigate }) => {
  const z = SCHLUSS_ZIELE[view];
  if (!z) return null;
  const name = z.kapitel ? t('chapters.' + z.kapitel + '.title') : z.ziel ? t(ansichtName(z.ziel)) : null;
  const gehe = () => (z.kapitel ? onNavigate('chapter', CHAPTER_KEYS.indexOf(z.kapitel)) : onNavigate(z.ziel || 'dashboard'));
  const h = React.createElement;
  return h('section', { 'data-teil': 'als-naechstes', style: { marginTop: space.xl + 'px', padding: space.lg + 'px 0', borderTop: '1px solid ' + palette.border, textAlign: 'center' } },
    h('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.xs + 'px' } }, t('chapterView.alsNaechstes')),
    h('button', {
      type: 'button', className: 'mp-link', onClick: gehe,
      style: { minHeight: '44px', padding: '0 ' + space.md + 'px', background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.medium, color: palette.text },
    }, (name ? t('dashboard.nextUpWeiter', { name }) : t('chapterView.zurUebersicht')), ' ›'));
};

export default SeitenSchluss;
