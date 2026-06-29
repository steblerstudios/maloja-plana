import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { inDays, formatDE } from './utils/helpers.js';

// Umzug — der 3. geführte Ablauf, gebaut auf der Ablauf-Schale. Bewusst ruhige
// Orientierung statt Rechner: An-/Abmeldung bei der Gemeinde (CH: innert 14 Tagen),
// Adresse überall nachführen, alte Wohnung fristgerecht kündigen.

// Orientierungs-Frist: In der Schweiz meldet man sich innert 14 Tagen nach dem Umzug
// bei der neuen Gemeinde an. Wir kennen das Umzugsdatum nicht → ruhige Erinnerung
// 14 Tage ab heute (verschiebbar), bewusst Orientierung, kein Verdikt.

export const UmzugAblauf = ({ palette, t, data, chapters, onNavigate }) => {
  const s = ablaufStyles(palette);
  const currentAddress = [data?.wohnen?.address, [data?.wohnen?.postalCode, data?.wohnen?.city].filter(Boolean).join(' ')]
    .filter(Boolean).join(', ');
  const deadline = inDays(14);
  // Kapitel-Index über den Schlüssel auflösen (nicht hartkodieren) — robust gegen Umsortierung.
  const chapterIdx = (key) => (chapters ? chapters.findIndex(ch => ch.key === key) : -1);

  const checklistItems = [
    t('umzug.step3Post'),
    t('umzug.step3Kk'),
    t('umzug.step3Employer'),
    t('umzug.step3Ahv'),
    t('umzug.step3Tax'),
    t('umzug.step3Insurance'),
    t('umzug.step3Bank'),
    t('umzug.step3Subs'),
  ];

  return React.createElement(AblaufContainer, {
    palette, icon: 'home',
    title: t('umzug.title'),
    intro: t('umzug.intro'),
  },
    // Schritt 1 — Neue Adresse (anzeigen was erfasst ist, sonst zum Erfassen führen)
    React.createElement(AblaufStep, { palette, title: t('umzug.step1Title') },
      React.createElement('p', { style: s.stepText },
        currentAddress
          ? t('umzug.step1Known', { address: currentAddress })
          : t('umzug.step1Note')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('umzug.step1Link'), onClick: () => onNavigate('chapter', chapterIdx('wohnen')) })
    ),

    // Schritt 2 — An-/Abmelden bei der Gemeinde (14-Tage-Frist)
    React.createElement(AblaufStep, { palette, title: t('umzug.step2Title') },
      React.createElement('p', { style: s.stepText }, t('umzug.step2Text')),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('umzug.step2Button', { date: formatDE(deadline) }),
        doneLabel: t('umzug.step2Done'),
        calendarLabel: t('umzug.step2CalendarLink'),
        onNavigate,
        reminder: {
          title: t('umzug.reminderTitle'),
          dueDate: deadline,
          category: 'admin',
          recurrence: 'once',
          notes: t('umzug.reminderNotes'),
        },
      })
    ),

    // Schritt 3 — Adresse überall nachführen (ruhige Checkliste)
    React.createElement(AblaufStep, { palette, title: t('umzug.step3Title') },
      React.createElement('p', { style: s.stepText }, t('umzug.step3Text')),
      React.createElement('ul', { style: { ...s.stepText, margin: '8px 0 0 0', paddingLeft: '20px' } },
        checklistItems.map((item, i) => React.createElement('li', { key: i, style: { marginBottom: '4px' } }, item))
      )
    ),

    // Schritt 4 — Alte Wohnung kündigen (→ Briefvorlage)
    React.createElement(AblaufStep, { palette, title: t('umzug.step4Title') },
      React.createElement('p', { style: s.stepText }, t('umzug.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('umzug.step4Link'), onClick: () => onNavigate('briefe') })
    ),

    React.createElement(AblaufFooter, { palette, notes: [t('umzug.footerFrist'), t('trust.localOnly')] })
  );
};

export default UmzugAblauf;
