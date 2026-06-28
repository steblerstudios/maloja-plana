import React, { useState } from 'react';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius } from './config/tokens.js';

// In-App-Suche: findet Werkzeuge & Kapitel und springt direkt hin.
// Matcht gegen die bereits übersetzten nav-Labels (kein Extra-i18n pro Eintrag)
// + ein paar sprachneutrale Abkürzungs-Aliase, damit z.B. „ipv"/„ahv" greifen.
export const SEARCH_VIEWS = [
  { view: 'merkliste', nav: 'nav.merkliste', sub: 'nav.sub.merkliste', icon: 'check', aliases: ['todo', 'merkliste'] },
  { view: 'calendar', nav: 'nav.calendar', sub: 'nav.sub.calendar', icon: 'calendar', aliases: ['ical', 'ics', 'termine'] },
  { view: 'premium', nav: 'nav.kvgIpv', sub: 'nav.sub.kvgIpv', icon: 'praemienverbilligung', aliases: ['ipv', 'pv'] },
  { view: 'praemien', nav: 'nav.praemien', sub: 'nav.sub.praemien', icon: 'insurance', aliases: ['praemien', 'kvg'] },
  { view: 'kvg', nav: 'nav.kvgLeistungen', sub: 'nav.sub.kvgLeistungen', icon: 'health', aliases: ['kvg', 'leistungen'] },
  { view: 'vorsorge', nav: 'nav.vorsorge', sub: 'nav.sub.vorsorge', icon: 'vorsorge', aliases: ['ahv', 'bvg', 'pension', '3a', 'avs'] },
  { view: 'eo', nav: 'nav.eo', sub: 'nav.sub.eo', icon: 'family', aliases: ['eo', 'mutterschaft', 'vaterschaft'] },
  { view: 'stipendien', nav: 'nav.stipendien', sub: 'nav.sub.stipendien', icon: 'ausbildung', aliases: ['stipendien', 'scholarship'] },
  { view: 'tax', nav: 'nav.taxes', sub: 'nav.sub.taxes', icon: 'money', aliases: ['steuer', 'tax', 'impot'] },
  { view: 'sozialhilfe', nav: 'nav.sozialhilfe', sub: 'nav.sub.sozialhilfe', icon: 'health', aliases: ['skos', 'sozialhilfe', 'aide sociale'] },
  { view: 'alv', nav: 'nav.alv', sub: 'nav.sub.alv', icon: 'family', aliases: ['alv', 'arbeitslos', 'rav'] },
  { view: 'asyl', nav: 'nav.asyl', sub: 'nav.sub.asyl', icon: 'behoerden', aliases: ['asyl', 'asylum', 'flucht', 'migration'] },
  { view: 'direktlinks', nav: 'nav.direktlinks', sub: 'nav.sub.direktlinks', icon: 'dokumentTresor', aliases: ['links', 'behoerden', 'amt'] },
  { view: 'tresor', nav: 'nav.tresor', sub: 'nav.sub.tresor', icon: 'dokumentTresor', aliases: ['dokumente', 'documents', 'tresor'] },
  { view: 'cv', nav: 'nav.cv', sub: 'nav.sub.cv', icon: 'lebenslauf', aliases: ['cv', 'lebenslauf', 'resume'] },
  { view: 'unterlagen', nav: 'nav.unterlagen', sub: 'nav.sub.unterlagen', icon: 'documents', aliases: ['unterlagen', 'documents'] },
  { view: 'flyer', nav: 'nav.flyer', sub: 'nav.sub.flyer', icon: 'dokumentTresor', aliases: ['qr', 'teilen', 'share', 'flyer'] },
  // Bisher nicht auffindbar, obwohl über Dashboard/Menü erreichbar (Audit #17).
  // `sub` ist optional — nicht jedes Werkzeug hat einen Beschreibungs-Key.
  { view: 'finanzuebersicht', nav: 'nav.finanzUebersicht', icon: 'budget', aliases: ['finanzübersicht', 'übersicht', 'finanzen', 'overview'] },
  { view: 'sync', nav: 'nav.budgetSync', sub: 'nav.sub.budgetSync', icon: 'budgetWallet', aliases: ['budget', 'sync', 'ausgaben'] },
  { view: 'taxImport', nav: 'nav.taxImport', sub: 'nav.sub.taxImport', icon: 'document', aliases: ['steuerimport', 'import', 'steuererklärung'] },
  { view: 'kk', nav: 'nav.kkScanner', icon: 'barcode', aliases: ['kk', 'krankenkasse', 'scanner', 'qr', 'prämie'] },
  { view: 'budget', nav: 'nav.budget', icon: 'csv', aliases: ['budget', 'haushalt', 'ausgaben'] },
  { view: 'schulden', nav: 'nav.debts', icon: 'debt', aliases: ['schulden', 'betreibung', 'debt', 'abzahlung'] },
  { view: 'organ', nav: 'nav.organDonation', icon: 'health', aliases: ['organspende', 'spende', 'organ', 'donation'] },
  { view: 'charts', nav: 'nav.charts', icon: 'chartsSchoko', aliases: ['charts', 'diagramme', 'statistik', 'grafik'] },
  { view: 'export', nav: 'nav.export', icon: 'download', aliases: ['export', 'sicherung', 'backup', 'datensicherung'] },
  { view: 'notifications', nav: 'nav.notifications', icon: 'cowbell', aliases: ['benachrichtigungen', 'erinnerungen', 'notifications'] },
];

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
      ),
      React.createElement('span', { 'aria-hidden': 'true', style: { color: palette.mid } }, '→')
    );

  const nothing = q && toolResults.length === 0 && chapterResults.length === 0;

  return React.createElement('div', { style: s.card },
    React.createElement('h2', { style: s.title },
      React.createElement(Icon, { name: 'search', size: 20 }),
      t('search.title')
    ),
    React.createElement('input', {
      style: s.input, type: 'search', value: query, autoFocus: true,
      onChange: e => setQuery(e.target.value),
      placeholder: t('search.placeholder'),
      'aria-label': t('search.placeholder'),
    }),

    nothing && React.createElement('div', { style: s.empty }, t('search.empty', { query })),

    toolResults.length > 0 && React.createElement('div', null,
      React.createElement('div', { style: s.sectionTitle }, t('search.toolsTitle')),
      toolResults.map(v => resultRow(v.view, v.icon, t(v.nav), v.sub ? t(v.sub) : null, () => onNavigate && onNavigate(v.view)))
    ),

    chapterResults.length > 0 && React.createElement('div', null,
      React.createElement('div', { style: s.sectionTitle }, t('search.chaptersTitle')),
      chapterResults.map(({ ch, idx }) => resultRow('ch-' + ch.key, ch.icon || 'document', ch.title, null, () => onNavigate && onNavigate('chapter', idx)))
    )
  );
};

export default SearchView;
