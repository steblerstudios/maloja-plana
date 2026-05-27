import React, { useState } from 'react';
import Icons from './IconSystem.jsx';
import { text, weight, space } from './config/tokens.js';

// ─── Mobile Navigation ────────────────────────────────────
// Slide-in drawer with SVG pictograms and calmer visual hierarchy.

export const MobileNav = ({ palette, t, isOpen, onClose, onNavigate, activeChapter, activeView, chapters, completion }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  if (!isOpen) return null;

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
        transition: 'background 0.15s',
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
        position: 'fixed', left: 0, top: 0, bottom: 0, width: '280px',
        background: palette.surface, borderRight: '1px solid ' + palette.border,
        zIndex: 999, overflowY: 'auto', animation: 'slideIn 0.25s',
        display: 'flex', flexDirection: 'column',
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

      // Dashboard
      navItem('dashboard', t('nav.dashboard'), 'dashboard',
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
              fontSize: '10px', fontWeight: '500', color: palette.soft,
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
        style: { fontSize: text.xs - 1, fontWeight: weight.semi, color: palette.mid, padding: space.md + 'px 20px ' + space.sm + 'px 20px', textTransform: 'uppercase', letterSpacing: '0.5px' }
      }, t('nav.tools')),

      ...[
        { key: 'tresor', label: t('nav.tresor'), icon: 'document' },
        { key: 'kk', label: t('nav.kkScanner'), icon: 'barcode' },
        { key: 'budget', label: t('nav.budget'), icon: 'csv' },
        { key: 'schulden', label: t('nav.debts'), icon: 'debt' },
        { key: 'tax', label: t('nav.taxes'), icon: 'money' },
        { key: 'organ', label: t('nav.organDonation'), icon: 'health' },
      ].map(tool => navItem(tool.key, tool.label, tool.icon,
        () => { onNavigate(tool.key); onClose(); },
        activeView === tool.key
      )),

      // Advanced — collapsed behind disclosure
      React.createElement('button', {
        key: 'advanced-toggle',
        onClick: () => setShowAdvanced(!showAdvanced),
        style: {
          width: '100%', background: 'none', border: 'none',
          borderTop: '1px solid ' + palette.border, marginTop: '8px',
          padding: '14px 20px', cursor: 'pointer',
          fontSize: text.xs, color: palette.soft, fontFamily: 'inherit',
          textAlign: 'left', letterSpacing: '0.3px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }
      },
        React.createElement('span', { style: { fontSize: '9px', transition: 'transform 0.2s', transform: showAdvanced ? 'rotate(90deg)' : 'none' } }, '▸'),
        t('nav.moreTools')
      ),

      ...(showAdvanced ? [
        { key: 'calendar', label: t('nav.calendar'), icon: 'calendar' },
        { key: 'sync', label: t('nav.budgetSync'), icon: 'money' },
        { key: 'premium', label: t('nav.kvgIpv'), icon: 'health' },
        { key: 'sozialhilfe', label: t('nav.sozialhilfe'), icon: 'document' },
        { key: 'cv', label: t('nav.cv'), icon: 'document' },
        { key: 'charts', label: t('nav.charts'), icon: 'dashboard' },
        { key: 'export', label: t('nav.export'), icon: 'download' },
        { key: 'notifications', label: t('nav.notifications'), icon: 'settings' },
      ].map(tool => navItem(tool.key, tool.label, tool.icon,
        () => { onNavigate(tool.key); onClose(); },
        activeView === tool.key
      )) : []),

      // Spacer
      React.createElement('div', { style: { flex: 1 } }),

      // Footer
      React.createElement('div', {
        style: { padding: '16px 20px', borderTop: '1px solid ' + palette.border, fontSize: '10px', color: palette.soft }
      }, '100% local. No data leaves your device.')
    )
  );

};

export default MobileNav;
