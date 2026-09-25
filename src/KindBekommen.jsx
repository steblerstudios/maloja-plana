import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusMonate } from './utils/fristen.js';

// Kind bekommen — geführter Ablauf. Geburt/Vaterschaft anmelden, Kind versichern (KK
// innert 3 Monaten, rückwirkend), Familienzulagen (inkl. kantonaler Geburtszulage),
// Mutterschafts-/Vaterschaftsentschädigung & Betreuung. Schritt 5 prüft neu entstehende
// Ansprüche (IPV neu, da der Haushalt wächst) und führt zu passenden Lebenszuständen.
// Am Ende „Verwandte Ereignisse" (Heirat). Kein Rat — Orientierung.

export const KindBekommen = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);

  return React.createElement(AblaufContainer, {
    palette, icon: 'family',
    title: t('kind.title'),
    intro: t('kind.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('kind.step1Title') },
      React.createElement('p', { style: s.stepText }, t('kind.step1Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('kind.step2Title') },
      React.createElement('p', { style: s.stepText }, t('kind.step2Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'kind-frist', frist: (d) => plusMonate(d, 3),
        labelKey: 'kind.fristLabel', hinweisKey: 'kind.fristHinweis', vorbeiKey: 'kind.fristVorbei',
        buttonKey: 'kind.step2Button', doneKey: 'kind.step2Done', calendarKey: 'kind.step2CalendarLink',
        reminderTitle: t('kind.reminderTitle'), category: 'insurance',
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kind.step2Link'), onClick: () => onNavigate('praemien') })
    ),
    React.createElement(AblaufStep, { palette, title: t('kind.step3Title') },
      React.createElement('p', { style: s.stepText }, t('kind.step3Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('kind.step4Title') },
      React.createElement('p', { style: s.stepText }, t('kind.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kind.step4Link'), onClick: () => onNavigate('eo') })
    ),
    React.createElement(AblaufStep, { palette, title: t('kind.step5Title') },
      React.createElement('p', { style: s.stepText }, t('kind.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kind.step5LinkIpv'), onClick: () => onNavigate('premium') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kind.step5LinkSituation'), onClick: () => onNavigate('situationen') })
    ),
    onNavigate && React.createElement(AblaufStep, { palette, title: t('kind.relatedTitle') },
      React.createElement(AblaufLink, { palette, label: t('kind.relatedHeirat'), onClick: () => onNavigate('heirat') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('kind.quelle'), notes: [t('kind.footerNote'), t('trust.localOnly')] })
  );
};

export default KindBekommen;
