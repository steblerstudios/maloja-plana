import React, { useState } from 'react';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { qrZeichnen, vcardBauen, QR_MAX_BYTES_VCARD } from './utils/qrSicher.js';
import { initBarcodeScanner, scanBarcodeFromImage, scanHatInhalt, validateKKData, generateKKQRCode, parseKKQRCode } from './kkScanner.js';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { LabeledField } from './components/LabeledField.jsx';
import { getFullName } from './config/constants.js';
import { text, weight, radius, leading, space } from './config/tokens.js';
import { visuallyHiddenStyle } from './components/ExternerLink.jsx';
import { GlossarText } from './GlossarBegriff.jsx';

// Die Kassenkarte ist der Sonderfall unter den drei QR-Codes, und deshalb bekommt sie ZWEI.
//
// Gemessen 22.09.2026: die normale Kamera zeigt eine JSON-Nutzlast nicht an — sie liest den
// Code und meldet «no usable data found». Anders als beim Organspende-Code hat das JSON hier
// aber einen echten Leser: `parseKKQRCode` weiter unten in dieser Datei holt die Karte wieder
// in Maloja herein. Das JSON ersatzlos zu ersetzen hätte diesen Weg zerschnitten.
//
// Der Widerspruch lag woanders: der Code trug die Beschriftung «Zum Notfall-Pass scannen» und
// versprach damit etwas, das er nicht konnte. Jetzt gibt es beide — jeder mit der Aufgabe,
// die er wirklich erfüllt, und jeder so beschriftet.
//
// Steht hier und nicht in kkScanner.js, damit jene Datei frei von der QR-Bibliothek bleibt:
// die hängt sich beim Import an `window` und zöge eine Browser-Abhängigkeit in reine Logik.
export function kkNotfallVcard({ t, kkData = {} }) {
  const zeile = (schluessel, wert) => {
    const w = String(wert ?? '').trim();
    return w ? '  ' + t('kkScanner.' + schluessel) + ': ' + w : null;
  };
  const zeilen = [
    // Eigene Überschrift statt `kkScanner.title`: das ist «KK-Karte scannen», eine
    // Handlungsaufforderung an die Nutzerin — auf einer Notfallkarte stünde dort Unsinn.
    t('kkScanner.qrKarteTitel') + ':',
    zeile('insurer', kkData.insurer),
    zeile('cardNumber', kkData.cardNumber),
    zeile('ahv', kkData.ahv),
    zeile('franchise', kkData.franchise),
    zeile('model', kkData.model),
  ].filter(Boolean);

  return vcardBauen({
    name: String(kkData.holder ?? '').trim() || t('kkScanner.qrKarteTitel'),
    notiz: zeilen.join('\n'),
  });
}

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
  const [qrFehler, setQrFehler] = useState(false);
  const [qrAnsage, setQrAnsage] = useState('');
  const [conflicts, setConflicts] = useState(null);
  // Bis 24.09.2026 brach Speichern bei ungültiger Eingabe STUMM ab (`return`), und ein
  // gelungenes Speichern leerte das Formular ohne ein Wort. `validation.errors` war
  // fertig übersetzt, in fünf Sprachen — und wurde nirgends gezeigt.
  const [fehler, setFehler] = useState([]);
  const [gespeichert, setGespeichert] = useState(false);
  const [nichtsGelesen, setNichtsGelesen] = useState(false);

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
    setNichtsGelesen(false);
    setGespeichert(false);
    try {
      const result = await scanBarcodeFromImage(file);
      setScanResult(result);
      let scanned = null;
      if (result.type === 'qr') {
        scanned = parseKKQRCode(result.data);
      } else if (result.type === 'ocr') {
        scanned = result.data;
      }
      if (!scanHatInhalt(scanned)) {
        setScanResult(null);
        setNichtsGelesen(true);
      } else {
        const c = detectConflicts(scanned);
        if (c) {
          setConflicts(c);
        } else {
          setKKData(prev => ({ ...prev, ...scanned }));
          setConflicts(null);
        }
      }
    } catch (error) {
      setScanResult(null);
      setNichtsGelesen(true);
    } finally {
      setScanning(false);
    }
  };

  const handleManualInput = (field, value) => {
    setKKData(prev => ({ ...prev, [field]: value }));
    setFehler([]);
    setGespeichert(false);
  };

  const handleGenerateQR = () => {
    const validation = validateKKData(kkData, t);
    setFehler(validation.errors);
    if (!validation.valid) return;
    const qrData = generateKKQRCode(kkData);
    setQRCode(qrData);
    setQrAnsage(''); // leeren, damit ein erneutes Erzeugen wieder angesagt wird
    setTimeout(() => {
      // K80: vorher warf ein Versicherername mit Umlaut (z. B. ÖKK) hier unabgefangen.
      // Farben bewusst NICHT aus der Palette: qrZeichnen zeichnet immer dunkel auf hell.
      // Der lesbare Code zuerst — er ist der, den im Ernstfall jemand Fremdes braucht.
      const lesbar = document.getElementById('kk-qr-lesbar');
      const okLesbar = lesbar
        ? qrZeichnen(lesbar, kkNotfallVcard({ t, kkData }), {
            maxBytes: QR_MAX_BYTES_VCARD, width: 180, height: 180,
            beschriftung: t('kkScanner.qrNotfallLesbar'),
          })
        : false;
      const cont = document.getElementById('kk-qr-output');
      const okUebernahme = cont
        ? qrZeichnen(cont, qrData, {
            width: 180, height: 180, beschriftung: t('kkScanner.qrUebernahme'),
          })
        : false;
      if (!lesbar && !cont) return;
      // Fehler heisst hier: KEINER der beiden ging. Solange einer steht, ist die Karte nutzbar.
      setQrFehler(!okLesbar && !okUebernahme);
      if (okLesbar || okUebernahme) setQrAnsage(t('common.qrErstellt'));
    }, 100);
  };

  const handleSave = () => {
    const validation = validateKKData(kkData, t);
    setFehler(validation.errors);
    if (!validation.valid) return;
    onSave(kkData);
    setKKData({ insurer: '', cardNumber: '', holder: '', ahv: '', franchise: '', model: '' });
    setScanResult(null);
    setQRCode(null);
    setGespeichert(true);
  };

  const inputStyle = {
    width: '100%', padding: space.sm, marginBottom: '12px', borderRadius: radius.sm,
    border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box', fontSize: text.sm
  };

  const buttonStyle = {
    // inline-flex + gap: das Präfix-Icon (Haken) sitzt mittig neben dem Text.
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
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
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.sm, fontStyle: 'italic' } }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('kkScanner.scanRequiresInternet'))),
        React.createElement('label', { style: { display: 'block', padding: '20px', background: palette.up, border: '2px dashed ' + palette.border, borderRadius: radius.sm, textAlign: 'center', cursor: 'pointer', marginBottom: '12px' } },
          React.createElement('input', { type: 'file', accept: 'image/*', onChange: handleFileUpload, className: 'mp-datei-eingang', style: visuallyHiddenStyle }),
          React.createElement('div', { style: { marginBottom: space.xs } }, React.createElement(Icon, { name: 'upload', size: 24 })),
          React.createElement('div', { style: { fontWeight: weight.semi } }, t('kkScanner.selectImage')),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } }, t('kkScanner.qrBarcode'))
        ),
        nichtsGelesen && !scanning && React.createElement('p', {
          role: 'status',
          style: { fontSize: text.sm, color: palette.text, background: palette.up, padding: '12px', borderRadius: radius.sm, margin: '0 0 12px' },
        }, t('kkScanner.nichtsGelesen')),
        scanning && React.createElement('div', { style: { padding: '12px', background: palette.gold + '22', borderRadius: radius.sm, textAlign: 'center', color: palette.goldDeep, fontWeight: weight.semi } }, hinweisZeichen(), t('kkScanner.scanning'))
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
        React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: '6px', color: palette.sageDeep } }, hinweisZeichen('check'), t('kkScanner.scanSuccess') + ' (' + scanResult.type.toUpperCase() + ')')
      ),

      conflicts && React.createElement('div', { style: { padding: space.md, background: palette.gold + '15', border: '1px solid ' + palette.gold, borderRadius: radius.sm, marginBottom: '12px' } },
        React.createElement('div', { style: { fontWeight: weight.semi, color: palette.goldDeep, marginBottom: space.sm, fontSize: text.sm } }, hinweisZeichen(), t('kkScanner.conflictTitle')),
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

      // Fehler als Text, direkt über dem Knopf, der sie auslöst — im Foto-Modus sind die
      // Felder zugeklappt, dort wäre eine Markierung am Feld unsichtbar.
      fehler.length > 0 && React.createElement('ul', {
        id: 'kk-fehler', role: 'alert',
        style: { margin: '0 0 12px', padding: '10px 12px 10px 28px', background: palette.up, border: '1px solid ' + palette.rose, borderRadius: radius.sm, color: palette.text, fontSize: text.sm, lineHeight: leading.normal },
      }, fehler.map(f => React.createElement('li', { key: f }, f))),
      React.createElement('button', { onClick: handleSave, 'aria-describedby': fehler.length > 0 ? 'kk-fehler' : undefined, style: { ...buttonStyle, width: '100%' } }, React.createElement(Icon, { name: 'check', size: 14 }), t('common.save')),
      React.createElement('p', { role: 'status', style: { margin: gespeichert ? '8px 0 0' : 0, fontSize: text.sm, color: palette.sageDeep, fontWeight: weight.semi } },
        gespeichert ? [hinweisZeichen('check', 12, 'z'), t('common.saved')] : null),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, hinweisZeichen(), t('trust.localOnly'))
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

      React.createElement('button', { onClick: handleGenerateQR, style: { ...buttonStyle, width: '100%', marginBottom: '12px' } }, hinweisZeichen(), t('kkScanner.qrBarcode')),
      // a11y (Deploy-Gate 0.1.37): höfliche Ansage «QR-Code erstellt» — ohne den Inhalt vorzulesen.
      // Eigene, immer vorhandene Region; der Hinweis über dem QR bleibt ohne Live-Region (0.1.36).
      React.createElement('div', { role: 'status', 'aria-live': 'polite', style: visuallyHiddenStyle }, qrAnsage),

      qrCode && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, textAlign: 'center' } },
        // K101: derselbe ehrliche Hinweis wie am Notfall-QR (nicht verschlüsselt, für alle lesbar).
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginBottom: '12px' }
        }, t('notfallDossier.qrHint')),
        // Zwei Codes, weil sie zwei verschiedene Aufgaben haben: der obere ist der, den im
        // Ernstfall jemand Fremdes mit der normalen Kamera liest; der untere holt die Karte
        // in Maloja zurück und wird nur von dieser App gelesen. Bis zum 22.09.2026 gab es
        // nur den unteren — mit der Beschriftung des oberen.
        React.createElement('div', {
          style: { display: qrFehler ? 'none' : 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: space.md, justifyItems: 'center' }
        },
          React.createElement('div', null,
            React.createElement('div', { id: 'kk-qr-lesbar', style: { display: 'flex', justifyContent: 'center', marginBottom: '6px' } }),
            React.createElement('div', {
              style: { fontSize: text.sm, color: palette.text, fontWeight: weight.semi, textAlign: 'center' }
            }, t('kkScanner.qrNotfallLesbar'))
          ),
          React.createElement('div', null,
            React.createElement('div', { id: 'kk-qr-output', style: { display: 'flex', justifyContent: 'center', marginBottom: '6px' } }),
            React.createElement('div', {
              style: { fontSize: text.sm, color: palette.mid, textAlign: 'center' }
            }, t('kkScanner.qrUebernahme'))
          )
        ),
        qrFehler && React.createElement('p', { role: 'status', style: { fontSize: text.sm, color: palette.mid, margin: '0 0 8px' } }, t('common.qrFehler'))
      )
    )
  ));
};

export default KKScanner;
