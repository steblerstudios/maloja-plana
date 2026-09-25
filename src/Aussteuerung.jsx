import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusTage } from './utils/fristen.js';

// Ausgesteuert — geführter Ablauf, gebaut 24.09.2026. Gegenstück und Fortsetzung von
// «Stelle verloren». Was es heisst (AVIG 9, 27; ÜLG 3), Unfalldeckung endet 31 Tage
// nach dem letzten Taggeld (UVG 3 II) → Krankenkasse (KVG 8, 10), AHV als
// Nichterwerbstätige (AHVG 3, 10, 29ter), Freizügigkeit (FZG 5, BVG 47), Sozialhilfe
// (BV 12), IPV (KVG 65), ab 60 Überbrückungsleistungen (ÜLG 3, 5, 14, 19), RAV
// weiter offen (AVG 26, 27). Bewusst ohne Beträge und ohne erfundene Anmeldefristen:
// für AHV und ÜL gibt es keine (Fachprüfung 24.09.2026).

export const Aussteuerung = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  return React.createElement(AblaufContainer, {
    palette, icon: 'lebenslauf',
    title: t('aussteuerung.title'),
    intro: t('aussteuerung.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('aussteuerung.step1Title') },
      React.createElement('p', { style: s.stepText }, t('aussteuerung.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('aussteuerung.step1Link'), onClick: () => onNavigate('alv') })
    ),
    React.createElement(AblaufStep, { palette, title: t('aussteuerung.step2Title') },
      React.createElement('p', { style: s.stepText }, t('aussteuerung.step2Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'aussteuerung-frist', frist: (d) => plusTage(d, 31),
        labelKey: 'aussteuerung.fristLabel', hinweisKey: 'aussteuerung.fristHinweis', vorbeiKey: 'aussteuerung.fristVorbei',
        buttonKey: 'aussteuerung.step2Button', doneKey: 'aussteuerung.step2Done', calendarKey: 'aussteuerung.step2CalendarLink',
        reminderTitle: t('aussteuerung.reminderTitle'), category: 'insurance',
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('aussteuerung.step2LinkKk'), onClick: () => onNavigate('kk') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('aussteuerung.step2LinkUk'), onClick: () => onNavigate('unfallkrankheit') })
    ),
    React.createElement(AblaufStep, { palette, title: t('aussteuerung.step3Title') },
      React.createElement('p', { style: s.stepText }, t('aussteuerung.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('aussteuerung.step3Link'), onClick: () => onNavigate('vorsorge') })
    ),
    React.createElement(AblaufStep, { palette, title: t('aussteuerung.step4Title'), icon: 'ergaenzungsleistungen' },
      React.createElement('p', { style: s.stepText }, t('aussteuerung.step4Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('aussteuerung.step4Uel')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('aussteuerung.step4LinkSoz'), onClick: () => onNavigate('sozialhilfe') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('aussteuerung.step4LinkIpv'), onClick: () => onNavigate('premium') })
    ),
    React.createElement(AblaufStep, { palette, title: t('aussteuerung.step5Title') },
      React.createElement('p', { style: s.stepText }, t('aussteuerung.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('aussteuerung.step5Link'), onClick: () => onNavigate('cv') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('aussteuerung.quelle'), notes: [t('aussteuerung.footerNote'), t('trust.localOnly')] })
  );
};

export default Aussteuerung;
