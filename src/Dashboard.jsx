import React, { useState } from 'react';
import Icons from './IconKern.jsx';
import { GlossarText } from './GlossarBegriff.jsx';
import { text, weight, leading, space, radius, shadow, ease, duration } from './config/tokens.js';
import { PageTitle, PanelTitle, Eyebrow } from './components/Heading.jsx';
import { getCantonName, calculateIPV, calculateSozialhilfe } from './config/cantonalData.js';
import { loadReminders } from './utils/reminders.js';
import { grundordnung, naechsterSchritt, feldHatWert, kapitelVollstaendigkeit } from './utils/vollstaendigkeit.js';
import { kapitelStatus, astFarben } from './utils/lebensbereichFruechte.js';
import { useT } from './i18n/index.js';
import { aufklappZeichen } from './IconKern.jsx';
import { ABLAEUFE } from './config/ansichtenRegister.js';

// Der räumliche Lebensbaum wird nachgeladen, nicht mitgeliefert: wer auf die
// flache Ansicht stellt, lädt three.js (rund 145 KB gzip) gar nicht erst.
// Standard ist seit 20.09.2026 die räumliche Ansicht — dort fällt das Nachladen
// also beim Öffnen des Dashboards an.

// K18: Mini-Beschriftungen (Baum, Berg, Status-Spalte) dürfen bei langen Wörtern
// silbentrennen statt zu clippen — Kurzlabels lösen die meisten Fälle, das hier
// fängt den Rest ab (Bauliste E20).
const hyphenStyle = { hyphens: 'auto', WebkitHyphens: 'auto', overflowWrap: 'break-word' };
// Lazy: hält die Instrumente (Tacho/Kompass/Tank/Schutzschild + Daten) aus dem
// eager Index-Bundle heraus — das Dashboard lädt sie erst beim Anzeigen nach.
// Inhalt des zugeklappten Abschnitts «Fortschritt im Detail» — siehe BergDetail.jsx.
const BergDetail = React.lazy(() => import('./BergDetail.jsx'));
const InstrumentePanel = React.lazy(() => import('./components/InstrumentePanel.jsx').then(m => ({ default: m.InstrumentePanel })));

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

export const QuickCheck = ({ palette, t, onNavigate, data }) => {
  const [income, setIncome] = useState(data?.finanzen?.monthlyIncome || '');
  const annual = (Number(income) || 0) * 12;
  const canton = data?.basis?.canton;
  const fmt = (v) => v.toLocaleString('de-CH');

  // Ein Einkommen → mehrere Leistungen (Basel-Stadt-Leistungsrechner als Vorbild).
  // Nur POSITIVE, logisch gedeckte Hinweise, nie ein „Nein"-Verdikt (Würde). Die
  // Berechnung ist dieselbe wie in den vollständigen Tools (calculateIPV/
  // calculateSozialhilfe), damit Schnellcheck und Rechner nie widersprechen.
  const probe = { ...data, finanzen: { ...(data?.finanzen || {}), monthlyIncome: income } };
  const benefits = [];
  try {
    // IPV: kantonal, einkommensgetrieben. Ohne Kanton kein erfundener Betrag.
    const ipv = (annual > 0 && canton) ? calculateIPV(probe) : null;
    // E9: ohne amtlich belegten Kanton kein Betrag, nur die Orientierung.
    // B-1/E22: das hier eingetippte Einkommen geht an den IPV-Rechner mit (nicht ins Profil).
    if (ipv && ipv.anspruchMoeglich) benefits.push({
      key: 'ipv', view: 'premium', label: t('dashboard.quickCheckIpv'), color: palette.sky,
      uebergabe: { schnellcheck: { monthlyIncome: Number(income) } },
      monthly: ipv.amount,
      detail: ipv.eligible ? t('dashboard.quickCheckResult', { income: fmt(annual), amount: fmt(ipv.annual) }) : t(ipv.noteKey),
    });
    // Sozialhilfe: nur zeigen, wenn Mietkontext vorhanden (sonst wäre der Bedarf
    // unvollständig) UND Bedarf ungedeckt UND kein Vermögen über dem Freibetrag —
    // sonst wäre ein „Anspruch möglich" unehrlich.
    const rentContext = Number(data?.wohnen?.rentAmount || 0) > 0;
    if (annual > 0 && rentContext) {
      const sh = calculateSozialhilfe(probe);
      if (sh?.eligible && (sh?.vermoegenUeberFreibetrag || 0) === 0) benefits.push({
        key: 'soz', view: 'sozialhilfe', label: t('nav.sozialhilfe'), color: palette.sage,
        monthly: sh.deficit,
        // R4: Freibetrag kantonal nicht bestätigt → leise mitsagen.
        detail: t('dashboard.anspruchMoeglich') + (sh.vfbUnbestaetigt ? ' · ' + t('sozialhilfe.assetLimitUnconfirmedShort') : ''),
      });
    }
  } catch { /* Orientierung, nie blockierend */ }

  // Schlanke Total-Leiste (Flat-Viz, konsistent mit der Vollansicht #/schnellcheck):
  // summiert nur die monetären Leistungen zu einer geschätzten Monats-Entlastung.
  const monetary = benefits.filter(b => b.monthly > 0);
  const totalMonthly = monetary.reduce((sum, b) => sum + b.monthly, 0);
  const miniBar = monetary.length > 0 && React.createElement('div', { style: { marginBottom: space.sm } },
    React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: '4px' } },
      '≈ CHF ' + fmt(totalMonthly) + ' / ' + t('schnellcheck.monat')),
    React.createElement('div', { style: { display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: palette.up } },
      monetary.map(b => React.createElement('div', {
        key: b.key,
        style: { width: (totalMonthly > 0 ? b.monthly / totalMonthly * 100 : 0).toFixed(1) + '%', background: b.color },
      })))
  );

  const row = (b) => React.createElement('button', {
    key: b.key,
    onClick: () => onNavigate(b.view, undefined, b.uebergabe),
    style: {
      display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
      padding: '10px 14px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
      background: palette.sage + '10', color: palette.text,
      border: '1px solid ' + palette.sage + '30', borderRadius: radius.sm,
      transition: `background ${duration.normal}ms ${ease}`,
    },
    onMouseEnter: (e) => { e.currentTarget.style.background = palette.sage + '1e'; },
    onMouseLeave: (e) => { e.currentTarget.style.background = palette.sage + '10'; },
  },
    React.createElement('div', { style: { minWidth: 0, flex: 1 } },
      React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.sageDeep || palette.sage } }, b.label),
      React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } }, b.detail)
    )
  );

  return React.createElement('div', {
    style: {
      marginTop: space.md, marginBottom: space.lg,
      padding: '20px 24px',
      background: palette.up,
      borderRadius: radius.md,
    }
  },
    React.createElement('div', {
      style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: space.sm }
    }, t('dashboard.quickCheckTitle')),
    React.createElement('label', { style: { display: 'block', maxWidth: '260px' } },
      React.createElement('span', {
        style: { fontSize: text.xs, color: palette.mid, display: 'block', marginBottom: space.xs }
      }, t('dashboard.quickCheckIncome')),
      React.createElement('input', {
        type: 'number',
        inputMode: 'numeric',
        placeholder: t('dashboard.quickCheckPlaceholder'),
        'aria-label': t('dashboard.quickCheckIncome'),
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
    annual > 0 && React.createElement('div', { style: { marginTop: space.md } },
      benefits.length > 0
        ? React.createElement('div', null,
            React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm } }, t('dashboard.quickCheckWithIncome')),
            miniBar || null,
            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.xs + 'px' } }, benefits.map(row))
          )
        : React.createElement('div', {
            style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed }
          }, !canton ? t('dashboard.quickCheckHint') : t('dashboard.quickCheckNoResult')),
      // Kanton-Caveat nur, wenn nicht schon der No-Result-Zweig denselben Hinweis
      // zeigt (kein Kanton → Hinweis steht bereits oben; keine Doppelung).
      (benefits.length > 0 || canton) && React.createElement('div', {
        style: { fontSize: text.xs - 1, color: palette.mid, marginTop: space.sm }
      }, t('dashboard.quickCheckHint'))
    ),
    // Zum vollständigen Leistungs-Schnellcheck (eigene Ansicht, mehr Angaben + Tacho)
    React.createElement('button', {
      onClick: () => onNavigate('schnellcheck'),
      style: {
        // 8 px Polsterung hebt das Ziel von 17 auf 33 px (WCAG 2.2 AA: 24x24);
        // marginTop ist um dieselben 8 px gekürzt, das Bild bleibt gleich.
        background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0',
        fontSize: text.xs, color: palette.sandDeep, fontFamily: 'inherit',
        fontWeight: weight.medium, marginTop: space.sm,
      }
    }, t('dashboard.quickCheckAllLeistungen'))
  );
};

