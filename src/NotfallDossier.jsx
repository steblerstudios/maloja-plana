import React from 'react';
import { Icon } from './IconSystem.jsx';
import { getNotfallDossierPreview, generateNotfallDossier } from './dossierGenerator.js';
import { text, weight } from './config/tokens.js';

export const NotfallDossier = ({ palette, t, data, chapters, onNavigate }) => {

  const preview = getNotfallDossierPreview(data, chapters, t);
  const hasSections = preview.sections.length > 0;

  const handlePrint = () => {
    const html = generateNotfallDossier(data, chapters, t);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  const renderSection = (section) =>
    React.createElement('div', {
      key: section.key,
      style: {
        padding: '14px 16px',
        background: palette.up,
        borderRadius: '6px',
        marginBottom: '8px',
      }
    },
      React.createElement('div', {
        style: {
          fontSize: text.sm, fontWeight: '600', color: palette.text,
          marginBottom: '8px', letterSpacing: '0.2px',
        }
      }, section.title),
      ...section.rows.map((row, i) =>
        React.createElement('div', {
          key: i,
          style: {
            display: 'flex', justifyContent: 'space-between',
            padding: '3px 0', fontSize: text.sm,
            borderBottom: i < section.rows.length - 1 ? '1px solid ' + palette.border : 'none',
          }
        },
          React.createElement('span', { style: { color: palette.mid } }, row.label),
          React.createElement('span', { style: { fontWeight: '500', textAlign: 'right', maxWidth: '55%' } }, row.value)
        )
      )
    );

  const renderEmpty = () =>
    React.createElement('div', {
      style: {
        padding: '32px 20px', textAlign: 'center',
        background: palette.up, borderRadius: '8px',
        border: '1px solid ' + palette.border,
      }
    },
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.6' }
      }, t('notfallDossier.empty'))
    );

  return React.createElement('div', {
    style: { maxWidth: '520px' }
  },

    React.createElement('button', {
      onClick: () => onNavigate('unterlagen'),
      style: {
        background: 'none', border: 'none', cursor: 'pointer',
        color: palette.mid, fontSize: text.sm, padding: '0 0 16px 0',
        fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px',
      }
    }, '← ' + t('notfallDossier.back')),

    React.createElement('div', {
      style: {
        background: palette.surface, padding: '24px 20px', borderRadius: '8px',
        border: '1px solid ' + palette.border, marginBottom: '20px',
      }
    },
      React.createElement('h2', {
        style: {
          fontSize: '17px', fontWeight: '600', marginBottom: '6px',
          display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.2px',
        }
      }, React.createElement(Icon, { name: 'emergency', size: 18 }), t('notfallDossier.title')),
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.5', marginBottom: '14px' }
      }, t('notfallDossier.subtitle')),

      hasSections && React.createElement('div', {
        style: { display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: text.sm, color: palette.soft }
      },
        React.createElement('span', null, t('notfallDossier.sectionsIncluded', { count: preview.sections.length })),
        preview.emptySections.length > 0 &&
          React.createElement('span', null, t('notfallDossier.sectionsMissing', { count: preview.emptySections.length }))
      )
    ),

    React.createElement('div', {
      style: {
        padding: '10px 14px', marginBottom: '16px',
        background: palette.up, borderRadius: '6px',
        fontSize: text.sm, color: palette.mid, lineHeight: '1.5',
      }
    }, '○ ' + t('notfallDossier.privacyNote')),

    hasSections && React.createElement('button', {
      onClick: handlePrint,
      style: {
        width: '100%', padding: '12px', marginBottom: '20px',
        background: palette.sand, color: '#fff', border: 'none',
        borderRadius: '6px', cursor: 'pointer',
        fontSize: text.sm, fontWeight: '500', fontFamily: 'inherit',
        letterSpacing: '0.2px',
      }
    }, t('notfallDossier.printAction')),

    hasSections && React.createElement('div', {
      style: { fontSize: text.sm, color: palette.soft, marginBottom: '12px' }
    }, t('notfallDossier.previewNote')),

    hasSections
      ? preview.sections.map(renderSection)
      : renderEmpty(),

    React.createElement('div', {
      style: {
        marginTop: '16px', fontSize: text.xs, color: palette.soft, lineHeight: '1.4',
      }
    }, '○ ' + t('notfallDossier.footerPrivacy'))
  );
};

export default NotfallDossier;
