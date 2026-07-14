import React, { useState } from 'react';
import Icons from './IconSystem.jsx';
import { text, weight, space, radius, shadow, ease, duration } from './config/tokens.js';
import { CONTROL_LABELS, groupSettingsControls } from './settingsGroups.js';

// ─── Mobile Navigation ────────────────────────────────────
// Slide-in drawer with SVG pictograms and calmer visual hierarchy.

export const MobileNav = ({ palette, t, isOpen, onClose, onNavigate, activeChapter, activeView, chapters, completion, settingsControls, settingsLabel, onStartTour, mode = 'nav', hasBottomAnchor = false, leftHand = false }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
      style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.45)', zIndex: 998, animation: 'fadeIn 0.2s' },
      onClick: onClose,
      onKeyDown: (e) => { if (e.key === 'Escape') onClose(); },
    },
      React.createElement('nav', {
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
    const IconFn = Icons[iconKey];
    if (!IconFn) return null;
    return React.createElement('div', { style: { width: size || '16px', height: size || '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, IconFn());
  };

  const navItem = (key, label, iconKey, onClick, isActive) =>
    React.createElement('button', {
      key: key,
      onClick: onClick,
      style: {
        width: '100%',
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

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return React.createElement('div', {
    style: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.45)', zIndex: 998,
      animation: 'fadeIn 0.2s',
    },
    onClick: onClose,
    onKeyDown: handleKeyDown,
  },
    React.createElement('nav', {
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

      // Search
      React.createElement('div', {
        style: { padding: '12px 20px 8px 20px' }
      },
        React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', gap: '8px', background: palette.up, borderRadius: '8px', padding: '8px 12px', border: '1px solid ' + palette.border }
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

        const allTools = [
          { key: 'settings', label: t('common.settingsTitle'), icon: 'settings' },
          { key: 'finanzuebersicht', label: t('nav.finanzUebersicht'), icon: 'budget' },
          { key: 'situationen', label: t('lebenszustaende.pageTitle'), icon: 'health' },
          { key: 'unterlagen', label: t('nav.unterlagen'), icon: 'documents' },
          { key: 'tresor', label: t('nav.tresor'), icon: 'document' },
          { key: 'kk', label: t('nav.kkScanner'), icon: 'barcode' },
          { key: 'budget', label: t('nav.budget'), icon: 'csv' },
          { key: 'schulden', label: t('nav.debts'), icon: 'debt' },
          { key: 'tax', label: t('nav.taxes'), icon: 'money' },
          { key: 'sozialhilfe', label: t('nav.sozialhilfe'), icon: 'document' },
          { key: 'organ', label: t('nav.organDonation'), icon: 'health' },
          { key: 'calendar', label: t('nav.calendar'), icon: 'calendar' },
          { key: 'sync', label: t('nav.budgetSync'), icon: 'money' },
          { key: 'premium', label: t('nav.kvgIpv'), icon: 'health' },
          { key: 'cv', label: t('nav.cv'), icon: 'document' },
          { key: 'charts', label: t('nav.charts'), icon: 'chartsSchoko' },
          { key: 'export', label: t('nav.export'), icon: 'download' },
          { key: 'notifications', label: t('nav.notifications'), icon: 'cowbell' },
        ];

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
            if (tool.label.toLowerCase().includes(q) || tool.key.toLowerCase().includes(q)) {
              results.push(navItem(tool.key, tool.label, tool.icon,
                () => { onNavigate(tool.key); onClose(); }, activeView === tool.key));
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

          ...allTools.slice(0, 9).map(tool => navItem(tool.key, tool.label, tool.icon,
            () => { onNavigate(tool.key); onClose(); },
            activeView === tool.key
          )),

          // Advanced — collapsed behind disclosure
          React.createElement('button', {
            key: 'advanced-toggle',
            onClick: () => setShowAdvanced(!showAdvanced),
            style: {
              width: '100%', background: 'none', border: 'none',
              borderTop: '1px solid ' + palette.border, marginTop: space.sm,
              padding: '14px 20px', cursor: 'pointer',
              fontSize: text.xs, color: palette.soft, fontFamily: 'inherit',
              textAlign: 'left', letterSpacing: '0.3px',
              display: 'flex', alignItems: 'center', gap: space.sm,
            }
          },
            React.createElement('span', { style: { fontSize: '9px', transition: `transform ${duration.normal}ms ${ease}`, transform: showAdvanced ? 'rotate(90deg)' : 'none' } }, '▸'),
            t('nav.moreTools')
          ),

          ...(showAdvanced ? allTools.slice(9).map(tool => navItem(tool.key, tool.label, tool.icon,
            () => { onNavigate(tool.key); onClose(); },
            activeView === tool.key
          )) : []),
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