const AlphaBanner = ({ palette, t, onDismiss }) =>
  React.createElement('div', {
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
      React.createElement('div', { role: 'status', style: { flex: 1 } },
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
          background: 'none', border: 'none', cursor: 'pointer',
          color: palette.mid, fontSize: text.body, lineHeight: 1, flexShrink: 0,
          width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
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
      }, t('beta.feedback.title'))
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
        value: q3, onChange: (e) => setQ3(e.target.value), 'aria-label': t('beta.feedback.q3'),
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

// Merged status surface: progress sentence + last backup + active "Daten wirken" chips
export const DashboardComplete = ({ palette, t, chapters, data, onSelectChapter, completion, onNavigate, demoMode, onEnterDemo, simpleView, isDarkMode }) => {
  const { lang } = useT(); // K18: für hyphens/lang an den Mini-Beschriftungen (Baum/Berg/Status).

  // E17: «trifft nicht zu» zählt als erledigt — eine Quelle (utils/vollstaendigkeit.js).
  const mvo = grundordnung(chapters, data);

  // Kapitel-Zustand und Ast-Farbe teilt sich das Dashboard mit dem Lebensbaum,
  // der seit 21.09. auf der Finanz-Übersicht steht — eine Quelle, zwei Orte.
  const getChapterStatus = (chapter) => kapitelStatus(chapter, data[chapter.key]);

  const chapterAccentColor = astFarben(chapters, palette, isDarkMode);

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

  const chapterCompletions = chapters.map(ch => kapitelVollstaendigkeit(ch, data[ch.key]).pct);

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

  let lastBackupRaw = null;
  try { lastBackupRaw = localStorage.getItem('or5_lastBackup'); } catch { /* Storage blockiert (Privat-Modus) — Render darf nicht crashen */ }
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

    // ─── Welcome area ──────────────────────────────────────
    // Der Anspruch (dashboard.welcome) steht immer — er ist die Identität der Seite.
    // Die Leistungs-Zeile darunter beantwortet "Was ist das hier?" und hilft genau
    // einmal: beim ersten Mal. Wer schon Daten erfasst hat, bekommt sie nicht mehr
    // bei jedem Öffnen vorgesetzt. Gemessen am Handy (390x844): sie kostet 123 px
    // einer Bildschirmseite, die nur 619 px hoch ist — ohne sie kommt der Berg mit
    // dem Fortschritt über den Falz. Weggenommen wird nichts: für neue Nutzerinnen
    // und Nutzer steht sie unverändert da.
    // (Suchmaschinen sehen diesen Text ohnehin nie — sie kommen nicht hinter das
    // BetaGate; die indexierten Texte kommen aus scripts/build-seiten.mjs.)
    React.createElement('div', { style: { marginBottom: '0', paddingTop: '8px' } },
      React.createElement(PageTitle, {
        palette,
        style: { margin: '0 0 8px 0', lineHeight: leading.tight, letterSpacing: '-0.3px' }
      }, t('dashboard.welcome')),
      !hasMeaningfulProgress && React.createElement('p', {
        style: { fontSize: text.body, color: palette.mid, margin: 0, lineHeight: leading.relaxed }
      }, React.createElement(GlossarText, { t, palette }, t('dashboard.tagline') + ' ' + t('dashboard.taglineBenefit'))),

      null
    ),

    // ─── Alpha banner — UNTER dem Hero: erst das Versprechen, dann der ruhige
    // Entwicklungs-Hinweis (auf Handy stand die Warnung sonst vor dem Nutzen). ──
    !alphaDismissed && React.createElement('div', { style: { marginTop: '20px' } },
      React.createElement(AlphaBanner, {
        palette, t, onDismiss: () => setAlphaDismissed(true)
      })
    ),

    // ─── Was ist jetzt dran? — ein leitender nächster Schritt + ruhiger Glance ──
    // Führt oben sanft zum EINEN nächsten Schritt (erster offener Grundordnungs-
    // Punkt) und zeigt einen TWINT-artigen Glance (nächste Frist · zuletzt gesichert).
    // Weniger Farbe, klare Hierarchie (Prinzipien von Stebler Studios): neutraler Grund statt
    // Marken-Tönung; die nächste Aktion ist der Hero (kleiner Bereichs-Punkt als
    // A11y-Identität, nicht laute Fläche); die Aktion ist randlos, Fläche kommt erst
    // im Hover zurück; der Glance wird EINE ruhige tertiäre Zeile mit Dot-Separator.
    // data-tour: der Rundgang endet hier (Tester-Rückmeldung 24.09.: «ok und jetzt…?»).
    React.createElement('div', {
      'data-tour': 'naechster-schritt',
      style: {
        marginTop: space.lg + 'px', padding: space.md + 'px ' + space.lg + 'px',
        background: palette.surface, border: '1px solid ' + palette.border,
        borderRadius: radius.md,
      },
    },
      React.createElement(PanelTitle, {
        palette,
        style: { fontSize: text.xs, fontWeight: weight.normal, color: palette.soft, marginBottom: space.sm + 'px' },
      }, t('dashboard.nextUpTitle')),
      (() => {
        const nextField = naechsterSchritt(chapters, data);
        if (nextField) {
          const dotColor = chapterAccentColor[chapters[nextField.chapterIdx].key] || palette.sage;
          return React.createElement('button', {
            onClick: () => onSelectChapter(nextField.chapterIdx),
            'aria-label': nextField.label + ' — ' + nextField.chapterTitle,
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.md + 'px',
              width: '100%', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer',
              padding: space.sm + 'px ' + space.xs + 'px', background: 'transparent',
              border: 'none', borderRadius: radius.sm, color: palette.text,
              transition: 'background 160ms ease',
            },
            onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; },
            onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; },
          },
            React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', minWidth: 0 } },
              React.createElement('span', { style: { width: '9px', height: '9px', borderRadius: '50%', background: dotColor, flexShrink: 0 } }),
              React.createElement('span', { style: { display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 } },
                React.createElement('span', { style: { fontSize: text.lg, fontWeight: weight.medium, lineHeight: 1.25 } }, nextField.label),
                React.createElement('span', { style: { fontSize: text.xs, color: palette.mid } }, nextField.chapterTitle),
              ),
            ),
          );
        }
        return React.createElement('p', {
          style: { fontSize: text.sm, color: palette.sageDeep, margin: 0, fontWeight: weight.medium },
        }, t('dashboard.nextUpAllDone'));
      })(),
      mvo.fields.some((f) => !f.done) && React.createElement('p', {
        style: { fontSize: text.xs, color: palette.soft, margin: space.xs + 'px 0 0', lineHeight: leading.normal },
      }, t('dashboard.nextUpReassure')),
      (() => {
        const reminders = loadReminders();
        const today = new Date().toISOString().split('T')[0];
        const upcoming = reminders
          .filter((r) => !r.done && r.dueDate && r.dueDate >= today)
          .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
        const fmt = (iso) => { try { return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }); } catch { return iso; } };
        const dot = React.createElement('span', { style: { color: palette.border, margin: '0 ' + space.xs + 'px' }, 'aria-hidden': 'true' }, '·');
        const part = (label, value) => React.createElement('span', null,
          React.createElement('span', { style: { color: palette.soft } }, label + ' '),
          React.createElement('span', { style: { color: palette.mid, fontWeight: weight.medium } }, value),
        );
        return React.createElement('div', {
          style: { marginTop: space.sm + 'px', paddingTop: space.sm + 'px', borderTop: '1px solid ' + palette.border + '55', fontSize: text.xs, color: palette.soft },
        },
          part(t('dashboard.glanceDeadline'), upcoming ? (upcoming.title + ' · ' + fmt(upcoming.dueDate)) : t('dashboard.glanceNoDeadline')),
          dot,
          part(t('dashboard.glanceSaved'), lastBackup || t('dashboard.glanceNeverSaved')),
        );
      })()
    ),

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
        // Prozentzahl erst ab spürbarem Fortschritt (≥10%) zeigen — eine einsame
        // „1%" am Anfang liest sich als „im Rückstand" und widerspricht der Ruhe.
        // Bis dahin trägt die Status-Zeile links die Orientierung.
        Math.round(completion) >= 10 && React.createElement('div', {
          style: { fontSize: text.xs, color: palette.sageDeep, fontWeight: weight.medium }
        }, Math.round(completion) + '%')
      )
    ),
    React.createElement('div', {
      'data-tour': 'berge',
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
          style: { opacity: 0.11 + (completion / 100) * 0.07, transition: 'opacity 1.2s ease' },
        }),
        // Mid peaks
        React.createElement('path', {
          d: 'M 0 200 L 0 140 L 40 125 L 70 95 L 95 78 L 115 85 L 140 62 L 165 48 L 185 55 L 210 72 L 240 58 L 260 45 L 275 55 L 295 75 L 320 100 L 345 115 L 370 125 L 395 120 L 415 128 L 435 118 L 455 100 L 475 80 L 495 62 L 515 48 L 535 55 L 555 72 L 575 85 L 600 95 L 625 90 L 650 78 L 670 68 L 695 80 L 720 100 L 720 200 Z',
          fill: palette.sage,
          style: { opacity: 0.17 + (completion / 100) * 0.09, transition: 'opacity 1.2s ease' },
        }),
        // Front range with pass saddle
        React.createElement('path', {
          d: 'M 0 200 L 0 155 L 35 142 L 60 120 L 90 105 L 110 110 L 135 92 L 155 80 L 175 88 L 200 100 L 225 112 L 260 130 L 290 142 L 320 150 L 350 155 L 380 158 L 410 155 L 435 148 L 455 135 L 475 118 L 498 100 L 520 85 L 540 78 L 560 88 L 585 102 L 610 115 L 640 108 L 665 95 L 690 105 L 720 120 L 720 200 Z',
          fill: palette.sage,
          style: { opacity: 0.27 + (completion / 100) * 0.10, transition: 'opacity 1.2s ease' },
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
          // K18: Kurzlabel aus i18n, sonst wie bisher das erste Wort des Titels.
          const shortLabel = (chapters[i] && chapters[i].short) || chapterTitle.split(/[\s–—]/)[0];
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
                e.currentTarget.style.transform = 'scale(1.04)';
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
              lang,
              style: {
                // lineHeight explizit setzen: der Berg-Wrapper (weiter oben, 'data-tour': 'berge')
                // erzwingt lineHeight:0 gegen den Leerraum unters SVG — das erbt sich sonst auf
                // dieses Label und liesse zweizeilig getrennte Wörter übereinanderfallen.
                // K41: `mid` bei 0.5/0.75 Deckkraft auf der Berg-SVG (bis zu 3 gestapelte
                // sage-Lagen) mass gemessen 1.6–3.8:1 — unter AA (4.5:1), hell UND dunkel,
                // Farbenblind-Palette eingeschlossen. Fix: volle Deckkraft auf einer eigenen,
                // undurchsichtigen Fläche (= palette.surface, dieselbe Fläche wie die Karte)
                // statt auf der variablen Bergfläche — dafür trägt `mid` laut Konstanten-
                // Kommentar ≥4.5:1. Gemessen danach: hell 5.94:1 / dunkel 5.47:1, unverändert
                // durch den Farbenblind-Modus (der lässt mid und surface unangetastet).
                // «Noch nicht begonnen» bleibt erkennbar — jetzt über Kursiv (Form), nicht
                // mehr über reduzierte Deckkraft (Farbe allein wäre kein a11y-taugliches Signal).
                fontSize: text.xs, lineHeight: 1.15, color: palette.mid, maxWidth: '76px', textAlign: 'center',
                background: palette.surface,
                padding: '1px 5px',
                borderRadius: radius.sm,
                fontStyle: maturity === 'sketch' ? 'italic' : 'normal',
                fontWeight: maturity === 'complete' ? weight.medium : weight.normal,
                transition: `background ${duration.cinematic}ms ease`,
                ...hyphenStyle,
              }
            }, shortLabel)
          );
        })
      )
    ),

    // ─── Berg-Detail — Fortschritt & Grundordnung (Schicht 1) ──
    React.createElement('details', { style: { margin: '0 0 ' + space.xl + 'px 0' } },
      React.createElement('summary', {
        style: { cursor: 'pointer', fontSize: text.sm, fontWeight: weight.medium, color: palette.mid, padding: space.sm + 'px 0', letterSpacing: '0.2px' }
      }, t('dashboard.detailProgress')),
      React.createElement('div', { style: { marginTop: space.md + 'px', display: 'flex', flexDirection: 'column', gap: space.lg + 'px' } },
        // Inhalt nachgeladen (E36): beim ersten Bild ist der Abschnitt zu, also unsichtbar.
        React.createElement(React.Suspense, { fallback: null },
          React.createElement(BergDetail, { palette, t, chapters, chapterCompletions, chapterStatuses, chapterAccentColor, onSelectChapter, lang, mvo })
        ),
      )
    ),
    // ─── Highlight tools — immediate value (first for new users) ──
    React.createElement('div', {
      style: {
        marginTop: space.lg, marginBottom: space.md,
        padding: '20px 24px',
        background: palette.surface,
        borderRadius: radius.lg - 4,
        border: '1px solid ' + palette.border + '88',
      }
    },
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: space.md }
      },
        React.createElement(PanelTitle, {
          palette,
          style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text }
        }, t('dashboard.highlightTitle')),
        React.createElement('div', {
          // kein opacity: 0.8 druckte sageDeep von 6.04 auf 3.85:1 (hell)
          style: { fontSize: text.xs - 1, color: palette.sageDeep }
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
            onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; e.currentTarget.style.borderColor = item.primary ? palette.sand + '66' : palette.border + '99'; },
            onMouseLeave: (e) => { e.currentTarget.style.background = item.primary ? palette.sand + '08' : 'transparent'; e.currentTarget.style.borderColor = item.primary ? palette.sand + '30' : palette.border + '44'; },
          },
            // Akzentfarbe (Sand) nur auf der EINEN Primär-Aktion; Sekundär-Werkzeuge
            // neutral, damit Farbe Hierarchie schafft statt sich zu verteilen (Stebler Studios).
            React.createElement('div', {
              style: {
                width: item.primary ? '40px' : '32px', height: item.primary ? '40px' : '32px', borderRadius: item.primary ? radius.md : radius.sm,
                background: item.primary ? palette.sand + '18' : palette.up,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, color: item.primary ? palette.sand : palette.mid,
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
      })(),
      // Sanfte Erst-Schritte — eingefaltet in die Highlight-Box (nur neue Nutzer)
      !hasMeaningfulProgress && React.createElement('div', {
        style: { marginTop: space.md + 'px', paddingTop: space.md + 'px', borderTop: '1px solid ' + palette.border + '44' }
      },
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.mid, marginBottom: space.xs + 'px', fontWeight: weight.medium }
        }, t('guidedStart.title')),
        React.createElement('div', {
          style: { display: 'flex', flexWrap: 'wrap', gap: space.md + 'px' }
        },
          gentleStartActions.map((item) =>
            React.createElement('button', {
              key: item.label,
              onClick: item.action,
              style: {
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
                fontSize: text.sm, color: palette.sageDeep || palette.sage, textAlign: 'left', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: space.xs + 'px',
              },
              onMouseEnter: (e) => { e.currentTarget.style.opacity = '0.7'; },
              onMouseLeave: (e) => { e.currentTarget.style.opacity = '1'; },
            },
              item.label
            )
          )
        )
      )
    ),

    // ─── Life chapters — moved up: the core action, immediately visible ──
    React.createElement('div', { style: { marginBottom: space['2xl'] + 'px', marginTop: space.xl + 'px' } },

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
          // Die Kapitel-Sektion hat keinen eigenen Titel — die drei Tier-Labels
          // («Ihr Alltag» …) sind ihre einzige Gliederung. Als h3 werden sie zur
          // Sprungmarke, statt nur fett auszusehen.
          React.createElement(PanelTitle, {
            palette,
            style: {
              fontSize: text.xs, fontWeight: weight.medium, color: palette.mid,
              letterSpacing: '0.4px', padding: '0 4px 12px 4px',
              borderBottom: '1px solid ' + palette.border,
            }
          }, tier.label),

          ...tier.indices.map((chIdx) => {
            const ch = chapters[chIdx];
            if (!ch) return null;
            const { pct } = kapitelVollstaendigkeit(ch, data[ch.key]);
            const statusColor = getStatusColor(pct, ch.key);
            const iconKey = chapterIcons[ch.key];
            const IconFn = iconKey && Icons[iconKey];
            const isLastInTier = chIdx === tier.indices[tier.indices.length - 1];
            const rowOpacity = pct === 0 ? 0.72 : 1;
            const status = getChapterStatus(ch);
            // Deep-Varianten: als 13px-Statustext brauchen sand/sage ≥4.5:1 (roh: 2.34 / 4.34).
            const statusColors = { leer: palette.soft, begonnen: palette.sandDeep, grundordnung: palette.sageDeep, vertieft: palette.sageDeep };

            return React.createElement('button', {
              key: ch.key,
              onClick: () => onSelectChapter(chIdx),
              style: {
                display: 'flex', alignItems: 'center', gap: space.md,
                padding: simpleView ? '26px 4px' : '20px 4px',
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
                  width: simpleView ? '56px' : '40px', height: simpleView ? '56px' : '40px', borderRadius: radius.md,
                  background: getIconBg(pct, ch.key),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, color: statusColor, opacity: getIconOpacity(pct),
                  transition: `all ${duration.cinematic}ms ${ease}`,
                  boxShadow: pct === 100 ? '0 1px 6px ' + palette.sage + '25' : 'none',
                  border: pct === 100 ? '1px solid ' + palette.sage + '30' : '1px solid transparent',
                  animation: pct === 100 ? 'mp-stamp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
                }
              }, IconFn ? React.createElement('div', { style: { width: simpleView ? '34px' : '24px', height: simpleView ? '34px' : '24px' } }, IconFn()) : React.createElement('span', { style: { fontSize: text.lg } }, ch.icon)),

              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', {
                  style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: space.sm, marginBottom: '2px' }
                },
                  React.createElement('div', { style: { fontSize: simpleView ? text.lg : text.body, fontWeight: weight.semi } }, ch.title),
                  !simpleView && React.createElement('span', {
                    style: {
                      fontSize: text.xs, fontWeight: weight.medium,
                      color: statusColors[status],
                      flexShrink: 0, letterSpacing: '0.2px',
                      transition: `color ${duration.cinematic}ms ${ease}`,
                    }
                  }, t('chapterStatus.' + status))
                ),
                !simpleView && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, ch.description),
                !simpleView && status !== 'leer' && (() => {
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

    // Zugang zum Lebens-Obstgarten — ruhige, sichtbare Einladung direkt unter dem
    // Einzelbaum (beide bleiben nebeneinander). Kontrast: Vordergrund-Akzent via
    // sandDeep statt sand (sand ist im Hellmodus zu hell für Text/Symbol, 2.34:1).
    React.createElement('button', {
      onClick: () => onNavigate('obstgarten'),
      'aria-label': t('obstgarten.link'),
      style: {
        display: 'flex', alignItems: 'center', gap: space.sm + 'px',
        width: '100%', textAlign: 'left', margin: '0 0 ' + space.xl + 'px',
        padding: space.sm + 'px ' + space.md + 'px',
        background: palette.sage + '08', border: '1px solid ' + palette.sage + '20',
        borderRadius: radius.md, cursor: 'pointer', fontFamily: 'inherit',
        transition: `background ${duration.normal}ms ${ease}`,
      },
    },
      React.createElement('span', {
        style: {
          width: '34px', height: '34px', borderRadius: '50%',
          background: palette.sage + '18', color: palette.sageDeep,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        },
      }, React.createElement('div', { style: { width: '18px', height: '18px' } }, Icons.leaf())),
      React.createElement('span', { style: { flex: 1, minWidth: 0 } },
        React.createElement('span', {
          style: { display: 'block', fontSize: text.body, fontWeight: weight.semi, color: palette.text },
        }, t('obstgarten.link')),
        React.createElement('span', {
          style: { display: 'block', fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginTop: '1px' },
        }, t('obstgarten.ctaSub')),
      ),
    ),

    // Zugang zum Gepäck — Lebensereignisse als Ausrüstung, neben Baum und Obstgarten.
    React.createElement('button', {
      onClick: () => onNavigate('gepaeck'),
      'aria-label': t('gepaeck.link'),
      style: {
        display: 'flex', alignItems: 'center', gap: space.sm + 'px',
        width: '100%', textAlign: 'left', margin: '0 0 ' + space.xl + 'px',
        padding: space.sm + 'px ' + space.md + 'px',
        background: palette.gold + '10', border: '1px solid ' + palette.gold + '2e',
        borderRadius: radius.md, cursor: 'pointer', fontFamily: 'inherit',
        transition: `background ${duration.normal}ms ${ease}`,
      },
    },
      React.createElement('span', {
        style: {
          width: '34px', height: '34px', borderRadius: '50%',
          background: palette.gold + '22', color: palette.sandDeep,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        },
      }, React.createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
        React.createElement('path', { d: 'M6 8a6 6 0 0 1 12 0v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z' }),
        React.createElement('path', { d: 'M9 8a3 3 0 0 1 6 0' }),
        React.createElement('path', { d: 'M9 14h6' }))),
      React.createElement('span', { style: { flex: 1, minWidth: 0 } },
        React.createElement('span', {
          style: { display: 'block', fontSize: text.body, fontWeight: weight.semi, color: palette.text },
        }, t('gepaeck.link')),
        React.createElement('span', {
          style: { display: 'block', fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginTop: '1px' },
        }, t('gepaeck.ctaSub')),
      ),
    ),

    // ─── Was steht mir zu? — Schicht 4 (Orientierung, kein Verdikt) ──
    React.createElement('div', { 'data-tour': 'anspruch', style: { marginBottom: space.xl + 'px' } },
      React.createElement(PanelTitle, {
        palette,
        style: { margin: '0 0 ' + space.xs + 'px 0', letterSpacing: '-0.2px' }
      }, t('dashboard.anspruchTitle')),
      React.createElement('p', {
        style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', lineHeight: leading.relaxed }
      }, t('dashboard.anspruchIntro')),
      React.createElement(QuickCheck, { palette, t, onNavigate, data }),
      (() => {
        // Anspruchs-Matrix — nur ein *positiver, ermutigender* Hinweis „Anspruch
        // möglich", und ausschliesslich dort, wo echte Logik dahintersteht
        // (IPV, Sozialhilfe). Nie ein „Nein"/Verdikt (Würde, kein Scham-Signal),
        // keine erfundenen Status. Streng gegated auf selbst eingetragene Angaben.
        const incomeEntered = data?.finanzen?.monthlyIncome !== undefined
          && data?.finanzen?.monthlyIncome !== null
          && String(data.finanzen.monthlyIncome).trim() !== '';
        const canton = data?.basis?.canton;
        let ipvHint = false, sozialhilfeHint = false;
        try {
          if (incomeEntered && canton) {
            ipvHint = !!calculateIPV(data)?.anspruchMoeglich;
          }
          if (incomeEntered) {
            const sh = calculateSozialhilfe(data);
            // Nur wenn Bedarf gedeckt UND kein Vermögen über dem Freibetrag,
            // damit der Hinweis ehrlich bleibt (Vermögen ginge sonst vor).
            sozialhilfeHint = !!sh?.eligible && (sh?.vermoegenUeberFreibetrag || 0) === 0;
          }
        } catch { /* Orientierung, nie blockierend */ }
        return React.createElement('div', {
        style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: space.xs + 2 + 'px', marginTop: space.sm + 'px' }
      },
        [
          { label: t('nav.sozialhilfe'), sub: t('nav.sub.sozialhilfe'), view: 'sozialhilfe', icon: 'health', hint: sozialhilfeHint },
          { label: t('nav.praemien'), sub: t('nav.sub.praemien'), view: 'praemien', icon: 'insurance', hint: ipvHint },
          { label: t('nav.stipendien'), sub: t('nav.sub.stipendien'), view: 'stipendien', icon: 'ausbildung' },
          { label: t('nav.alv'), sub: t('nav.sub.alv'), view: 'alv', icon: 'family' },
          { label: t('nav.eo'), sub: t('nav.sub.eo'), view: 'eo', icon: 'family' },
        ].map(item => {
          const IconFn = Icons[item.icon];
          return React.createElement('button', {
            key: item.view,
            onClick: () => onNavigate(item.view),
            style: {
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 14px', background: 'transparent',
              border: '1px solid ' + palette.border + '44', borderRadius: radius.md,
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', color: palette.text,
              transition: `background ${duration.normal}ms ${ease}, border-color ${duration.normal}ms ${ease}`,
            },
            onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; e.currentTarget.style.borderColor = palette.sage + '55'; },
            onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = palette.border + '44'; },
          },
            React.createElement('div', { style: { width: '20px', height: '20px', flexShrink: 0, color: palette.sage } }, IconFn ? React.createElement('div', { style: { width: '20px', height: '20px' } }, IconFn()) : null),
            React.createElement('div', { style: { minWidth: 0 } },
              React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.medium } }, item.label),
              React.createElement('div', { style: { fontSize: text.xs - 1, color: palette.mid, marginTop: '1px' } }, item.sub),
              // Positiver Anspruchs-Hinweis als leise Zeile in der Textspalte —
              // kein rechtsbündiges Pill (kollidiert in schmalen Karten mit
              // umbrechenden Labels), ruhig statt plakativ.
              item.hint && React.createElement('div', {
                style: { fontSize: text.xs - 1, fontWeight: weight.semi, color: palette.sageDeep || palette.sage, marginTop: '3px' }
              }, '· ' + t('dashboard.anspruchMoeglich'))
            )
          );
        })
      );
      })(),
      React.createElement('button', {
        onClick: () => onNavigate('ansprueche'),
        style: {
          // Zwei gestapelte Text-Aktionen, je 19 px hoch. Polsterung hebt sie auf 35 px;
          // die marginTop sind um dieselben 8 px gekürzt, damit der Abstand gleich bleibt.
          display: 'block', marginTop: space.sm, background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px 0', fontSize: text.sm, color: palette.sageDeep || palette.sage, fontFamily: 'inherit', fontWeight: weight.medium,
        },
      }, t('dashboard.anspruchAlleLink')),
      React.createElement('button', {
        onClick: () => onNavigate('situationen'),
        style: {
          display: 'block', marginTop: 0, background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px 0', fontSize: text.sm, color: palette.sageDeep || palette.sage, fontFamily: 'inherit', fontWeight: weight.medium,
        },
      }, t('lebenszustaende.dashboardLink'))
    ),

    // ─── Deine Instrumente — Dashboard-Spiegel der vier Selbstchecks ──
    // Eigene Suspense-Grenze, da das Dashboard selbst ohne Suspense gerendert wird.
    React.createElement(React.Suspense, { fallback: null },
      React.createElement(InstrumentePanel, { palette, t, data, onNavigate })),

    // ─── Tools — calm grid ─────────────────────────────────
    React.createElement('div', { style: { marginBottom: '36px' } },
      React.createElement(Eyebrow, {
        palette, as: 'h3',
        style: { marginBottom: space.xs }
      }, t('dashboard.toolsAndFeatures')),
      React.createElement('p', {
        style: { fontSize: text.xs, color: palette.soft, margin: '0 0 ' + space.md + 'px 0', lineHeight: leading.normal }
      }, t('dashboard.toolsSubtitle')),
      (() => {
        const renderTool = (tool) => {
          const IconFn = Icons[tool.icon];
          const iconPx = simpleView ? '40px' : '20px';
          return React.createElement('button', {
            key: tool.key || tool.view,
            onClick: tool.action || (() => onNavigate(tool.view)),
            style: {
              padding: simpleView ? '18px 12px' : '14px 16px',
              background: 'transparent', color: palette.text,
              border: simpleView ? '1px solid ' + palette.border : 'none',
              borderRadius: radius.md, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: simpleView ? 'column' : 'row',
              alignItems: 'center', justifyContent: simpleView ? 'flex-start' : undefined,
              gap: simpleView ? '10px' : space.sm,
              transition: `background ${duration.normal}ms ${ease}`,
              textAlign: simpleView ? 'center' : 'left',
            },
            onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; },
            onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; },
          },
            React.createElement('div', { style: { color: simpleView ? palette.sand : palette.mid, width: iconPx, height: iconPx, flexShrink: 0 } },
              IconFn ? React.createElement('div', { style: { width: iconPx, height: iconPx } }, IconFn()) : null
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontWeight: simpleView ? weight.semi : weight.medium, fontSize: simpleView ? text.body : text.sm } }, tool.label),
              (tool.sub && !simpleView) ? React.createElement('div', { style: { fontSize: text.xs - 1, color: palette.mid, marginTop: '1px' } }, tool.sub) : null
            )
          );
        };
        const groups = [
          // Aus dem gemeinsamen Register — dieselbe Liste speist die Suche.
          { label: t('dashboard.toolGroups.lebensereignisse'), items: ABLAEUFE.map((a) => (
            { label: t(a.nav), sub: t(a.sub), view: a.view, icon: a.icon }
          )) },
          { label: t('dashboard.toolGroups.gesundheit'), items: [
            { label: t('nav.arztkoffer'), sub: t('nav.sub.arztkoffer'), view: 'gesundheit', icon: 'health' },
          ] },
          // «Asyl & Migration» stand hier ein zweites Mal — dasselbe Ziel wie in
          // «Lebensereignisse». Dort bleibt es: die Gruppe ist standardmässig offen
          // (gi === 0) und «Bewilligung & Fristen» ist der richtige Nachbar.
          { label: t('dashboard.toolGroups.support'), items: [
            { label: t('lebenszustaende.pageTitle'), sub: t('lebenszustaende.pageSub'), view: 'situationen', icon: 'health' },
          ] },
          { label: t('dashboard.toolGroups.money'), items: [
            { label: t('nav.taxes'), sub: t('nav.sub.taxes'), view: 'tax', icon: 'money' },
            { label: t('nav.taxImport'), sub: t('nav.sub.taxImport'), view: 'taxImport', icon: 'document' },
            { label: t('nav.budgetSync'), sub: t('nav.sub.budgetSync'), view: 'sync', icon: 'budgetWallet' },
            { label: t('nav.mietzins'), sub: t('nav.sub.mietzins'), view: 'mietzins', icon: 'home' },
            { label: t('nav.vorsorge'), sub: t('nav.sub.vorsorge'), view: 'vorsorge', icon: 'vorsorge' },
            { label: t('nav.mindestlohn'), sub: t('nav.sub.mindestlohn'), key: 'mindestlohn', action: () => onSelectChapter(chapters.findIndex(ch => ch.key === 'finanzen')), icon: 'money' },
          ] },
          { label: t('dashboard.toolGroups.insurance'), items: [
            { label: t('nav.kvgIpv'), sub: t('nav.sub.kvgIpv'), view: 'premium', icon: 'praemienverbilligung' },
            { label: t('nav.praemien'), sub: t('nav.sub.praemien'), view: 'praemien', icon: 'insurance' },
            { label: t('nav.kvgLeistungen'), sub: t('nav.sub.kvgLeistungen'), view: 'kvg', icon: 'health' },
          ] },
          { label: t('dashboard.toolGroups.documents'), items: [
            { label: t('nav.tresor'), sub: t('nav.sub.tresor'), view: 'tresor', icon: 'dokumentTresor' },
            { label: t('nav.unterlagen'), sub: t('nav.sub.unterlagen'), view: 'unterlagen', icon: 'documents' },
            { label: t('nav.direktlinks'), sub: t('nav.sub.direktlinks'), view: 'direktlinks', icon: 'dokumentTresor' },
            { label: t('nav.flyer'), sub: t('nav.sub.flyer'), view: 'flyer', icon: 'dokumentTresor' },
          ] },
          { label: t('dashboard.toolGroups.organize'), items: [
            { label: t('nav.search'), sub: t('nav.sub.search'), view: 'search', icon: 'search' },
            { label: t('nav.merkliste'), sub: t('nav.sub.merkliste'), view: 'merkliste', icon: 'check' },
            { label: t('nav.calendar'), sub: t('nav.sub.calendar'), view: 'calendar', icon: 'calendar' },
            { label: t('nav.cv'), sub: t('nav.sub.cv'), view: 'cv', icon: 'lebenslauf' },
          ] },
        ];
        return React.createElement(React.Fragment, null,
          ...groups.map((g, gi) => React.createElement('details', {
            key: 'tg-' + gi, open: gi === 0,
            style: { borderTop: '1px solid ' + palette.border + '66' },
          },
            React.createElement('summary', {
              style: { cursor: 'pointer', padding: space.sm + 'px 2px', fontSize: text.sm, fontWeight: weight.medium, color: palette.text, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
            },
              React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px' } },
                React.createElement('span', { style: { fontSize: '10px', color: palette.soft } }, aufklappZeichen(false)),
                g.label
              ),
              React.createElement('span', { style: { fontSize: text.xs, color: palette.soft } }, g.items.length)
            ),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', padding: space.xs + 'px 0 ' + space.md + 'px 0' } },
              g.items.map(renderTool)
            )
          ))
        );
      })()
    ),

    // ─── Export reminder — calm data safety nudge ────────────
    (() => {
      const hasData = chapters.some(ch => {
        const d = data[ch.key] || {};
        return ch.fields.some(f => feldHatWert(d, f.k));
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
          style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, marginBottom: 0 }
        }, reason + ' ' + t('dashboard.exportReminder')),
        React.createElement('button', {
          onClick: () => onNavigate('export'),
          style: {
            // War 19 px hoch; 8 px Polsterung statt der 6 px Aussenabstand darüber.
            background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0',
            fontSize: text.sm, color: palette.sageDeep || palette.sage,
            fontFamily: 'inherit', fontWeight: weight.medium,
          }
        }, t('dashboard.exportReminderAction'))
      );
    })(),

    // ─── Tips — open editorial section ─────────────────────
    React.createElement('div', {
      style: { padding: '0 2px', marginBottom: space.lg, borderTop: '1px solid ' + palette.border, paddingTop: '20px' }
    },
      React.createElement(Eyebrow, {
        palette, as: 'h3',
        style: { color: palette.soft, fontWeight: weight.medium, marginBottom: space.sm + 4 }
      }, t('dashboard.tipsTitle')),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.sm } },
        [t('dashboard.tip1'), t('dashboard.tip2'), t('dashboard.tip3'), t('dashboard.tip4')].map((tip, i) =>
          React.createElement('div', { key: i, style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, display: 'flex', gap: space.sm + 2, alignItems: 'start' } },
            React.createElement('span', { style: { color: palette.sageDeep, fontSize: text.xs, marginTop: '2px', flexShrink: 0 } }, '—'),
            tip
          )
        )
      )
    ),

    !demoMode && React.createElement(BetaFeedback, { palette, t })
  );
};

export default DashboardComplete;
