import React, { useState, useRef } from 'react';
import Icons from './IconSystem.jsx';
import { text, weight, space, radius, shadow, ease, duration, fontFamilyDisplay } from './config/tokens.js';
import { CONTROL_LABELS, groupSettingsControls } from './settingsGroups.js';
import { useFocusTrap } from './hooks/useFocusTrap.js';
import { WERKZEUGE, MENUE_WERKZEUGE, werkzeugKey } from './data/werkzeugRegister.js';
import { laeuftAlsApp } from './utils/geraetErkennung.js';
import { getBereichForChapter } from './data/lebensbereiche.js';

// ─── Menü und Einstellungs-Schublade ──────────────────────
// mode 'nav': das Menü, seit Fassung 5 (23.10.2026) bildschirmfüllend mit Karten.
// mode 'settings': die schlanke Einstellungs-Schublade (unverändert).

export const MobileNav = ({ palette, t, isOpen, onClose, onNavigate, activeChapter, activeView, chapters, completion, settingsControls, settingsLabel, onStartTour, mode = 'nav', leftHand = false, isDarkMode = true, simpleView = false, onToggleSimpleView, feedbackHref }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // O17 · Die Schublade ist modal: solange sie offen ist, liegt der Rest der Seite
  // dahinter. Vorher hing der Escape-Griff am Hintergrund — der Fokus stand aber
  // beim auslösenden Knopf AUSSERHALB davon, also erreichte ihn kein Tastendruck
  // und Escape tat schlicht nichts. Der Griff gehört auf die Schublade selbst,
  // dorthin, wo der Fokus nach dem Öffnen auch wirklich steht.
  const schublade = useRef(null);
  useFocusTrap(isOpen, { ref: schublade, onEscape: onClose });

  if (!isOpen) return null;

  // Seite, von der die Schublade einfährt — folgt der gewählten Hand (Standard rechts,
  // Linkshänder-Modus links). Rand + Slide-Richtung passen sich mit an.
  const side = leftHand ? 'left' : 'right';
  const panelSide = side === 'left'
    ? { left: 0, borderRight: '1px solid ' + palette.border, animation: 'slideIn 0.25s' }
    : { right: 0, borderLeft: '1px solid ' + palette.border, animation: 'slideInRight 0.25s' };

  const renderIconEarly = (iconKey, size) => {
    const IconFn = Icons[iconKey];
    if (!IconFn) return null;
    return React.createElement('div', { style: { width: size || '16px', height: size || '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, IconFn());
  };

  // Einstellungen & Konto — eigene schlanke Schublade von rechts (oben-rechts-Eingang),
  // damit der Boden-Anker „Menü" reine Navigation bleibt (keine Doppelung).
  if (mode === 'settings') {
    return React.createElement('div', {
      role: 'dialog', 'aria-modal': 'true', 'aria-label': settingsLabel || t('nav.settings'),
      style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.45)', zIndex: 998, animation: 'fadeIn 0.2s' },
      onClick: onClose,
    },
      React.createElement('nav', {
        ref: schublade,
        role: 'navigation', 'aria-label': settingsLabel || t('nav.settings'),
        style: {
          position: 'fixed', top: 0, bottom: 0, width: '288px', maxWidth: '86vw',
          background: palette.surface, boxShadow: shadow.lg,
          zIndex: 999, overflowY: 'auto', display: 'flex', flexDirection: 'column',
          ...panelSide,
        },
        onClick: (e) => e.stopPropagation(),
      },
        React.createElement('div', { style: { padding: '20px 20px 16px 20px', borderBottom: '1px solid ' + palette.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          React.createElement('div', { style: { fontSize: text.body + 1, fontWeight: weight.semi, letterSpacing: '0.3px' } }, settingsLabel || t('nav.settings')),
          React.createElement('button', { onClick: onClose, 'aria-label': t('common.close') || 'Schliessen', style: { background: 'none', border: 'none', cursor: 'pointer', color: palette.mid, fontSize: '18px', lineHeight: 1, padding: '2px 6px', minWidth: '24px', minHeight: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } }, '×')
        ),
        // Beschriftete, gruppierte Zeilen (Anzeige & Sprache / Barrierefreiheit) statt
        // flacher Icon-Reihe — dieselbe Hierarchie wie die ganze Einstellungs-Seite.
        ...groupSettingsControls(settingsControls).map(g => React.createElement('div', {
          key: g.key, style: { padding: '14px 20px', borderBottom: '1px solid ' + palette.border },
        },
          React.createElement('div', { style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.soft, marginBottom: space.xs, letterSpacing: '0.5px', textTransform: 'uppercase' } }, t(g.labelKey)),
          ...g.controls.map((ctrl, i) => React.createElement('div', {
            key: ctrl.key || i,
            style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.md, padding: space.xs + 'px 0' },
          },
            React.createElement('span', { style: { fontSize: text.sm, color: palette.text } }, CONTROL_LABELS[ctrl.key] ? t(CONTROL_LABELS[ctrl.key]) : ctrl.key),
            ctrl
          ))
        )),
        onStartTour ? React.createElement('button', {
          type: 'button', onClick: () => { onClose(); onStartTour(); },
          style: { display: 'flex', alignItems: 'center', gap: space.sm, width: '100%', textAlign: 'left', padding: '14px 20px', background: 'transparent', border: 'none', borderBottom: '1px solid ' + palette.border, cursor: 'pointer', color: palette.mid, fontSize: text.sm, fontFamily: 'inherit' },
        },
          React.createElement('span', { 'aria-hidden': 'true', style: { color: palette.sage, flexShrink: 0, width: '16px', height: '16px', display: 'inline-flex' } }, renderIconEarly('info', '16px')),
          t('tour.reopen')
        ) : null,
        // Konto & Daten — ehrlich: lokal, kein Login; „Konto" = Datenhoheit (Backup/Export).
        React.createElement('div', { style: { padding: '16px 20px', borderBottom: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontSize: text.xs, fontWeight: weight.medium, color: palette.soft, marginBottom: space.xs, letterSpacing: '0.3px' } }, t('settingsDrawer.accountTitle')),
          React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: 1.5, marginBottom: space.sm } }, t('settingsDrawer.accountNote')),
          onNavigate ? React.createElement('button', {
            onClick: () => { onClose(); onNavigate('export'); },
            style: { display: 'inline-flex', alignItems: 'center', gap: space.sm, background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', padding: '8px 12px', fontSize: text.sm, color: palette.text, fontFamily: 'inherit' },
          },
            React.createElement('span', { style: { color: palette.sage, display: 'inline-flex' } }, renderIconEarly('download', '15px')),
            t('settingsDrawer.backup')
          ) : null
        ),
        React.createElement('div', { style: { flex: 1 } }),
        React.createElement('div', { style: { padding: '16px 20px', borderTop: '1px solid ' + palette.border, fontSize: text.xs, color: palette.soft } }, t('nav.privacyNote'))
      )
    );
  }

  // ─── Das Menü · Fassung 5 (entschieden 23.10.2026) ─────────────────────────
  // Karten mit Satz auf dem ganzen Bildschirm statt eines schmalen Panels mit Zeilen
  // ohne Satz (VERGLEICH.md «Menü · entschieden»). Reihenfolge = Navigations-Rückgrat:
  //   1. die vier Anker (Übersicht · Was ansteht · Rucksack · Was steht mir zu?)
  //   2. die sieben Bereiche in ihren Gruppen, Satz = chapters.*.description
  //   3. die Werkzeuge aus dem Register (imMenue), dazu «Alle Werkzeuge im Gepäck ›»
  //   4. unten: Einstellungen · Einfache Ansicht · Datenschutz & Rechtliches ·
  //      Problem melden · «Lokal gespeichert …»
  // «Rundgang neu starten» steht NICHT mehr hier, sondern nur in den Einstellungen.
  // Nichts von dem, was das Menü vorher trug, ist weggefallen (Test: menueFassung5.test.js).

  // Icon mapping for chapters
  const chapterIcons = {
    basis: 'basis', wohnen: 'wohnen', finanzen: 'finanzen',
    versicherungen: 'versicherungen', ausbildung: 'ausbildung',
    behoerden: 'behoerden', notfall: 'notfall',
  };

  const renderIcon = (iconKey, size) => {
    // Ein Zeichen, das nicht im Icon-System steht (Rucksack, Sackmesser, Geschenk), kommt als Funktion.
    const IconFn = typeof iconKey === 'function' ? iconKey : Icons[iconKey];
    if (!IconFn) return null;
    return React.createElement('div', { style: { width: size || '16px', height: size || '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, IconFn());
  };

  // Die Zeichen der drei Anker, die nicht im Icon-System stehen — dieselben Linien wie
  // im Boden-Anker (main.jsx `bottomIcon`), hier von Hand, weil main.jsx nicht
  // importierbar ist. «Was ansteht» nimmt das Kalenderblatt aus dem Icon-System.
  const linie = (...pfade) => () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', width: '100%', height: '100%' },
    ...pfade.map((d, i) => React.createElement('path', { key: i, d })));
  const sackmesser = linie('M8 9 H15 A3 3 0 0 1 15 15 H8 A3 3 0 0 1 8 9 Z M15 10 L21 4 M15 14 L20 18.5');
  const rucksack = linie('M6 8a6 6 0 0 1 12 0v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z', 'M9 8a3 3 0 0 1 6 0', 'M9 14h6');
  const geschenk = linie('M3 8 H21 V12 H3 Z M5 12 V20 H19 V12 M12 8 V20 M12 8 C 12 5 9.5 4 8.5 5.5 C 7.6 7 10 8 12 8 C 14 8 16.4 7 15.5 5.5 C 14.5 4 12 5 12 8');

  const oeffne = (w) => {
    if (w.view === 'chapter') {
      const idx = (chapters || []).findIndex((c) => c.key === w.kapitel);
      if (idx >= 0) onNavigate('chapter', idx);
    } else onNavigate(w.view);
    onClose();
  };
  const geh = (view) => () => { onNavigate(view); onClose(); };

  // Werkzeug-Vorschau 27.09.2026: keine eigene Liste. Das Menü zeigt aus dem EINEN
  // Register (data/werkzeugRegister.js) die Einträge mit `imMenue`. Der Kalender steht
  // seit Fassung 5 oben als Anker «Was ansteht» und darum nicht ein zweites Mal hier.
  // Satz je Werkzeug: der Untertitel aus dem Register; die Finanz-Übersicht hat dort
  // keinen und nimmt den Satz ihrer Dashboard-Kachel.
  const WERKZEUG_SATZ = { finanzuebersicht: 'dashboard.highlightFinanzSub' };
  const alsEintrag = (w) => ({
    key: werkzeugKey(w), view: w.view, label: t(w.nav), icon: w.icon, aliases: w.aliases || [],
    satz: w.sub ? t(w.sub) : (WERKZEUG_SATZ[w.view] ? t(WERKZEUG_SATZ[w.view]) : null),
    go: () => oeffne(w),
  });
  const menueWerkzeuge = MENUE_WERKZEUGE.map(alsEintrag).filter((w) => w.view !== 'calendar');
  const gepaeckEintrag = { key: 'gepaeck', view: 'gepaeck', label: t('gepaeck.menuAlle'), icon: rucksack, aliases: [], go: geh('gepaeck') };
  const settingsEintrag = { key: 'settings', view: 'settings', label: t('common.settingsTitle'), icon: 'settings', aliases: [], go: geh('settings') };
  // Die Suche im Menü findet weiterhin ALLE Werkzeuge (auch die im Gepäck).
  const allTools = [...WERKZEUGE.map(alsEintrag), gepaeckEintrag, settingsEintrag];

  // Die vier Anker. Namen aus der App; die Sätze sind neu (Copy-Prüfer, nav.ankerSatz.*).
  // «Was ansteht» hat einen eigenen Menü-Namen (nav.wasAnsteht): nav.calendar speist auch
  // den Boden-Anker, das Gepäck und «Zurück zu …» und bleibt darum, wie es ist.
  const ANKER = [
    { key: 'dashboard', view: 'dashboard', label: t('nav.dashboard'), satz: t('nav.ankerSatz.dashboard'), icon: sackmesser },
    { key: 'calendar', view: 'calendar', label: t('nav.wasAnsteht'), satz: t('nav.ankerSatz.wasAnsteht'), icon: 'calendar' },
    { key: 'gepaeck', view: 'gepaeck', label: t('nav.rucksack'), satz: t('nav.ankerSatz.rucksack'), icon: rucksack },
    { key: 'situationen', view: 'situationen', label: t('dashboard.anspruchTitle'), satz: t('nav.ankerSatz.anspruch'), icon: geschenk },
  ];

  // Bereichsfarbe für das Zeichen eines Kapitels — dieselbe Quelle wie Baum und Reiter.
  const bereichFarbe = (chKey) => {
    const b = getBereichForChapter(chKey);
    return b ? (isDarkMode ? b.dark : b.light) : palette.sage;
  };

  const raster = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: space.sm + 'px' };
  const gruppenTitel = (key, label) => React.createElement('h3', {
    key, style: { fontSize: text.xs, fontWeight: weight.medium, color: palette.soft, margin: space.md + 'px 4px ' + space.sm + 'px', letterSpacing: '0.3px' },
  }, label);

  // Eine Karte: Zeichen auf getönter Fläche, Name, ein Satz. Die ganze Karte ist die
  // Tippfläche (≥ 72 px hoch), ein echter <button> in Lese-Reihenfolge.
  const karte = ({ key, label, satz, icon, onClick, aktiv, farbe }) => React.createElement('button', {
    key, type: 'button', onClick, 'aria-current': aktiv ? 'page' : undefined,
    style: {
      display: 'flex', gap: '14px', alignItems: 'center', width: '100%', minHeight: '72px',
      padding: '12px', borderRadius: radius.lg, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
      background: palette.surface, color: palette.text,
      border: '1px solid ' + (aktiv ? palette.sand : palette.border),
      transition: `border-color ${duration.fast}ms ${ease}`,
    },
  },
    React.createElement('span', {
      'aria-hidden': 'true',
      style: {
        width: '48px', height: '48px', borderRadius: radius.lg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: farbe ? farbe + '2E' : palette.up, color: farbe || palette.mid,
        boxShadow: farbe ? 'inset 0 0 0 1px ' + farbe + '4D' : 'none',
      },
    }, renderIcon(icon, '24px')),
    React.createElement('span', { style: { minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' } },
      React.createElement('span', { style: { fontFamily: fontFamilyDisplay, fontSize: text.body + 1, fontWeight: weight.bold, color: palette.text, lineHeight: 1.25 } }, label),
      satz ? React.createElement('span', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.35 } }, satz) : null
    )
  );

  // Zeile für die Suchtreffer — schlicht, ≥ 44 px.
  const navItem = (key, label, iconKey, onClick, isActive) =>
    React.createElement('button', {
      key, type: 'button', onClick, 'aria-current': isActive ? 'page' : undefined,
      style: {
        width: '100%', minHeight: '44px', padding: '12px 16px',
        background: isActive ? palette.up : 'transparent', border: 'none',
        borderLeft: isActive ? '3px solid ' + palette.sand : '3px solid transparent',
        borderRadius: radius.sm, cursor: 'pointer', textAlign: 'left',
        fontSize: text.sm, fontWeight: isActive ? weight.semi : weight.normal,
        color: palette.text, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '12px',
        transition: `background ${duration.fast}ms ${ease}`,
      },
    },
      React.createElement('div', { style: { color: isActive ? palette.sand : palette.mid, flexShrink: 0 } }, renderIcon(iconKey, '18px')),
      label
    );

  // Kleiner Knopf / Link der unteren Reihe — Tippfläche 44 px, Farbe ausdrücklich gesetzt.
  const kleinStil = { display: 'inline-flex', alignItems: 'center', minHeight: '44px', padding: '0 4px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, color: palette.mid, textDecoration: 'underline', textUnderlineOffset: '3px' };

  const suchErgebnisse = (q) => {
    const results = [];
    if ((t('nav.dashboard') || 'Dashboard').toLowerCase().includes(q)) {
      results.push(navItem('dashboard', t('nav.dashboard'), sackmesser, geh('dashboard'), activeView === 'dashboard'));
    }
    (chapters || []).forEach((ch, idx) => {
      const match = ch.title.toLowerCase().includes(q) || (ch.description || '').toLowerCase().includes(q) || ch.key.toLowerCase().includes(q);
      if (match) {
        results.push(navItem(ch.key, ch.title, chapterIcons[ch.key],
          () => { onNavigate('chapter', idx); onClose(); },
          activeView === 'chapter' && activeChapter === idx));
      }
    });
    allTools.forEach((tool) => {
      if (tool.label.toLowerCase().includes(q) || tool.key.toLowerCase().includes(q) || tool.aliases.some((a) => a.includes(q))) {
        results.push(navItem(tool.key, tool.label, tool.icon, tool.go, activeView === tool.view));
      }
    });
    if (results.length === 0) {
      results.push(React.createElement('div', {
        key: 'no-results', role: 'status', 'aria-live': 'polite',
        style: { padding: '20px', textAlign: 'center', fontSize: text.sm, color: palette.mid },
      }, t('common.noResults') || 'Keine Ergebnisse'));
    }
    return React.createElement('div', { key: 'treffer', style: { display: 'flex', flexDirection: 'column', gap: '2px' } }, ...results);
  };

  const gruppen = [
    { label: t('dashboard.tierCore'), indices: [0, 1, 2] },
    { label: t('dashboard.tierSupporting'), indices: [3, 4] },
    { label: t('dashboard.tierProtective'), indices: [5, 6] },
  ];

  const q = searchQuery.toLowerCase().trim();

  return React.createElement('div', {
    role: 'dialog', 'aria-modal': 'true', 'aria-label': t('nav.menu'),
    style: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999,
      background: palette.bg, color: palette.text, overflowY: 'auto',
      animation: 'fadeIn 0.2s',
    },
  },
    React.createElement('nav', {
      ref: schublade, role: 'navigation', 'aria-label': t('nav.menu'),
      style: {
        maxWidth: '880px', margin: '0 auto', boxSizing: 'border-box',
        padding: '14px 16px calc(24px + env(safe-area-inset-bottom))',
      },
    },
      // Kopf: Name + Schliessen. Die Überschrift nimmt beim Öffnen den Fokus
      // (data-dialog-titel, useFocusTrap) — der Screenreader liest so zuerst, wo man ist.
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: space.sm, marginBottom: space.sm + 'px' } },
        React.createElement('h2', {
          'data-dialog-titel': true, tabIndex: -1,
          style: { margin: 0, fontFamily: fontFamilyDisplay, fontSize: text.lg, fontWeight: weight.bold, color: palette.text, outlineOffset: '4px' },
        }, t('common.appName')),
        React.createElement('button', {
          type: 'button', onClick: onClose, 'aria-label': t('common.close') || 'Schliessen',
          style: { width: '44px', height: '44px', borderRadius: '50%', border: '1px solid ' + palette.border, background: 'none', color: palette.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
        }, React.createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', 'aria-hidden': 'true' },
          React.createElement('path', { d: 'M6 6l12 12M18 6 6 18' })))
      ),

      // Stand + «Auf den Startbildschirm legen» (Entscheid 25.09.2026: immer hier zu finden;
      // läuft die Seite schon als App, fehlt der Knopf).
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm, flexWrap: 'wrap', marginBottom: space.md - 4 + 'px' } },
        React.createElement('span', { style: { fontSize: text.xs, color: palette.soft } }, t('nav.completion', { value: completion })),
        !laeuftAlsApp() ? React.createElement('button', {
          type: 'button', onClick: () => { onClose(); onNavigate('installApp'); },
          style: { display: 'inline-flex', alignItems: 'center', gap: space.sm, minHeight: '44px', padding: '8px 14px', borderRadius: radius.full, border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, cursor: 'pointer', fontFamily: 'inherit', fontSize: text.xs },
        },
          React.createElement('span', { 'aria-hidden': 'true', style: { color: palette.sage, width: '16px', height: '16px', display: 'inline-flex' } }, renderIcon('handy', '16px')),
          t('install.navSub')
        ) : null
      ),

      // Suche — findet Kapitel, Werkzeuge (auch die im Gepäck) und die Einstellungen.
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'center', gap: '8px', background: palette.surface, borderRadius: radius.md, padding: '0 12px', minHeight: '44px', border: '1px solid ' + palette.border, marginBottom: space.sm + 'px' },
      },
        React.createElement('div', { style: { color: palette.mid, flexShrink: 0, width: '16px', height: '16px' } }, renderIcon('search', '16px')),
        React.createElement('input', {
          type: 'search', value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          placeholder: t('common.search') || 'Suchen…', 'aria-label': t('common.search'),
          style: { flex: 1, minHeight: '42px', border: 'none', background: 'transparent', outline: 'none', fontSize: text.sm, color: palette.text, fontFamily: 'inherit' },
        }),
        searchQuery ? React.createElement('button', {
          type: 'button', onClick: () => setSearchQuery(''), 'aria-label': t('common.clear') || 'Clear',
          style: { minWidth: '44px', minHeight: '44px', background: 'none', border: 'none', cursor: 'pointer', color: palette.mid, fontSize: '16px', lineHeight: 1 },
        }, '×') : null
      ),

      q ? suchErgebnisse(q) : React.createElement(React.Fragment, null,
        // 1 · Die vier Anker
        React.createElement('div', { style: { ...raster, marginTop: space.sm + 'px' } },
          ...ANKER.map((a) => karte({ key: 'anker-' + a.key, label: a.label, satz: a.satz, icon: a.icon, onClick: geh(a.view), aktiv: activeView === a.view }))
        ),

        // 2 · Die Bereiche in ihren Gruppen
        ...gruppen.map((g, gi) => React.createElement('section', { key: 'gruppe-' + gi },
          gruppenTitel('gruppe-titel-' + gi, g.label),
          React.createElement('div', { style: raster },
            ...g.indices.map((idx) => {
              const ch = (chapters || [])[idx];
              if (!ch) return null;
              return karte({
                key: ch.key, label: ch.title, satz: ch.description, icon: chapterIcons[ch.key],
                farbe: bereichFarbe(ch.key),
                onClick: () => { onNavigate('chapter', idx); onClose(); },
                aktiv: activeView === 'chapter' && activeChapter === idx,
              });
            })
          )
        )),

        // 3 · Werkzeuge + der Zugang zu allen übrigen
        React.createElement('section', { key: 'werkzeuge' },
          gruppenTitel('werkzeuge-titel', t('nav.tools')),
          React.createElement('div', { style: raster },
            ...menueWerkzeuge.map((w) => karte({ key: w.key, label: w.label, satz: w.satz, icon: w.icon, onClick: w.go, aktiv: activeView === w.view }))
          ),
          React.createElement('button', {
            type: 'button', onClick: gepaeckEintrag.go, 'aria-current': activeView === 'gepaeck' ? 'page' : undefined,
            style: { display: 'flex', alignItems: 'center', minHeight: '44px', padding: '0 4px', marginTop: space.xs + 'px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, color: palette.sandDeep },
          }, gepaeckEintrag.label + ' ›')
        )
      ),

      // 4 · Unten: Einstellungen · Einfache Ansicht · Datenschutz & Rechtliches · Problem melden
      React.createElement('div', {
        style: { display: 'flex', flexWrap: 'wrap', gap: '0 ' + space.md + 'px', marginTop: space.md + 'px', paddingTop: space.sm + 'px', borderTop: '1px solid ' + palette.border },
      },
        React.createElement('button', { type: 'button', onClick: settingsEintrag.go, 'aria-current': activeView === 'settings' ? 'page' : undefined, style: kleinStil }, settingsEintrag.label),
        onToggleSimpleView ? React.createElement('button', {
          type: 'button', onClick: onToggleSimpleView, 'aria-pressed': !!simpleView,
          style: { ...kleinStil, color: simpleView ? palette.text : palette.mid, fontWeight: simpleView ? weight.semi : weight.normal },
        }, t('common.simpleView')) : null,
        React.createElement('button', { type: 'button', onClick: geh('legal'), 'aria-current': activeView === 'legal' ? 'page' : undefined, style: kleinStil }, t('legal.footerLink')),
        // Melde-Weg wie in der Fusszeile: ein Mail-Entwurf, den die Person selbst sieht
        // und abschickt — nichts wird automatisch gesendet.
        feedbackHref ? React.createElement('a', { href: feedbackHref, style: kleinStil }, t('error.report')) : null
      ),
      React.createElement('p', { style: { fontSize: text.xs, color: palette.soft, margin: space.sm + 'px 4px 0', lineHeight: 1.5 } }, t('nav.privacyNote'))
    )
  );

};

export default MobileNav;
