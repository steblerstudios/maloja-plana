import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';

// Lehre beginnen — was dazugehört — geführter Ablauf, gebaut 25.09.2026 auf Wunsch von Stebler Studios.
// Inhalt aus der Fachprüfung (swiss-precision) vom 25.09.2026, jede Aussage am Gesetzeswortlaut
// der am 25.09.2026 geltenden Fassung. Fristen nur, wo das Gesetz eine nennt; «nie später
// als das Gesetz» (utils/fristen.js).

export const Lehre = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  return React.createElement(AblaufContainer, {
    palette, icon: 'lebenslauf',
    title: t('lehre.title'),
    intro: t('lehre.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('lehre.step1Title') },
      React.createElement('p', { style: s.stepText }, t('lehre.step1Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('lehre.abgrenzung')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('lehre.step1Minderjaehrig')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('lehre.step1LinkNeuerJob'), onClick: () => onNavigate('neuerjob') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('lehre.step1Link'), onClick: () => onNavigate('tresor') })
    ),
    React.createElement(AblaufStep, { palette, title: t('lehre.step2Title') },
      React.createElement('p', { style: s.stepText }, t('lehre.step2Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('lehre.step2Aufloesung'))
    ),
    React.createElement(AblaufStep, { palette, title: t('lehre.step3Title') },
      React.createElement('p', { style: s.stepText }, t('lehre.step3Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('lehre.step4Title') },
      React.createElement('p', { style: s.stepText }, t('lehre.step4Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('lehre.step4Unfall')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('lehre.step4Steuern')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('lehre.step4Link'), onClick: () => onNavigate('tax') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('lehre.step4LinkUk'), onClick: () => onNavigate('unfallkrankheit') })
    ),
    React.createElement(AblaufStep, { palette, title: t('lehre.step5Title') },
      React.createElement('p', { style: s.stepText }, t('lehre.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('lehre.step5LinkStip'), onClick: () => onNavigate('stipendien') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('lehre.step5LinkIpv'), onClick: () => onNavigate('premium') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('lehre.quelle'), notes: [t('lehre.footerNote'), t('trust.localOnly')] })
  );
};

export default Lehre;
