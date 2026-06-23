import React, { useState } from 'react';
import Icons from './IconSystem.jsx';
import { text, weight, leading, space, radius, shadow, ease, duration } from './config/tokens.js';
import { getCantonName } from './config/cantonalData.js';
import { calculatePremiumSubsidy } from './premiumCalc.js';

function fmtCHF(v) {
  const n = Number(v);
  return n && !isNaN(n) ? "CHF " + n.toLocaleString('de-CH') : null;
}

function buildSnippet(chapterKey, chData, allData, t) {
  if (chapterKey === 'basis') {
    const name = [(chData.firstName || ''), (chData.lastName || '')].filter(Boolean).join(' ');
    if (!name) return null;
    const canton = chData.canton ? getCantonName(chData.canton, t) : null;
    return canton ? name + ', ' + canton + '.' : name + '.';
  }
  if (chapterKey === 'wohnen') {
    const city = chData.city;
    const rent = fmtCHF(chData.rentAmount);
    if (city && rent) return city + ', ' + rent + '.';
    if (city) return city + '.';
    if (chData.address) return chData.address + '.';
    return null;
  }
  if (chapterKey === 'finanzen') {
    const income = fmtCHF(chData.monthlyIncome);
    if (!income) return null;
    const expFields = ['monthlyTax', 'groceries', 'communication', 'mobility', 'otherInsurance'];
    let exp = 0;
    expFields.forEach(k => { exp += Number(chData[k]) || 0; });
    exp += Number(allData?.wohnen?.rentAmount) || 0;
    exp += Number(allData?.wohnen?.utilities) || 0;
    exp += Number(allData?.versicherungen?.kkPremium) || 0;
    const parts = [income];
    if (exp > 0) parts.push(fmtCHF(exp) + ' ' + t('synthesis.expenses'));
    const annual = (Number(chData.monthlyIncome) || 0) * 12;
    if (annual > 0 && exp > 0) {
      const frei = Number(chData.monthlyIncome) - exp;
      if (frei > 0) parts.push(fmtCHF(Math.round(frei)) + ' ' + t('synthesis.freePerMonth'));
    }
    return parts.join(', ') + '.';
  }
  if (chapterKey === 'versicherungen') {
    if (!chData.kkInsurer) return null;
    const parts = [chData.kkInsurer];
    const prem = fmtCHF(chData.kkPremium);
    if (prem) parts.push(prem);
    if (chData.franchise) parts.push(t('synthesis.franchise', { value: chData.franchise }));
    if (chData.kkModel) parts.push(chData.kkModel);
    return parts.join(', ') + '.';
  }
  if (chapterKey === 'ausbildung') {
    const parts = [chData.jobTitle, chData.employer].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') + '.' : null;
  }
  if (chapterKey === 'behoerden') {
    if (!chData.cantoneOfTaxation) return null;
    const parts = [t('synthesis.taxCanton', { canton: getCantonName(chData.cantoneOfTaxation, t) })];
    if (chData.taxFilingDeadline) parts.push(t('synthesis.taxDeadline', { date: chData.taxFilingDeadline }));
    try {
      const cl = JSON.parse(localStorage.getItem('or5_behoerden_checklist') || '{}');
      const done = Object.values(cl).filter(Boolean).length;
      if (done > 0) parts.push(done + '/6 ' + t('synthesis.checklistDone'));
    } catch {}
    return parts.join(' · ') + '.';
  }
  if (chapterKey === 'notfall') {
    if (!chData.emergencyContact) return null;
    const parts = [t('synthesis.emergencyContact', { name: chData.emergencyContact })];
    if (chData.bloodType) parts.push(t('synthesis.bloodType', { type: chData.bloodType }));
    if (chData.allergies) parts.push(chData.allergies);
    return parts.join(' · ') + '.';
  }
  return null;
}

const QuickCheck = ({ palette, t, onNavigate }) => {
  const [income, setIncome] = useState('');
  const annual = (Number(income) || 0) * 12;
  const result = annual > 0 ? calculatePremiumSubsidy(annual, 0, 0, t, 1) : null;
  const hasResult = result && result.eligibleSubsidy > 0;
  const fmt = (v) => v.toLocaleString('de-CH');

  return React.createElement('div', {
    style: {
      marginTop: space.md, marginBottom: space.lg,
      padding: '20px 24px',
      background: palette.surface,
      borderRadius: radius.lg - 4,
      border: '1px solid ' + palette.border + '88',
      boxShadow: shadow.sm,
    }
  },
    React.createElement('div', {
      style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: space.sm }
    }, t('dashboard.quickCheckTitle')),
    React.createElement('div', {
      style: { display: 'flex', gap: space.md, alignItems: 'flex-end', flexWrap: 'wrap' }
    },
      React.createElement('div', { style: { flex: '1 1 180px', minWidth: '150px' } },
        React.createElement('label', {
          style: { fontSize: text.xs, color: palette.mid, display: 'block', marginBottom: space.xs }
        }, t('dashboard.quickCheckIncome')),
        React.createElement('input', {
          type: 'number',
          inputMode: 'numeric',
          placeholder: t('dashboard.quickCheckPlaceholder'),
          value: income,
          onChange: (e) => setIncome(e.target.value),
          style: {
            width: '100%', padding: '10px 12px', fontSize: text.body,
            border: '1px solid ' + palette.border, borderRadius: radius.sm,
            background: palette.surface, color: palette.text,
            fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
          }
        })
      ),
      annual > 0 && React.createElement('div', {
        style: { flex: '2 1 240px', minWidth: '200px' }
      },
        React.createElement('div', {
          style: {
            padding: '10px 14px',
            background: hasResult ? palette.sage + '10' : palette.up,
            borderRadius: radius.sm,
            border: '1px solid ' + (hasResult ? palette.sage + '30' : palette.border + '44'),
          }
        },
          React.createElement('div', {
            style: { fontSize: text.sm, color: hasResult ? palette.sageDeep || palette.sage : palette.mid, fontWeight: hasResult ? weight.medium : weight.normal }
          }, hasResult
            ? t('dashboard.quickCheckResult', { income: fmt(annual), amount: fmt(result.eligibleSubsidy * 12) })
            : t('dashboard.quickCheckNoResult')
          ),
          React.createElement('div', {
            style: { fontSize: text.xs - 1, color: palette.mid, marginTop: space.xs }
          }, t('dashboard.quickCheckHint'))
        )
      )
    ),
    React.createElement('button', {
      onClick: () => onNavigate('premium'),
      style: {
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        fontSize: text.xs, color: palette.sand, fontFamily: 'inherit',
        fontWeight: weight.medium, marginTop: space.sm,
      }
    }, t('dashboard.quickCheckMore'))
  );
};

