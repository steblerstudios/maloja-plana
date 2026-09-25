import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusTage } from './utils/fristen.js';

// Pass oder Identitätskarte erneuern — geführter Ablauf, gebaut 25.09.2026 auf Wunsch von Stebler Studios.
// Inhalt aus der Fachprüfung (swiss-precision) vom 25.09.2026, jede Aussage am Gesetzeswortlaut
// der am 25.09.2026 geltenden Fassung. Fristen nur, wo das Gesetz eine nennt; «nie später
// als das Gesetz» (utils/fristen.js).

export const Ausweis = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  return React.createElement(AblaufContainer, {
    palette, icon: 'behoerden',
    title: t('ausweis.title'),
    intro: t('ausweis.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('ausweis.step1Title') },
      React.createElement('p', { style: s.stepText }, t('ausweis.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('ausweis.introLinkBewilligung'), onClick: () => onNavigate('bewilligung') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('ausweis.step1LinkTresor'), onClick: () => onNavigate('tresor') })
    ),
    React.createElement(AblaufStep, { palette, title: t('ausweis.step2Title') },
      React.createElement('p', { style: s.stepText }, t('ausweis.step2Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('ausweis.step3Title') },
      React.createElement('p', { style: s.stepText }, t('ausweis.step3Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('ausweis.step4Title') },
      React.createElement('p', { style: s.stepText }, t('ausweis.step4Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('ausweis.step4Dringend')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'ausweis-frist', frist: (d) => plusTage(d, 30),
        labelKey: 'ausweis.fristLabel', hinweisKey: 'ausweis.fristHinweis', vorbeiKey: 'ausweis.fristVorbei',
        buttonKey: 'ausweis.step4Button', doneKey: 'ausweis.step4Done', calendarKey: 'ausweis.step4CalendarLink',
        reminderTitle: t('ausweis.reminderTitle'), category: 'admin',
      })
    ),
    React.createElement(AblaufStep, { palette, title: t('ausweis.step5Title') },
      React.createElement('p', { style: s.stepText }, t('ausweis.step5Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('ausweis.step5Tipp')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('ausweis.step5LinkTresor'), onClick: () => onNavigate('tresor') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('ausweis.step5LinkFuehrerausweis'), onClick: () => onNavigate('fuehrerausweis') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('ausweis.step5LinkWegzug'), onClick: () => onNavigate('wegzug') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('ausweis.quelle'), notes: [t('ausweis.footerNote'), t('trust.localOnly')] })
  );
};

export default Ausweis;
