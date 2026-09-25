import React, { useState } from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { formatDE } from './utils/helpers.js';
import { plusTage, istVorbei } from './utils/fristen.js';
import { text, space, radius } from './config/tokens.js';

// Stelle verloren — der 6. geführte Ablauf auf der Schale. Gegenstück zu „Neuer Job".
// Ruhige Orientierung mit der kritischsten Reihenfolge zuerst: RAV-Anmeldung (Taggeld
// gibt es erst ab Anmeldung, nicht rückwirkend), dann die unsichtbare Versicherungs-
// lücke, Pensionskassen-Freizügigkeit, Unterlagen. Kein Rat — Orientierung.

// RAV-Anmeldung: AVIG Art. 17 Abs. 2 — «spätestens am ersten Tag, für den sie
// Arbeitslosenentschädigung beansprucht». Ein Datum ist nur redlich mit einem
// Ausgangspunkt: das Ende des Arbeitsverhältnisses laut Kündigung (nicht der letzte
// Arbeitstag — bei Freistellung oder Ferien läuft der Lohn weiter, AVIG Art. 11 III).
// Ohne Eingabe zeigen wir KEIN Datum — «heute + n» wäre für jemanden, der den Ablauf
// erst nach dem Austritt öffnet, eine Frist, die schon vorbei ist (Befund 24.09.2026).
export const ravSpaetestens = (ende) => plusTage(ende, 1);

export const StelleVerloren = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  const [ende, setEnde] = useState('');
  const rav = ravSpaetestens(ende);
  const ravVorbei = istVorbei(rav);
  // Unfalldeckung: endet mit dem 31. Tag nach dem Ende des Lohnanspruchs (UVG Art. 3 II)
  // — gerechnet ab demselben Vertragsende wie die RAV-Frist, nicht mehr ab heute.
  const coverEnd = plusTage(ende, 31);
  const coverVorbei = istVorbei(coverEnd);

  return React.createElement(AblaufContainer, {
    palette, icon: 'lebenslauf',
    title: t('stelleVerloren.title'),
    intro: t('stelleVerloren.intro'),
  },
    // Schritt 1 — RAV-Anmeldung (die wichtigste Frist)
    React.createElement(AblaufStep, { palette, title: t('stelleVerloren.step1Title') },
      React.createElement('p', { style: s.stepText }, t('stelleVerloren.step1Text')),
      React.createElement('label', { htmlFor: 'rav-ende', style: { fontSize: text.sm, color: palette.mid, display: 'block', margin: space.sm + 'px 0 ' + space.xs + 'px' } }, t('stelleVerloren.step1DateLabel')),
      React.createElement('input', {
        id: 'rav-ende', type: 'date', value: ende, onChange: (e) => setEnde(e.target.value),
        style: { padding: '10px 12px', borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.up, color: palette.text, fontSize: text.sm, fontFamily: 'inherit' },
      }),
      rav && React.createElement('p', { style: { ...s.stepText, marginTop: space.sm + 'px' } }, t(ravVorbei ? 'stelleVerloren.step1DateVorbei' : 'stelleVerloren.step1DateHint', { date: formatDE(rav) })),
      rav && !ravVorbei && React.createElement(FristButton, {
        // key: ein neues Datum ist ein neuer Termin — der Knopf beginnt wieder unbestätigt.
        key: rav, palette, t,
        buttonLabel: t('stelleVerloren.step1Button', { date: formatDE(rav) }),
        doneLabel: t('stelleVerloren.step2Done'),
        calendarLabel: t('stelleVerloren.step2CalendarLink'),
        onNavigate,
        reminder: { title: t('stelleVerloren.reminderRavTitle'), dueDate: rav, category: 'insurance', recurrence: 'once' },
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('stelleVerloren.step1Link'), onClick: () => onNavigate('alv') })
    ),

    // Schritt 2 — Versicherungslücke (Unfalldeckung endet 31 Tage nach Austritt)
    React.createElement(AblaufStep, { palette, title: t('stelleVerloren.step2Title') },
      React.createElement('p', { style: s.stepText }, t('stelleVerloren.step2Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: space.sm + 'px' } },
        !coverEnd ? t('stelleVerloren.step2Ohne')
          : t(coverVorbei ? 'stelleVerloren.step2Vorbei' : 'stelleVerloren.step2Hinweis', { date: formatDE(coverEnd) })),
      coverEnd && !coverVorbei && React.createElement(FristButton, {
        key: coverEnd, palette, t,
        buttonLabel: t('stelleVerloren.step2Button', { date: formatDE(coverEnd) }),
        doneLabel: t('stelleVerloren.step2Done'),
        calendarLabel: t('stelleVerloren.step2CalendarLink'),
        onNavigate,
        reminder: {
          title: t('stelleVerloren.reminderTitle'),
          dueDate: coverEnd,
          category: 'insurance',
          recurrence: 'once',
        },
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('stelleVerloren.step2LinkUk'), onClick: () => onNavigate('unfallkrankheit') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('stelleVerloren.step2LinkKk'), onClick: () => onNavigate('kk') })
    ),

    // Schritt 3 — Pensionskasse (Freizügigkeit)
    React.createElement(AblaufStep, { palette, title: t('stelleVerloren.step3Title') },
      React.createElement('p', { style: s.stepText }, t('stelleVerloren.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('stelleVerloren.step3Link'), onClick: () => onNavigate('vorsorge') })
    ),

    // Schritt 4 — Arbeitszeugnis & Unterlagen
    React.createElement(AblaufStep, { palette, title: t('stelleVerloren.step4Title') },
      React.createElement('p', { style: s.stepText }, t('stelleVerloren.step4Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('stelleVerloren.step4Link'), onClick: () => onNavigate('tresor', undefined, 'finanzen') })
    ),

    React.createElement(AblaufFooter, { palette, t, quelle: t('stelleVerloren.quelle'), notes: [t('stelleVerloren.footerSperrzeit'), t('trust.localOnly')] })
  );
};

export default StelleVerloren;