const AlphaBanner = ({ palette, t, onDismiss }) =>
  React.createElement('div', {
    role: 'status',
    'data-alpha-banner': true,
    style: {
      padding: '12px 16px', marginBottom: '20px', borderRadius: radius.sm,
      background: palette.up, border: '1px solid ' + palette.border + '88',
      boxShadow: shadow.sm,
    }
  },
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '10px' }
    },
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', {
          style: { fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed }
        },
          React.createElement('span', {
            style: { fontWeight: weight.semi }
          }, t('alpha.title') + ' · '),
          t('alpha.summary')
        ),
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs, lineHeight: leading.relaxed }
        }, t('alpha.disclaimer'))
      ),
      React.createElement('button', {
        onClick: onDismiss,
        'aria-label': t('common.close'),
        style: {
          background: 'none', border: 'none', cursor: 'pointer', padding: space.xs,
          color: palette.mid, fontSize: text.body, lineHeight: 1, flexShrink: 0,
        }
      }, '×')
    )
  );

const BetaFeedback = ({ palette, t }) => {
  const storageKey = 'or5_beta_feedback';
  const [submitted, setSubmitted] = useState(() => {
    try { return localStorage.getItem(storageKey) === 'done'; } catch { return false; }
  });
  const [expanded, setExpanded] = useState(false);
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');

  if (submitted) {
    return React.createElement('div', {
      style: {
        textAlign: 'center', padding: space.lg + 'px', margin: space.xl + 'px 0',
        background: palette.sageMist || palette.up, borderRadius: radius.md,
      }
    },
      React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.medium, color: palette.text } }, t('beta.feedback.thanks')),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, t('beta.feedback.thanksDetail'))
    );
  }

  if (!expanded) {
    return React.createElement('div', { style: { textAlign: 'center', margin: space.xl + 'px 0' } },
      React.createElement('button', {
        onClick: () => setExpanded(true),
        style: {
          background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.md,
          padding: space.sm + 'px ' + space.lg + 'px', cursor: 'pointer',
          color: palette.mid, fontSize: text.sm, fontFamily: 'inherit',
        }
      }, t('beta.feedback.title') + ' →')
    );
  }

  const radioStyle = (selected) => ({
    padding: space.sm + 'px ' + space.md + 'px', borderRadius: radius.sm, cursor: 'pointer',
    border: '1px solid ' + (selected ? (palette.sage || palette.accent) : palette.border),
    background: selected ? (palette.sageMist || palette.up) : 'transparent',
    color: palette.text, fontSize: text.sm, fontFamily: 'inherit',
    fontWeight: selected ? weight.medium : weight.normal, transition: `all ${duration.fast}ms ${ease}`,
  });

  const handleSubmit = () => {
    const feedback = { q1, q2, q3, timestamp: new Date().toISOString() };
    try {
      localStorage.setItem(storageKey, 'done');
      localStorage.setItem(storageKey + '_data', JSON.stringify(feedback));
    } catch { /* ignore */ }
    setSubmitted(true);
  };

  return React.createElement('div', {
    style: {
      margin: space.xl + 'px 0', padding: space.lg + 'px', borderRadius: radius.md,
      background: palette.sageMist || palette.up, border: '1px solid ' + palette.border + '44',
    }
  },
    React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.body, color: palette.text, marginBottom: space.xs + 'px' } }, t('beta.feedback.title')),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.lg + 'px' } }, t('beta.feedback.subtitle')),

    React.createElement('div', { style: { marginBottom: space.lg + 'px' } },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text, marginBottom: space.sm + 'px' } }, t('beta.feedback.q1')),
      React.createElement('div', { style: { display: 'flex', gap: space.sm + 'px', flexWrap: 'wrap' } },
        React.createElement('button', { onClick: () => setQ1('yes'), style: radioStyle(q1 === 'yes') }, t('beta.feedback.scaleYes')),
        React.createElement('button', { onClick: () => setQ1('mostly'), style: radioStyle(q1 === 'mostly') }, t('beta.feedback.scaleMostly')),
        React.createElement('button', { onClick: () => setQ1('unclear'), style: radioStyle(q1 === 'unclear') }, t('beta.feedback.scaleUnclear'))
      )
    ),

    React.createElement('div', { style: { marginBottom: space.lg + 'px' } },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text, marginBottom: space.sm + 'px' } }, t('beta.feedback.q2')),
      React.createElement('div', { style: { display: 'flex', gap: space.sm + 'px', flexWrap: 'wrap' } },
        React.createElement('button', { onClick: () => setQ2('high'), style: radioStyle(q2 === 'high') }, t('beta.feedback.trustHigh')),
        React.createElement('button', { onClick: () => setQ2('ok'), style: radioStyle(q2 === 'ok') }, t('beta.feedback.trustOk')),
        React.createElement('button', { onClick: () => setQ2('low'), style: radioStyle(q2 === 'low') }, t('beta.feedback.trustLow'))
      )
    ),

    React.createElement('div', { style: { marginBottom: space.lg + 'px' } },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text, marginBottom: space.sm + 'px' } }, t('beta.feedback.q3')),
      React.createElement('textarea', {
        value: q3, onChange: (e) => setQ3(e.target.value),
        placeholder: t('beta.feedback.q3placeholder'),
        rows: 3,
        style: {
          width: '100%', padding: space.sm + 'px', fontSize: text.sm, fontFamily: 'inherit',
          border: '1px solid ' + palette.border, borderRadius: radius.sm,
          background: palette.surface, color: palette.text, resize: 'vertical',
          boxSizing: 'border-box',
        }
      })
    ),

    React.createElement('button', {
      onClick: handleSubmit,
      disabled: !q1 && !q2 && !q3,
      style: {
        padding: space.sm + 'px ' + space.lg + 'px', borderRadius: radius.sm,
        border: 'none', cursor: (!q1 && !q2 && !q3) ? 'default' : 'pointer',
        background: (!q1 && !q2 && !q3) ? palette.border : (palette.sage || palette.accent),
        color: (!q1 && !q2 && !q3) ? palette.mid : '#fff',
        fontSize: text.sm, fontWeight: weight.medium, fontFamily: 'inherit',
      }
    }, t('beta.feedback.submit'))
  );
};

