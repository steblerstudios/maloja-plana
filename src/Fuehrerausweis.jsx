import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusMonate } from './utils/fristen.js';

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
  // A2 (Kapitel 6, 10.11.2026): die Erinnerung rechnet ab der letzten Untersuchung (oder dem 75. Geburtstag),
  // nicht mehr 730 Tage ab dem Klick (VZV Art. 27 Abs. 1 Bst. b: ab 75 alle zwei Jahre).

  return React.createElement(AblaufContainer, {
    palette, t, onNavigate, ablauf: 'fuehrerausweis', icon: 'ereignisFuehrerausweis',
    title: t('fuehrerausweis.title'),
    intro: t('fuehrerausweis.intro'),
  },
    // 1 — Verlust oder Diebstahl (Fassung 9, F9-D5: zuerst, wer danach sucht, braucht es sofort)
    React.createElement(AblaufStep, { palette, title: t('fuehrerausweis.step5Title') },
      React.createElement('p', { style: s.stepText }, t('fuehrerausweis.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('fuehrerausweis.step5Link'), onClick: () => onNavigate('behoerdendossier') })
    ),
    // 2 — Ausweis sicher ablegen
    React.createElement(AblaufStep, { palette, title: t('fuehrerausweis.step1Title') },
      React.createElement('p', { style: s.stepText }, t('fuehrerausweis.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('fuehrerausweis.step1Link'), onClick: () => onNavigate('tresor') })
    ),
    // 3 — Umtausch-Check: blauer Papierausweis seit 1.11.2024 ungültig
    React.createElement(AblaufStep, { palette, title: t('fuehrerausweis.step2Title') },
      React.createElement('p', { style: s.stepText }, t('fuehrerausweis.step2Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('fuehrerausweis.step2Link'), onClick: () => onNavigate('behoerdendossier') })
    ),
    // 4 — Ab 75: verkehrsmedizinische Kontrolluntersuchung, alle 2 Jahre → Kalender
    React.createElement(AblaufStep, { palette, title: t('fuehrerausweis.step3Title') },
      React.createElement('p', { style: s.stepText }, t('fuehrerausweis.step3Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'fuehrerausweis-kontrolle', frist: (d) => plusMonate(d, 24),
        labelKey: 'fuehrerausweis.kontrolleLabel', hinweisKey: 'fuehrerausweis.kontrolleHinweis', vorbeiKey: 'fuehrerausweis.kontrolleVorbei',
        art: 'erinnerung', buttonKey: 'fuehrerausweis.step3Button', doneKey: 'fuehrerausweis.step3Done', calendarKey: 'fuehrerausweis.step3CalendarLink',
        reminderTitle: t('fuehrerausweis.reminderTitle'), category: 'health',
      })
    ),
    // 5 — Neulenkende: Führerausweis auf Probe
    React.createElement(AblaufStep, { palette, title: t('fuehrerausweis.step4Title') },
      React.createElement('p', { style: s.stepText }, t('fuehrerausweis.step4Text'))
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('fuehrerausweis.quelle'), notes: [t('fuehrerausweis.footerNote'), t('trust.localOnly')] })
  );
};

export default Fuehrerausweis;
