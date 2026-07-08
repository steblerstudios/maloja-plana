import React from 'react';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { Icon } from './IconSystem.jsx';
import { text, weight, leading, space, radius, shadow, ease, duration } from './config/tokens.js';

const SCENARIOS = [
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

const CHAPTER_INDICES = { basis: 0, wohnen: 1, finanzen: 2, versicherungen: 3, ausbildung: 4, behoerden: 5, notfall: 6 };

export const NotfallEinstieg = ({ palette, t, data, chapters, onNavigate }) => {

  const getFieldLabel = (chapterKey, fieldKey) => {
    const chapter = chapters.find(ch => ch.key === chapterKey);
    if (!chapter) return fieldKey;
    const field = chapter.fields.find(f => f.k === fieldKey);
    return field ? field.label : fieldKey;
  };

  const hasValue = (chapterKey, fieldKey) => {
    const val = data[chapterKey]?.[fieldKey];
    return Boolean(val);
  };

  const goToChapter = (chapterKey) => {
    const idx = CHAPTER_INDICES[chapterKey];
    if (idx !== undefined) onNavigate('chapter', idx);
  };

  return React.createElement('div', { style: { maxWidth: '720px', margin: '0 auto' } },

    React.createElement('div', {
      style: { textAlign: 'center', marginBottom: space.xl + 'px', paddingTop: space.md + 'px' }
    },
      React.createElement('div', {
        style: { marginBottom: space.md + 'px', color: palette.sageDeep || palette.sage }
      }, React.createElement(Icon, { name: 'notfall', size: 40 })),
      React.createElement(PageTitle, { palette, style: { margin: '0 0 8px 0' } }, t('notfallEinstieg.title')),
      React.createElement('p', {
        style: { fontSize: text.body, color: palette.mid, margin: 0, lineHeight: leading.relaxed, maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }
      }, t('notfallEinstieg.subtitle'))
    ),

    // Ernstfall-Einstieg: die Vorlesekarte ist der eine Knopf für den Moment selbst.
    React.createElement('button', {
      onClick: () => onNavigate('notfallkarte'),
      style: {
        display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
        marginBottom: space.xl + 'px',
        padding: space.lg + 'px ' + space.md + 'px',
        background: (palette.sageDeep || palette.sage) + '14',
        border: '1px solid ' + (palette.sageDeep || palette.sage) + '55',
        borderRadius: radius.md, fontFamily: 'inherit',
      },
    },
      React.createElement('div', {
        style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, marginBottom: '4px' }
      }, '☎ ' + t('notfallEinstieg.vorlesekarteTitle')),
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed }
      }, t('notfallEinstieg.vorlesekarteSub') + ' →')
    ),

    SCENARIOS.map(scenario => {
      const filled = scenario.fields.filter(f => hasValue(f.chapter, f.k)).length;
      const total = scenario.fields.length;
      const pct = Math.round((filled / total) * 100);
      const allDone = filled === total;

      const chaptersNeeded = [...new Set(scenario.fields.filter(f => !hasValue(f.chapter, f.k)).map(f => f.chapter))];

      return React.createElement('div', {
        key: scenario.key,
        style: {
          marginBottom: space.lg + 'px',
          padding: space.lg + 'px ' + space.md + 'px',
          background: allDone ? palette.sage + '12' : palette.surface,
          borderRadius: radius.md,
          border: '1px solid ' + (allDone ? palette.sage + '40' : palette.border + '88'),
          boxShadow: shadow.sm,
        }
      },
        React.createElement('div', {
          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: space.sm }
        },
          React.createElement(PanelTitle, { palette, style: { margin: 0 } }, t('notfallEinstieg.' + scenario.key + '.title')),
          React.createElement('span', {
            style: { fontSize: text.sm, color: allDone ? palette.sage : palette.mid, fontWeight: weight.medium }
          }, filled + '/' + total)
        ),

        React.createElement('p', {
          style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, margin: '0 0 ' + space.md + 'px 0' }
        }, t('notfallEinstieg.' + scenario.key + '.description')),

        React.createElement('div', {
          style: { width: '100%', height: '3px', background: palette.up, borderRadius: '2px', overflow: 'hidden', marginBottom: space.md + 'px' }
        },
          React.createElement('div', {
            style: {
              width: pct + '%', height: '100%',
              background: allDone ? palette.sage : palette.sand,
              borderRadius: '2px',
              transition: `width ${duration.slow}ms ${ease}`,
            }
          })
        ),

        React.createElement('div', {
          style: { display: 'flex', flexDirection: 'column', gap: '6px' }
        },
          scenario.fields.map(f => {
            const done = hasValue(f.chapter, f.k);
            return React.createElement('div', {
              key: f.chapter + '.' + f.k,
              onClick: () => { if (!done) goToChapter(f.chapter); },
              role: done ? undefined : 'button',
              tabIndex: done ? undefined : 0,
              onKeyDown: done ? undefined : (e) => { if (e.key === 'Enter') goToChapter(f.chapter); },
              style: {
                display: 'flex', alignItems: 'center', gap: space.sm + 'px',
                fontSize: text.sm,
                color: done ? palette.sage : palette.text,
                cursor: done ? 'default' : 'pointer',
                padding: '4px 0',
                opacity: done ? 0.7 : 1,
              }
            },
              React.createElement('span', {
                style: { fontSize: text.xs, flexShrink: 0, width: '16px', textAlign: 'center' }
              }, done ? '✓' : '○'),
              getFieldLabel(f.chapter, f.k)
            );
          })
        ),

        !allDone && chaptersNeeded.length > 0 && React.createElement('div', {
          style: { marginTop: space.md + 'px', paddingTop: space.sm + 'px', borderTop: '1px solid ' + palette.border }
        },
          React.createElement('div', {
            style: { display: 'flex', flexWrap: 'wrap', gap: space.sm }
          },
            chaptersNeeded.map(chKey => {
              const ch = chapters.find(c => c.key === chKey);
              return React.createElement('button', {
                key: chKey,
                onClick: () => goToChapter(chKey),
                style: {
                  background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm,
                  cursor: 'pointer', padding: '6px 12px',
                  fontSize: text.sm, color: palette.text, fontFamily: 'inherit',
                },
              }, '→ ' + (ch ? ch.title : chKey));
            })
          )
        ),

        allDone && React.createElement('div', {
          style: { marginTop: space.md + 'px', fontSize: text.sm, color: palette.sage, fontStyle: 'italic' }
        }, t('notfallEinstieg.allDone'))
      );
    }),

    React.createElement('button', {
      onClick: () => onNavigate('dashboard'),
      style: {
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: text.sm, color: palette.mid, fontFamily: 'inherit',
        padding: space.sm + 'px 0', marginTop: space.md + 'px',
      }
    }, '← ' + t('notfallEinstieg.back'))
  );
};

export default NotfallEinstieg;
