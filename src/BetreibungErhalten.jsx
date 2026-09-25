import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusTage } from './utils/fristen.js';

// Betreibung erhalten — geführter Ablauf als ruhige Anti-Panik-Orientierung. Die
// kritischste Frist zuerst: 10 Tage Rechtsvorschlag (stoppt die Betreibung vorerst,
// ohne Begründung). Dann: stimmt die Forderung (zahlen/Raten vs. Rechtsvorschlag),
// Budget/Existenzminimum schützen + kostenlose Schuldenberatung + leise Brücke zum
// Lebenszustand „Verschuldet oder in Betreibung". Würdevoll, kein Strafregister-Frame.
// Kein Rat — Orientierung, keine Rechtsberatung.

export const BetreibungErhalten = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);

  return React.createElement(AblaufContainer, {
    palette, icon: 'behoerden',
    title: t('betreibung.title'),
    intro: t('betreibung.intro'),
  },
    // Schritt 1 — Ruhe, 10-Tage-Frist Rechtsvorschlag (das Wichtigste zuerst)
    React.createElement(AblaufStep, { palette, title: t('betreibung.step1Title') },
      React.createElement('p', { style: s.stepText }, t('betreibung.step1Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'betreibung-frist', frist: (d) => plusTage(d, 10),
        labelKey: 'betreibung.fristLabel', hinweisKey: 'betreibung.fristHinweis', vorbeiKey: 'betreibung.fristVorbei',
        buttonKey: 'betreibung.step1Button', doneKey: 'betreibung.step1Done', calendarKey: 'betreibung.step1CalendarLink',
        reminderTitle: t('betreibung.reminderTitle'), category: 'admin',
      })
    ),

    // Schritt 2 — Stimmt die Forderung? (zahlen/Raten vs. Rechtsvorschlag)
    React.createElement(AblaufStep, { palette, title: t('betreibung.step2Title') },
      React.createElement('p', { style: s.stepText }, t('betreibung.step2Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('betreibung.step2Link'), onClick: () => onNavigate('schulden') })
    ),

    // Schritt 3 — Budget/Existenzminimum schützen + kostenlose Beratung + Brücke zum
    // andauernden Lebenszustand „Verschuldet oder in Betreibung" (sammelt die Tiefe)
    React.createElement(AblaufStep, { palette, title: t('betreibung.step3Title') },
      React.createElement('p', { style: s.stepText }, t('betreibung.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('betreibung.step3Link'), onClick: () => onNavigate('sync') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('betreibung.step3LinkSituation'), onClick: () => onNavigate('situationen') })
    ),

    React.createElement(AblaufFooter, { palette, t, quelle: t('betreibung.quelle'), notes: [t('betreibung.footerNote'), t('trust.localOnly')] })
  );
};

export default BetreibungErhalten;
