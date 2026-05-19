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

  // Trail segments hugging front range contour (+6px below ridge)
  const trailSegments = [
    { d: 'M 15 162 C 25 155 35 148 50 134', chapter: 0 },
    { d: 'M 50 134 C 75 118 110 115 140 97', chapter: 0 },
    { d: 'M 140 97 C 165 88 200 106 240 126', chapter: 1 },
    { d: 'M 240 126 C 270 136 305 150 340 158', chapter: 2 },
    { d: 'M 340 158 C 370 160 410 158 440 153', chapter: 3 },
    { d: 'M 440 153 C 468 138 505 102 540 86', chapter: 4 },
    { d: 'M 540 86 C 575 92 625 112 660 103', chapter: 5 },
    { d: 'M 660 103 C 680 108 698 115 710 119', chapter: 6 },
  ];

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
        // Far peaks — opacity deepens with progress
        React.createElement('path', {
          d: 'M 0 200 L 0 120 L 30 105 L 65 70 L 85 55 L 105 68 L 130 42 L 150 30 L 170 45 L 195 58 L 220 38 L 245 22 L 260 30 L 280 50 L 300 65 L 330 80 L 360 95 L 390 88 L 410 80 L 440 70 L 460 55 L 475 42 L 490 28 L 510 18 L 530 30 L 548 45 L 560 55 L 580 68 L 610 80 L 640 72 L 660 58 L 680 48 L 700 60 L 720 75 L 720 200 Z',
          fill: palette.sage,
          style: { opacity: 0.07 + (completion / 100) * 0.06, transition: 'opacity 1.2s ease' },
        }),
        // Mid peaks
        React.createElement('path', {
          d: 'M 0 200 L 0 140 L 40 125 L 70 95 L 95 78 L 115 85 L 140 62 L 165 48 L 185 55 L 210 72 L 240 58 L 260 45 L 275 55 L 295 75 L 320 100 L 345 115 L 370 125 L 395 120 L 415 128 L 435 118 L 455 100 L 475 80 L 495 62 L 515 48 L 535 55 L 555 72 L 575 85 L 600 95 L 625 90 L 650 78 L 670 68 L 695 80 L 720 100 L 720 200 Z',
          fill: palette.sage,
          style: { opacity: 0.12 + (completion / 100) * 0.08, transition: 'opacity 1.2s ease' },
        }),
        // Front range with pass saddle
        React.createElement('path', {
          d: 'M 0 200 L 0 155 L 35 142 L 60 120 L 90 105 L 110 110 L 135 92 L 155 80 L 175 88 L 200 100 L 225 112 L 260 130 L 290 142 L 320 150 L 350 155 L 380 158 L 410 155 L 435 148 L 455 135 L 475 118 L 498 100 L 520 85 L 540 78 L 560 88 L 585 102 L 610 115 L 640 108 L 665 95 L 690 105 L 720 120 L 720 200 Z',
          fill: palette.sage,
          style: { opacity: 0.20 + (completion / 100) * 0.10, transition: 'opacity 1.2s ease' },
        }),
        // Landscape details — appear with progress
        completion >= 30 && React.createElement('g', {
          key: 'trees',
          style: { opacity: Math.min(1, (completion - 30) / 40), transition: 'opacity 1.5s ease' },
        },
          React.createElement('path', { d: 'M 95 178 L 100 160 L 105 178 Z', fill: palette.sage, opacity: 0.25 }),
          React.createElement('path', { d: 'M 610 168 L 616 148 L 622 168 Z', fill: palette.sage, opacity: 0.25 }),
          React.createElement('path', { d: 'M 625 172 L 630 155 L 635 172 Z', fill: palette.sage, opacity: 0.2 }),
        ),
        completion >= 60 && React.createElement('g', {
          key: 'detail',
          style: { opacity: Math.min(1, (completion - 60) / 30), transition: 'opacity 1.5s ease' },
        },
          React.createElement('path', { d: 'M 200 172 L 205 158 L 210 172 Z', fill: palette.sage, opacity: 0.22 }),
          React.createElement('path', { d: 'M 450 162 L 454 150 L 458 162 Z', fill: palette.sage, opacity: 0.22 }),
          React.createElement('circle', { cx: '660', cy: '20', r: '10', fill: palette.sand, opacity: 0.12 }),
        ),
        // Pass trail — segmented by chapter progress
        ...trailSegments.map((seg, i) => {
          const walked = chapterCompletions[seg.chapter] > 0;
          return React.createElement('path', {
            key: 'trail-' + i,
            d: seg.d,
            fill: 'none',
            stroke: walked ? palette.sand : palette.mid,
            strokeWidth: walked ? '2' : '1.5',
            opacity: walked ? 0.6 : 0.2,
            strokeLinecap: 'round',
            strokeDasharray: walked ? 'none' : '4 6',
            style: { transition: 'opacity 0.8s ease, stroke-width 0.6s ease, stroke 0.6s ease' },
          });
        })
      ),
      // Chapter icons positioned along the trail
      React.createElement('div', {
        style: { position: 'absolute', inset: 0, pointerEvents: 'none' }
      },
        [
          { x: 6.9, y: 67, key: 'basis' },
          { x: 19.4, y: 48.5, key: 'wohnen' },
          { x: 33.3, y: 63, key: 'finanzen' },
          { x: 47.2, y: 79, key: 'versicherungen' },
          { x: 61.1, y: 76.5, key: 'ausbildung' },
          { x: 75, y: 43, key: 'behoerden' },
          { x: 91.7, y: 51.5, key: 'notfall' },
        ].map((station, i) => {
          const pct = chapterCompletions[i] || 0;
          const iconKey = chapterIcons[station.key];
          const IconFn = iconKey && Icons[iconKey];

          // Maturity stages: sketch → emerging → maturing → complete
          const maturity = pct === 0 ? 'sketch' : pct < 50 ? 'emerging' : pct < 100 ? 'maturing' : 'complete';
          const sizes = { sketch: 26, emerging: 30, maturing: 32, complete: 34 };
          const iconSizes = { sketch: 14, emerging: 17, maturing: 19, complete: 20 };
          const colors = { sketch: palette.mid, emerging: palette.sand, maturing: palette.sand, complete: palette.sage };
          const opacities = { sketch: 0.45, emerging: 0.75, maturing: 0.88, complete: 1 };
          const borders = {
            sketch: '1px dashed ' + palette.border,
            emerging: '1.5px solid ' + palette.sand + '88',
            maturing: '1.5px solid ' + palette.sand,
            complete: '2px solid ' + palette.sage,
          };
          const shadows = {
            sketch: 'none',
            emerging: '0 1px 3px rgba(0,0,0,0.06)',
            maturing: '0 1px 5px rgba(0,0,0,0.08)',
            complete: '0 2px 8px rgba(0,0,0,0.1), 0 0 0 3px ' + palette.sage + '15',
          };
          const bgs = {
            sketch: 'transparent',
            emerging: palette.surface,
            maturing: palette.surface,
            complete: palette.surface,
          };
          const sz = sizes[maturity];
          const iconOp = opacities[maturity];

          return React.createElement('button', {
            key: station.key,
            onClick: () => onSelectChapter(i),
            'aria-label': chapters[i] ? chapters[i].title : station.key,
            style: {
              position: 'absolute',
              left: station.x + '%',
              top: station.y + '%',
              transform: 'translate(-50%, -50%)',
              width: sz + 'px', height: sz + 'px',
              background: bgs[maturity],
              border: borders[maturity],
              borderRadius: '50%',
              padding: '0',
              cursor: 'pointer',
              pointerEvents: 'auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: colors[maturity],
              opacity: iconOp,
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: shadows[maturity],
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.12)';
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.opacity = String(iconOp);
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
            },
          },
            React.createElement('div', {
              style: { width: iconSizes[maturity] + 'px', height: iconSizes[maturity] + 'px', transition: 'width 0.6s, height 0.6s' }
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

          const rowOpacity = pct === 0 ? 0.68 : 1;

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
              opacity: rowOpacity,
              transition: 'opacity 0.6s ease',
              width: '100%',
            },
            onMouseEnter: (e) => { e.currentTarget.style.opacity = '1'; },
            onMouseLeave: (e) => { e.currentTarget.style.opacity = String(rowOpacity); },
          },
            // Icon with maturity-aware styling
            React.createElement('div', {
              style: {
                width: '40px', height: '40px', borderRadius: '10px',
                background: getIconBg(pct),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, color: statusColor, opacity: getIconOpacity(pct),
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: pct === 100 ? '0 1px 6px ' + palette.sage + '25' : 'none',
                border: pct === 100 ? '1px solid ' + palette.sage + '30' : '1px solid transparent',
                animation: pct === 100 ? 'mp-stamp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
              }
            }, IconFn ? IconFn() : React.createElement('span', { style: { fontSize: '18px' } }, ch.icon)),

            // Text + subtle fill indicator
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { fontSize: '15px', fontWeight: '600', marginBottom: '2px' } }, ch.title),
              React.createElement('div', { style: { fontSize: '12px', color: palette.mid, lineHeight: 1.4, marginBottom: pct > 0 ? '6px' : '0' } }, ch.description),
              pct > 0 && React.createElement('div', {
                style: { width: '100%', height: '2px', background: palette.up, borderRadius: '1px', overflow: 'hidden' }
              },
                React.createElement('div', {
                  style: {
                    width: pct + '%', height: '100%',
                    background: pct === 100 ? palette.sage : palette.sand,
                    borderRadius: '1px',
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  }
                })
              ),
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
