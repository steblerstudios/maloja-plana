import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusMonate } from './utils/fristen.js';

// Neuer Job — der 5. geführte Ablauf auf der Schale. Ruhige Orientierung über die
// Zusammenhänge eines Stellenantritts: Vertrag, Pensionskasse, Unfall/KTG, Steuern,
// Probezeit & Ferien. Kein Rechner, kein Rat — Orientierung.

// Probezeit-Ende: ohne andere Abrede ein Monat ab Stellenantritt (OR Art. 335b I), per
// Vertrag bis drei Monate. Gerechnet ab dem eingegebenen ersten Arbeitstag — vorher
// stand hier «3 Monate ab heute», also das Maximum statt des Normalfalls (24.09.2026).

export const NeuerJob = ({ palette, t, chapters, onNavigate }) => {
  const s = ablaufStyles(palette);
  // Kapitel-Index über den Schlüssel auflösen (nicht hartkodieren) — robust gegen Umsortierung.
  const chapterIdx = (key) => (chapters ? chapters.findIndex(ch => ch.key === key) : -1);

  return React.createElement(AblaufContainer, {
    palette, icon: 'lebenslauf',
    title: t('neuerJob.title'),
    intro: t('neuerJob.intro'),
  },
    // Schritt 1 — Vertrag prüfen & ablegen
    React.createElement(AblaufStep, { palette, title: t('neuerJob.step1Title') },
      React.createElement('p', { style: s.stepText }, t('neuerJob.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('neuerJob.step1LinkChapter'), onClick: () => onNavigate('chapter', chapterIdx('finanzen')) }),
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
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'neuerJob-frist', frist: (d) => plusMonate(d, 1),
        labelKey: 'neuerJob.fristLabel', hinweisKey: 'neuerJob.fristHinweis', vorbeiKey: 'neuerJob.fristVorbei',
        buttonKey: 'neuerJob.step5Button', doneKey: 'neuerJob.step5Done', calendarKey: 'neuerJob.step5CalendarLink',
        reminderTitle: t('neuerJob.reminderTitle'), category: 'admin',
        reminderNotes: t('neuerJob.reminderNotes'),
      })
    ),

    React.createElement(AblaufFooter, { palette, t, quelle: t('neuerJob.quelle'), notes: [t('neuerJob.footerProbe'), t('trust.localOnly')] })
  );
};

export default NeuerJob;
