import React, { useState } from 'react';
import { generateCVTemplate, generateCVHTML, downloadCVAsHTML } from './cvGenerator.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, radius , space } from './config/tokens.js';

export const CVGenerator = ({ palette, t, data, onUpdate }) => {
  const [preview, setPreview] = useState(false);

  const cv = generateCVTemplate(data, t);
  const cvHtml = generateCVHTML(cv, t);

  const handleDownload = () => {
    downloadCVAsHTML(cv, t);
  };

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'document', size: 20 }), t('cv.title')),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: space.md } },
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm } },
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, '◎ ' + t('cv.name')),
        React.createElement('div', { style: { fontWeight: weight.semi } }, cv.header.name)
      ),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm } },
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, 'ⓘ ' + t('cv.phone')),
        React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm } }, cv.header.phone)
      ),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm } },
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, '◇ ' + t('cv.profession')),
        React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm } }, cv.experience.current.title || '—')
      ),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm } },
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, '✦ ' + t('cv.qualification')),
        React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm } }, cv.education.highest || '—')
      )
    ),

    React.createElement('div', { style: { display: 'flex', gap: space.sm, marginBottom: space.md } },
      React.createElement('button', {
        onClick: () => setPreview(!preview),
        style: { flex: 1, padding: '10px', background: palette.sand, color: '#fff', border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm }
      }, preview ? '✕ ' + t('common.close') : '◉ ' + t('cv.preview')),
      React.createElement('button', {
        onClick: handleDownload,
        style: { flex: 1, padding: '10px', background: palette.sage, color: '#000', border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm }
      }, '↙ ' + t('cv.downloadHtml'))
    ),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '12px' } }, 'ⓘ ' + t('trust.localOnly')),

    preview && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, maxHeight: '500px', overflowY: 'auto', fontSize: text.sm, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' } },
      React.createElement('div', null,
        React.createElement('h3', { style: { marginBottom: space.sm } }, cv.header.name),
        React.createElement('div', { style: { color: palette.mid, marginBottom: '12px' } }, cv.header.phone + ' | ' + cv.header.email),
        React.createElement('div', { style: { color: palette.mid, marginBottom: space.md } }, cv.header.address + ', ' + cv.header.city),
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
