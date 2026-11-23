import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles, AblaufWarnung } from './AblaufSchale.jsx';
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
  const absatz = (key) => React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t(key));
  return React.createElement(AblaufContainer, {
    palette, t, onNavigate, ablauf: 'wohnunggekuendigt', icon: 'ereignisWohnunggekuendigt',
    title: t('wohnungGekuendigt.title'),
    intro: t('wohnungGekuendigt.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('wohnungGekuendigt.step1Title') },
      React.createElement('p', { style: s.stepText }, t('wohnungGekuendigt.step1Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'wohnungGekuendigt-frist', frist: (d) => plusTage(d, 30),
        labelKey: 'wohnungGekuendigt.fristLabel', hinweisKey: 'wohnungGekuendigt.fristHinweis', vorbeiKey: 'wohnungGekuendigt.fristVorbei',
        art: 'frist', buttonKey: 'wohnungGekuendigt.step1Button', doneKey: 'wohnungGekuendigt.step1Done', calendarKey: 'wohnungGekuendigt.step1CalendarLink',
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
      React.createElement(AblaufWarnung, { palette }, t('wohnungGekuendigt.step3Warn'))
    ),
    // Schritt 4 nach Fachprüfung 23.11.2026: Form des Gesuchs und der Weg NACH der Schlichtung fehlten —
    // ohne Klage innert 30 Tagen (ZPO 209 Abs. 1 Bst. b, Abs. 4) bleibt die Kündigung in der Regel bestehen.
    // Die Sätze, die auch für «Die Miete steigt» gelten, stehen einmal unter schlichtungMiete.
    React.createElement(AblaufStep, { palette, title: t('wohnungGekuendigt.step4Title') },
      React.createElement('p', { style: s.stepText }, t('wohnungGekuendigt.step4Text')),
      absatz('schlichtungMiete.form'),
      absatz('schlichtungMiete.kosten'),
      absatz('wohnungGekuendigt.step4Anwalt'),
      absatz('schlichtungMiete.saeumnis'),
      // Entscheidvorschlag VOR dem Warnkasten (Schlussprüfung 23.11.2026): sonst stünde zuerst die absolute
      // Regel «Sie erhalten die Klagebewilligung», obwohl sie beim Vorschlag an die ablehnende Partei geht (ZPO 211 Abs. 2 Bst. a).
      absatz('schlichtungMiete.vorschlag'),
      React.createElement(AblaufWarnung, { palette }, t('wohnungGekuendigt.step4Danach')),
      absatz('wohnungGekuendigt.step4Gericht')
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
