import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusMonate } from './utils/fristen.js';

// Todesfall im Umfeld — geführter Ablauf, würdevoll und ohne Druck. Die ersten Tage,
// Bestattung, Renten & Versicherungen melden, eigener Aufstockung-Schritt
// (Hinterbliebenenrente + EL, mit EL-Icon wie Pensionierung/IV; leise Brücke zum
// Lebenszustand „Halbwaise", wenn ein Elternteil verstorben ist), Erbschaft/Nachlass.
// Die kritische Frist ist die Ausschlagung einer überschuldeten Erbschaft (3 Monate).
// Kein Rat — Orientierung, keine Rechtsberatung.

export const Todesfall = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);

  return React.createElement(AblaufContainer, {
    palette, icon: 'document',
    title: t('todesfall.title'),
    intro: t('todesfall.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('todesfall.step1Title') },
      React.createElement('p', { style: s.stepText }, t('todesfall.step1Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('todesfall.step2Title') },
      React.createElement('p', { style: s.stepText }, t('todesfall.step2Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('todesfall.step3Title') },
      React.createElement('p', { style: s.stepText }, t('todesfall.step3Text')),
      // Mitteilungs-Brief, vorgewählt (26.09.2026) — mit dem Erbschafts-Hinweis im Briefgenerator.
      onNavigate && React.createElement(AblaufLink, { palette, label: t('briefe.ablaufLink.deathNotice'), onClick: () => onNavigate('briefe', undefined, 'deathNotice') })
    ),
    // Eigener „Aufstockung"-Schritt (wie Pensionierung#4/IV#3): das EL-Icon markiert
    // konsistent den finanziellen Auffangnetz-Schritt. Hinterbliebenenrente + EL,
    // Links zur Vorsorge und zur Halbwaisen-Situation.
    React.createElement(AblaufStep, { palette, title: t('todesfall.stepElTitle'), icon: 'ergaenzungsleistungen' },
      React.createElement('p', { style: s.stepText }, t('todesfall.stepElText')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('todesfall.step3Link'), onClick: () => onNavigate('vorsorge') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('todesfall.step3LinkSituation'), onClick: () => onNavigate('situationen') })
    ),
    React.createElement(AblaufStep, { palette, title: t('todesfall.step4Title') },
      React.createElement('p', { style: s.stepText }, t('todesfall.step4Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'todesfall-frist', frist: (d) => plusMonate(d, 3),
        labelKey: 'todesfall.fristLabel', hinweisKey: 'todesfall.fristHinweis', vorbeiKey: 'todesfall.fristVorbei',
        buttonKey: 'todesfall.step4Button', doneKey: 'todesfall.step4Done', calendarKey: 'todesfall.step4CalendarLink',
        reminderTitle: t('todesfall.reminderTitle'), category: 'admin',
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('todesfall.step4Link'), onClick: () => onNavigate('schulden') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('todesfall.quelle'), notes: [t('todesfall.footerNote'), t('trust.localOnly')] })
  );
};

export default Todesfall;
