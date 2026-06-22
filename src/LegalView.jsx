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
    }, Array.isArray(children) ? children.map((c, i) => React.cloneElement(c, { key: i })) : children)
  );

const P = ({ children }) =>
  React.createElement('p', { style: { margin: '0 0 8px 0' } }, children);

export const LegalView = ({ palette, t, onNavigate, section }) => {
  const activeSection = section || 'privacy';

  const tabs = [
    { key: 'privacy', label: t('legal.tabs.privacy') },
    { key: 'terms', label: t('legal.tabs.terms') },
    { key: 'imprint', label: t('legal.tabs.imprint') },
    { key: 'license', label: t('legal.tabs.license') },
    { key: 'ethics', label: t('legal.tabs.ethics') },
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
        fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: space.xs,
      }
    }, '← ' + t('common.back')),

    // Title
    React.createElement('h2', {
      style: {
        fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md,
        letterSpacing: '0.2px',
      }
    }, t('legal.title')),

    // Tabs
    React.createElement('div', {
      style: {
        display: 'flex', gap: space.xs, marginBottom: space.lg,
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

    // ─── Privacy / Datenschutz (nDSG) ─────────────────────────
    activeSection === 'privacy' && React.createElement('div', null,
      Section({ title: t('legal.privacy.responsibleTitle'), palette, children: [
        P({ children: t('legal.privacy.responsible1') }),
        P({ children: t('legal.privacy.responsible2') }),
        P({ children: t('legal.privacy.responsible3') }),
      ]}),
      Section({ title: t('legal.privacy.localTitle'), palette, children: [
        P({ children: t('legal.privacy.local1') }),
        P({ children: t('legal.privacy.local2') }),
        P({ children: t('legal.privacy.local3') }),
      ]}),
      Section({ title: t('legal.privacy.dataTitle'), palette, children: [
        P({ children: t('legal.privacy.data1') }),
        P({ children: t('legal.privacy.data2') }),
        P({ children: t('legal.privacy.data3') }),
        P({ children: t('legal.privacy.data4') }),
      ]}),
      Section({ title: t('legal.privacy.sensitiveTitle'), palette, children: [
        P({ children: t('legal.privacy.sensitive1') }),
        P({ children: t('legal.privacy.sensitive2') }),
      ]}),
      Section({ title: t('legal.privacy.hostingTitle'), palette, children: [
        P({ children: t('legal.privacy.hosting1') }),
        P({ children: t('legal.privacy.hosting2') }),
      ]}),
      Section({ title: t('legal.privacy.backupTitle'), palette, children: [
        P({ children: t('legal.privacy.backup1') }),
      ]}),
      Section({ title: t('legal.privacy.rightsTitle'), palette, children: [
        P({ children: t('legal.privacy.rights1') }),
        P({ children: t('legal.privacy.rights2') }),
        P({ children: t('legal.privacy.rights3') }),
      ]}),
      Section({ title: t('legal.privacy.securityTitle'), palette, children: [
        P({ children: t('legal.privacy.security1') }),
        P({ children: t('legal.privacy.security2') }),
      ]}),
      Section({ title: t('legal.privacy.cookiesTitle'), palette, children: [
        P({ children: t('legal.privacy.cookies1') }),
      ]}),
      Section({ title: t('legal.privacy.notificationsTitle'), palette, children: [
        P({ children: t('legal.privacy.notifications1') }),
      ]}),
      Section({ title: t('legal.privacy.supervisoryTitle'), palette, children: [
        P({ children: t('legal.privacy.supervisory1') }),
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
      ]}),
      Section({ title: t('legal.imprint.jurisdictionTitle'), palette, children: [
        P({ children: t('legal.imprint.jurisdiction1') }),
      ]})
    ),

    // ─── License / Lizenz ─────────────────────────────────
    activeSection === 'license' && React.createElement('div', null,
      Section({ title: t('legal.license.agplTitle'), palette, children: [
        P({ children: t('legal.license.agpl1') }),
        P({ children: t('legal.license.agpl2') }),
        P({ children: t('legal.license.agpl3') }),
        P({ children: t('legal.license.agpl4') }),
      ]}),
      Section({ title: t('legal.license.dualTitle'), palette, children: [
        P({ children: t('legal.license.dual1') }),
        P({ children: t('legal.license.dual2') }),
      ]}),
      Section({ title: t('legal.license.trademarkTitle'), palette, children: [
        P({ children: t('legal.license.trademark1') }),
      ]}),
      Section({ title: t('legal.license.sourceTitle'), palette, children: [
        P({ children: t('legal.license.source1') }),
      ]}),
      Section({ title: t('legal.license.thirdPartyTitle'), palette, children: [
        P({ children: t('legal.license.thirdParty1') }),
      ]})
    ),

    // ─── Ethics & Sustainability / Ethik & Nachhaltigkeit ────
    activeSection === 'ethics' && React.createElement('div', null,
      Section({ title: t('legal.ethics.valuesTitle'), palette, children: [
        P({ children: t('legal.ethics.values1') }),
        P({ children: t('legal.ethics.values2') }),
        P({ children: t('legal.ethics.values3') }),
        P({ children: t('legal.ethics.values4') }),
      ]}),
      Section({ title: t('legal.ethics.principlesTitle'), palette, children: [
        P({ children: t('legal.ethics.principles1') }),
        P({ children: t('legal.ethics.principles2') }),
        P({ children: t('legal.ethics.principles3') }),
        P({ children: t('legal.ethics.principles4') }),
        P({ children: t('legal.ethics.principles5') }),
      ]}),
      Section({ title: t('legal.ethics.noTitle'), palette, children: [
        P({ children: t('legal.ethics.no1') }),
        P({ children: t('legal.ethics.no2') }),
        P({ children: t('legal.ethics.no3') }),
      ]}),
      Section({ title: t('legal.ethics.sustainTitle'), palette, children: [
        P({ children: t('legal.ethics.sustain1') }),
        P({ children: t('legal.ethics.sustain2') }),
        P({ children: t('legal.ethics.sustain3') }),
        P({ children: t('legal.ethics.sustain4') }),
      ]}),
      Section({ title: t('legal.ethics.contactTitle'), palette, children: [
        P({ children: t('legal.ethics.contact1') }),
        P({ children: t('legal.ethics.contact2') }),
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
