import React, { useState } from 'react';
import { getLetterTemplates, generateLetter } from './briefGenerator.js';
import { Icon } from './IconSystem.jsx';
import { text as textTokens, weight, radius , leading , space, ease, duration } from './config/tokens.js';
import { openPrintWindow } from './utils/helpers.js';

const BriefGenerator = ({ palette, t, data, onNavigate }) => {
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(false);
  const [printed, setPrinted] = useState(false);

  const templates = getLetterTemplates(t);
  const selectedTmpl = templates.find(tmpl => tmpl.key === selected);

  const handlePrint = () => {
    if (!selected) return;
    const html = generateLetter(selected, data, t);
    openPrintWindow(html);
    // Loop-Closure: nach dem Drucken ruhig zum Ablegen im Lebensordner führen
    setPrinted(true);
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
        fontSize: textTokens.lg, fontWeight: weight.semi, marginBottom: space.sm,
        display: 'flex', alignItems: 'center', gap: space.sm,
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
        onClick: () => { setSelected(tmpl.key); setPreview(false); setPrinted(false); },
        style: {
          padding: '14px 16px', background: selected === tmpl.key ? palette.up : palette.surface,
          border: '1px solid ' + (selected === tmpl.key ? palette.accent : palette.border),
          borderRadius: radius.sm, cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'flex-start', gap: '12px',
          transition: `border-color ${duration.normal}ms ${ease}`,
        }
      },
        React.createElement(Icon, { name: tmpl.icon, size: 20, color: selected === tmpl.key ? palette.accent : palette.mid }),
        React.createElement('div', null,
          React.createElement('div', {
            style: { fontWeight: weight.semi, fontSize: textTokens.body, marginBottom: space.xs }
          }, tmpl.title),
          React.createElement('div', {
            style: { fontSize: textTokens.sm, color: palette.mid, lineHeight: leading.normal }
          }, tmpl.description),
          tmpl.legalRef && React.createElement('div', {
            style: { fontSize: textTokens.xs, color: palette.soft, marginTop: space.xs }
          }, tmpl.legalRef)
        )
      ))
    ),

    // Actions
    selected && React.createElement('div', {
      style: { display: 'flex', gap: space.sm, marginBottom: space.md }
    },
      React.createElement('button', {
        onClick: () => setPreview(!preview),
        style: {
          padding: '10px 16px', background: palette.up, border: '1px solid ' + palette.border,
          borderRadius: radius.sm, cursor: 'pointer', fontSize: textTokens.sm, fontWeight: weight.medium,
        }
      }, preview ? t('briefe.hidePreview') : t('briefe.showPreview')),
      React.createElement('button', {
        onClick: handlePrint,
        style: {
          padding: '10px 16px', background: palette.accent, color: '#fff',
          border: 'none', borderRadius: radius.sm, cursor: 'pointer',
          fontSize: textTokens.sm, fontWeight: weight.medium,
        }
      }, t('briefe.printLetter'))
    ),

    // Data status
    selected && React.createElement('div', {
      style: {
        padding: '10px 14px', background: palette.up, borderRadius: radius.sm,
        fontSize: textTokens.sm, color: palette.mid, lineHeight: '1.6',
        marginBottom: space.md,
      }
    }, 'ⓘ ' + t('briefe.dataNote')),

    // Loop-Closure: nach dem Drucken ruhig zum Ablegen im Lebensordner führen
    printed && React.createElement('div', {
      style: {
        padding: '14px 16px', background: palette.sage + '14',
        border: '1px solid ' + palette.sage + '44', borderRadius: radius.sm,
        marginBottom: space.md, display: 'flex', flexDirection: 'column', gap: space.sm,
      }
    },
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'flex-start', gap: '10px' }
      },
        React.createElement(Icon, { name: 'document', size: 18, color: palette.sage }),
        React.createElement('div', null,
          React.createElement('div', {
            style: { fontWeight: weight.semi, fontSize: textTokens.body, marginBottom: space.xs }
          }, t('briefe.afterPrint.title')),
          React.createElement('div', {
            style: { fontSize: textTokens.sm, color: palette.mid, lineHeight: leading.normal }
          }, t('briefe.afterPrint.text'))
        )
      ),
      React.createElement('button', {
        onClick: () => onNavigate('tresor', undefined, selectedTmpl?.chapter || 'all'),
        style: {
          alignSelf: 'flex-start', padding: '8px 14px', background: palette.surface,
          border: '1px solid ' + palette.sage + '66', borderRadius: radius.sm,
          cursor: 'pointer', fontSize: textTokens.sm, fontWeight: weight.medium,
          color: palette.text,
        }
      }, t('briefe.afterPrint.toTresor') + ' →')
    ),

    // Preview
    preview && previewHtml && React.createElement('div', {
      style: {
        border: '1px solid ' + palette.border, borderRadius: radius.sm,
        overflow: 'hidden', background: '#fff',
      }
    },
      React.createElement('iframe', {
        srcDoc: previewHtml,
        style: { width: '100%', height: '700px', border: 'none' },
        title: t('backup.letterPreview'),
      })
    ),
  );
};

export default BriefGenerator;
