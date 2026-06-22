import React, { useState, useEffect } from 'react';
import { prepareDataForExport, prepareDownloadFiles, initiateBrowserDownload } from './zipExport.js';
import { exportPlaintext, exportEncrypted, decryptBackup, parsePlaintextBackup, detectBackupType, createPreRestoreSnapshot, applyBackup, downloadFile } from './utils/backupCrypto.js';
import { validateBackupPayload } from './utils/dataValidation.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, radius } from './config/tokens.js';
import { getFullName } from './config/constants.js';
import { runtimeEventBus } from './runtime/singleton.ts';

export const ZipExport = ({ palette, t, data, documents, demoMode }) => {
  const [exporting, setExporting] = useState(false);

  if (demoMode) {
    return React.createElement('div', {
      style: { maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '40px 20px' }
    },
      React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, marginBottom: '12px' } }, t('demo.exportBlocked')),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t('demo.bannerText'))
    );
  }

  // Backup & Restore state
  const [passphrase, setPassphrase] = useState('');
  const [passphraseConfirm, setPassphraseConfirm] = useState('');
  const [backupStatus, setBackupStatus] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importPassphrase, setImportPassphrase] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingType, setPendingType] = useState(null);
  const [validationWarnings, setValidationWarnings] = useState([]);

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

  const handleExportPlainBackup = () => {
    setBackupStatus(null);
    try {
      const json = exportPlaintext();
      const date = new Date().toISOString().split('T')[0];
      downloadFile('maloja-plana-backup-' + date + '.json', json, 'application/json');
      setBackupStatus({ type: 'success', msg: t('backup.exportSuccess') });
      localStorage.setItem('or5_lastBackup', new Date().toISOString());
      runtimeEventBus.publish({
        id: crypto.randomUUID(),
        eventType: 'BACKUP_EXPORTED',
        timestamp: new Date().toISOString(),
        actor: 'user',
        workflowId: 'backup',
      });
    } catch (e) {
      setBackupStatus({ type: 'error', msg: e.message });
    }
  };

  const handleExportEncryptedBackup = async () => {
    setBackupStatus(null);
    if (!passphrase || passphrase.length < 4) {
      setBackupStatus({ type: 'error', msg: t('backup.passphraseHint') });
      return;
    }
    if (passphrase !== passphraseConfirm) {
      setBackupStatus({ type: 'error', msg: t('backup.passphraseMismatch') });
      return;
    }
    setBackupStatus({ type: 'info', msg: t('backup.encrypting') });
    try {
      const encrypted = await exportEncrypted(passphrase);
      const date = new Date().toISOString().split('T')[0];
      downloadFile('maloja-plana-backup-' + date + '.maloja', encrypted, 'application/octet-stream');
      localStorage.setItem('or5_lastBackup', new Date().toISOString());
      setBackupStatus({ type: 'success', msg: t('backup.exportSuccess') });
      setPassphrase('');
      setPassphraseConfirm('');
    } catch (e) {
      setBackupStatus({ type: 'error', msg: e.message });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackupStatus(null);
    setValidationWarnings([]);

    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result;
      const type = detectBackupType(buffer);
      if (type === 'unknown') {
        setBackupStatus({ type: 'error', msg: t('backup.invalidFile') });
        return;
      }
      setPendingFile(buffer);
      setPendingType(type);
      if (type === 'encrypted') {
        setImporting(true);
      } else {
        processPlaintextImport(buffer);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const processPlaintextImport = (buffer) => {
    try {
      const text = new TextDecoder().decode(buffer);
      const backup = parsePlaintextBackup(text);
      confirmAndRestore(backup);
    } catch (e) {
      setBackupStatus({ type: 'error', msg: t('backup.importFailed', { error: e.message }) });
    }
  };

  const handleDecryptAndImport = async () => {
    if (!pendingFile || !importPassphrase) return;
    setBackupStatus({ type: 'info', msg: t('backup.decrypting') });
    try {
      const backup = await decryptBackup(pendingFile, importPassphrase);
      setImporting(false);
      setImportPassphrase('');
      setPendingFile(null);
      setPendingType(null);
      confirmAndRestore(backup);
    } catch (e) {
      setBackupStatus({ type: 'error', msg: t('backup.wrongPassphrase') });
    }
  };

  const confirmAndRestore = (backup) => {
    const validation = validateBackupPayload(backup);
    if (validation.errors.length > 0) {
      setValidationWarnings(validation.errors);
    }

    if (!window.confirm(t('backup.confirmRestore'))) {
      setBackupStatus(null);
      return;
    }

    createPreRestoreSnapshot();
    const result = applyBackup(backup);

    if (result.success) {
      setBackupStatus({ type: 'success', msg: t('backup.importSuccess') });
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setBackupStatus({ type: 'error', msg: t('backup.importFailed', { error: result.error }) });
    }
  };

  const cancelImport = () => {
    setImporting(false);
    setImportPassphrase('');
    setPendingFile(null);
    setPendingType(null);
    setBackupStatus(null);
  };

  const [sessionBackupCount, setSessionBackupCount] = useState(
    () => runtimeEventBus.getEvents().filter(e => e.eventType === 'BACKUP_EXPORTED').length
  );

  useEffect(() => {
    const listener = (event) => {
      if (event.eventType === 'BACKUP_EXPORTED') {
        setSessionBackupCount(c => c + 1);
      }
    };
    runtimeEventBus.subscribe(listener);
    return () => runtimeEventBus.unsubscribe(listener);
  }, []);

  const dataSummary = {
    person: getFullName(data.basis) || '—',
    lastUpdate: new Date().toLocaleDateString('de-CH'),
    documentsCount: documents?.length || 0,
    dataSize: JSON.stringify(data).length
  };

  const inputStyle = {
    width: '100%', padding: space.sm, marginBottom: space.sm, borderRadius: radius.sm,
    border: '1px solid ' + palette.border, background: palette.surface,
    color: palette.text, boxSizing: 'border-box', fontSize: text.sm
  };

  const btnStyle = (bg, fg) => ({
    padding: '10px', background: bg, color: fg || '#fff', border: 'none',
    borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm,
    width: '100%'
  });

  const statusColor = backupStatus?.type === 'success' ? palette.sage
    : backupStatus?.type === 'error' ? palette.rose
    : palette.gold;

  return React.createElement('div', { style: { maxWidth: '720px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' } },

    // Left column: existing export + new backup export
    React.createElement('div', null,
      React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: '20px' } },
        React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'download', size: 20 }), t('zipExport.title')),

        // Summary
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: space.md } },
          React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm } },
            React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('zipExport.person')),
            React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm } }, dataSummary.person)
          ),
          React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm } },
            React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('zipExport.documents')),
            React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm } }, dataSummary.documentsCount)
          ),
          React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm } },
            React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('zipExport.dataSize')),
            React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm } }, (dataSummary.dataSize / 1024).toFixed(1) + ' KB')
          )
        ),

        // Export formats
        React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.md, border: '1px solid ' + palette.border } },
          React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '12px' } }, '↙ ' + t('zipExport.exportFormats')),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: space.sm } },
            React.createElement('button', {
              onClick: handleExportJSON, disabled: exporting,
              style: { padding: '10px', background: exporting ? palette.mid : palette.sand, color: '#fff', border: 'none', borderRadius: radius.sm, cursor: exporting ? 'not-allowed' : 'pointer', fontWeight: weight.semi, fontSize: text.sm }
            }, exporting ? '○ ' + t('zipExport.exporting') : '□ JSON'),
            React.createElement('button', {
              onClick: handleExportCSV, disabled: exporting,
              style: { padding: '10px', background: exporting ? palette.mid : palette.sky, color: '#fff', border: 'none', borderRadius: radius.sm, cursor: exporting ? 'not-allowed' : 'pointer', fontWeight: weight.semi, fontSize: text.sm }
            }, exporting ? '○ ' + t('zipExport.exporting') : '◰ CSV'),
            React.createElement('button', {
              onClick: handleExportManifest, disabled: exporting,
              style: { padding: '10px', background: exporting ? palette.mid : palette.sage, color: exporting ? '#fff' : '#000', border: 'none', borderRadius: radius.sm, cursor: exporting ? 'not-allowed' : 'pointer', fontWeight: weight.semi, fontSize: text.sm }
            }, exporting ? '○ ' + t('zipExport.exporting') : '□ Manifest')
          )
        ),

        // Info
        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm } },
          React.createElement('h4', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: space.sm } }, '○ ' + t('zipExport.whatIsExported')),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.6' } },
            React.createElement('div', null, '✓ ' + t('zipExport.allChapterData')),
            React.createElement('div', null, '✓ ' + t('zipExport.documentMetadata')),
            React.createElement('div', null, '✓ ' + t('zipExport.settingsAndPreferences'))
          )
        )
      ),

      // Encrypted backup export
      React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
        React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'lock', size: 20 }), t('backup.title')),

        sessionBackupCount > 0 && React.createElement('div', {
          style: { fontSize: text.sm, color: palette.mid, marginBottom: '12px', padding: '8px 12px', background: palette.up, borderRadius: radius.sm }
        }, 'Sitzung: ' + sessionBackupCount + (sessionBackupCount === 1 ? ' Backup erstellt' : ' Backups erstellt')),

        React.createElement('button', { onClick: handleExportPlainBackup, style: btnStyle(palette.sand) }, '□ ' + t('backup.exportPlain')),

        React.createElement('div', { style: { margin: '16px 0 8px', fontSize: text.sm, fontWeight: weight.semi } }, t('backup.exportEncrypted')),
        React.createElement('input', {
          type: 'password', value: passphrase, placeholder: t('backup.passphrase'),
          onChange: (e) => setPassphrase(e.target.value), style: inputStyle
        }),
        React.createElement('input', {
          type: 'password', value: passphraseConfirm, placeholder: t('backup.passphraseConfirm'),
          onChange: (e) => setPassphraseConfirm(e.target.value), style: inputStyle
        }),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm } }, t('backup.passphraseHint')),
        React.createElement('button', {
          onClick: handleExportEncryptedBackup,
          disabled: !passphrase || passphrase.length < 4 || passphrase !== passphraseConfirm,
          style: btnStyle(passphrase && passphrase.length >= 4 && passphrase === passphraseConfirm ? palette.gold : palette.mid, '#000')
        }, '◉ ' + t('backup.exportEncrypted')),

        React.createElement('div', { style: { fontSize: text.xs, color: palette.sky, marginTop: '12px', padding: space.sm, background: palette.sky + '08', borderRadius: '4px' } }, t('backup.encryptionInfo'))
      )
    ),

    // Right column: import/restore
    React.createElement('div', null,
      React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
        React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'upload', size: 20 }), t('backup.importFile')),

        React.createElement('label', { style: { display: 'block', padding: '20px', background: palette.up, border: '2px dashed ' + palette.border, borderRadius: radius.sm, textAlign: 'center', cursor: 'pointer', marginBottom: '12px' } },
          React.createElement('input', { type: 'file', accept: '.json,.maloja', onChange: handleFileSelect, style: { display: 'none' } }),
          React.createElement('div', { style: { fontSize: text.lg, marginBottom: space.xs } }, '□'),
          React.createElement('div', { style: { fontWeight: weight.semi } }, t('backup.selectFile')),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } }, t('backup.fileTypes'))
        ),

        // Decrypt passphrase prompt (shown for encrypted files)
        importing && React.createElement('div', { style: { padding: space.md, background: palette.gold + '22', borderRadius: radius.sm, marginBottom: '12px', border: '1px solid ' + palette.gold } },
          React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: space.sm } }, t('backup.passphrase')),
          React.createElement('input', {
            type: 'password', value: importPassphrase, placeholder: t('backup.passphrase'),
            onChange: (e) => setImportPassphrase(e.target.value), style: inputStyle,
            autoFocus: true
          }),
          React.createElement('div', { style: { display: 'flex', gap: space.sm } },
            React.createElement('button', {
              onClick: handleDecryptAndImport, disabled: !importPassphrase,
              style: { ...btnStyle(importPassphrase ? palette.gold : palette.mid, '#000'), flex: 1 }
            }, '◉ ' + t('backup.decrypting')),
            React.createElement('button', {
              onClick: cancelImport,
              style: { ...btnStyle(palette.up, palette.text), flex: 1, border: '1px solid ' + palette.border }
            }, t('common.cancel'))
          )
        ),

        // Status messages
        backupStatus && React.createElement('div', {
          role: 'alert',
          style: { padding: '12px', background: statusColor + '22', borderRadius: radius.sm, marginBottom: '12px', border: '1px solid ' + statusColor, fontSize: text.sm, fontWeight: weight.medium, display: 'flex', alignItems: 'center', gap: '10px' }
        },
          backupStatus.type === 'success' && React.createElement('svg', {
            viewBox: '0 0 20 20', style: { width: '20px', height: '20px', flexShrink: 0, animation: 'mp-lock-close 0.4s ease-out forwards' }
          },
            React.createElement('rect', { x: '4', y: '9', width: '12', height: '10', rx: '2', fill: palette.sage }),
            React.createElement('path', { d: 'M 7 9 L 7 6 C 7 3.5 10 1.5 13 3.5 L 13 9', fill: 'none', stroke: palette.sage, strokeWidth: '1.5', strokeLinecap: 'round' }),
            React.createElement('polyline', { points: '8,14 10,16 13,12', fill: 'none', stroke: 'white', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round', style: { animation: 'mp-check-pop 0.3s 0.3s ease-out both' } }),
          ),
          backupStatus.msg
        ),

        // Validation warnings
        validationWarnings.length > 0 && React.createElement('div', { style: { padding: '12px', background: palette.gold + '22', borderRadius: radius.sm, marginBottom: '12px', border: '1px solid ' + palette.gold, fontSize: text.sm } },
          React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: '6px' } }, t('backup.validationErrors')),
          validationWarnings.map((w, i) => React.createElement('div', { key: i, style: { color: palette.mid } }, '• ' + w))
        ),

        // Safety note
        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, marginBottom: '12px' } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.6' } },
            React.createElement('div', null, '✓ ' + t('backup.preRestoreNote')),
            React.createElement('div', null, '✓ ' + t('backup.encryptionInfo'))
          )
        ),

        // Security warning
        React.createElement('div', { style: { padding: '12px', background: palette.rose + '22', borderRadius: radius.sm, border: '1px solid ' + palette.rose, fontSize: text.sm, color: palette.mid } },
          React.createElement('strong', { style: { color: palette.rose } }, '◉ ' + t('zipExport.security') + ':'),
          React.createElement('div', { style: { marginTop: '6px' } }, t('zipExport.securityNote'))
        )
      )
    )
  );
};

export default ZipExport;
