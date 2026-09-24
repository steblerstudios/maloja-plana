import React, { useState, useEffect, useRef } from 'react';
import { PanelTitle } from './components/Heading.jsx';
import { prepareDownloadFiles, initiateBrowserDownload } from './zipExport.js';
import { exportPlaintext, exportEncrypted, decryptBackup, parsePlaintextBackup, detectBackupType, restoreBackup, exceedsBackupFileLimit, downloadFile, MIN_PASSPHRASE_LENGTH, passphraseLangGenug } from './utils/backupCrypto.js';
import { validateBackupPayload } from './utils/dataValidation.js';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { ExportVorschau } from './components/ExportVorschau.jsx';
import { text, weight, radius, space, visuallyHiddenStyle } from './config/tokens.js';
import { getFullName } from './config/constants.js';
import { runtimeEventBus } from './runtime/singleton.ts';
import { GlossarText } from './GlossarBegriff.jsx';

// Inline-Präfix-Icon vor Fliesstext (statt roher Glyphe, docs/TODO.md §G3 P1): sitzt in
// der Textzeile, Farbe erbt vom Elternelement, `aria-hidden` über `Icon` (Muster PR #135).
const praefix = (name, size) => React.createElement(Icon, { name, size, style: { verticalAlign: '-3px', marginRight: '6px' } });

