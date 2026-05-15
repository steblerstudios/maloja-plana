import React, { useState } from 'react';
import { prepareDataForExport, prepareDownloadFiles, initiateBrowserDownload } from './zipExport.js';
import { Icon } from './IconSystem.jsx';

export const ZipExport = ({ palette, t, data, documents }) => {
  const [exporting, setExporting] = useState(false);

  const handleExportJSON = () => {
    setExporting(true);
    const files = prepareDownloadFiles(data, documents);
    setTimeout(() => {
      initiateBrowserDownload(files.json.filename, files.json.content, 'application/json');
      setExporting(false);
    }, 500);
  };

  const handleExportCSV = () => {
    setExporting(true);
    const files = prepareDownloadFiles(data, documents);
    setTimeout(() => {
      initiateBrowserDownload(files.csv.filename, files.csv.content, 'text/csv');
      setExporting(false);
    }, 500);
  };

  const handleExportManifest = () => {
    setExporting(true);
    const { manifest } = prepareDownloadFiles(data, documents);
    setTimeout(() => {
      initiateBrowserDownload(manifest.filename, manifest.content, 'text/plain');
      setExporting(false);
    }, 500);
  };

  const dataSummary = {
    person: data.basis?.fullName || '—',
    lastUpdate: new Date().toLocaleDateString('de-CH'),
    documentsCount: documents?.length || 0,
    dataSize: JSON.stringify(data).length
  };

  return React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
    React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'download', size: 20 }), t('zipExport.title')),

    // Summary
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' } },
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px' } },
        React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginBottom: '4px' } }, t('zipExport.person')),
        React.createElement('div', { style: { fontWeight: '600', fontSize: '13px' } }, dataSummary.person)
      ),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px' } },
        React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginBottom: '4px' } }, t('zipExport.documents')),
        React.createElement('div', { style: { fontWeight: '600', fontSize: '13px' } }, dataSummary.documentsCount)
      ),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px' } },
        React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginBottom: '4px' } }, t('zipExport.dataSize')),
        React.createElement('div', { style: { fontWeight: '600', fontSize: '13px' } }, (dataSummary.dataSize / 1024).toFixed(1) + ' KB')
      ),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px' } },
        React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginBottom: '4px' } }, t('zipExport.lastExport')),
        React.createElement('div', { style: { fontWeight: '600', fontSize: '13px' } }, dataSummary.lastUpdate)
      )
    ),

    // Export Options
    React.createElement('div', { style: { padding: '16px', background: palette.up, borderRadius: '6px', marginBottom: '16px', border: '2px solid ' + palette.gold } },
      React.createElement('h3', { style: { fontSize: '13px', fontWeight: '600', marginBottom: '12px' } }, '↙ ' + t('zipExport.exportFormats')),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' } },
        React.createElement('button', {
          onClick: handleExportJSON, disabled: exporting,
          style: { padding: '10px', background: exporting ? palette.mid : palette.sand, color: '#fff', border: 'none', borderRadius: '6px', cursor: exporting ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '12px' }
        }, exporting ? '○ ' + t('zipExport.exporting') : '□ JSON'),
        React.createElement('button', {
          onClick: handleExportCSV, disabled: exporting,
          style: { padding: '10px', background: exporting ? palette.mid : palette.sky, color: '#fff', border: 'none', borderRadius: '6px', cursor: exporting ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '12px' }
        }, exporting ? '○ ' + t('zipExport.exporting') : '◰ CSV'),
        React.createElement('button', {
          onClick: handleExportManifest, disabled: exporting,
          style: { padding: '10px', background: exporting ? palette.mid : palette.sage, color: exporting ? '#fff' : '#000', border: 'none', borderRadius: '6px', cursor: exporting ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '12px' }
        }, exporting ? '○ ' + t('zipExport.exporting') : '□ Manifest')
      )
    ),

    // Info
    React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', marginBottom: '16px' } },
      React.createElement('h4', { style: { fontSize: '12px', fontWeight: '600', marginBottom: '8px' } }, '○ ' + t('zipExport.whatIsExported')),
      React.createElement('div', { style: { fontSize: '11px', color: palette.mid, lineHeight: '1.6' } },
        React.createElement('div', null, '✓ ' + t('zipExport.allChapterData')),
        React.createElement('div', null, '✓ ' + t('zipExport.documentMetadata')),
        React.createElement('div', null, '✓ ' + t('zipExport.settingsAndPreferences'))
      )
    ),

    // Security
    React.createElement('div', { style: { padding: '12px', background: palette.rose + '22', borderRadius: '6px', border: '1px solid ' + palette.rose, fontSize: '11px', color: palette.mid } },
      React.createElement('strong', { style: { color: palette.rose } }, '◉ ' + t('zipExport.security') + ':'),
      React.createElement('div', { style: { marginTop: '6px' } }, t('zipExport.securityNote'))
    )
  );
};

export default ZipExport;
