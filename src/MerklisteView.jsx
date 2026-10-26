import React, { useState, useEffect, useRef } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { EmptyState } from './components/EmptyState.jsx';
import { useVorlaeufig } from './hooks/vorlaeufigContext.js';
import { loadTodos, saveTodos, merkpunktBauen, merkpunktUmschalten, merkpunktTagSetzen, WIEDERHOLUNG_JAEHRLICH } from './utils/merkliste.js';
import { merkpunktBereich, merkpunktZeichen, bereichZeichenFarbe } from './data/aufgabenBereiche.js';

// Persönliche Merkliste: „Erkenntnis → Handlung". Eine Notiz erfassen und
// optional direkt mit dem passenden Rechner/Kapitel verknüpfen (Deeplink).
// Fassung 5 (23.10.2026): die Merkliste ist die To-do-Liste. Ein Punkt kann einen Tag
// bekommen («Tag wählen») und steht dann in «Was ansteht» als Aufgabe. Local-first: localStorage
// (or5_merkliste, Form und Umformungen in utils/merkliste.js — der Kalender teilt sie).

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
  { view: 'calendar', label: 'nav.wasAnsteht' },
  { view: 'direktlinks', label: 'nav.direktlinks' },
];

// «Entfernt · Rückgängig» bleibt rund fünf Sekunden stehen (Entscheid C, §15).
const RUECKGAENGIG_MS = 5000;

