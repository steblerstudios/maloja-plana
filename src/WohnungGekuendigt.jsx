import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusTage } from './utils/fristen.js';

// Wohnung gekündigt (durch die Vermieterschaft) — geführter Ablauf, gebaut 24.09.2026
// auf Wunsch von Stebler Studios («neue Abläufe: ja unbedingt»). Anti-Panik-Ton wie «Betreibung»:
// die 30-Tage-Frist zuerst (OR Art. 273), dann Form (266l–266o), Missbrauch und
// Erstreckung (271–272b), Schlichtungsbehörde (ZPO 113, 200–202), Anschluss an Umzug,
// Mietzins, Sozialhilfe. Fachentwurf mit Wortlaut: swiss-precision-Prüfung 24.09.2026.
//
// Frist: «Empfang + 30 Tage». Empfang = absolute Empfangstheorie (BGE 143 III 15,
// 137 III 208): bei einem Einschreiben zählt die Abholungseinladung, nicht der Tag
// der Abholung — darum fragt das Feld nach genau diesem Tag. Nie später als das Gesetz.

export const WohnungGekuendigt = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  return React.createElement(AblaufContainer, {
    palette, icon: 'home',
    title: t('wohnungGekuendigt.title'),
    intro: t('wohnungGekuendigt.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('wohnungGekuendigt.step1Title') },
      React.createElement('p', { style: s.stepText }, t('wohnungGekuendigt.step1Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'wohnungGekuendigt-frist', frist: (d) => plusTage(d, 30),
        labelKey: 'wohnungGekuendigt.fristLabel', hinweisKey: 'wohnungGekuendigt.fristHinweis', vorbeiKey: 'wohnungGekuendigt.fristVorbei',
        buttonKey: 'wohnungGekuendigt.step1Button', doneKey: 'wohnungGekuendigt.step1Done', calendarKey: 'wohnungGekuendigt.step1CalendarLink',
        reminderTitle: t('wohnungGekuendigt.reminderTitle'), category: 'admin',
      }),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('wohnungGekuendigt.step1Befristet'))
    ),
    React.createElement(AblaufStep, { palette, title: t('wohnungGekuendigt.step2Title') },
      React.createElement('p', { style: s.stepText }, t('wohnungGekuendigt.step2Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wohnungGekuendigt.step2Link'), onClick: () => onNavigate('tresor', undefined, 'wohnen') })
    ),
    React.createElement(AblaufStep, { palette, title: t('wohnungGekuendigt.step3Title') },
      React.createElement('p', { style: s.stepText }, t('wohnungGekuendigt.step3Text')),
      React.createElement('p', { style: s.warn }, t('wohnungGekuendigt.step3Warn'))
    ),
    React.createElement(AblaufStep, { palette, title: t('wohnungGekuendigt.step4Title') },
      React.createElement('p', { style: s.stepText }, t('wohnungGekuendigt.step4Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('wohnungGekuendigt.step5Title') },
      React.createElement('p', { style: s.stepText }, t('wohnungGekuendigt.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wohnungGekuendigt.step5LinkUmzug'), onClick: () => onNavigate('umzug') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wohnungGekuendigt.step5LinkMietzins'), onClick: () => onNavigate('mietzins') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('wohnungGekuendigt.step5LinkSozialhilfe'), onClick: () => onNavigate('sozialhilfe') }),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('wohnungGekuendigt.abgrenzung'))
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('wohnungGekuendigt.quelle'), notes: [t('wohnungGekuendigt.footerNote'), t('trust.localOnly')] })
  );
};

export default WohnungGekuendigt;
