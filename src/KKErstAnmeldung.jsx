import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusMonate } from './utils/fristen.js';

// Krankenkasse zum ersten Mal — geführter Ablauf für Neuzuzüger:innen, junge Menschen
// (jede Person ist einzeln versichert — es gibt keine «Familiendeckung», BAG) und Menschen im Asylkontext. Ruhige
// Orientierung mit der kritischsten Sache zuerst: die 3-Monats-Frist (Deckung gilt bei
// rechtzeitigem Abschluss rückwirkend → keine Lücke), dann Kassenwahl (Grundversicherung
// überall gleich, Aufnahmepflicht), Franchise/Unfall, Prämienverbilligung. Kein Rat —
// Orientierung. Asyl-Hinweis würdevoll (Kasse wird im Verfahren meist zugewiesen).

export const KKErstAnmeldung = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  // Versicherungspflicht: innert drei Monaten nach der Wohnsitznahme (KVG Art. 3) —
  // drei MONATE, nicht 90 Tage. Gerechnet ab dem Zuzugsdatum, das die Person eingibt.
  // Bewusst NICHT aus `wohnen.moveInDate` vorbelegt: das kann ein Umzug innerhalb der
  // Schweiz sein. Vorher: bei verstrichener Frist zeigte der Ablauf «heute + 90» — ein
  // Zeitfenster, das es nicht mehr gibt (Befund 24.09.2026).
  return React.createElement(AblaufContainer, {
    palette, icon: 'insurance',
    title: t('kkErst.title'),
    intro: t('kkErst.intro'),
  },
    // Schritt 1 — die 3-Monats-Frist (Deckung rückwirkend bei rechtzeitigem Abschluss)
    React.createElement(AblaufStep, { palette, title: t('kkErst.step1Title') },
      React.createElement('p', { style: s.stepText }, t('kkErst.step1Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'kkErst-frist', frist: (d) => plusMonate(d, 3),
        labelKey: 'kkErst.fristLabel', hinweisKey: 'kkErst.fristHinweis', vorbeiKey: 'kkErst.fristVorbei',
        buttonKey: 'kkErst.step1Button', doneKey: 'kkErst.step1Done', calendarKey: 'kkErst.step1CalendarLink',
        reminderTitle: t('kkErst.reminderTitle'), category: 'insurance',
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

    React.createElement(AblaufFooter, { palette, t, quelle: t('kkErst.quelle'), notes: [t('kkErst.footerAufnahme'), t('trust.localOnly')] })
  );
};

export default KKErstAnmeldung;
