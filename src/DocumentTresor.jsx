import React, { useState } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { getBereichForChapter } from './data/lebensbereiche.js';
import { text, weight, space, radius, shadow } from './config/tokens.js';
import { ansichtIkon } from './config/ansichtenRegister.js';

// Fassung 5 (Entscheid 23.10.2026, VERGLEICH.md «Dokumentenablage · entschieden»):
// leer = ruhiges Bild + «Was oft zuerst hineingehört»; mit Inhalt = «{n} Dokumente»,
// drei Zähler «Aktiv · Bald fällig · Archiv», Suche und Sortierung, eine Zeile pro Dokument.
// Die Rechnung bleibt wie bisher: Archiv = abgelaufen, «Bald fällig» = aktiv und < 90 Tage.

export const getDaysUntilExpiry = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Fach eines Dokuments: 'archiv' (abgelaufen), 'bald' (aktiv, < 90 Tage) oder 'aktiv'.
export const imFach = (doc, fach) => {
  const tage = getDaysUntilExpiry(doc.expiryDate);
  if (fach === 'archiv') return tage < 0;
  if (fach === 'bald') return tage >= 0 && tage < 90;
  return tage >= 0;
};

export const ablageZaehler = (documents) => ({
  active: documents.filter(d => imFach(d, 'aktiv')).length,
  expiring: documents.filter(d => imFach(d, 'bald')).length,
  archived: documents.filter(d => imFach(d, 'archiv')).length,
});

const getExpiryStatus = (expiryDate, palette, t) => {
  const days = getDaysUntilExpiry(expiryDate);
  // Lesbarer Text auf der Fläche (13px) — Deep-Varianten für AA. Fassung 5: «Bald fällig» in
  // Gold als Hinweis, «Abgelaufen» ruhig in Grau statt in Rot (Notiz unter dem Mockup).
  if (days < 0) return { status: 'expired', color: palette.mid, label: t('tresor.expired') };
  if (days < 90) return { status: 'warning', color: palette.goldDeep, label: days + 'd' };
  return { status: 'ok', color: palette.sageDeep, label: t('tresor.gueltig') };
};

// ISO-Datum (JJJJ-MM-TT) als TT.MM.JJJJ; alles andere bleibt, wie es gespeichert ist.
export const ablaufAnzeige = (datum) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datum || '');
  return m ? m[3] + '.' + m[2] + '.' + m[1] : (datum || '');
};

// «Was oft zuerst hineingehört» — drei Vorschläge (Fassung 5). Ein Vorschlag fällt weg, sobald
// das passende Dokument abgelegt ist; der ganze Block nur, solange die Ablage leer oder fast
// leer ist (unter 5 Dokumenten, dieselbe Schwelle wie «Ein guter Anfang.»).
export const VORSCHLAEGE = [
  { key: 'id', label: 'tresor.suggestId', chapter: 'basis', erledigt: (d) => d.type === 'id' },
  { key: 'lease', label: 'tresor.suggestLease', chapter: 'wohnen', erledigt: (d) => d.type === 'lease' },
  { key: 'kkPolicy', label: 'tresor.suggestKkPolicy', chapter: 'versicherungen', erledigt: (d) => d.chapter === 'versicherungen' },
];
export const FAST_LEER = 5;
export const offeneVorschlaege = (documents) =>
  documents.length >= FAST_LEER ? [] : VORSCHLAEGE.filter(v => !documents.some(v.erledigt));

