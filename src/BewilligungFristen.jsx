import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusTage } from './utils/fristen.js';

// Aufenthaltsbewilligung verlängern (B/L) — geführter Ablauf, on-mission für Zugewanderte.
// Rechtzeitig verlängern (kommt nicht automatisch), Unterlagen, Meldepflichten, Ausblick
// C-Bewilligung. Schritt 4 entängstigt: Prämienverbilligung (IPV) ist KEINE Sozialhilfe
// und schadet der Bewilligung nicht + leise Brücke zum Lebenszustand „Frisch zugezogen".
// Frist ab dem Ablaufdatum der Bewilligung, das die Person eingibt: spätestens 14 Tage
// davor (VZAE Art. 59) — nicht mehr «90 Tage ab heute» (Befund 24.09.2026). Kein Rat —
// Orientierung, keine Rechtsberatung.

export const BewilligungFristen = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);

  return React.createElement(AblaufContainer, {
    palette, icon: 'behoerden',
    title: t('bewilligung.title'),
    intro: t('bewilligung.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('bewilligung.step1Title') },
      React.createElement('p', { style: s.stepText }, t('bewilligung.step1Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'bewilligung-frist', frist: (d) => plusTage(d, -14),
        labelKey: 'bewilligung.fristLabel', hinweisKey: 'bewilligung.fristHinweis', vorbeiKey: 'bewilligung.fristVorbei',
        buttonKey: 'bewilligung.step1Button', doneKey: 'bewilligung.step1Done', calendarKey: 'bewilligung.step1CalendarLink',
        reminderTitle: t('bewilligung.reminderTitle'), category: 'admin',
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
    React.createElement(AblaufFooter, { palette, t, quelle: t('bewilligung.quelle'), notes: [t('bewilligung.footerNote'), t('trust.localOnly')] })
  );
};

export default BewilligungFristen;
