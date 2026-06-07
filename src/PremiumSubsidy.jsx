import React, { useState } from 'react';
import { calculateIPV, CANTONAL_IPV, getCantonName } from './config/cantonalData.js';
import { getKVGApplicationLink, estimateTaxSavings } from './premiumCalc.js';
import { Icon } from './IconSystem.jsx';
import { getFullName } from './config/constants.js';

export const PremiumSubsidy = ({ palette, t, data }) => {
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
    return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
      React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'insurance', size: 20 }), t('premium.title')),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', fontSize: '13px', color: palette.mid } },
        '○ ' + t('premium.enterCanton')
      )
    );
  }

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
    React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'insurance', size: 20 }), t('premium.title')),

    // Canton info
    React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', marginBottom: '16px', fontSize: '13px' } },
      React.createElement('div', { style: { fontWeight: '600', marginBottom: '6px' } }, '○ ' + t('premium.canton', { name: getCantonName(canton, t) || t('premium.cantonUnknown') })),
      ipvResult.cantonData && React.createElement('div', { style: { color: palette.mid } },
        React.createElement('div', null, t('premium.model', { value: t(ipvResult.cantonData.modelKey) })),
        React.createElement('div', null, t('premium.maxIncome', { value: ipvResult.cantonData.maxIncome.toLocaleString() })),
        React.createElement('div', null, t('premium.note', { value: t(ipvResult.cantonData.noteKey, ipvResult.cantonData.noteParams) }))
      ),
      !canton && React.createElement('div', { style: { color: palette.rose } }, t('premium.enterCanton'))
    ),

    // Residence type warning
    residenceKey === 'wochenaufenthalt' && React.createElement('div', { style: { padding: '10px', background: palette.gold + '22', borderRadius: '6px', border: '1px solid ' + palette.gold, marginBottom: '16px', fontSize: '13px' } },
      React.createElement('div', { style: { fontWeight: '600', color: palette.gold, marginBottom: '4px' } }, '○ ' + t('premium.weeklyResidence')),
      React.createElement('div', null, t('premium.weeklyIpvNote')),
      React.createElement('div', null, t('premium.weeklyKkNote'))
    ),

    // Eligibility Status
    ipvResult.eligible ? React.createElement('div', { style: { padding: '12px', background: palette.sage + '22', borderRadius: '6px', border: '1px solid ' + palette.sage, marginBottom: '16px' } },
      React.createElement('div', { style: { fontWeight: '600', color: palette.sage, marginBottom: '4px' } }, '✓ ' + t('premium.eligible')),
      React.createElement('div', { style: { fontSize: '13px', color: palette.text } }, t(ipvResult.noteKey, ipvResult.noteParams))
    ) : React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', border: '1px solid ' + palette.border, marginBottom: '16px' } },
      React.createElement('div', { style: { fontWeight: '600', color: palette.mid, marginBottom: '4px' } }, '○ ' + t('premium.notEligible')),
      React.createElement('div', { style: { fontSize: '13px', color: palette.mid } }, t(ipvResult.noteKey, ipvResult.noteParams))
    ),

    showCalculation && React.createElement('div', null,
      // Results
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' } },
        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: '13px', color: palette.mid, marginBottom: '4px' } }, '◇ ' + t('premium.monthlySubsidy')),
          React.createElement('div', { style: { fontSize: '18px', fontWeight: '600', color: palette.text } }, 'CHF ' + ipvResult.amount)
        ),
        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: '13px', color: palette.mid, marginBottom: '4px' } }, '◇ ' + t('premium.annualSubsidy')),
          React.createElement('div', { style: { fontSize: '18px', fontWeight: '600', color: palette.text } }, 'CHF ' + (ipvResult.annual || 0))
        ),
        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: '13px', color: palette.mid, marginBottom: '4px' } }, '◇ ' + t('premium.taxSavings')),
          React.createElement('div', { style: { fontSize: '18px', fontWeight: '600', color: palette.text } }, '~ CHF ' + taxSavings + t('common.perYear'))
        )
      ),

      // All cantons overview
      React.createElement('details', { style: { marginBottom: '16px' } },
        React.createElement('summary', { style: { cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: palette.mid, padding: '8px 0' } }, '◰ ' + t('premium.compareCantons')),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', marginTop: '8px' } },
          Object.entries(CANTONAL_IPV).map(([key, val]) =>
            React.createElement('div', {
              key,
              style: {
                padding: '8px',
                background: key === canton ? palette.sage + '22' : palette.up,
                borderRadius: '4px',
                border: '1px solid ' + (key === canton ? palette.sage : palette.border),
                fontSize: '13px'
              }
            },
              React.createElement('div', { style: { fontWeight: '600' } }, key + ' — ' + getCantonName(key, t)),
              React.createElement('div', { style: { color: palette.mid } }, 'Max: CHF ' + val.maxIncome.toLocaleString() + ' | Single: CHF ' + val.subsidySingle + t('common.perYear'))
            )
          )
        )
      ),

      // Checklist
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', marginBottom: '16px' } },
        React.createElement('h4', { style: { fontSize: '13px', fontWeight: '600', marginBottom: '10px' } }, '□ ' + t('premium.requiredDocs') + ':'),
        React.createElement('ul', { style: { fontSize: '13px', paddingLeft: '20px', margin: 0 } },
          [t('premium.doc1'), t('premium.doc2'), t('premium.doc3'), t('premium.doc4')].map((doc, idx) =>
            React.createElement('li', { key: idx, style: { marginBottom: '4px' } }, doc)
          )
        )
      ),

      // Actions
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' } },
        React.createElement('button', {
          onClick: handleApplyOnline,
          disabled: !ipvResult.eligible,
          style: { padding: '10px', background: ipvResult.eligible ? palette.sand : palette.mid, color: '#fff', border: 'none', borderRadius: '6px', cursor: ipvResult.eligible ? 'pointer' : 'not-allowed', fontWeight: '600', fontSize: '13px', opacity: ipvResult.eligible ? 1 : 0.6 }
        }, '↗ ' + t('premium.applyOnline')),
        React.createElement('button', {
          onClick: handleDownloadDocument,
          disabled: !ipvResult.eligible,
          style: { padding: '10px', background: ipvResult.eligible ? palette.sky : palette.mid, color: '#fff', border: 'none', borderRadius: '6px', cursor: ipvResult.eligible ? 'pointer' : 'not-allowed', fontWeight: '600', fontSize: '13px', opacity: ipvResult.eligible ? 1 : 0.6 }
        }, '□ ' + t('premium.document')),
        React.createElement('button', {
          onClick: () => setShowCalculation(false),
          style: { padding: '10px', background: palette.up, color: palette.text, border: '1px solid ' + palette.border, borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }
        }, '✕ ' + t('common.close'))
      )
    ),

    React.createElement('div', { style: { fontSize: '13px', color: palette.mid, marginTop: '12px' } }, '○ ' + t('trust.localOnly'))
  );
};

export default PremiumSubsidy;
