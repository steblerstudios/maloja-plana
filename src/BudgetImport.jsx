import React, { useState } from 'react';
import { importBudgetFromFile, processBudgetEntries } from './csvImport.js';
import { Icon } from './IconSystem.jsx';

export const BudgetImport = ({ palette, t, currentBudget, onImport }) => {
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [importType, setImportType] = useState('csv');

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const entries = await importBudgetFromFile(file);
      setPreview({
        entries, fileName: file.name, count: entries.length,
        totalAmount: entries.reduce((sum, e) => sum + e.amount, 0)
      });
    } catch (error) {
      // import failed
    } finally {
      setImporting(false);
    }
  };

  const handleImportConfirm = () => {
    if (!preview) return;
    const updated = processBudgetEntries(preview.entries, currentBudget);
    onImport(updated);
    setPreview(null);
  };

  const buttonStyle = {
    padding: '10px 16px', background: palette.sand, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px'
  };

  const inputStyle = {
    width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box', fontSize: '12px'
  };

  return React.createElement('div', { style: { maxWidth: '720px' } },
   React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' } },
    // Upload
    React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
      React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'csv', size: 20 }), t('budgetImport.title')),

      React.createElement('label', { style: { display: 'block', fontSize: '12px', color: palette.mid, marginBottom: '8px', fontWeight: '500' } }, t('budgetImport.fileFormat')),
      React.createElement('select', { value: importType, onChange: (e) => setImportType(e.target.value), style: { ...inputStyle, marginBottom: '16px' } },
        React.createElement('option', { value: 'csv' }, t('budgetImport.csv')),
        React.createElement('option', { value: 'excel' }, t('budgetImport.excel')),
        React.createElement('option', { value: 'ebill' }, t('budgetImport.ebill')),
        React.createElement('option', { value: 'text' }, t('budgetImport.tsv'))
      ),

      React.createElement('label', { style: { display: 'block', padding: '20px', background: palette.up, border: '2px dashed ' + palette.border, borderRadius: '8px', textAlign: 'center', cursor: 'pointer', marginBottom: '12px' } },
        React.createElement('input', { type: 'file', accept: '.csv,.xlsx,.xls,.txt,.tsv', onChange: handleFileSelect, style: { display: 'none' } }),
        React.createElement('div', { style: { fontSize: '18px', marginBottom: '4px' } }, '□'),
        React.createElement('div', { style: { fontWeight: '600' } }, t('budgetImport.selectFile')),
        React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginTop: '4px' } }, t('budgetImport.orDragHere'))
      ),

      importing && React.createElement('div', { style: { padding: '12px', background: palette.gold + '22', borderRadius: '6px', textAlign: 'center', color: palette.gold, fontWeight: '600' } }, '○ ' + t('budgetImport.importing')),

      React.createElement('div', { style: { fontSize: '11px', color: palette.mid, padding: '12px', background: palette.up, borderRadius: '6px' } },
        React.createElement('div', { style: { fontWeight: '600', marginBottom: '6px' } }, '□ ' + t('budgetImport.formatExample') + ':'),
        React.createElement('code', { style: { display: 'block', fontSize: '10px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: '6px' } },
          `Date,Description,Amount,Category,Type
01.04.2024,Rent,1500,rent,expense
02.04.2024,Salary,4000,income,income
05.04.2024,KK Premium,280,insurance,expense`
        )
      )
    ),

    // Preview
    React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
      React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'search', size: 20 }), t('budgetImport.preview')),

      preview ? React.createElement('div', null,
        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', marginBottom: '12px' } },
          React.createElement('div', { style: { fontWeight: '600', marginTop: '4px' } }, preview.fileName),
          React.createElement('div', { style: { fontSize: '12px', color: palette.mid, marginTop: '6px' } }, preview.count + ' entries'),
          React.createElement('div', { style: { fontSize: '12px', color: palette.mid } }, t('common.total') + ': CHF ' + preview.totalAmount.toFixed(2))
        ),

        React.createElement('div', { style: { maxHeight: '300px', overflowY: 'auto', marginBottom: '12px' } },
          preview.entries.slice(0, 10).map((entry, idx) => React.createElement('div', { key: idx, style: { padding: '8px', background: palette.up, borderRadius: '4px', marginBottom: '4px', fontSize: '11px' } },
            React.createElement('div', null,
              React.createElement('span', { style: { fontWeight: '600' } }, entry.description),
              React.createElement('span', { style: { float: 'right' } }, (entry.type === 'income' ? '+' : '-') + ' CHF ' + entry.amount.toFixed(2))
            ),
            React.createElement('div', { style: { color: palette.mid, fontSize: '10px', marginTop: '2px' } }, entry.date + ' | ' + entry.category)
          ))
        ),

        React.createElement('div', { style: { display: 'flex', gap: '8px' } },
          React.createElement('button', { onClick: handleImportConfirm, style: { ...buttonStyle, flex: 1 } }, '✓ ' + t('common.save')),
          React.createElement('button', { onClick: () => setPreview(null), style: { flex: 1, padding: '10px 16px', background: palette.up, border: '1px solid ' + palette.border, borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', color: palette.text } }, t('common.cancel'))
        )
      ) : React.createElement('div', { style: { color: palette.mid, textAlign: 'center', padding: '40px 20px' } },
        React.createElement('div', { style: { fontSize: '18px', marginBottom: '8px' } }, '□'),
        React.createElement('div', { style: { fontWeight: '600' } }, t('budgetImport.noFile')),
        React.createElement('div', { style: { fontSize: '11px', marginTop: '8px' } }, t('budgetImport.selectCsvOrExcel'))
      )
    ),

    React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginTop: '12px' } }, '○ ' + t('trust.localOnly'))
  ));
};

export default BudgetImport;
