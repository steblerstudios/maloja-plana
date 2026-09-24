import React, { useState, useRef } from 'react';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { qrZeichnen, vcardBauen, QR_MAX_BYTES_VCARD } from './utils/qrSicher.js';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { PrimaryButton } from './components/PrimaryButton.jsx';
import { LabeledField } from './components/LabeledField.jsx';
import { getFullName } from './config/constants.js';
import { text, weight, radius , leading , space } from './config/tokens.js';
import { ExternerLink, visuallyHiddenStyle } from './components/ExternerLink.jsx';

export const organOptionen = (t) => [
  { key: 'heart', label: t('organ.heart') },
  { key: 'lungs', label: t('organ.lungs') },
  { key: 'liver', label: t('organ.liver') },
  { key: 'kidneys', label: t('organ.kidneys') },
  { key: 'corneas', label: t('organ.cornea') },
  { key: 'bone', label: t('organ.boneMarrow') },
];

// Baut die Nutzlast des Organspende-QR als vCard — rein, ohne DOM, damit sie prüfbar ist.
//
// Gemessen 22.09.2026: die normale Kamera zeigt weder Klartext noch JSON an — sie liest den
// Code und meldet «no usable data found». Beim Nachmessen kam ein zweiter Befund dazu: das
// frühere JSON hatte NIRGENDS im Code einen Leser. Der Ausweis war von beiden Seiten
// unlesbar — von der Kamera einer Retterin und von Maloja selbst.
//
// Zwei stille Fehler von damals sind hier mitbehoben: die Organe standen als rohe Schlüssel
// im Code ('heart', 'kidneys') statt als Wörter, und das Freitextfeld erschien als das Wort
// «other» statt mit seinem Inhalt.
export function organSpendeVcard({ t, data = {}, status, organs = {} }) {
  const statusText = status === 'registered' ? t('organ.registered')
    : status === 'not_registered' ? t('organ.notRegistered')
    : t('organ.declined');

  // Etiketten aus der Oberfläche; für Schlüssel ohne Etikett (aus älteren Daten) bleibt der
  // Schlüssel stehen — eine Angabe auf einem Notfall-Ausweis wird nicht stillschweigend
  // weggelassen, nur weil ihr Wort fehlt.
  const etikett = Object.fromEntries(organOptionen(t).map(o => [o.key, o.label]));
  const gewaehlt = Object.keys(organs)
    .filter(k => k !== 'other' && organs[k])
    .map(k => etikett[k] || k);
  const freitext = String(organs.other ?? '').trim();
  if (freitext) gewaehlt.push(freitext);

  const blutgruppe = String(data.notfall?.bloodType ?? '').trim();

  const zeilen = [t('organ.title') + ':', '  ' + t('organ.status') + ': ' + statusText];
  if (gewaehlt.length) zeilen.push('  ' + t('organ.organsAndTissue') + ': ' + gewaehlt.join(', '));
  if (blutgruppe) zeilen.push('  ' + t('notfallSummary.bloodType') + ': ' + blutgruppe);
  // K123 (Entscheid Stebler Studios 24.09.2026): keine AHV-Nummer im Organspende-QR — er trägt
  // Gesundheitsangaben, wird gezeigt und fotografiert und ist nicht widerrufbar.

  return vcardBauen({
    name: getFullName(data.basis) || t('organ.title'),
    tel: data.basis?.phone || '',
    notiz: zeilen.join('\n'),
  });
}

