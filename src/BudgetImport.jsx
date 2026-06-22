import React, { useState } from 'react';
import { importBudgetFromFile, processBudgetEntries } from './csvImport.js';
import { text, weight, radius } from './config/tokens.js';
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
    padding: '10px 16px', background: palette.sand, color: '#fff', border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm
  };

  const inputStyle = {
    width: '100%', padding: space.sm, borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box', fontSize: text.sm
  };

  return React.createElement('div', { style: { maxWidth: '720px' } },
   React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' } },
    // Upload
    React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
      React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'csv', size: 20 }), t('budgetImport.title')),

      React.createElement('label', { style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.sm, fontWeight: weight.medium } }, t('budgetImport.fileFormat')),
      React.createElement('select', { value: importType, onChange: (e) => setImportType(e.target.value), style: { ...inputStyle, marginBottom: space.md } },
        React.createElement('option', { value: 'csv' }, t('budgetImport.csv')),
        React.createElement('option', { value: 'excel' }, t('budgetImport.excel')),
        React.createElement('option', { value: 'ebill' }, t('budgetImport.ebill')),
        React.createElement('option', { value: 'text' }, t('budgetImport.tsv'))
      ),

      React.createElement('label', { style: { display: 'block', padding: '20px', background: palette.up, border: '2px dashed ' + palette.border, borderRadius: radius.sm, textAlign: 'center', cursor: 'pointer', marginBottom: '12px' } },
        React.createElement('input', { type: 'file', accept: '.csv,.xlsx,.xls,.txt,.tsv', onChange: handleFileSelect, style: { display: 'none' } }),
        React.createElement('div', { style: { fontSize: text.lg, marginBottom: space.xs } }, '□'),
        React.createElement('div', { style: { fontWeight: weight.semi } }, t('budgetImport.selectFile')),
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } }, t('budgetImport.orDragHere'))
      ),

      importing && React.createElement('div', { style: { padding: '12px', background: palette.gold + '22', borderRadius: radius.sm, textAlign: 'center', color: palette.gold, fontWeight: weight.semi } }, '○ ' + t('budgetImport.importing')),

      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, padding: '12px', background: palette.up, borderRadius: radius.sm } },
        React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: '6px' } }, '□ ' + t('budgetImport.formatExample') + ':'),
        React.createElement('code', { style: { display: 'block', fontSize: text.xs, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: '6px' } },
          `Date,Description,Amount,Category,Type
01.04.2024,Rent,1500,rent,expense
02.04.2024,Salary,4000,income,income
05.04.2024,KK Premium,280,insurance,expense`
        )
      )
    ),

    // Preview
    React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
      React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'search', size: 20 }), t('budgetImport.preview')),

      preview ? React.createElement('div', null,
        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, marginBottom: '12px' } },
          React.createElement('div', { style: { fontWeight: weight.semi, marginTop: space.xs } }, preview.fileName),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '6px' } }, preview.count + ' entries'),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t('common.total') + ': CHF ' + preview.totalAmount.toFixed(2))
        ),

        React.createElement('div', { style: { maxHeight: '300px', overflowY: 'auto', marginBottom: '12px' } },
          preview.entries.slice(0, 10).map((entry, idx) => React.createElement('div', { key: idx, style: { padding: space.sm, background: palette.up, borderRadius: '4px', marginBottom: space.xs, fontSize: text.sm } },
            React.createElement('div', null,
              React.createElement('span', { style: { fontWeight: weight.semi } }, entry.description),
              React.createElement('span', { style: { float: 'right' } }, (entry.type === 'income' ? '+' : '-') + ' CHF ' + entry.amount.toFixed(2))
            ),
            React.createElement('div', { style: { color: palette.mid, fontSize: text.xs, marginTop: '2px' } }, entry.date + ' | ' + entry.category)
          ))
        ),

        React.createElement('div', { style: { display: 'flex', gap: space.sm } },
          React.createElement('button', { onClick: handleImportConfirm, style: { ...buttonStyle, flex: 1 } }, '✓ ' + t('common.save')),
          React.createElement('button', { onClick: () => setPreview(null), style: { flex: 1, padding: '10px 16px', background: palette.up, border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm, color: palette.text } }, t('common.cancel'))
        )
      ) : React.createElement('div', { style: { color: palette.mid, textAlign: 'center', padding: '40px 20px' } },
        React.createElement('div', { style: { fontSize: text.lg, marginBottom: space.sm } }, '□'),
        React.createElement('div', { style: { fontWeight: weight.semi } }, t('budgetImport.noFile')),
        React.createElement('div', { style: { fontSize: text.sm, marginTop: space.sm } }, t('budgetImport.selectCsvOrExcel'))
      )
    ),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, '○ ' + t('trust.localOnly'))
  ));
};

export default BudgetImport;
