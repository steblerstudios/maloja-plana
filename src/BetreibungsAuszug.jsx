import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';

// Betreibungsauszug bestellen — geführter Ablauf, gebaut 25.09.2026 auf Wunsch von Stebler Studios.
// Inhalt aus der Fachprüfung (swiss-precision) vom 25.09.2026, jede Aussage am Gesetzeswortlaut
// der am 25.09.2026 geltenden Fassung. Fristen nur, wo das Gesetz eine nennt; «nie später
// als das Gesetz» (utils/fristen.js).

export const BetreibungsAuszug = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  return React.createElement(AblaufContainer, {
    palette, icon: 'behoerden',
    title: t('betreibungsAuszug.title'),
    intro: t('betreibungsAuszug.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('betreibungsAuszug.step1Title') },
      React.createElement('p', { style: s.stepText }, t('betreibungsAuszug.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('betreibungsAuszug.step1LinkWohnung'), onClick: () => onNavigate('wohnunggekuendigt') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('betreibungsAuszug.step1LinkMietzins'), onClick: () => onNavigate('mietzins') })
    ),
    React.createElement(AblaufStep, { palette, title: t('betreibungsAuszug.step2Title') },
      React.createElement('p', { style: s.stepText }, t('betreibungsAuszug.step2Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('betreibungsAuszug.step2Umzug')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('betreibungsAuszug.step2LinkUmzug'), onClick: () => onNavigate('umzug') })
    ),
    React.createElement(AblaufStep, { palette, title: t('betreibungsAuszug.step3Title') },
      React.createElement('p', { style: s.stepText }, t('betreibungsAuszug.step3Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('betreibungsAuszug.step4Title') },
      React.createElement('p', { style: s.stepText }, t('betreibungsAuszug.step4Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('betreibungsAuszug.step4Zeitpunkt')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('betreibungsAuszug.step4LinkBetreibung'), onClick: () => onNavigate('betreibung') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('betreibungsAuszug.step4LinkSchulden'), onClick: () => onNavigate('schulden') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('betreibungsAuszug.step4LinkTresor'), onClick: () => onNavigate('tresor') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('betreibungsAuszug.quelle'), notes: [t('betreibungsAuszug.footerNote'), t('trust.localOnly')] })
  );
};

export default BetreibungsAuszug;
