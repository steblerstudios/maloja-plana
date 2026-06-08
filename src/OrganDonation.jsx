import React, { useState } from 'react';
import QRCode from './vendor/qrcodejs.js';
import { Icon } from './IconSystem.jsx';
import { getFullName } from './config/constants.js';
import { text, weight } from './config/tokens.js';

export const OrganDonation = ({ palette, t, data, onSave }) => {
  const [status, setStatus] = useState(data.organStatus || 'registered');
  const [organs, setOrgans] = useState(data.organDonation || {
    heart: false, lungs: false, liver: false, kidneys: false,
    pancreas: false, corneas: false, bone: false, tissue: false, other: ''
  });
  const [qrGenerated, setQRGenerated] = useState(false);

  const organOptions = [
    { key: 'heart', label: '◉ ' + t('organ.heart') },
    { key: 'lungs', label: '◉ ' + t('organ.lungs') },
    { key: 'liver', label: '◉ ' + t('organ.liver') },
    { key: 'kidneys', label: '◉ ' + t('organ.kidneys') },
    { key: 'corneas', label: '◉ ' + t('organ.cornea') },
    { key: 'bone', label: '◉ ' + t('organ.boneMarrow') }
  ];

  const handleOrganToggle = (organ) => {
    setOrgans(prev => ({ ...prev, [organ]: !prev[organ] }));
  };

  const handleGenerateQR = () => {
    const qrData = JSON.stringify({
      type: 'ORGAN_DONATION',
      name: getFullName(data.basis) || '',
      phone: data.basis?.phone || '',
      bloodType: data.notfall?.bloodType || '',
      organStatus: status,
      donatedOrgans: Object.keys(organs).filter(k => organs[k]),
      ahv: data.basis?.ahv || ''
    });

    setTimeout(() => {
      const cont = document.getElementById('organ-qr-output');
      if (cont) { cont.innerHTML = ''; new QRCode(cont, { text: qrData, width: 200, height: 200, colorDark: palette.text, colorLight: palette.surface }); }
    }, 100);

    setQRGenerated(true);
  };

  const handleSave = () => {
    onSave({ organStatus: status, organDonation: organs });
  };

  const buttonStyle = {
    padding: '10px 16px', background: palette.sand, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: text.sm
  };

  const statusButtonStyle = {
    padding: '10px 16px', border: '1px solid ' + palette.border, borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: text.sm
  };

  return React.createElement('div', { style: { maxWidth: '720px' } },
   React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' } },
    // Left: Settings
    React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
      React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'health', size: 20 }), t('organ.title')),

      React.createElement('h3', { style: { fontSize: text.body, fontWeight: '600', marginBottom: '12px' } }, t('organ.status')),
      React.createElement('div', { style: { display: 'grid', gap: '8px', marginBottom: '20px' } },
        React.createElement('button', {
          onClick: () => setStatus('registered'),
          style: { ...statusButtonStyle, background: status === 'registered' ? palette.sage : palette.up, color: status === 'registered' ? '#000' : palette.text }
        }, '✓ ' + t('organ.registered')),
        React.createElement('button', {
          onClick: () => setStatus('not_registered'),
          style: { ...statusButtonStyle, background: status === 'not_registered' ? palette.up : palette.up }
        }, '○ ' + t('organ.notRegistered')),
        React.createElement('button', {
          onClick: () => setStatus('declined'),
          style: { ...statusButtonStyle, background: status === 'declined' ? palette.rose : palette.up, color: status === 'declined' ? '#fff' : palette.text }
        }, '✕ ' + t('organ.declined'))
      ),

      React.createElement('h3', { style: { fontSize: text.body, fontWeight: '600', marginBottom: '12px' } }, t('organ.organsAndTissue')),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '16px' } },
        organOptions.map(org => React.createElement('label', { key: org.key, style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: organs[org.key] ? palette.sage + '33' : palette.up, borderRadius: '6px', cursor: 'pointer', border: '1px solid ' + (organs[org.key] ? palette.sage : palette.border), fontSize: text.sm } },
          React.createElement('input', { type: 'checkbox', checked: organs[org.key], onChange: () => handleOrganToggle(org.key), style: { cursor: 'pointer' } }),
          org.label
        ))
      ),

      React.createElement('label', { style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: '4px', fontWeight: '500' } }, t('organ.otherOrgans')),
      React.createElement('input', {
        type: 'text', value: organs.other,
        onChange: (e) => setOrgans(prev => ({ ...prev, other: e.target.value })),
        style: { width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '6px', border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box', fontSize: text.sm }
      }),

      React.createElement('button', { onClick: handleSave, style: { ...buttonStyle, width: '100%', marginBottom: '12px' } }, '□ ' + t('organ.save')),
      React.createElement('button', { onClick: handleGenerateQR, style: { ...buttonStyle, width: '100%', background: palette.sage, color: '#000' } }, '○ ' + t('organ.generateQr'))
    ),

    // Right: Info & QR
    React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
      React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'info', size: 20 }), t('organ.info')),

      React.createElement('div', { style: { background: palette.up, padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: text.sm } },
        React.createElement('strong', null, '✓ ' + t('organ.status') + ': '),
        status === 'registered' ? t('organ.registered') : status === 'not_registered' ? t('organ.notRegistered') : t('organ.declined')
      ),

      qrGenerated && React.createElement('div', { style: { padding: '16px', background: palette.up, borderRadius: '6px', textAlign: 'center', marginBottom: '16px' } },
        React.createElement('div', { style: { fontSize: text.sm, fontWeight: '600', marginBottom: '12px' } }, t('organ.generateQr')),
        React.createElement('div', { id: 'organ-qr-output', style: { display: 'flex', justifyContent: 'center', marginBottom: '8px', minHeight: '220px' } })
      ),

      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.6' } },
        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('strong', { style: { color: palette.text } }, t('organ.swissOrganDonation')),
          React.createElement('div', { style: { marginTop: '6px' } },
            React.createElement('a', { href: 'https://www.donorcard.ch', target: '_blank', rel: 'noopener noreferrer', style: { color: palette.sand, textDecoration: 'none', fontWeight: '600' } }, '↗ donorcard.ch')
          )
        )
      )
    ),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, '○ ' + t('trust.localOnly'))
  ));
};

export default OrganDonation;
