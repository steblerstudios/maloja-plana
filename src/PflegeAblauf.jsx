import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';

// Pflegende Angehörige — geführter Ablauf, der die oft übersehenen Ansprüche bündelt:
// Betreuungsgutschrift (AHV, hebt die eigene Rente), Betreuungsentschädigung (EO,
// bezahlter Urlaub), Hilflosenentschädigung der gepflegten Person, sowie Entlastung
// und Beratung. Pflege, die still geleistet wird, bleibt sonst unbeachtet.
// Kein Rat — Orientierung, keine Rechts- oder Medizinberatung.

export const PflegeAblauf = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);

  return React.createElement(AblaufContainer, {
    palette, icon: 'heart',
    title: t('pflege.title'),
    intro: t('pflege.intro'),
  },
    // Schritt 1 — Betreuungsgutschrift der AHV (hebt die eigene spätere Rente)
    React.createElement(AblaufStep, { palette, title: t('pflege.step1Title'), icon: 'vorsorge' },
      React.createElement('p', { style: s.stepText }, t('pflege.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('pflege.step1Link'), onClick: () => onNavigate('vorsorge') })
    ),
    // Schritt 2 — Betreuungsentschädigung (EO): bezahlter Urlaub für die Pflege
    React.createElement(AblaufStep, { palette, title: t('pflege.step2Title') },
      React.createElement('p', { style: s.stepText }, t('pflege.step2Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('pflege.step2Link'), onClick: () => onNavigate('eo') })
    ),
    // Schritt 3 — Hilflosenentschädigung der gepflegten Person (finanziert Betreuung)
    React.createElement(AblaufStep, { palette, title: t('pflege.step3Title'), icon: 'ergaenzungsleistungen' },
      React.createElement('p', { style: s.stepText }, t('pflege.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('pflege.step3Link'), onClick: () => onNavigate('iv') })
    ),
    // Schritt 4 — Entlastung & Beratung: du musst es nicht allein tragen
    React.createElement(AblaufStep, { palette, title: t('pflege.step4Title') },
      React.createElement('p', { style: s.stepText }, t('pflege.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('pflege.step4Link'), onClick: () => onNavigate('situationen') })
    ),
    React.createElement(AblaufFooter, { palette, notes: [t('pflege.footerNote'), t('trust.localOnly')] })
  );
};

export default PflegeAblauf;