export const OrganDonation = ({ palette, t, data, onSave }) => {
  const [status, setStatus] = useState(data.organStatus || 'registered');
  const [organs, setOrgans] = useState(data.organDonation || {
    heart: false, lungs: false, liver: false, kidneys: false,
    pancreas: false, corneas: false, bone: false, tissue: false, other: ''
  });
  const [qrGenerated, setQRGenerated] = useState(false);
  const [qrFehler, setQrFehler] = useState(false);
  const [qrAnsage, setQrAnsage] = useState('');
  const qrRef = useRef(null);

  const organOptions = organOptionen(t);

  const handleOrganToggle = (organ) => {
    setOrgans(prev => ({ ...prev, [organ]: !prev[organ] }));
  };

  const handleGenerateQR = () => {
    const qrData = organSpendeVcard({ t, data, status, organs });

    setQrAnsage(''); // leeren, damit ein erneutes Erzeugen wieder angesagt wird
    setTimeout(() => {
      const cont = qrRef.current;
      // K80: vorher warf ein Name mit Umlaut hier unabgefangen → leere Fläche.
      if (!cont) return;
      const ok = qrZeichnen(cont, qrData, { maxBytes: QR_MAX_BYTES_VCARD, width: 200, height: 200, beschriftung: t('organ.generateQr') });
      setQrFehler(!ok);
      if (ok) setQrAnsage(t('common.qrErstellt'));
    }, 100);

    setQRGenerated(true);
  };

  const handleSave = () => {
    onSave({ organStatus: status, organDonation: organs });
  };

  const buttonStyle = {
    padding: '10px 16px', background: palette.sand, color: palette.onSand, border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm
  };

  const statusButtonStyle = {
    // color explizit: Buttons erben color nicht (UA-Reset auf schwarz) → sonst war
    // der inaktive „Nicht registriert"-Status im Dark Mode schwarz auf palette.up.
    padding: '10px 16px', border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm, color: palette.text
  };

  return React.createElement('div', { style: { maxWidth: '720px' } },
   React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' } },
    // Left: Settings
    React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
      React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'health', size: 22 }), style: { marginBottom: space.md } }, t('organ.title')),

      React.createElement(PanelTitle, { palette, style: { marginBottom: '12px' } }, t('organ.status')),
      React.createElement('div', { style: { display: 'grid', gap: space.sm, marginBottom: '20px' } },
        React.createElement('button', {
          onClick: () => setStatus('registered'),
          style: { ...statusButtonStyle, background: status === 'registered' ? palette.sageBtn : palette.up, color: status === 'registered' ? '#fff' : palette.text }
        }, hinweisZeichen('check'), t('organ.registered')),
        React.createElement('button', {
          onClick: () => setStatus('not_registered'),
          style: { ...statusButtonStyle, background: status === 'not_registered' ? palette.up : palette.up }
        }, hinweisZeichen(), t('organ.notRegistered')),
        React.createElement('button', {
          onClick: () => setStatus('declined'),
          style: { ...statusButtonStyle, background: status === 'declined' ? palette.rose : palette.up, color: status === 'declined' ? '#fff' : palette.text }
        }, hinweisZeichen('kreuz'), t('organ.declined'))
      ),

      React.createElement(PanelTitle, { palette, style: { marginBottom: '12px' } }, t('organ.organsAndTissue')),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: space.sm, marginBottom: space.md } },
        organOptions.map(org => React.createElement('label', { key: org.key, style: { display: 'flex', alignItems: 'center', gap: space.sm, padding: '10px', background: organs[org.key] ? palette.sage + '33' : palette.up, borderRadius: radius.sm, cursor: 'pointer', border: '1px solid ' + (organs[org.key] ? palette.sage : palette.border), fontSize: text.sm } },
          React.createElement('input', { type: 'checkbox', checked: organs[org.key], onChange: () => handleOrganToggle(org.key), style: { cursor: 'pointer' } }),
          org.label
        ))
      ),

      React.createElement(LabeledField, { palette, label: t('organ.otherOrgans'), style: { marginBottom: 0 } },
        React.createElement('input', {
          type: 'text', value: organs.other,
          onChange: (e) => setOrgans(prev => ({ ...prev, other: e.target.value })),
          style: { width: '100%', padding: space.sm, marginBottom: space.md, borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box', fontSize: text.sm }
        })),

      React.createElement(PrimaryButton, { palette, onClick: handleSave, style: { width: '100%', marginBottom: '12px' } }, hinweisZeichen('kaestchen'), t('organ.save')),
      React.createElement('button', { onClick: handleGenerateQR, style: { ...buttonStyle, width: '100%', background: palette.sageBtn, color: '#fff' } }, hinweisZeichen(), t('organ.generateQr')),
      // a11y (Deploy-Gate 0.1.37): höfliche Ansage «QR-Code erstellt» — ohne den Inhalt vorzulesen.
      // Eigene, immer vorhandene Region; der Hinweis über dem QR bleibt ohne Live-Region (0.1.36).
      React.createElement('div', { role: 'status', 'aria-live': 'polite', style: visuallyHiddenStyle }, qrAnsage)
    ),

    // Right: Info & QR
    React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
      React.createElement(PanelTitle, { palette, icon: React.createElement(Icon, { name: 'info', size: 22 }), style: { marginBottom: space.md } }, t('organ.info')),

      React.createElement('div', { style: { background: palette.up, padding: '12px', borderRadius: radius.sm, marginBottom: space.md, fontSize: text.sm } },
        React.createElement('strong', null, hinweisZeichen('check'), t('organ.status') + ': '),
        status === 'registered' ? t('organ.registered') : status === 'not_registered' ? t('organ.notRegistered') : t('organ.declined')
      ),

      qrGenerated && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, textAlign: 'center', marginBottom: space.md } },
        React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '4px' } }, t('organ.generateQr')),
        // K101: derselbe ehrliche Hinweis wie am Notfall-QR (nicht verschlüsselt, für alle lesbar).
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginBottom: '12px' }
        }, t('notfallDossier.qrHint')),
        React.createElement('div', { ref: qrRef, style: { display: qrFehler ? 'none' : 'flex', justifyContent: 'center', marginBottom: space.sm, minHeight: '220px' } }),
        qrFehler && React.createElement('p', { role: 'status', style: { fontSize: text.sm, color: palette.mid, margin: 0 } }, t('common.qrFehler'))
      ),

      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.6' } },
        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('strong', { style: { color: palette.text } }, t('organ.swissOrganDonation')),
          React.createElement('div', { style: { marginTop: '6px' } },
            React.createElement(ExternerLink, { t, href: 'https://www.swisstransplant.org/de/organ-gewebespende/organspender-werden/organspende-karte-bestellen', style: { color: palette.sandDeep, textDecoration: 'none', fontWeight: weight.semi } }, 'swisstransplant.org')
          )
        )
      )
    ),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, hinweisZeichen(), t('trust.localOnly'))
  ));
};

export default OrganDonation;
