import React from 'react';
import { text, weight, space } from '../config/tokens.js';
import { knopfStil } from './PrimaryButton.jsx';
import { CHAPTER_KEYS } from '../config/constants.js';
import { ansichtName, SCHLUSS_ZIELE } from '../config/ansichtenRegister.js';

// F7-L2 (31.10.2026): «Als Nächstes» für die Seiten, die selbst keinen Weg weiter kennen. Die Ziele stehen in
// ansichtenRegister.js (SCHLUSS_ZIELE), main.jsx lädt das hier erst auf diesen Seiten.
export const SeitenSchluss = ({ palette, t, view, onNavigate }) => {
  const z = SCHLUSS_ZIELE[view];
  const name = z.kapitel ? t('chapters.' + z.kapitel + '.title') : z.ziel ? t(ansichtName(z.ziel)) : null;
  const gehe = () => (z.kapitel ? onNavigate('chapter', CHAPTER_KEYS.indexOf(z.kapitel)) : onNavigate(z.ziel || 'dashboard'));
  const h = React.createElement;
  return h('section', { 'data-teil': 'als-naechstes', style: { marginTop: space['2xl'] + 'px', padding: space.lg + 'px 0', borderTop: '1px solid ' + palette.border, textAlign: 'center' } },
    h('h3', { style: { margin: '0 0 ' + space.xs + 'px', fontSize: text.xs, fontWeight: weight.normal, fontFamily: 'inherit', color: palette.mid } }, t('chapterView.alsNaechstes')),
    h('button', {
      type: 'button', className: 'mp-link', onClick: gehe,
      // Wie das Kapitel-Ende: Nebenknopf (Fassung 9, M9).
      style: knopfStil(palette, 'neben'),
    }, (name ? t('dashboard.nextUpWeiter', { name }) : t('chapterView.zurUebersicht')), ' ›'));
};

export default SeitenSchluss;
