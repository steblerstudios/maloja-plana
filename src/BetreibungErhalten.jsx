import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { inDays, formatDE } from './utils/helpers.js';

// Betreibung erhalten — geführter Ablauf als ruhige Anti-Panik-Orientierung. Die
// kritischste Frist zuerst: 10 Tage Rechtsvorschlag (stoppt die Betreibung vorerst,
// ohne Begründung). Dann: stimmt die Forderung (zahlen/Raten vs. Rechtsvorschlag),
// Budget/Existenzminimum schützen + kostenlose Schuldenberatung. Würdevoll, kein
// Strafregister-Frame. Kein Rat — Orientierung, keine Rechtsberatung.

export const BetreibungErhalten = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  // Rechtsvorschlag-Frist: 10 Tage ab Zustellung des Zahlungsbefehls. Das genaue
  // Zustelldatum kennen wir nicht → ruhige Orientierungs-Frist 10 Tage ab heute
  // (im Kalender verschiebbar auf das tatsächliche Datum).
  const deadline = inDays(10);

  return React.createElement(AblaufContainer, {
    palette, icon: 'behoerden',
    title: t('betreibung.title'),
    intro: t('betreibung.intro'),
  },
    // Schritt 1 — Ruhe, 10-Tage-Frist Rechtsvorschlag (das Wichtigste zuerst)
    React.createElement(AblaufStep, { palette, title: t('betreibung.step1Title') },
      React.createElement('p', { style: s.stepText }, t('betreibung.step1Text')),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('betreibung.step1Button', { date: formatDE(deadline) }),
        doneLabel: t('betreibung.step1Done'),
        calendarLabel: t('betreibung.step1CalendarLink'),
        onNavigate,
        reminder: {
          title: t('betreibung.reminderTitle'),
          dueDate: deadline,
          category: 'admin',
          recurrence: 'once',
        },
      })
    ),

    // Schritt 2 — Stimmt die Forderung? (zahlen/Raten vs. Rechtsvorschlag)
    React.createElement(AblaufStep, { palette, title: t('betreibung.step2Title') },
      React.createElement('p', { style: s.stepText }, t('betreibung.step2Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('betreibung.step2Link'), onClick: () => onNavigate('schulden') })
    ),

    // Schritt 3 — Budget/Existenzminimum schützen + kostenlose Beratung
    React.createElement(AblaufStep, { palette, title: t('betreibung.step3Title') },
      React.createElement('p', { style: s.stepText }, t('betreibung.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('betreibung.step3Link'), onClick: () => onNavigate('sync') })
    ),

    React.createElement(AblaufFooter, { palette, notes: [t('betreibung.footerNote'), t('trust.localOnly')] })
  );
};

export default BetreibungErhalten;
