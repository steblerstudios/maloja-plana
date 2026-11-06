import React from 'react';
import Icons, { aufklappZeichen } from '../IconKern.jsx';
import { text, weight, radius, space, ease, duration } from '../config/tokens.js';
import { ABLAEUFE, ANKOMMEN, MIT18, ansichtIkon } from '../config/ansichtenRegister.js';

// Werkzeuggruppen der Übersicht (aufklappbare <details>), aus Dashboard.jsx ausgelagert am 06.11.2026
// (Seitenlandkarte G2): die Übersicht liegt im Startbündel (Grenze 65 kB), die Gruppen stehen zugeklappt
// weiter unten — sie laden nach, ohne dass man es sieht. Inhalt und Verhalten unverändert übernommen.
export const WerkzeugGruppen = ({ palette, t, simpleView, onNavigate, onSelectChapter, chapters }) => {
  const renderTool = (tool) => {
    // Zeichen aus dem Register, wo die Ansicht dort steht (Seitenrundgang 27.09.2026:
    // Offizielle Links und Flyer trugen hier noch das Tresor-Zeichen); sonst das eigene.
    const IconFn = Icons[tool.view ? ansichtIkon(tool.view, tool.icon) : tool.icon];
    const iconPx = simpleView ? '40px' : '20px';
    return React.createElement('button', {
      key: tool.key || tool.view,
      onClick: tool.action || (() => onNavigate(tool.view)),
      style: {
        padding: simpleView ? '18px 12px' : '14px 16px',
        background: 'transparent', color: palette.text,
        border: simpleView ? '1px solid ' + palette.border : 'none',
        borderRadius: radius.md, cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', flexDirection: simpleView ? 'column' : 'row',
        alignItems: 'center', justifyContent: simpleView ? 'flex-start' : undefined,
        gap: simpleView ? '10px' : space.sm,
        transition: `background ${duration.normal}ms ${ease}`,
        textAlign: simpleView ? 'center' : 'left',
      },
      onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; },
      onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; },
    },
      React.createElement('div', { style: { color: simpleView ? palette.sand : palette.mid, width: iconPx, height: iconPx, flexShrink: 0 } },
        IconFn ? React.createElement('div', { style: { width: iconPx, height: iconPx } }, IconFn()) : null
      ),
      React.createElement('div', null,
        React.createElement('div', { style: { fontWeight: simpleView ? weight.semi : weight.medium, fontSize: simpleView ? text.body : text.sm } }, tool.label),
        (tool.sub && !simpleView) ? React.createElement('div', { style: { fontSize: text.xs - 1, color: palette.mid, marginTop: '1px' } }, tool.sub) : null
      )
    );
  };
  const alsEintrag = (a) => ({ label: t(a.nav), sub: t(a.sub), view: a.view, icon: a.icon });
  const groups = [
    // Aus dem gemeinsamen Register — dieselbe Liste speist die Suche.
    { label: t('dashboard.toolGroups.lebensereignisse'), items: ABLAEUFE.map(alsEintrag) },
    // G1 (05.11.2026): die Abläufe nach dem Zuzug als Reihe; sie bleiben auch oben stehen.
    { label: t('dashboard.toolGroups.ankommen'), items: ANKOMMEN.map((v) => ABLAEUFE.find((a) => a.view === v)).filter(Boolean).map(alsEintrag) },
    // G2 (06.11.2026): der Weg ins Erwachsenenleben als Reihe; die Abläufe bleiben auch oben stehen.
    { label: t('dashboard.toolGroups.mit18'), items: MIT18.map((v) => ABLAEUFE.find((a) => a.view === v)).filter(Boolean).map(alsEintrag) },
    { label: t('dashboard.toolGroups.gesundheit'), items: [
      { label: t('nav.arztkoffer'), sub: t('nav.sub.arztkoffer'), view: 'gesundheit', icon: 'health' },
    ] },
    // «Asyl & Migration» stand hier ein zweites Mal — dasselbe Ziel wie in
    // «Lebensereignisse». Dort bleibt es: «Bewilligung & Fristen» ist der
    // richtige Nachbar. (Bis 25.09.2026 stand die Gruppe offen; jetzt zu.)
    { label: t('dashboard.toolGroups.support'), items: [
      { label: t('dashboard.anspruchTitle'), sub: t('lebenszustaende.pageSub'), view: 'situationen', icon: 'geschenk' },
    ] },
    { label: t('dashboard.toolGroups.money'), items: [
      { label: t('nav.taxes'), sub: t('nav.sub.taxes'), view: 'tax', icon: 'money' },
      { label: t('budgetSync.title'), sub: t('nav.sub.budgetSync'), view: 'sync', icon: 'budgetWallet' },
      { label: t('nav.mietzins'), sub: t('nav.sub.mietzins'), view: 'mietzins', icon: 'home' },
      { label: t('nav.vorsorge'), sub: t('nav.sub.vorsorge'), view: 'vorsorge', icon: 'vorsorge' },
      { label: t('nav.mindestlohn'), sub: t('nav.sub.mindestlohn'), key: 'mindestlohn', action: () => onSelectChapter(chapters.findIndex(ch => ch.key === 'finanzen')), icon: 'money' },
    ] },
    { label: t('dashboard.toolGroups.insurance'), items: [
      { label: t('nav.kvgIpv'), sub: t('nav.sub.kvgIpv'), view: 'premium', icon: 'praemienverbilligung' },
      { label: t('nav.praemien'), sub: t('nav.sub.praemien'), view: 'praemien', icon: 'insurance' },
      { label: t('nav.kvgLeistungen'), sub: t('nav.sub.kvgLeistungen'), view: 'kvg', icon: 'health' },
    ] },
    { label: t('dashboard.toolGroups.documents'), items: [
      { label: t('nav.tresor'), sub: t('nav.sub.tresor'), view: 'tresor', icon: 'ordner' },
      { label: t('nav.direktlinks'), sub: t('nav.sub.direktlinks'), view: 'direktlinks', icon: 'dokumentTresor' },
      { label: t('nav.flyer'), sub: t('nav.sub.flyer'), view: 'flyer', icon: 'dokumentTresor' },
    ] },
    { label: t('dashboard.toolGroups.organize'), items: [
      { label: t('nav.search'), sub: t('nav.sub.search'), view: 'search', icon: 'search' },
      { label: t('nav.merkliste'), sub: t('nav.sub.merkliste'), view: 'merkliste', icon: 'check' },
      { label: t('nav.wasAnsteht'), sub: t('nav.sub.calendar'), view: 'calendar', icon: 'calendar' },
      { label: t('nav.cv'), sub: t('nav.sub.cv'), view: 'cv', icon: 'lebenslauf' },
    ] },
  ];
  // Welche Gruppe offen war, gilt für die Sitzung (sessionStorage): wer aus
  // «Lebensereignisse» in einen Ablauf ging und «Übersicht» antippt, soll die
  // Gruppe offen wiederfinden, nicht zugeklappt (Seitenrundgang 27.09.2026).
  // Nur eine Ansichts-Bequemlichkeit — fehlt der Speicher, starten alle zu.
  const GRUPPEN_KEY = 'mp_offene_werkzeuggruppen';
  let offen = [];
  try { offen = JSON.parse(sessionStorage.getItem(GRUPPEN_KEY) || '[]'); } catch { offen = []; }
  // Seit 05.11.2026 nach Titel (g.label), nicht nach Stelle: mit einer neuen Gruppe hätte die gemerkte
  // Stelle sonst eine andere Gruppe geöffnet. Ältere Einträge (Zahlen) und ein Sprachwechsel treffen nichts — dann starten alle zu.
  const merkeGruppe = (name, istOffen) => {
    try {
      const rest = offen.filter((i) => i !== name);
      offen = istOffen ? rest.concat(name) : rest;
      sessionStorage.setItem(GRUPPEN_KEY, JSON.stringify(offen));
    } catch { /* ohne Speicher: nichts merken */ }
  };
  return React.createElement(React.Fragment, null,
    ...groups.map((g) => React.createElement('details', {
      // Alle Gruppen starten zu (Tester-Feedback 25.09.2026: «Lebensereignisse
      // eingeklappt»). Vorher stand die erste Gruppe offen, mit 34 Einträgen.
      key: 'tg-' + g.label,
      open: Array.isArray(offen) && offen.includes(g.label),
      onToggle: (e) => merkeGruppe(g.label, e.currentTarget.open),
      style: { borderTop: '1px solid ' + palette.border + '66' },
    },
      React.createElement('summary', {
        style: { cursor: 'pointer', padding: space.sm + 'px 2px', minHeight: '44px', boxSizing: 'border-box', fontSize: text.sm, fontWeight: weight.medium, color: palette.text, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
      },
        React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px' } },
          React.createElement('span', { style: { fontSize: '10px', color: palette.soft } }, aufklappZeichen(false)),
          g.label
        ),
        React.createElement('span', { style: { fontSize: text.xs, color: palette.soft } }, g.items.length)
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', padding: space.xs + 'px 0 ' + space.md + 'px 0' } },
        g.items.map(renderTool)
      )
    ))
  );
};

export default WerkzeugGruppen;
