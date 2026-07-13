import React, { useState } from 'react';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import QRCode from './vendor/qrcodejs.js';
import { initBarcodeScanner, scanBarcodeFromImage, validateKKData, generateKKQRCode, parseKKQRCode } from './kkScanner.js';
import { Icon } from './IconSystem.jsx';
import { LabeledField } from './components/LabeledField.jsx';
import { getFullName } from './config/constants.js';
import { text, weight, radius, space } from './config/tokens.js';

export const KKScanner = ({ palette, t, data, onSave }) => {
  const [scanMode, setScanMode] = useState('upload');
  const franchiseToNumber = (key) => key ? key.replace('f', '') : '';
  const [kkData, setKKData] = useState({
    insurer: data?.versicherungen?.kkInsurer || '',
    cardNumber: data?.versicherungen?.kkCardNumber || '',
    holder: getFullName(data?.basis) || '',
    ahv: data?.basis?.ahv || '',
    franchise: franchiseToNumber(data?.versicherungen?.franchise) || '',
    model: data?.versicherungen?.kkModel || ''
  });
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [qrCode, setQRCode] = useState(null);
  const [conflicts, setConflicts] = useState(null);

  React.useEffect(() => { initBarcodeScanner(); }, []);

  const detectConflicts = (scanned) => {
    const fields = ['insurer', 'cardNumber', 'ahv', 'franchise', 'model'];
    const diffs = fields.filter(f => scanned[f] && kkData[f] && scanned[f] !== kkData[f]);
    return diffs.length > 0 ? { fields: diffs, scanned } : null;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true);
    try {
      const result = await scanBarcodeFromImage(file);
      setScanResult(result);
      let scanned = null;
      if (result.type === 'qr') {
        scanned = parseKKQRCode(result.data);
      } else if (result.type === 'ocr') {
        scanned = result.data;
      }
      if (scanned) {
        const c = detectConflicts(scanned);
        if (c) {
          setConflicts(c);
        } else {
          setKKData(prev => ({ ...prev, ...scanned }));
          setConflicts(null);
        }
      }
    } catch (error) {
      // scan failed
    } finally {
      setScanning(false);
    }
  };

  const handleManualInput = (field, value) => {
    setKKData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateQR = () => {
    const validation = validateKKData(kkData, t);
    if (!validation.valid) return;
    const qrData = generateKKQRCode(kkData);
    setQRCode(qrData);
    setTimeout(() => {
      const cont = document.getElementById('kk-qr-output');
      if (cont) { cont.innerHTML = ''; new QRCode(cont, { text: qrData, width: 180, height: 180, colorDark: palette.text, colorLight: palette.surface }); }
    }, 100);
  };

  const handleSave = () => {
    const validation = validateKKData(kkData, t);
    if (!validation.valid) return;
    onSave(kkData);
    setKKData({ insurer: '', cardNumber: '', holder: '', ahv: '', franchise: '', model: '' });
    setScanResult(null);
    setQRCode(null);
  };

  const inputStyle = {
    width: '100%', padding: space.sm, marginBottom: '12px', borderRadius: radius.sm,
    border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box', fontSize: text.sm
  };

  const buttonStyle = {
    padding: '10px 16px', background: palette.sand, color: palette.onSand, border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm
  };

  return React.createElement('div', { style: { maxWidth: '720px' } },
   React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' } },
    // Left: Scanner
    React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
      React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'barcode', size: 22 }), style: { marginBottom: space.md } }, t('kkScanner.title')),

      React.createElement('div', { style: { display: 'flex', gap: space.sm, marginBottom: space.md } },
        React.createElement('button', {
          onClick: () => setScanMode('upload'),
          style: { flex: 1, padding: '10px', background: scanMode === 'upload' ? palette.sand : palette.up, color: scanMode === 'upload' ? palette.onSand : palette.text, border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm }
        }, t('kkScanner.photoScan')),
        React.createElement('button', {
          onClick: () => setScanMode('manual'),
          style: { flex: 1, padding: '10px', background: scanMode === 'manual' ? palette.sand : palette.up, color: scanMode === 'manual' ? palette.onSand : palette.text, border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm }
        }, t('kkScanner.manualEntry'))
      ),

      scanMode === 'upload' && React.createElement('div', null,
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.sm, fontStyle: 'italic' } }, 'ⓘ ' + t('kkScanner.scanRequiresInternet')),
        React.createElement('label', { style: { display: 'block', padding: '20px', background: palette.up, border: '2px dashed ' + palette.border, borderRadius: radius.sm, textAlign: 'center', cursor: 'pointer', marginBottom: '12px' } },
          React.createElement('input', { type: 'file', accept: 'image/*', onChange: handleFileUpload, style: { display: 'none' } }),
          React.createElement('div', { style: { fontSize: text.lg, marginBottom: space.xs } }, '○'),
          React.createElement('div', { style: { fontWeight: weight.semi } }, t('kkScanner.selectImage')),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } }, t('kkScanner.qrBarcode'))
        ),
        scanning && React.createElement('div', { style: { padding: '12px', background: palette.gold + '22', borderRadius: radius.sm, textAlign: 'center', color: palette.goldDeep, fontWeight: weight.semi } }, 'ⓘ ' + t('kkScanner.scanning'))
      ),

      scanMode === 'manual' && React.createElement('div', null,
        React.createElement(LabeledField, { palette, label: t('kkScanner.insurer'), style: { marginBottom: 0 } },
          React.createElement('input', { type: 'text', value: kkData.insurer, onChange: (e) => handleManualInput('insurer', e.target.value), placeholder: 'Swica, Helsana, CSS...', style: inputStyle })),

        React.createElement(LabeledField, { palette, label: t('kkScanner.cardNumber'), style: { marginBottom: 0 } },
          React.createElement('input', { type: 'text', value: kkData.cardNumber, onChange: (e) => handleManualInput('cardNumber', e.target.value), style: inputStyle })),

        React.createElement(LabeledField, { palette, label: t('kkScanner.insuredPerson'), style: { marginBottom: 0 } },
          React.createElement('input', { type: 'text', value: kkData.holder, onChange: (e) => handleManualInput('holder', e.target.value), style: inputStyle })),

        React.createElement(LabeledField, { palette, label: t('kkScanner.ahvNumber'), style: { marginBottom: 0 } },
          React.createElement('input', { type: 'text', value: kkData.ahv, onChange: (e) => handleManualInput('ahv', e.target.value), placeholder: '756.1234.5678.90', style: inputStyle })),

        React.createElement(LabeledField, { palette, label: t('kkScanner.franchise'), style: { marginBottom: 0 } },
          React.createElement('input', { type: 'number', inputMode: 'decimal', value: kkData.franchise, onChange: (e) => handleManualInput('franchise', e.target.value), placeholder: '300', style: inputStyle })),

        React.createElement(LabeledField, { palette, label: t('kkScanner.model'), style: { marginBottom: 0 } },
          React.createElement('select', { value: kkData.model, onChange: (e) => handleManualInput('model', e.target.value), style: inputStyle },
            React.createElement('option', { value: '' }, t('common.select')),
            React.createElement('option', { value: 'Basic' }, t('chapters.versicherungen.fields.kkModel.options.basic')),
            React.createElement('option', { value: 'Standard' }, t('chapters.versicherungen.fields.kkModel.options.standard')),
            React.createElement('option', { value: 'Comfort' }, t('chapters.versicherungen.fields.kkModel.options.comfort'))
          ))
      ),

      scanResult && !conflicts && React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, marginBottom: '12px', fontSize: text.sm } },
        React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: '6px', color: palette.sageDeep } }, '✓ ' + t('kkScanner.scanSuccess') + ' (' + scanResult.type.toUpperCase() + ')')
      ),

      conflicts && React.createElement('div', { style: { padding: space.md, background: palette.gold + '15', border: '1px solid ' + palette.gold, borderRadius: radius.sm, marginBottom: '12px' } },
        React.createElement('div', { style: { fontWeight: weight.semi, color: palette.goldDeep, marginBottom: space.sm, fontSize: text.sm } }, 'ⓘ ' + t('kkScanner.conflictTitle')),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm } }, t('kkScanner.conflictHint')),
        React.createElement('div', { style: { display: 'grid', gap: space.xs, marginBottom: space.md } },
          conflicts.fields.map(field =>
            React.createElement('div', { key: field, style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: space.xs, padding: space.xs, background: palette.surface, borderRadius: radius.sm, fontSize: text.xs } },
              React.createElement('div', { style: { fontWeight: weight.medium } }, t('kkScanner.' + field) || field),
              React.createElement('div', { style: { color: palette.mid } }, kkData[field] || '—'),
              React.createElement('div', { style: { color: palette.sageDeep, fontWeight: weight.medium } }, conflicts.scanned[field] || '—')
            )
          )
        ),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.xs, fontSize: text.xs } },
          React.createElement('div', { style: { textAlign: 'center', color: palette.mid, fontWeight: weight.medium } }, t('kkScanner.conflictCurrent')),
          React.createElement('div', { style: { textAlign: 'center', color: palette.sageDeep, fontWeight: weight.medium } }, t('kkScanner.conflictScanned'))
        ),
        React.createElement('div', { style: { display: 'flex', gap: space.sm, marginTop: space.md } },
          React.createElement('button', {
            onClick: () => { setKKData(prev => ({ ...prev, ...conflicts.scanned })); setConflicts(null); },
            style: { ...buttonStyle, flex: 1, background: palette.sageBtn, color: '#fff' }
          }, t('kkScanner.conflictAccept')),
          React.createElement('button', {
            onClick: () => setConflicts(null),
            style: { ...buttonStyle, flex: 1, background: palette.mid }
          }, t('kkScanner.conflictKeep'))
        )
      ),

      React.createElement('button', { onClick: handleSave, style: { ...buttonStyle, width: '100%' } }, '□ ' + t('common.save')),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, 'ⓘ ' + t('trust.localOnly'))
    ),

    // Right: Preview & QR
    React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
      React.createElement(PanelTitle, { palette, icon: React.createElement(Icon, { name: 'document', size: 22 }), style: { marginBottom: space.md } }, t('kkScanner.dataPreview')),

      React.createElement('div', { style: { display: 'grid', gap: space.sm, marginBottom: space.md } },
        [
          [t('kkScanner.insurer'), kkData.insurer],
          [t('kkScanner.cardNumber'), kkData.cardNumber],
          [t('kkScanner.insuredPerson'), kkData.holder],
          [t('kkScanner.ahvNumber'), kkData.ahv],
          [t('kkScanner.franchise'), kkData.franchise ? 'CHF ' + kkData.franchise : ''],
          [t('kkScanner.model'), kkData.model]
        ].map(([label, val], idx) => React.createElement('div', { key: idx, style: { padding: '10px', background: palette.up, borderRadius: radius.sm } },
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, label),
          React.createElement('div', { style: { fontWeight: weight.semi } }, val || '—')
        ))
      ),

      React.createElement('button', { onClick: handleGenerateQR, style: { ...buttonStyle, width: '100%', marginBottom: '12px' } }, 'ⓘ ' + t('kkScanner.qrBarcode')),

      qrCode && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, textAlign: 'center' } },
        React.createElement('div', { id: 'kk-qr-output', style: { display: 'flex', justifyContent: 'center', marginBottom: space.sm } }),
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t('kkScanner.scanForEmergency'))
      )
    )
  ));
};

export default KKScanner;
