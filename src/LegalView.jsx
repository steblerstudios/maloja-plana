import React from 'react';
import { text, weight, leading, space, radius } from './config/tokens.js';

const Section = ({ title, children, palette }) =>
  React.createElement('div', {
    style: { marginBottom: '28px' }
  },
    React.createElement('h3', {
      style: {
        fontSize: text.body, fontWeight: weight.semi, color: palette.text,
        marginBottom: space.sm, letterSpacing: '0.2px',
        paddingBottom: space.sm, borderBottom: '1px solid ' + palette.border,
      }
    }, title),
    React.createElement('div', {
      style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed }
    }, children)
  );

const P = ({ children }) =>
  React.createElement('p', { style: { margin: '0 0 8px 0' } }, children);

export const LegalView = ({ palette, t, onNavigate, section }) => {
  const activeSection = section || 'privacy';

  const tabs = [
    { key: 'privacy', label: t('legal.tabs.privacy') },
    { key: 'terms', label: t('legal.tabs.terms') },
    { key: 'imprint', label: t('legal.tabs.imprint') },
  ];

  return React.createElement('div', {
    style: { maxWidth: '600px', margin: '0 auto' }
  },
    // Back
    React.createElement('button', {
      onClick: () => onNavigate('dashboard'),
      style: {
        background: 'none', border: 'none', cursor: 'pointer',
        color: palette.mid, fontSize: text.sm, padding: '0 0 16px 0',
        fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px',
      }
    }, '← ' + t('common.back')),

    // Title
    React.createElement('h2', {
      style: {
        fontSize: '17px', fontWeight: weight.semi, marginBottom: space.md,
        letterSpacing: '0.2px',
      }
    }, t('legal.title')),

    // Tabs
    React.createElement('div', {
      style: {
        display: 'flex', gap: '4px', marginBottom: '24px',
        borderBottom: '1px solid ' + palette.border, paddingBottom: '12px',
        flexWrap: 'wrap',
      }
    },
      tabs.map(tab =>
        React.createElement('button', {
          key: tab.key,
          onClick: () => onNavigate('legal', undefined, tab.key),
          style: {
            padding: space.sm + 'px ' + space.md + 'px',
            background: activeSection === tab.key ? palette.sand : 'transparent',
            color: activeSection === tab.key ? '#000' : palette.text,
            border: 'none',
            borderRadius: radius.sm + 'px ' + radius.sm + 'px 0 0',
            cursor: 'pointer',
            fontWeight: activeSection === tab.key ? weight.semi : weight.normal,
            fontSize: text.sm,
            fontFamily: 'inherit',
          }
        }, tab.label)
      )
    ),

    // ─── Privacy / Datenschutz ──────────────────────────────
    activeSection === 'privacy' && React.createElement('div', null,
      Section({ title: t('legal.privacy.localTitle'), palette, children: [
        P({ children: t('legal.privacy.local1') }),
        P({ children: t('legal.privacy.local2') }),
        P({ children: t('legal.privacy.local3') }),
      ]}),
      Section({ title: t('legal.privacy.noServerTitle'), palette, children: [
        P({ children: t('legal.privacy.noServer1') }),
        P({ children: t('legal.privacy.noServer2') }),
      ]}),
      Section({ title: t('legal.privacy.backupTitle'), palette, children: [
        P({ children: t('legal.privacy.backup1') }),
      ]}),
      Section({ title: t('legal.privacy.deletionTitle'), palette, children: [
        P({ children: t('legal.privacy.deletion1') }),
      ]}),
      Section({ title: t('legal.privacy.analyticsTitle'), palette, children: [
        P({ children: t('legal.privacy.analytics1') }),
      ]})
    ),

    // ─── Terms / Nutzungsbedingungen ────────────────────────
    activeSection === 'terms' && React.createElement('div', null,
      Section({ title: t('legal.terms.scopeTitle'), palette, children: [
        P({ children: t('legal.terms.scope1') }),
        P({ children: t('legal.terms.scope2') }),
      ]}),
      Section({ title: t('legal.terms.noAdviceTitle'), palette, children: [
        P({ children: t('legal.terms.noAdvice1') }),
        P({ children: t('legal.terms.noAdvice2') }),
        P({ children: t('legal.terms.noAdvice3') }),
      ]}),
      Section({ title: t('legal.terms.accuracyTitle'), palette, children: [
        P({ children: t('legal.terms.accuracy1') }),
        P({ children: t('legal.terms.accuracy2') }),
      ]}),
      Section({ title: t('legal.terms.responsibilityTitle'), palette, children: [
        P({ children: t('legal.terms.responsibility1') }),
      ]})
    ),

    // ─── Imprint / Impressum ────────────────────────────────
    activeSection === 'imprint' && React.createElement('div', null,
      Section({ title: t('legal.imprint.operatorTitle'), palette, children: [
        P({ children: t('legal.imprint.operator1') }),
        P({ children: t('legal.imprint.operator2') }),
      ]}),
      Section({ title: t('legal.imprint.contactTitle'), palette, children: [
        P({ children: t('legal.imprint.contact1') }),
        P({ children: t('legal.imprint.contact2') }),
      ]}),
      Section({ title: t('legal.imprint.projectTitle'), palette, children: [
        P({ children: t('legal.imprint.project1') }),
      ]}),
      Section({ title: t('legal.imprint.disclaimerTitle'), palette, children: [
        P({ children: t('legal.imprint.disclaimer1') }),
      ]})
    ),

    // Footer
    React.createElement('div', {
      style: {
        marginTop: '32px', paddingTop: '16px',
        borderTop: '1px solid ' + palette.border,
        fontSize: text.xs, color: palette.soft, lineHeight: leading.relaxed,
      }
    }, t('legal.lastUpdated'))
  );
};

export default LegalView;
