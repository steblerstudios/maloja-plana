import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { inDays, formatDE } from './utils/helpers.js';

// Krankheit & IV — geführter Ablauf bei längerer Arbeitsunfähigkeit/Einschränkung.
// Mit reduzierter Energie lesbar: Lohn & Taggeld, IV früh anmelden (Eingliederung vor
// Rente), Existenz sichern (EL/IPV/Sozialhilfe = Anspruch, kein Almosen), Entlastung.
// Kein Rat — Orientierung, keine Rechts- oder Medizinberatung.

export const IvVerfahren = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  const deadline = inDays(30); // IV-Anmeldung früh prüfen (Orientierung, kein fixes Datum)

  return React.createElement(AblaufContainer, {
    palette, icon: 'health',
    title: t('iv.title'),
    intro: t('iv.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('iv.step1Title') },
      React.createElement('p', { style: s.stepText }, t('iv.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('iv.step1Link'), onClick: () => onNavigate('unfallkrankheit') })
    ),
    React.createElement(AblaufStep, { palette, title: t('iv.step2Title') },
      React.createElement('p', { style: s.stepText }, t('iv.step2Text')),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('iv.step2Button', { date: formatDE(deadline) }),
        doneLabel: t('iv.step2Done'),
        calendarLabel: t('iv.step2CalendarLink'),
        onNavigate,
        reminder: { title: t('iv.reminderTitle'), dueDate: deadline, category: 'admin', recurrence: 'once' },
      })
    ),
    React.createElement(AblaufStep, { palette, title: t('iv.step3Title'), icon: 'ergaenzungsleistungen' },
      React.createElement('p', { style: s.stepText }, t('iv.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('iv.step3Link'), onClick: () => onNavigate('sozialhilfe') })
    ),
    React.createElement(AblaufStep, { palette, title: t('iv.step4Title') },
      React.createElement('p', { style: s.stepText }, t('iv.step4Text'))
    ),
    React.createElement(AblaufFooter, { palette, notes: [t('iv.footerNote'), t('trust.localOnly')] })
  );
};

export default IvVerfahren;
