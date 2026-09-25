import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusMonate } from './utils/fristen.js';

// Ergänzungsleistungen beantragen — geführter Ablauf, gebaut 25.09.2026 auf Wunsch von Stebler Studios.
// Inhalt aus der Fachprüfung (swiss-precision) vom 25.09.2026, jede Aussage am Gesetzeswortlaut
// der am 25.09.2026 geltenden Fassung. Fristen nur, wo das Gesetz eine nennt; «nie später
// als das Gesetz» (utils/fristen.js).

export const Ergaenzungsleistungen = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  return React.createElement(AblaufContainer, {
    palette, icon: 'vorsorge',
    title: t('ergaenzungsleistungen.title'),
    intro: t('ergaenzungsleistungen.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('ergaenzungsleistungen.step1Title') },
      React.createElement('p', { style: s.stepText }, t('ergaenzungsleistungen.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('ergaenzungsleistungen.step1LinkAnspruch'), onClick: () => onNavigate('anspruchcheck') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('ergaenzungsleistungen.step1LinkSozialhilfe'), onClick: () => onNavigate('sozialhilfe') })
    ),
    React.createElement(AblaufStep, { palette, title: t('ergaenzungsleistungen.step2Title') },
      React.createElement('p', { style: s.stepText }, t('ergaenzungsleistungen.step2Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('ergaenzungsleistungen.step3Title') },
      React.createElement('p', { style: s.stepText }, t('ergaenzungsleistungen.step3Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'ergaenzungsleistungen-frist', frist: (d) => plusMonate(d, 6),
        labelKey: 'ergaenzungsleistungen.fristLabel', hinweisKey: 'ergaenzungsleistungen.fristHinweis', vorbeiKey: 'ergaenzungsleistungen.fristVorbei',
        buttonKey: 'ergaenzungsleistungen.step3Button', doneKey: 'ergaenzungsleistungen.step3Done', calendarKey: 'ergaenzungsleistungen.step3CalendarLink',
        reminderTitle: t('ergaenzungsleistungen.reminderTitle'), category: 'insurance',
      }),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'ergaenzungsleistungen-heim', frist: (d) => plusMonate(d, 6),
        labelKey: 'ergaenzungsleistungen.heimLabel', hinweisKey: 'ergaenzungsleistungen.heimHinweis', vorbeiKey: 'ergaenzungsleistungen.heimVorbei',
        buttonKey: 'ergaenzungsleistungen.heimButton', doneKey: 'ergaenzungsleistungen.step3Done', calendarKey: 'ergaenzungsleistungen.step3CalendarLink',
        reminderTitle: t('ergaenzungsleistungen.heimReminderTitle'), category: 'insurance',
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('ergaenzungsleistungen.step3LinkPension'), onClick: () => onNavigate('pensionierung') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('ergaenzungsleistungen.step3LinkIv'), onClick: () => onNavigate('iv') })
    ),
    React.createElement(AblaufStep, { palette, title: t('ergaenzungsleistungen.step4Title') },
      React.createElement('p', { style: s.stepText }, t('ergaenzungsleistungen.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('ergaenzungsleistungen.step4LinkPraemien'), onClick: () => onNavigate('premium') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('ergaenzungsleistungen.step4LinkPflege'), onClick: () => onNavigate('pflege') })
    ),
    React.createElement(AblaufStep, { palette, title: t('ergaenzungsleistungen.step5Title') },
      React.createElement('p', { style: s.stepText }, t('ergaenzungsleistungen.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('ergaenzungsleistungen.step5LinkTodesfall'), onClick: () => onNavigate('todesfall') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('ergaenzungsleistungen.quelle'), notes: [t('ergaenzungsleistungen.footerNote'), t('trust.localOnly')] })
  );
};

export default Ergaenzungsleistungen;
