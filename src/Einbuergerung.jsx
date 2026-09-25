import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';

// Einbürgerung — geführter Ablauf, gebaut 24.09.2026 (in docs/ABLAEUFE.md seit Juli als
// Lücke H2). Ordentliche Einbürgerung: C + zehn Jahre (BüG 9, 33), kantonale Wohndauer
// 2–5 Jahre (BüG 18), Integration und Sprache B1/A2 (BüG 11/12, BüV 6/7), Gesuch bei
// Gemeinde/Kanton (BüG 13–16, 34), SEM und Entscheid (BüV 23, BüG 14), Gebühren (BüG 35);
// kurz die erleichterte Einbürgerung (BüG 21, 24a, 25).
//
// Bewusst OHNE Frist-Knopf: ein «frühester Termin» lässt sich aus Doppelzählung, halben
// F-Jahren, Unterbrüchen und kantonaler Dauer nicht redlich berechnen — ein falsches
// Datum führt zu einem verfrühten Gesuch (Fachprüfung 24.09.2026). Ohne Bundesgebühr als
// Zahl: sie wäre nur ein Drittel des Preises und läse sich wie das Ganze.

export const Einbuergerung = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  return React.createElement(AblaufContainer, {
    palette, icon: 'behoerden',
    title: t('einbuergerung.title'),
    intro: t('einbuergerung.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('einbuergerung.step1Title') },
      React.createElement('p', { style: s.stepText }, t('einbuergerung.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('einbuergerung.step1LinkBewilligung'), onClick: () => onNavigate('bewilligung') })
    ),
    React.createElement(AblaufStep, { palette, title: t('einbuergerung.step2Title') },
      React.createElement('p', { style: s.stepText }, t('einbuergerung.step2Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('einbuergerung.step2LinkTresor'), onClick: () => onNavigate('tresor') })
    ),
    React.createElement(AblaufStep, { palette, title: t('einbuergerung.step3Title') },
      React.createElement('p', { style: s.stepText }, t('einbuergerung.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('einbuergerung.step3LinkTresor'), onClick: () => onNavigate('tresor') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('einbuergerung.step3LinkUmzug'), onClick: () => onNavigate('umzug') })
    ),
    React.createElement(AblaufStep, { palette, title: t('einbuergerung.step4Title') },
      React.createElement('p', { style: s.stepText }, t('einbuergerung.step4Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('einbuergerung.step5Title') },
      React.createElement('p', { style: s.stepText }, t('einbuergerung.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('einbuergerung.step5LinkHeirat'), onClick: () => onNavigate('heirat') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('einbuergerung.quelle'), notes: [t('einbuergerung.footerNote'), t('trust.localOnly')] })
  );
};

export default Einbuergerung;
