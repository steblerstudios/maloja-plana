import React, { useState } from 'react';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius } from './config/tokens.js';

const getDaysUntilExpiry = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const getExpiryStatus = (expiryDate, palette, t) => {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return { status: 'expired', color: palette.rose, label: t('tresor.expired') };
  if (days < 90) return { status: 'warning', color: palette.gold, label: days + 'd' };
  return { status: 'ok', color: palette.sage, label: '✓ OK' };
};

export const DocumentTresor = ({
  palette,
  t,
  documents,
  chapters,
  onDownload,
  onDelete,
  onUpdateExpiry
}) => {
  const [filterChapter, setFilterChapter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('expiry');
  const [showArchive, setShowArchive] = useState(false);
  const [editingDocId, setEditingDocId] = useState(null);
  const [editingExpiry, setEditingExpiry] = useState('');

  const active = documents.filter(d => getDaysUntilExpiry(d.expiryDate) >= 0);
  const archived = documents.filter(d => getDaysUntilExpiry(d.expiryDate) < 0);

  const displayDocs = showArchive ? archived : active;

  const filteredDocs = displayDocs.filter(doc => {
    const matchChapter = filterChapter === 'all' || doc.chapter === filterChapter;
    const matchSearch = !searchTerm ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchChapter && matchSearch;
  });

  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (sortBy === 'expiry') {
      return getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate);
    } else if (sortBy === 'date') {
      return new Date(b.uploadDate) - new Date(a.uploadDate);
    } else if (sortBy === 'name') {
      return a.fileName.localeCompare(b.fileName);
    }
    return 0;
  });

  const stats = {
    active: active.length,
    expiring: active.filter(d => getDaysUntilExpiry(d.expiryDate) < 90).length,
    archived: archived.length
  };

  const handleUpdateExpiry = (docId, newDate) => {
    onUpdateExpiry(docId, newDate);
    setEditingDocId(null);
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid ' + palette.border,
    background: palette.surface,
    color: palette.text,
    boxSizing: 'border-box',
    fontSize: text.sm,
    marginBottom: '8px'
  };

  const chapterList = chapters || [];

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' } },
    React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md + 'px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'documents', size: 20 }), t('tresor.title')),

    // Vault fill indicator
    React.createElement('div', {
      style: { marginBottom: '16px', padding: '12px 14px', background: palette.up, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }
    },
      React.createElement('svg', { viewBox: '0 0 24 24', style: { width: '28px', height: '28px', flexShrink: 0 }, fill: 'none' },
        React.createElement('rect', { x: '3', y: '6', width: '18', height: '16', rx: '2', stroke: palette.sage, strokeWidth: '1.5', fill: palette.sage + '10' }),
        React.createElement('rect', { x: '5', y: String(20 - Math.min(12, documents.length * 1.5)), width: '14', height: String(Math.min(12, documents.length * 1.5)), fill: palette.sage, opacity: 0.25, rx: '1' }),
        React.createElement('circle', { cx: '12', cy: '14', r: '2', stroke: palette.sage, strokeWidth: '1.5' }),
        React.createElement('path', { d: 'M 7 6 L 7 4 C 7 2.5 9 1 12 1 C 15 1 17 2.5 17 4 L 17 6', stroke: palette.sage, strokeWidth: '1.5', strokeLinecap: 'round' }),
      ),
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } },
          documents.length + ' ' + (documents.length === 1 ? 'Dokument' : 'Dokumente')
        ),
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '2px' } },
          documents.length === 0 ? 'Deine Ablage ist bereit'
          : documents.length < 5 ? 'Ein guter Anfang'
          : documents.length < 15 ? 'Deine Ablage füllt sich'
          : 'Alles an seinem Platz'
        ),
      ),
    ),

    // Stats
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px', marginBottom: '16px' } },
      React.createElement('button', { type: 'button', 'aria-pressed': !showArchive, style: { padding: '12px', background: palette.up, color: palette.text, borderRadius: '6px', textAlign: 'center', cursor: 'pointer', borderWidth: '2px', borderStyle: 'solid', borderColor: !showArchive ? palette.sand : palette.border, font: 'inherit' }, onClick: () => setShowArchive(false) },
        React.createElement('div', { style: { fontSize: '16px', fontWeight: '600', color: palette.sage } }, stats.active),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('tresor.active'))
      ),
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: '6px', textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: '16px', fontWeight: '600', color: palette.gold } }, stats.expiring),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('tresor.expiringSoon'))
      ),
      React.createElement('button', { type: 'button', 'aria-pressed': showArchive, style: { padding: '12px', background: palette.up, color: palette.text, borderRadius: '6px', textAlign: 'center', cursor: 'pointer', borderWidth: '2px', borderStyle: 'solid', borderColor: showArchive ? palette.rose : palette.border, font: 'inherit' }, onClick: () => setShowArchive(true) },
        React.createElement('div', { style: { fontSize: '16px', fontWeight: '600', color: palette.rose } }, stats.archived),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('tresor.archive'))
      )
    ),

    // Filter & Search
    React.createElement('div', { style: { marginBottom: '16px' } },
      React.createElement('input', {
        placeholder: t('common.search'),
        value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value),
        style: inputStyle
      }),
      React.createElement('select', {
        value: filterChapter,
        onChange: (e) => setFilterChapter(e.target.value),
        style: { ...inputStyle, marginBottom: '8px' }
      },
        React.createElement('option', { value: 'all' }, '□ ' + t('tresor.allChapters')),
        chapterList.map(c => React.createElement('option', { key: c.key, value: c.key }, c.icon + ' ' + c.title))
      ),
      React.createElement('select', {
        value: sortBy,
        onChange: (e) => setSortBy(e.target.value),
        style: inputStyle
      },
        React.createElement('option', { value: 'expiry' }, t('tresor.sortByExpiry')),
        React.createElement('option', { value: 'date' }, t('tresor.sortByUpload')),
        React.createElement('option', { value: 'name' }, t('tresor.sortByName'))
      )
    ),

    // Documents List
    sortedDocs.length === 0 ? React.createElement('div', { style: { padding: '40px 20px', background: palette.up, borderRadius: '8px', border: '1px solid ' + palette.border, textAlign: 'center' } },
      React.createElement('div', { style: { marginBottom: '12px' } }, React.createElement(Icon, { name: 'tresor', size: 28 })),
      React.createElement('p', { style: { fontSize: text.body, color: palette.text, margin: '0 0 6px 0' } }, t('tresor.noDocuments')),
      React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: 0 } }, t('tresor.noDocumentsHint'))
    ) : React.createElement('div', { style: { display: 'grid', gap: '8px', maxHeight: '600px', overflowY: 'auto' } },
      sortedDocs.map(doc => {
        const status = getExpiryStatus(doc.expiryDate, palette, t);
        const chapter = chapterList.find(c => c.key === doc.chapter);
        const isEditing = editingDocId === doc.id;

        return React.createElement('div', {
          key: doc.id,
          style: {
            padding: '12px',
            background: palette.up,
            borderRadius: '6px',
            border: '1px solid ' + (status.status === 'expired' ? palette.rose : palette.border),
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '12px'
          }
        },
          React.createElement('div', { style: { fontSize: text.sm } },
            React.createElement('div', { style: { fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' } },
              React.createElement('span', { style: { fontSize: text.body } }, doc.uploadStatus === 'uploading' ? '○' : doc.uploadStatus === 'success' ? '✓' : (chapter?.icon || '□')),
              (chapter?.icon || '□') + ' ' + doc.type
            ),
            React.createElement('div', { style: { color: palette.mid, fontSize: text.xs, marginBottom: '4px' } }, doc.fileName),
            React.createElement('div', { style: { color: palette.mid, fontSize: text.xs, marginBottom: '6px' } },
              t('tresor.uploadedInfo', { date: doc.uploadDate, size: doc.fileSize })
            ),

            // Expiry editor
            isEditing ? React.createElement('div', { style: { marginTop: '8px' } },
              React.createElement('input', {
                type: 'date',
                value: editingExpiry,
                onChange: (e) => setEditingExpiry(e.target.value),
                style: { width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box', fontSize: text.sm, marginBottom: '6px' }
              }),
              React.createElement('div', { style: { display: 'flex', gap: '4px' } },
                React.createElement('button', {
                  onClick: () => handleUpdateExpiry(doc.id, editingExpiry),
                  style: { flex: 1, padding: '4px 8px', background: palette.sage, color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: text.xs, fontWeight: weight.semi }
                }, '✓ OK'),
                React.createElement('button', {
                  onClick: () => setEditingDocId(null),
                  style: { flex: 1, padding: '4px 8px', background: palette.border, color: palette.text, border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: text.xs }
                }, t('common.cancel'))
              )
            ) : React.createElement('div', { style: { marginTop: '6px', color: status.color, fontWeight: weight.semi, fontSize: text.sm } },
              status.label + ' | ' + t('tresor.expiryDate', { date: doc.expiryDate })
            )
          ),

          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
            React.createElement('button', {
              'aria-label': t('common.download'),
              onClick: () => onDownload(doc),
              style: {
                padding: '6px 10px',
                background: palette.sand,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '3px',
                fontSize: text.xs,
                fontWeight: '600'
              }
            }, '↙'),
            React.createElement('button', {
              'aria-label': t('common.edit'),
              onClick: () => setEditingDocId(doc.id) || setEditingExpiry(doc.expiryDate),
              style: {
                padding: '6px 10px',
                background: palette.sky,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '3px',
                fontSize: text.xs,
                fontWeight: '600'
              }
            }, '○'),
            React.createElement('button', {
              'aria-label': t('common.delete'),
              onClick: () => onDelete(doc.id),
              style: {
                padding: '6px 10px',
                background: palette.rose,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '3px',
                fontSize: text.xs,
                fontWeight: '600'
              }
            }, '✕')
          )
        );
      })
    ),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, '○ ' + t('trust.localOnly'))
  );
};

export default DocumentTresor;
