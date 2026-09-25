import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { endeMaerzFolgejahr } from './utils/fristen.js';

// Quellensteuer — geführter Ablauf, gebaut 24.09.2026 (Stebler Studios: «neue Abläufe: ja
// unbedingt»). Wer zahlt (DBG 83), Tarifcode (QStV 1, 5), Verfügung (DBG 137–139),
// nachträgliche ordentliche Veranlagung — Pflicht ab 120 000 Fr. oder auf Antrag,
// Antrag endgültig (DBG 89, 89a; QStV 9, 10) —, Wechsel bei C oder Heirat (QStV 12, 13).
// Frist: 31. März des Folgejahres, fest (utils/fristen.js). Keine Tarife, keine
// Beträge ausser der gesetzlichen Schwelle — Tarife sind kantonal.

export const Quellensteuer = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  return React.createElement(AblaufContainer, {
    palette, icon: 'money',
    title: t('quellensteuer.title'),
    intro: t('quellensteuer.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('quellensteuer.step1Title') },
      React.createElement('p', { style: s.stepText }, t('quellensteuer.step1Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('quellensteuer.step1Hinweis')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('quellensteuer.step1Link'), onClick: () => onNavigate('bewilligung') })
    ),
    React.createElement(AblaufStep, { palette, title: t('quellensteuer.step2Title') },
      React.createElement('p', { style: s.stepText }, t('quellensteuer.step2Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('quellensteuer.step2Link'), onClick: () => onNavigate('tresor', undefined, 'finanzen') })
    ),
    React.createElement(AblaufStep, { palette, title: t('quellensteuer.step3Title') },
      React.createElement('p', { style: s.stepText }, t('quellensteuer.step3Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('quellensteuer.step4Title') },
      React.createElement('p', { style: s.stepText }, t('quellensteuer.step4Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'quellensteuer-frist', frist: endeMaerzFolgejahr,
        labelKey: 'quellensteuer.fristLabel', hinweisKey: 'quellensteuer.fristHinweis', vorbeiKey: 'quellensteuer.fristVorbei',
        buttonKey: 'quellensteuer.step4Button', doneKey: 'quellensteuer.step4Done', calendarKey: 'quellensteuer.step4CalendarLink',
        reminderTitle: t('quellensteuer.reminderTitle'), category: 'admin',
      }),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('quellensteuer.step4Kanton')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('quellensteuer.step4Link'), onClick: () => onNavigate('tax') })
    ),
    React.createElement(AblaufStep, { palette, title: t('quellensteuer.step5Title') },
      React.createElement('p', { style: s.stepText }, t('quellensteuer.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('quellensteuer.step5LinkBew'), onClick: () => onNavigate('bewilligung') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('quellensteuer.step5LinkHeirat'), onClick: () => onNavigate('heirat') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('quellensteuer.quelle'), notes: [t('quellensteuer.footerNote'), t('trust.localOnly')] })
  );
};

export default Quellensteuer;
