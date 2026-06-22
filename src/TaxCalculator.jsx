import React, { useState } from 'react';
import { Icon } from './IconSystem.jsx';
import { text, weight } from './config/tokens.js';
import { berechneBundessteuer, grenzsteuersatz, STEUER_DATA_VERSION } from './data/steuerRechner.js';

export const TaxCalculator = ({ palette, t, data, onSave }) => {
  const deductions = [
    { label: t('tax.workCosts'), key: 'workCosts', default: 0, max: 5000 },
    { label: t('tax.pension3a'), key: 'pension3a', default: 0, max: 7056 },
    { label: t('tax.debtInterest'), key: 'debtInterest', default: 0, max: 50000 },
    { label: t('tax.maintenance'), key: 'maintenance', default: 0, max: 50000 },
    { label: t('tax.education'), key: 'education', default: 0, max: 10000 },
    { label: t('tax.otherDeductions'), key: 'other', default: 0, max: 10000 }
  ];

  const [taxData, setTaxData] = useState(data.taxData || {});
  const [canton, setCanton] = useState(data.basis?.canton || '');
  const [verheiratet, setVerheiratet] = useState(data.basis?.married || false);
  const [kinder, setKinder] = useState(Number(data.basis?.children || 0));
  const [taxableIncome, setTaxableIncome] = useState(0);
  const [estimatedTax, setEstimatedTax] = useState(0);
  const [taxResult, setTaxResult] = useState(null);

  const income = Number(data.finanzen?.monthlyIncome || 0) * 12;

  React.useEffect(() => {
    calculateTax();
  }, [taxData, income, canton, verheiratet, kinder]);

  const calculateTax = () => {
    let totalDeductions = 0;
    for (const ded of deductions) {
      totalDeductions += Number(taxData[ded.key] || 0);
    }

    const result = berechneBundessteuer({
      bruttoEinkommen: income,
      verheiratet,
      kinder,
      abzuege: totalDeductions,
    });

    setTaxableIncome(result.steuerBaresEinkommen);
    setEstimatedTax(result.steuer);
    setTaxResult(result);
  };

  const handleInputChange = (key, value) => {
    setTaxData(prev => ({ ...prev, [key]: Number(value) || 0 }));
  };

  const handleSave = () => {
    onSave({ ...data, taxData, canton });
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '8px',
    borderRadius: '6px',
    border: '1px solid ' + palette.border,
    background: palette.surface,
    color: palette.text,
    boxSizing: 'border-box',
    fontSize: text.sm
  };

  const buttonStyle = {
    padding: '10px 16px',
    background: palette.sand,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: weight.semi,
    fontSize: text.sm
  };

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
    React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'money', size: 20 }), t('tax.title')),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' } },
      // Left side: Input
      React.createElement('div', null,
        React.createElement('h3', { style: { fontSize: text.body, fontWeight: weight.semi, marginBottom: '12px' } }, t('tax.inputs')),

        React.createElement('label', { style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: '4px', fontWeight: weight.medium } }, t('tax.taxCanton')),
        React.createElement('select', { value: canton, onChange: (e) => setCanton(e.target.value), style: { ...inputStyle, marginBottom: '16px' } },
          React.createElement('option', { value: '' }, t('common.select')),
          ['AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'].map(c => React.createElement('option', { key: c, value: c }, c))
        ),

        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' } },
          React.createElement('input', {
            type: 'checkbox',
            checked: verheiratet,
            onChange: (e) => setVerheiratet(e.target.checked),
            id: 'tax-married',
            style: { accentColor: palette.sand }
          }),
          React.createElement('label', { htmlFor: 'tax-married', style: { fontSize: text.sm, color: palette.text, cursor: 'pointer' } }, t('tax.married'))
        ),

        React.createElement('label', { style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: '4px', fontWeight: weight.medium } }, t('tax.children')),
        React.createElement('select', { value: kinder, onChange: (e) => setKinder(Number(e.target.value)), style: { ...inputStyle, marginBottom: '16px' } },
          [0, 1, 2, 3, 4, 5, 6].map(n => React.createElement('option', { key: n, value: n }, n))
        ),

        React.createElement('label', { style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: '4px', fontWeight: weight.medium } }, t('tax.grossIncome')),
        React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.sand, padding: '8px', background: palette.up, borderRadius: '6px', marginBottom: '4px' } }, 'CHF ' + income.toFixed(0)),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: '4px' } }, '○ ' + t('budgetSync.bvgReferenceNote')),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: '16px', fontStyle: 'italic' } }, '○ ' + t('tax.netIncomeNote')),

        deductions.map(ded => React.createElement('div', { key: ded.key, style: { marginBottom: '12px' } },
          React.createElement('label', { style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: '4px', fontWeight: weight.medium } }, ded.label),
          React.createElement('input', {
            type: 'number',
            inputMode: 'decimal',
            value: taxData[ded.key] || '',
            onChange: (e) => handleInputChange(ded.key, e.target.value),
            placeholder: '0',
            style: inputStyle
          }),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, 'Max: CHF ' + ded.max)
        ))
      ),

      // Right side: Result
      React.createElement('div', { style: { background: palette.up, padding: '16px', borderRadius: '8px', border: '1px solid ' + palette.border } },
        React.createElement('h3', { style: { fontSize: text.body, fontWeight: weight.semi, marginBottom: '16px' } }, '◇ ' + t('tax.calculation')),

        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '4px' } }, t('tax.grossIncome')),
          React.createElement('div', { style: { fontSize: '16px', fontWeight: weight.semi, color: palette.text } }, 'CHF ' + income.toFixed(0))
        ),

        React.createElement('div', { style: { height: '1px', background: palette.border, marginBottom: '12px' } }),

        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '4px' } }, t('common.total') + ' (-)'),
          React.createElement('div', { style: { fontSize: '16px', fontWeight: weight.semi, color: palette.text } }, '- CHF ' + (income - taxableIncome).toFixed(0))
        ),

        React.createElement('div', { style: { height: '1px', background: palette.border, marginBottom: '12px' } }),

        React.createElement('div', { style: { marginBottom: '16px', padding: '12px', background: palette.surface, borderRadius: '6px', border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '4px' } }, t('tax.taxableIncome')),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, 'CHF ' + taxableIncome.toFixed(0))
        ),

        taxResult && kinder > 0 ? React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '4px' } }, t('tax.childDeduction')),
          React.createElement('div', { style: { fontSize: '16px', fontWeight: weight.semi, color: palette.text } }, '- CHF ' + taxResult.kinderabzug)
        ) : null,

        React.createElement('div', { style: { height: '1px', background: palette.border, marginBottom: '12px' } }),

        React.createElement('div', { style: { marginBottom: '16px', padding: '12px', background: palette.up, borderRadius: '6px', border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '4px' } },
            t('tax.estimatedTax') + ' (' + t('tax.federalOnly') + ')',
            taxResult ? ' ~' + taxResult.effektiverSatz + '%' : ''
          ),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, '~ CHF ' + estimatedTax.toFixed(0)),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '4px' } },
            t('tax.tariff') + ': ' + (verheiratet ? t('tax.marriedTariff') : t('tax.singleTariff')),
            ' · ' + t('tax.marginalRate') + ': ' + grenzsteuersatz(taxableIncome, verheiratet).toFixed(2) + '%'
          )
        ),

        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '4px' } }, t('tax.netIncome')),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, 'CHF ' + (income - estimatedTax).toFixed(0))
        )
      )
    ),

    React.createElement('button', { onClick: handleSave, style: { ...buttonStyle, width: '100%' } }, '□ ' + t('tax.saveData')),

    React.createElement('div', { style: { marginTop: '16px', padding: '12px', background: palette.up, borderRadius: '6px', fontSize: text.sm, color: palette.mid } },
      '○ ' + t('tax.disclaimer')
    ),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '8px' } }, '○ DBG Art. 36, ' + t('tax.dataVersion') + ': ' + STEUER_DATA_VERSION),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '4px' } }, '○ ' + t('trust.localOnly'))
  );
};

export default TaxCalculator;
