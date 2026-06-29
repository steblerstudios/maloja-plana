import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';

// Neuer Job — der 5. geführte Ablauf auf der Schale. Ruhige Orientierung über die
// Zusammenhänge eines Stellenantritts: Vertrag, Pensionskasse, Unfall/KTG, Steuern,
// Probezeit & Ferien. Kein Rechner, kein Rat — Orientierung.

// Orientierungs-Frist für das Probezeit-Ende: oft 1–3 Monate. Wir kennen das genaue
// Datum nicht → ruhige Erinnerung 3 Monate ab heute (verschiebbar). Aus lokalen
// Datum-Teilen bauen (kein toISOString-UTC-Versatz).
const inMonths = (n) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setMonth(d.getMonth() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const formatDE = (iso) => {
  const [y, m, day] = iso.split('-');
  return `${day}.${m}.${y}`;
};

export const NeuerJob = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  const probeEnd = inMonths(3);

  return React.createElement(AblaufContainer, {
    palette, icon: 'lebenslauf',
    title: t('neuerJob.title'),
    intro: t('neuerJob.intro'),
  },
    // Schritt 1 — Vertrag prüfen & ablegen
    React.createElement(AblaufStep, { palette, title: t('neuerJob.step1Title') },
      React.createElement('p', { style: s.stepText }, t('neuerJob.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('neuerJob.step1LinkChapter'), onClick: () => onNavigate('chapter', 2) }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('neuerJob.step1LinkAblage'), onClick: () => onNavigate('tresor', undefined, 'finanzen') })
    ),

    // Schritt 2 — Pensionskasse (BVG)
    React.createElement(AblaufStep, { palette, title: t('neuerJob.step2Title') },
      React.createElement('p', { style: s.stepText }, t('neuerJob.step2Text'))
    ),

    // Schritt 3 — Unfall & Krankentaggeld
    React.createElement(AblaufStep, { palette, title: t('neuerJob.step3Title') },
      React.createElement('p', { style: s.stepText }, t('neuerJob.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('neuerJob.step3Link'), onClick: () => onNavigate('unfallkrankheit') })
    ),

    // Schritt 4 — Steuern
    React.createElement(AblaufStep, { palette, title: t('neuerJob.step4Title') },
      React.createElement('p', { style: s.stepText }, t('neuerJob.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('neuerJob.step4Link'), onClick: () => onNavigate('tax') })
    ),

    // Schritt 5 — Probezeit & Ferien
    React.createElement(AblaufStep, { palette, title: t('neuerJob.step5Title') },
      React.createElement('p', { style: s.stepText }, t('neuerJob.step5Text')),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('neuerJob.step5Button', { date: formatDE(probeEnd) }),
        doneLabel: t('neuerJob.step5Done'),
        calendarLabel: t('neuerJob.step5CalendarLink'),
        onNavigate,
        reminder: {
          title: t('neuerJob.reminderTitle'),
          dueDate: probeEnd,
          category: 'admin',
          recurrence: 'once',
          notes: t('neuerJob.reminderNotes'),
        },
      })
    ),

    React.createElement(AblaufFooter, { palette, notes: [t('neuerJob.footerProbe'), t('trust.localOnly')] })
  );
};

export default NeuerJob;
