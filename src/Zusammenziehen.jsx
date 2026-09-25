import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';

// Zusammenziehen ohne Trauschein — geführter Ablauf, gebaut 25.09.2026 auf Wunsch von Stebler Studios.
// Inhalt aus der Fachprüfung (swiss-precision) vom 25.09.2026, jede Aussage am Gesetzeswortlaut
// der am 25.09.2026 geltenden Fassung. Fristen nur, wo das Gesetz eine nennt; «nie später
// als das Gesetz» (utils/fristen.js).

export const Zusammenziehen = ({ palette, t, chapters, onNavigate }) => {
  const s = ablaufStyles(palette);
  const chapterIdx = (key) => (chapters ? chapters.findIndex((ch) => ch.key === key) : -1);
  return React.createElement(AblaufContainer, {
    palette, icon: 'home',
    title: t('zusammenziehen.title'),
    intro: t('zusammenziehen.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('zusammenziehen.step1Title') },
      React.createElement('p', { style: s.stepText }, t('zusammenziehen.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zusammenziehen.step1LinkUmzug'), onClick: () => onNavigate('umzug') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zusammenziehen.step1LinkMietzins'), onClick: () => onNavigate('mietzins') })
    ),
    React.createElement(AblaufStep, { palette, title: t('zusammenziehen.step2Title') },
      React.createElement('p', { style: s.stepText }, t('zusammenziehen.step2Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('zusammenziehen.step3Title') },
      React.createElement('p', { style: s.stepText }, t('zusammenziehen.step3Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('zusammenziehen.step3Vorsorge')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zusammenziehen.step3LinkBehoerden'), onClick: () => onNavigate('chapter', chapterIdx('behoerden')) }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zusammenziehen.step3LinkVorsorge'), onClick: () => onNavigate('vorsorge') })
    ),
    React.createElement(AblaufStep, { palette, title: t('zusammenziehen.step4Title') },
      React.createElement('p', { style: s.stepText }, t('zusammenziehen.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zusammenziehen.step4LinkVorsorgeauftrag'), onClick: () => onNavigate('vorsorgeauftrag') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zusammenziehen.step4LinkTax'), onClick: () => onNavigate('tax') })
    ),
    React.createElement(AblaufStep, { palette, title: t('zusammenziehen.step5Title') },
      React.createElement('p', { style: s.stepText }, t('zusammenziehen.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zusammenziehen.step5LinkKind'), onClick: () => onNavigate('kind') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zusammenziehen.step5LinkAdoption'), onClick: () => onNavigate('adoption') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zusammenziehen.relatedHeirat'), onClick: () => onNavigate('heirat') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('zusammenziehen.quelle'), notes: [t('zusammenziehen.footerNote'), t('trust.localOnly')] })
  );
};

export default Zusammenziehen;
