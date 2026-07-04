import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { inDays, formatDE } from './utils/helpers.js';

// Kind bekommen — geführter Ablauf. Geburt/Vaterschaft anmelden, Kind versichern (KK
// innert 3 Monaten, rückwirkend), Familienzulagen (inkl. kantonaler Geburtszulage),
// Mutterschafts-/Vaterschaftsentschädigung & Betreuung. Schritt 5 prüft neu entstehende
// Ansprüche (IPV neu, da der Haushalt wächst) und führt zu passenden Lebenszuständen.
// Am Ende „Verwandte Ereignisse" (Heirat). Kein Rat — Orientierung.

export const KindBekommen = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  const deadline = inDays(90); // KK fürs Kind innert 3 Monaten (rückwirkend ab Geburt)

  return React.createElement(AblaufContainer, {
    palette, icon: 'child',
    title: t('kind.title'),
    intro: t('kind.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('kind.step1Title') },
      React.createElement('p', { style: s.stepText }, t('kind.step1Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('kind.step2Title') },
      React.createElement('p', { style: s.stepText }, t('kind.step2Text')),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('kind.step2Button', { date: formatDE(deadline) }),
        doneLabel: t('kind.step2Done'),
        calendarLabel: t('kind.step2CalendarLink'),
        onNavigate,
        reminder: { title: t('kind.reminderTitle'), dueDate: deadline, category: 'insurance', recurrence: 'once' },
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kind.step2Link'), onClick: () => onNavigate('praemien') })
    ),
    React.createElement(AblaufStep, { palette, title: t('kind.step3Title') },
      React.createElement('p', { style: s.stepText }, t('kind.step3Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('kind.step4Title') },
      React.createElement('p', { style: s.stepText }, t('kind.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kind.step4Link'), onClick: () => onNavigate('eo') })
    ),
    React.createElement(AblaufStep, { palette, title: t('kind.step5Title') },
      React.createElement('p', { style: s.stepText }, t('kind.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kind.step5LinkIpv'), onClick: () => onNavigate('premium') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kind.step5LinkSituation'), onClick: () => onNavigate('situationen') })
    ),
    onNavigate && React.createElement(AblaufStep, { palette, title: t('kind.relatedTitle') },
      React.createElement(AblaufLink, { palette, label: t('kind.relatedHeirat'), onClick: () => onNavigate('heirat') })
    ),
    React.createElement(AblaufFooter, { palette, notes: [t('kind.footerNote'), t('trust.localOnly')] })
  );
};

export default KindBekommen;
