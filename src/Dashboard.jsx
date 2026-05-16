import React, { useState } from 'react';
import Icons from './IconSystem.jsx';

const AlphaBanner = ({ palette, t, onDismiss }) =>
  React.createElement('div', {
    role: 'status',
    'data-alpha-banner': true,
    style: {
      padding: '16px 20px', marginBottom: '24px', borderRadius: '10px',
      background: palette.gold + '14', border: '1px solid ' + palette.gold + '44',
    }
  },
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px' }
    },
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', {
          style: { fontSize: '13px', fontWeight: '600', color: palette.gold, marginBottom: '8px' }
        }, t('alpha.title')),
        React.createElement('div', {
          style: { fontSize: '12px', color: palette.mid, lineHeight: 1.6 }
        },
          React.createElement('p', { style: { margin: '0 0 6px 0' } }, t('alpha.intro')),
          React.createElement('ul', {
            style: { margin: '0', paddingLeft: '16px' }
          },
            React.createElement('li', { style: { marginBottom: '3px' } }, t('alpha.skosNote')),
            React.createElement('li', { style: { marginBottom: '3px' } }, t('alpha.bvgNote')),
            React.createElement('li', { style: { marginBottom: '3px' } }, t('alpha.kkNote'))
          ),
          React.createElement('p', { style: { margin: '6px 0 0 0' } }, t('alpha.disclaimer'))
        )
      ),
      React.createElement('button', {
        onClick: onDismiss,
        'aria-label': t('common.close'),
        style: {
          background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
          color: palette.mid, fontSize: '16px', lineHeight: 1, flexShrink: 0,
        }
      }, '×')
    )
  );

