import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { inDays, formatDE } from './utils/helpers.js';

// Todesfall im Umfeld — geführter Ablauf, würdevoll und ohne Druck. Die ersten Tage,
// Bestattung, Renten & Versicherungen (inkl. EL-Ergänzung + leise Brücke zum
// Lebenszustand „Halbwaise", wenn ein Elternteil verstorben ist), Erbschaft/Nachlass.
// Die kritische Frist ist die Ausschlagung einer überschuldeten Erbschaft (3 Monate).
// Kein Rat — Orientierung, keine Rechtsberatung.

export const Todesfall = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  const deadline = inDays(90); // Erbschaft ausschlagen innert 3 Monaten (Orientierung)

  return React.createElement(AblaufContainer, {
    palette, icon: 'document',
    title: t('todesfall.title'),
    intro: t('todesfall.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('todesfall.step1Title') },
      React.createElement('p', { style: s.stepText }, t('todesfall.step1Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('todesfall.step2Title') },
      React.createElement('p', { style: s.stepText }, t('todesfall.step2Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('todesfall.step3Title') },
      React.createElement('p', { style: s.stepText }, t('todesfall.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('todesfall.step3Link'), onClick: () => onNavigate('vorsorge') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('todesfall.step3LinkSituation'), onClick: () => onNavigate('situationen') })
    ),
    React.createElement(AblaufStep, { palette, title: t('todesfall.step4Title') },
      React.createElement('p', { style: s.stepText }, t('todesfall.step4Text')),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('todesfall.step4Button', { date: formatDE(deadline) }),
        doneLabel: t('todesfall.step4Done'),
        calendarLabel: t('todesfall.step4CalendarLink'),
        onNavigate,
        reminder: { title: t('todesfall.reminderTitle'), dueDate: deadline, category: 'admin', recurrence: 'once' },
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('todesfall.step4Link'), onClick: () => onNavigate('schulden') })
    ),
    React.createElement(AblaufFooter, { palette, notes: [t('todesfall.footerNote'), t('trust.localOnly')] })
  );
};

export default Todesfall;
