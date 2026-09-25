import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusMonate, plusTage } from './utils/fristen.js';

// Militär- oder Zivildienst — der Weg ab 18 — geführter Ablauf, gebaut 25.09.2026 auf Wunsch von Stebler Studios.
// Inhalt aus der Fachprüfung (swiss-precision) vom 25.09.2026, jede Aussage am Gesetzeswortlaut
// der am 25.09.2026 geltenden Fassung. Fristen nur, wo das Gesetz eine nennt; «nie später
// als das Gesetz» (utils/fristen.js).

export const Dienst = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  return React.createElement(AblaufContainer, {
    palette, icon: 'behoerden',
    title: t('dienst.title'),
    intro: t('dienst.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('dienst.step1Title') },
      React.createElement('p', { style: s.stepText }, t('dienst.step1Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('dienst.step2Title') },
      React.createElement('p', { style: s.stepText }, t('dienst.step2Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('dienst.step2Frauen')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('dienst.step2Link'), onClick: () => onNavigate('tresor') })
    ),
    React.createElement(AblaufStep, { palette, title: t('dienst.step3Title') },
      React.createElement('p', { style: s.stepText }, t('dienst.step3Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('dienst.step3Waffenlos')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'dienst-frist', frist: (d) => plusTage(plusMonate(d, -3), -1),
        labelKey: 'dienst.fristLabel', hinweisKey: 'dienst.fristHinweis', vorbeiKey: 'dienst.fristVorbei',
        buttonKey: 'dienst.step3Button', doneKey: 'dienst.step3Done', calendarKey: 'dienst.step3CalendarLink',
        reminderTitle: t('dienst.reminderTitle'), category: 'admin',
      })
    ),
    React.createElement(AblaufStep, { palette, title: t('dienst.step4Title') },
      React.createElement('p', { style: s.stepText }, t('dienst.step4Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('dienst.step4Lohn')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('dienst.step4LinkJob'), onClick: () => onNavigate('neuerjob') })
    ),
    React.createElement(AblaufStep, { palette, title: t('dienst.step5Title') },
      React.createElement('p', { style: s.stepText }, t('dienst.step5Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('dienst.step5Rueckerstattung')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'dienst-ersatz', frist: (d) => plusTage(d, 30),
        labelKey: 'dienst.ersatzLabel', hinweisKey: 'dienst.ersatzHinweis', vorbeiKey: 'dienst.ersatzVorbei',
        buttonKey: 'dienst.step5Button', doneKey: 'dienst.step5Done', calendarKey: 'dienst.step5CalendarLink',
        reminderTitle: t('dienst.ersatzReminderTitle'), category: 'admin',
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('dienst.step5Link'), onClick: () => onNavigate('tax') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('dienst.quelle'), notes: [t('dienst.footerNote'), t('trust.localOnly')] })
  );
};

export default Dienst;
