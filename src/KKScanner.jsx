import React, { useState } from 'react';
import { initBarcodeScanner, scanBarcodeFromImage, performOCR, extractKKDataFromText, validateKKData, generateKKQRCode, parseKKQRCode } from './kkScanner.js';
import { Icon } from './IconSystem.jsx';

export const KKScanner = ({ palette, t, data, onSave }) => {
  const [scanMode, setScanMode] = useState('upload');
  const franchiseToNumber = (key) => key ? key.replace('f', '') : '';
  const [kkData, setKKData] = useState({
    insurer: data?.versicherungen?.kkInsurer || '',
    cardNumber: data?.versicherungen?.kkCardNumber || '',
    holder: data?.basis?.fullName || '',
    ahv: data?.basis?.ahv || '',
    franchise: franchiseToNumber(data?.versicherungen?.franchise) || '',
    model: data?.versicherungen?.kkModel || ''
  });
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [qrCode, setQRCode] = useState(null);

  React.useEffect(() => { initBarcodeScanner(); }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true);
    try {
      const result = await scanBarcodeFromImage(file);
      setScanResult(result);
      if (result.type === 'qr') {
        const parsed = parseKKQRCode(result.data);
        if (parsed) setKKData(parsed);
      } else if (result.type === 'ocr') {
        setKKData(result.data);
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
    const validation = validateKKData(kkData);
    if (!validation.valid) return;
    const qrData = generateKKQRCode(kkData);
    setQRCode(qrData);
    setTimeout(() => {
      if (!document.getElementById('qrcode')) {
        const s = document.createElement('script');
        s.id = 'qrcode';
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        s.integrity = 'sha384-3zSEDfvllQohrq0PHL1fOXJuC/jSOO34H46t6UQfobFOmxE5BpjjaIJY5F2/bMnU';
        s.crossOrigin = 'anonymous';
        s.onload = () => {
          const cont = document.getElementById('kk-qr-output');
          if (cont) { cont.innerHTML = ''; new window.QRCode(cont, { text: qrData, width: 180, height: 180, colorDark: palette.text, colorLight: palette.surface }); }
        };
        document.head.appendChild(s);
      } else {
        const cont = document.getElementById('kk-qr-output');
        if (cont) { cont.innerHTML = ''; new window.QRCode(cont, { text: qrData, width: 180, height: 180, colorDark: palette.text, colorLight: palette.surface }); }
      }
    }, 100);
  };

  const handleSave = () => {
    const validation = validateKKData(kkData);
    if (!validation.valid) return;
    onSave(kkData);
    setKKData({ insurer: '', cardNumber: '', holder: '', ahv: '', franchise: '', model: '' });
    setScanResult(null);
    setQRCode(null);
  };

  const inputStyle = {
    width: '100%', padding: '8px', marginBottom: '12px', borderRadius: '6px',
    border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box', fontSize: '12px'
  };

  const buttonStyle = {
    padding: '10px 16px', background: palette.sand, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px'
  };

  return React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' } },
    // Left: Scanner
    React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
      React.createElement('h2', { style: { fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'barcode', size: 18 }), t('kkScanner.title')),

      React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '16px' } },
        React.createElement('button', {
          onClick: () => setScanMode('upload'),
          style: { flex: 1, padding: '10px', background: scanMode === 'upload' ? palette.sand : palette.up, color: scanMode === 'upload' ? '#fff' : palette.text, border: '1px solid ' + palette.border, borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }
        }, t('kkScanner.photoScan')),
        React.createElement('button', {
          onClick: () => setScanMode('manual'),
          style: { flex: 1, padding: '10px', background: scanMode === 'manual' ? palette.sand : palette.up, color: scanMode === 'manual' ? '#fff' : palette.text, border: '1px solid ' + palette.border, borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }
        }, t('kkScanner.manualEntry'))
      ),

      scanMode === 'upload' && React.createElement('div', null,
        React.createElement('label', { style: { display: 'block', padding: '20px', background: palette.up, border: '2px dashed ' + palette.border, borderRadius: '8px', textAlign: 'center', cursor: 'pointer', marginBottom: '12px' } },
          React.createElement('input', { type: 'file', accept: 'image/*', onChange: handleFileUpload, style: { display: 'none' } }),
          React.createElement('div', { style: { fontSize: '18px', marginBottom: '4px' } }, '○'),
          React.createElement('div', { style: { fontWeight: '600' } }, t('kkScanner.selectImage')),
          React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginTop: '4px' } }, t('kkScanner.qrBarcode'))
        ),
        scanning && React.createElement('div', { style: { padding: '12px', background: palette.gold + '22', borderRadius: '6px', textAlign: 'center', color: palette.gold, fontWeight: '600' } }, '○ ' + t('kkScanner.scanning'))
      ),

      scanMode === 'manual' && React.createElement('div', null,
        React.createElement('label', { style: { display: 'block', fontSize: '12px', color: palette.mid, marginBottom: '4px', fontWeight: '500' } }, t('kkScanner.insurer')),
        React.createElement('input', { type: 'text', value: kkData.insurer, onChange: (e) => handleManualInput('insurer', e.target.value), placeholder: 'Swica, Helsana, CSS...', style: inputStyle }),

        React.createElement('label', { style: { display: 'block', fontSize: '12px', color: palette.mid, marginBottom: '4px', fontWeight: '500' } }, t('kkScanner.cardNumber')),
        React.createElement('input', { type: 'text', value: kkData.cardNumber, onChange: (e) => handleManualInput('cardNumber', e.target.value), style: inputStyle }),

        React.createElement('label', { style: { display: 'block', fontSize: '12px', color: palette.mid, marginBottom: '4px', fontWeight: '500' } }, t('kkScanner.insuredPerson')),
        React.createElement('input', { type: 'text', value: kkData.holder, onChange: (e) => handleManualInput('holder', e.target.value), style: inputStyle }),

        React.createElement('label', { style: { display: 'block', fontSize: '12px', color: palette.mid, marginBottom: '4px', fontWeight: '500' } }, t('kkScanner.ahvNumber')),
        React.createElement('input', { type: 'text', value: kkData.ahv, onChange: (e) => handleManualInput('ahv', e.target.value), placeholder: '756.1234.5678.90', style: inputStyle }),

        React.createElement('label', { style: { display: 'block', fontSize: '12px', color: palette.mid, marginBottom: '4px', fontWeight: '500' } }, t('kkScanner.franchise')),
        React.createElement('input', { type: 'number', value: kkData.franchise, onChange: (e) => handleManualInput('franchise', e.target.value), placeholder: '300', style: inputStyle }),

        React.createElement('label', { style: { display: 'block', fontSize: '12px', color: palette.mid, marginBottom: '4px', fontWeight: '500' } }, t('kkScanner.model')),
        React.createElement('select', { value: kkData.model, onChange: (e) => handleManualInput('model', e.target.value), style: inputStyle },
          React.createElement('option', { value: '' }, t('common.select')),
          React.createElement('option', { value: 'Basic' }, t('chapters.versicherungen.fields.kkModel.options.basic')),
          React.createElement('option', { value: 'Standard' }, t('chapters.versicherungen.fields.kkModel.options.standard')),
          React.createElement('option', { value: 'Comfort' }, t('chapters.versicherungen.fields.kkModel.options.comfort'))
        )
      ),

      scanResult && React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', marginBottom: '12px', fontSize: '12px' } },
        React.createElement('div', { style: { fontWeight: '600', marginBottom: '6px', color: palette.sage } }, '✓ ' + t('kkScanner.scanSuccess') + ' (' + scanResult.type.toUpperCase() + ')')
      ),

      React.createElement('button', { onClick: handleSave, style: { ...buttonStyle, width: '100%' } }, '□ ' + t('common.save'))
    ),

    // Right: Preview & QR
    React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
      React.createElement('h2', { style: { fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'document', size: 18 }), t('kkScanner.dataPreview')),

      React.createElement('div', { style: { display: 'grid', gap: '8px', marginBottom: '16px' } },
        [
          [t('kkScanner.insurer'), kkData.insurer],
          [t('kkScanner.cardNumber'), kkData.cardNumber],
          [t('kkScanner.insuredPerson'), kkData.holder],
          [t('kkScanner.ahvNumber'), kkData.ahv],
          [t('kkScanner.franchise'), kkData.franchise ? 'CHF ' + kkData.franchise : ''],
          [t('kkScanner.model'), kkData.model]
        ].map(([label, val], idx) => React.createElement('div', { key: idx, style: { padding: '10px', background: palette.up, borderRadius: '6px' } },
          React.createElement('div', { style: { fontSize: '11px', color: palette.mid } }, label),
          React.createElement('div', { style: { fontWeight: '600' } }, val || '—')
        ))
      ),

      React.createElement('button', { onClick: handleGenerateQR, style: { ...buttonStyle, width: '100%', marginBottom: '12px' } }, '○ ' + t('emergency.qrCode')),

      qrCode && React.createElement('div', { style: { padding: '16px', background: palette.up, borderRadius: '6px', textAlign: 'center' } },
        React.createElement('div', { id: 'kk-qr-output', style: { display: 'flex', justifyContent: 'center', marginBottom: '8px' } }),
        React.createElement('div', { style: { fontSize: '11px', color: palette.mid } }, t('kkScanner.scanForEmergency'))
      )
    )
  );
};

export default KKScanner;
