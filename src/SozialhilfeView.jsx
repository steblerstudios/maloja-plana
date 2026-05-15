import React from 'react';
import { calculateSozialhilfe, calculateIPV, checkELEligibility, CANTON_NAMES, getResidenceInfo, SKOS_GRUNDBEDARF } from './config/cantonalData.js';
import { Icon } from './IconSystem.jsx';

export const SozialhilfeView = ({ palette, t, data }) => {
  const canton = data.basis?.canton || '';
  const sozialhilfe = calculateSozialhilfe(data);
  const ipv = calculateIPV(data);
  const el = checkELEligibility(data);
  const residenceType = data.wohnen?.residenceType || 'hauptwohnsitz';
  const residenceKey = residenceType === 'wochenaufenthalt' ? 'wochenaufenthalt' : 'hauptwohnsitz';
  const residenceInfo = getResidenceInfo(residenceKey);

  const formatCHF = (n) => 'CHF ' + Number(n || 0).toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const Row = (label, value, color) =>
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid ' + palette.border, fontSize: '12px' } },
      React.createElement('span', { style: { color: palette.mid } }, label),
      React.createElement('span', { style: { fontWeight: '600', color: color || palette.text } }, value)
    );

  return React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
    React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'insurance', size: 20 }), t('sozialhilfe.title')),

    // Canton
    React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', marginBottom: '16px', fontSize: '12px' } },
      React.createElement('div', { style: { fontWeight: '600', marginBottom: '4px' } }, '○ ' + t('premium.canton', { name: CANTON_NAMES[canton] || t('premium.cantonUnknown') })),
      React.createElement('div', { style: { color: palette.mid } }, t('sozialhilfe.householdSize', { count: sozialhilfe.householdSize })),
      !canton && React.createElement('div', { style: { color: palette.rose, marginTop: '4px' } }, t('sozialhilfe.enterCanton'))
    ),

    // Residence type
    residenceKey === 'wochenaufenthalt' && React.createElement('div', { style: { padding: '10px', background: palette.gold + '22', borderRadius: '6px', border: '1px solid ' + palette.gold, marginBottom: '16px', fontSize: '11px' } },
      React.createElement('div', { style: { fontWeight: '600', color: palette.gold, marginBottom: '4px' } }, '○ ' + t('sozialhilfe.weeklyResidence')),
      React.createElement('div', null, t('residence.taxNote')),
      React.createElement('div', null, t('sozialhilfe.weeklyNote'))
    ),

    // SKOS Calculation
    React.createElement('div', { style: { marginBottom: '20px' } },
      React.createElement('h3', { style: { fontSize: '14px', fontWeight: '600', marginBottom: '12px' } }, '◰ ' + t('sozialhilfe.skosCalculation')),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px' } },
        Row(t('sozialhilfe.basicNeeds'), formatCHF(sozialhilfe.grundbedarf)),
        Row(t('sozialhilfe.housingCosts'), formatCHF(sozialhilfe.effectiveRent)),
        Row(t('sozialhilfe.rentLimit'), formatCHF(sozialhilfe.rentLimit), palette.mid),
        Row(t('sozialhilfe.healthInsurance'), formatCHF(sozialhilfe.effectiveKK)),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', fontWeight: '700', borderTop: '2px solid ' + palette.border, marginTop: '4px' } },
          React.createElement('span', null, t('sozialhilfe.totalNeeds')),
          React.createElement('span', null, formatCHF(sozialhilfe.totalBedarf))
        ),
        Row(t('sozialhilfe.deductIncome'), '- ' + formatCHF(sozialhilfe.income), palette.sage),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', fontWeight: '700', borderTop: '2px solid ' + palette.border, marginTop: '4px' } },
          React.createElement('span', null, t('sozialhilfe.deficit')),
          React.createElement('span', { style: { color: sozialhilfe.eligible ? palette.gold : palette.sage } }, formatCHF(sozialhilfe.deficit) + t('common.perMonth'))
        )
      )
    ),

    // Status
    sozialhilfe.eligible ? React.createElement('div', { style: { padding: '12px', background: palette.gold + '22', borderRadius: '6px', border: '2px solid ' + palette.gold, marginBottom: '16px' } },
      React.createElement('div', { style: { fontWeight: '600', color: palette.gold, marginBottom: '4px' } }, '○ ' + t('sozialhilfe.entitled')),
      React.createElement('div', { style: { fontSize: '12px' } }, sozialhilfe.note)
    ) : React.createElement('div', { style: { padding: '12px', background: palette.sage + '22', borderRadius: '6px', border: '2px solid ' + palette.sage, marginBottom: '16px' } },
      React.createElement('div', { style: { fontWeight: '600', color: palette.sage, marginBottom: '4px' } }, '✓ ' + t('sozialhilfe.notEntitled')),
      React.createElement('div', { style: { fontSize: '12px' } }, sozialhilfe.note)
    ),

    // IPV Info
    React.createElement('div', { style: { marginBottom: '16px' } },
      React.createElement('h3', { style: { fontSize: '14px', fontWeight: '600', marginBottom: '12px' } }, '◰ ' + t('sozialhilfe.ipvSection')),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px' } },
        ipv.eligible
          ? React.createElement('div', null,
              React.createElement('div', { style: { fontWeight: '600', color: palette.sage, marginBottom: '4px', fontSize: '12px' } }, '✓ ' + t('premium.eligible') + ': ' + formatCHF(ipv.amount) + t('common.perMonth')),
              React.createElement('div', { style: { fontSize: '11px', color: palette.mid } }, ipv.note)
            )
          : React.createElement('div', null,
              React.createElement('div', { style: { fontWeight: '600', color: palette.rose, marginBottom: '4px', fontSize: '12px' } }, '✕ ' + ipv.note)
            )
      )
    ),

    // EL Info
    React.createElement('div', { style: { marginBottom: '16px' } },
      React.createElement('h3', { style: { fontSize: '14px', fontWeight: '600', marginBottom: '12px' } }, '◰ ' + t('sozialhilfe.elSection')),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px' } },
        React.createElement('div', { style: { fontWeight: '600', color: el.eligible ? palette.sage : palette.mid, marginBottom: '4px', fontSize: '12px' } },
          el.eligible ? '✓ ' + t('sozialhilfe.elPossible') : '○ ' + el.note
        ),
        el.isAHVIV && React.createElement('div', { style: { fontSize: '11px', color: palette.mid } },
          t('sozialhilfe.totalIncome', { value: el.totalIncome }) + ' | ' + t('sozialhilfe.totalExpenses', { value: el.totalExpenses })
        )
      )
    ),

    // SKOS table
    React.createElement('details', { style: { marginBottom: '16px' } },
      React.createElement('summary', { style: { cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: palette.mid, padding: '8px 0' } }, '◰ ' + t('sozialhilfe.skosTable')),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginTop: '8px' } },
        Object.entries(SKOS_GRUNDBEDARF).map(([size, amount]) =>
          React.createElement('div', {
            key: size,
            style: {
              padding: '8px',
              background: Number(size) === sozialhilfe.householdSize ? palette.gold + '22' : palette.up,
              borderRadius: '4px',
              border: Number(size) === sozialhilfe.householdSize ? '2px solid ' + palette.gold : '1px solid ' + palette.border,
              fontSize: '11px',
              textAlign: 'center'
            }
          },
            React.createElement('div', { style: { fontWeight: '600' } }, Number(size) === 1 ? t('common.person', { count: size }) : t('common.persons', { count: size })),
            React.createElement('div', { style: { color: palette.mid } }, formatCHF(amount))
          )
        )
      )
    ),

    // Next steps
    React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px' } },
      React.createElement('h4', { style: { fontSize: '12px', fontWeight: '600', marginBottom: '8px' } }, '□ ' + t('sozialhilfe.nextSteps')),
      React.createElement('ul', { style: { fontSize: '11px', paddingLeft: '20px', margin: 0, color: palette.mid } },
        React.createElement('li', { style: { marginBottom: '4px' } }, t('sozialhilfe.step1')),
        React.createElement('li', { style: { marginBottom: '4px' } }, t('sozialhilfe.step2')),
        React.createElement('li', { style: { marginBottom: '4px' } }, t('sozialhilfe.step3')),
        sozialhilfe.eligible && React.createElement('li', { style: { marginBottom: '4px' } }, t('sozialhilfe.step4')),
        el.eligible && React.createElement('li', { style: { marginBottom: '4px' } }, t('sozialhilfe.step5'))
      )
    )
  );
};

export default SozialhilfeView;