const FortschrittsKarte = ({ palette, t, chapters, chapterCompletions, chapterStatuses, chapterAccentColor, onSelectChapter, text, weight, space, radius, shadow }) => {
  const statusLabels = { leer: t('chapterStatus.leer'), begonnen: t('chapterStatus.begonnen'), grundordnung: t('chapterStatus.grundordnung'), vertieft: t('chapterStatus.vertieft') };
  const totalPct = chapters.length > 0 ? Math.round(chapterCompletions.reduce((a, b) => a + b, 0) / chapters.length) : 0;
  return React.createElement('div', {
    style: {
      marginBottom: space.xl, background: palette.surface,
      borderRadius: radius.md, border: '1px solid ' + palette.border + '88',
      boxShadow: shadow.sm, padding: '20px',
    }
  },
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: space.md }
    },
      React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } },
        t('fortschritt.title')
      ),
      React.createElement('span', { style: { fontSize: text.xs, color: palette.mid } },
        totalPct + '%'
      )
    ),
    React.createElement('div', {
      style: { height: '4px', background: palette.border, borderRadius: '2px', marginBottom: space.lg, overflow: 'hidden' }
    },
      React.createElement('div', {
        style: { height: '100%', width: totalPct + '%', background: palette.sage, borderRadius: '2px', transition: `width ${duration.cinematic}ms ${ease}` }
      })
    ),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
      chapters.map((ch, idx) => {
        const pct = chapterCompletions[idx];
        const status = chapterStatuses[idx];
        const accent = chapterAccentColor[ch.key] || palette.sage;
        return React.createElement('button', {
          key: ch.key,
          onClick: () => onSelectChapter(idx),
          'aria-label': ch.title + ' — ' + pct + '%',
          style: {
            display: 'flex', alignItems: 'center', gap: space.sm + 2,
            padding: '10px 8px', background: 'transparent', border: 'none',
            borderRadius: radius.sm, cursor: 'pointer', fontFamily: 'inherit',
            color: palette.text, width: '100%', textAlign: 'left',
            transition: `background ${duration.fast}ms ${ease}`,
          },
          onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; },
          onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; },
        },
          React.createElement('span', { style: { fontSize: text.sm, width: '22px', textAlign: 'center', flexShrink: 0 } }, ch.icon),
          React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.medium, flex: '0 0 auto', minWidth: '90px' } }, ch.title),
          React.createElement('div', {
            style: { flex: 1, height: '6px', background: palette.border + '80', borderRadius: '3px', overflow: 'hidden', margin: '0 4px' }
          },
            React.createElement('div', {
              style: {
                height: '100%', width: pct + '%', borderRadius: '3px',
                background: pct === 100 ? palette.sage : pct > 0 ? accent : 'transparent',
                transition: `width ${duration.cinematic}ms ${ease}`,
              }
            })
          ),
          React.createElement('span', {
            style: { fontSize: text.xs, color: pct === 100 ? palette.sage : palette.mid, fontWeight: weight.medium, width: '32px', textAlign: 'right', flexShrink: 0 }
          }, pct + '%'),
          React.createElement('span', {
            style: { fontSize: '10px', color: palette.soft, width: '80px', textAlign: 'right', flexShrink: 0, display: pct === 0 ? 'none' : 'block' }
          }, statusLabels[status] || '')
        );
      })
    )
  );
};

const DatenWirken = ({ palette, t, data, text, weight, space, radius }) => {
  const connections = [
    { key: 'tax', label: t('datenWirken.tax'), active: !!(data.basis?.canton && data.finanzen?.monthlyIncome) },
    { key: 'ipv', label: t('datenWirken.ipv'), active: !!(data.finanzen?.monthlyIncome && data.versicherungen?.kkPremium) },
    { key: 'sozial', label: t('datenWirken.sozial'), active: !!(data.finanzen?.monthlyIncome && data.basis?.canton) },
    { key: 'lohn', label: t('datenWirken.lohn'), active: !!(data.basis?.canton && data.ausbildung?.jobTitle) },
    { key: 'notfall', label: t('datenWirken.notfall'), active: !!(data.notfall?.emergencyContact) },
    { key: 'budget', label: t('datenWirken.budget'), active: !!(data.finanzen?.monthlyIncome && data.wohnen?.rentAmount) },
  ];
  const active = connections.filter(c => c.active);
  if (active.length === 0) return null;
  return React.createElement('div', {
    style: {
      margin: space.md + 'px 0',
      padding: space.sm + 'px ' + space.md + 'px',
      background: palette.sage + '08',
      borderRadius: radius.md,
      border: '1px solid ' + palette.sage + '15',
    }
  },
    React.createElement('div', {
      style: { fontSize: text.xs, color: palette.mid, marginBottom: '6px', fontWeight: weight.medium }
    }, t('datenWirken.title')),
    React.createElement('div', {
      style: { display: 'flex', flexWrap: 'wrap', gap: '5px' }
    },
      active.map(c =>
        React.createElement('span', {
          key: c.key,
          style: {
            fontSize: text.xs, color: palette.sage,
            padding: '2px 8px',
            background: palette.sage + '0D',
            borderRadius: radius.sm,
          }
        }, '✓ ' + c.label)
      )
    )
  );
};

