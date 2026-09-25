import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusMonate, plusTage } from './utils/fristen.js';

// Wegzug ins Ausland — geführter Ablauf, gebaut 25.09.2026 auf Wunsch von Stebler Studios.
// Inhalt aus der Fachprüfung (swiss-precision) vom 25.09.2026, jede Aussage am Gesetzeswortlaut
// der am 25.09.2026 geltenden Fassung. Fristen nur, wo das Gesetz eine nennt; «nie später
// als das Gesetz» (utils/fristen.js).

export const Wegzug = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  return React.createElement(AblaufContainer, {
    palette, icon: 'home',
    title: t('wegzug.title'),
    intro: t('wegzug.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('wegzug.step1Title') },
      React.createElement('p', { style: s.stepText }, t('wegzug.step1Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('wegzug.abgrenzung')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('wegzug.step1Ausweis')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wegzug.abgrenzungLink'), onClick: () => onNavigate('umzug') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wegzug.step1LinkAusweis'), onClick: () => onNavigate('ausweis') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wegzug.step1LinkTresor'), onClick: () => onNavigate('tresor') })
    ),
    React.createElement(AblaufStep, { palette, title: t('wegzug.step2Title') },
      React.createElement('p', { style: s.stepText }, t('wegzug.step2Text')),
      React.createElement('p', { style: s.warn }, t('wegzug.step2Warn')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wegzug.step2LinkKk'), onClick: () => onNavigate('kk') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wegzug.step2LinkZusatz'), onClick: () => onNavigate('zusatzwechsel') })
    ),
    React.createElement(AblaufStep, { palette, title: t('wegzug.step3Title') },
      React.createElement('p', { style: s.stepText }, t('wegzug.step3Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'wegzug-frist', frist: (d) => plusTage(plusMonate(d, 12), -1),
        labelKey: 'wegzug.fristLabel', hinweisKey: 'wegzug.fristHinweis', vorbeiKey: 'wegzug.fristVorbei',
        buttonKey: 'wegzug.step3Button', doneKey: 'wegzug.step3Done', calendarKey: 'wegzug.step3CalendarLink',
        reminderTitle: t('wegzug.reminderTitle'), category: 'admin',
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wegzug.step3LinkVorsorge'), onClick: () => onNavigate('vorsorge') })
    ),
    React.createElement(AblaufStep, { palette, title: t('wegzug.step4Title') },
      React.createElement('p', { style: s.stepText }, t('wegzug.step4Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('wegzug.step4Saeule3a')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('wegzug.step4Steuer')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'wegzug-fristRueck', frist: (d) => plusTage(plusMonate(d, 36), -1),
        labelKey: 'wegzug.fristRueckLabel', hinweisKey: 'wegzug.fristRueckHinweis', vorbeiKey: 'wegzug.fristRueckVorbei',
        buttonKey: 'wegzug.step4Button', doneKey: 'wegzug.step4Done', calendarKey: 'wegzug.step4CalendarLink',
        reminderTitle: t('wegzug.reminderRueckTitle'), category: 'admin',
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wegzug.step4LinkVorsorge'), onClick: () => onNavigate('vorsorge') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wegzug.step4LinkTresor'), onClick: () => onNavigate('tresor') })
    ),
    React.createElement(AblaufStep, { palette, title: t('wegzug.step5Title') },
      React.createElement('p', { style: s.stepText }, t('wegzug.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wegzug.step5LinkTax'), onClick: () => onNavigate('tax') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wegzug.step5LinkFuehrerausweis'), onClick: () => onNavigate('fuehrerausweis') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wegzug.step5LinkUmzug'), onClick: () => onNavigate('umzug') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wegzug.step5LinkBriefe'), onClick: () => onNavigate('briefe') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('wegzug.quelle'), notes: [t('wegzug.footerNote'), t('trust.localOnly')] })
  );
};

export default Wegzug;
