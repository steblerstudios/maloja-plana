import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { inDays, formatDE } from './utils/helpers.js';

// Krankenkasse zum ersten Mal — geführter Ablauf für Neuzuzüger:innen, junge Menschen
// (mit ~25 aus der Familiendeckung gefallen) und Menschen im Asylkontext. Ruhige
// Orientierung mit der kritischsten Sache zuerst: die 3-Monats-Frist (Deckung gilt bei
// rechtzeitigem Abschluss rückwirkend → keine Lücke), dann Kassenwahl (Grundversicherung
// überall gleich, Aufnahmepflicht), Franchise/Unfall, Prämienverbilligung. Kein Rat —
// Orientierung. Asyl-Hinweis würdevoll (Kasse wird im Verfahren meist zugewiesen).

export const KKErstAnmeldung = ({ palette, t, data, onNavigate }) => {
  const s = ablaufStyles(palette);
  // Versicherungspflicht: innert 3 Monaten ab Zuzug. Wenn ein Einzugsdatum erfasst ist
  // (z.B. weil der Umzug in die Schweiz noch geplant ist), rechnen wir die Frist ab da —
  // aber nur, wenn sie noch in der Zukunft liegt. Sonst ruhige Orientierungs-Frist
  // 90 Tage ab heute (im Kalender verschiebbar).
  const moveIn = (data?.wohnen?.moveInDate || '').trim();
  let deadline = inDays(90);
  if (/^\d{4}-\d{2}-\d{2}$/.test(moveIn)) {
    const d = new Date(moveIn + 'T00:00:00');
    d.setDate(d.getDate() + 90);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (iso >= inDays(0)) deadline = iso;
  }

  return React.createElement(AblaufContainer, {
    palette, icon: 'insurance',
    title: t('kkErst.title'),
    intro: t('kkErst.intro'),
  },
    // Schritt 1 — die 3-Monats-Frist (Deckung rückwirkend bei rechtzeitigem Abschluss)
    React.createElement(AblaufStep, { palette, title: t('kkErst.step1Title') },
      React.createElement('p', { style: s.stepText }, t('kkErst.step1Text')),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('kkErst.step1Button', { date: formatDE(deadline) }),
        doneLabel: t('kkErst.step1Done'),
        calendarLabel: t('kkErst.step1CalendarLink'),
        onNavigate,
        reminder: {
          title: t('kkErst.reminderTitle'),
          dueDate: deadline,
          category: 'insurance',
          recurrence: 'once',
        },
      })
    ),

    // Schritt 2 — Kasse wählen (Grundversicherung überall gleich, Aufnahmepflicht)
    React.createElement(AblaufStep, { palette, title: t('kkErst.step2Title') },
      React.createElement('p', { style: s.stepText }, t('kkErst.step2Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kkErst.step2Link'), onClick: () => onNavigate('praemien') })
    ),

    // Schritt 3 — Franchise & Unfalldeckung
    React.createElement(AblaufStep, { palette, title: t('kkErst.step3Title') },
      React.createElement('p', { style: s.stepText }, t('kkErst.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kkErst.step3LinkFranchise'), onClick: () => onNavigate('praemien') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kkErst.step3LinkUk'), onClick: () => onNavigate('unfallkrankheit') })
    ),

    // Schritt 4 — Prämienverbilligung prüfen
    React.createElement(AblaufStep, { palette, title: t('kkErst.step4Title') },
      React.createElement('p', { style: s.stepText }, t('kkErst.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kkErst.step4Link'), onClick: () => onNavigate('premium') })
    ),

    // Hinweis — Asyl/vorläufig Aufgenommene: Kasse wird meist zugewiesen (würdevoll)
    React.createElement(AblaufStep, { palette, title: t('kkErst.asylTitle') },
      React.createElement('p', { style: s.stepText }, t('kkErst.asylText')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('kkErst.asylLink'), onClick: () => onNavigate('asyl') })
    ),

    React.createElement(AblaufFooter, { palette, notes: [t('kkErst.footerAufnahme'), t('trust.localOnly')] })
  );
};

export default KKErstAnmeldung;