export const ZipExport = ({ palette, t, data, documents, demoMode }) => {
  const [exporting, setExporting] = useState(false);

  // Backup & Restore state
  const [passphrase, setPassphrase] = useState('');
  const [passphraseConfirm, setPassphraseConfirm] = useState('');
  const [backupStatus, setBackupStatus] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importPassphrase, setImportPassphrase] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [, setPendingType] = useState(null);
  const [validationWarnings, setValidationWarnings] = useState([]);
  // Die Rückfrage vor dem Ersetzen steht in der Seite, nicht in einem Browser-Fenster.
  // Bis 24.09.2026 kam hier `window.confirm` — das einzige der App: grau, ohne Anrede-
  // Stil, im Dunkelmodus hell, und am Handy je nach Browser unterdrückbar.
  const [wartendeSicherung, setWartendeSicherung] = useState(null);
  const bestaetigenKnopf = useRef(null);
  useEffect(() => { if (wartendeSicherung) bestaetigenKnopf.current?.focus(); }, [wartendeSicherung]);
  // Export-Vorschau (K3): null | 'json' | 'csv' | 'manifest' | 'sicherung' | 'sicherungVerschluesselt'.
  // Jeder Export-Knopf öffnet zuerst die Vorschau; erst «Datei erstellen» schreibt.
  const [vorschau, setVorschau] = useState(null);

  const handleExportJSON = () => {
    setExporting(true);
    const files = prepareDownloadFiles(data, documents, t);
    setTimeout(() => {
      initiateBrowserDownload(files.json.filename, files.json.content, 'application/json');
      setExporting(false);
    }, 500);
  };

  const handleExportCSV = () => {
    setExporting(true);
    const files = prepareDownloadFiles(data, documents, t);
    setTimeout(() => {
      initiateBrowserDownload(files.csv.filename, files.csv.content, 'text/csv');
      setExporting(false);
    }, 500);
  };

  const handleExportManifest = () => {
    setExporting(true);
    const { manifest } = prepareDownloadFiles(data, documents, t);
    setTimeout(() => {
      initiateBrowserDownload(manifest.filename, manifest.content, 'text/plain');
      setExporting(false);
    }, 500);
  };

  const handleExportPlainBackup = async () => {
    setBackupStatus(null);
    try {
      const json = await exportPlaintext();
      const date = new Date().toISOString().split('T')[0];
      downloadFile('maloja-plana-backup-' + date + '.json', json, 'application/json');
      setBackupStatus({ type: 'success', msg: t('backup.exportSuccess') });
      // K94: Die Datei ist schon heruntergeladen — ein voller Speicher darf daraus keinen Fehler machen.
      try { localStorage.setItem('or5_lastBackup', new Date().toISOString()); } catch { /* nur das Datum fehlt */ }
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

  // Dieselbe Prüfung vor der Vorschau und vor dem Verschlüsseln: die Vorschau soll nie
  // eine Sicherung ankündigen, die dann an einem zu kurzen Passwort scheitert (E10: 12 Zeichen).
  const passphraseOk = () => {
    if (!passphraseLangGenug(passphrase)) {
      setBackupStatus({ type: 'error', msg: t('backup.passphraseHint', { min: MIN_PASSPHRASE_LENGTH }) });
      return false;
    }
    if (passphrase !== passphraseConfirm) {
      setBackupStatus({ type: 'error', msg: t('backup.passphraseMismatch') });
      return false;
    }
    return true;
  };

  const handleExportEncryptedBackup = async () => {
    setBackupStatus(null);
    if (!passphraseOk()) return;
    setBackupStatus({ type: 'info', msg: t('backup.encrypting') });
    try {
      const encrypted = await exportEncrypted(passphrase);
      const date = new Date().toISOString().split('T')[0];
      downloadFile('maloja-plana-backup-' + date + '.maloja', encrypted, 'application/octet-stream');
      try { localStorage.setItem('or5_lastBackup', new Date().toISOString()); } catch { /* K94, wie oben */ }
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

    // Grössenlimit VOR dem Lesen — die Datei wird gar nicht erst in den Speicher
    // geholt (Begründung bei MAX_BACKUP_FILE_BYTES in backupCrypto.js).
    if (exceedsBackupFileLimit(file.size)) {
      setBackupStatus({ type: 'error', msg: t('backup.fileTooLarge', { max: '50 MB' }) });
      e.target.value = '';
      return;
    }

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

  const processPlaintextImport = async (buffer) => {
    try {
      const text = new TextDecoder().decode(buffer);
      const backup = parsePlaintextBackup(text);
      await confirmAndRestore(backup);
    } catch (e) {
      setBackupStatus({ type: 'error', msg: t('backup.importFailed', { error: e.message }) });
    }
  };

  const handleDecryptAndImport = async () => {
    if (!pendingFile || !importPassphrase) return;
    setBackupStatus({ type: 'info', msg: t('backup.decrypting') });
    let backup;
    try {
      backup = await decryptBackup(pendingFile, importPassphrase);
      setImporting(false);
      setImportPassphrase('');
      setPendingFile(null);
      setPendingType(null);
    } catch (e) {
      setBackupStatus({ type: 'error', msg: t('backup.wrongPassphrase') });
      return;
    }
    // Ausserhalb des try: ein Fehler beim Wiederherstellen ist kein falsches Passwort.
    await confirmAndRestore(backup);
  };

  const confirmAndRestore = async (backup) => {
    // Barriere, nicht Warnung: passt der Aufbau nicht, wird nichts geschrieben —
    // und niemand muss erst einen aussichtslosen Restore bestätigen.
    const validation = validateBackupPayload(backup);
    if (!validation.valid) {
      setValidationWarnings(validation.errors);
      setBackupStatus({ type: 'error', msg: t('backup.structureRejected') });
      return;
    }

    setBackupStatus(null);
    setWartendeSicherung(backup);
  };

  const wiederherstellen = async () => {
    const backup = wartendeSicherung;
    setWartendeSicherung(null);
    if (!backup) return;

    // restoreBackup prüft erneut (Barriere gilt unabhängig vom Aufrufer),
    // legt den Snapshot an und schreibt erst dann.
    // R4: auch ein unerwarteter Wurf (Speicher voll) endet in einer ruhigen Meldung,
    // nicht in einem unbehandelten Fehler. restoreBackup schreibt dann nichts.
    let result;
    try {
      result = await restoreBackup(backup);
    } catch (e) {
      setBackupStatus({ type: 'error', msg: t('backup.importFailed', { error: (e && e.message) || String(e) }) });
      return;
    }

    if (result.blocked) {
      setValidationWarnings(result.errors);
      setBackupStatus({ type: 'error', msg: t('backup.structureRejected') });
      return;
    }

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

  // Demo-Modus: Export/Backup gesperrt — der Ausstieg steht bewusst NACH allen
  // Hooks, damit die Hook-Reihenfolge in jedem Render gleich bleibt (Rules of Hooks).
  if (demoMode) {
    return React.createElement('div', {
      style: { maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '40px 20px' }
    },
      React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, marginBottom: '12px' } }, t('demo.exportBlocked')),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t('demo.bannerText'))
    );
  }

  const dataSummary = {
    person: getFullName(data.basis) || '—',
    lastUpdate: new Date().toLocaleDateString('de-CH'),
    documentsCount: documents?.length || 0,
    dataSize: JSON.stringify(data).length
  };

  // Nach «Datei erstellen» der eigentliche Export; die Vorschau erscheint direkt
  // unter dem Knopf, der sie geöffnet hat.
  const exportFuer = {
    json: handleExportJSON,
    csv: handleExportCSV,
    manifest: handleExportManifest,
    sicherung: handleExportPlainBackup,
    sicherungVerschluesselt: handleExportEncryptedBackup,
  };
  const vorschauPanel = (...arten) => (vorschau && arten.includes(vorschau))
    ? React.createElement(ExportVorschau, {
        palette, t, art: vorschau, quelle: { data, documents },
        onWeiter: () => { const f = exportFuer[vorschau]; setVorschau(null); f(); },
        onZurueck: () => setVorschau(null),
      })
    : null;

  const inputStyle = {
    width: '100%', padding: space.sm, marginBottom: space.sm, borderRadius: radius.sm,
    border: '1px solid ' + palette.border, background: palette.surface,
    color: palette.text, boxSizing: 'border-box', fontSize: text.sm
  };

  const btnStyle = (bg, fg) => ({
    // inline-flex + gap: Präfix-Icons (Download, Schloss) sitzen mittig neben dem Text.
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '10px', background: bg, color: fg || '#fff', border: 'none',
    borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm,
    width: '100%'
  });

  // K53: gesperrte Knöpfe. Vorher Schwarz auf mid (hell 3.38:1, von WCAG 1.4.3 zwar
  // ausgenommen, aber schlecht lesbar). Jetzt die ruhige Fläche up mit Text mid
  // (hell 5.25:1, dunkel 4.81:1). Dass der Knopf nicht geht, zeigt nicht die Farbe
  // allein: gestrichelter Rand und Sperr-Cursor tragen das Signal mit.
  const gesperrtStil = {
    background: palette.up, color: palette.mid,
    border: '1px dashed ' + palette.mid, cursor: 'not-allowed',
  };

  const statusColor = backupStatus?.type === 'success' ? palette.sage
    : backupStatus?.type === 'error' ? palette.rose
    : palette.gold;

  return React.createElement('div', { style: { maxWidth: '720px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' } },

    // Left column: existing export + new backup export
    React.createElement('div', null,
      React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: '20px' } },
        React.createElement(PanelTitle, { palette, icon: React.createElement(Icon, { name: 'download', size: 22 }), style: { marginBottom: space.md } }, t('zipExport.title')),

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
          React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '12px' } }, praefix('download', 16), t('zipExport.exportFormats')),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: space.sm } },
            React.createElement('button', {
              onClick: () => setVorschau('json'), disabled: exporting,
              style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: palette.sand, color: palette.onSand, border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm, ...(exporting ? gesperrtStil : null) }
            }, !exporting && React.createElement(Icon, { name: 'kaestchen', size: 14 }), exporting && React.createElement(Icon, { name: 'info', size: 14 }), exporting ? t('zipExport.exporting') : 'JSON'),
            React.createElement('button', {
              onClick: () => setVorschau('csv'), disabled: exporting,
              style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: palette.skyDeep, color: palette.surface, /* Kontrast: onSand/sky 4.496:1 < AA → surface/skyDeep (Voll-Review 15.09.2026) */ border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm, ...(exporting ? gesperrtStil : null) }
            }, !exporting && React.createElement(Icon, { name: 'rechner', size: 14 }), exporting && React.createElement(Icon, { name: 'info', size: 14 }), exporting ? t('zipExport.exporting') : 'CSV'),
            React.createElement('button', {
              onClick: () => setVorschau('manifest'), disabled: exporting,
              style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: palette.sage, color: '#000', border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm, ...(exporting ? gesperrtStil : null) }
            }, !exporting && React.createElement(Icon, { name: 'kaestchen', size: 14 }), exporting && React.createElement(Icon, { name: 'info', size: 14 }), exporting ? t('zipExport.exporting') : 'Manifest')
          ),
          vorschauPanel('json', 'csv', 'manifest')
        ),

        // Info
        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm } },
          React.createElement('h4', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: space.sm } }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('zipExport.whatIsExported'))),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.6' } },
            React.createElement('div', null, hinweisZeichen('check'), t('zipExport.allChapterData')),
            React.createElement('div', null, hinweisZeichen('check'), t('zipExport.documentMetadata')),
            React.createElement('div', null, hinweisZeichen('check'), t('zipExport.settingsAndPreferences'))
          )
        )
      ),

      // Encrypted backup export
      React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
        React.createElement(PanelTitle, { palette, icon: React.createElement(Icon, { name: 'lock', size: 22 }), style: { marginBottom: space.md } }, t('backup.title')),

        sessionBackupCount > 0 && React.createElement('div', {
          style: { fontSize: text.sm, color: palette.mid, marginBottom: '12px', padding: '8px 12px', background: palette.up, borderRadius: radius.sm }
        }, t(sessionBackupCount === 1 ? 'backup.sessionCount' : 'backup.sessionCountPlural', { count: sessionBackupCount })),

        // E10: verschlüsselt ist die Voreinstellung (DSG Art. 7 Abs. 3) — dieser Weg steht
        // zuerst; der unverschlüsselte folgt als bewusste Wahl mit Hinweis.
        React.createElement('div', { style: { margin: '0 0 8px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('backupVoreinstellung.titelVerschluesselt')),
        React.createElement('input', {
          type: 'password', value: passphrase, placeholder: t('backup.passphrase'),
          onChange: (e) => setPassphrase(e.target.value), 'aria-label': t('backup.passphrase'), style: inputStyle
        }),
        React.createElement('input', {
          type: 'password', value: passphraseConfirm, placeholder: t('backup.passphraseConfirm'),
          onChange: (e) => setPassphraseConfirm(e.target.value), 'aria-label': t('backup.passphraseConfirm'), style: inputStyle
        }),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm } }, t('backup.passphraseHint', { min: MIN_PASSPHRASE_LENGTH })),
        React.createElement('button', {
          onClick: () => { setBackupStatus(null); if (passphraseOk()) setVorschau('sicherungVerschluesselt'); },
          disabled: !passphraseLangGenug(passphrase) || passphrase !== passphraseConfirm,
          style: passphraseLangGenug(passphrase) && passphrase === passphraseConfirm ? btnStyle(palette.gold, '#000') : { ...btnStyle(palette.gold, '#000'), ...gesperrtStil }
        }, React.createElement(Icon, { name: 'lock', size: 14 }), t('backup.exportEncrypted')),
        vorschauPanel('sicherungVerschluesselt'),

        React.createElement('div', { style: { fontSize: text.xs, color: palette.skyDeep, marginTop: '12px', padding: space.sm, background: palette.sky + '08', borderRadius: '4px' } }, t('backup.encryptionInfo')),

        // Unverschlüsselt bleibt wählbar — zurückhaltend gestaltet, mit ruhigem Hinweis.
        React.createElement('div', { style: { margin: '20px 0 6px', paddingTop: space.md, borderTop: '1px solid ' + palette.border, fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('backupVoreinstellung.titelUnverschluesselt')),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm, lineHeight: '1.5' } }, t('backupVoreinstellung.hinweisUnverschluesselt')),
        React.createElement('button', {
          onClick: () => { setBackupStatus(null); setVorschau('sicherung'); },
          style: { ...btnStyle(palette.up, palette.text), border: '1px solid ' + palette.border }
        }, React.createElement(Icon, { name: 'download', size: 14 }), t('backup.exportPlain')),
        vorschauPanel('sicherung')
      )
    ),

    // Right column: import/restore
    React.createElement('div', null,
      React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
        React.createElement(PanelTitle, { palette, icon: React.createElement(Icon, { name: 'upload', size: 22 }), style: { marginBottom: space.md } }, t('backup.importFile')),

        React.createElement('label', { style: { display: 'block', padding: '20px', background: palette.up, border: '2px dashed ' + palette.border, borderRadius: radius.sm, textAlign: 'center', cursor: 'pointer', marginBottom: '12px' } },
          React.createElement('input', { type: 'file', accept: '.json,.maloja', onChange: handleFileSelect, className: 'mp-datei-eingang', style: visuallyHiddenStyle }),
          React.createElement('div', { style: { marginBottom: space.xs } }, React.createElement(Icon, { name: 'upload', size: 24 })),
          React.createElement('div', { style: { fontWeight: weight.semi } }, t('backup.selectFile')),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } }, t('backup.fileTypes'))
        ),

        // Decrypt passphrase prompt (shown for encrypted files)
        importing && React.createElement('div', { style: { padding: space.md, background: palette.gold + '22', borderRadius: radius.sm, marginBottom: '12px', border: '1px solid ' + palette.gold } },
          React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: space.sm } }, t('backup.passphrase')),
          React.createElement('input', {
            type: 'password', value: importPassphrase, placeholder: t('backup.passphrase'),
            onChange: (e) => setImportPassphrase(e.target.value), 'aria-label': t('backup.passphrase'), style: inputStyle,
            autoFocus: true
          }),
          React.createElement('div', { style: { display: 'flex', gap: space.sm } },
            React.createElement('button', {
              onClick: handleDecryptAndImport, disabled: !importPassphrase,
              style: { ...btnStyle(palette.gold, '#000'), ...(importPassphrase ? null : gesperrtStil), flex: 1 }
            }, React.createElement(Icon, { name: 'lock', size: 14 }), t('backup.decrypting')),
            React.createElement('button', {
              onClick: cancelImport,
              style: { ...btnStyle(palette.up, palette.text), flex: 1, border: '1px solid ' + palette.border }
            }, t('common.cancel'))
          )
        ),

        // Rückfrage vor dem Ersetzen — ruhig, in der Seite, Fokus auf dem Ja.
        wartendeSicherung && React.createElement('div', {
          role: 'group', 'aria-labelledby': 'sicherung-rueckfrage',
          style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: '12px', border: '1px solid ' + palette.border },
        },
          React.createElement('p', { id: 'sicherung-rueckfrage', style: { margin: '0 0 ' + space.sm + 'px', fontSize: text.sm, color: palette.text, fontWeight: weight.semi } }, t('backup.confirmRestore')),
          React.createElement('div', { style: { display: 'flex', gap: space.sm } },
            React.createElement('button', {
              ref: bestaetigenKnopf, onClick: wiederherstellen,
              style: { ...btnStyle(palette.sand, palette.onSand), flex: 1 },
            }, t('backup.restoreJa')),
            React.createElement('button', {
              onClick: () => setWartendeSicherung(null),
              style: { ...btnStyle(palette.up, palette.text), flex: 1, border: '1px solid ' + palette.border },
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
          React.createElement('ul', { style: { margin: 0, paddingInlineStart: '18px', color: palette.mid } },
            validationWarnings.map((w, i) => React.createElement('li', { key: i }, w)))
        ),

        // Safety note
        React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, marginBottom: '12px' } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.6' } },
            React.createElement('div', null, hinweisZeichen('check'), t('backup.preRestoreNote')),
            React.createElement('div', null, hinweisZeichen('check'), t('backup.encryptionInfo')),
            React.createElement('div', null, hinweisZeichen('check'), t('backupVoreinstellung.altePasswoerter'))
          )
        ),

        // Security warning
        React.createElement('div', { style: { padding: '12px', background: palette.rose + '22', borderRadius: radius.sm, border: '1px solid ' + palette.rose, fontSize: text.sm, color: palette.mid } },
          React.createElement('strong', { style: { color: palette.roseDeep } }, praefix('lock', 14), t('zipExport.security') + ':'),
          React.createElement('div', { style: { marginTop: '6px' } }, t('zipExport.securityNote'))
        )
      )
    )
  );
};

export default ZipExport;
