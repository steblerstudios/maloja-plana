import React, { useState } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { generateCVTemplate, generateJSONResume, downloadCVAsHTML, downloadCVAsJSON } from './cvGenerator.js';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { ExportVorschau } from './components/ExportVorschau.jsx';
import { text, weight, radius , space } from './config/tokens.js';
import { ZielHinweis } from './components/ExternerLink.jsx';
import PrimaryButton from './components/PrimaryButton.jsx';

export const CVGenerator = ({ palette, t, data, _onUpdate }) => {
  const [preview, setPreview] = useState(false);
  // Export-Vorschau (K20): null | 'html' | 'json' — erst zeigen, was in der Datei steht.
  const [vorschau, setVorschau] = useState(null);
  const zweitKnopf = { flex: 1, minHeight: '44px', padding: '10px 16px', background: 'transparent', color: palette.text, border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontFamily: 'inherit', fontWeight: weight.medium, fontSize: text.sm };
  // Abschnitts-Überschriften optisch in Versalien, aber im Markup normale
  // Schreibweise (Screenreader liest Wörter statt Buchstaben) — text-transform.
  const headStyle = { textTransform: 'uppercase', letterSpacing: '0.5px' };

  const cv = generateCVTemplate(data, t);

  const handleDownload = () => {
    downloadCVAsHTML(cv, t);
  };

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'document', size: 22 }), style: { marginBottom: space.md } }, t('cv.title')),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: space.md } },
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm } },
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('cv.name')),
        React.createElement('div', { style: { fontWeight: weight.semi } }, cv.header.name)
      ),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm } },
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('cv.phone')),
        React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm } }, cv.header.phone)
      ),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm } },
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('cv.profession')),
        React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm } }, cv.experience.current.title || '—')
      ),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm } },
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.xs } }, t('cv.qualification')),
        React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.sm } }, cv.education.highest || '—')
      )
    ),

    // EIN Hauptknopf: der Lebenslauf als Datei (Seitenrundgang 27.09.2026 — vorher standen
    // «Vorschau» in Sand und «HTML» in Salbei gleich laut nebeneinander).
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm, marginBottom: vorschau ? 0 : space.md } },
      React.createElement(PrimaryButton, {
        palette, onClick: () => setVorschau('html'),
        style: { flex: 1, minHeight: '44px' },
      }, React.createElement(ZielHinweis, { t, art: 'download' }), t('cv.downloadHtml')),
      React.createElement('button', {
        type: 'button',
        onClick: () => setPreview(!preview),
        style: zweitKnopf,
      }, preview
        ? React.createElement(React.Fragment, null, hinweisZeichen('kreuz'), t('common.close'))
        : t('cv.preview')),
      React.createElement('button', {
        type: 'button',
        onClick: () => setVorschau('json'),
        title: t('cv.downloadJsonHint'),
        style: zweitKnopf,
      }, '{ } ' + t('cv.downloadJson'))
    ),

    // Export-Vorschau (K20) direkt unter den Knöpfen, die sie geöffnet haben.
    vorschau && React.createElement('div', { style: { marginBottom: space.md } },
      React.createElement(ExportVorschau, {
        palette, t,
        art: vorschau === 'json' ? 'cvJson' : 'cvHtml',
        quelle: vorschau === 'json' ? { resume: generateJSONResume(data, t) } : { cv, data },
        onWeiter: () => {
          const json = vorschau === 'json';
          setVorschau(null);
          if (json) downloadCVAsJSON(data, t); else handleDownload();
        },
        onZurueck: () => setVorschau(null),
      })
    ),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '12px' } }, hinweisZeichen(), t('trust.localOnly')),

    preview && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, maxHeight: '500px', overflowY: 'auto', fontSize: text.sm, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' } },
      React.createElement('div', null,
        React.createElement('h3', { style: { marginBottom: space.sm } }, cv.header.name),
        React.createElement('div', { style: { color: palette.mid, marginBottom: '12px' } }, cv.header.phone + ' | ' + cv.header.email),
        React.createElement('div', { style: { color: palette.mid, marginBottom: space.md } }, cv.header.address + ', ' + cv.header.city),
        React.createElement('hr', { style: { border: 'none', borderTop: '1px solid ' + palette.border, marginBottom: '12px' } }),
        React.createElement('strong', { style: headStyle }, t('cv.personalData')),
        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', null, cv.personal.dateOfBirth),
          React.createElement('div', null, cv.personal.nationality),
          React.createElement('div', null, cv.personal.maritalStatus)
        ),
        React.createElement('strong', { style: headStyle }, t('cv.experience')),
        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', null, cv.experience.current.title + ' — ' + cv.experience.current.company),
          React.createElement('div', { style: { color: palette.mid } }, cv.experience.current.startDate)
        ),
        React.createElement('strong', { style: headStyle }, t('cv.education')),
        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('div', null, cv.education.highest + ' — ' + cv.education.school)
        ),
        React.createElement('strong', { style: headStyle }, t('cv.languages')),
        React.createElement('div', null, cv.languages.list)
      )
    )
  );
};

export default CVGenerator;
