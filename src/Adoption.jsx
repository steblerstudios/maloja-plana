import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusMonate, plusTage } from './utils/fristen.js';

// Adoption — der Weg in Kürze — geführter Ablauf, gebaut 25.09.2026 auf Wunsch von Stebler Studios.
// Inhalt aus der Fachprüfung (swiss-precision) vom 25.09.2026, jede Aussage am Gesetzeswortlaut
// der am 25.09.2026 geltenden Fassung. Fristen nur, wo das Gesetz eine nennt; «nie später
// als das Gesetz» (utils/fristen.js).

export const Adoption = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  return React.createElement(AblaufContainer, {
    palette, icon: 'family',
    title: t('adoption.title'),
    intro: t('adoption.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('adoption.step1Title') },
      React.createElement('p', { style: s.stepText }, t('adoption.step1Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('adoption.step2Title') },
      React.createElement('p', { style: s.stepText }, t('adoption.step2Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('adoption.step3Title') },
      React.createElement('p', { style: s.stepText }, t('adoption.step3Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('adoption.step4Title') },
      React.createElement('p', { style: s.stepText }, t('adoption.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('adoption.step4LinkZusammenziehen'), onClick: () => onNavigate('zusammenziehen') })
    ),
    React.createElement(AblaufStep, { palette, title: t('adoption.step5Title') },
      React.createElement('p', { style: s.stepText }, t('adoption.step5Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'adoption-frist', frist: (d) => plusTage(plusMonate(d, 12), -1),
        labelKey: 'adoption.fristLabel', hinweisKey: 'adoption.fristHinweis', vorbeiKey: 'adoption.fristVorbei',
        buttonKey: 'adoption.step5Button', doneKey: 'adoption.step5Done', calendarKey: 'adoption.step5CalendarLink',
        reminderTitle: t('adoption.reminderTitle'), category: 'insurance',
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('adoption.step5LinkEo'), onClick: () => onNavigate('eo') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('adoption.quelle'), notes: [t('adoption.footerNote'), t('trust.localOnly')] })
  );
};

export default Adoption;
