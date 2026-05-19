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

    // ─── Maloja Pass — interactive topographic map ─────────
    React.createElement('div', {
      style: { margin: '20px -8px 28px -8px', lineHeight: 0, position: 'relative' }
    },
      React.createElement('svg', {
        viewBox: '0 0 720 200',
        preserveAspectRatio: 'xMidYMax slice',
        'aria-hidden': 'true',
        style: { width: '100%', height: 'auto', display: 'block' }
      },
        // Far peaks — distant massif
        React.createElement('path', {
          d: 'M 0 200 L 0 120 L 30 105 L 65 70 L 85 55 L 105 68 L 130 42 L 150 30 L 170 45 L 195 58 L 220 38 L 245 22 L 260 30 L 280 50 L 300 65 L 330 80 L 360 95 L 390 88 L 410 80 L 440 70 L 460 55 L 475 42 L 490 28 L 510 18 L 530 30 L 548 45 L 560 55 L 580 68 L 610 80 L 640 72 L 660 58 L 680 48 L 700 60 L 720 75 L 720 200 Z',
          fill: palette.sage, opacity: 0.07,
        }),
        // Mid peaks
        React.createElement('path', {
          d: 'M 0 200 L 0 140 L 40 125 L 70 95 L 95 78 L 115 85 L 140 62 L 165 48 L 185 55 L 210 72 L 240 58 L 260 45 L 275 55 L 295 75 L 320 100 L 345 115 L 370 125 L 395 120 L 415 128 L 435 118 L 455 100 L 475 80 L 495 62 L 515 48 L 535 55 L 555 72 L 575 85 L 600 95 L 625 90 L 650 78 L 670 68 L 695 80 L 720 100 L 720 200 Z',
          fill: palette.sage, opacity: 0.12,
        }),
        // Front range with pass saddle
        React.createElement('path', {
          d: 'M 0 200 L 0 155 L 35 142 L 60 120 L 90 105 L 110 110 L 135 92 L 155 80 L 175 88 L 200 100 L 225 112 L 260 130 L 290 142 L 320 150 L 350 155 L 380 158 L 410 155 L 435 148 L 455 135 L 475 118 L 498 100 L 520 85 L 540 78 L 560 88 L 585 102 L 610 115 L 640 108 L 665 95 L 690 105 L 720 120 L 720 200 Z',
          fill: palette.sage, opacity: 0.20,
        }),
        // Pass trail
        React.createElement('path', {
          d: 'M 15 162 Q 60 148 110 132 Q 160 116 220 128 Q 280 142 330 152 L 360 156 Q 390 156 420 150 Q 465 138 510 118 Q 555 102 590 110 Q 640 120 705 128',
          fill: 'none', stroke: palette.sand, strokeWidth: '1.5', opacity: 0.45,
          strokeLinecap: 'round',
        })
      ),
      // Chapter icons positioned along the trail
      React.createElement('div', {
        style: { position: 'absolute', inset: 0, pointerEvents: 'none' }
      },
        [
          { x: 6.9, y: 76, key: 'basis' },
          { x: 19.4, y: 62, key: 'wohnen' },
          { x: 33.3, y: 68, key: 'finanzen' },
          { x: 47.2, y: 76.5, key: 'versicherungen' },
          { x: 61.1, y: 72.5, key: 'ausbildung' },
          { x: 75, y: 55, key: 'behoerden' },
          { x: 91.7, y: 61, key: 'notfall' },
        ].map((station, i) => {
          const pct = chapterCompletions[i] || 0;
          const iconColor = pct === 100 ? palette.sage : pct > 0 ? palette.sand : palette.mid;
          const iconOpacity = pct === 0 ? 0.55 : pct === 100 ? 0.95 : 0.8;
          const iconKey = chapterIcons[station.key];
          const IconFn = iconKey && Icons[iconKey];
          return React.createElement('button', {
            key: station.key,
            onClick: () => onSelectChapter(i),
            'aria-label': chapters[i] ? chapters[i].title : station.key,
            style: {
              position: 'absolute',
              left: station.x + '%',
              top: station.y + '%',
              transform: 'translate(-50%, -50%)',
              width: '28px', height: '28px',
              background: palette.surface,
              border: '1.5px solid ' + (pct > 0 ? iconColor : palette.border),
              borderRadius: '50%',
              padding: '4px',
              cursor: 'pointer',
              pointerEvents: 'auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: iconColor,
              opacity: iconOpacity,
              transition: 'opacity 0.4s, border-color 0.3s, background 0.3s, transform 0.2s',
              boxShadow: pct > 0 ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)';
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.opacity = String(iconOpacity);
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
            },
          },
            React.createElement('div', {
              style: { width: '18px', height: '18px' }
            }, IconFn ? IconFn() : null)
          );
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
