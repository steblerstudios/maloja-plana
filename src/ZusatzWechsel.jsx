import React from 'react';
import { text, weight, space, leading } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';
import { AblaufContainer, AblaufStep, AblaufLink, FristButton, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { hinweisZeichen } from './IconSystem.jsx';

// Zusatzversicherung (VVG) kündigen — der 2. geführte Ablauf, gebaut auf der Ablauf-Schale.
// Wichtige VVG-Eigenheiten gegenüber der KVG-Grundversicherung: KEINE Aufnahmepflicht
// (Gesundheitsprüfung) und je nach Police andere Kündigungsfristen.

// Orientierungs-Frist: viele Zusatzversicherungen kündigen ordentlich 3 Monate aufs
// Jahresende → 30. September (dieses Jahr, sonst nächstes). Bewusst Orientierung, kein Verdikt.
const nextSep30 = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Datum, nicht Uhrzeit vergleichen → der 30.09. selbst zählt noch
  const year = now.getFullYear();
  const sep30 = new Date(year, 8, 30);
  const y = now <= sep30 ? year : year + 1;
  return `${y}-09-30`;
};

export const ZusatzWechsel = ({ palette, t, data, onNavigate }) => {
  // Geteilte Schalen-Styles + die „Vor dem Wechsel prüfen"-Liste wie im KVG-Faden (#101).
  const s = {
    ...ablaufStyles(palette),
    reassure: { fontSize: text.sm, color: palette.sageDeep, fontWeight: weight.medium, marginTop: space.sm + 'px' },
    checkList: { margin: space.xs + 'px 0 0', paddingLeft: '1.15em', display: 'flex', flexDirection: 'column', gap: '6px' },
    checkItem: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal },
    source: { fontSize: text.xs, color: palette.soft, lineHeight: leading.normal, marginTop: space.xs + 'px' },
  };
  const currentZusatz = data?.versicherungen?.kkZusatz || '';
  const deadline = nextSep30();
  const deadlineYear = deadline.slice(0, 4);

  return React.createElement(AblaufContainer, {
    palette, icon: 'insurance',
    title: t('zusatzWechsel.title'),
    intro: t('zusatzWechsel.intro'),
  },
    // Schritt 1 — Welche Zusatz hast du? (anzeigen was wir auslesen, sonst Optionen)
    React.createElement(AblaufStep, { palette, title: t('zusatzWechsel.step1Title') },
      React.createElement('p', { style: s.stepText },
        currentZusatz
          ? t('zusatzWechsel.step1Known', { insurer: currentZusatz })
          : t('zusatzWechsel.step1OptionsNote')),
      // Vor dem Wechsel prüfen — VVG statt KVG: Gesundheitsfragen, Anzeigepflicht,
      // Kündigungsrecht nur bei der versicherungsnehmenden Person. Jeder Punkt mit Artikel.
      React.createElement('p', { style: s.reassure }, t('zusatzWechsel.checkIntro')),
      React.createElement('ul', { style: s.checkList },
        React.createElement('li', { style: s.checkItem }, t('zusatzWechsel.checkPoint1')),
        React.createElement('li', { style: s.checkItem }, t('zusatzWechsel.checkPoint2')),
        React.createElement('li', { style: s.checkItem }, t('zusatzWechsel.checkPoint3'))
      ),
      React.createElement('p', { style: s.source }, renderSource(t('zusatzWechsel.checkSource'), null, t))
    ),

    // Schritt 2 — Wichtig: keine Aufnahmepflicht
    React.createElement(AblaufStep, { palette, title: t('zusatzWechsel.step2Title') },
      React.createElement('p', { style: s.stepText }, t('zusatzWechsel.step2Text')),
      React.createElement('div', { style: s.warn }, hinweisZeichen('warning'), t('zusatzWechsel.step2Warn'))
    ),

    // Schritt 3 — Kündigung schreiben
    React.createElement(AblaufStep, { palette, title: t('zusatzWechsel.step3Title') },
      React.createElement('p', { style: s.stepText }, t('zusatzWechsel.step3Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zusatzWechsel.step3Link'), onClick: () => onNavigate('briefe') })
    ),

    // Schritt 4 — Frist sichern
    React.createElement(AblaufStep, { palette, title: t('zusatzWechsel.step4Title') },
      React.createElement('p', { style: s.stepText }, t('zusatzWechsel.step4Text', { year: deadlineYear })),
      React.createElement(FristButton, {
        palette, t,
        buttonLabel: t('zusatzWechsel.step4Button', { date: '30.09.' + deadlineYear }),
        doneLabel: t('zusatzWechsel.step4Done'),
        calendarLabel: t('zusatzWechsel.step4CalendarLink'),
        onNavigate,
        reminder: {
          title: t('zusatzWechsel.reminderTitle'),
          dueDate: deadline,
          category: 'insurance',
          recurrence: 'yearly',
          notes: t('zusatzWechsel.reminderNotes'),
        },
      }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('zusatzWechsel.policeLink'), onClick: () => onNavigate('unterlagen') })
    ),

    React.createElement(AblaufFooter, { palette, notes: [t('zusatzWechsel.footerFrist'), t('trust.localOnly')] })
  );
};

export default ZusatzWechsel;
