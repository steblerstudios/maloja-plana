import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusTage } from './utils/fristen.js';

// 18 werden — was sich ändert — geführter Ablauf, gebaut 25.09.2026 auf Wunsch von Stebler Studios.
// Inhalt aus der Fachprüfung (swiss-precision) vom 25.09.2026, jede Aussage am Gesetzeswortlaut
// der am 25.09.2026 geltenden Fassung. Fristen nur, wo das Gesetz eine nennt; «nie später
// als das Gesetz» (utils/fristen.js).

export const Volljaehrig = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  return React.createElement(AblaufContainer, {
    palette, icon: 'heart',
    title: t('volljaehrig.title'),
    intro: t('volljaehrig.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('volljaehrig.step1Title') },
      React.createElement('p', { style: s.stepText }, t('volljaehrig.step1Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('volljaehrig.step1Widerruf')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'volljaehrig-frist', frist: (d) => plusTage(d, 14),
        labelKey: 'volljaehrig.fristLabel', hinweisKey: 'volljaehrig.fristHinweis', vorbeiKey: 'volljaehrig.fristVorbei',
        buttonKey: 'volljaehrig.step1Button', doneKey: 'volljaehrig.step1Done', calendarKey: 'volljaehrig.step1CalendarLink',
        reminderTitle: t('volljaehrig.reminderTitle'), category: 'admin',
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('volljaehrig.step1Link'), onClick: () => onNavigate('budget') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('volljaehrig.step1LinkSchulden'), onClick: () => onNavigate('schulden') })
    ),
    React.createElement(AblaufStep, { palette, title: t('volljaehrig.step2Title') },
      React.createElement('p', { style: s.stepText }, t('volljaehrig.step2Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('volljaehrig.step2Hinweis')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('volljaehrig.step2Link'), onClick: () => onNavigate('kvgwechsel') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('volljaehrig.step2LinkIpv'), onClick: () => onNavigate('premium') })
    ),
    React.createElement(AblaufStep, { palette, title: t('volljaehrig.step3Title') },
      React.createElement('p', { style: s.stepText }, t('volljaehrig.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('volljaehrig.step3Link'), onClick: () => onNavigate('tax') })
    ),
    React.createElement(AblaufStep, { palette, title: t('volljaehrig.step4Title') },
      React.createElement('p', { style: s.stepText }, t('volljaehrig.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('volljaehrig.step4LinkStip'), onClick: () => onNavigate('stipendien') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('volljaehrig.step4LinkAhv'), onClick: () => onNavigate('vorsorge') })
    ),
    React.createElement(AblaufStep, { palette, title: t('volljaehrig.step5Title') },
      React.createElement('p', { style: s.stepText }, t('volljaehrig.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('volljaehrig.step5Link'), onClick: () => onNavigate('dienst') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('volljaehrig.quelle'), notes: [t('volljaehrig.footerNote'), t('trust.localOnly')] })
  );
};

export default Volljaehrig;
