import React from 'react';
import { PanelTitle } from './Heading.jsx';
import { hinweisZeichen } from '../IconSystem.jsx';
import { text, weight, leading, space, radius, shadow, ease, duration } from '../config/tokens.js';
import { feldErledigt } from '../utils/vollstaendigkeit.js';
import { CHAPTER_KEYS } from '../config/constants.js';

// Der frühere Notfall-Einstieg (NotfallEinstieg.jsx), seit 24.10.2026 im Kapitel Notfall
// (docs/entscheide/seiten-buendeln.md, Gruppe D, Entscheid 4). Zwei Teile:
//   oben  — gleich nach dem Kapitelkopf: Vorlesekarte (der eine Knopf für den Ernstfall) und
//           Notfallpass. Die Vorlesekarte bleibt eigene Seite, mit einem Griff erreichbar.
//   unten — nach dem Formular: «Was brauchen Sie im Notfall?», drei Lagen mit ihren Angaben.
// Texte unverändert aus dem Einstieg (notfallEinstieg.*, notfallpass.einstieg*).
// #/notfalleinstieg leitet hierher (UMLEITUNGEN), Sprungmarke NOTFALL_ANKER.

export const NOTFALL_ANKER = 'mp-notfall-ernstfall';

export const SCENARIOS = [
  {
    key: 'unfall',
    fields: [
      { chapter: 'notfall', k: 'emergencyContact' },
      { chapter: 'notfall', k: 'emergencyPhone' },
      { chapter: 'notfall', k: 'bloodType' },
      { chapter: 'notfall', k: 'allergies' },
      { chapter: 'notfall', k: 'medications' },
      { chapter: 'notfall', k: 'doctor' },
      { chapter: 'notfall', k: 'doctorPhone' },
      { chapter: 'versicherungen', k: 'kkInsurer' },
      { chapter: 'versicherungen', k: 'kkCardNumber' },
    ],
  },
  {
    key: 'spital',
    fields: [
      { chapter: 'basis', k: 'firstName' },
      { chapter: 'basis', k: 'lastName' },
      { chapter: 'basis', k: 'dateOfBirth' },
      { chapter: 'basis', k: 'ahv' },
      { chapter: 'versicherungen', k: 'kkInsurer' },
      { chapter: 'versicherungen', k: 'kkCardNumber' },
      { chapter: 'versicherungen', k: 'franchise' },
      { chapter: 'notfall', k: 'emergencyContact' },
      { chapter: 'notfall', k: 'emergencyPhone' },
      { chapter: 'notfall', k: 'patientenverfuegung' },
    ],
  },
  {
    key: 'behoerde',
    fields: [
      { chapter: 'basis', k: 'firstName' },
      { chapter: 'basis', k: 'lastName' },
      { chapter: 'basis', k: 'dateOfBirth' },
      { chapter: 'basis', k: 'canton' },
      { chapter: 'wohnen', k: 'address' },
      { chapter: 'wohnen', k: 'postalCode' },
      { chapter: 'wohnen', k: 'city' },
      { chapter: 'basis', k: 'ahv' },
      { chapter: 'behoerden', k: 'cantoneOfTaxation' },
    ],
  },
];

// Oben: die zwei Wege hinaus — Ernstfall (laut) und Vorbereitung (leise).
const Ernstfall = ({ palette, t, onNavigate }) =>
  React.createElement('div', { id: NOTFALL_ANKER, 'data-teil': 'notfall-ernstfall', style: { marginBottom: space.lg + 'px', scrollMarginTop: 'var(--mp-sprungabstand)' } },
    React.createElement('button', {
      type: 'button',
      onClick: () => onNavigate('notfallkarte'),
      style: {
        display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
        marginBottom: space.sm + 'px',
        padding: space.lg + 'px ' + space.md + 'px',
        background: (palette.sageDeep || palette.sage) + '14',
        border: '1px solid ' + (palette.sageDeep || palette.sage) + '55',
        borderRadius: radius.md, fontFamily: 'inherit',
      },
    },
      React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, marginBottom: '4px' } },
        hinweisZeichen('phone'), t('notfallEinstieg.vorlesekarteTitle')),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed } }, t('notfallEinstieg.vorlesekarteSub'))
    ),
    // Vorbereitung, nicht Ernstfall: darum leiser als die Vorlesekarte darüber.
    React.createElement('button', {
      type: 'button',
      onClick: () => onNavigate('notfallpass'),
      style: {
        display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
        padding: space.md + 'px',
        background: palette.surface,
        border: '1px solid ' + palette.border,
        borderRadius: radius.md, fontFamily: 'inherit',
      },
    },
      React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, marginBottom: '4px' } },
        hinweisZeichen('lock'), t('notfallpass.einstiegTitel')),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed } }, t('notfallpass.einstiegSub'))
    )
  );

