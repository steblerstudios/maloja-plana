import React, { useState } from 'react';
import { calculateIPV, CANTONAL_IPV, getCantonName } from './config/cantonalData.js';
import { getKVGApplicationLink, estimateTaxSavings } from './premiumCalc.js';
import { Icon } from './IconSystem.jsx';
import { getFullName } from './config/constants.js';
import { text, weight, radius , space } from './config/tokens.js';

export const PremiumSubsidy = ({ palette, t, data, onNavigate }) => {
  const [showCalculation, setShowCalculation] = useState(true);

  const canton = data.basis?.canton || '';
  const ipvResult = calculateIPV(data);
  const residenceType = data.wohnen?.residenceType || 'hauptwohnsitz';
  const residenceKey = residenceType === 'wochenaufenthalt' ? 'wochenaufenthalt' : residenceType === 'nebenwohnsitz' ? 'nebenwohnsitz' : 'hauptwohnsitz';
  const kvgLink = getKVGApplicationLink(canton);
  const taxSavings = ipvResult.eligible ? estimateTaxSavings(ipvResult.amount) : 0;

  const handleApplyOnline = () => {
    window.open(kvgLink, '_blank');
  };

  const handleDownloadDocument = () => {
    const doc = {
      title: 'KVG IPV — Kantonal',
      date: new Date().toLocaleDateString(),
      canton,
      cantonName: getCantonName(canton, t),
      applicant: getFullName(data.basis) || '',
      ahv: data.basis?.ahv || '',
      result: ipvResult
    };
    const text = JSON.stringify(doc, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'KVG_IPV_' + (getFullName(data.basis) || 'application').replace(/\s/g, '_') + '.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasProfile = canton && data.finanzen;

  if (!hasProfile) {
    return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
      React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'insurance', size: 20 }), t('premium.title')),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, fontSize: text.sm, color: palette.mid } },
        '○ ' + t('premium.enterCanton')
      )
    );
  }

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'insurance', size: 20 }), t('premium.title')),

    // Canton info
    React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, marginBottom: space.md, fontSize: text.sm } },
      React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: '6px' } }, '○ ' + t('premium.canton', { name: getCantonName(canton, t) || t('premium.cantonUnknown') })),
      ipvResult.cantonData && React.createElement('div', { style: { color: palette.mid } },
        React.createElement('div', null, t('premium.model', { value: t(ipvResult.cantonData.modelKey) })),
        React.createElement('div', null, t('premium.maxIncome', { value: ipvResult.cantonData.maxIncome.toLocaleString() })),
        React.createElement('div', null, t('premium.note', { value: t(ipvResult.cantonData.noteKey, ipvResult.cantonData.noteParams) }))
      ),
      !canton && React.createElement('div', { style: { color: palette.rose } }, t('premium.enterCanton'))
    ),

    // Residence type warning
    residenceKey === 'wochenaufenthalt' && React.createElement('div', { style: { padding: '10px', background: palette.gold + '22', borderRadius: radius.sm, border: '1px solid ' + palette.gold, marginBottom: space.md, fontSize: text.sm } },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.gold, marginBottom: space.xs } }, '○ ' + t('premium.weeklyResidence')),
      React.createElement('div', null, t('premium.weeklyIpvNote')),
      React.createElement('div', null, t('premium.weeklyKkNote'))
    ),

    // Eligibility Status
    ipvResult.eligible ? React.createElement('div', { style: { padding: '12px', background: palette.sage + '22', borderRadius: radius.sm, border: '1px solid ' + palette.sage, marginBottom: space.md } },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.sage, marginBottom: space.xs } }, '✓ ' + t('premium.eligible')),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.text } }, t(ipvResult.noteKey, ipvResult.noteParams))
    ) : React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: space.md } },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.mid, marginBottom: space.xs } }, '○ ' + t('premium.notEligible')),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t(ipvResult.noteKey, ipvResult.noteParams))
    ),

    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: '12px', fontStyle: 'italic' } }, t('premium.disclaimer')),

    showCalculation && React.createElement('div', null,
      // Results
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: space.md } },
        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, '◇ ' + t('premium.monthlySubsidy')),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, 'CHF ' + ipvResult.amount),
          ipvResult.reductionPercent != null && ipvResult.reductionPercent < 100 && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
            t('premium.reductionNote', { percent: ipvResult.reductionPercent })
          )
        ),
        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, '◇ ' + t('premium.annualSubsidy')),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, 'CHF ' + (ipvResult.annual || 0)),
          ipvResult.maxAnnual && ipvResult.annual < ipvResult.maxAnnual && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
            t('premium.maxPossible', { value: ipvResult.maxAnnual })
          )
        ),
        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, '◇ ' + t('premium.taxSavings')),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, '~ CHF ' + taxSavings + t('common.perYear'))
        )
      ),

      // All cantons overview
      React.createElement('details', { style: { marginBottom: space.md } },
        React.createElement('summary', { style: { cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi, color: palette.mid, padding: '8px 0' } }, '◰ ' + t('premium.compareCantons')),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: space.sm, marginTop: space.sm } },
          Object.entries(CANTONAL_IPV).map(([key, val]) =>
            React.createElement('div', {
              key,
              style: {
                padding: space.sm,
                background: key === canton ? palette.sage + '22' : palette.up,
                borderRadius: '4px',
                border: '1px solid ' + (key === canton ? palette.sage : palette.border),
                fontSize: text.sm
              }
            },
              React.createElement('div', { style: { fontWeight: weight.semi } }, key + ' — ' + getCantonName(key, t)),
              React.createElement('div', { style: { color: palette.mid } }, 'Max: CHF ' + val.maxIncome.toLocaleString() + ' | Single: CHF ' + val.subsidySingle + t('common.perYear'))
            )
          )
        )
      ),

      // Checklist
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, marginBottom: space.md } },
        React.createElement('h4', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '10px' } }, '□ ' + t('premium.requiredDocs') + ':'),
        React.createElement('ul', { style: { fontSize: text.sm, paddingLeft: '20px', margin: 0 } },
          [t('premium.doc1'), t('premium.doc2'), t('premium.doc3'), t('premium.doc4')].map((doc, idx) =>
            React.createElement('li', { key: idx, style: { marginBottom: space.xs } }, doc)
          )
        )
      ),

      // Actions
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: space.sm } },
        React.createElement('button', {
          onClick: handleApplyOnline,
          disabled: !ipvResult.eligible,
          style: { padding: '10px', background: ipvResult.eligible ? palette.sand : palette.mid, color: '#fff', border: 'none', borderRadius: radius.sm, cursor: ipvResult.eligible ? 'pointer' : 'not-allowed', fontWeight: weight.semi, fontSize: text.sm, opacity: ipvResult.eligible ? 1 : 0.6 }
        }, '↗ ' + t('premium.applyOnline')),
        React.createElement('button', {
          onClick: handleDownloadDocument,
          disabled: !ipvResult.eligible,
          style: { padding: '10px', background: ipvResult.eligible ? palette.sky : palette.mid, color: '#fff', border: 'none', borderRadius: radius.sm, cursor: ipvResult.eligible ? 'pointer' : 'not-allowed', fontWeight: weight.semi, fontSize: text.sm, opacity: ipvResult.eligible ? 1 : 0.6 }
        }, '□ ' + t('premium.document')),
        React.createElement('button', {
          onClick: () => setShowCalculation(false),
          style: { padding: '10px', background: palette.up, color: palette.text, border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm }
        }, '✕ ' + t('common.close'))
      )
    ),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, '○ ' + t('trust.localOnly')),

    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('finanzuebersicht'),
      style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sand, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.md }
    }, '→ ' + t('nav.finanzUebersicht'))
  );
};

export default PremiumSubsidy;
