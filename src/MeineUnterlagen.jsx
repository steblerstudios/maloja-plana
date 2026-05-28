import React from 'react';
import { Icon } from './IconSystem.jsx';

// Dossier card — a calm folder-like entry, not a button grid
const DossierCard = ({ palette, title, description, status, icon, onClick }) => {
  const isClickable = !!onClick;
  return React.createElement('div', {
    onClick: onClick,
    role: isClickable ? 'button' : undefined,
    tabIndex: isClickable ? 0 : undefined,
    onKeyDown: isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined,
    style: {
      padding: '20px', background: palette.up, borderRadius: '8px',
      border: '1px solid ' + palette.border, marginBottom: '12px',
      cursor: isClickable ? 'pointer' : 'default',
      transition: 'border-color 0.15s',
    }
  },
    React.createElement('div', {
      style: {
        display: 'flex', alignItems: 'flex-start', gap: '12px',
      }
    },
      React.createElement('div', {
        style: {
          flexShrink: 0, width: '32px', height: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isClickable ? palette.sand : palette.mid,
        }
      }, React.createElement(Icon, { name: icon, size: 22 })),
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', {
          style: { fontSize: '14px', fontWeight: '600', marginBottom: '4px' }
        }, title),
        React.createElement('div', {
          style: { fontSize: '12px', color: palette.mid, lineHeight: '1.5', marginBottom: '8px' }
        }, description),
        React.createElement('div', {
          style: {
            fontSize: '11px', color: palette.soft, fontStyle: isClickable ? 'normal' : 'italic',
          }
        }, status)
      ),
      // Arrow indicator for clickable cards
      isClickable && React.createElement('div', {
        style: { color: palette.soft, fontSize: '14px', alignSelf: 'center', flexShrink: 0 }
      }, '→')
    )
  );
};

export const MeineUnterlagen = ({ palette, t, onNavigate }) => {

  return React.createElement('div', {
    style: { maxWidth: '520px' }
  },

    // Title
    React.createElement('div', {
      style: {
        background: palette.surface, padding: '24px 20px', borderRadius: '8px',
        border: '1px solid ' + palette.border, marginBottom: '20px',
      }
    },
      React.createElement('h2', {
        style: {
          fontSize: '17px', fontWeight: '600', marginBottom: '6px',
          display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.2px',
        }
      }, React.createElement(Icon, { name: 'documents', size: 18 }), t('unterlagen.title')),
      React.createElement('div', {
        style: { fontSize: '13px', color: palette.mid, lineHeight: '1.5' }
      }, t('unterlagen.subtitle'))
    ),

    // Dossier cards
    React.createElement(DossierCard, {
      palette,
      title: t('unterlagen.dossier.lebensmappe.title'),
      description: t('unterlagen.dossier.lebensmappe.description'),
      status: t('lebensmappe.openDossier'),
      icon: 'home',
      onClick: () => onNavigate('lebensmappe'),
    }),

    React.createElement(DossierCard, {
      palette,
      title: t('unterlagen.dossier.notfall.title'),
      description: t('unterlagen.dossier.notfall.description'),
      status: t('unterlagen.dossier.notfall.status'),
      icon: 'emergency',
    }),

    React.createElement(DossierCard, {
      palette,
      title: t('unterlagen.dossier.behoerden.title'),
      description: t('unterlagen.dossier.behoerden.description'),
      status: t('unterlagen.dossier.behoerden.status'),
      icon: 'legal',
    }),

    // Separator
    React.createElement('div', {
      style: { borderTop: '1px solid ' + palette.border, margin: '20px 0' }
    }),

    // Backup section — links to existing backup view
    React.createElement('div', {
      style: {
        padding: '20px', background: palette.surface, borderRadius: '8px',
        border: '1px solid ' + palette.border, marginBottom: '12px',
      }
    },
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'flex-start', gap: '12px' }
      },
        React.createElement('div', {
          style: {
            flexShrink: 0, width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: palette.mid,
          }
        }, React.createElement(Icon, { name: 'lock', size: 22 })),
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', {
            style: { fontSize: '14px', fontWeight: '600', marginBottom: '4px' }
          }, t('unterlagen.backup.title')),
          React.createElement('div', {
            style: { fontSize: '12px', color: palette.mid, lineHeight: '1.5', marginBottom: '10px' }
          }, t('unterlagen.backup.description')),
          React.createElement('button', {
            onClick: () => onNavigate('export'),
            style: {
              padding: '8px 14px', background: palette.up,
              color: palette.mid, border: '1px solid ' + palette.border,
              borderRadius: '6px', cursor: 'pointer', fontSize: '12px',
            }
          }, t('unterlagen.backup.action'))
        )
      )
    ),

    // Privacy note
    React.createElement('div', {
      style: {
        marginTop: '8px', fontSize: '10px', color: palette.soft, lineHeight: '1.4',
      }
    }, '○ ' + t('unterlagen.note'))
  );
};

export default MeineUnterlagen;