export const DashboardComplete = ({ palette, t, chapters, data, onSelectChapter, completion, onNavigate }) => {

  const calculateChapterCompletion = (chapterKey) => {
    const chapter = chapters.find(ch => ch.key === chapterKey);
    if (!chapter) return { pct: 0, filled: 0, total: 0 };
    const chapterData = data[chapterKey] || {};
    let filled = 0;
    chapter.fields.forEach(f => { if (chapterData[f.k]) filled++; });
    const total = chapter.fields.length;
    return { pct: total > 0 ? Math.round((filled / total) * 100) : 0, filled, total };
  };

  const getStatusColor = (pct) => {
    if (pct === 0) return palette.soft;
    if (pct < 50) return palette.gold;
    if (pct < 100) return palette.sage;
    return palette.sage;
  };

  // Chapter icon mapping to SVG system
  const chapterIcons = {
    basis: 'basis', wohnen: 'wohnen', finanzen: 'finanzen',
    versicherungen: 'versicherungen', ausbildung: 'ausbildung',
    behoerden: 'behoerden', notfall: 'notfall',
  };

  const [alphaDismissed, setAlphaDismissed] = useState(false);
  const hasMeaningfulProgress = completion >= 15;
  const gentleStartActions = [
    { label: t('guidedStart.basicInfo'), action: () => onSelectChapter(chapters.findIndex(ch => ch.key === 'basis')) },
    { label: t('guidedStart.documents'), action: () => onNavigate('tresor') },
    { label: t('guidedStart.emergency'), action: () => onSelectChapter(chapters.findIndex(ch => ch.key === 'notfall')) },
  ];


  return React.createElement('div', { style: { maxWidth: '720px', margin: '0 auto' } },

    // ─── Alpha banner ──────────────────────────────────────
    !alphaDismissed && React.createElement(AlphaBanner, {
      palette, t, onDismiss: () => setAlphaDismissed(true)
    }),

    // ─── Welcome area ──────────────────────────────────────
    React.createElement('div', { style: { marginBottom: '32px', paddingTop: '8px' } },
      React.createElement('h1', {
        style: { fontSize: '28px', fontWeight: '700', margin: '0 0 6px 0', lineHeight: 1.2, letterSpacing: '-0.3px' }
      }, t('dashboard.welcome')),
      React.createElement('p', {
        style: { fontSize: '15px', color: palette.mid, margin: 0, lineHeight: 1.5 }
      }, t('dashboard.tagline'))
    ),

    // ─── Guided start — calm first-use card ───────────────
    !hasMeaningfulProgress && React.createElement('div', {
      style: {
        marginBottom: '32px',
        padding: '20px 24px',
        background: palette.surface,
        borderRadius: '12px',
        border: '1px solid ' + palette.border
      }
    },
      React.createElement('div', {
        style: { fontSize: '13px', fontWeight: '600', color: palette.text, marginBottom: '8px' }
      }, t('guidedStart.title')),
      React.createElement('p', {
        style: { fontSize: '13px', color: palette.mid, lineHeight: 1.6, margin: '0 0 12px 0' }
      }, t('guidedStart.text')),
      React.createElement('div', {
        style: { display: 'flex', flexDirection: 'column', gap: '6px' }
      },
        gentleStartActions.map((item) =>
          React.createElement('button', {
            key: item.label,
            onClick: item.action,
            style: {
              background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0',
              fontSize: '13px', color: palette.mid, textAlign: 'left', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: '8px',
            },
            onMouseEnter: (e) => { e.currentTarget.style.color = palette.text; },
            onMouseLeave: (e) => { e.currentTarget.style.color = palette.mid; },
          },
            React.createElement('span', { style: { color: palette.sage, fontSize: '11px' } }, '→'),
            item.label
          )
        )
      )
    ),

    // ─── Progress — subtle, integrated ─────────────────────
    React.createElement('div', {
      style: { marginBottom: '32px', padding: '20px 24px', background: palette.surface, borderRadius: '12px', border: '1px solid ' + palette.border }
    },
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }
      },
        React.createElement('span', { style: { fontSize: '13px', fontWeight: '600', color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px' } },
          t('dashboard.progress')
        ),
        React.createElement('span', { style: { fontSize: '15px', fontWeight: '600', color: completion === 100 ? palette.sage : palette.text } },
          completion + '%'
        )
      ),
      // Progress bar — thinner, calmer
      React.createElement('div', { style: { width: '100%', height: '4px', background: palette.up, borderRadius: '2px', overflow: 'hidden' } },
        React.createElement('div', {
          style: {
            width: completion + '%', height: '100%',
            background: completion === 100 ? palette.sage : palette.sand,
            borderRadius: '2px',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }
        })
      ),
      React.createElement('div', {
        style: { fontSize: '12px', color: palette.mid, marginTop: '10px' }
      }, completion === 100 ? t('dashboard.progressComplete') : t('dashboard.progressRemaining', { value: 100 - completion }))
    ),

    // ─── Life chapters — calm cards ────────────────────────
    React.createElement('div', { style: { marginBottom: '32px' } },
      React.createElement('h2', {
        style: { fontSize: '13px', fontWeight: '600', color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }
      }, t('dashboard.yourChapters')),

      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
        chapters.map((ch, idx) => {
          const { pct, filled, total } = calculateChapterCompletion(ch.key);
          const statusColor = getStatusColor(pct);
          const iconKey = chapterIcons[ch.key];
          const IconFn = iconKey && Icons[iconKey];

          return React.createElement('button', {
            key: ch.key,
            onClick: () => onSelectChapter(idx),
            style: {
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '18px 20px',
              background: palette.surface,
              border: '1px solid ' + palette.border,
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              color: palette.text,
              fontFamily: 'inherit',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              width: '100%',
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.borderColor = palette.sand;
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.borderColor = palette.border;
              e.currentTarget.style.boxShadow = 'none';
            }
          },
            // Icon
            React.createElement('div', {
              style: { width: '40px', height: '40px', borderRadius: '10px', background: palette.up, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: statusColor }
            }, IconFn ? IconFn() : React.createElement('span', { style: { fontSize: '18px' } }, ch.icon)),

            // Text
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { fontSize: '15px', fontWeight: '600', marginBottom: '2px' } }, ch.title),
              React.createElement('div', { style: { fontSize: '12px', color: palette.mid, lineHeight: 1.4 } }, ch.description),
              React.createElement('div', { style: { fontSize: '11px', color: pct === 0 ? palette.soft : palette.mid, marginTop: '4px', fontWeight: '500' } }, t('dashboard.fieldsCount', { filled, total }))
            ),

            // Completion indicator — minimal circle
            React.createElement('div', {
              style: { width: '36px', height: '36px', position: 'relative', flexShrink: 0 }
            },
              React.createElement('svg', { width: '36', height: '36', viewBox: '0 0 36 36' },
                React.createElement('circle', { cx: '18', cy: '18', r: '15', fill: 'none', stroke: palette.up, strokeWidth: '2.5' }),
                React.createElement('circle', {
                  cx: '18', cy: '18', r: '15', fill: 'none',
                  stroke: statusColor, strokeWidth: '2.5',
                  strokeDasharray: (2 * Math.PI * 15).toFixed(1),
                  strokeDashoffset: ((1 - pct / 100) * 2 * Math.PI * 15).toFixed(1),
                  strokeLinecap: 'round',
                  transform: 'rotate(-90 18 18)',
                  style: { transition: 'stroke-dashoffset 0.4s cubic-bezier(0.4, 0, 0.2, 1)' },
                })
              ),
              React.createElement('div', {
                style: {
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: '600', color: pct === 0 ? palette.soft : palette.text,
                }
              }, pct)
            )
          );
        })
      )
    ),

    // ─── Tools — calm grid ─────────────────────────────────
    React.createElement('div', { style: { marginBottom: '32px' } },
      React.createElement('h2', {
        style: { fontSize: '13px', fontWeight: '600', color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }
      }, t('dashboard.toolsAndFeatures')),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' } },
        [
          { label: t('nav.calendar'), view: 'calendar', icon: 'calendar' },
          { label: t('nav.budgetSync'), view: 'sync', icon: 'money' },
          { label: t('nav.kvgIpv'), view: 'premium', icon: 'health' },
          { label: t('nav.tresor'), view: 'tresor', icon: 'document' },
          { label: t('nav.cv'), view: 'cv', icon: 'document' },
          { label: t('nav.export'), view: 'export', icon: 'download' },
        ].map(tool => {
          const IconFn = Icons[tool.icon];
          return React.createElement('button', {
            key: tool.view,
            onClick: () => onNavigate(tool.view),
            style: {
              padding: '14px 12px',
              background: palette.surface,
              color: palette.text,
              border: '1px solid ' + palette.border,
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '12px',
              fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'border-color 0.2s',
            },
            onMouseEnter: (e) => { e.currentTarget.style.borderColor = palette.sand; },
            onMouseLeave: (e) => { e.currentTarget.style.borderColor = palette.border; },
          },
            React.createElement('div', { style: { color: palette.mid, width: '16px', height: '16px', flexShrink: 0 } },
              IconFn ? React.createElement('div', { style: { width: '16px', height: '16px' } }, IconFn()) : null
            ),
            tool.label
          );
        })
      )
    ),

    // ─── Tips — gentle, editorial ──────────────────────────
    React.createElement('div', {
      style: { padding: '20px 24px', background: palette.surface, borderRadius: '12px', border: '1px solid ' + palette.border, marginBottom: '24px' }
    },
      React.createElement('h3', {
        style: { fontSize: '12px', fontWeight: '600', color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }
      }, t('dashboard.tipsTitle')),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
        [t('dashboard.tip1'), t('dashboard.tip2'), t('dashboard.tip3'), t('dashboard.tip4')].map((tip, i) =>
          React.createElement('div', { key: i, style: { fontSize: '13px', color: palette.mid, lineHeight: 1.5, display: 'flex', gap: '10px', alignItems: 'start' } },
            React.createElement('span', { style: { color: palette.sage, fontSize: '11px', marginTop: '2px', flexShrink: 0 } }, '—'),
            tip
          )
        )
      )
    )
  );
};

export default DashboardComplete;
