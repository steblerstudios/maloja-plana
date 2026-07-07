import React, { useState, useEffect } from 'react';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius } from './config/tokens.js';
import { EmptyState } from './components/EmptyState.jsx';

// Persönliche Merkliste: „Erkenntnis → Handlung". Eine Notiz erfassen und
// optional direkt mit dem passenden Rechner/Kapitel verknüpfen (Deeplink).
// Bewusst OHNE Frist (das ist der Kalender). Local-first: localStorage.
const STORAGE_KEY = 'or5_merkliste';

// Kuratierte Verknüpfungsziele (view-key → i18n nav-Label).
export const LINK_TARGETS = [
  { view: 'premium', label: 'nav.kvgIpv' },
  { view: 'praemien', label: 'nav.praemien' },
  { view: 'tax', label: 'nav.taxes' },
  { view: 'sozialhilfe', label: 'nav.sozialhilfe' },
  { view: 'vorsorge', label: 'nav.vorsorge' },
  { view: 'alv', label: 'nav.alv' },
  { view: 'stipendien', label: 'nav.stipendien' },
  { view: 'asyl', label: 'nav.asyl' },
  { view: 'tresor', label: 'nav.tresor' },
  { view: 'calendar', label: 'nav.calendar' },
  { view: 'direktlinks', label: 'nav.direktlinks' },
];

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
};

export const MerklisteView = ({ palette, t, onNavigate }) => {
  const [items, setItems] = useState(load);
  const [newText, setNewText] = useState('');
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (e) { /* Speicher voll */ }
  }, [items]);

  const add = () => {
    const text = newText.trim();
    if (!text) return;
    setItems(prev => [...prev, { id: 'm' + Date.now(), text, link: newLink || null, done: false }]);
    setNewText('');
    setNewLink('');
  };

  const toggle = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const labelFor = (view) => {
    const tgt = LINK_TARGETS.find(x => x.view === view);
    return tgt ? t(tgt.label) : view;
  };

  const open = items.filter(i => !i.done);
  const done = items.filter(i => i.done);

  const s = {
    card: { maxWidth: '680px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    title: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    intro: { fontSize: text.sm, color: palette.mid, lineHeight: 1.6, marginBottom: space.lg + 'px', maxWidth: '520px' },
    addRow: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px', alignItems: 'center', marginBottom: space.lg + 'px' },
    input: { flex: '1 1 200px', minWidth: '160px', padding: space.sm + 'px ' + space.md + 'px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.up, color: palette.text, fontFamily: 'inherit' },
    select: { padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.up, color: palette.text, fontFamily: 'inherit', cursor: 'pointer' },
    addBtn: { background: palette.sage, color: '#fff', border: 'none', borderRadius: radius.sm + 'px', padding: space.sm + 'px ' + space.lg + 'px', fontSize: text.sm, fontWeight: weight.semi, cursor: 'pointer', fontFamily: 'inherit' },
    sectionTitle: { fontSize: text.xs, fontWeight: weight.semi, color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px', margin: space.md + 'px 0 ' + space.sm + 'px' },
    row: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', padding: space.sm + 'px 0', borderBottom: '1px solid ' + palette.border + '66' },
    cb: { flexShrink: 0, width: '20px', height: '20px', cursor: 'pointer', accentColor: palette.sage },
    txt: (d) => ({ flex: 1, fontSize: text.sm, color: d ? palette.mid : palette.text, textDecoration: d ? 'line-through' : 'none', lineHeight: 1.4 }),
    openLink: { background: palette.sageMist || palette.up, color: palette.sageDeep || palette.mid, border: 'none', borderRadius: radius.sm + 'px', padding: '4px 10px', fontSize: text.xs, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' },
    del: { background: 'none', border: 'none', color: palette.mid, cursor: 'pointer', fontSize: text.sm, padding: '4px' },
    empty: { fontSize: text.sm, color: palette.mid, fontStyle: 'italic', padding: space.md + 'px 0' },
  };

  const renderItem = (i) => React.createElement('div', { key: i.id, style: s.row },
    React.createElement('input', { type: 'checkbox', checked: i.done, onChange: () => toggle(i.id), style: s.cb, 'aria-label': i.done ? t('merkliste.undo') : t('merkliste.markDone') }),
    React.createElement('span', { style: s.txt(i.done) }, i.text),
    i.link && onNavigate && React.createElement('button', { style: s.openLink, onClick: () => onNavigate(i.link) }, '→ ' + labelFor(i.link)),
    React.createElement('button', { style: s.del, 'aria-label': t('common.delete'), onClick: () => remove(i.id) }, '✕')
  );

  return React.createElement('div', { style: s.card },
    React.createElement('h2', { style: s.title },
      React.createElement(Icon, { name: 'check', size: 20 }),
      t('merkliste.title')
    ),
    React.createElement('p', { style: s.intro }, t('merkliste.intro')),

    React.createElement('div', { style: s.addRow },
      React.createElement('input', {
        style: s.input, type: 'text', value: newText,
        onChange: e => setNewText(e.target.value),
        onKeyDown: e => { if (e.key === 'Enter') add(); },
        placeholder: t('merkliste.placeholder'),
        'aria-label': t('merkliste.placeholder'),
      }),
      React.createElement('select', { style: s.select, value: newLink, onChange: e => setNewLink(e.target.value), 'aria-label': t('merkliste.linkLabel') },
        React.createElement('option', { value: '' }, t('merkliste.linkNone')),
        LINK_TARGETS.map(tgt => React.createElement('option', { key: tgt.view, value: tgt.view }, t(tgt.label)))
      ),
      React.createElement('button', { style: s.addBtn, onClick: add }, t('merkliste.add'))
    ),

    open.length === 0 && done.length === 0 && React.createElement(EmptyState, {
      palette,
      icon: React.createElement(Icon, { name: 'edit', size: 26, color: palette.mid }),
      title: t('merkliste.emptyTitle'),
      description: t('merkliste.empty'),
    }),

    open.length > 0 && React.createElement('div', null,
      React.createElement('div', { style: s.sectionTitle }, t('merkliste.openTitle')),
      open.map(renderItem)
    ),

    done.length > 0 && React.createElement('div', null,
      React.createElement('div', { style: s.sectionTitle }, t('merkliste.doneTitle')),
      done.map(renderItem)
    )
  );
};

export default MerklisteView;
