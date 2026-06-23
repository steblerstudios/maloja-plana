import React, { useState } from 'react';
import { Icon } from './IconSystem.jsx';
import { text, weight, radius , space } from './config/tokens.js';
import { berechneBundessteuer, grenzsteuersatz, STEUER_DATA_VERSION } from './data/steuerRechner.js';
import { schaetzeKantonaleSteuer, getKantonDaten, KANTONAL_DATA_VERSION } from './data/kantonaleSteuerdaten.js';

export const TaxCalculator = ({ palette, t, data, onSave, onNavigate }) => {
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
    padding: space.sm,
    marginBottom: space.sm,
    borderRadius: radius.sm,
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
    borderRadius: radius.sm,
    cursor: 'pointer',
    fontWeight: weight.semi,
    fontSize: text.sm
  };

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'money', size: 20 }), t('tax.title')),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: space.md, marginBottom: '20px' } },
      // Left side: Input
      React.createElement('div', null,
        React.createElement('h3', { style: { fontSize: text.body, fontWeight: weight.semi, marginBottom: '12px' } }, t('tax.inputs')),

        React.createElement('label', { style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium } }, t('tax.taxCanton')),
        React.createElement('div', { style: { position: 'relative', marginBottom: space.md } },
          React.createElement('select', { value: canton, onChange: (e) => setCanton(e.target.value), style: { ...inputStyle, marginBottom: 0, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', paddingRight: '36px' } },
            React.createElement('option', { value: '' }, t('common.select')),
            ['AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'].map(c => React.createElement('option', { key: c, value: c }, c))
          ),
          React.createElement('div', { style: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: palette.mid, fontSize: '10px' } }, '▾')
        ),

        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.sm, marginBottom: space.md } },
          React.createElement('input', {
            type: 'checkbox',
            checked: verheiratet,
            onChange: (e) => setVerheiratet(e.target.checked),
            id: 'tax-married',
            style: { accentColor: palette.sand }
          }),
          React.createElement('label', { htmlFor: 'tax-married', style: { fontSize: text.sm, color: palette.text, cursor: 'pointer' } }, t('tax.married'))
        ),

        React.createElement('label', { style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium } }, t('tax.children')),
        React.createElement('div', { style: { position: 'relative', marginBottom: space.md } },
          React.createElement('select', { value: kinder, onChange: (e) => setKinder(Number(e.target.value)), style: { ...inputStyle, marginBottom: 0, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', paddingRight: '36px' } },
            [0, 1, 2, 3, 4, 5, 6].map(n => React.createElement('option', { key: n, value: n }, n))
          ),
          React.createElement('div', { style: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: palette.mid, fontSize: '10px' } }, '▾')
        ),

        React.createElement('label', { style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium } }, t('tax.grossIncome')),
        React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.sand, padding: space.sm, background: palette.up, borderRadius: radius.sm, marginBottom: space.xs } }, 'CHF ' + income.toFixed(0)),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.xs } }, '○ ' + t('budgetSync.bvgReferenceNote')),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.md, fontStyle: 'italic' } }, '○ ' + t('tax.netIncomeNote')),

        deductions.map(ded => React.createElement('div', { key: ded.key, style: { marginBottom: '12px' } },
          React.createElement('label', { style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium } }, ded.label),
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
      React.createElement('div', { style: { background: palette.up, padding: space.md, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
        React.createElement('h3', { style: { fontSize: text.body, fontWeight: weight.semi, marginBottom: space.md } }, '◇ ' + t('tax.calculation')),

        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('tax.grossIncome')),
          React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text } }, 'CHF ' + income.toFixed(0))
        ),

        React.createElement('div', { style: { height: '1px', background: palette.border, marginBottom: '12px' } }),

        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('common.total') + ' (-)'),
          React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text } }, '- CHF ' + (income - taxableIncome).toFixed(0))
        ),

        React.createElement('div', { style: { height: '1px', background: palette.border, marginBottom: '12px' } }),

        React.createElement('div', { style: { marginBottom: space.md, padding: '12px', background: palette.surface, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('tax.taxableIncome')),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, 'CHF ' + taxableIncome.toFixed(0))
        ),

        taxResult && kinder > 0 ? React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('tax.childDeduction')),
          React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text } }, '- CHF ' + taxResult.kinderabzug)
        ) : null,

        React.createElement('div', { style: { height: '1px', background: palette.border, marginBottom: '12px' } }),

        React.createElement('div', { style: { marginBottom: '12px', padding: '12px', background: palette.surface, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } },
            t('tax.federalTax'),
            taxResult ? ' ~' + taxResult.effektiverSatz + '%' : ''
          ),
          React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text } }, '~ CHF ' + estimatedTax.toFixed(0)),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
            t('tax.tariff') + ': ' + (verheiratet ? t('tax.marriedTariff') : t('tax.singleTariff')),
            ' · ' + t('tax.marginalRate') + ': ' + grenzsteuersatz(taxableIncome, verheiratet).toFixed(2) + '%'
          )
        ),

        (() => {
          const kantonal = canton ? schaetzeKantonaleSteuer(estimatedTax, canton) : null;
          if (!kantonal) return React.createElement('div', { style: { marginBottom: '12px', padding: '12px', background: palette.surface, borderRadius: radius.sm, border: '1px dashed ' + palette.border } },
            React.createElement('div', { style: { fontSize: text.sm, color: palette.soft, fontStyle: 'italic' } }, t('tax.selectCantonHint'))
          );
          return React.createElement(React.Fragment, null,
            React.createElement('div', { style: { marginBottom: '12px', padding: '12px', background: palette.surface, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
              React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } },
                t('tax.cantonalAndMunicipal') + ' (' + kantonal.hauptort + ')'
              ),
              React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text } }, '~ CHF ' + kantonal.kantonalUndGemeinde),
              React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
                t('tax.basedOnHauptort')
              )
            ),
            React.createElement('div', { 'aria-live': 'polite', style: { marginBottom: space.md, padding: '12px', background: palette.sand + '12', borderRadius: radius.sm, border: '1px solid ' + palette.sand + '30' } },
              React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('tax.totalEstimate')),
              React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, '~ CHF ' + kantonal.total),
              React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
                t('tax.totalNote')
              )
            )
          );
        })(),

        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('tax.netIncome')),
          React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } },
            'CHF ' + (income - (canton ? (schaetzeKantonaleSteuer(estimatedTax, canton) || { total: estimatedTax }).total : estimatedTax)).toFixed(0)
          )
        )
      )
    ),

    React.createElement('button', { onClick: handleSave, style: { ...buttonStyle, width: '100%' } }, '□ ' + t('tax.saveData')),

    React.createElement('div', { style: { marginTop: space.md, padding: '12px', background: palette.up, borderRadius: radius.sm, fontSize: text.sm, color: palette.mid } },
      '○ ' + t('tax.disclaimer')
    ),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.sm } }, '○ ' + t('tax.federalTax') + ': DBG Art. 36, ' + t('tax.dataVersion') + ': ' + STEUER_DATA_VERSION),
    canton && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } }, '○ ' + t('tax.cantonalAndMunicipal') + ': ' + t('tax.dataVersion') + ': ' + KANTONAL_DATA_VERSION),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } }, '○ ' + t('trust.localOnly')),

    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('finanzuebersicht'),
      style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sand, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.md }
    }, '→ ' + t('nav.finanzUebersicht'))
  );
};

export default TaxCalculator;
