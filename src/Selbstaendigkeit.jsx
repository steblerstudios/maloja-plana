import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { inDays, formatDE } from './utils/helpers.js';

// Selbständig werden — geführter Ablauf. Macht die unsichtbaren Risiken sichtbar, die
// vorher der Arbeitgeber getragen hat. Reihenfolge: AHV-Status anerkennen lassen (das
// Fundament), Neben-/Haupterwerb (Weichenstellung, + leise Brücke zum Lebenszustand
// „Tiefes Einkommen"), Versicherungslücken (UVG/KTG/BVG), Steuern/MwSt zurücklegen.
// Kein Rat — Orientierung, keine Rechts-/Steuerberatung.

export const Selbstaendigkeit = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  // Keine harte gesetzliche Frist, aber die AHV-Anmeldung soll bei Aufnahme der Tätigkeit
  // erfolgen → ruhige Orientierungs-Erinnerung „im ersten Monat" (im Kalender verschiebbar).
  const deadline = inDays(30);

  return React.createElement(AblaufContainer, {
    palette, icon: 'lebenslauf',
    title: t('selbstaendigkeit.title'),
    intro: t('selbstaendigkeit.intro'),
  },
    // Schritt 1 — AHV-Status anerkennen lassen (Fundament)
    React.createElement(AblaufStep, { palette, title: t('selbstaendigkeit.step1Title') },
      React.createElement('p', { style: s.stepText }, t('selbstaendigkeit.step1Text')),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('selbstaendigkeit.step1Button', { date: formatDE(deadline) }),
        doneLabel: t('selbstaendigkeit.step1Done'),
        calendarLabel: t('selbstaendigkeit.step1CalendarLink'),
        onNavigate,
        reminder: {
          title: t('selbstaendigkeit.reminderTitle'),
          dueDate: deadline,
          category: 'admin',
          recurrence: 'once',
        },
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('selbstaendigkeit.step1Link'), onClick: () => onNavigate('vorsorge') })
    ),

    // Schritt 2 — Neben- oder Haupterwerb? (Weichenstellung) + leise Brücke zum
    // Lebenszustand „Tiefes Einkommen" (Selbständige sind NICHT ALV-versichert)
    React.createElement(AblaufStep, { palette, title: t('selbstaendigkeit.step2Title') },
      React.createElement('p', { style: s.stepText }, t('selbstaendigkeit.step2Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('selbstaendigkeit.step2LinkSituation'), onClick: () => onNavigate('situationen') })
    ),

    // Schritt 3 — Versicherungslücken schließen (UVG, KTG, BVG)
    React.createElement(AblaufStep, { palette, title: t('selbstaendigkeit.step3Title') },
      React.createElement('p', { style: s.stepText }, t('selbstaendigkeit.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('selbstaendigkeit.step3LinkUk'), onClick: () => onNavigate('unfallkrankheit') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('selbstaendigkeit.step3LinkVorsorge'), onClick: () => onNavigate('vorsorge') })
    ),

    // Schritt 4 — Steuern & MwSt zurücklegen
    React.createElement(AblaufStep, { palette, title: t('selbstaendigkeit.step4Title') },
      React.createElement('p', { style: s.stepText }, t('selbstaendigkeit.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('selbstaendigkeit.step4Link'), onClick: () => onNavigate('tax') })
    ),

    React.createElement(AblaufFooter, { palette, notes: [t('selbstaendigkeit.footerNote'), t('trust.localOnly')] })
  );
};

export default Selbstaendigkeit;
