import React, { useState, useEffect } from 'react';
import { prepareDataForExport, prepareDownloadFiles, initiateBrowserDownload } from './zipExport.js';
import { exportPlaintext, exportEncrypted, decryptBackup, parsePlaintextBackup, detectBackupType, createPreRestoreSnapshot, applyBackup, downloadFile } from './utils/backupCrypto.js';
import { validateBackupPayload } from './utils/dataValidation.js';
import { Icon } from './IconSystem.jsx';
import { runtimeEventBus } from './runtime/singleton.ts';

export const ZipExport = ({ palette, t, data, documents }) => {
  const [exporting, setExporting] = useState(false);

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
    person: data.basis?.fullName || '—',
    lastUpdate: new Date().toLocaleDateString('de-CH'),
    documentsCount: documents?.length || 0,
    dataSize: JSON.stringify(data).length
  };

  const inputStyle = {
    width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '6px',
    border: '1px solid ' + palette.border, background: palette.surface,
    color: palette.text, boxSizing: 'border-box', fontSize: '12px'
  };

  const btnStyle = (bg, fg) => ({
    padding: '10px', background: bg, color: fg || '#fff', border: 'none',
    borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px',
    width: '100%'
  });

  const statusColor = backupStatus?.type === 'success' ? palette.sage
    : backupStatus?.type === 'error' ? palette.rose
    : palette.gold;

  return React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' } },

    // Left column: existing export + new backup export
    React.createElement('div', null,
      React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border, marginBottom: '20px' } },
        React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'download', size: 20 }), t('zipExport.title')),

        // Summary
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '16px' } },
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
          )
        ),

        // Export formats
        React.createElement('div', { style: { padding: '16px', background: palette.up, borderRadius: '6px', marginBottom: '16px', border: '2px solid ' + palette.gold } },
          React.createElement('h3', { style: { fontSize: '13px', fontWeight: '600', marginBottom: '12px' } }, '↙ ' + t('zipExport.exportFormats')),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' } },
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
        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px' } },
          React.createElement('h4', { style: { fontSize: '12px', fontWeight: '600', marginBottom: '8px' } }, '○ ' + t('zipExport.whatIsExported')),
          React.createElement('div', { style: { fontSize: '11px', color: palette.mid, lineHeight: '1.6' } },
            React.createElement('div', null, '✓ ' + t('zipExport.allChapterData')),
            React.createElement('div', null, '✓ ' + t('zipExport.documentMetadata')),
            React.createElement('div', null, '✓ ' + t('zipExport.settingsAndPreferences'))
          )
        )
      ),

      // Encrypted backup export
      React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
        React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'lock', size: 20 }), t('backup.title')),

        sessionBackupCount > 0 && React.createElement('div', {
          style: { fontSize: '11px', color: palette.mid, marginBottom: '12px', padding: '8px 12px', background: palette.up, borderRadius: '6px' }
        }, 'Sitzung: ' + sessionBackupCount + (sessionBackupCount === 1 ? ' Backup erstellt' : ' Backups erstellt')),

        React.createElement('button', { onClick: handleExportPlainBackup, style: btnStyle(palette.sand) }, '□ ' + t('backup.exportPlain')),

        React.createElement('div', { style: { margin: '16px 0 8px', fontSize: '12px', fontWeight: '600' } }, t('backup.exportEncrypted')),
        React.createElement('input', {
          type: 'password', value: passphrase, placeholder: t('backup.passphrase'),
          onChange: (e) => setPassphrase(e.target.value), style: inputStyle
        }),
        React.createElement('input', {
          type: 'password', value: passphraseConfirm, placeholder: t('backup.passphraseConfirm'),
          onChange: (e) => setPassphraseConfirm(e.target.value), style: inputStyle
        }),
        React.createElement('div', { style: { fontSize: '10px', color: palette.mid, marginBottom: '8px' } }, t('backup.passphraseHint')),
        React.createElement('button', {
          onClick: handleExportEncryptedBackup,
          disabled: !passphrase || passphrase.length < 4 || passphrase !== passphraseConfirm,
          style: btnStyle(passphrase && passphrase.length >= 4 && passphrase === passphraseConfirm ? palette.gold : palette.mid, '#000')
        }, '◉ ' + t('backup.exportEncrypted')),

        React.createElement('div', { style: { fontSize: '10px', color: palette.mid, marginTop: '12px', padding: '8px', background: palette.up, borderRadius: '4px' } }, t('backup.encryptionInfo'))
      )
    ),

    // Right column: import/restore
    React.createElement('div', null,
      React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
        React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'upload', size: 20 }), t('backup.importFile')),

        React.createElement('label', { style: { display: 'block', padding: '20px', background: palette.up, border: '2px dashed ' + palette.border, borderRadius: '8px', textAlign: 'center', cursor: 'pointer', marginBottom: '12px' } },
          React.createElement('input', { type: 'file', accept: '.json,.maloja', onChange: handleFileSelect, style: { display: 'none' } }),
          React.createElement('div', { style: { fontSize: '18px', marginBottom: '4px' } }, '□'),
          React.createElement('div', { style: { fontWeight: '600' } }, t('backup.selectFile')),
          React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginTop: '4px' } }, t('backup.fileTypes'))
        ),

        // Decrypt passphrase prompt (shown for encrypted files)
        importing && React.createElement('div', { style: { padding: '16px', background: palette.gold + '22', borderRadius: '6px', marginBottom: '12px', border: '1px solid ' + palette.gold } },
          React.createElement('div', { style: { fontSize: '12px', fontWeight: '600', marginBottom: '8px' } }, t('backup.passphrase')),
          React.createElement('input', {
            type: 'password', value: importPassphrase, placeholder: t('backup.passphrase'),
            onChange: (e) => setImportPassphrase(e.target.value), style: inputStyle,
            autoFocus: true
          }),
          React.createElement('div', { style: { display: 'flex', gap: '8px' } },
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
          style: { padding: '12px', background: statusColor + '22', borderRadius: '6px', marginBottom: '12px', border: '1px solid ' + statusColor, fontSize: '12px', fontWeight: '500' }
        }, backupStatus.msg),

        // Validation warnings
        validationWarnings.length > 0 && React.createElement('div', { style: { padding: '12px', background: palette.gold + '22', borderRadius: '6px', marginBottom: '12px', border: '1px solid ' + palette.gold, fontSize: '11px' } },
          React.createElement('div', { style: { fontWeight: '600', marginBottom: '6px' } }, t('backup.validationErrors')),
          validationWarnings.map((w, i) => React.createElement('div', { key: i, style: { color: palette.mid } }, '• ' + w))
        ),

        // Safety note
        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', marginBottom: '12px' } },
          React.createElement('div', { style: { fontSize: '11px', color: palette.mid, lineHeight: '1.6' } },
            React.createElement('div', null, '✓ ' + t('backup.preRestoreNote')),
            React.createElement('div', null, '✓ ' + t('backup.encryptionInfo'))
          )
        ),

        // Security warning
        React.createElement('div', { style: { padding: '12px', background: palette.rose + '22', borderRadius: '6px', border: '1px solid ' + palette.rose, fontSize: '11px', color: palette.mid } },
          React.createElement('strong', { style: { color: palette.rose } }, '◉ ' + t('zipExport.security') + ':'),
          React.createElement('div', { style: { marginTop: '6px' } }, t('zipExport.securityNote'))
        )
      )
    )
  );
};

export default ZipExport;
