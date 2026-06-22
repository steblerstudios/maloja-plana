import React, { useState } from 'react';
import { getLetterTemplates, generateLetter } from './briefGenerator.js';
import { Icon } from './IconSystem.jsx';
import { text as textTokens, weight } from './config/tokens.js';

const BriefGenerator = ({ palette, t, data, onNavigate }) => {
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(false);

  const templates = getLetterTemplates(t);

  const handlePrint = () => {
    if (!selected) return;
    const html = generateLetter(selected, data, t);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      win.print();
    }
  };

  const previewHtml = selected ? generateLetter(selected, data, t) : '';

  return React.createElement('div', {
    style: { maxWidth: '720px', margin: '0 auto' }
  },
    // Back button
    React.createElement('button', {
      onClick: () => onNavigate('unterlagen'),
      style: {
        background: 'none', border: 'none', color: palette.mid,
        fontSize: textTokens.sm, cursor: 'pointer', padding: '8px 0',
        marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px',
      }
    }, '← ' + t('briefe.backToUnterlagen')),

    // Title
    React.createElement('h2', {
      style: {
        fontSize: textTokens.lg, fontWeight: weight.semi, marginBottom: '8px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }
    }, React.createElement(Icon, { name: 'document', size: 20 }), t('briefe.title')),

    React.createElement('p', {
      style: { fontSize: textTokens.sm, color: palette.mid, marginBottom: '20px', lineHeight: '1.6' }
    }, t('briefe.intro')),

    // Template cards
    React.createElement('div', {
      style: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }
    },
      templates.map(tmpl => React.createElement('button', {
        key: tmpl.key,
        onClick: () => { setSelected(tmpl.key); setPreview(false); },
        style: {
          padding: '14px 16px', background: selected === tmpl.key ? palette.up : palette.surface,
          border: '1px solid ' + (selected === tmpl.key ? palette.accent : palette.border),
          borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'flex-start', gap: '12px',
          transition: 'border-color 0.2s',
        }
      },
        React.createElement(Icon, { name: tmpl.icon, size: 20, color: selected === tmpl.key ? palette.accent : palette.mid }),
        React.createElement('div', null,
          React.createElement('div', {
            style: { fontWeight: weight.semi, fontSize: textTokens.body, marginBottom: '4px' }
          }, tmpl.title),
          React.createElement('div', {
            style: { fontSize: textTokens.sm, color: palette.mid, lineHeight: '1.5' }
          }, tmpl.description),
          tmpl.legalRef && React.createElement('div', {
            style: { fontSize: textTokens.xs, color: palette.soft, marginTop: '4px' }
          }, tmpl.legalRef)
        )
      ))
    ),

    // Actions
    selected && React.createElement('div', {
      style: { display: 'flex', gap: '8px', marginBottom: '16px' }
    },
      React.createElement('button', {
        onClick: () => setPreview(!preview),
        style: {
          padding: '10px 16px', background: palette.up, border: '1px solid ' + palette.border,
          borderRadius: '6px', cursor: 'pointer', fontSize: textTokens.sm, fontWeight: weight.medium,
        }
      }, preview ? t('briefe.hidePreview') : t('briefe.showPreview')),
      React.createElement('button', {
        onClick: handlePrint,
        style: {
          padding: '10px 16px', background: palette.accent, color: '#fff',
          border: 'none', borderRadius: '6px', cursor: 'pointer',
          fontSize: textTokens.sm, fontWeight: weight.medium,
        }
      }, t('briefe.printLetter'))
    ),

    // Data status
    selected && React.createElement('div', {
      style: {
        padding: '10px 14px', background: palette.up, borderRadius: '6px',
        fontSize: textTokens.sm, color: palette.mid, lineHeight: '1.6',
        marginBottom: '16px',
      }
    }, '○ ' + t('briefe.dataNote')),

    // Preview
    preview && previewHtml && React.createElement('div', {
      style: {
        border: '1px solid ' + palette.border, borderRadius: '8px',
        overflow: 'hidden', background: '#fff',
      }
    },
      React.createElement('iframe', {
        srcDoc: previewHtml,
        style: { width: '100%', height: '700px', border: 'none' },
        title: 'Letter preview',
      })
    ),
  );
};

export default BriefGenerator;
