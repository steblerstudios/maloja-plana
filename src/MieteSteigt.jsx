import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles, AblaufWarnung } from './AblaufSchale.jsx';
import { plusTage } from './utils/fristen.js';

// Die Miete steigt — geführter Ablauf, gebaut 21.11.2026 auf Wunsch von Stebler Studios
// (Lücke im Kapitel Wohnen: nichts zur laufenden Miete). Gleiche Bauweise wie «Wohnung gekündigt».
// Fassung 2 vom 23.11.2026 nach der Fachprüfung (swiss-precision, 5 blockierende und 11 Sollte-Befunde):
// Nichtigkeit nur OR 269d Abs. 2 lit. a–c, Zahlungsrückstand OR 257d, Staffel/Index (269b, 269c,
// 270c, 270d, VMWG 17), Ausnahmen (OR 253b, VMWG 2), Form und Säumnis im Schlichtungsverfahren
// (ZPO 130, 202, 206, 209–211), Kündigungsschutz 271a vollständig mit Frist OR 273,
// gemeinsames Anfechten bei mehreren Mietenden (BGE 136 III 431).
// Fassung 3 vom 23.11.2026 nach der zweiten Fachprüfung (0 blockierend): OR 271a Abs. 1 Bst. b,
// zu späte Mitteilung belegt mit BGE 107 II 189, Kündigungsfrist ohne Aufschub (BGE 143 III 15),
// Klagebewilligung bei anderen einseitigen Änderungen, dichte Schritte in Absätze geteilt.
// Bewusst nicht übernommen: «Erhöhung rückwirkend geschuldet» — in keiner vorliegenden Quelle belegt.
//
// Wortlaut gelesen aus den amtlichen Fedlex-Dateien: OR Fassung 01.10.2026, VMWG 01.10.2025,
// ZPO 01.07.2026 (DE, FR, IT).
//
// Frist: «Empfang + 30 Tage», gezählt ab dem frühesten Tag (Brief oder Abholungseinladung im
// Briefkasten). Für die Mitteilung einer Erhöhung gilt nach gefestigter Rechtsprechung die relative
// Empfangstheorie (BGE 107 II 189; 137 III 208 E. 3.1.3; 140 III 244 E. 5.1): bei einem Einschreiben
// gilt sie erst beim Abholen oder am letzten Tag der Abholfrist als empfangen. Unsere Zählung endet
// darum gleich früh oder früher als das Gesetz, nie später — und der Text sagt das, auch wenn die
// Frist nach unserer Rechnung vorbei ist. Den Referenzzinssatz nennt die Seite nicht als Zahl
// (er ändert vierteljährlich); sie verlinkt das BWO.

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
      absatz('mieteSteigt.step1Gemeinsam'),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'mieteSteigt-frist', frist: (d) => plusTage(d, 30),
        labelKey: 'mieteSteigt.fristLabel', hinweisKey: 'mieteSteigt.fristHinweis', vorbeiKey: 'mieteSteigt.fristVorbei',
        art: 'frist', buttonKey: 'mieteSteigt.step1Button', doneKey: 'mieteSteigt.step1Done', calendarKey: 'mieteSteigt.step1CalendarLink',
        reminderTitle: t('mieteSteigt.reminderTitle'), category: 'admin',
      })
    ),
    React.createElement(AblaufStep, { palette, title: t('mieteSteigt.step2Title') },
      React.createElement('p', { style: s.stepText }, t('mieteSteigt.step2Text')),
      absatz('mieteSteigt.step2Formular'),
      absatz('mieteSteigt.step2Zeit'),
      React.createElement(AblaufWarnung, { palette }, t('mieteSteigt.step2Zahlen')),
      absatz('mieteSteigt.step2Staffel'),
      absatz('mieteSteigt.step2Index'),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('mieteSteigt.step2Link'), onClick: () => onNavigate('tresor', undefined, 'wohnen') })
    ),
    React.createElement(AblaufStep, { palette, title: t('mieteSteigt.step3Title') },
      React.createElement('p', { style: s.stepText }, t('mieteSteigt.step3Text')),
      absatz('mieteSteigt.step3Hinweis'),
      absatz('mieteSteigt.step3Ausnahmen')
    ),
    React.createElement(AblaufStep, { palette, title: t('mieteSteigt.step4Title') },
      React.createElement('p', { style: s.stepText }, t('mieteSteigt.step4Text')),
      absatz('mieteSteigt.step4Verfahren'),
      absatz('mieteSteigt.step4Schutz'),
      absatz('mieteSteigt.step4SchutzFrist'),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('nav.wohnunggekuendigt'), onClick: () => onNavigate('wohnunggekuendigt') })
    ),
    React.createElement(AblaufStep, { palette, title: t('mieteSteigt.step5Title') },
      React.createElement('p', { style: s.stepText }, t('mieteSteigt.step5Text'))
    ),
    React.createElement(AblaufStep, { palette, title: t('mieteSteigt.step6Title') },
      React.createElement('p', { style: s.stepText }, t('mieteSteigt.step6Text')),
      React.createElement(AblaufWarnung, { palette }, t('mieteSteigt.step6Zahlen'))
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