const OrdnerIcon = ({ palette, fillLevel }) => {
  const h = Math.min(10, Math.max(0, fillLevel * 2));
  return React.createElement('svg', {
    viewBox: '0 0 28 24', style: { width: '32px', height: '28px', flexShrink: 0 }, fill: 'none', 'aria-hidden': 'true',
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

// Ruhiges Bild im leeren Zustand (wie das Mockup: Ordner mit Pfeil nach oben).
const LeerBild = ({ accent, sand }) => React.createElement('svg', {
  viewBox: '0 0 150 120', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round',
  'aria-hidden': 'true', style: { width: '150px', height: '120px', display: 'block', margin: '0 auto ' + space.md + 'px' },
},
  React.createElement('rect', { x: 22, y: 34, width: 106, height: 72, rx: 12, fill: accent + '24', stroke: accent, strokeWidth: 2 }),
  React.createElement('path', { d: 'M22 50h106', stroke: accent, strokeWidth: 2 }),
  React.createElement('path', { d: 'M58 34v-8a6 6 0 0 1 6-6h22a6 6 0 0 1 6 6v8', stroke: accent, strokeWidth: 2 }),
  React.createElement('path', { d: 'M75 64v22M66 73l9-9 9 9', stroke: sand, strokeWidth: 2.4 }),
);

export const DocumentTresor = ({
  palette,
  t,
  documents,
  chapters,
  onDownload,
  onDelete,
  onUpdateExpiry,
  onOpenChapter,
  initialTab,
  isDarkMode
}) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'all');
  // Ast-Farbe pro Kapitel — dieselbe Sprache wie der Lebensbaum.
  const bereichAccent = (chKey) => {
    const b = getBereichForChapter(chKey);
    return b ? (isDarkMode ? b.dark : b.light) : null;
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('expiry');
  const [fach, setFach] = useState('aktiv');
  const [editingDocId, setEditingDocId] = useState(null);
  const [editingExpiry, setEditingExpiry] = useState('');

  const chapterList = chapters || [];
  const hatInhalt = documents.length > 0;
  const stats = ablageZaehler(documents);
  const imAktuellenFach = documents.filter(d => imFach(d, fach));

  const filteredDocs = imAktuellenFach.filter(doc => {
    const matchTab = activeTab === 'all' || doc.chapter === activeTab;
    const q = searchTerm.toLowerCase();
    const matchSearch = !searchTerm ||
      (doc.fileName || '').toLowerCase().includes(q) ||
      (doc.type || '').toLowerCase().includes(q) ||
      typLabel(doc).toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (sortBy === 'expiry') return getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate);
    if (sortBy === 'date') return new Date(b.uploadDate) - new Date(a.uploadDate);
    if (sortBy === 'name') return a.fileName.localeCompare(b.fileName);
    return 0;
  });

  // Kapitel-Filter (bestehende Funktion, u. a. für den Brief→Ablage-Sprung): nur Kapitel mit
  // Dokumenten im aktuellen Fach, plus das gewählte — damit man sieht, wo man gelandet ist.
  const chapterCounts = {};
  imAktuellenFach.forEach(d => { chapterCounts[d.chapter] = (chapterCounts[d.chapter] || 0) + 1; });
  const chaptersWithDocs = chapterList.filter(c => chapterCounts[c.key] > 0 || c.key === activeTab);
  const zeigeKapitelFilter = chaptersWithDocs.length > 1 || activeTab !== 'all';

  function typLabel(doc) {
    const ch = chapterList.find(c => c.key === doc.chapter);
    const eintrag = ch?.docs?.find(d => d.k === doc.type);
    return eintrag?.label || doc.type || '';
  }

  const handleUpdateExpiry = (docId, newDate) => {
    if (newDate) onUpdateExpiry(docId, newDate);
    setEditingDocId(null);
  };

  const feld = {
    width: '100%', padding: '0 ' + space.sm + 'px', minHeight: '44px', borderRadius: radius.md,
    border: '1px solid ' + palette.border, background: palette.surface,
    color: palette.text, boxSizing: 'border-box', fontSize: text.sm, font: 'inherit',
  };

  const satz = documents.length === 0 ? t('tresor.ordnerEmpty')
    : documents.length < 5 ? t('tresor.ordnerStarting')
    : documents.length < 15 ? t('tresor.ordnerGrowing')
    : t('tresor.ordnerFull');

  const zeileKnopf = (label, icon, onClick) => React.createElement('button', {
    type: 'button', 'aria-label': label, title: label, onClick,
    style: {
      background: 'none', border: 0, color: palette.mid, width: '40px', height: '44px',
      borderRadius: radius.md, cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 0,
    },
  }, React.createElement(Icon, { name: icon, size: 18 }));

  const renderDocRow = (doc) => {
    const status = getExpiryStatus(doc.expiryDate, palette, t);
    const chapter = chapterList.find(c => c.key === doc.chapter);
    const accent = bereichAccent(doc.chapter);
    const isEditing = editingDocId === doc.id;
    const klein = { display: 'block', color: palette.mid, fontSize: text.xs, marginTop: '2px' };

    return React.createElement('li', {
      key: doc.id, 'data-dok': doc.id,
      style: {
        display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 0',
        borderBottom: '1px solid ' + palette.border, minHeight: '64px', listStyle: 'none',
      },
    },
      React.createElement('span', {
        title: chapter?.title, style: { color: accent || palette.mid, display: 'inline-flex', marginTop: '2px', flexShrink: 0 },
      }, React.createElement(Icon, { name: chapter?.key || 'document', size: 20 })),
      React.createElement('div', { style: { flex: 1, minWidth: 0, fontSize: text.sm, color: palette.text } },
        React.createElement('div', { style: { fontWeight: weight.medium, color: palette.text } }, typLabel(doc)),
        React.createElement('span', { style: { ...klein, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, doc.fileName),
        React.createElement('span', { style: klein }, t('tresor.uploadedInfo', { date: doc.uploadDate, size: doc.fileSize })),
        isEditing
          ? React.createElement('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' } },
              React.createElement('input', {
                type: 'date', value: editingExpiry,
                onChange: (e) => setEditingExpiry(e.target.value),
                'aria-label': t('chapterView.expiryDate'),
                style: { ...feld, width: 'auto' },
              }),
              React.createElement('button', {
                type: 'button', onClick: () => handleUpdateExpiry(doc.id, editingExpiry),
                style: { minHeight: '44px', padding: '0 14px', background: palette.sageBtn, color: '#fff', border: 'none', borderRadius: radius.md, cursor: 'pointer', fontSize: text.xs, fontWeight: weight.semi },
              }, 'OK'),
              React.createElement('button', {
                type: 'button', onClick: () => setEditingDocId(null),
                style: { minHeight: '44px', padding: '0 14px', background: 'none', color: palette.text, border: '1px solid ' + palette.border, borderRadius: radius.md, cursor: 'pointer', fontSize: text.xs },
              }, t('common.cancel')),
            )
          : React.createElement('span', {
              style: { ...klein, color: status.color, fontWeight: weight.medium },
            }, status.label + ' · ' + t('tresor.expiryDate', { date: ablaufAnzeige(doc.expiryDate) })),
      ),
      React.createElement('div', { style: { display: 'flex', flexShrink: 0, marginRight: '-10px' } },
        zeileKnopf(t('common.download'), 'download', () => onDownload(doc)),
        zeileKnopf(t('common.edit'), 'edit', () => { setEditingDocId(doc.id); setEditingExpiry(doc.expiryDate); }),
        zeileKnopf(t('common.delete'), 'kreuz', () => onDelete(doc.id)),
      ),
    );
  };

  // «Was oft zuerst hineingehört» — im leeren und fast leeren Zustand.
  const vorschlaege = offeneVorschlaege(documents);
  const vorschlagBlock = vorschlaege.length > 0 && React.createElement('section', {
    'aria-labelledby': 'tresor-vorschlaege', style: { marginTop: space.lg + 'px' },
  },
    React.createElement('h3', {
      id: 'tresor-vorschlaege',
      style: { fontSize: text.xs, fontWeight: weight.normal, color: palette.mid, margin: '0 0 ' + space.sm + 'px' },
    }, t('tresor.suggestTitle')),
    React.createElement('ul', { style: { display: 'grid', gap: space.sm + 'px', margin: 0, padding: 0, listStyle: 'none' } },
      vorschlaege.map(v => {
        const ch = chapterList.find(c => c.key === v.chapter);
        const accent = bereichAccent(v.chapter);
        const inhalt = [
          React.createElement('span', { key: 'i', style: { color: accent || palette.mid, display: 'inline-flex', flexShrink: 0 } },
            React.createElement(Icon, { name: v.chapter, size: 20 })),
          React.createElement('span', { key: 't', style: { flex: 1, minWidth: 0, color: palette.text } },
            t(v.label),
            React.createElement('span', { style: { display: 'block', color: palette.mid, fontSize: text.xs } },
              t('tresor.suggestChapter', { chapter: ch?.title || v.chapter }))),
          onOpenChapter && React.createElement('span', { key: 'p', 'aria-hidden': 'true', style: { marginLeft: 'auto', color: palette.sandDeep || palette.mid, fontSize: '20px' } }, '+'),
        ];
        const flaeche = {
          display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 14px', width: '100%',
          borderRadius: radius.lg, border: '1px solid ' + palette.border, background: palette.surface,
          color: palette.text, textAlign: 'left', minHeight: '60px', boxSizing: 'border-box', font: 'inherit', fontSize: text.sm,
        };
        return React.createElement('li', { key: v.key },
          onOpenChapter
            ? React.createElement('button', { type: 'button', 'data-vorschlag': v.key, onClick: () => onOpenChapter(v.chapter), style: { ...flaeche, cursor: 'pointer' } }, ...inhalt)
            : React.createElement('div', { style: flaeche }, ...inhalt),
        );
      }),
    ),
  );

  const fachKnopf = (key, zahl, label) => React.createElement('button', {
    key, type: 'button', role: 'tab', 'aria-selected': fach === key, 'data-fach': key,
    onClick: () => setFach(key),
    style: {
      flex: 1, border: 0, background: 'none', minHeight: '44px', font: 'inherit', fontSize: text.sm,
      cursor: 'pointer', color: fach === key ? palette.text : palette.mid,
      fontWeight: fach === key ? weight.medium : weight.normal,
      borderBottom: '2px solid ' + (fach === key ? (bereichAccent('basis') || palette.sand) : 'transparent'),
      marginBottom: '-1px',
    },
  }, zahl + ' ' + label);

  const leerImFach = (searchTerm || activeTab !== 'all') ? t('common.noResults')
    : fach === 'archiv' ? t('tresor.archiveEmpty')
    : fach === 'bald' ? t('tresor.expiringEmpty')
    : t('tresor.activeEmpty');

  return React.createElement('div', {
    style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border, boxShadow: shadow.sm }
  },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: ansichtIkon('tresor'), size: 22 }), style: { marginBottom: space.xs + 'px' } }, t('tresor.title')),
    React.createElement('p', { style: { color: palette.mid, fontSize: text.sm, margin: '0 0 ' + space.lg + 'px' } }, satz),

    !hatInhalt
      // Leer: ruhiges Bild, Titel und Satz der App.
      ? React.createElement('div', { style: { textAlign: 'center', padding: '8px 8px 0' } },
          React.createElement(LeerBild, { accent: bereichAccent('basis') || palette.sage, sand: palette.sand }),
          React.createElement('h3', { style: { fontSize: text.xl, fontWeight: weight.semi, color: palette.text, margin: '0 0 6px' } }, t('tresor.noDocuments')),
          React.createElement('p', { style: { color: palette.mid, fontSize: text.sm, margin: '0 auto', maxWidth: '34ch' } }, t('tresor.noDocumentsHint')),
        )
      : React.createElement(React.Fragment, null,
          // Übersichtszeile
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: text.xs, color: palette.mid, margin: '0 0 ' + space.sm + 'px' } },
            React.createElement(OrdnerIcon, { palette, fillLevel: documents.length }),
            React.createElement('span', { style: { color: palette.text, fontWeight: weight.medium } }, t('tresor.docCount', { count: documents.length })),
          ),
          // Drei Zähler
          React.createElement('div', {
            role: 'tablist', 'aria-label': t('tresor.active') + ' · ' + t('tresor.expiringSoon') + ' · ' + t('tresor.archive'),
            style: { display: 'flex', gap: '4px', borderBottom: '1px solid ' + palette.border, marginBottom: space.md + 'px' },
          },
            fachKnopf('aktiv', stats.active, t('tresor.active')),
            fachKnopf('bald', stats.expiring, t('tresor.expiringSoon')),
            fachKnopf('archiv', stats.archived, t('tresor.archive')),
          ),
          // Kapitel-Filter (leise, nur wenn er etwas zu wählen hat)
          zeigeKapitelFilter && React.createElement('div', {
            style: { display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: space.sm + 'px' },
          },
            [{ key: 'all', title: t('tresor.allChapters'), n: imAktuellenFach.length }, ...chaptersWithDocs.map(c => ({ key: c.key, title: c.title, n: chapterCounts[c.key] || 0 }))].map(c => {
              const aktiv = activeTab === c.key;
              const accent = c.key === 'all' ? null : bereichAccent(c.key);
              return React.createElement('button', {
                key: c.key, type: 'button', 'aria-pressed': aktiv, 'aria-label': c.title + ' (' + c.n + ')',
                onClick: () => setActiveTab(c.key),
                style: {
                  display: 'inline-flex', alignItems: 'center', gap: '5px', minHeight: '36px', padding: '0 12px',
                  borderRadius: radius.full, border: '1px solid ' + (aktiv ? palette.text : palette.border),
                  background: aktiv ? palette.up : 'none', color: aktiv ? palette.text : palette.mid,
                  cursor: 'pointer', fontSize: text.xs, whiteSpace: 'nowrap', font: 'inherit',
                },
              },
                c.key === 'all'
                  ? c.title
                  : React.createElement('span', { style: { color: accent || palette.mid, display: 'inline-flex' } }, React.createElement(Icon, { name: c.key, size: 14 })),
                React.createElement('span', null, c.key === 'all' ? ' (' + c.n + ')' : c.n),
              );
            }),
          ),
          // Suche und Sortierung
          React.createElement('input', {
            type: 'search', placeholder: t('common.search'), value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value), 'aria-label': t('common.search'),
            style: { ...feld, padding: '0 14px', marginBottom: space.sm + 'px' },
          }),
          React.createElement('label', {
            style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', fontSize: text.xs, color: palette.mid, marginBottom: space.sm + 'px' },
          },
            React.createElement('span', null, t('tresor.sortBy')),
            React.createElement('select', {
              value: sortBy, onChange: (e) => setSortBy(e.target.value),
              style: { ...feld, width: 'auto', minWidth: '140px' },
            },
              React.createElement('option', { value: 'expiry' }, t('tresor.sortByExpiry')),
              React.createElement('option', { value: 'date' }, t('tresor.sortByUpload')),
              React.createElement('option', { value: 'name' }, t('tresor.sortByName')),
            ),
          ),
          // Liste
          sortedDocs.length === 0
            ? React.createElement('p', { role: 'status', style: { color: palette.mid, fontSize: text.sm, padding: '14px 0', margin: 0 } }, leerImFach)
            : React.createElement('ul', { style: { margin: 0, padding: 0 } }, sortedDocs.map(renderDocRow)),
        ),

    vorschlagBlock,

    // Nur auf diesem Gerät
    React.createElement('div', {
      style: { display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', fontSize: text.xs, color: palette.mid, marginTop: '22px', paddingTop: space.md + 'px', borderTop: '1px solid ' + palette.border },
    }, hinweisZeichen(), t('trust.localOnly')),
  );
};

export default DocumentTresor;
