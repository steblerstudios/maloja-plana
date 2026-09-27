import React, { useState, useRef } from 'react';
import Icons from './IconSystem.jsx';
import { text, weight, space, radius, shadow, ease, duration } from './config/tokens.js';
import { CONTROL_LABELS, groupSettingsControls } from './settingsGroups.js';
import { useFocusTrap } from './hooks/useFocusTrap.js';
import { WERKZEUGE, MENUE_WERKZEUGE, werkzeugKey } from './data/werkzeugRegister.js';
// VORSCHAU-VARIANTEN — vor dem Merge entfernen
import { aktuelleVarianten, MENUE_ZUSAETZE } from './utils/vorschauVarianten.js';
import { laeuftAlsApp } from './utils/geraetErkennung.js';

// ─── Mobile Navigation ────────────────────────────────────
// Slide-in drawer with SVG pictograms and calmer visual hierarchy.

export const MobileNav = ({ palette, t, isOpen, onClose, onNavigate, activeChapter, activeView, chapters, completion, settingsControls, settingsLabel, onStartTour, mode = 'nav', hasBottomAnchor = false, leftHand = false }) => {
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

  // Icon mapping for chapters
  const chapterIcons = {
    basis: 'basis', wohnen: 'wohnen', finanzen: 'finanzen',
    versicherungen: 'versicherungen', ausbildung: 'ausbildung',
    behoerden: 'behoerden', notfall: 'notfall',
  };

  const renderIcon = (iconKey, size) => {
    // Ein Zeichen, das nicht im Icon-System steht (der Rucksack), kommt als Funktion.
    const IconFn = typeof iconKey === 'function' ? iconKey : Icons[iconKey];
    if (!IconFn) return null;
    return React.createElement('div', { style: { width: size || '16px', height: size || '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, IconFn());
  };

  const navItem = (key, label, iconKey, onClick, isActive) =>
    React.createElement('button', {
      key: key,
      onClick: onClick,
      style: {
        width: '100%',
        minHeight: '44px',
        padding: '12px 20px',
        background: isActive ? palette.up : 'transparent',
        border: 'none',
        borderLeft: isActive ? '3px solid ' + palette.sand : '3px solid transparent',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: text.sm,
        fontWeight: isActive ? weight.semi : weight.normal,
        color: palette.text,
        fontFamily: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: `background ${duration.fast}ms ${ease}`,
      }
    },
      React.createElement('div', { style: { color: isActive ? palette.sand : palette.mid, flexShrink: 0 } },
        renderIcon(iconKey, '18px')
      ),
      label
    );

  return React.createElement('div', {
    role: 'dialog', 'aria-modal': 'true', 'aria-label': t('nav.menu'),
    style: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.45)', zIndex: 998,
      animation: 'fadeIn 0.2s',
    },
    onClick: onClose,
  },
    React.createElement('nav', {
      ref: schublade,
      role: 'navigation',
      'aria-label': t('nav.menu'),
      style: {
        position: 'fixed', top: 0, bottom: 0, width: '280px',
        background: palette.surface,
        boxShadow: shadow.lg,
        zIndex: 999, overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        ...panelSide,
      },
      onClick: (e) => e.stopPropagation(),
    },

      // Header
      React.createElement('div', {
        style: { padding: '20px 20px 16px 20px', borderBottom: '1px solid ' + palette.border }
      },
        React.createElement('div', {
          style: { fontSize: text.body + 1, fontWeight: weight.semi, marginBottom: space.xs, letterSpacing: '0.3px' }
        }, t('common.appName')),
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.mid }
        }, t('nav.completion', { value: completion }))
      ),

      // Einstellungen (Ansicht & Sprache) — auf dem Handy aus der Kopfzeile hierher eingeklappt
      (settingsControls && settingsControls.length) ? React.createElement('div', {
        key: 'settings-section',
        style: { padding: '14px 20px', borderBottom: '1px solid ' + palette.border }
      },
        React.createElement('div', {
          style: { fontSize: text.xs, fontWeight: weight.medium, color: palette.soft, marginBottom: space.sm, letterSpacing: '0.3px' }
        }, settingsLabel),
        React.createElement('div', {
          style: { display: 'flex', flexWrap: 'wrap', gap: space.sm, alignItems: 'center' }
        }, settingsControls)
      ) : null,

      // Rundgang erneut starten — ruhiger Einstieg, jederzeit wieder aufrufbar
      onStartTour ? React.createElement('button', {
        key: 'restart-tour',
        type: 'button',
        onClick: () => { onClose(); onStartTour(); },
        style: {
          display: 'flex', alignItems: 'center', gap: space.sm, width: '100%',
          textAlign: 'left', padding: '12px 20px', background: 'transparent',
          border: 'none', borderBottom: '1px solid ' + palette.border, cursor: 'pointer',
          color: palette.mid, fontSize: text.sm, fontFamily: "inherit",
        }
      },
        React.createElement('span', { 'aria-hidden': 'true', style: { color: palette.sage, flexShrink: 0, width: '16px', height: '16px', display: 'inline-flex' } }, renderIcon('info', '16px')),
        t('tour.reopen')
      ) : null,

      // Auf den Startbildschirm — immer hier zu finden (Entscheid 25.09.2026), auch wenn die Karte
      // im Bergpanorama weggeklickt ist. Läuft die Seite schon als App, fehlt der Eintrag.
      mode === 'nav' && !laeuftAlsApp() ? React.createElement('button', {
        key: 'install-app',
        type: 'button',
        onClick: () => { onClose(); onNavigate('installApp'); },
        style: {
          display: 'flex', alignItems: 'center', gap: space.sm, width: '100%',
          textAlign: 'left', padding: '12px 20px', background: 'transparent',
          border: 'none', borderBottom: '1px solid ' + palette.border, cursor: 'pointer',
          color: palette.mid, fontSize: text.sm, fontFamily: "inherit",
        }
      },
        React.createElement('span', { 'aria-hidden': 'true', style: { color: palette.sage, flexShrink: 0, width: '16px', height: '16px', display: 'inline-flex' } }, renderIcon('handy', '16px')),
        t('install.navSub')
      ) : null,

      // Search
      React.createElement('div', {
        style: { padding: '12px 20px 8px 20px' }
      },
        React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', gap: '8px', background: palette.up, borderRadius: radius.md, padding: '8px 12px', border: '1px solid ' + palette.border }
        },
          React.createElement('div', { style: { color: palette.mid, flexShrink: 0, width: '16px', height: '16px' } }, renderIcon('search', '16px')),
          React.createElement('input', {
            type: 'text',
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: t('common.search') || 'Suchen…', 'aria-label': t('common.search'),
            autoFocus: true,
            style: {
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontSize: text.sm, color: palette.text, fontFamily: 'inherit',
            }
          }),
          searchQuery && React.createElement('button', {
            onClick: () => setSearchQuery(''),
            'aria-label': t('common.clear') || 'Clear',
            style: { background: 'none', border: 'none', cursor: 'pointer', color: palette.mid, fontSize: '14px', padding: '0 2px', lineHeight: 1 }
          }, '×')
        )
      ),

      // Build searchable items
      ...(() => {
        const q = searchQuery.toLowerCase().trim();

        // Werkzeug-Vorschau 27.09.2026: keine eigene Liste mehr. Das Menü zeigt aus dem
        // EINEN Register (data/werkzeugRegister.js) die Einträge mit `imMenue` —
        // Dokumentenablage · Kalender · Merkliste —, dazu «Alle Werkzeuge im Gepäck» als
        // Zugang zu allem übrigen und die Einstellungen (dort: Export, Benachrichtigungen).
        // Vorher: 18 Einträge von Hand, 9 davon hinter «Mehr», einig mit dem Dashboard bei 8.
        const rucksack = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', width: '100%', height: '100%' },
          React.createElement('path', { d: 'M6 8a6 6 0 0 1 12 0v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z' }),
          React.createElement('path', { d: 'M9 8a3 3 0 0 1 6 0' }), React.createElement('path', { d: 'M9 14h6' }));
        const oeffne = (w) => {
          if (w.view === 'chapter') {
            const idx = (chapters || []).findIndex((c) => c.key === w.kapitel);
            if (idx >= 0) onNavigate('chapter', idx);
          } else onNavigate(w.view);
          onClose();
        };
        const alsEintrag = (w) => ({ key: werkzeugKey(w), view: w.view, label: t(w.nav), icon: w.icon, aliases: w.aliases || [], go: () => oeffne(w) });
        // VORSCHAU-VARIANTEN — vor dem Merge entfernen: `?menue=steuern,finanz,lebens` hängt
        // diese Einträge nach den drei festen an (gleicher Eintrag wie im Gepäck).
        const zusatz = aktuelleVarianten().menue.map((k) => WERKZEUGE.find((w) => w.view === MENUE_ZUSAETZE[k])).filter(Boolean);
        const menueWerkzeuge = [...MENUE_WERKZEUGE, ...zusatz].map(alsEintrag);
        const gepaeckEintrag = { key: 'gepaeck', view: 'gepaeck', label: t('gepaeck.menuAlle'), icon: rucksack, aliases: [], go: () => { onNavigate('gepaeck'); onClose(); } };
        const settingsEintrag = { key: 'settings', view: 'settings', label: t('common.settingsTitle'), icon: 'settings', aliases: [], go: () => { onNavigate('settings'); onClose(); } };
        // Die Suche im Menü findet weiterhin ALLE Werkzeuge (auch die im Gepäck).
        const allTools = [...WERKZEUGE.map(alsEintrag), gepaeckEintrag, settingsEintrag];

        // Search mode — flat filtered list
        if (q) {
          const results = [];

          // Dashboard
          if ((t('nav.dashboard') || 'Dashboard').toLowerCase().includes(q)) {
            results.push(navItem('dashboard', t('nav.dashboard'), 'dashboard',
              () => { onNavigate('dashboard'); onClose(); }, activeView === 'dashboard'));
          }

          // Chapters
          (chapters || []).forEach((ch, idx) => {
            const match = ch.title.toLowerCase().includes(q) ||
              (ch.description || '').toLowerCase().includes(q) ||
              ch.key.toLowerCase().includes(q);
            if (match) {
              const iconKey = chapterIcons[ch.key];
              results.push(navItem(ch.key, ch.title, iconKey,
                () => { onNavigate('chapter', idx); onClose(); },
                activeView === 'chapter' && activeChapter === idx));
            }
          });

          // Tools
          allTools.forEach(tool => {
            if (tool.label.toLowerCase().includes(q) || tool.key.toLowerCase().includes(q) || tool.aliases.some((a) => a.includes(q))) {
              results.push(navItem(tool.key, tool.label, tool.icon, tool.go, activeView === tool.view));
            }
          });

          if (results.length === 0) {
            results.push(React.createElement('div', {
              key: 'no-results',
              role: 'status',
              'aria-live': 'polite',
              style: { padding: '20px', textAlign: 'center', fontSize: text.sm, color: palette.mid }
            }, t('common.noResults') || 'Keine Ergebnisse'));
          }

          return results;
        }

        // Normal mode — grouped navigation
        // „Übersicht" nur zeigen, wenn KEIN Boden-Anker existiert. Am Handy trägt der
        // Anker (Bottom-Nav, Sackmesser) die Übersicht dauerhaft → hier weglassen, um
        // die Dopplung zu vermeiden. In der Web-Ansicht fehlt der Anker → Übersicht
        // bleibt im Menü, bis wir ein Web-Äquivalent haben (Stebler Studios). Die Suche oben
        // findet die Übersicht in beiden Fällen.
        return [
          !hasBottomAnchor && navItem('dashboard', t('nav.dashboard'), 'dashboard',
            () => { onNavigate('dashboard'); onClose(); },
            activeView === 'dashboard'
          ),

          // Chapters — tiered grouping
          ...[
            { label: t('dashboard.tierCore'), indices: [0, 1, 2] },
            { label: t('dashboard.tierSupporting'), indices: [3, 4] },
            { label: t('dashboard.tierProtective'), indices: [5, 6] },
          ].map((tier, tierIdx) =>
            React.createElement('div', {
              key: 'tier-' + tierIdx,
              style: {
                padding: tierIdx === 0 ? '8px 0 4px 0' : '4px 0',
                borderBottom: tierIdx === 2 ? '1px solid ' + palette.border : 'none',
              }
            },
              React.createElement('div', {
                style: {
                  fontSize: text.xs, fontWeight: weight.medium, color: palette.soft,
                  padding: tierIdx === 0 ? '8px 20px 4px 20px' : '12px 20px 4px 20px',
                  letterSpacing: '0.3px',
                }
              }, tier.label),
              ...(tier.indices.map(idx => {
                const ch = (chapters || [])[idx];
                if (!ch) return null;
                const iconKey = chapterIcons[ch.key];
                const isActive = activeView === 'chapter' && activeChapter === idx;
                return navItem(ch.key, ch.title, iconKey,
                  () => { onNavigate('chapter', idx); onClose(); },
                  isActive
                );
              }))
            )
          ),

          // Tools
          React.createElement('div', {
            key: 'tools-header',
            style: { fontSize: text.xs - 1, fontWeight: weight.semi, color: palette.mid, padding: space.md + 'px 20px ' + space.sm + 'px 20px', textTransform: 'uppercase', letterSpacing: '0.5px' }
          }, t('nav.tools')),

          ...menueWerkzeuge.map(tool => navItem(tool.key, tool.label, tool.icon, tool.go, activeView === tool.view)),
          navItem(gepaeckEintrag.key, gepaeckEintrag.label, gepaeckEintrag.icon, gepaeckEintrag.go, activeView === 'gepaeck'),

          React.createElement('div', { key: 'settings-sep', 'aria-hidden': 'true', style: { borderTop: '1px solid ' + palette.border, margin: space.sm + 'px 0 0' } }),
          navItem(settingsEintrag.key, settingsEintrag.label, settingsEintrag.icon, settingsEintrag.go, activeView === 'settings'),
        ];
      })(),

      // Spacer
      React.createElement('div', { style: { flex: 1 } }),

      // Footer
      React.createElement('div', {
        style: { padding: '16px 20px', borderTop: '1px solid ' + palette.border, fontSize: text.xs, color: palette.soft }
      }, t('nav.privacyNote'))
    )
  );

};

export default MobileNav;
