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

  const getIconBg = (pct) => {
    if (pct === 0) return palette.up;
    if (pct < 50) return palette.sand + '18';
    if (pct < 100) return palette.sand + '28';
    return palette.sage + '20';
  };

  const getIconOpacity = (pct) => {
    if (pct === 0) return 0.44;
    if (pct < 50) return 0.55;
    if (pct < 100) return 0.78;
    return 1;
  };

  // Chapter icon mapping to SVG system
  const chapterIcons = {
    basis: 'basis', wohnen: 'wohnen', finanzen: 'finanzen',
    versicherungen: 'versicherungen', ausbildung: 'ausbildung',
    behoerden: 'behoerden', notfall: 'notfall',
  };

  const chapterCompletions = chapters.map(ch => calculateChapterCompletion(ch.key).pct);

  const lastBackupRaw = localStorage.getItem('or5_lastBackup');
  const lastBackup = lastBackupRaw ? new Date(lastBackupRaw).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : null;

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
    React.createElement('div', { style: { marginBottom: '0', paddingTop: '8px' } },
      React.createElement('h1', {
        style: { fontSize: '28px', fontWeight: '700', margin: '0 0 6px 0', lineHeight: 1.2, letterSpacing: '-0.3px' }
      }, t('dashboard.welcome')),
      React.createElement('p', {
        style: { fontSize: '15px', color: palette.mid, margin: 0, lineHeight: 1.5 }
      }, t('dashboard.tagline'))
    ),

    // ─── Mountain silhouette — topographic anchor ─────────
    React.createElement('div', {
      'aria-hidden': 'true',
      style: { margin: '20px -8px 28px -8px', lineHeight: 0 }
    },
      React.createElement('svg', {
        viewBox: '0 0 720 140',
        preserveAspectRatio: 'xMidYMax slice',
        style: { width: '100%', height: 'auto', display: 'block' }
      },
        // Back range — farthest, lightest
        React.createElement('path', {
          d: 'M 0 140 L 0 95 Q 60 80 120 72 Q 180 64 240 58 Q 300 48 360 42 Q 420 38 480 50 Q 540 62 600 70 Q 660 78 720 85 L 720 140 Z',
          fill: palette.sage, opacity: 0.08,
        }),
        // Mid range
        React.createElement('path', {
          d: 'M 0 140 L 0 108 Q 80 92 140 88 Q 200 82 280 72 Q 340 65 400 60 Q 460 58 520 68 Q 580 78 640 90 Q 680 96 720 100 L 720 140 Z',
          fill: palette.sage, opacity: 0.14,
        }),
        // Front range — closest, darkest
        React.createElement('path', {
          d: 'M 0 140 L 0 118 Q 100 106 180 102 Q 260 96 340 88 Q 400 84 460 82 Q 520 84 580 92 Q 640 100 700 110 L 720 114 L 720 140 Z',
          fill: palette.sage, opacity: 0.22,
        }),
        // Path line — thin trail across the landscape
        React.createElement('path', {
          d: 'M 30 122 Q 90 110 155 104 Q 220 97 310 90 Q 400 84 460 83 Q 530 86 600 95 Q 660 102 695 108',
          fill: 'none', stroke: palette.sand, strokeWidth: '1.2', opacity: 0.5,
          strokeLinecap: 'round',
        }),
        // 7 station dots along the path — one per chapter
        ...[
          { x: 52, y: 118 },
          { x: 155, y: 104 },
          { x: 258, y: 95 },
          { x: 360, y: 87 },
          { x: 462, y: 83 },
          { x: 565, y: 90 },
          { x: 668, y: 105 },
        ].map((pos, i) => {
          const pct = chapterCompletions[i] || 0;
          const dotColor = pct === 100 ? palette.sage : pct > 0 ? palette.sand : palette.border;
          const dotOpacity = pct === 0 ? 0.4 : pct === 100 ? 0.9 : 0.7;
          return React.createElement('circle', {
            key: 'dot-' + i,
            cx: pos.x, cy: pos.y,
            r: pct > 0 ? 4 : 3,
            fill: dotColor,
            opacity: dotOpacity,
            style: { transition: 'fill 0.6s, opacity 0.6s, r 0.4s' },
          });
        })
      )
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

    // ─── Progress — open editorial section ──────────────────
    React.createElement('div', {
      style: { marginBottom: '28px', padding: '0 2px' }
    },
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }
      },
        React.createElement('span', { style: { fontSize: '13px', fontWeight: '600', color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px' } },
          t('dashboard.progress')
        ),
        React.createElement('span', { style: { fontSize: '12px', fontWeight: '500', color: palette.mid } },
          completion + '%'
        )
      ),
      // Progress bar — thinner, calmer
      React.createElement('div', { style: { width: '100%', height: '3px', background: palette.up, borderRadius: '2px', overflow: 'hidden' } },
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
      }, completion === 100 ? t('dashboard.progressComplete')
        : completion === 0 ? t('dashboard.progressStart')
        : completion <= 30 ? t('dashboard.progressEarly')
        : completion <= 60 ? t('dashboard.progressMid')
        : t('dashboard.progressLate')),
      lastBackup && React.createElement('div', {
        style: { fontSize: '11px', color: palette.mid, marginTop: '8px', opacity: 0.7 }
      }, t('dashboard.lastBackup', { date: lastBackup }))
    ),

    // ─── Life chapters — calm cards ────────────────────────
    React.createElement('div', { style: { marginBottom: '40px', marginTop: '40px' } },
      React.createElement('h2', {
        style: { fontSize: '13px', fontWeight: '600', color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }
      }, t('dashboard.yourChapters')),

      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '0px' } },
        chapters.map((ch, idx) => {
          const { pct, filled, total } = calculateChapterCompletion(ch.key);
          const statusColor = getStatusColor(pct);
          const iconKey = chapterIcons[ch.key];
          const IconFn = iconKey && Icons[iconKey];
          const isLast = idx === chapters.length - 1;

          return React.createElement('button', {
            key: ch.key,
            onClick: () => onSelectChapter(idx),
            style: {
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '20px 4px',
              background: 'transparent',
              border: 'none',
              borderBottom: isLast ? 'none' : '1px solid ' + palette.border,
              borderRadius: 0,
              cursor: 'pointer',
              textAlign: 'left',
              color: palette.text,
              fontFamily: 'inherit',
              opacity: pct === 0 ? 0.72 : 1,
              transition: 'opacity 0.4s',
              width: '100%',
            },
            onMouseEnter: (e) => {
              if (pct === 0) e.currentTarget.style.opacity = '1';
            },
            onMouseLeave: (e) => {
              if (pct === 0) e.currentTarget.style.opacity = '0.72';
            }
          },
            // Icon
            React.createElement('div', {
              style: { width: '40px', height: '40px', borderRadius: '10px', background: getIconBg(pct), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: statusColor, opacity: getIconOpacity(pct), transition: 'background 0.4s, opacity 0.6s ease' }
            }, IconFn ? IconFn() : React.createElement('span', { style: { fontSize: '18px' } }, ch.icon)),

            // Text
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { fontSize: '15px', fontWeight: '600', marginBottom: '2px' } }, ch.title),
              React.createElement('div', { style: { fontSize: '12px', color: palette.mid, lineHeight: 1.4 } }, ch.description),
            ),

          );
        })
      )
    ),

    // ─── Tools — calm grid ─────────────────────────────────
    React.createElement('div', { style: { marginBottom: '36px' } },
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

    // ─── Tips — open editorial section ─────────────────────
    React.createElement('div', {
      style: { padding: '0 2px', marginBottom: '24px', borderTop: '1px solid ' + palette.border, paddingTop: '20px' }
    },
      React.createElement('h3', {
        style: { fontSize: '11px', fontWeight: '500', color: palette.soft, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }
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