// Unten: drei Lagen. Fehlende Angaben aus dem Kapitel Notfall stehen im Formular darüber;
// nur die aus anderen Kapiteln führen weg.
const Lagen = ({ palette, t, data, chapters, onNavigate }) => {
  const getFieldLabel = (chapterKey, fieldKey) => {
    const chapter = chapters.find((ch) => ch.key === chapterKey);
    if (!chapter) return fieldKey;
    const field = chapter.fields.find((f) => f.k === fieldKey);
    return field ? field.label : fieldKey;
  };
  // K38: «trifft nicht zu» (z. B. keine Kontaktperson) zählt als erledigt, wie in den Kapiteln.
  const hasValue = (chapterKey, fieldKey) => feldErledigt(data[chapterKey], fieldKey);
  const anderesKapitel = (chapterKey) => chapterKey !== 'notfall' && CHAPTER_KEYS.includes(chapterKey);
  const goToChapter = (chapterKey) => {
    if (anderesKapitel(chapterKey)) onNavigate('chapter', CHAPTER_KEYS.indexOf(chapterKey));
  };

  return React.createElement('section', { 'data-teil': 'notfall-lagen', 'aria-labelledby': 'mp-notfall-lagen-titel', style: { marginTop: space.xl + 'px' } },
    React.createElement(PanelTitle, { palette, id: 'mp-notfall-lagen-titel', style: { margin: '0 0 4px 0' } }, t('notfallEinstieg.title')),
    React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', lineHeight: leading.relaxed } }, t('notfallEinstieg.subtitle')),

    SCENARIOS.map((scenario) => {
      const filled = scenario.fields.filter((f) => hasValue(f.chapter, f.k)).length;
      const total = scenario.fields.length;
      const pct = Math.round((filled / total) * 100);
      const allDone = filled === total;
      const chaptersNeeded = [...new Set(scenario.fields.filter((f) => !hasValue(f.chapter, f.k) && anderesKapitel(f.chapter)).map((f) => f.chapter))];

      return React.createElement('div', {
        key: scenario.key,
        style: {
          marginBottom: space.lg + 'px',
          padding: space.lg + 'px ' + space.md + 'px',
          background: allDone ? palette.sage + '12' : palette.surface,
          borderRadius: radius.md,
          border: '1px solid ' + (allDone ? palette.sage + '40' : palette.border + '88'),
          boxShadow: shadow.sm,
        },
      },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: space.sm } },
          // h4: eine Stufe unter dem Abschnittstitel (im Einstieg waren beide h3 unter dem Seitentitel).
          React.createElement('h4', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, margin: 0 } }, t('notfallEinstieg.' + scenario.key + '.title')),
          React.createElement('span', { style: { fontSize: text.sm, color: allDone ? (palette.sageDeep || palette.sage) : palette.mid, fontWeight: weight.medium } }, filled + '/' + total)
        ),
        React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, margin: '0 0 ' + space.md + 'px 0' } },
          t('notfallEinstieg.' + scenario.key + '.description')),
        React.createElement('div', { style: { width: '100%', height: '3px', background: palette.up, borderRadius: radius.hair, overflow: 'hidden', marginBottom: space.md + 'px' } },
          React.createElement('div', { style: { width: pct + '%', height: '100%', background: allDone ? palette.sage : palette.sand, borderRadius: radius.hair, transition: `width ${duration.slow}ms ${ease}` } })
        ),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
          scenario.fields.map((f) => {
            const done = hasValue(f.chapter, f.k);
            const weg = !done && anderesKapitel(f.chapter);
            return React.createElement('div', {
              key: f.chapter + '.' + f.k,
              onClick: weg ? () => goToChapter(f.chapter) : undefined,
              role: weg ? 'button' : undefined,
              tabIndex: weg ? 0 : undefined,
              onKeyDown: weg ? (e) => { if (e.key === 'Enter') goToChapter(f.chapter); } : undefined,
              style: {
                display: 'flex', alignItems: 'center', gap: space.sm + 'px',
                fontSize: text.sm,
                color: done ? (palette.sageDeep || palette.sage) : palette.text,
                cursor: weg ? 'pointer' : 'default',
                padding: '4px 0',
                // Erledigt erkennbar über die FORM (Haken statt Kästchen), nicht über Deckkraft:
                // 0.7 drückte den Kontrast unter 4.5 (Befund aus dem Einstieg).
              },
            },
              React.createElement('span', { style: { fontSize: text.xs, flexShrink: 0, width: '16px', textAlign: 'center' } }, hinweisZeichen(done ? 'check' : 'kaestchen', 12)),
              getFieldLabel(f.chapter, f.k)
            );
          })
        ),
        !allDone && chaptersNeeded.length > 0 && React.createElement('div', { style: { marginTop: space.md + 'px', paddingTop: space.sm + 'px', borderTop: '1px solid ' + palette.border } },
          React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm } },
            chaptersNeeded.map((chKey) => {
              const ch = chapters.find((c) => c.key === chKey);
              return React.createElement('button', {
                key: chKey,
                type: 'button',
                onClick: () => goToChapter(chKey),
                style: {
                  background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm,
                  cursor: 'pointer', padding: '6px 12px', minHeight: '44px',
                  fontSize: text.sm, color: palette.text, fontFamily: 'inherit',
                },
              }, (ch ? ch.title : chKey));
            })
          )
        ),
        allDone && React.createElement('div', { style: { marginTop: space.md + 'px', fontSize: text.sm, color: palette.sageDeep, fontStyle: 'italic' } }, t('notfallEinstieg.allDone'))
      );
    })
  );
};

export const NotfallImKapitel = ({ teil, palette, t, data, chapters, onNavigate }) => {
  if (!onNavigate) return null;
  return teil === 'oben'
    ? React.createElement(Ernstfall, { palette, t, onNavigate })
    : React.createElement(Lagen, { palette, t, data: data || {}, chapters: chapters || [], onNavigate });
};

export default NotfallImKapitel;
