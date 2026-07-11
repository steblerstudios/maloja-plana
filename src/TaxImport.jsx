import React, { useState } from 'react';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { importTaxFromFile, applyTaxToFinanzen } from './taxImport.js';
import { text, weight, radius, space, leading } from './config/tokens.js';
import { Icon } from './IconSystem.jsx';
import { PrimaryButton } from './components/PrimaryButton.jsx';

// Steuerdatei-Import — ruhige Übernahme der Eckwerte aus einer Steuererklärung.
// Spiegelt das Muster von BudgetImport: Datei wählen -> Vorschau -> bestätigen.
// Überschreibt bewusst nie bestehende Werte (fill-if-empty).
export const TaxImport = ({ palette, t, currentFinanzen = {}, onImport, onNavigate }) => {
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [importError, setImportError] = useState(null);

  const fmt = (n) => 'CHF ' + Number(n).toLocaleString('de-CH');

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportError(null);
    setPreview(null);
    try {
      const { matched, unmatched } = await importTaxFromFile(file);
      const { applied, kept } = applyTaxToFinanzen(matched, currentFinanzen);
      setPreview({ fileName: file.name, matched, applied, kept, unmatchedCount: unmatched.length });
    } catch (err) {
      setImportError(t('taxImport.importFailed'));
    } finally {
      setImporting(false);
      e.target.value = ''; // dieselbe Datei nach Fehler/Vorschau erneut wählbar machen
    }
  };

  const handleConfirm = () => {
    if (!preview) return;
    const { merged } = applyTaxToFinanzen(preview.matched, currentFinanzen);
    onImport(merged);
    setPreview(null);
    if (onNavigate) onNavigate('finanzuebersicht');
  };

  const card = { background: palette.surface, padding: '20px', borderRadius: radius.md, border: '1px solid ' + palette.border };

  const fieldRow = (f, mode) => React.createElement('div', {
    key: mode + f.target,
    style: { padding: space.sm, background: palette.up, borderRadius: radius.sm, marginBottom: space.xs }
  },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: space.sm } },
      React.createElement('span', { style: { fontWeight: weight.semi, fontSize: text.sm } }, t(f.labelKey)),
      React.createElement('span', { style: { fontSize: text.sm, color: mode === 'keep' ? palette.mid : palette.text, fontWeight: weight.semi } },
        mode === 'keep' ? fmt(f.existing) : fmt(f.value) + (f.period === 'annual' ? ' ' + t('common.perMonth') : ''))
    ),
    f.period === 'annual' && mode === 'fill' && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } },
      t('taxImport.annualNote').replace('{annual}', fmt(f.annualValue))),
    mode === 'keep' && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } }, t('taxImport.keptHint'))
  );

  return React.createElement('div', { style: { maxWidth: '760px' } },
    React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, margin: '0 0 ' + space.md + 'px 0' } }, t('taxImport.intro')),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' } },
      // Upload
      React.createElement('div', { style: card },
        React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'document', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('taxImport.title')),

        React.createElement('label', { style: { display: 'block', padding: '20px', background: palette.up, border: '2px dashed ' + palette.border, borderRadius: radius.sm, textAlign: 'center', cursor: 'pointer', marginBottom: '12px' } },
          React.createElement('input', { type: 'file', accept: '.csv,.txt,.tsv,.xml,.tax', onChange: handleFileSelect, style: { display: 'none' } }),
          React.createElement('div', { style: { fontWeight: weight.semi } }, t('taxImport.selectFile')),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } }, t('taxImport.fileTypes'))
        ),

        importing && React.createElement('div', { style: { padding: '12px', background: palette.gold + '22', borderRadius: radius.sm, textAlign: 'center', color: palette.goldDeep, fontWeight: weight.semi } }, 'ⓘ ' + t('taxImport.importing')),
        importError && React.createElement('div', { style: { padding: '12px', background: palette.rose + '22', borderRadius: radius.sm, textAlign: 'center', color: palette.roseDeep, fontWeight: weight.semi, marginTop: space.sm } }, '✕ ' + importError),

        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, padding: '12px', background: palette.up, borderRadius: radius.sm, marginTop: space.sm } },
          React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: '6px' } }, t('taxImport.formatExample') + ':'),
          React.createElement('code', { style: { display: 'block', fontSize: text.xs, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' } },
            "Bruttolohn; 60'000\nWertschriften; 12'000\nSparkonto; 18'500\nSteuerbetrag; 4'800")
        )
      ),

      // Vorschau
      React.createElement('div', { style: card },
        React.createElement(PanelTitle, { palette, icon: React.createElement(Icon, { name: 'search', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('taxImport.preview')),

        preview ? React.createElement('div', null,
          React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm, marginBottom: space.sm } }, preview.fileName),

          preview.matched.length === 0
            ? React.createElement('div', { style: { color: palette.mid, fontSize: text.sm, padding: '20px 0' } }, t('taxImport.nothingFound'))
            : React.createElement('div', null,
                preview.applied.length > 0 && React.createElement('div', { style: { marginBottom: space.sm } },
                  React.createElement('div', { style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: space.xs } }, t('taxImport.willFill')),
                  preview.applied.map(f => fieldRow(f, 'fill'))
                ),
                preview.kept.length > 0 && React.createElement('div', { style: { marginBottom: space.sm } },
                  React.createElement('div', { style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: space.xs } }, t('taxImport.willKeep')),
                  preview.kept.map(f => fieldRow(f, 'keep'))
                ),
                React.createElement('div', { style: { display: 'flex', gap: space.sm, marginTop: space.sm } },
                  preview.applied.length > 0 && React.createElement(PrimaryButton, { palette, onClick: handleConfirm, style: { flex: 1 } }, '✓ ' + t('common.save')),
                  React.createElement('button', { onClick: () => setPreview(null), style: { flex: 1, padding: '10px 16px', background: palette.up, border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm, color: palette.text } }, t('common.cancel'))
                )
              )
        ) : React.createElement('div', { style: { color: palette.mid, textAlign: 'center', padding: '40px 20px' } },
          React.createElement('div', { style: { fontWeight: weight.semi } }, t('taxImport.noFile')),
          React.createElement('div', { style: { fontSize: text.sm, marginTop: space.sm } }, t('taxImport.noFileHint'))
        )
      )
    ),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '16px' } }, 'ⓘ ' + t('trust.localOnly'))
  );
};

export default TaxImport;
