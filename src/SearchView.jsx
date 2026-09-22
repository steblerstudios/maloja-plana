import React, { useState } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius } from './config/tokens.js';
import { EmptyState } from './components/EmptyState.jsx';
import { SEARCH_VIEWS } from './config/ansichtenRegister.js';

// In-App-Suche: findet Werkzeuge & Kapitel und springt direkt hin.
// Matcht gegen die bereits übersetzten nav-Labels (kein Extra-i18n pro Eintrag)
// + ein paar sprachneutrale Abkürzungs-Aliase, damit z.B. „ipv"/„ahv" greifen.
// SEARCH_VIEWS liegt seit 21.09.2026 im gemeinsamen Register.
export { SEARCH_VIEWS } from './config/ansichtenRegister.js';

export const SearchView = ({ palette, t, chapters = [], onNavigate }) => {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const hit = (parts) => !q || parts.some(p => (p || '').toLowerCase().includes(q));

  const toolResults = SEARCH_VIEWS.filter(v => hit([t(v.nav), v.sub ? t(v.sub) : '', v.view, ...(v.aliases || [])]));
  const chapterResults = chapters
    .map((ch, idx) => ({ ch, idx }))
    .filter(({ ch }) => hit([ch.title, ch.key]));

  const s = {
    card: { maxWidth: '680px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    title: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
    input: { width: '100%', padding: space.sm + 'px ' + space.md + 'px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.up, color: palette.text, fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: space.md + 'px' },
    sectionTitle: { fontSize: text.xs, fontWeight: weight.semi, color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px', margin: space.md + 'px 0 ' + space.xs + 'px' },
    row: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', width: '100%', textAlign: 'start', background: 'none', border: 'none', borderBottom: '1px solid ' + palette.border + '66', padding: space.sm + 'px 0', cursor: 'pointer', fontFamily: 'inherit', color: palette.text },
    rowMain: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text },
    rowSub: { fontSize: text.xs, color: palette.mid, marginTop: '1px' },
    empty: { fontSize: text.sm, color: palette.mid, fontStyle: 'italic', padding: space.md + 'px 0' },
  };

  const resultRow = (key, icon, main, sub, onClick) =>
    React.createElement('button', { key, style: s.row, onClick },
      React.createElement(Icon, { name: icon, size: 18 }),
      React.createElement('span', { style: { flex: 1 } },
        React.createElement('span', { style: s.rowMain }, main),
        sub && React.createElement('div', { style: s.rowSub }, sub)
      )
    );

  const nothing = q && toolResults.length === 0 && chapterResults.length === 0;

  return React.createElement('div', { style: s.card },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'search', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('search.title')),
    React.createElement('input', {
      style: s.input, type: 'search', value: query, autoFocus: true,
      onChange: e => setQuery(e.target.value),
      placeholder: t('search.placeholder'),
      'aria-label': t('search.placeholder'),
    }),

    nothing && React.createElement(EmptyState, {
      palette,
      icon: React.createElement(Icon, { name: 'search', size: 26, color: palette.mid }),
      title: t('search.emptyTitle'),
      description: t('search.empty', { query }),
    }),

    toolResults.length > 0 && React.createElement('div', null,
      React.createElement('div', { style: s.sectionTitle }, t('search.toolsTitle')),
      toolResults.map(v => resultRow(v.view, v.icon, t(v.nav), v.sub ? t(v.sub) : null, () => onNavigate && onNavigate(v.view)))
    ),

    chapterResults.length > 0 && React.createElement('div', null,
      React.createElement('div', { style: s.sectionTitle }, t('search.chaptersTitle')),
      chapterResults.map(({ ch, idx }) => resultRow('ch-' + ch.key, ch.key, ch.title, null, () => onNavigate && onNavigate('chapter', idx)))
    )
  );
};

export default SearchView;
