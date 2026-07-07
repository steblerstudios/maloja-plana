import React from 'react';
import { Icon } from './IconSystem.jsx';
import { getLebensMappePreview, generateLebensmappe } from './dossierGenerator.js';
import { text, weight, radius , leading , space } from './config/tokens.js';
import { openPrintWindow } from './utils/helpers.js';

// ─── Lebensmappe View ─────────────────────────────────────
// Calm preview of the personal life overview dossier.
// Print via browser-native window.print() in a standalone HTML window.

export const Lebensmappe = ({ palette, t, data, chapters, documents, onNavigate }) => {

  const preview = getLebensMappePreview(data, chapters, t, documents);
  const hasSections = preview.sections.length > 0;

  const handlePrint = () => {
    const html = generateLebensmappe(data, chapters, t, documents);
    openPrintWindow(html);
  };

  // ─── Section preview card ───────────────────────────────
  const renderSection = (section) =>
    React.createElement('div', {
      key: section.key,
      style: {
        padding: '14px 16px',
        background: palette.up,
        borderRadius: radius.sm,
        marginBottom: space.sm,
      }
    },
      React.createElement('div', {
        style: {
          fontSize: text.sm, fontWeight: weight.semi, color: palette.text,
          marginBottom: space.sm, letterSpacing: '0.2px',
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
          React.createElement('span', { style: { fontWeight: weight.medium, textAlign: 'right', maxWidth: '55%' } }, row.value)
        )
      )
    );

  // ─── Empty state ────────────────────────────────────────
  const renderEmpty = () =>
    React.createElement('div', {
      style: {
        padding: '32px 20px', textAlign: 'center',
        background: palette.up, borderRadius: radius.sm,
        border: '1px solid ' + palette.border,
      }
    },
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.6' }
      }, t('lebensmappe.empty'))
    );

  return React.createElement('div', {
    style: { maxWidth: '520px' }
  },

    // ─── Back link ──────────────────────────────────────
    React.createElement('button', {
      onClick: () => onNavigate('unterlagen'),
      style: {
        background: 'none', border: 'none', cursor: 'pointer',
        color: palette.mid, fontSize: text.sm, padding: '0 0 16px 0',
        fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: space.xs,
      }
    }, '← ' + t('lebensmappe.back')),

    // ─── Header ─────────────────────────────────────────
    React.createElement('div', {
      style: {
        background: palette.surface, padding: '24px 20px', borderRadius: radius.sm,
        border: '1px solid ' + palette.border, marginBottom: '20px',
      }
    },
      React.createElement('h2', {
        style: {
          fontSize: text.lg, fontWeight: weight.semi, marginBottom: '6px',
          display: 'flex', alignItems: 'center', gap: space.sm, letterSpacing: '0.2px',
        }
      }, React.createElement(Icon, { name: 'documents', size: 18 }), t('lebensmappe.title')),
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: '14px' }
      }, t('lebensmappe.subtitle')),

      // Status summary
      hasSections && React.createElement('div', {
        style: { display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: text.sm, color: palette.soft }
      },
        React.createElement('span', null, t('lebensmappe.sectionsIncluded', { count: preview.sections.length })),
        preview.emptySections.length > 0 &&
          React.createElement('span', null, t('lebensmappe.sectionsMissing', { count: preview.emptySections.length })),
        preview.docCount > 0 &&
          React.createElement('span', null, t('lebensmappe.docsIncluded', { count: preview.docCount }))
      )
    ),

    // ─── Print button ───────────────────────────────────
    hasSections && React.createElement('button', {
      onClick: handlePrint,
      style: {
        width: '100%', padding: '12px', marginBottom: '20px',
        background: palette.sand, color: palette.onSand, border: 'none',
        borderRadius: radius.sm, cursor: 'pointer',
        fontSize: text.sm, fontWeight: weight.medium, fontFamily: 'inherit',
        letterSpacing: '0.2px',
      }
    }, t('lebensmappe.printAction')),

    // ─── Preview note ───────────────────────────────────
    hasSections && React.createElement('div', {
      style: { fontSize: text.sm, color: palette.soft, marginBottom: '12px' }
    }, t('lebensmappe.previewNote')),

    // ─── Content preview ────────────────────────────────
    hasSections
      ? preview.sections.map(renderSection)
      : renderEmpty(),

    // ─── Document references ────────────────────────────
    hasSections && preview.docCount > 0 && React.createElement('div', {
      style: {
        padding: '14px 16px', background: palette.up, borderRadius: radius.sm,
        marginBottom: space.sm,
      }
    },
      React.createElement('div', {
        style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: space.sm, letterSpacing: '0.2px' }
      }, t('lebensmappe.documents')),
      ...preview.docRefs.map((doc, i) =>
        React.createElement('div', {
          key: i,
          style: { fontSize: text.sm, color: palette.mid, padding: '2px 0' }
        }, 'ⓘ ' + doc.name)
      )
    ),

    // ─── Footer privacy note ────────────────────────────
    React.createElement('div', {
      style: {
        marginTop: space.md, fontSize: text.xs, color: palette.soft, lineHeight: '1.4',
      }
    }, 'ⓘ ' + t('lebensmappe.footerPrivacy'))
  );
};

export default Lebensmappe;