export const DashboardComplete = ({ palette, t, chapters, data, onSelectChapter, completion, onNavigate, demoMode, onEnterDemo, onLeaveDemo }) => {

  const calculateChapterCompletion = (chapterKey) => {
    const chapter = chapters.find(ch => ch.key === chapterKey);
    if (!chapter) return { pct: 0, filled: 0, total: 0 };
    const chapterData = data[chapterKey] || {};
    let filled = 0;
    chapter.fields.forEach(f => { if (chapterData[f.k]) filled++; });
    const total = chapter.fields.length;
    return { pct: total > 0 ? Math.round((filled / total) * 100) : 0, filled, total };
  };

  const calculateMvo = () => {
    let filled = 0;
    let total = 0;
    chapters.forEach(ch => {
      const chapterData = data[ch.key] || {};
      ch.fields.filter(f => f.mvo).forEach(f => {
        total++;
        if (chapterData[f.k]) filled++;
      });
    });
    return { filled, total, pct: total > 0 ? Math.round((filled / total) * 100) : 0 };
  };
  const mvo = calculateMvo();

  const getChapterStatus = (chapter) => {
    const chapterData = data[chapter.key] || {};
    const filled = chapter.fields.filter(f => chapterData[f.k]).length;
    if (filled === 0) return 'leer';
    const mvoFields = chapter.fields.filter(f => f.mvo);
    const mvoFilled = mvoFields.filter(f => chapterData[f.k]).length;
    if (mvoFields.length > 0 && mvoFilled === mvoFields.length) {
      const total = chapter.fields.length;
      return filled >= Math.ceil(total * 0.75) ? 'vertieft' : 'grundordnung';
    }
    return 'begonnen';
  };

  const chapterAccentColor = {
    basis: palette.sage, wohnen: palette.sage, finanzen: palette.gold,
    versicherungen: palette.sky, ausbildung: palette.sage,
    behoerden: palette.sand, notfall: palette.rose,
  };

  const getStatusColor = (pct, chKey) => {
    if (pct === 0) return chapterAccentColor[chKey] || palette.soft;
    if (pct < 50) return palette.gold;
    if (pct < 100) return palette.sage;
    return palette.sage;
  };

  const getIconBg = (pct, chKey) => {
    const accent = chapterAccentColor[chKey] || palette.sand;
    if (pct === 0) return accent + '18';
    if (pct < 50) return palette.sand + '22';
    if (pct < 100) return palette.sand + '30';
    return palette.sage + '24';
  };

  const getIconOpacity = (pct) => {
    if (pct === 0) return 0.7;
    if (pct < 50) return 0.78;
    if (pct < 100) return 0.88;
    return 1;
  };

  // Chapter icon mapping to SVG system
  const chapterIcons = {
    basis: 'basis', wohnen: 'wohnen', finanzen: 'finanzen',
    versicherungen: 'versicherungen', ausbildung: 'ausbildung',
    behoerden: 'behoerden', notfall: 'notfall',
  };

  const chapterCompletions = chapters.map(ch => calculateChapterCompletion(ch.key).pct);

  // Trail follows exact front range ridge points — like a real hiking path
  const trailSegments = [
    { d: 'M 0 185 L 20 168 L 35 142 L 60 120', chapter: 0 },
    { d: 'M 60 120 L 90 105 L 110 110 L 135 92', chapter: 0 },
    { d: 'M 135 92 L 155 80 L 175 88 L 200 100 L 225 112', chapter: 1 },
    { d: 'M 225 112 L 260 130 L 290 142 L 320 150 L 350 155', chapter: 2 },
    { d: 'M 350 155 L 380 158 L 410 155 L 435 148', chapter: 3 },
    { d: 'M 435 148 L 455 135 L 475 118 L 498 100 L 520 85 L 540 78', chapter: 4 },
    { d: 'M 540 78 L 560 88 L 585 102 L 610 115 L 640 108 L 665 95', chapter: 5 },
    { d: 'M 665 95 L 690 105 L 720 120', chapter: 6 },
  ];

  const lastBackupRaw = localStorage.getItem('or5_lastBackup');
  const lastBackup = lastBackupRaw ? new Date(lastBackupRaw).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  const [alphaDismissed, setAlphaDismissed] = useState(false);
  const chapterStatuses = chapters.map(ch => getChapterStatus(ch));
  const settledCount = chapterStatuses.filter(s => s === 'grundordnung' || s === 'vertieft').length;
  const begunCount = chapterStatuses.filter(s => s !== 'leer').length;
  const hasMeaningfulProgress = settledCount >= 1 || begunCount >= 3;
  const gentleStartActions = [
    { label: t('guidedStart.basicInfo'), action: () => onSelectChapter(chapters.findIndex(ch => ch.key === 'basis')) },
    { label: t('guidedStart.documents'), action: () => onNavigate('tresor') },
    { label: t('guidedStart.emergency'), action: () => onNavigate('notfalleinstieg') },
  ];


  return React.createElement('div', { style: { maxWidth: '720px', margin: '0 auto' } },

    // ─── Alpha banner ──────────────────────────────────────
    !alphaDismissed && React.createElement(AlphaBanner, {
      palette, t, onDismiss: () => setAlphaDismissed(true)
    }),

    // ─── Welcome area ──────────────────────────────────────
    React.createElement('div', { style: { marginBottom: '0', paddingTop: '8px' } },
      React.createElement('h1', {
        style: { fontSize: text['2xl'], fontWeight: weight.bold, margin: '0 0 8px 0', lineHeight: leading.tight, letterSpacing: '-0.3px' }
      }, t('dashboard.welcome')),
      React.createElement('p', {
        style: { fontSize: text.body, color: palette.mid, margin: 0, lineHeight: leading.relaxed }
      }, t('dashboard.tagline') + ' ' + t('dashboard.taglineBenefit')),

      !demoMode && mvo.pct < 50 && React.createElement('button', {
        onClick: onEnterDemo,
        style: {
          marginTop: space.md + 'px',
          padding: space.sm + 'px ' + space.md + 'px',
          background: palette.sand + '18',
          border: '1px solid ' + palette.sand + '35',
          borderRadius: radius.sm,
          cursor: 'pointer',
          fontSize: text.sm,
          color: palette.text,
          fontFamily: 'inherit',
          fontWeight: weight.medium,
          display: 'inline-flex', alignItems: 'center', gap: '6px',
        }
      }, '○ ' + t('demo.ctaButton'))
    ),

    // ─── Demo — prominent example section (before tools for new users) ──
    !hasMeaningfulProgress && !demoMode && React.createElement('div', {
      style: {
        marginTop: space.lg, marginBottom: space.md,
        padding: '20px 24px',
        background: palette.sand + '08',
        borderRadius: radius.lg - 4,
        border: '1px solid ' + palette.sand + '25',
        display: 'flex', alignItems: 'center', gap: '20px',
        flexWrap: 'wrap',
      }
    },
      React.createElement('div', { style: { flex: 1, minWidth: '200px' } },
        React.createElement('div', {
          style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: space.xs }
        }, t('dashboard.demoTitle')),
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.relaxed }
        }, t('dashboard.demoText'))
      ),
      React.createElement('button', {
        onClick: onEnterDemo,
        style: {
          padding: '10px 20px',
          background: palette.sand,
          color: '#fff',
          border: 'none',
          borderRadius: radius.md,
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: text.sm,
          fontWeight: weight.medium,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }
      }, t('dashboard.demoButton'))
    ),

    // ─── Highlight tools — immediate value ──────────────────
    React.createElement('div', {
      style: {
        marginTop: space.lg, marginBottom: space.md,
        padding: '20px 24px',
        background: palette.surface,
        borderRadius: radius.lg - 4,
        border: '1px solid ' + palette.border + '88',
        boxShadow: shadow.sm,
      }
    },
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: space.md }
      },
        React.createElement('div', {
          style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text }
        }, t('dashboard.highlightTitle')),
        React.createElement('div', {
          style: { fontSize: text.xs - 1, color: palette.sage, opacity: 0.8 }
        }, t('dashboard.highlightPrivacy'))
      ),
      (() => {
        const items = [
          { label: t('dashboard.highlightFinanz'), sub: t('dashboard.highlightFinanzSub'), view: 'finanzuebersicht', icon: 'budget', primary: true },
          { label: t('dashboard.highlightTax'), sub: t('dashboard.highlightTaxSub'), view: 'tax', icon: 'money' },
          { label: t('dashboard.highlightIpv'), sub: t('dashboard.highlightIpvSub'), view: 'premium', icon: 'praemienverbilligung' },
          { label: t('dashboard.highlightSozialhilfe'), sub: t('dashboard.highlightSozialhilfeSub'), view: 'sozialhilfe', icon: 'health' },
          { label: t('dashboard.highlightNotfall'), sub: t('dashboard.highlightNotfallSub'), view: 'notfalleinstieg', icon: 'notfall' },
          !demoMode && { label: t('dashboard.demoTitle'), sub: t('dashboard.demoText'), view: '_demo', icon: 'basis', isDemo: true },
        ].filter(Boolean);
        const renderItem = (item) => {
          const IconFn = Icons[item.icon];
          return React.createElement('button', {
            key: item.view,
            onClick: () => item.isDemo ? onEnterDemo() : onNavigate(item.view),
            style: {
              display: 'flex', alignItems: item.primary ? 'flex-start' : 'center', gap: item.primary ? '16px' : '12px',
              padding: item.primary ? '18px 20px' : '12px 14px',
              background: item.primary ? palette.sand + '08' : 'transparent',
              border: '1px solid ' + (item.primary ? palette.sand + '30' : palette.border + '44'),
              borderRadius: radius.md,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              color: palette.text,
              transition: `background ${duration.normal}ms ${ease}, border-color ${duration.normal}ms ${ease}`,
            },
            onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; e.currentTarget.style.borderColor = palette.sand + '66'; },
            onMouseLeave: (e) => { e.currentTarget.style.background = item.primary ? palette.sand + '08' : 'transparent'; e.currentTarget.style.borderColor = item.primary ? palette.sand + '30' : palette.border + '44'; },
          },
            React.createElement('div', {
              style: {
                width: item.primary ? '40px' : '32px', height: item.primary ? '40px' : '32px', borderRadius: item.primary ? radius.md : radius.sm,
                background: palette.sand + (item.primary ? '18' : '0C'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, color: palette.sand,
              }
            }, IconFn ? React.createElement('div', { style: { width: item.primary ? '24px' : '18px', height: item.primary ? '24px' : '18px' } }, IconFn()) : null),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { fontSize: item.primary ? text.body : text.sm, fontWeight: item.primary ? weight.semi : weight.medium } }, item.label),
              React.createElement('div', { style: { fontSize: text.xs - 1, color: palette.mid, marginTop: item.primary ? '4px' : '2px', lineHeight: leading.relaxed } }, item.sub)
            )
          );
        };
        const primary = items.find(i => i.primary);
        const rest = items.filter(i => !i.primary);
        return React.createElement(React.Fragment, null,
          primary && renderItem(primary),
          React.createElement('div', {
            style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: space.xs + 2 + 'px', marginTop: space.sm + 'px' }
          }, rest.map(renderItem))
        );
      })()
    ),

    // ─── Quick check — inline IPV eligibility ───────────────
    React.createElement(QuickCheck, { palette, t, onNavigate }),

    // ─── Maloja Pass — interactive topographic map ─────────
    React.createElement('div', {
      style: { margin: '20px -8px 0 -8px' }
    },
      React.createElement('div', {
        style: {
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          padding: '0 8px ' + space.sm + 'px 8px',
        }
      },
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.mid }
        },
          (() => {
            const started = chapterCompletions.filter(p => p > 0).length;
            const done = chapterCompletions.filter(p => p >= 100).length;
            const total = chapterCompletions.length;
            if (done === total) return t('progress.allDone');
            if (started === 0) return t('progress.notStarted');
            return t('progress.status', { started, done, total });
          })()
        ),
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.sage, fontWeight: weight.medium }
        }, Math.round(completion) + '%')
      )
    ),
    React.createElement('div', {
      style: { margin: '0 -8px 28px -8px', lineHeight: 0, position: 'relative' }
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
        // ─── Swiss landscape easter eggs — appear with progress ───
        // 20%: Tannen (fir trees) at mountain base
        completion >= 20 && React.createElement('g', { key: 'tannen',
          style: { opacity: Math.min(0.6, (completion - 20) / 30), transition: 'opacity 1.5s ease' },
        },
          React.createElement('path', { d: 'M 92 180 L 100 158 L 108 180 Z', fill: palette.sage }),
          React.createElement('path', { d: 'M 108 182 L 114 166 L 120 182 Z', fill: palette.sage }),
          React.createElement('path', { d: 'M 605 175 L 614 150 L 623 175 Z', fill: palette.sage }),
          React.createElement('path', { d: 'M 622 178 L 629 158 L 636 178 Z', fill: palette.sage }),
        ),
        // 35%: Edelweiss near a peak
        completion >= 35 && React.createElement('g', { key: 'edelweiss',
          style: { opacity: Math.min(0.7, (completion - 35) / 20), transition: 'opacity 1.5s ease' },
        },
          React.createElement('circle', { cx: '170', cy: '75', r: '3', fill: 'white' }),
          React.createElement('circle', { cx: '170', cy: '75', r: '1.2', fill: palette.sand }),
          React.createElement('circle', { cx: '562', cy: '82', r: '2.5', fill: 'white' }),
          React.createElement('circle', { cx: '562', cy: '82', r: '1', fill: palette.sand }),
        ),
        // 45%: Gipfelkreuz on a summit
        completion >= 45 && React.createElement('g', { key: 'gipfelkreuz',
          style: { opacity: Math.min(0.5, (completion - 45) / 20), transition: 'opacity 1.5s ease' },
        },
          React.createElement('line', { x1: '510', y1: '10', x2: '510', y2: '24', stroke: palette.mid, strokeWidth: '1.2' }),
          React.createElement('line', { x1: '505', y1: '14', x2: '515', y2: '14', stroke: palette.mid, strokeWidth: '1.2' }),
        ),
        // 55%: Matterhorn silhouette — sharp iconic pyramid
        completion >= 55 && React.createElement('path', { key: 'matterhorn',
          d: 'M 478 30 L 488 6 L 492 14 L 498 30',
          fill: palette.sage,
          style: { opacity: Math.min(0.25, (completion - 55) / 60), transition: 'opacity 1.5s ease' },
        }),
        // 65%: Kuh on the alpine meadow
        completion >= 65 && React.createElement('g', { key: 'kuh',
          style: { opacity: Math.min(0.45, (completion - 65) / 20), transition: 'opacity 1.5s ease' },
        },
          React.createElement('ellipse', { cx: '315', cy: '167', rx: '6', ry: '3.5', fill: palette.sage }),
          React.createElement('ellipse', { cx: '309', cy: '164', rx: '2.5', ry: '2', fill: palette.sage }),
          React.createElement('line', { x1: '311', y1: '170', x2: '311', y2: '175', stroke: palette.sage, strokeWidth: '1' }),
          React.createElement('line', { x1: '319', y1: '170', x2: '319', y2: '175', stroke: palette.sage, strokeWidth: '1' }),
        ),
        // 75%: Swiss watch face
        completion >= 75 && React.createElement('g', { key: 'uhr',
          style: { opacity: Math.min(0.4, (completion - 75) / 15), transition: 'opacity 1.5s ease' },
        },
          React.createElement('circle', { cx: '152', cy: '38', r: '5', fill: 'none', stroke: palette.mid, strokeWidth: '0.8' }),
          React.createElement('circle', { cx: '152', cy: '38', r: '4', fill: 'none', stroke: palette.mid, strokeWidth: '0.3' }),
          React.createElement('line', { x1: '152', y1: '38', x2: '152', y2: '35', stroke: palette.mid, strokeWidth: '0.7' }),
          React.createElement('line', { x1: '152', y1: '38', x2: '154.5', y2: '39', stroke: palette.mid, strokeWidth: '0.5' }),
        ),
        // 85%: Schokolade (Toblerone-shape)
        completion >= 85 && React.createElement('g', { key: 'schoggi',
          style: { opacity: Math.min(0.4, (completion - 85) / 10), transition: 'opacity 1.5s ease' },
        },
          React.createElement('path', { d: 'M 395 172 L 401 162 L 407 172 L 413 162 L 419 172 Z', fill: palette.sand }),
        ),
        // 95%: Sonne (warm sun)
        completion >= 95 && React.createElement('circle', { key: 'sonne',
          cx: '660', cy: '16', r: '12', fill: palette.sand,
          style: { opacity: 0.18, transition: 'opacity 1.5s ease' },
        }),
        // 100%: Swiss flag on highest peak — Ordnung hergestellt
        completion >= 100 && React.createElement('g', { key: 'fahne',
          style: { transition: 'opacity 1s ease' },
        },
          React.createElement('line', { x1: '510', y1: '4', x2: '510', y2: '20', stroke: palette.mid, strokeWidth: '1' }),
          React.createElement('rect', { x: '511', y: '4', width: '10', height: '7', rx: '0.5', fill: '#d42b2b', opacity: 0.6 }),
          React.createElement('path', { d: 'M 514.5 5.5 L 514.5 9.5 M 512.5 7.5 L 516.5 7.5', fill: 'none', stroke: 'white', strokeWidth: '1.2' }),
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
          { x: 8.33, y: 60, key: 'basis' },
          { x: 18.75, y: 46, key: 'wohnen' },
          { x: 31.25, y: 56, key: 'finanzen' },
          { x: 48.6, y: 77.5, key: 'versicherungen' },
          { x: 60.4, y: 74, key: 'ausbildung' },
          { x: 75, y: 39, key: 'behoerden' },
          { x: 92.4, y: 47.5, key: 'notfall' },
        ].map((station, i) => {
          const pct = chapterCompletions[i] || 0;
          const iconKey = chapterIcons[station.key];
          const IconFn = iconKey && Icons[iconKey];

          // Maturity stages: sketch → emerging → maturing → complete
          const maturity = pct === 0 ? 'sketch' : pct < 50 ? 'emerging' : pct < 100 ? 'maturing' : 'complete';
          const sizes = { sketch: 30, emerging: 34, maturing: 38, complete: 40 };
          const iconSizes = { sketch: 18, emerging: 22, maturing: 24, complete: 26 };
          const colors = { sketch: palette.mid, emerging: palette.sand, maturing: palette.sand, complete: palette.sage };
          const opacities = { sketch: 0.65, emerging: 0.8, maturing: 0.9, complete: 1 };
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
            sketch: palette.surface,
            emerging: palette.sand + '08',
            maturing: palette.sand + '12',
            complete: palette.sage + '10',
          };
          const sz = sizes[maturity];
          const iconOp = opacities[maturity];

          const chapterTitle = chapters[i] ? chapters[i].title : station.key;
          const shortLabel = chapterTitle.split(/[\s–—]/)[0];
          return React.createElement('div', {
            key: station.key,
            style: {
              position: 'absolute',
              left: station.x + '%',
              top: station.y + '%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'auto',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
            }
          },
            React.createElement('button', {
              onClick: () => onSelectChapter(i),
              'aria-label': chapterTitle,
              style: {
                width: sz + 'px', height: sz + 'px',
                background: bgs[maturity],
                border: borders[maturity],
                borderRadius: '50%',
                padding: '0',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: colors[maturity],
                opacity: iconOp,
                transition: `all ${duration.cinematic}ms ${ease}`,
                boxShadow: shadows[maturity],
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'scale(1.12)';
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.opacity = String(iconOp);
                e.currentTarget.style.transform = 'scale(1)';
              },
            },
              React.createElement('div', {
                style: { width: iconSizes[maturity] + 'px', height: iconSizes[maturity] + 'px', transition: `width ${duration.cinematic}ms, height ${duration.cinematic}ms` }
              }, IconFn ? IconFn() : null)
            ),
            React.createElement('span', {
              className: 'mountain-label',
              style: {
                fontSize: '9px', color: palette.mid, whiteSpace: 'nowrap',
                opacity: maturity === 'sketch' ? 0.5 : 0.75,
                fontWeight: maturity === 'complete' ? weight.medium : weight.normal,
                transition: `opacity ${duration.cinematic}ms ease`,
              }
            }, shortLabel)
          );
        })
      )
    ),

    // ─── Guided start — calm first-use card ───────────────
    !hasMeaningfulProgress && React.createElement('div', {
      style: {
        marginBottom: space.xl,
        padding: '20px 24px',
        background: palette.surface,
        borderRadius: radius.lg - 4,
        border: '1px solid ' + palette.border + '88',
        boxShadow: shadow.md
      }
    },
      React.createElement('div', {
        style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, marginBottom: space.sm }
      }, t('guidedStart.title')),
      React.createElement('p', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, margin: '0 0 ' + space.sm + 'px 0' }
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
              fontSize: text.sm, color: palette.mid, textAlign: 'left', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: space.sm,
            },
            onMouseEnter: (e) => { e.currentTarget.style.color = palette.text; },
            onMouseLeave: (e) => { e.currentTarget.style.color = palette.mid; },
          },
            React.createElement('span', { style: { color: palette.sage, fontSize: text.xs } }, '→'),
            item.label
          )
        )
      )
    ),

    // ─── MVO — Deine Grundordnung ───────────────────────────
    mvo.total > 0 && React.createElement('div', {
      style: {
        marginBottom: '28px', padding: '20px 24px',
        background: mvo.pct === 100 ? palette.sage + '12' : palette.surface,
        borderRadius: radius.md,
        border: '1px solid ' + (mvo.pct === 100 ? palette.sage + '40' : palette.border + '88'),
        boxShadow: shadow.sm,
        transition: `background ${duration.cinematic}ms ${ease}, border-color ${duration.cinematic}ms ${ease}`,
      }
    },
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: space.sm }
      },
        React.createElement('span', {
          style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text }
        }, t('mvo.title')),
        React.createElement('span', {
          style: { fontSize: text.sm, fontWeight: weight.medium, color: mvo.pct === 100 ? palette.sage : palette.mid }
        }, mvo.filled + '/' + mvo.total)
      ),
      React.createElement('div', {
        style: { width: '100%', height: '4px', background: palette.up, borderRadius: '2px', overflow: 'hidden', marginBottom: space.sm }
      },
        React.createElement('div', {
          style: {
            width: mvo.pct + '%', height: '100%',
            background: mvo.pct === 100 ? palette.sage : palette.sand,
            borderRadius: '2px',
            transition: `width ${duration.cinematic}ms ${ease}`,
          }
        })
      ),
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed }
      }, mvo.pct === 100 ? t('mvo.complete') : mvo.pct === 0 ? t('mvo.empty') : t('mvo.progress'))
    ),

    // ─── Overview — calm editorial section ──────────────────
    React.createElement('div', {
      style: { marginBottom: '28px', padding: '0 2px' }
    },
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed }
      }, completion === 100 ? t('dashboard.progressComplete')
        : completion === 0 ? t('dashboard.progressStart')
        : completion <= 30 ? t('dashboard.progressEarly')
        : completion <= 60 ? t('dashboard.progressMid')
        : t('dashboard.progressLate')),
      lastBackup && React.createElement('div', {
        style: { fontSize: text.xs, color: palette.mid, marginTop: space.sm, opacity: 0.7 }
      }, t('dashboard.lastBackup', { date: lastBackup }))
    ),

    // ─── Export reminder — calm data safety nudge ────────────
    (() => {
      const hasData = chapters.some(ch => {
        const d = data[ch.key] || {};
        return ch.fields.some(f => d[f.k]);
      });
      if (!hasData) return null;
      const lastBackupMs = lastBackupRaw ? new Date(lastBackupRaw).getTime() : 0;
      const daysSince = lastBackupMs ? Math.floor((Date.now() - lastBackupMs) / (1000 * 60 * 60 * 24)) : Infinity;
      if (daysSince <= 7) return null;
      const reason = lastBackupMs === 0 ? t('dashboard.exportReminderNever') : t('dashboard.exportReminderOld');
      return React.createElement('div', {
        style: {
          marginBottom: space.xl,
          padding: '16px 20px',
          background: palette.sageMist || palette.sage + '08',
          borderRadius: radius.md,
          border: '1px solid ' + palette.sage + '25',
        }
      },
        React.createElement('div', {
          style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, marginBottom: '6px' }
        }, reason + ' ' + t('dashboard.exportReminder')),
        React.createElement('button', {
          onClick: () => onNavigate('export'),
          style: {
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontSize: text.sm, color: palette.sageDeep || palette.sage,
            fontFamily: 'inherit', fontWeight: weight.medium,
          }
        }, t('dashboard.exportReminderAction'))
      );
    })(),

    // ─── Fortschrittskarte — visual progress per chapter ─────
    React.createElement(FortschrittsKarte, { palette, t, chapters, chapterCompletions, chapterStatuses, chapterAccentColor, onSelectChapter, text, weight, space, radius, shadow }),

    // ─── Live connections — what user data powers ──────────
    React.createElement(DatenWirken, { palette, t, data, text, weight, space, radius }),

    // ─── Life chapters — tiered spatial layout ──────────────
    React.createElement('div', { style: { marginBottom: space['2xl'] + 'px', marginTop: space['2xl'] + 'px' } },

      // Tier groups: Core (0-2), Supporting (3-4), Protective (5-6)
      ...[
        { label: t('dashboard.tierCore'), indices: [0, 1, 2] },
        { label: t('dashboard.tierSupporting'), indices: [3, 4] },
        { label: t('dashboard.tierProtective'), indices: [5, 6] },
      ].map((tier, tierIdx) =>
        React.createElement('div', {
          key: 'tier-' + tierIdx,
          style: { marginTop: tierIdx === 0 ? '0' : space.xl + 'px' }
        },
          React.createElement('div', {
            style: {
              fontSize: text.xs, fontWeight: weight.medium, color: palette.mid,
              letterSpacing: '0.4px', padding: '0 4px 12px 4px',
              borderBottom: '1px solid ' + palette.border,
            }
          }, tier.label),

          ...tier.indices.map((chIdx) => {
            const ch = chapters[chIdx];
            if (!ch) return null;
            const { pct } = calculateChapterCompletion(ch.key);
            const statusColor = getStatusColor(pct, ch.key);
            const iconKey = chapterIcons[ch.key];
            const IconFn = iconKey && Icons[iconKey];
            const isLastInTier = chIdx === tier.indices[tier.indices.length - 1];
            const rowOpacity = pct === 0 ? 0.72 : 1;
            const status = getChapterStatus(ch);
            const statusColors = { leer: palette.soft, begonnen: palette.sand, grundordnung: palette.sage, vertieft: palette.sage };

            return React.createElement('button', {
              key: ch.key,
              onClick: () => onSelectChapter(chIdx),
              style: {
                display: 'flex', alignItems: 'center', gap: space.md,
                padding: '20px 4px',
                background: 'transparent',
                border: 'none',
                borderBottom: isLastInTier ? 'none' : '1px solid ' + palette.border,
                borderRadius: 0,
                cursor: 'pointer',
                textAlign: 'left',
                color: palette.text,
                fontFamily: 'inherit',
                opacity: rowOpacity,
                transition: `opacity ${duration.cinematic}ms ${ease}`,
                width: '100%',
              },
              onMouseEnter: (e) => { e.currentTarget.style.opacity = '1'; },
              onMouseLeave: (e) => { e.currentTarget.style.opacity = String(rowOpacity); },
            },
              React.createElement('div', {
                style: {
                  width: '40px', height: '40px', borderRadius: radius.md,
                  background: getIconBg(pct, ch.key),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, color: statusColor, opacity: getIconOpacity(pct),
                  transition: `all ${duration.cinematic}ms ${ease}`,
                  boxShadow: pct === 100 ? '0 1px 6px ' + palette.sage + '25' : 'none',
                  border: pct === 100 ? '1px solid ' + palette.sage + '30' : '1px solid transparent',
                  animation: pct === 100 ? 'mp-stamp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
                }
              }, IconFn ? IconFn() : React.createElement('span', { style: { fontSize: text.lg } }, ch.icon)),

              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', {
                  style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: space.sm, marginBottom: '2px' }
                },
                  React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi } }, ch.title),
                  React.createElement('span', {
                    style: {
                      fontSize: text.xs, fontWeight: weight.medium,
                      color: statusColors[status],
                      flexShrink: 0, letterSpacing: '0.2px',
                      transition: `color ${duration.cinematic}ms ${ease}`,
                    }
                  }, t('chapterStatus.' + status))
                ),
                React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, ch.description),
                status !== 'leer' && (() => {
                  const snippet = buildSnippet(ch.key, data[ch.key] || {}, data, t);
                  return snippet ? React.createElement('div', {
                    style: { fontSize: text.xs, color: palette.sageDeep || palette.sage, lineHeight: leading.normal, marginTop: space.xs, fontStyle: 'italic' }
                  }, snippet) : null;
                })(),
              ),
            );
          })
        )
      )
    ),

    // ─── Tips — open editorial section ─────────────────────
    React.createElement('div', {
      style: { padding: '0 2px', marginBottom: space.lg, borderTop: '1px solid ' + palette.border, paddingTop: '20px' }
    },
      React.createElement('h3', {
        style: { fontSize: text.xs, fontWeight: weight.medium, color: palette.soft, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: space.sm + 4 }
      }, t('dashboard.tipsTitle')),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.sm } },
        [t('dashboard.tip1'), t('dashboard.tip2'), t('dashboard.tip3'), t('dashboard.tip4')].map((tip, i) =>
          React.createElement('div', { key: i, style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, display: 'flex', gap: space.sm + 2, alignItems: 'start' } },
            React.createElement('span', { style: { color: palette.sage, fontSize: text.xs, marginTop: '2px', flexShrink: 0 } }, '—'),
            tip
          )
        )
      )
    ),

    // ─── Tools — calm grid ─────────────────────────────────
    React.createElement('div', { style: { marginBottom: '36px' } },
      React.createElement('h2', {
        style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: space.xs }
      }, t('dashboard.toolsAndFeatures')),
      React.createElement('p', {
        style: { fontSize: text.xs, color: palette.soft, margin: '0 0 ' + space.md + 'px 0', lineHeight: leading.normal }
      }, t('dashboard.toolsSubtitle')),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' } },
        [
          { label: t('nav.calendar'), sub: t('nav.sub.calendar'), view: 'calendar', icon: 'kalenderUhr' },
          { label: t('nav.budgetSync'), sub: t('nav.sub.budgetSync'), view: 'sync', icon: 'budgetWallet' },
          { label: t('nav.kvgIpv'), sub: t('nav.sub.kvgIpv'), view: 'premium', icon: 'praemienverbilligung' },
          { label: t('nav.praemien'), sub: t('nav.sub.praemien'), view: 'praemien', icon: 'insurance' },
          { label: t('nav.vorsorge'), sub: t('nav.sub.vorsorge'), view: 'vorsorge', icon: 'vorsorge' },
          { label: t('nav.eo'), sub: t('nav.sub.eo'), view: 'eo', icon: 'family' },
          { label: t('nav.taxes'), sub: t('nav.sub.taxes'), view: 'tax', icon: 'money' },
          { label: t('nav.mindestlohn'), sub: t('nav.sub.mindestlohn'), key: 'mindestlohn', action: () => onSelectChapter(chapters.findIndex(ch => ch.key === 'finanzen')), icon: 'money' },
          { label: t('nav.sozialhilfe'), sub: t('nav.sub.sozialhilfe'), view: 'sozialhilfe', icon: 'health' },
          { label: t('nav.direktlinks'), sub: t('nav.sub.direktlinks'), view: 'direktlinks', icon: 'dokumentTresor' },
          { label: t('nav.tresor'), sub: t('nav.sub.tresor'), view: 'tresor', icon: 'dokumentTresor' },
          { label: t('nav.cv'), sub: t('nav.sub.cv'), view: 'cv', icon: 'lebenslauf' },
          { label: t('nav.unterlagen'), sub: t('nav.sub.unterlagen'), view: 'unterlagen', icon: 'documents' },
        ].map(tool => {
          const IconFn = Icons[tool.icon];
          return React.createElement('button', {
            key: tool.key || tool.view,
            onClick: tool.action || (() => onNavigate(tool.view)),
            style: {
              padding: '14px 16px',
              background: 'transparent',
              color: palette.text,
              border: 'none',
              borderRadius: radius.md,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: space.sm,
              transition: `background ${duration.normal}ms ${ease}`,
              textAlign: 'left',
            },
            onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; },
            onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; },
          },
            React.createElement('div', { style: { color: palette.mid, width: '20px', height: '20px', flexShrink: 0 } },
              IconFn ? React.createElement('div', { style: { width: '20px', height: '20px' } }, IconFn()) : null
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontWeight: weight.medium, fontSize: text.sm } }, tool.label),
              tool.sub ? React.createElement('div', { style: { fontSize: text.xs - 1, color: palette.mid, marginTop: '1px' } }, tool.sub) : null
            )
          );
        })
      )
    ),

    !demoMode && React.createElement(BetaFeedback, { palette, t })
  );
};

export default DashboardComplete;
