import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { inDays, formatDE } from './utils/helpers.js';

// Heirat / eingetragene Partnerschaft — geführter Ablauf. Trauung anmelden (inkl.
// Familiennachzug/Bewilligung für ausländische Partner:innen), Name & Zivilstand,
// Steuern (gemeinsame Veranlagung + IPV neu aufs Paar-Einkommen), Versicherungen &
// Vorsorge. «Verwandte Ereignisse» setzt die Ablauf-Schale (config/ablaufVerwandte.js, F7-A4). Kein Rat —
// Orientierung.

export const Heirat = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  const deadline = inDays(30); // frühzeitig beim Zivilstandsamt anmelden (Orientierung)

  return React.createElement(AblaufContainer, {
    palette, t, onNavigate, ablauf: 'heirat', icon: 'heart',
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
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('heirat.step1LinkBewilligung'), onClick: () => onNavigate('bewilligung') })
    ),
    React.createElement(AblaufStep, { palette, title: t('heirat.step2Title') },
      React.createElement('p', { style: s.stepText }, t('heirat.step2Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('heirat.step3Title') },
      React.createElement('p', { style: s.stepText }, t('heirat.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('heirat.step3Link'), onClick: () => onNavigate('tax') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('heirat.step3LinkPremium'), onClick: () => onNavigate('premium') })
    ),
    React.createElement(AblaufStep, { palette, title: t('heirat.step4Title') },
      React.createElement('p', { style: s.stepText }, t('heirat.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('heirat.step4Link'), onClick: () => onNavigate('vorsorge') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('heirat.quelle'), notes: [t('heirat.footerNote'), t('trust.localOnly')] })
  );
};

export default Heirat;
