import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { inDays, formatDE } from './utils/helpers.js';

// Heirat / eingetragene Partnerschaft — geführter Ablauf. Trauung anmelden, Name &
// Zivilstand, Steuern (gemeinsame Veranlagung), Versicherungen & Vorsorge. Am Ende die
// „Verwandte Ereignisse"-Ebene (Kind, Trennung). Kein Rat — Orientierung.

export const Heirat = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  const deadline = inDays(30); // frühzeitig beim Zivilstandsamt anmelden (Orientierung)

  return React.createElement(AblaufContainer, {
    palette, icon: 'heart',
    title: t('heirat.title'),
    intro: t('heirat.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('heirat.step1Title') },
      React.createElement('p', { style: s.stepText }, t('heirat.step1Text')),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('heirat.step1Button', { date: formatDE(deadline) }),
        doneLabel: t('heirat.step1Done'),
        calendarLabel: t('heirat.step1CalendarLink'),
        onNavigate,
        reminder: { title: t('heirat.reminderTitle'), dueDate: deadline, category: 'admin', recurrence: 'once' },
      })
    ),
    React.createElement(AblaufStep, { palette, title: t('heirat.step2Title') },
      React.createElement('p', { style: s.stepText }, t('heirat.step2Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('heirat.step3Title') },
      React.createElement('p', { style: s.stepText }, t('heirat.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('heirat.step3Link'), onClick: () => onNavigate('tax') })
    ),
    React.createElement(AblaufStep, { palette, title: t('heirat.step4Title') },
      React.createElement('p', { style: s.stepText }, t('heirat.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('heirat.step4Link'), onClick: () => onNavigate('vorsorge') })
    ),
    // Verwandte Ereignisse (Matrix-Ebene)
    onNavigate && React.createElement(AblaufStep, { palette, title: t('heirat.relatedTitle') },
      React.createElement(AblaufLink, { palette, label: t('heirat.relatedKind'), onClick: () => onNavigate('kind') }),
      React.createElement(AblaufLink, { palette, label: t('heirat.relatedTrennung'), onClick: () => onNavigate('trennung') })
    ),
    React.createElement(AblaufFooter, { palette, notes: [t('heirat.footerNote'), t('trust.localOnly')] })
  );
};

export default Heirat;
