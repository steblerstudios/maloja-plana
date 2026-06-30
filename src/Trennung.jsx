import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';

// Trennung / Scheidung — geführter Ablauf, würdevoll und ruhig (kein Konflikt-Frame).
// Beratung & Trennung vs. Scheidung, Wohnen & Adresse, Kinder & Unterhalt, Finanzen &
// Steuern (getrennte Veranlagung, Vorsorgeausgleich). Am Ende „Verwandte Ereignisse"
// (Umzug). Kein Rat — Orientierung, keine Rechtsberatung.

export const Trennung = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);

  return React.createElement(AblaufContainer, {
    palette, icon: 'family',
    title: t('trennung.title'),
    intro: t('trennung.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('trennung.step1Title') },
      React.createElement('p', { style: s.stepText }, t('trennung.step1Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('trennung.step2Title') },
      React.createElement('p', { style: s.stepText }, t('trennung.step2Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('trennung.step2Link'), onClick: () => onNavigate('umzug') })
    ),
    React.createElement(AblaufStep, { palette, title: t('trennung.step3Title') },
      React.createElement('p', { style: s.stepText }, t('trennung.step3Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('trennung.step4Title') },
      React.createElement('p', { style: s.stepText }, t('trennung.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('trennung.step4LinkTax'), onClick: () => onNavigate('tax') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('trennung.step4LinkVorsorge'), onClick: () => onNavigate('vorsorge') })
    ),
    React.createElement(AblaufFooter, { palette, notes: [t('trennung.footerNote'), t('trust.localOnly')] })
  );
};

export default Trennung;
