import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { inDays, formatDE } from './utils/helpers.js';

// Stelle verloren — der 6. geführte Ablauf auf der Schale. Gegenstück zu „Neuer Job".
// Ruhige Orientierung mit der kritischsten Reihenfolge zuerst: RAV-Anmeldung (Taggeld
// gibt es erst ab Anmeldung, nicht rückwirkend), dann die unsichtbare Versicherungs-
// lücke, Pensionskassen-Freizügigkeit, Unterlagen. Kein Rat — Orientierung.

export const StelleVerloren = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  // Die Unfalldeckung endet 31 Tage nach Austritt. Das genaue Austrittsdatum kennen wir
  // hier nicht → ruhige Orientierungs-Frist 31 Tage ab heute (im Kalender verschiebbar).
  const coverEnd = inDays(31);

  return React.createElement(AblaufContainer, {
    palette, icon: 'lebenslauf',
    title: t('stelleVerloren.title'),
    intro: t('stelleVerloren.intro'),
  },
    // Schritt 1 — RAV-Anmeldung (die wichtigste Frist)
    React.createElement(AblaufStep, { palette, title: t('stelleVerloren.step1Title') },
      React.createElement('p', { style: s.stepText }, t('stelleVerloren.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('stelleVerloren.step1Link'), onClick: () => onNavigate('alv') })
    ),

    // Schritt 2 — Versicherungslücke (Unfalldeckung endet 31 Tage nach Austritt)
    React.createElement(AblaufStep, { palette, title: t('stelleVerloren.step2Title') },
      React.createElement('p', { style: s.stepText }, t('stelleVerloren.step2Text')),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('stelleVerloren.step2Button', { date: formatDE(coverEnd) }),
        doneLabel: t('stelleVerloren.step2Done'),
        calendarLabel: t('stelleVerloren.step2CalendarLink'),
        onNavigate,
        reminder: {
          title: t('stelleVerloren.reminderTitle'),
          dueDate: coverEnd,
          category: 'insurance',
          recurrence: 'once',
        },
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('stelleVerloren.step2LinkUk'), onClick: () => onNavigate('unfallkrankheit') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('stelleVerloren.step2LinkKk'), onClick: () => onNavigate('kk') })
    ),

    // Schritt 3 — Pensionskasse (Freizügigkeit)
    React.createElement(AblaufStep, { palette, title: t('stelleVerloren.step3Title') },
      React.createElement('p', { style: s.stepText }, t('stelleVerloren.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('stelleVerloren.step3Link'), onClick: () => onNavigate('vorsorge') })
    ),

    // Schritt 4 — Arbeitszeugnis & Unterlagen
    React.createElement(AblaufStep, { palette, title: t('stelleVerloren.step4Title') },
      React.createElement('p', { style: s.stepText }, t('stelleVerloren.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('stelleVerloren.step4Link'), onClick: () => onNavigate('tresor', undefined, 'finanzen') })
    ),

    React.createElement(AblaufFooter, { palette, notes: [t('stelleVerloren.footerSperrzeit'), t('trust.localOnly')] })
  );
};

export default StelleVerloren;
