import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';

// Vorsorgeauftrag und Patientenverfügung — geführter Ablauf, gebaut 25.09.2026 auf Wunsch von Stebler Studios.
// Inhalt aus der Fachprüfung (swiss-precision) vom 25.09.2026, jede Aussage am Gesetzeswortlaut
// der am 25.09.2026 geltenden Fassung. Fristen nur, wo das Gesetz eine nennt; «nie später
// als das Gesetz» (utils/fristen.js).

export const Vorsorgeauftrag = ({ palette, t, chapters, onNavigate }) => {
  const s = ablaufStyles(palette);
  const chapterIdx = (key) => (chapters ? chapters.findIndex((ch) => ch.key === key) : -1);
  return React.createElement(AblaufContainer, {
    palette, icon: 'document',
    title: t('vorsorgeauftrag.title'),
    intro: t('vorsorgeauftrag.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('vorsorgeauftrag.step1Title') },
      React.createElement('p', { style: s.stepText }, t('vorsorgeauftrag.step1Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('vorsorgeauftrag.step2Title') },
      React.createElement('p', { style: s.stepText }, t('vorsorgeauftrag.step2Text')),
      React.createElement('p', { style: s.warn }, t('vorsorgeauftrag.step2Warn')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('vorsorgeauftrag.step2Link'), onClick: () => onNavigate('tresor') })
    ),
    React.createElement(AblaufStep, { palette, title: t('vorsorgeauftrag.step3Title') },
      React.createElement('p', { style: s.stepText }, t('vorsorgeauftrag.step3Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('vorsorgeauftrag.step4Title') },
      React.createElement('p', { style: s.stepText }, t('vorsorgeauftrag.step4Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('vorsorgeauftrag.step5Title') },
      React.createElement('p', { style: s.stepText }, t('vorsorgeauftrag.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('vorsorgeauftrag.step5LinkNotfall'), onClick: () => onNavigate('chapter', chapterIdx('notfall')) }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('vorsorgeauftrag.step5LinkPass'), onClick: () => onNavigate('notfallpass') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('vorsorgeauftrag.step5LinkDossier'), onClick: () => onNavigate('notfalldossier') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('vorsorgeauftrag.quelle'), notes: [t('vorsorgeauftrag.footerNote'), t('trust.localOnly')] })
  );
};

export default Vorsorgeauftrag;
