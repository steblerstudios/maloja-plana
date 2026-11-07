import React from 'react';
import Icons, { aufklappZeichen } from '../IconKern.jsx';
import { text, weight, radius, space, ease, duration } from '../config/tokens.js';
import { ABLAEUFE, ANKOMMEN, MIT18, SEARCH_VIEWS, ansichtIkon } from '../config/ansichtenRegister.js';
import { WERKZEUGE } from '../data/werkzeugRegister.js';
import { LEBENSBEREICHE, astKapitel } from '../data/lebensbereiche.js';
import { CHAPTER_KEYS } from '../config/constants.js';

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
  const alsEintrag = (a) => ({ label: t(a.nav), sub: a.sub ? t(a.sub) : null, view: a.view, icon: a.icon });
  // Seiten-Architektur (Stebler Studios 06.11.2026, docs/design/seiten-architektur-2026-11.md, Frage 4 «A, Kapitel
  // führen»): alle Seiten nach den 7 Kapiteln, in der Reihenfolge der Berge — statt der Themen-Gruppen «Geld &
  // Steuern», «Versicherung & Gesundheit», «Dokumente & Behörden», «Organisieren & Profil» und der Ast-Liste
  // «Lebensereignisse». Ein Kapitel mit zwei Ästen gliedert nach Ast (Zwischentitel dashboard.bereich.*).
  // Quelle ist allein das Register: Feld `bereich` bei Werkzeugen, Abläufen und den übrigen Seiten der Suche.
  // Reihenfolge je Ast: Werkzeuge, dann die übrigen Seiten, dann die Abläufe (Wächter: startseiteNachKapitel.test.js).
  const werkzeugEintrag = (w) => (w.view === 'chapter'
    ? { key: w.key, label: t(w.nav), sub: w.sub ? t(w.sub) : null, icon: w.icon,
      action: () => onSelectChapter((chapters || []).findIndex((ch) => ch.key === w.kapitel)) }
    : { label: t(w.nav), sub: w.sub ? t(w.sub) : null, view: w.view, icon: w.icon });
  const seitenDesAstes = (ast) => [
    ...WERKZEUGE.filter((w) => w.bereich === ast).map(werkzeugEintrag),
    ...SEARCH_VIEWS.filter((v) => v.bereich === ast && !ABLAEUFE.includes(v) && !WERKZEUGE.some((w) => w.view === v.view)).map(alsEintrag),
    ...ABLAEUFE.filter((a) => a.bereich === ast).map(alsEintrag),
  ];
  const kapitelName = (key) => {
    const ch = (chapters || []).find((c) => c.key === key);
    return (ch && ch.title) || t('chapters.' + key + '.title');
  };
  const kapitelGruppen = CHAPTER_KEYS.map((key) => {
    const aeste = LEBENSBEREICHE.filter((b) => astKapitel(b.key) === key).map((b) => b.key);
    const teile = aeste.map((ast) => ({ key: ast, titel: t('dashboard.bereich.' + ast), items: seitenDesAstes(ast) })).filter((teil) => teil.items.length);
    return { label: kapitelName(key), items: teile.flatMap((teil) => teil.items), teile: teile.length > 1 ? teile : null };
  });
  const groups = [
    ...kapitelGruppen,
    // Zwei Türen quer über die Kapitel: G1 (05.11.2026) Ankommen, G2 (06.11.2026) Mit 18. Die Abläufe stehen
    // zugleich in ihrem Kapitel.
    { label: t('dashboard.toolGroups.ankommen'), items: ANKOMMEN.map((v) => ABLAEUFE.find((a) => a.view === v)).filter(Boolean).map(alsEintrag) },
    { label: t('dashboard.toolGroups.mit18'), items: MIT18.map((v) => ABLAEUFE.find((a) => a.view === v)).filter(Boolean).map(alsEintrag) },
    // Die Klammer ohne Kapitel (Organigramm 06.11.2026): Kalender, Merkliste, Unterlagen, Links, Teilen, Suche.
    { label: t('dashboard.toolGroups.klammer'), items: [
      { label: t('nav.wasAnsteht'), sub: t('nav.sub.calendar'), view: 'calendar', icon: 'calendar' },
      { label: t('nav.merkliste'), sub: t('nav.sub.merkliste'), view: 'merkliste', icon: 'check' },
      { label: t('nav.tresor'), sub: t('nav.sub.tresor'), view: 'tresor', icon: 'ordner' },
      { label: t('nav.direktlinks'), sub: t('nav.sub.direktlinks'), view: 'direktlinks', icon: 'dokumentTresor' },
      { label: t('nav.flyer'), sub: t('nav.sub.flyer'), view: 'flyer', icon: 'dokumentTresor' },
      { label: t('nav.search'), sub: t('nav.sub.search'), view: 'search', icon: 'search' },
    ] },
  ];
  // Welche Gruppe offen war, gilt für die Sitzung (sessionStorage): wer aus
  // «Lebensereignisse» in einen Ablauf ging und «Übersicht» antippt, soll die
  // Gruppe offen wiederfinden, nicht zugeklappt (Seitenrundgang 27.09.2026).
  // Nur eine Ansichts-Bequemlichkeit — fehlt der Speicher, starten alle zu.
  const GRUPPEN_KEY = 'mp_offene_werkzeuggruppen';
  // Im Zustand gehalten, damit der Aufklapp-Pfeil dem Öffnen folgt (Verbesserungen B1, 06.11.2026 —
  // vorher stand er fest auf «zu»; Wächter: werkzeugGruppenPfeil.test.js).
  const [offen, setOffen] = React.useState(() => {
    try { const v = JSON.parse(sessionStorage.getItem(GRUPPEN_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
  });
  // Seit 05.11.2026 nach Titel (g.label), nicht nach Stelle: mit einer neuen Gruppe hätte die gemerkte
  // Stelle sonst eine andere Gruppe geöffnet. Ältere Einträge (Zahlen) und ein Sprachwechsel treffen nichts — dann starten alle zu.
  const merkeGruppe = (name, istOffen) => setOffen((vorher) => {
    if (vorher.includes(name) === istOffen) return vorher;
    const neu = istOffen ? vorher.concat(name) : vorher.filter((i) => i !== name);
    try { sessionStorage.setItem(GRUPPEN_KEY, JSON.stringify(neu)); } catch { /* ohne Speicher: nichts merken */ }
    return neu;
  });
  const raster = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' };
  return React.createElement(React.Fragment, null,
    ...groups.map((g) => React.createElement('details', {
      // Alle Gruppen starten zu (Tester-Feedback 25.09.2026: «Lebensereignisse
      // eingeklappt»). Vorher stand die erste Gruppe offen, mit 34 Einträgen.
      key: 'tg-' + g.label,
      open: offen.includes(g.label),
      onToggle: (e) => merkeGruppe(g.label, e.currentTarget.open),
      style: { borderTop: '1px solid ' + palette.border + '66' },
    },
      React.createElement('summary', {
        style: { cursor: 'pointer', padding: space.sm + 'px 2px', minHeight: '44px', boxSizing: 'border-box', fontSize: text.sm, fontWeight: weight.medium, color: palette.text, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
      },
        React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px' } },
          React.createElement('span', { style: { fontSize: '10px', color: palette.soft } }, aufklappZeichen(offen.includes(g.label))),
          g.label
        ),
        React.createElement('span', { style: { fontSize: text.xs, color: palette.soft } }, g.items.length)
      ),
      g.teile
        ? React.createElement('div', { style: { padding: '0 0 ' + space.md + 'px 0' } },
          ...g.teile.map((teil) => React.createElement(React.Fragment, { key: teil.key },
            React.createElement('h4', { style: { margin: space.sm + 'px 2px ' + space.xs + 'px', fontSize: text.xs, fontWeight: weight.semi, letterSpacing: '0.3px', color: palette.soft } }, teil.titel),
            React.createElement('div', { style: raster }, teil.items.map(renderTool)))))
        : React.createElement('div', { style: { ...raster, padding: space.xs + 'px 0 ' + space.md + 'px 0' } },
          g.items.map(renderTool)
        )
    ))
  );
};

export default WerkzeugGruppen;
