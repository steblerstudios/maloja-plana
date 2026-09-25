import React, { useState } from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { plusTage, plusMonate } from './utils/fristen.js';

// Neu in der Schweiz (Zuzug aus dem Ausland) — geführter Ablauf, gebaut 24.09.2026 auf
// Wunsch von Stebler Studios. Vorher verwies der Lebenszustand «Neu in der Schweiz» auf «Bewilligung
// verlängern» — wer neu ankommt, verlängert nichts. Abgrenzung: Frist und Kassenwahl
// stehen in `kkerst`, Quellensteuer in `quellensteuer`, Verlängerung in `bewilligung`;
// hier nur der erste Schritt und der Link (eine Wahrheit an einem Ort).
//
// EIN Ereignis, zwei Fristen: der Einreisetag speist die Anmeldung bei der Gemeinde
// (14 Tage, VZAE Art. 10 / RHG Art. 11; mit Stelle schon vorher, AIG Art. 12) und den
// Umtausch des Führerausweises (12 Monate − 1 Tag, VZV Art. 42 Abs. 3bis — das Gesetz
// zählt ab Wohnsitz, die Einreise liegt nie später: nie später als das Gesetz).

export const ZuzugAusland = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  const [einreise, setEinreise] = useState('');
  return React.createElement(AblaufContainer, {
    palette, icon: 'behoerden',
    title: t('zuzug.title'),
    intro: t('zuzug.intro'),
  },
    React.createElement(AblaufStep, { palette, title: t('zuzug.step1Title') },
      React.createElement('p', { style: s.stepText }, t('zuzug.step1Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'zuzug-einreise', frist: (d) => plusTage(d, 14), wert: einreise, onWert: setEinreise,
        labelKey: 'zuzug.fristLabel', hinweisKey: 'zuzug.fristHinweis', vorbeiKey: 'zuzug.fristVorbei',
        buttonKey: 'zuzug.step1Button', doneKey: 'zuzug.step1Done', calendarKey: 'zuzug.step1CalendarLink',
        reminderTitle: t('zuzug.reminderTitle'), category: 'admin',
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zuzug.step1LinkBewilligung'), onClick: () => onNavigate('bewilligung') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zuzug.step1LinkTresor'), onClick: () => onNavigate('tresor') })
    ),
    React.createElement(AblaufStep, { palette, title: t('zuzug.step2Title') },
      React.createElement('p', { style: s.stepText }, t('zuzug.step2Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zuzug.step2LinkKkErst'), onClick: () => onNavigate('kkerst') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zuzug.step2LinkIpv'), onClick: () => onNavigate('premium') })
    ),
    React.createElement(AblaufStep, { palette, title: t('zuzug.step3Title') },
      React.createElement('p', { style: s.stepText }, t('zuzug.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zuzug.step3LinkJob'), onClick: () => onNavigate('neuerjob') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zuzug.step3LinkQst'), onClick: () => onNavigate('quellensteuer') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zuzug.step3LinkVorsorge'), onClick: () => onNavigate('vorsorge') })
    ),
    React.createElement(AblaufStep, { palette, title: t('zuzug.step4Title') },
      React.createElement('p', { style: s.stepText }, t('zuzug.step4Text')),
      React.createElement(EreignisFrist, {
        palette, t, onNavigate, id: 'zuzug-fuehrerausweis', ohneFeld: true, wert: einreise, onWert: setEinreise,
        frist: (d) => plusTage(plusMonate(d, 12), -1),
        labelKey: 'zuzug.fristLabel', hinweisKey: 'zuzug.fristHinweisFa', vorbeiKey: 'zuzug.fristVorbeiFa',
        buttonKey: 'zuzug.step4Button', doneKey: 'zuzug.step4Done', calendarKey: 'zuzug.step1CalendarLink',
        reminderTitle: t('zuzug.reminderTitleFa'), category: 'admin',
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zuzug.step4Link'), onClick: () => onNavigate('fuehrerausweis') })
    ),
    React.createElement(AblaufStep, { palette, title: t('zuzug.step5Title') },
      React.createElement('p', { style: s.stepText }, t('zuzug.step5Text'))
    ),
    onNavigate && React.createElement(AblaufStep, { palette, title: t('zuzug.relatedTitle') },
      React.createElement(AblaufLink, { palette, label: t('zuzug.relatedUmzug'), onClick: () => onNavigate('umzug') }),
      React.createElement(AblaufLink, { palette, label: t('zuzug.relatedEinbuergerung'), onClick: () => onNavigate('einbuergerung') })
    ),
    React.createElement(AblaufFooter, { palette, t, quelle: t('zuzug.quelle'), notes: [t('zuzug.footerNote'), t('trust.localOnly')] })
  );
};

export default ZuzugAusland;
