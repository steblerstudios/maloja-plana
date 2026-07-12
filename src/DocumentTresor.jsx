import React, { useState } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { Icon } from './IconSystem.jsx';
import { getBereichForChapter } from './data/lebensbereiche.js';
import { text, weight, space, radius, shadow } from './config/tokens.js';
import { EmptyState } from './components/EmptyState.jsx';

const getDaysUntilExpiry = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const getExpiryStatus = (expiryDate, palette, t) => {
  const days = getDaysUntilExpiry(expiryDate);
  // Status-Farben als lesbarer Text auf der Karte (13px) — Deep-Varianten, damit der
  // Kontrast auf hellen Karten AA erfüllt (gold 2.19:1 / rose 3.59:1 / sage 4.11:1 auf up).
  if (days < 0) return { status: 'expired', color: palette.roseDeep, label: t('tresor.expired') };
  if (days < 90) return { status: 'warning', color: palette.goldDeep, label: days + 'd' };
  return { status: 'ok', color: palette.sageDeep, label: '✓' };
};

const OrdnerIcon = ({ palette, fillLevel }) => {
  const h = Math.min(10, Math.max(0, fillLevel * 2));
  return React.createElement('svg', {
    viewBox: '0 0 28 24', style: { width: '32px', height: '28px', flexShrink: 0 }, fill: 'none',
  },
    // Folder back
    React.createElement('path', {
      d: 'M 2 6 L 2 21 C 2 22.1 2.9 23 4 23 L 24 23 C 25.1 23 26 22.1 26 21 L 26 8 C 26 6.9 25.1 6 24 6 L 14 6 L 12 3 L 4 3 C 2.9 3 2 3.9 2 5 Z',
      stroke: palette.sage, strokeWidth: '1.2', fill: palette.sage + '08',
    }),
    // Tab dividers
    React.createElement('line', { x1: '8', y1: '6', x2: '8', y2: '4', stroke: palette.sage, strokeWidth: '0.8', opacity: 0.4 }),
    React.createElement('line', { x1: '11', y1: '6', x2: '11', y2: '4.5', stroke: palette.sage, strokeWidth: '0.8', opacity: 0.4 }),
    // Fill level
    h > 0 && React.createElement('rect', {
      x: '5', y: String(21 - h), width: '18', height: String(h),
      fill: palette.sage, opacity: 0.15, rx: '1',
    }),
    // Front flap
    React.createElement('path', {
      d: 'M 2 8 L 4 6 L 24 6 L 26 8',
      stroke: palette.sage, strokeWidth: '0.8', opacity: 0.3,
    }),
  );
};

