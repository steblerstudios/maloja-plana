import React, { useState } from 'react';
import { generateCVTemplate, generateCVHTML, downloadCVAsHTML } from './cvGenerator.js';
import { Icon } from './IconSystem.jsx';

export const CVGenerator = ({ palette, t, data, onUpdate }) => {
  const [preview, setPreview] = useState(false);

  const cv = generateCVTemplate(data, t);
  const cvHtml = generateCVHTML(cv, t);

  const handleDownload = () => {
    downloadCVAsHTML(cv, t);
  };

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
    React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'document', size: 20 }), t('cv.title')),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' } },
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px' } },
        React.createElement('div', { style: { fontSize: '12px', color: palette.mid, marginBottom: '4px' } }, '◎ ' + t('cv.name')),
        React.createElement('div', { style: { fontWeight: '600' } }, cv.header.name)
      ),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px' } },
        React.createElement('div', { style: { fontSize: '12px', color: palette.mid, marginBottom: '4px' } }, '○ ' + t('cv.phone')),
        React.createElement('div', { style: { fontWeight: '600', fontSize: '13px' } }, cv.header.phone)
      ),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px' } },
        React.createElement('div', { style: { fontSize: '12px', color: palette.mid, marginBottom: '4px' } }, '◇ ' + t('cv.profession')),
        React.createElement('div', { style: { fontWeight: '600', fontSize: '13px' } }, cv.experience.current.title || '—')
      ),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px' } },
        React.createElement('div', { style: { fontSize: '12px', color: palette.mid, marginBottom: '4px' } }, '✦ ' + t('cv.qualification')),
        React.createElement('div', { style: { fontWeight: '600', fontSize: '13px' } }, cv.education.highest || '—')
      )
    ),

    React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '16px' } },
      React.createElement('button', {
        onClick: () => setPreview(!preview),
        style: { flex: 1, padding: '10px', background: palette.sand, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }
      }, preview ? '✕ ' + t('common.close') : '◉ ' + t('cv.preview')),
      React.createElement('button', {
        onClick: handleDownload,
        style: { flex: 1, padding: '10px', background: palette.sage, color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }
      }, '↙ ' + t('cv.downloadHtml'))
    ),

    React.createElement('div', { style: { fontSize: '12px', color: palette.mid, marginBottom: '12px' } }, '○ ' + t('trust.localOnly')),

    preview && React.createElement('div', { style: { padding: '16px', background: palette.up, borderRadius: '6px', maxHeight: '500px', overflowY: 'auto', fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' } },
      React.createElement('div', null,
        React.createElement('h3', { style: { marginBottom: '8px' } }, cv.header.name),
        React.createElement('div', { style: { color: palette.mid, marginBottom: '12px' } }, cv.header.phone + ' | ' + cv.header.email),
        React.createElement('div', { style: { color: palette.mid, marginBottom: '16px' } }, cv.header.address + ', ' + cv.header.city),
        React.createElement('hr', { style: { border: 'none', borderTop: '1px solid ' + palette.border, marginBottom: '12px' } }),
        React.createElement('strong', null, t('cv.personalData')),
        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', null, cv.personal.dateOfBirth),
          React.createElement('div', null, cv.personal.nationality),
          React.createElement('div', null, cv.personal.maritalStatus)
        ),
        React.createElement('strong', null, t('cv.experience')),
        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', null, cv.experience.current.title + ' — ' + cv.experience.current.company),
          React.createElement('div', { style: { color: palette.mid } }, cv.experience.current.startDate)
        ),
        React.createElement('strong', null, t('cv.education')),
        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', null, cv.education.highest + ' — ' + cv.education.school)
        ),
        React.createElement('strong', null, t('cv.languages')),
        React.createElement('div', null, cv.languages.list)
      )
    )
  );
};

export default CVGenerator;
