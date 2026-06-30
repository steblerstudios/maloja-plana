import React from 'react';
import { Icon } from './IconSystem.jsx';
import { text, weight, radius, space, leading } from './config/tokens.js';
import { getMietzinsbeitraege, mietzinsIncomeLimit } from './data/mietzinsbeitraege.js';
import { getCantonName, getRentLimit, getHouseholdInfo } from './config/cantonalData.js';
import { lookupPLZ } from './data/plzGemeinde.js';
import { getRentComparison } from './data/mietpreise.js';
import { RegionalBarometer } from './components/RegionalBarometer.jsx';
import { renderSource } from './utils/renderSource.js';

// Mietzinsbeiträge-Orientierung — parallel zur Prämienorientierung (PraemienOrientierung)
// und mit Schnellcheck wie die IPV (PremiumSubsidy). Rechnet — wo möglich — mit den BEREITS
// erfassten Beträgen (Einkommen, Miete, Haushalt) gegen recherchierte, belegte Kanton-Eckwerte
// (data/mietzinsbeitraege.js) und die kantonale Mietzins-Limite (getRentLimit, SKOS-belegt).
// Bewusst eine EINSCHÄTZUNG, keine verbindliche Zusage — die Programme sind kantonal/kommunal
// fragmentiert; verbindlich ist immer die kantonale Stelle (würdevoll, keine falsche Hoffnung).
export const MietzinsOrientierung = ({ palette, t, data, onNavigate }) => {
  const canton = data?.basis?.canton || (() => {
    const plz = (data?.wohnen?.postalCode || '').trim();
    if (plz.length < 4) return '';
    const gem = lookupPLZ(plz);
    return gem && gem.length ? gem[0].kanton : '';
  })();

  const info = canton ? getMietzinsbeitraege(canton) : null;
  const hasProgram = !!info && info.state === 'has';

  const hh = getHouseholdInfo(data) || {};
  const householdSize = hh.householdSize || 1;
  const childrenCount = hh.childrenCount || 0;

  const monthlyIncome = parseFloat(data?.finanzen?.monthlyIncome) || 0;
  const annualIncome = Math.round(monthlyIncome * 12);
  const rentMonthly = (parseFloat(data?.wohnen?.rentAmount) || 0) + (parseFloat(data?.wohnen?.utilities) || 0);
  const rentLimit = canton ? getRentLimit(canton, householdSize) : 0;
  const incomeLimit = hasProgram ? mietzinsIncomeLimit(info, householdSize, childrenCount) : null;

  // Regionaler Mietvergleich (BFS) — wie beim Budget: Balken = deine Miete, Punkt = Region,
  // Strich = CH-Schnitt. Plus Wohnkostenquote (% des Einkommens) gegen die Drittel-Faustregel.
  const rentComparison = canton ? getRentComparison(canton, { rooms: data?.wohnen?.rooms, householdSize }) : null;
  const rentSharePct = (rentMonthly > 0 && monthlyIncome > 0) ? Math.round((rentMonthly / monthlyIncome) * 100) : null;

  // Einschätzung aus erfassten Beträgen + Kanton-Eckwerten (nie verbindlich).
  const assessment = (() => {
    if (!hasProgram) return null;
    if (info.group === 'families' && childrenCount === 0) return { key: 'familiesOnly', tone: 'soft' };
    if (incomeLimit == null) return { key: 'effortBased', tone: 'neutral' }; // GE: mietabhängiges barème
    if (!annualIncome) return { key: 'needIncome', tone: 'neutral' };
    if (annualIncome > incomeLimit) return { key: 'incomeHigh', tone: 'soft', params: { limit: incomeLimit.toLocaleString() } };
    return { key: 'likely', tone: 'good', params: { income: annualIncome.toLocaleString(), limit: incomeLimit.toLocaleString() } };
  })();
  const toneColor = (tone) => tone === 'good' ? palette.sage : (tone === 'soft' ? palette.soft : palette.text);

  const card = (extra) => ({ padding: '12px', background: palette.up, borderRadius: radius.sm, marginBottom: space.md + 'px', fontSize: text.sm, ...extra });
  const linkBtn = { display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sand, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.sm + 'px' };

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' } },
      React.createElement(Icon, { name: 'home', size: 20 }), t('mietzinsView.title')),
    React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.md + 'px', lineHeight: leading.relaxed } }, t('mietzinsView.intro')),

    !canton ? React.createElement('div', { style: card() },
      React.createElement('div', { style: { color: palette.mid } }, 'ⓘ ' + t('mietzinsView.enterCanton')),
      onNavigate && React.createElement('button', { style: linkBtn, onClick: () => onNavigate('praemien') }, '→ ' + t('mietzinsView.enterCantonLink'))
    ) : React.createElement(React.Fragment, null,
      // Kanton-Verfügbarkeit + kantonsspezifische Besonderheit (belegte Quelle).
      React.createElement('div', { style: card() },
        React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: '6px' } }, t('mietzinsView.cantonLabel', { name: getCantonName(canton, t) || canton })),
        React.createElement('div', { style: { color: palette.mid, lineHeight: leading.normal } }, t('mietzins.' + info.state)),
        hasProgram && info.noteKey && React.createElement('div', { style: { color: palette.mid, lineHeight: leading.normal, marginTop: space.xs + 'px' } }, 'ⓘ ' + t(info.noteKey)),
        info.url && React.createElement('a', {
          href: info.url, target: '_blank', rel: 'noopener noreferrer',
          style: { ...linkBtn, display: 'inline-block', textDecoration: 'underline', textUnderlineOffset: '2px' },
        }, info.state === 'has' ? t('mietzins.linkCanton') : t('mietzins.linkOverview'))
      ),

      // Schnellcheck — rechnet mit den erfassten Beträgen.
      hasProgram && React.createElement('div', { style: card() },
        React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: '4px' } }, t('mietzinsView.checkTitle')),
        // Was wir verwenden (transparent, wie ein Rechner).
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm + 'px', lineHeight: leading.normal } },
          t('mietzinsView.basis', {
            income: annualIncome ? annualIncome.toLocaleString() : '—',
            rent: rentMonthly ? rentMonthly.toLocaleString() : '—',
            size: householdSize,
          })),
        // Ergebnis (mit Zahlen, sofern vorhanden).
        assessment && React.createElement('div', {
          style: { padding: '10px 12px', borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.surface, fontSize: text.sm, color: toneColor(assessment.tone), lineHeight: leading.normal },
        }, (assessment.tone === 'good' ? '✓ ' : 'ⓘ ') + t('mietzinsView.result_' + assessment.key, assessment.params || {})),
        // Mietzins-Limite-Vergleich (belegte kantonale Limite).
        rentMonthly > 0 && rentLimit > 0 && React.createElement('div', { style: { fontSize: text.sm, color: rentMonthly > rentLimit ? palette.gold : palette.mid, marginTop: space.sm + 'px', lineHeight: leading.normal } },
          'ⓘ ' + t(rentMonthly > rentLimit ? 'mietzinsView.rentOver' : 'mietzinsView.rentWithin', { limit: rentLimit.toLocaleString(), size: householdSize })),
        assessment && assessment.key === 'needIncome' && onNavigate && React.createElement('button', { style: linkBtn, onClick: () => onNavigate('finanzuebersicht') }, '→ ' + t('mietzinsView.enterIncomeLink'))
      ),

      // Wo steht deine Miete? — regionaler BFS-Vergleich (Barometer) + Wohnkostenquote.
      (rentComparison || rentSharePct != null) && React.createElement('div', { style: card() },
        React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: space.sm + 'px' } }, t('mietzinsView.compareTitle')),
        rentComparison && React.createElement(RegionalBarometer, { palette, t, comparison: rentComparison, userValue: rentMonthly || null, kind: 'rent' }),
        rentSharePct != null && React.createElement('div', { style: { marginTop: space.sm + 'px' } },
          React.createElement('div', { style: { fontSize: text.sm, color: rentSharePct > 33 ? palette.gold : palette.text, lineHeight: leading.normal } },
            t('mietzinsView.rentShare', { pct: rentSharePct })),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginTop: '2px' } }, t('mietzinsView.rentShareGuide'))
        )
      ),

      // Unterlagen, die meist gebraucht werden.
      React.createElement('div', { style: card() },
        React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: '8px' } }, '□ ' + t('mietzinsView.docsTitle')),
        React.createElement('ul', { style: { fontSize: text.sm, color: palette.mid, paddingLeft: '20px', margin: 0 } },
          [t('mietzinsView.doc1'), t('mietzinsView.doc2'), t('mietzinsView.doc3')].map((d, i) =>
            React.createElement('li', { key: i, style: { marginBottom: '4px' } }, d))
        )
      ),

      React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginBottom: space.sm + 'px' } }, renderSource(t('mietzinsView.source'))),

      onNavigate && React.createElement('button', { style: linkBtn, onClick: () => onNavigate('sync') }, '→ ' + t('mietzinsView.linkBudget')),
      onNavigate && React.createElement('button', { style: linkBtn, onClick: () => onNavigate('finanzuebersicht') }, '→ ' + t('nav.finanzUebersicht'))
    ),

    React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.md + 'px' } }, 'ⓘ ' + t('trust.localOnly'))
  );
};

export default MietzinsOrientierung;
