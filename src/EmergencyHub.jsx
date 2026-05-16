import React, { useState } from 'react';
import { Icon } from './IconSystem.jsx';

export const EmergencyHub = ({ palette, t, data, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const emergencyData = {
    name: data.basis?.fullName || '',
    phone: data.basis?.phone || '',
    bloodType: data.notfall?.bloodType || 'unknown',
    emergencyContact: data.notfall?.emergencyContact || '',
    emergencyPhone: data.notfall?.emergencyPhone || '',
    allergies: data.notfall?.allergies || '',
    medications: data.notfall?.medications || '',
    chronicDiseases: data.notfall?.chronicDiseases || '',
    doctor: data.notfall?.doctor || '',
    doctorPhone: data.notfall?.doctorPhone || '',
    hospital: data.notfall?.hospital || '',
    advanceDirective: data.notfall?.advanceDirective || 'no'
  };

  const handleGenerateCard = () => {
    const cardContent = `
======================================
          ${t('emergency.title').toUpperCase()}
======================================

◎ ${t('cv.name')}:
   ${emergencyData.name}
   ${emergencyData.phone}

◉ ${t('emergency.bloodType')}:
   ${emergencyData.bloodType}

!! ${t('emergency.allergies')}:
   ${emergencyData.allergies || t('common.none')}

Rx ${t('emergency.medications')}:
   ${emergencyData.medications || t('common.none')}

✦ ${t('emergency.emergencyContact')}:
   ${emergencyData.emergencyContact}
   ${emergencyData.emergencyPhone}

○ ${t('emergency.doctor')}:
   ${emergencyData.doctor}
   ${emergencyData.doctorPhone}

⌂ ${t('emergency.hospital')}:
   ${emergencyData.hospital}

======================================
    `;

    const blob = new Blob([cardContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Emergency_Card_${emergencyData.name.replace(/\s/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const bloodTypeColors = {
    '0+': palette.rose, '0-': palette.rose,
    'A+': palette.gold, 'A-': palette.gold,
    'B+': palette.sky, 'B-': palette.sky,
    'AB+': palette.sage, 'AB-': palette.sage,
    'unknown': palette.mid
  };

  return React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
    React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'emergency', size: 20 }), t('emergency.title')),

    // Blood Type
    React.createElement('div', { style: { padding: '20px', background: (bloodTypeColors[emergencyData.bloodType] || palette.mid) + '33', borderRadius: '8px', border: '3px solid ' + (bloodTypeColors[emergencyData.bloodType] || palette.mid), marginBottom: '16px', textAlign: 'center' } },
      React.createElement('div', { style: { fontSize: '12px', color: palette.mid, marginBottom: '6px' } }, t('emergency.bloodType')),
      React.createElement('div', { style: { fontSize: '48px', fontWeight: 'bold', color: bloodTypeColors[emergencyData.bloodType] || palette.mid } }, emergencyData.bloodType)
    ),

    // Emergency Contact
    React.createElement('div', { style: { padding: '12px', background: palette.rose + '22', borderRadius: '6px', border: '2px solid ' + palette.rose, marginBottom: '16px' } },
      React.createElement('h3', { style: { fontSize: '13px', fontWeight: '600', color: palette.rose, marginBottom: '8px' } }, '✦ ' + t('emergency.emergencyContact')),
      React.createElement('div', { style: { fontSize: '12px' } },
        React.createElement('div', { style: { fontWeight: '600', marginBottom: '4px' } }, emergencyData.emergencyContact),
        React.createElement('div', { style: { color: palette.mid } }, emergencyData.emergencyPhone)
      )
    ),

    // Allergies
    emergencyData.allergies && React.createElement('div', { style: { padding: '12px', background: palette.gold + '22', borderRadius: '6px', border: '2px solid ' + palette.gold, marginBottom: '16px' } },
      React.createElement('h3', { style: { fontSize: '13px', fontWeight: '600', color: palette.gold, marginBottom: '6px' } }, t('emergency.allergies')),
      React.createElement('div', { style: { fontSize: '12px', whiteSpace: 'pre-wrap' } }, emergencyData.allergies)
    ),

    // Medications
    emergencyData.medications && React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', marginBottom: '16px' } },
      React.createElement('h3', { style: { fontSize: '13px', fontWeight: '600', marginBottom: '6px' } }, '○ ' + t('emergency.medications')),
      React.createElement('div', { style: { fontSize: '12px', whiteSpace: 'pre-wrap', color: palette.mid } }, emergencyData.medications)
    ),

    // Doctor & Hospital
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px', marginBottom: '16px' } },
      emergencyData.doctor && React.createElement('div', { style: { padding: '10px', background: palette.up, borderRadius: '6px', fontSize: '11px' } },
        React.createElement('div', { style: { color: palette.mid, marginBottom: '4px' } }, '○ ' + t('emergency.doctor')),
        React.createElement('div', { style: { fontWeight: '600', marginBottom: '4px' } }, emergencyData.doctor),
        React.createElement('div', { style: { color: palette.mid, fontSize: '10px' } }, emergencyData.doctorPhone)
      ),
      emergencyData.hospital && React.createElement('div', { style: { padding: '10px', background: palette.up, borderRadius: '6px', fontSize: '11px' } },
        React.createElement('div', { style: { color: palette.mid, marginBottom: '4px' } }, '◰ ' + t('emergency.hospital')),
        React.createElement('div', { style: { fontWeight: '600' } }, emergencyData.hospital)
      )
    ),

    // Action buttons
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' } },
      React.createElement('button', {
        onClick: handleGenerateCard,
        style: { padding: '10px', background: palette.sand, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }
      }, '□ ' + t('emergency.emergencyCard')),
      React.createElement('button', {
        onClick: () => setShowQR(!showQR),
        style: { padding: '10px', background: palette.sage, color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }
      }, '○ ' + t('emergency.qrCode')),
      React.createElement('button', {
        onClick: () => setEditMode(!editMode),
        style: { padding: '10px', background: palette.sky, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }
      }, '✎ ' + t('emergency.edit'))
    ),

    // Tips
    React.createElement('div', { style: { marginTop: '16px', padding: '12px', background: palette.up, borderRadius: '6px', fontSize: '11px', color: palette.mid } },
      React.createElement('strong', null, '○ ' + t('common.recommendations') + ':'),
      React.createElement('div', { style: { marginTop: '6px' } },
        React.createElement('div', null, '✓ ' + t('emergency.tips.card')),
        React.createElement('div', null, '✓ ' + t('emergency.tips.contact')),
        React.createElement('div', null, '✓ ' + t('emergency.tips.blood')),
        React.createElement('div', null, '✓ ' + t('emergency.tips.allergies'))
      )
    ),

    // Vorsorge documents
    React.createElement('div', { style: { marginTop: '16px', padding: '16px', background: palette.up, borderRadius: '8px', border: '1px solid ' + palette.border } },
      React.createElement('h3', { style: { fontSize: '14px', fontWeight: '600', marginBottom: '6px' } }, '○ ' + t('emergency.vorsorge.title')),
      React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginBottom: '12px' } }, t('emergency.vorsorge.intro')),
      React.createElement('div', { style: { display: 'grid', gap: '10px' } },
        [
          { key: 'patientenverfuegung', title: t('emergency.vorsorge.patientenverfuegung'), desc: t('emergency.vorsorge.patientenverfuegungDesc') },
          { key: 'vorsorgeauftrag', title: t('emergency.vorsorge.vorsorgeauftrag'), desc: t('emergency.vorsorge.vorsorgeauftragDesc') },
          { key: 'bestattungswuensche', title: t('emergency.vorsorge.bestattungswuensche'), desc: t('emergency.vorsorge.bestattungswuenscheDesc') },
        ].map(item => React.createElement('div', { key: item.key, style: { padding: '10px', background: palette.surface, borderRadius: '6px', border: '1px solid ' + palette.border } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' } },
            React.createElement('div', { style: { fontSize: '12px', fontWeight: '600' } }, item.title),
            React.createElement('div', { style: { fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: data.notfall?.[item.key] === 'yes' ? palette.sage + '33' : palette.up, color: data.notfall?.[item.key] === 'yes' ? palette.sage : palette.mid } },
              data.notfall?.[item.key] === 'yes' ? t('emergency.vorsorge.statusYes') : t('emergency.vorsorge.statusNo'))
          ),
          React.createElement('div', { style: { fontSize: '11px', color: palette.mid } }, item.desc)
        ))
      )
    )
  );
};

export default EmergencyHub;
