import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { inDays } from './utils/helpers.js';

// Führerausweis — ruhiger Orientierungs-Ablauf (keine Rechner, keine Rechtsberatung).
// Belegte Fakten (ch.ch / Bundesamt für Strassen ASTRA, Stand 2026):
//  • Der Schweizer Führerausweis hat KEIN Ablaufdatum. ABER: der alte blaue
//    Papierausweis ist seit 1.11.2024 nicht mehr gültig → Umtausch ins Kreditkartenformat.
//  • Ab dem 75. Geburtstag verkehrsmedizinische Kontrolluntersuchung, danach alle 2 Jahre
//    (Altersgrenze 2019 von 70 auf 75 angehoben).
//  • Neulenkende: Führerausweis auf Probe = 3 Jahre + 1 WAB-Weiterbildungskurs.
//  • Verlust/Diebstahl: Ersatz beim kantonalen Strassenverkehrsamt.
// Auffindbar als Lebensereignis (Dashboard-Nav) UND aus dem Behörden-/Dokumentenbereich.

export const Fuehrerausweis = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  const kontrolle = inDays(730); // ~2 Jahre — Orientierungs-Rhythmus der 75+-Untersuchung (verschiebbar)

  return React.createElement(AblaufContainer, {
    palette, icon: 'behoerden',
    title: t('fuehrerausweis.title'),
    intro: t('fuehrerausweis.intro'),
  },
    // 1 — Ausweis sicher ablegen
    React.createElement(AblaufStep, { palette, title: t('fuehrerausweis.step1Title') },
      React.createElement('p', { style: s.stepText }, t('fuehrerausweis.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('fuehrerausweis.step1Link'), onClick: () => onNavigate('tresor') })
    ),
    // 2 — Umtausch-Check: blauer Papierausweis seit 1.11.2024 ungültig
    React.createElement(AblaufStep, { palette, title: t('fuehrerausweis.step2Title') },
      React.createElement('p', { style: s.stepText }, t('fuehrerausweis.step2Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('fuehrerausweis.step2Link'), onClick: () => onNavigate('behoerdendossier') })
    ),
    // 3 — Ab 75: verkehrsmedizinische Kontrolluntersuchung, alle 2 Jahre → Kalender
    React.createElement(AblaufStep, { palette, title: t('fuehrerausweis.step3Title') },
      React.createElement('p', { style: s.stepText }, t('fuehrerausweis.step3Text')),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('fuehrerausweis.step3Button'),
        doneLabel: t('fuehrerausweis.step3Done'),
        calendarLabel: t('fuehrerausweis.step3CalendarLink'),
        onNavigate,
        reminder: { title: t('fuehrerausweis.reminderTitle'), dueDate: kontrolle, category: 'health', recurrence: 'once' },
      })
    ),
    // 4 — Neulenkende: Führerausweis auf Probe
    React.createElement(AblaufStep, { palette, title: t('fuehrerausweis.step4Title') },
      React.createElement('p', { style: s.stepText }, t('fuehrerausweis.step4Text'))
    ),
    // 5 — Verlust oder Diebstahl
    React.createElement(AblaufStep, { palette, title: t('fuehrerausweis.step5Title') },
      React.createElement('p', { style: s.stepText }, t('fuehrerausweis.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('fuehrerausweis.step5Link'), onClick: () => onNavigate('behoerdendossier') })
    ),
    // Verwandte Ereignisse (Matrix-Ebene)
    onNavigate && React.createElement(AblaufStep, { palette, title: t('fuehrerausweis.relatedTitle') },
      React.createElement(AblaufLink, { palette, label: t('fuehrerausweis.relatedUmzug'), onClick: () => onNavigate('umzug') }),
      React.createElement(AblaufLink, { palette, label: t('fuehrerausweis.relatedPension'), onClick: () => onNavigate('pensionierung') })
    ),
    React.createElement(AblaufFooter, { palette, notes: [t('fuehrerausweis.footerSource'), t('fuehrerausweis.footerNote'), t('trust.localOnly')] })
  );
};

export default Fuehrerausweis;
