import React from 'react';
import { text, weight, space, leading } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';
import { AblaufLink, FristButton, ablaufStyles } from './AblaufSchale.jsx';
import { hinweisZeichen } from './IconSystem.jsx';

// Zusatzversicherung (VVG) kündigen — gebaut als 2. geführter Ablauf auf der Ablauf-Schale.
// Seit F7-A5 (Entscheid Stebler Studios 27.10.2026) EIN Ablauf mit «Krankenkasse wechseln»
// (KVGWechsel.jsx): der Weg «Zusatzversicherung» nach der Weiche in Schritt 1. Diese Datei liefert
// dessen vier Schritte — Inhalt, Quellen und Frist unverändert. `#/zusatzwechsel` bleibt als Adresse
// (utils/hashRouter.js UMLEITUNGEN → kvgwechsel, Weiche auf «Zusatz»).
// Wichtige VVG-Eigenheiten gegenüber der KVG-Grundversicherung: KEINE Aufnahmepflicht
// (Gesundheitsprüfung) und je nach Police andere Kündigungsfristen.

// Orientierungs-Frist: viele Zusatzversicherungen kündigen ordentlich 3 Monate aufs
// Jahresende → 30. September (dieses Jahr, sonst nächstes). Bewusst Orientierung, kein Verdikt.
export const nextSep30 = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Datum, nicht Uhrzeit vergleichen → der 30.09. selbst zählt noch
  const year = now.getFullYear();
  const sep30 = new Date(year, 8, 30);
  const y = now <= sep30 ? year : year + 1;
  return `${y}-09-30`;
};

// Die vier Schritte des Wegs «Zusatzversicherung»: [{ titel, inhalt: [Elemente] }].
export const zusatzSchritte = ({ palette, t, data, onNavigate }) => {
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

  return [
    // Schritt 1 — Welche Zusatz hast du? (anzeigen was wir auslesen, sonst Optionen)
    { titel: t('zusatzWechsel.step1Title'), inhalt: [
      React.createElement('p', { key: 'a', style: s.stepText },
        currentZusatz
          ? t('zusatzWechsel.step1Known', { insurer: currentZusatz })
          : t('zusatzWechsel.step1OptionsNote')),
      // Vor dem Wechsel prüfen — VVG statt KVG: Gesundheitsfragen, Anzeigepflicht,
      // Kündigungsrecht nur bei der versicherungsnehmenden Person. Jeder Punkt mit Artikel.
      React.createElement('p', { key: 'b', style: s.reassure }, t('zusatzWechsel.checkIntro')),
      React.createElement('ul', { key: 'c', style: s.checkList },
        React.createElement('li', { style: s.checkItem }, t('zusatzWechsel.checkPoint1')),
        React.createElement('li', { style: s.checkItem }, t('zusatzWechsel.checkPoint2')),
        React.createElement('li', { style: s.checkItem }, t('zusatzWechsel.checkPoint3'))
      ),
      React.createElement('p', { key: 'd', style: s.source }, renderSource(t('zusatzWechsel.checkSource'), null, t)),
    ] },

    // Schritt 2 — Wichtig: keine Aufnahmepflicht
    { titel: t('zusatzWechsel.step2Title'), inhalt: [
      React.createElement('p', { key: 'a', style: s.stepText }, t('zusatzWechsel.step2Text')),
      React.createElement('div', { key: 'b', style: s.warn }, hinweisZeichen('warning'), t('zusatzWechsel.step2Warn')),
    ] },

    // Schritt 3 — Kündigung schreiben
    { titel: t('zusatzWechsel.step3Title'), inhalt: [
      React.createElement('p', { key: 'a', style: s.stepText }, t('zusatzWechsel.step3Text')),
      onNavigate && React.createElement(AblaufLink, { key: 'b', palette, label: t('zusatzWechsel.step3Link'), onClick: () => onNavigate('briefe') }),
    ] },

    // Schritt 4 — Frist sichern
    { titel: t('zusatzWechsel.step4Title'), inhalt: [
      React.createElement('p', { key: 'a', style: s.stepText }, t('zusatzWechsel.step4Text', { year: deadlineYear })),
      React.createElement(FristButton, {
        key: 'b', palette, t,
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
      // Ablegen geht oben in der Ablage — `unterlagen` springt zu «Meine Unterlagen» ganz unten.
      onNavigate && React.createElement(AblaufLink, { key: 'c', palette, label: t('zusatzWechsel.policeLink'), onClick: () => onNavigate('tresor') }),
    ] },
  ];
};

// Zusatzversicherung ist VVG-Geschäft — derselbe Orientierungs-Hinweis wie
// im KVG-Wechselpfad und in den übrigen Ablauf-Ansichten.
export const zusatzFussNotizen = (t) => [t('zusatzWechsel.footerFrist'), t('alpha.noAdviceHint'), t('trust.localOnly')];