export const DocumentTresor = ({
  palette,
  t,
  documents,
  chapters,
  onDownload,
  onDelete,
  onUpdateExpiry,
  initialTab,
  isDarkMode
}) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'all');
  // Ast-Farbe + Frucht pro Register — dieselbe Sprache wie der Lebensbaum.
  const bereichAccent = (chKey) => {
    const b = getBereichForChapter(chKey);
    return b ? (isDarkMode ? b.dark : b.light) : null;
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('expiry');
  const [showArchive, setShowArchive] = useState(false);
  const [editingDocId, setEditingDocId] = useState(null);
  const [editingExpiry, setEditingExpiry] = useState('');

  const active = documents.filter(d => getDaysUntilExpiry(d.expiryDate) >= 0);
  const archived = documents.filter(d => getDaysUntilExpiry(d.expiryDate) < 0);
  const displayDocs = showArchive ? archived : active;

  const filteredDocs = displayDocs.filter(doc => {
    const matchTab = activeTab === 'all' || doc.chapter === activeTab;
    const matchSearch = !searchTerm ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (sortBy === 'expiry') return getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate);
    if (sortBy === 'date') return new Date(b.uploadDate) - new Date(a.uploadDate);
    if (sortBy === 'name') return a.fileName.localeCompare(b.fileName);
    return 0;
  });

  const chapterList = chapters || [];

  // Count docs per chapter for register tabs
  const chapterCounts = {};
  displayDocs.forEach(d => {
    chapterCounts[d.chapter] = (chapterCounts[d.chapter] || 0) + 1;
  });
  // Kapitel mit Dokumenten — plus das aktuell gewählte Register (z.B. via Brief→Ablage-Crosslink),
  // damit man bei leerem Register trotzdem sieht, wo man gelandet ist.
  const chaptersWithDocs = chapterList.filter(c => chapterCounts[c.key] > 0 || c.key === activeTab);

  const stats = {
    active: active.length,
    expiring: active.filter(d => getDaysUntilExpiry(d.expiryDate) < 90).length,
    archived: archived.length,
  };

  const handleUpdateExpiry = (docId, newDate) => {
    onUpdateExpiry(docId, newDate);
    setEditingDocId(null);
  };

  const inputStyle = {
    width: '100%', padding: space.sm, borderRadius: radius.sm,
    border: '1px solid ' + palette.border, background: palette.surface,
    color: palette.text, boxSizing: 'border-box', fontSize: text.sm,
  };

  const tabStyle = (isActive, accent) => ({
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '6px 12px', background: isActive ? palette.surface : 'transparent',
    border: isActive ? '1px solid ' + palette.border : '1px solid transparent',
    // Aktiver Reiter trägt oben den farbigen Trennblatt-Streifen seines Astes.
    borderTop: isActive && accent ? '2px solid ' + accent : (isActive ? '1px solid ' + palette.border : '1px solid transparent'),
    borderBottom: isActive ? '1px solid ' + palette.surface : '1px solid ' + palette.border,
    borderRadius: '6px 6px 0 0', cursor: 'pointer', fontSize: text.xs,
    fontWeight: isActive ? weight.semi : weight.normal, color: isActive ? palette.text : palette.mid,
    marginBottom: '-1px', whiteSpace: 'nowrap',
  });

  // Group docs by chapter when showing "all"
  const groupedByChapter = {};
  if (activeTab === 'all') {
    sortedDocs.forEach(doc => {
      const key = doc.chapter || '_other';
      if (!groupedByChapter[key]) groupedByChapter[key] = [];
      groupedByChapter[key].push(doc);
    });
  }

  const renderDocCard = (doc) => {
    const status = getExpiryStatus(doc.expiryDate, palette, t);
    const chapter = chapterList.find(c => c.key === doc.chapter);
    const isEditing = editingDocId === doc.id;

    return React.createElement('div', {
      key: doc.id,
      style: {
        padding: '10px 12px', background: palette.up, borderRadius: radius.sm,
        border: '1px solid ' + (status.status === 'expired' ? palette.rose : palette.border),
        display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px',
      }
    },
      React.createElement('div', { style: { fontSize: text.sm, minWidth: 0 } },
        React.createElement('div', {
          style: { fontWeight: weight.semi, marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: text.sm }
        },
          React.createElement('span', null, chapter?.icon || '□'),
          doc.type
        ),
        React.createElement('div', {
          style: { color: palette.mid, fontSize: text.xs, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
        }, doc.fileName),
        React.createElement('div', {
          style: { color: palette.mid, fontSize: text.xs, marginBottom: space.xs }
        }, t('tresor.uploadedInfo', { date: doc.uploadDate, size: doc.fileSize })),

        isEditing
          ? React.createElement('div', { style: { marginTop: '6px' } },
              React.createElement('input', {
                type: 'date', value: editingExpiry,
                onChange: (e) => setEditingExpiry(e.target.value),
                'aria-label': t('chapterView.expiryDate'),
                style: { ...inputStyle, marginBottom: '6px', padding: '6px' },
              }),
              React.createElement('div', { style: { display: 'flex', gap: space.xs } },
                React.createElement('button', {
                  onClick: () => handleUpdateExpiry(doc.id, editingExpiry),
                  style: { flex: 1, padding: '4px 8px', background: palette.sage, color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: text.xs, fontWeight: weight.semi },
                }, '✓ OK'),
                React.createElement('button', {
                  onClick: () => setEditingDocId(null),
                  style: { flex: 1, padding: '4px 8px', background: palette.border, color: palette.text, border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: text.xs },
                }, t('common.cancel')),
              ),
            )
          : React.createElement('div', {
              style: { color: status.color, fontWeight: weight.semi, fontSize: text.xs }
            }, status.label + ' · ' + t('tresor.expiryDate', { date: doc.expiryDate })),
      ),

      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.xs } },
        React.createElement('button', {
          'aria-label': t('common.download'), onClick: () => onDownload(doc),
          style: { padding: '10px 12px', background: palette.sand, color: palette.onSand, border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: text.xs, fontWeight: weight.semi, minWidth: '36px', minHeight: '36px' },
        }, '↙'),
        React.createElement('button', {
          'aria-label': t('common.edit'),
          onClick: () => { setEditingDocId(doc.id); setEditingExpiry(doc.expiryDate); },
          style: { padding: '10px 12px', background: palette.sky, color: palette.onSand, border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: text.xs, fontWeight: weight.semi, minWidth: '36px', minHeight: '36px' },
        }, '○'),
        React.createElement('button', {
          'aria-label': t('common.delete'), onClick: () => onDelete(doc.id),
          style: { padding: '10px 12px', background: palette.roseBtn, color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: text.xs, fontWeight: weight.semi, minWidth: '36px', minHeight: '36px' },
        }, '✕'),
      ),
    );
  };

  return React.createElement('div', {
    style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border, boxShadow: shadow.sm }
  },
    // Title with folder icon
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'documents', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('tresor.title')),

    // Ordner status — warm language
    React.createElement('div', {
      style: { marginBottom: space.md, padding: '12px 14px', background: palette.up, borderRadius: radius.sm, display: 'flex', alignItems: 'center', gap: '12px' }
    },
      React.createElement(OrdnerIcon, { palette, fillLevel: documents.length }),
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } },
          t('tresor.docCount', { count: documents.length })
        ),
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '2px' } },
          documents.length === 0 ? t('tresor.ordnerEmpty')
          : documents.length < 5 ? t('tresor.ordnerStarting')
          : documents.length < 15 ? t('tresor.ordnerGrowing')
          : t('tresor.ordnerFull')
        ),
      ),
    ),

    // Stats row
    React.createElement('div', {
      style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: space.sm, marginBottom: space.md }
    },
      React.createElement('button', {
        type: 'button', 'aria-pressed': !showArchive,
        onClick: () => setShowArchive(false),
        style: {
          padding: '10px', background: palette.up, color: palette.text, borderRadius: radius.sm,
          textAlign: 'center', cursor: 'pointer', font: 'inherit',
          borderWidth: '2px', borderStyle: 'solid',
          borderColor: !showArchive ? palette.sand : palette.border,
        },
      },
        React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.sageDeep } }, stats.active),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('tresor.active')),
      ),
      React.createElement('div', {
        style: { padding: '10px', background: palette.up, borderRadius: radius.sm, textAlign: 'center', border: '2px solid ' + palette.border },
      },
        React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.goldDeep } }, stats.expiring),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('tresor.expiringSoon')),
      ),
      React.createElement('button', {
        type: 'button', 'aria-pressed': showArchive,
        onClick: () => setShowArchive(true),
        style: {
          padding: '10px', background: palette.up, color: palette.text, borderRadius: radius.sm,
          textAlign: 'center', cursor: 'pointer', font: 'inherit',
          borderWidth: '2px', borderStyle: 'solid',
          borderColor: showArchive ? palette.rose : palette.border,
        },
      },
        React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.roseDeep } }, stats.archived),
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('tresor.archive')),
      ),
    ),

    // Register tabs — Bundesordner Trennblätter
    (chaptersWithDocs.length > 0 || documents.length > 0) && React.createElement('div', {
      style: {
        display: 'flex', gap: '2px', borderBottom: '1px solid ' + palette.border,
        marginBottom: '12px', overflowX: 'auto', paddingBottom: 0,
      },
    },
      React.createElement('button', {
        onClick: () => setActiveTab('all'), style: tabStyle(activeTab === 'all'),
      }, t('tresor.allChapters') + ' (' + displayDocs.length + ')'),
      chaptersWithDocs.map(c => {
        const accent = bereichAccent(c.key);
        return React.createElement('button', {
          key: c.key, onClick: () => setActiveTab(c.key),
          'aria-label': c.title + ' (' + (chapterCounts[c.key] || 0) + ')',
          style: tabStyle(activeTab === c.key, accent),
        },
          // Bereichs-Icon (Chalet etc.) in der Ast-Farbe — Frucht nur am Baum.
          React.createElement('span', { style: { color: accent || palette.mid, display: 'inline-flex' } },
            React.createElement(Icon, { name: c.key, size: 14 })),
          React.createElement('span', null, chapterCounts[c.key] || 0),
        );
      }),
    ),

    // Search + Sort
    React.createElement('div', {
      style: { display: 'flex', gap: space.sm, marginBottom: '12px' }
    },
      React.createElement('input', {
        placeholder: t('common.search'), value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value), 'aria-label': t('common.search'),
        style: { ...inputStyle, flex: 1 },
      }),
      React.createElement('select', {
        value: sortBy, onChange: (e) => setSortBy(e.target.value),
        'aria-label': t('tresor.sortBy'),
        style: { ...inputStyle, width: 'auto', minWidth: '120px' },
      },
        React.createElement('option', { value: 'expiry' }, t('tresor.sortByExpiry')),
        React.createElement('option', { value: 'date' }, t('tresor.sortByUpload')),
        React.createElement('option', { value: 'name' }, t('tresor.sortByName')),
      ),
    ),

    // Document list
    sortedDocs.length === 0
      ? React.createElement(EmptyState, {
          palette,
          icon: React.createElement(OrdnerIcon, { palette, fillLevel: 0 }),
          title: t('tresor.noDocuments'),
          description: t('tresor.noDocumentsHint'),
        })
      : activeTab === 'all'
        // Grouped view — documents under chapter dividers
        ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.md, maxHeight: '600px', overflowY: 'auto' } },
            Object.keys(groupedByChapter).map(chKey => {
              const chapter = chapterList.find(c => c.key === chKey);
              const docs = groupedByChapter[chKey];
              const accent = bereichAccent(chKey);
              return React.createElement('div', { key: chKey },
                // Register-Trennblatt — Bereichs-Icon + Ast-Farbe (Frucht nur am Baum)
                React.createElement('div', {
                  style: {
                    fontSize: text.xs, fontWeight: weight.semi, color: accent || palette.mid,
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    paddingBottom: '6px', marginBottom: space.sm,
                    borderBottom: '1px solid ' + (accent ? accent + '44' : palette.border),
                    display: 'flex', alignItems: 'center', gap: '6px',
                  },
                },
                  accent
                    ? React.createElement('span', { style: { color: accent, display: 'inline-flex' } },
                        React.createElement(Icon, { name: chKey, size: 15 }))
                    : React.createElement('span', null, chapter?.icon || '□'),
                  chapter?.title || chKey,
                  React.createElement('span', {
                    style: { fontWeight: weight.normal, color: palette.soft }
                  }, ' · ' + docs.length),
                ),
                // Docs in this chapter
                React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
                  docs.map(renderDocCard),
                ),
              );
            }),
          )
        // Single chapter — flat list
        : React.createElement('div', {
            style: { display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '600px', overflowY: 'auto' }
          }, sortedDocs.map(renderDocCard)),

    // Local-only note
    React.createElement('div', {
      style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' }
    }, 'ⓘ ' + t('trust.localOnly')),
  );
};

export default DocumentTresor;
