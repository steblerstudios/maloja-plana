import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { inDays, formatDE } from './utils/helpers.js';

// Aufenthaltsbewilligung verlängern (B/L) — geführter Ablauf, on-mission für Zugewanderte.
// Rechtzeitig verlängern (kommt nicht automatisch), Unterlagen, Meldepflichten, Ausblick
// C-Bewilligung. Schritt 4 entängstigt: Prämienverbilligung (IPV) ist KEINE Sozialhilfe
// und schadet der Bewilligung nicht + leise Brücke zum Lebenszustand „Frisch zugezogen".
// Kein Ablaufdatum im Datenmodell → Orientierungs-Frist (verschiebbar). Kein Rat —
// Orientierung, keine Rechtsberatung.

export const BewilligungFristen = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  const deadline = inDays(90); // ~3 Monate vor Ablauf antragen (Orientierung)

  return React.createElement(AblaufContainer, {
    palette, icon: 'behoerden',
    title: t('bewilligung.title'),
    intro: t('bewilligung.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('bewilligung.step1Title') },
      React.createElement('p', { style: s.stepText }, t('bewilligung.step1Text')),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('bewilligung.step1Button', { date: formatDE(deadline) }),
        doneLabel: t('bewilligung.step1Done'),
        calendarLabel: t('bewilligung.step1CalendarLink'),
        onNavigate,
        reminder: { title: t('bewilligung.reminderTitle'), dueDate: deadline, category: 'admin', recurrence: 'once' },
      })
    ),
    React.createElement(AblaufStep, { palette, title: t('bewilligung.step2Title') },
      React.createElement('p', { style: s.stepText }, t('bewilligung.step2Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('bewilligung.step2Link'), onClick: () => onNavigate('tresor') })
    ),
    React.createElement(AblaufStep, { palette, title: t('bewilligung.step3Title') },
      React.createElement('p', { style: s.stepText }, t('bewilligung.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('bewilligung.step3Link'), onClick: () => onNavigate('umzug') })
    ),
    React.createElement(AblaufStep, { palette, title: t('bewilligung.step4Title') },
      React.createElement('p', { style: s.stepText }, t('bewilligung.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('bewilligung.step4LinkIpv'), onClick: () => onNavigate('premium') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('bewilligung.step4LinkSituation'), onClick: () => onNavigate('situationen') })
    ),
    // Verwandte Ereignisse (Matrix-Ebene)
    onNavigate && React.createElement(AblaufStep, { palette, title: t('bewilligung.relatedTitle') },
      React.createElement(AblaufLink, { palette, label: t('bewilligung.relatedKkErst'), onClick: () => onNavigate('kkerst') }),
      React.createElement(AblaufLink, { palette, label: t('bewilligung.relatedJob'), onClick: () => onNavigate('neuerjob') })
    ),
    React.createElement(AblaufFooter, { palette, notes: [t('bewilligung.footerNote'), t('trust.localOnly')] })
  );
};

export default BewilligungFristen;
