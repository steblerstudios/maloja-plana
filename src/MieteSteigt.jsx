import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusTage } from './utils/fristen.js';

// Die Miete steigt — geführter Ablauf, gebaut 21.11.2026 auf Wunsch von Stebler Studios
// (Lücke im Kapitel Wohnen: nur vier Seiten, nichts zur laufenden Miete). Gleiche Bauweise
// wie «Wohnung gekündigt»: die 30-Tage-Frist zuerst (OR Art. 270b), dann Gültigkeit der
// Mitteilung (269d, VMWG 19), Begründung (269, 269a, VMWG 13, 16), Schlichtungsbehörde
// (ZPO 113, 201, 202; OR 270e, 271a), Senkung verlangen (270a), Nebenkosten (257a, 257b, VMWG 4).
//
// Wortlaut gelesen am 21.11.2026 aus den amtlichen Fedlex-Dateien (per SPARQL ermittelt):
// OR Fassung 01.10.2026, VMWG Fassung 01.10.2025, ZPO Fassung 01.07.2026.
//
// Frist: «Empfang + 30 Tage», gezählt ab dem frühesten Tag (Brief oder Abholungseinladung im
// Briefkasten). Ob für die Erhöhung die absolute oder die relative Empfangstheorie gilt, behauptet
// die Seite bewusst nicht — sie zählt ab dem früheren Tag, also nie später als das Gesetz.
// Den Referenzzinssatz nennt die Seite nicht als Zahl (er ändert vierteljährlich); sie verlinkt das BWO.

export const MieteSteigt = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  const absatz = (key) => React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t(key));
  return React.createElement(AblaufContainer, {
    palette, t, onNavigate, ablauf: 'mietesteigt', icon: 'ereignisMietesteigt',
    title: t('mieteSteigt.title'),
    intro: t('mieteSteigt.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('mieteSteigt.step1Title') },
      React.createElement('p', { style: s.stepText }, t('mieteSteigt.step1Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'mieteSteigt-frist', frist: (d) => plusTage(d, 30),
        labelKey: 'mieteSteigt.fristLabel', hinweisKey: 'mieteSteigt.fristHinweis', vorbeiKey: 'mieteSteigt.fristVorbei',
        art: 'frist', buttonKey: 'mieteSteigt.step1Button', doneKey: 'mieteSteigt.step1Done', calendarKey: 'mieteSteigt.step1CalendarLink',
        reminderTitle: t('mieteSteigt.reminderTitle'), category: 'admin',
      })
    ),
    React.createElement(AblaufStep, { palette, title: t('mieteSteigt.step2Title') },
      React.createElement('p', { style: s.stepText }, t('mieteSteigt.step2Text')),
      absatz('mieteSteigt.step2Staffel'),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('mieteSteigt.step2Link'), onClick: () => onNavigate('tresor', undefined, 'wohnen') })
    ),
    React.createElement(AblaufStep, { palette, title: t('mieteSteigt.step3Title') },
      React.createElement('p', { style: s.stepText }, t('mieteSteigt.step3Text')),
      absatz('mieteSteigt.step3Hinweis')
    ),
    React.createElement(AblaufStep, { palette, title: t('mieteSteigt.step4Title') },
      React.createElement('p', { style: s.stepText }, t('mieteSteigt.step4Text')),
      absatz('mieteSteigt.step4Schutz')
    ),
    React.createElement(AblaufStep, { palette, title: t('mieteSteigt.step5Title') },
      React.createElement('p', { style: s.stepText }, t('mieteSteigt.step5Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('mieteSteigt.step6Title') },
      React.createElement('p', { style: s.stepText }, t('mieteSteigt.step6Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('mieteSteigt.step7Title') },
      React.createElement('p', { style: s.stepText }, t('mieteSteigt.step7Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('mieteSteigt.step7LinkMietzins'), onClick: () => onNavigate('mietzins') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('mieteSteigt.step7LinkSozialhilfe'), onClick: () => onNavigate('sozialhilfe') }),
      absatz('mieteSteigt.abgrenzung')
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('mieteSteigt.quelle'), notes: [t('mieteSteigt.footerNote'), t('trust.localOnly')] })
  );
};

export default MieteSteigt;