export const MerklisteView = ({ palette, t, onNavigate }) => {
  // Im Beispiel und beim Ausprobieren (Entscheid 18.10.2026, wie der Kalender): beginnt leer,
  // speichert nie; die echten Punkte bleiben unsichtbar und unberührt. main.jsx hängt die
  // Ansicht beim Moduswechsel neu ein (key: datenModus).
  const vorlaeufig = useVorlaeufig();
  const [items, setItems] = useState(() => (vorlaeufig ? [] : loadTodos()));
  const [newText, setNewText] = useState('');
  const [newLink, setNewLink] = useState('');
  const [tagOffen, setTagOffen] = useState(null); // id des Punkts, dessen Tag-Feld offen ist
  const [entfernt, setEntfernt] = useState(null); // { item, index } für «Rückgängig»
  const timer = useRef(null);

  useEffect(() => {
    if (vorlaeufig) return;
    saveTodos(items);
  }, [items, vorlaeufig]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const LOCALE = t('calendar.locale');
  const datumKurz = (iso) => {
    const d = new Date(iso + 'T00:00:00');
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString(LOCALE, { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const add = () => {
    const text = newText.trim();
    if (!text) return;
    // Neue Einträge oben (Entscheid Merkliste, 23.10.2026).
    setItems(prev => [merkpunktBauen({ text, link: newLink || null }), ...prev]);
    setNewText('');
    setNewLink('');
  };

  const toggle = (id) => setItems(prev => merkpunktUmschalten(prev, id));
  const tagSetzen = (id, tag) => { setItems(prev => merkpunktTagSetzen(prev, id, tag || null)); setTagOffen(null); };
  const remove = (id) => {
    const index = items.findIndex(i => i.id === id);
    if (index < 0) return;
    setEntfernt({ item: items[index], index });
    setItems(prev => prev.filter(i => i.id !== id));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setEntfernt(null), RUECKGAENGIG_MS);
  };
  // Der Eintrag kommt an dieselbe Stelle zurück.
  const rueckgaengig = () => {
    if (!entfernt) return;
    const { item, index } = entfernt;
    setItems(prev => { const neu = [...prev]; neu.splice(Math.min(index, neu.length), 0, item); return neu; });
    setEntfernt(null);
    clearTimeout(timer.current);
  };
  const labelFor = (view) => {
    const tgt = LINK_TARGETS.find(x => x.view === view);
    return tgt ? t(tgt.label) : view;
  };

  const open = items.filter(i => !i.done);
  const done = items.filter(i => i.done);

  const s = {
    card: { maxWidth: '680px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    intro: { fontSize: text.sm, color: palette.mid, lineHeight: 1.6, marginBottom: space.lg + 'px', maxWidth: '520px' },
    addRow: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px', alignItems: 'center', marginBottom: space.lg + 'px' },
    input: { flex: '1 1 200px', minWidth: '160px', padding: space.sm + 'px ' + space.md + 'px', fontSize: text.body, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.up, color: palette.text, fontFamily: 'inherit' },
    select: { padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.up, color: palette.text, fontFamily: 'inherit', cursor: 'pointer' },
    addBtn: { background: palette.sageBtn, color: '#fff', border: 'none', borderRadius: radius.sm + 'px', padding: space.sm + 'px ' + space.lg + 'px', fontSize: text.sm, fontWeight: weight.semi, cursor: 'pointer', fontFamily: 'inherit' },
    sectionTitle: { fontSize: text.xs, fontWeight: weight.semi, color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px', margin: space.md + 'px 0 ' + space.sm + 'px' },
    row: { display: 'flex', alignItems: 'flex-start', gap: space.sm + 'px', padding: space.sm + 'px 0', borderBottom: '1px solid ' + palette.border + '66' },
    cb: { flexShrink: 0, width: '20px', height: '20px', marginTop: '12px', cursor: 'pointer', accentColor: palette.sage },
    sym: (farbe) => ({ display: 'inline-flex', flexShrink: 0, marginTop: '10px', color: farbe }),
    spalte: { flex: 1, minWidth: 0 },
    // Der ganze Eintrag ist die Tippfläche (Entscheid Merkliste, 23.10.2026) — mit Verknüpfung.
    haupt: { display: 'block', width: '100%', minHeight: '44px', textAlign: 'left', background: 'none', border: 'none', padding: '6px 0', cursor: 'pointer', fontFamily: 'inherit', color: palette.text },
    hauptStill: { display: 'block', padding: '6px 0', minHeight: '32px' },
    txt: (d) => ({ display: 'block', fontSize: text.sm, color: d ? palette.mid : palette.text, textDecoration: d ? 'line-through' : 'none', lineHeight: 1.4 }),
    unter: { display: 'block', fontSize: text.xs, color: palette.mid, marginTop: '2px', lineHeight: leading.normal },
    tagZeile: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.sm + 'px', marginBottom: '4px' },
    tagKnopf: { background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', padding: '4px 10px', minHeight: '44px', fontSize: text.xs, color: palette.text, cursor: 'pointer', fontFamily: 'inherit' },
    tagFeld: { padding: '4px 8px', fontSize: text.xs, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', background: palette.up, color: palette.text, fontFamily: 'inherit' },
    erledigtAm: { fontSize: text.xs, color: palette.mid },
    del: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minWidth: '44px', minHeight: '44px', background: 'none', border: 'none', color: palette.mid, cursor: 'pointer', fontSize: text.sm, padding: '4px' },
    meldung: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px', marginTop: space.md + 'px', padding: space.sm + 'px ' + space.md + 'px', background: palette.up, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', fontSize: text.sm, color: palette.text },
    rueckBtn: { background: 'none', border: 'none', color: palette.sageDeep || palette.text, fontWeight: weight.semi, cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, minHeight: '44px', padding: '0 ' + space.sm + 'px' },
  };

  const tagSteuerung = (i) => {
    if (i.done) {
      return i.erledigtAm
        ? React.createElement('div', { style: s.tagZeile }, React.createElement('span', { style: s.erledigtAm }, t('merkliste.erledigtAm', { datum: datumKurz(i.erledigtAm) })))
        : null;
    }
    const offen = tagOffen === i.id;
    return React.createElement('div', { style: s.tagZeile },
      React.createElement('button', {
        type: 'button', style: s.tagKnopf, 'aria-expanded': offen,
        onClick: () => setTagOffen(offen ? null : i.id),
      }, i.tag ? datumKurz(i.tag) : t('merkliste.tagWaehlen')),
      i.wiederholung === WIEDERHOLUNG_JAEHRLICH && React.createElement('span', { style: s.erledigtAm }, hinweisZeichen('recurring', 12), t('calendar.yearly')),
      offen && React.createElement('input', {
        type: 'date', style: s.tagFeld, value: i.tag || '',
        'aria-label': t('merkliste.tagWaehlen') + ': ' + i.text,
        // Beim Tippen meldet das Feld schon «0002-…» als gültig — erst ein vierstelliges Jahr ab 1900 zählt.
        onChange: e => { const v = e.target.value; if (v && Number(v.slice(0, 4)) >= 1900) tagSetzen(i.id, v); },
      }),
      offen && i.tag && React.createElement('button', { type: 'button', style: s.tagKnopf, onClick: () => tagSetzen(i.id, null) }, t('merkliste.ohneTag'))
    );
  };

  const renderItem = (i) => {
    const farbe = bereichZeichenFarbe(merkpunktBereich(i.link), palette);
    const inhalt = [
      React.createElement('span', { key: 'tx', style: s.txt(i.done) }, i.text),
      i.link && React.createElement('span', { key: 'ln', style: s.unter }, labelFor(i.link) + ' ›'),
    ];
    return React.createElement('div', { key: i.id, style: s.row },
      React.createElement('input', { type: 'checkbox', checked: !!i.done, onChange: () => toggle(i.id), style: s.cb, 'aria-label': (i.done ? t('merkliste.undo') : t('merkliste.markDone')) + ': ' + i.text }),
      React.createElement('span', { 'aria-hidden': 'true', style: s.sym(farbe) }, React.createElement(Icon, { name: merkpunktZeichen(i.link), size: 18 })),
      React.createElement('div', { style: s.spalte },
        i.link && onNavigate
          ? React.createElement('button', { type: 'button', style: s.haupt, onClick: () => onNavigate(i.link) }, ...inhalt)
          : React.createElement('div', { style: s.hauptStill }, ...inhalt),
        tagSteuerung(i)
      ),
      React.createElement('button', { type: 'button', style: s.del, 'aria-label': t('common.delete') + ': ' + i.text, onClick: () => remove(i.id) }, React.createElement(Icon, { name: 'kreuz', size: 16 }))
    );
  };

  return React.createElement('div', { style: s.card },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'check', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('merkliste.title')),
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
      React.createElement('button', { type: 'button', style: s.addBtn, onClick: add }, t('merkliste.add'))
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
    ),

    // «Entfernt · Rückgängig»: sofort weg, ein Tipp holt den Eintrag an dieselbe Stelle zurück.
    React.createElement('div', { role: 'status', 'aria-live': 'polite' },
      entfernt && React.createElement('div', { style: s.meldung },
        React.createElement('span', { style: { minWidth: 0, color: palette.text } }, t('merkliste.entfernt') + ' · ' + entfernt.item.text),
        React.createElement('button', { type: 'button', style: s.rueckBtn, onClick: rueckgaengig }, t('calendar.undo'))
      )
    )
  );
};

export default MerklisteView;
